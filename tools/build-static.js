#!/usr/bin/env node
/* Ontwikkeltool: genereert statische, crawlbare HTML uit de data van het forum (SEO en GEO).
 * index.html is een SPA met hashroutes; crawlers zonder JavaScript zien de kennisbank, FAQ en
 * begrippen daar niet. Deze tool maakt er gewone pagina's van.
 *
 *   node tools/build-static.js             schrijft kennisbank/, faq/, begrippen/, vraag/, llms.txt en llms-full.txt
 *   node tools/build-static.js --check     controleert alleen of die bestanden actueel zijn (exit 1 als niet)
 *   node tools/build-static.js --sitemap   schrijft daarnaast sitemap.xml (alle .html zonder noindex, met lastmod)
 *
 * Bronnen: de <script src="data/kennisbank*.js">-tags en de lijst FAQ_BESTANDEN in index.html,
 * data/begrippen.js, de <script src="data/vragen*.js">-tags (deelpagina's voor LinkedIn in vraag/),
 * en CATS / FAQ_THEMAS uit index.html. Geen dependencies.
 * De uitvoer hangt alleen af van de data (niet van de datum van vandaag), zodat --check stabiel is.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { navHtml, voetHtml, OG_BEELD, CSS_LINK, HUISSTIJL_LINK } = require('./sitenav');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://adviesforum.nl/';
const SITE = 'Adviesforum';
const DISCLAIMER = 'Collegiale kennisdeling tussen financieel adviseurs, geen advies aan klanten of consumenten. Controleer altijd de actuele bron voordat je iets in een dossier gebruikt.';

/* ---------- Data laden ---------- */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
function fout(msg) { console.error(msg); process.exit(1); }
function uitIndex(naam) {
  const m = indexHtml.match(new RegExp('const ' + naam + '=([\\[{][\\s\\S]*?[\\]}]);\\n'));
  if (!m) fout('Kon ' + naam + ' niet vinden in index.html');
  return vm.runInNewContext('(' + m[1] + ')');
}
const CATS = uitIndex('CATS');
const FAQ_THEMAS = uitIndex('FAQ_THEMAS');
const FAQ_BESTANDEN = uitIndex('FAQ_BESTANDEN');
const KB_BESTANDEN = uitIndex('KENNIS_BESTANDEN').filter(f => /^data\/kennisbank[^/]*\.js$/.test(f)); /* lijst in index.html (worden daar na de eerste weergave geladen) */
if (!KB_BESTANDEN.length) fout('Geen data/kennisbank*.js scripts gevonden in index.html');
const VRAAG_BESTANDEN = [...indexHtml.matchAll(/<script\s+src="(data\/vragen[^"]*\.js)"/g)].map(m => m[1]);
if (!VRAAG_BESTANDEN.length) fout('Geen data/vragen*.js scripts gevonden in index.html');

global.window = {};
for (const b of [...KB_BESTANDEN, ...FAQ_BESTANDEN, 'data/begrippen.js', ...VRAAG_BESTANDEN, 'data/voorwaarden-onderwerpen.js', 'data/kennispartners.js']) require(path.join(ROOT, b));
const KENNISPARTNERS = window.KENNISPARTNERS || [];
const VW_ONDERWERPEN = window.VOORWAARDEN_ONDERWERPEN;
const ARTIKELEN = window.KENNISBANK || [];
const FAQ = window.FAQ || [];
const BEGRIPPEN = window.BEGRIPPEN || [];
const VRAGEN = window.VRAGEN_DATA || [];
delete global.window;
if (!ARTIKELEN.length || !FAQ.length || !BEGRIPPEN.length) fout('Kennisbank, FAQ of begrippen is leeg.');
for (const [lijst, naam] of [[ARTIKELEN, 'kennisbank'], [FAQ, 'FAQ'], [VRAGEN, 'vragen']]) {
  const ids = new Set();
  for (const x of lijst) { if (!/^[A-Za-z0-9_-]+$/.test(x.id)) fout('Ongeldig id in ' + naam + ': ' + x.id); if (ids.has(x.id)) fout('Dubbel id in ' + naam + ': ' + x.id); ids.add(x.id); }
}

