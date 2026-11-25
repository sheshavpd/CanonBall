# Vocabulary

Every domain word the canon uses, each defined once. Synonyms are not allowed: pick one word and use it
everywhere, from the clause to the code, the check and the incident report. A clause lists the words it
uses in its `terms:` field, and `tools/canonball check` blocks a word that is not defined here.

## Customer
A person who buys from the shop.

## Order
One purchase by a customer: one or more items, paid for together.

## Dispatch
The carrier's collection of the last item of an order.

## Delivery
The carrier's delivered scan for the last item of an order. Not the dispatch.

## Refund
Money returned to the customer for an order. Each refund is separate; an order can have more than one.

## Payout
One transfer through the payment gateway.

## Request key
The identifier the payment gateway uses to pay a request at most once.

## Review
A person's approval of a refund before it is paid.
