"""REQ-012: a customer can request a refund within 30 days of delivery. Checked in VE-002."""
import datetime as dt
import unittest

from verify.canonball_check import example_of
from verify.envs.ve002 import World


class RefundWindow(unittest.TestCase):
    def setUp(self):
        self.world = World()
        self.addCleanup(self.world.close)

    @example_of("REQ-012#satisfies/1", "A request 19 days after delivery")
    def test_request_on_day_19_is_accepted(self):
        world = self.world
        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 1))
        world.rig.today(dt.date(2026, 3, 20))
        refund = world.act.request_refund(order, 12000, key="req012-s1")
        self.assertNotEqual(refund.state, "refused")

    @example_of("REQ-012#satisfies/2", "A request 29 days after a late delivery")
    def test_request_29_days_after_late_delivery_is_accepted(self):
        world = self.world
        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 2),
                                delivered_on=dt.date(2026, 3, 4))  # late delivery
        world.rig.today(dt.date(2026, 4, 2))
        refund = world.act.request_refund(order, 12000, key="req012-s2")
        self.assertNotEqual(refund.state, "refused")

    @example_of("REQ-012#violates/1", "A request 35 days after delivery")
    def test_request_on_day_35_is_refused(self):
        world = self.world
        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 1))
        world.rig.today(dt.date(2026, 4, 5))
        refund = world.act.request_refund(order, 12000, key="req012-v1")
        self.assertEqual(refund.state, "refused")
        paid = world.observe.gateway.payouts(order=order)
        self.assertEqual(len(paid), 0)
