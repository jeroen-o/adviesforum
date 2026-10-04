#!/usr/bin/env node
/*
 * Kwaliteitscijfers van alle gecontroleerde voorwaarden, voor voorwaarden.html (ingang) en beheer-voorwaarden.html.
 * Per aanbieder en product: aantal waarden, geverifieerd, niet geverifieerd, twijfelgevallen in de situatiecheck en
 * het aantal bronnen per eindmaand ("2026-02": 4). De pagina rekent zelf uit wat ouder is dan 6 maanden, zodat dit
 * bestand niet elke dag verandert.
 *
 *   node tools/voorwaarden-kwaliteit.js          schrijft data/voorwaarden-kwaliteit.js
 *   node tools/voorwaarden-kwaliteit.js --check  faalt als het bestand niet actueel is
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const UIT = path.join(ROOT, 'data', 'voorwaarden-kwaliteit.js');
function fout(m) { console.error('voorwaarden-kwaliteit: ' + m); process.exit(1); }
function laad(b) { const sb = { window: {} }; vm.createContext(sb); vm.runInContext(fs.readFileSync(path.join(ROOT, b), 'utf8'), sb, { timeout: 5000 }); return sb.window; }

const MAANDEN_NL = { jan: 1, feb: 2, mrt: 3, maa: 3, apr: 4, mei: 5, jun: 6, jul: 7, aug: 8, sep: 9, okt: 10, nov: 11, dec: 12 };
/* Eindmaand van een brondatum ("2026", "2026-02", "jan 2026", "2025-2026") als "JJJJ-MM", of '' als onbekend. */
function eindMaand(d) {
  const t = String(d || '').toLowerCase();
  let r = /^(\d{4})[-_](\d{2})/.exec(t.trim());
  if (r && +r[2] >= 1 && +r[2] <= 12) return r[1] + '-' + r[2];
  const jaren = (t.match(/\b(?:19|20)\d{2}\b/g) || []).map(Number);
  if (!jaren.length) return '';
  const j = Math.max(...jaren);
  r = new RegExp('\\b(jan|feb|mrt|maa|apr|mei|jun|jul|aug|sep|okt|nov|dec)[a-z]*\\.?\\s+' + j).exec(t);
  return j + '-' + String(r ? MAANDEN_NL[r[1]] : 12).padStart(2, '0');
}
const slug = n => String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'partij';
const tel = (obj, k) => { if (k) obj[k] = (obj[k] || 0) + 1; };

const m = /const CONTROLE = (\{[\s\S]*?\});\s*const EIGEN_DOMEINEN/.exec(fs.readFileSync(path.join(ROOT, 'data', 'voorwaarden-controle.js'), 'utf8'));
if (!m) fout('CONTROLE niet gevonden in data/voorwaarden-controle.js');
const CONTROLE = JSON.parse(m[1]);
const PV = laad('data/productvoorwaarden.js').PRODUCTVOORWAARDEN || [];
const SC = laad('data/situatiecheck.js').SITUATIECHECK || { geldverstrekkers: [], producten: {} };
const twijfel = (lijst, naam) => { const x = (lijst || []).find(a => a.naam === naam); return x ? Object.values(x.s).filter(r => r.tw).length : 0; };

const producten = [];
/* Hypotheek */
const hyp = { id: 'hyp', titel: 'Hypotheek', pagina: 'voorwaarden-vergelijker.html', aanbieders: [] };
for (const naam of Object.keys(CONTROLE).sort((a, b) => a.localeCompare(b, 'nl'))) {
  const crit = Object.values(CONTROLE[naam].criteria || {});
  const b = {}; crit.filter(w => w.geverifieerd).forEach(w => tel(b, eindMaand(w.brondatum)));
  hyp.aanbieders.push({ naam, slug: slug(naam), n: crit.length, g: crit.filter(w => w.geverifieerd).length, tw: twijfel(SC.geldverstrekkers, naam), b, gc: CONTROLE[naam].gecontroleerd || '' });
}
producten.push(hyp);
/* Productvoorwaarden */
for (const p of PV) {
  const r = { id: p.id, titel: p.titel, pagina: 'productvoorwaarden.html#p=' + p.id, nk: p.criteria.length, aanbieders: [] };
  for (const a of p.aanbieders) {
    const crit = Object.values(a.crit);
    const b = {}; crit.filter(w => w.g).forEach(w => tel(b, eindMaand(w.bd)));
    r.aanbieders.push({ naam: a.naam, slug: slug(a.naam), n: crit.length, g: crit.filter(w => w.g).length, tw: twijfel(((SC.producten || {})[p.id] || {}).aanbieders, a.naam), b, gc: p.gecontroleerd || '' });
  }
  producten.push(r);
}
hyp.nk = (() => { const ids = new Set(); Object.values(CONTROLE).forEach(x => Object.keys(x.criteria || {}).forEach(k => ids.add(k))); return ids.size; })();

const tekst = '/* Gegenereerd door tools/voorwaarden-kwaliteit.js. Niet met de hand wijzigen. */\nwindow.VOORWAARDEN_KWALITEIT = ' + JSON.stringify({ producten }) + ';\n';
const som = producten.map(p => p.id + ' ' + p.aanbieders.length).join(', ');
const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
if (process.argv.includes('--check')) {
  if (huidig !== tekst) fout('data/voorwaarden-kwaliteit.js is niet actueel; draai node tools/voorwaarden-kwaliteit.js');
  console.log('Kwaliteitscijfers zijn actueel (' + som + ').');
} else if (huidig === tekst) console.log('Ongewijzigd: data/voorwaarden-kwaliteit.js (' + som + ').');
else { fs.writeFileSync(UIT, tekst); console.log('Geschreven: data/voorwaarden-kwaliteit.js (' + som + ').'); }
