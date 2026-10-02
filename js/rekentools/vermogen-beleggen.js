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

  /* =====================================================================
   * Fase 2 – uitbreiding sparen, beleggen en vermogen
   * ===================================================================== */
  {
    const NR = RT.normen, F = RT.fisc, PEIL = RT.normen.peildatum;
    const { irr } = RT.fin;
    /* Normen die (nog) niet in normen.js staan. Peildatum 2026 – gecontroleerd op 2026-10-02. */
    const N = {
      peildatum: '2026',
      depositogarantie: 100000,   // gegarandeerd bedrag per persoon per bank – bevestigd (DNB, Nederlandse depositogarantie)
      leegwaarderatio: 100        // standaard: verhuurde woning in box 3 als % van de WOZ. Tabel 2026 (Belastingdienst): huur ≤1% WOZ: 73%,
                                  // ≤2%: 79%, ≤3%: 84%, ≤4%: 90%, ≤5%: 95%, >5%: 100%. 100% is de bovenste trede (bevestigd), geen gemiddelde.
    };
    const PARTNERS = [['1', 'Nee, één persoon'], ['2', 'Ja, samen']];
    // Box 3-heffing die toe te rekenen is aan een extra bedrag (bank of overig), bovenop ander spaargeld
    const box3Extra = (bank, overig, ander, personen) =>
      F.box3(ander + bank, overig, 0, personen).belasting - F.box3(ander, 0, 0, personen).belasting;
    // Jaarlijkse opbouw met maandinleg (begin van de maand); box 3 over de stand op 1 januari, betaald aan het eind van het jaar
    const opbouwMetBox3 = (start, inleg, rendJaar, jaren, soort, ander, personen) => {
      const i = maandUitJaar(rendJaar);
      let w = start, heffingTot = 0;
      const stand = [];
      for (let j = 1; j <= jaren; j++) {
        const heffing = Math.max(0, soort === 'bank' ? box3Extra(w, 0, ander, personen) : box3Extra(0, w, ander, personen));
        w = eindwaarde(w, inleg, i, 12, true) - heffing;
        heffingTot += heffing;
        stand.push(w);
      }
      return { eind: w, heffing: heffingTot, stand };
    };

    RT.add({
      id: 'rendement-met-stortingen', groep: 'vermogen-beleggen', naam: 'Rendement met tussentijdse stortingen',
      intro: 'Welk rendement per jaar is er werkelijk behaald als er tussendoor geld is bijgestort of opgenomen?',
      kw: 'geldgewogen rendement irr stortingen opnames money weighted',
      velden: [
        { k: 'b', l: 'Beginwaarde', s: 'eur', std: 25000 },
        { k: 'e', l: 'Eindwaarde', s: 'eur', std: 38500 },
        { k: 'jr', l: 'Aantal jaren', s: 'num', na: 'jaar', std: 7 },
        { k: 'wijze', l: 'Stortingen', s: 'keuze', opties: [['vast', 'Elk jaar hetzelfde bedrag'], ['lijst', 'Per jaar een eigen bedrag']], std: 'vast', breed: true },
        { k: 'st', l: 'Storting per jaar', s: 'bedrag', std: 1000, als: v => v.wijze === 'vast', tip: 'Een opname met een minteken, bijvoorbeeld -500.' },
        { k: 'lijst', l: 'Stortingen per jaar (jaar 1, 2, …)', s: 'tekst', regels: 3, std: '2500; 2500; 0; 0; -1000; 0; 0', als: v => v.wijze === 'lijst', tip: 'Scheiden met puntkomma of een nieuwe regel; opname met minteken.' }
      ],
      bereken(v) {
        const n = Math.round(v.jr);
        if (v.b <= 0 || n <= 0 || n > 100) return { fout: 'Vul een beginwaarde groter dan nul en 1 tot 100 jaar in.' };
        const reeks = v.wijze === 'lijst' ? RT.lees.reeks(v.lijst) : [];
        const st = j => v.wijze === 'vast' ? v.st : (reeks[j - 1] || 0);
        const cf = [-v.b];
        let inleg = 0;
        for (let j = 1; j <= n; j++) { inleg += st(j); cf.push(j < n ? -st(j) : v.e - st(j)); }
        const mw = irr(cf), cagr = Math.pow(v.e / v.b, 1 / n) - 1;
        const sig = [];
        if (v.wijze === 'lijst' && reeks.length > n) sig.push('Er zijn meer bedragen ingevuld dan jaren; alleen de eerste ' + n + ' tellen mee.');
        if (!Number.isFinite(mw)) return { fout: 'Met deze bedragen is geen rendement te bepalen.' };
        return {
          lbl: 'Geldgewogen rendement per jaar', groot: fmt.pct(mw * 100, 2), onder: 'rekening houdend met stortingen en opnames',
          rijen: [
            ['Netto gestort (+) of opgenomen (−)', fmt.euro0(inleg)],
            ['Waardegroei boven inleg', fmt.euro0(v.e - v.b - inleg), 'som'],
            ['Ter vergelijking: zonder rekening te houden met stortingen', fmt.pct(cagr * 100, 2)]
          ],
          signalen: sig
        };
      },
      uitleg: 'Kasstromen: −beginwaarde op moment 0, −storting aan het eind van elk jaar, en in het laatste jaar eindwaarde − storting. Het geldgewogen rendement is de rente r waarbij de contante waarde van alle kasstromen nul is (interne rente).',
      letop: 'Het geldgewogen rendement hangt af van het moment van storten; het zegt dus ook iets over de timing van de belegger. Om beheerders of fondsen te vergelijken is het tijdgewogen rendement geschikter. Stortingen zijn verondersteld aan het eind van elk jaar.'
    });

    RT.add({
      id: 'reele-spaarrente', groep: 'vermogen-beleggen', naam: 'Spaarrente na box 3 en inflatie',
      intro: 'Wat blijft er van de spaarrente over na de vermogensrendementsheffing en na inflatie?',
      kw: 'spaarrente box 3 inflatie reeel effectief',
      peildatum: PEIL, fiscaal: ['heffingsvrij vermogen', 'forfait banktegoeden', 'tarief box 3'],
      velden: [
        { k: 'v', l: 'Spaargeld', s: 'eur', std: 80000 },
        { k: 'r', l: 'Spaarrente', s: 'pct', std: 1.8 },
        { k: 'm', l: 'Rente wordt bijgeschreven', s: 'keuze', opties: [['1', 'Per jaar'], ['4', 'Per kwartaal'], ['12', 'Per maand']], std: '1' },
        { k: 'inf', l: 'Inflatie', s: 'pct', std: 2.5 },
        { k: 'pers', l: 'Fiscale partners', s: 'keuze', opties: PARTNERS, std: '1' }
      ],
      bereken(v) {
        if (v.v <= 0) return { fout: 'Vul een spaarbedrag groter dan nul in.' };
        const m = +v.m, eff = Math.pow(1 + v.r / 100 / m, m) - 1;
        const b3 = F.box3(v.v, 0, 0, +v.pers), opbr = v.v * eff, na = opbr - b3.belasting;
        const naPct = na / v.v, reeel = (1 + naPct) / (1 + v.inf / 100) - 1;
        return {
          lbl: 'Reële rente na belasting en inflatie', groot: fmt.pct(reeel * 100, 2), onder: reeel < 0 ? 'koopkracht daalt' : 'koopkracht stijgt',
          rijen: [
            ['Effectieve rente', fmt.pct(eff * 100, 3)],
            ['Rente-opbrengst per jaar', fmt.euro0(opbr)],
            ['Box 3-grondslag', fmt.euro0(b3.grondslag)],
            ['Box 3-heffing', '− ' + fmt.euro0(b3.belasting)],
            ['Opbrengst na belasting', fmt.euro0(na)],
            ['Rente na belasting', fmt.pct(naPct * 100, 2), 'som']
          ]
        };
      },
      uitleg: 'Effectieve rente = (1 + rente / m)<sup>m</sup> − 1. Heffing = (spaargeld − heffingsvrij vermogen) × forfait banktegoeden × tarief box 3. Reëel = (1 + rente na belasting) / (1 + inflatie) − 1.',
      letop: 'Gerekend alsof dit spaargeld het hele box 3-vermogen is. Heeft de klant ook beleggingen of schulden, dan verschuift de heffing. Het forfaitaire stelsel is een overgangsregime; een stelsel op basis van werkelijk rendement is aangekondigd. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'sparen-of-beleggen', groep: 'vermogen-beleggen', naam: 'Sparen of beleggen vergelijken',
      intro: 'Dezelfde inleg sparen of beleggen: twee eindbedragen naast elkaar, elk met eigen rendement, kosten en box 3-heffing.',
      kw: 'sparen beleggen vergelijken box 3 kosten eindkapitaal',
      peildatum: PEIL, fiscaal: ['heffingsvrij vermogen', 'forfait banktegoeden', 'forfait overige bezittingen', 'tarief box 3'],
      velden: [
        { k: 's', l: 'Startbedrag', s: 'eur', std: 25000, opt: true },
        { k: 'i', l: 'Inleg per maand', s: 'eur', std: 250, opt: true },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 20 },
        { k: 'rs', l: 'Spaarrente', s: 'pct', std: 1.8 },
        { k: 'rb', l: 'Verwacht beleggingsrendement', s: 'pct', std: 6 },
        { k: 'kb', l: 'Kosten beleggen per jaar', s: 'pct', std: 0.5, opt: true },
        { k: 'ov', l: 'Ander spaargeld in box 3', s: 'eur', std: 60000, opt: true, tip: 'Bepaalt of het heffingsvrij vermogen al is benut.' },
        { k: 'pers', l: 'Fiscale partners', s: 'keuze', opties: PARTNERS, std: '1' }
      ],
      bereken(v) {
        const jaren = Math.round(v.jr), p = +v.pers;
        if (jaren <= 0 || jaren > 60) return { fout: 'Kies een looptijd van 1 tot 60 jaar.' };
        if (v.s <= 0 && v.i <= 0) return { fout: 'Vul een startbedrag of een maandinleg in.' };
        const sp = opbouwMetBox3(v.s, v.i, v.rs, jaren, 'bank', v.ov, p);
        const be = opbouwMetBox3(v.s, v.i, v.rb - v.kb, jaren, 'overig', v.ov, p);
        const inleg = v.s + v.i * 12 * jaren;
        return {
          lbl: 'Verschil beleggen min sparen', groot: fmt.euro0(be.eind - sp.eind), onder: 'na ' + jaren + ' jaar, na kosten en box 3',
          rijen: [
            ['Totaal ingelegd', fmt.euro0(inleg)],
            ['Eindbedrag sparen', fmt.euro0(sp.eind)],
            ['Eindbedrag beleggen', fmt.euro0(be.eind), 'som'],
            ['Box 3-heffing sparen (totaal)', fmt.euro0(sp.heffing)],
            ['Box 3-heffing beleggen (totaal)', fmt.euro0(be.heffing)]
          ],
          tabel: { kop: ['Jaar', 'Ingelegd', 'Sparen', 'Beleggen'], rijen: sp.stand.map((x, k) => [String(k + 1), fmt.euro0(v.s + v.i * 12 * (k + 1)), fmt.euro0(x), fmt.euro0(be.stand[k])]) }
        };
      },
      uitleg: 'Per maand: (stand + inleg) × (1 + i), met i = (1 + jaarrendement)<sup>1/12</sup> − 1 en bij beleggen jaarrendement = rendement − kosten. Per jaar gaat de box 3-heffing af die toe te rekenen is aan dit vermogen: heffing met dit vermogen erbij minus heffing over alleen het andere spaargeld, met het forfait voor banktegoeden of overige bezittingen.',
      letop: 'Een verwacht beleggingsrendement is geen voorspelling: de uitkomst kan lager uitvallen, ook lager dan bij sparen. Presenteer bij advies een risicotoelichting en scenario’s (zie Beleggen: ongunstig, midden en gunstig). Box 3-normen zijn gelijk gehouden en het forfaitaire stelsel is een overgangsregime. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'rendement-verhuurde-woning', groep: 'vermogen-beleggen', naam: 'Rendement op een verhuurde woning',
      intro: 'Aanvangsrendement, netto kasstroom en rendement op eigen geld van een woning die wordt verhuurd, inclusief box 3.',
      kw: 'vastgoed verhuur rendement belegger box 3 huur',
      peildatum: PEIL, fiscaal: ['forfait overige bezittingen', 'forfait schulden', 'tarief box 3', 'leegwaarderatio (bron, niet geverifieerd)'],
      velden: [
        { k: 'k', l: 'Aankoopprijs', s: 'eur', std: 300000 },
        { k: 'kk', l: 'Kosten koper', s: 'eur', std: 28000, opt: true, tip: 'Inclusief overdrachtsbelasting voor beleggers.' },
        { k: 'hyp', l: 'Lening', s: 'eur', std: 200000, opt: true },
        { k: 'r', l: 'Rente', s: 'pct', std: 5.2 },
        { k: 'hu', l: 'Huur per maand', s: 'eur', std: 1400 },
        { k: 'leeg', l: 'Leegstand', s: 'pct', std: 4, opt: true },
        { k: 'ko', l: 'Kosten per jaar', s: 'eur', std: 3600, tip: 'Onderhoud, VvE, verzekering, beheer, gemeentelijke lasten.' },
        { k: 'woz', l: 'WOZ-waarde', s: 'eur', std: 290000 },
        { k: 'lw', l: 'Waarde in box 3 als % van de WOZ', s: 'pct', std: N.leegwaarderatio, tip: 'Leegwaarderatio volgens de actuele tabel.' },
        { k: 'wst', l: 'Waardestijging per jaar', s: 'pct', std: 2, opt: true }
      ],
      bereken(v) {
        const inv = v.k + v.kk, eigen = inv - v.hyp;
        if (inv <= 0) return { fout: 'Vul een aankoopprijs groter dan nul in.' };
        const b = NR.box3, huur = v.hu * 12 * (1 - v.leeg / 100), rente = v.hyp * v.r / 100;
        const box3 = Math.max(0, v.woz * v.lw / 100 * b.forfaitOverig / 100 - v.hyp * b.forfaitSchuld / 100) * b.tarief / 100;
        const netto = huur - v.ko - rente - box3, groei = v.k * v.wst / 100;
        return {
          lbl: 'Netto kasstroom per jaar', groot: fmt.euro0(netto), onder: fmt.euro(netto / 12) + ' per maand',
          rijen: [
            ['Totale investering', fmt.euro0(inv)],
            ['Eigen inbreng', fmt.euro0(eigen)],
            ['Bruto aanvangsrendement', fmt.pct(v.hu * 12 / inv * 100, 2)],
            ['Huur na leegstand', fmt.euro0(huur)],
            ['Rente', '− ' + fmt.euro0(rente)],
            ['Kosten', '− ' + fmt.euro0(v.ko)],
            ['Box 3-heffing (indicatie)', '− ' + fmt.euro0(box3)],
            ['Kasstroomrendement op eigen inbreng', eigen > 0 ? fmt.pct(netto / eigen * 100, 2) : '–'],
            ['Inclusief waardestijging', eigen > 0 ? fmt.pct((netto + groei) / eigen * 100, 2) : '–', 'som']
          ]
        };
      },
      uitleg: 'Bruto aanvangsrendement = jaarhuur / (prijs + kosten koper). Box 3 ≈ (WOZ × leegwaarderatio × forfait overige bezittingen − lening × forfait schulden) × tarief, als het heffingsvrij vermogen al is benut. Netto = huur na leegstand − kosten − rente − box 3; rendement = netto / eigen inbreng.',
      letop: 'Indicatief: de leegwaarderatio (standaard ' + fmt.pct(N.leegwaarderatio, 0) + ') is een norm uit de bron die niet is geverifieerd; controleer de actuele tabel. Geen rekening gehouden met de schuldendrempel, verkoopkosten, huurregulering (puntenstelsel) en risico’s van leegstand of achterstallig onderhoud. Verhuurfinanciering valt buiten de leennormen voor consumptief krediet. Normen wijzigen jaarlijks; controleer de peildatum.'
    });

    RT.add({
      id: 'gemiddeld-rendement-reeks', groep: 'vermogen-beleggen', naam: 'Gemiddeld rendement over een reeks jaren',
      intro: 'Van een reeks jaarrendementen naar het werkelijke gemiddelde: meetkundig naast rekenkundig, met de spreiding.',
      kw: 'meetkundig rekenkundig gemiddelde rendement volatiliteit standaarddeviatie',
      velden: [
        { k: 'r', l: 'Rendement per jaar (%)', s: 'tekst', regels: 3, std: '12,4; -8,1; 21,7; 4,2; -2,5; 15,8', breed: true, tip: 'Scheiden met puntkomma of een nieuwe regel.' }
      ],
      bereken(v) {
        const R = RT.lees.reeks(v.r);
        if (!R.length) return { fout: 'Vul ten minste één jaarrendement in.' };
        if (R.some(x => x <= -100)) return { fout: 'Een jaarrendement moet groter zijn dan −100%.' };
        let fac = 1;
        const rijen = R.map((x, k) => { fac *= 1 + x / 100; return [String(k + 1), fmt.pct(x, 2), fmt.euro0(10000 * fac)]; });
        const n = R.length, geo = (Math.pow(fac, 1 / n) - 1) * 100, rek = R.reduce((a, b) => a + b, 0) / n;
        const sd = n > 1 ? Math.sqrt(R.reduce((a, x) => a + (x - rek) * (x - rek), 0) / (n - 1)) : 0;
        return {
          lbl: 'Meetkundig gemiddelde per jaar', groot: fmt.pct(geo, 2), onder: n + (n === 1 ? ' jaar' : ' jaren'),
          rijen: [
            ['Rekenkundig gemiddelde', fmt.pct(rek, 2)],
            ['Verschil (effect van beweeglijkheid)', fmt.pct(rek - geo, 2)],
            ['Totaal rendement over de reeks', fmt.pct((fac - 1) * 100, 2)],
            ['Standaarddeviatie (steekproef)', fmt.pct(sd, 2), 'som']
          ],
          tabel: { titel: 'Verloop van € 10.000', kop: ['Jaar', 'Rendement', 'Waarde'], rijen }
        };
      },
      uitleg: 'Meetkundig = (Π(1 + r<sub>j</sub>))<sup>1/n</sup> − 1: het vaste jaarrendement dat dezelfde eindwaarde geeft. Rekenkundig = som / n. Standaarddeviatie = √(Σ(r<sub>j</sub> − gemiddelde)² / (n − 1)).',
      letop: 'Het rekenkundige gemiddelde overschat wat een belegger werkelijk overhoudt zodra rendementen schommelen. Rendementen uit het verleden bieden geen garantie voor de toekomst. Stortingen en opnames tellen hier niet mee: zie Rendement met tussentijdse stortingen.'
    });

    RT.add({
      id: 'depositogarantie', groep: 'vermogen-beleggen', naam: 'Spaargeld binnen de depositogarantie',
      intro: 'Hoeveel spaargeld valt binnen het depositogarantiestelsel, en over hoeveel banken moet het worden verdeeld om volledig gedekt te zijn?',
      kw: 'depositogarantiestelsel dgs spaargeld bank garantie',
      peildatum: N.peildatum, fiscaal: ['garantiebedrag per persoon per bank (bron, niet geverifieerd)'],
      velden: [
        { k: 'v', l: 'Totaal spaargeld', s: 'eur', std: 350000 },
        { k: 'g', l: 'Garantie per persoon per bank', s: 'eur', std: N.depositogarantie },
        { k: 'p', l: 'Aantal rekeninghouders', s: 'num', std: 2, tip: 'Bij een gezamenlijke rekening telt de garantie per rekeninghouder.' },
        { k: 'b', l: 'Aantal banken (vergunningen)', s: 'num', std: 2 }
      ],
      bereken(v) {
        const p = Math.round(v.p), b = Math.round(v.b);
        if (p <= 0 || b <= 0 || v.g <= 0) return { fout: 'Vul garantie, personen en banken groter dan nul in.' };
        const perBank = v.g * p, dek = Math.min(v.v, perBank * b), nodig = Math.ceil(v.v / perBank);
        return {
          lbl: 'Gedekt spaargeld', groot: fmt.euro0(dek), onder: v.v > dek ? 'niet gedekt: ' + fmt.euro0(v.v - dek) : 'volledig gedekt bij gelijkmatige spreiding',
          rijen: [
            ['Dekking per bank', fmt.euro0(perBank)],
            ['Maximale dekking bij ' + b + (b === 1 ? ' bank' : ' banken'), fmt.euro0(perBank * b)],
            ['Benodigd aantal banken', String(nodig), 'som'],
            ['Gemiddeld per bank bij dat aantal', fmt.euro0(v.v / Math.max(1, nodig))]
          ]
        };
      },
      uitleg: 'Dekking per bank = garantiebedrag × aantal rekeninghouders. Gedekt = laagste van spaargeld en dekking per bank × aantal banken (bij gelijkmatige verdeling). Benodigd aantal banken = spaargeld / dekking per bank, naar boven afgerond.',
      letop: 'Indicatief: het garantiebedrag is een norm uit de bron die niet is geverifieerd; controleer de actuele norm bij DNB. Merken die onder één bankvergunning vallen tellen als één bank. Tijdelijk hoge saldi (bijvoorbeeld na verkoop van de eigen woning) kunnen onder voorwaarden een hogere dekking hebben; controleer dit. Beleggingen vallen niet onder de depositogarantie maar onder het beleggerscompensatiestelsel.'
    });

    RT.add({
      id: 'eerder-beginnen-sparen', groep: 'vermogen-beleggen', naam: 'Wat levert eerder starten met sparen op',
      intro: 'Dezelfde maandinleg en hetzelfde rendement, maar een aantal jaren eerder beginnen: hoeveel meer is er op de einddatum?',
      kw: 'eerder sparen rente op rente starten leeftijd',
      velden: [
        { k: 'i', l: 'Inleg per maand', s: 'eur', std: 200 },
        { k: 'r', l: 'Rendement per jaar', s: 'pct', std: 5 },
        { k: 'nu', l: 'Leeftijd bij laat starten', s: 'num', na: 'jaar', std: 35 },
        { k: 'eerder', l: 'Zoveel jaren eerder beginnen', s: 'num', na: 'jaar', std: 10 },
        { k: 'eind', l: 'Leeftijd op de einddatum', s: 'num', na: 'jaar', std: 67 }
      ],
      bereken(v) {
        const nL = Math.round((v.eind - v.nu) * 12), nV = Math.round((v.eind - v.nu + v.eerder) * 12), i = maandUitJaar(v.r);
        if (nL <= 0 || v.eerder <= 0 || v.nu - v.eerder < 0) return { fout: 'Controleer de leeftijden: de einddatum moet na de start liggen.' };
        const laat = eindwaarde(0, v.i, i, nL, true), vroeg = eindwaarde(0, v.i, i, nV, true);
        const extraInleg = v.i * (nV - nL), factor = i === 0 ? nL : (Math.pow(1 + i, nL) - 1) / i * (1 + i);
        return {
          lbl: 'Meer op de einddatum', groot: fmt.euro0(vroeg - laat), onder: 'door ' + fmt.getal(v.eerder, 0) + ' jaar eerder te beginnen',
          rijen: [
            ['Starten op ' + fmt.getal(v.nu - v.eerder, 0) + ' jaar', fmt.euro0(vroeg)],
            ['Starten op ' + fmt.getal(v.nu, 0) + ' jaar', fmt.euro0(laat)],
            ['Extra ingelegd', fmt.euro0(extraInleg)],
            ['Extra uit rendement', fmt.euro0(vroeg - laat - extraInleg), 'som'],
            ['Maandinleg bij laat starten voor hetzelfde eindbedrag', fmt.euro(vroeg / factor)]
          ]
        };
      },
      uitleg: 'Eindbedrag = inleg × ((1 + i)<sup>n</sup> − 1) / i × (1 + i), inleg aan het begin van de maand, i = (1 + rendement)<sup>1/12</sup> − 1. n = maanden tot de einddatum vanaf elk startmoment.',
      letop: 'Vóór belasting, kosten en inflatie. Het rendement is gelijk verondersteld; bij beleggen kan het werkelijke verloop sterk afwijken.'
    });

    RT.add({
      id: 'hogere-rente-sparen', groep: 'vermogen-beleggen', naam: 'Verschil door hogere rente',
      intro: 'Wat levert een hogere rente op bij hetzelfde startbedrag en dezelfde maandinleg?',
      kw: 'hogere spaarrente vergelijken verschil eindkapitaal',
      velden: [
        { k: 's', l: 'Startbedrag', s: 'eur', std: 25000, opt: true },
        { k: 'i', l: 'Inleg per maand', s: 'eur', std: 200, opt: true },
        { k: 'r1', l: 'Huidige rente', s: 'pct', std: 1.5 },
        { k: 'r2', l: 'Hogere rente', s: 'pct', std: 2.75 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 10 }
      ],
      bereken(v) {
        const jaren = Math.round(v.jr);
        if (jaren <= 0 || jaren > 100) return { fout: 'Kies een looptijd van 1 tot 100 jaar.' };
        const w = (r, j) => eindwaarde(v.s, v.i, maandUitJaar(r), j * 12, true);
        const a = w(v.r1, jaren), b = w(v.r2, jaren), inleg = v.s + v.i * 12 * jaren;
        const rijen = [];
        for (let j = 1; j <= jaren; j++) { const x = w(v.r1, j), y = w(v.r2, j); rijen.push([String(j), fmt.euro0(x), fmt.euro0(y), fmt.euro0(y - x)]); }
        return {
          lbl: 'Verschil na ' + jaren + ' jaar', groot: fmt.euro0(b - a), onder: fmt.pct(v.r2, 2) + ' tegenover ' + fmt.pct(v.r1, 2),
          rijen: [
            ['Totaal ingelegd', fmt.euro0(inleg)],
            ['Eindbedrag bij ' + fmt.pct(v.r1, 2), fmt.euro0(a)],
            ['Eindbedrag bij ' + fmt.pct(v.r2, 2), fmt.euro0(b), 'som'],
            ['Gemiddeld verschil per jaar', fmt.euro0((b - a) / jaren)]
          ],
          tabel: { kop: ['Jaar', fmt.pct(v.r1, 2), fmt.pct(v.r2, 2), 'Verschil'], rijen }
        };
      },
      uitleg: 'Eindbedrag = start × (1 + i)<sup>n</sup> + inleg × ((1 + i)<sup>n</sup> − 1) / i × (1 + i), inleg aan het begin van de maand, i = (1 + rente)<sup>1/12</sup> − 1.',
      letop: 'Vóór box 3 en inflatie. Spaarrentes zijn meestal variabel; een hogere rente kan voorwaarden hebben (vaste looptijd, opnamebeperking). Let op de depositogarantie per bank.'
    });

    RT.add({
      id: 'totale-beleggingskosten', groep: 'vermogen-beleggen', naam: 'Totale kosten van beleggen',
      intro: 'Alle kosten van beleggen bij elkaar opgeteld, als percentage en in euro’s, en het effect op het eindbedrag.',
      kw: 'kosten beleggen tco lopende kosten beheerkosten transactiekosten',
      velden: [
        { k: 'v', l: 'Belegd vermogen', s: 'eur', std: 250000 },
        { k: 'beh', l: 'Beheer- of servicekosten', s: 'pct', std: 0.55 },
        { k: 'fonds', l: 'Lopende kosten fondsen', s: 'pct', std: 0.22 },
        { k: 'trans', l: 'Transactiekosten', s: 'pct', std: 0.08, opt: true },
        { k: 'spread', l: 'Spread- en valutakosten', s: 'pct', std: 0.05, opt: true },
        { k: 'vast', l: 'Vaste kosten per jaar', s: 'eur', std: 0, opt: true },
        { k: 'r', l: 'Bruto rendement per jaar', s: 'pct', std: 6 },
        { k: 'jr', l: 'Looptijd', s: 'num', na: 'jaar', std: 20 }
      ],
      bereken(v) {
        const jaren = Math.round(v.jr);
        if (v.v <= 0 || jaren <= 0) return { fout: 'Vul een vermogen en een looptijd groter dan nul in.' };
        const pct = v.beh + v.fonds + v.trans + v.spread + v.vast / v.v * 100;
        const bruto = v.v * Math.pow(1 + v.r / 100, jaren), netto = v.v * Math.pow(1 + (v.r - pct) / 100, jaren);
        return {
          lbl: 'Totale kosten per jaar', groot: fmt.pct(pct, 2), onder: fmt.euro0(v.v * pct / 100) + ' in het eerste jaar',
          rijen: [
            ['Beheer en fondsen', fmt.pct(v.beh + v.fonds, 2)],
            ['Transactie, spread en valuta', fmt.pct(v.trans + v.spread, 2)],
            ['Vaste kosten als percentage', fmt.pct(v.vast / v.v * 100, 2)],
            ['Rendement na kosten', fmt.pct(v.r - pct, 2)],
            ['Eindbedrag zonder kosten', fmt.euro0(bruto)],
            ['Eindbedrag met kosten', fmt.euro0(netto)],
            ['Verschil over ' + jaren + ' jaar', fmt.euro0(bruto - netto), 'som']
          ]
        };
      },
      uitleg: 'Totale kosten = beheer + lopende kosten + transactie + spread + vaste kosten / vermogen. Eindbedrag = vermogen × (1 + rendement − kosten)<sup>jaren</sup>. Het verschil omvat ook het gemiste rendement op de betaalde kosten.',
      letop: 'Gebruik bij advies de kosten uit de wettelijke kosteninformatie van de aanbieder (inclusief transactiekosten en eventuele advies- of distributiekosten). Vaste kosten zijn als percentage van het startvermogen genomen. Vóór box 3 en inflatie; zie ook Effect van kosten op vermogensopbouw.'
    });
  }
})(window.RT);
