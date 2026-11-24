---
title: Handing over decisions
summary: Some domains need a person in most decisions. Others are repeatable enough for agents to make them. CanonBall treats this as a setting per kind of decision, moved by track record, so the same method serves both.
part: change
order: 3
related: [people-and-agents, primitives, limits]
---

## One method, many settings

A team building billing rules and a team building robot safety software should not give agents the same freedom. Most methods force a choice: write the process for the cautious case and slow everyone down, or write it for the fast case and exclude the careful teams.

CanonBall does neither. The lifecycle is the same everywhere. What differs is a setting, kept per kind of decision, that says how much of that decision an agent may take.

## Classify the decision, not the topic

A decision is classified by three properties.

- **Reversibility.** What would it cost to undo, and who would have to agree?
- **Blast radius.** How much breaks if it is wrong?
- **Verifiability.** Can a machine check the result?

These give a small number of classes, from "reversible, local, checkable" to "irreversible, broad, uncheckable". The class decides where the setting starts. The subject matter does not.

This is why domains differ. A billing service has many decisions in the first class. A robot fleet has many in the last. Each ends up with different settings without anyone arguing about the method.

## Six levels

| Level | The agent | A person |
|---|---|---|
| 0 | Analyzes | Decides |
| 1 | Recommends, with reasons and stated confidence | Decides |
| 2 | Decides | Approves before anything happens |
| 3 | Acts | Reviews afterwards, every time |
| 4 | Acts | Audits a sample |
| 5 | Acts | Watches the metrics |

A new team starts every class at level 1. Agents recommend. People decide.

## How a setting moves

### Up, on track record

At level 1 the agent records what it would have decided. Two measures are kept: how often it agreed with the person, and how well its stated confidence matched the outcomes. Enough agreement over enough cases moves the class up one level.

The thresholds are written in advance in the policy, which no agent can edit. For example: "promote after 50 cases with at least 98% agreement and no severe disagreement."

### Down, on one failure

A single failure that gets through drops that class one level. The setting behaves like a credit score. It is not a license.

### Never on a model release

A better model does not move a setting. Evidence does. A better model will usually earn the move faster, and it still has to earn it. You are not asked to bet on a vendor's announcement.

## What never moves

Two kinds of decision stay with people at every setting.

- **What the system promises.** Agents may draft promises and stories. People approve them. Meaning is not something a machine can verify, so it cannot be delegated.
- **What is never allowed.** Limits have their own owner, with a veto.

## How decisions connect to design

"How much of the design should agents own?" is the question teams argue about most. CanonBall turns it into three small controls.

1. **The clause state.** A clause is *decided*, *deferred* to the agents within bounds, or *open*. Deferring a clause hands the choice over.
2. **Promotion.** Any design choice an agent recorded in the blueprint can be promoted to a decision in the canon. From then on a person owns it.
3. **The setting for the class.** Low-level design in a well-understood domain can reach level 4 or 5. High-level design in a new domain may stay at level 1 for a long time.

Whatever the setting, every decision still traces to a clause, and every clause to a promise. The setting changes who decides. It never changes what a decision must answer to.

## Precedents carry judgment

When an agent meets a case no clause covers, it asks. The person's answer is recorded as a **precedent**: the case, the ruling, and the reason.

> Order 4471, a bundle with one late item: refund the late item only, because the rest delivered value.

The agent applies precedents to similar cases and asks again when a case is materially different. When several precedents point the same way, the agent proposes a general rule, and a person approves it as a decision.

So delegation grows as the body of precedent grows. A short ranked list of values covers the one thing precedents cannot: which goal wins when two conflict.

## An illustration

| Kind of decision | Day one | Billing service, later | Robot fleet, later |
|---|---|---|---|
| What the system promises | 1 | 1 | 1 |
| What is never allowed | 1 | 1 | 1 |
| Choices a customer would notice | 1 | 2 | 1 |
| Internal design | 1 | 4 | 3 |
| Decision logic | 1 | 5 | 4 |
| Code that touches the outside world | 1 | 2 | 2 |
| Releasing with no clause changed | 1 | 5 | 2 |

These numbers are an example. Your thresholds are yours to write.

## What is unproven

Agreement measures imitation, not correctness. An agent that matches a person 98% of the time is as right as the person was. For classes where a wrong decision is severe, set the threshold higher. Some classes are so rare that they will never reach fifty cases, and those stay with people.
