// Checks every internal link and anchor in dist/, and every reference inside an agents.txt.
// Run after `pnpm build`:  pnpm check:links
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const dist = resolve('dist');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(dist);
const errors = [];
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};
const target = (from, href) => {
  const [path, hash] = href.split('#');
  let file = path === '' ? from : path.startsWith('/') ? join(dist, path) : resolve(dirname(from), path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  return { file, hash };
};

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    const { file: to, hash } = target(file, href);
    if (!existsSync(to)) errors.push(`${file.replace(dist, '')}: missing ${href}`);
    else if (hash && to.endsWith('.html') && !idsOf(to).has(decodeURIComponent(hash))) errors.push(`${file.replace(dist, '')}: missing anchor ${href}`);
  }
  // every page must advertise its agents.txt twin, and the twin must exist
  if (!existsSync(join(dirname(file), 'agents.txt'))) errors.push(`${file.replace(dist, '')}: no agents.txt beside it`);
}
for (const file of files.filter((f) => f.endsWith('agents.txt'))) {
  const text = readFileSync(file, 'utf8');
  const refs = [...text.matchAll(/(?:^|[\s(])((?:\.\.\/|\/)[^\s)]*)/gm)].map((m) => m[1]).filter((r) => /agents\.txt$|\/$/.test(r));
  for (const ref of refs) {
    const { file: to } = target(file, ref);
    if (!existsSync(to)) errors.push(`${file.replace(dist, '')}: missing ${ref}`);
  }
}
const pages = files.filter((f) => f.endsWith('.html')).length;
const twins = files.filter((f) => f.endsWith('agents.txt')).length;
if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} broken reference(s)`); process.exit(1); }
console.log(`ok: ${pages} pages, ${twins} agents.txt files, no broken links or anchors`);
