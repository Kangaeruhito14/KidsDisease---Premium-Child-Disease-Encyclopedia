# PediaCare SEO & Content Strategy

Research date: 2026-06-10. Sources: live web research + programmatic-seo /
seo-audit skills. This document drives the Astro site's page architecture.

## Search intent landscape (what parents actually search)

### Head terms (hub pages)
| Keyword pattern | Target page |
|---|---|
| childhood diseases list / common childhood illnesses | `/diseases/` A–Z index |
| pediatric symptom checker / child symptom checker | `/triage/` |
| child vaccination schedule / immunization schedule by age | `/vaccines/` |
| child fever when to worry | `/faq/` + fever diseases |
| signs of dehydration in children | `/diseases/dehydration/` + `/faq/` |

### Long-tail per-disease patterns (spoke pages, 115×)
Each disease page targets the cluster:
- `[disease] in children symptoms`
- `[disease] treatment for kids`
- `is [disease] contagious`
- `[disease] when to see a doctor`
- `how long does [disease] last in children`

Title template: `{Disease Name} in Children: Symptoms, Treatment & When to
Worry | PediaCare` (≤60 chars where possible).
Meta description template: first ~155 chars of classification + age group +
urgency, unique per page.

### Question keywords (FAQ page, sourced from People-Also-Ask patterns)
Verified against: HealthyChildren.org (AAP), KidsHealth (Nemours), CDC,
Johns Hopkins, Harvard Health, NHS, Lurie Children's, UC Davis Health.

1. When should I worry about my child's fever?
2. When should I take my child to the ER instead of the pediatrician?
3. What are the signs of dehydration in babies and children?
4. Are childhood vaccines safe? Can multiple vaccines overwhelm a baby's immune system?
5. How long do common childhood illnesses last?
6. Will a fever keep rising if I don't treat it? Can it cause brain damage? (myth)
7. What is RSV and which babies are most at risk?
8. How can I tell a measles rash from other childhood rashes?
9. My child has a barking cough at night (croup) — what should I do?
10. When can my child go back to school or daycare after being sick?
11. What belongs in a home care kit for a sick child?
12. Can I use PediaCare instead of seeing a doctor? (scope/disclaimer)

## Architecture (hub & spoke)

- Hubs: `/systems/` (18 organ-system hubs), `/diseases/` (A–Z), `/vaccines/`, `/triage/`, `/faq/`
- Spokes: `/diseases/{slug}/` — one static page per disease (115)
- Cross-links: differential diagnoses, same-category diseases, breadcrumbs
- URL style: subfolder, lowercase, hyphenated slugs (`otitis-media`, not `otitis_media`)

## Structured data

- Disease pages: `MedicalCondition` JSON-LD (name, alternateName,
  possibleTreatment, signOrSymptom, riskFactor) + `BreadcrumbList`
- FAQ page: `FAQPage` JSON-LD
- All pages: `MedicalWebPage` + `Organization`
- Honesty rule: never mark up content the page does not visibly contain.

## E-E-A-T & medical safety rules

- Every FAQ answer cites at least one authoritative source (AAP, CDC, WHO,
  NHS, Nemours) with a visible outbound link.
- Site-wide medical disclaimer on every page; emergency guidance always
  says "call your local emergency number".
- No drug brand names — generic active ingredients only (existing site rule).
- Machine-translated medical content is NOT statically published
  (Google scaled-content policy + clinical-safety risk). English is the
  canonical language; browsers' built-in translation handles the rest until
  human-reviewed translations exist.

## Language strategy

English canonical. `lang="en"` declared, content translate-friendly (no
`notranslate`), per-language static routes deferred until a human medical
reviewer can validate translations. The legacy SPA (with its 10-language UI
dictionary) remains in `legacy/` and keeps working.

## Domain note

`site` in astro.config.mjs uses the placeholder `https://pediacare.health`.
When the real domain is purchased, change it in ONE place (astro.config.mjs)
and rebuild — sitemap and canonical URLs update automatically.

## Research sources

- https://www.healthychildren.org/English/tips-tools/Symptom-Checker/Pages/default.aspx
- https://kidshealth.org/en/parents/fever.html
- https://kidshealth.org/en/parents/dehydration.html
- https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/dehydration.aspx
- https://www.cdc.gov/vaccines-children/hcp/conversation-tips/questions-parents-may-ask.html
- https://www.aap.org/en/patient-care/immunizations/communicating-with-families-and-promoting-vaccine-confidence/common-immunization-questions-from-parents/
- https://www.hopkinsmedicine.org/health/wellness-and-prevention/urgent-care-versus-the-er-a-pediatrician-offers-tips-on-making-the-right-choice
- https://www.health.harvard.edu/blog/worry-childs-fever-2017072512157
- https://health.ucdavis.edu/blog/cultivating-health/when-to-be-concerned-about-fevers-in-children-pediatricians-answer-your-questions/2025/01
- https://www.luriechildrens.org/en/blog/dehydration-in-children/
