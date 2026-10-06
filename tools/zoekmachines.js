#!/usr/bin/env node
/*
 * Houdt de site uit Google en Bing, maar laat andere crawlers (zoals die van Intercom voor Fin) ongemoeid.
 * Elke pagina krijgt <meta name="googlebot" content="noindex, follow"> en dezelfde tag voor bingbot.
 * Bewust geen generieke <meta name="robots" content="noindex">: niet bekend is of de Intercom-crawler die respecteert,
 * en build-static.js laat pagina's met een robots-noindex uit de sitemap.
 * robots.txt helpt hier niet: crawlers lezen dat alleen op de domeinroot (jeroen-o.github.io/robots.txt).
 * GitHub Pages kan geen X-Robots-Tag-header meesturen.
 *
 *   node tools/zoekmachines.js          zet de tags in alle pagina's in de hoofdmap
 *   node tools/zoekmachines.js --check  faalt als een pagina de tags mist
 * tools/build-static.js gebruikt TAGS voor de gegenereerde pagina's.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TAGS = '<meta name="googlebot" content="noindex, follow">\n<meta name="bingbot" content="noindex, follow">';

function bijwerken(bestand, tekst) {
  if (tekst.includes('<meta name="googlebot" content="noindex, follow">') && tekst.includes('<meta name="bingbot" content="noindex, follow">')) return tekst;
  const kop = tekst.slice(0, tekst.indexOf('</head>'));
  const m = /<meta name="description"[^>]*>/.exec(kop) || /<meta charset=[^>]*>/.exec(kop);
  if (!m) throw new Error(bestand + ': geen <meta name="description"> of <meta charset> in de head');
  return tekst.slice(0, m.index + m[0].length) + '\n' + TAGS + tekst.slice(m.index + m[0].length);
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const mist = [];
  const paginas = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  for (const f of paginas) {
    const p = path.join(ROOT, f), tekst = fs.readFileSync(p, 'utf8'), nieuw = bijwerken(f, tekst);
    if (nieuw === tekst) continue;
    if (check) mist.push(f); else { fs.writeFileSync(p, nieuw); console.log('Tags toegevoegd: ' + f); }
  }
  if (check && mist.length) { console.error('zoekmachines: googlebot/bingbot-noindex ontbreekt in ' + mist.join(', ') + '; draai node tools/zoekmachines.js'); process.exit(1); }
  console.log((check ? 'Zoekmachinetags zijn actueel' : 'Zoekmachinetags bijgewerkt') + ' (' + paginas.length + ' pagina\'s).');
}

module.exports = { TAGS };
