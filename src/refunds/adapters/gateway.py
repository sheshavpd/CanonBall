"""The payment gateway: the interface the service pays through, and the production adapter.

The gateway pays at most once per request key (ASM-011): a second payout with a key it has
already paid returns the original payout and transfers nothing.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Payout:
    id: str
    request_key: str
    order_id: int
    amount_cents: int


class PayoutRefused(Exception):
    """The gateway refused the payout. Nothing was transferred."""


class ReplyLost(Exception):
    """No reply arrived. The gateway may or may not have paid."""


class Gateway:
    """What the service needs from a payment gateway."""

    def pay(self, request_key: str, order_id: int, amount_cents: int) -> Payout:
        raise NotImplementedError


class ProductionGateway(Gateway):
    """The adapter for the real payment gateway.

    Not part of this example: the real gateway's client, credentials and request shapes are
    outside the repository. VE-002 replaces this class with verify/envs/fake_gateway.py.
    """

    def pay(self, request_key: str, order_id: int, amount_cents: int) -> Payout:
        raise NotImplementedError(
            "ProductionGateway is a placeholder: connect the real payment gateway here. "
            "In the verification environment, VE-002 uses verify/envs/fake_gateway.py instead.")
