#!/usr/bin/env node
/*
 * Lijst van alle bronlinks achter de voorwaarden, voor de wekelijkse linkcontrole (.github/workflows/links.yml).
 * Bronnen: CONTROLE in data/voorwaarden-controle.js (alleen geverifieerde waarden), data/productvoorwaarden.js
 * en de kenmerken, statussen en toezichtbronnen in data/partijen.js.
 *
 *   node tools/bronnen-lijst.js          schrijft docs/bronnen-urls.txt (één URL per regel, gesorteerd)
 *   node tools/bronnen-lijst.js --check  faalt als het bestand niet actueel is
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const UIT = path.join(ROOT, 'docs', 'bronnen-urls.txt');
const urls = new Set();
const voeg = u => { if (typeof u === 'string' && /^https:\/\/[^\s"'<>]+$/i.test(u)) urls.add(u.trim()); };

const html = fs.readFileSync(path.join(ROOT, 'data', 'voorwaarden-controle.js'), 'utf8');
const m = /const CONTROLE = (\{[\s\S]*?\});\s*const EIGEN_DOMEINEN/.exec(html);
if (!m) { console.error('bronnen-lijst: CONTROLE niet gevonden'); process.exit(1); }
for (const x of Object.values(JSON.parse(m[1]))) for (const w of Object.values(x.criteria || {})) if (w.geverifieerd) (w.bron || []).forEach(voeg);

function laad(bestand) { const sb = { window: {} }; vm.createContext(sb); vm.runInContext(fs.readFileSync(path.join(ROOT, bestand), 'utf8'), sb, { timeout: 5000 }); return sb.window; }
for (const p of laad('data/productvoorwaarden.js').PRODUCTVOORWAARDEN || []) for (const a of p.aanbieders) {
  voeg(a.url); (a.docs || []).forEach(d => voeg(d.u)); for (const w of Object.values(a.crit)) (w.b || []).forEach(voeg);
}
for (const p of laad('data/partijen.js').PARTIJEN || []) {
  voeg(p.toezichtBron); voeg(p.statusBron); (p.kenmerken || []).forEach(k => voeg(k.bron));
}

const tekst = '# Gegenereerd door tools/bronnen-lijst.js: bronlinks achter de voorwaarden (' + urls.size + '). Niet met de hand wijzigen.\n' + [...urls].sort().join('\n') + '\n';
const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
if (process.argv.includes('--check')) {
  if (huidig !== tekst) { console.error('docs/bronnen-urls.txt is niet actueel; draai node tools/bronnen-lijst.js'); process.exit(1); }
  console.log('Bronnenlijst is actueel (' + urls.size + ' links).');
} else if (huidig === tekst) console.log('Ongewijzigd: docs/bronnen-urls.txt (' + urls.size + ' links).');
else { fs.writeFileSync(UIT, tekst); console.log('Geschreven: docs/bronnen-urls.txt (' + urls.size + ' links).'); }
