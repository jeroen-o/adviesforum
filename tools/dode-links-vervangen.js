#!/usr/bin/env node
/*
 * Vervangt dode links (uit docs/dode-links-archief.tsv, gemaakt door de workflow Dode links opzoeken) in de bronbestanden.
 *  - Onderzoeksbestanden van de voorwaarden (docs/*-onderzoek): archiefversie als die van 2025 of later is, anders
 *    valt de bron weg. Houdt een waarde geen eigen bron over, dan maakt de generator er 'nog niet geverifieerd' van.
 *  - Overige data: archiefversie als die bestaat; anders verdwijnt de link, of de bewering die alleen op die link steunde.
 * Er wordt niets verzonnen: geen nieuwe bronnen, alleen archiefkopieën van dezelfde pagina.
 * Daarna de generatoren opnieuw draaien (verwerk.js, productvoorwaarden.js, situatiecheck.js, enz.).
 *
 *   node tools/dode-links-vervangen.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIN_ARCHIEF = '20250101';

const regels = fs.readFileSync(path.join(ROOT, 'docs', 'dode-links-archief.tsv'), 'utf8').split('\n').filter(Boolean).map(r => r.split('\t'));
const dood = regels.filter(([st]) => !/^[23]\d\d$/.test(st)).map(([, url, ar]) => ({ url, ar: ar && ar !== '-' ? ar : null, ts: ar && ar !== '-' ? (/\/web\/(\d{8})/.exec(ar) || [])[1] : null }));

const GEGENEREERD = new Set(['voorwaarden-controle.js', 'productvoorwaarden.js', 'situatiecheck.js', 'voorwaarden-zoek.js', 'voorwaarden-kwaliteit.js', 'voorwaarden-wijzigingen.js', 'productvoorwaarden-wijzigingen.js', 'voorwaarden-verouderd.js', 'rekentools-index.js']);
const lijst = d => fs.existsSync(path.join(ROOT, d)) ? fs.readdirSync(path.join(ROOT, d)).map(f => path.join(d, f)) : [];
const onderzoek = [...lijst('docs/voorwaarden-onderzoek'), ...lijst('docs/productvoorwaarden-onderzoek')].filter(f => f.endsWith('.json'));
const data = [...lijst('data').filter(f => f.endsWith('.js') && !GEGENEREERD.has(path.basename(f))), ...lijst('data/faq').filter(f => f.endsWith('.js')), 'wetgeving.html'];

const log = { archief: 0, weg: 0, open: [] };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Onderzoeksbestanden: JSON, tekstueel bewerkt zodat de opmaak blijft staan. Alleen elementen van bron-lijsten. */
for (const f of onderzoek) {
  const p = path.join(ROOT, f);
  let t = fs.readFileSync(p, 'utf8'); const oud = t;
  for (const d of dood) {
    if (!t.includes('"' + d.url + '"')) continue;
    const u = esc(d.url);
    if (d.ar && d.ts >= MIN_ARCHIEF) { t = t.split('"' + d.url + '"').join('"' + d.ar + '"'); log.archief++; continue; }
    // documentlink ("titel" + "url"): archiefversie van elke datum, anders valt het document weg
    if (d.ar) t = t.replace(new RegExp('("url":\\s*)"' + u + '"', 'g'), (m, k) => k + '"' + d.ar + '"');
    else t = t.replace(new RegExp(',?\\s*\\{\\s*"titel":\\s*"[^"]*",\\s*"url":\\s*"' + u + '"(?:,\\s*"versie":\\s*(?:"[^"]*"|null))?\\s*\\}', 'g'), '');
    // website van een aanbieder: beginpagina van hetzelfde domein
    t = t.replace(new RegExp('("url":\\s*)"' + u + '"', 'g'), (m, k) => k + '"' + new URL(d.url).origin + '/"');
    t = t.replace(new RegExp(',\\s*"' + u + '"(?=\\s*\\])', 'g'), '');
    t = t.replace(new RegExp('(?<=[\\[,]\\s*)"' + u + '"\\s*,\\s*', 'g'), '');
    t = t.replace(new RegExp('\\[\\s*"' + u + '"\\s*\\]', 'g'), '[]');
    log.weg++;
    if (t.includes('"' + d.url + '"')) log.open.push(f + ': ' + d.url);
  }
  if (t !== oud) { JSON.parse(t); fs.writeFileSync(p, t); }
}

/* Overige data: tekstueel */
for (const f of data) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, 'utf8'); const oud = t;
  for (const d of dood) {
    const u = esc(d.url);
    if (!t.includes(d.url)) continue;
    if (d.ar) {
      const voor = t;
      t = t.replace(new RegExp("(['\"])" + u + "\\1", 'g'), (m, q) => q + d.ar + q);
      if (t !== voor) log.archief++;
      continue;
    }
    const voor = t;
    // {titel:'..',url:'URL'} uit een links-lijst
    t = t.replace(new RegExp("\\{\\s*titel:'[^']*',\\s*url:'" + u + "'\\s*\\},?", 'g'), '');
    // bewering met alleen deze bron: {thema:'..',tekst:'..',bron:'URL'} of {tekst:'..',bron:'URL'}
    t = t.replace(new RegExp("\\n?\\s*\\{(?:thema:'[^']*',\\s*)?tekst:'(?:[^'\\\\]|\\\\.)*',\\s*bron:'" + u + "'\\s*\\},?", 'g'), '');
    // toezichtBron
    t = t.replace(new RegExp(",?\\s*\"toezichtBron\":\\s*\"" + u + "\"", 'g'), '');
    t = t.replace(new RegExp("toezichtBron:'" + u + "',?", 'g'), '');
    // element in een lijst (contactbronnen, bronnen)
    t = t.replace(new RegExp(",\\s*([\"'])" + u + "\\1(?=\\s*\\])", 'g'), '');
    t = t.replace(new RegExp("(?<=[\\[,]\\s*)([\"'])" + u + "\\1\\s*,\\s*", 'g'), '');
    t = t.replace(new RegExp("\\[\\s*([\"'])" + u + "\\1\\s*\\]", 'g'), '[]');
    // bron van een FAQ-item: veld weghalen (het antwoord blijft, zonder bronlink)
    t = t.replace(new RegExp(",bron:'" + u + "'", 'g'), '');
    // website van een partij: beginpagina van hetzelfde domein
    t = t.replace(new RegExp("url:'" + u + "'", 'g'), () => "url:'" + new URL(d.url).origin + "/'");
    if (t !== voor) log.weg++;
    if (new RegExp("['\"]" + u + "['\"]").test(t)) log.open.push(f + ': ' + d.url);
  }
  if (t !== oud) fs.writeFileSync(p, t);
}
console.log(`Archiefversie: ${log.archief}, weggehaald: ${log.weg}.`);
if (log.open.length) { console.log('Nog met de hand:'); log.open.forEach(x => console.log('  ' + x)); }
