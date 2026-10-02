/* Rekenhulpen – groep "verzekeringen" (Verzekeringen en risico).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const { JANEE } = RT.keuzes;
  const NR = RT.normen, F = RT.fisc;

  /* Jaarlijks wisselende of wettelijke bedragen die (nog) niet in normen.js staan.
   * Peildatum 2026 – gecontroleerd op 2026-10-02. */
  const N = {
    peildatum: '2026',
    // Vrijstelling kapitaalverzekering met overgangsrecht (polis van vóór 15 september 1999): € 123.428 p.p. (€ 246.856 met partner) –
    // bevestigd (Belastingdienst, niet-vrijgesteld deel kapitaalverzekeringen)
    vrijstellingOudePolis: 123428,
    // Minimum aantal premiejaren voor de vrijstelling – niet bevestigd
    minPremiejaren: 15
  };

  /* Aannames voor het eigen, vereenvoudigde puntenmodel inboedel (geen inboedelwaardemeter van een verzekeraar).
   * Waarde per punt en standaarddekkingen: waarde uit bron, niet geverifieerd. */
  const INBOEDEL = {
    waardePerPunt: 1250, dekkingSieraden: 6000, dekkingKunst: 15000,
    inkomenPerPunt: 450, inkomenMax: 14, inkomenMin: 2,          // netto maandinkomen
    leeftijd: [[30, 3], [40, 6], [50, 8], [70, 9], [Infinity, 7]], // [tot leeftijd, punten]
    persoonBasis: 2, perPersoon: 1.5, personenMax: 8,
    m2PerPunt: 18, oppervlakMax: 12
  };

  const G = 'verzekeringen';
  const pos = x => Math.max(0, x);
  const INDICATIEF = 'Indicatief: de gebruikte norm is een werkwaarde voor ' + NR.peildatum + ' die nog niet is geverifieerd. Controleer de actuele norm';

  /* ---------- arbeidsongeschiktheidsverzekering ---------- */

  RT.add({
    id: 'aov-premie-netto', groep: G, naam: 'Netto premie AOV (arbeidsongeschiktheid)',
    intro: 'Wat kost een AOV een ondernemer netto, nu de premie aftrekbaar is als uitgave voor inkomensvoorziening?',
    kw: 'aov arbeidsongeschiktheidsverzekering arbeidsongeschiktheid premie aftrek netto zzp ondernemer inkomensvoorziening',
    peildatum: NR.peildatum, fiscaal: ['Tarieven box 1', 'Heffingskortingen', 'Zelfstandigenaftrek', 'Mkb-winstvrijstelling'],
    velden: [
      { k: 'p', l: 'Bruto premie per jaar', s: 'eur', std: 4200 },
      { k: 'w', l: 'Winst uit onderneming', s: 'eur', std: 85000 },
      { k: 'uk', l: 'Verzekerde uitkering per jaar', s: 'eur', std: 40000, opt: true },
      { k: 'uren', l: 'Voldoet aan het urencriterium?', s: 'keuze', opties: JANEE, std: 'ja' }
    ],
    bereken(v) {
      const opt = { urencriterium: v.uren === 'ja' };
      const zonder = F.ondernemer(v.w, opt), met = F.ondernemer(v.w, Object.assign({ aftrek: v.p }, opt));
      const voordeel = zonder.heffing - met.heffing, netto = v.p - voordeel;
      return {
        lbl: 'Netto premie per jaar', groot: fmt.euro0(netto), onder: fmt.euro(netto / 12) + ' per maand',
        rijen: [
          ['Belastingvoordeel', fmt.euro0(voordeel)],
          ['Effectief aftrektarief', fmt.pct(v.p > 0 ? voordeel / v.p * 100 : NaN, 2)],
          ['Bruto premie in procenten van de winst', fmt.pct(v.w > 0 ? v.p / v.w * 100 : NaN, 2)],
          ['Netto premie per € 1.000 verzekerde uitkering', v.uk > 0 ? fmt.euro(netto / v.uk * 1000) : '–', 'som']
        ]
      };
    },
    uitleg: 'Inkomstenbelasting over de winst (na zelfstandigenaftrek en mkb-winstvrijstelling) wordt twee keer berekend: zonder en met de premie als aftrekpost. Het verschil is het belastingvoordeel; netto premie = bruto premie − voordeel. Heffingskortingen en de afbouw daarvan rekenen mee.',
    letop: INDICATIEF + '. Alleen een AOV die voldoet aan de voorwaarden voor een uitgave voor inkomensvoorziening is aftrekbaar; de uitkering is dan belast. Ander inkomen, de partner en de Zvw-bijdrage zijn niet meegenomen. <b>Compliance:</b> de keuze voor dekking, eigenrisicotermijn en eindleeftijd vraagt een adviesgesprek; deze hulp toetst alleen de kosten.'
  });

  RT.add({
    id: 'aov-uitkering-netto', groep: G, naam: 'Netto AOV-uitkering',
    intro: 'Hoeveel blijft er netto over van een uitkering uit een arbeidsongeschiktheidsverzekering?',
    kw: 'aov uitkering netto arbeidsongeschikt belasting zvw ondernemer',
    peildatum: NR.peildatum, fiscaal: ['Tarieven box 1', 'Algemene heffingskorting', 'Zvw-bijdrage ondernemer'],
    velden: [
      { k: 'u', l: 'Bruto uitkering per jaar', s: 'eur', std: 40000 },
      { k: 'ov', l: 'Overig belastbaar inkomen (geen arbeid)', s: 'eur', std: 0, opt: true },
      { k: 'aow', l: 'AOW-leeftijd bereikt?', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const tot = v.u + (v.ov || 0), aow = v.aow === 'ja';
      const r = F.netto(tot, { arbeid: 0, aow });
      const zvw = Math.min(tot, NR.ondernemer.zvwMaxInkomen) * NR.ondernemer.zvwPct / 100;
      const netto = tot - r.heffing - zvw;
      // toerekening aan de uitkering: alles boven het overige inkomen
      const alleenOv = (v.ov || 0) > 0 ? F.netto(v.ov, { arbeid: 0, aow }).heffing + Math.min(v.ov, NR.ondernemer.zvwMaxInkomen) * NR.ondernemer.zvwPct / 100 : 0;
      const nettoUitk = v.u - (r.heffing + zvw - alleenOv);
      return {
        lbl: 'Netto uitkering per maand', groot: fmt.euro0(nettoUitk / 12), onder: fmt.euro0(nettoUitk) + ' per jaar',
        rijen: [
          ['Inkomstenbelasting (na heffingskortingen)', fmt.euro0(r.heffing)],
          ['Inkomensafhankelijke bijdrage Zvw', fmt.euro0(zvw)],
          ['Netto totaal inkomen per jaar', fmt.euro0(netto)],
          ['Netto deel van de uitkering', fmt.pct(v.u > 0 ? nettoUitk / v.u * 100 : NaN, 1), 'som']
        ]
      };
    },
    uitleg: 'De uitkering is belast in box 1 als inkomen uit vroegere arbeid: wel algemene heffingskorting (en ouderenkorting na de AOW-leeftijd), geen arbeidskorting. Daarnaast is de inkomensafhankelijke bijdrage Zvw verschuldigd tot het maximum bijdrage-inkomen. Bij overig inkomen wordt het verschil in belasting en bijdrage aan de uitkering toegerekend.',
    letop: INDICATIEF + '. De verzekeraar houdt meestal loonheffing in; het werkelijke netto bedrag volgt uit de aangifte. Een uitkering van een niet-aftrekbare (box 3-)AOV is onbelast. Toeslagen en de partner zijn niet meegenomen.'
  });

  /* ---------- kapitaalverzekeringen ---------- */

  RT.add({
    id: 'kapitaalverzekering-eigen-woning', groep: G, naam: 'Uitkering kapitaalverzekering eigen woning',
    intro: 'Hoeveel belasting is verschuldigd over de uitkering van een kapitaalverzekering of spaarrekening eigen woning (KEW, SEW of BEW)?',
    kw: 'kew sew bew kapitaalverzekering eigen woning spaarhypotheek bankspaarhypotheek vrijstelling rentebestanddeel overgangsrecht',
    peildatum: NR.peildatum, fiscaal: ['Vrijstelling kapitaalverzekering eigen woning', 'Tarief box 1'],
    velden: [
      { k: 'u', l: 'Uitkering', s: 'eur', std: 230000 },
      { k: 'prem', l: 'Totaal betaalde premies of inleg', s: 'eur', std: 140000 },
      { k: 'jr', l: 'Aantal jaren premie of inleg betaald', s: 'num', na: 'jaar', std: 18 },
      { k: 'eerder', l: 'Eerder gebruikte vrijstelling', s: 'eur', std: 0, opt: true, tip: 'De vrijstelling geldt eenmaal per persoon (en per partner).' },
      { k: 'tar', l: 'Tarief waartegen het rentebestanddeel wordt belast', s: 'pct', std: NR.box1.tarief2 }
    ],
    bereken(v) {
      if (!(v.u > 0)) return { fout: 'Vul de uitkering in.' };
      const rente = pos(v.u - v.prem);
      const vrij = pos(NR.eigenWoning.kewVrijstelling - (v.eerder || 0));
      const eis = v.jr >= N.minPremiejaren;
      // boven de vrijstelling: het rentebestanddeel naar verhouding belast
      const belast = eis ? pos(v.u - vrij) * rente / v.u : rente;
      const heffing = belast * v.tar / 100;
      return {
        lbl: 'Belasting over de uitkering', groot: fmt.euro0(heffing), onder: 'netto uitkering ' + fmt.euro0(v.u - heffing),
        rijen: [
          ['Rentebestanddeel (uitkering − premies)', fmt.euro0(rente)],
          ['Beschikbare vrijstelling', fmt.euro0(vrij)],
          ['Minimaal ' + N.minPremiejaren + ' jaar premie betaald', eis ? 'ja' : 'nee: geen vrijstelling'],
          ['Belast rentebestanddeel', fmt.euro0(belast), 'som']
        ],
        signalen: eis ? [] : ['Zonder voldoende premiejaren is het hele rentebestanddeel belast. Controleer ook de overige voorwaarden (bandbreedte van de premies, aflossing van de eigenwoningschuld).']
      };
    },
    uitleg: 'Rentebestanddeel = uitkering − betaalde premies. Is aan de looptijdeis voldaan, dan is de uitkering vrijgesteld tot de vrijstelling; boven de vrijstelling is het rentebestanddeel naar verhouding belast: (uitkering − vrijstelling) × rentebestanddeel / uitkering. Zonder vrijstelling is het hele rentebestanddeel belast tegen het ingevulde tarief.',
    letop: INDICATIEF + '. Dit product kan sinds 2013 niet meer nieuw worden afgesloten; het gaat om bestaande polissen en rekeningen onder overgangsrecht. De hoogte van de vrijstelling hangt ook af van de looptijd (15 of 20 jaar) en de uitkering moet worden gebruikt om de eigenwoningschuld af te lossen. <b>Compliance:</b> controleer de polisvoorwaarden en de fiscale status (oud of nieuw regime) bij de verzekeraar of bank voordat de uitkomst in een adviesrapport komt.'
  });

  RT.add({
    id: 'kapitaalverzekering-box3', groep: G, naam: 'Kapitaalverzekering in box 3',
    intro: 'Is de uitkering van een kapitaalverzekering buiten de eigen woning belast? Meestal niet, behalve bij oude polissen met overgangsrecht.',
    kw: 'kapitaalverzekering box 3 uitkering overgangsrecht 1999 rentebestanddeel vrijstelling',
    peildatum: N.peildatum, fiscaal: ['Vrijstelling oude kapitaalverzekering', 'Tarief box 1', 'Forfaits box 3'],
    velden: [
      { k: 'u', l: 'Uitkering', s: 'eur', std: 85000 },
      { k: 'prem', l: 'Betaalde premies', s: 'eur', std: 55000 },
      { k: 'oud', l: 'Polis met overgangsrecht (afgesloten vóór 15 september 1999)?', s: 'keuze', opties: JANEE, std: 'nee', breed: true },
      { k: 'jr', l: 'Aantal premiejaren', s: 'num', na: 'jaar', std: 22, als: v => v.oud === 'ja' },
      { k: 'tar', l: 'Tarief waartegen het rentebestanddeel wordt belast', s: 'pct', std: NR.box1.tarief2, als: v => v.oud === 'ja' }
    ],
    bereken(v) {
      const rente = pos(v.u - v.prem);
      const b3 = NR.box3, forfait = b3.forfaitOverig, b3jaar = v.u * forfait / 100 * b3.tarief / 100;
      const rij3 = ['Indicatie box 3-heffing over deze waarde per jaar (boven het heffingsvrij vermogen)', fmt.euro0(b3jaar)];
      if (v.oud !== 'ja') {
        return {
          lbl: 'Belasting bij uitkering', groot: fmt.euro0(0), onder: 'de waarde viel jaarlijks in box 3',
          rijen: [['Rentebestanddeel', fmt.euro0(rente)], rij3, ['Netto uitkering', fmt.euro0(v.u), 'som']]
        };
      }
      const eis = v.jr >= N.minPremiejaren;
      const belast = eis ? (v.u > 0 ? pos(v.u - N.vrijstellingOudePolis) * rente / v.u : 0) : rente;
      const heffing = belast * v.tar / 100;
      return {
        lbl: 'Belasting bij uitkering', groot: fmt.euro0(heffing), onder: 'polis met overgangsrecht',
        rijen: [
          ['Rentebestanddeel', fmt.euro0(rente)],
          ['Vrijstelling oude polis', fmt.euro0(N.vrijstellingOudePolis)],
          ['Minimaal ' + N.minPremiejaren + ' jaar premie betaald', eis ? 'ja' : 'nee'],
          ['Belast rentebestanddeel', fmt.euro0(belast)],
          ['Netto uitkering', fmt.euro0(v.u - heffing), 'som']
        ]
      };
    },
    uitleg: 'Een gewone kapitaalverzekering hoort tijdens de looptijd bij de bezittingen in box 3 (forfait overige bezittingen); de uitkering zelf is dan onbelast. Bij een polis met overgangsrecht is het rentebestanddeel (uitkering − premies) in box 1 belast voor zover de uitkering boven de vrijstelling uitkomt en aan de premie-eisen is voldaan; anders is het hele rentebestanddeel belast.',
    letop: INDICATIEF + ' bij de Belastingdienst. Het overgangsrecht geldt alleen voor polissen die vóór 15 september 1999 zijn afgesloten en daarna niet wezenlijk zijn gewijzigd; controleer de polisdatum en de voorwaarden. De box 3-indicatie rekent met het forfait voor overige bezittingen en het box 3-tarief, zonder heffingsvrij vermogen en zonder tegenbewijsregeling.'
  });

  /* ---------- uitvaart en inboedel ---------- */

  RT.add({
    id: 'uitvaartkosten', groep: G, naam: 'Uitvaartkosten en dekking',
    intro: 'Wat kost een crematie of begrafenis ongeveer, en is de uitvaartverzekering of het spaargeld daarvoor toereikend?',
    kw: 'uitvaart begrafenis crematie kosten uitvaartverzekering dekking',
    velden: [
      { k: 's', l: 'Soort uitvaart', s: 'keuze', std: 'crem', opties: [['crem', 'Crematie'], ['begr', 'Begrafenis']] },
      { k: 'verz', l: 'Uitvaartverzorging en vervoer', s: 'eur', std: 3400 },
      { k: 'kist', l: 'Kist of baar', s: 'eur', std: 1100 },
      { k: 'crem', l: 'Crematorium en asbestemming', s: 'eur', std: 1500, als: v => v.s === 'crem' },
      { k: 'graf', l: 'Graf, grafrechten en begraven', s: 'eur', std: 4200, als: v => v.s === 'begr' },
      { k: 'mon', l: 'Grafmonument', s: 'eur', std: 3000, als: v => v.s === 'begr' },
      { k: 'ontv', l: 'Condoleance, catering, kaarten en bloemen', s: 'eur', std: 2200 },
      { k: 'ov', l: 'Overige kosten', s: 'eur', std: 500, opt: true },
      { k: 'dek', l: 'Verzekerd bedrag of gereserveerd geld', s: 'eur', std: 7500 }
    ],
    bereken(v) {
      const specifiek = v.s === 'crem' ? v.crem : v.graf + v.mon;
      const tot = v.verz + v.kist + v.ontv + (v.ov || 0) + specifiek;
      const tekort = tot - v.dek;
      return {
        lbl: tekort > 0 ? 'Tekort op de dekking' : 'Overschot op de dekking', groot: fmt.euro0(Math.abs(tekort)), onder: 'totale kosten ' + fmt.euro0(tot),
        rijen: [
          ['Algemene kosten', fmt.euro0(tot - specifiek)],
          [v.s === 'crem' ? 'Crematie' : 'Graf en monument', fmt.euro0(specifiek)],
          ['Dekking', fmt.euro0(v.dek)],
          ['Dekkingsgraad', fmt.pct(tot > 0 ? v.dek / tot * 100 : NaN, 0), 'som']
        ],
        signalen: tekort > 0 ? ['De dekking is ' + fmt.euro0(tekort) + ' lager dan de geraamde kosten. Bij een naturaverzekering geldt het pakket, niet een bedrag: vergelijk dan het pakket met de wensen.'] : []
      };
    },
    uitleg: 'Totaal = uitvaartverzorging + kist + ontvangst en drukwerk + overige kosten + (crematie, of graf en monument). Tekort = totaal − verzekerd of gereserveerd bedrag.',
    letop: 'De standaardbedragen zijn indicaties; tarieven van crematoria en begraafplaatsen verschillen sterk per gemeente, en grafrechten moeten vaak na een termijn worden verlengd. Uitvaartkosten zijn aftrekbaar van de nalatenschap voor de erfbelasting. Kapitaalverzekeringen voor de uitvaart zijn vrijgesteld in box 3 tot een maximum.'
  });

  const puntenInboedel = v => {
    const I = INBOEDEL;
    const pInk = Math.min(I.inkomenMax, Math.max(I.inkomenMin, Math.round(v.ink / I.inkomenPerPunt)));
    const pLft = I.leeftijd.find(([tot]) => v.lft < tot)[1];
    const pPers = Math.min(I.personenMax, I.persoonBasis + pos(Math.round(v.pers) - 1) * I.perPersoon);
    const pOpp = Math.min(I.oppervlakMax, Math.round(v.opp / I.m2PerPunt));
    return { pInk, pLft, pPers, pOpp, totaal: pInk + pLft + pPers + pOpp };
  };

  RT.add({
    id: 'inboedel-puntenmodel', groep: G, naam: 'Inboedelwaarde (puntenmodel)',
    intro: 'Een snelle schatting van de te verzekeren inboedelwaarde met een eenvoudig puntenmodel, plus een check op sieraden en kunst boven de standaarddekking.',
    kw: 'inboedel inboedelwaarde onderverzekering inboedelverzekering sieraden kunst punten',
    velden: [
      { k: 'ink', l: 'Netto maandinkomen huishouden', s: 'eur', std: 4200 },
      { k: 'lft', l: 'Leeftijd hoofdbewoner', s: 'num', na: 'jaar', std: 44 },
      { k: 'pers', l: 'Aantal personen', s: 'num', std: 4 },
      { k: 'opp', l: 'Woonoppervlak', s: 'num', na: 'm²', std: 135 },
      { k: 'pp', l: 'Waarde per punt', s: 'eur', std: INBOEDEL.waardePerPunt },
      { k: 'extra', l: 'Bijzondere bezittingen (dure elektronica, tuininboedel)', s: 'eur', std: 4000, opt: true, breed: true },
      { k: 'sier', l: 'Sieraden', s: 'eur', std: 3000, opt: true },
      { k: 'kunst', l: 'Kunst en verzamelingen', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const p = puntenInboedel(v);
      const basis = p.totaal * v.pp, som = basis + (v.extra || 0);
      const boveSier = pos((v.sier || 0) - INBOEDEL.dekkingSieraden), boveKunst = pos((v.kunst || 0) - INBOEDEL.dekkingKunst);
      const sig = [];
      if (boveSier) sig.push('Sieraden liggen ' + fmt.euro0(boveSier) + ' boven de aangenomen standaarddekking: overweeg aanvullende dekking.');
      if (boveKunst) sig.push('Kunst en verzamelingen liggen ' + fmt.euro0(boveKunst) + ' boven de aangenomen standaarddekking.');
      return {
        lbl: 'Indicatieve verzekerde som', groot: fmt.euro0(som), onder: fmt.getal(p.totaal, 1) + ' punten × ' + fmt.euro0(v.pp) + (v.extra ? ' + bijzondere bezittingen' : ''),
        rijen: [
          ['Punten inkomen', fmt.getal(p.pInk)],
          ['Punten leeftijd', fmt.getal(p.pLft)],
          ['Punten huishouden', fmt.getal(p.pPers, 1)],
          ['Punten woonoppervlak', fmt.getal(p.pOpp)],
          ['Basiswaarde', fmt.euro0(basis), 'som']
        ],
        signalen: sig
      };
    },
    uitleg: 'Punten: inkomen (1 punt per ' + fmt.euro0(INBOEDEL.inkomenPerPunt) + ' netto per maand, ' + INBOEDEL.inkomenMin + ' tot ' + INBOEDEL.inkomenMax + '), leeftijd (3 tot 9 punten, hoogst tussen 50 en 70 jaar), huishouden (' + INBOEDEL.persoonBasis + ' punten plus ' + fmt.getal(INBOEDEL.perPersoon, 1) + ' per extra persoon, maximaal ' + INBOEDEL.personenMax + ') en oppervlak (1 punt per ' + INBOEDEL.m2PerPunt + ' m², maximaal ' + INBOEDEL.oppervlakMax + '). Verzekerde som = punten × waarde per punt + bijzondere bezittingen.',
    letop: 'Dit is een eigen, vereenvoudigd puntenmodel met aangenomen waarden, geen inboedelwaardemeter van een verzekeraar. Alleen een ingevulde meter van de verzekeraar geeft garantie tegen onderverzekering. Maxima voor sieraden en kunst verschillen per polis (de gebruikte ' + fmt.euro0(INBOEDEL.dekkingSieraden) + ' en ' + fmt.euro0(INBOEDEL.dekkingKunst) + ' zijn aannames).'
  });
})(window.RT);
