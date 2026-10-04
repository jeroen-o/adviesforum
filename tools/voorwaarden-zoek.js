#!/usr/bin/env node
/*
 * Zoekindex van alle gecontroleerde voorwaarden voor de zoekfunctie van het forum (index.html, bron "Voorwaarden").
 * Eén regel per aanbieder, product en kenmerk: [productId, aanbieder, slug, criteriumId, criteriumnaam, waarde, geverifieerd].
 * Wordt pas bij de eerste zoekopdracht geladen.
 *
 *   node tools/voorwaarden-zoek.js          schrijft data/voorwaarden-zoek.js
 *   node tools/voorwaarden-zoek.js --check  faalt als het bestand niet actueel is
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const UIT = path.join(ROOT, 'data', 'voorwaarden-zoek.js');
function fout(m) { console.error('voorwaarden-zoek: ' + m); process.exit(1); }
function laad(b) { const sb = { window: {} }; vm.createContext(sb); vm.runInContext(fs.readFileSync(path.join(ROOT, b), 'utf8'), sb, { timeout: 5000 }); return sb.window; }
const slug = n => String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'partij';
const kaal = w => String(w || '').replace(/^[+~!-]\s*/, '').replace(/\s+/g, ' ').trim();

const html = fs.readFileSync(path.join(ROOT, 'voorwaarden-vergelijker.html'), 'utf8');
const NAAM = {};
for (const m of html.matchAll(/\{\s*"?id"?\s*:\s*['"]([a-z0-9]+)['"]\s*,\s*"?cat"?\s*:\s*['"][A-Z]['"]\s*,\s*"?naam"?\s*:\s*['"]([^'"]+)['"]/g)) NAAM[m[1]] = m[2];
const m = /const CONTROLE = (\{[\s\S]*?\});\s*const EIGEN_DOMEINEN/.exec(fs.readFileSync(path.join(ROOT, 'data', 'voorwaarden-controle.js'), 'utf8'));
if (!m) fout('CONTROLE niet gevonden');
const rijen = [];
const C = JSON.parse(m[1]);
for (const naam of Object.keys(C).sort((a, b) => a.localeCompare(b, 'nl')))
  for (const [id, w] of Object.entries(C[naam].criteria || {})) rijen.push(['hyp', naam, slug(naam), id, NAAM[id] || id, kaal(w.waarde), w.geverifieerd ? 1 : 0]);
for (const p of laad('data/productvoorwaarden.js').PRODUCTVOORWAARDEN || []) {
  const cn = {}; p.criteria.forEach(c => { cn[c.id] = c.naam; });
  for (const a of p.aanbieders) for (const [id, w] of Object.entries(a.crit)) rijen.push([p.id, a.naam, slug(a.naam), id, cn[id] || id, kaal(w.w), w.g ? 1 : 0]);
}
const tekst = '/* Gegenereerd door tools/voorwaarden-zoek.js. Niet met de hand wijzigen. [product, aanbieder, slug, kenmerk-id, kenmerk, waarde, geverifieerd] */\nwindow.VOORWAARDEN_ZOEK = ' + JSON.stringify(rijen) + ';\n';
const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
if (process.argv.includes('--check')) {
  if (huidig !== tekst) fout('data/voorwaarden-zoek.js is niet actueel; draai node tools/voorwaarden-zoek.js');
  console.log('Zoekindex voorwaarden is actueel (' + rijen.length + ' regels).');
} else if (huidig === tekst) console.log('Ongewijzigd: data/voorwaarden-zoek.js (' + rijen.length + ' regels).');
else { fs.writeFileSync(UIT, tekst); console.log('Geschreven: data/voorwaarden-zoek.js (' + rijen.length + ' regels).'); }
