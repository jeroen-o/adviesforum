/* Rekenhulpen – groep "inkomen-werk" (Werk, inkomen en uitkering).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const F = RT.fisc, NR = RT.normen;
  const { dagVerschil, plusMaanden } = RT.kal;

  /* Normen die (nog) niet in js/rekentools/normen.js staan. Peildatum 2026.
   * Alle waarden: waarde uit bron, niet geverifieerd. Controleer bij UWV, Rijksoverheid of de Belastingdienst
   * en verplaats ze naar normen.js zodra de beheerder ze heeft vastgesteld. */
  const N = {
    peildatum: '2026',
    transitieMax: 98000,              // wettelijk maximum transitievergoeding (of een hoger jaarsalaris)
    kmOnbelast: 0.23,                 // onbelaste reiskostenvergoeding per kilometer
    verlofUitkeringPct: 70,           // UWV-uitkering betaald ouderschapsverlof en aanvullend geboorteverlof, % van het dagloon
    maxDagloon: 302.75,               // maximumdagloon per dag
    dagvakken: 261,                   // dagen per jaar voor het dagloon (conventie UWV)
    werkdagenPerMaand: 21.75,         // conventie voor dagloon uit maandsalaris
    jeugdPct: { 21: 100, 20: 80, 19: 60, 18: 50, 17: 39.5, 16: 34.5, 15: 30 }, // minimumjeugdloon in % van het volwassen uurloon
    sociaalMinimum: { minimumloonMaand: 2320, pct: { samen: 100, alleenouder: 90, alleen: 70, jong: 45 } } // Toeslagenwet
  };

  const PEIL = NR.peildatum;
  const BOX1 = ['tarieven box 1', 'algemene heffingskorting', 'arbeidskorting'];
  const JANEE = [['ja', 'Ja'], ['nee', 'Nee']];
  const NIET_GEVERIFIEERD = 'Indicatief: deze hulp rekent met een norm die nog niet centraal is vastgesteld (peildatum ' + N.peildatum + '). Controleer de actuele norm.';

  // Volledige jaren, maanden en dagen van a tot b
  const ymd = (a, b) => {
    let j = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
    if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
    if (m < 0) { j--; m += 12; }
    return { j, m, d };
  };
  // Extra belasting door een bedrag bovenop het jaarloon; telt het extra bedrag als arbeidsinkomen (arbeidskorting)?
  const heffingOver = (jaarloon, extra, alsArbeid, opt = {}) =>
    F.netto(jaarloon + extra, Object.assign({}, opt, { arbeid: jaarloon + (alsArbeid ? extra : 0) })).heffing -
    F.netto(jaarloon, Object.assign({}, opt, { arbeid: jaarloon })).heffing;
  // Dienstjaren gewogen naar leeftijd: per heel dienstjaar de leeftijd aan het begin, het restant naar de leeftijd op de einddatum
  const gewogenJaren = (gb, inDienst, uit, gewicht) => {
    const jaren = (dagVerschil(inDienst, uit) + 1) / 365.25, heel = Math.floor(jaren);
    let a = 0;
    for (let t = 0; t < heel; t++) a += gewicht(ymd(gb, plusMaanden(inDienst, 12 * t)).j);
    const lftEind = ymd(gb, uit).j;
    return { jaren, gewogen: a + (jaren - heel) * gewicht(lftEind), lftEind };
  };

  RT.add({
    id: 'jaarinkomen', groep: 'inkomen-werk', naam: 'Jaarinkomen uit maandloon',
    intro: 'Van bruto maandloon naar bruto jaarinkomen met vakantiegeld, eindejaarsuitkering en vaste toeslagen, plus het uurloon.',
    velden: [
      { k: 'ml', l: 'Bruto maandloon', s: 'eur', std: 4100 },
      { k: 'tsl', l: 'Vaste toeslagen per maand', s: 'eur', std: 0, opt: true, tip: 'Bijvoorbeeld een vaste ploegentoeslag.' },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'ejr', l: 'Eindejaarsuitkering of 13e maand', s: 'pct', std: 0, opt: true, tip: 'Een volledige 13e maand is 8,33%.' },
      { k: 'u', l: 'Contracturen per week', s: 'num', na: 'uur', std: 38 }
    ],
    bereken(v) {
      const basis = v.ml * 12, tsl = v.tsl * 12;
      const vg = (basis + tsl) * v.vg / 100, ejr = basis * v.ejr / 100;
      const jaar = basis + tsl + vg + ejr;
      const uur = v.u > 0 ? v.ml / (v.u * 52 / 12) : NaN;
      return {
        lbl: 'Bruto jaarinkomen', groot: fmt.euro0(jaar), onder: 'gemiddeld ' + fmt.euro0(jaar / 12) + ' per maand',
        rijen: [
          ['Maandloon × 12', fmt.euro0(basis)],
          ['Vaste toeslagen × 12', fmt.euro0(tsl)],
          ['Vakantiegeld', fmt.euro0(vg)],
          ['Eindejaarsuitkering', fmt.euro0(ejr)],
          ['Bruto uurloon (zonder toeslagen)', fmt.euro(uur), 'som']
        ]
      };
    },
    uitleg: 'Jaarinkomen = 12 × (maandloon + toeslagen) × (1 + vakantiegeld) + 12 × maandloon × eindejaarspercentage. Uurloon = maandloon / (uren per week × 52 / 12).',
    letop: 'Of een toeslag of eindejaarsuitkering meetelt voor het toetsinkomen, bepaalt de geldverstrekker op basis van de werkgeversverklaring of het inkomensbepalingsdocument. Vakantiegeld kan over een andere grondslag worden berekend dan hier is aangenomen.'
  });

  /* ===================== Loon ===================== */

  RT.add({
    id: 'uurloon-naar-maandloon', groep: 'inkomen-werk', naam: 'Van uurloon naar maand- en jaarloon',
    intro: 'Reken een uurloon om naar maand- en jaarloon, of andersom, met vakantiegeld erbovenop.',
    kw: 'uurloon maandloon maandsalaris omrekenen jaarsalaris uren',
    velden: [
      { k: 'rt', l: 'Richting', s: 'keuze', opties: [['u2m', 'Uurloon naar maandloon'], ['m2u', 'Maandloon naar uurloon']], std: 'u2m', breed: true },
      { k: 'b', l: 'Bruto bedrag', s: 'bedrag', std: 22.5, tip: 'Uurloon of maandloon, afhankelijk van de richting.' },
      { k: 'u', l: 'Uren per week', s: 'num', na: 'uur', std: 36 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 }
    ],
    bereken(v) {
      if (!(v.u > 0)) return { fout: 'Vul een aantal uren per week groter dan nul in.' };
      const f = v.u * 52 / 12, uur = v.rt === 'u2m' ? v.b : v.b / f, mnd = v.rt === 'u2m' ? v.b * f : v.b;
      return {
        lbl: v.rt === 'u2m' ? 'Bruto maandloon' : 'Bruto uurloon', groot: fmt.euro(v.rt === 'u2m' ? mnd : uur),
        onder: fmt.getal(f, 2) + ' uur per maand',
        rijen: [
          ['Uurloon', fmt.euro(uur)],
          ['Maandloon', fmt.euro(mnd)],
          ['Jaarloon (12 maanden)', fmt.euro0(mnd * 12)],
          ['Vakantiegeld per jaar', fmt.euro0(mnd * 12 * v.vg / 100)],
          ['Jaarloon inclusief vakantiegeld', fmt.euro0(mnd * 12 * (1 + v.vg / 100)), 'som']
        ]
      };
    },
    uitleg: 'Uren per maand = uren per week × 52 / 12. Maandloon = uurloon × uren per maand; uurloon = maandloon / uren per maand. Vakantiegeld = jaarloon × percentage.',
    letop: 'Sommige cao’s rekenen met een vaste deler (bijvoorbeeld 4,33 weken of een vast aantal uren per maand). Toeslagen, overwerk en een eindejaarsuitkering zijn niet meegenomen.'
  });

  RT.add({
    id: 'vakantiegeld', groep: 'inkomen-werk', naam: 'Vakantiegeld bruto en netto',
    intro: 'Hoeveel vakantiegeld bouwt de werknemer op, en wat blijft er na belasting van over?',
    kw: 'vakantiegeld vakantietoeslag netto bijzondere beloning 8 procent',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 3800 },
      { k: 'p', l: 'Vakantiegeldpercentage', s: 'pct', std: 8 },
      { k: 'mnd', l: 'Maanden in de opbouwperiode', s: 'num', na: 'mnd', std: 12 }
    ],
    bereken(v) {
      const bruto = v.m * v.mnd * v.p / 100, bel = heffingOver(v.m * 12, bruto, true);
      return {
        lbl: 'Netto vakantiegeld', groot: fmt.euro(bruto - bel), onder: 'bruto ' + fmt.euro(bruto),
        rijen: [
          ['Opbouw per maand (bruto)', fmt.euro(v.m * v.p / 100)],
          ['Belasting over het vakantiegeld', fmt.euro(bel)],
          ['Effectief tarief', bruto > 0 ? fmt.pct(bel / bruto * 100) : '–'],
          ['Hoogste tarief bijzondere beloningen (ter vergelijking)', fmt.pct(NR.bijzondereBeloningMax), 'som']
        ]
      };
    },
    uitleg: 'Bruto vakantiegeld = maandloon × maanden × percentage. De belasting is het verschil in jaarbelasting (box 1 met arbeidskorting) met en zonder het vakantiegeld bovenop 12 × het maandloon. Daarin zit ook de afbouw van heffingskortingen.',
    letop: 'De werkgever houdt loonheffing in volgens de tabel bijzondere beloningen; dat bedrag kan afwijken van deze jaarberekening en wordt via de aangifte verrekend. Wettelijk is het vakantiegeld minimaal 8%, maar een cao kan een andere grondslag of een maximum kennen.'
  });

  RT.add({
    id: 'minimumloon', groep: 'inkomen-werk', naam: 'Minimumloon per uur, week en maand',
    intro: 'Het wettelijk minimumuurloon omgerekend naar week, maand en jaar, ook voor jongeren. Met desgewenst de tabel voor alle leeftijden.',
    kw: 'minimumloon minimumjeugdloon uurloon jongeren leeftijd wml',
    peildatum: N.peildatum, fiscaal: ['minimumuurloon', 'percentages minimumjeugdloon'],
    velden: [
      { k: 'l', l: 'Leeftijd', s: 'keuze', opties: [['21', '21 jaar en ouder'], ['20', '20 jaar'], ['19', '19 jaar'], ['18', '18 jaar'], ['17', '17 jaar'], ['16', '16 jaar'], ['15', '15 jaar']], std: '21' },
      { k: 'u', l: 'Uren per week', s: 'num', na: 'uur', std: 36 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'tab', l: 'Tabel voor alle leeftijden tonen?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const vol = NR.minimumloon.uur, p = N.jeugdPct[v.l], uur = vol * p / 100, week = uur * v.u, mnd = week * 52 / 12;
      const res = {
        lbl: 'Minimumuurloon', groot: fmt.euro(uur), onder: fmt.pct(p, 1) + ' van het volwassen minimumuurloon',
        rijen: [
          ['Per week', fmt.euro(week)],
          ['Per maand', fmt.euro(mnd)],
          ['Per jaar', fmt.euro0(mnd * 12)],
          ['Per jaar inclusief vakantiegeld', fmt.euro0(mnd * 12 * (1 + v.vg / 100)), 'som']
        ]
      };
      if (v.tab === 'ja') res.tabel = {
        titel: 'Minimumloon per leeftijd bij ' + fmt.getal(v.u, 1) + ' uur per week', kop: ['Leeftijd', '%', 'Per uur', 'Per week', 'Per maand'],
        rijen: Object.keys(N.jeugdPct).sort((a, b) => b - a).map(l => {
          const x = vol * N.jeugdPct[l] / 100;
          return [(l === '21' ? '21+' : l) + ' jaar', fmt.pct(N.jeugdPct[l], 1), fmt.euro(x), fmt.euro(x * v.u), fmt.euro(x * v.u * 52 / 12)];
        })
      };
      return res;
    },
    uitleg: 'Het minimumloon is een uurloon. Jeugdloon = volwassen uurloon × leeftijdspercentage. Weekloon = uurloon × uren; maandloon = weekloon × 52 / 12.',
    letop: 'Het minimumuurloon wordt per 1 januari en 1 juli aangepast. De percentages voor het minimumjeugdloon zijn nog niet centraal vastgesteld. ' + NIET_GEVERIFIEERD
  });

  RT.add({
    id: 'looncheck-cao', groep: 'inkomen-werk', naam: 'Looncheck tegen cao en minimumloon',
    intro: 'Is het uurloon hoog genoeg volgens de cao-loontabel en het wettelijk minimum? En hoeveel moet er zo nodig worden nabetaald?',
    kw: 'looncheck cao loonschaal onderbetaling nabetaling minimumloon',
    peildatum: PEIL, fiscaal: ['minimumuurloon'],
    velden: [
      { k: 'u', l: 'Feitelijk bruto uurloon', s: 'bedrag', std: 14.2 },
      { k: 'cao', l: 'Cao-uurloon bij deze functie en trede', s: 'bedrag', std: 15.35, tip: 'Overnemen uit de loontabel van de cao.' },
      { k: 'uw', l: 'Uren per week', s: 'num', na: 'uur', std: 32 },
      { k: 'mnd', l: 'Maanden onderbetaald', s: 'num', na: 'mnd', std: 12 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 }
    ],
    bereken(v) {
      const min = NR.minimumloon.uur, norm = Math.max(min, v.cao), tekort = Math.max(0, norm - v.u);
      const na = tekort * v.uw * 52 / 12 * v.mnd;
      return {
        lbl: 'Nabetaling bruto', groot: fmt.euro(na * (1 + v.vg / 100)), onder: 'inclusief vakantiegeld over ' + fmt.getal(v.mnd) + ' maanden',
        rijen: [
          ['Wettelijk minimumuurloon (21+)', fmt.euro(min)],
          ['Toets minimumloon', v.u >= min ? 'voldoet' : 'onder het minimumloon'],
          ['Toets cao', v.u + 0.005 >= v.cao ? 'voldoet' : 'onder het cao-loon'],
          ['Tekort per uur', fmt.euro(tekort)],
          ['Nabetaling zonder vakantiegeld', fmt.euro(na), 'som']
        ]
      };
    },
    uitleg: 'Norm = het hoogste van het cao-uurloon en het minimumuurloon. Nabetaling = tekort per uur × uren per week × 52 / 12 × maanden × (1 + vakantiegeld).',
    letop: 'Cao-loontabellen worden hier niet meegeleverd. Voor jongeren geldt een lager minimumjeugdloon. Bij te late betaling kunnen wettelijke verhoging en wettelijke rente verschuldigd zijn; dat is niet meegerekend.'
  });

  RT.add({
    id: 'gemiddeld-netto-per-maand', groep: 'inkomen-werk', naam: 'Gemiddeld netto per maand',
    intro: 'Alle netto ontvangsten van een jaar, inclusief vakantiegeld en dertiende maand, omgerekend naar een gemiddelde per maand.',
    kw: 'netto maandinkomen gemiddeld budget vakantiegeld dertiende maand',
    velden: [
      { k: 'n', l: 'Netto loon per maand', s: 'eur', std: 2450 },
      { k: 'vg', l: 'Netto vakantiegeld per jaar', s: 'eur', std: 1850, opt: true },
      { k: 'ej', l: 'Netto eindejaarsuitkering per jaar', s: 'eur', std: 0, opt: true },
      { k: 'ov', l: 'Overige netto ontvangsten per jaar', s: 'eur', std: 0, opt: true },
      { k: 'tsl', l: 'Toeslagen per maand', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const jaar = v.n * 12 + v.vg + v.ej + v.ov + v.tsl * 12;
      return {
        lbl: 'Gemiddeld netto per maand', groot: fmt.euro(jaar / 12), onder: 'netto ' + fmt.euro0(jaar) + ' per jaar',
        rijen: [
          ['Hoger dan het maandloon', fmt.euro(jaar / 12 - v.n)],
          ['Per week', fmt.euro(jaar / 52)],
          ['Per dag', fmt.euro(jaar / 365), 'som']
        ]
      };
    },
    uitleg: 'Netto jaarinkomen = 12 × (netto maandloon + toeslagen) + vakantiegeld + eindejaarsuitkering + overige ontvangsten. Gemiddeld per maand = jaarinkomen / 12.',
    letop: 'Toeslagen kunnen achteraf worden teruggevorderd. Voor een begroting is het verstandig vakantiegeld en eenmalige bedragen apart te reserveren voor de maand waarin ze nodig zijn.'
  });

  RT.add({
    id: 'vakantiedagen-uitbetalen', groep: 'inkomen-werk', naam: 'Vakantiedagen laten uitbetalen',
    intro: 'Wat leveren niet opgenomen vakantiedagen bruto en netto op, bijvoorbeeld bij het einde van het dienstverband?',
    kw: 'vakantiedagen uitbetalen verlofuren einde dienstverband netto',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 3800 },
      { k: 'd', l: 'Aantal dagen', s: 'num', na: 'dagen', std: 18 },
      { k: 'vg', l: 'Vakantiegeld over de uitbetaling', s: 'pct', std: 8 }
    ],
    bereken(v) {
      if (!(v.d > 0)) return { fout: 'Vul een aantal dagen groter dan nul in.' };
      const dag = v.m / N.werkdagenPerMaand, bruto = dag * v.d * (1 + v.vg / 100), bel = heffingOver(v.m * 12 * (1 + v.vg / 100), bruto, true);
      return {
        lbl: 'Netto uitbetaling', groot: fmt.euro(bruto - bel), onder: 'bruto ' + fmt.euro(bruto),
        rijen: [
          ['Bruto dagloon', fmt.euro(dag)],
          ['Belasting over de uitbetaling', fmt.euro(bel)],
          ['Effectief tarief', fmt.pct(bel / bruto * 100)],
          ['Netto per dag', fmt.euro((bruto - bel) / v.d), 'som']
        ]
      };
    },
    uitleg: 'Dagloon = maandloon / ' + fmt.getal(N.werkdagenPerMaand, 2) + ' werkdagen. Bruto = dagloon × dagen × (1 + vakantiegeld). Belasting = verschil in jaarbelasting met en zonder de uitbetaling bovenop het jaarloon inclusief vakantiegeld.',
    letop: 'Wettelijke vakantiedagen mogen tijdens het dienstverband niet worden uitbetaald; alleen bovenwettelijke dagen of het saldo bij uitdiensttreding. De werkgever houdt loonheffing in volgens de tabel bijzondere beloningen; het verschil wordt via de aangifte verrekend. De cao kan een andere dagloonberekening voorschrijven.'
  });

  RT.add({
    id: 'kilometervergoeding', groep: 'inkomen-werk', naam: 'Reiskosten per kilometer: vergoeding en kosten',
    intro: 'Hoeveel van de kilometervergoeding is onbelast, wat blijft er netto over, en dekt dat de werkelijke autokosten?',
    kw: 'kilometervergoeding reiskosten onbelast per km auto netto',
    peildatum: N.peildatum, fiscaal: ['onbelaste kilometervergoeding', 'tarieven box 1'],
    velden: [
      { k: 'modus', l: 'Berekening', s: 'keuze', opties: [['auto', 'Netto vergoeding en autokosten'], ['bn', 'Alleen bruto naar netto']], std: 'auto', breed: true },
      { k: 'km', l: 'Zakelijke kilometers per jaar', s: 'num', na: 'km', std: 15000 },
      { k: 'v', l: 'Vergoeding per kilometer', s: 'bedrag', std: 0.3 },
      { k: 'tar', l: 'Tarief over het belaste deel', s: 'pct', std: NR.box1.tarief2, tip: 'Het eigen schijftarief, inclusief afbouw van kortingen.' },
      { k: 'br', l: 'Brandstofprijs per liter', s: 'bedrag', std: 2.05, als: v => v.modus === 'auto' },
      { k: 'vb', l: 'Verbruik', s: 'num', na: 'km/l', std: 15, als: v => v.modus === 'auto' },
      { k: 'vast', l: 'Vaste autokosten per jaar (zakelijk deel)', s: 'eur', std: 3200, als: v => v.modus === 'auto', tip: 'Afschrijving, verzekering, belasting, onderhoud.' }
    ],
    bereken(v) {
      if (!(v.km > 0)) return { fout: 'Vul een aantal kilometers groter dan nul in.' };
      const tot = v.km * v.v, onbel = v.km * Math.min(v.v, N.kmOnbelast), belast = Math.max(0, tot - onbel);
      const netto = onbel + belast * (1 - v.tar / 100);
      const rijen = [
        ['Totale vergoeding', fmt.euro(tot)],
        ['Onbelast deel', fmt.euro(onbel)],
        ['Belast deel', fmt.euro(belast)],
        ['Netto per kilometer', fmt.euro(netto / v.km, 3)]
      ];
      if (v.modus === 'auto') {
        if (!(v.vb > 0)) return { fout: 'Vul een verbruik groter dan nul in.' };
        const brandstof = v.km / v.vb * v.br, kosten = brandstof + v.vast;
        rijen.push(['Brandstofkosten', fmt.euro(brandstof)], ['Totale autokosten', fmt.euro(kosten)], ['Kosten per kilometer', fmt.euro(kosten / v.km, 3)],
          ['Netto vergoeding min kosten', fmt.euro(netto - kosten), 'som']);
      } else rijen.push(['Netto per maand', fmt.euro(netto / 12), 'som']);
      return { lbl: 'Netto vergoeding per jaar', groot: fmt.euro(netto), onder: 'onbelast tot ' + fmt.euro(N.kmOnbelast) + ' per km', rijen };
    },
    uitleg: 'Onbelast = kilometers × het laagste van de vergoeding en het onbelaste maximum per km. Het meerdere is loon: netto = belast deel × (1 − tarief). Autokosten = kilometers / verbruik × brandstofprijs + vaste kosten.',
    letop: NIET_GEVERIFIEERD + ' Het tarief over het belaste deel is een benadering; de werkgever kan het meerdere ook in de werkkostenregeling onderbrengen. Bij een auto van de zaak geldt een andere regeling (bijtelling).'
  });

  /* ===================== Ontslag ===================== */

  RT.add({
    id: 'opzegtermijn', groep: 'inkomen-werk', naam: 'Dienstverband en wettelijke opzegtermijn',
    intro: 'Hoe lang loopt het dienstverband, welke wettelijke opzegtermijn geldt en wat wordt de laatste werkdag?',
    kw: 'opzegtermijn opzeggen ontslag dienstverband einde maand',
    velden: [
      { k: 'in', l: 'Datum in dienst', s: 'datum', std: '2014-09-01' },
      { k: 'op', l: 'Datum van opzegging', s: 'datum', std: '2026-10-02' },
      { k: 'cao', l: 'Afwijkende termijn werkgever (cao)', s: 'num', na: 'mnd', std: 0, opt: true, tip: '0 = wettelijke termijn.' }
    ],
    bereken(v) {
      if (!v.in || !v.op) return { fout: 'Vul beide data in.' };
      if (v.op < v.in) return { fout: 'De opzegdatum ligt vóór de datum in dienst.' };
      const duur = ymd(v.in, v.op);
      let wg = duur.j < 5 ? 1 : duur.j < 10 ? 2 : duur.j < 15 ? 3 : 4;
      if (v.cao > 0) wg = Math.round(v.cao);
      const eindWg = new Date(v.op.getFullYear(), v.op.getMonth() + 1 + wg, 0), eindWn = new Date(v.op.getFullYear(), v.op.getMonth() + 2, 0);
      return {
        lbl: 'Opzegtermijn werkgever', groot: wg + (wg === 1 ? ' maand' : ' maanden'), onder: 'dienstverband ' + duur.j + ' jaar en ' + duur.m + (duur.m === 1 ? ' maand' : ' maanden'),
        rijen: [
          ['Einde bij opzegging door werkgever', fmt.datum(eindWg)],
          ['Opzegtermijn werknemer', '1 maand'],
          ['Einde bij opzegging door werknemer', fmt.datum(eindWn), 'som']
        ]
      };
    },
    uitleg: 'Werkgever: korter dan 5 jaar in dienst 1 maand, 5 tot 10 jaar 2 maanden, 10 tot 15 jaar 3 maanden, 15 jaar of langer 4 maanden. Werknemer: 1 maand. Opzeggen gebeurt tegen het einde van de maand, dus het dienstverband eindigt op de laatste dag van de maand na afloop van de termijn.',
    letop: 'Een cao kan de termijn van de werkgever verkorten; in een arbeidsovereenkomst mag de termijn van de werknemer alleen worden verlengd als die van de werkgever minstens het dubbele is. Bij ontslag met toestemming van het UWV mag de proceduretijd worden afgetrokken (minimaal één maand blijft over).'
  });

  RT.add({
    id: 'transitievergoeding', groep: 'inkomen-werk', naam: 'Transitievergoeding bij ontslag',
    intro: 'De wettelijke vergoeding bij ontslag op initiatief van de werkgever: een derde maandsalaris per dienstjaar, met een maximum.',
    kw: 'transitievergoeding ontslag vergoeding dienstjaren maximum',
    peildatum: N.peildatum, fiscaal: ['maximum transitievergoeding'].concat(BOX1),
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 3800 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'ej', l: 'Vaste eindejaarsuitkering', s: 'pct', std: 0, opt: true },
      { k: 'tsl', l: 'Vaste toeslagen per maand', s: 'eur', std: 0, opt: true },
      { k: 'in', l: 'Datum in dienst', s: 'datum', std: '2016-03-01' },
      { k: 'uit', l: 'Einddatum dienstverband', s: 'datum', std: '2026-12-31' }
    ],
    bereken(v) {
      if (!v.in || !v.uit) return { fout: 'Vul beide data in.' };
      const dagen = dagVerschil(v.in, v.uit) + 1;
      if (dagen <= 0) return { fout: 'De einddatum ligt vóór de datum in dienst.' };
      const maand = v.m * (1 + v.vg / 100 + v.ej / 100) + v.tsl, jaren = dagen / 365.25;
      const berekend = jaren * maand / 3, max = Math.max(N.transitieMax, maand * 12), uit = Math.min(berekend, max);
      const bel = heffingOver(maand * 12, uit, false);
      return {
        lbl: 'Transitievergoeding bruto', groot: fmt.euro0(uit), onder: berekend > max ? 'begrensd op het maximum' : fmt.getal(jaren, 2) + ' dienstjaren',
        rijen: [
          ['Maandsalaris inclusief vaste onderdelen', fmt.euro(maand)],
          ['Per dienstjaar', fmt.euro(maand / 3)],
          ['Berekende vergoeding', fmt.euro0(berekend)],
          ['Maximum', fmt.euro0(max)],
          ['Netto indicatie', fmt.euro0(uit - bel), 'som']
        ]
      };
    },
    uitleg: 'Vergoeding = dienstjaren × maandsalaris / 3, met de dienstjaren op dagbasis (dagen / 365,25). Maandsalaris = maandloon × (1 + vakantiegeld + eindejaarsuitkering) + vaste toeslagen. Maximum = het wettelijke maximum of, als dat hoger is, één jaarsalaris. Netto: verschil in jaarbelasting met en zonder de vergoeding.',
    letop: NIET_GEVERIFIEERD + ' Het maximum wordt jaarlijks per 1 januari aangepast. De wet rekent het restant naar rato per maand en dag; de uitkomst kan daardoor iets afwijken. Kosten voor scholing of outplacement kunnen onder voorwaarden in mindering komen. Geen juridisch advies.'
  });

  RT.add({
    id: 'ontslagvergoeding-netto', groep: 'inkomen-werk', naam: 'Netto ontslagvergoeding',
    intro: 'Wat blijft er netto over van een ontslag- of transitievergoeding bovenop het jaarloon?',
    kw: 'ontslagvergoeding netto bijzondere beloning belasting transitievergoeding',
    peildatum: PEIL, fiscaal: BOX1,
    velden: [
      { k: 'v', l: 'Bruto vergoeding', s: 'eur', std: 45000 },
      { k: 'b', l: 'Bruto jaarloon in hetzelfde jaar', s: 'eur', std: 52000 },
      { k: 'aowj', l: 'AOW-leeftijd bereikt?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      if (!(v.v > 0)) return { fout: 'Vul een vergoeding groter dan nul in.' };
      const bel = heffingOver(v.b, v.v, false, { aow: v.aowj === 'ja' });
      return {
        lbl: 'Netto vergoeding', groot: fmt.euro0(v.v - bel), onder: fmt.pct((v.v - bel) / v.v * 100, 1) + ' van het brutobedrag',
        rijen: [
          ['Belasting over de vergoeding', fmt.euro0(bel)],
          ['Effectief tarief', fmt.pct(bel / v.v * 100)],
          ['Jaarinkomen inclusief vergoeding', fmt.euro0(v.b + v.v), 'som']
        ]
      };
    },
    uitleg: 'Belasting = box 1-belasting over (jaarloon + vergoeding) − box 1-belasting over het jaarloon. De vergoeding telt niet als arbeidsinkomen voor de arbeidskorting; de afbouw van kortingen zit in de uitkomst.',
    letop: 'De werkgever houdt loonheffing in volgens de tabel bijzondere beloningen; het definitieve bedrag volgt uit de aangifte. Uitbetaling verspreiden over twee kalenderjaren of storten in een lijfrente (binnen de voorwaarden) kan de heffing verlagen; toets dat apart.'
  });

  RT.add({
    id: 'ontslagvergoeding-besteden', groep: 'inkomen-werk', naam: 'Ontslagvergoeding: uitbetalen, lijfrente of bv',
    intro: 'Drie routes naast elkaar: direct afrekenen en beleggen in box 3, storten in een lijfrente, of (alleen bij een bestaande stamrecht-bv) in de bv laten.',
    kw: 'stamrecht ontslagvergoeding lijfrente box 3 bv vergelijken',
    peildatum: PEIL, fiscaal: BOX1.concat(['vpb-tarief', 'box 2-tarief', 'forfait en tarief box 3']),
    velden: [
      { k: 'v', l: 'Bruto vergoeding', s: 'eur', std: 120000 },
      { k: 'b', l: 'Bruto jaarloon in het jaar van uitbetaling', s: 'eur', std: 62000 },
      { k: 'n', l: 'Jaren tot de uitkering', s: 'num', na: 'jaar', std: 12 },
      { k: 'r', l: 'Rendement per jaar', s: 'pct', std: 4 },
      { k: 'tu', l: 'Tarief bij uitkering van de lijfrente', s: 'pct', std: NR.box1.tarief1Aow }
    ],
    bereken(v) {
      const bel = heffingOver(v.b, v.v, false), nettoNu = v.v - bel;
      const r3 = v.r - NR.box3.forfaitOverig * NR.box3.tarief / 100;
      const box3 = nettoNu * Math.pow(1 + r3 / 100, v.n);
      const lijf = v.v * Math.pow(1 + v.r / 100, v.n) * (1 - v.tu / 100);
      const bv = v.v * Math.pow(1 + v.r * (1 - NR.vpb.tarief1 / 100) / 100, v.n) * (1 - NR.box2.tarief1 / 100);
      const opties = [['afrekenen en box 3', box3], ['lijfrente', lijf], ['bestaande stamrecht-bv', bv]];
      const beste = opties.reduce((a, b) => b[1] > a[1] ? b : a);
      return {
        lbl: 'Hoogste netto eindbedrag', groot: beste[0], onder: fmt.euro0(beste[1]) + ' na ' + fmt.getal(v.n) + ' jaar',
        rijen: [
          ['Belasting bij direct afrekenen', fmt.euro0(bel)],
          ['Netto nu', fmt.euro0(nettoNu)],
          ['Route 1: afrekenen en beleggen in box 3', fmt.euro0(box3)],
          ['Route 2: lijfrente, belast bij uitkering', fmt.euro0(lijf)],
          ['Route 3: bestaande stamrecht-bv (vpb, dan box 2)', fmt.euro0(bv)],
          ['Verschil beste en slechtste route', fmt.euro0(beste[1] - Math.min(box3, lijf, bv)), 'som']
        ],
        signalen: ['Route 3 staat niet open voor nieuwe ontslagvergoedingen: de stamrechtvrijstelling is in 2014 vervallen. Toon die alleen voor wie al een stamrecht-bv heeft.']
      };
    },
    uitleg: 'Box 3: netto vergoeding × (1 + rendement − forfait × box 3-tarief)<sup>n</sup>. Lijfrente: bruto vergoeding × (1 + rendement)<sup>n</sup> × (1 − tarief bij uitkering). Bv: bruto × (1 + rendement × (1 − vpb))<sup>n</sup> × (1 − box 2-tarief). Alle uitkomsten als één bedrag aan het eind.',
    letop: 'Sterk vereenvoudigd: geen heffingsvrij vermogen in box 3, uitkeringen niet gespreid en geen kosten. Een lijfrentestorting is alleen aftrekbaar binnen de jaar- en reserveringsruimte (of de bijzondere regels bij ontslag); controleer de voorwaarden. De box 3-regels veranderen. Dit is fiscaal én pensioenadvies: toets passendheid en leg het advies vast.'
  });

  RT.add({
    id: 'kantonrechtersformule', groep: 'inkomen-werk', naam: 'Ontslagvergoeding (oude kantonrechtersformule)',
    intro: 'A × B × C: naar leeftijd gewogen dienstjaren × maandsalaris × correctiefactor. Vervangen door de transitievergoeding, maar soms nog een onderhandelingsmaatstaf.',
    kw: 'kantonrechtersformule abc ontslagvergoeding gewogen dienstjaren historisch',
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 4200 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'tsl', l: 'Vaste toeslagen per maand', s: 'eur', std: 0, opt: true },
      { k: 'gb', l: 'Geboortedatum', s: 'datum', std: '1975-04-12' },
      { k: 'in', l: 'Datum in dienst', s: 'datum', std: '2005-09-01' },
      { k: 'uit', l: 'Einddatum', s: 'datum', std: '2026-12-31' },
      { k: 'c', l: 'Correctiefactor C', s: 'num', std: 1, tip: '1 = neutraal.' }
    ],
    bereken(v) {
      if (!v.gb || !v.in || !v.uit) return { fout: 'Vul alle data in.' };
      if (v.uit < v.in) return { fout: 'De einddatum ligt vóór de datum in dienst.' };
      const B = v.m * (1 + v.vg / 100) + v.tsl;
      const g = gewogenJaren(v.gb, v.in, v.uit, l => l < 35 ? 0.5 : l < 45 ? 1 : l < 55 ? 1.5 : 2);
      const verg = g.gewogen * B * v.c;
      return {
        lbl: 'Vergoeding A × B × C', groot: fmt.euro0(verg), onder: fmt.getal(verg / v.m, 2) + ' bruto maandlonen',
        rijen: [
          ['A: gewogen dienstjaren', fmt.getal(g.gewogen, 2)],
          ['Dienstjaren', fmt.getal(g.jaren, 2)],
          ['B: maandsalaris met vaste onderdelen', fmt.euro(B)],
          ['C: correctiefactor', fmt.getal(v.c, 2)],
          ['Leeftijd op de einddatum', g.lftEind + ' jaar', 'som']
        ],
        signalen: ['Historische formule: sinds 1 juli 2015 geldt de wettelijke transitievergoeding.']
      };
    },
    uitleg: 'A = dienstjaren gewogen naar leeftijd: jonger dan 35 × 0,5; 35 tot 45 × 1; 45 tot 55 × 1,5; 55 en ouder × 2. Elk heel dienstjaar telt met de leeftijd aan het begin van dat jaar, het restant met de leeftijd op de einddatum. B = maandloon × (1 + vakantiegeld) + vaste toeslagen.',
    letop: 'Regeling niet meer van toepassing: de kantonrechtersformule is per 1 juli 2015 vervangen door de transitievergoeding. Gebruik de uitkomst alleen als onderhandelingsmaatstaf of voor oude zaken. Geen juridisch advies.'
  });

  RT.add({
    id: 'ontslagvergoeding-overheid', groep: 'inkomen-werk', naam: 'Ontslagvergoeding overheid (historisch)',
    intro: 'De vroegere ambtenarenformule: maandsalaris × naar leeftijd gewogen dienstjaren × correctiefactor. Alleen voor ontslagen van vóór de normalisering van de rechtspositie.',
    kw: 'ambtenaar ontslagvergoeding crvb overheid wnra historisch',
    velden: [
      { k: 'm', l: 'Bruto maandsalaris inclusief toelagen', s: 'eur', std: 4200 },
      { k: 'gb', l: 'Geboortedatum', s: 'datum', std: '1965-04-12' },
      { k: 'in', l: 'Datum in dienst', s: 'datum', std: '1998-09-01' },
      { k: 'uit', l: 'Ontslagdatum', s: 'datum', std: '2019-12-31' },
      { k: 'aandeel', l: 'Aandeel van de werkgever in het ontslag', s: 'pct', std: 65, tip: '50% = gelijk aandeel (factor 1).' }
    ],
    bereken(v) {
      if (!v.gb || !v.in || !v.uit) return { fout: 'Vul alle data in.' };
      if (v.uit < v.in) return { fout: 'De ontslagdatum ligt vóór de datum in dienst.' };
      const g = gewogenJaren(v.gb, v.in, v.uit, l => l < 40 ? 0.5 : l < 50 ? 1 : 1.5);
      const a = Math.min(99, Math.max(1, v.aandeel)) / 100, factor = a / (1 - a), verg = v.m * g.gewogen * factor;
      return {
        lbl: 'Vergoeding', groot: fmt.euro0(verg), onder: fmt.getal(verg / v.m, 2) + ' maandsalarissen',
        rijen: [
          ['Dienstjaren', fmt.getal(g.jaren, 2)],
          ['Gewogen dienstjaren', fmt.getal(g.gewogen, 2)],
          ['Correctiefactor (aandeel / (1 − aandeel))', fmt.getal(factor, 3)],
          ['Leeftijd bij ontslag', g.lftEind + ' jaar', 'som']
        ],
        signalen: v.uit >= new Date(2020, 0, 1) ? ['Voor een ontslag vanaf 1 januari 2020 geldt voor de meeste ambtenaren het gewone arbeidsrecht met de transitievergoeding.'] : []
      };
    },
    uitleg: 'Gewogen dienstjaren: jonger dan 40 × 0,5; 40 tot 50 × 1; 50 en ouder × 1,5 (heel jaar naar de leeftijd aan het begin, restant naar de leeftijd bij ontslag). Vergoeding = maandsalaris × gewogen dienstjaren × aandeel / (1 − aandeel).',
    letop: 'Regeling niet meer van toepassing: sinds de Wet normalisering rechtspositie ambtenaren (1 januari 2020) vallen de meeste ambtenaren onder het gewone arbeidsrecht met de transitievergoeding. Deze formule is een benadering van de oude rechtspraak en alleen bedoeld voor terugrekenen. Geen juridisch advies.'
  });

  /* ===================== Uitkeringen en sociale zekerheid ===================== */

  RT.add({
    id: 'sv-loon', groep: 'inkomen-werk', naam: 'Sv-loon',
    intro: 'Het loon voor de werknemersverzekeringen: fiscaal loon plus bijtelling, minus de eigen pensioenpremie, tot het maximumpremieloon.',
    kw: 'sv-loon premieloon werknemersverzekeringen ww wia dagloon',
    peildatum: PEIL, fiscaal: ['maximumpremieloon', 'premies Awf, Aof en Whk'],
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 3800 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'ej', l: 'Eindejaarsuitkering', s: 'pct', std: 0, opt: true },
      { k: 'bij', l: 'Bijtelling auto per jaar', s: 'eur', std: 0, opt: true },
      { k: 'pens', l: 'Pensioenpremie werknemer', s: 'pct', std: 5.5, opt: true, tip: 'Percentage van het brutoloon.' }
    ],
    bereken(v) {
      const W = NR.werkgever, loon = v.m * 12 * (1 + v.vg / 100 + v.ej / 100), premie = loon * v.pens / 100;
      const ongemax = loon - premie + v.bij, sv = Math.min(W.maxPremieloon, ongemax);
      return {
        lbl: 'Sv-loon per jaar', groot: fmt.euro0(sv), onder: ongemax > W.maxPremieloon ? 'begrensd op het maximumpremieloon' : fmt.euro0(sv / 12) + ' per maand',
        rijen: [
          ['Bruto jaarloon', fmt.euro0(loon)],
          ['Pensioenpremie werknemer', fmt.euro0(premie)],
          ['Bijtelling', fmt.euro0(v.bij)],
          ['Maximumpremieloon', fmt.euro0(W.maxPremieloon)],
          ['Werkgeverspremies Awf, Aof en Whk', fmt.euro0(sv * (W.awf + W.aof + W.whk) / 100), 'som']
        ]
      };
    },
    uitleg: 'Sv-loon = jaarloon (inclusief vakantiegeld en eindejaarsuitkering) − pensioenpremie werknemer + bijtelling, niet hoger dan het maximumpremieloon. De werkgeverspremies zijn het sv-loon × (Awf + Aof + Whk); Awf en Whk verschillen per werkgever en contractvorm.',
    letop: 'Er zijn uitzonderingen op het gelijk lopen van fiscaal loon en sv-loon (bijvoorbeeld bepaalde vergoedingen en uitkeringen). De loonstrook en de loonaangifte zijn leidend. De Awf-premie is hoger bij flexibele contracten.'
  });

  RT.add({
    id: 'dagloon-uwv', groep: 'inkomen-werk', naam: 'Dagloon voor een UWV-uitkering',
    intro: 'Het dagloon waarop WW of WIA wordt berekend: sv-loon in de referteperiode gedeeld door het aantal dagen, tot het maximum.',
    kw: 'dagloon uwv ww wia maximumdagloon referteperiode',
    peildatum: N.peildatum, fiscaal: ['maximumdagloon'],
    velden: [
      { k: 'sv', l: 'Sv-loon in de referteperiode (12 maanden)', s: 'eur', std: 52000 },
      { k: 'pct', l: 'Uitkeringspercentage', s: 'keuze', opties: [['75', '75% (eerste twee maanden WW)'], ['70', '70%']], std: '75' }
    ],
    bereken(v) {
      const onge = v.sv / N.dagvakken, dag = Math.min(N.maxDagloon, onge), p = +v.pct;
      return {
        lbl: 'Dagloon', groot: fmt.euro(dag), onder: onge > N.maxDagloon ? 'begrensd op het maximumdagloon' : 'per uitkeringsdag',
        rijen: [
          ['Dagloon zonder maximum', fmt.euro(onge)],
          ['Maximumdagloon', fmt.euro(N.maxDagloon)],
          ['Uitkering per dag (' + p + '%)', fmt.euro(dag * p / 100)],
          ['Uitkering per maand (' + fmt.getal(N.werkdagenPerMaand, 2) + ' dagen)', fmt.euro(dag * p / 100 * N.werkdagenPerMaand), 'som']
        ]
      };
    },
    uitleg: 'Dagloon = sv-loon in de referteperiode / ' + N.dagvakken + ' dagen, niet hoger dan het maximumdagloon. Uitkering per maand = dagloon × percentage × ' + fmt.getal(N.werkdagenPerMaand, 2) + ' dagen.',
    letop: NIET_GEVERIFIEERD + ' Het UWV kijkt naar het sv-loon in een vaste referteperiode en rekent met de werkelijke dagen; bij wisselend inkomen of een korte arbeidsverleden kan de uitkomst afwijken. Het maximumdagloon wordt per 1 januari en 1 juli aangepast.'
  });

  RT.add({
    id: 'bijstandsnorm', groep: 'inkomen-werk', naam: 'Bijstand per leefsituatie',
    intro: 'Welke bijstandsnorm geldt, ook met de kostendelersnorm bij medebewoners, en hoeveel blijft er na eigen inkomsten over?',
    kw: 'bijstand bijstandsnorm kostendelersnorm participatiewet uitkering',
    peildatum: PEIL, fiscaal: ['bijstandsnormen'],
    velden: [
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: [['alleen', 'Alleenstaand (ook alleenstaande ouder)'], ['samen', 'Gehuwd of samenwonend']], std: 'alleen', breed: true },
      { k: 'kd', l: 'Aantal kostendelers in de woning', s: 'num', std: 1, tip: 'Inclusief de aanvrager (en partner); 1 = geen medebewoners.' },
      { k: 'ink', l: 'Eigen netto inkomsten per maand', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const B = NR.bijstand, gehuwd = B.samenPpJaar * 2, samen = v.ls === 'samen';
      const A = Math.max(samen ? 2 : 1, Math.round(v.kd));
      const pp = (40 + 30 * A) / (100 * A) * gehuwd;
      let norm, uitleg;
      if (A === 1) { norm = B.alleenstaandJaar; uitleg = 'niet van toepassing'; }
      else if (samen && A === 2) { norm = gehuwd; uitleg = 'niet van toepassing'; }
      else { norm = samen ? 2 * pp : pp; uitleg = '(40% + ' + A + ' × 30%) / ' + A + ' van de gehuwdennorm'; }
      const uitk = Math.max(0, norm / 12 - v.ink);
      return {
        lbl: 'Bijstand per maand', groot: fmt.euro(uitk), onder: samen ? 'voor het paar samen' : 'voor de aanvrager',
        rijen: [
          ['Norm per jaar', fmt.euro0(norm)],
          ['Norm per maand', fmt.euro(norm / 12)],
          ['Kostendelersnorm', uitleg],
          ['Eigen inkomsten per maand', fmt.euro(v.ink), 'som']
        ]
      };
    },
    uitleg: 'Norm uit de centrale normen: alleenstaand of gehuwd. Bij meer kostendelers (A) geldt per persoon (40 + 30 × A) / (100 × A) × de gehuwdennorm. Bijstand = norm per maand − eigen inkomsten, niet lager dan nul.',
    letop: 'De bijstandsnormen worden per 1 januari en 1 juli aangepast. Studenten, kinderen jonger dan 27 met bepaalde inkomens en commerciële huurders tellen niet altijd als kostendeler. Vermogen boven de vermogensgrens en gemeentelijke regelingen (bijzondere bijstand, individuele inkomenstoeslag) zijn niet meegenomen; de gemeente beslist.'
  });

  RT.add({
    id: 'sociaal-minimum', groep: 'inkomen-werk', naam: 'Sociaal minimum per leefsituatie',
    intro: 'Het sociaal minimum volgens de Toeslagenwet als percentage van het minimumloon, bruto en indicatief netto.',
    kw: 'sociaal minimum toeslagenwet minimumloon leefsituatie',
    peildatum: N.peildatum, fiscaal: ['minimumloon per maand', 'percentages sociaal minimum'].concat(BOX1),
    velden: [
      { k: 'ls', l: 'Leefsituatie', s: 'keuze', opties: [['samen', 'Gehuwd of samenwonend'], ['alleenouder', 'Alleenstaande ouder'], ['alleen', 'Alleenstaand, 21 jaar of ouder'], ['jong', 'Alleenstaand, 18 tot 21 jaar']], std: 'samen', breed: true }
    ],
    bereken(v) {
      const S = N.sociaalMinimum, p = S.pct[v.ls], bruto = S.minimumloonMaand * p / 100;
      const r = F.netto(bruto * 12 * 1.08, { arbeid: 0 });
      return {
        lbl: 'Bruto sociaal minimum per maand', groot: fmt.euro(bruto), onder: fmt.pct(p, 0) + ' van het minimumloon',
        rijen: [
          ['Inclusief 8% vakantietoeslag', fmt.euro(bruto * 1.08)],
          ['Bruto per jaar inclusief vakantietoeslag', fmt.euro0(bruto * 12 * 1.08)],
          ['Netto per maand (indicatie)', fmt.euro(r.netto / 12), 'som']
        ]
      };
    },
    uitleg: 'Sociaal minimum = minimumloon per maand × percentage voor de leefsituatie. Netto: box 1 over het jaarbedrag met vakantietoeslag, met algemene heffingskorting en zonder arbeidskorting.',
    letop: NIET_GEVERIFIEERD + ' Het UWV stelt de normbedragen halfjaarlijks vast als netto en bruto bedragen; gebruik voor een aanvraag die bedragen. Het minimumloon per maand hangt sinds de invoering van het minimumuurloon af van het aantal uren.'
  });

  RT.add({
    id: 'toeslagenwet', groep: 'inkomen-werk', naam: 'Aanvulling Toeslagenwet',
    intro: 'Een uitkering onder het sociaal minimum kan worden aangevuld, maar nooit tot meer dan het dagloon waarop de uitkering is gebaseerd.',
    kw: 'toeslagenwet tw toeslag uwv aanvulling sociaal minimum',
    peildatum: N.peildatum, fiscaal: ['sociaal minimum'],
    velden: [
      { k: 'u', l: 'Bruto uitkering per maand', s: 'eur', std: 1450 },
      { k: 'min', l: 'Sociaal minimum per maand (bruto)', s: 'eur', std: N.sociaalMinimum.minimumloonMaand, tip: 'Zie de hulp ‘Sociaal minimum per leefsituatie’.' },
      { k: 'dag', l: 'Dagloon omgerekend naar een maand', s: 'eur', std: 2600 },
      { k: 'ip', l: 'Inkomen van de partner per maand', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const plafond = Math.min(v.min, v.dag), t = Math.max(0, plafond - v.u - v.ip);
      return {
        lbl: 'Toeslag per maand', groot: fmt.euro(t), onder: t > 0 ? 'recht op aanvulling' : 'geen aanvulling',
        rijen: [
          ['Plafond (laagste van sociaal minimum en dagloon)', fmt.euro(plafond)],
          ['Totaal inkomen per maand', fmt.euro(v.u + v.ip + t)],
          ['Toeslag per jaar', fmt.euro0(t * 12), 'som']
        ]
      };
    },
    uitleg: 'Toeslag = laagste van (sociaal minimum, dagloon per maand) − uitkering − inkomen partner, niet lager dan nul.',
    letop: NIET_GEVERIFIEERD + ' Het UWV kent vrijlatingen voor bepaalde inkomsten van de partner en rekent per dag; de uitkomst is een indicatie. Een toeslag moet apart worden aangevraagd.'
  });

  /* ===================== Verlof ===================== */

  const verlof = (maandloon, vg, weken, deel, aanvPct) => {
    const J = maandloon * 12 * (1 + vg / 100), maxJaar = N.maxDagloon * N.dagvakken;
    const gemist = J / 52 * weken * deel, uitk = Math.min(J, maxJaar) / 52 * weken * deel * N.verlofUitkeringPct / 100;
    const aanv = gemist * aanvPct / 100, brutoVerlies = Math.max(0, gemist - uitk - aanv);
    const nu = F.netto(J, { arbeid: J }), met = F.netto(J - brutoVerlies, { arbeid: J - gemist + aanv });
    return { gemist, uitk, aanv, brutoVerlies, nettoVerlies: nu.netto - met.netto, begrensd: J > maxJaar };
  };

  RT.add({
    id: 'ouderschapsverlof', groep: 'inkomen-werk', naam: 'Inkomen tijdens betaald ouderschapsverlof',
    intro: 'Tijdens de betaalde weken ouderschapsverlof betaalt het UWV een deel van het dagloon. Hoeveel inkomen levert de klant netto in?',
    kw: 'ouderschapsverlof betaald uwv dagloon inkomensverlies kind',
    peildatum: N.peildatum, fiscaal: ['uitkeringspercentage verlof', 'maximumdagloon'].concat(BOX1),
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 3600 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'uw', l: 'Contracturen per week', s: 'num', na: 'uur', std: 36 },
      { k: 'vu', l: 'Verlofuren per week', s: 'num', na: 'uur', std: 9 },
      { k: 'wk', l: 'Aantal weken met verlof', s: 'num', na: 'wk', std: 36, tip: 'Het betaalde deel is in totaal 9 × de wekelijkse arbeidsduur.' }
    ],
    bereken(v) {
      if (!(v.uw > 0) || !(v.wk > 0) || !(v.vu > 0)) return { fout: 'Vul uren en weken groter dan nul in.' };
      const deel = Math.min(1, v.vu / v.uw), r = verlof(v.m, v.vg, v.wk, deel, 0);
      return {
        lbl: 'Netto inkomensverlies', groot: fmt.euro0(r.nettoVerlies), onder: 'over ' + fmt.getal(v.wk) + ' weken, ' + fmt.euro(r.nettoVerlies / (v.wk * v.vu)) + ' per verlofuur',
        rijen: [
          ['Verlofdeel van de werkweek', fmt.pct(deel * 100, 1)],
          ['Gemist brutoloon', fmt.euro0(r.gemist)],
          ['UWV-uitkering', fmt.euro0(r.uitk)],
          ['Bruto inkomensverlies', fmt.euro0(r.brutoVerlies)],
          ['Netto verlies per verlofweek', fmt.euro(r.nettoVerlies / v.wk), 'som']
        ],
        signalen: v.vu * v.wk > 9 * v.uw ? ['Meer verlofuren dan het betaalde deel (9 × de wekelijkse arbeidsduur): het meerdere is onbetaald en hier te gunstig berekend.'] : []
      };
    },
    uitleg: 'Gemist loon = jaarloon / 52 × weken × verlofdeel. UWV-uitkering = ' + N.verlofUitkeringPct + '% van het (gemaximeerde) jaarloon / 52 × weken × verlofdeel; het maximum is het maximumdagloon × ' + N.dagvakken + '. Netto verlies = verschil in netto jaarinkomen met en zonder verlof.',
    letop: NIET_GEVERIFIEERD + ' Het betaalde deel moet binnen het eerste levensjaar van het kind worden opgenomen. Een aanvulling door de werkgever (cao), gevolgen voor pensioenopbouw en toeslagen zijn niet meegenomen.'
  });

  RT.add({
    id: 'geboorteverlof-partner', groep: 'inkomen-werk', naam: 'Inkomen tijdens aanvullend geboorteverlof',
    intro: 'Tijdens het aanvullend geboorteverlof voor de partner betaalt het UWV een deel van het dagloon. Wat kost het verlof netto?',
    kw: 'geboorteverlof partnerverlof aanvullend uwv inkomensverlies',
    peildatum: N.peildatum, fiscaal: ['uitkeringspercentage verlof', 'maximumdagloon'].concat(BOX1),
    velden: [
      { k: 'm', l: 'Bruto maandloon', s: 'eur', std: 3600 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'wk', l: 'Aantal weken volledig verlof', s: 'num', na: 'wk', std: 5 },
      { k: 'aanv', l: 'Aanvulling door de werkgever', s: 'pct', std: 0, opt: true, tip: 'Percentage van het loon dat de werkgever bijbetaalt.' }
    ],
    bereken(v) {
      if (!(v.wk > 0)) return { fout: 'Vul een aantal weken groter dan nul in.' };
      const r = verlof(v.m, v.vg, v.wk, 1, v.aanv);
      return {
        lbl: 'Netto inkomensverlies', groot: fmt.euro0(r.nettoVerlies), onder: fmt.euro(r.nettoVerlies / v.wk) + ' per verlofweek',
        rijen: [
          ['Gemist brutoloon', fmt.euro0(r.gemist)],
          ['UWV-uitkering', fmt.euro0(r.uitk)],
          ['Aanvulling werkgever', fmt.euro0(r.aanv)],
          ['Bruto inkomensverlies', fmt.euro0(r.brutoVerlies), 'som']
        ],
        signalen: v.wk > 5 ? ['Het aanvullend geboorteverlof is maximaal vijf keer de wekelijkse arbeidsduur.'] : []
      };
    },
    uitleg: 'Gemist loon = jaarloon / 52 × weken. UWV-uitkering = ' + N.verlofUitkeringPct + '% van het (gemaximeerde) jaarloon / 52 × weken. Netto verlies = verschil in netto jaarinkomen met en zonder verlof.',
    letop: NIET_GEVERIFIEERD + ' Het verlof moet binnen zes maanden na de geboorte worden opgenomen, na het (doorbetaalde) geboorteverlof van één week. Gevolgen voor pensioenopbouw en toeslagen zijn niet meegenomen.'
  });
})(window.RT);
