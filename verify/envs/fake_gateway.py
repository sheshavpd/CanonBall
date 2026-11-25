"""VE-002's fake payment gateway.

Behaves as ASM-011 says the real one does: it pays at most once per request key, and a second
payout with a key it has already paid returns the original payout. It can simulate three
failures: a refusal, a duplicate request, and a lost reply (it pays, and the reply never arrives).
"""
from __future__ import annotations

import threading

from refunds.adapters.gateway import Gateway, Payout, PayoutRefused, ReplyLost


class FakeGateway(Gateway):
    def __init__(self):
        self._lock = threading.Lock()
        self._by_key: dict[str, Payout] = {}
        self._transfers: list[Payout] = []
        self.calls = 0
        self._refuse = 0
        self._duplicate = 0
        self._lose_reply = 0

    # the gateway, as the service sees it

    def pay(self, request_key: str, order_id: int, amount_cents: int) -> Payout:
        with self._lock:
            copies = 2 if self._duplicate else 1
            self._duplicate = max(0, self._duplicate - 1)
        payout = None
        for _ in range(copies):
            payout = self._receive(request_key, order_id, amount_cents)
        return payout

    def _receive(self, request_key: str, order_id: int, amount_cents: int) -> Payout:
        with self._lock:
            self.calls += 1
            if self._refuse:
                self._refuse -= 1
                raise PayoutRefused(request_key)
            payout = self._by_key.get(request_key)
            if payout is None:
                payout = Payout(f"po-{len(self._transfers) + 1}", request_key, order_id, amount_cents)
                self._by_key[request_key] = payout
                self._transfers.append(payout)
            if self._lose_reply:
                self._lose_reply -= 1
                raise ReplyLost(request_key)
            return payout

    # perturb: failures the fake can simulate

    def refuse(self, times: int = 1) -> None:
        """Refuse the next `times` payouts."""
        with self._lock:
            self._refuse += times

    def duplicate(self, times: int = 1) -> None:
        """Deliver each of the next `times` payout requests twice, as a network that resends would."""
        with self._lock:
            self._duplicate += times

    def lose_reply(self, times: int = 1) -> None:
        """Pay the next `times` payout requests, and lose the reply to each."""
        with self._lock:
            self._lose_reply += times

    # observe: what the gateway paid

    def payouts(self, order: int | None = None) -> list[Payout]:
        """Every transfer the gateway made, for one order or for all."""
        with self._lock:
            return [p for p in self._transfers if order is None or p.order_id == order]
