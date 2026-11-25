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
    diff: [{ from: 'eba006c84e286d2641302210f30f911fea84772d', to: '30852bec7c2b89e8bb2474a21ae80a79cb3ea8df' }],
  },
  {
    id: 'shape', name: 'Shape', sub: 'promises, decisions, invariants',
    does: 'People and agents settle the milestone\u2019s promises, decisions and invariants, how it will be built and how it will be proven, and record it all in the milestone.',
    people: ['Product manager', 'Architect', 'Verification lead'], agents: ['Elicitor'],
    alsoPeople: ['Constraint owner'], alsoAgents: ['Planner', 'Verifier'],
    reads: ['AGENTS.md', 'spec/canon/tenets.md', 'spec/canon/vocabulary.md'], writes: ['roadmap/M2-…/change.md', 'roadmap/M2-…/diff/canon/', 'roadmap/M2-…/diff/blueprint/', 'roadmap/M2-…/tasks/', 'roadmap/M2-…/approvals.md'],
    diff: [{ from: '30852bec7c2b89e8bb2474a21ae80a79cb3ea8df', to: 'a0c4938c80c7e32c76b3088b29d0941aeba2122a' }],
    gate: { name: 'Agreement gate', text: 'people approve the examples before anything is built.' },
  },
  {
    id: 'build', name: 'Build', sub: 'the code',
    does: 'The builder writes the code in named tasks and watches what it does through the observability tools.',
    people: [], agents: ['Builder'], sometimes: [{ who: 'Architect', when: 'if the team keeps detailed design' }],
    reads: ['roadmap/M2-…/diff/', 'roadmap/M2-…/tasks/', 'observe/'], writes: ['src/refunds/', 'observe/signals.md'],
    diff: [{ from: 'a0c4938c80c7e32c76b3088b29d0941aeba2122a', to: '1a1c0c760fafc76c73d065d39c9147e4b233650b' }],
  },
  {
    id: 'verify', name: 'Verify', sub: 'in an engineered environment',
    does: 'A different agent builds the verification environment and the checks, and shows each check failing before its pass counts.',
    people: ['Verification lead'], agents: ['Verifier'],
    reads: ['roadmap/M2-…/change.md', 'roadmap/M2-…/diff/', 'observe/'], writes: ['verify/envs/', 'verify/checks/', 'verify/checks/red/', 'verify/faults/', 'observe/tools/'],
    diff: [{ from: '1a1c0c760fafc76c73d065d39c9147e4b233650b', to: '40dac99dbaf5c4433220e4561e217e0960fac2c2' }],
  },
  {
    id: 'review', name: 'Review', sub: 'an agent always, a person if critical',
    does: 'An agent reviews every milestone. A person reviews as well only when the change is critical or its blast radius is large.',
    people: [], agents: ['Reviewer'], sometimes: [{ who: 'Owner of what is at risk', short: 'Owner', when: 'if critical', critical: true }],
    reads: ['the diff', 'Verification Record', 'spec/canon/policy/'], writes: ['roadmap/M2-…/review.md', 'src/refunds/service.py', 'roadmap/M2-…/change.md'],
    diff: [{ from: '40dac99dbaf5c4433220e4561e217e0960fac2c2', to: '8ca1c6a101e0f44ae1867ad8092f1bbc18b9d96c' }],
    gate: { name: 'Release gate', text: 'a person accepts the remaining risk, only when the change is critical.' },
  },
  {
    id: 'release', name: 'Release', sub: 'a CanonBall',
    does: 'The orchestrator, a program, copies the proposed files into spec/, and records a CanonBall: the canon, the build and the Verification Record together. The build it names is then deployed.',
    people: [], agents: [], program: 'Orchestrator',
    reads: ['Verification Record'], writes: ['spec/', 'roadmap/archive/', 'roadmap/index.md', 'CANONBALLS.md'],
    diff: [{ from: '8ca1c6a101e0f44ae1867ad8092f1bbc18b9d96c', to: '75ac2f0b91922ee9fe53c7cd4ae17d15d6c015aa' }],
  },
  {
    id: 'operate', name: 'Operate', sub: 'the running system',
    does: 'The system runs. Monitors watch what was promised, and what breaks comes back as work.',
    people: ['Operator'], agents: ['On-call agent'],
    reads: ['observe/', 'verify/monitors/'], writes: ['incidents/', 'roadmap/unplanned/'],
    diff: [{ from: '75ac2f0b91922ee9fe53c7cd4ae17d15d6c015aa', to: '0d1173c02d04be039bd788818ff5e278706205fd', label: 'the incident' }, { from: '0d1173c02d04be039bd788818ff5e278706205fd', to: 'c62fe85ef3d324565196039b037cae60f255eb1e', label: 'the repair, released as CanonBall 14' }],
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
