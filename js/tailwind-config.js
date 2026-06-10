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
                badgeEmergency: '#DC3545', // Original vibrant deep red
                // In-between shades used across the markup that are not part
                // of the default Tailwind palette (extend deep-merges these
                // into the built-in scales).
                slate: {
                    650: '#3D4B62',
                    750: '#28354A'
                },
                orange: {
                    150: '#FEE2C0'
                }
            },
            boxShadow: {
                premium: '0 12px 40px rgba(220, 140, 100, 0.04)',
                cardHover: '0 20px 40px rgba(42, 191, 191, 0.08)',
                // Hairline shadows referenced throughout the markup; not part
                // of Tailwind v3's default scale.
                '2xs': '0 1px 2px rgba(45, 55, 72, 0.06)',
                '3xs': '0 1px 1px rgba(45, 55, 72, 0.05)'
            }
        }
    }
};
