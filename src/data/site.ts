export const site = {
  name: 'CanonBall',
  tagline: 'The lifecycle agents can run and people can trust.',
  description:
    'CanonBall is a method for building and operating software with AI agents. People write down what the system must do. Agents build it and produce the evidence. Every release ships the clauses, the build and the evidence together.',
};

export const parts = [
  { id: 'idea', title: 'The idea', blurb: 'Why the work changed, and the few things people write to steer it.' },
  { id: 'structure', title: 'The structure', blurb: 'How a repository is organized so that people and agents always know where they stand.' },
  { id: 'change', title: 'How a change moves', blurb: 'From one page of intent to a release, and who does what along the way.' },
  { id: 'verification', title: 'Verification engineering', blurb: 'Where most of the engineering now goes: showing that a clause holds.' },
  { id: 'building', title: 'Building with it', blurb: 'A recommended architecture, larger systems, a first week, and the open bets.' },
] as const;

export type PartId = (typeof parts)[number]['id'];

/** What people write. Each is a clause kind, or supports one. */
export const written = [
  {
    id: 'vocabulary', name: 'Vocabulary', slug: 'vocabulary',
    what: 'The words the team uses, each defined once.',
    example: 'Delivery: the carrier’s delivered scan for the last item of an order.',
    why: 'So that a person, an agent and a check all mean the same thing by the same word.',
  },
  {
    id: 'promise', name: 'Promise', slug: 'primitives',
    what: 'What the system does for someone.',
    example: 'A customer can request a refund within 30 days of delivery.',
    why: 'It is the reason any code exists. Everything else traces back to one.',
  },
  {
    id: 'invariant', name: 'Invariant', slug: 'primitives',
    what: 'What must always be true.',
    example: 'A refund is never issued twice for the same order.',
    why: 'It keeps a promise safe to make. After an incident, it is how the fix becomes permanent.',
  },
  {
    id: 'decision', name: 'Decision', slug: 'primitives',
    what: 'A choice that could have gone another way, written down.',
    example: 'Refunds under $100 are approved automatically.',
    why: 'Otherwise an agent decides it for you, and may decide differently next time.',
  },
  {
    id: 'limit', name: 'Limit', slug: 'primitives',
    what: 'What is never allowed, whatever the goal.',
    example: 'No payout above $10,000 without review.',
    why: 'Some lines are not the product team’s to move. A limit has its own owner, with a veto.',
  },
  {
    id: 'assumption', name: 'Assumption', slug: 'primitives',
    what: 'A fact about the outside world the system relies on.',
    example: 'The payment gateway pays at most once per request key.',
    why: 'Evidence holds only while the assumption does, so each one is watched in production.',
  },
  {
    id: 'story', name: 'Story', slug: 'stories',
    what: 'One worked example of a clause.',
    example: 'Given order 4471 was refunded once, when a second request arrives, then it is rejected.',
    why: 'Plain sentences hide decisions. People approve examples, and checks are written from them.',
  },
] as const;

/** What machines produce in answer. */
export const computed = [
  {
    id: 'evidence', name: 'Evidence', slug: 'evidence',
    what: 'The result of a check that could have failed.',
    why: 'A pass means nothing unless the same check has been seen to fail.',
  },
  {
    id: 'record', name: 'The Record', slug: 'evidence',
    what: 'The status of every clause, computed from evidence.',
    why: 'Nobody gets to write "done". The weakest link is named, not averaged away.',
  },
  {
    id: 'canonball', name: 'A CanonBall', slug: 'canonball',
    what: 'One release: the clauses, the build and the Record, fixed together.',
    why: 'It answers "what does this system promise, and how do you know?" without reading code.',
  },
] as const;

export const steps = [
  { n: 'Words', k: '', say: 'Agree on the words first. Agents read vocabulary.md before anything else.', ids: ['vocab'], focus: 'vocab' },
  { n: 'Propose', k: 'p', say: 'A person agrees to one page that answers "what changes in the system?".', ids: ['index', 'm2', 'change'], focus: 'change' },
  { n: 'Plan', k: 'a', say: 'Agents write the proposed clauses, the design, and the plan for evidence beside the page. Nothing in spec/ changes yet.', ids: ['m2', 'diff', 'tasks'], focus: 'diff' },
  { n: 'Build', k: 'a', say: 'One agent writes the code.', ids: ['src'], focus: 'src' },
  { n: 'Verify', k: 'v', say: 'Verification engineering. A different agent builds the environment, the checks and the injected faults.', ids: ['verify', 'envs', 'checks', 'red', 'faults', 'holdout'], focus: 'verify' },
  { n: 'Record', k: 'v', say: 'A program computes the status of every clause, with the change applied.', ids: ['record'], focus: 'record' },
  { n: 'Release', k: 'p', say: 'The proposed files are copied into spec/. The spec now describes the new system, and a CanonBall is published.', ids: ['spec', 'canon', 'dec', 'bp', 'ball'], focus: 'ball' },
  { n: 'Operate', k: '', say: 'A monitor fires. The incident becomes a small change and follows the same path.', ids: ['monitors', 'inc', 'unpl'], focus: 'inc' },
] as const;

export const dial = {
  levels: [
    'Agent analyzes, a person decides',
    'Agent recommends, a person decides',
    'Agent decides, a person approves first',
    'Agent acts, a person reviews after',
    'Agent acts, people audit a sample',
    'Agent acts, people watch the metrics',
  ],
  scenarios: ['Day one', 'Billing service, later', 'Robot fleet, later'],
  rows: [
    { name: 'What the system promises', sub: 'Promises, stories, vocabulary', v: [1, 1, 1], lock: true },
    { name: 'What is never allowed', sub: 'Limits on safety, money, irreversible actions', v: [1, 1, 1], lock: true },
    { name: 'Choices a customer would notice', sub: 'Thresholds, policies', v: [1, 2, 1], lock: false },
    { name: 'Internal design', sub: 'Module layout, retries, data shapes', v: [1, 4, 3], lock: false },
    { name: 'Decision logic', sub: 'Code with no side effects', v: [1, 5, 4], lock: false },
    { name: 'Code that touches the outside world', sub: 'Adapters, permissions', v: [1, 2, 2], lock: false },
    { name: 'Releasing with no clause changed', sub: 'Refactors, upkeep', v: [1, 5, 2], lock: false },
  ],
};
