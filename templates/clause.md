---
id: ID-000
kind: KIND                # promise | invariant | decision | constraint | assumption
title: A short name
traces: []                # the clauses this one exists to serve, e.g. [REQ-012]
terms: []                 # every domain word the statement uses; each must be in vocabulary.md
owner: who approves it
tier: 0                   # 0 logic only; 1 crosses a side effect; 2 safety, money or irreversible
# cites: [tenet 1]        # for a decision settled by a tenet
# monitor: verify/monitors/NAME.md   # for an assumption
---
One sentence, in the words of vocabulary.md.

## Examples

### satisfies/1: A case where the clause holds
Given ...
When ...
Then ...

### violates/1: A case the clause forbids
Given ...
When ...
Then ...
