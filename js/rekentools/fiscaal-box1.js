/* Rekenhulpen – groep "fiscaal-box1" (Inkomstenbelasting en toeslagen).
 * Elk groepbestand is zelfstandig te bewerken; registreer nieuwe hulpen met RT.add({...}).
 * API en helpers: zie js/rekentools/engine.js. Normen en fiscale rekenkern: js/rekentools/normen.js (RT.normen, RT.fisc).
 * Na wijzigen: node tools/build-rekentools-index.js
 */
(function (RT) {
  'use strict';
  const { fmt } = RT;
  const N = RT.normen, F = RT.fisc;
  const PEIL = N.peildatum;
  const pos = x => Math.max(0, x);

  /* ---------- normen die (nog) niet in normen.js staan ----------
   * Peildatum 2026. Waarde uit bron, niet geverifieerd: controleer bij Belastingdienst/Dienst Toeslagen
   * vóór gebruik. Hulpen die deze waarden gebruiken noemen dat in 'Let op' en tonen de fiscale badge. */
  const EIGEN = {
    peildatum: '2026',
    // Bijtelling auto van de zaak (waarde uit bron, niet geverifieerd)
    bijtelling: { algemeen: 22, elektrisch: 17, capElektrisch: 30000, youngtimer: 35 },
    // Bijtelling fiets van de zaak, percentage van de adviesprijs (waarde uit bron, niet geverifieerd)
    fiets: { pct: 7 },
    // Zorgtoeslag, bedragen per jaar (waarde uit bron, niet geverifieerd)
    zorgtoeslag: { maxAlleen: 1800, maxPartners: 3450, drempel: 25200, afbouwAlleen: 13.67, afbouwPartners: 13.67, vermogenAlleen: 141896, vermogenPartners: 179429 },
    // Huurtoeslag, bedragen per maand behalve inkomen en vermogen (waarde uit bron, niet geverifieerd;
    // vermogenPartners = 2 × alleenstaand, eigen afleiding, niet geverifieerd)
    huurtoeslag: { eigenBijdrageMin: 242, drempel: 19000, afbouwPct: 24, kwaliteitsgrens: 477, aftop12: 683, aftop3: 732, huurgrens: 900, vermogenAlleen: 37395, vermogenPartners: 74790 },
    // Kindgebonden budget, bedragen per jaar (waarde uit bron, niet geverifieerd)
    kgb: { perKind: 1700, toeslag12: 290, toeslag16: 520, alleenstaandeOuderKop: 3480, grensAlleen: 29400, grensPartners: 48600, afbouwPct: 6.75 },
    // Kinderopvangtoeslag (waarde uit bron, niet geverifieerd); percentages = indicatie, de echte tabel loopt met het inkomen
    kot: { pctEerste: 72, pctVolgende: 93, maxDag: 10.71, maxBso: 9.12, maxGast: 7.94, maxUren: 140 },
    // Middeling (regeling vervallen; laatste tijdvak 2022–2024): drempel (waarde uit bron, niet geverifieerd)
    middeling: { drempel: 545 }
  };

  /* ---------- gedeelde stukjes ---------- */
  const JANEE = RT.keuzes.JANEE;
  const AOWK = [['nee', 'Nee'], ['samen', 'Ja, met partner'], ['alleen', 'Ja, alleenstaand']];
  const aowOpt = s => ({ aow: s !== 'nee', alleenstaand: s === 'alleen' });
  const SOORT = [['arbeid', 'Loon uit dienstbetrekking'], ['uitk', 'Uitkering of pensioen']];
  const IB = ['box 1-schijven', 'algemene heffingskorting', 'arbeidskorting', 'combinatiekorting', 'ouderenkorting'];
  const BRUTONETTO = 'Netto = bruto (min eventuele aftrekposten) − belasting. Belasting = schijventarief over het belastbaar inkomen − algemene heffingskorting − arbeidskorting (alleen over inkomen uit werk) − combinatiekorting en ouderenkorting als die van toepassing zijn. Kortingen worden niet hoger dan de belasting zelf.';
  const LETOP_IB = 'Indicatieve jaarberekening met normen ' + PEIL + ' (nog niet allemaal geverifieerd; zie Gebruikte fiscale normen). De loonheffing per maand kan afwijken door de loonbelastingtabellen en de loonheffingskorting; het verschil volgt bij de aangifte. Premies werknemersverzekeringen, de Zvw-bijdrage van de werkgever en toeslagen zijn niet meegenomen.';
  const LETOP_EIGEN = 'Indicatief: deze hulp rekent met eigen werkwaarden ' + EIGEN.peildatum + ' die niet in het centrale normenbestand staan en niet zijn geverifieerd. Controleer de actuele norm bij de Belastingdienst of Dienst Toeslagen.';

  // Kernrijen van een F.netto-uitkomst
  function kortingRijen(r) {
    const k = r.kortingen, rijen = [['Belasting vóór kortingen', fmt.euro0(r.belastingVoorKorting)], ['Algemene heffingskorting', '− ' + fmt.euro0(k.ahk)]];
    if (k.arbeidskorting > 0) rijen.push(['Arbeidskorting', '− ' + fmt.euro0(k.arbeidskorting)]);
    if (k.iack > 0) rijen.push(['Combinatiekorting', '− ' + fmt.euro0(k.iack)]);
    if (k.ouderenkorting > 0) rijen.push(['Ouderenkorting', '− ' + fmt.euro0(k.ouderenkorting)]);
    rijen.push(['Te betalen belasting', fmt.euro0(r.heffing)]);
    return rijen;
  }
  const verlorenKorting = r => r.kortingTotaal > r.belastingVoorKorting + 0.5
    ? ['Er is meer heffingskorting dan belasting: ' + fmt.euro0(r.kortingTotaal - r.belastingVoorKorting) + ' korting gaat verloren (wordt niet uitbetaald).'] : [];

  // Toeslagen (indicatief, eigen werkwaarden)
  function zorgtoeslag(ink, partner, verm) {
    const z = EIGEN.zorgtoeslag;
    const max = partner ? z.maxPartners : z.maxAlleen, afb = partner ? z.afbouwPartners : z.afbouwAlleen, vg = partner ? z.vermogenPartners : z.vermogenAlleen;
    const afbouw = pos(ink - z.drempel) * afb / 100;
    const teVeel = verm > vg;
    return { max, afbouw, teVeel, vg, bedrag: teVeel ? 0 : pos(max - afbouw), nulVanaf: z.drempel + max / (afb / 100) };
  }
  function huurtoeslag(huur, ink, pers, partner, verm) {
    const h = EIGEN.huurtoeslag;
    const vg = partner ? h.vermogenPartners : h.vermogenAlleen;
    const aft = pers >= 3 ? h.aftop3 : h.aftop12;
    const eigen = h.eigenBijdrageMin + pos(ink - h.drempel) * h.afbouwPct / 100 / 12;
    const d1 = pos(Math.min(huur, h.kwaliteitsgrens) - eigen);
    const d2 = pos(Math.min(huur, aft) - Math.max(eigen, h.kwaliteitsgrens));
    const d3 = pos(Math.min(huur, h.huurgrens) - Math.max(eigen, aft));
    const geen = huur > h.huurgrens ? 'huur' : verm > vg ? 'vermogen' : '';
    const bedrag = geen ? 0 : d1 + d2 * 0.65 + d3 * 0.40;
    return { eigen, d1, d2, d3, aft, vg, geen, bedrag };
  }
  function kgb(k1, k2, k3, ink, alleen) {
    const g = EIGEN.kgb, n = k1 + k2 + k3;
    const max = n ? n * g.perKind + k2 * g.toeslag12 + k3 * g.toeslag16 + (alleen ? g.alleenstaandeOuderKop : 0) : 0;
    const grens = alleen ? g.grensAlleen : g.grensPartners;
    const afbouw = pos(ink - grens) * g.afbouwPct / 100;
    return { n, max, grens, afbouw, bedrag: pos(max - afbouw), nulVanaf: grens + max / (g.afbouwPct / 100) };
  }

  /* =================== Inkomstenbelasting box 1 =================== */

  RT.add({
    id: 'inkomstenbelasting-box1', groep: 'fiscaal-box1', naam: 'Box 1: belasting over het jaarinkomen',
    intro: 'Hoeveel inkomstenbelasting (inclusief premie volksverzekeringen) hoort bij een belastbaar inkomen in box 1, na de heffingskortingen?',
    kw: 'inkomstenbelasting box 1 schijven tarief heffingskorting arbeidskorting',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'ink', l: 'Belastbaar inkomen box 1', s: 'eur', std: 60000 },
      { k: 'arb', l: 'Waarvan inkomen uit werk', s: 'eur', std: 60000, tip: 'Loon of winst; telt voor de arbeidskorting. Zet op 0 bij alleen uitkering of pensioen.' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      if (v.arb > v.ink) return { fout: 'Het inkomen uit werk kan niet hoger zijn dan het totale belastbare inkomen.' };
      const o = Object.assign(aowOpt(v.aow), { arbeid: v.arb, kind: v.kind === 'ja' });
      const r = F.netto(v.ink, o), b = N.box1, t1 = o.aow ? b.tarief1Aow : b.tarief1;
      return {
        lbl: 'Te betalen inkomstenbelasting', groot: fmt.euro0(r.heffing), onder: 'per jaar, na heffingskortingen',
        rijen: kortingRijen(r).concat([
          ['Netto inkomen per jaar', fmt.euro0(r.netto), 'som'],
          ['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1)],
          ['Schijftarief over de laatste euro', fmt.pct(r.schijfTarief)],
          ['Marginale druk incl. afbouw kortingen', fmt.pct(F.marginaleDruk(v.ink, o), 1)]
        ]),
        tabel: { titel: 'Belasting per schijf', kop: ['Schijf', 'Inkomen', 'Tarief', 'Belasting'], rijen: [
          ['1', fmt.euro0(r.schijven[0]), fmt.pct(t1), fmt.euro0(r.schijven[0] * t1 / 100)],
          ['2', fmt.euro0(r.schijven[1]), fmt.pct(b.tarief2), fmt.euro0(r.schijven[1] * b.tarief2 / 100)],
          ['3', fmt.euro0(r.schijven[2]), fmt.pct(b.tarief3), fmt.euro0(r.schijven[2] * b.tarief3 / 100)]
        ] },
        signalen: verlorenKorting(r)
      };
    },
    uitleg: 'Het belastbaar inkomen wordt over drie schijven verdeeld (eerste schijf tot ' + fmt.euro0(N.box1.schijf1Grens) + ', tweede tot ' + fmt.euro0(N.box1.schijf2Grens) + '). De som van schijf × tarief is de belasting vóór kortingen. Daarvan gaan de algemene heffingskorting (afbouw met het inkomen), de arbeidskorting over het inkomen uit werk en eventueel combinatie- en ouderenkorting af. Marginale druk = extra belasting over € 100 meer inkomen, inclusief afbouw van kortingen.',
    letop: LETOP_IB + ' Vanaf de AOW-leeftijd is het tarief in de eerste schijf lager en is de arbeidskorting hier vereenvoudigd gehalveerd.'
  });

  RT.add({
    id: 'verzamelinkomen', groep: 'fiscaal-box1', naam: 'Verzamelinkomen optellen',
    intro: 'Tel het inkomen uit box 1, box 2 en box 3 op tot het verzamelinkomen, de maatstaf voor toeslagen en veel inkomensafhankelijke regelingen.',
    kw: 'verzamelinkomen box 1 box 2 box 3 aftrekposten verlies',
    velden: [
      { k: 'b1', l: 'Bruto inkomen box 1', s: 'eur', std: 62000, tip: 'Loon, uitkering, pensioen, winst, partneralimentatie.' },
      { k: 'ew', l: 'Saldo eigen woning', s: 'bedrag', std: -7500, tip: 'Negatief bij aftrek (rente hoger dan het eigenwoningforfait).' },
      { k: 'aftr', l: 'Persoonsgebonden aftrek en overige aftrekposten', s: 'eur', std: 0, opt: true },
      { k: 'verl', l: 'Te verrekenen verlies box 1 uit eerdere jaren', s: 'eur', std: 0, opt: true },
      { k: 'b2', l: 'Belastbaar inkomen box 2', s: 'eur', std: 0, opt: true },
      { k: 'b3', l: 'Belastbaar inkomen box 3 (voordeel)', s: 'eur', std: 3200, opt: true }
    ],
    bereken(v) {
      const box1 = v.b1 + v.ew - v.aftr - v.verl;
      const telt1 = pos(box1), tot = telt1 + v.b2 + v.b3;
      return {
        lbl: 'Verzamelinkomen', groot: fmt.euro0(tot), onder: fmt.euro0(tot / 12) + ' per maand',
        rijen: [
          ['Belastbaar inkomen box 1', fmt.euro0(box1)],
          ['Box 2', fmt.euro0(v.b2)],
          ['Box 3', fmt.euro0(v.b3)],
          ['Verschil met bruto box 1', fmt.euro0(tot - v.b1), 'som']
        ],
        signalen: box1 < 0 ? ['Box 1 is negatief: dat is een verlies van ' + fmt.euro0(-box1) + ' dat met andere jaren kan worden verrekend. Het telt hier als nul.'] : []
      };
    },
    uitleg: 'Box 1 = bruto inkomen + saldo eigen woning − aftrekposten − te verrekenen verlies. Verzamelinkomen = box 1 (niet lager dan nul) + box 2 + box 3.',
    letop: 'Dit is een rekenkundige optelling; welke posten aftrekbaar zijn en welke verliezen verrekenbaar zijn, volgt uit de aangifte. Verliezen uit box 2 zijn niet met box 1 te verrekenen. Voor toeslagen geldt het verzamelinkomen als toetsingsinkomen; zie ook <a href="#toetsingsinkomen">Toetsingsinkomen voor toeslagen</a>.'
  });

  RT.add({
    id: 'keuzehulp-bruto-netto', groep: 'fiscaal-box1', naam: 'Welke bruto-netto berekening past?',
    intro: 'Kies de inkomenssituatie; de keuzehulp wijst de passende bruto-netto rekenhulp aan.',
    kw: 'bruto netto keuzehulp welke berekening loon uitkering',
    velden: [
      { k: 's', l: 'Situatie', s: 'keuze', breed: true, std: 'loon', opties: [
        ['loon', 'Maandsalaris uit loondienst'], ['jaar', 'Bruto jaarloon is bekend'], ['terug', 'Gewenst netto, bruto gezocht'],
        ['uitk', 'Uitkering (WW, WIA, bijstand)'], ['meer', 'Loon en uitkering of meerdere bronnen'], ['aow', 'AOW en pensioen'],
        ['zzp', 'Winst uit onderneming (zzp)'], ['dga', 'Salaris als dga'], ['uur', 'Uurloon'], ['alim', 'Partneralimentatie']] }
    ],
    bereken(v) {
      const M = {
        loon: ['bruto-netto-salaris', 'Van brutosalaris naar netto', 'Rekent met maandsalaris, vakantiegeld, eindejaarsuitkering en pensioenpremie.'],
        jaar: ['netto-uit-jaarloon', 'Netto uit bruto jaarloon', 'Het jaarloon is direct de invoer; aftrekposten kunnen worden meegenomen.'],
        terug: ['bruto-uit-netto', 'Bruto uit gewenst netto', 'Zoekt het brutoloon dat bij een gewenst netto maandbedrag hoort.'],
        uitk: ['netto-uitkering', 'Netto uitkering', 'Een uitkering geeft geen recht op arbeidskorting.'],
        meer: ['netto-meerdere-bronnen', 'Netto bij meerdere inkomensbronnen', 'Heffingskortingen gelden één keer voor alle bronnen samen.'],
        aow: ['netto-aow-pensioen', 'Netto AOW en pensioen', 'Vanaf de AOW-leeftijd gelden een lager tarief en de ouderenkorting.'],
        zzp: ['netto-inkomen-zzp', 'Netto inkomen zzp', 'Winst kent ondernemersaftrek, mkb-winstvrijstelling en een eigen Zvw-bijdrage.'],
        dga: ['nettoloon-dga', 'Nettoloon dga', 'Het dga-loon is loon uit dienstbetrekking, met een gebruikelijk-loonnorm.'],
        uur: ['uurloon-bruto-netto', 'Uurloon bruto en netto', 'Rekent het uurloon om naar een jaar en weer terug.'],
        alim: ['partneralimentatie-netto', 'Partneralimentatie bruto en netto', 'Voor zowel de ontvanger als de betaler.']
      };
      const m = M[v.s] || M.loon, t = RT.get(m[0]);
      const naam = t ? t.naam : m[1];
      return {
        lbl: 'Passende rekenhulp', groot: naam, onder: m[2], rijen: [],
        signalen: [(t ? '<a href="#' + m[0] + '">Open ' + fmt.esc(naam) + '</a>.' : 'Deze rekenhulp is nog niet beschikbaar op deze pagina.') +
          ' Bij meer dan één inkomen tegelijk past maar één werkgever of uitkeringsinstantie de heffingskortingen toe; gebruik dan de hulp voor meerdere bronnen.']
      };
    },
    uitleg: 'De keuzehulp rekent niet zelf; hij koppelt de gekozen inkomensbron aan de rekenhulp met de juiste kortingen (wel of geen arbeidskorting, AOW-tarief, ondernemersfaciliteiten).',
    letop: 'Bij een combinatie van situaties (bijvoorbeeld loon naast winst of een pensioen naast deeltijdwerk) is de uitkomst van één enkele hulp altijd een benadering.'
  });

  /* =================== Bruto en netto =================== */

  RT.add({
    id: 'bruto-netto-salaris', groep: 'fiscaal-box1', naam: 'Van brutosalaris naar netto',
    intro: 'Van bruto maandsalaris, vakantiegeld en eindejaarsuitkering naar een netto jaar- en maandinkomen.',
    kw: 'bruto netto salaris maandloon vakantiegeld dertiende maand pensioenpremie',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'm', l: 'Bruto maandsalaris', s: 'eur', std: 3800 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'ej', l: 'Eindejaarsuitkering', s: 'pct', std: 0, opt: true, tip: 'Bijvoorbeeld 8,33% voor een dertiende maand.' },
      { k: 'pens', l: 'Pensioenpremie werknemer', s: 'pct', std: 5.5, opt: true, tip: 'Vereenvoudigd als percentage van het hele brutoloon.' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const bruto = v.m * 12 * (1 + v.vg / 100 + v.ej / 100), premie = bruto * v.pens / 100, ink = bruto - premie;
      if (ink <= 0) return { fout: 'Vul een positief maandsalaris in.' };
      const r = F.netto(ink, Object.assign(aowOpt(v.aow), { arbeid: ink, kind: v.kind === 'ja' }));
      return {
        lbl: 'Netto per maand (gemiddeld)', groot: fmt.euro0(r.netto / 12), onder: 'inclusief vakantiegeld en eindejaarsuitkering over 12 maanden verdeeld',
        rijen: [['Bruto jaarloon', fmt.euro0(bruto)], ['Pensioenpremie werknemer', '− ' + fmt.euro0(premie)], ['Belastbaar loon', fmt.euro0(ink)]]
          .concat(kortingRijen(r), [['Netto per jaar', fmt.euro0(r.netto), 'som'], ['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1)]]),
        signalen: verlorenKorting(r)
      };
    },
    uitleg: 'Bruto jaarloon = maandsalaris × 12 × (1 + vakantiegeld% + eindejaars%). Pensioenpremie van de werknemer gaat van het belastbare loon af. ' + BRUTONETTO,
    letop: LETOP_IB + ' Het netto maandsalaris zonder vakantiegeld ligt lager dan het hier getoonde gemiddelde.'
  });

  RT.add({
    id: 'netto-uit-jaarloon', groep: 'fiscaal-box1', naam: 'Netto uit bruto jaarloon',
    intro: 'Het bruto jaarloon is bekend: wat blijft er netto over, eventueel na aftrekposten?',
    kw: 'netto jaarloon bruto jaarinkomen nettoloon',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto jaarloon', s: 'eur', std: 52000 },
      { k: 'aftr', l: 'Aftrekposten', s: 'eur', std: 0, opt: true, tip: 'Bijvoorbeeld hypotheekrente minus eigenwoningforfait.' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const r = F.netto(v.b, Object.assign(aowOpt(v.aow), { arbeid: v.b, kind: v.kind === 'ja', aftrek: v.aftr }));
      return {
        lbl: 'Netto per jaar', groot: fmt.euro0(r.netto), onder: fmt.euro0(r.netto / 12) + ' per maand gemiddeld',
        rijen: (v.aftr ? [['Belastbaar inkomen', fmt.euro0(r.belastbaar)]] : []).concat(kortingRijen(r), [['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1), 'som']]),
        signalen: verlorenKorting(r)
      };
    },
    uitleg: BRUTONETTO + ' Aftrekposten verlagen het belastbaar inkomen; het netto blijft bruto − belasting.',
    letop: LETOP_IB + ' Aftrekposten in de hoogste schijf leveren minder op door de tariefsaanpassing; zie <a href="#tariefsaanpassing">Aftrek beperkt tot het maximumtarief</a>.'
  });

  RT.add({
    id: 'bruto-uit-netto', groep: 'fiscaal-box1', naam: 'Bruto uit gewenst netto',
    intro: 'Welk brutoloon is nodig om netto een bepaald bedrag per maand over te houden?',
    kw: 'bruto uit netto terugrekenen brutoloon gewenst netto salaris',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'n', l: 'Gewenst netto per maand (excl. vakantiegeld)', s: 'eur', std: 2800 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      if (v.n <= 0) return { fout: 'Vul een netto bedrag groter dan nul in.' };
      const doel = v.n * 12 * (1 + v.vg / 100);
      const o = Object.assign(aowOpt(v.aow), { kind: v.kind === 'ja' });
      const bruto = F.brutoUitNetto(doel, o), r = F.netto(bruto, o);
      return {
        lbl: 'Benodigd bruto maandsalaris', groot: fmt.euro0(bruto / (12 * (1 + v.vg / 100))), onder: 'exclusief vakantiegeld',
        rijen: [['Bruto jaarloon incl. vakantiegeld', fmt.euro0(bruto)], ['Netto per jaar', fmt.euro0(r.netto)], ['Te betalen belasting', fmt.euro0(r.heffing)],
          ['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1), 'som']]
      };
    },
    uitleg: 'Gewenst netto per jaar = netto per maand × 12 × (1 + vakantiegeld%). Daarna wordt numeriek (halveringsmethode) het bruto jaarloon gezocht waarbij bruto − belasting precies dat bedrag oplevert. Bruto maandsalaris = jaarloon / (12 × (1 + vakantiegeld%)).',
    letop: LETOP_IB + ' De aanname is dat het vakantiegeld netto in dezelfde verhouding uitkomt als het salaris. Pensioenpremie is niet meegenomen; die verhoogt het benodigde bruto.'
  });

  RT.add({
    id: 'bruto-jaar-uit-netto', groep: 'fiscaal-box1', naam: 'Bruto jaarinkomen uit netto ontvangsten',
    intro: 'Alleen de netto bedragen op de bankrekening zijn bekend. Welk bruto jaarinkomen hoort daarbij?',
    kw: 'bruto jaarinkomen netto ontvangsten terugrekenen inkomensverklaring',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'n', l: 'Netto per maand', s: 'eur', std: 2450 },
      { k: 'mnd', l: 'Aantal maanden', s: 'num', na: 'mnd', std: 12 },
      { k: 'extra', l: 'Netto extra betalingen', s: 'eur', std: 1850, opt: true, tip: 'Vakantiegeld, bonus, dertiende maand.' },
      { k: 'soort', l: 'Soort inkomen', s: 'keuze', opties: SOORT, std: 'arbeid' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      const doel = v.n * v.mnd + v.extra;
      if (doel <= 0) return { fout: 'Vul netto ontvangsten groter dan nul in.' };
      const o = aowOpt(v.aow);
      if (v.soort === 'uitk') o.arbeid = 0;
      const bruto = F.brutoUitNetto(doel, o), r = F.netto(bruto, o);
      return {
        lbl: 'Bruto jaarinkomen', groot: fmt.euro0(bruto), onder: fmt.euro0(bruto / 12) + ' per maand gemiddeld',
        rijen: [['Netto jaarinkomen', fmt.euro0(doel)], ['Te betalen belasting', fmt.euro0(r.heffing)], ['Netto in % van bruto', fmt.pct(doel / bruto * 100, 1), 'som']]
      };
    },
    uitleg: 'Netto jaarinkomen = netto per maand × aantal maanden + netto extra betalingen. Het bruto jaarinkomen wordt numeriek gezocht zodat bruto − belasting (na heffingskortingen) gelijk is aan dat netto bedrag. Bij een uitkering of pensioen telt geen arbeidskorting.',
    letop: LETOP_IB + ' Netto ontvangsten na inhoudingen zoals pensioenpremie, beslag of een eigen bijdrage geven een te laag bruto. Voor een hypotheekaanvraag geldt altijd het bruto inkomen uit werkgeversverklaring, salarisstrook of IBL, niet deze schatting.'
  });

  RT.add({
    id: 'netto-meerdere-bronnen', groep: 'fiscaal-box1', naam: 'Netto bij meerdere inkomensbronnen',
    intro: 'Loon, uitkering en ander inkomen in hetzelfde jaar: wat blijft er netto over als alles samen wordt belast?',
    kw: 'meerdere inkomens twee werkgevers loon uitkering heffingskorting een keer',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'loon', l: 'Bruto loon (uit werk)', s: 'eur', std: 32000 },
      { k: 'uitk', l: 'Bruto uitkering', s: 'eur', std: 9000, opt: true },
      { k: 'ov', l: 'Overig inkomen box 1', s: 'eur', std: 0, opt: true, tip: 'Pensioen, ontvangen partneralimentatie.' },
      { k: 'aftr', l: 'Aftrekposten', s: 'eur', std: 0, opt: true },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const tot = v.loon + v.uitk + v.ov;
      if (tot <= 0) return { fout: 'Vul minstens één inkomen in.' };
      const r = F.netto(tot, Object.assign(aowOpt(v.aow), { arbeid: v.loon, kind: v.kind === 'ja', aftrek: v.aftr }));
      return {
        lbl: 'Netto per jaar', groot: fmt.euro0(r.netto), onder: fmt.euro0(r.netto / 12) + ' per maand gemiddeld',
        rijen: [['Totaal bruto inkomen', fmt.euro0(tot)], ['Waarvan uit werk', fmt.euro0(v.loon)]].concat(kortingRijen(r), [['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1), 'som']]),
        signalen: ['Bij twee of meer bronnen past meestal maar één inhoudingsplichtige de loonheffingskorting toe. Over het geheel wordt dan vaak te weinig ingehouden: reken op een naheffing bij de aangifte.'].concat(verlorenKorting(r))
      };
    },
    uitleg: 'Alle inkomens worden opgeteld tot één belastbaar inkomen. De algemene heffingskorting geldt één keer over het totaal; de arbeidskorting alleen over het loon uit werk. ' + BRUTONETTO,
    letop: LETOP_IB
  });

  RT.add({
    id: 'netto-uitkering', groep: 'fiscaal-box1', naam: 'Netto uitkering',
    intro: 'Hoeveel blijft er netto over van een bruto uitkering (WW, WIA, ZW of bijstand)?',
    kw: 'netto uitkering ww wia bijstand vakantietoeslag',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto uitkering per maand', s: 'eur', std: 2100 },
      { k: 'vg', l: 'Vakantietoeslag', s: 'pct', std: 8 },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      const jaar = v.b * 12 * (1 + v.vg / 100);
      const r = F.netto(jaar, Object.assign(aowOpt(v.aow), { arbeid: 0 }));
      return {
        lbl: 'Netto per maand (gemiddeld)', groot: fmt.euro0(r.netto / 12), onder: 'inclusief vakantietoeslag over 12 maanden verdeeld',
        rijen: [['Bruto per jaar', fmt.euro0(jaar)]].concat(kortingRijen(r), [['Netto per jaar', fmt.euro0(r.netto), 'som'], ['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1)]]),
        signalen: verlorenKorting(r)
      };
    },
    uitleg: 'Bruto per jaar = uitkering × 12 × (1 + vakantietoeslag%). Een uitkering is geen inkomen uit tegenwoordige arbeid: wel algemene heffingskorting, geen arbeidskorting. ' + BRUTONETTO,
    letop: LETOP_IB + ' Bij de bijstand wordt de uitkering netto vastgesteld; deze hulp rekent alleen de fiscale weg.'
  });

  RT.add({
    id: 'netto-loonsverhoging', groep: 'fiscaal-box1', naam: 'Netto effect van een loonsverhoging',
    intro: 'Wat blijft er netto over van een procentuele loonsverhoging, inclusief de afbouw van heffingskortingen?',
    kw: 'loonsverhoging netto salarisverhoging cao promotie',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Huidig bruto jaarloon', s: 'eur', std: 48000 },
      { k: 'p', l: 'Loonsverhoging', s: 'pct', std: 3.5 },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const n = v.b * (1 + v.p / 100), dB = n - v.b;
      if (dB <= 0) return { fout: 'Vul een verhoging groter dan nul in.' };
      const o = Object.assign(aowOpt(v.aow), { kind: v.kind === 'ja' });
      const a = F.netto(v.b, o), b = F.netto(n, o), dN = b.netto - a.netto;
      return {
        lbl: 'Netto erbij per maand', groot: fmt.euro(dN / 12), onder: fmt.euro0(dN) + ' per jaar',
        rijen: [['Nieuw bruto jaarloon', fmt.euro0(n)], ['Bruto erbij per jaar', fmt.euro0(dB)], ['Netto erbij per jaar', fmt.euro0(dN)],
          ['U houdt over van elke euro', fmt.pct(dN / dB * 100, 1)], ['Druk op de verhoging', fmt.pct(100 - dN / dB * 100, 1), 'som']]
      };
    },
    uitleg: 'Netto erbij = netto bij het nieuwe loon − netto bij het huidige loon, elk volledig doorgerekend met schijven en heffingskortingen. Druk = 1 − netto erbij / bruto erbij.',
    letop: LETOP_IB + ' Een hoger inkomen kan ook toeslagen verlagen; zie <a href="#meer-werken-met-toeslagen">Meer werken: netto inclusief toeslagen</a>.'
  });

  RT.add({
    id: 'netto-verhoging-uitkering', groep: 'fiscaal-box1', naam: 'Netto effect van een hogere uitkering',
    intro: 'De bruto uitkering stijgt met een percentage, bijvoorbeeld door indexatie. Wat komt er netto bij?',
    kw: 'verhoging uitkering indexatie netto ww wia aow',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto uitkering per maand', s: 'eur', std: 1800 },
      { k: 'p', l: 'Verhoging', s: 'pct', std: 3.1 },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      const j1 = v.b * 12, j2 = j1 * (1 + v.p / 100);
      const o = Object.assign(aowOpt(v.aow), { arbeid: 0 });
      const a = F.netto(j1, o), b = F.netto(j2, o), d = b.netto - a.netto;
      return {
        lbl: 'Netto erbij per maand', groot: fmt.euro(d / 12), onder: fmt.euro0(d) + ' per jaar',
        rijen: [['Nieuwe bruto uitkering per maand', fmt.euro(j2 / 12)], ['Netto nu per maand', fmt.euro(a.netto / 12)], ['Netto straks per maand', fmt.euro(b.netto / 12)],
          ['Netto stijging', a.netto > 0 ? fmt.pct((b.netto / a.netto - 1) * 100) : '–', 'som']]
      };
    },
    uitleg: 'Netto erbij = netto bij de nieuwe uitkering − netto bij de huidige, beide zonder arbeidskorting. Vakantietoeslag is buiten beschouwing gelaten.',
    letop: LETOP_IB
  });

  RT.add({
    id: 'meer-werken-met-toeslagen', groep: 'fiscaal-box1', naam: 'Meer werken: netto inclusief toeslagen',
    intro: 'Meer uren werken levert bruto meer op, maar ook meer belasting en minder zorgtoeslag en kindgebonden budget. Wat blijft er echt over?',
    kw: 'meer werken marginale druk toeslagen armoedeval uren uitbreiden',
    peildatum: PEIL, fiscaal: IB.concat(['zorgtoeslag', 'kindgebonden budget']),
    velden: [
      { k: 'b', l: 'Huidig bruto jaarloon', s: 'eur', std: 32000 },
      { k: 'u1', l: 'Huidige uren per week', s: 'num', na: 'uur', std: 24 },
      { k: 'u2', l: 'Nieuwe uren per week', s: 'num', na: 'uur', std: 32 },
      { k: 'hh', l: 'Huishouden', s: 'keuze', opties: [['alleen', 'Alleenstaand'], ['partner', 'Met toeslagpartner']], std: 'alleen' },
      { k: 'pi', l: 'Inkomen toeslagpartner', s: 'eur', std: 0, opt: true, als: v => v.hh === 'partner' },
      { k: 'kn', l: 'Kinderen jonger dan 18', s: 'num', std: 1 },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'ov', l: 'Overige verandering toeslagen per jaar', s: 'bedrag', std: 0, opt: true, tip: 'Bijvoorbeeld minder huurtoeslag (negatief) of meer kinderopvangtoeslag (positief).' }
    ],
    bereken(v) {
      if (v.u1 <= 0 || v.u2 <= 0) return { fout: 'Vul uren groter dan nul in.' };
      const n = v.b / v.u1 * v.u2, dB = n - v.b;
      if (Math.abs(dB) < 1) return { fout: 'Vul een ander aantal nieuwe uren in.' };
      const partner = v.hh === 'partner', pi = partner ? v.pi : 0, kn = Math.max(0, Math.round(v.kn));
      const o = { kind: v.kind === 'ja' };
      const a = F.netto(v.b, o), b = F.netto(n, o), dN = b.netto - a.netto;
      const t = ink => zorgtoeslag(ink, partner, 0).bedrag + kgb(kn, 0, 0, ink, !partner).bedrag;
      const tA = t(v.b + pi), tB = t(n + pi), dT = tB - tA + v.ov, echt = dN + dT;
      const uren = (v.u2 - v.u1) * 52;
      return {
        lbl: 'Werkelijk netto erbij per jaar', groot: fmt.euro0(echt), onder: fmt.euro(echt / uren) + ' per extra gewerkt uur',
        rijen: [['Nieuw bruto jaarloon', fmt.euro0(n)], ['Bruto erbij', fmt.euro0(dB)], ['Netto erbij (alleen belasting)', fmt.euro0(dN)],
          ['Zorgtoeslag en kindgebonden budget nu', fmt.euro0(tA)], ['Idem straks', fmt.euro0(tB)], ['Verandering toeslagen totaal', fmt.euro0(dT)],
          ['Marginale druk incl. toeslagen', fmt.pct((1 - echt / dB) * 100, 1), 'som']],
        signalen: (1 - echt / dB) > 0.6 ? ['Meer dan 60% van het extra brutoloon verdwijnt aan belasting en lagere toeslagen. Reken ook huurtoeslag en kinderopvangtoeslag mee voordat meer uren worden geadviseerd.'] : []
      };
    },
    uitleg: 'Nieuw loon = huidig loon / huidige uren × nieuwe uren. Netto erbij = verschil in netto na belasting. Zorgtoeslag en kindgebonden budget worden voor en na berekend met het eigen loon plus het partnerinkomen als toetsingsinkomen (kinderen als 0–11 jaar). Werkelijk netto erbij = netto erbij + verandering toeslagen + overige verandering.',
    letop: LETOP_IB + ' ' + LETOP_EIGEN + ' Huurtoeslag en kinderopvangtoeslag zitten alleen in het handmatige veld. Vermogenstoetsen zijn hier niet toegepast.'
  });

  RT.add({
    id: 'netto-meer-minder-uren', groep: 'fiscaal-box1', naam: 'Netto bij meer of minder uren',
    intro: 'Het brutoloon schaalt met de uren, het netto niet. Wat houdt de klant netto over bij een ander aantal uren per week?',
    kw: 'deeltijd minder werken meer werken uren netto parttime',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto jaarloon bij voltijd', s: 'eur', std: 52000 },
      { k: 'uv', l: 'Voltijd uren per week', s: 'num', na: 'uur', std: 36 },
      { k: 'u', l: 'Gewenste uren per week', s: 'num', na: 'uur', std: 28 },
      { k: 'kind', l: 'Recht op combinatiekorting', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      if (v.uv <= 0 || v.u < 0) return { fout: 'Vul geldige uren in.' };
      const o = { kind: v.kind === 'ja' };
      const netto = u => F.netto(v.b / v.uv * u, o).netto;
      const vol = netto(v.uv), n = v.b / v.uv * v.u, nn = netto(v.u);
      const rij = [];
      for (let u = 8; u <= Math.max(40, v.uv); u += 4) { const br = v.b / v.uv * u, ne = netto(u); rij.push([fmt.getal(u) + ' uur', fmt.euro0(br), fmt.euro0(ne), fmt.euro0(ne / 12), vol > 0 ? fmt.pct(ne / vol * 100, 0) : '–']); }
      return {
        lbl: 'Netto per maand bij ' + fmt.getal(v.u, v.u % 1 ? 1 : 0) + ' uur', groot: fmt.euro0(nn / 12), onder: fmt.euro0(nn) + ' per jaar',
        rijen: [['Bruto bij deze uren', fmt.euro0(n)], ['Netto bij voltijd', fmt.euro0(vol)], ['Verschil netto per jaar', fmt.euro0(nn - vol)],
          ['Deeltijdfactor bruto', fmt.pct(v.u / v.uv * 100, 1)], ['Deeltijdfactor netto', vol > 0 ? fmt.pct(nn / vol * 100, 1) : '–', 'som']],
        tabel: { titel: 'Netto per variant', kop: ['Uren', 'Bruto per jaar', 'Netto per jaar', 'Per maand', 'T.o.v. voltijd'], rijen: rij }
      };
    },
    uitleg: 'Bruto = voltijdloon × uren / voltijduren. Per variant wordt het netto volledig doorgerekend met schijven en heffingskortingen; door progressie en afbouw van kortingen daalt het netto minder hard dan het bruto.',
    letop: LETOP_IB + ' Minder werken verlaagt ook de pensioenopbouw en kan de leencapaciteit voor een hypotheek verminderen.'
  });

  RT.add({
    id: 'partneralimentatie-netto', groep: 'fiscaal-box1', naam: 'Partneralimentatie bruto en netto',
    intro: 'Partneralimentatie is belast bij de ontvanger en aftrekbaar bij de betaler. Wat is het netto effect voor elk van beiden?',
    kw: 'partneralimentatie aftrekbaar belast ontvanger betaler scheiding',
    peildatum: PEIL, fiscaal: IB.concat(['maximaal aftrektarief']),
    velden: [
      { k: 'r', l: 'Rol', s: 'keuze', opties: [['ont', 'Ontvanger'], ['bet', 'Betaler']], std: 'ont' },
      { k: 'a', l: 'Partneralimentatie per maand', s: 'eur', std: 900 },
      { k: 'ink', l: 'Overig bruto jaarinkomen (uit werk)', s: 'eur', std: 30000, opt: true }
    ],
    bereken(v) {
      const jaar = v.a * 12;
      if (jaar <= 0) return { fout: 'Vul een alimentatiebedrag in.' };
      if (v.r === 'ont') {
        const a = F.netto(v.ink, { arbeid: v.ink }), b = F.netto(v.ink + jaar, { arbeid: v.ink }), net = b.netto - a.netto;
        return {
          lbl: 'Netto alimentatie per maand', groot: fmt.euro0(net / 12), onder: fmt.euro0(net) + ' per jaar',
          rijen: [['Bruto per jaar', fmt.euro0(jaar)], ['Belasting over de alimentatie', fmt.euro0(jaar - net)], ['Druk op de alimentatie', fmt.pct((1 - net / jaar) * 100, 1), 'som']]
        };
      }
      const a = F.netto(v.ink, { arbeid: v.ink }), b = F.netto(v.ink, { arbeid: v.ink, aftrek: jaar });
      const inTop = pos(Math.min(jaar, v.ink - N.box1.schijf2Grens));
      const aanpassing = inTop * pos(N.box1.tarief3 - N.aftrekTariefMax) / 100;
      const voordeel = a.heffing - b.heffing - aanpassing;
      return {
        lbl: 'Netto kosten per maand', groot: fmt.euro0((jaar - voordeel) / 12), onder: fmt.euro0(jaar - voordeel) + ' per jaar',
        rijen: [['Bruto per jaar', fmt.euro0(jaar)], ['Belastingvoordeel aftrek', fmt.euro0(voordeel)], ['Waarvan beperkt door tariefsaanpassing', fmt.euro0(aanpassing)],
          ['Effectief aftrektarief', fmt.pct(voordeel / jaar * 100, 1), 'som']]
      };
    },
    uitleg: 'Ontvanger: netto = netto met alimentatie − netto zonder (alimentatie telt als inkomen, niet als arbeid). Betaler: voordeel = belasting zonder − belasting met de aftrek, min de tariefsaanpassing over het deel dat in de hoogste schijf valt (aftrek daar maximaal tegen ' + fmt.pct(N.aftrekTariefMax) + ').',
    letop: LETOP_IB + ' Kinderalimentatie is niet aftrekbaar en niet belast. Ontvangen partneralimentatie telt mee voor het toetsingsinkomen van toeslagen en voor de leencapaciteit (met eigen regels voor einddatum).'
  });

  RT.add({
    id: 'uurloon-bruto-netto', groep: 'fiscaal-box1', naam: 'Uurloon bruto en netto',
    intro: 'Van bruto uurloon naar netto uurloon, via een jaarberekening met vakantiegeld.',
    kw: 'uurloon netto per uur bruto uurloon minimumloon',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'u', l: 'Bruto uurloon', s: 'bedrag', std: 22.5 },
      { k: 'uw', l: 'Uren per week', s: 'num', na: 'uur', std: 36 },
      { k: 'vg', l: 'Vakantiegeld', s: 'pct', std: 8 },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      if (v.u <= 0 || v.uw <= 0) return { fout: 'Vul een uurloon en uren groter dan nul in.' };
      const o = aowOpt(v.aow), uren = v.uw * 52;
      const jaar = v.u * uren * (1 + v.vg / 100), r = F.netto(jaar, o);
      const extra = F.netto(jaar + v.u * 52 * (1 + v.vg / 100), o).netto - r.netto;
      return {
        lbl: 'Netto uurloon', groot: fmt.euro(r.netto / uren), onder: 'gemiddeld, inclusief vakantiegeld',
        rijen: [['Bruto jaarinkomen', fmt.euro0(jaar)], ['Te betalen belasting', fmt.euro0(r.heffing)], ['Netto per maand', fmt.euro0(r.netto / 12)],
          ['Netto per extra gewerkt uur', fmt.euro(extra / 52)], ['Netto in % van bruto', fmt.pct(r.netto / jaar * 100, 1), 'som']],
        signalen: v.u < N.minimumloon.uur ? ['Dit uurloon ligt onder het wettelijk minimumuurloon (' + fmt.euro(N.minimumloon.uur) + ' voor 21 jaar en ouder).'] : []
      };
    },
    uitleg: 'Jaarinkomen = uurloon × uren per week × 52 × (1 + vakantiegeld%). Daarover de volledige bruto-netto berekening; netto uurloon = netto jaarinkomen / (uren per week × 52). De extra-uurregel toont wat één uur per week meer werken per gewerkt uur netto oplevert.',
    letop: LETOP_IB
  });

  RT.add({
    id: 'teruggave-laag-inkomen', groep: 'fiscaal-box1', naam: 'Belasting terug bij een laag jaarinkomen',
    intro: 'Bijbaan, vakantiewerk of stage: bij een laag jaarinkomen is vaak te veel loonheffing ingehouden. Hoeveel komt er terug?',
    kw: 'teruggave bijbaan vakantiewerk stage student loonheffing terug',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto jaarinkomen', s: 'eur', std: 7500 },
      { k: 'lh', l: 'Ingehouden loonheffing (jaaropgaaf)', s: 'eur', std: 900 },
      { k: 'soort', l: 'Soort inkomen', s: 'keuze', opties: SOORT, std: 'arbeid' }
    ],
    bereken(v) {
      const r = F.netto(v.b, v.soort === 'uitk' ? { arbeid: 0 } : {}), saldo = v.lh - r.heffing;
      return {
        lbl: saldo >= 0 ? 'Teruggave' : 'Bij te betalen', groot: fmt.euro0(Math.abs(saldo)), onder: 'na aangifte inkomstenbelasting',
        rijen: kortingRijen(r).concat([['Ingehouden loonheffing', fmt.euro0(v.lh)], [saldo >= 0 ? 'Teruggave' : 'Bijbetalen', fmt.euro0(Math.abs(saldo)), 'som']]),
        signalen: verlorenKorting(r)
      };
    },
    uitleg: 'Verschuldigde belasting = schijventarief − heffingskortingen (niet onder nul). Teruggave = ingehouden loonheffing − verschuldigde belasting.',
    letop: LETOP_IB + ' Een kleine teruggave onder de aanslaggrens wordt niet uitbetaald. Aangifte kan tot vijf jaar terug. Bij een toeslagpartner zonder inkomen kan een deel van de heffingskorting soms aan die partner worden uitbetaald; dat zit hier niet in.'
  });

  RT.add({
    id: 'koopkracht-inkomen', groep: 'fiscaal-box1', naam: 'Koopkrachtverandering',
    intro: 'Stijgt het netto inkomen harder dan de prijzen? Een statische koopkrachtberekening voor één huishouden.',
    kw: 'koopkracht inflatie loonstijging netto volgend jaar',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto jaarinkomen nu', s: 'eur', std: 45000 },
      { k: 'ls', l: 'Stijging bruto inkomen', s: 'pct', std: 2.8 },
      { k: 'inf', l: 'Inflatie', s: 'pct', std: 2.5 },
      { k: 'tsl', l: 'Verandering toeslagen per jaar', s: 'bedrag', std: 0, opt: true, tip: 'Negatief bij minder toeslag.' },
      { k: 'soort', l: 'Soort inkomen', s: 'keuze', opties: SOORT, std: 'arbeid' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      const o = aowOpt(v.aow);
      if (v.soort === 'uitk') o.arbeid = 0;
      const n = v.b * (1 + v.ls / 100), oA = Object.assign({}, o), oB = Object.assign({}, o);
      const a = F.netto(v.b, oA).netto, b = F.netto(n, oB).netto + v.tsl;
      if (a <= 0) return { fout: 'Vul een inkomen groter dan nul in.' };
      const kk = (b / a) / (1 + v.inf / 100) - 1;
      return {
        lbl: 'Koopkrachtverandering', groot: (kk < 0 ? '− ' : '+ ') + fmt.pct(Math.abs(kk * 100)), onder: fmt.euro0(a * kk) + ' per jaar in prijzen van nu',
        rijen: [['Netto nu', fmt.euro0(a)], ['Netto volgend jaar', fmt.euro0(b)], ['Netto stijging', fmt.pct((b / a - 1) * 100)], ['Inflatie', fmt.pct(v.inf)],
          ['Per maand', fmt.euro0(a * kk / 12), 'som']]
      };
    },
    uitleg: 'Koopkracht = (netto volgend jaar / netto nu) / (1 + inflatie) − 1. Netto volgend jaar = netto over het verhoogde bruto + verandering toeslagen.',
    letop: LETOP_IB + ' Beide jaren worden met dezelfde normen (' + PEIL + ') berekend; tariefwijzigingen van volgend jaar zitten er dus niet in. Koopkrachtcijfers van CPB en Nibud zijn mediane groepscijfers en wijken af van deze individuele berekening.'
  });

  RT.add({
    id: 'bijbetalen-na-inkomenswijziging', groep: 'fiscaal-box1', naam: 'Bijbetalen of terugkrijgen na een inkomenswijziging',
    intro: 'Halverwege het jaar een andere baan of ander loon: de loonheffing gaat uit van een heel jaar. Volgt er een naheffing of een teruggave?',
    kw: 'inkomenswijziging andere baan naheffing teruggave loonheffing halverwege jaar',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b1', l: 'Bruto jaarloon oude situatie', s: 'eur', std: 38000 },
      { k: 'm1', l: 'Maanden in de oude situatie', s: 'num', na: 'mnd', std: 7 },
      { k: 'b2', l: 'Bruto jaarloon nieuwe situatie', s: 'eur', std: 56000 },
      { k: 'lh', l: 'Werkelijk ingehouden loonheffing', s: 'eur', std: 0, opt: true, tip: 'Laat 0 om de inhouding te schatten.' }
    ],
    bereken(v) {
      const m1 = Math.min(12, pos(v.m1)), m2 = 12 - m1;
      const werkelijk = v.b1 * m1 / 12 + v.b2 * m2 / 12, r = F.netto(werkelijk);
      const ingeh = v.lh > 0 ? v.lh : F.netto(v.b1).heffing * m1 / 12 + F.netto(v.b2).heffing * m2 / 12;
      const saldo = ingeh - r.heffing;
      return {
        lbl: saldo >= 0 ? 'Teruggave (indicatie)' : 'Bijbetalen (indicatie)', groot: fmt.euro0(Math.abs(saldo)), onder: 'bij de aangifte over het hele jaar',
        rijen: [['Werkelijk jaarinkomen', fmt.euro0(werkelijk)], ['Verschuldigde belasting', fmt.euro0(r.heffing)], [(v.lh > 0 ? 'Ingehouden' : 'Geschatte inhouding') + ' loonheffing', fmt.euro0(ingeh)],
          ['Reserveren per resterende maand', saldo < 0 && m2 > 0 ? fmt.euro0(-saldo / m2) : '–', 'som']]
      };
    },
    uitleg: 'Werkelijk jaarinkomen = oud loon × maanden / 12 + nieuw loon × resterende maanden / 12. Geschatte inhouding = jaarheffing bij het oude loon × m/12 + jaarheffing bij het nieuwe loon × (12 − m)/12: elke werkgever rekent alsof zijn loon het hele jaar geldt. Saldo = inhouding − belasting over het werkelijke jaarinkomen.',
    letop: LETOP_IB + ' Werkloosheid, een bonus of meerdere werkgevers tegelijk veranderen de uitkomst. Vul bij voorkeur de werkelijke inhouding uit de loonstroken in.'
  });

  RT.add({
    id: 'belasting-extra-inkomen', groep: 'fiscaal-box1', naam: 'Wat houd je over van extra inkomen',
    intro: 'Een bonus, bijbaan of extra uitkering bovenop het bestaande inkomen: hoeveel belasting gaat erop, inclusief afbouw van kortingen?',
    kw: 'extra inkomen bonus bijbaan belasting over extra',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Huidig bruto jaarinkomen', s: 'eur', std: 45000 },
      { k: 'e', l: 'Extra inkomen', s: 'eur', std: 5000 },
      { k: 'arb', l: 'Extra inkomen is inkomen uit werk', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      if (v.e <= 0) return { fout: 'Vul een extra inkomen groter dan nul in.' };
      const o = aowOpt(v.aow);
      const a = F.netto(v.b, Object.assign({ arbeid: v.b }, o)), b = F.netto(v.b + v.e, Object.assign({ arbeid: v.arb === 'ja' ? v.b + v.e : v.b }, o));
      const bel = b.heffing - a.heffing;
      return {
        lbl: 'Netto van het extra inkomen', groot: fmt.euro0(v.e - bel), onder: 'belasting erover: ' + fmt.euro0(bel),
        rijen: [['Belasting nu', fmt.euro0(a.heffing)], ['Belasting straks', fmt.euro0(b.heffing)], ['Druk op het extra inkomen', fmt.pct(bel / v.e * 100, 1)],
          ['Schijftarief nu', fmt.pct(a.schijfTarief)], ['Extra door afbouw kortingen', fmt.pct(bel / v.e * 100 - a.schijfTarief, 1), 'som']]
      };
    },
    uitleg: 'Belasting over het extra inkomen = belasting bij (inkomen + extra) − belasting bij het huidige inkomen. Het verschil met het schijftarief komt door de afbouw van algemene heffingskorting en arbeidskorting (of, bij lage inkomens, door extra arbeidskorting).',
    letop: LETOP_IB + ' Op een bonus houdt de werkgever loonheffing in volgens de tabel bijzondere beloningen; dat is een voorheffing, de definitieve belasting volgt uit de aangifte.'
  });

  RT.add({
    id: 'middeling-inkomen', groep: 'fiscaal-box1', naam: 'Middeling van inkomens (regeling vervallen)',
    intro: 'Historische rekenhulp: hoeveel leverde middeling over drie jaren met sterk wisselend inkomen op? De regeling is afgeschaft.',
    kw: 'middeling middelen wisselend inkomen drie jaar teruggave afgeschaft',
    peildatum: EIGEN.peildatum, fiscaal: IB.concat(['middelingsdrempel']),
    velden: [
      { k: 'j1', l: 'Belastbaar inkomen jaar 1', s: 'eur', std: 25000 },
      { k: 'j2', l: 'Belastbaar inkomen jaar 2', s: 'eur', std: 48000 },
      { k: 'j3', l: 'Belastbaar inkomen jaar 3', s: 'eur', std: 95000 }
    ],
    bereken(v) {
      const hef = x => F.netto(x).heffing, gem = (v.j1 + v.j2 + v.j3) / 3;
      const werk = hef(v.j1) + hef(v.j2) + hef(v.j3), mid = 3 * hef(gem), dr = EIGEN.middeling.drempel;
      const terug = pos(werk - mid - dr);
      return {
        lbl: 'Teruggave na middeling (indicatie)', groot: fmt.euro0(terug), onder: terug > 0 ? 'boven de drempel van ' + fmt.euro0(dr) : 'middeling levert niets op',
        rijen: [['Gemiddeld inkomen', fmt.euro0(gem)], ['Belasting zonder middeling', fmt.euro0(werk)], ['Belasting na middeling', fmt.euro0(mid)], ['Verschil', fmt.euro0(werk - mid)],
          ['Drempel', fmt.euro0(dr), 'som']],
        signalen: ['De middelingsregeling is afgeschaft; het laatste tijdvak was 2022–2024. Gebruik deze hulp alleen voor een nog lopend verzoek over oude jaren en reken dan met de tarieven van die jaren.']
      };
    },
    uitleg: 'Belasting zonder middeling = som van de belasting per jaar. Belasting na middeling = 3 × belasting over het gemiddelde inkomen. Teruggave = verschil − drempel, niet onder nul. Hier rekent elk jaar met de normen ' + PEIL + '.',
    letop: 'Regeling vervallen: nieuwe middelingsverzoeken zijn alleen nog mogelijk voor tijdvakken tot en met 2024, binnen de wettelijke termijn na de laatste definitieve aanslag. De werkelijke berekening gebruikt per jaar de tarieven en kortingen van dat jaar; deze uitkomst is dus alleen een indicatie. ' + LETOP_EIGEN
  });

  RT.add({
    id: 'inkomen-verschuiven', groep: 'fiscaal-box1', naam: 'Inkomen naar een ander jaar verschuiven',
    intro: 'Een deel van het inkomen (bonus, opdracht, opname) een jaar later laten vallen, als het inkomen dan lager is: wat levert dat op?',
    kw: 'inkomen uitstellen verschuiven bonus later tariefverschil',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b1', l: 'Inkomen dit jaar', s: 'eur', std: 95000 },
      { k: 'b2', l: 'Inkomen volgend jaar', s: 'eur', std: 40000 },
      { k: 'u', l: 'Te verschuiven bedrag', s: 'eur', std: 15000 },
      { k: 'r', l: 'Rente op uitgestelde belasting', s: 'pct', std: 3, opt: true }
    ],
    bereken(v) {
      if (v.u <= 0 || v.u > v.b1) return { fout: 'Het te verschuiven bedrag moet groter dan nul en niet hoger dan het inkomen van dit jaar zijn.' };
      const hef = x => F.netto(x).heffing;
      const h0 = hef(v.b1) + hef(v.b2), h1 = hef(v.b1 - v.u) + hef(v.b2 + v.u), bes = h0 - h1;
      const uitgesteld = hef(v.b1) - hef(v.b1 - v.u), rente = uitgesteld * v.r / 100;
      return {
        lbl: 'Totaal voordeel', groot: fmt.euro0(bes + rente), onder: fmt.pct((bes + rente) / v.u * 100, 1) + ' van het verschoven bedrag',
        rijen: [['Belasting zonder verschuiven', fmt.euro0(h0)], ['Belasting met verschuiven', fmt.euro0(h1)], ['Belastingbesparing', fmt.euro0(bes)],
          ['Belasting die een jaar later valt', fmt.euro0(uitgesteld)], ['Rentevoordeel over één jaar', fmt.euro0(rente), 'som']]
      };
    },
    uitleg: 'Besparing = (belasting jaar 1 + jaar 2 zonder verschuiven) − (idem met verschuiven). Rentevoordeel = belasting die door het verschuiven een jaar later wordt betaald × rente. Beide jaren worden met dezelfde normen (' + PEIL + ') berekend.',
    letop: LETOP_IB + ' Verschuiven moet fiscaal en arbeidsrechtelijk mogelijk zijn: loon is belast bij genieten, en een afspraak die alleen dient om belasting te ontgaan kan worden genegeerd. Tariefwijzigingen tussen de jaren zitten niet in de berekening.'
  });

  RT.add({
    id: 'bijtelling-auto', groep: 'fiscaal-box1', naam: 'Leaseauto: bijtelling en netto kosten',
    intro: 'Wat kost een auto van de zaak netto per maand aan extra belasting, bij het eigen inkomen?',
    kw: 'bijtelling leaseauto auto van de zaak elektrisch youngtimer eigen bijdrage',
    peildatum: EIGEN.peildatum, fiscaal: ['bijtellingspercentages', 'cap elektrisch'].concat(IB),
    velden: [
      { k: 'w', l: 'Cataloguswaarde (of dagwaarde youngtimer)', s: 'eur', std: 45000 },
      { k: 's', l: 'Soort auto', s: 'keuze', opties: [['ev', 'Volledig elektrisch'], ['fos', 'Benzine, diesel of hybride'], ['old', 'Youngtimer (15 jaar of ouder)']], std: 'ev' },
      { k: 'ink', l: 'Bruto jaarloon zonder bijtelling', s: 'eur', std: 60000 },
      { k: 'eb', l: 'Eigen bijdrage per maand', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const B = EIGEN.bijtelling;
      let bij;
      if (v.s === 'ev') bij = Math.min(v.w, B.capElektrisch) * B.elektrisch / 100 + pos(v.w - B.capElektrisch) * B.algemeen / 100;
      else if (v.s === 'old') bij = v.w * B.youngtimer / 100;
      else bij = v.w * B.algemeen / 100;
      const eb = v.eb * 12, belast = pos(bij - eb);
      const extra = F.netto(v.ink + belast).heffing - F.netto(v.ink).heffing;
      const kosten = extra + eb;
      return {
        lbl: 'Netto kosten per maand', groot: fmt.euro0(kosten / 12), onder: 'extra belasting plus eigen bijdrage',
        rijen: [['Bijtelling per jaar', fmt.euro0(bij)], ['Effectief bijtellingspercentage', v.w > 0 ? fmt.pct(bij / v.w * 100, 1) : '–'], ['Eigen bijdrage per jaar', fmt.euro0(eb)],
          ['Belaste bijtelling', fmt.euro0(belast)], ['Extra belasting per jaar', fmt.euro0(extra)], ['Netto kosten per jaar', fmt.euro0(kosten), 'som']]
      };
    },
    uitleg: 'Bijtelling = cataloguswaarde × percentage. Elektrisch: lager percentage tot de cap van ' + fmt.euro0(EIGEN.bijtelling.capElektrisch) + ', daarboven het algemene percentage. Youngtimer: percentage over de dagwaarde. De eigen bijdrage verlaagt de bijtelling. Extra belasting = belasting over (loon + belaste bijtelling) − belasting over het loon, inclusief afbouw van kortingen.',
    letop: LETOP_EIGEN + ' Het percentage hangt af van het jaar van eerste toelating en staat in de regel 60 maanden vast; voor elektrische auto’s verschillen percentage en cap per jaar. Minder dan 500 km privé per jaar (met sluitende rittenregistratie) betekent geen bijtelling.'
  });

  RT.add({
    id: 'fiets-van-de-zaak', groep: 'fiscaal-box1', naam: 'Fiets van de zaak: bijtelling',
    intro: 'Een leasefiets via de werkgever: wat kost de bijtelling netto, en hoe verhoudt dat zich tot zelf kopen?',
    kw: 'fiets van de zaak leasefiets bijtelling e-bike',
    peildatum: EIGEN.peildatum, fiscaal: ['bijtelling fiets'].concat(IB),
    velden: [
      { k: 'p', l: 'Adviesprijs fiets (incl. btw)', s: 'eur', std: 3200 },
      { k: 'ink', l: 'Bruto jaarloon zonder bijtelling', s: 'eur', std: 50000 },
      { k: 'eb', l: 'Eigen bijdrage per maand', s: 'eur', std: 0, opt: true },
      { k: 'jr', l: 'Gebruiksduur', s: 'num', na: 'jaar', std: 3 }
    ],
    bereken(v) {
      const bij = v.p * EIGEN.fiets.pct / 100, eb = v.eb * 12, belast = pos(bij - eb);
      const extra = F.netto(v.ink + belast).heffing - F.netto(v.ink).heffing, kosten = extra + eb;
      return {
        lbl: 'Netto kosten per maand', groot: fmt.euro(kosten / 12), onder: fmt.euro0(kosten) + ' per jaar',
        rijen: [['Bijtelling per jaar', fmt.euro0(bij)], ['Extra belasting per jaar', fmt.euro0(extra)], ['Eigen bijdrage per jaar', fmt.euro0(eb)],
          ['Kosten over ' + fmt.getal(v.jr) + ' jaar', fmt.euro0(kosten * v.jr)], ['Verschil met zelf kopen', fmt.euro0(v.p - kosten * v.jr), 'som']]
      };
    },
    uitleg: 'Bijtelling = adviesprijs × ' + fmt.pct(EIGEN.fiets.pct, 0) + ' per jaar, verminderd met de eigen bijdrage. Extra belasting = belasting over (loon + bijtelling) − belasting over het loon. Verschil met zelf kopen = adviesprijs − netto kosten over de gebruiksduur (zonder onderhoud, verzekering en restwaarde).',
    letop: LETOP_EIGEN + ' Bij leasen via brutoloonruil gelden andere regels. Onderhoud en verzekering zitten meestal in het leasecontract; zelf kopen betekent die kosten zelf dragen, maar ook eigendom na afloop.'
  });

  RT.add({
    id: 'belastingdruk-box1', groep: 'fiscaal-box1', naam: 'Gemiddelde en marginale druk box 1',
    intro: 'Hoeveel procent van het inkomen gaat gemiddeld naar belasting, en hoeveel van de laatste euro’s?',
    kw: 'belastingdruk gemiddelde druk marginale druk box 1',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Bruto jaarinkomen', s: 'eur', std: 62000 },
      { k: 'arb', l: 'Inkomen uit werk', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      const o = Object.assign(aowOpt(v.aow), v.arb === 'ja' ? {} : { arbeid: 0 });
      const r = F.netto(v.b, o), m = F.marginaleDruk(v.b, o);
      return {
        lbl: 'Marginale druk', groot: fmt.pct(m, 1), onder: 'gemiddelde druk ' + fmt.pct(r.gemiddeldeDruk, 1),
        rijen: kortingRijen(r).concat([['Netto per jaar', fmt.euro0(r.netto)], ['Schijftarief', fmt.pct(r.schijfTarief)], ['Extra door afbouw kortingen', fmt.pct(m - r.schijfTarief, 1), 'som']])
      };
    },
    uitleg: 'Gemiddelde druk = te betalen belasting / bruto inkomen. Marginale druk = (1 − extra netto bij € 100 meer bruto / € 100) × 100%, dus inclusief afbouw (of opbouw) van heffingskortingen.',
    letop: LETOP_IB + ' Toeslagen verhogen de marginale druk verder; zie <a href="#meer-werken-met-toeslagen">Meer werken: netto inclusief toeslagen</a>.'
  });

  RT.add({
    id: 'marginaal-tarief', groep: 'fiscaal-box1', naam: 'Belasting over de volgende € 1.000',
    intro: 'Wat gaat er af van een extra bedrag inkomen: loon, winst of uitkering, inclusief afbouw van kortingen?',
    kw: 'marginaal tarief laatste euro extra inkomen winst ondernemer',
    peildatum: PEIL, fiscaal: IB.concat(['ondernemersaftrek', 'mkb-winstvrijstelling', 'Zvw-bijdrage']),
    velden: [
      { k: 'b', l: 'Huidig inkomen (of winst)', s: 'eur', std: 62000 },
      { k: 'stap', l: 'Extra inkomen', s: 'eur', std: 1000 },
      { k: 's', l: 'Soort inkomen', s: 'keuze', opties: [['loon', 'Loon'], ['winst', 'Winst uit onderneming'], ['uitk', 'Uitkering of pensioen']], std: 'loon' }
    ],
    bereken(v) {
      if (v.stap <= 0) return { fout: 'Vul een extra bedrag groter dan nul in.' };
      let a, b, rijen = [];
      if (v.s === 'winst') {
        a = F.ondernemer(v.b).netto; b = F.ondernemer(v.b + v.stap).netto;
        rijen.push(['Mkb-winstvrijstelling', fmt.pct(N.ondernemer.mkbVrijstellingPct, 1)]);
      } else {
        const o = v.s === 'uitk' ? { arbeid: 0 } : {};
        const ra = F.netto(v.b, o);
        a = ra.netto; b = F.netto(v.b + v.stap, o).netto;
        rijen.push(['Schijftarief', fmt.pct(ra.schijfTarief)]);
      }
      const m = (1 - (b - a) / v.stap) * 100;
      return {
        lbl: 'Marginaal tarief', groot: fmt.pct(m, 1), onder: 'u houdt ' + fmt.euro0(b - a) + ' over van ' + fmt.euro0(v.stap),
        rijen: [['Netto nu', fmt.euro0(a)], ['Netto met extra', fmt.euro0(b)]].concat(rijen, [['Belasting over het extra bedrag', fmt.euro0(v.stap - (b - a)), 'som']])
      };
    },
    uitleg: 'Marginaal tarief = 1 − (netto met extra − netto nu) / extra bedrag. Bij winst wordt gerekend met zelfstandigenaftrek, mkb-winstvrijstelling en de Zvw-bijdrage (urencriterium gehaald, geen starter).',
    letop: LETOP_IB + ' Bij winst: de Zvw-bijdrage is meegenomen, de ondernemersfaciliteiten vereenvoudigd. Toeslagen zijn niet meegenomen.'
  });

  RT.add({
    id: 'kortingen-en-druk-tabel', groep: 'fiscaal-box1', naam: 'Heffingskortingen en druk per inkomen',
    intro: 'Tabel per inkomensniveau met algemene heffingskorting, arbeidskorting, belasting en gemiddelde en marginale druk.',
    kw: 'tabel heffingskortingen druk per inkomen arbeidskorting afbouw',
    peildatum: PEIL, fiscaal: IB,
    velden: [
      { k: 'b', l: 'Inkomen voor de uitkomst', s: 'eur', std: 45000 },
      { k: 'soort', l: 'Soort inkomen', s: 'keuze', opties: SOORT, std: 'arbeid' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' },
      { k: 'stap', l: 'Stapgrootte tabel', s: 'eur', std: 10000 }
    ],
    bereken(v) {
      const opt = () => Object.assign(aowOpt(v.aow), v.soort === 'uitk' ? { arbeid: 0 } : {});
      const r = F.netto(v.b, opt()), m = F.marginaleDruk(v.b, opt(), 1000);
      const stap = Math.max(2500, v.stap), rij = [];
      for (let x = stap; x <= 160000; x += stap) {
        const q = F.netto(x, opt());
        rij.push([fmt.euro0(x), fmt.euro0(q.kortingen.ahk), fmt.euro0(q.kortingen.arbeidskorting), fmt.euro0(q.heffing), fmt.pct(q.gemiddeldeDruk, 1), fmt.pct(F.marginaleDruk(x, opt(), 1000), 1)]);
      }
      return {
        lbl: 'Heffingskortingen samen', groot: fmt.euro0(r.kortingTotaal), onder: 'bij ' + fmt.euro0(v.b) + ' inkomen',
        rijen: kortingRijen(r).concat([['Gemiddelde druk', fmt.pct(r.gemiddeldeDruk, 1)], ['Marginale druk', fmt.pct(m, 1)], ['Extra door afbouw kortingen', fmt.pct(m - r.schijfTarief, 1), 'som']]),
        tabel: { titel: 'Per inkomensniveau', kop: ['Inkomen', 'Alg. korting', 'Arbeidskorting', 'Belasting', 'Gem. druk', 'Marg. druk'], rijen: rij }
      };
    },
    uitleg: 'Per inkomensniveau: algemene heffingskorting en arbeidskorting volgens de normen, belasting na kortingen, gemiddelde druk = belasting / inkomen, marginale druk = belasting over € 1.000 extra inclusief afbouw van kortingen. Kortingen boven de belasting gaan verloren.',
    letop: LETOP_IB + ' De tabel loopt tot € 160.000; de stapgrootte is minimaal € 2.500.'
  });

  /* =================== Heffingskortingen en aftrek =================== */

  RT.add({
    id: 'algemene-heffingskorting', groep: 'fiscaal-box1', naam: 'Algemene heffingskorting bij een inkomen',
    intro: 'Hoe hoog is de algemene heffingskorting bij een bepaald inkomen, en waar is hij helemaal afgebouwd?',
    kw: 'algemene heffingskorting ahk afbouw',
    peildatum: PEIL, fiscaal: ['algemene heffingskorting'],
    velden: [
      { k: 'ink', l: 'Inkomen', s: 'eur', std: 45000, tip: 'Verzamelinkomen: box 1 + box 2 + box 3.' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const aow = v.aow === 'ja', a = N.ahk, max = aow ? a.maxAow : a.max, p = aow ? a.afbouwPctAow : a.afbouwPct;
      const k = F.ahk(v.ink, { aow }), nul = a.afbouwVanaf + max / (p / 100);
      return {
        lbl: 'Algemene heffingskorting', groot: fmt.euro0(k), onder: fmt.euro0(k / 12) + ' per maand',
        rijen: [['Maximum', fmt.euro0(max)], ['Afbouw vanaf', fmt.euro0(a.afbouwVanaf)], ['Afbouwpercentage', fmt.pct(p, 3)], ['Afbouw bij dit inkomen', fmt.euro0(max - k)],
          [nul <= N.box1.schijf2Grens ? 'Korting nul vanaf' : 'Minimum (afbouw stopt)', nul <= N.box1.schijf2Grens ? fmt.euro0(nul) : fmt.euro0(F.ahk(N.box1.schijf2Grens, { aow })), 'som']]
      };
    },
    uitleg: 'Korting = maximum − afbouwpercentage × (inkomen − afbouwgrens), niet onder nul. Boven de grens van de tweede schijf loopt de afbouw niet verder.',
    letop: 'Normen ' + PEIL + ', nog niet allemaal geverifieerd. De korting kan niet hoger worden dan de verschuldigde belasting; bij een minstverdienende partner wordt hij alleen in uitzonderingsgevallen (deels) uitbetaald. Inkomen in box 2 en box 3 telt mee voor de afbouw; zie <a href="#heffingskorting-box2-box3">Heffingskorting bij inkomen in box 2 en 3</a>.'
  });

  RT.add({
    id: 'heffingskorting-box2-box3', groep: 'fiscaal-box1', naam: 'Heffingskorting bij inkomen in box 2 en 3',
    intro: 'De afbouw van de algemene heffingskorting loopt over het hele verzamelinkomen. Wat kost extra inkomen in box 1, 2 of 3 dan echt?',
    kw: 'heffingskorting box 2 box 3 verzamelinkomen afbouw dividend sparen',
    peildatum: PEIL, fiscaal: ['algemene heffingskorting', 'box 1-schijven', 'box 2-tarief', 'box 3-tarief'],
    velden: [
      { k: 'b1', l: 'Inkomen box 1', s: 'eur', std: 40000 },
      { k: 'b2', l: 'Inkomen box 2', s: 'eur', std: 0, opt: true },
      { k: 'b3', l: 'Voordeel box 3', s: 'eur', std: 5000, opt: true },
      { k: 'e', l: 'Extra inkomen', s: 'eur', std: 10000 },
      { k: 'box', l: 'Extra inkomen valt in', s: 'keuze', opties: [['1', 'Box 1'], ['2', 'Box 2'], ['3', 'Box 3']], std: '3' }
    ],
    bereken(v) {
      if (v.e <= 0) return { fout: 'Vul een extra inkomen groter dan nul in.' };
      const vz = v.b1 + v.b2 + v.b3, k0 = F.ahk(vz), k1 = F.ahk(vz + v.e);
      let bel;
      if (v.box === '1') bel = F.box1(v.b1 + v.e).belasting - F.box1(v.b1).belasting;
      else if (v.box === '2') bel = F.box2(v.b2 + v.e) - F.box2(v.b2);
      else bel = v.e * N.box3.tarief / 100;
      const last = bel + (k0 - k1);
      return {
        lbl: 'Effectieve druk op het extra inkomen', groot: fmt.pct(last / v.e * 100, 1), onder: fmt.euro0(last) + ' belasting en verloren korting',
        rijen: [['Verzamelinkomen nu', fmt.euro0(vz)], ['Heffingskorting nu', fmt.euro0(k0)], ['Heffingskorting straks', fmt.euro0(k1)], ['Verlies aan korting', fmt.euro0(k0 - k1)],
          ['Belasting in box ' + v.box, fmt.euro0(bel), 'som']],
        signalen: k0 > k1 && v.box !== '1' ? ['Inkomen in box ' + v.box + ' kent geen arbeidskorting, maar verlaagt wel de algemene heffingskorting. Het werkelijke tarief ligt daardoor hoger dan het boxtarief.'] : []
      };
    },
    uitleg: 'Verzamelinkomen = box 1 + box 2 + box 3. Verlies aan korting = algemene heffingskorting bij het huidige verzamelinkomen − idem na het extra inkomen. Belasting: box 1 via de schijven, box 2 via de twee box 2-tarieven, box 3 tegen het box 3-tarief over het extra voordeel. Effectieve druk = (belasting + verlies aan korting) / extra inkomen.',
    letop: 'Normen ' + PEIL + ', nog niet allemaal geverifieerd. Het box 1-deel rekent zonder arbeidskorting; bij extra loon verandert die ook. In box 3 is het voordeel een forfaitair of werkelijk rendement, niet het vermogen zelf.'
  });

  RT.add({
    id: 'arbeidskorting-berekenen', groep: 'fiscaal-box1', naam: 'Arbeidskorting bij een arbeidsinkomen',
    intro: 'Hoe hoog is de arbeidskorting bij een bepaald inkomen uit werk, en in welke fase van opbouw of afbouw valt dat inkomen?',
    kw: 'arbeidskorting opbouw afbouw arbeidsinkomen',
    peildatum: PEIL, fiscaal: ['arbeidskorting'],
    velden: [
      { k: 'ai', l: 'Arbeidsinkomen', s: 'eur', std: 45000, tip: 'Loon of winst uit onderneming; geen uitkering of pensioen.' },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const a = N.arbeidskorting, aow = v.aow === 'ja', f = aow ? a.factorAow : 1;
      const k = F.arbeidskorting(v.ai, { aow }), top = F.arbeidskorting(a.knik3, { aow }), nul = a.knik3 + F.arbeidskorting(a.knik3) / (a.afbouwPct / 100);
      const fase = v.ai <= a.knik1 ? 'opbouw, eerste traject' : v.ai <= a.knik2 ? 'opbouw, tweede traject' : v.ai <= a.knik3 ? 'opbouw, derde traject' : v.ai < nul ? 'afbouw' : 'volledig afgebouwd';
      return {
        lbl: 'Arbeidskorting', groot: fmt.euro0(k), onder: fase,
        rijen: [['Maximale arbeidskorting', fmt.euro0(top)], ['Maximum bereikt bij', fmt.euro0(a.knik3)], ['Afbouw per € 1.000 extra', v.ai > a.knik3 && v.ai < nul ? fmt.euro0(10 * a.afbouwPct * f) : '–'],
          ['Korting nul vanaf', fmt.euro0(nul), 'som']]
      };
    },
    uitleg: 'Opbouw: ' + fmt.pct(N.arbeidskorting.pct1, 3) + ' tot ' + fmt.euro0(N.arbeidskorting.knik1) + ', ' + fmt.pct(N.arbeidskorting.pct2, 3) + ' tot ' + fmt.euro0(N.arbeidskorting.knik2) + ', ' + fmt.pct(N.arbeidskorting.pct3, 3) + ' tot ' + fmt.euro0(N.arbeidskorting.knik3) + '. Daarboven afbouw met ' + fmt.pct(N.arbeidskorting.afbouwPct, 3) + ' van het meerdere tot nul. Vanaf de AOW-leeftijd hier vereenvoudigd gehalveerd.',
    letop: 'Normen ' + PEIL + ', nog niet allemaal geverifieerd. Vanaf de AOW-leeftijd gelden eigen (lagere) bedragen; de halvering is een benadering. De korting is niet hoger dan de belasting.'
  });

  RT.add({
    id: 'combinatiekorting', groep: 'fiscaal-box1', naam: 'Combinatiekorting voor werkende ouders',
    intro: 'Werkende ouders met een jong kind kunnen recht hebben op de inkomensafhankelijke combinatiekorting. Hoeveel is dat?',
    kw: 'combinatiekorting iack werkende ouder kind jonger dan 12',
    peildatum: PEIL, fiscaal: ['combinatiekorting'],
    velden: [
      { k: 'ai', l: 'Arbeidsinkomen', s: 'eur', std: 28000 },
      { k: 'kind', l: 'Kind jonger dan 12 op het woonadres', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'min', l: 'Minstverdienende partner of alleenstaande ouder', s: 'keuze', opties: JANEE, std: 'ja' },
      { k: 'geb', l: 'Kind geboren vóór 1 januari 2025', s: 'keuze', opties: JANEE, std: 'ja' }
    ],
    bereken(v) {
      const recht = v.kind === 'ja' && v.min === 'ja' && v.geb === 'ja', I = N.iack;
      const k = recht ? F.iack(v.ai, true) : 0;
      return {
        lbl: 'Combinatiekorting', groot: fmt.euro0(k), onder: recht ? fmt.euro0(k / 12) + ' per maand' : 'geen recht volgens de antwoorden',
        rijen: [['Drempel arbeidsinkomen', fmt.euro0(I.drempel)], ['Opbouw', fmt.pct(I.pct)], ['Maximum', fmt.euro0(I.max)], ['Maximum bereikt vanaf', fmt.euro0(I.drempel + I.max / (I.pct / 100)), 'som']],
        signalen: v.geb === 'nee' ? ['Voor kinderen geboren vanaf 1 januari 2025 bestaat geen recht meer op de combinatiekorting.'] : []
      };
    },
    uitleg: 'Korting = (arbeidsinkomen − drempel) × opbouwpercentage, met een maximum. Voorwaarden: kind jonger dan 12 dat minstens zes maanden op uw adres staat ingeschreven, en u bent de minstverdienende partner of alleenstaande ouder.',
    letop: 'Normen ' + PEIL + ', nog niet allemaal geverifieerd. De combinatiekorting wordt afgebouwd: geen recht meer voor kinderen geboren vanaf 2025, en de regeling loopt de komende jaren af. Controleer de actuele voorwaarden.'
  });

  RT.add({
    id: 'ouderenkorting-berekenen', groep: 'fiscaal-box1', naam: 'Ouderenkorting bij een inkomen',
    intro: 'Vanaf de AOW-leeftijd: hoe hoog zijn de ouderenkorting en de alleenstaande-ouderenkorting bij een bepaald verzamelinkomen?',
    kw: 'ouderenkorting alleenstaande ouderenkorting aow gepensioneerd',
    peildatum: PEIL, fiscaal: ['ouderenkorting'],
    velden: [
      { k: 'vz', l: 'Verzamelinkomen', s: 'eur', std: 42000 },
      { k: 's', l: 'Woonsituatie', s: 'keuze', opties: [['alleen', 'Alleenstaand (AOW voor alleenstaanden)'], ['samen', 'Samenwonend of gehuwd']], std: 'alleen' }
    ],
    bereken(v) {
      const o = N.ouderenkorting, ok = F.ouderenkorting(v.vz, false), alo = v.s === 'alleen' ? o.alleenstaand : 0;
      return {
        lbl: 'Ouderenkortingen samen', groot: fmt.euro0(ok + alo), onder: fmt.euro0((ok + alo) / 12) + ' per maand',
        rijen: [['Ouderenkorting', fmt.euro0(ok)], ['Alleenstaande-ouderenkorting', fmt.euro0(alo)], ['Afbouwgrens', fmt.euro0(o.afbouwVanaf)],
          ['Afbouw per € 1.000 erboven', fmt.euro0(10 * o.afbouwPct)], ['Ouderenkorting nul vanaf', fmt.euro0(o.afbouwVanaf + o.max / (o.afbouwPct / 100)), 'som']]
      };
    },
    uitleg: 'Ouderenkorting = maximum − afbouwpercentage × (verzamelinkomen − afbouwgrens), niet onder nul. De alleenstaande-ouderenkorting is een vast bedrag zonder afbouw.',
    letop: 'Normen ' + PEIL + ', nog niet allemaal geverifieerd. Alleen voor wie de AOW-leeftijd heeft bereikt; de alleenstaande-ouderenkorting alleen bij een AOW-uitkering voor alleenstaanden (of een vergelijkbare situatie). De kortingen worden niet uitbetaald voor zover ze hoger zijn dan de belasting.'
  });

  RT.add({
    id: 'netto-voordeel-aftrekpost', groep: 'fiscaal-box1', naam: 'Wat levert een aftrekpost netto op',
    intro: 'Een gift, zorgkosten of hypotheekrente: hoeveel belasting scheelt een aftrekpost echt, inclusief het effect op de heffingskortingen?',
    kw: 'aftrekpost netto voordeel gift zorgkosten aftrek effect heffingskorting',
    peildatum: PEIL, fiscaal: IB.concat(['maximaal aftrektarief']),
    velden: [
      { k: 'b', l: 'Bruto jaarinkomen', s: 'eur', std: 62000 },
      { k: 'a', l: 'Aftrekpost', s: 'eur', std: 5000 },
      { k: 'ts', l: 'Valt onder de tariefsaanpassing', s: 'keuze', opties: JANEE, std: 'ja', tip: 'Ja voor eigen woning, persoonsgebonden aftrek en ondernemersaftrek.' },
      { k: 'tsl', l: 'Extra toeslagen door lager inkomen', s: 'eur', std: 0, opt: true },
      { k: 'aow', l: 'AOW-leeftijd bereikt', s: 'keuze', opties: AOWK, std: 'nee' }
    ],
    bereken(v) {
      if (v.a <= 0) return { fout: 'Vul een aftrekpost groter dan nul in.' };
      const o = Object.assign(aowOpt(v.aow), { arbeid: v.b });
      const r0 = F.netto(v.b, o), r1 = F.netto(v.b, Object.assign({}, o, { aftrek: v.a }));
      const inTop = v.ts === 'ja' ? pos(Math.min(v.a, v.b - N.box1.schijf2Grens)) : 0;
      const aanp = inTop * pos(N.box1.tarief3 - N.aftrekTariefMax) / 100;
      const voordeel = r0.heffing - r1.heffing - aanp;
      return {
        lbl: 'Netto voordeel', groot: fmt.euro0(voordeel + v.tsl), onder: 'effectief ' + fmt.pct(voordeel / v.a * 100, 1) + ' van de aftrekpost',
        rijen: [['Belasting zonder aftrek', fmt.euro0(r0.heffing)], ['Belasting met aftrek', fmt.euro0(r1.heffing)], ['Tariefsaanpassing', fmt.euro0(aanp)],
          ['Belastingvoordeel', fmt.euro0(voordeel)], ['Extra toeslagen', fmt.euro0(v.tsl)], ['Netto kosten van de uitgave', fmt.euro0(v.a - voordeel - v.tsl), 'som']]
      };
    },
    uitleg: 'Voordeel = belasting zonder aftrek − belasting met aftrek (beide met schijven en heffingskortingen; een lager inkomen kan de algemene heffingskorting verhogen) − tariefsaanpassing over het deel dat in de hoogste schijf valt.',
    letop: LETOP_IB + ' Veel aftrekposten kennen een drempel (zorgkosten, giften) of een maximum; vul het bedrag na drempel in.'
  });

  RT.add({
    id: 'tariefsaanpassing', groep: 'fiscaal-box1', naam: 'Aftrek beperkt tot het maximumtarief',
    intro: 'In de hoogste schijf zijn aftrekposten zoals hypotheekrente maar tegen een lager maximumtarief aftrekbaar. Hoeveel aftrek gaat daardoor verloren?',
    kw: 'tariefsaanpassing maximaal aftrektarief hypotheekrenteaftrek eigen woning hoogste schijf',
    peildatum: PEIL, fiscaal: ['box 1-schijven', 'maximaal aftrektarief'],
    velden: [
      { k: 'b', l: 'Belastbaar inkomen vóór de aftrek', s: 'eur', std: 95000 },
      { k: 'a', l: 'Aftrekpost', s: 'eur', std: 12000 },
      { k: 'soort', l: 'Soort aftrek', s: 'keuze', opties: [['ew', 'Saldo eigen woning (rente min forfait)'], ['pga', 'Persoonsgebonden aftrek'], ['ond', 'Ondernemersaftrek en mkb-vrijstelling']], std: 'ew' }
    ],
    bereken(v) {
      if (v.a <= 0) return { fout: 'Vul een aftrekpost groter dan nul in.' };
      const vol = F.box1(v.b).belasting - F.box1(pos(v.b - v.a)).belasting;
      const inTop = pos(Math.min(v.a, v.b - N.box1.schijf2Grens)), verschil = pos(N.box1.tarief3 - N.aftrekTariefMax);
      const aanp = inTop * verschil / 100, werk = vol - aanp;
      return {
        lbl: 'Tariefsaanpassing', groot: fmt.euro0(aanp), onder: fmt.euro0(aanp / 12) + ' per maand minder voordeel',
        rijen: [['Deel in de hoogste schijf', fmt.euro0(inTop)], ['Voordeel zonder beperking', fmt.euro0(vol)], ['Voordeel na tariefsaanpassing', fmt.euro0(werk)],
          ['Effectief aftrektarief', fmt.pct(werk / v.a * 100)], ['Maximaal aftrektarief', fmt.pct(N.aftrekTariefMax), 'som']],
        signalen: (inTop === 0 ? ['De aftrek valt helemaal buiten de hoogste schijf: geen tariefsaanpassing.'] : []).concat({
          ew: 'Eigen woning: de tariefsaanpassing geldt over het negatieve saldo van rente en kosten min eigenwoningforfait.',
          pga: 'Persoonsgebonden aftrek (zoals giften, zorgkosten, partneralimentatie): de beperking geldt over het deel in de hoogste schijf.',
          ond: 'Ondernemersaftrek en mkb-winstvrijstelling: de tariefsaanpassing wordt over die posten in de aangifte bijgeteld.'
        }[v.soort] || [])
      };
    },
    uitleg: 'Deel in de hoogste schijf = het laagste van de aftrekpost en (inkomen − grens tweede schijf). Tariefsaanpassing = dat deel × (tarief derde schijf − maximaal aftrektarief). De rest van de aftrek levert het gewone schijftarief op. Heffingskortingen zijn hier buiten beschouwing gelaten; zie daarvoor <a href="#netto-voordeel-aftrekpost">Wat levert een aftrekpost netto op</a>.',
    letop: 'Normen ' + PEIL + ', nog niet allemaal geverifieerd. Bij de eigen woning geldt de tariefsaanpassing over het negatieve saldo (rente en kosten min eigenwoningforfait); een positief saldo wordt gewoon in de schijven belast. Wordt de aftrek over twee partners verdeeld, reken dan per partner.'
  });

  /* =================== Toeslagen =================== */

  RT.add({
    id: 'toetsingsinkomen', groep: 'fiscaal-box1', naam: 'Toetsingsinkomen voor toeslagen',
    intro: 'Het toetsingsinkomen voor toeslagen is het verzamelinkomen van de aanvrager plus dat van de toeslagpartner.',
    kw: 'toetsingsinkomen toeslagen verzamelinkomen partner',
    velden: [
      { k: 'loon', l: 'Bruto loon of uitkering', s: 'eur', std: 42000 },
      { k: 'ov', l: 'Overig inkomen box 1', s: 'eur', std: 0, opt: true },
      { k: 'ew', l: 'Saldo eigen woning', s: 'bedrag', std: -6500, opt: true, tip: 'Negatief bij aftrek.' },
      { k: 'aftr', l: 'Overige aftrekposten', s: 'eur', std: 0, opt: true },
      { k: 'b2', l: 'Inkomen box 2', s: 'eur', std: 0, opt: true },
      { k: 'b3', l: 'Voordeel box 3', s: 'eur', std: 0, opt: true },
      { k: 'p', l: 'Toetsingsinkomen toeslagpartner', s: 'eur', std: 0, opt: true }
    ],
    bereken(v) {
      const b1 = v.loon + v.ov + v.ew - v.aftr, eigen = pos(b1) + v.b2 + v.b3, samen = eigen + v.p;
      return {
        lbl: 'Gezamenlijk toetsingsinkomen', groot: fmt.euro0(samen), onder: fmt.euro0(samen / 12) + ' per maand',
        rijen: [['Inkomen box 1', fmt.euro0(b1)], ['Box 2', fmt.euro0(v.b2)], ['Box 3', fmt.euro0(v.b3)], ['Eigen toetsingsinkomen', fmt.euro0(eigen)], ['Partner', fmt.euro0(v.p), 'som']]
      };
    },
    uitleg: 'Eigen toetsingsinkomen = box 1 (bruto + saldo eigen woning − aftrekposten, niet onder nul) + box 2 + box 3. Voor de toeslagen telt het inkomen van beide toeslagpartners samen.',
    letop: 'De toeslag wordt definitief vastgesteld op het verzamelinkomen uit de aanslag. Een bonus of nabetaling kan het toetsingsinkomen achteraf verhogen en tot terugbetalen leiden. Schat het inkomen daarom liever iets te hoog dan te laag.'
  });

  RT.add({
    id: 'zorgtoeslag-indicatie', groep: 'fiscaal-box1', naam: 'Zorgtoeslag (indicatie)',
    intro: 'Een indicatie van de zorgtoeslag bij een toetsingsinkomen en vermogen, voor een alleenstaande of met toeslagpartner.',
    kw: 'zorgtoeslag toeslag zorgverzekering toetsingsinkomen vermogensgrens',
    peildatum: EIGEN.peildatum, fiscaal: ['zorgtoeslag'],
    velden: [
      { k: 'ink', l: 'Toetsingsinkomen (samen)', s: 'eur', std: 28000 },
      { k: 's', l: 'Huishouden', s: 'keuze', opties: [['alleen', 'Alleenstaand'], ['partner', 'Met toeslagpartner']], std: 'alleen' },
      { k: 'verm', l: 'Vermogen op 1 januari (samen)', s: 'eur', std: 20000, opt: true }
    ],
    bereken(v) {
      const z = zorgtoeslag(v.ink, v.s === 'partner', v.verm);
      return {
        lbl: 'Zorgtoeslag per maand', groot: fmt.euro0(z.bedrag / 12), onder: fmt.euro0(z.bedrag) + ' per jaar',
        rijen: [['Maximale toeslag per jaar', fmt.euro0(z.max)], ['Inkomen boven de drempel', fmt.euro0(pos(v.ink - EIGEN.zorgtoeslag.drempel))], ['Afbouw', fmt.euro0(Math.min(z.max, z.afbouw))],
          ['Vermogensgrens', fmt.euro0(z.vg)], ['Geen toeslag vanaf inkomen', fmt.euro0(z.nulVanaf), 'som']],
        signalen: z.teVeel ? ['Het vermogen ligt boven de vermogensgrens: geen recht op zorgtoeslag.'] : []
      };
    },
    uitleg: 'Toeslag = maximale toeslag − afbouwpercentage × (toetsingsinkomen − drempelinkomen), niet onder nul; nul als het vermogen boven de grens ligt.',
    letop: LETOP_EIGEN + ' De werkelijke zorgtoeslag hangt af van de standaardpremie en het normpercentage per jaar. Voorwaarden: 18 jaar of ouder en een Nederlandse zorgverzekering. Voorschotten worden achteraf definitief berekend.'
  });

  RT.add({
    id: 'huurtoeslag-indicatie', groep: 'fiscaal-box1', naam: 'Huurtoeslag (indicatie)',
    intro: 'Een benadering van de huurtoeslag: welk deel van de huur boven de eigen bijdrage wordt vergoed?',
    kw: 'huurtoeslag rekenhuur kwaliteitskortingsgrens aftoppingsgrens',
    peildatum: EIGEN.peildatum, fiscaal: ['huurtoeslag'],
    velden: [
      { k: 'huur', l: 'Rekenhuur per maand', s: 'eur', std: 720, tip: 'Kale huur plus bepaalde servicekosten.' },
      { k: 'ink', l: 'Toetsingsinkomen (samen)', s: 'eur', std: 26000 },
      { k: 'partner', l: 'Met toeslagpartner', s: 'keuze', opties: JANEE, std: 'nee' },
      { k: 'pers', l: 'Aantal personen in het huishouden', s: 'num', std: 1 },
      { k: 'verm', l: 'Vermogen op 1 januari', s: 'eur', std: 10000, opt: true }
    ],
    bereken(v) {
      const h = huurtoeslag(v.huur, v.ink, Math.round(v.pers), v.partner === 'ja', v.verm);
      if (h.geen) return {
        lbl: 'Huurtoeslag per maand', groot: fmt.euro0(0), onder: h.geen === 'huur' ? 'huur boven de huurgrens' : 'vermogen boven de grens',
        rijen: [h.geen === 'huur' ? ['Huurgrens', fmt.euro(EIGEN.huurtoeslag.huurgrens)] : ['Vermogensgrens', fmt.euro0(h.vg)]], signalen: []
      };
      return {
        lbl: 'Huurtoeslag per maand', groot: fmt.euro0(h.bedrag), onder: fmt.euro0(h.bedrag * 12) + ' per jaar',
        rijen: [['Eigen bijdrage per maand', fmt.euro(h.eigen)], ['Vergoed 100% (tot kwaliteitskortingsgrens)', fmt.euro(h.d1)], ['Vergoed 65% (tot aftoppingsgrens)', fmt.euro(h.d2 * 0.65)],
          ['Vergoed 40% (tot huurgrens)', fmt.euro(h.d3 * 0.40)], ['Netto huur na toeslag', fmt.euro(v.huur - h.bedrag), 'som']]
      };
    },
    uitleg: 'Eigen bijdrage = minimale eigen bijdrage + afbouwpercentage × (inkomen − drempel) / 12. Het deel van de huur boven de eigen bijdrage wordt vergoed: 100% tot de kwaliteitskortingsgrens, 65% tot de aftoppingsgrens (hoger bij 3 of meer personen) en 40% tot de huurgrens.',
    letop: LETOP_EIGEN + ' Dit is een sterk vereenvoudigde benadering: de wettelijke berekening werkt met normhuren en tabellen per huishoudtype, de 40%-strook en de huurgrens gelden niet voor elk huishouden en elk jaar, en de vermogensgrens met partner is hier als twee keer de grens voor alleenstaanden genomen.'
  });

  RT.add({
    id: 'kindgebonden-budget', groep: 'fiscaal-box1', naam: 'Kindgebonden budget (indicatie)',
    intro: 'Een indicatie van het kindgebonden budget, met leeftijdstoeslagen en de extra bijdrage voor alleenstaande ouders.',
    kw: 'kindgebonden budget kgb kinderen alleenstaande ouderkop',
    peildatum: EIGEN.peildatum, fiscaal: ['kindgebonden budget'],
    velden: [
      { k: 'k1', l: 'Kinderen 0 tot en met 11 jaar', s: 'num', std: 2 },
      { k: 'k2', l: 'Kinderen 12 tot en met 15 jaar', s: 'num', std: 0, opt: true },
      { k: 'k3', l: 'Kinderen 16 en 17 jaar', s: 'num', std: 0, opt: true },
      { k: 'ink', l: 'Toetsingsinkomen (samen)', s: 'eur', std: 38000 },
      { k: 's', l: 'Huishouden', s: 'keuze', opties: [['partner', 'Met toeslagpartner'], ['alleen', 'Alleenstaande ouder']], std: 'partner' }
    ],
    bereken(v) {
      const r = kgb(Math.max(0, Math.round(v.k1)), Math.max(0, Math.round(v.k2)), Math.max(0, Math.round(v.k3)), v.ink, v.s === 'alleen');
      if (!r.n) return { fout: 'Vul minstens één kind in.' };
      return {
        lbl: 'Kindgebonden budget per maand', groot: fmt.euro0(r.bedrag / 12), onder: fmt.euro0(r.bedrag) + ' per jaar',
        rijen: [['Aantal kinderen', fmt.getal(r.n)], ['Maximaal budget per jaar', fmt.euro0(r.max)], ['Afbouwgrens', fmt.euro0(r.grens)], ['Afbouw', fmt.euro0(Math.min(r.max, r.afbouw))],
          ['Geen budget meer vanaf inkomen', fmt.euro0(r.nulVanaf), 'som']]
      };
    },
    uitleg: 'Maximum = kinderen × bedrag per kind + leeftijdstoeslagen (12–15 en 16–17 jaar) + alleenstaande-ouderkop. Afbouw = afbouwpercentage × (toetsingsinkomen − afbouwgrens). Budget = maximum − afbouw, niet onder nul.',
    letop: LETOP_EIGEN + ' Er geldt ook een vermogensgrens, die hier niet is toegepast. Kinderbijslag (SVB) is een aparte regeling en staat los van het inkomen.'
  });

  RT.add({
    id: 'kinderopvangtoeslag', groep: 'fiscaal-box1', naam: 'Kinderopvangtoeslag (indicatie)',
    intro: 'Een indicatie van de kinderopvangtoeslag en de eigen bijdrage per maand, met de maximum uurprijs per soort opvang.',
    kw: 'kinderopvangtoeslag kinderopvang bso gastouder uurprijs eigen bijdrage',
    peildatum: EIGEN.peildatum, fiscaal: ['kinderopvangtoeslag'],
    velden: [
      { k: 'u1', l: 'Uren per maand, eerste kind', s: 'num', na: 'uur', std: 120 },
      { k: 'u2', l: 'Uren per maand, volgende kinderen samen', s: 'num', na: 'uur', std: 0, opt: true },
      { k: 'tar', l: 'Uurprijs van de opvang', s: 'bedrag', std: 11.2 },
      { k: 'soort', l: 'Soort opvang', s: 'keuze', opties: [['dag', 'Dagopvang'], ['bso', 'Buitenschoolse opvang'], ['gast', 'Gastouderopvang']], std: 'dag' },
      { k: 'p1', l: 'Vergoedingspercentage eerste kind', s: 'pct', std: EIGEN.kot.pctEerste, tip: 'Hangt af van het inkomen; zie de tabel van Dienst Toeslagen.' },
      { k: 'p2', l: 'Vergoedingspercentage volgende kinderen', s: 'pct', std: EIGEN.kot.pctVolgende }
    ],
    bereken(v) {
      const K = EIGEN.kot, max = { dag: K.maxDag, bso: K.maxBso, gast: K.maxGast }[v.soort];
      const basis = Math.min(v.tar, max), uren = v.u1 + v.u2;
      if (uren <= 0) return { fout: 'Vul een aantal uren in.' };
      const t1 = Math.min(v.u1, K.maxUren) * basis * v.p1 / 100, t2 = Math.min(v.u2, K.maxUren) * basis * v.p2 / 100;
      const kosten = uren * v.tar, eigen = kosten - t1 - t2;
      return {
        lbl: 'Kinderopvangtoeslag per maand', groot: fmt.euro0(t1 + t2), onder: 'eigen bijdrage ' + fmt.euro0(eigen) + ' per maand',
        rijen: [['Maximum uurprijs', fmt.euro(max)], ['Vergoed per uur over', fmt.euro(basis)], ['Toeslag eerste kind', fmt.euro(t1)], ['Toeslag volgende kinderen', fmt.euro(t2)],
          ['Kosten opvang per maand', fmt.euro(kosten)], ['Eigen bijdrage per uur', fmt.euro(eigen / uren), 'som']],
        signalen: v.tar > max ? ['De uurprijs ligt boven de maximum uurprijs: het verschil betaalt u volledig zelf.'] : []
      };
    },
    uitleg: 'Toeslag per kind = vergoede uren (maximaal ' + EIGEN.kot.maxUren + ' per maand) × laagste van uurprijs en maximum uurprijs × vergoedingspercentage. Eigen bijdrage = kosten − toeslag.',
    letop: LETOP_EIGEN + ' Het vergoedingspercentage loopt in werkelijkheid met het toetsingsinkomen; vul het percentage uit de actuele tabel in. Het maximum aantal uren hangt af van de gewerkte uren van de minstwerkende partner. De regeling wordt de komende jaren herzien.'
  });

  RT.add({
    id: 'toeslagen-check', groep: 'fiscaal-box1', naam: 'Recht op toeslagen: snelle check',
    intro: 'Op welke toeslagen heeft een huishouden waarschijnlijk recht, en om welke bedragen gaat het ongeveer?',
    kw: 'toeslagen check recht zorgtoeslag huurtoeslag kindgebonden budget kinderopvangtoeslag',
    peildatum: EIGEN.peildatum, fiscaal: ['zorgtoeslag', 'huurtoeslag', 'kindgebonden budget'],
    velden: [
      { k: 'ink', l: 'Toetsingsinkomen (samen)', s: 'eur', std: 32000 },
      { k: 'verm', l: 'Vermogen op 1 januari (samen)', s: 'eur', std: 25000, opt: true },
      { k: 'partner', l: 'Met toeslagpartner', s: 'keuze', opties: JANEE, std: 'nee' },
      { k: 'kn', l: 'Kinderen jonger dan 18', s: 'num', std: 1, opt: true },
      { k: 'huur', l: 'Rekenhuur per maand', s: 'eur', std: 720, opt: true, tip: '0 bij een koopwoning.' },
      { k: 'opv', l: 'Betaalde kinderopvang', s: 'keuze', opties: JANEE, std: 'nee' }
    ],
    bereken(v) {
      const partner = v.partner === 'ja', kn = Math.max(0, Math.round(v.kn));
      const z = zorgtoeslag(v.ink, partner, v.verm).bedrag;
      const h = v.huur > 0 ? huurtoeslag(v.huur, v.ink, 1 + (partner ? 1 : 0) + kn, partner, v.verm).bedrag * 12 : 0;
      const k = kn ? kgb(kn, 0, 0, v.ink, !partner).bedrag : 0;
      const kot = v.opv === 'ja' && kn > 0;
      const ja = (x, nvt) => nvt ? 'n.v.t.' : x > 0 ? fmt.euro0(x) + ' p.j.' : 'geen recht';
      const n = [z, h, k].filter(x => x > 0).length + (kot ? 1 : 0);
      return {
        lbl: 'Waarschijnlijk recht op', groot: n + (n === 1 ? ' toeslag' : ' toeslagen'), onder: 'samen ca. ' + fmt.euro0((z + h + k) / 12) + ' per maand zonder kinderopvang',
        rijen: [['Zorgtoeslag', ja(z)], ['Huurtoeslag', ja(h, v.huur <= 0)], ['Kindgebonden budget', ja(k, !kn)], ['Kinderopvangtoeslag', v.opv !== 'ja' || !kn ? 'n.v.t.' : 'mogelijk', 'som']],
        signalen: ['Reken de bedragen nauwkeuriger uit met <a href="#zorgtoeslag-indicatie">zorgtoeslag</a>, <a href="#huurtoeslag-indicatie">huurtoeslag</a>, <a href="#kindgebonden-budget">kindgebonden budget</a> en <a href="#kinderopvangtoeslag">kinderopvangtoeslag</a>.']
      };
    },
    uitleg: 'Per toeslag wordt dezelfde indicatieve berekening gebruikt als in de afzonderlijke rekenhulpen. Kinderen tellen als 0–11 jaar; het huishouden voor de huurtoeslag = aanvrager + partner + kinderen. Kinderopvangtoeslag hangt vooral af van werk en geregistreerde opvang en wordt alleen gesignaleerd.',
    letop: LETOP_EIGEN + ' Leeftijd, verblijfsstatus, de samenstelling van het huishouden en de vermogenstoets voor het kindgebonden budget zijn niet meegewogen. Dit is een eerste verkenning, geen aanvraag.'
  });
})(window.RT);
