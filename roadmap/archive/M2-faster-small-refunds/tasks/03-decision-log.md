# 03 decision log

Log each DEC-031 decision with its clause and inputs.

- Where: `src/refunds/decide.py`, `observe/signals.md`.
- What: a decision inside the window is logged under DEC-031, with the refund amount and what had already been
  refunded among its inputs, so that `observe decisions` can show the refund amount and the total refunded
  and `observe replay` can re-run it.
- Traces: DEC-031; the architecture's rule that every decision is logged.
- Done when: `observe decisions` shows the DEC-031 decision for an order with two $60 refunds.
