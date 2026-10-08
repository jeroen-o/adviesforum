#!/usr/bin/env node
/*
 * Eén vaste navigatiebalk bovenaan alle pagina's: zoekbalk (doorzoekt de hele site via index.html?zoek=) en
 * Home, Voorwaarden, Hulpmiddelen, Laatste nieuws, Aanmelden.
 * De balk staat als gewone HTML in elke pagina (werkt zonder JavaScript) tussen <!-- sitenav --> en <!-- /sitenav -->;
 * de opmaak staat in css/sitenav.css. tools/build-static.js gebruikt navHtml() voor de statische pagina's.
 *
 *   node tools/sitenav.js          werkt de balk bij in alle pagina's in de hoofdmap
 *   node tools/sitenav.js --check  faalt als een pagina geen of een verouderde balk heeft
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LINKS = [
  ['index.html', 'Home'],
  ['voorwaarden.html', 'Voorwaarden'],
  ['index.html#hulpmiddelen', 'Hulpmiddelen'],
  ['laatste.html', 'Laatste nieuws'],
  ['aanmelden.html', 'Aanmelden'],
];
/* Pagina's die bij een menu-item horen (voor aria-current). */
const HOORT_BIJ = {
  'index.html': 'Home',
  'voorwaarden.html': 'Voorwaarden', 'voorwaarden-vergelijker.html': 'Voorwaarden', 'productvoorwaarden.html': 'Voorwaarden',
  'situatiecheck.html': 'Voorwaarden',
  'laatste.html': 'Laatste nieuws', 'aanmelden.html': 'Aanmelden',
};
const BEGIN = '<!-- sitenav: gegenereerd door tools/sitenav.js, niet met de hand wijzigen -->';
const EIND = '<!-- /sitenav -->';
const CSS_LINK = 'css/sitenav.css';
/* Huisstijl (Venn-stijl, lichte modus): altijd de laatste stylesheet vóór </head>, zodat hij de stijlen van de pagina overschrijft. */
const HUISSTIJL_LINK = 'css/huisstijl.css';
/* 404.html wordt ook in submappen getoond (GitHub Pages, domein adviesforum.nl) en heeft daarom absolute links nodig. */
const PREFIX = { '404.html': '/' };

function navHtml(pre = '', bestand = '') {
  const huidig = HOORT_BIJ[bestand];
  const li = LINKS.map(([u, t]) => `<li><a href="${pre}${u}"${t === huidig ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  return `${BEGIN}\n<nav class="sitenav" aria-label="Adviesforum"><div class="sitenav-in"><a class="sitenav-merk" href="${pre}index.html"><span class="sitenav-teken" aria-hidden="true">A</span>Adviesforum</a><form class="sitenav-zoek" action="${pre}index.html" method="get" role="search"><input type="search" name="zoek" placeholder="Zoek op de hele site" aria-label="Zoek op de hele site" autocomplete="off"><button type="submit">Zoeken</button></form><ul>${li}</ul></div></nav>\n${EIND}`;
}

/* Oude balken die door de vaste balk worden vervangen. */
const OUD = [
  /<nav class="balk" aria-label="Forum">[\s\S]*?<\/nav>\n?/,
  /<div class="balk">\s*<span>Adviesforum[\s\S]*?<\/div>\n?/,
];

function bijwerken(bestand, tekst) {
  let t = tekst;
  const pre = PREFIX[bestand] || '';
  const nav = navHtml(pre, bestand);
  const b = t.indexOf(BEGIN);
  if (b !== -1) {
    const e = t.indexOf(EIND, b);
    t = t.slice(0, b) + nav + t.slice(e + EIND.length);
  } else {
    let gedaan = false;
    for (const re of OUD) {
      const m = re.exec(t);
      if (m && m.index > t.indexOf('<body')) { t = t.slice(0, m.index) + nav + '\n' + t.slice(m.index + m[0].length); gedaan = true; break; }
    }
    if (!gedaan) {
      const m = /<body[^>]*>\n(<a class="skiplink"[^\n]*\n)?/.exec(t);
      if (!m) throw new Error(bestand + ': geen <body> gevonden');
      t = t.slice(0, m.index + m[0].length) + nav + '\n' + t.slice(m.index + m[0].length);
    }
  }
  const link = `<link rel="stylesheet" href="${pre}${CSS_LINK}">`;
  t = t.replace(/<link rel="stylesheet" href="[^"]*css\/sitenav\.css">/, link);
  if (!t.includes(link)) {
    const h = t.indexOf('</head>');
    if (h === -1 || h > t.indexOf('<body')) throw new Error(bestand + ': geen </head> gevonden');
    t = t.slice(0, h) + link + '\n' + t.slice(h);
  }
  const hs = `<link rel="stylesheet" href="${pre}${HUISSTIJL_LINK}">`;
  t = t.replace(/<link rel="stylesheet" href="[^"]*css\/huisstijl\.css">\n?/g, '');
  const h2 = t.indexOf('</head>');
  t = t.slice(0, h2) + hs + '\n' + t.slice(h2);
  return t;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const oud = [];
  const paginas = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  for (const f of paginas) {
    const p = path.join(ROOT, f), tekst = fs.readFileSync(p, 'utf8'), nieuw = bijwerken(f, tekst);
    if (nieuw === tekst) continue;
    if (check) oud.push(f); else { fs.writeFileSync(p, nieuw); console.log('Bijgewerkt: ' + f); }
  }
  if (check && oud.length) { console.error('sitenav: navigatiebalk niet actueel in ' + oud.join(', ') + '; draai node tools/sitenav.js'); process.exit(1); }
  console.log((check ? 'Navigatiebalk is actueel' : 'Navigatiebalk bijgewerkt') + ' (' + paginas.length + ' pagina\'s).');
}

module.exports = { navHtml, LINKS, CSS_LINK, HUISSTIJL_LINK };
