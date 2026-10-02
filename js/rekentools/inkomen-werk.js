/* Rekenhulpen – groep "inkomen-werk" (Werk, inkomen en uitkering).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;

  RT.add({
    id: 'jaarinkomen', groep: 'inkomen-werk', naam: 'Jaarinkomen uit maandloon',
    intro: 'Van bruto maandloon naar bruto jaarinkomen met vakantiegeld, eindejaarsuitkering en vaste toeslagen, plus het uurloon.',
    velden: [
      { k: 'ml', l: 'Bruto maandloon', s: 'eur', std: 4100 },
      { k: 'tsl', l: 'Vaste toeslagen per maand', s: 'eur', std: 0, opt: true, tip: 'Bijvoorbeeld een vaste ploegentoeslag.' },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'ejr', l: 'Eindejaarsuitkering of 13e maand', s: 'pct', std: 0, opt: true, tip: 'Een volledige 13e maand is 8,33%.' },
      { k: 'u', l: 'Contracturen per week', s: 'num', na: 'uur', std: 38 }
    ],
    bereken(v) {
      const basis = v.ml * 12, tsl = v.tsl * 12;
      const vg = (basis + tsl) * v.vg / 100, ejr = basis * v.ejr / 100;
      const jaar = basis + tsl + vg + ejr;
      const uur = v.u > 0 ? v.ml / (v.u * 52 / 12) : NaN;
      return {
        lbl: 'Bruto jaarinkomen', groot: fmt.euro0(jaar), onder: 'gemiddeld ' + fmt.euro0(jaar / 12) + ' per maand',
        rijen: [
          ['Maandloon × 12', fmt.euro0(basis)],
          ['Vaste toeslagen × 12', fmt.euro0(tsl)],
          ['Vakantiegeld', fmt.euro0(vg)],
          ['Eindejaarsuitkering', fmt.euro0(ejr)],
          ['Bruto uurloon (zonder toeslagen)', fmt.euro(uur), 'som']
        ]
      };
    },
    uitleg: 'Jaarinkomen = 12 × (maandloon + toeslagen) × (1 + vakantiegeld) + 12 × maandloon × eindejaarspercentage. Uurloon = maandloon / (uren per week × 52 / 12).',
    letop: 'Of een toeslag of eindejaarsuitkering meetelt voor het toetsinkomen, bepaalt de geldverstrekker op basis van de werkgeversverklaring of het inkomensbepalingsdocument. Vakantiegeld kan over een andere grondslag worden berekend dan hier is aangenomen.'
  });
})(window.RT);
