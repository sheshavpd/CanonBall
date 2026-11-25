---
id: DEC-031
kind: decision
title: Auto-approve under $100
traces: [REQ-012]
cites: [tenet 1]
terms: [refund, refund amount, order, review]
owner: product manager
tier: 2
---
A refund is approved automatically while the total refunded on the order stays under $100.

The limit applies to the total refunded on the order, this refund included, and not to each refund amount on
its own, so that a refund split into small pieces still goes to review. Settled by tenet 1: a person's review
over speed, when money moves. Every other refund inside the window goes to review, as before.

## Examples

### satisfies/1: A $40 refund, nothing refunded before
Given an order on which nothing has been refunded
When the customer requests a refund of $40
Then the refund is approved without review

### satisfies/2: Two $60 refunds on one order
Given an order on which a refund of $60 has already been paid
When the customer requests a second refund of $60
Then the second refund goes to review

### violates/1: A $250 refund approved without review
Given an order on which nothing has been refunded
When the customer requests a refund of $250
Then the refund is approved without review
