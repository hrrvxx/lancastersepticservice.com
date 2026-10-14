import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lancastersepticservice.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap({ filter: page => !page.includes('/404') })],
});
