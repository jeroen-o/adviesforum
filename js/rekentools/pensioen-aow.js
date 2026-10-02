/* Rekenhulpen – groep "pensioen-aow" (Pensioen en AOW).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { annHoofdsom, maandUitJaar } = RT.fin;
  const { annTermijn, eindwaarde } = RT.fin;
  const { plusMaanden, vandaag } = RT.kal;
  const F = RT.fisc, NR = RT.normen;

  /* Normen die (nog) niet in js/rekentools/normen.js staan. Peildatum 2026.
   * Alle waarden: waarde uit bron, niet geverifieerd. Controleer bij SVB, UWV, Belastingdienst of het pensioenfonds
   * en verplaats ze naar normen.js zodra de beheerder ze heeft vastgesteld. */
  const N = {
    peildatum: '2026',
    // AOW-leeftijd per kalenderjaar waarin die leeftijd wordt bereikt: [jaren, maanden]. Wettelijk vastgesteld t/m 'vastgesteldTot';
    // daarna is de laatste waarde een aanname (koppeling aan de levensverwachting wordt telkens vijf jaar vooraf bekendgemaakt).
    aowLeeftijd: {
      vastgesteldTot: 2030,
      tabel: { 2013: [65, 1], 2014: [65, 2], 2015: [65, 3], 2016: [65, 6], 2017: [65, 9], 2018: [66, 0], 2019: [66, 4], 2020: [66, 4],
        2021: [66, 4], 2022: [66, 7], 2023: [66, 10], 2024: [67, 0], 2025: [67, 0], 2026: [67, 0], 2027: [67, 0], 2028: [67, 3], 2029: [67, 3], 2030: [67, 3] }
    },
    // Bruto AOW per jaar exclusief vakantietoeslag bij 50 verzekerde jaren (waarde uit bron, niet geverifieerd)
    aow: { alleenstaandJaar: 17860, samenPpJaar: 12480, vakantietoeslagPct: 5, opbouwJaren: 50 },
    // Jaarruimte en reserveringsruimte lijfrente (waarde uit bron, niet geverifieerd)
    jaarruimte: { franchise: 18475, maxPremieInkomen: 137800, pct: 30, factorA: 6.27, maxReservering: 42108, reserveringJaren: 10 },
    // Vrijgestelde RVU-uitkering per maand (drempelbedrag; waarde uit bron, niet geverifieerd)
    rvuDrempelMaand: 2273,
    // Anw: bruto uitkering per jaar, vrijlating arbeidsinkomen per jaar en kortingspercentage daarboven (waarde uit bron, niet geverifieerd)
    anw: { jaar: 17000, vrijlatingJaar: 9000, kortingPct: 66.67 },
    // Overbruggingsregeling AOW (historisch): normen per maand en vermogensgrens (waarde uit bron, niet geverifieerd)
    obr: { alleenstaandMaand: 1400, samenMaand: 1960, vermogensgrens: 7575 },
    // Middelloonregeling: veelgebruikte franchise en opbouwpercentage (verschilt per fonds; waarde uit bron, niet geverifieerd)
    middelloon: { franchise: 18475, opbouwPct: 1.875 }
  };
  // Sterftemodel μ(x) = A + B·c^x (Gompertz-Makeham). Modelaanname, geen officiële tafel.
  const STERFTE = { m: { A: 0.0002, B: 0.0000125, c: 1.110 }, v: { A: 0.0004, B: 0.000005, c: 1.118 }, basisjaar: 2025 };

  const PEIL = NR.peildatum;
  const BOX1 = ['tarieven box 1', 'algemene heffingskorting', 'arbeidskorting', 'ouderenkorting'];
  const LEEF = [['alleen', 'Alleenstaand'], ['samen', 'Samenwonend of gehuwd']];
  const JANEE = [['ja', 'Ja'], ['nee', 'Nee']];
  const NIET_GEVERIFIEERD = 'Indicatief: deze hulp rekent met een norm die nog niet centraal is vastgesteld (peildatum ' + N.peildatum + '). Controleer de actuele norm.';

  // Volledige jaren, maanden en dagen van a tot b
  const ymd = (a, b) => {
    let j = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
    if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { j--; m += 12; }
    return { j, m, d };
  };
  const tekstJmd = x => x.j + ' jaar, ' + x.m + (x.m === 1 ? ' maand' : ' maanden') + ' en ' + x.d + (x.d === 1 ? ' dag' : ' dagen');
  // Bruto AOW per jaar inclusief vakantietoeslag bij een aantal verzekerde jaren
  const aowJaar = (samen, jaren) => (samen ? N.aow.samenPpJaar : N.aow.alleenstaandJaar) * (1 + N.aow.vakantietoeslagPct / 100) *
    Math.min(N.aow.opbouwJaren, Math.max(0, jaren)) / N.aow.opbouwJaren;
  // Uitkering per maand aan het begin van de maand uit kapitaal k, jaarrente r (%), n maanden
  const uitkeringVooraf = (k, rJaar, n) => { const i = maandUitJaar(rJaar); return annTermijn(k, i, n) / (1 + i); };
  // Jaarruimte volgens de vereenvoudigde formule
  const jaarruimte = (inkomen, factorA) => {
    const j = N.jaarruimte, grond = Math.max(0, Math.min(inkomen, j.maxPremieInkomen) - j.franchise);
    return { grond, bruto: grond * j.pct / 100, pensioen: factorA * j.factorA, ruimte: Math.max(0, grond * j.pct / 100 - factorA * j.factorA) };
  };
  // Belastingvoordeel van een aftrekpost op box 1-inkomen (arbeidsinkomen blijft gelijk)
  const voordeelAftrek = (inkomen, aftrek, opt = {}) =>
    F.netto(inkomen, Object.assign({ arbeid: inkomen }, opt)).heffing - F.netto(inkomen, Object.assign({ arbeid: inkomen, aftrek }, opt)).heffing;
  // Overlevingskans over t jaar vanaf leeftijd x (exacte integraal van μ)
  const overleving = (x, t, p) => Math.exp(-(p.A * t + p.B * Math.pow(p.c, x) * (Math.pow(p.c, t) - 1) / Math.log(p.c)));
  // Resterende levensverwachting: ∫ S(t) dt tot 120 jaar, trapeziumregel met stap 0,1 jaar
  const restLeven = (x, p) => {
    const eind = Math.max(0, 120 - x), dt = 0.1;
    let e = 0, vorige = 1;
    for (let t = dt; t <= eind + 1e-9; t += dt) { const s = overleving(x, t, p); e += (vorige + s) / 2 * dt; vorige = s; }
    return e;
  };
  // AOW-datum en -leeftijd bij een geboortedatum volgens de tabel
  const aowVolgensTabel = gb => {
    const t = N.aowLeeftijd.tabel, laatste = t[N.aowLeeftijd.vastgesteldTot];
    for (let y = gb.getFullYear() + 65; y <= gb.getFullYear() + 72; y++) {
      const l = y < 2013 ? [65, 0] : (t[y] || laatste);
      const d = plusMaanden(new Date(gb.getFullYear() + l[0], gb.getMonth(), gb.getDate()), l[1]);
      if (d.getFullYear() === y) return { datum: d, jaren: l[0], maanden: l[1] };
    }
    return { datum: plusMaanden(new Date(gb.getFullYear() + laatste[0], gb.getMonth(), gb.getDate()), laatste[1]), jaren: laatste[0], maanden: laatste[1] };
  };

  RT.add({
    id: 'pensioentekort', groep: 'pensioen-aow', naam: 'Inleg voor een pensioentekort',
    intro: 'De klant komt na pensionering een bedrag per maand tekort. Welk kapitaal is daarvoor nodig, en wat moet er tot de pensioendatum per maand opzij?',
    velden: [
      { k: 'tk', l: 'Tekort per maand, in euro’s van nu', s: 'eur', std: 750 },
      { k: 'jt', l: 'Jaren tot de pensioendatum', s: 'num', na: 'jaar', std: 22 },
      { k: 'du', l: 'Duur van de aanvulling', s: 'num', na: 'jaar', std: 20 },
      { k: 'inf', l: 'Inflatie tot de pensioendatum', s: 'pct', std: 2 },
      { k: 'ro', l: 'Rendement tijdens het opbouwen', s: 'pct', std: 4 },
      { k: 'ru', l: 'Rendement tijdens het uitkeren', s: 'pct', std: 2.5 },
      { k: 'st', l: 'Al opgebouwd voor dit doel', s: 'eur', std: 15000, opt: true }
    ],
    bereken(v) {
      const nt = Math.round(v.jt * 12), nu = Math.round(v.du * 12);
      if (nt <= 0 || nu <= 0) return { fout: 'Vul een opbouw- en uitkeringsperiode groter dan nul in.' };
      const maand = v.tk * Math.pow(1 + v.inf / 100, v.jt);
      const iu = maandUitJaar(v.ru), io = maandUitJaar(v.ro);
      const kapitaal = annHoofdsom(maand, iu, nu) * (1 + iu);
      const g = Math.pow(1 + io, nt), factor = io === 0 ? nt : (g - 1) / io * (1 + io);
      const inleg = Math.max(0, (kapitaal - v.st * g) / factor);
      return {
        lbl: 'Benodigde inleg per maand', groot: fmt.euro(inleg), onder: 'gedurende ' + fmt.duur(nt) + ', vóór belasting en kosten',
        rijen: [
          ['Tekort per maand op de pensioendatum', fmt.euro0(maand)],
          ['Benodigd kapitaal op de pensioendatum', fmt.euro0(kapitaal)],
          ['Huidig bedrag groeit tot', fmt.euro0(v.st * g)],
          ['Totaal nog in te leggen', fmt.euro0(inleg * nt), 'som']
        ],
        signalen: ['De aanvulling is een vast bedrag: na de pensioendatum daalt de koopkracht ervan door inflatie.']
      };
    },
    uitleg: 'Tekort op pensioendatum = tekort × (1 + inflatie)<sup>jaren</sup>. Kapitaal = maandbedrag × (1 − (1 + i<sub>u</sub>)<sup>−n</sup>) / i<sub>u</sub> × (1 + i<sub>u</sub>), uitkering aan het begin van de maand. Inleg = (kapitaal − huidig bedrag × (1 + i<sub>o</sub>)<sup>m</sup>) / (((1 + i<sub>o</sub>)<sup>m</sup> − 1) / i<sub>o</sub> × (1 + i<sub>o</sub>)). Maandrendementen afgeleid van de jaarrendementen.',
    letop: 'Of het tekort bruto of netto is, bepaalt welk kapitaal nodig is: belasting op de uitkering en een eventuele fiscale aftrek van de inleg (jaarruimte, lijfrente) zijn hier niet meegenomen. Controleer de pensioenopbouw via het pensioenoverzicht en de actuele AOW-leeftijd.'
  });

  /* ===================== AOW ===================== */

  RT.add({
    id: 'aow-datum', groep: 'pensioen-aow', naam: 'Wanneer gaat de AOW in?',
    intro: 'AOW-leeftijd en AOW-datum bij een geboortedatum, met de tijd die nog te gaan is. Na het laatst vastgestelde jaar is de uitkomst een aanname.',
    kw: 'aow leeftijd aowdatum pensioenleeftijd geboortedatum svb',
    peildatum: N.peildatum, fiscaal: ['AOW-leeftijdstabel'],
    velden: [
      { k: 'gb', l: 'Geboortedatum', s: 'datum', std: '1962-03-14' },
      { k: 'eigen', l: 'Eigen aanname AOW-leeftijd', s: 'num', na: 'jaar', std: 0, opt: true, tip: 'Laat op 0 voor de wettelijke tabel. Bijvoorbeeld 67,5 = 67 jaar en 6 maanden.' }
    ],
    bereken(v) {
      if (!v.gb) return { fout: 'Vul een geboortedatum in.' };
      let r;
      if (v.eigen > 0) {
        const j = Math.floor(v.eigen), m = Math.round((v.eigen - j) * 12);
        r = { datum: plusMaanden(new Date(v.gb.getFullYear() + j, v.gb.getMonth(), v.gb.getDate()), m), jaren: j, maanden: m };
      } else r = aowVolgensTabel(v.gb);
      const nu = vandaag(), vast = !(v.eigen > 0) && r.datum.getFullYear() <= N.aowLeeftijd.vastgesteldTot;
      const leeftijd = r.jaren + ' jaar' + (r.maanden ? ' en ' + r.maanden + (r.maanden === 1 ? ' maand' : ' maanden') : '');
      return {
        lbl: 'AOW-datum', groot: fmt.datum(r.datum), onder: 'bij een AOW-leeftijd van ' + leeftijd,
        rijen: [
          ['AOW-leeftijd', leeftijd],
          ['Nog te gaan', r.datum > nu ? tekstJmd(ymd(nu, r.datum)) : 'de AOW-datum is al bereikt'],
          ['Leeftijd vandaag', ymd(v.gb, nu).j + ' jaar'],
          ['Status', v.eigen > 0 ? 'eigen aanname' : vast ? 'wettelijk vastgesteld' : 'aanname, nog niet vastgesteld', 'som']
        ],
        signalen: vast ? [] : ['Deze AOW-datum ligt na ' + N.aowLeeftijd.vastgesteldTot + ' of is een eigen aanname. Noem hem in een advies altijd voorlopig.']
      };
    },
    uitleg: 'Voor het kalenderjaar waarin iemand de AOW-leeftijd bereikt, staat in een tabel welke leeftijd geldt. De AOW gaat in op de dag dat die leeftijd is bereikt: geboortedatum plus het aantal jaren en maanden. Na ' + N.aowLeeftijd.vastgesteldTot + ' wordt de laatst bekende leeftijd aangehouden.',
    letop: 'De AOW-leeftijd wordt telkens vijf jaar vooraf vastgesteld op basis van de levensverwachting. Een datum na ' + N.aowLeeftijd.vastgesteldTot + ' is dus onzeker. ' + NIET_GEVERIFIEERD + ' Raadpleeg de SVB voor de actuele tabel.'
  });

  RT.add({
    id: 'aow-bedrag-opbouwgaten', groep: 'pensioen-aow', naam: 'Hoogte AOW bij opbouwgaten',
    intro: 'Elk jaar waarin iemand niet verzekerd was, kost 2% AOW. Wat blijft er bruto en netto over?',
    kw: 'aow hoogte gat korting buitenland verzekerde jaren 2 procent',
    peildatum: N.peildatum, fiscaal: ['bruto AOW-bedragen', 'vakantietoeslag AOW'].concat(BOX1),
    velden: [
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: LEEF, std: 'alleen' },
      { k: 'jr', l: 'Verzekerde jaren', s: 'num', na: 'jaar', std: 46, tip: 'Volledige AOW na ' + N.aow.opbouwJaren + ' jaar.' }
    ],
    bereken(v) {
      const samen = v.ls === 'samen', jaren = Math.min(N.aow.opbouwJaren, Math.max(0, v.jr));
      const vol = aowJaar(samen, N.aow.opbouwJaren), bruto = aowJaar(samen, jaren);
      const korting = (N.aow.opbouwJaren - jaren) * 100 / N.aow.opbouwJaren;
      const r = F.netto(bruto, { aow: true, arbeid: 0, alleenstaand: !samen });
      return {
        lbl: 'Bruto AOW per maand', groot: fmt.euro(bruto / 12), onder: 'inclusief vakantietoeslag, gemiddeld over het jaar',
        rijen: [
          ['Volledige AOW per jaar', fmt.euro0(vol)],
          ['Korting', fmt.pct(korting, 0)],
          ['Bruto AOW per jaar', fmt.euro0(bruto)],
          ['Gemist per jaar door de gaten', fmt.euro0(vol - bruto)],
          ['Belasting en premies (alleen AOW)', fmt.euro0(r.heffing)],
          ['Netto per maand, zonder ander inkomen', fmt.euro(r.netto / 12), 'som']
        ]
      };
    },
    uitleg: 'Bruto AOW = volledig bedrag × (1 + vakantietoeslag) × verzekerde jaren / ' + N.aow.opbouwJaren + '. Netto via box 1 met het tarief vanaf de AOW-leeftijd, de algemene heffingskorting voor AOW-gerechtigden en de ouderenkorting (bij alleenstaanden ook de alleenstaande-ouderenkorting).',
    letop: NIET_GEVERIFIEERD + ' De AOW-bedragen wijzigen per 1 januari en 1 juli. Of iemand verzekerd was, hangt af van wonen en werken in Nederland; vrijwillige verzekering of inkoop is soms mogelijk. Een aanvulling via de bijstand (AIO) is hier niet meegenomen.'
  });

  RT.add({
    id: 'netto-aow-pensioen', groep: 'pensioen-aow', naam: 'Netto AOW en pensioen',
    intro: 'AOW plus aanvullend pensioen na de AOW-leeftijd: wat blijft er netto per maand over?',
    kw: 'bruto netto aow pensioen ouderenkorting gepensioneerd',
    peildatum: PEIL, fiscaal: ['bruto AOW-bedragen'].concat(BOX1),
    velden: [
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: LEEF, std: 'alleen' },
      { k: 'jr', l: 'Verzekerde jaren AOW', s: 'num', na: 'jaar', std: 50 },
      { k: 'pens', l: 'Bruto pensioen per jaar', s: 'eur', std: 18000 },
      { k: 'ov', l: 'Overig box 1-inkomen per jaar', s: 'eur', std: 0, opt: true, tip: 'Bijvoorbeeld een lijfrente-uitkering.' }
    ],
    bereken(v) {
      const samen = v.ls === 'samen', aow = aowJaar(samen, v.jr), bruto = aow + v.pens + v.ov;
      const r = F.netto(bruto, { aow: true, arbeid: 0, alleenstaand: !samen });
      return {
        lbl: 'Netto per maand', groot: fmt.euro(r.netto / 12), onder: 'gemiddeld, inclusief vakantietoeslag AOW',
        rijen: [
          ['Bruto AOW per jaar', fmt.euro0(aow)],
          ['Totaal bruto per jaar', fmt.euro0(bruto)],
          ['Belasting vóór kortingen', fmt.euro0(r.belastingVoorKorting)],
          ['Algemene heffingskorting', fmt.euro0(r.kortingen.ahk)],
          ['Ouderenkorting', fmt.euro0(r.kortingen.ouderenkorting)],
          ['Te betalen belasting', fmt.euro0(r.heffing)],
          ['Netto per jaar', fmt.euro0(r.netto)],
          ['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk), 'som']
        ]
      };
    },
    uitleg: 'Het box 1-inkomen is AOW + pensioen + overig inkomen. Daarover geldt het tarief vanaf de AOW-leeftijd (lager tarief in de eerste schijf), minus de algemene heffingskorting voor AOW-gerechtigden en de ouderenkorting, die boven de afbouwgrens daalt.',
    letop: 'De AOW-bedragen in deze hulp zijn nog niet centraal vastgesteld. ' + NIET_GEVERIFIEERD + ' De loonheffing per uitkeringsinstantie kan afwijken van deze jaarberekening; het verschil volgt uit de aangifte.'
  });

  RT.add({
    id: 'netto-pensioen-met-inkomen', groep: 'pensioen-aow', naam: 'Netto pensioen naast ander inkomen',
    intro: 'Pensioen, loon, lijfrente en eventueel AOW bij elkaar: hoeveel blijft netto over, en wat is de druk op een extra euro?',
    kw: 'pensioen loon bijverdienen netto marginale druk aow',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'pens', l: 'Pensioen per jaar', s: 'eur', std: 22000 },
      { k: 'loon', l: 'Loon uit arbeid per jaar', s: 'eur', std: 12000 },
      { k: 'lijf', l: 'Lijfrente-uitkering per jaar', s: 'eur', std: 0, opt: true },
      { k: 'aowj', l: 'AOW-leeftijd bereikt?', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'aowb', l: 'Bruto AOW per jaar', s: 'eur', std: Math.round(aowJaar(false, 50)), als: v => v.aowj === 'ja' }
    ],
    bereken(v) {
      const aowJa = v.aowj === 'ja', aow = aowJa ? v.aowb : 0;
      const tot = v.pens + v.loon + v.lijf + aow, opt = { aow: aowJa, arbeid: v.loon };
      const r = F.netto(tot, opt);
      return {
        lbl: 'Netto per maand', groot: fmt.euro(r.netto / 12), onder: aowJa ? 'tarief vanaf de AOW-leeftijd' : 'tarief vóór de AOW-leeftijd',
        rijen: [
          ['Totaal bruto per jaar', fmt.euro0(tot)],
          ['Waarvan arbeidsinkomen', fmt.euro0(v.loon)],
          ['Belasting vóór kortingen', fmt.euro0(r.belastingVoorKorting)],
          ['Heffingskortingen samen', fmt.euro0(r.kortingTotaal)],
          ['Te betalen belasting', fmt.euro0(r.heffing)],
          ['Netto per jaar', fmt.euro0(r.netto)],
          ['Marginale druk op extra inkomen', fmt.pct(F.marginaleDruk(tot, opt)), 'som']
        ]
      };
    },
    uitleg: 'Alle inkomens tellen samen in box 1. Alleen het loon geeft recht op arbeidskorting. Het lagere tarief in de eerste schijf en de ouderenkorting gelden pas vanaf de AOW-leeftijd. De marginale druk is het deel van de volgende € 100 dat naar belasting gaat, inclusief de afbouw van kortingen.',
    letop: 'In het jaar waarin de AOW-leeftijd wordt bereikt geldt een gemengd tarief; gebruik daarvoor de hulp ‘Netto in het jaar van AOW-ingang’. De arbeidskorting is vanaf de AOW-leeftijd vereenvoudigd berekend. Toeslagen en eigen bijdragen (Wmo, Wlz) zijn niet meegenomen.'
  });

  RT.add({
    id: 'netto-vroegpensioen', groep: 'pensioen-aow', naam: 'Netto vroegpensioen',
    intro: 'Eerder met pensioen dan de AOW-leeftijd: vol tarief in de eerste schijf, geen ouderenkorting en een lager pensioen door de vervroeging.',
    kw: 'vervroegen eerder stoppen vroegpensioen netto actuariële korting',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'pens', l: 'Vroegpensioen per jaar (na vervroeging)', s: 'eur', std: 30000 },
      { k: 'ov', l: 'Overig inkomen per jaar', s: 'eur', std: 0, opt: true },
      { k: 'jr', l: 'Aantal jaren eerder', s: 'num', na: 'jaar', std: 3 },
      { k: 'kort', l: 'Verlaging per jaar vervroegen', s: 'pct', std: 6.5, tip: 'Zie de reglementaire factoren van het pensioenfonds.' }
    ],
    bereken(v) {
      if (v.kort >= 100) return { fout: 'De verlaging per jaar moet kleiner zijn dan 100%.' };
      const r = F.netto(v.pens + v.ov, { aow: false, arbeid: 0 });
      const vol = v.pens / Math.pow(1 - v.kort / 100, v.jr);
      return {
        lbl: 'Netto per maand vóór de AOW-leeftijd', groot: fmt.euro(r.netto / 12), onder: 'zonder AOW, met vol tarief',
        rijen: [
          ['Bruto per jaar', fmt.euro0(v.pens + v.ov)],
          ['Te betalen belasting en premies', fmt.euro0(r.heffing)],
          ['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk)],
          ['Pensioen zonder vervroegen', fmt.euro0(vol)],
          ['Levenslang minder pensioen per jaar', fmt.euro0(vol - v.pens), 'som']
        ],
        signalen: ['Het lagere pensioen loopt ook na de AOW-datum door. Reken het inkomen na de AOW-datum apart door.']
      };
    },
    uitleg: 'Netto = bruto − belasting volgens box 1 zonder AOW-tarief, minus de algemene heffingskorting (geen arbeidskorting, geen ouderenkorting). Pensioen zonder vervroegen = vroegpensioen / (1 − verlaging)<sup>jaren</sup>.',
    letop: 'Pensioenfondsen rekenen met eigen omrekenfactoren; de verlaging per jaar is hier een benadering. Een eventuele RVU-regeling, overbruggingspensioen of een hoog-laagconstructie is niet meegenomen.'
  });

  RT.add({
    id: 'netto-jaar-aow-ingang', groep: 'pensioen-aow', naam: 'Netto in het jaar van AOW-ingang',
    intro: 'In het jaar van de AOW-datum geldt een tijdsevenredig gemengd tarief. Moet de klant bijbetalen of krijgt hij geld terug?',
    kw: 'eerste pensioenjaar aow ingang bijbetalen voorlopige aanslag gemengd tarief',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'loon', l: 'Loon tot de AOW-datum', s: 'eur', std: 30000 },
      { k: 'pens', l: 'AOW en pensioen vanaf de AOW-datum', s: 'eur', std: 16000 },
      { k: 'mnd', l: 'Maand van de AOW-datum', s: 'num', std: 7, tip: '1 = januari, 12 = december.' },
      { k: 'lhk', l: 'Heffingskorting toegepast door', s: 'keuze', opties: [['een', 'Alleen de werkgever'], ['beide', 'Werkgever én uitkeringsinstantie']], std: 'een', breed: true }
    ],
    bereken(v) {
      const m = Math.min(12, Math.max(1, Math.round(v.mnd))), voor = (m - 1) / 12, na = 1 - voor, tot = v.loon + v.pens;
      const heffing = F.netto(tot, { aow: false, arbeid: v.loon }).heffing * voor + F.netto(tot, { aow: true, arbeid: v.loon }).heffing * na;
      const ingehoudenLoon = F.netto(v.loon, { aow: false, arbeid: v.loon }).heffing;
      const ingehoudenPens = v.lhk === 'beide' ? F.netto(v.pens, { aow: true, arbeid: 0 }).heffing : F.box1(v.pens, { aow: true }).belasting;
      const saldo = heffing - ingehoudenLoon - ingehoudenPens;
      return {
        lbl: saldo >= 0 ? 'Naar verwachting bij te betalen' : 'Naar verwachting terug te krijgen', groot: fmt.euro0(Math.abs(saldo)),
        onder: 'netto jaarinkomen ' + fmt.euro0(tot - heffing),
        rijen: [
          ['Totaal jaarinkomen', fmt.euro0(tot)],
          ['Deel van het jaar vóór de AOW-datum', fmt.pct(voor * 100, 1)],
          ['Verschuldigde belasting (gemengd)', fmt.euro0(heffing)],
          ['Geschat ingehouden op het loon', fmt.euro0(ingehoudenLoon)],
          ['Geschat ingehouden op AOW en pensioen', fmt.euro0(ingehoudenPens)],
          ['Netto per maand gemiddeld', fmt.euro(( tot - heffing) / 12), 'som']
        ],
        signalen: saldo > 250 ? ['Overweeg een voorlopige aanslag aan te vragen om een naheffing te spreiden.'] : []
      };
    },
    uitleg: 'Belasting = belasting over het hele jaarinkomen zonder AOW-tarief × deel vóór de AOW-maand + belasting met AOW-tarief × deel vanaf de AOW-maand. De ingehouden loonheffing is geschat als losse berekening per inkomensbron; zonder heffingskorting wordt alleen het schijftarief ingehouden.',
    letop: 'Een benadering: de Belastingdienst past de tijdsevenredige tarieven en kortingen in detail toe, en werkgevers en uitkeringsinstanties gebruiken eigen loonheffingstabellen. Bijzondere beloningen in het laatste werkjaar (vakantiegeld, eindafrekening) zijn niet apart meegenomen.'
  });

  RT.add({
    id: 'rvu-inkomensdaling', groep: 'pensioen-aow', naam: 'Eerder stoppen met een RVU-uitkering',
    intro: 'Een vrijgestelde RVU-uitkering tot de AOW-datum: hoeveel daalt het netto inkomen, en hoeveel pensioenopbouw wordt gemist?',
    kw: 'rvu regeling vervroegde uittreding eerder stoppen zwaar werk drempel',
    peildatum: N.peildatum, fiscaal: ['RVU-drempelbedrag', 'middelloonopbouw'].concat(BOX1),
    velden: [
      { k: 'loon', l: 'Bruto jaarloon nu', s: 'eur', std: 52000 },
      { k: 'rvu', l: 'RVU-uitkering per maand', s: 'eur', std: N.rvuDrempelMaand, tip: 'Het vrijgestelde drempelbedrag; daarboven betaalt de werkgever eindheffing.' },
      { k: 'aanv', l: 'Aanvulling uit eigen middelen per maand', s: 'eur', std: 0, opt: true },
      { k: 'jr', l: 'Aantal jaren eerder stoppen', s: 'num', na: 'jaar', std: 2 }
    ],
    bereken(v) {
      const nu = F.netto(v.loon, { arbeid: v.loon }), bruto = (v.rvu + v.aanv) * 12;
      const straks = F.netto(bruto, { arbeid: 0 });
      const daling = nu.netto - straks.netto;
      const gemist = Math.max(0, v.loon - N.middelloon.franchise) * N.middelloon.opbouwPct / 100 * v.jr;
      return {
        lbl: 'Netto inkomensdaling per maand', groot: fmt.euro(daling / 12), onder: nu.netto > 0 ? fmt.pct(daling / nu.netto * 100, 1) + ' van het huidige netto inkomen' : '',
        rijen: [
          ['Netto nu per maand', fmt.euro(nu.netto / 12)],
          ['Netto met RVU per maand', fmt.euro(straks.netto / 12)],
          ['Totale netto inkomensdaling', fmt.euro0(daling * v.jr)],
          ['Gemiste pensioenopbouw per jaar pensioen (indicatie)', fmt.euro0(gemist), 'som']
        ],
        signalen: v.rvu > N.rvuDrempelMaand ? ['De uitkering ligt boven het drempelbedrag: over het meerdere betaalt de werkgever een eindheffing.'] : []
      };
    },
    uitleg: 'Netto nu volgt uit het jaarloon met arbeidskorting; netto straks uit (RVU + aanvulling) × 12 zonder arbeidskorting en zonder AOW-tarief. Gemiste opbouw = (loon − franchise) × opbouwpercentage × jaren, als indicatie voor een middelloonregeling.',
    letop: NIET_GEVERIFIEERD + ' De vrijstelling voor een RVU-uitkering is aan voorwaarden gebonden (onder meer de periode vóór de AOW-datum en afspraken in cao of regeling), en die voorwaarden zijn de laatste jaren gewijzigd. Controleer de regeling van de werkgever en het actuele drempelbedrag. Gemiste opbouw is een grove indicatie; het pensioenfonds geeft de werkelijke cijfers.'
  });

  RT.add({
    id: 'doorwerken-na-aow', groep: 'pensioen-aow', naam: 'Doorwerken na de AOW-leeftijd',
    intro: 'Wat levert een bijverdienste na de AOW-leeftijd netto op, bovenop AOW en pensioen?',
    kw: 'doorwerken bijverdienen na pensioen aow ouderenkorting afbouw',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'aow', l: 'AOW per jaar', s: 'eur', std: Math.round(aowJaar(false, 50)) },
      { k: 'pens', l: 'Pensioen per jaar', s: 'eur', std: 14000 },
      { k: 'bij', l: 'Bruto bijverdienste per jaar', s: 'eur', std: 12000 },
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: LEEF, std: 'alleen' }
    ],
    bereken(v) {
      if (!(v.bij > 0)) return { fout: 'Vul een bijverdienste groter dan nul in.' };
      const al = v.ls === 'alleen', basis = v.aow + v.pens;
      const a = F.netto(basis, { aow: true, arbeid: 0, alleenstaand: al }), b = F.netto(basis + v.bij, { aow: true, arbeid: v.bij, alleenstaand: al });
      const extra = b.netto - a.netto;
      return {
        lbl: 'Netto van de bijverdienste per maand', groot: fmt.euro(extra / 12), onder: 'u houdt ' + fmt.pct(extra / v.bij * 100, 1) + ' over',
        rijen: [
          ['Netto zonder bijverdienste per jaar', fmt.euro0(a.netto)],
          ['Netto met bijverdienste per jaar', fmt.euro0(b.netto)],
          ['Netto extra per jaar', fmt.euro0(extra)],
          ['Verlies aan ouderenkorting', fmt.euro0(a.kortingen.ouderenkorting - b.kortingen.ouderenkorting)],
          ['Gemiddelde druk op de bijverdienste', fmt.pct(100 - extra / v.bij * 100, 1), 'som']
        ]
      };
    },
    uitleg: 'Netto extra = netto(AOW + pensioen + bijverdienste) − netto(AOW + pensioen), beide met het tarief vanaf de AOW-leeftijd. De bijverdienste geeft (verlaagde) arbeidskorting; de ouderenkorting daalt boven de afbouwgrens.',
    letop: 'Na de AOW-leeftijd wordt geen AOW-premie meer betaald; dat zit in het lagere tarief van de eerste schijf. Bijverdienen kan gevolgen hebben voor toeslagen, de eigen bijdrage Wmo/Wlz en een eventueel nabestaandenpensioen.'
  });

  RT.add({
    id: 'netto-per-uitkeringsinstantie', groep: 'pensioen-aow', naam: 'Netto uitkering per instantie',
    intro: 'Elke uitkeringsinstantie houdt zelf loonheffing in. Wat komt er netto binnen, en wat wordt later via de aangifte verrekend?',
    kw: 'loonheffingskorting twee uitkeringen pensioen lijfrente naheffing',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'u', l: 'Bruto uitkering per maand', s: 'eur', std: 1200 },
      { k: 'ov', l: 'Overig jaarinkomen', s: 'eur', std: 22000, tip: 'Bijvoorbeeld AOW en ander pensioen.' },
      { k: 'lhk', l: 'Heffingskorting bij deze instantie?', s: 'keuze', opties: JANEE, std: 'nee' },
      { k: 'aowj', l: 'AOW-leeftijd bereikt?', s: 'keuze', opties: JANEE, std: 'ja' }
    ],
    bereken(v) {
      const aow = v.aowj === 'ja', jaar = v.u * 12;
      const echt = F.netto(v.ov + jaar, { aow, arbeid: 0 }).heffing - F.netto(v.ov, { aow, arbeid: 0 }).heffing;
      const inh = v.lhk === 'ja' ? F.netto(jaar, { aow, arbeid: 0 }).heffing : F.box1(jaar, { aow }).belasting;
      const saldo = echt - inh;
      return {
        lbl: 'Netto per maand van deze instantie', groot: fmt.euro((jaar - inh) / 12), onder: 'op basis van de ingehouden loonheffing',
        rijen: [
          ['Ingehouden loonheffing per jaar', fmt.euro0(inh)],
          ['Belasting die werkelijk bij deze uitkering hoort', fmt.euro0(echt)],
          [saldo >= 0 ? 'Bij te betalen via de aangifte' : 'Terug via de aangifte', fmt.euro0(Math.abs(saldo))],
          ['Werkelijk netto per maand', fmt.euro((jaar - echt) / 12), 'som']
        ],
        signalen: saldo > 0 && v.lhk === 'ja' ? ['De heffingskorting wordt waarschijnlijk dubbel toegepast. Laat die bij één instantie toepassen of vraag een voorlopige aanslag aan.'] : []
      };
    },
    uitleg: 'Inhouding met heffingskorting = loonheffing alsof deze uitkering het enige inkomen is. Zonder heffingskorting = alleen het schijftarief. De belasting die werkelijk bij de uitkering hoort, is het verschil in jaarbelasting met en zonder deze uitkering.',
    letop: 'Uitkeringsinstanties rekenen met loonheffingstabellen en soms met een hoger tarief op verzoek. Deze hulp gebruikt de jaarberekening als benadering.'
  });

  RT.add({
    id: 'nabestaandenuitkering', groep: 'pensioen-aow', naam: 'Netto nabestaandenpensioen en Anw',
    intro: 'Nabestaandenpensioen, Anw-uitkering en eigen arbeidsinkomen samen: wat blijft er netto over?',
    kw: 'nabestaanden anw weduwe weduwnaar partnerpensioen overlijden',
    peildatum: N.peildatum, fiscaal: ['Anw-bedrag', 'Anw-vrijlating'].concat(BOX1),
    velden: [
      { k: 'np', l: 'Nabestaandenpensioen per jaar', s: 'eur', std: 14000 },
      { k: 'ink', l: 'Eigen arbeidsinkomen per jaar', s: 'eur', std: 12000, opt: true },
      { k: 'recht', l: 'Recht op Anw?', s: 'keuze', opties: JANEE, std: 'ja' }
    ],
    bereken(v) {
      const a = N.anw;
      const anw = v.recht === 'ja' ? Math.max(0, a.jaar - Math.max(0, v.ink - a.vrijlatingJaar) * a.kortingPct / 100) : 0;
      const tot = v.np + anw + v.ink, r = F.netto(tot, { arbeid: v.ink });
      return {
        lbl: 'Netto per maand', groot: fmt.euro(r.netto / 12), onder: 'nabestaandenpensioen, Anw en eigen inkomen samen',
        rijen: [
          ['Anw na korting per jaar', fmt.euro0(anw)],
          ['Totaal bruto per jaar', fmt.euro0(tot)],
          ['Te betalen belasting', fmt.euro0(r.heffing)],
          ['Netto per jaar', fmt.euro0(r.netto)],
          ['Anw vervalt bij een arbeidsinkomen vanaf', fmt.euro0(a.vrijlatingJaar + a.jaar / (a.kortingPct / 100)), 'som']
        ]
      };
    },
    uitleg: 'Anw = volledig bedrag − (arbeidsinkomen − vrijlating) × kortingspercentage, niet lager dan nul. Het nabestaandenpensioen is geen arbeidsinkomen. Netto via box 1 vóór de AOW-leeftijd, met arbeidskorting alleen over het eigen arbeidsinkomen.',
    letop: NIET_GEVERIFIEERD + ' Recht op Anw bestaat alleen onder voorwaarden (onder meer een kind jonger dan 18 of arbeidsongeschiktheid) en eindigt bij de AOW-leeftijd. Andere uitkeringen dan arbeidsinkomen worden volledig gekort; dat is hier niet meegenomen.'
  });

  RT.add({
    id: 'overbrugging-aow', groep: 'pensioen-aow', naam: 'Overbruggingsuitkering tot de AOW (historisch)',
    intro: 'De overbruggingsregeling AOW vulde het inkomen aan tussen het einde van een vroegpensioen en de verhoogde AOW-datum. De regeling is uitgewerkt; deze hulp is alleen voor terugrekenen.',
    kw: 'obr overbruggingsregeling aow-gat vut prepensioen historisch',
    peildatum: N.peildatum, fiscaal: ['OBR-normen', 'OBR-vermogensgrens'],
    velden: [
      { k: 'ink', l: 'Inkomen per maand', s: 'eur', std: 800 },
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: LEEF, std: 'alleen' },
      { k: 'mnd', l: 'Maanden tot de AOW-datum', s: 'num', na: 'mnd', std: 14 },
      { k: 'verm', l: 'Vermogen', s: 'eur', std: 5000 }
    ],
    bereken(v) {
      const norm = v.ls === 'samen' ? N.obr.samenMaand : N.obr.alleenstaandMaand, teveel = v.verm > N.obr.vermogensgrens;
      const u = teveel ? 0 : Math.max(0, norm - v.ink);
      return {
        lbl: 'Overbruggingsuitkering per maand', groot: fmt.euro(u), onder: 'historische regeling, indicatief',
        rijen: [
          ['Norm per maand', fmt.euro(norm)],
          ['Vermogenstoets', teveel ? 'vermogen boven de grens: geen recht' : 'binnen de grens'],
          ['Totaal over de periode', fmt.euro0(u * Math.max(0, v.mnd))],
          ['Inkomen inclusief aanvulling per maand', fmt.euro(v.ink + u), 'som']
        ],
        signalen: ['Regeling niet meer van toepassing: de OBR was bedoeld voor mensen die vóór 2013 afspraken maakten over vroegpensioen en van wie de AOW-datum inmiddels is verstreken. Gebruik de uitkomst niet voor nieuwe gevallen.']
      };
    },
    uitleg: 'Uitkering = norm − eigen inkomen per maand, mits het vermogen niet boven de vermogensgrens ligt. Totaal = uitkering × maanden tot de AOW-datum.',
    letop: 'Historische regeling: de overbruggingsregeling AOW (OBR) is uitgewerkt en staat niet meer open voor nieuwe aanvragen. De normen en vermogensgrens zijn bronwaarden en niet geverifieerd. Voor actuele situaties met een AOW-gat: kijk naar RVU, bijstand of eigen voorzieningen.'
  });

  /* ===================== Levensverwachting ===================== */

  RT.add({
    id: 'levensverwachting', groep: 'pensioen-aow', naam: 'Resterende levensverwachting (model)',
    intro: 'Hoeveel jaar leeft iemand van deze leeftijd gemiddeld nog? Een eenvoudig sterftemodel, bedoeld als gesprekshulp.',
    kw: 'levensverwachting sterfte overlevingskans gompertz makeham leeftijd',
    velden: [
      { k: 'l', l: 'Huidige leeftijd', s: 'num', na: 'jaar', std: 55 },
      { k: 'g', l: 'Geslacht', s: 'keuze', opties: [['m', 'Man'], ['v', 'Vrouw']], std: 'm' }
    ],
    bereken(v) {
      if (v.l < 0 || v.l >= 120) return { fout: 'Vul een leeftijd tussen 0 en 120 jaar in.' };
      const p = STERFTE[v.g], e = restLeven(v.l, p);
      return {
        lbl: 'Resterende levensverwachting', groot: fmt.getal(e, 1) + ' jaar', onder: 'verwachte leeftijd ' + fmt.getal(v.l + e, 1) + ' jaar',
        rijen: [
          ['Kans om nog 10 jaar te leven', fmt.pct(overleving(v.l, 10, p) * 100, 1)],
          ['Kans om nog 20 jaar te leven', fmt.pct(overleving(v.l, 20, p) * 100, 1)],
          ['Kans om 90 te worden', v.l < 90 ? fmt.pct(overleving(v.l, 90 - v.l, p) * 100, 1) : '–'],
          ['Levensverwachting op 67 jaar', fmt.getal(restLeven(67, p), 1) + ' jaar', 'som']
        ]
      };
    },
    uitleg: 'Sterftekracht μ(x) = A + B·c<sup>x</sup>. De overlevingskans over t jaar is exp(−(A·t + B·c<sup>x</sup>·(c<sup>t</sup> − 1) / ln c)); de levensverwachting is de som (integraal) van die kansen tot 120 jaar. Parameters man: A = ' + STERFTE.m.A + ', B = ' + STERFTE.m.B + ', c = ' + STERFTE.m.c + '; vrouw: A = ' + STERFTE.v.A + ', B = ' + STERFTE.v.B + ', c = ' + STERFTE.v.c + '.',
    letop: 'Een modelbenadering, geen officiële sterftetafel. Gebruik voor pensioen- en verzekeringsberekeningen de prognosetafel van het Actuarieel Genootschap of de cijfers van het CBS. Gezondheid, leefstijl en opleiding maken grote verschillen.'
  });

  RT.add({
    id: 'levensverwachting-geboorte', groep: 'pensioen-aow', naam: 'Levensverwachting bij geboorte (model)',
    intro: 'Hetzelfde sterftemodel vanaf leeftijd nul, met een aanname voor de jaarlijkse daling van de sterfte.',
    kw: 'levensverwachting geboorte baby cohort sterftedaling',
    velden: [
      { k: 'g', l: 'Geslacht', s: 'keuze', opties: [['m', 'Man'], ['v', 'Vrouw']], std: 'v' },
      { k: 'jr', l: 'Geboortejaar', s: 'num', std: 2026 },
      { k: 'dal', l: 'Jaarlijkse daling van de sterfte', s: 'pct', std: 1 }
    ],
    bereken(v) {
      if (v.dal >= 100) return { fout: 'De daling moet kleiner zijn dan 100%.' };
      const b = STERFTE[v.g], f = Math.pow(1 - v.dal / 100, Math.max(0, v.jr - STERFTE.basisjaar));
      const p = { A: b.A * f, B: b.B * f, c: b.c };
      const e = restLeven(0, p), e0 = restLeven(0, b);
      return {
        lbl: 'Levensverwachting bij geboorte', groot: fmt.getal(e, 1) + ' jaar', onder: 'verwacht overlijdensjaar rond ' + Math.round(v.jr + e),
        rijen: [
          ['Zonder daling van de sterfte', fmt.getal(e0, 1) + ' jaar'],
          ['Winst door dalende sterfte', fmt.getal(e - e0, 1) + ' jaar'],
          ['Levensverwachting op 67 (zelfde aanname)', fmt.getal(restLeven(67, p), 1) + ' jaar', 'som']
        ]
      };
    },
    uitleg: 'De sterfteparameters A en B worden vermenigvuldigd met (1 − daling)<sup>geboortejaar − ' + STERFTE.basisjaar + '</sup>. Daarna dezelfde berekening als bij de resterende levensverwachting, vanaf leeftijd 0.',
    letop: 'Een vereenvoudiging: de daling wordt in één keer op het hele leven toegepast in plaats van per kalenderjaar. Officiële cijfers staan in de periode- en prognosetafels van het CBS.'
  });

  /* ===================== Lijfrente en jaarruimte ===================== */

  RT.add({
    id: 'lijfrente-jaarruimte', groep: 'pensioen-aow', naam: 'Lijfrente: jaarruimte en belastingvoordeel',
    intro: 'Hoeveel mag dit jaar fiscaal aftrekbaar worden ingelegd voor een lijfrente, en wat levert dat aan belasting op?',
    kw: 'jaarruimte lijfrente aftrek pensioengat factor a premiegrondslag',
    peildatum: N.peildatum, fiscaal: ['jaarruimte: franchise, maximum premie-inkomen, percentage, factor'].concat(BOX1),
    velden: [
      { k: 'ink', l: 'Inkomen vorig jaar', s: 'eur', std: 72000, tip: 'Loon, winst of uitkering in box 1.' },
      { k: 'fa', l: 'Factor A (pensioenaangroei)', s: 'eur', std: 1800, opt: true, tip: 'Staat op het UPO van vorig jaar; 0 zonder pensioenregeling.' },
      { k: 'nu', l: 'Box 1-inkomen dit jaar', s: 'eur', std: 74000, tip: 'Voor de berekening van de teruggave.' }
    ],
    bereken(v) {
      const j = jaarruimte(v.ink, v.fa), voordeel = voordeelAftrek(v.nu, j.ruimte);
      return {
        lbl: 'Jaarruimte', groot: fmt.euro0(j.ruimte), onder: 'netto inleg na teruggave ' + fmt.euro0(j.ruimte - voordeel),
        rijen: [
          ['Premiegrondslag', fmt.euro0(j.grond)],
          [N.jaarruimte.pct + '% van de premiegrondslag', fmt.euro0(j.bruto)],
          ['Af: ' + fmt.getal(N.jaarruimte.factorA, 2) + ' × factor A', fmt.euro0(j.pensioen)],
          ['Belastingteruggave bij volledige inleg', fmt.euro0(voordeel)],
          ['Effectief aftrektarief', j.ruimte > 0 ? fmt.pct(voordeel / j.ruimte * 100) : '–', 'som']
        ],
        signalen: j.ruimte === 0 ? ['Geen jaarruimte: de pensioenopbouw via de werkgever vult de ruimte volledig. Kijk ook naar onbenutte ruimte uit eerdere jaren.'] : []
      };
    },
    uitleg: 'Premiegrondslag = inkomen (tot het maximum premie-inkomen) − franchise. Jaarruimte = ' + N.jaarruimte.pct + '% × premiegrondslag − ' + N.jaarruimte.factorA + ' × factor A. De teruggave is het verschil in box 1-belasting met en zonder de aftrek op het inkomen van dit jaar.',
    letop: NIET_GEVERIFIEERD + ' Gebruik de jaarruimtecalculator van de Belastingdienst voor de exacte ruimte. Lijfrenteadvies is pensioenadvies: toets passendheid en leg het advies vast. De toevoeging aan de fiscale oudedagsreserve telt sinds 2023 niet meer mee.'
  });

  RT.add({
    id: 'jaarruimte-reservering', groep: 'pensioen-aow', naam: 'Lijfrenteruimte: dit jaar en ingehaalde jaren',
    intro: 'Jaarruimte plus de reserveringsruimte uit de afgelopen tien jaar. Kies of u het onbenutte bedrag in één keer invult of per jaar.',
    kw: 'reserveringsruimte inhaalruimte jaarruimte onbenut tien jaar lijfrente',
    peildatum: N.peildatum, fiscaal: ['jaarruimte', 'maximum reserveringsruimte'].concat(BOX1),
    velden: [
      { k: 'wijze', l: 'Onbenutte ruimte invullen', s: 'keuze', opties: [['totaal', 'Als één bedrag'], ['reeks', 'Per jaar (oudste eerst)']], std: 'totaal', breed: true },
      { k: 'ink', l: 'Inkomen vorig jaar', s: 'eur', std: 72000 },
      { k: 'fa', l: 'Factor A', s: 'eur', std: 1800, opt: true },
      { k: 'onb', l: 'Onbenutte jaarruimte eerdere jaren', s: 'eur', std: 24000, als: v => v.wijze === 'totaal' },
      { k: 'reeks', l: 'Onbenutte jaarruimte per jaar', s: 'tekst', regels: 3, std: '2400; 3100; 2800; 3600; 4100; 3900; 4400; 4700; 5100; 5300', breed: true, als: v => v.wijze === 'reeks', tip: 'Scheid de bedragen met een puntkomma; maximaal tien jaren tellen mee.' },
      { k: 'nu', l: 'Box 1-inkomen dit jaar', s: 'eur', std: 74000 }
    ],
    bereken(v) {
      const j = jaarruimte(v.ink, v.fa), R = N.jaarruimte;
      let onbenut, oudste = null, aantal = null;
      if (v.wijze === 'reeks') {
        const lijst = RT.lees.reeks(v.reeks).filter(x => x > 0), mee = lijst.slice(-R.reserveringJaren);
        onbenut = mee.reduce((s, x) => s + x, 0); aantal = mee.length; oudste = mee.length === R.reserveringJaren ? mee[0] : null;
      } else onbenut = v.onb;
      const res = Math.min(onbenut, R.maxReservering), tot = j.ruimte + res, voordeel = voordeelAftrek(v.nu, tot);
      const rijen = [
        ['Jaarruimte dit jaar', fmt.euro0(j.ruimte)],
        ['Onbenut uit eerdere jaren', fmt.euro0(onbenut) + (aantal != null ? ' (' + aantal + ' jaar)' : '')],
        ['Reserveringsruimte (na maximum)', fmt.euro0(res)],
        ['Belastingteruggave bij volledige inleg', fmt.euro0(voordeel)],
        ['Netto inleg', fmt.euro0(tot - voordeel), 'som']
      ];
      if (oudste != null) rijen.splice(3, 0, ['Vervalt na dit jaar (oudste jaar)', fmt.euro0(oudste)]);
      return {
        lbl: 'Totale aftrekbare inleg', groot: fmt.euro0(tot), onder: 'jaarruimte plus reserveringsruimte', rijen,
        signalen: onbenut > R.maxReservering ? ['Het onbenutte bedrag is hoger dan het maximum reserveringsruimte; het meerdere is dit jaar niet aftrekbaar.'] : []
      };
    },
    uitleg: 'Jaarruimte als in de hulp ‘Lijfrente: jaarruimte en belastingvoordeel’. Reserveringsruimte = onbenutte jaarruimte uit maximaal de laatste ' + N.jaarruimte.reserveringJaren + ' jaar, tot het wettelijke maximum. Teruggave = verschil in box 1-belasting met en zonder de aftrek.',
    letop: NIET_GEVERIFIEERD + ' Een premie wordt eerst aan de jaarruimte toegerekend en pas daarna aan de reserveringsruimte (oudste jaar eerst). Laat de onbenutte ruimte per jaar vaststellen; een te hoge aftrek wordt gecorrigeerd en kan leiden tot dubbele heffing bij uitkering.'
  });

  RT.add({
    id: 'lijfrentestorting-teruggave', groep: 'pensioen-aow', naam: 'Teruggave bij een lijfrentestorting',
    intro: 'Een storting binnen de jaarruimte is aftrekbaar. Hoeveel belasting komt er werkelijk terug als de aftrek over schijfgrenzen heen loopt?',
    kw: 'lijfrente storting aftrek teruggave marginaal tarief schijf',
    peildatum: PEIL, fiscaal: BOX1.concat(['forfait en tarief box 3']),
    velden: [
      { k: 'b', l: 'Bruto box 1-inkomen dit jaar', s: 'eur', std: 85000 },
      { k: 'st', l: 'Storting', s: 'eur', std: 10000 },
      { k: 'ru', l: 'Beschikbare ruimte (jaar- en reserveringsruimte)', s: 'eur', std: 8000 }
    ],
    bereken(v) {
      const aftrek = Math.min(v.st, v.ru), voordeel = voordeelAftrek(v.b, aftrek);
      const b3 = v.st * NR.box3.forfaitOverig / 100 * NR.box3.tarief / 100;
      return {
        lbl: 'Belastingteruggave', groot: fmt.euro0(voordeel), onder: 'netto kosten van de storting ' + fmt.euro0(v.st - voordeel),
        rijen: [
          ['Aftrekbaar deel', fmt.euro0(aftrek)],
          ['Niet aftrekbaar deel', fmt.euro0(v.st - aftrek)],
          ['Effectief aftrektarief', aftrek > 0 ? fmt.pct(voordeel / aftrek * 100) : '–'],
          ['Box 3-heffing over dit bedrag als het in box 3 had gestaan (per jaar)', fmt.euro0(b3), 'som']
        ],
        signalen: v.st > v.ru ? ['Een storting boven de ruimte is niet aftrekbaar, terwijl de latere uitkering wel belast is.'] : []
      };
    },
    uitleg: 'Teruggave = box 1-belasting over het inkomen − box 1-belasting over (inkomen − aftrek), inclusief het effect op heffingskortingen. De box 3-besparing is een indicatie: bedrag × forfait overige bezittingen × box 3-tarief, zonder heffingsvrij vermogen.',
    letop: 'Lijfrentepremie is aftrekbaar tegen het eigen tarief; door de aftrek kan het inkomen in een lagere schijf vallen. De box 3-regels veranderen de komende jaren. Lijfrenteadvies is pensioenadvies: toets passendheid en leg het advies vast.'
  });

  RT.add({
    id: 'lijfrente-of-box3', groep: 'pensioen-aow', naam: 'Lijfrente of sparen in box 3',
    intro: 'Bruto inleggen met aftrek en belast uitkeren, of netto sparen met jaarlijkse box 3-heffing: wat levert na belasting meer op?',
    kw: 'lijfrente versus box 3 sparen beleggen vergelijken pensioensparen',
    peildatum: PEIL, fiscaal: ['forfait overige bezittingen', 'tarief box 3', 'tarieven box 1'],
    velden: [
      { k: 'i', l: 'Bruto inleg per jaar', s: 'eur', std: 5000 },
      { k: 'n', l: 'Jaren tot de uitkering', s: 'num', na: 'jaar', std: 20 },
      { k: 'r', l: 'Rendement per jaar', s: 'pct', std: 5 },
      { k: 'tn', l: 'Tarief over de aftrek nu', s: 'pct', std: NR.box1.tarief3 },
      { k: 'tl', l: 'Tarief bij uitkering', s: 'pct', std: NR.box1.tarief1Aow }
    ],
    bereken(v) {
      const n = Math.round(v.n);
      if (n <= 0) return { fout: 'Vul een looptijd van minstens één jaar in.' };
      const lijf = eindwaarde(0, v.i, v.r / 100, n, true), lijfNetto = lijf * (1 - v.tl / 100);
      const inleg3 = v.i * (1 - v.tn / 100), r3 = v.r - NR.box3.forfaitOverig * NR.box3.tarief / 100;
      const box3 = eindwaarde(0, inleg3, r3 / 100, n, true);
      const beste = lijfNetto >= box3 ? 'lijfrente' : 'box 3';
      return {
        lbl: 'Voordeligst', groot: beste, onder: 'verschil ' + fmt.euro0(Math.abs(lijfNetto - box3)) + ' na belasting',
        rijen: [
          ['Eindkapitaal lijfrente (bruto)', fmt.euro0(lijf)],
          ['Lijfrente na belasting bij uitkering', fmt.euro0(lijfNetto)],
          ['Netto inleg box 3 per jaar', fmt.euro0(inleg3)],
          ['Netto rendement in box 3', fmt.pct(r3)],
          ['Eindkapitaal box 3', fmt.euro0(box3), 'som']
        ]
      };
    },
    uitleg: 'Lijfrente: bruto inleg aan het begin van elk jaar, onbelast rendement, aan het eind belast tegen het tarief bij uitkering. Box 3: inleg na belasting (bruto × (1 − tarief nu)), rendement verminderd met forfait × box 3-tarief per jaar.',
    letop: 'Sterk vereenvoudigd: in box 3 is geen heffingsvrij vermogen meegenomen en de uitkering is als één bedrag belast. Het box 3-stelsel verandert; de lijfrente kent bovendien voorwaarden voor de uitkering. Lijfrenteadvies is pensioenadvies: toets passendheid en leg het advies vast.'
  });

  RT.add({
    id: 'lijfrente-uitkering', groep: 'pensioen-aow', naam: 'Tijdelijke lijfrente-uitkering uit kapitaal',
    intro: 'Welke maandelijkse uitkering levert een lijfrentekapitaal op over een vaste periode?',
    kw: 'lijfrente uitkering tijdelijk kapitaal annuïteit oudedagslijfrente',
    peildatum: PEIL, fiscaal: ['tarief eerste schijf vanaf AOW-leeftijd'],
    velden: [
      { k: 'k', l: 'Lijfrentekapitaal', s: 'eur', std: 150000 },
      { k: 'r', l: 'Rekenrente per jaar', s: 'pct', std: 3 },
      { k: 'n', l: 'Uitkeringsduur', s: 'num', na: 'jaar', std: 20 },
      { k: 'kost', l: 'Eenmalige kosten', s: 'pct', std: 1, opt: true },
      { k: 't', l: 'Tarief over de uitkering', s: 'pct', std: NR.box1.tarief1Aow, tip: 'Standaard het tarief in de eerste schijf vanaf de AOW-leeftijd.' }
    ],
    bereken(v) {
      const n = Math.round(v.n * 12);
      if (n <= 0) return { fout: 'Vul een uitkeringsduur groter dan nul in.' };
      const K = v.k * (1 - v.kost / 100), u = uitkeringVooraf(K, v.r, n);
      return {
        lbl: 'Bruto uitkering per maand', groot: fmt.euro(u), onder: 'aan het begin van elke maand, ' + fmt.duur(n),
        rijen: [
          ['Kapitaal na kosten', fmt.euro0(K)],
          ['Netto per maand', fmt.euro(u * (1 - v.t / 100))],
          ['Totaal bruto uitgekeerd', fmt.euro0(u * n)],
          ['Rente-opbrengst', fmt.euro0(u * n - K), 'som']
        ],
        signalen: v.n < 5 ? ['Een tijdelijke lijfrente-uitkering moet doorgaans minstens vijf jaar lopen; korter kan fiscale gevolgen hebben.'] : []
      };
    },
    uitleg: 'Uitkering = K × i / (1 − (1 + i)<sup>−n</sup>) / (1 + i), met K = kapitaal na kosten, i = maandrente afgeleid van de jaarrente ((1 + r)<sup>1/12</sup> − 1) en n = aantal maanden. Netto = bruto × (1 − tarief).',
    letop: 'Een levenslange lijfrente rekent de verzekeraar met sterftekansen en eigen kosten; die uitkering wijkt af. Het tarief over de uitkering hangt af van het totale inkomen. Lijfrenteadvies is pensioenadvies: toets passendheid en leg het advies vast.'
  });

  RT.add({
    id: 'lijfrente-bank-uitkeringen', groep: 'pensioen-aow', naam: 'Uitkeringsschema lijfrenterekening',
    intro: 'Een bancaire lijfrente keert een vast aantal termijnen uit; het saldo blijft intussen rente opbouwen. Met verloop per jaar.',
    kw: 'bancaire lijfrente lijfrenterekening uitkeringsschema saldo banksparen',
    peildatum: PEIL, fiscaal: ['tarief eerste schijf vanaf AOW-leeftijd'],
    velden: [
      { k: 'k', l: 'Saldo op de startdatum', s: 'eur', std: 150000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 2.75 },
      { k: 'n', l: 'Uitkeringsduur', s: 'num', na: 'jaar', std: 20 },
      { k: 't', l: 'Tarief over de uitkering', s: 'pct', std: NR.box1.tarief1Aow }
    ],
    bereken(v) {
      const n = Math.round(v.n * 12);
      if (n <= 0) return { fout: 'Vul een uitkeringsduur groter dan nul in.' };
      const i = maandUitJaar(v.r), u = uitkeringVooraf(v.k, v.r, n);
      const rijen = []; let saldo = v.k;
      for (let j = 1; j * 12 <= n + 11 && saldo > 0.005; j++) {
        let rente = 0, uit = 0;
        for (let m = 0; m < 12 && (j - 1) * 12 + m < n; m++) { saldo -= u; uit += u; const r = saldo * i; rente += r; saldo += r; }
        rijen.push([String(j), fmt.euro0(uit), fmt.euro0(rente), fmt.euro0(Math.max(0, saldo))]);
      }
      return {
        lbl: 'Bruto uitkering per maand', groot: fmt.euro(u), onder: 'netto ' + fmt.euro(u * (1 - v.t / 100)) + ' per maand',
        rijen: [
          ['Bruto per jaar', fmt.euro0(u * 12)],
          ['Totaal bruto uitgekeerd', fmt.euro0(u * n)],
          ['Totale rente-opbrengst', fmt.euro0(u * n - v.k), 'som']
        ],
        tabel: { titel: 'Verloop per jaar', kop: ['Jaar', 'Uitgekeerd', 'Rente', 'Saldo eind jaar'], rijen }
      };
    },
    uitleg: 'De uitkering is een vaste annuïteit aan het begin van elke maand: saldo × i / (1 − (1 + i)<sup>−n</sup>) / (1 + i), met i = (1 + jaarrente)<sup>1/12</sup> − 1. Na elke uitkering groeit het restsaldo met de maandrente; na de laatste termijn is het saldo nul.',
    letop: 'Bij overlijden valt het resterende saldo in de nalatenschap (anders dan bij een verzekerde lijfrente). De bank kan de rente tussentijds wijzigen, waardoor de termijn verandert. Kosten van de rekening zijn niet meegenomen.'
  });

  /* ===================== Pensioen opbouwen en waarderen ===================== */

  RT.add({
    id: 'banksparen-pensioen', groep: 'pensioen-aow', naam: 'Pensioen opbouwen op een bankspaarrekening',
    intro: 'Inleggen op een lijfrenterekening tot de pensioendatum en daarna een vaste uitkering: eindkapitaal, aftrek en maandbedrag.',
    kw: 'banksparen lijfrenterekening opbouw uitkering pensioen aftrek',
    peildatum: PEIL, fiscaal: ['tarieven box 1'],
    velden: [
      { k: 's', l: 'Huidig saldo', s: 'eur', std: 20000 },
      { k: 'i', l: 'Inleg per maand', s: 'eur', std: 300 },
      { k: 'r1', l: 'Rente tijdens het opbouwen', s: 'pct', std: 3 },
      { k: 'n1', l: 'Jaren tot de pensioendatum', s: 'num', na: 'jaar', std: 18 },
      { k: 'r2', l: 'Rente tijdens het uitkeren', s: 'pct', std: 2.5 },
      { k: 'n2', l: 'Uitkeringsduur', s: 'num', na: 'jaar', std: 20 },
      { k: 't', l: 'Tarief over de aftrek van de inleg', s: 'pct', std: NR.box1.tarief2 }
    ],
    bereken(v) {
      const n1 = Math.round(v.n1 * 12), n2 = Math.round(v.n2 * 12);
      if (n1 < 0 || n2 <= 0) return { fout: 'Vul geldige looptijden in.' };
      const K = eindwaarde(v.s, v.i, maandUitJaar(v.r1), n1, true), inleg = v.s + v.i * n1;
      const u = uitkeringVooraf(K, v.r2, n2);
      return {
        lbl: 'Bruto uitkering per maand', groot: fmt.euro(u), onder: 'gedurende ' + fmt.duur(n2),
        rijen: [
          ['Kapitaal op de pensioendatum', fmt.euro0(K)],
          ['Totaal ingelegd', fmt.euro0(inleg)],
          ['Rente tijdens het opbouwen', fmt.euro0(K - inleg)],
          ['Belastingteruggave over de maandinleg', fmt.euro0(v.i * n1 * v.t / 100)],
          ['Totaal bruto uitgekeerd', fmt.euro0(u * n2), 'som']
        ]
      };
    },
    uitleg: 'Opbouw: saldo × (1 + i)<sup>n</sup> + inleg × ((1 + i)<sup>n</sup> − 1) / i × (1 + i), inleg aan het begin van de maand. Uitkering: annuïteit over het kapitaal, aan het begin van de maand. Maandrentes afgeleid van de jaarrentes.',
    letop: 'De aftrek geldt alleen binnen de jaar- en reserveringsruimte; de uitkering is belast in box 1. De rente staat meestal niet voor de hele looptijd vast. Lijfrenteadvies is pensioenadvies: toets passendheid en leg het advies vast.'
  });

  RT.add({
    id: 'aanvullend-pensioen-kapitaal', groep: 'pensioen-aow', naam: 'Maandelijkse aanvulling uit pensioenkapitaal',
    intro: 'Hoeveel aanvulling per maand levert een opgebouwd (of nog op te bouwen) kapitaal op, bruto en netto?',
    kw: 'aanvullend pensioen kapitaal uitkering annuïteit beleggen',
    peildatum: PEIL, fiscaal: ['tarief eerste schijf vanaf AOW-leeftijd'],
    velden: [
      { k: 's', l: 'Huidig kapitaal', s: 'eur', std: 25000 },
      { k: 'i', l: 'Inleg per maand', s: 'eur', std: 300, opt: true },
      { k: 'n1', l: 'Jaren tot de pensioendatum', s: 'num', na: 'jaar', std: 20 },
      { k: 'r1', l: 'Rendement tijdens het opbouwen', s: 'pct', std: 4 },
      { k: 'kost', l: 'Kosten bij omzetting', s: 'pct', std: 1.5, opt: true },
      { k: 'n2', l: 'Uitkeringsduur', s: 'num', na: 'jaar', std: 20 },
      { k: 'r2', l: 'Rendement tijdens het uitkeren', s: 'pct', std: 2.5 },
      { k: 't', l: 'Tarief over de uitkering', s: 'pct', std: NR.box1.tarief1Aow }
    ],
    bereken(v) {
      const n1 = Math.round(v.n1 * 12), n2 = Math.round(v.n2 * 12);
      if (n1 < 0 || n2 <= 0) return { fout: 'Vul geldige looptijden in.' };
      const kap = eindwaarde(v.s, v.i, maandUitJaar(v.r1), n1, true) * (1 - v.kost / 100), u = uitkeringVooraf(kap, v.r2, n2);
      return {
        lbl: 'Netto aanvulling per maand', groot: fmt.euro(u * (1 - v.t / 100)), onder: 'bruto ' + fmt.euro(u) + ' per maand',
        rijen: [
          ['Kapitaal op de pensioendatum (na kosten)', fmt.euro0(kap)],
          ['Totaal ingelegd', fmt.euro0(v.s + v.i * n1)],
          ['Totaal bruto uit te keren', fmt.euro0(u * n2)],
          ['Bruto per maand per € 10.000 kapitaal', kap > 0 ? fmt.euro(u / kap * 10000) : '–', 'som']
        ]
      };
    },
    uitleg: 'Kapitaal = eindwaarde van saldo en maandinleg (begin van de maand) × (1 − kosten). Uitkering = annuïteit over het kapitaal aan het begin van elke maand. Netto = bruto × (1 − tarief). Maandrendementen afgeleid van de jaarrendementen.',
    letop: 'Rendementen zijn niet gegarandeerd; bij beleggen kan het kapitaal ook lager uitvallen. Of de uitkering in box 1 of box 3 valt, hangt af van het product. Het tarief hangt af van het totale inkomen; dit is een indicatie.'
  });

  RT.add({
    id: 'contante-waarde-pensioen', groep: 'pensioen-aow', naam: 'Contante waarde van een pensioen',
    intro: 'Welk bedrag nu is een pensioenuitkering waard over de verwachte uitkeringsduur, met of zonder indexatie?',
    kw: 'contante waarde pensioen kapitaal uitkering rekenrente indexatie',
    velden: [
      { k: 'u', l: 'Pensioen per jaar', s: 'eur', std: 18000 },
      { k: 'r', l: 'Rekenrente', s: 'pct', std: 3 },
      { k: 'n', l: 'Verwachte uitkeringsduur', s: 'num', na: 'jaar', std: 21 },
      { k: 'g', l: 'Indexatie per jaar', s: 'pct', std: 1.5, opt: true }
    ],
    bereken(v) {
      const i = v.r / 100, g = v.g / 100, n = v.n;
      if (!(n > 0)) return { fout: 'Vul een uitkeringsduur groter dan nul in.' };
      const zonder = i === 0 ? v.u * n : v.u * (1 - Math.pow(1 + i, -n)) / i;
      const met = Math.abs(i - g) < 1e-12 ? v.u * n / (1 + i) : v.u * (1 - Math.pow((1 + g) / (1 + i), n)) / (i - g);
      const som = Math.abs(g) < 1e-12 ? v.u * n : v.u * (Math.pow(1 + g, n) - 1) / g;
      return {
        lbl: 'Contante waarde met indexatie', groot: fmt.euro0(met), onder: fmt.getal(met / v.u, 2) + ' × het jaarbedrag',
        rijen: [
          ['Contante waarde zonder indexatie', fmt.euro0(zonder)],
          ['Som van de uitkeringen (nominaal)', fmt.euro0(som)],
          ['Contante waarde per € 1.000 pensioen', fmt.euro0(met / v.u * 1000), 'som']
        ]
      };
    },
    uitleg: 'Uitkering aan het eind van elk jaar. Zonder indexatie: U × (1 − (1 + i)<sup>−n</sup>) / i. Met indexatie g: U × (1 − ((1 + g) / (1 + i))<sup>n</sup>) / (i − g).',
    letop: 'De uitkomst hangt sterk af van de rekenrente en de verwachte duur. Pensioenfondsen en verzekeraars rekenen met sterftekansen en de rentetermijnstructuur; voor een waardeoverdracht of afkoop geldt hun berekening.'
  });

  RT.add({
    id: 'pensioenopbouw-middelloon', groep: 'pensioen-aow', naam: 'Verwacht pensioen bij middelloon',
    intro: 'Wat levert een middelloonregeling op, samen met de AOW, en hoe verhoudt dat zich tot het salaris?',
    kw: 'middelloon opbouw franchise pensioengrondslag vervangingsratio pensioengat',
    peildatum: N.peildatum, fiscaal: ['franchise en opbouwpercentage middelloon'].concat(BOX1),
    velden: [
      { k: 'sal', l: 'Pensioengevend salaris', s: 'eur', std: 52000 },
      { k: 'jr', l: 'Jaren deelname', s: 'num', na: 'jaar', std: 35 },
      { k: 'ind', l: 'Gemiddelde indexatie per jaar', s: 'pct', std: 1, opt: true },
      { k: 'reeds', l: 'Elders opgebouwd pensioen per jaar', s: 'eur', std: 0, opt: true },
      { k: 'aow', l: 'AOW per jaar', s: 'eur', std: Math.round(aowJaar(false, 50)) }
    ],
    bereken(v) {
      const grond = Math.max(0, v.sal - N.middelloon.franchise), perJaar = grond * N.middelloon.opbouwPct / 100;
      const opgebouwd = perJaar * v.jr + v.reeds, met = opgebouwd * Math.pow(1 + v.ind / 100, v.jr / 2);
      const tot = met + v.aow, r = F.netto(tot, { aow: true, arbeid: 0 });
      return {
        lbl: 'Bruto pensioen plus AOW per jaar', groot: fmt.euro0(tot), onder: 'netto ongeveer ' + fmt.euro0(r.netto / 12) + ' per maand',
        rijen: [
          ['Pensioengrondslag', fmt.euro0(grond)],
          ['Opbouw per jaar', fmt.euro0(perJaar)],
          ['Opgebouwd pensioen', fmt.euro0(opgebouwd)],
          ['Inclusief indexatie', fmt.euro0(met)],
          ['Vervangingsratio t.o.v. salaris', v.sal > 0 ? fmt.pct(tot / v.sal * 100, 1) : '–'],
          ['Tekort t.o.v. 70% van het salaris', fmt.euro0(Math.max(0, v.sal * 0.7 - tot)), 'som']
        ]
      };
    },
    uitleg: 'Pensioengrondslag = salaris − franchise. Opbouw per jaar = grondslag × ' + fmt.pct(N.middelloon.opbouwPct, 3) + '. Indexatie is benaderd door de opbouw gemiddeld de helft van de deelnamejaren te laten groeien. Netto via box 1 vanaf de AOW-leeftijd.',
    letop: NIET_GEVERIFIEERD + ' Franchise en opbouwpercentage verschillen per pensioenfonds. Met de Wet toekomst pensioenen stappen regelingen over op premieregelingen; nieuwe opbouw in een middelloonregeling stopt uiterlijk bij de overgang. Gebruik het UPO en mijnpensioenoverzicht.nl voor de werkelijke opbouw.'
  });

  RT.add({
    id: 'netto-pensioenkorting', groep: 'pensioen-aow', naam: 'Netto effect van een pensioenkorting',
    intro: 'Het pensioen wordt verlaagd, de AOW blijft gelijk. Hoeveel gaat de klant er netto op achteruit?',
    kw: 'pensioenkorting verlaging netto achteruitgang fonds',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'aow', l: 'AOW per jaar', s: 'eur', std: Math.round(aowJaar(false, 50)) },
      { k: 'pens', l: 'Pensioen per jaar', s: 'eur', std: 18000 },
      { k: 'kort', l: 'Korting per keer', s: 'pct', std: 3 },
      { k: 'x', l: 'Aantal kortingen', s: 'num', std: 1 },
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: LEEF, std: 'alleen' }
    ],
    bereken(v) {
      const al = v.ls === 'alleen', p2 = v.pens * Math.pow(1 - v.kort / 100, v.x);
      const a = F.netto(v.aow + v.pens, { aow: true, arbeid: 0, alleenstaand: al }), b = F.netto(v.aow + p2, { aow: true, arbeid: 0, alleenstaand: al });
      return {
        lbl: 'Netto achteruitgang per maand', groot: fmt.euro(( a.netto - b.netto) / 12), onder: a.netto > 0 ? fmt.pct((1 - b.netto / a.netto) * 100, 2) + ' van het netto inkomen' : '',
        rijen: [
          ['Pensioen na korting', fmt.euro0(p2)],
          ['Bruto achteruitgang per jaar', fmt.euro0(v.pens - p2)],
          ['Netto nu per maand', fmt.euro(a.netto / 12)],
          ['Netto na korting per maand', fmt.euro(b.netto / 12)],
          ['Netto achteruitgang per jaar', fmt.euro0(a.netto - b.netto), 'som']
        ]
      };
    },
    uitleg: 'Pensioen na korting = pensioen × (1 − korting)<sup>aantal</sup>. Netto vóór en na via box 1 vanaf de AOW-leeftijd, inclusief ouderenkorting. Door de progressie en de afbouw van kortingen is de netto daling kleiner dan de bruto daling.',
    letop: 'Toeslagen (zorg- en huurtoeslag) kunnen door een lager inkomen stijgen; dat is niet meegenomen.'
  });

  RT.add({
    id: 'extra-pensioen-netto', groep: 'pensioen-aow', naam: 'Netto van extra pensioen',
    intro: 'Een extra uitkering bovenop het bestaande pensioeninkomen, bijvoorbeeld een bedrag ineens: wat blijft er netto van over?',
    kw: 'bedrag ineens extra pensioen netto ouderenkorting effectief tarief',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'basis', l: 'Huidig inkomen per jaar (AOW en pensioen)', s: 'eur', std: 30000 },
      { k: 'e', l: 'Extra uitkering', s: 'eur', std: 10000 },
      { k: 'soort', l: 'Soort', s: 'keuze', opties: [['eenmalig', 'Eenmalig (bedrag ineens)'], ['jaarlijks', 'Elk jaar']], std: 'eenmalig' },
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: LEEF, std: 'alleen' }
    ],
    bereken(v) {
      if (!(v.e > 0)) return { fout: 'Vul een extra uitkering groter dan nul in.' };
      const al = v.ls === 'alleen';
      const a = F.netto(v.basis, { aow: true, arbeid: 0, alleenstaand: al }), b = F.netto(v.basis + v.e, { aow: true, arbeid: 0, alleenstaand: al });
      const bel = b.heffing - a.heffing;
      return {
        lbl: 'Netto extra', groot: fmt.euro0(v.e - bel), onder: v.soort === 'jaarlijks' ? fmt.euro(( v.e - bel) / 12) + ' per maand' : 'eenmalig, in het jaar van uitbetaling',
        rijen: [
          ['Belasting over de extra uitkering', fmt.euro0(bel)],
          ['Effectief tarief', fmt.pct(bel / v.e * 100)],
          ['Verlies aan ouderenkorting', fmt.euro0(a.kortingen.ouderenkorting - b.kortingen.ouderenkorting)],
          ['Netto inkomen met extra uitkering', fmt.euro0(b.netto), 'som']
        ]
      };
    },
    uitleg: 'Belasting over de extra uitkering = box 1-belasting over (inkomen + extra) − box 1-belasting over het inkomen, beide met het tarief vanaf de AOW-leeftijd. Daarin zit ook de afbouw van de ouderenkorting.',
    letop: 'Een bedrag ineens verhoogt het inkomen in één jaar en kan gevolgen hebben voor toeslagen en de eigen bijdrage Wmo/Wlz. De voorwaarden (onder meer een maximumpercentage van de pensioenwaarde) bepaalt de wet en het pensioenfonds; controleer die.'
  });
})(window.RT);
