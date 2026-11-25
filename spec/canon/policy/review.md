# What counts as critical

People own this page. No agent may change it.

An agent reviews every milestone and every unplanned item. A person reviews as well when the change:

- touches a constraint (ENV) or an action that cannot be undone;
- adds or alters a tier 2 clause (safety, money);
- changes code that touches the outside world (adapters, permissions);
- makes the status of any clause worse;
- behaves differently from what was predicted, and the difference is kept;
- has a blast radius the reviewer rates as large.

The machine-readable part of this list is in `canonball.toml` under `[review]`.
