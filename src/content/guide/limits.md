---
title: What is still a bet
summary: Parts of this method rest on technology that is decades old. Parts rest on things nobody has yet measured. This chapter separates the two, and says where the method does not fit.
part: building
order: 4
related: [why, start, delegation]
---

## What is solid

These pieces use established technology and can be relied on today.

- **Decision logic kept apart from side effects,** with recorded inputs and exact replay.
- **A canon as plain Markdown** with stories, stable IDs and ownership by path. It needs no new tooling.
- **Evidence at the lower levels, produced by agents:** property tests against fakes, and scenarios against real processes and a local database. This assumes the builder and verifier are kept apart.
- **Proofs for small pieces of decision logic,** with a person checking only the stories.
- **A first-week environment** built as the [previous chapter](../start/) describes.

## The bets

### Cost

This is the bet the whole method rests on.

Cases, arguments and treatments are expensive to write and to keep current. CanonBall assumes agents bring that cost down to the cost of ordinary software.

If agents only make the writing faster, while people still review every clause change, every critical argument, every adapter and every story, the result has the cost profile of certified avionics software without the regulation that justifies it.

The only way to settle this is to measure: setup cost apart from recurring cost, a person's minutes per critical case, and how often an argument went stale.

### Missing clauses

When the canon misses a case, every level of verification checks the wrong thing perfectly. A complete proof of an incomplete specification is still incomplete.

Stories and incidents reduce the problem. They do not solve it. Nothing does.

### The quality of arguments

An agent can draft a case. Whether it reliably notices the obligation that is missing, such as braking distance in a safety argument, is untested. The same doubt applies to what an environment claims about its own realism.

Until there is data, a person reviews critical arguments and any change that would weaken an environment.

### Evidence across teams

A parent's status depends on the test suites its providers must pass. A suite that misses something the protocol relies on gives a green result and a wrong promise. The approach is sound in principle and unproven in practice.

### Comparing behavior before and after

Replaying recorded inputs through the old and new versions is a useful backstop. It is overrated as a replacement for review. It measures first-order effects only. It produces long lists that people stop reading. And an empty comparison does not prove a refactor safe.

### Things nobody can monitor

Some assumptions cannot be checked from the observations available. Some failures show up too late to matter. For physical systems, most of the effort goes into treatments other than monitoring.

### Agents that share a blind spot

Splitting the builder from the verifier makes them independent in what they can change. It does not make them independent in how they read. Two agents built on the same model can misread a clause the same way. Whether a different model family for the verifier is worth its cost is an open question.

## Not yet

These are claims the method does not make.

**"People never read code."** Security and permission bugs live on inputs nobody recorded. Adapters and edges keep their review.

**"The physical levels run without people."** Agents can plan a hardware test and interpret its results. People still run the rig and inspect the weld.

**"Reorganize the company around it."** That assumes a reliability agents have not yet demonstrated. Measure the escape rate first.

**"It works for any software."** The fit is specific.

## Where it fits

| Fits well | Fits poorly |
|---|---|
| Business rules, workflows, services | Products that are mostly user interface |
| Systems that will be changed for years | Prototypes and throwaway code |
| Supervisory control | Hot numeric code |
| Anything with money, safety or irreversible actions | Work where the promise itself is still unknown |

## Open questions

- How should an agent judge its own uncertainty well enough to know when to ask?
- When is a new case "materially different" from every precedent?
- How should the canon change while old data and running instances still follow the previous version?
- What weight should evidence get when a model, and not a mechanical check, is the judge?
- Clauses can interact. Two cases can each be valid while their combination fails, through a shared assumption or a contested resource. There is no designed answer yet.
- Can the agents' own behavior be governed by a canon, with the same gates?

## How to read all this

The individual mechanisms are mostly borrowed: specification-driven development, deterministic runtimes, signed build evidence, safety engineering. What is new is the combination, and the claim that agents make it affordable.

That claim can be tested, cheaply, on one system. If the numbers from a first pilot are bad, you will have ten clauses, a vocabulary and one honest test environment to show for it. That is not a bad outcome for a week.
