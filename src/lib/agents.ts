// Builds the agent-readable twin of every page. Each page at /x/ has a plain-text version at /x/agents.txt,
// generated from the same source as the HTML, so the two cannot drift apart.
import { site, parts, written, computed, steps, dial } from '../data/site';
import { rows, pathOf } from '../data/repo';
import { glossary } from '../data/glossary';
import { figures } from '../data/figures';
import { stations, ideas, pressures, type Station } from '../data/workflow';
import { url } from './links';
import type { Chapter } from './guide';

type Site = URL | undefined;

/** Absolute when the site URL is configured, root-relative otherwise. */
function abs(path: string, siteUrl: Site): string {
  return siteUrl ? new URL(url(path), siteUrl).href : url(path);
}
const txt = (path: string, s: Site) => abs(`${path}agents.txt`, s);

function header(title: string, summary: string, path: string, s: Site): string {
  return [
    `# ${title}`,
    '',
    `> ${summary}`,
    '',
    `Site: ${site.name}. ${site.tagline}`,
    `HTML page: ${abs(path, s)}`,
    `This file: ${txt(path, s)}`,
    '',
    '---',
    '',
  ].join('\n');
}

function footer(lines: string[], s: Site): string {
  return [
    '',
    '---',
    '',
    '## References',
    '',
    ...lines,
    `- Glossary: ${txt('/glossary/', s)}`,
    `- Site overview and index of every chapter: ${txt('/', s)}`,
    '',
  ].join('\n');
}

/** Chapter links are written relative (../slug/). Point them at the text twin instead. */
function retarget(body: string): string {
  return body.replace(/\]\(\.\.\/([a-z0-9-]+)\/(#[^)]*)?\)/g, '](../$1/agents.txt)');
}

/** Chapters embed a few components. In text they become a labeled description. */
const interactive: Record<string, string> = {
  Dial: '[Interactive figure: levels of automation] Seven kinds of decision, each on a scale from 0 (agent analyzes, a person decides) to 5 (agent acts, people watch the metrics), shown for three scenarios: day one, a billing service later, and a robot fleet later. Values in that order: what the system promises 1, 1, 1; what is never allowed 1, 1, 1; choices a customer would notice 1, 2, 1; internal design 1, 4, 3; decision logic 1, 5, 4; code that touches the outside world 1, 2, 2; releasing with no clause changed 1, 5, 2. These are an illustration.',
  FailFirst: '[Interactive figure: a check must fail before its pass counts] Three checks for INV-004 pass. The third has never been seen to fail, so the computed status is "unsupported". After a fault is injected, the third check fails as it should, and that failing run is kept. Run again on the real build, all three pass and the status becomes "accepted".',
};
const who = (st: Station): string =>
  [
    st.agents.length ? `agents: ${[...st.agents, ...(st.alsoAgents ?? [])].join(', ')}` : '',
    st.people.length ? `people: ${[...st.people, ...(st.alsoPeople ?? [])].join(', ')}` : '',
    st.ifCritical?.length ? `a person only when the change is critical: ${st.ifCritical.join(', ')}` : '',
    st.program ? `a program: ${st.program}` : '',
  ].filter(Boolean).join('; ');

/** The conveyor, as text: the stations in order, the express belt, the two pressures and the three ideas. */
export function conveyorText(): string {
  const out = [
    '[Animated figure: the conveyor] Requests arrive and gather into a milestone, three at a time. The milestone passes seven stations on a belt and leaves as a CanonBall. Each station names who works there.',
    '',
    ...stations.map((st, i) => `${i + 1}. ${st.name}. ${st.does} Who: ${who(st)}.${st.gate ? ` ${st.gate}` : ''}`),
    '',
    'Below the main belt runs an express belt for small urgent work. An incident returns from Operate along a dashed line, enters the express belt as a single fix, and passes the same stations alone, without waiting for a milestone.',
    'An observability rail (logs, traces, metrics, state, replay) runs under the belts from Build to Operate. The Verify station is drawn as a built chamber, the verification environment, which work on both belts passes through.',
    'At Review, every milestone stops for an agent. A milestone marked critical also waits behind a barrier until a person has reviewed it.',
    '',
    pressures.forward,
    pressures.back,
    '',
    'Three ideas are numbered on the figure:',
    ...ideas.map((d) => `${d.n}. ${d.title}. ${d.text} ${d.strong}`),
  ];
  return out.join('\n');
}

function describeComponents(body: string): string {
  return body
    .replace(/<Figure id="([^"]+)" \/>/g, (_, id: string) => {
      const f = figures[id];
      return f ? `[Figure: ${f.caption}]\n${f.text}` : '';
    })
    .replace(/<(Dial|FailFirst) \/>/g, (_, name: string) => interactive[name] ?? '')
    .replace(/<Conveyor[^>]*\/>/g, () => conveyorText());
}

