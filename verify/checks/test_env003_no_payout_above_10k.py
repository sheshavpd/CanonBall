"""ENV-003: no payout above $10,000 without review. Checked in VE-002."""
import unittest

from verify.canonball_check import example_of
from verify.envs.ve002 import World


class NoPayoutAbove10k(unittest.TestCase):
    def setUp(self):
        self.world = World()
        self.addCleanup(self.world.close)

    @example_of("ENV-003#satisfies/1", "A reviewed $12,000 refund is paid")
    def test_reviewed_12000_refund_is_paid(self):
        world = self.world
        order = world.rig.order(total_cents=1_500_000)
        refund = world.act.request_refund(order, 1_200_000, key="env003-s1")
        refund = world.act.approve(refund.id, reviewer="finance")
        self.assertEqual(refund.state, "paid")
        paid = world.observe.gateway.payouts(order=order)
        self.assertEqual([p.amount_cents for p in paid], [1_200_000])

    @example_of("ENV-003#violates/1", "A $12,000 refund paid without review")
    def test_unreviewed_12000_refund_is_not_paid(self):
        world = self.world
        order = world.rig.order(total_cents=1_500_000)
        refund = world.rig.refund(order, 1_200_000, state="approved", reviewer=None)
        world.act.pay(refund)
        paid = world.observe.gateway.payouts(order=order)
        self.assertEqual(len(paid), 0)
