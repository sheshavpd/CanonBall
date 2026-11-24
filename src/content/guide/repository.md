---
title: The repository layout
summary: CanonBall is, in practice, a way of organizing a repository. Each folder answers one question and has one kind of writer, so a person or an agent always knows what is true, what is proposed, and where their own work goes.
part: structure
order: 2
related: [layers, change, people-and-agents]
---

## The layout

```text
refunds/
├── spec/                      what is true today
│   ├── canon/                 what the system promises
│   │   ├── purpose.md  vocabulary.md  values.md
│   │   ├── requirements/      REQ-012-refund-window.md
│   │   ├── invariants/        INV-004-single-refund.md
│   │   ├── decisions/         DEC-031-auto-approve-under-100.md
│   │   ├── envelope/          ENV-003-no-payout-above-10k.md
│   │   ├── assumptions/       ASM-011-gateway-request-keys.md
│   │   └── policy/            what counts as evidence
│   └── blueprint/             how the clauses are kept
│       ├── architecture.md
│       ├── cases/             INV-004.md
│       └── environments/      VE-002-payments-sandbox.md
├── roadmap/                   what is proposed
│   ├── index.md               the order of work
│   ├── M2-faster-small-refunds/
│   │   ├── change.md          what changes in the system?
│   │   ├── diff/              the files this change proposes
│   │   └── tasks/             the agents' breakdown
│   └── unplanned/             incidents, bugs, small requests
├── src/                       what runs
├── verify/                    how we know
│   ├── envs/  checks/  checks/red/  faults/  monitors/
└── incidents/                 what went wrong
```

Two things are deliberately kept outside it: the **Record**, which is computed and published, and the **held-out scenarios**, which live where the building agents cannot read them.

## One question per folder

| Folder | The question | Who writes |
|---|---|---|
| `spec/canon/` | What does the system promise? | People approve. An agent drafts. |
| `spec/blueprint/` | How do we keep those promises? | The planner and verifier agents |
| `roadmap/` | What is proposed? | People rank it. Agents draft it. |
| `src/` | What runs? | The builder agent |
| `verify/` | How do we know? | The verifier agent |
| `incidents/` | What went wrong? | An agent drafts. People approve. |

The answer to "where does this go?" is always the folder whose question it answers. The answer to "may I change this?" is always written in the permissions.

## spec/ describes the system as it is

This is the rule that the rest of the layout exists to protect:

> **`spec/` describes the system as it stands today.** It never contains a promise the system does not yet keep.

A clause that has been agreed but not built is not in `spec/`. It sits in the `diff/` folder of its change, under `roadmap/`, until that change is released. Only a release writes to `spec/`.

The benefit is that `spec/` can be trusted without qualification. An agent starting a task reads it and knows what is true. A person joining the team reads it and knows what the system does. Nobody has to ask which parts are aspirational.

## roadmap/ holds everything proposed

Each planned change is a **milestone**: a folder with three things in it.

- `change.md` is one page that answers "what changes in the system?"
- `diff/` holds whole files in their final form. These are the clauses the change adds and the design for them. At release they are copied over the files of the same name in `spec/`.
- `tasks/` is the agents' breakdown of the work.

`index.md` lists the milestones in priority order. People maintain that order. It is the one file the whole team ranks together.

`unplanned/` holds incident repairs, bug fixes and small requests. Each has the same shape as a milestone, only smaller, and is released on its own.

## src/ and verify/

`src/` is the code. CanonBall does not require a particular layout inside it. It does [recommend one habit](../architecture/): keep the logic that decides apart from the code that touches the outside world.

`verify/` is the home of [verification engineering](../verification-engineering/).

| Folder | Holds |
|---|---|
| `envs/` | The verification environments |
| `checks/` | One check per story |
| `checks/red/` | For each check, a kept run in which it failed |
| `faults/` | Small deliberate defects used to show that checks can fail |
| `monitors/` | What watches the assumptions in production |

On a healthy CanonBall system, `verify/` is larger than `src/`. That is the method working as intended.

## Conventions

- **One clause per file,** named with its ID.
- **Markdown with front matter.** Machine-readable fields go in the front matter. Reasoning goes in the body.
- **Stable IDs with a prefix for the kind:** `REQ` promise, `INV` invariant, `DEC` decision, `ENV` limit, `ASM` assumption, `VE` verification environment, `INC` incident.
- **Start with one repository.** Split a part out only when it gets its own team or its own release schedule. The chapter on [larger systems](../composition/) covers what changes then.

## What the layout buys you

Most tools that put agents to work give them context about the product: a specification, some notes, the code. CanonBall gives them the state of the work as well.

At any moment an agent can read, without asking anyone:

- what is true now, in `spec/`;
- what is being changed, and why, in `roadmap/`;
- what the evidence says, in the Record;
- which files it may write.

That is enough to start a task correctly, and enough to notice when a task is drifting from its page.
