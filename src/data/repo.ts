/** The example repository shown on the landing page: a small refunds service. */
export type Writer = 'p' | 'a' | 'v' | 'n';

export interface Row {
  id: string;
  depth: 0 | 1 | 2;
  name: string;
  /** The question a top-level folder answers. */
  question?: string;
  writer: Writer;
  /** True for the file the example change adds. */
  proposed?: boolean;
  outside?: boolean;
  title: string;
  who: string;
  what: string;
  note?: string;
  file?: string;
  more: string;
}

export const rows: Row[] = [
  { id: 'agents', depth: 0, name: 'AGENTS.md', question: 'read first', writer: 'p', title: 'How to work here', who: 'people own it',
    what: 'The first file an agent reads. The top part is about this repository: its commands, its owners, and who leads which decisions. The appendix is a short summary of CanonBall, the same in every repository that uses it.',
    file: 'Read before every task:\n  AGENTS.md\n  spec/canon/tenets.md\n  spec/canon/vocabulary.md\n\nNo clause, no code.\nAn undefined word: stop and ask.\nNear a constraint: stop and ask.', more: 'repository' },
  { id: 'spec', depth: 0, name: 'spec/', question: 'what is true today', writer: 'n', title: 'The system as it stands', who: 'changed only by a release',
    what: 'What is true of the system today: the clauses it keeps, the design that keeps them, and the words they use. Nothing proposed lives here.',
    note: 'A release is the only thing that writes to it.', more: 'repository' },
  { id: 'canon', depth: 1, name: 'canon/', question: 'what we promise', writer: 'p', title: 'Canon: what the system promises', who: 'people approve',
    what: 'The clauses people have approved, one per file, in plain language, each with examples. It is the only part people must read in full.',
    note: 'A clause the system does not keep yet is not canon. It waits in roadmap/ until its change is released.', more: 'layers' },
  { id: 'vocab', depth: 2, name: 'vocabulary.md', writer: 'p', title: 'Vocabulary', who: 'people approve',
    what: 'Each noun is defined once. Synonyms are not allowed, and a clause that uses an undefined word is blocked. Agents read this file before anything else, so the same words run from the promise to the code, the check and the incident report.',
    note: 'It grows whenever an open question about a word is answered.',
    file: 'Order      One purchase by one customer.\nDelivery   The carrier\'s delivered scan for the last item\n           of an order. Not the dispatch.\nRefund     Money returned to the customer for an order.\nPayout     One transfer through the payment gateway.', more: 'vocabulary' },
  { id: 'tenets', depth: 2, name: 'tenets.md', writer: 'p', title: 'Tenets', who: 'people write',
    what: 'Which good thing wins when two conflict. A handful of lines, in priority order. An agent cites one when it recommends, so its recommendations lean the way the team would.',
    note: 'A tenet is not a clause. It is never checked and never appears in the Verification Record.',
    file: '1. A person\'s review over speed, when money moves.\n2. A slow refund over a wrongly refused one.\n3. A rule support can explain over a rule that approves more.', more: 'tenets' },
  { id: 'req', depth: 2, name: 'REQ-012-refund-window.md', writer: 'p', title: 'A promise', who: 'people approve',
    what: 'What the system does for someone. Everything below it in the repository exists because of a promise like this one.',
    file: 'id: REQ-012\nkind: requirement\n---\nA customer can request a refund within 30 days of delivery.', more: 'primitives' },
  { id: 'inv', depth: 2, name: 'INV-004-no-double-payout.md', writer: 'p', title: 'An invariant', who: 'people approve',
    what: 'What must always be true. People approve its worked examples, and the examples fix the meaning: here, that "twice" means the same request paid two times. A second, separate refund on an order is a new refund.',
    file: 'id: INV-004\nkind: invariant\ntraces: [REQ-012]\n---\nA refund is never issued twice for the same order.\n\nSatisfies:\n- The same request sent twice for order 4471 pays once.\n- A retry after a lost reply finds the original payout.\nViolates:\n- Two concurrent requests both pay out.', more: 'primitives' },
  { id: 'dec', depth: 2, name: 'DEC-031-auto-approve-under-100.md', writer: 'p', proposed: true, title: 'A decision', who: 'people approve',
    what: 'A choice that could have gone another way, written down. This one is proposed by the change in roadmap/. It becomes canon only when that change is released.',
    note: 'Follow the change to watch it arrive.',
    file: 'id: DEC-031\nkind: decision\ntraces: [REQ-012]\n---\nA refund is approved automatically while the total\nrefunded on the order stays under $100.\n\nWhy: tenet 1.\n\nSatisfies:\n- A $40 refund, nothing refunded before: approved\n  without review.\n- Two $60 refunds on one order: the second goes to review.\nViolates:\n- A $250 refund approved without review.', more: 'primitives' },
  { id: 'env', depth: 2, name: 'ENV-003-no-payout-above-10k.md', writer: 'p', title: 'A constraint', who: 'its own owner, with a veto',
    what: 'What is never allowed, whatever the goal. It protects people, money and actions that cannot be undone. If the answer to "can the product team change this?" is "not our call", it is a constraint. Safety engineers call these safety constraints.',
    file: 'id: ENV-003\nkind: envelope\n---\nNo payout above $10,000 without review.', more: 'primitives' },
  { id: 'asm', depth: 2, name: 'ASM-011-gateway-request-keys.md', writer: 'p', title: 'An assumption', who: 'people approve',
    what: 'A fact about the outside world the system relies on. No test can prove it about someone else\'s system, so it is watched in production by a monitor.',
    file: 'id: ASM-011\nkind: assumption\n---\nThe payment gateway pays at most once per request key.\n\nWatched by: verify/monitors/duplicate-payouts\nIf it fails: payouts stop, and an incident opens.', more: 'primitives' },
  { id: 'policy', depth: 2, name: 'policy/', writer: 'p', title: 'What counts as evidence', who: 'people only',
    what: 'The rules that turn evidence into a status, say when a person must accept a release, and set how far each kind of decision is handed to agents. No agent may write here.',
    note: 'This is where the dial is kept.', more: 'delegation' },
  { id: 'bp', depth: 1, name: 'blueprint/', question: 'how we keep it', writer: 'a', title: 'Blueprint: how the clauses are kept', who: 'agents write',
    what: 'The agents\' design: the architecture, one case per clause saying how it will be shown true, and the verification plan. Agents may revise it freely as long as it never contradicts canon.',
    note: 'A person can promote any design choice to a decision. From then on it is theirs.', more: 'layers' },
  { id: 'case', depth: 2, name: 'cases/INV-004.md', writer: 'a', title: 'The case for one clause', who: 'planner agent',
    what: 'It splits the clause into parts, names the environment that checks each part, and argues why the parts are enough. Cases about money and safety are reviewed by a person.',
    file: 'clause: INV-004\ndepends_on: [src/refunds/decide, src/refunds/payout]\n\nP1  A repeated request never pays again  checks     VE-002\nP2  The gateway pays once per key      assumed    monitored\n\nArgument: P1 and P2 cover every path that moves money\nfor an order.', more: 'verification-engineering' },
  { id: 'vedoc', depth: 2, name: 'environments/VE-002.md', writer: 'v', title: 'An environment, declared', who: 'verifier agent',
    what: 'Every verification environment states what it is, what it controls, and what it cannot show. Evidence counts only inside those limits.',
    file: 'id: VE-002\nname: payments-sandbox\nboundary: the refunds service, at this commit\nworld: real local store; a fake payment gateway\ncontrol: seeded; one command up, one command down\n\n## What it cannot show\nReal gateway timing. Whether the real gateway honors\nrequest keys. Production request shapes.', more: 'environments' },
  { id: 'road', depth: 0, name: 'roadmap/', question: 'what is proposed', writer: 'n', title: 'Everything proposed', who: 'people rank it',
    what: 'One folder per change. spec/ is the system as it stands. This is what might become it.', more: 'collect' },
  { id: 'notes', depth: 1, name: 'notes/', writer: 'a', title: 'Requests as they arrive', who: 'anyone asks, the elicitor files',
    what: 'Every request is a card: a complaint from support, a number from finance, a worry from risk. Related cards are gathered into one milestone.',
    file: 'support   small refunds wait two days in review\nfinance   most review time goes to refunds under $100\nrisk      split refunds must not slip past review', more: 'collect' },
  { id: 'index', depth: 1, name: 'index.md', writer: 'p', title: 'The order of work', who: 'people rank',
    what: 'The list of changes in priority order. Ranking it is the recurring human act. Agents build what has been agreed while people shape what comes next.',
    file: 'M0  first clauses            released\nM1  refund window            released\nM2  faster small refunds     in progress\nM3  refunds as store credit  draft', more: 'collect' },
  { id: 'm2', depth: 1, name: 'M2-faster-small-refunds/', writer: 'a', title: 'One milestone', who: 'agents draft, people agree',
    what: 'A folder for one milestone: its page, the files it proposes, and the agents\' tasks. An incident repair has the same shape, only smaller.', more: 'collect' },
  { id: 'change', depth: 2, name: 'change.md', writer: 'p', title: 'What changes in the system?', who: 'people agree',
    what: 'The change proposal: one page, drafted by an agent from conversations and agreed to by a person. People approve its examples. They do not review its code.',
    file: '# M2: Faster small refunds\n\nWhat changes: a refund is approved automatically\nwhile the total refunded on the order stays\nunder $100. Nothing else changes.\n\nGathers:   3 requests (support, finance, risk)\nAdds:      DEC-031\nExamples:  3, approved by the product manager\nstatus:    in progress   (written by the orchestrator)', more: 'collect' },
  { id: 'diff', depth: 2, name: 'diff/', writer: 'a', title: 'The proposed files', who: 'agents draft',
    what: 'Whole files in final form: the clauses this change adds, the design for them, and the plan for evidence. That plan is fixed before any code exists. Checks run against the release candidate: spec/ with these files applied.',
    note: 'Copied into spec/ at release, never before.', more: 'shape' },
  { id: 'tasks', depth: 2, name: 'tasks/', writer: 'a', title: 'The agents\' breakdown', who: 'agents',
    what: 'The planner slices the change into named tasks. The orchestrator, a program, computes each task\'s state from what exists in the repository. Nobody marks a task done.', more: 'build' },
  { id: 'unpl', depth: 1, name: 'unplanned/', writer: 'a', title: 'Unplanned work', who: 'agents draft',
    what: 'The express belt: incident repairs, bug fixes, refactorings and upkeep. Work that restores a promise or changes none. Each gets a small page and a few proposed files, skips the batching, and passes the same stations as a milestone.', more: 'operate' },
  { id: 'src', depth: 0, name: 'src/', question: 'what runs', writer: 'a', title: 'What runs', who: 'builder agent',
    what: 'The code. CanonBall does not dictate its layout. It does recommend one habit: keep decision logic apart from the code that touches the outside world. Logic with no side effects can be checked for every input. The thin layer that calls a database or a payment gateway is where people still read code.',
    note: 'You may know this as functional core, imperative shell, or as ports and adapters.', more: 'architecture' },
  { id: 'verify', depth: 0, name: 'verify/', question: 'how we know', writer: 'v', title: 'Verification engineering', who: 'verifier agent',
    what: 'This is where most of the engineering now goes. Writing the change is the small part. The work is building a place where a clause can be shown to hold, and shown to fail when it should. The builder can run everything here and change none of it.',
    note: 'Making an environment stricter is free. Making it weaker is reviewed.',
    file: 'A verification environment has seven parts\n\nboundary   what is under test\nstimulus   how it is driven\nworld      what surrounds it, real or faked\nprobes     what can be observed\noracle     what decides pass or fail\ncoverage   what was exercised\ncontrol    seed, clock, clean start and teardown', more: 'verification-engineering' },
  { id: 'envs', depth: 1, name: 'envs/VE-002/', writer: 'v', title: 'The environment', who: 'verifier agent',
    what: 'One command starts it and one destroys it: the service, its real local store, and a fake for each outside dependency. It drives the system and observes it. It never judges.',
    file: 'world.rig       set up the starting state\nworld.act       drive the public interface\nworld.perturb   make a dependency misbehave\nworld.observe   read what actually happened', more: 'environments' },
  { id: 'checks', depth: 1, name: 'checks/', writer: 'v', title: 'One check per example', who: 'verifier agent',
    what: 'Each check names the example it encodes. An example with no check is visible, and so is a check with no example.',
    file: '@example_of("INV-004#violates/1", "Two concurrent requests")\ndef test_two_requests_pay_once(world):\n    order = world.rig.order(amount_cents=4000).result\n    world.act.api.refund(order)\n    world.act.api.refund(order)\n    paid = world.observe.gateway.payouts(order=order).result\n    assert len(paid) == 1', more: 'evidence' },
  { id: 'red', depth: 1, name: 'checks/red/', writer: 'v', title: 'Proof that a check can fail', who: 'verifier agent',
    what: 'A check that has never failed proves nothing. Each one is run against an injected fault, and the failing run is kept here. Only then does its pass count.',
    file: '{"check": "test_two_requests_pay_once",\n "state": "failed",\n "ran_in": "red-proof",\n "fault_patch": "verify/faults/no-lock.patch"}', more: 'evidence' },
  { id: 'faults', depth: 1, name: 'faults/', writer: 'v', title: 'Injected faults', who: 'verifier agent',
    what: 'Fault injection: small patches that break one thing on purpose, applied to a scratch copy. An environment must also catch faults it was not tuned on, or its evidence is discounted.', more: 'environments' },
  { id: 'monitors', depth: 1, name: 'monitors/', writer: 'v', title: 'Monitors', who: 'verifier agent',
    what: 'They watch, in production, the assumptions the evidence rested on. When one fires, an incident opens. This is how operating the system feeds back into building it.', more: 'evidence' },
  { id: 'observe', depth: 0, name: 'observe/', question: 'how agents see inside', writer: 'a', title: 'Observability', who: 'builder and verifier agents',
    what: 'What the system emits, and the commands agents use to read it. Agents build, verify and operate by looking inside the system. Without this they guess.',
    note: 'The same tools work in the verification environment and, read-only, in production. People see the same view.',
    file: 'signals.md   what is logged and traced\ntools/       logs, trace, metrics, state, replay\n\n$ observe decisions --order 5512\nREQ-012  refused  day 31 of 30\n         counted from: dispatch, 2 March', more: 'observability' },
  { id: 'inc', depth: 0, name: 'incidents/', question: 'what went wrong', writer: 'n', title: 'Incidents', who: 'kept permanently',
    what: 'Each incident adds an example, and usually proposes a new invariant, before the fix is released. The set of guarded failures only grows, so the same failure does not happen twice.',
    file: 'INC-007  Refund refused on day 29.\n         The delivery date was read from dispatch.\n\nExample added:   dispatched 2 March, delivered 4 March,\n                 requested 2 April: accepted\nProposed:      INV-009', more: 'operate' },
  { id: 'holdout', depth: 0, name: 'held-out scenarios', question: 'kept apart', writer: 'v', outside: true, title: 'Held-out scenarios', who: 'no building agent can read them',
    what: 'Scenarios that people write and keep in a separate repository, where neither the builder nor the verifier can read them. Running them reports only pass or fail, and runs are rationed, so they are hard to tune against.', more: 'environments' },
  { id: 'record', depth: 0, name: 'Verification Record', question: 'whether it is true', writer: 'v', outside: true, title: 'The Verification Record', who: 'computed by the orchestrator',
    what: 'The status of every clause, computed from evidence under rules that people own. No person and no agent writes "done". The weakest link is named, not averaged away.',
    file: 'REQ-012   accepted   checks 2/2   seen to fail 2/2\nINV-004   accepted   checks 3/3   seen to fail 3/3\nENV-003   accepted   checks 2/2   seen to fail 2/2\nDEC-031   accepted   checks 3/3   seen to fail 3/3\nASM-011   accepted, with stated risk   monitored', more: 'evidence' },
  { id: 'ball', depth: 0, name: 'CanonBall 13', question: 'what was released', writer: 'n', outside: true, title: 'A CanonBall', who: 'fixed at every release',
    what: 'What each release ships: the canon as it now stands, the build that keeps it, and the Verification Record that shows it. It answers "what does this system promise, and how do you know?" without anyone reading code.',
    note: 'Progress is a sequence of them.',
    file: 'CanonBall 13\n  canon    spec/canon at this release\n  build    commit 3f9c\n  record   4 accepted, 1 accepted with stated risk,\n           0 unsupported\n  notes    + DEC-031 A refund is approved automatically while\n             the total refunded on the order stays under $100', more: 'canonball' },
];

/** Full path of a row, built from its ancestors. */
export function pathOf(id: string): string {
  const idx = rows.findIndex((r) => r.id === id);
  const self = rows[idx]!;
  if (self.outside) return self.name;
  const out = [self.name];
  let d: number = self.depth;
  for (let i = idx - 1; i >= 0 && d > 0; i--) {
    const r = rows[i]!;
    if (r.depth < d) { out.unshift(r.name); d = r.depth; }
  }
  return out.join('');
}

export const writerLabel: Record<Writer, string> = { p: 'people', a: 'agents', v: 'verification', n: '' };
