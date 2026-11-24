/** The conveyor: seven stations a milestone passes, who works at each, and what each reads and writes. */
export type Kind = 'p' | 'a' | 'v';
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
  /** People who appear only when the change is critical. */
  ifCritical?: string[];
  reads: string[];
  writes: string[];
  /** The gate that closes this station, if any. */
  gate?: string;
}

export const stations: Station[] = [
  {
    id: 'collect', name: 'Collect', sub: 'requests gather into a milestone',
    does: 'Requests gather into a milestone, and a one-page proposal says what it will change.',
    people: ['Product manager'], agents: ['Elicitor'],
    reads: ['roadmap/notes/', 'spec/canon/'], writes: ['roadmap/index.md', 'roadmap/M2-…/change.md'],
  },
  {
    id: 'shape', name: 'Shape', sub: 'promises, decisions, invariants',
    does: 'People and agents settle what the milestone promises, how it will be built and how it will be proven, and write it all down.',
    people: ['Product manager', 'Architect', 'Verification lead'], agents: ['Planner'],
    alsoPeople: ['Constraint owner'], alsoAgents: ['Elicitor', 'Verifier'],
    reads: ['AGENTS.md', 'spec/canon/tenets.md', 'spec/canon/vocabulary.md'], writes: ['roadmap/M2-…/diff/canon/', 'roadmap/M2-…/diff/blueprint/'],
    gate: 'Agreement gate: people approve the examples before anything is built.',
  },
  {
    id: 'build', name: 'Build', sub: 'the code',
    does: 'The builder writes the code in named tasks and watches what it does through the observability tools.',
    people: [], agents: ['Builder'],
    reads: ['roadmap/M2-…/diff/', 'observe/'], writes: ['src/'],
  },
  {
    id: 'verify', name: 'Verify', sub: 'in an engineered environment',
    does: 'A different agent builds the verification environment and the checks, and shows each check failing before its pass counts.',
    people: ['Verification lead'], agents: ['Verifier'],
    reads: ['roadmap/M2-…/diff/blueprint/', 'observe/'], writes: ['verify/envs/', 'verify/checks/', 'verify/faults/'],
  },
  {
    id: 'review', name: 'Review', sub: 'an agent always, a person if critical',
    does: 'An agent reviews every milestone. A person reviews as well when the change is critical or its blast radius is large.',
    people: [], agents: ['Reviewer'], ifCritical: ['Owner'],
    reads: ['the diff', 'Verification Record', 'spec/canon/policy/'], writes: ['a review'],
    gate: 'Release gate: a person accepts the risk, only when the policy says there is risk to accept.',
  },
  {
    id: 'release', name: 'Release', sub: 'a CanonBall',
    does: 'A program copies the proposed files into spec/ and publishes a CanonBall: the canon, the build and the Verification Record together.',
    people: [], agents: [], program: 'Verification Record',
    reads: ['Verification Record'], writes: ['spec/', 'a CanonBall'],
  },
  {
    id: 'operate', name: 'Operate', sub: 'the running system',
    does: 'The system runs. Monitors watch what was promised, and what breaks comes back as work.',
    people: ['Operator'], agents: ['On-call agent'],
    reads: ['observe/', 'verify/monitors/'], writes: ['incidents/', 'roadmap/unplanned/'],
  },
];

export const stationById = (id: StationId): Station => stations.find((s) => s.id === id)!;

/** The three ideas that set this apart from a conventional software lifecycle. Numbered on the conveyor. */
export const ideas = [
  {
    n: 1, slug: 'collect', title: 'Milestones, not tickets',
    text: 'Requests gather before anyone builds, so promises, decisions and invariants are settled once for the whole batch.',
    strong: 'Small urgent work rides the express belt through the same stations, alone.',
  },
  {
    n: 2, slug: 'environments', title: 'Verification environments are engineered',
    text: 'The place where a promise is tested is designed with a person, like any other part of the product.',
    strong: 'People can trust evidence only if they understand how it is produced.',
  },
  {
    n: 3, slug: 'observability', title: 'Observability is built for the agents',
    text: 'Agents build, verify and operate by looking inside the system: its logs, traces, metrics and state.',
    strong: 'Without it they guess.',
  },
] as const;

export const pressures = {
  forward: 'Forward pressure: people push new requests in.',
  back: 'Back pressure: the running system demands upkeep. Incidents, bugs and reliability problems come back as work.',
};
