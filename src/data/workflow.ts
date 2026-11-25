/** The conveyor: seven stations a milestone passes, who works at each, and what each reads and writes. */
export type StationId = 'collect' | 'shape' | 'build' | 'verify' | 'review' | 'release' | 'operate';

export interface Station {
  id: StationId;
  name: string;
  /** A few words under the name on the conveyor. */
  sub: string;
  /** One sentence: what happens here. */
  does: string;
  people: string[];
  agents: string[];
  /** Work done by a program, not by a person or an agent. */
  program?: string;
  /** Others who take part, listed in the guide but not drawn on the conveyor. */
  alsoPeople?: string[];
  alsoAgents?: string[];
  /** People who take part only in some cases, with the condition. */
  sometimes?: { who: string; short?: string; when: string; critical?: boolean }[];
  reads: string[];
  writes: string[];
  /** Commits in the example branch: this station's work is the diff from..to. */
  diff?: { from: string; to: string; label?: string }[];
  /** The gate that closes this station, if any. */
  gate?: { name: string; text: string };
}

export const stations: Station[] = [
  {
    id: 'collect', name: 'Collect', sub: 'requests gather into a milestone',
    does: 'Requests gather into a milestone, and a one-page proposal says what it will change.',
    people: ['Product manager'], agents: ['Elicitor'],
    reads: ['roadmap/notes/', 'spec/canon/'], writes: ['roadmap/notes/', 'roadmap/index.md', 'roadmap/M2-…/change.md'],
    diff: [{ from: '4a967e63e88f997821869e83712fc7f9aca3a6c5', to: 'e292a3bc1cb89792eb4df5c14e5b70fb5dca4bda' }],
  },
  {
    id: 'shape', name: 'Shape', sub: 'promises, decisions, invariants',
    does: 'People and agents settle the milestone\u2019s promises, decisions and invariants, how it will be built and how it will be proven, and record it all in the milestone.',
    people: ['Product manager', 'Architect', 'Verification lead'], agents: ['Elicitor'],
    alsoPeople: ['Constraint owner'], alsoAgents: ['Planner', 'Verifier'],
    reads: ['AGENTS.md', 'spec/canon/tenets.md', 'spec/canon/vocabulary.md'], writes: ['roadmap/M2-…/diff/canon/', 'roadmap/M2-…/diff/blueprint/', 'roadmap/M2-…/tasks/', 'roadmap/M2-…/approvals.md'],
    diff: [{ from: 'e292a3bc1cb89792eb4df5c14e5b70fb5dca4bda', to: '4d4f4b371e6ea3010000c3112ea60d9015681d8b' }],
    gate: { name: 'Agreement gate', text: 'people approve the examples before anything is built.' },
  },
  {
    id: 'build', name: 'Build', sub: 'the code',
    does: 'The builder writes the code in named tasks and watches what it does through the observability tools.',
    people: [], agents: ['Builder'], sometimes: [{ who: 'Architect', when: 'if the team keeps detailed design' }],
    reads: ['roadmap/M2-…/diff/', 'observe/'], writes: ['src/', 'observe/signals.md'],
    diff: [{ from: '4d4f4b371e6ea3010000c3112ea60d9015681d8b', to: 'a8b3797cacc5b37e7e410aff08c1bddd2142018c' }],
  },
  {
    id: 'verify', name: 'Verify', sub: 'in an engineered environment',
    does: 'A different agent builds the verification environment and the checks, and shows each check failing before its pass counts.',
    people: ['Verification lead'], agents: ['Verifier'],
    reads: ['roadmap/M2-…/diff/blueprint/', 'observe/'], writes: ['verify/envs/', 'verify/checks/', 'verify/faults/', 'observe/tools/'],
    diff: [{ from: 'a8b3797cacc5b37e7e410aff08c1bddd2142018c', to: '52a288b281d965ae19562b6c2be2e9178e402a83' }],
  },
  {
    id: 'review', name: 'Review', sub: 'an agent always, a person if critical',
    does: 'An agent reviews every milestone. A person reviews as well only when the change is critical or its blast radius is large.',
    people: [], agents: ['Reviewer'], sometimes: [{ who: 'Owner of what is at risk', short: 'Owner', when: 'if critical', critical: true }],
    reads: ['the diff', 'Verification Record', 'spec/canon/policy/'], writes: ['roadmap/M2-…/review.md'],
    diff: [{ from: '52a288b281d965ae19562b6c2be2e9178e402a83', to: 'e56d3fa8ad49d043f1f1b01f33b92fcc2b9a935b' }],
    gate: { name: 'Release gate', text: 'a person accepts the remaining risk, only when the change is critical.' },
  },
  {
    id: 'release', name: 'Release', sub: 'a CanonBall',
    does: 'The orchestrator, a program, copies the proposed files into spec/, publishes a CanonBall (the canon, the build and the Verification Record together) and deploys its build.',
    people: [], agents: [], program: 'Orchestrator',
    reads: ['Verification Record'], writes: ['spec/', 'roadmap/archive/', 'CANONBALLS.md'],
    diff: [{ from: 'e56d3fa8ad49d043f1f1b01f33b92fcc2b9a935b', to: '8692fe70009ab8855ceb787e20e99deda474cf9d' }],
  },
  {
    id: 'operate', name: 'Operate', sub: 'the running system',
    does: 'The system runs. Monitors watch what was promised, and what breaks comes back as work.',
    people: ['Operator'], agents: ['On-call agent'],
    reads: ['observe/', 'verify/monitors/'], writes: ['incidents/', 'roadmap/unplanned/'],
    diff: [{ from: '8692fe70009ab8855ceb787e20e99deda474cf9d', to: '137f3a1d62890a0b5692bdd9f764b3a39997cfa2', label: 'the incident' }, { from: '137f3a1d62890a0b5692bdd9f764b3a39997cfa2', to: '98cfb4f3d9d057d4147485f1f2dba395f47d8a4d', label: 'the repair, released as CanonBall 14' }],
  },
];


/** The three practices that let agents do most of the work reliably. Marked 1 to 3 on the conveyor. */
export const ideas = [
  {
    n: 1, slug: 'collect', title: 'Work moves in milestones',
    text: 'Requests are gathered before anything is built, so their promises, decisions and invariants are settled once and an agent receives a complete, consistent specification.',
    strong: 'Repairs and upkeep that change no promise take the express belt through the same stations.',
  },
  {
    n: 2, slug: 'environments', title: 'Verification environments are engineered',
    text: 'Agents produce most of the evidence, so the environment that produces it is designed with a person and maintained like product code.',
    strong: 'People can rely on the evidence because they understand how it was obtained.',
  },
  {
    n: 3, slug: 'observability', title: 'Observability is built for agents',
    text: 'An agent begins each task with no memory of the system. Logs, traces, metrics and state give it the context it needs to build, verify and operate.',
    strong: 'With them it diagnoses from evidence rather than speculation.',
  },
] as const;

export const pressures = {
  forward: 'Forward pressure: people push new requests in.',
  back: 'Back pressure: the running system demands upkeep. Incidents, bugs and reliability problems come back as work.',
};
