# M2: Faster small refunds

What changes: a refund is approved automatically while the total refunded on the order stays under $100.
Nothing else changes.

Gathers:   3 requests: roadmap/notes/support-small-refunds-wait.md, finance-review-time-under-100.md,
           risk-split-refunds.md
Why now:   the review queue is the slowest step for small refunds. Support handles complaints about the
           wait every day, and reviewers spend most of their time on refunds they almost never turn down.
Adds:      DEC-031 auto-approve under $100; "refund amount" in vocabulary.md

status: released   (written by canonball)

## Predicted change in behavior

A refund moves from review to automatic approval while the total refunded on the order stays under $100.
Nothing else changes.

## Evidence plan

Agreed with the verification lead before any code is written.

1. In VE-002, one check for each example of DEC-031: satisfies/1 (a $40 refund, nothing refunded before),
   satisfies/2 (two $60 refunds on one order) and violates/1 (a $250 refund). Each is seen to fail against an
   injected fault first. For satisfies/2, the fault applies the limit to each refund instead of to the
   order's total.
2. VE-002 gains one starting state: an order that has already been partly refunded. The satisfies/2 check
   starts from it.
3. The automatic path is run against the lost-reply failure VE-002 already simulates: a refund approved
   automatically, whose reply is lost after the gateway pays, is paid once. This check is filed under
   INV-004 satisfies/2, and the assurance case for INV-004 is extended to the automatic path.
4. The checks for REQ-012, INV-004 and ENV-003 run unchanged. No clause may get worse.
