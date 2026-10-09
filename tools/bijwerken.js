#!/usr/bin/env node
/*
 * Eén commando voor het bijwerken van alle gegenereerde bestanden, in de juiste volgorde.
 *
 *   npm run bijwerken             alle generators (na een wijziging in data/ of docs/)
 *   npm run bijwerken -- --log    daarna ook de wijzigingslogs en de feed (draai dit NA de commit:
 *                                 de logs lezen de git-geschiedenis), en commit opnieuw
 *   npm run controle              alleen controleren (--check van elke tool), wijzigt niets
 *
 * Daarna: npx playwright test.
 */
'use strict';
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const check = process.argv.includes('--check');
const log = process.argv.includes('--log');

/* Volgorde telt: latere stappen lezen de uitvoer van eerdere. */
const STAPPEN = [
  ['docs/voorwaarden-onderzoek/verwerk.js', ['docs/voorwaarden-onderzoek'], 'voorwaarden uit het onderzoek (data/voorwaarden-controle.js)', false],
  ['tools/productvoorwaarden.js', [], 'productvoorwaarden', true],
  ['tools/wegwijzer-voorwaarden.js', [], 'voorwaarden in de aanbiederwegwijzer', true],
  ['tools/situatiecheck.js', [], 'situatiecheck', true],
  ['tools/voorwaarden-kwaliteit.js', [], 'kwaliteitscijfers voorwaarden', true],
  ['tools/voorwaarden-zoek.js', [], 'zoekindex voorwaarden', true],
  ['tools/bronnen-lijst.js', [], 'lijst met bronlinks', true],
  ['tools/build-rekentools-index.js', [], 'zoekcatalogus rekentools', true],
  ['tools/kennispartners.js', [], 'kennispartner-badges', true],
  ['tools/sitenav.js', [], 'menubalk, voettekst en gestructureerde data', true],
  ['tools/paginas-index.js', [], "zoekindex pagina's", true],
  ['tools/build-static.js', [], "statische pagina's, homepage-inhoud en llms.txt", true],
  ['tools/build-static.js', ['--sitemap'], 'sitemap.xml', false],
];
const LOGS = [
  ['tools/voorwaarden-wijzigingen.js', [], 'wijzigingslog voorwaarden', true],
  ['tools/productvoorwaarden-wijzigingen.js', [], 'wijzigingslog productvoorwaarden', true],
  ['tools/build-feed.js', [], 'RSS-feeds', true],
];

let fout = 0;
for (const [script, args, wat, heeftCheck] of [...STAPPEN, ...(log || check ? LOGS : [])]) {
  if (!fs.existsSync(path.join(ROOT, script))) continue;
  if (check && !heeftCheck) continue;
  const a = check ? [...args, '--check'] : args;
  try {
    const uit = execFileSync(process.execPath, [script, ...a], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    console.log(`✓ ${wat}: ${uit.trim().split('\n').pop()}`);
  } catch (e) {
    fout++;
    console.error(`✗ ${wat} (${script}): ${String(e.stderr || e.stdout || e.message).trim().split('\n').pop()}`);
    if (!check) process.exit(1);
  }
}
if (fout) { console.error(`\n${fout} controle(s) niet actueel. Draai: npm run bijwerken`); process.exit(1); }
console.log(check ? '\nAlles is actueel.' : `\nKlaar. Draai nu: npx playwright test${log ? '' : '  (en na de commit: npm run bijwerken -- --log)'}`);
