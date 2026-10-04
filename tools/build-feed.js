#!/usr/bin/env node
/* Ontwikkeltool: maakt de RSS 2.0-feeds van het Adviesforum. Geen dependencies.
 *
 *   node tools/build-feed.js            schrijft feed.xml en aanbieders-feed.xml
 *   node tools/build-feed.js --check    controleert alleen of beide bestanden actueel zijn (exit 1 als niet)
 *
 * feed.xml            de nieuwste 50 items uit de wijzigingenlijst (var L in nieuw.html) en de
 *                     kennisbankartikelen (data/kennisbank*.js, in de volgorde van de scripttags in index.html),
 *                     samen gesorteerd op datum.
 * aanbieders-feed.xml alle nieuwsberichten uit data/aanbieders.js van aanbieders met demo:false.
 * voorwaarden-feed.xml wijzigingen in de gecontroleerde voorwaarden (data/voorwaarden-wijzigingen.js), één item per
 *                     geldverstrekker per dag.
 *                     Zijn die er niet, dan is het een geldige lege feed met uitleg in de beschrijving.
 *
 * De lijst L blijft in nieuw.html staan (daar wordt hij beheerd); dit script leest hem uit door het
 * letterlijke array "var L=[ ... ];" te evalueren in een lege sandbox en controleert elk item.
 * De uitvoer hangt alleen af van de data (niet van de datum van vandaag), zodat --check stabiel is.
 * Datums zonder tijd krijgen 12:00 uur; alle tijden gelden als Nederlandse tijd (CET/CEST).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://jeroen-o.github.io/adviesforum/';
const MAX_ITEMS = 50;

function fout(msg) { console.error('build-feed: ' + msg); process.exit(1); }
const lees = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- Bronnen ---------- */
const indexHtml = lees('index.html');
const nieuwHtml = lees('nieuw.html');

function uitIndex(naam) {
  const m = indexHtml.match(new RegExp('const ' + naam + '=([\\[{][\\s\\S]*?[\\]}]);\\n'));
  if (!m) fout('kon ' + naam + ' niet vinden in index.html');
  return vm.runInNewContext('(' + m[1] + ')');
}
/* Leest "var NAAM=<literal>;" uit nieuw.html. Het literal eindigt op de eerste regel die met "];" of "};" begint
 * (L) of op de eerste "};" (TH, op één regel). */
function uitNieuw(naam, afsluiter) {
  const start = nieuwHtml.indexOf('var ' + naam + '=');
  if (start < 0) fout('kon "var ' + naam + '=" niet vinden in nieuw.html');
  const van = start + ('var ' + naam + '=').length;
  const eind = nieuwHtml.indexOf(afsluiter, van);
  if (eind < 0) fout('kon het einde van ' + naam + ' niet vinden in nieuw.html');
  try { return vm.runInNewContext('(' + nieuwHtml.slice(van, eind + afsluiter.length - 1) + ')', {}, { timeout: 1000 }); }
  catch (e) { fout(naam + ' in nieuw.html is geen geldig literal: ' + e.message); }
}
function laadData(bestanden) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const b of bestanden) vm.runInContext(lees(b), sandbox, { filename: b, timeout: 5000 });
  return sandbox.window;
}

const CATS = uitIndex('CATS');
const catNaam = id => (CATS.find(c => c.id === id) || {}).naam || id;
const TH = uitNieuw('TH', '};');
const L = uitNieuw('L', '\n];');
if (!Array.isArray(L) || !L.length) fout('de lijst L in nieuw.html is leeg');
L.forEach((x, i) => {
  if (!x || !/^\d{4}-\d{2}-\d{2}$/.test(x.d) || !x.t || !x.x || !x.u) fout('item ' + (i + 1) + ' in L (nieuw.html) mist d (JJJJ-MM-DD), t, x of u: ' + JSON.stringify(x).slice(0, 120));
});