/* ---------- Hulpfuncties ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* JSON-LD veilig in <script>: geen </script>, geen HTML-commentaar, geen regelscheiders */
const ld = obj => '<script type="application/ld+json">' + JSON.stringify(obj)
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + '</script>';
const catNaam = id => (CATS.find(c => c.id === id) || {}).naam || id;
const datumNL = iso => { const d = String(iso || '').slice(0, 10).split('-'); const mnd = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']; return d.length === 3 ? (+d[2]) + ' ' + mnd[+d[1] - 1] + ' ' + d[0] : ''; };
const slug = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Zelfde opmaak als rich() in index.html: '## ' kop, '- ' opsomming, '1. ' genummerd, lege regel = alinea */
function rich(t, kop = 'h2') {
  const lines = esc(t).split('\n'); let out = '', list = null, para = [];
  const flush = () => { if (para.length) { out += '<p>' + para.join('<br>') + '</p>\n'; para = []; } };
  const closeList = () => { if (list) { out += '</' + list + '>\n'; list = null; } };
  for (const l of lines) {
    if (l.startsWith('## ')) { flush(); closeList(); out += '<' + kop + '>' + l.slice(3) + '</' + kop + '>\n'; continue; }
    const ul = l.startsWith('- '), ol = /^\d+\. /.test(l);
    if (ul || ol) { flush(); const want = ul ? 'ul' : 'ol'; if (list !== want) { closeList(); out += '<' + want + '>\n'; list = want; } out += '<li>' + (ul ? l.slice(2) : l.replace(/^\d+\. /, '')) + '</li>\n'; continue; }
    closeList();
    if (l.trim() === '') flush(); else para.push(l);
  }
  closeList(); flush(); return out;
}
/* Platte tekst: koppen en opsommingstekens weg, witruimte samengevoegd */
const plat = t => String(t || '').split('\n').map(l => l.replace(/^## /, '').replace(/^- /, '').replace(/^\d+\. /, '')).join(' ').replace(/\s+/g, ' ').trim();
function kort(t, max = 155) {
  const s = plat(t); if (s.length <= max) return s;
  const knip = s.slice(0, max); const sp = knip.lastIndexOf(' ');
  return (sp > 80 ? knip.slice(0, sp) : knip).replace(/[\s,;:.–-]+$/, '') + '…';
}
/* Link uit de data: relatief = pagina in deze repository (vanuit een submap ../ ervoor) */
const linkUrl = (u, pre) => /^(https?:|mailto:)/i.test(u) ? u : pre + u;

/* ---------- Opmaak (huisstijl Venn: indigo/oranje, systeemlettertype) ---------- */
function css(pre) {
  return `
:root{--geel:#F68712;--zwart:#26306E;--tekst:#15162F;--grijs:#55576F;--lijn:#E3E3EC;--vlak:#F7F7FA;--rood:#9E2F45}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:Segoe UI,Roboto,Helvetica Neue,Arial,system-ui,sans-serif;color:var(--tekst);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-wrap:anywhere}
a{color:inherit}
header.site{border-bottom:1px solid var(--lijn);padding:14px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.merk{display:flex;align-items:center;gap:10px;text-decoration:none}
.hex{width:26px;height:30px;background:var(--zwart);border-radius:7px;flex:none;position:relative}
.hex::after{content:'';position:absolute;inset:7px 6px;background:var(--geel);clip-path:inherit}
.merknaam{font-weight:800;letter-spacing:.06em;font-size:16px}
.merksub{font-size:12px;color:var(--grijs);letter-spacing:.04em}
nav.hoofd{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap}
nav.hoofd a{font-size:13px;text-decoration:none;font-weight:600;border:1px solid var(--lijn);padding:7px 13px;border-radius:999px}
nav.hoofd a:hover,nav.hoofd a[aria-current]{background:var(--vlak)}
.hero{background:var(--zwart);color:#fff;border-bottom:3px solid var(--geel);padding:28px 20px 32px}
.hero-in,.inhoud{max-width:820px;margin:0 auto}
.hero h1{margin:6px 0 10px;font-size:clamp(25px,4.4vw,38px);line-height:1.15;font-weight:800}
.hero p{margin:0;max-width:66ch}
.kruimel{font-size:13px}.kruimel ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:4px}
.kruimel li+li::before{content:'›';margin-right:4px}.kruimel a{text-decoration:underline}
.meta{font-size:13px;margin-top:10px}
.romp{padding:28px 20px 56px}
.inhoud h2{font-size:20px;margin:30px 0 8px;line-height:1.3}
.inhoud h3{font-size:16px;margin:22px 0 6px}
.inhoud ul,.inhoud ol{padding-left:22px}.inhoud li{margin:4px 0}
.melding{border:2px solid var(--zwart);background:#FEF0E2;border-radius:10px;padding:12px 16px;font-weight:700;margin:0 0 22px}
.knop{display:inline-block;background:var(--zwart);color:#fff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:999px;font-size:14px}
.knop:hover{background:#333}
.kader{border:1px solid var(--lijn);border-radius:12px;padding:16px 18px;background:var(--vlak);margin:28px 0 0;font-size:14px}
.kader h2{margin-top:0;font-size:16px}
.lijst{list-style:none;padding:0!important}.lijst li{border-bottom:1px solid var(--lijn);padding:10px 0;margin:0}
.lijst a{font-weight:600}.lijst small{display:block;color:var(--grijs)}
details{border-bottom:1px solid var(--lijn);padding:10px 0}
summary{cursor:pointer;font-weight:700;min-height:36px;padding:6px 0}.inhoud summary h2{display:inline;font-size:15.5px;margin:0;line-height:1.6}
details .antw{margin-top:8px}details .waar,.waar{font-size:12.5px;color:var(--grijs)}
.az{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 18px}.az a{display:inline-grid;place-items:center;min-width:36px;min-height:36px;text-align:center;border:1px solid var(--lijn);border-radius:8px;padding:4px 6px;text-decoration:none;font-weight:700}
dl.begrippen dt{font-weight:700;margin-top:16px}dl.begrippen dd{margin:4px 0 0}
.disclaimer{font-size:13px;color:var(--grijs);margin-top:32px}
footer{border-top:1px solid var(--lijn);padding:22px 20px;font-size:13px;color:var(--grijs);text-align:center}
footer nav{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 16px;margin-bottom:8px}
footer a{color:var(--tekst)}
:focus-visible{outline:3px solid #26306E;outline-offset:2px}
.skiplink{position:absolute;left:12px;top:-200px;z-index:100;background:#26306E;color:#fff;padding:10px 16px;border-radius:8px;font-weight:700;text-decoration:none}
.skiplink:focus{top:12px}
main:focus{outline:none}
@media (max-width:760px){input,select,textarea{font-size:16px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
@media print{header.site nav,footer nav,.knop,.skiplink{display:none}.hero{background:none;padding:0}}
/* Donkere modus (alleen op het scherm; printen blijft licht). Zelfde opzet als index.html: data-theme="light" zet hem uit. */
@media screen and (prefers-color-scheme:dark){
:root:not([data-theme="light"]){color-scheme:dark;--zwart:#F1F1F6;--tekst:#F1F1F6;--grijs:#C3C4D3;--lijn:#1E2040;--vlak:#12132B;--rood:#F08A80}
:root:not([data-theme="light"]) body{background:#26306E}
:root:not([data-theme="light"]) .hero{background:#12132B;border-bottom:3px solid var(--geel)}
:root:not([data-theme="light"]) .hex::after{background:#26306E}
:root:not([data-theme="light"]) nav.hoofd a:hover,:root:not([data-theme="light"]) nav.hoofd a[aria-current]{background:#1C1E3A}
:root:not([data-theme="light"]) .melding,:root:not([data-theme="light"]) .slot{background:#2E2412;border-color:var(--geel)}
:root:not([data-theme="light"]) .knop{background:var(--geel);color:#26306E}
:root:not([data-theme="light"]) .knop:hover{background:#F9A54D}
:root:not([data-theme="light"]) .knop-licht{background:transparent;color:#F1F1F6;border-color:#F1F1F6}
:root:not([data-theme="light"]) .knop-licht:hover{background:#1C1E3A}
:root:not([data-theme="light"]) .reacties li:target{background:#2E2412}
:root:not([data-theme="light"]) :focus-visible{outline-color:var(--geel)}
:root:not([data-theme="light"]) .skiplink{background:var(--geel);color:#26306E}
}`;
}

function pagina({ pre, pad, titel, ogTitel, beschrijving, type = 'website', h1, intro = '', kruimel = [], meta = '', inhoud, jsonld = [], actief = '', extraCss = '', robots = '' }) {
  const url = BASE + pad;
  const nav = [['kennisbank/', 'Kennisbank', 'kb'], ['faq/', 'FAQ', 'faq'], ['begrippen/', 'Begrippen', 'beg'], ['index.html', 'Forum', 'forum']]
    .map(([h, n, k]) => `<a href="${pre}${h}"${actief === k ? ' aria-current="page"' : ''}>${n}</a>`).join('');
  const kr = kruimel.length ? `<nav class="kruimel" aria-label="Kruimelpad"><ol>${kruimel.map((k, i) => i === kruimel.length - 1 ? `<li aria-current="page">${esc(k[0])}</li>` : `<li><a href="${k[1]}">${esc(k[0])}</a></li>`).join('')}</ol></nav>` : '';
  const bc = kruimel.length ? [ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: kruimel.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: k[0], item: k[2] })) })] : [];
  return `<!DOCTYPE html>
<html lang="nl" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
${robots ? `<meta name="robots" content="${esc(robots)}">` : ''}
<link rel="canonical" href="${esc(url)}">
<meta property="og:title" content="${esc(ogTitel || titel)}">
<meta property="og:description" content="${esc(beschrijving)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="${SITE}">
<meta property="og:locale" content="nl_NL">
<meta property="og:image" content="${OG_BEELD}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F68712">
<link rel="icon" href="${pre}favicon.svg" type="image/svg+xml">
<link rel="manifest" href="${pre}manifest.webmanifest">
<style>
${css(pre)}${extraCss ? '\n' + extraCss : ''}
</style>
${[...jsonld.map(ld), ...bc].join('\n')}
<link rel="stylesheet" href="${pre}${CSS_LINK}">
<link rel="stylesheet" href="${pre}${HUISSTIJL_LINK}">
</head>
<body>
${navHtml(pre, actief === 'forum' ? '' : 'kennisbank')}
<header class="site">
  <a class="merk" href="${pre}index.html"><span class="hex" aria-hidden="true"></span><span><span class="merknaam">ADVIESFORUM</span><br><span class="merksub">Voor en door financieel adviseurs</span></span></a>
  <nav class="hoofd" aria-label="Kennis">${nav}</nav>
</header>
<main id="inhoud" tabindex="-1">
<div class="hero"><div class="hero-in">
${kr}
<h1>${esc(h1)}</h1>
${intro ? '<p>' + intro + '</p>' : ''}${meta ? '\n<div class="meta">' + meta + '</div>' : ''}
</div></div>
<div class="romp"><div class="inhoud">
${inhoud}
<p class="disclaimer">${esc(DISCLAIMER)}</p>
</div></div>
</main>
${voetHtml(pre)}
</body>
</html>
`;
}

