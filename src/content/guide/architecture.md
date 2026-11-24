---
title: An architecture agents can work in
summary: CanonBall does not dictate how your code is organized. It recommends one habit, because it decides how expensive evidence is. Keep the logic that makes decisions apart from the code that causes side effects.
part: building
order: 1
related: [environments, verification-engineering, delegation]
---

## Agents need structure more than people do

A person can hold a messy system in their head, because they were there when it got messy. An agent starts each task cold. What it can do well depends on how much of the system it can reason about from the files in front of it.

Good architecture has always made software easier to change. With agents it also decides how cheaply you can find out whether a change is right. That is the reason this method has an opinion about it.

## A recommendation, not a requirement

Everything in the earlier chapters works on any codebase. You can write clauses, build environments and compute a Record for a system laid out however you like.

What follows is the layout that makes all of it cheapest. Adopt it where it fits. Skip it where it does not.

## The idea in one sentence

**Separate the code that decides from the code that acts.**

Most code does both at once. A function reads the database, checks a rule, calls the payment gateway, and writes a row. To test the rule, you need a database and a gateway.

Pull the rule out.

```python
# Decides. No database, no network, no clock.
def decide_refund(order, already_refunded, amount_cents, today):
    if already_refunded:
        return Reject("already refunded")
    if (today - order.delivered_on).days > 30:
        return Reject("outside the refund window")
    if amount_cents < 100_00:
        return Approve(payout=amount_cents)
    return SendToReview()
```

```python
# Acts. Gathers the inputs, asks for a decision, carries it out.
def handle_refund_request(request):
    order = orders.load(request.order_id)
    decision = decide_refund(
        order, refunds.exists(order.id), request.amount_cents, clock.today()
    )
    if isinstance(decision, Approve):
        gateway.pay_out(order.id, decision.payout)
    ...
```

The first function contains every rule about refunds and touches nothing. The second contains no rules and touches everything.

## Three terms

**Decision logic** is code that, given explicit inputs, returns what should happen. It reads no clock, generates no random numbers, and performs no input or output. The same inputs always produce the same result.

**Inputs arrive as data.** The current time, a sensor reading, the output of a model: each is passed in. The logic never fetches them. When checking, treat every one of them as hostile.

**An adapter** is the one place where a particular side effect happens: paying out, sending an email, writing a record. Side effects are returned by the logic as data and carried out by an adapter. Until something passes through an adapter, nothing has happened.

## You already know this

The pattern has several names.

| Name | From |
|---|---|
| Functional core, imperative shell | Gary Bernhardt |
| Ports and adapters, or hexagonal architecture | Alistair Cockburn |
| The actor model with pure message handlers | Erlang and its descendants |
| Deciders | Event-sourced systems |

The specification behind this guide calls the two halves the *pure core* and its *doors*. Use whichever names your team already has.

## Why it makes evidence cheap

| Property of decision logic | What you gain |
|---|---|
| No side effects | It can be tested with thousands of generated inputs in seconds. |
| Explicit state and inputs | A model checker can explore every reachable state. |
| Deterministic | Any run can be replayed exactly from its recorded inputs. |
| Small and separate | The list of code that can break a clause is short and easy to name. |

That last row matters more than it looks. Every [case](../verification-engineering/) lists the code its clause depends on. If the rules about refunds live in one function, that list has one entry. If they are spread across handlers, queries and jobs, the list is long, it changes often, and the evidence goes stale constantly.

Adapters matter for a different reason. Each one is a narrow point through which an effect must pass. That makes it the natural place to enforce a [limit](../primitives/#limit), add an extra check, or require a person's approval before something irreversible happens.

## Why it suits agents

- **An agent can rewrite decision logic freely.** If the checks pass for every generated input, the rewrite is safe.
- **Review can be skipped where it is safe to skip.** People stop reading decision logic, because machines check it better than they would.
- **Review concentrates where it is still needed.** Adapters and permission checks are where inputs nobody recorded can cause harm. There are few of them, and they change rarely.

## What people still control

Agents write the design and may revise it. People keep five levers on it.

1. **The interface.** What consumers depend on is a promise, and changing it needs approval.
2. **The limits.** They have their own owner.
3. **How the product is divided.** Capabilities are split by whom they serve. This is decided early and sets how much work can run in parallel.
4. **The edges.** A small, fixed menu of deployment choices, and review of adapter code.
5. **Anything they choose.** Any design choice can be promoted to a [decision](../primitives/#decision) in the canon.

## Where it does not fit

- **Interface-heavy products.** Most of the value is in layout and interaction, which have no decision logic to extract.
- **Prototypes.** The structure costs more than a throwaway is worth.
- **Hot numeric code.** Passing state in and out explicitly can cost performance you need.

In these cases the rest of the method still applies. The evidence simply sits at a higher [level](../verification-engineering/#the-weakest-dependency-decides-the-method), where it is slower and less complete.

## Starting on an existing system

You do not need to restructure everything. Start with the code behind your two or three most important invariants. Extract the decision into a function with no side effects, leave the surrounding handler as the adapter, and write the checks against the function. Repeat when the next clause needs it.
