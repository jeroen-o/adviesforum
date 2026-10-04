#!/usr/bin/env node
/* Ontwikkeltool: zet de online gecontroleerde voorwaarden uit de voorwaardenvergelijker in de Aanbiederwegwijzer.
 *
 *   node tools/wegwijzer-voorwaarden.js           schrijft het blok window.PARTIJ_VOORWAARDEN in data/partijen.js
 *   node tools/wegwijzer-voorwaarden.js --check   controleert alleen of dat blok actueel is (exit 1 als niet)
 *
 * Bron: const CONTROLE (tussen CONTROLE:start en CONTROLE:eind), CRITS, EXTRA_CRITS, SRC en NIEUW in
 * voorwaarden-vergelijker.html. Dat bestand wordt alleen gelezen.
 * Per geldverstrekker komen alleen geverifieerde waarden mee (geverifieerd:true, bron op de eigen site),
 * maximaal MAX criteria in de vaste volgorde VOLGORDE. De naam wordt tolerant gekoppeld aan window.PARTIJEN;
 * wat niet te koppelen is, meldt de tool (geen fout). Het blok staat tussen VOORWAARDEN:start en VOORWAARDEN:eind.
 * De uitvoer hangt alleen af van de data (niet van de datum van vandaag), zodat --check stabiel is. Geen dependencies.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PAGINA = path.join(ROOT, 'voorwaarden-vergelijker.html');
const DATA = path.join(ROOT, 'data', 'partijen.js');
const VOLGORDE = ['boete', 'verh', 'avrij', 'rmid', 'ovbr', 'persp', 'zzp', 'dag', 'geld', 'bdduur', 'oha'];
const MAX = 8;
const MAX_TEKST = 110;
const BLOK_RE = /\/\* VOORWAARDEN:start[\s\S]*?VOORWAARDEN:eind \*\//;

function fout(msg) { console.error(msg); process.exit(1); }

/* ---------- Bronnen lezen ---------- */
const html = fs.readFileSync(PAGINA, 'utf8');
function uitPagina(naam, re) {
  const m = html.match(re);
  if (!m) fout('Kon ' + naam + ' niet vinden in voorwaarden-vergelijker.html');
  return vm.runInNewContext('(' + m[1] + ')');
}
const CONTROLE = uitPagina('CONTROLE', /\/\* CONTROLE:start[^\n]*\*\/\s*const CONTROLE = ([\s\S]*?);\s*(?:const EIGEN_DOMEINEN = [\s\S]*?;\s*)?\/\* CONTROLE:eind \*\//);
const CRITS = uitPagina('CRITS', /const CRITS = (\[[\s\S]*?\n\]);/);
const EXTRA_CRITS = uitPagina('EXTRA_CRITS', /const EXTRA_CRITS = (\[[\s\S]*?\n\]);/);
const SRC = uitPagina('SRC', /const SRC = (\[[\s\S]*?\n\]);/);
const NIEUW = uitPagina('NIEUW', /const NIEUW = (\[[\s\S]*?\n\]);/);
const CRIT_NAAM = {};
for (const c of [...CRITS, ...EXTRA_CRITS]) CRIT_NAAM[c.id] = c.naam;
const LENDER_NAMEN = [...SRC, ...NIEUW].map(r => r[0]);

const dataTekst = fs.readFileSync(DATA, 'utf8');
const ctx = { window: {} };
vm.runInNewContext(dataTekst.replace(BLOK_RE, ''), ctx);
const PARTIJEN = ctx.window.PARTIJEN || [];
if (!PARTIJEN.length) fout('window.PARTIJEN in data/partijen.js is leeg.');

/* ---------- Namen koppelen ---------- */
/* Zelfde slug als de deeplink van de vergelijker (#vergelijk=<slug>). */
function slug(naam) {
  return String(naam || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'partij';
}
/* Zelfde sleutel en zoekvolgorde als naamSleutel/zoekLender in de vergelijker. */
function naamSleutel(n) {
  return String(n || '').toLowerCase().replace(/\(nu [^)]*\)/g, '').replace(/\b(hypotheken|hypotheek|bank|n\.?v\.?)\b/g, '')
    .replace(/[^a-z0-9]+/g, '');
}
const haakje = n => { const m = /\(([^)]+)\)/.exec(n); return m ? m[1] : null; };
const zonderHaakjes = n => naamSleutel(String(n || '').replace(/\([^)]*\)/g, ''));
function zoekIn(namen, naam, ruim) {
  const k = naamSleutel(naam);
  if (!k) return null;
  const stappen = [
    n => naamSleutel(n) === k,
    n => haakje(n) && naamSleutel(haakje(n)) === k,
    n => haakje(naam) && naamSleutel(haakje(naam)) === naamSleutel(n),
  ];
  // Wegwijzer: ook 'Centraal Beheer' = 'Centraal Beheer (Achmea)', 'ASN Bank' = 'ASN Bank (de Volksbank)'.
  if (ruim) stappen.splice(1, 0, n => zonderHaakjes(n) === zonderHaakjes(naam));
  for (const s of stappen) {
    const hits = namen.filter(s);
    if (hits.length === 1) return hits[0];
    if (hits.length > 1) return null; // dubbelzinnig: liever niet koppelen
  }
  return null;
}

