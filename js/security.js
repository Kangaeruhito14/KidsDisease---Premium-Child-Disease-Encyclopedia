/**
 * PediaCare Security Hardening & Protection Module
 * Exposes core anti-XSS, anti-scraping, clickjacking protection,
 * and encrypted-database loader utilities.
 */

(function (window) {
    'use strict';

    const PediaCareSecurity = {
        /**
         * Strict HTML entity encoding to prevent Cross-Site Scripting (XSS)
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
         * Decodes the Base64 database string back into a JSON object
         */
        decryptDatabase(base64Str) {
            try {
                const decodedStr = atob(base64Str);
                return JSON.parse(decodedStr);
            } catch (err) {
                console.error("Security System: Database decryption failed.", err);
                return null;
            }
        },

        /**
         * Frame-busting clickjacking protection
         */
        preventClickjacking() {
            if (window.self !== window.top) {
                // If loaded inside an iframe, break out immediately
                window.top.location = window.self.location;
            }
        },

        /**
         * Disables copy events and right-clicks on clinical content elements
         */
        initUiProtections() {
            document.addEventListener('contextmenu', function (e) {
                // Block context menu on sensitive content elements
                if (e.target.closest('.secure-content') || e.target.closest('#app')) {
                    e.preventDefault();
                    PediaCareSecurity.showToast("Notice: Right-click context menus are disabled to protect content integrity.");
                }
            });

            document.addEventListener('copy', function (e) {
                if (e.target.closest('.secure-content') || e.target.closest('#app')) {
                    e.preventDefault();
                    PediaCareSecurity.showToast("Notice: Clipboard copy actions are disabled to prevent automated scraping.");
                }
            });
        },

        /**
         * Tracks user interaction rate to detect and lock out robotic scraping activity
         */
        initScraperDetector() {
            let transitionCount = 0;
            let lastResetTime = Date.now();
            const thresholdLimit = 6; // max transitions allowed in 1.5 seconds
            const timeFrame = 1500;

            const checkRate = function () {
                const now = Date.now();
                if (now - lastResetTime > timeFrame) {
                    transitionCount = 0;
                    lastResetTime = now;
                }
                transitionCount++;
                if (transitionCount > thresholdLimit) {
                    PediaCareSecurity.triggerSoftLock();
                }
            };

            // Hook onto global clicks and keyups
            document.addEventListener('click', checkRate, true);
            document.addEventListener('keyup', checkRate, true);
        },

        /**
         * Locks out the interface if bot-like rapid request speed is triggered
         */
        triggerSoftLock() {
            const body = document.querySelector('body');
            if (body) {
                body.innerHTML = `
                    <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #FFF8F0; color: #7F8C8D; text-align: center; padding: 20px;">
                        <div style="background-color: #FF7F6E; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 20px;">⚠️</div>
                        <h1 style="color: #2C3E50; margin-bottom: 10px; font-size: 24px;">Security Protection Triggered</h1>
                        <p style="max-w: 500px; line-height: 1.6; margin-bottom: 20px; font-size: 14px;">Automated scraping pattern or excessive interaction rate was detected. Access has been soft-locked to protect database contents.</p>
                        <button onclick="window.location.reload()" style="background-color: #2ABFBF; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 10px rgba(42,191,191,0.2);">Verify & Reload Page</button>
                    </div>
                `;
            }
        },

        /**
         * Displays a temporary secure toast notification
         */
        showToast(msg) {
            let toast = document.getElementById('security-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'security-toast';
                toast.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: #2C3E50;
                    color: #FFFFFF;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 10px 20px;
                    border-radius: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    text-align: center;
                    max-width: 90%;
                `;
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            setTimeout(() => {
                toast.style.opacity = '0';
            }, 3000);
        }
    };

    // Apply immediate frame-busting on load
    PediaCareSecurity.preventClickjacking();

    // Hook onto global windows
    window.PediaCareSecurity = PediaCareSecurity;

    // Apply UI protections and scraper filters when DOM content is ready
    document.addEventListener('DOMContentLoaded', function () {
        PediaCareSecurity.initUiProtections();
        PediaCareSecurity.initScraperDetector();
    });

})(window);
