"""Decision logic for refunds.

Pure functions: no store, no network, no clock. Every input is an argument, so every
decision can be logged with the inputs it used and replayed later (observe/tools/observe).
"""
from __future__ import annotations

import datetime as dt
from dataclasses import dataclass

WINDOW_DAYS = 30  # REQ-012


@dataclass(frozen=True)
class Order:
    id: int
    total_cents: int
    dispatched_on: dt.date
    delivered_on: dt.date


@dataclass(frozen=True)
class Decision:
    result: str   # "approved", "in_review" or "refused"
    reason: str
    clause: str
    inputs: dict


def window_start(order: Order) -> tuple[str, dt.date]:
    """The day the refund window is counted from, and which day of the order that is."""
    return "delivery", order.delivered_on  # REQ-012, INV-009: never the dispatch


AUTO_APPROVE_BELOW_CENTS = 10_000  # DEC-031: $100


def dollars(cents: int) -> str:
    return f"${cents // 100:,}" if cents % 100 == 0 else f"${cents / 100:,.2f}"


def decide_refund(order: Order, amount_cents: int, refunded_cents: int, today: dt.date) -> Decision:
    """Decide a refund request for `amount_cents` on `order`, made on `today`.

    `refunded_cents` is what has already been refunded on the order, not counting this refund.
    """
    counted_from, start = window_start(order)
    day = (today - start).days
    inputs = {
        "order_total_cents": order.total_cents,
        "dispatched_on": order.dispatched_on.isoformat(),
        "delivered_on": order.delivered_on.isoformat(),
        "amount_cents": amount_cents,
        "refunded_cents": refunded_cents,
        "today": today.isoformat(),
        "counted_from": counted_from,
        "window_start": start.isoformat(),
    }
    reason = f"day {day} of {WINDOW_DAYS}"
    if day > WINDOW_DAYS:
        return Decision("refused", reason, "REQ-012", inputs)
    total = refunded_cents + amount_cents
    if total < AUTO_APPROVE_BELOW_CENTS:
        return Decision("approved", f"total refunded {dollars(total)}, under $100", "DEC-031", inputs)
    return Decision("in_review", f"total refunded {dollars(total)}, not under $100", "DEC-031", inputs)