function stationText(chapter: Chapter): string {
  const idx = stations.findIndex((st) => st.id === chapter.data.station);
  if (idx < 0) return '';
  const st = stations[idx]!;
  return [
    `Station ${idx + 1} of ${stations.length} on the conveyor: ${st.name}.`,
    `Who works here: ${who(st)}.`,
    `Reads: ${st.reads.join(', ')}.`,
    `Writes: ${st.writes.join(', ')}.`,
    ...(st.gate ? [st.gate] : []),
    '',
    '',
  ].join('\n');
}

export function chapterText(chapter: Chapter, all: Chapter[], s: Site): string {
  const i = all.findIndex((c) => c.id === chapter.id);
  const part = parts.find((p) => p.id === chapter.data.part)!;
  const path = `/guide/${chapter.id}/`;
  const refs: string[] = [];
  const prev = all[i - 1];
  const next = all[i + 1];
  if (prev) refs.push(`- Previous chapter: ${prev.data.title}: ${txt(`/guide/${prev.id}/`, s)}`);
  if (next) refs.push(`- Next chapter: ${next.data.title}: ${txt(`/guide/${next.id}/`, s)}`);
  for (const id of chapter.data.related) {
    const r = all.find((c) => c.id === id);
    if (r) refs.push(`- Related: ${r.data.title}: ${txt(`/guide/${r.id}/`, s)}`);
  }
  return (
    header(chapter.data.title, chapter.data.summary, path, s) +
    `Guide part: ${part.title}. Chapter ${i + 1} of ${all.length}.\n\n` +
    stationText(chapter) +
    (chapter.data.points.length ? `Key points:\n${chapter.data.points.map((p) => `- ${p}`).join('\n')}\n\n` : '') +
    describeComponents(retarget((chapter.body ?? '').trim())) +
    '\n' +
    footer(refs, s)
  );
}

export function glossaryText(s: Site): string {
  const out = [header('CanonBall glossary', 'Every term the guide uses. Where the specification uses a different word, it is shown in brackets.', '/glossary/', s)];
  for (const g of glossary) {
    out.push(`${g.term}${g.formal ? ` [${g.formal}]` : ''}`, `  ${g.def}`, `  Explained in: ${txt(`/guide/${g.slug}/`, s)}`, '');
  }
  return out.join('\n') + footer([], s);
}

