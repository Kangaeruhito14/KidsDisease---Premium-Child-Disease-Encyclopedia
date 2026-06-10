/**
 * PediaCare Security Module
 *
 * Real protections kept: HTML entity encoder (for any future raw-HTML sink),
 * database payload decoder, and frame-busting against clickjacking.
 *
 * Deliberately removed (they harmed users without adding security):
 *  - Copy/right-click blocking: parents must be able to copy medical advice
 *    to share with doctors and caregivers; it also broke screen readers.
 *  - Interaction-rate "scraper" lockout: it wiped the page after 6 events in
 *    1.5s, which normal typing in the search box triggered. On a medical
 *    reference site, locking out a worried parent is the worst failure mode.
 *    The database is plain base64 in a public file, so the lockout protected
 *    nothing — actual XSS safety comes from Vue's escaped interpolation and
 *    the Content-Security-Policy header in index.html.
 */

(function (window) {
    'use strict';

    const PediaCareSecurity = {
        /**
         * Strict HTML entity encoding. Only needed if a value is ever placed
         * into a raw-HTML sink (v-html, innerHTML). Vue's {{ }} interpolation
         * escapes automatically — do NOT pre-encode data rendered that way,
         * or it will display double-escaped.
         */
        sanitize(input) {
            if (input === null || input === undefined) return '';
            if (typeof input !== 'string') {
                if (Array.isArray(input)) {
                    return input.map(item => this.sanitize(item));
                }
                return input;
            }
            return input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
        },

        /**
         * Decodes the base64 database payload back into a JSON object.
         */
        decryptDatabase(base64Str) {
            try {
                // atob yields a byte string; decode as UTF-8 so non-ASCII
                // characters (™, é, …) survive the round trip.
                const bytes = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));
                return JSON.parse(new TextDecoder('utf-8').decode(bytes));
            } catch (err) {
                console.error("Security System: Database decoding failed.", err);
                return null;
            }
        },

        /**
         * Frame-busting clickjacking protection (backs up the CSP
         * frame-ancestors directive for very old browsers).
         */
        preventClickjacking() {
            if (window.self !== window.top) {
                window.top.location = window.self.location;
            }
        }
    };

    PediaCareSecurity.preventClickjacking();

    window.PediaCareSecurity = PediaCareSecurity;

})(window);
