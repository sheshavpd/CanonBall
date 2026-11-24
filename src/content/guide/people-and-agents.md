---
title: People and agents
summary: Five agent roles do the work, each with its own permissions. People keep the decisions that cannot be checked by a machine. Two gates mark where a person must act.
part: change
order: 2
related: [change, delegation, evidence]
---

## The dividing line

The line between people and agents is not seniority. It is the kind of decision.

An agent may make any decision that can be verified and reversed, within limits people set. People keep five kinds:

1. **Goals and trade-offs.** There is no correct answer, only values.
2. **Accountability.** Someone must answer for an action that cannot be undone.
3. **Judgment nobody can check.** Taste, ethics, usability.
4. **Novelty.** A situation the canon does not cover.
5. **Trust with other people.** Customers, regulators, partners.

## Five agent roles

| Role | Does | Writes | Cannot |
|---|---|---|---|
| **Elicitor** | Drafts clauses and change pages from conversations. Files questions when something is ambiguous. | Proposed clauses | Approve anything |
| **Planner** | Writes the design, the case for each clause, and the predicted change in behavior. | The blueprint | Touch the policy |
| **Builder** | Writes the code. | `src/` | Change `verify/` |
| **Verifier** | Builds environments, checks, proofs and monitors. | `verify/` | Change `src/` |
| **Holdout keeper** | Maintains scenarios and faults the others never see. | A separate repository | Do anything else |

A sixth participant is not an agent at all. The **orchestrator** is a deterministic program that computes the state of every change and task from what exists in the repository. Agents do the work inside each state. They can be unreliable, because the program that decides what state the work is in is not.

## Why the roles are separate

The builder and the verifier are split for one reason: the agent that writes code must not write the checks that judge it.

A second agent can easily share the first one's misreading of a clause. So independence does not rest on the second agent's good intentions. It rests on permissions.

| Path | People | Elicitor | Planner | Builder | Verifier |
|---|---|---|---|---|---|
| `spec/canon/` | Approve | Drafts | | | |
| `spec/canon/policy/` | Write | No | No | No | No |
| `spec/blueprint/` | Review critical cases | | Writes | | Writes the verification plan |
| `src/` | Review code at the edges | | | Writes | Reads |
| `verify/` | | | | Reads, runs | Writes |
| Held-out scenarios | Write | | | No access | No access |
| The Record | Read | | | | |

Each role runs under its own identity, with write access limited by path. Three things follow.

- **No agent can write the policy.** The rules that decide what counts as evidence belong to people.
- **Neither building agent can read the held-out scenarios.** They report only pass or fail, so they cannot be learned.
- **The builder cannot fix a check it dislikes.** It can attach a proposed correction to a task, and the verifier applies or rejects it. A wrong check costs one review. The wall stays up.

## Two gates

A **gate** is a point where a person must act before work proceeds. There are two.

### The agreement gate: meaning

*Is this what we want the system to promise?*

It is passed once per change, when the owners of the affected clauses agree to the change page and approve its stories. It is always required when a change adds or alters a clause.

People approve stories here, never code and never formal statements.

### The release gate: accountability

*Does someone accept the remaining risk of releasing this?*

It is required only when there is risk to accept. The policy names the cases:

- the release touches a limit or an irreversible action;
- the status of some clause got worse;
- the remaining risk changed;
- the actual change in behavior differs from what was predicted, and the difference is not a bug.

Otherwise the release is automatic. A refactor that changes no clause and no behavior needs nobody.

## Every point where a person acts

| When | What a person does | In what form |
|---|---|---|
| Once, at the start | Owns the purpose, a capability, or the limits | A page |
| Per change | Agrees to the change page and approves its stories | A page and some examples |
| Per change, for critical clauses | Reviews the argument in the case | A short argument |
| Daily | Answers questions, mostly while a page is being drafted | A question with options |
| Per release, when the policy asks | Accepts it | One line |
| On an incident | Approves the new story and the proposed invariant | A story |
| When code at the edges changes | Reviews the code | A diff |
| Weekly | Reads the risk view and ranks the roadmap | A grid and a list |

If a person is handed a test file or a log to read, the system has failed. The only code a person is asked to read is the code that touches the outside world: adapters and permission checks.

## Ownership

People own by **capability**: a named thing the system provides to someone. They do not own by component. A capability has exactly one owner, the person who knows its consumer best. Most people own more than one.

A team of five on one system might look like this.

- A product owner, who owns the purpose and one or two capabilities.
- A limits owner, who is closest to the irreversible risks and holds the veto.
- Three others, each owning one or two capabilities.
- One or two of the five are also named reviewers of critical cases. They are chosen for skill in verification, and they do not review cases for capabilities they own.

Ownership is a right to approve. It is not a lane. Agents build across every component.

## What changes over time

Of the things people provide, three shrink as the system matures. Agents draft more of the canon from incidents and hazards, propose the stories themselves, and settle questions about definitions from earlier answers. People are left with trade-offs, ranking and release.

Ranking stays because it is a trade-off. Release acceptance stays as long as accountability does. How the rest is handed over is the subject of the [next chapter](../delegation/).
