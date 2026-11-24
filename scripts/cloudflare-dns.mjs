// Points a domain at GitHub Pages through the Cloudflare API.
// Reads CF_API_KEY (an API token, or a Global API Key together with CF_API_EMAIL),
// DOMAIN and PAGES_HOST. Prints a plan; changes records only when APPLY=true.

const { CF_API_KEY, CF_API_EMAIL, DOMAIN, PAGES_HOST } = process.env;
const apply = process.env.APPLY === 'true';
const api = 'https://api.cloudflare.com/client/v4';

if (!CF_API_KEY) fail('CF_API_KEY is empty. Add it under Settings > Secrets and variables > Actions.');
if (!DOMAIN || !PAGES_HOST) fail('DOMAIN and PAGES_HOST are required.');

// GitHub Pages addresses for an apex domain.
const A = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];
const AAAA = ['2606:50c0:8000::153', '2606:50c0:8001::153', '2606:50c0:8002::153', '2606:50c0:8003::153'];

const wanted = [
  ...A.map((content) => ({ type: 'A', name: DOMAIN, content })),
  ...AAAA.map((content) => ({ type: 'AAAA', name: DOMAIN, content })),
  { type: 'CNAME', name: `www.${DOMAIN}`, content: PAGES_HOST },
];

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

let headers;

async function call(path, init = {}) {
  const res = await fetch(api + path, { ...init, headers: { ...headers, 'Content-Type': 'application/json' } });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok && body.success, status: res.status, body };
}

const errors = (r) => (r.body.errors || []).map((e) => `${e.code} ${e.message}`).join('; ') || `HTTP ${r.status}`;

// An API token authenticates as a bearer; a Global API Key needs the account email beside it.
async function authenticate() {
  headers = { Authorization: `Bearer ${CF_API_KEY}` };
  const asToken = await call(`/zones?name=${DOMAIN}`);
  if (asToken.ok) return { kind: 'API token', zones: asToken.body.result };
  if (CF_API_EMAIL) {
    headers = { 'X-Auth-Email': CF_API_EMAIL, 'X-Auth-Key': CF_API_KEY };
    const asKey = await call(`/zones?name=${DOMAIN}`);
    if (asKey.ok) return { kind: 'Global API Key', zones: asKey.body.result };
    fail(`Cloudflare refused the key as a token (${errors(asToken)}) and as a Global API Key (${errors(asKey)}).`);
  }
  fail(
    `Cloudflare refused the key as an API token (${errors(asToken)}). ` +
      'If it is a Global API Key, add the account email as the secret CF_API_EMAIL.',
  );
}

const same = (a, b) => a.type === b.type && a.name === b.name && a.content.toLowerCase() === b.content.toLowerCase();
const line = (r) => `${r.type.padEnd(5)} ${r.name.padEnd(22)} ${r.content}${r.proxied ? '  (proxied)' : ''}`;

const { kind, zones } = await authenticate();
console.log(`Authenticated with a Cloudflare ${kind}.`);
if (!zones.length) fail(`No zone named ${DOMAIN} is visible to this key.`);
const zone = zones[0];
console.log(`Zone ${zone.name}: status ${zone.status}, nameservers ${zone.name_servers.join(', ')}`);

const listed = await call(`/zones/${zone.id}/dns_records?per_page=500`);
if (!listed.ok) fail(`Could not list DNS records: ${errors(listed)}`);
const existing = listed.body.result;

console.log(`\nExisting records (${existing.length}):`);
for (const r of existing) console.log(`  ${line(r)}`);

// Records that occupy the same names with address types stand in the way; everything else is left alone.
const names = new Set(wanted.map((w) => w.name));
const addressTypes = new Set(['A', 'AAAA', 'CNAME']);
const competing = existing.filter((r) => names.has(r.name) && addressTypes.has(r.type));

const keep = competing.filter((r) => wanted.some((w) => same(w, r)) && !r.proxied);
const unproxy = competing.filter((r) => wanted.some((w) => same(w, r)) && r.proxied);
const remove = competing.filter((r) => !wanted.some((w) => same(w, r)));
const create = wanted.filter((w) => !competing.some((r) => same(w, r)));

console.log('\nPlan:');
for (const r of keep) console.log(`  keep     ${line(r)}`);
for (const r of unproxy) console.log(`  unproxy  ${line(r)}`);
for (const r of remove) console.log(`  remove   ${line(r)}`);
for (const r of create) console.log(`  create   ${line(r)}`);
if (!unproxy.length && !remove.length && !create.length) console.log('  nothing to change');

if (!apply) {
  console.log('\nPlan only. Run again with apply on to make the changes.');
  process.exit(0);
}

// Proxying stays off so GitHub can issue and renew the certificate for the domain.
let failed = 0;
const done = (label, r, result) => {
  if (result.ok) console.log(`  ${label} ${line(r)}`);
  else {
    failed += 1;
    console.error(`::error::${label} ${line(r)} failed: ${errors(result)}`);
  }
};

console.log('\nApplying:');
for (const r of remove) done('removed', r, await call(`/zones/${zone.id}/dns_records/${r.id}`, { method: 'DELETE' }));
for (const r of unproxy)
  done('unproxied', r, await call(`/zones/${zone.id}/dns_records/${r.id}`, { method: 'PATCH', body: JSON.stringify({ proxied: false }) }));
for (const r of create)
  done('created', r, await call(`/zones/${zone.id}/dns_records`, { method: 'POST', body: JSON.stringify({ ...r, ttl: 1, proxied: false }) }));

process.exit(failed ? 1 : 0);
