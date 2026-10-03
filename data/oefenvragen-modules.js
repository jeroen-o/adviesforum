/* OEFENVRAGEN-MODULES van het Adviesforum – extra oefenvragen per Wft-module
 *
 * Aanvulling op data/oefenvragen.js en data/oefenvragen-extra.js (zelfde velden). Laad dit bestand NA
 * data/oefenvragen.js. Het voegt vragen toe aan window.OEFENVRAGEN en vult window.OEFENVRAGEN_MODULES aan
 * met de modules die nog ontbraken (Schadeverzekeringen zakelijk en Zorgverzekeringen).
 *
 * GEEN officiële CDFD-examenvragen en niets overgenomen uit commerciële proefexamens. Alle vragen zijn zelf
 * opgesteld op basis van de onderwerpen in de eind- en toetstermen van het CDFD, de kennisbank van het
 * Adviesforum (data/kennisbank*.js), de normen 2026 in js/rekentools/normen.js en officiële bronnen
 * (Belastingdienst, SVB, UWV, Rijksoverheid, AFM, CAK, NZa, wetten.overheid.nl). Peildatum: oktober 2026.
 *
 * Extra veld:
 *   soort   'kennis' | 'toepassing' | 'casus' (met rekenvoorbeeld) | 'praktijk' (kantoorpraktijk: nuttig
 *           voor het werk, maar geen typische Wft-examenstof; wordt in de proefexamenmodus overgeslagen)
 * Id-prefixen: ba2- basis, hy2- hypotheek, in2- inkomen, pn2- pensioen, vm2- vermogen, kr2- krediet,
 *              sp2- schade particulier, sz2- schade zakelijk, zo2- zorg.
 */
