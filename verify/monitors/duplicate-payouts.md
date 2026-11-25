# Monitor: duplicate payouts

Watches ASM-011: the payment gateway pays at most once per request key. The Verification Record shows ASM-011
as accepted, with stated risk, for as long as this monitor exists and runs.

## What it watches

The payment gateway's daily settlement report, which lists every transfer it made with the request key it was
given. The monitor counts transfers per request key, and compares the count of payouts per refund with the
refunds service's store.

## Threshold

One. Any request key with more than one transfer, or any refund with more than one payout, fires the monitor.
There is no tolerance: a single duplicate means the assumption is false.

## When it fires

1. The on-call agent opens an incident and lists the request keys and orders involved, from the settlement
   report and `observe decisions` for each order.
2. The operator decides whether to pause payouts until the cause is known. Pausing is the reading of tenet 1;
   the agent recommends, and a person decides.
3. Finance recovers the duplicate transfer from the gateway.
4. ASM-011 is treated as unsupported until the gateway explains the duplicate. If the assumption is false,
   INV-004 needs a new part in its assurance case (see `spec/blueprint/cases/INV-004.md`), and that is work for
   a milestone.
