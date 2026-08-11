import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      // Post-submission page carries noindex; keep it out of the sitemap too.
      // /lab/* are throwaway design explorations — noindex, and deleted before
      // rollout. They must never reach the sitemap in the meantime.
      filter: (page) => !page.includes('/enquire/success') && !page.includes('/lab/'),
    }),
  ],
  output: 'static',
  site: 'https://harrowandthread.com',
  compressHTML: true,
});
