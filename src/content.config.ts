import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// One MDX file per guide chapter. The same file feeds the HTML page and its agents.txt.
const guide = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guide' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    part: z.enum(['start', 'walkthrough', 'write', 'structure', 'verification', 'building']),
    /** Set on the seven walkthrough chapters: which station of the conveyor the chapter covers. */
    station: z.enum(['collect', 'shape', 'build', 'verify', 'review', 'release', 'operate']).optional(),
    order: z.number(),
    /** Two to four takeaways, shown at the top of the chapter. */
    points: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { guide };
