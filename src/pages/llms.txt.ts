/**
 * /llms.txt — a curated, machine-readable map of the site for large language
 * models and AI answer engines (see https://llmstxt.org). Generated at build
 * time from the disease database so it always reflects current content.
 */
import {
    diseases,
    bodySystems,
    getDiseasesBySystem,
    diseaseSlug,
    overviewOf
} from '../lib/db';

const SITE = 'https://kidsdisease.com';

// Keep each description to a single concise sentence.
const oneLine = (s: string): string => {
    const t = s.trim();
    const cut = t.match(/^.*?[.!?](\s|$)/);
    return (cut ? cut[0] : t).trim();
};

export const GET = () => {
    const out: string[] = [];

    out.push('# Kids Disease');
    out.push('');
    out.push(
        `> Free, source-cited educational encyclopedia of childhood diseases for parents and caregivers. ` +
            `Covers ${diseases.length} pediatric conditions across ${bodySystems.length} body systems with staged symptoms, ` +
            `home care, prevention, vaccine guidance, and clear "when to see a doctor" thresholds. ` +
            `Content is compiled from and aligned with AAP, CDC, WHO and NHS guidance. ` +
            `Educational only — not medical advice; always consult a qualified pediatrician, and call your local emergency number in an emergency.`
    );
    out.push('');

    out.push('## Key pages');
    out.push(`- [Diseases A–Z](${SITE}/diseases/): full alphabetical index of all conditions`);
    out.push(`- [Body systems](${SITE}/systems/): conditions grouped by the organ system they affect`);
    out.push(`- [Vaccine schedule](${SITE}/vaccines/): routine child immunizations from birth to 12 years`);
    out.push(`- [Symptom triage checker](${SITE}/triage/): gauge urgency from mild to emergency`);
    out.push(`- [Parents' FAQ](${SITE}/faq/): fever thresholds, ER vs pediatrician, dehydration, vaccine safety`);
    out.push(`- [About & methodology](${SITE}/about/): how content is created, reviewed, and sourced`);
    out.push('');

    for (const s of bodySystems) {
        const list = getDiseasesBySystem(s.id);
        if (!list.length) continue;
        out.push(`## ${s.name}`);
        for (const d of list) {
            out.push(`- [${d.name}](${SITE}/diseases/${diseaseSlug(d.id)}/): ${oneLine(overviewOf(d))}`);
        }
        out.push('');
    }

    return new Response(out.join('\n'), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
};
