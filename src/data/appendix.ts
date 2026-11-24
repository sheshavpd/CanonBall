/** The CanonBall appendix for a repository's AGENTS.md. Kept short on purpose: an agent loads it on every task. */
export const appendix = `## Appendix: how work moves here (CanonBall)

This repository uses CanonBall. People decide what the system promises. Agents build it and produce the evidence. Read this before any task.

### Read first

1. This file.
2. \`spec/canon/tenets.md\`: which good thing wins when two conflict. Cite a tenet when you recommend.
3. \`spec/canon/vocabulary.md\`: every noun, defined once. Use these words and no synonyms.

### Where things are

- \`spec/\` is the system as it stands. Only a release changes it. Never edit it.
- \`spec/canon/\` holds the clauses people approved: promises (REQ), invariants (INV), decisions (DEC), constraints (ENV) and assumptions (ASM). Each has examples.
- \`roadmap/\` holds what is proposed. A milestone is a folder with \`change.md\`, the proposed files in \`diff/\`, and \`tasks/\`. \`roadmap/unplanned/\` holds repairs and upkeep.
- \`src/\` is the code. \`verify/\` holds the environments, checks and injected faults. \`observe/\` holds the signals the system emits and the tools that read them. \`incidents/\` holds what went wrong.

### The stations

Work moves in milestones through seven stations: Collect, Shape, Build, Verify, Review, Release, Operate. Know which station your task belongs to, and write only where that station writes.

### Rules

- No clause, no code. Every behavior traces to a clause. If you need behavior no clause asks for, stop and file a request.
- An undefined word, or a choice nobody has made: stop and ask, with the options and your recommendation.
- Near a constraint (ENV), or an action that cannot be undone: stop and ask.
- The agent that writes code does not write what judges it. The builder may run \`verify/\` and may not change it. Propose a correction.
- Every example gets one check. Every check must be seen to fail against an injected fault before its pass counts. Keep the failing run.
- Look before you reason. Use the tools in \`observe/\` to see what the system did. Log each new decision with the clause it applied and the inputs it used.
- Never write a status. The orchestrator computes task states and the Verification Record from what is in the repository.
- A repair that restores an existing promise, and work that changes no clause, go in \`roadmap/unplanned/\`. Anything that changes what is promised waits for a milestone.
- An agent reviews every change. A person reviews as well when the policy says the change is critical. Never hand a person a test file or a raw log to read.

### When you finish a task

Say what you changed, which clauses it traces to, what evidence exists, and what is still open.
`;
