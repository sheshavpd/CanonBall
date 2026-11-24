---
title: Writing got cheap. Knowing did not.
summary: An agent can write a change in minutes. Finding out what the change does, and what the system still promises afterwards, takes as long as it ever did. CanonBall exists to close that gap.
part: idea
order: 1
related: [primitives, verification-engineering, limits]
---

## A familiar afternoon

An agent opens a pull request that touches fourteen files. The tests pass. You have twenty minutes before your next meeting. You can read it properly and be late, or you can skim it, approve it, and hope.

Neither is a good answer, and both get worse as agents get faster. If you read everything, the agent waits for you and its speed is wasted. If you stop reading, every change becomes a risk that nobody measured.

## What changed

For most of the history of software, writing the code was the expensive part, and teams organized themselves around it. The author understood the change because the author had typed it. Review was a second pair of eyes on something a person already understood.

That no longer holds. An agent produces working code faster than a person can read it. The scarce thing is no longer the ability to produce a change. It is the ability to answer two questions about one:

- What does this change actually do?
- What does the system still promise after it?

A conventional codebase cannot answer either. Side effects are spread through the code. State is shared. Tests check whatever their author happened to think of. A green build tells you that some tests passed. It does not tell you which promises were tested, or how hard.

## Why a specification is not enough

Giving the agent a written specification helps with the first half of the problem. The agent builds the right thing more often, and several tools now do this well.

They stop one step short. They can tell you that a requirement "has a test". They cannot tell you what kind. A requirement covered by one example and a requirement covered by a proof look the same on a dashboard, and neither says what was assumed or left out.

## The idea CanonBall borrows

Safety engineering solved this problem decades ago for aircraft and medical devices. The tool is called an assurance case: a written argument, backed by evidence, that a system meets a claim. It says what was checked, by which method, under which assumptions, and what is still open.

Assurance cases are rare outside regulated industries for one reason. They are expensive to write and expensive to keep current by hand.

CanonBall makes one bet. Agents can bring that cost down to the cost of ordinary software. If the agents that write the code also maintain the argument for it, and independent machinery checks them, then any system can carry an account of its own promises.

## Where the effort goes instead

If the bet holds, the shape of the work changes.

| | When people wrote the code | When agents write it |
|---|---|---|
| Most effort goes to | Writing the product | Showing that the product keeps its promises |
| People review | Code, one change at a time | Promises and worked examples |
| "Done" means | Merged, with a green build | Every clause has evidence, and the weakest one is named |
| An incident produces | A fix | A fix and a permanent example |

The work in the second column has a name in this guide: **verification engineering**. It is the work of building places where a promise can be shown to hold, and shown to fail when it should. On an agent-built system, that is where most of the engineering goes.

## What the rest of the guide covers

The guide describes the method in the order you would meet it.

1. **The idea.** The few things people write to steer agents.
2. **The structure.** How a repository is organized so that people and agents always know what is true and what is proposed.
3. **How a change moves.** From one page of intent to a release, and who does what.
4. **Verification engineering.** Methods, environments, evidence.
5. **Building with it.** A recommended architecture, larger systems, a first week, and the open bets.

> **A claim to resist.** It is tempting to say that current models already do all of this without trouble. They can do most of the labor. The method is what makes the labor trustworthy, and that trust comes only from running it and measuring the result.
