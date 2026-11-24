---
title: Vocabulary
summary: A team that uses two words for one thing, or one word for two, will build the wrong system twice. vocabulary.md defines each noun once, and people and agents both work from it.
part: idea
order: 3
related: [primitives, stories, people-and-agents]
---

## The problem with "delivery"

Take the promise "a customer can request a refund within 30 days of delivery". It looks complete. Now ask three people when delivery happens.

- The warehouse lead says it is when the parcel leaves the building.
- The support lead says it is when the carrier scans it at the door.
- The engineer finds a `delivered_at` column and uses that, without knowing which of the two it records.

All three will read the promise and nod. The system that gets built will satisfy one of them. The other two will discover the difference from a customer complaint on day 29.

Agents make this worse and better. Worse, because an agent will pick a meaning without telling you. Better, because an agent will follow a written definition every single time.

## The file

`vocabulary.md` is part of the canon. It lists the nouns the team uses and gives each one a single definition.

```text
Order      One purchase by one customer.
Delivery   The carrier's delivered scan for the last item
           of an order. Not the dispatch.
Refund     Money returned to the customer for an order.
           Not store credit.
Payout     One transfer of money through the payment gateway.
```

Three rules make it work.

1. **One word per concept.** If "refund" is defined, nobody writes "reimbursement" or "return of funds".
2. **No undefined nouns.** A clause that uses a noun missing from the vocabulary is blocked until the word is defined.
3. **Agents read it first.** Before drafting a clause, planning a change, or writing a check, the agent loads the vocabulary.

## One language from promise to incident

The value of the file is that the same word then appears at every step of the work, with the same meaning.

| Where | What it says |
|---|---|
| Promise | A customer can request a refund within 30 days of **delivery**. |
| Story | Given order 4471 had its **delivery** on 3 March, when a refund is requested on 1 April, then it is accepted. |
| Code | `days_since(delivery.scanned_at)` |
| Check | `rig.order(delivery_days_ago=31)` |
| Incident | Refund refused on day 29. The **delivery** date was read from dispatch. |

The last row matters as much as the first. The people who operate the system describe what went wrong in the same words that were used to specify it. An incident report can then be turned into a story and a check without anyone translating.

This is the idea Eric Evans called a ubiquitous language: one vocabulary shared by the domain experts, the code, and the tests. CanonBall adds a reader who never gets tired of following it.

## Where entries come from

Most entries start as questions. While drafting a clause, the agent meets a word it cannot define and files a question:

```text
Q-044  What is a delivery?
       a) The parcel leaves our warehouse.
       b) The carrier's delivered scan.
       c) The customer confirms receipt.
```

A person picks an answer. The answer becomes the definition, and the question is kept as history. Undefined words are the most common source of open questions, so a vocabulary that is filling up is a sign of the team converging.

## Alignment across teams

A vocabulary belongs to a [unit](../composition/), which is a separately owned part of a larger system. A unit inherits its parent's vocabulary and may add to it.

Sometimes two teams honestly mean different things by one word. "Account" in billing is not "account" in identity. A unit may redefine an inherited word only by writing an explicit translation at its interface: this is what we call it, this is what you call it, and here is how one maps to the other. The disagreement stays, and it stops being silent.

## What it costs

A vocabulary is cheap to start and takes discipline to keep. Expect two kinds of friction.

- **Early on, it slows drafting.** The first ten clauses raise a dozen questions about words. That is the work arriving earlier than usual, when it is cheapest.
- **Later, people will want synonyms.** "Refund" will feel repetitive in prose. Keep it anyway. Elegant variation is a virtue in essays and a defect in specifications.