const ORG = { '@type': 'Organization', name: SITE, url: BASE, logo: { '@type': 'ImageObject', url: BASE + 'favicon.svg' } };
const uit = {}; // relatief pad -> inhoud

/* ---------- Kennisbank ---------- */
const kbSort = ARTIKELEN.slice().sort((a, b) => String(b.datum).localeCompare(String(a.datum)) || a.id.localeCompare(b.id));
const kbCats = CATS.filter(c => ARTIKELEN.some(a => a.cat === c.id));
const KR_FORUM = ['Adviesforum', '../index.html', BASE];
/* Links naar de voorwaarden-vergelijker bij hypotheekonderwerpen (data/voorwaarden-onderwerpen.js) */
const vwKader = (tekst, c) => {
  const l = VW_ONDERWERPEN && VW_ONDERWERPEN.zoek ? VW_ONDERWERPEN.zoek(tekst, c, '../') : [];
  return l.length ? `<div class="kader"><h2>Vergelijk de voorwaarden per geldverstrekker</h2><ul class="lijst">${l.map(x => `<li><a href="${esc(x.href)}">${esc(x.naam[0].toUpperCase() + x.naam.slice(1))}</a></li>`).join('')}</ul><p style="font-size:13px;margin:6px 0 0">Gecontroleerde voorwaarden met bron; geen rentes en geen advies.</p></div>\n` : '';
};
const KR_KB = ['Kennisbank', './', BASE + 'kennisbank/'];
/* Kennispartner bij het artikel (data/kennispartners.js), of een uitnodiging om het artikel te claimen */
const kpKader = (a, pre) => {
  const kp = KENNISPARTNERS.filter(p => (p.artikelen || []).includes(a.id));
  if (kp.length) return `<div class="kader kennispartner"><h2>Kennispartner bij dit artikel</h2><ul class="lijst">${kp.map(p => `<li><a href="${pre}kennispartner.html#partner-${esc(p.id)}">${esc(p.naam)}</a>, ${esc(p.kantoor)}${p.plaats ? ' (' + esc(p.plaats) + ')' : ''}</li>`).join('')}</ul><p style="font-size:13px;margin:6px 0 0">Vakinhoudelijk aanspreekpunt, gecontroleerd door de beheerder. Een vermelding is geen aanbeveling.</p></div>\n`;
  return `<div class="kader kennispartner"><h2>Specialist in dit onderwerp?</h2><p style="margin:0">Claim dit artikel als <a href="${pre}kennispartner.html?artikel=${esc(a.id)}#claimen">Kennispartner van het Adviesforum</a>: je naam en kantoor staan dan bij het artikel en je krijgt een badge voor je website en LinkedIn.</p></div>\n`;
};

