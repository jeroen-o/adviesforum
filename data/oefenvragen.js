/* OEFENVRAGEN van het Adviesforum – "Oefenen voor PE en Wft"
 *
 * Eigen oefenvragen (meerkeuze, 4 opties, precies 1 juist antwoord) voor financieel adviseurs.
 * GEEN officiële CDFD-examenvragen. Feiten komen uit de kennisbank van het Adviesforum (data/kennisbank*.js),
 * uit js/rekentools/normen.js (fiscale normen 2026, geverifieerd 2026-10-02) of zijn algemeen bekende basisregels.
 *
 * Velden per vraag:
 *   id        unieke code (prefix per module)
 *   module    basis | hypotheek | inkomen | pensioen | vermogen | krediet | schade
 *   onderwerp kort label
 *   vraag     de vraag
 *   opties    precies 4 antwoorden; de volgorde wordt op de pagina willekeurig gemaakt
 *   juist     index (0-3) van het juiste antwoord in 'opties'
 *   uitleg    waarom het juiste antwoord juist is
 *   bron      kennisbank-id (bijv. 'k62' → index.html#artikel-k62), een pagina van de site (bijv. 'erfpacht.html')
 *             of een externe URL van een officiële bron
 * Peildatum: oktober 2026.
 */
(function () {
  'use strict';
  const M = [
    { id: 'basis', naam: 'Basis', omschrijving: 'Wft, zorgplicht, AFM, Kifid, Wwft, AVG, provisieverbod en vergelijkingskaart' },
    { id: 'hypotheek', naam: 'Hypothecair krediet', omschrijving: 'Leennormen, NHG 2026, fiscaliteit eigen woning, aflossingseis, Hillen, overbrugging, oversluiten, rentemiddeling, erfpacht en verduurzaming' },
    { id: 'inkomen', naam: 'Inkomen', omschrijving: 'WIA (WGA/IVA), WW, AOV, ORV en woonlastenverzekering' },
    { id: 'pensioen', naam: 'Pensioen', omschrijving: 'AOW, Wtp, jaarruimte en lijfrente' },
    { id: 'vermogen', naam: 'Vermogen', omschrijving: 'Box 3, basis beleggen en risicoprofiel' },
    { id: 'krediet', naam: 'Consumptief krediet', omschrijving: 'CCD, BKR en leennormen' },
    { id: 'schade', naam: 'Schade particulier', omschrijving: 'Opstal, inboedel, AVP en onderverzekering' }
  ];
  const V = [];
  const q = (module, id, onderwerp, vraag, opties, juist, uitleg, bron) =>
    V.push({ id, module, onderwerp, vraag, opties, juist, uitleg, bron });

  /* ================= BASIS ================= */
  q('basis', 'b01', 'Toezicht', "Welke toezichthouder houdt in Nederland gedragstoezicht op financieel adviseurs en bemiddelaars?",
    ["De Autoriteit Financiële Markten (AFM)", "De Nederlandsche Bank (DNB)", "Het Kifid", "De Autoriteit Persoonsgegevens"], 0,
    "De AFM houdt gedragstoezicht: zij ziet erop toe dat financiële ondernemingen zich zorgvuldig gedragen tegenover klanten. DNB houdt prudentieel toezicht (soliditeit), het Kifid behandelt klachten en de AP houdt toezicht op de AVG.", 'k20');
  q('basis', 'b02', 'Toezicht', "Wat is de kern van het prudentieel toezicht door De Nederlandsche Bank?",
    ["Toezicht op de financiële soliditeit van banken, verzekeraars en pensioenfondsen", "Het behandelen van klachten van consumenten", "Het toezicht op de kwaliteit van advies aan consumenten", "Het afnemen van Wft-examens"], 0,
    "DNB kijkt of financiële instellingen solide zijn en hun verplichtingen kunnen nakomen. Het gedragstoezicht (onder meer de kwaliteit van advies) ligt bij de AFM.", 'k20');
  q('basis', 'b03', 'Wft', "Wat heeft een onderneming nodig om consumenten te adviseren over of te bemiddelen in financiële producten?",
    ["Een vergunning van de AFM", "Alleen een inschrijving bij de Kamer van Koophandel", "Een erkenning van het Kifid", "Een vergunning van DNB"], 0,
    "Adviseren en bemiddelen zijn vergunningplichtige activiteiten onder de Wft. De vergunning wordt verleend door de AFM, die ook het register bijhoudt.", 'k66');
  q('basis', 'b04', 'Vakbekwaamheid', "Wat wordt bedoeld met PE in het kader van de Wft-vakbekwaamheid?",
    ["Permanente educatie: de adviseur houdt zijn kennis aantoonbaar actueel", "Persoonlijke evaluatie door de AFM", "Een periodieke examenvrijstelling", "Productevaluatie door de aanbieder"], 0,
    "Een adviseur moet niet alleen eenmalig vakbekwaam worden, maar die vakbekwaamheid ook actueel houden. Dat gebeurt via permanente educatie (PE).", 'k66');
  q('basis', 'b05', 'Vakbekwaamheid', "Welke Wft-module vormt de gemeenschappelijke basis naast de specialistische modules voor adviseurs?",
    ["Wft Basis", "Wft Hypothecair krediet", "Wft Pensioen", "Wft Schade particulier"], 0,
    "Wft Basis bevat de algemene kennis (wetgeving, toezicht, klantbelang, ethiek, economie) die bij alle specialistische adviesmodules hoort.", 'k66');
  q('basis', 'b06', 'Zorgplicht', "Wat houdt de algemene zorgplicht van een financieel dienstverlener in?",
    ["Zorgvuldig handelen en rekening houden met de rechtmatige belangen van de klant", "Altijd het goedkoopste product adviseren", "De klant garanderen dat het advies financieel goed uitpakt", "Alleen de wettelijke informatieplichten naleven"], 0,
    "De algemene zorgplicht (art. 4:24a Wft) is een open norm: de dienstverlener handelt zorgvuldig en houdt rekening met de rechtmatige belangen van de klant. Dat gaat verder dan alleen de specifieke informatieplichten, maar is geen resultaatsgarantie.", 'k64');
  q('basis', 'b07', 'Zorgplicht', "Waarom inventariseer je bij advies de financiële positie, kennis en ervaring, doelstellingen en risicobereidheid van de klant?",
    ["Om een advies te geven dat passend is voor deze klant", "Omdat de geldverstrekker dat voor zijn marketing vraagt", "Om de beloning van de adviseur te bepalen", "Alleen omdat het Kifid dat bij een klacht opvraagt"], 0,
    "De Wft verplicht de adviseur om deze informatie in te winnen, zodat het advies past bij de situatie van de klant (ken-uw-klant). Leg de inventarisatie vast in het dossier.", 'k32');
  q('basis', 'b08', 'Zorgplicht', "Een klant wil afwijken van jouw advies. Wat is de juiste aanpak?",
    ["De risico's van de afwijking uitleggen en zowel advies als keuze van de klant vastleggen", "Weigeren de klant verder te helpen", "Het advies aanpassen zodat het aansluit bij de wens van de klant", "Niets vastleggen, omdat de klant zelf kiest"], 0,
    "Bij afwijkend advies blijft de zorgplicht bestaan. Leg vast wat je adviseerde, waarom de klant anders kiest en dat je de gevolgen hebt besproken.", 'k8');
  q('basis', 'b09', 'Zorgplicht', "Wat kenmerkt een execution-only-dienstverlening?",
    ["De klant ontvangt geen advies en neemt zelf de productkeuze", "De adviseur geeft een verkort advies", "De klant betaalt geen enkele vergoeding", "De zorgplicht van de dienstverlener vervalt volledig"], 0,
    "Bij execution only geeft de dienstverlener geen advies. De klant moet zich daarvan bewust zijn. De algemene zorgplicht en informatieplichten blijven wel gelden.", 'k110');
  q('basis', 'b10', 'Zorgplicht', "Wat is de status van een leidraad van de AFM, zoals de Leidraad Hypotheekadvisering?",
    ["Het geeft aan hoe de AFM open normen uit de wet uitlegt; het is zelf geen wet", "Het is een wet die door de Tweede Kamer is vastgesteld", "Het is een vrijblijvende brochure zonder betekenis voor het toezicht", "Het is een uitspraak van het Kifid"], 0,
    "Een leidraad maakt duidelijk hoe de AFM wettelijke (open) normen interpreteert en waar zij in het toezicht op let. De wet blijft de basis, maar de leidraad is een belangrijk referentiepunt.", 'k11');
  q('basis', 'b11', 'Zorgplicht', "Wat verwacht de AFM van adviseurs bij klanten met een aflossingsvrije hypotheek in het kader van nazorg?",
    ["Dat klanten actief worden benaderd om de risico's en mogelijkheden te bespreken", "Dat de adviseur de hypotheek zelf aflost", "Dat de adviseur pas reageert als de klant een klacht indient", "Dat de adviseur de klant adviseert altijd over te sluiten"], 0,
    "De AFM benadrukt een actieve rol: klanten met aflossingsvrije leningen moeten tijdig bewust worden gemaakt van het risico aan het einde van de looptijd en hun mogelijkheden.", 'k64');
  q('basis', 'b12', 'AFM', "Welke bevoegdheid heeft de AFM bij overtreding van de Wft?",
    ["Zij kan onder meer een bestuurlijke boete of een last onder dwangsom opleggen", "Zij kan bindende uitspraken doen over schadevergoeding aan een individuele klant", "Zij kan een adviseur strafrechtelijk veroordelen", "Zij heeft geen handhavingsbevoegdheden"], 0,
    "De AFM heeft bestuursrechtelijke handhavingsmiddelen, zoals een aanwijzing, last onder dwangsom en bestuurlijke boete. Over schadevergoeding in een individueel geschil oordeelt het Kifid of de rechter.", 'k63');
  q('basis', 'b13', 'AFM', "Een consument dient bij de AFM een klacht in over zijn adviseur. Wat doet de AFM daarmee?",
    ["Zij behandelt geen individuele klachten, maar gebruikt de melding als signaal voor het toezicht", "Zij doet een bindende uitspraak", "Zij stuurt de klacht door naar DNB", "Zij kent de consument een schadevergoeding toe"], 0,
    "De AFM lost geen individuele geschillen op. Verwijs de klant naar de interne klachtenprocedure en daarna naar het Kifid.", 'k62');
  q('basis', 'b14', 'Kifid', "Wat is het Kifid?",
    ["Het klachteninstituut voor geschillen tussen consumenten en financiële dienstverleners", "De toezichthouder op vakbekwaamheid", "Het register van kredieten", "Het examenbureau voor Wft-diploma's"], 0,
    "Een financiële dienstverlener moet aangesloten zijn bij een erkende geschilleninstantie; voor financiële dienstverlening is dat het Kifid.", 'k62');
  q('basis', 'b15', 'Kifid', "Na hoeveel weken zonder definitief standpunt van de dienstverlener kan het Kifid een klacht in behandeling nemen?",
    ["Acht weken", "Twee weken", "Zes maanden", "Een jaar"], 0,
    "Het Kifid neemt een klacht in behandeling als de dienstverlener binnen acht weken geen definitief standpunt heeft ingenomen, of als de klant het niet eens is met dat standpunt.", 'k62');
  q('basis', 'b16', 'Kifid', "Binnen welke termijn kan een klant na het definitieve standpunt van de dienstverlener naar het Kifid, als in dat standpunt op deze termijn is gewezen?",
    ["Drie maanden", "Vier weken", "Vijf jaar", "Er geldt geen termijn"], 0,
    "De klant kan binnen drie maanden na het definitieve schriftelijke standpunt naar het Kifid, mits je op die termijn hebt gewezen. Daarnaast geldt in elk geval een termijn van een jaar na het indienen van de klacht bij jou.", 'k62');
  q('basis', 'b17', 'Kifid', "Wie beoordeelt bij voorkeur een klacht binnen het adviesbureau?",
    ["Iemand die niet zelf het advies heeft gegeven", "Altijd de adviseur die het advies gaf", "De geldverstrekker", "Het Kifid"], 0,
    "Een onafhankelijke beoordeling binnen het kantoor maakt de klachtbehandeling zorgvuldiger en geloofwaardiger.", 'k62');
  q('basis', 'b18', 'Kifid', "Wat moet je in je definitieve standpunt op een klacht in elk geval vermelden?",
    ["Dat de klant naar het Kifid kan en binnen welke termijn", "De naam van de AFM-toezichthouder", "Het BKR-nummer van de klant", "Een overzicht van alle andere klachten"], 0,
    "Door op het Kifid en de termijn te wijzen, gaat de termijn van drie maanden lopen en weet de klant welke vervolgstap hij heeft.", 'k62');
  q('basis', 'b19', 'Provisieverbod', "Sinds wanneer geldt het provisieverbod voor onder meer hypothecair krediet?",
    ["1 januari 2013", "1 januari 2007", "1 april 2023", "1 januari 2018"], 0,
    "Het provisieverbod geldt sinds 1 januari 2013. De adviseur ontvangt voor de producten die eronder vallen geen provisie van de aanbieder; de klant betaalt rechtstreeks.", 'k61');
  q('basis', 'b20', 'Provisieverbod', "Voor welk product geldt het provisieverbod?",
    ["Hypothecair krediet", "Een inboedelverzekering", "Een opstalverzekering", "Een reisverzekering"], 0,
    "Hypothecair krediet valt onder het provisieverbod. Schadeverzekeringen zoals inboedel, opstal en reis vallen daar niet onder.", 'k61');
  q('basis', 'b21', 'Provisieverbod', "Wat is het doel van het provisieverbod?",
    ["Voorkomen dat het advies wordt gestuurd door wat een aanbieder de adviseur betaalt", "De rente op hypotheken verlagen", "Het aantal adviseurs beperken", "Advieskosten fiscaal aftrekbaar maken"], 0,
    "Met directe beloning door de klant verdwijnt de financiële prikkel om een bepaald product of een bepaalde aanbieder te adviseren.", 'k61');
  q('basis', 'b22', 'Provisieverbod', "Hoe regel je de beloning bij producten onder het provisieverbod?",
    ["Vooraf met de klant afspreken en vastleggen, bijvoorbeeld in een opdrachtbevestiging", "Achteraf bepalen op basis van de hoogte van de lening", "Laten betalen door de geldverstrekker via de rente", "Niet vastleggen, want de klant ziet het op de factuur"], 0,
    "Bij directe beloning zijn productprijs en dienstverleningsprijs gescheiden. Spreek de beloning vooraf af en leg die vast; kies zelf voor vast bedrag, uurtarief of abonnement.", 'k61');
  q('basis', 'b23', 'Vergelijkingskaart', "Welk document verving per 1 april 2023 het dienstverleningsdocument?",
    ["De vergelijkingskaart", "De opdrachtbevestiging", "Het adviesrapport", "Het Europees Standaardinformatieblad (ESIS)"], 0,
    "Sinds 1 april 2023 geef je bij producten onder het provisieverbod een vergelijkingskaart, in de plaats van het dienstverleningsdocument.", 'k61');
  q('basis', 'b24', 'Vergelijkingskaart', "Wanneer moet de klant de vergelijkingskaart uiterlijk hebben ontvangen?",
    ["Voordat je advies geeft", "Bij het passeren van de hypotheekakte", "Binnen een maand na het advies", "Alleen als de klant erom vraagt"], 0,
    "De kaart geef je vóór, tijdens of na het eerste oriënterende gesprek, maar in elk geval voordat je advies geeft. Bied hem ook aan op je website.", 'k61');
  q('basis', 'b25', 'Vergelijkingskaart', "Wat is het belangrijkste doel van de vergelijkingskaart?",
    ["Dat consumenten dienstverlening en kosten van adviseurs kunnen vergelijken", "Dat consumenten hypotheekrentes kunnen vergelijken", "Dat de AFM de omzet van kantoren kan volgen", "Dat de klant zijn klachtrecht kent"], 0,
    "De kaart beschrijft aard en omvang van de dienstverlening, onafhankelijkheid, kosten en belangen, zodat de consument adviseurs naast elkaar kan leggen.", 'k61');
  q('basis', 'b26', 'Wwft', "Waar meldt een Wwft-instelling een ongebruikelijke transactie?",
    ["Bij de FIU-Nederland", "Bij het Kifid", "Bij de Autoriteit Persoonsgegevens", "Bij het BKR"], 0,
    "Ongebruikelijke transacties worden gemeld bij de Financial Intelligence Unit Nederland (FIU-Nederland).", 'k65');
  q('basis', 'b27', 'Wwft', "Wanneer valt een financieel adviseur in elk geval onder de Wwft?",
    ["Als hij bemiddelt in levensverzekeringen", "Als hij alleen schadeverzekeringen adviseert", "Als hij meer dan tien klanten heeft", "Nooit; de Wwft geldt alleen voor banken"], 0,
    "De Wwft noemt onder meer financiële dienstverleners die bemiddelen in levensverzekeringen. Wie alleen over hypotheken of schadeverzekeringen adviseert, is doorgaans geen Wwft-instelling.", 'k65');
  q('basis', 'b28', 'Wwft', "Wat moet het cliëntenonderzoek onder de Wwft in elk geval opleveren?",
    ["Wie de klant is, wie de uiteindelijk belanghebbende is en wat het doel van de relatie is", "Een volledige kredietwaardigheidstoets", "Een overzicht van alle verzekeringen van de klant", "Een medische verklaring"], 0,
    "De Wwft schrijft voor wat het onderzoek moet opleveren: identificatie en verificatie van de klant, de uiteindelijk belanghebbende (UBO) en het doel en de aard van de relatie.", 'k65');
  q('basis', 'b29', 'Wwft', "Wie vallen naast de politiek prominente persoon (PEP) zelf ook onder de PEP-regels?",
    ["Familieleden en naaste geassocieerden", "Alleen de werkgever van de PEP", "Niemand anders", "Alle inwoners van dezelfde gemeente"], 0,
    "Ook familieleden en naaste geassocieerden van een PEP vallen eronder. Extra maatregelen moeten wel passen bij het risico van de persoon.", 'k65');
  q('basis', 'b30', 'Wwft', "Een kantoor gebruikt een externe tool voor de PEP-check. Wie is verantwoordelijk voor de uitkomst?",
    ["Het kantoor zelf", "De leverancier van de tool", "De AFM", "De klant"], 0,
    "Uitbesteden van de check neemt de verantwoordelijkheid niet weg. Controleer of de tool doet wat hij moet doen.", 'k65');
  q('basis', 'b31', 'AVG', "Binnen welke termijn moet een datalek dat een risico vormt voor betrokkenen worden gemeld bij de Autoriteit Persoonsgegevens?",
    ["Binnen 72 uur na ontdekking", "Binnen 14 dagen", "Binnen een maand", "Alleen als de klant dat wil"], 0,
    "De AVG verplicht om een meldplichtig datalek zonder onnodige vertraging en zo mogelijk binnen 72 uur na ontdekking te melden bij de AP.", 'https://www.autoriteitpersoonsgegevens.nl');
  q('basis', 'b32', 'AVG', "Welke gegevens van een klant gelden onder de AVG als bijzondere persoonsgegevens?",
    ["Gegevens over gezondheid", "Het e-mailadres", "Het bruto jaarinkomen", "De WOZ-waarde van de woning"], 0,
    "Gezondheidsgegevens zijn bijzondere persoonsgegevens, met een strenger regime. Dat speelt bijvoorbeeld bij medische acceptatie van een ORV of AOV.", 'https://www.autoriteitpersoonsgegevens.nl');
  q('basis', 'b33', 'AVG', "Wat betekent het AVG-beginsel dataminimalisatie voor een adviesdossier?",
    ["Je verwerkt niet meer persoonsgegevens dan nodig voor het doel", "Je bewaart gegevens zo lang mogelijk", "Je mag alleen digitaal werken", "Je hoeft geen toestemming of andere grondslag te hebben"], 0,
    "Verwerk alleen de gegevens die nodig zijn voor advies en bemiddeling, en bewaar ze niet langer dan nodig of wettelijk verplicht.", 'k3');
  q('basis', 'b34', 'AVG', "Een klant vraagt welke persoonsgegevens jouw kantoor van hem verwerkt. Op welk recht doet hij een beroep?",
    ["Recht op inzage", "Recht op vergetelheid", "Recht van bezwaar tegen het Kifid", "Recht op dataportabiliteit naar de AFM"], 0,
    "Iedere betrokkene heeft recht op inzage in de gegevens die over hem worden verwerkt. Reageer tijdig, in principe binnen een maand.", 'k3');
  q('basis', 'b35', 'Dossier', "Hoe ga je om met bewaartermijnen van een adviesdossier?",
    ["Je hanteert vastgelegde termijnen die passen bij wettelijke eisen en het doel, en verwijdert daarna", "Je bewaart alles altijd voor onbepaalde tijd", "Je verwijdert het dossier direct na het passeren", "Je laat de klant de termijn bepalen"], 0,
    "De AVG verbiedt langer bewaren dan nodig, terwijl Wft, fiscale regels en verjaringstermijnen soms langer bewaren nodig maken. Leg je beleid vast.", 'k3');

  /* ================= HYPOTHECAIR KREDIET ================= */
  q('hypotheek', 'h01', 'NHG 2026', "Wat is de NHG-grens in 2026 voor een woning zonder energiebesparende voorzieningen?",
    ["€ 470.000", "€ 450.000", "€ 435.000", "€ 498.200"], 0,
    "De NHG-grens is in 2026 € 470.000 voor bestaande bouw en nieuwbouw (2025: € 450.000).", 'k70');
  q('hypotheek', 'h02', 'NHG 2026', "Tot welk bedrag kan de lening met NHG in 2026 maximaal gaan als het meerdere wordt gebruikt voor energiebesparende voorzieningen?",
    ["€ 498.200", "€ 470.000", "€ 477.000", "€ 520.000"], 0,
    "Bovenop € 470.000 kan € 28.200 voor energiebesparende voorzieningen worden gefinancierd: samen € 498.200.", 'k70');
  q('hypotheek', 'h03', 'NHG 2026', "Hoeveel borgtochtprovisie betaalt de klant in 2026 bij aankoop van een woning met NHG?",
    ["Eenmalig 0,4% over de hoofdsom van de lening", "Jaarlijks 0,4% over de restschuld", "Eenmalig 1% over de koopsom", "Niets; NHG is kosteloos"], 0,
    "De borgtochtprovisie is eenmalig 0,4% over de hoofdsom. Fiscaal is het een aftrekbare financieringskost.", 'k70');
  q('hypotheek', 'h04', 'NHG 2026', "Een bestaande NHG-lening wordt verhoogd. Waarover betaalt de klant borgtochtprovisie?",
    ["Alleen over het bedrag van de verhoging", "Over de nieuwe totale lening", "Over de marktwaarde van de woning", "Er is geen provisie verschuldigd"], 0,
    "Bij verhogen van een bestaande NHG-lening is de provisie 0,4% over alleen de verhoging.", 'k70');
  q('hypotheek', 'h05', 'NHG 2026', "Welk eigen risico draagt de geldverstrekker bij een verlies op een NHG-lening?",
    ["10%", "0%", "25%", "50%"], 0,
    "NHG vergoedt de geldverstrekker een verlies na verkoop, minus een eigen risico van 10% voor de geldverstrekker.", 'k70');
  q('hypotheek', 'h06', 'NHG 2026', "Hoe ontwikkelt de NHG-borgtocht zich tijdens de looptijd?",
    ["Hij daalt maandelijks alsof de lening annuïtair wordt afgelost", "Hij blijft gelijk tot het einde van de looptijd", "Hij stijgt met de inflatie", "Hij vervalt na tien jaar"], 0,
    "De borg daalt maandelijks volgens een annuïtair schema in de afgesproken looptijd (maximaal 30 jaar), ook als de lening zelf aflossingsvrij is.", 'k70');
  q('hypotheek', 'h07', 'NHG 2026', "Wanneer kan een klant met NHG kwijtschelding van een restschuld krijgen?",
    ["Als hij te goeder trouw niet kon betalen en volledig heeft meegewerkt", "Altijd, zonder voorwaarden", "Alleen als de woning boven de marktwaarde is verkocht", "Nooit"], 0,
    "Kwijtschelding is mogelijk bij goede trouw en volledige medewerking aan verkoop en aflossing. Had de klant genoeg inkomen of vermogen, dan betaalt hij mee.", 'k70');
  q('hypotheek', 'h08', 'NHG 2026', "Welke voorwaarde geldt voor iedere aanvrager van een lening met NHG?",
    ["Hij is (mede-)eigenaar, hoofdelijk aansprakelijk en bewoont de woning als hoofdverblijf", "Hij heeft een vast contract voor onbepaalde tijd", "Hij is jonger dan 35 jaar", "Hij heeft geen studieschuld"], 0,
    "NHG eist dat elke aanvrager hoofdelijk aansprakelijk en (mede-)eigenaar is en de woning als hoofdverblijf bewoont.", 'k70');
  q('hypotheek', 'h09', 'NHG 2026', "Krijgt de klant borgtochtprovisie terug als hij de NHG-lening na een paar jaar aflost?",
    ["Nee, er volgt geen terugbetaling", "Ja, naar verhouding van de resterende looptijd", "Ja, volledig", "Alleen bij verhuizing"], 0,
    "Eindigt de borgstelling eerder, dan krijgt de klant niets terug van de eenmalige provisie.", 'k70');
  q('hypotheek', 'h10', 'Leennormen', "Hoe worden de Nibud-financieringslastpercentages voor 2026 afgerond?",
    ["Naar beneden op 0,1 procentpunt", "Naar beneden op 0,5 procentpunt", "Naar boven op 1 procentpunt", "Ze worden niet afgerond"], 0,
    "Nieuw voor 2026 is afronding op 0,1 procentpunt in plaats van 0,5. Dat verkleint sprongen in de maximale hypotheek bij een kleine wijziging in inkomen of rente.", 'k10');
  q('hypotheek', 'h11', 'Leennormen', "Hoe telt het tweede inkomen mee in de leennormen voor 2026?",
    ["Volledig", "Voor 50%", "Voor 90%", "Niet"], 0,
    "Sinds 2023 telt het inkomen van de minstverdienende partner volledig mee bij het bepalen van de maximale hypotheek.", 'k10');
  q('hypotheek', 'h12', 'Leennormen', "Met welke rente wordt minimaal getoetst als de rentevaste periode korter is dan tien jaar?",
    ["5%", "De werkelijke rente", "3%", "8%"], 0,
    "Bij een rentevaste periode korter dan tien jaar geldt een minimale toetsrente van 5%. Bij tien jaar of langer wordt met de werkelijke rente getoetst.", 'k10');
  q('hypotheek', 'h13', 'Leennormen', "Hoeveel extra leenruimte geeft een energielabel A of B bij aankoop in 2026?",
    ["€ 10.000", "€ 0", "€ 5.000", "€ 30.000"], 0,
    "Bij aankoop geeft label A of B € 10.000 extra leenruimte; C of D € 5.000; E, F of G niets.", 'k10');
  q('hypotheek', 'h14', 'Verduurzaming', "Een woning heeft vóór verbouwing label F. Hoeveel extra mag maximaal worden geleend voor verduurzamingsmaatregelen van de Trhk-lijst (2026)?",
    ["€ 20.000", "€ 10.000", "€ 0", "€ 50.000"], 0,
    "Voor labels E, F of G is maximaal € 20.000 extra mogelijk voor maatregelen van de lijst. Hoe zuiniger het label, hoe lager dit bedrag.", 'k10');
  q('hypotheek', 'h15', 'Verduurzaming', "Waarom is de extra leenruimte voor de zuinigste energielabels in 2026 verlaagd?",
    ["Door terugleverkosten en het einde van de salderingsregeling leveren zonnepanelen financieel minder op", "Omdat de NHG-grens is gedaald", "Omdat zuinige woningen goedkoper zijn", "Omdat de toetsrente is verhoogd"], 0,
    "Het Nibud verwerkt dat de besparing van zonnepanelen afneemt door terugleverkosten en het einde van de salderingsregeling in 2027.", 'k10');
  q('hypotheek', 'h16', 'Verduurzaming', "Welke organisatie biedt onder meer de Energiebespaarlening aan voor verduurzaming van de eigen woning?",
    ["Het Nationaal Warmtefonds", "Het Kifid", "De AFM", "Het BKR"], 0,
    "Het Warmtefonds financiert energiebesparende maatregelen. Bespreek het als alternatief of aanvulling op extra hypotheekruimte.", 'k89');
  q('hypotheek', 'h17', 'Leennormen', "Hoe beïnvloedt een studieschuld bij DUO de maximale hypotheek?",
    ["Het wettelijke maandbedrag wordt gebruteerd en verlaagt de leencapaciteit", "Een studieschuld telt niet mee", "Alleen de rente telt mee", "De studieschuld wordt van de woningwaarde afgetrokken"], 0,
    "Het maandbedrag van de DUO-lening wordt met een rentegevoelige factor gebruteerd en meegenomen als last; dat verlaagt de maximale hypotheek.", 'k94');
  q('hypotheek', 'h18', 'Leennormen', "Wat is volgens de regels voor hypothecair krediet de hoofdregel voor de maximale lening ten opzichte van de woningwaarde?",
    ["Maximaal 100% van de marktwaarde, met ruimte daarboven voor energiebesparende maatregelen", "Maximaal 80% van de marktwaarde", "Maximaal 125% van de WOZ-waarde", "Er is geen maximum"], 0,
    "De loan-to-value is in de hoofdregel begrensd op 100% van de marktwaarde. Voor energiebesparende maatregelen mag daarboven worden geleend.", 'ltv.html');
  q('hypotheek', 'h19', 'Leennormen', "Hoe wordt de toetslast berekend bij een leningdeel dat aflossingsvrij is?",
    ["Alsof de lening annuïtair in 30 jaar wordt afgelost", "Alleen op basis van de rente", "Op basis van een lineaire aflossing in 10 jaar", "Een aflossingsvrij deel telt niet mee"], 0,
    "Voor de toetsing van de maximale hypotheek wordt uitgegaan van een annuïtaire aflossing in 30 jaar, ongeacht de gekozen aflossingsvorm.", 'k10');
  q('hypotheek', 'h20', 'Leennormen', "Waar zijn de financieringslastpercentages voor hypothecair krediet in 2026 juridisch vastgelegd?",
    ["In de Tijdelijke regeling hypothecair krediet (Trhk)", "In de Voorwaarden & Normen NHG", "In het reglement van het Kifid", "In de Wet IB 2001"], 0,
    "Het Nibud adviseert; de normen worden vastgelegd in de Trhk. Bij een verschil tussen advies en regeling geldt de regeling.", 'k10');
  q('hypotheek', 'h21', 'Aflossingseis', "Aan welke aflossingseis moet een nieuwe eigenwoningschuld (aangegaan vanaf 2013) voldoen voor renteaftrek?",
    ["Ten minste annuïtair of lineair volledig aflossen in maximaal 360 maanden", "Minimaal 50% aflossen in 30 jaar", "Aflossen binnen 20 jaar", "Er geldt geen aflossingseis"], 0,
    "Sinds 2013 moet de lening ten minste annuïtair of lineair binnen 360 maanden volledig worden afgelost, en het schema moet ook echt worden gevolgd.", 'k21');
  q('hypotheek', 'h22', 'Aflossingseis', "Welke schulden vallen onder het fiscale overgangsrecht van de eigenwoningregeling?",
    ["Eigenwoningschulden die al op 31 december 2012 bestonden", "Alle hypotheken met NHG", "Schulden aangegaan na 2020", "Alleen schulden onder € 100.000"], 0,
    "Schulden die op 31 december 2012 al bestonden, hoeven niet aan de aflossingseis te voldoen. Bij oversluiten of verhuizen kan dit overgangsrecht verloren gaan als het niet goed wordt vastgelegd.", 'k21');
  q('hypotheek', 'h23', 'Fiscaliteit eigen woning', "Hoe lang is hypotheekrente op een eigenwoningschuld maximaal aftrekbaar?",
    ["30 jaar (360 maanden)", "10 jaar", "20 jaar", "Onbeperkt"], 0,
    "De maximale aftrekperiode is dertig jaar. Die geldt ook voor schulden onder het overgangsrecht.", 'k21');
  q('hypotheek', 'h24', 'Fiscaliteit eigen woning', "Tegen welk maximaal tarief is hypotheekrente in 2026 aftrekbaar?",
    ["37,56%", "49,50%", "35,75%", "40,00%"], 0,
    "Aftrekposten zoals de eigenwoningrente zijn in 2026 maximaal aftrekbaar tegen 37,56% (het tarief van de tweede schijf), ook bij een inkomen in de hoogste schijf.", 'k21');
  q('hypotheek', 'h25', 'Fiscaliteit eigen woning', "Wat is het eigenwoningforfait in 2026 voor een woning met een WOZ-waarde van € 400.000?",
    ["0,35% van de WOZ-waarde", "0,45% van de WOZ-waarde", "2,35% van de WOZ-waarde", "1% van de WOZ-waarde"], 0,
    "Voor WOZ-waarden van € 75.000 tot € 1.350.000 is het forfait in 2026 0,35%. Bij € 400.000 is dat € 1.400 bijtelling.", 'k21');
  q('hypotheek', 'h26', 'Fiscaliteit eigen woning', "Hoe wordt het eigenwoningforfait in 2026 berekend voor een woning boven € 1.350.000 WOZ-waarde?",
    ["€ 4.725 plus 2,35% van het deel boven € 1.350.000", "0,35% over de hele WOZ-waarde", "Een vast bedrag van € 4.725", "2,35% over de hele WOZ-waarde"], 0,
    "Boven de grens geldt een hoger percentage over het meerdere: € 4.725 (0,35% van € 1.350.000) plus 2,35% van het deel daarboven.", 'k21');
  q('hypotheek', 'h27', 'Hillen', "Een klant heeft nauwelijks hypotheekrente en het eigenwoningforfait is hoger dan de rente. Wat geldt in 2026?",
    ["Hij mag 71,867% van het verschil aftrekken (afbouw Wet Hillen)", "Hij mag het hele verschil aftrekken", "Er is geen aftrek; het hele verschil wordt bijgeteld", "Het forfait vervalt volledig"], 0,
    "De aftrek wegens geen of geringe eigenwoningschuld (Wet Hillen) wordt afgebouwd. In 2026 is nog 71,867% van het verschil aftrekbaar; de rest wordt belast.", 'k21');
  q('hypotheek', 'h28', 'Hillen', "Wat is het gevolg van de afbouw van de Wet Hillen voor klanten die hun hypotheek grotendeels hebben afgelost?",
    ["Hun belastingdruk op de eigen woning stijgt geleidelijk", "Hun belastingdruk daalt", "Er verandert niets", "Ze moeten de hypotheek opnieuw afsluiten"], 0,
    "Omdat een steeds groter deel van het forfait boven de rente belast wordt, stijgt de druk. Neem dat mee in scenario's rond aflossen en pensionering.", 'k21');
  q('hypotheek', 'h29', 'Fiscaliteit eigen woning', "Na hoeveel jaar vervalt een eigenwoningreserve (EWR)?",
    ["Drie jaar", "Eén jaar", "Tien jaar", "Nooit"], 0,
    "De EWR vervalt drie jaar na het ontstaan ervan. Koopt de klant binnen die termijn een nieuwe woning, dan vermindert de EWR de maximale nieuwe eigenwoningschuld.", 'k6');
  q('hypotheek', 'h30', 'Fiscaliteit eigen woning', "Een klant verkoopt met overwaarde en leent voor de nieuwe woning toch het volledige bedrag. Wat gebeurt er fiscaal met het deel ter grootte van de eigenwoningreserve?",
    ["Dat deel valt in box 3", "Dat deel is volledig aftrekbaar in box 1", "Dat deel is belastingvrij en hoeft niet te worden aangegeven", "Dat deel valt in box 2"], 0,
    "Door de bijleenregeling wordt de EWR in mindering gebracht op de maximale eigenwoningschuld. Wat de klant toch leent, kwalificeert niet als eigenwoningschuld en valt in box 3.", 'k6');
  q('hypotheek', 'h31', 'Fiscaliteit eigen woning', "Welke kosten zijn fiscaal aftrekbaar als financieringskosten van de eigen woning?",
    ["Advies- en bemiddelingskosten voor de hypotheek", "Overdrachtsbelasting", "De kosten van de leveringsakte", "Makelaarskosten bij aankoop"], 0,
    "Kosten om de lening af te sluiten (zoals advies, bemiddeling, taxatie voor de lening, hypotheekakte en NHG-provisie) zijn aftrekbaar. Kosten van de eigendomsoverdracht, zoals overdrachtsbelasting, leveringsakte en makelaar, niet.", 'k21');
  q('hypotheek', 'h32', 'Fiscaliteit eigen woning', "Hoeveel overdrachtsbelasting geldt in 2026 bij aankoop van een woning die de koper zelf gaat bewonen (zonder startersvrijstelling)?",
    ["2%", "0%", "8%", "10,4%"], 0,
    "Het tarief voor een woning als hoofdverblijf is 2%. Voor overige woningen en beleggers geldt in 2026 8%.", 'kosten-koper.html');
  q('hypotheek', 'h33', 'Fiscaliteit eigen woning', "Welke voorwaarden gelden voor de startersvrijstelling van de overdrachtsbelasting in 2026?",
    ["Koper is 18 tot 35 jaar, gebruikt de vrijstelling eenmalig en de woningwaarde is maximaal € 555.000", "Koper is jonger dan 40 jaar en de woning heeft NHG", "Alleen voor nieuwbouwwoningen", "Iedere koper die voor het eerst met NHG koopt"], 0,
    "De vrijstelling geldt eenmalig voor kopers van 18 tot 35 jaar die de woning zelf gaan bewonen, met een woningwaardegrens van € 555.000 in 2026.", 'k83');
  q('hypotheek', 'h34', 'Overbrugging', "Waarvoor dient een overbruggingskrediet?",
    ["Het tijdelijk beschikbaar maken van de overwaarde van de oude woning bij aankoop van een nieuwe, vóór verkoop", "Het afkopen van erfpacht", "Het betalen van de borgtochtprovisie", "Het financieren van een verbouwing na tien jaar"], 0,
    "Met een overbruggingskrediet kan de klant de verwachte overwaarde van zijn oude woning al gebruiken voor de nieuwe woning, totdat de oude is verkocht.", 'overbrugging.html');
  q('hypotheek', 'h35', 'Overbrugging', "Een klant is verhuisd en zijn oude woning staat leeg en te koop. Hoe lang kan de oude woning fiscaal nog als eigen woning gelden?",
    ["Tijdelijk: in het jaar van leegkomen en maximaal de drie jaren daarna", "Altijd, tot de verkoop", "Niet; de rente is direct niet meer aftrekbaar", "Maximaal zes maanden"], 0,
    "Een leegstaande woning die te koop staat, blijft tijdelijk een eigen woning: in het jaar waarin de klant verhuisde en maximaal de drie jaren daarna.", 'overbrugging.html');
  q('hypotheek', 'h36', 'Overbrugging', "Wat is het belangrijkste risico van een overbruggingskrediet voor de klant?",
    ["Dubbele woonlasten als de oude woning later of lager wordt verkocht dan verwacht", "Dat de NHG-grens wordt overschreden", "Dat de klant een BKR-codering krijgt", "Dat de overdrachtsbelasting stijgt"], 0,
    "De klant draagt tijdelijk twee woningen. Een lagere of latere verkoop vergroot de lasten en kan tot een restschuld leiden. Bespreek scenario's en buffer.", 'k40');
  q('hypotheek', 'h37', 'Oversluiten', "Wat geldt voor de vergoeding voor renteverlies (boeterente) bij vervroegd aflossen van een hypotheek?",
    ["Die mag niet hoger zijn dan het financiële nadeel van de geldverstrekker", "Die is altijd een vast percentage van 5%", "Die mag de geldverstrekker vrij bepalen", "Die is nooit verschuldigd"], 0,
    "De vergoeding is gebonden aan het werkelijke financiële nadeel van de geldverstrekker. Veel verstrekkers staan daarnaast een deel boetevrij aflossen per jaar toe.", 'k41');
  q('hypotheek', 'h38', 'Oversluiten', "Is de boeterente die een klant betaalt bij het oversluiten van zijn eigenwoningschuld fiscaal aftrekbaar?",
    ["Ja, als kosten van de geldlening voor de eigen woning", "Nee, nooit", "Alleen als de klant NHG heeft", "Alleen in box 3"], 0,
    "Een vergoeding voor renteverlies bij oversluiten van een eigenwoningschuld is aftrekbaar als financieringskosten in het jaar van betaling.", 'k113');
  q('hypotheek', 'h39', 'Oversluiten', "Wat moet je bij oversluiten in elk geval controleren voor de fiscale positie van de klant?",
    ["Of bestaand overgangsrecht en de resterende aftrekperiode behouden blijven", "Of de klant al een vergelijkingskaart had", "Of de WOZ-waarde is gestegen", "Of de klant een AOV heeft"], 0,
    "Bij oversluiten kan overgangsrecht (van vóór 2013) verloren gaan en de looptijd van de aftrek doorlopen. Leg per leningdeel de fiscale kwalificatie vast.", 'k21');
  q('hypotheek', 'h40', 'Oversluiten', "Wat houdt een meeneemregeling (verhuisregeling) bij een hypotheek in?",
    ["De klant kan de bestaande rente en voorwaarden meenemen naar een nieuwe woning", "De klant mag de hypotheek meenemen naar een andere geldverstrekker", "De klant hoeft geen boeterente te betalen bij oversluiten naar een andere bank", "De klant mag de woning verhuren"], 0,
    "Met een meeneemregeling kan de klant bij verhuizing de lopende rente en voorwaarden (geheel of gedeeltelijk) meenemen. Termijnen en voorwaarden verschillen per verstrekker.", 'k40');
  q('hypotheek', 'h41', 'Rentemiddeling', "Hoe werkt rentemiddeling?",
    ["De vergoeding voor renteverlies wordt als opslag verwerkt in de nieuwe rente in plaats van in één keer betaald", "De klant krijgt het gemiddelde van alle marktrentes", "De rente wordt halverwege de looptijd gehalveerd", "De bank betaalt de boeterente terug"], 0,
    "Bij rentemiddeling stapt de klant over op een nieuwe rentevaste periode; de boete wordt via een renteopslag over de looptijd uitgesmeerd.", 'k42');
  q('hypotheek', 'h42', 'Rentemiddeling', "Welke uitspraak over rentemiddeling is juist?",
    ["Het levert niet altijd lagere totale rentelasten op; dat hangt onder meer af van de opslag en de renteontwikkeling", "Het is altijd voordeliger dan wachten tot het einde van de rentevaste periode", "Het is wettelijk verboden", "Het kan alleen bij NHG-hypotheken"], 0,
    "De maandlast daalt vaak direct, maar door de opslag en de renteverwachting kan het totaal duurder uitvallen. Vergelijk scenario's en leg de afweging vast.", 'rentemiddeling.html');
  q('hypotheek', 'h43', 'Erfpacht', "Is de erfpachtcanon voor een eigen woning fiscaal aftrekbaar?",
    ["Ja, als aftrekpost in box 1", "Nee, nooit", "Alleen bij afkoop", "Alleen in box 3"], 0,
    "Periodieke betalingen op grond van erfpacht voor de eigen woning zijn aftrekbaar in box 1, net als de hypotheekrente (tegen het beperkte aftrektarief).", 'k90');
  q('hypotheek', 'h44', 'Erfpacht', "Welk effect heeft een erfpachtcanon op de maximale hypotheek?",
    ["De canon telt mee als woonlast en verlaagt de leenruimte", "Geen effect", "De canon verhoogt de leenruimte", "De canon wordt bij de woningwaarde opgeteld"], 0,
    "Geldverstrekkers nemen de canon mee in de toetsing van de woonlasten. Hoe hoger de canon, hoe lager de maximale hypotheek.", 'erfpacht.html');
  q('hypotheek', 'h45', 'Erfpacht', "Waar let je bij erfpacht in het advies vooral op?",
    ["Het einde van het lopende tijdvak en de mogelijke canonherziening", "Het energielabel van de buren", "De hoogte van de overdrachtsbelasting voor beleggers", "De BKR-registratie van de gemeente"], 0,
    "Na afloop van een tijdvak kan de canon flink wijzigen. Breng in kaart wanneer dat is, welke afkoopmogelijkheden er zijn en wat het betekent voor de lasten.", 'k90');
  q('hypotheek', 'h46', 'Erfpacht', "Een klant financiert de afkoop van de erfpachtcanon mee in zijn hypotheek. Hoe kwalificeert dat deel van de lening in de regel?",
    ["Als eigenwoningschuld, omdat het om verwerving van (het recht op) de woning gaat", "Altijd als box 3-schuld", "Als consumptief krediet", "Als box 2-schuld"], 0,
    "Afkoop van de canon hoort bij de verwerving van de eigen woning. Mits de lening aan de overige voorwaarden (zoals de aflossingseis) voldoet, is het eigenwoningschuld.", 'k90');
  q('hypotheek', 'h47', 'Hypotheekvormen', "Wat kenmerkt een annuïteitenhypotheek?",
    ["Gelijkblijvende bruto maandlast, waarbij het aflossingsdeel elk jaar stijgt", "Elke maand hetzelfde aflossingsbedrag en dalende lasten", "Geen aflossing tijdens de looptijd", "Aflossing via een beleggingsrekening"], 0,
    "Bij annuïtair aflossen blijft de bruto maandlast gelijk (bij gelijke rente). In het begin bestaat de termijn vooral uit rente, later vooral uit aflossing.", 'maandlasten.html');
  q('hypotheek', 'h48', 'Hypotheekvormen', "Wat kenmerkt een lineaire hypotheek?",
    ["Elke maand een vast aflossingsbedrag, waardoor de bruto maandlast daalt", "Gelijkblijvende bruto maandlast", "Aflossing pas aan het einde van de looptijd", "Een rente die elk jaar stijgt"], 0,
    "Bij lineair aflossen los je elke maand hetzelfde bedrag af. De schuld en dus de rente dalen, waardoor de bruto last in het begin het hoogst is.", 'maandlasten.html');
  q('hypotheek', 'h49', 'Aflossingseis', "Een klant sluit in 2026 een aflossingsvrij leningdeel af voor de aankoop van zijn eigen woning. Hoe kwalificeert dat deel fiscaal?",
    ["Als box 3-schuld, omdat niet aan de aflossingseis wordt voldaan", "Als eigenwoningschuld met renteaftrek", "Als box 2-schuld", "Het is niet toegestaan"], 0,
    "Nieuw aflossingsvrij geleend geld voldoet niet aan de aflossingseis. Het deel kan wel worden verstrekt, maar valt fiscaal in box 3.", 'k102');
  q('hypotheek', 'h50', 'Aankoop', "Wat is het doel van een financieringsvoorbehoud in de koopovereenkomst?",
    ["De koper kan de koop ontbinden als hij de financiering niet rond krijgt", "De verkoper kan de prijs verhogen", "De geldverstrekker kan de rente aanpassen", "De makelaar ontvangt zijn courtage eerder"], 0,
    "Met een financieringsvoorbehoud kan de koper binnen de afgesproken termijn ontbinden als de financiering niet lukt. Bewaak die termijn in het aanvraagtraject.", 'k100');
  q('hypotheek', 'h51', 'Rentevaste periode', "Welk risico loopt een klant met een korte rentevaste periode vooral?",
    ["Dat de rente bij renteherziening hoger is en de maandlast stijgt", "Dat de NHG-borg vervalt", "Dat de woning niet meer verzekerd is", "Dat de aflossingseis vervalt"], 0,
    "Een korte rentevaste periode geeft minder zekerheid over de toekomstige maandlast. Bespreek de draagkracht bij een hogere rente.", 'k103');
  q('hypotheek', 'h52', 'Verbouwing', "Wat is een bouwdepot?",
    ["Een deel van de hypotheek dat apart wordt gezet en wordt uitbetaald op basis van facturen van de verbouwing of nieuwbouw", "Een spaarrekening voor de aflossing", "Een depot voor de borgtochtprovisie", "Een rekening voor de erfpachtcanon"], 0,
    "Het bouwdepot zorgt dat het geleende geld daadwerkelijk aan de woning wordt besteed. Over het depot wordt in de regel rente vergoed.", 'k73');

  /* ================= INKOMEN ================= */
  q('inkomen', 'i01', 'Ziekte werknemer', "Hoe lang betaalt een werkgever in de regel het loon door bij ziekte van een werknemer?",
    ["104 weken, minimaal 70% van het loon", "52 weken, 100% van het loon", "26 weken, 50% van het loon", "Tot de AOW-leeftijd"], 0,
    "De werkgever betaalt bij ziekte maximaal 104 weken minimaal 70% van het loon door (vaak hoger via de cao). Daarna kan de werknemer een WIA-uitkering aanvragen.", 'inkomen-ziekte-werknemer.html');
  q('inkomen', 'i02', 'WIA', "Een werknemer is na twee jaar ziekte voor 25% arbeidsongeschikt verklaard. Wat ontvangt hij uit de WIA?",
    ["Geen WIA-uitkering, want hij is minder dan 35% arbeidsongeschikt", "Een IVA-uitkering", "Een WGA-uitkering van 25%", "Een volledige WW-uitkering"], 0,
    "Onder de 35% arbeidsongeschiktheid bestaat geen recht op een WIA-uitkering. De werknemer moet zijn resterende verdiencapaciteit benutten.", 'https://www.uwv.nl');
  q('inkomen', 'i03', 'WIA', "Wanneer heeft iemand recht op een IVA-uitkering?",
    ["Bij minimaal 80% arbeidsongeschiktheid die (vrijwel) duurzaam is", "Bij 35% tot 80% arbeidsongeschiktheid", "Bij elke ziekte langer dan een jaar", "Alleen bij een bedrijfsongeval"], 0,
    "De IVA (Inkomensvoorziening Volledig Arbeidsongeschikten) is voor wie volledig en duurzaam arbeidsongeschikt is: 80% of meer, zonder of met een zeer kleine kans op herstel.", 'k26');
  q('inkomen', 'i04', 'WIA', "Wie komt in aanmerking voor de WGA?",
    ["Wie 35% tot 80% arbeidsongeschikt is, of 80% of meer maar niet duurzaam", "Alleen wie 100% duurzaam arbeidsongeschikt is", "Alleen zelfstandigen", "Wie minder dan 35% arbeidsongeschikt is"], 0,
    "De WGA (Werkhervatting Gedeeltelijk Arbeidsgeschikten) is er voor gedeeltelijk arbeidsongeschikten en voor volledig arbeidsongeschikten met kans op herstel.", 'k26');
  q('inkomen', 'i05', 'WIA', "Hoe hoog is een IVA-uitkering?",
    ["75% van het (gemaximeerde) dagloon", "100% van het laatste loon", "70% van het minimumloon", "50% van het dagloon"], 0,
    "De IVA-uitkering is 75% van het dagloon, dat gemaximeerd is. Bij hogere inkomens ligt de uitkering daardoor relatief lager.", 'https://www.uwv.nl');
  q('inkomen', 'i06', 'WIA', "Welke voorwaarde geldt voor een WGA-loonaanvullingsuitkering na afloop van de loongerelateerde uitkering?",
    ["De klant verdient minimaal 50% van zijn resterende verdiencapaciteit", "De klant werkt helemaal niet", "De klant is ouder dan 60 jaar", "De klant heeft een AOV"], 0,
    "Wie ten minste de helft van zijn restverdiencapaciteit benut, krijgt een loonaanvulling. Wie dat niet haalt, valt terug op een lagere vervolguitkering.", 'k26');
  q('inkomen', 'i07', 'WIA', "Wat wordt bedoeld met het WGA-gat (WGA-hiaat)?",
    ["De forse inkomensterugval als de klant na de loongerelateerde fase minder dan 50% van zijn restverdiencapaciteit verdient en een vervolguitkering krijgt", "Het verschil tussen bruto en netto loon", "De periode tussen ziekmelding en WIA-keuring", "Het gat tussen AOW en pensioen"], 0,
    "De WGA-vervolguitkering is gebaseerd op het minimumloon en het arbeidsongeschiktheidspercentage, niet op het eigen loon. Een WGA-hiaatverzekering kan dit opvangen.", 'k26');
  q('inkomen', 'i08', 'AOV', "Waarom is arbeidsongeschiktheid een kernrisico in het hypotheekadvies van een zelfstandige?",
    ["Een zelfstandige heeft geen WIA-vangnet en valt terug op wat hij zelf heeft geregeld", "Een zelfstandige krijgt een hogere WIA-uitkering", "De geldverstrekker eist altijd een AOV", "Zelfstandigen zijn nooit arbeidsongeschikt"], 0,
    "Zonder WIA valt het inkomen bij langdurige arbeidsongeschiktheid sterk terug. Een AOV of een alternatief moet dat risico beperken.", 'k85');
  q('inkomen', 'i09', 'AOV', "Hoe worden de premie en de uitkering van een particuliere AOV fiscaal behandeld?",
    ["Premie aftrekbaar in box 1, uitkering belast in box 1", "Premie niet aftrekbaar, uitkering onbelast", "Premie aftrekbaar, uitkering onbelast", "Alles valt in box 3"], 0,
    "De AOV-premie is aftrekbaar als uitgave voor inkomensvoorziening; de uitkering is daarom belast als inkomen in box 1. Reken netto.", 'aov-tekort.html');
  q('inkomen', 'i10', 'AOV', "Welke dekking geeft een zelfstandige het snelst recht op uitkering?",
    ["Beroepsarbeidsongeschiktheid (eigen beroep)", "Passende arbeid", "Gangbare arbeid", "Alle drie geven precies hetzelfde"], 0,
    "Hoe ruimer de omschrijving van het werk dat hij nog zou kunnen doen, hoe minder snel er wordt uitgekeerd. Eigen beroep is voor de klant het ruimst.", 'k85');
  q('inkomen', 'i11', 'AOV', "Welk effect heeft een langere eigenrisicoperiode (wachttijd) bij een AOV?",
    ["Lagere premie, maar de klant moet die periode zelf overbruggen", "Hogere premie en snellere uitkering", "Geen effect op de premie", "Langere uitkeringsduur"], 0,
    "Een langere wachttijd verlaagt de premie. Check of de buffer van de klant voldoende is om die periode te overbruggen.", 'k85');
  q('inkomen', 'i12', 'AOV', "Wat is een belangrijk verschil tussen een broodfonds en een AOV?",
    ["Een broodfonds is geen verzekering: er is geen garantie en de schenkingen stoppen na maximaal twee jaar", "Een broodfonds keert uit tot de AOW-leeftijd", "Een broodfonds valt onder toezicht van DNB", "Een broodfonds kent geen eigen risico"], 0,
    "In een broodfonds schenken deelnemers elkaar bij langdurige ziekte, maximaal twee jaar. Voor langdurige arbeidsongeschiktheid blijft een aanvullende voorziening nodig.", 'k85');
  q('inkomen', 'i13', 'AOV', "Wat is het advies over de geplande basisverzekering arbeidsongeschiktheid voor zelfstandigen (BAZ), stand oktober 2026?",
    ["Niet op wachten: het is een wetsvoorstel met een vroegst haalbare uitvoeringsdatum van 1 januari 2030", "De BAZ geldt al sinds 2025", "De BAZ vervangt elke particuliere AOV volledig", "De BAZ is definitief geschrapt"], 0,
    "De BAZ is een wetsvoorstel; 1 januari 2030 geldt als vroegst haalbare uitvoeringsdatum en de dekking wordt een basisniveau. Benoem wel dat een AOV later mogelijk moet worden afgestemd.", 'k85');
  q('inkomen', 'i14', 'AOV', "Wat is kenmerkend voor een AOV op schadebasis (in tegenstelling tot een sommenverzekering)?",
    ["De uitkering kan afhangen van het werkelijke inkomensverlies", "De uitkering is altijd het volledige verzekerde bedrag", "Er is geen medische acceptatie", "De premie is niet aftrekbaar"], 0,
    "Bij een schadeverzekering wordt gekeken naar het werkelijk geleden inkomensverlies. Bij een sommenverzekering wordt het afgesproken bedrag uitgekeerd.", 'k85');
  q('inkomen', 'i15', 'WW', "Hoe lang kan een WW-uitkering maximaal duren?",
    ["24 maanden", "12 maanden", "38 maanden", "Tot de AOW-leeftijd"], 0,
    "De WW duurt minimaal 3 en maximaal 24 maanden, afhankelijk van het arbeidsverleden.", 'werkloosheid.html');
  q('inkomen', 'i16', 'WW', "Hoe hoog is de WW-uitkering?",
    ["De eerste twee maanden 75% en daarna 70% van het (gemaximeerde) dagloon", "100% van het laatste loon", "Altijd 70% van het minimumloon", "50% van het loon gedurende de hele duur"], 0,
    "De WW is de eerste twee maanden 75% en daarna 70% van het dagloon, dat is gemaximeerd.", 'werkloosheid.html');
  q('inkomen', 'i17', 'WW', "Aan welke wekeneis moet een werknemer voldoen voor WW?",
    ["Minimaal 26 van de laatste 36 weken gewerkt", "Minimaal 52 weken gewerkt", "Minimaal 4 van de laatste 5 jaar gewerkt", "Er geldt geen wekeneis"], 0,
    "De wekeneis (26 van de 36 weken) bepaalt of er recht op WW is; de duur hangt daarna af van het arbeidsverleden.", 'https://www.uwv.nl');
  q('inkomen', 'i18', 'ORV', "Wat doet een overlijdensrisicoverzekering?",
    ["Ze keert een bedrag uit als de verzekerde binnen de looptijd overlijdt; er wordt geen waarde opgebouwd", "Ze bouwt een kapitaal op voor de aflossing", "Ze keert uit bij arbeidsongeschiktheid", "Ze keert altijd uit aan het einde van de looptijd"], 0,
    "Een ORV is een zuivere risicoverzekering: uitkering bij overlijden binnen de looptijd, anders niets.", 'k84');
  q('inkomen', 'i19', 'ORV', "Waarom wordt een ORV vaak kruislings afgesloten door partners?",
    ["Om te voorkomen dat over de uitkering erfbelasting verschuldigd is", "Om de premie aftrekbaar te maken", "Om een hogere uitkering te krijgen", "Omdat NHG dat altijd eist"], 0,
    "Bij een kruislingse ORV is de partner verzekeringnemer en begunstigde en betaalt hij de premie uit eigen middelen. De uitkering valt dan niet onder de erfbelasting.", 'k84');
  q('inkomen', 'i20', 'ORV', "Welke ORV-vorm sluit het best aan op een annuïteitenhypotheek?",
    ["Een annuïtair dalende dekking", "Een gelijkblijvende dekking van het dubbele bedrag", "Een stijgende dekking", "Geen ORV; een annuïteitenhypotheek heeft dat niet nodig"], 0,
    "Een annuïtair dalende ORV volgt globaal het verloop van de schuld bij annuïtair aflossen. Het juiste bedrag blijft wel afhankelijk van het tekort bij overlijden.", 'orv.html');
  q('inkomen', 'i21', 'ORV', "Is de premie van een zuivere overlijdensrisicoverzekering voor de hypotheek fiscaal aftrekbaar?",
    ["Nee", "Ja, in box 1", "Ja, in box 3", "Alleen bij NHG"], 0,
    "De premie van een zuivere ORV is niet aftrekbaar. Daar staat tegenover dat de uitkering niet in box 1 wordt belast.", 'k84');
  q('inkomen', 'i22', 'ORV', "Waarop baseer je de hoogte van de ORV-dekking in een goed advies?",
    ["Op het tekort dat ontstaat als de partner overlijdt, rekening houdend met nabestaandenvoorzieningen", "Altijd op de volledige hypotheek", "Op de WOZ-waarde", "Op het bedrag dat de geldverstrekker voorstelt"], 0,
    "Bereken het tekort per scenario (inclusief partnerpensioen, Anw en eigen inkomen). Dat bepaalt de passende dekking en looptijd.", 'k84');
  q('inkomen', 'i23', 'Woonlastenverzekering', "Wat kenmerkt een woonlastenverzekering?",
    ["Ze keert bij werkloosheid en/of arbeidsongeschiktheid een bedrag uit voor een beperkte periode", "Ze keert levenslang uit", "Ze betaalt de hypotheek af bij overlijden", "Ze vervangt de opstalverzekering"], 0,
    "Een woonlastenverzekering geeft tijdelijke dekking voor de woonlasten. Uitkeringsduur, wachttijd en uitsluitingen zijn bepalend voor de waarde.", 'k86');
  q('inkomen', 'i24', 'Woonlastenverzekering', "Wanneer is een woonlastenverzekering minder zinvol?",
    ["Als het tekort structureel is", "Als het tekort tijdelijk is en de buffer klein", "Als een AOV niet te krijgen is", "Als de klant een korte WW-periode verwacht"], 0,
    "Een uitkering van beperkte duur lost een structureel tekort niet op; het probleem wordt alleen uitgesteld.", 'k86');
  q('inkomen', 'i25', 'Woonlastenverzekering', "Welke uitsluiting kom je vaak tegen bij de werkloosheidsdekking van een woonlastenverzekering?",
    ["Eigen ontslag of het aflopen van een tijdelijk contract", "Ontslag door een reorganisatie", "Faillissement van de werkgever", "Werkloosheid na tien jaar dienstverband"], 0,
    "Eigen ontslag, ontslag in de proeftijd en een aflopend tijdelijk contract zijn veelvoorkomende uitsluitingen. Controleer dit tegen de situatie van de klant.", 'k86');
  q('inkomen', 'i26', 'Anw', "Wie keert een Anw-nabestaandenuitkering uit?",
    ["De SVB", "Het UWV", "Het pensioenfonds", "De verzekeraar van de ORV"], 0,
    "De Algemene nabestaandenwet wordt uitgevoerd door de Sociale Verzekeringsbank. De uitkering is aan strikte voorwaarden gebonden en inkomensafhankelijk.", 'https://www.svb.nl');
  q('inkomen', 'i27', 'Scenario', "Wat is het doel van een scenarioanalyse arbeidsongeschiktheid in het hypotheekadvies?",
    ["Inzichtelijk maken of de klant de woonlasten kan blijven dragen als zijn inkomen terugvalt", "De maximale hypotheek verhogen", "De rente verlagen", "De BKR-registratie controleren"], 0,
    "Je vergelijkt het inkomen in de verschillende fasen (loondoorbetaling, WGA/IVA) met de lasten en bespreekt hoe een tekort kan worden opgevangen.", 'k23');

  /* ================= PENSIOEN ================= */
  q('pensioen', 'p01', 'AOW', "Wat is de AOW-leeftijd in 2026?",
    ["67 jaar", "65 jaar", "66 jaar en 4 maanden", "68 jaar"], 0,
    "In 2026 is de AOW-leeftijd 67 jaar.", 'https://www.svb.nl/nl/aow');
  q('pensioen', 'p02', 'AOW', "Hoe bouwt iemand AOW op?",
    ["2% per jaar dat hij in Nederland woont of werkt in de 50 jaar vóór de AOW-leeftijd", "Op basis van het betaalde loon", "Via de werkgever in een pensioenfonds", "Alleen door premie te storten bij de SVB"], 0,
    "De AOW is een volksverzekering. Over 50 jaar vóór de AOW-leeftijd bouwt iemand 2% per verzekerd jaar op; wie in het buitenland woonde, heeft mogelijk een AOW-gat.", 'https://www.svb.nl/nl/aow');
  q('pensioen', 'p03', 'AOW', "Hoe hoog is de bruto AOW per maand voor een alleenstaande per 1 juli 2026 (exclusief vakantiegeld)?",
    ["€ 1.662,16", "€ 1.139,39", "€ 1.419,46", "€ 2.000,00"], 0,
    "Per 1 juli 2026 is de bruto AOW voor een alleenstaande € 1.662,16 per maand, exclusief vakantiegeld.", 'https://www.svb.nl/nl/aow/nieuws/aow-bedragen-vanaf-juli-2026');
  q('pensioen', 'p04', 'AOW', "Hoe hoog is de bruto AOW per maand per persoon voor samenwonenden per 1 juli 2026 (exclusief vakantiegeld)?",
    ["€ 1.139,39", "€ 1.662,16", "€ 831,08", "€ 1.581,55"], 0,
    "Voor gehuwden en samenwonenden is de bruto AOW per 1 juli 2026 € 1.139,39 per persoon per maand, exclusief vakantiegeld.", 'https://www.svb.nl/nl/aow/nieuws/aow-bedragen-vanaf-juli-2026');
  q('pensioen', 'p05', 'AOW', "Welke organisatie voert de AOW uit?",
    ["De Sociale Verzekeringsbank (SVB)", "Het UWV", "De Belastingdienst", "Het eigen pensioenfonds"], 0,
    "De SVB voert de AOW uit, net als onder meer de Anw en de kinderbijslag.", 'https://www.svb.nl/nl/aow');
  q('pensioen', 'p06', 'Wtp', "Wanneer moeten pensioenregelingen volgens de stand van oktober 2026 uiterlijk zijn omgezet naar het nieuwe stelsel van de Wtp?",
    ["1 januari 2028", "1 januari 2026", "1 juli 2023", "1 januari 2035"], 0,
    "De oorspronkelijke datum van 1 januari 2027 is verschoven; regelingen moeten uiterlijk 1 januari 2028 zijn omgezet.", 'k80');
  q('pensioen', 'p07', 'Wtp', "Welke twee hoofdvormen van premieregelingen kent de Wtp?",
    ["De solidaire en de flexibele premieregeling", "De eindloon- en de middelloonregeling", "De beschikbare-premie- en de kapitaalregeling", "De AOW- en de Anw-regeling"], 0,
    "In het nieuwe stelsel zijn alle regelingen premieregelingen: de solidaire premieregeling en de flexibele premieregeling.", 'k45');
  q('pensioen', 'p08', 'Wtp', "Wat verandert er onder de Wtp aan de pensioenpremie?",
    ["Er komt een leeftijdsonafhankelijke (vlakke) premie; de doorsneesystematiek verdwijnt", "De premie wordt volledig door de overheid betaald", "De premie stijgt met de leeftijd van de werknemer", "Er wordt geen premie meer betaald"], 0,
    "In het nieuwe stelsel is de premie voor iedere deelnemer een gelijk percentage van het salaris. De doorsneesystematiek, waarbij jongeren voor ouderen meebetaalden in opbouw, verdwijnt.", 'k45');
  q('pensioen', 'p09', 'Wtp', "Hoe is het partnerpensioen bij overlijden vóór de pensioendatum in de nieuwe regelingen standaard geregeld?",
    ["Op risicobasis, maximaal 50% van het pensioengevend salaris", "Op opbouwbasis, ook na uitdiensttreding", "Het vervalt volledig", "Via de AOW"], 0,
    "Het partnerpensioen is standaard op risicobasis en maximaal 50% van het pensioengevend salaris. Het niveau in de praktijk ligt vaak lager.", 'k80');
  q('pensioen', 'p10', 'Wtp', "Wat betekent een partnerpensioen op risicobasis voor het ORV-advies?",
    ["De dekking kan wegvallen bij een baanwissel, werkloosheid of de start als zzp'er; herbereken het tekort", "Er hoeft nooit meer een ORV te worden geadviseerd", "De ORV-premie wordt aftrekbaar", "De ORV wordt automatisch door het pensioenfonds verzekerd"], 0,
    "Risicodekking stopt als de deelnemer uit dienst gaat (na een korte uitloop). Het tekort bij overlijden kan daardoor veranderen; bespreek dit bij elke nazorgafspraak.", 'k80');
  q('pensioen', 'p11', 'Pensioen', "Wat is volgens de stand van oktober 2026 de geplande invoeringsdatum van het bedrag ineens (maximaal 10% van het ouderdomspensioen opnemen op de pensioendatum)?",
    ["1 januari 2029", "1 januari 2024", "1 juli 2026", "Het bedrag ineens is afgeschaft"], 0,
    "De wet is in juni 2026 door de Eerste Kamer aangenomen; volgens de rijksoverheid gaat het bedrag ineens in op 1 januari 2029.", 'k80');
  q('pensioen', 'p12', 'Jaarruimte', "Waarvoor dient de jaarruimte?",
    ["Om fiscaal aftrekbaar aanvullend pensioen op te bouwen bij een pensioentekort", "Om extra AOW op te bouwen", "Om box 3-vermogen belastingvrij te beleggen zonder voorwaarden", "Om hypotheekrente langer af te trekken"], 0,
    "De jaarruimte geeft aan hoeveel iemand in een jaar aftrekbaar kan inleggen in een lijfrente als zijn pensioenopbouw tekortschiet.", 'k30');
  q('pensioen', 'p13', 'Jaarruimte', "Wat verlaagt de jaarruimte van een werknemer?",
    ["Pensioenopbouw via de werkgever (factor A)", "Een hogere WOZ-waarde", "Een hypotheek met NHG", "Het hebben van kinderen"], 0,
    "De pensioenopbouw in de werkgeversregeling wordt via de factor A op de jaarruimte in mindering gebracht. Wie veel opbouwt via de werkgever, heeft weinig jaarruimte.", 'k30');
  q('pensioen', 'p14', 'Jaarruimte', "Hoeveel jaar terug kan onbenutte jaarruimte via de reserveringsruimte worden ingehaald?",
    ["Tien jaar", "Eén jaar", "Drie jaar", "Onbeperkt"], 0,
    "Onbenutte jaarruimte van de afgelopen tien jaar kan via de reserveringsruimte alsnog worden benut.", 'https://www.belastingdienst.nl');
  q('pensioen', 'p15', 'Lijfrente', "Hoe wordt de waarde van een lijfrenterekening tijdens de opbouwfase in de inkomstenbelasting behandeld?",
    ["Ze is vrijgesteld in box 3", "Ze is belast in box 3 als spaargeld", "Ze is belast in box 2", "Ze is elk jaar belast in box 1"], 0,
    "Een fiscaal gefaciliteerde lijfrente valt tijdens de opbouw niet in box 3. De belasting volgt bij uitkering in box 1 (omkeerregel).", 'https://www.belastingdienst.nl');
  q('pensioen', 'p16', 'Lijfrente', "Hoe wordt een lijfrente-uitkering belast?",
    ["In box 1 als inkomen", "In box 3", "Niet; ze is belastingvrij", "In box 2"], 0,
    "Omdat de inleg aftrekbaar was, is de uitkering belast in box 1 (omkeerregel).", 'https://www.belastingdienst.nl');
  q('pensioen', 'p17', 'Lijfrente', "Wat is het fiscale gevolg als een klant een lijfrente in strijd met de regels in één keer afkoopt?",
    ["De waarde wordt belast in box 1 en er kan daarnaast revisierente verschuldigd zijn", "Er is geen belasting verschuldigd", "Alleen box 3-heffing over dat jaar", "De klant verliest zijn AOW"], 0,
    "Afkoop maakt het hele bedrag in box 1 belast. Daarnaast kan revisierente worden geheven omdat eerder aftrek is genoten.", 'https://www.belastingdienst.nl');
  q('pensioen', 'p18', 'Lijfrente', "Bij welke aanbieders kan een fiscaal gefaciliteerde lijfrente worden opgebouwd?",
    ["Bij een verzekeraar (lijfrenteverzekering) of bij een bank (lijfrentespaarrekening of -beleggingsrecht)", "Alleen bij een pensioenfonds", "Alleen bij de SVB", "Op elke gewone spaarrekening"], 0,
    "Naast de traditionele lijfrenteverzekering kunnen banken en beleggingsinstellingen geblokkeerde lijfrenteproducten aanbieden.", 'https://www.belastingdienst.nl');
  q('pensioen', 'p19', 'Pensioen en hypotheek', "Waarom hoort de pensioendatum thuis in het hypotheekadvies?",
    ["Het inkomen daalt vaak na pensionering, terwijl de woonlasten doorlopen", "Omdat de hypotheek bij pensionering automatisch vervalt", "Omdat de NHG-borg dan stijgt", "Omdat het eigenwoningforfait dan vervalt"], 0,
    "Breng het inkomen na AOW-leeftijd in kaart en toets of de lasten (inclusief eventuele restschuld) betaalbaar blijven.", 'k27');
  q('pensioen', 'p20', 'Pensioen en hypotheek', "Wat kan een senior met veel overwaarde en weinig inkomen overwegen om de overwaarde te benutten?",
    ["Een vorm van verzilveren, zoals een verzilverhypotheek, na een zorgvuldige toets", "Altijd de woning verkopen", "Een doorlopend krediet zonder toets", "Het eigenwoningforfait laten vervallen"], 0,
    "Er bestaan producten om overwaarde vrij te maken. Vergelijk ze met verkopen, huren of schenken en weeg de gevolgen voor de nalatenschap mee.", 'k82');
  q('pensioen', 'p21', 'AOW', "Een klant met een jongere partner gaat in 2026 met AOW. Ontvangt hij een partnertoeslag voor de partner zonder inkomen?",
    ["Nee, de partnertoeslag is per 2015 afgeschaft", "Ja, altijd", "Ja, als de partner jonger is dan 60", "Alleen als zij kinderen hebben"], 0,
    "Sinds 1 januari 2015 wordt geen nieuwe AOW-partnertoeslag meer toegekend. De klant krijgt het bedrag voor samenwonenden; houd rekening met een inkomensgat.", 'https://www.svb.nl/nl/aow');

  /* ================= VERMOGEN ================= */
  q('vermogen', 'v01', 'Box 3', "Hoe hoog is het heffingsvrij vermogen in box 3 in 2026 per persoon?",
    ["€ 59.357", "€ 57.684", "€ 30.000", "€ 100.000"], 0,
    "Het heffingsvrij vermogen in 2026 is € 59.357 per persoon; fiscale partners kunnen dit samen gebruiken.", 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026');
  q('vermogen', 'v02', 'Box 3', "Wat is het tarief in box 3 in 2026?",
    ["36%", "31%", "24,5%", "49,5%"], 0,
    "Het box 3-tarief is in 2026 36% over het voordeel uit sparen en beleggen.", 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026');
  q('vermogen', 'v03', 'Box 3', "Welk forfaitair rendement geldt in 2026 voor overige bezittingen zoals beleggingen?",
    ["6,00%", "1,28%", "2,70%", "4,00%"], 0,
    "Voor overige bezittingen geldt in 2026 een forfaitair rendement van 6,00%.", 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026');
  q('vermogen', 'v04', 'Box 3', "Welk forfaitair rendement geldt in 2026 (voorlopig) voor banktegoeden?",
    ["1,28%", "6,00%", "2,70%", "0%"], 0,
    "Voor banktegoeden is het percentage voor 2026 voorlopig 1,28%; het definitieve percentage volgt na afloop van het jaar.", 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026');
  q('vermogen', 'v05', 'Box 3', "Welke schuldendrempel geldt in box 3 in 2026 per persoon?",
    ["€ 3.800", "€ 59.357", "€ 1.000", "€ 10.000"], 0,
    "Schulden tellen in box 3 pas mee voor zover ze boven de drempel van € 3.800 per persoon uitkomen.", 'https://www.belastingdienst.nl');
  q('vermogen', 'v06', 'Box 3', "Welke datum is bepalend voor de waarde van bezittingen en schulden in box 3?",
    ["1 januari van het belastingjaar", "31 december van het belastingjaar", "De datum van de aangifte", "1 juli van het belastingjaar"], 0,
    "Box 3 kijkt naar de stand op de peildatum 1 januari.", 'https://www.belastingdienst.nl');
  q('vermogen', 'v07', 'Box 3', "Wat kan een belastingplichtige doen als zijn werkelijke rendement lager is dan het forfaitaire rendement in box 3?",
    ["Met tegenbewijs aantonen dat zijn werkelijke rendement lager is", "Niets; het forfait is altijd definitief", "Het verschil aftrekken in box 1", "Zijn vermogen naar box 2 verplaatsen"], 0,
    "Er is een tegenbewijsregeling: wie aantoont dat het werkelijke rendement lager was, kan op basis daarvan worden belast.", 'https://www.belastingdienst.nl');
  q('vermogen', 'v08', 'Box 3', "Een aflossingsvrij leningdeel kwalificeert niet als eigenwoningschuld. Waar valt die schuld fiscaal?",
    ["In box 3, als schuld (boven de drempel)", "In box 1 met renteaftrek", "In box 2", "Nergens; ze telt niet mee"], 0,
    "Een lening die niet aan de eisen voor eigenwoningschuld voldoet, is een box 3-schuld. De rente is dan niet aftrekbaar in box 1.", 'k24');
  q('vermogen', 'v09', 'Beleggen', "Wat is het belangrijkste doel van spreiding bij beleggen?",
    ["Het risico van één belegging of sector beperken", "Een gegarandeerd rendement behalen", "De belasting in box 3 verlagen", "De kosten tot nul terugbrengen"], 0,
    "Door te spreiden over beleggingen, sectoren en regio's heeft het slecht presteren van één onderdeel minder invloed op het geheel. Marktrisico blijft bestaan.", 'k24');
  q('vermogen', 'v10', 'Beleggen', "Wat gebeurt er in de regel met de koers van bestaande obligaties als de marktrente stijgt?",
    ["De koers daalt", "De koers stijgt", "De koers blijft gelijk", "De obligatie vervalt"], 0,
    "Bestaande obligaties met een lagere coupon worden minder aantrekkelijk als de marktrente stijgt; hun koers daalt.", 'k24');
  q('vermogen', 'v11', 'Beleggen', "Wat geldt in het algemeen voor de verhouding tussen risico en verwacht rendement?",
    ["Een hoger verwacht rendement gaat samen met een hoger risico", "Een hoger rendement betekent altijd minder risico", "Er is geen verband", "Aandelen hebben altijd minder risico dan spaargeld"], 0,
    "Beleggers vragen een hogere verwachte beloning voor het lopen van meer risico. Een hoger verwacht rendement is nooit een garantie.", 'k24');
  q('vermogen', 'v12', 'Risicoprofiel', "Welke elementen horen bij het vaststellen van een beleggingsprofiel?",
    ["Doelstelling, beleggingshorizon, financiële positie, kennis en ervaring, risicobereidheid en risicodraagvermogen", "Alleen de leeftijd van de klant", "Alleen de gewenste rendementen", "De hypotheekrente en de WOZ-waarde"], 0,
    "Een passend profiel combineert wat de klant wil (bereidheid), wat hij kan dragen (draagvermogen), zijn doel en horizon, en zijn kennis en ervaring.", 'k32');
  q('vermogen', 'v13', 'Risicoprofiel', "Wat is het verschil tussen risicobereidheid en risicodraagvermogen?",
    ["Bereidheid is hoeveel risico de klant wil lopen; draagvermogen is hoeveel verlies hij financieel kan opvangen", "Ze betekenen hetzelfde", "Draagvermogen gaat over de leeftijd, bereidheid over het inkomen", "Bereidheid wordt door de AFM vastgesteld"], 0,
    "Een klant kan veel risico willen lopen terwijl hij het verlies niet kan dragen, of andersom. Het advies moet bij beide passen.", 'k24');
  q('vermogen', 'v14', 'Risicoprofiel', "Welk advies past het best bij een klant die over twee jaar een vast bedrag nodig heeft voor een verbouwing?",
    ["Weinig of geen beleggingsrisico; de horizon is kort", "Volledig in aandelen beleggen voor het hoogste rendement", "Beleggen met geleend geld", "Het geld in een lijfrente storten"], 0,
    "Bij een korte horizon en een vast doelbedrag is er weinig tijd om koersdalingen te herstellen. Sparen of zeer defensief beleggen past dan beter.", 'k24');
  q('vermogen', 'v15', 'Beleggen', "Tot welk bedrag zijn tegoeden bij een bank in Nederland beschermd via het depositogarantiestelsel?",
    ["€ 100.000 per persoon per bank", "€ 20.000 per persoon", "Onbeperkt", "€ 50.000 per rekening"], 0,
    "Het depositogarantiestelsel beschermt tegoeden tot € 100.000 per persoon per bank. Beleggingen vallen daar niet onder.", 'https://www.dnb.nl');
  q('vermogen', 'v16', 'Beleggen', "Tot welk bedrag biedt het beleggerscompensatiestelsel bescherming als een beleggingsonderneming uw effecten niet kan teruggeven?",
    ["€ 20.000", "€ 100.000", "€ 250.000", "Er is geen bescherming"], 0,
    "Het beleggerscompensatiestelsel dekt tot € 20.000 per persoon. Het beschermt niet tegen koersverlies.", 'https://www.dnb.nl');
  q('vermogen', 'v17', 'Beleggen', "Welk document krijgt een belegger voor veel verpakte beleggingsproducten (PRIIPs) om kosten, risico en rendementsscenario's te vergelijken?",
    ["Het essentiële-informatiedocument (EID/KID)", "De vergelijkingskaart", "Het ESIS", "De polisvoorwaarden van de opstalverzekering"], 0,
    "Het EID is een gestandaardiseerd document van enkele pagina's met de kern van het product, zodat beleggers producten kunnen vergelijken.", 'https://www.afm.nl');
  q('vermogen', 'v18', 'Beleggen', "Wat moet een beleggingsonderneming doen voordat een klant zonder advies (execution only) in een complex instrument belegt?",
    ["Beoordelen of de klant voldoende kennis en ervaring heeft (passendheidstoets)", "Niets; zonder advies gelden geen verplichtingen", "Een volledig vermogensplan opstellen", "Toestemming vragen aan de AFM"], 0,
    "Bij complexe instrumenten zonder advies toetst de onderneming of het product past bij de kennis en ervaring van de klant, en waarschuwt als dat niet zo is.", 'https://www.afm.nl');
  q('vermogen', 'v19', 'Vermogen en hypotheek', "Waarmee vergelijk je extra aflossen op de hypotheek in een vermogensadvies?",
    ["Met het netto rendement van sparen of beleggen, rekening houdend met renteaftrek, box 3 en liquiditeit", "Alleen met de bruto hypotheekrente", "Met de NHG-grens", "Met de WOZ-waarde"], 0,
    "Aflossen levert een netto rentebesparing op; sparen of beleggen een netto rendement. Weeg ook flexibiliteit en buffer: afgelost geld is niet meer vrij beschikbaar.", 'k24');
  q('vermogen', 'v20', 'Beleggingsverzekering', "Waarom is nazorg bij oude beleggingsverzekeringen (woekerpolissen) belangrijk?",
    ["Hoge kosten en tegenvallende rendementen kunnen tot een tekort leiden; klanten moeten worden geholpen hun situatie te beoordelen", "Omdat ze altijd meer opleveren dan verwacht", "Omdat ze onder box 2 vallen", "Omdat ze automatisch zijn omgezet naar NHG"], 0,
    "Bij beleggingsverzekeringen is herbeoordeling (hersteladvies, activering) belangrijk om te zien of het doel, zoals aflossing van de hypotheek, nog wordt gehaald.", 'k107');

  /* ================= CONSUMPTIEF KREDIET ================= */
  q('krediet', 'c01', 'CCD', "Wat is de CCD?",
    ["De Europese richtlijn consumentenkrediet", "Het examenbureau voor Wft-diploma's", "Het register van kredieten in Nederland", "De Nederlandse gedragscode voor hypotheken"], 0,
    "CCD staat voor Consumer Credit Directive, de Europese richtlijn over consumentenkrediet. Nederland heeft die verwerkt in onder meer het Burgerlijk Wetboek en de Wft.", 'https://www.afm.nl');
  q('krediet', 'c02', 'CCD', "Hoe lang heeft een consument na het sluiten van een consumptief krediet een herroepingsrecht?",
    ["14 kalenderdagen", "3 dagen", "30 dagen", "Er is geen herroepingsrecht"], 0,
    "De consument kan binnen 14 kalenderdagen zonder opgave van redenen van de kredietovereenkomst afzien.", 'https://www.afm.nl');
  q('krediet', 'c03', 'CCD', "Wat geeft het jaarlijks kostenpercentage (JKP) weer?",
    ["De totale kosten van het krediet voor de consument, uitgedrukt als percentage per jaar", "Alleen de afsluitkosten", "Het rendement voor de belegger", "De inflatie"], 0,
    "Het JKP maakt kredieten onderling vergelijkbaar, omdat rente en verplichte kosten in één jaarpercentage zijn verwerkt.", 'https://www.afm.nl');
  q('krediet', 'c04', 'CCD', "Wat geldt in Nederland voor de kredietvergoeding bij consumptief krediet?",
    ["Ze is wettelijk gemaximeerd (wettelijke rente plus een opslag)", "De aanbieder mag die vrij bepalen", "Ze is altijd gelijk aan de hypotheekrente", "Ze wordt door het BKR vastgesteld"], 0,
    "Er geldt een wettelijk maximum voor de kredietvergoeding, gekoppeld aan de wettelijke rente plus een opslag.", 'https://www.afm.nl');
  q('krediet', 'c05', 'CCD', "Welke ontwikkeling brengt de herziene Europese consumentenkredietrichtlijn (CCD2) onder meer?",
    ["Ook vormen als achteraf betalen en kleine kredieten vallen onder de regels", "Consumptief krediet wordt verboden", "Het BKR wordt afgeschaft", "Hypotheken vallen voortaan onder de CCD"], 0,
    "De herziene richtlijn breidt de reikwijdte uit, onder meer naar achteraf betalen (buy now pay later) en kleine kredieten.", 'https://www.afm.nl');
  q('krediet', 'c06', 'Leennormen', "Wat moet een kredietaanbieder doen voordat hij een consumptief krediet verstrekt?",
    ["Informatie inwinnen over de financiële positie en toetsen of het krediet verantwoord is, om overkreditering te voorkomen", "Alleen het identiteitsbewijs controleren", "Niets, als het krediet onder € 5.000 is", "Alleen nagaan of de klant een koopwoning heeft"], 0,
    "De Wft verplicht kredietaanbieders en -bemiddelaars tot een kredietwaardigheidstoets om overkreditering te voorkomen.", 'https://www.afm.nl');
  q('krediet', 'c07', 'Leennormen', "Waarop zijn de leennormen in de gedragscode van de VFN gebaseerd?",
    ["Op inkomen, woonlasten en een normbedrag voor levensonderhoud, met Nibud-cijfers als basis", "Alleen op de waarde van de auto", "Op de hoogte van de hypotheek", "Op de leeftijd van de aanvrager"], 0,
    "De VFN-leennormen bepalen welke maandlast verantwoord is na aftrek van woonlasten en een normbedrag voor levensonderhoud.", 'https://www.afm.nl');
  q('krediet', 'c08', 'BKR', "Hoe lang blijft een krediet volgens BKR na beëindiging zichtbaar in het CKI?",
    ["Vijf jaar", "Eén jaar", "Tien jaar", "Het wordt direct verwijderd"], 0,
    "Gegevens blijven na beëindiging van het krediet vijf jaar bewaard. Ook een achterstandsregistratie blijft na aflossing nog vijf jaar zichtbaar.", 'k93');
  q('krediet', 'c09', 'BKR', "Wat betekent een A-codering bij BKR?",
    ["Een betalingsachterstand", "Een afgelost krediet zonder bijzonderheden", "Een aanvraag die is afgewezen", "Een hypotheek met NHG"], 0,
    "Een A-codering wijst op een achterstand. Bij veel geldverstrekkers leidt dat tot afwijzing, tenzij het een afgeloste en verklaarbare achterstand is.", 'k93');
  q('krediet', 'c10', 'BKR', "Hoe kan een klant zijn eigen BKR-gegevens inzien?",
    ["Gratis via bkr.nl", "Alleen via zijn adviseur", "Alleen via de AFM", "Alleen tegen betaling via de bank"], 0,
    "Laat de klant vóór de aanvraag zelf zijn overzicht opvragen. Zo komen registraties niet pas laat in het traject boven tafel.", 'k93');
  q('krediet', 'c11', 'BKR', "Een klant meent dat een BKR-registratie onjuist is. Bij wie moet hij zijn?",
    ["Bij de kredietaanbieder die de registratie heeft gedaan", "Bij het BKR, dat zelf aanpast", "Bij de AFM", "Bij de notaris"], 0,
    "De kredietaanbieder is verantwoordelijk voor de juistheid van zijn registratie; BKR past niet zelf aan.", 'k93');
  q('krediet', 'c12', 'Krediet en hypotheek', "Hoe telt een doorlopend krediet mee in de NHG-toetsing van een hypotheek?",
    ["Met een maandlast van 2% van de oorspronkelijke limiet, ook als er niets is opgenomen", "Alleen het opgenomen bedrag telt mee", "Het telt niet mee", "Met 10% van de limiet per jaar"], 0,
    "In de NHG-normen wordt 2% van de oorspronkelijke limiet per maand als last meegenomen. Een ongebruikte limiet verlaagt dus de leencapaciteit.", 'k93');
  q('krediet', 'c13', 'Krediet en hypotheek', "Een klant lost een consumptief krediet af met extra hypotheek. Hoe kwalificeert dat deel?",
    ["Het is geen eigenwoningschuld; het valt in box 3", "Het is eigenwoningschuld met renteaftrek", "Het valt in box 2", "Het telt fiscaal nergens mee"], 0,
    "Alleen schuld voor verwerving, verbetering of onderhoud van de eigen woning is eigenwoningschuld. Een lening om een krediet af te lossen is dat niet.", 'k93');
  q('krediet', 'c14', 'Krediet', "Is de rente op een persoonlijke lening voor een auto fiscaal aftrekbaar?",
    ["Nee; de schuld valt in box 3", "Ja, in box 1", "Ja, als de lening via de bank loopt", "Alleen bij een groene auto"], 0,
    "Rente op consumptief krediet is niet aftrekbaar. De schuld kan in box 3 meetellen (boven de schuldendrempel).", 'https://www.belastingdienst.nl');
  q('krediet', 'c15', 'Krediet', "Wat is een kenmerk van een persoonlijke lening ten opzichte van een doorlopend krediet?",
    ["Een vast bedrag met een vaste looptijd en vaste maandtermijn; afgeloste bedragen kun je niet opnieuw opnemen", "Je kunt afgeloste bedragen steeds opnieuw opnemen", "De rente is altijd variabel", "Er is geen BKR-registratie"], 0,
    "Bij een persoonlijke lening ligt het aflossingsschema vast. Bij een doorlopend krediet kan binnen de limiet opnieuw worden opgenomen en is de rente meestal variabel.", 'https://www.afm.nl');
  q('krediet', 'c16', 'Krediet en hypotheek', "Telt een private-leasecontract mee bij de beoordeling van een hypotheekaanvraag?",
    ["Ja, de leaseverplichting telt mee als financiële last", "Nee, lease is geen lening", "Alleen als de auto zakelijk wordt gebruikt", "Alleen bij NHG"], 0,
    "Ook verplichtingen zoals private lease verlagen de leencapaciteit. Vraag er bij de inventarisatie actief naar.", 'k93');
  q('krediet', 'c17', 'Bemiddeling', "Wat heeft een onderneming nodig om consumenten te adviseren over of te bemiddelen in consumptief krediet?",
    ["Een vergunning van de AFM voor deze productcategorie", "Alleen een BKR-aansluiting", "Een vergunning van DNB", "Niets; consumptief krediet is vrij"], 0,
    "Ook consumptief krediet is een financieel product onder de Wft. Adviseren en bemiddelen vereisen een AFM-vergunning en vakbekwaamheid.", 'k66');

  /* ================= SCHADE PARTICULIER ================= */
  q('schade', 's01', 'Opstal', "Wat verzekert een opstalverzekering?",
    ["Het woonhuis zelf, inclusief vaste onderdelen", "De spullen in het huis", "De aansprakelijkheid van de bewoners", "Het inkomen bij arbeidsongeschiktheid"], 0,
    "De opstalverzekering dekt het gebouw. Losse spullen vallen onder de inboedelverzekering.", 'k88');
  q('schade', 's02', 'Opstal', "Op welke waarde wordt een woonhuis in de opstalverzekering verzekerd?",
    ["De herbouwwaarde", "De marktwaarde", "De WOZ-waarde", "De koopsom"], 0,
    "De herbouwwaarde is wat het kost om de woning na totaal verlies opnieuw te bouwen. Grond hoeft niet herbouwd te worden, dus de herbouwwaarde wijkt af van markt- en WOZ-waarde.", 'k88');
  q('schade', 's03', 'Opstal', "Waarom heeft de hypotheekadviseur een natuurlijk moment om de opstalverzekering te beoordelen?",
    ["Vrijwel elke geldverstrekker eist dat de woning tegen onder meer brand en storm is verzekerd", "Omdat de AFM de opstalpolis goedkeurt", "Omdat de opstalverzekering onder het provisieverbod valt", "Omdat NHG de premie betaalt"], 0,
    "De geldverstrekker wil zijn onderpand beschermd zien. Bij de hypotheek controleer je dus of er een passende opstalverzekering is.", 'k88');
  q('schade', 's04', 'Onderverzekering', "Het verzekerd bedrag is lager dan de herbouwwaarde. Wat kan de verzekeraar doen bij een gedeeltelijke schade?",
    ["De schade naar verhouding vergoeden (evenredigheidsregel)", "Altijd de volledige schade vergoeden", "Niets vergoeden", "De premie met terugwerkende kracht verhogen en volledig vergoeden"], 0,
    "Bij onderverzekering mag de verzekeraar de evenredigheidsregel toepassen, ook bij gedeeltelijke schade, tenzij de polis een garantie tegen onderverzekering geeft.", 'k108');
  q('schade', 's05', 'Onderverzekering', "Een woning heeft een herbouwwaarde van € 400.000 en is verzekerd voor € 300.000. Bij een schade van € 40.000 en toepassing van de evenredigheidsregel ontvangt de klant:",
    ["€ 30.000", "€ 40.000", "€ 10.000", "€ 0"], 0,
    "Verzekerd is 300.000 / 400.000 = 75% van de waarde. De vergoeding is 75% × € 40.000 = € 30.000.", 'herbouwwaarde.html');
  q('schade', 's06', 'Onderverzekering', "Wat regelt een garantie tegen onderverzekering?",
    ["Dat de verzekeraar onder voorwaarden geen beroep doet op onderverzekering", "Dat de klant altijd het dubbele uitgekeerd krijgt", "Dat de premie nooit stijgt", "Dat ook opzet is gedekt"], 0,
    "Veel polissen hebben zo'n garantie, soms onbeperkt, soms tot een maximum of onder voorwaarden zoals juiste gegevens, periodieke controle en het melden van verbouwingen.", 'k88');
  q('schade', 's07', 'Opstal', "Wat geldt sinds 2026 voor de Herbouwwaardemeter Woningen van het Verbond van Verzekeraars?",
    ["Die is na de editie 2025 stopgezet; je gebruikt de methode van de verzekeraar, een taxatie of een andere bron", "Die is wettelijk verplicht geworden", "Die bepaalt voortaan ook de WOZ-waarde", "Die is vervangen door de NHG-grens"], 0,
    "Het Verbond is met de meter gestopt. Gebruik bijvoorbeeld de herbouwwaarde uit het taxatierapport of de methode van de verzekeraar.", 'k88');
  q('schade', 's08', 'Opstal', "Een klant koopt een appartement. Wie verzekert in de regel het gebouw?",
    ["De Vereniging van Eigenaars (VvE)", "Elke eigenaar afzonderlijk voor het hele gebouw", "De geldverstrekker", "De gemeente"], 0,
    "De VvE verzekert het gebouw. Controleer de opstalpolis van de VvE en dek eigen verbeteringen (zoals keuken of badkamer) via inboedel of een aanvullende dekking.", 'k88');
  q('schade', 's09', 'Opstal', "Een klant laat een aanbouw plaatsen. Wat moet hij doen met zijn opstalverzekering?",
    ["De waardeverhoging melden bij de verzekeraar", "Niets; de dekking past zich automatisch aan", "De verzekering opzeggen", "Alleen de geldverstrekker informeren"], 0,
    "Een verbouwing verhoogt de herbouwwaarde. Wordt die niet gemeld, dan dreigt onderverzekering of verlies van de garantie tegen onderverzekering.", 'k88');
  q('schade', 's10', 'Inboedel', "Wat valt doorgaans onder de inboedelverzekering?",
    ["Een bankstel", "De dakkapel", "De kozijnen", "De fundering"], 0,
    "Inboedel zijn de roerende zaken in het huis, zoals meubels, kleding en apparatuur. Vaste onderdelen van het gebouw vallen onder opstal.", 'k88');
  q('schade', 's11', 'Inboedel', "Een huurder heeft op eigen kosten een nieuwe keuken in zijn huurwoning laten plaatsen. Hoe kan hij die verzekeren?",
    ["Als huurdersbelang, vaak meeverzekerd onder de inboedelverzekering", "Via de opstalverzekering van de verhuurder, automatisch", "Via de AVP", "Dat kan niet"], 0,
    "Verbeteringen die een huurder zelf aanbrengt, heten huurdersbelang. Veel inboedelpolissen dekken dat tot een bepaald bedrag; controleer of dat voldoende is.", 'k88');
  q('schade', 's12', 'AVP', "Wat dekt een aansprakelijkheidsverzekering voor particulieren (AVP)?",
    ["Schade die de verzekerde of zijn gezinsleden als particulier aan anderen veroorzaken en waarvoor zij aansprakelijk zijn", "Schade aan de eigen spullen", "Schade aan de eigen auto", "Schade die tijdens het werk aan klanten wordt veroorzaakt"], 0,
    "De AVP dekt de wettelijke aansprakelijkheid in de particuliere hoedanigheid. Eigen schade en beroepsmatige aansprakelijkheid vallen erbuiten.", 'https://www.verbondvanverzekeraars.nl');
  q('schade', 's13', 'AVP', "Een kind van 10 jaar veroorzaakt schade bij de buren. Wie is aansprakelijk?",
    ["De ouders", "Het kind zelf", "Niemand", "De school"], 0,
    "Voor schade door kinderen jonger dan 14 jaar zijn de ouders aansprakelijk (art. 6:169 BW). De AVP van de ouders dekt dit doorgaans.", 'https://www.verbondvanverzekeraars.nl');
  q('schade', 's14', 'AVP', "Welke schade is op een AVP doorgaans uitgesloten?",
    ["Schade die met opzet is veroorzaakt", "Schade die per ongeluk aan de fiets van de buurman is veroorzaakt", "Schade door een kind van zes", "Schade door een omgevallen boom uit eigen tuin waarvoor de verzekerde aansprakelijk is"], 0,
    "Opzettelijk veroorzaakte schade is uitgesloten. Verzekering dekt onzekere voorvallen.", 'https://www.verbondvanverzekeraars.nl');
  q('schade', 's15', 'Algemeen', "Wat betekent het indemniteitsbeginsel bij schadeverzekeringen?",
    ["De verzekerde mag er door de uitkering niet op vooruitgaan", "De verzekeraar keert altijd het verzekerde bedrag uit", "De verzekerde betaalt nooit eigen risico", "De premie is altijd gelijk"], 0,
    "Een schadeverzekering vergoedt de werkelijk geleden schade, niet meer. Daarom leidt oververzekering niet tot een hogere uitkering.", 'k108');
  q('schade', 's16', 'Algemeen', "Een woning is verzekerd voor een hoger bedrag dan de herbouwwaarde. Wat betekent dat bij schade?",
    ["De klant krijgt niet meer dan de werkelijke schade; hij betaalt alleen te veel premie", "De klant krijgt het verzekerde bedrag uitgekeerd", "De verzekering is ongeldig", "De klant krijgt een bonus"], 0,
    "Door het indemniteitsbeginsel wordt alleen de werkelijke schade vergoed. Oververzekering kost alleen premie.", 'k88');
  q('schade', 's17', 'Mededelingsplicht', "Wat houdt de mededelingsplicht bij het sluiten van een verzekering in?",
    ["De klant moet vóór het sluiten feiten melden die hij kent of behoort te kennen en die van belang zijn voor de beoordeling door de verzekeraar", "De verzekeraar moet de klant elk jaar informeren over de premie", "De adviseur moet elke schade melden bij de AFM", "De klant moet na elke schade een nieuw formulier invullen"], 0,
    "Deze plicht (art. 7:928 BW) geldt vóór het sluiten. Schending kan gevolgen hebben voor de dekking. De adviseur wijst de klant hierop en helpt de vragen correct te beantwoorden.", 'k109');
  q('schade', 's18', 'Provisie', "Mag een adviseur bij het bemiddelen in een particuliere inboedelverzekering provisie van de verzekeraar ontvangen?",
    ["Ja; schadeverzekeringen vallen niet onder het provisieverbod", "Nee; alle verzekeringen vallen onder het provisieverbod", "Alleen als de klant daar schriftelijk mee instemt bij de AFM", "Alleen bij een jaarpremie boven € 1.000"], 0,
    "Het provisieverbod geldt voor onder meer hypothecair krediet en complexe producten, niet voor gewone schadeverzekeringen. Wel moet de adviseur transparant zijn en in het belang van de klant handelen.", 'k61');
  q('schade', 's19', 'Algemeen', "Welk effect heeft een hoger eigen risico op een schadeverzekering in de regel?",
    ["Lagere premie, maar de klant betaalt bij schade meer zelf", "Hogere premie en hogere uitkering", "Geen effect op de premie", "De verzekering dekt meer soorten schade"], 0,
    "Met een hoger eigen risico draagt de klant kleinere schades zelf, waardoor de premie daalt. Kijk of dat past bij zijn buffer.", 'k88');
  q('schade', 's20', 'Inboedel', "Waarom is het verstandig de inboedelwaarde periodiek te laten vaststellen?",
    ["Om onderverzekering te voorkomen en de garantie tegen onderverzekering te behouden", "Omdat de AFM dat jaarlijks controleert", "Omdat de WOZ-waarde ervan afhangt", "Om de opstalpremie te verlagen"], 0,
    "De waarde van de inboedel groeit vaak mee met inkomen en gezinssituatie. Een actuele waardebepaling voorkomt onderverzekering.", 'k108');

  window.OEFENVRAGEN_MODULES = M;
  window.OEFENVRAGEN = V;
})();
