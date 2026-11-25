---
id: ASM-011
kind: assumption
title: The gateway honors request keys
traces: [INV-004]
terms: [request key]
owner: refunds owner
tier: 2
monitor: verify/monitors/duplicate-payouts.md
---
The payment gateway pays at most once per request key.

The gateway's documentation says so, and the refunds service depends on it whenever it retries a payout. No
check inside this repository can show it, so a monitor watches for it in production.

## Examples

### satisfies/1: A payout sent twice with one request key
Given a payout already made with request key K
When the service sends a payout with request key K again
Then the gateway returns the original payout and transfers nothing more