for (const a of ARTIKELEN) {
  const gewijzigd = a.bijgewerkt || a.datum;
  const beschr = kort(a.body);
  const verwant = kbSort.filter(x => x.cat === a.cat && x.id !== a.id).slice(0, 6);
  const meta = [catNaam(a.cat), 'Gepubliceerd ' + datumNL(a.datum), a.bijgewerkt ? 'Bijgewerkt ' + datumNL(a.bijgewerkt) : '', a.peildatum ? 'Peildatum ' + datumNL(a.peildatum) : '', a.herzienVoor ? 'Herzien vóór ' + datumNL(a.herzienVoor) : '']
    .filter(Boolean).map(esc).join(' · ');
  const inhoud = (a.gecontroleerd ? '' : '<p class="melding" role="note">Concept – nog niet gecontroleerd door compliance</p>\n') +
    '<article>\n' + rich(a.body) +
    (a.links && a.links.length ? '<h2>Bronnen en links</h2>\n<ul>\n' + a.links.map(l => `<li><a href="${esc(linkUrl(l.url, '../'))}"${/^https?:/i.test(l.url) ? ' rel="noopener"' : ''}>${esc(l.titel)}</a></li>`).join('\n') + '\n</ul>\n' : '') +
    '</article>\n' +
    `<p style="margin-top:26px"><a class="knop" href="../index.html#artikel-${esc(a.id)}">Open in het forum</a></p>\n` +
    vwKader(a.titel + ' ' + a.body, a.cat) +
    kpKader(a, '../') +
    (verwant.length ? `<div class="kader"><h2>Meer over ${esc(catNaam(a.cat))}</h2><ul class="lijst">${verwant.map(x => `<li><a href="${esc(x.id)}.html">${esc(x.titel)}</a></li>`).join('')}</ul></div>` : '');
  uit['kennisbank/' + a.id + '.html'] = pagina({
    pre: '../', pad: 'kennisbank/' + a.id + '.html', titel: a.titel + ' – ' + SITE, beschrijving: beschr, type: 'article', h1: a.titel, actief: 'kb',
    kruimel: [KR_FORUM, KR_KB, [catNaam(a.cat), './#' + a.cat, BASE + 'kennisbank/#' + a.cat], [a.titel, '', BASE + 'kennisbank/' + a.id + '.html']],
    meta, inhoud,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.titel, description: beschr, datePublished: a.datum, dateModified: gewijzigd,
      author: { '@type': 'Organization', name: SITE, url: BASE }, publisher: ORG, inLanguage: 'nl-NL', articleSection: catNaam(a.cat),
      mainEntityOfPage: { '@type': 'WebPage', '@id': BASE + 'kennisbank/' + a.id + '.html' }, isAccessibleForFree: true,
      ...(a.kw ? { keywords: a.kw } : {}) }]
  });
}
uit['kennisbank/index.html'] = pagina({
  pre: '../', pad: 'kennisbank/', titel: 'Kennisbank – ' + SITE, actief: 'kb',
  beschrijving: kort('Kennisbank van het Adviesforum: ' + ARTIKELEN.length + ' artikelen voor financieel adviseurs over ' + kbCats.map(c => c.naam.toLowerCase()).join(', ') + '.'),
  h1: 'Kennisbank', intro: esc(ARTIKELEN.length + ' artikelen voor financieel adviseurs, per categorie. Artikelen met de melding “Concept” zijn nog niet gecontroleerd door compliance.'),
  kruimel: [KR_FORUM, ['Kennisbank', '', BASE + 'kennisbank/']],
  inhoud: `<nav class="az" aria-label="Categorieën">${kbCats.map(c => `<a href="#${c.id}">${esc(c.naam)}</a>`).join('')}</nav>\n` +
    kbCats.map(c => `<section id="${c.id}"><h2>${esc(c.naam)}</h2><ul class="lijst">\n` + kbSort.filter(a => a.cat === c.id).map(a =>
      `<li><a href="${esc(a.id)}.html">${esc(a.titel)}</a><small>${esc(kort(a.body, 140))}${a.gecontroleerd ? '' : ' · Concept'}</small></li>`).join('\n') + '\n</ul></section>').join('\n'),
  jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Kennisbank', url: BASE + 'kennisbank/', inLanguage: 'nl-NL', isPartOf: { '@type': 'WebSite', name: SITE, url: BASE },
    mainEntity: { '@type': 'ItemList', numberOfItems: ARTIKELEN.length, itemListElement: kbSort.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: BASE + 'kennisbank/' + a.id + '.html', name: a.titel })) } }]
});

/* ---------- FAQ: per thema, pagina's van hoogstens 200 vragen ---------- */
const MAX_FAQ = 200;
const KR_FAQ = ['FAQ', './', BASE + 'faq/'];
const themaKeys = [...Object.keys(FAQ_THEMAS), ...[...new Set(FAQ.map(f => f.thema))].filter(t => !(t in FAQ_THEMAS))].filter(t => FAQ.some(f => f.thema === t));
const faqDelen = {}; // thema -> [{bestand, items}]
for (const t of themaKeys) {
  if (!/^[a-z0-9-]+$/.test(t)) fout('Ongeldige FAQ-themanaam: ' + t);
  const items = FAQ.filter(f => f.thema === t);
  const n = Math.ceil(items.length / MAX_FAQ), per = Math.ceil(items.length / n);
  faqDelen[t] = Array.from({ length: n }, (_, i) => ({ bestand: t + (i ? '-' + (i + 1) : '') + '.html', items: items.slice(i * per, (i + 1) * per) }));
}
for (const t of themaKeys) {
  const naam = FAQ_THEMAS[t] || t, delen = faqDelen[t];
  delen.forEach((d, i) => {
    const deel = delen.length > 1 ? ' (deel ' + (i + 1) + ' van ' + delen.length + ')' : '';
    const pad = 'faq/' + d.bestand;
    const navDelen = plek => delen.length > 1 ? `<nav class="az" aria-label="Delen (${plek})">${delen.map((x, j) => j === i ? `<span class="az-nu" aria-current="page" style="padding:4px 8px;font-weight:800">Deel ${j + 1}</span>` : `<a href="${x.bestand}">Deel ${j + 1}</a>`).join('')}</nav>\n` : '';
    uit[pad] = pagina({
      pre: '../', pad, titel: naam + deel + ' – FAQ – ' + SITE, actief: 'faq',
      beschrijving: kort('Veelgestelde vragen voor financieel adviseurs over ' + naam.toLowerCase() + deel + ': ' + d.items.slice(0, 3).map(f => f.vraag).join(' ')),
      h1: naam + deel, intro: esc(d.items.length + ' vragen en antwoorden uit de FAQ van het Adviesforum.'),
      kruimel: [KR_FORUM, KR_FAQ, [naam + deel, '', BASE + pad]],
      inhoud: navDelen('boven') + d.items.map(f => `<details id="faq-${esc(f.id)}"><summary><h2>${esc(f.vraag)}</h2></summary><div class="antw">${rich(f.antwoord, 'h3')}</div><div class="waar">${[f.bron ? 'Bron: ' + esc(f.bron) : '', (f.tags || []).map(esc).join(', ')].filter(Boolean).join(' · ')}</div></details>`).join('\n') +
        '\n' + navDelen('onder') + `<p style="margin-top:22px"><a class="knop" href="../index.html#faq">Zoek in de FAQ van het forum</a></p>`,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'FAQPage', name: naam + deel, url: BASE + pad, inLanguage: 'nl-NL',
        mainEntity: d.items.map(f => ({ '@type': 'Question', name: f.vraag, acceptedAnswer: { '@type': 'Answer', text: plat(f.antwoord) } })) }]
    });
  });
}
uit['faq/index.html'] = pagina({
  pre: '../', pad: 'faq/', titel: 'FAQ – ' + SITE, actief: 'faq',
  beschrijving: kort('Ruim ' + Math.floor(FAQ.length / 100) * 100 + ' veelgestelde vragen en antwoorden voor financieel adviseurs over hypotheken, NHG, fiscaal, verzekeringen, pensioen, krediet en compliance.'),
  h1: 'Veelgestelde vragen', intro: esc(FAQ.length.toLocaleString('nl-NL') + ' vragen en antwoorden, per thema.'),
  kruimel: [KR_FORUM, ['FAQ', '', BASE + 'faq/']],
  inhoud: '<ul class="lijst">\n' + themaKeys.map(t => {
    const delen = faqDelen[t], n = delen.reduce((s, d) => s + d.items.length, 0);
    return `<li><a href="${delen[0].bestand}">${esc(FAQ_THEMAS[t] || t)}</a><small>${n} vragen${delen.length > 1 ? ' · ' + delen.map((d, j) => `<a href="${d.bestand}">deel ${j + 1}</a>`).join(', ') : ''}</small></li>`;
  }).join('\n') + '\n</ul>',
  jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Veelgestelde vragen', url: BASE + 'faq/', inLanguage: 'nl-NL', isPartOf: { '@type': 'WebSite', name: SITE, url: BASE } }]
});

