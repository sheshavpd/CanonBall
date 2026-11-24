---
title: Evidence and the Record
summary: Nobody gets to write "done". Each run of each check leaves one line of evidence. A program reads those lines and computes the status of every clause, and names the weakest link.
part: verification
order: 3
related: [verification-engineering, environments, canonball]
---

## Status is computed

In most projects, "done" is something a person says. In CanonBall it is something a program works out.

The **Record** is the computed status of every clause. A program reads the cases and the results of the checks, applies rules that people own, and publishes the outcome. No agent and no person can write a status into it. It is not a file in the repository at all.

The rule extends to the work itself. Whether a task is finished, or a change is ready to release, is also computed from what exists.

## A line of evidence

Each run of each check writes one line.

```json
{"clause": "INV-004", "part": "a",
 "check": "verify/checks/test_inv_004.py::test_two_requests_pay_once",
 "story": "INV-004#violates/1",
 "environment": "VE-002", "commit": "3f9c",
 "assumptions": [], "seed": 4411,
 "state": "passed",
 "recorded_failure": "verify/checks/red/test_two_requests_pay_once.json"}
```

It says which clause the run is evidence for, which story the check encodes, what code it ran against, in which environment, with which random seed, and what happened.

That is enough for someone else to run it again. Evidence that cannot be reproduced is treated as a claim.

## A check must fail before its pass counts

This is the rule people remember.

A check that has never failed tells you nothing. It may be asserting something that is always true. It may be testing the fake. It may not be running.

So for every story that describes a violation, the check is run once against a build that has been broken on purpose. The broken build comes from a small patch called an **injected fault**. The failing run is kept beside the check as a **recorded failure**.

Only when that file exists does the check's pass count.

```text
INV-004   unsupported   checks 3/3 passed   seen to fail 0/1
INV-004   accepted      checks 3/3 passed   seen to fail 1/1
```

Both lines show three passing checks. The first is not evidence. If you know mutation testing, this is the same idea, applied one check at a time and made a condition of acceptance.

## Five statuses

The status of a clause is a decision. It is not a confidence score.

| Status | Meaning |
|---|---|
| **Accepted** | Every part has evidence that is in range and current. |
| **Accepted, with stated risk** | Accepted, with an assumption that is watched but not proven. |
| **Unsupported** | Some part lacks evidence, or a check failed. The Record says which. |
| **Pending** | Agreed, and waiting on another team to provide something. |
| **Unknown** | Not yet assessed, or the code the case rests on has changed. |

Two properties keep the Record honest.

**The weakest link is named.** A clause with three strong parts and one missing part is unsupported, and the Record names the missing part. Nothing is averaged.

**A gap is never hidden.** A part that ran and saw nothing is unsupported. It is not quietly left out.

## Evidence that does not count

Not every passing run is evidence. These are marked and set aside.

| Marked as | Why it does not count |
|---|---|
| **Stale** | The code, the environment, or a fake has changed since the run. |
| **Out of range** | The run was outside what the environment was validated for. |
| **Self-produced** | The builder ran it, and nothing independent checked it. |
| **Marked down** | The environment has stopped catching injected faults. |
| **Never reached** | The check was about a race, and the race never happened. |

## How staleness works

Everything evidence depends on carries a fingerprint: the code a clause relies on, the environment's declaration, each fake. When any of them changes, the fingerprint changes, and the evidence that relied on it is stale until the check runs again.

One mechanism, used everywhere. Evidence never silently outlives the thing it was about.

It also keeps runs affordable. A change re-runs only the checks for clauses whose code it touched. Every other clause keeps its last valid result, and the Record shows which commit that result came from.

## When a check fails

Every failing check is classified before anyone acts on it.

| Label | Meaning | Next step |
|---|---|---|
| **Bug** | The build is wrong. | Fix the code. |
| **Gap** | A clause is missing. | Propose one. |
| **Noise** | The environment misbehaved. | Fix the environment. Never just retry. |
| **Ambiguity** | The clause has two readings. | Ask a person. |

The label decides what happens next, and it is recorded. Retrying a failed check until it passes is not allowed. It weakens the evidence without telling anyone.

## Assumptions and monitors

A clause that depends on the outside world cannot be fully proven. Its assumption gets a **treatment**:

- how it is observed in production;
- how long a failure would take to show;
- what the system does when it fails;
- what is accepted when a failure could not be detected at all.

A monitor that raises an alarm is a treatment. It is not evidence that the clause holds. At best it supports "accepted, with stated risk".

When a monitor fires, an incident opens. The incident becomes a small [change](../change/), with a new story and usually a new invariant. This is how operating the system improves the canon.

## The policy

The rules that turn evidence into status live in `spec/canon/policy/`. People write them. No agent can.

They say what counts as evidence for each tier, what counts as an independent check, which kinds of oracle are trusted, and when a person must accept a release. A change that would lower the bar is reviewed explicitly.

## In the first week

The full machinery is not needed to start. For a first system, the Record is one script and one table.

```text
INV-003 | unsupported | checks 3/3 | seen to fail 1/2 | missing: violates/2
```

Two statuses are enough at first, accepted and unsupported, with one rule: a clause is accepted when every story has a check, every check passed at this commit, and every violating story has a recorded failure.
