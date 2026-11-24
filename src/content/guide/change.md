---
title: How a change moves
summary: The whole method is organized around one thing, which is moving a change into a running product. A change starts as one page, is built and verified against that page, and ends as a release.
part: change
order: 1
related: [repository, people-and-agents, evidence]
---

## Three objects

Three things carry all the work.

- **The spec** is `spec/`: what is true of the system today.
- **A change** is a folder in `roadmap/`: a page that says what should become true, the files that would make it so, and the tasks to build them.
- **A release** is the event that makes it true. It is the only thing that writes to `spec/`.

Other tools give an agent context about the product. These three objects give it the state of the work.

## The change page

A planned change is a **milestone**. Its page, `change.md`, answers one question: what changes in the system?

```markdown
# Faster small refunds

What changes: refunds under $100 are approved automatically.
Nothing else changes.

Adds:      DEC-031
Stories:   2
Why now:   the review queue is the slowest step for small refunds.
status:    in progress
```

An agent drafts the page from conversations with the people who own the affected clauses. Those people agree to it. The `status` line is written by a program and by nobody else.

Beside the page sits `diff/`, holding every proposed file in its final form: the new clause with its stories, and the design and evidence plan for it. Nothing in `diff/` is canon yet.

## How big a milestone is

Three rules set the size.

1. **It delivers something a customer can use, end to end.** It crosses every component the change needs: the infrastructure, the service, the screen. A milestone for one component is a task inside some other milestone.
2. **It can be read in a minute.** If it cannot, split it.
3. **It changes at least one clause.** A change that alters no clause is a refactor, and takes the shorter path described below.

## The path

| Step | What happens | Who |
|---|---|---|
| **Words** | Any new noun is defined in the vocabulary. | An agent asks. A person answers. |
| **Propose** | The change page and its stories are drafted and agreed. | People agree. This is the agreement gate. |
| **Plan** | The design, the cases and the evidence plan are written, before any code. | Planner and verifier agents |
| **Build** | The code is written, in named tasks. | Builder agent |
| **Verify** | Environments, checks and injected faults are built. | Verifier agent |
| **Record** | Status is computed for every clause, with the change applied. | A program |
| **Release** | The proposed files are copied into `spec/`. A CanonBall is published. | People accept, when there is risk to accept |
| **Operate** | Monitors watch the assumptions. | Everyone |

Two steps deserve a closer look.

### Plan comes before code

The plan fixes what will count as evidence before the builder writes anything. This is the same reasoning as registering a hypothesis before running an experiment. If the tests are written after the code, they can be shaped to fit it.

The plan also states a **predicted change in behavior**: "refunds under $100 move from review to automatic approval, and nothing else changes." Later, a program compares the prediction with what actually changed, and people read only the mismatches. Each mismatch is a bug, a gap in the canon, or a wrong prediction.

### Build and verify run side by side

Both agents work from the same plan. The builder can run the verifier's checks. It cannot edit them.

## The release rule

A change may be released when two things are true of the Record computed with the change applied:

1. every clause the change touches is accepted;
2. no clause the change did not touch has become worse.

When that holds, a program copies the files from `diff/` over the files of the same name in `spec/`, moves the change folder to the archive, and publishes a CanonBall. No person edits `spec/` by hand.

A person must accept the release only when there is risk to accept. The chapter on [people and agents](../people-and-agents/) lists those cases.

## Unplanned change

Not every change is planned. An incident, a bug, or a one-line request gets a folder under `roadmap/unplanned/` with the same shape as a milestone and a single task.

- A **refactor** alters no clause. It needs no agreement on stories, because there are none. It is released when behavior is shown to be unchanged.
- A **bug fix** nearly always sits in behavior that no clause covered. So it is a gap in the canon. The failing case becomes a story, an invariant is proposed, and a person approves both in a short agreement.
- An **incident** arrives the same way, from `incidents/`.

All three are released by the same rule. Operating the product and building it use one path.

## Several changes at once

Two milestones can be built at the same time if they touch different clauses. Each is released when it is ready, in any order, and judged against whatever `spec/` is at that moment.

Two milestones that touch the same clause are one milestone. The agent merges their pages.

This has a consequence worth knowing early. How much work can run in parallel is decided by how the product is divided, and it is decided at the start. A product cut into one capability that every change touches will run one change at a time, whatever the process says.

## What people do meanwhile

People are not waiting at the end of this path. Their recurring acts are these:

- agree to the next change pages and approve their stories;
- answer questions, most of which arrive while a page is being drafted;
- rank `roadmap/index.md` together, weekly;
- accept a release when the policy asks.

The pages people agree to are different from the pages agents are building. So the usual pattern is that people shape upcoming changes while agents build the agreed ones. Attention from people is the scarce resource, and work in progress is limited by it. Agents do not start work that will only wait in a queue.