const KB_BESTANDEN = [...indexHtml.matchAll(/<script\s+src="(data\/kennisbank[^"]*\.js)"/g)].map(m => m[1]);
if (!KB_BESTANDEN.length) fout('geen data/kennisbank*.js scripts gevonden in index.html');
const ARTIKELEN = laadData(KB_BESTANDEN).KENNISBANK || [];
if (!ARTIKELEN.length) fout('de kennisbank is leeg');
const AANBIEDERS = laadData(['data/aanbieders.js']).AANBIEDERS || [];

/* ---------- Hulpfuncties ---------- */
const xml = s => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const absoluut = u => /^https?:\/\//.test(u) ? u : BASE + String(u).replace(/^\.?\//, '');
/* Platte tekst: '## ' koppen en '- ' opsommingen weg, witruimte samenvoegen, afkappen op een woordgrens */
function kort(t, max = 300) {
  const s = String(t || '').split('\n').map(l => l.replace(/^## /, '').replace(/^- /, '').replace(/^\d+\. /, '')).join(' ').replace(/\s+/g, ' ').trim();
  return s.length <= max ? s : s.slice(0, max).replace(/\s+\S*$/, '') + '…';
}
/* Laatste zondag van een maand (UTC-datum) */
function laatsteZondag(jaar, maand) { const d = new Date(Date.UTC(jaar, maand + 1, 0)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d.getUTCDate(); }
/* 'JJJJ-MM-DD' of 'JJJJ-MM-DDTUU:MM(:SS)' in Nederlandse tijd -> RFC 822-datum met +0100/+0200 */
function rfc822(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(String(iso || ''));
  if (!m) return null;
  const [j, mn, d, u, mi, s] = [+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 12, m[5] ? +m[5] : 0, m[6] ? +m[6] : 0];
  const zomer = (mn > 2 && mn < 9) || (mn === 2 && d >= laatsteZondag(j, 2)) || (mn === 9 && d < laatsteZondag(j, 9));
  const dag = new Date(Date.UTC(j, mn, d));
  const p2 = n => String(n).padStart(2, '0');
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dag.getUTCDay()] + ', ' + p2(d) + ' ' +
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][mn] + ' ' + j + ' ' +
    p2(u) + ':' + p2(mi) + ':' + p2(s) + (zomer ? ' +0200' : ' +0100');
}
const sorteerSleutel = iso => { const m = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}(?::\d{2})?))?/.exec(String(iso || '')); return m ? m[1] + 'T' + (m[2] || '12:00').padEnd(8, ':00').slice(0, 8) : ''; };

function itemXml(it) {
  return '    <item>\n' +
    '      <title>' + xml(it.titel) + '</title>\n' +
    '      <link>' + xml(it.link) + '</link>\n' +
    '      <guid isPermaLink="' + (it.permalink ? 'true' : 'false') + '">' + xml(it.guid) + '</guid>\n' +
    '      <pubDate>' + it.pubDate + '</pubDate>\n' +
    (it.categorie ? '      <category>' + xml(it.categorie) + '</category>\n' : '') +
    '      <description>' + xml(it.beschrijving) + '</description>\n' +
    '    </item>\n';
}
function feedXml(kanaal, items) {
  const laatste = items.length ? items[0].pubDate : null;
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!-- GEGENEREERD door tools/build-feed.js – niet met de hand bewerken. -->\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '  <channel>\n' +
    '    <title>' + xml(kanaal.titel) + '</title>\n' +
    '    <link>' + xml(kanaal.link) + '</link>\n' +
    '    <atom:link href="' + xml(kanaal.self) + '" rel="self" type="application/rss+xml"/>\n' +
    '    <description>' + xml(kanaal.beschrijving) + '</description>\n' +
    '    <language>nl-NL</language>\n' +
    (laatste ? '    <lastBuildDate>' + laatste + '</lastBuildDate>\n' : '') +
    '    <docs>https://www.rssboard.org/rss-specification</docs>\n' +
    '    <ttl>360</ttl>\n' +
    items.map(itemXml).join('') +
    '  </channel>\n' +
    '</rss>\n';
}

