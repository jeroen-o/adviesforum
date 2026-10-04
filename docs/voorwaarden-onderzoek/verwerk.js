/* Verwerkt onderzoeksresultaten (uit-*.json) in voorwaarden-vergelijker.html als const CONTROLE.
 * Gebruik: node docs/voorwaarden-onderzoek/verwerk.js <map-met-uit-bestanden>
 * Status bevestigd/gewijzigd/nieuw wordt getoond. Alleen bronnen op de eigen site van de geldverstrekker (domeinen.json)
 * met zekerheid hoog/middel tellen als geverifieerd; overige informatie komt erin als 'nog niet geverifieerd', zonder bronvermelding. Bij dubbelcheck (veld dubbel:'bevestigd') toont de pagina "2× gecontroleerd". */
const fs = require('fs'), path = require('path');
const map = process.argv[2] || path.join(__dirname);
const pagina = path.join(__dirname, '..', '..', 'voorwaarden-vergelijker.html');
const files = fs.readdirSync(map).filter(f => /^uit-.*\.json$/.test(f)).sort();
const DOM = JSON.parse(fs.readFileSync(path.join(__dirname, 'domeinen.json'), 'utf8'));
const eigen = (naam, u) => { try { const h = new URL(u).hostname.replace(/^www\./, ''); return (DOM[naam] || []).some(d => h === d || h.endsWith('.' + d)); } catch (e) { return false; } };
const C = {};
// Latere bestanden gaan voor, behalve dat een geverifieerde waarde niet wordt overschreven door een niet-geverifieerde.
const samen = (a, b) => { const r = Object.assign({}, a); for (const [k, v] of Object.entries(b)) { if (!(r[k] && r[k].geverifieerd && !v.geverifieerd)) r[k] = v; } return r; };
for (const f of files) {
  for (const L of JSON.parse(fs.readFileSync(path.join(map, f), 'utf8'))) {
    const crit = {}; let n = 0;
    for (const [id, x] of Object.entries(L.criteria || {})) {
      if (!x || !x.waarde || !['bevestigd', 'gewijzigd', 'nieuw'].includes(x.status)) continue;
      const alle = (x.bron || []).filter(u => /^https:\/\/[^\s"'<>]+$/.test(u));
      const own = alle.filter(u => eigen(L.naam, u)).slice(0, 5);
      // Geverifieerd = bron op de site van de geldverstrekker zelf en zekerheid hoog/middel; anders 'nog niet geverifieerd' zonder bronvermelding.
      const gev = own.length > 0 && ['hoog', 'middel'].includes(x.zekerheid);
      crit[id] = { waarde: String(x.waarde).slice(0, 160), bron: gev ? own : [], brondatum: x.brondatum || null, zekerheid: x.zekerheid, status: x.status, dubbel: x.dubbel || null, geverifieerd: gev };
      n++;
    }
    if (!n) continue;
    const oud = C[L.naam];
    C[L.naam] = { gecontroleerd: L.gecontroleerd || '2026-10-04', criteria: samen(oud ? oud.criteria : {}, crit) };
  }
}
let s = fs.readFileSync(pagina, 'utf8');
const blok = '/* CONTROLE:start (gegenereerd door docs/voorwaarden-onderzoek/verwerk.js; niet met de hand wijzigen) */\nconst CONTROLE = ' + JSON.stringify(C) + ';\nconst EIGEN_DOMEINEN = ' + JSON.stringify(DOM) + ';\n/* CONTROLE:eind */';
if (/\/\* CONTROLE:start[\s\S]*?CONTROLE:eind \*\//.test(s)) s = s.replace(/\/\* CONTROLE:start[\s\S]*?CONTROLE:eind \*\//, blok);
else s = s.replace('const CRIT_NOTITIE = {', blok + '\nconst CRIT_NOTITIE = {');
fs.writeFileSync(pagina, s);
console.log('verwerkt:', Object.entries(C).map(([n, v]) => n + ' ' + Object.keys(v.criteria).length).join(', '));
