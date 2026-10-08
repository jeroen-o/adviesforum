#!/usr/bin/env node
/*
 * De site is vindbaar in zoekmachines. Dit script verwijdert de oude googlebot/bingbot-noindex-tags
 * uit de pagina's in de hoofdmap en controleert dat ze niet terugkomen.
 * Bewust blijven staan: <meta name="robots" content="noindex"> op losse pagina's (fictieve voorbeeldvragen,
 * beheerpagina's, 404, de indicatieve voorwaardenvergelijker). build-static.js laat die uit de sitemap.
 *
 *   node tools/zoekmachines.js          verwijdert de tags uit alle pagina's in de hoofdmap
 *   node tools/zoekmachines.js --check  faalt als een pagina de tags nog heeft
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUD = /\n?<meta name="(googlebot|bingbot)" content="noindex, follow">/g;
const TAGS = '';

function bijwerken(bestand, tekst) { return tekst.replace(OUD, ''); }

if (require.main === module) {
  const check = process.argv.includes('--check');
  const fout = [];
  const paginas = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  for (const f of paginas) {
    const p = path.join(ROOT, f), tekst = fs.readFileSync(p, 'utf8'), nieuw = bijwerken(f, tekst);
    if (nieuw === tekst) continue;
    if (check) fout.push(f); else { fs.writeFileSync(p, nieuw); console.log('Tags verwijderd: ' + f); }
  }
  if (check && fout.length) { console.error('zoekmachines: googlebot/bingbot-noindex staat nog in ' + fout.join(', ') + '; draai node tools/zoekmachines.js'); process.exit(1); }
  console.log((check ? 'Zoekmachinetags zijn actueel' : 'Zoekmachinetags bijgewerkt') + ' (' + paginas.length + ' pagina\'s).');
}

module.exports = { TAGS, bijwerken };
