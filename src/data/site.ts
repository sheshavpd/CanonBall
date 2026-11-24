export const site = {
  name: 'CanonBall',
  tagline: 'The lifecycle agents can run and people can trust.',
  description:
    'CanonBall is a method for building and operating software with AI agents. People write down what the system must do. Agents build it and produce the evidence. Every release ships the clauses, the build and the evidence together.',
};

export const parts = [
  { id: 'start', title: 'Start here', blurb: 'Why the work changed, and the one picture that explains the method.' },
  { id: 'walkthrough', title: 'One milestone, station by station', blurb: 'A milestone of a refunds service, followed from the first request to the running system.' },
  { id: 'write', title: 'What people write', blurb: 'The few written things people use to steer agents.' },
  { id: 'structure', title: 'How it is organized', blurb: 'The layers, the repository, the release, and who does what.' },
  { id: 'verification', title: 'Verification and observability', blurb: 'Where most of the engineering now goes: showing that a clause holds, and seeing inside the system.' },
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
    id: 'tenet', name: 'Tenet', slug: 'tenets',
    what: 'Which good thing wins when two conflict.',
    example: 'A person reviews before money moves, when in doubt.',
    why: 'An agent facing an undecided choice recommends the way the team would, and says which tenet it used.',
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
    id: 'constraint', name: 'Constraint', slug: 'primitives',
    what: 'What is never allowed, whatever the goal.',
    example: 'No payout above $10,000 without review.',
    why: 'Some lines are not the product team’s to move. A constraint has its own owner, with a veto.',
  },
  {
    id: 'assumption', name: 'Assumption', slug: 'primitives',
    what: 'A fact about the outside world the system relies on.',
    example: 'The payment gateway pays at most once per request key.',
    why: 'Evidence holds only while the assumption does, so each one is watched in production.',
  },
  {
    id: 'example', name: 'Example', slug: 'examples',
    what: 'One worked case of a clause: given, when, then.',
    example: 'Given a $40 refund for order 4471 has been paid, when the same request arrives again, then the customer has been paid $40, once.',
    why: 'Plain sentences hide decisions. People approve examples, and each check is written from one.',
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
    id: 'record', name: 'Verification Record', slug: 'evidence',
    what: 'The status of every clause, computed from evidence.',
    why: 'Nobody gets to write "done". The weakest link is named, not averaged away.',
  },
  {
    id: 'canonball', name: 'A CanonBall', slug: 'canonball',
    what: 'One release: the clauses, the build and the Verification Record, fixed together.',
    why: 'It answers "what does this system promise, and how do you know?" without reading code.',
  },
] as const;

/** The milestone M2, followed through the repository one station at a time. */
export const steps = [
  { n: 'Collect', k: 'p', say: 'Three requests gather into one milestone. An agent drafts a one-page proposal, and a person agrees to it and ranks it.', ids: ['notes', 'index', 'm2', 'change'], focus: 'change' },
  { n: 'Shape', k: 'p', say: 'People and agents settle the decision and its examples, the design and the evidence plan. They are written as whole files beside the proposal. Nothing in spec/ changes yet.', ids: ['agents', 'tenets', 'vocab', 'm2', 'diff', 'tasks'], focus: 'diff' },
  { n: 'Build', k: 'a', say: 'The builder writes the code, and uses the observability tools to see what it does.', ids: ['src', 'observe'], focus: 'src' },
  { n: 'Verify', k: 'v', say: 'Verification engineering. A different agent extends the environment, writes the checks, and shows each one failing first.', ids: ['verify', 'envs', 'checks', 'red', 'faults', 'holdout'], focus: 'verify' },
  { n: 'Review', k: 'a', say: 'An agent reviews the milestone against its clauses and the Verification Record. This one is on the path that moves money, so its owner reviews it too.', ids: ['record', 'policy', 'case'], focus: 'record' },
  { n: 'Release', k: 'v', say: 'A program copies the proposed files into spec/. The spec now describes the new system, and CanonBall 13 is published.', ids: ['spec', 'canon', 'dec', 'bp', 'ball'], focus: 'ball' },
  { n: 'Operate', k: '', say: 'A customer is wrongly refused. The on-call agent reads the decision log, and the fix comes back on the express belt.', ids: ['observe', 'monitors', 'inc', 'unpl'], focus: 'inc' },
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
    { name: 'What the system promises', sub: 'Promises, examples, vocabulary', v: [1, 1, 1], lock: true },
    { name: 'What is never allowed', sub: 'Constraints on safety, money, irreversible actions', v: [1, 1, 1], lock: true },
    { name: 'Choices a customer would notice', sub: 'Thresholds, policies', v: [1, 2, 1], lock: false },
    { name: 'Internal design', sub: 'Module layout, retries, data shapes', v: [1, 4, 3], lock: false },
    { name: 'Decision logic', sub: 'The functional core: code with no side effects', v: [1, 5, 4], lock: false },
    { name: 'Code that touches the outside world', sub: 'Adapters, permissions', v: [1, 2, 2], lock: false },
    { name: 'Releasing with no clause changed', sub: 'Refactors, upkeep', v: [1, 5, 2], lock: false },
  ],
};
