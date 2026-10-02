// Partijenwegwijzer: openbare informatie die geldverstrekkers, verzekeraars en pensioenuitvoerders voor adviseurs publiceren.
// Peildatum 3 oktober 2026. Elke bron-URL kwam voor in een zoekresultaat; geen rentes, premies of tijdgebonden acties.
// Optioneel: status/statusBron (fusie, label gestopt) en per kenmerk een thema (verhuisregeling, boetevrij aflossen, enz.).
// Types: bank, geldverstrekker, verzekeraar, pensioenverzekeraar, pensioenfonds, ppi, beleggingsinstelling, kredietverstrekker.
// Categorieen (productdomein, meerdere mogelijk): hypotheek, leven, schade, inkomen, lijfrente, krediet, pensioen.
window.PARTIJEN=[
 {naam:'ING',type:'bank',categorieen:['hypotheek','lijfrente'],url:'https://intermediairs.ing.nl/content/ingex-live-public/nl_NL/home.html',
  producten:['hypotheek','hypotheek verhogen','ondernemers'],
  kenmerken:[
   {tekst:'Eigen intermediairsite; voor samenwerking zijn KvK-inschrijving en een passende Wft-vergunning nodig',bron:'https://intermediairs.ing.nl/content/ingex-live-public/nl_NL/home/samenwerken-met-ing.html'},
   {tekst:'Hypotheekrente per energielabel (G tot en met A++++); bij een beter geregistreerd label past de rente zich binnen de rentevaste periode aan',bron:'https://banken.nl/nieuws/26072/ing-gaat-elk-energielabel-koppelen-aan-hypotheekrente'},
   {tekst:'Publiceert de ING Intermediair Index over het vertrouwen van hypotheekadviseurs',bron:'https://nieuws.ing.nl/nl-NL/216539-ing-intermediair-index-intermediair-speelt-toenemende-rol-bij-advies-duurzaamheid'},
   {tekst:'Aparte intermediairinformatie voor ondernemers',bron:'https://intermediairs.ing.nl/content/ingex-live-public/nl_NL/home/ondernemer.html'},
   {thema:'Verhuisregeling',tekst:'Rente meenemen kan tot 6 maanden na aflossing van de oude hypotheek; de klant kiest tussen de oude rente voor de resterende rentevaste periode of middelen met de actuele rente',bron:'https://www.ing.nl/particulier/hypotheek/huis-kopen/ander-huis-kopen/hypotheek-meenemen'},
   {thema:'Boetevrij aflossen',tekst:'Jaarlijks 10% van de oorspronkelijke hoofdsom zonder kosten; bij verkoop en verhuizing meestal geen aflossingskosten, behalve bij bepaalde rentecontracten',bron:'https://www.ing.nl/particulier/hypotheken/uw-situatie/uw-ing-hypotheek/kosten-aflossen-en-tussentijdse-renteaanpassing/index.html'},
   {thema:'Renteafspraken',tekst:'Tussentijds rente aanpassen kan via rentemiddeling (opslag op de nieuwe rente) of via afkoop in één bedrag; bij middelen is de keuze in nieuwe rentevaste perioden beperkter dan bij afkoop',bron:'https://www.ing.nl/particulier/hypotheek/jouw-hypotheek/tussentijds-aanpassen'},
   {thema:'Zzp en flexibel inkomen',tekst:'Accepteert inkomensverklaringen van Overviewz, Pentrax, Raadhuys en Zakelijk Inkomen, voor nieuwe aanvragen en beheerverzoeken',bron:'https://intermediairs.ing.nl/content/ingex-live-public/nl_NL/home/ondernemer.html'},
   {thema:'Senioren',tekst:'Aparte voorwaarden voor 57-plussers: eisen aan de minimale rentevaste periode hangen af van de afstand tot de AOW-leeftijd, en de schuld op AOW-leeftijd is begrensd ten opzichte van de marktwaarde',bron:'https://intermediairs.ing.nl/content/ingex-live-public/nl_NL/home/hypotheekvoorsenioren57.html'},
   {thema:'Overbrugging',tekst:'Overbruggingshypotheek heeft standaard een looptijd van 2 jaar',bron:'https://www.ing.nl/particulier/hypotheek/hypotheekvormen/overbruggingshypotheek'},
   {thema:'Bouwdepot',tekst:'Bouwdepot loopt standaard 2 jaar en kan één keer met een jaar worden verlengd',bron:'https://www.ing.nl/particulier/hypotheek/jouw-hypotheek/bouwdepot'},
   {thema:'Lijfrente',tekst:'Lijfrente opbouwen via ING Pensioenbeleggen in eigen indexfondsen; een apart product om voor pensioen te sparen biedt ING niet',bron:'https://www.ing.nl/particulier/beleggen/beleggen-bij-ing/pensioenbeleggen'},
   {thema:'Lijfrente-uitkering',tekst:'Uitkering start standaard op de AOW-leeftijd; wie eerder start, moet minimaal twintig jaar plus het aantal jaren tot de AOW-leeftijd laten uitkeren',bron:'https://www.ing.nl/particulier/beleggen/beleggen-bij-ing/pensioenbeleggen'},
   {thema:'Lijfrente',tekst:'Pensioenbeleggen is er ook voor ondernemers en zzp\'ers',bron:'https://www.ing.nl/zakelijk/beleggen/pensioenbeleggen'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'ABN AMRO',type:'bank',categorieen:['hypotheek','lijfrente'],url:'https://intermediair.abnamro.nl/',
  producten:['hypotheek','ondernemershypotheek','verduurzamen'],
  kenmerken:[
   {tekst:'Intermediair-app voor onafhankelijke adviseurs met onder meer de status van aanvragen',bron:'https://intermediair.abnamro.nl/vraag-antwoord-intermediair-app'},
   {tekst:'Klant kan hypotheekgegevens delen met de eigen adviseur; toestemming van de klant is vereist (AVG)',bron:'https://intermediair.abnamro.nl/hypotheekgegevens-delen'},
   {tekst:'Beter Wonen: hypotheek gekoppeld aan een verduurzamingstraject waarbij partners advies, subsidieaanvraag en uitvoering regelen',bron:'https://www.banken.nl/nieuws/26768/abn-amro-koppelt-hypotheek-aan-verduurzamingstraject-via-beter-wonen'},
   {tekst:'Hypotheekrente gekoppeld aan het energielabel (net als bij Florius)',bron:'https://www.synergroen.nl/nieuws-inzichten/hypotheekrentekorting-energielabel-2026-overzicht-banken'},
   {thema:'Verhuisregeling',tekst:'Basisrente (zonder kortingen of opslagen) en hypotheekvorm gaan mee, tot maximaal de openstaande schuld; bij eerst verkopen moet het renteaanbod binnen 3 maanden (Budget Hypotheek) of 6 maanden (Woning Hypotheek) volgen',bron:'https://intermediair.abnamro.nl/verhuisregeling-hypotheek'},
   {thema:'Verhuisregeling',tekst:'Uitgezonderd van de verhuisregeling zijn onder meer de Duurzaam Wonen Hypotheek, Overwaarde Hypotheek, overbruggingslening, restschuldfinanciering en Euribor-leningdelen',bron:'https://intermediair.abnamro.nl/verhuisregeling-hypotheek'},
   {thema:'Boetevrij aflossen',tekst:'Meestal 10% van het oorspronkelijke bedrag per jaar vergoedingsvrij; is de verkoopopbrengst bij de verhuisregeling hoger dan begroot, dan mag dat verschil binnen 12 maanden vrij worden afgelost',bron:'https://www.abnamro.nl/nl/prive/hypotheken/mijn-hypotheek/extra-aflossen/index.html'},
   {thema:'Boetevrij aflossen',tekst:'Sinds 1 december 2025 geen vergoeding meer bij extra aflossen op leningdelen in de vorm beleggings-, levens- of aflossingsvrije hypotheek',bron:'https://www.abnamro.nl/nl/prive/hypotheken/mijn-hypotheek/extra-aflossen/index.html'},
   {thema:'Renteafspraken',tekst:'Rentemiddeling kan alleen als de resterende rentevaste periode korter is dan 10 jaar; de nieuwe periode is 5 of 10 jaar en de vergoeding wordt als opslag over die hele periode betaald',bron:'https://www.abnamro.nl/nl/prive/hypotheken/mijn-hypotheek/hypotheekrente-wijzigen/rentemiddeling.html'},
   {thema:'Renteafspraken',tekst:'Rentebedenktijd rond het einde van de rentevaste periode',bron:'https://intermediair.abnamro.nl/rentebedenktijd'},
   {thema:'Zzp en flexibel inkomen',tekst:'Arbeidsmarktscan als alternatief voor de perspectiefverklaring voor flexwerkers met minimaal 12 maanden inkomen uit arbeid in de afgelopen 14 maanden',bron:'https://intermediair.abnamro.nl/arbeidsmarktscan'},
   {thema:'Zzp en flexibel inkomen',tekst:'Via het werkgeversverklaringmodel kan een flexibel budget meetellen als inkomen',bron:'https://intermediair.abnamro.nl/werkgeversverklaring'},
   {thema:'Senioren',tekst:'Overwaarde Hypotheek voor 62-plussers met een stappenplan voor de inkomenstoets voor en na de AOW-leeftijd',bron:'https://intermediair.abnamro.nl/overwaarde-hypotheek'},
   {thema:'Lijfrente',tekst:'Lijfrente opbouwen met de Pensioenaanvulling: sparen, beleggen of een combinatie',bron:'https://www.abnamro.nl/nl/prive/pensioen/pensioen-opbouwen/lijfrente.html'},
   {thema:'Lijfrente-uitkering',tekst:'Uitkeren via Leefrente; de klant kiest de looptijd en een uitkering per maand, kwartaal of halfjaar',bron:'https://www.abnamro.nl/nl/prive/pensioen/pensioen-uitkeren/lijfrente-uitkeren/index.html'},
   {thema:'Status',tekst:'Neobroker BUX is sinds de afgeronde overname een dochter van ABN AMRO en houdt een eigen naam',bron:'https://www.abnamro.com/nl/nieuws/abn-amro-rondt-overname-bux-af-bux-wordt-dochteronderneming'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Rabobank',type:'bank',categorieen:['hypotheek','lijfrente'],url:'https://www.rabobank.nl/bedrijven/intermediairs/hypotheek',
  producten:['hypotheek','verduurzamen en verbouwen'],
  kenmerken:[
   {tekst:'Intermediairdesks ondersteunen adviseurs voor de aanvraag en tijdens de looptijd',bron:'https://www.rabobank.nl/bedrijven/intermediairs/hypotheek/samenwerken'},
   {tekst:'Duurzaamheidskorting bij een energielabel A of beter',bron:'https://www.rabobank.nl/particulieren/hypotheek/voordelen-rabobank-hypotheek/korting-op-je-hypotheekrente'},
   {tekst:'Initiatiefnemer (met CMIS Franchise) van de opleiding Adviseur Duurzaam Wonen',bron:'https://www.banken.nl/nieuws/22745/inmiddels-meer-dan-6000-adviseurs-duurzaam-wonen'},
   {tekst:'Informatie voor adviseurs over verduurzamen en verbouwen',bron:'https://www.rabobank.nl/bedrijven/intermediairs/hypotheek/verduurzamen-verbouwen'},
   {thema:'Verhuisregeling',tekst:'Verhuisfaciliteit: het rentecontract gaat mee tot de einddatum van de lopende rentevaste periode en tot maximaal het bedrag van de oude lening',bron:'https://www.rabobank.nl/particulieren/hypotheek/ander-huis-kopen/verhuizen'},
   {thema:'Boetevrij aflossen',tekst:'Vergoedingsvrije ruimte is meestal 20% van het oorspronkelijke bedrag per leningdeel per kalenderjaar; geen vergoeding bij verhuizing of overlijden',bron:'https://www.rabobank.nl/particulieren/hypotheek/service/vergoeding-vervroegd-aflossen/'},
   {thema:'Renteafspraken',tekst:'Met Plusvoorwaarden is rentemiddeling mogelijk en geldt een langere termijn om de lening na het aanbod op te nemen dan met Basisvoorwaarden',bron:'https://www.rabobank.nl/particulieren/hypotheek/hypotheekvormen-en-voorwaarden/plusvoorwaarden'},
   {thema:'Bouwdepot',tekst:'Bouwdepot heeft een maximale looptijd van 2 jaar; de rentevergoeding op het depot is gelijk aan de hypotheekrente',bron:'https://www.rabobank.nl/particulieren/hypotheek/hypotheekvormen-en-voorwaarden/hypotheekproducten/bouwdepot'},
   {thema:'Zzp en flexibel inkomen',tekst:'Gesprek over een hypotheek kan al na 6 maanden ondernemerschap; tussentijdse halfjaarcijfers kunnen meetellen; inkomensverklaring via Rabobank of een erkende rekenexpert',bron:'https://www.rabobank.nl/bedrijven/intermediairs/hypotheek/ondernemer-in-prive'},
   {thema:'Zzp en flexibel inkomen',tekst:'Arbeidsmarktscan als route voor klanten zonder vast contract',bron:'https://www.rabobank.nl/particulieren/hypotheek/eerste-huis-kopen/zonder-vast-contract/arbeidsmarktscan'},
   {thema:'Lijfrente',tekst:'Opbouw via Rabo ToekomstSparen (sparen) of Rabo ToekomstBeleggen (beleggen)',bron:'https://www.rabobank.nl/particulieren/pensioen/alle-oplossingen/rabo-toekomstbeleggen'},
   {thema:'Lijfrente-uitkering',tekst:'Rabo ToekomstUitkering: vaste uitkering met zelf gekozen frequentie; minimaal 5 jaar, start in het jaar van de AOW-leeftijd of binnen 5 jaar daarna, met een wettelijk maximum per jaar',bron:'https://www.rabobank.nl/particulieren/pensioen/alle-oplossingen/rabo-toekomstuitkering'},
   {thema:'Lijfrente-uitkering',tekst:'Ook een vrijkomende lijfrentespaarrekening van een andere bank kan naar de ToekomstUitkering',bron:'https://www.rabobank.nl/particulieren/pensioen/lijfrente-komt-vrij/vrijval-lijfrentespaarrekening-andere-bank'},
   {tekst:'Consumptief krediet loopt via dochter Freo',bron:'https://www.freo.nl/over-freo/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Obvion',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.obvion.nl/adviseur/Samenwerken-Obvion',
  producten:['hypotheek','starters'],
  kenmerken:[
   {tekst:'Werkt uitsluitend via onafhankelijke adviseurs',bron:'https://mtsprout.nl/partners/obvion/mooie-stappen-maken-door-focus-en-verbinding'},
   {tekst:'Volledig onderdeel van Rabobank',bron:'https://www.banken.nl/nieuws/269/rabobank-100-eigenaar-van-obvion'},
   {tekst:'Informatie over de perspectiefverklaring voor inkomen uit flexibel werk',bron:'https://obvion.nl/situatie/werken/perspectiefverklaring/'},
   {tekst:'Duurzaamheidskorting vanaf energielabel B; vervalt bij gebruik van de verhuisregeling tenzij de nieuwe woning minimaal label A heeft',bron:'https://www.homefinance.nl/hypotheek/kortingen/duurzaamheidskorting/'},
   {thema:'Verhuisregeling',tekst:'Wie de verhuisregeling later wil gebruiken, meldt dat uiterlijk 1 werkdag vóór aflossing van de huidige hypotheek schriftelijk aan Obvion',bron:'https://www.obvion.nl/Huis-verkopen/Verhuisregeling-3'},
   {thema:'Boetevrij aflossen',tekst:'Geen vergoeding bij aflossing door verkoop van de woning en bij aflossen op de renteherzieningsdatum',bron:'https://www.obvion.nl/Financien/Hypotheek-aflossen.htm'},
   {thema:'Renteafspraken',tekst:'Rentemiddeling op basis van een gewogen gemiddelde van oude en nieuwe rente, alleen voor de Obvion Hypotheek',bron:'https://www.obvion.nl/Hypotheekrente/Rentemiddeling.htm'},
   {thema:'Bouwdepot',tekst:'Bouwdepot maximaal 2 jaar (nieuwbouw 3 jaar); renteaanbod geldig 3 maanden bij bestaande bouw en 6 maanden bij nieuwbouw',bron:'https://obvion.nl/media/kxudk0d2/product-en-acceptatiekaart.pdf'},
   {thema:'Senioren',tekst:'Ruimere acceptatieregels voor verhuizende klanten die de AOW-leeftijd hebben of binnen 10 jaar bereiken',bron:'https://obvion.nl/media/kxudk0d2/product-en-acceptatiekaart.pdf'},
   {thema:'Zzp en flexibel inkomen',tekst:'Ook startende zzp\'ers en ondernemers, met of zonder NHG; inkomensverklaring vereist',bron:'https://obvion.nl/hypotheek/zzp/'},
   {thema:'Zzp en flexibel inkomen',tekst:'Arbeidsmarktscan bruikbaar voor flexwerkers bij voldoende score',bron:'https://obvion.nl/situatie/werken/arbeidsmarktscan/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Florius',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.florius.nl/hypotheek',
  producten:['hypotheek','Verzilver Hypotheek','55-plus'],
  kenmerken:[
   {tekst:'Verzilver Hypotheek alleen via adviseurs met een volledige samenwerking (niet bij alleen een servicesamenwerking)',bron:'https://www.florius.nl/-/media/florius/files/verzilver/verzilver-hypotheek-veelgestelde-vragen-intermediairs.pdf'},
   {tekst:'Functie Kopieen: adviseur kan klantcorrespondentie van Florius inzien',bron:'https://www.banken.nl/nieuws/26759/florius-wil-met-lancering-kopieen-nieuwe-sectorstandaard-zetten'},
   {tekst:'Uitgebreid aanbod voor 55-plussers',bron:'https://www.florius.nl/adviseurs/pers/florius-breidt-aanbod-voor-55plussers-uit'},
   {tekst:'Informatie over de arbeidsmarktscan als route voor inkomen',bron:'https://www.florius.nl/hypotheek/arbeidsmarktscan'},
   {thema:'Verhuisregeling',tekst:'Basis van de rentevaste periode gaat mee voor de resterende looptijd; bij eerst verkopen moet de nieuwe lening binnen 6 maanden worden aangevraagd, bij de Compleet Hypotheek binnen 24 maanden',bron:'https://www.florius.nl/situatie-wijzigt/verhuizen/verhuisregeling'},
   {thema:'Boetevrij aflossen',tekst:'Aflossen uit eigen middelen kan volledig zonder vergoeding; bij aflossen met geleend geld kan een vergoeding gelden',bron:'https://www.florius.nl/hypotheek/vergoedingsrente'},
   {thema:'Renteafspraken',tekst:'Wie na rentemiddeling verhuist, betaalt het resterende deel van de middelingsopslag niet meer',bron:'https://www.florius.nl/adviseurs/rente/renteafkoop-en-rentemiddeling'},
   {thema:'Overbrugging',tekst:'Overbruggingslening loopt maximaal 24 maanden bij bestaande bouw en 36 maanden bij nieuwbouw',bron:'https://www.florius.nl/hypotheek/overbruggingslening'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'ASN Bank (de Volksbank)',type:'bank',categorieen:['hypotheek'],url:'https://www.asnbank.nl/hypotheek/onafhankelijke-adviseurs.html',
  producten:['hypotheek','duurzaam leningdeel','bedrijfshypotheek'],
  kenmerken:[
   {tekst:'De Volksbank gaat verder als ASN Bank; de merken SNS, RegioBank en BLG Wonen verdwijnen',bron:'https://nos.nl/l/2548505'},
   {tekst:'Duurzaam leningdeel voor maatregelen in, op en om het huis',bron:'https://www.homefinance.nl/hypotheek/aanbieders/asn/'},
   {tekst:'Bestaande klanten kunnen voor verduurzamen of verbouwen online verhogen zonder adviseur (met kennis- en ervaringstoets)',bron:'https://www.asnbank.nl/hypotheek/online-hypotheek-verhogen/kennis-en-ervaringstoets.html'},
   {tekst:'ASN Hypotheek ook beschikbaar via serviceprovider Huismerk',bron:'https://www.asnbank.nl/nieuws-pers/asn-hypotheek-nu-ook-beschikbaar-via-serviceprovider-huismerk.html'},
   {thema:'Verhuisregeling',tekst:'Rente Meeneemregeling voor verhuizende klanten',bron:'https://www.asnbank.nl/hypotheek/rente-meeneemregeling.html'},
   {thema:'Boetevrij aflossen',tekst:'Geen vergoeding bij verkoop en verhuizing als met de opbrengst wordt afgelost, en ook niet bij aflossen op de renteaanpassingsdatum',bron:'https://www.asnbank.nl/web/file?uuid=98bf31e4-9fef-4628-b5ba-3ee3784015df&owner=6916ad14-918d-4ea8-80ac-f71f0ff1928e&contentid=2742'},
   {thema:'Verhuisregeling',tekst:'Let op bij de budgetoptie \'boete bij verhuizen\': dan kan een vergoeding gelden als de nieuwe hypotheek niet bij de bank wordt afgesloten',bron:'https://www.asnbank.nl/web/file?uuid=98bf31e4-9fef-4628-b5ba-3ee3784015df&owner=6916ad14-918d-4ea8-80ac-f71f0ff1928e&contentid=2742'},
   {thema:'Intermediairportal',tekst:'Voor adviseurs belooft ASN Bank na de merkovergang continuïteit van contactpersonen en ondersteuning',bron:'https://www.banken.nl/nieuws/26887/blg-wonen-gaat-op-in-asn-bank'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'RegioBank',type:'bank',categorieen:['hypotheek'],url:'https://www.regiobank.nl/hypotheek-particulier.html',
  status:'Merk opgegaan in ASN Bank (voormalig de Volksbank); nieuwe hypotheken via ASN Bank',statusBron:'https://nos.nl/l/2548505',
  producten:['hypotheek','hypotheek verhogen'],
  kenmerken:[
   {tekst:'Hypotheken via zelfstandige adviseurs in ruim 400 kantoren',bron:'https://www.homefinance.nl/hypotheek/aanbieders/regiobank/advies/'},
   {tekst:'Verhogen loopt via de zelfstandig adviseur',bron:'https://www.regiobank.nl/hypotheken/hypotheek-verhogen/hypotheek-verhogen-via-zelfstandig-adviseur.html'},
   {tekst:'Klanten kunnen een deel van de wijzigingen zelf online regelen',bron:'https://www.regiobank.nl/hypotheken/hypotheek-aanpassen.html'},
   {tekst:'Merk gaat op in ASN Bank',bron:'https://nos.nl/l/2548505'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'BLG Wonen',type:'bank',categorieen:['hypotheek'],url:'https://www.asnbank.nl/blg-wonen/bedrijfshypotheek.html',
  status:'Sinds 1 maart 2026 officieel onderdeel van ASN Bank; BLG Wonen was het laatste Volksbank-merk dat overging',statusBron:'https://www.banken.nl/nieuws/26887/blg-wonen-gaat-op-in-asn-bank',
  producten:['hypotheek','bedrijfshypotheek','overbrugging'],
  kenmerken:[
   {tekst:'Altijd via een adviseur; execution only is niet mogelijk',bron:'https://www.homefinance.nl/hypotheek/aanbieders/blg/'},
   {tekst:'BLG Wonen is officieel onderdeel van ASN Bank',bron:'https://newsroom.asnbank.nl/download/107e2eb7-e7c9-4e17-b63e-1fa18c1494e6/persbericht-blgwonennuookofficieelasnbank.pdf'},
   {tekst:'Zakelijke bedrijfshypotheek staat op de site van ASN Bank',bron:'https://www.asnbank.nl/blg-wonen/bedrijfshypotheek.html'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Triodos Bank',type:'bank',categorieen:['hypotheek'],url:'https://www.triodos.nl/intermediairs',
  producten:['hypotheek','verduurzamen'],
  kenmerken:[
   {tekst:'Werkt naast eigen advies met een geselecteerde groep onafhankelijke adviseurs',bron:'https://www.triodos.nl/intermediairs'},
   {tekst:'Adviseur kan met toestemming van de klant leningdata inzien via E-Adviseur of een HDN-bericht',bron:'https://www.triodos.nl/intermediairs'},
   {tekst:'Rente afhankelijk van het energielabel; hypotheken hebben het Europese Energy Efficient Mortgage Label',bron:'https://www.banken.nl/nieuws/23168/triodos-hypotheken-ontvangen-europees-energie-efficientielabel'},
   {tekst:'Maximale financiering gekoppeld aan energieprestatie: bij label C of lager een lagere maximale LTV',bron:'https://www.banken.nl/nieuws/22440/triodos-bank-perkt-hypothecaire-leennormen-in-voor-onzuinig-huis'},
   {thema:'Verhuisregeling',tekst:'Tussen levering van de oude en de nieuwe woning mag maximaal 6 maanden zitten; een geldig energielabel van de nieuwe woning is nodig en de nieuwe rente hangt mede af van marktwaarde, bedrag en label',bron:'https://www.triodos.nl/hypotheken/verhuisregeling'},
   {thema:'Verhuisregeling',tekst:'De Energiebespaarlening gaat niet mee bij verhuizing en moet worden afgelost',bron:'https://www.triodos.nl/hypotheken/verhuisregeling'},
   {thema:'Boetevrij aflossen',tekst:'Extra aflossen uit eigen middelen kan zonder maximum en zonder vergoeding',bron:'https://app.triodos.nl/downloads/algemene-voorwaarden-basisinformatie-voor-woninghypotheken?id=4ed5acec9074'},
   {thema:'Zzp en flexibel inkomen',tekst:'Inkomensverklaring alleen van een NHG-erkende rekenexpert; startende ondernemers minimaal 12 maanden actief en met vergelijkbare werkervaring in de branche',bron:'https://www.triodos.nl/downloads/acceptatiebeleid-hypotheken-juli-2026?id=50c63188e554'},
   {thema:'Senioren',tekst:'Maatwerk mogelijk voor verhuizende senioren en voor senioren met een tijdelijk tekort door het AOW-gat',bron:'https://www.triodos.nl/downloads/acceptatiebeleid-hypotheken-juli-2026?id=50c63188e554'},
   {thema:'Acceptatie',tekst:'Motivatieformulier voor aanvragen buiten de normen (overrule/explain)',bron:'https://www.triodos.nl/downloads/motivatieformulier-overruleexplain-triodos-bank?id=c3f1340004db'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Argenta',type:'bank',categorieen:['hypotheek'],url:'https://www.argenta.nl/adviseur/helpen-met-fijn-wonen',
  producten:['hypotheek','overbruggingshypotheek'],
  kenmerken:[
   {tekst:'Verkoopt hypotheken in Nederland via onafhankelijke adviseurs',bron:'https://www.argenta.nl/adviseur/over-ons/weet-je-dat/benoeming-bruno-oudega-tot-directeur-wonen-argenta-nederland'},
   {tekst:'Hypotheekgids voor adviseurs met de acceptatievoorwaarden',bron:'https://www.argenta.nl/sites/default/files/documents/Argenta_Hypotheekgids.pdf'},
   {tekst:'Overbruggingshypotheek in combinatie met een Argenta Hypotheek, looptijd maximaal 24 maanden',bron:'https://www.homefinance.nl/hypotheek/aanbieders/argenta/overbruggingshypotheek/'},
   {tekst:'Overzicht van documenten voor aanvragen en wijzigingen',bron:'https://www.argenta.nl/adviseur/documenten-voor-het-aanvragen-of-wijzigen-van-de-argenta-hypotheek'},
   {thema:'Verhuisregeling',tekst:'Rente meenemen tot 12 maanden na verkoop; minimaal 30 dagen vóór aflossing aanvragen; bij tijdelijk twee hypotheken wordt de rente van de oude lening omgezet naar de dan geldende 1-jaarsrente',bron:'https://www.argenta.nl/adviseur/de-argenta-verhuisregeling'},
   {thema:'Boetevrij aflossen',tekst:'Vergoedingsvrij aflossen uit eigen middelen zoals spaargeld, schenking of erfenis',bron:'https://www.argenta.nl/contact/veelgestelde-vragen/extra-aflossen/wanneer-mag-je-de-hypotheekschuld-boetevrij-aflossen'},
   {thema:'Renteafspraken',tekst:'Rentemiddeling en rentebedenktijd zijn bij Argenta niet mogelijk; offerte standaard 3 maanden geldig met mogelijkheid tot verlenging',bron:'https://www.argenta.nl/sites/default/files/documents/Argenta_Hypotheekgids.pdf'},
   {thema:'Bouwdepot',tekst:'Bouwdepot 24 maanden, afhankelijk van de voorwaarden maximaal 2 keer met 6 maanden te verlengen',bron:'https://www.argenta.nl/sites/default/files/documents/Argenta_Hypotheekgids.pdf'},
   {thema:'Zzp en flexibel inkomen',tekst:'Zelfstandigen zijn welkom; de arbeidsmarktscan wordt niet geaccepteerd',bron:'https://www.argenta.nl/sites/default/files/documents/Argenta_Hypotheekgids.pdf'},
   {thema:'Senioren',tekst:'Volgt de seniorenregels van NHG (niet bij oversluiten)',bron:'https://www.argenta.nl/sites/default/files/documents/Argenta_Hypotheekgids.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Lloyds Bank',type:'bank',categorieen:['hypotheek'],url:'https://www.lloydsbank.nl/informatie-voor-financieel-adviseurs',
  producten:['hypotheek'],
  kenmerken:[
   {tekst:'Intermediair Service Desk (ISD) met vaste dossierbehandelaars',bron:'https://www.lloydsbank.nl/wie-zijn-wij/werken-bij/Hypotheek-Acceptant-ISD'},
   {tekst:'Hypotheek online zonder advies of via een onafhankelijk adviseur',bron:'https://www.lloydsbank.nl/hypotheken/zelf-of-via-adviseur'},
   {tekst:'Hypotheekgids met de acceptatievoorwaarden',bron:'https://www.lloydsbank.nl/dam/jcr:96a5a341-9ea6-4015-b53d-8bf87a36a681/hypotheekgids.pdf'},
   {tekst:'Nieuwsbrief speciaal voor intermediairs',bron:'https://www.lloydsbank.nl/dam/jcr:80abb2c8-88b4-4751-91f5-3b0d7d02ffbd/lloyds-bank-nieuwsbrief-intermediair-q1-2026.pdf'},
   {thema:'Verhuisregeling',tekst:'Met de verhuisregeling geen vergoeding voor het aflossen van de oude hypotheek en kan de lagere rente mee; bij scheiding is een adviseur verplicht',bron:'https://www.lloydsbank.nl/hypotheken/verhuizen'},
   {thema:'Boetevrij aflossen',tekst:'Per kalenderjaar 10% van de oorspronkelijke hypotheek zonder vergoeding',bron:'https://www.lloydsbank.nl/hypotheken/extra-aflossen'},
   {thema:'Offerte',tekst:'Bindend aanbod 90 dagen geldig gerekend vanaf het indicatieve aanbod, met maximaal 90 dagen verlenging',bron:'https://www.lloydsbank.nl/informatie-voor-financieel-adviseurs/hypotheekgids/lbh-hypotheekaanbod'},
   {thema:'Zzp en flexibel inkomen',tekst:'Inkomensverklaring van een geaccepteerde rekenexpert, niet ouder dan 6 maanden; zonder NHG minimaal 2 jaar zelfstandig',bron:'https://www.lloydsbank.nl/informatie-voor-financieel-adviseurs/hypotheekgids/lbh-inkomen'},
   {thema:'Senioren',tekst:'Seniorenpropositie en regeling voor een tijdelijk tekort, met of zonder NHG',bron:'https://www.lloydsbank.nl/dam/jcr:96a5a341-9ea6-4015-b53d-8bf87a36a681/hypotheekgids.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'NIBC',type:'bank',categorieen:['hypotheek'],url:'https://nibc.nl/intermediair/hypotheekdesk',
  producten:['hypotheek','investeringshypotheek','nieuwbouw'],
  kenmerken:[
   {tekst:'Hypotheekdesk als sparringpartner voor adviseurs, ook bij complexe situaties',bron:'https://nibc.nl/intermediair/hypotheekdesk'},
   {tekst:'Acceptatiegids voor de NIBC Hypotheek en de NIBC Investeringshypotheek',bron:'https://nibc.nl/media/iz4jyx3h/2025-03-31-acceptatiegids-2025-nibc-12.pdf'},
   {tekst:'Verduurzamingsoplossing gericht op klant en adviseur',bron:'https://www.banken.nl/nieuws/25701/nieuwe-verduurzamingsoplossing-nibc-moet-win-winsituatie-opleveren-voor-klant-en-adviseur'},
   {tekst:'Informatie voor adviseurs over nieuwbouwfinanciering',bron:'https://nibc.nl/intermediair/hypotheken/nieuwbouw'},
   {thema:'Verhuisregeling',tekst:'Meenemen kan tot 6 maanden na aflossing (NIBC Hypotheek) of tot 9 maanden (NIBC Extra Hypotheek)',bron:'https://nibc.nl/intermediair/hypotheken/hypotheek-meenemen'},
   {thema:'Boetevrij aflossen',tekst:'Vergoedingsvrij aflossen uit eigen middelen; bij de NIBC Extra Hypotheek daarnaast een jaarlijks vrij percentage',bron:'https://nibc.nl/media/rvammeml/2025-09-17-av-nibc-extra-2025-versie-10.pdf'},
   {thema:'Senioren',tekst:'Extra financieringsmogelijkheden voor 57-plussers met een lange minimale rentevaste periode',bron:'https://nibc.nl/media/0d2hsk24/senioren-factsheet.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Handelsbanken',type:'bank',categorieen:['hypotheek'],url:'https://www.handelsbanken.nl/nl/particulier/hypotheken/nieuw-huis-kopen',
  producten:['hypotheek','vastgoedfinanciering'],
  kenmerken:[
   {tekst:'Lokale relatiebank met vaste contactpersoon; aanvragen worden lokaal beoordeeld, ook als de situatie minder standaard is',bron:'https://www.handelsbanken.nl/'},
   {tekst:'Werkt vanuit lokale kantoren verspreid over Nederland',bron:'https://www.handelsbanken.nl/nl/vind-uw-kantoor/eindhoven'},
   {thema:'Verhuisregeling',tekst:'Vaste rente meenemen naar een volgende eigen woning; beslissen kan ook na verkoop, tot 6 maanden na aflossing van de oude lening',bron:'https://www.handelsbanken.nl/nl/particulier/hypotheken/hypotheek-vraag-antwoord'},
   {thema:'Boetevrij aflossen',tekst:'Kosteloos volledig aflossen bij verkoop en aan het einde van de rentevaste periode; daarnaast jaarlijks 10% per oorspronkelijk leningdeel',bron:'https://www.handelsbanken.nl/nl/particulier/hypotheken/hypotheek-vraag-antwoord'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'MUNT Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.munthypotheken.nl/contact/adviseur/',
  producten:['hypotheek'],
  kenmerken:[
   {tekst:'Alleen via een onafhankelijk adviseur; MUNT geeft zelf geen advies',bron:'https://www.munthypotheken.nl/veelgestelde-vragen/aanvraag-munt-hypotheek/geeft-munt-hypotheken-ook-hypotheekadvies/'},
   {tekst:'Brengt geld van pensioenfondsen en institutionele beleggers naar de woningmarkt',bron:'https://hypotheekberekenen.nl/en/mortgage-providers/munt'},
   {tekst:'Bereikbaar via serviceproviders zoals VCN',bron:'https://www.munthypotheken.nl/service-provider/vcn/'},
   {thema:'Verhuisregeling',tekst:'Rentecondities gaan mee voor de resterende rentevaste periode; de nieuwe MUNT Hypotheek moet binnen 3 maanden na aflossing worden aangevraagd; geen extra kosten',bron:'https://www.munthypotheken.nl/veelgestelde-vragen/aanvraag-munt-hypotheek/heeft-munt-hypotheken-een-verhuisregeling/'},
   {thema:'Boetevrij aflossen',tekst:'Uit eigen geld onbeperkt vergoedingsvrij; bij oversluiten naar een andere verstrekker of tussentijdse rentewijziging 10% per jaar vrij',bron:'https://www.munthypotheken.nl/veelgestelde-vragen/uw-munt-hypotheek/ik-wil-aflossen-op-mijn-hypotheek-moet-ik-een-boete-betalen/'},
   {thema:'Offerte',tekst:'Renteaanbod 4 maanden geldig; 2 weken bedenktijd om te accepteren',bron:'https://www.munthypotheken.nl/site/assets/files/2893/munt_hypotheekgids_2026-2.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Tulp Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://tulphypotheken.nl/adviseurs/',
  producten:['hypotheek','Tulp Riant (NHG)','seniorenpropositie'],
  kenmerken:[
   {tekst:'Seniorenpropositie voor klanten die de AOW-leeftijd hebben of binnen 10 jaar bereiken, ook zonder NHG',bron:'https://tulphypotheken.nl/news/tulp-hypotheken-start-met-seniorenpropositie-ook-voor-niet-nhg/'},
   {tekst:'Tulp Riant Hypotheek gericht op hypotheken met NHG',bron:'https://tulphypotheken.nl/hypotheken/tulp-riant/'},
   {tekst:'Aanstelling en procesinformatie voor adviseurs',bron:'https://tulphypotheken.nl/adviseurs/proces/aanstelling-tulp-2/'},
   {tekst:'Tulp Group is overgenomen door Bankinter',bron:'https://www.bankinter.com/webcorporativa/en/communication-room/news/institutional/bankinter-advances-its-international-expansion-strategy-with-the-acquisition-of-tulp-group--a-dutch-specialist-mortgage-platform'},
   {thema:'Boetevrij aflossen',tekst:'Tulp Riant: uit eigen middelen volledig vergoedingsvrij; met geleend geld maximaal 10% per jaar',bron:'https://tulphypotheken.nl/wp-content/uploads/2025/01/2025-1-Tulp-riant-hypotheek-productkaart-1.pdf'},
   {thema:'Renteafspraken',tekst:'Rente daalt automatisch als de klant door aflossen in een lagere risicoklasse komt',bron:'https://tulphypotheken.nl/hypotheken/tulp-hypotheek/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Venn Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.vennhypotheken.nl/voor-adviseurs/',
  producten:['hypotheek','overbrugging','senioren'],
  kenmerken:[
   {tekst:'Eigen overbruggingsregeling als de huidige woning nog niet is verkocht; aanvragen voor senioren tot 80 procent marktwaarde',bron:'https://www.vennhypotheken.nl/voor-adviseurs/pluspunten/'},
   {tekst:'Toetst bij een onverkochte woning of de klant dubbele woonlasten kan dragen',bron:'https://www.vennhypotheken.nl/voor_adviseurs/nieuws/gewijzigde-acceptatievoorwaarden/'},
   {tekst:'Verhuisregeling toegelicht voor adviseurs',bron:'https://www.vennhypotheken.nl/voor-adviseurs/verhuisregeling/'},
   {tekst:'Werkt uitsluitend via onafhankelijke adviseurs',bron:'https://hypotheekberekenen.nl/en/mortgage-providers/venn'},
   {thema:'Verhuisregeling',tekst:'Minimaal 30 dagen vóór aflossing per e-mail melden; bindend aanbod voor de nieuwe woning binnen 6 maanden na aflossing',bron:'https://www.vennhypotheken.nl/veelgestelde-hypotheekvragen/'},
   {thema:'Boetevrij aflossen',tekst:'Jaarlijks 15% van de oorspronkelijke hoofdsom vergoedingsvrij; bij verhuizen vergoedingsvrij',bron:'https://www.vennhypotheken.nl/mijnhypotheek/aflossen/'},
   {thema:'Offerte',tekst:'Indicatief voorstel 4 maanden geldig; bindend aanbod met 2 maanden te verlengen',bron:'https://www.vennhypotheken.nl/veelgestelde-hypotheekvragen/'},
   {thema:'Renteafspraken',tekst:'Automatische rentedaling bij lagere risicoklasse',bron:'https://www.vennhypotheken.nl/kennisplein/bespaar-door-automatische-rentedaling/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Hypotrust',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.hypotrust.nl/adviseurs',
  producten:['hypotheek','Elan','Vrij Leven'],
  kenmerken:[
   {tekst:'Label sinds 1993, uitsluitend via onafhankelijke adviseurs',bron:'https://www.hypotheekberekenen.nl/en/mortgage-providers/hypotrust'},
   {tekst:'Handelsnaam van Quion Hypotheekbemiddeling',bron:'https://old-www.kifid.nl/fileupload/jurisprudentie/GeschillenCommissie/2017/uitspraak_2017-564.pdf'},
   {tekst:'Informatie over inactieve producten voor bestaande klanten',bron:'https://www.hypotrust.nl/onze-hypotheken/inactieve-hypotheken/goede-start-hypotheek'},
   {thema:'Verhuisregeling',tekst:'Bij de Elan Hypotheek is meenemen niet mogelijk; bij de Elan Plus Hypotheek wel',bron:'https://www.hypotrust.nl/faqs/meeneemregeling'},
   {thema:'Boetevrij aflossen',tekst:'Afhankelijk van het product 10% of 15% van het hypotheekbedrag per jaar vergoedingsvrij',bron:'https://www.hypotrust.nl/faqs/aflossen'},
   {thema:'Acceptatie',tekst:'Acceptatiekader Elan Plus (versie januari 2026)',bron:'https://www.hypotrust.nl/uploads/hypotrust/files/Acceptatiekader-Hypotrust-Elan-Plus-januari-2026.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'IQWOON',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.iqwoon.nl/adviseur',
  status:'Geen nieuwe aanvragen sinds 1 mei 2023; alleen beheer van bestaande hypotheken',statusBron:'https://www.iqwoon.nl/adviseur',
  producten:['bestaande hypotheken','hypotheek verhogen'],
  kenmerken:[
   {tekst:'Geen nieuwe aanvragen sinds 1 mei 2023; bestaande hypotheken lopen door volgens afspraak',bron:'https://www.homefinance.nl/iqwoon-hypotheekrente-actuele-tarieven-en-voorwaarden/'},
   {tekst:'Bestaande klanten kunnen verhogen, bijvoorbeeld voor verbouwen of verduurzamen',bron:'https://www.iqwoon.nl/hypotheek-verhogen'},
   {tekst:'Label geintroduceerd via Hypotrust',bron:'https://www.banken.nl/nieuws/8179/iqwoon-betreedt-nederlandse-hypotheekmarkt'},
   {thema:'Verhuisregeling',tekst:'Meeneemregeling voor bestaande klanten: minimaal 30 dagen vooraf melden, nieuwe lening binnen 6 maanden na aflossing; kan ook bij eerst kopen en dan verkopen',bron:'https://www.iqwoon.nl/uploads/iqwoon/files/IQWOON-Beheergids-Januari-2026.pdf'},
   {thema:'Boetevrij aflossen',tekst:'20% van de oorspronkelijke hoofdsom per kalenderjaar vergoedingsvrij; ook bij aflossen op de renteherzieningsdatum of bij verkoop en verhuizing',bron:'https://www.iqwoon.nl/uploads/iqwoon/files/IQWOON-Beheergids-Januari-2026.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'HollandWoont',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://hollandwoont.nl/onafhankelijk-hypotheekadvies/',
  producten:['hypotheek met NHG','overbrugging'],
  kenmerken:[
   {tekst:'Richt zich op het NHG-segment en sluit aan op de NHG-voorwaarden',bron:'https://hypotheekberekenen.nl/en/mortgage-providers/hollandwoont'},
   {tekst:'Label van Conneqt, dat ook de distributie van Hypotrust, IQWOON en Robuust verzorgt',bron:'https://hypotheekberekenen.nl/en/mortgage-providers/hollandwoont'},
   {tekst:'Energiebesparende voorzieningen meefinancieren en overbrugging mogelijk',bron:'https://hypotheekberekenen.nl/en/mortgage-providers/hollandwoont'},
   {thema:'Verhuisregeling',tekst:'Meeneemregeling bij eerst kopen of eerst verkopen; minimaal 30 dagen vooraf melden; de rentevaste periode loopt door, ook in een tussenperiode',bron:'https://www.hollandwoont.nl/uploads/hollandwoont/files/HollandWoont-Acceptatiegids-Juni-2026.pdf'},
   {thema:'Boetevrij aflossen',tekst:'10% van de oorspronkelijke hoofdsom per jaar en daarnaast onbeperkt uit eigen middelen',bron:'https://www.hollandwoont.nl/uploads/hollandwoont/files/HollandWoont-Acceptatiegids-Juni-2026.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Merius Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://meriushypotheken.nl/adviseur/samenwerken/',
  producten:['hypotheek','55-plus'],
  kenmerken:[
   {tekst:'Alleen via onafhankelijk adviseurs; ruim 3500 kantoren aangesloten via een adviesorganisatie of serviceprovider',bron:'https://meriushypotheken.nl/adviseur/over-ons-adviseur/'},
   {tekst:'Voor 55-plussers telt inkomen uit AOW, pensioen of lijfrente mee voor de leenruimte',bron:'https://meriushypotheken.nl/hypotheek-voor-55plussers/'},
   {tekst:'Hypotheekgids met acceptatiebeleid',bron:'https://meriushypotheken.nl/app/uploads/2024/07/Merius-Hypotheekgids-2024-01.pdf'},
   {thema:'Verhuisregeling',tekst:'Maximaal 6 maanden tussen oude en nieuwe lening; aanvraag uiterlijk 1 maand vóór levering van de oude woning, met koopovereenkomst als bewijs',bron:'https://meriushypotheken.nl/app/uploads/2024/07/Merius-Hypotheekgids-2024-01.pdf'},
   {thema:'Boetevrij aflossen',tekst:'Uit eigen middelen 25% per leningdeel per jaar, bij herfinanciering 15%; volledig vrij bij verkoop en verhuizing van alle aanvragers',bron:'https://meriushypotheken.nl/app/uploads/2024/07/Merius-Hypotheekgids-2024-01.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Attens Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.attens.nl/voor-adviseurs/nieuwsoverzicht',
  producten:['hypotheek'],
  kenmerken:[
   {tekst:'Ontwikkeld voor mensen die werken in zorg en welzijn',bron:'https://www.hypotheekberekenen.nl/en/mortgage-providers/attens'},
   {tekst:'Gefinancierd met geld van PFZW, beheerd door Syntrus Achmea',bron:'https://www.hypotheekberekenen.nl/en/mortgage-providers/attens'},
   {tekst:'Acceptatiegids voor adviseurs',bron:'https://www.attens.nl/-/media/attens/documenten/documenten-en-formulieren/2026/acceptatiegids-attens-1-januari-2026.pdf'},
   {thema:'Verhuisregeling',tekst:'Nieuwe hypotheek binnen 6 maanden na aflossing; de meegenomen rentevaste periode moet nog minimaal 1 jaar lopen; ook bruikbaar als de klant niet meer bij PFZW deelneemt',bron:'https://www.attens.nl/voor-klanten/verhuisregeling'},
   {thema:'Boetevrij aflossen',tekst:'Aflossen uit eigen middelen (geen geleend geld) kan altijd zonder vergoeding',bron:'https://www.attens.nl/vergoedingsvrij-aflossen-uit-eigen-middelen'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Tellius Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.tellius.nl/advies-op-maat',
  producten:['hypotheek','Toekomstvast hypotheek'],
  kenmerken:[
   {tekst:'Alleen via hypotheekadviseurs; Tellius geeft zelf geen advies',bron:'https://www.tellius.nl/advies-op-maat'},
   {tekst:'Richt zich op rentevaste perioden van 15 jaar of langer',bron:'https://www.tellius.nl/-/media/tellius/documenten/voor-adviseurs/2025/acceptatiegids-tellius-juli-2025.pdf'},
   {tekst:'Doelgroepbeschrijving (Bgfo) voor adviseurs',bron:'https://www.tellius.nl/-/media/tellius/documenten/voor-adviseurs/bgfo-doelgroepbeschrijving-tellius-hypotheken-30.pdf'},
   {tekst:'Gefinancierd met pensioengeld, beheerd door Syntrus Achmea',bron:'https://hypotheekberekenen.nl/en/mortgage-providers/tellius'},
   {thema:'Verhuisregeling',tekst:'Meegenomen rentevaste periode moet nog minimaal 1 jaar lopen; nieuwe hypotheek binnen 6 maanden na aflossing; voor een hoger bedrag geldt de actuele rente',bron:'https://www.tellius.nl/voor-klanten/verhuisregeling'},
   {thema:'Boetevrij aflossen',tekst:'Jaarlijks 10% van het oorspronkelijke bedrag vergoedingsvrij',bron:'https://www.tellius.nl/voor-klanten/extra-aflossen'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Syntrus Achmea / Achmea Mortgage Funds',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://achmeabank.nl/en/news/achmea-splits-mortgage-and-real-estate-activities-of-syntrus-achmea-real-estate-and-finance',
  producten:['hypotheekfondsen','labels Attens en Tellius'],
  kenmerken:[
   {tekst:'Hypotheek- en vastgoedactiviteiten zijn per 1 oktober 2024 gesplitst',bron:'https://achmeabank.nl/en/news/achmea-splits-mortgage-and-real-estate-activities-of-syntrus-achmea-real-estate-and-finance'},
   {tekst:'Syntrus Achmea Hypotheekdiensten is dochter van Achmea Bank, samen met Achmea Hypotheken en Attens Hypotheken',bron:'https://achmeabank.nl/en/news/achmea-splits-mortgage-and-real-estate-activities-of-syntrus-achmea-real-estate-and-finance'},
   {tekst:'Achmea Mortgages (Achmea Mortgage Funds) beheert hypotheekfondsen en beleggingsportefeuilles',bron:'https://www.banken.nl/nieuws/25486/achmea-splitst-hypotheek-en-vastgoedactiviteiten-op'}
  ],bijgewerkt:'2026-10-03'},
 {naam:'Lot Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.lothypotheken.nl/adviseur',
  producten:['hypotheek','duurzaamheidshypotheek'],
  kenmerken:[
   {tekst:'Uitsluitend via onafhankelijke adviseurs; geen directe aanvraag door consumenten',bron:'https://www.hypotheekberekenen.nl/en/mortgage-providers/lot'},
   {tekst:'Duurzaamheidshypotheek om extra te lenen voor energiebesparende maatregelen, met energiebesparingsrapport',bron:'https://www.lothypotheken.nl/consument/verduurzamen'},
   {tekst:'Voorwaarden duurzaamheidskorting op de adviseurspagina',bron:'https://www.lothypotheken.nl/adviseur/verduurzamen/duurzaamheidskorting/voorwaarden'},
   {tekst:'Huisscan via homeQgo',bron:'https://adviseur.lothypotheken.nl/consument/verduurzamen/homeqgo'},
   {thema:'Verhuisregeling',tekst:'Meenemen tot 6 maanden na aflossing; vorm, restant hoofdsom en basisrente voor de resterende rentevaste periode blijven gelijk',bron:'https://adviseur.lothypotheken.nl/media/koxceg2q/hypotheekgids-lot-hypotheken-versie-januari-2026.pdf'},
   {thema:'Boetevrij aflossen',tekst:'15% per leningdeel per jaar, plus vergoedingsvrij uit eigen middelen en bij verkoop wegens verhuizing',bron:'https://adviseur.lothypotheken.nl/media/koxceg2q/hypotheekgids-lot-hypotheken-versie-januari-2026.pdf'},
   {thema:'Senioren',tekst:'Voor 57-plussers: tot de pensioenleeftijd gewone toetsnormen, daarna toetsing op werkelijke lasten',bron:'https://adviseur.lothypotheken.nl/media/koxceg2q/hypotheekgids-lot-hypotheken-versie-januari-2026.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Vista Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.vistahypotheken.nl/ik-wil-klant-worden',
  producten:['hypotheek','overbrugging'],
  kenmerken:[
   {tekst:'Alleen in combinatie met hypotheekadvies, niet online af te sluiten',bron:'https://www.actuelerentestanden.nl/hypotheek/aanbieders/vista-hypotheken'},
   {tekst:'Korting voor woningen met energielabel A',bron:'https://www.actuelerentestanden.nl/hypotheek/aanbieders/vista-hypotheken'},
   {tekst:'Hypothekengids voor adviseurs',bron:'https://content.mailplus.nl/m5/docs/user80832/4175/Hypothekengids_Vista_Hypotheken_versie_april_2023.pdf'},
   {thema:'Verhuisregeling',tekst:'Rentecontract meenemen tot 6 maanden na verkoop van de oude woning',bron:'https://www.vistahypotheken.nl/kennisbank/je-rentecontract-meenemen'},
   {thema:'Boetevrij aflossen',tekst:'Uit eigen middelen onbeperkt; anders maximaal 10% per jaar vergoedingsvrij',bron:'https://www.vistahypotheken.nl/kennisbank/extra-aflossen-op-je-hypotheek'},
   {thema:'Offerte',tekst:'Renteaanbod moet binnen 3 weken getekend terug zijn',bron:'https://www.vistahypotheken.nl/veelgestelde-vragen'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Woonnu',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://adviseurs.woonnu.nl/positief-wonen/',
  producten:['hypotheek','verduurzamen'],
  kenmerken:[
   {tekst:'Rente per energielabel met label C als basis; na verbetering van het label tijdens de looptijd geldt de rente van het nieuwe label',bron:'https://woonnu.nl/media/qlmjci23/20261703-woonnu-productkaart-05.pdf'},
   {tekst:'Verduurzamingsadvies aan huis',bron:'https://adviseurs.woonnu.nl/positief-wonen/'},
   {tekst:'Acceptatiegids op de adviseurssite',bron:'https://adviseurs.woonnu.nl/media/o3fb2scu/202501-woonnu-acceptatiegids.pdf'},
   {tekst:'Dochter van Nationale-Nederlanden; aangesloten bij EEMI en EEML',bron:'https://www.banken.nl/nieuws/23084/nn-bank-en-woonnu-sluiten-zich-aan-bij-europese-duurzaamheidsinitiatieven'},
   {thema:'Verhuisregeling',tekst:'Groene meeneemregeling: vorm, (basis)rente en rentevaste periode gaan mee tot 6 maanden na aflossing; de labelkorting of -opslag volgt het label van de nieuwe woning',bron:'https://woonnu.nl/groene-meeneemregeling/'},
   {thema:'Boetevrij aflossen',tekst:'10% van de oorspronkelijke hoofdsom per kalenderjaar; daarnaast vrij op de renteaanpassingsdatum, na overlijden en na een uitkering van de opstalverzekering',bron:'https://woonnu.nl/over-woonnu/veelgestelde-vragen/'},
   {thema:'Duurzaamheid',tekst:'Nieuw energielabel dat vóór de 15e is verwerkt, geldt voor de rente vanaf de volgende maand',bron:'https://woonnu.nl/over-woonnu/veelgestelde-vragen/'},
   {thema:'Zzp en flexibel inkomen',tekst:'Ondernemer minimaal een jaar zelfstandig; inkomen op basis van het gemiddelde over de laatste drie kalenderjaren',bron:'https://woonnu.nl/media/rvqnigvm/202601-woonnu-acceptatiegids_final.pdf'},
   {thema:'Senioren',tekst:'Onder voorwaarden toetsing op werkelijke lasten voor senioren',bron:'https://woonnu.nl/media/rvqnigvm/202601-woonnu-acceptatiegids_final.pdf'},
   {thema:'Bouwdepot',tekst:'Bouwdepot verbouw 12 maanden (was 6), nieuwbouw 24 maanden; onder voorwaarden verlenging',bron:'https://adviseurs.woonnu.nl/nieuwsoverzicht/verlenging-looptijd-bouwdepot-verbouw-van-6-naar-12-maanden/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Dynamic Credit (bijBouwe)',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.bijbouwe.nl/over-bijbouwe/bijbouwe-hypotheek-nu-ook-via-onafhankelijke-adviseurs.aspx',
  producten:['hypotheek'],
  kenmerken:[
   {tekst:'bijBouwe is het digitale hypotheeklabel van Dynamic Credit',bron:'https://www.hypotheekrente.nl/maatschappijen/bijbouwe/'},
   {tekst:'Adviseurs kunnen aanvragen via HDN indienen of de klant na advies zelf laten afronden',bron:'https://www.banken.nl/nieuws/7688/nieuwe-speler-op-nl-hypotheekmarkt-bijbouwe'},
   {tekst:'Heeft daarnaast eigen hypotheekadviseurs',bron:'https://bijbouwe.nl/hypotheekadvies'}
  ],bijgewerkt:'2026-10-03'},
 {naam:'Neo Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.neohypotheken.nl/adviseur-zoeken',
  producten:['hypotheek','zelfbouw'],
  kenmerken:[
   {tekst:'Digitaal aanvraagproces op basis van brondata; klant vraagt zelf aan of via een onafhankelijk adviseur',bron:'https://www.banken.nl/nieuws/24683/hypotheekmarkt-heeft-er-een-nieuwe-speler-bij-neo-hypotheken'},
   {tekst:'Financiering van zelfbouw en aanvragen samen met familieleden',bron:'https://www.banken.nl/nieuws/24683/hypotheekmarkt-heeft-er-een-nieuwe-speler-bij-neo-hypotheken'},
   {tekst:'Gepubliceerd distributiebeleid',bron:'https://www.neohypotheken.nl/storage/uploads/0527d3c4-a837-4270-9bf8-05aa33f1e23b/Distributiebeleid-N26-Hypotheken-B.V.---v1.3-2023.pdf'},
   {thema:'Verhuisregeling',tekst:'Meenemen bij eerst kopen of eerst verkopen, uit te voeren binnen 6 maanden',bron:'https://www.neohypotheken.nl/woonsituaties/ander-huis-kopen'},
   {thema:'Boetevrij aflossen',tekst:'Onbeperkt uit eigen middelen (aan te tonen via iDEAL in het klantportaal); bij aflossen met andere financiering 25% per kalenderjaar',bron:'https://www.neohypotheken.nl/storage/uploads/3ff723f1-3627-4cb3-8880-cd7005e22de5/Acceptatiegids-Neo-Hypotheken-V.1.6.6.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'CMIS',type:'geldverstrekker',categorieen:['hypotheek'],url:'',
  producten:['servicing','beleggen in hypotheken'],
  kenmerken:[
   {tekst:'Verbindt consumenten, geldverstrekkers en beleggers in de hypotheekmarkt (servicing), actief in Nederland en Duitsland',bron:'https://www.cbinsights.com/company/cmis-group/'},
   {tekst:'Via CMIS Franchise mede-initiatiefnemer van de opleiding Adviseur Duurzaam Wonen',bron:'https://www.banken.nl/nieuws/22745/inmiddels-meer-dan-6000-adviseurs-duurzaam-wonen'}
  ],bijgewerkt:'2026-10-03'},
 {naam:'Woonfonds (nu Centraal Beheer)',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://centraalbeheer.nl/voor-adviseurs',
  status:'Label beëindigd: Woonfonds-hypotheken zijn per 24 maart 2025 overgegaan naar Centraal Beheer',statusBron:'https://centraalbeheer.nl/voor-adviseurs',
  producten:['bestaande hypotheken'],
  kenmerken:[
   {tekst:'Woonfonds-hypotheken zijn per 24 maart 2025 overgegaan naar Centraal Beheer',bron:'https://woneninbeaufort.nl/blog/post/23882/de-overgang-van-woonfonds-naar-centraal-beheer-juridische-en-technische-implicaties-voor-hypotheken-en-bouwdepots/'},
   {tekst:'Was het intermediairlabel van Achmea Bank',bron:'https://www.achmeabank.nl/-/media/achmeabank/documenten/nieuws/nl/persbericht_achmea_bundelt_krachten_van_haar_hypotheekactiviteiten_defnitief.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Centraal Beheer (Achmea)',type:'verzekeraar',categorieen:['hypotheek','lijfrente','schade'],url:'https://www.centraalbeheer.nl/voor-adviseurs/hypotheek',
  producten:['hypotheek','De Leef Hypotheek','zelfstandigen'],
  kenmerken:[
   {tekst:'Acceptatiegids voor De Leef Hypotheek',bron:'https://www.centraalbeheer.nl/-/media/files/voor-adviseurs/acceptatiegids-leef-hypotheek.pdf'},
   {tekst:'Thuis Hypotheek voor zelfstandigen (zzp)',bron:'https://www.centraalbeheer.nl/voor-adviseurs/hypotheek/Paginas/thuis-hypotheek-voor-zelfstandigen.aspx'},
   {tekst:'Hypotheekdesk en vaste accountmanagers voor adviseurs',bron:'https://www.centraalbeheer.nl/voor-adviseurs/hypotheek/hypotheekdesk'},
   {tekst:'Adviseursportaal toont de hypotheekstatus per klant, ook van voormalige Woonfonds-klanten',bron:'https://centraalbeheer.nl/voor-adviseurs'},
   {thema:'Boetevrij aflossen',tekst:'Onbeperkt uit eigen middelen en daarnaast 10% van de oorspronkelijke lening per kalenderjaar',bron:'https://www.centraalbeheer.nl/-/media/files/voor-adviseurs/acceptatiegids-leef-hypotheek.pdf'},
   {thema:'Renteafspraken',tekst:'Rentemiddeling eenmaal per rentevaste periode; rente daalt automatisch bij voldoende aflossing',bron:'https://www.centraalbeheer.nl/hypotheek/klant/rente-wijzigen'},
   {thema:'Verhuisregeling',tekst:'Verhuisregeling: onder voorwaarden de oude rente meenemen naar een nieuwe Centraal Beheer-hypotheek',bron:'https://www.centraalbeheer.nl/hypotheek/uw-situatie/maandlasten-verlagen'},
   {thema:'Medische acceptatie',tekst:'ORV aanvragen via het adviseursportaal met een ORV-desk; de verzekerde ziet na de gezondheidsverklaring vaak direct of acceptatie mogelijk is, boven een bepaald bedrag volgt een keuring',bron:'https://www.centraalbeheer.nl/voor-adviseurs/overlijdensrisicoverzekering'},
   {thema:'Lijfrente',tekst:'Extra Pensioen Opbouw: lijfrente sparen, beleggen of een combinatie; aparte adviseurspagina om te berekenen en af te sluiten',bron:'https://www.centraalbeheer.nl/voor-adviseurs/extra-pensioen-opbouw/berekenen-en-afsluiten'},
   {thema:'Lijfrente-uitkering',tekst:'Extra Pensioen Inkomen en Garantie Inkomen Lijfrente voor het uitkeren van lijfrentekapitaal, met adviseursinformatie',bron:'https://www.centraalbeheer.nl/voor-adviseurs/garantie-inkomen-lijfrente'},
   {thema:'Kosten',tekst:'Extra Pensioen Inkomen kan ook online zonder advies worden afgesloten, tegen vaste afsluitkosten',bron:'https://www.centraalbeheer.nl/lijfrente/extra-pensioen-inkomen'},
   {thema:'Status',tekst:'Polissen van Lifetri gaan in 2027 verder onder het merk Centraal Beheer (joint venture Achmea Pension & Life)',bron:'https://news.achmea.nl/achmea-lifetri-and-sixth-street-join-forces-in-the-dutch-pension-and-life-market/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Avero Achmea',type:'verzekeraar',categorieen:['inkomen','schade'],url:'https://www.averoachmea.nl/arbeidsongeschiktheidsverzekering',
  producten:['AOV','verzuim','WIA','bedrijfsverzekeringen'],
  kenmerken:[
   {tekst:'Werkt uitsluitend via onafhankelijke adviseurs en gevolmachtigden',bron:'https://hr-kiosk.nl/nieuws/avero-achmea-sluit-overeenkomst-met-zzp-nederland'},
   {tekst:'Inkomensverzekeringen voor ondernemers en werkgevers (AOV, verzuim, WIA)',bron:'https://hr-kiosk.nl/nieuws/avero-achmea-sluit-overeenkomst-met-zzp-nederland'},
   {tekst:'Bedrijfspakket ook via volmacht',bron:'https://www.averoachmea.nl/-/media/files/zakelijk/bap-bedrijfs-actief-polis/brochure-bedrijfactiefpolis-volmacht.pdf'},
   {thema:'Medische acceptatie',tekst:'De medische dienst beoordeelt de gezondheidsgegevens en adviseert de acceptatieadviseur, die de voorwaarden vaststelt',bron:'https://www.averoachmea.nl/-/media/files/zakelijk/aov/brochures/medische-acceptatie.pdf'},
   {thema:'AOV-acceptatie',tekst:'Procesinformatie over AOV-dienstverlening voor adviseurs',bron:'https://www.averoachmea.nl/adviseur/arbeidsongeschiktheidsverzekeringen/proces'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Allianz',type:'verzekeraar',categorieen:['hypotheek','lijfrente','schade'],url:'https://www.allianz.nl/particulier/hypotheken.html',
  producten:['hypotheek','overbruggingskrediet','rentemiddeling'],
  kenmerken:[
   {tekst:'Werkt samen met onafhankelijke financieel adviseurs; klant kan een adviseur zoeken via de site',bron:'https://www.allianz.nl/content/dam/onemarketing/benelu/allianz-nl/local/5/500083-46.pdf'},
   {tekst:'Informatie over rentemiddeling',bron:'https://www.allianz.nl/particulier/hypotheken/beheren/rentemiddeling.html'},
   {tekst:'Overbruggingskrediet tussen twee woningen',bron:'https://origin-www.allianz.nl/particulier/hypotheken/hypotheekvormen/overbrugging.html'},
   {thema:'Verhuisregeling',tekst:'Meeneemregeling voor bestaande klanten; regelen binnen 6 maanden na verkoop van de oude woning',bron:'https://www.allianz.nl/particulier/hypotheken/beheren/verhuisregeling.html'},
   {thema:'Boetevrij aflossen',tekst:'Onbeperkt extra aflossen met eigen spaargeld zonder kosten',bron:'https://www.allianz.nl/particulier/hypotheken/beheren/extra-aflossen.html'},
   {thema:'Lijfrente-uitkering',tekst:'Direct Ingaande Lijfrente: tijdelijk of levenslang, met een vaste rente zodat de bruto-uitkering gelijk blijft; uitkering per maand, kwartaal, halfjaar of jaar',bron:'https://www.allianz.nl/particulier/pensioen/bijna-met-pensioen/dil.html'},
   {thema:'Lijfrente-uitkering',tekst:'Allianz adviseert zelf niet; zonder adviseur afsluiten kan tegen distributiekosten. Allianz raadt advies aan bij een contraverzekering of bij kapitaal uit verschillende fiscale regimes',bron:'https://www.allianz.nl/particulier/pensioen/bijna-met-pensioen/dil.html'},
   {thema:'Status',tekst:'Neemt de collectieve pensioenportefeuille van Scildon over',bron:'https://www.scildon.nl/artikelen/artikel-persbericht-allianz-neemt-collectieve-pensioen-portefeuille-over-van-scildon'},
   {tekst:'Zakelijke pakketten per sector, zoals de zakelijke dienstverlening',bron:'https://www.allianz.nl/zakelijk/verzekeringen/per-sector/zakelijke-dienstverlening.html'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Aegon (nu a.s.r.)',type:'verzekeraar',categorieen:['hypotheek'],url:'https://www.aegon.nl/voor-adviseurs/team-aegon-stater',
  status:'Merk Aegon verdwijnt: volgens berichtgeving uiterlijk juli 2026, daarna vallen hypotheek- en pensioenklanten onder het a.s.r.-label',statusBron:'https://www.welingelichtekringen.nl/economie/verzekeringsmerk-aegon-verdwijnt-komende-maanden-uit-nederland',
  producten:['hypotheek (bestaand)','hypotheek verhogen'],
  kenmerken:[
   {tekst:'Aegon-hypotheken zijn naar Stater gemigreerd; het label blijft tot medio 2026, daarna volgt integratie in a.s.r.',bron:'https://www.banken.nl/nieuws/26235/stater-begonnen-met-verhuizing-aegon-hypotheken'},
   {tekst:'Wijzigingen via E-adviseur van Stater; verhogingen via het adviespakket en HDN',bron:'https://www.banken.nl/nieuws/26235/stater-begonnen-met-verhuizing-aegon-hypotheken'},
   {tekst:'Hypotheekgids vervangt de acceptatiehandleiding',bron:'https://www.aegon.nl/voor-adviseurs/nieuws/hypotheek/hypotheekgids-vervangt-acceptatiehandleiding'},
   {tekst:'Huisscan van homeQgo beschikbaar voor adviseurs',bron:'https://www.aegon.nl/voor-adviseurs/nieuws/hypotheek/homeqgo-is-er-nu-ook-voor-adviseurs%C2%A0'},
   {thema:'Verhuisregeling',tekst:'Verhuisroute voor bestaande Aegon-hypotheekklanten',bron:'https://www.aegon.nl/system/files/2025-09/Verhuisroute_Aegon_Hypotheken.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'a.s.r.',type:'verzekeraar',categorieen:['hypotheek','leven','inkomen','lijfrente','pensioen'],url:'https://www.asr.nl/adviseurs',
  producten:['hypotheek','levensrente','ORV','AOV','pensioen'],
  kenmerken:[
   {tekst:'WelThuis Levensrente Hypotheek voor senioren met overwaarde',bron:'https://www.homefinance.nl/hypotheek/aanbieders/asr/levensrente/'},
   {tekst:'Digitaal aanvraagproces met Digithuis Hypotheek',bron:'https://www.asrnederland.nl/-/media/files/asrnederland-nl/nieuws-en-pers/2020/20200929-persbericht-asr-versnelt-en-digitaliseert-aanvraagproces-met-digithuis-hypotheek.pdf'},
   {tekst:'Neemt de Aegon-hypotheken op in het eigen hypotheekbedrijf',bron:'https://www.banken.nl/nieuws/26235/stater-begonnen-met-verhuizing-aegon-hypotheken'},
   {tekst:'Uitleg over het provisieverbod bij de AOV',bron:'https://www.asr.nl/zakelijk/alles-over-de-aov/wat-is-provisie'},
   {thema:'Verhuisregeling',tekst:'Rente meenemen voor de resterende duur van de rentevaste periode als de klant opnieuw voor a.s.r. kiest',bron:'https://www.asr.nl/hypotheek/volgend-huis-kopen'},
   {thema:'Boetevrij aflossen',tekst:'Jaarlijks 15% van het oorspronkelijke bedrag vergoedingsvrij en onbeperkt op de renteherzieningsdatum',bron:'https://www.asr.nl/hypotheek/asr-hypotheek'},
   {thema:'Renteafspraken',tekst:'Tussentijds rente aanpassen kan tegen administratiekosten en meestal een vergoeding; rente daalt automatisch bij een lagere risicoklasse',bron:'https://www.asr.nl/hypotheek/aflossingsblij'},
   {thema:'Duurzaamheid',tekst:'Verduurzamingshypotheek om extra te lenen voor energiebesparende maatregelen',bron:'https://www.asr.nl/hypotheek/verduurzamingshypotheek'},
   {thema:'Senioren',tekst:'Levensrente hypotheek voor AOW\'ers met een levenslang vaste rente en alleen rentebetaling',bron:'https://www.asr.nl/hypotheek/levensrente-hypotheek'},
   {thema:'Zzp en flexibel inkomen',tekst:'Inkomensverklaring voor ondernemers op basis van het gemiddelde over drie jaar; arbeidsmarktscan voor wie geen vast contract heeft',bron:'https://www.asr.nl/blog/geen-vast-contract-en-toch-een-hypotheek'},
   {thema:'AOV-acceptatie',tekst:'AOV-aanvraag loopt via twee gescheiden afdelingen: Acceptatie beoordeelt het beroepsrisico (werkzaamheden, bedrijf), de Medische Dienst de gezondheidsverklaring',bron:'https://www.asr.nl/zakelijk/verzekeringen/arbeidsongeschiktheidsverzekeringen/medische-acceptatie'},
   {thema:'Lijfrente-uitkering',tekst:'Direct ingaande lijfrente (tijdelijk of levenslang) is niet meer beschikbaar voor nieuwe klanten',bron:'https://www.asr.nl/verzekeringen/levensverzekeringen/direct-ingaande-lijfrente'},
   {thema:'Lijfrente',tekst:'Lijfrente beleggen met Persoonlijk pensioen, ook gericht op zzp\'ers',bron:'https://www.asr.nl/beleggen/persoonlijk-pensioen'},
   {thema:'Status',tekst:'Is sinds 4 juli 2023 moedermaatschappij van Aegon Nederland en daarmee van PPI Aegon Cappital',bron:'https://aegon.nl/sites/default/files/2024-09/24040524_Aegon_Cappital_JV_2023.pdf'},
   {thema:'Status',tekst:'Rondde in 2021 de overname van Brand New Day PPI af',bron:'https://asrnederland.nl/-/media/files/asrnederland-nl/nieuws-en-pers/2021/20210330persbericht--asr-rondt-overname-brand-new-day-ppi-afnl.pdf'},
   {thema:'Marktpositie',tekst:'Volgens het ACM-besluit over de Aegon-overname de grootste partij in inkomensverzekeringen; NN, Achmea en De Goudse noemt de ACM als concurrenten',bron:'https://acm.nl/system/files/documents/openbare-versie-besluit-asr-aegon.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Nationale-Nederlanden',type:'verzekeraar',categorieen:['hypotheek','leven','inkomen','lijfrente','schade','pensioen'],url:'https://www.nn.nl/Particulier/Hypotheken.htm',
  producten:['hypotheek','ondernemershypotheek','AOV','pensioen'],
  kenmerken:[
   {tekst:'Ondernemershypotheek',bron:'https://nn.nl/Particulier/Hypotheken/Een-hypotheek-voor-ondernemers.htm'},
   {tekst:'Geeft sinds 1 mei 2021 geen algemeen financieel advies meer, wel hypotheekadvies aan bestaande hypotheekklanten',bron:'https://www.nn.nl/Particulier/Hypotheken/Hypotheekadvies/Maak-een-afspraak/De-hypotheekadviseurs-van-Nationale-Nederlanden.htm'},
   {tekst:'Pleit voor een breder adviesmodel waarin duurzaamheid een plek krijgt',bron:'https://www.nn.nl/nieuws/nationale-nederlanden-hypotheken-duurzaamheid-vraagt-om-een-breder-adviesmodel-van-hypotheekadviseurs/'},
   {tekst:'Klant volgt de hypotheekaanvraag in mijn.nn en de NN App',bron:'https://nn.nl/Particulier/Hypotheken/Een-nieuwe-hypotheek/Mijn-Hypotheekaanvraag.htm'},
   {thema:'Verhuisregeling',tekst:'Meeneemregeling alleen met advies van een hypotheekadviseur; nieuwe hypotheek binnen 6 maanden na aflossing van de oude passeren, en de klant gaat er zelf wonen',bron:'https://www.nn.nl/Particulier/Hypotheken/Ander-huis-kopen/Hypotheek-meenemen.htm'},
   {thema:'Renteafspraken',tekst:'Rentemiddeling als alternatief voor oversluiten, zonder het renteverlies in één keer te betalen',bron:'https://www.nn.nl/Particulier/Hypotheken/Hypotheek-oversluiten.htm'},
   {thema:'Zzp en flexibel inkomen',tekst:'Accepteert inkomensverklaringen van Zakelijk Inkomen, Overviewz, Pentrax en Raadhuys; perspectiefverklaring voor flexibel werk',bron:'https://www.nn.nl/Inspiratie/Zzp-hypotheek-berekenen.htm'},
   {thema:'Duurzaamheid',tekst:'Extra hypotheek voor verduurzamen; de extra leenruimte hangt af van het energielabel en de verbouwing en verduurzaming kunnen in één aanvraag',bron:'https://www.nn.nl/Particulier/Hypotheken/Verbouwen/Extra-hypotheek-voor-verduurzamen.htm'},
   {thema:'Medische acceptatie',tekst:'ORV: medische gegevens alleen bij de medische acceptatiedienst; de grens voor een online gezondheidsverklaring of keuring hangt af van leeftijd en verzekerd bedrag',bron:'https://adviseur.nn.nl/va/Particulier/Levensverzekeringen/Overlijdensrisicoverzekering-ORV.htm'},
   {thema:'Lijfrente-uitkering',tekst:'Aanvullende PensioenUitkering (NN Bank): vaste uitkering, zelf gekozen startdatum; aanvragen online zonder advies, telefonisch zonder advies of via een onafhankelijk adviseur',bron:'https://www.nn.nl/Particulier/Pensioen/Bijna-met-pensioen/Aanvullende-PensioenUitkering.htm'},
   {thema:'Lijfrente-uitkering',tekst:'Uitkering uitstellen kan tot 5 jaar na de AOW-leeftijd',bron:'https://www.nn.nl/Particulier/Pensioen/Extra-pensioen-opbouwen/Lijfrente-uitstellen.htm'},
   {thema:'Schadeafhandeling',tekst:'Neemt de intermediaire particuliere schadeverzekeringen per 1 juli 2026 in eigen beheer; die liepen sinds 2018 via NN Verzekeren Services en Voogd & Voogd',bron:'https://www.nn.nl/nieuws/eigen-beheer-nationale-nederlanden-intermediaire-particuliere-schadeverzekeringen/'},
   {tekst:'Premiepensioeninstelling BeFrank hoort bij NN',bron:'https://www.ipe.com/comment/a-60s-revival-in-the-dutch-pension-market/40170.article'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Movir',type:'verzekeraar',categorieen:['inkomen'],url:'https://www.movir.nl/arbeidsongeschiktheidsverzekering/advies-bij-je-aov',
  producten:['AOV'],
  kenmerken:[
   {tekst:'AOV-specialist; de Movir Momentum AOV staat ook op de site van NN',bron:'https://www.nn.nl/Zakelijk/Inkomensverzekeringen/Individuele-arbeidsongeschiktheidsverzekering/Zelf-de-Movir-Momentum-AOV-afsluiten.htm'},
   {tekst:'AOV via adviseur of zelf aan te vragen',bron:'https://www.movir.nl/arbeidsongeschiktheidsverzekering/aov-zelf-aanvragen'},
   {thema:'Medische acceptatie',tekst:'Gezondheidsverklaring wordt beoordeeld door Team Medisch Advies, dat kan bellen of met toestemming informatie opvragen; Movir streeft naar uitsluitsel binnen 8 weken na een complete aanvraag',bron:'https://www.movir.nl/arbeidsongeschiktheidsverzekering/aanvragen/medische-beoordeling'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'De Goudse',type:'verzekeraar',categorieen:['inkomen','schade','leven'],url:'https://www.goudse.nl/adviseur',
  producten:['AOV','schadeverzekeringen','levensverzekeringen'],
  kenmerken:[
   {tekst:'Adviseursportaal met offerte- en beheersystemen; inloggen kan ook met het Digitaal Paspoort',bron:'https://www.adfiz.nl/media/3207/voorwaarden-adviseursportaal-2019.pdf'},
   {tekst:'Rekening-courant en documenten in het adviseursportaal',bron:'https://www.goudse.nl/adviseur/nieuws/rekening-courant-vanaf-nu-in-het-adviseursportaal'},
   {tekst:'Ondernemers-AOV met dienstverlening gericht op preventie',bron:'https://www.goudse.nl/-/media/files/goudse/veelgestelde-vragen-ondernemers-aov-992100.pdf'},
   {tekst:'Goudse Academy voor adviseurs',bron:'https://www.goudse.nl/adviseur/ga-ikt-kennismakingsdag'},
   {thema:'Medische acceptatie',tekst:'Medische acceptatie voor de AOV verloopt telefonisch; de medisch adviseur adviseert over normale acceptatie, beperkende voorwaarden, opslag of afwijzing',bron:'https://www.goudse.nl/ondernemer/gezond-bedrijf/medische-acceptatie-aov'},
   {thema:'Beroepsklassen',tekst:'Beroepenlijst voor de startersvariant van de Ondernemers-AOV',bron:'https://www.goudse.nl/adviseur/nieuws/beroepenlijst-startersvariant-ondernemers-aov-nu-beschikbaar'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'NH1816',type:'verzekeraar',categorieen:['schade'],url:'https://www.nh1816.nl/assurantieadviseur',
  producten:['particuliere schadeverzekeringen'],
  kenmerken:[
   {tekst:'Particuliere verzekeringen uitsluitend via lokale onafhankelijke adviseurs',bron:'https://www.NH1816.nl/Files/Files.new/Brochures/Nh1816-corporate-brochure-2021.pdf'},
   {tekst:'Adviseur heeft een centrale rol bij acceptatie en schadebehandeling',bron:'https://www.NH1816.nl/Files/Files.new/Brochures/Nh1816-corporate-brochure-2021.pdf'},
   {tekst:'Cooperatieve verzekeraar',bron:'https://www.nh1816.nl/Files/Files.new/Jaarverslagen/Nh1816-Jaarverslag_2023.pdf'},
   {thema:'Acceptatiecontact',tekst:'Lukt directe acceptatie in het portaal niet, dan kan de afdeling acceptatie na overleg een bypass geven',bron:'https://portal.nh1816.nl/support/faq'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'DEFAM',type:'kredietverstrekker',categorieen:['krediet'],url:'https://www.defam.nl/',
  producten:['persoonlijke lening','GreenLoans','Persoonlijke Lening Wonen'],
  kenmerken:[
   {tekst:'Uitsluitend via intermediairs, assurantieadviseurs en dealers; onderdeel van Alfam (ABN AMRO)',bron:'https://financer.nl/bedrijf/defam'},
   {tekst:'Werkt met adviseurs die een AFM-vergunning hebben',bron:'https://defam.nl/vragen-contact/veelgestelde-vragen'},
   {tekst:'GreenLoans voor verduurzaming',bron:'https://www.defam.nl/leningen/greenloans/'},
   {tekst:'Persoonlijke Lening Wonen',bron:'https://www.defam.nl/leningen/woonlening/'},
   {thema:'Acceptatie',tekst:'Toetst bij BKR; of een lening met een bestaande BKR-registratie kan, hangt af van de situatie en loopt via de intermediair',bron:'https://www.defam.nl/veelgestelde-vragen/'},
   {thema:'Duurzaamheid',tekst:'Persoonlijke Lening Wonen heeft een langere looptijd, bedoeld voor verbouwen door huiseigenaren',bron:'https://www.defam.nl/leningen/woonlening/'},
   {thema:'Status',tekst:'Zustermerk Alphacredit stopte per 1 april 2021 met persoonlijke leningen (die lopen nu via DEFAM) en biedt alleen nog financial lease',bron:'https://www.alphacredit.nl/leningen/persoonlijke-lening/'},
   {thema:'Intermediairportal',tekst:'Alphacredit noemt dat de vergoeding voor de intermediair meeweegt in de rente en per intermediair kan verschillen',bron:'https://www.alphacredit.nl/veelgestelde-vragen/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Zwitserleven',type:'pensioenverzekeraar',categorieen:['pensioen','lijfrente'],url:'https://www.zwitserleven.nl/en/adviseur/',
  producten:['werkgeverspensioen','netto pensioen','lijfrente'],
  kenmerken:[
   {tekst:'Adviseursinformatie over de Wet toekomst pensioenen',bron:'https://www.zwitserleven.nl/en/adviseur/pensioenakkoord/'},
   {tekst:'Doelgroepomschrijvingen per werkgeversproduct, zoals Nu Pensioen',bron:'https://www.zwitserleven.nl/4af8d0/siteassets/documenten/doelgroepomschrijving/nu-pensioen-doelgroepomschrijving.pdf'},
   {tekst:'Netto Pensioen voor werknemers boven de aftoppingsgrens',bron:'https://www.zwitserleven.nl/48e851/siteassets/documenten/doelgroepomschrijving/doelgroepomschrijving-zwitserleven-netto-pensioen.pdf'},
   {tekst:'Merk van Athora Netherlands',bron:'https://www.athora.nl/en/about-us/about-athora-netherlands/'},
   {thema:'Waardeoverdracht',tekst:'Geen kosten voor individuele waardeoverdracht en voor inkomende collectieve waardeoverdracht (Netto Pensioen)',bron:'https://zwitserleven.nl/4a5dc3/siteassets/documenten/adviseur/netto-pensioen/productkaart-zwitserleven-netto-pensioen-zl-nl-wtp---juli-2024.pdf'},
   {thema:'Wtp-transitie',tekst:'Carve-out als extra keuze bij de transitie van verzekerde regelingen',bron:'https://www.zwitserleven.nl/en/adviseur/actueel/transitie-wtp-carve-out-als-extra-keuze/'},
   {thema:'Wtp-transitie',tekst:'Stappenplan collectieve waardeoverdracht voor adviseurs',bron:'https://www.zwitserleven.nl/4ae40e/siteassets/documenten/adviseur/expertsessies/stappenplan-collectieve-waardeoverdracht_zl.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'TAF',type:'verzekeraar',categorieen:['inkomen'],url:'https://www.taf.nl/vind-een-adviseur-aov',
  producten:['AOV','woonlastenverzekering'],
  kenmerken:[
   {tekst:'Webinarreeks voor adviseurs over AOV-advisering',bron:'https://www.taf.nl/webinarreeks-durf-aov-te-adviseren'},
   {tekst:'Maandlastbeschermer voor zelfstandigen en zzp (ook via ASN Bank)',bron:'https://www.asnbank.nl/downloads/verzekeringskaart-taf-maandlastbeschermer-zelfstandige.html'},
   {thema:'Medische acceptatie',tekst:'Na aanvraag via de adviseur krijgt de verzekerde een uitnodiging voor een online gezondheidsverklaring; bij medische bijzonderheden beoordeelt een medisch adviseur, met een gespecialiseerde herverzekeraar voor complexe aandoeningen',bron:'https://www.taf.nl/orv-medische-redenen-lastig'},
   {thema:'Woonlastenverzekering',tekst:'Woonlastenverzekering met keuze voor volledige of gedeeltelijke dekking, alleen via een onafhankelijk adviseur',bron:'https://www.taf.nl/woonlastenverzekering'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Dazure',type:'verzekeraar',categorieen:['leven','inkomen'],url:'https://www.dazure.nl/adviseurs',
  producten:['ORV','nabestaandenverzekering'],
  kenmerken:[
   {tekst:'Bedrijf in Breda dat polissen accepteert en administreert; risicodrager is Leidsche Verzekering Maatschappij',bron:'https://www.lawinsider.com/nl/contracts/56UsKe661R9'},
   {tekst:'Voert ook nabestaandenverzekeringen uit',bron:'https://www.lawinsider.com/nl/contracts/a5eOMFHrzRT'},
   {thema:'Woonlastenverzekering',tekst:'Lastenbeschermer dekt maandlasten bij arbeidsongeschiktheid of werkloosheid; aanvragen alleen via een onafhankelijk adviseur',bron:'https://www.dazure.nl/adviseurs'},
   {thema:'Medische acceptatie',tekst:'Bij ORV en woonlastenverzekering worden gezondheidsvragen gesteld; afhankelijk van product en bedrag volgt aanvullende medische informatie',bron:'https://www.dazure.nl/medische-gegevens'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Scildon',type:'verzekeraar',categorieen:['leven','lijfrente'],url:'https://www.scildon.nl/',
  producten:['ORV','keyman','compagnonsverzekering','beleggen'],
  kenmerken:[
   {tekst:'ORV alleen via een onafhankelijk financieel adviseur of Independer',bron:'https://www.scildon.nl/'},
   {tekst:'Aparte adviseurssite (adviseur.scildon.nl)',bron:'https://adviseur.scildon.nl/binaries/content/assets/downloads/rapportage-provisieverbod.pdf'},
   {tekst:'Keyman- en compagnonsverzekering voor ondernemers',bron:'https://www.scildon.nl/overlijdensrisicoverzekering/lifestyle-orv/compagnonsverzekering'},
   {tekst:'Informatie over de kleine keuring',bron:'https://www.scildon.nl/wp-content/uploads/2024/04/Kleine-keuring-2024.pdf'},
   {thema:'Medische acceptatie',tekst:'Digitale gezondheidsverklaring; afhankelijk van leeftijd en verzekerd bedrag ook een keuring; met een medische voorgeschiedenis soms een aangepast voorstel',bron:'https://scildon.nl/overlijdensrisicoverzekering/digitale-gezondheidsverklaring'},
   {thema:'Status',tekst:'Waard Leven is op 2 juli 2025 met Scildon gefuseerd; Waard Verzekeringen gaat verder onder de naam Scildon',bron:'https://www.scildon.nl/waard-verzekeringen'},
   {thema:'Lijfrente-uitkering',tekst:'Direct Ingaande Lijfrente: eenmalige storting wordt omgezet in periodieke uitkeringen; advies en afsluiten via een onafhankelijk adviseur',bron:'https://www.scildon.nl/aanvullend-pensioen-uitkeren/direct-ingaande-lijfrente'},
   {thema:'Lijfrente',tekst:'Lijfrentelijn met lijfrentecoaches voor vragen van adviseurs',bron:'https://www.scildon.nl/adviseur/lijfrentelijn'},
   {thema:'Lijfrente-uitkering',tekst:'BemiddelingsService voor klanten met een vrijkomende lijfrente',bron:'https://www.scildon.nl/situatie/vrijkomende-lijfrente/bemiddelingsservice'},
   {thema:'Status',tekst:'De collectieve pensioenportefeuille gaat naar Allianz',bron:'https://www.scildon.nl/artikelen/artikel-persbericht-allianz-neemt-collectieve-pensioen-portefeuille-over-van-scildon'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Reaal',type:'verzekeraar',categorieen:['leven','lijfrente'],url:'https://www.reaal.nl/advies/',
  producten:['ORV','uitvaart','lijfrente','beleggingsverzekering'],
  kenmerken:[
   {tekst:'Reaal geeft zelf geen advies en verwijst naar een financieel adviseur',bron:'https://www.reaal.nl/advies/'},
   {tekst:'Alleen de adviseur die op de polis staat krijgt informatie over de verzekering',bron:'https://www.reaal.nl/klantenservice/antwoord/hoe-wijzig-ik-de-financieel-adviseur-op-mijn-verzekering/'},
   {tekst:'Hersteladvies en verzekeringscheck voor beleggingsverzekeringen',bron:'https://www.reaal.nl/klantenservice/hersteladvies-en-verzekeringscheck/'},
   {tekst:'Merk van Athora Netherlands',bron:'https://www.athora.nl/en/brands/reaal/'}
  ],bijgewerkt:'2026-10-03'},
 {naam:'ABP',type:'pensioenfonds',categorieen:['pensioen'],url:'https://www.abp.nl/werkgevers/pensioen-bij-abp/engelstalige-pensioeninformatie',
  producten:['pensioen overheid en onderwijs'],
  kenmerken:[
   {tekst:'Wettelijk communicatieplan over de overstap naar de nieuwe pensioenregeling, gepland per 1 januari 2027',bron:'https://www.abp.nl/content/dam/abp/documenten/juridisch/abp-wettelijk-communicatieplan-2025.pdf'},
   {tekst:'Werkgeversjournaal met uitleg voor werkgevers',bron:'https://www.abp.nl/content/dam/abp/documenten/handleidingen-magazines/transcript-werkgeversjournaal-16-juni-2026.pdf'},
   {tekst:'Engelstalige pensioeninformatie',bron:'https://www.abp.nl/werkgevers/pensioen-bij-abp/engelstalige-pensioeninformatie'},
   {thema:'Wtp-transitie',tekst:'Het bestuur heeft definitief besloten per 1 januari 2027 over te stappen op de nieuwe regels',bron:'https://www.abp.nl/over-abp/het-vernieuwde-pensioenstelsel'},
   {thema:'Waardeoverdracht',tekst:'Tijdens de transitie is waardeoverdracht niet altijd mogelijk of duurt langer; wie vóór 1 januari 2027 overdraagt, mist eventuele extra verhoging bij de overstap',bron:'https://www.abp.nl/uw-situatie-verandert/werk/nieuwe-baan-buiten-overheid-en-onderwijs/waardeoverdracht-van-abp'},
   {thema:'Partnerpensioen',tekst:'In de nieuwe regeling is het partnerpensioen bij overlijden voor pensioen een percentage van het salaris; het tot 2027 opgebouwde partnerpensioen blijft staan',bron:'https://www.abp.nl/over-abp/het-vernieuwde-pensioenstelsel/veelgestelde-vragen/ik-bouw-pensioen-op'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'PFZW',type:'pensioenfonds',categorieen:['pensioen'],url:'https://nieuwepensioenregels.pfzw.nl/slapers',
  producten:['pensioen zorg en welzijn'],
  kenmerken:[
   {tekst:'Overgestapt naar de nieuwe pensioenregeling in januari 2026',bron:'https://www.pfzw.nl/content/dam/pfzw/web/over-ons/dit-presteren-we/kwartaalberichten/2026/persbericht-pfzw-resultaten-eerste-kwartaal-2026.pdf'},
   {tekst:'Aparte site over de nieuwe pensioenregels per doelgroep',bron:'https://nieuwepensioenregels.pfzw.nl/slapers'},
   {tekst:'Levert pensioengeld voor het hypotheeklabel Attens',bron:'https://www.hypotheekberekenen.nl/en/mortgage-providers/attens'},
   {thema:'Partnerpensioen',tekst:'Partnerpensioen bij overlijden voor pensioen hangt in de nieuwe regeling niet meer af van diensttijd maar van het salaris bij overlijden',bron:'https://www.pfzw.nl/over-pfzw/nieuwe-regels/je-nieuwe-pensioenregeling.html'},
   {thema:'Waardeoverdracht',tekst:'Waardeoverdracht kan tijdelijk niet tussen een fonds dat al is overgestapt en een fonds dat nog niet over is',bron:'https://www.pfzw.nl/particulieren/pensioen-bij-ons/ik-bouw-pensioen-op/waardeoverdracht/hoe-werkt-het.html'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'PMT',type:'pensioenfonds',categorieen:['pensioen'],url:'https://www.pmt.nl/media/ivocbjdq/pensioenfonds-metaal-en-techniek-communicatieplan.pdf',
  producten:['pensioen metaal en techniek'],
  kenmerken:[
   {tekst:'DNB gaf akkoord voor overstap naar het nieuwe stelsel per 1 januari 2026; premieregeling met persoonlijk pensioenvermogen',bron:'https://www.banken.nl/nieuws/26565/pensioenfonds-metaal-techniek-krijgt-groen-licht-voor-overstap-naar-nieuwe-stelsel'},
   {tekst:'Communicatieplan over de overstap',bron:'https://www.pmt.nl/media/ivocbjdq/pensioenfonds-metaal-en-techniek-communicatieplan.pdf'},
   {thema:'Waardeoverdracht',tekst:'Overdracht kan alleen als oud en nieuw fonds allebei wel of allebei niet zijn overgestapt; reken op ongeveer 8 maanden doorlooptijd',bron:'https://www.pmt.nl/nieuw-pensioenstelsel/waardeoverdracht/'},
   {thema:'Partnerpensioen',tekst:'Let op: een partnerpensioen bij overlijden voor pensioen bij de vorige uitvoerder vervalt als het pensioen naar PMT wordt meegenomen',bron:'https://www.pmt.nl/nieuw-pensioenstelsel/waardeoverdracht/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'PME',type:'pensioenfonds',categorieen:['pensioen'],url:'https://www.pmepensioen.nl/sites/default/files/documenten/transitieplan.pdf',
  producten:['pensioen metalektro'],
  kenmerken:[
   {tekst:'Beoogde overstap naar de nieuwe pensioenregeling per 1 januari 2027',bron:'https://www.pmepensioen.nl/sites/default/files/documenten/samenvatting-transitieplan-ik-bouw-nu-pensioen-op-bij-pme.pdf'},
   {tekst:'Solidaire premieregeling met een verplichte basisregeling en vrijwillige aanvullende regelingen',bron:'https://fme.nl/system/files/publicaties/2024-03/Hoofdlijnen%20nieuwe%20pensioenregeling%20PME.pdf'},
   {thema:'Wtp-transitie',tekst:'Invaren gaat collectief; er is geen individuele keuze om achter te blijven',bron:'https://www.pmepensioen.nl/sites/default/files/documenten/veelgestelde-vragen-over-het-nieuwe-pensioenstelsel.pdf'},
   {thema:'Partnerpensioen',tekst:'Bij de overstap wordt het opgebouwde partnerpensioen omgezet in kapitaal binnen de persoonlijke pensioenpot',bron:'https://www.pmepensioen.nl/zo-werkt-de-nieuwe-basisregeling'},
   {thema:'Waardeoverdracht',tekst:'Waardeoverdracht blijft mogelijk, maar kan tijdens de transitie langer duren',bron:'https://www.pmepensioen.nl/en/transferring-pension-pots'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'bpfBOUW',type:'pensioenfonds',categorieen:['pensioen'],url:'https://werkgevers.bpfbouw.nl/content/dam/bpfbouw/documenten/juridisch/pensioenreglement-bpfbouw-2026.pdf',
  producten:['pensioen bouw en infra'],
  kenmerken:[
   {tekst:'Overgestapt naar de nieuwe pensioenregels per 1 januari 2026',bron:'https://www.aon.com/nl-nl/insights/articles/locations/nl/what-changes-for-construction-companies-with-the-new-pension-system'},
   {tekst:'BeterExcedentregeling stopt; werkgevers kiezen met een Wft-pensioenadviseur een nieuwe aanvullende regeling',bron:'https://bpfbouw.nl/content/dam/bpfbouw/documents/pdf/werkgevers/bpfbouw_presentatie_bijeenkomst_bex_vervolgstappen_oktober%202024.pdf'},
   {tekst:'Samenvatting van het transitieplan',bron:'https://bpfbouw.nl/content/dam/bpfbouw/documenten/juridisch/bpfbouw-samenvatting-transitieplan.pdf'},
   {thema:'Waardeoverdracht',tekst:'Waardeoverdracht naar of van een ander fonds kan alleen als dat fonds ook al over is; naar een verzekeraar of PPI blijft mogelijk',bron:'https://www.bpfbouw.nl/uw-situatie-verandert/werk/waardeoverdracht/waardeoverdracht-naar-ons'},
   {thema:'Partnerpensioen',tekst:'Partnerpensioen tot 1 januari 2026 is omgezet in pensioenkapitaal; bij overlijden daarna geen onderscheid meer tussen samenwonende en gehuwde partners',bron:'https://werkgevers.bpfbouw.nl/pensioen-bij-bpfbouw/nieuwe-regels-pensioen/uw-werknemer-bouwde-pensioen-op-voor-2026'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Robuust Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.robuusthypotheken.nl/ik-ben-adviseur',
  producten:['hypotheek','NHG','starters'],
  kenmerken:[
   {thema:'Acceptatie',tekst:'Acceptatiegids voor adviseurs (versie juni 2026)',bron:'https://www.robuusthypotheken.nl/uploads/robuust/files/Acceptatiegids-Robuust-juni-2026.pdf'},
   {thema:'Offerte',tekst:'Renteaanbod moet binnen 3 weken worden geaccepteerd',bron:'https://www.robuusthypotheken.nl/uploads/robuust/files/Acceptatiegids-Robuust-juni-2026.pdf'},
   {thema:'Zzp en flexibel inkomen',tekst:'NHG-hypotheek met perspectiefverklaring voor flexwerkers',bron:'https://www.robuusthypotheken.nl/hypotheek-met-perspectiefverklaring'},
   {thema:'Intermediairportal',tekst:'Distributie via Conneqt, net als HollandWoont en Hypotrust',bron:'https://hollandwoont.nl/onafhankelijk-hypotheekadvies/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Impact Hypotheken',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://impacthypotheken.nl/adviseur/oversluiten/',
  producten:['hypotheek','verduurzamen'],
  kenmerken:[
   {thema:'Duurzaamheid',tekst:'Duurzaamheidskorting na verduurzaming: na een nieuw definitief energielabel levert de klant het bewijs aan',bron:'https://impacthypotheken.nl/een-duurzamere-woning/'},
   {thema:'Verhuisregeling',tekst:'Rente meenemen kan (voorlopig) alleen bij verhuizing naar nieuwbouw of een woning met minimaal label A, of bij verduurzamen volgens de voorwaarden',bron:'https://impacthypotheken.nl/onze-voorwaarden/'},
   {thema:'Boetevrij aflossen',tekst:'Tot 25% per kalenderjaar vergoedingsvrij; rente daalt automatisch bij extra aflossen',bron:'https://impacthypotheken.nl/onze-voorwaarden/'},
   {thema:'Intermediairportal',tekst:'Hoort bij dezelfde groep als Merius Hypotheken',bron:'https://www.consumentenbond.nl/hypotheek/aanbieder/impact-hypotheken'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Clarian Wonen',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://www.iqwoon.nl/uploads/iqwoon/files/Clarian-Wonen-Acceptatiegids-Januari-2026.pdf',
  producten:['hypotheek'],
  kenmerken:[
   {thema:'Acceptatie',tekst:'Acceptatiegids voor adviseurs (januari 2026), gepubliceerd op de site van IQWOON',bron:'https://www.iqwoon.nl/uploads/iqwoon/files/Clarian-Wonen-Acceptatiegids-Januari-2026.pdf'},
   {thema:'Intermediairportal',tekst:'Hypotheeklabel binnen de Blauwtrust Groep; alleen via onafhankelijke adviseurs, distributie via Conneqt en acceptatie en beheer door Quion',bron:'https://www.homefinance.nl/clarian-wonen-hypotheekinformatie-en-klantenservice/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Domivest',type:'geldverstrekker',categorieen:['hypotheek'],url:'https://domivest.com/het-product',
  producten:['verhuurhypotheek','uitpondfinanciering'],
  kenmerken:[
   {thema:'Acceptatie',tekst:'Verhuurhypotheek alleen voor professionele partijen, niet voor consumenten in de zin van de Wft',bron:'https://domivest.com/het-product'},
   {thema:'Intermediairportal',tekst:'Aanvragen uitsluitend via een bij Domivest aangesloten financieel adviseur',bron:'https://domivest.com/faq'},
   {thema:'Acceptatie',tekst:'Daarnaast een uitpondfinanciering',bron:'https://domivest.com/uitpondfinanciering'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'SNS (nu ASN Bank)',type:'bank',categorieen:['hypotheek'],url:'https://www.snsbank.nl/particulier/hypotheken/hypotheekaanbieders/sns-bank-hypotheek.html',
  status:'Merk opgegaan in ASN Bank; SNS-klanten gingen per 1 juli 2025 over',statusBron:'https://newsroom.asnbank.nl/download/071c9b36-3c89-43e5-95fe-59870657f48d/transformatieupdate1juliformelestartasnbank.pdf',
  producten:['hypotheek (bestaand)','verhuurhypotheek'],
  kenmerken:[
   {thema:'Boetevrij aflossen',tekst:'Onbeperkt vergoedingsvrij aflossen met eigen geld; geldt niet voor de verhuurhypotheek',bron:'https://www.snsbank.nl/particulier/hypotheken/hypotheek-aflossen/hypotheek-aflossen-met-eigen-geld.html'},
   {thema:'Verhuisregeling',tekst:'Bij verhuizen kan de klant onder voorwaarden de renteafspraken, rentevaste periode en schuld meenemen naar het nieuwe huis',bron:'https://www.snsbank.nl/particulier/hypotheken/ander-huis-kopen/hypotheek-meenemen-bij-een-verhuizing.html'},
   {thema:'Boetevrij aflossen',tekst:'Na afloop van de rentevaste periode kan zonder vergoeding worden overgesloten',bron:'https://www.snsbank.nl/particulier/hypotheken/hypotheek-aflossen/vergoeding-betalen-bij-aflossing-of-oversluiten.html'},
   {thema:'Acceptatie',tekst:'Informatiewijzer Verhuurhypotheek',bron:'https://www.snsbank.nl/particulier/support/download-tonen-op-pagina/sns-informatiewijzer-verhuurhypotheek.html'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Brand New Day',type:'bank',categorieen:['lijfrente','pensioen'],url:'https://new.brandnewday.nl/adviseur/adviseur-particulier/',
  producten:['pensioenrekening beleggen','pensioenrekening sparen','lijfrente-uitkering','nabestaandenlijfrente','werkgeverspensioen'],
  kenmerken:[
   {thema:'Lijfrente-uitkering',tekst:'Vast bedrag per maand, kwartaal, halfjaar of jaar uit aanvullend pensioengeld',bron:'https://new.brandnewday.nl/lijfrente-uitkering/'},
   {thema:'Kosten',tekst:'Via een adviseur geen afsluit- of overdrachtskosten; zelf online afsluiten kost eenmalig afsluitkosten',bron:'https://new.brandnewday.nl/lijfrente-uitkering/kosten-lijfrente-uitkering/'},
   {thema:'Lijfrente-uitkering',tekst:'Uitkering kan worden aangevraagd met een ingangsdatum tot zes jaar later; de rente staat vast vanaf de aanvraag',bron:'https://new.brandnewday.nl/adviseur/adviseur-particulier/lijfrente-uitkering-uitstellen/'},
   {thema:'Lijfrente',tekst:'Pensioenrekening-beleggen in eigen indexfondsen met vijf risicoprofielen; bij pensioen koopt de klant een uitkering bij Brand New Day of elders',bron:'https://new.brandnewday.nl/pensioenrekening-beleggen/'},
   {thema:'Lijfrente',tekst:'Productkaart voor adviseurs bij de pensioenrekening beleggen',bron:'https://new.brandnewday.nl/documenten/productkaart-adviseurs-pensioenrekening-beleggen.pdf'},
   {thema:'Lijfrente-uitkering',tekst:'Productvoorwaarden van de lijfrente-uitkering staan online',bron:'https://new.brandnewday.nl/documenten/productvoorwaarden-lijfrente-uitkering.pdf/'},
   {tekst:'Nabestaandenlijfrente als apart product',bron:'https://new.brandnewday.nl/nabestaandenlijfrente/'},
   {thema:'Status',tekst:'De premiepensioeninstelling (Brand New Day PPI) is sinds 2021 volledig van a.s.r.',bron:'https://asrnederland.nl/-/media/files/asrnederland-nl/nieuws-en-pers/2021/20210330persbericht--asr-rondt-overname-brand-new-day-ppi-afnl.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Meesman',type:'beleggingsinstelling',categorieen:['lijfrente'],url:'https://www.meesman.nl/onze-rekeningen/pensioenrekening/',
  producten:['pensioenrekening (lijfrente beleggen)'],
  kenmerken:[
   {thema:'Lijfrente',tekst:'Geblokkeerde pensioenrekening (derde pijler) in dezelfde indexfondsen en tegen dezelfde kosten als de gewone beleggingsrekening',bron:'https://www.meesman.nl/waarom-beleggen/beleggen-voor-pensioen/'},
   {thema:'Lijfrente-uitkering',tekst:'Meesman keert zelf niet uit: uiterlijk op 31 december van het vijfde jaar na de AOW-leeftijd gaat het kapitaal naar een aanbieder van een periodieke uitkering naar keuze',bron:'https://www.meesman.nl/waarom-beleggen/beleggen-voor-pensioen/'},
   {thema:'Waardeoverdracht',tekst:'Een bestaande lijfrenterekening kan naar Meesman worden overgedragen',bron:'https://www.meesman.nl/vragen/kan-ik-mijn-opgebouwde-waarde-bij-een-andere-pensioenaanbieder-overhevelen-naar-meesman/'},
   {thema:'Waardeoverdracht',tekst:'Overdracht naar een andere aanbieder is ook mogelijk',bron:'https://www.meesman.nl/vragen/ik-wil-de-waarde-op-mijn-pensioenrekening-overdragen-aan-een-andere-aanbieder-kan-dat/'},
   {thema:'Kosten',tekst:'Essentiële-informatiedocument van de pensioenrekening',bron:'https://www.meesman.nl/media/ws3nq3v5/2024-eid-meesman-pensioenrekening.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Saxo (voorheen BinckBank)',type:'beleggingsinstelling',categorieen:['lijfrente'],url:'https://www.home.saxo/nl-nl/-/media/documents/regional/nl/belangrijke-informatie-pensioen.pdf',
  status:'BinckBank is overgenomen door Saxo Bank; klantportefeuilles zijn naar het Saxo-platform overgezet',statusBron:'https://www.home.saxo/content/commentaries/pr/press-release/saxo-bank-acquires-ordinary-shares-in-binckbank-17122018',
  producten:['SaxoPensioen (lijfrenterekening)'],
  kenmerken:[
   {thema:'Lijfrente',tekst:'SaxoPensioen is een lijfrenterekening met vermogensbeheer in ETF\'s; een vragenlijst bepaalt het beleggingsplan, met keuze uit standaard, actiever of duurzamer beleid',bron:'https://www.home.saxo/nl-nl/-/media/documents/regional/nl/belangrijke-informatie-pensioen.pdf'},
   {thema:'Lijfrente-uitkering',tekst:'Saxo bouwt alleen op en verzorgt zelf geen pensioenuitkeringen',bron:'https://www.home.saxo/nl-nl/-/media/documents/regional/nl/belangrijke-informatie-pensioen.pdf'},
   {thema:'Lijfrente',tekst:'Saxo (handelsnaam van BinckBank N.V.) is ook bewaarbank bij lijfrenterekeningen van vermogensbeheerders via een driepartijenovereenkomst',bron:'https://axento.nl/hubfs/Axento%20vermogensbeheer/Documenten/tripartiete_klantovereenkomst_lijfrenterekening.pdf'},
   {thema:'Status',tekst:'De overgang van Binck naar Saxo ging gepaard met klachten over kosten, betalingen en toegang',bron:'https://www.vermogensbeheer.nl/nieuws/chaotische-overgang-van-binck-naar-saxo-bank'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Lifetri (Achmea Pension & Life)',type:'pensioenverzekeraar',categorieen:['leven','lijfrente','pensioen'],url:'https://lifetri.nl/berichten/achmea-en-sixth-street-lanceren-top-3-speler-in-pensioen-en-levensverzekeringen/',
  status:'Opgegaan in Achmea Pension & Life Insurance (joint venture Achmea 80%, Sixth Street 20%); de naam Lifetri verdwijnt in 2027 en polissen gaan verder onder Centraal Beheer',statusBron:'https://news.achmea.nl/achmea-lifetri-and-sixth-street-join-forces-in-the-dutch-pension-and-life-market/',
  producten:['bestaande levensverzekeringen','pensioen-buy-outs'],
  kenmerken:[
   {thema:'Status',tekst:'De joint venture Achmea Pension & Life Insurance bestaat sinds 1 oktober 2025',bron:'https://news.achmea.nl/download/f275f71a-c3c4-4e2d-8411-38d17c08c436/pressrelease-achmeapensionamplifeinsurancereinsureshalfofitslongevityrisk.pdf'},
   {thema:'Status',tekst:'Aankondiging van de juridische fusie van Lifetri Verzekeringen',bron:'https://lifetri.nl/wp-content/uploads/2026/07/AankondigingJuridischeFusie.pdf'},
   {thema:'Status',tekst:'Nam in 2019 Klaverblad Levensverzekeringen over (ACM-besluit)',bron:'https://www.acm.nl/nl/publicaties/lifetri-groep-mag-klaverblad-levensverzekeringen-overnemen-concentratiebesluit'},
   {thema:'Wtp-transitie',tekst:'Richt zich met de joint venture op buy-outs van pensioenfondsen die niet naar het nieuwe stelsel overgaan',bron:'https://news.achmea.nl/achmea-and-sixth-street-launch-top-three-player-in-pension-and-life-insurance/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Cappital (a.s.r., voorheen Aegon Cappital)',type:'ppi',categorieen:['pensioen'],url:'https://www.asr.nl/hallo-klant-van-aegon/welkom-bij-cappital-van-asr/employer',
  status:'Valt sinds de overname van Aegon Nederland (juli 2023) onder a.s.r.; werkgevers worden verwelkomd bij Cappital van a.s.r.',statusBron:'https://www.asr.nl/hallo-klant-van-aegon/welkom-bij-cappital-van-asr/employer',
  producten:['premieregeling (PPI)','Pensioenabonnement'],
  kenmerken:[
   {tekst:'Premiepensioeninstelling met een DNB-vergunning sinds 2012',bron:'https://www.aegon.nl/sites/default/files/2022-05/Annual%20report%20Aegon%20Cappital%202019_%20FINAL%20unsigned%20%282%29.pdf'},
   {tekst:'Uitvoeringsovereenkomst Pensioenabonnement van Cappital pensioen (versie 2025.1)',bron:'https://aegon.nl/sites/default/files/2025-01/Uitvoeringsovereenkomst_Pensioenabonnement_van_Cappital_pensioen_versie_2025.1.pdf'},
   {tekst:'Pensioenreglement van de premieregeling (versie 2025.1)',bron:'https://aegon.nl/sites/default/files/2025-01/Pensioenreglement_Premie-uitkeringsovereenkomst_Pensioenabonnement_van_Cappital_pensioen_versie_2025.1.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'BeFrank (NN)',type:'ppi',categorieen:['pensioen'],url:'https://www.befrank.nl/en/advisor/advise-befrank/',
  producten:['premieregeling (PPI)','Wtp-regeling'],
  kenmerken:[
   {thema:'Wtp-transitie',tekst:'Aanvraagformulier voor een Wtp-pensioenvoorstel voor adviseurs',bron:'https://www.befrank.nl/adviseur/aanvraagformulier-wtp-pensioenvoorstel/'},
   {thema:'Wtp-transitie',tekst:'Productkaart Brutoregeling onder de Wet toekomst pensioenen (april 2026)',bron:'https://www.befrank.nl/wp-content/uploads/2026/04/Productkaart-BeFrank-Bruto-pensioen-Wtp-2026.pdf'},
   {thema:'Wtp-transitie',tekst:'Stappenplan om een bestaande regeling Wtp-proof te maken; werkgevers moeten vóór 1 januari 2028 over',bron:'https://www.befrank.nl/wp-content/uploads/2025/09/Stappenplan-Overstap-Wtp.pdf'},
   {tekst:'Pensioenconsultants spreken werkgevers en adviseurs telefonisch, online of op locatie',bron:'https://www.befrank.nl/en/advisor/advise-befrank/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Centraal Beheer PPI (Achmea)',type:'ppi',categorieen:['pensioen'],url:'https://www.centraalbeheer.nl/ppi/adviseur/pensioenoplossingen',
  producten:['premieregeling (PPI)'],
  kenmerken:[
   {thema:'Wtp-transitie',tekst:'Regelingen zijn al premieregelingen; deelnemers beleggen individueel met keuze uit meerdere lifecycles',bron:'https://www.centraalbeheer.nl/ppi/adviseur/wet-toekomst-pensioenen'},
   {tekst:'Werkgever kan de pensioenregeling zelf samenstellen',bron:'https://www.centraalbeheer.nl/ppi/werkgever/stel-zelf-pensioenregeling-samen'},
   {thema:'Intermediairportal',tekst:'Inlogoverzicht voor werkgevers, deelnemers en adviseurs',bron:'https://www.centraalbeheer.nl/ppi/algemeen/inlog-overzicht'},
   {thema:'Wtp-transitie',tekst:'Overzicht van de Wtp-gevolgen, zoals leeftijdsonafhankelijke premie en partnerpensioen op basis van salaris',bron:'https://www.centraalbeheer.nl/ppi/algemeen/overzicht-wet-toekomst-pensioenen'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Pensioenfonds Detailhandel',type:'pensioenfonds',categorieen:['pensioen'],url:'https://pensioenfondsdetailhandel.nl/het-nieuwe-pensioen',
  producten:['pensioen detailhandel'],
  kenmerken:[
   {thema:'Wtp-transitie',tekst:'Overstap naar de nieuwe regeling is uitgesteld van 1 januari 2026 naar 1 januari 2027',bron:'https://pensioenfondsdetailhandel.nl/nieuws/overgang-naar-de-nieuwe-pensioenregeling-uitgesteld'},
   {thema:'Waardeoverdracht',tekst:'Tijdens de transitie kan overdracht alleen als beide fondsen in hetzelfde stelsel zitten, of als een van beide niet overstapt; kleine pensioenen worden zonder pauze overgedragen',bron:'https://pensioenfondsdetailhandel.nl/werknemer/situaties-en-wijzigingen/waardeoverdracht'},
   {thema:'Wtp-transitie',tekst:'Transitieplan en samenvatting voor werkgevers en administratiekantoren',bron:'https://pensioenfondsdetailhandel.nl/content/publications/Samenvatting-Transitieplan-Werkgevers-Administratiekantoren.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Pensioenfonds PGB',type:'pensioenfonds',categorieen:['pensioen'],url:'https://www.pensioenfondspgb.nl/deelnemers/pensioen-bij-pensioenfonds-pgb/het-nieuwe-pensioen/',
  producten:['multisectorpensioen'],
  kenmerken:[
   {thema:'Wtp-transitie',tekst:'Verwachte overstap naar de nieuwe regeling per 1 januari 2027; deelnemers krijgen eerst een schatting en in het voorjaar van 2027 de definitieve bedragen',bron:'https://www.pensioenfondspgb.nl/deelnemers/pensioen-bij-pensioenfonds-pgb/het-nieuwe-pensioen/tijdlijn-op-weg-naar-het-nieuwe-pensioen/'},
   {tekst:'Een van de tien grootste pensioenfondsen; jaarverslag 2025 online',bron:'https://www.pensioenfondspgb.nl/globalassets/pdfs/jaarverslagen/pensioenfonds-pgb-jaarverslag-2025.pdf'},
   {tekst:'Brochure voor deelnemers die bijna met pensioen gaan (2026/2027)',bron:'https://www.pensioenfondspgb.nl/globalassets/pdfs/brochures-dlnr/bijna-met-pensioen.pdf'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Univé',type:'verzekeraar',categorieen:['schade','inkomen'],url:'https://www.unive.nl/over-unive',
  producten:['particuliere schade','zakelijke schade','AOV','zzp'],
  kenmerken:[
   {tekst:'Coöperatieve verzekeraar zonder winstoogmerk',bron:'https://www.unive.nl/over-unive'},
   {tekst:'Regionale Univé-coöperaties adviseren als aanbieder en als bemiddelaar',bron:'https://www.unive.nl/zuidnederland/wie-zijn-wij'},
   {thema:'Intermediairportal',tekst:'Your Benefits Assuradeuren is gevolmachtigd agent van Univé Schade voor particuliere en zakelijke schade',bron:'https://www.unive.nl/over-unive/volmacht'},
   {thema:'Schadeafhandeling',tekst:'Bij autoschade vrije keuze van herstelbedrijf',bron:'https://www.unive.nl/autoverzekering/autoschade/vrije-reparatiekeuze'},
   {thema:'Marktpositie',tekst:'Volgens Arcturus sinds 2024 een van de vier grote schadeverzekeraars, naast Achmea, a.s.r. en NN',bron:'https://arcturus.nl/nieuws/schadeverzekeraars-boeken-beste-rendement-sinds-2021/'},
   {thema:'AOV-acceptatie',tekst:'Adviestraject bij het afsluiten van een AOV',bron:'https://www.unive.nl/zakelijk/arbeidsongeschiktheidsverzekering/afsluiten/adviestraject'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Interpolis (Rabobank-kanaal)',type:'verzekeraar',categorieen:['schade'],url:'https://www.interpolis.nl/over-interpolis/rabobank-en-interpolis',
  producten:['particuliere schade','ZekerInBedrijf','agrarisch'],
  kenmerken:[
   {thema:'Intermediairportal',tekst:'Rabobank is de tussenpersoon: afsluiten en wijzigen loopt via Rabobank, Interpolis richt zich op de schadeafhandeling',bron:'https://www.interpolis.nl/over-interpolis/rabobank-en-interpolis'},
   {tekst:'Bedrijfsverzekeringen ZekerInBedrijf met advies van Rabobank',bron:'https://www.interpolis.nl/zakelijk/verzekeren/mkb'},
   {tekst:'Aparte informatie voor wie geen Rabobank-klant is',bron:'https://www.interpolis.nl/service/ik-ben-geen-rabobank-klant'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Klaverblad Verzekeringen',type:'verzekeraar',categorieen:['schade'],url:'https://www.klaverblad.nl/samenwerken-met-ons.htm',
  producten:['particuliere schade','zakelijke schade'],
  kenmerken:[
   {tekst:'Werkt met adviseurs door heel Nederland; klanten zoeken een adviseur via de site',bron:'https://www.klaverblad.nl/de-assurantieadviseur.htm'},
   {thema:'Intermediairportal',tekst:'Geeft volmacht aan een aantal gevolmachtigd agenten, die offreren, accepteren en schade behandelen namens Klaverblad',bron:'https://www.klaverblad.nl/de-verzekeringsadviseur/samenwerking-gevolmachtigd-agenten.htm'},
   {thema:'Intermediairportal',tekst:'Overzicht van de gevolmachtigd agenten',bron:'https://www.klaverblad.nl/de-verzekeringsadviseur/samenwerking-gevolmachtigd-agenten/overzicht.htm'},
   {thema:'Status',tekst:'Klaverblad Levensverzekeringen is in 2019 door Lifetri overgenomen',bron:'https://www.acm.nl/nl/publicaties/lifetri-groep-mag-klaverblad-levensverzekeringen-overnemen-concentratiebesluit'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Onderlinge Nederland',type:'verzekeraar',categorieen:['inkomen','leven'],url:'https://www.onderlingenederland.nl/adviseur/ik-ben-een-adviseur',
  status:'Nieuwe naam: Onderlinge \'s-Gravenhage heet sinds november 2025 Onderlinge Nederland; samenwerking, producten en garanties blijven gelijk',statusBron:'https://www.icmif.org/news_story/onderlinge-s-gravenhage-becomes-onderlinge-nederland/',
  producten:['AOV','levensverzekeringen'],
  kenmerken:[
   {tekst:'Onderlinge waarborgmaatschappij zonder aandeelhouders',bron:'https://www.onderlingenederland.nl/over-ons/organisatie'},
   {thema:'Intermediairportal',tekst:'Werkt met onafhankelijke adviseurs; de adviseur dient de aanvraag digitaal in en bemiddelt bij wijzigingen',bron:'https://www.onderlingenederland.nl/service/veelgestelde-vragen'},
   {thema:'Schadeafhandeling',tekst:'Arbeidsongeschiktheid melden met een formulier dat de klant via de adviseur krijgt en naar de medische afdeling stuurt',bron:'https://www.onderlingenederland.nl/service/veelgestelde-vragen'},
   {tekst:'Maatschappijwinstdeling voor leden',bron:'https://www.onderlingenederland.nl/over-ons/maatschappijwinstdeling'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'DELA',type:'verzekeraar',categorieen:['leven'],url:'https://www.dela.nl/over-dela/nieuws-en-media/20230830-samenwerking-intermediairs-verandert',
  status:'Sinds 15 september 2023 geen nieuwe verzekeringen meer via het intermediair; DELA kiest voor directe distributie',statusBron:'https://www.dela.nl/over-dela/nieuws-en-media/20230830-samenwerking-intermediairs-verandert',
  producten:['uitvaartverzekering','ORV'],
  kenmerken:[
   {thema:'Status',tekst:'Nam in 2021 uitvaartverzekeraar Yarden over',bron:'https://radar.avrotros.nl/artikel/uitvaartverzekeraar-dela-neemt-yarden-definitief-over-50958'},
   {tekst:'Aparte dienstverlening voor bewindvoerders',bron:'https://www.dela.nl/bewindvoerders/samenwerking'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Monuta',type:'verzekeraar',categorieen:['leven'],url:'https://www.monuta.nl/intermediairgezocht/',
  producten:['uitvaartverzekering','natura-uitvaartverzekering'],
  kenmerken:[
   {thema:'Intermediairportal',tekst:'Werkt met intermediairs en zoekt actief nieuwe; ondersteuning door binnen- en buitendienst',bron:'https://www.monuta.nl/intermediairgezocht/'},
   {thema:'Status',tekst:'Heeft sinds 2021 geen volmachten meer; afsluiten via een onafhankelijk adviseur of direct',bron:'https://www.monuta.nl/informatie-voor-intermediairs/gevolmachtigde-agenten/'},
   {tekst:'Natura-uitvaartverzekering naast kapitaalvarianten',bron:'https://www.monuta.nl/uitvaartverzekeringen/natura-uitvaartverzekering/'},
   {tekst:'Dienstverleningsdocument',bron:'https://www.monuta.nl/uitvaartverzekeringen/dienstverleningsdocument/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Santander Consumer Finance (nu Openbank)',type:'kredietverstrekker',categorieen:['krediet'],url:'https://www.santander.nl/bereken-en-vraag-uw-lening-aan',
  status:'Gestopt met nieuwe persoonlijke leningen; bestaande leningen lopen door',statusBron:'https://www.santander.nl/bereken-en-vraag-uw-lening-aan',
  producten:['persoonlijke lening (bestaand)'],
  kenmerken:[
   {thema:'Status',tekst:'Santander Consumer Finance Branche Nederland is opgegaan in Open Bank S.A. Branche Nederland',bron:'https://www.santander.nl/'},
   {tekst:'Bestaande klanten zien hun lening in Mijn Rekening',bron:'https://www.santander.nl/veelgestelde-vragen/persoonlijke-lening'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Freo (Rabobank)',type:'kredietverstrekker',categorieen:['krediet'],url:'https://www.freo.nl/over-freo/',
  producten:['persoonlijke lening'],
  kenmerken:[
   {tekst:'Sinds 2007 de leenspecialist van Rabobank',bron:'https://www.freo.nl/over-freo/'},
   {tekst:'Alleen een persoonlijke lening, online af te sluiten',bron:'https://www.freo.nl/geld-lenen/persoonlijke-lening/'},
   {thema:'Boetevrij aflossen',tekst:'Extra of volledig aflossen kan altijd zonder boete',bron:'https://www.freo.nl/service-en-contact/betalen-en-aflossen/aflossen/'},
   {thema:'Acceptatie',tekst:'Toetst bij BKR; met een positieve registratie is lenen mogelijk, met een negatieve niet',bron:'https://www.freo.nl/geld-lenen/'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'InterBank',type:'kredietverstrekker',categorieen:['krediet'],url:'https://www.interbank.nl/',
  status:'Sinds 1 oktober 2022 geen nieuwe leningen; bestaande leningen lopen door tot het einde van de looptijd',statusBron:'https://www.homefinance.nl/interbank-leningen-wat-u-moet-weten-over-bestaande-kredieten-en-opties/',
  producten:['leningen (bestaand)'],
  kenmerken:[
   {thema:'Intermediairportal',tekst:'Leningen werden altijd via een intermediair (adviseur of dealer) afgesloten; intermediairs hebben een eigen login',bron:'https://intermediair.interbank.nl/pkmslogin.form?rfr=ip'},
   {tekst:'Informatie voor bestaande klanten bij een andere baan of werkloosheid',bron:'https://www.interbank.nl/wat-als/andere-baan-of-werkloos'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Lender & Spender',type:'kredietverstrekker',categorieen:['krediet'],url:'https://partners.lenderspender.nl/support',
  producten:['persoonlijke lening','aankoopfinanciering','Go Green lening'],
  kenmerken:[
   {tekst:'Peer-to-peer: leningen worden gefinancierd door particuliere en zakelijke beleggers in plaats van een bank',bron:'https://www.lenderspender.nl/pdf/algemene-voorwaarden'},
   {tekst:'AFM-vergunning voor kredietverlening, volgt de VFN-gedragscode en is aangesloten bij Kifid',bron:'https://www.lenderspender.nl/over-ons/afm-vergunning'},
   {thema:'Acceptatie',tekst:'Acceptatiecriteria staan in het partnerportaal',bron:'https://partners.lenderspender.nl/support/wanneer-komt-iemand-in-aanmerking-voor-een-lening'},
   {thema:'Intermediairportal',tekst:'Aanvragen van persoonlijke leningen kan ook via Maex',bron:'https://partners.lenderspender.nl/support/aanvraagproces-persoonlijke-lening-via-maex'},
   {thema:'Duurzaamheid',tekst:'Go Green lening voor verduurzaming',bron:'https://partners.lenderspender.nl/support/lender-spender-introduceert-go-green-lening'},
   {tekst:'Partnerprogramma voor aankoopfinanciering via link of QR-code',bron:'https://www.lenderspender.nl/partners'}
  ],bijgewerkt:'2026-10-02'},
 {naam:'Ribank',type:'kredietverstrekker',categorieen:['krediet'],url:'https://www.ribank.nl/partners/onze_producten/financieringen.html',
  producten:['Riflex (doorlopend krediet)','Ribusiness (zakelijk krediet)'],
  kenmerken:[
   {tekst:'Onderdeel van Crédit Agricole Consumer Finance Nederland',bron:'https://www.ribank.nl/cms/over_ribank/wie_zijn_wij.html'},
   {tekst:'Flexibel krediet Riflex en zakelijk krediet Ribusiness',bron:'https://www.ribank.nl/cms/onze_producten/onze_producten.html'},
   {thema:'Acceptatie',tekst:'Bij doorlopend krediet neemt de financieel adviseur periodiek contact op om te toetsen of het krediet nog past',bron:'https://www.ribank.nl/cms/onze_producten/beoordeel_uw_krediet.html'},
   {thema:'Intermediairportal',tekst:'Aparte productinformatie voor partners',bron:'https://www.ribank.nl/partners/onze_producten/financieringen.html'}
  ],bijgewerkt:'2026-10-02'}
];
