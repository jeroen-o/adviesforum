#!/usr/bin/env node
/* Ontwikkeltool (geen build-stap voor de site): genereert data/rekentools-index.js,
 * de zoekcatalogus van alle rekenhulpen voor index.html.
 *
 *   node tools/build-rekentools-index.js           schrijft data/rekentools-index.js
 *   node tools/build-rekentools-index.js --check   controleert alleen of het bestand actueel is (exit 1 als niet)
 *
 * Werkwijze: leest de <script src="js/rekentools/..."> tags uit rekentools.html in de volgorde van de pagina,
 * voert die bestanden uit in een Node-sandbox (zonder DOM) en schrijft van elke RT.add-registratie
 * { id, groep, naam, tekst, kw, url } weg. groep is de leesbare groepsnaam.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'rekentools.html'), 'utf8');
const bestanden = [...html.matchAll(/<script\s+src="(js\/rekentools\/[^"]+\.js)"/g)].map(m => m[1]);
if (!bestanden.length) { console.error('Geen js/rekentools/*.js scripts gevonden in rekentools.html'); process.exit(1); }

const sandbox = { console, Intl, Math, Date, Number, String, Object, Array, Set, Map, JSON, RegExp, Error };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const b of bestanden) {
  const code = fs.readFileSync(path.join(ROOT, b), 'utf8');
  try { vm.runInContext(code, sandbox, { filename: b }); } catch (e) { console.error('Fout in ' + b + ': ' + e.message); process.exit(1); }
}
const RT = sandbox.RT;
const groepNaam = id => (RT.GROEPEN.find(g => g.id === id) || {}).naam || id;
const schoon = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const volgorde = id => RT.GROEPEN.findIndex(g => g.id === id);
const lijst = RT.tools.slice().sort((a, b) => volgorde(a.groep) - volgorde(b.groep)).map(t => ({
  id: t.id,
  groep: groepNaam(t.groep),
  naam: t.naam,
  tekst: schoon(t.intro),
  kw: schoon([t.kw || '', t.fiscaal ? 'fiscaal belasting' : ''].join(' ')),
  url: 'rekentools.html#' + t.id
}));

const inhoud = '/* GEGENEREERD door tools/build-rekentools-index.js – niet met de hand bewerken.\n' +
  ' * Zoekcatalogus van alle rekenhulpen op rekentools.html (' + lijst.length + ' stuks).\n' +
  ' * Opnieuw genereren: node tools/build-rekentools-index.js */\n' +
  'window.REKENTOOLS = [\n' + lijst.map(x => '  ' + JSON.stringify(x)).join(',\n') + '\n];\n';

const doel = path.join(ROOT, 'data', 'rekentools-index.js');
if (process.argv.includes('--check')) {
  const huidig = fs.existsSync(doel) ? fs.readFileSync(doel, 'utf8') : '';
  if (huidig !== inhoud) { console.error('data/rekentools-index.js is niet actueel. Draai: node tools/build-rekentools-index.js'); process.exit(1); }
  console.log('data/rekentools-index.js is actueel (' + lijst.length + ' rekenhulpen).');
} else {
  fs.writeFileSync(doel, inhoud);
  console.log('data/rekentools-index.js geschreven: ' + lijst.length + ' rekenhulpen uit ' + bestanden.length + ' bestanden.');
}
