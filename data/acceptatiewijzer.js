/* ACCEPTATIEWIJZER van het Adviesforum
 *
 * Per bijzondere klantsituatie: wat de NHG Voorwaarden & Normen 2026-1 zeggen, wat de leennormen (Trhk 2026)
 * zeggen, algemene aandachtspunten, benodigde documenten en welke geldverstrekkers er aantoonbaar iets over
 * publiceren. In eigen woorden samengevat. Peildatum: 3 oktober 2026.
 *
 * Bronnen: documenten/nhg-voorwaarden-normen-2026.pdf (paragraafnummers tussen haakjes), data/kennisbank-nhg.js,
 * data/kennisbank.js (k10 Leennormen 2026), data/kennisbank-thema.js, data/kennisbank-geldverstrekkers.js,
 * wetten.overheid.nl (Trhk, BWBR0032503) en afm.nl.
 *
 * Velden per situatie:
 *   id, titel, cat (inkomen | persoon | woning | financiering | levensfase), kort, zoek (extra zoekwoorden),
 *   nhg[], trhk[], aandacht[], docs[], inkomen (tab-id in inkomensbepaling.html, optioneel),
 *   partijen[]: {p: exacte naam in data/partijen.js, m: tekstfragment van het kenmerk}. De pagina zoekt tekst en
 *     bronlink op in window.PARTIJEN; alleen kenmerken die daar staan worden getoond. Geen eigen claims over banken.
 *   geenPartijen: toelichting als de Partijenwegwijzer en kennisbank niets over de situatie vermelden.
 *   bronnen[]: [label, url]. Interne links (index.html#artikel-kNN, *.html) en officiële externe bronnen.
 *
 * Geen rentes, premies, kortingen of acties. Acceptatiegidsen wijzigen vaak: altijd de actuele gids raadplegen.
 */
