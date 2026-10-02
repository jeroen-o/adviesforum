/* Rekenhulpen – groep "hypotheek-woning" (Hypotheek en woning).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { annTermijn, annHoofdsom, annRest, verloop } = RT.fin;
  const { VORM2, VORM3 } = RT.keuzes;

  RT.add({
    id: 'renteherziening', groep: 'hypotheek-woning', naam: 'Maandlast na renteherziening',
    intro: 'De rentevaste periode loopt af. Wat wordt de nieuwe bruto maandlast over de schuld die dan nog openstaat?',
    velden: [
      { k: 'h', l: 'Oorspronkelijke hoofdsom', s: 'eur', std: 320000 },
      { k: 'jr', l: 'Totale looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'ro', l: 'Huidige rente', s: 'pct', std: 1.9 },
      { k: 'rn', l: 'Rente voor de nieuwe periode', s: 'pct', std: 4.1 },
      { k: 'vj', l: 'Jaren verstreken bij herziening', s: 'num', na: 'jaar', std: 10 },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM2, std: 'ann' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), k = Math.round(v.vj * 12);
      if (n <= 0 || k < 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      if (k >= n) return { fout: 'Het aantal verstreken jaren moet kleiner zijn dan de totale looptijd.' };
      const io = v.ro / 1200, inw = v.rn / 1200;
      let rest, oud, nieuw;
      if (v.vorm === 'ann') {
        rest = annRest(v.h, io, n, k);
        oud = annTermijn(v.h, io, n);
        nieuw = annTermijn(rest, inw, n - k);
      } else {
        const afl = v.h / n;
        rest = v.h - afl * k;
        oud = afl + rest * io;
        nieuw = afl + rest * inw;
      }
      const verschil = nieuw - oud;
      return {
        lbl: 'Nieuwe bruto maandlast', groot: fmt.euro(nieuw),
        onder: v.vorm === 'ann' ? 'gelijk over de resterende ' + fmt.duur(n - k) : 'eerste termijn van de nieuwe periode; daalt daarna',
        rijen: [
          ['Openstaande schuld bij herziening', fmt.euro(rest)],
          [v.vorm === 'ann' ? 'Maandlast tegen huidige rente' : 'Termijn als de rente gelijk was gebleven', fmt.euro(oud)],
          ['Verschil per maand', (verschil >= 0 ? '+ ' : '') + fmt.euro(verschil), 'som'],
          ['Rentedeel eerste maand nieuwe periode', fmt.euro(rest * inw)]
        ],
        signalen: verschil > 0 && oud > 0 && verschil / oud > 0.2 ? ['De maandlast stijgt met meer dan 20%. Bespreek tijdig of de nieuwe last past binnen het budget.'] : []
      };
    },
    uitleg: 'Restschuld = schuld na het aantal verstreken maandtermijnen. Annuïtair: nieuwe termijn = restschuld × i / (1 − (1 + i)<sup>−m</sup>), met i = nieuwe jaarrente / 12 en m = resterende maanden. Lineair: vaste aflossing + restschuld × i.',
    letop: 'Fiscaal blijft de oorspronkelijke aflosverplichting (30-jaarstermijn) leidend voor de eigenwoningschuld. De geldverstrekker kan een renteopslag rekenen op basis van de actuele LTV.'
  });

  RT.add({
    id: 'rentemix', groep: 'hypotheek-woning', naam: 'Gewogen rente over leningdelen',
    intro: 'Eén percentage voor een hypotheek die uit meerdere delen met elk een eigen rente bestaat.',
    velden: [
      { k: 'b1', l: 'Leningdeel 1', s: 'eur', std: 210000, opt: true }, { k: 'r1', l: 'Rente deel 1', s: 'pct', std: 3.75, opt: true },
      { k: 'b2', l: 'Leningdeel 2', s: 'eur', std: 95000, opt: true }, { k: 'r2', l: 'Rente deel 2', s: 'pct', std: 4.35, opt: true },
      { k: 'b3', l: 'Leningdeel 3', s: 'eur', std: 40000, opt: true, tip: 'Laat op 0 als het deel er niet is.' }, { k: 'r3', l: 'Rente deel 3', s: 'pct', std: 2.6, opt: true },
      { k: 'b4', l: 'Leningdeel 4', s: 'eur', std: 0, opt: true }, { k: 'r4', l: 'Rente deel 4', s: 'pct', std: 0, opt: true }
    ],
    bereken(v) {
      const delen = [1, 2, 3, 4].map(x => [v['b' + x] || 0, v['r' + x] || 0]).filter(d => d[0] > 0);
      const tot = delen.reduce((s, d) => s + d[0], 0);
      if (!tot) return { fout: 'Vul minstens één leningdeel in.' };
      const renteJaar = delen.reduce((s, d) => s + d[0] * d[1] / 100, 0);
      const gem = renteJaar / tot * 100;
      return {
        lbl: 'Gewogen gemiddelde rente', groot: fmt.pct(gem, 3), onder: 'over ' + delen.length + (delen.length === 1 ? ' deel' : ' delen'),
        rijen: [
          ['Totale schuld', fmt.euro(tot)],
          ['Bruto rente per jaar (beginstand)', fmt.euro(renteJaar)],
          ['Bruto rente eerste maand', fmt.euro(renteJaar / 12), 'som']
        ],
        tabel: {
          kop: ['Deel', 'Bedrag', 'Rente', 'Aandeel', 'Rente per maand'],
          rijen: delen.map((d, i) => ['Deel ' + (i + 1), fmt.euro0(d[0]), fmt.pct(d[1]), fmt.pct(d[0] / tot * 100, 1), fmt.euro(d[0] * d[1] / 1200)])
        }
      };
    },
    uitleg: 'Gewogen rente = Σ (bedrag × rente) / Σ bedrag. Gewogen naar de huidige stand van elk deel.',
    letop: 'Rentevaste perioden en aflosvormen per deel tellen niet mee. Door aflossen verschuift de verhouding tussen de delen, en daarmee het gemiddelde.'
  });

  RT.add({
    id: 'budgetlening', groep: 'hypotheek-woning', naam: 'Lening bij een vast maandbudget',
    intro: 'Rekent terug: welke hoofdsom hoort bij een bruto maandlast die de klant wil of kan dragen?',
    velden: [
      { k: 't', l: 'Gewenste bruto maandlast', s: 'eur', std: 1650 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 4.0 },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: [['ann', 'Annuïtair'], ['lin', 'Lineair (eerste termijn)'], ['vrij', 'Aflossingsvrij']], std: 'ann' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), i = v.r / 1200;
      if (n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      let h, renteTot;
      if (v.vorm === 'ann') { h = annHoofdsom(v.t, i, n); renteTot = v.t * n - h; }
      else if (v.vorm === 'lin') { h = v.t / (1 / n + i); renteTot = h * i * (n + 1) / 2; }
      else { if (i === 0) return { fout: 'Bij aflossingsvrij is een rente groter dan nul nodig.' }; h = v.t / i; renteTot = v.t * n; }
      return {
        lbl: 'Hoofdsom die bij dit maandbedrag past', groot: fmt.euro0(Math.floor(h)),
        onder: v.vorm === 'vrij' ? 'zonder aflossing; de schuld blijft staan' : 'rekenkundig, zonder toets aan inkomen',
        rijen: [
          ['Rente in de eerste maand', fmt.euro(h * i)],
          ['Aflossing in de eerste maand', fmt.euro(v.vorm === 'vrij' ? 0 : v.t - h * i)],
          ['Totale bruto rente over de looptijd', fmt.euro0(renteTot), 'som']
        ],
        signalen: ['Dit is géén maximale hypotheek. Toets de leencapaciteit altijd aan de leennormen: zie <a href="leennormen-2026.html">Leennormen 2026</a>.']
      };
    },
    uitleg: 'Annuïtair: H = T × (1 − (1 + i)<sup>−n</sup>) / i. Lineair: H = T / (1/n + i), gebaseerd op de eerste (hoogste) termijn. Aflossingsvrij: H = T / i. Daarbij i = jaarrente / 12 en n = looptijd in maanden.',
    letop: 'Verantwoorde kredietverlening vraagt een toets op inkomen, lasten en LTV. Gebruik deze uitkomst alleen als oriëntatie in het gesprek.'
  });

  RT.add({
    id: 'uitkoop', groep: 'hypotheek-woning', naam: 'Partner uitkopen uit de woning',
    intro: 'Wat moet de achterblijvende partner betalen bij een scheiding, en hoe hoog wordt de nieuwe financiering?',
    velden: [
      { k: 'w', l: 'Waarde van de woning', s: 'eur', std: 440000, tip: 'Getaxeerde of afgesproken waarde.' },
      { k: 's', l: 'Huidige hypotheekschuld', s: 'eur', std: 265000 },
      { k: 'ae', l: 'Aandeel vertrekkende partner in de woning', s: 'pct', std: 50 },
      { k: 'as', l: 'Aandeel vertrekkende partner in de schuld', s: 'pct', std: 50 },
      { k: 'kst', l: 'Bijkomende kosten', s: 'eur', std: 5500, opt: true, tip: 'Bijvoorbeeld notaris, taxatie en advies.' },
      { k: 'eg', l: 'Inbreng eigen geld', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const som = v.ae / 100 * v.w - v.as / 100 * v.s;
      const nieuw = Math.max(0, v.s + som + v.kst - v.eg);
      const ltv = v.w > 0 ? nieuw / v.w * 100 : NaN;
      const sig = [];
      if (som < 0) sig.push('Er is onderwaarde: de vertrekkende partner betaalt ' + fmt.euro0(-som) + ' bij in plaats van te ontvangen.');
      if (ltv > 100) sig.push('De nieuwe lening is hoger dan de woningwaarde. Controleer de mogelijkheden in <a href="ltv.html">Loan-to-value</a>.');
      return {
        lbl: som >= 0 ? 'Uitkoopsom voor de vertrekkende partner' : 'Bijbetaling door de vertrekkende partner',
        groot: fmt.euro0(Math.abs(som)),
        onder: 'aandeel in de waarde minus aandeel in de schuld',
        rijen: [
          ['Overwaarde van de woning', fmt.euro0(v.w - v.s)],
          ['Aandeel in de waarde', fmt.euro0(v.ae / 100 * v.w)],
          ['Aandeel in de schuld', '− ' + fmt.euro0(v.as / 100 * v.s)],
          ['Benodigde nieuwe financiering', fmt.euro0(nieuw), 'som'],
          ['Lening ten opzichte van de waarde', fmt.pct(ltv, 1)]
        ],
        signalen: sig
      };
    },
    uitleg: 'Uitkoopsom = aandeel woning × waarde − aandeel schuld × schuld. Nieuwe financiering = huidige schuld + uitkoopsom + kosten − eigen geld.',
    letop: 'Afspraken in het convenant of de huwelijkse voorwaarden gaan voor. De fiscale kwalificatie van het uitkoopdeel en het ontslag uit de hoofdelijke aansprakelijkheid beoordeel je apart (zie ook <a href="bijleenregeling.html">Bijleenregeling</a> en <a href="draagplicht.html">Draagplicht</a>).'
  });

  RT.add({
    id: 'waardeprognose', groep: 'hypotheek-woning', naam: 'Woningwaarde vooruit',
    intro: 'Een scenario voor de waarde van de woning over een aantal jaren, bij een vaste stijging of daling per jaar.',
    velden: [
      { k: 'w', l: 'Huidige waarde', s: 'eur', std: 395000 },
      { k: 'g', l: 'Waardeverandering per jaar', s: 'pct', std: 2.5, tip: 'Gebruik een minteken voor daling, bijvoorbeeld -1,5.' },
      { k: 'jr', l: 'Aantal jaren', s: 'num', na: 'jaar', std: 10 },
      { k: 's', l: 'Verwachte schuld op dat moment', s: 'eur', std: 250000, opt: true, tip: 'Optioneel, voor de overwaarde.' }
    ],
    bereken(v) {
      const jaren = Math.round(v.jr);
      if (jaren < 0 || jaren > 100) return { fout: 'Kies een aantal jaren tussen 0 en 100.' };
      const f = 1 + v.g / 100, eind = v.w * Math.pow(f, jaren);
      const rijen = [];
      for (let j = 1; j <= jaren; j++) { const w = v.w * Math.pow(f, j); rijen.push([String(j), fmt.euro0(w), fmt.euro0(w - v.w)]); }
      return {
        lbl: 'Waarde over ' + jaren + ' jaar', groot: fmt.euro0(eind), onder: 'bij ' + fmt.pct(v.g, 1) + ' per jaar',
        rijen: [
          ['Verandering ten opzichte van nu', (eind >= v.w ? '+ ' : '') + fmt.euro0(eind - v.w)],
          ['Overwaarde bij opgegeven schuld', fmt.euro0(eind - v.s), 'som'],
          ['Schuld ten opzichte van de waarde', fmt.pct(eind > 0 ? v.s / eind * 100 : NaN, 1)]
        ],
        tabel: { kop: ['Jaar', 'Waarde', 'Verandering'], rijen }
      };
    },
    uitleg: 'Waarde na j jaar = huidige waarde × (1 + verandering)<sup>j</sup>.',
    letop: 'Een prognose is geen taxatie. Reken in een advies ook een scenario met waardedaling door, zeker bij een hoge LTV.'
  });

  RT.add({
    id: 'verduurzamen', groep: 'hypotheek-woning', naam: 'Terugverdientijd verduurzaming',
    intro: 'Isolatie, zonnepanelen of een warmtepomp: na hoeveel jaar heeft de besparing de investering terugbetaald?',
    velden: [
      { k: 'inv', l: 'Investering', s: 'eur', std: 14000 },
      { k: 'sub', l: 'Subsidie of teruggave', s: 'eur', std: 3000, opt: true },
      { k: 'bes', l: 'Besparing in het eerste jaar', s: 'eur', std: 1100 },
      { k: 'pst', l: 'Stijging energieprijs per jaar', s: 'pct', std: 2 },
      { k: 'lv', l: 'Verwachte levensduur', s: 'num', na: 'jaar', std: 20 },
      { k: 'fr', l: 'Rente bij financieren', s: 'pct', std: 4.2, opt: true, tip: 'Op 0 laten bij betalen uit eigen geld.' },
      { k: 'fj', l: 'Looptijd financiering', s: 'num', na: 'jaar', std: 15 }
    ],
    bereken(v) {
      const netto = Math.max(0, v.inv - v.sub);
      if (v.bes <= 0) return { fout: 'Vul een besparing groter dan nul in.' };
      const groei = 1 + v.pst / 100, lv = Math.round(v.lv);
      let cum = 0, tvt = NaN, totaal = 0;
      for (let j = 1; j <= 100; j++) {
        const b = v.bes * Math.pow(groei, j - 1);
        if (Number.isNaN(tvt) && cum + b >= netto) tvt = j - 1 + (netto - cum) / b;
        cum += b;
        if (j <= lv) totaal = cum;
      }
      const rijen = [
        ['Netto investering', fmt.euro0(netto)],
        ['Eenvoudige terugverdientijd', fmt.getal(netto / v.bes, 1) + ' jaar'],
        ['Besparing over de levensduur', fmt.euro0(totaal)],
        ['Saldo na de levensduur', fmt.euro0(totaal - netto), 'som']
      ];
      const sig = [];
      if (v.fr > 0 && v.fj > 0 && netto > 0) {
        const last = annTermijn(netto, v.fr / 1200, Math.round(v.fj * 12));
        rijen.push(['Bruto maandlast bij financieren', fmt.euro(last)], ['Besparing per maand in jaar 1', fmt.euro(v.bes / 12)]);
        if (last > v.bes / 12) sig.push('In het eerste jaar is de bruto maandlast van de financiering hoger dan de maandelijkse besparing.');
      }
      if (!(tvt <= lv)) sig.push('De investering verdient zich niet terug binnen de opgegeven levensduur.');
      return {
        lbl: 'Terugverdientijd met prijsstijging', groot: Number.isFinite(tvt) ? fmt.getal(tvt, 1) + ' jaar' : 'meer dan 100 jaar',
        onder: 'zonder rentekosten en onderhoud', rijen, signalen: sig
      };
    },
    uitleg: 'Besparing in jaar j = besparing jaar 1 × (1 + prijsstijging)<sup>j−1</sup>. De terugverdientijd is het moment waarop de opgetelde besparing de netto investering bereikt (binnen het jaar lineair verdeeld). Maandlast financiering: annuïtair, rente / 12.',
    letop: 'De besparing is een schatting van de klant of leverancier. Extra leenruimte voor energiebesparende voorzieningen volgt uit de leennormen, zie <a href="leennormen-2026.html">Leennormen 2026</a>; subsidievoorwaarden veranderen regelmatig.'
  });

  RT.add({
    id: 'offertes', groep: 'hypotheek-woning', naam: 'Twee aanbiedingen vergelijken',
    intro: 'Lagere rente of lagere kosten? Zet twee aanbiedingen voor hetzelfde bedrag naast elkaar over een gekozen periode, bijvoorbeeld de rentevaste periode.',
    velden: [
      { k: 'h', l: 'Leenbedrag', s: 'eur', std: 300000 },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'vp', l: 'Vergelijken over', s: 'num', na: 'jaar', std: 10, tip: 'Meestal de rentevaste periode.' },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM3, std: 'ann' },
      { k: 'ra', l: 'Rente aanbieding A', s: 'pct', std: 3.95 },
      { k: 'ka', l: 'Eenmalige kosten A', s: 'eur', std: 0, opt: true },
      { k: 'rb', l: 'Rente aanbieding B', s: 'pct', std: 3.8 },
      { k: 'kb', l: 'Eenmalige kosten B', s: 'eur', std: 2500, opt: true, tip: 'Bijvoorbeeld afsluitprovisie of een hogere taxatie- of adviesvergoeding.' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), k = Math.round(v.vp * 12);
      if (v.h <= 0 || n <= 0 || k <= 0) return { fout: 'Vul een bedrag, looptijd en vergelijkingsperiode groter dan nul in.' };
      if (k > n) return { fout: 'De vergelijkingsperiode kan niet langer zijn dan de looptijd.' };
      const ia = v.ra / 1200, ib = v.rb / 1200;
      const A = verloop(v.h, ia, n, k, v.vorm), B = verloop(v.h, ib, n, k, v.vorm);
      const totA = A.rente + v.ka, totB = B.rente + v.kb, vers = totA - totB;
      const goedkoper = Math.abs(vers) < 0.5 ? 'gelijk' : (vers > 0 ? 'B' : 'A');
      // na hoeveel maanden heeft de lagere rente de hogere kosten ingehaald?
      let inhaal = NaN;
      const lageRente = ia < ib ? 'A' : ib < ia ? 'B' : null;
      if (lageRente) {
        const kLaag = lageRente === 'A' ? v.ka : v.kb, kHoog = lageRente === 'A' ? v.kb : v.ka;
        if (kLaag <= kHoog) inhaal = 0;
        else for (let m = 1; m <= n; m++) {
          const rl = verloop(v.h, Math.min(ia, ib), n, m, v.vorm).rente, rh = verloop(v.h, Math.max(ia, ib), n, m, v.vorm).rente;
          if (rh - rl >= kLaag - kHoog) { inhaal = m; break; }
        }
      }
      const sig = [];
      if (lageRente && inhaal > 0) sig.push('De lagere rente van aanbieding ' + lageRente + ' heeft de extra kosten na ' + fmt.duur(inhaal) + ' terugverdiend' + (inhaal > k ? ', dus pas ná de vergelijkingsperiode.' : '.'));
      if (v.vorm !== 'vrij' && Math.abs(A.rest - B.rest) >= 1) sig.push('Bij de lagere rente wordt sneller afgelost: de restschuld aan het eind van de periode verschilt ' + fmt.euro0(Math.abs(A.rest - B.rest)) + '.');
      return {
        lbl: goedkoper === 'gelijk' ? 'Beide aanbiedingen kosten evenveel' : 'Voordeligst over ' + fmt.duur(k) + ': aanbieding ' + goedkoper,
        groot: fmt.euro0(Math.abs(vers)), onder: 'verschil in rente plus kosten, bruto',
        rijen: [
          ['Eerste maandtermijn A', fmt.euro(A.termijn)],
          ['Eerste maandtermijn B', fmt.euro(B.termijn)],
          ['Rente plus kosten A', fmt.euro0(totA)],
          ['Rente plus kosten B', fmt.euro0(totB)],
          ['Restschuld A na de periode', fmt.euro0(A.rest)],
          ['Restschuld B na de periode', fmt.euro0(B.rest), 'som']
        ],
        signalen: sig
      };
    },
    uitleg: 'Per aanbieding: bruto rente over de gekozen periode + eenmalige kosten. Annuïtair: rente = termijn × k − (hoofdsom − restschuld na k maanden); lineair: i × (k × H − aflossing × k × (k − 1) / 2); aflossingsvrij: H × i × k, met i = jaarrente / 12. Het inhaalmoment is de eerste maand waarin het renteverschil de extra kosten overtreft.',
    letop: 'Een vergelijking op rente en kosten alleen is geen productvergelijking: voorwaarden als boetevrij aflossen, meeneemregeling, verlengen, renteopslag per LTV-klasse en de geldigheid van het aanbod tellen ook mee. Kosten zijn hier niet verdisconteerd en fiscale aftrek is niet meegenomen.'
  });

  RT.add({
    id: 'bouwdepot', groep: 'hypotheek-woning', naam: 'Woonlasten tijdens de bouw',
    intro: 'Bij nieuwbouw of verbouw betaalt de klant rente over de hele lening, terwijl het bouwdepot nog rente opbrengt. Wat is de bruto last per maand totdat het depot leeg is?',
    velden: [
      { k: 'h', l: 'Hypotheek inclusief bouwdepot', s: 'eur', std: 360000 },
      { k: 'd', l: 'Bouwdepot bij de start', s: 'eur', std: 150000 },
      { k: 'r', l: 'Hypotheekrente', s: 'pct', std: 3.9 },
      { k: 'rd', l: 'Rentevergoeding over het depot', s: 'pct', std: 3.4, tip: 'Volgt uit de voorwaarden van de geldverstrekker.' },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM3, std: 'ann' },
      { k: 'bt', l: 'Bouwtijd', s: 'num', na: 'mnd', std: 12, tip: 'Het depot wordt in gelijke delen opgenomen, aan het eind van elke maand.' },
      { k: 'huur', l: 'Huidige woonlast (huur)', s: 'eur', std: 1250, opt: true, tip: 'Optioneel, voor de dubbele lasten.' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), bt = Math.round(v.bt), i = v.r / 1200, id = v.rd / 1200;
      if (v.h <= 0 || n <= 0 || bt <= 0) return { fout: 'Vul een hypotheek, looptijd en bouwtijd groter dan nul in.' };
      if (v.d > v.h) return { fout: 'Het bouwdepot kan niet groter zijn dan de hypotheek.' };
      if (bt > n) return { fout: 'De bouwtijd is langer dan de looptijd.' };
      let totVerg = 0, totLast = 0, eerste = 0, laatste = 0;
      const rijen = [];
      for (let m = 1; m <= bt; m++) {
        const termijn = v.vorm === 'lin' ? v.h / n + (v.h - v.h / n * (m - 1)) * i : verloop(v.h, i, n, 0, v.vorm).termijn;
        const saldo = v.d * (bt - m + 1) / bt, verg = saldo * id, netto = termijn - verg;
        totVerg += verg; totLast += netto;
        if (m === 1) eerste = netto; if (m === bt) laatste = netto;
        rijen.push([String(m), fmt.euro0(saldo), fmt.euro(termijn), fmt.euro(verg), fmt.euro(netto), fmt.euro(netto + v.huur)]);
      }
      const sig = [];
      if (v.huur > 0) sig.push('Samen met de huidige woonlast betaalt de klant gemiddeld ' + fmt.euro(totLast / bt + v.huur) + ' per maand zolang de bouw duurt.');
      return {
        lbl: 'Gemiddelde bruto last tijdens de bouw', groot: fmt.euro(totLast / bt), onder: 'per maand, na aftrek van de depotrente',
        rijen: [
          ['Last in de eerste maand', fmt.euro(eerste)],
          ['Last in de laatste bouwmaand', fmt.euro(laatste)],
          ['Ontvangen depotrente in de bouwtijd', fmt.euro0(totVerg)],
          ['Bruto lasten over de hele bouwtijd', fmt.euro0(totLast)],
          ['Dubbele woonlasten over de bouwtijd', fmt.euro0(totLast + v.huur * bt), 'som']
        ],
        tabel: { kop: ['Maand', 'Depot', 'Termijn', 'Depotrente', 'Last', 'Plus huur'], rijen },
        signalen: sig
      };
    },
    uitleg: 'Termijn over de volledige hypotheek (annuïtair, lineair of aflossingsvrij, i = rente / 12). Depotsaldo in maand m = depot × (bouwtijd − m + 1) / bouwtijd. Last = termijn − depotsaldo × depotrente / 12. Dubbele lasten = last + huidige woonlast.',
    letop: 'Werkelijke opnames volgen de termijnen van de aannemer en lopen zelden gelijk op. Grondrente of bouwrente vóór het passeren, de maximale looptijd van het depot en de fiscale behandeling (aftrekbare rente verminderd met de depotvergoeding) zijn hier niet meegenomen. Neem dubbele lasten mee in de betaalbaarheidsbeoordeling.'
  });

  RT.add({
    id: 'risicoklasse', groep: 'hypotheek-woning', naam: 'Aflossen naar een lagere risicoklasse',
    intro: 'Hoeveel moet de klant aflossen om onder de volgende LTV-grens van de geldverstrekker te komen, en wat levert dat per jaar op?',
    velden: [
      { k: 'w', l: 'Marktwaarde van de woning', s: 'eur', std: 400000 },
      { k: 's', l: 'Huidige hypotheekschuld', s: 'eur', std: 332000 },
      { k: 'g', l: 'Grens van de lagere klasse', s: 'pct', std: 80, tip: 'De LTV-grens uit de rentetabel van de geldverstrekker.' },
      { k: 'rn', l: 'Huidige rente', s: 'pct', std: 4.05 },
      { k: 'rl', l: 'Rente in de lagere klasse', s: 'pct', std: 3.9 },
      { k: 'jr', l: 'Resterende rentevaste periode', s: 'num', na: 'jaar', std: 8 }
    ],
    bereken(v) {
      if (v.w <= 0 || v.s <= 0) return { fout: 'Vul een woningwaarde en schuld groter dan nul in.' };
      const ltv = v.s / v.w * 100, nodig = Math.ceil(v.s - v.g / 100 * v.w);
      if (nodig <= 0) return { lbl: 'Benodigde aflossing', groot: fmt.euro0(0), onder: 'de schuld ligt al op of onder de grens', rijen: [['Huidige LTV', fmt.pct(ltv, 1)]] };
      const besparing = v.s * v.rn / 100 - (v.s - nodig) * v.rl / 100;
      const opslag = (v.s - nodig) * (v.rn - v.rl) / 100;
      const sig = [];
      if (v.rl >= v.rn) sig.push('De rente in de lagere klasse is niet lager; alleen de afgeloste rente wordt bespaard.');
      return {
        lbl: 'Benodigde extra aflossing', groot: fmt.euro0(nodig), onder: 'van ' + fmt.pct(ltv, 1) + ' naar ' + fmt.pct(v.g, 1) + ' LTV',
        rijen: [
          ['Rentebesparing per jaar, totaal', fmt.euro0(besparing)],
          ['waarvan door minder schuld', fmt.euro0(nodig * v.rn / 100)],
          ['waarvan door de lagere opslag', fmt.euro0(opslag)],
          ['Bruto rendement op de aflossing', fmt.pct(besparing / nodig * 100, 2), 'som'],
          ['Besparing over de rentevaste periode (indicatie)', fmt.euro0(besparing * v.jr)]
        ],
        signalen: sig
      };
    },
    uitleg: 'Benodigde aflossing = schuld − grens × marktwaarde. Besparing per jaar = schuld × huidige rente − (schuld − aflossing) × lagere rente. Rendement = besparing / aflossing. De indicatie over de periode is besparing × jaren, zonder verdere aflossing.',
    letop: 'Klassen, opslagen en het moment waarop een lagere klasse wordt toegepast verschillen per geldverstrekker; vaak is een nieuwe taxatie (met kosten) nodig. Controleer de boetevrije ruimte. Bedragen zijn bruto: door minder aftrekbare rente is het netto voordeel lager. Houd voldoende vrij beschikbare buffer aan.'
  });

  RT.add({
    id: 'onderwaarde', groep: 'hypotheek-woning', naam: 'Tijd tot geen onderwaarde',
    intro: 'De schuld is hoger dan de woningwaarde. Na hoeveel tijd is dat ingehaald door aflossen en waardeontwikkeling?',
    velden: [
      { k: 'w', l: 'Huidige woningwaarde', s: 'eur', std: 310000 },
      { k: 's', l: 'Huidige hypotheekschuld', s: 'eur', std: 345000 },
      { k: 'r', l: 'Hypotheekrente', s: 'pct', std: 3.8 },
      { k: 'jr', l: 'Resterende looptijd', s: 'num', na: 'jaar', std: 26 },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM3, std: 'ann' },
      { k: 'x', l: 'Extra aflossing per maand', s: 'eur', std: 150, opt: true },
      { k: 'g', l: 'Waardeverandering per jaar', s: 'pct', std: 1, tip: 'Gebruik een minteken voor daling.' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), i = v.r / 1200;
      if (v.w <= 0 || v.s <= 0 || n <= 0) return { fout: 'Vul waarde, schuld en looptijd groter dan nul in.' };
      if (v.s <= v.w) return { lbl: 'Tijd tot geen onderwaarde', groot: 'nu al', onder: 'de schuld is niet hoger dan de waarde', rijen: [['Overwaarde', fmt.euro0(v.w - v.s)]] };
      const t = v.vorm === 'ann' ? annTermijn(v.s, i, n) : 0, afl = v.vorm === 'lin' ? v.s / n : 0;
      let schuld = v.s, m = 0, waarde = v.w, afgelost = 0;
      const rijen = [], gm = Math.pow(1 + v.g / 100, 1 / 12);
      while (schuld > waarde && m < 1200) {
        m++;
        const regulier = v.vorm === 'ann' ? t - schuld * i : afl;
        const af = Math.min(schuld, Math.max(0, regulier) + v.x);
        schuld -= af; afgelost += af; waarde *= gm;
        if (m % 12 === 0) rijen.push([String(m / 12), fmt.euro0(waarde), fmt.euro0(schuld), fmt.euro0(waarde - schuld)]);
      }
      if (schuld > waarde) return { fout: 'Binnen 100 jaar verdwijnt de onderwaarde niet. Reken met extra aflossing of een andere waardeontwikkeling.' };
      return {
        lbl: 'Tijd tot geen onderwaarde', groot: fmt.duur(m), onder: 'bij ' + fmt.pct(v.g, 1) + ' waardeverandering per jaar',
        rijen: [
          ['Huidige onderwaarde', fmt.euro0(v.s - v.w)],
          ['Afgelost tot dat moment', fmt.euro0(afgelost)],
          ['Waarde op dat moment', fmt.euro0(waarde)],
          ['Schuld op dat moment', fmt.euro0(schuld), 'som']
        ],
        tabel: rijen.length ? { kop: ['Jaar', 'Waarde', 'Schuld', 'Over- of onderwaarde'], rijen } : null
      };
    },
    uitleg: 'Per maand: reguliere aflossing (annuïtair: termijn − schuld × i; lineair: oorspronkelijke schuld / maanden; aflossingsvrij: 0) plus extra aflossing; waarde × (1 + verandering)<sup>1/12</sup>. Doorgerekend tot de schuld niet meer boven de waarde ligt.',
    letop: 'De waardeontwikkeling is een aanname. Bij een verhuizing met onderwaarde gelden aparte regels voor financiering van de restschuld en de fiscale behandeling; bespreek ook de risicoklasse en de gevolgen bij gedwongen verkoop. Gebruik de marktwaarde, niet de WOZ-waarde, tenzij de geldverstrekker anders aangeeft.'
  });

  RT.add({
    id: 'verzilveren', groep: 'hypotheek-woning', naam: 'Overwaarde verzilveren met bijgeschreven rente',
    intro: 'Senioren die maandelijks geld opnemen uit de woning, terwijl de rente bij de schuld wordt opgeteld. Hoe groeit de schuld en wanneer is de leengrens bereikt?',
    velden: [
      { k: 'w', l: 'Woningwaarde', s: 'eur', std: 620000 },
      { k: 's', l: 'Bestaande schuld bij de start', s: 'eur', std: 60000, opt: true },
      { k: 'e', l: 'Eenmalige opname bij de start', s: 'eur', std: 0, opt: true },
      { k: 'op', l: 'Opname per maand', s: 'eur', std: 750 },
      { k: 'r', l: 'Rente', s: 'pct', std: 5.4 },
      { k: 'jr', l: 'Periode', s: 'num', na: 'jaar', std: 15 },
      { k: 'g', l: 'Waardeverandering per jaar', s: 'pct', std: 1.5 },
      { k: 'max', l: 'Maximale schuld als deel van de waarde', s: 'pct', std: 50, tip: 'Grens van de geldverstrekker; vaak afhankelijk van de leeftijd.' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), i = v.r / 1200, gm = Math.pow(1 + v.g / 100, 1 / 12);
      if (v.w <= 0 || n <= 0 || n > 600) return { fout: 'Vul een woningwaarde en een periode tussen 1 en 50 jaar in.' };
      let schuld = v.s + v.e, waarde = v.w, rente = 0, grens = 0;
      const rijen = [];
      if (schuld > v.max / 100 * waarde) grens = -1;
      for (let m = 1; m <= n; m++) {
        const ri = schuld * i; rente += ri; schuld += ri + v.op; waarde *= gm;
        if (!grens && schuld > v.max / 100 * waarde) grens = m;
        if (m % 12 === 0) rijen.push([String(m / 12), fmt.euro0(waarde), fmt.euro0(schuld), fmt.pct(schuld / waarde * 100, 1)]);
      }
      const sig = [];
      if (grens === -1) sig.push('De schuld ligt bij de start al boven de opgegeven grens.');
      else if (grens) sig.push('De grens van ' + fmt.pct(v.max, 0) + ' van de waarde wordt overschreden na ' + fmt.duur(grens) + '. Daarna stopt de opname meestal, terwijl de rente blijft oplopen.');
      return {
        lbl: 'Schuld na ' + fmt.duur(n), groot: fmt.euro0(schuld), onder: 'inclusief bijgeschreven rente',
        rijen: [
          ['Totaal opgenomen', fmt.euro0(v.e + v.op * n)],
          ['Bijgeschreven rente', fmt.euro0(rente)],
          ['Woningwaarde op dat moment', fmt.euro0(waarde)],
          ['Schuld als deel van de waarde', fmt.pct(schuld / waarde * 100, 1)],
          ['Resterende overwaarde', fmt.euro0(waarde - schuld), 'som']
        ],
        tabel: { kop: ['Jaar', 'Waarde', 'Schuld', 'Schuld / waarde'], rijen },
        signalen: sig
      };
    },
    uitleg: 'Per maand: schuld + schuld × rente / 12 + opname. Waarde per maand × (1 + verandering)<sup>1/12</sup>. De grens is bereikt in de eerste maand waarin schuld > grens × waarde.',
    letop: 'De rente-op-rente-groei maakt deze vorm gevoelig voor een lange levensduur en waardedaling. Productvoorwaarden (maximale opname per leeftijd, renteberekening, aflossing bij overlijden of verhuizing) verschillen per aanbieder. Bespreek gevolgen voor erfgenamen en toeslagen, en de fiscale behandeling (vaak box 3) apart. Doe een betaalbaarheidstoets: zie <a href="restschuld-pensioen.html">Restschuld bij pensioen</a>.'
  });
})(window.RT);
