"""ASM-011: the payment gateway pays at most once per request key.

An assumption cannot be checked from inside the system; the monitor in
verify/monitors/duplicate-payouts.md watches the real gateway. This check shows only that VE-002's
fake gateway behaves as the assumption says, since every INV-004 check depends on that.
"""
import unittest

from verify.canonball_check import example_of
from verify.envs.fake_gateway import FakeGateway


class FakeGatewayHonorsRequestKeys(unittest.TestCase):
    @example_of("ASM-011#satisfies/1", "A payout sent twice with one request key")
    def test_fake_gateway_pays_once_per_request_key(self):
        gateway = FakeGateway()
        first = gateway.pay("key-1", 1001, 5000)
        again = gateway.pay("key-1", 1001, 5000)
        self.assertEqual(again, first)
        paid = gateway.payouts(order=1001)
        self.assertEqual(len(paid), 1)
