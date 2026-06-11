// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    // TODO: replace with the real domain once purchased. Sitemap and
    // canonical URLs regenerate automatically from this single value.
    site: 'https://pediacare.health',
    trailingSlash: 'ignore',
    integrations: [sitemap()]
    // Tailwind 4 runs via PostCSS (postcss.config.mjs): the @tailwindcss/vite
    // plugin is incompatible with Astro 6's rolldown-vite as of 4.3.0.
});
