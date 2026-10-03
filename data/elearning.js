/* E-LEARNING van het Adviesforum
 *
 * Korte e-learnings (10-20 minuten) per onderwerp, gemaakt van de eigen content van het forum:
 * de kennisbank (data/kennisbank*.js), de oefenvragen en de rekentools. Gebruikt door elearning.html.
 *
 * LET OP (AFM-relevant): dit is zelfstudie. Een module levert GEEN erkende PE-punten op en is GEEN
 * officieel Wft-certificaat. Het deelnamebewijs zegt dat ook letterlijk. Wek nergens een andere indruk.
 *
 * Velden per module:
 *   id          korte code; deeplink elearning.html#module-<id> en #module-<id>-les-<n> (n vanaf 1)
 *   titel, kort  titel en korte omschrijving voor de modulekaart
 *   duur        geschatte duur in minuten (lessen + toets)
 *   peildatum   datum waarop de inhoud is gebaseerd
 *   leerdoelen  lijst met wat de deelnemer na afloop kan
 *   lessen      3-5 lessen: { titel, tekst, artikelen, tools, vraag }
 *                 tekst      lijst; een string is een alinea, een lijst van strings is een opsomming
 *                 artikelen  kennisbank-ids (link index.html#artikel-<id>); titels staan in ARTIKELTITELS
 *                 tools      lijst met { titel, url } naar pagina's en rekenhulpen van de site
 *                 vraag      tussenvraag { vraag, opties (4), juist (index), uitleg }
 *   toets       eindtoets: 8-10 meerkeuzevragen { vraag, opties, juist, uitleg, bron }
 *               bron = kennisbank-id; de vragen zijn een vaste set per module (geen kopie van oefenvragen).
 * Slagingsgrens: ELEARNING.slagingsgrens (0,7 = 70%).
 * Controle: node laadt dit bestand; elk id in artikelen en bron moet in de kennisbank bestaan.
 */
