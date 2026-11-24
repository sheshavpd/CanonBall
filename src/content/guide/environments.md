---
title: Verification environments
summary: An agent can build a simulator in an afternoon, and an untested simulator produces confident, wrong evidence. A verification environment is a designed thing with seven parts, a stated limit, and a way to tell whether it can be trusted.
part: verification
order: 2
related: [verification-engineering, evidence, architecture]
---

## What an environment is

A **verification environment** is a place built to produce evidence about a clause. It is more than a test setup in three ways. It has a declared boundary. It states what it cannot show. And its own reliability is measured.

## Seven parts

Every environment, at every level, has the same seven parts. Hardware verification settled on them decades ago.

| Part | The question | In the refunds example |
|---|---|---|
| **Boundary** | What is under test? | The refunds service, at this commit |
| **Stimulus** | How is it driven? | Requests through the public interface |
| **World** | What surrounds it, real or faked? | A real local database; a fake payment gateway |
| **Probes** | What can be observed? | What the database holds; what the gateway paid |
| **Oracle** | What decides pass or fail? | A mechanical check on those observations |
| **Coverage** | What was exercised? | Which stories ran; which injected faults were caught |
| **Control** | What can be fixed in place? | The random seed, the clock, start and teardown |

## It states what it cannot show

Each environment is declared in a short file. The most important section is the last one.

```markdown
id: VE-002
name: payments-sandbox
level: 2
boundary: the refunds service, at this commit
world: real local store; a fake payment gateway
control: seeded; one command up, one command down

## What it cannot show
Real gateway timing. Whether the real gateway honors
request keys. Database contention. Production request shapes.
```

Evidence counts only inside what the environment can show. A check that passes here says nothing about real gateway timing, and the Record will not pretend otherwise.

Write this section first, before any code. It is the list of claims this environment must decline to support.

## Four verbs

An environment exposes a small, fixed set of actions. Checks, held-out scenarios and exploring agents all drive it through the same ones.

| Verb | Does |
|---|---|
| `rig` | Sets up the starting state |
| `act` | Drives the system through a real channel |
| `perturb` | Makes something misbehave: a timeout, a lost reply, a refusal |
| `observe` | Reads what actually happened, from an authoritative place |

Plus `up` and `down` to create and destroy the whole thing.

```python
def test_retry_after_lost_reply_pays_once(world):
    order = world.rig.order(amount_cents=1999).result
    assert world.perturb.gateway.lose_reply("payout", times=1).ok
    world.act.api.refund(order)          # the payout happens; the reply is lost
    world.act.api.refund(order)          # the client retries
    paid = world.observe.gateway.payouts(order=order).result
    assert len(paid) == 1
```

Two rules about these verbs prevent most self-deception.

**The environment never judges.** It drives and it observes. Deciding pass or fail is the check's job. A helper that returns "passed" has quietly become its own judge.

**Observe the authoritative place.** Read the database, or the fake's log of what it executed. Never read the test driver's belief about what it did.

## Three kinds of fidelity

An environment can be unrealistic in three separate ways.

- **World fidelity.** How real are the surroundings?
- **Actor fidelity.** Do the simulated users behave like real ones?
- **Oracle fidelity.** Does "passed" actually mean correct?

They fail independently, and the oracle is usually the weakest. For that reason oracles are preferred in a fixed order: a mechanical check first, then comparison against a reference model, then a model used as a judge with its noise measured, and human review last.

## Rules that keep an environment honest

### Evidence counts only within the validated range

If a simulator was validated for speeds up to 2 m/s, a scenario at 3 m/s is marked out of range. It does not count, even if it passes.

### An environment that never fails proves nothing

Every environment must catch faults it was not tuned on. Those faults are held where the verifier cannot read them. The share it catches is reported, and if that share falls, the evidence the environment produced is marked down.

### Fakes must pass the real thing's test suite

A fake payment gateway runs the same conformance suite as the real one. A fake that drifts from the real behavior fails its own test.

### Stricter is free, weaker is reviewed

Adding scenarios or tightening a check needs nobody's permission. Removing a scenario, loosening a threshold, or swapping the oracle is treated like weakening a clause, and a person reviews it. Otherwise one quiet edit could weaken all the evidence an environment ever produced.

## Races and timing

Some clauses are about what happens when two things overlap. To check one, the environment must be able to hold the gap open on purpose.

A **window** is the interval between two effects where an interruption changes the outcome: for example, between the gateway paying out and its reply arriving. Each environment says, for each window, whether it can hold it open, whether it is atomic here, or whether it is left to real timing.

A check about a race that never actually opened the window proves nothing, and is recorded that way.

## Designing one

1. **Collect the parts** of cases that need this boundary at this level.
2. **Write the declaration first,** starting with what it cannot show.
3. **Make it start and stop** with one command each.
4. **Expose the verbs.**
5. **Pin the fakes** to the real thing's test suite.
6. **Write the checks so that they fail first.**
7. **Inject faults and measure** what gets caught.
8. **Register it** with how often it runs and what it is allowed to cost.

## Shared environments

An environment used by many teams, such as a simulated warehouse, is treated as a system in its own right. It makes promises about its own fidelity, and other teams' evidence counts only while those promises are kept.

## What is hard

The simulator's realism is the long pole. This method makes weak fidelity visible. It does not make good fidelity cheap. On physical systems, expect most of the verification effort to go into the things that cannot be simulated at all.
