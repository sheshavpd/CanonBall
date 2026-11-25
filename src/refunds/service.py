"""The refunds service: the imperative shell around the decision logic.

It reads from the store, calls decide_refund, logs the decision, records the refund, and moves
money through the gateway. Every rule about whether a refund may be paid lives in decide.py,
except the payout limit (ENV-003), which is enforced here, where money leaves.
"""
from __future__ import annotations

import datetime as dt
import uuid
from typing import Callable

from refunds.adapters.decision_log import DecisionLog
from refunds.adapters.gateway import Gateway, PayoutRefused, ReplyLost
from refunds.adapters.store import Refund, Store
from refunds.decide import decide_refund

PAYOUT_RETRIES = 3                      # retries after a lost reply, all with the same request key
REVIEW_REQUIRED_ABOVE_CENTS = 1_000_000  # ENV-003: no payout above $10,000 without review


class Service:
    def __init__(self, store: Store, gateway: Gateway, decisions: DecisionLog,
                 today: Callable[[], dt.date] = dt.date.today,
                 new_trace: Callable[[], str] = lambda: uuid.uuid4().hex):
        self.store = store
        self.gateway = gateway
        self.decisions = decisions
        self.today = today
        self.new_trace = new_trace

    def request_refund(self, order_id: int, amount_cents: int, key: str) -> Refund:
        """A customer asks for `amount_cents` back on an order. `key` is the request key."""
        existing = self.store.refund_by_key(key)
        if existing is not None:
            return existing  # the same request again: INV-004
        order = self.store.order(order_id)
        refunded = self.store.total_paid(order_id)
        decision = decide_refund(order, amount_cents, refunded, self.today())
        self.decisions.write(order_id, decision, self.new_trace())
        return self.store.add_refund(order_id, key, amount_cents, decision.result)

    def approve(self, refund_id: int, reviewer: str) -> Refund:
        """The review path: a person approves a refund in review, and it is paid."""
        self.store.mark_reviewed(refund_id, reviewer)
        return self.pay(refund_id)

    def pay(self, refund_id: int) -> Refund:
        """Pay an approved refund through the gateway. The only path by which money leaves."""
        refund = self.store.refund(refund_id)
        if refund.amount_cents > REVIEW_REQUIRED_ABOVE_CENTS and not refund.reviewed_by:
            return refund  # ENV-003: held until a person reviews it
        if not self.store.claim_for_payout(refund_id):
            return self.store.refund(refund_id)  # not approved, or another caller is paying it
        state, payout_id = self._send(refund)
        self.store.finish_payout(refund_id, state, payout_id)
        return self.store.refund(refund_id)

    def _send(self, refund: Refund) -> tuple[str, str | None]:
        """Send the payout, retrying a lost reply with the same request key (ASM-011)."""
        for attempt in range(1 + PAYOUT_RETRIES):
            try:
                payout = self.gateway.pay(refund.request_key, refund.order_id, refund.amount_cents)
                return "paid", payout.id
            except ReplyLost:
                continue  # the gateway may have paid; asking again with the same key finds the payout
            except PayoutRefused:
                return "payout_refused", None
        return "payout_unknown", None
