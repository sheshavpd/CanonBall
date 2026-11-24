import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// One MDX file per guide chapter. The same file feeds the HTML page and its agents.txt.
const guide = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guide' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    part: z.enum(['idea', 'structure', 'change', 'verification', 'building']),
    order: z.number(),
    /** Two to four takeaways, shown at the top of the chapter. */
    points: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { guide };
