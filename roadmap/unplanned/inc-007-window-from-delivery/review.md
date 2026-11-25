# Review

reviewer: reviewer agent
verdict: pass
blast radius: small
person required: yes

## Findings

- None.

## What the review covered

1. Every behavior in the diff traces to a clause. The one change to `src/` makes `window_start` read the day
   of delivery; it traces to REQ-012 and INV-009.
2. The actual change in behavior matches the predicted one. Requests within 30 days of delivery but more
   than 30 days after dispatch are now accepted; orders delivered on the day of dispatch are decided as
   before, and every existing check passes unchanged.
3. Nothing new needed a design record. VE-002's declaration now lists late delivery among its starting
   states.
4. The evidence is honest. REQ-012 satisfies/2 and both INV-009 examples have one check each, each seen to
   fail against `verify/faults/count-from-dispatch.patch`, which puts the defect back.
5. Blast radius: small. One line of decision logic, and it only turns some refusals into accepted requests.
   It cannot pay a refund twice or skip a review.

A person is required: the change decides who is paid, and INV-009 is a tier 2 clause. The refunds owner read
the Verification Record for the release candidate and the predicted and actual change in behavior.

## Sign-off

signed off by: refunds owner, 2026-04-06