export function homeText(all: Chapter[], s: Site): string {
  const out = [header(`${site.name}: ${site.tagline}`, site.description, '/', s)];

  out.push(
    '## How to use this site as an agent',
    '',
    'Every page has a plain-text twin at the same path with agents.txt appended.',
    'This file is the overview and the index of every chapter. Chapter files contain the full chapter text in Markdown, with each figure replaced by a description.',
    'References at the end of each file link to other agents.txt files, never to HTML.',
    '',
    '## Why now',
    '',
    'Agents write working code faster than people can read it. Reviewing every change wastes the agent. Skipping review turns each change into a risk nobody measured. The question changed from "can we build this?" to "what does this change do, and what does the system still promise afterwards?". Most of the engineering now goes into showing that a promise holds.',
    '',
    '## How work moves',
    '',
    conveyorText(),
    `More: ${txt('/guide/workflow/', s)}`,
    '',
    '## What gets written down',
    '',
    'People steer agents with a few written things. Each is a short file in plain language, and most are written at the Shape station.',
    '',
    'People write:',
    '',
  );
  for (const w of written) {
    out.push(`- ${w.name}. ${w.what}`, `  Example: ${w.example}`, `  Why it exists: ${w.why}`, `  More: ${txt(`/guide/${w.slug}/`, s)}`);
  }
  out.push('', 'Machines answer:', '');
  for (const c of computed) {
    out.push(`- ${c.name}. ${c.what}`, `  Why it exists: ${c.why}`, `  More: ${txt(`/guide/${c.slug}/`, s)}`);
  }
  out.push(
    '',
    'A promise, an invariant, a decision, a constraint and an assumption are each a kind of clause: one file with an ID and its examples. The approved clauses together are the canon.',
    '',
    '## The repository',
    '',
    'The repository is laid out by the work: every station writes to its own place. Every folder answers one question and has one kind of writer. The example is a refunds service.',
    '',
  );
  for (const r of rows) {
    out.push(`${'  '.repeat(r.depth)}- ${pathOf(r.id)}${r.question ? ` (${r.question})` : ''}. ${r.title}. Written by: ${r.who}.`, `${'  '.repeat(r.depth)}  ${r.what}`);
  }
  out.push('', '## Milestone M2 through the repository, one station at a time', '');
  steps.forEach((st, i) => out.push(`${i + 1}. ${st.n}. ${st.say} Touches: ${st.ids.map((id) => pathOf(id)).join(', ')}.`));
  out.push(
    '',
    '## Verification engineering',
    '',
    'When agents write the code, most of the engineering goes into environments in which a promise can be checked. They are designed with a person, because people can trust evidence only if they understand how it is produced. A verification environment has seven parts: boundary, stimulus, world, probes, oracle, coverage, control. It also states what it cannot show. A check must be seen to fail, against an injected fault, before its pass counts.',
    `More: ${txt('/guide/verification-engineering/', s)}`,
    '',
    '## Observability',
    '',
    'Agents work by looking inside the system. Without that they guess and patch symptoms. Three rules: every decision the system makes is logged with the clause it applied and the inputs it used; one trace follows each request through every adapter; agents have commands to read logs, traces, metrics and state, and to replay a request. One investment serves three stations: the builder sees what its code does, the verifier explains every failure, and the on-call agent diagnoses incidents. People see the same view.',
    'Example. A customer was refused a refund on day 29. The decision log for the order reads: REQ-012 refund window, result refused, reason day 31 of 30, counted from dispatch on 2 March, delivered 4 March. The window was counted from dispatch, and the vocabulary says delivery.',
    `More: ${txt('/guide/observability/', s)}`,
    '',
    '## A recommended architecture',
    '',
    'Keep decisions apart from side effects. Decision logic, the functional core, takes explicit inputs and returns what should happen, with no database, network or clock. Side effects go out through adapters, the imperative shell. This is a recommendation, not a requirement. Ports and adapters is the same idea.',
    `More: ${txt('/guide/architecture/', s)}`,
    '',
    '## Handing over decisions',
    '',
    'Each kind of decision has its own level of automation, from 0 to 5:',
    '',
  );
  dial.levels.forEach((l, i) => out.push(`${i}. ${l}`));
  out.push('', 'A team starts at level 1 everywhere. Settings move on track record, never on a model release. Agent review stays on at every setting; what moves is how often a person reviews as well. Illustrative settings (day one / billing service later / robot fleet later):', '');
  for (const r of dial.rows) out.push(`- ${r.name}: ${r.v.join(' / ')}${r.lock ? ' (stays with people)' : ''}`);
  out.push(`More: ${txt('/guide/delegation/', s)}`, '', '## All pages', '');
  all.forEach((c, i) => out.push(`- Chapter ${i + 1}. ${c.data.title}: ${txt(`/guide/${c.id}/`, s)}`, `  ${c.data.summary}`));
  out.push(`- Glossary: ${txt('/glossary/', s)}`, '');
  return out.join('\n');
}

export const plain = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
