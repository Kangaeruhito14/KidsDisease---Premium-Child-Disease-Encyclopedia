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
    // No code blocks anywhere on the site, and Shiki's inline styles clash with
    // our strict CSP — disable syntax highlighting to drop the build warning.
    markdown: { syntaxHighlight: false },
    // Tailwind 4 runs via PostCSS (postcss.config.mjs): the @tailwindcss/vite
    // plugin is incompatible with Astro 6's rolldown-vite as of 4.3.0.
    security: {
        csp: {
            algorithm: 'SHA-256',
            directives: [
                "default-src 'none'",
                // Google Analytics serves beacons/pixels from *.google-analytics.com.
                "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
                "font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com",
                // GA4 sends collected events to these Google endpoints.
                "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
                "manifest-src 'self'",
                "object-src 'none'",
                "base-uri 'self'",
                "form-action 'self'"
            ],
            styleDirective: {
                resources: ["'self'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com']
            },
            scriptDirective: {
                // 'self' covers Astro-bundled scripts; the gtag.js loader is
                // fetched from googletagmanager.com. Astro auto-hashes the
                // scripts it PROCESSES, but NOT `is:inline` ones — so every
                // static inline script is pinned here by SHA-256. If you edit
                // any of these, recompute its hash (it prints in the build /
                // see scripts/) and update the matching entry, or it will be
                // blocked on the deployed site (CSP is not enforced in `dev`).
                resources: ["'self'", 'https://www.googletagmanager.com'],
                hashes: [
                    'sha256-o2dTOuxs7awbhiQbI+XfhSBQ4xZLHWlxe6JO+QiK4nY=', // theme pre-paint — Base.astro
                    'sha256-VDLxNztdDNr27od0GJcQWmgOgnxTQbAWe6o8YGN4m3Y=', // cookie-consent manager (loads GA on accept) — Base.astro
                    'sha256-/ffGbvw6rb1b22s9sSW4xXLcmVp4jJUBYPw6urITaYc=', // home autocomplete — index.astro
                    'sha256-/WPzvRkALhBBaylYrFU9GWK04fnDWULOH+t9Rhu69gg=', // triage scorer — triage.astro
                    'sha256-fMIPF2OY7uQ86kzlGYD7b8nen57nmC3c6wb6k4t9Ni8=' // search — search.astro
                ]
            }
        }
    }
});