window.ACCEPTATIEWIJZER = {
  peildatum: '3 oktober 2026',
  herzienVoor: '2027-01-01',
  categorieen: {
    inkomen: 'Inkomen en werk',
    persoon: 'Persoon en verplichtingen',
    woning: 'Woning en object',
    financiering: 'Financieringsvorm',
    levensfase: 'Levensfase en relatie'
  },
  situaties: [

  /* ---------------- INKOMEN ---------------- */
  {
    id: 'zzp-starter', cat: 'inkomen', inkomen: 'ondernemer',
    titel: 'Zzp\'er of ondernemer korter dan 3 jaar (of nog geen jaar) bezig',
    kort: 'Startende ondernemer met nog geen drie volledige jaarcijfers, of zelfs minder dan twaalf maanden actief.',
    zoek: 'zzp zelfstandige ondernemer starter ikv inkomensverklaring rekenexpert dga eenmanszaak vof',
    nhg: [
      'Inkomensverklaring Ondernemer (IKV) is verplicht voor wie direct of indirect eigenaar is van een onderneming en die minimaal 12 maanden uitoefent, ook bij een meewerkvergoeding. Dga\'s met 5% of meer aandelen vallen eronder; onder 5% is de IKV niet verplicht (C.7.10).',
      'De IKV wordt gemaakt door een door NHG geaccepteerde rekenexpert volgens de toetskaders, is op de datum van het bindend aanbod maximaal 6 maanden oud en het IKV-inkomen mag voor de hele looptijd meetellen (C.7.10.1).',
      'Korter dan 12 maanden actief: de IKV-route van C.7.10 is dan niet beschikbaar en de V&N noemen geen alternatieve route voor ondernemingsinkomen. Ga ervan uit dat dit inkomen voor NHG (nog) niet meetelt en laat dat bevestigen door de geldverstrekker.',
      'Is het toetsinkomen ook zonder ondernemingsinkomen hoog genoeg, dan moet de geldverstrekker toch beoordelen of verstrekken zonder dat inkomen verantwoord is; bij risico alsnog een IKV (C.7.10.1).',
      'Pgb-zorgverleners en alfahulpen zonder KvK-inschrijving vallen niet onder de IKV maar onder de aangifteroute van C.7.15 (gemiddelde laatste 3 aangiften).'
    ],
    trhk: [
      'De Trhk kent geen aparte norm voor ondernemers: de financieringslastpercentages en toetsrente gelden voor iedereen. Het verschil zit in hoe het toetsinkomen wordt vastgesteld (beleid geldverstrekker, bij NHG de V&N).',
      'Afwijken van de inkomenscriteria (art. 4 Trhk) kan alleen met een vastgelegde motivatie, controle van de gegevens en een aannemelijk duurzame situatie. Een "verwachte groei" van een jonge onderneming is daarvoor zelden genoeg onderbouwd.'
    ],
    aandacht: [
      'Ga na of de verstrekker al na 6 of 12 maanden ondernemerschap wil kijken en of tussentijdse cijfers of een prognose meetellen; dat verschilt sterk.',
      'Gemiddelde over drie jaar met het laatste jaar als maximum is de gangbare methode; een dalende lijn drukt het toetsinkomen.',
      'Combinatie met loondienst of een eerder vergelijkbaar dienstverband in dezelfde branche kan bij sommige verstrekkers helpen.',
      'Zorgplicht: geen WIA-vangnet. Bespreek arbeidsongeschiktheid (AOV, broodfonds), pensioenopbouw en de betaalbaarheid in een slecht jaar (AFM-Leidraad Hypotheekadvisering).',
      'Laat de klant de inkomensverklaring pas aanvragen als duidelijk is welke rekenexperts de gekozen verstrekker accepteert.'
    ],
    docs: [
      'Inkomensverklaring van een geaccepteerde rekenexpert (bij NHG maximaal 6 maanden oud)',
      'Jaarcijfers en aangiften IB van de beschikbare jaren; tussentijdse cijfers als de verstrekker die meeneemt',
      'Uittreksel KvK',
      'Bij een bv: jaarrekeningen bv, aandeelhoudersregister of statuten'
    ],
    partijen: [
      {p: 'Rabobank', m: 'na 6 maanden ondernemerschap'},
      {p: 'Obvion', m: 'startende zzp'},
      {p: 'Triodos Bank', m: 'NHG-erkende rekenexpert'},
      {p: 'Lloyds Bank', m: 'minimaal 2 jaar zelfstandig'},
      {p: 'ING', m: 'Overviewz'},
      {p: 'Nationale-Nederlanden', m: 'Zakelijk Inkomen'},
      {p: 'a.s.r.', m: 'Inkomensverklaring voor ondernemers'},
      {p: 'Argenta', m: 'Zelfstandigen zijn welkom'},
      {p: 'Centraal Beheer (Achmea)', m: 'Thuis Hypotheek'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.7.10 en C.7.15 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k72: NHG inkomen en toetsing', 'index.html#artikel-k72'],
      ['Kennisbank k43: Zzp en flexibel inkomen per geldverstrekker', 'index.html#artikel-k43'],
      ['Kennisbank k30: De IB-ondernemer in het hypotheekplan', 'index.html#artikel-k30'],
      ['Kennisbank k31: De dga in het hypotheekplan', 'index.html#artikel-k31'],
      ['Tijdelijke regeling hypothecair krediet (wetten.overheid.nl)', 'https://wetten.overheid.nl/BWBR0032503']
    ]
  },
  {
    id: 'tijdelijk-contract', cat: 'inkomen', inkomen: 'tijdelijk',
    titel: 'Tijdelijk contract zonder intentieverklaring',
    kort: 'Loondienst met een contract voor bepaalde tijd, waarbij de werkgever geen intentie tot verlenging of vast dienstverband verklaart.',
    zoek: 'tijdelijk contract bepaalde tijd intentieverklaring werkgeversverklaring arbeidsmarktscan ibl jaaropgaven',
    nhg: [
      'Werkgeversverklaring (NHG-model) bij een tijdelijk contract zonder intentieverklaring: het inkomen telt alleen tot het einde van het contract (C.7.5). Daarmee komt de klant meestal niet ver.',
      'IBL-route (C.7.7): toetsinkomen via toetsinkomenberekenen.nl met een gewaarmerkt UWV-verzekeringsbericht en salarisstrook (beide maximaal 3 maanden oud); geen werkgeversverklaring nodig, inkomen telt voor de hele looptijd.',
      'Jaaropgaven (C.7.6): gemiddelde van de laatste 3 kalenderjaren, maximaal het laatste jaar, plus een werkgeversverklaring die het lopende dienstverband bevestigt. Niet bij meer dan één kalenderjaar zonder inkomen.',
      'Arbeidsmarktscan (C.7.8): voor een tijdelijk contract zonder intentieverklaring met minimaal 12 maanden inkomen in de laatste 14 maanden; scan maximaal 6 maanden oud. Toetsinkomen is het laagste van actueel inkomen en verdiencapaciteit.'
    ],
    trhk: [
      'De Trhk schrijft geen aparte route voor tijdelijke contracten voor; de geldverstrekker bepaalt binnen de regeling welk inkomen bestendig is.',
      'Afwijken (art. 4 Trhk) vraagt een vastgelegde motivatie en een aannemelijk duurzame situatie.'
    ],
    aandacht: [
      'Kies de route met het hoogste houdbare inkomen, maar controleer eerst of de verstrekker die route accepteert (vooral de arbeidsmarktscan).',
      'Bij IBL telt het gemiddelde van de afgelopen jaren; een recente loonsverhoging werkt pas gedeeltelijk door.',
      'Zorgplicht: bespreek wat er gebeurt als het contract niet wordt verlengd (WW-hoogte en -duur tegenover de woonlasten).'
    ],
    docs: [
      'Werkgeversverklaring (NHG-model) en recente salarisstrook',
      'Of: gewaarmerkt UWV-verzekeringsbericht (pdf) en IBL-uitkomst',
      'Of: jaaropgaven laatste 3 kalenderjaren',
      'Of: rapport arbeidsmarktscan (maximaal 6 maanden oud)',
      'Kopie arbeidsovereenkomst'
    ],
    partijen: [
      {p: 'ABN AMRO', m: 'Arbeidsmarktscan als alternatief'},
      {p: 'Rabobank', m: 'Arbeidsmarktscan als route'},
      {p: 'Obvion', m: 'Arbeidsmarktscan bruikbaar'},
      {p: 'Florius', m: 'arbeidsmarktscan'},
      {p: 'a.s.r.', m: 'arbeidsmarktscan voor wie'},
      {p: 'Argenta', m: 'arbeidsmarktscan wordt niet'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.7.5 t/m C.7.8 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['NHG: werkgeversverklaring', 'https://www.nhg.nl/het-krijgen-van-nhg/werkgeversverklaring-nhg/'],
      ['Kennisbank k72: NHG inkomen en toetsing', 'index.html#artikel-k72'],
      ['Kennisbank k43: Zzp en flexibel inkomen per geldverstrekker', 'index.html#artikel-k43']
    ]
  },
  {
    id: 'flexwerk', cat: 'inkomen', inkomen: 'perspectief',
    titel: 'Flexwerker, oproepkracht of uitzendkracht',
    kort: 'Wisselende uren, oproep- of seizoenswerk, uitzendwerk of een flexibel budget naast het salaris.',
    zoek: 'flex flexwerker uitzendkracht uitzendbureau oproep seizoen nulurencontract perspectiefverklaring ibl flexibel budget',
    nhg: [
      'IBL (C.7.7) is bruikbaar voor vrijwel alle dienstverbanden, ook proeftijd, seizoens-, uitzend- en oproepwerk. Het IBL-inkomen is het maximum en geldt voor de hele looptijd.',
      'Perspectiefverklaring (C.7.9) voor uitzendwerk: alleen als zowel de geldverstrekker als het uitzendbureau bij de Stichting Perspectiefverklaring is aangesloten. Verklaring en bijbehorende werkgeversverklaring maximaal 6 maanden oud; het inkomen op die werkgeversverklaring telt voor de hele looptijd.',
      'Uitzendkrachten kunnen de arbeidsmarktscan niet gebruiken; daarvoor is de perspectiefverklaring bedoeld (C.7.8).',
      'Jaaropgaven (C.7.6) blijven een alternatief: gemiddelde laatste 3 kalenderjaren, maximaal het laatste jaar.'
    ],
    trhk: [
      'Geen aparte flexnorm in de Trhk; de geldverstrekker stelt het bestendige inkomen vast. Bij NHG gelden de routes uit C.7.',
      'Niet-bestendige delen (incidentele bonus, wisselende toeslagen) tellen alleen mee als ze via de gekozen route als structureel blijken.'
    ],
    aandacht: [
      'Controleer vóór de klant kosten maakt of de verstrekker de perspectiefverklaring of scan accepteert en of het uitzendbureau is aangesloten.',
      'Flexibel budget of andere looncomponenten: kijk wat de werkgever op de model-werkgeversverklaring als structureel mag invullen.',
      'Zorgplicht: bespreek inkomensdaling bij minder uren of einde opdracht; maak een buffer onderdeel van het advies.'
    ],
    docs: [
      'UWV-verzekeringsbericht (gewaarmerkt) en salarisstrook, of',
      'Perspectiefverklaring met werkgeversverklaring van het uitzendbureau, of',
      'Jaaropgaven laatste 3 jaar met werkgeversverklaring'
    ],
    partijen: [
      {p: 'Robuust Hypotheken', m: 'perspectiefverklaring'},
      {p: 'Nationale-Nederlanden', m: 'perspectiefverklaring'},
      {p: 'Obvion', m: 'perspectiefverklaring'},
      {p: 'ABN AMRO', m: 'flexibel budget'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.7.6 t/m C.7.9 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k72: NHG inkomen en toetsing', 'index.html#artikel-k72'],
      ['Kennisbank k43: Zzp en flexibel inkomen per geldverstrekker', 'index.html#artikel-k43']
    ]
  },
  {
    id: 'buitenlands-inkomen', cat: 'inkomen',
    titel: 'Expat of inkomen uit het buitenland',
    kort: 'Klant werkt voor een buitenlandse werkgever, ontvangt inkomen in vreemde valuta of heeft de 30%-regeling (expatregeling).',
    zoek: 'expat buitenland buitenlands inkomen valuta 30%-regeling expatregeling grensarbeider kennismigrant',
    nhg: [
      'De lening met NHG is altijd in euro\'s (C.6.4).',
      'BKR-toets met buitenlandtoets als de klant in een van de aangesloten landen woont of woonde, of die nationaliteit heeft (C.3.4).',
      'De V&N 2026 bevatten geen aparte regeling voor buitenlands inkomen: het toetsinkomen moet via een van de routes uit C.7 worden vastgesteld (werkgeversverklaring, IBL, jaaropgaven, IKV). Of een buitenlands inkomen daarin past, beoordeelt de geldverstrekker.',
      'Identiteit en verblijfsrecht: zie de situatie "Geen Nederlandse nationaliteit" (C.3.1).'
    ],
    trhk: [
      'Het toetsinkomen is het bruto jaarinkomen; de onbelaste vergoeding uit de 30%-regeling verhoogt wel het netto inkomen maar hoe de verstrekker ermee rekent, verschilt.',
      'Valutarisico valt niet in de Trhk-toets; het hoort in het advies over betaalbaarheid.'
    ],
    aandacht: [
      'Expatregeling: in 2025 en 2026 maximaal 30%, vanaf 2027 27% met overgangsrecht; houd rekening met de einddatum van de regeling bij de betaalbaarheid.',
      'Valutarisico: bij inkomen in een andere munt kunnen de lasten in euro\'s oplopen als de koers daalt.',
      'Verwachte verblijfsduur in Nederland: korte duur maakt kopen minder logisch (kosten koper, verkooprisico).',
      'Wwft: extra aandacht voor identificatie, herkomst van vermogen en eventueel PEP-status.',
      'Leg vast in welke taal is geadviseerd en of een vertaling of tolk is gebruikt.'
    ],
    docs: [
      'Arbeidsovereenkomst en (indien mogelijk) werkgeversverklaring; bij buitenlandse documenten een vertaling',
      'Beschikking 30%-regeling met einddatum',
      'Buitenlandse belastingaanslagen of loonstroken, bankafschriften met salarisbetalingen',
      'Geldig identiteitsbewijs en verblijfsdocument, BSN'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank noemen geen geldverstrekker met een gepubliceerde regeling voor buitenlands inkomen of expats. Raadpleeg de acceptatiegids van de beoogde verstrekker.',
    bronnen: [
      ['NHG V&N 2026-1, C.3.1, C.3.4 en C.6.4 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k96: Hypotheek en buitenland', 'index.html#artikel-k96'],
      ['Belastingdienst: renteaftrek bij lening van familie, bv of buitenlandse bank', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/renteaftrek-hypotheek-lening-eigen-woning-familie-bv-buitenlandse-bank']
    ]
  },
  {
    id: 'alimentatie', cat: 'inkomen', inkomen: 'overig',
    titel: 'Inkomen uit (of betalen van) alimentatie',
    kort: 'Klant ontvangt partneralimentatie, kinderalimentatie of betaalt zelf alimentatie aan een ex-partner.',
    zoek: 'alimentatie partneralimentatie kinderalimentatie ex-partner scheiding convenant',
    nhg: [
      'Ontvangen partneralimentatie telt mee zolang het recht bestaat; dat recht moet blijken uit een rechterlijke uitspraak of notariële overeenkomst (C.7.14.1).',
      'Kinderalimentatie telt niet mee voor het toetsinkomen (C.7.14.1).',
      'Betaalde partneralimentatie trek je af van het inkomen bij het bepalen van het toetsinkomen (C.7.14.2).',
      'Beheertoets (D.6.3.5) heeft een eigen onderdeel voor alimentatie-inkomen.'
    ],
    trhk: [
      'Partneralimentatie die de klant betaalt is een aftrekbare verplichting; die bruteer je bij een box 1-hypotheek niet (Nibud-advies 2026, overgenomen in de Trhk).',
      'Daalt het inkomen aantoonbaar tijdens de looptijd (bijvoorbeeld einde alimentatietermijn), reken dan voor die periode met het lagere inkomen (bij NHG C.7.4.1).'
    ],
    aandacht: [
      'Noteer de einddatum van de alimentatie: partneralimentatie is in de regel beperkt in duur. Toets de betaalbaarheid na die datum.',
      'Bij een lopende procedure of alleen een onderhandse afspraak telt de alimentatie voor NHG nog niet.',
      'Indexatie en mogelijke wijziging door de rechter: bespreek het risico van verlaging.'
    ],
    docs: [
      'Echtscheidingsconvenant met rechterlijke uitspraak, of notariële overeenkomst',
      'Bankafschriften waaruit betaling blijkt',
      'Bij betalen: hetzelfde, voor de berekening van de verplichting'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank noemen geen geldverstrekker-specifieke regels voor alimentatie-inkomen.',
    bronnen: [
      ['NHG V&N 2026-1, C.7.14 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k10: Leennormen 2026 (overige verplichtingen)', 'index.html#artikel-k10'],
      ['Kennisbank k81: Scheiding in de praktijk', 'index.html#artikel-k81'],
      ['Rijksoverheid: hoe lang partneralimentatie betalen', 'https://www.rijksoverheid.nl/vraag-en-antwoord/scheiden/hoe-lang-partneralimentatie-betalen']
    ]
  },

  /* ---------------- PERSOON EN VERPLICHTINGEN ---------------- */
  {
    id: 'verblijfsvergunning', cat: 'persoon',
    titel: 'Geen Nederlandse of EU-nationaliteit, verblijfsvergunning',
    kort: 'Klant heeft geen EU/EER-nationaliteit en verblijft op basis van een (tijdelijke of permanente) verblijfsvergunning.',
    zoek: 'nationaliteit verblijfsvergunning ind vreemdelingendocument kennismigrant tijdelijk verblijfsdoel buitenlander',
    nhg: [
      'Geldig paspoort of ID-kaart uit de EU, Zwitserland, IJsland, Noorwegen of Liechtenstein, of een geldig IND-vreemdelingendocument (of IND-sticker/inlegvel in het paspoort) (C.3.1).',
      'Daaruit moet blijken: EU/EER/Zwitserse nationaliteit, een verblijfsvergunning voor onbepaalde tijd, een EU-verblijfsvergunning voor langdurig ingezetenen, een document "Duurzaam verblijf burgers van de Unie" of een vergunning voor een niet-tijdelijk verblijfsdoel (art. 3.5 Vreemdelingenbesluit).',
      'Bij meerdere aanvragers mag een aanvrager met een vergunning voor bepaalde tijd met tijdelijk verblijfsdoel meedoen, maar zijn inkomen telt dan niet mee (C.3.1).',
      'BKR-buitenlandtoets waar van toepassing (C.3.4).'
    ],
    trhk: [
      'De Trhk stelt geen eisen aan nationaliteit of verblijfsstatus; dat is acceptatiebeleid van NHG en de geldverstrekker.'
    ],
    aandacht: [
      'Een tijdelijke vergunning (bijvoorbeeld als kennismigrant) sluit NHG voor die aanvrager als inkomensbron uit; zonder NHG verschilt het beleid per verstrekker.',
      'Let op de geldigheidsduur van het document op het moment van het bindend aanbod en het passeren.',
      'Wwft-identificatie en, waar nodig, extra aandacht voor herkomst van eigen middelen.'
    ],
    docs: [
      'Geldig paspoort en verblijfsdocument van de IND (voor- en achterkant)',
      'BSN en inschrijving BRP',
      'Inkomensdocumenten zoals bij de gekozen inkomensroute'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank vermelden geen geldverstrekker-specifiek beleid voor verblijfsstatus. Raadpleeg de acceptatiegids.',
    bronnen: [
      ['NHG V&N 2026-1, C.3.1 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k70: NHG 2026 in het kort', 'index.html#artikel-k70'],
      ['Kennisbank k96: Hypotheek en buitenland', 'index.html#artikel-k96']
    ]
  },
  {
    id: 'bkr', cat: 'persoon',
    titel: 'BKR-registratie: A-, H- of 3-codering, herstelde achterstand',
    kort: 'Lopende kredieten, een (herstelde) betalingsachterstand of een eerdere schuldregeling in het BKR.',
    zoek: 'bkr codering a h 1 2 3 achterstand herstelcode schuldhulp wsnp sk sh loonbeslag krediet limiet',
    nhg: [
      'BKR-toets voor iedere aanvrager, met buitenlandtoets waar mogelijk (C.3.4).',
      'Geen NHG bij bijzonderheidscode 1, 2, 3, 4 of 5, bij een lopende schuldhulpregeling (SK of SH) en bij loonbeslag of looncessie (C.3.4).',
      'Code A of A1 mag wel als er een herstelcode (H) is, als uit het BKR blijkt dat de lening is afgelost (niet door herfinanciering in een nieuwe lening), of als de geldverstrekker verklaart dat er geen achterstand meer is (C.3.4).',
      'Een RN 3 en HY-coderingen alleen in specifieke gevallen met finale kwijting door NHG; registraties die door verjaring uiterlijk op de ingangsdatum zijn verwijderd tellen niet; Wsnp alleen na een schone lei en minimaal 1 jaar na het vonnis (C.3.4).',
      'Alle financiële verplichtingen tellen mee, ook als ze niet bij BKR staan; doorlopend krediet en vergelijkbaar: 2% per maand van de oorspronkelijke limiet of leensom (C.7.16.1).'
    ],
    trhk: [
      'Lopende verplichtingen verlagen de maximale financieringslast. Niet-aftrekbare lasten (zoals consumptief krediet) bruteer je bij een box 1-hypotheek met de verhouding tussen de box 1- en box 3-tabel (Nibud-advies 2026).',
      'Lasten die aantoonbaar vóór de ingangsdatum verdwijnen (aflossen en opzeggen) hoeven niet mee (bij NHG C.7.16.2).'
    ],
    aandacht: [
      'Laat de klant vóór de aanvraag zelf een BKR-overzicht opvragen en bespreek elke registratie.',
      'Bij een A-codering: oorzaak, bedrag, aflosdatum en bewijsstukken vastleggen. Een open melding vooraf voorkomt een late afwijzing.',
      'Gegevens blijven na beëindiging nog vijf jaar zichtbaar (BKR).',
      'Krediet aflossen met de hypotheek: dat deel is geen eigenwoningschuld; eigen afweging qua lasten en fiscaliteit.',
      'Zonder NHG verschilt het beleid voor A- en H-coderingen sterk per verstrekker.'
    ],
    docs: [
      'BKR-overzicht (met datum)',
      'Bewijs van aflossing of beëindiging, verklaring van de kredietgever bij een herstelde achterstand',
      'Schriftelijke toelichting van de klant op de achterstand',
      'Bij Wsnp: vonnis en verklaring schone lei'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank noemen geen geldverstrekker-specifiek BKR-beleid. Raadpleeg de acceptatiegids van de beoogde verstrekker.',
    bronnen: [
      ['NHG V&N 2026-1, C.3.4 en C.7.16 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k93: BKR en hypotheek', 'index.html#artikel-k93'],
      ['Kennisbank k10: Leennormen 2026', 'index.html#artikel-k10'],
      ['BKR: hoe lang sta ik geregistreerd?', 'https://www.bkr.nl/veelgestelde-vragen/registratie-bij-stichting-bkr/hoe-lang-sta-ik-geregistreerd/']
    ]
  },
  {
    id: 'studieschuld', cat: 'persoon',
    titel: 'Studieschuld (DUO-weging 2026)',
    kort: 'Klant of partner heeft een DUO-studieschuld; die telt mee via het maandbedrag, niet via de oorspronkelijke schuld.',
    zoek: 'studieschuld duo studielening maandbedrag factor weging draagkracht aflosvrije maanden aanloopfase',
    nhg: [
      'Alle financiële verplichtingen tellen mee, ook als ze niet bij BKR staan (C.7.16.1). De studieschuld is zo\'n verplichting; de verwerking volgt de Trhk-methodiek.'
    ],
    trhk: [
      'Het wettelijk maandbedrag aan DUO wordt bij een box 1-hypotheek verhoogd met een factor die afhangt van de hypotheekrente: 1,05 (t/m 2,000%), 1,10, 1,15, 1,20 (3,001-4,000%), 1,25, 1,30 (4,501-5,500%), 1,35 en 1,40 (vanaf 6,001%). De regeling is voor 2026 ongewijzigd.',
      'In de aanloopfase, bij aflosvrije maanden of bij een verlaagd bedrag door draagkrachtmeting reken je met een termijnbedrag op basis van actuele restschuld, rente en resterende looptijd.',
      'Bij een volledig box 3-hypotheek bruteer je niet.'
    ],
    aandacht: [
      'Vraag er actief naar: de studieschuld staat niet bij BKR.',
      'Extra aflossen en DUO het maandbedrag laten herberekenen kan de leenruimte vergroten, maar kost buffer en gunstige voorwaarden (draagkracht, kwijtschelding). Adviseer dat niet automatisch.',
      'Ook de studieschuld van de partner telt mee bij een gezamenlijke aanvraag.'
    ],
    docs: [
      'Actueel overzicht uit Mijn DUO: schuld, rente, maandbedrag, terugbetaalstelsel, aflosvrije maanden',
      'Bij herberekening: brief van DUO met het nieuwe maandbedrag'
    ],
    partijen: [],
    geenPartijen: 'De weging is wettelijk (Trhk) en geldt voor alle verstrekkers; de Partijenwegwijzer noemt geen afwijkend beleid.',
    bronnen: [
      ['Kennisbank k10: Leennormen 2026 (factortabel)', 'index.html#artikel-k10'],
      ['Kennisbank k94: Studieschuld en hypotheek', 'index.html#artikel-k94'],
      ['Leennormen 2026 (rekenhulp)', 'leennormen-2026.html'],
      ['Rijksoverheid: hypotheek, studieschuld en extra aflossing', 'https://www.rijksoverheid.nl/vraag-en-antwoord/huis-kopen/hypotheek-studieschuld-extra-aflossing'],
      ['Nibud: Advies hypotheeknormen 2026', 'https://www.nibud.nl/onderzoeksrapporten/rapport-advies-hypotheeknormen-2026-2025/']
    ]
  },

  /* ---------------- WONING EN OBJECT ---------------- */
  {
    id: 'tweede-woning', cat: 'woning',
    titel: 'Tweede woning of recreatiewoning',
    kort: 'Klant koopt naast de eigen woning een vakantie- of recreatiewoning voor eigen gebruik.',
    zoek: 'tweede woning recreatiewoning vakantiewoning vakantiepark box 3 permanente bewoning',
    nhg: [
      'Geen NHG: de klant moet de woning als hoofdverblijf bewonen (C.3.2) en de woning moet geschikt zijn voor permanente bewoning, met een woonbestemming die niet tijdelijk is (C.4.2).'
    ],
    trhk: [
      'De financiering op een tweede woning is geen eigenwoningschuld (box 3). De bestaande hypotheek en overige lasten tellen mee in de financieringslast.',
      'Of en hoe de leennormen voor deze lening gelden, hangt af van de vorm (verhoging op de eigen woning of aparte lening op het object); controleer dat bij de verstrekker.'
    ],
    aandacht: [
      'Recreatiewoningen: permanente bewoning is vaak niet toegestaan; controleer het omgevingsplan.',
      'Verhogen op de eigen woning om de tweede woning te kopen: die verhoging is geen eigenwoningschuld; let op de bijleenregeling.',
      'Overdrachtsbelasting: algemeen (hoger) tarief omdat de klant er niet als hoofdverblijf woont.',
      'Kasstroom: VvE of parkkosten, onderhoud, verzekering, box 3-heffing; het box 3-stelsel is in beweging.',
      'Controleer of je vergunning en vakbekwaamheid deze dienstverlening dekken (k91).'
    ],
    docs: [
      'Koopovereenkomst en taxatierapport van het object',
      'Bestemming (omgevingsplan) en eventuele parkreglementen',
      'Gegevens bestaande hypotheek en overige lasten',
      'Kasstroomoverzicht en fiscale uitgangspunten'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank noemen geen geldverstrekker met een gepubliceerde regeling voor recreatiewoningen. Gespecialiseerde verstrekkers bestaan, maar daarover staat hier geen bevestigde informatie.',
    bronnen: [
      ['NHG V&N 2026-1, C.3.2 en C.4.2 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k91: Tweede woning, vakantiewoning en verhuur', 'index.html#artikel-k91'],
      ['Belastingdienst: berekening box 3-inkomen 2026', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026'],
      ['Bijleenregeling (rekenhulp)', 'bijleenregeling.html']
    ]
  },
  {
    id: 'buy-to-let', cat: 'financiering',
    titel: 'Buy-to-let en verhuurhypotheek',
    kort: 'Klant wil een woning kopen om te verhuren, of de huidige woning verhuren.',
    zoek: 'buy-to-let verhuur verhuurhypotheek belegging beleggingspand opkoopbescherming huurinkomsten',
    nhg: [
      'Geen NHG voor een verhuurde woning: de woning mag niet verhuurd of aan een ander in gebruik gegeven zijn en de klant moet er zelf wonen (C.3.2, C.4.2).',
      'Tijdelijke verhuur van een woning met NHG kan alleen met toestemming van de geldverstrekker in specifieke situaties (werk elders met diplomatenclausule, dubbele lasten of samenwonen, met Leegstandwetvergunning) (D.1.4).'
    ],
    trhk: [
      'Verhuurhypotheken vallen buiten de gewone toets voor de eigen woning; aanbieders toetsen vaak op huurinkomsten met eigen normen.',
      'De AFM heeft indicatoren voor de vraag of financiering van een beleggingspand bedrijfs- of beroepsmatig is, of onder de Wft-regels voor consumenten valt. Beoordeel dat per dossier.'
    ],
    aandacht: [
      'Opkoopbescherming en verhuurvergunning van de gemeente controleren.',
      'De bestaande hypotheekakte verbiedt verhuur meestal zonder toestemming van de geldverstrekker.',
      'Box 3: verhuurde woning en schuld vallen in box 3; de leegwaarderatio is in 2026 gewijzigd.',
      'Zorgplicht: leegstand, huurrisico, onderhoud en waardedaling bespreken. Controleer of je vergunning deze dienstverlening dekt.'
    ],
    docs: [
      'Koopovereenkomst, taxatierapport met markthuur',
      'Huurovereenkomst of huurprognose, gemeentelijke vergunning',
      'Overzicht overig vastgoed en bestaande financieringen',
      'Kasstroomberekening'
    ],
    partijen: [
      {p: 'Domivest', m: 'niet voor consumenten'},
      {p: 'Domivest', m: 'uitsluitend via een bij Domivest'},
      {p: 'SNS (nu ASN Bank)', m: 'Informatiewijzer Verhuurhypotheek'},
      {p: 'SNS (nu ASN Bank)', m: 'geldt niet voor de verhuurhypotheek'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.4.2 en D.1.4 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k91: Tweede woning, vakantiewoning en verhuur', 'index.html#artikel-k91'],
      ['AFM: hypothecair krediet (indicatoren beleggingspanden)', 'https://www.afm.nl/nl-nl/sector/themas/dienstverlening-aan-consumenten/financiele-producten/hypothecair-krediet']
    ]
  },
  {
    id: 'erfpacht', cat: 'woning',
    titel: 'Erfpacht',
    kort: 'De klant wordt eigenaar van de opstal maar niet van de grond, en betaalt canon of heeft die afgekocht.',
    zoek: 'erfpacht canon tijdvak afkoop eeuwigdurend voortdurend algemene bepalingen amsterdam koperssteun',
    nhg: [
      'Traditionele erfpachtconstructies van een overheidsinstantie zijn toegestaan. Bij een overeenkomst van vóór 1 januari 1992 moet de erfpacht nog minstens de helft van de looptijd van de lening duren, tenzij onvoorwaardelijke verlenging is vastgelegd (C.4.5).',
      'Andere erfpachtconstructies en koperssteun: alleen als ze op de lijst van door NHG geaccepteerde constructies op nhg.nl staan (C.4.5).',
      'De canon telt mee in de financieringslast. Bij een herziening binnen 12 maanden na het bindend aanbod met een hoger bedrag: reken met de herziene canon. Indexatie binnen 12 maanden hoeft sinds 2026 niet mee (C.7.2).',
      'Afkoop van de canon mag in de lening als aanpassing, via het bouwdepot (C.6.5); bij nieuwbouw is de waardestijging zonder taxatie beperkt tot 25%, 50% of 100% van de afkoopsom afhankelijk van de afkoopduur (C.5.3.1).'
    ],
    trhk: [
      'De canon is een woonlast die meetelt in de financieringslast; omdat erfpacht aftrekbaar is, bruteer je de canon niet (Nibud-advies 2026).'
    ],
    aandacht: [
      'Lees de akte en de algemene bepalingen: canon, tijdvak, einddatum, indexatie.',
      'Een aflopend tijdvak kan de lasten sterk verhogen; benoem dat ook als het buiten de rentevaste periode valt.',
      'Tijdelijke erfpacht (recht eindigt op vaste datum) raakt waarde en acceptatie.',
      'Afkopen of jaarlijks betalen doorrekenen; geef geen juridisch advies over de akte.'
    ],
    docs: [
      'Erfpachtakte en algemene bepalingen',
      'Opgave canon, tijdvak en eventuele herziening',
      'Taxatierapport (waarde met erfpacht) en eventueel aanbod tot overstap of afkoop'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer noemt geen geldverstrekker-specifiek erfpachtbeleid. Kennisbank k90 wijst erop dat sommige verstrekkers eisen stellen aan het resterende tijdvak of tijdelijke erfpacht niet accepteren; controleer de acceptatiegids.',
    bronnen: [
      ['NHG V&N 2026-1, C.4.5, C.5.3.1 en C.7.2 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k90: Erfpacht en hypotheek', 'index.html#artikel-k90'],
      ['Kennisbank k71: Wijzigingen NHG 2025-2026', 'index.html#artikel-k71'],
      ['Erfpacht (rekenhulp)', 'erfpacht.html']
    ]
  },
  {
    id: 'woonboot-woonwagen', cat: 'woning',
    titel: 'Woonboot (drijvende woning), woonwagen of tiny house',
    kort: 'Woning die drijft of verplaatsbaar is, met een ligplaats of standplaats die de klant huurt of in eigendom heeft.',
    zoek: 'woonboot drijvende woning ark ligplaats liggeld woonwagen standplaats tiny house verplaatsbaar scheepsregister',
    nhg: [
      'NHG is mogelijk voor onder meer woonwagens, tiny houses en drijvende woningen, als ze aan de woningvoorwaarden voldoen (definities, A). Sinds 2026 geldt één NHG-grens voor alle woningtypen.',
      'Drijvende woning (C.4.4): ingeschreven in de BRK (of zo nodig het scheepsregister), alleen verplaatst voor onderhoud, inspectie of wisseling van ligplaats; een gehuurde ligplaats rechtstreeks van een overheidsinstantie; een vergunning op naam van de klant; vrij overdraagbaar. Verzekering ook tegen zinken.',
      'Huur, liggeld of precario voor de ligplaats gaat af van de maximale financieringslast; een verhoging binnen 12 maanden na het bindend aanbod neem je mee (C.7.16.1).',
      'Verplaatsbaar over de openbare weg: alleen als daarvoor een RDW-ontheffing nodig is (C.4.2).',
      'Grond: is de klant geen eigenaar van de grond, dan is een erfpachtrecht nodig; alleen bij een drijvende woning volstaat huur of een ligplaatsvergunning (C.3.2). Een woonwagen op een gehuurde standplaats lijkt daardoor buiten NHG te vallen; laat dat bevestigen.',
      'Taxatie: is een gevalideerd taxatierapport voor een drijvende woning niet mogelijk, dan bepaalt de geldverstrekker welk rapport of onderzoek nodig is (C.5).'
    ],
    trhk: [
      'Geen aparte norm; lasten voor de ligplaats of standplaats tellen mee als woonlast of verplichting.'
    ],
    aandacht: [
      'Controleer bestemming en vergunning van de lig- of standplaats en de overdraagbaarheid ervan.',
      'Staat van het casco: vraag naar een recente inspectie (bij woonboten bijvoorbeeld een cascorapport).',
      'Fiscaal: alleen eigenwoningschuld als het object de eigen woning is in de zin van de Wet IB.',
      'Opstal- en cascoverzekering regelen vóór passeren.'
    ],
    docs: [
      'Inschrijving BRK of scheepsregister',
      'Ligplaats- of standplaatsvergunning, huurovereenkomst of erfpachtakte',
      'Taxatierapport (of door de geldverstrekker voorgeschreven rapport) en inspectierapport',
      'Opgave liggeld, huur of precario'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank noemen geen geldverstrekker met gepubliceerd beleid voor woonboten of woonwagens.',
    bronnen: [
      ['NHG V&N 2026-1, C.3.2, C.4.2, C.4.4 en C.7.16 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k71: Wijzigingen NHG 2025-2026', 'index.html#artikel-k71'],
      ['Kennisbank k70: NHG 2026 in het kort', 'index.html#artikel-k70']
    ]
  },
  {
    id: 'verduurzamen', cat: 'woning',
    titel: 'Verduurzamen en energiebespaarbudget',
    kort: 'Extra lenen voor energiebesparende voorzieningen bij aankoop, oversluiten of verhogen.',
    zoek: 'verduurzamen energiebesparende voorzieningen ebv energiebespaarbudget ebb energielabel warmtefonds isolatie warmtepomp zonnepanelen',
    nhg: [
      'NHG-grens 2026: € 470.000, plus maximaal € 28.200 voor energiebesparende voorzieningen, dus € 498.200 (C.2).',
      'LTV normaal maximaal 100% van de marktwaarde na aanpassingen; met energiebesparende voorzieningen maximaal 106%, waarbij die extra 6% alleen naar die voorzieningen mag (C.6.1).',
      'Staan de maatregelen bij het bindend aanbod nog niet vast, dan kan het bedrag via het bouwdepot als Energiebespaarbudget of verbeterbudget (C.6.1.1).',
      'Bouwdepot verplicht voor geleende kosten van aanpassingen; eigen geld gaat eerst op, restsaldo wordt afgelost (C.6.5).'
    ],
    trhk: [
      'Extra leenruimte voor maatregelen van de Trhk-lijst, naar het label vóór de verbouwing: € 20.000 (E, F, G), € 15.000 (C, D), € 10.000 (A, B, A+, A++ en label onbekend), € 0 (A+++ en A++++).',
      'Bij aankoop extra leenruimte op basis van het energielabel van de woning (bijvoorbeeld € 10.000 bij A of B); voor A+++ en A++++ is dat in 2026 verlaagd.',
      'Bij verbouwing met maatregelen van de lijst in combinatie met een depotregeling is het bedrag vrijgesteld van de toets (Nibud-advies 2026).'
    ],
    aandacht: [
      'Het extra bedrag is een maximum, geen advies; toets de betaalbaarheid ook zonder de verwachte besparing.',
      'Vraag het geregistreerde label op en maak de maatregelen concreet (offertes, maatwerkadvies).',
      'Alternatieven: eigen geld, Energiebespaarlening van het Warmtefonds, ISDE-subsidie (achteraf uitgekeerd).',
      'Let op depottermijnen en de eisen aan facturen.'
    ],
    docs: [
      'Geregistreerd energielabel',
      'Offertes of maatwerkadvies met de maatregelen',
      'Bouwdepotspecificatie',
      'Bij label-afhankelijke leenruimte: label met registratiedatum'
    ],
    partijen: [
      {p: 'Nationale-Nederlanden', m: 'Extra hypotheek voor verduurzamen'},
      {p: 'a.s.r.', m: 'Verduurzamingshypotheek'},
      {p: 'ASN Bank (de Volksbank)', m: 'ASN Duurzaam Wonen'},
      {p: 'Lot Hypotheken', m: 'Duurzaamheidshypotheek'},
      {p: 'Triodos Bank', m: 'telt mee voor het maximale leenbedrag'},
      {p: 'Triodos Bank', m: 'Energiebespaarlening gaat niet mee'},
      {p: 'ABN AMRO', m: 'Beter Wonen'},
      {p: 'HollandWoont', m: 'energiebesparende voorzieningen'},
      {p: 'NIBC', m: 'homeQgo'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.2, C.6.1 en C.6.5 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k73: NHG verbouwing, EBV en bouwdepot', 'index.html#artikel-k73'],
      ['Kennisbank k89: Verduurzamen financieren', 'index.html#artikel-k89'],
      ['Kennisbank k44: Duurzaamheid per geldverstrekker', 'index.html#artikel-k44'],
      ['Kennisbank k10: Leennormen 2026', 'index.html#artikel-k10'],
      ['Rijksoverheid: hogere hypotheek voor energiebesparende maatregelen', 'https://www.rijksoverheid.nl/vraag-en-antwoord/huis-kopen/hogere-hypotheek-energiebesparende-maatregelen']
    ]
  },
  {
    id: 'nieuwbouw-zelfbouw', cat: 'woning',
    titel: 'Nieuwbouw, bouwdepot of zelfbouw (kavel)',
    kort: 'Projectmatige nieuwbouw, bouw in eigen beheer op een kavel of een verbouwing met bouwdepot.',
    zoek: 'nieuwbouw bouwdepot zelfbouw kavel eigen beheer cpo bouwrente aanneemsom woningborg garantiewoning',
    nhg: [
      'Nieuwbouw: waarborgcertificaat onder het Keurmerk GarantieWoning, opgenomen in de koop-/aanneemovereenkomst; bij een woningcorporatie als verkoper volstaat een afbouwgarantie. Bij zelfbouw of bouw in eigen beheer gelden deze eisen niet (C.4.3).',
      'Mee te financieren: koop-/aanneemsom, grond, meer- minus minderwerk, extra EBV, bouwrente, renteverlies tijdens de bouw, aansluitkosten en afkoop canon tot de waardestijging (C.6.2.2).',
      'Bouwdepot verplicht voor geleende kosten; eigen geld gaat eerst op, restsaldo wordt afgelost (C.6.5, D.1.1).',
      'Nog niet bewoonbaar: NHG geldt onder opschortende voorwaarde tot de woning feitelijk bewoond kan worden (A.7.1).',
      'Waarde na verbouwing of aanpassing: een fysieke taxatie is dan nodig, hybride taxatie niet (C.5). Nieuwbouw met label A++++: NHG-grens € 498.200 (C.2.2.1).'
    ],
    trhk: [
      'Extra leenruimte op basis van het energielabel van de nieuwbouwwoning (zie Leennormen 2026).',
      'Dubbele lasten tijdens de bouw (huur of oude hypotheek plus bouwrente) vallen niet onder een aparte Trhk-norm; beoordeel de betaalbaarheid in het advies.'
    ],
    aandacht: [
      'Depottermijn verschilt per verstrekker; bij zelfbouw lopen projecten vaak uit. Vraag naar verlenging.',
      'Renteaanbod bij nieuwbouw: geldigheidsduur en eventuele rentebedenktijd per verstrekker.',
      'Zelfbouw: niet elke verstrekker financiert bouw in eigen beheer of CPO; controleer vroeg.',
      'Woonlasten tijdens de bouw en de verkoop van de huidige woning (overbrugging) samen doorrekenen.'
    ],
    docs: [
      'Koop-/aanneemovereenkomst met waarborgcertificaat (of afbouwgarantie)',
      'Bij zelfbouw: koopakte kavel, bouwbegroting, aannemerscontract, omgevingsvergunning',
      'Meer- en minderwerkspecificatie',
      'Taxatierapport op basis van de waarde na realisatie'
    ],
    partijen: [
      {p: 'Neo Hypotheken', m: 'kavelbouw'},
      {p: 'NIBC', m: 'nieuwbouwfinanciering'},
      {p: 'ING', m: 'Bouwdepot loopt standaard'},
      {p: 'Rabobank', m: 'Bouwdepot heeft een maximale looptijd'},
      {p: 'Obvion', m: 'Bouwdepot maximaal 2 jaar'},
      {p: 'Argenta', m: 'Bouwdepot 24 maanden'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, A.7.1, C.4.3, C.6.2.2 en C.6.5 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k73: NHG verbouwing, EBV en bouwdepot', 'index.html#artikel-k73'],
      ['Leennormen 2026 (rekenhulp)', 'leennormen-2026.html']
    ]
  },

  /* ---------------- LEVENSFASE EN RELATIE ---------------- */
  {
    id: 'verzilveren', cat: 'levensfase', inkomen: 'pensioen',
    titel: 'Senioren met overwaarde: verzilveren',
    kort: 'Klant rond of na de AOW-leeftijd wil overwaarde gebruiken voor inkomen, verbouwen, verhuizen of schenken.',
    zoek: 'senior overwaarde verzilveren verzilverhypotheek levensrente opeethypotheek aow pensioen werkelijke lasten schenken',
    nhg: [
      'Aflosvorm: annuïtair of lineair; aflossingsvrij alleen voor een bestaande eigenwoningschuld tot maximaal 50% van de marktwaarde (C.6.7). Een product waarbij de rente wordt bijgeschreven past niet in deze aflosvormen; reken op een lening zonder NHG.',
      'Seniorenregeling (C.8): bij verhuizen onder voorwaarden toetsen op werkelijke lasten (bestaande eigenwoningschuld, nieuwe maandlast niet hoger dan de huidige, rentevaste periode in de regel minimaal 20 jaar met uitzonderingen tot minimaal 10 jaar).'
    ],
    trhk: [
      'AOW-gerechtigden hebben een eigen tabel met hogere financieringslastpercentages.',
      'De AFM vindt het onder voorwaarden verantwoord om bij pensioengerechtigden met stabiel inkomen te toetsen op werkelijke lasten (explain, art. 4 Trhk): stabiele lasten (lange rentevaste periode) en beperkt restschuldrisico door veel overwaarde, met vastgelegde berekeningen.'
    ],
    aandacht: [
      'Bij verzilveren groeit de schuld door bijgeschreven rente; vraag naar de no-negative-equity-garantie en de voorwaarden.',
      'Bespreek: overlijden van de eerste partner, opname in een zorginstelling, onderhoudsbudget, wilsbekwaamheid en levenstestament.',
      'Schenken uit overwaarde: fiscale kant en of de klant het geld later zelf nodig heeft; let op druk van familie.',
      'Zorgplicht: senioren kunnen kwetsbaar zijn. Neem de tijd, vat schriftelijk samen en leg vast waarom een oplopende schuld in het belang van de klant is.'
    ],
    docs: [
      'Pensioen- en AOW-opgave (mijnpensioenoverzicht.nl), maximaal 3 maanden oud bij NHG',
      'Gegevens bestaande hypotheek en taxatierapport',
      'Berekening nu en na overlijden van elk van beide partners',
      'Vastlegging besproken alternatieven (verkopen, niets doen)'
    ],
    partijen: [
      {p: 'Florius', m: 'Verzilver Hypotheek'},
      {p: 'a.s.r.', m: 'Levensrente hypotheek om overwaarde'},
      {p: 'ABN AMRO', m: 'Overwaarde Hypotheek voor 62-plussers'},
      {p: 'Merius Hypotheken', m: '55-plussers'},
      {p: 'Venn Hypotheken', m: 'senioren tot 80'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.6.7 en C.8 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k82: Senioren en hypotheek na de AOW-leeftijd', 'index.html#artikel-k82'],
      ['AFM: toets op werkelijke hypotheeklasten bij stabiel pensioeninkomen', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/hypotheken-hypothecaire-kredietverstrekking/toets-werkelijke-hypotheeklasten'],
      ['Belastingdienst: hoeveel mag ik mijn kind belastingvrij schenken', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/hoeveel-mag-ik-mijn-kind-belastingvrij-schenken']
    ]
  },
  {
    id: 'aow-leeftijd', cat: 'levensfase', inkomen: 'pensioen',
    titel: 'Ouderen boven (of binnen 10 jaar van) de AOW-leeftijd',
    kort: 'Aanvrager heeft de AOW-leeftijd bereikt of bereikt die binnen tien jaar na het bindend aanbod.',
    zoek: 'aow pensioen senior 57-plus 55-plus pensioengat aow-gat tijdelijk tekort werkelijke lasten 68',
    nhg: [
      'Bereikt een aanvrager binnen 10 jaar na het bindend aanbod de AOW-leeftijd, toets dan apart voor de periode ervoor en erna (C.7.4.2).',
      'Vanaf de AOW-leeftijd tellen alleen AOW, pensioen en lijfrente; opgave maximaal 3 maanden oud. AOW of pensioen dat binnen 6 maanden ingaat mag al mee (C.7.12).',
      'Tijdelijk te laag inkomen tussen AOW-leeftijd en de pensioenrichtleeftijd van 68: ander inkomen (zoals uit arbeid) mag voor die periode meetellen (C.7.12.1, nieuw in 2026).',
      'Seniorenregeling (C.8): bij verhuizen toetsen op werkelijke lasten onder voorwaarden; bij twee aanvragers waarvan de oudste senior is, een tijdelijke overschrijding van maximaal 120 maanden met een rentevaste periode van minimaal 10 jaar (C.8.3).'
    ],
    trhk: [
      'Aparte AOW-tabel met hogere financieringslastpercentages (lagere belastingdruk).',
      'Binnen tien jaar AOW-leeftijd: ook toetsen of het verwachte inkomen vanaf die leeftijd voldoende is.',
      'Explain op werkelijke lasten volgens de AFM-uitleg (zie bronnen).'
    ],
    aandacht: [
      'Leg het inkomen nu, na pensionering en na overlijden van elk van beide partners naast elkaar.',
      'Rentevaste periode afstemmen op de toets (bij de seniorenregeling vaak lang).',
      'Let op het einde van de renteaftrek binnen 10 jaar: dan ook rekenen met het percentage voor niet-aftrekbare rente (C.7.2.2).'
    ],
    docs: [
      'Pensioenoverzicht (mijnpensioenoverzicht.nl) en AOW-opgave',
      'Lijfrentepolissen met prognose',
      'Bij werk na AOW-leeftijd: arbeidsovereenkomst en werkgeversverklaring'
    ],
    partijen: [
      {p: 'ING', m: '57-plussers'},
      {p: 'Obvion', m: 'binnen 10 jaar bereiken'},
      {p: 'Triodos Bank', m: 'AOW-gat'},
      {p: 'Argenta', m: 'seniorenregels van NHG'},
      {p: 'Lloyds Bank', m: 'Seniorenpropositie'},
      {p: 'NIBC', m: '57-plussers'},
      {p: 'Tulp Hypotheken', m: 'Seniorenpropositie'},
      {p: 'Lot Hypotheken', m: '57-plussers'},
      {p: 'Florius', m: '55-plussers'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.7.4.2, C.7.12 en C.8 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k72: NHG inkomen en toetsing (senioren)', 'index.html#artikel-k72'],
      ['Kennisbank k82: Senioren en hypotheek na de AOW-leeftijd', 'index.html#artikel-k82'],
      ['AFM: toets op werkelijke hypotheeklasten', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/hypotheken-hypothecaire-kredietverstrekking/toets-werkelijke-hypotheeklasten'],
      ['Rijksoverheid: AOW-leeftijd', 'https://www.rijksoverheid.nl/themas/belastingen-uitkeringen-en-toeslagen/algemene-ouderdomswet-aow/aow-leeftijd']
    ]
  },
  {
    id: 'hulp-ouders', cat: 'levensfase',
    titel: 'Starter met hulp van ouders: schenking, familiebank of lening',
    kort: 'Ouders schenken, lenen geld uit (familiehypotheek) of willen mee-aanvrager worden.',
    zoek: 'starter ouders schenking familiebank familiehypotheek lening ouders starterslening svn startersvrijstelling mee-aanvrager',
    nhg: [
      'Elke aanvrager moet hoofdelijk aansprakelijk, (mede-)eigenaar en bewoner (hoofdverblijf) zijn (C.3.2). Ouders die niet in de woning gaan wonen kunnen dus geen mede-aanvrager van een NHG-lening zijn.',
      'Een lening van de ouders is een financiële verplichting en telt mee, ook als die niet bij BKR staat (C.7.16.1).',
      'SVn Starterslening: verhogen om de starterslening af te lossen kan later met een beperkte toets en zonder borgtochtprovisie (D.3.4, A.5.3).'
    ],
    trhk: [
      'Een schenking die in de aankoop gaat verlaagt de benodigde lening; geen norm-effect.',
      'De lasten van een familielening tellen mee in de financieringslast. Hoe een achtergestelde of renteloze familielening wordt meegeteld, verschilt per verstrekker (k95).'
    ],
    aandacht: [
      'De jubelton voor de eigen woning bestaat sinds 2024 niet meer; controleer de actuele schenkvrijstellingen op belastingdienst.nl.',
      'Familielening: zakelijke rente, schriftelijke overeenkomst, annuïtair of lineair in maximaal 30 jaar en opgave in de aangifte, anders vervalt de renteaftrek.',
      'Bespreek de risico\'s voor de ouders en de positie van broers en zussen; de ouders hebben mogelijk eigen advies nodig.',
      'Wwft: herkomst van het geschonken of geleende geld vastleggen.',
      'Startersvrijstelling overdrachtsbelasting: 18-35 jaar, woningwaardegrens € 555.000 in 2026.'
    ],
    docs: [
      'Schenkingsovereenkomst of notariële akte, bewijs van herkomst en storting',
      'Leningsovereenkomst ouders (eventueel met hypotheekrecht in tweede rang) en onderbouwing van de rente',
      'Eventuele achterstellingsverklaring als de geldverstrekker die vraagt',
      'Toewijzingsbrief SVn Starterslening'
    ],
    partijen: [
      {p: 'Neo Hypotheken', m: 'ouder-kind'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.3.2, C.7.16 en D.3.4 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k83: Starters', 'index.html#artikel-k83'],
      ['Kennisbank k95: Familiehypotheek', 'index.html#artikel-k95'],
      ['Belastingdienst: belastingvrije schenkingen voor een koopwoning', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/belastingvrije-schenkingen-voor-koopwoning'],
      ['Belastingdienst: renteaftrek bij lening van familie', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/renteaftrek-hypotheek-lening-eigen-woning-familie-bv-buitenlandse-bank'],
      ['Belastingdienst: startersvrijstelling', 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/startersvrijstelling/startersvrijstelling']
    ]
  },
  {
    id: 'scheiding', cat: 'levensfase',
    titel: 'Scheiding: hypotheek meenemen, uitkopen, overbrugging',
    kort: 'Eén partner blijft wonen en neemt de hypotheek over, of beiden verhuizen en er is tijdelijk dubbele financiering nodig.',
    zoek: 'scheiding relatiebreuk uitkopen ontslag hoofdelijke aansprakelijkheid oha overbrugging restschuld draagplicht',
    nhg: [
      'Ontslag uit de hoofdelijke aansprakelijkheid (D.4): minimaal één aanvrager blijft wonen en zet de lening voort, de vertrekker is geen eigenaar meer en heeft de woning verlaten (of tekent een ontruimingsverklaring), en er zijn geen achterstanden.',
      'Is de financieringslast te hoog, dan mag de geldverstrekker een explain toepassen en toetsen op werkelijke lasten met de Financieringslasttabel Beheer, als de lening niet hoger wordt dan de NHG-lening plus uitkoopsom en bijkomende kosten (D.4.2). Als laatste stap kan een deel aflossingsvrij tot 50% van de marktwaarde als woningbehoud nodig is.',
      'Oversluiten naar NHG om de woning volledig in eigendom te krijgen na een relatiebreuk kan zolang de akte van verdeling nog niet is ingeschreven (D.2).',
      'Restschuld van een verkochte NHG-woning mag onder voorwaarden mee in de nieuwe NHG-lening, binnen een jaar na transport (C.6.3).',
      'Tijdelijk twee woningen bij verhuizen: oude NHG-lening tijdelijk aflossingsvrij, maximaal het lopende jaar plus drie jaar (D.1.3.1).'
    ],
    trhk: [
      'Bij relatiebreuk hoeft de geldverstrekker niet vast te houden aan de reguliere krediettoets, mits verantwoord en vastgelegd (AFM, 2013).',
      'Oversluiten zonder verhoging (zelfde woning, klant blijft wonen) valt onder de uitzondering van art. 4 Trhk.',
      'Betaalde partneralimentatie is een aftrekbare verplichting; ontvangen partneralimentatie telt mee zolang het recht bestaat.'
    ],
    aandacht: [
      'Je adviseert vaak beide ex-partners met tegengestelde belangen; maak vooraf duidelijk voor wie je werkt.',
      'Vertrekkende partner: na twee jaar is de woning voor hem geen eigen woning meer (renteaftrek).',
      'Draagplicht, overbedeling en eigenwoningreserve vastleggen; geen juridisch advies (advocaat, mediator, notaris).',
      'Overbrugging: toets dubbele woonlasten en de looptijd van de overbruggingslening tegenover de verwachte verkoop.',
      'ORV, begunstiging en pensioenverevening aanpassen.'
    ],
    docs: [
      'Echtscheidingsconvenant (of concept), akte van verdeling',
      'Taxatierapport (recent)',
      'Bevestiging ontslag hoofdelijke aansprakelijkheid',
      'Inkomensdocumenten blijver, alimentatie-afspraken',
      'Draagplichtberekening'
    ],
    partijen: [
      {p: 'Lloyds Bank', m: 'bij scheiding is een adviseur verplicht'},
      {p: 'Venn Hypotheken', m: 'dubbele woonlasten'},
      {p: 'ING', m: 'Overbruggingshypotheek'},
      {p: 'Florius', m: 'Overbruggingslening'},
      {p: 'Argenta', m: 'Overbruggingshypotheek'}
    ],
    bronnen: [
      ['NHG V&N 2026-1, C.6.3, D.1.3.1, D.2 en D.4 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k74: NHG oversluiten, verhogen, scheiding', 'index.html#artikel-k74'],
      ['Kennisbank k81: Scheiding in de praktijk', 'index.html#artikel-k81'],
      ['AFM: geen reguliere krediettoets nodig bij relatiebreuk (2013)', 'https://www.afm.nl/nl-nl/nieuws/2013/okt/hypotheek-echtscheiding'],
      ['Belastingdienst: wie mag hypotheekrente aftrekken na scheiding', 'https://www.belastingdienst.nl/wps/wcm/connect/nl/scheiden/content/wie-mag-hypotheekrente-aftrekken-na-scheiding'],
      ['Draagplicht (rekenhulp)', 'draagplicht.html'],
      ['Overbrugging (rekenhulp)', 'overbrugging.html']
    ]
  },
  {
    id: 'samenwonen-inbreng', cat: 'levensfase',
    titel: 'Samenwonen met ongelijke inbreng',
    kort: 'Partners kopen samen, maar één van beiden brengt meer eigen geld of overwaarde in.',
    zoek: 'samenwonen ongelijke inbreng eigen geld overwaarde samenlevingscontract eigendomsverhouding vergoedingsrecht huwelijkse voorwaarden',
    nhg: [
      'Iedere aanvrager is hoofdelijk aansprakelijk, (mede-)eigenaar en bewoner (C.3.2). De V&N regelen de onderlinge eigendomsverhouding of inbreng niet.',
      'Later een partner toevoegen kan als die hoofdelijk aansprakelijk, (mede-)eigenaar en bewoner wordt; is zijn inkomen nodig, dan volgt een nieuwe toets (D.1.2.1, D.4.1.1).'
    ],
    trhk: [
      'Toetsinkomen van beide partners telt volledig mee; de inbreng zelf verandert de norm niet, wel de benodigde lening.'
    ],
    aandacht: [
      'Leg eigendomsverhouding, inbreng en een eventueel vergoedingsrecht vast in samenlevingscontract, huwelijkse of partnerschapsvoorwaarden of bij de notaris.',
      'Eigenwoningreserve van de partner die overwaarde inbrengt: kan doorwerken in de eigenwoningschuld.',
      'Fiscaal partnerschap: de verdeling van de renteaftrek is vrij te kiezen, los van de eigendom.',
      'ORV en verdeling bij relatiebreuk of overlijden bespreken; geen juridisch advies.'
    ],
    docs: [
      'Samenlevingscontract of (concept) huwelijkse voorwaarden',
      'Overzicht inbreng per partner met bewijs van herkomst',
      'Berekening eigenwoningreserve (bij overwaarde uit een vorige woning)'
    ],
    partijen: [],
    geenPartijen: 'De Partijenwegwijzer en de kennisbank noemen geen geldverstrekker-specifieke regels voor ongelijke inbreng.',
    bronnen: [
      ['NHG V&N 2026-1, C.3.2 en D.1.2 (pdf)', 'documenten/nhg-voorwaarden-normen-2026.pdf'],
      ['Kennisbank k28: Huwelijksgoederenrecht, samenlevingscontract en scheiding', 'index.html#artikel-k28'],
      ['Belastingdienst: samenwonen', 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/relatie_familie_en_gezondheid/relatie/samenwoners/samenwonen'],
      ['Rijksoverheid: verschil huwelijk, partnerschap en samenlevingscontract', 'https://www.rijksoverheid.nl/vraag-en-antwoord/trouwen-samenlevingscontract-en-geregistreerd-partnerschap/wat-is-het-verschil-tussen-een-huwelijk-geregistreerd-partnerschap-en-samenlevingscontract']
    ]
  }
  ]
};
