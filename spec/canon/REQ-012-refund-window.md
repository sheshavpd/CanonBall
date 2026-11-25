---
id: REQ-012
kind: promise
title: Refund window
traces: []
terms: [customer, refund, delivery]
owner: product manager
tier: 1
---
A customer can request a refund within 30 days of delivery.

The day of delivery is day 0, so a request on day 30 is inside the window and a request on day 31 is not.

## Examples

### satisfies/1: A request 19 days after delivery
Given an order delivered on 1 March
When the customer requests a refund on 20 March
Then the request is accepted

### violates/1: A request 35 days after delivery
Given an order delivered on 1 March
When the customer requests a refund on 5 April
Then the request is accepted
