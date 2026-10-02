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

  /* =====================================================================
   * Fase 2 – uitbreiding hypotheek en woning
   * ===================================================================== */
  {
    const NR = RT.normen, F = RT.fisc, PEIL = RT.normen.peildatum;
    const { JANEE, MOMENT } = RT.keuzes;
    const { eindwaarde, maandUitJaar } = RT.fin;
    /* Normen en aannames die (nog) niet in normen.js staan.
     * Peildatum 2026 – waarde uit bron, niet geverifieerd. Hulpen die ze gebruiken melden dat in 'Let op'. */
    const N = {
      peildatum: '2026',
      toetsrenteKortVast: 5,          // toetsrente bij rentevast korter dan 10 jaar – waarde uit bron, niet geverifieerd
      financieringslastPct: 28.5,     // voorbeeld-financieringslastpercentage (hangt af van inkomen en rente) – waarde uit bron, niet geverifieerd
      maxLtv: 100,                    // maximale lening als % van de marktwaarde – waarde uit bron, niet geverifieerd
      tijdelijkeVerhuurPct: 70,       // belast deel van de opbrengst bij tijdelijke verhuur eigen woning – waarde uit bron, niet geverifieerd
      renteVooruitMaanden: 6,         // maximaal aantal maanden rente vooruit aftrekbaar – waarde uit bron, niet geverifieerd
      aflossingseisMaanden: 360,      // aflossingseis: ten minste annuïtair in 360 maanden – waarde uit bron, niet geverifieerd
      hillenAfbouwPerJaar: 10 / 3     // afbouw aftrek geringe eigenwoningschuld per jaar (procentpunt) – waarde uit bron, niet geverifieerd
    };
    const INDICATIEF = 'Indicatief: deze berekening gebruikt normen met peildatum ' + N.peildatum + ' die nog niet zijn geverifieerd; controleer de actuele norm.';
    const tarief = t => Math.min(t, NR.aftrekTariefMax);
    const forfaitVan = woz => F.eigenWoning(0, woz).forfait;
    const hillenPct = jaar => Math.max(0, NR.eigenWoning.hillenAfbouwPct - Math.max(0, jaar - Number(PEIL)) * N.hillenAfbouwPerJaar);
    // Saldo eigen woning met aftrek wegens geringe schuld; jaar bepaalt het afbouwpercentage
    const ewSaldo = (rente, woz, tar, jaar = Number(PEIL)) => {
      const forfait = forfaitVan(woz);
      let saldo = rente - forfait, hillen = 0;
      if (saldo < 0) { hillen = -saldo * hillenPct(jaar) / 100; saldo += hillen; }
      return { forfait, saldo, hillen, voordeel: saldo * tar / 100 };
    };
    // Verloop per jaar: rente, aflossing en schuld aan het eind van elk jaar
    const perJaar = (h, i, n, vorm) => {
      const uit = [];
      let vorige = verloop(h, i, n, 0, vorm);
      for (let j = 1; (j - 1) * 12 < n; j++) {
        const x = verloop(h, i, n, Math.min(n, j * 12), vorm);
        uit.push({ j, rente: x.rente - vorige.rente, afl: vorige.rest - x.rest, rest: x.rest });
        vorige = x;
      }
      return uit;
    };
    const ovbPct = (starter, koopsom) => starter === 'ja' && koopsom <= NR.ovb.startersWoningwaardeGrens ? NR.ovb.startersVrijstelling : NR.ovb.eigenWoning;
    const VORMNAAM = { ann: 'annuïtair', lin: 'lineair', vrij: 'aflossingsvrij' };

    RT.add({
      id: 'netto-maandlast-hypotheek', groep: 'hypotheek-woning', naam: 'Netto maandlast hypotheek',
      intro: 'Van bruto naar netto: wat kost de hypotheek per maand na hypotheekrenteaftrek en eigenwoningforfait, in het eerste jaar?',
      kw: 'netto bruto maandlasten renteaftrek eigenwoningforfait',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'maximaal aftrektarief', 'aftrek geringe eigenwoningschuld'],
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 325000 },
        { k: 'r', l: 'Rente per jaar', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
        { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM3, std: 'ann' },
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 400000 },
        { k: 'dl', l: 'Deel van de lening met renteaftrek', s: 'pct', std: 100, tip: '100% als de hele lening eigenwoningschuld is.' },
        { k: 'tar', l: 'Tarief waartegen u aftrekt', s: 'pct', std: NR.aftrekTariefMax, tip: 'Maximaal ' + fmt.pct(NR.aftrekTariefMax) + ' in ' + PEIL + '; lager als het inkomen in een lagere schijf valt.' }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0 || v.h <= 0) return { fout: 'Vul een hypotheekbedrag en een looptijd groter dan nul in.' };
        if (v.dl < 0 || v.dl > 100) return { fout: 'Het deel met renteaftrek ligt tussen 0% en 100%.' };
        const jaar1 = verloop(v.h, i, n, Math.min(12, n), v.vorm), bruto = jaar1.termijn;
        const tar = tarief(v.tar), ew = ewSaldo(jaar1.rente * v.dl / 100, v.woz, tar);
        const netto = bruto - ew.voordeel / 12;
        const sig = [];
        if (v.vorm === 'vrij' && v.dl > 0) sig.push('Voor aflossingsvrije leningen die na 2012 zijn afgesloten geldt geen renteaftrek. Alleen bij overgangsrecht (bestaande schuld van vóór 2013) is de rente aftrekbaar.');
        if (ew.hillen > 0) sig.push('Het forfait is hoger dan de aftrekbare rente: de aftrek wegens geringe eigenwoningschuld (' + fmt.pct(hillenPct(Number(PEIL))) + ') is toegepast.');
        if (v.tar > NR.aftrekTariefMax) sig.push('Het tarief is begrensd op het maximale aftrektarief van ' + fmt.pct(NR.aftrekTariefMax) + '.');
        return {
          lbl: 'Netto maandlast jaar 1', groot: fmt.euro(netto),
          onder: 'bruto ' + fmt.euro(bruto) + (v.vorm === 'lin' ? ' (eerste maand)' : '') + ' per maand',
          rijen: [
            ['Rente in jaar 1', fmt.euro0(jaar1.rente)],
            ['Waarvan met renteaftrek', fmt.euro0(jaar1.rente * v.dl / 100)],
            ['Eigenwoningforfait', '− ' + fmt.euro0(ew.forfait)],
            ['Aftrek wegens geringe schuld', fmt.euro0(ew.hillen)],
            ['Saldo eigen woning', fmt.euro0(ew.saldo)],
            ['Belastingvoordeel per jaar', fmt.euro0(ew.voordeel)],
            ['Belastingvoordeel per maand', fmt.euro(ew.voordeel / 12), 'som'],
            ['Netto als deel van bruto', fmt.pct(netto / bruto * 100, 1)]
          ],
          signalen: sig
        };
      },
      uitleg: 'Bruto termijn uit de gekozen aflosvorm (rente per maand = jaarrente / 12). Saldo eigen woning = rente jaar 1 × deel met aftrek − eigenwoningforfait (WOZ × forfaitpercentage, boven de grens voor dure woningen een hoger percentage). Is het forfait hoger, dan gaat de aftrek wegens geringe schuld er voor het afbouwpercentage af. Netto = bruto − saldo × aftrektarief / 12.',
      letop: 'Gemiddelde over jaar 1: bij annuïtair stijgt de netto last daarna (zie Verloop netto maandlast). Het voordeel loopt in werkelijkheid via de aangifte of een voorlopige aanslag. Een netto-lastenoverzicht voor een klant presenteer je als indicatie, op basis van de actuele tarieven; een verkeerd tarief geeft een te gunstig beeld. Jaarlijks wisselende normen: controleer de peildatum.'
    });

    RT.add({
      id: 'totale-kosten-hypotheek', groep: 'hypotheek-woning', naam: 'Wat kost de hypotheek in totaal',
      intro: 'Alle termijnen over de hele looptijd opgeteld, gesplitst in rente en aflossing, plus de eenmalige kosten.',
      kw: 'totale rente looptijd kosten hypotheek',
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 325000 },
        { k: 'r', l: 'Rente per jaar', s: 'pct', std: 4.1, tip: 'Gelijk verondersteld over de hele looptijd.' },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
        { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM3, std: 'ann' },
        { k: 'ek', l: 'Eenmalige kosten', s: 'eur', std: 4500, opt: true, tip: 'Advies, notaris, taxatie, borgtochtprovisie.' }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0 || v.h <= 0) return { fout: 'Vul een hypotheekbedrag en een looptijd groter dan nul in.' };
        const tot = verloop(v.h, i, n, n, v.vorm), afl = v.h - tot.rest;
        const lijst = perJaar(v.h, i, n, v.vorm);
        return {
          lbl: 'Totaal betaald', groot: fmt.euro0(tot.rente + afl + v.ek),
          onder: VORMNAAM[v.vorm] + ', ' + fmt.duur(n),
          rijen: [
            ['Totale rente', fmt.euro0(tot.rente), 'som'],
            ['Totale aflossing', fmt.euro0(afl)],
            ['Eenmalige kosten', fmt.euro0(v.ek)],
            ['Restschuld aan het eind', fmt.euro0(tot.rest)],
            ['Gemiddeld per maand (rente + aflossing)', fmt.euro((tot.rente + afl) / n)],
            ['Rente per geleende euro', fmt.getal(tot.rente / v.h, 2)]
          ],
          tabel: { kop: ['Jaar', 'Rente', 'Aflossing', 'Schuld eind jaar'], rijen: lijst.map(x => [String(x.j), fmt.euro0(x.rente), fmt.euro0(x.afl), fmt.euro0(x.rest)]) }
        };
      },
      uitleg: 'Per maand rente = schuld × jaarrente / 12. Annuïtair: vaste termijn = h × i / (1 − (1 + i)<sup>−n</sup>). Lineair: aflossing h / n per maand. Aflossingsvrij: alleen rente, de schuld blijft staan. Totaal = som van rente en aflossing + eenmalige kosten.',
      letop: 'Bruto bedragen, zonder renteaftrek en zonder renteherziening. Na de rentevaste periode verandert de rente vrijwel zeker; zie Maandlast na renteherziening. Geld heeft over 30 jaar een andere waarde: tel bedragen uit verschillende jaren niet zomaar op als je alternatieven vergelijkt.'
    });

    RT.add({
      id: 'eigenwoningforfait', groep: 'hypotheek-woning', naam: 'Eigenwoningforfait uit de WOZ-waarde',
      intro: 'Hoeveel telt de eigen woning mee als inkomen in box 1, en wat kost dat aan belasting?',
      kw: 'ewf villataks woz forfait bijtelling',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'grens dure woningen', 'maximaal aftrektarief'],
      velden: [
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 400000, tip: 'WOZ-waarde met waardepeildatum 1 januari van het voorgaande jaar.' },
        { k: 'tar', l: 'Tarief over het forfait', s: 'pct', std: NR.aftrekTariefMax, tip: 'Bij renteaftrek verlaagt het forfait de aftrek tegen het aftrektarief.' }
      ],
      bereken(v) {
        if (v.woz <= 0) return { fout: 'Vul een WOZ-waarde groter dan nul in.' };
        const e = NR.eigenWoning, forfait = forfaitVan(v.woz), boven = Math.max(0, v.woz - e.villataksGrens);
        return {
          lbl: 'Eigenwoningforfait per jaar', groot: fmt.euro0(forfait), onder: fmt.euro(forfait / 12) + ' per maand',
          rijen: [
            ['Forfait tot de grens (' + fmt.pct(e.forfaitPct) + ')', fmt.euro0(Math.min(v.woz, e.villataksGrens) * e.forfaitPct / 100)],
            ['Deel boven ' + fmt.euro0(e.villataksGrens) + ' (' + fmt.pct(e.villataksPct) + ')', fmt.euro0(boven * e.villataksPct / 100)],
            ['Effectief percentage van de WOZ', fmt.pct(forfait / v.woz * 100, 3)],
            ['Belastingeffect per jaar', fmt.euro0(forfait * v.tar / 100), 'som']
          ]
        };
      },
      uitleg: 'Forfait = WOZ × ' + fmt.pct(NR.eigenWoning.forfaitPct) + '. Boven ' + fmt.euro0(NR.eigenWoning.villataksGrens) + ': forfait over de grens plus ' + fmt.pct(NR.eigenWoning.villataksPct) + ' over het meerdere. Belastingeffect = forfait × tarief.',
      letop: 'Het forfait wordt van de aftrekbare rente afgetrokken. Is er (bijna) geen schuld, dan geldt de aftrek wegens geringe eigenwoningschuld: zie Aftrek bij weinig of geen eigenwoningschuld. Percentages en grens wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'renteaftrek-eigen-woning', groep: 'hypotheek-woning', naam: 'Belastingvoordeel hypotheekrente',
      intro: 'Wat levert de hypotheekrenteaftrek per jaar op, uitgaande van de schuld en rente of van het betaalde rentebedrag?',
      kw: 'hypotheekrenteaftrek hra netto voordeel tariefsaanpassing',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'maximaal aftrektarief', 'tarief hoogste schijf'],
      velden: [
        { k: 'inv', l: 'Uitgaan van', s: 'keuze', opties: [['schuld', 'Schuld en rentepercentage'], ['rente', 'Betaalde rente per jaar']], std: 'schuld', breed: true },
        { k: 'h', l: 'Eigenwoningschuld', s: 'eur', std: 325000, als: v => v.inv === 'schuld' },
        { k: 'r', l: 'Rente per jaar', s: 'pct', std: 4.1, als: v => v.inv === 'schuld' },
        { k: 'nf', l: 'Deel zonder renteaftrek', s: 'eur', std: 0, opt: true, als: v => v.inv === 'schuld', tip: 'Bijvoorbeeld een box 3-deel of een oude aflossingsvrije lening zonder overgangsrecht.' },
        { k: 'rj', l: 'Betaalde rente per jaar', s: 'eur', std: 13325, als: v => v.inv === 'rente' },
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 400000 },
        { k: 'sch', l: 'Tarief van de hoogste schijf waarin uw inkomen valt', s: 'pct', std: NR.box1.tarief3, tip: 'Het voordeel is begrensd op ' + fmt.pct(NR.aftrekTariefMax) + '.' }
      ],
      bereken(v) {
        const betaald = v.inv === 'schuld' ? v.h * v.r / 100 : v.rj;
        const aftrekbaar = v.inv === 'schuld' ? Math.max(0, v.h - v.nf) * v.r / 100 : v.rj;
        if (betaald <= 0) return { fout: 'Vul een schuld en rente of een rentebedrag groter dan nul in.' };
        const tar = tarief(v.sch), ew = ewSaldo(aftrekbaar, v.woz, tar);
        const gemist = Math.max(0, ew.saldo) * Math.max(0, v.sch - tar) / 100;
        const sig = [];
        if (ew.hillen > 0) sig.push('Het forfait is hoger dan de rente: er is geen voordeel maar een bijtelling, verzacht door de aftrek wegens geringe schuld.');
        return {
          lbl: 'Belastingvoordeel per jaar', groot: fmt.euro0(ew.voordeel), onder: fmt.euro(ew.voordeel / 12) + ' per maand · tegen ' + fmt.pct(tar),
          rijen: [
            ['Betaalde rente', fmt.euro0(betaald)],
            ['Aftrekbare rente', fmt.euro0(aftrekbaar)],
            ['Eigenwoningforfait', '− ' + fmt.euro0(ew.forfait)],
            ['Saldo eigen woning', fmt.euro0(ew.saldo)],
            ['Netto rentelast per jaar', fmt.euro0(betaald - ew.voordeel), 'som'],
            ['Netto rente als percentage', v.inv === 'schuld' ? fmt.pct((betaald - ew.voordeel) / v.h * 100, 2) : fmt.pct((betaald - ew.voordeel) / betaald * 100, 1) + ' van de rente'],
            ['Misgelopen door de begrenzing van het tarief', fmt.euro0(gemist)]
          ],
          signalen: sig
        };
      },
      uitleg: 'Saldo = aftrekbare rente − eigenwoningforfait. Voordeel = saldo × min(schijftarief; ' + fmt.pct(NR.aftrekTariefMax) + '). Het verschil tussen schijftarief en aftrektarief is wat de tariefbegrenzing kost. Bij “schuld en rente” is de rente benaderd als schuld × rente (zonder aflossing in het jaar).',
      letop: 'Voorwaarden voor aftrek: eigenwoningschuld voor de hoofdverblijfswoning, sinds 2013 voor nieuwe schulden ten minste annuïtair afgelost in maximaal 30 jaar, maximaal 30 jaar aftrek per schuld, en rekening houden met de bijleenregeling. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'aftrek-geringe-schuld', groep: 'hypotheek-woning', naam: 'Aftrek bij weinig of geen eigenwoningschuld',
      intro: 'Als de hypotheek (bijna) is afgelost, is het eigenwoningforfait hoger dan de rente. Hoeveel wordt dan bijgeteld, en hoe loopt dat op tot de aftrek is afgebouwd?',
      kw: 'wet hillen afgeloste hypotheek bijtelling afbouw',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'afbouwpercentage aftrek geringe eigenwoningschuld'],
      velden: [
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 450000 },
        { k: 'h', l: 'Resterende eigenwoningschuld', s: 'eur', std: 25000, opt: true },
        { k: 'r', l: 'Rente per jaar', s: 'pct', std: 3.5 },
        { k: 'tar', l: 'Uw marginale tarief in box 1', s: 'pct', std: NR.box1.tarief2 }
      ],
      bereken(v) {
        const rente = v.h * v.r / 100, forfait = forfaitVan(v.woz), pj = Number(PEIL);
        if (rente >= forfait) {
          return {
            lbl: 'Aftrekbaar saldo', groot: fmt.euro0(rente - forfait), onder: 'de rente is hoger dan het forfait: geen bijtelling',
            rijen: [['Eigenwoningforfait', fmt.euro0(forfait)], ['Rente', fmt.euro0(rente)], ['Belastingvoordeel', fmt.euro0((rente - forfait) * tarief(v.tar) / 100), 'som']]
          };
        }
        const verschil = forfait - rente, pct = hillenPct(pj), aftrek = verschil * pct / 100, bij = verschil - aftrek;
        const rijen = [];
        for (let j = pj; j <= pj + 30; j++) {
          const p = hillenPct(j), b = verschil * (1 - p / 100);
          rijen.push([String(j), fmt.pct(p, 2), fmt.euro0(b), fmt.euro0(b * v.tar / 100)]);
          if (p === 0) break;
        }
        return {
          lbl: 'Extra belasting per jaar', groot: fmt.euro0(bij * v.tar / 100), onder: fmt.euro(bij * v.tar / 100 / 12) + ' per maand in ' + PEIL,
          rijen: [
            ['Eigenwoningforfait', fmt.euro0(forfait)],
            ['Rente', fmt.euro0(rente)],
            ['Verschil', fmt.euro0(verschil)],
            ['Aftrek geringe schuld (' + fmt.pct(pct, 2) + ')', '− ' + fmt.euro0(aftrek)],
            ['Belaste bijtelling', fmt.euro0(bij), 'som'],
            ['Bij volledige afbouw (0%)', fmt.euro0(verschil * v.tar / 100) + ' per jaar']
          ],
          tabel: { titel: 'Afbouw bij gelijke WOZ, schuld en tarief', kop: ['Jaar', 'Aftrek', 'Bijtelling', 'Belasting'], rijen }
        };
      },
      uitleg: 'Verschil = forfait − rente. Aftrek wegens geringe schuld = verschil × afbouwpercentage (' + fmt.pct(NR.eigenWoning.hillenAfbouwPct, 2) + ' in ' + PEIL + ', elk jaar 3⅓ procentpunt lager). Bijtelling = verschil − aftrek; extra belasting = bijtelling × marginaal tarief.',
      letop: 'Indicatief: de jaarlijkse afbouw van 3⅓ procentpunt is een norm uit de bron die nog niet is geverifieerd; controleer de actuele norm. De tabel houdt WOZ, rente en tarief gelijk. Vanaf de AOW-leeftijd is het tarief in de eerste schijf lager. Een kleine schuld aanhouden om de bijtelling te verlagen is zelden rendabel: de rente kost meer dan de besparing.'
    });

    RT.add({
      id: 'maximale-koopsom', groep: 'hypotheek-woning', naam: 'Maximale koopsom',
      intro: 'Welke koopsom past bij de maximale hypotheek en het eigen geld, als de kosten koper meestijgen met de prijs?',
      kw: 'maximale huizenprijs koopsom kosten koper',
      peildatum: PEIL, fiscaal: ['overdrachtsbelasting', 'maximale lening ten opzichte van de woningwaarde'],
      velden: [
        { k: 'h', l: 'Maximale hypotheek (op inkomen)', s: 'eur', std: 400000 },
        { k: 'eg', l: 'Eigen geld', s: 'eur', std: 40000, opt: true },
        { k: 'kp', l: 'Kosten als % van de koopsom', s: 'pct', std: NR.ovb.eigenWoning, tip: 'Overdrachtsbelasting; 0% bij de startersvrijstelling.' },
        { k: 'vk', l: 'Vaste kosten', s: 'eur', std: 6000, opt: true, tip: 'Notaris, taxatie, advies.' },
        { k: 'ltv', l: 'Maximale lening als % van de woningwaarde', s: 'pct', std: N.maxLtv }
      ],
      bereken(v) {
        const kp = v.kp / 100, ltv = v.ltv / 100;
        const k1 = (v.h + v.eg - v.vk) / (1 + kp);
        const noemer = 1 + kp - ltv;
        const k2 = noemer > 0 ? (v.eg - v.vk) / noemer : Infinity;
        const k = Math.min(k1, k2);
        if (!(k > 0)) return { fout: 'Met deze bedragen blijft er geen koopsom over: het eigen geld dekt de kosten niet.' };
        const hyp = Math.min(v.h, k * ltv), kk = k * kp + v.vk;
        const sig = [];
        if (k2 < k1) sig.push('De woningwaarde is bepalend, niet het inkomen: de lening mag niet hoger zijn dan ' + fmt.pct(v.ltv, 0) + ' van de waarde. Er blijft ' + fmt.euro0(v.h - hyp) + ' leenruimte op inkomen ongebruikt.');
        return {
          lbl: 'Maximale koopsom', groot: fmt.euro0(k), onder: 'als de marktwaarde gelijk is aan de koopsom',
          rijen: [
            ['Kosten koper', fmt.euro0(kk)],
            ['Totale aankoopkosten', fmt.euro0(k + kk)],
            ['Te gebruiken hypotheek', fmt.euro0(hyp)],
            ['Eigen geld', fmt.euro0(v.eg)],
            ['Lening als % van de koopsom', fmt.pct(hyp / k * 100, 1), 'som']
          ],
          signalen: sig
        };
      },
      uitleg: 'Koopsom = (hypotheek + eigen geld − vaste kosten) / (1 + kostenpercentage). Is de hypotheek dan hoger dan de maximale lening op de woningwaarde, dan geldt koopsom = (eigen geld − vaste kosten) / (1 + kostenpercentage − maximaal leenpercentage).',
      letop: 'Indicatief: het maximale leenpercentage (' + fmt.pct(N.maxLtv, 0) + ' van de marktwaarde) is een norm uit de bron die nog niet is geverifieerd; controleer de actuele norm, ook voor de extra ruimte bij energiebesparende voorzieningen. Kosten koper komen in de regel uit eigen geld. De marktwaarde volgt uit de taxatie en kan lager zijn dan de koopsom.'
    });

    RT.add({
      id: 'huren-of-kopen', groep: 'hypotheek-woning', naam: 'Huren of kopen vergelijken',
      intro: 'Wat kost wonen over een aantal jaren netto bij kopen tegenover huren, inclusief vermogensopbouw in de woning en rendement op het eigen geld?',
      kw: 'huren kopen vergelijken woonlasten',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'maximaal aftrektarief'],
      velden: [
        { k: 'k', l: 'Koopsom', s: 'eur', std: 425000 },
        { k: 'kk', l: 'Kosten koper', s: 'eur', std: 14500, opt: true },
        { k: 'eg', l: 'Eigen geld', s: 'eur', std: 45000, opt: true },
        { k: 'r', l: 'Hypotheekrente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd hypotheek (annuïtair)', s: 'num', na: 'jaar', std: 30 },
        { k: 'onr', l: 'Eigenaarslasten per jaar', s: 'eur', std: 3600, tip: 'Onderhoud, VvE, gemeentelijke lasten, opstalverzekering.' },
        { k: 'wst', l: 'Waardestijging per jaar', s: 'pct', std: 2 },
        { k: 'hu', l: 'Huur per maand', s: 'eur', std: 1650 },
        { k: 'hst', l: 'Huurstijging per jaar', s: 'pct', std: 3 },
        { k: 'ren', l: 'Rendement op het eigen geld bij huren', s: 'pct', std: 4 },
        { k: 'hor', l: 'Vergelijken over', s: 'num', na: 'jaar', std: 10 },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), hor = Math.round(v.hor), i = v.r / 1200;
        if (n <= 0 || hor <= 0) return { fout: 'Vul een looptijd en een vergelijkingsperiode groter dan nul in.' };
        if (hor > v.jr) return { fout: 'Kies een vergelijkingsperiode die niet langer is dan de looptijd.' };
        const hyp = Math.max(0, v.k + v.kk - v.eg), tar = tarief(v.tar), lijst = perJaar(hyp, i, n, 'ann').slice(0, hor);
        let termijnen = 0, voordeel = 0, huur = 0, h = v.hu, woz = v.k;
        const rijen = [];
        lijst.forEach((x, idx) => {
          const vd = ewSaldo(x.rente, woz, tar, Number(PEIL) + idx).voordeel;
          termijnen += x.rente + x.afl; voordeel += vd; huur += h * 12;
          const waarde = v.k * Math.pow(1 + v.wst / 100, x.j);
          const kostKoop = v.eg + termijnen + v.onr * x.j - voordeel - (waarde - x.rest);
          const kostHuur = huur - v.eg * (Math.pow(1 + v.ren / 100, x.j) - 1);
          rijen.push([String(x.j), fmt.euro0(kostKoop), fmt.euro0(kostHuur), fmt.euro0(kostHuur - kostKoop)]);
          h *= 1 + v.hst / 100; woz *= 1 + v.wst / 100;
        });
        const rest = lijst[lijst.length - 1].rest, waarde = v.k * Math.pow(1 + v.wst / 100, hor);
        const kostKoop = v.eg + termijnen + v.onr * hor - voordeel - (waarde - rest);
        const rendEg = v.eg * (Math.pow(1 + v.ren / 100, hor) - 1), kostHuur = huur - rendEg;
        const verschil = kostHuur - kostKoop;
        return {
          lbl: verschil >= 0 ? 'Kopen is voordeliger met' : 'Huren is voordeliger met', groot: fmt.euro0(Math.abs(verschil)),
          onder: 'over ' + hor + ' jaar, vóór inflatie',
          rijen: [
            ['Kopen: betaalde termijnen', fmt.euro0(termijnen)],
            ['Kopen: eigenaarslasten', fmt.euro0(v.onr * hor)],
            ['Kopen: belastingvoordeel', '− ' + fmt.euro0(voordeel)],
            ['Kopen: overwaarde na ' + hor + ' jaar', '− ' + fmt.euro0(waarde - rest)],
            ['Kopen: netto kosten (incl. ingebracht eigen geld)', fmt.euro0(kostKoop), 'som'],
            ['Huren: betaalde huur', fmt.euro0(huur)],
            ['Huren: rendement op eigen geld', '− ' + fmt.euro0(rendEg)],
            ['Huren: netto kosten', fmt.euro0(kostHuur), 'som']
          ],
          tabel: { titel: 'Netto kosten tot en met elk jaar', kop: ['Jaar', 'Kopen', 'Huren', 'Voordeel kopen'], rijen }
        };
      },
      uitleg: 'Hypotheek = koopsom + kosten koper − eigen geld, annuïtair. Kopen: eigen geld + termijnen + eigenaarslasten − belastingvoordeel (rente − forfait over de meestijgende waarde) − (woningwaarde − restschuld) aan het eind. Huren: huur (jaarlijks geïndexeerd) − rendement op het eigen geld dat niet in de woning gaat.',
      letop: 'De uitkomst is erg gevoelig voor waardestijging, huurstijging en rendement; reken altijd meerdere scenario’s door. Geen verkoopkosten, geen box 3-heffing over het belegde eigen geld en geen tijdswaarde van geld. Het verschil in maandlasten wordt niet belegd verondersteld. Geen advies over de keuze zelf.'
    });

    RT.add({
      id: 'effectieve-hypotheekrente', groep: 'hypotheek-woning', naam: 'Effectieve rente inclusief afsluitkosten',
      intro: 'Hoeveel hoger wordt de rente als je de afsluitkosten meetelt over de rentevaste periode?',
      kw: 'effectieve rente jkp kosten irr',
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 325000 },
        { k: 'r', l: 'Nominale rente per jaar', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
        { k: 'rv', l: 'Rentevaste periode', s: 'num', na: 'jaar', std: 10, tip: 'Over deze periode worden de kosten verdeeld; de schuld die dan resteert telt als laatste betaling.' },
        { k: 'k', l: 'Eenmalige kosten', s: 'eur', std: 4500 },
        { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM3, std: 'ann' }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), m = Math.min(n, Math.round(v.rv * 12)), i = v.r / 1200;
        if (n <= 0 || m <= 0) return { fout: 'Vul een looptijd en een rentevaste periode groter dan nul in.' };
        if (v.k >= v.h) return { fout: 'De kosten moeten lager zijn dan het hypotheekbedrag.' };
        const cf = [v.h - v.k];
        for (let t = 1; t <= m; t++) {
          const a = verloop(v.h, i, n, t - 1, v.vorm), b = verloop(v.h, i, n, t, v.vorm);
          cf.push(-((b.rente - a.rente) + (a.rest - b.rest)) - (t === m ? b.rest : 0));
        }
        const im = RT.fin.irr(cf);
        if (!Number.isFinite(im)) return { fout: 'De effectieve rente kan met deze gegevens niet worden bepaald.' };
        const eff = (Math.pow(1 + im, 12) - 1) * 100, nomEff = (Math.pow(1 + i, 12) - 1) * 100;
        return {
          lbl: 'Effectieve rente per jaar', groot: fmt.pct(eff, 3), onder: 'inclusief kosten, over ' + fmt.duur(m),
          rijen: [
            ['Netto ontvangen', fmt.euro0(v.h - v.k)],
            ['Effectieve rente zonder kosten', fmt.pct(nomEff, 3)],
            ['Opslag door de kosten', fmt.pct(eff - nomEff, 3), 'som'],
            ['Effectieve rente per maand', fmt.pct(im * 100, 4)],
            ['Nominale rente inclusief kosten (12 × maand)', fmt.pct(im * 1200, 3)]
          ]
        };
      },
      uitleg: 'Kasstromen per maand: ontvangen bedrag − kosten op moment 0; daarna elke termijn (rente + aflossing) en aan het eind van de rentevaste periode de restschuld. De maandrente i die de contante waarde op nul zet is de interne rente; effectief per jaar = (1 + i)<sup>12</sup> − 1.',
      letop: 'Hoe korter de periode waarover de kosten worden verdeeld, hoe hoger de opslag. Dit is niet het wettelijk voorgeschreven jaarlijks kostenpercentage uit de productinformatie; voor de klant gelden de cijfers van de aanbieder. Kosten die je ook zonder lening maakt (bijvoorbeeld de koopakte) horen hier niet bij.'
    });

    RT.add({
      id: 'familiehypotheek', groep: 'hypotheek-woning', naam: 'Lenen bij ouders (familiehypotheek)',
      intro: 'Wat betekent een lening van ouders aan een kind voor beide partijen: renteaftrek bij het kind, box 3 bij de ouder en eventueel een jaarlijkse schenking?',
      kw: 'familiebank lenen ouders schenking box 3 onderhandse lening',
      peildatum: PEIL, fiscaal: ['maximaal aftrektarief', 'forfait overige bezittingen box 3', 'tarief box 3', 'schenkvrijstelling kind'],
      velden: [
        { k: 'h', l: 'Leningbedrag', s: 'eur', std: 200000 },
        { k: 'r', l: 'Rente lening ouders', s: 'pct', std: 4.5 },
        { k: 'rb', l: 'Rente bij een bank (vergelijking)', s: 'pct', std: 4.1 },
        { k: 'sch', l: 'Jaarlijkse schenking aan het kind', s: 'eur', std: NR.schenkErf.schenkVrijstellingKind, opt: true },
        { k: 'tar', l: 'Aftrektarief kind', s: 'pct', std: NR.aftrekTariefMax },
        { k: 'b3', l: 'Ouder valt al boven het heffingsvrij vermogen', s: 'keuze', opties: JANEE, std: 'ja' }
      ],
      bereken(v) {
        if (v.h <= 0) return { fout: 'Vul een leningbedrag groter dan nul in.' };
        const b = NR.box3, tar = tarief(v.tar);
        const rente = v.h * v.r / 100, bank = v.h * v.rb / 100;
        const nettoKind = rente - rente * tar / 100 - v.sch, nettoBank = bank - bank * tar / 100;
        const box3 = v.b3 === 'ja' ? v.h * b.forfaitOverig / 100 * b.tarief / 100 : F.box3(0, v.h, 0, 1).belasting;
        const ouder = rente - box3 - v.sch;
        const sig = [];
        if (v.sch > NR.schenkErf.schenkVrijstellingKind) sig.push('De schenking is hoger dan de jaarlijkse vrijstelling voor kinderen (' + fmt.euro0(NR.schenkErf.schenkVrijstellingKind) + '); over het meerdere is schenkbelasting verschuldigd.');
        if (v.r > v.rb * 1.25) sig.push('De rente ligt ruim boven de bankrente. Een niet-zakelijke rente kan ertoe leiden dat het meerdere niet aftrekbaar is.');
        return {
          lbl: 'Netto last kind per jaar', groot: fmt.euro0(nettoKind), onder: fmt.euro(nettoKind / 12) + ' per maand, na aftrek en schenking',
          rijen: [
            ['Rente aan de ouders', fmt.euro0(rente)],
            ['Belastingvoordeel kind', '− ' + fmt.euro0(rente * tar / 100)],
            ['Schenking', '− ' + fmt.euro0(v.sch)],
            ['Netto last bij lenen van een bank', fmt.euro0(nettoBank)],
            ['Voordeel kind ten opzichte van de bank', fmt.euro0(nettoBank - nettoKind), 'som'],
            ['Box 3-heffing ouder over de vordering', fmt.euro0(box3)],
            ['Netto opbrengst ouder na schenking', fmt.euro0(ouder), 'som']
          ],
          signalen: sig
        };
      },
      uitleg: 'Kind: netto last = rente − rente × aftrektarief − schenking. Ouder: de vordering is een overige bezitting in box 3; heffing = vordering × forfait overige bezittingen × tarief box 3 (als het heffingsvrij vermogen al is benut). Netto ouder = rente − heffing − schenking. Rente in jaar 1 benaderd als lening × rente.',
      letop: 'Voor renteaftrek moet de lening voldoen aan de eisen voor een eigenwoningschuld: ten minste annuïtair in 30 jaar aflossen, zakelijke rente en de verplichte gegevens in de aangifte. Het forfaitaire box 3-stelsel is een overgangssituatie; een stelsel op basis van werkelijk rendement is aangekondigd, waarbij de ontvangen rente zelf belast wordt. Dit raakt fiscaal en juridisch advies: leg de onderbouwing van de rente en de afspraken schriftelijk vast.'
    });

    RT.add({
      id: 'tijdelijke-verhuur-woning', groep: 'hypotheek-woning', naam: 'Tijdelijke verhuur van de eigen woning',
      intro: 'De eigen woning tijdelijk verhuren, bijvoorbeeld tijdens een vakantie: wat blijft er na belasting over?',
      kw: 'verhuur vakantie airbnb eigen woning box 1',
      peildatum: N.peildatum, fiscaal: ['belast deel tijdelijke verhuur (bron, niet geverifieerd)', 'tarief box 1'],
      velden: [
        { k: 'h', l: 'Huuropbrengst', s: 'eur', std: 4500 },
        { k: 'kost', l: 'Kosten van de verhuur', s: 'eur', std: 600, opt: true, tip: 'Bijvoorbeeld bemiddeling, schoonmaak, extra verzekering.' },
        { k: 'p', l: 'Belast deel', s: 'pct', std: N.tijdelijkeVerhuurPct },
        { k: 'tar', l: 'Uw marginale tarief in box 1', s: 'pct', std: NR.box1.tarief2 }
      ],
      bereken(v) {
        if (v.h <= 0) return { fout: 'Vul een huuropbrengst groter dan nul in.' };
        const na = v.h - v.kost, belast = Math.max(0, na) * v.p / 100, bel = belast * v.tar / 100;
        return {
          lbl: 'Netto opbrengst', groot: fmt.euro0(na - bel), onder: 'na kosten en belasting',
          rijen: [
            ['Opbrengst na kosten', fmt.euro0(na)],
            ['Belast deel (' + fmt.pct(v.p, 0) + ')', fmt.euro0(belast)],
            ['Belasting', '− ' + fmt.euro0(bel)],
            ['Effectieve druk op de huur', fmt.pct(bel / v.h * 100, 1), 'som']
          ]
        };
      },
      uitleg: 'Belast = (huur − kosten) × belast deel; belasting = belast × marginaal tarief. De renteaftrek en het eigenwoningforfait blijven gewoon gelden.',
      letop: 'Indicatief: het belaste deel van ' + fmt.pct(N.tijdelijkeVerhuurPct, 0) + ' is een norm uit de bron die nog niet is geverifieerd; controleer de actuele norm en of de kosten vóór of na toepassing van dat percentage worden afgetrokken. De woning moet hoofdverblijf blijven; bij structurele verhuur kan de woning naar box 3 gaan en vervalt de renteaftrek. Kijk ook naar gemeentelijke regels (vergunning, maximum aantal nachten, toeristenbelasting) en de voorwaarden van geldverstrekker en verzekeraar.'
    });

    RT.add({
      id: 'toetsrente-rentevast', groep: 'hypotheek-woning', naam: 'Leenruimte bij kort of lang rentevast',
      intro: 'Bij een rentevaste periode korter dan tien jaar wordt getoetst op een vaste toetsrente. Hoeveel verschilt de leenruimte met een periode van tien jaar of langer?',
      kw: 'toetsrente rentevast maximale hypotheek leenruimte',
      peildatum: N.peildatum, fiscaal: ['toetsrente korter dan 10 jaar vast (bron, niet geverifieerd)'],
      velden: [
        { k: 'last', l: 'Toegestane bruto maandlast', s: 'eur', std: 1500, tip: 'Toetsinkomen × financieringslastpercentage / 12.' },
        { k: 'rk', l: 'Rente korte rentevaste periode', s: 'pct', std: 3.6 },
        { k: 'rt', l: 'Toetsrente bij korter dan 10 jaar vast', s: 'pct', std: N.toetsrenteKortVast },
        { k: 'rl', l: 'Rente 10 jaar of langer vast', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12);
        if (n <= 0 || v.last <= 0) return { fout: 'Vul een maandlast en een looptijd groter dan nul in.' };
        const toetsKort = Math.max(v.rt, v.rk);
        const kort = annHoofdsom(v.last, toetsKort / 1200, n), lang = annHoofdsom(v.last, v.rl / 1200, n);
        const lastKort = annTermijn(kort, v.rk / 1200, n);
        const sig = [];
        if (lang > kort) sig.push('Meer lenen is geen reden op zich om lang rentevast te kiezen. Leg vast waarom de rentevaste periode past bij doel en risicobereidheid van de klant.');
        return {
          lbl: 'Extra leenruimte bij 10 jaar of langer vast', groot: fmt.euro0(lang - kort),
          onder: 'maximaal ' + fmt.euro0(lang) + ' tegen ' + fmt.euro0(kort),
          rijen: [
            ['Maximale hypotheek kort vast (getoetst op ' + fmt.pct(toetsKort) + ')', fmt.euro0(kort)],
            ['Maximale hypotheek 10 jaar of langer vast', fmt.euro0(lang), 'som'],
            ['Werkelijke maandlast kort vast', fmt.euro(lastKort)],
            ['Extra rente per jaar bij lang vast over dezelfde lening', fmt.euro0(kort * (v.rl - v.rk) / 100)]
          ],
          signalen: sig
        };
      },
      uitleg: 'Maximale hypotheek = maandlast × (1 − (1 + i)<sup>−n</sup>) / i, annuïtair. Kort vast: i = max(toetsrente; werkelijke rente) / 12. Tien jaar of langer vast: i = werkelijke rente / 12.',
      letop: 'Indicatief: de toetsrente van ' + fmt.pct(N.toetsrenteKortVast, 0) + ' is een norm uit de bron die nog niet is geverifieerd; controleer de actuele norm. De toegestane maandlast hangt af van het financieringslastpercentage (inkomen, toetsrente, AOW-leeftijd); deze hulp vervangt geen volledige leennormberekening.'
    });

    RT.add({
      id: 'toetsinkomen-ondernemer', groep: 'hypotheek-woning', naam: 'Toetsinkomen ondernemer',
      intro: 'Het toetsinkomen voor een hypotheek van een ondernemer op basis van de winst over drie jaar, en de maximale hypotheek die daarbij hoort.',
      kw: 'ondernemer zzp toetsinkomen winst drie jaar hypotheek',
      peildatum: N.peildatum, fiscaal: ['financieringslastpercentage (voorbeeld, bron, niet geverifieerd)'],
      velden: [
        { k: 'w1', l: 'Winst oudste jaar', s: 'eur', std: 62000 },
        { k: 'w2', l: 'Winst middelste jaar', s: 'eur', std: 71000 },
        { k: 'w3', l: 'Winst laatste jaar', s: 'eur', std: 68000 },
        { k: 'flp', l: 'Financieringslastpercentage', s: 'pct', std: N.financieringslastPct, tip: 'Uit de tabel die bij inkomen en toetsrente hoort.' },
        { k: 'r', l: 'Toetsrente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12);
        if (n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
        const gem = (v.w1 + v.w2 + v.w3) / 3, toets = Math.max(0, Math.min(gem, v.w3));
        const last = toets * v.flp / 1200, hyp = annHoofdsom(last, v.r / 1200, n);
        const sig = [];
        if (v.w3 < gem) sig.push('De winst van het laatste jaar is lager dan het gemiddelde; die winst is bepalend.');
        return {
          lbl: 'Toetsinkomen', groot: fmt.euro0(toets), onder: v.w3 < gem ? 'winst laatste jaar' : 'gemiddelde winst',
          rijen: [
            ['Gemiddelde winst over drie jaar', fmt.euro0(gem)],
            ['Winst laatste jaar', fmt.euro0(v.w3)],
            ['Toegestane bruto maandlast', fmt.euro(last)],
            ['Maximale hypotheek (indicatie)', fmt.euro0(hyp), 'som'],
            ['Verschil met toetsen op het gemiddelde', fmt.euro0(annHoofdsom(gem * v.flp / 1200, v.r / 1200, n) - hyp)]
          ],
          signalen: sig
        };
      },
      uitleg: 'Toetsinkomen = laagste van (gemiddelde winst over drie jaar; winst laatste jaar). Maandlast = toetsinkomen × financieringslastpercentage / 12. Maximale hypotheek = contante waarde van die maandlast, annuïtair tegen de toetsrente.',
      letop: 'Indicatief: het financieringslastpercentage hangt af van inkomen en toetsrente; de standaardwaarde is een voorbeeld uit de bron en niet geverifieerd. Controleer de actuele normtabel. Geldverstrekkers stellen eigen eisen (inkomensverklaring van een rekenexpert, prognose bij minder dan drie jaar, correctie voor pensioenopbouw). Gebruik dit niet als toezegging van leenruimte.'
    });

    RT.add({
      id: 'leenruimte-met-erfpacht', groep: 'hypotheek-woning', naam: 'Leenruimte bij erfpacht',
      intro: 'Een erfpachtcanon gaat af van de maandlast die voor de hypotheek beschikbaar is. Hoeveel leenruimte kost dat?',
      kw: 'erfpacht canon leenruimte afkoop',
      peildatum: N.peildatum, fiscaal: ['financieringslastpercentage (voorbeeld, bron, niet geverifieerd)', 'maximaal aftrektarief'],
      velden: [
        { k: 'ink', l: 'Toetsinkomen', s: 'eur', std: 68000 },
        { k: 'flp', l: 'Financieringslastpercentage', s: 'pct', std: N.financieringslastPct },
        { k: 'canon', l: 'Erfpachtcanon per jaar', s: 'eur', std: 3200 },
        { k: 'r', l: 'Toetsrente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
        { k: 'tar', l: 'Aftrektarief canon', s: 'pct', std: NR.aftrekTariefMax },
        { k: 'afk', l: 'Afkoopsom canon (indien van toepassing)', s: 'eur', std: 0, opt: true }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0 || v.ink <= 0) return { fout: 'Vul een inkomen en een looptijd groter dan nul in.' };
        const last = v.ink * v.flp / 1200, rest = Math.max(0, last - v.canon / 12);
        const zonder = annHoofdsom(last, i, n), met = annHoofdsom(rest, i, n);
        const rijen = [
          ['Toegestane bruto maandlast', fmt.euro(last)],
          ['Canon per maand', '− ' + fmt.euro(v.canon / 12)],
          ['Netto canon per maand na aftrek', fmt.euro(v.canon * (1 - tarief(v.tar) / 100) / 12)],
          ['Maximale hypotheek zonder erfpacht', fmt.euro0(zonder)],
          ['Verlies aan leenruimte door de canon', fmt.euro0(zonder - met), 'som']
        ];
        if (v.afk > 0) rijen.push(['Ruimte voor de woning bij meefinancieren afkoop', fmt.euro0(zonder - v.afk)]);
        return { lbl: 'Maximale hypotheek met erfpacht', groot: fmt.euro0(met), onder: 'indicatie, annuïtair getoetst', rijen };
      },
      uitleg: 'Toegestane maandlast = toetsinkomen × financieringslastpercentage / 12. Daar gaat de bruto canon per maand af; de rest bepaalt via de annuïteitenformule de maximale hypotheek. Bij afkoop vervalt de canon, maar moet de afkoopsom worden meegefinancierd.',
      letop: 'Indicatief: het financieringslastpercentage is een voorbeeld uit de bron en niet geverifieerd; controleer de actuele normtabel. Hoe geldverstrekkers de canon meetellen (bruto of netto) en of zij particuliere erfpacht accepteren verschilt. Let op de herzieningsdatum, de looptijd van het recht en de voorwaarden. Een canon is alleen aftrekbaar als hij bij de eigen woning hoort.'
    });

    RT.add({
      id: 'verhuurhypotheek', groep: 'hypotheek-woning', naam: 'Verhuurhypotheek: maximale lening',
      intro: 'Hoeveel kan een particuliere belegger lenen voor een te verhuren woning, op basis van de waarde in verhuurde staat en de huurdekking?',
      kw: 'verhuurhypotheek buy to let icr ltv belegger',
      velden: [
        { k: 'wrd', l: 'Marktwaarde vrij van huur', s: 'eur', std: 320000 },
        { k: 'lws', l: 'Waarde in verhuurde staat', s: 'pct', std: 85, tip: 'Als percentage van de waarde vrij van huur, uit de taxatie.' },
        { k: 'ltv', l: 'Maximale lening op de verhuurde waarde', s: 'pct', std: 70, tip: 'Aanname; verschilt per aanbieder.' },
        { k: 'huur', l: 'Huur per maand', s: 'eur', std: 1400 },
        { k: 'kost', l: 'Exploitatiekosten', s: 'pct', std: 20, tip: 'Aanname, als percentage van de huur.' },
        { k: 'r', l: 'Rente', s: 'pct', std: 5.2 },
        { k: 'icr', l: 'Vereiste rentedekking', s: 'num', na: '× rente', std: 1.3, tip: 'Netto huur gedeeld door rente; aanname, verschilt per aanbieder.' }
      ],
      bereken(v) {
        if (v.r <= 0 || v.icr <= 0) return { fout: 'Vul een rente en een rentedekking groter dan nul in.' };
        const vs = v.wrd * v.lws / 100, opLtv = vs * v.ltv / 100;
        const nettoHuur = v.huur * 12 * (1 - v.kost / 100), opIcr = Math.max(0, nettoHuur / v.icr / (v.r / 100));
        const max = Math.min(opLtv, opIcr);
        return {
          lbl: 'Maximale verhuurhypotheek', groot: fmt.euro0(max), onder: 'bepalend: ' + (opLtv <= opIcr ? 'waarde in verhuurde staat' : 'huurdekking'),
          rijen: [
            ['Waarde in verhuurde staat', fmt.euro0(vs)],
            ['Maximum op waarde', fmt.euro0(opLtv)],
            ['Netto huur per jaar', fmt.euro0(nettoHuur)],
            ['Maximum op huurdekking', fmt.euro0(opIcr)],
            ['Werkelijke rentedekking bij dit maximum', max > 0 ? fmt.getal(nettoHuur / (max * v.r / 100), 2) + ' ×' : '–'],
            ['Eigen inbreng ten opzichte van de vrije waarde', fmt.euro0(v.wrd - max), 'som']
          ]
        };
      },
      uitleg: 'Maximum op waarde = vrije waarde × percentage verhuurde staat × maximaal leenpercentage. Maximum op huurdekking = huur × 12 × (1 − kosten) / rentedekking / rente. De laagste van de twee geldt.',
      letop: 'Verhuurhypotheken vallen buiten de leennormen voor consumptief hypothecair krediet; aanbieders hanteren eigen criteria, renteopslagen en kostennormen. De standaardwaarden zijn aannames. Let op huurregelgeving (puntenstelsel, opkoopbescherming), box 3 en overdrachtsbelasting voor beleggers. Kosten koper zijn niet meegenomen.'
    });

    RT.add({
      id: 'eigen-geld-nodig', groep: 'hypotheek-woning', naam: 'Benodigd eigen geld bij aankoop',
      intro: 'Hoeveel eigen geld is nodig voor kosten koper, een eventuele overbieding en het deel boven de maximale lening?',
      kw: 'eigen geld kosten koper overbieden overdrachtsbelasting starter',
      peildatum: PEIL, fiscaal: ['overdrachtsbelasting', 'startersvrijstelling', 'maximale lening ten opzichte van de woningwaarde'],
      velden: [
        { k: 'k', l: 'Koopsom', s: 'eur', std: 450000 },
        { k: 'tax', l: 'Marktwaarde volgens taxatie (na verbouwing)', s: 'eur', std: 450000 },
        { k: 'verb', l: 'Verbouwing', s: 'eur', std: 20000, opt: true },
        { k: 'kost', l: 'Overige kosten', s: 'eur', std: 6000, opt: true, tip: 'Notaris, taxatie, advies, borgtochtprovisie.' },
        { k: 'st', l: 'Startersvrijstelling overdrachtsbelasting', s: 'keuze', opties: JANEE, std: 'nee' },
        { k: 'mi', l: 'Maximale hypotheek op inkomen', s: 'eur', std: 430000, opt: true, tip: 'Leeg of 0: alleen toetsen op de woningwaarde.' },
        { k: 'ltv', l: 'Maximale lening als % van de marktwaarde', s: 'pct', std: N.maxLtv }
      ],
      bereken(v) {
        if (v.k <= 0) return { fout: 'Vul een koopsom groter dan nul in.' };
        const ovb = ovbPct(v.st, v.k), ovbBedrag = v.k * ovb / 100;
        const totaal = v.k + v.verb + ovbBedrag + v.kost;
        const opWaarde = v.tax * v.ltv / 100, max = v.mi > 0 ? Math.min(opWaarde, v.mi) : opWaarde;
        const eigen = Math.max(0, totaal - max);
        const sig = [];
        if (v.st === 'ja' && v.k > NR.ovb.startersWoningwaardeGrens) sig.push('De koopsom ligt boven de woningwaardegrens van ' + fmt.euro0(NR.ovb.startersWoningwaardeGrens) + ': geen startersvrijstelling.');
        return {
          lbl: 'Benodigd eigen geld', groot: fmt.euro0(eigen), onder: fmt.pct(eigen / v.k * 100, 1) + ' van de koopsom',
          rijen: [
            ['Totale investering', fmt.euro0(totaal)],
            ['Overdrachtsbelasting (' + fmt.pct(ovb, 0) + ')', fmt.euro0(ovbBedrag)],
            ['Maximale lening op de woningwaarde', fmt.euro0(opWaarde)],
            ['Beschikbare hypotheek', fmt.euro0(Math.min(max, totaal)), 'som'],
            ['Waarvan kosten koper', fmt.euro0(ovbBedrag + v.kost)],
            ['Waarvan koopsom boven de marktwaarde', fmt.euro0(Math.max(0, v.k + v.verb - v.tax))]
          ],
          signalen: sig
        };
      },
      uitleg: 'Totaal = koopsom + verbouwing + overdrachtsbelasting + overige kosten. Beschikbare hypotheek = laagste van (marktwaarde × maximaal leenpercentage; maximale hypotheek op inkomen). Eigen geld = totaal − beschikbare hypotheek.',
      letop: 'Indicatief: het maximale leenpercentage van ' + fmt.pct(N.maxLtv, 0) + ' is een norm uit de bron en niet geverifieerd; controleer de actuele norm en de extra ruimte voor energiebesparende maatregelen. De startersvrijstelling kent eigen voorwaarden (leeftijd, eenmalig, zelf bewonen, woningwaardegrens). Reken een buffer voor onvoorziene kosten.'
    });

    RT.add({
      id: 'haalbaarheid-woning', groep: 'hypotheek-woning', naam: 'Past deze woning?',
      intro: 'Snelle toets: is de benodigde hypotheek voor een woning binnen de leenruimte op inkomen en op woningwaarde, en wat wordt de maandlast?',
      kw: 'kan ik dit huis betalen haalbaarheid leenruimte',
      peildatum: PEIL, fiscaal: ['overdrachtsbelasting', 'financieringslastpercentage (voorbeeld, bron, niet geverifieerd)', 'eigenwoningforfait', 'maximaal aftrektarief'],
      velden: [
        { k: 'k', l: 'Koopsom', s: 'eur', std: 475000 },
        { k: 'eg', l: 'Eigen geld', s: 'eur', std: 50000, opt: true },
        { k: 'kost', l: 'Overige aankoopkosten', s: 'eur', std: 6000, opt: true },
        { k: 'st', l: 'Startersvrijstelling overdrachtsbelasting', s: 'keuze', opties: JANEE, std: 'nee' },
        { k: 'ink', l: 'Toetsinkomen', s: 'eur', std: 85000 },
        { k: 'flp', l: 'Financieringslastpercentage', s: 'pct', std: N.financieringslastPct },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0 || v.k <= 0) return { fout: 'Vul een koopsom en een looptijd groter dan nul in.' };
        const kk = v.k * ovbPct(v.st, v.k) / 100 + v.kost, nodig = Math.max(0, v.k + kk - v.eg);
        const maxInk = annHoofdsom(v.ink * v.flp / 1200, i, n), maxWrd = v.k * N.maxLtv / 100, max = Math.min(maxInk, maxWrd);
        const bruto = annTermijn(nodig, i, n), ew = ewSaldo(verloop(nodig, i, n, 12, 'ann').rente, v.k, NR.aftrekTariefMax);
        const ok = nodig <= max;
        const extraInk = nodig > maxInk ? bruto * 12 / (v.flp / 100) - v.ink : 0;
        return {
          lbl: 'Past de woning?', groot: ok ? 'Ja' : 'Nee', onder: ok ? 'binnen inkomen en woningwaarde' : 'tekort ' + fmt.euro0(nodig - max),
          rijen: [
            ['Kosten koper', fmt.euro0(kk)],
            ['Benodigde hypotheek', fmt.euro0(nodig)],
            ['Maximum op inkomen', fmt.euro0(maxInk)],
            ['Maximum op woningwaarde', fmt.euro0(maxWrd)],
            ['Bruto maandlast', fmt.euro(bruto)],
            ['Netto maandlast jaar 1 (indicatie)', fmt.euro(bruto - ew.voordeel / 12), 'som'],
            ['Extra eigen geld nodig', fmt.euro0(Math.max(0, nodig - max))],
            ['Of extra toetsinkomen nodig', fmt.euro0(Math.max(0, extraInk))]
          ]
        };
      },
      uitleg: 'Benodigd = koopsom + kosten koper − eigen geld. Maximum op inkomen = contante waarde van (toetsinkomen × financieringslastpercentage / 12) annuïtair. Maximum op waarde = koopsom × maximaal leenpercentage. Netto last: rente jaar 1 − forfait (WOZ gelijk aan de koopsom) tegen het maximale aftrektarief.',
      letop: 'Indicatief: financieringslastpercentage en maximaal leenpercentage zijn normen uit de bron die niet zijn geverifieerd; controleer de actuele normen. Dit is geen leennormtoets: studieschuld, andere leningen, AOW-leeftijd en partnerinkomen tellen niet mee. Gebruik de uitkomst niet als toezegging.'
    });

    RT.add({
      id: 'hypotheekvormen-vergelijken', groep: 'hypotheek-woning', naam: 'Annuïtair, lineair en aflossingsvrij naast elkaar',
      intro: 'Bruto en netto maandlast en de totale rente over de looptijd voor de drie aflosvormen, bij hetzelfde bedrag en dezelfde rente.',
      kw: 'hypotheekvorm annuiteit lineair aflossingsvrij vergelijken',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'maximaal aftrektarief'],
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 325000 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 400000 },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax },
        { k: 'ovg', l: 'Aflossingsvrij deel valt onder overgangsrecht (van vóór 2013)', s: 'keuze', opties: JANEE, std: 'nee', breed: true }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200, tar = tarief(v.tar);
        if (n <= 0 || v.h <= 0) return { fout: 'Vul een hypotheekbedrag en een looptijd groter dan nul in.' };
        const uit = ['ann', 'lin', 'vrij'].map(vorm => {
          const lijst = perJaar(v.h, i, n, vorm), aftrek = vorm !== 'vrij' || v.ovg === 'ja';
          let rente = 0, netto = 0;
          lijst.forEach((x, idx) => { const vd = aftrek ? ewSaldo(x.rente, v.woz, tar, Number(PEIL) + idx).voordeel : 0; rente += x.rente; netto += x.rente - vd; });
          const bruto1 = verloop(v.h, i, n, 0, vorm).termijn;
          const vd1 = aftrek ? ewSaldo(lijst[0].rente, v.woz, tar).voordeel : 0;
          return { vorm, bruto1, netto1: bruto1 - vd1 / 12, rente, netto, rest: lijst[lijst.length - 1].rest };
        });
        const best = uit.reduce((a, b) => b.netto < a.netto ? b : a);
        return {
          lbl: 'Laagste netto rente over de looptijd', groot: fmt.euro0(best.netto), onder: VORMNAAM[best.vorm],
          rijen: uit.map(x => [VORMNAAM[x.vorm] + ': eerste netto maandlast', fmt.euro(x.netto1)])
            .concat([['Aflossingsvrij: schuld aan het eind', fmt.euro0(v.h), 'som']]),
          tabel: { titel: 'Over de hele looptijd', kop: ['Vorm', 'Bruto mnd 1', 'Netto mnd 1', 'Totale rente', 'Netto rente'],
            rijen: uit.map(x => [VORMNAAM[x.vorm], fmt.euro0(x.bruto1), fmt.euro0(x.netto1), fmt.euro0(x.rente), fmt.euro0(x.netto)]) }
        };
      },
      uitleg: 'Per jaar: rente uit het aflosschema, voordeel = (rente − forfait) × aftrektarief, met aftrek wegens geringe schuld als het forfait hoger is (afbouwend per jaar). Netto rente = som van (rente − voordeel). Aflossingsvrij alleen met renteaftrek bij overgangsrecht.',
      letop: 'Lage totale rente bij aflossingsvrij is schijn: de schuld staat aan het eind nog volledig open. Lineair kost minder rente, maar begint met een hogere last. WOZ en tarief zijn gelijk gehouden over de looptijd; de aftrek is per schuld maximaal 30 jaar. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'rente-dalende-opslag', groep: 'hypotheek-woning', naam: 'Gemiddelde rente bij dalende risico-opslag',
      intro: 'Veel geldverstrekkers verlagen de rente als de lening ten opzichte van de woningwaarde in een lagere klasse komt. Wat is dan de gemiddelde rente over de looptijd?',
      kw: 'risico-opslag ltv klasse looptijdrente renteopslag',
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 340000 },
        { k: 'wrd', l: 'Woningwaarde', s: 'eur', std: 350000 },
        { k: 'r', l: 'Rente in de laagste klasse', s: 'pct', std: 3.8 },
        { k: 'o1', l: 'Opslag boven 90%', s: 'pct', std: 0.45 },
        { k: 'o2', l: 'Opslag 75% tot en met 90%', s: 'pct', std: 0.25 },
        { k: 'o3', l: 'Opslag 60% tot en met 75%', s: 'pct', std: 0.1 },
        { k: 'jr', l: 'Looptijd (annuïtair)', s: 'num', na: 'jaar', std: 30 },
        { k: 'wst', l: 'Waardestijging per jaar', s: 'pct', std: 2, opt: true, tip: '0 als de aanbieder alleen kijkt naar de oorspronkelijke waarde.' }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12);
        if (n <= 0 || v.h <= 0 || v.wrd <= 0) return { fout: 'Vul bedrag, woningwaarde en looptijd groter dan nul in.' };
        const opslag = ltv => ltv > 90 ? v.o1 : ltv > 75 ? v.o2 : ltv > 60 ? v.o3 : 0;
        const groei = Math.pow(1 + v.wst / 100, 1 / 12);
        let schuld = v.h, w = v.wrd, rente = 0, som = 0, klasse = null;
        const momenten = [];
        for (let m = 0; m < n && schuld > 0.005; m++) {
          const ltv = schuld / w * 100, op = opslag(ltv), i = (v.r + op) / 1200;
          if (op !== klasse) { momenten.push([fmt.duur(m), fmt.pct(ltv, 1), fmt.pct(v.r + op, 2)]); klasse = op; }
          const t = annTermijn(schuld, i, n - m);
          rente += schuld * i; som += schuld / 12;
          schuld -= t - schuld * i; w *= groei;
        }
        const start = v.r + opslag(v.h / v.wrd * 100), gem = rente / som * 100;
        const vast = annTermijn(v.h, start / 1200, n) * n - v.h;
        return {
          lbl: 'Gemiddelde rente over de looptijd', groot: fmt.pct(gem, 3), onder: 'gewogen naar de openstaande schuld',
          rijen: [
            ['Startrente', fmt.pct(start, 2)],
            ['Lening ten opzichte van de waarde nu', fmt.pct(v.h / v.wrd * 100, 1)],
            ['Totale rente met dalende opslag', fmt.euro0(rente)],
            ['Totale rente als de startrente blijft', fmt.euro0(vast)],
            ['Besparing', fmt.euro0(vast - rente), 'som']
          ],
          tabel: { titel: 'Momenten van klasseverlaging', kop: ['Na', 'Lening/waarde', 'Rente'], rijen: momenten }
        };
      },
      uitleg: 'Per maand: lening/waarde bepaalt de opslag; rente = (basis + opslag) / 12 × schuld; de annuïteit wordt bij elke rentewijziging herberekend over de resterende looptijd. Waarde groeit met (1 + stijging)<sup>1/12</sup> per maand. Gemiddelde rente = totale rente / (som van de schulden / 12).',
      letop: 'De opslagen zijn voorbeelden; klassegrenzen en opslagen verschillen per aanbieder. Niet elke aanbieder verlaagt automatisch: soms moet de klant zelf een nieuwe taxatie aanleveren. De basisrente is gelijk verondersteld over de hele looptijd, terwijl die bij renteherziening verandert.'
    });

    RT.add({
      id: 'netto-lasten-verloop', groep: 'hypotheek-woning', naam: 'Verloop netto maandlast',
      intro: 'Bij annuïtair blijft de bruto last gelijk, maar daalt het rentedeel en dus de aftrek. Hoe loopt de netto maandlast per jaar op?',
      kw: 'netto maandlast verloop per jaar annuiteit lineair',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'maximaal aftrektarief', 'aftrek geringe eigenwoningschuld'],
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 325000 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
        { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM2, std: 'ann' },
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 400000 },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200, tar = tarief(v.tar);
        if (n <= 0 || v.h <= 0) return { fout: 'Vul een hypotheekbedrag en een looptijd groter dan nul in.' };
        const lijst = perJaar(v.h, i, n, v.vorm).map((x, idx) => {
          const mnd = Math.min(12, n - idx * 12), vd = ewSaldo(x.rente, v.woz, tar, Number(PEIL) + idx).voordeel;
          return { ...x, vd, netto: (x.rente + x.afl - vd) / mnd };
        });
        const eerste = lijst[0], tien = lijst[Math.min(9, lijst.length - 1)], laatste = lijst[lijst.length - 1];
        return {
          lbl: 'Netto maandlast jaar 1', groot: fmt.euro(eerste.netto), onder: 'gemiddeld per maand in het eerste jaar',
          rijen: [
            ['Bruto maandlast eerste maand', fmt.euro(verloop(v.h, i, n, 0, v.vorm).termijn)],
            ['Netto maandlast jaar ' + tien.j, fmt.euro(tien.netto)],
            ['Netto maandlast laatste jaar', fmt.euro(laatste.netto)],
            ['Verschil laatste en eerste jaar', fmt.plus(fmt.euro(laatste.netto - eerste.netto)), 'som'],
            ['Eigenwoningforfait per jaar', fmt.euro0(forfaitVan(v.woz))]
          ],
          tabel: { kop: ['Jaar', 'Rente', 'Aflossing', 'Voordeel', 'Netto p.m.'], rijen: lijst.map(x => [String(x.j), fmt.euro0(x.rente), fmt.euro0(x.afl), fmt.euro0(x.vd), fmt.euro(x.netto)]) }
        };
      },
      uitleg: 'Per jaar: voordeel = (rente − forfait) × aftrektarief (met aftrek wegens geringe schuld als het forfait hoger is). Netto per maand = (rente + aflossing − voordeel) / aantal maanden in dat jaar.',
      letop: 'WOZ-waarde, rente en tarief zijn gelijk gehouden. In werkelijkheid stijgt de WOZ meestal, verandert de rente na de rentevaste periode en wijzigen tarieven; zie Renteaftrek nu en later. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'hypotheek-meenemen', groep: 'hypotheek-woning', naam: 'Meeneemregeling bij verhuizen',
      intro: 'Bij verhuizen de bestaande lening met lage rente meenemen en alleen het extra deel tegen de actuele rente lenen: wat scheelt dat per maand?',
      kw: 'meenemen verhuizen meeneemregeling rente',
      velden: [
        { k: 'oud', l: 'Mee te nemen lening', s: 'eur', std: 240000 },
        { k: 'ro', l: 'Rente meegenomen lening', s: 'pct', std: 2.1 },
        { k: 'rest', l: 'Resterende rentevaste periode', s: 'num', na: 'jaar', std: 7 },
        { k: 'nieuw', l: 'Aanvullende lening', s: 'eur', std: 120000, opt: true },
        { k: 'rn', l: 'Actuele rente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd (annuïtair)', s: 'num', na: 'jaar', std: 30 }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), tot = v.oud + v.nieuw;
        if (n <= 0 || tot <= 0) return { fout: 'Vul een lening en een looptijd groter dan nul in.' };
        const gem = (v.oud * v.ro + v.nieuw * v.rn) / tot;
        const mee = annTermijn(v.oud, v.ro / 1200, n) + annTermijn(v.nieuw, v.rn / 1200, n), alles = annTermijn(tot, v.rn / 1200, n);
        const besp = alles - mee, mnd = Math.min(n, Math.round(v.rest * 12));
        return {
          lbl: 'Lagere maandlast door meenemen', groot: fmt.euro(besp), onder: 'bruto, zolang de oude rente vaststaat',
          rijen: [
            ['Totale lening', fmt.euro0(tot)],
            ['Gewogen gemiddelde rente', fmt.pct(gem, 3)],
            ['Maandlast met meenemen', fmt.euro(mee)],
            ['Maandlast als alles tegen de actuele rente', fmt.euro(alles)],
            ['Besparing over de resterende rentevaste periode', fmt.euro0(besp * mnd), 'som']
          ]
        };
      },
      uitleg: 'Gewogen rente = (meegenomen × oude rente + aanvullend × actuele rente) / totaal. Maandlasten annuïtair over dezelfde looptijd voor beide delen. Besparing = verschil per maand × resterende rentevaste maanden.',
      letop: 'Benadering: de meegenomen lening houdt hier dezelfde looptijd als de aanvullende lening. Voorwaarden verschillen: termijn tussen verkoop en aankoop, of de oude rentevaste periode doorloopt, en of het verhogingsdeel een andere opslag krijgt. Bij verkoop van de woning is aflossen vaak boetevrij; meenemen is dan niet nodig om een vergoeding te vermijden. Renteaftrek en de bijleenregeling zijn niet meegenomen.'
    });

    RT.add({
      id: 'boetevrij-aflossen', groep: 'hypotheek-woning', naam: 'Boetevrije aflossingsruimte',
      intro: 'Hoeveel mag dit kalenderjaar nog zonder vergoeding worden afgelost, en wat levert dat op?',
      kw: 'boetevrij aflossen extra aflossing ruimte boeterente',
      velden: [
        { k: 'ho', l: 'Oorspronkelijke hoofdsom', s: 'eur', std: 325000 },
        { k: 'rest', l: 'Huidige schuld', s: 'eur', std: 280000 },
        { k: 'p', l: 'Boetevrij percentage per jaar', s: 'pct', std: 10, tip: 'Aanname; zie de voorwaarden van de lening.' },
        { k: 'basis', l: 'Percentage over', s: 'keuze', opties: [['ho', 'De oorspronkelijke hoofdsom'], ['rest', 'De huidige schuld']], std: 'ho' },
        { k: 'al', l: 'Dit jaar al afgelost (extra)', s: 'eur', std: 0, opt: true },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.4 },
        { k: 'jr', l: 'Resterende looptijd (annuïtair)', s: 'num', na: 'jaar', std: 25 }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0 || v.rest <= 0) return { fout: 'Vul een schuld en een looptijd groter dan nul in.' };
        const jaarRuimte = (v.basis === 'ho' ? v.ho : v.rest) * v.p / 100;
        const ruimte = Math.min(v.rest, Math.max(0, jaarRuimte - v.al));
        const t0 = annTermijn(v.rest, i, n), t1 = annTermijn(v.rest - ruimte, i, n);
        return {
          lbl: 'Nog boetevrij af te lossen', groot: fmt.euro0(ruimte), onder: 'in dit kalenderjaar',
          rijen: [
            ['Boetevrije ruimte per jaar', fmt.euro0(jaarRuimte)],
            ['Al gebruikt', fmt.euro0(v.al)],
            ['Lagere maandlast bij gelijke looptijd', fmt.euro(t0 - t1)],
            ['Rentebesparing eerste jaar (benadering)', fmt.euro0(ruimte * v.r / 100), 'som']
          ]
        };
      },
      uitleg: 'Ruimte = percentage × grondslag − al afgelost, niet meer dan de schuld. Nieuwe maandlast: annuïteit over de lagere schuld met dezelfde resterende looptijd. Rentebesparing jaar 1 ≈ aflossing × rente.',
      letop: 'Het percentage en de grondslag zijn aannames: kijk in de leningvoorwaarden. Aflossen is daarnaast meestal boetevrij bij verkoop van de woning, overlijden, aan het eind van de rentevaste periode en als de huidige rente niet lager is dan de contractrente. Bij extra aflossen kiest de klant vaak tussen lagere maandlast of kortere looptijd; vraag dat na.'
    });

    RT.add({
      id: 'aflossen-of-beleggen', groep: 'hypotheek-woning', naam: 'Aflossen of sparen en beleggen',
      intro: 'Een bedrag inzetten om af te lossen of om te sparen of beleggen: welk netto rendement is hoger?',
      kw: 'aflossen sparen beleggen vergelijken netto rente box 3',
      peildatum: PEIL, fiscaal: ['maximaal aftrektarief', 'forfaits box 3', 'tarief box 3', 'heffingsvrij vermogen'],
      velden: [
        { k: 'b', l: 'Beschikbaar bedrag', s: 'eur', std: 50000 },
        { k: 'r', l: 'Hypotheekrente', s: 'pct', std: 4.1 },
        { k: 'aftr', l: 'Rente is aftrekbaar', s: 'keuze', opties: JANEE, std: 'ja' },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax, als: v => v.aftr === 'ja' },
        { k: 'soort', l: 'Alternatief', s: 'keuze', opties: [['bank', 'Sparen'], ['overig', 'Beleggen']], std: 'overig' },
        { k: 'rend', l: 'Verwacht rendement alternatief', s: 'pct', std: 4 },
        { k: 'ov', l: 'Ander vermogen in box 3', s: 'eur', std: 60000, opt: true, tip: 'Spaargeld dat al in box 3 valt; bepaalt of het heffingsvrij vermogen al op is.' },
        { k: 'pers', l: 'Fiscale partners', s: 'keuze', opties: [['1', 'Nee, één persoon'], ['2', 'Ja, samen']], std: '1' },
        { k: 'hor', l: 'Horizon', s: 'num', na: 'jaar', std: 10 }
      ],
      bereken(v) {
        if (v.b <= 0 || v.hor <= 0) return { fout: 'Vul een bedrag en een horizon groter dan nul in.' };
        const p = +v.pers, bank = v.soort === 'bank';
        const heffing = F.box3(v.ov + (bank ? v.b : 0), bank ? 0 : v.b, 0, p).belasting - F.box3(v.ov, 0, 0, p).belasting;
        const netAfl = v.aftr === 'ja' ? v.r * (1 - tarief(v.tar) / 100) : v.r;
        const netAlt = (v.b * v.rend / 100 - heffing) / v.b * 100;
        const groei = x => v.b * (Math.pow(1 + x / 100, v.hor) - 1);
        const a = groei(netAfl), s = groei(netAlt);
        return {
          lbl: a >= s ? 'Aflossen levert meer op' : (bank ? 'Sparen' : 'Beleggen') + ' levert meer op', groot: fmt.euro0(Math.abs(a - s)),
          onder: 'verschil na ' + fmt.getal(v.hor, 0) + ' jaar',
          rijen: [
            ['Netto rente hypotheek (rendement van aflossen)', fmt.pct(netAfl, 2)],
            ['Box 3-heffing per jaar op het alternatief', fmt.euro0(heffing)],
            ['Netto rendement ' + (bank ? 'sparen' : 'beleggen'), fmt.pct(netAlt, 2)],
            ['Opbrengst aflossen (bespaarde netto rente)', fmt.euro0(a)],
            ['Opbrengst ' + (bank ? 'sparen' : 'beleggen'), fmt.euro0(s), 'som']
          ]
        };
      },
      uitleg: 'Rendement van aflossen = rente × (1 − aftrektarief) als de rente aftrekbaar is. Heffing = box 3 met het bedrag erbij − box 3 zonder, met forfaits per soort bezitting. Netto rendement alternatief = (bedrag × rendement − heffing) / bedrag. Opbrengst = bedrag × ((1 + netto)<sup>jaren</sup> − 1).',
      letop: 'Een beleggingsrendement is niet zeker; aflossen levert een vaste besparing. Afgelost geld is niet meer vrij beschikbaar en meestal alleen terug te krijgen door opnieuw te lenen (met toetsing). Aflossen kan wel een lagere risico-opslag geven. Heffing en tarieven zijn gelijk gehouden; het forfaitaire box 3-stelsel is een overgangsregime. Box 3- en eigenwoningnormen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'aflossingsvrij-aflossen', groep: 'hypotheek-woning', naam: 'Aflossen op een aflossingsvrij deel',
      intro: 'Extra aflossen op een aflossingsvrije lening: hoeveel daalt de maandlast netto en welk rendement levert dat op?',
      kw: 'aflossingsvrij aflossen besparing restschuld',
      peildatum: PEIL, fiscaal: ['maximaal aftrektarief'],
      velden: [
        { k: 'h', l: 'Aflossingsvrije lening', s: 'eur', std: 200000 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.1 },
        { k: 'e', l: 'Extra aflossing', s: 'eur', std: 40000 },
        { k: 'aftr', l: 'Rente is aftrekbaar (overgangsrecht)', s: 'keuze', opties: JANEE, std: 'ja' },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax, als: v => v.aftr === 'ja' },
        { k: 'jr', l: 'Jaren tot einde looptijd', s: 'num', na: 'jaar', std: 15 }
      ],
      bereken(v) {
        if (v.e <= 0 || v.e > v.h) return { fout: 'Vul een extra aflossing in tussen nul en de hoogte van de lening.' };
        const bruto = v.e * v.r / 100, netto = v.aftr === 'ja' ? bruto * (1 - tarief(v.tar) / 100) : bruto;
        return {
          lbl: 'Netto besparing per maand', groot: fmt.euro(netto / 12), onder: fmt.euro0(netto) + ' per jaar',
          rijen: [
            ['Bruto rentebesparing per jaar', fmt.euro0(bruto)],
            ['Netto rendement op de aflossing', fmt.pct(netto / v.e * 100, 2)],
            ['Besparing tot einde looptijd (zonder rente op rente)', fmt.euro0(netto * v.jr)],
            ['Schuld na aflossing', fmt.euro0(v.h - v.e), 'som']
          ]
        };
      },
      uitleg: 'Bruto besparing = aflossing × rente. Netto = bruto × (1 − aftrektarief) als de rente aftrekbaar is. De rest van de lening blijft aflossingsvrij.',
      letop: 'Renteaftrek op een aflossingsvrije lening bestaat alleen voor schulden van vóór 2013 onder overgangsrecht; daarna afgesloten aflossingsvrije leningen geven geen aftrek. Aan het eind van de looptijd moet de resterende schuld worden afgelost of opnieuw gefinancierd, getoetst op het dan geldende (vaak lagere) inkomen. Let op de boetevrije ruimte en een eventuele daling naar een lagere risicoklasse.'
    });

    RT.add({
      id: 'maandelijks-aflossen-of-sparen', groep: 'hypotheek-woning', naam: 'Maandelijks extra aflossen of sparen',
      intro: 'Elke maand een vast bedrag extra aflossen op een annuïtaire hypotheek, of hetzelfde bedrag sparen: wat levert meer op?',
      kw: 'extra aflossen maandelijks sparen looptijd verkorten',
      peildatum: PEIL, fiscaal: ['maximaal aftrektarief', 'forfait banktegoeden box 3', 'tarief box 3'],
      velden: [
        { k: 'h', l: 'Huidige schuld', s: 'eur', std: 300000 },
        { k: 'r', l: 'Hypotheekrente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Resterende looptijd', s: 'num', na: 'jaar', std: 25 },
        { k: 'm', l: 'Bedrag per maand', s: 'eur', std: 300 },
        { k: 'aftr', l: 'Rente is aftrekbaar', s: 'keuze', opties: JANEE, std: 'ja' },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax, als: v => v.aftr === 'ja' },
        { k: 'rend', l: 'Spaarrente', s: 'pct', std: 3 },
        { k: 'b3', l: 'Spaargeld valt boven het heffingsvrij vermogen', s: 'keuze', opties: JANEE, std: 'ja' }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0 || v.h <= 0 || v.m <= 0) return { fout: 'Vul schuld, looptijd en maandbedrag groter dan nul in.' };
        const t = annTermijn(v.h, i, n);
        let s = v.h, m2 = 0, renteExtra = 0;
        while (s > 0.005 && m2 < n) { const r = s * i; renteExtra += r; s -= Math.min(s, t + v.m - r); m2++; }
        const renteNormaal = t * n - v.h, besp = renteNormaal - renteExtra;
        const netAfl = v.aftr === 'ja' ? v.r * (1 - tarief(v.tar) / 100) : v.r;
        const netSpaar = v.rend - (v.b3 === 'ja' ? NR.box3.forfaitBank * NR.box3.tarief / 100 : 0);
        const fvA = eindwaarde(0, v.m, maandUitJaar(netAfl), n, false), fvS = eindwaarde(0, v.m, maandUitJaar(netSpaar), n, false);
        return {
          lbl: fvA >= fvS ? 'Extra aflossen levert meer op' : 'Sparen levert meer op', groot: fmt.euro0(Math.abs(fvA - fvS)),
          onder: 'verschil na ' + fmt.duur(n),
          rijen: [
            ['Looptijd met extra aflossen', fmt.duur(m2)],
            ['Bruto rentebesparing', fmt.euro0(besp)],
            ['Netto rente (rendement van aflossen)', fmt.pct(netAfl, 2)],
            ['Netto spaarrente na box 3', fmt.pct(netSpaar, 2)],
            ['Waarde extra aflossen op einddatum', fmt.euro0(fvA)],
            ['Spaarsaldo op einddatum', fmt.euro0(fvS), 'som']
          ]
        };
      },
      uitleg: 'Looptijd en rentebesparing: maandelijkse simulatie met termijn + extra bedrag. Vergelijking: dezelfde maandbedragen groeien tegen de netto hypotheekrente (rente × (1 − aftrektarief)) of tegen de spaarrente − forfait banktegoeden × tarief box 3 (als het heffingsvrij vermogen al is benut).',
      letop: 'Benadering: box 3-heffing als vast percentage en rente, tarief en aftrek gelijk over de hele periode. Extra aflossen verkleint de flexibiliteit; spaargeld blijft beschikbaar voor een buffer. Check de boetevrije ruimte. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'bankspaarrekening-eigen-woning', groep: 'hypotheek-woning', naam: 'Bankspaarrekening eigen woning',
      intro: 'Een bestaande geblokkeerde spaarrekening voor de eigen woning: welke inleg is nodig om de lening op de einddatum af te lossen?',
      kw: 'bankspaarhypotheek spaarrekening eigen woning kew sew bew vrijstelling',
      peildatum: PEIL, fiscaal: ['vrijstelling kapitaalverzekering en spaarrekening eigen woning'],
      velden: [
        { k: 'doel', l: 'Af te lossen lening', s: 'eur', std: 180000 },
        { k: 's', l: 'Huidig saldo', s: 'eur', std: 25000, opt: true },
        { k: 'in', l: 'Huidige inleg per maand', s: 'eur', std: 600, opt: true },
        { k: 'r', l: 'Rente op de rekening', s: 'pct', std: 3.5 },
        { k: 'jr', l: 'Jaren tot de einddatum', s: 'num', na: 'jaar', std: 15 }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200;
        if (n <= 0) return { fout: 'Vul een periode groter dan nul in.' };
        const inlegBij = j => { const g = Math.pow(1 + j, n), f = j === 0 ? n : (g - 1) / j * (1 + j); return Math.max(0, (v.doel - v.s * g) / f); };
        const nodig = inlegBij(i), eind = eindwaarde(v.s, v.in, i, n, true);
        const vrij = NR.eigenWoning.kewVrijstelling;
        const sig = [];
        if (eind > vrij) sig.push('Het verwachte eindsaldo is hoger dan de vrijstelling van ' + fmt.euro0(vrij) + ' (peildatum ' + PEIL + '); het meerdere is belast.');
        return {
          lbl: 'Benodigde inleg per maand', groot: fmt.euro(nodig), onder: 'om ' + fmt.euro0(v.doel) + ' te bereiken',
          rijen: [
            ['Eindsaldo bij huidige inleg', fmt.euro0(eind)],
            [eind >= v.doel ? 'Overschot' : 'Tekort', fmt.euro0(Math.abs(eind - v.doel)), 'som'],
            ['Totaal nog in te leggen bij benodigde inleg', fmt.euro0(nodig * n)],
            ['Benodigde inleg bij 1% lagere rente', fmt.euro(inlegBij(Math.max(0, v.r - 1) / 1200))]
          ],
          signalen: sig
        };
      },
      uitleg: 'Rente per maand = jaarrente / 12, inleg aan het begin van de maand. Inleg = (doel − saldo × (1 + i)<sup>n</sup>) / (((1 + i)<sup>n</sup> − 1) / i × (1 + i)).',
      letop: 'Nieuwe spaarrekeningen, kapitaalverzekeringen en beleggingsrechten eigen woning zijn sinds 2013 niet meer mogelijk; deze hulp is alleen bedoeld voor bestaande producten onder overgangsrecht. De vrijstelling geldt alleen bij voldoen aan de voorwaarden (onder meer minimale looptijd, bandbreedte van de inleg en aanwending voor aflossing van de eigenwoningschuld). Vrijstellingsbedrag: controleer de actuele norm.'
    });

    RT.add({
      id: 'aflossingseis-renteaftrek', groep: 'hypotheek-woning', naam: 'Aflossingseis voor renteaftrek',
      intro: 'Is er dit jaar genoeg afgelost om de renteaftrek te behouden? Voor schulden sinds 2013 geldt een minimaal annuïtair aflosschema.',
      kw: 'aflossingseis annuitair 360 maanden achterstand renteaftrek',
      peildatum: N.peildatum, fiscaal: ['aflossingseis 360 maanden (bron, niet geverifieerd)'],
      velden: [
        { k: 'h', l: 'Schuld volgens het fictieve schema aan het begin van het jaar', s: 'eur', std: 325000 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.1 },
        { k: 'n', l: 'Resterende maanden volgens dat schema', s: 'num', na: 'mnd', std: N.aflossingseisMaanden },
        { k: 'mnd', l: 'Maanden van dit jaar met deze schuld', s: 'num', na: 'mnd', std: 12 },
        { k: 'af', l: 'Werkelijk afgelost dit jaar', s: 'eur', std: 4000 }
      ],
      bereken(v) {
        const n = Math.round(v.n), k = Math.min(n, Math.max(0, Math.round(v.mnd))), i = v.r / 1200;
        if (n <= 0 || n > N.aflossingseisMaanden) return { fout: 'Vul een resterend aantal maanden in tussen 1 en ' + N.aflossingseisMaanden + '.' };
        const vereist = v.h - annRest(v.h, i, n, k), ok = v.af >= vereist - 0.5;
        return {
          lbl: 'Voldoet aan de aflossingseis', groot: ok ? 'Ja' : 'Nee', onder: 'vereist ' + fmt.euro0(vereist) + ' in ' + k + ' maanden',
          rijen: [
            ['Annuïtaire termijn', fmt.euro(annTermijn(v.h, i, n))],
            ['Minimaal vereiste aflossing', fmt.euro0(vereist)],
            ['Werkelijk afgelost', fmt.euro0(v.af)],
            ['Uiterlijk volgend jaar in te halen', fmt.euro0(Math.max(0, vereist - v.af)), 'som']
          ],
          signalen: ok ? [] : ['Een achterstand moet uiterlijk aan het eind van het volgende jaar zijn ingehaald. Gebeurt dat niet, dan vervalt de renteaftrek voor deze lening definitief en gaat de schuld naar box 3.']
        };
      },
      uitleg: 'Vereiste aflossing = schuld − annuïtaire restschuld na het aantal maanden van dit jaar, met rente / 12 per maand en het resterende aantal maanden uit het fictieve aflosschema.',
      letop: 'Indicatief: de termijn van ' + N.aflossingseisMaanden + ' maanden is een norm uit de bron die niet is geverifieerd; controleer de actuele norm. Het fictieve schema volgt de oorspronkelijke voorwaarden van de lening; bij renteherziening wordt het schema met de nieuwe rente herberekend. Lineair aflossen voldoet altijd. Leg vast welke leningdelen onder de eis vallen.'
    });

    RT.add({
      id: 'opeethypotheek', groep: 'hypotheek-woning', naam: 'Overwaarde opnemen per maand (opeethypotheek)',
      intro: 'Hoeveel schuld ontstaat er als je maandelijks een bedrag uit de overwaarde opneemt en de rente wordt bijgeschreven, en past dat binnen de maximale verstrekking?',
      kw: 'opeethypotheek verzilveren overwaarde rentebijschrijving senioren',
      velden: [
        { k: 'wens', l: 'Gewenste opname per maand', s: 'eur', std: 800 },
        { k: 'jr', l: 'Aantal jaren', s: 'num', na: 'jaar', std: 15 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.5 },
        { k: 'wrd', l: 'Woningwaarde', s: 'eur', std: 500000 },
        { k: 'hyp', l: 'Bestaande hypotheek', s: 'eur', std: 40000, opt: true },
        { k: 'max', l: 'Maximale verstrekking', s: 'pct', std: 60, tip: 'Aanname; hangt bij aanbieders af van leeftijd.' },
        { k: 'mom', l: 'Moment van opnemen', s: 'keuze', opties: MOMENT, std: 'begin' }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200, vooraf = v.mom === 'begin';
        if (n <= 0 || v.wens <= 0) return { fout: 'Vul een opname en een periode groter dan nul in.' };
        const schuld = eindwaarde(0, v.wens, i, n, vooraf), cw = annHoofdsom(v.wens, i, n) * (vooraf ? 1 + i : 1);
        const ruimte = Math.max(0, v.wrd * v.max / 100 - v.hyp), factor = schuld / v.wens;
        const past = schuld <= ruimte;
        return {
          lbl: 'Schuld aan het eind', groot: fmt.euro0(schuld), onder: 'na ' + fmt.duur(n) + ', inclusief bijgeschreven rente',
          rijen: [
            ['Totaal opgenomen', fmt.euro0(v.wens * n)],
            ['Bijgeschreven rente', fmt.euro0(schuld - v.wens * n)],
            ['Contante waarde van de opnames', fmt.euro0(cw)],
            ['Beschikbare ruimte (maximum − bestaande lening)', fmt.euro0(ruimte)],
            ['Past binnen de ruimte', past ? 'ja' : 'nee, tekort ' + fmt.euro0(schuld - ruimte)],
            ['Maximale opname per maand', fmt.euro(ruimte / factor), 'som']
          ]
        };
      },
      uitleg: 'Schuld = opname × ((1 + i)<sup>n</sup> − 1) / i, × (1 + i) bij opname aan het begin, i = rente / 12. Contante waarde = opname × (1 − (1 + i)<sup>−n</sup>) / i. Maximale opname = ruimte / (schuld per euro maandopname).',
      letop: 'Met rentebijschrijving groeit de schuld steeds sneller. De woningwaarde is gelijk gehouden. Aanbieders koppelen de maximale verstrekking aan leeftijd en levensverwachting en stellen eigen voorwaarden. Bespreek gevolgen voor erfgenamen, toeslagen en box 3 (rente is meestal niet aftrekbaar). Zie ook Overwaarde verzilveren met bijgeschreven rente.'
    });

    RT.add({
      id: 'krediethypotheek', groep: 'hypotheek-woning', naam: 'Krediethypotheek: rente over het opgenomen deel',
      intro: 'Bij een krediethypotheek betaal je alleen rente over het opgenomen deel. Hoeveel ruimte is er nog en hoe lang kun je maandelijks opnemen?',
      kw: 'krediethypotheek doorlopend krediet limiet opnemen',
      velden: [
        { k: 'lim', l: 'Kredietlimiet', s: 'eur', std: 100000 },
        { k: 'op', l: 'Nu opgenomen', s: 'eur', std: 35000 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.8 },
        { k: 'mnd', l: 'Maandelijkse opname', s: 'eur', std: 500, opt: true },
        { k: 'bij', l: 'Rente wordt bijgeschreven', s: 'keuze', opties: JANEE, std: 'nee' },
        { k: 'tar', l: 'Aftrektarief (0 als niet aftrekbaar)', s: 'pct', std: 0, opt: true }
      ],
      bereken(v) {
        const i = v.r / 1200;
        if (v.op > v.lim) return { fout: 'Het opgenomen bedrag is hoger dan de limiet.' };
        const rente = v.op * i;
        let m = 0, saldo = v.op;
        if (v.mnd > 0) while (m < 1200) { const volgende = (saldo + v.mnd) * (v.bij === 'ja' ? 1 + i : 1); if (volgende > v.lim) break; saldo = volgende; m++; }
        return {
          lbl: 'Vrije ruimte', groot: fmt.euro0(v.lim - v.op), onder: 'binnen de limiet',
          rijen: [
            ['Rente per maand over het opgenomen deel', fmt.euro(rente)],
            ['Netto rente per maand', fmt.euro(rente * (1 - Math.min(v.tar, NR.aftrekTariefMax) / 100))],
            ['Rente per maand bij volledige opname', fmt.euro(v.lim * i)],
            ['Maandelijks opnemen mogelijk gedurende', v.mnd > 0 ? (m >= 1200 ? 'meer dan 100 jaar' : fmt.duur(m)) : '–', 'som'],
            ['Totaal op te nemen in die periode', v.mnd > 0 ? fmt.euro0(v.mnd * m) : '–']
          ]
        };
      },
      uitleg: 'Rente per maand = opgenomen × rente / 12. Opnameduur: maandelijks saldo + opname (bij bijschrijving × (1 + i)) tot de limiet wordt overschreden. Zonder bijschrijving betaal je de rente apart.',
      letop: 'Rente op een krediethypotheek die na 2012 is afgesloten is in de regel niet aftrekbaar, omdat er niet annuïtair wordt afgelost; alleen overgangsrecht kan dat anders maken. De rente is meestal variabel. Opnemen is niet zomaar onbeperkt: aanbieders kunnen de limiet verlagen. Bij consumptieve besteding valt de schuld in box 3.'
    });

    RT.add({
      id: 'renteaftrek-verloop', groep: 'hypotheek-woning', naam: 'Renteaftrek nu en later',
      intro: 'De rente daalt door aflossing en het eigenwoningforfait stijgt met de WOZ-waarde. Hoe ontwikkelt het belastingvoordeel zich over de looptijd?',
      kw: 'renteaftrek verloop forfait woz stijging voordeel per jaar',
      peildatum: PEIL, fiscaal: ['eigenwoningforfait', 'maximaal aftrektarief', 'aftrek geringe eigenwoningschuld'],
      velden: [
        { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 325000 },
        { k: 'r', l: 'Rente', s: 'pct', std: 4.1 },
        { k: 'jr', l: 'Looptijd (annuïtair)', s: 'num', na: 'jaar', std: 30 },
        { k: 'woz', l: 'WOZ-waarde nu', s: 'eur', std: 400000 },
        { k: 'wst', l: 'WOZ-stijging per jaar', s: 'pct', std: 2, opt: true },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax }
      ],
      bereken(v) {
        const n = Math.round(v.jr * 12), i = v.r / 1200, tar = tarief(v.tar);
        if (n <= 0 || v.h <= 0) return { fout: 'Vul een hypotheekbedrag en een looptijd groter dan nul in.' };
        let woz = v.woz, tot = 0, kantel = null;
        const lijst = perJaar(v.h, i, n, 'ann').map((x, idx) => {
          const ew = ewSaldo(x.rente, woz, tar, Number(PEIL) + idx);
          if (kantel === null && x.rente < ew.forfait) kantel = x.j;
          tot += ew.voordeel; const r = { j: x.j, rente: x.rente, forfait: ew.forfait, vd: ew.voordeel }; woz *= 1 + v.wst / 100; return r;
        });
        const tien = lijst[Math.min(9, lijst.length - 1)];
        return {
          lbl: 'Belastingvoordeel jaar 1', groot: fmt.euro0(lijst[0].vd), onder: fmt.euro(lijst[0].vd / 12) + ' per maand',
          rijen: [
            ['Voordeel jaar ' + tien.j, fmt.euro0(tien.vd)],
            ['Voordeel laatste jaar', fmt.euro0(lijst[lijst.length - 1].vd)],
            ['Totaal over de looptijd', fmt.euro0(tot), 'som'],
            ['Gemiddeld per jaar', fmt.euro0(tot / lijst.length)],
            ['Forfait voor het eerst hoger dan de rente', kantel ? 'jaar ' + kantel : 'niet binnen de looptijd']
          ],
          tabel: { kop: ['Jaar', 'Rente', 'Forfait', 'Voordeel'], rijen: lijst.map(x => [String(x.j), fmt.euro0(x.rente), fmt.euro0(x.forfait), fmt.euro0(x.vd)]) }
        };
      },
      uitleg: 'Per jaar: rente uit het annuïtaire schema; forfait over de WOZ die elk jaar met de stijging toeneemt; voordeel = (rente − forfait) × aftrektarief. Is het forfait hoger, dan geldt de aftrek wegens geringe schuld met het afbouwpercentage van dat jaar (negatief voordeel = bijtelling).',
      letop: 'Forfaitpercentages, aftrektarief en de afbouw van de aftrek wegens geringe schuld zijn gelijk gehouden aan de peildatum, behalve de jaarlijkse afbouw; in werkelijkheid wijzigen ze. Rente na de rentevaste periode is gelijk verondersteld. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'rente-vooruitbetalen', groep: 'hypotheek-woning', naam: 'Hypotheekrente vooruitbetalen',
      intro: 'Rente voor de eerste maanden van volgend jaar nu al betalen en aftrekken: levert dat iets op als het aftrektarief volgend jaar lager is?',
      kw: 'rente vooruitbetalen aftrek december aow tarief',
      peildatum: PEIL, fiscaal: ['maximaal aftrektarief', 'tarief eerste schijf vanaf AOW-leeftijd', 'maximaal 6 maanden vooruit (bron, niet geverifieerd)'],
      velden: [
        { k: 'rente', l: 'Hypotheekrente per maand', s: 'eur', std: 1100 },
        { k: 'mnd', l: 'Aantal maanden vooruit', s: 'num', na: 'mnd', std: N.renteVooruitMaanden },
        { k: 'tn', l: 'Aftrektarief dit jaar', s: 'pct', std: NR.aftrekTariefMax },
        { k: 'tl', l: 'Aftrektarief volgend jaar', s: 'pct', std: NR.box1.tarief1Aow, tip: 'Voorbeeld: tarief eerste schijf vanaf de AOW-leeftijd.' },
        { k: 'sr', l: 'Spaarrente (gemist rendement)', s: 'pct', std: 2, opt: true }
      ],
      bereken(v) {
        const mnd = Math.round(v.mnd);
        if (mnd <= 0 || mnd > N.renteVooruitMaanden) return { fout: 'Kies 1 tot en met ' + N.renteVooruitMaanden + ' maanden.' };
        const bedrag = v.rente * mnd, voordeel = bedrag * (tarief(v.tn) - tarief(v.tl)) / 100;
        const gemist = bedrag * v.sr / 1200 * (mnd + 1) / 2, netto = voordeel - gemist;
        return {
          lbl: 'Netto voordeel', groot: fmt.euro0(netto), onder: netto > 0 ? 'vooruitbetalen loont' : 'vooruitbetalen loont niet',
          rijen: [
            ['Vooruit te betalen rente', fmt.euro0(bedrag)],
            ['Aftrek dit jaar', fmt.euro0(bedrag * tarief(v.tn) / 100)],
            ['Aftrek volgend jaar bij normaal betalen', fmt.euro0(bedrag * tarief(v.tl) / 100)],
            ['Tariefvoordeel', fmt.euro0(voordeel)],
            ['Gemiste spaarrente', '− ' + fmt.euro0(gemist), 'som']
          ]
        };
      },
      uitleg: 'Tariefvoordeel = vooruitbetaalde rente × (aftrektarief dit jaar − aftrektarief volgend jaar), beide begrensd op het maximale aftrektarief. Gemiste rente = bedrag × spaarrente / 12 × gemiddeld (maanden + 1) / 2 maanden.',
      letop: 'Indicatief: het maximum van ' + N.renteVooruitMaanden + ' maanden is een norm uit de bron die niet is geverifieerd; controleer de actuele norm. Sinds het aftrektarief is begrensd op het basistarief levert vooruitbetalen meestal niets meer op; alleen bij een duidelijk lager tarief volgend jaar (bijvoorbeeld AOW-leeftijd of een veel lager inkomen). Vraag de geldverstrekker of vooruitbetalen mogelijk is. Rente over het forfait heen telt niet: als het forfait hoger is dan de rente is er geen voordeel.'
    });

    RT.add({
      id: 'vergoeding-aflossingsvrij', groep: 'hypotheek-woning', naam: 'Vergoeding bij vervroegd aflossen (aflossingsvrij)',
      intro: 'Een indicatie van de vergoeding (boeterente) bij volledig aflossen van een aflossingsvrije lening tijdens de rentevaste periode.',
      kw: 'boeterente vergoeding vervroegd aflossen aflossingsvrij oversluiten',
      velden: [
        { k: 'h', l: 'Aflossingsvrije lening', s: 'eur', std: 250000 },
        { k: 'bv', l: 'Boetevrij deel per jaar', s: 'pct', std: 10, opt: true, tip: 'Aanname; zie de voorwaarden.' },
        { k: 'ro', l: 'Contractrente', s: 'pct', std: 5.1 },
        { k: 'rv', l: 'Vergelijkingsrente (actuele rente voor de resterende periode)', s: 'pct', std: 3.5 },
        { k: 'm', l: 'Resterende rentevaste maanden', s: 'num', na: 'mnd', std: 72 }
      ],
      bereken(v) {
        const m = Math.round(v.m);
        if (m <= 0) return { fout: 'Vul een resterende periode groter dan nul in.' };
        const vrij = v.h * v.bv / 100, grond = Math.max(0, v.h - vrij), dr = Math.max(0, v.ro - v.rv) / 100, iv = v.rv / 1200;
        let som = 0, dalend = 0;
        for (let k = 1; k <= m; k++) {
          const d = Math.pow(1 + iv, k);
          som += grond * dr / 12 / d;
          dalend += grond * (1 - (k - 1) / m) * dr / 12 / d;
        }
        return {
          lbl: 'Indicatie vergoeding', groot: fmt.euro0(som), onder: dr > 0 ? fmt.pct(som / Math.max(grond, 1) * 100, 2) + ' van de grondslag' : 'geen renteverschil: geen vergoeding',
          rijen: [
            ['Boetevrij deel', fmt.euro0(vrij)],
            ['Grondslag', fmt.euro0(grond)],
            ['Renteverschil', fmt.pct(dr * 100, 2)],
            ['Ter vergelijking: schuld die gelijkmatig daalt', fmt.euro0(dalend)],
            ['Extra door het niet aflossen', fmt.euro0(som - dalend), 'som']
          ]
        };
      },
      uitleg: 'Per resterende maand: grondslag × renteverschil / 12, contant gemaakt tegen de vergelijkingsrente: som van bedrag / (1 + vergelijkingsrente / 12)<sup>k</sup>. Bij aflossingsvrij blijft de grondslag gelijk, waardoor de vergoeding hoger is dan bij een dalende schuld.',
      letop: 'Alleen een indicatie: geldverstrekkers verschillen in vergelijkingsrente, behandeling van het boetevrije deel en rekenmethode, binnen de wettelijke grens van het financiële nadeel. Vraag altijd de officiële berekening op en leg die vast. Een vergoeding kan bij oversluiten aftrekbaar zijn als financieringskosten.'
    });

    RT.add({
      id: 'kosten-oversluiten', groep: 'hypotheek-woning', naam: 'Kosten van oversluiten',
      intro: 'Alle eenmalige kosten van oversluiten bij elkaar, het fiscaal aftrekbare deel en de terugverdientijd.',
      kw: 'oversluiten kosten terugverdientijd boeterente aftrekbaar financieringskosten',
      peildatum: PEIL, fiscaal: ['maximaal aftrektarief'],
      velden: [
        { k: 'b', l: 'Vergoeding (boeterente)', s: 'eur', std: 9000, opt: true },
        { k: 'adv', l: 'Advies en bemiddeling', s: 'eur', std: 3250, opt: true },
        { k: 'tax', l: 'Taxatie', s: 'eur', std: 650, opt: true },
        { k: 'not', l: 'Notaris hypotheekakte', s: 'eur', std: 900, opt: true },
        { k: 'nhg', l: 'Borgtochtprovisie NHG', s: 'eur', std: 0, opt: true },
        { k: 'kad', l: 'Kadaster inschrijving nieuwe hypotheek', s: 'eur', std: 150, opt: true },
        { k: 'roy', l: 'Doorhalen oude hypotheek en overige kosten', s: 'eur', std: 70, opt: true },
        { k: 'tar', l: 'Aftrektarief', s: 'pct', std: NR.aftrekTariefMax },
        { k: 'bes', l: 'Lagere bruto maandlast na oversluiten', s: 'eur', std: 201, opt: true }
      ],
      bereken(v) {
        const aftrekbaar = v.b + v.adv + v.tax + v.not + v.nhg + v.kad, tot = aftrekbaar + v.roy;
        const voordeel = aftrekbaar * tarief(v.tar) / 100, netto = tot - voordeel;
        return {
          lbl: 'Netto oversluitkosten', groot: fmt.euro0(netto), onder: 'na belastingvoordeel',
          rijen: [
            ['Totale kosten', fmt.euro0(tot)],
            ['Aftrekbaar als financieringskosten', fmt.euro0(aftrekbaar)],
            ['Belastingvoordeel', '− ' + fmt.euro0(voordeel)],
            ['Niet aftrekbaar', fmt.euro0(v.roy)],
            ['Terugverdientijd', v.bes > 0 ? fmt.duur(Math.ceil(netto / v.bes)) : '–', 'som']
          ]
        };
      },
      uitleg: 'Aftrekbaar = vergoeding + advies + taxatie + notaris hypotheekakte + borgtochtprovisie + inschrijving kadaster. Voordeel = aftrekbaar × aftrektarief. Terugverdientijd = netto kosten / maandelijkse besparing (afgerond naar boven).',
      letop: 'De besparing is bruto; netto valt die lager uit doordat er minder rente aftrekbaar is. De kosten zijn aftrekbaar als de nieuwe lening eigenwoningschuld is, in het jaar van betaling. Kijk ook verder dan de rentevaste periode: een lagere rente nu zegt niets over later. Normen wijzigen jaarlijks; controleer de peildatum.'
    });
  }
})(window.RT);