/* ---------- feed.xml ---------- */
const uitLijst = L.map((x, i) => ({
  titel: x.t, link: absoluut(x.u), guid: 'adviesforum-nieuw-' + x.d + '-' + slug(x.t), permalink: false,
  pubDate: rfc822(x.d), sleutel: sorteerSleutel(x.d), volg: i,
  categorie: TH[x.th] || 'Nieuw op het forum', beschrijving: x.x,
}));
const uitKb = ARTIKELEN.filter(a => a && a.id && rfc822(a.bijgewerkt || a.datum)).map((a, i) => {
  const d = a.bijgewerkt || a.datum, link = BASE + 'kennisbank/' + encodeURIComponent(a.id) + '.html';
  return {
    titel: (a.bijgewerkt ? 'Kennisbank bijgewerkt: ' : 'Kennisbank: ') + a.titel, link, guid: link + (a.bijgewerkt ? '#' + String(a.bijgewerkt).slice(0, 10) : ''), permalink: !a.bijgewerkt,
    pubDate: rfc822(d), sleutel: sorteerSleutel(d), volg: L.length + i, categorie: 'Kennisbank · ' + catNaam(a.cat),
    beschrijving: kort(a.body) + (a.gecontroleerd ? ' (Gecontroleerd door compliance.)' : ' (Concept: nog niet gecontroleerd door compliance; gebruik het als collegiale tip.)'),
  };
});
const alles = [...uitLijst, ...uitKb].sort((a, b) => b.sleutel.localeCompare(a.sleutel) || a.volg - b.volg).slice(0, MAX_ITEMS);
const feed = feedXml({
  titel: 'Adviesforum – nieuw en bijgewerkt', link: BASE + 'nieuw.html', self: BASE + 'feed.xml',
  beschrijving: 'Nieuwe onderdelen, rekentools en kennisbankartikelen op het Adviesforum, een platform voor en door financieel adviseurs. Collegiale kennisdeling, geen advies aan klanten.',
}, alles);

/* ---------- aanbieders-feed.xml ---------- */
const echt = AANBIEDERS.filter(a => a && a.demo === false);
const nieuws = echt.flatMap(a => (a.nieuws || []).filter(n => n && n.id && n.titel && rfc822(n.datum)).map(n => {
  const link = BASE + 'aanbieders.html#nieuws-' + a.id + '-' + n.id;
  return {
    titel: a.naam + ': ' + n.titel, link, guid: link, permalink: true, pubDate: rfc822(n.datum), sleutel: sorteerSleutel(n.datum), volg: 0,
    categorie: a.naam, beschrijving: kort(n.tekst, 600) + (n.url ? ' Meer informatie: ' + n.url : '') + ' (Bericht van de aanbieder; het Adviesforum toetst de inhoud niet.)',
  };
})).sort((a, b) => b.sleutel.localeCompare(a.sleutel) || a.titel.localeCompare(b.titel, 'nl'));
const aanbFeed = feedXml({
  titel: 'Adviesforum – nieuws van aanbieders', link: BASE + 'aanbieders.html', self: BASE + 'aanbieders-feed.xml',
  beschrijving: nieuws.length
    ? 'Nieuwsberichten die geldverstrekkers, verzekeraars en andere aanbieders zelf op het Adviesforum plaatsen. Het forum toetst de inhoud niet.'
    : 'Nieuwsberichten die aanbieders zelf op het Adviesforum plaatsen. Er staan nog geen berichten van echte aanbieders in: de huidige aanbiederspagina’s zijn fictieve voorbeelden en komen niet in deze feed. Zodra een aanbieder nieuws publiceert, verschijnt het hier.',
}, nieuws);

