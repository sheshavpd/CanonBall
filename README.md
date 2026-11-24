# CanonBall

**The lifecycle agents can run and people can trust.**

This repository is the CanonBall website: a landing page that introduces the method, a guide with one chapter per concept, a glossary, and a plain-text twin of every page for agents.

## Stack

- [Astro 7](https://astro.build), static output. Pages ship as HTML and CSS; the three interactive pieces on the landing page are small inline scripts.
- TypeScript, strict.
- Hand-written CSS with design tokens in `src/styles/global.css`. No CSS framework.
- IBM Plex Sans and IBM Plex Mono, self-hosted through Fontsource.
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
├── content/guide/*.md      the guide. One Markdown file per chapter.
├── data/
│   ├── site.ts             tagline, the primitives, the steps of a change, the dial
│   ├── repo.ts             the example repository shown on the landing page
│   └── glossary.ts         every term, with the chapter that explains it
├── components/             Logo, Header, Footer, RepoExplorer, Dial, FailFirst, GuideIndex
├── layouts/                Base (every page), Guide (chapter pages)
├── lib/
│   ├── links.ts            url() helper, so the site can live under a sub-path
│   ├── guide.ts            chapters in reading order
│   └── agents.ts           builds every agents.txt
├── pages/                  routes, including the agents.txt endpoints
└── styles/global.css       the design system
```

## Writing a chapter

Add a Markdown file to `src/content/guide/`:

```markdown
---
title: The title
summary: Two sentences that say what the chapter is about.
part: idea            # idea | structure | change | verification | building
order: 5              # position within the part
related: [primitives, evidence]
---

## A heading

Body text. Link to other chapters with relative links: [stories](../stories/).
```

The chapter appears in the guide index, the sidebar, the landing page, and gets its own `agents.txt`. Nothing else needs editing.

Chapters are plain Markdown on purpose. The same source renders the HTML page and the agent-readable text, so the two cannot drift apart.

## agents.txt

Every page at `/x/` has a plain-text version at `/x/agents.txt`.

| Page | Agent-readable twin |
|---|---|
| `/` | `/agents.txt`, which is also the site index |
| `/guide/` | `/guide/agents.txt` |
| `/guide/<chapter>/` | `/guide/<chapter>/agents.txt` |
| `/glossary/` | `/glossary/agents.txt` |

Each file carries the page text in Markdown and ends with a References section that links to other `agents.txt` files: previous and next chapter, related chapters, the guide index, the glossary and the site index. Every HTML page advertises its twin with `<link rel="alternate" type="text/plain">` and a visible link in the header.

`pnpm check:links` fails the build if a page has no twin or a reference points nowhere.

## Deploying

The build is a static folder, `dist/`. It runs on any static host.

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

The site uses plain words where the underlying specification has its own. The glossary shows both.

| On the site | In the specification |
|---|---|
| promise | requirement |
| limit | envelope |
| story | example |
| release | landing |
| recorded failure | red proof |
| injected fault | seeded fault |
| decision logic, adapter | pure core, door |
| vocabulary.md | glossary.md |