(function () {
  'use strict';
  function v(vraag, opties, juist, uitleg, bron) {
    const o = { vraag: vraag, opties: opties, juist: juist, uitleg: uitleg };
    if (bron) o.bron = bron;
    return o;
  }

  const MODULES = [
    /* ---------------------------------------------------------------- 1 */
    {
      id: 'leennormen',
      titel: 'Hypotheekadvies 2026: leennormen en Trhk',
      kort: 'Hoe de leennormen 2026 werken, wat de toetsrente doet en waarom maximaal lenen niet hetzelfde is als verantwoord lenen.',
      duur: 15,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je legt uit hoe de financieringslastpercentages 2026 tot stand komen en wat er ten opzichte van 2025 veranderde.',
        'Je weet wanneer de minimale toetsrente van de AFM geldt.',
        'Je kent de extra leenruimte voor energielabels en energiebesparende voorzieningen in 2026.',
        'Je kunt uitleggen waarom een lening binnen de Trhk-norm niet automatisch passend is.'
      ],
      lessen: [
        {
          titel: 'De Trhk en het Nibud-advies',
          tekst: [
            'De Tijdelijke regeling hypothecair krediet (Trhk) legt vast hoeveel een klant maximaal mag lenen. Het Nibud brengt elk najaar een advies uit over de normen voor het volgende jaar; dat advies is voor 2026 grotendeels overgenomen. Is er een verschil, dan geldt de regeling.',
            'Een paar kenmerken van de normen 2026:',
            [
              'Het financieringslastpercentage is het gemiddelde over vier jaar (2022 tot en met 2025).',
              'Nieuw: percentages worden afgerond op 0,1 procent in plaats van 0,5 procent. Dat geeft kleinere sprongen tussen inkomens.',
              'Er zijn vier tabellen: niet-AOW en AOW, elk voor een box 1-deel en een box 3-deel.',
              'Het tweede inkomen telt sinds 2023 volledig mee.'
            ],
            'Voor AOW-gerechtigden is er een aparte tabel met hogere percentages, omdat zij minder belasting betalen. Bereikt de klant binnen tien jaar de AOW-leeftijd, dan toets je ook of het inkomen daarna voldoende is.'
          ],
          artikelen: ['k10', 'k185'],
          tools: [
            { titel: 'Leennormen 2026', url: 'leennormen-2026.html' },
            { titel: 'Rekenhulp maximale koopsom', url: 'rekentools.html#maximale-koopsom' }
          ],
          vraag: v('Op welke nauwkeurigheid worden de financieringslastpercentages vanaf 2026 afgerond?',
            ['Op 0,1 procent', 'Op 0,5 procent', 'Op 1 procent', 'Ze worden niet afgerond'], 0,
            'Vanaf 2026 rond je af op 0,1 procent in plaats van 0,5 procent. Daardoor ontstaan percentages als 24,6% en zijn de stappen tussen inkomens kleiner.')
        },
        {
          titel: 'Minder lenen zonder loonstijging, en de toetsrente',
          tekst: [
            'Door de inflatie van de afgelopen jaren liggen de percentages voor de meeste inkomens iets lager dan in 2025. Wie geen loonstijging heeft gehad, kan in 2026 dus minder lenen. SEH rekende een voorbeeld door: bij een toetsinkomen van € 46.500 en 5% toetsrente daalde het percentage van 25,5% naar 24,6%, ongeveer € 6.500 minder leenruimte.',
            'Praktisch gevolg: heb je eind vorig jaar een maximale hypotheek voorgerekend, herbereken die dan in januari. Leg vast met welk normenjaar je hebt gerekend.',
            'De minimale toetsrente stelt de AFM per kwartaal vast; die maakt geen deel uit van het Nibud-advies. Je gebruikt hem bij een rentevaste periode korter dan tien jaar en bij hypotheken die binnen tien jaar volledig worden afgelost. Controleer altijd de actuele waarde.'
          ],
          artikelen: ['k10', 'k185'],
          tools: [
            { titel: 'Leenruimte bij kort of lang rentevast', url: 'rekentools.html#toetsrente-rentevast' }
          ],
          vraag: v('Bij welke situatie reken je met de minimale toetsrente van de AFM?',
            ['Bij elke hypotheek met NHG', 'Bij een rentevaste periode korter dan tien jaar', 'Alleen bij aflossingsvrije leningdelen', 'Alleen bij AOW-gerechtigden'], 1,
            'De minimale toetsrente geldt bij een rentevaste periode korter dan tien jaar en bij hypotheken die binnen tien jaar volledig worden afgelost.')
        },
        {
          titel: 'Energielabel, studieschuld en alleenstaanden',
          tekst: [
            'Een zuinig energielabel geeft bij aankoop extra leenruimte bovenop de standaardtabel:',
            [
              'C of D: € 5.000; A of B: € 10.000; A+ of A++: € 20.000.',
              'A+++: € 25.000; A++++: € 30.000; A++++ met energieprestatiegarantie: € 40.000.',
              'E, F, G of geen geldig label: niets extra.'
            ],
            'Daarnaast mag de klant extra lenen voor energiebesparende voorzieningen van de Trhk-lijst, naar het label vóór de verbouwing: € 20.000 bij E, F of G, € 15.000 bij C of D en € 10.000 bij A tot en met A++ of een onbekend label. Bij A+++ en A++++ is dat bedrag in 2026 vervallen.',
            'Een studieschuld telt mee. Bij een box 1-hypotheek bruteer je het wettelijke maandbedrag met een factor die afhangt van de hypotheekrente (bijvoorbeeld 1,20 bij een rente tussen 3,001% en 4,000%). Voor aantoonbaar niet-kwetsbare alleenstaanden blijft het extra bedrag € 17.000.'
          ],
          artikelen: ['k10', 'k143'],
          tools: [
            { titel: 'Studieschuld terugbetalen', url: 'rekentools.html#studieschuld' },
            { titel: 'Terugverdientijd verduurzaming', url: 'rekentools.html#verduurzamen' }
          ],
          vraag: v('Hoeveel extra leenruimte geeft een woning met label A+++ bij aankoop in 2026?',
            ['€ 10.000', '€ 20.000', '€ 25.000', '€ 30.000'], 2,
            'Bij A+++ is het extra bedrag in 2026 € 25.000 (in 2025 was dat € 30.000). De verlaging hangt samen met het einde van de salderingsregeling.')
        },
        {
          titel: 'Maximaal is niet hetzelfde als verantwoord',
          tekst: [
            'De leennorm is de krediettoets van de geldverstrekker. Volgens de AFM-Leidraad Hypotheekadvisering (april 2026) is een lening binnen de Trhk-norm niet vanzelf passend, bijvoorbeeld bij een hoge levensstandaard of een te laag pensioeninkomen.',
            'Wat de AFM in het adviestraject verwacht:',
            [
              'Bespreek bij een vraag naar de maximale hypotheek dat de normen uitgaan van een huishouden zonder kinderen.',
              'Kijk naar alle woonlasten: ook energie, belastingen, onderhoud, opstalverzekering en eventueel erfpacht.',
              'Adviseer je boven de norm, dan is ‘goed toekomstperspectief’ niet genoeg. Maak de bijzondere omstandigheid concreet en reken die door.',
              'Leg vast welk normenjaar, welke toetsrente en welk energielabel (met registratiedatum) je hebt gebruikt.'
            ]
          ],
          artikelen: ['k11', 'k60'],
          tools: [
            { titel: 'Past deze woning?', url: 'rekentools.html#haalbaarheid-woning' },
            { titel: 'Adviesmotivatie hypotheek', url: 'adviesmotivatie.html' }
          ],
          vraag: v('Je adviseert boven de Trhk-norm. Wat volstaat volgens de Leidraad niet als onderbouwing?',
            ['Een doorgerekende, concreet benoemde inkomensstijging', 'Alleen de opmerking dat de klant een goed toekomstperspectief heeft', 'Een vastgelegde berekening van alle woonlasten', 'Een concreet vermogen dat de lasten aantoonbaar dekt'], 1,
            'Algemene termen als ‘goed toekomstperspectief’ of ‘behoorlijk eigen vermogen’ zijn onvoldoende. Je concretiseert de bijzondere omstandigheid en rekent die door.')
        }
      ],
      toets: [
        v('Over welke periode is het financieringslastpercentage 2026 een gemiddelde?',
          ['2023 tot en met 2025', '2022 tot en met 2025', '2021 tot en met 2024', 'Alleen 2025'], 1,
          'Het percentage 2026 is het gemiddelde over vier jaar: 2022 tot en met 2025. 2021 valt uit de berekening.', 'k10'),
        v('Wat geldt als het Nibud-advies en de Trhk van elkaar verschillen?',
          ['Het Nibud-advies', 'De regeling (Trhk)', 'Wat voor de klant gunstiger is', 'De norm van de geldverstrekker'], 1,
          'Het advies is grotendeels overgenomen in de Trhk. Bij een verschil geldt de regeling.', 'k10'),
        v('Hoeveel tabellen met financieringslastpercentages kent de regeling?',
          ['Twee', 'Drie', 'Vier', 'Zes'], 2,
          'Vier: niet-AOW en AOW, elk voor aftrekbare (box 1) en niet-aftrekbare (box 3) delen.', 'k10'),
        v('Een klant had in 2025 een maximale hypotheek voorgerekend gekregen en heeft geen loonstijging gehad. Wat is in 2026 waarschijnlijk het geval?',
          ['Hij kan meer lenen', 'Hij kan evenveel lenen', 'Hij kan minder lenen', 'Dat hangt alleen af van het energielabel'], 2,
          'Zonder loonstijging daalt de maximale hypotheek bij alle inkomens, omdat de percentages iets lager liggen.', 'k185'),
        v('Hoeveel extra mag in 2026 worden geleend voor energiebesparende voorzieningen bij een woning met label E vóór de verbouwing?',
          ['€ 10.000', '€ 15.000', '€ 20.000', '€ 25.000'], 2,
          'Bij label E, F of G vóór de verbouwing is het maximale extra bedrag € 20.000.', 'k10'),
        v('Wat is het extra hypotheekbedrag voor aantoonbaar niet-kwetsbare alleenstaanden in 2026?',
          ['€ 10.000', '€ 17.000', '€ 17.356', '€ 25.000'], 1,
          'Het bedrag blijft € 17.000. Geïndexeerd zou het € 17.356 zijn, maar het Nibud adviseerde het te handhaven.', 'k10'),
        v('Wie stelt de minimale toetsrente vast?',
          ['Het Nibud', 'De AFM', 'NHG', 'De geldverstrekker'], 1,
          'De AFM stelt de minimale toetsrente per kwartaal vast. Hij is geen onderdeel van het Nibud-advies.', 'k10'),
        v('Wat leg je volgens de kennisbank in elk geval vast bij een berekening van de maximale hypotheek?',
          ['Alleen de uitkomst', 'Het normenjaar, de toetsrente en het energielabel met registratiedatum', 'Alleen de rente van de gekozen geldverstrekker', 'Niets; de geldverstrekker legt dit vast'], 1,
          'Leg vast met welke normen (jaar en versie), welke toetsrente en welk label je hebt gerekend. Zo blijft het advies reconstrueerbaar.', 'k10'),
        v('Waarom is een lening binnen de Trhk-norm volgens de Leidraad niet automatisch passend?',
          ['Omdat de Trhk alleen voor NHG-leningen geldt', 'Omdat de norm een krediettoets is en bijvoorbeeld levensstandaard en pensioeninkomen niet volledig meeweegt', 'Omdat de norm alleen voor starters geldt', 'Omdat de AFM de Trhk heeft ingetrokken'], 1,
          'De leennorm is de krediettoets. De adviseur beoordeelt daarnaast wat voor deze klant verantwoord is, bijvoorbeeld bij een hoge levensstandaard of onvoldoende pensioeninkomen.', 'k11')
      ]
    },

    /* ---------------------------------------------------------------- 2 */
    {
      id: 'nhg',
      titel: 'NHG 2026',
      kort: 'De NHG-grens, de borgtochtprovisie, de belangrijkste acceptatievoorwaarden en wat er in 2026 en richting 2027 verandert.',
      duur: 15,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je kent de NHG-grens 2026, met en zonder energiebesparende voorzieningen.',
        'Je legt uit wat de borgtochtprovisie is en wanneer die niet verschuldigd is.',
        'Je noemt de belangrijkste acceptatievoorwaarden van de V&N 2026.',
        'Je kent de wijzigingen voor 2026 en weet dat de V&N 2027 eraan komen.'
      ],
      lessen: [
        {
          titel: 'De NHG-grens en de borgtochtprovisie',
          tekst: [
            'NHG is een borgtocht van de Stichting Waarborgfonds Eigen Woningen aan de geldverstrekker. De spelregels staan in de Voorwaarden & Normen (V&N). Voor aanbiedingen vanaf 1 januari 2026 geldt versie 2026-1.',
            [
              'De NHG-grens is € 470.000 (2025: € 450.000).',
              'Met energiebesparende voorzieningen mag de lening uitkomen op € 498.200.',
              'Er is nu één grens voor alle woningtypen; het aparte regime voor woonwagens en standplaatsen is vervallen.'
            ],
            'De klant betaalt eenmalig 0,4% borgtochtprovisie over de hele lening bij aankoop. Bij verhogen van een bestaande NHG-lening is dat 0,4% over alleen de verhoging. Bij zuiver oversluiten van NHG naar NHG zonder verhoging betaalt de klant niets. Eindigt de borg eerder, dan krijgt de klant niets terug. Fiscaal is de provisie aftrekbare financieringskosten.'
          ],
          artikelen: ['k70', 'k186'],
          tools: [
            { titel: 'NHG-check 2026', url: 'nhg-check.html' }
          ],
          vraag: v('Wat is de NHG-grens 2026 zonder energiebesparende voorzieningen?',
            ['€ 450.000', '€ 470.000', '€ 477.000', '€ 498.200'], 1,
            'De NHG-grens 2026 is € 470.000. Met energiebesparende voorzieningen mag de lening tot € 498.200.')
        },
        {
          titel: 'Wat NHG dekt en wat het vraagt',
          tekst: [
            'NHG vergoedt de geldverstrekker bij een verlies na verkoop, met een eigen risico van 10% voor de geldverstrekker. De borg daalt maandelijks alsof de lening annuïtair wordt afgelost, en loopt nooit langer dan 30 jaar. Een klant die te goeder trouw niet kon betalen en volledig meewerkte, kan kwijtschelding krijgen.',
            'Belangrijke acceptatievoorwaarden:',
            [
              'Elke aanvrager is hoofdelijk aansprakelijk, (mede-)eigenaar en bewoont de woning als hoofdverblijf.',
              'De LTV is maximaal 100% van de marktwaarde, met energiebesparende voorzieningen maximaal 106%.',
              'Aflossing in maximaal 30 jaar; aflossingsvrij alleen voor een bestaande eigenwoningschuld en tot 50% van de marktwaarde.',
              'NHG eist geen overlijdensrisicoverzekering.',
              'De geldverstrekker meldt de lening binnen 14 dagen na verstrekking bij NHG.'
            ]
          ],
          artikelen: ['k70', 'k75'],
          tools: [
            { titel: 'Loan-to-value', url: 'ltv.html' },
            { titel: 'NHG-check 2026', url: 'nhg-check.html' }
          ],
          vraag: v('Is een overlijdensrisicoverzekering een eis voor NHG in 2026?',
            ['Ja, altijd', 'Ja, boven 80% LTV', 'Nee, NHG eist geen ORV', 'Alleen bij een aflossingsvrij deel'], 2,
            'De V&N eisen geen overlijdensrisicoverzekering (D.1.3.2). Of een ORV verstandig is, blijft een adviesvraag.')
        },
        {
          titel: 'Wat er in 2026 veranderde',
          tekst: [
            'Naast de hogere grens bevatten de V&N 2026 een aantal praktische wijzigingen:',
            [
              'Drijvende woningen kunnen onder eigen voorwaarden NHG krijgen.',
              'Tijdelijk twee woningen bij verhuizen: de oude NHG-lening mag onder voorwaarden tijdelijk volledig aflossingsvrij, maximaal het lopende kalenderjaar plus drie jaar.',
              'Tijdelijke verhuur wegens werk elders: de maximale termijn van drie jaar is vervallen; de eerste huurperiode is maximaal drie jaar, daarna verlenging met telkens maximaal een jaar.',
              'Een gekoppeld opbouwproduct mag in een aantal situaties worden vrijgegeven, als dat passend en verantwoord is.'
            ],
            'Voor ondernemers met een Inkomensverklaring Ondernemer (IKV) gelden sinds 1 maart 2025 aangescherpte toetskaders. Werkt iemand 80% of meer van een voltijdbaan in loondienst, dan telt ondernemersinkomen mee tot maximaal 30% van het voltijdse loondienstinkomen.'
          ],
          artikelen: ['k71', 'k186'],
          tools: [
            { titel: 'NHG-beheertoets 2026', url: 'nhg-beheertoets.html' },
            { titel: 'Toetsinkomen ondernemer', url: 'rekentools.html#toetsinkomen-ondernemer' }
          ],
          vraag: v('Hoe lang mag de oude NHG-lening bij tijdelijk twee woningen volledig aflossingsvrij worden gemaakt?',
            ['Maximaal 6 maanden', 'Maximaal het lopende kalenderjaar plus drie jaar', 'Onbeperkt', 'Maximaal 10 jaar'], 1,
            'Onder voorwaarden mag de oude lening tijdelijk volledig aflossingsvrij, maximaal het lopende kalenderjaar plus drie jaar.')
        },
        {
          titel: 'Vooruitblik: V&N 2027 en vastleggen',
          tekst: [
            'NHG publiceert wijzigingen minimaal twee maanden voor de ingangsdatum. De definitieve V&N 2027 worden rond 1 november 2026 verwacht. Aangekondigde punten zijn onder meer een funderingstoets (bij risicoklasse D of E verplicht verkennend onderzoek) en een energiebespaarbudget van minimaal € 20.000 bij aankoop van een woning met label E, F of G. Controleer de definitieve tekst.',
            'Rond de jaarwisseling bepaalt de datum van het bindend aanbod welke versie geldt. Leg daarom altijd vast met welke V&N-versie je hebt gerekend, en vraag bij ondernemers met ook loondienstinkomen de extra documenten (geregistreerde inkomensverklaring en UWV-verzekeringsbericht) vroeg op.'
          ],
          artikelen: ['k186', 'k201'],
          tools: [
            { titel: 'Documentenchecklist', url: 'documentenchecklist.html' }
          ],
          vraag: v('Welke V&N-versie is van toepassing op een NHG-lening?',
            ['Altijd de nieuwste versie', 'De versie die gold bij de datum van het bindend aanbod', 'De versie van het jaar van passeren', 'De versie die de klant kiest'], 1,
            'Versie 2026-1 geldt voor leningen waarvoor het bindend aanbod op of na 1 januari 2026 is uitgebracht. Rond de jaarwisseling is de datum van het aanbod dus bepalend.')
        }
      ],
      toets: [
        v('Hoe hoog is de borgtochtprovisie bij aankoop met NHG in 2026?',
          ['0,4% over de hele lening', '0,6% over de hele lening', '0,4% over het deel boven 80% LTV', '1% over de koopsom'], 0,
          'De klant betaalt eenmalig 0,4% over de hoofdsom van de hele lening.', 'k70'),
        v('Een klant verhoogt een bestaande NHG-lening. Waarover betaalt hij borgtochtprovisie?',
          ['Over de hele nieuwe lening', 'Alleen over de verhoging', 'Niets', 'Over de marktwaarde'], 1,
          'Bij verhogen van een bestaande NHG-lening is de provisie 0,4% over alleen de verhoging.', 'k70'),
        v('Wat is het eigen risico van de geldverstrekker bij een NHG-claim?',
          ['0%', '5%', '10%', '25%'], 2,
          'NHG vergoedt het verlies na verkoop minus een eigen risico van 10% voor de geldverstrekker.', 'k70'),
        v('Wat is de maximale LTV bij NHG met energiebesparende voorzieningen?',
          ['100%', '104%', '106%', '110%'], 2,
          'Zonder voorzieningen maximaal 100% van de marktwaarde; met energiebesparende voorzieningen maximaal 106%.', 'k70'),
        v('Mag een NHG-lening bij aankoop deels aflossingsvrij zijn?',
          ['Ja, tot 50% van de marktwaarde, maar alleen voor een bestaande eigenwoningschuld', 'Ja, onbeperkt', 'Nee, nooit', 'Ja, tot 100% bij starters'], 0,
          'Aflossingsvrij mag alleen voor een bestaande eigenwoningschuld en tot maximaal 50% van de marktwaarde.', 'k70'),
        v('Binnen welke termijn moet de geldverstrekker een NHG-lening melden?',
          ['7 dagen', '14 dagen', '30 dagen', '3 maanden'], 1,
          'De geldverstrekker meldt de lening binnen 14 dagen na verstrekking; zonder melding betaalt NHG niet uit.', 'k70'),
        v('Wat is nieuw aan het woningbegrip in de V&N 2026?',
          ['NHG is mogelijk voor drijvende woningen, onder eigen voorwaarden', 'Recreatiewoningen vallen eronder', 'Verhuurde woningen vallen eronder', 'Er is geen woningbegrip meer'], 0,
          'Drijvende woningen kunnen onder voorwaarden NHG krijgen, zoals een vaste ligplaats en verzekering tegen zinken.', 'k71'),
        v('Een klant werkt 90% van een voltijdbaan in loondienst en heeft daarnaast een onderneming (IKV met NHG). Wat geldt?',
          ['Ondernemersinkomen telt niet mee', 'Ondernemersinkomen telt mee tot maximaal 30% van het voltijdse loondienstinkomen', 'Ondernemersinkomen telt volledig mee', 'Alleen het ondernemersinkomen telt mee'], 1,
          'Volgens de 80%-regel geldt de klant als voltijdwerknemer; het ondernemersinkomen telt mee tot maximaal 30%, en het totaal is nooit hoger dan 130% van het voltijdse loondienstinkomen.', 'k186'),
        v('Wanneer worden de definitieve V&N 2027 verwacht?',
          ['Rond 1 november 2026', 'Op 1 januari 2027', 'In het voorjaar van 2027', 'Ze zijn al in 2025 gepubliceerd'], 0,
          'NHG kondigde aan dat de definitieve V&N 2027 rond 1 november 2026 verschijnen.', 'k186')
      ]
    },

    /* ---------------------------------------------------------------- 3 */
    {
      id: 'fundering',
      titel: 'Funderingsrisico en woningdata',
      kort: 'Funderingsschade herkennen, de risicoklassen in het taxatierapport, financiering van herstel en het verschil tussen woningdata en een taxatie.',
      duur: 18,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je herkent woningen en situaties met een verhoogd funderingsrisico.',
        'Je kent de KCAF-risicoklassen A tot en met E en weet waar je ze vindt.',
        'Je kent de routes om funderingsherstel te financieren.',
        'Je legt het verschil uit tussen een modelwaarde, een hybride taxatie en een volledige taxatie.',
        'Je weet wat de AFM van je verwacht bij funderingsrisico.'
      ],
      lessen: [
        {
          titel: 'Hoe funderingsschade ontstaat',
          tekst: [
            'Funderingsproblemen behoren tot de grootste financiële risico’s van een woning en zijn vrijwel nooit verzekerd. Het KCAF schat dat ongeveer een half miljoen woningen problemen heeft of kan krijgen.',
            [
              'Houten palen: vooral bij woningen van vóór ongeveer 1970 op slappe grond. Zakt het grondwater onder de paalkoppen, dan kan het hout gaan rotten (droogstand).',
              'Ook palen onder water kunnen over tientallen jaren door bacteriën verzwakken.',
              'Ondiepe funderingen zijn gevoelig voor bodemdaling en krimp van klei of veen bij droogte.',
              'Signalen: scheuren, klemmende deuren en ramen, scheve vloeren en scheefstand.'
            ],
            'Bij rijwoningen en appartementen gaat het om de fundering van het hele blok. Schade kan dus ook de waarde van buurwoningen drukken.'
          ],
          artikelen: ['k140', 'k144'],
          tools: [
            { titel: 'Herbouwwaarde en onderverzekering', url: 'herbouwwaarde.html' }
          ],
          vraag: v('Is schade door paalrot of bodemdaling meestal gedekt door de opstalverzekering?',
            ['Ja, altijd', 'Ja, als de klant een uitgebreide dekking heeft', 'Nee, het is een geleidelijk proces dat vrijwel altijd buiten de dekking valt', 'Alleen bij nieuwbouw'], 2,
            'Paalrot, droogstand en bodemdaling zijn geleidelijke processen. Die vallen vrijwel altijd buiten de opstalverzekering.')
        },
        {
          titel: 'Risicoklassen en bronnen',
          tekst: [
            'Sinds 1 april 2026 bevat het model taxatierapport woonruimte een funderingsrisicoklasse van A tot en met E op basis van KCAF-gegevens:',
            [
              'A: geen risico; B: licht risico; C: verhoogd risico of onzekerheid.',
              'D: hoog risico, verder onderzoek aanbevolen; E: vastgesteld funderingsprobleem.'
            ],
            'Andere bronnen zijn de funderingsviewer met indicatieve aandachtsgebieden, het bouwdossier bij de gemeente en VvE-stukken. Funderingscijfer.nl geeft een eigen indicatief cijfer op een schaal van 2 tot 8; dat is een andere schaal dan de KCAF-klasse.',
            'Een modelmatige score geeft richting, geen zekerheid. Alleen funderingsonderzoek door een gespecialiseerd bureau of betrouwbare gegevens uit het bouwdossier zeggen iets over de werkelijke staat. Presenteer een indicatie dus nooit als oordeel.'
          ],
          artikelen: ['k140', 'k147'],
          tools: [],
          vraag: v('Wat betekent funderingsrisicoklasse E?',
            ['Geen risico', 'Licht risico', 'Hoog risico, onderzoek aanbevolen', 'Vastgesteld funderingsprobleem'], 3,
            'Klasse E betekent een vastgesteld funderingsprobleem. Klasse D is hoog risico met een advies voor verder onderzoek.')
        },
        {
          titel: 'Taxatie, NHG en financiering van herstel',
          tekst: [
            'De geldverstrekker moet de funderingsinformatie meewegen. Is herstel direct nodig en leent de klant daarvoor, dan gaan die kosten in een bouwdepot. Bij NHG telt herstel van achterstallig onderhoud als kwaliteitsverbetering; de waarde na herstel vraagt een fysieke taxatie.',
            'Vanaf 1 januari 2027 kent NHG een eigen funderingsregeling: bij klasse D of E is verkennend funderingsonderzoek verplicht, en bij een hoog risico tellen de indicatieve herstelkosten mee in de financieringslast. Controleer de definitieve V&N 2027.',
            'Kan de klant het herstel niet bij een bank financieren omdat het inkomen te laag is, dan is er het Fonds Duurzaam Funderingsherstel (uitgevoerd door SVn), met de Funderingslening Maatwerk. Het fonds is landelijk beschikbaar voor particuliere eigenaren. Neem geen rente of voorwaarden over zonder de actuele site te raadplegen.'
          ],
          artikelen: ['k140', 'k141'],
          tools: [
            { titel: 'Woonlasten tijdens de bouw (bouwdepot)', url: 'rekentools.html#bouwdepot' },
            { titel: 'Loan-to-value', url: 'ltv.html' }
          ],
          vraag: v('Wat is vanaf 1 januari 2027 volgens de aangekondigde NHG-normen verplicht bij funderingsrisicoklasse D of E?',
            ['Niets extra', 'Verkennend funderingsonderzoek', 'Een opstalverzekering met funderingsdekking', 'Een overlijdensrisicoverzekering'], 1,
            'Bij klasse D of E wordt verkennend funderingsonderzoek verplicht. Controleer de definitieve tekst van de V&N 2027.')
        },
        {
          titel: 'Woningdata is geen taxatie',
          tekst: [
            'Diensten als Woningcijfer en PandWise combineren openbare registers (BAG, Kadaster, WOZ, EP-Online, CBS en bodemdata). Ze zijn nuttig voor oriëntatie en om advertentiegegevens te controleren, maar ze zijn geen taxatie.',
            'Drie soorten waardebepaling:',
            [
              'Modelwaarde: een statistisch model, zonder taxateur.',
              'Hybride of desktoptaxatie: een modelwaarde die een taxateur beoordeelt, zonder bezichtiging; bij NHG alleen met toegestane producten en maximaal 6 maanden oud.',
              'Volledige taxatie: een taxateur bezoekt de woning; het rapport is gevalideerd en maximaal 6 maanden oud.'
            ],
            'Bij NHG is een fysieke taxatie onder meer verplicht als de klant meer dan 90% van de marktwaarde leent of als je de waarde na verbetering nodig hebt. Gebruik een modelwaarde nooit als basis voor de maximale hypotheek of de LTV in je advies.'
          ],
          artikelen: ['k142', 'k146'],
          tools: [],
          vraag: v('Mag je een modelwaarde uit een woningdata-app gebruiken als basis voor de LTV in je advies?',
            ['Ja, als die recent is', 'Ja, als de klant akkoord gaat', 'Nee, die is alleen een indicatie', 'Ja, bij NHG'], 2,
            'Woningdata en modelwaarden geven indicaties. Voor de financiering telt alleen een waardebepaling die de geldverstrekker of NHG accepteert.')
        },
        {
          titel: 'Zorgplicht: bespreken en vastleggen',
          tekst: [
            'Volgens de AFM-Leidraad (april 2026) heeft de adviseur kennis over de kans op funderingsschade in de omgeving waar hij actief is. Zijn er concrete signalen of is het risico in die omgeving bekend, dan betrek je de financiering van herstel in het advies, voor zover dat redelijkerwijs kan. Is geen oplossing mogelijk, dan maak je de klant ten minste bewust van het risico.',
            'Goede momenten om het te bespreken: de oriëntatie, een concrete woning, vóór het verlopen van het financieringsvoorbehoud, bij oversluiten of verbouwen en in de nazorg.',
            'Leg vast wat je hebt besproken en op basis van welke bron, wat je adviseerde over onderzoek vóór aankoop en wat de klant daarmee deed, dat funderingsschade in de regel niet verzekerd is, en hoe je mogelijke herstelkosten in de betaalbaarheid hebt meegenomen.'
          ],
          artikelen: ['k140', 'k11'],
          tools: [
            { titel: 'Verklaring afwijkend advies', url: 'afwijkend-advies.html' },
            { titel: 'Gespreksverslag', url: 'gespreksverslag.html' }
          ],
          vraag: v('Wat doe je volgens de kennisbank juist níet bij een vermoeden van funderingsproblemen?',
            ['Wijzen op onderzoek vóór aankoop', 'Zelf inschatten of herstel nodig is en herstelkosten noemen zonder rapport', 'Vastleggen dat funderingsschade meestal niet verzekerd is', 'De herstelkosten meenemen in de betaalbaarheid'], 1,
            'De adviseur verwijst naar een funderingsonderzoeksbureau of funderingsloket en noemt geen herstelkosten zonder rapport.')
        }
      ],
      toets: [
        v('Sinds wanneer staat de funderingsrisicoklasse in het model taxatierapport woonruimte?',
          ['1 januari 2025', '1 april 2026', '1 januari 2027', 'Dat is nog niet het geval'], 1,
          'Sinds 1 april 2026 bevat het model taxatierapport een funderingsrisicoklasse A tot en met E.', 'k140'),
        v('Welke woningen hebben het hoogste risico op paalrot?',
          ['Nieuwbouw op zand', 'Woningen van vóór ongeveer 1970 op houten palen in slappe grond', 'Appartementen boven de vijfde verdieping', 'Woningen met label A'], 1,
          'Vooral oudere woningen op houten palen in veen-, klei-, rivier- en kustgebieden lopen risico op droogstand.', 'k140'),
        v('Wat betekent risicoklasse C?',
          ['Geen risico', 'Verhoogd risico of onzekerheid', 'Vastgesteld probleem', 'Klasse C bestaat niet'], 1,
          'A geen risico, B licht risico, C verhoogd risico of onzekerheid, D hoog risico, E vastgesteld probleem.', 'k140'),
        v('Is het Funderingscijfer (schaal 2 tot 8) hetzelfde als de KCAF-klasse?',
          ['Ja', 'Nee, het is een eigen indicator met een andere schaal', 'Ja, maar alleen bij NHG', 'Het vervangt de KCAF-klasse'], 1,
          'Het Funderingscijfer is een eigen indicatief cijfer en niet dezelfde schaal als de KCAF-klasse A tot en met E.', 'k140'),
        v('Wie voert het Fonds Duurzaam Funderingsherstel uit?',
          ['NHG', 'SVn', 'De Belastingdienst', 'Het KCAF'], 1,
          'SVn voert het fonds uit; het product is de Funderingslening Maatwerk.', 'k141'),
        v('Hoe oud mag een hybride taxatie maximaal zijn bij NHG?',
          ['3 maanden', '6 maanden', '12 maanden', '24 maanden'], 1,
          'Een hybride taxatie en een volledige taxatie zijn bij NHG maximaal 6 maanden oud.', 'k142'),
        v('Wanneer is bij NHG in elk geval een fysieke taxatie verplicht?',
          ['Als de klant meer dan 90% van de marktwaarde leent', 'Bij elke oversluiting', 'Alleen bij nieuwbouw', 'Nooit; een WOZ-beschikking volstaat'], 0,
          'Onder meer bij meer dan 90% van de marktwaarde, bij waarde na verbetering, bij afkoop erfpacht en bij aankoop op een veiling.', 'k142'),
        v('Wat verwacht de AFM als er geen oplossing is voor de financiering van funderingsherstel?',
          ['Dat de adviseur de hypotheek weigert', 'Dat de adviseur de klant ten minste bewust maakt van het financiële risico', 'Dat de adviseur het risico negeert', 'Dat de adviseur een verzekering adviseert'], 1,
          'Volgens de Leidraad maakt de adviseur de klant op zijn minst bewust van het risico als geen oplossing mogelijk is.', 'k140'),
        v('Wanneer bespreek je het funderingsrisico bij voorkeur bij een aankoop?',
          ['Na de overdracht', 'Vóór het verlopen van het financieringsvoorbehoud, zodat er nog onderzoek kan', 'Alleen als de klant ernaar vraagt', 'Bij de eerste nazorgafspraak'], 1,
          'Vóór het verlopen van het financieringsvoorbehoud kan de klant nog onderzoek laten doen.', 'k140')
      ]
    },

    /* ---------------------------------------------------------------- 4 */
    {
      id: 'duurzaam',
      titel: 'Duurzaam wonen en EBV/EBB',
      kort: 'Energielabel en leenruimte, het NHG-energiebespaarbudget, financieringsbronnen en subsidie, en wat de AFM in het gesprek verwacht.',
      duur: 15,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je verbindt het energielabel aan de extra leenruimte bij aankoop en verbouwing.',
        'Je kent het verschil tussen EBV en EBB en de NHG-regels in 2026 en 2027.',
        'Je zet financieringsbronnen en subsidie naast elkaar.',
        'Je voert het verduurzamingsgesprek volgens de verwachtingen van de AFM.'
      ],
      lessen: [
        {
          titel: 'Label en leenruimte',
          tekst: [
            'Duurzaamheid raakt het hypotheekadvies via de leenruimte en via de rente. Voor de leenruimte telt het geregistreerde energielabel in EP-Online, niet een indicatief rapport.',
            'Energiebesparende voorzieningen (EBV) zijn maatregelen van de Trhk-lijst: isolatie, HR++-glas, energiezuinige deuren, douche-WTW, ventilatie in combinatie met andere maatregelen, warmtepompen en zonnecellen. NHG gebruikt dezelfde lijst.',
            'Het extra leenbedrag is een maximum, geen advies. Toets of de klant de lasten kan dragen, ook als de verwachte besparing tegenvalt.'
          ],
          artikelen: ['k143', 'k89'],
          tools: [
            { titel: 'Terugverdientijd verduurzaming', url: 'rekentools.html#verduurzamen' },
            { titel: 'Energierekening voor en na besparing', url: 'rekentools.html#energiekosten-besparing' }
          ],
          vraag: v('Welk energielabel telt voor de extra leenruimte?',
            ['Een label uit een gratis duurzaamheidsrapport', 'Het geregistreerde label in EP-Online', 'Een schatting van de makelaar', 'Het label dat de klant na de verbouwing verwacht'], 1,
            'Voor de leenruimte telt het geregistreerde label in EP-Online. Een duurzaamheidsprofiel is een handige gespreksstarter, maar geen geregistreerd label.')
        },
        {
          titel: 'NHG: EBV en energiebespaarbudget',
          tekst: [
            'In 2026 mag een lening met NHG boven de NHG-grens van € 470.000 uitkomen voor energiebesparende voorzieningen, tot maximaal € 498.200. De LTV mag dan tot 106%.',
            'Vanaf 1 januari 2027 kondigt NHG een nieuwe regel aan: koopt de klant met NHG een woning met label E, F of G (geen appartementsrecht), dan bevat de lening als uitgangspunt minimaal € 20.000 voor energiebesparing. De klant kiest tussen een energiebespaarbudget (EBB) of concrete EBV. Past € 20.000 niet binnen de grenzen, dan geldt een lager bedrag. De klant hoeft het budget niet te besteden en hoeft geen bepaald label te halen.'
          ],
          artikelen: ['k143', 'k73'],
          tools: [
            { titel: 'NHG-check 2026', url: 'nhg-check.html' }
          ],
          vraag: v('Wat is vanaf 2027 bij NHG het uitgangspunt bij aankoop van een woning met label F (geen appartement)?',
            ['Geen NHG mogelijk', 'Minimaal € 20.000 voor energiebesparing in de lening, als EBB of EBV', 'Een verplichte verbouwing naar label A', 'Een hogere borgtochtprovisie'], 1,
            'Het uitgangspunt wordt minimaal € 20.000 voor energiebesparing. De klant kiest EBB of EBV en hoeft het budget niet te besteden.')
        },
        {
          titel: 'Financieringsbronnen en subsidie',
          tekst: [
            'Verduurzaming kan uit verschillende bronnen worden betaald:',
            [
              'Een hypotheek of verhoging: de rente is aftrekbaar als het om verbetering van de eigen woning gaat en aan de aflossingseisen is voldaan.',
              'De Energiebespaarlening van het Nationaal Warmtefonds; bij een lager inkomen kan de rente 0% zijn.',
              'Eigen geld en subsidie, zoals de ISDE.'
            ],
            'De ISDE wordt achteraf uitgekeerd: de klant moet de investering dus eerst zelf financieren. Geld voor maatregelen komt meestal in een bouwdepot; let op de depottermijn en de eisen aan offertes en facturen.',
            'Een rentekorting die afhangt van het label verschilt per geldverstrekker en kan bij verhuizen vervallen. Bespreek dat, zonder rentes of kortingen als belofte te presenteren.'
          ],
          artikelen: ['k89', 'k44', 'k193'],
          tools: [
            { titel: 'Woonlasten tijdens de bouw (bouwdepot)', url: 'rekentools.html#bouwdepot' }
          ],
          vraag: v('Wanneer ontvangt de klant de ISDE-subsidie?',
            ['Vooraf, bij de offerte', 'Achteraf, na de investering', 'Via de hypotheekverstrekker bij het passeren', 'Nooit in combinatie met een hypotheek'], 1,
            'De subsidie wordt achteraf uitgekeerd. De klant moet de investering eerst zelf financieren.')
        },
        {
          titel: 'Het verduurzamingsgesprek',
          tekst: [
            'Volgens de AFM-Leidraad (april 2026) hoort verduurzaming bij het hypotheekadvies, zeker bij een woning met label E, F of G. De adviseur:',
            [
              'bespreekt wat het label betekent voor de leenruimte en de productkeuze;',
              'vraagt naar de wensen en doelen van de klant;',
              'hoeft geen expert in maatregelen te zijn en mag verwijzen naar een energieadviseur;',
              'wijst op de gevolgen van hoge energiekosten voor de woonlasten;',
              'legt de wens van de klant en zijn eigen overwegingen vast.'
            ],
            'Wees voorzichtig met besparingsclaims. Een lager verwacht verbruik is geen garantie voor lagere lasten. Toets de betaalbaarheid daarom ook zonder besparing.'
          ],
          artikelen: ['k11', 'k60', 'k143'],
          tools: [
            { titel: 'Energierekening bij nieuwe tarieven', url: 'rekentools.html#energierekening' }
          ],
          vraag: v('Moet je als hypotheekadviseur volgens de AFM deskundig zijn in energiebesparende maatregelen?',
            ['Ja, je moet elke maatregel kunnen doorrekenen', 'Nee, je mag voor de techniek doorverwijzen naar een energieadviseur', 'Ja, anders mag je geen EBV adviseren', 'Alleen bij NHG'], 1,
            'De AFM verwacht geen expertise in maatregelen. Doorverwijzen mag; de financiële gevolgen en de wensen van de klant bespreek je wel.')
        }
      ],
      toets: [
        v('Hoeveel mag in 2026 extra worden geleend voor EBV bij label C vóór de verbouwing?',
          ['€ 10.000', '€ 15.000', '€ 20.000', '€ 0'], 1,
          'Bij label C of D vóór de verbouwing is dat € 15.000.', 'k10'),
        v('Bij welk label is het extra bedrag voor EBV in 2026 € 0?',
          ['E', 'C', 'A', 'A+++'], 3,
          'Bij A+++ en A++++ is het extra bedrag voor energiebesparende voorzieningen in 2026 vervallen.', 'k10'),
        v('Tot welk bedrag mag een NHG-lening in 2026 uitkomen als het meerdere voor energiebesparende voorzieningen is?',
          ['€ 470.000', '€ 477.000', '€ 498.200', '€ 520.000'], 2,
          'Tot € 498.200, mits het bedrag boven € 470.000 naar energiebesparende voorzieningen gaat.', 'k70'),
        v('Wat is waar over het energiebespaarbudget (EBB) bij NHG vanaf 2027?',
          ['De klant moet het binnen een jaar besteden', 'De klant hoeft het budget niet te besteden', 'Het geldt alleen voor appartementen', 'Het vervangt de NHG-grens'], 1,
          'De klant hoeft het budget niet te besteden en er is geen verplichting om een bepaald label te halen.', 'k143'),
        v('Wat is het Duurzaamheidsprofiel?',
          ['Een geregistreerd energielabel', 'Een gratis rapport per adres dat als gespreksstarter dient, geen geregistreerd label', 'Een verplicht onderdeel van de taxatie', 'Een maatwerkadvies van een energieadviseur'], 1,
          'Het is een gratis rapport op basis van postcode en huisnummer. Voor de leenruimte telt het geregistreerde label in EP-Online.', 'k143'),
        v('Waarop let je bij een labelafhankelijke rentekorting?',
          ['Die blijft altijd gelden', 'Die kan bij verhuizen of oversluiten vervallen; bespreek dat', 'Die geldt alleen bij NHG', 'Die is wettelijk vastgelegd'], 1,
          'Bij verhuizing kan de korting vervallen; de regels verschillen per geldverstrekker.', 'k44'),
        v('Hoe toets je de betaalbaarheid als de klant extra leent voor verduurzaming?',
          ['Alleen met de verwachte besparing', 'Ook zonder de verwachte besparing', 'Niet; het is een maximum', 'Alleen als de klant daarom vraagt'], 1,
          'Een lager verwacht verbruik is geen garantie. Toets de betaalbaarheid ook zonder besparing.', 'k89'),
        v('Wat is volgens de Leidraad een terechte verwijzing bij vragen over isolatietechniek?',
          ['Naar de geldverstrekker', 'Naar een energieadviseur of energiebespaaradviseur', 'Naar de notaris', 'Naar het Kifid'], 1,
          'Je hoeft geen energie-expert te zijn; verwijzen naar een energieadviseur mag.', 'k11')
      ]
    },

    /* ---------------------------------------------------------------- 5 */
    {
      id: 'wwft',
      titel: 'Wwft en cliëntenonderzoek (CDD)',
      kort: 'Wie onder de Wwft valt, wat cliëntenonderzoek inhoudt, hoe je met PEP’s omgaat en wat de AMLR vanaf juli 2027 verandert.',
      duur: 15,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je bepaalt of je kantoor een Wwft-instelling is.',
        'Je noemt de onderdelen van het cliëntenonderzoek en de meldplicht.',
        'Je kent de AFM-bevindingen over PEP’s.',
        'Je weet wat er per 10 juli 2027 met de AMLR verandert.'
      ],
      lessen: [
        {
          titel: 'Wie valt onder de Wwft?',
          tekst: [
            'Niet elke adviseur is een Wwft-instelling. Het hangt af van de diensten die je verleent.',
            [
              'Bemiddel je in levensverzekeringen (bijvoorbeeld ORV’s), dan val je eronder en houdt de AFM toezicht op je Wwft-naleving.',
              'Adviseer of bemiddel je alleen in hypotheken of schadeverzekeringen, dan ben je doorgaans geen Wwft-instelling. De geldverstrekker en de notaris doen dan het wettelijke cliëntenonderzoek.',
              'De geldverstrekker is altijd Wwft-plichtig en stelt zelf vragen over de herkomst van geld.'
            ],
            'Ook zonder Wwft-plicht blijft je zorgplicht bestaan. De AFM noemt het voorkomen van hypotheekfraude een gedeelde verantwoordelijkheid van de hele keten.'
          ],
          artikelen: ['k65', 'k190'],
          tools: [
            { titel: 'Wwft- en CDD-checklist', url: 'wwft-cdd.html' }
          ],
          vraag: v('Een adviseur bemiddelt alleen in hypotheken. Is hij doorgaans een Wwft-instelling?',
            ['Ja, altijd', 'Nee, doorgaans niet; geldverstrekker en notaris doen het cliëntenonderzoek', 'Alleen bij NHG-leningen', 'Alleen boven € 500.000'], 1,
            'Wie alleen hypotheken adviseert en bemiddelt, is doorgaans geen meldplichtige instelling. Wie ook levensverzekeringen bemiddelt wel.')
        },
        {
          titel: 'Cliëntenonderzoek en melden',
          tekst: [
            'De Wwft schrijft niet precies voor hoe je het cliëntenonderzoek doet, wel wat het moet opleveren:',
            [
              'weten wie de klant is en dat verifiëren;',
              'weten wie de uiteindelijk belanghebbende (UBO) is;',
              'het doel en de beoogde aard van de relatie kennen;',
              'een risicobeoordeling per klant, passend bij klant, dienst en transacties.'
            ],
            'Een ongebruikelijke transactie meld je onverwijld bij de FIU-Nederland, zodra het ongebruikelijke karakter bekend is. Medewerkers krijgen periodiek training zodat ze dat herkennen.',
            'Ook als je zelf niet meldplichtig bent: bereid de klant voor op vragen van de bank over de herkomst van eigen geld en leg in het dossier vast waar eigen middelen vandaan komen.'
          ],
          artikelen: ['k65', 'k190'],
          tools: [
            { titel: 'Wwft- en CDD-checklist', url: 'wwft-cdd.html' },
            { titel: 'Documentenchecklist', url: 'documentenchecklist.html' }
          ],
          vraag: v('Waar meld je een ongebruikelijke transactie?',
            ['Bij de AFM', 'Bij de FIU-Nederland', 'Bij het Kifid', 'Bij de Autoriteit Persoonsgegevens'], 1,
            'Ongebruikelijke transacties meld je onverwijld bij de FIU-Nederland.')
        },
        {
          titel: 'Politiek prominente personen',
          tekst: [
            'In juni 2026 deelde de AFM bevindingen over de omgang met PEP’s. De kern:',
            [
              'Niet elke PEP is een hoog risico. Extra maatregelen sluiten aan bij de risico’s van de persoon, niet standaard voor iedereen hetzelfde.',
              'Zorg voor een gedeeld begrip van wie een PEP is; familieleden en naaste geassocieerden vallen eronder.',
              'Gebruik je een externe tool voor de PEP-check, dan blijf je zelf verantwoordelijk en controleer je of de tool doet wat hij moet doen.',
              'Stem training af op de functie van de medewerker.'
            ]
          ],
          artikelen: ['k65'],
          tools: [],
          vraag: v('Je gebruikt een externe tool voor de PEP-check. Wie is verantwoordelijk voor de uitkomst?',
            ['De leverancier van de tool', 'Jij als instelling blijft verantwoordelijk', 'De AFM', 'Niemand, het is een hulpmiddel'], 1,
            'Bij gebruik van een externe tool of partij blijf je zelf verantwoordelijk. Controleer of de tool doet wat hij moet doen.')
        },
        {
          titel: 'Van Wwft naar AMLR',
          tekst: [
            'Op 10 juli 2027 gaan de Europese anti-witwasverordening (AMLR) en de zesde anti-witwasrichtlijn gelden. Tot die datum blijft de Wwft volledig van toepassing. Er komt een Europese toezichthouder: AMLA in Frankfurt.',
            [
              'Bemiddelaars in levensverzekeringen blijven onder de regels vallen.',
              'Hypotheek- en kredietbemiddelaars vallen er alleen onder als zij in verband met de kredietovereenkomst gelden van klanten onder zich houden.',
              'De UBO-drempel wordt een belang van 25% of meer (nu in Nederland: meer dan 25%).'
            ],
            'Praktisch: houd je huidige procedures aan, plan een herziening in 2027, volg de Nederlandse implementatiewet en train medewerkers op tijd. Dit is geen juridisch advies; stem af met je compliance officer.'
          ],
          artikelen: ['k122', 'k271'],
          tools: [
            { titel: 'Wet- en regelgeving', url: 'wetgeving.html' }
          ],
          vraag: v('Vanaf wanneer geldt de AMLR?',
            ['1 januari 2026', '10 juli 2027', '1 januari 2028', 'Hij geldt al'], 1,
            'De AMLR geldt vanaf 10 juli 2027. Tot die datum blijft de Wwft volledig van toepassing.')
        }
      ],
      toets: [
        v('Welke adviseur valt zeker onder de Wwft?',
          ['Een adviseur die alleen schadeverzekeringen bemiddelt', 'Een adviseur die bemiddelt in levensverzekeringen', 'Een adviseur die alleen hypotheekadvies geeft zonder bemiddeling', 'Geen enkele adviseur'], 1,
          'Financiële dienstverleners die bemiddelen in levensverzekeringen vallen onder de Wwft (art. 1a).', 'k65'),
        v('Welke toezichthouder houdt toezicht op de Wwft-naleving van een bemiddelaar in levensverzekeringen?',
          ['DNB', 'De AFM', 'Het Kifid', 'De Belastingdienst'], 1,
          'Voor deze groep houdt de AFM toezicht op de naleving van de Wwft.', 'k65'),
        v('Wat hoort niet bij wat het cliëntenonderzoek moet opleveren?',
          ['Wie de klant is', 'Wie de uiteindelijk belanghebbende is', 'Het doel van de relatie', 'De politieke voorkeur van de klant'], 3,
          'Het onderzoek gaat over identiteit, UBO, doel van de relatie en een risicobeoordeling. Politieke voorkeur hoort daar niet bij.', 'k65'),
        v('Hoe snel meld je een ongebruikelijke transactie?',
          ['Binnen een jaar', 'Onverwijld nadat het ongebruikelijke karakter bekend is', 'Bij de jaarafsluiting', 'Alleen op verzoek van de FIU'], 1,
          'Art. 16 lid 1 Wwft: onverwijld na het bekend worden van het ongebruikelijke karakter.', 'k190'),
        v('Wat is volgens de AFM juist over PEP’s?',
          ['Elke PEP is automatisch een hoog risico', 'Maatregelen sluiten aan bij de risico’s van de individuele persoon', 'Familieleden vallen er nooit onder', 'Een externe tool neemt de verantwoordelijkheid over'], 1,
          'Niet elke PEP is een hoog risico; extra maatregelen sluiten aan bij de persoon.', 'k65'),
        v('Wat wordt de UBO-drempel onder de AMLR?',
          ['Meer dan 50%', 'Meer dan 25%', '25% of meer', '10% of meer'], 2,
          'Onder de AMLR is de UBO iemand met een belang van 25% of meer; nu in Nederland meer dan 25%.', 'k122'),
        v('Wanneer valt een hypotheekbemiddelaar onder de AMLR?',
          ['Altijd', 'Als hij in verband met de kredietovereenkomst gelden van klanten onder zich houdt', 'Als hij meer dan tien medewerkers heeft', 'Nooit'], 1,
          'Volgens art. 2(6)(h) AMLR alleen als hij gelden van klanten onder zich houdt in verband met de kredietovereenkomst.', 'k122'),
        v('Je bent geen Wwft-instelling. Wat doe je wel bij grote eigen middelen van de klant?',
          ['Niets, dat is de taak van de bank', 'De klant voorbereiden op vragen van de bank en vastleggen waar het geld vandaan komt', 'Zelf een melding doen bij de FIU', 'De aanvraag weigeren'], 1,
          'Bereid de klant voor op vragen over de herkomst en leg de herkomst van eigen middelen vast in het dossier.', 'k190')
      ]
    },

    /* ---------------------------------------------------------------- 6 */
    {
      id: 'zorgplicht',
      titel: 'Zorgplicht en vastleggen: Leidraad 2026 en Kifid-lessen',
      kort: 'De rol van de adviseur volgens de AFM-Leidraad Hypotheekadvisering (april 2026) en wat Kifid-uitspraken leren over dossiervorming.',
      duur: 18,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je beschrijft de zelfstandige rol van de adviseur volgens de Leidraad 2026.',
        'Je kent de stappen van het adviestraject en wat in het adviesrapport hoort.',
        'Je past de Kifid-lessen over vastleggen en tijdig rapporteren toe.',
        'Je legt afwijken van advies en execution only correct vast.',
        'Je informeert de klant zo dat hij een weloverwogen keuze kan maken.'
      ],
      lessen: [
        {
          titel: 'De adviseur als zelfstandige professional',
          tekst: [
            'Op 9 april 2026 publiceerde de AFM de herziene Leidraad Hypotheekadvisering. Die vervangt de leidraad uit 2011. Een leidraad is geen wet: hij laat zien hoe de AFM de open normen uitlegt. In de praktijk is het wel de lat waarlangs je dossier wordt gelegd.',
            'Kern is de eigen rol van de adviseur:',
            [
              'Je laat je niet alleen leiden door de wens van de klant of door wat de aanbieder wil lenen.',
              'Je vraagt door bij tegenstrijdigheden en maakt aannames zichtbaar.',
              'Je bent verantwoordelijk voor het advies, ook voor de juistheid van berekeningen in je adviessoftware.',
              'Nieuwe thema’s zijn verduurzaming en relatiebeëindiging.'
            ]
          ],
          artikelen: ['k60', 'k11'],
          tools: [
            { titel: 'Inventarisatie en klantprofiel', url: 'inventarisatie.html' }
          ],
          vraag: v('Wat is een leidraad van de AFM?',
            ['Een nieuwe wet', 'Een uitleg van hoe de AFM bestaande open normen ziet, geen wet', 'Een vrijblijvend advies zonder betekenis voor toezicht', 'Een Kifid-uitspraak'], 1,
            'Een leidraad is geen wet- of regelgeving; hij laat zien hoe de AFM de bestaande normen uitlegt. In de praktijk wordt je dossier er wel aan getoetst.')
        },
        {
          titel: 'Het adviestraject en het adviesrapport',
          tekst: [
            'De Leidraad volgt het hele traject:',
            [
              'Kennismaking: Dienstenwijzer en Vergelijkingskaart, afspraken over de omvang van de dienstverlening en waarover je niet adviseert.',
              'Inventarisatie: kennis en ervaring, financiële positie, doelen en risicobereidheid; verifieer waar nodig.',
              'Analyse: klantspecifieke berekeningen, ook voor pensioen, arbeidsongeschiktheid en overlijden.',
              'Advies: een begrijpelijk, onderbouwd rapport, tijdig en vóór het bemiddelingstraject.',
              'Nazorg: vooraf afspraken over de dienstverlening en de vergoeding.'
            ],
            'Een gelaagd rapport (samenvatting, onderdelen, achtergrond) noemt de AFM als goed voorbeeld. Het rapport laat zien waarom het advies past, niet alleen wat er is afgesloten.'
          ],
          artikelen: ['k11', 'k64'],
          tools: [
            { titel: 'Adviesmotivatie hypotheek', url: 'adviesmotivatie.html' },
            { titel: 'Dossierpakket', url: 'dossierpakket.html' }
          ],
          vraag: v('Wanneer deel je het adviesrapport volgens de Leidraad?',
            ['Na het passeren', 'Tijdig, vóór het bemiddelingstraject', 'Alleen op verzoek', 'Bij de eerste nazorgafspraak'], 1,
            'Het rapport komt tijdig, vóór het bemiddelingstraject. Kifid rekende het een adviseur aan dat er geen tijdig adviesrapport was.')
        },
        {
          titel: 'Kifid: wie niet vastlegt, verliest',
          tekst: [
            'De maatstaf in Kifid-zaken is de redelijk bekwaam en redelijk handelend adviseur. Een rode draad uit recente uitspraken: wie niet kan aantonen wat hij deed en besprak, verliest de discussie.',
            [
              'Een adviseur zei in een eerste gesprek dat financiering ‘geen probleem’ was. Hij had geen notities; Kifid volgde de lezing van de klant (GC 2025-0328).',
              'Contactpogingen die niet zijn vastgelegd, kwamen voor rekening van de adviseur (GC 2025-0601).',
              'Bij oversluiten met een hogere in plaats van lagere last en zonder tijdig adviesrapport werden alle klachten gegrond verklaard (GC 2025-0635).',
              'Wie adviseert over een ORV, bewaakt ook dat de polis er komt of legt vast dat de klant dat zelf regelt.'
            ],
            'Praktisch: maak van elk gesprek een korte notitie met datum, besproken punten en indicatieve berekeningen, en bewaak de datum van het financieringsvoorbehoud.'
          ],
          artikelen: ['k188', 'k100', 'k228'],
          tools: [
            { titel: 'Gespreksverslag', url: 'gespreksverslag.html' },
            { titel: 'Adviseurskalender', url: 'kalender.html' }
          ],
          vraag: v('Wat is de les uit de Kifid-zaak over het eerste oriënterende gesprek zonder notities?',
            ['Een oriënterend gesprek hoeft niet te worden vastgelegd', 'Leg ook het eerste gesprek kort vast, met datum, besproken punten en berekeningen', 'Geef in een eerste gesprek nooit een indicatie', 'De klant moet zelf notities maken'], 1,
            'De bewijslast lag bij de adviseur. Zonder notities volgde Kifid de lezing van de klant.')
        },
        {
          titel: 'Afwijken van advies en execution only',
          tekst: [
            'Een klant mag zonder advies een product afnemen of bewust afwijken van je advies. Kifid accepteert dat als je kunt aantonen dat de klant wist wat hij deed.',
            [
              'Execution only werkt alleen met een aantoonbare kennis- en ervaringstoets en een heldere, vooraf gemaakte afspraak dat je niet adviseert.',
              'Bij afwijken leg je vast: jouw advies, de keuze van de klant, de besproken risico’s en de reden. Laat de klant dit ondertekenen.',
              'Bij hypothecair krediet gelden strengere regels: ook zonder advies moet worden getoetst of het krediet niet onverantwoord is.'
            ],
            'Volgens de Leidraad wijs je bij afwijken nadrukkelijk op de gevolgen. Kun je je echt niet verenigen met de keuze, vraag je dan af of je kunt meewerken.'
          ],
          artikelen: ['k110', 'k11'],
          tools: [
            { titel: 'Verklaring afwijkend advies', url: 'afwijkend-advies.html' }
          ],
          vraag: v('Wat is nodig om execution only bij een Kifid-geschil overeind te houden?',
            ['Een mondelinge afspraak', 'Een aantoonbare kennis- en ervaringstoets en een vooraf vastgelegde afspraak dat je niet adviseert', 'Alleen een handtekening onder de polis', 'Niets; execution only is altijd toegestaan'], 1,
            'Zonder aantoonbare toets en heldere afspraak vooraf wordt het lastig aan te tonen dat de klant wist dat hij geen advies kreeg.')
        },
        {
          titel: 'Informatieplicht: gevolgen uitleggen',
          tekst: [
            'Een terugkerend element in uitspraken is dat de klant zo moet zijn geïnformeerd dat hij een weloverwogen beslissing kon nemen. Alleen een feit noemen is niet genoeg; je legt de gevolgen uit.',
            [
              'Vooraf informeren over voorwaarden die kosten bepalen (2026-0772: taxatiekosten vergoeden omdat een vereiste te laat werd gemeld).',
              'Nadelen van een route benoemen (2025-1025: niet verteld dat de rente zou stijgen bij de meeneemregeling).',
              'Waarschuwen bij gewijzigde omstandigheden, bijvoorbeeld een ORV na een huwelijk (2023-0898).'
            ],
            'Gebruik eenvoudige taal en cijfers in euro’s per maand, controleer of de klant het begreep en zet belangrijke waarschuwingen ook per e-mail op papier.'
          ],
          artikelen: ['k114', 'k113', 'k232'],
          tools: [
            { titel: 'Klantuitleg', url: 'klantuitleg.html' },
            { titel: 'Periodieke nazorgcheck', url: 'nazorg-check.html' }
          ],
          vraag: v('Volstaat het om de klant te melden dat er een restschuld overblijft?',
            ['Ja', 'Nee, je bespreekt ook de gevolgen en de aflosmogelijkheden', 'Alleen als de klant ernaar vraagt', 'Ja, mits schriftelijk'], 1,
            'Kifid overwoog dat alleen melden niet genoeg is; de aflosmogelijkheden moeten worden besproken.')
        }
      ],
      toets: [
        v('Welke leidraad verving de AFM in april 2026?',
          ['De leidraad uit 2011, die in losse afleveringen verscheen', 'De Trhk', 'De Wft', 'De Beleidsregel informatieverstrekking'], 0,
          'De herziene Leidraad Hypotheekadvisering vervangt de leidraad uit 2011.', 'k60'),
        v('Welke twee thema’s zijn nieuw in de Leidraad 2026?',
          ['Verduurzaming en relatiebeëindiging', 'Crypto en beleggen', 'Studieschuld en BKR', 'Erfpacht en NHG'], 0,
          'Nieuw zijn onder meer verduurzaming en relatiebeëindiging.', 'k11'),
        v('Wat is de maatstaf in vrijwel elke Kifid-zaak over adviseurs?',
          ['Wat de klant wilde', 'De redelijk bekwaam en redelijk handelend adviseur', 'De laagste rente', 'De norm van de geldverstrekker'], 1,
          'Kifid toetst aan het handelen van een redelijk bekwaam en redelijk handelend adviseur.', 'k114'),
        v('Bij wie ligt in een Kifid-zaak over een niet-vastgelegd eerste gesprek in de praktijk de bewijslast?',
          ['Bij de klant', 'Bij de adviseur', 'Bij de geldverstrekker', 'Bij het Kifid'], 1,
          'In GC 2025-0328 lag de bewijslast bij de adviseur; zonder notities volgde Kifid de klant.', 'k188'),
        v('Waarom werd een factuur voor advieskosten bij opzegging deels verlaagd?',
          ['De klant had geen opdracht gegeven', 'De adviseur had gezien de korte termijn van het voorbehoud meer vaart moeten maken', 'Advieskosten zijn verboden', 'De factuur was te laat verstuurd'], 1,
          'Kifid oordeelde dat de adviseur niet bij één offerteaanvraag had mogen blijven gezien de korte termijn.', 'k188'),
        v('Wat leg je vast als de klant afwijkt van je advies?',
          ['Alleen het gekozen product', 'Je advies, de keuze, de besproken risico’s en de reden van de klant, ondertekend', 'Niets, de klant is zelf verantwoordelijk', 'Alleen een e-mail aan de geldverstrekker'], 1,
          'Leg advies, keuze, risico’s en reden vast en laat de klant ondertekenen.', 'k110'),
        v('Wat vraagt de Leidraad bij oversluiten als het vorige advies minder dan vijf jaar geleden was?',
          ['Niets, het oude advies blijft gelden', 'In elk geval de checkvraag of er relevante wijzigingen zijn', 'Een volledig nieuwe taxatie', 'Een nieuwe Kifid-melding'], 1,
          'Oversluiten is een nieuw adviesmoment; minder dan vijf jaar na het vorige advies stel je in elk geval de checkvraag.', 'k11'),
        v('Wat zegt de Leidraad over nazorg?',
          ['Nazorg is niet nodig', 'Maak vooraf afspraken over de dienstverlening na het afsluiten en de vergoeding', 'Nazorg is alleen een taak van de geldverstrekker', 'Nazorg mag niet worden betaald'], 1,
          'Maak vooraf afspraken over nazorg en de vergoeding; actief klantbeheer is een goede praktijk.', 'k64'),
        v('Wie bewaakt bij een ORV-advies dat de polis tot stand komt, volgens de Kifid-les uit december 2025?',
          ['Niemand', 'De adviseur, of hij legt expliciet vast dat de klant dat zelf regelt', 'Alleen de verzekeraar', 'De notaris'], 1,
          'De tussenpersoon had onvoldoende gecontroleerd of de klanten zelf de nodige stappen hadden gezet.', 'k188')
      ]
    },

    /* ---------------------------------------------------------------- 7 */
    {
      id: 'aov-baz',
      titel: 'AOV en de BAZ',
      kort: 'Het inkomensrisico van zelfstandigen, de kenmerken van een AOV, alternatieven en het wetsvoorstel voor de basisverzekering (BAZ).',
      duur: 15,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je legt uit waarom arbeidsongeschiktheid voor zelfstandigen een kernrisico is.',
        'Je kent de belangrijkste keuzes in een AOV.',
        'Je beschrijft de hoofdlijnen en de status van het BAZ-wetsvoorstel.',
        'Je adviseert zonder te leunen op een wet die er nog niet is.'
      ],
      lessen: [
        {
          titel: 'Het risico en de AOV',
          tekst: [
            'Een zelfstandige heeft geen WIA-vangnet. Bij langdurige arbeidsongeschiktheid valt het inkomen terug tot wat hij zelf heeft geregeld. Voor een hypotheekadvies is dat een kernrisico.',
            'De belangrijkste keuzes in een particuliere AOV:',
            [
              'Het criterium: eigen beroep, passende arbeid of gangbare arbeid. Hoe ruimer de omschrijving, hoe minder snel een uitkering.',
              'Het eigen risico (wachttijd): langer geeft een lagere premie, maar de klant moet die periode zelf overbruggen.',
              'Eindleeftijd en verzekerd bedrag: passend bij de lasten, inclusief de hypotheek.',
              'Sommen- of schadeverzekering, en medische acceptatie en uitsluitingen.'
            ]
          ],
          artikelen: ['k85', 'k105'],
          tools: [
            { titel: 'AOV tekort en wachttijd', url: 'aov-tekort.html' },
            { titel: 'Netto premie AOV', url: 'rekentools.html#aov-premie-netto' }
          ],
          vraag: v('Wat is het effect van een langere wachttijd (eigen risico) in een AOV?',
            ['Hogere premie, sneller uitkering', 'Lagere premie, maar de klant moet de periode zelf overbruggen', 'Geen effect op de premie', 'De dekking vervalt'], 1,
            'Een langere wachttijd verlaagt de premie; de klant moet die periode wel zelf kunnen opvangen.')
        },
        {
          titel: 'Het BAZ-wetsvoorstel',
          tekst: [
            'Het kabinet diende in maart 2026 het wetsvoorstel voor een basisverzekering arbeidsongeschiktheid zelfstandigen in (Kamerstuk 36 912). Het is nog geen wet; een invoeringsdatum staat niet vast.',
            'Hoofdlijnen volgens de Rijksoverheid (stand maart 2026):',
            [
              'Een verplichte publieke basisverzekering bij langdurige arbeidsongeschiktheid, tot de AOW-leeftijd.',
              'Wachttijd van twee jaar.',
              'Premie 5,4% van de winst, met een maximum van ongeveer € 171 bruto per maand.',
              'Uitkering 70% van het eerdere inkomen, maximaal op minimumloonniveau.',
              'Opt-out mogelijk met een passende private verzekering; DGA’s met een bv vallen erbuiten.'
            ],
            'Alle cijfers zijn voorlopig en kunnen in de parlementaire behandeling veranderen.'
          ],
          artikelen: ['k268', 'k206'],
          tools: [],
          vraag: v('Wat is de status van de BAZ op de peildatum van deze module?',
            ['Ingevoerd per 1 januari 2026', 'Een wetsvoorstel dat bij de Tweede Kamer ligt', 'Ingetrokken', 'Alleen een idee van verzekeraars'], 1,
            'Het wetsvoorstel ligt bij de Tweede Kamer en is nog niet aangenomen.')
        },
        {
          titel: 'Broodfonds, schenkkring en buffer',
          tekst: [
            'Een broodfonds is een groep van ongeveer twintig tot vijftig ondernemers die maandelijks een bedrag opzijzetten. Wie langdurig ziek is, ontvangt schenkingen van de anderen, maximaal twee jaar. Een schenkkring werkt vergelijkbaar.',
            'Beide zijn geen verzekering: er is geen garantie en na twee jaar stopt het. Een broodfonds kan wel de wachttijd van een AOV met een lange eigenrisicoperiode overbruggen.',
            'Een woonlastenverzekering dekt alleen tijdelijk de woonlasten en vervangt geen inkomen. Een vrij opneembare spaarbuffer blijft nodig voor de eerste periode.'
          ],
          artikelen: ['k85'],
          tools: [
            { titel: 'AOV of broodfonds vergeleken', url: 'rekentools.html#aov-of-broodfonds' }
          ],
          vraag: v('Hoe lang ontvangt een deelnemer aan een broodfonds maximaal schenkingen?',
            ['Zes maanden', 'Twee jaar', 'Tot de AOW-leeftijd', 'Onbeperkt'], 1,
            'Maximaal twee jaar achtereen; daarna stopt het. Het is geen verzekerd recht.')
        },
        {
          titel: 'Adviseren in onzekerheid',
          tekst: [
            'Adviseer niet om te wachten op de BAZ, en niet tot opzeggen van een bestaande AOV op basis van een wetsvoorstel. Ook als de BAZ er komt, dekt die hooguit een minimumniveau na twee jaar. Voor de meeste ondernemers met woonlasten blijft een aanvullende oplossing nodig.',
            'Werkwijze:',
            [
              'Bereken het tekort bij arbeidsongeschiktheid: vaste lasten en hypotheek tegenover het resterende inkomen.',
              'Inventariseer bestaande voorzieningen (AOV, broodfonds, buffer, partnerinkomen).',
              'Vergelijk ten minste twee opties en bespreek de premie in slechte jaren.',
              'Leg vast wat de klant kiest, wat hij bewust niet verzekert en dat je de onzekerheid over de BAZ hebt besproken.'
            ]
          ],
          artikelen: ['k85', 'k206', 'k225'],
          tools: [
            { titel: 'AOV tekort en wachttijd', url: 'aov-tekort.html' },
            { titel: 'Netto AOV-uitkering', url: 'rekentools.html#aov-uitkering-netto' }
          ],
          vraag: v('Een klant wil zijn AOV opzeggen ‘omdat de BAZ eraan komt’. Wat is het juiste uitgangspunt?',
            ['Opzeggen is verstandig', 'Niet adviseren tot opzeggen op basis van een wetsvoorstel; bespreek de onzekerheid en leg die vast', 'De AOV omzetten in een broodfonds', 'Wachten tot de wet is ingevoerd en dan opnieuw kijken, zonder iets vast te leggen'], 1,
            'De BAZ is een voorstel met beperkte dekking en een onzekere invoering. Adviseer niet op basis van een wet die er nog niet is.')
        }
      ],
      toets: [
        v('Waarom is arbeidsongeschiktheid voor een zelfstandige een kernrisico in het hypotheekadvies?',
          ['Omdat hij altijd WIA krijgt', 'Omdat hij geen WIA-vangnet heeft', 'Omdat NHG het verplicht verzekert', 'Omdat de bank het risico draagt'], 1,
          'Een zelfstandige heeft geen WIA-vangnet; zijn inkomen valt terug tot wat hij zelf heeft geregeld.', 'k85'),
        v('Welk AOV-criterium leidt het snelst tot een uitkering?',
          ['Gangbare arbeid', 'Passende arbeid', 'Eigen beroep', 'Ze zijn gelijk'], 2,
          'Hoe ruimer de omschrijving (gangbare arbeid), hoe minder snel uitkering. Eigen beroep is het meest beschermend.', 'k85'),
        v('Wat is de wachttijd in het BAZ-wetsvoorstel?',
          ['Een maand', 'Een halfjaar', 'Twee jaar', 'Vijf jaar'], 2,
          'Het voorstel kent een wachttijd van twee jaar.', 'k268'),
        v('Hoe hoog is de uitkering volgens het BAZ-voorstel maximaal?',
          ['Het volledige laatste inkomen', '70% van het eerdere inkomen, maximaal op minimumloonniveau', 'Het modale inkomen', '100% van de winst'], 1,
          '70% van het eerdere inkomen, met een maximum van 100% van het minimumloon.', 'k268'),
        v('Vallen DGA’s met een bv onder het BAZ-voorstel?',
          ['Ja', 'Nee', 'Alleen boven een bepaalde winst', 'Alleen als ze ook in loondienst werken'], 1,
          'Zelfstandigen met een bv (DGA) vallen er volgens het voorstel niet onder.', 'k206'),
        v('Wat is een broodfonds?',
          ['Een verzekering met een gegarandeerde uitkering', 'Een groep ondernemers die elkaar bij ziekte schenkingen doet, zonder verzekerd recht', 'Een overheidsregeling', 'Een spaarrekening bij de bank'], 1,
          'Het is geen verzekering; er is geen garantie en na twee jaar stopt het.', 'k85'),
        v('Wat vervangt een woonlastenverzekering niet?',
          ['De opstalverzekering', 'Het inkomen', 'De ORV', 'De NHG'], 1,
          'Een woonlastenverzekering dekt alleen tijdelijk de woonlasten en vervangt geen inkomen.', 'k85'),
        v('Wat leg je vast bij een AOV-advies in 2026?',
          ['Alleen de premie', 'Tekortberekening, besproken opties, gekozen oplossing en dat de onzekerheid over de BAZ is besproken', 'Alleen de polis', 'Niets, de verzekeraar legt vast'], 1,
          'Leg de tekortberekening, opties, keuze, polisvoorwaarden en de besproken onzekerheid over de BAZ vast.', 'k206')
      ]
    },

    /* ---------------------------------------------------------------- 8 */
    {
      id: 'wtp',
      titel: 'Wtp voor adviseurs',
      kort: 'De planning van de pensioentransitie, wat er voor de klant verandert en wat dat betekent voor hypotheek-, ORV- en werkgeversadvies.',
      duur: 15,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je kent de uiterste datum en de planning van de transitie.',
        'Je legt uit wat partnerpensioen op risicobasis betekent.',
        'Je verwerkt de Wtp in je hypotheek- en ORV-advies.',
        'Je weet wat er op werkgevers met een verzekerde regeling afkomt.'
      ],
      lessen: [
        {
          titel: 'De planning',
          tekst: [
            'Alle pensioenregelingen moeten uiterlijk 1 januari 2028 zijn overgegaan naar het nieuwe stelsel van de Wet toekomst pensioenen (Wtp). De oorspronkelijke datum van 1 januari 2027 is met een jaar verschoven.',
            'Fondsen gaan in golven over: per 1 januari 2026 is een grote groep overgegaan, de grootste groep volgt per 1 januari 2027, daarna een kleinere groep per 1 juli 2027 en een laatste groep per 1 januari 2028.',
            'Bij klanten met meerdere werkgevers kunnen oude en nieuwe regelingen dus naast elkaar bestaan. Gebruik voor een concrete klant altijd de communicatie van diens eigen fonds of verzekeraar.'
          ],
          artikelen: ['k205', 'k45'],
          tools: [
            { titel: 'Scan pensioen', url: 'scan-pensioen.html' }
          ],
          vraag: v('Wat is de uiterste datum waarop alle pensioenregelingen over moeten zijn naar de Wtp?',
            ['1 januari 2026', '1 januari 2027', '1 januari 2028', '1 januari 2030'], 2,
            'Uiterlijk 1 januari 2028. De eerdere datum van 1 januari 2027 is verschoven.')
        },
        {
          titel: 'Wat verandert er voor de klant?',
          tekst: [
            [
              'Ouderdomspensioen: in de nieuwe premieregelingen is de uitkomst minder zeker en kan het pensioen meebewegen met beleggingsresultaten, ook na de pensioendatum.',
              'Partnerpensioen bij overlijden vóór de pensioendatum: standaard op risicobasis en maximaal 50% van het pensioengevend salaris. De AFM zag dat het niveau bij verzekerde regelingen vaak ruim onder dat maximum ligt.',
              'Risicobasis betekent: de dekking stopt als de deelnemer uit dienst gaat (in de regel na een korte uitloopperiode). Bij een baanwissel, werkloosheid of de stap naar zzp kan het partnerpensioen dus wegvallen.'
            ],
            'Veel klanten denken dat het partnerpensioen altijd doorloopt. Leg het verschil uit.'
          ],
          artikelen: ['k80'],
          tools: [
            { titel: 'Netto nabestaandenpensioen en Anw', url: 'rekentools.html#nabestaandenuitkering' }
          ],
          vraag: v('Wat gebeurt er met partnerpensioen op risicobasis als de deelnemer uit dienst gaat?',
            ['Het loopt altijd door', 'De dekking stopt, in de regel na een korte uitloopperiode', 'Het wordt verdubbeld', 'Het gaat over naar de AOW'], 1,
            'Op risicobasis stopt de dekking als de deelnemer niet meer deelneemt. Dat raakt het ORV-advies direct.')
        },
        {
          titel: 'Gevolgen voor hypotheek- en ORV-advies',
          tekst: [
            'De Wtp verandert de uitgangspunten van je advies:',
            [
              'ORV: het tekort bij overlijden kan na invaren groter of kleiner zijn. Herbereken het bij elke nazorgafspraak en zeker na een baanwissel.',
              'Betaalbaarheid na pensionering: gebruik een actueel pensioenoverzicht, wees open over de onzekerheid van een premieregeling en reken bij twijfel ook met een lager pensioen.',
              'Bedrag ineens: vanaf 1 januari 2029 kan maximaal 10% van het ouderdomspensioen ineens worden opgenomen. Die opname is belast in het jaar van opname en verlaagt het jaarlijkse pensioen.'
            ],
            'Vertrouw voor risicoadvies niet op een pensioenopgave van vóór het invaren, en geef geen pensioenadvies zonder de juiste vakbekwaamheid.'
          ],
          artikelen: ['k80', 'k191'],
          tools: [
            { titel: 'Overlijdensrisico benodigd bedrag', url: 'orv.html' },
            { titel: 'Restschuld bij pensioen', url: 'restschuld-pensioen.html' }
          ],
          vraag: v('Vanaf wanneer kan het bedrag ineens (maximaal 10%) worden opgenomen?',
            ['1 januari 2026', '1 januari 2027', '1 januari 2028', '1 januari 2029'], 3,
            'Volgens de rijksoverheid gaat het bedrag ineens in op 1 januari 2029.')
        },
        {
          titel: 'Werkgevers met een verzekerde regeling',
          tekst: [
            'Voor pensioenadviseurs ligt het zwaartepunt bij werkgevers met een regeling bij een verzekeraar of PPI. Zij moeten de regeling zelf aanpassen: overleg met werknemers of ondernemingsraad, een nieuwe regeling, communicatie en uitvoering. Dat kost maanden, en volgens de vakpers lopen verzekerde regelingen achter.',
            'Een checklist voor je werkgeversportefeuille:',
            [
              'Breng per werkgever het type regeling, de uitvoerder en de stand van zaken in kaart.',
              'Leg je advies en de keuzes van de werkgever vast, inclusief de risico’s van uitstel.',
              'Wijs werkgevers op hun informatieplicht naar werknemers.',
              'Plan nazorg na de overgang.'
            ],
            'Geef geen garanties over uitkomsten en zorg dat je uitleg klopt met de communicatie van het fonds of de verzekeraar.'
          ],
          artikelen: ['k269', 'k205', 'k280'],
          tools: [
            { titel: 'Inleg voor een pensioentekort', url: 'rekentools.html#pensioentekort' }
          ],
          vraag: v('Wat leg je vast bij een werkgever die de transitie wil uitstellen?',
            ['Niets, het is zijn keuze', 'Je advies, zijn keuze en de risico’s van uitstel', 'Alleen de naam van de uitvoerder', 'Een melding bij DNB'], 1,
            'Leg het advies en de keuzes van de werkgever schriftelijk vast, inclusief de risico’s van uitstel.')
        }
      ],
      toets: [
        v('Waarom kan een klant met meerdere werkgevers tegelijk oude en nieuwe pensioenregelingen hebben?',
          ['Dat kan niet', 'Omdat fondsen en verzekeraars op verschillende momenten overgaan', 'Omdat de Wtp alleen voor zzp’ers geldt', 'Omdat de klant zelf kiest'], 1,
          'De transitie gaat in golven; daardoor bestaan oude en nieuwe regelingen tijdelijk naast elkaar.', 'k80'),
        v('Hoe hoog is het partnerpensioen bij overlijden vóór de pensioendatum in het nieuwe stelsel maximaal?',
          ['25% van het pensioengevend salaris', '50% van het pensioengevend salaris', '70% van het laatste loon', '100% van het ouderdomspensioen'], 1,
          'Standaard op risicobasis en maximaal 50% van het pensioengevend salaris.', 'k80'),
        v('Wat betekent een premieregeling onder de Wtp voor de zekerheid van het ouderdomspensioen?',
          ['Het pensioen ligt vast', 'De uitkomst is minder zeker en kan meebewegen met beleggingsresultaten', 'Het pensioen wordt verdubbeld', 'Er is geen ouderdomspensioen meer'], 1,
          'In de nieuwe premieregelingen kan het pensioen meebewegen, ook na de pensioendatum.', 'k80'),
        v('Een klant gaat van loondienst naar zzp. Wat moet je meenemen in het ORV-advies?',
          ['Niets', 'Dat het partnerpensioen op risicobasis kan wegvallen', 'Dat de AOW stijgt', 'Dat de hypotheekrente daalt'], 1,
          'Wie zelfstandig wordt, verliest het partnerpensioen op risicobasis.', 'k80'),
        v('Wat is waar over het bedrag ineens?',
          ['Het is onbelast', 'Het is belast in het jaar van opname en verlaagt het jaarlijkse pensioen', 'Het kan al in 2026', 'Het is maximaal 25%'], 1,
          'De opname is belast in het jaar van opname, verlaagt het jaarlijkse pensioen en kan pas vanaf 2029.', 'k80'),
        v('Welke werkgevers moeten hun pensioenregeling zelf aanpassen?',
          ['Werkgevers met een regeling bij een verzekeraar of PPI', 'Alleen werkgevers bij een bedrijfstakpensioenfonds', 'Geen enkele werkgever', 'Alleen overheidswerkgevers'], 0,
          'Werkgevers met een regeling bij een verzekeraar of PPI moeten de regeling zelf aanpassen.', 'k269'),
        v('Mag je een pensioenopgave van vóór het invaren gebruiken voor je risicoadvies?',
          ['Ja, altijd', 'Liever niet; gebruik een actueel overzicht en herbereken na invaren', 'Ja, als die minder dan vijf jaar oud is', 'Alleen bij NHG'], 1,
          'Vertrouw niet op een opgave van vóór het invaren; herbereken zodra het nieuwe overzicht er is.', 'k80'),
        v('Welke communicatie-eis stelt de AFM-agenda 2026 rond de pensioentransitie volgens de kennisbank?',
          ['Geen', 'Zorgvuldige communicatie: uitleg moet kloppen met die van het fonds, zonder garanties over uitkomsten', 'Alleen schriftelijke communicatie', 'Communicatie alleen via de werkgever'], 1,
          'De AFM noemt zorgvuldige communicatie rond de transitie als prioriteit.', 'k205')
      ]
    },

    /* ---------------------------------------------------------------- 9 */
    {
      id: 'compliance',
      titel: 'Compliance op kantoor: AVG, datalek, reclame en DORA',
      kort: 'Het verwerkingsregister, verwerkers en DPIA, een datalek binnen 72 uur melden, reclameregels en of DORA voor je kantoor geldt.',
      duur: 18,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je weet wat in het verwerkingsregister en een verwerkersovereenkomst hoort.',
        'Je handelt een datalek af volgens de AVG-termijnen.',
        'Je toetst een reclame-uiting aan de hoofdregel van de Wft.',
        'Je bepaalt of DORA voor je kantoor geldt en kent de IT-basismaatregelen.'
      ],
      lessen: [
        {
          titel: 'AVG op kantoorniveau',
          tekst: [
            'Een adviskantoor verwerkt structureel gevoelige gegevens en heeft dus een verwerkingsregister nodig (art. 30 AVG). De vrijstelling voor kleine organisaties geldt in de praktijk zelden.',
            [
              'Verwerkersovereenkomst (art. 28 AVG) met elke partij die in jouw opdracht gegevens verwerkt: CRM, adviessoftware, cloud, IT-beheer, transcriptietools.',
              'Een geldverstrekker of verzekeraar is meestal zelf verwerkingsverantwoordelijke, geen verwerker van jou.',
              'DPIA vóór een verwerking met waarschijnlijk hoog risico; leg de afweging ook vast als je concludeert dat een DPIA niet nodig is.',
              'Rechten van klanten: reageer binnen een maand; verlengen met twee maanden mag bij complexe verzoeken, mits je dat binnen de eerste maand meldt.'
            ],
            'Het recht op verwijdering is niet absoluut: een wettelijke bewaarplicht gaat voor. Het adviesdossier bewaar je minimaal vijf jaar na het einde van de dienstverlening.'
          ],
          artikelen: ['k161', 'k3'],
          tools: [
            { titel: 'Compliance-overzicht', url: 'compliance-overzicht.html' }
          ],
          vraag: v('Binnen welke termijn reageer je in beginsel op een inzageverzoek van een klant?',
            ['Binnen 72 uur', 'Binnen een maand', 'Binnen drie maanden', 'Binnen een jaar'], 1,
            'Zonder onnodige vertraging en uiterlijk binnen een maand; verlengen met twee maanden mag onder voorwaarden.')
        },
        {
          titel: 'Datalek: binnen 72 uur',
          tekst: [
            'Een datalek is een inbreuk waarbij persoonsgegevens verloren gaan, worden gewijzigd of bij iemand terechtkomen die er geen toegang toe mag hebben. Meestal gaat het om gewone fouten: een rapport naar de verkeerde klant, zichtbare adressen in het aan-veld, een onversleutelde laptop.',
            [
              'Meld bij de Autoriteit Persoonsgegevens binnen 72 uur na ontdekking, tenzij het lek waarschijnlijk geen risico oplevert. Ook in het weekend.',
              'Informeer de klant bij een waarschijnlijk hoog risico, bijvoorbeeld bij kopieën van identiteitsbewijzen of inkomensgegevens.',
              'Registreer elk datalek intern, ook als je niet hoeft te melden.',
              'Een datalek bij je leverancier meld jij als verwerkingsverantwoordelijke.'
            ],
            'Bij twijfel: meld. Een onterechte melding kun je intrekken; een gemiste melding is een overtreding.'
          ],
          artikelen: ['k162'],
          tools: [],
          vraag: v('Je CRM-leverancier heeft een datalek met jouw klantgegevens. Wie meldt bij de AP?',
            ['De leverancier', 'Jij als verwerkingsverantwoordelijke', 'De klant', 'Niemand'], 1,
            'De leverancier informeert jou; jij bent als verwerkingsverantwoordelijke degene die bij de AP meldt.')
        },
        {
          titel: 'Reclame en social media',
          tekst: [
            'Elke uiting waarmee je een product of je dienstverlening aanprijst is reclame, ook een LinkedIn-post. Volgens art. 4:19 lid 2 Wft is informatie correct, duidelijk en niet misleidend, alle drie tegelijk.',
            [
              'Geef een evenwichtig beeld: naast voordelen ook voorwaarden en risico’s, even goed zichtbaar.',
              'Bij consumptief krediet is ‘Let op! Geld lenen kost geld’ verplicht.',
              'Je mag je AFM-vergunning noemen, maar wek niet de indruk dat de AFM je kantoor of producten goedkeurt.',
              'Werk je met een influencer of leadgenerator, dan blijf je verantwoordelijk voor wat die namens jou zegt.'
            ],
            'Leg vast wie een uiting heeft goedgekeurd, wanneer en welke versie is gepubliceerd.'
          ],
          artikelen: ['k160'],
          tools: [],
          vraag: v('Mag je in reclame zeggen dat je diensten ‘in nauw overleg met de AFM zijn opgezet’?',
            ['Ja, als je een vergunning hebt', 'Nee, dat wekt de indruk van goedkeuring en is volgens de AFM misleidend', 'Ja, op social media', 'Alleen met een disclaimer'], 1,
            'Je mag je vergunning noemen, maar niet suggereren dat de AFM je aanbeveelt of goedkeurt.')
        },
        {
          titel: 'DORA, IT en uitbesteding',
          tekst: [
            'DORA geldt sinds 17 januari 2025. Verzekeringstussenpersonen die een micro-, kleine of middelgrote onderneming zijn, vallen er niet onder; hypotheek- en kredietbemiddelaars als zodanig staan niet in de lijst. Het overgrote deel van de adviskantoren valt er dus niet onder, een groot kantoor of een kantoor in een grote groep mogelijk wel.',
            'Ook zonder DORA vraagt de Wft een beheerste en integere bedrijfsvoering. Basismaatregelen:',
            [
              'meerfactorauthenticatie op mail, CRM, adviessoftware en portaal;',
              'back-ups volgens 3-2-1 en regelmatig testen;',
              'versleutelde apparaten, rechtenbeheer en tijdige updates;',
              'een incidentplan en heldere afspraken met leveranciers, inclusief exit.'
            ],
            'Wie uitbesteedt, blijft verantwoordelijk. Sinds 24 juli 2026 werkt het Wijzigingsbesluit financiële markten 2026 de uitbestedingsregels verder uit. Controleer grensgevallen bij de AFM of je compliance officer.'
          ],
          artikelen: ['k163', 'k272'],
          tools: [
            { titel: 'Wet- en regelgeving', url: 'wetgeving.html' }
          ],
          vraag: v('Valt een adviskantoor met 30 medewerkers dat verzekeringen bemiddelt onder DORA?',
            ['Ja, altijd', 'In de regel niet: mkb-verzekeringstussenpersonen zijn uitgezonderd', 'Alleen als het ook hypotheken doet', 'Alleen na een AFM-besluit'], 1,
            'Art. 2 lid 3 sluit verzekeringstussenpersonen uit die een micro-, kleine of middelgrote onderneming zijn. Controleer grensgevallen, bijvoorbeeld bij een groep.')
        }
      ],
      toets: [
        v('Heeft een klein adviskantoor een verwerkingsregister nodig?',
          ['Nee, onder 250 medewerkers nooit', 'In de praktijk wel, omdat het structureel klantgegevens verwerkt', 'Alleen bij meer dan 1.000 klanten', 'Alleen als de AP erom vraagt'], 1,
          'De uitzondering voor kleine organisaties geldt zelden; structurele verwerking van klantgegevens vraagt een register.', 'k161'),
        v('Is een geldverstrekker meestal jouw verwerker?',
          ['Ja', 'Nee, die is meestal zelf verwerkingsverantwoordelijke', 'Alleen bij NHG', 'Alleen als je een volmacht hebt'], 1,
          'Een geldverstrekker of verzekeraar is meestal zelf verwerkingsverantwoordelijke voor zijn eigen beoordeling.', 'k161'),
        v('Wanneer doe je een DPIA?',
          ['Na de start van de verwerking', 'Vóór een verwerking met waarschijnlijk hoog privacyrisico', 'Alleen op verzoek van de klant', 'Nooit bij kleine kantoren'], 1,
          'Een DPIA doe je vóórdat je begint, als de verwerking waarschijnlijk een hoog risico oplevert.', 'k161'),
        v('Binnen welke termijn meld je een datalek met risico bij de AP?',
          ['24 uur', '72 uur na ontdekking', '7 werkdagen', '30 dagen'], 1,
          'Binnen 72 uur na ontdekking, ook in het weekend.', 'k162'),
        v('Moet je een datalek registreren als je het niet hoeft te melden?',
          ['Nee', 'Ja, elk datalek registreer je intern', 'Alleen bij meer dan 100 betrokkenen', 'Alleen als de klant klaagt'], 1,
          'Registreer elk datalek in het interne datalekregister, met de risicoafweging.', 'k162'),
        v('Welke drie eisen stelt art. 4:19 lid 2 Wft aan informatie, inclusief reclame?',
          ['Kort, krachtig en positief', 'Correct, duidelijk en niet misleidend', 'Volledig, juridisch en getoetst', 'Goedkoop, snel en digitaal'], 1,
          'Correct, duidelijk en niet misleidend, alle drie tegelijk.', 'k160'),
        v('Sinds wanneer geldt DORA?',
          ['17 januari 2025', '1 januari 2024', '10 juli 2027', 'DORA geldt nog niet'], 0,
          'DORA (Verordening (EU) 2022/2554) geldt sinds 17 januari 2025.', 'k163'),
        v('Je besteedt je backoffice uit. Wie blijft verantwoordelijk tegenover toezichthouder en klant?',
          ['De backofficedienstverlener', 'Jij als financiële onderneming', 'De AFM', 'De klant zelf'], 1,
          'Wie uitbesteedt, blijft verantwoordelijk (art. 4:16 Wft, uitgewerkt in het Bgfo).', 'k163'),
        v('Hoe lang bewaar je het adviesdossier volgens Wft/BGfo minimaal?',
          ['Een jaar', 'Vijf jaar na het einde van de dienstverlening', 'Tot de klant erom vraagt het te verwijderen', 'Twintig jaar'], 1,
          'Minimaal vijf jaar na het einde van de dienstverlening, zodat het advies reconstrueerbaar blijft.', 'k3')
      ]
    },

    /* ---------------------------------------------------------------- 10 */
    {
      id: 'ai',
      titel: 'AI in de adviespraktijk',
      kort: 'Hoe adviseurs AI gebruiken, wat de AFM en de AI-verordening vragen, en wat je nu op je kantoor vastlegt.',
      duur: 12,
      peildatum: '2026-10-03',
      leerdoelen: [
        'Je legt uit waarom de zorgplicht niet verandert als je AI gebruikt.',
        'Je kent de toezichtsignalen van de AFM en de hoofdlijn van de AI-verordening.',
        'Je weet welke AVG-vragen een AI-tool oproept.',
        'Je richt een AI-register en een controlestap in.'
      ],
      lessen: [
        {
          titel: 'AI verandert de norm niet',
          tekst: [
            'Adviseurs gebruiken AI vooral voor gespreksverslagen, het doorzoeken van acceptatiecriteria en het samenvatten van documenten. Softwareleveranciers bouwen het in hun pakketten in.',
            'De AFM is helder: de normen voor zorgvuldig advies gelden los van de vraag of je AI gebruikt. Bij (gedeeltelijk) geautomatiseerd advies gelden dezelfde eisen. Dus:',
            [
              'Controleer elk door AI voorbereid stuk voordat het naar de klant gaat of in het dossier komt.',
              'Een AI-samenvatting vervangt de vastlegging van wensen, kennis en risicobereidheid niet.',
              'Let op sturing: een AI-voorstel kan naar een standaardoplossing leiden die niet bij deze klant past.'
            ]
          ],
          artikelen: ['k135', 'k211'],
          tools: [
            { titel: 'Gespreksverslag', url: 'gespreksverslag.html' }
          ],
          vraag: v('Je gebruikt een tool die een gespreksverslag maakt. Wat doe je voordat het in het dossier gaat?',
            ['Niets, de tool is betrouwbaar', 'Je controleert het verslag op juistheid', 'Je laat de klant het verslag controleren in plaats van jij', 'Je bewaart alleen de opname'], 1,
            'Je blijft verantwoordelijk voor de inhoud. Controleer elk AI-verslag voordat het in het dossier of naar de klant gaat.')
        },
        {
          titel: 'Toezicht en AI-verordening',
          tekst: [
            [
              'In haar Agenda 2026 kondigt de AFM intensiever toezicht aan op verantwoord AI-gebruik: AI-toepassingen in kaart brengen, datakwaliteit en modelrisico beheersen, besluitlogica vastleggen en incidenten melden.',
              'AFM en DNB schetsten gezamenlijk uitgangspunten voor toezicht op AI. Het AI-toezicht is nog in opbouw.',
              'De AI-verordening merkt AI voor kredietwaardigheidsbeoordeling van natuurlijke personen aan als hoog risico. Na de AI-omnibus gelden die regels vanaf 2 december 2027.',
              'Gewone hulpmiddelen zoals transcriptie of mail sorteren zijn meestal geen hoog risico, maar AVG en zorgplicht blijven gelden. Controleer dit per toepassing.'
            ]
          ],
          artikelen: ['k285', 'k211', 'k120'],
          tools: [
            { titel: 'Wet- en regelgeving', url: 'wetgeving.html' }
          ],
          vraag: v('Welke AI-toepassing geldt volgens de AI-verordening als hoog risico?',
            ['Een spellingscontrole', 'AI voor kredietwaardigheidsbeoordeling van natuurlijke personen', 'Een agenda-assistent', 'Mail sorteren'], 1,
            'AI voor kredietwaardigheidsbeoordeling van consumenten is hoog risico; die regels gelden vanaf 2 december 2027.')
        },
        {
          titel: 'AVG bij AI-tools',
          tekst: [
            'Gespreksopnames en transcripten zijn persoonsgegevens, soms ook bijzondere (gezondheid bij een AOV-gesprek). Informeer de klant vooraf en neem alleen op met een duidelijke grondslag.',
            [
              'Vraag de leverancier welke modellen en subverwerkers worden gebruikt, waar de data staan en of klantdata worden gebruikt om modellen te trainen. Leg dit vast in de verwerkersovereenkomst.',
              'Beoordeel of een DPIA nodig is, zeker bij een tool die klantgesprekken verwerkt.',
              'Neem bewaartermijnen voor transcripten op in je privacybeleid.'
            ]
          ],
          artikelen: ['k135', 'k161'],
          tools: [
            { titel: 'Compliance-overzicht', url: 'compliance-overzicht.html' }
          ],
          vraag: v('Welke vraag stel je de leverancier van een AI-transcriptietool in elk geval?',
            ['Welke kleur de app heeft', 'Of klantdata worden gebruikt om modellen te trainen en waar de data staan', 'Hoeveel klanten de leverancier heeft', 'Of de tool gratis is'], 1,
            'Leg in de verwerkersovereenkomst vast waar de data staan, welke subverwerkers er zijn en of klantdata voor training worden gebruikt.')
        },
        {
          titel: 'Wat je nu vastlegt',
          tekst: [
            'Een praktische set voor elk kantoor:',
            [
              'Een AI-register: tool, leverancier, doel, welke klantdata erin gaan, waar die staan en wie verantwoordelijk is.',
              'Een verwerkersovereenkomst en, waar nodig, een DPIA.',
              'Een werkinstructie: de adviseur controleert elk AI-verslag of -advies vóór gebruik.',
              'Klantinformatie als je gesprekken opneemt of laat transcriberen.',
              'De koppeling met uitbesteding: een AI-dienst van een derde is meestal ook uitbesteding, met een schriftelijke overeenkomst.'
            ],
            'Software ondersteunt het advies, maar vervangt de afweging van de adviseur niet.'
          ],
          artikelen: ['k285', 'k163'],
          tools: [
            { titel: 'Dossierpakket', url: 'dossierpakket.html' }
          ],
          vraag: v('Wat hoort in een AI-register?',
            ['Alleen de naam van de tool', 'Tool, leverancier, doel, welke klantdata erin gaan, waar die staan en wie verantwoordelijk is', 'De wachtwoorden van de tool', 'Alleen de kosten'], 1,
            'Het register geeft per tool zicht op doel, data, opslag en verantwoordelijkheid.')
        }
      ],
      toets: [
        v('Gelden voor (gedeeltelijk) geautomatiseerd advies andere wettelijke eisen dan voor menselijk advies?',
          ['Ja, lichtere eisen', 'Nee, dezelfde eisen', 'Ja, alleen de AI-verordening geldt', 'Er gelden geen eisen'], 1,
          'Volgens de AFM gelden dezelfde wettelijke eisen.', 'k135'),
        v('Vervangt een AI-samenvatting van het gesprek de vastlegging van wensen en risicobereidheid?',
          ['Ja', 'Nee, de klantprofielschets en adviesmotivatie blijven jouw werk', 'Ja, als de klant tekent', 'Alleen bij schadeverzekeringen'], 1,
          'De klantprofielschets en de adviesmotivatie blijven het werk van de adviseur.', 'k135'),
        v('Vanaf wanneer gelden de regels voor hoog-risico-AI bij kredietwaardigheidsbeoordeling na de AI-omnibus?',
          ['1 januari 2026', '2 december 2027', '10 juli 2027', 'Ze gelden al'], 1,
          'Na de AI-omnibus gelden die regels vanaf 2 december 2027.', 'k285'),
        v('Wat kondigt de AFM in haar Agenda 2026 aan over AI?',
          ['Een verbod op AI in advies', 'Intensiever toezicht op verantwoord AI-gebruik', 'Geen toezicht', 'Een AI-certificaat voor adviseurs'], 1,
          'De AFM houdt in 2026 intensiever toezicht op verantwoord AI-gebruik.', 'k285'),
        v('Je neemt adviesgesprekken op voor een AI-verslag. Wat is nodig?',
          ['Niets', 'De klant vooraf informeren en een duidelijke grondslag', 'Alleen toestemming van de leverancier', 'Een AFM-vergunning voor opnames'], 1,
          'Informeer de klant vooraf en neem alleen op met een duidelijke grondslag.', 'k135'),
        v('Is een AI-dienst van een derde voor je adviesproces vaak ook uitbesteding?',
          ['Nee, nooit', 'Ja, meestal, met een schriftelijke overeenkomst', 'Alleen bij DORA-instellingen', 'Alleen als de dienst gratis is'], 1,
          'Een AI-dienst van een derde is meestal ook uitbesteding.', 'k285'),
        v('Waarom let je op ‘sturing’ door een AI-voorstel?',
          ['Omdat AI altijd fout zit', 'Omdat een voorstel kan leiden naar een standaardoplossing die niet bij deze klant past', 'Omdat de AFM AI verbiedt', 'Omdat AI duurder is'], 1,
          'Een AI-voorstel kan sturen naar een standaardoplossing; jouw afweging blijft nodig.', 'k135'),
        v('Wie is verantwoordelijk voor de inhoud van een advies dat met AI is voorbereid?',
          ['De softwareleverancier', 'De adviseur', 'De AFM', 'Niemand'], 1,
          'Gebruik je AI in het adviesproces, dan blijf jij verantwoordelijk voor de inhoud van het advies.', 'k211')
      ]
    }
  ];

  window.ELEARNING = {
    versie: '2026-10-03',
    slagingsgrens: 0.7,
    disclaimer: 'Deelnamebewijs Adviesforum – geen erkende PE-punten en geen officieel Wft-certificaat',
    modules: MODULES
  };
})();

