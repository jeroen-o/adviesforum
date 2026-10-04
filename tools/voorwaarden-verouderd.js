#!/usr/bin/env node
/*
 * Overzicht van gecontroleerde voorwaarden met een bron ouder dan 6 maanden (blok CONTROLE in data/voorwaarden-controle.js).
 *
 *   node tools/voorwaarden-verouderd.js            overzicht per geldverstrekker (nieuwste controle eerst nodig)
 *   node tools/voorwaarden-verouderd.js --json     zelfde overzicht als JSON (voor de maandelijkse controle)
 *
 * Dezelfde regel als op de pagina (bronVerouderd): het einde van de bronperiode ligt meer dan 6 maanden voor vandaag.
 * Gebruik dit als werklijst: zoek per geldverstrekker of er een nieuwere gids of pagina is en verwerk die via
 * docs/voorwaarden-onderzoek (uit-*.json, verwerk.js).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'data', 'voorwaarden-controle.js'), 'utf8');
const m = /const CONTROLE = (\{[\s\S]*?\});\s*const EIGEN_DOMEINEN/.exec(html);
if (!m) { console.error('voorwaarden-verouderd: CONTROLE niet gevonden'); process.exit(1); }
const CONTROLE = JSON.parse(m[1]);

const MAANDEN_NL = { jan: 1, feb: 2, mrt: 3, maa: 3, apr: 4, mei: 5, jun: 6, jul: 7, aug: 8, sep: 9, okt: 10, nov: 11, dec: 12 };
function bronEinde(d) {
  const t = String(d || '').toLowerCase();
  let r = /^(\d{4})[-_](\d{2})(?:-(\d{2}))?$/.exec(t.trim());
  if (r && +r[2] >= 1 && +r[2] <= 12) { const j = +r[1], mnd = +r[2]; return Date.UTC(j, mnd - 1, r[3] ? +r[3] : new Date(Date.UTC(j, mnd, 0)).getUTCDate()); }
  const jaren = (t.match(/\b(?:19|20)\d{2}\b/g) || []).map(Number);
  if (!jaren.length) return null;
  const j = Math.max(...jaren);
  r = new RegExp('\\b(jan|feb|mrt|maa|apr|mei|jun|jul|aug|sep|okt|nov|dec)[a-z]*\\.?\\s+' + j).exec(t);
  const mnd = r ? MAANDEN_NL[r[1]] : 12;
  return Date.UTC(j, mnd - 1, new Date(Date.UTC(j, mnd, 0)).getUTCDate());
}
const nu = new Date();
const grens = Date.UTC(nu.getFullYear(), nu.getMonth() - 6, nu.getDate());

const uit = [];
for (const naam of Object.keys(CONTROLE).sort((a, b) => a.localeCompare(b, 'nl'))) {
  const crit = CONTROLE[naam].criteria || {};
  const oud = Object.keys(crit).filter(id => { const e = bronEinde(crit[id].brondatum); return e !== null && e < grens; });
  if (!oud.length) continue;
  const bronnen = [...new Set(oud.flatMap(id => crit[id].bron || []))];
  uit.push({ naam, gecontroleerd: CONTROLE[naam].gecontroleerd, aantal: oud.length, criteria: oud.map(id => ({ id, brondatum: crit[id].brondatum })), bronnen });
}
uit.sort((a, b) => b.aantal - a.aantal || a.naam.localeCompare(b.naam, 'nl'));

if (process.argv.includes('--json')) { console.log(JSON.stringify({ peildatum: nu.toISOString().slice(0, 10), geldverstrekkers: uit }, null, 1)); process.exit(0); }
const totaal = uit.reduce((s, x) => s + x.aantal, 0);
console.log('Bronnen ouder dan 6 maanden: ' + totaal + ' voorwaarden bij ' + uit.length + ' geldverstrekkers (peildatum ' + nu.toISOString().slice(0, 10) + ').');
uit.forEach(x => {
  console.log('\n' + x.naam + ' (' + x.aantal + ', laatst gecontroleerd ' + x.gecontroleerd + ')');
  console.log('  criteria: ' + x.criteria.map(c => c.id + ' [' + c.brondatum + ']').join(', '));
  x.bronnen.slice(0, 6).forEach(u => console.log('  bron: ' + u));
});