/* ---------- Begrippen A–Z ---------- */
const begSort = BEGRIPPEN.slice().sort((a, b) => a.term.localeCompare(b.term, 'nl'));
const begId = new Map(); { const gebruikt = new Set(); for (const b of begSort) { let s = slug(b.term) || 'begrip', id = s, i = 2; while (gebruikt.has(id)) id = s + '-' + i++; gebruikt.add(id); begId.set(b, id); } }
const letter = b => { const c = slug(b.term).charAt(0).toUpperCase(); return /[A-Z]/.test(c) ? c : '#'; };
const letters = [...new Set(begSort.map(letter))];
uit['begrippen/index.html'] = pagina({
  pre: '../', pad: 'begrippen/', titel: 'Begrippenlijst A–Z – ' + SITE, actief: 'beg',
  beschrijving: kort('Begrippenlijst voor financieel adviseurs: ' + BEGRIPPEN.length + ' termen uit hypotheek, verzekeringen, pensioen, fiscaal en compliance, kort uitgelegd van A tot Z.'),
  h1: 'Begrippen A–Z', intro: esc(BEGRIPPEN.length + ' begrippen uit de financiële advieswereld, kort uitgelegd.'),
  kruimel: [KR_FORUM, ['Begrippen', '', BASE + 'begrippen/']],
  inhoud: `<nav class="az" aria-label="Alfabet">${letters.map(l => `<a href="#letter-${l === '#' ? 'overig' : l}">${l}</a>`).join('')}</nav>\n` +
    letters.map(l => `<section id="letter-${l === '#' ? 'overig' : l}"><h2>${l}</h2><dl class="begrippen">\n` + begSort.filter(b => letter(b) === l).map(b =>
      `<dt id="${begId.get(b)}">${esc(b.term)}</dt><dd>${rich(b.uitleg, 'h3')}</dd>`).join('\n') + '\n</dl></section>').join('\n'),
  jsonld: [{ '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': BASE + 'begrippen/', name: 'Begrippenlijst Adviesforum', url: BASE + 'begrippen/', inLanguage: 'nl-NL',
    hasDefinedTerm: begSort.map(b => ({ '@type': 'DefinedTerm', name: b.term, description: plat(b.uitleg), url: BASE + 'begrippen/#' + begId.get(b), inDefinedTermSet: BASE + 'begrippen/' })) }]
});

/* ---------- Deelpagina's per forumvraag (vraag/<id>.html) ----------
 * Voor delen op LinkedIn: LinkedIn leest geen hash-url's (#vraag-…) en voert geen JavaScript uit, dus een
 * link naar de SPA toont alleen de algemene preview. Deze pagina's hebben per vraag een eigen og:title en
 * og:description, de vraag, een teaser (±200 tekens) van het beste antwoord en een anker #r<nr> per reactie.
 * De volledige antwoorden staan hier bewust niet: die leest een bezoeker na inloggen in het forum.
 * Bewuste keuzes:
 *  - Eén pagina per vraag met ankers #r<nr>, geen aparte pagina per reactie: LinkedIn negeert het fragment en
 *    toont voor elke reactie dezelfde vraagpreview; aparte pagina's zouden ruim duizend bijna-dubbele pagina's opleveren.
 *  - Geen namen van vraagsteller of antwoorders (dataminimalisatie: deze pagina's worden geïndexeerd en gedeeld).
 *  - Geen og:image: LinkedIn toont geen SVG (favicon.svg) en een eigen PNG-afbeelding ontbreekt.
 *  - Geen DiscussionForumPosting/QAPage-JSON-LD: QAPage vereist de volledige antwoorden en DiscussionForumPosting
 *    vereist de auteursnaam; beide botsen met de afscherming en de dataminimalisatie. Alleen de BreadcrumbList.
 */
