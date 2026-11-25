# 02 auto-approve

Apply DEC-031 in the decision logic, and pay what it approves.

- Where: `src/refunds/decide.py`, `src/refunds/service.py`.
- What: inside the refund window, `decide_refund` returns `approved` when the total refunded, this refund
  included, stays under $100 (10,000 cents), and `in_review` otherwise. A request outside the window is still
  refused under REQ-012. The service pays an approved refund through `pay`, as the review path does.
- Not changed: the payout code (`pay` and what it calls).
- Traces: DEC-031.
- Done when: the DEC-031 checks pass, and every existing check still passes.
