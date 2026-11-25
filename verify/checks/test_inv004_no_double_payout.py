"""INV-004: a refund is never issued twice for the same order. Checked in VE-002.

Part P1 of the assurance case (spec/blueprint/cases/INV-004.md): a repeated request never pays again.
"""
import unittest

from verify.canonball_check import example_of
from verify.envs.ve002 import World, at_once


class NoDoublePayout(unittest.TestCase):
    def setUp(self):
        self.world = World()
        self.addCleanup(self.world.close)

    @example_of("INV-004#satisfies/1", "The same request sent twice pays once")
    def test_same_request_twice_pays_once(self):
        world = self.world
        order = world.rig.order(order_id=4471, total_cents=12000)
        first = world.act.request_refund(order, 12000, key="4471-a")
        second = world.act.request_refund(order, 12000, key="4471-a")
        world.act.approve(first.id, reviewer="support lead")
        world.act.approve(second.id, reviewer="support lead")
        paid = world.observe.gateway.payouts(order=order)
        assert len(paid) == 1

    @example_of("INV-004#satisfies/2", "A retry after a lost reply finds the original payout")
    def test_retry_after_lost_reply_pays_once(self):
        world = self.world
        order = world.rig.order(total_cents=12000)
        refund = world.act.request_refund(order, 12000, key="lost-reply-1")
        world.perturb.gateway.lose_reply()
        refund = world.act.approve(refund.id, reviewer="support lead")
        self.assertEqual(refund.state, "paid")
        paid = world.observe.gateway.payouts(order=order)
        assert len(paid) == 1

    @example_of("INV-004#violates/1", "Two concurrent copies of one request both pay out")
    def test_two_concurrent_copies_pay_once(self):
        world = self.world
        order = world.rig.order(total_cents=12000)

        def one_copy():
            refund = world.act.request_refund(order, 12000, key="concurrent-1")
            return world.act.approve(refund.id, reviewer="support lead")

        at_once(one_copy, one_copy)
        paid = world.observe.gateway.payouts(order=order)
        assert len(paid) == 1