/* ---------- voorwaarden-feed.xml ---------- */
const WZ = (laadData(['data/voorwaarden-wijzigingen.js']).VOORWAARDEN_WIJZIGINGEN || { items: [] }).items || [];
const SOORT = { gewijzigd: 'gewijzigd', nieuw: 'nieuw ingevuld', geverifieerd: 'geverifieerd', vervallen: 'vervallen', eerste: 'eerste controle' };
const slugNL = n => String(n || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'partij';
const vvHtml = lees('voorwaarden-vergelijker.html');
const CRIT_NAAM = {};
for (const m of vvHtml.matchAll(/\{\s*"?id"?\s*:\s*['"]([a-z0-9]+)['"]\s*,\s*"?cat"?\s*:\s*['"][A-Z]['"]\s*,\s*"?naam"?\s*:\s*['"]([^'"]+)['"]/g)) CRIT_NAAM[m[1]] = m[2];
const wGroepen = [];
WZ.forEach(i => {
  let g = wGroepen.find(x => x.d === i.d && x.naam === i.naam);
  if (!g) { g = { d: i.d, naam: i.naam, items: [] }; wGroepen.push(g); }
  g.items.push(i);
});
const wItems = wGroepen.filter(g => rfc822(g.d)).map(g => {
  const link = BASE + 'voorwaarden-vergelijker.html#vergelijk=' + slugNL(g.naam);
  const regels = g.items.map(i => i.soort === 'eerste' ? 'Eerste controle: ' + i.aantal + ' voorwaarden.' : ((CRIT_NAAM[i.crit] || i.crit) + ' (' + SOORT[i.soort] + '): ' + String(i.soort === 'vervallen' ? i.oud : i.nieuw).replace(/^[+~!-]\s*/, '')));
  return {
    titel: 'Voorwaarden ' + g.naam + ': ' + g.items.length + (g.items.length === 1 ? ' wijziging' : ' wijzigingen'),
    link, guid: link + '&d=' + g.d, permalink: false, pubDate: rfc822(g.d), sleutel: sorteerSleutel(g.d), volg: 0, categorie: g.naam,
    beschrijving: kort(regels.join(' · '), 900) + ' (Gecontroleerde voorwaarden; geen advies, controleer altijd de actuele gids van de geldverstrekker.)',
  };
}).sort((a, b) => b.sleutel.localeCompare(a.sleutel) || a.titel.localeCompare(b.titel, 'nl')).slice(0, MAX_ITEMS);
const wFeed = feedXml({
  titel: 'Adviesforum – wijzigingen in voorwaarden geldverstrekkers', link: BASE + 'voorwaarden-vergelijker.html', self: BASE + 'voorwaarden-feed.xml',
  beschrijving: 'Wijzigingen in de online gecontroleerde hypotheekvoorwaarden per geldverstrekker. Geen rentes, geen advies.',
}, wItems);

/* ---------- Schrijven of controleren ---------- */
const uit = { 'feed.xml': feed, 'aanbieders-feed.xml': aanbFeed, 'voorwaarden-feed.xml': wFeed };
const samenvatting = 'feed.xml: ' + alles.length + ' items (' + alles.filter(x => x.volg < L.length).length + ' uit nieuw.html, ' + alles.filter(x => x.volg >= L.length).length + ' kennisbank); aanbieders-feed.xml: ' + nieuws.length + ' items';
if (process.argv.includes('--check')) {
  const afwijkend = Object.keys(uit).filter(p => { const f = path.join(ROOT, p); return !fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== uit[p]; });
  if (afwijkend.length) { console.error('Feeds zijn niet actueel (' + afwijkend.join(', ') + '). Draai: node tools/build-feed.js'); process.exit(1); }
  console.log('Feeds zijn actueel. ' + samenvatting + '.');
} else {
  let n = 0;
  for (const [p, inhoud] of Object.entries(uit)) { const f = path.join(ROOT, p); if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== inhoud) { fs.writeFileSync(f, inhoud); n++; } }
  console.log('Geschreven: ' + samenvatting + '; ' + n + ' bestand(en) gewijzigd.');
}
