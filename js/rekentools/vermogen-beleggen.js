/* Rekenhulpen – groep "vermogen-beleggen" (Sparen, beleggen en vermogen).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { annTermijn, annHoofdsom, eindwaarde, maandUitJaar, verloop, normCdf } = RT.fin;
  const { MOMENT } = RT.keuzes;

  RT.add({
    id: 'opbouw', groep: 'vermogen-beleggen', naam: 'Vermogensopbouw met maandinleg',
    intro: 'Wat groeit een startbedrag met een vaste maandelijkse inleg uit tot bij een verwacht rendement?',
    velden: [
      { k: 'st', l: 'Startbedrag', s: 'eur', std: 10000, opt: true },
      { k: 'in', l: 'Inleg per maand', s: 'eur', std: 250 },
      { k: 'r', l: 'Verwacht rendement per jaar', s: 'pct', std: 4 },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 20 },
      { k: 'mom', l: 'Moment van inleggen', s: 'keuze', opties: MOMENT, std: 'begin' }
    ],
    bereken(v) {
      const jaren = Math.round(v.jr), i = maandUitJaar(v.r), vooraf = v.mom === 'begin';
      if (jaren <= 0 || jaren > 100) return { fout: 'Kies een looptijd tussen 1 en 100 jaar.' };
      const eind = eindwaarde(v.st, v.in, i, jaren * 12, vooraf), ingelegd = v.st + v.in * jaren * 12;
      const rijen = [];
      for (let j = 1; j <= jaren; j++) {
        const w = eindwaarde(v.st, v.in, i, j * 12, vooraf), inl = v.st + v.in * j * 12;
        rijen.push([String(j), fmt.euro0(inl), fmt.euro0(w - inl), fmt.euro0(w)]);
      }
      return {
        lbl: 'Vermogen na ' + jaren + ' jaar', groot: fmt.euro0(eind), onder: 'vóór belasting en kosten',
        rijen: [
          ['Totaal ingelegd', fmt.euro0(ingelegd)],
          ['Opbrengst uit rendement', fmt.euro0(eind - ingelegd), 'som'],
          ['Gebruikt rendement per maand', fmt.pct(i * 100, 4)]
        ],
        tabel: { kop: ['Jaar', 'Ingelegd', 'Rendement', 'Vermogen'], rijen }
      };
    },
    uitleg: 'Maandrendement i = (1 + jaarrendement)<sup>1/12</sup> − 1. Vermogen = start × (1 + i)<sup>n</sup> + inleg × ((1 + i)<sup>n</sup> − 1) / i, bij inleg aan het begin van de maand nog × (1 + i).',
    letop: 'Rendement op beleggingen is niet gegarandeerd. Vermogensrendementsheffing (box 3) en kosten zijn niet meegenomen. Bij beleggingsadvies gelden de eisen uit de Wft voor productinformatie en risicoprofiel.'
  });

  RT.add({
    id: 'doelinleg', groep: 'vermogen-beleggen', naam: 'Maandinleg voor een doelbedrag',
    intro: 'Hoeveel moet er per maand opzij om op een bepaald moment een gewenst bedrag te hebben?',
    velden: [
      { k: 'doel', l: 'Doelbedrag', s: 'eur', std: 60000 },
      { k: 'st', l: 'Al beschikbaar', s: 'eur', std: 5000, opt: true },
      { k: 'r', l: 'Verwacht rendement per jaar', s: 'pct', std: 3 },
      { k: 'jr', l: 'Periode', s: 'num', na: 'jaar', std: 12 },
      { k: 'mom', l: 'Moment van inleggen', s: 'keuze', opties: MOMENT, std: 'begin' }
    ],
    bereken(v) {
      const n = Math.round(v.jr * 12), i = maandUitJaar(v.r), vooraf = v.mom === 'begin';
      if (n <= 0) return { fout: 'Vul een periode groter dan nul in.' };
      const g = Math.pow(1 + i, n), groeiStart = v.st * g;
      const factor = i === 0 ? n : (g - 1) / i * (vooraf ? 1 + i : 1);
      const inleg = Math.max(0, (v.doel - groeiStart) / factor);
      return {
        lbl: 'Benodigde inleg per maand', groot: fmt.euro(inleg),
        onder: inleg === 0 ? 'het beschikbare bedrag groeit vanzelf naar het doel' : 'gedurende ' + fmt.duur(n),
        rijen: [
          ['Beschikbaar bedrag groeit naar', fmt.euro0(groeiStart)],
          ['Totaal nog in te leggen', fmt.euro0(inleg * n)],
          ['Bijdrage van rendement', fmt.euro0(Math.max(0, v.doel - v.st - inleg * n)), 'som']
        ]
      };
    },
    uitleg: 'Inleg = (doel − start × (1 + i)<sup>n</sup>) / (((1 + i)<sup>n</sup> − 1) / i), met i het maandrendement afgeleid van het jaarrendement. Bij inleg aan het begin van de maand wordt de noemer × (1 + i).',
    letop: 'Houd bij een langere periode rekening met inflatie: zie de rekenhulp Koopkracht.'
  });

  RT.add({
    id: 'doeltijd', groep: 'vermogen-beleggen', naam: 'Spaartijd tot een doelbedrag',
    intro: 'Met een vaste maandinleg: wanneer is het doelbedrag bereikt?',
    velden: [
      { k: 'st', l: 'Startbedrag', s: 'eur', std: 4000, opt: true },
      { k: 'in', l: 'Inleg per maand', s: 'eur', std: 350 },
      { k: 'r', l: 'Verwacht rendement per jaar', s: 'pct', std: 2.5 },
      { k: 'doel', l: 'Doelbedrag', s: 'eur', std: 40000 }
    ],
    bereken(v) {
      const i = maandUitJaar(v.r);
      if (v.st >= v.doel) return { lbl: 'Spaartijd', groot: 'al bereikt', onder: 'het startbedrag is minstens het doelbedrag', rijen: [] };
      let w = v.st, m = 0;
      while (w < v.doel && m < 1200) { w = w * (1 + i) + v.in; m++; }
      if (w < v.doel) return { fout: 'Binnen 100 jaar wordt het doel niet bereikt. Verhoog de inleg of het startbedrag.' };
      const ingelegd = v.st + v.in * m;
      return {
        lbl: 'Spaartijd', groot: fmt.duur(m), onder: m + ' maandelijkse stortingen',
        rijen: [
          ['Vermogen op dat moment', fmt.euro0(w)],
          ['Totaal ingelegd', fmt.euro0(ingelegd)],
          ['Opbrengst uit rendement', fmt.euro0(w - ingelegd), 'som']
        ]
      };
    },
    uitleg: 'Per maand: vermogen × (1 + i) + inleg, met i = (1 + jaarrendement)<sup>1/12</sup> − 1. Doorgerekend tot het doel is bereikt.',
    letop: 'Uitkomst vóór belasting en kosten; bij beleggen kan het werkelijke verloop sterk afwijken.'
  });

  RT.add({
    id: 'jaarrendement', groep: 'vermogen-beleggen', naam: 'Gemiddeld rendement per jaar',
    intro: 'Van een begin- en eindwaarde naar één gemiddeld jaarrendement, zonder tussentijdse stortingen.',
    velden: [
      { k: 'b', l: 'Beginwaarde', s: 'eur', std: 50000 },
      { k: 'e', l: 'Eindwaarde', s: 'eur', std: 71500 },
      { k: 'jr', l: 'Periode', s: 'num', na: 'jaar', std: 7, tip: 'Decimalen mogen, bijvoorbeeld 6,5.' }
    ],
    bereken(v) {
      if (v.b <= 0 || v.jr <= 0) return { fout: 'Vul een beginwaarde en een periode groter dan nul in.' };
      const totaal = v.e / v.b - 1, jaar = Math.pow(v.e / v.b, 1 / v.jr) - 1;
      return {
        lbl: 'Gemiddeld rendement per jaar', groot: fmt.pct(jaar * 100, 2), onder: 'samengesteld (meetkundig gemiddelde)',
        rijen: [
          ['Totaal rendement over de periode', fmt.pct(totaal * 100, 2)],
          ['Waardeverandering', fmt.euro0(v.e - v.b), 'som']
        ]
      };
    },
    uitleg: 'Jaarrendement = (eindwaarde / beginwaarde)<sup>1/jaren</sup> − 1.',
    letop: 'Met tussentijdse stortingen of opnames is deze methode niet zuiver; dan is een geldgewogen rendement nodig.'
  });

  RT.add({
    id: 'interen', groep: 'vermogen-beleggen', naam: 'Interen op vermogen',
    intro: 'Hoeveel kan er maandelijks uit een vermogen, of hoe lang gaat het mee bij een vaste opname?',
    velden: [
      { k: 'kap', l: 'Beschikbaar vermogen', s: 'eur', std: 180000 },
      { k: 'r', l: 'Verwacht rendement per jaar', s: 'pct', std: 2.5 },
      { k: 'vraag', l: 'Wat wil je weten?', s: 'keuze', opties: [['bedrag', 'Maandbedrag bij een gekozen periode'], ['duur', 'Hoe lang een vast maandbedrag meegaat']], std: 'bedrag', breed: true },
      { k: 'jr', l: 'Periode', s: 'num', na: 'jaar', std: 20, als: v => v.vraag === 'bedrag' },
      { k: 'op', l: 'Opname per maand', s: 'eur', std: 1200, als: v => v.vraag === 'duur' },
      { k: 'mom', l: 'Moment van opnemen', s: 'keuze', opties: MOMENT, std: 'begin' }
    ],
    bereken(v) {
      const i = maandUitJaar(v.r), vooraf = v.mom === 'begin';
      if (v.kap <= 0) return { fout: 'Vul een vermogen groter dan nul in.' };
      if (v.vraag === 'bedrag') {
        const n = Math.round(v.jr * 12);
        if (n <= 0) return { fout: 'Vul een periode groter dan nul in.' };
        const op = annTermijn(v.kap, i, n) / (vooraf ? 1 + i : 1);
        return {
          lbl: 'Maandelijkse opname', groot: fmt.euro(op), onder: 'gedurende ' + fmt.duur(n) + ', daarna is het vermogen op',
          rijen: [['Totaal opgenomen', fmt.euro0(op * n)], ['Waarvan rendement', fmt.euro0(op * n - v.kap), 'som']]
        };
      }
      if (v.op <= 0) return { fout: 'Vul een opname groter dan nul in.' };
      let w = v.kap, m = 0, tot = 0;
      while (w > 0.005 && m < 1200) {
        if (vooraf) { const o = Math.min(v.op, w); w -= o; tot += o; w *= 1 + i; }
        else { w *= 1 + i; const o = Math.min(v.op, w); w -= o; tot += o; }
        m++;
      }
      if (m >= 1200) return { lbl: 'Het vermogen gaat mee', groot: 'langer dan 100 jaar', onder: 'het rendement dekt (vrijwel) de opname', rijen: [] };
      return {
        lbl: 'Het vermogen gaat mee', groot: fmt.duur(m), onder: 'laatste opname kan lager zijn',
        rijen: [['Totaal opgenomen', fmt.euro0(tot)], ['Waarvan rendement', fmt.euro0(tot - v.kap), 'som']]
      };
    },
    uitleg: 'Opname = vermogen × i / (1 − (1 + i)<sup>−n</sup>), bij opname aan het begin van de maand gedeeld door (1 + i). Bij een vast bedrag wordt maand voor maand doorgerekend tot het vermogen op is.',
    letop: 'Inflatie, belasting en kosten verlagen de werkelijke opname. Voor een lijfrente-uitkering gelden fiscale eisen aan duur en hoogte; die zijn hier niet getoetst.'
  });

  RT.add({
    id: 'nuwaarde', groep: 'vermogen-beleggen', naam: 'Contante waarde',
    intro: 'Wat is een bedrag in de toekomst, of een reeks uitkeringen, vandaag waard bij een gekozen rekenrente?',
    velden: [
      { k: 'soort', l: 'Soort betaling', s: 'keuze', opties: [['reeks', 'Reeks gelijke uitkeringen'], ['een', 'Eenmalig bedrag in de toekomst']], std: 'reeks', breed: true },
      { k: 'b', l: 'Bedrag (per uitkering)', s: 'eur', std: 1000 },
      { k: 'jr', l: 'Aantal jaren', s: 'num', na: 'jaar', std: 15 },
      { k: 'r', l: 'Rekenrente per jaar', s: 'pct', std: 3 },
      { k: 'f', l: 'Uitkering', s: 'keuze', opties: [['12', 'Per maand'], ['1', 'Per jaar']], std: '12', als: v => v.soort === 'reeks' },
      { k: 'mom', l: 'Moment van uitkeren', s: 'keuze', opties: [['achteraf', 'Achteraf (eind van de periode)'], ['vooraf', 'Vooraf (begin van de periode)']], std: 'achteraf', als: v => v.soort === 'reeks' }
    ],
    bereken(v) {
      if (v.jr <= 0) return { fout: 'Vul een aantal jaren groter dan nul in.' };
      if (v.soort === 'een') {
        const cw = v.b / Math.pow(1 + v.r / 100, v.jr);
        return {
          lbl: 'Waarde vandaag', groot: fmt.euro(cw), onder: 'van ' + fmt.euro0(v.b) + ' over ' + fmt.getal(v.jr, v.jr % 1 ? 1 : 0) + ' jaar',
          rijen: [['Verschil door de tijd', fmt.euro(v.b - cw), 'som']]
        };
      }
      const f = +v.f, n = Math.round(v.jr * f), i = Math.pow(1 + v.r / 100, 1 / f) - 1;
      if (n <= 0) return { fout: 'Te weinig uitkeringen.' };
      const cw = annHoofdsom(v.b, i, n) * (v.mom === 'vooraf' ? 1 + i : 1);
      return {
        lbl: 'Waarde vandaag', groot: fmt.euro(cw), onder: n + ' uitkeringen van ' + fmt.euro(v.b),
        rijen: [['Som van alle uitkeringen', fmt.euro(v.b * n)], ['Verschil door de tijd', fmt.euro(v.b * n - cw), 'som']]
      };
    },
    uitleg: 'Eenmalig: CW = bedrag / (1 + r)<sup>t</sup>. Reeks: CW = bedrag × (1 − (1 + i)<sup>−n</sup>) / i, bij vooraf × (1 + i); i is de rekenrente per periode, afgeleid van de jaarrente.',
    letop: 'De uitkomst is erg gevoelig voor de gekozen rekenrente. Voor fiscale waarderingen (bijvoorbeeld van periodieke uitkeringen of vruchtgebruik) gelden wettelijke factoren; deze rekenhulp gebruikt die niet.'
  });

  RT.add({
    id: 'koopkracht', groep: 'vermogen-beleggen', naam: 'Koopkracht en inflatie',
    intro: 'Wat is een bedrag later nog waard, en hoeveel is dan nodig om hetzelfde te kunnen kopen?',
    velden: [
      { k: 'b', l: 'Bedrag in euro’s van nu', s: 'eur', std: 3000, tip: 'Bijvoorbeeld een gewenst netto maandinkomen na pensioen.' },
      { k: 'inf', l: 'Inflatie per jaar', s: 'pct', std: 2.5 },
      { k: 'jr', l: 'Aantal jaren', s: 'num', na: 'jaar', std: 20 }
    ],
    bereken(v) {
      const f = Math.pow(1 + v.inf / 100, v.jr);
      return {
        lbl: 'Nodig voor dezelfde koopkracht', groot: fmt.euro0(v.b * f), onder: 'over ' + fmt.getal(v.jr, v.jr % 1 ? 1 : 0) + ' jaar',
        rijen: [
          ['Een gelijk bedrag is dan nog waard', fmt.euro0(v.b / f)],
          ['Verlies aan koopkracht', fmt.pct((1 - 1 / f) * 100, 1), 'som']
        ]
      };
    },
    uitleg: 'Benodigd = bedrag × (1 + inflatie)<sup>jaren</sup>. Waarde in euro’s van nu = bedrag / (1 + inflatie)<sup>jaren</sup>.',
    letop: 'Inflatie is een aanname. Pensioen- en AOW-uitkeringen worden geheel of gedeeltelijk geïndexeerd; reken daarmee als je een inkomenstekort bepaalt.'
  });

  RT.add({
    id: 'kosteneffect', groep: 'vermogen-beleggen', naam: 'Effect van kosten op vermogensopbouw',
    intro: 'Hoeveel vermogen kost een jaarlijks kostenpercentage over een lange periode? Handig bij het bespreken van de kosten van een beleggingsproduct.',
    velden: [
      { k: 'st', l: 'Startbedrag', s: 'eur', std: 25000, opt: true },
      { k: 'in', l: 'Inleg per maand', s: 'eur', std: 200, opt: true },
      { k: 'r', l: 'Rendement vóór kosten per jaar', s: 'pct', std: 5 },
      { k: 'k', l: 'Totale kosten per jaar', s: 'pct', std: 1.2, tip: 'Alle doorlopende kosten samen, als percentage van het vermogen.' },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 25 }
    ],
    bereken(v) {
      const jaren = Math.round(v.jr);
      if (jaren <= 0 || jaren > 100) return { fout: 'Kies een looptijd tussen 1 en 100 jaar.' };
      if (v.st <= 0 && v.in <= 0) return { fout: 'Vul een startbedrag of een maandinleg in.' };
      const ib = maandUitJaar(v.r), inet = maandUitJaar(v.r - v.k);
      const rijen = [];
      let eb = 0, en = 0;
      for (let j = 1; j <= jaren; j++) {
        eb = eindwaarde(v.st, v.in, ib, j * 12, true); en = eindwaarde(v.st, v.in, inet, j * 12, true);
        rijen.push([String(j), fmt.euro0(eb), fmt.euro0(en), fmt.euro0(eb - en)]);
      }
      const ingelegd = v.st + v.in * jaren * 12;
      return {
        lbl: 'Vermogensverlies door kosten', groot: fmt.euro0(eb - en), onder: 'na ' + jaren + ' jaar, ' + fmt.pct((eb - en) / eb * 100, 1) + ' van het vermogen zonder kosten',
        rijen: [
          ['Vermogen zonder kosten', fmt.euro0(eb)],
          ['Vermogen na kosten', fmt.euro0(en)],
          ['Totaal ingelegd', fmt.euro0(ingelegd)],
          ['Rendement na kosten per jaar', fmt.pct(v.r - v.k, 2), 'som']
        ],
        tabel: { kop: ['Jaar', 'Zonder kosten', 'Na kosten', 'Verschil'], rijen }
      };
    },
    uitleg: 'Rendement na kosten = rendement − kostenpercentage. Beide reeksen: start × (1 + i)<sup>n</sup> + inleg × ((1 + i)<sup>n</sup> − 1) / i × (1 + i), inleg aan het begin van de maand, i = (1 + jaarrendement)<sup>1/12</sup> − 1. Het verschil omvat ook het gemiste rendement op de betaalde kosten.',
    letop: 'Rendementen zijn niet gegarandeerd; het kosteneffect is dat wel. Gebruik bij advies de kosten uit de wettelijke kosteninformatie van het product (inclusief transactie- en advieskosten). Belasting in box 3 is niet meegenomen.'
  });

  RT.add({
    id: 'scenarios', groep: 'vermogen-beleggen', naam: 'Beleggen: ongunstig, midden en gunstig',
    intro: 'Een beleggingsdoel bespreken zonder één getal te beloven. Welke eindwaarden horen bij een ongunstig, een middelmatig en een gunstig verloop, gegeven rendement, beweeglijkheid en looptijd?',
    velden: [
      { k: 'st', l: 'Startbedrag', s: 'eur', std: 40000, opt: true },
      { k: 'in', l: 'Inleg per maand', s: 'eur', std: 300, opt: true },
      { k: 'r', l: 'Verwacht rendement per jaar, vóór kosten', s: 'pct', std: 5.5, tip: 'Samengesteld (meetkundig) gemiddelde per jaar.' },
      { k: 'sd', l: 'Beweeglijkheid per jaar (standaarddeviatie)', s: 'pct', std: 12, tip: 'Ontleen dit aan de productinformatie of het risicoprofiel van de portefeuille.' },
      { k: 'k', l: 'Kosten per jaar', s: 'pct', std: 0.6, opt: true },
      { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 15 },
      { k: 'band', l: 'Breedte van de bandbreedte', s: 'keuze', opties: [['90', '1 op 20 slechter / 1 op 20 beter'], ['80', '1 op 10 slechter / 1 op 10 beter']], std: '90' }
    ],
    bereken(v) {
      const jaren = Math.round(v.jr);
      if (jaren <= 0 || jaren > 60) return { fout: 'Kies een looptijd tussen 1 en 60 jaar.' };
      if (v.st <= 0 && v.in <= 0) return { fout: 'Vul een startbedrag of een maandinleg in.' };
      if (v.sd < 0 || v.sd > 60) return { fout: 'Kies een beweeglijkheid tussen 0% en 60% per jaar.' };
      const netto = v.r - v.k;
      if (netto <= -100) return { fout: 'Het rendement na kosten moet groter zijn dan −100%.' };
      const z = v.band === '80' ? 1.2816 : 1.6449, mu = Math.log(1 + netto / 100), s = v.sd / 100;
      const scen = j => {
        const sj = s / Math.sqrt(j), n = j * 12;
        const rente = x => (Math.exp(mu + x * sj) - 1) * 100;
        const w = x => eindwaarde(v.st, v.in, maandUitJaar(rente(x)), n, true);
        return { laag: w(-z), mid: w(0), hoog: w(z), rl: rente(-z), rh: rente(z), sj };
      };
      const rijen = [];
      for (let j = 1; j <= jaren; j++) {
        const sc = scen(j);
        rijen.push([String(j), fmt.euro0(v.st + v.in * 12 * j), fmt.euro0(sc.laag), fmt.euro0(sc.mid), fmt.euro0(sc.hoog)]);
      }
      const e = scen(jaren), ingelegd = v.st + v.in * 12 * jaren;
      const kansNeg = s === 0 ? (mu < 0 ? 100 : 0) : normCdf(-mu / e.sj) * 100;
      const kans = v.band === '80' ? '10%' : '5%';
      const sig = [];
      if (e.laag < ingelegd) sig.push('In het ongunstige scenario is de eindwaarde lager dan het totaal ingelegde bedrag.');
      return {
        lbl: 'Middenscenario na ' + jaren + ' jaar', groot: fmt.euro0(e.mid),
        onder: 'ongunstig ' + fmt.euro0(e.laag) + ' · gunstig ' + fmt.euro0(e.hoog),
        rijen: [
          ['Totaal ingelegd', fmt.euro0(ingelegd)],
          ['Rendement na kosten (midden)', fmt.pct(netto, 2)],
          ['Gemiddeld jaarrendement ongunstig', fmt.pct(e.rl, 2)],
          ['Gemiddeld jaarrendement gunstig', fmt.pct(e.rh, 2)],
          ['Ongunstig (' + kans + ' kans op slechter)', fmt.euro0(e.laag)],
          ['Gunstig (' + kans + ' kans op beter)', fmt.euro0(e.hoog)],
          ['Kans op een negatief gemiddeld jaarrendement', fmt.pct(kansNeg, 1), 'som']
        ],
        signalen: sig,
        tabel: { kop: ['Jaar', 'Ingelegd', 'Ongunstig', 'Midden', 'Gunstig'], rijen }
      };
    },
    uitleg: 'Rendement na kosten = rendement − kosten. Het model neemt aan dat het samengestelde jaarrendement over n jaar lognormaal verdeeld is: ln(1 + gemiddeld jaarrendement) ~ normaal met verwachting ln(1 + rendement na kosten) en spreiding σ / √n. Ongunstig en gunstig = e<sup>ln(1 + rendement) ∓ z × σ / √n</sup> − 1, met z = 1,645 (5% en 95%) of z = 1,282 (10% en 90%). Met elk scenariorendement: start × (1 + i)<sup>m</sup> + inleg × ((1 + i)<sup>m</sup> − 1) / i × (1 + i), inleg aan het begin van de maand, i = (1 + jaarrendement)<sup>1/12</sup> − 1. Kans op een negatief gemiddeld jaarrendement = Φ(−ln(1 + rendement na kosten) × √n / σ).',
    letop: 'Dit is een vereenvoudigd statistisch model, geen voorspelling en geen toezegging; werkelijke koersen kennen grotere uitschieters dan de normale verdeling. Eén scenariorendement voor alle inleg is een benadering: latere stortingen staan korter belegd en hebben in werkelijkheid een bredere spreiding. Leg aannames voor rendement en beweeglijkheid vast en sluit aan bij het risicoprofiel van de klant. Gebruik voor productadvies de voorgeschreven scenario’s uit de wettelijke productinformatie (essentiële-informatiedocument). Belasting in box 3 en inflatie zijn niet meegenomen.'
  });
})(window.RT);
