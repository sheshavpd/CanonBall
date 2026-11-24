---
title: "Larger systems: units and roles"
summary: One team can hold one canon. A company cannot. Large systems are built from units of the same shape, and a parent trusts its children through contracts called roles, without reading their code.
part: building
order: 2
related: [canonball, repository, evidence]
---

## The problem with scale

A promise such as "a customer is never charged twice" is not kept by one service. Checkout starts the charge, payments executes it, orders records it. No single team's canon can contain the whole promise, and nobody can verify three teams' code as one system.

CanonBall handles this with two ideas: units and roles.

## A unit

A **unit** is a separately owned part of a system with its own canon, blueprint, build and Record. A service is a unit. So is the subdomain that contains it, and so is the domain above that. The shape repeats at every level. Only the size differs.

Six rules keep a tree of units consistent.

1. **A unit exists only where there is an owner and an interface.** Anything else is a module inside someone's design.
2. **Authority runs downward.** A child's canon may not contradict its parent's.
3. **Limits and policy are inherited, and may only get stricter.**
4. **The vocabulary is inherited.** A child redefines a word only with an explicit translation.
5. **Evidence runs upward through contracts.** A parent never reads a child's code.
6. **One team owns a unit.** A team may own several.

## Two relationships people confuse

**Governance.** The parent sets rules that every descendant follows: the limits, the policy, the vocabulary. The child adopts them. The parent does not track how.

**Composition.** A parent promise is delivered by several parts working together. The parent has to design how they cooperate, so it must know what it needs from each part. It does not need to know who provides it.

That second point is where roles come in.

## A role

A **role** is a contract that a unit defines for something it needs someone else to provide.

```markdown
id: ROLE-payer
version: 2
owner: post-purchase

Guarantees:
- A charge with key K executes at most once.
- Retrying charge(K) returns the original result.
Assumes:
- The caller supplies a K that is unique per order.
```

A role is published as a package with three things in it:

- the contract;
- a **conformance suite**, which is a set of tests any provider must pass;
- a **fake**, built from the contract, for the parent's own tests.

Nobody refers to a concrete partner. The parent writes its design against `ROLE-payer`. One file, the **assembly**, says who fills each role.

```yaml
bindings:
  ROLE-orderbook:   { provider: orders }
  ROLE-payer:       { provider: payments }
  ROLE-gateway:     { provider: external/acme-pay,
                      fallback: "queue refunds; settle on recovery" }
```

Replacing a provider is a one-line change to that file. The parent's proofs do not move.

## How evidence composes

A promise delivered by several providers has a case with three parts. None of them names a child.

| Part | Shows | How |
|---|---|---|
| **Protocol** | The cooperation is correct, given the contracts. | A model check over the role contracts alone, with failures, retries and duplicates as hostile inputs |
| **Assembly** | Every role is filled by a provider that meets it. | Computed from each provider's own Record |
| **Integration** | The assembled system behaves. | End-to-end checks |

The parent's proof takes each role's guarantees as given. Each provider's Record shows that its implementation meets the contract. Nobody verifies the whole system at once.

This is assume-guarantee reasoning, and it is the only kind of verification that scales with the number of teams.

## Staleness crosses boundaries

Each role has a fingerprint computed from its contract, its tests and its fake. If the parent changes the role, every provider's conformance result goes stale. If a provider weakens its own clauses, its conformance status drops and the parent's assembly part notices.

Each team pins the [CanonBall](../canonball/) versions it depends on. When a provider publishes a new one, its dependents re-run the checks that rest on it.

## Outside dependencies are roles too

A third-party payment gateway is handled the same way. Define the role you need, bind the current vendor in the assembly, and write your assumptions against the role.

Your assumption is their promise. If the vendor does not publish evidence, the binding carries its documentation in place of a Record, and your treatment of the assumption has to do more of the work.

Each binding is marked **hard** or **soft**. Hard means your capability fails when the provider fails. Soft means it degrades. A hard binding needs a fallback, or a risk that someone has accepted in writing.

## One coordinator per protocol

A cooperation among five services with no owner is the classic source of distributed failures. Assign "runs this protocol" to exactly one unit. The others promise only local guarantees.

## Teams do not wait for each other

A consumer's change can be released while the provider's is still being built. The affected clauses show as *pending* in the Record, and move to accepted when the provider's conformance is. Two teams' roadmaps do not have to be scheduled against each other.

## What it costs

Two extra artifacts: the role contracts and the assembly file. A role with a single provider feels like an interface with one implementation.

Keep it anyway. The contract is the allocation of responsibility you would have had to write in any case. The only new file is the assembly, and the first provider swap pays for it.

One risk remains open. A parent's status is only as good as its providers' conformance suites. A suite that misses something the protocol relies on gives a green result and a wrong promise.
