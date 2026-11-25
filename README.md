# CanonBall

**The lifecycle agents can run and people can trust.**

This branch is the CanonBall website: a landing page that introduces the method, the guide, a glossary, and a plain-text twin of every page for agents. The starter repository is on `main`, and the worked example on `refunds-example`.

## Stack

- [Astro 7](https://astro.build), static output. Pages ship as HTML and CSS; the three interactive pieces on the landing page are small inline scripts.
- TypeScript, strict.
- Hand-written CSS with design tokens in `src/styles/global.css`. No CSS framework.
- Manrope for headings, Figtree for text, JetBrains Mono for code, self-hosted through Fontsource.
- MDX for the guide, so chapters can embed figures.
- pnpm.

## Run it

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm verify       # type check, build, then check every link, anchor and agents.txt reference
pnpm preview      # serve the built site
```

## Where things are

```text
src/
├── content/guide/*.mdx     the guide. One MDX file per chapter.
├── data/
│   ├── site.ts             tagline, the primitives, the steps of a change, the dial
│   ├── repo.ts             the example repository shown on the landing page
│   ├── figures.ts          caption and text description of every figure
│   └── glossary.ts         every term, with the chapter that explains it
├── components/             Logo, Header, Footer, RepoExplorer, Dial, FailFirst, Figure
├── layouts/                Base (every page), Guide (chapter pages)
├── lib/
│   ├── links.ts            url() helper, so the site can live under a sub-path
│   ├── guide.ts            chapters in reading order
│   └── agents.ts           builds every agents.txt
├── pages/                  routes, including the agents.txt endpoints
└── styles/global.css       the design system
```

## Writing a chapter

Add an `.mdx` file to `src/content/guide/`:

```markdown
---
title: The title
summary: Two sentences that say what the chapter is about.
part: idea            # idea | structure | change | verification | building
order: 5              # position within the part
points:               # two to four takeaways, shown at the top. Quote them.
  - "The first takeaway."
  - "The second takeaway."
related: [primitives, evidence]
---

## A heading

Body text. Link to other chapters with relative links: [examples](../examples/).

<Figure id="layers" />
```

The chapter appears in the guide sidebar and in the root `agents.txt`, and gets its own `agents.txt`. Nothing else needs editing.

### Figures

Three components are available inside a chapter without importing them: `<Figure id="..." />`, `<Dial />` and `<FailFirst />`.

To add a figure, draw it in `src/components/Figure.astro` and register its caption and a text description in `src/data/figures.ts`. The description is what an agent reads in place of the picture, so the HTML page and the agent-readable text come from one source and cannot drift apart.

## agents.txt

Every page at `/x/` has a plain-text version at `/x/agents.txt`.

| Page | Agent-readable twin |
|---|---|
| `/` | `/agents.txt`, which is also the index of every chapter |
| `/guide/<chapter>/` | `/guide/<chapter>/agents.txt` |
| `/glossary/` | `/glossary/agents.txt` |

Each file carries the page text in Markdown, with key points at the top and each figure replaced by its description. It ends with a References section that links to other `agents.txt` files: previous and next chapter, related chapters, the glossary and the site index. Every HTML page advertises its twin with `<link rel="alternate" type="text/plain">` and a visible link in the header.

`pnpm check:links` fails the build if a page has no twin or a reference points nowhere.

## Deploying

The site is published at [canonball.org](https://canonball.org) by GitHub Pages. Pages serves the `gh-pages` branch. This website lives on the `site` branch; `main` holds the CanonBall starter repository. Every push to `site` runs `.github/workflows/deploy.yml`, which type checks, builds, checks links and replaces `gh-pages` with the contents of `dist/`. `public/CNAME` carries the custom domain and `public/.nojekyll` stops Pages from dropping the `_astro` folder.

The domain's DNS lives in Cloudflare. `.github/workflows/domain.yml` is run by hand and points the apex and `www` at GitHub Pages through the Cloudflare API, using the repository secret `CF_API_KEY`: an API token with DNS edit rights on the zone, or a Global API Key together with the account email in `CF_API_EMAIL`. The script behind it, `scripts/cloudflare-dns.mjs`, runs the same way from a shell that has those variables. With `apply` off it prints the existing records and the plan and changes nothing. It only touches A, AAAA and CNAME records on `canonball.org` and `www.canonball.org`, and leaves them unproxied so that GitHub can issue the certificate.

The build itself is a static folder and runs on any static host.

Two environment variables shape the build:

| Variable | Purpose | Example |
|---|---|---|
| `SITE_URL` | Makes canonical links and agents.txt references absolute | `https://example.com` |
| `BASE_PATH` | Serves the site from a sub-path | `/canonball/` |

```sh
SITE_URL=https://example.com BASE_PATH=/canonball/ pnpm build
```

`pnpm portable` writes a copy of the build to `dist-portable/` in which every URL is relative, for previews and hosts where the final path is not known.

## Vocabulary used on the site

The site uses established engineering terms where they exist, and plain words otherwise. The glossary shows the specification's term beside each, and the chapter "Where the words come from" cites the source of every term.

| On the site | In the specification |
|---|---|
| promise | requirement |
| constraint | envelope |
| example | story |
| change proposal | change.md |
| release | landing |
| release candidate | candidate present |
| recorded failure | red proof |
| injected fault | seeded fault |
| decision logic, adapter | pure core, door |
| vocabulary.md | glossary.md |
