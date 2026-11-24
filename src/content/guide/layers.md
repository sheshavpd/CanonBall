---
title: "Four layers: canon, blueprint, build, Record"
summary: A CanonBall system has four layers with different owners and different rules. Authority runs down through them. Evidence runs back up.
part: structure
order: 1
related: [primitives, repository, evidence]
---

## The four layers

| Layer | The question it answers | Who writes it | How firmly it binds |
|---|---|---|---|
| **Canon** | What must be true? | People approve; agents draft | Binding |
| **Blueprint** | How will it be made true? | Agents | Revisable |
| **Build** | What actually runs? | Agents | Replaceable, one checked change at a time |
| **Record** | Is it true? | A program | Computed; nobody writes it |

Canon and blueprint together are the **spec**: the statement of intent. Build and Record together are reality. The agents have one job, which is to keep reality consistent with intent and to say so when they cannot.

## Canon

The canon is the set of approved [clauses](../primitives/), plus a few pages that give them context: the purpose of the system, who it serves, the [vocabulary](../vocabulary/), and the order of values to apply when two goals conflict.

It is written in plain language and it is the only layer people must read in full. Everything else they read by exception.

## Blueprint

The blueprint is where the agents' choices are written down, so that they are visible and can be reversed. It holds:

- the architecture and the contracts between internal modules;
- **derived decisions**, which are design choices an agent made and recorded with its reasons;
- one **case** per clause, saying how that clause will be shown true;
- the verification plan and the design of each verification environment.

The canon leaves gaps on purpose. The blueprint records how they were filled. Agents may revise it as often as they like, with one condition: it must never contradict the canon.

A person can move a derived decision up into the canon at any time. That is how you take a design choice back from the agents: promote it to a [decision](../primitives/#decision), and it is yours.

## Build

The build has two halves.

- `src/` is the code that runs.
- `verify/` is everything that produces evidence: environments, checks, proofs, monitors.

Different agents own each half. The agent that writes `src/` can run what is in `verify/` and cannot change it. That separation is what makes the evidence worth having, and the chapter on [people and agents](../people-and-agents/) explains how it is enforced.

The build is replaceable, with one restriction that surprises people. You may not regenerate it from the spec. The spec leaves many things open, and a fresh generation would decide each of them again, differently. The build changes only as a sequence of checked changes, each of which either alters a clause or alters none.

## Record

The Record states, for every clause, whether the evidence supports it. It is computed by a program from the cases and the results of the checks, according to rules that people own.

Nobody writes "done" or "verified" into the Record. Nobody can. It is not a file in the repository. It is recomputed on every push and published.

## Authority down, evidence up

```text
 CANON       what must be true
   |  constrains                  ^  is discharged by
 BLUEPRINT   how it will be made true
   |  constrains                  ^  is discharged by
 BUILD       what actually runs
   |  is observed by              ^  produces
 RECORD      whether it is true
```

Read down the left side, each layer limits the one below. The canon limits what the blueprint may design. The blueprint limits what the build may contain.

Read up the right side, each layer answers to the one above. The build produces evidence. The evidence discharges the cases in the blueprint. The cases discharge the clauses in the canon.

When two layers disagree, the higher one is right by definition, and the change is blocked until they agree.

## Two rules that make it mechanical

Layers are only a diagram unless something enforces them. Two checks do, on every change.

**No orphans.** Every element of the build refers to an element of the blueprint, and every element of the blueprint refers to a clause. Anything that cannot be traced blocks the merge.

This check establishes that the references exist. It does not establish that the code is justified by them. Justification is the job of the case.

**No silent gaps.** No clause is reported as accepted while any part of its case lacks evidence. Anything that has not been assessed is shown as unknown. It is never left out.

Neither rule involves a person. They are computed.

## What each layer costs

| Layer | The cost | What keeps it bearable |
|---|---|---|
| Canon | People must read and approve it | Keep it small: only what a person would need to approve |
| Blueprint | Cases go stale as code moves | Cases are tied to the code they depend on, and go stale visibly |
| Build | Two agents, two sets of permissions | Enforced by file permissions, so it needs no vigilance |
| Record | A program to compute it | In the first week it is one script and one table |
