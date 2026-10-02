/* Rekenhulpen – groep "pensioen-aow" (Pensioen en AOW).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { annHoofdsom, maandUitJaar } = RT.fin;

  RT.add({
    id: 'pensioentekort', groep: 'pensioen-aow', naam: 'Inleg voor een pensioentekort',
    intro: 'De klant komt na pensionering een bedrag per maand tekort. Welk kapitaal is daarvoor nodig, en wat moet er tot de pensioendatum per maand opzij?',
    velden: [
      { k: 'tk', l: 'Tekort per maand, in euro’s van nu', s: 'eur', std: 750 },
      { k: 'jt', l: 'Jaren tot de pensioendatum', s: 'num', na: 'jaar', std: 22 },
      { k: 'du', l: 'Duur van de aanvulling', s: 'num', na: 'jaar', std: 20 },
      { k: 'inf', l: 'Inflatie tot de pensioendatum', s: 'pct', std: 2 },
      { k: 'ro', l: 'Rendement tijdens het opbouwen', s: 'pct', std: 4 },
      { k: 'ru', l: 'Rendement tijdens het uitkeren', s: 'pct', std: 2.5 },
      { k: 'st', l: 'Al opgebouwd voor dit doel', s: 'eur', std: 15000, opt: true }
    ],
    bereken(v) {
      const nt = Math.round(v.jt * 12), nu = Math.round(v.du * 12);
      if (nt <= 0 || nu <= 0) return { fout: 'Vul een opbouw- en uitkeringsperiode groter dan nul in.' };
      const maand = v.tk * Math.pow(1 + v.inf / 100, v.jt);
      const iu = maandUitJaar(v.ru), io = maandUitJaar(v.ro);
      const kapitaal = annHoofdsom(maand, iu, nu) * (1 + iu);
      const g = Math.pow(1 + io, nt), factor = io === 0 ? nt : (g - 1) / io * (1 + io);
      const inleg = Math.max(0, (kapitaal - v.st * g) / factor);
      return {
        lbl: 'Benodigde inleg per maand', groot: fmt.euro(inleg), onder: 'gedurende ' + fmt.duur(nt) + ', vóór belasting en kosten',
        rijen: [
          ['Tekort per maand op de pensioendatum', fmt.euro0(maand)],
          ['Benodigd kapitaal op de pensioendatum', fmt.euro0(kapitaal)],
          ['Huidig bedrag groeit tot', fmt.euro0(v.st * g)],
          ['Totaal nog in te leggen', fmt.euro0(inleg * nt), 'som']
        ],
        signalen: ['De aanvulling is een vast bedrag: na de pensioendatum daalt de koopkracht ervan door inflatie.']
      };
    },
    uitleg: 'Tekort op pensioendatum = tekort × (1 + inflatie)<sup>jaren</sup>. Kapitaal = maandbedrag × (1 − (1 + i<sub>u</sub>)<sup>−n</sup>) / i<sub>u</sub> × (1 + i<sub>u</sub>), uitkering aan het begin van de maand. Inleg = (kapitaal − huidig bedrag × (1 + i<sub>o</sub>)<sup>m</sup>) / (((1 + i<sub>o</sub>)<sup>m</sup> − 1) / i<sub>o</sub> × (1 + i<sub>o</sub>)). Maandrendementen afgeleid van de jaarrendementen.',
    letop: 'Of het tekort bruto of netto is, bepaalt welk kapitaal nodig is: belasting op de uitkering en een eventuele fiscale aftrek van de inleg (jaarruimte, lijfrente) zijn hier niet meegenomen. Controleer de pensioenopbouw via het pensioenoverzicht en de actuele AOW-leeftijd.'
  });
})(window.RT);
