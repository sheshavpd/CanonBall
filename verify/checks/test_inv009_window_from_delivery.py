"""INV-009: the refund window is counted from delivery, never from dispatch. Checked in VE-002.

Each check starts from late delivery: an order delivered days after its dispatch, so that counting from
the wrong day gives a different answer. The day counted from is read from the decision log.
"""
import datetime as dt
import unittest

from verify.canonball_check import example_of
from verify.envs.ve002 import World


class WindowFromDelivery(unittest.TestCase):
    def setUp(self):
        self.world = World()
        self.addCleanup(self.world.close)

    @example_of("INV-009#satisfies/1", "The last day of the window, after a late delivery")
    def test_day_30_after_late_delivery_is_accepted(self):
        world = self.world
        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 2),
                                delivered_on=dt.date(2026, 3, 4))
        world.rig.today(dt.date(2026, 4, 3))
        refund = world.act.request_refund(order, 12000, key="inv009-s1")
        self.assertNotEqual(refund.state, "refused")
        decision = world.observe.decisions(order=order)[-1]
        self.assertEqual((decision["inputs"]["counted_from"], decision["inputs"]["window_start"]),
                         ("delivery", "2026-03-04"))

    @example_of("INV-009#violates/1", "A window counted from dispatch")
    def test_window_is_not_counted_from_dispatch(self):
        world = self.world
        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 1),
                                delivered_on=dt.date(2026, 3, 10))
        world.rig.today(dt.date(2026, 4, 5))
        refund = world.act.request_refund(order, 12000, key="inv009-v1")
        self.assertNotEqual(refund.state, "refused")
        decision = world.observe.decisions(order=order)[-1]
        self.assertNotEqual(decision["inputs"]["counted_from"], "dispatch")