/* ---------- Tekst ---------- */
function kort(s) {
  s = String(s || '').replace(/^[+~!\-]\s*/, '').replace(/\s+/g, ' ').trim();
  if (s.length <= MAX_TEKST) return s;
  let t = s.slice(0, MAX_TEKST - 1);
  const sp = t.lastIndexOf(' ');
  if (sp > MAX_TEKST * 0.6) t = t.slice(0, sp);
  return t.replace(/[\s,;:.(–-]+$/, '') + '…';
}
const httpsUrl = u => typeof u === 'string' && /^https:\/\/[^\s"'<>]+$/i.test(u);

/* ---------- Blok opbouwen ---------- */
const partijNamen = PARTIJEN.map(p => p.naam);
const uit = {};
const nietGekoppeld = [];
const zonderItems = [];
for (const naam of Object.keys(CONTROLE)) {
  const x = CONTROLE[naam];
  const doel = zoekIn(partijNamen, naam, true);
  if (!doel) { nietGekoppeld.push(naam); continue; }
  const items = [];
  for (const cid of VOLGORDE) {
    if (items.length >= MAX) break;
    const w = x.criteria && x.criteria[cid];
    if (!w || w.geverifieerd !== true || !CRIT_NAAM[cid]) continue;
    const bron = (w.bron || []).find(httpsUrl);
    const tekst = kort(w.waarde);
    if (!bron || !tekst) continue;
    const item = { crit: CRIT_NAAM[cid], tekst, bron };
    if (w.dubbel === 'bevestigd') item.dubbel = true;
    items.push(item);
  }
  if (!items.length) { zonderItems.push(naam); continue; }
  if (uit[doel]) fout('Twee geldverstrekkers in CONTROLE koppelen aan dezelfde partij: ' + doel);
  const lender = zoekIn(LENDER_NAMEN, naam, false);
  const r = { gecontroleerd: x.gecontroleerd };
  if (lender) r.vergelijk = slug(lender);
  r.items = items;
  uit[doel] = r;
}

const sleutels = Object.keys(uit).sort((a, b) => a.localeCompare(b, 'nl'));
const blok = '/* VOORWAARDEN:start (gegenereerd door tools/wegwijzer-voorwaarden.js uit CONTROLE in voorwaarden-vergelijker.html; niet met de hand wijzigen) */\n' +
  'window.PARTIJ_VOORWAARDEN={\n' +
  sleutels.map(k => ' ' + JSON.stringify(k) + ':' + JSON.stringify(uit[k])).join(',\n') +
  '\n};\n/* VOORWAARDEN:eind */';

let nieuw;
if (BLOK_RE.test(dataTekst)) nieuw = dataTekst.replace(BLOK_RE, () => blok);
else nieuw = dataTekst.replace(/\s*$/, '\n') + blok + '\n';

const samenvatting = sleutels.length + ' partijen met gecontroleerde voorwaarden' +
  (nietGekoppeld.length ? '; niet te koppelen aan data/partijen.js: ' + nietGekoppeld.join(', ') : '') +
  (zonderItems.length ? '; zonder geverifieerde items: ' + zonderItems.join(', ') : '');

if (process.argv.includes('--check')) {
  if (nieuw !== dataTekst) fout('data/partijen.js: blok VOORWAARDEN is niet actueel. Draai node tools/wegwijzer-voorwaarden.js');
  console.log('Blok VOORWAARDEN in data/partijen.js is actueel (' + samenvatting + ').');
} else {
  if (nieuw !== dataTekst) fs.writeFileSync(DATA, nieuw);
  console.log((nieuw !== dataTekst ? 'Geschreven' : 'Ongewijzigd') + ': data/partijen.js (' + samenvatting + ').');
}
