---
id: INV-004
kind: invariant
title: No double payout
traces: [REQ-012]
terms: [refund, order]
owner: refunds owner
tier: 2
---
A refund is never issued twice for the same order.

"Twice" means the same request paid two times: a request sent again, retried, or delivered in two copies.
A second, separate refund on the same order is a new refund, with its own request key, and is allowed.

## Examples

### satisfies/1: The same request sent twice pays once
Given order 4471 and a refund request with request key K
When the same request, with request key K, is sent a second time and both are reviewed
Then one payout is made for order 4471

### satisfies/2: A retry after a lost reply finds the original payout
Given a reviewed refund whose payout reaches the payment gateway, which pays it, and whose reply is lost
When the service retries the payout
Then the retry finds the original payout and nothing more is paid

### violates/1: Two concurrent copies of one request both pay out
Given two copies of one refund request, with the same request key, arriving at the same time
When both copies are processed and reviewed
Then two payouts are made for the order
