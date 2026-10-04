#!/usr/bin/env node
/*
 * Bouwt data/productvoorwaarden.js voor productvoorwaarden.html uit het onderzoek in docs/productvoorwaarden-onderzoek/
 * (<product>.json plus aanvullingen <product>-2.json, -3.json …; een ontbrekend product wordt overgeslagen).
 * Een aanvulling voegt aanbieders toe of overschrijft per aanbieder losse criteria (zelfde naam).
 *
 *   node tools/productvoorwaarden.js          schrijft data/productvoorwaarden.js
 *   node tools/productvoorwaarden.js --check  faalt als het bestand niet actueel is
 *
 * Regels (gelijk aan de hypotheekvoorwaarden):
 * - geverifieerd = minstens één bron op een eigen domein van de aanbieder én zekerheid hoog of middel;
 * - niet geverifieerd: bronnen van derden worden weggelaten, de waarde krijgt de markering "nog niet geverifieerd";
 * - waarden die een premie, rente, tarief of korting noemen worden geweigerd (AFM-regel van de site).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'docs', 'productvoorwaarden-onderzoek');
const UIT = path.join(ROOT, 'data', 'productvoorwaarden.js');
const VOLGORDE = ['orv', 'aov', 'uitvaart', 'lijfrente', 'krediet'];
const VERBODEN = /premie[^.;]{0,25}€|€[^.;]{0,20}premie|premie(?:s)?\s+(?:van|vanaf)\s+\d|\brente\s*(?:van|vanaf)?\s*\d|\bjkp\b|\d\s?%\s*(?:rente|korting|jkp)|\bkorting\b|\bactie\b|cashback/i;

function fout(m) { console.error('productvoorwaarden: ' + m); process.exit(1); }
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
const eigen = (doms, u) => { const h = host(u); return !!h && doms.some(d => h === d || h.endsWith('.' + d)); };
const veilig = u => typeof u === 'string' && /^https:\/\/[^\s"'<>]+$/i.test(u);

const producten = [];
const gemeld = [];
for (const id of VOLGORDE) {
  const f = path.join(DIR, id + '.json');
  if (!fs.existsSync(f)) continue;
  let d;
  try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { fout(id + '.json is geen geldige JSON: ' + e.message); }
  if (!Array.isArray(d.criteria) || !Array.isArray(d.aanbieders)) fout(id + '.json mist criteria of aanbieders');
  const extra = fs.readdirSync(DIR).filter(n => new RegExp('^' + id + '-\\d+\\.json$').test(n)).sort((a, b) => parseInt(a.split('-')[1], 10) - parseInt(b.split('-')[1], 10));
  for (const n of extra) {
    let x;
    try { x = JSON.parse(fs.readFileSync(path.join(DIR, n), 'utf8')); } catch (e) { fout(n + ' is geen geldige JSON: ' + e.message); }
    for (const a of x.aanbieders || []) {
      const bestaand = d.aanbieders.find(b => b.naam === a.naam);
      if (!bestaand) { d.aanbieders.push(a); continue; }
      bestaand.criteria = Object.assign({}, bestaand.criteria, a.criteria || {});
      bestaand.domeinen = [...new Set([...(bestaand.domeinen || []), ...(a.domeinen || [])])];
      bestaand.documenten = [...(bestaand.documenten || []), ...(a.documenten || [])];
      if (a.url && !bestaand.url) bestaand.url = a.url;
    }
  }
  const critIds = new Set(d.criteria.map(c => c.id));
  const aanbieders = d.aanbieders.map(a => {
    const doms = (a.domeinen || []).map(x => String(x).replace(/^www\./, '').toLowerCase());
    const crit = {};
    let gv = 0, nv = 0;
    for (const [cid, w] of Object.entries(a.criteria || {})) {
      if (!critIds.has(cid) || !w || !w.waarde) continue;
      const tekst = String(w.waarde).replace(/\s+/g, ' ').trim();
      if (VERBODEN.test(tekst)) { gemeld.push(id + ' / ' + a.naam + ' / ' + cid + ': waarde lijkt een prijs of korting te noemen en is weggelaten'); continue; }
      const bronnen = (w.bron || []).filter(veilig);
      const ok = bronnen.some(u => eigen(doms, u)) && ['hoog', 'middel'].includes(w.zekerheid);
      const cel = { w: tekst };
      if (w.brondatum) cel.bd = String(w.brondatum);
      if (ok) { cel.g = 1; cel.b = bronnen.filter(u => eigen(doms, u)).slice(0, 4); gv++; } else nv++;
      crit[cid] = cel;
    }
    const docs = (a.documenten || []).filter(x => x && veilig(x.url) && eigen(doms, x.url)).map(x => ({ t: String(x.titel || '').slice(0, 140), u: x.url, v: String(x.versie || '').slice(0, 60) }));
    return { naam: a.naam, url: veilig(a.url) && eigen(doms, a.url) ? a.url : '', crit, docs, gv, nv };
  }).filter(a => Object.keys(a.crit).length).sort((p, q) => p.naam.localeCompare(q.naam, 'nl'));
  producten.push({
    id, titel: d.titel || id, gecontroleerd: d.gecontroleerd || '',
    criteria: d.criteria.map(c => ({ id: c.id, naam: c.naam, kort: c.kort || '', waarom: c.waarom || '' })),
    aanbieders,
  });
}
if (!producten.length) fout('geen onderzoeksbestanden gevonden in docs/productvoorwaarden-onderzoek/');

const tekst = '/* Gegenereerd door tools/productvoorwaarden.js uit docs/productvoorwaarden-onderzoek/. Niet met de hand wijzigen. */\n' +
  'window.PRODUCTVOORWAARDEN = ' + JSON.stringify(producten) + ';\n';
const samenvatting = producten.map(p => p.id + ': ' + p.aanbieders.length + ' aanbieders, ' + p.aanbieders.reduce((s, a) => s + a.gv, 0) + ' geverifieerd, ' + p.aanbieders.reduce((s, a) => s + a.nv, 0) + ' niet geverifieerd').join('; ');
gemeld.forEach(m => console.warn('let op: ' + m));
const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
if (process.argv.includes('--check')) {
  if (huidig !== tekst) fout('data/productvoorwaarden.js is niet actueel; draai node tools/productvoorwaarden.js');
  console.log('Productvoorwaarden zijn actueel (' + samenvatting + ').');
} else if (huidig === tekst) console.log('Ongewijzigd: data/productvoorwaarden.js (' + samenvatting + ').');
else { fs.writeFileSync(UIT, tekst); console.log('Geschreven: data/productvoorwaarden.js (' + samenvatting + ').'); }
