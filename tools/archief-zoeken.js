#!/usr/bin/env node
/*
 * Zoekt voor elke link in docs/dode-links.txt de archiefversie in het Internet Archive (Wayback Machine), zo dicht
 * mogelijk bij de controledatum, en controleert of de oorspronkelijke link echt niet meer werkt.
 * Draait in GitHub Actions (workflow Dode links opzoeken), omdat de ontwikkelomgeving geen toegang tot internet heeft.
 * Uitvoer per regel (tab-gescheiden): status-origineel, oorspronkelijke url, archief-url of '-'.
 *
 *   node tools/archief-zoeken.js [JJJJMMDD]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const datum = process.argv[2] || '20261001';
const links = fs.readFileSync(path.join(__dirname, '..', 'docs', 'dode-links.txt'), 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
const wacht = ms => new Promise(r => setTimeout(r, ms));

async function status(u) {
  try { const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Mozilla/5.0 (linkcontrole adviesforum)' } }); return r.status; }
  catch (e) { return 'fout'; }
}
async function archief(u) {
  for (let poging = 0; poging < 3; poging++) {
    try {
      const r = await fetch('https://archive.org/wayback/available?timestamp=' + datum + '&url=' + encodeURIComponent(u), { signal: AbortSignal.timeout(30000) });
      const j = await r.json();
      const s = j && j.archived_snapshots && j.archived_snapshots.closest;
      return s && s.available && String(s.status) === '200' ? s.url.replace(/^http:/, 'https:') : '-';
    } catch (e) { await wacht(3000 * (poging + 1)); }
  }
  return '-';
}
(async () => {
  for (const u of links) {
    const [st, ar] = await Promise.all([status(u), archief(u)]);
    console.log([st, u, ar].join('\t'));
    await wacht(1500);
  }
})();
