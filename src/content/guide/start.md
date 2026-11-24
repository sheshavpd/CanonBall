---
title: Start in a week
summary: Most of CanonBall is sequencing. The minimum fits on one existing system in about a week, and everything else is adopted when a real need shows up.
part: building
order: 3
related: [evidence, environments, limits]
---

## Pick the system

Choose one system you already run. Good candidates share three traits.

- **Logic-heavy.** It has rules that matter: money, eligibility, state transitions.
- **Long-lived.** You will be changing it for years.
- **Small enough to hold.** One service with one database is ideal.

Do not start with a prototype or a user-interface project. The method fits them poorly.

## The minimum

| Do this now | Leave for later |
|---|---|
| Ten clauses with stories and IDs. A vocabulary. A purpose page. | Sentence conventions, a values ranking, precedents as files |
| A policy with two files: what counts as evidence, and who accepts a release | The other policy files. Conservative defaults apply meanwhile. |
| One-line cases for ordinary clauses. Hand-reviewed cases for critical ones. | Generated cases, a verification plan, fidelity claims |
| The traceability check, as a script | Tracing changes in behavior to clauses |
| The Record as one generated table | The five statuses, signed evidence |
| One verification environment | The rest of the environment machinery |
| Three agent identities with separate permissions | Separate elicitor and planner agents |
| A roadmap page and a board in the tracker you already use | A purpose-built orchestrator |

Everything in the right-hand column stays in the method. You adopt each item when a pilot shows you need it.

## Day by day

### Days 1 and 2: write down what is true

Write the vocabulary. Then write ten clauses describing what the system does today: a few promises, a few invariants, one limit, one assumption with a one-line treatment. Give each one stories, both satisfying and violating.

Put them in a first change folder and release it. That first release writes `spec/`. From this point, only a release changes it.

Expect this to raise questions about words. Answer them in the vocabulary.

### Day 2: say what counts as evidence

Write two short policy files.

- **Acceptance.** Which clauses are critical. To begin: a clause is accepted when every story has a check, every check passed at this commit, and every violating story has a recorded failure.
- **Gates.** Three lines. A person accepts every release. Who reviews critical cases. Who approves when an owner is away.

Add the traceability check to continuous integration. It is a script that reads front matter and fails the build when something traces to no clause.

### Days 3 to 5: build one environment

This is the largest piece of the week, which tells you where the work is.

1. **One command to start, one to destroy.** The service, its real local database, and a fake for each outside dependency.
2. **A short declaration,** ending with what the environment cannot show.
3. **Four verbs** as a small library: set up state, drive the system, make a dependency misbehave, observe.
4. **One check per story,** each naming the story it encodes.
5. **A recorded failure for every violating story.** Break the build with a small patch, run the check, keep the failing output.
6. **A hook in the test runner** that writes one line of evidence per check per run.

There is a prerequisite. The service must be startable with its outside dependencies pointed elsewhere. If it is not, creating that seam comes first, and the week slips by however long it takes.

### Day 5: compute the Record

Write a script that joins three things: the list of stories, the cases, and the lines of evidence. It prints one row per clause.

```text
INV-003 | unsupported | checks 3/3 | seen to fail 1/2 | missing: violates/2
```

Publish that table as a page. Do not commit it.

### Throughout: separate the identities

Create three agent identities with write access limited by path.

- One drafts clauses and plans.
- One writes `src/`.
- One writes `verify/`.

Keep a handful of scenarios, written by people, in a repository none of the three can read.

## What you have at the end

- A `spec/` you can trust to describe the system as it is.
- A Record that says, per clause, whether there is evidence.
- At least one clause honestly shown as unsupported. That is the method working.
- A private [CanonBall](../canonball/): canon, build and Record at one commit.

## The first surprise

Some clause will stay unsupported because the environment cannot check one of its stories honestly. A typical case is a race between two requests, which needs a way to hold a timing gap open that you have not built yet.

Leave it unsupported and name the missing story. Writing a check that cannot really fail would turn the row green and make the Record worthless.

## What comes next

Run changes through it. Twenty ordinary rule changes, each starting as a change page, will tell you more than any amount of setup. Include a refactor, a bug fix, an ambiguous request and one failed release, and compare against the same changes done your usual way.

Measure four things from the first day.

- Minutes of a person's time per change, by gate.
- Escapes: changes that passed every gate and still caused a problem.
- How often evidence went stale.
- Where the effort went: clauses, cases, environments, review.

Those numbers decide which settings on [the dial](../delegation/) move, and which of the deferred pieces you need.