(function () {
  'use strict';
  const NIEUW = [
    { id: 'schadezakelijk', naam: 'Schade zakelijk', omschrijving: 'Aansprakelijkheid van ondernemers en werkgevers, brand en bedrijfsschade, transport, CAR, D&O en cyber' },
    { id: 'zorg', naam: 'Zorgverzekeringen', omschrijving: 'Zvw, eigen risico 2026, natura en restitutie, overstappen, wanbetalers, Wlz en Wmo' }
  ];
  const M = window.OEFENVRAGEN_MODULES = window.OEFENVRAGEN_MODULES || [];
  NIEUW.forEach(m => { if (!M.some(x => x.id === m.id)) M.push(m); });

  const V = [];
  const q = (module, id, onderwerp, vraag, opties, juist, uitleg, bron, soort) =>
    V.push({ id, module, onderwerp, vraag, opties, juist, uitleg, bron, soort });

  /* Veelgebruikte officiële bronnen */
  const WFT = 'https://wetten.overheid.nl/BWBR0020368/';
  const BW6 = 'https://wetten.overheid.nl/BWBR0005289/';
  const BW7 = 'https://wetten.overheid.nl/BWBR0005290/';
  const BD_BOX1 = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1';
  const BD_BOX2 = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_2/box_2';
  const BD_BOX3 = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026';
  const BD_KORT = 'https://www.belastingdienst.nl/wps/wcm/connect/fisin/fisin2026/heffingskortingen';
  const BD_SCHENK = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/tarieven-schenkbelasting';
  const BD_SCHENKKIND = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/hoeveel-mag-ik-mijn-kind-belastingvrij-schenken';
  const BD_ERF = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/vrijstelling-erfbelasting';
  const BD_EW = 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait';
  const BD_HILLEN = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/eigenwoningforfait/geen_of_een_kleine_eigenwoningschuld/geen_of_een_kleine_eigenwoningschuld';
  const BD_KEW = 'https://www.belastingdienst.nl/wps/wcm/connect/fisin/fisin2026/verzekeren_of_sparen_voor_de_aflossing';
  const BD_STARTER = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/startersvrijstelling/startersvrijstelling';
  const BD_VPB = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/vennootschapsbelasting/veranderingen-vennootschapsbelasting-2026/veranderingen-vennootschapsbelasting-2026';
  const BD_ZVW = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/werk_en_inkomen/zorgverzekeringswet/veranderingen-bijdrage-zvw/percentages-zvw';
  const BD_LIJF = 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/werk_en_inkomen/lijfrente/aftrekken-lijfrentepremies/aftrekken-lijfrentepremies';
  const BD_LEVEN2026 = 'https://odb.belastingdienst.nl/wp-content/uploads/2026/01/20251218-Overzicht-cijfers-leven-2026-FsL.pdf';
  const BD_MAXPG = 'https://centraalaanspreekpuntpensioenen.belastingdienst.nl/publicaties/va-25-008-v251209/';
  const SVB_AOW = 'https://www.svb.nl/nl/aow/nieuws/aow-bedragen-vanaf-juli-2026';
  const SVB_LEEFTIJD = 'https://www.svb.nl/nl/aow/aow-leeftijd/uw-aow-leeftijd';
  const SVB_ANW = 'https://www.svb.nl/nl/anw/wat-zijn-de-voorwaarden/wat-zijn-de-voorwaarden-voor-een-nabestaandenuitkering';
  const UWV_DAGLOON = 'https://www.uwv.nl/nl/premies-bedragen/maximum-dagloon';
  const UWV_WGA = 'https://www.uwv.nl/nl/wia/wga/loongerelateerde-uitkering';
  const UWV_WWDUUR = 'https://www.uwv.nl/nl/ww/hoelang-ww';
  const UWV_ERD = 'https://www.uwv.nl/nl/eigenrisicodrager/eigenrisicodrager-wga/erd-wga-risico-terug-uwv';
  const AFM_MAXRENTE = 'https://www.afm.nl/nl-nl/consumenten/themas/producten/lenen/max-rente';
  const AFM_BELONING = 'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/beloning/directe-beloning';
  const RO_KREDIET = 'https://www.rijksoverheid.nl/onderwerpen/bescherming-van-consumenten/vraag-en-antwoord/wat-is-kredietvergoeding-en-wat-is-het-maximale-kredietvergoedingspercentage';
  const RO_WETTRENTE = 'https://www.rijksoverheid.nl/vraag-en-antwoord/schulden/hoogte-wettelijke-rente';
  const RO_ZV = 'https://www.rijksoverheid.nl/onderwerpen/zorgverzekering/vraag-en-antwoord/';
  const CDFD_BROCHURE = 'https://cdfd.nl/wp-content/uploads/2026/03/260302-Kandidatenbrochure-initiele-examens-per-1-april-2026-1.0.pdf';

  /* ================= BASIS ================= */
  q('basis', 'ba2-001', 'Wft', "Welk deel van de Wet op het financieel toezicht bevat de regels voor het gedragstoezicht op financiële ondernemingen?",
    ["Deel 4", "Deel 2", "Deel 3", "Deel 1"], 0,
    "Deel 4 van de Wft gaat over gedragstoezicht op financiële ondernemingen, zoals de zorgplicht en informatieplichten. Deel 2 regelt de markttoegang (vergunningen), deel 3 het prudentieel toezicht en deel 1 bevat algemene bepalingen.", WFT, 'kennis');
  q('basis', 'ba2-002', 'Toezicht', "Hoe heet het Nederlandse toezichtmodel waarin DNB het prudentieel toezicht en de AFM het gedragstoezicht uitoefent?",
    ["Het functionele toezichtmodel (twin peaks)", "Het sectorale toezichtmodel", "Het geïntegreerde toezichtmodel met één toezichthouder", "Zelfregulering door de branche"], 0,
    "Nederland verdeelt het toezicht naar functie: DNB kijkt naar de soliditeit van instellingen, de AFM naar hun gedrag tegenover klanten en op de markt. Dat model wordt twin peaks genoemd.", 'k20', 'kennis');
  q('basis', 'ba2-003', 'Wft-begrippen', "Wanneer is er volgens de Wft sprake van adviseren?",
    ["Bij een persoonlijke aanbeveling over een specifiek product van een specifieke aanbieder aan een specifieke klant", "Bij algemene voorlichting over soorten hypotheken op een website", "Bij alle werkzaamheden die gericht zijn op het sluiten van de overeenkomst", "Alleen als de klant voor het advies betaalt"], 0,
    "Adviseren is een persoonlijke aanbeveling aan een bepaalde klant over een bepaald product. Algemene voorlichting is geen advies; werkzaamheden gericht op de totstandkoming van de overeenkomst vallen onder bemiddelen.", 'k66', 'kennis');
  q('basis', 'ba2-004', 'Wft-begrippen', "Een medewerker vult samen met de klant de aanvraag in en stuurt die naar de verzekeraar, zonder een product aan te bevelen. Welke Wft-dienst verleent hij?",
    ["Bemiddelen", "Adviseren", "Execution only zonder Wft-gevolgen", "Herverzekeren"], 0,
    "Bemiddelen omvat alle werkzaamheden die gericht zijn op de totstandkoming van een overeenkomst, zoals het indienen van een aanvraag. Daarvoor geldt een eigen vergunningplicht, ook als er geen advies wordt gegeven.", 'k66', 'toepassing');
  q('basis', 'ba2-005', 'Vergunning', "Wat kenmerkt een verbonden bemiddelaar?",
    ["Hij werkt onder verantwoordelijkheid van een financiële onderneming met vergunning en staat als zodanig in het AFM-register", "Hij heeft een eigen AFM-vergunning voor alle productcategorieën", "Hij is vrijgesteld van alle Wft-regels", "Hij is altijd in dienst van een verzekeraar"], 0,
    "Een verbonden bemiddelaar heeft geen eigen vergunning maar werkt onder de verantwoordelijkheid van een vergunninghouder, die hem laat registreren bij de AFM.", 'k66', 'kennis');
  q('basis', 'ba2-006', 'Vakbekwaamheid', "Een adviseur heeft het diploma Wft Hypothecair krediet en wil klanten ook adviseren over een arbeidsongeschiktheidsverzekering. Wat is nodig?",
    ["Een geldig Wft-diploma voor die product-dienstcombinatie, naast een vergunning van de onderneming voor dat product", "Niets, het diploma Hypothecair krediet dekt alle producten rond de woning", "Alleen toestemming van de verzekeraar", "Alleen een registertitel zoals Erkend Hypotheekadviseur"], 0,
    "Wie adviseert, moet een geldig Wft-diploma hebben voor elke product-dienstcombinatie waarover hij adviseert. Daarnaast moet de onderneming een vergunning hebben voor de productcategorie.", 'k66', 'toepassing');
  q('basis', 'ba2-007', 'Meldplicht', "Welk voorval moet een vergunninghouder melden bij de AFM?",
    ["Een incident dat de integriteit of beheerste bedrijfsvoering van de onderneming ernstig kan raken", "Iedere klacht van een klant", "Iedere nieuwe klant met een hypotheek boven € 500.000", "Elke rentewijziging bij een geldverstrekker"], 0,
    "Incidenten en misstanden die de integriteit, de bedrijfsvoering of de continuïteit kunnen raken, moeten worden gemeld. Een gewone klacht handel je zelf af via de klachtenprocedure.", 'k66', 'kennis');
  q('basis', 'ba2-008', 'Meldplicht', "Een adviesbureau krijgt een nieuwe dagelijks beleidsbepaler. Wat moet het bureau doen?",
    ["De wijziging melden bij de AFM, die de nieuwe beleidsbepaler toetst", "Niets, de AFM controleert dit bij de volgende Marktmonitor", "Alleen het Kifid informeren", "De nieuwe beleidsbepaler laten inschrijven bij het CDFD"], 0,
    "Nieuwe (mede)beleidsbepalers moeten worden gemeld. De AFM toetst onder meer hun betrouwbaarheid voordat zij hun functie mogen uitoefenen.", 'k66', 'toepassing');
  q('basis', 'ba2-009', 'AFM', "Een kantoor vult de verplichte Marktmonitor van de AFM niet in. Wat kan het gevolg zijn?",
    ["Een maatregel van de AFM, tot en met een last onder dwangsom", "Niets, de Marktmonitor is vrijwillig", "Automatisch verlies van het Wft-diploma van de adviseurs", "Een uitspraak van het Kifid"], 0,
    "Iedereen moet meewerken aan een informatieverzoek van een toezichthouder (artikel 5:20 Awb). De AFM heeft aan kantoren die de Marktmonitor niet invulden lasten onder dwangsom opgelegd.", 'k63', 'praktijk');
  q('basis', 'ba2-010', 'AFM', "Wie is binnen een vergunninghouder verantwoordelijk voor het juist en volledig invullen van de Marktmonitor?",
    ["De beleidsbepalers van de onderneming", "De medewerker die het formulier invult", "De softwareleverancier", "De AFM zelf"], 0,
    "Een medewerker of externe partij mag het voorbereiden, maar de beleidsbepalers zijn persoonlijk verantwoordelijk voor juiste en volledige antwoorden.", 'k63', 'praktijk');
  q('basis', 'ba2-011', 'Vergelijkingskaart', "Waar moet een adviseur de vergelijkingskaart naast de persoonlijke verstrekking aan de klant ook beschikbaar stellen?",
    ["Op zijn website", "In het AFM-register", "Bij het Kifid", "Alleen in het adviesrapport"], 0,
    "De vergelijkingskaart wordt aan de klant gegeven en daarnaast op de website aangeboden. Zo kunnen consumenten diensten en kosten van adviseurs vergelijken.", 'k61', 'kennis');
  q('basis', 'ba2-012', 'Beloning', "Een klant betaalt een abonnement voor nazorg en het kantoor ontvangt op een ouder product ook nog doorlopende provisie. Waar moet het kantoor op letten?",
    ["Dat de klant niet dubbel betaalt voor dezelfde dienstverlening", "Dat de provisie hoger is dan het abonnement", "Dat de provisie wordt doorgestort naar het Kifid", "Nergens op, beide vergoedingen staan los van elkaar"], 0,
    "Kies helder tussen doorlopende provisie (bij oudere producten) en een abonnement, en stem de bedragen af in vergelijkingskaart, opdrachtbevestiging en factuur.", 'k61', 'praktijk');
  q('basis', 'ba2-013', 'Economie', "Wat meet de consumentenprijsindex (CPI) van het CBS?",
    ["De gemiddelde prijsontwikkeling van goederen en diensten die huishoudens kopen", "De ontwikkeling van de huizenprijzen", "De rente die banken op spaarrekeningen geven", "De groei van het bruto binnenlands product"], 0,
    "De CPI volgt de prijzen van een pakket goederen en diensten van huishoudens. De procentuele stijging ervan is de inflatie.", 'https://www.cbs.nl', 'kennis');
  q('basis', 'ba2-014', 'Economie', "Wat is het hoofddoel van het monetair beleid van de Europese Centrale Bank?",
    ["Prijsstabiliteit, met een inflatie van 2% op middellange termijn", "Zo laag mogelijke hypotheekrentes", "Volledige werkgelegenheid in elk eurogebied", "Een vaste wisselkoers tussen euro en dollar"], 0,
    "De ECB streeft naar prijsstabiliteit en hanteert sinds 2021 een symmetrisch inflatiedoel van 2% op middellange termijn. Haar belangrijkste instrument is de beleidsrente.", 'https://www.ecb.europa.eu', 'kennis');
  q('basis', 'ba2-015', 'Economie', "Welk effect heeft een verhoging van de beleidsrente door de ECB in de regel?",
    ["Lenen wordt duurder en sparen aantrekkelijker, wat de bestedingen afremt", "Lenen wordt goedkoper, waardoor de bestedingen stijgen", "De inflatie stijgt direct", "Er verandert niets voor consumenten"], 0,
    "Een hogere beleidsrente werkt door in de rente op leningen en spaargeld. Dat remt de vraag naar krediet en de bestedingen, wat de inflatie moet drukken.", 'https://www.ecb.europa.eu', 'kennis');
  q('basis', 'ba2-016', 'Economie', "Wat is de reële rente?",
    ["De nominale rente gecorrigeerd voor inflatie", "De rente inclusief afsluitkosten", "De rente na aftrek van belasting", "De rente die de ECB aan banken rekent"], 0,
    "De reële rente laat zien wat de rente oplevert in koopkracht. Bij benadering is dat de nominale rente minus de inflatie.", 'https://www.cbs.nl', 'kennis');
  q('basis', 'ba2-017', 'Rekenen', "Een klant zet € 10.000 twee jaar vast tegen 3% rente per jaar, met rente op rente. Wat is het saldo na twee jaar?",
    ["€ 10.609", "€ 10.600", "€ 10.300", "€ 10.900"], 0,
    "Met rente op rente: € 10.000 × 1,03 × 1,03 = € 10.609. Zonder rente op rente zou het € 10.600 zijn.", 'rekentools.html', 'casus');
  q('basis', 'ba2-018', 'Belastingen', "In welke box wordt het inkomen uit een aanmerkelijk belang (vanaf 5% van de aandelen in een vennootschap) belast?",
    ["Box 2", "Box 1", "Box 3", "In de vennootschapsbelasting"], 0,
    "Dividend en verkoopwinst uit een aanmerkelijk belang vallen in box 2. Box 1 is voor werk en woning, box 3 voor sparen en beleggen.", BD_BOX2, 'kennis');
  q('basis', 'ba2-019', 'Belastingen', "Hoe werkt een heffingskorting, zoals de algemene heffingskorting?",
    ["Ze wordt in mindering gebracht op de te betalen belasting en premie volksverzekeringen", "Ze verlaagt het belastbaar inkomen, zoals een aftrekpost", "Ze wordt altijd volledig uitbetaald, ook zonder inkomen", "Ze geldt alleen in box 3"], 0,
    "Een heffingskorting is een korting op het bedrag aan belasting en premie. Een aftrekpost verlaagt het inkomen waarover je belasting betaalt; dat is iets anders.", BD_KORT, 'kennis');
  q('basis', 'ba2-020', 'Belastingen', "Een werknemer onder de AOW-leeftijd heeft in 2026 een belastbaar inkomen in box 1 van € 50.000. Hoeveel belasting en premie volksverzekeringen is dat vóór heffingskortingen (afgerond)?",
    ["€ 18.076", "€ 17.875", "€ 18.780", "€ 24.750"], 0,
    "Schijf 1: € 38.883 × 35,75% = € 13.900,67. Schijf 2: (€ 50.000 − € 38.883) × 37,56% = € 4.175,55. Samen € 18.076,22. Daarna gaan de heffingskortingen er nog af.", BD_BOX1, 'casus');
  q('basis', 'ba2-021', 'Sociale zekerheid', "Welke van deze regelingen is een werknemersverzekering?",
    ["De WW", "De AOW", "De Anw", "De Wlz"], 0,
    "De WW (en ook de WIA en Ziektewet) zijn werknemersverzekeringen. AOW, Anw en Wlz zijn volksverzekeringen, die in principe gelden voor iedereen die in Nederland woont of werkt.", 'k26', 'kennis');
  q('basis', 'ba2-022', 'Familierecht', "Een stel trouwt in 2020 zonder huwelijkse voorwaarden. De vrouw erfde in 2015 € 80.000. Wat geldt voor die erfenis?",
    ["Die blijft in beginsel privé, want sinds 2018 geldt een beperkte gemeenschap van goederen", "Die valt automatisch in de gemeenschap", "Die gaat voor de helft naar de partner", "Die valt onder het verrekenbeding van de wet"], 0,
    "Huwelijken vanaf 1 januari 2018 zonder voorwaarden vallen in een beperkte gemeenschap. Bezittingen van vóór het huwelijk en erfenissen en schenkingen blijven in beginsel privé.", 'k28', 'toepassing');
  q('basis', 'ba2-023', 'Erfrecht', "Ongehuwd samenwonende partners hebben geen testament. Een van hen overlijdt. Wie erft volgens de wet?",
    ["De bloedverwanten van de overledene, zoals kinderen, ouders of broers en zussen; de partner niet", "De partner, omdat zij samenwoonden", "De partner, als er een samenlevingscontract zonder testamentaire bepalingen is", "De Staat"], 0,
    "Ongehuwd samenwonenden zijn geen wettelijk erfgenaam van elkaar. Zonder testament kan de achterblijvende partner de woning moeten delen met familie van de overledene.", 'k29', 'toepassing');
  q('basis', 'ba2-024', 'Erfrecht', "Een gehuwde man met twee kinderen overlijdt zonder testament. Wat houdt de wettelijke verdeling in grote lijnen in?",
    ["De langstlevende krijgt de goederen; de kinderen krijgen een geldvordering die in principe pas opeisbaar is bij overlijden of faillissement van de langstlevende", "De kinderen krijgen direct de woning", "Alles gaat naar de kinderen; de partner krijgt alleen een vruchtgebruik", "De nalatenschap wordt direct in drie gelijke delen verkocht"], 0,
    "Bij de wettelijke verdeling kan de langstlevende in de woning blijven wonen. De kinderen houden een vordering op de langstlevende.", 'k29', 'kennis');
  q('basis', 'ba2-025', 'Draagplicht', "Twee partners zijn hoofdelijk aansprakelijk voor de hypotheek. Wat betekent dat?",
    ["De geldverstrekker kan van ieder van hen de volledige schuld opeisen; onderling bepaalt de draagplicht wie welk deel draagt", "Ieder is alleen aansprakelijk voor de helft", "Alleen de partner met het hoogste inkomen is aansprakelijk", "De renteaftrek volgt altijd wie de rente feitelijk betaalt"], 0,
    "Hoofdelijkheid gaat over de verhouding met de geldverstrekker. Voor de renteaftrek is de draagplicht leidend, niet wie de rente betaalt.", 'draagplicht.html', 'kennis');
  q('basis', 'ba2-026', 'AVG', "Op welke grondslag verwerkt een adviseur in de regel de gegevens die nodig zijn om een adviesopdracht uit te voeren?",
    ["Uitvoering van een overeenkomst met de klant", "Uitsluitend toestemming van de klant", "Het algemeen belang", "Een vitaal belang van de klant"], 0,
    "De AVG kent zes grondslagen. Gegevens die nodig zijn om de opdracht uit te voeren, verwerk je op grond van de overeenkomst. Toestemming is nodig voor verwerkingen die daar niet onder vallen, zoals veel vormen van marketing.", 'https://www.autoriteitpersoonsgegevens.nl', 'kennis');
  q('basis', 'ba2-027', 'AVG', "Een kantoor laat zijn klantdossiers beheren in een CRM van een externe leverancier. Wat regelt het kantoor met die leverancier?",
    ["Een verwerkersovereenkomst", "Een vergelijkingskaart", "Een draagplichtovereenkomst", "Niets, de leverancier is zelf verantwoordelijk"], 0,
    "Een partij die persoonsgegevens verwerkt in opdracht van het kantoor is een verwerker. Het kantoor blijft verwerkingsverantwoordelijke en legt de afspraken vast in een verwerkersovereenkomst.", 'https://www.autoriteitpersoonsgegevens.nl', 'kennis');
  q('basis', 'ba2-028', 'Zorgplicht', "Welke maatstaf gebruikt het Kifid in de regel om te beoordelen of een adviseur zijn zorgplicht is nagekomen?",
    ["Het handelen van een redelijk bekwaam en redelijk handelend adviseur", "Of het product achteraf goed heeft uitgepakt", "Of de klant tevreden is", "Of de adviseur de goedkoopste aanbieder heeft gekozen"], 0,
    "De vraag is wat een redelijk bekwaam en redelijk handelend adviseur in dezelfde situatie had gedaan. Een slechte uitkomst betekent niet automatisch dat de zorgplicht is geschonden.", 'k114', 'kennis');
  q('basis', 'ba2-029', 'Informatieplicht', "Een adviseur vermeldt in zijn rapport alleen dat er aan het einde van de looptijd een restschuld overblijft. Is dat voldoende?",
    ["Nee, hij moet de gevolgen en de mogelijkheden om af te lossen bespreken", "Ja, de klant is daarmee geïnformeerd", "Ja, als de klant het rapport heeft ondertekend", "Nee, hij moet de restschuld zelf aflossen"], 0,
    "Uit Kifid-uitspraken blijkt dat het melden van een feit niet genoeg is. De klant moet de gevolgen begrijpen, zodat hij een weloverwogen keuze kan maken.", 'k114', 'toepassing');
  q('basis', 'ba2-030', 'Zorgplicht', "Welke rol verwacht de AFM volgens de Leidraad Hypotheekadvisering (april 2026) van de adviseur?",
    ["Een zelfstandige rol: hij weegt de wens van de klant kritisch en geeft een eigen onderbouwde aanbeveling", "Een uitvoerende rol: hij regelt wat de klant wil", "Een rol als vertegenwoordiger van de geldverstrekker", "Een rol als belastingadviseur"], 0,
    "De adviseur laat zich niet alleen leiden door de wens van de klant of door wat de aanbieder wil lenen. Hij onderzoekt de wens en adviseert wat past.", 'k11', 'kennis');
  q('basis', 'ba2-031', 'Productontwikkeling', "Wat houdt het productontwikkelingsproces (PARP) bij financiële aanbieders in?",
    ["Producten worden ontwikkeld en periodiek getoetst met evenwichtige aandacht voor de belangen van de klant en een duidelijke doelgroep", "Producten worden vooraf door de AFM goedgekeurd", "Adviseurs ontwikkelen zelf hun producten", "Alleen de prijs van een product wordt jaarlijks getoetst"], 0,
    "Aanbieders moeten in hun productontwikkeling en -review rekening houden met het klantbelang en bepalen voor welke doelgroep een product bedoeld is. De AFM keurt producten niet vooraf goed.", 'https://www.afm.nl', 'kennis');
  q('basis', 'ba2-032', 'Depositogarantie', "Een echtpaar heeft € 180.000 op een gezamenlijke spaarrekening bij één bank en verder niets bij die bank. De bank gaat failliet. Hoeveel valt onder het depositogarantiestelsel?",
    ["€ 180.000, want het saldo wordt per rekeninghouder toegerekend (€ 90.000 elk)", "€ 100.000", "€ 90.000", "€ 200.000"], 0,
    "Het depositogarantiestelsel beschermt tot € 100.000 per persoon per bank. Een gezamenlijke rekening wordt over de rekeninghouders verdeeld; elk deel van € 90.000 valt onder de garantie.", 'https://www.dnb.nl', 'casus');
  q('basis', 'ba2-033', 'Wwft', "Vanaf wanneer gelden de Europese anti-witwasverordening (AMLR) en de zesde anti-witwasrichtlijn?",
    ["Vanaf 10 juli 2027", "Vanaf 1 januari 2026", "Vanaf 20 november 2026", "Ze zijn al sinds 2024 van toepassing"], 0,
    "De AMLR is in juni 2024 gepubliceerd en geldt vanaf 10 juli 2027. Tot die datum blijft de Wwft volledig van toepassing.", 'k122', 'kennis');
  q('basis', 'ba2-034', 'Wwft', "Welke drempel voor een uiteindelijk belanghebbende (UBO) hanteert de AMLR?",
    ["Een belang van 25% of meer", "Een belang van meer dan 25%", "Een belang van 10% of meer", "Een belang van meer dan 50%"], 0,
    "Onder de AMLR is UBO wie een belang heeft van 25% of meer. In de huidige Nederlandse regels is dat meer dan 25%.", 'k122', 'kennis');
  q('basis', 'ba2-035', 'Wetgeving', "Sinds wanneer geldt de Europese verordening over digitale operationele weerbaarheid (DORA) voor financiële entiteiten?",
    ["Sinds 17 januari 2025", "Sinds 1 januari 2013", "Vanaf 10 juli 2027", "Vanaf 2 december 2027"], 0,
    "DORA geldt sinds 17 januari 2025. Ga via de AFM na of en in welke mate je onderneming eronder valt.", 'k120', 'kennis');
  q('basis', 'ba2-036', 'Wetgeving', "Wat regelt het Wijzigingsbesluit financiële markten 2026 (in werking sinds 24 juli 2026) onder meer voor financiëledienstverleners?",
    ["Nadere regels voor uitbesteding, zoals een register, een schriftelijke overeenkomst en blijvende controle", "Een nieuwe NHG-grens", "Het einde van het provisieverbod", "Een verplicht Wft-examen voor alle klantmedewerkers"], 0,
    "Het besluit wijzigt onder meer het Bgfo. Het werkt de regels voor uitbesteding verder uit en stelt voorwaarden aan modelmatige woningwaardering.", 'k120', 'kennis');
  q('basis', 'ba2-037', 'Wwft', "Een adviseur bemiddelt alleen in hypotheken en schadeverzekeringen. Is hij een Wwft-instelling?",
    ["Doorgaans niet; de geldverstrekker en de notaris doen dan het wettelijke cliëntenonderzoek", "Ja, elke financieel adviseur valt onder de Wwft", "Ja, maar alleen voor hypotheken boven € 100.000", "Nee, en hij hoeft ook niets te doen tegen fraude"], 0,
    "Onder de Wwft vallen onder meer bemiddelaars in levensverzekeringen. Wie alleen hypotheken of schadeverzekeringen doet, is doorgaans geen Wwft-instelling, maar heeft wel een rol in het voorkomen van fraude.", 'k65', 'toepassing');
  q('basis', 'ba2-038', 'Examen', "Welke cesuur gebruikt het CDFD voor de initiële Wft-examens?",
    ["68% van het maximaal te behalen aantal punten", "55% van het aantal vragen", "75% van het aantal vragen", "Een vast aantal van 30 goede antwoorden"], 0,
    "Je slaagt bij 68% van het maximaal haalbare aantal punten. Dat komt overeen met het cijfer 5,5, afgerond een 6.", 'https://cdfd.nl/initieel-examen-basis/', 'kennis');
  q('basis', 'ba2-039', 'Examen', "Hoeveel punten levert een vraag over vaardigheden en competenties (V/C) maximaal op in een initieel Wft-examen?",
    ["2 punten, tegenover 1 punt voor een vraag over kennis en begrip", "1 punt, net als kennisvragen", "3 punten", "5 punten"], 0,
    "Volgens de kandidatenbrochure leveren kennis- en begripsvragen maximaal 1 punt op en vragen over professioneel gedrag en over vaardigheden en competenties maximaal 2 punten.", CDFD_BROCHURE, 'kennis');
  q('basis', 'ba2-040', 'Zorgplicht', "Een adviseur adviseert niet over verzekeringen, maar ziet dat de klant het risico van arbeidsongeschiktheid niet kan dragen. Wat verwacht de AFM?",
    ["Dat hij wijst op de gevolgen en de klant actief doorverwijst", "Niets, het valt buiten zijn opdracht", "Dat hij zelf een AOV afsluit", "Dat hij de hypotheekaanvraag weigert"], 0,
    "Ook als je niet over verzekeringen adviseert, moet je wijzen op de gevolgen als de klant een risico niet kan dragen en actief doorverwijzen. Terugbellen na enige tijd noemt de AFM een goede praktijk.", 'k11', 'toepassing');

  /* ================= HYPOTHECAIR KREDIET ================= */
  q('hypotheek', 'hy2-001', 'NHG', "Tot welk percentage van de marktwaarde mag een lening met NHG maximaal gaan als er energiebesparende voorzieningen worden meegefinancierd?",
    ["106%", "100%", "110%", "125%"], 0,
    "De LTV is bij NHG maximaal 100% van de marktwaarde na aanpassingen. Met energiebesparende voorzieningen mag dat 106% zijn; die extra 6% mag alleen naar die voorzieningen.", 'k73', 'kennis');
  q('hypotheek', 'hy2-002', 'NHG', "Wat geldt voor een aflossingsvrij deel bij een lening met NHG (V&N 2026)?",
    ["Alleen voor een bestaande eigenwoningschuld en tot maximaal 50% van de marktwaarde", "Altijd toegestaan tot 100% van de marktwaarde", "Nooit toegestaan", "Alleen bij nieuwbouw"], 0,
    "Nieuwe leningen met NHG lossen annuïtair of lineair af in maximaal 30 jaar. Aflossingsvrij mag alleen voor een bestaande eigenwoningschuld, tot 50% van de marktwaarde.", 'k70', 'kennis');
  q('hypotheek', 'hy2-003', 'NHG', "Bij de BKR-toets voor NHG blijkt dat een aanvrager een lopende schuldhulpregeling heeft. Wat betekent dat?",
    ["Geen NHG", "NHG is mogelijk na een verklaring van de werkgever", "NHG is mogelijk met een hogere borgtochtprovisie", "Dit speelt geen rol bij NHG"], 0,
    "Een codering 1 tot en met 5, een lopende schuldhulpregeling of loonbeslag betekent geen NHG. Een A-codering kan alleen als die hersteld of aantoonbaar afgelost is.", 'k70', 'toepassing');
  q('hypotheek', 'hy2-004', 'NHG', "Eist NHG in 2026 een overlijdensrisicoverzekering bij een lening met NHG?",
    ["Nee, NHG eist geen ORV; het blijft wel een adviesvraag", "Ja, altijd voor het volledige bedrag", "Ja, voor het deel boven 80% van de marktwaarde", "Alleen bij twee aanvragers"], 0,
    "NHG stelt geen ORV verplicht. Het afdekken van het overlijdensrisico is daarmee vooral een onderdeel van het advies, op basis van een tekortberekening.", 'k2', 'kennis');
  q('hypotheek', 'hy2-005', 'NHG', "Een klant koopt een bestaande woning voor € 475.000 en wil € 440.000 lenen, de rest betaalt hij uit eigen geld. Er worden geen energiebesparende voorzieningen meegefinancierd. Kan dit met NHG?",
    ["Nee, de koopsom telt mee voor de NHG-grens van € 470.000, ook als een deel uit eigen geld komt", "Ja, alleen het geleende bedrag wordt getoetst", "Ja, de NHG-grens is € 498.200", "Ja, als de klant de borgtochtprovisie verdubbelt"], 0,
    "De NHG-grens wordt getoetst op de kosten van de woning én op de lening. De koopsom telt mee, ook als de klant die deels zelf betaalt. € 475.000 is hoger dan € 470.000.", 'k70', 'casus');
  q('hypotheek', 'hy2-006', 'NHG', "Een starter koopt een nieuwbouwwoning voor € 480.000 vrij op naam. Met welk bedrag aan koopsom wordt de NHG-grens getoetst?",
    ["€ 465.600 (97% van de v.o.n.-koopsom)", "€ 480.000", "€ 470.000", "€ 451.200 (94%)"], 0,
    "Bij een vrij-op-naamkoopsom telt 97% mee voor de kosten van de woning: € 480.000 × 97% = € 465.600. Dat valt binnen de grens van € 470.000, mits de overige posten passen.", 'k70', 'casus');
  q('hypotheek', 'hy2-007', 'NHG', "De klant betaalt een verbouwing deels uit eigen geld en deels uit een bouwdepot bij een NHG-lening. In welke volgorde wordt betaald?",
    ["Eerst het eigen geld, daarna het bouwdepot", "Eerst het bouwdepot, daarna het eigen geld", "Naar verhouding uit beide", "De klant mag dat zelf kiezen"], 0,
    "Bij NHG gaat het eigen geld eerst op; pas daarna betaalt de geldverstrekker uit het depot. Een restsaldo na afronding moet op de lening worden afgelost.", 'k73', 'kennis');
  q('hypotheek', 'hy2-008', 'NHG', "Wanneer is bij een NHG-aanvraag een bouwkundig rapport nodig?",
    ["Als het taxatierapport achterstallig onderhoud noemt dat snel moet worden hersteld en de geschatte kosten meer dan 10% van de marktwaarde zijn", "Bij elke bestaande woning", "Alleen bij nieuwbouw", "Alleen als de klant daar zelf om vraagt"], 0,
    "Een bouwkundig rapport is onder meer nodig bij achterstallig onderhoud van meer dan 10% van de marktwaarde, als meer onderzoek nodig is of als de bouwkundige staat slecht is.", 'k73', 'kennis');
  q('hypotheek', 'hy2-009', 'NHG', "In welk geval is bij NHG een hybride taxatie niet toegestaan?",
    ["Als de lening hoger is dan 90% van de marktwaarde", "Als de woning na 2000 is gebouwd", "Als de klant een vast contract heeft", "Een hybride taxatie is nooit toegestaan bij NHG"], 0,
    "Een hybride taxatie mag niet onder meer bij een lening boven 90% van de marktwaarde, bij een waarde na verbouwing en bij (dreigende) gedwongen verkoop. Dan is een fysieke taxatie nodig.", 'k73', 'kennis');
  q('hypotheek', 'hy2-010', 'Inkomen', "Hoe oud mogen de werkgeversverklaring en de salarisstrook bij een NHG-aanvraag maximaal zijn op de datum van het bindend aanbod?",
    ["3 maanden", "6 maanden", "12 maanden", "1 maand"], 0,
    "Werkgeversverklaring (volgens het NHG-model) en salarisstrook zijn beide maximaal 3 maanden oud op de datum van het bindend aanbod.", 'k72', 'kennis');
  q('hypotheek', 'hy2-011', 'Inkomen', "Een klant met een flexibel dienstverband gebruikt de jaaropgavemethode. Zijn inkomen was € 42.000, € 45.000 en in het laatste jaar € 39.000. Wat is het toetsinkomen?",
    ["€ 39.000", "€ 42.000", "€ 45.000", "€ 40.500"], 0,
    "Bij jaaropgaven geldt het gemiddelde van de laatste drie kalenderjaren (€ 42.000), maar maximaal het inkomen van het laatste jaar. Dat is € 39.000.", 'k72', 'casus');
  q('hypotheek', 'hy2-012', 'Inkomen', "Wat is nodig voor de Inkomensbepaling Loondienst (IBL) bij NHG?",
    ["Een gewaarmerkt UWV-verzekeringsbericht en een salarisstrook, beide maximaal 3 maanden oud", "Een werkgeversverklaring met intentieverklaring", "De aangiften inkomstenbelasting van drie jaar", "Een arbeidsmarktscan"], 0,
    "Met IBL rekent een tool het toetsinkomen uit op basis van het UWV-verzekeringsbericht. Een werkgeversverklaring is dan niet nodig; de methode werkt ook voor flexibel werk.", 'k72', 'kennis');
  q('hypotheek', 'hy2-013', 'Inkomen', "Een dga met 30% van de aandelen in zijn BV vraagt een hypotheek met NHG aan. Hoe wordt zijn inkomen bepaald?",
    ["Met een inkomensverklaring ondernemer (IKV) van een door NHG geaccepteerde rekenexpert", "Met een werkgeversverklaring van zijn eigen BV", "Met IBL", "Met een perspectiefverklaring"], 0,
    "Een IKV is verplicht voor ondernemers die hun onderneming minimaal 12 maanden uitoefenen, ook voor dga's met 5% of meer van de aandelen.", 'k72', 'toepassing');
  q('hypotheek', 'hy2-014', 'Inkomen', "Een gescheiden klant ontvangt partneralimentatie en kinderalimentatie volgens een vonnis. Wat telt mee als toetsinkomen bij NHG?",
    ["Alleen de partneralimentatie, zolang het recht bestaat", "Alleen de kinderalimentatie", "Beide", "Geen van beide"], 0,
    "Ontvangen partneralimentatie telt mee zolang het recht bestaat; kinderalimentatie niet. Betaalde partneralimentatie gaat van het inkomen af.", 'k72', 'toepassing');
  q('hypotheek', 'hy2-015', 'Leennormen', "Een klant van 59 bereikt binnen tien jaar na het bindend aanbod de AOW-leeftijd. Hoe wordt dan getoetst?",
    ["Apart voor de periode vóór en na de AOW-leeftijd", "Alleen op het huidige inkomen", "Alleen op het verwachte AOW- en pensioeninkomen", "Er wordt niet getoetst op inkomen"], 0,
    "Bereikt een aanvrager binnen tien jaar de AOW-leeftijd, dan toets je ook of het verwachte inkomen vanaf die leeftijd voldoende is. Daarvoor bestaat een aparte AOW-tabel.", 'k10', 'toepassing');
  q('hypotheek', 'hy2-016', 'Leennormen', "Een klant kan op basis van zijn inkomen maximaal € 300.000 lenen. Hij koopt in 2026 een woning met energielabel A++. Hoeveel kan hij maximaal lenen op inkomen inclusief de extra labelruimte?",
    ["€ 320.000", "€ 310.000", "€ 325.000", "€ 300.000"], 0,
    "Bij aankoop geeft label A+ of A++ in 2026 € 20.000 extra leenruimte: € 300.000 + € 20.000 = € 320.000. De lening moet daarnaast passen binnen de LTV-norm en de eigen betaalbaarheidsanalyse.", 'k10', 'casus');
  q('hypotheek', 'hy2-017', 'Verduurzaming', "Een klant wil bij een NHG-lening nieuwe kozijnen meefinancieren als energiebesparende voorziening. Wanneer telt dat als EBV?",
    ["Alleen samen met minimaal HR++-glas", "Altijd, kozijnen zijn altijd een EBV", "Nooit", "Alleen bij nieuwbouw"], 0,
    "Volgens de NHG-regels (die de Trhk-lijst volgen) tellen kozijnen alleen als energiebesparende voorziening samen met minimaal HR++-glas. Energiezuinige ventilatie telt alleen samen met andere EBV.", 'k73', 'toepassing');
  q('hypotheek', 'hy2-018', 'Leennormen', "Een klant heeft een wettelijk maandbedrag DUO van € 150. De hypotheekrente in box 1 is 4,25%. Met welk bedrag rekent de toets in 2026?",
    ["€ 187,50 (factor 1,25)", "€ 150,00", "€ 180,00 (factor 1,20)", "€ 210,00 (factor 1,40)"], 0,
    "Bij een rente van 4,001% tot en met 4,500% is de brutering 1,25: € 150 × 1,25 = € 187,50 per maand. Die last verlaagt de leenruimte.", 'k10', 'casus');
  q('hypotheek', 'hy2-019', 'Leennormen', "Hoeveel mag een aantoonbaar niet-kwetsbare alleenstaande in 2026 extra lenen bovenop de normale leenruimte?",
    ["€ 17.000", "€ 10.000", "€ 17.356", "€ 25.000"], 0,
    "Het extra bedrag voor alleenstaanden blijft € 17.000. Geïndexeerd zou het € 17.356 zijn, maar het Nibud adviseerde het te handhaven.", 'k10', 'kennis');
  q('hypotheek', 'hy2-020', 'Leennormen', "Hoeveel financieringslasttabellen kent de Trhk 2026?",
    ["Vier: niet-AOW en AOW, elk voor aftrekbare (box 1) en niet-aftrekbare (box 3) leningdelen", "Eén tabel voor alle situaties", "Twee: voor alleenstaanden en voor stellen", "Drie: voor starters, doorstromers en senioren"], 0,
    "Er zijn vier tabellen, gesplitst naar AOW-leeftijd en naar fiscale behandeling van de rente.", 'k10', 'kennis');
  q('hypotheek', 'hy2-021', 'Leennormen', "Wie stelt de minimale toetsrente vast voor leningdelen met een rentevaste periode korter dan tien jaar?",
    ["De AFM, per kwartaal", "Het Nibud, per jaar", "De geldverstrekker zelf", "De Stichting WEW"], 0,
    "De AFM stelt de minimale toetsrente per kwartaal vast. Die is geen onderdeel van het Nibud-advies.", 'k10', 'kennis');
  q('hypotheek', 'hy2-022', 'Fiscaliteit eigen woning', "Een klant betaalt in 2026 € 12.000 hypotheekrente op zijn eigenwoningschuld. Het eigenwoningforfait is € 1.400. Hij valt in de tweede schijf. Wat is zijn fiscale voordeel?",
    ["€ 3.981,36", "€ 4.507,20", "€ 5.247,00", "€ 3.789,50"], 0,
    "Saldo: € 12.000 − € 1.400 = € 10.600 aftrek. Aftrekbaar tegen maximaal 37,56%: € 10.600 × 37,56% = € 3.981,36.", BD_EW, 'casus');
  q('hypotheek', 'hy2-023', 'Hillen', "Een klant betaalt in 2026 nog € 500 hypotheekrente; zijn eigenwoningforfait is € 1.400. Hoeveel wordt er netto bij zijn inkomen geteld?",
    ["€ 253,20", "€ 900,00", "€ 0", "€ 646,80"], 0,
    "Het verschil is € 900. In 2026 is de Hillen-aftrek 71,867% daarvan: € 646,80. Netto blijft € 900 − € 646,80 = € 253,20 belast.", BD_HILLEN, 'casus');
  q('hypotheek', 'hy2-024', 'Kosten koper', "Een belegger koopt in 2026 een woning van € 350.000 om te verhuren. Hoeveel overdrachtsbelasting betaalt hij?",
    ["€ 28.000", "€ 7.000", "€ 0", "€ 36.400"], 0,
    "De 2% geldt alleen als de koper de woning zelf als hoofdverblijf gaat bewonen. Voor verhuur geldt 8%: € 350.000 × 8% = € 28.000.", 'kosten-koper.html', 'casus');
  q('hypotheek', 'hy2-025', 'Kosten koper', "Een koper van 32 jaar koopt in 2026 voor het eerst een woning van € 560.000 om zelf te bewonen. Hoeveel overdrachtsbelasting betaalt hij?",
    ["€ 11.200", "€ 0", "€ 100 over het meerdere boven € 555.000", "€ 44.800"], 0,
    "De startersvrijstelling geldt alleen tot een woningwaarde van € 555.000. Daarboven vervalt de vrijstelling volledig en geldt 2%: € 560.000 × 2% = € 11.200.", BD_STARTER, 'casus');
  q('hypotheek', 'hy2-026', 'Bijleenregeling', "Een klant verkoopt zijn woning voor € 400.000. De verkoopkosten zijn € 8.000 en de eigenwoningschuld is € 250.000. Hoe groot is de eigenwoningreserve?",
    ["€ 142.000", "€ 150.000", "€ 158.000", "€ 400.000"], 0,
    "Eigenwoningreserve = verkoopopbrengst na kosten minus eigenwoningschuld: € 400.000 − € 8.000 − € 250.000 = € 142.000.", 'bijleenregeling.html', 'casus');
  q('hypotheek', 'hy2-027', 'Bijleenregeling', "Dezelfde klant (eigenwoningreserve € 142.000) koopt binnen de termijn een woning van € 450.000 (geen bijkomende kosten). Hoeveel kan maximaal als nieuwe eigenwoningschuld kwalificeren?",
    ["€ 308.000", "€ 450.000", "€ 250.000", "€ 200.000"], 0,
    "De eigenwoningreserve gaat af van de maximale nieuwe eigenwoningschuld: € 450.000 − € 142.000 = € 308.000. Leent hij meer, dan valt dat deel in box 3.", 'k6', 'casus');
  q('hypotheek', 'hy2-028', 'Opbouwproducten', "Wat is in 2026 het maximum van de vrijstelling voor een kapitaalverzekering, spaarrekening of beleggingsrecht eigen woning (KEW, SEW, BEW) per persoon?",
    ["€ 207.500", "€ 59.357", "€ 100.000", "€ 470.000"], 0,
    "De vrijstelling voor KEW, SEW en BEW onder overgangsrecht is in 2026 € 207.500 per persoon, mits aan de voorwaarden is voldaan.", BD_KEW, 'kennis');
  q('hypotheek', 'hy2-029', 'Opbouwproducten', "Een klant met een KEW uit 2010 wil het verzekerd kapitaal verhogen. Waar moet de adviseur op wijzen?",
    ["Een verhoging of verlenging kan het fiscale regime van het overgangsrecht aantasten", "Verhogen is altijd fiscaal gunstig", "De KEW wordt automatisch een box 1-schuld", "Er zijn geen fiscale gevolgen"], 0,
    "Bestaande KEW's vallen onder overgangsrecht. Het kapitaal of de inleg mag niet zomaar worden verhoogd en de looptijd niet zomaar verlengd. Laat de aanbieder bevestigen dat het regime behouden blijft.", 'k25', 'toepassing');
  q('hypotheek', 'hy2-030', 'Leidraad', "Een klant wil oversluiten. Het vorige advies is drie jaar geleden gegeven. Wat verwacht de AFM minimaal?",
    ["Dat je in elk geval vraagt of er relevante wijzigingen zijn in de situatie van de klant", "Dat je het oude advies ongewijzigd hergebruikt", "Dat je een volledig nieuw dossier opbouwt zonder de oude gegevens", "Niets, oversluiten is geen adviesmoment"], 0,
    "Oversluiten is een nieuw adviesmoment. Was het vorige advies minder dan vijf jaar geleden, stel dan in elk geval de checkvraag naar relevante wijzigingen. Bij meer dan vijf jaar ligt hergebruik niet voor de hand.", 'k11', 'toepassing');
  q('hypotheek', 'hy2-031', 'Leidraad', "Een klant met een hoge LTI wil een korte rentevaste periode. Hoe maakt de adviseur het renterisico volgens de leidraad concreet?",
    ["Met scenario's van bijvoorbeeld 2 en 3 procentpunt rentestijging en de gevolgen voor de maandlast", "Door de klant te verwijzen naar de rentetabel", "Door alleen de huidige maandlast te tonen", "Door een rentevaste periode van 30 jaar verplicht te stellen"], 0,
    "De AFM verwacht dat je de samenhang tussen rentevaste periode, maandlast en renterisico met scenario's bespreekt, zeker bij een hoge LTI en een korte rentevaste periode.", 'k11', 'toepassing');
  q('hypotheek', 'hy2-032', 'Leidraad', "Welke kosten neemt de adviseur volgens de leidraad mee bij het beoordelen van verantwoorde woonlasten?",
    ["Rente en aflossing, maar ook energie, belastingen, onderhoud, opstalverzekering en eventueel erfpacht", "Alleen rente en aflossing", "Alleen de bruto maandlast volgens de offerte", "Alleen de netto maandlast na renteaftrek"], 0,
    "Verantwoorde woonlasten gaan verder dan de hypotheeklast. Ook energie, belastingen, onderhoud, verzekering en erfpacht horen erbij.", 'k11', 'kennis');
  q('hypotheek', 'hy2-033', 'Leidraad', "Is een lening die binnen de Trhk-norm valt volgens de AFM automatisch passend?",
    ["Nee, bijvoorbeeld bij een hoge levensstandaard of onvoldoende pensioeninkomen kan hij te hoog zijn", "Ja, de Trhk-norm bepaalt wat passend is", "Ja, als de geldverstrekker akkoord geeft", "Alleen bij NHG-leningen"], 0,
    "De leennorm is de krediettoets van de geldverstrekker. De adviseur beoordeelt daarnaast wat voor deze klant verantwoord is.", 'k11', 'kennis');
  q('hypotheek', 'hy2-034', 'Rekenen', "Een lening van € 360.000 wordt verstrekt op een woning met een marktwaarde van € 400.000. Wat is de LTV?",
    ["90%", "111%", "36%", "10%"], 0,
    "LTV (loan to value) = lening / marktwaarde = € 360.000 / € 400.000 = 90%.", 'ltv.html', 'casus');
  q('hypotheek', 'hy2-035', 'Rekenen', "Een lineaire lening van € 300.000 heeft een looptijd van 30 jaar en een rente van 4%. Wat is de bruto maandlast in de eerste maand?",
    ["€ 1.833,33", "€ 1.432,25", "€ 1.000,00", "€ 2.000,00"], 0,
    "Aflossing: € 300.000 / 360 = € 833,33. Rente: € 300.000 × 4% / 12 = € 1.000. Samen € 1.833,33. Bij lineair daalt de last daarna elke maand.", 'maandlasten.html', 'casus');
  q('hypotheek', 'hy2-036', 'Scheiding', "Na een scheiding blijft de ex-partner in de woning wonen. Hoe lang kan de woning voor de vertrokken partner onder voorwaarden nog als eigen woning gelden?",
    ["Maximaal twee jaar", "Maximaal drie maanden", "Maximaal vijf jaar", "Tot de woning is verkocht, zonder termijn"], 0,
    "Woont de ex-partner nog in de woning, dan kan die onder voorwaarden tijdelijk, maximaal twee jaar, als eigen woning gelden voor de partner die is vertrokken.", 'k28', 'kennis');
  q('hypotheek', 'hy2-037', 'NHG', "Onder welke voorwaarde kan een partner bij een NHG-lening na een scheiding worden ontslagen uit de hoofdelijke aansprakelijkheid?",
    ["Minimaal één aanvrager blijft wonen en zet de lening voort, de vertrekker is geen eigenaar meer en er zijn geen achterstanden", "De vertrekker moet de helft van de schuld aflossen", "Dat kan bij NHG niet", "De blijver moet een ORV afsluiten"], 0,
    "Ontslag kan als de blijver de lening voortzet, de vertrekker geen eigenaar meer is en de woning heeft verlaten, en er geen achterstanden zijn. De blijver moet zelf aan de normen voldoen, met eventueel een explain.", 'k74', 'kennis');
  q('hypotheek', 'hy2-038', 'NHG', "Een klant met een restschuld van een oude NHG-lening wil die meefinancieren in een nieuwe NHG-lening. Binnen welke termijn moet het bindend aanbod zijn uitgebracht?",
    ["Binnen een jaar na het transport van de oude woning", "Binnen drie maanden", "Binnen vijf jaar", "Er geldt geen termijn"], 0,
    "Een restschuld van een oude NHG-lening mag mee als die niet bij NHG is gedeclareerd en het aanbod binnen een jaar na transport is uitgebracht. De restschuld lost annuïtair of lineair af, zo kort mogelijk.", 'k74', 'kennis');
  q('hypotheek', 'hy2-039', 'NHG', "Een klant sluit een NHG-lening zuiver over naar een andere geldverstrekker met NHG, zonder verhoging. Betaalt hij borgtochtprovisie?",
    ["Nee, bij zuiver oversluiten van NHG naar NHG zonder verhoging is geen provisie verschuldigd", "Ja, 0,4% over de hele lening", "Ja, 0,6% over de hele lening", "Ja, een vast bedrag per aanvraag"], 0,
    "Bij zuiver oversluiten volstaat een beperkte toets, wordt niet getoetst aan de NHG-grens en betaalt de klant geen borgtochtprovisie.", 'k74', 'toepassing');
  q('hypotheek', 'hy2-040', 'NHG', "Binnen hoeveel dagen na verstrekking moet de geldverstrekker een NHG-lening melden bij NHG?",
    ["14 dagen", "3 dagen", "3 maanden", "Er is geen meldtermijn"], 0,
    "De geldverstrekker meldt de lening binnen 14 dagen na verstrekking. Zonder die melding keert NHG niet uit.", 'k70', 'kennis');

  /* ================= INKOMEN ================= */
  q('inkomen', 'in2-001', 'Sociale zekerheid', "Wat is het maximumdagloon voor de WW en de WIA per 1 januari 2026?",
    ["€ 309,91 bruto per dag", "€ 270,00 bruto per dag", "€ 350,00 bruto per dag", "Er geldt geen maximum"], 0,
    "Het maximumdagloon is per 1 januari 2026 € 309,91 bruto, inclusief vakantiegeld. Boven dat loon is het inkomen niet verzekerd in WW en WIA.", UWV_DAGLOON, 'kennis');
  q('inkomen', 'in2-002', 'WW', "Een werknemer met een salaris ruim boven het maximumdagloon wordt in 2026 werkloos. Wat is zijn bruto WW-uitkering per dag in de eerste twee maanden?",
    ["€ 232,43", "€ 309,91", "€ 216,94", "75% van zijn werkelijke dagloon"], 0,
    "In de eerste twee maanden is de WW 75% van het (gemaximeerde) dagloon: € 309,91 × 75% = € 232,43. Vanaf de derde maand is het 70%: € 216,94.", UWV_DAGLOON, 'casus');
  q('inkomen', 'in2-003', 'WW', "Een werknemer heeft acht volledige kalenderjaren arbeidsverleden en voldoet aan de wekeneis. Hoe lang krijgt hij WW?",
    ["8 maanden", "3 maanden", "24 maanden", "4 maanden"], 0,
    "Voor de eerste tien jaar arbeidsverleden is de WW-duur één maand per jaar: acht maanden. Daarna telt elk jaar een halve maand. De duur is minimaal 3 en maximaal 24 maanden.", UWV_WWDUUR, 'casus');
  q('inkomen', 'in2-004', 'WIA', "Hoe hoog is de loongerelateerde WGA-uitkering als de werknemer niet werkt?",
    ["De eerste twee maanden 75% en daarna 70% van het WIA-maandloon", "Altijd 70% van het minimumloon", "75% van het laatste salaris zonder maximum", "100% van het WIA-maandloon"], 0,
    "Zonder werk is de loongerelateerde uitkering de eerste twee maanden 75% en daarna 70% van het WIA-maandloon. Werkt hij wel, dan is het 70% van het verschil tussen WIA-maandloon en huidig inkomen.", UWV_WGA, 'kennis');
  q('inkomen', 'in2-005', 'WIA', "Hoe lang duurt de loongerelateerde WGA-uitkering?",
    ["Minimaal 3 maanden en maximaal 2 jaar, afhankelijk van het arbeidsverleden", "Altijd 5 jaar", "Tot de AOW-leeftijd", "Altijd 104 weken"], 0,
    "De duur hangt af van het arbeidsverleden, net als bij de WW. Daarna volgt de loonaanvulling of de vervolguitkering.", UWV_WGA, 'kennis');
  q('inkomen', 'in2-006', 'Re-integratie', "UWV vindt dat een werkgever onvoldoende aan re-integratie heeft gedaan. Wat kan het gevolg zijn?",
    ["Een loonsanctie: de werkgever moet het loon maximaal 52 weken langer doorbetalen", "Een boete van het Kifid", "De werknemer verliest zijn recht op WIA", "Niets, re-integratie is vrijblijvend"], 0,
    "Op grond van de Wet verbetering poortwachter kan UWV de loondoorbetalingsplicht met maximaal 52 weken verlengen, zodat de werkgever de tekortkomingen kan herstellen.", 'https://www.uwv.nl/werkgevers/werknemer-is-ziek/loondoorbetaling/na-2-jaar-ziek-wia-uitkering/detail/verplicht-loon-doorbetalen', 'kennis');
  q('inkomen', 'in2-007', 'WIA', "Hoe lang draagt een werkgever die eigenrisicodrager voor de WGA is het risico van een WGA-uitkering?",
    ["Maximaal 10 jaar; daarna neemt UWV het over", "Tot de AOW-leeftijd van de werknemer", "Maximaal 2 jaar", "Levenslang"], 0,
    "Een eigenrisicodrager betaalt de WGA-uitkering en verzorgt de re-integratie maximaal tien jaar. Daarna is UWV verantwoordelijk.", UWV_ERD, 'kennis');
  q('inkomen', 'in2-008', 'WIA', "Een werknemer verdient € 110.000 per jaar. Welke verzekering vult zijn inkomen aan voor het deel boven het maximumdagloon bij arbeidsongeschiktheid?",
    ["Een WIA-excedentverzekering", "Een WGA-hiaatverzekering", "Een woonlastenverzekering", "Een ORV"], 0,
    "WIA-uitkeringen zijn gebaseerd op maximaal het maximumdagloon. Een WIA-excedentverzekering (vaak via de werkgever) dekt het loon daarboven.", 'k26', 'toepassing');
  q('inkomen', 'in2-009', 'Anw', "Wanneer heeft een nabestaande in de regel recht op een Anw-uitkering?",
    ["Als hij zorgt voor een kind jonger dan 18 of minimaal 45% arbeidsongeschikt is", "Altijd na het overlijden van de partner", "Alleen als de partner een werkgeverspensioen had", "Alleen als hij ouder is dan 50"], 0,
    "De Anw is bedoeld voor nabestaanden met een kind jonger dan 18 of die minimaal 45% arbeidsongeschikt zijn. De uitkering is inkomensafhankelijk.", SVB_ANW, 'kennis');
  q('inkomen', 'in2-010', 'Anw', "Een nabestaande ontvangt Anw omdat zij zorgt voor haar zoon. Wanneer stopt de uitkering in elk geval?",
    ["Als het jongste kind 18 wordt", "Na één jaar", "Als het kind naar de middelbare school gaat", "Nooit, de uitkering loopt tot de AOW-leeftijd"], 0,
    "De Anw stopt onder meer als het jongste kind 18 wordt, tenzij de nabestaande dan zelf minimaal 45% arbeidsongeschikt is. Houd hiermee rekening in de tekortberekening.", SVB_ANW, 'toepassing');
  q('inkomen', 'in2-011', 'ORV', "De hypotheek is € 300.000. Uit de tekortberekening blijkt dat de nabestaande maximaal € 180.000 hypotheek kan dragen. Welk verzekerd bedrag past?",
    ["€ 120.000", "€ 300.000", "€ 180.000", "€ 480.000"], 0,
    "Het af te dekken bedrag is het verschil tussen de werkelijke schuld en de schuld die bij het inkomen van de nabestaande past: € 300.000 − € 180.000 = € 120.000.", 'k27', 'casus');
  q('inkomen', 'in2-012', 'ORV', "Welk verloop van de ORV past in de regel bij een aflossingsvrij leningdeel?",
    ["Gelijkblijvend kapitaal", "Lineair dalend kapitaal", "Annuïtair dalend kapitaal", "Stijgend kapitaal"], 0,
    "Bij een aflossingsvrij leningdeel blijft de schuld gelijk. Een gelijkblijvende dekking sluit daarop aan.", 'k84', 'kennis');
  q('inkomen', 'in2-013', 'ORV', "Wie is bij een overlijdensrisicoverzekering de begunstigde?",
    ["Degene die de uitkering ontvangt", "Degene op wiens leven de verzekering loopt", "Degene die de premie betaalt", "De geldverstrekker, altijd"], 0,
    "De verzekeringnemer sluit af en betaalt, de verzekerde is degene op wiens leven de polis loopt, en de begunstigde ontvangt de uitkering.", 'k84', 'kennis');
  q('inkomen', 'in2-014', 'ORV', "Wanneer is een ORV-uitkering belast met erfbelasting op grond van artikel 13 van de Successiewet?",
    ["Voor zover de premie ten laste van het vermogen van de overledene is gekomen", "Altijd", "Nooit", "Alleen boven € 100.000"], 0,
    "Is de begunstigde zelf verzekeringnemer en premiebetaler (kruislings), dan is er in de regel geen erfrechtelijke verkrijging.", 'k84', 'kennis');
  q('inkomen', 'in2-015', 'ORV', "Een gehuwd stel in gemeenschap van goederen wil een ORV zonder erfbelasting bij uitkering. Welke route biedt de Belastingdienst?",
    ["Het besluit premiesplitsing, met een correcte vastlegging bij het afsluiten", "Er is geen route mogelijk", "De polis op naam van de geldverstrekker zetten", "De uitkering laten storten in box 3"], 0,
    "Bij een gemeenschap van goederen wordt de premie uit de gemeenschap betaald. Het besluit premiesplitsing maakt toerekening van de premie mogelijk, mits goed vastgelegd.", 'k84', 'toepassing');
  q('inkomen', 'in2-016', 'ORV', "Wat is de partnervrijstelling voor de erfbelasting in 2026, en wat vermindert die?",
    ["€ 828.035, verminderd bij een nabestaandenpensioen", "€ 26.230, verminderd bij een ORV-uitkering", "€ 828.035, nooit verminderd", "€ 59.357, verminderd bij een eigen woning"], 0,
    "De partnervrijstelling is in 2026 € 828.035. Die wordt verminderd met een deel van de waarde van nabestaandenpensioenen.", 'k84', 'kennis');
  q('inkomen', 'in2-017', 'BAZ', "Wat houdt de voorgestelde basisverzekering arbeidsongeschiktheid zelfstandigen (BAZ) volgens de rijksoverheid in grote lijnen in?",
    ["Een publieke basisdekking van ongeveer 70% van het inkomen, maximaal op minimumloonniveau, met een wachttijd van ongeveer een jaar", "Een volledige inkomensdekking zonder maximum", "Een verplichte particuliere AOV op eigen beroep", "Een verzekering die alleen geldt voor zelfstandigen met personeel"], 0,
    "Het wetsvoorstel (36.912) regelt een basisniveau. Uitvoering is volgens UWV en Belastingdienst niet eerder dan 1 januari 2030 haalbaar; voor het deel daarboven blijft eigen voorziening nodig.", 'k85', 'kennis');
  q('inkomen', 'in2-018', 'AOV', "Een zelfstandige in de tweede schijf betaalt in 2026 € 3.000 AOV-premie. Wat kost die premie hem netto ongeveer?",
    ["€ 1.873", "€ 3.000", "€ 1.127", "€ 1.515"], 0,
    "De AOV-premie is aftrekbaar. Tegen 37,56%: € 3.000 × 37,56% = € 1.127 voordeel. Netto kost de premie dus ongeveer € 1.873. Een uitkering is dan wel belast.", 'aov-tekort.html', 'casus');
  q('inkomen', 'in2-019', 'Provisieverbod', "Mag een adviseur provisie van de verzekeraar ontvangen voor bemiddeling in een arbeidsongeschiktheidsverzekering voor een consument?",
    ["Nee, inkomensverzekeringen vallen onder het provisieverbod", "Ja, zoals bij alle schadeverzekeringen", "Ja, als hij de provisie meldt op de vergelijkingskaart", "Alleen als de klant zelfstandige is"], 0,
    "Het provisieverbod geldt onder meer voor hypothecair krediet en inkomensverzekeringen. De klant betaalt de adviseur rechtstreeks.", 'k61', 'kennis');
  q('inkomen', 'in2-020', 'Ziektewet', "Een werknemer met een tijdelijk contract wordt ziek en het contract loopt tijdens de ziekte af. Wie betaalt daarna zijn uitkering?",
    ["UWV, via de Ziektewet (vangnet)", "De ex-werkgever, tot 104 weken na de eerste ziektedag", "De gemeente via de bijstand", "Niemand"], 0,
    "Wie geen werkgever meer heeft (zoals bij een afgelopen contract of tijdens WW), valt bij ziekte onder het vangnet van de Ziektewet, uitgevoerd door UWV.", 'https://www.uwv.nl', 'toepassing');
  q('inkomen', 'in2-021', 'Bijstand', "Wat is kenmerkend voor de bijstand (Participatiewet) als vangnet na de WW?",
    ["De uitkering wordt getoetst aan vermogen en partnerinkomen", "De uitkering is 70% van het laatst verdiende loon", "De uitkering wordt uitgevoerd door UWV", "Iedereen heeft recht, ongeacht vermogen"], 0,
    "Na de WW resteert alleen een vangnet dat wordt getoetst aan vermogen en inkomen van de partner. Voor het hypotheekplan betekent dat vaak een fors tekort.", 'k26', 'kennis');
  q('inkomen', 'in2-022', 'Bijstand', "Wat is de netto bijstandsnorm per maand voor een alleenstaande van 21 jaar tot de AOW-leeftijd per 1 juli 2026 (inclusief vakantiegeld)?",
    ["€ 1.419,46", "€ 1.662,16", "€ 1.139,39", "€ 2.085,00"], 0,
    "Volgens de rijksoverheid is de bijstandsnorm voor een alleenstaande per 1 juli 2026 € 1.419,46 netto per maand, inclusief vakantiegeld.", 'https://www.rijksoverheid.nl/actueel/nieuws/2026/06/11/uitkeringsbedragen-per-1-juli-2026', 'kennis');
  q('inkomen', 'in2-023', 'Ondernemer', "Welk vangnet heeft een IB-ondernemer als zijn omzet wegvalt?",
    ["Geen WW; hij moet het risico opvangen met een buffer en zijn bedrijfsvoering", "De WW, als hij lang genoeg heeft gewerkt", "De WIA", "De Ziektewet"], 0,
    "Ondernemers vallen niet onder de WW. Een wegvallende omzet is ondernemersrisico; bespreek een grotere buffer dan bij een werknemer.", 'k30', 'kennis');
  q('inkomen', 'in2-024', 'DGA', "Waarom moet je bij een dga extra aandacht hebben voor arbeidsongeschiktheid?",
    ["Een dga is vaak niet verplicht verzekerd voor de werknemersverzekeringen", "Een dga krijgt altijd een hogere WIA-uitkering", "Een dga heeft recht op een IVA zonder keuring", "De BV moet zijn loon levenslang doorbetalen"], 0,
    "Veel dga's vallen niet onder WW en WIA. Inventariseer welke eigen voorziening er is.", 'k31', 'kennis');
  q('inkomen', 'in2-025', 'Scenario', "Hoe bereken je het inkomensrisico bij arbeidsongeschiktheid van een werknemer in een hypotheekadvies?",
    ["Per partner en per fase: loondoorbetaling, WIA eerste periode en WIA vervolg", "Alleen voor de partner met het hoogste inkomen", "Alleen voor het eerste ziektejaar", "Met één gemiddeld percentage voor de hele looptijd"], 0,
    "Het inkomen daalt meestal trapsgewijs. Bereken per partner het netto inkomen per fase en vergelijk dat met de gewenste woonlast.", 'k26', 'toepassing');
  q('inkomen', 'in2-026', 'AOV', "Waarom is een broodfonds geschikt als aanvulling op een AOV met een lange wachttijd?",
    ["Het broodfonds geeft maximaal twee jaar schenkingen en overbrugt zo de wachttijd, terwijl de AOV langdurige uitval dekt", "Het broodfonds is een verzekering met een gegarandeerde uitkering tot de AOW-leeftijd", "Het broodfonds vervangt de AOV volledig", "Het broodfonds keert alleen uit bij werkloosheid"], 0,
    "Een broodfonds is geen verzekering en stopt na maximaal twee jaar. Gecombineerd met een AOV met lange eigenrisicoperiode beperkt het de premie en blijft langdurige uitval gedekt.", 'k85', 'toepassing');
  q('inkomen', 'in2-027', 'AOV', "Welk kenmerk van een AOV moet je bij een zelfstandige vergelijken met de looptijd van zijn hypotheek en zijn pensioenplanning?",
    ["De eindleeftijd van de verzekering", "De kleur van de polis", "Het aantal vestigingen van de verzekeraar", "De naam van de schadebehandelaar"], 0,
    "Eindleeftijd en verzekerd bedrag moeten passen bij de lasten, inclusief de hypotheek. Een te vroege eindleeftijd laat een gat tot de AOW-leeftijd.", 'k85', 'kennis');
  q('inkomen', 'in2-028', 'Woonlastenverzekering', "Een woonlastenverzekering keert bij werkloosheid maximaal 12 maanden uit. Het tekort van de klant duurt naar verwachting 30 maanden. Wat is je conclusie?",
    ["De polis dekt maar een deel van de periode; bespreek ook buffer, lagere lening of andere oplossingen", "De polis dekt het volledige risico", "De polis is altijd overbodig", "De klant moet een tweede woonlastenverzekering afsluiten"], 0,
    "Vergelijk de dekkingsperiode met de periode waarin het tekort niet door buffer, WW of loondoorbetaling wordt gedekt. Een uitkering van beperkte duur lost een langer tekort niet volledig op.", 'k86', 'casus');
  q('inkomen', 'in2-029', 'Loondoorbetaling', "Wanneer kan een zieke werknemer een WIA-uitkering aanvragen?",
    ["Na de wachttijd van 104 weken ziekte", "Na 52 weken ziekte", "Direct op de eerste ziektedag", "Na 6 weken ziekte"], 0,
    "Na twee jaar (104 weken) loondoorbetaling beoordeelt UWV of er recht is op WIA. Bij een loonsanctie kan dat later zijn.", 'k26', 'kennis');
  q('inkomen', 'in2-030', 'Zwangerschap', "Uit welke regeling ontvangt een werknemer een uitkering tijdens zwangerschaps- en bevallingsverlof?",
    ["De Wet arbeid en zorg (WAZO), via UWV", "De Ziektewet", "De WW", "De Anw"], 0,
    "Het zwangerschaps- en bevallingsverlof is geregeld in de Wet arbeid en zorg; UWV betaalt de uitkering, meestal via de werkgever.", 'https://www.uwv.nl', 'kennis');
  q('inkomen', 'in2-031', 'Scenario', "Een klant met een woonlastenverzekering heeft een tijdelijk contract dat over vier maanden afloopt. Waar moet je op letten?",
    ["Een aflopend tijdelijk contract is vaak uitgesloten van de werkloosheidsdekking", "Een tijdelijk contract geeft altijd recht op uitkering", "De wachttijd vervalt bij een tijdelijk contract", "Niets, de dekking is standaard"], 0,
    "Veel polissen sluiten het aflopen van een tijdelijk contract uit. Controleer dit tegen de situatie van de klant voordat je de verzekering adviseert.", 'k86', 'toepassing');
  q('inkomen', 'in2-032', 'Partnerpensioen', "Een klant stapt van loondienst over naar zelfstandig ondernemerschap. Wat gebeurt er meestal met het partnerpensioen op risicobasis uit zijn oude regeling?",
    ["Dat vervalt na een korte uitloop, waardoor het tekort bij overlijden kan stijgen", "Dat loopt ongewijzigd door tot de AOW-leeftijd", "Dat wordt automatisch omgezet in een AOV", "Dat verdubbelt"], 0,
    "Risicodekking stopt als de deelnemer niet meer deelneemt. Herbereken het ORV-advies bij de overstap naar ondernemerschap.", 'k80', 'toepassing');
  q('inkomen', 'in2-033', 'WIA', "Een werknemer is na twee jaar ziekte 85% arbeidsongeschikt, maar volgens UWV is herstel op termijn mogelijk. In welke regeling valt hij?",
    ["De WGA", "De IVA", "Geen enkele regeling", "De Wajong"], 0,
    "De IVA is alleen voor wie volledig én duurzaam arbeidsongeschikt is. Volledig arbeidsongeschikt met kans op herstel valt in de WGA.", 'k26', 'toepassing');
  q('inkomen', 'in2-034', 'Ondernemer', "Wat moet je bij een AOV-aanvraag vastleggen in het dossier?",
    ["Arbeidsongeschiktheidscriterium, wachttijd, eindleeftijd en de keuze van de klant", "Alleen de premie", "Alleen het polisnummer", "Niets, de verzekeraar bewaart alles"], 0,
    "Leg de tekortberekening, de besproken opties, de gekozen oplossing en de belangrijkste polisvoorwaarden vast, inclusief wat de klant bewust niet verzekert.", 'k85', 'praktijk');
  q('inkomen', 'in2-035', 'WW', "Wat is de bruto WW-uitkering per dag vanaf de derde maand als het dagloon € 200 is?",
    ["€ 140", "€ 150", "€ 200", "€ 120"], 0,
    "Vanaf de derde maand is de WW 70% van het dagloon: € 200 × 70% = € 140. In de eerste twee maanden is dat 75%: € 150.", 'werkloosheid.html', 'casus');
  q('inkomen', 'in2-036', 'Scenario', "Een stel heeft een buffer van € 20.000. Bij werkloosheid van de kostwinner is het netto tekort € 800 per maand gedurende 18 maanden. Kan de buffer dat opvangen?",
    ["Ja, het totale tekort is € 14.400, maar daarna is er nog maar € 5.600 buffer over; bespreek of de klant dat acceptabel vindt", "Nee, het totale tekort is € 36.000", "Nee, het totale tekort is € 20.800", "Ja, en na afloop is de buffer nog volledig intact"], 0,
    "€ 800 × 18 = € 14.400. De buffer van € 20.000 is formeel voldoende, maar er blijft € 5.600 over voor onverwachte uitgaven. Leg vast hoe de klant dit risico weegt.", 'k26', 'casus');
  q('inkomen', 'in2-037', 'ORV', "Bij een kruislingse ORV sluit partner A een polis af op het leven van partner B. Wie moet de premie betalen om erfbelasting te voorkomen?",
    ["Partner A, uit eigen middelen", "Partner B", "Beide partners samen van de gezamenlijke rekening", "De geldverstrekker"], 0,
    "Bij kruislings is de begunstigde zelf verzekeringnemer en premiebetaler. Zorg dat aantoonbaar is dat elke partner zijn eigen polis zelf betaalt.", 'k84', 'toepassing');
  q('inkomen', 'in2-038', 'Re-integratie', "Een zieke werknemer kan zijn eigen werk niet meer doen en er is bij de eigen werkgever geen passend werk. Wat moet de werkgever volgens de Wet verbetering poortwachter doen?",
    ["Ook zoeken naar passend werk bij een andere werkgever (re-integratie tweede spoor)", "Niets, de werknemer moet het zelf oplossen", "De werknemer direct ontslaan", "Direct een WIA-uitkering aanvragen"], 0,
    "Als terugkeer bij de eigen werkgever niet lukt, moet ook re-integratie bij een andere werkgever worden ingezet. Doet de werkgever te weinig, dan kan UWV een loonsanctie opleggen.", 'https://www.uwv.nl/werkgevers/werknemer-is-ziek/loondoorbetaling/na-2-jaar-ziek-wia-uitkering/detail/verplicht-loon-doorbetalen', 'kennis');

  /* ================= PENSIOEN ================= */
  q('pensioen', 'pn2-001', 'AOW', "Wat is de AOW-leeftijd in 2028?",
    ["67 jaar en 3 maanden", "67 jaar", "68 jaar", "66 jaar en 10 maanden"], 0,
    "Voor 2024 tot en met 2027 is de AOW-leeftijd 67 jaar. In 2028 is die 67 jaar en 3 maanden.", SVB_LEEFTIJD, 'kennis');
  q('pensioen', 'pn2-002', 'AOW', "Hoe ver vooruit wordt de AOW-leeftijd vastgesteld?",
    ["Vijf jaar", "Eén jaar", "Tien jaar", "Twintig jaar"], 0,
    "De AOW-leeftijd wordt vijf jaar vooruit vastgesteld, zodat mensen weten waar ze aan toe zijn. Daarna verandert hij niet meer.", 'https://www.rijksoverheid.nl/themas/belastingen-uitkeringen-en-toeslagen/algemene-ouderdomswet-aow/aow-leeftijd', 'kennis');
  q('pensioen', 'pn2-003', 'AOW', "Een alleenstaande heeft zes jaar in het buitenland gewoond en daar geen AOW opgebouwd. Wat is zijn bruto AOW per maand per 1 juli 2026 (exclusief vakantiegeld)?",
    ["€ 1.462,70", "€ 1.662,16", "€ 1.562,43", "€ 1.130,27"], 0,
    "Per niet-verzekerd jaar mist hij 2%: 6 × 2% = 12%. € 1.662,16 × 88% = € 1.462,70.", SVB_AOW, 'casus');
  q('pensioen', 'pn2-004', 'AOW', "Wat is de netto AOW per maand voor een alleenstaande per 1 juli 2026 als de loonheffingskorting wordt toegepast (exclusief vakantiegeld)?",
    ["€ 1.581,55", "€ 1.662,16", "€ 1.084,13", "€ 1.419,46"], 0,
    "Volgens de SVB is de netto AOW voor een alleenstaande met loonheffingskorting € 1.581,55 per maand (bruto € 1.662,16).", SVB_AOW, 'kennis');
  q('pensioen', 'pn2-005', 'Pijlers', "Uit welke drie pijlers bestaat het Nederlandse pensioenstelsel?",
    ["AOW, werkgeverspensioen en individuele voorzieningen zoals lijfrente", "AOW, Anw en WIA", "Sparen, beleggen en de eigen woning", "Werkgeverspensioen, bijstand en zorgtoeslag"], 0,
    "De eerste pijler is de AOW, de tweede het pensioen via de werkgever en de derde wat iemand zelf regelt, zoals lijfrente.", 'k27', 'kennis');
  q('pensioen', 'pn2-006', 'Fiscaal kader', "Wat is het maximum pensioengevend loon in 2026?",
    ["€ 137.800", "€ 79.409", "€ 100.000", "€ 159.069"], 0,
    "Voor pensioenopbouw met fiscale facilitering geldt in 2026 een maximum pensioengevend loon van € 137.800. Daarboven kan een nettopensioenregeling uitkomst bieden.", BD_MAXPG, 'kennis');
  q('pensioen', 'pn2-007', 'Fiscaal kader', "Wat is kenmerkend voor een nettopensioenregeling voor het salaris boven het maximum pensioengevend loon?",
    ["De inleg komt uit het nettoloon en de opgebouwde aanspraak is vrijgesteld in box 3", "De inleg is volledig aftrekbaar", "De uitkering is onbelast in box 1", "Alleen de werkgever kan inleggen"], 0,
    "Bij een nettopensioen is de inleg niet aftrekbaar, maar de aanspraak valt niet in box 3 en de uitkering is niet belast.", 'https://www.belastingdienst.nl', 'kennis');
  q('pensioen', 'pn2-008', 'Jaarruimte', "Een werknemer heeft in 2026 een premiegrondslag van € 40.000 en een factor A van € 1.000. Wat is zijn jaarruimte (zonder overige correcties)?",
    ["€ 5.730", "€ 12.000", "€ 11.000", "€ 6.270"], 0,
    "Jaarruimte 2026 = 30% van de premiegrondslag minus 6,27 × factor A: € 12.000 − € 6.270 = € 5.730.", BD_LEVEN2026, 'casus');
  q('pensioen', 'pn2-009', 'Jaarruimte', "Wat is de maximale jaarruimte in 2026?",
    ["€ 35.589", "€ 42.753", "€ 13.000", "€ 59.357"], 0,
    "De jaarruimte is in 2026 maximaal € 35.589. De maximale reserveringsruimte is € 42.753.", BD_LEVEN2026, 'kennis');
  q('pensioen', 'pn2-010', 'Jaarruimte', "Hoeveel bedraagt de maximale reserveringsruimte in 2026?",
    ["€ 42.753", "€ 35.589", "€ 27.192", "Er is geen maximum"], 0,
    "Met de reserveringsruimte kan onbenutte jaarruimte van eerdere jaren worden ingehaald, in 2026 tot maximaal € 42.753.", BD_LEVEN2026, 'kennis');
  q('pensioen', 'pn2-011', 'Lijfrente', "Een klant in de tweede schijf legt in 2026 € 4.000 in op een lijfrenterekening binnen zijn jaarruimte. Hoeveel belasting bespaart hij?",
    ["€ 1.502,40", "€ 1.430,00", "€ 1.980,00", "€ 4.000,00"], 0,
    "De inleg is aftrekbaar: € 4.000 × 37,56% = € 1.502,40. Over de latere uitkering betaalt hij belasting in box 1.", BD_LIJF, 'casus');
  q('pensioen', 'pn2-012', 'Lijfrente', "Wanneer moet een oudedagslijfrente uiterlijk ingaan?",
    ["Uiterlijk vijf jaar na het bereiken van de AOW-leeftijd", "Precies op de AOW-leeftijd", "Uiterlijk op 60 jaar", "Er geldt geen termijn"], 0,
    "Een fiscaal gefaciliteerde oudedagslijfrente moet uiterlijk vijf jaar na het bereiken van de AOW-leeftijd ingaan. Eerder laten ingaan kan ook.", BD_LIJF, 'kennis');
  q('pensioen', 'pn2-013', 'Wtp', "Wat betekent invaren bij de overgang naar het nieuwe pensioenstelsel?",
    ["Het collectief omzetten van opgebouwde pensioenaanspraken naar het nieuwe stelsel", "Het afkopen van kleine pensioenen", "Het overdragen van pensioen naar een lijfrente", "Het verhogen van de AOW"], 0,
    "Bij invaren worden bestaande aanspraken in de regel collectief omgezet naar de nieuwe regeling. Bij sommige fondsen is er geen individuele keuze om achter te blijven.", 'k45', 'kennis');
  q('pensioen', 'pn2-014', 'Wtp', "Een klant wil waardeoverdracht van een fonds dat al is ingevaren naar een fonds dat dat nog niet is. Wat geldt tijdens de transitie?",
    ["Waardeoverdracht werkt alleen als beide fondsen in hetzelfde stelsel zitten", "Waardeoverdracht is altijd binnen een maand geregeld", "Waardeoverdracht is in de transitie verplicht", "Het oude fonds moet het pensioen uitbetalen"], 0,
    "Oud en nieuw fonds moeten allebei al over zijn of allebei nog niet. Een overdracht kan dus tijdelijk niet mogelijk zijn of langer duren.", 'k45', 'toepassing');
  q('pensioen', 'pn2-015', 'Wtp', "Welke grote pensioenfondsen zijn per 1 januari 2026 overgestapt naar het nieuwe stelsel?",
    ["PFZW, PMT en bpfBOUW", "ABP en PME", "Alle pensioenfondsen", "Geen enkel fonds"], 0,
    "PFZW, PMT en bpfBOUW zijn per 1 januari 2026 over. ABP stapt naar verwachting per 1 januari 2027 over.", 'k45', 'praktijk');
  q('pensioen', 'pn2-016', 'Wtp', "Wat kan het gevolg zijn als een ABP-deelnemer vóór de overstap van het fonds waarde overdraagt?",
    ["Hij krijgt een eventuele extra verhoging bij de overstap niet mee", "Hij krijgt een dubbele verhoging", "Zijn pensioen wordt fiscaal belast", "Hij verliest zijn AOW"], 0,
    "ABP wijst erop dat een vroege overdracht niet vanzelf gunstig is. Vergelijk de waardeoverdrachtsofferte met achterlaten.", 'k45', 'praktijk');
  q('pensioen', 'pn2-017', 'Bedrag ineens', "Een klant wil straks het bedrag ineens (10% van zijn ouderdomspensioen) gebruiken om af te lossen. Welke gevolgen bespreek je?",
    ["De opname is belast in het jaar van opname en het jaarlijkse pensioen wordt lager", "De opname is onbelast", "Het jaarlijkse pensioen blijft gelijk", "De opname telt niet mee voor toeslagen"], 0,
    "Het bedrag ineens is belast in het opnamejaar, verlaagt het resterende pensioen en kan gevolgen hebben voor toeslagen. Het is pas vanaf 1 januari 2029 mogelijk.", 'k80', 'toepassing');
  q('pensioen', 'pn2-018', 'Wtp', "Welke premieregeling uit de Wtp kent een solidariteitsreserve om risico's tussen generaties te delen?",
    ["De solidaire premieregeling", "De flexibele premieregeling", "De AOW", "De nettopensioenregeling"], 0,
    "De solidariteitsreserve hoort bij de solidaire premieregeling, waarin collectief wordt belegd. De flexibele premieregeling kan een (vrijwillige) risicodelingsreserve hebben.", 'https://www.rijksoverheid.nl/onderwerpen/pensioen', 'kennis');
  q('pensioen', 'pn2-019', 'Uitvoerders', "Wat is kenmerkend voor een premiepensioeninstelling (PPI)?",
    ["Zij voert premieregelingen uit en mag zelf geen verzekeringsrisico's zoals overlijdensrisico dragen", "Zij voert alleen uitkeringsregelingen uit", "Zij is een bedrijfstakpensioenfonds met verplichte deelname", "Zij keert de AOW uit"], 0,
    "Een PPI beheert de opbouw in premieregelingen. Risicodekkingen, zoals partnerpensioen op risicobasis, moeten bij een verzekeraar worden ondergebracht.", 'https://www.dnb.nl', 'kennis');
  q('pensioen', 'pn2-020', 'Pensioenoverzicht', "Waar ziet een klant een overzicht van zijn opgebouwde AOW en werkgeverspensioenen bij elkaar?",
    ["Op mijnpensioenoverzicht.nl", "In het BKR", "Bij het Kifid", "In het AFM-register"], 0,
    "Mijnpensioenoverzicht.nl toont AOW en de pensioenen bij de verschillende uitvoerders. Gebruik een actuele opgave, zeker na invaren.", 'k80', 'kennis');
  q('pensioen', 'pn2-021', 'Scheiding', "Een stel scheidt. Op welk pensioen heeft de ex-partner standaard recht dat tijdens het huwelijk is opgebouwd voor het geval de ander overlijdt?",
    ["Het bijzonder partnerpensioen", "De AOW-partnertoeslag", "Het wezenpensioen", "Een Anw-uitkering"], 0,
    "Het partnerpensioen dat tijdens het huwelijk is opgebouwd, wordt bij scheiding in de regel bijzonder partnerpensioen voor de ex-partner.", 'https://www.rijksoverheid.nl/onderwerpen/pensioen', 'kennis');
  q('pensioen', 'pn2-022', 'DGA', "Wat is er per 1 juli 2017 veranderd voor pensioen in eigen beheer van een dga?",
    ["De opbouw is beëindigd; bestaande aanspraken zijn bevroren, afgekocht of omgezet in een oudedagsverplichting", "De opbouw is verdubbeld", "Pensioen in eigen beheer is verplicht geworden", "Alle aanspraken zijn naar het ABP overgedragen"], 0,
    "Sinds 1 juli 2017 kan geen pensioen in eigen beheer meer worden opgebouwd. Vraag na welke keuze de dga heeft gemaakt.", 'k31', 'kennis');
  q('pensioen', 'pn2-023', 'Ondernemer', "Kan een IB-ondernemer in 2026 nog toevoegen aan de fiscale oudedagsreserve (FOR)?",
    ["Nee, sinds 2023 kan de FOR niet meer worden opgebouwd", "Ja, tot 9,44% van de winst", "Ja, onbeperkt", "Alleen als hij ouder is dan 55"], 0,
    "De FOR kan sinds 2023 niet meer worden opgebouwd. Een bestaande reserve blijft onder voorwaarden staan; pensioen opbouwen kan via lijfrente binnen de jaarruimte.", 'k30', 'kennis');
  q('pensioen', 'pn2-024', 'AOW en belasting', "Waarom is het tarief in de eerste schijf voor iemand met AOW-leeftijd lager (17,85% in 2026)?",
    ["Omdat hij geen AOW-premie meer betaalt", "Omdat AOW onbelast is", "Omdat hij geen heffingskortingen krijgt", "Omdat zijn inkomen in box 3 valt"], 0,
    "Het tarief in de eerste schijf bevat premies volksverzekeringen. Vanaf de AOW-leeftijd vervalt de AOW-premie, waardoor het tarief lager is.", BD_BOX1, 'kennis');
  q('pensioen', 'pn2-025', 'AOW en belasting', "Wat is de maximale ouderenkorting in 2026, en vanaf welk verzamelinkomen wordt die afgebouwd?",
    ["€ 2.067, afbouw vanaf € 46.002", "€ 3.115, afbouw vanaf € 29.736", "€ 540, geen afbouw", "€ 1.556, afbouw vanaf € 78.426"], 0,
    "De ouderenkorting is in 2026 maximaal € 2.067 en wordt afgebouwd vanaf een verzamelinkomen van € 46.002. Alleenstaanden krijgen daarnaast € 540 alleenstaande-ouderenkorting.", BD_KORT, 'kennis');
  q('pensioen', 'pn2-026', 'Werkgeverspensioen', "Is een werkgever in Nederland altijd verplicht een pensioenregeling aan te bieden?",
    ["Nee, tenzij hij onder een verplicht bedrijfstakpensioenfonds valt of het in de cao of arbeidsovereenkomst is afgesproken", "Ja, iedere werkgever", "Ja, vanaf vijf werknemers", "Nee, pensioen is altijd een zaak van de werknemer zelf"], 0,
    "Er is geen algemene wettelijke plicht. Wel kan deelname verplicht zijn via een bedrijfstakpensioenfonds of zijn afgesproken in cao of arbeidsovereenkomst.", 'k30', 'kennis');
  q('pensioen', 'pn2-027', 'Partnerpensioen', "Ongehuwd samenwonenden willen zeker weten dat het partnerpensioen naar de partner gaat. Wat is belangrijk?",
    ["Aanmelding bij de pensioenuitvoerder en vaak een (notarieel) samenlevingscontract", "Niets, samenwonenden zijn automatisch verzekerd", "Een testament is voldoende", "Een gezamenlijke bankrekening"], 0,
    "Een samenlevingscontract kan de partneraanwijzing voor het partnerpensioen regelen. Controleer bij de uitvoerder welke voorwaarden gelden.", 'k28', 'toepassing');
  q('pensioen', 'pn2-028', 'Pensioen en hypotheek', "Een klant van 45 vraagt een hypotheek met een looptijd van 30 jaar. Wat verwacht de AFM over pensioen?",
    ["Dat je de betaalbaarheid na pensionering bespreekt, ook al ligt die nog meer dan tien jaar weg", "Dat je pensioen pas bespreekt vanaf vijf jaar voor de AOW-leeftijd", "Dat je pensioen buiten beschouwing laat", "Dat je de looptijd beperkt tot de AOW-leeftijd"], 0,
    "Volgens de leidraad van april 2026 onderzoek je de betaalbaarheid na pensionering, ook als de pensioendatum nog ver weg is.", 'k27', 'toepassing');
  q('pensioen', 'pn2-029', 'Wtp', "Een klant met twee werkgevers heeft een regeling die al is ingevaren en een die dat nog niet is. Wat is juist?",
    ["Oude en nieuwe regelingen kunnen naast elkaar bestaan; vraag per regeling de status en de actuele opgave op", "Alle regelingen worden automatisch tegelijk ingevaren", "De oudste regeling vervalt", "Hij moet kiezen voor één regeling"], 0,
    "Fondsen stappen op verschillende momenten over. Vraag per werkgever na of de regeling al is ingevaren en noteer de datum.", 'k80', 'toepassing');
  q('pensioen', 'pn2-030', 'AOW', "Een alleenstaande ontvangt per 1 juli 2026 € 1.662,16 bruto AOW per maand en bouwt daarnaast € 104,78 bruto vakantiegeld per maand op. Hoeveel bruto AOW ontvangt hij per jaar, inclusief vakantiegeld?",
    ["€ 21.203,28", "€ 19.945,92", "€ 1.766,94", "€ 20.050,70"], 0,
    "Per maand is dat € 1.662,16 + € 104,78 = € 1.766,94. Op jaarbasis: € 1.766,94 × 12 = € 21.203,28. Voor samenwonenden is het vakantiegeld € 74,85 per persoon per maand.", SVB_AOW, 'casus');
  q('pensioen', 'pn2-031', 'Fiscaal kader', "Wat is de fiscale pensioenrichtleeftijd die NHG in 2026 noemt bij de toets tussen AOW-leeftijd en pensioendatum?",
    ["68 jaar", "65 jaar", "67 jaar", "70 jaar"], 0,
    "NHG noemt de wettelijke pensioenrichtleeftijd van 68 jaar. Is het toetsinkomen tussen AOW-leeftijd en die leeftijd tijdelijk te laag, dan mag ander inkomen onder voorwaarden meetellen.", 'k71', 'kennis');
  q('pensioen', 'pn2-032', 'Pensioen', "Wat is een Anw-hiaatverzekering?",
    ["Een verzekering die een uitkering geeft aan de nabestaande als er geen of een lagere Anw-uitkering is", "Een verzekering die het AOW-gat bij buitenlandse jaren dekt", "Een verzekering tegen werkloosheid", "Een spaarrekening voor pensioen"], 0,
    "De Anw kent strenge voorwaarden. Een Anw-hiaatverzekering (vaak aangeboden via de pensioenregeling) vult het gat als die uitkering ontbreekt.", 'k27', 'kennis');
  q('pensioen', 'pn2-033', 'Wtp', "Sinds wanneer geldt de Wet toekomst pensioenen (Wtp)?",
    ["Sinds 1 juli 2023", "Sinds 1 januari 2013", "Sinds 1 januari 2026", "Sinds 1 juli 2017"], 0,
    "De Wtp geldt sinds 1 juli 2023. Regelingen moeten uiterlijk 1 januari 2028 zijn overgegaan naar het nieuwe stelsel.", 'k120', 'kennis');
  q('pensioen', 'pn2-034', 'Partnerpensioen', "De klant gaat bij PMT werken en draagt zijn oude pensioen over naar PMT. Waar moet de adviseur op letten?",
    ["Een partnerpensioen bij overlijden vóór pensioen bij de vorige uitvoerder kan dan vervallen", "Het partnerpensioen verdubbelt automatisch", "Waardeoverdracht heeft nooit gevolgen voor de nabestaandendekking", "PMT keert alleen AOW uit"], 0,
    "Bij PMT vervalt een partnerpensioen bij overlijden vóór pensioen bij de vorige uitvoerder na overdracht. Herbereken de nabestaandendekking.", 'k45', 'praktijk');
  q('pensioen', 'pn2-035', 'Lijfrente', "Waarvoor dient een nabestaandenlijfrente?",
    ["Een periodieke uitkering aan de partner of kinderen na het overlijden van de verzekerde", "Een uitkering aan de verzekerde zelf vanaf de AOW-leeftijd", "Een eenmalige uitkering voor de uitvaart", "Een aanvulling op de WW"], 0,
    "Een nabestaandenlijfrente zorgt voor periodiek inkomen voor nabestaanden. Onder voorwaarden is de premie aftrekbaar en is de uitkering belast in box 1.", BD_LIJF, 'kennis');
  q('pensioen', 'pn2-036', 'AOW', "Hoeveel AOW-opbouw mist iemand die tussen zijn 17e en de AOW-leeftijd vijf jaar niet verzekerd was?",
    ["10%", "5%", "2%", "20%"], 0,
    "De AOW wordt in 50 jaar opgebouwd, 2% per verzekerd jaar. Vijf niet-verzekerde jaren betekenen 10% minder AOW.", SVB_AOW, 'casus');
  q('pensioen', 'pn2-037', 'Werkgeverspensioen', "Een werknemer gaat uit dienst en treedt niet in dienst bij een werkgever met dezelfde uitvoerder. Wat gebeurt er met zijn opgebouwde pensioen?",
    ["Het blijft als premievrije aanspraak staan bij de oude uitvoerder, tenzij hij waardeoverdracht regelt", "Het vervalt", "Het wordt direct uitbetaald", "Het wordt omgezet in AOW"], 0,
    "Opgebouwd pensioen blijft staan. Waardeoverdracht naar de nieuwe uitvoerder is een keuze die je per situatie afweegt; let ook op de nabestaandendekking.", 'k45', 'kennis');
  q('pensioen', 'pn2-038', 'AOW', "Kan een klant zijn AOW eerder laten ingaan dan de AOW-leeftijd?",
    ["Nee, de AOW gaat in op de AOW-leeftijd; eerder stoppen met werken moet hij zelf of via zijn pensioen overbruggen", "Ja, tot vijf jaar eerder met een korting", "Ja, als hij 45 jaar heeft gewerkt", "Ja, op verzoek bij de SVB"], 0,
    "De AOW kan niet eerder ingaan. Wie eerder stopt, overbrugt die periode met eigen middelen, een overbruggingslijfrente of vervroegd werkgeverspensioen.", SVB_LEEFTIJD, 'toepassing');
  q('pensioen', 'pn2-039', 'Werkgeverspensioen', "Wat mag een pensioenuitvoerder doen met een heel klein ouderdomspensioen van een gewezen deelnemer?",
    ["Het onder voorwaarden afkopen, als het onder de wettelijke afkoopgrens ligt", "Het altijd laten vervallen", "Het omzetten in een WW-uitkering", "Het overboeken naar de AOW"], 0,
    "De Pensioenwet staat afkoop van kleine pensioenen onder een jaarlijks vastgestelde grens toe. De afkoopsom is belast in box 1.", 'https://www.rijksoverheid.nl/onderwerpen/pensioen', 'kennis');

  /* ================= VERMOGEN ================= */
  q('vermogen', 'vm2-001', 'Box 3', "Een alleenstaande heeft op 1 januari 2026 € 80.000 aan banktegoeden en geen andere bezittingen of schulden. Hoeveel box 3-belasting betaalt hij (met het voorlopige forfait 1,28%)?",
    ["€ 95,12", "€ 368,64", "€ 264,23", "€ 7.431,48"], 0,
    "Forfaitair rendement: € 80.000 × 1,28% = € 1.024 (rendementspercentage 1,28%). Grondslag: € 80.000 − € 59.357 = € 20.643. Voordeel: € 20.643 × 1,28% = € 264,23. Belasting 36%: € 95,12.", BD_BOX3, 'casus');
  q('vermogen', 'vm2-002', 'Box 3', "Een alleenstaande heeft op 1 januari 2026 € 20.000 spaargeld en € 100.000 aan beleggingen. Wat is het forfaitaire rendement over zijn bezittingen?",
    ["€ 6.256", "€ 7.200", "€ 1.536", "€ 6.000"], 0,
    "Banktegoeden: € 20.000 × 1,28% = € 256. Overige bezittingen: € 100.000 × 6,00% = € 6.000. Samen € 6.256.", BD_BOX3, 'casus');
  q('vermogen', 'vm2-003', 'Box 3', "Vervolg: dezelfde klant (bezittingen € 120.000, rendement € 6.256) heeft een grondslag van € 60.643. Hoeveel box 3-belasting betaalt hij ongeveer?",
    ["€ 1.138", "€ 2.252", "€ 3.162", "€ 2.183"], 0,
    "Het rendementspercentage is € 6.256 / € 120.000 = 5,2133%. Voordeel: € 60.643 × 5,2133% = € 3.161,52. Belasting 36%: € 1.138,15.", BD_BOX3, 'casus');
  q('vermogen', 'vm2-004', 'Box 3', "Fiscale partners hebben samen € 100.000 spaargeld. Hoeveel heffingsvrij vermogen kunnen zij samen gebruiken in 2026?",
    ["€ 118.714", "€ 59.357", "€ 100.000", "€ 57.684"], 0,
    "Het heffingsvrij vermogen is € 59.357 per persoon; fiscale partners hebben samen € 118.714. Met € 100.000 spaargeld betalen zij geen box 3-belasting.", BD_BOX3, 'toepassing');
  q('vermogen', 'vm2-005', 'Box 2', "Een dga zonder fiscale partner keert in 2026 € 100.000 dividend uit. Hoeveel box 2-belasting is verschuldigd?",
    ["€ 26.525,21", "€ 24.500,00", "€ 31.000,00", "€ 36.000,00"], 0,
    "Tot € 68.843 geldt 24,5% = € 16.866,54. Over € 31.157 geldt 31% = € 9.658,67. Samen € 26.525,21.", BD_BOX2, 'casus');
  q('vermogen', 'vm2-006', 'Vennootschapsbelasting', "Een BV heeft in 2026 een belastbare winst van € 250.000. Hoeveel vennootschapsbelasting is verschuldigd?",
    ["€ 50.900", "€ 47.500", "€ 64.500", "€ 64.000"], 0,
    "Tot € 200.000 geldt 19% = € 38.000. Over € 50.000 geldt 25,8% = € 12.900. Samen € 50.900.", BD_VPB, 'casus');
  q('vermogen', 'vm2-007', 'Schenken', "Hoeveel mogen ouders in 2026 per jaar belastingvrij schenken aan een kind (gewone jaarlijkse vrijstelling)?",
    ["€ 6.908", "€ 2.658", "€ 26.230", "€ 31.813"], 0,
    "De jaarlijkse schenkvrijstelling voor kinderen is in 2026 € 6.908.", BD_SCHENKKIND, 'kennis');
  q('vermogen', 'vm2-008', 'Schenken', "Ouders schenken in 2026 € 50.000 aan hun kind, zonder gebruik van een eenmalige verhoogde vrijstelling. Hoeveel schenkbelasting betaalt het kind?",
    ["€ 4.309,20", "€ 5.000,00", "€ 8.618,40", "€ 0"], 0,
    "€ 50.000 − € 6.908 = € 43.092 belast. Dat valt in de eerste schijf (10%): € 4.309,20.", BD_SCHENK, 'casus');
  q('vermogen', 'vm2-009', 'Erven', "Een weduwe erft in 2026 € 900.000 van haar echtgenoot en ontvangt geen nabestaandenpensioen. Hoeveel erfbelasting betaalt zij?",
    ["€ 7.196,50", "€ 0", "€ 90.000,00", "€ 14.393,00"], 0,
    "€ 900.000 − € 828.035 partnervrijstelling = € 71.965 belast tegen 10%: € 7.196,50.", BD_ERF, 'casus');
  q('vermogen', 'vm2-010', 'Erven', "Een kind erft in 2026 € 200.000 van een ouder. Hoeveel erfbelasting is verschuldigd?",
    ["€ 18.887,10", "€ 17.377,00", "€ 20.000,00", "€ 34.754,00"], 0,
    "Belast: € 200.000 − € 26.230 = € 173.770. Tot € 158.669 geldt 10% (€ 15.866,90), over € 15.101 geldt 20% (€ 3.020,20). Samen € 18.887,10.", BD_ERF, 'casus');
  q('vermogen', 'vm2-011', 'Schenken', "Bestaat in 2026 nog de verhoogde eenmalige schenkvrijstelling voor de eigen woning?",
    ["Nee, die bestaat sinds 1 januari 2024 niet meer", "Ja, tot € 100.000", "Ja, maar alleen voor starters", "Ja, zonder maximum"], 0,
    "De verhoogde eenmalige vrijstelling voor de eigen woning is per 1 januari 2024 afgeschaft.", 'k29', 'kennis');
  q('vermogen', 'vm2-012', 'Beleggen', "Wat is het belangrijkste verschil tussen een aandeel en een obligatie?",
    ["Een aandeel is een bewijs van eigendom in een onderneming; een obligatie is een lening aan de uitgever", "Een obligatie is altijd risicovrij", "Een aandeel geeft recht op een vaste rente", "Er is geen verschil"], 0,
    "De aandeelhouder deelt in winst en verlies. De obligatiehouder heeft een vordering met in de regel een vaste couponrente, maar loopt wel debiteuren- en renterisico.", 'k24', 'kennis');
  q('vermogen', 'vm2-013', 'Beleggen', "Een obligatie heeft een nominale waarde van € 1.000 en een coupon van 3%. Hoeveel rente ontvangt de belegger per jaar?",
    ["€ 30", "€ 3", "€ 300", "Dat hangt alleen af van de beurskoers"], 0,
    "De coupon wordt berekend over de nominale waarde: € 1.000 × 3% = € 30, ongeacht de beurskoers.", 'k24', 'casus');
  q('vermogen', 'vm2-014', 'Beleggen', "Welke obligatie reageert in de regel het sterkst op een verandering van de marktrente?",
    ["Een obligatie met een lange resterende looptijd", "Een obligatie die over drie maanden afloopt", "Een spaarrekening", "Een obligatie met variabele rente die elk kwartaal wordt aangepast"], 0,
    "Hoe langer de resterende looptijd (duration), hoe gevoeliger de koers voor renteveranderingen.", 'k24', 'kennis');
  q('vermogen', 'vm2-015', 'Beleggen', "Een aandeel stijgt in een jaar van € 50 naar € 55 en keert € 1 dividend uit. Wat is het totale rendement?",
    ["12%", "10%", "2%", "11%"], 0,
    "Koerswinst € 5 plus dividend € 1 = € 6 op een inleg van € 50, dus 12%.", 'k24', 'casus');
  q('vermogen', 'vm2-016', 'Beleggen', "Wat is een indextracker (ETF)?",
    ["Een beursgenoteerd fonds dat de samenstelling van een index volgt", "Een spaarrekening met een vaste rente", "Een obligatie van de overheid", "Een fonds waarin de beheerder probeert de index te verslaan door actief te selecteren"], 0,
    "Een ETF wordt op de beurs verhandeld en volgt een index. De kosten zijn meestal lager dan bij actief beheerde fondsen; het marktrisico blijft.", 'k24', 'kennis');
  q('vermogen', 'vm2-017', 'Beleggen', "Welke maatstaf wordt vaak gebruikt om de beweeglijkheid (het risico) van een belegging uit te drukken?",
    ["De standaarddeviatie van het rendement", "Het dividendrendement", "De nominale waarde", "Het aantal aandeelhouders"], 0,
    "De standaarddeviatie laat zien hoe sterk rendementen rond het gemiddelde schommelen. Hoe hoger, hoe beweeglijker de belegging.", 'k24', 'kennis');
  q('vermogen', 'vm2-018', 'Rekenen', "Bij ongeveer welk jaarlijks rendement verdubbelt een vermogen in circa twaalf jaar (met rente op rente)?",
    ["6%", "12%", "3%", "8,33%"], 0,
    "Met de vuistregel van 72: 72 / 6 = 12 jaar. Zonder rente op rente zou het ruim 8% per jaar vragen.", 'rekentools.html', 'casus');
  q('vermogen', 'vm2-019', 'Rekenen', "Een belegging rendeert nominaal 5% terwijl de inflatie 3% is. Wat is het reële rendement bij benadering?",
    ["2%", "8%", "5%", "1,67%"], 0,
    "Reëel rendement is bij benadering het nominale rendement minus de inflatie: 5% − 3% = ongeveer 2% (exact 1,94%).", 'https://www.cbs.nl', 'casus');
  q('vermogen', 'vm2-020', 'MiFID', "Wat moet een beleggingsonderneming een niet-professionele klant bij beleggingsadvies verstrekken vóór de transactie?",
    ["Een geschiktheidsverklaring waarin staat waarom het advies past", "Alleen een factuur", "Een vergelijkingskaart hypotheken", "Een BKR-overzicht"], 0,
    "Onder MiFID II moet bij advies aan een niet-professionele klant vóór de transactie een geschiktheidsverklaring worden verstrekt die uitlegt hoe het advies aansluit bij de klant.", 'https://www.afm.nl', 'kennis');
  q('vermogen', 'vm2-021', 'Dienstverlening', "Wat is het verschil tussen vermogensbeheer en beleggingsadvies?",
    ["Bij vermogensbeheer neemt de beheerder de beleggingsbeslissingen; bij advies beslist de klant zelf", "Bij beleggingsadvies beslist de adviseur altijd", "Er is geen verschil", "Vermogensbeheer is alleen voor pensioenfondsen"], 0,
    "Bij vermogensbeheer belegt de beheerder binnen het afgesproken profiel. Bij advies krijgt de klant aanbevelingen en beslist hij zelf.", 'https://www.afm.nl', 'kennis');
  q('vermogen', 'vm2-022', 'Afweging', "Een klant met dure consumptieve schulden en weinig buffer wil gaan beleggen. Wat is volgens het afwegingskader de logische volgorde?",
    ["Eerst een buffer en dure schulden aflossen, daarna pas beleggen", "Direct alles beleggen voor het hoogste rendement", "Eerst extra aflossen op de hypotheek, ongeacht de buffer", "Beleggen met geleend geld"], 0,
    "Begin met een voldoende buffer. Dure schulden zoals consumptief krediet gaan meestal voor. Pas daarna kijk je naar doelen, horizon en risicobereidheid.", 'k24', 'toepassing');
  q('vermogen', 'vm2-023', 'Afweging', "Een klant betaalt 4% hypotheekrente in box 1 en valt in de tweede schijf. Wat is zijn netto rente bij benadering?",
    ["2,50%", "4,00%", "1,50%", "3,25%"], 0,
    "Netto rente ≈ 4% × (1 − 37,56%) = 2,50%. Levert sparen netto minder op, dan kost sparen in plaats van aflossen geld, maar het geeft wel flexibiliteit.", 'extra-aflossen.html', 'casus');
  q('vermogen', 'vm2-024', 'Box 3', "Wat is de stand van de Wet werkelijk rendement box 3 per oktober 2026?",
    ["Aangenomen door de Tweede Kamer; de Eerste Kamer heeft de stemming aangehouden, het kabinet mikt op 1 januari 2028", "In werking sinds 1 januari 2026", "Ingetrokken", "Alleen van toepassing op beleggingen boven € 1 miljoen"], 0,
    "De Eerste Kamer hield de stemming op 30 juni 2026 aan in afwachting van een novelle. Reken in adviezen niet vooruit met het nieuwe stelsel en benoem de onzekerheid.", 'k120', 'kennis');
  q('vermogen', 'vm2-025', 'Box 3', "Een klant heeft naast zijn eigen woning een vakantiewoning in Nederland voor eigen gebruik. Waar valt die vakantiewoning fiscaal?",
    ["In box 3", "In box 1, net als de eigen woning", "In box 2", "Nergens, eigen gebruik is vrijgesteld"], 0,
    "Alleen het hoofdverblijf is eigen woning in box 1. Een tweede woning of vakantiewoning is een bezitting in box 3.", 'k91', 'toepassing');
  q('vermogen', 'vm2-026', 'Familielening', "Ouders lenen hun kind geld voor de eigen woning. Wat moet het kind doen voor renteaftrek?",
    ["Een zakelijke, schriftelijke lening met aflossingsschema afsluiten en de gegevens van de lening doorgeven aan de Belastingdienst", "Niets, renteaftrek volgt automatisch", "De lening laten registreren bij BKR", "De ouders laten schenken in plaats van lenen"], 0,
    "Een familielening kan eigenwoningschuld zijn als aan de voorwaarden wordt voldaan, waaronder de aflossingseis, een zakelijke rente en de informatieplicht aan de Belastingdienst. Bij de ouders valt de vordering in box 3.", 'k95', 'toepassing');
  q('vermogen', 'vm2-027', 'Beleggen', "Hoe werkt de Nederlandse dividendbelasting voor een particuliere belegger?",
    ["Er wordt 15% ingehouden als voorheffing, die hij kan verrekenen met zijn inkomstenbelasting", "Er wordt 36% ingehouden als eindheffing", "Dividend is onbelast", "Hij betaalt alleen box 2-belasting"], 0,
    "Nederlandse vennootschappen houden 15% dividendbelasting in. Voor een particulier in box 3 is dat een voorheffing die hij met zijn inkomstenbelasting kan verrekenen.", 'https://www.belastingdienst.nl', 'kennis');
  q('vermogen', 'vm2-028', 'Kosten', "Twee fondsen behalen hetzelfde brutorendement. Fonds A heeft 1,5% lopende kosten, fonds B 0,2%. Wat is het effect over twintig jaar?",
    ["Het verschil in eindvermogen wordt door rente op rente steeds groter", "Er is geen verschil, kosten worden aan het eind terugbetaald", "Het verschil is precies 1,3% van de inleg", "Fonds A heeft altijd een hoger rendement"], 0,
    "Kosten verlagen elk jaar het netto rendement. Door rente op rente groeit het verschil in eindvermogen over lange periodes aanzienlijk.", 'k24', 'toepassing');
  q('vermogen', 'vm2-029', 'Risicoprofiel', "Een klant zegt veel risico te willen lopen, maar heeft het vermogen over drie jaar nodig voor een verbouwing en geen andere buffer. Welk profiel past?",
    ["Een defensief profiel of sparen, omdat zijn risicodraagvermogen en horizon beperkt zijn", "Een zeer offensief profiel, omdat hij dat wil", "Beleggen met geleend geld", "Alleen aandelen in opkomende markten"], 0,
    "Het advies moet passen bij zowel de risicobereidheid als het risicodraagvermogen en de horizon. Een korte horizon met een vast doel vraagt om weinig risico.", 'k24', 'casus');
  q('vermogen', 'vm2-030', 'Vermogensopbouw', "Een klant overweegt fors extra af te lossen. Welk nadeel bespreek je?",
    ["Het geld zit vast in de woning en is alleen via opnieuw lenen terug te krijgen", "Hij betaalt daardoor meer rente", "Hij verliest zijn eigenwoningforfait", "Hij moet extra overdrachtsbelasting betalen"], 0,
    "Aflossen levert een zeker rendement gelijk aan de netto rente, maar maakt het geld illiquide. Bespreek ook de bijleenregeling en de Hillen-afbouw.", 'k24', 'kennis');
  q('vermogen', 'vm2-031', 'Testament', "Wat kan een klant met een testament regelen dat de wettelijke regels niet regelen?",
    ["Onder meer een executeur of bewind aanwijzen, legaten toekennen en een ongehuwde partner beschermen", "Het eigenwoningforfait verlagen", "De erfbelastingtarieven verlagen", "De AOW-leeftijd vervroegen"], 0,
    "Met een testament (opgesteld door een notaris) kan de klant afwijken van het wettelijk erfrecht en bijvoorbeeld een samenwonende partner tot erfgenaam benoemen.", 'k29', 'kennis');
  q('vermogen', 'vm2-032', 'DGA', "Wat regelt de regeling voor excessief lenen bij de eigen vennootschap (sinds 2023)?",
    ["Schulden van een aanmerkelijkbelanghouder aan zijn BV boven een drempel worden belast als inkomen in box 2; eigenwoningschulden vallen onder voorwaarden buiten de drempel", "Een dga mag niet meer lenen van zijn BV", "Alle leningen van de BV zijn onbelast", "Leningen van de BV vallen in box 1"], 0,
    "Boven de drempel wordt het meerdere als regulier voordeel in box 2 belast. Gebruik de actuele drempel van de Belastingdienst.", 'k31', 'kennis');
  q('vermogen', 'vm2-033', 'Box 3', "Een alleenstaande heeft € 10.000 consumptieve schuld en verder alleen spaargeld. Voor welk bedrag telt de schuld mee in box 3 (2026)?",
    ["€ 6.200", "€ 10.000", "€ 0", "€ 3.800"], 0,
    "Schulden tellen mee voor zover ze boven de drempel van € 3.800 per persoon uitkomen: € 10.000 − € 3.800 = € 6.200.", BD_BOX3, 'casus');
  q('vermogen', 'vm2-034', 'Box 3', "Waarom valt de eigen woning (hoofdverblijf) niet in box 3?",
    ["Omdat die in box 1 wordt belast via het eigenwoningforfait", "Omdat woningen nooit belast worden", "Omdat de WOZ-waarde te laag is", "Omdat de hypotheek hoger is dan de waarde"], 0,
    "De eigen woning valt in box 1: het eigenwoningforfait wordt bijgeteld en de rente op de eigenwoningschuld is aftrekbaar. Een box 3-schuld voor de woning valt wel in box 3.", BD_EW, 'kennis');
  q('vermogen', 'vm2-035', 'Beleggen', "Wat houdt valutarisico in bij een belegging in Amerikaanse aandelen voor een belegger in euro's?",
    ["Een daling van de dollar ten opzichte van de euro verlaagt het rendement in euro's", "Het risico dat de onderneming failliet gaat", "Het risico dat de rente stijgt", "Er is geen valutarisico bij beursgenoteerde aandelen"], 0,
    "Het rendement in euro's hangt ook af van de wisselkoers. Daalt de dollar, dan is de belegging in euro's minder waard.", 'k24', 'kennis');
  q('vermogen', 'vm2-036', 'Beleggen', "Wat is het verschil tussen systematisch risico en specifiek (niet-systematisch) risico?",
    ["Specifiek risico kun je wegspreiden, systematisch (markt)risico niet", "Systematisch risico kun je volledig wegspreiden", "Beide zijn met spreiding volledig te elimineren", "Specifiek risico geldt alleen voor obligaties"], 0,
    "Het risico van één onderneming kun je verkleinen door te spreiden. Het risico van de markt als geheel blijft bestaan.", 'k24', 'kennis');
  q('vermogen', 'vm2-037', 'Schenken', "Een ouder schenkt het kind geld voor de woning. Waar let de adviseur op?",
    ["De bijleenregeling en de vraag of de schenking privé blijft binnen het huwelijksgoederenregime", "Alleen of de schenking in contanten wordt gedaan", "Of de schenking hoger is dan de NHG-grens", "Niets, een schenking heeft geen gevolgen"], 0,
    "Een schenking verlaagt de benodigde lening. Houd rekening met de bijleenregeling en leg vast of de schenking privé blijft (uitsluitingsclausule).", 'k29', 'toepassing');
  q('vermogen', 'vm2-038', 'Beleggen', "Wat is een beleggingsfonds met een open-end-structuur?",
    ["Een fonds dat dagelijks nieuwe deelnemingsrechten kan uitgeven en inkopen, zodat de koers dicht bij de intrinsieke waarde blijft", "Een fonds met een vast aantal aandelen dat nooit verandert", "Een fonds dat alleen in vastgoed belegt", "Een spaarrekening met variabele rente"], 0,
    "Bij een open-end fonds kan het aantal deelnemingsrechten meebewegen met vraag en aanbod. Daardoor wijkt de koers weinig af van de intrinsieke waarde.", 'https://www.afm.nl', 'kennis');

  /* ================= CONSUMPTIEF KREDIET ================= */
  q('krediet', 'kr2-001', 'Kredietvergoeding', "Wat is de maximale kredietvergoeding voor consumptief krediet per 1 januari 2026?",
    ["12% per jaar", "14% per jaar", "10% per jaar", "15% per jaar"], 0,
    "Het maximum is de wettelijke rente plus 8 procentpunt. De wettelijke rente voor niet-handelstransacties is sinds 1 januari 2026 4%, dus het maximum is 12%.", AFM_MAXRENTE, 'kennis');
  q('krediet', 'kr2-002', 'Kredietvergoeding', "Een consument heeft een opgenomen kredietbedrag van € 5.000 en de kredietgever rekent het wettelijk maximum van 2026. Hoeveel kredietvergoeding betaalt hij maximaal per jaar (zonder aflossing)?",
    ["€ 600", "€ 500", "€ 700", "€ 750"], 0,
    "Bij 12% per jaar betaal je € 0,12 per geleende euro per jaar: € 5.000 × 12% = € 600.", RO_KREDIET, 'casus');
  q('krediet', 'kr2-003', 'Kredietvergoeding', "Wat valt onder de kredietvergoeding waarvoor het wettelijk maximum geldt?",
    ["De rente én de kosten die de consument voor het krediet moet betalen", "Alleen de rente", "Alleen de afsluitkosten", "Alleen de boete bij te late betaling"], 0,
    "De kredietvergoeding omvat de rente en de kosten van het krediet. Kosten kunnen dus niet buiten het maximum om worden gerekend.", RO_KREDIET, 'kennis');
  q('krediet', 'kr2-004', 'Kredietvergoeding', "Hoe vaak wordt de wettelijke rente, waaraan de maximale kredietvergoeding is gekoppeld, opnieuw vastgesteld?",
    ["Halfjaarlijks", "Eens per tien jaar", "Dagelijks", "Alleen bij een nieuwe kabinetsperiode"], 0,
    "De wettelijke rente wordt elk halfjaar bekeken. Per 1 juli 2026 bleef die voor niet-handelstransacties 4%.", RO_WETTRENTE, 'kennis');
  q('krediet', 'kr2-005', 'Beloning', "Hoe wordt een bemiddelaar in consumptief krediet beloond?",
    ["Uitsluitend door de kredietaanbieder; hij mag de consument geen vergoeding vragen", "Uitsluitend door de consument via een factuur", "Door de consument en de kredietaanbieder samen", "Door het BKR"], 0,
    "Bij consumptief krediet mag de bemiddelaar de consument geen (directe) vergoeding in rekening brengen. Hij wordt beloond door de kredietaanbieder.", AFM_BELONING, 'kennis');
  q('krediet', 'kr2-006', 'Beloning', "Hoe ontvangt een kredietbemiddelaar zijn provisie tijdens de looptijd van een consumptief krediet?",
    ["Per maand, gebaseerd op het uitstaande saldo aan het eind van de maand", "Eenmalig vooraf over het volledige kredietbedrag", "Eenmalig bij aflossing", "Per jaar over de kredietlimiet"], 0,
    "De provisie wordt gespreid: per maand, berekend over het uitstaande saldo. Zo heeft de bemiddelaar geen prikkel om hoge bedragen vooraf te laten opnemen.", AFM_BELONING, 'kennis');
  q('krediet', 'kr2-007', 'CCD2', "Vanaf wanneer zijn de regels van de herziene consumentenkredietrichtlijn (CCD2) van toepassing?",
    ["20 november 2026", "1 januari 2026", "10 juli 2027", "1 januari 2028"], 0,
    "Richtlijn (EU) 2023/2225 is van toepassing vanaf 20 november 2026. In Nederland gebeurt de omzetting via wetsvoorstel 36.924.", 'k121', 'kennis');
  q('krediet', 'kr2-008', 'CCD2', "Wat verandert er onder CCD2 aan de reikwijdte van de kredietregels?",
    ["De ondergrens van € 200 vervalt en de bovengrens gaat van € 75.000 naar € 100.000", "De bovengrens gaat naar € 50.000", "Alleen kredieten boven € 1.000 vallen nog onder de regels", "Er verandert niets"], 0,
    "Ook kleine kredieten vallen eronder en de bovengrens stijgt naar € 100.000. Ga per product na of het onder de nieuwe definities valt.", 'k121', 'kennis');
  q('krediet', 'kr2-009', 'CCD2', "De kredietwaardigheid van een consument wordt volledig geautomatiseerd beoordeeld. Welk recht heeft de consument onder CCD2?",
    ["Recht op menselijke tussenkomst", "Recht op een gratis krediet", "Recht op een hogere limiet", "Geen enkel aanvullend recht"], 0,
    "Bij een geautomatiseerde beoordeling heeft de consument recht op menselijke tussenkomst.", 'k121', 'kennis');
  q('krediet', 'kr2-010', 'CCD2', "Een consument reageert niet op een kredietaanbod. Mag de kredietgever dat onder CCD2 als aanvaarding zien?",
    ["Nee, een aanbod moet ondubbelzinnig worden aanvaard; stilzwijgen is geen aanvaarding", "Ja, na 14 dagen", "Ja, als het aanbod per post is verstuurd", "Alleen bij kredieten onder € 200"], 0,
    "Onder CCD2 geldt stilzwijgen niet als aanvaarding. Laat aanvragen alleen doorgaan na een actieve, duidelijke aanvaarding.", 'k121', 'toepassing');
  q('krediet', 'kr2-011', 'CCD2', "Wat moet een kredietbemiddelaar onder CCD2 per transactie aan de consument laten weten?",
    ["Of hij wel of geen advies geeft of kan geven", "Wat zijn eigen inkomen is", "Welke rente de ECB hanteert", "Hoeveel klanten hij heeft"], 0,
    "De bemiddelaar laat per transactie uitdrukkelijk weten of hij advies geeft. Pas je dienstverleningsinformatie daarop aan.", 'k121', 'kennis');
  q('krediet', 'kr2-012', 'CCD2', "Welke nationale keuze maakt het Nederlandse wetsvoorstel voor CCD2 onder meer?",
    ["Een verbod op krediet aan minderjarigen en een verplichting tot leeftijdsverificatie", "Een verbod op doorlopend krediet", "Een maximum looptijd van één jaar", "Afschaffing van het BKR"], 0,
    "Het wetsvoorstel bevat onder meer een verbod op krediet aan minderjarigen, een leeftijdsverificatie en overgangsrecht voor bestaande kredieten met onbepaalde looptijd.", 'k121', 'kennis');
  q('krediet', 'kr2-013', 'CCD2', "Welke eis stelt CCD2 aan medewerkers die kredietovereenkomsten aanbieden, bemiddelen of daarover adviseren?",
    ["Zij moeten voldoende kennis en bekwaamheid hebben en die op peil houden, ook over de rechten van consumenten", "Zij moeten een bankvergunning hebben", "Zij moeten minimaal vijf jaar ervaring hebben", "Er gelden geen eisen"], 0,
    "CCD2 vraagt voldoende kennis en bekwaamheid. Leg als kantoor vast hoe je die kennis op peil houdt.", 'k121', 'kennis');
  q('krediet', 'kr2-014', 'CCD2', "Wat is de status van de Nederlandse Implementatiewet herziene richtlijn consumentenkrediet (36.924) per 2 oktober 2026?",
    ["In behandeling bij de Tweede Kamer, met 20 november 2026 als streefdatum", "In werking sinds 1 januari 2026", "Ingetrokken", "Aangenomen en in werking per 1 juli 2026"], 0,
    "Het wetsvoorstel lag op 2 oktober 2026 nog bij de Tweede Kamer. De definitieve invulling kan nog wijzigen.", 'k121', 'praktijk');
  q('krediet', 'kr2-015', 'AI', "Vanaf wanneer gelden de regels van de AI-verordening voor AI-systemen die de kredietwaardigheid van natuurlijke personen beoordelen?",
    ["Vanaf 2 december 2027", "Vanaf 17 januari 2025", "Vanaf 20 november 2026", "Ze zijn uitgezonderd van de AI-verordening"], 0,
    "Zulke systemen gelden als hoog risico. Na de AI-omnibus gelden de regels voor deze zelfstandige hoog-risicosystemen vanaf 2 december 2027.", 'k120', 'kennis');
  q('krediet', 'kr2-016', 'Leennormen', "Wie stelde in november 2025 de nieuwe leennormen voor consumptief krediet vast?",
    ["De VFN, voor het eerst zelfstandig", "De AFM", "De VFN samen met de NVB", "Het Nibud alleen"], 0,
    "De VFN maakte op 17 november 2025 nieuwe leennormen bekend. Tot november 2024 stelde zij die samen met de NVB vast.", 'https://www.vfn.nl', 'kennis');
  q('krediet', 'kr2-017', 'Leennormen', "Wat veranderde er in de VFN-leennormen van november 2025 op de lijst met verduurzamingsmaatregelen?",
    ["Zonnepanelen zijn geschrapt en de volledig elektrische warmtepomp is toegevoegd", "Alle maatregelen zijn geschrapt", "Alleen zonnepanelen zijn nog toegestaan", "Er is niets veranderd"], 0,
    "Door het einde van de salderingsregeling zijn zonnepanelen van de lijst gehaald; de volledig elektrische warmtepomp is erbij gekomen.", 'https://www.vfn.nl', 'kennis');
  q('krediet', 'kr2-018', 'Krediethypotheek', "Een senior heeft een krediethypotheek waarvan de bank de limiet afbouwt. Welk alternatief bieden steeds meer geldverstrekkers?",
    ["Een verzilverhypotheek voor senioren", "Een nieuwe krediethypotheek", "Een flitskrediet", "Een studielening"], 0,
    "Zuivere krediethypotheken worden niet meer nieuw aangeboden en bestaande worden afgebouwd. Een verzilverhypotheek is minder flexibel, maar komt in de buurt.", 'k82', 'toepassing');
  q('krediet', 'kr2-019', 'BKR', "Welke van deze zaken wordt niet geregistreerd in het CKI van BKR?",
    ["Een spaarrekening", "Een doorlopend krediet", "Een betalingsachterstand op een persoonlijke lening", "Een wettelijke schuldsanering"], 0,
    "BKR registreert kredieten, achterstanden en schuldregelingen. Spaartegoeden worden er niet geregistreerd.", 'k93', 'kennis');
  q('krediet', 'kr2-020', 'Krediet en hypotheek', "Hoe neemt de hypotheektoets de maandlast van een consumptief krediet mee bij een box 1-hypotheek?",
    ["De last wordt gebruteerd met de factor percentage box 1-tabel / percentage box 3-tabel", "De last wordt niet meegenomen", "De last wordt gehalveerd", "Alleen de rente telt mee"], 0,
    "Niet-aftrekbare lasten zoals consumptief krediet worden bij een box 1-hypotheek gebruteerd. Bij een volledig box 3-hypotheek bruteer je niet.", 'k10', 'kennis');
  q('krediet', 'kr2-021', 'Krediet en hypotheek', "Telt een studieschuld bij DUO mee bij een hypotheekaanvraag, hoewel die niet bij BKR staat?",
    ["Ja, ook verplichtingen die niet bij BKR staan tellen mee", "Nee, alleen BKR-registraties tellen", "Alleen als de schuld hoger is dan € 50.000", "Alleen als de klant ouder is dan 35"], 0,
    "Geldverstrekkers moeten naar alle verplichtingen vragen. Een studieschuld verlaagt de leencapaciteit, ook zonder BKR-registratie.", 'k94', 'toepassing');
  q('krediet', 'kr2-022', 'Rekenen', "Een persoonlijke lening van € 10.000 heeft een looptijd van 60 maanden en een rente van 7% per jaar (maandelijks 7/12%). Wat is ongeveer de vaste maandtermijn?",
    ["€ 198", "€ 167", "€ 225", "€ 240"], 0,
    "De annuïteit is € 10.000 × i / (1 − (1 + i)^−60) met i = 0,07/12. Dat is ongeveer € 198,01 per maand; in totaal betaalt de klant ongeveer € 11.881 terug.", 'rekentools.html', 'casus');
  q('krediet', 'kr2-023', 'Rekenen', "Vervolg: hoeveel rente betaalt de klant in totaal over de lening van € 10.000 (60 termijnen van € 198,01)?",
    ["Ongeveer € 1.881", "Ongeveer € 3.500", "€ 700", "Ongeveer € 1.000"], 0,
    "60 × € 198,01 = € 11.880,60. Minus de hoofdsom van € 10.000 is dat ongeveer € 1.881 rente.", 'rekentools.html', 'casus');
  q('krediet', 'kr2-024', 'Overkreditering', "Wat wordt bedoeld met overkreditering?",
    ["Een consument heeft meer krediet dan hij verantwoord kan terugbetalen", "Een consument heeft te weinig krediet", "Een kredietgever verstrekt te weinig leningen", "Een consument lost te snel af"], 0,
    "De kredietwaardigheidstoets moet overkreditering voorkomen: de consument mag geen lasten krijgen die hij niet kan dragen.", 'k121', 'kennis');
  q('krediet', 'kr2-025', 'Betalingsbeschermer', "Wat is een betalingsbeschermer bij consumptief krediet?",
    ["Een verzekering die de maandtermijnen van het krediet (tijdelijk) betaalt bij bijvoorbeeld arbeidsongeschiktheid of werkloosheid", "Een spaarrekening om af te lossen", "Een BKR-registratie die de consument beschermt", "Een garantie van de overheid"], 0,
    "De AFM heeft kritisch gekeken naar betalingsbeschermers. Advies en kosten moeten passen bij het risico en de situatie van de klant.", 'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/themas/betalingsbeschermers-bij-consumptief-krediet', 'kennis');
  q('krediet', 'kr2-026', 'Box 3', "Een alleenstaande heeft op 1 januari 2026 een persoonlijke lening van € 15.000 openstaan. Voor welk bedrag telt die schuld mee in box 3?",
    ["€ 11.200", "€ 15.000", "€ 0", "€ 7.600"], 0,
    "De schuldendrempel is € 3.800 per persoon: € 15.000 − € 3.800 = € 11.200 telt mee. De rente is niet aftrekbaar in box 1.", BD_BOX3, 'casus');
  q('krediet', 'kr2-027', 'Vergunning', "Wat heeft een kredietaanbieder nodig om consumptief krediet te verstrekken?",
    ["Een vergunning van de AFM of een bankvergunning", "Alleen een KvK-inschrijving", "Een erkenning van het Kifid", "Een registratie bij de VFN"], 0,
    "Kredietaanbieders moeten een AFM-vergunning of een bankvergunning hebben en zijn gebonden aan de regels van de Wft en het BW.", 'https://www.afm.nl/nl-nl/sector/kredietaanbieders', 'kennis');
  q('krediet', 'kr2-028', 'BKR', "Een klant heeft een ongebruikte creditcardlimiet van € 5.000 die geregistreerd is. Wat bespreek je vóór de hypotheekaanvraag?",
    ["Of hij de limiet echt nodig heeft; een ongebruikte limiet kan toch de leenruimte verlagen", "Niets, een ongebruikte limiet telt nooit mee", "Dat hij de limiet eerst maximaal moet opnemen", "Dat BKR de registratie op verzoek verwijdert"], 0,
    "Ook een ongebruikte limiet kan meetellen in de toets. Adviseer opzeggen alleen als de klant de limiet echt niet nodig heeft.", 'k93', 'toepassing');
  q('krediet', 'kr2-029', 'Examen', "Hoe is het initiële Wft-examen Consumptief krediet opgebouwd?",
    ["31 vragen in 90 minuten, cesuur 68% van de punten", "42 vragen in 120 minuten", "23 vragen in 60 minuten", "55 vragen in 120 minuten"], 0,
    "Volgens het CDFD duurt het examen Consumptief krediet 90 minuten en telt het 31 vragen (47 punten). De cesuur is 68%.", 'https://cdfd.nl/initieel-examen-consumptief-krediet/', 'kennis');
  q('krediet', 'kr2-030', 'CCD2', "Waarvoor geeft het Nederlandse wetsvoorstel voor CCD2 een grondslag in verband met de kredietwaardigheidstoets?",
    ["Het verwerken van bijzondere persoonsgegevens", "Het afschaffen van de BKR-toets", "Het verhogen van de maximale kredietvergoeding", "Het verbieden van persoonlijke leningen"], 0,
    "Het wetsvoorstel geeft een grondslag om bijzondere persoonsgegevens te verwerken bij de kredietwaardigheidstoets.", 'k121', 'kennis');
  q('krediet', 'kr2-031', 'Krediet', "Een klant met een doorlopend krediet vraagt waarom zijn rente na een jaar is gestegen. Wat is de waarschijnlijke verklaring?",
    ["Bij een doorlopend krediet is de rente meestal variabel", "De rente van een doorlopend krediet staat altijd voor de hele looptijd vast", "Het BKR heeft de rente verhoogd", "De AFM bepaalt de rente per klant"], 0,
    "Doorlopend krediet kent meestal een variabele rente binnen het wettelijk maximum. Bij een persoonlijke lening staat de rente vaak vast.", 'https://www.afm.nl', 'toepassing');
  q('krediet', 'kr2-032', 'Krediet', "Een klant wil een auto van € 20.000 kopen. Hij heeft € 8.000 spaargeld en geen buffer daarnaast. Wat bespreek je als eerste?",
    ["Of hij een buffer wil aanhouden en hoeveel krediet hij dan echt nodig heeft, getoetst aan zijn budget", "Dat hij het maximale krediet moet nemen", "Dat hij zijn hypotheek moet verhogen", "Dat krediet altijd voordeliger is dan sparen"], 0,
    "Een verantwoord advies begint bij het budget en de buffer. Leen niet meer dan nodig en toets de last aan de leennormen.", 'k24', 'toepassing');
  q('krediet', 'kr2-033', 'BKR', "Een klant heeft bij BKR een herstelde achterstand (A-codering met herstelcodering). Wat betekent dat voor NHG?",
    ["Een A-codering is bij NHG alleen acceptabel als die hersteld of aantoonbaar afgelost is", "NHG is nooit mogelijk", "De registratie speelt geen rol", "NHG is mogelijk met dubbele borgtochtprovisie"], 0,
    "Voor NHG is een A-codering alleen acceptabel als die hersteld of aantoonbaar afgelost is. Geldverstrekkers hebben daarnaast eigen beleid.", 'k70', 'toepassing');
  q('krediet', 'kr2-034', 'CCD2', "Wat geldt onder het Nederlandse wetsvoorstel voor kredieten met een onbepaalde looptijd die op 20 november 2026 al bestaan?",
    ["Er komt overgangsrecht", "Ze worden op die datum automatisch beëindigd", "Ze moeten binnen een maand worden afgelost", "Ze vallen nooit onder de nieuwe regels"], 0,
    "Het wetsvoorstel bevat overgangsrecht voor bestaande kredieten met onbepaalde looptijd. Volg de behandeling, want de invulling kan nog wijzigen.", 'k121', 'kennis');
  q('krediet', 'kr2-035', 'Krediet en hypotheek', "Waarom moet de adviseur bij een hypotheekgesprek vragen naar bestaande kredietlimieten en hun opzegbaarheid?",
    ["Een opgezegde limiet kan een acuut financieringsprobleem geven", "Omdat de limiet de WOZ-waarde verhoogt", "Omdat limieten de overdrachtsbelasting beïnvloeden", "Dat is niet nodig"], 0,
    "Leningsvoorwaarden geven banken vaak het recht om een limiet op te zeggen. Een klant die erop rekent, kan dan in de problemen komen.", 'k93', 'praktijk');
  q('krediet', 'kr2-036', 'Vakbekwaamheid', "Uit welke modules bestaat de Wft-beroepskwalificatie Adviseur Consumptief krediet?",
    ["Basis en Consumptief krediet", "Basis, Vermogen en Consumptief krediet", "Alleen Consumptief krediet", "Basis, Hypothecair krediet en Consumptief krediet"], 0,
    "Voor Adviseur Consumptief krediet zijn de modules Basis en Consumptief krediet nodig. Controleer de actuele eisen bij het CDFD.", 'https://cdfd.nl/adviseur-consumptief-krediet/', 'kennis');
  q('krediet', 'kr2-037', 'Kredietwaardigheid', "Welke databank raadpleegt een kredietaanbieder in Nederland standaard bij de beoordeling van een consumptief krediet?",
    ["Het CKI van BKR", "Het AFM-register", "Het Kadaster", "Mijn Wft"], 0,
    "Kredietaanbieders toetsen bij BKR welke kredieten en achterstanden een consument heeft. Ook verplichtingen die niet bij BKR staan, moeten worden uitgevraagd.", 'k93', 'kennis');
  q('krediet', 'kr2-038', 'Toezicht', "Welke toezichthouder ziet toe op het gedrag van kredietaanbieders en kredietbemiddelaars tegenover consumenten?",
    ["De AFM", "DNB", "Het Kifid", "BKR"], 0,
    "De AFM houdt gedragstoezicht op aanbieders en bemiddelaars van consumptief krediet, bijvoorbeeld op de kredietwaardigheidstoets en de maximale kredietvergoeding.", 'https://www.afm.nl/nl-nl/sector/kredietaanbieders', 'kennis');

  /* ================= SCHADE PARTICULIER ================= */
  q('schade', 'sp2-001', 'Premiebetaling', "Wanneer mag een verzekeraar de dekking schorsen als de verzekeringnemer de vervolgpremie niet betaalt?",
    ["Pas na een aanmaning met de gevolgen erin en als betaling daarna binnen 14 dagen uitblijft", "Direct op de vervaldag", "Na drie maanden zonder aanmaning", "Nooit, de dekking loopt altijd door"], 0,
    "Volgens artikel 7:934 BW moet de verzekeraar eerst aanmanen en de gevolgen noemen. Pas als betaling binnen 14 dagen na de aanmaning uitblijft, kan de dekking worden geschorst.", BW7, 'kennis');
  q('schade', 'sp2-002', 'Verjaring', "Binnen welke termijn verjaart een rechtsvordering tot uitkering tegen de verzekeraar in de regel?",
    ["Drie jaar na de dag waarop de verzekerde bekend werd met de opeisbaarheid", "Een jaar na de schade", "Twintig jaar", "Zes maanden na de schademelding"], 0,
    "Artikel 7:942 BW bepaalt een verjaringstermijn van drie jaar. Een schriftelijke mededeling kan de verjaring stuiten.", BW7, 'kennis');
  q('schade', 'sp2-003', 'Opzet', "Een verzekerde veroorzaakt met opzet schade aan zijn eigen woning. Keert de verzekeraar uit?",
    ["Nee, de verzekeraar keert niet uit aan de verzekerde die de schade met opzet heeft veroorzaakt", "Ja, als de premie is betaald", "Ja, tot de helft van de schade", "Alleen als de schade hoger is dan het eigen risico"], 0,
    "Artikel 7:952 BW sluit uitkering uit aan een verzekerde die de schade met opzet of door roekeloosheid heeft veroorzaakt.", BW7, 'kennis');
  q('schade', 'sp2-004', 'Schadebeperking', "Een verzekerde maakt kosten om dreigende schade te voorkomen (bereddingskosten). Wie draagt die kosten?",
    ["De verzekeraar, ook als ze samen met de schade boven de verzekerde som uitkomen", "Altijd de verzekerde zelf", "De gemeente", "De verzekeraar, maar alleen binnen de verzekerde som"], 0,
    "Bereddingskosten komen op grond van artikel 7:957 BW voor rekening van de verzekeraar, ook boven de verzekerde som.", BW7, 'kennis');
  q('schade', 'sp2-005', 'Samenloop', "Een schade is gedekt onder twee verzekeringen. Wat is het uitgangspunt in de wet?",
    ["De verzekerde kan bij een van beide claimen; onderling dragen de verzekeraars naar evenredigheid", "De verzekerde krijgt de schade dubbel vergoed", "Geen van beide verzekeraars hoeft uit te keren", "Alleen de oudste polis keert uit"], 0,
    "Artikel 7:961 BW regelt samenloop. Polissen bevatten vaak een samenloopclausule, maar de verzekerde mag niet meer krijgen dan zijn schade.", BW7, 'kennis');
  q('schade', 'sp2-006', 'Eigen gebrek', "Een wasmachine gaat kapot door slijtage van een onderdeel. Wordt dat in de regel vergoed door een schadeverzekering?",
    ["Nee, schade door een eigen gebrek wordt niet vergoed tenzij anders is afgesproken", "Ja, altijd", "Alleen als de machine jonger is dan tien jaar", "Ja, maar tegen dagwaarde"], 0,
    "Artikel 7:951 BW sluit schade door een eigen gebrek van de verzekerde zaak uit, tenzij de polis anders bepaalt.", BW7, 'kennis');
  q('schade', 'sp2-007', 'Schademelding', "Wanneer moet een verzekerde een schade melden bij zijn verzekeraar?",
    ["Zo spoedig als redelijkerwijs mogelijk", "Binnen een jaar", "Alleen als de schade hoger is dan € 1.000", "Pas na herstel"], 0,
    "Artikel 7:941 BW verplicht de verzekerde om de schade zo snel als redelijkerwijs mogelijk te melden en mee te werken aan de afwikkeling.", BW7, 'kennis');
  q('schade', 'sp2-008', 'Subrogatie', "De verzekeraar vergoedt schade die een derde heeft veroorzaakt. Wat kan de verzekeraar daarna?",
    ["Het uitgekeerde bedrag verhalen op de aansprakelijke derde (subrogatie)", "Niets, de vordering vervalt", "De premie van de verzekerde verdubbelen", "De verzekerde laten terugbetalen"], 0,
    "Door de uitkering gaat de vordering van de verzekerde op de aansprakelijke derde over op de verzekeraar (artikel 7:962 BW).", BW7, 'kennis');
  q('schade', 'sp2-009', 'Mededelingsplicht', "Tot wanneer loopt de mededelingsplicht bij het aanvragen van een verzekering?",
    ["Tot de verzekering tot stand is gekomen; wijzigingen na het indienen van de aanvraag moet de klant ook melden", "Tot het moment van ondertekenen van het aanvraagformulier", "Gedurende de hele looptijd van de verzekering", "Tot de eerste premiebetaling"], 0,
    "De mededelingsplicht geldt vóór het sluiten. Verandert er iets tussen aanvraag en acceptatie, dan moet de klant dat melden.", 'k109', 'kennis');
  q('schade', 'sp2-010', 'Mededelingsplicht', "Een tussenpersoon adviseert de klant om een eerdere behandeling niet te vermelden in de gezondheidsverklaring. Voor wiens rekening komt dat tegenover de verzekeraar?",
    ["Voor rekening van de klant als opdrachtgever; daarna kan hij de tussenpersoon aansprakelijk stellen", "Voor rekening van de verzekeraar", "Voor niemands rekening", "Voor rekening van het Kifid"], 0,
    "Kifid oordeelde dat verzwijgen op advies van de tussenpersoon een kwestie is tussen klant en tussenpersoon. Adviseer nooit om informatie weg te laten.", 'k109', 'toepassing');
  q('schade', 'sp2-011', 'Onderverzekering', "Na een brand blijkt de inboedel ver onder de werkelijke waarde verzekerd. Wat verwachtte het Kifid van de tussenpersoon?",
    ["Dat hij helpt het juiste bedrag te bepalen of een product met garantie tegen onderverzekering kiest, en duidelijk waarschuwt als de klant afwijkt", "Niets, het verzekerd bedrag is alleen de verantwoordelijkheid van de klant", "Dat hij de schade zelf vergoedt", "Dat hij de polis opzegt"], 0,
    "In uitspraak 2022-0209 schoot de tussenpersoon tekort in zijn zorgplicht omdat hij niet passend adviseerde en onvoldoende waarschuwde voor onderverzekering.", 'k108', 'toepassing');
  q('schade', 'sp2-012', 'Verzekeringsvormen', "Wat kenmerkt een verzekering op eerste risico?",
    ["Tot het verzekerde bedrag wordt geen beroep gedaan op onderverzekering", "Het eerste deel van elke schade is altijd voor eigen rekening", "Alleen de eerste schade per jaar is gedekt", "De premie wordt pas na de eerste schade betaald"], 0,
    "Bij een eerste-risicoverzekering wordt schade vergoed tot het verzekerde bedrag, zonder evenredigheidsregel. Dat is handig als de totale waarde lastig te bepalen is.", 'k88', 'kennis');
  q('schade', 'sp2-013', 'Verzekeringsvormen', "Wat is de dagwaarde van een zaak?",
    ["De nieuwwaarde minus de waardevermindering door veroudering of slijtage", "De prijs van een nieuw exemplaar", "De verkoopprijs van het origineel", "De WOZ-waarde"], 0,
    "Dagwaarde is de waarde direct voor de schade: de nieuwwaarde minus waardevermindering. Veel polissen vergoeden tot een bepaalde leeftijd op nieuwwaarde en daarna op dagwaarde.", 'https://www.verbondvanverzekeraars.nl', 'kennis');
  q('schade', 'sp2-014', 'Motorrijtuigen', "Welke verzekering is wettelijk verplicht voor een motorrijtuig dat op de openbare weg rijdt?",
    ["Een aansprakelijkheidsverzekering op grond van de WAM", "Een allriskverzekering", "Een verzekering tegen diefstal", "Een rechtsbijstandverzekering"], 0,
    "De Wet aansprakelijkheidsverzekering motorrijtuigen (WAM) verplicht een verzekering voor schade die met het motorrijtuig aan anderen wordt toegebracht.", 'scan-autoverzekering.html', 'kennis');
  q('schade', 'sp2-015', 'Motorrijtuigen', "Een klant rijdt door eigen schuld tegen een paal. Welke dekking vergoedt de schade aan zijn eigen auto?",
    ["Volledig casco (allrisk)", "Alleen WA", "WA plus beperkt casco", "Een AVP"], 0,
    "WA dekt schade aan anderen. Beperkt casco dekt onder meer diefstal, brand, storm en ruitschade. Eigen schuld aan de eigen auto valt alleen onder volledig casco.", 'scan-autoverzekering.html', 'toepassing');
  q('schade', 'sp2-016', 'Motorrijtuigen', "Wie vergoedt schade die is veroorzaakt door een onbekende of onverzekerde automobilist?",
    ["Het Waarborgfonds Motorverkeer, onder voorwaarden", "De gemeente", "De eigen AVP", "Niemand"], 0,
    "Het Waarborgfonds Motorverkeer vergoedt onder voorwaarden schade door onbekende, onverzekerde of gestolen motorrijtuigen.", 'https://www.wbf.nl', 'kennis');
  q('schade', 'sp2-017', 'Motorrijtuigen', "Wat gebeurt er in de regel met de bonus-malustrede na een schade die de verzekeraar uitkeert op de autoverzekering?",
    ["De klant valt een aantal treden terug en betaalt meer premie", "De klant stijgt een trede", "Er verandert niets", "De polis wordt automatisch beëindigd"], 0,
    "Een geclaimde schade leidt tot terugval op de bonus-malusladder. Soms is het voordeliger een kleine schade zelf te betalen.", 'scan-autoverzekering.html', 'kennis');
  q('schade', 'sp2-018', 'Aansprakelijkheid', "Een automobilist rijdt een fietser van 10 jaar aan. Wat geldt op grond van artikel 185 WVW?",
    ["De eigenaar of houder van het motorrijtuig is in beginsel aansprakelijk; kinderen onder 14 krijgen volledige vergoeding, tenzij er opzet of bewuste roekeloosheid is", "Het kind draagt de helft van de schade", "De ouders van het kind zijn aansprakelijk", "De fietser krijgt alleen vergoeding als de automobilist te hard reed"], 0,
    "Artikel 185 WVW beschermt fietsers en voetgangers. Bij kinderen onder 14 krijgt het kind in de regel 100% vergoed, behalve bij opzet of bewuste roekeloosheid.", 'https://wetten.overheid.nl/BWBR0006622/', 'toepassing');
  q('schade', 'sp2-019', 'Aansprakelijkheid', "De hond van de klant bijt een voorbijganger. Wie is aansprakelijk?",
    ["De bezitter van de hond (risicoaansprakelijkheid)", "Alleen de voorbijganger zelf", "De gemeente", "Niemand, dieren zijn niet aansprakelijk"], 0,
    "De bezitter van een dier is op grond van artikel 6:179 BW aansprakelijk voor de schade die het dier aanricht. Een AVP dekt dit doorgaans.", BW6, 'toepassing');
  q('schade', 'sp2-020', 'Aansprakelijkheid', "De 15-jarige zoon van een klant trapt een bal door de ruit van een geparkeerde auto. Op wie kan de eigenaar van de auto de schade verhalen?",
    ["De ouders, tenzij hun niet te verwijten valt dat zij het gedrag niet hebben belet; daarnaast het kind zelf", "Alleen het kind", "Niemand, kinderen tot 16 jaar zijn nooit aansprakelijk", "De school"], 0,
    "Bij kinderen van 14 en 15 zijn de ouders aansprakelijk, tenzij hen niets te verwijten valt (artikel 6:169 lid 2 BW). Het kind kan zelf ook aansprakelijk zijn.", BW6, 'toepassing');
  q('schade', 'sp2-021', 'Aansprakelijkheid', "Welke elementen zijn nodig voor aansprakelijkheid op grond van een onrechtmatige daad (artikel 6:162 BW)?",
    ["Onrechtmatigheid, toerekenbaarheid, schade, causaal verband en relativiteit", "Alleen schade", "Alleen een strafrechtelijke veroordeling", "Een schriftelijke overeenkomst"], 0,
    "Een vordering uit onrechtmatige daad vraagt een onrechtmatige gedraging die aan de dader kan worden toegerekend, schade, oorzakelijk verband en relativiteit.", BW6, 'kennis');
  q('schade', 'sp2-022', 'Rechtsbijstand', "Een klant met een rechtsbijstandverzekering moet een gerechtelijke procedure voeren. Mag hij zelf een advocaat kiezen?",
    ["Ja, in een gerechtelijke of administratieve procedure heeft hij vrije advocaatkeuze; de polis kan wel een kostenmaximum voor externe advocaten bevatten", "Nee, de verzekeraar bepaalt altijd wie hem bijstaat", "Alleen als de verzekeraar akkoord gaat", "Alleen bij strafzaken"], 0,
    "Europese regels en rechtspraak geven vrije advocaatkeuze in gerechtelijke en administratieve procedures. Verzekeraars mogen wel redelijke kostenlimieten stellen.", 'https://www.verbondvanverzekeraars.nl', 'kennis');
  q('schade', 'sp2-023', 'Reisverzekering', "Een klant wordt op vakantie in Spanje opgenomen in een privéziekenhuis. De basisverzekering vergoedt tot het Nederlandse tarief. Welke verzekering kan de meerkosten dekken?",
    ["Een reisverzekering met dekking voor geneeskundige kosten, of een aanvullende zorgverzekering", "De AVP", "De inboedelverzekering", "Geen enkele verzekering"], 0,
    "De basisverzekering vergoedt spoedzorg in het buitenland tot maximaal het Nederlandse tarief. Meerkosten kunnen worden gedekt door een reis- of aanvullende verzekering.", RO_ZV + 'wat-zit-er-in-het-basispakket-van-de-zorgverzekering', 'toepassing');
  q('schade', 'sp2-024', 'Fiets', "Moet een e-bike met trapondersteuning tot 25 km per uur WAM-verzekerd zijn?",
    ["Nee, die geldt als fiets; een speed pedelec moet wel WAM-verzekerd zijn", "Ja, elke elektrische fiets", "Alleen als hij duurder is dan € 2.000", "Ja, maar alleen voor diefstal"], 0,
    "Een e-bike met ondersteuning tot 25 km/u is een fiets. Een speed pedelec (tot 45 km/u) is een bromfiets en valt onder de WAM.", 'https://www.rijksoverheid.nl', 'kennis');
  q('schade', 'sp2-025', 'Opstal', "Een woning komt langdurig leeg te staan in afwachting van verkoop. Waar moet de adviseur op letten?",
    ["Of de opstaldekking bij leegstand beperkt is en of de verzekeraar moet worden geïnformeerd", "Nergens op, leegstand heeft geen gevolgen", "De opstalverzekering vervalt automatisch", "De WOZ-waarde moet worden aangepast"], 0,
    "Bij leegstand, verhuur of een tweede woning kan de dekking beperkt zijn. Controleer de voorwaarden en meld de situatie.", 'k88', 'toepassing');
  q('schade', 'sp2-026', 'Opstal', "Een klant koopt een woning met een rieten dak. Waarom vraagt de adviseur extra aandacht voor de opstalverzekering?",
    ["Rieten daken vallen vaak onder bijzondere acceptatie met eigen voorwaarden en premie", "Rieten daken zijn nooit te verzekeren", "Voor rieten daken geldt geen herbouwwaarde", "Rieten daken hebben geen brandrisico"], 0,
    "Bij rieten daken, monumentale panden en houtbouw gelden vaak afwijkende acceptatie en voorwaarden.", 'k88', 'toepassing');
  q('schade', 'sp2-027', 'Opstal', "De klant laat zijn woning verduurzamen met isolatie en een warmtepomp. Wat doet hij met zijn opstalverzekering?",
    ["De waardeverhoging melden bij de verzekeraar, zodat het verzekerd bedrag of de garantie tegen onderverzekering blijft kloppen", "Niets, verduurzaming verlaagt de herbouwwaarde", "De verzekering opzeggen", "Alleen de inboedelverzekering aanpassen"], 0,
    "Verbouwing en verduurzaming kunnen de herbouwwaarde verhogen. Meld dat, ook als er een garantie tegen onderverzekering is, want die heeft vaak voorwaarden.", 'k88', 'toepassing');
  q('schade', 'sp2-028', 'Algemeen', "Wat betekent verzekerbaar belang bij een schadeverzekering?",
    ["De verzekerde moet zelf financieel nadeel kunnen lijden door de schade", "Iedereen mag elke zaak verzekeren", "Alleen de eigenaar mag een AVP afsluiten", "De verzekeraar moet een belang hebben in de zaak"], 0,
    "Een schadeverzekering vergoedt alleen schade die de verzekerde zelf lijdt. Zonder belang is er geen schade om te vergoeden.", BW7, 'kennis');
  q('schade', 'sp2-029', 'Inboedel', "Een klant met een inboedelverzekering met garantie tegen onderverzekering koopt voor € 15.000 aan nieuwe meubels. Wat adviseer je?",
    ["Controleer de voorwaarden van de garantie en laat de inboedelwaarde opnieuw vaststellen", "Niets, de garantie geldt altijd zonder voorwaarden", "Een tweede inboedelverzekering afsluiten", "De oude meubels apart verzekeren"], 0,
    "Garanties tegen onderverzekering hebben vaak voorwaarden, zoals periodieke herberekening of een maximum. Leg vast hoe het bedrag is bepaald.", 'k108', 'toepassing');
  q('schade', 'sp2-030', 'Opstal', "Een klant met een hypotheek regelt zijn opstalverzekering niet via de adviseur. Wat doet de adviseur?",
    ["De klant aantoonbaar vragen de dekking te regelen en dat vastleggen", "Niets, het is niet zijn taak", "De hypotheek weigeren", "Zelf een polis afsluiten zonder overleg"], 0,
    "Vrijwel elke geldverstrekker eist een opstalverzekering. Bemiddel je die niet zelf, vraag de klant dan aantoonbaar de dekking te regelen.", 'k88', 'praktijk');
  q('schade', 'sp2-031', 'Opstal', "Wat bevestigt de adviseur bij voorkeur rond de passeerdatum van de hypotheek?",
    ["Dat de opstalverzekering per de passeerdatum ingaat", "Dat de inboedelverzekering is opgezegd", "Dat de klant geen AVP heeft", "Dat de WOZ-waarde bekend is"], 0,
    "Leg de bevestiging van de dekking per passeerdatum vast, met herbouwwaarde, verzekerd bedrag en eventuele garantie tegen onderverzekering.", 'k88', 'praktijk');
  q('schade', 'sp2-032', 'Inboedel', "Een klant heeft een inboedel van € 80.000 en is zonder garantie verzekerd voor € 60.000. Bij brand ontstaat € 20.000 schade. Hoeveel ontvangt hij bij toepassing van de evenredigheidsregel?",
    ["€ 15.000", "€ 20.000", "€ 10.000", "€ 16.000"], 0,
    "Hij is voor 60.000 / 80.000 = 75% verzekerd. Hij ontvangt 75% van € 20.000 = € 15.000.", 'k108', 'casus');
  q('schade', 'sp2-033', 'Uitvaart', "Wat is het verschil tussen een uitvaartverzekering in natura en een kapitaalverzekering?",
    ["In natura levert de verzekeraar diensten en zaken voor de uitvaart; bij kapitaal ontvangt de begunstigde een geldbedrag", "Er is geen verschil", "In natura keert altijd meer uit", "Een kapitaalverzekering is alleen voor kinderen"], 0,
    "Bij een naturaverzekering is de uitvaart zelf verzekerd, bij een kapitaalverzekering een bedrag. Controleer of het pakket of bedrag nog past bij de wensen en kosten.", 'k87', 'kennis');
  q('schade', 'sp2-034', 'Algemeen', "Wat is het doel van een eigen risico in een schadeverzekering?",
    ["Kleine schades blijven voor rekening van de klant, wat de premie verlaagt en kleine claims voorkomt", "De verzekeraar hoeft nooit uit te keren", "De klant krijgt een hogere uitkering", "Het voorkomt onderverzekering"], 0,
    "Met een eigen risico deelt de klant in kleine schades. Dat verlaagt de premie; de klant moet het bedrag wel zelf kunnen dragen.", 'scan-schadeverzekeringen.html', 'kennis');
  q('schade', 'sp2-035', 'Inboedel', "Een klant heeft een dure ring en een horloge. Waar moet de adviseur bij de inboedelverzekering op letten?",
    ["Veel polissen hebben een maximumbedrag voor lijfsieraden en kostbaarheden; meer verzekeren vraagt een aparte afspraak of polis", "Sieraden zijn altijd onbeperkt meeverzekerd", "Sieraden vallen onder de opstalverzekering", "Sieraden zijn nooit te verzekeren"], 0,
    "Kostbaarheden zoals sieraden en horloges hebben in de inboedelverzekering vaak een maximum. Bespreek dat met de klant en leg de keuze vast.", 'scan-schadeverzekeringen.html', 'toepassing');
  q('schade', 'sp2-036', 'Motorrijtuigen', "Een klant trekt een caravan en veroorzaakt daarmee onderweg schade aan een andere auto. Welke verzekering dekt die aansprakelijkheid?",
    ["De WAM-verzekering van de trekkende auto", "Een cascoverzekering van de caravan", "De AVP", "De inboedelverzekering"], 0,
    "Tijdens het trekken valt de aanhanger onder de aansprakelijkheidsverzekering van de auto. Schade aan de caravan zelf vraagt een eigen cascoverzekering.", 'scan-autoverzekering.html', 'toepassing');
  q('schade', 'sp2-037', 'Opstal', "Waarom passen veel verzekeraars het verzekerd bedrag van een opstalverzekering jaarlijks aan met een indexcijfer?",
    ["Om het verzekerd bedrag in lijn te houden met de stijgende bouwkosten en onderverzekering te voorkomen", "Om de WOZ-waarde te volgen", "Om de premie te verlagen", "Omdat de wet dat verplicht voor alle polissen"], 0,
    "Bouwkosten stijgen. Zonder indexatie raakt het verzekerd bedrag achter bij de herbouwwaarde. Indexatie vervangt geen controle bij verbouwing.", 'k88', 'kennis');
  q('schade', 'sp2-038', 'Aansprakelijkheid', "Een klant laat bij de buren een emmer staan waarover de buurman struikelt. Welke verzekering van de klant komt in beeld?",
    ["De aansprakelijkheidsverzekering voor particulieren (AVP)", "De opstalverzekering van de buurman", "De rechtsbijstandverzekering van de klant als schadevergoeding", "De zorgverzekering van de klant"], 0,
    "Is de klant aansprakelijk op grond van een onrechtmatige daad, dan dekt zijn AVP de schade aan de buurman. De zorgverzekeraar van de buurman kan medische kosten verhalen.", BW6, 'toepassing');

  /* ================= SCHADE ZAKELIJK ================= */
  q('schadezakelijk', 'sz2-001', 'Werkgeversaansprakelijkheid', "Een werknemer raakt gewond tijdens zijn werk. Wanneer is de werkgever op grond van artikel 7:658 BW niet aansprakelijk?",
    ["Als hij aantoont dat hij zijn zorgplicht is nagekomen of dat de schade grotendeels het gevolg is van opzet of bewuste roekeloosheid van de werknemer", "Als de werknemer een WIA-uitkering krijgt", "Als het ongeval buiten kantoortijd plaatsvond", "Werkgevers zijn nooit aansprakelijk"], 0,
    "Artikel 7:658 BW legt de bewijslast grotendeels bij de werkgever. Hij moet aantonen dat hij voldoende heeft gedaan om schade te voorkomen.", BW7, 'kennis');
  q('schadezakelijk', 'sz2-002', 'Werkgeversaansprakelijkheid', "Een werknemer krijgt tijdens een zakelijke autorit buiten zijn schuld een ongeval. Welke verplichting heeft de werkgever volgens de rechtspraak op grond van goed werkgeverschap (artikel 7:611 BW)?",
    ["Zorgen voor een behoorlijke verzekering voor werknemers die zich voor het werk in het verkeer begeven", "Geen enkele, het verkeer valt buiten de werkplek", "De auto van de werknemer vervangen", "De WAM-premie van de werknemer betalen"], 0,
    "Uit rechtspraak volgt dat de werkgever moet zorgen voor een behoorlijke verzekering, bijvoorbeeld een schadeverzekering inzittenden of een ongevallenverzekering.", BW7, 'kennis');
  q('schadezakelijk', 'sz2-003', 'AVB', "Wat dekt een aansprakelijkheidsverzekering voor bedrijven (AVB) in de kern?",
    ["De wettelijke aansprakelijkheid van de onderneming voor letsel- en zaakschade aan derden", "Schade aan de eigen bedrijfsgebouwen", "Omzetverlies na brand", "Fouten in financieel advies (zuivere vermogensschade)"], 0,
    "De AVB dekt aansprakelijkheid voor schade aan personen en zaken van derden. Zuivere vermogensschade door beroepsfouten valt meestal onder een beroepsaansprakelijkheidsverzekering.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-004', 'AVB', "Een installateur beschadigt de cv-ketel waar hij aan werkt bij een klant. Waarom keert de AVB dit vaak niet (volledig) uit?",
    ["Vanwege de opzichtclausule: schade aan zaken die de verzekerde onder zich heeft of bewerkt is vaak uitgesloten of beperkt gedekt", "Omdat de AVB alleen letselschade dekt", "Omdat de klant zelf verzekerd moet zijn", "Omdat installateurs geen AVB mogen afsluiten"], 0,
    "Veel AVB-polissen sluiten schade aan zaken onder opzicht of in bewerking uit of beperken die dekking. Bespreek dit risico met de ondernemer.", 'scan-bedrijfsverzekeringen.html', 'toepassing');
  q('schadezakelijk', 'sz2-005', 'Productaansprakelijkheid', "Op welke grondslag is een producent aansprakelijk voor schade door een gebrekkig product?",
    ["Risicoaansprakelijkheid op grond van artikel 6:185 BW", "Alleen bij opzet", "Alleen als het product ouder is dan tien jaar", "De producent is nooit aansprakelijk, alleen de winkelier"], 0,
    "De producent is aansprakelijk voor schade door een gebrek in zijn product, ook zonder schuld. Een AVB met productaansprakelijkheid dekt dit risico.", BW6, 'kennis');
  q('schadezakelijk', 'sz2-006', 'Beroepsaansprakelijkheid', "Een adviseur geeft een verkeerd advies, waardoor de klant geld verliest. Welke verzekering dekt deze zuivere vermogensschade?",
    ["Een beroepsaansprakelijkheidsverzekering", "Een AVB", "Een opstalverzekering", "Een cyberverzekering"], 0,
    "Zuivere vermogensschade door een beroepsfout valt onder de beroepsaansprakelijkheidsverzekering. Voor bemiddelaars in onder meer verzekeringen en hypothecair krediet is zo'n verzekering een wettelijke eis.", 'https://www.afm.nl', 'toepassing');
  q('schadezakelijk', 'sz2-007', 'Bestuurders', "Wat dekt een bestuurdersaansprakelijkheidsverzekering (D&O)?",
    ["De persoonlijke aansprakelijkheid van bestuurders en commissarissen voor fouten in hun functie", "Schade aan bedrijfsauto's", "Letselschade van werknemers", "De omzetderving van de BV"], 0,
    "Bestuurders kunnen persoonlijk aansprakelijk worden gesteld, bijvoorbeeld door de vennootschap of een curator. Een D&O-verzekering dekt dat risico.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-008', 'Bestuurders', "Een BV gaat failliet. Wanneer kan de curator de bestuurders hoofdelijk aansprakelijk stellen op grond van artikel 2:248 BW?",
    ["Als het bestuur zijn taak kennelijk onbehoorlijk heeft vervuld en dat een belangrijke oorzaak van het faillissement is", "Altijd bij een faillissement", "Alleen als de bestuurder aandeelhouder is", "Nooit, een BV beschermt bestuurders volledig"], 0,
    "Artikel 2:248 BW maakt bestuurders aansprakelijk voor het tekort bij kennelijk onbehoorlijk bestuur dat een belangrijke oorzaak is van het faillissement.", 'https://wetten.overheid.nl/BWBR0003045/', 'kennis');
  q('schadezakelijk', 'sz2-009', 'Bedrijfsschade', "Wat dekt een bedrijfsschadeverzekering?",
    ["Het verlies aan brutowinst (vaste kosten en nettowinst) door bedrijfsstilstand na een gedekte materiële schade", "Alle omzetdaling, ook door concurrentie", "Schade aan de gebouwen zelf", "Schade aan auto's van werknemers"], 0,
    "Een bedrijfsschadeverzekering vult het verlies aan brutowinst aan na bijvoorbeeld brand. Omzetverlies door marktontwikkelingen is niet gedekt.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-010', 'Bedrijfsschade', "Een bedrijf heeft een jaaromzet van € 1.000.000 en € 400.000 variabele kosten. Wat is de brutowinst die voor een bedrijfsschadeverzekering relevant is?",
    ["€ 600.000", "€ 1.000.000", "€ 400.000", "€ 1.400.000"], 0,
    "Brutowinst = omzet minus variabele kosten: € 1.000.000 − € 400.000 = € 600.000. Daaruit worden vaste kosten en nettowinst betaald.", 'scan-bedrijfsverzekeringen.html', 'casus');
  q('schadezakelijk', 'sz2-011', 'Bedrijfsschade', "Wat is de uitkeringstermijn bij een bedrijfsschadeverzekering?",
    ["De periode na de schade waarover de bedrijfsschade maximaal wordt vergoed", "De termijn waarbinnen de premie moet zijn betaald", "De wachttijd voordat de polis ingaat", "De looptijd van de polis"], 0,
    "De uitkeringstermijn moet lang genoeg zijn om het bedrijf weer op het oude niveau te brengen. Kies die op basis van de verwachte hersteltijd.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-012', 'Bedrijfsschade', "Een winkel moet sluiten omdat de straat door werkzaamheden van de gemeente maandenlang is afgesloten. Er is geen materiële schade. Keert een gewone bedrijfsschadeverzekering uit?",
    ["Nee, een gewone bedrijfsschadeverzekering vereist bedrijfsstilstand door een gedekte materiële schade", "Ja, altijd", "Ja, maar alleen de helft", "Ja, als de omzet met meer dan 10% daalt"], 0,
    "De standaard bedrijfsschadeverzekering is gekoppeld aan materiële schade door een verzekerd evenement, zoals brand. Andere oorzaken vragen een uitbreiding.", 'scan-bedrijfsverzekeringen.html', 'toepassing');
  q('schadezakelijk', 'sz2-013', 'CAR', "Wat dekt een Construction All Risks-verzekering (CAR)?",
    ["Schade aan het werk in uitvoering tijdens de bouw en vaak de aansprakelijkheid van betrokken partijen", "Alleen de bouwvakkers tegen ongevallen", "De woning na oplevering", "Het inkomen van de aannemer"], 0,
    "Een CAR-verzekering dekt materiële schade aan het bouwproject tijdens de uitvoering en kan aansprakelijkheid en eigendommen van de opdrachtgever meeverzekeren.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-014', 'Transport', "Hoeveel bedraagt de aansprakelijkheid van een wegvervoerder onder het CMR-verdrag bij verlies van goederen in de regel maximaal?",
    ["8,33 rekeneenheden (SDR) per kilogram brutogewicht", "De volledige waarde van de lading", "€ 100 per zending", "Er is geen aansprakelijkheid"], 0,
    "Onder het CMR-verdrag is de aansprakelijkheid beperkt tot 8,33 SDR per kilogram. Voor waardevolle goederen is een ladingverzekering daarom belangrijk.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-015', 'Transport', "Een exporteur verstuurt elektronica met een hoge waarde per kilo via een vervoerder. Wat adviseer je?",
    ["Een ladingverzekering, omdat de aansprakelijkheid van de vervoerder beperkt is", "Niets, de vervoerder vergoedt altijd de volledige waarde", "Een AVB", "Een bedrijfsschadeverzekering"], 0,
    "Door de wettelijke beperking van vervoerdersaansprakelijkheid dekt de vervoerder lang niet altijd de volledige waarde. Een ladingverzekering beschermt het belang van de eigenaar.", 'scan-bedrijfsverzekeringen.html', 'toepassing');
  q('schadezakelijk', 'sz2-016', 'Transport', "Wat bepalen de Incoterms in een koopovereenkomst?",
    ["Onder meer wanneer het risico voor de goederen overgaat van verkoper op koper en wie het vervoer en de verzekering regelt", "De hoogte van de btw", "De rente op handelskrediet", "De kwaliteit van de goederen"], 0,
    "Incoterms zijn internationale leveringsvoorwaarden. Ze bepalen wie welke kosten en risico's draagt en zijn daarmee belangrijk voor de vraag wie de goederen verzekert.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-017', 'Machinebreuk', "Wat dekt een machinebreukverzekering doorgaans?",
    ["Plotselinge en onvoorziene schade aan machines, ook door interne oorzaken zoals een bedieningsfout of kortsluiting", "Alleen schade door brand", "Normale slijtage", "De aansprakelijkheid van de machinist"], 0,
    "Een machinebreukverzekering vult de brandverzekering aan met schade door interne oorzaken. Slijtage en onderhoud vallen er niet onder.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-018', 'Cyber', "Welke kosten dekt een cyberverzekering doorgaans?",
    ["Kosten van een datalek of hack, zoals herstel, onderzoek, bedrijfsschade en aansprakelijkheid", "Alleen de vervanging van computers na brand", "Alleen boetes van toezichthouders", "Alleen het abonnement op virussoftware"], 0,
    "Een cyberverzekering dekt de gevolgen van digitale incidenten. Verzekerbaarheid van boetes is beperkt en vaak uitgesloten.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-019', 'Brand', "Een bedrijfspand wordt na brand niet herbouwd. Waarop baseren veel polissen de vergoeding dan?",
    ["Op de verkoopwaarde (meestal lager dan de herbouwwaarde)", "Altijd op de herbouwwaarde", "Op de WOZ-waarde plus 10%", "Op de oorspronkelijke aankoopprijs"], 0,
    "Herbouwwaarde wordt meestal alleen vergoed als er binnen een termijn wordt herbouwd. Zonder herbouw vergoeden veel polissen op verkoopwaarde.", 'herbouwwaarde.html', 'kennis');
  q('schadezakelijk', 'sz2-020', 'Brand', "Wat is het voordeel van een waarde die vooraf door een deskundige is getaxeerd?",
    ["De verzekeraar is in beginsel aan die waarde gebonden, wat discussie over onderverzekering of waarde bij schade voorkomt", "De premie is altijd lager", "Er geldt geen eigen risico meer", "De verzekering dekt dan ook opzet"], 0,
    "Een deskundige taxatie vooraf (artikel 7:960 BW) legt de waarde vast. Taxaties gelden meestal voor een beperkte periode en moeten worden vernieuwd.", BW7, 'kennis');
  q('schadezakelijk', 'sz2-021', 'Huurdersbelang', "Een ondernemer huurt een winkelpand en laat op eigen kosten een nieuwe pui en inrichting aanbrengen. Hoe verzekert hij die verbeteringen?",
    ["Via een huurdersbelangverzekering", "Via de opstalverzekering van de verhuurder, automatisch", "Via de AVB", "Dat is niet te verzekeren"], 0,
    "Verbeteringen die de huurder aanbrengt, zijn geen onderdeel van zijn inventaris en vallen niet automatisch onder de polis van de verhuurder. Een huurdersbelangverzekering dekt dit belang.", 'scan-bedrijfsverzekeringen.html', 'toepassing');
  q('schadezakelijk', 'sz2-022', 'Aansprakelijkheid', "Een werknemer veroorzaakt tijdens zijn werk schade bij een klant. Wie is daarvoor in de regel aansprakelijk tegenover de klant?",
    ["De werkgever, op grond van artikel 6:170 BW", "Alleen de werknemer", "Niemand", "De klant zelf"], 0,
    "De werkgever is aansprakelijk voor fouten van ondergeschikten bij de uitoefening van hun taak. De AVB van de werkgever dekt dit doorgaans.", BW6, 'kennis');
  q('schadezakelijk', 'sz2-023', 'Kredietverzekering', "Wat dekt een kredietverzekering (debiteurenverzekering)?",
    ["Het risico dat afnemers hun facturen niet betalen door insolventie of langdurige wanbetaling", "Het risico van een stijgende rente", "Schade aan de bedrijfsauto", "Het verlies van een rijbewijs"], 0,
    "Met een kredietverzekering beschermt een onderneming zich tegen het debiteurenrisico.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-024', 'Verzuim', "Wat dekt een verzuimverzekering voor werkgevers?",
    ["Het risico van loondoorbetaling bij ziekte van werknemers", "De WW-uitkering van ontslagen werknemers", "Schade aan de inventaris", "De pensioenpremie"], 0,
    "Een werkgever moet bij ziekte maximaal twee jaar loon doorbetalen. Een verzuimverzekering dekt (een deel van) die kosten.", 'inkomen-ziekte-werknemer.html', 'kennis');
  q('schadezakelijk', 'sz2-025', 'Wagenpark', "Welke verzekering moet een ondernemer in elk geval hebben voor zijn bestelauto's die op de openbare weg rijden?",
    ["Een WAM-verzekering", "Een CAR-verzekering", "Een D&O-verzekering", "Een ladingverzekering"], 0,
    "Ook bedrijfsvoertuigen vallen onder de WAM-verplichting. Casco en lading zijn aanvullende keuzes.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-026', 'Provisie', "Mag een adviseur provisie ontvangen voor bemiddeling in een brandverzekering voor een mkb-ondernemer?",
    ["Ja, schadeverzekeringen vallen niet onder het provisieverbod", "Nee, het provisieverbod geldt voor alle verzekeringen", "Alleen als de premie lager is dan € 1.000", "Alleen met toestemming van de AFM"], 0,
    "Het provisieverbod geldt onder meer voor hypotheken, inkomensverzekeringen en complexe producten, niet voor schadeverzekeringen. Belangenconflicten moeten wel worden beheerst.", 'k61', 'kennis');
  q('schadezakelijk', 'sz2-027', 'Examen', "Hoe is het initiële Wft-examen Schadeverzekeringen zakelijk opgebouwd?",
    ["55 vragen in 120 minuten, cesuur 68% van de punten", "33 vragen in 90 minuten", "42 vragen in 120 minuten", "48 vragen in 135 minuten"], 0,
    "Volgens het CDFD telt het examen Schadeverzekeringen zakelijk 55 vragen (85 punten) en duurt het 120 minuten.", 'https://cdfd.nl/initieel-examen-schadeverzekeringen-zakelijk/', 'kennis');
  q('schadezakelijk', 'sz2-028', 'Onderverzekering', "Een groothandel heeft in het najaar veel meer voorraad dan in de zomer. Welk risico ontstaat bij een vast verzekerd bedrag op basis van de zomervoorraad?",
    ["Onderverzekering in de piekperiode", "Oververzekering in de piekperiode", "Geen enkel risico", "Dubbele premie"], 0,
    "Bij schommelende voorraden kan een vast bedrag in de piek te laag zijn. Bespreek een bedrag op basis van de piek of een polis die met schommelingen rekening houdt.", 'k108', 'casus');
  q('schadezakelijk', 'sz2-029', 'Brand', "Een bedrijfspand met een herbouwwaarde van € 1.000.000 is verzekerd voor € 800.000, zonder garantie tegen onderverzekering. Na brand is de schade € 250.000. Wat wordt er vergoed met de evenredigheidsregel?",
    ["€ 200.000", "€ 250.000", "€ 800.000", "€ 50.000"], 0,
    "Het pand is voor 80% verzekerd: 80% van € 250.000 = € 200.000.", BW7, 'casus');
  q('schadezakelijk', 'sz2-030', 'Aansprakelijkheid', "Een ondernemer laat een zzp'er werkzaamheden uitvoeren die horen bij zijn bedrijf. De zzp'er veroorzaakt schade bij een klant. Op welke grondslag kan de ondernemer aansprakelijk zijn?",
    ["Artikel 6:171 BW (aansprakelijkheid voor niet-ondergeschikten in de bedrijfsuitoefening)", "Artikel 7:658 BW", "Artikel 185 WVW", "De ondernemer is nooit aansprakelijk voor een zzp'er"], 0,
    "Wie werkzaamheden van zijn bedrijf laat uitvoeren door een niet-ondergeschikte, kan op grond van artikel 6:171 BW aansprakelijk zijn tegenover derden.", BW6, 'kennis');
  q('schadezakelijk', 'sz2-031', 'Rechtsbijstand', "Voor welk soort geschil is een zakelijke rechtsbijstandverzekering vaak bedoeld?",
    ["Onder meer arbeidsconflicten met werknemers en geschillen met leveranciers", "Het innen van de eigen premie", "Strafzaken wegens opzet", "Alle geschillen zonder wachttijd en limiet"], 0,
    "Zakelijke rechtsbijstand dekt juridische hulp bij onder meer arbeids-, contract- en burenconflicten. Let op wachttijd, dekkingsgebied en uitsluitingen.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-032', 'Werkgeversaansprakelijkheid', "Wat is het doel van een werkgeversaansprakelijkheidsdekking (vaak onderdeel van de AVB)?",
    ["Dekking voor schade die werknemers lijden tijdens het werk en waarvoor de werkgever aansprakelijk is", "Dekking voor de loondoorbetaling bij ziekte", "Dekking voor schade aan bedrijfsgebouwen", "Dekking voor fouten in het advies aan klanten"], 0,
    "De AVB dekt meestal ook de aansprakelijkheid van de werkgever tegenover werknemers. Verzuim en loondoorbetaling vallen daar niet onder.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-033', 'Elektronica', "Wat dekt een elektronicaverzekering doorgaans?",
    ["Schade aan elektronische apparatuur door van buiten komende oorzaken, kortsluiting of bedieningsfouten, en vaak reconstructie van gegevens", "Alleen diefstal van mobiele telefoons van werknemers", "De abonnementskosten van software", "Normale veroudering van apparatuur"], 0,
    "Elektronicaverzekeringen dekken een ruimer risico dan de brand- of inventarisverzekering voor computers, kassasystemen en apparatuur.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-034', 'Algemeen', "Waarom is een periodieke risico-inventarisatie bij een zakelijke klant belangrijk?",
    ["Omdat bedrijfsactiviteiten, waarden en aansprakelijkheidsrisico's veranderen en de dekking anders niet meer aansluit", "Omdat de AFM dat jaarlijks per klant controleert", "Omdat premies anders verlopen", "Het is niet belangrijk"], 0,
    "Nieuwe activiteiten, groei of een verhuizing kunnen leiden tot onderverzekering of gaten in de dekking. Plan een periodieke herbeoordeling.", 'scan-bedrijfsverzekeringen.html', 'praktijk');
  q('schadezakelijk', 'sz2-035', 'Bedrijfsschade', "Waarom worden variabele kosten niet vergoed onder een bedrijfsschadeverzekering?",
    ["Omdat ze bij stilstand wegvallen en dus geen schade vormen", "Omdat ze altijd door de AVB worden gedekt", "Omdat ze fiscaal aftrekbaar zijn", "Omdat ze onder de opstalverzekering vallen"], 0,
    "Bij stilstand hoeft het bedrijf bijvoorbeeld geen grondstoffen in te kopen. De schade zit in de doorlopende vaste kosten en de gederfde winst.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-036', 'Goederen', "Wat is het verschil tussen inventaris en goederen in een zakelijke brandverzekering?",
    ["Inventaris zijn de bedrijfsmiddelen (zoals machines en meubilair); goederen zijn de handelsvoorraad, grondstoffen en producten", "Er is geen verschil", "Inventaris is het gebouw; goederen zijn de machines", "Goederen zijn alleen goederen van derden"], 0,
    "Verzeker beide met een passend bedrag. Bij goederen fluctueert de waarde vaak, wat aandacht vraagt voor onderverzekering.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-037', 'AVB', "Waarop wordt de premie van een AVB vaak gebaseerd?",
    ["Op de aard van het bedrijf en een grondslag zoals de loonsom of de omzet", "Op de WOZ-waarde van de woning van de ondernemer", "Op het aantal klachten bij het Kifid", "Op de leeftijd van de ondernemer alleen"], 0,
    "De premie hangt af van het risico van de activiteiten en een grondslag die de omvang van het bedrijf weergeeft. Geef wijzigingen in activiteiten en omvang door.", 'scan-bedrijfsverzekeringen.html', 'kennis');
  q('schadezakelijk', 'sz2-038', 'Transport', "Een installatiebedrijf vervoert eigen gereedschap en materialen in eigen bestelbussen. Welke verzekering dekt schade aan die zaken tijdens het vervoer?",
    ["Een verzekering eigen vervoer", "Een CMR-verzekering", "Een WAM-verzekering", "Een D&O-verzekering"], 0,
    "Een CMR-verzekering gaat over aansprakelijkheid van een vervoerder voor andermans lading. Eigen zaken in eigen voertuigen verzeker je met een verzekering eigen vervoer.", 'scan-bedrijfsverzekeringen.html', 'toepassing');
  q('schadezakelijk', 'sz2-039', 'Transport', "Een Nederlandse koper koopt goederen onder de Incoterm EXW (Ex Works). Wie draagt het risico tijdens het vervoer?",
    ["De koper, vanaf het moment dat de verkoper de goederen in zijn eigen bedrijf ter beschikking stelt", "De verkoper, tot de goederen bij de koper zijn", "De vervoerder, altijd volledig", "Niemand"], 0,
    "Bij EXW doet de verkoper het minst: hij stelt de goederen beschikbaar op zijn eigen locatie. Vervoer en risico zijn daarna voor de koper, die zelf moet zorgen voor dekking.", 'scan-bedrijfsverzekeringen.html', 'toepassing');
  q('schadezakelijk', 'sz2-040', 'Aansprakelijkheid', "Een klant van een winkel glijdt uit over een natte vloer en breekt zijn pols. De winkelier had geen waarschuwingsbord geplaatst. Welke verzekering van de winkelier komt in beeld?",
    ["De AVB", "De bedrijfsschadeverzekering", "De inventarisverzekering", "De verzuimverzekering"], 0,
    "Letselschade van een derde waarvoor de ondernemer aansprakelijk is, valt onder de aansprakelijkheidsverzekering voor bedrijven.", 'scan-bedrijfsverzekeringen.html', 'toepassing');

  /* ================= ZORGVERZEKERINGEN ================= */
  q('zorg', 'zo2-001', 'Eigen risico', "Hoe hoog is het verplicht eigen risico van de zorgverzekering in 2026?",
    ["€ 385", "€ 485", "€ 350", "€ 885"], 0,
    "Het verplicht eigen risico is in 2026 € 385 voor verzekerden van 18 jaar en ouder.", RO_ZV + 'eigen-risico-zorgverzekering', 'kennis');
  q('zorg', 'zo2-002', 'Eigen risico', "Welke bedragen kan een verzekerde kiezen als vrijwillig eigen risico?",
    ["€ 100, € 200, € 300, € 400 of € 500", "Elk bedrag tot € 1.000", "Alleen € 250 of € 500", "Een vrijwillig eigen risico bestaat niet"], 0,
    "Bovenop het verplichte eigen risico kan de verzekerde kiezen voor € 100 tot en met € 500 vrijwillig eigen risico. Hoe hoger, hoe lager de premie.", RO_ZV + 'eigen-risico-zorgverzekering', 'kennis');
  q('zorg', 'zo2-003', 'Eigen risico', "Wat is in 2026 het maximale totale eigen risico (verplicht en vrijwillig samen)?",
    ["€ 885", "€ 785", "€ 500", "€ 1.000"], 0,
    "Met het maximale vrijwillig eigen risico van € 500 komt het totaal op € 385 + € 500 = € 885.", RO_ZV + 'eigen-risico-zorgverzekering', 'kennis');
  q('zorg', 'zo2-004', 'Eigen risico', "Een verzekerde heeft in 2026 € 200 vrijwillig eigen risico. Hij krijgt een ziekenhuisbehandeling uit het basispakket van € 1.200 en heeft verder geen zorgkosten gehad. Hoeveel betaalt hij zelf?",
    ["€ 585", "€ 385", "€ 200", "€ 1.200"], 0,
    "Zijn totale eigen risico is € 385 + € 200 = € 585. Dat betaalt hij zelf; de verzekeraar betaalt de overige € 615.", RO_ZV + 'eigen-risico-zorgverzekering', 'casus');
  q('zorg', 'zo2-005', 'Eigen risico', "Voor welke zorg uit het basispakket geldt geen eigen risico?",
    ["Huisartsenzorg, verloskundige zorg en kraamzorg, en wijkverpleging", "Ziekenhuisopname", "Geneesmiddelen", "Specialistische zorg"], 0,
    "Het eigen risico geldt niet voor onder meer de huisarts (ook de huisartsenpost), verloskundige zorg, kraamzorg en wijkverpleging.", RO_ZV + 'eigen-risico-zorgverzekering', 'kennis');
  q('zorg', 'zo2-006', 'Kinderen', "Wat geldt voor kinderen onder 18 jaar in de basisverzekering?",
    ["Zij betalen geen premie en hebben geen eigen risico", "Zij betalen de halve premie", "Zij hebben een eigen risico van € 385", "Zij zijn niet verzekerd"], 0,
    "Kinderen tot 18 jaar zijn premievrij verzekerd voor de basisverzekering en voor hen geldt geen eigen risico.", RO_ZV + 'premie-zorgverzekering', 'kennis');
  q('zorg', 'zo2-007', 'Kinderen', "Een kind wordt op 10 maart 18 jaar. Vanaf wanneer betaalt het zelf premie voor de basisverzekering?",
    ["Vanaf de eerste dag van de maand na de 18e verjaardag", "Vanaf 1 januari van het volgende jaar", "Vanaf de dag van de verjaardag", "Pas als het gaat werken"], 0,
    "De premie gaat in vanaf de eerste maand na de 18e verjaardag. Vanaf 18 jaar geldt ook het eigen risico.", RO_ZV + 'premie-zorgverzekering', 'toepassing');
  q('zorg', 'zo2-008', 'Kinderen', "Binnen welke termijn moeten ouders een pasgeboren kind aanmelden bij een zorgverzekeraar?",
    ["Binnen 4 maanden na de geboorte", "Binnen 1 week", "Binnen 1 jaar", "Dat hoeft niet, kinderen zijn automatisch verzekerd"], 0,
    "Ouders melden hun kind binnen vier maanden na de geboorte aan; de verzekering geldt dan met terugwerkende kracht vanaf de geboorte.", RO_ZV + 'premie-zorgverzekering', 'kennis');
  q('zorg', 'zo2-009', 'Acceptatieplicht', "Een verzekerde met een chronische ziekte wil overstappen naar een andere zorgverzekeraar. Mag die hem weigeren voor de basisverzekering?",
    ["Nee, voor de basisverzekering geldt een acceptatieplicht", "Ja, bij een chronische ziekte", "Ja, als hij ouder is dan 65", "Alleen als hij een premieachterstand van één maand heeft"], 0,
    "Zorgverzekeraars moeten iedereen accepteren voor de basisverzekering. Voor de aanvullende verzekering geldt die plicht niet.", RO_ZV + 'acceptatieplicht-zorgverzekering', 'toepassing');
  q('zorg', 'zo2-010', 'Premie', "Mag een zorgverzekeraar voor dezelfde basispolis een hogere premie vragen aan ouderen of zieken?",
    ["Nee, er geldt een verbod op premiedifferentiatie", "Ja, op basis van leeftijd", "Ja, op basis van gezondheid", "Ja, op basis van woonplaats"], 0,
    "Voor de basisverzekering moet de verzekeraar voor iedereen met dezelfde polis dezelfde premie rekenen.", RO_ZV + 'acceptatieplicht-zorgverzekering', 'kennis');
  q('zorg', 'zo2-011', 'Aanvullende verzekering', "Wat geldt voor een aanvullende zorgverzekering?",
    ["De verzekeraar mag weigeren of medische vragen stellen; er is geen acceptatieplicht", "Er geldt dezelfde acceptatieplicht als voor de basisverzekering", "Het verplicht eigen risico van € 385 geldt ook voor aanvullende zorg", "De overheid bepaalt de inhoud"], 0,
    "De aanvullende verzekering is vrijwillig en de verzekeraar bepaalt zelf inhoud en acceptatie. Het verplicht eigen risico geldt alleen voor zorg uit de basisverzekering.", RO_ZV + 'acceptatieplicht-zorgverzekering', 'kennis');
  q('zorg', 'zo2-012', 'Overstappen', "Een klant wil per 1 januari overstappen. Wat is de juiste volgorde en termijn?",
    ["Uiterlijk 31 december opzeggen en vóór 1 februari een nieuwe verzekering sluiten; die geldt dan met terugwerkende kracht vanaf 1 januari", "Vóór 1 november opzeggen en vóór 1 december afsluiten", "Opzeggen kan alleen per 1 juli", "Eerst de nieuwe verzekering sluiten na 1 februari"], 0,
    "Wie uiterlijk 31 december opzegt en vóór 1 februari een nieuwe verzekering sluit, is met terugwerkende kracht verzekerd vanaf 1 januari.", RO_ZV + 'overstappen-zorgverzekeraar', 'toepassing');
  q('zorg', 'zo2-013', 'Overstappen', "Een klant sluit vóór 31 december een nieuwe zorgverzekering af. Wat regelt de nieuwe verzekeraar vaak voor hem?",
    ["De opzegging van de oude verzekering via een overstapservice", "De betaling van zijn eigen risico", "Een korting op de basispremie", "Niets"], 0,
    "Veel verzekeraars bieden een overstapservice en zeggen de oude verzekering op als de nieuwe vóór 31 december is gesloten.", RO_ZV + 'overstappen-zorgverzekeraar', 'kennis');
  q('zorg', 'zo2-014', 'Overstappen', "Een klant stapt voor zijn basisverzekering over naar een andere verzekeraar maar wil zijn aanvullende verzekering houden. Mag de oude verzekeraar de aanvullende verzekering daarom opzeggen?",
    ["Nee, de oude verzekeraar mag de aanvullende verzekering niet opzeggen omdat de basisverzekering is overgezet", "Ja, altijd", "Ja, als de klant ouder is dan 50", "Ja, maar alleen per 1 juli"], 0,
    "Wie zijn basisverzekering overzet, kan bij de oude verzekeraar de aanvullende verzekering houden; die mag deze niet om die reden opzeggen.", RO_ZV + 'overstappen-zorgverzekeraar', 'kennis');
  q('zorg', 'zo2-015', 'Premie', "Wanneer maken zorgverzekeraars hun premie en polisvoorwaarden voor het volgende jaar uiterlijk bekend?",
    ["Uiterlijk 12 november", "Uiterlijk 1 oktober", "Uiterlijk 31 december", "Uiterlijk 1 februari"], 0,
    "Zorgverzekeraars maken vóór 12 november de premie en polisvoorwaarden voor het nieuwe jaar bekend, zodat verzekerden kunnen vergelijken.", 'https://www.nza.nl/zorgsectoren/zorgverzekeraars/wat-verwachten-we-van-zorgverzekeraars', 'kennis');
  q('zorg', 'zo2-016', 'Collectiviteit', "Kan een werknemer in 2026 via een collectiviteit van zijn werkgever korting krijgen op de basisverzekering?",
    ["Nee, sinds 2023 is korting op een collectieve basisverzekering niet meer toegestaan; op aanvullende verzekeringen kan het wel", "Ja, tot 10%", "Ja, tot 5%", "Alleen bij meer dan 100 werknemers"], 0,
    "Sinds 2023 is er geen korting meer op de collectieve basisverzekering. Collectiviteiten kunnen wel zorginhoudelijke afspraken maken en korting op aanvullende verzekeringen geven.", RO_ZV + 'korting-collectieve-zorgverzekering', 'kennis');
  q('zorg', 'zo2-017', 'Polisvormen', "Wat kenmerkt een naturapolis?",
    ["De verzekeraar contracteert zorgverleners; bij een niet-gecontracteerde zorgverlener kan de vergoeding lager zijn", "De verzekerde kiest zelf en krijgt altijd alles vergoed", "Er geldt geen eigen risico", "De verzekerde betaalt altijd eerst zelf de rekening"], 0,
    "Bij een naturapolis heb je recht op zorg van gecontracteerde zorgverleners. Kies je een zorgverlener zonder contract, dan kan een deel voor eigen rekening komen.", RO_ZV + 'polissen-zorgverzekeraar', 'kennis');
  q('zorg', 'zo2-018', 'Polisvormen', "Wat kenmerkt een restitutiepolis?",
    ["De verzekerde kiest zelf zijn zorgverlener en krijgt de kosten vergoed, ook als de verzekeraar geen contract heeft", "De verzekerde mag alleen naar gecontracteerde zorgverleners", "Er geldt een hoger verplicht eigen risico", "Alleen spoedzorg wordt vergoed"], 0,
    "Bij restitutie ligt de keuze bij de verzekerde. De vergoeding is niet afhankelijk van een contract tussen verzekeraar en zorgverlener.", RO_ZV + 'polissen-zorgverzekeraar', 'kennis');
  q('zorg', 'zo2-019', 'Polisvormen', "Wat is een combinatiepolis?",
    ["Een polis die voor sommige zorg werkt als natura en voor andere zorg als restitutie", "Een combinatie van basis- en aanvullende verzekering", "Een polis voor twee personen", "Een polis die zorg en schade combineert"], 0,
    "Een combinatiepolis mengt beide vormen. Kijk in de polisvoorwaarden welke zorg onder welk regime valt.", RO_ZV + 'polissen-zorgverzekeraar', 'kennis');
  q('zorg', 'zo2-020', 'Polisvormen', "Een klant wil zeker weten dat hij naar zijn eigen, niet-gecontracteerde fysiotherapeut kan voor zorg uit het basispakket zonder bijbetaling door het ontbreken van een contract. Welke polisvorm past daar het best bij?",
    ["Een restitutiepolis", "Een naturapolis met beperkte keuze", "Een budgetpolis", "Een aanvullende verzekering zonder basisverzekering"], 0,
    "Een restitutiepolis geeft vrije keuze van zorgverlener. Let wel: zorg die niet in het basispakket zit, wordt ook bij restitutie niet uit de basis vergoed.", RO_ZV + 'polissen-zorgverzekeraar', 'toepassing');
  q('zorg', 'zo2-021', 'Wanbetaling', "Na hoeveel maanden premieachterstand meldt de zorgverzekeraar een verzekerde aan bij het CAK?",
    ["Na 6 maanden", "Na 1 maand", "Na 12 maanden", "Na 3 jaar"], 0,
    "Na zes maanden niet betalen wordt de verzekerde aangemeld bij het CAK voor de regeling betalingsachterstand zorgpremie.", RO_ZV + 'wat-gebeurt-er-als-ik-de-premie-van-mijn-zorgverzekering-niet-betaal', 'kennis');
  q('zorg', 'zo2-022', 'Wanbetaling', "Hoe betaalt een wanbetaler die bij het CAK is aangemeld zijn premie?",
    ["Hij betaalt een hogere bestuursrechtelijke premie, die vaak wordt ingehouden op loon, uitkering of pensioen", "Hij betaalt geen premie meer", "Hij betaalt de gewone premie aan zijn verzekeraar", "De gemeente betaalt de premie"], 0,
    "De bestuursrechtelijke premie is hoger dan de gewone premie. Werkgever, uitkeringsinstantie of pensioenuitvoerder houdt die in en draagt af aan het CAK.", 'https://www.hetcak.nl/betalingsachterstand-zorgpremie/', 'kennis');
  q('zorg', 'zo2-023', 'Wanbetaling', "Hoe hoog is de bestuursrechtelijke premie in de regeling betalingsachterstand zorgpremie vanaf 1 januari 2026?",
    ["€ 172,70 per maand", "€ 140,00 per maand", "€ 385,00 per maand", "€ 100,00 per maand"], 0,
    "Volgens het CAK is het maandbedrag vanaf 1 januari 2026 € 172,70.", 'https://www.hetcak.nl/betalingsachterstand-zorgpremie/', 'kennis');
  q('zorg', 'zo2-024', 'Onverzekerd', "Het CAK ontdekt dat iemand geen zorgverzekering heeft. Wat gebeurt er eerst?",
    ["Hij krijgt een brief en moet binnen 3 maanden een verzekering afsluiten of aantonen dat hij niet verzekerd hoeft te zijn; anders volgt een boete", "Hij wordt direct strafrechtelijk vervolgd", "Hij wordt automatisch bijverzekerd bij zijn partner", "Er gebeurt niets"], 0,
    "Na de brief heeft hij drie maanden. Gebeurt er niets, dan volgt een boete. Na twee boetes sluit het CAK een verzekering voor hem af en wordt de premie ingehouden op zijn inkomen.", RO_ZV + 'wat-gebeurt-er-als-ik-niet-verzekerd-ben-voor-de-zorgverzekering', 'kennis');
  q('zorg', 'zo2-025', 'Onverzekerd', "Een klant was drie maanden niet verzekerd en sluit nu een verzekering af. Wat geldt voor de zorgkosten in die periode?",
    ["Die betaalt hij zelf; hij hoeft over de onverzekerde periode geen premie na te betalen", "Die worden alsnog vergoed", "Die worden door het CAK betaald", "Die worden door de gemeente vergoed"], 0,
    "Over de onverzekerde periode betaalt hij geen premie met terugwerkende kracht, maar zorgkosten uit die periode komen voor zijn eigen rekening.", RO_ZV + 'ben-ik-verplicht-een-zorgverzekering-af-te-sluiten', 'toepassing');
  q('zorg', 'zo2-026', 'Begrippen', "Wat is het verschil tussen eigen risico en eigen bijdrage?",
    ["Eigen risico is het bedrag dat je per jaar zelf betaalt voordat de verzekeraar vergoedt; een eigen bijdrage is een deel van de kosten van bepaalde zorg dat je altijd zelf betaalt", "Er is geen verschil", "Een eigen bijdrage geldt alleen voor kinderen", "Eigen risico geldt alleen voor aanvullende verzekeringen"], 0,
    "Voor sommige zorg, zoals bepaalde hulpmiddelen, betaal je een eigen bijdrage, los van het eigen risico.", RO_ZV + 'verschil-eigen-bijdrage-eigen-risico', 'kennis');
  q('zorg', 'zo2-027', 'Wlz', "Wie beoordeelt of iemand recht heeft op zorg uit de Wet langdurige zorg (Wlz)?",
    ["Het CIZ (Centrum Indicatiestelling Zorg)", "De zorgverzekeraar", "De gemeente", "De huisarts"], 0,
    "Het CIZ geeft een Wlz-indicatie af. De zorgkantoren zorgen daarna voor de uitvoering.", 'https://www.rijksoverheid.nl/onderwerpen/verpleeghuizen-en-zorginstellingen/vraag-en-antwoord/wlz-indicatie-aanvragen', 'kennis');
  q('zorg', 'zo2-028', 'Wmo', "Een oudere heeft hulp nodig bij het huishouden om thuis te kunnen blijven wonen. Via welke regeling en instantie loopt dat?",
    ["De Wmo, via de gemeente", "De Zorgverzekeringswet, via de verzekeraar", "De Wlz, via het CIZ", "De AOW, via de SVB"], 0,
    "Ondersteuning thuis, zoals huishoudelijke hulp, regelt de gemeente via de Wet maatschappelijke ondersteuning (Wmo).", 'https://www.rijksoverheid.nl/onderwerpen/verpleeghuizen-en-zorginstellingen/vraag-en-antwoord/mogelijkheden-langdurige-zorg', 'toepassing');
  q('zorg', 'zo2-029', 'Wijkverpleging', "Via welke wet wordt verpleging thuis (wijkverpleging) vergoed?",
    ["De Zorgverzekeringswet, zonder eigen risico", "De Wmo, met eigen bijdrage", "De Wlz", "De Participatiewet"], 0,
    "Wijkverpleging valt onder de basisverzekering en het eigen risico is er niet op van toepassing.", RO_ZV + 'eigen-risico-zorgverzekering', 'kennis');
  q('zorg', 'zo2-030', 'Zvw-bijdrage', "Een IB-ondernemer heeft in 2026 een bijdrage-inkomen van € 50.000. Hoeveel inkomensafhankelijke bijdrage Zvw betaalt hij?",
    ["€ 2.425", "€ 3.050", "€ 3.851", "€ 1.925"], 0,
    "De bijdrage voor ondernemers is in 2026 4,85%: € 50.000 × 4,85% = € 2.425. Daarnaast betaalt hij de nominale premie aan zijn verzekeraar.", BD_ZVW, 'casus');
  q('zorg', 'zo2-031', 'Zvw-bijdrage', "Wat is in 2026 de maximale inkomensafhankelijke bijdrage Zvw voor een ondernemer?",
    ["€ 3.851,34 (4,85% over € 79.409)", "€ 4.843,95 (6,10% over € 79.409)", "Er is geen maximum", "€ 385"], 0,
    "Het bijdrage-inkomen is gemaximeerd op € 79.409. 4,85% daarvan is € 3.851,34.", BD_ZVW, 'casus');
  q('zorg', 'zo2-032', 'Zvw-bijdrage', "Wie betaalt de inkomensafhankelijke bijdrage Zvw voor een werknemer in loondienst?",
    ["De werkgever, via de werkgeversheffing Zvw (6,10% in 2026)", "De werknemer zelf via zijn verzekeraar", "De zorgverzekeraar", "Niemand, werknemers zijn vrijgesteld"], 0,
    "Voor werknemers betaalt de werkgever de werkgeversheffing Zvw. De werknemer betaalt zelf de nominale premie aan zijn verzekeraar.", BD_ZVW, 'kennis');
  q('zorg', 'zo2-033', 'Zorgtoeslag', "Welke instantie keert de zorgtoeslag uit?",
    ["Dienst Toeslagen", "De zorgverzekeraar", "Het CAK", "De gemeente"], 0,
    "Zorgtoeslag is een inkomensafhankelijke tegemoetkoming in de premie. Dienst Toeslagen keert die uit.", RO_ZV + 'premie-zorgverzekering', 'kennis');
  q('zorg', 'zo2-034', 'Basispakket', "Wie bepaalt welke zorg in het basispakket zit?",
    ["De overheid (minister van VWS), op advies van onder meer het Zorginstituut Nederland", "Iedere zorgverzekeraar zelf", "De huisarts", "Het Kifid"], 0,
    "De inhoud van het basispakket is wettelijk vastgelegd en voor iedereen gelijk. Verzekeraars bepalen wel de inhoud van aanvullende verzekeringen.", RO_ZV + 'wat-zit-er-in-het-basispakket-van-de-zorgverzekering', 'kennis');
  q('zorg', 'zo2-035', 'Basispakket', "Een volwassene laat gebitscontroles en vullingen doen bij de tandarts. Hoe worden die kosten doorgaans vergoed?",
    ["Niet uit de basisverzekering; een aanvullende tandartsverzekering kan ze vergoeden", "Volledig uit de basisverzekering", "Uit de basisverzekering, na het eigen risico", "Door de gemeente"], 0,
    "Gewone tandheelkundige zorg voor volwassenen zit niet in het basispakket (op uitzonderingen na). Een aanvullende verzekering kan uitkomst bieden.", RO_ZV + 'wat-zit-er-in-het-basispakket-van-de-zorgverzekering', 'toepassing');
  q('zorg', 'zo2-036', 'Verzekeringsplicht', "Wie moet een Nederlandse basisverzekering afsluiten?",
    ["In principe iedereen die in Nederland woont of in Nederland werkt en daar loonbelasting betaalt", "Alleen werknemers", "Alleen Nederlanders", "Alleen wie ouder is dan 18 en een inkomen heeft"], 0,
    "De verzekeringsplicht geldt voor wie in Nederland woont of werkt. Er zijn uitzonderingen, zoals gemoedsbezwaarden en militairen in actieve dienst.", RO_ZV + 'ben-ik-verplicht-een-zorgverzekering-af-te-sluiten', 'kennis');
  q('zorg', 'zo2-037', 'Verzekeringsplicht', "Wie kan een vrijstelling van de verzekeringsplicht voor de zorgverzekering krijgen?",
    ["Gemoedsbezwaarden die op grond van hun levensovertuiging geen verzekering willen", "Iedereen met een hoog inkomen", "Iedereen die nooit ziek is", "Studenten"], 0,
    "Gemoedsbezwaarden kunnen onder voorwaarden vrijstelling krijgen. Zij betalen dan wel een bijdrage en dragen de zorgkosten zelf.", 'https://www.rijksoverheid.nl/wetten-en-regelingen/productbeschrijvingen/vrijstelling-verzekeringsplicht-zorgverzekering', 'kennis');
  q('zorg', 'zo2-038', 'Buitenland', "Hoe vergoedt de basisverzekering spoedeisende zorg tijdens een vakantie in het buitenland?",
    ["Tot maximaal het Nederlandse tarief; meerkosten kunnen voor eigen rekening komen", "Altijd volledig, ongeacht het tarief", "Helemaal niet", "Alleen binnen de EU en alleen na toestemming vooraf"], 0,
    "De basisverzekering vergoedt spoedzorg in het buitenland tot het Nederlandse tarief. Een reis- of aanvullende verzekering kan de meerkosten dekken.", RO_ZV + 'wat-zit-er-in-het-basispakket-van-de-zorgverzekering', 'kennis');
  q('zorg', 'zo2-039', 'Toezicht', "Welke toezichthouder ziet erop toe dat zorgverzekeraars hun zorgplicht en acceptatieplicht naleven?",
    ["De Nederlandse Zorgautoriteit (NZa)", "Het Kifid", "Het CBS", "Het CIZ"], 0,
    "De NZa houdt toezicht op zorgverzekeraars, onder meer op zorgplicht en acceptatieplicht. Advies over en bemiddeling in zorgverzekeringen valt daarnaast onder het Wft-gedragstoezicht van de AFM.", 'https://www.nza.nl/zorgsectoren/zorgverzekeraars/wat-verwachten-we-van-zorgverzekeraars', 'kennis');
  q('zorg', 'zo2-040', 'Examen', "Hoe is het initiële Wft-examen Zorgverzekeringen opgebouwd?",
    ["33 vragen in 90 minuten, cesuur 68% van de punten", "55 vragen in 120 minuten", "42 vragen in 120 minuten", "23 vragen in 60 minuten"], 0,
    "Volgens het CDFD duurt het examen Zorgverzekeringen 90 minuten en telt het 33 vragen (52 punten).", 'https://cdfd.nl/initieel-examen-zorgverzekeringen/', 'kennis');
  q('zorg', 'zo2-041', 'Advies', "Een klant met een aanvullende verzekering wil overstappen naar een andere verzekeraar en heeft een lopende tandartsbehandeling. Waar wijs je op?",
    ["Dat de nieuwe verzekeraar hem voor de aanvullende verzekering mag weigeren of medische vragen mag stellen, en dat vergoedingen en wachttijden kunnen verschillen", "Dat hij altijd met dezelfde voorwaarden wordt geaccepteerd", "Dat de lopende behandeling automatisch wordt overgenomen", "Dat overstappen voor aanvullende verzekeringen niet mag"], 0,
    "Voor aanvullende verzekeringen geldt geen acceptatieplicht. Vergelijk dekking, maxima en eventuele wachttijden voordat de klant opzegt.", RO_ZV + 'acceptatieplicht-zorgverzekering', 'toepassing');
  q('zorg', 'zo2-042', 'Polisvormen', "Wat is meestal kenmerkend voor een budgetpolis?",
    ["Een naturapolis met een beperkter aantal gecontracteerde zorgverleners en een lagere premie", "Een restitutiepolis met hogere vergoedingen", "Een polis zonder eigen risico", "Een aanvullende verzekering voor tandartskosten"], 0,
    "Een budgetpolis is meestal een naturapolis met minder gecontracteerde zorgverleners. Bij een zorgverlener zonder contract kan de bijbetaling fors zijn.", RO_ZV + 'polissen-zorgverzekeraar', 'kennis');

  window.OEFENVRAGEN = (window.OEFENVRAGEN || []).concat(V);
})();
