import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import purgecss from 'astro-purgecss';

export default defineConfig({
  site: 'https://macombcountyrealty.com',
  integrations: [
    sitemap(), 
    purgecss()
  ], 
});
