#!/usr/bin/env node
/*
 * Zoekindex van alle pagina's in de hoofdmap voor de zoeker op de homepage (en daarmee de zoekbalk bovenaan elke pagina).
 * Per pagina: titel, beschrijving en de koppen (h1-h3). Alleen de homepage, 404, beheerpagina's en doorverwijzingen blijven eruit.
 *
 *   node tools/paginas-index.js          schrijft data/paginas.js
 *   node tools/paginas-index.js --check  faalt als data/paginas.js niet actueel is
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const UIT = path.join(ROOT, 'data', 'paginas.js');
const UITSLUITEN = ['index.html', '404.html', 'beheer-code.html', 'aanbieder-beheer.html', 'beheer-voorwaarden.html'];
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
const schoon = s => ent(String(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function pagina(f) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (UITSLUITEN.includes(f) || /<meta http-equiv="refresh"/i.test(html)) return null;
  const titel = schoon((/<title>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || f).replace(/\s*[–-]\s*Adviesforum$/, '');
  const beschrijving = schoon((/<meta name="description" content="([^"]*)"/i.exec(html) || [])[1] || '');
  const body = html.slice(html.indexOf('<body')).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<!-- sitenav[\s\S]*?<!-- \/sitenav -->/, '');
  const koppen = [...body.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map(m => schoon(m[1])).filter(Boolean);
  const uniek = [...new Set(koppen)].filter(k => k !== titel).join(' · ').slice(0, 600);
  return { titel, url: f, tekst: beschrijving, kw: uniek };
}

function bouw() {
  const lijst = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort().map(pagina).filter(Boolean);
  return { n: lijst.length, js: '/* Gegenereerd door tools/paginas-index.js: alle pagina\'s voor de zoeker. Niet met de hand wijzigen. */\nwindow.PAGINAS = ' + JSON.stringify(lijst, null, 0).replace(/\},\{/g, '},\n{') + ';\n' };
}

if (require.main === module) {
  const { n, js } = bouw();
  const oud = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
  if (process.argv.includes('--check')) {
    if (oud !== js) { console.error('data/paginas.js is niet actueel; draai node tools/paginas-index.js'); process.exit(1); }
    console.log('Pagina-index is actueel (' + n + ' pagina\'s).');
  } else { if (oud !== js) fs.writeFileSync(UIT, js); console.log('Geschreven: data/paginas.js (' + n + ' pagina\'s).'); }
}
module.exports = { bouw };
