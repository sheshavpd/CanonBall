---
id: ENV-003
kind: constraint
title: No payout above $10,000 without review
traces: []
terms: [payout, review]
owner: finance
tier: 2
---
No payout above $10,000 without review.

Finance sets this limit for every payment the shop sends; the refunds service enforces it at the point where
money leaves, whatever decided that the refund should be paid.

## Examples

### satisfies/1: A reviewed $12,000 refund is paid
Given a refund of $12,000 that a person has reviewed
When the service pays it
Then one payout of $12,000 is made

### violates/1: A $12,000 refund paid without review
Given a refund of $12,000 that no person has reviewed
When the service is asked to pay it
Then one payout of $12,000 is made
