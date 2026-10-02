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
})(window.RT);
