---
id: INV-009
kind: invariant
title: Window from delivery
traces: [REQ-012]
terms: [refund, delivery, dispatch]
owner: product manager
tier: 2
---
The refund window is counted from delivery, never from dispatch.

REQ-012 already promises this; INV-009 makes it explicit, after INC-007, so that a check fails if the window
is ever counted from dispatch again. When dispatch and delivery fall on the same day, both give the same
answer; the examples are about orders where they do not.

## Examples

### satisfies/1: The last day of the window, after a late delivery
Given an order dispatched on 2 March and delivered on 4 March
When the customer requests a refund on 3 April
Then the request is accepted, on day 30 of 30, counted from delivery on 4 March

### violates/1: A window counted from dispatch
Given an order dispatched on 1 March and delivered on 10 March
When the customer requests a refund on 5 April
Then the request is refused as day 35 of 30, counted from dispatch on 1 March
