# CanonBall starter

A repository laid out for building and operating software with AI agents. People write down what the system
promises. Agents build it and produce the evidence that it keeps those promises. Each release ships the
promises, the code and the evidence together, as a CanonBall.

The method is explained at **[canonball.org](https://canonball.org)**. This repository is the method in a form
you can start from.

## Start

1. Create your repository from this one: fork it, use it as a template, or clone it and push to your own remote.
2. Fill in the top part of [`AGENTS.md`](AGENTS.md): what the system is, its commands, and who decides what.
3. Write a first [`spec/canon/purpose.md`](spec/canon/purpose.md), three or four [tenets](spec/canon/tenets.md)
   and the [vocabulary](spec/canon/vocabulary.md) your domain needs.
4. Point your coding agent at the repository. It reads `AGENTS.md` first, and the appendix there tells it how
   work moves.
5. Take one small milestone through every station: `tools/canonball new milestone M1-name`.

Python 3.11 or later is the only requirement of the tooling. Your system can be written in any language;
see [`canonball.toml`](canonball.toml) for how checks report evidence.

## A worked example

The branch [`refunds-example`](https://github.com/sheshavpd/CanonBall/tree/refunds-example) is this starter
after a refunds service has been built with it. Its history has one commit per station: a milestone taken from
three requests to a release, then an incident repaired on the express belt. Each chapter of the
[walkthrough](https://canonball.org/guide/workflow/) links to the diff its station produced.

```sh
git clone -b refunds-example https://github.com/sheshavpd/CanonBall refunds
cd refunds
git log --oneline          # one commit per station
tools/canonball run && tools/canonball record
```

## The layout

```text
AGENTS.md                 read first, by every agent, on every task
canonball.toml            settings for tools/canonball
spec/                     the system as it stands; only a release changes it
  canon/                  what the system promises: clauses people approve
    purpose.md tenets.md vocabulary.md
    policy/               what counts as evidence, what counts as critical, who decides what
  blueprint/              how the promises are kept: architecture, environments, assurance cases
roadmap/                  what is proposed
  index.md                milestones in priority order
  notes/                  requests as they arrive
  M1-…/                   a milestone: change.md, diff/, tasks/, approvals.md, review.md
  unplanned/              repairs and upkeep: the express belt
  archive/                released milestones
src/                      what runs
verify/                   how we know: environments, checks, red proofs, injected faults, monitors
observe/                  what the system emits, and the tools agents use to read it
incidents/                what went wrong, and what it taught
templates/                starting points for clauses, milestones, reviews, environments, incidents
tools/canonball           the orchestrator
CANONBALLS.md             one entry per release, written by tools/canonball
```

## The orchestrator

`tools/canonball` is a program, not an agent. It computes; nobody writes a status by hand.

| Command | What it does |
|---|---|
| `check` | Every clause is well formed, uses only defined words, traces to real clauses, and every example has a check |
| `run` | Runs every check once and records a line of evidence for each |
| `fault PATCH` | Runs the checks against an injected fault in a scratch copy, and keeps the failing runs as red proofs |
| `record [ITEM]` | Computes the Verification Record, for `spec/` or for a milestone's release candidate |
| `status` | Computes the state of every milestone and unplanned item, and writes it into its `change.md` |
| `release ITEM` | Applies the release rule; if it holds, copies the proposed files into `spec/`, archives the item and records a CanonBall |
| `new …` | Starts a milestone, an unplanned item or a clause from a template |

The included workflow, [`.github/workflows/canonball.yml`](.github/workflows/canonball.yml), runs `check`,
`run`, `record` and `status` on every pull request.

## The website

The site at canonball.org is built from the `site` branch of this repository.
