/* Rekenhulpen – groep "lenen-rente" (Lenen, rente en rekenbasis).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { annTermijn, annRest, zoekNul, verloop } = RT.fin;
  const { VORM2 } = RT.keuzes;

  RT.add({
    id: 'aflostijd', groep: 'lenen-rente', naam: 'Aflostijd bij vast termijnbedrag',
    intro: 'Hoe lang duurt het om een lening af te lossen als de klant elke maand hetzelfde bedrag betaalt?',
    velden: [
      { k: 'h', l: 'Openstaande schuld', s: 'eur', std: 18000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 7.9 },
      { k: 't', l: 'Betaling per maand', s: 'eur', std: 400 }
    ],
    bereken(v) {
      const i = v.r / 1200;
      if (v.h <= 0 || v.t <= 0) return { fout: 'Vul een schuld en een maandbedrag groter dan nul in.' };
      if (v.t <= v.h * i) return { fout: 'Het maandbedrag dekt de rente niet (rente eerste maand ' + fmt.euro(v.h * i) + '). De schuld wordt zo nooit afgelost.' };
      let rest = v.h, mnd = 0, rente = 0, laatst = 0;
      while (rest > 0.005 && mnd < 1200) {
        const r = rest * i, afl = Math.min(v.t - r, rest);
        rente += r; rest -= afl; laatst = afl + r; mnd++;
      }
      return {
        lbl: 'Aflostijd', groot: fmt.duur(mnd), onder: mnd + ' maandbetalingen',
        rijen: [
          ['Laatste betaling', fmt.euro(laatst)],
          ['Totaal betaalde rente', fmt.euro(rente)],
          ['Totaal betaald', fmt.euro(v.h + rente), 'som']
        ]
      };
    },
    uitleg: 'Per maand: rente = schuld × jaarrente / 12; de rest van de betaling gaat naar aflossing. Dit wordt doorgerekend tot de schuld nul is.',
    letop: 'Bij consumptief krediet kan de geldverstrekker een andere rentemethode of extra kosten hanteren. Een doorlopend krediet kent vaak een minimale maandtermijn als percentage van de limiet.'
  });

  RT.add({
    id: 'rente-terug', groep: 'lenen-rente', naam: 'Rente terugrekenen uit een termijn',
    intro: 'Hoofdsom, maandbedrag en aantal termijnen zijn bekend. Welke rente zit erin verwerkt?',
    velden: [
      { k: 'h', l: 'Geleend bedrag', s: 'eur', std: 15000 },
      { k: 't', l: 'Maandbedrag', s: 'eur', std: 305 },
      { k: 'n', l: 'Aantal maandtermijnen', s: 'num', std: 60 }
    ],
    bereken(v) {
      const n = Math.round(v.n);
      if (v.h <= 0 || v.t <= 0 || n <= 0) return { fout: 'Vul bedragen en een aantal termijnen groter dan nul in.' };
      if (v.t * n <= v.h) return { fout: 'Samen betalen de termijnen niet meer dan het geleende bedrag; er zit geen positieve rente in.' };
      if (annTermijn(v.h, 1, n) < v.t) return { fout: 'Het maandbedrag is onrealistisch hoog ten opzichte van de lening.' };
      const i = zoekNul(r => annTermijn(v.h, r, n) - v.t, 0, 1);
      const eff = (Math.pow(1 + i, 12) - 1) * 100;
      return {
        lbl: 'Effectieve rente per jaar', groot: fmt.pct(eff, 2), onder: 'zonder bijkomende kosten',
        rijen: [
          ['Rente per maand', fmt.pct(i * 100, 4)],
          ['Nominale jaarrente (maandrente × 12)', fmt.pct(i * 1200, 2)],
          ['Totaal te betalen', fmt.euro(v.t * n)],
          ['Waarvan rente', fmt.euro(v.t * n - v.h), 'som']
        ]
      };
    },
    uitleg: 'De maandrente i wordt numeriek gezocht zodat H × i / (1 − (1 + i)<sup>−n</sup>) gelijk is aan het maandbedrag. Effectief per jaar = (1 + i)<sup>12</sup> − 1.',
    letop: 'Het wettelijke jaarlijkse kostenpercentage bij consumptief krediet rekent ook verplichte kosten mee en kan dus hoger uitvallen. Toets een aanbieding aan de actuele wettelijke maximale kredietvergoeding.'
  });

  RT.add({
    id: 'tussenstand', groep: 'lenen-rente', naam: 'Schuld na een aantal maanden',
    intro: 'De stand van een lening na een gekozen aantal betaalde termijnen: schuld, aflossing en betaalde rente tot dan.',
    velden: [
      { k: 'h', l: 'Hoofdsom', s: 'eur', std: 280000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 3.8 },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'k', l: 'Aantal betaalde maanden', s: 'num', std: 84 },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: VORM2, std: 'ann' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), k = Math.round(v.k), i = v.r / 1200;
      if (n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      if (k < 0 || k > n) return { fout: 'Het aantal betaalde maanden ligt tussen 0 en ' + n + '.' };
      let rest, rente, termijn;
      if (v.vorm === 'ann') {
        termijn = annTermijn(v.h, i, n); rest = annRest(v.h, i, n, k); rente = termijn * k - (v.h - rest);
      } else {
        const afl = v.h / n; rest = v.h - afl * k;
        rente = i * (k * v.h - afl * k * (k - 1) / 2);
        termijn = k < n ? afl + rest * i : 0;
      }
      return {
        lbl: 'Openstaande schuld na ' + k + ' maanden', groot: fmt.euro(Math.max(0, rest)), onder: 'nog ' + fmt.duur(n - k) + ' te gaan',
        rijen: [
          ['Afgelost tot nu', fmt.euro(v.h - rest)],
          ['Betaalde rente tot nu', fmt.euro(rente)],
          [v.vorm === 'ann' ? 'Maandtermijn' : 'Volgende termijn', fmt.euro(termijn), 'som']
        ]
      };
    },
    uitleg: 'Annuïtair: schuld na k maanden = H × (1 + i)<sup>k</sup> − T × ((1 + i)<sup>k</sup> − 1) / i. Lineair: H − k × H / n. Rente per maand i = jaarrente / 12.',
    letop: 'Uitgaande van een gelijke rente over de hele periode en zonder extra aflossingen. Voor een volledig schema per jaar: zie <a href="maandlasten.html">Bruto maandlasten</a>.'
  });

  RT.add({
    id: 'rente-omrekenen', groep: 'lenen-rente', naam: 'Nominale en effectieve rente',
    intro: 'Zet een rente om tussen nominaal en effectief, en zie de rente per maand, kwartaal of halfjaar.',
    velden: [
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 4.5 },
      { k: 'soort', l: 'Dit percentage is', s: 'keuze', opties: [['nom', 'Nominaal'], ['eff', 'Effectief']], std: 'nom' },
      { k: 'm', l: 'Rente wordt bijgeschreven', s: 'keuze', opties: [['12', 'Per maand'], ['4', 'Per kwartaal'], ['2', 'Per halfjaar'], ['1', 'Per jaar']], std: '12' }
    ],
    bereken(v) {
      const m = +v.m, r = v.r / 100;
      let nom, eff;
      if (v.soort === 'nom') { nom = r; eff = Math.pow(1 + r / m, m) - 1; }
      else { eff = r; nom = m * (Math.pow(1 + r, 1 / m) - 1); }
      const per = { 12: 'maand', 4: 'kwartaal', 2: 'halfjaar', 1: 'jaar' }[m];
      return {
        lbl: v.soort === 'nom' ? 'Effectieve jaarrente' : 'Nominale jaarrente',
        groot: fmt.pct((v.soort === 'nom' ? eff : nom) * 100, 3),
        onder: 'bij bijschrijving per ' + per,
        rijen: [
          ['Nominaal per jaar', fmt.pct(nom * 100, 3)],
          ['Effectief per jaar', fmt.pct(eff * 100, 3)],
          ['Rente per ' + per, fmt.pct(nom / m * 100, 4), 'som']
        ]
      };
    },
    uitleg: 'Effectief = (1 + nominaal / m)<sup>m</sup> − 1. Nominaal = m × ((1 + effectief)<sup>1/m</sup> − 1). m = aantal bijschrijvingen per jaar.',
    letop: 'Nederlandse hypotheekverstrekkers rekenen de maandrente meestal als nominale jaarrente gedeeld door 12; het effectieve percentage ligt daardoor iets hoger dan de offerterente.'
  });

  RT.add({
    id: 'omslagrente', groep: 'lenen-rente', naam: 'Omslagrente bij korter of langer vast',
    intro: 'Kort vastzetten is goedkoper, lang vastzetten zekerder. Hoe hoog mag de rente na de korte periode worden voordat lang vast de betere keuze was?',
    velden: [
      { k: 'h', l: 'Hypotheekbedrag', s: 'eur', std: 300000 },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'vorm', l: 'Aflosvorm', s: 'keuze', opties: [['ann', 'Annuïtair'], ['vrij', 'Aflossingsvrij']], std: 'ann' },
      { k: 'rs', l: 'Rente korte periode', s: 'pct', std: 3.7 },
      { k: 's', l: 'Korte rentevaste periode', s: 'num', na: 'jaar', std: 10 },
      { k: 'rl', l: 'Rente lange periode', s: 'pct', std: 4.15 },
      { k: 'l', l: 'Lange rentevaste periode', s: 'num', na: 'jaar', std: 20 }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), S = Math.round(v.s * 12), L = Math.round(v.l * 12);
      if (v.h <= 0 || n <= 0 || S <= 0) return { fout: 'Vul bedrag, looptijd en perioden groter dan nul in.' };
      if (L <= S || L > n) return { fout: 'De lange periode moet langer zijn dan de korte en past binnen de looptijd.' };
      const is = v.rs / 1200, il = v.rl / 1200;
      const lang = verloop(v.h, il, n, L, v.vorm);
      const kort = verloop(v.h, is, n, S, v.vorm);
      const renteB = x => kort.rente + verloop(kort.rest, x, n - S, L - S, v.vorm).rente;
      const doel = lang.rente;
      if (renteB(0) >= doel) return { lbl: 'Omslagrente', groot: 'onder 0%', onder: 'lang vast is in elk scenario voordeliger', rijen: [] };
      const x = zoekNul(r => renteB(r) - doel, 0, 0.05);
      const sig = [];
      if (x * 1200 < v.rl) sig.push('De omslagrente ligt onder de huidige lange rente.');
      return {
        lbl: 'Omslagrente na ' + fmt.getal(v.s, v.s % 1 ? 1 : 0) + ' jaar', groot: fmt.pct(x * 1200, 2),
        onder: 'voor de resterende ' + fmt.getal((L - S) / 12, (L - S) % 12 ? 1 : 0) + ' jaar van de lange periode',
        rijen: [
          ['Bruto rente bij lang vast', fmt.euro0(lang.rente)],
          ['Bruto rente in de korte periode', fmt.euro0(kort.rente)],
          ['Schuld bij afloop korte periode', fmt.euro0(kort.rest)],
          ['Rentevoordeel in de korte periode', fmt.euro0(verloop(v.h, il, n, S, v.vorm).rente - kort.rente), 'som']
        ],
        signalen: ['Is de rente na ' + fmt.getal(v.s, 0) + ' jaar hoger dan ' + fmt.pct(x * 1200, 2) + ', dan was lang vastzetten goedkoper; is ze lager, dan was kort vastzetten goedkoper.'].concat(sig)
      };
    },
    uitleg: 'Gezocht wordt de rente x voor de tweede periode waarbij de totale bruto rente over de lange periode gelijk is: rente korte periode + rente over de restschuld tegen x (in de resterende maanden) = rente bij lang vast. Annuïtair wordt na de korte periode opnieuw berekend over de resterende looptijd.',
    letop: 'De omslagrente is geen renteverwachting. Lang vast biedt zekerheid over de maandlast; die zekerheid heeft waarde die niet in euro’s is uit te drukken. Kijk ook naar de leennormen (bij korter dan tien jaar vast geldt een toetsrente), verlengmogelijkheden en de risicobereidheid van de klant. Verschillen in restschuld en tijdswaarde zijn niet verdisconteerd.'
  });

  RT.add({
    id: 'slottermijn', groep: 'lenen-rente', naam: 'Lening met slottermijn',
    intro: 'Bij financial lease of een autolening blijft aan het eind vaak een slottermijn over. Wat is de maandtermijn en hoeveel staat er na een aantal maanden nog open?',
    velden: [
      { k: 'h', l: 'Te financieren bedrag', s: 'eur', std: 32000, tip: 'Aankoopprijs minus aanbetaling of inruil.' },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 7.5 },
      { k: 'n', l: 'Aantal maandtermijnen', s: 'num', std: 60 },
      { k: 'b', l: 'Slottermijn', s: 'eur', std: 9000, opt: true },
      { k: 'k', l: 'Al betaalde termijnen', s: 'num', std: 24 }
    ],
    bereken(v) {
      const n = Math.round(v.n), k = Math.round(v.k), i = v.r / 1200;
      if (v.h <= 0 || n <= 0) return { fout: 'Vul een bedrag en een aantal termijnen groter dan nul in.' };
      if (v.b >= v.h) return { fout: 'De slottermijn moet lager zijn dan het te financieren bedrag.' };
      if (k < 0 || k > n) return { fout: 'Het aantal betaalde termijnen ligt tussen 0 en ' + n + '.' };
      const cwSlot = v.b / Math.pow(1 + i, n);
      const t = annTermijn(v.h - cwSlot, i, n);
      const g = Math.pow(1 + i, k), rest = i === 0 ? v.h - t * k : v.h * g - t * (g - 1) / i;
      const rente = t * n + v.b - v.h;
      return {
        lbl: 'Maandtermijn', groot: fmt.euro(t), onder: n + ' termijnen plus een slottermijn van ' + fmt.euro0(v.b),
        rijen: [
          ['Openstaand na ' + k + ' termijnen', fmt.euro(rest)],
          ['Totaal te betalen', fmt.euro(t * n + v.b)],
          ['Waarvan rente', fmt.euro(rente), 'som'],
          ['Termijn zonder slottermijn', fmt.euro(annTermijn(v.h, i, n))]
        ],
        signalen: ['Voor de leencapaciteit telt meestal het oorspronkelijke kredietbedrag of de registratie bij BKR, niet alleen de maandtermijn. Controleer hoe de geldverstrekker een lopend leasecontract weegt.']
      };
    },
    uitleg: 'Termijn = (bedrag − slottermijn / (1 + i)<sup>n</sup>) × i / (1 − (1 + i)<sup>−n</sup>), met i = jaarrente / 12. Openstaand na k termijnen = bedrag × (1 + i)<sup>k</sup> − termijn × ((1 + i)<sup>k</sup> − 1) / i; aan het eind is dat de slottermijn.',
    letop: 'Leasemaatschappijen kunnen de rente anders berekenen of kosten in de termijn verwerken; het wettelijke jaarlijkse kostenpercentage staat in het contract. Bij vervroegd beëindigen gelden de contractvoorwaarden.'
  });
})(window.RT);
