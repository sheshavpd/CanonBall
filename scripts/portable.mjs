// Makes a copy of dist/ that works from any folder or sub-path, by rewriting root-relative URLs
// ("/guide/") to relative ones ("../guide/index.html"). Useful for previews, file:// and unknown hosts.
// Usage: pnpm build && node scripts/portable.mjs [outDir]      (default: dist-portable)
import { cpSync, readFileSync, writeFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';

const src = 'dist';
const out = process.argv[2] || 'dist-portable';
rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const prefixFor = (file) => {
  const depth = relative(out, dirname(file)).split(sep).filter(Boolean).length;
  return depth === 0 ? './' : '../'.repeat(depth);
};
const withIndex = (u) => (u.endsWith('/') ? u + 'index.html' : u);

for (const file of walk(out)) {
  const pre = prefixFor(file);
  if (file.endsWith('.html')) {
    let html = readFileSync(file, 'utf8');
    html = html.replace(/(\s(?:href|src)=")\/(?!\/)([^"]*)"/g, (_, attr, rest) => {
      const [path, hash] = rest.split('#');
      return `${attr}${withIndex(pre + path)}${hash ? '#' + hash : ''}"`;
    });
    html = html.replace(/url\(\/_astro\//g, `url(${pre}_astro/`);
    writeFileSync(file, html);
  } else if (file.endsWith('.css')) {
    writeFileSync(file, readFileSync(file, 'utf8').replace(/url\(\/_astro\//g, 'url(./'));
  } else if (file.endsWith('agents.txt')) {
    const text = readFileSync(file, 'utf8').replace(/(^|[\s(])\/((?:guide|glossary)\/[^\s)]*|agents\.txt)?(?=[\s)]|$)/gm, (m, lead, rest) => {
      if (rest === undefined) return `${lead}${pre}index.html`;
      return `${lead}${withIndex(pre + rest)}`;
    });
    writeFileSync(file, text);
  }
}
console.log(`portable copy written to ${out}/`);