const VRAAG_CSS = `.knoppen{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0 0}
.knop-licht{background:#fff;color:var(--zwart);border:2px solid var(--zwart);padding:9px 16px}.knop-licht:hover{background:var(--vlak)}
.teaser{border:1px solid var(--lijn);border-left:4px solid var(--geel);border-radius:10px;padding:12px 16px;margin:10px 0 0}
.teaser .waar{margin:0 0 4px}.teaser p{margin:0}
.slot{border:2px solid var(--zwart);background:#FEF0E2;border-radius:12px;padding:16px 18px;margin:22px 0 0}
.slot p{margin:0}
.reacties li{scroll-margin-top:12px}.reacties li:target{background:#FEF0E2;outline:2px solid var(--geel);border-radius:6px;padding-left:8px}`;
const ordeAntw = v => v.antwoorden.slice().sort((a, b) => (b.id === v.beste) - (a.id === v.beste) || gem(b.rA) - gem(a.rA) || String(a.datum).localeCompare(String(b.datum)));
const gem = o => { const w = Object.values(o || {}); return w.length ? w.reduce((x, y) => x + y, 0) / w.length : 0; };
const nrVan = v => { const s = v.antwoorden.slice().sort((x, y) => String(x.datum).localeCompare(String(y.datum)) || String(x.id).localeCompare(String(y.id))); return a => s.indexOf(a) + 1; };
const forumLink = (v, nr) => '../index.html?bron=linkedin#vraag-' + encodeURIComponent(v.id) + (nr ? '-r' + nr : '');
/* Korte beschrijving, gelijk aan de posttekst die de knop "Deel op LinkedIn" in index.html maakt */
const antwTekst = v => { const n = v.antwoorden.length; return v.voorbeeld ? 'Voorbeeldvraag met ' + n + (n === 1 ? ' voorbeeldantwoord' : ' voorbeeldantwoorden') : n === 0 ? 'Nog geen antwoorden van collega-adviseurs' : n + (n === 1 ? ' antwoord' : ' antwoorden') + ' van collega-adviseurs'; };
const vraagBeschr = v => kort(v.body, 200) + ' · ' + antwTekst(v);
const vraagDatum = {}; // pad -> laatste datum (vraag of reactie), voor de sitemap
for (const v of VRAGEN) {
  const pad = 'vraag/' + v.id + '.html', url = BASE + pad;
  vraagDatum[pad] = [v.datum, ...v.antwoorden.map(a => a.datum)].map(d => String(d).slice(0, 10)).sort().pop();
  const ans = ordeAntw(v), nr = nrVan(v), top = ans[0];
  const opNr = v.antwoorden.slice().sort((a, b) => nr(a) - nr(b));
  const meta = [catNaam(v.cat), 'Gesteld op ' + datumNL(v.datum), antwTekst(v)].map(esc).join(' · ');
  const inhoud = (v.voorbeeld ? '<p class="melding" role="note">Voorbeeldvraag: een fictieve praktijksituatie om te laten zien hoe collega’s elkaar helpen. De antwoorden zijn voorbeeldantwoorden.</p>\n' : '') +
    '<article>\n<h2>De vraag</h2>\n' + rich(v.body, 'h3') + '</article>\n' +
    vwKader(v.titel + ' ' + v.body + ' ' + (v.tags || []).join(' '), v.cat) +
    (top ? `<h2>${top.id === v.beste ? 'Beste antwoord' : gem(top.rA) > 0 ? 'Best beoordeelde antwoord' : 'Eerste antwoord'} (fragment)</h2>\n<div class="teaser"><p class="waar">Reactie #${nr(top)} · ${esc(datumNL(top.datum))}</p><p>${esc(kort(top.body, 200))}</p></div>\n` : '') +
    `<div class="slot" role="note"><p><b>Lees alle antwoorden op het Adviesforum.</b> Inloggen als geverifieerd adviseur vereist.</p>` +
    `<p class="knoppen"><a class="knop" href="${esc(forumLink(v))}">Inloggen</a><a class="knop knop-licht" href="../aanmelden.html">Aanmelden</a></p></div>\n` +
    (opNr.length ? `<h2>Alle reacties (${opNr.length})</h2>\n<ul class="lijst reacties">\n` + opNr.map(a => `<li id="r${nr(a)}"><a href="${esc(forumLink(v, nr(a)))}">Reactie #${nr(a)}</a>${a.id === v.beste ? ' · beste antwoord' : ''}<small>${esc(datumNL(a.datum))} · lezen na inloggen</small></li>`).join('\n') + '\n</ul>\n' : '');
  uit[pad] = pagina({
    pre: '../', pad, titel: v.titel + ' – ' + SITE, ogTitel: v.titel, beschrijving: vraagBeschr(v), type: 'article', h1: v.titel, actief: 'forum',
    kruimel: [KR_FORUM, [v.titel, '', url]], meta, inhoud, extraCss: VRAAG_CSS,
    /* Voorbeeldvragen zijn fictief: niet in zoekmachines (AFM: niet misleidend), wel deelbaar via LinkedIn. */
    robots: v.voorbeeld ? 'noindex, follow' : ''
  });
}

/* ---------- Statische inhoud van de homepage ----------
 * index.html is een app die zijn inhoud in de browser opbouwt. Tussen de markeringen in <div id="app"> staat een
 * statische versie voor zoekmachines en AI-diensten zonder JavaScript; de app vervangt die bij het laden. */
{
  const B = '<!-- statisch:start (tools/build-static.js) -->', E = '<!-- statisch:eind -->';
  const i = indexHtml.indexOf(B), j = indexHtml.indexOf(E);
  if (i === -1 || j === -1) fout('Markeringen voor de statische homepage ontbreken in index.html');
  const nieuwsteArt = kbSort.slice(0, 8);
  const blok = `${B}
<section class="statisch" aria-label="Adviesforum">
<h1>Adviesforum: voor en door financieel adviseurs</h1>
<p>Collegiale kennisdeling over hypotheken, verzekeringen, pensioen, krediet en compliance. Geen klantadvies.</p>
<ul>
<li><a href="voorwaarden-vergelijker.html">Voorwaarden vergelijken</a>: acceptatievoorwaarden van geldverstrekkers naast elkaar, met bron</li>
<li><a href="kennisbank/">Kennisbank</a>: ${ARTIKELEN.length} artikelen, <a href="faq/">veelgestelde vragen</a> en <a href="begrippen/">${BEGRIPPEN.length} begrippen</a></li>
<li><a href="index.html#hulpmiddelen">Hulpmiddelen</a>: rekenhulpen, klantscans, checklists en naslag</li>
<li><a href="woningtools.html">Woningdata en adviseurstools</a> en <a href="kennispartner.html">Kennispartner worden</a></li>
</ul>
<h2>Nieuw in de kennisbank</h2>
<ul>
${nieuwsteArt.map(a => `<li><a href="kennisbank/${esc(a.id)}.html">${esc(a.titel)}</a></li>`).join('\n')}
</ul>
<h2>Onderwerpen</h2>
<ul>
${kbCats.map(c => `<li><a href="kennisbank/#${esc(c.id)}">${esc(c.naam)}</a> (${ARTIKELEN.filter(a => a.cat === c.id).length})</li>`).join('\n')}
</ul>
<noscript><p>Het forum, zoeken en de hulpmiddelen werken met JavaScript. Zonder JavaScript kun je de kennisbank, de veelgestelde vragen en de begrippen gewoon lezen.</p></noscript>
</section>
${E}`;
  uit['index.html'] = indexHtml.slice(0, i) + blok + indexHtml.slice(j + E.length);
}

