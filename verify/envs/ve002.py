"""VE-002 payments-sandbox: the refunds service, a real local store, and a fake payment gateway.

The declaration is spec/blueprint/environments/VE-002.md. One command up, one command down:

    with World() as world:          # up: an empty store, a fresh gateway, a decision log
        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 1))
        refund = world.act.request_refund(order, 12000, key="r-1")
        paid = world.observe.gateway.payouts(order=order)
                                    # down: the store and the log are gone

The four verbs:
    rig       starting state: orders, existing refunds, partly refunded orders, today's date
    act       the service API (refunds.service.Service)
    perturb   failures: perturb.gateway.refuse(), .duplicate(), .lose_reply()
    observe   what happened: observe.gateway.payouts(), observe.store, observe.decisions()
"""
from __future__ import annotations

import datetime as dt
import json
import random
import shutil
import tempfile
import threading
from pathlib import Path
from types import SimpleNamespace

from refunds.adapters.decision_log import DecisionLog
from refunds.adapters.store import Store
from refunds.decide import Order
from refunds.service import Service
from verify.envs.fake_gateway import FakeGateway

DEFAULT_TODAY = dt.date(2026, 3, 10)


class Rig:
    """Starting state."""

    def __init__(self, world: "World"):
        self._world = world
        self._next_order = 1000

    def today(self, day: dt.date) -> None:
        """Set the date the service sees as today."""
        self._world._today = day

    def order(self, order_id: int | None = None, total_cents: int = 15000,
              dispatched_on: dt.date | None = None, delivered_on: dt.date | None = None) -> int:
        """An order. Dispatched three days before today unless given; delivered on the day of dispatch unless given."""
        if order_id is None:
            self._next_order += 1
            order_id = self._next_order
        dispatched_on = dispatched_on or self._world._today - dt.timedelta(days=3)
        delivered_on = delivered_on or dispatched_on
        self._world.store.add_order(Order(order_id, total_cents, dispatched_on, delivered_on))
        return order_id

    def refund(self, order: int, amount_cents: int, state: str = "in_review",
               reviewer: str | None = None, key: str | None = None) -> int:
        """A refund already on the order: waiting for review ("in_review"), waiting for payout
        ("approved"), or paid before this world started ("paid"), which makes the order partly refunded.
        A paid refund is in the store only; this world's gateway has not paid it."""
        if state not in ("in_review", "approved", "paid"):
            raise ValueError(f"VE-002 cannot set up a refund in state {state!r}")
        key = key or f"rig-{order}-{len(self._world.store.refunds(order)) + 1}"
        payout_id = f"earlier-{key}" if state == "paid" else None
        return self._world.store.add_refund(order, key, amount_cents, state, reviewed_by=reviewer,
                                            payout_id=payout_id).id

    def partly_refunded_order(self, refunded_cents: int, **order) -> int:
        """An order that has already been partly refunded: one refund of `refunded_cents`, paid."""
        order_id = self.order(**order)
        self.refund(order_id, refunded_cents, state="paid")
        return order_id


class Observe:
    """What happened. Read-only."""

    def __init__(self, world: "World"):
        self._world = world
        self.gateway = SimpleNamespace(payouts=world.gateway.payouts)
        self.store = SimpleNamespace(refund=world.store.refund, refunds=world.store.refunds)

    def decisions(self, order: int | None = None) -> list[dict]:
        """The decision log lines, for one order or for all."""
        path = self._world.decision_log
        if not path.exists():
            return []
        lines = [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
        return [d for d in lines if order is None or d["order"] == order]


class World:
    """One VE-002 world. Constructing it is the command up; close() is the command down."""

    def __init__(self, seed: int = 2, decision_log: str | Path | None = None):
        self._tmp = tempfile.mkdtemp(prefix="ve002-")
        self._today = DEFAULT_TODAY
        rng = random.Random(seed)
        self.decision_log = Path(decision_log) if decision_log else Path(self._tmp) / "decisions.jsonl"
        self.store = Store(":memory:")
        self.gateway = FakeGateway()
        self.act = Service(self.store, self.gateway, DecisionLog(self.decision_log),
                           today=lambda: self._today, new_trace=lambda: f"{rng.getrandbits(64):016x}")
        self.rig = Rig(self)
        self.perturb = SimpleNamespace(gateway=SimpleNamespace(
            refuse=self.gateway.refuse, duplicate=self.gateway.duplicate, lose_reply=self.gateway.lose_reply))
        self.observe = Observe(self)

    def close(self) -> None:
        self.store.close()
        shutil.rmtree(self._tmp, ignore_errors=True)

    def __enter__(self) -> "World":
        return self

    def __exit__(self, *_exc) -> None:
        self.close()


def at_once(*calls):
    """Run the calls on separate threads, released together, and return their results in order."""
    barrier = threading.Barrier(len(calls))
    results: list = [None] * len(calls)
    errors: list[BaseException] = []

    def run(i, call):
        barrier.wait()
        try:
            results[i] = call()
        except BaseException as e:  # noqa: BLE001 - re-raised below, on the calling thread
            errors.append(e)

    threads = [threading.Thread(target=run, args=(i, c)) for i, c in enumerate(calls)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    if errors:
        raise errors[0]
    return results
