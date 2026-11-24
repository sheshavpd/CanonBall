---
title: Stories, and writing clauses agents read correctly
summary: A plain sentence hides decisions. A story is one worked example that exposes them. People approve stories, and checks are written from them.
part: idea
order: 4
related: [primitives, vocabulary, evidence]
---

## A sentence is not a specification

"No two robots in the same zone" reads as a complete rule. It leaves at least three things open. Does "in" mean any overlap of the robot's footprint, its center point, or a safety margin around it? What about a robot that has been granted the zone and has not yet arrived? What about one that is powered off?

Each answer is a decision. If the sentence is all you approve, an agent makes those decisions for you.

## What a story is

A **story** is one concrete example of a clause, written in a fixed shape: *given* a starting state, *when* something happens, *then* an outcome.

```gherkin
Given order 4471 was refunded once
When a second refund request arrives for order 4471
Then the request is rejected with "already refunded"
```

Every clause has stories of two kinds.

- **Satisfies.** A situation in which the clause holds.
- **Violates.** A situation the clause forbids.

The violating stories do most of the work. "Two concurrent requests both pay out" tells the reader more about what "never twice" means than the sentence does.

## People approve stories

In CanonBall a person never approves a formal statement, and never approves a bare sentence. A person approves stories. The sentence is accepted only through the examples that pin it down.

This puts human attention where it is most valuable. The step from prose to a precise property is the one step no tool can check. If the property is wrong, every check built on it verifies the wrong thing perfectly. Stories are how a person confirms the meaning before any of that machinery is built.

It also makes approval quick. Reading four examples and saying "yes, that is what I meant" takes a minute. Reading a formal property takes an expert.

## From a story to a check

Each story becomes one check, and the check names the story it encodes. That link is enforced. A story with no check shows up as a gap. A check with no story has no reason to exist.

For every violating story, the check must also be shown failing once, against a deliberately broken build. The chapter on [evidence](../evidence/) explains why.

## Conventions that help agents read

Compression works only when the writer and the reader share a codebook. These conventions fix the codebook. An agent enforces them while drafting and points out where a clause departs from them.

### Sentence shapes for promises

Five shapes cover nearly every promise. They come from a requirements notation called EARS.

| Shape | Pattern |
|---|---|
| Always | The system shall ... |
| On an event | When *trigger*, the system shall ... |
| In a state | While *state*, the system shall ... |
| Unwanted case | If *condition*, then the system shall ... |
| Optional feature | Where *feature* is present, the system shall ... |

### Words with one meaning

**Must**, **must not**, **should** and **may** each mean one thing, as in internet standards. *Must* is binding. *Should* marks a default that can be overridden for a recorded reason. *May* marks an option.

### Plain prose

- One idea per sentence.
- Active voice.
- Quantities with units: "within 200 ms", never "quickly".
- No elastic words. "Appropriate", "robust", "as needed" and "etc." each hide a decision.

### Say it back

After drafting a clause, the agent restates it in its own words. If the restatement surprises the author, the clause lost something in compression and is reworked before anyone approves it.

## When a formal property is derived

For clauses that matter enough, an agent later derives a precise property that a tool can check or prove. Three safeguards keep that property honest.

1. It is checked against every story. A property that disagrees with an approved example is wrong.
2. It is translated back into prose and compared with the clause.
3. A deliberately violating case is fed in, and the property must reject it.

## What a story cannot do

Stories pin down meaning at the points you thought to write. They say nothing about the points you did not. A clause with five stories can still be wrong in a sixth situation.

Two things reduce that risk and neither removes it. The agent proposes extra stories and files the ambiguities it finds as questions. And every incident adds the story that was missing. The honest summary is that stories make a missing case cheap to add. They do not tell you it is missing.
