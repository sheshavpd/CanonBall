# verify

Written by the verifier agent. The builder may run everything here and may change none of it.

- `envs/` the verification environments: the system, its real local stores, and a fake for each outside dependency.
- `checks/` one check per example, marked with the example it encodes (`verify/canonball_check.py`).
- `checks/red/` the kept failing runs that show each check can fail. Written by `tools/canonball fault`.
- `faults/` injected faults: small patches that break one thing on purpose.
- `monitors/` what watches the assumptions and invariants in production.
