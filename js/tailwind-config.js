/**
 * PediaCare Tailwind Configuration Module
 */
window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            colors: {
                brandBg: '#FFF8F0', // Original warm peach cream background
                brandTeal: '#2ABFBF', // Original vibrant refreshing teal
                brandCoral: '#FF7F6E', // Original vibrant warm coral pink
                badgeMild: '#28A745', // Original vibrant forest green
                badgeModerate: '#FFC107', // Original vibrant golden yellow
                badgeSevere: '#FD7E14', // Original vibrant orange
                badgeEmergency: '#DC3545' // Original vibrant deep red
            },
            boxShadow: {
                premium: '0 12px 40px rgba(220, 140, 100, 0.04)',
                cardHover: '0 20px 40px rgba(42, 191, 191, 0.08)',
            }
        }
    }
};
