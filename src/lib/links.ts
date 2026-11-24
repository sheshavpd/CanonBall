// Every internal link goes through url(), so the site can be served from a sub-path.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  return base + (path.startsWith('/') ? path : '/' + path);
}

export function guideUrl(slug: string): string {
  return url(`/guide/${slug}/`);
}

/** The agent-readable twin of a page lives beside it as agents.txt. */
export function agentsUrl(pagePath: string): string {
  const p = pagePath.endsWith('/') ? pagePath : pagePath + '/';
  return url(`${p}agents.txt`);
}
