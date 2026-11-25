"""DEC-031: a refund is approved automatically while the total refunded on the order stays under $100.

Checked in VE-002, as the evidence plan in roadmap/M2-faster-small-refunds/change.md says.
"""
import unittest

from verify.canonball_check import example_of
from verify.envs.ve002 import World


class AutoApproveUnder100(unittest.TestCase):
    def setUp(self):
        self.world = World()
        self.addCleanup(self.world.close)

    @example_of("DEC-031#satisfies/1", "A $40 refund, nothing refunded before")
    def test_40_refund_is_approved_without_review(self):
        world = self.world
        order = world.rig.order(total_cents=15000)
        refund = world.act.request_refund(order, 4000, key="dec031-s1")
        self.assertEqual(refund.state, "paid")
        self.assertIsNone(refund.reviewed_by)
        paid = world.observe.gateway.payouts(order=order)
        self.assertEqual([p.amount_cents for p in paid], [4000])

    @example_of("DEC-031#satisfies/2", "Two $60 refunds on one order")
    def test_second_60_refund_goes_to_review(self):
        world = self.world
        order = world.rig.partly_refunded_order(6000, total_cents=15000)  # the first $60 refund, paid
        second = world.act.request_refund(order, 6000, key="dec031-s2")
        self.assertEqual(second.state, "in_review")
        paid = world.observe.gateway.payouts(order=order)
        self.assertEqual(len(paid), 0)

    @example_of("DEC-031#violates/1", "A $250 refund approved without review")
    def test_250_refund_goes_to_review(self):
        world = self.world
        order = world.rig.order(total_cents=30000)
        refund = world.act.request_refund(order, 25000, key="dec031-v1")
        self.assertEqual(refund.state, "in_review")
        paid = world.observe.gateway.payouts(order=order)
        self.assertEqual(len(paid), 0)
