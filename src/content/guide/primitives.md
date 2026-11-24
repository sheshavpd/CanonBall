---
title: The primitives
summary: People steer agents with a small set of written statements called clauses. There are five kinds. This chapter says what each one is, why it exists, and how to tell them apart.
part: idea
order: 2
related: [stories, vocabulary, layers]
---

## Why primitives at all

An agent that is told "build a refunds service" will build one. It will also make several hundred decisions you never see: what counts as a duplicate, how long a refund window lasts, what happens when the payment gateway times out. Some of those decisions are yours to make. Most are not worth your time.

The primitives are how you draw that line. Each one is a short statement in plain language. An agent may do anything that respects them. It may not do anything that fails to trace back to them. If you learn nothing else about CanonBall, learn these.

## A clause

A **clause** is one statement the system is held to. It lives in one file, has a stable ID, and carries worked examples called [stories](../stories/). The approved clauses together are the **canon**.

```markdown
---
id: INV-004
kind: invariant
state: decided
owner: aisha
traces: [REQ-012]
---
A refund is never issued twice for the same order.

Satisfies:
- Order 4471 refunded once; a second request is rejected.
- A retry after a network timeout finds the original payout.
Violates:
- Two concurrent requests both pay out.
```

There are five kinds of clause. Each answers a different question.

## Promise

**What the system does for someone.**

> A customer can request a refund within 30 days of delivery.

A promise is the reason any code exists. If a piece of the system cannot be traced back to a promise, nobody can say why it is there. The specification calls this kind a *requirement*. This guide says promise, because that is what it is to the customer.

## Invariant

**What must always be true.**

> A refund is never issued twice for the same order.

A promise says what the system does. An invariant says what it must never get wrong while doing it. Invariants make promises safe to offer.

They are also where experience accumulates. Nobody can list every invariant in advance. They come from asking "what must never happen?" of each promise, and from incidents. When something breaks in production, the repair adds an invariant, so the same failure cannot return unnoticed.

## Decision

**A choice that could have gone another way, written down.**

> Refunds under $100 are approved automatically.

Nothing forces the threshold to be $100. Someone chose it. If the choice is not recorded, an agent will make it again the next time it touches that code, and may choose differently.

Decisions are the main tool for steering design. Any design choice an agent made can be promoted to a decision by a person who cares about it. From then on it is fixed until a person changes it.

## Limit

**What is never allowed, whatever the goal.**

> No payout above $10,000 without review.

A limit protects people, money, and actions that cannot be undone. It differs from an invariant in who may change it. The test is simple. If the product team could change the statement after a trade-off discussion, it is an invariant. If the honest answer is "that is not our call", it is a limit.

A limit has its own owner, who holds a veto. The specification calls the set of limits the *envelope*.

## Assumption

**A fact about the outside world that the system relies on.**

> The payment gateway pays at most once per request key.

No system can prove things about a world it does not control. It can say plainly what it is relying on. Every assumption comes with a treatment: how it is watched, how quickly a failure would be noticed, and what the system does when it fails. Evidence for a clause holds only while its assumptions do.

## Telling them apart

| If the statement is about | It is | Who can change it |
|---|---|---|
| What someone gets from the system | A promise | The owner of that capability |
| What must stay true inside the system | An invariant | The owner, after a trade-off |
| A choice between workable options | A decision | The owner |
| What must never happen, at any price | A limit | The limit's own owner only |
| How the outside world behaves | An assumption | Nobody. It is true or it is not |

## Three states: decided, deferred, open

Every clause also says how much freedom agents have around it.

- **Decided.** The clause is binding as written.
- **Deferred.** The agents may choose, within stated bounds.
- **Open.** Nobody has decided. Agents must ask a person and may not guess.

This small field is the most direct control you have. Marking a clause *deferred* hands a decision over. Marking it *open* stops the agents from filling a gap with an assumption.

## Changes go one way

Every change to a clause is classified. **Strengthening** promises more or assumes less. **Weakening** does the reverse. Strengthening is free. Weakening a clause that other people rely on is a breaking change, and each of them must agree to it.

Incidents work the same way. Each one adds a story, and usually an invariant, before the fix is released. The set of guarded failures only grows. It shrinks only when a person removes a clause on purpose.

## What belongs in the canon

Only what a person would need to approve: external promises, safety, money, irreversible actions, and the trade-offs between them. Design choices stay in the [blueprint](../layers/), where agents may revise them.

If the canon grows until people can no longer read it, it has absorbed the design. The test for any line is this: would a person need to approve a change to it?
