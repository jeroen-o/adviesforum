/* Rekenhulpen – groep "huishouden-overig" (Huishouden, gezin en overig).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt, lees } = RT;

  /* Jaarlijks wisselende bedragen die (nog) niet in normen.js staan.
   * Peildatum 2026 – gecontroleerd op 2026-10-02; status per regel. Verplaats ze naar normen.js zodra de beheerder dat wil. */
  const N = {
    peildatum: '2026',
    // Kinderopvangtoeslag dagopvang 2026: maximum uurprijs € 11,23 en maximaal 230 uur per kind per maand – bevestigd (Rijksoverheid,
    // bedragen kinderopvangtoeslag 2026); vergoedingPct 72 is een indicatie (max 96%, inkomensafhankelijk) – niet bevestigd
    kinderopvang: { maxUurtarief: 11.23, vergoedingPct: 72, maxUrenPerMaand: 230 },
    // Kinderbijslag per kind per kwartaal vanaf 3e kwartaal 2026 (SVB; 1e/2e kwartaal: 295,07 / 358,30 / 421,53) – bevestigd (SVB, kinderbijslag juli 2026)
    kinderbijslag: { k0tot6: 298.40, k6tot12: 362.35, k12tot18: 426.29 },
    // Energie: vermindering energiebelasting 2026 € 519,80 excl. btw (€ 629 incl. btw) per aansluiting – bevestigd (Rijksoverheid, opbouw energierekening);
    // terugleververgoeding is een marktaanname – niet bevestigd
    energie: { verminderingEB: 519.80, terugleververgoeding: 0.07 },
    // ISDE-subsidie warmtepomp (indicatie; verschilt per type en vermogen) – niet bevestigd
    isdeWarmtepomp: 2800,
    // Alimentatie (rekenregels werkgroep alimentatienormen, vereenvoudigd) – niet bevestigd (geen officiële overheidsbron)
    alimentatie: {
      behoeftePct: { 1: 17, 2: 26, 3: 33, 4: 40 }, // deel van het netto gezinsinkomen voor alle kinderen samen (grove benadering)
      woonPct: 30, draagkrachtPct: 70, vastBedrag: 1200, // kinderalimentatie: draagkracht = 70% × (NBI − (30% × NBI + vast bedrag))
      hofnormPct: 60, woonPctPartner: 30, draagkrachtPctPartner: 60
    },
    // Gesubsidieerde rechtsbijstand 2026 (reguliere toevoeging): inkomensgrens € 35.400 / € 50.000, eigen bijdrage € 257 – € 1.084 –
    // bevestigd (Raad voor Rechtsbijstand, inkomen, vermogen en eigen bijdrage 2026)
    rechtsbijstand: { grensAlleen: 35400, grensSamen: 50000, bijdrageMin: 257, bijdrageMax: 1084 },
    // Wmo abonnementstarief 2026 maximaal € 21,80 per maand – bevestigd (CAK); het rekenscenario inkomensafhankelijke bijdrage is een aanname – niet bevestigd
    wmo: { abonnement: 21.80, scenarioDrempel: 24000, scenarioPct: 4, scenarioMax: 200 }
  };

  /* Technische aannames (geen fiscale normen). Waarde uit bron, niet geverifieerd; in de hulpen aanpasbaar. */
  const A = {
    gasKwhPerM3: 9.77,          // verbrandingswaarde aardgas (bovenwaarde, afgerond)
    co2: {
      stroomKgPerKwh: 0.33, gasKgPerM3: 1.885,
      benzine: 167, diesel: 158, elektrisch: 52, trein: 14, bus: 68, touringcar: 30, // gram per km (auto) of per reizigerskm
      vliegtuig: 135, hoogteFactor: 1.9, cruisePerDag: 100, prijsPerTon: 130, jaarPerPersoon: 8000
    },
    geluidNorm: 40,             // dB(A) op de perceelgrens voor een buitenunit
    graaddagen: 2800,
    bevolking: { inwoners: 18000000, huishoudens: 8400000, belastingplichtigen: 10500000 }
  };

  const G = 'huishouden-overig';
  const pos = x => Math.max(0, x);
  const tekenEuro = x => (x >= 0 ? '+ ' : '') + fmt.euro(x);
  const tekenEuro0 = x => (x >= 0 ? '+ ' : '') + fmt.euro0(x);
  const tekenPct = (x, d = 2) => (x >= 0 ? '+ ' : '− ') + fmt.pct(Math.abs(x), d);
  const INDICATIEF = 'Indicatief: de gebruikte norm is een werkwaarde voor ' + N.peildatum + ' die nog niet is geverifieerd. Controleer de actuele norm';

  /* =====================================================================
   * Rekenen met procenten, cijfers en getallen
   * ===================================================================== */

  RT.add({
    id: 'percentage-verhouding', groep: G, naam: 'Percentage en groei uit twee bedragen',
    intro: 'Welk percentage is het ene bedrag van het andere, en met hoeveel procent is iets gestegen of gedaald?',
    kw: 'procent verhouding groei stijging daling toename afname',
    velden: [
      { k: 'a', l: 'Bedrag A (oud of geheel)', s: 'bedrag', std: 2400 },
      { k: 'b', l: 'Bedrag B (nieuw of deel)', s: 'bedrag', std: 2580 }
    ],
    bereken(v) {
      if (v.a === 0) return { fout: 'Bedrag A mag niet nul zijn: delen door nul kan niet.' };
      const aandeel = v.b / v.a * 100, groei = (v.b - v.a) / Math.abs(v.a) * 100;
      return {
        lbl: 'Verandering van A naar B', groot: tekenPct(groei, 2), onder: 'B is ' + fmt.pct(aandeel, 2) + ' van A',
        rijen: [
          ['Verschil in geld', tekenEuro(v.b - v.a)],
          ['B als percentage van A', fmt.pct(aandeel, 3)],
          ['A als percentage van B', v.b !== 0 ? fmt.pct(v.a / v.b * 100, 3) : '–'],
          ['Terug van B naar A', v.b !== 0 ? tekenPct((v.a - v.b) / Math.abs(v.b) * 100, 2) : '–', 'som']
        ],
        signalen: Math.abs(groei) > 0.005 ? ['Een stijging en een even grote daling heffen elkaar niet op: van B terug naar A is een ander percentage.'] : []
      };
    },
    uitleg: 'Aandeel = B / A × 100. Verandering = (B − A) / A × 100. De terugweg rekent met B als basis: (A − B) / B × 100.',
    letop: 'Let bij percentages altijd op de basis. Een verschil tussen twee percentages (bijvoorbeeld rente van 3% naar 4%) is 1 procentpunt, maar 33% hoger.'
  });

  RT.add({
    id: 'bedrag-bij-percentage', groep: G, naam: 'Bedrag bij een percentage en terug',
    intro: 'Bereken een percentage van een bedrag, het bedrag inclusief of exclusief een opslag, of het geheel waar een deel bij hoort.',
    kw: 'procent korting opslag btw inclusief exclusief deel geheel',
    velden: [
      { k: 'g', l: 'Bedrag', s: 'bedrag', std: 45000 },
      { k: 'p', l: 'Percentage', s: 'pct', std: 21 },
      { k: 'wat', l: 'Wat is het bedrag?', s: 'keuze', breed: true, std: 'geheel', opties: [
        ['geheel', 'Het geheel: bereken het percentage ervan'],
        ['deel', 'Het deel: bereken het geheel waarvan dit het percentage is'],
        ['incl', 'Inclusief opslag: haal de opslag eruit']] }
    ],
    bereken(v) {
      const f = v.p / 100;
      if (v.wat === 'deel') {
        if (f === 0) return { fout: 'Bij 0% hoort geen geheel.' };
        const geheel = v.g / f;
        return {
          lbl: 'Het geheel', groot: fmt.euro(geheel), onder: fmt.euro(v.g) + ' is ' + fmt.pct(v.p) + ' hiervan',
          rijen: [['Rest (geheel min deel)', fmt.euro(geheel - v.g)], ['Geheel plus deel', fmt.euro(geheel + v.g)]]
        };
      }
      if (v.wat === 'incl') {
        if (1 + f <= 0) return { fout: 'Kies een opslag groter dan −100%.' };
        const excl = v.g / (1 + f);
        return {
          lbl: 'Bedrag zonder opslag', groot: fmt.euro(excl), onder: 'opslag van ' + fmt.pct(v.p) + ' eruit gehaald',
          rijen: [['Opslag in geld', fmt.euro(v.g - excl), 'som'], ['Opslag als deel van het totaalbedrag', fmt.pct((v.g - excl) / v.g * 100, 3)]]
        };
      }
      const deel = v.g * f;
      return {
        lbl: fmt.pct(v.p) + ' van het bedrag', groot: fmt.euro(deel),
        rijen: [
          ['Bedrag plus percentage', fmt.euro(v.g + deel)],
          ['Bedrag min percentage', fmt.euro(v.g - deel)],
          ['Bedrag als dit het deel zou zijn: geheel', f ? fmt.euro(v.g / f) : '–']
        ]
      };
    },
    uitleg: 'Deel = geheel × p / 100. Geheel = deel / (p / 100). Opslag eruit: bedrag zonder opslag = bedrag / (1 + p / 100).',
    letop: 'Een opslag eruit halen is iets anders dan het percentage aftrekken: € 121 inclusief 21% is € 100 zonder opslag, niet € 95,59.'
  });

  RT.add({
    id: 'percentages-stapelen', groep: G, naam: 'Twee percentages na elkaar',
    intro: 'Wat is het totale effect als een bedrag eerst met het ene en daarna met het andere percentage verandert?',
    kw: 'procent stapelen cumulatief na elkaar korting stijging daling',
    velden: [
      { k: 'a', l: 'Eerste verandering', s: 'pct', std: 10 },
      { k: 'b', l: 'Tweede verandering', s: 'pct', std: -10 },
      { k: 'c', l: 'Derde verandering (optioneel)', s: 'pct', std: 0, opt: true },
      { k: 'start', l: 'Voorbeeldbedrag', s: 'eur', std: 1000 }
    ],
    bereken(v) {
      const factor = (1 + v.a / 100) * (1 + v.b / 100) * (1 + (v.c || 0) / 100);
      const samen = (factor - 1) * 100, som = v.a + v.b + (v.c || 0);
      return {
        lbl: 'Totale verandering', groot: tekenPct(samen, 3), onder: 'niet ' + fmt.pct(som, 2) + ' (de optelsom)',
        rijen: [
          ['Optelsom van de percentages', fmt.pct(som, 3)],
          ['Verschil met de optelsom', tekenPct(samen - som, 3)],
          ['Voorbeeldbedrag wordt', fmt.euro(v.start * factor)],
          ['Nodig om terug te komen op het begin', factor > 0 ? tekenPct((1 / factor - 1) * 100, 3) : '–', 'som']
        ]
      };
    },
    uitleg: 'Totaal = (1 + a) × (1 + b) × (1 + c) − 1, met a, b en c als fractie (10% = 0,10). Terug naar het begin: 1 / factor − 1.',
    letop: 'Percentages na elkaar mag je niet optellen: 10% erbij en daarna 10% eraf geeft −1%. Dat geldt ook voor rendementen in opeenvolgende jaren.'
  });

  const somGewogen = (waarden, wegingen) => {
    let s = 0, t = 0;
    waarden.forEach((x, i) => { const w = wegingen[i] === undefined ? 1 : wegingen[i]; s += x * w; t += w; });
    return { s, t };
  };

  RT.add({
    id: 'gewogen-gemiddelde', groep: G, naam: 'Gewogen gemiddelde',
    intro: 'Gemiddelde van waarden die niet allemaal even zwaar tellen, zoals cijfers met een weging of rendementen over verschillende bedragen.',
    kw: 'gemiddelde weging cijfer cijfers school studie wegingsfactor',
    velden: [
      { k: 'w', l: 'Waarden', s: 'tekst', std: '7,4; 6,1; 8; 5,6', breed: true, tip: 'Scheiden met puntkomma, spatie of nieuwe regel.' },
      { k: 'g', l: 'Wegingen', s: 'tekst', std: '1; 1; 2; 1', breed: true, tip: 'Ontbrekende wegingen tellen als 1.' },
      { k: 'grens', l: 'Grens voor voldoende', s: 'num', std: 5.5, opt: true }
    ],
    bereken(v) {
      const W = lees.reeks(v.w), G2 = lees.reeks(v.g);
      if (!W.length) return { fout: 'Vul minstens één waarde in.' };
      const { s, t } = somGewogen(W, G2);
      if (t === 0) return { fout: 'De som van de wegingen is nul.' };
      const gem = s / t, gewoon = W.reduce((x, y) => x + y, 0) / W.length;
      return {
        lbl: 'Gewogen gemiddelde', groot: fmt.getal(gem, 3), onder: 'over ' + W.length + (W.length === 1 ? ' waarde' : ' waarden'),
        rijen: [
          ['Afgerond op één decimaal', fmt.getal(Math.round(gem * 10) / 10, 1)],
          ['Ongewogen gemiddelde', fmt.getal(gewoon, 3)],
          ['Som van de wegingen', fmt.getal(t, 2)],
          v.grens ? ['Ten opzichte van ' + fmt.getal(v.grens, 1), gem >= v.grens ? 'voldoende' : 'onvoldoende', 'som'] : ['Hoogste waarde', fmt.getal(Math.max(...W), 2)]
        ],
        tabel: { kop: ['Nr.', 'Waarde', 'Weging', 'Bijdrage'], rijen: W.map((x, i) => { const g = G2[i] === undefined ? 1 : G2[i]; return [String(i + 1), fmt.getal(x, 2), fmt.getal(g, 2), fmt.pct(g / t * 100, 1)]; }) }
      };
    },
    uitleg: 'Gewogen gemiddelde = Σ (waarde × weging) / Σ weging. Het ongewogen gemiddelde telt elke waarde even zwaar.',
    letop: 'Scholen en opleidingen ronden soms per vak of per periode af voordat ze middelen. Volg de regels van het examenreglement.'
  });

  RT.add({
    id: 'benodigd-cijfer', groep: G, naam: 'Welk cijfer is nog nodig',
    intro: 'Welk cijfer moet de volgende toets opleveren om op een gewenst gemiddelde uit te komen?',
    kw: 'cijfer toets gemiddelde halen nodig herkansing',
    velden: [
      { k: 'c', l: 'Cijfers tot nu toe', s: 'tekst', std: '6,2; 5,4; 7,1', breed: true },
      { k: 'w', l: 'Wegingen', s: 'tekst', std: '1; 1; 1', breed: true, tip: 'Ontbrekende wegingen tellen als 1.' },
      { k: 'doel', l: 'Gewenst gemiddelde', s: 'num', std: 6.5 },
      { k: 'wx', l: 'Weging van de volgende toets', s: 'num', std: 2 },
      { k: 'max', l: 'Hoogst haalbare cijfer', s: 'num', std: 10 }
    ],
    bereken(v) {
      if (!(v.wx > 0)) return { fout: 'De weging van de volgende toets moet groter dan nul zijn.' };
      const { s, t } = somGewogen(lees.reeks(v.c), lees.reeks(v.w));
      const x = (v.doel * (t + v.wx) - s) / v.wx;
      const haalbaar = x <= v.max;
      return {
        lbl: 'Benodigd cijfer', groot: fmt.getal(x, 2), onder: haalbaar ? (x <= 1 ? 'het doel is al zeker gehaald' : 'haalbaar') : 'niet haalbaar met deze weging',
        rijen: [
          ['Huidig gemiddelde', t ? fmt.getal(s / t, 2) : '–'],
          ['Gemiddelde bij het hoogste cijfer', fmt.getal((s + v.max * v.wx) / (t + v.wx), 2)],
          ['Gemiddelde bij een 1', fmt.getal((s + 1 * v.wx) / (t + v.wx), 2), 'som']
        ],
        signalen: haalbaar ? [] : ['Zelfs met een ' + fmt.getal(v.max, 1) + ' wordt het gewenste gemiddelde niet gehaald.']
      };
    },
    uitleg: 'Benodigd = (doel × (Σ wegingen + nieuwe weging) − Σ (cijfer × weging)) / nieuwe weging.',
    letop: 'Afrondingsregels (bijvoorbeeld een 5,45 die als 5,5 telt) verschillen per opleiding en zijn hier niet toegepast.'
  });

  const ROM = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  const naarRomeins = n => { let s = ''; ROM.forEach(([w, t]) => { while (n >= w) { s += t; n -= w; } }); return s; };
  const uitRomeins = s => {
    const w = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let n = 0;
    for (let i = 0; i < s.length; i++) { const a = w[s[i]], b = w[s[i + 1]] || 0; n += a < b ? -a : a; }
    return n;
  };

  RT.add({
    id: 'romeinse-cijfers', groep: G, naam: 'Romeinse cijfers omzetten',
    intro: 'Zet een getal om in Romeinse cijfers, of een Romeins getal terug in gewone cijfers.',
    kw: 'romeins jaartal MMXXVI omzetten',
    velden: [
      { k: 'x', l: 'Getal of Romeins getal', s: 'tekst', std: '2026', tip: 'Van 1 tot en met 3999, bijvoorbeeld 1984 of MCMLXXXIV.' }
    ],
    bereken(v) {
      const s = String(v.x || '').trim().toUpperCase().replace(/\s/g, '');
      if (!s) return { fout: 'Vul een getal of Romeins getal in.' };
      if (/^\d+$/.test(s)) {
        const n = parseInt(s, 10);
        if (n < 1 || n > 3999) return { fout: 'Romeinse cijfers gaan hier van 1 tot en met 3999.' };
        const r = naarRomeins(n);
        return { lbl: 'In Romeinse cijfers', groot: r, rijen: [['Gewone cijfers', fmt.getal(n)], ['Aantal tekens', String(r.length)]] };
      }
      if (!/^[IVXLCDM]+$/.test(s)) return { fout: 'Gebruik alleen cijfers, of alleen de letters I, V, X, L, C, D en M.' };
      const n = uitRomeins(s);
      if (n < 1 || n > 3999 || naarRomeins(n) !== s) return { fout: '“' + fmt.esc(s) + '” is geen geldig Romeins getal in de gangbare schrijfwijze' + (n >= 1 && n <= 3999 ? ' (bedoeld is misschien ' + naarRomeins(n) + ')' : '') + '.' };
      return { lbl: 'In gewone cijfers', groot: fmt.getal(n), rijen: [['Romeins', s]] };
    },
    uitleg: 'Tekens: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Een kleiner teken vóór een groter wordt afgetrokken (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900); verder worden de tekens opgeteld.',
    letop: 'Alleen de gangbare schrijfwijze wordt geaccepteerd: IIII of IC worden afgekeurd.'
  });

  const ggd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  // Beste breuk met noemer ≤ max via kettingbreuken (inclusief halve convergenten)
  const besteBreuk = (x, max) => {
    let p0 = 0, q0 = 1, p1 = 1, q1 = 0, y = x;
    for (let s = 0; s < 64; s++) {
      const a = Math.floor(y), q2 = q0 + a * q1;
      if (q2 > max) {
        const k = Math.floor((max - q0) / q1), pk = p0 + k * p1, qk = q0 + k * q1;
        return Math.abs(pk / qk - x) < Math.abs(p1 / q1 - x) ? [pk, qk] : [p1, q1];
      }
      [p0, q0, p1, q1] = [p1, q1, p0 + a * p1, q2];
      if (Math.abs(y - a) < 1e-12) break;
      y = 1 / (y - a);
    }
    return [p1, q1];
  };

  RT.add({
    id: 'decimaal-als-breuk', groep: G, naam: 'Decimaal getal als breuk',
    intro: 'Schrijf een decimaal getal of percentage als eenvoudige breuk, bijvoorbeeld 37,5% = 3/8.',
    kw: 'breuk teller noemer decimaal percentage vereenvoudigen',
    velden: [
      { k: 'x', l: 'Getal', s: 'num', std: 37.5 },
      { k: 'soort', l: 'Het getal is', s: 'keuze', std: 'pct', opties: [['pct', 'Een percentage'], ['dec', 'Een decimaal getal']] },
      { k: 'max', l: 'Grootste noemer', s: 'keuze', std: '1000', opties: [['16', '16 (zoals bij inches)'], ['100', '100'], ['1000', '1.000'], ['100000', '100.000']] }
    ],
    bereken(v) {
      const x = v.soort === 'pct' ? v.x / 100 : v.x, max = +v.max;
      const teken = x < 0 ? -1 : 1, ax = Math.abs(x);
      let [p, q] = besteBreuk(ax, max);
      const d = ggd(p, q); p /= d; q /= d;
      const heel = Math.floor(p / q), rest = p - heel * q;
      const afw = p / q - ax;
      const t = teken < 0 ? '−' : '';
      return {
        lbl: 'Als breuk', groot: t + p + '/' + q, onder: Math.abs(afw) < 1e-12 ? 'exact' : 'benadering binnen noemer ' + fmt.getal(max),
        rijen: [
          ['Als decimaal getal', fmt.getal(teken * ax, 6)],
          ['Als gemengd getal', heel && rest ? t + heel + ' ' + rest + '/' + q : t + (rest ? rest + '/' + q : String(heel))],
          ['Afwijking', fmt.getal(afw * teken, 8), 'som']
        ]
      };
    },
    uitleg: 'Het getal wordt ontwikkeld als kettingbreuk; de laatste benadering met een noemer binnen de gekozen grens is de beste eenvoudige breuk. Die wordt daarna vereenvoudigd met de grootste gemene deler.',
    letop: 'Herhalende decimalen (zoals 0,333…) worden alleen exact als u genoeg decimalen invult; anders geeft de hulp de dichtstbijzijnde breuk.'
  });

  RT.add({
    id: 'bedrag-per-inwoner', groep: G, naam: 'Bedrag per inwoner of huishouden',
    intro: 'Maak een groot bedrag (een begrotingspost, een maatregel) tastbaar: wat is het per inwoner, per huishouden of per belastingbetaler?',
    kw: 'per nederlander inwoner huishouden begroting miljard',
    velden: [
      { k: 'b', l: 'Totaalbedrag', s: 'eur', std: 2500000000 },
      { k: 'inw', l: 'Aantal inwoners', s: 'eur', std: A.bevolking.inwoners, tip: 'Aanname; pas aan naar het actuele CBS-cijfer.' },
      { k: 'hh', l: 'Aantal huishoudens', s: 'eur', std: A.bevolking.huishoudens },
      { k: 'bp', l: 'Aantal belastingbetalers', s: 'eur', std: A.bevolking.belastingplichtigen }
    ],
    bereken(v) {
      if (!(v.inw > 0 && v.hh > 0 && v.bp > 0)) return { fout: 'De aantallen moeten groter dan nul zijn.' };
      return {
        lbl: 'Per inwoner', groot: fmt.euro(v.b / v.inw), onder: fmt.euro(v.b / v.inw / 12) + ' per maand',
        rijen: [
          ['Per huishouden', fmt.euro(v.b / v.hh)],
          ['Per belastingbetaler', fmt.euro(v.b / v.bp)],
          ['Per huishouden per maand', fmt.euro(v.b / v.hh / 12), 'som']
        ]
      };
    },
    uitleg: 'Totaalbedrag gedeeld door het gekozen aantal. Per maand = per jaar / 12.',
    letop: 'De aantallen zijn afgeronde aannames. Een bedrag per inwoner zegt niets over wie het werkelijk betaalt of ontvangt.'
  });

  RT.add({
    id: 'valuta-omrekenen', groep: G, naam: 'Valuta omrekenen met opslag',
    intro: 'Reken een bedrag om naar of van een vreemde valuta, inclusief de koersopslag en vaste kosten van bank of creditcard.',
    kw: 'wisselkoers valuta dollar pond creditcard pinnen buitenland opslag',
    velden: [
      { k: 'b', l: 'Bedrag', s: 'bedrag', std: 1000 },
      { k: 'r', l: 'Richting', s: 'keuze', std: 'uit', opties: [['uit', 'Euro omwisselen naar vreemde valuta'], ['in', 'Betaling in vreemde valuta, afgerekend in euro']] },
      { k: 'k', l: 'Koers: vreemde valuta per euro', s: 'num', std: 1.16, tip: 'Vul de actuele middenkoers in; de hulp haalt geen koersen op.' },
      { k: 'm', l: 'Koersopslag', s: 'pct', std: 1.5 },
      { k: 'vk', l: 'Vaste kosten in euro', s: 'bedrag', std: 0, opt: true }
    ],
    bereken(v) {
      if (!(v.k > 0)) return { fout: 'Vul een koers groter dan nul in.' };
      const m = v.m / 100;
      if (v.r === 'uit') {
        const kaal = v.b * v.k, krijgt = pos(v.b - v.vk) * v.k * (1 - m);
        return {
          lbl: 'U ontvangt (vreemde valuta)', groot: fmt.getal(krijgt, 2), onder: 'tegen de middenkoers zou het ' + fmt.getal(kaal, 2) + ' zijn',
          rijen: [
            ['Effectieve koers', fmt.getal(v.b > 0 ? krijgt / v.b : NaN, 4)],
            ['Kosten in euro (opslag en vast)', fmt.euro(v.b - krijgt / v.k), 'som'],
            ['Kosten in procenten', fmt.pct(v.b > 0 ? (1 - krijgt / kaal) * 100 : NaN, 2)]
          ]
        };
      }
      const kaal = v.b / v.k, betaalt = kaal * (1 + m) + v.vk;
      return {
        lbl: 'Afgeschreven in euro', groot: fmt.euro(betaalt), onder: 'tegen de middenkoers ' + fmt.euro(kaal),
        rijen: [
          ['Effectieve koers', fmt.getal(betaalt > 0 ? v.b / betaalt : NaN, 4)],
          ['Kosten in euro (opslag en vast)', fmt.euro(betaalt - kaal), 'som'],
          ['Kosten in procenten', fmt.pct(kaal > 0 ? (betaalt / kaal - 1) * 100 : NaN, 2)]
        ]
      };
    },
    uitleg: 'Omwisselen: (bedrag − vaste kosten) × koers × (1 − opslag). Betalen in vreemde valuta: bedrag / koers × (1 + opslag) + vaste kosten. De koers is het aantal eenheden vreemde valuta voor één euro.',
    letop: 'Banken en kaartmaatschappijen gebruiken eigen koersen en kostenstructuren. Kies bij betalen in het buitenland meestal voor afrekenen in de lokale valuta: omrekenen door de winkelier is vaak duurder.'
  });

  /* =====================================================================
   * Gezin, kinderen, scheiden en zorg
   * ===================================================================== */

  RT.add({
    id: 'kosten-kinderopvang', groep: G, naam: 'Netto kosten kinderopvang',
    intro: 'Wat kost de opvang per maand na aftrek van de kinderopvangtoeslag?',
    kw: 'kinderopvangtoeslag dagopvang bso gastouder toeslag uurprijs',
    peildatum: N.peildatum, fiscaal: ['Maximum uurtarief kinderopvangtoeslag', 'Vergoedingspercentage', 'Maximum aantal uren per maand'],
    velden: [
      { k: 'u', l: 'Uren opvang per maand', s: 'num', std: 120 },
      { k: 'tar', l: 'Uurprijs van de opvang', s: 'bedrag', std: 11.4 },
      { k: 'max', l: 'Maximum uurtarief voor de toeslag', s: 'bedrag', std: N.kinderopvang.maxUurtarief, tip: 'Dagopvang; voor bso en gastouder geldt een ander maximum.' },
      { k: 'p', l: 'Vergoedingspercentage', s: 'pct', std: N.kinderopvang.vergoedingPct, tip: 'Hangt af van het toetsingsinkomen.' },
      { k: 'mu', l: 'Maximum vergoede uren per maand', s: 'num', std: N.kinderopvang.maxUrenPerMaand }
    ],
    bereken(v) {
      if (!(v.u > 0)) return { fout: 'Vul het aantal uren in.' };
      const uren = Math.min(v.u, v.mu), kosten = v.u * v.tar;
      const toeslag = uren * Math.min(v.tar, v.max) * v.p / 100, netto = kosten - toeslag;
      return {
        lbl: 'Netto kosten per maand', groot: fmt.euro(netto), onder: fmt.euro(netto * 12) + ' per jaar',
        rijen: [
          ['Brutokosten per maand', fmt.euro(kosten)],
          ['Kinderopvangtoeslag', fmt.euro(toeslag)],
          ['Netto per uur', fmt.euro(netto / v.u)],
          ['Eigen deel van de kosten', fmt.pct(netto / kosten * 100, 1)],
          ['Deel boven het maximum uurtarief (niet vergoed)', fmt.euro(pos(v.tar - v.max) * uren), 'som']
        ],
        signalen: v.u > v.mu ? ['Er worden meer uren afgenomen dan het maximum; ' + fmt.getal(v.u - v.mu, 1) + ' uur telt niet mee voor de toeslag.'] : []
      };
    },
    uitleg: 'Toeslag = vergoede uren × laagste van (uurprijs, maximum uurtarief) × vergoedingspercentage. Vergoede uren = laagste van (afgenomen uren, maximum). Netto = uren × uurprijs − toeslag.',
    letop: INDICATIEF + ' bij de Dienst Toeslagen. Het vergoedingspercentage hangt af van het gezamenlijk toetsingsinkomen en is voor het eerste kind lager dan voor volgende kinderen; het aantal uren is ook begrensd door de gewerkte uren. De financiering van de kinderopvang wordt herzien; controleer welk stelsel in het betreffende jaar geldt.'
  });

  RT.add({
    id: 'kinderbijslag-per-kwartaal', groep: G, naam: 'Kinderbijslag per kwartaal',
    intro: 'Hoeveel kinderbijslag ontvangt een gezin per kwartaal, per maand en per jaar?',
    kw: 'kinderbijslag svb kind kwartaal toelage',
    peildatum: N.peildatum, fiscaal: ['Kinderbijslag per leeftijdsgroep'],
    velden: [
      { k: 'k1', l: 'Kinderen van 0 tot 6 jaar', s: 'num', std: 1, opt: true },
      { k: 'k2', l: 'Kinderen van 6 tot 12 jaar', s: 'num', std: 1, opt: true },
      { k: 'k3', l: 'Kinderen van 12 tot 18 jaar', s: 'num', std: 0, opt: true },
      { k: 'dub', l: 'Waarvan met dubbele kinderbijslag', s: 'num', std: 0, opt: true, tip: 'Bijvoorbeeld bij intensieve zorg of uitwonend om onderwijsredenen.' },
      { k: 'b1', l: 'Bedrag per kwartaal, 0 tot 6 jaar', s: 'bedrag', std: N.kinderbijslag.k0tot6 },
      { k: 'b2', l: 'Bedrag per kwartaal, 6 tot 12 jaar', s: 'bedrag', std: N.kinderbijslag.k6tot12 },
      { k: 'b3', l: 'Bedrag per kwartaal, 12 tot 18 jaar', s: 'bedrag', std: N.kinderbijslag.k12tot18 }
    ],
    bereken(v) {
      const n = Math.round(v.k1) + Math.round(v.k2) + Math.round(v.k3);
      if (n <= 0) return { fout: 'Vul minstens één kind in.' };
      if (v.dub > n) return { fout: 'Er kunnen niet meer kinderen dubbele kinderbijslag krijgen dan er kinderen zijn.' };
      // dubbele kinderbijslag: per kind tweemaal het eigen bedrag; hier benaderd met het gemiddelde bedrag per kind
      const basis = Math.round(v.k1) * v.b1 + Math.round(v.k2) * v.b2 + Math.round(v.k3) * v.b3;
      const extra = Math.round(v.dub) * basis / n;
      const kw = basis + extra;
      return {
        lbl: 'Kinderbijslag per kwartaal', groot: fmt.euro(kw), onder: fmt.euro(kw * 4) + ' per jaar',
        rijen: [
          ['Aantal kinderen', fmt.getal(n)],
          ['Per maand (gemiddeld)', fmt.euro(kw / 3)],
          ['Gemiddeld per kind per maand', fmt.euro(kw / 3 / n)],
          ['Waarvan extra door dubbele kinderbijslag', fmt.euro(extra), 'som']
        ]
      };
    },
    uitleg: 'Per kind een vast bedrag per kwartaal, afhankelijk van de leeftijd. Dubbele kinderbijslag verdubbelt het bedrag voor dat kind; zijn er kinderen in verschillende leeftijdsgroepen, dan rekent de hulp met het gemiddelde bedrag per kind.',
    letop: INDICATIEF + ' bij de SVB; de bedragen worden twee keer per jaar aangepast. De SVB betaalt na afloop van elk kwartaal uit; een hoger bedrag gaat in vanaf het kwartaal na de verjaardag (6 of 12 jaar).'
  });

  const ZORG = [['5', 'Minder dan 1 dag per week (5%)'], ['15', '1 dag per week (15%)'], ['25', '2 dagen per week (25%)'], ['35', '3 dagen of meer per week (35%)'], ['0', 'Geen zorgkorting']];

  RT.add({
    id: 'kinderalimentatie-indicatie', groep: G, naam: 'Kinderalimentatie (indicatie)',
    intro: 'Een eerste indicatie van de kinderalimentatie: behoefte van de kinderen, draagkracht van beide ouders en verdeling naar draagkracht.',
    kw: 'alimentatie kinderen scheiding behoefte draagkracht zorgkorting tremanormen',
    peildatum: N.peildatum, fiscaal: ['Woonbudget', 'Draagkrachtpercentage', 'Vast bedrag draagkrachtformule', 'Behoeftepercentages'],
    velden: [
      { k: 'nbi', l: 'Netto gezinsinkomen tijdens de relatie (per maand)', s: 'eur', std: 4200, breed: true },
      { k: 'kind', l: 'Aantal kinderen', s: 'num', std: 2 },
      { k: 'beh', l: 'Bekende behoefte per kind per maand', s: 'eur', std: 0, opt: true, tip: 'Laat op 0 om een schatting uit het gezinsinkomen te gebruiken.' },
      { k: 'n1', l: 'Netto besteedbaar inkomen betalende ouder', s: 'eur', std: 2700 },
      { k: 'n2', l: 'Netto besteedbaar inkomen verzorgende ouder', s: 'eur', std: 1800 },
      { k: 'zorg', l: 'Zorg door de betalende ouder', s: 'keuze', opties: ZORG, std: '15', breed: true },
      { k: 'woon', l: 'Woonbudget', s: 'pct', std: N.alimentatie.woonPct },
      { k: 'fact', l: 'Draagkrachtpercentage', s: 'pct', std: N.alimentatie.draagkrachtPct },
      { k: 'vast', l: 'Vast bedrag in de draagkrachtformule', s: 'eur', std: N.alimentatie.vastBedrag }
    ],
    bereken(v) {
      const k = Math.round(v.kind);
      if (k < 1) return { fout: 'Vul minstens één kind in.' };
      const pctBeh = N.alimentatie.behoeftePct[Math.min(4, k)];
      const beh = v.beh > 0 ? v.beh * k : v.nbi * pctBeh / 100;
      const dk = nbi => pos(v.fact / 100 * (nbi - (nbi * v.woon / 100 + v.vast)));
      const d1 = dk(v.n1), d2 = dk(v.n2), dt = d1 + d2;
      const aandeel1 = dt > 0 ? Math.min(beh, dt) * d1 / dt : 0;
      const zorgkorting = beh * (+v.zorg) / 100;
      const bijdrage = Math.min(d1, pos(aandeel1 - zorgkorting));
      return {
        lbl: 'Kinderalimentatie per maand (indicatie)', groot: fmt.euro0(bijdrage), onder: 'te betalen door de betalende ouder, voor ' + k + (k === 1 ? ' kind' : ' kinderen'),
        rijen: [
          ['Behoefte van de kinderen samen', fmt.euro0(beh) + (v.beh > 0 ? '' : ' (geschat: ' + fmt.pct(pctBeh, 0) + ')')],
          ['Draagkracht betalende ouder', fmt.euro0(d1)],
          ['Draagkracht verzorgende ouder', fmt.euro0(d2)],
          ['Aandeel betalende ouder in de behoefte', fmt.euro0(aandeel1)],
          ['Zorgkorting', fmt.euro0(zorgkorting)],
          ['Per kind per maand', fmt.euro0(bijdrage / k), 'som']
        ],
        signalen: dt < beh ? ['De gezamenlijke draagkracht (' + fmt.euro0(dt) + ') is lager dan de behoefte; de ouders kunnen de kosten niet volledig dragen.'] : []
      };
    },
    uitleg: 'Draagkracht per ouder = draagkrachtpercentage × (netto besteedbaar inkomen − (woonbudget × inkomen + vast bedrag)). Aandeel = behoefte × eigen draagkracht / totale draagkracht. Kinderalimentatie = aandeel − zorgkorting (percentage van de behoefte), maximaal de eigen draagkracht. Zonder bekende behoefte schat de hulp die als vast percentage van het netto gezinsinkomen.',
    letop: INDICATIEF + ' in de actuele rapportage alimentatienormen. Sterk vereenvoudigd: de werkelijke berekening gebruikt de tabel eigen aandeel kosten van kinderen, het kindgebonden budget, de werkelijke woonlasten en eventuele schulden. <b>Compliance:</b> alleen als oriëntatie in het gesprek; voor een alimentatieberekening verwijzen naar een familierechtadvocaat of mediator.'
  });

  RT.add({
    id: 'partneralimentatie-indicatie', groep: G, naam: 'Partneralimentatie (indicatie)',
    intro: 'Een eerste indicatie van partneralimentatie: aanvullende behoefte van de ontvanger, begrensd door de draagkracht van de betaler.',
    kw: 'alimentatie partner ex scheiding hofnorm behoefte draagkracht duur',
    peildatum: N.peildatum, fiscaal: ['Hofnorm', 'Woonbudget', 'Draagkrachtpercentage', 'Maximaal aftrektarief'],
    velden: [
      { k: 'nbi', l: 'Netto gezinsinkomen tijdens het huwelijk (per maand)', s: 'eur', std: 5200, breed: true },
      { k: 'kk', l: 'Kosten van de kinderen per maand', s: 'eur', std: 900, opt: true },
      { k: 'eigen', l: 'Netto eigen inkomen of verdiencapaciteit ontvanger', s: 'eur', std: 1300 },
      { k: 'nb', l: 'Netto besteedbaar inkomen betaler', s: 'eur', std: 3600 },
      { k: 'ka', l: 'Kinderalimentatie die de betaler al betaalt', s: 'eur', std: 450, opt: true },
      { k: 'duur', l: 'Duur van het huwelijk', s: 'num', na: 'jaar', std: 14 },
      { k: 'hof', l: 'Hofnorm', s: 'pct', std: N.alimentatie.hofnormPct },
      { k: 'woon', l: 'Woonbudget betaler', s: 'pct', std: N.alimentatie.woonPctPartner },
      { k: 'drg', l: 'Draagkrachtpercentage', s: 'pct', std: N.alimentatie.draagkrachtPctPartner }
    ],
    bereken(v) {
      const behoefte = pos(v.nbi - v.kk) * v.hof / 100;
      const aanvullend = pos(behoefte - v.eigen);
      const draagkracht = pos(v.nb * (1 - v.woon / 100) - v.ka) * v.drg / 100;
      const alim = Math.min(aanvullend, draagkracht);
      const tarief = RT.normen.aftrekTariefMax;
      const bruto = alim / (1 - tarief / 100);
      const duur = Math.min(v.duur / 2, 5);
      return {
        lbl: 'Partneralimentatie per maand (indicatie)', groot: fmt.euro0(alim), onder: 'netto; begrensd door de ' + (aanvullend <= draagkracht ? 'behoefte' : 'draagkracht'),
        rijen: [
          ['Behoefte volgens de hofnorm', fmt.euro0(behoefte)],
          ['Aanvullende behoefte na eigen inkomen', fmt.euro0(aanvullend)],
          ['Draagkracht betaler', fmt.euro0(draagkracht)],
          ['Bruto equivalent (indicatie, ' + fmt.pct(tarief) + ')', fmt.euro0(bruto)],
          ['Hoofdregel maximale duur', fmt.getal(duur, 1) + ' jaar', 'som']
        ]
      };
    },
    uitleg: 'Behoefte = hofnorm × (netto gezinsinkomen − kosten kinderen). Aanvullende behoefte = behoefte − eigen inkomen of verdiencapaciteit. Draagkracht = draagkrachtpercentage × (netto inkomen × (1 − woonbudget) − kinderalimentatie). Alimentatie = laagste van beide. Bruto equivalent: netto / (1 − aftrektarief), omdat de betaler partneralimentatie aftrekt tegen het maximale aftrektarief. Duur: de helft van de huwelijksduur, maximaal 5 jaar.',
    letop: INDICATIEF + '. Sterk vereenvoudigd: de rechter kijkt naar de volledige draagkrachtberekening, de jusvergelijking en de omstandigheden. Op de duur bestaan uitzonderingen (lang huwelijk dicht bij de AOW-leeftijd, jonge kinderen) en voor huwelijken die vóór 2020 zijn ontbonden geldt oud recht. <b>Compliance:</b> alleen als oriëntatie; voor een berekening verwijzen naar een familierechtadvocaat of mediator, en de uitkomst niet gebruiken als vaststaande last in een hypotheekadvies.'
  });

  RT.add({
    id: 'alimentatie-indexering', groep: G, naam: 'Alimentatie geïndexeerd',
    intro: 'Wat is een alimentatiebedrag na een of meer jaarlijkse wettelijke indexeringen, en hoeveel is er te weinig betaald als niet is geïndexeerd?',
    kw: 'alimentatie indexering index verhoging achterstand',
    peildatum: N.peildatum, fiscaal: ['Wettelijk indexeringspercentage per jaar (zelf invullen)'],
    velden: [
      { k: 'b', l: 'Alimentatie per maand (vóór indexering)', s: 'bedrag', std: 650 },
      { k: 'j', l: 'Eerste jaar van indexering', s: 'num', std: 2023 },
      { k: 'reeks', l: 'Indexeringspercentages', s: 'tekst', std: '2,5; 3; 2', breed: true, tip: 'Oudste jaar eerst, gescheiden door puntkomma. Voorbeeldwaarden: vul de officiële percentages in.' }
    ],
    bereken(v) {
      const R = lees.reeks(v.reeks);
      if (!R.length) return { fout: 'Vul minstens één indexeringspercentage in.' };
      const j0 = Math.round(v.j);
      let b = v.b, achter = 0;
      const rijen = R.map((r, i) => { const oud = b; b *= 1 + r / 100; achter += (b - v.b) * 12; return [String(j0 + i), fmt.pct(r, 2), fmt.euro(oud), fmt.euro(b), fmt.euro((b - v.b) * 12)]; });
      return {
        lbl: 'Geïndexeerd bedrag per maand', groot: fmt.euro(b), onder: 'per 1 januari ' + (j0 + R.length - 1),
        rijen: [
          ['Stijging per maand', fmt.euro(b - v.b)],
          ['Stijging in procenten', fmt.pct((b / v.b - 1) * 100, 2)],
          ['Te weinig betaald als nooit is geïndexeerd', fmt.euro(achter), 'som']
        ],
        tabel: { titel: 'Indexering per jaar', kop: ['Per 1 januari', 'Index', 'Voor', 'Na', 'Tekort dat jaar'], rijen }
      };
    },
    uitleg: 'Nieuw bedrag = bedrag × (1 + index jaar 1) × (1 + index jaar 2) × … Het tekort per jaar is 12 × (geïndexeerd bedrag − oorspronkelijk bedrag), over alle jaren opgeteld.',
    letop: 'De standaardpercentages zijn voorbeelden. Het wettelijke indexeringspercentage wordt elk jaar door de minister vastgesteld; vul de officiële percentages in. Indexering geldt van rechtswege tenzij die schriftelijk is uitgesloten, en achterstallige termijnen verjaren na vijf jaar. Partneralimentatie is voor de betaler aftrekbaar en voor de ontvanger belast.'
  });

  const HUISHOUDEN = [['alleen', 'Alleenstaand'], ['eenouder', 'Alleenstaande ouder'], ['partner', 'Met partner']];

  RT.add({
    id: 'rechtsbijstand-toets', groep: G, naam: 'Recht op gesubsidieerde rechtsbijstand',
    intro: 'Valt het inkomen en vermogen binnen de grenzen voor een toevoeging (gesubsidieerde advocaat), en welke eigen bijdrage hoort daar ongeveer bij?',
    kw: 'toevoeging advocaat rechtsbijstand eigen bijdrage raad juridisch loket',
    peildatum: N.peildatum, fiscaal: ['Inkomensgrenzen rechtsbijstand', 'Eigen bijdragen', 'Heffingsvrij vermogen box 3'],
    velden: [
      { k: 'ink', l: 'Toetsingsinkomen in het peiljaar', s: 'eur', std: 28000, tip: 'Het inkomen van twee jaar vóór de aanvraag.' },
      { k: 'hh', l: 'Huishouden', s: 'keuze', opties: HUISHOUDEN, std: 'alleen' },
      { k: 'verm', l: 'Vermogen (box 3, peiljaar)', s: 'eur', std: 15000 },
      { k: 'gA', l: 'Inkomensgrens alleenstaand', s: 'eur', std: N.rechtsbijstand.grensAlleen },
      { k: 'gS', l: 'Inkomensgrens met partner of kinderen', s: 'eur', std: N.rechtsbijstand.grensSamen }
    ],
    bereken(v) {
      const grens = v.hh === 'alleen' ? v.gA : v.gS;
      const vgrens = RT.normen.box3.heffingsvrij * (v.hh === 'partner' ? 2 : 1);
      const okInk = v.ink <= grens, okVerm = v.verm <= vgrens, recht = okInk && okVerm;
      const r = N.rechtsbijstand;
      const plaats = Math.min(1, pos((v.ink - grens * 0.55) / (grens * 0.45)));
      const eb = r.bijdrageMin + (r.bijdrageMax - r.bijdrageMin) * plaats;
      return {
        lbl: 'Recht op een toevoeging', groot: recht ? 'Waarschijnlijk wel' : 'Waarschijnlijk niet',
        onder: recht ? 'indicatieve eigen bijdrage ' + fmt.euro0(eb) : (!okInk ? 'inkomen boven de grens' : 'vermogen boven de grens'),
        rijen: [
          ['Inkomensgrens', fmt.euro0(grens)],
          ['Ruimte onder de inkomensgrens', tekenEuro0(grens - v.ink)],
          ['Vermogensgrens', fmt.euro0(vgrens)],
          ['Indicatieve eigen bijdrage', recht ? fmt.euro0(eb) : '–', 'som']
        ],
        signalen: !okInk ? ['Is het inkomen sinds het peiljaar fors gedaald, dan kan peiljaarverlegging naar het lopende jaar worden aangevraagd.'] : []
      };
    },
    uitleg: 'Recht bestaat als het toetsingsinkomen van het peiljaar (twee jaar terug) niet boven de grens voor het huishouden ligt én het vermogen niet boven het heffingsvrij vermogen van box 3 (met partner tweemaal). De eigen bijdrage loopt in werkelijkheid in treden op met het inkomen; de hulp benadert die lineair tussen de laagste en de hoogste bijdrage.',
    letop: INDICATIEF + ' bij de Raad voor Rechtsbijstand; grenzen en eigen bijdragen worden jaarlijks vastgesteld. Na een eerste advies via het Juridisch Loket of bij mediation kan de eigen bijdrage lager zijn; griffierecht komt er los bij.'
  });

  RT.add({
    id: 'eigen-bijdrage-wmo', groep: G, naam: 'Wmo: eigen bijdrage per maand',
    intro: 'Wat betaalt een huishouden aan eigen bijdrage voor Wmo-ondersteuning: het vaste abonnementstarief, of een inkomensafhankelijk scenario?',
    kw: 'wmo eigen bijdrage abonnementstarief huishoudelijke hulp cak gemeente',
    peildatum: N.peildatum, fiscaal: ['Abonnementstarief Wmo', 'Parameters inkomensafhankelijk scenario'],
    velden: [
      { k: 'regime', l: 'Regeling', s: 'keuze', std: 'abo', breed: true, opties: [['abo', 'Abonnementstarief (vast bedrag per maand)'], ['ink', 'Scenario: inkomensafhankelijke bijdrage']] },
      { k: 'tarief', l: 'Abonnementstarief per maand', s: 'bedrag', std: N.wmo.abonnement },
      { k: 'mnd', l: 'Aantal maanden ondersteuning', s: 'num', std: 12 },
      { k: 'ink', l: 'Verzamelinkomen huishouden', s: 'eur', std: 32000, als: v => v.regime === 'ink' },
      { k: 'drmp', l: 'Drempelinkomen scenario', s: 'eur', std: N.wmo.scenarioDrempel, als: v => v.regime === 'ink' },
      { k: 'pct', l: 'Bijdragepercentage boven de drempel', s: 'pct', std: N.wmo.scenarioPct, als: v => v.regime === 'ink' },
      { k: 'max', l: 'Maximum per maand scenario', s: 'bedrag', std: N.wmo.scenarioMax, als: v => v.regime === 'ink' }
    ],
    bereken(v) {
      const mnd = Math.max(0, Math.round(v.mnd));
      let bedrag = v.tarief;
      if (v.regime === 'ink') bedrag = Math.min(v.max, v.tarief + pos(v.ink - v.drmp) * v.pct / 100 / 12);
      return {
        lbl: 'Eigen bijdrage per maand', groot: fmt.euro(bedrag), onder: v.regime === 'ink' ? 'rekenscenario, geen geldende regeling' : 'abonnementstarief',
        rijen: [
          ['Totaal over ' + mnd + (mnd === 1 ? ' maand' : ' maanden'), fmt.euro(bedrag * mnd)],
          ['Partners', 'samen één bijdrage'],
          ['Meerkosten scenario ten opzichte van abonnement', v.regime === 'ink' ? fmt.euro((bedrag - v.tarief) * mnd) : '–', 'som']
        ]
      };
    },
    uitleg: 'Abonnementstarief: één vast bedrag per maand per huishouden, ongeacht inkomen en vermogen. Scenario: abonnementstarief + bijdragepercentage × (verzamelinkomen − drempel) / 12, met een maximum per maand.',
    letop: INDICATIEF + ' bij het CAK of de gemeente. Het kabinet wil de vaste bijdrage vervangen door een inkomens- en vermogensafhankelijke bijdrage; het scenario hier is een rekenvoorbeeld, geen vastgestelde regeling. Gemeenten kunnen voor bepaalde voorzieningen geen of een lagere bijdrage vragen.'
  });

  RT.add({
    id: 'vergoedingsrecht-echtgenoten', groep: G, naam: 'Vergoedingsrecht tussen echtgenoten',
    intro: 'Een echtgenoot heeft privégeld geïnvesteerd in een goed van de ander of van de gemeenschap. Welk bedrag komt hem of haar bij verdeling toe?',
    kw: 'vergoedingsrecht beleggingsleer nominaal scheiding huwelijk woning eigen geld',
    velden: [
      { k: 'inv', l: 'Geïnvesteerd privégeld', s: 'eur', std: 50000 },
      { k: 'aank', l: 'Aankoopprijs van het goed', s: 'eur', std: 300000, tip: 'Inclusief kosten koper als die zijn meegefinancierd.' },
      { k: 'nu', l: 'Huidige waarde', s: 'eur', std: 475000 },
      { k: 'm', l: 'Wat geldt er?', s: 'keuze', std: 'bel', breed: true, opties: [['bel', 'Beleggingsleer (hoofdregel sinds 2012)'], ['nom', 'Nominaal (schriftelijk afgesproken of vóór 2012)']] }
    ],
    bereken(v) {
      if (!(v.aank > 0)) return { fout: 'Vul een aankoopprijs groter dan nul in.' };
      const aandeel = v.inv / v.aank, evenredig = aandeel * v.nu;
      const bedrag = v.m === 'nom' ? v.inv : evenredig;
      return {
        lbl: 'Vergoedingsrecht', groot: fmt.euro0(bedrag), onder: v.m === 'nom' ? 'nominaal: het geïnvesteerde bedrag' : 'evenredig met de waardeontwikkeling',
        rijen: [
          ['Aandeel van de investering in de aankoop', fmt.pct(aandeel * 100, 2)],
          ['Evenredig deel van de huidige waarde', fmt.euro0(evenredig)],
          ['Nominaal bedrag', fmt.euro0(v.inv)],
          ['Verschil beleggingsleer en nominaal', tekenEuro0(evenredig - v.inv), 'som']
        ],
        signalen: evenredig < v.inv && v.m === 'bel' ? ['De waarde is gedaald: volgens de beleggingsleer deelt de investeerder ook in het verlies.'] : []
      };
    },
    uitleg: 'Beleggingsleer: vergoeding = investering / aankoopprijs × huidige waarde. Nominaal: vergoeding = geïnvesteerd bedrag. De beleggingsleer is sinds 2012 de wettelijke hoofdregel voor huwelijken en geregistreerde partnerschappen (art. 1:87 BW), tenzij schriftelijk anders is afgesproken.',
    letop: 'Vereenvoudigd: bij een gedeeltelijk met hypotheek gefinancierde aankoop, verbouwingen of aflossingen kan de berekening anders uitvallen. Is het geld gebruikt voor consumptieve uitgaven of aflossing van een schuld van de ander, dan gelden andere regels. <b>Compliance:</b> laat de verdeling vastleggen door notaris of advocaat; gebruik de uitkomst als indicatie bij het bepalen van de financieringsbehoefte bij uitkoop.'
  });

  RT.add({
    id: 'kosten-bruiloft', groep: G, naam: 'Budget voor een bruiloft',
    intro: 'Een overzicht van de totale kosten van een bruiloft, met de kosten per gast als grootste knop om aan te draaien.',
    kw: 'trouwen bruiloft huwelijk budget gasten feest sparen',
    velden: [
      { k: 'dag', l: 'Daggasten', s: 'num', std: 60 },
      { k: 'av', l: 'Extra avondgasten', s: 'num', std: 40, opt: true },
      { k: 'pdag', l: 'Eten en drinken per daggast', s: 'eur', std: 105 },
      { k: 'pav', l: 'Avondarrangement per gast', s: 'eur', std: 30 },
      { k: 'loc', l: 'Locatie en ceremonie (gemeente)', s: 'eur', std: 3200, opt: true },
      { k: 'kled', l: 'Kleding, ringen en styling', s: 'eur', std: 3500, opt: true },
      { k: 'foto', l: 'Fotograaf, video en muziek', s: 'eur', std: 3600, opt: true },
      { k: 'dec', l: 'Bloemen, decoratie en overig', s: 'eur', std: 2500, opt: true },
      { k: 'mnd', l: 'Maanden om te sparen', s: 'num', std: 12 }
    ],
    bereken(v) {
      const gasten = Math.round(v.dag) + Math.round(v.av || 0);
      if (gasten <= 0) return { fout: 'Vul het aantal gasten in.' };
      const perGast = Math.round(v.dag) * (v.pdag + v.pav) + Math.round(v.av || 0) * v.pav;
      const vast = (v.loc || 0) + (v.kled || 0) + (v.foto || 0) + (v.dec || 0);
      const tot = perGast + vast;
      return {
        lbl: 'Totale kosten', groot: fmt.euro0(tot), onder: fmt.euro0(tot / gasten) + ' gemiddeld per gast',
        rijen: [
          ['Kosten die meegroeien met het aantal gasten', fmt.euro0(perGast)],
          ['Vaste kosten', fmt.euro0(vast)],
          ['Besparing met 10 daggasten minder', fmt.euro0(10 * (v.pdag + v.pav))],
          ['Sparen per maand', v.mnd > 0 ? fmt.euro0(tot / v.mnd) : '–', 'som']
        ]
      };
    },
    uitleg: 'Variabele kosten = daggasten × (eten en drinken + avondarrangement) + avondgasten × avondarrangement. Totaal = variabele kosten + vaste posten. Sparen per maand = totaal / aantal maanden.',
    letop: 'De standaardbedragen zijn voorbeeldbedragen; prijzen verschillen sterk per regio en locatie. Een huwelijk of geregistreerd partnerschap heeft ook financiële gevolgen (huwelijksvermogensrecht, fiscaal partnerschap, nabestaandenvoorzieningen): bespreek die apart.'
  });

  /* =====================================================================
   * Energie en verduurzamen
   * ===================================================================== */

  const ENERGIEVELDEN = [
    { k: 'str', l: 'Stroomverbruik per jaar', s: 'num', na: 'kWh', std: 2800 },
    { k: 'gas', l: 'Gasverbruik per jaar', s: 'num', na: 'm³', std: 1200, opt: true },
    { k: 'ps', l: 'Prijs per kWh (inclusief belastingen)', s: 'bedrag', std: 0.29 },
    { k: 'pg', l: 'Prijs per m³ gas (inclusief belastingen)', s: 'bedrag', std: 1.38 },
    { k: 'vast', l: 'Vaste kosten per jaar (levering en netbeheer)', s: 'eur', std: 850 },
    { k: 'verm', l: 'Vermindering energiebelasting per jaar', s: 'eur', std: N.energie.verminderingEB }
  ];
  const energieJaar = (v, str, gas, factor = 1) => (str * v.ps + gas * v.pg) * factor + v.vast - v.verm;

  RT.add({
    id: 'energierekening', groep: G, naam: 'Energierekening bij nieuwe tarieven',
    intro: 'Wat worden de jaarkosten en het maandvoorschot voor stroom en gas als de tarieven veranderen?',
    kw: 'energie stroom gas voorschot tarief prijsstijging energiebelasting teruglevering',
    peildatum: N.peildatum, fiscaal: ['Vermindering energiebelasting'],
    velden: ENERGIEVELDEN.concat([
      { k: 'tl', l: 'Teruglevering per jaar', s: 'num', na: 'kWh', std: 0, opt: true },
      { k: 'pt', l: 'Vergoeding per teruggeleverde kWh', s: 'bedrag', std: N.energie.terugleververgoeding },
      { k: 'st', l: 'Verandering van de tarieven', s: 'pct', std: 8 }
    ]),
    bereken(v) {
      const teruggave = (v.tl || 0) * v.pt;
      const nu = energieJaar(v, v.str, v.gas || 0) - teruggave;
      const nieuw = energieJaar(v, v.str, v.gas || 0, 1 + v.st / 100) - teruggave;
      return {
        lbl: 'Nieuw voorschot per maand', groot: fmt.euro(nieuw / 12), onder: fmt.euro(nieuw) + ' per jaar',
        rijen: [
          ['Huidige jaarkosten', fmt.euro(nu)],
          ['Huidig voorschot per maand', fmt.euro(nu / 12)],
          ['Variabele kosten stroom en gas (nieuw)', fmt.euro((v.str * v.ps + (v.gas || 0) * v.pg) * (1 + v.st / 100))],
          ['Vergoeding teruglevering', fmt.euro(teruggave)],
          ['Verschil per maand', tekenEuro((nieuw - nu) / 12), 'som']
        ]
      };
    },
    uitleg: 'Jaarkosten = (stroom × prijs per kWh + gas × prijs per m³) × (1 + verandering) + vaste kosten − vermindering energiebelasting − vergoeding teruglevering. De verandering geldt alleen voor de leveringstarieven, niet voor de vaste kosten.',
    letop: INDICATIEF + ' bij de Belastingdienst (vermindering energiebelasting) en de leverancier. De salderingsregeling voor zonnepanelen vervalt per 1 januari 2027; daarna krijgt teruggeleverde stroom alleen de terugleververgoeding en kunnen terugleverkosten gelden.'
  });

  RT.add({
    id: 'energiekosten-besparing', groep: G, naam: 'Energierekening voor en na besparing',
    intro: 'Hoeveel lagere energiekosten levert een besparing op stroom en gas op, in euro en in CO₂?',
    kw: 'energie besparen stroom gas isoleren co2 energiebelasting',
    peildatum: N.peildatum, fiscaal: ['Vermindering energiebelasting'],
    velden: ENERGIEVELDEN.concat([
      { k: 'bs', l: 'Besparing op stroom', s: 'pct', std: 10 },
      { k: 'bg', l: 'Besparing op gas', s: 'pct', std: 20 }
    ]),
    bereken(v) {
      const gas = v.gas || 0;
      const nu = energieJaar(v, v.str, gas), na = energieJaar(v, v.str * (1 - v.bs / 100), gas * (1 - v.bg / 100));
      const kwh = v.str * v.bs / 100, m3 = gas * v.bg / 100;
      return {
        lbl: 'Besparing per jaar', groot: fmt.euro(nu - na), onder: fmt.euro((nu - na) / 12) + ' per maand',
        rijen: [
          ['Jaarkosten nu', fmt.euro(nu)],
          ['Jaarkosten na besparing', fmt.euro(na)],
          ['Besparing op de totale rekening', fmt.pct(nu > 0 ? (nu - na) / nu * 100 : NaN, 1)],
          ['Bespaarde kWh en m³', fmt.getal(kwh) + ' kWh en ' + fmt.getal(m3) + ' m³'],
          ['Minder CO₂-uitstoot', fmt.getal(kwh * A.co2.stroomKgPerKwh + m3 * A.co2.gasKgPerM3) + ' kg', 'som']
        ]
      };
    },
    uitleg: 'Jaarkosten = stroom × prijs per kWh + gas × prijs per m³ + vaste kosten − vermindering energiebelasting, één keer met het huidige verbruik en één keer met het verbruik na besparing. CO₂: ' + fmt.getal(A.co2.stroomKgPerKwh, 2) + ' kg per kWh en ' + fmt.getal(A.co2.gasKgPerM3, 3) + ' kg per m³ gas (aannames).',
    letop: INDICATIEF + ' bij de Belastingdienst. De vaste kosten en de belastingvermindering veranderen niet door besparen, dus de procentuele besparing op de rekening is lager dan op het verbruik.'
  });

  RT.add({
    id: 'stroomkosten-apparaat', groep: G, naam: 'Stroomkosten van een apparaat',
    intro: 'Wat kost het stroomverbruik van een apparaat per dag, per jaar en aan sluipverbruik?',
    kw: 'stroom apparaat watt kwh sluipverbruik verbruik kosten',
    velden: [
      { k: 'w', l: 'Vermogen in gebruik', s: 'num', na: 'watt', std: 1200 },
      { k: 'u', l: 'Uren in gebruik per dag', s: 'num', std: 1.5 },
      { k: 'd', l: 'Dagen in gebruik per jaar', s: 'num', std: 300 },
      { k: 'sb', l: 'Sluipverbruik (stand-by)', s: 'num', na: 'watt', std: 1, opt: true },
      { k: 'p', l: 'Prijs per kWh', s: 'bedrag', std: 0.29 }
    ],
    bereken(v) {
      const uren = v.u * v.d;
      if (uren > 8784) return { fout: 'Meer uren dan een jaar heeft: controleer uren per dag en dagen per jaar.' };
      const kwh = v.w * uren / 1000, sluip = (v.sb || 0) * pos(8760 - uren) / 1000, tot = kwh + sluip;
      return {
        lbl: 'Kosten per jaar', groot: fmt.euro(tot * v.p), onder: fmt.getal(tot, 1) + ' kWh per jaar',
        rijen: [
          ['Kosten per gebruiksuur', fmt.euro(v.w / 1000 * v.p, 3)],
          ['Kosten per gebruiksdag', fmt.euro(v.w * v.u / 1000 * v.p)],
          ['Waarvan sluipverbruik', fmt.getal(sluip, 1) + ' kWh = ' + fmt.euro(sluip * v.p)],
          ['CO₂-uitstoot (aanname ' + fmt.getal(A.co2.stroomKgPerKwh, 2) + ' kg/kWh)', fmt.getal(tot * A.co2.stroomKgPerKwh) + ' kg', 'som']
        ]
      };
    },
    uitleg: 'Verbruik in gebruik = vermogen (watt) × uren / 1000 kWh. Sluipverbruik = stand-byvermogen × de overige uren van het jaar (8.760) / 1000. Kosten = kWh × prijs per kWh.',
    letop: 'Veel apparaten (koelkast, wasmachine) gebruiken niet continu hun maximale vermogen; gebruik dan het jaarverbruik van het energielabel. Rekent met een vaste prijs; bij een dynamisch contract hangt de prijs af van het tijdstip.'
  });

  RT.add({
    id: 'zonnepanelen', groep: G, naam: 'Terugverdientijd zonnepanelen',
    intro: 'Wat leveren zonnepanelen per jaar op en na hoeveel jaar is de investering terugverdiend, uitgaande van de situatie zonder salderen?',
    kw: 'zonnepanelen saldering terugleveren terugverdientijd wattpiek opbrengst',
    peildatum: N.peildatum, fiscaal: ['Terugleververgoeding per kWh'],
    velden: [
      { k: 'n', l: 'Aantal panelen', s: 'num', std: 12 },
      { k: 'wp', l: 'Wattpiek per paneel', s: 'num', na: 'Wp', std: 430 },
      { k: 'f', l: 'Opbrengst per wattpiek', s: 'num', na: 'kWh/Wp', std: 0.88, tip: 'Ligt in Nederland meestal tussen 0,8 en 0,95.' },
      { k: 'inv', l: 'Investering', s: 'eur', std: 5400 },
      { k: 'eig', l: 'Direct zelf gebruikt', s: 'pct', std: 35 },
      { k: 'ps', l: 'Prijs per kWh die u bespaart', s: 'bedrag', std: 0.29 },
      { k: 'pt', l: 'Vergoeding per teruggeleverde kWh', s: 'bedrag', std: N.energie.terugleververgoeding, tip: 'Na afloop van het salderen; eventuele terugleverkosten hier verrekenen.' },
      { k: 'deg', l: 'Opbrengstverlies per jaar', s: 'pct', std: 0.5 },
      { k: 'st', l: 'Stijging energieprijzen per jaar', s: 'pct', std: 2 }
    ],
    bereken(v) {
      const kwh = v.n * v.wp * v.f;
      if (!(kwh > 0)) return { fout: 'Vul aantal panelen, wattpiek en opbrengst in.' };
      const e = v.eig / 100, voordeelPerKwh = e * v.ps + (1 - e) * v.pt;
      let cum = 0, jaar = null, tot25 = 0, k = kwh, p = 1;
      const rijen = [];
      for (let j = 1; j <= 40; j++) {
        const opbr = k * voordeelPerKwh * p, voor = cum;
        cum += opbr;
        if (jaar === null && cum >= v.inv) jaar = j - 1 + (v.inv - voor) / opbr;
        if (j <= 25) { tot25 += opbr; if (j <= 5 || j % 5 === 0) rijen.push([String(j), fmt.getal(k), fmt.euro0(opbr), fmt.euro0(cum - v.inv)]); }
        k *= 1 - v.deg / 100; p *= 1 + v.st / 100;
      }
      const jaar1 = kwh * voordeelPerKwh;
      return {
        lbl: 'Terugverdientijd', groot: jaar === null ? 'meer dan 40 jaar' : fmt.getal(jaar, 1) + ' jaar', onder: fmt.euro0(jaar1) + ' voordeel in het eerste jaar',
        rijen: [
          ['Vermogen', fmt.getal(v.n * v.wp / 1000, 2) + ' kWp'],
          ['Opbrengst eerste jaar', fmt.getal(kwh) + ' kWh'],
          ['Voordeel per maand (eerste jaar)', fmt.euro(jaar1 / 12)],
          ['Voordeel over 25 jaar', fmt.euro0(tot25)],
          ['Netto resultaat na 25 jaar', fmt.euro0(tot25 - v.inv), 'som']
        ],
        tabel: { titel: 'Verloop', kop: ['Jaar', 'Opbrengst kWh', 'Voordeel', 'Saldo t.o.v. investering'], rijen }
      };
    },
    uitleg: 'Opbrengst = panelen × wattpiek × opbrengst per wattpiek. Voordeel per kWh = deel eigen gebruik × stroomprijs + rest × terugleververgoeding. Elk jaar daalt de opbrengst met het opbrengstverlies en stijgt de prijs met de prijsstijging. De terugverdientijd is het moment waarop het opgetelde voordeel de investering bereikt.',
    letop: INDICATIEF + ' bij de energieleverancier. De salderingsregeling eindigt per 1 januari 2027; deze hulp rekent daarom zonder salderen (in 2026 is het voordeel nog hoger). Leveranciers kunnen terugleverkosten in rekening brengen. Vervanging van de omvormer en onderhoud zijn niet meegerekend.'
  });

  RT.add({
    id: 'warmtepomp-besparing', groep: G, naam: 'Besparing warmtepomp',
    intro: 'Wat levert een (hybride) warmtepomp op aan minder gas en meer stroom, en wanneer is hij terugverdiend?',
    kw: 'warmtepomp hybride scop gas stroom isde subsidie terugverdientijd',
    peildatum: N.peildatum, fiscaal: ['ISDE-subsidie warmtepomp'],
    velden: [
      { k: 'gas', l: 'Gasverbruik nu', s: 'num', na: 'm³', std: 1400 },
      { k: 'deel', l: 'Deel van het gas dat de warmtepomp vervangt', s: 'pct', std: 70, tip: 'Hybride vaak 50–80%, volledig elektrisch tot 100% minus koken.' },
      { k: 'scop', l: 'SCOP van de warmtepomp', s: 'num', std: 3.8 },
      { k: 'rend', l: 'Rendement van de cv-ketel', s: 'pct', std: 95 },
      { k: 'pg', l: 'Gasprijs per m³', s: 'bedrag', std: 1.38 },
      { k: 'ps', l: 'Stroomprijs per kWh', s: 'bedrag', std: 0.29 },
      { k: 'inv', l: 'Investering', s: 'eur', std: 9500 },
      { k: 'sub', l: 'Subsidie', s: 'eur', std: N.isdeWarmtepomp, opt: true }
    ],
    bereken(v) {
      if (!(v.scop > 0)) return { fout: 'Vul een SCOP groter dan nul in.' };
      const m3 = v.gas * v.deel / 100, warmte = m3 * A.gasKwhPerM3 * v.rend / 100, kwh = warmte / v.scop;
      const besp = m3 * v.pg - kwh * v.ps, netInv = v.inv - (v.sub || 0);
      return {
        lbl: 'Terugverdientijd', groot: besp > 0 ? fmt.getal(netInv / besp, 1) + ' jaar' : 'niet terugverdiend', onder: 'netto besparing ' + fmt.euro0(besp) + ' per jaar',
        rijen: [
          ['Minder gas', fmt.getal(m3) + ' m³ = ' + fmt.euro0(m3 * v.pg)],
          ['Te leveren warmte', fmt.getal(warmte) + ' kWh'],
          ['Extra stroom', fmt.getal(kwh) + ' kWh = ' + fmt.euro0(kwh * v.ps)],
          ['Investering na subsidie', fmt.euro0(netInv)],
          ['Minder CO₂-uitstoot', fmt.getal(m3 * A.co2.gasKgPerM3 - kwh * A.co2.stroomKgPerKwh) + ' kg per jaar', 'som']
        ]
      };
    },
    uitleg: 'Warmte = bespaard gas × ' + fmt.getal(A.gasKwhPerM3, 2) + ' kWh per m³ × ketelrendement. Extra stroom = warmte / SCOP. Besparing = bespaard gas × gasprijs − extra stroom × stroomprijs. Terugverdientijd = (investering − subsidie) / besparing, zonder prijsstijging of rente.',
    letop: INDICATIEF + ' bij RVO (ISDE); het subsidiebedrag hangt af van type en vermogen. De praktijk-SCOP is bij hoge aanvoertemperaturen (slecht geïsoleerde woning) vaak lager dan opgegeven. Verduurzamingskosten kunnen soms buiten de normale leennorm worden meegefinancierd; toets dat apart.'
  });

  RT.add({
    id: 'glasisolatie', groep: G, naam: 'Besparing door beter glas',
    intro: 'Hoeveel gas en geld bespaart vervanging van enkel of dubbel glas door hr++ of triple glas?',
    kw: 'glas hr++ triple isolatie u-waarde raam besparing gas',
    velden: [
      { k: 'opp', l: 'Glasoppervlak', s: 'num', na: 'm²', std: 24 },
      { k: 'u1', l: 'Huidige U-waarde', s: 'keuze', std: '2.9', opties: [['5.8', 'Enkel glas (5,8)'], ['2.9', 'Dubbel glas (2,9)'], ['1.2', 'Hr++ glas (1,2)']] },
      { k: 'u2', l: 'Nieuwe U-waarde', s: 'keuze', std: '1.1', opties: [['1.2', 'Hr++ glas (1,2)'], ['1.1', 'Hr++ glas, nieuw (1,1)'], ['0.7', 'Triple glas (0,7)'], ['0.5', 'Triple glas, beste (0,5)']] },
      { k: 'gd', l: 'Graaddagen per jaar', s: 'num', std: A.graaddagen, tip: 'Aanname voor een gemiddeld jaar.' },
      { k: 'rend', l: 'Rendement van de cv-ketel', s: 'pct', std: 95 },
      { k: 'pg', l: 'Gasprijs per m³', s: 'bedrag', std: 1.38 },
      { k: 'inv', l: 'Investering', s: 'eur', std: 5800 },
      { k: 'sub', l: 'Subsidie', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const du = +v.u1 - +v.u2;
      if (du <= 0) return { fout: 'De nieuwe U-waarde moet lager zijn dan de huidige.' };
      const kwh = du * v.opp * v.gd * 24 / 1000, m3 = kwh / (A.gasKwhPerM3 * v.rend / 100), besp = m3 * v.pg;
      const netInv = v.inv - (v.sub || 0);
      return {
        lbl: 'Besparing per jaar', groot: fmt.euro0(besp), onder: fmt.getal(m3) + ' m³ gas minder',
        rijen: [
          ['Minder warmteverlies', fmt.getal(kwh) + ' kWh'],
          ['Investering na subsidie', fmt.euro0(netInv)],
          ['Terugverdientijd', besp > 0 ? fmt.getal(netInv / besp, 1) + ' jaar' : '–'],
          ['Minder CO₂-uitstoot', fmt.getal(m3 * A.co2.gasKgPerM3) + ' kg per jaar', 'som']
        ]
      };
    },
    uitleg: 'Bespaarde warmte = (oude U-waarde − nieuwe U-waarde) × oppervlak × graaddagen × 24 / 1000 kWh. Gas = warmte / (' + fmt.getal(A.gasKwhPerM3, 2) + ' kWh per m³ × ketelrendement). Terugverdientijd = (investering − subsidie) / besparing.',
    letop: 'Graaddagen en verbrandingswaarde zijn aannames; de werkelijke besparing hangt af van stookgedrag, kozijnen en ventilatie. Beter glas verbetert ook comfort en energielabel, wat de maximale financiering kan beïnvloeden. Controleer de actuele subsidievoorwaarden zelf.'
  });

  const geluidOpAfstand = (lw, r, refl) => lw - 10 * Math.log10(2 * Math.PI * r * r) + refl;
  const afstandVoorNorm = (lw, refl, norm) => Math.sqrt(Math.pow(10, (lw + refl - norm) / 10) / (2 * Math.PI));
  const REFLECTIE = [['0', 'Vrij opgesteld (0 dB)'], ['3', 'Tegen één gevel (+3 dB)'], ['6', 'In een hoek van twee gevels (+6 dB)'], ['9', 'In een nis (+9 dB)']];

  RT.add({
    id: 'geluid-op-afstand', groep: G, naam: 'Geluid van een buitenunit op afstand',
    intro: 'Hoeveel geluid geeft de buitenunit van een warmtepomp of airco op de erfgrens, en voldoet dat aan de norm?',
    kw: 'geluid decibel db buitenunit warmtepomp airco erfgrens buren',
    velden: [
      { k: 'lw', l: 'Geluidsvermogen van de unit (Lw)', s: 'num', na: 'dB(A)', std: 55, tip: 'Staat in de productspecificatie, niet de geluidsdruk op 1 meter.' },
      { k: 'r', l: 'Afstand tot de erfgrens', s: 'num', na: 'meter', std: 3 },
      { k: 'refl', l: 'Opstelling', s: 'keuze', opties: REFLECTIE, std: '3', breed: true },
      { k: 'norm', l: 'Norm op de erfgrens', s: 'num', na: 'dB(A)', std: A.geluidNorm }
    ],
    bereken(v) {
      if (!(v.r > 0)) return { fout: 'Vul een afstand groter dan nul in.' };
      const refl = +v.refl, L = geluidOpAfstand(v.lw, v.r, refl);
      const ok = L <= v.norm;
      return {
        lbl: 'Geluid op de erfgrens', groot: fmt.getal(L, 1) + ' dB(A)', onder: ok ? 'voldoet aan ' + fmt.getal(v.norm) + ' dB(A)' : 'te hoog: ' + fmt.getal(L - v.norm, 1) + ' dB boven de norm',
        rijen: [
          ['Minimale afstand voor de norm', fmt.getal(afstandVoorNorm(v.lw, refl, v.norm), 2) + ' m'],
          ['Op de dubbele afstand', fmt.getal(geluidOpAfstand(v.lw, 2 * v.r, refl), 1) + ' dB(A)'],
          ['Toets', ok ? 'voldoet' : 'voldoet niet', 'som']
        ]
      };
    },
    uitleg: 'Geluidsdruk = Lw − 10 × log₁₀(2π × r²) + opslag voor reflectie (puntbron boven een harde ondergrond). Elke verdubbeling van de afstand geeft 6 dB minder.',
    letop: 'De norm van ' + A.geluidNorm + ' dB(A) op de perceelgrens is een aanname op basis van de bouwregels; controleer de actuele eis en eventuele gemeentelijke maatwerkregels. Bij twijfel of klachten is een akoestisch rapport nodig.'
  });

  RT.add({
    id: 'afstand-buitenunit', groep: G, naam: 'Minimale afstand buitenunit warmtepomp',
    intro: 'Hoe ver moet de buitenunit van de erfgrens staan om aan de geluidsnorm te voldoen, ook in de nachtstand?',
    kw: 'afstand buitenunit warmtepomp airco erfgrens geluid norm nachtstand',
    velden: [
      { k: 'lw', l: 'Geluidsvermogen van de unit (Lw)', s: 'num', na: 'dB(A)', std: 56 },
      { k: 'refl', l: 'Opstelling', s: 'keuze', opties: REFLECTIE, std: '3', breed: true },
      { k: 'nacht', l: 'Reductie in de nachtstand', s: 'num', na: 'dB', std: 4, opt: true },
      { k: 'besch', l: 'Beschikbare afstand', s: 'num', na: 'meter', std: 2.5 },
      { k: 'norm', l: 'Norm op de erfgrens', s: 'num', na: 'dB(A)', std: A.geluidNorm }
    ],
    bereken(v) {
      const refl = +v.refl, r = afstandVoorNorm(v.lw, refl, v.norm), rn = afstandVoorNorm(v.lw - (v.nacht || 0), refl, v.norm);
      const op = v.besch > 0 ? geluidOpAfstand(v.lw, v.besch, refl) : NaN;
      return {
        lbl: 'Minimale afstand tot de erfgrens', groot: fmt.getal(r, 2) + ' m', onder: 'in de nachtstand ' + fmt.getal(rn, 2) + ' m',
        rijen: [
          ['Geluid op de beschikbare afstand', fmt.getal(op, 1) + ' dB(A)'],
          ['Voldoet op ' + fmt.getal(v.besch, 1) + ' m?', op <= v.norm ? 'ja' : 'nee'],
          ['Benodigde extra demping', op > v.norm ? fmt.getal(op - v.norm, 1) + ' dB' : 'geen', 'som']
        ],
        signalen: op > v.norm ? ['Oplossingen: een stillere unit, een geluidsomkasting, een andere opstelling (minder reflectie) of de nachtstand.'] : []
      };
    },
    uitleg: 'Uit Lw − 10 × log₁₀(2π × r²) + reflectie ≤ norm volgt r = √(10<sup>(Lw + reflectie − norm) / 10</sup> / 2π).',
    letop: 'De norm van ' + A.geluidNorm + ' dB(A) is een aanname; controleer de geldende eis bij de gemeente. Het model negeert afscherming door schuttingen en bebouwing en geeft dus een veilige bovengrens van de afstand.'
  });

  RT.add({
    id: 'brandstofkosten', groep: G, naam: 'Brandstof- of laadkosten',
    intro: 'Wat kost het rijden per jaar, per maand en per kilometer aan brandstof of stroom?',
    kw: 'brandstof benzine diesel laden elektrisch auto kilometer verbruik',
    velden: [
      { k: 'km', l: 'Kilometers per jaar', s: 'num', std: 15000 },
      { k: 's', l: 'Hoe geeft u het verbruik op?', s: 'keuze', std: 'kml', breed: true, opties: [['kml', 'Brandstof: kilometers per liter'], ['l100', 'Brandstof: liters per 100 km'], ['ev', 'Elektrisch: kWh per 100 km']] },
      { k: 'vb', l: 'Verbruik', s: 'num', std: 16 },
      { k: 'pr', l: 'Prijs per liter of kWh', s: 'bedrag', std: 2.05 }
    ],
    bereken(v) {
      if (!(v.vb > 0)) return { fout: 'Vul een verbruik groter dan nul in.' };
      const eenheden = v.s === 'kml' ? v.km / v.vb : v.km * v.vb / 100;
      const kosten = eenheden * v.pr;
      return {
        lbl: 'Kosten per jaar', groot: fmt.euro0(kosten), onder: fmt.euro(kosten / 12) + ' per maand',
        rijen: [
          ['Verbruik per jaar', fmt.getal(eenheden) + (v.s === 'ev' ? ' kWh' : ' liter')],
          ['Kosten per kilometer', v.km > 0 ? fmt.euro(kosten / v.km, 3) : '–'],
          ['Kosten per 100 km', v.km > 0 ? fmt.euro(kosten / v.km * 100) : '–', 'som']
        ]
      };
    },
    uitleg: 'Kilometers per liter: liters = km / verbruik. Liters of kWh per 100 km: eenheden = km × verbruik / 100. Kosten = eenheden × prijs.',
    letop: 'Alleen brandstof of stroom; afschrijving, verzekering, motorrijtuigenbelasting en onderhoud zijn niet meegeteld. Thuisladen en snelladen verschillen sterk in prijs.'
  });

  /* ---------- CO₂ ---------- */
  const co2Prijs = (kg, prijs) => kg / 1000 * prijs;

  RT.add({
    id: 'co2-woon-werk', groep: G, naam: 'CO₂ van woon-werkverkeer',
    intro: 'Hoeveel CO₂ stoot het woon-werkverkeer per jaar uit, en wat zijn de maatschappelijke kosten daarvan?',
    kw: 'co2 uitstoot woon-werk forenzen auto trein fiets klimaat',
    velden: [
      { k: 'km', l: 'Enkele reis', s: 'num', na: 'km', std: 28 },
      { k: 'dgn', l: 'Reisdagen per jaar', s: 'num', std: 190 },
      { k: 'm', l: 'Vervoermiddel', s: 'keuze', std: 'benzine', opties: [['benzine', 'Auto op benzine'], ['diesel', 'Auto op diesel'], ['elektrisch', 'Elektrische auto'], ['trein', 'Trein'], ['bus', 'Bus'], ['fiets', 'Fiets of lopen']] },
      { k: 'prijs', l: 'CO₂-prijs per ton', s: 'eur', std: A.co2.prijsPerTon, tip: 'Aanname voor de maatschappelijke kosten.' }
    ],
    bereken(v) {
      const f = v.m === 'fiets' ? 0 : A.co2[v.m], km = v.km * 2 * v.dgn, kg = km * f / 1000;
      return {
        lbl: 'CO₂-uitstoot per jaar', groot: fmt.getal(kg) + ' kg', onder: fmt.getal(km) + ' km per jaar',
        rijen: [
          ['Gebruikte factor', fmt.getal(f) + ' g per km'],
          ['Maatschappelijke kosten per jaar', fmt.euro(co2Prijs(kg, v.prijs))],
          ['Minder bij twee dagen per week thuiswerken', fmt.getal(kg * 2 / 5) + ' kg'],
          ['Extra CO₂-kosten ten opzichte van de trein', tekenEuro(co2Prijs(kg - km * A.co2.trein / 1000, v.prijs)), 'som']
        ]
      };
    },
    uitleg: 'Kilometers = enkele reis × 2 × reisdagen. CO₂ = kilometers × emissiefactor. Maatschappelijke kosten = ton CO₂ × CO₂-prijs. Factoren (gram per km): benzine ' + A.co2.benzine + ', diesel ' + A.co2.diesel + ', elektrisch ' + A.co2.elektrisch + ', trein ' + A.co2.trein + ', bus ' + A.co2.bus + '.',
    letop: 'De emissiefactoren en de CO₂-prijs zijn afgeronde aannames (inclusief productie van brandstof en stroom); werkelijke waarden verschillen per voertuig en bezetting.'
  });

  RT.add({
    id: 'co2-reis', groep: G, naam: 'CO₂ van een vakantiereis',
    intro: 'Hoeveel CO₂ kost een vakantiereis heen en terug met vliegtuig, auto, trein of touringcar?',
    kw: 'co2 vakantie vliegen reis uitstoot klimaat trein auto',
    velden: [
      { k: 'km', l: 'Afstand enkele reis', s: 'num', na: 'km', std: 1800 },
      { k: 'pers', l: 'Aantal reizigers', s: 'num', std: 4 },
      { k: 'm', l: 'Vervoermiddel', s: 'keuze', std: 'vliegtuig', opties: [['vliegtuig', 'Vliegtuig'], ['auto', 'Auto (alle reizigers samen)'], ['trein', 'Trein'], ['touringcar', 'Touringcar']] },
      { k: 'hf', l: 'Opslag voor het effect op grote hoogte', s: 'num', na: '×', std: A.co2.hoogteFactor, als: v => v.m === 'vliegtuig' },
      { k: 'prijs', l: 'CO₂-prijs per ton', s: 'eur', std: A.co2.prijsPerTon }
    ],
    bereken(v) {
      const p = Math.round(v.pers);
      if (p < 1) return { fout: 'Vul minstens één reiziger in.' };
      const km = v.km * 2;
      let kg;
      if (v.m === 'vliegtuig') kg = km * A.co2.vliegtuig * v.hf / 1000 * p;
      else if (v.m === 'auto') kg = km * A.co2.benzine / 1000;
      else kg = km * A.co2[v.m] / 1000 * p;
      return {
        lbl: 'CO₂-uitstoot van de reis', groot: fmt.getal(kg) + ' kg', onder: fmt.getal(kg / p) + ' kg per persoon',
        rijen: [
          ['Afstand heen en terug', fmt.getal(km) + ' km'],
          ['Maatschappelijke kosten', fmt.euro(co2Prijs(kg, v.prijs))],
          ['Per persoon', fmt.euro(co2Prijs(kg, v.prijs) / p)],
          ['Deel van een gemiddelde jaaruitstoot per persoon', fmt.pct(kg / p / A.co2.jaarPerPersoon * 100, 1), 'som']
        ]
      };
    },
    uitleg: 'Vliegtuig: km × ' + A.co2.vliegtuig + ' g per reiziger × opslag × reizigers. Auto: km × ' + A.co2.benzine + ' g (één auto). Trein en touringcar: km × factor per reiziger × reizigers. Jaaruitstoot per persoon: aanname ' + fmt.getal(A.co2.jaarPerPersoon) + ' kg.',
    letop: 'Alle factoren zijn afgeronde aannames. Bij vliegen is de opslag voor het effect van uitstoot op grote hoogte wetenschappelijk onzeker; korte vluchten stoten per kilometer meer uit dan lange.'
  });

  RT.add({
    id: 'co2-cruisereis', groep: G, naam: 'CO₂ van een cruise',
    intro: 'Hoeveel CO₂ stoot een cruisevakantie uit, inclusief de reis naar en van de haven?',
    kw: 'co2 cruise schip vakantie uitstoot klimaat',
    velden: [
      { k: 'dgn', l: 'Dagen aan boord', s: 'num', std: 10 },
      { k: 'pers', l: 'Aantal personen', s: 'num', std: 2 },
      { k: 'f', l: 'Uitstoot per passagier per dag', s: 'num', na: 'kg', std: A.co2.cruisePerDag, tip: 'Verschilt sterk per schip; gebruik de opgave van de rederij als die er is.' },
      { k: 'kmH', l: 'Reis naar de haven, enkele reis', s: 'num', na: 'km', std: 800, opt: true },
      { k: 'mH', l: 'Vervoer naar de haven', s: 'keuze', std: 'auto', opties: [['auto', 'Auto'], ['vliegtuig', 'Vliegtuig'], ['trein', 'Trein']] },
      { k: 'prijs', l: 'CO₂-prijs per ton', s: 'eur', std: A.co2.prijsPerTon }
    ],
    bereken(v) {
      const p = Math.round(v.pers), d = Math.round(v.dgn);
      if (p < 1 || d < 1) return { fout: 'Vul minstens één persoon en één dag in.' };
      const boord = d * p * v.f, km = (v.kmH || 0) * 2;
      const reis = v.mH === 'auto' ? km * A.co2.benzine / 1000 : v.mH === 'vliegtuig' ? km * A.co2.vliegtuig * A.co2.hoogteFactor / 1000 * p : km * A.co2.trein / 1000 * p;
      const tot = boord + reis;
      return {
        lbl: 'CO₂-uitstoot van de cruise', groot: fmt.getal(tot) + ' kg', onder: fmt.getal(tot / p) + ' kg per persoon',
        rijen: [
          ['Aan boord', fmt.getal(boord) + ' kg'],
          ['Reis naar en van de haven', fmt.getal(reis) + ' kg'],
          ['Maatschappelijke kosten', fmt.euro(co2Prijs(tot, v.prijs))],
          ['Deel van een gemiddelde jaaruitstoot per persoon', fmt.pct(tot / p / A.co2.jaarPerPersoon * 100, 1), 'som']
        ]
      };
    },
    uitleg: 'Aan boord = dagen × personen × uitstoot per passagier per dag. Reis naar de haven heen en terug: auto ' + A.co2.benzine + ' g per km (één auto), vliegtuig ' + A.co2.vliegtuig + ' g × ' + fmt.getal(A.co2.hoogteFactor, 1) + ' per reiziger, trein ' + A.co2.trein + ' g per reiziger.',
    letop: 'De uitstoot per passagiersdag is een grove aanname en verschilt sterk per schip, brandstof en bezetting.'
  });
})(window.RT);
