#!/usr/bin/env node
/*
 * Wijzigingslog van de gecontroleerde voorwaarden (blok CONTROLE in voorwaarden-vergelijker.html).
 *
 *   node tools/voorwaarden-wijzigingen.js          schrijft data/voorwaarden-wijzigingen.js
 *   node tools/voorwaarden-wijzigingen.js --check  faalt als het bestand niet actueel is
 *
 * Werkwijze: leest CONTROLE uit elke commit die voorwaarden-vergelijker.html wijzigde (oudste eerst) en uit de
 * werkmap. Nulmeting is de gepubliceerde stand na de volledige online controle (commit NULMETING); oudere versies
 * tellen niet mee. Per dag telt alleen de laatste versie; die wordt vergeleken met de stand van de dag ervoor
 * (of de nulmeting). Per geldverstrekker en criterium ontstaat een item:
 *   nieuw         criterium had nog geen gecontroleerde waarde
 *   gewijzigd     de waarde is inhoudelijk anders
 *   geverifieerd  zelfde waarde, nu met een bron op de eigen site van de geldverstrekker
 *   vervallen     criterium is uit de controle verdwenen
 * Een geldverstrekker die voor het eerst in CONTROLE staat, levert één item "eerste controle" op.
 * Datum = commitdatum in Nederlandse tijd; voor de werkmap de datum van vandaag.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BESTAND = 'voorwaarden-vergelijker.html';
const UIT = path.join(ROOT, 'data', 'voorwaarden-wijzigingen.js');
const CHECK = process.argv.includes('--check');
const NULMETING = '2e4d536'; /* 4 oktober 2026: voorwaarden online gecontroleerd en gepubliceerd */

function git(args) { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); }
function controleUit(html) {
  const m = /const CONTROLE = (\{[\s\S]*?\});\s*(?:const EIGEN_DOMEINEN|\/\* CONTROLE:eind)/.exec(html || '');
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch (e) { return null; }
}
const NL = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' });
const dag = iso => NL.format(new Date(iso));
const kaal = w => String(w || '').replace(/\s+/g, ' ').trim();

let commits = [];
try {
  commits = git(['log', '--reverse', '--format=%H %aI', '--', BESTAND]).trim().split('\n').filter(Boolean)
    .map(r => { const [h, d] = r.split(' '); return { h, d: dag(d) }; });
} catch (e) { console.error('voorwaarden-wijzigingen: git log mislukt: ' + e.message); process.exit(1); }

const versies = [];
let gezien = false;
for (const c of commits) {
  if (!gezien) { if (!c.h.startsWith(NULMETING)) continue; gezien = true; }
  let html = '';
  try { html = git(['show', c.h + ':' + BESTAND]); } catch (e) { continue; }
  const C = controleUit(html);
  if (C) versies.push({ d: c.d, C, nul: versies.length === 0 });
}
if (!versies.length) { console.error('voorwaarden-wijzigingen: nulmeting ' + NULMETING + ' niet gevonden in de geschiedenis'); process.exit(1); }
const werk = controleUit(fs.readFileSync(path.join(ROOT, BESTAND), 'utf8'));
if (werk && JSON.stringify(versies[versies.length - 1].C) !== JSON.stringify(werk)) versies.push({ d: dag(new Date().toISOString()), C: werk });

/* Nulmeting plus de laatste versie van elke dag. */
const standen = [versies[0]];
versies.slice(1).forEach(v => {
  const vorige = standen[standen.length - 1];
  if (!vorige.nul && vorige.d === v.d) standen[standen.length - 1] = v; else standen.push(v);
});

const items = [];
for (let i = 1; i < standen.length; i++) {
  const oud = standen[i - 1].C, nu = standen[i].C, d = standen[i].d;
  for (const naam of Object.keys(nu)) {
    const a = (oud[naam] || {}).criteria, b = nu[naam].criteria || {};
    if (!a) {
      items.push({ d, naam, soort: 'eerste', aantal: Object.keys(b).length, gev: Object.values(b).filter(x => x.geverifieerd).length });
      continue;
    }
    for (const id of Object.keys(b)) {
      const x = a[id], y = b[id];
      if (!x) { items.push({ d, naam, crit: id, soort: 'nieuw', nieuw: kaal(y.waarde), gev: !!y.geverifieerd }); continue; }
      if (kaal(x.waarde) !== kaal(y.waarde)) items.push({ d, naam, crit: id, soort: 'gewijzigd', oud: kaal(x.waarde), nieuw: kaal(y.waarde), gev: !!y.geverifieerd });
      else if (!x.geverifieerd && y.geverifieerd) items.push({ d, naam, crit: id, soort: 'geverifieerd', nieuw: kaal(y.waarde), gev: true });
    }
    for (const id of Object.keys(a)) if (!b[id]) items.push({ d, naam, crit: id, soort: 'vervallen', oud: kaal(a[id].waarde) });
  }
}
const samengevoegd = items.sort((p, q) => q.d.localeCompare(p.d) || p.naam.localeCompare(q.naam, 'nl') || String(p.crit || '').localeCompare(String(q.crit || '')));

const nulmeting = versies.length ? versies[0].d : '';
const tekst = '/* Gegenereerd door tools/voorwaarden-wijzigingen.js uit de geschiedenis van ' + BESTAND + '. Niet met de hand wijzigen. */\n' +
  'window.VOORWAARDEN_WIJZIGINGEN = ' + JSON.stringify({ nulmeting, items: samengevoegd }) + ';\n';

const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
const samenvatting = samengevoegd.length + ' wijzigingen sinds de nulmeting van ' + nulmeting + ' (' + (standen.length - 1) + ' dag(en) met wijzigingen)';
if (CHECK) {
  if (huidig !== tekst) { console.error('data/voorwaarden-wijzigingen.js is niet actueel; draai node tools/voorwaarden-wijzigingen.js'); process.exit(1); }
  console.log('Wijzigingslog is actueel: ' + samenvatting + '.');
} else if (huidig === tekst) {
  console.log('Ongewijzigd: data/voorwaarden-wijzigingen.js (' + samenvatting + ').');
} else {
  fs.writeFileSync(UIT, tekst);
  console.log('Geschreven: data/voorwaarden-wijzigingen.js (' + samenvatting + ').');
}
