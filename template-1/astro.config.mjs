import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://vladimirtudor40-glitch.github.io',
  base: '/hotel-ana/template-1/',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
});
