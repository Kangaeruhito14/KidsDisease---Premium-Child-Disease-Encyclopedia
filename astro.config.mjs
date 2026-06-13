// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    // TODO: replace with the real domain once purchased. Sitemap and
    // canonical URLs regenerate automatically from this single value.
    site: 'https://kidsdisease.com',
    trailingSlash: 'ignore',
    // Hide the floating Astro dev toolbar that appears at the bottom in dev mode.
    devToolbar: { enabled: false },
    integrations: [sitemap()],
    // Tailwind 4 runs via PostCSS (postcss.config.mjs): the @tailwindcss/vite
    // plugin is incompatible with Astro 6's rolldown-vite as of 4.3.0.
    security: {
        csp: {
            algorithm: 'SHA-256',
            directives: [
                "default-src 'none'",
                "img-src 'self' data:",
                "font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com",
                "connect-src 'self'",
                "manifest-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'"
            ],
            styleDirective: {
                resources: ["'self'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com']
            },
            scriptDirective: {
                resources: ["'self'"]
            }
        }
    }
});
