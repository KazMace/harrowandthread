import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      // Post-submission page carries noindex; keep it out of the sitemap too.
      filter: (page) => !page.includes('/enquire/success'),
      // Every page carries the build date as its last-changed date.
      lastmod: new Date(),
    }),
  ],
  output: 'static',
  site: 'https://harrowandthread.com',
  compressHTML: true,
});
