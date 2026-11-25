// Builds the agent-readable twin of every page. Each page at /x/ has a plain-text version at /x/agents.txt,
// generated from the same source as the HTML, so the two cannot drift apart.
import { site, parts, written, computed, steps, dial } from '../data/site';
import { rows, pathOf } from '../data/repo';
import { glossary } from '../data/glossary';
import { figures } from '../data/figures';
import { stations, ideas, pressures, type Station } from '../data/workflow';
import { appendix } from '../data/appendix';
import { compareUrl } from './repo';
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
    `- Site: ${site.name}. ${site.tagline}`,
    `- HTML page: ${abs(path, s)}`,
    `- This file: ${txt(path, s)}`,
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
  Dial: `[Interactive figure: levels of automation] ${dial.rows.length} kinds of decision, each on a scale from 0 (${dial.levels[0]!.toLowerCase()}) to 5 (${dial.levels[5]!.toLowerCase()}), shown for three scenarios: ${dial.scenarios.join(', ').toLowerCase()}. Values in that order: ${dial.rows.map((r) => `${r.name.toLowerCase()} ${r.v.join(', ')}`).join('; ')}. These are an illustration.`,
  FailFirst: '[Interactive figure: a check must fail before its pass counts] Three checks for INV-004 pass. The third has never been seen to fail, so the computed status is "unsupported". After a fault is injected, the third check fails as it should, and that failing run is kept. Run again on the real build, all three pass and the status becomes "accepted".',
};
const who = (st: Station): string =>
  [
    [...st.agents, ...(st.alsoAgents ?? [])].length ? `agents: ${[...st.agents, ...(st.alsoAgents ?? [])].join(', ')}` : '',
    [...st.people, ...(st.alsoPeople ?? [])].length ? `people: ${[...st.people, ...(st.alsoPeople ?? [])].join(', ')}` : '',
    st.sometimes?.length ? `in some cases: ${st.sometimes.map((x) => `${x.who} (${x.when})`).join(', ')}` : '',
    st.program ? `a program: ${st.program}` : '',
  ].filter(Boolean).join('; ');

/** The conveyor, as text: the stations in order, the express belt, the two pressures and the three ideas. */
export function conveyorText(): string {
  const out = [
    '[Animated figure: the conveyor] Requests arrive and gather into a milestone. The milestone passes seven stations on a belt and leaves as a CanonBall. Each station names who works there.',
    '',
    ...stations.map((st, i) => `${i + 1}. ${st.name}. ${st.does} Who: ${who(st)}.${st.gate ? ` ${st.gate.name}: ${st.gate.text}` : ''}`),
    '',
    'Below the main belt runs an express belt for repairs and upkeep that change no promise. An incident returns from Operate along a dashed line, enters the express belt as a single fix, and passes the same stations alone, without waiting for a milestone.',
    'An observability rail (logs, traces, metrics, state, replay) runs under the belts from Build to Operate. The Verify station is drawn as a built chamber, the verification environment, which work on both belts passes through.',
    'At Review, every milestone and every express item stops for an agent. Only a milestone marked critical also waits behind a barrier until a person has reviewed it.',
    '',
    pressures.forward,
    pressures.back,
    '',
    'Three practices are marked 1 to 3 on the figure. Together they make it possible for agents to do most of the work reliably:',
    ...ideas.map((d) => `${d.n}. ${d.title}. ${d.text} ${d.strong}`),
    '',
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
    .replace(/<Conveyor[^>]*\/>/g, () => conveyorText())
    .replace(/<Appendix \/>/g, () => '```markdown\n' + appendix.trim() + '\n```');
}

function stationText(chapter: Chapter): string {
  const idx = stations.findIndex((st) => st.id === chapter.data.station);
  if (idx < 0) return '';
  const st = stations[idx]!;
  return [
    `Station ${idx + 1} of ${stations.length} on the conveyor: ${st.name}.`,
    '',
    `- Who works here: ${who(st)}.`,
    `- Reads: ${st.reads.join(', ')}.`,
    `- Writes: ${st.writes.join(', ')}.`,
    ...(st.gate ? [`- ${st.gate.name}: ${st.gate.text}`] : []),
    ...(st.diff ?? []).map((d) => `- In the example repository${d.label ? `, ${d.label}` : ''}: ${compareUrl(d.from, d.to)}`),
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
    '## Start from the repository',
    '',
    `The starter repository is ${site.repo}/tree/main. Create a repository from it, fill in the top of AGENTS.md, and point an agent at it. It holds the layout, the templates, the policy pages, an AGENTS.md whose appendix teaches the method, and tools/canonball, the orchestrator (check, run, fault, record, status, release, new).`,
    `The worked example is the branch ${site.example}: ${site.repo}/tree/${site.example}. It is the starter after a refunds service was built with it, with one commit per station: CanonBall 12, then Collect, Shape, Build, Verify, Review and Release of milestone M2 (CanonBall 13), then the incident INC-007 and its repair (CanonBall 14). Each station chapter links to the diff its station produced.`,
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
    'When agents write the code, establishing that a change is correct takes the larger share of the effort. The environments in which promises are checked are designed with a person who understands them, because evidence is only as credible as the method that produced it. A verification environment has seven parts: boundary, stimulus, world, probes, oracle, coverage, control. It also states what it cannot show. A check must be seen to fail, against an injected fault, before its pass counts.',
    `More: ${txt('/guide/verification-engineering/', s)}`,
    '',
    '## Observability',
    '',
    'An agent begins each task with no memory of the system, so it depends on what the system can tell it. Three rules: every decision the system makes is logged with the clause it applied and the inputs it used; one trace follows each request through every adapter; agents have commands to read logs, traces, metrics and state, and to replay a request. One investment serves three stations: the builder sees what its code does, the verifier explains every failure, and the on-call agent diagnoses incidents. People see the same view.',
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
  out.push('', 'A team starts at level 1 everywhere. Settings move on track record, never on a model release. An agent reviews every change at every setting; a person reviews as well whenever the policy lists the change as critical. Illustrative settings (day one / billing service later / robot fleet later):', '');
  for (const r of dial.rows) out.push(`- ${r.name}: ${r.v.join(' / ')}${r.lock ? ' (stays with people)' : ''}`);
  out.push(`More: ${txt('/guide/delegation/', s)}`, '', '## All pages', '');
  all.forEach((c, i) => out.push(`- Chapter ${i + 1}. ${c.data.title}: ${txt(`/guide/${c.id}/`, s)}`, `  ${c.data.summary}`));
  out.push(`- Glossary: ${txt('/glossary/', s)}`, '');
  return out.join('\n');
}

export const plain = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
