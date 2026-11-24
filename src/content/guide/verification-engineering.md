---
title: Verification engineering
summary: When agents write the code, most of the engineering goes into showing that a clause holds. This chapter covers the discipline, the case that ties a clause to its evidence, and how to choose a method.
part: verification
order: 1
related: [environments, evidence, why]
---

## The inversion

When people wrote the code, the product took most of the effort. Testing was important, and it came second. Hand-written code was slow to produce and fairly dependable, so the balance made sense.

With agents writing the code, the balance turns over. Producing the change is quick. What takes the engineering is building a place where you can find out whether the change is right.

**Verification engineering** is the name for that work. It covers three things:

- deciding, for each clause, what would count as evidence;
- building [environments](../environments/) in which that evidence can be produced;
- keeping the evidence honest as the system changes.

It is engineering in the full sense. An environment is designed, has known limits, and can be wrong.

## What a test suite does not tell you

A conventional suite answers "did the tests pass?" It does not answer:

- which promise each test is evidence for;
- whether a test could ever fail;
- what the test assumed about the outside world;
- which promises have no test at all.

Verification engineering makes each of those an explicit, recorded fact.

## The case: one per clause

A **case** is the bridge between a clause and its evidence. It says how the clause will be shown true.

```markdown
clause: ENV-002   No robot moves while a person is in its zone.
tier: 2
depends_on: [src/dispatch/move_gate, src/adapters/motor]
assumptions: [ASM-007]

| Part | Claim                                          | Level | Method                 |
|------|------------------------------------------------|-------|------------------------|
| P1   | The move gate refuses motion in an occupied zone | 0   | Model check            |
| P2   | A person is detected within 200 ms             | 3     | Test on the real sensor |
| P3   | Stopping distance at rated speed               | 4     | Brake tests            |
| P4   | Sensors cover every shared zone                | 3     | Coverage sweep         |

Argument: P1 to P4 together cover motion during detection,
command latency, braking, and coverage.
```

A case has four elements.

1. **Parts.** The clause is split into pieces that can each be checked.
2. **Assumptions.** Whatever depends on the outside world is named.
3. **A method and an environment for each part.**
4. **An argument** for why those parts, taken together, are enough.

The argument is where real gaps hide. A verified move gate and a fast sensor do not add up to "no robot moves near a person". You also have to account for braking distance and for what the sensors cannot see. Writing the argument down is how someone notices.

## The weakest dependency decides the method

For each part, ask one question:

> What must be true outside the decision logic for this claim to hold?

The answer places the part at a **level**, and the level tells you the method.

| Level | The claim depends on | Method | For software alone |
|---|---|---|---|
| 0 | Pure logic | Model checking, proof | Decision logic with no side effects |
| 1 | Concrete code | Property tests | Code run against fakes |
| 2 | Components interacting over time | Simulation, scripted scenarios | Real processes and a local database |
| 3 | Real devices, drivers, latency | Tests on real hardware | Real infrastructure, a staging system |
| 4 | Physics, materials, people | Measurement, field data | Production traffic |

Levels classify dependencies. They do not rank confidence. A narrow proof about an abstract controller can leave a larger practical gap than a well-designed physical test.

Two consequences follow.

**Control falls as realism rises.** In a level 1 environment you can freeze time and hold a race condition open. On real infrastructure you cannot. So timing bugs are best caught low, and only observed high.

**A team's name for a test is not its level.** "Unit tests" are level 1 if they run real code. Place each part by what it depends on.

## Tiers: how much rigor

Writing a full case for every clause would cost too much. Cases are tiered by how critical the clause is.

| Tier | Which clauses | The case | Review |
|---|---|---|---|
| 0 | Most. Logic with no side effects | One part, generated | None |
| 1 | A few parts | A short argument | None |
| 2 | Safety, money, irreversible actions | A full argument, assumptions with treatments | A person |

Most clauses are tier 0. A person reads only the tier 2 arguments.

## The procedure for one clause

1. **Split** the clause into logic, assumptions and measured outcomes.
2. **Argue** why those parts establish the clause as deployed.
3. **Place** each part by its weakest dependency and choose the method.
4. **Treat** each assumption: how it is watched, how fast a failure shows, and what happens then.
5. **Decide** whether the evidence is enough, against the policy.
6. **Move the boundary, honestly.** If a part will not verify because the logic lives in the wrong place, move the logic. If it depends on the world, make that an assumption and give it a treatment.

Step 6 has a trap. Moving logic to where it can be checked is progress. Relabeling a hard problem as an assumption is not. The Record keeps the two apart by showing assumptions for what they are.

## Cases go stale on their own

Every case lists the code its clause depends on, with a fingerprint of that code. When the code changes, the fingerprint no longer matches and the clause shows as *unknown* until the case is checked again.

This one mechanism prevents the usual decay, in which a case written a year ago still claims to cover code that has since been rewritten.

## What proof does not give you

A proof shows that the logic satisfies a property for every input. It does not show:

- that the property is the right one. Stories cover that.
- that the world behaves as assumed. Treatments cover that.
- that the parts are enough. The argument covers that.
- that the code matches the model that was proved. Checks against recorded behavior cover that.

In the Record, "proven" always comes with its property, its model, its bounds, and its assumptions.

## Who does this work

The verifier agent builds the environments and checks. People decide what counts as evidence, review the arguments for critical clauses, and review any change that would weaken an environment.

That split matters for cost. If people had to do the checking themselves, the result would be as expensive as certified avionics. The bet is that agents carry the labor and people keep the judgment.
