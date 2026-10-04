/* Verwerkt onderzoeksresultaten (uit-*.json) in voorwaarden-vergelijker.html als const CONTROLE.
 * Gebruik: node docs/voorwaarden-onderzoek/verwerk.js <map-met-uit-bestanden>
 * Alleen zekerheid hoog/middel en status bevestigd/gewijzigd/nieuw; zekerheid laag en onbekend worden niet getoond
 * (wel geteld). Bij dubbelcheck (veld dubbel:'bevestigd') toont de pagina "2× gecontroleerd". */
const fs = require('fs'), path = require('path');
const map = process.argv[2] || path.join(__dirname);
const pagina = path.join(__dirname, '..', '..', 'voorwaarden-vergelijker.html');
const files = fs.readdirSync(map).filter(f => /^uit-.*\.json$/.test(f)).sort();
const C = {};
for (const f of files) {
  for (const L of JSON.parse(fs.readFileSync(path.join(map, f), 'utf8'))) {
    const crit = {}; let n = 0;
    for (const [id, x] of Object.entries(L.criteria || {})) {
      if (!x || !x.waarde || !['bevestigd', 'gewijzigd', 'nieuw'].includes(x.status) || !['hoog', 'middel'].includes(x.zekerheid)) continue;
      const bron = (x.bron || []).filter(u => /^https:\/\/[^\s"'<>]+$/.test(u)).slice(0, 5);
      if (!bron.length) continue;
      crit[id] = { waarde: String(x.waarde).slice(0, 160), bron, brondatum: x.brondatum || null, zekerheid: x.zekerheid, status: x.status, dubbel: x.dubbel || null };
      n++;
    }
    if (!n) continue;
    const oud = C[L.naam];
    C[L.naam] = { gecontroleerd: L.gecontroleerd || '2026-10-04', criteria: Object.assign(oud ? oud.criteria : {}, crit) };
  }
}
let s = fs.readFileSync(pagina, 'utf8');
const blok = '/* CONTROLE:start (gegenereerd door docs/voorwaarden-onderzoek/verwerk.js; niet met de hand wijzigen) */\nconst CONTROLE = ' + JSON.stringify(C) + ';\n/* CONTROLE:eind */';
if (/\/\* CONTROLE:start[\s\S]*?CONTROLE:eind \*\//.test(s)) s = s.replace(/\/\* CONTROLE:start[\s\S]*?CONTROLE:eind \*\//, blok);
else s = s.replace('const CRIT_NOTITIE = {', blok + '\nconst CRIT_NOTITIE = {');
fs.writeFileSync(pagina, s);
console.log('verwerkt:', Object.entries(C).map(([n, v]) => n + ' ' + Object.keys(v.criteria).length).join(', '));