/* ---------- llms.txt en llms-full.txt ---------- */
const PAGINAS_LLMS = [
  ['Belangrijkste pagina\'s', [
    ['index.html', 'Forum', 'vragen van adviseurs met antwoorden en beoordelingen van collega\'s (app met hashroutes; de inhoud hieronder staat ook als statische pagina\'s)'],
    ['index.html#hulpmiddelen', 'Hulpmiddelen', 'overzicht van alle rekenhulpen, klantscans, formulieren, naslag en documenten'],
    ['kennisbank/', 'Kennisbank', ARTIKELEN.length + ' artikelen over hypotheken, verzekeringen, pensioen, fiscaal, compliance en adviessoftware'],
    ['faq/', 'FAQ', FAQ.length + ' veelgestelde vragen en antwoorden in ' + themaKeys.length + ' thema\'s'],
    ['begrippen/', 'Begrippen', BEGRIPPEN.length + ' begrippen van A tot Z, kort uitgelegd'],
  ]],
  ['Rekenhulpen en naslag', [
    ['rekentools.html', 'Rekentools', 'honderden losse berekeningen (rente, aflossen, fiscaal, verzekeringen, pensioen)'],
    ['leennormen-2026.html', 'Leennormen 2026', 'maximale hypotheek volgens de financieringslastnormen 2026'],
    ['inkomensbepaling.html', 'Inkomensbepaling', 'toetsinkomen per inkomenssoort (loondienst, flex, ondernemer, uitkering)'],
    ['nhg-check.html', 'NHG-check 2026', 'kostentoets, leningtoets en borgtochtprovisie volgens de NHG-normen 2026'],
    ['acceptatiewijzer.html', 'Acceptatiewijzer', 'aandachtspunten per bijzondere klantsituatie (zzp, flexwerk, expat, scheiding, senioren en meer)'],
    ['wetgeving.html', 'Wet- en regelgeving', 'wetten, besluiten en bronnen voor adviseurs, met wat er verandert in 2026–2027'],
    ['partijen.html', 'Aanbiederwegwijzer', 'geldverstrekkers, verzekeraars en pensioenuitvoerders met portals en voorwaarden'],
    ['woningtools.html', 'Woningdata en adviseurstools', 'Woningcijfer, PandWise, Funderingscijfer, Klimaatcijfer, Hypotheekcijfer, Duurzaamheidsprofiel en Adviseurstools: werking, bronnen en grenzen'],
    ['kennispartner.html', 'Kennispartner worden', 'adviseurs claimen een kennisbankartikel of onderwerp en krijgen na controle een vermelding en een badge'],
    ['adviesroute.html', 'Adviesroute', 'het adviesproces stap voor stap met dossierstukken en aandachtspunten'],
    ['rekentools-blinqx.html', 'Externe rekentools', 'rekentools van een externe partij (Blinqx, via hypotheekbond.nl) voor hypotheek, maandlasten, aflossen, ORV en woningwaarde'],
    ['vergelijken.html', 'Thema\'s naast elkaar', 'kenmerken uit de Aanbiederwegwijzer per thema naast elkaar'],
    ['hypotheekrentetarieven.html', 'Hypotheekrentetarieven', 'actueel renteoverzicht per geldverstrekker, rentevaste periode en risicoklasse (externe bron), met uitleg over wat de hypotheekrente bepaalt'],
    ['voorwaarden.html', 'Voorwaarden van aanbieders', 'gecontroleerde voorwaarden per aanbieder met bron en brondatum'],
    ['kalender.html', 'Kalender', 'belangrijke data en deadlines voor adviseurs'],
    ['levensgebeurtenissen.html', 'Levensgebeurtenissen', 'wegwijzer per levensgebeurtenis met checklist'],
    ['klantuitleg.html', 'Klantuitleg', 'printbare uitleg in eenvoudige taal voor klanten'],
    ['oefenen.html', 'Oefenen', 'oefenvragen voor PE en Wft'],
    ['sjablonen.html', 'Sjablonen', 'mails en brieven voor de advies- en nazorgpraktijk'],
  ]],
  ['Forum', [
    ['aanmelden.html', 'Aanmelden', 'aanmelden als adviseur om vragen te stellen en te beantwoorden'],
    ['privacy.html', 'Privacy', 'privacyverklaring van het forum'],
  ]],
];
let llms = '# ' + SITE + '\n\n> Kennisplatform voor en door financieel adviseurs in Nederland (hypotheken, verzekeringen, pensioen, krediet en compliance): een vragenforum, een kennisbank, een FAQ, een begrippenlijst en rekenhulpen. Collegiale kennisdeling, geen klantadvies.\n\n' +
  'De inhoud is geschreven door en voor adviseurs en is bedoeld als naslag en hulpmiddel in de eigen praktijk. Het is geen advies aan consumenten. Artikelen met de status "Concept" zijn nog niet gecontroleerd door compliance. Bedragen en normen hebben een peildatum; controleer altijd de actuele bron.\n';
for (const [kop, rijen] of PAGINAS_LLMS) {
  const r = rijen.filter(([u]) => /\/$/.test(u) || fs.existsSync(path.join(ROOT, u.split('#')[0])));
  llms += '\n## ' + kop + '\n\n' + r.map(([u, n, t]) => `- [${n}](${BASE}${u}): ${t}`).join('\n') + '\n';
}
llms += '\n## Kennisbank\n\n' + kbCats.map(c => kbSort.filter(a => a.cat === c.id).map(a => `- [${a.titel}](${BASE}kennisbank/${a.id}.html): ${catNaam(c.id)}${a.gecontroleerd ? '' : ' (concept)'}`).join('\n')).join('\n') + '\n';
llms += '\n## Optional\n\n- [Alle kennisbankartikelen als platte tekst](' + BASE + 'llms-full.txt): volledige tekst van de kennisbank in één bestand\n' +
  themaKeys.map(t => faqDelen[t].map((d, j) => `- [FAQ: ${FAQ_THEMAS[t] || t}${faqDelen[t].length > 1 ? ' deel ' + (j + 1) : ''}](${BASE}faq/${d.bestand}): ${d.items.length} vragen`).join('\n')).join('\n') + '\n';
