/**
 * Rebuilds data/database.js from the editable plain-JSON source.
 *
 * Workflow: edit data/database.source.json, then run `node build_db.js`.
 * The site loads only data/database.js (base64-wrapped payload).
 */
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'data', 'database.source.json');
const outputPath = path.join(__dirname, 'data', 'database.js');

const db = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

// Referential integrity checks — fail the build instead of shipping broken links.
const errors = [];
const systemIds = new Set(db.bodySystems.map(s => s.id));
const categoryIds = new Set(db.diseaseCategories.map(c => c.id));
const diseaseNames = new Set(db.diseases.map(d => d.name.toLowerCase().trim()));
const seenIds = new Set();

for (const d of db.diseases) {
    if (seenIds.has(d.id)) errors.push(`Duplicate disease id: ${d.id}`);
    seenIds.add(d.id);
    if (!systemIds.has(d.body_system)) errors.push(`${d.name}: unknown body_system "${d.body_system}"`);
    if (!categoryIds.has(d.category)) errors.push(`${d.name}: unknown category "${d.category}"`);
    if (d.imagePath && !fs.existsSync(path.join(__dirname, d.imagePath))) {
        errors.push(`${d.name}: missing image "${d.imagePath}"`);
    }
}

if (errors.length) {
    console.error(`FAIL: ${errors.length} integrity error(s):`);
    errors.forEach(e => console.error('  -', e));
    process.exit(1);
}

// Informational only: differential-diagnosis names that have no DB entry are
// allowed (they render as plain text, not links), but report them for review.
let unlinked = 0;
for (const d of db.diseases) {
    for (const r of d.related_diseases || []) {
        if (!diseaseNames.has(r.toLowerCase().trim())) unlinked++;
    }
}

const payload = Buffer.from(JSON.stringify(db), 'utf8').toString('base64');
const banner = '/**\n * PediaCare disease database payload.\n * GENERATED FILE — edit data/database.source.json and run `node build_db.js`.\n */\n';
fs.writeFileSync(outputPath, `${banner}const PediaCareDB_Encrypted = "${payload}";\n`);

console.log(`OK: ${db.diseases.length} diseases, ${db.bodySystems.length} systems, ${db.diseaseCategories.length} categories -> data/database.js`);
if (unlinked) console.log(`Note: ${unlinked} differential-diagnosis reference(s) have no database entry (rendered as plain text).`);
