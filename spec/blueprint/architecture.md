# Architecture

How the refunds service is divided, where state lives, and the design decisions that are not in the canon.
Agents keep this page current and record each choice with its reason. A person may promote any choice here
to a decision in the canon.

## Parts

| Part | File | What it does |
|---|---|---|
| Decision logic | `src/refunds/decide.py` | Decides whether a refund request is refused, goes to review, or is approved automatically. Pure functions: no store, no network, no clock. Today's date is an input. |
| Service | `src/refunds/service.py` | The imperative shell. Reads the order and what has been refunded from the store, calls the decision logic, logs the decision, records the refund, and pays approved refunds through the gateway. |
| Store | `src/refunds/adapters/store.py` | Orders and refunds, in SQLite. A file in production; in memory in VE-002. |
| Gateway | `src/refunds/adapters/gateway.py` | The payment gateway interface, and the production adapter. |
| Decision log | `src/refunds/adapters/decision_log.py` | One JSON line per decision. |

## Decisions recorded here

- **Every decision is logged.** Each call to the decision logic writes one line with the clause it applied,
  its result and reason, and the inputs it used, so that `observe/tools/observe` can show and replay it. The
  fields are listed in `observe/signals.md`.
- **A request key identifies a request.** The caller of `request_refund` supplies the request key. A second
  request with a key the store already holds returns the existing refund; the store enforces one refund per
  request key. Serves INV-004.
- **Payouts carry the request key.** Every payout for a refund is sent with that refund's request key. When
  the gateway's reply is lost, the service retries up to 3 times with the same key and relies on the gateway
  to return the original payout (ASM-011). Serves INV-004.
- **One payout attempt per refund at a time.** A refund moves from approved to paying in one store update;
  only the caller that made the move sends the payout. Serves INV-004.
- **The payout limit is enforced where money leaves.** `pay` holds any payout above $10,000 that has no
  reviewer, whatever approved it. Serves ENV-003.
- **DEC-031 lives in the decision logic.** `decide_refund` applies the $100 limit after the refund window
  (REQ-012): a request outside the window is refused whatever its amount. Inside the window, the refund is
  approved when the total refunded on the order, this refund included, stays under $100, and goes to review
  otherwise. The decision is logged under DEC-031 with the refund amount and the total refunded. (Architect,
  at Shape.)
- **The total refunded counts every refund on the order that is not refused**: paid, being paid, approved,
  and still in review. A refund in review may yet be paid, and counting it keeps a split refund from reaching
  automatic approval while its first part waits for a person (tenet 1). The store computes it.
- **The payout code is not changed.** An automatically approved refund is paid through the same `pay` as a
  reviewed one: same request key, same retries, same ENV-003 limit. (Architect, at Shape.)
