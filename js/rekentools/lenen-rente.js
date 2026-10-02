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

  /* =====================================================================
   * Fase 2 (batch 6): rekenbasis, consumptief krediet, lease en studieschuld
   * ===================================================================== */
  const { annHoofdsom, ncw, irr, maandUitJaar } = RT.fin;

  /* Normen die (nog) niet in normen.js staan. Peildatum 2026; gecontroleerd op 2026-10-02, status per regel.
   * Alleen als standaardwaarde van een invoerveld gebruikt, zodat de gebruiker ze kan aanpassen. */
  const NL = {
    peildatum: '2026',
    nibudBasis: 1450,        // niet bevestigd – basisbedrag levensonderhoud per maand (hangt af van huishouden)
    termijnAandeel: 100,     // niet bevestigd (aanname) – deel van de bestedingsruimte dat als termijn mag dienen
    duoRente: 2.33,          // bevestigd (DUO) – rente studieschuld SF35 in 2026 (2025: 2,57%)
    duoTermijnJaar: 35,      // bevestigd (DUO) – terugbetaaltermijn (SF35)
    duoVrijeVoet: 26819,     // bevestigd (DUO) – draagkrachtvrije voet SF35 2026 per jaar, alleenstaande zonder kinderen (met partner/kind: € 38.352)
    duoDraagkrachtPct: 4     // bevestigd (DUO, SF35) – deel van het inkomen boven de vrije voet
  };

  // Aantal termijnen t om schuld pv af te lossen bij rente i per periode (Infinity als de termijn de rente niet dekt)
  const aantalTermijnen = (pv, t, i) => i === 0 ? pv / t : (t <= pv * i ? Infinity : -Math.log(1 - pv * i / t) / Math.log(1 + i));
  // Maand voor maand aflossen met een vaste termijn; extra(m) = extra aflossing direct na maand m
  const afbouwen = (h, i, t, extra) => {
    let rest = h, m = 0, rente = 0, betaald = 0, extraTot = 0;
    while (rest > 0.005 && m < 1200) {
      const r = rest * i, afl = Math.min(t - r, rest);
      rente += r; rest -= afl; betaald += afl + r; m++;
      const x = extra ? Math.min(extra(m), rest) : 0;
      rest -= x; betaald += x; extraTot += x;
    }
    return { m, rente, betaald, extraTot, rest };
  };
  const duurTekst = mnd => Number.isFinite(mnd) ? fmt.duur(Math.ceil(mnd - 1e-9)) : 'wordt nooit afgelost';
  const RENTEMETHODE = [['eff', 'Samengesteld uit de jaarrente (zoals het kostenpercentage)'], ['nom', 'Jaarrente gedeeld door 12']];
  const verschilPct = x => (x < 0 ? '− ' : '+ ') + fmt.getal(Math.abs(x), 3) + ' procentpunt';
  const maandrente = (r, m) => m === 'nom' ? r / 1200 : maandUitJaar(r);

  RT.add({
    id: 'annuiteit-termijn', groep: 'lenen-rente', naam: 'Annuïteit per maand, kwartaal of jaar',
    intro: 'Het vaste termijnbedrag van een annuïtaire lening, met keuze voor betalen per maand, kwartaal, halfjaar of jaar.',
    kw: 'annuiteit annuïteit termijnbedrag kwartaal jaarlijks pmt',
    velden: [
      { k: 'h', l: 'Hoofdsom', s: 'eur', std: 300000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 4 },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 30 },
      { k: 'p', l: 'Betalen', s: 'keuze', opties: [['12', 'Per maand'], ['4', 'Per kwartaal'], ['2', 'Per halfjaar'], ['1', 'Per jaar']], std: '12' },
      { k: 'm', l: 'Rente per termijn', s: 'keuze', opties: [['nom', 'Jaarrente gedeeld door het aantal termijnen'], ['eff', 'Samengesteld omgerekend']], std: 'nom', breed: true }
    ],
    bereken(v) {
      const p = +v.p, n = Math.round(v.jr * p);
      if (v.h <= 0 || n <= 0) return { fout: 'Vul een hoofdsom en een looptijd groter dan nul in.' };
      const i = v.m === 'nom' ? v.r / 100 / p : Math.pow(1 + v.r / 100, 1 / p) - 1;
      const t = annTermijn(v.h, i, n), tot = t * n;
      const per = { 12: 'maand', 4: 'kwartaal', 2: 'halfjaar', 1: 'jaar' }[p];
      return {
        lbl: 'Termijnbedrag per ' + per, groot: fmt.euro(t), onder: n + ' gelijke termijnen',
        rijen: [
          ['Rente per termijn', fmt.pct(i * 100, 4)],
          ['Rente in de eerste termijn', fmt.euro(v.h * i)],
          ['Aflossing in de eerste termijn', fmt.euro(t - v.h * i)],
          ['Totaal te betalen', fmt.euro(tot)],
          ['Waarvan rente', fmt.euro(tot - v.h), 'som'],
          ['Rente als deel van de hoofdsom', fmt.pct((tot - v.h) / v.h * 100, 1)]
        ]
      };
    },
    uitleg: 'Termijn = H × i / (1 − (1 + i)<sup>−n</sup>). Bij “gedeeld” is i = jaarrente / aantal termijnen per jaar, bij “samengesteld” is i = (1 + jaarrente)<sup>1/p</sup> − 1. n = looptijd × aantal termijnen per jaar.',
    letop: 'Hypotheekverstrekkers in Nederland delen de jaarrente meestal door 12; bij consumptief krediet hoort de maandrente bij het jaarlijkse kostenpercentage (samengesteld). Kosten en verzekeringen zitten niet in het termijnbedrag.'
  });

  RT.add({
    id: 'ncw-en-irr', groep: 'lenen-rente', naam: 'Netto contante waarde en interne rente',
    intro: 'Waardeer een reeks kasstromen: wat zijn ze vandaag waard bij een gekozen rendementseis, en welk rendement zit erin?',
    kw: 'ncw npv irr interne rentevoet dcf kasstroom cashflow investering disconteren',
    velden: [
      { k: 'c', l: 'Kasstromen per periode (eerst periode 0)', s: 'tekst', regels: 6, std: '-100000\n25000\n28000\n30000\n32000\n35000', breed: true, tip: 'Eén bedrag per regel of gescheiden door een puntkomma. Uitgaven negatief. Decimalen met een komma.' },
      { k: 'r', l: 'Rendementseis (disconteringsvoet) per periode', s: 'pct', std: 8 }
    ],
    bereken(v) {
      const cf = String(v.c || '').split(/[;\n]+/).map(x => x.trim()).filter(Boolean).map(RT.lees.getal);
      if (cf.some(x => !Number.isFinite(x))) return { fout: 'Eén van de kasstromen is geen getal.' };
      if (cf.length < 2) return { fout: 'Vul minstens twee kasstromen in (periode 0 en verder).' };
      const r = v.r / 100;
      if (r <= -1) return { fout: 'De disconteringsvoet moet groter zijn dan −100%.' };
      const w = ncw(cf, r), ir = irr(cf), som = cf.reduce((a, b) => a + b, 0);
      let cum = 0;
      return {
        lbl: 'Netto contante waarde', groot: fmt.euro(w), onder: w >= 0 ? 'de kasstromen halen de rendementseis' : 'de kasstromen halen de rendementseis niet',
        rijen: [
          ['Interne rente per periode', Number.isFinite(ir) ? fmt.pct(ir * 100, 2) : 'niet te bepalen'],
          ['Som van de kasstromen (niet verdisconteerd)', fmt.euro(som)],
          ['Aantal perioden na periode 0', fmt.getal(cf.length - 1), 'som']
        ],
        signalen: Number.isFinite(ir) ? [] : ['Een interne rente bestaat alleen als er minstens één keer van teken wordt gewisseld (uitgave en ontvangst).'],
        tabel: { titel: 'Kasstromen', kop: ['Periode', 'Kasstroom', 'Contante waarde', 'Cumulatief'], rijen: cf.map((c, t) => { const cw = c / Math.pow(1 + r, t); cum += cw; return [String(t), fmt.euro0(c), fmt.euro0(cw), fmt.euro0(cum)]; }) }
      };
    },
    uitleg: 'NCW = Σ CF<sub>t</sub> / (1 + r)<sup>t</sup>, met t = 0 voor de eerste kasstroom. De interne rente is de r waarbij de NCW precies nul is; die wordt numeriek gezocht tussen −99% en 1.000% per periode.',
    letop: 'De periode is wat u invoert: jaren, kwartalen of maanden. Bij meerdere tekenwisselingen kunnen er meerdere interne renten bestaan; dan wordt er één gevonden. Belasting, inflatie en risico zitten alleen in de uitkomst als u ze in de kasstromen of de rendementseis verwerkt.'
  });

  RT.add({
    id: 'samengesteld-naar-enkelvoudig', groep: 'lenen-rente', naam: 'Samengestelde rente omzetten naar enkelvoudig',
    intro: 'Welk enkelvoudig rentepercentage per jaar levert over dezelfde looptijd precies dezelfde eindwaarde op als rente op rente?',
    kw: 'enkelvoudige rente samengestelde rente rente op rente omrekenen',
    velden: [
      { k: 's', l: 'Samengestelde rente per jaar', s: 'pct', std: 5 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'jaar', std: 10 }
    ],
    bereken(v) {
      if (v.n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      const groei = Math.pow(1 + v.s / 100, v.n) - 1, e = groei / v.n;
      return {
        lbl: 'Gelijkwaardige enkelvoudige rente', groot: fmt.pct(e * 100, 3), onder: 'per jaar, over ' + fmt.getal(v.n, v.n % 1 ? 1 : 0) + ' jaar',
        rijen: [
          ['Totale groei over de looptijd', fmt.pct(groei * 100, 2)],
          ['€ 10.000 groeit tot', fmt.euro(10000 * (1 + groei)), 'som'],
          ['Verschil met het samengestelde percentage', verschilPct((e - v.s / 100) * 100)]
        ]
      };
    },
    uitleg: 'Totale groei G = (1 + s)<sup>n</sup> − 1. De enkelvoudige rente e verdeelt die groei gelijk over de jaren: e = G / n.',
    letop: 'Enkelvoudige rente wordt alleen over de oorspronkelijke inleg berekend. Een hoger enkelvoudig percentage is daarom niet per se gunstiger; vergelijk altijd over dezelfde looptijd.'
  });

  RT.add({
    id: 'enkelvoudig-naar-samengesteld', groep: 'lenen-rente', naam: 'Enkelvoudige rente omzetten naar samengesteld',
    intro: 'Welk samengesteld rentepercentage per jaar hoort bij een enkelvoudige rente over een bepaalde looptijd?',
    kw: 'enkelvoudige rente samengestelde rente rente op rente omrekenen effectief',
    velden: [
      { k: 'e', l: 'Enkelvoudige rente per jaar', s: 'pct', std: 6 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'jaar', std: 10 }
    ],
    bereken(v) {
      if (v.n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      const factor = 1 + v.e / 100 * v.n;
      if (factor <= 0) return { fout: 'Bij deze negatieve rente is de inleg na de looptijd volledig verdwenen.' };
      const s = Math.pow(factor, 1 / v.n) - 1;
      return {
        lbl: 'Gelijkwaardige samengestelde rente', groot: fmt.pct(s * 100, 3), onder: 'per jaar, over ' + fmt.getal(v.n, v.n % 1 ? 1 : 0) + ' jaar',
        rijen: [
          ['Totale groei over de looptijd', fmt.pct((factor - 1) * 100, 2)],
          ['€ 10.000 groeit tot', fmt.euro(10000 * factor), 'som'],
          ['Verschil met het enkelvoudige percentage', verschilPct((s - v.e / 100) * 100)]
        ]
      };
    },
    uitleg: 'Eindwaarde bij enkelvoudige rente = 1 + e × n. De samengestelde rente s volgt uit (1 + s)<sup>n</sup> = 1 + e × n, dus s = (1 + e × n)<sup>1/n</sup> − 1.',
    letop: 'Hoe langer de looptijd, hoe verder het samengestelde percentage onder het enkelvoudige ligt. Dit is een omrekening van percentages; kosten en belasting zijn niet meegenomen.'
  });

  RT.add({
    id: 'lening-maandbedrag-jkp', groep: 'lenen-rente', naam: 'Maandbedrag lening bij een kostenpercentage',
    intro: 'Het maandbedrag van een persoonlijke lening bij het jaarlijkse kostenpercentage, of omgekeerd: hoeveel kan worden geleend bij een maandbedrag?',
    kw: 'persoonlijke lening jkp jaarlijks kostenpercentage maandbedrag leenbedrag hoogte lening consumptief krediet',
    velden: [
      { k: 'richting', l: 'Wat wilt u weten?', s: 'keuze', opties: [['termijn', 'Maandbedrag bij een leenbedrag'], ['bedrag', 'Leenbedrag bij een maandbedrag']], std: 'termijn', breed: true },
      { k: 'h', l: 'Leenbedrag', s: 'eur', std: 15000, als: v => v.richting === 'termijn' },
      { k: 't', l: 'Maandbedrag', s: 'eur', std: 275, als: v => v.richting === 'bedrag' },
      { k: 'r', l: 'Jaarlijks kostenpercentage', s: 'pct', std: 7.9 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'maanden', std: 60 },
      { k: 'm', l: 'Maandrente', s: 'keuze', opties: RENTEMETHODE, std: 'eff', breed: true }
    ],
    bereken(v) {
      const n = Math.round(v.n), i = maandrente(v.r, v.m);
      if (n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      const termijnRichting = v.richting === 'termijn';
      if ((termijnRichting ? v.h : v.t) <= 0) return { fout: 'Vul een bedrag groter dan nul in.' };
      const h = termijnRichting ? v.h : annHoofdsom(v.t, i, n), t = termijnRichting ? annTermijn(v.h, i, n) : v.t;
      const rijen = [
        ['Maandrente', fmt.pct(i * 100, 4)],
        ['Rente eerste maand', fmt.euro(h * i)],
        ['Aflossing eerste maand', fmt.euro(t - h * i)],
        ['Totaal te betalen', fmt.euro(t * n)],
        ['Totale rentekosten', fmt.euro(t * n - h), 'som']
      ];
      if (!termijnRichting) [36, 84].filter(x => x !== n).forEach(x => rijen.push(['Leenbedrag bij ' + x + ' maanden', fmt.euro0(annHoofdsom(t, i, x))]));
      const jaren = [];
      for (let j = 1; j * 12 <= n + 11; j++) {
        const k = Math.min(j * 12, n), van = (j - 1) * 12;
        const restVan = annRest(h, i, n, van), restTot = annRest(h, i, n, k), aantal = k - van;
        jaren.push([String(j), fmt.euro(t * aantal - (restVan - restTot)), fmt.euro(restVan - restTot), fmt.euro0(Math.max(0, restTot))]);
      }
      return {
        lbl: termijnRichting ? 'Maandbedrag' : 'Leenbedrag bij dit maandbedrag', groot: termijnRichting ? fmt.euro(t) : fmt.euro0(Math.floor(h)),
        onder: termijnRichting ? n + ' maanden bij ' + fmt.pct(v.r, 1) + ' per jaar' : 'rekenkundig, zonder toets aan inkomen en lasten',
        rijen,
        tabel: { titel: 'Verloop per jaar', kop: ['Jaar', 'Rente', 'Aflossing', 'Schuld eind jaar'], rijen: jaren }
      };
    },
    uitleg: 'Maandrente i = (1 + kostenpercentage)<sup>1/12</sup> − 1 (of jaarrente / 12). Maandbedrag = L × i / (1 − (1 + i)<sup>−n</sup>). Omgekeerd: leenbedrag L = maandbedrag × (1 − (1 + i)<sup>−n</sup>) / i.',
    letop: 'Indicatief; geen kredietaanbod. Of een lening verantwoord is, hangt af van inkomen, vaste lasten en de toetsing door de kredietverstrekker (en de BKR-registratie). Het wettelijke maximum voor de kredietvergoeding kan wijzigen; controleer het actuele maximum.'
  });

  RT.add({
    id: 'kosten-krediet', groep: 'lenen-rente', naam: 'Totale kosten van een krediet',
    intro: 'Wat kost lenen in totaal? Voor een persoonlijke lening met vaste looptijd of een doorlopend krediet met een maandtermijn als percentage van de limiet.',
    kw: 'kosten lenen krediet rentekosten doorlopend krediet persoonlijke lening jkp',
    velden: [
      { k: 'soort', l: 'Soort krediet', s: 'keuze', opties: [['pl', 'Persoonlijke lening (vaste looptijd)'], ['dk', 'Doorlopend krediet (termijn als % van de limiet)']], std: 'pl', breed: true },
      { k: 'h', l: 'Leenbedrag of opgenomen limiet', s: 'eur', std: 10000 },
      { k: 'r', l: 'Jaarlijks kostenpercentage', s: 'pct', std: 9.9 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'maanden', std: 60, als: v => v.soort === 'pl' },
      { k: 'p', l: 'Maandtermijn als % van de limiet', s: 'pct', std: 2, als: v => v.soort === 'dk' }
    ],
    bereken(v) {
      const i = maandUitJaar(v.r);
      if (v.h <= 0) return { fout: 'Vul een bedrag groter dan nul in.' };
      if (v.soort === 'pl') {
        const n = Math.round(v.n);
        if (n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
        const t = annTermijn(v.h, i, n), kosten = t * n - v.h;
        return {
          lbl: 'Totale rentekosten', groot: fmt.euro(kosten), onder: 'over ' + fmt.duur(n),
          rijen: [['Maandtermijn', fmt.euro(t)], ['Totaal terug te betalen', fmt.euro(t * n)], ['Kosten per € 1.000 geleend', fmt.euro(kosten / v.h * 1000), 'som']]
        };
      }
      const t = v.h * v.p / 100;
      if (t <= v.h * i) return { fout: 'Deze maandtermijn (' + fmt.euro(t) + ') dekt de rente van de eerste maand (' + fmt.euro(v.h * i) + ') niet; het krediet wordt zo nooit afgelost.' };
      const s = afbouwen(v.h, i, t);
      return {
        lbl: 'Totale rentekosten', groot: fmt.euro(s.rente), onder: 'bij een vaste maandtermijn tot de schuld nul is',
        rijen: [['Maandtermijn', fmt.euro(t)], ['Aflosduur', fmt.duur(s.m)], ['Totaal terugbetaald', fmt.euro(s.betaald)], ['Kosten per € 1.000 geleend', fmt.euro(s.rente / v.h * 1000), 'som']]
      };
    },
    uitleg: 'Maandrente i = (1 + kostenpercentage)<sup>1/12</sup> − 1. Persoonlijke lening: annuïtaire maandtermijn over de looptijd; kosten = termijnen samen − leenbedrag. Doorlopend krediet: termijn = limiet × percentage, maand voor maand doorgerekend tot de schuld nul is (zonder nieuwe opnamen).',
    letop: 'Bij een doorlopend krediet kan de rente tussentijds wijzigen en daalt de termijn soms mee met de schuld; dan duurt aflossen langer en wordt het duurder. Doorlopend krediet wordt nog maar weinig aangeboden. Indicatief; geen kredietaanbod.'
  });

  RT.add({
    id: 'kopen-op-afbetaling', groep: 'lenen-rente', naam: 'Contant betalen of op afbetaling',
    intro: 'Een aankoop op afbetaling lijkt goedkoop per maand. Wat kost het extra, en welke jaarrente zit er in de termijnen?',
    kw: 'afbetaling kopen op afbetaling achteraf betalen termijnen effectieve rente',
    velden: [
      { k: 'p', l: 'Prijs bij contant betalen', s: 'eur', std: 1200 },
      { k: 'aa', l: 'Aanbetaling', s: 'eur', std: 0, opt: true },
      { k: 't', l: 'Termijn per maand', s: 'eur', std: 55 },
      { k: 'n', l: 'Aantal maandtermijnen', s: 'num', std: 24 }
    ],
    bereken(v) {
      const n = Math.round(v.n), krediet = v.p - v.aa, tot = v.aa + v.t * n;
      if (v.p <= 0 || n <= 0 || v.t <= 0) return { fout: 'Vul een prijs, termijn en aantal termijnen groter dan nul in.' };
      if (krediet <= 0) return { fout: 'De aanbetaling is gelijk aan of hoger dan de prijs; er wordt niets op afbetaling gekocht.' };
      const rijen = [['Gefinancierd deel', fmt.euro(krediet)], ['Totaal betaald', fmt.euro(tot)], ['Opslag ten opzichte van contant', fmt.pct((tot / v.p - 1) * 100, 1)]];
      if (v.t * n <= krediet) return { lbl: 'Extra kosten', groot: fmt.euro(tot - v.p), onder: 'geen rente: de termijnen zijn niet hoger dan het gefinancierde deel', rijen };
      const i = zoekNul(x => krediet - annHoofdsom(v.t, x, n), 0, 1);
      rijen.push(['Effectieve jaarrente in de termijnen', fmt.pct((Math.pow(1 + i, 12) - 1) * 100, 2), 'som']);
      return { lbl: 'Extra kosten', groot: fmt.euro(tot - v.p), onder: 'ten opzichte van contant betalen', rijen };
    },
    uitleg: 'Extra kosten = aanbetaling + termijnen − contante prijs. De maandrente i is de rente waarbij de contante waarde van de termijnen gelijk is aan het gefinancierde deel (prijs − aanbetaling); effectief per jaar = (1 + i)<sup>12</sup> − 1.',
    letop: 'Eenmalige kosten, verzekeringen of een slotbetaling moeten bij de termijnen worden opgeteld. Ook kopen op afbetaling of “achteraf betalen” kan tot een BKR-registratie leiden en meetellen bij een hypotheekaanvraag.'
  });

  RT.add({
    id: 'schuld-met-rente-op-rente', groep: 'lenen-rente', naam: 'Groei van een openstaande schuld',
    intro: 'Hoe hard loopt een schuld op als er niets wordt betaald en de rente en vaste kosten worden bijgeschreven?',
    kw: 'schuld groei rente op rente achterstand toename schuld incasso',
    velden: [
      { k: 'h', l: 'Huidige schuld', s: 'eur', std: 5000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: 12 },
      { k: 'k', l: 'Vaste kosten per maand', s: 'eur', std: 0, opt: true, tip: 'Worden bij de schuld opgeteld en dragen daarna ook rente.' },
      { k: 'n', l: 'Aantal maanden zonder betaling', s: 'num', std: 24 }
    ],
    bereken(v) {
      const i = maandUitJaar(v.r), n = Math.round(v.n);
      if (v.h < 0 || n <= 0) return { fout: 'Vul een schuld en een aantal maanden groter dan nul in.' };
      let s = v.h; const jaren = [];
      for (let m = 1; m <= n; m++) { s = s * (1 + i) + v.k; if (m % 12 === 0 || m === n) jaren.push([fmt.duur(m), fmt.euro0(s), fmt.euro0(s - v.h)]); }
      return {
        lbl: 'Schuld na ' + fmt.duur(n), groot: fmt.euro(s), onder: v.h > 0 ? 'een stijging van ' + fmt.pct((s / v.h - 1) * 100, 1) : '',
        rijen: [['Toename', fmt.euro(s - v.h)], ['Waarvan opgetelde kosten', fmt.euro(v.k * n)], ['Waarvan rente', fmt.euro(s - v.h - v.k * n), 'som'], ['Maandrente', fmt.pct(i * 100, 3)]],
        tabel: { titel: 'Stand van de schuld', kop: ['Na', 'Schuld', 'Toename'], rijen: jaren }
      };
    },
    uitleg: 'Per maand: schuld = schuld × (1 + i) + vaste kosten, met i = (1 + jaarrente)<sup>1/12</sup> − 1. Bij geen kosten is dat schuld × (1 + i)<sup>n</sup>.',
    letop: 'Wettelijke rente, incassokosten en beslagkosten volgen eigen regels en kunnen anders worden berekend. Bij betalingsproblemen is vroeg contact met de schuldeiser of schuldhulpverlening meestal goedkoper dan laten oplopen.'
  });

  RT.add({
    id: 'maximaal-krediet', groep: 'lenen-rente', naam: 'Maximaal consumptief krediet',
    intro: 'Een indicatie van het maximale kredietbedrag: wat blijft er van het netto inkomen over na basisbedrag en woonlasten, en welk krediet past bij die ruimte?',
    kw: 'maximaal lenen maximale lening krediet leennorm nibud basisbedrag bestedingsruimte',
    peildatum: NL.peildatum, fiscaal: ['Basisbedrag levensonderhoud (eigen invoer)', 'Deel van de ruimte als termijn'],
    velden: [
      { k: 'ink', l: 'Netto inkomen per maand (huishouden)', s: 'eur', std: 3200 },
      { k: 'woon', l: 'Woonlasten per maand (netto)', s: 'eur', std: 1150 },
      { k: 'basis', l: 'Basisbedrag levensonderhoud per maand', s: 'eur', std: NL.nibudBasis, tip: 'Afhankelijk van de samenstelling van het huishouden; vul het bedrag uit de geldende normtabel in.' },
      { k: 'reeds', l: 'Lasten van bestaande kredieten per maand', s: 'eur', std: 0, opt: true },
      { k: 'pt', l: 'Deel van de ruimte als maandtermijn', s: 'pct', std: NL.termijnAandeel },
      { k: 'r', l: 'Jaarlijks kostenpercentage', s: 'pct', std: 7.9 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'maanden', std: 60 }
    ],
    bereken(v) {
      const n = Math.round(v.n), i = maandUitJaar(v.r);
      if (n <= 0) return { fout: 'Vul een looptijd groter dan nul in.' };
      const ruimte = Math.max(0, v.ink - v.basis - v.woon - v.reeds), t = ruimte * v.pt / 100, max = annHoofdsom(t, i, n);
      return {
        lbl: 'Indicatie maximaal krediet', groot: fmt.euro0(Math.floor(max)), onder: 'bij ' + n + ' maanden en een termijn van ' + fmt.euro(t),
        rijen: [
          ['Netto inkomen', fmt.euro(v.ink)], ['Min basisbedrag', fmt.euro(-v.basis)], ['Min woonlasten', fmt.euro(-v.woon)], ['Min bestaande kredietlasten', fmt.euro(-v.reeds)],
          ['Bestedingsruimte per maand', fmt.euro(ruimte), 'som'],
          ['Maximale maandtermijn', fmt.euro(t)],
          ['Rentekosten over de looptijd', fmt.euro(t * n - max)],
          ['Bij 36 maanden', fmt.euro0(annHoofdsom(t, i, 36))]
        ],
        signalen: ruimte <= 0 ? ['Er is geen bestedingsruimte: een nieuw krediet is volgens deze berekening niet verantwoord.'] : []
      };
    },
    uitleg: 'Ruimte = netto inkomen − basisbedrag − woonlasten − bestaande kredietlasten. Maximale termijn = ruimte × gekozen percentage. Kredietbedrag = termijn × (1 − (1 + i)<sup>−n</sup>) / i, met i = (1 + kostenpercentage)<sup>1/12</sup> − 1.',
    letop: 'Indicatief en geen kredietaanbod. Kredietverstrekkers toetsen volgens hun gedragscode met eigen normtabellen per huishouden, BKR-toetsing en soms een vaste maandlast per euro limiet. Het basisbedrag (standaard ' + fmt.euro0(NL.nibudBasis) + ', peildatum ' + NL.peildatum + ') is een waarde uit de bron en niet geverifieerd: controleer de actuele norm. Een krediet verlaagt later de maximale hypotheek.'
  });

  const dkReken = (h, r, p) => {
    const i = maandUitJaar(r), t = h * p / 100;
    if (t <= h * i) return { t, nooit: true };
    const s = afbouwen(h, i, t);
    return { t, m: s.m, kosten: s.rente, betaald: s.betaald };
  };
  RT.add({
    id: 'doorlopend-krediet', groep: 'lenen-rente', naam: 'Doorlopend krediet doorrekenen',
    intro: 'Bij een doorlopend krediet is de maandtermijn een percentage van de limiet. Hoe lang duurt aflossen en wat kost het? Vergelijk twee aanbieders.',
    kw: 'doorlopend krediet limiet maandtermijn vergelijken aflosduur rentekosten',
    velden: [
      { k: 'h', l: 'Opgenomen bedrag', s: 'eur', std: 15000 },
      { k: 'rA', l: 'Kostenpercentage aanbieder A', s: 'pct', std: 8.9 },
      { k: 'pA', l: 'Maandtermijn A (% van de limiet)', s: 'pct', std: 2 },
      { k: 'rB', l: 'Kostenpercentage aanbieder B', s: 'pct', std: 10.9 },
      { k: 'pB', l: 'Maandtermijn B (% van de limiet)', s: 'pct', std: 1.5 }
    ],
    bereken(v) {
      if (v.h <= 0) return { fout: 'Vul een bedrag groter dan nul in.' };
      const A = dkReken(v.h, v.rA, v.pA), B = dkReken(v.h, v.rB, v.pB);
      const kol = x => x.nooit ? ['nooit afgelost', '–', '–'] : [fmt.duur(x.m), fmt.euro0(x.kosten), fmt.euro0(x.betaald)];
      const tabel = { titel: 'Vergelijking', kop: ['', 'A', 'B'], rijen: [['Maandtermijn', fmt.euro(A.t), fmt.euro(B.t)]].concat(['Aflosduur', 'Rentekosten', 'Totaal betaald'].map((l, j) => [l, kol(A)[j], kol(B)[j]])) };
      if (A.nooit && B.nooit) return { lbl: 'Goedkoopste aanbieder', groot: 'geen van beide', onder: 'bij geen van beide termijnen wordt de schuld afgelost', rijen: [], tabel };
      const winnaar = A.nooit ? 'B' : B.nooit ? 'A' : (A.kosten <= B.kosten ? 'A' : 'B');
      const rijen = A.nooit || B.nooit ? [] : [['Verschil in rentekosten', fmt.euro(Math.abs(A.kosten - B.kosten)), 'som'], ['Verschil in aflosduur', fmt.duur(Math.abs(A.m - B.m))]];
      return { lbl: 'Goedkoopste aanbieder', groot: 'Aanbieder ' + winnaar, onder: 'op totale rentekosten, zonder nieuwe opnamen', rijen, tabel };
    },
    uitleg: 'Per aanbieder: maandrente i = (1 + kostenpercentage)<sup>1/12</sup> − 1 en vaste termijn = opgenomen bedrag × termijnpercentage. Maand voor maand gaat de rente eraf en de rest naar aflossing, tot de schuld nul is.',
    letop: 'Een lager termijnpercentage voelt goedkoper, maar verlengt de aflosduur en verhoogt de kosten vaak sterk. Rente en termijn kunnen bij een doorlopend krediet tussentijds wijzigen. Doorlopend krediet wordt nog maar weinig aangeboden. Indicatief; geen kredietaanbod.'
  });

  RT.add({
    id: 'leningen-vergelijken', groep: 'lenen-rente', naam: 'Persoonlijke leningen vergelijken',
    intro: 'Twee aanbiedingen naast elkaar: maandtermijn en totale kosten bij het kostenpercentage en de looptijd van elk.',
    kw: 'persoonlijke lening vergelijken aanbieders jkp totale kosten looptijd',
    velden: [
      { k: 'h', l: 'Leenbedrag', s: 'eur', std: 20000 },
      { k: 'rA', l: 'Kostenpercentage A', s: 'pct', std: 6.9 },
      { k: 'nA', l: 'Looptijd A', s: 'num', na: 'maanden', std: 60 },
      { k: 'rB', l: 'Kostenpercentage B', s: 'pct', std: 5.9 },
      { k: 'nB', l: 'Looptijd B', s: 'num', na: 'maanden', std: 72 },
      { k: 'k', l: 'Eenmalige kosten (bij beide)', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const nA = Math.round(v.nA), nB = Math.round(v.nB);
      if (v.h <= 0 || nA <= 0 || nB <= 0) return { fout: 'Vul een leenbedrag en looptijden groter dan nul in.' };
      const tA = annTermijn(v.h, maandUitJaar(v.rA), nA), tB = annTermijn(v.h, maandUitJaar(v.rB), nB);
      const kA = tA * nA + v.k - v.h, kB = tB * nB + v.k - v.h;
      const winnaar = kA <= kB ? 'A' : 'B';
      const sig = [];
      if (nA !== nB && (tA < tB) !== (kA < kB)) sig.push('De lening met de laagste maandtermijn is niet de goedkoopste: een langere looptijd kost meer rente.');
      return {
        lbl: 'Goedkoopste aanbieding', groot: 'Aanbieder ' + winnaar, onder: 'bespaart ' + fmt.euro0(Math.abs(kA - kB)) + ' aan totale kosten',
        rijen: [['Verschil in maandtermijn (A − B)', fmt.euro(tA - tB)], ['Verschil in totale kosten (A − B)', fmt.euro(kA - kB), 'som']],
        tabel: { titel: 'Vergelijking', kop: ['', 'A', 'B'], rijen: [
          ['Maandtermijn', fmt.euro(tA), fmt.euro(tB)], ['Looptijd', fmt.duur(nA), fmt.duur(nB)],
          ['Totaal betaald', fmt.euro0(tA * nA + v.k), fmt.euro0(tB * nB + v.k)], ['Totale kosten', fmt.euro0(kA), fmt.euro0(kB)]] },
        signalen: sig
      };
    },
    uitleg: 'Per aanbieding: maandrente i = (1 + kostenpercentage)<sup>1/12</sup> − 1, termijn = L × i / (1 − (1 + i)<sup>−n</sup>). Totale kosten = termijn × n + eenmalige kosten − leenbedrag.',
    letop: 'Vergelijk bij voorkeur bij gelijke looptijd. Boetevrij extra aflossen, rentevast of variabel en de voorwaarden bij overlijden kunnen zwaarder wegen dan een klein renteverschil. Indicatief; geen kredietaanbod.'
  });

  RT.add({
    id: 'restschuld-lease', groep: 'lenen-rente', naam: 'Restschuld financial lease',
    intro: 'Hoeveel staat er na een aantal maanden nog open op een financial-leasecontract met slottermijn, en hoeveel daarvan is de slottermijn?',
    kw: 'financial lease restschuld slottermijn private lease auto afkopen',
    velden: [
      { k: 'p', l: 'Aanschafprijs', s: 'eur', std: 35000 },
      { k: 'aa', l: 'Aanbetaling of inruil', s: 'eur', std: 5000, opt: true },
      { k: 's', l: 'Slottermijn', s: 'eur', std: 8000, opt: true },
      { k: 'r', l: 'Rente per jaar (contract)', s: 'pct', std: 6.5 },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'maanden', std: 60 },
      { k: 'k', l: 'Verstreken maanden', s: 'num', std: 24 }
    ],
    bereken(v) {
      const i = v.r / 1200, n = Math.round(v.n), k = Math.round(v.k), H = v.p - v.aa;
      if (H <= 0 || n <= 0) return { fout: 'Vul een aanschafprijs boven de aanbetaling en een looptijd groter dan nul in.' };
      if (v.s >= H) return { fout: 'De slottermijn moet lager zijn dan het gefinancierde bedrag.' };
      if (k < 0 || k > n) return { fout: 'Het aantal verstreken maanden ligt tussen 0 en ' + n + '.' };
      const t = annTermijn(H - v.s / Math.pow(1 + i, n), i, n);
      const cwSlot = v.s / Math.pow(1 + i, n - k), rest = annHoofdsom(t, i, n - k) + cwSlot;
      return {
        lbl: 'Restschuld na ' + k + ' maanden', groot: fmt.euro(rest), onder: 'nog ' + (n - k) + ' termijnen en de slottermijn',
        rijen: [
          ['Maandtermijn', fmt.euro(t)], ['Gefinancierd', fmt.euro(H)],
          ['Waarvan contante waarde slottermijn', fmt.euro(cwSlot)],
          ['Afgelost tot nu', fmt.euro(H - rest)], ['Betaald tot nu', fmt.euro(t * k)], ['Waarvan rente', fmt.euro(t * k - (H - rest)), 'som']
        ]
      };
    },
    uitleg: 'Termijn = (gefinancierd − slottermijn / (1 + i)<sup>n</sup>) × i / (1 − (1 + i)<sup>−n</sup>), met i = jaarrente / 12. Restschuld na k maanden = contante waarde van de resterende n − k termijnen + slottermijn / (1 + i)<sup>n−k</sup>.',
    letop: 'De afkoopsom bij vervroegd beëindigen volgt uit het contract en kan kosten of een vergoeding bevatten. Voor de maandtermijn bij een gewenste slottermijn: zie <a href="#slottermijn">Lening met slottermijn</a>. Financial lease telt mee bij de toetsing van een hypotheek.'
  });

  RT.add({
    id: 'rente-lease', groep: 'lenen-rente', naam: 'Welke rente zit in een leasecontract',
    intro: 'Aanschafprijs, aanbetaling, maandtermijn en slottermijn zijn bekend. Welke jaarrente zit er in het contract?',
    kw: 'financial lease rente terugrekenen leasecontract slottermijn jkp',
    velden: [
      { k: 'p', l: 'Aanschafprijs', s: 'eur', std: 35000 },
      { k: 'aa', l: 'Aanbetaling of inruil', s: 'eur', std: 5000, opt: true },
      { k: 't', l: 'Maandtermijn', s: 'eur', std: 474 },
      { k: 's', l: 'Slottermijn', s: 'eur', std: 8000, opt: true },
      { k: 'n', l: 'Looptijd', s: 'num', na: 'maanden', std: 60 }
    ],
    bereken(v) {
      const H = v.p - v.aa, n = Math.round(v.n), tot = v.t * n + v.s;
      if (H <= 0 || n <= 0 || v.t <= 0) return { fout: 'Vul een aanschafprijs boven de aanbetaling, een termijn en een looptijd groter dan nul in.' };
      if (tot <= H) return { fout: 'Termijnen en slottermijn zijn samen niet hoger dan het gefinancierde bedrag; er zit geen positieve rente in.' };
      const waarde = x => annHoofdsom(v.t, x, n) + v.s / Math.pow(1 + x, n);
      if (waarde(0.5) > H) return { fout: 'De termijnen zijn onrealistisch hoog ten opzichte van het gefinancierde bedrag.' };
      const i = zoekNul(x => H - waarde(x), 0, 0.5);
      return {
        lbl: 'Effectieve jaarrente', groot: fmt.pct((Math.pow(1 + i, 12) - 1) * 100, 2), onder: 'zonder bijkomende kosten',
        rijen: [
          ['Gefinancierd', fmt.euro(H)], ['Rente per maand', fmt.pct(i * 100, 4)], ['Nominale jaarrente (× 12)', fmt.pct(i * 1200, 2)],
          ['Totaal betaald (incl. aanbetaling)', fmt.euro(v.aa + tot)], ['Rentekosten', fmt.euro(tot - H), 'som']
        ]
      };
    },
    uitleg: 'De maandrente i wordt numeriek gezocht zodat de contante waarde van de termijnen plus de slottermijn gelijk is aan het gefinancierde bedrag (aanschafprijs − aanbetaling). Effectief per jaar = (1 + i)<sup>12</sup> − 1.',
    letop: 'Het wettelijke jaarlijkse kostenpercentage in het contract neemt ook verplichte kosten mee en kan hoger zijn. Toets een aanbod aan het actuele wettelijke maximum voor de kredietvergoeding.'
  });

  RT.add({
    id: 'extra-aflossen-lening', groep: 'lenen-rente', naam: 'Extra aflossen op een lening',
    intro: 'Wat levert extra aflossen op bij een gelijkblijvende maandtermijn: hoeveel eerder is de lening afgelost en hoeveel rente scheelt het?',
    kw: 'extra aflossen lening restschuld looptijd korter rentebesparing',
    velden: [
      { k: 'h', l: 'Openstaande schuld', s: 'eur', std: 18000 },
      { k: 'r', l: 'Jaarlijks kostenpercentage', s: 'pct', std: 7.9 },
      { k: 't', l: 'Maandtermijn', s: 'eur', std: 380 },
      { k: 'e', l: 'Extra aflossing per jaar', s: 'eur', std: 1000, opt: true, tip: 'Steeds na elke twaalfde maandtermijn.' },
      { k: 'j', l: 'Aantal jaren extra aflossen', s: 'num', std: 3 }
    ],
    bereken(v) {
      const i = maandUitJaar(v.r), jr = Math.round(v.j);
      if (v.h <= 0 || v.t <= 0) return { fout: 'Vul een schuld en een maandtermijn groter dan nul in.' };
      if (v.t <= v.h * i) return { fout: 'De maandtermijn dekt de rente niet (rente eerste maand ' + fmt.euro(v.h * i) + ').' };
      const zonder = afbouwen(v.h, i, v.t), met = afbouwen(v.h, i, v.t, m => m % 12 === 0 && m / 12 <= jr ? v.e : 0);
      return {
        lbl: 'Rentebesparing', groot: fmt.euro(zonder.rente - met.rente), onder: 'lening ' + fmt.duur(zonder.m - met.m) + ' eerder afgelost',
        rijen: [
          ['Aflosduur zonder extra aflossen', fmt.duur(zonder.m)], ['Aflosduur met extra aflossen', fmt.duur(met.m)],
          ['Totaal extra afgelost', fmt.euro(met.extraTot)],
          ['Rente zonder extra aflossen', fmt.euro(zonder.rente)], ['Rente met extra aflossen', fmt.euro(met.rente)],
          ['Totaal betaald met extra aflossen', fmt.euro(met.betaald), 'som']
        ]
      };
    },
    uitleg: 'Maand voor maand: rente = schuld × i, met i = (1 + kostenpercentage)<sup>1/12</sup> − 1; de rest van de termijn lost af. Na elke twaalfde termijn gaat de extra aflossing eraf, zolang het aantal gekozen jaren loopt. Beide scenario’s lopen door tot de schuld nul is.',
    letop: 'Sommige kredietverstrekkers verlagen na extra aflossen de termijn in plaats van de looptijd; dan is de rentebesparing kleiner. Bij een persoonlijke lening kan een vergoeding voor vervroegd aflossen gelden. Houd een buffer aan voordat spaargeld naar aflossing gaat.'
  });

  RT.add({
    id: 'studieschuld', groep: 'lenen-rente', naam: 'Studieschuld terugbetalen',
    intro: 'Het maandbedrag voor een studieschuld over de terugbetaaltermijn, en wat de klant bij een laag inkomen volgens de draagkrachtregeling betaalt.',
    kw: 'studieschuld duo studiefinanciering terugbetalen draagkracht sf35 aflossen',
    peildatum: NL.peildatum, fiscaal: ['Rente studieschuld', 'Terugbetaaltermijn', 'Draagkrachtvrije voet', 'Draagkrachtpercentage'],
    velden: [
      { k: 'h', l: 'Studieschuld bij de start van terugbetalen', s: 'eur', std: 28000 },
      { k: 'r', l: 'Rente per jaar', s: 'pct', std: NL.duoRente },
      { k: 'jr', l: 'Terugbetaaltermijn', s: 'num', na: 'jaar', std: NL.duoTermijnJaar },
      { k: 'ink', l: 'Toetsingsinkomen per jaar', s: 'eur', std: 38000 },
      { k: 'voet', l: 'Draagkrachtvrije voet per jaar', s: 'eur', std: NL.duoVrijeVoet },
      { k: 'dp', l: 'Draagkrachtpercentage', s: 'pct', std: NL.duoDraagkrachtPct }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), i = v.r / 1200;
      if (v.h <= 0 || n <= 0) return { fout: 'Vul een schuld en een terugbetaaltermijn groter dan nul in.' };
      const t = annTermijn(v.h, i, n), draag = Math.max(0, (v.ink - v.voet) * v.dp / 100 / 12), betaal = Math.min(t, draag);
      return {
        lbl: 'Te betalen per maand', groot: fmt.euro(betaal), onder: betaal < t ? 'verlaagd naar draagkracht' : 'het wettelijke maandbedrag',
        rijen: [
          ['Wettelijk maandbedrag (annuïtair)', fmt.euro(t)], ['Draagkrachtbedrag per maand', fmt.euro(draag)],
          ['Totaal bij het wettelijke maandbedrag', fmt.euro(t * n)], ['Waarvan rente', fmt.euro(t * n - v.h), 'som']
        ],
        signalen: betaal < t ? ['Bij betalen naar draagkracht wordt een restant na afloop van de terugbetaaltermijn in de regel kwijtgescholden. Het inkomen wordt periodiek opnieuw getoetst.'] : []
      };
    },
    uitleg: 'Maandbedrag = schuld × i / (1 − (1 + i)<sup>−n</sup>), met i = rente / 12 en n = termijn in maanden. Draagkracht per maand = (toetsingsinkomen − vrije voet) × draagkrachtpercentage / 12. De klant betaalt het laagste van beide.',
    letop: 'Indicatief. Rente, terugbetaaltermijn, draagkrachtvrije voet en percentage verschillen per stelsel en wijzigen; de standaardwaarden (peildatum ' + NL.peildatum + ') komen uit de bron en zijn niet geverifieerd: controleer de actuele normen bij DUO. Bij een hypotheekaanvraag weegt de studieschuld mee volgens de leennormen, op basis van de oorspronkelijke schuld en de rente.'
  });
})(window.RT);
