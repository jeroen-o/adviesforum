/* Rekenhulpen – groep "fiscaal-box2-3-schenken-erven" (Box 2, box 3, schenken en erven).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;

  RT.add({
    id: 'erfdeel', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Erfdelen bij de wettelijke verdeling',
    intro: 'Zonder testament krijgt de langstlevende partner de goederen en de kinderen een geldvordering. Hoe groot is ieders erfdeel?',
    velden: [
      { k: 'p', l: 'Is er een langstlevende echtgenoot of geregistreerd partner?', s: 'keuze', opties: [['ja', 'Ja'], ['nee', 'Nee']], std: 'ja', breed: true },
      { k: 'gem', l: 'Gemeenschappelijk vermogen (netto)', s: 'eur', std: 520000, opt: true, tip: 'Bezittingen min schulden in de gemeenschap; de helft valt in de nalatenschap.' },
      { k: 'priv', l: 'Privévermogen van de overledene (netto)', s: 'eur', std: 0, opt: true },
      { k: 'uv', l: 'Uitvaartkosten', s: 'eur', std: 9500, opt: true },
      { k: 'kn', l: 'Aantal kinderen', s: 'num', std: 2, tip: 'Kinderen van de overledene; een vooroverleden kind wordt vervangen door zijn kinderen.' }
    ],
    bereken(v) {
      const kn = Math.round(v.kn), partner = v.p === 'ja';
      const delers = kn + (partner ? 1 : 0);
      if (kn < 0) return { fout: 'Het aantal kinderen kan niet negatief zijn.' };
      if (!delers) return { fout: 'Zonder partner en kinderen erven andere familieleden; die verdeling valt buiten deze rekenhulp.' };
      const nal = (partner ? v.gem / 2 : v.gem) + v.priv - v.uv;
      if (nal <= 0) return { lbl: 'Erfdeel per erfgenaam', groot: fmt.euro0(0), onder: 'de nalatenschap is niet positief', rijen: [['Saldo nalatenschap', fmt.euro0(nal)]] };
      const deel = nal / delers;
      const rijen = [['Saldo nalatenschap', fmt.euro0(nal)], ['Aantal erfgenamen', fmt.getal(delers)]];
      if (partner && kn) rijen.push(['Erfdeel partner', fmt.euro0(deel)], ['Geldvordering per kind', fmt.euro0(deel)], ['Totaal vorderingen kinderen', fmt.euro0(deel * kn), 'som']);
      else rijen.push(['Erfdeel ' + (partner ? 'partner' : 'per kind'), fmt.euro0(deel), 'som']);
      return {
        lbl: 'Erfdeel per erfgenaam', groot: fmt.euro0(deel), onder: partner && kn ? 'de kinderen krijgen dit als niet-opeisbare geldvordering' : 'zonder testament',
        rijen,
        signalen: partner && kn ? ['De partner krijgt alle goederen en wordt schuldenaar van de kinderen. De vorderingen zijn in de regel pas opeisbaar bij overlijden of faillissement van de partner.'] : []
      };
    },
    uitleg: 'Nalatenschap = helft van het gemeenschappelijke vermogen (bij een partner) + privévermogen − uitvaartkosten. Erfdeel = nalatenschap / (partner + aantal kinderen). Zonder partner telt hier het volledige ingevulde vermogen.',
    letop: 'Een testament, huwelijkse voorwaarden of een beperkte gemeenschap kunnen de uitkomst volledig veranderen. Erfbelasting, de rente over de vorderingen en de uitkering uit een overlijdensrisicoverzekering zijn hier niet berekend; zie ook <a href="orv.html">Overlijdensrisico</a>. Laat de verdeling bevestigen door de notaris.'
  });

  /* =====================================================================
   * Fase 2 (batch 6): box 2, box 3, schenken, erven en giften
   * Normen komen uit RT.normen (normen.js). Wat daar ontbreekt staat hieronder in N.
   * ===================================================================== */
  const NR = RT.normen, F = RT.fisc;
  const { annHoofdsom, zoekNul } = RT.fin;
  const pos = x => Math.max(0, x);

  /* Ontbrekende normen. Peildatum 2026; gecontroleerd op 2026-10-02 tegen de Belastingdienst, status per regel.
   * Niet in normen.js gezet (eigendom basis). */
  const N = {
    peildatum: '2026',
    // Erfbelasting 2026: vrijstelling kleinkind € 26.230, ouders € 62.110, overige € 2.769, minimale partnervrijstelling bij
    // pensioenverrekening € 213.915 – bevestigd: https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/vrijstelling-erfbelasting
    erf: { kleinkind: 26230, ouder: 62110, overig: 2769, partnerMinimum: 213915 },
    // Schenkbelasting 2026: eenmalig verhoogd kind 18–40 jaar € 33.129, voor dure studie € 69.009, overige verkrijgers (incl. kleinkind) € 2.769 –
    // bevestigd: https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/tot-welk-bedrag-belastingvrij-schenken
    schenk: { kind40: 33129, studie: 69009, overig: 2769 },
    // Tarieven groep II (kleinkinderen) en groep III (overigen); groep I staat in RT.normen.schenkErf. Schijfgrens 2026 € 158.669 –
    // bevestigd: https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/tarieven-erfbelasting
    tariefII: [18, 36], tariefIII: [30, 40],
    // Waardering vruchtgebruik en periodieke uitkeringen: rekenrente en leeftijdsfactoren – niet bevestigd
    rekenrente: 6,
    leeftijdsfactor: [[20, 16], [30, 15], [40, 14], [50, 13], [55, 12], [60, 11], [65, 10], [70, 9], [75, 8], [80, 7], [85, 5], [90, 4], [Infinity, 3]],
    // Giftenaftrek IB 2026: drempel 1% (min. € 60), max. 10%; periodieke giften max. € 1.500.000 per jaar (sinds 2025; 2024: € 250.000) –
    // bevestigd: https://www.belastingdienst.nl/wps/wcm/connect/fisin/fisin2026/aftrek_giften
    gift: { drempelPct: 1, drempelMin: 60, maxPct: 10, periodiekPlafond: 1500000 },
    // Giftenaftrek vennootschapsbelasting: max. 50% van de winst en € 100.000 – bevestigd (Belastingdienst, aftrekbare giften vpb)
    giftBv: { maxPct: 50, maxBedrag: 100000 },
    // Groene beleggingen 2026: extra vrijstelling € 26.715 p.p. en heffingskorting 0,1% – bevestigd (Belastingdienst, groene beleggingen)
    groen: { vrijstelling: 26715, kortingPct: 0.1 },
    // Tweede set box 3-normen om mee te vergelijken: het oorspronkelijke kabinetsvoorstel Belastingplan 2026 (heffingsvrij € 51.396),
    // dat bij amendement NIET is ingevoerd (geldend 2026: € 59.357, zie RT.normen.box3) – alleen als vergelijkingsscenario, niet bevestigd
    box3B: { heffingsvrij: 51396, forfaitBank: 1.31, forfaitOverig: 6.17, tarief: 36 },
    // Aangekondigd stelsel werkelijk rendement (wetsvoorstel 36748): heffingsvrij resultaat p.p. – niet bevestigd
    werkelijk: { heffingsvrijResultaat: 1800 },
    // Rechtsherstel box 3: gemiddeld forfait van het oude stelsel – aanname, niet bevestigd
    oudForfait: 4.5,
    // Leegwaarderatio verhuurde woning 2026: [huur per jaar als % van de WOZ tot en met, ratio %] – bevestigd (Belastingdienst, tabel waarde
    // verhuurde of verpachte woning 2026)
    leegwaarde: [[1, 73], [2, 79], [3, 84], [4, 90], [5, 95], [Infinity, 100]],
    // Schenkvrijstelling eigen woning (jubelton, vervallen per 2024): historische bedragen – niet bevestigd
    woning: { t2022: 106671, t2023: 28947 }
  };
  const BRON = 'waarde uit de bron (peildatum ' + N.peildatum + '), niet geverifieerd';
  const INDICATIEF = 'Indicatief: een deel van de normen is een ' + BRON + '. Controleer de actuele norm bij de Belastingdienst.';

  /* ---------- schenk- en erfbelasting ---------- */
  const tarieven = groep => groep === 'II' ? N.tariefII : groep === 'III' ? N.tariefIII : [NR.schenkErf.tarief1, NR.schenkErf.tarief2];
  const heffingSE = (belastbaar, groep) => {
    const [t1, t2] = tarieven(groep);
    return Object.assign({ t1, t2 }, F.tweeSchijven(belastbaar, NR.schenkErf.schijfGrens, t1, t2));
  };
  const TARIEFGROEP = [['I', 'Partner of kind (tarief I)'], ['II', 'Kleinkind of verdere afstammeling (tarief II)'], ['III', 'Overige verkrijgers (tarief III)']];
  const ERF_REL = {
    partner: () => [NR.schenkErf.erfVrijstellingPartner, 'I'], kind: () => [NR.schenkErf.erfVrijstellingKind, 'I'],
    kleinkind: () => [N.erf.kleinkind, 'II'], ouder: () => [N.erf.ouder, 'III'], overig: () => [N.erf.overig, 'III']
  };
  const SCHENK_REL = {
    kind: () => [NR.schenkErf.schenkVrijstellingKind, 'I'], kind40: () => [N.schenk.kind40, 'I'], studie: () => [N.schenk.studie, 'I'],
    kleinkind: () => [N.schenk.overig, 'II'], overig: () => [N.schenk.overig, 'III']
  };
  const schijfRijen = s => [
    ['Eerste schijf: ' + fmt.euro0(s.s1) + ' × ' + fmt.pct(s.t1, 0), fmt.euro(s.s1 * s.t1 / 100)],
    ['Tweede schijf: ' + fmt.euro0(s.s2) + ' × ' + fmt.pct(s.t2, 0), fmt.euro(s.s2 * s.t2 / 100)]
  ];

  /* ---------- box 3 met een eigen set normen (zelfde methode als RT.fisc.box3) ---------- */
  const box3Met = (p, bank, overig, schulden, personen) => {
    const schuldNetto = pos(schulden - p.schuldDrempel * personen);
    const rendement = bank * p.forfaitBank / 100 + overig * p.forfaitOverig / 100 - schuldNetto * p.forfaitSchuld / 100;
    const rg = bank + overig - schuldNetto, grondslag = pos(rg - p.heffingsvrij * personen);
    const aandeel = rg > 0 ? grondslag / rg : 0, voordeel = pos(rendement) * aandeel;
    return { schuldNetto, rendement, rg, grondslag, aandeel, voordeel, belasting: voordeel * p.tarief / 100 };
  };
  const PARTNER = [['1', 'Nee'], ['2', 'Ja, vermogen samen met fiscaal partner']];

  /* ---------- box 2, vpb en aftrektarief ---------- */
  const box2 = (x, personen) => F.tweeSchijven(pos(x), NR.box2.grens * personen, NR.box2.tarief1, NR.box2.tarief2);
  const VPB = [['1', 'Laag vpb-tarief (winst tot de grens)'], ['2', 'Hoog vpb-tarief']];
  const vpbTarief = k => k === '2' ? NR.vpb.tarief2 : NR.vpb.tarief1;
  const B2 = [['1', 'Laag box 2-tarief'], ['2', 'Hoog box 2-tarief']];
  const b2Tarief = k => k === '2' ? NR.box2.tarief2 : NR.box2.tarief1;
  const SCHIJF = [['1', 'Eerste schijf'], ['2', 'Tweede schijf'], ['3', 'Derde schijf']];
  const aftrekTarief = k => k === '1' ? NR.box1.tarief1 : k === '2' ? NR.box1.tarief2 : Math.min(NR.box1.tarief3, NR.aftrekTariefMax);

  const leeftijdsfactor = l => N.leeftijdsfactor.find(r => l < r[0])[1];
  const leegwaarderatio = huurPct => N.leegwaarde.find(r => huurPct <= r[0])[1];

  RT.add({
    id: 'box3-heffing', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Belasting box 3',
    intro: 'De box 3-heffing volgens het forfaitaire stelsel: forfaitair rendement per vermogenssoort, naar verhouding toegerekend aan het vermogen boven het heffingsvrije deel.',
    kw: 'box 3 vermogensbelasting sparen beleggen forfait spaarvariant heffingsvrij vermogen',
    peildatum: NR.peildatum, fiscaal: ['Heffingsvrij vermogen', 'Forfaits bank, overig en schulden', 'Schuldendrempel', 'Tarief box 3'],
    velden: [
      { k: 'bank', l: 'Banktegoeden', s: 'eur', std: 60000, opt: true },
      { k: 'bel', l: 'Overige bezittingen (beleggingen, tweede woning)', s: 'eur', std: 120000, opt: true },
      { k: 'sch', l: 'Schulden in box 3', s: 'eur', std: 20000, opt: true },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' }
    ],
    bereken(v) {
      const p = +v.fp, b = NR.box3, r = box3Met(b, v.bank, v.bel, v.sch, p);
      return {
        lbl: 'Box 3-belasting', groot: fmt.euro(r.belasting), onder: r.rg > 0 ? fmt.pct(r.belasting / r.rg * 100, 3) + ' van de rendementsgrondslag' : 'geen positieve grondslag',
        rijen: [
          ['Rendementsgrondslag', fmt.euro0(r.rg)], ['Forfaitair rendement', fmt.euro(r.rendement)],
          ['Grondslag boven heffingsvrij vermogen', fmt.euro0(r.grondslag)], ['Deel dat belast wordt', fmt.pct(r.aandeel * 100, 2)],
          ['Belastbaar voordeel', fmt.euro(r.voordeel)], ['Box 3-belasting (' + fmt.pct(b.tarief, 0) + ')', fmt.euro(r.belasting), 'som']
        ],
        tabel: { titel: 'Forfaitair rendement per soort', kop: ['Soort', 'Bedrag', 'Forfait', 'Rendement'], rijen: [
          ['Banktegoeden', fmt.euro0(v.bank), fmt.pct(b.forfaitBank), fmt.euro(v.bank * b.forfaitBank / 100)],
          ['Overige bezittingen', fmt.euro0(v.bel), fmt.pct(b.forfaitOverig), fmt.euro(v.bel * b.forfaitOverig / 100)],
          ['Schulden boven de drempel', fmt.euro0(r.schuldNetto), fmt.pct(b.forfaitSchuld), fmt.euro(-r.schuldNetto * b.forfaitSchuld / 100)]] },
        signalen: ['Is het werkelijke rendement lager dan het forfaitaire, kijk dan naar het tegenbewijs: <a href="#box3-werkelijk-rendement">Box 3: werkelijk tegenover forfaitair</a>.']
      };
    },
    uitleg: 'Schulden tellen mee boven de drempel (' + fmt.euro0(NR.box3.schuldDrempel) + ' p.p.). Forfaitair rendement = bank × forfait bank + overig × forfait overig − schulden × forfait schulden. Rendementsgrondslag = bezittingen − schulden. Belastbaar voordeel = rendement × (grondslag boven heffingsvrij vermogen / rendementsgrondslag). Belasting = voordeel × tarief.',
    letop: 'Box 3 is in beweging: tegenbewijsregeling en een aangekondigd stelsel op werkelijk rendement. Peildatum is 1 januari; groene beleggingen, de eigen woning en vrijgestelde vermogensbestanddelen zijn hier niet apart verwerkt. De normen (' + NR.peildatum + ') zijn nog niet allemaal geverifieerd. Verdeling tussen partners is vrij te kiezen en niet berekend.'
  });

  RT.add({
    id: 'erfbelasting', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Erfbelasting per verkrijger',
    intro: 'De erfbelasting over één erfdeel, met de vrijstelling en tarieven die horen bij de relatie met de overledene.',
    kw: 'erfbelasting successierecht erfenis vrijstelling partner kind kleinkind tarief',
    peildatum: N.peildatum, fiscaal: ['Vrijstellingen erfbelasting per relatie', 'Schijfgrens', 'Tarieven I, II en III'],
    velden: [
      { k: 'b', l: 'Erfdeel (waarde van de verkrijging)', s: 'eur', std: 250000 },
      { k: 'rel', l: 'Relatie met de overledene', s: 'keuze', opties: [['kind', 'Kind'], ['partner', 'Partner'], ['kleinkind', 'Kleinkind'], ['ouder', 'Ouder'], ['overig', 'Overige verkrijger'], ['eigen', 'Eigen vrijstelling en tariefgroep']], std: 'kind', breed: true },
      { k: 'pv', l: 'Vermindering vrijstelling door nabestaandenpensioen', s: 'eur', std: 0, opt: true, als: v => v.rel === 'partner', tip: 'De helft van de kapitaalwaarde van het nabestaandenpensioen; de vrijstelling daalt niet onder het minimum.' },
      { k: 'vr', l: 'Vrijstelling', s: 'eur', std: NR.schenkErf.erfVrijstellingKind, als: v => v.rel === 'eigen' },
      { k: 'tg', l: 'Tariefgroep', s: 'keuze', opties: TARIEFGROEP, std: 'I', als: v => v.rel === 'eigen', breed: true }
    ],
    bereken(v) {
      let [vrij, groep] = v.rel === 'eigen' ? [v.vr, v.tg] : ERF_REL[v.rel]();
      if (v.rel === 'partner') vrij = Math.max(N.erf.partnerMinimum, vrij - v.pv);
      const belastbaar = pos(v.b - vrij), s = heffingSE(belastbaar, groep);
      return {
        lbl: 'Erfbelasting', groot: fmt.euro(s.belasting), onder: v.b > 0 ? fmt.pct(s.belasting / v.b * 100, 2) + ' van het erfdeel' : '',
        rijen: [['Vrijstelling', fmt.euro0(vrij)], ['Belastbaar erfdeel', fmt.euro0(belastbaar)]].concat(schijfRijen(s), [['Netto erfdeel', fmt.euro(v.b - s.belasting), 'som']])
      };
    },
    uitleg: 'Belastbaar = erfdeel − vrijstelling (bij de partner verminderd met de helft van de waarde van het nabestaandenpensioen, maar niet onder een minimum). Daarover het tarief van de tariefgroep: eerste schijf tot ' + fmt.euro0(NR.schenkErf.schijfGrens) + ', daarboven het hogere tarief.',
    letop: INDICATIEF + ' Vrijstellingen voor partner en kind komen uit het centrale normenbestand; die voor kleinkind, ouder en overige verkrijgers, het partnerminimum en de tarieven II en III zijn een ' + BRON + '. Voor een kind met een beperking geldt een hogere vrijstelling (gebruik “eigen”). Fictieve verkrijgingen, schulden en de rente over vorderingen zijn niet meegenomen. Erfbelasting is fiscaal advies: laat de aangifte door een notaris of fiscalist toetsen.'
  });

  RT.add({
    id: 'schenkbelasting', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Schenkbelasting per schenking',
    intro: 'De schenkbelasting over een schenking, met de vrijstelling die hoort bij de relatie met de schenker.',
    kw: 'schenkbelasting schenken schenking vrijstelling kind eenmalig verhoogd studie kleinkind',
    peildatum: N.peildatum, fiscaal: ['Schenkvrijstellingen per relatie', 'Schijfgrens', 'Tarieven I, II en III'],
    velden: [
      { k: 'b', l: 'Schenking', s: 'eur', std: 50000 },
      { k: 'rel', l: 'Vrijstelling', s: 'keuze', opties: [['kind', 'Kind, jaarlijkse vrijstelling'], ['kind40', 'Kind 18 tot 40 jaar, eenmalig verhoogd'], ['studie', 'Kind 18 tot 40 jaar, eenmalig voor een dure studie'], ['kleinkind', 'Kleinkind'], ['overig', 'Overige verkrijger'], ['eigen', 'Eigen vrijstelling en tariefgroep']], std: 'kind', breed: true },
      { k: 'vr', l: 'Vrijstelling', s: 'eur', std: NR.schenkErf.schenkVrijstellingKind, als: v => v.rel === 'eigen' },
      { k: 'tg', l: 'Tariefgroep', s: 'keuze', opties: TARIEFGROEP, std: 'I', als: v => v.rel === 'eigen', breed: true }
    ],
    bereken(v) {
      const [vrij, groep] = v.rel === 'eigen' ? [v.vr, v.tg] : SCHENK_REL[v.rel]();
      const belastbaar = pos(v.b - vrij), s = heffingSE(belastbaar, groep);
      return {
        lbl: 'Schenkbelasting', groot: fmt.euro(s.belasting), onder: v.b > 0 ? fmt.pct(s.belasting / v.b * 100, 2) + ' van de schenking' : '',
        rijen: [['Vrijstelling', fmt.euro0(vrij)], ['Belastbare schenking', fmt.euro0(belastbaar)]].concat(schijfRijen(s), [['Netto ontvangen', fmt.euro(v.b - s.belasting), 'som']]),
        signalen: v.rel === 'kind40' || v.rel === 'studie' ? ['De eenmalig verhoogde vrijstelling kan één keer worden gebruikt en moet in de aangifte worden geclaimd. In dat jaar geldt de gewone jaarlijkse vrijstelling niet daarnaast.'] : []
      };
    },
    uitleg: 'Belastbaar = schenking − vrijstelling. Daarover het tarief van de tariefgroep: eerste schijf tot ' + fmt.euro0(NR.schenkErf.schijfGrens) + ', daarboven het hogere tarief. Schenkingen van dezelfde schenker in één kalenderjaar tellen samen.',
    letop: INDICATIEF + ' De jaarlijkse vrijstelling voor een kind komt uit het centrale normenbestand; de eenmalig verhoogde vrijstellingen, de vrijstelling voor overige verkrijgers en de tarieven II en III zijn een ' + BRON + '. Schenkingen van beide ouders gelden als één schenking. De verhoogde vrijstelling voor de eigen woning (jubelton) is per 2024 vervallen: zie <a href="#schenkvrijstelling-woning">Schenking voor de eigen woning</a>.'
  });

  RT.add({
    id: 'schenking-vrij-van-recht', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Schenking vrij van recht (netto naar bruto)',
    intro: 'De schenker betaalt ook de schenkbelasting, zodat de ontvanger een vast netto bedrag krijgt. Hoe groot is de schenking dan in totaal?',
    kw: 'schenking vrij van recht netto bruto schenkbelasting betalen schenker bruteren',
    peildatum: N.peildatum, fiscaal: ['Schenkvrijstellingen per relatie', 'Schijfgrens', 'Tarieven I, II en III'],
    velden: [
      { k: 'n', l: 'Gewenst netto bedrag voor de ontvanger', s: 'eur', std: 50000 },
      { k: 'rel', l: 'Vrijstelling', s: 'keuze', opties: [['kind', 'Kind, jaarlijkse vrijstelling'], ['kind40', 'Kind 18 tot 40 jaar, eenmalig verhoogd'], ['kleinkind', 'Kleinkind'], ['overig', 'Overige verkrijger'], ['eigen', 'Eigen vrijstelling en tariefgroep']], std: 'kind', breed: true },
      { k: 'vr', l: 'Vrijstelling', s: 'eur', std: NR.schenkErf.schenkVrijstellingKind, als: v => v.rel === 'eigen' },
      { k: 'tg', l: 'Tariefgroep', s: 'keuze', opties: TARIEFGROEP, std: 'I', als: v => v.rel === 'eigen', breed: true }
    ],
    bereken(v) {
      if (v.n <= 0) return { fout: 'Vul een netto bedrag groter dan nul in.' };
      const [vrij, groep] = v.rel === 'eigen' ? [v.vr, v.tg] : SCHENK_REL[v.rel]();
      const heffing = g => heffingSE(pos(g - vrij), groep).belasting;
      const bruto = zoekNul(g => g - heffing(g) - v.n, 0, v.n * 3 + vrij);
      const s = heffingSE(pos(bruto - vrij), groep);
      return {
        lbl: 'Totale schenking (bruto)', groot: fmt.euro(bruto), onder: 'de schenker betaalt ' + fmt.euro(s.belasting) + ' schenkbelasting',
        rijen: [['Netto voor de ontvanger', fmt.euro(v.n)], ['Vrijstelling', fmt.euro0(vrij)], ['Belastbaar', fmt.euro0(pos(bruto - vrij))]].concat(schijfRijen(s), [['Opslag ten opzichte van netto', fmt.pct((bruto / v.n - 1) * 100, 2), 'som']])
      };
    },
    uitleg: 'Betaalt de schenker de belasting, dan is die belasting zelf ook geschonken. Gezocht wordt de bruto schenking B waarvoor geldt: B − schenkbelasting(B − vrijstelling) = gewenst netto bedrag. Per schijf komt dat neer op bruteren met 1 / (1 − tarief).',
    letop: INDICATIEF + ' Leg in de schenkingsakte of aangifte vast dat de schenking vrij van recht is. Andere schenkingen van dezelfde schenker in hetzelfde jaar tellen mee en verhogen het tarief.'
  });

  RT.add({
    id: 'waarde-vruchtgebruik', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Vruchtgebruik en blote eigendom waarderen',
    intro: 'Bij schenken of erven met een vruchtgebruik: welk deel van de waarde geldt fiscaal als vruchtgebruik en welk deel als blote eigendom?',
    kw: 'vruchtgebruik blote eigendom waardering leeftijdsfactor erfbelasting schenkbelasting',
    peildatum: N.peildatum, fiscaal: ['Rekenrente vruchtgebruik', 'Leeftijdsfactoren'],
    velden: [
      { k: 'w', l: 'Waarde van het goed in volle eigendom', s: 'eur', std: 400000 },
      { k: 'l', l: 'Leeftijd vruchtgebruiker', s: 'num', na: 'jaar', std: 72 }
    ],
    bereken(v) {
      if (v.w <= 0 || v.l < 0) return { fout: 'Vul een waarde groter dan nul en een geldige leeftijd in.' };
      const f = leeftijdsfactor(v.l), jaar = v.w * N.rekenrente / 100, vg = Math.min(v.w, jaar * f), be = v.w - vg;
      return {
        lbl: 'Waarde vruchtgebruik', groot: fmt.euro0(vg), onder: fmt.pct(vg / v.w * 100, 0) + ' van de volle waarde',
        rijen: [['Jaarlijks voordeel (' + fmt.pct(N.rekenrente, 0) + ')', fmt.euro0(jaar)], ['Leeftijdsfactor', fmt.getal(f)], ['Waarde blote eigendom', fmt.euro0(be), 'som'], ['Blote eigendom als deel van de waarde', fmt.pct(be / v.w * 100, 0)]]
      };
    },
    uitleg: 'Vruchtgebruik = waarde × ' + fmt.pct(N.rekenrente, 0) + ' × leeftijdsfactor van de vruchtgebruiker (hoe ouder, hoe lager de factor). Blote eigendom = volle waarde − vruchtgebruik.',
    letop: 'Indicatief: rekenrente en leeftijdsfactoren zijn een ' + BRON + '; controleer de actuele regels. Voor vruchtgebruik op twee levens, een vruchtgebruik voor bepaalde tijd of een ander werkelijk rendement gelden aparte regels. Laat de waardering bij een aangifte door een notaris of fiscalist toetsen.'
  });

  RT.add({
    id: 'waarde-periodieke-uitkering', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Fiscale waarde periodieke uitkering',
    intro: 'De waarde van een periodieke uitkering voor de schenk- of erfbelasting: voor een vaste looptijd, levenslang of een combinatie.',
    kw: 'periodieke uitkering waarde rente lijfrente levenslang erfbelasting schenkbelasting leeftijdsfactor',
    peildatum: N.peildatum, fiscaal: ['Rekenrente', 'Leeftijdsfactoren'],
    velden: [
      { k: 'j', l: 'Uitkering per jaar', s: 'eur', std: 12000 },
      { k: 'soort', l: 'Soort uitkering', s: 'keuze', opties: [['vast', 'Vaste looptijd, los van het leven'], ['leven', 'Levenslang'], ['beide', 'Vaste looptijd, stopt eerder bij overlijden']], std: 'vast', breed: true },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'jaar', std: 15, als: v => v.soort !== 'leven' },
      { k: 'l', l: 'Leeftijd van de gerechtigde', s: 'num', na: 'jaar', std: 68, als: v => v.soort !== 'vast' }
    ],
    bereken(v) {
      if (v.j <= 0) return { fout: 'Vul een jaarbedrag groter dan nul in.' };
      const i = N.rekenrente / 100, rijen = [];
      let waarde;
      const cw = v.soort !== 'leven' ? annHoofdsom(v.j, i, Math.round(v.n)) : NaN;
      const lv = v.soort !== 'vast' ? v.j * leeftijdsfactor(v.l) : NaN;
      if (v.soort !== 'leven') { if (Math.round(v.n) <= 0) return { fout: 'Vul een looptijd groter dan nul in.' }; rijen.push(['Contante waarde tegen ' + fmt.pct(N.rekenrente, 0), fmt.euro0(cw)], ['Som van de uitkeringen', fmt.euro0(v.j * Math.round(v.n))]); }
      if (v.soort !== 'vast') rijen.push(['Leeftijdsfactor', fmt.getal(leeftijdsfactor(v.l))], ['Waarde levenslang', fmt.euro0(lv)]);
      if (v.soort === 'vast') waarde = cw; else if (v.soort === 'leven') waarde = lv; else waarde = Math.min(cw, lv);
      rijen.push(['Te hanteren waarde', fmt.euro0(waarde), 'som']);
      return { lbl: 'Fiscale waarde', groot: fmt.euro0(waarde), onder: v.soort === 'beide' ? 'het laagste van vaste looptijd en levenslang' : '', rijen };
    },
    uitleg: 'Vaste looptijd: contante waarde van de jaarbedragen tegen ' + fmt.pct(N.rekenrente, 0) + ', uitgaande van betaling aan het eind van elk jaar. Levenslang: jaarbedrag × leeftijdsfactor. Stopt de uitkering eerder bij overlijden, dan geldt het laagste van beide.',
    letop: 'Indicatief: rekenrente en leeftijdsfactoren zijn een ' + BRON + '; controleer de actuele regels. Voor uitkeringen op meer levens, met indexatie of met betaling aan het begin van het jaar gelden afwijkende berekeningen. Laat de waardering bij een aangifte toetsen.'
  });

  RT.add({
    id: 'giftenaftrek', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Giftenaftrek (gewone en periodieke giften)',
    intro: 'Hoeveel van een gift aan een goed doel is aftrekbaar, wat levert dat aan belasting op en wat kost de gift dan netto?',
    kw: 'giftenaftrek gift goede doelen anbi periodieke gift drempel aftrek netto kosten',
    peildatum: N.peildatum, fiscaal: ['Drempel en maximum gewone giften', 'Plafond periodieke giften', 'Tarieven box 1', 'Maximaal aftrektarief'],
    velden: [
      { k: 'soort', l: 'Soort gift', s: 'keuze', opties: [['gewoon', 'Gewone gift'], ['per', 'Periodieke gift (minimaal 5 jaar, vastgelegd)']], std: 'gewoon', breed: true },
      { k: 'g', l: 'Giften per jaar', s: 'eur', std: 2000 },
      { k: 'ink', l: 'Drempelinkomen', s: 'eur', std: 65000, als: v => v.soort === 'gewoon', tip: 'Verzamelinkomen vóór persoonsgebonden aftrek.' },
      { k: 'pink', l: 'Drempelinkomen fiscaal partner', s: 'eur', std: 0, opt: true, als: v => v.soort === 'gewoon' },
      { k: 'jr', l: 'Looptijd periodieke gift', s: 'num', na: 'jaar', std: 5, als: v => v.soort === 'per' },
      { k: 'sch', l: 'Hoogste schijf waarin het inkomen valt', s: 'keuze', opties: SCHIJF, std: '2' }
    ],
    bereken(v) {
      const tar = aftrekTarief(v.sch), rijen = [];
      let aftrek;
      if (v.soort === 'gewoon') {
        const ink = v.ink + v.pink, dr = Math.max(N.gift.drempelMin, ink * N.gift.drempelPct / 100), max = ink * N.gift.maxPct / 100;
        aftrek = Math.min(pos(v.g - dr), max);
        rijen.push(['Drempelinkomen samen', fmt.euro0(ink)], ['Drempel', fmt.euro(dr)], ['Maximale aftrek', fmt.euro(max)]);
      } else {
        aftrek = Math.min(v.g, N.gift.periodiekPlafond);
        rijen.push(['Drempel', 'geen']);
      }
      const voordeel = aftrek * tar / 100;
      rijen.push(['Aftrekbaar', fmt.euro(aftrek)], ['Aftrektarief', fmt.pct(tar, 2)], ['Netto kosten van de gift', fmt.euro(v.g - voordeel), 'som'], ['Effectieve korting', v.g > 0 ? fmt.pct(voordeel / v.g * 100, 1) : '–']);
      if (v.soort === 'per') {
        rijen.push(['Belastingvoordeel over ' + fmt.getal(v.jr) + ' jaar', fmt.euro(voordeel * v.jr)], ['Gift met dezelfde netto kosten bij volledige aftrek', fmt.euro(v.g / (1 - tar / 100))]);
        if (v.sch === '3') rijen.push(['Gemist door de tariefbeperking', fmt.euro(aftrek * (NR.box1.tarief3 - tar) / 100)]);
      }
      return { lbl: 'Belastingvoordeel', groot: fmt.euro(voordeel), onder: 'per jaar', rijen };
    },
    uitleg: 'Gewone gift: aftrekbaar is het deel boven de drempel (' + fmt.pct(N.gift.drempelPct, 0) + ' van het gezamenlijke drempelinkomen, minimaal ' + fmt.euro0(N.gift.drempelMin) + '), tot ' + fmt.pct(N.gift.maxPct, 0) + ' van dat inkomen. Periodieke gift: volledig aftrekbaar tot het plafond (' + fmt.euro0(N.gift.periodiekPlafond) + '). Voordeel = aftrek × tarief van de hoogste schijf, in de derde schijf begrensd op het maximale aftrektarief.',
    letop: INDICATIEF + ' Drempel, maximum en plafond zijn een ' + BRON + '; schijftarieven en het maximale aftrektarief komen uit het centrale normenbestand. Alleen giften aan een ANBI of steunstichting SBBI zijn aftrekbaar, met betaalbewijs. De extra aftrek (multiplier) voor culturele ANBI’s is vervallen. Bij de gewone gift nemen partners de giften samen; zit de aftrek in een lagere schijf, dan is het voordeel kleiner.'
  });

  const VPB_OPM = 'Uitgaande van winst die in de bv met vennootschapsbelasting is belast.';
  RT.add({
    id: 'box2-dividend', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Box 2-belasting op dividend',
    intro: 'De box 2-heffing over een dividenduitkering, en de totale druk als ook de vennootschapsbelasting op de onderliggende winst wordt meegeteld.',
    kw: 'box 2 dividend aanmerkelijk belang dga vennootschapsbelasting vpb druk',
    peildatum: NR.peildatum, fiscaal: ['Tarieven en grens box 2', 'Tarieven vpb'],
    velden: [
      { k: 'd', l: 'Dividend', s: 'eur', std: 120000 },
      { k: 'fp', l: 'Fiscaal partner (grens verdubbelt)', s: 'keuze', opties: [['1', 'Nee'], ['2', 'Ja, samen aanmerkelijk belang']], std: '1', breed: true },
      { k: 'vpb', l: 'Vpb over de winst', s: 'keuze', opties: VPB, std: '1', breed: true }
    ],
    bereken(v) {
      if (v.d <= 0) return { fout: 'Vul een dividend groter dan nul in.' };
      const s = box2(v.d, +v.fp), tv = vpbTarief(v.vpb), winst = v.d / (1 - tv / 100), vpb = winst - v.d, tot = vpb + s.belasting;
      return {
        lbl: 'Box 2-belasting', groot: fmt.euro(s.belasting), onder: fmt.pct(s.belasting / v.d * 100, 2) + ' van het dividend',
        rijen: [
          ['Tot de grens: ' + fmt.euro0(s.s1) + ' × ' + fmt.pct(NR.box2.tarief1, 1), fmt.euro(s.s1 * NR.box2.tarief1 / 100)],
          ['Daarboven: ' + fmt.euro0(s.s2) + ' × ' + fmt.pct(NR.box2.tarief2, 1), fmt.euro(s.s2 * NR.box2.tarief2 / 100)],
          ['Netto dividend', fmt.euro(v.d - s.belasting)],
          ['Winst vóór vpb', fmt.euro(winst)], ['Vpb (' + fmt.pct(tv, 1) + ')', fmt.euro(vpb)],
          ['Totale druk vpb en box 2', fmt.pct(tot / winst * 100, 2), 'som']
        ]
      };
    },
    uitleg: 'Box 2 = dividend tot de grens × laag tarief + rest × hoog tarief (grens × 2 met fiscaal partner). Winst vóór vpb = dividend / (1 − vpb-tarief). Totale druk = (vpb + box 2) / winst vóór vpb. ' + VPB_OPM,
    letop: 'De tarieven en de grens komen uit het centrale normenbestand (' + NR.peildatum + ', nog niet allemaal geverifieerd). Het vpb-tarief is één tarief over de hele winst; bij winst rond de vpb-grens ligt de werkelijke druk ertussenin. Bij een fiscaal partner moet het aanmerkelijk belang gezamenlijk zijn om de grens te verdubbelen. Geen advies over het moment of de hoogte van een uitkering.'
  });

  RT.add({
    id: 'box2-druk', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Box 2-druk',
    intro: 'De gemiddelde en marginale box 2-druk bij een inkomen uit aanmerkelijk belang, met een overzicht bij verschillende bedragen.',
    kw: 'box 2 druk gemiddeld marginaal tarief dividend aanmerkelijk belang grens',
    peildatum: NR.peildatum, fiscaal: ['Tarieven en grens box 2'],
    velden: [
      { k: 'd', l: 'Inkomen uit aanmerkelijk belang', s: 'eur', std: 120000 },
      { k: 'fp', l: 'Fiscaal partner (grens verdubbelt)', s: 'keuze', opties: [['1', 'Nee'], ['2', 'Ja, samen aanmerkelijk belang']], std: '1', breed: true }
    ],
    bereken(v) {
      if (v.d <= 0) return { fout: 'Vul een bedrag groter dan nul in.' };
      const p = +v.fp, grens = NR.box2.grens * p, s = box2(v.d, p);
      const reeks = [25000, 50000, grens, 100000, 150000, 250000, 500000].filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => a - b);
      return {
        lbl: 'Gemiddelde box 2-druk', groot: fmt.pct(s.belasting / v.d * 100, 2), onder: 'box 2-belasting ' + fmt.euro(s.belasting),
        rijen: [['Marginaal tarief', fmt.pct(v.d > grens ? NR.box2.tarief2 : NR.box2.tarief1, 1)], ['Grens laag tarief', fmt.euro0(grens)], ['Netto', fmt.euro(v.d - s.belasting), 'som']],
        tabel: { titel: 'Druk bij andere bedragen', kop: ['Inkomen', 'Belasting', 'Gemiddeld'], rijen: reeks.map(x => { const b = box2(x, p).belasting; return [fmt.euro0(x), fmt.euro0(b), fmt.pct(b / x * 100, 2)]; }) }
      };
    },
    uitleg: 'Box 2 = inkomen tot de grens × laag tarief + rest × hoog tarief. Gemiddelde druk = belasting / inkomen; die loopt boven de grens geleidelijk op van het lage naar het hoge tarief.',
    letop: 'De tarieven en de grens komen uit het centrale normenbestand (' + NR.peildatum + ', nog niet allemaal geverifieerd). Spreiden van uitkeringen over jaren onder de grens kan de druk verlagen, maar hangt af van de financiële positie van de bv (uitkeringstoets) en de privébehoefte.'
  });

  RT.add({
    id: 'box2-marginaal', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Druk op extra dividend',
    intro: 'Wat kost een extra dividenduitkering bovenop wat al is uitgekeerd: box 2 over het extra deel plus de vennootschapsbelasting die in de bv al is betaald?',
    kw: 'box 2 marginaal extra dividend druk vpb dga',
    peildatum: NR.peildatum, fiscaal: ['Tarieven en grens box 2', 'Tarieven vpb'],
    velden: [
      { k: 'd', l: 'Al uitgekeerd dit jaar', s: 'eur', std: 68000, opt: true },
      { k: 'e', l: 'Extra dividend', s: 'eur', std: 25000 },
      { k: 'fp', l: 'Fiscaal partner (grens verdubbelt)', s: 'keuze', opties: [['1', 'Nee'], ['2', 'Ja, samen aanmerkelijk belang']], std: '1', breed: true },
      { k: 'vpb', l: 'Vpb over de winst', s: 'keuze', opties: VPB, std: '1', breed: true }
    ],
    bereken(v) {
      if (v.e <= 0) return { fout: 'Vul een extra dividend groter dan nul in.' };
      const p = +v.fp, extra = box2(v.d + v.e, p).belasting - box2(v.d, p).belasting;
      const tv = vpbTarief(v.vpb), winst = v.e / (1 - tv / 100), vpb = winst - v.e;
      return {
        lbl: 'Gecombineerde druk op het extra dividend', groot: fmt.pct((vpb + extra) / winst * 100, 2), onder: 'vpb en box 2 samen, op de winst vóór vpb',
        rijen: [
          ['Box 2 over het extra dividend', fmt.euro(extra)], ['Box 2-druk op het extra dividend', fmt.pct(extra / v.e * 100, 2)],
          ['Benodigde winst vóór vpb', fmt.euro(winst)], ['Vpb daarover (' + fmt.pct(tv, 1) + ')', fmt.euro(vpb)],
          ['Totale belasting', fmt.euro(vpb + extra)], ['Netto in privé', fmt.euro(v.e - extra), 'som']
        ]
      };
    },
    uitleg: 'Box 2 extra = box 2(al uitgekeerd + extra) − box 2(al uitgekeerd). Winst vóór vpb = extra / (1 − vpb-tarief). Gecombineerde druk = (vpb + box 2 extra) / winst vóór vpb.',
    letop: 'De tarieven en de grens komen uit het centrale normenbestand (' + NR.peildatum + ', nog niet allemaal geverifieerd). Het vpb-tarief is vereenvoudigd tot één tarief. Geen advies over de keuze tussen loon en dividend; houd ook rekening met de gebruikelijkloonregeling en de uitkeringstoets.'
  });

  RT.add({
    id: 'box3-werkelijk-rendement', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Box 3: werkelijk tegenover forfaitair',
    intro: 'Is het werkelijke rendement lager dan het forfaitaire, dan kan de klant via tegenbewijs over het werkelijke rendement worden belast. Wat scheelt dat?',
    kw: 'box 3 tegenbewijs tegenbewijsregeling werkelijk rendement forfaitair teruggaaf',
    peildatum: NR.peildatum, fiscaal: ['Heffingsvrij vermogen', 'Forfaits bank, overig en schulden', 'Schuldendrempel', 'Tarief box 3'],
    velden: [
      { k: 'bank', l: 'Banktegoeden (1 januari)', s: 'eur', std: 80000, opt: true },
      { k: 'bel', l: 'Beleggingen en overige bezittingen (1 januari)', s: 'eur', std: 200000, opt: true },
      { k: 'sch', l: 'Schulden (1 januari)', s: 'eur', std: 0, opt: true },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' },
      { k: 'rente', l: 'Ontvangen rente', s: 'eur', std: 1400, opt: true },
      { k: 'div', l: 'Dividend, huur en andere opbrengsten', s: 'eur', std: 4200, opt: true },
      { k: 'wv', l: 'Waardeverandering (ook niet verkocht)', s: 'bedrag', std: -6000, opt: true, tip: 'Negatief bij een waardedaling.' },
      { k: 'br', l: 'Betaalde rente op schulden', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const b = NR.box3, f = box3Met(b, v.bank, v.bel, v.sch, +v.fp);
      const werk = v.rente + v.div + v.wv - v.br, belWerk = pos(werk) * b.tarief / 100, verschil = pos(f.belasting - belWerk);
      return {
        lbl: 'Verschil in box 3-belasting', groot: fmt.euro(verschil), onder: verschil > 0 ? 'lager via tegenbewijs' : 'tegenbewijs levert niets op',
        rijen: [
          ['Forfaitair rendement', fmt.euro(f.rendement)], ['Belastbaar voordeel (forfaitair)', fmt.euro(f.voordeel)], ['Belasting forfaitair', fmt.euro(f.belasting)],
          ['Werkelijk rendement', fmt.euro(werk)], ['Belasting over werkelijk rendement', fmt.euro(belWerk)], ['Verschil', fmt.euro(verschil), 'som']
        ],
        signalen: verschil > 0 ? ['Het werkelijke rendement moet over het hele box 3-vermogen worden aangetoond, inclusief niet-gerealiseerde waardestijging van bijvoorbeeld vastgoed.'] : []
      };
    },
    uitleg: 'Forfaitair: zoals bij <a href="#box3-heffing">Belasting box 3</a>. Werkelijk rendement = rente + dividend en huur + waardeverandering (ook ongerealiseerd) − betaalde rente op schulden. Belasting werkelijk = werkelijk rendement × tarief, zonder heffingsvrij vermogen. Het verschil is wat tegenbewijs zou opleveren.',
    letop: 'Indicatief. Kosten zijn (behalve rente op schulden) niet aftrekbaar. Voorwaarden, termijnen en de precieze vergelijking volgen uit de wettelijke tegenbewijsregeling en kunnen wijzigen; controleer de actuele regels. De normen (' + NR.peildatum + ') zijn nog niet allemaal geverifieerd. Dit is fiscaal advies: laat een verzoek door een fiscalist beoordelen.'
  });

  RT.add({
    id: 'box3-twee-jaren', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Box 3 in twee jaren vergelijken',
    intro: 'Hetzelfde vermogen doorgerekend met twee sets box 3-normen, bijvoorbeeld dit jaar en volgend jaar. Hoeveel verandert de heffing?',
    kw: 'box 3 vergelijken jaren verschil forfait heffingsvrij vermogen wijziging',
    peildatum: N.peildatum, fiscaal: ['Heffingsvrij vermogen', 'Forfaits bank en overig', 'Tarief box 3', 'Tweede set normen (eigen invoer)'],
    velden: [
      { k: 'bank', l: 'Banktegoeden', s: 'eur', std: 80000, opt: true },
      { k: 'bel', l: 'Overige bezittingen', s: 'eur', std: 150000, opt: true },
      { k: 'sch', l: 'Schulden', s: 'eur', std: 0, opt: true },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' },
      { k: 'hvA', l: 'Set A: heffingsvrij vermogen p.p.', s: 'eur', std: NR.box3.heffingsvrij },
      { k: 'f1A', l: 'Set A: forfait bank', s: 'pct', std: NR.box3.forfaitBank },
      { k: 'f2A', l: 'Set A: forfait overig', s: 'pct', std: NR.box3.forfaitOverig },
      { k: 'tA', l: 'Set A: tarief', s: 'pct', std: NR.box3.tarief },
      { k: 'hvB', l: 'Set B: heffingsvrij vermogen p.p.', s: 'eur', std: N.box3B.heffingsvrij },
      { k: 'f1B', l: 'Set B: forfait bank', s: 'pct', std: N.box3B.forfaitBank },
      { k: 'f2B', l: 'Set B: forfait overig', s: 'pct', std: N.box3B.forfaitOverig },
      { k: 'tB', l: 'Set B: tarief', s: 'pct', std: N.box3B.tarief }
    ],
    bereken(v) {
      const p = +v.fp, set = (hv, f1, f2, t) => Object.assign({}, NR.box3, { heffingsvrij: hv, forfaitBank: f1, forfaitOverig: f2, tarief: t });
      const A = box3Met(set(v.hvA, v.f1A, v.f2A, v.tA), v.bank, v.bel, v.sch, p), B = box3Met(set(v.hvB, v.f1B, v.f2B, v.tB), v.bank, v.bel, v.sch, p);
      const d = B.belasting - A.belasting;
      return {
        lbl: 'Verschil (B − A)', groot: (d >= 0 ? '+ ' : '') + fmt.euro(d), onder: A.belasting > 0 ? fmt.pct(d / A.belasting * 100, 1) + ' ten opzichte van set A' : 'per jaar',
        rijen: [['Box 3-belasting set A', fmt.euro(A.belasting)], ['Box 3-belasting set B', fmt.euro(B.belasting)], ['Verschil per maand', fmt.euro(d / 12), 'som']],
        tabel: { titel: 'Uitsplitsing', kop: ['', 'Set A', 'Set B'], rijen: [
          ['Forfaitair rendement', fmt.euro0(A.rendement), fmt.euro0(B.rendement)], ['Grondslag', fmt.euro0(A.grondslag), fmt.euro0(B.grondslag)],
          ['Belastbaar voordeel', fmt.euro0(A.voordeel), fmt.euro0(B.voordeel)], ['Belasting', fmt.euro0(A.belasting), fmt.euro0(B.belasting)]] }
      };
    },
    uitleg: 'Beide sets rekenen met de methode van <a href="#box3-heffing">Belasting box 3</a>. Forfait en drempel voor schulden komen voor beide sets uit het centrale normenbestand.',
    letop: 'Set A staat standaard op de centrale normen (' + NR.peildatum + '); set B op een ' + BRON + '. Vul voor een echte vergelijking de vastgestelde normen van beide jaren in. Indicatief: controleer de actuele norm.'
  });

  RT.add({
    id: 'groen-beleggen', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Groene beleggingen in box 3',
    intro: 'Groene beleggingen zijn tot een maximum vrijgesteld in box 3 en geven daarnaast een heffingskorting. Wat levert dat op?',
    kw: 'groene beleggingen groen sparen vrijstelling box 3 heffingskorting groenfonds',
    peildatum: N.peildatum, fiscaal: ['Vrijstelling groene beleggingen', 'Heffingskorting groen', 'Heffingsvrij vermogen', 'Forfait overige bezittingen', 'Tarief box 3'],
    velden: [
      { k: 'groen', l: 'Groene beleggingen', s: 'eur', std: 30000 },
      { k: 'ov', l: 'Overige beleggingen', s: 'eur', std: 150000, opt: true },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' }
    ],
    bereken(v) {
      const p = +v.fp, vrij = Math.min(v.groen, N.groen.vrijstelling * p);
      const met = box3Met(NR.box3, 0, v.ov + v.groen - vrij, 0, p), zonder = box3Met(NR.box3, 0, v.ov + v.groen, 0, p);
      const korting = vrij * N.groen.kortingPct / 100, totaal = zonder.belasting - met.belasting + korting;
      return {
        lbl: 'Fiscaal voordeel per jaar', groot: fmt.euro(totaal), onder: vrij > 0 ? fmt.pct(totaal / vrij * 100, 2) + ' over het vrijgestelde deel' : '',
        rijen: [['Vrijgesteld groen vermogen', fmt.euro0(vrij)], ['Box 3 zonder groenvrijstelling', fmt.euro(zonder.belasting)], ['Box 3 met groenvrijstelling', fmt.euro(met.belasting)], ['Heffingskorting groen', fmt.euro(korting)], ['Totaal voordeel', fmt.euro(totaal), 'som']]
      };
    },
    uitleg: 'Vrijgesteld = groene beleggingen tot ' + fmt.euro0(N.groen.vrijstelling) + ' per persoon. Box 3 wordt berekend met en zonder dat bedrag (alles als overige bezittingen). Heffingskorting = vrijgesteld bedrag × ' + fmt.pct(N.groen.kortingPct, 1) + '.',
    letop: INDICATIEF + ' Vrijstelling en heffingskorting zijn een ' + BRON + '; de regeling wordt afgebouwd. Groene fondsen hebben vaak een lager bruto rendement: vergelijk het netto resultaat, niet alleen het fiscale voordeel. De heffingskorting werkt alleen als er inkomstenbelasting te verrekenen is.'
  });

  RT.add({
    id: 'box3-werkelijk-stelsel', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Box 3 op werkelijk rendement (aangekondigd)',
    intro: 'Een scenario voor het aangekondigde box 3-stelsel op werkelijk rendement: jaarlijkse heffing over rente, dividend en koersresultaat, vastgoed pas bij verkoop.',
    kw: 'box 3 werkelijk rendement nieuw stelsel aanwas vermogenswinst 2028 wetsvoorstel',
    peildatum: N.peildatum, fiscaal: ['Heffingsvrij resultaat', 'Tarief box 3'],
    velden: [
      { k: 'bank', l: 'Banktegoeden', s: 'eur', std: 80000, opt: true },
      { k: 'bel', l: 'Liquide beleggingen', s: 'eur', std: 200000, opt: true },
      { k: 'rr', l: 'Rente op banktegoeden', s: 'pct', std: 1.8 },
      { k: 'rd', l: 'Dividend op beleggingen', s: 'pct', std: 2 },
      { k: 'rk', l: 'Koersresultaat op beleggingen', s: 'pct', std: 5 },
      { k: 'og', l: 'Vastgoed (zoals een verhuurde woning)', s: 'eur', std: 0, opt: true },
      { k: 'rh', l: 'Netto huur op vastgoed', s: 'pct', std: 4 },
      { k: 'rw', l: 'Waardestijging vastgoed', s: 'pct', std: 3 },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' }
    ],
    bereken(v) {
      const p = +v.fp, t = NR.box3.tarief, vrij = N.werkelijk.heffingsvrijResultaat * p;
      const aanwas = v.bank * v.rr / 100 + v.bel * (v.rd + v.rk) / 100, huur = v.og * v.rh / 100, ogWinst = v.og * v.rw / 100;
      const resultaat = aanwas + huur, belastbaar = pos(resultaat - vrij), heffing = belastbaar * t / 100, totaal = v.bank + v.bel + v.og;
      return {
        lbl: 'Heffing per jaar (scenario)', groot: fmt.euro(heffing), onder: totaal > 0 ? fmt.pct(heffing / totaal * 100, 3) + ' van het vermogen' : '',
        rijen: [
          ['Rente', fmt.euro(v.bank * v.rr / 100)], ['Dividend en koersresultaat', fmt.euro(v.bel * (v.rd + v.rk) / 100)], ['Huur vastgoed', fmt.euro(huur)],
          ['Heffingsvrij resultaat', fmt.euro(-vrij)], ['Belastbaar resultaat', fmt.euro(belastbaar)], ['Heffing (' + fmt.pct(t, 0) + ')', fmt.euro(heffing), 'som'],
          ['Uitgestelde heffing op waardestijging vastgoed', fmt.euro(ogWinst * t / 100)]
        ],
        signalen: resultaat < 0 ? ['Het resultaat is negatief. In het aangekondigde stelsel kan een verlies onder voorwaarden worden verrekend met latere jaren.'] : []
      };
    },
    uitleg: 'Jaarlijks belast: rente + dividend + koersresultaat (aanwas, ook ongerealiseerd) + huur, min het heffingsvrije resultaat (' + fmt.euro0(N.werkelijk.heffingsvrijResultaat) + ' p.p.), maal het tarief. De waardestijging van vastgoed wordt pas bij verkoop belast (vermogenswinst) en staat apart.',
    letop: 'Dit stelsel is aangekondigd en geldt nog niet; de invoering is meermaals uitgesteld en de details kunnen veranderen. Gebruik de uitkomst alleen als scenario. Heffingsvrij resultaat is een ' + BRON + '; het tarief komt uit het centrale normenbestand. Kosten en verliesverrekening zijn niet berekend.'
  });

  RT.add({
    id: 'aanwas-of-vermogenswinst', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Aanwas- of vermogenswinstbelasting',
    intro: 'Jaarlijks belasting over de waardestijging (aanwas) of pas bij verkoop (vermogenswinst): wat scheelt het uitstel na een aantal jaren?',
    kw: 'vermogensaanwasbelasting vermogenswinstbelasting uitstel belasting rendement box 3 vergelijken',
    peildatum: NR.peildatum, fiscaal: ['Tarief box 3'],
    velden: [
      { k: 'w', l: 'Beginwaarde belegging', s: 'eur', std: 250000 },
      { k: 'r', l: 'Rendement per jaar', s: 'pct', std: 6 },
      { k: 'n', l: 'Beleggingshorizon', s: 'num', na: 'jaar', std: 15 },
      { k: 't', l: 'Tarief', s: 'pct', std: NR.box3.tarief }
    ],
    bereken(v) {
      const n = Math.round(v.n), r = v.r / 100, t = v.t / 100;
      if (v.w <= 0 || n <= 0 || n > 100) return { fout: 'Vul een beginwaarde groter dan nul en een horizon van 1 tot 100 jaar in.' };
      let aanwas = v.w, betaald = 0; const rijen = [];
      for (let j = 1; j <= n; j++) {
        const groei = aanwas * r, bel = pos(groei) * t; aanwas += groei - bel; betaald += bel;
        const wv = v.w * Math.pow(1 + r, j);
        rijen.push([String(j), fmt.euro0(aanwas), fmt.euro0(wv - pos(wv - v.w) * t)]);
      }
      const eind = v.w * Math.pow(1 + r, n), belWinst = pos(eind - v.w) * t, netto = eind - belWinst;
      return {
        lbl: 'Voordeel van belasten bij verkoop', groot: fmt.euro(netto - aanwas), onder: 'na ' + n + ' jaar, netto na belasting',
        rijen: [['Eindwaarde bij aanwasbelasting', fmt.euro(aanwas)], ['Betaalde aanwasbelasting', fmt.euro(betaald)], ['Eindwaarde vóór belasting bij vermogenswinst', fmt.euro(eind)], ['Belasting bij verkoop', fmt.euro(belWinst)], ['Netto bij vermogenswinstbelasting', fmt.euro(netto), 'som']],
        tabel: { titel: 'Netto waarde per jaar', kop: ['Jaar', 'Aanwas', 'Verkoop in dat jaar'], rijen }
      };
    },
    uitleg: 'Aanwas: elk jaar groei = waarde × rendement; de belasting daarover gaat direct van de waarde af. Vermogenswinst: de waarde groeit onbelast tot w × (1 + r)<sup>n</sup>; bij verkoop wordt (eindwaarde − beginwaarde) × tarief betaald. Het verschil is het rente-op-rente-effect van uitstel.',
    letop: 'Een vereenvoudigd vergelijk met een vast rendement zonder dividend, kosten, verliesverrekening of heffingsvrij deel. In jaren met verlies betaalt de aanwasvariant hier niets terug. Het tarief staat standaard op het box 3-tarief (' + NR.peildatum + '); een toekomstig tarief kan afwijken.'
  });

  RT.add({
    id: 'box3-rechtsherstel', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Box 3: oud forfait tegenover spaarvariant',
    intro: 'Historisch (rechtsherstel over oude jaren): de heffing volgens het oude forfait met een vaste vermogensmix tegenover de spaarvariant op basis van de werkelijke samenstelling.',
    kw: 'box 3 rechtsherstel spaarvariant oude jaren kerstarrest vermogensmix bezwaar',
    peildatum: N.peildatum, fiscaal: ['Oud forfait (eigen invoer)', 'Forfaits van het belastingjaar (eigen invoer)', 'Heffingsvrij vermogen', 'Tarief'],
    velden: [
      { k: 'bank', l: 'Banktegoeden', s: 'eur', std: 200000, opt: true },
      { k: 'bel', l: 'Beleggingen en overige bezittingen', s: 'eur', std: 50000, opt: true },
      { k: 'sch', l: 'Schulden', s: 'eur', std: 0, opt: true },
      { k: 'hv', l: 'Heffingsvrij vermogen van dat jaar', s: 'eur', std: NR.box3.heffingsvrij },
      { k: 'oud', l: 'Gemiddeld forfait oude stelsel', s: 'pct', std: N.oudForfait, tip: 'Effectief forfaitair rendement uit de oorspronkelijke aanslag.' },
      { k: 'f1', l: 'Forfait bank in de spaarvariant', s: 'pct', std: NR.box3.forfaitBank },
      { k: 'f2', l: 'Forfait overig in de spaarvariant', s: 'pct', std: NR.box3.forfaitOverig },
      { k: 'f3', l: 'Forfait schulden in de spaarvariant', s: 'pct', std: NR.box3.forfaitSchuld },
      { k: 't', l: 'Tarief van dat jaar', s: 'pct', std: NR.box3.tarief }
    ],
    bereken(v) {
      const p = Object.assign({}, NR.box3, { heffingsvrij: v.hv, forfaitBank: v.f1, forfaitOverig: v.f2, forfaitSchuld: v.f3, tarief: v.t });
      const nieuw = box3Met(p, v.bank, v.bel, v.sch, 1), oud = nieuw.grondslag * v.oud / 100 * v.t / 100, d = oud - nieuw.belasting;
      return {
        lbl: 'Verschil oud min spaarvariant', groot: fmt.euro(d), onder: d > 0 ? 'de spaarvariant is gunstiger' : 'de spaarvariant is niet gunstiger',
        rijen: [['Grondslag', fmt.euro0(nieuw.grondslag)], ['Heffing oud forfait', fmt.euro(oud)], ['Heffing spaarvariant', fmt.euro(nieuw.belasting), 'som'], ['Aandeel banktegoeden', v.bank + v.bel > 0 ? fmt.pct(v.bank / (v.bank + v.bel) * 100, 1) : '–']]
      };
    },
    uitleg: 'Oud: (vermogen − heffingsvrij vermogen) × gemiddeld forfait × tarief. Spaarvariant: forfait per vermogenssoort (bank, overig, schulden boven de drempel), naar verhouding toegerekend aan de grondslag, maal tarief. Het laagste geldt bij rechtsherstel.',
    letop: 'Historisch: rechtsherstel gaat over oude belastingjaren met eigen normen. De standaardwaarden zijn ter illustratie (huidige normen en een gemiddeld oud forfait van ' + fmt.pct(N.oudForfait, 1) + ', ' + BRON + '); vul de normen van het betreffende jaar in. Of rechtsherstel nog mogelijk is hangt af van bezwaar, termijnen en de actuele wet- en regelgeving; controleer bij de Belastingdienst of een fiscalist.'
  });

  RT.add({
    id: 'verhuurde-woning-box3', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Verhuurde woning: waarde en heffing box 3',
    intro: 'Een verhuurde woning telt in box 3 mee voor de WOZ-waarde maal de leegwaarderatio. Welke waarde geldt en hoeveel box 3-belasting hoort daarbij?',
    kw: 'verhuurde woning leegwaarderatio box 3 woz huur vastgoed belegging',
    peildatum: N.peildatum, fiscaal: ['Leegwaarderatio', 'Heffingsvrij vermogen', 'Forfaits overig en schulden', 'Tarief box 3'],
    velden: [
      { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 300000 },
      { k: 'huur', l: 'Kale huur per maand', s: 'eur', std: 950 },
      { k: 'hyp', l: 'Schuld op de woning', s: 'eur', std: 150000, opt: true },
      { k: 'uit', l: 'Tijdelijke verhuur of verhuur aan verbonden persoon', s: 'keuze', opties: [['nee', 'Nee'], ['ja', 'Ja (ratio 100%)']], std: 'nee', breed: true },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' }
    ],
    bereken(v) {
      if (v.woz <= 0) return { fout: 'Vul een WOZ-waarde groter dan nul in.' };
      const huurPct = v.huur * 12 / v.woz * 100, ratio = v.uit === 'ja' ? 100 : leegwaarderatio(huurPct), waarde = v.woz * ratio / 100;
      const r = box3Met(NR.box3, 0, waarde, v.hyp, +v.fp);
      return {
        lbl: 'Waarde in box 3', groot: fmt.euro0(waarde), onder: 'leegwaarderatio ' + fmt.pct(ratio, 0),
        rijen: [['Jaarhuur als deel van de WOZ', fmt.pct(huurPct, 2)], ['Rendementsgrondslag', fmt.euro0(r.rg)], ['Forfaitair rendement', fmt.euro(r.rendement)], ['Box 3-belasting', fmt.euro(r.belasting), 'som'], ['Belasting als deel van de jaarhuur', v.huur > 0 ? fmt.pct(r.belasting / (v.huur * 12) * 100, 1) : '–']]
      };
    },
    uitleg: 'Jaarhuur / WOZ-waarde bepaalt de leegwaarderatio (hoe lager de huur, hoe lager de ratio). Waarde = WOZ × ratio. Daarna box 3 zoals bij <a href="#box3-heffing">Belasting box 3</a>, met de woning als overige bezitting en de schuld (boven de drempel) in mindering.',
    letop: INDICATIEF + ' De tabel met leegwaarderatio’s is een ' + BRON + ' en staat politiek ter discussie. Hier is alleen deze woning als box 3-vermogen meegenomen; ander vermogen verhoogt de heffing. Bij tijdelijke verhuur of verhuur aan een verbonden persoon geldt de volle WOZ-waarde.'
  });

  RT.add({
    id: 'verhuurde-woning-schenken-erven', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Verhuurde woning bij schenken of erven',
    intro: 'Bij schenken of erven van een verhuurde woning geldt de WOZ-waarde maal de leegwaarderatio. Wat is de waarde en hoeveel schenk- of erfbelasting volgt daaruit?',
    kw: 'verhuurde woning schenken erven leegwaarderatio erfbelasting schenkbelasting woz',
    peildatum: N.peildatum, fiscaal: ['Leegwaarderatio', 'Vrijstelling (eigen invoer)', 'Schijfgrens', 'Tarieven I, II en III'],
    velden: [
      { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 320000 },
      { k: 'huur', l: 'Kale huur per maand', s: 'eur', std: 900 },
      { k: 'uit', l: 'Tijdelijke verhuur of verhuur aan verbonden persoon', s: 'keuze', opties: [['nee', 'Nee'], ['ja', 'Ja (ratio 100%)']], std: 'nee', breed: true },
      { k: 'deel', l: 'Deel van de woning dat wordt verkregen', s: 'pct', std: 100 },
      { k: 'vr', l: 'Vrijstelling van de verkrijger', s: 'eur', std: NR.schenkErf.erfVrijstellingKind },
      { k: 'tg', l: 'Tariefgroep', s: 'keuze', opties: TARIEFGROEP, std: 'I', breed: true }
    ],
    bereken(v) {
      if (v.woz <= 0) return { fout: 'Vul een WOZ-waarde groter dan nul in.' };
      const huurPct = v.huur * 12 / v.woz * 100, ratio = v.uit === 'ja' ? 100 : leegwaarderatio(huurPct);
      const waarde = v.woz * ratio / 100 * v.deel / 100, belastbaar = pos(waarde - v.vr), s = heffingSE(belastbaar, v.tg);
      return {
        lbl: 'Schenk- of erfbelasting', groot: fmt.euro(s.belasting), onder: 'over een waarde van ' + fmt.euro0(waarde),
        rijen: [['Jaarhuur als deel van de WOZ', fmt.pct(huurPct, 2)], ['Leegwaarderatio', fmt.pct(ratio, 0)], ['Korting op de WOZ-waarde', fmt.euro0(v.woz * v.deel / 100 - waarde)], ['Belastbaar na vrijstelling', fmt.euro0(belastbaar)]].concat(schijfRijen(s), [['Effectieve druk', waarde > 0 ? fmt.pct(s.belasting / waarde * 100, 2) : '–', 'som']])
      };
    },
    uitleg: 'Waarde = WOZ × leegwaarderatio × verkregen deel. Belastbaar = waarde − vrijstelling. Daarover het tarief van de tariefgroep in twee schijven (grens ' + fmt.euro0(NR.schenkErf.schijfGrens) + ').',
    letop: INDICATIEF + ' De leegwaarderatio’s en de tarieven II en III zijn een ' + BRON + '. Een hypotheek of andere schuld op de woning, andere verkrijgingen in hetzelfde jaar en een eventuele vruchtgebruiker zijn niet meegenomen. Laat de waardering door een notaris of fiscalist toetsen.'
  });

  RT.add({
    id: 'erfbelasting-wettelijke-verdeling', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Erfbelasting bij de wettelijke verdeling',
    intro: 'Bij de wettelijke verdeling krijgt de langstlevende partner de goederen en krijgen de kinderen een vordering. Wie betaalt nu hoeveel erfbelasting?',
    kw: 'erfbelasting wettelijke verdeling langstlevende kinderen vordering kindsdeel',
    peildatum: NR.peildatum, fiscaal: ['Erfvrijstelling partner en kind', 'Schijfgrens', 'Tarieven tariefgroep I'],
    velden: [
      { k: 'nal', l: 'Saldo nalatenschap', s: 'eur', std: 600000, tip: 'Na aftrek van schulden en uitvaartkosten; bij een gemeenschap van goederen de helft.' },
      { k: 'kn', l: 'Aantal kinderen', s: 'num', std: 2 },
      { k: 'pv', l: 'Vermindering partnervrijstelling door nabestaandenpensioen', s: 'eur', std: 0, opt: true },
      { k: 'rente', l: 'Rente over de vordering van de kinderen', s: 'pct', std: 0, opt: true },
      { k: 'jr', l: 'Verwacht aantal jaren tot opeisbaar', s: 'num', na: 'jaar', std: 15 }
    ],
    bereken(v) {
      const kn = Math.round(v.kn);
      if (v.nal <= 0 || kn < 1) return { fout: 'Vul een positieve nalatenschap en minstens één kind in.' };
      const deel = v.nal / (kn + 1), vrijP = Math.max(N.erf.partnerMinimum, NR.schenkErf.erfVrijstellingPartner - v.pv);
      const bP = heffingSE(pos(deel - vrijP), 'I').belasting, bK = heffingSE(pos(deel - NR.schenkErf.erfVrijstellingKind), 'I').belasting;
      const vord = deel * Math.pow(1 + v.rente / 100, v.jr);
      return {
        lbl: 'Totale erfbelasting', groot: fmt.euro(bP + bK * kn), onder: (kn + 1) + ' erfgenamen met elk ' + fmt.euro0(deel),
        rijen: [['Erfdeel per erfgenaam', fmt.euro0(deel)], ['Erfbelasting langstlevende', fmt.euro(bP)], ['Erfbelasting per kind', fmt.euro(bK)], ['Vordering per kind na ' + fmt.getal(v.jr) + ' jaar', fmt.euro0(vord), 'som']],
        signalen: ['De kinderen betalen nu erfbelasting over een vordering die zij vaak pas bij het overlijden van de langstlevende krijgen. In de praktijk betaalt de langstlevende deze belasting vaak voor; dat verlaagt de vordering. Zie voor de verdeling ook <a href="#erfdeel">Erfdelen bij de wettelijke verdeling</a>.']
      };
    },
    uitleg: 'Erfdeel = nalatenschap / (partner + aantal kinderen). Partner: erfbelasting over erfdeel − partnervrijstelling; kind: over erfdeel − kindvrijstelling, beide in tariefgroep I. De vordering groeit met de gekozen rente: deel × (1 + rente)<sup>jaren</sup>.',
    letop: INDICATIEF + ' Vrijstellingen en tarieven komen uit het centrale normenbestand, het partnerminimum is een ' + BRON + '. Een rente op de vordering, een testament (bijvoorbeeld met een opeisbaarheidsclausule) en de tweede nalatenschap beïnvloeden de totale erfbelasting sterk. Laat dit door een notaris beoordelen.'
  });

  RT.add({
    id: 'giften-uit-bv', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Giften vanuit de bv',
    intro: 'Een gift vanuit de bv verlaagt de vennootschapsbelasting, binnen een maximum. Hoeveel is aftrekbaar en wat kost de gift netto, in de bv en omgerekend naar privé?',
    kw: 'gift bv vennootschapsbelasting giftenaftrek vpb dga goede doelen zakelijke gift',
    peildatum: N.peildatum, fiscaal: ['Maximum giftenaftrek vpb', 'Tarieven en grens vpb', 'Tarieven box 2'],
    velden: [
      { k: 'g', l: 'Gift uit de bv', s: 'eur', std: 15000 },
      { k: 'w', l: 'Fiscale winst vóór de gift', s: 'eur', std: 220000 },
      { k: 'b2', l: 'Box 2-tarief bij uitkeren', s: 'keuze', opties: B2, std: '1', breed: true }
    ],
    bereken(v) {
      if (v.g <= 0) return { fout: 'Vul een gift groter dan nul in.' };
      const max = Math.min(pos(v.w) * N.giftBv.maxPct / 100, N.giftBv.maxBedrag), aftrek = Math.min(v.g, max);
      const besparing = F.vpb(v.w) - F.vpb(pos(v.w - aftrek)), nettoBv = v.g - besparing, prive = nettoBv * (1 - b2Tarief(v.b2) / 100);
      return {
        lbl: 'Netto kosten in de bv', groot: fmt.euro(nettoBv), onder: 'na ' + fmt.euro(besparing) + ' minder vennootschapsbelasting',
        rijen: [['Maximale aftrek', fmt.euro0(max)], ['Aftrekbaar', fmt.euro(aftrek)], ['Niet aftrekbaar', fmt.euro(v.g - aftrek)], ['Vpb zonder gift', fmt.euro(F.vpb(v.w))], ['Vpb met gift', fmt.euro(F.vpb(pos(v.w - aftrek)))], ['Opoffering omgerekend naar privé (na box 2)', fmt.euro(prive), 'som']],
        signalen: v.g > max ? ['Het deel boven het maximum is niet aftrekbaar. Dient de gift vooral het privébelang van de aandeelhouder, dan kan de fiscus die als uitdeling (box 2) zien.'] : []
      };
    },
    uitleg: 'Aftrekbaar = gift, maximaal ' + fmt.pct(N.giftBv.maxPct, 0) + ' van de winst en ' + fmt.euro0(N.giftBv.maxBedrag) + '. Besparing = vpb(winst) − vpb(winst − aftrek), met beide vpb-schijven. Opoffering privé = netto kosten in de bv × (1 − box 2-tarief): wat de aandeelhouder anders als dividend had overgehouden.',
    letop: INDICATIEF + ' Het maximum (percentage en bedrag) is een ' + BRON + '; vpb- en box 2-tarieven komen uit het centrale normenbestand. De ontvanger moet een ANBI zijn. Voor de afweging met geven in privé: zie <a href="#geven-prive-of-bv">Geven privé of via de bv</a>.'
  });

  RT.add({
    id: 'geven-prive-of-bv', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Geven privé of via de bv',
    intro: 'Een dga wil een goed doel steunen. Is geven in privé (giftenaftrek) of vanuit de bv (vpb-aftrek, geen box 2 bij uitkeren) voordeliger?',
    kw: 'gift prive bv dga vergelijken giftenaftrek vpb box 2 goede doelen',
    peildatum: N.peildatum, fiscaal: ['Drempel gewone giften', 'Tarieven box 1', 'Tarieven vpb', 'Tarieven box 2'],
    velden: [
      { k: 'g', l: 'Gift', s: 'eur', std: 10000 },
      { k: 'ink', l: 'Drempelinkomen privé', s: 'eur', std: 80000 },
      { k: 'per', l: 'In privé als periodieke gift', s: 'keuze', opties: [['ja', 'Ja (geen drempel)'], ['nee', 'Nee, gewone gift']], std: 'ja' },
      { k: 'sch', l: 'Hoogste schijf box 1', s: 'keuze', opties: SCHIJF, std: '3' },
      { k: 'vpb', l: 'Vpb over de winst', s: 'keuze', opties: VPB, std: '1', breed: true },
      { k: 'b2', l: 'Box 2-tarief bij uitkeren', s: 'keuze', opties: B2, std: '1', breed: true }
    ],
    bereken(v) {
      if (v.g <= 0) return { fout: 'Vul een gift groter dan nul in.' };
      let aftrek, dr = 0;
      if (v.per === 'ja') aftrek = Math.min(v.g, N.gift.periodiekPlafond);
      else { dr = Math.max(N.gift.drempelMin, v.ink * N.gift.drempelPct / 100); aftrek = Math.min(pos(v.g - dr), v.ink * N.gift.maxPct / 100); }
      const prive = v.g - aftrek * aftrekTarief(v.sch) / 100, bv = v.g * (1 - vpbTarief(v.vpb) / 100), bvPrive = bv * (1 - b2Tarief(v.b2) / 100);
      return {
        lbl: 'Voordeligst', groot: bvPrive < prive ? 'Geven vanuit de bv' : 'Geven in privé', onder: 'scheelt ' + fmt.euro(Math.abs(prive - bvPrive)) + ' netto in privé',
        rijen: [['Privé: drempel', fmt.euro(dr)], ['Privé: aftrekbaar', fmt.euro(aftrek)], ['Privé: netto kosten', fmt.euro(prive)], ['Bv: netto kosten na vpb', fmt.euro(bv)], ['Bv: omgerekend naar privé (na box 2)', fmt.euro(bvPrive), 'som']]
      };
    },
    uitleg: 'Privé: netto kosten = gift − aftrekbaar deel × aftrektarief (bij een gewone gift na de drempel en tot het maximum). Bv: netto kosten = gift × (1 − vpb-tarief); omgerekend naar privé × (1 − box 2-tarief), omdat dat geld anders als dividend was uitgekeerd.',
    letop: INDICATIEF + ' Drempel en maximum van de giftenaftrek zijn een ' + BRON + '. Het maximum voor giften uit de bv, de ruimte voor dividend en het moment van uitkeren zijn niet meegenomen; zie ook <a href="#giften-uit-bv">Giften vanuit de bv</a>. Geen fiscaal advies; laat de keuze door een fiscalist toetsen.'
  });

  RT.add({
    id: 'box3-netto-rendement', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Wat blijft over van het rendement na box 3',
    intro: 'De box 3-heffing staat los van het werkelijke rendement. Wat blijft er netto over, en bij welk rendement gaat alles op aan belasting?',
    kw: 'box 3 netto rendement belastingdruk inflatie break even sparen beleggen',
    peildatum: NR.peildatum, fiscaal: ['Heffingsvrij vermogen', 'Forfaits bank en overig', 'Tarief box 3'],
    velden: [
      { k: 'w', l: 'Vermogen', s: 'eur', std: 250000 },
      { k: 'soort', l: 'Soort vermogen', s: 'keuze', opties: [['bel', 'Beleggingen (overige bezittingen)'], ['bank', 'Banktegoeden']], std: 'bel' },
      { k: 'r', l: 'Werkelijk rendement per jaar', s: 'pct', std: 4 },
      { k: 'inf', l: 'Inflatie', s: 'pct', std: 2.5 },
      { k: 'fp', l: 'Fiscaal partner', s: 'keuze', opties: PARTNER, std: '1' }
    ],
    bereken(v) {
      if (v.w <= 0) return { fout: 'Vul een vermogen groter dan nul in.' };
      const b = v.soort === 'bank', r = box3Met(NR.box3, b ? v.w : 0, b ? 0 : v.w, 0, +v.fp);
      const bruto = v.w * v.r / 100, netto = bruto - r.belasting;
      return {
        lbl: 'Netto rendement na box 3', groot: fmt.euro(netto), onder: fmt.pct(netto / v.w * 100, 2) + ' van het vermogen',
        rijen: [['Bruto rendement', fmt.euro(bruto)], ['Box 3-belasting', fmt.euro(r.belasting)], ['Belasting als deel van het rendement', bruto > 0 ? fmt.pct(r.belasting / bruto * 100, 1) : 'meer dan het rendement'], ['Reëel na inflatie', fmt.euro(netto - v.w * v.inf / 100)], ['Rendement waarbij alles opgaat aan belasting', fmt.pct(r.belasting / v.w * 100, 2), 'som']]
      };
    },
    uitleg: 'Box 3 zoals bij <a href="#box3-heffing">Belasting box 3</a>, met het hele vermogen in één soort. Netto = vermogen × werkelijk rendement − box 3-belasting. Reëel = netto − vermogen × inflatie. Break-even = box 3-belasting / vermogen.',
    letop: 'Ligt het werkelijke rendement onder het forfait, dan kan de belasting meer dan 100% van het rendement zijn; kijk dan naar <a href="#box3-werkelijk-rendement">tegenbewijs</a>. Kosten en dividendbelasting zijn niet meegenomen. De normen (' + NR.peildatum + ') zijn nog niet allemaal geverifieerd.'
  });

  RT.add({
    id: 'schenkvrijstelling-woning', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Schenking voor de eigen woning',
    intro: 'De eenmalig verhoogde schenkvrijstelling voor de eigen woning (jubelton) is per 2024 vervallen. Welke vrijstelling geldt in welk jaar, en hoeveel schenkbelasting volgt?',
    kw: 'jubelton schenking eigen woning schenkvrijstelling vervallen 2024 eenmalig verhoogd',
    peildatum: N.peildatum, fiscaal: ['Vrijstelling eigen woning 2022 en 2023', 'Eenmalig verhoogde vrijstelling kind', 'Tarieven'],
    velden: [
      { k: 'b', l: 'Schenking', s: 'eur', std: 50000 },
      { k: 'jaar', l: 'Jaar van de schenking', s: 'num', std: 2026 },
      { k: 'rel', l: 'Ontvanger', s: 'keuze', opties: [['kind', 'Kind van 18 tot 40 jaar'], ['derde', 'Ander (18 tot 40 jaar)']], std: 'kind' }
    ],
    bereken(v) {
      const j = Math.round(v.jaar);
      if (j < 2017 || j > 2100) return { fout: 'Vul een jaar vanaf 2017 in.' };
      let vrij, regeling;
      if (j <= 2022) { vrij = N.woning.t2022; regeling = 'Eenmalig verhoogde vrijstelling eigen woning'; }
      else if (j === 2023) { vrij = N.woning.t2023; regeling = 'Verlaagde vrijstelling eigen woning (laatste jaar)'; }
      else if (v.rel === 'kind') { vrij = N.schenk.kind40; regeling = 'Vervallen; alleen de eenmalig verhoogde vrijstelling voor een kind'; }
      else { vrij = N.schenk.overig; regeling = 'Vervallen; alleen de gewone vrijstelling'; }
      const s = heffingSE(pos(v.b - vrij), v.rel === 'kind' ? 'I' : 'III');
      const sig = j >= 2024 ? ['De vrijstelling voor de eigen woning bestaat sinds 2024 niet meer. De schenking hoeft niet aan de woning te worden besteed, maar er is ook geen extra vrijstelling voor.'] : ['Historisch: dit jaar ligt achter ons. De schenking moest aan de eigen woning worden besteed (aankoop, verbouwing of aflossing) en in de aangifte zijn geclaimd.'];
      if (j < 2022) sig.push('Voor jaren vóór 2022 golden iets andere bedragen; hier is het bedrag van 2022 gebruikt.');
      return {
        lbl: 'Schenkbelasting', groot: fmt.euro(s.belasting), onder: regeling,
        rijen: [['Vrijstelling', fmt.euro0(vrij)], ['Belastbaar', fmt.euro0(pos(v.b - vrij))]].concat(schijfRijen(s), [['Netto voor de ontvanger', fmt.euro(v.b - s.belasting), 'som']]),
        signalen: sig
      };
    },
    uitleg: 'Tot en met 2022: verhoogde vrijstelling eigen woning (' + fmt.euro0(N.woning.t2022) + ' in 2022). In 2023: ' + fmt.euro0(N.woning.t2023) + '. Vanaf 2024: geen woningvrijstelling meer; een kind van 18 tot 40 jaar kan nog eenmalig ' + fmt.euro0(N.schenk.kind40) + ' vrij ontvangen. Daarna schenkbelasting in twee schijven.',
    letop: 'De jubelton is per 1 januari 2024 afgeschaft; deze hulp is voor oude jaren historisch. ' + INDICATIEF + ' Alle vrijstellingsbedragen in deze hulp zijn een ' + BRON + '. Andere schenkingen van dezelfde schenker in hetzelfde jaar tellen mee.'
  });
})(window.RT);
