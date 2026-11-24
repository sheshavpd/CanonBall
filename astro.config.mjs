import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// SITE_URL and BASE_PATH let the same build serve a custom domain or a sub-path of one.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [mdx()],
  // INLINE_CSS=1 puts every stylesheet in the page, for hosts that only serve HTML reliably.
  build: { format: 'directory', inlineStylesheets: process.env.INLINE_CSS ? 'always' : 'auto' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, wrap: false },
  },
});
