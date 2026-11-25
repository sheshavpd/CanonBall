# Signals

What the system emits, so that agents and people can see what it did.

- **Decision log.** Every decision the system makes writes one line: the clause it applied, the inputs it used, and the result.
- **Traces.** One trace follows each request through every adapter, under one ID.
- **Metrics.** The rates the monitors in `verify/monitors/` watch.

List each field here. Agents and monitors depend on the names, so a change to this page is reviewed like a
change to an interface. Never log personal data; log identifiers.
