/** Every figure in the guide: its caption, and a text description used in agents.txt, where there is no picture. */
export const figures: Record<string, { caption: string; text: string }> = {
  bottleneck: {
    caption: 'Twelve changes, two ways to review them.',
    text: 'Two panels. Left, "Review every change": twelve changes all go to a person, and the queue grows or the reading stops. Right, "Review the promises": two of the twelve alter a promise and go to a person; the other ten are checked by machines against promises already agreed.',
  },
  'clause-anatomy': {
    caption: 'The parts of a clause file.',
    text: 'A clause file, annotated line by line. id: a stable identifier that checks and evidence refer to. kind: one of the five kinds. state: how much freedom agents have (decided, deferred or open). owner: the one person who can approve a change. traces: the promise this clause exists for. Then the statement in one sentence, and the examples, which are what a person approves.',
  },
  'clause-kinds': {
    caption: 'How the five kinds of clause relate.',
    text: 'A promise sits at the center. Invariants and decisions exist to keep it. Constraints surround all three: they bound what any of them may do. Assumptions sit at the edge, describing the outside world the system relies on.',
  },
  'word-chain': {
    caption: 'One word, carried unchanged through every step of the work.',
    text: 'The word "delivery" appears with the same meaning in five places in turn: the promise, the example, the code, the check, and the incident report.',
  },
  'example-flow': {
    caption: 'An example becomes a check, and a check produces evidence.',
    text: 'Three boxes in a row. An example (given, when, then), approved by a person. A check that encodes it, written by the verifier agent. A line of evidence, produced by running the check.',
  },
  layers: {
    caption: 'Authority runs down the layers. Evidence runs back up.',
    text: 'Four layers stacked top to bottom: canon (what must be true, approved by people, binding), blueprint (how it will be made true, written by agents, revisable), build (what actually runs, written by agents, replaceable one checked change at a time), Verification Record (whether it is true, computed by a program, written by nobody). An arrow down the left side is labeled "constrains". An arrow up the right side is labeled "is discharged by".',
  },
  folders: {
    caption: 'Each folder answers one question and has one kind of writer.',
    text: 'Six folders. spec/canon: what does the system promise? People approve. spec/blueprint: how do we keep those promises? Agents write. roadmap: what is proposed? People rank it. src: what runs? The builder agent. verify: how do we know? The verifier agent. incidents: what went wrong? Kept permanently. Outside the repository: the Verification Record, computed, and the held-out scenarios, which building agents cannot read.',
  },
  balls: {
    caption: 'Progress is a sequence of CanonBalls.',
    text: 'Three CanonBalls in a row, each drawn with the CanonBall mark. CanonBall 12 is the system before the change. CanonBall 13 adds decision DEC-031 after a milestone is released. CanonBall 14 adds invariant INV-009 after an incident is repaired.',
  },
  release: {
    caption: 'A release copies the proposed files into spec/ and publishes a CanonBall.',
    text: 'Before the release, spec/ holds three clauses and the change folder holds one proposed clause, DEC-031. After the release, spec/ holds four clauses, the change folder is archived, and CanonBall 13 has been published.',
  },
  walls: {
    caption: 'Who can write what. Independence is a matter of permissions.',
    text: 'A grid of paths against roles. Canon: people approve, the elicitor drafts. Policy: people only. Blueprint: the planner writes, and the verifier writes the verification plan. src: the builder writes, the verifier reads. verify: the verifier writes, the builder reads and runs. Held-out scenarios: people write; neither the builder nor the verifier has access. The Verification Record: nobody writes; it is computed.',
  },
  case: {
    caption: 'An assurance case splits a clause into parts and argues that the parts are enough.',
    text: 'The clause "No robot moves while a person is in its zone" splits into four parts, each with a level and a method: P1 the move gate refuses motion (level 0, model check); P2 a person is detected within 200 ms (level 3, test on the real sensor); P3 stopping distance at rated speed (level 4, brake tests); P4 sensors cover every shared zone (level 3, coverage sweep). An argument joins them: together they cover motion during detection, command latency, braking and coverage.',
  },
  levels: {
    caption: 'As an environment becomes more realistic, you control less of it.',
    text: 'Five verification levels from 0 (pure logic) to 4 (physics and people). Realism rises from level 0 to level 4. Control falls over the same range: at level 0 and 1 you can freeze time and hold a race open; at level 3 and 4 you can only observe.',
  },
  environment: {
    caption: 'The seven parts of a verification environment.',
    text: 'Seven parts, with the refunds example for each. Boundary: the system under test, here the refunds service at this commit. Stimulus: how it is driven, here requests through the public interface. World: what surrounds it, real or faked, here a real local database and a fake payment gateway. Probes: what can be observed, here what the database holds and what the gateway paid. Oracle: what decides pass or fail, here a mechanical check on what the probes saw. Coverage: what was exercised, here the examples run and the injected faults caught. Control: what can be fixed in place, here the seed, the clock, and start and teardown.',
  },
  rollup: {
    caption: 'Lines of evidence roll up to parts, and parts to a status. The weakest link is named.',
    text: 'Three checks pass and feed part P1, which is evidenced. Part P4 has no evidence. The clause is therefore unsupported, and the Verification Record names P4 as the open obligation.',
  },
  'core-shell': {
    caption: 'Inputs arrive as data, the logic decides, and adapters carry out the effects.',
    text: 'Three boxes in a row. Inputs come in as data: the request, the current time, a sensor reading. Decision logic, the functional core: no database, no network, no clock; the same inputs always give the same answer; checked for every input. Adapters, the imperative shell: paying out, sending an email, writing a row; people still review this code.',
  },
  roles: {
    caption: 'A parent depends on roles. The assembly says who fills them.',
    text: 'A parent unit, post-purchase, defines three roles: order book, payer and gateway. The assembly binds them to the units orders and payments and to an outside vendor. Evidence flows upward: each provider passes the role\'s contract tests, and the parent reads that result without reading the provider\'s code.',
  },
  week: {
    caption: 'The first week. The environment is the largest piece.',
    text: 'A five-day timeline. Days 1 and 2: vocabulary and ten clauses with examples. Day 2: the policy and the traceability check. Days 3 to 5: one verification environment, checks, and recorded failures. Day 5: the Verification Record as one generated table. Throughout: separate agent identities.',
  },
};
