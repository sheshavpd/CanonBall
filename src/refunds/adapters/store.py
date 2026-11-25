"""The store: orders and refunds, in SQLite.

A file in production. In VE-002 it runs in memory: a real store, with nothing to clean up.
Safe to share between threads; every method holds one lock for its whole read or write.
"""
from __future__ import annotations

import datetime as dt
import sqlite3
import threading
from dataclasses import dataclass

from refunds.decide import Order

SCHEMA = """
CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY,
    total_cents   INTEGER NOT NULL,
    dispatched_on TEXT NOT NULL,
    delivered_on  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS refunds (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER NOT NULL REFERENCES orders(id),
    request_key  TEXT NOT NULL UNIQUE,
    amount_cents INTEGER NOT NULL,
    state        TEXT NOT NULL,
    reviewed_by  TEXT,
    payout_id    TEXT
);
"""

# The states of a refund:
#   in_review       waiting for a person's review
#   refused         the decision logic refused it
#   approved        approved, not yet sent to the gateway
#   paying          one payout attempt sequence is under way
#   paid            the gateway confirmed a payout
#   payout_refused  the gateway refused the payout
#   payout_unknown  every reply was lost; the gateway may or may not have paid


@dataclass(frozen=True)
class Refund:
    id: int
    order_id: int
    request_key: str
    amount_cents: int
    state: str
    reviewed_by: str | None
    payout_id: str | None


class Store:
    def __init__(self, path: str = ":memory:"):
        self._db = sqlite3.connect(path, check_same_thread=False, isolation_level=None)
        self._lock = threading.RLock()
        with self._lock:
            self._db.executescript(SCHEMA)

    def close(self) -> None:
        with self._lock:
            self._db.close()

    # orders

    def add_order(self, order: Order) -> None:
        with self._lock:
            self._db.execute(
                "INSERT INTO orders (id, total_cents, dispatched_on, delivered_on) VALUES (?, ?, ?, ?)",
                (order.id, order.total_cents, order.dispatched_on.isoformat(), order.delivered_on.isoformat()))

    def order(self, order_id: int) -> Order:
        with self._lock:
            row = self._db.execute(
                "SELECT id, total_cents, dispatched_on, delivered_on FROM orders WHERE id = ?", (order_id,)).fetchone()
        if row is None:
            raise KeyError(f"no order {order_id}")
        return Order(row[0], row[1], dt.date.fromisoformat(row[2]), dt.date.fromisoformat(row[3]))

    # refunds

    def add_refund(self, order_id: int, request_key: str, amount_cents: int, state: str,
                   reviewed_by: str | None = None, payout_id: str | None = None) -> Refund:
        """Record a refund, or return the one already recorded under this request key."""
        with self._lock:
            self._db.execute(
                "INSERT INTO refunds (order_id, request_key, amount_cents, state, reviewed_by, payout_id) "
                "VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (request_key) DO NOTHING",
                (order_id, request_key, amount_cents, state, reviewed_by, payout_id))
            return self.refund_by_key(request_key)

    def refund(self, refund_id: int) -> Refund:
        with self._lock:
            row = self._db.execute(f"SELECT {_COLUMNS} FROM refunds WHERE id = ?", (refund_id,)).fetchone()
        if row is None:
            raise KeyError(f"no refund {refund_id}")
        return Refund(*row)

    def refund_by_key(self, request_key: str) -> Refund | None:
        with self._lock:
            row = self._db.execute(f"SELECT {_COLUMNS} FROM refunds WHERE request_key = ?", (request_key,)).fetchone()
        return Refund(*row) if row else None

    def refunds(self, order_id: int) -> list[Refund]:
        with self._lock:
            rows = self._db.execute(f"SELECT {_COLUMNS} FROM refunds WHERE order_id = ? ORDER BY id", (order_id,))
            return [Refund(*r) for r in rows.fetchall()]

    def total_refunded(self, order_id: int) -> int:
        """The sum of the refunds on an order that are not refused: in review, approved, being paid or paid."""
        with self._lock:
            row = self._db.execute(
                "SELECT COALESCE(SUM(amount_cents), 0) FROM refunds WHERE order_id = ? AND state != 'refused'",
                (order_id,)).fetchone()
        return row[0]

    def mark_reviewed(self, refund_id: int, reviewer: str) -> bool:
        """in_review -> approved, recording who reviewed it. False if the refund was not in review."""
        with self._lock:
            cur = self._db.execute(
                "UPDATE refunds SET state = 'approved', reviewed_by = ? WHERE id = ? AND state = 'in_review'",
                (reviewer, refund_id))
            return cur.rowcount == 1

    def claim_for_payout(self, refund_id: int) -> bool:
        """approved -> paying, for exactly one caller. False if someone else claimed it, or it is not approved."""
        with self._lock:
            cur = self._db.execute("UPDATE refunds SET state = 'paying' WHERE id = ? AND state = 'approved'",
                                   (refund_id,))
            return cur.rowcount == 1

    def finish_payout(self, refund_id: int, state: str, payout_id: str | None) -> None:
        with self._lock:
            self._db.execute("UPDATE refunds SET state = ?, payout_id = ? WHERE id = ? AND state = 'paying'",
                             (state, payout_id, refund_id))


_COLUMNS = "id, order_id, request_key, amount_cents, state, reviewed_by, payout_id"
