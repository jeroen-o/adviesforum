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
  ['hypotheekrentetarieven.html', 'Hypotheekrentetarieven'],
  ['index.html#hulpmiddelen', 'Hulpmiddelen'],
  ['kennisbank/', 'Kennisbank'],
  ['aanbieders.html', 'Aanbieders'],
  ['laatste.html', 'Laatste nieuws'],
  ['index.html#handleiding', 'Handleiding'],
  ['index.html#voorwie', 'Voor wie'],
  ['aanmelden.html', 'Aanmelden'],
];
/* Pagina's die bij een menu-item horen (voor aria-current en het kruimelpad in de gestructureerde data).
   Pagina's die hier niet staan en geen GEEN-pagina zijn, horen bij Hulpmiddelen. */
const VOORWAARDEN = ['voorwaarden.html', 'voorwaarden-vergelijker.html', 'productvoorwaarden.html', 'situatiecheck.html', 'acceptatiewijzer.html',
  'partijen.html', 'vergelijken.html', 'beheer-voorwaarden.html', 'verantwoording-voorwaarden.html'];
const AANBIEDERS = ['aanbieders.html', 'aanbieders-info.html', 'aanbieders-voorwaarden.html', 'aanbieder-aanleveren.html', 'aanbieder-beheer.html'];
const HOORT_BIJ = Object.assign(
  { 'index.html': 'Home', 'laatste.html': 'Laatste nieuws', 'nieuw.html': 'Laatste nieuws', 'aanmelden.html': 'Aanmelden', 'uitnodigen.html': 'Aanmelden', 'kennispartner.html': 'Kennisbank', 'gebruiksvoorwaarden.html': 'Aanmelden', 'woningtools.html': 'Kennisbank', 'hypotheekrentetarieven.html': 'Hypotheekrentetarieven', kennisbank: 'Kennisbank' },
  Object.fromEntries(VOORWAARDEN.map(f => [f, 'Voorwaarden'])), Object.fromEntries(AANBIEDERS.map(f => [f, 'Aanbieders'])));
/* Pagina's buiten het menu (geen aria-current, geen kruimelpad). */
const GEEN = ['404.html', 'moderatie.html', 'privacy.html', 'beheer-code.html', 'koppelingen.html', 'compliance-overzicht.html', 'hypotheekbond-tools.html'];
const sectie = bestand => HOORT_BIJ[bestand] || (GEEN.includes(bestand) || !bestand ? null : 'Hulpmiddelen');
const BEGIN = '<!-- sitenav: gegenereerd door tools/sitenav.js, niet met de hand wijzigen -->';
const EIND = '<!-- /sitenav -->';
const CSS_LINK = 'css/sitenav.css';
/* Huisstijl (Venn-stijl, altijd licht): altijd de laatste stylesheet vóór </head>, zodat hij de stijlen van de pagina overschrijft. */
const HUISSTIJL_LINK = 'css/huisstijl.css';
/* 404.html wordt ook in submappen getoond (GitHub Pages, domein adviesforum.nl) en heeft daarom absolute links nodig. */
const PREFIX = { '404.html': '/' };

