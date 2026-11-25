# What counts as evidence

People own this page. No agent may change it.

- Every example in the canon has at least one check, and the check names the example it encodes.
- A check counts only after it has been seen to fail against an injected fault. The failing run is kept in `verify/checks/red/`.
- Evidence counts only inside what its verification environment can show. Each environment says what it cannot show.
- An assumption cannot be proven from inside the system. It is accepted with stated risk while a monitor in `verify/monitors/` watches it.
- Nobody writes a status. `tools/canonball record` computes the Verification Record from evidence.