uit['llms.txt'] = llms;

uit['llms-full.txt'] = '# ' + SITE + ' – kennisbank (volledige tekst)\n\n> ' + DISCLAIMER + ' Artikelen met status "concept" zijn nog niet gecontroleerd door compliance.\n\n' +
  kbCats.map(c => kbSort.filter(a => a.cat === c.id).map(a => [
    '---', '', '# ' + a.titel, '',
    'URL: ' + BASE + 'kennisbank/' + a.id + '.html',
    'Categorie: ' + catNaam(a.cat),
    'Gepubliceerd: ' + String(a.datum).slice(0, 10) + (a.bijgewerkt ? ' · Bijgewerkt: ' + String(a.bijgewerkt).slice(0, 10) : '') + (a.peildatum ? ' · Peildatum: ' + a.peildatum : '') + (a.herzienVoor ? ' · Herzien vóór: ' + a.herzienVoor : ''),
    'Status: ' + (a.gecontroleerd ? 'gecontroleerd door compliance' : 'concept, nog niet gecontroleerd door compliance'), '',
    a.body.trim(), '',
    ...(a.links && a.links.length ? ['Bronnen:', ...a.links.map(l => '- ' + l.titel + ': ' + (/^https?:/i.test(l.url) ? l.url : BASE + l.url)), ''] : [])
  ].join('\n')).join('\n')).join('\n');

/* ---------- Schrijven of controleren ---------- */
const GEGENEREERDE_MAPPEN = ['kennisbank', 'faq', 'begrippen', 'vraag'];
function verouderd() { // bestanden in de mappen die niet (meer) gegenereerd worden
  const weg = [];
  for (const m of GEGENEREERDE_MAPPEN) {
    const d = path.join(ROOT, m); if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith('.html') && !uit[m + '/' + f]) weg.push(m + '/' + f);
  }
  return weg;
}
const aantalHtml = Object.keys(uit).filter(p => p.endsWith('.html')).length;

/* sitemap.xml: alle .html in de root en de gegenereerde mappen, behalve noindex en robots.txt-Disallow */
function maakSitemap() {
  const robots = fs.existsSync(path.join(ROOT, 'robots.txt')) ? fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8') : '';
  const verboden = [...robots.matchAll(/^Disallow:\s*(\S+)/gim)].map(m => m[1].replace(/^\/adviesforum\//, '').replace(/^\//, ''));
  const gitDatum = f => { try { return execFileSync('git', ['log', '-1', '--format=%cs', '--', f], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (e) { return ''; } };
  const lastmod = f => gitDatum(f) || fs.statSync(path.join(ROOT, f)).mtime.toISOString().slice(0, 10);
  const datumVan = { 'faq/': FAQ_BESTANDEN, 'begrippen/': ['data/begrippen.js'], 'kennisbank/index.html': KB_BESTANDEN };
  const maxDatum = fs_ => fs_.map(lastmod).sort().pop();
  const kbDatum = Object.fromEntries(ARTIKELEN.map(a => ['kennisbank/' + a.id + '.html', String(a.bijgewerkt || a.datum).slice(0, 10)]));
  const bestanden = [...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')),
    ...GEGENEREERDE_MAPPEN.flatMap(m => fs.existsSync(path.join(ROOT, m)) ? fs.readdirSync(path.join(ROOT, m)).filter(f => f.endsWith('.html')).map(f => m + '/' + f) : [])];
  const urls = [];
  for (const f of bestanden.sort()) {
    if (verboden.includes(f)) continue;
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) continue;
    const loc = f === 'index.html' ? '' : f.replace(/(^|\/)index\.html$/, '$1');
    const mod = kbDatum[f] || vraagDatum[f] || (f.startsWith('faq/') ? maxDatum(datumVan['faq/']) : f.startsWith('begrippen/') ? maxDatum(datumVan['begrippen/']) : f === 'kennisbank/index.html' ? maxDatum(datumVan['kennisbank/index.html']) : lastmod(f));
    urls.push(`  <url><loc>${esc(BASE + loc)}</loc><lastmod>${mod}</lastmod></url>`);
  }
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.join('\n') + '\n</urlset>\n';
}

if (process.argv.includes('--check')) {
  const fouten = Object.keys(uit).filter(p => { const f = path.join(ROOT, p); return !fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== uit[p]; });
  const weg = verouderd();
  if (fouten.length || weg.length) {
    console.error('Statische pagina\'s zijn niet actueel. Draai: node tools/build-static.js');
    if (fouten.length) console.error('  Afwijkend of ontbrekend (' + fouten.length + '): ' + fouten.slice(0, 10).join(', ') + (fouten.length > 10 ? ' …' : ''));
    if (weg.length) console.error('  Overbodig: ' + weg.join(', '));
    process.exit(1);
  }
  console.log('Statische pagina\'s zijn actueel (' + aantalHtml + ' HTML-pagina\'s, waarvan ' + VRAGEN.length + ' deelpagina\'s in vraag/, llms.txt, llms-full.txt).');
} else {
  for (const m of GEGENEREERDE_MAPPEN) fs.mkdirSync(path.join(ROOT, m), { recursive: true });
  for (const f of verouderd()) fs.unlinkSync(path.join(ROOT, f));
  let n = 0;
  for (const [p, inhoud] of Object.entries(uit)) { const f = path.join(ROOT, p); if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== inhoud) { fs.writeFileSync(f, inhoud); n++; } }
  console.log('Geschreven: ' + aantalHtml + ' HTML-pagina\'s (' + ARTIKELEN.length + ' artikelen + overzicht, ' + (Object.keys(uit).filter(p => p.startsWith('faq/')).length) + ' FAQ-pagina\'s, begrippen, ' + VRAGEN.length + ' deelpagina\'s in vraag/), llms.txt en llms-full.txt; ' + n + ' bestand(en) gewijzigd.');
  if (process.argv.includes('--sitemap')) {
    const sm = maakSitemap();
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
    console.log('sitemap.xml geschreven (' + (sm.match(/<url>/g) || []).length + ' URL\'s).');
  }
}
