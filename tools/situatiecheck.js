#!/usr/bin/env node
/*
 * Bouwt data/situatiecheck.js voor situatiecheck.html uit docs/situatiecheck/indeling.json en het blok CONTROLE in
 * voorwaarden-vergelijker.html (voor de status geverifieerd en de bron van het criterium waarop een oordeel rust).
 *
 *   node tools/situatiecheck.js          schrijft data/situatiecheck.js
 *   node tools/situatiecheck.js --check  faalt als het bestand niet actueel is
 *
 * De indeling is afgeleid uit de tekst van de gecontroleerde waarden (ja / voorwaarden / nee / onbekend).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const UIT = path.join(ROOT, 'data', 'situatiecheck.js');
function fout(m) { console.error('situatiecheck: ' + m); process.exit(1); }

let IND;
try { IND = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'situatiecheck', 'indeling.json'), 'utf8')); } catch (e) { fout('docs/situatiecheck/indeling.json ontbreekt of is ongeldig: ' + e.message); }
const html = fs.readFileSync(path.join(ROOT, 'voorwaarden-vergelijker.html'), 'utf8');
const m = /const CONTROLE = (\{[\s\S]*?\});\s*const EIGEN_DOMEINEN/.exec(html);
if (!m) fout('CONTROLE niet gevonden in voorwaarden-vergelijker.html');
const CONTROLE = JSON.parse(m[1]);
const g = /const GEEN_NIEUWE_KLANTEN = (\[[^\]]*\])/.exec(html);
const GEEN = g ? JSON.parse(g[1].replace(/'/g, '"')) : [];
const OORDELEN = ['ja', 'voorwaarden', 'nee', 'onbekend'];
const slug = n => String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'partij';

const situaties = (IND.situaties || []).map(s => ({ id: s.id, naam: s.naam, vraag: s.vraag || '', crit: s.crit || [] }));
if (!situaties.length) fout('geen situaties in de indeling');
const ids = new Set(situaties.map(s => s.id));
const lijst = [];
for (const naam of Object.keys(IND.indeling || {}).sort((a, b) => a.localeCompare(b, 'nl'))) {
  const c = CONTROLE[naam];
  if (!c) { console.warn('let op: ' + naam + ' staat niet (meer) in CONTROLE en is overgeslagen'); continue; }
  const o = {};
  for (const [sid, x] of Object.entries(IND.indeling[naam])) {
    if (!ids.has(sid) || !x || !OORDELEN.includes(x.o)) continue;
    const w = x.c && c.criteria[x.c];
    const r = { o: x.o, t: String(x.t || '').slice(0, 200) };
    if (x.tw) r.tw = 1; /* twijfelgeval: indeling niet eenduidig uit de tekst af te leiden */
    if (w && x.o !== 'onbekend') { r.c = x.c; r.g = w.geverifieerd ? 1 : 0; if (w.geverifieerd && Array.isArray(w.bron) && w.bron[0]) r.b = w.bron[0]; }
    o[sid] = r;
  }
  lijst.push({ naam, slug: slug(naam), geenNieuw: GEEN.includes(naam) ? 1 : 0, gecontroleerd: c.gecontroleerd, s: o });
}
/* ORV en AOV: indeling-<product>.json tegen data/productvoorwaarden.js (geverifieerd + bron per criterium). */
const vm = require('vm');
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'productvoorwaarden.js'), 'utf8'), sb);
const PV = sb.window.PRODUCTVOORWAARDEN || [];
const producten = {};
for (const pid of ['orv', 'aov']) {
  const f = path.join(ROOT, 'docs', 'situatiecheck', 'indeling-' + pid + '.json');
  const pr = PV.find(x => x.id === pid);
  if (!fs.existsSync(f) || !pr) continue;
  let I; try { I = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { fout(f + ' is ongeldig: ' + e.message); }
  const sits = (I.situaties || []).map(x => ({ id: x.id, naam: x.naam, vraag: x.vraag || '', crit: x.crit || [] }));
  const sids = new Set(sits.map(x => x.id));
  const aanb = [];
  for (const naam of Object.keys(I.indeling || {}).sort((a, b) => a.localeCompare(b, 'nl'))) {
    const a = pr.aanbieders.find(x => x.naam === naam);
    if (!a) { console.warn('let op: ' + pid + ' / ' + naam + ' staat niet in de productvoorwaarden en is overgeslagen'); continue; }
    const o = {};
    for (const [sid, x] of Object.entries(I.indeling[naam])) {
      if (!sids.has(sid) || !x || !OORDELEN.includes(x.o)) continue;
      const w = x.c && a.crit[x.c];
      const r = { o: x.o, t: String(x.t || '').slice(0, 200) };
      if (x.tw) r.tw = 1;
      if (w && x.o !== 'onbekend') { r.c = x.c; r.g = w.g ? 1 : 0; if (w.g && w.b && w.b[0]) r.b = w.b[0]; }
      o[sid] = r;
    }
    aanb.push({ naam, slug: slug(naam), s: o });
  }
  producten[pid] = { titel: pr.titel, gegenereerd: I.gegenereerd || '', situaties: sits, aanbieders: aanb };
}
const tekst = '/* Gegenereerd door tools/situatiecheck.js uit docs/situatiecheck/indeling*.json, CONTROLE en data/productvoorwaarden.js. Niet met de hand wijzigen. */\n' +
  'window.SITUATIECHECK = ' + JSON.stringify({ gegenereerd: IND.gegenereerd || '', situaties, geldverstrekkers: lijst, producten }) + ';\n';
const tel = {}; lijst.forEach(l => Object.values(l.s).forEach(x => { tel[x.o] = (tel[x.o] || 0) + 1; }));
const samenvatting = lijst.length + ' geldverstrekkers, ' + situaties.length + ' situaties (' + OORDELEN.map(k => k + ' ' + (tel[k] || 0)).join(', ') + ')' + Object.keys(producten).map(k => '; ' + k + ': ' + producten[k].aanbieders.length + ' aanbieders, ' + producten[k].situaties.length + ' situaties').join('');
const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
if (process.argv.includes('--check')) {
  if (huidig !== tekst) fout('data/situatiecheck.js is niet actueel; draai node tools/situatiecheck.js');
  console.log('Situatiecheck is actueel: ' + samenvatting + '.');
} else if (huidig === tekst) console.log('Ongewijzigd: data/situatiecheck.js (' + samenvatting + ').');
else { fs.writeFileSync(UIT, tekst); console.log('Geschreven: data/situatiecheck.js (' + samenvatting + ').'); }
