/** The CanonBall appendix of AGENTS.md, copied from the starter repository on main. Keep the two identical. */
export const appendix = `## Appendix: how work moves here (CanonBall)

This repository uses CanonBall. People decide what the system promises. Agents build it and produce the evidence that it keeps its promises.

### Read first

1. This file.
2. \`spec/canon/tenets.md\`: which good thing wins when two conflict. Cite a tenet when you recommend a choice.
3. \`spec/canon/vocabulary.md\`: every domain word, defined once. Use these words and no synonyms.

### Where things are

- \`spec/\` is the system as it stands. Only a release changes it. Never edit it by hand.
- \`spec/canon/\` holds the clauses people approved: promises (REQ), invariants (INV), decisions (DEC), constraints (ENV) and assumptions (ASM). Each clause is one file with worked examples.
- \`roadmap/\` holds what is proposed. A milestone is a folder with \`change.md\`, the proposed files in \`diff/canon/\` and \`diff/blueprint/\`, and \`tasks/\`. \`roadmap/unplanned/\` holds repairs and upkeep.
- \`src/\` is the code. \`verify/\` holds the environments, checks, injected faults and monitors. \`observe/\` holds what the system emits and the tools that read it. \`incidents/\` holds what went wrong.

### The stations

Work moves through seven stations: Collect, Shape, Build, Verify, Review, Release, Operate. Know which station your task belongs to, and write only where that station writes.

| Station | Writes |
|---|---|
| Collect | \`roadmap/notes/\`, \`roadmap/index.md\`, a milestone's \`change.md\` |
| Shape | the milestone's \`diff/\` and \`tasks/\` |
| Build | \`src/\`, \`observe/signals.md\` |
| Verify | \`verify/\`, \`observe/tools/\` |
| Review | the milestone's \`review.md\` |
| Release | \`spec/\`, \`CANONBALLS.md\` (by \`tools/canonball release\` only) |
| Operate | \`incidents/\`, \`roadmap/unplanned/\` |

### Rules

- Every behavior a customer or another system could notice traces to a clause. If you need behavior no clause asks for, stop and file a request in \`roadmap/notes/\`.
- An undefined word, or a choice nobody has made: stop and ask, with the options and your recommendation, citing a tenet.
- Near a constraint (ENV), or an action that cannot be undone: stop and ask.
- The agent that writes code does not write what judges it. A builder may run \`verify/\` and may not change it; it proposes a correction instead.
- Every example gets one check, marked with the example it encodes. Every check must be seen to fail against an injected fault (\`tools/canonball fault\`) before its pass counts.
- Look before you reason. Use the tools in \`observe/\` to see what the system did. Log each new decision with the clause it applied and the inputs it used.
- Never write a status. \`tools/canonball\` computes task states, milestone states and the Verification Record from what is in the repository.
- Work that restores an existing promise, or changes no clause, goes in \`roadmap/unplanned/\`. Anything that changes what is promised waits for a milestone.
- An agent reviews every change. A person reviews as well when the policy lists the change as critical. Never hand a person a test file or a raw log to read.

### When you finish a task

Say what you changed, which clauses it traces to, what evidence exists, and what is still open.
`;
