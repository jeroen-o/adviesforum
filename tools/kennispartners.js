#!/usr/bin/env node
/*
 * Maakt de vaste Kennispartner-badges in badges/ op basis van data/kennispartners.js:
 *   badges/kennispartner-<id>.svg         vierkant (240x240), voor de eigen website
 *   badges/kennispartner-<id>-banner.svg  banner (360x96), voor footer of e-mailhandtekening
 *   badges/kennispartner-voorbeeld.svg    voorbeeld voor kennispartner.html
 * Controleert ook dat elke kennispartner geldige velden en bestaande artikelen heeft.
 *
 *   node tools/kennispartners.js          schrijft de badges
 *   node tools/kennispartners.js --check  faalt als een badge ontbreekt, verouderd is of de data niet klopt
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const B = require('../js/kennispartner-badge.js');

const ROOT = path.join(__dirname, '..');
const MAP = path.join(ROOT, 'badges');
const ctx = { window: {} };
vm.createContext(ctx);
const lees = f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
lees('data/kennispartners.js');
const KP = ctx.window.KENNISPARTNERS || [];
/* Artikel-id's uit alle kennisbankbestanden die index.html laadt */
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const f of [...index.matchAll(/'(data\/kennisbank[^']*\.js)'/g)].map(m => m[1])) lees(f);
const ARTIKELEN = new Set((ctx.window.KENNISBANK || []).map(a => a.id));

const fouten = [];
const ids = new Set();
for (const p of KP) {
  if (!/^kp-[a-z0-9-]+$/.test(p.id || '')) fouten.push(`ongeldig id: ${p.id}`);
  if (ids.has(p.id)) fouten.push(`dubbel id: ${p.id}`);
  ids.add(p.id);
  if (!p.naam || !p.kantoor) fouten.push(`${p.id}: naam en kantoor zijn verplicht`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.sinds || '')) fouten.push(`${p.id}: sinds moet JJJJ-MM-DD zijn`);
  for (const u of [p.website, p.linkedin].filter(Boolean)) if (!/^https:\/\/[^\s"<>]+$/.test(u)) fouten.push(`${p.id}: link moet met https:// beginnen: ${u}`);
  if (!(p.artikelen || []).length && !(p.onderwerpen || []).length) fouten.push(`${p.id}: geen artikelen of onderwerpen`);
  for (const a of p.artikelen || []) if (!ARTIKELEN.has(a)) fouten.push(`${p.id}: artikel ${a} bestaat niet`);
}

const gewenst = { 'kennispartner-voorbeeld.svg': B.svg({ naam: 'Uw naam', kantoor: 'Uw kantoor' }, 'vierkant') + '\n' };
for (const p of KP) {
  gewenst[`kennispartner-${p.id}.svg`] = B.svg(p, 'vierkant') + '\n';
  gewenst[`kennispartner-${p.id}-banner.svg`] = B.svg(p, 'banner') + '\n';
}
const check = process.argv.includes('--check');
const oud = [];
if (!fs.existsSync(MAP)) fs.mkdirSync(MAP);
for (const [f, inhoud] of Object.entries(gewenst)) {
  const p = path.join(MAP, f);
  const nu = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  if (nu === inhoud) continue;
  if (check) oud.push(f); else fs.writeFileSync(p, inhoud);
}
for (const f of fs.readdirSync(MAP).filter(f => /^kennispartner-.*\.svg$/.test(f) && !gewenst[f])) {
  if (check) oud.push(f + ' (overbodig)'); else fs.unlinkSync(path.join(MAP, f));
}
if (fouten.length) { console.error('kennispartners: ' + fouten.join('; ')); process.exit(1); }
if (check && oud.length) { console.error('kennispartners: badges niet actueel: ' + oud.join(', ') + '; draai node tools/kennispartners.js'); process.exit(1); }
console.log(`${check ? 'Badges zijn actueel' : 'Badges geschreven'} (${KP.length} kennispartner(s)).`);
