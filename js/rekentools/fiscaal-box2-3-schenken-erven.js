/* Rekenhulpen – groep "fiscaal-box2-3-schenken-erven" (Box 2, box 3, schenken en erven).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;

  RT.add({
    id: 'erfdeel', groep: 'fiscaal-box2-3-schenken-erven', naam: 'Erfdelen bij de wettelijke verdeling',
    intro: 'Zonder testament krijgt de langstlevende partner de goederen en de kinderen een geldvordering. Hoe groot is ieders erfdeel?',
    velden: [
      { k: 'p', l: 'Is er een langstlevende echtgenoot of geregistreerd partner?', s: 'keuze', opties: [['ja', 'Ja'], ['nee', 'Nee']], std: 'ja', breed: true },
      { k: 'gem', l: 'Gemeenschappelijk vermogen (netto)', s: 'eur', std: 520000, opt: true, tip: 'Bezittingen min schulden in de gemeenschap; de helft valt in de nalatenschap.' },
      { k: 'priv', l: 'Privévermogen van de overledene (netto)', s: 'eur', std: 0, opt: true },
      { k: 'uv', l: 'Uitvaartkosten', s: 'eur', std: 9500, opt: true },
      { k: 'kn', l: 'Aantal kinderen', s: 'num', std: 2, tip: 'Kinderen van de overledene; een vooroverleden kind wordt vervangen door zijn kinderen.' }
    ],
    bereken(v) {
      const kn = Math.round(v.kn), partner = v.p === 'ja';
      const delers = kn + (partner ? 1 : 0);
      if (kn < 0) return { fout: 'Het aantal kinderen kan niet negatief zijn.' };
      if (!delers) return { fout: 'Zonder partner en kinderen erven andere familieleden; die verdeling valt buiten deze rekenhulp.' };
      const nal = (partner ? v.gem / 2 : v.gem) + v.priv - v.uv;
      if (nal <= 0) return { lbl: 'Erfdeel per erfgenaam', groot: fmt.euro0(0), onder: 'de nalatenschap is niet positief', rijen: [['Saldo nalatenschap', fmt.euro0(nal)]] };
      const deel = nal / delers;
      const rijen = [['Saldo nalatenschap', fmt.euro0(nal)], ['Aantal erfgenamen', fmt.getal(delers)]];
      if (partner && kn) rijen.push(['Erfdeel partner', fmt.euro0(deel)], ['Geldvordering per kind', fmt.euro0(deel)], ['Totaal vorderingen kinderen', fmt.euro0(deel * kn), 'som']);
      else rijen.push(['Erfdeel ' + (partner ? 'partner' : 'per kind'), fmt.euro0(deel), 'som']);
      return {
        lbl: 'Erfdeel per erfgenaam', groot: fmt.euro0(deel), onder: partner && kn ? 'de kinderen krijgen dit als niet-opeisbare geldvordering' : 'zonder testament',
        rijen,
        signalen: partner && kn ? ['De partner krijgt alle goederen en wordt schuldenaar van de kinderen. De vorderingen zijn in de regel pas opeisbaar bij overlijden of faillissement van de partner.'] : []
      };
    },
    uitleg: 'Nalatenschap = helft van het gemeenschappelijke vermogen (bij een partner) + privévermogen − uitvaartkosten. Erfdeel = nalatenschap / (partner + aantal kinderen). Zonder partner telt hier het volledige ingevulde vermogen.',
    letop: 'Een testament, huwelijkse voorwaarden of een beperkte gemeenschap kunnen de uitkomst volledig veranderen. Erfbelasting, de rente over de vorderingen en de uitkering uit een overlijdensrisicoverzekering zijn hier niet berekend; zie ook <a href="orv.html">Overlijdensrisico</a>. Laat de verdeling bevestigen door de notaris.'
  });
})(window.RT);
