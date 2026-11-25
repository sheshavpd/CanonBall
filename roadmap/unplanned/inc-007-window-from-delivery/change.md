# INC-007: Count the refund window from delivery

What changes: the refund window is counted from delivery, as REQ-012 already promises. No new promise.
Nothing else changes.

Gathers:   incidents/INC-007.md
Why now:   customers whose delivery came days after dispatch are refused inside their 30 days, and support
           cannot explain the refusal (tenet 2: a slow refund over a wrongly refused one).
Adds:      a new example for REQ-012 (satisfies/2), and INV-009, which pins down what REQ-012 already says

status: ready   (written by canonball)

## Predicted change in behavior

A request made within 30 days of delivery, but more than 30 days after dispatch, is accepted instead of
refused. Requests for orders delivered on the day of dispatch are decided as before. Nothing else changes.

## Evidence plan

1. VE-002 gains the starting state "late delivery": an order delivered days after its dispatch. It could
   already set one up; the declaration now says so, and the new checks use it.
2. One check for REQ-012 satisfies/2 and one for each INV-009 example, in VE-002.
3. An injected fault that counts the window from dispatch again. Every new check is seen to fail against it.
4. The existing checks run unchanged. No clause may get worse.
