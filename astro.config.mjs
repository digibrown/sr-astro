import { defineConfig } from 'astro/config';

// Minimal static Astro site for GitHub Pages with custom domain
export default defineConfig({
  site: 'https://sendremit.com',
  output: 'static',
  integrations: [],
});

