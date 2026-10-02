/* Rekenhulpen – jaarlijks wisselende normen (RT.normen) en de gedeelde fiscale rekenkern (RT.fisc).
 *
 * EÉN plek voor bedragen en percentages die elk jaar veranderen. Groepbestanden lezen hier uit
 * (bijv. RT.normen.box1.tarief2) en zetten zelf geen fiscale bedragen vast in hun code.
 * Rekenhulpen die deze normen gebruiken registreren peildatum: RT.normen.peildatum en fiscaal: true
 * (of een lijst met namen van de gebruikte normen); de engine toont dan de badges.
 *
 * Geverifieerd op 2026-10-02 tegen Belastingdienst/UWV/SVB/Rijksoverheid (zie N._bronnen en N._geverifieerd).
 * Bedragen die halfjaarlijks wijzigen (minimumloon, AOW, bijstand) staan op de stand per 1 juli 2026.
 * Alle percentages staan als percentage (35,75 = 35,75%).
 *
 * Dit bestand is eigendom van de basis (fase 1); groepbestanden passen het niet aan.
 * Ontbreekt een norm? Voeg hem toe in een eigen blok onderaan en meld het aan de beheerder.
 */
(function (RT) {
  'use strict';

  const N = RT.normen = {
    peildatum: '2026',
    // Geverifieerd op 2026-10-02 tegen officiële bronnen (zie _bronnen); niet alles kon worden bevestigd (zie _geverifieerd).
    // 'gecontroleerd' blijft false zolang er onderdelen 'niet bevestigd' zijn; de hulp 'Gebruikte fiscale normen' toont dan een signaal.
    gecontroleerd: false,

    // Inkomstenbelasting box 1 (schijfgrenzen in euro per jaar). Bevestigd: Belastingdienst, box 1 tarieven 2026.
    // Tarief 1 = 8,10% IB + 27,65% premies volksverzekeringen; vanaf AOW-leeftijd (geboren vanaf 1-1-1946) 17,85%.
    box1: { schijf1Grens: 38883, schijf2Grens: 78426, tarief1: 35.75, tarief1Aow: 17.85, tarief2: 37.56, tarief3: 49.50 },
    // Algemene heffingskorting: maximum, afbouw vanaf inkomen, afbouwpercentage; idem vanaf AOW-leeftijd (heel 2026 AOW). Bevestigd: tabel AHK 2026.
    ahk: { max: 3115, afbouwVanaf: 29736, afbouwPct: 6.398, maxAow: 1556, afbouwPctAow: 3.195 },
    // Arbeidskorting: opbouw in drie trajecten tot knik3, daarna afbouw tot nul bij 'eind'. Bevestigd: tabel arbeidskorting 2026
    // (max € 5.685). AOW-tabel ≈ 0,5 × (4,156% / 15,483% / 0,974% / afbouw 3,250%); factorAow 0,5 is een benadering.
    arbeidskorting: { knik1: 11965, knik2: 25845, knik3: 45592, eind: 132920, pct1: 8.324, pct2: 31.009, pct3: 1.950, afbouwPct: 6.510, factorAow: 0.5 },
    // Inkomensafhankelijke combinatiekorting 2026 (max € 3.032; vanaf AOW-leeftijd 5,72% en max € 1.513). Bevestigd: tabel IACK 2026.
    // LET OP: alleen nog voor ouders met een kind geboren vóór 1 januari 2025 (afbouw IACK); voor jongere kinderen geen recht.
    iack: { drempel: 6239, pct: 11.45, max: 3032 },
    // Ouderenkorting en alleenstaande-ouderenkorting 2026. Bevestigd: Belastingdienst heffingskortingen 2026.
    ouderenkorting: { max: 2067, afbouwVanaf: 46002, afbouwPct: 15, alleenstaand: 540 },
    // Maximaal tarief waartegen aftrekposten (o.a. eigen woning) aftrekbaar zijn = tarief schijf 2 (37,56%). Bevestigd.
    aftrekTariefMax: 37.56,
    // Tarief bijzondere beloningen (indicatie hoogste)
    bijzondereBeloningMax: 49.50,

    // Eigen woning 2026: forfait 0,35% (WOZ € 75.000 – € 1.350.000), daarboven € 4.725 + 2,35%. Hillen-aftrek 71,867% (versnelde afbouw, einde 2041).
    // kewVrijstelling: vrijstelling kapitaalverzekering/spaarrekening/beleggingsrecht eigen woning 2026 (€ 207.500 p.p.). Alles bevestigd.
    eigenWoning: { forfaitPct: 0.35, villataksGrens: 1350000, villataksPct: 2.35, hillenAfbouwPct: 71.867, kewVrijstelling: 207500 },
    // Overdrachtsbelasting 2026: 2% eigen woning, 8% overig; startersvrijstelling tot woningwaarde € 555.000. Bevestigd.
    ovb: { eigenWoning: 2, overig: 8, startersVrijstelling: 0, startersWoningwaardeGrens: 555000 },

    // Box 2 (aanmerkelijk belang) 2026: 24,5% tot € 68.843 (p.p.), daarboven 31%. Bevestigd.
    box2: { tarief1: 24.5, tarief2: 31, grens: 68843 },
    // Box 3 2026: heffingsvrij € 59.357 p.p.; forfait overige bezittingen 6,00% (definitief), banktegoeden 1,28% en schulden 2,70%
    // (voorlopig, definitief begin 2027); schuldendrempel € 3.800 p.p.; tarief 36%. Bevestigd.
    box3: { heffingsvrij: 59357, forfaitBank: 1.28, forfaitOverig: 6.00, forfaitSchuld: 2.70, schuldDrempel: 3800, tarief: 36 },
    // Vennootschapsbelasting 2026: 19% tot € 200.000, daarboven 25,8%. Bevestigd.
    vpb: { tarief1: 19, tarief2: 25.8, grens: 200000 },

    // Ondernemer (IB) 2026: zelfstandigenaftrek € 1.200, startersaftrek € 2.123, mkb-winstvrijstelling 12,7%, urencriterium 1.225 uur.
    // Zvw-bijdrage ondernemer 2026: 4,85% over maximaal € 79.409 bijdrage-inkomen. Alles bevestigd.
    ondernemer: { zelfstandigenaftrek: 1200, startersaftrek: 2123, mkbVrijstellingPct: 12.7, zvwPct: 4.85, zvwMaxInkomen: 79409, urencriterium: 1225 },

    // Werkgeverslasten en sociale verzekeringen 2026: AWf laag 2,74% (hoog 7,74%), Aof laag 6,27% (incl. 0,5% Wko-opslag; hoog 7,63%),
    // werkgeversheffing Zvw 6,10%, maximumpremieloon € 79.409. Whk verschilt per werkgever: 1,52% is een gemiddelde (niet bevestigd).
    werkgever: { awf: 2.74, aof: 6.27, whk: 1.52, zvw: 6.10, maxPremieloon: 79409 },
    // Wettelijk minimumuurloon 21+ per 1 juli 2026 (1 januari 2026: € 14,71). Bevestigd: Rijksoverheid bedragen minimumloon 2026.
    minimumloon: { uur: 14.99 },
    // AOW per 1 juli 2026 per jaar, exclusief vakantiegeld (SVB): bruto alleenstaand € 1.662,16 p/m, samenwonend € 1.139,39 p/m p.p.;
    // netto met loonheffingskorting € 1.581,55 resp. € 1.084,13 p/m. Vakantiegeld bruto € 104,78 resp. € 74,85 p/m. Bevestigd.
    aow: { brutoAlleenstaandJaar: 19946, brutoSamenPpJaar: 13673, nettoAlleenstaandJaar: 18979, nettoSamenPpJaar: 13010 },
    // Bijstand (Participatiewet, 21 jaar tot AOW) per jaar, netto incl. vakantiegeld; alleenstaand € 1.419,46 p/m per 1 juli 2026 (Rijksoverheid);
    // samen = alleenstaand / 70% en dan per persoon (afgeleid, niet bevestigd).
    bijstand: { alleenstaandJaar: 17034, samenPpJaar: 12167 },

    // Schenk- en erfbelasting 2026 (tarief I: partner/kind): 10% tot € 158.669, daarboven 20%; erfvrijstelling kind € 26.230,
    // partner € 828.035; jaarlijkse schenkvrijstelling kind € 6.908. Bevestigd.
    schenkErf: { tarief1: 10, tarief2: 20, schijfGrens: 158669, erfVrijstellingKind: 26230, erfVrijstellingPartner: 828035, schenkVrijstellingKind: 6908 }
  };

  /* Verificatie (2026-10-02). Status per onderdeel: 'bevestigd' = alle waarden in het blok tegen een officiële bron gecontroleerd;
   * 'deels' = een deel bevestigd, rest staat met commentaar 'niet bevestigd'. Wordt niet door de engine gebruikt. */
  N._verificatiedatum = '2026-10-02';
  N._geverifieerd = {
    box1: 'bevestigd', ahk: 'bevestigd', arbeidskorting: 'bevestigd (factorAow is benadering)', iack: 'bevestigd', ouderenkorting: 'bevestigd',
    aftrekTariefMax: 'bevestigd', bijzondereBeloningMax: 'bevestigd', eigenWoning: 'bevestigd', ovb: 'bevestigd', box2: 'bevestigd', box3: 'bevestigd',
    vpb: 'bevestigd', ondernemer: 'bevestigd', werkgever: 'deels (whk niet bevestigd)', minimumloon: 'bevestigd', aow: 'bevestigd',
    bijstand: 'deels (samenPpJaar afgeleid)', schenkErf: 'bevestigd'
  };
  N._bronnen = [
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/inkomensafhankelijke_combikorting/inkomensafhankelijke-combinatiekorting-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/fisin/fisin2026/heffingskortingen',
    'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/eigenwoningforfait/geen_of_een_kleine_eigenwoningschuld/geen_of_een_kleine_eigenwoningschuld',
    'https://www.belastingdienst.nl/wps/wcm/connect/fisin/fisin2026/verzekeren_of_sparen_voor_de_aflossing',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/startersvrijstelling/startersvrijstelling',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_2/box_2',
    'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/vermogen_en_aanmerkelijk_belang/vermogen/wat_zijn_uw_bezittingen_en_schulden/uw_schulden/drempel',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/vennootschapsbelasting/veranderingen-vennootschapsbelasting-2026/veranderingen-vennootschapsbelasting-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/veranderingen-inkomstenbelasting-2026/ondernemersaftrek-2026/zelfstandigenaftrek-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/veranderingen-inkomstenbelasting-2026/mkb-winstvrijstelling-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/werk_en_inkomen/zorgverzekeringswet/veranderingen-bijdrage-zvw/percentages-zvw',
    'https://download.belastingdienst.nl/belastingdienst/docs/bijlage-nieuwsbrief-loonheffingen-2026-lh2091b63fd.pdf',
    'https://www.rijksoverheid.nl/themas/werk/minimumloon/bedragen-minimumloon/bedragen-minimumloon-2026',
    'https://www.svb.nl/nl/aow/nieuws/aow-bedragen-vanaf-juli-2026',
    'https://www.rijksoverheid.nl/actueel/nieuws/2026/06/11/uitkeringsbedragen-per-1-juli-2026',
    'https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/vrijstelling-erfbelasting',
    'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/tarieven-schenkbelasting',
    'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/hoeveel-mag-ik-mijn-kind-belastingvrij-schenken'
  ];

  /* Overzicht met namen, voor de hulp "Gebruikte fiscale normen" en voor documentatie. */
  RT.normenOverzicht = [
    ['Inkomstenbelasting', [
      ['Grens eerste schijf', N.box1.schijf1Grens, 'eur'], ['Grens tweede schijf', N.box1.schijf2Grens, 'eur'],
      ['Tarief eerste schijf', N.box1.tarief1, 'pct'], ['Tarief eerste schijf vanaf AOW-leeftijd', N.box1.tarief1Aow, 'pct'],
      ['Tarief tweede schijf', N.box1.tarief2, 'pct'], ['Tarief derde schijf', N.box1.tarief3, 'pct'],
      ['Maximaal aftrektarief aftrekposten', N.aftrekTariefMax, 'pct']]],
    ['Heffingskortingen', [
      ['Algemene heffingskorting, maximum', N.ahk.max, 'eur'], ['Algemene heffingskorting, afbouw vanaf', N.ahk.afbouwVanaf, 'eur'],
      ['Algemene heffingskorting, afbouw', N.ahk.afbouwPct, 'pct'], ['Algemene heffingskorting AOW, maximum', N.ahk.maxAow, 'eur'],
      ['Arbeidskorting, eerste knik', N.arbeidskorting.knik1, 'eur'], ['Arbeidskorting, tweede knik', N.arbeidskorting.knik2, 'eur'],
      ['Arbeidskorting, derde knik', N.arbeidskorting.knik3, 'eur'], ['Arbeidskorting, afbouw', N.arbeidskorting.afbouwPct, 'pct'],
      ['Combinatiekorting, maximum', N.iack.max, 'eur'], ['Ouderenkorting, maximum', N.ouderenkorting.max, 'eur'],
      ['Ouderenkorting, afbouwgrens', N.ouderenkorting.afbouwVanaf, 'eur'], ['Alleenstaande-ouderenkorting', N.ouderenkorting.alleenstaand, 'eur']]],
    ['Eigen woning', [
      ['Eigenwoningforfait', N.eigenWoning.forfaitPct, 'pct'], ['Grens hoger forfait', N.eigenWoning.villataksGrens, 'eur'],
      ['Forfait boven die grens', N.eigenWoning.villataksPct, 'pct'], ['Overdrachtsbelasting eigen woning', N.ovb.eigenWoning, 'pct'],
      ['Overdrachtsbelasting overig', N.ovb.overig, 'pct'], ['Woningwaardegrens startersvrijstelling', N.ovb.startersWoningwaardeGrens, 'eur']]],
    ['Box 2, box 3 en vpb', [
      ['Box 2 tarief tot de grens', N.box2.tarief1, 'pct'], ['Box 2 grens', N.box2.grens, 'eur'], ['Box 2 tarief daarboven', N.box2.tarief2, 'pct'],
      ['Heffingsvrij vermogen box 3 (p.p.)', N.box3.heffingsvrij, 'eur'], ['Forfait banktegoeden', N.box3.forfaitBank, 'pct'],
      ['Forfait overige bezittingen', N.box3.forfaitOverig, 'pct'], ['Forfait schulden', N.box3.forfaitSchuld, 'pct'],
      ['Schuldendrempel (p.p.)', N.box3.schuldDrempel, 'eur'], ['Tarief box 3', N.box3.tarief, 'pct'],
      ['Vpb tot de grens', N.vpb.tarief1, 'pct'], ['Vpb-grens', N.vpb.grens, 'eur'], ['Vpb daarboven', N.vpb.tarief2, 'pct']]],
    ['Ondernemer en werkgever', [
      ['Zelfstandigenaftrek', N.ondernemer.zelfstandigenaftrek, 'eur'], ['Startersaftrek', N.ondernemer.startersaftrek, 'eur'],
      ['Mkb-winstvrijstelling', N.ondernemer.mkbVrijstellingPct, 'pct'], ['Zvw-bijdrage ondernemer', N.ondernemer.zvwPct, 'pct'],
      ['Maximum Zvw-bijdrage-inkomen', N.ondernemer.zvwMaxInkomen, 'eur'], ['Maximum premieloon', N.werkgever.maxPremieloon, 'eur'],
      ['Minimumloon per uur (21+)', N.minimumloon.uur, 'eur2']]],
    ['Schenken en erven', [
      ['Tarief eerste schijf (partner/kind)', N.schenkErf.tarief1, 'pct'], ['Grens eerste schijf', N.schenkErf.schijfGrens, 'eur'],
      ['Tarief daarboven', N.schenkErf.tarief2, 'pct'], ['Schenkvrijstelling kind per jaar', N.schenkErf.schenkVrijstellingKind, 'eur'],
      ['Erfvrijstelling kind', N.schenkErf.erfVrijstellingKind, 'eur'], ['Erfvrijstelling partner', N.schenkErf.erfVrijstellingPartner, 'eur']]]
  ];

  /* ---------- fiscale rekenkern (box 1, kortingen, box 2, box 3, vpb) ---------- */
  const pos = x => Math.max(0, x);
  const F = RT.fisc = {};

  // Belasting en premie volksverzekeringen over belastbaar inkomen box 1, vóór heffingskortingen
  F.box1 = (inkomen, opt = {}) => {
    const b = N.box1, ink = pos(inkomen);
    const s1 = Math.min(ink, b.schijf1Grens), s2 = Math.min(pos(ink - b.schijf1Grens), b.schijf2Grens - b.schijf1Grens), s3 = pos(ink - b.schijf2Grens);
    const t1 = opt.aow ? b.tarief1Aow : b.tarief1;
    const marginaal = ink < b.schijf1Grens ? t1 : ink < b.schijf2Grens ? b.tarief2 : b.tarief3;
    return { s1, s2, s3, belasting: s1 * t1 / 100 + s2 * b.tarief2 / 100 + s3 * b.tarief3 / 100, marginaal };
  };
  // Algemene heffingskorting; afbouw stopt boven de tweede schijfgrens
  F.ahk = (inkomen, opt = {}) => {
    const a = N.ahk, max = opt.aow ? a.maxAow : a.max, pct = opt.aow ? a.afbouwPctAow : a.afbouwPct;
    return pos(max - pos(Math.min(inkomen, N.box1.schijf2Grens) - a.afbouwVanaf) * pct / 100);
  };
  // Arbeidskorting over arbeidsinkomen (vanaf AOW-leeftijd vereenvoudigd met een factor)
  F.arbeidskorting = (arbeid, opt = {}) => {
    const a = N.arbeidskorting, x = pos(arbeid);
    const k1 = a.knik1 * a.pct1 / 100, k2 = k1 + (a.knik2 - a.knik1) * a.pct2 / 100, k3 = k2 + (a.knik3 - a.knik2) * a.pct3 / 100;
    let k;
    if (x <= a.knik1) k = x * a.pct1 / 100;
    else if (x <= a.knik2) k = k1 + (x - a.knik1) * a.pct2 / 100;
    else if (x <= a.knik3) k = k2 + (x - a.knik2) * a.pct3 / 100;
    else k = pos(k3 - (x - a.knik3) * a.afbouwPct / 100);
    return opt.aow ? k * a.factorAow : k;
  };
  F.iack = (arbeid, heeftJongKind) => heeftJongKind ? Math.min(N.iack.max, pos(arbeid - N.iack.drempel) * N.iack.pct / 100) : 0;
  F.ouderenkorting = (verzamelinkomen, alleenstaand) => {
    const o = N.ouderenkorting;
    return pos(o.max - pos(verzamelinkomen - o.afbouwVanaf) * o.afbouwPct / 100) + (alleenstaand ? o.alleenstaand : 0);
  };

  /* Netto jaarinkomen uit bruto box 1-inkomen.
   * opt: { aow: bool, arbeid: arbeidsinkomen (standaard = inkomen; 0 voor uitkering/pensioen),
   *        kind: bool (IACK), alleenstaand: bool (ouderenkorting), aftrek: aftrekposten }
   * Heffingskortingen worden niet hoger dan de belasting (niet uitbetaald). */
  F.netto = (bruto, opt = {}) => {
    const belastbaar = pos(bruto - (opt.aftrek || 0));
    const arbeid = opt.arbeid === undefined ? belastbaar : opt.arbeid;
    const b = F.box1(belastbaar, opt);
    const kortingen = {
      ahk: F.ahk(belastbaar, opt),
      arbeidskorting: F.arbeidskorting(arbeid, opt),
      iack: F.iack(arbeid, opt.kind),
      ouderenkorting: opt.aow ? F.ouderenkorting(belastbaar, opt.alleenstaand) : 0
    };
    const kortingTotaal = kortingen.ahk + kortingen.arbeidskorting + kortingen.iack + kortingen.ouderenkorting;
    const heffing = pos(b.belasting - kortingTotaal);
    return {
      bruto, belastbaar, belastingVoorKorting: b.belasting, schijven: [b.s1, b.s2, b.s3], kortingen, kortingTotaal,
      heffing, netto: bruto - heffing, gemiddeldeDruk: bruto > 0 ? heffing / bruto * 100 : 0, schijfTarief: b.marginaal
    };
  };
  // Bruto inkomen dat bij een gewenst netto inkomen hoort (numeriek)
  F.brutoUitNetto = (netto, opt = {}) => RT.fin.zoekNul(b => F.netto(b, opt).netto - netto, 0, 5e6);
  // Marginale druk in procenten: deel van de laatste 'stap' euro dat aan belasting opgaat (incl. afbouw kortingen)
  F.marginaleDruk = (bruto, opt = {}, stap = 100) => (1 - (F.netto(bruto + stap, opt).netto - F.netto(bruto, opt).netto) / stap) * 100;

  // IB-ondernemer: winst -> belastbare winst, belasting, Zvw-bijdrage en netto
  F.ondernemer = (winst, opt = {}) => {
    const o = N.ondernemer;
    const ondernemersaftrek = opt.urencriterium === false ? 0 : Math.min(pos(winst), o.zelfstandigenaftrek + (opt.starter ? o.startersaftrek : 0));
    const naAftrek = pos(winst - ondernemersaftrek);
    const mkb = naAftrek * o.mkbVrijstellingPct / 100;
    const belastbareWinst = naAftrek - mkb;
    const inkomen = pos(belastbareWinst + (opt.ander || 0) - (opt.aftrek || 0));
    const ib = F.netto(inkomen, { aow: opt.aow, arbeid: belastbareWinst + (opt.anderArbeid || 0), kind: opt.kind });
    // Bijdrage-inkomen Zvw = belastbare winst (na ondernemersaftrek én mkb-winstvrijstelling), gemaximeerd
    const zvw = Math.min(belastbareWinst, o.zvwMaxInkomen) * o.zvwPct / 100;
    return { winst, ondernemersaftrek, mkbVrijstelling: mkb, belastbareWinst, inkomen, ib, heffing: ib.heffing, zvw,
      netto: winst + (opt.ander || 0) - ib.heffing - zvw, druk: winst > 0 ? (ib.heffing + zvw) / winst * 100 : 0 };
  };

  // Twee schijven (box 2, vpb, schenk- en erfbelasting)
  F.tweeSchijven = (bedrag, grens, t1, t2) => {
    const x = pos(bedrag), s1 = Math.min(x, grens), s2 = pos(x - grens);
    return { s1, s2, belasting: s1 * t1 / 100 + s2 * t2 / 100 };
  };
  F.vpb = winst => F.tweeSchijven(winst, N.vpb.grens, N.vpb.tarief1, N.vpb.tarief2).belasting;
  F.box2 = (inkomen, partners = 1) => F.tweeSchijven(inkomen, N.box2.grens * partners, N.box2.tarief1, N.box2.tarief2).belasting;
  F.schenkErf = (verkregen, vrijstelling) => F.tweeSchijven(pos(verkregen - vrijstelling), N.schenkErf.schijfGrens, N.schenkErf.tarief1, N.schenkErf.tarief2).belasting;

  /* Box 3 (forfaitair). bank, overig, schulden in euro; personen = 1 of 2 (heffingsvrij en drempel per persoon).
   * Geeft rendementsgrondslag, forfaitair rendement, grondslag, effectief rendementspercentage en belasting. */
  F.box3 = (bank, overig, schulden, personen = 1) => {
    const b = N.box3;
    const schuldNetto = pos(schulden - b.schuldDrempel * personen);
    const rendement = bank * b.forfaitBank / 100 + overig * b.forfaitOverig / 100 - schuldNetto * b.forfaitSchuld / 100;
    const rendementsgrondslag = bank + overig - schuldNetto;
    const grondslag = pos(rendementsgrondslag - b.heffingsvrij * personen);
    const pct = rendementsgrondslag > 0 ? pos(rendement) / rendementsgrondslag : 0;
    const voordeel = grondslag * pct;
    return { rendementsgrondslag, forfaitairRendement: rendement, grondslag, rendementPct: pct * 100, voordeel, belasting: voordeel * b.tarief / 100 };
  };

  // Netto voordeel eigen woning: (rente − forfait) × aftrektarief; bij forfait > rente geldt de Hillen-afbouw
  F.eigenWoning = (renteJaar, woz, opt = {}) => {
    const e = N.eigenWoning;
    const forfait = woz <= e.villataksGrens ? woz * e.forfaitPct / 100 : e.villataksGrens * e.forfaitPct / 100 + (woz - e.villataksGrens) * e.villataksPct / 100;
    const tarief = opt.tarief != null ? opt.tarief : Math.min(N.aftrekTariefMax, opt.schijfTarief != null ? opt.schijfTarief : N.aftrekTariefMax);
    let saldo = renteJaar - forfait, hillen = 0;
    if (saldo < 0) { hillen = -saldo * e.hillenAfbouwPct / 100; saldo += hillen; }
    return { forfait, saldo, hillenAftrek: hillen, voordeel: saldo * tarief / 100, tarief };
  };

  /* ---------- hulp die de gebruikte normen toont ---------- */
  RT.add({
    id: 'fiscale-normen', groep: 'fiscaal-box1', naam: 'Gebruikte fiscale normen',
    intro: 'Overzicht van de jaarlijks wisselende bedragen en percentages waarmee de fiscale rekenhulpen op deze pagina rekenen.',
    kw: 'normen tarieven schijven heffingskorting box 3 forfait vpb box 2 vrijstelling peildatum',
    peildatum: N.peildatum, fiscaal: true,
    velden: [
      { k: 'deel', l: 'Toon', s: 'keuze', opties: [['alle', 'Alle normen']].concat(RT.normenOverzicht.map((b, i) => [String(i), b[0]])), std: 'alle', breed: true }
    ],
    bereken(v) {
      const blokken = v.deel === 'alle' ? RT.normenOverzicht : [RT.normenOverzicht[+v.deel]];
      const opmaak = (x, s) => s === 'eur' ? RT.fmt.euro0(x) : s === 'eur2' ? RT.fmt.euro(x) : RT.fmt.pct(x, x % 1 ? (String(x).split('.')[1].length > 2 ? 3 : 2) : 0);
      const aantal = blokken.reduce((s, b) => s + b[1].length, 0);
      return {
        lbl: 'Peildatum normen', groot: N.peildatum, onder: aantal + ' normen' + (N.gecontroleerd ? '' : ' · nog te verifiëren'),
        rijen: [],
        signalen: N.gecontroleerd ? [] : ['Deze werkwaarden zijn nog niet allemaal tegen de officiële bronnen gecontroleerd. Gebruik ze niet in een klantdossier zonder controle.'],
        tabellen: blokken.map(b => ({ titel: b[0], kop: ['Norm', 'Waarde'], rijen: b[1].map(r => [r[0], opmaak(r[1], r[2])]) }))
      };
    },
    uitleg: 'Alle fiscale rekenhulpen lezen hun bedragen uit één centraal normenbestand. Wijzigt een norm, dan rekenen alle hulpen direct met de nieuwe waarde.',
    letop: 'Normen wijzigen meestal per 1 januari, soms ook per 1 juli (bijvoorbeeld het minimumloon). Controleer de actuele waarden bij de Belastingdienst, het UWV, de SVB of Rijksoverheid.'
  });
})(window.RT);
