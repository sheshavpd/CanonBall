# Review

reviewer: reviewer agent
verdict: pass
blast radius: medium
person required: yes

## Findings

- The payout retry count changed from 3 to 5 (`PAYOUT_RETRIES` in `src/refunds/service.py`). No clause asks
  for it, and the design says the payout code is not changed. Retries are where a refund is paid twice, so a
  change to them needs a reason in the canon. Sent back to Build. The builder set the count back to 3 in this
  commit, and every check passes. Anyone who wants more retries can file a request in `roadmap/notes/`.

## What the review covered

1. Every behavior in the diff traces to a clause. Automatic approval and its payout trace to DEC-031; the
   total refunded lookup and the DEC-031 log line trace to DEC-031 and the architecture. After the fix,
   nothing else changes behavior.
2. The actual change in behavior matches the predicted one. A refund inside the window moves from review to
   automatic approval while the total refunded on the order, this refund included, stays under $100. Refusals
   outside the window, the review path and the payout code behave as before.
3. The design choices are recorded in the milestone's `diff/blueprint/architecture.md`, including which
   refunds count toward the total refunded.
4. The evidence is honest. DEC-031 has one check per example, each seen to fail against an injected fault,
   and the automatic path is checked against the lost-reply failure. No existing check or fault was weakened.
   The Verification Record for the release candidate: 4 accepted, 1 accepted with stated risk (ASM-011).
5. Blast radius: medium. The change decides which refunds are paid without a person looking, for every
   refund under $100. A wrong rule pays money that cannot easily be recovered, but each payout is under $100
   and the rule can be withdrawn by a release.

A person is required: DEC-031 is a tier 2 clause, and the change moves money without review. The refunds
owner read the Verification Record, the predicted and actual change in behavior, and the assurance case for
INV-004 on the automatic path.

## Sign-off

signed off by: refunds owner, 2026-03-09
