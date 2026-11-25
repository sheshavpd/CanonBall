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
    file: "### Read first\n\n1. This file.\n2. `spec/canon/tenets.md`: which good thing wins when two conflict. Cite a tenet when you recommend a choice.\n3. `spec/canon/vocabulary.md`: every domain word, defined once. Use these words and no synonyms.", more: 'repository' },
  { id: 'spec', depth: 0, name: 'spec/', question: 'what is true today', writer: 'n', title: 'The system as it stands', who: 'changed only by a release',
    what: 'What is true of the system today: the clauses it keeps, the design that keeps them, and the words they use. Nothing proposed lives here.',
    note: 'A release is the only thing that writes to it.', more: 'repository' },
  { id: 'canon', depth: 1, name: 'canon/', question: 'what we promise', writer: 'p', title: 'Canon: what the system promises', who: 'people approve',
    what: 'The clauses people have approved, one per file, in plain language, each with examples. It is the only part people must read in full.',
    note: 'A clause the system does not keep yet is not canon. It waits in roadmap/ until its change is released.', more: 'layers' },
  { id: 'vocab', depth: 2, name: 'vocabulary.md', writer: 'p', title: 'Vocabulary', who: 'people approve',
    what: 'Each noun is defined once. Synonyms are not allowed, and a clause that uses an undefined word is blocked. Agents read this file before anything else, so the same words run from the promise to the code, the check and the incident report.',
    note: 'It grows whenever an open question about a word is answered.',
    file: "## Order\nOne purchase by a customer: one or more items, paid for together.\n\n## Dispatch\nThe carrier's collection of the last item of an order.\n\n## Delivery\nThe carrier's delivered scan for the last item of an order. Not the dispatch.\n\n## Refund\nMoney returned to the customer for an order. Each refund is separate; an order can have more than one.\n\n## Refund amount\nThe money returned by one refund. Not the order total.", more: 'vocabulary' },
  { id: 'tenets', depth: 2, name: 'tenets.md', writer: 'p', title: 'Tenets', who: 'people write',
    what: 'Which good thing wins when two conflict. A handful of lines, in priority order. An agent cites one when it recommends, so its recommendations lean the way the team would.',
    note: 'A tenet is not a clause. It is never checked and never appears in the Verification Record.',
    file: "1. A person's review over speed, when money moves.\n2. A slow refund over a wrongly refused one.\n3. A rule support can explain over a rule that approves more.", more: 'tenets' },
  { id: 'req', depth: 2, name: 'REQ-012-refund-window.md', writer: 'p', title: 'A promise', who: 'people approve',
    what: 'What the system does for someone. Everything below it in the repository exists because of a promise like this one.',
    file: "---\nid: REQ-012\nkind: promise\ntitle: Refund window\ntraces: []\nterms: [customer, refund, delivery]\nowner: product manager\ntier: 1\n---\nA customer can request a refund within 30 days of delivery.", more: 'primitives' },
  { id: 'inv', depth: 2, name: 'INV-004-no-double-payout.md', writer: 'p', title: 'An invariant', who: 'people approve',
    what: 'What must always be true. People approve its worked examples, and the examples fix the meaning: here, that "twice" means the same request paid two times. A second, separate refund on an order is a new refund.',
    file: "---\nid: INV-004\nkind: invariant\ntitle: No double payout\ntraces: [REQ-012]\nterms: [refund, order]\nowner: refunds owner\ntier: 2\n---\nA refund is never issued twice for the same order.\n\n\"Twice\" means the same request paid two times: a request sent again, retried, or delivered in two copies.\nA second, separate refund on the same order is a new refund, with its own request key, and is allowed.\n\n## Examples\n\n### satisfies/1: The same request sent twice pays once\nGiven order 4471 and a refund request with request key K\nWhen the same request, with request key K, is sent a second time and both are reviewed\nThen one payout is made for order 4471\n\n### satisfies/2: A retry after a lost reply finds the original payout\nGiven a reviewed refund whose payout reaches the payment gateway, which pays it, and whose reply is lost\nWhen the service retries the payout\nThen the retry finds the original payout and nothing more is paid\n\n### violates/1: Two concurrent copies of one request both pay out\nGiven two copies of one refund request, with the same request key, arriving at the same time\nWhen both copies are processed and reviewed\nThen two payouts are made for the order", more: 'primitives' },
  { id: 'dec', depth: 2, name: 'DEC-031-auto-approve-under-100.md', writer: 'p', proposed: true, title: 'A decision', who: 'people approve',
    what: 'A choice that could have gone another way, written down. This one is proposed by the change in roadmap/. It becomes canon only when that change is released.',
    note: 'Follow the change to watch it arrive.',
    file: "---\nid: DEC-031\nkind: decision\ntitle: Auto-approve under $100\ntraces: [REQ-012]\ncites: [tenet 1]\nterms: [refund, refund amount, order, review]\nowner: product manager\ntier: 2\n---\nA refund is approved automatically while the total refunded on the order stays under $100.\n\nThe limit applies to the total refunded on the order, this refund included, and not to each refund amount on\nits own, so that a refund split into small pieces still goes to review. Settled by tenet 1: a person's review\nover speed, when money moves. Every other refund inside the window goes to review, as before.\n\n## Examples\n\n### satisfies/1: A $40 refund, nothing refunded before\nGiven an order on which nothing has been refunded\nWhen the customer requests a refund of $40\nThen the refund is approved without review\n\n### satisfies/2: Two $60 refunds on one order\nGiven an order on which a refund of $60 has already been paid\nWhen the customer requests a second refund of $60\nThen the second refund goes to review\n\n### violates/1: A $250 refund approved without review\nGiven an order on which nothing has been refunded\nWhen the customer requests a refund of $250\nThen the refund is approved without review", more: 'primitives' },
  { id: 'env', depth: 2, name: 'ENV-003-no-payout-above-10k.md', writer: 'p', title: 'A constraint', who: 'its own owner, with a veto',
    what: 'What is never allowed, whatever the goal. It protects people, money and actions that cannot be undone. If the answer to "can the product team change this?" is "not our call", it is a constraint. Safety engineers call these safety constraints.',
    file: "---\nid: ENV-003\nkind: constraint\ntitle: No payout above $10,000 without review\ntraces: []\nterms: [payout, review]\nowner: finance\ntier: 2\n---\nNo payout above $10,000 without review.", more: 'primitives' },
  { id: 'asm', depth: 2, name: 'ASM-011-gateway-request-keys.md', writer: 'p', title: 'An assumption', who: 'people approve',
    what: 'A fact about the outside world the system relies on. No test can prove it about someone else\'s system, so it is watched in production by a monitor.',
    file: "---\nid: ASM-011\nkind: assumption\ntitle: The gateway honors request keys\ntraces: [INV-004]\nterms: [request key]\nowner: refunds owner\ntier: 2\nmonitor: verify/monitors/duplicate-payouts.md\n---\nThe payment gateway pays at most once per request key.\n\nThe gateway's documentation says so, and the refunds service depends on it whenever it retries a payout. No\ncheck inside this repository can show it, so a monitor watches for it in production.", more: 'primitives' },
  { id: 'policy', depth: 2, name: 'policy/', writer: 'p', title: 'What counts as evidence', who: 'people only',
    what: 'The rules that turn evidence into a status, say when a person must accept a release, and set how far each kind of decision is handed to agents. No agent may write here.',
    note: 'This is where the dial is kept.', more: 'delegation' },
  { id: 'bp', depth: 1, name: 'blueprint/', question: 'how we keep it', writer: 'a', title: 'Blueprint: how the clauses are kept', who: 'agents write',
    what: 'The agents\' design: the architecture, one case per clause saying how it will be shown true, and the verification plan. Agents may revise it freely as long as it never contradicts canon.',
    note: 'A person can promote any design choice to a decision. From then on it is theirs.', more: 'layers' },
  { id: 'case', depth: 2, name: 'cases/INV-004.md', writer: 'a', title: 'The case for one clause', who: 'planner agent',
    what: 'It splits the clause into parts, names the environment that checks each part, and argues why the parts are enough. Cases about money and safety are reviewed by a person.',
    file: "## Argument\n\nA refund is paid twice only if the gateway transfers money twice for one request. The service sends every\npayout for a request under that request's key (P1), and the gateway transfers at most once per key (P2). So\nfor the same request, at most one transfer happens. P1 covers everything the service controls, on both paths;\nP2 is the one thing it does not, which is why it is an assumption with a monitor rather than a check.\n\nThe automatic path adds no new way to reach the gateway: it calls the same `pay`, whose retry and request-key\nhandling DEC-031 does not change. The check on the automatic path shows this rather than assumes it.\n\nVE-002 cannot show whether the real gateway honors request keys. That is the residual risk, and it is the\nrisk the monitor watches.", more: 'verification-engineering' },
  { id: 'vedoc', depth: 2, name: 'environments/VE-002.md', writer: 'v', title: 'An environment, declared', who: 'verifier agent',
    what: 'Every verification environment states what it is, what it controls, and what it cannot show. Evidence counts only inside those limits.',
    file: "id: VE-002\nname: payments-sandbox\nboundary: the refunds service, at this commit\nworld: real local store; a fake payment gateway\ncontrol: seeded; one command up, one command down\n\n## Starting states it can set up\n- an order, with its day of dispatch and day of delivery\n- a refund waiting for review, or approved and waiting for payout\n- an order that has already been partly refunded\n\n## Failures it can simulate\n- a refusal\n- a duplicate request\n- a lost reply (the gateway pays and the reply never arrives)\n\n## What it cannot show\nReal gateway timing. Whether the real gateway honors\nrequest keys. Production request shapes.", more: 'environments' },
  { id: 'road', depth: 0, name: 'roadmap/', question: 'what is proposed', writer: 'n', title: 'Everything proposed', who: 'people rank it',
    what: 'One folder per change. spec/ is the system as it stands. This is what might become it.', more: 'collect' },
  { id: 'notes', depth: 1, name: 'notes/', writer: 'a', title: 'Requests as they arrive', who: 'anyone asks, the elicitor files',
    what: 'Every request is a card: a complaint from support, a number from finance, a worry from risk. Related cards are gathered into one milestone.',
    file: "finance-review-time-under-100.md  Most review time goes to refunds under $100\nrisk-split-refunds.md             Split refunds must not slip past review\nstore-credit.md                   Refunds as store credit\nsupport-small-refunds-wait.md     Small refunds wait two days in review", more: 'collect' },
  { id: 'index', depth: 1, name: 'index.md', writer: 'p', title: 'The order of work', who: 'people rank',
    what: 'The list of changes in priority order. Ranking it is the recurring human act. Agents build what has been agreed while people shape what comes next.',
    file: "| Milestone | What changes |\n|---|---|\n| [M2 faster small refunds](M2-faster-small-refunds/change.md) | Refunds under $100 are approved automatically. |\n| M3 refunds as store credit | A customer can take a refund as store credit (roadmap/notes/store-credit.md). |\n\n## Released\n\n| Milestone | What changed | CanonBall |\n|---|---|---|\n| M1 refund window | A customer can request a refund within 30 days of delivery (REQ-012). | 12 |\n| M0 first clauses | Refunds go to review and are paid once (INV-004), payouts above $10,000 need review (ENV-003), the gateway's request keys (ASM-011). | earlier |", more: 'collect' },
  { id: 'm2', depth: 1, name: 'M2-faster-small-refunds/', writer: 'a', title: 'One milestone', who: 'agents draft, people agree',
    what: 'A folder for one milestone: its page, the files it proposes, and the agents\' tasks. An incident repair has the same shape, only smaller.', more: 'collect' },
  { id: 'change', depth: 2, name: 'change.md', writer: 'p', title: 'What changes in the system?', who: 'people agree',
    what: 'The change proposal: one page, drafted by an agent from conversations and agreed to by a person. People approve its examples. They do not review its code.',
    file: "# M2: Faster small refunds\n\nWhat changes: a refund is approved automatically while the total refunded on the order stays under $100.\nNothing else changes.\n\nGathers:   3 requests: roadmap/notes/support-small-refunds-wait.md, finance-review-time-under-100.md,\n           risk-split-refunds.md\nWhy now:   the review queue is the slowest step for small refunds. Support handles complaints about the\n           wait every day, and reviewers spend most of their time on refunds they almost never turn down.\nAdds:      DEC-031 auto-approve under $100; \"refund amount\" in vocabulary.md\n\nstatus: agreed   (written by canonball)", more: 'collect' },
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
    file: "# verify\n\nWritten by the verifier agent. The builder may run everything here and may change none of it.\n\n- `envs/` the verification environments: the system, its real local stores, and a fake for each outside dependency.\n- `checks/` one check per example, marked with the example it encodes (`verify/canonball_check.py`).\n- `checks/red/` the kept failing runs that show each check can fail. Written by `tools/canonball fault`.\n- `faults/` injected faults: small patches that break one thing on purpose.\n- `monitors/` what watches the assumptions and invariants in production.", more: 'verification-engineering' },
  { id: 'envs', depth: 1, name: 'envs/VE-002/', writer: 'v', title: 'The environment', who: 'verifier agent',
    what: 'One command starts it and one destroys it: the service, its real local store, and a fake for each outside dependency. It drives the system and observes it. It never judges.',
    file: "\"\"\"VE-002 payments-sandbox: the refunds service, a real local store, and a fake payment gateway.\n\nThe declaration is spec/blueprint/environments/VE-002.md. One command up, one command down:\n\n    with World() as world:          # up: an empty store, a fresh gateway, a decision log\n        order = world.rig.order(total_cents=12000, dispatched_on=dt.date(2026, 3, 1))\n        refund = world.act.request_refund(order, 12000, key=\"r-1\")\n        paid = world.observe.gateway.payouts(order=order)\n                                    # down: the store and the log are gone\n\nThe four verbs:\n    rig       starting state: orders, existing refunds, partly refunded orders, today's date\n    act       the service API (refunds.service.Service)\n    perturb   failures: perturb.gateway.refuse(), .duplicate(), .lose_reply()\n    observe   what happened: observe.gateway.payouts(), observe.store, observe.decisions()\n\"\"\"", more: 'environments' },
  { id: 'checks', depth: 1, name: 'checks/', writer: 'v', title: 'One check per example', who: 'verifier agent',
    what: 'Each check names the example it encodes. An example with no check is visible, and so is a check with no example.',
    file: "    @example_of(\"INV-004#violates/1\", \"Two concurrent copies of one request both pay out\")\n    def test_two_concurrent_copies_pay_once(self):\n        world = self.world\n        order = world.rig.order(total_cents=12000)\n\n        def one_copy():\n            refund = world.act.request_refund(order, 12000, key=\"concurrent-1\")\n            return world.act.approve(refund.id, reviewer=\"support lead\")\n\n        at_once(one_copy, one_copy)\n        paid = world.observe.gateway.payouts(order=order)\n        assert len(paid) == 1", more: 'evidence' },
  { id: 'red', depth: 1, name: 'checks/red/', writer: 'v', title: 'Proof that a check can fail', who: 'verifier agent',
    what: 'A check that has never failed proves nothing. Each one is run against an injected fault, and the failing run is kept here. Only then does its pass count.',
    file: "{\n  \"check\": \"verify.checks.test_inv004_no_double_payout.NoDoublePayout.test_two_concurrent_copies_pay_once\",\n  \"example\": \"INV-004#violates/1\",\n  \"fault\": \"verify/faults/request-key-ignored.patch\",\n  \"outcome\": \"failed\",\n  \"at\": \"2026-11-25T01:23:15+00:00\"\n}", more: 'evidence' },
  { id: 'faults', depth: 1, name: 'faults/', writer: 'v', title: 'Injected faults', who: 'verifier agent',
    what: 'Fault injection: small patches that break one thing on purpose, applied to a scratch copy. An environment must also catch faults it was not tuned on, or its evidence is discounted.', more: 'environments' },
  { id: 'monitors', depth: 1, name: 'monitors/', writer: 'v', title: 'Monitors', who: 'verifier agent',
    what: 'They watch, in production, the assumptions the evidence rested on. When one fires, an incident opens. This is how operating the system feeds back into building it.', more: 'evidence' },
  { id: 'observe', depth: 0, name: 'observe/', question: 'how agents see inside', writer: 'a', title: 'Observability', who: 'builder and verifier agents',
    what: 'What the system emits, and the commands agents use to read it. Agents build, verify and operate by looking inside the system. Without this they guess.',
    note: 'The same tools work in the verification environment and, read-only, in production. People see the same view.',
    file: "signals.md       what the service emits, field by field\ntools/observe    decisions --order N, replay --order N\n\n$ observe/tools/observe decisions --order 5512\nREQ-012  refund window\n  result        refused\n  reason        day 31 of 30\n  counted from  dispatch, 2 March\n  delivered     4 March", more: 'observability' },
  { id: 'inc', depth: 0, name: 'incidents/', question: 'what went wrong', writer: 'n', title: 'Incidents', who: 'kept permanently',
    what: 'Each incident adds an example, and usually proposes a new invariant, before the fix is released. The set of guarded failures only grows, so the same failure does not happen twice.',
    file: "# INC-007  Refund refused on day 29\n\nDetected:     a support report. The customer of order 5512 asked for a refund on 2 April 2026, 29 days after\n              delivery, and was refused as too late. No monitor fired: none watches refusals.\nDiagnosis:    the on-call agent read the decision log for the order (below). The REQ-012 decision was\n              \"day 31 of 30\", counted from dispatch on 2 March 2026. Delivery was 4 March 2026.\nCause:        the refund window was counted from the day of dispatch, where REQ-012 says delivery.\nRepair:       inc-007-window-from-delivery (roadmap/unplanned/ until released, then roadmap/archive/)\nExample added: REQ-012 satisfies/2. Given an order dispatched on 2 March and delivered on 4 March, when\n              the customer requests a refund on 2 April, then the request is accepted.\nProposed:     INV-009 The refund window is counted from delivery, never from dispatch.", more: 'operate' },
  { id: 'holdout', depth: 0, name: 'held-out scenarios', question: 'kept apart', writer: 'v', outside: true, title: 'Held-out scenarios', who: 'no building agent can read them',
    what: 'Scenarios that people write and keep in a separate repository, where neither the builder nor the verifier can read them. Running them reports only pass or fail, and runs are rationed, so they are hard to tune against.', more: 'environments' },
  { id: 'record', depth: 0, name: 'Verification Record', question: 'whether it is true', writer: 'v', outside: true, title: 'The Verification Record', who: 'computed by the orchestrator',
    what: 'The status of every clause, computed from evidence under rules that people own. No person and no agent writes "done". The weakest link is named, not averaged away.',
    file: "$ tools/canonball record\nVerification Record for spec/\n\nREQ-012   accepted                    checks 2/2   seen to fail 2/2\nINV-004   accepted                    checks 4/4   seen to fail 4/4\nDEC-031   accepted                    checks 3/3   seen to fail 3/3\nENV-003   accepted                    checks 2/2   seen to fail 2/2\nASM-011   accepted, with stated risk  monitored by verify/monitors/duplicate-payouts.md\n\n4 accepted, 1 accepted, with stated risk", more: 'evidence' },
  { id: 'ball', depth: 0, name: 'CanonBall 13', question: 'what was released', writer: 'n', outside: true, title: 'A CanonBall', who: 'fixed at every release',
    what: 'What each release ships: the canon as it now stands, the build that keeps it, and the Verification Record that shows it. It answers "what does this system promise, and how do you know?" without anyone reading code.',
    note: 'Progress is a sequence of them.',
    file: "## CanonBall 13\n\n- released: 2026-03-10\n- from: roadmap/archive/M2-faster-small-refunds\n- build: 8ca1c6a\n- record: 4 accepted, 1 accepted, with stated risk\n- adds or changes: DEC-031 Auto-approve under $100", more: 'canonball' },
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