/* Titels van de kennisbankartikelen waarnaar de modules verwijzen (overgenomen uit data/kennisbank*.js op 2026-10-03).
 * Pas aan als een titel in de kennisbank wijzigt; de controle in de test vergelijkt ze. */
window.ELEARNING.artikelTitels = {
    k3: "Bewaartermijnen adviesdossier (Wft/BGfo en AVG)",
    k10: "Leennormen 2026: Nibud-advies hypotheeknormen in het kort",
    k11: "AFM-Leidraad Hypotheekadvisering (april 2026): wat de AFM verwacht",
    k44: "Duurzaamheidskorting en extra lenen voor energiebesparing",
    k45: "Pensioenfondsen en de Wtp-overgang: wat de adviseur moet weten",
    k60: "De herziene Leidraad Hypotheekadvisering (april 2026): wat verandert er?",
    k64: "Nazorg en de doorlopende zorgplicht, met aflossingsvrije hypotheken als voorbeeld",
    k65: "Wwft voor adviseurs: wie valt eronder en wat vraagt de AFM?",
    k70: "NHG 2026: NHG-grens, borgtochtprovisie en voorwaarden in het kort",
    k71: "Wat is er veranderd in de NHG-normen 2025 → 2026",
    k73: "NHG: verbouwing, energiebesparende voorzieningen en bouwdepot",
    k75: "NHG-dossier: checklist dossier en brondata",
    k80: "De Wtp in het hypotheek- en pensioenadvies: wat verandert er voor de klant?",
    k85: "AOV en alternatieven voor zelfstandigen: broodfonds, schenkkring en de komende BAZ",
    k89: "Verduurzamen financieren: extra leenruimte, Warmtefonds, ISDE en energielabel",
    k100: "Lessen uit Kifid-uitspraken: het aanvraagtraject en het financieringsvoorbehoud",
    k105: "Lessen uit Kifid-uitspraken: advies over arbeidsongeschiktheidsverzekeringen",
    k110: "Lessen uit Kifid-uitspraken: execution only en afwijken van advies",
    k113: "Lessen uit Kifid-uitspraken: oversluiten, verhuizen en de meeneemregeling",
    k114: "Lessen uit Kifid-uitspraken: informatieplicht in het adviestraject",
    k120: "Wetswijzigingen 2026–2027 voor adviseurs: overzicht en actiepunten",
    k122: "AMLR en Wwft: wat komt eraan",
    k135: "AI in het adviesproces: Quinn, de plannen van Blinqx en jouw zorgplicht",
    k140: "Funderingsrisico: herkennen, gevolgen voor taxatie, NHG en verzekering, en de zorgplicht (AFM)",
    k141: "Funderingsherstel financieren: Fonds Duurzaam Funderingsherstel, bouwdepot en NHG",
    k142: "Woningdata in het adviesproces: Woningcijfer, PandWise en de soorten waardebepaling",
    k143: "Duurzaamheidsprofiel en woningprofiel: energielabel, EBV/EBB-leenruimte en de rol van de adviseur",
    k144: "Klimaatrisico's bij de woning: overstroming, wateroverlast, droogte en hitte",
    k146: "Woningcheck bij aankoop: bodemverontreiniging, asbest en erfpacht",
    k147: "Checklist woning-due-diligence voor de adviseur: bronnen en wanneer je ze gebruikt",
    k160: "Reclame en social media: wat mag je als adviseur laten zien?",
    k161: "AVG op kantoorniveau: register, verwerkers, DPIA en rechten van klanten",
    k162: "Datalek: herkennen, melden binnen 72 uur en vastleggen",
    k163: "IT-beveiliging, DORA en uitbesteding voor het adviskantoor",
    k185: "Leennormen 2026: Trhk, rekenvoorbeeld, evaluatie en Wijzigingsbesluit",
    k186: "NHG 2026: Voorwaarden & Normen, IKV-toetskaders en vooruitblik 2027",
    k188: "Kifid-uitspraken: vastleggen, tijdig adviesrapport, advieskosten en ORV-zorgplicht",
    k190: "Wwft bij extra aflossingen en de discussie over regeldruk",
    k191: "Pensioen en lijfrente: UPO onder de Wtp, bedrag ineens 2029 en lijfrenteregels",
    k193: "Wonen en financieren: verduurzamingssubsidies, NFBK-koperskorting en hospitaverhuur",
    k201: "NHG in 2027: de nieuwe Voorwaarden en Normen en wat nog onbekend is",
    k205: "Pensioentransitie in de praktijk: stand van zaken najaar 2026",
    k206: "Zelfstandigen en arbeidsongeschiktheid: stand van de BAZ en de AOV-markt",
    k211: "AI en digitalisering in advies: wat toezicht en praktijk in 2026 laten zien",
    k225: "Lessen uit Kifid-uitspraken: optierecht AOV en indexatie WIA-excedent",
    k228: "Lessen uit Kifid-uitspraken: verwachtingen, berekeningen en schade in het hypotheekadvies",
    k232: "Lessen uit Kifid-uitspraken: zorgplicht geschonden, maar geen schadevergoeding",
    k268: "BAZ: de basisverzekering arbeidsongeschiktheid voor zelfstandigen en de rol van de adviseur",
    k269: "De Wtp-transitie in de adviespraktijk: werkgevers, regelingen en de deadline van 2028",
    k271: "Van Wwft naar AMLR: de Europese anti-witwasregels en wat Adfiz signaleert",
    k272: "DORA en digitale weerbaarheid: voor welke adviseurs geldt het?",
    k280: "Wat moet je kantoor nu doen: pensioen en werkgeversadvies",
    k285: "AI in de adviespraktijk: toezichtsignalen en wat je nu vastlegt"
};
