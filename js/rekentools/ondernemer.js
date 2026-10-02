/* Rekenhulpen – groep "ondernemer" (Ondernemer, zzp en dga).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt, fin, lees, kal } = RT;
  const NM = RT.normen, F = RT.fisc;
  const PEIL = NM.peildatum;
  const JANEE = RT.keuzes.JANEE;
  const pos = x => Math.max(0, x);
  const verschil = x => fmt.plus(fmt.euro0(x));

  /* Normen die (nog) niet in normen.js staan. Peildatum 2026.
   * Waarden uit bron, niet geverifieerd: controleer bij Belastingdienst/Rijksoverheid vóór publicatie
   * en verplaats ze bij voorkeur naar normen.js (beheerder). */
  const N = {
    peildatum: '2026',
    btw: { hoog: 21, laag: 9 },                    // btw-tarieven (waarde uit bron, niet geverifieerd)
    wkoOpslag: 0.5,                                // opslag Wet kinderopvang op de Aof-premie, % (waarde uit bron, niet geverifieerd)
    kia: { ondergrens: 2900, grensPct: 70602, startAfbouw: 130744, bovengrens: 392230, pct: 28, max: 19769 }, // KIA-staffel (waarde uit bron, niet geverifieerd)
    middelingDrempel: 545,                         // drempel middeling, laatste tijdvak 2022-2024 (waarde uit bron, niet geverifieerd)
    gebruikelijkLoon: 56000,                       // normbedrag gebruikelijk loon dga (waarde uit bron, niet geverifieerd)
    bijtellingPct: 22,                             // standaardbijtelling auto (waarde uit bron, niet geverifieerd)
    kmVergoeding: 0.23,                            // onbelaste/aftrekbare vergoeding per zakelijke km (waarde uit bron, niet geverifieerd)
    welGrens: 500000,                              // grens Wet excessief lenen bij eigen vennootschap (waarde uit bron, niet geverifieerd)
    odvDuur: 20,                                   // uitkeringsduur oudedagsverplichting in jaren (waarde uit bron, niet geverifieerd)
    wkr: { grens: 400000, pct1: 2.0, pct2: 1.18, eindheffing: 80 }, // werkkostenregeling (waarde uit bron, niet geverifieerd)
    korGrens: 20000                                // omzetgrens kleineondernemersregeling (waarde uit bron, niet geverifieerd)
  };
  const INDICATIEF = 'Indicatief: deze norm staat nog niet in het centrale normenbestand. Controleer de actuele waarde bij de Belastingdienst.';

  // Aantal erkende feestdagen op een werkdag (ma–vr) in een jaar, voor het voorbeeld bij declarabele uren
  const feestOpWerkdag = jaar => kal.feestlijst(jaar, false).filter(([d]) => d.getDay() !== 0 && d.getDay() !== 6).length;

  /* ===================================================== prijzen en marges */

  RT.add({
    id: 'btw-berekenen', groep: 'ondernemer', naam: 'Btw erbij of eruit',
    intro: 'Reken een bedrag om van exclusief naar inclusief btw, of haal de btw uit een bedrag inclusief btw.',
    kw: 'btw omzetbelasting inclusief exclusief 21% 9% tarief',
    fiscaal: ['btw-tarieven'], peildatum: N.peildatum,
    velden: [
      { k: 'b', l: 'Bedrag', s: 'bedrag', std: 1250 },
      { k: 'r', l: 'Het bedrag is', s: 'keuze', opties: [['ex', 'Exclusief btw'], ['in', 'Inclusief btw']], std: 'ex' },
      { k: 't', l: 'Tarief', s: 'keuze', opties: [['hoog', 'Algemeen tarief (' + N.btw.hoog + '%)'], ['laag', 'Verlaagd tarief (' + N.btw.laag + '%)'], ['nul', 'Nultarief (0%)'], ['eigen', 'Ander percentage']], std: 'hoog' },
      { k: 'eigen', l: 'Ander percentage', s: 'pct', std: 21, als: v => v.t === 'eigen' }
    ],
    bereken(v) {
      const t = v.t === 'hoog' ? N.btw.hoog : v.t === 'laag' ? N.btw.laag : v.t === 'nul' ? 0 : v.eigen;
      if (!(t >= 0)) return { fout: 'Vul een btw-percentage van nul of hoger in.' };
      const ex = v.r === 'ex' ? v.b : v.b / (1 + t / 100);
      const btw = ex * t / 100;
      return {
        lbl: 'Btw (' + fmt.pct(t, t % 1 ? 1 : 0) + ')', groot: fmt.euro(btw),
        onder: v.r === 'ex' ? 'bovenop het bedrag' : 'zit in het bedrag',
        rijen: [
          ['Exclusief btw', fmt.euro(ex)],
          ['Btw', fmt.euro(btw)],
          ['Inclusief btw', fmt.euro(ex + btw), 'som'],
          ['Btw als deel van het bedrag inclusief', fmt.pct(t / (100 + t) * 100, 4)]
        ]
      };
    },
    uitleg: 'Vanaf exclusief: btw = bedrag × tarief. Vanaf inclusief: btw = bedrag × tarief / (100 + tarief); bij 21% is dat 21/121 van het bedrag.',
    letop: 'Welk tarief geldt, hangt af van de prestatie en de datum. Voor een aantal prestaties (zoals logies) verandert het tarief; controleer het actuele tarief. Indicatief: de btw-tarieven staan nog niet in het centrale normenbestand.'
  });

  RT.add({
    id: 'verkoopprijs-uit-marge', groep: 'ondernemer', naam: 'Verkoopprijs bij een gewenste marge',
    intro: 'Welke verkoopprijs vraagt u bij een bepaalde kostprijs om de gewenste marge of opslag te halen?',
    kw: 'verkoopprijs marge opslag kostprijs calculatie prijs bepalen',
    velden: [
      { k: 'ip', l: 'Inkoopprijs per stuk (excl. btw)', s: 'bedrag', std: 40 },
      { k: 'k', l: 'Bijkomende kosten per stuk', s: 'bedrag', std: 2.5, opt: true, tip: 'Bijvoorbeeld vracht of verpakking.' },
      { k: 'm', l: 'Gewenste marge of opslag', s: 'pct', std: 40 },
      { k: 's', l: 'Het percentage is', s: 'keuze', opties: [['in', 'Marge: deel van de verkoopprijs'], ['over', 'Opslag: bovenop de kostprijs']], std: 'in' },
      { k: 'btw', l: 'Btw-tarief voor de verkoop', s: 'pct', std: N.btw.hoog }
    ],
    bereken(v) {
      const kost = v.ip + v.k;
      if (kost <= 0) return { fout: 'Vul een kostprijs groter dan nul in.' };
      if (v.s === 'in' && v.m >= 100) return { fout: 'Een marge in de verkoopprijs moet onder de 100% liggen.' };
      const vp = v.s === 'in' ? kost / (1 - v.m / 100) : kost * (1 + v.m / 100);
      const w = vp - kost;
      return {
        lbl: 'Verkoopprijs exclusief btw', groot: fmt.euro(vp), onder: 'inclusief btw ' + fmt.euro(vp * (1 + v.btw / 100)),
        rijen: [
          ['Kostprijs per stuk', fmt.euro(kost)],
          ['Brutowinst per stuk', fmt.euro(w), 'som'],
          ['Marge (winst / verkoopprijs)', fmt.pct(w / vp * 100)],
          ['Opslag (winst / kostprijs)', fmt.pct(w / kost * 100)],
          ['Vermenigvuldigingsfactor', fmt.getal(vp / kost, 4)]
        ]
      };
    },
    uitleg: 'Opslag op de kostprijs: verkoopprijs = kostprijs × (1 + opslag). Marge als deel van de verkoopprijs: verkoopprijs = kostprijs / (1 − marge). Kostprijs = inkoopprijs + bijkomende kosten.',
    letop: 'Marge en opslag worden in de praktijk vaak door elkaar gebruikt. Spreek af welke van de twee bedoeld is: 40% opslag is maar 28,6% marge. Vaste kosten (huur, personeel) zitten niet in deze kostprijs.'
  });

  RT.add({
    id: 'inkoopprijs-uit-marge', groep: 'ondernemer', naam: 'Maximale inkoopprijs bij een gewenste marge',
    intro: 'De verkoopprijs ligt vast door de markt. Hoeveel mag de inkoop dan hoogstens kosten om de gewenste marge te halen?',
    kw: 'inkoopprijs marge opslag verkoopprijs terugrekenen',
    velden: [
      { k: 'vp', l: 'Verkoopprijs per stuk (excl. btw)', s: 'bedrag', std: 75 },
      { k: 'm', l: 'Gewenste marge of opslag', s: 'pct', std: 40 },
      { k: 's', l: 'Het percentage is', s: 'keuze', opties: [['in', 'Marge: deel van de verkoopprijs'], ['over', 'Opslag: bovenop de kostprijs']], std: 'in' }
    ],
    bereken(v) {
      if (v.vp <= 0) return { fout: 'Vul een verkoopprijs groter dan nul in.' };
      if (v.s === 'over' && v.m <= -100) return { fout: 'Een opslag van −100% of lager kan niet.' };
      const ip = v.s === 'in' ? v.vp * (1 - v.m / 100) : v.vp / (1 + v.m / 100);
      const w = v.vp - ip;
      return {
        lbl: 'Maximale inkoopprijs', groot: fmt.euro(ip), onder: 'exclusief btw, per stuk',
        rijen: [
          ['Brutowinst per stuk', fmt.euro(w), 'som'],
          ['Marge (winst / verkoopprijs)', fmt.pct(w / v.vp * 100)],
          ['Opslag (winst / inkoopprijs)', ip > 0 ? fmt.pct(w / ip * 100) : '–']
        ],
        signalen: ip <= 0 ? ['Bij deze marge blijft er geen ruimte voor inkoop over.'] : []
      };
    },
    uitleg: 'Marge als deel van de verkoopprijs: inkoopprijs = verkoopprijs × (1 − marge). Opslag op de inkoop: inkoopprijs = verkoopprijs / (1 + opslag).',
    letop: 'Houd bij de inkoop ook rekening met bijkomende kosten zoals vracht, invoerrechten en derving; die verlagen de ruimte voor de inkoopprijs zelf.'
  });

  RT.add({
    id: 'marge-en-opslag', groep: 'ondernemer', naam: 'Winstmarge en opslag',
    intro: 'Bereken marge en opslag uit de inkoop- en verkoopprijs, of reken een marge om naar een opslag en andersom.',
    kw: 'marge opslag omrekenen brutowinst winstmarge percentage',
    velden: [
      { k: 'wat', l: 'Wat wilt u berekenen?', s: 'keuze', breed: true, opties: [['prijzen', 'Marge en opslag uit twee prijzen'], ['o2m', 'Opslag omrekenen naar marge'], ['m2o', 'Marge omrekenen naar opslag']], std: 'prijzen' },
      { k: 'ip', l: 'Inkoopprijs', s: 'bedrag', std: 40, als: v => v.wat === 'prijzen' },
      { k: 'vp', l: 'Verkoopprijs', s: 'bedrag', std: 75, als: v => v.wat === 'prijzen' },
      { k: 'p', l: 'Percentage', s: 'pct', std: 50, als: v => v.wat !== 'prijzen' }
    ],
    bereken(v) {
      if (v.wat === 'prijzen') {
        if (v.ip <= 0 || v.vp <= 0) return { fout: 'Vul een inkoop- en verkoopprijs groter dan nul in.' };
        const w = v.vp - v.ip;
        return {
          lbl: 'Marge in de verkoopprijs', groot: fmt.pct(w / v.vp * 100), onder: 'opslag op de inkoop ' + fmt.pct(w / v.ip * 100),
          rijen: [
            ['Brutowinst per stuk', fmt.euro(w), 'som'],
            ['Marge (winst / verkoopprijs)', fmt.pct(w / v.vp * 100)],
            ['Opslag (winst / inkoopprijs)', fmt.pct(w / v.ip * 100)],
            ['Verkoopprijs / inkoopprijs', fmt.getal(v.vp / v.ip, 4)]
          ],
          signalen: w < 0 ? ['De verkoopprijs ligt onder de inkoopprijs: er is verlies per stuk.'] : []
        };
      }
      const p = v.p / 100;
      if (v.wat === 'm2o' && p >= 1) return { fout: 'Een marge moet onder de 100% liggen.' };
      if (v.wat === 'o2m' && p <= -1) return { fout: 'Een opslag van −100% of lager kan niet.' };
      const uit = v.wat === 'o2m' ? p / (1 + p) : p / (1 - p);
      const ip = 100, vp = v.wat === 'o2m' ? ip * (1 + p) : ip / (1 - p);
      return {
        lbl: v.wat === 'o2m' ? 'Bijbehorende marge' : 'Bijbehorende opslag', groot: fmt.pct(uit * 100),
        onder: fmt.pct(v.p) + (v.wat === 'o2m' ? ' opslag' : ' marge'),
        rijen: [
          ['Voorbeeld: inkoopprijs', fmt.euro(ip)],
          ['Verkoopprijs', fmt.euro(vp)],
          ['Brutowinst', fmt.euro(vp - ip), 'som']
        ]
      };
    },
    uitleg: 'Marge = winst / verkoopprijs. Opslag = winst / inkoopprijs. Omrekenen: marge = opslag / (1 + opslag) en opslag = marge / (1 − marge).',
    letop: 'De marge is altijd lager dan de opslag (bij positieve winst). Branchecijfers worden soms als marge en soms als opslag gepubliceerd; vergelijk dus geen appels met peren.'
  });

  RT.add({
    id: 'korting-en-marge', groep: 'ondernemer', naam: 'Korting en marge',
    intro: 'Een korting gaat volledig van de winst af. Hoeveel winst blijft er over, en hoeveel meer moet u verkopen om dat goed te maken?',
    kw: 'korting actie marge winst afzet extra omzet',
    velden: [
      { k: 'vp', l: 'Normale verkoopprijs', s: 'bedrag', std: 100 },
      { k: 'ip', l: 'Inkoopprijs', s: 'bedrag', std: 65 },
      { k: 'k', l: 'Korting', s: 'pct', std: 10 }
    ],
    bereken(v) {
      if (v.vp <= 0) return { fout: 'Vul een verkoopprijs groter dan nul in.' };
      const w0 = v.vp - v.ip, vp1 = v.vp * (1 - v.k / 100), w1 = vp1 - v.ip;
      if (w0 <= 0) return { fout: 'Zonder korting is er al geen winst; een korting maakt het verlies groter.' };
      const extra = w1 > 0 ? (w0 / w1 - 1) * 100 : Infinity;
      return {
        lbl: 'Extra afzet nodig voor dezelfde winst', groot: Number.isFinite(extra) ? fmt.pct(extra, 1) : 'niet haalbaar',
        onder: Number.isFinite(extra) ? 'meer stuks verkopen dan zonder korting' : 'met deze korting is er geen winst meer per stuk',
        rijen: [
          ['Winst per stuk zonder korting', fmt.euro(w0)],
          ['Verkoopprijs na korting', fmt.euro(vp1)],
          ['Winst per stuk na korting', fmt.euro(w1), 'som'],
          ['Marge zonder korting', fmt.pct(w0 / v.vp * 100)],
          ['Marge na korting', vp1 > 0 ? fmt.pct(w1 / vp1 * 100) : '–'],
          ['Deel van de winst dat verdwijnt', fmt.pct((1 - w1 / w0) * 100, 1)]
        ]
      };
    },
    uitleg: 'Met marge m en korting k (beide als deel van de verkoopprijs) is de extra afzet die nodig is voor dezelfde totale winst m / (m − k) − 1. Voorbeeld: 35% marge en 10% korting vraagt 40% meer afzet.',
    letop: 'Er is aangenomen dat de inkoopprijs per stuk gelijk blijft en dat er geen extra kosten (reclame, verzending) bij komen. Een korting op een product met lage marge is snel verliesgevend.'
  });

  RT.add({
    id: 'marge-webwinkel', groep: 'ondernemer', naam: 'Marge per verkoop in een webwinkel',
    intro: 'Wat blijft er per bestelling over na inkoop, verzending, betaalkosten, platformkosten en retouren?',
    kw: 'webwinkel webshop marge verzendkosten retour platform marketplace betaalkosten',
    fiscaal: ['btw-tarieven'], peildatum: N.peildatum,
    velden: [
      { k: 'vp', l: 'Verkoopprijs inclusief btw', s: 'bedrag', std: 79.95 },
      { k: 'btw', l: 'Btw-tarief', s: 'pct', std: N.btw.hoog },
      { k: 'ip', l: 'Inkoopprijs exclusief btw', s: 'bedrag', std: 32 },
      { k: 'verz', l: 'Verzendkosten per pakket', s: 'bedrag', std: 5.75, opt: true },
      { k: 'bijdr', l: 'Verzendbijdrage van de klant (excl. btw)', s: 'bedrag', std: 0, opt: true },
      { k: 'bet', l: 'Betaalkosten', s: 'pct', std: 1.8, opt: true, tip: 'Percentage van de verkoopprijs excl. btw.' },
      { k: 'plat', l: 'Platform- of advertentiekosten', s: 'pct', std: 12, opt: true, tip: 'Percentage van de verkoopprijs excl. btw.' },
      { k: 'ret', l: 'Deel van de bestellingen dat retour komt', s: 'pct', std: 8, opt: true },
      { k: 'retk', l: 'Kosten per retour (excl. heenzending)', s: 'bedrag', std: 7.5, opt: true }
    ],
    bereken(v) {
      const ex = v.vp / (1 + v.btw / 100);
      const betaal = ex * v.bet / 100, platform = ex * v.plat / 100, verzNetto = v.verz - v.bijdr;
      const retour = v.ret / 100 * (v.retk + v.verz);
      const kosten = v.ip + verzNetto + betaal + platform + retour;
      const winst = ex - kosten;
      const variabelPct = (v.bet + v.plat) / 100;
      const breakEvenEx = variabelPct < 1 ? (v.ip + verzNetto + retour) / (1 - variabelPct) : NaN;
      return {
        lbl: 'Winst per verkoop', groot: fmt.euro(winst), onder: 'marge ' + fmt.pct(winst / ex * 100, 1) + ' van de prijs exclusief btw',
        rijen: [
          ['Verkoopprijs exclusief btw', fmt.euro(ex)],
          ['Inkoop', fmt.euro(-v.ip)],
          ['Verzending (na bijdrage klant)', fmt.euro(-verzNetto)],
          ['Betaalkosten', fmt.euro(-betaal)],
          ['Platform- en advertentiekosten', fmt.euro(-platform)],
          ['Retouren (gemiddeld per verkoop)', fmt.euro(-retour)],
          ['Winst per verkoop', fmt.euro(winst), 'som'],
          ['Break-even verkoopprijs incl. btw', fmt.euro(breakEvenEx * (1 + v.btw / 100))]
        ],
        signalen: winst < 0 ? ['Elke verkoop kost geld. Verhoog de prijs, verlaag de kosten of vraag een verzendbijdrage.'] : []
      };
    },
    uitleg: 'Winst = prijs excl. btw − inkoop − (verzendkosten − bijdrage klant) − betaal- en platformkosten (percentage van de prijs excl. btw) − retourpercentage × (retourkosten + verzendkosten). Break-even: de prijs waarbij die winst nul is.',
    letop: 'Bij een retour is aangenomen dat het product weer verkocht kan worden; afgeschreven retouren maken de uitkomst slechter. Vaste kosten (software, opslag, eigen uren) zitten er niet in.'
  });

  RT.add({
    id: 'betalingskorting-rendement', groep: 'ondernemer', naam: 'Betalingskorting als rendement',
    intro: 'Een leverancier biedt korting bij snelle betaling. Welk rendement op jaarbasis levert eerder betalen op?',
    kw: 'betalingskorting krediettermijn vooruitbetalen korting contant rendement',
    velden: [
      { k: 'b', l: 'Factuurbedrag', s: 'eur', std: 25000 },
      { k: 'k', l: 'Korting bij snelle betaling', s: 'pct', std: 2 },
      { k: 'd', l: 'Zoveel dagen eerder betalen', s: 'num', na: 'dagen', std: 22, tip: 'Bijvoorbeeld 30 dagen termijn, korting binnen 8 dagen: 22 dagen.' }
    ],
    bereken(v) {
      if (v.d <= 0) return { fout: 'Vul een aantal dagen groter dan nul in.' };
      if (v.k <= 0 || v.k >= 100) return { fout: 'Vul een korting tussen 0% en 100% in.' };
      const r = Math.pow(1 / (1 - v.k / 100), 365 / v.d) - 1;
      const enk = v.k / (100 - v.k) * 365 / v.d * 100;
      return {
        lbl: 'Rendement op jaarbasis', groot: fmt.pct(r * 100, 1), onder: 'samengesteld; enkelvoudig ' + fmt.pct(enk, 1),
        rijen: [
          ['Korting in euro', fmt.euro(v.b * v.k / 100)],
          ['Te betalen met korting', fmt.euro(v.b * (1 - v.k / 100))],
          ['Rendement op jaarbasis', fmt.pct(r * 100, 2), 'som']
        ],
        signalen: ['Kost lenen (rekening-courant) minder dan ' + fmt.pct(r * 100, 1) + ' per jaar, dan loont het om de korting te pakken.']
      };
    },
    uitleg: 'U betaalt (1 − korting) in plaats van 1, een bepaald aantal dagen eerder. Rendement op jaarbasis = (1 / (1 − korting))<sup>365 / dagen</sup> − 1. Enkelvoudig: korting / (1 − korting) × 365 / dagen.',
    letop: 'Omgekeerd geldt hetzelfde: wie zelf betalingskorting geeft, betaalt dit rendement aan zijn klant. Houd ook rekening met de eigen liquiditeit.'
  });

  /* ===================================================== btw */

  RT.add({
    id: 'btw-tariefwijziging', groep: 'ondernemer', naam: 'Prijs na wijziging btw-tarief',
    intro: 'Het btw-tarief op uw product verandert. Wat wordt de consumentenprijs, of wat kost het u aan marge als de prijs gelijk blijft?',
    kw: 'btw tariefwijziging prijs 9% 21% verhoging marge consumentenprijs',
    fiscaal: true,
    velden: [
      { k: 'p', l: 'Huidige prijs inclusief btw', s: 'bedrag', std: 100 },
      { k: 't1', l: 'Huidig btw-tarief', s: 'pct', std: N.btw.laag },
      { k: 't2', l: 'Nieuw btw-tarief', s: 'pct', std: N.btw.hoog },
      { k: 'ip', l: 'Kostprijs exclusief btw', s: 'bedrag', std: 55, opt: true }
    ],
    bereken(v) {
      const ex = v.p / (1 + v.t1 / 100);
      const nieuw = ex * (1 + v.t2 / 100);
      const exGelijk = v.p / (1 + v.t2 / 100);
      return {
        lbl: 'Nieuwe prijs inclusief btw', groot: fmt.euro(nieuw), onder: 'bij een gelijke prijs exclusief btw',
        rijen: [
          ['Prijs exclusief btw', fmt.euro(ex)],
          ['Prijsverandering voor de klant', fmt.plus(fmt.euro(nieuw - v.p)) + ' (' + fmt.pct((nieuw / v.p - 1) * 100, 1) + ')', 'som'],
          ['Als de klantprijs gelijk blijft: prijs excl. btw', fmt.euro(exGelijk)],
          ['Opbrengstverlies per stuk', fmt.euro(ex - exGelijk)],
          ['Marge nu', v.ip ? fmt.pct((ex - v.ip) / ex * 100, 1) : '–'],
          ['Marge bij gelijke klantprijs', v.ip ? fmt.pct((exGelijk - v.ip) / exGelijk * 100, 1) : '–']
        ]
      };
    },
    uitleg: 'Nieuwe prijs inclusief = oude prijs inclusief / (1 + oud tarief) × (1 + nieuw tarief). Blijft de klantprijs gelijk, dan daalt de opbrengst exclusief btw naar oude prijs / (1 + nieuw tarief).',
    letop: 'Bepalend is het tarief op het moment van de prestatie (levering of dienst), niet de factuurdatum. Bij een vooruitbetaling vóór de wijziging kan een correctie nodig zijn. Controleer het tarief dat op uw prestatie van toepassing is.'
  });

  RT.add({
    id: 'btw-saldo-aangifte', groep: 'ondernemer', naam: 'Saldo btw-aangifte',
    intro: 'Hoeveel btw moet u over een aangiftetijdvak betalen of krijgt u terug?',
    kw: 'btw aangifte voorbelasting afdragen terugvragen kwartaal saldo',
    fiscaal: ['btw-tarieven'], peildatum: N.peildatum,
    velden: [
      { k: 'oh', l: 'Omzet tegen ' + N.btw.hoog + '% (excl. btw)', s: 'eur', std: 60000, opt: true },
      { k: 'ol', l: 'Omzet tegen ' + N.btw.laag + '% (excl. btw)', s: 'eur', std: 0, opt: true },
      { k: 'on', l: 'Omzet 0%, verlegd of naar het buitenland', s: 'eur', std: 5000, opt: true },
      { k: 'ih', l: 'Inkopen en kosten met ' + N.btw.hoog + '% btw (excl. btw)', s: 'eur', std: 18000, opt: true },
      { k: 'il', l: 'Inkopen en kosten met ' + N.btw.laag + '% btw (excl. btw)', s: 'eur', std: 0, opt: true },
      { k: 'verl', l: 'Verlegde btw en verwervingen uit de EU (excl. btw)', s: 'eur', std: 0, opt: true, tip: 'Deze btw geeft u aan en trekt u in de regel ook weer af (tegen het algemene tarief).' },
      { k: 'pr', l: 'Correctie privégebruik (btw-bedrag)', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const h = N.btw.hoog / 100, l = N.btw.laag / 100;
      const verschuldigd = v.oh * h + v.ol * l + v.verl * h + v.pr;
      const voorbelasting = v.ih * h + v.il * l + v.verl * h;
      const saldo = verschuldigd - voorbelasting;
      return {
        lbl: saldo >= 0 ? 'Te betalen' : 'Terug te vragen', groot: fmt.euro(Math.abs(saldo)), onder: 'saldo van dit aangiftetijdvak',
        rijen: [
          ['Btw over omzet ' + N.btw.hoog + '%', fmt.euro(v.oh * h)],
          ['Btw over omzet ' + N.btw.laag + '%', fmt.euro(v.ol * l)],
          ['Verlegde btw en EU-verwervingen', fmt.euro(v.verl * h)],
          ['Correctie privégebruik', fmt.euro(v.pr)],
          ['Totaal verschuldigd', fmt.euro(verschuldigd)],
          ['Voorbelasting', fmt.euro(-voorbelasting)],
          ['Saldo', fmt.euro(saldo), 'som']
        ],
        signalen: v.on > 0 ? ['Omzet tegen 0% of met verlegging geeft u wel op in de aangifte (en bij EU-leveringen ook in de opgaaf intracommunautaire prestaties), maar er hoort geen btw bij.'] : []
      };
    },
    uitleg: 'Saldo = btw over de omzet + verlegde btw + correctie privégebruik − voorbelasting (btw op inkopen en kosten, plus de verlegde btw die u mag aftrekken).',
    letop: 'Alleen btw op zakelijke kosten met een factuur op naam is aftrekbaar. Voor sommige kosten (bijvoorbeeld relatiegeschenken boven de drempel) geldt een beperking. Doet u mee aan de kleineondernemersregeling, dan doet u geen gewone aangifte; zie de rekenhulp Kleineondernemersregeling. Indicatief: de btw-tarieven staan nog niet in het centrale normenbestand.'
  });

  RT.add({
    id: 'btw-pro-rata', groep: 'ondernemer', naam: 'Btw-aftrek naar verhouding (pro rata)',
    intro: 'Heeft u zowel belaste als vrijgestelde omzet? Dan mag u de btw op algemene kosten maar voor een deel aftrekken.',
    kw: 'btw pro rata vrijgestelde omzet gemengd aftrek voorbelasting verhouding',
    fiscaal: true,
    velden: [
      { k: 'ob', l: 'Belaste omzet', s: 'eur', std: 180000 },
      { k: 'ov', l: 'Vrijgestelde omzet', s: 'eur', std: 60000 },
      { k: 'vb', l: 'Btw op algemene (gemengde) kosten', s: 'eur', std: 12000 },
      { k: 'dir', l: 'Btw die direct bij belaste omzet hoort', s: 'eur', std: 8000, opt: true },
      { k: 'm', l: 'Verdeelsleutel', s: 'keuze', opties: [['omzet', 'Naar omzetverhouding'], ['gebruik', 'Naar werkelijk gebruik']], std: 'omzet' },
      { k: 'geb', l: 'Werkelijk gebruik voor belaste omzet', s: 'pct', std: 80, als: v => v.m === 'gebruik' }
    ],
    bereken(v) {
      const tot = v.ob + v.ov;
      if (tot <= 0) return { fout: 'Vul de omzet in.' };
      const ratio = v.m === 'omzet' ? v.ob / tot : Math.min(1, pos(v.geb / 100));
      const aftrek = v.vb * ratio + v.dir;
      return {
        lbl: 'Aftrekbare voorbelasting', groot: fmt.euro0(aftrek), onder: 'verdeelsleutel ' + fmt.pct(ratio * 100, 1),
        rijen: [
          ['Aandeel belaste omzet', fmt.pct(v.ob / tot * 100, 1)],
          ['Aftrekbaar deel algemene kosten', fmt.euro0(v.vb * ratio)],
          ['Direct toerekenbaar aan belaste omzet', fmt.euro0(v.dir)],
          ['Totaal aftrekbaar', fmt.euro0(aftrek), 'som'],
          ['Niet aftrekbaar (wordt kosten)', fmt.euro0(v.vb + v.dir - aftrek)]
        ]
      };
    },
    uitleg: 'Btw die direct aan belaste omzet toe te rekenen is, is volledig aftrekbaar; btw bij vrijgestelde omzet niet. Btw op gemengde kosten: aftrek = btw × belaste omzet / totale omzet. Geeft het werkelijke gebruik een nauwkeuriger beeld, dan kan dat als verdeelsleutel dienen.',
    letop: 'De verhouding wordt in de praktijk eerst voorlopig toegepast en aan het eind van het jaar herrekend. Afwijken van de omzetverhouding moet onderbouwd zijn; de Belastingdienst of de ondernemer kan dat verlangen. Voor investeringsgoederen geldt daarna nog de herzieningsregeling.'
  });

  RT.add({
    id: 'btw-herziening-investering', groep: 'ondernemer', naam: 'Herziening btw op investeringen',
    intro: 'Verandert het gebruik van een pand of bedrijfsmiddel binnen de herzieningstermijn, dan moet een deel van de afgetrokken btw worden herzien.',
    kw: 'btw herziening investering onroerend roerend herzieningstermijn pand',
    fiscaal: true,
    velden: [
      { k: 'vb', l: 'Btw bij aanschaf', s: 'eur', std: 84000 },
      { k: 's', l: 'Soort investering', s: 'keuze', opties: [['or', 'Onroerende zaak (10 jaar)'], ['ro', 'Roerende zaak waarop wordt afgeschreven (5 jaar)']], std: 'or' },
      { k: 'p0', l: 'Aftrek in het jaar van ingebruikname', s: 'pct', std: 100 },
      { k: 'p1', l: 'Aftrekrecht in dit jaar', s: 'pct', std: 70 },
      { k: 'jr', l: 'Welk jaar na ingebruikname?', s: 'num', std: 3, tip: '1 = het jaar van ingebruikname zelf (afgerekend in de eerste herziening).' }
    ],
    bereken(v) {
      const n = v.s === 'or' ? 10 : 5, jr = Math.round(v.jr);
      if (jr < 1) return { fout: 'Vul een jaar van 1 of hoger in.' };
      const perJaar = v.vb / n, delta = (v.p0 - v.p1) / 100;
      const binnen = jr <= n;
      const klein = Math.abs(v.p0 - v.p1) < 10;
      const herz = binnen && !klein ? perJaar * delta : 0;
      const rest = binnen ? n - jr : 0;
      return {
        lbl: herz >= 0 ? 'Terug te betalen btw dit jaar' : 'Extra aftrek dit jaar', groot: fmt.euro0(Math.abs(herz)),
        onder: !binnen ? 'buiten de herzieningstermijn' : klein ? 'afwijking kleiner dan 10 procentpunt' : 'jaar ' + jr + ' van ' + n,
        rijen: [
          ['Herzieningstermijn', n + ' jaar'],
          ['Btw per herzieningsjaar', fmt.euro0(perJaar)],
          ['Verschil in aftrekrecht', fmt.pct(v.p0 - v.p1, 1)],
          ['Resterende jaren na dit jaar', fmt.getal(rest)],
          ['Bij gelijk gebruik nog te herzien', fmt.euro0(klein ? 0 : rest * perJaar * delta), 'som']
        ],
        signalen: klein && binnen ? ['Bij een afwijking van minder dan 10 procentpunt vindt geen herziening plaats.'] : []
      };
    },
    uitleg: 'De btw op een investeringsgoed wordt verdeeld over de herzieningstermijn: 10 jaar voor onroerende zaken, 5 jaar voor roerende zaken waarop wordt afgeschreven. Per jaar: herziening = (btw / termijn) × (aftrekpercentage bij ingebruikname − aftrekpercentage dit jaar).',
    letop: 'Bij verkoop of overgang naar volledig vrijgesteld gebruik binnen de termijn wordt de resterende herziening in één keer berekend. Voor onroerende zaken gelden aanvullende regels (bijvoorbeeld bij een herzieningsplichtige levering). Laat de herziening controleren door een fiscalist.'
  });

  RT.add({
    id: 'kleineondernemersregeling', groep: 'ondernemer', naam: 'Kleineondernemersregeling',
    intro: 'Loont het om mee te doen aan de vrijstelling voor kleine ondernemers (KOR)? U rekent dan geen btw, maar trekt ook geen btw af.',
    kw: 'kor kleineondernemersregeling btw vrijstelling omzetgrens',
    fiscaal: ['omzetgrens KOR'], peildatum: N.peildatum,
    velden: [
      { k: 'omzet', l: 'Verwachte jaaromzet (excl. btw)', s: 'eur', std: 16000 },
      { k: 't', l: 'Btw-tarief op uw omzet', s: 'pct', std: N.btw.hoog },
      { k: 'kost', l: 'Inkopen en kosten met btw (excl. btw)', s: 'eur', std: 3500, opt: true },
      { k: 'tk', l: 'Btw-tarief op inkopen', s: 'pct', std: N.btw.hoog },
      { k: 'inv', l: 'Geplande investering (excl. btw)', s: 'eur', std: 0, opt: true },
      { k: 'klant', l: 'Uw klanten zijn vooral', s: 'keuze', opties: [['part', 'Particulieren'], ['zak', 'Btw-plichtige ondernemers']], std: 'part' }
    ],
    bereken(v) {
      const binnen = v.omzet <= N.korGrens;
      const btwOmzet = v.omzet * v.t / 100, voorbelasting = (v.kost + v.inv) * v.tk / 100;
      // Particulieren: de prijs blijft gelijk, dus de niet-afgedragen btw blijft bij u. Ondernemers verrekenen btw en betalen u dus net zoveel exclusief.
      const effect = v.klant === 'part' ? btwOmzet - voorbelasting : -voorbelasting;
      return {
        lbl: 'Financieel effect van de KOR per jaar', groot: fmt.plus(fmt.euro0(effect)),
        onder: !binnen ? 'let op: omzet boven de grens, KOR is niet mogelijk' : effect > 0 ? 'voordeel ten opzichte van btw rekenen' : 'nadeel ten opzichte van btw rekenen',
        rijen: [
          ['Omzetgrens', fmt.euro0(N.korGrens)],
          ['Binnen de grens?', binnen ? 'ja' : 'nee'],
          ['Btw over de omzet die u niet afdraagt', fmt.euro0(btwOmzet)],
          ['Voorbelasting die u niet meer aftrekt', fmt.euro0(-voorbelasting)],
          ['Per saldo', fmt.plus(fmt.euro0(effect)), 'som']
        ],
        signalen: [v.klant === 'zak' ? 'Zakelijke klanten kunnen btw verrekenen. Voor hen bent u met de KOR niet goedkoper, en u mist de aftrek: de KOR levert dan alleen nadeel op.' : 'Uitgangspunt: uw prijzen voor particulieren blijven gelijk, zodat de btw die u niet afdraagt bij u blijft.']
          .concat(binnen ? [] : ['Boven de omzetgrens is de KOR niet toegestaan; overschrijdt u de grens in de loop van het jaar, dan rekent u vanaf dat moment weer btw.'])
      };
    },
    uitleg: 'Met de KOR rekent u geen btw en doet u geen gewone btw-aangifte, maar u trekt ook geen voorbelasting af. Effect = btw over de omzet (alleen een voordeel bij particuliere klanten) − gemiste voorbelasting op kosten en investeringen.',
    letop: 'Bij aanmelding moet btw die eerder is afgetrokken op investeringsgoederen mogelijk worden herzien; zie de rekenhulp Herziening btw op investeringen. Aanmelden moet tijdig vóór het tijdvak waarin u wilt starten; controleer de actuele termijnen en voorwaarden (ook voor omzet in andere EU-landen). Indicatief: de omzetgrens staat nog niet in het centrale normenbestand; controleer de actuele norm.'
  });

  /* ===================================================== zzp en ib-ondernemer */

  RT.add({
    id: 'declarabele-uren', groep: 'ondernemer', naam: 'Declarabele uren per jaar',
    intro: 'Hoeveel uur per jaar kunt u realistisch factureren na vakantie, feestdagen, ziekte en niet-declarabel werk?',
    kw: 'declarabele uren productiviteit zzp facturabel beschikbaar',
    velden: [
      { k: 'wk', l: 'Weken per jaar', s: 'num', std: 52 },
      { k: 'dg', l: 'Werkdagen per week', s: 'num', std: 5 },
      { k: 'u', l: 'Uren per werkdag', s: 'num', na: 'uur', std: 8 },
      { k: 'vak', l: 'Vakantiedagen', s: 'num', na: 'dagen', std: 25, opt: true },
      { k: 'fd', l: 'Feestdagen op een werkdag', s: 'num', na: 'dagen', std: feestOpWerkdag(2026), opt: true, tip: 'In 2026 vallen ' + feestOpWerkdag(2026) + ' erkende feestdagen op een doordeweekse dag.' },
      { k: 'ziek', l: 'Ziektedagen', s: 'num', na: 'dagen', std: 5, opt: true },
      { k: 'nd', l: 'Niet-declarabel deel', s: 'pct', std: 25, tip: 'Acquisitie, administratie, opleiding, reistijd.' }
    ],
    bereken(v) {
      const dagen = v.wk * v.dg - v.vak - v.fd - v.ziek;
      if (dagen <= 0 || v.u <= 0) return { fout: 'Er blijven geen werkdagen over; controleer de invoer.' };
      const besch = dagen * v.u, dec = besch * (1 - v.nd / 100);
      return {
        lbl: 'Declarabele uren per jaar', groot: fmt.getal(dec), onder: fmt.getal(dec / 12, 1) + ' per maand',
        rijen: [
          ['Werkdagen', fmt.getal(dagen)],
          ['Beschikbare uren', fmt.getal(besch)],
          ['Niet-declarabele uren', fmt.getal(besch - dec)],
          ['Declarabel per werkweek (' + fmt.getal(dagen / v.dg, 1) + ' weken)', fmt.getal(dec / (dagen / v.dg), 1)],
          ['Declarabele uren', fmt.getal(dec), 'som']
        ],
        signalen: besch >= NM.ondernemer.urencriterium ? [] : ['Minder dan ' + fmt.getal(NM.ondernemer.urencriterium) + ' werkuren: het urencriterium voor de ondernemersaftrek wordt dan niet gehaald. Voor het urencriterium tellen ook niet-declarabele uren mee.']
      };
    },
    uitleg: 'Werkdagen = weken × dagen per week − vakantie − feestdagen − ziekte. Beschikbare uren = werkdagen × uren per dag. Declarabel = beschikbare uren × (1 − niet-declarabel deel).',
    letop: 'Startende zelfstandigen halen vaak een lager declarabel percentage dan gedacht: reken eerder met 50 tot 70% dan met 90%. Voor het urencriterium tellen alle uren voor de onderneming, niet alleen de gefactureerde.'
  });

  // Gemeenschappelijk: winst die nodig is voor een gewenst netto inkomen (na IB en Zvw-bijdrage)
  const winstVoorNetto = (netto, opt) => fin.zoekNul(w => F.ondernemer(w, opt).netto - (opt.aftrek || 0) - netto, 0, 5e6);

  RT.add({
    id: 'uurtarief-zzp', groep: 'ondernemer', naam: "Uurtarief voor zzp'ers",
    intro: 'Welk uurtarief is nodig om na kosten, voorzieningen en belasting het gewenste netto inkomen over te houden?',
    kw: 'uurtarief zzp tarief freelancer omzet netto inkomen',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'net', l: 'Gewenst netto besteedbaar inkomen per jaar', s: 'eur', std: 48000 },
      { k: 'kost', l: 'Zakelijke kosten per jaar', s: 'eur', std: 9000, opt: true },
      { k: 'voorz', l: 'AOV- en pensioenpremie per jaar', s: 'eur', std: 7500, opt: true, tip: 'Hier als aftrekbaar behandeld (AOV-premie en lijfrente binnen de jaarruimte).' },
      { k: 'uren', l: 'Declarabele uren per jaar', s: 'num', na: 'uur', std: 1400 },
      { k: 'leeg', l: 'Reserve voor leegloop', s: 'pct', std: 10, opt: true, tip: 'Deel van de uren dat u verwacht niet te kunnen factureren.' },
      { k: 'st', l: 'Recht op startersaftrek?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const urenEff = v.uren * (1 - v.leeg / 100);
      if (urenEff <= 0) return { fout: 'Vul een positief aantal uren in.' };
      const opt = { starter: v.st === 'ja', aftrek: v.voorz };
      const winst = winstVoorNetto(v.net, opt);
      const r = F.ondernemer(winst, opt);
      const omzet = winst + v.kost;
      const tarief = omzet / urenEff;
      return {
        lbl: 'Benodigd uurtarief (excl. btw)', groot: fmt.euro(tarief), onder: fmt.euro0(tarief * 8) + ' per dag van 8 uur',
        rijen: [
          ['Benodigde winst', fmt.euro0(winst)],
          ['Inkomstenbelasting', fmt.euro0(r.heffing)],
          ['Zvw-bijdrage', fmt.euro0(r.zvw)],
          ['AOV en pensioen', fmt.euro0(v.voorz)],
          ['Zakelijke kosten', fmt.euro0(v.kost)],
          ['Benodigde omzet', fmt.euro0(omzet), 'som'],
          ['Te factureren uren (na leegloop)', fmt.getal(urenEff)]
        ]
      };
    },
    uitleg: 'Eerst wordt de winst gezocht waarbij winst − inkomstenbelasting − Zvw-bijdrage − premies precies het gewenste netto inkomen geeft, met zelfstandigenaftrek, eventueel startersaftrek, mkb-winstvrijstelling en de algemene en arbeidskorting. Omzet = winst + kosten. Uurtarief = omzet / (declarabele uren × (1 − leegloop)).',
    letop: 'Uitgegaan is van het urencriterium (ondernemersaftrek), geen fiscale partner en geen ander inkomen. Lijfrentepremie is alleen aftrekbaar binnen de jaarruimte. Btw komt er nog bovenop bij btw-plichtige diensten. Houd rekening met de afbouw van de zelfstandigenaftrek in de komende jaren.'
  });

  RT.add({
    id: 'benodigde-uren-zzp', groep: 'ondernemer', naam: 'Hoeveel uur moet ik declareren',
    intro: 'Bij een gegeven uurtarief: hoeveel uur moet u factureren voor het netto inkomen dat u wilt?',
    kw: 'uren declareren zzp uurtarief netto inkomen urencriterium',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'net', l: 'Gewenst netto inkomen per jaar', s: 'eur', std: 48000 },
      { k: 'kost', l: 'Zakelijke kosten per jaar', s: 'eur', std: 12000, opt: true },
      { k: 'tar', l: 'Uurtarief (excl. btw)', s: 'bedrag', std: 85 },
      { k: 'wk', l: 'Werkweken per jaar', s: 'num', std: 46 },
      { k: 'st', l: 'Recht op startersaftrek?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      if (v.tar <= 0 || v.wk <= 0) return { fout: 'Vul een uurtarief en een aantal werkweken groter dan nul in.' };
      const opt = { starter: v.st === 'ja' };
      const winst = winstVoorNetto(v.net, opt);
      const r = F.ondernemer(winst, opt);
      const omzet = winst + v.kost, uren = omzet / v.tar;
      return {
        lbl: 'Te declareren uren per jaar', groot: fmt.getal(uren), onder: fmt.getal(uren / v.wk, 1) + ' uur per werkweek',
        rijen: [
          ['Benodigde winst', fmt.euro0(winst)],
          ['Belasting en Zvw-bijdrage', fmt.euro0(r.heffing + r.zvw)],
          ['Benodigde omzet', fmt.euro0(omzet), 'som'],
          ['Per maand', fmt.getal(uren / 12, 1) + ' uur'],
          ['Bij 10% hoger tarief', fmt.getal(omzet / (v.tar * 1.1)) + ' uur']
        ],
        signalen: [uren >= NM.ondernemer.urencriterium ? 'Met deze declarabele uren alleen haalt u het urencriterium al.' : 'Het urencriterium (' + fmt.getal(NM.ondernemer.urencriterium) + ' uur) gaat over álle uren voor de onderneming; niet-declarabele uren tellen mee. Haalt u het niet, dan vervalt de ondernemersaftrek en is meer omzet nodig.']
      };
    },
    uitleg: 'De benodigde winst wordt gezocht waarbij winst − inkomstenbelasting − Zvw-bijdrage gelijk is aan het gewenste netto inkomen (met zelfstandigenaftrek en mkb-winstvrijstelling). Uren = (winst + kosten) / uurtarief.',
    letop: 'Uitgegaan is van het urencriterium, geen fiscale partner en geen ander inkomen. Premies voor AOV of pensioen zijn hier niet meegenomen; neem ze op bij de kosten of gebruik de rekenhulp Uurtarief voor zzp\'ers.'
  });

  const ondRijen = r => [
    ['Winst', fmt.euro0(r.winst)],
    ['Ondernemersaftrek', fmt.euro0(-r.ondernemersaftrek)],
    ['Mkb-winstvrijstelling', fmt.euro0(-r.mkbVrijstelling)],
    ['Belastbare winst', fmt.euro0(r.belastbareWinst)],
    ['Inkomstenbelasting na heffingskortingen', fmt.euro0(r.heffing)],
    ['Zvw-bijdrage', fmt.euro0(r.zvw)]
  ];

  RT.add({
    id: 'netto-inkomen-zzp', groep: 'ondernemer', naam: 'Netto inkomen zzp',
    intro: 'Van omzet naar besteedbaar inkomen: winst, ondernemersfaciliteiten, inkomstenbelasting, Zvw-bijdrage en premies.',
    kw: 'netto inkomen zzp omzet winst besteedbaar zelfstandigenaftrek',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'omzet', l: 'Omzet per jaar (excl. btw)', s: 'eur', std: 90000 },
      { k: 'kost', l: 'Zakelijke kosten', s: 'eur', std: 12000, opt: true },
      { k: 'aov', l: 'AOV-premie', s: 'eur', std: 4200, opt: true },
      { k: 'lijf', l: 'Lijfrentepremie', s: 'eur', std: 3000, opt: true, tip: 'Aftrekbaar binnen de jaarruimte.' },
      { k: 'st', l: 'Recht op startersaftrek?', s: 'keuze', opties: JANEE, std: 'nee' },
      { k: 'kind', l: 'Kind jonger dan 12 (combinatiekorting)?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const winst = v.omzet - v.kost, aftrek = v.aov + v.lijf;
      const r = F.ondernemer(winst, { starter: v.st === 'ja', kind: v.kind === 'ja', aftrek });
      const besteedbaar = r.netto - aftrek;
      return {
        lbl: 'Besteedbaar per jaar', groot: fmt.euro0(besteedbaar), onder: fmt.euro0(besteedbaar / 12) + ' per maand',
        rijen: ondRijen(r).concat([
          ['Netto na belasting', fmt.euro0(r.netto)],
          ['AOV- en lijfrentepremie (aftrekbaar)', fmt.euro0(-aftrek)],
          ['Besteedbaar', fmt.euro0(besteedbaar), 'som'],
          ['Belasting en Zvw als deel van de winst', fmt.pct(r.druk, 1)]
        ])
      };
    },
    uitleg: 'Winst = omzet − kosten. Daarop gaan de zelfstandigenaftrek (en eventueel startersaftrek) en daarna de mkb-winstvrijstelling af. Over de belastbare winst min AOV- en lijfrentepremie wordt box 1-belasting berekend, verminderd met de algemene heffingskorting, arbeidskorting en eventueel combinatiekorting. De Zvw-bijdrage komt erbij.',
    letop: 'Uitgegaan is van het urencriterium, geen fiscale partner en geen ander inkomen. De zelfstandigenaftrek wordt de komende jaren verder afgebouwd. Toeslagen, voorlopige aanslagen en box 3 zijn niet meegenomen.'
  });

  RT.add({
    id: 'netto-uit-winst', groep: 'ondernemer', naam: 'Netto inkomen uit winst',
    intro: 'Wat houdt een ib-ondernemer netto over van de winst, met of zonder urencriterium en na de AOW-leeftijd?',
    kw: 'netto winst ib-ondernemer eenmanszaak urencriterium marginale druk',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'w', l: 'Winst uit onderneming', s: 'eur', std: 85000 },
      { k: 'uc', l: 'Urencriterium gehaald?', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'st', l: 'Recht op startersaftrek?', s: 'keuze', opties: JANEE, std: 'nee', als: v => v.uc === 'ja' },
      { k: 'aow', l: 'AOW-leeftijd bereikt?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const opt = { urencriterium: v.uc === 'ja', starter: v.uc === 'ja' && v.st === 'ja', aow: v.aow === 'ja' };
      const r = F.ondernemer(v.w, opt);
      const r2 = F.ondernemer(v.w + 1000, opt);
      const marg = (1 - (r2.netto - r.netto) / 1000) * 100;
      return {
        lbl: 'Netto inkomen per jaar', groot: fmt.euro0(r.netto), onder: fmt.euro0(r.netto / 12) + ' per maand',
        rijen: ondRijen(r).concat([
          ['Netto', fmt.euro0(r.netto), 'som'],
          ['Gemiddelde druk op de winst', fmt.pct(r.druk, 1)],
          ['Druk op de volgende € 1.000 winst', fmt.pct(marg, 1)]
        ])
      };
    },
    uitleg: 'Zonder urencriterium vervallen zelfstandigen- en startersaftrek, maar blijft de mkb-winstvrijstelling. Vanaf de AOW-leeftijd geldt een lager tarief in de eerste schijf en een lagere algemene heffingskorting en arbeidskorting. De druk op de volgende € 1.000 laat zien hoeveel van extra winst naar belasting en premie gaat, inclusief afbouw van kortingen.',
    letop: 'Uitgegaan is van geen fiscale partner en geen ander inkomen. Vanaf de AOW-leeftijd geldt de halve zelfstandigenaftrek; die nuance zit niet in deze berekening. Gebruik de uitkomst als indicatie.'
  });

  RT.add({
    id: 'belasting-reserveren-zzp', groep: 'ondernemer', naam: 'Hoeveel omzet opzij voor de belasting',
    intro: 'Welk deel van elke gefactureerde euro moet u apart zetten voor inkomstenbelasting en Zvw-bijdrage?',
    kw: 'reserveren belasting zzp opzij zetten voorlopige aanslag percentage omzet',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'omzet', l: 'Verwachte jaaromzet (excl. btw)', s: 'eur', std: 90000 },
      { k: 'kost', l: 'Verwachte kosten', s: 'eur', std: 12000, opt: true },
      { k: 'st', l: 'Recht op startersaftrek?', s: 'keuze', opties: JANEE, std: 'nee' },
      { k: 'buf', l: 'Extra buffer', s: 'pct', std: 10, opt: true }
    ],
    bereken(v) {
      if (v.omzet <= 0) return { fout: 'Vul een omzet groter dan nul in.' };
      const r = F.ondernemer(v.omzet - v.kost, { starter: v.st === 'ja' });
      const opzij = (r.heffing + r.zvw) * (1 + v.buf / 100);
      return {
        lbl: 'Opzij zetten van de omzet', groot: fmt.pct(opzij / v.omzet * 100, 1), onder: fmt.euro0(opzij / 12) + ' per maand',
        rijen: [
          ['Verwachte winst', fmt.euro0(v.omzet - v.kost)],
          ['Inkomstenbelasting', fmt.euro0(r.heffing)],
          ['Zvw-bijdrage', fmt.euro0(r.zvw)],
          ['Met buffer', fmt.euro0(opzij), 'som'],
          ['Van elke € 1.000 omzet', fmt.euro0(opzij / v.omzet * 1000)]
        ],
        signalen: ['Btw is geen inkomen: zet de btw die u factureert daarnaast volledig apart tot de aangifte.']
      };
    },
    uitleg: 'Belasting en Zvw-bijdrage worden berekend over de verwachte winst (met zelfstandigenaftrek, mkb-winstvrijstelling en heffingskortingen), verhoogd met de buffer en gedeeld door de omzet.',
    letop: 'Een voorlopige aanslag spreidt de betaling over het jaar. Vraag een nieuwe aan als de winst sterk afwijkt van de schatting. Uitgegaan is van het urencriterium, geen fiscale partner en geen ander inkomen.'
  });

  RT.add({
    id: 'ondernemer-naast-loondienst', groep: 'ondernemer', naam: 'Ondernemen naast loondienst',
    intro: 'Wat houdt u netto over aan winst die u naast uw salaris verdient?',
    kw: 'parttime ondernemer loondienst bijverdienen winst naast baan hybride',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'loon', l: 'Bruto jaarloon uit dienstbetrekking', s: 'eur', std: 42000 },
      { k: 'w', l: 'Winst uit onderneming', s: 'eur', std: 15000 },
      { k: 'uc', l: 'Urencriterium gehaald?', s: 'keuze', opties: JANEE, std: 'nee', tip: 'Naast een baan lukt de eis van ' + fmt.getal(NM.ondernemer.urencriterium) + ' uur en meer dan de helft van de werktijd meestal niet.' }
    ],
    bereken(v) {
      const zonder = F.netto(v.loon, { arbeid: v.loon });
      const r = F.ondernemer(v.w, { urencriterium: v.uc === 'ja', ander: v.loon, anderArbeid: v.loon });
      // Zvw-bijdrage: over loon en winst samen geldt één maximum
      const zvw = Math.min(pos(v.w - r.ondernemersaftrek), pos(NM.ondernemer.zvwMaxInkomen - v.loon)) * NM.ondernemer.zvwPct / 100;
      const extraIb = r.heffing - zonder.heffing;
      const nettoWinst = v.w - extraIb - zvw;
      return {
        lbl: 'Netto overgehouden van de winst', groot: fmt.euro0(nettoWinst), onder: fmt.pct(v.w > 0 ? (extraIb + zvw) / v.w * 100 : 0, 1) + ' gaat naar belasting en premie',
        rijen: [
          ['Winst', fmt.euro0(v.w)],
          ['Zelfstandigenaftrek', fmt.euro0(-r.ondernemersaftrek)],
          ['Mkb-winstvrijstelling', fmt.euro0(-r.mkbVrijstelling)],
          ['Belastbare winst bovenop het loon', fmt.euro0(r.belastbareWinst)],
          ['Extra inkomstenbelasting', fmt.euro0(extraIb)],
          ['Zvw-bijdrage over de winst', fmt.euro0(zvw)],
          ['Netto van de winst', fmt.euro0(nettoWinst), 'som'],
          ['Totaal netto (loon en winst)', fmt.euro0(zonder.netto + nettoWinst)]
        ]
      };
    },
    uitleg: 'Eerst wordt de belasting over alleen het loon berekend, daarna over loon plus belastbare winst. Het verschil is de extra inkomstenbelasting door de onderneming: de winst valt bovenop het loon en dus in het hoogste schijftarief dat u bereikt. De Zvw-bijdrage telt alleen voor zover loon en winst samen onder het maximum blijven.',
    letop: 'Startersaftrek en zelfstandigenaftrek gelden alleen als het urencriterium wordt gehaald. Uitgegaan is van geen fiscale partner en geen andere inkomsten. De ingehouden loonheffing over het salaris verandert niet; de extra belasting komt via de aanslag.'
  });

  RT.add({
    id: 'middeling-ondernemer', groep: 'ondernemer', naam: 'Middeling voor ondernemers (historisch)',
    intro: 'Hoeveel had middeling van sterk wisselende winsten over drie jaar opgeleverd? De regeling is afgeschaft; deze hulp is alleen voor het laatste tijdvak en ter illustratie.',
    kw: 'middeling middelingsregeling wisselend inkomen teruggaaf historisch afgeschaft',
    fiscaal: ['box 1-tarieven 2026', 'drempel middeling'], peildatum: N.peildatum,
    velden: [
      { k: 'j1', l: 'Winst jaar 1', s: 'eur', std: 15000, opt: true },
      { k: 'j2', l: 'Winst jaar 2', s: 'eur', std: 60000, opt: true },
      { k: 'j3', l: 'Winst jaar 3', s: 'eur', std: 120000, opt: true }
    ],
    bereken(v) {
      // Belasting over het belastbare inkomen vóór heffingskortingen, zoals bij de herrekening
      const bel = w => F.ondernemer(w, {}).ib.belastingVoorKorting;
      const jaren = [v.j1, v.j2, v.j3];
      const betaald = jaren.reduce((s, w) => s + bel(w), 0);
      const gem = (v.j1 + v.j2 + v.j3) / 3;
      const herrekend = 3 * bel(gem);
      const terug = pos(betaald - herrekend - N.middelingDrempel);
      return {
        lbl: 'Teruggaaf door middeling', groot: fmt.euro0(terug), onder: 'indicatie met tarieven ' + N.peildatum + ', niet met die van 2022–2024',
        rijen: [
          ['Gemiddelde winst', fmt.euro0(gem)],
          ['Belasting over de drie jaren afzonderlijk', fmt.euro0(betaald)],
          ['Belasting na middeling', fmt.euro0(herrekend)],
          ['Verschil', fmt.euro0(betaald - herrekend)],
          ['Drempel', fmt.euro0(-N.middelingDrempel)],
          ['Teruggaaf', fmt.euro0(terug), 'som']
        ],
        tabel: { kop: ['Jaar', 'Winst', 'Belasting vóór kortingen'], rijen: jaren.map((w, i) => ['Jaar ' + (i + 1), fmt.euro0(w), fmt.euro0(bel(w))]) },
        signalen: ['De middelingsregeling is afgeschaft. Het laatste tijdvak dat nog gemiddeld kon worden, was 2022–2024. Voor latere jaren is er geen teruggaaf meer mogelijk.']
      };
    },
    uitleg: 'Per jaar wordt de belasting berekend over de belastbare winst (na ondernemersaftrek en mkb-winstvrijstelling), vóór heffingskortingen. Daarna over drie keer het gemiddelde. Teruggaaf = verschil − drempel.',
    letop: 'Historische regeling: niet meer van toepassing op jaren na 2024. Deze hulp rekent met de tarieven van ' + N.peildatum + ' en geeft dus alleen een indicatie; voor een verzoek over 2022–2024 gelden de tarieven van die jaren. Indicatief: de drempel staat nog niet in het centrale normenbestand. Een verzoek moest binnen 36 maanden na de laatste onherroepelijke aanslag worden ingediend.'
  });

  RT.add({
    id: 'ondernemersaftrek-mkb', groep: 'ondernemer', naam: 'Ondernemersaftrek en mkb-winstvrijstelling',
    intro: 'Hoeveel scheelt de zelfstandigenaftrek, startersaftrek en mkb-winstvrijstelling in de belasting?',
    kw: 'zelfstandigenaftrek startersaftrek mkb-winstvrijstelling ondernemersaftrek urencriterium',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'w', l: 'Winst uit onderneming', s: 'eur', std: 85000 },
      { k: 'uc', l: 'Urencriterium gehaald?', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'st', l: 'Recht op startersaftrek?', s: 'keuze', opties: JANEE, std: 'nee', als: v => v.uc === 'ja' }
    ],
    bereken(v) {
      const r = F.ondernemer(v.w, { urencriterium: v.uc === 'ja', starter: v.uc === 'ja' && v.st === 'ja' });
      const za = Math.min(pos(v.w), v.uc === 'ja' ? NM.ondernemer.zelfstandigenaftrek : 0);
      const sa = r.ondernemersaftrek - za;
      const zonder = F.netto(pos(v.w), { arbeid: pos(v.w) });
      const besparing = zonder.heffing - r.heffing;
      return {
        lbl: 'Belastbare winst', groot: fmt.euro0(r.belastbareWinst), onder: 'besparing inkomstenbelasting ' + fmt.euro0(besparing),
        rijen: [
          ['Winst', fmt.euro0(v.w)],
          ['Zelfstandigenaftrek', fmt.euro0(-za)],
          ['Startersaftrek', fmt.euro0(-sa)],
          ['Mkb-winstvrijstelling (' + fmt.pct(NM.ondernemer.mkbVrijstellingPct, 1) + ')', fmt.euro0(-r.mkbVrijstelling)],
          ['Belastbare winst', fmt.euro0(r.belastbareWinst), 'som'],
          ['Totale faciliteiten', fmt.euro0(r.ondernemersaftrek + r.mkbVrijstelling)],
          ['Minder inkomstenbelasting', fmt.euro0(besparing)]
        ]
      };
    },
    uitleg: 'Volgorde: winst − ondernemersaftrek (zelfstandigenaftrek, eventueel startersaftrek, alleen met urencriterium) − mkb-winstvrijstelling als percentage van het restant. De besparing is het verschil in inkomstenbelasting tussen de winst zonder en met deze faciliteiten.',
    letop: 'De meewerkaftrek en de fiscale oudedagsreserve zijn afgeschaft en zitten niet in deze berekening. De zelfstandigenaftrek wordt de komende jaren verder verlaagd. Vanaf de AOW-leeftijd geldt de halve zelfstandigenaftrek. Startersaftrek kan maximaal drie keer in de eerste vijf jaar.'
  });

  RT.add({
    id: 'kleinschaligheidsaftrek', groep: 'ondernemer', naam: 'Kleinschaligheidsinvesteringsaftrek',
    intro: 'Hoeveel extra aftrek levert een investering in bedrijfsmiddelen op via de kleinschaligheidsinvesteringsaftrek (KIA)?',
    kw: 'kia investeringsaftrek kleinschaligheid bedrijfsmiddelen investering',
    fiscaal: ['KIA-staffel'], peildatum: N.peildatum,
    velden: [
      { k: 'i', l: 'Totaal investeringen in het jaar', s: 'eur', std: 95000 },
      { k: 'tar', l: 'Tarief waartegen de aftrek werkt', s: 'pct', std: NM.box1.tarief2, tip: 'Ib-ondernemer: het schijftarief (na mkb-winstvrijstelling iets lager). Bv: het vpb-tarief.' }
    ],
    bereken(v) {
      const k = N.kia, i = v.i;
      let a = 0;
      if (i > k.ondergrens && i <= k.grensPct) a = i * k.pct / 100;
      else if (i > k.grensPct && i <= k.startAfbouw) a = k.max;
      else if (i > k.startAfbouw && i <= k.bovengrens) a = pos(k.max * (1 - (i - k.startAfbouw) / (k.bovengrens - k.startAfbouw)));
      a = Math.min(a, k.max);
      return {
        lbl: 'Investeringsaftrek', groot: fmt.euro0(a), onder: 'belastingvoordeel ongeveer ' + fmt.euro0(a * v.tar / 100),
        rijen: [
          ['Aftrek als deel van de investering', i > 0 ? fmt.pct(a / i * 100, 1) : '–'],
          ['Belastingvoordeel', fmt.euro0(a * v.tar / 100), 'som'],
          ['Investering na belastingvoordeel', fmt.euro0(i - a * v.tar / 100)]
        ],
        tabel: { titel: 'Staffel (' + N.peildatum + ', te controleren)', kop: ['Investering', 'Aftrek'], rijen: [
          ['t/m ' + fmt.euro0(k.ondergrens), 'geen'],
          [fmt.euro0(k.ondergrens + 1) + ' – ' + fmt.euro0(k.grensPct), fmt.pct(k.pct, 0) + ' van het bedrag'],
          [fmt.euro0(k.grensPct + 1) + ' – ' + fmt.euro0(k.startAfbouw), fmt.euro0(k.max)],
          [fmt.euro0(k.startAfbouw + 1) + ' – ' + fmt.euro0(k.bovengrens), 'aflopend naar nul'],
          ['boven ' + fmt.euro0(k.bovengrens), 'geen']
        ] }
      };
    },
    uitleg: 'De aftrek volgt een staffel over het totaal van de investeringen in een jaar: onder de ondergrens niets, dan een percentage, daarna een vast bedrag en vanaf de afbouwgrens lineair aflopend tot nul bij de bovengrens. Het belastingvoordeel is aftrek × tarief.',
    letop: 'Alleen bedrijfsmiddelen van minimaal € 450 per stuk tellen mee; personenauto\'s, woningen en grond zijn uitgesloten. Bij verkoop binnen vijf jaar kan een desinvesteringsbijtelling volgen. Naast de KIA bestaan de milieu- en energie-investeringsaftrek. Indicatief: de staffel staat nog niet in het centrale normenbestand; controleer de actuele norm.'
  });

  RT.add({
    id: 'auto-zakelijk-of-prive', groep: 'ondernemer', naam: 'Auto zakelijk of privé',
    intro: 'Voor een ib-ondernemer: is de auto voordeliger op de zaak (kosten aftrekbaar, wel bijtelling) of privé (kilometervergoeding)?',
    kw: 'auto zaak privé bijtelling kilometervergoeding ondernemer ondernemingsvermogen',
    fiscaal: ['bijtelling', 'kilometervergoeding'], peildatum: N.peildatum,
    velden: [
      { k: 'wrd', l: 'Cataloguswaarde (fiscale waarde)', s: 'eur', std: 40000 },
      { k: 'kost', l: 'Autokosten per jaar (incl. afschrijving)', s: 'eur', std: 9000 },
      { k: 'zkm', l: 'Zakelijke kilometers per jaar', s: 'num', na: 'km', std: 12000 },
      { k: 'bij', l: 'Bijtellingspercentage', s: 'pct', std: N.bijtellingPct, tip: 'Hangt af van het bouwjaar en de CO2-uitstoot.' },
      { k: 'tar', l: 'Uw schijftarief', s: 'pct', std: NM.box1.tarief2 }
    ],
    bereken(v) {
      const mkb = 1 - NM.ondernemer.mkbVrijstellingPct / 100;
      const t = v.tar / 100 * mkb; // effectief tarief op winst na mkb-winstvrijstelling
      const bijtelling = Math.min(v.wrd * v.bij / 100, v.kost);
      const nettoZaak = v.kost - (v.kost - bijtelling) * t;
      const km = v.zkm * N.kmVergoeding;
      const nettoPrive = v.kost - km * t;
      const vs = nettoPrive - nettoZaak;
      return {
        lbl: 'Voordeligst', groot: vs > 0 ? 'Auto op de zaak' : 'Auto privé', onder: 'scheelt ' + fmt.euro0(Math.abs(vs)) + ' per jaar',
        rijen: [
          ['Effectief tarief (na mkb-winstvrijstelling)', fmt.pct(t * 100, 1)],
          ['Bijtelling', fmt.euro0(bijtelling)],
          ['Zaak: netto kosten (kosten − aftrek + belasting bijtelling)', fmt.euro0(nettoZaak)],
          ['Privé: aftrekbare km-vergoeding', fmt.euro0(km)],
          ['Privé: netto kosten', fmt.euro0(nettoPrive)],
          ['Verschil privé − zaak', verschil(vs), 'som']
        ]
      };
    },
    uitleg: 'Op de zaak: alle autokosten zijn aftrekbaar, de bijtelling (cataloguswaarde × percentage, hoogstens de kosten) wordt bij de winst geteld. Privé: geen kostenaftrek, wel een vaste vergoeding per zakelijke kilometer ten laste van de winst. Beide werken tegen het schijftarief maal (1 − mkb-winstvrijstelling).',
    letop: 'Met een sluitende rittenregistratie en maximaal 500 privékilometers per jaar is er geen bijtelling. Btw (privégebruik-correctie), motorrijtuigenbelasting en de keuze vermogensetikettering zijn niet meegenomen. Voor een dga met een auto van de bv gelden andere regels. Indicatief: bijtellingspercentage en kilometervergoeding staan nog niet in het centrale normenbestand; controleer de actuele norm.'
  });

  /* ===================================================== werkgever */

  RT.add({
    id: 'loonkosten-werkgever', groep: 'ondernemer', naam: 'Loonkosten van een werknemer',
    intro: 'Wat kost een werknemer de werkgever per jaar, inclusief vakantiegeld, werkgeverspremies, pensioen en vaste kosten?',
    kw: 'loonkosten werkgever werknemer premies awf aof whk zvw personeel',
    fiscaal: ['werkgeverspremies', 'opslag kinderopvang'], peildatum: PEIL,
    velden: [
      { k: 'ml', l: 'Bruto maandsalaris', s: 'eur', std: 3800 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'ej', l: 'Eindejaarsuitkering', s: 'pct', std: 0, opt: true },
      { k: 'pens', l: 'Pensioenpremie werkgeversdeel', s: 'pct', std: 12, opt: true, tip: 'Als percentage van het jaarloon (vereenvoudigd).' },
      { k: 'vast', l: 'Overige kosten per jaar', s: 'eur', std: 1500, opt: true, tip: 'Werkplek, opleiding, reiskosten.' },
      { k: 'uren', l: 'Productieve uren per jaar', s: 'num', na: 'uur', std: 1600 }
    ],
    bereken(v) {
      const w = NM.werkgever;
      const jaar = v.ml * 12 * (1 + v.vg / 100 + v.ej / 100);
      const basis = Math.min(jaar, w.maxPremieloon), basisZvw = Math.min(jaar, NM.ondernemer.zvwMaxInkomen);
      const wv = basis * (w.awf + w.aof + w.whk + N.wkoOpslag) / 100, zvw = basisZvw * w.zvw / 100;
      const pens = jaar * v.pens / 100;
      const tot = jaar + wv + zvw + pens + v.vast;
      return {
        lbl: 'Totale loonkosten per jaar', groot: fmt.euro0(tot), onder: fmt.euro0(tot / 12) + ' per maand',
        rijen: [
          ['Bruto jaarloon met vakantiegeld en uitkeringen', fmt.euro0(jaar)],
          ['Premies werknemersverzekeringen', fmt.euro0(wv)],
          ['Werkgeversheffing Zvw', fmt.euro0(zvw)],
          ['Pensioenpremie werkgever', fmt.euro0(pens)],
          ['Overige kosten', fmt.euro0(v.vast)],
          ['Opslag op het kale jaarsalaris', fmt.pct((tot / (v.ml * 12) - 1) * 100, 1), 'som'],
          ['Kosten per productief uur', v.uren > 0 ? fmt.euro(tot / v.uren) : '–']
        ]
      };
    },
    uitleg: 'Jaarloon = maandsalaris × 12 × (1 + vakantiegeld + eindejaarsuitkering). Werknemersverzekeringen (Awf, Aof met opslag kinderopvang, Whk) over het loon tot het maximum premieloon; werkgeversheffing Zvw tot het maximum bijdrage-inkomen. Daarbij pensioen en overige kosten.',
    letop: 'De Awf-premie is hoger bij een flexibel contract of een contract met minder dan 35 uur zonder vaste uren; hier is de lage premie gebruikt. De Whk-premie verschilt per werkgever en sector, de Aof-premie naar omvang (kleine of grote werkgever). Indicatief: de opslag kinderopvang staat nog niet in het centrale normenbestand; controleer de actuele norm.'
  });

  RT.add({
    id: 'werkkostenregeling', groep: 'ondernemer', naam: 'Vrije ruimte werkkostenregeling',
    intro: 'Hoeveel mag een werkgever onbelast vergoeden of verstrekken binnen de vrije ruimte, en wat kost een overschrijding?',
    kw: 'wkr werkkostenregeling vrije ruimte eindheffing personeel vergoedingen',
    fiscaal: ['vrije ruimte WKR'], peildatum: N.peildatum,
    velden: [
      { k: 'loon', l: 'Fiscale loonsom per jaar', s: 'eur', std: 850000 },
      { k: 'geb', l: 'Aangewezen vergoedingen en verstrekkingen', s: 'eur', std: 16000, opt: true }
    ],
    bereken(v) {
      const k = N.wkr;
      const r1 = Math.min(v.loon, k.grens) * k.pct1 / 100, r2 = pos(v.loon - k.grens) * k.pct2 / 100, ruimte = r1 + r2;
      const over = pos(v.geb - ruimte);
      return {
        lbl: 'Vrije ruimte', groot: fmt.euro0(ruimte), onder: v.loon > 0 ? fmt.pct(ruimte / v.loon * 100, 2) + ' van de loonsom' : '',
        rijen: [
          ['Over de eerste ' + fmt.euro0(k.grens) + ' (' + fmt.pct(k.pct1, 2) + ')', fmt.euro0(r1)],
          ['Over het meerdere (' + fmt.pct(k.pct2, 2) + ')', fmt.euro0(r2)],
          ['Gebruikt', fmt.euro0(v.geb)],
          ['Nog beschikbaar', fmt.euro0(pos(ruimte - v.geb))],
          ['Overschrijding', fmt.euro0(over)],
          ['Eindheffing (' + fmt.pct(k.eindheffing, 0) + ')', fmt.euro0(over * k.eindheffing / 100), 'som']
        ]
      };
    },
    uitleg: 'Vrije ruimte = percentage × loonsom tot de grens + lager percentage × loonsom daarboven. Wat aan aangewezen vergoedingen en verstrekkingen boven de vrije ruimte uitkomt, is belast met een eindheffing voor de werkgever.',
    letop: 'Gerichte vrijstellingen (zoals reiskosten, thuiswerkvergoeding en opleidingen) en nihilwaarderingen tellen niet mee voor de vrije ruimte. Een vergoeding moet ook gebruikelijk zijn. Bij een concern kan de vrije ruimte worden samengevoegd. Indicatief: de percentages en de grens staan nog niet in het centrale normenbestand; controleer de actuele norm.'
  });

  /* ===================================================== bv en dga */

  RT.add({
    id: 'vennootschapsbelasting', groep: 'ondernemer', naam: 'Vpb over de winst van de bv',
    intro: 'Hoeveel vennootschapsbelasting betaalt de bv over de fiscale winst?',
    kw: 'vpb vennootschapsbelasting bv winst tarief schijf',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'w', l: 'Fiscale winst', s: 'eur', std: 275000 }
    ],
    bereken(v) {
      const s = F.tweeSchijven(pos(v.w), NM.vpb.grens, NM.vpb.tarief1, NM.vpb.tarief2);
      return {
        lbl: 'Vennootschapsbelasting', groot: fmt.euro0(s.belasting), onder: v.w > 0 ? 'effectief ' + fmt.pct(s.belasting / v.w * 100) : '',
        rijen: [
          ['Tot ' + fmt.euro0(NM.vpb.grens) + ' tegen ' + fmt.pct(NM.vpb.tarief1, 1), fmt.euro0(s.s1 * NM.vpb.tarief1 / 100)],
          ['Daarboven tegen ' + fmt.pct(NM.vpb.tarief2, 1), fmt.euro0(s.s2 * NM.vpb.tarief2 / 100)],
          ['Winst na vpb', fmt.euro0(v.w - s.belasting), 'som'],
          ['Tarief over de volgende euro', fmt.pct(v.w > NM.vpb.grens ? NM.vpb.tarief2 : NM.vpb.tarief1, 1)]
        ],
        signalen: v.w < 0 ? ['Een fiscaal verlies kan worden verrekend met winst van het voorgaande jaar of met toekomstige winsten (met beperkingen boven een drempel).'] : []
      };
    },
    uitleg: 'Twee schijven: het lage tarief tot de schijfgrens, het hoge tarief over het meerdere. Effectieve druk = vpb / winst.',
    letop: 'Uitgegaan is van een zelfstandige bv. In een fiscale eenheid geldt de schijfgrens één keer voor alle bv\'s samen. Innovatiebox, deelnemingsvrijstelling en verliesverrekening zijn niet meegenomen.'
  });

  RT.add({
    id: 'winst-naar-prive', groep: 'ondernemer', naam: 'Winst uit de bv naar privé',
    intro: 'Hoeveel blijft er over van de winst van de bv als die na vennootschapsbelasting als dividend naar privé gaat?',
    kw: 'dividend box 2 vpb winst bv privé gecombineerde druk',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'w', l: 'Winst vóór vpb', s: 'eur', std: 150000 },
      { k: 'fp', l: 'Dividend verdeeld over fiscale partners?', s: 'keuze', opties: [['1', 'Nee, één aandeelhouder'], ['2', 'Ja, over twee partners']], std: '1' }
    ],
    bereken(v) {
      if (v.w <= 0) return { fout: 'Vul een winst groter dan nul in.' };
      const vpb = F.vpb(v.w), div = v.w - vpb, b2 = F.box2(div, +v.fp);
      return {
        lbl: 'Netto naar privé', groot: fmt.euro0(div - b2), onder: 'gecombineerde druk ' + fmt.pct((vpb + b2) / v.w * 100, 1),
        rijen: [
          ['Vennootschapsbelasting', fmt.euro0(vpb)],
          ['Dividend', fmt.euro0(div)],
          ['Box 2-belasting', fmt.euro0(b2)],
          ['Totale belasting', fmt.euro0(vpb + b2), 'som'],
          ['Netto per € 1.000 winst', fmt.euro0((div - b2) / v.w * 1000)]
        ]
      };
    },
    uitleg: 'Eerst vpb over de winst (twee schijven), daarna box 2 over het uitgekeerde dividend (twee schijven; met een fiscale partner geldt de eerste schijfgrens voor beiden). Bij vlakke tarieven is de gecombineerde druk 1 − (1 − vpb) × (1 − box 2).',
    letop: 'Een uitkering mag alleen als de bv na de uitkering haar schulden kan blijven betalen (uitkeringstest); het bestuur is anders aansprakelijk. Dividendbelasting wordt ingehouden en verrekend met box 2. Spreiden over jaren kan de tweede box 2-schijf vermijden; zie Vermogen uit de bv uitkeren.'
  });

  RT.add({
    id: 'vermogen-bv-uitkeren', groep: 'ondernemer', naam: 'Vermogen uit de bv uitkeren',
    intro: 'Hoeveel box 2-belasting kost het om opgebouwd vermogen uit de bv uit te keren, ineens of gespreid over jaren?',
    kw: 'box 2 dividend uitkeren spreiden fiscale partner vermogen bv',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'b', l: 'Uit te keren bedrag', s: 'eur', std: 250000 },
      { k: 'fp', l: 'Aandelen bij fiscale partners samen?', s: 'keuze', opties: [['1', 'Nee'], ['2', 'Ja, schijfgrens voor beiden']], std: '1' },
      { k: 'jr', l: 'Spreiden over', s: 'num', na: 'jaar', std: 3 }
    ],
    bereken(v) {
      const p = +v.fp, jr = Math.max(1, Math.round(v.jr));
      const ineens = F.box2(v.b, p), perJaar = v.b / jr, gespreid = F.box2(perJaar, p) * jr;
      return {
        lbl: 'Box 2 bij spreiden over ' + jr + (jr === 1 ? ' jaar' : ' jaar'), groot: fmt.euro0(gespreid), onder: 'netto ' + fmt.euro0(v.b - gespreid),
        rijen: [
          ['Uitkering per jaar', fmt.euro0(perJaar)],
          ['Box 2 per jaar', fmt.euro0(gespreid / jr)],
          ['Box 2 bij uitkering ineens', fmt.euro0(ineens)],
          ['Voordeel van spreiden', fmt.euro0(ineens - gespreid), 'som'],
          ['Effectieve druk bij spreiden', v.b > 0 ? fmt.pct(gespreid / v.b * 100, 2) : '–']
        ]
      };
    },
    uitleg: 'Box 2 kent twee schijven. Met een fiscale partner geldt de eerste schijfgrens voor ieder van beiden. Bij spreiden wordt elk jaar alleen de eerste schijf gebruikt zolang de jaarlijkse uitkering daaronder blijft.',
    letop: 'Er is gerekend met de tarieven en grens van ' + PEIL + ' voor alle jaren; toekomstige tarieven kunnen anders zijn. Vermogen dat in de bv blijft, rendeert verder (zie Dividend uitstellen). Let op de uitkeringstest en de Wet excessief lenen als vermogen via een rekening-courant wordt opgenomen.'
  });

  RT.add({
    id: 'nettoloon-dga', groep: 'ondernemer', naam: 'Netto salaris van de directeur-grootaandeelhouder',
    intro: 'Wat houdt de dga netto over van het salaris uit de eigen bv, en wat kost dat salaris de bv?',
    kw: 'dga salaris netto loon gebruikelijk loon directeur grootaandeelhouder',
    fiscaal: ['box 1', 'heffingskortingen', 'werkgeversheffing Zvw', 'gebruikelijk loon'], peildatum: PEIL,
    velden: [
      { k: 'b', l: 'Bruto jaarsalaris', s: 'eur', std: 62000 },
      { k: 'pens', l: 'Eigen bijdrage pensioen', s: 'pct', std: 0, opt: true },
      { k: 'bij', l: 'Bijtelling auto van de zaak', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const ink = v.b * (1 - v.pens / 100) + v.bij;
      const r = F.netto(ink, { arbeid: ink });
      const zvw = Math.min(ink, NM.ondernemer.zvwMaxInkomen) * NM.werkgever.zvw / 100;
      const netto = r.netto - v.bij;
      return {
        lbl: 'Netto per maand', groot: fmt.euro0(netto / 12), onder: fmt.euro0(netto) + ' per jaar',
        rijen: [
          ['Fiscaal loon (incl. bijtelling)', fmt.euro0(ink)],
          ['Belasting vóór heffingskortingen', fmt.euro0(r.belastingVoorKorting)],
          ['Heffingskortingen', fmt.euro0(-r.kortingTotaal)],
          ['Loonheffing', fmt.euro0(r.heffing)],
          ['Netto per jaar', fmt.euro0(netto), 'som'],
          ['Werkgeversheffing Zvw (betaalt de bv)', fmt.euro0(zvw)],
          ['Kosten voor de bv', fmt.euro0(v.b + zvw)]
        ],
        signalen: v.b < N.gebruikelijkLoon ? ['Het salaris ligt onder het normbedrag voor het gebruikelijk loon (' + fmt.euro0(N.gebruikelijkLoon) + ', indicatief). Een lager loon moet aannemelijk worden gemaakt.'] : []
      };
    },
    uitleg: 'Een dga is meestal niet verzekerd voor de werknemersverzekeringen, dus er gaan geen WW-, WIA- of ZW-premies af. Over het loon (min eigen pensioenbijdrage, plus bijtelling) wordt box 1-belasting berekend met algemene heffingskorting en arbeidskorting. De bv betaalt daarnaast de werkgeversheffing Zvw.',
    letop: 'Het gebruikelijk loon is ten minste het hoogste van het normbedrag, het loon uit de meest vergelijkbare dienstbetrekking en het hoogste loon van de andere werknemers, tenzij een lager loon aannemelijk is. Of de dga verzekerd is voor werknemersverzekeringen, hangt af van de zeggenschap. Indicatief: het normbedrag gebruikelijk loon staat nog niet in het centrale normenbestand; controleer de actuele norm.'
  });

  RT.add({
    id: 'dga-loon-of-dividend', groep: 'ondernemer', naam: 'Loon of dividend voor de dga',
    intro: 'Hoe verdeelt u het resultaat van de bv tussen salaris en dividend? Vergelijk de totale belasting bij verschillende salarissen.',
    kw: 'dga salaris dividend optimaal box 1 box 2 vpb gebruikelijk loon mix',
    fiscaal: ['box 1', 'vpb', 'box 2', 'gebruikelijk loon'], peildatum: PEIL,
    velden: [
      { k: 'res', l: 'Resultaat bv vóór dga-salaris', s: 'eur', std: 200000 },
      { k: 'loon', l: 'Dga-salaris', s: 'eur', std: 62000 }
    ],
    bereken(v) {
      const scenario = loon => {
        loon = Math.min(pos(loon), v.res);
        const zvw = Math.min(loon, NM.ondernemer.zvwMaxInkomen) * NM.werkgever.zvw / 100;
        const r = F.netto(loon, { arbeid: loon });
        const winst = pos(v.res - loon - zvw), vpb = F.vpb(winst), div = winst - vpb, b2 = F.box2(div);
        return { loon, zvw, ib: r.heffing, winst, vpb, div, b2, belasting: r.heffing + zvw + vpb + b2, netto: r.netto + div - b2 };
      };
      if (v.res <= 0) return { fout: 'Vul een positief resultaat in.' };
      const s = scenario(v.loon);
      const stappen = [N.gebruikelijkLoon, 70000, 80000, 100000, 125000, 150000].filter(x => x <= v.res);
      if (stappen.indexOf(Math.round(v.loon)) < 0 && v.loon <= v.res) stappen.push(Math.round(v.loon));
      stappen.sort((a, b) => a - b);
      return {
        lbl: 'Netto naar privé', groot: fmt.euro0(s.netto), onder: 'totale druk ' + fmt.pct(s.belasting / v.res * 100, 1) + ' bij dit salaris',
        rijen: [
          ['Loonheffing (box 1)', fmt.euro0(s.ib)],
          ['Werkgeversheffing Zvw', fmt.euro0(s.zvw)],
          ['Winst bv na salaris', fmt.euro0(s.winst)],
          ['Vennootschapsbelasting', fmt.euro0(s.vpb)],
          ['Box 2 over het dividend', fmt.euro0(s.b2)],
          ['Totale belasting en premie', fmt.euro0(s.belasting), 'som']
        ],
        tabel: { titel: 'Vergelijking bij andere salarissen', kop: ['Salaris', 'Belasting totaal', 'Netto naar privé'], rijen: stappen.map(l => { const x = scenario(l); return [fmt.euro0(l), fmt.euro0(x.belasting), fmt.euro0(x.netto)]; }) },
        signalen: v.loon < N.gebruikelijkLoon ? ['Het salaris ligt onder het normbedrag gebruikelijk loon (' + fmt.euro0(N.gebruikelijkLoon) + ', indicatief); dat moet onderbouwd kunnen worden.'] : []
      };
    },
    uitleg: 'Salaris is aftrekbaar voor de bv en belast in box 1; de bv betaalt werkgeversheffing Zvw. De rest van het resultaat is belast met vpb en, bij uitkering, met box 2. Uitgegaan is van volledige uitkering van de winst na vpb in hetzelfde jaar.',
    letop: 'Fiscaal advies: het gebruikelijk loon, pensioenopbouw, de toekomstige box 2-tarieven en het moment van uitkeren bepalen de echte optimale mix. Laat dit beoordelen door een fiscalist. Er is geen fiscale partner en geen ander inkomen meegenomen. Indicatief: het normbedrag gebruikelijk loon staat nog niet in het centrale normenbestand.'
  });

  RT.add({
    id: 'bv-of-eenmanszaak', groep: 'ondernemer', naam: 'Eenmanszaak of bv: belasting vergeleken',
    intro: 'Bij welke winst is een bv fiscaal voordeliger dan een eenmanszaak? Een vergelijking van het netto inkomen in beide vormen.',
    kw: 'bv eenmanszaak omzetten rechtsvorm vergelijken dga ib-ondernemer',
    fiscaal: true, peildatum: PEIL,
    velden: [
      { k: 'w', l: 'Winst vóór ondernemersbeloning', s: 'eur', std: 180000 },
      { k: 'loon', l: 'Dga-salaris in de bv', s: 'eur', std: 62000 },
      { k: 'uitk', l: 'Winst van de bv uitkeren?', s: 'keuze', opties: [['ja', 'Ja, volledig als dividend'], ['nee', 'Nee, in de bv laten']], std: 'ja' },
      { k: 'kost', l: 'Extra kosten bv per jaar', s: 'eur', std: 2500, opt: true, tip: 'Jaarrekening, administratie, notaris.' }
    ],
    bereken(v) {
      const ez = w => F.ondernemer(w, {});
      const bv = w => {
        const loon = Math.min(v.loon, pos(w - v.kost));
        const zvw = Math.min(loon, NM.ondernemer.zvwMaxInkomen) * NM.werkgever.zvw / 100;
        const r = F.netto(loon, { arbeid: loon });
        const winst = pos(w - v.kost - loon - zvw), vpb = F.vpb(winst), div = winst - vpb;
        const b2 = v.uitk === 'ja' ? F.box2(div) : 0;
        return { loonNetto: r.netto, vpb, b2, inBv: v.uitk === 'ja' ? 0 : div, netto: r.netto + (v.uitk === 'ja' ? div - b2 : 0) };
      };
      const e = ez(v.w), b = bv(v.w);
      const vs = b.netto - e.netto;
      let omslag = NaN;
      for (let w = 20000; w <= 1000000; w += 5000) { if (bv(w).netto > ez(w).netto) { omslag = w; break; } }
      return {
        lbl: 'Voordeligst bij deze winst', groot: vs > 0 ? 'Bv' : 'Eenmanszaak', onder: 'verschil ' + fmt.euro0(Math.abs(vs)) + ' netto per jaar',
        rijen: [
          ['Eenmanszaak: netto', fmt.euro0(e.netto)],
          ['Eenmanszaak: belasting en Zvw', fmt.euro0(e.heffing + e.zvw)],
          ['Bv: netto salaris', fmt.euro0(b.loonNetto)],
          ['Bv: vennootschapsbelasting', fmt.euro0(b.vpb)],
          ['Bv: box 2', fmt.euro0(b.b2)],
          v.uitk === 'ja' ? ['Bv: netto naar privé', fmt.euro0(b.netto)] : ['Bv: netto privé (exclusief wat in de bv blijft)', fmt.euro0(b.netto)],
          ['Verschil bv − eenmanszaak', verschil(vs), 'som'],
          ['Omslagpunt bij deze instellingen', Number.isFinite(omslag) ? 'vanaf ca. ' + fmt.euro0(omslag) + ' winst' : 'niet binnen € 1 mln']
        ],
        signalen: v.uitk === 'nee' ? ['In de bv blijft ' + fmt.euro0(b.inBv) + ' na vpb staan. Daarover is later nog box 2 verschuldigd; de vergelijking op netto privé is dan niet volledig.'] : []
      };
    },
    uitleg: 'Eenmanszaak: winst na zelfstandigenaftrek en mkb-winstvrijstelling in box 1, plus Zvw-bijdrage. Bv: salaris in box 1 (de bv betaalt werkgeversheffing Zvw), de rest na extra bv-kosten met vpb en bij uitkering box 2. Het omslagpunt is de laagste winst (in stappen van € 5.000) waarbij de bv meer netto oplevert.',
    letop: 'Fiscaal en juridisch advies: naast belasting tellen aansprakelijkheid, pensioen, financierbaarheid, oprichtings- en jaarkosten en de mogelijkheid om winst in de bv te laten. Uitgegaan is van het urencriterium, geen fiscale partner en geen ander inkomen. Betrek een fiscalist bij de keuze.'
  });

  // Gemeenschappelijk voor de twee hulpen over lenen van de eigen bv
  const tEW = NM.aftrekTariefMax, tVpb = NM.vpb.tarief1, tB2 = NM.box2.tarief1;

  RT.add({
    id: 'hypotheek-eigen-bv', groep: 'ondernemer', naam: 'Hypotheek bij eigen bv, bank of aflossen',
    intro: 'Een dga met vermogen in de bv: lenen bij de bank, lenen van de eigen bv of de hypotheek aflossen met geld uit de bv?',
    kw: 'hypotheek eigen bv dga lenen aflossen wet excessief lenen rekening-courant',
    fiscaal: ['aftrektarief eigen woning', 'vpb', 'box 2', 'grens Wet excessief lenen'], peildatum: PEIL,
    velden: [
      { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 300000 },
      { k: 'rb', l: 'Rente bij de bank', s: 'pct', std: 4.1 },
      { k: 'rbv', l: 'Rente aan de eigen bv', s: 'pct', std: 5 },
      { k: 'rend', l: 'Rendement op het geld in de bv', s: 'pct', std: 3, tip: 'Wat het geld in de bv anders zou opbrengen.' },
      { k: 'hr', l: 'Hypotheekrecht gevestigd voor de bv?', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'ander', l: 'Andere schulden aan de bv', s: 'eur', std: 0, opt: true, tip: 'Bijvoorbeeld een rekening-courant; met die van de fiscale partner samen.' }
    ],
    bereken(v) {
      const bank = v.h * v.rb / 100 * (1 - tEW / 100);
      const renteBv = v.h * v.rbv / 100;
      const terug = renteBv * (1 - tVpb / 100) * (1 - tB2 / 100);
      const viaBv = renteBv * (1 - tEW / 100) - terug;
      const uitkering = v.h / (1 - tB2 / 100), b2Eenmalig = uitkering - v.h;
      const aflossen = uitkering * v.rend / 100 * (1 - tVpb / 100) * (1 - tB2 / 100);
      const opties = [['Bank', bank], ['Eigen bv', viaBv], ['Aflossen', aflossen]].sort((a, b) => a[1] - b[1]);
      const schuldBv = v.ander + (v.hr === 'ja' ? 0 : v.h);
      return {
        lbl: 'Laagste netto kosten per jaar', groot: opties[0][0], onder: fmt.euro0(opties[0][1]) + ' per jaar (familie als geheel)',
        rijen: [
          ['Bank: rente na aftrek', fmt.euro0(bank)],
          ['Eigen bv: rente na aftrek', fmt.euro0(renteBv * (1 - tEW / 100))],
          ['Eigen bv: komt terug na vpb en box 2', fmt.euro0(-terug)],
          ['Eigen bv: per saldo', fmt.euro0(viaBv)],
          ['Aflossen: benodigde uitkering uit de bv', fmt.euro0(uitkering)],
          ['Aflossen: box 2 bij die uitkering (eenmalig)', fmt.euro0(b2Eenmalig)],
          ['Aflossen: gemist rendement per jaar (netto)', fmt.euro0(aflossen)],
          ['Eigen bv t.o.v. bank', verschil(bank - viaBv) + ' per jaar', 'som']
        ],
        signalen: [schuldBv > N.welGrens ? 'De schulden aan de bv die meetellen (' + fmt.euro0(schuldBv) + ') liggen boven de grens van de Wet excessief lenen (' + fmt.euro0(N.welGrens) + ', indicatief). Het meerdere wordt belast als fictief dividend in box 2.' : 'Meetellende schulden aan de bv: ' + fmt.euro0(schuldBv) + ', onder de grens van de Wet excessief lenen (' + fmt.euro0(N.welGrens) + ', indicatief).']
          .concat(v.hr === 'ja' ? [] : ['Zonder hypotheekrecht voor de bv telt de eigenwoningschuld mee voor de Wet excessief lenen.'])
      };
    },
    uitleg: 'Bank: rente × (1 − aftrektarief). Eigen bv: de rente is aftrekbaar in box 1, maar komt na vpb en box 2 terug in privé; netto = rente × (1 − aftrektarief) − rente × (1 − vpb) × (1 − box 2). Aflossen: om het bedrag netto vrij te maken moet de bv bedrag / (1 − box 2) uitkeren; daarna mist u het rendement daarop na vpb en box 2. Tarieven: aftrek ' + fmt.pct(tEW) + ', vpb ' + fmt.pct(tVpb, 1) + ', box 2 ' + fmt.pct(tB2, 1) + '.',
    letop: 'Fiscaal advies. Voor renteaftrek moet de lening aan de eigenwoningregels voldoen (onder meer annuïtair of lineair aflossen in 30 jaar en de informatieplicht) en moet de rente zakelijk zijn. De Wet excessief lenen bij de eigen vennootschap telt eigenwoningschulden niet mee als er een hypotheekrecht voor de bv is gevestigd. Er is gerekend met vlakke tarieven (eerste schijf vpb en box 2). Indicatief: de grens Wet excessief lenen staat nog niet in het centrale normenbestand; controleer de actuele norm en betrek een fiscalist.'
  });

  RT.add({
    id: 'rente-via-eigen-bv', groep: 'ondernemer', naam: 'Rente via de eigen bv',
    intro: 'De hypotheekrente gaat naar de eigen bv in plaats van naar de bank. Hoeveel levert dat over een aantal jaren op?',
    kw: 'kasrondje rente eigen bv dga hypotheek aftrek vpb box 2 uitstel',
    fiscaal: ['aftrektarief eigen woning', 'vpb', 'box 2'], peildatum: PEIL,
    velden: [
      { k: 'h', l: 'Lening van de bv', s: 'eur', std: 300000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 5 },
      { k: 'n', l: 'Aantal jaren', s: 'num', na: 'jaar', std: 10 },
      { k: 'rend', l: 'Rendement in de bv', s: 'pct', std: 3 }
    ],
    bereken(v) {
      const n = Math.round(v.n);
      if (n < 1) return { fout: 'Vul minstens één jaar in.' };
      const rente = v.h * v.r / 100;
      const tariefVoordeel = rente * (tEW - tVpb) / 100;
      let kap = 0;
      const rijenTabel = [];
      for (let j = 1; j <= n; j++) {
        kap = kap * (1 + v.rend / 100 * (1 - tVpb / 100)) + rente * (1 - tVpb / 100);
        if (j <= 5 || j === n || j % 5 === 0) rijenTabel.push([String(j), fmt.euro0(kap), fmt.euro0(kap * (1 - tB2 / 100))]);
      }
      const nettoKostPrive = rente * (1 - tEW / 100) * n;
      const terug = kap * (1 - tB2 / 100);
      return {
        lbl: 'Netto rentekosten over ' + n + ' jaar', groot: fmt.euro0(nettoKostPrive - terug), onder: (nettoKostPrive - terug < 0 ? 'negatief = per saldo voordeel; ' : '') + 'bij een bank met dezelfde rente ' + fmt.euro0(nettoKostPrive),
        rijen: [
          ['Rente per jaar', fmt.euro0(rente)],
          ['Aftrek in privé per jaar', fmt.euro0(rente * tEW / 100)],
          ['Vpb in de bv per jaar', fmt.euro0(rente * tVpb / 100)],
          ['Tariefverschil per jaar (aftrek − vpb)', fmt.euro0(tariefVoordeel)],
          ['Opgebouwd in de bv na ' + n + ' jaar', fmt.euro0(kap)],
          ['Na box 2 bij uitkering', fmt.euro0(terug)],
          ['Voordeel t.o.v. bank met dezelfde rente', fmt.euro0(terug), 'som']
        ],
        tabel: { titel: 'Opbouw in de bv', kop: ['Jaar', 'In de bv', 'Na box 2'], rijen: rijenTabel }
      };
    },
    uitleg: 'Privé betaalt rente en trekt die af tegen het aftrektarief. De bv ontvangt de rente, betaalt vpb en belegt de rest; ook het rendement wordt na vpb opgebouwd. Bij uitkering volgt box 2. Netto kosten = rente na aftrek × jaren − opgebouwd bedrag na box 2.',
    letop: 'Fiscaal advies. De rente moet zakelijk zijn en de lening moet voldoen aan de eigenwoningregels. Er is gerekend met vlakke tarieven van ' + PEIL + ' (eerste schijf vpb en box 2) over de hele looptijd. Toekomstige wijzigingen van het aftrektarief of box 2 hebben grote invloed. Betrek een fiscalist; zie ook Hypotheek bij eigen bv, bank of aflossen.'
  });

  RT.add({
    id: 'dividend-uitstellen', groep: 'ondernemer', naam: 'Dividend uitstellen',
    intro: 'Nu uitkeren en privé beleggen, of het geld in de bv laten renderen en later uitkeren?',
    kw: 'dividend uitstellen box 2 box 3 vpb oppotten bv beleggen',
    fiscaal: ['vpb', 'box 2', 'box 3'], peildatum: PEIL,
    velden: [
      { k: 'd', l: 'Beschikbaar voor dividend', s: 'eur', std: 150000 },
      { k: 'n', l: 'Jaren uitstellen', s: 'num', na: 'jaar', std: 10 },
      { k: 'r', l: 'Rendement per jaar', s: 'pct', std: 5 },
      { k: 'b2l', l: 'Verwacht box 2-tarief bij latere uitkering', s: 'pct', std: tB2 }
    ],
    bereken(v) {
      const n = Math.round(v.n);
      if (n < 1) return { fout: 'Vul minstens één jaar in.' };
      const nu = v.d * (1 - tB2 / 100);
      const rPriv = v.r - NM.box3.forfaitOverig * NM.box3.tarief / 100;
      const eindNu = nu * Math.pow(1 + rPriv / 100, n);
      const rBv = v.r * (1 - tVpb / 100);
      const inBv = v.d * Math.pow(1 + rBv / 100, n);
      const eindLater = inBv * (1 - v.b2l / 100);
      const vs = eindLater - eindNu;
      return {
        lbl: 'Voordeligst', groot: vs > 0 ? 'Uitstellen' : 'Nu uitkeren', onder: 'verschil ' + fmt.euro0(Math.abs(vs)) + ' na ' + n + ' jaar',
        rijen: [
          ['Nu uitkeren: netto', fmt.euro0(nu)],
          ['Rendement privé na box 3', fmt.pct(rPriv, 2)],
          ['Nu uitkeren: vermogen na ' + n + ' jaar', fmt.euro0(eindNu)],
          ['Rendement in de bv na vpb', fmt.pct(rBv, 2)],
          ['Uitstellen: in de bv na ' + n + ' jaar', fmt.euro0(inBv)],
          ['Uitstellen: netto na box 2', fmt.euro0(eindLater)],
          ['Verschil uitstellen − nu', verschil(vs), 'som']
        ]
      };
    },
    uitleg: 'Nu: dividend × (1 − box 2), daarna jaarlijks rendement min box 3-heffing (forfaitair rendement overige bezittingen × box 3-tarief, zonder heffingsvrij vermogen). Later: het bedrag rendeert in de bv na vpb en wordt aan het eind belast met het verwachte box 2-tarief.',
    letop: 'Er is gerekend met vlakke tarieven (eerste schijf vpb en box 2) en zonder heffingsvrij vermogen in box 3; zie Beleggen in de bv of in privé voor een berekening met heffingsvrij vermogen. Het box 3-stelsel wordt herzien; een stelsel op basis van werkelijk rendement kan de uitkomst veranderen. Opnemen via een rekening-courant valt onder de Wet excessief lenen.'
  });

  RT.add({
    id: 'vermogen-bv-of-prive', groep: 'ondernemer', naam: 'Beleggen in de bv of in privé',
    intro: 'Een bedrag in de bv: laten staan en in de bv beleggen, of nu uitkeren en privé beleggen in box 3?',
    kw: 'beleggen bv privé box 3 box 2 vpb vermogen opbouwen heffingsvrij',
    fiscaal: ['vpb', 'box 2', 'box 3'], peildatum: PEIL,
    velden: [
      { k: 'b', l: 'Bedrag in de bv (na vpb)', s: 'eur', std: 200000 },
      { k: 'r', l: 'Rendement per jaar', s: 'pct', std: 5 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'jaar', std: 15 },
      { k: 'p', l: 'Personen in box 3', s: 'keuze', opties: [['1', 'Eén persoon'], ['2', 'Fiscale partners']], std: '1' },
      { k: 'ander', l: 'Ander box 3-vermogen privé', s: 'eur', std: 0, opt: true, tip: 'Bepaalt hoeveel heffingsvrij vermogen al gebruikt is.' }
    ],
    bereken(v) {
      const n = Math.round(v.n), p = +v.p;
      if (n < 1) return { fout: 'Vul minstens één jaar in.' };
      // Bv: rendement na vpb, aan het eind volledig uitkeren
      const eindBv = v.b * Math.pow(1 + v.r / 100 * (1 - tVpb / 100), n);
      const nettoBv = eindBv - F.box2(eindBv, p);
      // Privé: nu uitkeren, jaarlijks box 3 over het vermogen op 1 januari (bovenop ander vermogen)
      let s = v.b - F.box2(v.b, p), box3Tot = 0;
      const startPriv = s;
      for (let j = 0; j < n; j++) {
        const heffing = F.box3(0, s + v.ander, 0, p).belasting - F.box3(0, v.ander, 0, p).belasting;
        box3Tot += heffing;
        s = s * (1 + v.r / 100) - heffing;
      }
      const vs = nettoBv - s;
      return {
        lbl: 'Voordeligst na ' + n + ' jaar', groot: vs > 0 ? 'In de bv' : 'In privé', onder: 'verschil ' + fmt.euro0(Math.abs(vs)) + ' netto',
        rijen: [
          ['Bv: vermogen aan het eind', fmt.euro0(eindBv)],
          ['Bv: netto na box 2 bij uitkering', fmt.euro0(nettoBv)],
          ['Privé: netto na box 2 nu', fmt.euro0(startPriv)],
          ['Privé: box 3 over de looptijd', fmt.euro0(box3Tot)],
          ['Privé: vermogen aan het eind', fmt.euro0(s)],
          ['Verschil bv − privé', verschil(vs), 'som']
        ]
      };
    },
    uitleg: 'Bv: het bedrag groeit met het rendement na vpb (laag tarief) en wordt aan het eind in één keer uitgekeerd met box 2 (twee schijven). Privé: nu uitkeren met box 2, daarna elk jaar box 3 over het vermogen op 1 januari, met het heffingsvrij vermogen en het forfaitaire rendement voor overige bezittingen.',
    letop: 'Er is gerekend met de normen van ' + PEIL + ' voor alle jaren. Het box 3-stelsel wordt herzien; met tegenbewijs of een stelsel op basis van werkelijk rendement kan de uitkomst anders zijn. In de bv kunnen kosten (beheer, jaarrekening) en bij veel beleggingen andere regels (beleggingsdeelnemingen) spelen. Fiscaal advies: betrek een fiscalist.'
  });

  RT.add({
    id: 'vermogenskosten-wacc', groep: 'ondernemer', naam: 'Gemiddelde vermogenskosten (WACC)',
    intro: 'Wat kost het vermogen van een onderneming gemiddeld, gewogen naar eigen en vreemd vermogen?',
    kw: 'wacc vermogenskosten capm beta disconteringsvoet waardering onderneming',
    fiscaal: ['vpb-tarief'], peildatum: PEIL,
    velden: [
      { k: 'E', l: 'Eigen vermogen (marktwaarde)', s: 'eur', std: 3000000 },
      { k: 'D', l: 'Rentedragende schulden', s: 'eur', std: 2000000 },
      { k: 'rf', l: 'Risicovrije rente', s: 'pct', std: 2.8 },
      { k: 'beta', l: 'Bèta', s: 'num', std: 1.1 },
      { k: 'mrp', l: 'Marktrisicopremie', s: 'pct', std: 5.5 },
      { k: 'sp', l: 'Extra premie (klein bedrijf, illiquiditeit)', s: 'pct', std: 3, opt: true },
      { k: 'kd', l: 'Rente op schulden', s: 'pct', std: 5.2 },
      { k: 't', l: 'Vpb-tarief', s: 'pct', std: NM.vpb.tarief2 }
    ],
    bereken(v) {
      const tot = v.E + v.D;
      if (tot <= 0) return { fout: 'Vul eigen en/of vreemd vermogen in.' };
      const ke = v.rf + v.beta * v.mrp + v.sp, kdn = v.kd * (1 - v.t / 100);
      const wacc = v.E / tot * ke + v.D / tot * kdn;
      return {
        lbl: 'WACC', groot: fmt.pct(wacc), onder: 'gewogen gemiddelde vermogenskosten',
        rijen: [
          ['Kosten eigen vermogen', fmt.pct(ke)],
          ['Kosten vreemd vermogen na belasting', fmt.pct(kdn)],
          ['Aandeel eigen vermogen', fmt.pct(v.E / tot * 100, 1)],
          ['Aandeel vreemd vermogen', fmt.pct(v.D / tot * 100, 1)],
          ['WACC', fmt.pct(wacc), 'som'],
          ['Bijbehorende multiple (1 / WACC)', wacc > 0 ? fmt.getal(100 / wacc, 1) + '×' : '–']
        ]
      };
    },
    uitleg: 'Kosten eigen vermogen = risicovrije rente + bèta × marktrisicopremie + extra premie. Kosten vreemd vermogen na belasting = rente × (1 − vpb-tarief). WACC = E / (E + D) × kosten EV + D / (E + D) × kosten VV na belasting.',
    letop: 'De uitkomst is zeer gevoelig voor de aannames over bèta en premies. Rente is alleen aftrekbaar voor zover de renteaftrekbeperkingen dat toelaten. Gebruik dit als hulpmiddel bij een waardering, niet als waardering zelf.'
  });

  RT.add({
    id: 'vrije-kasstroom', groep: 'ondernemer', naam: 'Vrije kasstroom van een onderneming',
    intro: 'Hoeveel geld houdt de onderneming over na belasting, rente, investeringen en aflossingen?',
    kw: 'vrije kasstroom free cash flow ebitda dividend aflossing investering',
    fiscaal: ['vpb'], peildatum: PEIL,
    velden: [
      { k: 'eb', l: 'EBITDA', s: 'eur', std: 450000 },
      { k: 'afs', l: 'Afschrijvingen', s: 'eur', std: 80000, opt: true },
      { k: 'rente', l: 'Rentelasten', s: 'eur', std: 45000, opt: true },
      { k: 'inv', l: 'Investeringen', s: 'eur', std: 120000, opt: true },
      { k: 'wk', l: 'Toename werkkapitaal', s: 'eur', std: 30000, opt: true },
      { k: 'afl', l: 'Aflossingen', s: 'eur', std: 75000, opt: true }
    ],
    bereken(v) {
      const winst = v.eb - v.afs - v.rente, vpb = F.vpb(pos(winst));
      const fcf = v.eb - v.rente - vpb - v.inv - v.wk - v.afl;
      return {
        lbl: 'Vrije kasstroom', groot: fmt.euro0(fcf), onder: 'beschikbaar voor aandeelhouders',
        rijen: [
          ['Fiscale winst (EBITDA − afschrijving − rente)', fmt.euro0(winst)],
          ['Vennootschapsbelasting', fmt.euro0(-vpb)],
          ['Rente', fmt.euro0(-v.rente)],
          ['Investeringen en werkkapitaal', fmt.euro0(-(v.inv + v.wk))],
          ['Aflossingen', fmt.euro0(-v.afl)],
          ['Vrije kasstroom', fmt.euro0(fcf), 'som']
        ],
        signalen: fcf < 0 ? ['De kasstroom is negatief: er is aanvullende financiering of eigen vermogen nodig.'] : ['Dividend uitkeren kan alleen als ook de uitkeringstest positief uitvalt: de bv moet na uitkering haar opeisbare schulden kunnen blijven betalen.']
      };
    },
    uitleg: 'Vrije kasstroom = EBITDA − rente − vpb − investeringen − toename werkkapitaal − aflossingen. De vpb wordt berekend over EBITDA − afschrijvingen − rente met de schijven van de vennootschapsbelasting.',
    letop: 'Fiscale en commerciële afschrijvingen kunnen verschillen. Er is aangenomen dat alle rente aftrekbaar is en dat er geen verliezen te verrekenen zijn. Bestuurders zijn aansprakelijk bij een uitkering die de continuïteit in gevaar brengt.'
  });

  /* ===================================================== oudedagsverplichting (bestaande ODV) */

  RT.add({
    id: 'odv-oprenten', groep: 'ondernemer', naam: 'Oudedagsverplichting oprenten',
    intro: 'Een dga met een oudedagsverplichting (ODV) uit afgekocht pensioen in eigen beheer: hoe groeit het saldo door de jaarlijkse oprenting?',
    kw: 'odv oudedagsverplichting oprenting pensioen eigen beheer dga u-rendement',
    fiscaal: ['oprentingspercentage'], peildatum: N.peildatum,
    velden: [
      { k: 's', l: 'ODV-saldo nu', s: 'eur', std: 250000 },
      { k: 'reeks', l: 'Oprentingspercentages per jaar', s: 'tekst', std: '2,1; 2,5; 2,8; 3,0', breed: true, tip: 'Gescheiden door puntkomma of spatie. Laat leeg om een vast percentage te gebruiken.' },
      { k: 'vast', l: 'Vast percentage (als de reeks leeg is)', s: 'pct', std: 2.5, opt: true },
      { k: 'n', l: 'Aantal jaren bij vast percentage', s: 'num', na: 'jaar', std: 5, opt: true }
    ],
    bereken(v) {
      let pcts = lees.reeks(v.reeks);
      if (!pcts.length) pcts = Array.from({ length: Math.max(0, Math.round(v.n)) }, () => v.vast);
      if (!pcts.length) return { fout: 'Vul oprentingspercentages of een vast percentage met een aantal jaren in.' };
      let s = v.s;
      const rijen = pcts.map((p, i) => { const eff = Math.max(0, p); const oud = s; s = s * (1 + eff / 100); return ['Jaar ' + (i + 1), fmt.pct(eff, 2), fmt.euro0(s - oud), fmt.euro0(s)]; });
      return {
        lbl: 'Saldo na ' + pcts.length + ' jaar', groot: fmt.euro0(s), onder: 'oprenting ' + fmt.euro0(s - v.s),
        rijen: [
          ['Beginsaldo', fmt.euro0(v.s)],
          ['Totale oprenting', fmt.euro0(s - v.s), 'som'],
          ['Gemiddeld per jaar', v.s > 0 ? fmt.pct((Math.pow(s / v.s, 1 / pcts.length) - 1) * 100, 2) : '–']
        ],
        tabel: { kop: ['Jaar', 'Percentage', 'Oprenting', 'Saldo eind'], rijen },
        signalen: pcts.some(p => p < 0) ? ['Een negatief percentage is als 0% gerekend: het saldo daalt niet door de oprenting.'] : []
      };
    },
    uitleg: 'Elk jaar: saldo eind = saldo begin × (1 + oprentingspercentage). Het percentage volgt uit het jaarlijks gepubliceerde rendement (u-rendement); een negatief percentage leidt niet tot verlaging.',
    letop: 'Een nieuwe ODV is niet meer mogelijk: omzetting van pensioen in eigen beheer kon alleen in 2017–2019. Deze hulp is bedoeld voor bestaande ODV\'s. Het toe te passen percentage wordt jaarlijks vastgesteld; vul de gepubliceerde waarden in. Laat de ODV-administratie aansluiten op de jaarrekening van de bv.'
  });

  RT.add({
    id: 'odv-uitkeringen', groep: 'ondernemer', naam: 'Uitkeringen uit oudedagsverplichting',
    intro: 'Welke jaarlijkse uitkeringen volgen uit een bestaande ODV, als het saldo tijdens de uitkeringsfase blijft oprenten?',
    kw: 'odv uitkering oudedagsverplichting dga pensioen eigen beheer twintig jaar',
    fiscaal: ['uitkeringsduur ODV', 'box 1-tarief vanaf AOW-leeftijd'], peildatum: PEIL,
    velden: [
      { k: 's', l: 'ODV-saldo op de ingangsdatum', s: 'eur', std: 250000 },
      { k: 'n', l: 'Uitkeringsduur', s: 'num', na: 'jaar', std: N.odvDuur },
      { k: 'r', l: 'Oprenting per jaar', s: 'pct', std: 2.5 },
      { k: 'tar', l: 'Belastingtarief op de uitkering', s: 'pct', std: NM.box1.tarief1Aow, tip: 'Standaard het tarief in de eerste schijf vanaf de AOW-leeftijd.' }
    ],
    bereken(v) {
      const n = Math.round(v.n);
      if (n < 1) return { fout: 'Vul een uitkeringsduur van minstens één jaar in.' };
      let saldo = v.s, tot = 0, laatste = 0;
      const tabel = [];
      for (let k = 0; k < n; k++) {
        const u = saldo / (n - k);
        tot += u; laatste = u;
        saldo = (saldo - u) * (1 + Math.max(0, v.r) / 100);
        tabel.push([String(k + 1), fmt.euro0(u), fmt.euro0(u * (1 - v.tar / 100)), fmt.euro0(saldo)]);
      }
      const eerste = v.s / n;
      return {
        lbl: 'Eerste jaaruitkering (bruto)', groot: fmt.euro0(eerste), onder: fmt.euro0(eerste / 12) + ' per maand',
        rijen: [
          ['Netto per maand (eerste jaar, indicatief)', fmt.euro0(eerste * (1 - v.tar / 100) / 12)],
          ['Totaal uitgekeerd', fmt.euro0(tot), 'som'],
          ['Waarvan oprenting', fmt.euro0(tot - v.s)],
          ['Laatste jaaruitkering', fmt.euro0(laatste)]
        ],
        tabel: { titel: 'Verloop', kop: ['Jaar', 'Bruto', 'Netto', 'Saldo na oprenting'], rijen: tabel }
      };
    },
    uitleg: 'Elk jaar wordt het saldo gedeeld door het aantal resterende jaren; daarna rent het restant op. Zo stijgt de uitkering mee met de oprenting. Netto = bruto × (1 − tarief).',
    letop: 'De uitkeringen moeten uiterlijk vijf jaar na de AOW-datum ingaan; de duur is in de regel twintig jaar, verlengd met de jaren tussen AOW-datum en ingang. Het netto bedrag is een benadering met één tarief; heffingskortingen en ander inkomen zijn niet meegenomen. Indicatief: de uitkeringsduur staat nog niet in het centrale normenbestand.'
  });
})(window.RT);
