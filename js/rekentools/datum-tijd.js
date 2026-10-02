/* Rekenhulpen – groep "datum-tijd" (Datum en tijd).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { plusDagen, feestnaam, isWerkdag, dagVerschil, plusMaanden, isoWeek } = RT.kal;
  const { VRIJ } = RT.keuzes;
  const pos = x => Math.max(0, x);

  RT.add({
    id: 'periode', groep: 'datum-tijd', naam: 'Dagen en werkdagen tussen twee data',
    intro: 'Handig voor ontbindende voorwaarden, een offertetermijn of de tijd tot de passeerdatum.',
    velden: [
      { k: 'van', l: 'Van', s: 'datum', std: '2026-10-05' },
      { k: 'tot', l: 'Tot en met', s: 'datum', std: '2026-12-31' },
      { k: 'vrij', l: 'Welke feestdagen tellen als vrij?', s: 'keuze', opties: VRIJ, std: 'ruim', breed: true }
    ],
    bereken(v) {
      if (!v.van || !v.tot) return { fout: 'Vul beide data in.' };
      let a = v.van, b = v.tot, om = false;
      if (b < a) { [a, b] = [b, a]; om = true; }
      const ruim = v.vrij === 'ruim', dagen = dagVerschil(a, b);
      let werk = 0, weekend = 0; const vrij = [];
      for (let d = a; d <= b; d = plusDagen(d, 1)) {
        const w = d.getDay();
        if (w === 0 || w === 6) { weekend++; continue; }
        const f = feestnaam(d, ruim);
        if (f) vrij.push(f + ' (' + fmt.datumKort(d) + ')'); else werk++;
      }
      let jj = b.getFullYear() - a.getFullYear(), mm = b.getMonth() - a.getMonth(), dd = b.getDate() - a.getDate();
      if (dd < 0) { mm--; dd += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
      if (mm < 0) { jj--; mm += 12; }
      return {
        lbl: 'Werkdagen (beide data meegeteld)', groot: fmt.getal(werk), onder: 'maandag tot en met vrijdag, zonder feestdagen',
        rijen: [
          ['Kalenderdagen ertussen', fmt.getal(dagen)],
          ['Kalenderdagen inclusief beide data', fmt.getal(dagen + 1)],
          ['In jaren, maanden en dagen', jj + ' j, ' + mm + ' m, ' + dd + ' d'],
          ['Weekenddagen', fmt.getal(weekend)],
          ['Feestdagen op een doordeweekse dag', fmt.getal(vrij.length), 'som']
        ],
        signalen: (om ? ['De data waren omgedraaid; er is gerekend van de vroegste naar de laatste datum.'] : []).concat(vrij.length ? ['Vrij in deze periode: ' + vrij.join(', ') + '.'] : [])
      };
    },
    uitleg: 'Kalenderdagen = verschil tussen de data. Werkdagen = alle maandagen tot en met vrijdagen van de begin- tot en met de einddatum, minus de gekozen feestdagen. Pasen wordt per jaar berekend; Koningsdag schuift naar 26 april als 27 april op zondag valt.',
    letop: 'Hoe een contractuele of wettelijke termijn telt (wel of niet de begindag, wat er gebeurt als de laatste dag in het weekend valt) volgt uit de koopovereenkomst of de wet. Controleer kritieke data altijd met de notaris of makelaar.'
  });

  RT.add({
    id: 'datum', groep: 'datum-tijd', naam: 'Datum vooruit of terug rekenen',
    intro: 'Welke datum ligt een aantal dagen, werkdagen, weken of maanden voor of na een startdatum?',
    velden: [
      { k: 'start', l: 'Startdatum', s: 'datum', std: '2026-10-05' },
      { k: 'n', l: 'Aantal', s: 'num', std: 14 },
      { k: 'eenh', l: 'Eenheid', s: 'keuze', opties: [['dag', 'Kalenderdagen'], ['werk', 'Werkdagen'], ['week', 'Weken'], ['mnd', 'Maanden']], std: 'dag' },
      { k: 'richting', l: 'Richting', s: 'keuze', opties: [['na', 'Na de startdatum'], ['voor', 'Vóór de startdatum']], std: 'na' },
      { k: 'vrij', l: 'Welke feestdagen tellen als vrij?', s: 'keuze', opties: VRIJ, std: 'ruim', breed: true }
    ],
    bereken(v) {
      if (!v.start) return { fout: 'Vul een startdatum in.' };
      const n = Math.round(v.n), z = v.richting === 'voor' ? -1 : 1, ruim = v.vrij === 'ruim';
      if (n < 0 || n > 20000) return { fout: 'Kies een aantal tussen 0 en 20.000.' };
      let d;
      if (v.eenh === 'dag') d = plusDagen(v.start, z * n);
      else if (v.eenh === 'week') d = plusDagen(v.start, z * n * 7);
      else if (v.eenh === 'mnd') d = plusMaanden(v.start, z * n);
      else { d = v.start; let k = 0; while (k < n) { d = plusDagen(d, z); if (isWerkdag(d, ruim)) k++; } }
      const sig = [];
      const f = feestnaam(d, ruim);
      if (v.eenh !== 'werk') {
        if (f) sig.push('Deze datum is een feestdag: ' + f + '.');
        else if (d.getDay() === 0 || d.getDay() === 6) sig.push('Deze datum valt in het weekend.');
      }
      if (v.eenh === 'werk') sig.push('De startdatum zelf telt niet mee als werkdag.');
      return {
        lbl: 'Uitkomst', groot: fmt.datum(d), onder: 'week ' + isoWeek(d),
        rijen: [['Kalenderdagen ten opzichte van de start', (z > 0 ? '+' : '') + fmt.getal(dagVerschil(v.start, d)), 'som']],
        signalen: sig
      };
    },
    uitleg: 'Kalenderdagen en weken: optellen of aftrekken. Maanden: zelfde dagnummer, of de laatste dag van de maand als die dag niet bestaat (31 januari + 1 maand = 28 of 29 februari). Werkdagen: dag voor dag verder, weekenden en gekozen feestdagen overslaan.',
    letop: 'Een rekenkundige uitkomst; of een termijn juridisch op deze dag eindigt, hangt af van de afspraken en de wet.'
  });

  /* ---------- feestdagen, weekdagen, capaciteit en schoolvakanties ---------- */
  const { feestlijst, paasdatum } = RT.kal;
  const WERKDAG = d => d.getDay() !== 0 && d.getDay() !== 6;
  const geldigJaar = j => Number.isFinite(j) && j >= 1900 && j <= 2200;
  // Alle feestdagen van een jaar, gesorteerd; ruim = ook Goede Vrijdag en 5 mei
  const feestenGesorteerd = (jaar, ruim) => feestlijst(jaar, ruim).slice().sort((a, b) => a[0] - b[0]);
  const BEPERKT = { 'Goede Vrijdag': 1, 'Bevrijdingsdag': 1 };

  RT.add({
    id: 'feestdagen-jaar', groep: 'datum-tijd', naam: 'Feestdagen van een jaar',
    intro: 'Alle Nederlandse feestdagen van een jaar met datum en weekdag, inclusief de van Pasen afgeleide dagen.',
    kw: 'feestdagen pasen pinksteren hemelvaart koningsdag kerst goede vrijdag bevrijdingsdag kalender',
    velden: [
      { k: 'j', l: 'Jaar', s: 'num', std: 2027 }
    ],
    bereken(v) {
      const j = Math.round(v.j);
      if (!geldigJaar(j)) return { fout: 'Kies een jaar tussen 1900 en 2200.' };
      const lijst = feestenGesorteerd(j, true);
      const opWerkdag = lijst.filter(([d, n]) => WERKDAG(d) && !BEPERKT[n]).length;
      return {
        lbl: 'Eerste paasdag ' + j, groot: fmt.datum(paasdatum(j)),
        onder: opWerkdag + ' algemene feestdagen vallen op een doordeweekse dag',
        rijen: [
          ['Algemene feestdagen', String(lijst.length - 2)],
          ['Plus Goede Vrijdag en Bevrijdingsdag', '2'],
          ['Bevrijdingsdag is lustrumjaar', j % 5 === 0 ? 'ja' : 'nee', 'som']
        ],
        tabel: {
          titel: 'Feestdagen ' + j, kop: ['Feestdag', 'Datum', 'Weekdag'],
          rijen: lijst.map(([d, n]) => [n + (BEPERKT[n] ? ' *' : ''), d.getDate() + ' ' + RT.MAANDEN[d.getMonth()], RT.DAGEN[d.getDay()]])
        },
        signalen: ['* Goede Vrijdag en Bevrijdingsdag zijn niet voor iedereen een vrije dag; dat hangt af van cao of arbeidsovereenkomst.']
      };
    },
    uitleg: 'Vaste data: Nieuwjaarsdag, Koningsdag (27 april, of 26 april als 27 april op zondag valt), Bevrijdingsdag (5 mei), Eerste en Tweede Kerstdag. Afgeleid van Eerste Paasdag (berekend met de Gregoriaanse paasformule): Goede Vrijdag −2 dagen, Tweede Paasdag +1, Hemelvaartsdag +39, Eerste en Tweede Pinksterdag +49 en +50.',
    letop: 'Of een werknemer op een feestdag vrij is, volgt uit cao of arbeidsovereenkomst. Voor wettelijke termijnen telt de Algemene termijnenwet.'
  });

  RT.add({
    id: 'feestdagen-op-werkdagen', groep: 'datum-tijd', naam: 'Feestdagen op werkdagen',
    intro: 'Hoeveel feestdagen vallen in een jaar op een doordeweekse dag, en hoeveel werkuren kost dat een team?',
    kw: 'feestdagen werkdagen doordeweeks uren personeel capaciteit planning',
    velden: [
      { k: 'j', l: 'Jaar', s: 'num', std: 2027 },
      { k: 'vrij', l: 'Welke feestdagen tellen als vrij?', s: 'keuze', opties: VRIJ, std: 'smal', breed: true },
      { k: 'u', l: 'Uren per werkdag', s: 'num', std: 8 },
      { k: 'mw', l: 'Aantal medewerkers', s: 'num', std: 25 }
    ],
    bereken(v) {
      const j = Math.round(v.j);
      if (!geldigJaar(j)) return { fout: 'Kies een jaar tussen 1900 en 2200.' };
      const lijst = feestenGesorteerd(j, v.vrij === 'ruim');
      const wd = lijst.filter(([d]) => WERKDAG(d));
      const uren = wd.length * v.u;
      return {
        lbl: 'Feestdagen op een werkdag', groot: String(wd.length), onder: 'van de ' + lijst.length + ' feestdagen in ' + j,
        rijen: [
          ['In het weekend', String(lijst.length - wd.length)],
          ['Vrije uren per medewerker', fmt.getal(uren, 1)],
          ['Vrije uren voor het hele team', fmt.getal(uren * Math.round(v.mw), 1), 'som']
        ],
        tabel: { titel: 'Op een werkdag in ' + j, kop: ['Feestdag', 'Datum'], rijen: wd.map(([d, n]) => [n, fmt.datum(d)]) }
      };
    },
    uitleg: 'Per feestdag wordt bepaald of die op maandag tot en met vrijdag valt. Vrije uren = aantal feestdagen op een werkdag × uren per werkdag (× medewerkers).',
    letop: 'Deeltijders die niet op de feestdag werken, missen geen uren. Of iemand recht heeft op compensatie voor een feestdag in het weekend of op een vrije dag, regelt de cao.'
  });

  const WEEKDAGEN = [['1', 'Maandag'], ['2', 'Dinsdag'], ['3', 'Woensdag'], ['4', 'Donderdag'], ['5', 'Vrijdag'], ['6', 'Zaterdag'], ['0', 'Zondag']];

  RT.add({
    id: 'volgende-weekdag', groep: 'datum-tijd', naam: 'Volgende of vorige gekozen weekdag',
    intro: 'Op welke datum valt de eerstvolgende (of vorige, of derde volgende) maandag, vrijdag of andere weekdag?',
    kw: 'weekdag volgende vorige maandag vrijdag datum kalender',
    velden: [
      { k: 'start', l: 'Vanaf datum', s: 'datum', std: '2026-10-05' },
      { k: 'w', l: 'Weekdag', s: 'keuze', opties: WEEKDAGEN, std: '5' },
      { k: 'r', l: 'Richting', s: 'keuze', opties: [['1', 'Vooruit'], ['-1', 'Terug']], std: '1' },
      { k: 'n', l: 'De hoeveelste', s: 'num', std: 1, tip: '1 = eerstvolgende of meest recente.' },
      { k: 'mee', l: 'Telt de startdatum zelf mee?', s: 'keuze', opties: RT.keuzes.JANEE, std: 'nee' }
    ],
    bereken(v) {
      if (!v.start) return { fout: 'Vul een datum in.' };
      const n = Math.round(v.n), z = +v.r, w = +v.w;
      if (n < 1 || n > 5000) return { fout: 'Kies een aantal tussen 1 en 5.000.' };
      let d = v.start;
      // eerste treffer: de startdatum zelf (als die meetelt) of de eerstvolgende in de gekozen richting
      if (!(v.mee === 'ja' && d.getDay() === w)) { d = plusDagen(d, z); while (d.getDay() !== w) d = plusDagen(d, z); }
      d = plusDagen(d, z * 7 * (n - 1));
      const f = feestnaam(d, true);
      return {
        lbl: 'Datum', groot: fmt.datum(d), onder: 'week ' + isoWeek(d),
        rijen: [
          ['Kalenderdagen vanaf de startdatum', (z > 0 ? '+' : '−') + fmt.getal(Math.abs(dagVerschil(v.start, d)))],
          ['Feestdag?', f || 'nee', 'som']
        ],
        signalen: f ? ['Let op: ' + f + ' valt op deze datum.'] : []
      };
    },
    uitleg: 'Vanaf de startdatum wordt dag voor dag vooruit of terug gezocht naar de gekozen weekdag; voor de tweede, derde, … treffer komen daar steeds zeven dagen bij of af.',
    letop: 'Standaard telt de startdatum niet mee: de eerstvolgende vrijdag vanaf een vrijdag is dan de vrijdag erna.'
  });

  RT.add({
    id: 'werkdagen-capaciteit', groep: 'datum-tijd', naam: 'Werkdagen en factureerbare capaciteit',
    intro: 'Hoeveel werkdagen, declarabele uren en maximale omzet zitten er in een periode na feestdagen, vakantie en andere afwezigheid?',
    kw: 'werkdagen capaciteit declarabel uren omzet zzp ondernemer vakantie planning',
    velden: [
      { k: 'van', l: 'Van', s: 'datum', std: '2027-01-01' },
      { k: 'tot', l: 'Tot en met', s: 'datum', std: '2027-12-31' },
      { k: 'vrij', l: 'Welke feestdagen tellen als vrij?', s: 'keuze', opties: VRIJ, std: 'smal', breed: true },
      { k: 'vak', l: 'Vakantiedagen', s: 'num', std: 25, opt: true },
      { k: 'af', l: 'Overige afwezigheid (ziekte, opleiding)', s: 'num', na: 'dagen', std: 10, opt: true },
      { k: 'u', l: 'Declarabele uren per werkdag', s: 'num', std: 6 },
      { k: 'tar', l: 'Uurtarief', s: 'bedrag', std: 85, opt: true }
    ],
    bereken(v) {
      if (!v.van || !v.tot) return { fout: 'Vul beide data in.' };
      if (v.tot < v.van) return { fout: 'De einddatum ligt vóór de begindatum.' };
      if (dagVerschil(v.van, v.tot) > 3700) return { fout: 'Kies een periode van hooguit tien jaar.' };
      const ruim = v.vrij === 'ruim';
      let doordeweeks = 0, feest = 0;
      for (let d = v.van; d <= v.tot; d = plusDagen(d, 1)) {
        if (!WERKDAG(d)) continue;
        doordeweeks++;
        if (!isWerkdag(d, ruim)) feest++;
      }
      const werk = doordeweeks - feest, beschikbaar = pos(werk - (v.vak || 0) - (v.af || 0));
      const uren = beschikbaar * v.u, omzet = uren * (v.tar || 0);
      const maanden = Math.max(1, dagVerschil(v.van, v.tot) + 1) / (365.25 / 12);
      return {
        lbl: 'Beschikbare werkdagen', groot: fmt.getal(beschikbaar), onder: fmt.getal(uren) + ' declarabele uren',
        rijen: [
          ['Maandag tot en met vrijdag', fmt.getal(doordeweeks)],
          ['Feestdagen op een werkdag', '− ' + fmt.getal(feest)],
          ['Vakantie en overige afwezigheid', '− ' + fmt.getal((v.vak || 0) + (v.af || 0))],
          ['Maximale omzet', fmt.euro0(omzet)],
          ['Gemiddeld per maand', fmt.euro0(omzet / maanden), 'som']
        ],
        signalen: werk < (v.vak || 0) + (v.af || 0) ? ['Er zijn meer vrije dagen opgegeven dan er werkdagen in de periode zitten.'] : []
      };
    },
    uitleg: 'Werkdagen = maandagen tot en met vrijdagen in de periode (begin- en einddatum meegeteld) minus feestdagen op een werkdag. Beschikbaar = werkdagen − vakantie − overige afwezigheid. Omzet = beschikbare dagen × declarabele uren × uurtarief.',
    letop: 'Maximale omzet bij volledige bezetting; in de praktijk zijn niet alle beschikbare uren declarabel (acquisitie, administratie). Voor het urencriterium van ondernemers tellen ook niet-declarabele uren mee.'
  });

  // Kerstvakantie: twee weken vanaf de zaterdag op of vóór Eerste Kerstdag, tot en met de tweede zondag daarna
  const kerstvakantie = jaar => {
    const kerst = new Date(jaar, 11, 25), start = plusDagen(kerst, -((kerst.getDay() + 1) % 7));
    return [start, plusDagen(start, 15)];
  };
  // Een vakantie van w weken vanaf zaterdag s loopt tot en met de zondag na w weken
  const vakEinde = (s, w) => plusDagen(s, 7 * w + 1);

  RT.add({
    id: 'schoolvakanties-planner', groep: 'datum-tijd', naam: 'Schoolvakanties in een jaar',
    intro: 'Overzicht van de schoolvakanties in een schooljaar, met het aantal werkdagen waarvoor ouders vrij of opvang moeten regelen.',
    kw: 'schoolvakantie kerstvakantie zomervakantie herfstvakantie meivakantie regio opvang verlof',
    peildatum: '2026', fiscaal: ['Schoolvakantiedata per regio (jaarlijks vastgesteld)'],
    velden: [
      { k: 'j', l: 'Schooljaar begint in', s: 'num', std: 2026 },
      { k: 'h', l: 'Start herfstvakantie (zaterdag)', s: 'datum', std: '2026-10-17' },
      { k: 'vj', l: 'Start voorjaarsvakantie (zaterdag)', s: 'datum', std: '2027-02-13' },
      { k: 'm', l: 'Start meivakantie (zaterdag)', s: 'datum', std: '2027-04-24' },
      { k: 'mw', l: 'Weken meivakantie', s: 'num', std: 2 },
      { k: 'z', l: 'Start zomervakantie (zaterdag)', s: 'datum', std: '2027-07-10' },
      { k: 'zw', l: 'Weken zomervakantie', s: 'num', std: 6 },
      { k: 'vrij', l: 'Welke feestdagen tellen als vrij?', s: 'keuze', opties: VRIJ, std: 'smal', breed: true },
      { k: 'vd', l: 'Vrije dagen van de ouder per jaar', s: 'num', std: 25, opt: true }
    ],
    bereken(v) {
      const j = Math.round(v.j);
      if (!geldigJaar(j)) return { fout: 'Kies een jaar tussen 1900 en 2200.' };
      const ruim = v.vrij === 'ruim';
      const telWerk = (a, b) => { let n = 0; for (let d = a; d <= b; d = plusDagen(d, 1)) if (isWerkdag(d, ruim)) n++; return n; };
      const [ks, ke] = kerstvakantie(j);
      const lijst = [
        ['Herfstvakantie', v.h, v.h && vakEinde(v.h, 1)],
        ['Kerstvakantie', ks, ke],
        ['Voorjaarsvakantie', v.vj, v.vj && vakEinde(v.vj, 1)],
        ['Meivakantie', v.m, v.m && vakEinde(v.m, Math.max(1, Math.round(v.mw)))],
        ['Zomervakantie', v.z, v.z && vakEinde(v.z, Math.max(1, Math.round(v.zw)))]
      ].filter(x => x[1]);
      let totaal = 0;
      const rijen = lijst.map(([n, a, b]) => { const w = telWerk(a, b); totaal += w; return [n, fmt.datumKort(a) + ' ' + a.getFullYear(), fmt.datumKort(b) + ' ' + b.getFullYear(), String(w)]; });
      const tekort = pos(totaal - (v.vd || 0));
      return {
        lbl: 'Werkdagen in de schoolvakanties', groot: fmt.getal(totaal), onder: 'schooljaar ' + j + '–' + (j + 1),
        rijen: [
          ['Kerstvakantie (landelijk)', fmt.datumKort(ks) + ' t/m ' + fmt.datumKort(ke) + ' ' + ke.getFullYear()],
          ['Vrije dagen van de ouder', fmt.getal(v.vd || 0)],
          ['Op te vangen werkdagen (tekort)', fmt.getal(tekort), 'som']
        ],
        tabel: { titel: 'Vakanties', kop: ['Vakantie', 'Van', 'Tot en met', 'Werkdagen'], rijen }
      };
    },
    uitleg: 'Kerstvakantie: twee weken, vanaf de zaterdag op of vóór Eerste Kerstdag tot en met de tweede zondag daarna. Overige vakanties: vanaf de ingevulde zaterdag tot en met de zondag na het aantal weken. Werkdagen = maandag tot en met vrijdag in die perioden, zonder de gekozen feestdagen.',
    letop: 'De standaarddata zijn voorbeelddata voor schooljaar 2026–2027. De zomervakantie en de adviesdata voor herfst-, voorjaars- en meivakantie verschillen per regio (noord, midden, zuid) en scholen mogen soms afwijken: vul de actuele data van de Rijksoverheid en de school in. Controleer de kerstvakantie ook bij de school.'
  });
})(window.RT);