function navHtml(pre = '', bestand = '', doel = 'inhoud') {
  const huidig = sectie(bestand);
  const li = LINKS.map(([u, t]) => `<li><a href="${pre}${u}"${t === huidig ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  return `${BEGIN}\n<a class="sitenav-skip" href="#${doel}">Naar de inhoud</a>\n<nav class="sitenav" aria-label="Hoofdmenu"><div class="sitenav-in"><div class="sitenav-rij1"><a class="sitenav-merk" href="${pre}index.html"><img class="sitenav-teken" src="${pre}favicon.svg" alt="" width="34" height="34"><span>Advies<span class="sitenav-forum">forum</span></span></a><form class="sitenav-zoek" action="${pre}index.html" method="get" role="search"><input type="search" name="zoek" placeholder="Zoek op de hele site" aria-label="Zoek op de hele site" autocomplete="off"><button type="submit">Zoeken</button></form><div class="sitenav-acties" id="sitenav-acties"></div></div><div class="sitenav-rij2"><ul>${li}</ul></div></div></nav>\n${EIND}`;
}

const VOET_BEGIN = '<!-- sitevoet: gegenereerd door tools/sitenav.js, niet met de hand wijzigen -->';
const VOET_EIND = '<!-- /sitevoet -->';
const BEHEER_MAIL = 'jeroen@oversteegen.nl';
const JAAR = 2026;
/* Dezelfde voettekst op elke pagina: korte uitleg, contact en de belangrijkste ingangen per onderdeel. */
const VOET_KOLOMMEN = [
  ['Voorwaarden', [['voorwaarden.html', 'Alle voorwaarden'], ['voorwaarden-vergelijker.html', 'Voorwaarden vergelijken'], ['situatiecheck.html', 'Situatiecheck'], ['acceptatiewijzer.html', 'Acceptatiewijzer'], ['productvoorwaarden.html', 'Productvoorwaarden'], ['hypotheekrentetarieven.html', 'Hypotheekrentetarieven'], ['partijen.html', 'Aanbiederwegwijzer']]],
  ['Hulpmiddelen', [['index.html#hulpmiddelen', 'Alle hulpmiddelen'], ['rekentools.html', 'Rekentools'], ['leennormen-2026.html', 'Leennormen 2026'], ['nhg-check.html', 'NHG-check'], ['documentenchecklist.html', 'Documentenchecklist'], ['wetgeving.html', 'Wet- en regelgeving']]],
  ['Kennis', [['kennisbank/', 'Kennisbank'], ['faq/', 'Veelgestelde vragen'], ['begrippen/', 'Begrippen A-Z'], ['index.html', 'Forum'], ['laatste.html', 'Laatste nieuws'], ['nieuw.html', 'Wat is nieuw']]],
  ['Meedoen', [['aanmelden.html', 'Aanmelden'], ['kennispartner.html', 'Kennispartner worden'], ['uitnodigen.html', 'Collega uitnodigen'], ['koppelingen.html', 'Koppelen met je adviessoftware'], ['aanbieders-info.html', 'Voor aanbieders'], ['aanbieder-beheer.html', 'Inloggen aanbieders'], ['gebruiksvoorwaarden.html', 'Gebruiksvoorwaarden'], ['privacy.html', 'Privacy en cookies']]],
];
function voetHtml(pre = '') {
  const kol = VOET_KOLOMMEN.map(([kop, links], i) => `<nav class="sitevoet-kol" aria-labelledby="sv-k${i}"><h2 id="sv-k${i}">${kop}</h2><ul>${links.map(([u, t]) => `<li><a href="${pre}${u}">${t}</a></li>`).join('')}</ul></nav>`).join('');
  return `${VOET_BEGIN}
<footer class="sitevoet"><div class="sitevoet-in">
<div class="sitevoet-over"><a class="sitevoet-merk" href="${pre}index.html"><img class="sitenav-teken" src="${pre}favicon.svg" alt="" width="34" height="34"><span>Advies<span class="sitenav-forum">forum</span></span></a><p>Voor en door financieel adviseurs: collegiale kennisdeling over hypotheken, verzekeringen, pensioen en krediet.</p><p><strong>Vraag, idee of fout gezien?</strong><br>Mail de beheerder:<br><a href="mailto:${BEHEER_MAIL}">${BEHEER_MAIL}</a></p><p class="sitevoet-volg"><a href="${pre}feed.xml" type="application/rss+xml">RSS: nieuw en bijgewerkt</a><a href="${pre}aanbieders-feed.xml" type="application/rss+xml">RSS: nieuws van aanbieders</a></p></div>
${kol}
</div>
<div class="sitevoet-onder"><p>Informatie voor adviseurs, geen advies aan consumenten. Voorwaarden en normen van aanbieders zijn leidend: controleer altijd de actuele bron.</p><p>&copy; ${JAAR} Adviesforum &middot; adviesforum.nl</p></div>
</footer>
<script src="${pre}js/statistiek.js" defer></script>
${VOET_EIND}`;
}

const LD_BEGIN = '<!-- sitenav-ld: gegenereerd door tools/sitenav.js -->';
const LD_EIND = '<!-- /sitenav-ld -->';
const BASE = 'https://adviesforum.nl/';
const SECTIE_URL = { Voorwaarden: 'voorwaarden.html', 'Laatste nieuws': 'laatste.html', Aanmelden: 'aanmelden.html' };
const ontsnap = t => String(t).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&middot;/g, '·').replace(/&ndash;/g, '–');
/* Gestructureerde data (schema.org WebPage + kruimelpad) voor zoekmachines en AI-zoekdiensten; niet op noindex-pagina's en de homepage (die heeft een eigen @graph). */
const OG_BEELD = BASE + 'img/og-adviesforum.png';
const ogHtml = kop => /property="og:image"/.test(kop.replace(/<!-- sitenav-ld[\s\S]*?<!-- \/sitenav-ld -->/, '')) || !/property="og:title"/.test(kop) ? ''
  : `<meta property="og:image" content="${OG_BEELD}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="Adviesforum: voor adviseurs die elkaar vooruithelpen">\n<meta name="twitter:card" content="summary_large_image">\n`;
function ldHtml(bestand, kop) {
  const og = ogHtml(kop);
  const blok = x => og + x ? `${LD_BEGIN}\n${og}${x}${LD_EIND}\n` : '';
  if (bestand === 'index.html' || GEEN.includes(bestand) || /<meta name="robots" content="[^"]*noindex/.test(kop)) return blok('');
  const titel = (/<title>([\s\S]*?)<\/title>/.exec(kop) || [])[1];
  const canon = (/<link rel="canonical" href="([^"]+)"/.exec(kop) || [])[1];
  if (!titel || !canon) return blok('');
  const besch = (/<meta name="description" content="([^"]*)"/.exec(kop) || [])[1] || '';
  const naam = ontsnap(titel.trim()).replace(/\s+[–|-]\s+Adviesforum$/, '');
  const kr = [{ name: 'Adviesforum', item: BASE }];
  const sec = sectie(bestand);
  if (SECTIE_URL[sec] && SECTIE_URL[sec] !== bestand) kr.push({ name: sec, item: BASE + SECTIE_URL[sec] });
  kr.push({ name: naam, item: canon });
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': canon + '#webpage', url: canon, name: naam, description: ontsnap(besch), inLanguage: 'nl-NL', isPartOf: { '@id': BASE + '#website' }, breadcrumb: { '@id': canon + '#kruimelpad' } },
    { '@type': 'BreadcrumbList', '@id': canon + '#kruimelpad', itemListElement: kr.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: k.name, item: k.item })) },
  ] };
  return blok(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n`);
}

/* Oude balken die door de vaste balk worden vervangen. */
const OUD = [
  /<nav class="balk" aria-label="Forum">[\s\S]*?<\/nav>\n?/,
  /<div class="balk">\s*<span>Adviesforum[\s\S]*?<\/div>\n?/,
];

function bijwerken(bestand, tekst) {
  let t = tekst;
  const pre = PREFIX[bestand] || '';
  /* Doel van de link 'Naar de inhoud': het id van <main>; zonder id krijgt <main> id="inhoud". */
  let doel = (/<main\b[^>]*\bid="([^"]+)"/.exec(t) || [])[1];
  if (!doel) { doel = 'inhoud'; t = t.replace(/<main\b/, '<main id="inhoud" tabindex="-1"'); }
  const nav = navHtml(pre, bestand, doel);
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
  /* Venn-stijl altijd licht: data-theme="light" zet de donkere modus van alle pagina's uit. */
  t = t.replace(/<html lang="nl"(?: data-theme="[a-z]+")?>/, '<html lang="nl" data-theme="light">');
  const hs = `<link rel="stylesheet" href="${pre}${HUISSTIJL_LINK}">`;
  t = t.replace(/<link rel="stylesheet" href="[^"]*css\/huisstijl\.css">\n?/g, '');
  t = t.replace(new RegExp(LD_BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + LD_EIND + '\\n?'), '');
  const h2 = t.indexOf('</head>');
  t = t.slice(0, h2) + ldHtml(bestand, t.slice(0, h2)) + hs + '\n' + t.slice(h2);
  /* Voettekst: vervang het bestaande blok of zet hem direct vóór </body>. */
  const voet = voetHtml(pre);
  const vb = t.indexOf(VOET_BEGIN);
  if (vb !== -1) t = t.slice(0, vb) + voet + t.slice(t.indexOf(VOET_EIND, vb) + VOET_EIND.length);
  else { const eb = t.lastIndexOf('</body>'); t = t.slice(0, eb) + voet + '\n' + t.slice(eb); }
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

module.exports = { navHtml, voetHtml, OG_BEELD, LINKS, CSS_LINK, HUISSTIJL_LINK, BEHEER_MAIL };
