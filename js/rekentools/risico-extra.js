/* Rekenhulpen – aanvulling risico, inkomen en pensioen (2026-10-03).
 * Hulpen voor arbeidsongeschiktheid (WIA/WGA), werkloosheid (WW), overlijden (nabestaanden), langdurige zorg (Wlz),
 * AOV of broodfonds, pensioengat met AOW en netto besteedbaar inkomen van een huishouden.
 * De hulpen registreren zich in de bestaande groepen (verzekeringen, inkomen-werk, pensioen-aow, huishouden-overig).
 * API en helpers: zie js/rekentools/engine.js. Normen: js/rekentools/normen.js (RT.normen.wia, .ww, .anw, .wlz, .aow).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { JANEE } = RT.keuzes;
  const { maandUitJaar } = RT.fin;
  const NR = RT.normen, F = RT.fisc;
  const pos = x => Math.max(0, x);
  const PEIL = NR.peildatum;
  const INDICATIEF = '<b>Indicatief.</b> Deze berekening is een benadering en geen besluit van UWV, SVB, CAK of Belastingdienst, en geen advies.';

  // Maanden als tekst, ook met een halve maand (WW-duur)
  const maanden = m => fmt.getal(m, m % 1 ? 1 : 0) + (m === 1 ? ' maand' : ' maanden');

  /* Duur WW en loongerelateerde WGA-uitkering uit het arbeidsverleden:
   * eerste 10 jaar 1 maand per jaar; daarna jaren t/m 2015 1 maand en jaren vanaf 2016 een halve maand; min 3, max 24 maanden. */
  const duurArbeidsverleden = (jrOud, jrNieuw) => {
    const W = NR.ww, oud = pos(Math.floor(jrOud || 0)), nieuw = pos(Math.floor(jrNieuw || 0));
    const eerste = Math.min(W.eersteJaren, oud + nieuw);
    const restOud = pos(oud - W.eersteJaren), restNieuw = pos(nieuw - pos(W.eersteJaren - oud));
    const m = eerste * W.perJaarOud + restOud * W.perJaarOud + restNieuw * W.perJaarNieuw;
    return Math.min(W.maxMaanden, Math.max(W.minMaanden, m));
  };
  RT.duurArbeidsverleden = duurArbeidsverleden;

  const maxMaandloon = () => NR.wia.maxDagloon * NR.wia.maandFactor;

  /* ===================== WIA: fasen en WGA-hiaat ===================== */

  RT.add({
    id: 'wia-wga-hiaat', groep: 'verzekeringen', naam: 'WIA-uitkering per fase en WGA-hiaat',
    intro: 'Welk bruto inkomen houdt een werknemer na twee jaar ziekte over in de WIA, fase voor fase, en hoe groot is het WGA-hiaat dat een hiaatverzekering kan dekken?',
    kw: 'wia wga iva hiaat wga-hiaat excedent arbeidsongeschiktheid werknemer loongerelateerd loonaanvulling vervolguitkering restverdiencapaciteit',
    peildatum: PEIL, fiscaal: ['Maximumdagloon', 'WIA-percentages', 'Minimumloon'],
    velden: [
      { k: 'reg', l: 'Uitkering', s: 'keuze', std: 'wga', breed: true, opties: [['wga', 'WGA (gedeeltelijk, of volledig maar niet duurzaam)'], ['iva', 'IVA (volledig en duurzaam arbeidsongeschikt)']] },
      { k: 'sal', l: 'Bruto jaarloon vóór ziekte (sv-loon)', s: 'eur', std: 54000 },
      { k: 'ao', l: 'Arbeidsongeschiktheid', s: 'pct', std: 55, als: v => v.reg === 'wga' },
      { k: 'werk', l: 'Inkomsten uit werk per maand in de WIA', s: 'eur', std: 600, opt: true },
      { k: 'avo', l: 'Jaren arbeidsverleden tot en met 2015', s: 'num', na: 'jaar', std: 12, als: v => v.reg === 'wga' },
      { k: 'avn', l: 'Jaren arbeidsverleden vanaf 2016', s: 'num', na: 'jaar', std: 9, als: v => v.reg === 'wga', tip: 'Tel alleen jaren waarin minstens 208 uur is gewerkt; het jaar waarin de uitkering ingaat telt niet mee.' },
      { k: 'mlm', l: 'Bruto minimumloon per maand', s: 'bedrag', std: NR.minimumloon.maandAfgeleid, als: v => v.reg === 'wga', tip: 'Standaard afgeleid uit het uurloon bij 36 uur per week. Controleer het bedrag dat UWV hanteert.' }
    ],
    bereken(v) {
      const W = NR.wia, maxMl = maxMaandloon();
      const onbegrensd = v.sal / 12, ml = Math.min(onbegrensd, maxMl), werk = v.werk || 0;
      const excedent = pos(onbegrensd - maxMl);
      if (v.reg === 'iva') {
        const uitk = pos(W.ivaPct / 100 * ml - W.ivaVerrekenPct / 100 * werk), tot = uitk + werk;
        return {
          lbl: 'Bruto inkomen per maand in de IVA', groot: fmt.euro(tot), onder: 'IVA-uitkering plus inkomsten uit werk, tot de AOW-leeftijd',
          rijen: [
            ['WIA-maandloon (begrensd)', fmt.euro(ml)],
            ['IVA-uitkering (' + W.ivaPct + '%, na verrekening werk)', fmt.euro(uitk)],
            ['Inkomsten uit werk', fmt.euro(werk)],
            ['Loon boven het maximum (excedent)', fmt.euro(excedent)],
            ['Terugval ten opzichte van het salaris', fmt.euro(pos(onbegrensd - tot)), 'som']
          ],
          signalen: excedent > 0 ? ['Het salaris ligt ' + fmt.euro(excedent) + ' per maand boven het maximum WIA-maandloon. Over dat deel keert de IVA niets uit; daarvoor bestaat een excedentverzekering.'] : []
        };
      }
      const ao = v.ao;
      if (ao < W.ondergrens) {
        return {
          lbl: 'Bruto WIA-uitkering per maand', groot: fmt.euro(0), onder: 'minder dan ' + W.ondergrens + '% arbeidsongeschikt',
          rijen: [['Inkomsten uit werk', fmt.euro(werk)], ['Terugval ten opzichte van het salaris', fmt.euro(pos(onbegrensd - werk)), 'som']],
          signalen: ['Onder ' + W.ondergrens + '% arbeidsongeschiktheid is er geen WIA-uitkering. De werknemer blijft in principe bij de eigen werkgever in dienst, in aangepast werk. Een WIA-bodemverzekering of aanvulling via de werkgever kan dit risico dekken.']
        };
      }
      const rvc = onbegrensd * (1 - Math.min(ao, 100) / 100);
      const duur = duurArbeidsverleden(v.avo, v.avn);
      const lgu1 = W.lguStart / 100 * pos(ml - werk), lgu2 = W.lguNa / 100 * pos(ml - werk);
      const benut = rvc > 0 ? werk / rvc * 100 : (werk > 0 ? 100 : 0);
      const klasse = ao >= 80 ? null : W.vervolg.find(k => ao >= k[0] && ao < k[1]);
      const vervolgPct = klasse ? klasse[2] : W.vervolg80plus;
      const grondslagVervolg = Math.min(v.mlm, ml);
      const vervolg = vervolgPct / 100 * grondslagVervolg;
      const laNiveau = W.loonaanvullingPct / 100 * pos(ml - rvc); // loonaanvulling bij 50–100% benutting
      let fase2, fase2Naam;
      if (benut >= 100) { fase2 = W.loonaanvullingPct / 100 * pos(ml - werk); fase2Naam = 'Loonaanvullingsuitkering'; }
      else if (benut >= W.benuttingDrempel) { fase2 = laNiveau; fase2Naam = 'Loonaanvullingsuitkering'; }
      else { fase2 = vervolg; fase2Naam = 'Vervolguitkering'; }
      const hiaat = fase2Naam === 'Vervolguitkering' ? pos(laNiveau - vervolg) : 0;
      const tot2 = fase2 + werk;
      const rij = (naam, duurTxt, u) => [naam, duurTxt, fmt.euro(u), fmt.euro(werk), fmt.euro(u + werk), fmt.euro(pos(onbegrensd - u - werk))];
      const sig = [];
      if (fase2Naam === 'Vervolguitkering') sig.push('De restverdiencapaciteit wordt voor ' + fmt.pct(benut, 0) + ' benut (minder dan ' + W.benuttingDrempel + '%). Na de loongerelateerde fase volgt daarom de vervolguitkering. Het WGA-hiaat is ' + fmt.euro(hiaat) + ' per maand bruto: dat is het verschil met het niveau van de loonaanvulling.');
      if (excedent > 0) sig.push('Het salaris ligt ' + fmt.euro(excedent) + ' per maand boven het maximum WIA-maandloon. Dat deel is niet verzekerd in de WIA (excedent).');
      if (ao >= 80) sig.push('Bij 80% of meer arbeidsongeschiktheid die niet duurzaam is, geldt de WGA met ' + W.vervolg80plus + '% van het minimumloon als vervolguitkering.');
      return {
        lbl: 'Bruto inkomen per maand na de loongerelateerde fase', groot: fmt.euro(tot2), onder: fase2Naam.toLowerCase() + ' plus werk, na ' + maanden(duur),
        rijen: [
          ['WIA-maandloon (begrensd)', fmt.euro(ml)],
          ['Restverdiencapaciteit (theoretisch)', fmt.euro(rvc)],
          ['Benutting restverdiencapaciteit', fmt.pct(benut, 0)],
          ['Duur loongerelateerde uitkering', maanden(duur)],
          ['Vervolguitkering bij ' + fmt.pct(ao, 0) + ' arbeidsongeschikt', fmt.pct(vervolgPct, 2) + ' van ' + fmt.euro(grondslagVervolg)],
          ['WGA-hiaat per maand', fmt.euro(hiaat)],
          ['Loon boven het maximum (excedent)', fmt.euro(excedent), 'som']
        ],
        signalen: sig,
        tabel: {
          titel: 'Bruto inkomen per fase (per maand)', kop: ['Fase', 'Duur', 'Uitkering', 'Werk', 'Totaal', 'Terugval'],
          rijen: [
            rij('Loongerelateerd ' + W.lguStart + '%', W.lguStartMaanden + ' maanden', lgu1),
            rij('Loongerelateerd ' + W.lguNa + '%', maanden(pos(duur - W.lguStartMaanden)), lgu2),
            rij(fase2Naam, 'tot AOW-leeftijd', fase2)
          ]
        }
      };
    },
    uitleg: 'WIA-maandloon = jaarloon / 12, niet hoger dan maximumdagloon × 21,75. Restverdiencapaciteit (rvc) = jaarloon / 12 × (1 − arbeidsongeschiktheid). Loongerelateerde WGA-uitkering: de eerste 2 maanden 75%, daarna 70% van (maandloon − inkomsten), met een duur van 3 tot 24 maanden naar arbeidsverleden (eerste 10 jaar 1 maand per jaar, daarna jaren tot en met 2015 1 maand en jaren vanaf 2016 een halve maand). Daarna bij minstens 50% benutting van de rvc de loonaanvulling: 70% × (maandloon − rvc), of 70% × (maandloon − inkomsten) bij volledige benutting. Bij minder dan 50% benutting de vervolguitkering: 28%, 35%, 42% of 50,75% van het minimumloon (of van het lagere maandloon) per arbeidsongeschiktheidsklasse. WGA-hiaat = loonaanvullingsniveau − vervolguitkering. IVA = 75% van het maandloon − 70% van de inkomsten.',
    letop: INDICATIEF + ' UWV stelt de restverdiencapaciteit vast met het maatmaninkomen en de functies die de verzekeringsarts en arbeidsdeskundige passend vinden; die kan flink afwijken van de theoretische waarde hier. Het WIA-maandloon volgt uit het sv-loon in het jaar vóór de ziekte. Bedragen zijn bruto en zonder vakantiegeld. Toeslagenwet en aanvullingen uit cao of werkgever zijn niet meegenomen. <b>Compliance:</b> gebruik de uitkomst als inventarisatie van het risico; de keuze voor een WGA-hiaat-, excedent- of woonlastenverzekering vraagt een adviesgesprek en de polisvoorwaarden van de werkgever.'
  });

  /* ===================== WW: duur en hoogte ===================== */

  RT.add({
    id: 'ww-duur-hoogte', groep: 'inkomen-werk', naam: 'WW-uitkering: duur en hoogte',
    intro: 'Hoe lang loopt de WW bij een gegeven arbeidsverleden, en hoeveel is de bruto uitkering in de eerste twee maanden en daarna?',
    kw: 'ww werkloosheid werkloos duur arbeidsverleden uitkering 75% 70% maandloon dagloon ontslag',
    peildatum: PEIL, fiscaal: ['Maximumdagloon', 'WW-percentages en duur'],
    velden: [
      { k: 'sv', l: 'Sv-loon in de 12 maanden vóór werkloosheid', s: 'eur', std: 48000 },
      { k: 'avo', l: 'Jaren arbeidsverleden tot en met 2015', s: 'num', na: 'jaar', std: 8 },
      { k: 'avn', l: 'Jaren arbeidsverleden vanaf 2016', s: 'num', na: 'jaar', std: 10, tip: 'Tel jaren waarin minstens 208 uur is gewerkt; het jaar waarin de WW ingaat telt niet mee.' },
      { k: 'jaren', l: 'Voldaan aan de jareneis (4 van de laatste 5 jaar gewerkt)?', s: 'keuze', opties: JANEE, std: 'ja', breed: true }
    ],
    bereken(v) {
      const W = NR.ww, maxMl = maxMaandloon();
      const ml = Math.min(v.sv / 12, maxMl);
      const duur = v.jaren === 'ja' ? duurArbeidsverleden(v.avo, v.avn) : W.minMaanden;
      const m1 = W.pctStart / 100 * ml, m2 = W.pctNa / 100 * ml;
      const n1 = Math.min(duur, W.startMaanden), n2 = pos(duur - W.startMaanden);
      const totaal = m1 * n1 + m2 * n2;
      return {
        lbl: 'Duur van de WW', groot: maanden(duur), onder: 'bruto ' + fmt.euro(totaal, 0) + ' over de hele periode',
        rijen: [
          ['WW-maandloon (begrensd)', fmt.euro(ml)],
          ['Uitkering maand 1 en 2 (' + W.pctStart + '%)', fmt.euro(m1)],
          ['Uitkering vanaf maand 3 (' + W.pctNa + '%)', fmt.euro(m2)],
          ['Terugval vanaf maand 3 ten opzichte van het loon', fmt.euro(pos(v.sv / 12 - m2)), 'som']
        ],
        signalen: [
          v.jaren === 'ja' ? '' : 'Zonder jareneis is er alleen een kortdurende WW van ' + W.minMaanden + ' maanden.',
          v.sv / 12 > maxMl ? 'Het loon ligt boven het maximum WW-maandloon (' + fmt.euro(maxMl) + '); over het meerdere is er geen uitkering.' : ''
        ].filter(Boolean)
      };
    },
    uitleg: 'WW-maandloon = sv-loon / 12 (gelijk aan dagloon × 21,75), niet hoger dan het maximum. Uitkering: de eerste 2 maanden 75%, daarna 70% van het maandloon. Duur: de eerste 10 jaar arbeidsverleden geven 1 maand per jaar; daarna geven jaren tot en met 2015 1 maand en jaren vanaf 2016 een halve maand per jaar. Minimaal 3, maximaal 24 maanden.',
    letop: INDICATIEF + ' De voorwaarden (wekeneis: 26 van de laatste 36 weken gewerkt; jareneis) en de vaststelling van het arbeidsverleden doet UWV. Inkomsten naast de WW worden verrekend. Bedragen zijn bruto, zonder vakantiegeld. Een cao kan een aanvulling of verlenging regelen (private aanvulling WW).'
  });

  /* ===================== Nabestaanden: tekort per fase ===================== */

  RT.add({
    id: 'nabestaanden-tekort-gezin', groep: 'verzekeringen', naam: 'Nabestaandentekort voor een gezin',
    intro: 'Bij overlijden van een partner: welk netto tekort heeft het gezin zolang er Anw is, daarna tot de AOW-leeftijd, en welk kapitaal dekt dat?',
    kw: 'nabestaanden overlijden anw nabestaandenpensioen wezenpensioen partnerpensioen tekort orv overlijdensrisicoverzekering kapitaal gezin',
    peildatum: PEIL, fiscaal: ['Anw-bedrag', 'Anw-vrijlating', 'Tarieven box 1', 'Heffingskortingen'],
    velden: [
      { k: 'beh', l: 'Gewenst netto gezinsinkomen per maand', s: 'eur', std: 3600 },
      { k: 'werk', l: 'Eigen bruto arbeidsinkomen nabestaande per maand', s: 'eur', std: 1800, opt: true },
      { k: 'np', l: 'Nabestaandenpensioen bruto per jaar', s: 'eur', std: 11000, opt: true },
      { k: 'wp', l: 'Wezenpensioen bruto per jaar (alle kinderen)', s: 'eur', std: 2400, opt: true },
      { k: 'wpj', l: 'Wezenpensioen loopt nog', s: 'num', na: 'jaar', std: 15, opt: true },
      { k: 'kind', l: 'Leeftijd jongste kind', s: 'num', na: 'jaar', std: 6 },
      { k: 'lft', l: 'Leeftijd nabestaande', s: 'num', na: 'jaar', std: 41 },
      { k: 'aowl', l: 'AOW-leeftijd nabestaande', s: 'num', na: 'jaar', std: 67 },
      { k: 'ov', l: 'Overige netto inkomsten per maand (kinderbijslag, kindgebonden budget)', s: 'eur', std: 0, opt: true, breed: true },
      { k: 'beschik', l: 'Al beschikbaar kapitaal (bestaande ORV, spaargeld)', s: 'eur', std: 0, opt: true },
      { k: 'r', l: 'Rekenrente', s: 'pct', std: 2 },
      { k: 'mlm', l: 'Bruto minimumloon per maand (voor de Anw-vrijlating)', s: 'bedrag', std: NR.minimumloon.maandAfgeleid, breed: true }
    ],
    bereken(v) {
      const A = NR.anw, werk = v.werk || 0;
      const jrAnw = pos(18 - v.kind), jrAow = pos(v.aowl - v.lft), jrWp = Math.min(pos(v.wpj || 0), jrAow);
      if (!(jrAow > 0)) return { fout: 'De nabestaande heeft de AOW-leeftijd al bereikt; deze hulp rekent tot de AOW-leeftijd.' };
      const vrij = A.vrijlatingPctMinimumloon / 100 * v.mlm;
      const anwMaand = pos(A.brutoMaand - pos(werk - vrij) * (1 - A.vrijDeelBoven));
      const i = maandUitJaar(v.r || 0);
      // Breekpunten in jaren: einde Anw, einde wezenpensioen, AOW
      const punten = [...new Set([0, Math.min(jrAnw, jrAow), jrWp, jrAow])].filter(x => x <= jrAow).sort((a, b) => a - b);
      const rijen = [];
      let kapitaal = 0;
      for (let s = 0; s < punten.length - 1; s++) {
        const van = punten[s], tot = punten[s + 1];
        if (tot <= van) continue;
        const metAnw = van < jrAnw, metWp = van < jrWp;
        const anw = metAnw ? anwMaand : 0, wp = metWp ? (v.wp || 0) / 12 : 0;
        const r = F.netto(werk * 12 + (v.np || 0) + anw * 12, { arbeid: werk * 12 });
        const netto = r.netto / 12 + wp + (v.ov || 0);
        const tekort = pos(v.beh - netto);
        const m0 = Math.round(van * 12), m1 = Math.round(tot * 12);
        for (let m = m0; m < m1; m++) kapitaal += tekort / Math.pow(1 + i, m);
        rijen.push([fmt.getal(van, van % 1 ? 1 : 0) + ' – ' + fmt.getal(tot, tot % 1 ? 1 : 0) + ' jaar', metAnw ? fmt.euro0(anw) : '–', metWp ? fmt.euro0(wp) : '–', fmt.euro0(netto), fmt.euro0(tekort)]);
      }
      const nodig = pos(kapitaal - (v.beschik || 0));
      return {
        lbl: 'Benodigd extra kapitaal bij overlijden', groot: fmt.euro0(nodig), onder: 'contante waarde van de netto tekorten tot de AOW-leeftijd',
        rijen: [
          ['Anw bruto per maand na inkomenskorting', fmt.euro(anwMaand)],
          ['Anw loopt nog (tot jongste kind 18 is)', fmt.getal(Math.min(jrAnw, jrAow), 0) + ' jaar'],
          ['Contante waarde van alle tekorten', fmt.euro0(kapitaal)],
          ['Al beschikbaar', fmt.euro0(v.beschik || 0)],
          ['Benodigd extra kapitaal', fmt.euro0(nodig), 'som']
        ],
        signalen: [jrAnw > 0 && jrAnw < jrAow ? 'Als het jongste kind 18 wordt, vervalt de Anw: vanaf dan stijgt het tekort met ongeveer het netto Anw-bedrag.' : ''].filter(Boolean),
        tabel: { titel: 'Netto per maand per fase', kop: ['Periode', 'Anw bruto', 'Wezenpensioen', 'Netto gezin', 'Tekort'], rijen }
      };
    },
    uitleg: 'Anw = € ' + fmt.getal(NR.anw.brutoMaand, 2) + ' bruto per maand, gekort met twee derde van het arbeidsinkomen boven de vrijlating (50% van het bruto minimumloon). Netto nabestaande = box 1-netto over arbeidsinkomen + nabestaandenpensioen + Anw (vóór de AOW-leeftijd). Wezenpensioen is inkomen van het kind en telt hier bruto voor netto mee. Tekort per maand = gewenst netto − netto gezin. Benodigd kapitaal = som van de maandelijkse tekorten tot de AOW-leeftijd, contant gemaakt tegen de rekenrente.',
    letop: INDICATIEF + ' Recht op Anw bestaat alleen onder voorwaarden (onder meer een kind jonger dan 18 in het huishouden, of minstens 45% arbeidsongeschiktheid) en eindigt bij de AOW-leeftijd; andere uitkeringen dan arbeidsinkomen worden volledig gekort. Het Anw-bedrag is exclusief vakantiegeld. Partner- en wezenpensioen staan op het pensioenoverzicht; controleer of het om een risicodekking gaat die bij uitdiensttreding vervalt. Inflatie, toeslagen en de woonlasten na aflossing met een ORV-uitkering zijn niet apart doorgerekend. <b>Compliance:</b> de verzekerde som, looptijd en begunstiging van een overlijdensrisicoverzekering vragen een adviesgesprek.'
  });

  /* ===================== AOV of broodfonds ===================== */

  RT.add({
    id: 'aov-of-broodfonds', groep: 'verzekeringen', naam: 'AOV of broodfonds vergeleken',
    intro: 'Een zzp’er twijfelt tussen een arbeidsongeschiktheidsverzekering, een broodfonds of beide. Wat kost elk netto per jaar en wat ontvangt de ondernemer bij een ziekte van een gegeven duur?',
    kw: 'aov broodfonds zzp ondernemer arbeidsongeschiktheid schenkkring ziekte wachttijd vergelijken premie inleg',
    peildatum: PEIL, fiscaal: ['Tarieven box 1', 'Heffingskortingen', 'Zelfstandigenaftrek', 'Mkb-winstvrijstelling', 'Zvw-bijdrage ondernemer'],
    velden: [
      { k: 'w', l: 'Winst uit onderneming per jaar', s: 'eur', std: 60000 },
      { k: 'uren', l: 'Voldoet aan het urencriterium?', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'ziek', l: 'Scenario: duur van de ziekte', s: 'num', na: 'maanden', std: 18 },
      { k: 'ap', l: 'AOV: bruto premie per jaar', s: 'eur', std: 3600 },
      { k: 'au', l: 'AOV: bruto uitkering per maand', s: 'eur', std: 3000 },
      { k: 'aw', l: 'AOV: wachttijd', s: 'num', na: 'maanden', std: 3 },
      { k: 'bi', l: 'Broodfonds: inleg per maand', s: 'eur', std: 110 },
      { k: 'bk', l: 'Broodfonds: kosten per maand', s: 'eur', std: 12, opt: true },
      { k: 'bs', l: 'Broodfonds: schenking per maand', s: 'eur', std: 2000 },
      { k: 'bw', l: 'Broodfonds: wachttijd', s: 'num', na: 'maanden', std: 1 },
      { k: 'bmax', l: 'Broodfonds: maximale duur schenkingen', s: 'num', na: 'maanden', std: 24 }
    ],
    bereken(v) {
      const opt = { urencriterium: v.uren === 'ja' }, O = NR.ondernemer;
      const voordeel = F.ondernemer(v.w, opt).heffing - F.ondernemer(v.w, Object.assign({ aftrek: v.ap }, opt)).heffing;
      const aovNetto = v.ap - voordeel;
      const uJaar = v.au * 12, r = F.netto(uJaar, { arbeid: 0 });
      const aovUitkNetto = (uJaar - r.heffing - Math.min(uJaar, O.zvwMaxInkomen) * O.zvwPct / 100) / 12;
      const bfKosten = (v.bi + (v.bk || 0)) * 12;
      const d = pos(Math.round(v.ziek));
      const mAov = pos(d - Math.round(v.aw)), mBf = pos(Math.min(d, Math.round(v.bmax)) - Math.round(v.bw));
      const ontvAov = mAov * aovUitkNetto, ontvBf = mBf * v.bs;
      // Combinatie: broodfonds in de AOV-wachttijd en zolang het loopt, daarna de AOV
      const ontvComb = ontvAov + ontvBf;
      const verschil = ontvAov - ontvBf;
      const sig = [];
      if (d > v.bmax) sig.push('De ziekte duurt langer dan het broodfonds schenkt (' + maanden(Math.round(v.bmax)) + '). Daarna heeft alleen de AOV nog een uitkering, tot de eindleeftijd van de polis.');
      if (v.aw > v.bw) sig.push('Een broodfonds kan de wachttijd van de AOV overbruggen; dan kan een langere (goedkopere) wachttijd op de AOV passen.');
      return {
        lbl: 'Verschil netto ontvangsten (AOV − broodfonds)', groot: fmt.euro0(verschil), onder: 'bij ' + maanden(d) + ' ziekte',
        rijen: [
          ['AOV: netto premie per jaar', fmt.euro0(aovNetto)],
          ['AOV: netto uitkering per maand (indicatie)', fmt.euro0(aovUitkNetto)],
          ['Broodfonds: inleg en kosten per jaar', fmt.euro0(bfKosten)],
          ['Broodfonds: schenking per maand', fmt.euro0(v.bs)],
          ['Combinatie: netto kosten per jaar', fmt.euro0(aovNetto + bfKosten), 'som']
        ],
        signalen: sig,
        tabel: {
          titel: 'Scenario ' + maanden(d) + ' ziekte', kop: ['', 'AOV', 'Broodfonds', 'Beide'],
          rijen: [
            ['Netto kosten per jaar', fmt.euro0(aovNetto), fmt.euro0(bfKosten), fmt.euro0(aovNetto + bfKosten)],
            ['Maanden met inkomen', String(mAov), String(mBf), String(Math.max(mAov, mBf))],
            ['Netto ontvangen in het scenario', fmt.euro0(ontvAov), fmt.euro0(ontvBf), fmt.euro0(ontvComb)],
            ['Ontvangen per € 1 netto kosten per jaar', fmt.getal(aovNetto > 0 ? ontvAov / aovNetto : NaN, 1), fmt.getal(bfKosten > 0 ? ontvBf / bfKosten : NaN, 1), fmt.getal(aovNetto + bfKosten > 0 ? ontvComb / (aovNetto + bfKosten) : NaN, 1)]
          ]
        }
      };
    },
    uitleg: 'AOV: netto premie = bruto premie − belastingvoordeel (inkomstenbelasting over de winst met en zonder de premie als aftrekpost, na zelfstandigenaftrek en mkb-winstvrijstelling). Netto uitkering = bruto uitkering − inkomstenbelasting (zonder arbeidskorting) − Zvw-bijdrage, als enig inkomen. Broodfonds: inleg en kosten zijn niet aftrekbaar; schenkingen tellen netto. Ontvangsten = aantal maanden na de wachttijd × netto bedrag; het broodfonds stopt na de maximale duur.',
    letop: INDICATIEF + ' Bedragen van broodfondsen (inleg, schenking, wachttijd en maximale duur) verschillen per fonds; de standaardwaarden zijn aannames. Een broodfonds geeft geen afdwingbaar recht op schenkingen en de fiscale behandeling (geen aftrek, onbelaste schenking binnen de vrijstelling) is hier aangenomen, niet bij de Belastingdienst bevestigd. Een AOV keert uit naar de mate van arbeidsongeschiktheid en de polisvoorwaarden (beroeps- of arbeidsongeschiktheidsdefinitie, eindleeftijd, indexatie). <b>Compliance:</b> deze vergelijking is geen productadvies; een AOV-advies vraagt een volledige inventarisatie en toetsing aan de polisvoorwaarden.'
  });

  /* ===================== Pensioengat met AOW ===================== */

  RT.add({
    id: 'pensioengat-aow', groep: 'pensioen-aow', naam: 'Pensioengat inclusief AOW',
    intro: 'Hoe groot is het gat tussen het gewenste inkomen na pensionering en AOW plus pensioen, bruto en netto, en wat kost een eerdere stopdatum aan AOW-gat?',
    kw: 'pensioengat pensioentekort aow aow-gat inkomen na pensioen opbouwgaten streefinkomen netto pensioen eerder stoppen',
    peildatum: PEIL, fiscaal: ['AOW-bedragen', 'Tarieven box 1', 'Heffingskortingen', 'Ouderenkorting'],
    velden: [
      { k: 'ink', l: 'Huidig bruto jaarinkomen', s: 'eur', std: 58000 },
      { k: 'doel', l: 'Gewenst inkomen na pensioen (deel van het huidige)', s: 'pct', std: 70 },
      { k: 'ls', l: 'Leefsituatie na pensioen', s: 'keuze', std: 'samen', opties: [['alleen', 'Alleenstaand'], ['samen', 'Samenwonend of gehuwd']] },
      { k: 'jr', l: 'Verzekerde jaren AOW op de AOW-datum', s: 'num', na: 'jaar', std: 50, tip: 'Elk niet-verzekerd jaar tussen 17 jaar en de AOW-leeftijd kost 2% AOW.' },
      { k: 'pens', l: 'Verwacht ouderdomspensioen bruto per jaar', s: 'eur', std: 16000 },
      { k: 'lijf', l: 'Lijfrente of ander inkomen bruto per jaar', s: 'eur', std: 0, opt: true },
      { k: 'eerder', l: 'Stoppen vóór de AOW-datum', s: 'num', na: 'maanden', std: 0, opt: true }
    ],
    bereken(v) {
      const A = NR.aow, alleen = v.ls === 'alleen';
      const aowVol = alleen ? A.brutoAlleenstaandJaar : A.brutoSamenPpJaar;
      const aow = aowVol * Math.min(50, pos(v.jr)) / 50;
      const doel = v.ink * v.doel / 100, totaal = aow + v.pens + (v.lijf || 0);
      const tekort = pos(doel - totaal);
      const opt = { aow: true, arbeid: 0, alleenstaand: alleen };
      const nettoNu = F.netto(v.ink).netto, nettoDoel = F.netto(doel, opt).netto, nettoNa = F.netto(totaal, opt).netto;
      const nettoTekort = pos(nettoDoel - nettoNa);
      const eerder = pos(Math.round(v.eerder || 0));
      const aowGat = eerder * aow / 12;
      const sig = [];
      if (v.jr < 50) sig.push('Door ' + fmt.getal(50 - pos(v.jr), 0) + ' ontbrekende verzekerde jaren is de AOW ' + fmt.euro0(aowVol - aow) + ' per jaar lager dan het volle bedrag.');
      if (eerder) sig.push('Bij stoppen ' + maanden(eerder) + ' vóór de AOW-datum moet er ' + fmt.euro0(aowGat) + ' bruto aan AOW worden overbrugd, naast het ontbrekende loon. Vervroegen van het pensioen verlaagt bovendien de pensioenuitkering.');
      if (tekort > 0) sig.push('Met de rekenhulp <a href="#pensioentekort">Inleg voor een pensioentekort</a> bereken je de inleg die nodig is om dit tekort te dekken.');
      return {
        lbl: 'Bruto pensioengat per maand', groot: fmt.euro(tekort / 12), onder: fmt.euro0(tekort) + ' per jaar vanaf de AOW-datum',
        rijen: [
          ['AOW bruto per jaar (excl. vakantiegeld)', fmt.euro0(aow)],
          ['Pensioen en overig inkomen', fmt.euro0(v.pens + (v.lijf || 0))],
          ['Gewenst bruto inkomen', fmt.euro0(doel)],
          ['Netto nu per maand', fmt.euro0(nettoNu / 12)],
          ['Netto na pensioen per maand', fmt.euro0(nettoNa / 12)],
          ['Netto gat per maand', fmt.euro0(nettoTekort / 12), 'som'],
          ['AOW-gat bij eerder stoppen (totaal bruto)', fmt.euro0(aowGat)]
        ],
        signalen: sig
      };
    },
    uitleg: 'AOW = vol bedrag per jaar (' + fmt.euro0(NR.aow.brutoAlleenstaandJaar) + ' alleenstaand, ' + fmt.euro0(NR.aow.brutoSamenPpJaar) + ' samenwonend, per 1 juli 2026, zonder vakantiegeld) × verzekerde jaren / 50. Pensioengat bruto = gewenst inkomen (percentage van het huidige) − AOW − pensioen − overig inkomen. Netto gat = netto van het gewenste inkomen − netto van AOW, pensioen en overig, beide met het tarief en de kortingen vanaf de AOW-leeftijd (inclusief ouderenkorting). AOW-gat = maanden eerder × AOW per maand.',
    letop: INDICATIEF + ' Het pensioen staat op het pensioenoverzicht en op mijnpensioenoverzicht.nl; onder de nieuwe pensioenregels is de uitkering niet gegarandeerd. Bij samenwonen hangt de AOW per persoon af van de partner; het gezinsinkomen telt beide partners. Inflatie tot de pensioendatum is niet meegenomen: rekenen met euro’s van nu. Huidig netto is berekend als loon van een werknemer.'
  });

  /* ===================== Netto besteedbaar inkomen huishouden ===================== */

  RT.add({
    id: 'netto-besteedbaar-huishouden', groep: 'inkomen-werk', naam: 'Netto besteedbaar inkomen huishouden',
    intro: 'Netto inkomen van beide partners samen, plus toeslagen en kinderregelingen, min woonlasten en vaste lasten: wat blijft er per maand vrij te besteden?',
    kw: 'netto besteedbaar inkomen huishouden budget vaste lasten woonlasten partners vrij besteedbaar draagkracht',
    peildatum: PEIL, fiscaal: ['Tarieven box 1', 'Heffingskortingen'],
    velden: [
      { k: 'a', l: 'Partner 1: bruto jaarloon (incl. vakantiegeld)', s: 'eur', std: 52000 },
      { k: 'au', l: 'Partner 1: uitkering of pensioen per jaar', s: 'eur', std: 0, opt: true },
      { k: 'b', l: 'Partner 2: bruto jaarloon (incl. vakantiegeld)', s: 'eur', std: 26000, opt: true },
      { k: 'bu', l: 'Partner 2: uitkering of pensioen per jaar', s: 'eur', std: 0, opt: true },
      { k: 'kind', l: 'Recht op combinatiekorting (laagstverdienende partner)?', s: 'keuze', opties: JANEE, std: 'nee', breed: true, tip: 'Alleen voor ouders met een kind geboren vóór 1 januari 2025 en jonger dan 12 jaar.' },
      { k: 'ts', l: 'Toeslagen en kinderregelingen netto per maand', s: 'eur', std: 0, opt: true },
      { k: 'wl', l: 'Netto woonlasten per maand', s: 'eur', std: 1400 },
      { k: 'vl', l: 'Overige vaste lasten per maand (zorg, energie, verzekeringen)', s: 'eur', std: 900, breed: true }
    ],
    bereken(v) {
      const ra = F.netto(v.a + (v.au || 0), { arbeid: v.a, kind: v.kind === 'ja' && v.a <= (v.b || 0) });
      const rb = F.netto((v.b || 0) + (v.bu || 0), { arbeid: v.b || 0, kind: v.kind === 'ja' && (v.b || 0) < v.a });
      const nettoMaand = (ra.netto + rb.netto) / 12, inkomen = nettoMaand + (v.ts || 0);
      const vrij = inkomen - v.wl - v.vl;
      const sig = [];
      if (vrij < 0) sig.push('De vaste lasten zijn hoger dan het netto inkomen: er is een tekort van ' + fmt.euro0(-vrij) + ' per maand.');
      if (inkomen > 0 && v.wl / inkomen > 0.4) sig.push('De woonlasten zijn meer dan 40% van het netto inkomen. Toets de betaalbaarheid ook aan de leennormen en een budget per huishoudtype.');
      return {
        lbl: 'Vrij besteedbaar per maand', groot: fmt.euro0(vrij), onder: 'na woonlasten en vaste lasten',
        rijen: [
          ['Netto partner 1 per maand', fmt.euro0(ra.netto / 12)],
          ['Netto partner 2 per maand', fmt.euro0(rb.netto / 12)],
          ['Toeslagen en kinderregelingen', fmt.euro0(v.ts || 0)],
          ['Netto huishoudinkomen per maand', fmt.euro0(inkomen)],
          ['Woonlasten in procenten van netto', fmt.pct(inkomen > 0 ? v.wl / inkomen * 100 : NaN, 1)],
          ['Vrij besteedbaar per jaar', fmt.euro0(vrij * 12), 'som']
        ],
        signalen: sig
      };
    },
    uitleg: 'Per partner: netto = bruto − box 1-belasting na algemene heffingskorting, arbeidskorting (over het loon) en eventueel combinatiekorting (bij de partner met het laagste arbeidsinkomen). Vrij besteedbaar = netto beide partners / 12 + toeslagen − woonlasten − vaste lasten.',
    letop: INDICATIEF + ' De loonheffing per maand kan afwijken door bijzondere beloningen en de loonheffingskorting; het jaarnetto volgt uit de aangifte. Pensioenpremie, aftrekposten (zoals hypotheekrente) en de verdeling van gezamenlijke inkomensbestanddelen zijn niet meegenomen; vul netto woonlasten in. Vrij besteedbaar is iets anders dan wat een huishouden minimaal nodig heeft voor levensonderhoud.'
  });

  /* ===================== Wlz: eigen bijdrage ===================== */

  RT.add({
    id: 'eigen-bijdrage-wlz', groep: 'huishouden-overig', naam: 'Wlz: eigen bijdrage (indicatie)',
    intro: 'Welke eigen bijdrage vraagt het CAK voor zorg uit de Wet langdurige zorg: de lage bijdrage thuis of in de eerste maanden in een instelling, of de hoge bijdrage bij langer verblijf?',
    kw: 'wlz eigen bijdrage cak verpleeghuis zorginstelling lage hoge bijdrage vermogen langdurige zorg pgb mpt',
    peildatum: PEIL, fiscaal: ['Wlz-bijdragegrenzen', 'Toetsbedrag vermogen Wlz'],
    velden: [
      { k: 'vorm', l: 'Situatie', s: 'keuze', std: 'thuis', breed: true, opties: [['thuis', 'Zorg thuis (modulair pakket thuis of pgb)'], ['kort', 'In een instelling, eerste 4 maanden'], ['lang', 'In een instelling, langer dan 4 maanden']] },
      { k: 'partner', l: 'Heeft een partner?', s: 'keuze', opties: JANEE, std: 'nee' },
      { k: 'ink', l: 'Inkomen van 2 jaar eerder (verzamelinkomen, met partner samen)', s: 'eur', std: 32000, breed: true },
      { k: 'verm', l: 'Vermogen in box 3 van 2 jaar eerder', s: 'eur', std: 90000 },
      { k: 'bel', l: 'Betaalde inkomstenbelasting en premies in dat jaar', s: 'eur', std: 3500, als: v => v.vorm === 'lang' },
      { k: 'zk', l: 'Zak- en kleedgeld per maand', s: 'bedrag', std: NR.wlz.zakKleedgeld, als: v => v.vorm === 'lang' }
    ],
    bereken(v) {
      const W = NR.wlz, partner = v.partner === 'ja';
      const toets = partner ? W.toetsbedragPartner : W.toetsbedragAlleen;
      const bijtelling = pos(v.verm - toets) * W.vermogensPct / 100;
      const bijdrageInkomen = v.ink + bijtelling;
      const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
      let bedrag, soort, grenzen;
      if (v.vorm === 'lang') {
        bedrag = clamp((bijdrageInkomen - (v.bel || 0)) / 12 - v.zk, 0, W.hoogMax);
        soort = 'hoge eigen bijdrage'; grenzen = fmt.euro(0) + ' tot ' + fmt.euro(W.hoogMax);
      } else {
        const lo = v.vorm === 'thuis' ? W.laagThuisMin : W.laagInstellingMin, hi = v.vorm === 'thuis' ? W.laagThuisMax : W.laagInstellingMax;
        bedrag = clamp(W.lagePct / 100 * bijdrageInkomen / 12, lo, hi);
        soort = 'lage eigen bijdrage'; grenzen = fmt.euro(lo) + ' tot ' + fmt.euro(hi);
      }
      const sig = [];
      if (v.vorm === 'lang' && partner) sig.push('Woont de partner nog thuis, dan blijft onder voorwaarden de lage eigen bijdrage gelden, ook na 4 maanden. Controleer dat bij het CAK.');
      if (bijtelling > 0) sig.push('Door het vermogen boven het toetsbedrag stijgt het bijdrage-inkomen met ' + fmt.euro0(bijtelling) + ' per jaar.');
      return {
        lbl: 'Eigen bijdrage per maand', groot: fmt.euro(bedrag), onder: soort + ', ' + fmt.euro0(bedrag * 12) + ' per jaar',
        rijen: [
          ['Toetsbedrag vermogen', fmt.euro0(toets)],
          ['Bijtelling vermogen (' + W.vermogensPct + '%)', fmt.euro0(bijtelling)],
          ['Bijdrage-inkomen', fmt.euro0(bijdrageInkomen)],
          ['Minimum en maximum per maand', grenzen, 'som']
        ],
        signalen: sig
      };
    },
    uitleg: 'Bijdrage-inkomen = inkomen van 2 jaar eerder + 4% van het box 3-vermogen boven het toetsbedrag (' + fmt.euro0(NR.wlz.toetsbedragAlleen) + ' alleen, ' + fmt.euro0(NR.wlz.toetsbedragPartner) + ' met partner). Lage bijdrage = 10% van het bijdrage-inkomen / 12, binnen het minimum en maximum voor de situatie. Hoge bijdrage (vereenvoudigd) = (bijdrage-inkomen − betaalde belasting) / 12 − zak- en kleedgeld, tot het maximum.',
    letop: INDICATIEF + ' Het CAK rekent met gegevens van de Belastingdienst en kent extra aftrekposten en uitzonderingen (onder meer bij een thuiswonende partner, AOW-leeftijd, pgb-korting en de eerste maanden in een instelling); de hoge bijdrage is hier sterk vereenvoudigd. Het zak- en kleedgeld is een niet bevestigde werkwaarde. Is het inkomen sindsdien flink gedaald, dan kan een herberekening op basis van een recenter jaar worden aangevraagd.'
  });
})(window.RT);
