/**
 * Data access layer over the plain-JSON disease database.
 * The same source file also feeds the legacy SPA via `node build_db.js`.
 */
import db from '../../data/database.source.json';

export interface BodySystem {
    id: string;
    name: string;
    icon: string;
    color: string;
    dotColor: string;
    description: string;
    imagePath: string;
}

export interface DiseaseCategory {
    id: string;
    body_system: string;
    name: string;
}

export type UrgencyLevel = 'mild' | 'moderate' | 'severe' | 'emergency';

export interface Disease {
    id: string;
    body_system: string;
    category: string;
    name: string;
    classification: string;
    affected_age_group: string;
    causes: string;
    pathophysiology: string;
    symptoms_early: string;
    symptoms_progressive: string;
    symptoms_severe: string;
    urgency_level: UrgencyLevel;
    diagnosis_methods: string;
    treatment_plan: string;
    home_care: string;
    medicinal_elements: string;
    when_to_see_doctor: string;
    prevention: string;
    vaccination_info: string;
    prognosis: string;
    recovery_timeline: string;
    complications: string;
    related_diseases: string[];
    tags: string[];
    imagePath: string;
    overview?: string;
}

export const bodySystems = db.bodySystems as BodySystem[];
export const diseaseCategories = db.diseaseCategories as DiseaseCategory[];
export const diseases = db.diseases as Disease[];

/* ---------- Slugs (SEO URLs use hyphens, database ids use underscores) ---------- */

export const diseaseSlug = (id: string): string => id.replace(/_/g, '-');
export const idFromSlug = (slug: string): string => slug.replace(/-/g, '_');

export const diseaseUrl = (d: Disease): string => `/diseases/${diseaseSlug(d.id)}/`;
export const systemUrl = (s: BodySystem | string): string =>
    `/systems/${typeof s === 'string' ? s : s.id}/`;

/* ---------- Lookups ---------- */

const byId = new Map(diseases.map(d => [d.id, d]));
const byName = new Map(diseases.map(d => [d.name.toLowerCase().trim(), d]));
const systemsById = new Map(bodySystems.map(s => [s.id, s]));
const categoriesById = new Map(diseaseCategories.map(c => [c.id, c]));

export const getDisease = (id: string): Disease | undefined => byId.get(id);
export const findDiseaseByName = (name: string): Disease | undefined =>
    byName.get(name.toLowerCase().trim());
export const getSystem = (id: string): BodySystem | undefined => systemsById.get(id);
export const getCategory = (id: string): DiseaseCategory | undefined => categoriesById.get(id);

export const getDiseasesBySystem = (systemId: string): Disease[] =>
    diseases.filter(d => d.body_system === systemId);

export const getCategoriesBySystem = (systemId: string): DiseaseCategory[] =>
    diseaseCategories.filter(c => c.body_system === systemId);

export const getDiseasesByCategory = (categoryId: string): Disease[] =>
    diseases.filter(d => d.category === categoryId);

/* ---------- Presentation helpers ---------- */

/** Canonical illustration URL (files live in public/illustrations/). */
export const illustrationUrl = (imagePath: string): string =>
    `/illustrations/${imagePath.split('/').pop()}`;

export const overviewOf = (d: Disease): string => d.overview || d.classification;

/** Short, unique meta description per disease (~155 chars). */
export const metaDescription = (d: Disease): string => {
    const base = `${d.name} in children: ${overviewOf(d)} Affects ${d.affected_age_group}.`;
    return base.length <= 158 ? base : `${base.slice(0, 155).replace(/\s+\S*$/, '')}…`;
};

export const URGENCY_STYLES: Record<UrgencyLevel, { label: string; badge: string }> = {
    mild: { label: 'Mild', badge: 'bg-badge-mild' },
    moderate: { label: 'Moderate', badge: 'bg-badge-moderate' },
    severe: { label: 'Severe', badge: 'bg-badge-severe' },
    emergency: { label: 'Emergency', badge: 'bg-badge-emergency animate-emergency' }
};
