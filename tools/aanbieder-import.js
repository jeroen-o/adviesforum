#!/usr/bin/env node
/* Publiceert een door een aanbieder ingediende wijziging in data/aanbieders.js.
 *
 * Gebruik (vanuit de map van de repo):
 *   node tools/aanbieder-import.js aanbieder-<id>.json             controleren en verwerken
 *   node tools/aanbieder-import.js aanbieder-<id>.json --dry-run   alleen controleren, niets schrijven
 *   node tools/aanbieder-import.js aanbieder-<id>.json --nieuw     een aanbieder toevoegen die nog niet bestaat
 *   node tools/aanbieder-import.js aanbieder-<id>.json --data pad/naar/aanbieders.js   ander databestand
 *
 * Het JSON-bestand komt uit aanbieder-beheer.html ("Download als bestand"), of plak het JSON-blok uit de
 * mail in een bestand. Het script:
 *   1. valideert met exact dezelfde regels als de beheerpagina (het VALIDATIE-blok uit aanbieder-beheer.html);
 *   2. weigert bij fouten (exit 1) en toont waarschuwingen, bijvoorbeeld voor rentes of acties (AFM);
 *   3. vervangt de aanbieder met hetzelfde id, en neemt daarbij codeHash en demo over uit de bestaande versie
 *      (een aanbieder kan die dus nooit zelf wijzigen). Een onbekend id voegt het alleen toe met --nieuw;
 *      zet daarna een codeHash met beheer-code.html (keuze "Aanbieder");
 *   4. herschrijft alles vanaf de regel die begint met "window.AANBIEDERS=" in het databestand; de commentaarkop blijft staan.
 * Controleer daarna de wijziging met `git diff data/aanbieders.js` en publiceer (commit en push).
 * Geen dependencies.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const vlag = n => args.includes(n);
const optie = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const dataPad = path.resolve(optie('--data') || path.join(ROOT, 'data', 'aanbieders.js'));
const invoer = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--data');
function stop(msg) { console.error('Fout: ' + msg); process.exit(1); }
if (!invoer) stop('geef het JSON-bestand op, bijvoorbeeld: node tools/aanbieder-import.js aanbieder-voorbeeld.json');

/* Validatieregels uit aanbieder-beheer.html halen (één bron van waarheid). */
const beheer = fs.readFileSync(path.join(ROOT, 'aanbieder-beheer.html'), 'utf8');
const m = beheer.match(/\/\* VALIDATIE-BEGIN[^\n]*\n([\s\S]*?)\/\* VALIDATIE-EINDE \*\//);
if (!m) stop('VALIDATIE-blok niet gevonden in aanbieder-beheer.html');
const V = {};
vm.runInNewContext(m[1] + '\n;O.normaliseer=normaliseer;O.valideer=valideer;O.vandaag=vandaag;', { O: V });

/* Invoer lezen. Ook een mailtekst met "--- JSON ... --- einde JSON ---" werkt. */
let tekst;
try { tekst = fs.readFileSync(path.resolve(invoer), 'utf8'); } catch (e) { stop('kan ' + invoer + ' niet lezen'); }
const blok = tekst.match(/--- JSON[^\n]*\n([\s\S]*?)\n--- einde JSON ---/);
let ruw;
try { ruw = JSON.parse(blok ? blok[1] : tekst); } catch (e) { stop('geen geldige JSON: ' + e.message); }
if (!ruw || typeof ruw !== 'object' || Array.isArray(ruw)) stop('verwacht één aanbieder-object');
const onbekend = Object.keys(ruw).filter(k => !['id', 'naam', 'type', 'initialen', 'kleur', 'omschrijving', 'website', 'extranet', 'contact', 'documenten', 'richtlijnen', 'nieuws', 'elearning', 'bijgewerkt', 'codeHash', 'demo'].includes(k));
if (onbekend.length) console.warn('Let op: onbekende velden genegeerd: ' + onbekend.join(', '));
if ('codeHash' in ruw || 'demo' in ruw) console.warn('Let op: codeHash/demo in de invoer worden genegeerd.');

const nieuw = V.normaliseer(ruw);
if (!/^\d{4}-\d{2}-\d{2}$/.test(nieuw.bijgewerkt)) nieuw.bijgewerkt = V.vandaag();
const r = V.valideer(nieuw);
for (const w of r.waarschuwingen) console.warn('Waarschuwing: ' + w.msg);
if (r.fouten.length) { for (const f of r.fouten) console.error('  - ' + f.msg); stop(r.fouten.length + ' validatiefout(en); niets gewijzigd.'); }

/* Databestand laden. */
const bron = fs.readFileSync(dataPad, 'utf8');
const pos = bron.search(/^window\.AANBIEDERS=/m);
if (pos < 0) stop('"window.AANBIEDERS=" niet gevonden in ' + dataPad);
const ctx = { window: {} };
vm.runInNewContext(bron, ctx);
const lijst = ctx.window.AANBIEDERS;
if (!Array.isArray(lijst)) stop('window.AANBIEDERS is geen lijst in ' + dataPad);

const i = lijst.findIndex(a => a && a.id === nieuw.id);
let uit;
if (i >= 0) {
  const oud = lijst[i];
  uit = Object.assign({ id: nieuw.id }, oud.demo ? { demo: true } : {}, nieuw, oud.codeHash ? { codeHash: oud.codeHash } : {});
  lijst[i] = uit;
  console.log('Vervangen: ' + nieuw.naam + ' (' + nieuw.id + ')');
} else {
  if (!vlag('--nieuw')) stop('id "' + nieuw.id + '" bestaat nog niet. Gebruik --nieuw om de aanbieder toe te voegen.');
  uit = Object.assign({ id: nieuw.id, demo: false }, nieuw);
  lijst.push(uit);
  console.log('Toegevoegd: ' + nieuw.naam + ' (' + nieuw.id + '). Zet nog een codeHash via beheer-code.html als de aanbieder moet kunnen inloggen.');
}
console.log('  ' + ['nieuws', 'documenten', 'richtlijnen', 'contact', 'elearning'].map(k => k + ' ' + uit[k].length).join(', ') + ', bijgewerkt ' + uit.bijgewerkt);

if (vlag('--dry-run')) { console.log('Dry-run: niets geschreven.'); process.exit(0); }
const resultaat = bron.slice(0, pos) + 'window.AANBIEDERS=' + JSON.stringify(lijst, null, 2) + ';\n';
/* Controle: het nieuwe bestand moet zelf weer laden. */
const test = { window: {} };
vm.runInNewContext(resultaat, test);
if (!Array.isArray(test.window.AANBIEDERS) || test.window.AANBIEDERS.length !== lijst.length) stop('controle van het nieuwe bestand mislukt; niets geschreven.');
fs.writeFileSync(dataPad, resultaat);
console.log('Geschreven: ' + path.relative(process.cwd(), dataPad) + '. Controleer met git diff en publiceer.');
