---
title: What a CanonBall is
summary: The canon says what a system promises. A CanonBall is the canon bound to the build that keeps those promises and the Record that shows it, at one moment. Every release is one.
part: structure
order: 3
related: [layers, evidence, change]
---

## The name

**Canon** is the set of clauses a system is held to. A **CanonBall** is what you get when you fix three things together at the moment of a release:

1. the canon as it stands,
2. the build that keeps it,
3. the Record that shows the build keeps it.

The method takes its name from that artifact, because the artifact is the point. Each iteration of the work ends in one, and the progress of a system is a sequence of them.

```text
CanonBall 12   the system before this change. 4 clauses, all accepted.
CanonBall 13   a milestone is released. + DEC-031
CanonBall 14   an incident is repaired. + INV-009
```

## The question it answers

Hand someone a conventional release and they can run it. To find out what it promises, they read the documentation and hope it is current. To find out whether it keeps those promises, they read the code or trust the team.

A CanonBall answers both without anyone reading code:

> What does this system promise, and how do you know?

That question is asked by different people at different times. A customer deciding whether to depend on you asks it. So does an auditor, and so does the engineer who inherits the system two years later.

## What is inside

```text
CanonBall 13
  canon    spec/canon at this release
  build    commit 3f9c
  record   4 accepted, 0 unsupported
  notes    + DEC-031 Refunds under $100 are approved automatically
```

Four properties make it more than a tagged commit.

### Release notes are clause changes

A new CanonBall means these promises changed. The notes are the difference between two canons, and the Record shows which evidence moved with them. Versioning follows behavior, not files.

It follows that weakening a clause others rely on is a breaking release, however small the code change. Their owners are told.

### The evidence can be re-checked

A status that nobody else can reproduce is a claim. So the evidence ships with what is needed to run it again: a proof with the inputs to its checker, a simulation with its random seeds, a check result with the fingerprint of the code it ran against.

### Assumptions travel with it

A CanonBall states what it assumes about where it runs, the way a package states its dependencies. It includes the monitors that notice when an assumption stops holding.

### Scope stays visible

Each clause appears with its status, the conditions under which the evidence holds, and anything still open. A bare "passed" is never shown.

## Only clauses that are kept

A CanonBall contains the clauses the system keeps at that release. A clause that has been agreed and is still being built is not in it. This is the same rule that governs [`spec/`](../repository/): the canon describes the system as it is.

## For one team

For a single team building for itself, none of the packaging matters. A repository with a `spec/canon/` folder, a rule about who may release, and a Record that is computed on every push is already a private CanonBall.

Signing, registries and exchange formats become useful on the day you hand the artifact to someone who did not watch it being built. Until then they are overhead.

## Across teams

When one system depends on another, it pins the CanonBall version it relies on. When the provider publishes a new one, the dependent re-runs the checks that rest on it. The chapter on [larger systems](../composition/) describes how evidence composes this way without anyone reading another team's code.

## Is it a framework?

Not in the sense of something you install. There is no library to import. CanonBall is a method: a set of written artifacts, a repository layout, a division of work between people and agents, and a rule for what counts as a release. The tooling is small and mostly scripts, and you could write your own.
