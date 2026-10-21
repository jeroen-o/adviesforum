#!/usr/bin/env node
/*
 * Bouwt regelgeving.json: wet- en regelgeving en normen als gestructureerde data, voor programmeurs en AI-tools
 * (zie mcp/adviesforum-regelgeving en docs/mcp-regelgeving.md). Dit bestand is dezelfde data als op de site, niet een tweede bron:
 *   - fiscale en sociale normen: js/rekentools/normen.js (met bron en controlestatus per onderwerp);
 *   - NHG-grenzen 2026: Voorwaarden & Normen NHG 2026, onderdeel C.2 (zie nhg-check.html en documenten/).
 * Elk onderwerp heeft een id, waarden, peildatum, controlestatus en bronnen. Geen advies; controleer altijd de bron.
 *
 *   node tools/regelgeving.js           schrijft regelgeving.json
 *   node tools/regelgeving.js --check   controleert of regelgeving.json actueel is
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const UIT = path.join(ROOT, 'regelgeving.json');

const RT = { add() {} };
global.window = { RT };
try { new Function('RT', fs.readFileSync(path.join(ROOT, 'js/rekentools/normen.js'), 'utf8'))(RT); } catch (e) { /* de normen worden vóór RT.add gezet */ }
const N = RT.normen;
if (!N || !N.box1) { console.error('normen.js niet te lezen'); process.exit(1); }

const NAMEN = {
  box1: 'Inkomstenbelasting box 1: schijven en tarieven', ahk: 'Algemene heffingskorting', arbeidskorting: 'Arbeidskorting', iack: 'Inkomensafhankelijke combinatiekorting',
  ouderenkorting: 'Ouderenkorting', aftrekTariefMax: 'Maximaal aftrektarief', bijzondereBeloningMax: 'Bijzondere beloningen (maximum)', eigenWoning: 'Eigenwoningforfait en Hillen',
  ovb: 'Overdrachtsbelasting', box2: 'Box 2', box3: 'Box 3', vpb: 'Vennootschapsbelasting', ondernemer: 'Ondernemersaftrek en MKB-winstvrijstelling', werkgever: 'Werkgeverspremies',
  minimumloon: 'Wettelijk minimumloon', aow: 'AOW-bedragen', bijstand: 'Bijstandsnormen', schenkErf: 'Schenk- en erfbelasting (vrijstellingen en tarieven)', wia: 'WIA (UWV)', ww: 'WW', anw: 'Anw', wlz: 'Wlz-eigen bijdrage',
};
const BRON_NHG = [
  { titel: 'Voorwaarden & Normen NHG 2026, onderdeel C.2', url: 'https://adviesforum.nl/documenten/nhg-voorwaarden-normen-2026.pdf' },
  { titel: 'NHG-check 2026 (Adviesforum)', url: 'https://adviesforum.nl/nhg-check.html' },
];

const onderwerpen = [
  {
    id: 'nhg.grens-2026',
    onderwerp: 'NHG-grens 2026',
    domein: 'hypotheek',
    waarden: { kostengrens: 470000, extraEnergiebesparendeVoorzieningen: 28200, kostengrensMetEnergiebesparendeVoorzieningen: 498200, eenheid: 'euro' },
    ingangsdatum: '2026-01-01',
    status: 'overgenomen uit de Voorwaarden & Normen NHG 2026 (C.2, C.2.2.1, C.2.2.2)',
    bronnen: BRON_NHG,
    toelichting: 'Voor een aankoop (bestaande bouw en nieuwbouw) geldt de kostengrens; leningen boven de grens zijn alleen voor extra energiebesparende voorzieningen tot het genoemde maximum. Controleer de actuele V&N voor de uitwerking.',
  },
  {
    id: 'nhg.financieringslasttabel-beheer-2026',
    onderwerp: 'NHG financieringslasttabel beheer 2026',
    domein: 'hypotheek',
    waarden: { verwijzing: 'data/nhg-beheer-financieringslast-2026.js', gebruik: 'alleen voor de NHG-beheercriteria (beheertoets), niet voor de acceptatietoets' },
    ingangsdatum: '2026-01-01',
    status: 'overgenomen uit bijlage 5 bij de V&N NHG 2026 (versie 2)',
    bronnen: [{ titel: 'NHG-bijlage 5 financieringslasttabel beheer', url: 'https://adviesforum.nl/data/nhg-beheer-financieringslast-2026.js' }],
    toelichting: 'De volledige tabel staat in het genoemde databestand en op de pagina Leennormen 2026.',
  },
];
for (const k of Object.keys(NAMEN)) {
  if (!N[k]) continue;
  onderwerpen.push({
    id: 'fiscaal.' + k,
    onderwerp: NAMEN[k],
    domein: ['wia', 'ww', 'anw', 'aow', 'minimumloon', 'bijstand', 'wlz'].includes(k) ? 'sociale zekerheid' : 'fiscaal',
    waarden: N[k],
    peildatum: N.peildatum,
    status: (N._geverifieerd && N._geverifieerd[k]) || 'niet bevestigd',
    gecontroleerdOp: N._verificatiedatum,
    bronnengroep: 'fiscaal-sociaal',
    toelichting: 'Percentages staan als percentage (35,75 = 35,75%). Bedragen in euro per jaar tenzij anders vermeld.',
  });
}

const uit = {
  naam: 'Adviesforum regelgeving en normen',
  versie: 1,
  peildatum: N.peildatum,
  gecontroleerdOp: N._verificatiedatum,
  bron: 'https://adviesforum.nl/',
  licentie: 'Gebruik vrij met bronvermelding; controleer altijd de officiële bron en geef geen advies op basis van alleen dit bestand.',
  let_op: 'Gegevens kunnen veranderen; onderwerpen met een status anders dan "bevestigd" zijn niet volledig gecontroleerd. Dit bestand is geen advies.',
  bronnengroepen: { 'fiscaal-sociaal': N._bronnen.map(u => ({ titel: u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0], url: u })) },
  onderwerpen,
};
const tekst = JSON.stringify(uit, null, 1) + '\n';
if (process.argv.includes('--check')) {
  const huidig = fs.existsSync(UIT) ? fs.readFileSync(UIT, 'utf8') : '';
  if (huidig !== tekst) { console.error('regelgeving.json is niet actueel. Draai: npm run bijwerken'); process.exit(1); }
  console.log(`regelgeving.json is actueel (${onderwerpen.length} onderwerpen)`);
} else {
  fs.writeFileSync(UIT, tekst);
  console.log(`Geschreven: regelgeving.json (${onderwerpen.length} onderwerpen)`);
}
