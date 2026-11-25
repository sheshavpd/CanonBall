# Architecture

How the refunds service is divided, where state lives, and the design decisions that are not in the canon.
Agents keep this page current and record each choice with its reason. A person may promote any choice here
to a decision in the canon.

## Parts

| Part | File | What it does |
|---|---|---|
| Decision logic | `src/refunds/decide.py` | Decides whether a refund request is refused or goes to review. Pure functions: no store, no network, no clock. Today's date is an input. |
| Service | `src/refunds/service.py` | The imperative shell. Reads the order and what has been refunded from the store, calls the decision logic, logs the decision, records the refund, and pays reviewed refunds through the gateway. |
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
