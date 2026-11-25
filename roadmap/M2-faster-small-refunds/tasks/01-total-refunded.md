# 01 total refunded

Read everything already refunded on an order.

- Where: `src/refunds/adapters/store.py`, `src/refunds/service.py`.
- What: the store returns the total refunded on an order: every refund on it that is not refused (in review,
  approved, being paid, paid). The service passes it to `decide_refund` in place of the total paid.
- Traces: DEC-031.
- Done when: the DEC-031 satisfies/2 check passes.
