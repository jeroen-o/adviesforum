#!/usr/bin/env node
/*
 * Wijzigingslog van de productvoorwaarden (ORV, AOV, uitvaart, lijfrente, krediet) uit de geschiedenis van
 * data/productvoorwaarden.js. Zelfde werkwijze als tools/voorwaarden-wijzigingen.js:
 * nulmeting = de gepubliceerde stand (commit NULMETING), per dag de laatste versie, vergeleken met de dag ervoor.
 *
 *   node tools/productvoorwaarden-wijzigingen.js          schrijft data/productvoorwaarden-wijzigingen.js
 *   node tools/productvoorwaarden-wijzigingen.js --check  faalt als het bestand niet actueel is
 *
 * Soorten: eerste (aanbieder voor het eerst opgenomen), nieuw, gewijzigd, geverifieerd, vervallen.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BESTAND = 'data/productvoorwaarden.js';
const UIT = path.join(ROOT, 'data', 'productvoorwaarden-wijzigingen.js');
const NULMETING = '11edf5f'; /* 4 oktober 2026: eerste publicatie ORV, AOV en krediet */
const CHECK = process.argv.includes('--check');

function git(args) { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); }
function lees(js) {
  try { const sb = { window: {} }; vm.createContext(sb); vm.runInContext(js, sb, { timeout: 5000 }); return sb.window.PRODUCTVOORWAARDEN || null; } catch (e) { return null; }
}
const NL = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' });
const dag = iso => NL.format(new Date(iso));
const kaal = w => String(w || '').replace(/\s+/g, ' ').trim();
/* {product: {aanbieder: {crit: {w, g}}}} */
function vlak(P) {
  const o = {};
  (P || []).forEach(p => { o[p.id] = {}; p.aanbieders.forEach(a => { o[p.id][a.naam] = a.crit; }); });
  return o;
}

const commits = git(['log', '--reverse', '--format=%H %aI', '--', BESTAND]).trim().split('\n').filter(Boolean).map(r => { const [h, d] = r.split(' '); return { h, d: dag(d) }; });
const versies = [];
let gezien = false;
for (const c of commits) {
  if (!gezien) { if (!c.h.startsWith(NULMETING)) continue; gezien = true; }
  const P = lees(git(['show', c.h + ':' + BESTAND]));
  if (P) versies.push({ d: c.d, P: vlak(P), nul: versies.length === 0 });
}
if (!versies.length) {
  /* Ondiepe checkout (bijv. CI zonder fetch-depth: 0): geschiedenis ontbreekt, dus niets te controleren of te schrijven. */
  let ondiep = false;
  try { ondiep = git(['rev-parse', '--is-shallow-repository']).trim() === 'true'; } catch (e) { ondiep = false; }
  if (ondiep) { console.log('Overgeslagen: ondiepe git-checkout zonder de nulmeting ' + NULMETING + '; het wijzigingslog blijft ongewijzigd (actueel niet te controleren).'); process.exit(0); }
  console.error('productvoorwaarden-wijzigingen: nulmeting ' + NULMETING + ' niet gevonden in de geschiedenis'); process.exit(1);
}
const werk = lees(fs.readFileSync(path.join(ROOT, BESTAND), 'utf8'));
if (werk && JSON.stringify(versies[versies.length - 1].P) !== JSON.stringify(vlak(werk))) versies.push({ d: dag(new Date().toISOString()), P: vlak(werk) });

const standen = [versies[0]];
versies.slice(1).forEach(v => { const vorige = standen[standen.length - 1]; if (!vorige.nul && vorige.d === v.d) standen[standen.length - 1] = v; else standen.push(v); });

const items = [];
for (let i = 1; i < standen.length; i++) {
  const oud = standen[i - 1].P, nu = standen[i].P, d = standen[i].d;
  for (const p of Object.keys(nu)) {
    for (const naam of Object.keys(nu[p])) {
      const a = (oud[p] || {})[naam], b = nu[p][naam];
      if (!a) { items.push({ d, p, naam, soort: 'eerste', aantal: Object.keys(b).length, gev: Object.values(b).filter(x => x.g).length }); continue; }
      for (const id of Object.keys(b)) {
        const x = a[id], y = b[id];
        if (!x) items.push({ d, p, naam, crit: id, soort: 'nieuw', nieuw: kaal(y.w), gev: !!y.g });
        else if (kaal(x.w) !== kaal(y.w)) items.push({ d, p, naam, crit: id, soort: 'gewijzigd', oud: kaal(x.w), nieuw: kaal(y.w), gev: !!y.g });
        else if (!x.g && y.g) items.push({ d, p, naam, crit: id, soort: 'geverifieerd', nieuw: kaal(y.w), gev: true });
      }
      for (const id of Object.keys(a)) if (!b[id]) items.push({ d, p, naam, crit: id, soort: 'vervallen', oud: kaal(a[id].w) });
    }
  }
}
items.sort((x, y) => y.d.localeCompare(x.d) || x.p.localeCompare(y.p) || x.naam.localeCompare(y.naam, 'nl') || String(x.crit || '').localeCompare(String(y.crit || '')));

const tekst = '/* Gegenereerd door tools/productvoorwaarden-wijzigingen.js uit de geschiedenis van ' + BESTAND + '. Niet met de hand wijzigen. */\n' +
  'window.PRODUCTVOORWAARDEN_WIJZIGINGEN = ' + JSON.stringify({ nulmeting: versies[0].d, items }) + ';\n';
const samenvatting = items.length + ' wijzigingen sinds de nulmeting van ' + versies[0].d;
const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
if (CHECK) {
  if (huidig !== tekst) { console.error('data/productvoorwaarden-wijzigingen.js is niet actueel; draai node tools/productvoorwaarden-wijzigingen.js'); process.exit(1); }
  console.log('Wijzigingslog productvoorwaarden is actueel: ' + samenvatting + '.');
} else if (huidig === tekst) console.log('Ongewijzigd: data/productvoorwaarden-wijzigingen.js (' + samenvatting + ').');
else { fs.writeFileSync(UIT, tekst); console.log('Geschreven: data/productvoorwaarden-wijzigingen.js (' + samenvatting + ').'); }
