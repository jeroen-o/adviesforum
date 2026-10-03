/* Adviesroute: stap-voor-stap procesgids voor adviesroute.html
 *
 * Structuur:
 *   window.ADVIESROUTE = { bronnen: {...}, routes: [ { id, naam, kort, intro, stappen: [ stap ] } ] }
 *   stap = { id, titel, doel,
 *            afm: { bron: 'leidraad' | 'kb' | 'wet' | null, ref, p, tekst, links },
 *            check: [tekst], dossier: [tekst],
 *            valkuilen: [ { t, kb } ],          kb = kennisbank-id (index.html#artikel-<id>)
 *            links: [ [label, href] ] }
 *
 * AFM-blok:
 *   bron 'leidraad' = parafrase (eigen woorden) van de lokale AFM-Leidraad Hypotheekadvisering (april 2026),
 *                     documenten/Leidraad-Hypotheekadvisering-2026.pdf, p = paginanummer in de pdf.
 *   bron 'kb'       = samenvatting uit de kennisbank (ref = artikel-id), status concept.
 *   bron null       = geen specifieke passage in de Leidraad; tekst is praktijk/eigen werkwijze.
 *   bron 'wet'      = eigen samenvatting van wet- en regelgeving (Wft, BGfo, BW) en AFM-uitleg buiten de Leidraad;
 *                     ref = artikelen, links = [ [label, url] ] naar de bronnen (afm.nl, wetten.overheid.nl, vfn.nl, bkr.nl).
 *                     Gebruikt in de routes schade en krediet (peildatum 3 oktober 2026).
 * Let op: de Leidraad zelf zegt dat hij geen wet- of regelgeving is, dat voorbeelden geen vaste
 * richtlijnen zijn, en dat informatieverstrekking (art. 4:19/4:20 Wft) en het bemiddelingstraject
 * buiten de reikwijdte vallen (voetnoot 1, p. 3).
 */
window.ADVIESROUTE = {
  bronnen: {
    leidraad: { t: 'AFM: Leidraad Hypotheekadvisering, april 2026 (lokale pdf)', url: 'documenten/Leidraad-Hypotheekadvisering-2026.pdf' }
  },
  routes: [
    /* ======================================================================
       ROUTE 1: HYPOTHEEKADVIES AANKOOP
       ====================================================================== */
    {
      id: 'aankoop',
      naam: 'Hypotheekadvies aankoop',
      kort: 'Aankoop',
      intro: 'Van eerste kennismaking tot nazorg bij de aankoop van een eigen woning. In de praktijk lopen inventarisatie en analyse door elkaar; de volgorde hieronder is een hulpmiddel, geen vast stramien.',
      stappen: [
        {
          id: 'kennismaking',
          titel: 'Kennismaking en oriëntatie',
          doel: 'Vaststellen of je iets voor de klant kunt betekenen, je rol uitleggen en een eerste, eerlijk beeld geven van de mogelijkheden zonder dat dit als toezegging wordt opgevat.',
          afm: {
            bron: 'leidraad', ref: 'H2 en H3 Kennismaking', p: 6,
            tekst: 'Volgens de Leidraad informeert de adviseur in deze fase over de inhoud en kosten van zijn dienstverlening en deelt hij de Dienstenwijzer en de Vergelijkingskaart. De Leidraad noemt het raadzaam om de zelfstandige rol van de adviseur vroeg te benoemen, inclusief dat je waarschuwt als wensen financieel niet haalbaar zijn. Bij een vraag naar de maximale hypotheek staat de adviseur al stil bij de persoonlijke situatie; de klant moet weten dat het besproken bedrag geen garantie is en dat een betaalbare lening niet hetzelfde is als het maximale leenbedrag.'
          },
          check: [
            'Zelfstandige rol als adviseur uitgelegd (je toetst wensen, je voert ze niet alleen uit).',
            'Vergelijkingskaart en Dienstenwijzer gedeeld, met de kosten van de dienstverlening.',
            'Afgebakend waarover je wel en niet adviseert (bijv. wel of geen risicoverzekeringen).',
            'Bij een indicatie maximale hypotheek: gezinssituatie, woonverleden en huidige woonlasten gevraagd.',
            'Benoemd dat een indicatie geen advies en geen toezegging is, met de gebruikte aannames.',
            'Duurzaamheid (energielabel) en bij relevante regio funderingsrisico al kort genoemd.',
            'Afspraak gemaakt over vervolg en aan te leveren stukken.'
          ],
          dossier: [
            'Gespreksverslag kennismaking (datum, deelnemers, besproken onderwerpen).',
            'Bewijs van verstrekking vergelijkingskaart en Dienstenwijzer (datum en wijze).',
            'Indicatieve berekening met datum, gebruikte gegevens, rente en de tekst dat het een indicatie is.'
          ],
          valkuilen: [
            { t: 'Een snelle indicatie wordt door de klant als advies opgevat; leg vast dat het om een indicatie ging en op welke aannames die rust.', kb: 'k101' },
            { t: 'Alleen het maximale leenbedrag noemen zonder de betaalbaarheid voor deze klant te bespreken.', kb: 'k60' }
          ],
          links: [
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Leennormen 2026', 'leennormen-2026.html'],
            ['Rekenhulp: Past deze woning?', 'rekentools.html#haalbaarheid-woning'],
            ['Rekenhulp: Benodigd eigen geld', 'rekentools.html#eigen-geld-nodig'],
            ['Sjabloon: Bevestiging kennismakingsgesprek', 'sjablonen.html#km-bevestiging-gesprek'],
            ['Kennisbank: herziene Leidraad (k60)', 'index.html#artikel-k60']
          ]
        },
        {
          id: 'opdracht',
          titel: 'Vergelijkingskaart en opdracht',
          doel: 'Heldere, schriftelijke afspraken over de omvang van de dienstverlening, de kosten, het moment waarop kosten verschuldigd zijn en wat er na het afsluiten (nazorg) gebeurt.',
          afm: {
            bron: 'leidraad', ref: 'H3 Kennismaking en Nazorg', p: 6,
            tekst: 'De Leidraad vraagt om in de eerste fase duidelijke afspraken te maken over de omvang van de dienstverlening en vraagt de adviseur duidelijk te maken waarover hij wel en niet adviseert. Bij de start van het traject maakt de adviseur volgens de Leidraad ook afspraken over de reikwijdte van de nazorg en de vergoeding daarvoor (p. 9). De verplichtingen rond de vergelijkingskaart zelf staan niet in de Leidraad; zie de kennisbank (k61).'
          },
          check: [
            'Soort dienstverlening vastgelegd: advies, bemiddeling of beide (en of risicoverzekeringen meedoen).',
            'Tarief, wanneer kosten verschuldigd zijn en wat er gebeurt bij afbreken van het traject vastgelegd.',
            'Afspraken over nazorg en de vergoeding daarvoor gemaakt (abonnement, uurtarief of geen nazorg).',
            'Bedragen op vergelijkingskaart en opdrachtbevestiging komen overeen.',
            'Opdracht door de klant bevestigd (ondertekend of per e-mail).'
          ],
          dossier: [
            'Getekende of per e-mail bevestigde opdrachtbevestiging met datum.',
            'Vergelijkingskaart (versie die de klant heeft ontvangen).',
            'Afspraken over nazorg en de vergoeding daarvoor.'
          ],
          valkuilen: [
            { t: 'Advieskosten die volgens je eigen voorwaarden pas na het adviesrapport verschuldigd zijn, terwijl het traject eerder stopt: je eigen voorwaarden binden jou ook.', kb: 'k111' },
            { t: 'Mondelinge opdracht zonder vastlegging: de zorgplicht begint wel, maar het bewijs van wat is afgesproken ontbreekt.', kb: 'k100' },
            { t: 'Nazorg beloven in een abonnement en het jaarlijkse gesprek niet uitvoeren of aanbieden.', kb: 'k105' }
          ],
          links: [
            ['Sjabloon: Opdrachtbevestiging', 'sjablonen.html#km-opdrachtbevestiging'],
            ['Sjabloon: Offerte advieskosten (uurtarief)', 'sjablonen.html#km-offerte-advieskosten'],
            ['Sjabloon: Documenten en kosten na kennismaking', 'sjablonen.html#km-ddoc-kosten'],
            ['Kennisbank: provisieverbod en vergelijkingskaart (k61)', 'index.html#artikel-k61'],
            ['Kennisbank: advies- en taxatiekosten (k111)', 'index.html#artikel-k111']
          ]
        },
        {
          id: 'inventarisatie',
          titel: 'Inventarisatie en klantprofiel',
          doel: 'Een volledig en juist beeld van financiële positie, doelstellingen, risicobereidheid en kennis en ervaring, met bewijsstukken waar nodig.',
          afm: {
            bron: 'leidraad', ref: 'H2, H3 Inventarisatie, H4, H7', p: 7,
            tekst: 'Volgens de Leidraad wint de adviseur informatie in over kennis en ervaring, financiële positie, doelstellingen en risicobereidheid, en verifieert hij mondelinge informatie waar nodig (vervolgvragen, kopie van documenten). Bij tegenstrijdige antwoorden vraagt de adviseur door (p. 4). Bestaande voorzieningen en wettelijke uitkeringen horen erbij. Bij een (meer) maximale lening ten opzichte van de LTI wordt uitgavenpatroon en spaargedrag belangrijker (p. 11). Voor klanten met een hypotheekverleden brengt de adviseur het fiscale verleden in kaart en legt hij aannames vast als dat niet volledig lukt (p. 17-19).'
          },
          check: [
            'Inkomen en stabiliteit daarvan beoordeeld (dienstverband, ondernemer, flexibel).',
            'Financiële verplichtingen gecheckt: kredieten, studieschuld, alimentatie.',
            'Bestaande voorzieningen: werkgeverspensioen, nabestaandenpensioen, AO-dekking, eigen polissen.',
            'Kennis en ervaring en risicobereidheid vastgesteld; tegenstrijdigheden besproken.',
            'Doelen en toekomstplannen: gezinsuitbreiding, minder werken, ondernemen, eerder stoppen.',
            'Bij hoge LTI: uitgavenpatroon en spaargedrag uitgevraagd (eventueel budgetoverzicht).',
            'Hypotheekverleden en fiscaal verleden (eigenwoningreserve, overgangsrecht, opbouwproducten) uitgezocht.',
            'Relatievorm en afspraken: huwelijk, partnerschap, samenlevingscontract, kinderen, eigendomsverhouding.',
            'Herkomst eigen geld en schenkingen in beeld.'
          ],
          dossier: [
            'Ingevulde inventarisatie/klantprofiel, door de klant gecontroleerd.',
            'Inkomensbewijs (werkgeversverklaring of IB-aangiften/jaarcijfers bij ondernemers).',
            'Pensioenoverzicht en overzicht bestaande verzekeringen.',
            'Hypotheekoverzicht oude woning, aangiften of andere bron voor het fiscale verleden.',
            'Vastlegging van aannames waar gegevens ontbreken.',
            'Identificatie en, waar van toepassing, bewijs herkomst eigen geld.'
          ],
          valkuilen: [
            { t: 'Genoegen nemen met "weet ik niet meer" over het fiscale verleden; een fout in de aftrekperiode per leningdeel is een tekortkoming, ook als die niet altijd tot schade leidt.', kb: 'k103' },
            { t: 'Advies om informatie bij een gezondheids- of aanvraagverklaring weg te laten: dat kan de klant zijn dekking kosten en jou aansprakelijk maken.', kb: 'k109' }
          ],
          links: [
            ['Inventarisatieformulier', 'inventarisatie.html'],
            ['Documentenchecklist', 'documentenchecklist.html'],
            ['Eigenwoningreserve en bijleenregeling', 'bijleenregeling.html'],
            ['Rekenhulp: Toetsinkomen ondernemer', 'rekentools.html#toetsinkomen-ondernemer'],
            ['Sjabloon: Documenten opvragen', 'sjablonen.html#inv-documenten-hypotheek'],
            ['Sjabloon: Inventarisatie ter controle', 'sjablonen.html#inv-klantprofiel-controle'],
            ['Sjabloon: Herkomst eigen geld', 'sjablonen.html#wwft-herkomst'],
            ['Levensgebeurtenis: Samenwonen', 'levensgebeurtenissen.html#samenwonen']
          ]
        },
        {
          id: 'risico',
          titel: 'Risicoanalyse: overlijden, AO, werkloosheid, pensioen, relatiebeëindiging',
          doel: 'Laten zien wat de woonlasten betekenen als een life event zich voordoet, rekening houdend met bestaande voorzieningen, en vaststellen welk risico de klant wil en kan lopen.',
          afm: {
            bron: 'leidraad', ref: 'H3 Analyse, H4, H9 en Relatiebeëindiging', p: 22,
            tekst: 'De Leidraad noemt het de verantwoordelijkheid van de adviseur om de invloed van arbeidsongeschiktheid, overlijden, werkloosheid en langleven op de betaalbaarheid te bespreken (p. 10). Wil de klant een risico lopen, dan heeft de adviseur volgens de Leidraad een zelfstandige plicht om te beoordelen of de klant dat ook kán, met klantspecifieke scenarioberekeningen inclusief sociale, werkgevers- en eigen voorzieningen (p. 22-23). De betaalbaarheid na pensionering wordt onderzocht, ook als de klant nog meer dan tien jaar van pensioen af zit (p. 7). Bij relatiebeëindiging bespreekt de adviseur de scenario\'s in ieder geval in algemene zin en let hij vooral op de partner met het laagste inkomen (p. 24).'
          },
          check: [
            'Overlijden van elk van de partners doorgerekend, met nabestaandenpensioen en Anw waar van toepassing.',
            'Arbeidsongeschiktheid doorgerekend (loondoorbetaling, WIA/WGA of geen dekking bij ondernemer, wachttijd).',
            'Werkloosheid doorgerekend (WW-duur en hoogte, buffer).',
            'Pensioen: woonlasten na AOW-datum en eventuele restschuld op einddatum doorgerekend.',
            'Relatiebeëindiging besproken: wie kan de woning houden, gevolgen bij verkoop, financiële afhankelijkheid.',
            'Risicobereidheid per risico vastgesteld en getoetst aan wat de klant financieel kan dragen.',
            'Besproken of de klant de levensstijl realistisch kan aanpassen bij inkomensverlies.',
            'Bij geen advies over verzekeringen: tekort benoemd en actief doorverwezen.'
          ],
          dossier: [
            'Scenarioberekeningen per risico (met en zonder voorziening).',
            'Overzicht bestaande voorzieningen met bedragen en looptijden.',
            'Vastlegging van de risicobereidheid per risico en de besproken oplossingen.',
            'Notitie over relatiebeëindiging en het advies om afspraken bij de notaris vast te leggen.'
          ],
          valkuilen: [
            { t: 'Een bestaande ORV die vervalt bij verhuizen of oversluiten niet opnieuw regelen; "alles is geregeld" zeggen zonder te controleren.', kb: 'k104' },
            { t: 'Alleen melden dat er een restschuld overblijft bij een aflossingsvrij deel, zonder de aflosmogelijkheden te bespreken.', kb: 'k102' },
            { t: 'Bij AOV alleen op premie vergelijken en niet op criterium, wachttijd, eindleeftijd en inkomenstoetsing.', kb: 'k105' }
          ],
          links: [
            ['Overlijdensrisico (ORV)', 'orv.html'],
            ['AOV-tekort', 'aov-tekort.html'],
            ['Inkomen bij ziekte werknemer', 'inkomen-ziekte-werknemer.html'],
            ['Werkloosheid', 'werkloosheid.html'],
            ['Restschuld bij pensioen', 'restschuld-pensioen.html'],
            ['Draagplicht', 'draagplicht.html'],
            ['Rekenhulp: Netto nabestaandenpensioen en Anw', 'rekentools.html#nabestaandenuitkering'],
            ['Rekenhulp: Netto AOW en pensioen', 'rekentools.html#netto-aow-pensioen'],
            ['Rekenhulp: Partner uitkopen', 'rekentools.html#uitkoop'],
            ['Levensgebeurtenis: Scheiding', 'levensgebeurtenissen.html#scheiding'],
            ['Levensgebeurtenis: Overlijden partner', 'levensgebeurtenissen.html#overlijden'],
            ['Levensgebeurtenis: Arbeidsongeschikt', 'levensgebeurtenissen.html#ziek']
          ]
        },
        {
          id: 'berekening',
          titel: 'Berekening, leennormen en verantwoorde woonlasten',
          doel: 'Vaststellen welke lening en welke woonlasten passen bij deze klant, niet alleen wat de leennormen toestaan; inclusief rentevaste periode, fiscaliteit en verduurzaming.',
          afm: {
            bron: 'leidraad', ref: 'H4, H5, H6 en H7', p: 12,
            tekst: 'Volgens de Leidraad is het feit dat een lening binnen de Trhk-norm valt niet automatisch voldoende om die als passend te adviseren (p. 12). Woonlasten omvatten ook energie, belastingen, onderhoud, opstalverzekering en eventueel erfpacht (p. 10). Een hogere lening dan de Trhk toelaat vraagt om een geconcretiseerde, doorgerekende onderbouwing. Bij de rentevaste periode laat de adviseur scenario\'s zien en geeft hij een eigen afweging, geen vertaling van de wens (p. 13-14). Het energielabel en de gevolgen voor leenruimte en product worden besproken; de adviseur hoeft geen energie-expert te zijn (p. 15). De adviseur berekent eigenwoningschuld en -reserve en laat bruto/netto lasten zien (p. 17).'
          },
          check: [
            'Maximale lening volgens de actuele leennormen berekend (inkomen en woningwaarde).',
            'Passende woonlast bepaald op basis van de klantsituatie, niet alleen de norm.',
            'Bij maximaal lenen: netto besteedbaar inkomen en toekomstige uitgaven (kinderen) meegenomen.',
            'Rentevaste periode: scenario\'s bij rentestijging laten zien en afgestemd op risicobereidheid.',
            'Fiscaal: eigenwoningschuld, eigenwoningreserve en box 1/box 3-verdeling berekend.',
            'Bruto/netto maandlastenoverzicht en verloop netto lasten gemaakt.',
            'Energielabel besproken, inclusief extra leenruimte voor energiebesparende voorzieningen.',
            'NHG-mogelijkheid getoetst.',
            'Bij financiering boven de norm: onderbouwing doorgerekend en vastgelegd.'
          ],
          dossier: [
            'Maximale-hypotheekberekening met datum en gebruikte normen.',
            'Bruto/netto maandlastenoverzicht en scenario\'s rentevaste periode.',
            'Berekening eigenwoningschuld en eigenwoningreserve met bron.',
            'Taxatierapport en energielabel (zodra beschikbaar).',
            'Motivering bij afwijking van de normen of bij maximaal lenen.'
          ],
          valkuilen: [
            { t: 'Een maximale hypotheek gelijkstellen aan een verantwoorde hypotheek; leg vast waarom je op of onder het maximum adviseert.', kb: 'k101' },
            { t: 'Klant kosten laten maken (taxatie, keuring) voordat je weet of de aanvraag kansrijk is.', kb: 'k111' },
            { t: 'Fiscale looptijd per leningdeel niet controleren bij een bestaande eigenwoningschuld.', kb: 'k103' }
          ],
          links: [
            ['Leennormen 2026', 'leennormen-2026.html'],
            ['NHG-check', 'nhg-check.html'],
            ['LTV', 'ltv.html'],
            ['Kosten koper', 'kosten-koper.html'],
            ['Maandlasten', 'maandlasten.html'],
            ['Erfpacht', 'erfpacht.html'],
            ['Rekenhulp: Leenruimte kort of lang rentevast', 'rekentools.html#toetsrente-rentevast'],
            ['Rekenhulp: Maandlast na renteherziening', 'rekentools.html#renteherziening'],
            ['Rekenhulp: Netto maandlast hypotheek', 'rekentools.html#netto-maandlast-hypotheek'],
            ['Rekenhulp: Verloop netto maandlast', 'rekentools.html#netto-lasten-verloop'],
            ['Rekenhulp: Maximale koopsom', 'rekentools.html#maximale-koopsom'],
            ['Rekenhulp: Terugverdientijd verduurzaming', 'rekentools.html#verduurzamen'],
            ['Levensgebeurtenis: Verbouwen of verduurzamen', 'levensgebeurtenissen.html#verbouwen']
          ]
        },
        {
          id: 'product',
          titel: 'Productkeuze en geldverstrekker',
          doel: 'Een product en geldverstrekker kiezen die passen bij de wensen en het klantprofiel, op voorwaarden en niet alleen op rente.',
          afm: {
            bron: 'leidraad', ref: 'H8 Het hypotheekproduct', p: 21,
            tekst: 'De Leidraad beschrijft dat de adviseur producten vergelijkt op relevante criteria en niet alleen op rente, zoals boetevrij aflossen, verhuis- of meeneemregeling, rentemiddeling, een rente die meedaalt en offertevoorwaarden bij een late passeerdatum (p. 20-21). Omdat het productadvies het sluitstuk is, controleert de adviseur of er geen tegenstrijdigheden zijn met eerdere onderwerpen, motiveert hij welke voorwaarden doorslaggevend zijn en benoemt hij wensen die het product niet invult.'
          },
          check: [
            'Voor de klant belangrijke voorwaarden benoemd (aflossen, verhuizen, overbrugging, rente meedalen, bereidstelling).',
            'Minimaal enkele aanbieders vergeleken op rente én voorwaarden (tenzij je duidelijk maar één aanbieder adviseert).',
            'Hypotheekvorm en aflosvorm onderbouwd (annuïtair, lineair, aflossingsvrij deel).',
            'Gekozen product getoetst op tegenstrijdigheden met risicoanalyse en rentevast-advies.',
            'Wensen die niet in het product zitten benoemd.',
            'Bij overbruggingskrediet of dubbele lasten: scenario\'s besproken.'
          ],
          dossier: [
            'Productvergelijking met de vergeleken voorwaarden.',
            'Motivering van de gekozen geldverstrekker en het product.',
            'Productvoorwaarden van de gekozen geldverstrekker (versie op datum advies).'
          ],
          valkuilen: [
            { t: 'Nadelen van een meeneem- of verhuisregeling niet noemen, zoals een rente-aanpassing op het meegenomen deel.', kb: 'k113' },
            { t: 'Een alternatief niet doorrekenen omdat de klant er toch niet voor kiest; het dossier moet laten zien welke alternatieven zijn besproken.', kb: 'k102' }
          ],
          links: [
            ['Rekenhulp: Twee aanbiedingen vergelijken', 'rekentools.html#offertes'],
            ['Rekenhulp: Annuïtair, lineair en aflossingsvrij', 'rekentools.html#hypotheekvormen-vergelijken'],
            ['Rekenhulp: Effectieve rente inclusief kosten', 'rekentools.html#effectieve-hypotheekrente'],
            ['Rekenhulp: Meeneemregeling bij verhuizen', 'rekentools.html#hypotheek-meenemen'],
            ['Overbrugging', 'overbrugging.html'],
            ['Partijen', 'partijen.html']
          ]
        },
        {
          id: 'rapport',
          titel: 'Adviesrapport en bespreking',
          doel: 'Een begrijpelijk, onderbouwd advies dat laat zien waarom het past, tijdig gedeeld vóór de bemiddeling start; afwijkingen van de klant vastgelegd.',
          afm: {
            bron: 'leidraad', ref: 'H2 en H3 Advies', p: 8,
            tekst: 'De Leidraad beschrijft dat het adviesrapport laat zien hoe de adviseur tot zijn advies is gekomen, op welke informatie dat rust en welke wensen niet kunnen worden gerealiseerd, en dat het advies tijdig wordt gedeeld zodat de klant kan kiezen voordat het bemiddelingstraject start. Het advies moet wettelijk schriftelijk of digitaal worden verstrekt. Wijkt de klant af, dan legt de adviseur dat in dossier en adviesrapport vast, met de besproken consequenties en de motivatie van de klant (p. 4, 14, 23). Een gelaagde opbouw met samenvatting voorop is in de Leidraad een voorbeeld, geen eis.'
          },
          check: [
            'Rapport bevat klantsituatie, analyses, advies en de overwegingen per onderdeel.',
            'Scenario\'s (overlijden, AO, werkloosheid, pensioen, relatiebeëindiging) met conclusies opgenomen.',
            'Aannames en onzekerheden (bijv. fiscaal verleden) benoemd.',
            'Wensen die niet worden gerealiseerd benoemd.',
            'Advies besproken en gecontroleerd of de klant het begrijpt.',
            'Afwijkende keuze van de klant vastgelegd met risico\'s en motivatie, door de klant bevestigd.',
            'Bij uitgestelde beslissing over een risicoverzekering: terugbelmoment gepland (goede praktijk volgens de Leidraad).'
          ],
          dossier: [
            'Adviesrapport (verzonden versie) met verzenddatum.',
            'Verslag van het adviesgesprek.',
            'Afwijkend-adviesverklaring, ondertekend door de klant (indien van toepassing).',
            'Notitie of agenda-afspraak voor het terugbelmoment.'
          ],
          valkuilen: [
            { t: 'Afwijken van advies zonder vastlegging van jouw advies, de risico\'s en de reden van de klant; met een duidelijke en ondertekende vastlegging mag je in beginsel op de handtekening uitgaan.', kb: 'k110' },
            { t: 'Inhoudelijk passend advies maar een dun dossier: dat kan je een deel van het honorarium kosten.', kb: 'k102' },
            { t: 'Alleen het feit noemen zonder de gevolgen in euro\'s uit te leggen.', kb: 'k114' }
          ],
          links: [
            ['Afwijkend advies', 'afwijkend-advies.html'],
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Sjabloon: Adviesrapport toesturen', 'sjablonen.html#adv-rapport'],
            ['Sjabloon: Afwijkende keuze klant', 'sjablonen.html#adv-afwijkend'],
            ['Sjabloon: Klant ziet af van verzekering', 'sjablonen.html#adv-geen-verzekering'],
            ['Kennisbank: execution only en afwijken (k110)', 'index.html#artikel-k110']
          ]
        },
        {
          id: 'aanvraag',
          titel: 'Aanvraag en offerte',
          doel: 'De aanvraag correct en op tijd indienen, alle termijnen bewaken en de klant actief informeren tot de financiering rond is.',
          afm: {
            bron: null, ref: '', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad: het bemiddelingstraject valt volgens voetnoot 1 (p. 3) buiten de reikwijdte. Wel blijkt uit Kifid-uitspraken dat de zorgplicht van de adviseur doorloopt tot de financiering rond is (zie k100).'
          },
          check: [
            'Termijnenoverzicht gemaakt: geldigheid renteaanbod, financieringsvoorbehoud, bankgarantie, passeerdatum.',
            'Aanvraag gecontroleerd op juistheid en volledigheid voor indienen.',
            'Opgevraagde en ontvangen stukken met data bijgehouden.',
            'Vragen van de geldverstrekker direct opgepakt en klant geïnformeerd.',
            'Offerte gecontroleerd tegen het advies (bedrag, leningdelen, rente, looptijd, voorwaarden).',
            'Bij dreigende overschrijding van het voorbehoud: klant tijdig geadviseerd over verlenging of beroep erop.'
          ],
          dossier: [
            'Ingediende aanvraag met datum.',
            'Termijnenoverzicht en logboek van contactmomenten.',
            'Offerte geldverstrekker en controle tegen het advies.',
            'Correspondentie over ontbrekende stukken en voorwaarden.'
          ],
          valkuilen: [
            { t: 'Financieringsvoorbehoud laten verlopen zonder actie of waarschuwing; de boete kan bij de adviseur terechtkomen.', kb: 'k100' },
            { t: 'Renteaanbod laten verlopen door trage aanlevering van stukken.', kb: 'k100' },
            { t: 'Pas na de taxatie melden dat er nog een essentieel stuk nodig is.', kb: 'k111' }
          ],
          links: [
            ['Documentenchecklist', 'documentenchecklist.html'],
            ['Sjabloon: Aanvraag ingediend', 'sjablonen.html#aan-ingediend'],
            ['Sjabloon: Offerte ontvangen', 'sjablonen.html#aan-offerte-ontvangen'],
            ['Sjabloon: Voorwaarden uit de offerte', 'sjablonen.html#aan-voorwaarden'],
            ['Sjabloon: Afwijzing melden', 'sjablonen.html#aan-afwijzing'],
            ['Sjabloon: Herinnering ontbrekende documenten', 'sjablonen.html#inv-herinnering-documenten'],
            ['Kennisbank: aanvraagtraject (k100)', 'index.html#artikel-k100']
          ]
        },
        {
          id: 'passeren',
          titel: 'Passeren',
          doel: 'Zorgen dat alles klaarligt voor de notaris en dat de geadviseerde verzekeringen daadwerkelijk zijn ingegaan.',
          afm: {
            bron: null, ref: '', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad (bemiddeling valt buiten de reikwijdte). Praktijkpunt uit Kifid-uitspraken: controleer of geadviseerde dekking ook echt is ingegaan (zie k104).'
          },
          check: [
            'Voorwaarden uit de offerte afgevinkt en stukken bij de geldverstrekker akkoord.',
            'Notaris heeft de juiste gegevens; passeerdatum binnen de geldigheid van de offerte.',
            'Polis(sen) ORV/AOV/opstal ingegaan of ingangsdatum bevestigd.',
            'Bouwdepot, overbrugging of eigen geld correct verwerkt in de nota van afrekening.',
            'Klant geïnformeerd over wat er na het passeren gebeurt.'
          ],
          dossier: [
            'Akkoord geldverstrekker (stukken compleet).',
            'Nota van afrekening (concept en definitief).',
            'Polisbladen of ingangsbevestigingen van verzekeringen.'
          ],
          valkuilen: [
            { t: 'Ervan uitgaan dat een nieuwe ORV is geregeld zonder de polis te controleren.', kb: 'k104' }
          ],
          links: [
            ['Sjabloon: Afspraak bij de notaris', 'sjablonen.html#aan-notaris'],
            ['Sjabloon: Felicitatie na passeren', 'sjablonen.html#aan-gefeliciteerd'],
            ['Rekenhulp: Woonlasten tijdens de bouw', 'rekentools.html#bouwdepot']
          ]
        },
        {
          id: 'nazorg',
          titel: 'Nazorg',
          doel: 'De afgesproken nazorg leveren en bij wijzigingen tijdig opnieuw adviseren.',
          afm: {
            bron: 'leidraad', ref: 'H3 Nazorg en H9', p: 9,
            tekst: 'Volgens de Leidraad biedt de adviseur gedurende de looptijd passende nazorg op basis van de afspraken die bij de start zijn gemaakt. Actief klantbeheer noemt de Leidraad een goede praktijk. Bij een uitgestelde beslissing over een risicoverzekering is nabellen eveneens een goede praktijk (p. 23).'
          },
          check: [
            'Nazorgafspraken uit de opdracht in je systeem gezet.',
            'Signaleringen ingesteld: einde rentevast, einde aflossingsvrij deel, pensioendatum, einde ORV.',
            'Terugbelmoment bij uitgestelde verzekeringsbeslissing uitgevoerd.',
            'Klant gevraagd wijzigingen (gezin, werk, gezondheid) door te geven.',
            'Periodieke check gepland en uitnodiging vastgelegd.'
          ],
          dossier: [
            'Nazorgplan of afsluitende brief met afspraken.',
            'Uitnodigingen, reacties en verslagen van periodieke contacten.'
          ],
          valkuilen: [
            { t: 'Bij een later contactmoment niet vragen naar gewijzigde gezinssituatie (huwelijk, kinderen) en daardoor niet wijzen op een ORV.', kb: 'k104' },
            { t: 'Geen actieve bemoeienis met polissen in de portefeuille terwijl de situatie daarom vraagt.', kb: 'k106' }
          ],
          links: [
            ['Periodieke nazorgcheck', 'nazorg-check.html'],
            ['Wijziging doorgeven', 'wijziging-doorgeven.html'],
            ['Sjabloon: Uitnodiging jaarlijkse check', 'sjablonen.html#nz-jaarlijks'],
            ['Sjabloon: Wijzigingen doorgeven', 'sjablonen.html#nz-wijziging-doorgeven'],
            ['Sjabloon: Rentevaste periode loopt af', 'sjablonen.html#rente-afloop-aankondiging'],
            ['Kennisbank: nazorg en doorlopende zorgplicht (k64)', 'index.html#artikel-k64']
          ]
        }
      ]
    },

    /* ======================================================================
       ROUTE 2: OVERSLUITEN / VERHOGEN
       ====================================================================== */
    {
      id: 'oversluiten',
      naam: 'Oversluiten of verhogen',
      kort: 'Oversluiten',
      intro: 'Oversluiten (vervroegd openbreken van de rente of de hele hypotheek aflossen en opnieuw afsluiten) en verhogen zijn een nieuw adviesmoment. Doorloop het traject opnieuw voor zover dat redelijkerwijs relevant is.',
      stappen: [
        {
          id: 'doel',
          titel: 'Aanleiding en doel van de klant',
          doel: 'Helder krijgen waarom de klant wil oversluiten of verhogen: lagere lasten, langere zekerheid, schuld verlagen richting pensioen, verbouwen of verduurzamen.',
          afm: {
            bron: 'leidraad', ref: 'H10 Oversluiten', p: 25,
            tekst: 'De Leidraad ziet oversluiten als een nieuw adviesmoment waarbij het traject voor zover redelijkerwijs relevant opnieuw wordt doorlopen, inclusief de betaalbaarheid bij bijvoorbeeld arbeidsongeschiktheid. De adviseur stelt eerst vast wat het doel van de klant is.'
          },
          check: [
            'Doel van de klant vastgesteld en vastgelegd.',
            'Bekende deadlines van de klant genoteerd (leeftijd, verkoopdatum, einde rentevast).',
            'Opdracht en kosten opnieuw vastgelegd.',
            'Bij verhogen alleen voor energiebesparende voorzieningen: nagegaan of een beperkt advies volstaat (AFM-handvatten).'
          ],
          dossier: [
            'Gespreksverslag met doel en aanleiding.',
            'Opdrachtbevestiging voor dit traject.'
          ],
          valkuilen: [
            { t: 'Bekende deadlines van de klant niet bewaken; die zijn ook jouw deadlines.', kb: 'k113' }
          ],
          links: [
            ['Oversluiten', 'oversluiten.html'],
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Sjabloon: Opdrachtbevestiging', 'sjablonen.html#km-opdrachtbevestiging'],
            ['Kennisbank: oversluiten en meeneemregeling (k113)', 'index.html#artikel-k113']
          ]
        },
        {
          id: 'klantbeeld',
          titel: 'Klantbeeld actualiseren',
          doel: 'Werken met een actueel klantbeeld in plaats van gegevens uit een oud dossier.',
          afm: {
            bron: 'leidraad', ref: 'H10 Inventarisatie en analyse', p: 25,
            tekst: 'Volgens de Leidraad stelt de adviseur bij een eerder traject van minder dan vijf jaar geleden in ieder geval de checkvraag of er relevante wijzigingen zijn en bepaalt hij of informatie opnieuw moet worden ingewonnen. Ligt het meer dan vijf jaar terug, dan ligt het volgens de Leidraad niet voor de hand nog informatie uit het vorige traject te gebruiken.'
          },
          check: [
            'Datum vorig adviestraject bepaald (< of > 5 jaar).',
            'Checkvraag op relevante wijzigingen gesteld en antwoord vastgelegd.',
            'Inkomen, verplichtingen, gezinssituatie en risicobereidheid zo nodig opnieuw geïnventariseerd.',
            'Pensioenopgave en AOW-datum actueel.'
          ],
          dossier: [
            'Geactualiseerde inventarisatie of vastgelegde checkvraag met antwoord.',
            'Actuele inkomens- en pensioenstukken.'
          ],
          valkuilen: [
            { t: 'Gewijzigde gezinssituatie niet uitvragen en daardoor geen nieuw advies over overlijdensrisico.', kb: 'k104' }
          ],
          links: [
            ['Inventarisatieformulier', 'inventarisatie.html'],
            ['Documentenchecklist', 'documentenchecklist.html'],
            ['Rekenhulp: Wanneer gaat de AOW in?', 'rekentools.html#aow-datum']
          ]
        },
        {
          id: 'huidig',
          titel: 'Huidige hypotheek en verbonden producten in kaart',
          doel: 'Alle kenmerken van de bestaande situatie kennen: leningdelen, rente en einddatum, fiscale status, opbouwproducten, NHG, gekoppelde verzekeringen en voorwaarden.',
          afm: {
            bron: 'leidraad', ref: 'H7 en H10', p: 25,
            tekst: 'De Leidraad noemt dat de adviseur de relevante informatie over de huidige hypotheek en eventuele opbouwproducten in kaart brengt en de gevolgen voor verbonden producten en wijzigingen in aflosvorm uitlegt (p. 25-26). Voor de fiscale kant: eigenwoningschuld, overgangsrecht en opbouwproducten (KEW, SEW, BEW) (p. 17).'
          },
          check: [
            'Per leningdeel: hoofdsom, rente, einddatum rentevast, aflosvorm, fiscale status en einde renteaftrek.',
            'Opbouwproducten en gekoppelde verzekeringen (ORV, KEW/SEW/BEW) en wat ermee gebeurt.',
            'NHG: blijft die behouden bij oversluiten of verhogen?',
            'Voorwaarden huidige geldverstrekker: boetevrije ruimte, rentemiddeling, verhoging, meeneemregeling.'
          ],
          dossier: [
            'Recent hypotheekoverzicht en polisoverzichten.',
            'Overzicht fiscale status per leningdeel met bron.'
          ],
          valkuilen: [
            { t: 'Te lange renteaftrekperiode aannemen voor een oud leningdeel.', kb: 'k103' },
            { t: 'NHG-dekking of renteaftrek verliezen door oversluiten zonder dat de klant dat weet.', kb: 'k113' }
          ],
          links: [
            ['Eigenwoningreserve en bijleenregeling', 'bijleenregeling.html'],
            ['NHG-check', 'nhg-check.html'],
            ['Scan aflossingsvrij', 'scan-aflossingsvrij.html'],
            ['Rekenhulp: Aflossingseis voor renteaftrek', 'rekentools.html#aflossingseis-renteaftrek'],
            ['Rekenhulp: Renteaftrek nu en later', 'rekentools.html#renteaftrek-verloop'],
            ['Rekenhulp: Uitkering KEW', 'rekentools.html#kapitaalverzekering-eigen-woning']
          ]
        },
        {
          id: 'kosten',
          titel: 'Kosten, baten en terugverdientijd',
          doel: 'Laten zien of oversluiten financieel opweegt tegen de kosten, bij de huidige én bij een andere geldverstrekker.',
          afm: {
            bron: 'leidraad', ref: 'H10 Inventarisatie en analyse', p: 25,
            tekst: 'Volgens de Leidraad betrekt de adviseur de kosten van oversluiten (zoals vergoeding vervroegde aflossing, notaris en taxatie) in de analyse, vergelijkt hij oversluiten bij de huidige geldverstrekker met andere aanbieders (tenzij duidelijk is dat hij maar over één aanbieder adviseert) en maakt hij een berekening van de terugverdientijd (p. 25-26).'
          },
          check: [
            'Vergoeding vervroegde aflossing berekend of opgevraagd.',
            'Bijkomende kosten (notaris, taxatie, advies) in beeld.',
            'Terugverdientijd berekend.',
            'Huidige geldverstrekker (rentemiddeling, aanpassing) vergeleken met andere aanbieders.',
            'Fiscale gevolgen van meefinancieren van kosten besproken; zo nodig doorverwezen naar fiscalist.'
          ],
          dossier: [
            'Berekening kosten en terugverdientijd.',
            'Vergelijking huidige versus andere geldverstrekker.'
          ],
          valkuilen: [
            { t: 'Oversluiten naar een langere looptijd terwijl het pensioeninkomen dat niet draagt.', kb: 'k113' }
          ],
          links: [
            ['Rentemiddeling', 'rentemiddeling.html'],
            ['Rekenhulp: Kosten van oversluiten', 'rekentools.html#kosten-oversluiten'],
            ['Rekenhulp: Vergoeding vervroegd aflossen (aflossingsvrij)', 'rekentools.html#vergoeding-aflossingsvrij'],
            ['Rekenhulp: Boetevrije aflossingsruimte', 'rekentools.html#boetevrij-aflossen'],
            ['Sjabloon: Rentemiddeling', 'sjablonen.html#rente-middeling']
          ]
        },
        {
          id: 'alternatieven',
          titel: 'Alternatieven en betaalbaarheid',
          doel: 'Alternatieven doorrekenen (andere aflosvorm, deels aflossen, niet oversluiten) en de betaalbaarheid nu, bij life events en na pensioen toetsen.',
          afm: {
            bron: 'leidraad', ref: 'H10 en voorbeeld 15', p: 26,
            tekst: 'De Leidraad noemt dat bij een wijziging van aflosvorm de adviseur beoordeelt of de voordelen zwaarder wegen dan de kosten en of de nieuwe hypotheek past bij de financiële positie. Ook als het doel niet "lagere lasten" is, informeert de adviseur over de financiële gevolgen, bijvoorbeeld met een vergelijking van bruto lasten. Het voorbeeld in de Leidraad laat zien dat herfinanciering van een aflossingsvrij deel op pensioenleeftijd niet vanzelf lukt.'
          },
          check: [
            'Optie "niet oversluiten" als referentie meegenomen.',
            'Aflosvorm en aflossingsvrij deel richting einddatum en pensioen doorgerekend.',
            'Overlijden, AO en werkloosheid opnieuw doorgerekend waar relevant.',
            'Bestaande ORV/AOV: blijft de dekking passend en geldig na oversluiten?'
          ],
          dossier: [
            'Vergelijking oud-nieuw: rente, looptijd, einddatum, renteaftrek, NHG, kosten, voorwaarden.',
            'Scenario\'s richting en na pensioendatum.'
          ],
          valkuilen: [
            { t: 'Een vervallen ORV bij oversluiten niet opnieuw regelen.', kb: 'k104' },
            { t: 'Alleen melden dat er een restschuld blijft bij aflossingsvrij, zonder aflosopties te bespreken.', kb: 'k102' }
          ],
          links: [
            ['Restschuld bij pensioen', 'restschuld-pensioen.html'],
            ['Extra aflossen', 'extra-aflossen.html'],
            ['Overlijdensrisico (ORV)', 'orv.html'],
            ['Rekenhulp: Aflossen op aflossingsvrij deel', 'rekentools.html#aflossingsvrij-aflossen'],
            ['Rekenhulp: Annuïtair, lineair en aflossingsvrij', 'rekentools.html#hypotheekvormen-vergelijken'],
            ['Sjabloon: Aflossingsvrij deel vooruitkijken', 'sjablonen.html#nz-aflossingsvrij']
          ]
        },
        {
          id: 'advies',
          titel: 'Advies, rapport en uitvoering',
          doel: 'Onderbouwd advies dat ook de bredere context toelicht, vastgelegd in een rapport; daarna aanvraag en termijnbewaking.',
          afm: {
            bron: 'leidraad', ref: 'H10 Advies', p: 27,
            tekst: 'Volgens de Leidraad licht de adviseur het advies onderbouwd toe, niet alleen met de financiële vergelijking maar ook met de bredere context (bijvoorbeeld blijvende betaalbaarheid), en legt hij vast hoe het advies tot stand is gekomen. De uitkomsten van de analyse moeten uit het adviesrapport blijken (p. 26).'
          },
          check: [
            'Adviesrapport met analyse, overwegingen en terugverdientijd verstuurd.',
            'Afwijkende keuze van de klant vastgelegd en bevestigd.',
            'Aanvraag ingediend en termijnen (renteaanbod, aflosdatum) bewaakt.',
            'Na uitvoering: nieuwe einddatums in signaleringssysteem gezet.'
          ],
          dossier: [
            'Adviesrapport en eventuele afwijkend-adviesverklaring.',
            'Offerte en akte; bevestiging aflossing oude lening.'
          ],
          valkuilen: [
            { t: 'Na de taxatie weken laten verstrijken terwijl de klant een deadline had.', kb: 'k113' }
          ],
          links: [
            ['Afwijkend advies', 'afwijkend-advies.html'],
            ['Sjabloon: Adviesrapport toesturen', 'sjablonen.html#adv-rapport'],
            ['Sjabloon: Renteverlengingsvoorstel', 'sjablonen.html#rente-voorstel-keuze'],
            ['Periodieke nazorgcheck', 'nazorg-check.html']
          ]
        }
      ]
    },

    /* ======================================================================
       ROUTE 3: INKOMENS- EN ORV-ADVIES
       ====================================================================== */
    {
      id: 'inkomen',
      naam: 'Inkomens- en ORV-advies',
      kort: 'Inkomen en ORV',
      intro: 'Advies over overlijdensrisico, arbeidsongeschiktheid en werkloosheid, los of in samenhang met een hypotheek. De Leidraad gaat over hypotheekadvies; hoofdstuk 9 (life events) is vooral relevant als het advies samenhangt met een hypotheek.',
      stappen: [
        {
          id: 'afbakening',
          titel: 'Opdracht en afbakening',
          doel: 'Vastleggen of je adviseert over risicoverzekeringen, over welke risico\'s en tegen welke vergoeding.',
          afm: {
            bron: 'leidraad', ref: 'H9 Advies', p: 23,
            tekst: 'De Leidraad beschrijft dat, als advies over risicoverzekeringen onderdeel van het traject is, de adviseur ook over een passende verzekering adviseert. Is afgesproken dat je níet over verzekeringen adviseert en blijkt dat de klant de inkomensrisico\'s niet kan dragen, dan wijs je volgens de Leidraad duidelijk op de gevolgen en verwijs je actief door (p. 23-24).'
          },
          check: [
            'Afgesproken over welke risico\'s je adviseert (overlijden, AO, werkloosheid).',
            'Kosten en vergoedingsvorm vastgelegd (provisieverbod geldt voor inkomensverzekeringen, zie k61).',
            'Bij geen advies: vastgelegd dat je doorverwijst als er een onoverbrugbaar tekort blijkt.',
            'Vergunning dekt de betreffende productcategorie.'
          ],
          dossier: [
            'Opdrachtbevestiging met afbakening.',
            'Vergelijkingskaart (indien van toepassing).'
          ],
          valkuilen: [
            { t: 'Execution only aanbieden zonder kennis- en ervaringstoets en zonder heldere schriftelijke afspraak dat je niet adviseert.', kb: 'k110' }
          ],
          links: [
            ['Sjabloon: Opdrachtbevestiging', 'sjablonen.html#km-opdrachtbevestiging'],
            ['Kennisbank: provisieverbod en vergelijkingskaart (k61)', 'index.html#artikel-k61'],
            ['Kennisbank: vergunning en vakbekwaamheid (k66)', 'index.html#artikel-k66']
          ]
        },
        {
          id: 'voorzieningen',
          titel: 'Inkomen en bestaande voorzieningen',
          doel: 'Klantspecifiek beeld van inkomen, vaste lasten en wat er uitkeert bij overlijden, AO en werkloosheid: sociaal, via de werkgever en eigen voorzieningen.',
          afm: {
            bron: 'leidraad', ref: 'H9 Inventarisatie en analyse', p: 22,
            tekst: 'Volgens de Leidraad wint de adviseur informatie in over sociale voorzieningen, werkgeversvoorzieningen en eigen voorzieningen, en verdiept hij zich in de kenmerken: voor welke termijn, welke bedragen en tot welk moment. De Leidraad vraagt de voorzieningen klantspecifiek te bekijken en niet uit te gaan van een algemeen uitgangspunt.'
          },
          check: [
            'Bruto en netto inkomen per partner, soort dienstverband of ondernemerschap.',
            'Werkgeversregelingen: loondoorbetaling bij ziekte, WGA-hiaat/WIA-excedent, nabestaandenpensioen.',
            'Wettelijke regelingen: Anw, wezenuitkering, WIA, WW (duur en hoogte).',
            'Bestaande polissen: ORV, AOV, woonlastenverzekering, met bedragen en einddata.',
            'Buffer en spaarcapaciteit.'
          ],
          dossier: [
            'Pensioen- en werkgeversregelingen (reglement of overzicht).',
            'Polisbladen bestaande verzekeringen.',
            'Inkomensbewijzen.'
          ],
          valkuilen: [
            { t: 'Uitgaan van "standaard" werkgeversregelingen zonder het reglement te checken.', kb: 'k114' }
          ],
          links: [
            ['Inventarisatieformulier', 'inventarisatie.html'],
            ['Inkomen bij ziekte werknemer', 'inkomen-ziekte-werknemer.html'],
            ['Werkloosheid', 'werkloosheid.html'],
            ['Rekenhulp: Dagloon UWV', 'rekentools.html#dagloon-uwv'],
            ['Rekenhulp: Netto uitkering', 'rekentools.html#netto-uitkering'],
            ['Rekenhulp: Netto nabestaandenpensioen en Anw', 'rekentools.html#nabestaandenuitkering'],
            ['Levensgebeurtenis: Starten als zzp\'er', 'levensgebeurtenissen.html#zzp']
          ]
        },
        {
          id: 'behoefte',
          titel: 'Behoefte en risicobereidheid',
          doel: 'Vaststellen welk risico de klant wil lopen en wat hij nodig heeft om rond te komen, en tegenstrijdigheden daarin bespreken.',
          afm: {
            bron: 'leidraad', ref: 'H2 en H9, voorbeeld 13', p: 22,
            tekst: 'De Leidraad beschrijft dat de adviseur nagaat of de klant de risico\'s en gevolgen begrijpt en hoe hij ertegenover staat, en doorvraagt bij tegenstrijdigheden, zoals een klant die een stabiel inkomen bij AO belangrijk vindt maar het risico niet wil afdekken (p. 4). Of het realistisch is om de levensstijl aan te passen wordt samen onderzocht (voorbeeld 13).'
          },
          check: [
            'Gewenst netto inkomen of woonlasten bij elk risico vastgesteld.',
            'Risicobereidheid per risico vastgelegd.',
            'Tegenstrijdigheden tussen wensen en risicobereidheid besproken.',
            'Realisme van aanpassen levensstijl besproken.'
          ],
          dossier: [
            'Vastlegging risicobereidheid en behoefte per risico.',
            'Gespreksverslag met besproken tegenstrijdigheden.'
          ],
          valkuilen: [
            { t: 'De wens "geen verzekering" overnemen zonder te toetsen of de klant het risico kan dragen.', kb: 'k60' }
          ],
          links: [
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Scan overlijdensrisico', 'scan-overlijdensrisico.html'],
            ['Rekenhulp: Sociaal minimum', 'rekentools.html#sociaal-minimum']
          ]
        },
        {
          id: 'scenario',
          titel: 'Scenarioberekeningen',
          doel: 'Per risico het tekort berekenen, met en zonder voorziening, inclusief wachttijden.',
          afm: {
            bron: 'leidraad', ref: 'H9 Inventarisatie en analyse', p: 22,
            tekst: 'Volgens de Leidraad berekent de adviseur aan de hand van scenario\'s het inkomen bij de calamiteit, met bestaande voorzieningen en verzekerde bedragen, en laat hij zien of de klant het tekort zelf kan opvangen of alleen met een verzekering. Ook de overbrugging van een wachttijd en de positie van een ondernemer zonder voorzieningen horen erbij (p. 22-23).'
          },
          check: [
            'Overlijden van elk van de partners doorgerekend.',
            'Arbeidsongeschiktheid doorgerekend in de tijd (loondoorbetaling, WIA, eventuele AOV).',
            'Werkloosheid doorgerekend (WW-duur, daarna).',
            'Wachttijd en buffer meegenomen.',
            'Uitkomsten in euro\'s per maand met de klant besproken.'
          ],
          dossier: [
            'Scenarioberekeningen per risico met datum en uitgangspunten.'
          ],
          valkuilen: [
            { t: 'Alleen het verzekerd bedrag berekenen, niet het tekort per periode.', kb: 'k114' }
          ],
          links: [
            ['Overlijdensrisico (ORV)', 'orv.html'],
            ['AOV-tekort', 'aov-tekort.html'],
            ['Rekenhulp: Netto AOV-uitkering', 'rekentools.html#aov-uitkering-netto'],
            ['Levensgebeurtenis: Arbeidsongeschikt', 'levensgebeurtenissen.html#ziek'],
            ['Levensgebeurtenis: Baanverlies', 'levensgebeurtenissen.html#werkloos']
          ]
        },
        {
          id: 'productadvies',
          titel: 'Productadvies en afwijkend advies',
          doel: 'Passende dekking adviseren (bedrag, looptijd, vorm, voorwaarden) en de onderbouwing vastleggen; afwijken van de klant vastleggen.',
          afm: {
            bron: 'leidraad', ref: 'H9 Advies, voorbeeld 14', p: 23,
            tekst: 'De Leidraad beschrijft dat de adviseur de onderbouwing van de geadviseerde verzekering en het verzekerd bedrag toelicht en de aansluiting op financiële positie, doelstellingen en risicobereidheid. Kiest de klant toch voor geen verzekering, dan wijst de adviseur op de consequenties en neemt hij dit inclusief de motivatie van de klant op in het adviesrapport. Nabellen bij een uitgestelde beslissing noemt de Leidraad een goede praktijk.'
          },
          check: [
            'ORV: verzekerd bedrag, looptijd, vorm (gelijkblijvend/dalend), kruislings en begunstiging onderbouwd.',
            'AOV: arbeidsongeschiktheidscriterium, wachttijd, eindleeftijd, verzekerd bedrag en inkomenstoetsing besproken.',
            'Alternatieven besproken (broodfonds, sparen, woonlastenverzekering).',
            'Bij overstap van polis: oude en nieuwe voorwaarden op kernpunten vergeleken.',
            'Afwijken van advies vastgelegd en door klant bevestigd.'
          ],
          dossier: [
            'Adviesrapport met onderbouwing per verzekering.',
            'Vergelijking oude en nieuwe polis (bij overstap).',
            'Afwijkend-adviesverklaring (indien van toepassing).'
          ],
          valkuilen: [
            { t: 'Overstap naar een AOV met een ongunstiger criterium: een tekortkoming, ook als de schade nog niet vaststaat.', kb: 'k105' },
            { t: 'Klant ziet af van ORV en er volgt geen vastlegging en geen terugbelmoment.', kb: 'k110' }
          ],
          links: [
            ['Afwijkend advies', 'afwijkend-advies.html'],
            ['Rekenhulp: Netto premie AOV', 'rekentools.html#aov-premie-netto'],
            ['Sjabloon: Klant ziet af van verzekering', 'sjablonen.html#adv-geen-verzekering'],
            ['Kennisbank: ORV bij hypotheekadvies (k104)', 'index.html#artikel-k104'],
            ['Kennisbank: AOV-advies (k105)', 'index.html#artikel-k105']
          ]
        },
        {
          id: 'aanvraag-verz',
          titel: 'Aanvraag en mededelingsplicht',
          doel: 'Een juiste aanvraag en gezondheidsverklaring, ingevuld door de klant zelf, en controle dat de dekking ingaat.',
          afm: {
            bron: null, ref: '', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad. Praktijkpunten uit Kifid-uitspraken over de mededelingsplicht (k109).'
          },
          check: [
            'Klant beantwoordt de vragen zelf; bij samen invullen letterlijk voorgelezen.',
            'Gewezen op doorlopende mededelingsplicht tot de verzekering tot stand komt.',
            'Klant heeft de ingevulde verklaring gecontroleerd en ondertekend.',
            'Polis ontvangen en gecontroleerd op het advies (bedrag, looptijd, begunstiging).'
          ],
          dossier: [
            'Kopie aanvraag en gezondheidsverklaring.',
            'Polisblad en controle tegen het advies.'
          ],
          valkuilen: [
            { t: 'Adviseren om medische informatie weg te laten.', kb: 'k109' }
          ],
          links: [
            ['Kennisbank: mededelingsplicht (k109)', 'index.html#artikel-k109']
          ]
        },
        {
          id: 'nazorg-verz',
          titel: 'Nazorg risicoverzekeringen',
          doel: 'Dekking blijft passend bij veranderende omstandigheden en de premie blijft marktconform.',
          afm: {
            bron: 'leidraad', ref: 'H3 Nazorg en H9', p: 9,
            tekst: 'De Leidraad vraagt om nazorg op basis van de gemaakte afspraken en noemt actief klantbeheer en nabellen goede praktijken. Concrete Kifid-lessen over actieve bemoeienis en premievergelijking staan in k106.'
          },
          check: [
            'Signalering op gezinswijziging, verhuizing, oversluiten, einde dekking.',
            'Periodiek premie en dekking vergeleken met de markt.',
            'Begunstiging gecontroleerd bij gewijzigde relatie of kinderen.'
          ],
          dossier: [
            'Verslagen van periodieke checks en uitnodigingen.'
          ],
          valkuilen: [
            { t: 'Klant niet wijzen op sterk gedaalde ORV-premies in de markt.', kb: 'k106' },
            { t: 'Begunstiging niet controleren tijdens de looptijd.', kb: 'k106' }
          ],
          links: [
            ['Periodieke nazorgcheck', 'nazorg-check.html'],
            ['Sjabloon: Check ORV- en AO-dekking', 'sjablonen.html#nz-orv-aov'],
            ['Levensgebeurtenis: Kind krijgen', 'levensgebeurtenissen.html#kind'],
            ['Levensgebeurtenis: Trouwen', 'levensgebeurtenissen.html#trouwen']
          ]
        }
      ]
    },

    /* ======================================================================
       ROUTE 4: PENSIOEN / VERMOGEN (ORIËNTATIE)
       ====================================================================== */
    {
      id: 'pensioen',
      naam: 'Pensioen en vermogen (oriëntatie)',
      kort: 'Pensioen',
      intro: 'Een oriënterend traject over inkomen na pensionering en vermogensopbouw, binnen je eigen Wft-vergunning. Controleer per product of je vergunning het dekt; advies over beleggen in financiële instrumenten valt onder een ander regime. Verwijs door waar je niet bevoegd bent.',
      stappen: [
        {
          id: 'kader',
          titel: 'Kader en vergunning',
          doel: 'Vooraf duidelijk maken wat je wel en niet doet: oriëntatie of advies, welke producten, en waar je doorverwijst.',
          afm: {
            bron: 'kb', ref: 'k66', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad (die gaat over hypotheekadvies). Volgens de kennisbank (k66, concept) heb je per productcategorie een vergunning nodig en per product-dienstcombinatie een geldig Wft-diploma. Controleer het AFM-register voor je eigen vergunning.'
          },
          check: [
            'Vastgelegd of het om oriëntatie of om advies gaat.',
            'Gecontroleerd welke producten binnen je vergunning en diploma\'s vallen.',
            'Met de klant afgesproken waarvoor je doorverwijst (bijv. beleggingsadvies, fiscalist, pensioenuitvoerder).',
            'Kosten van het traject vastgelegd.'
          ],
          dossier: [
            'Opdrachtbevestiging met afbakening oriëntatie/advies.',
            'Notitie over doorverwijzing.'
          ],
          valkuilen: [
            { t: 'Ongemerkt van oriëntatie naar een persoonlijke productaanbeveling schuiven: dat is advies.', kb: 'k66' }
          ],
          links: [
            ['Sjabloon: Opdrachtbevestiging', 'sjablonen.html#km-opdrachtbevestiging'],
            ['Kennisbank: vergunning en vakbekwaamheid (k66)', 'index.html#artikel-k66'],
            ['Wetgeving', 'wetgeving.html']
          ]
        },
        {
          id: 'overzicht',
          titel: 'Pensioen- en vermogensoverzicht',
          doel: 'In beeld brengen wat de klant opbouwt en heeft: AOW, werkgeverspensioen, lijfrentes, vermogen, schulden en de woning.',
          afm: {
            bron: 'leidraad', ref: 'H4 Inventarisatie en analyse', p: 10,
            tekst: 'In hypotheekcontext noemt de Leidraad dat informatie over voorzieningen zoals werkgeverspensioen vooral relevant is als de hypotheek na pensionering doorloopt. Voor een los pensioentraject is dit geen Leidraad-eis maar wel een logisch startpunt.'
          },
          check: [
            'AOW-datum en eventuele AOW-opbouwgaten bepaald.',
            'Werkgeverspensioen per uitvoerder opgevraagd (ouderdoms- en partnerpensioen).',
            'Lijfrentes, bankspaar- en beleggingsrekeningen in kaart.',
            'Vrij vermogen, schulden en de hypotheek richting pensioen in kaart.',
            'Partner bekend bij pensioenuitvoerder (goede praktijk volgens Leidraad p. 24).'
          ],
          dossier: [
            'Pensioenoverzicht(en) met datum.',
            'Overzicht vermogen, lijfrentes en schulden.'
          ],
          valkuilen: [
            { t: 'Een kapitaal- of beleggingsverzekering los beoordelen zonder naar de hele financiële situatie te kijken.', kb: 'k107' }
          ],
          links: [
            ['Pensioenscan', 'scan-pensioen.html'],
            ['Rekenhulp: Wanneer gaat de AOW in?', 'rekentools.html#aow-datum'],
            ['Rekenhulp: AOW bij opbouwgaten', 'rekentools.html#aow-bedrag-opbouwgaten'],
            ['Rekenhulp: Netto AOW en pensioen', 'rekentools.html#netto-aow-pensioen'],
            ['Levensgebeurtenis: Met pensioen gaan', 'levensgebeurtenissen.html#pensioen']
          ]
        },
        {
          id: 'doelen',
          titel: 'Doelen, horizon en risicobereidheid',
          doel: 'Vaststellen wat de klant wil: gewenst inkomen, eerder stoppen, aflossen, nalaten; en hoeveel risico hij wil en kan lopen.',
          afm: {
            bron: null, ref: '', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad voor een los pensioen- of vermogenstraject. De Leidraad noemt wel eerder stoppen met werken en minder gaan werken als wensen die de betaalbaarheid van woonlasten beïnvloeden (p. 7 en 11).'
          },
          check: [
            'Gewenst netto inkomen na pensionering vastgesteld.',
            'Gewenste stopdatum (eerder, later, deeltijd) besproken.',
            'Horizon en risicobereidheid vastgelegd.',
            'Wensen over aflossen, schenken of nalaten genoteerd.'
          ],
          dossier: [
            'Klantprofiel met doelen, horizon en risicobereidheid.'
          ],
          valkuilen: [
            { t: 'Doelen niet vastleggen, waardoor later niet aantoonbaar is waarom een richting is gekozen.', kb: 'k114' }
          ],
          links: [
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Rekenhulp: Eerder stoppen met RVU', 'rekentools.html#rvu-inkomensdaling'],
            ['Rekenhulp: Netto vroegpensioen', 'rekentools.html#netto-vroegpensioen']
          ]
        },
        {
          id: 'tekort',
          titel: 'Tekortanalyse inclusief woonlasten',
          doel: 'Het verschil tussen gewenst en verwacht inkomen berekenen, met de woonlasten na pensionering.',
          afm: {
            bron: 'leidraad', ref: 'H3 Analyse en H4 Advies', p: 7,
            tekst: 'De Leidraad noemt dat de adviseur (bij hypotheekadvies) de betaalbaarheid van de woonlasten na pensionering onderzoekt, ook als de klant nog meer dan tien jaar van pensioen af zit, en dat dit belangrijker wordt naarmate de klant dichter bij pensionering is of het tekort groter is (p. 7, 12).'
          },
          check: [
            'Verwacht netto inkomen na AOW-datum berekend.',
            'Woonlasten na pensionering (inclusief aflossingsvrij deel en einde renteaftrek) meegenomen.',
            'Tekort per jaar en in totaal berekend.',
            'Uitkomst besproken in begrijpelijke bedragen.'
          ],
          dossier: [
            'Tekortberekening met uitgangspunten en datum.'
          ],
          valkuilen: [
            { t: 'Restschuld op een aflossingsvrij deel bij pensionering onbesproken laten.', kb: 'k102' }
          ],
          links: [
            ['Restschuld bij pensioen', 'restschuld-pensioen.html'],
            ['Rekenhulp: Inleg voor een pensioentekort', 'rekentools.html#pensioentekort'],
            ['Rekenhulp: Interen op vermogen', 'rekentools.html#interen'],
            ['Sjabloon: Pensioen en AOW-gat in beeld', 'sjablonen.html#nz-pensioen-aow']
          ]
        },
        {
          id: 'oplossingen',
          titel: 'Oplossingsrichtingen',
          doel: 'Richtingen verkennen binnen je vergunning: lijfrente of banksparen, extra aflossen, sparen in box 3, en waar nodig doorverwijzen.',
          afm: {
            bron: null, ref: '', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad. De Leidraad noemt in voorbeeld 3 wel zelf sparen, aflossen en de looptijd aanpassen als opties bij een tekort na pensionering (p. 10).'
          },
          check: [
            'Jaarruimte en reserveringsruimte berekend.',
            'Lijfrente versus box 3 vergeleken.',
            'Extra aflossen versus sparen of beleggen vergeleken.',
            'Kosten en risico\'s per richting benoemd.',
            'Doorverwezen waar de vergunning niet reikt.'
          ],
          dossier: [
            'Vergelijking van richtingen met uitgangspunten.',
            'Notitie van doorverwijzing.'
          ],
          valkuilen: [
            { t: 'Een richting presenteren zonder kosten en risico\'s; de klant moet een weloverwogen keuze kunnen maken.', kb: 'k114' }
          ],
          links: [
            ['Rekenhulp: Lijfrente jaarruimte', 'rekentools.html#lijfrente-jaarruimte'],
            ['Rekenhulp: Reserveringsruimte', 'rekentools.html#jaarruimte-reservering'],
            ['Rekenhulp: Lijfrente of box 3', 'rekentools.html#lijfrente-of-box3'],
            ['Rekenhulp: Aflossen of sparen en beleggen', 'rekentools.html#aflossen-of-beleggen'],
            ['Rekenhulp: Effect van kosten', 'rekentools.html#kosteneffect'],
            ['Rekenhulp: Belasting box 3', 'rekentools.html#box3-heffing'],
            ['Extra aflossen', 'extra-aflossen.html']
          ]
        },
        {
          id: 'vastleggen',
          titel: 'Vastleggen en vervolg',
          doel: 'Uitkomsten vastleggen, vervolgafspraak maken en signaleringen instellen.',
          afm: {
            bron: null, ref: '', p: 0,
            tekst: 'Geen specifieke passage in de Leidraad voor een los pensioen- of vermogenstraject. Praktijk: leg vast wat je hebt besproken, wat de klant kiest en wat je níet hebt gedaan.'
          },
          check: [
            'Samenvatting van de oriëntatie aan de klant gestuurd.',
            'Duidelijk vermeld dat oriëntatie geen productadvies is (indien van toepassing).',
            'Vervolgafspraak of signalering op pensioendatum gepland.'
          ],
          dossier: [
            'Samenvatting/verslag aan de klant.',
            'Signalering in klantsysteem.'
          ],
          valkuilen: [
            { t: 'Geen vastlegging van mondelinge toelichting; zonder vastlegging kun je niet aantonen wat je hebt verteld.', kb: 'k114' }
          ],
          links: [
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Periodieke nazorgcheck', 'nazorg-check.html'],
            ['Sjabloon: Pensioen en AOW-gat in beeld', 'sjablonen.html#nz-pensioen-aow']
          ]
        }
      ]
    },

    /* ======================================================================
       ROUTE 5: SCHADEVERZEKERINGEN (PARTICULIER EN ZAKELIJK)
       AFM-blokken met bron 'wet': eigen samenvatting van Wft/BGfo/BW en AFM-pagina's,
       geverifieerd via zoekresultaten op afm.nl en wetten.overheid.nl (peildatum 3 oktober 2026).
       De gedragscodes van verzekeraars (k254) binden de verzekeraar, niet de adviseur: alleen context.
       ====================================================================== */
    {
      id: 'schade',
      naam: 'Schadeverzekeringen (particulier en zakelijk)',
      kort: 'Schade',
      intro: 'Advies over en bemiddeling in schadeverzekeringen: wonen, aansprakelijkheid, mobiliteit, reizen, rechtsbijstand en de zakelijke risico\'s van ondernemers. De AFM-Leidraad Hypotheekadvisering gaat hier niet over; de AFM-blokken vatten de Wft, het BGfo, het BW en de AFM-uitleg samen. De gedragscodes van verzekeraars binden de verzekeraar en niet jou; ze staan er alleen als context bij.',
      stappen: [
        {
          id: 'kennismaking',
          titel: 'Kennismaking, dienstverlening en beloning',
          doel: 'De klant weet vooraf wat je wel en niet doet (advies, bemiddeling of beide, welke risico\'s), hoe je wordt beloond en wat er na het afsluiten gebeurt.',
          afm: {
            bron: 'wet', ref: 'art. 4:20 Wft en BGfo; IDD-transparantie; actieve provisietransparantie per 1 juli 2024',
            links: [
              ['AFM: Transparantie (IDD)', 'https://www.afm.nl/nl-nl/sector/themas/belangrijke-europese-wet--en-regelgeving/idd/transparantie---idd'],
              ['AFM: Duiding actieve provisietransparantie', 'https://www.afm.nl/nl-nl/sector/themas/verplichtingen-voor-ondernemingen/beleidsuitingen/interpretaties/interpretatie-provisietransparantie'],
              ['AFM: Vergelijkingskaart', 'https://www.afm.nl/nl-nl/sector/themas/dienstverlening-aan-consumenten/klantrelatie/vergelijkingskaart']
            ],
            tekst: 'Vóór het sluiten van een schadeverzekering vertel je de klant of hij jou rechtstreeks betaalt (met het bedrag) of dat je provisie van de verzekeraar ontvangt, en of er een eigendomsrelatie met de verzekeraar is. Voor schadeverzekeringen die vanaf 1 juli 2024 zijn gesloten geldt actieve provisietransparantie: je meldt de hoogte van de afsluit- en de doorlopende provisie uit jezelf, vóór het einde van de dienstverlening, ook als de klant er niet om vraagt. De AFM toetst vooral of voor de klant duidelijk is welke dienst hij krijgt en tegen welke prijs, en of daarover een passend gesprek is gevoerd. Het provisieverbod geldt niet voor particuliere schadeverzekeringen zoals opstal en inboedel. De vergelijkingskaart is verplicht bij producten onder het provisieverbod; bij een zuiver schadetraject mag je hem vrijwillig gebruiken. Stuurt de klant ook aan op een AOV of een andere provisieverbod-verzekering, dan geldt de kaart wel.'
          },
          check: [
            'Soort dienstverlening vastgelegd: advies, bemiddeling zonder advies, of beide; en voor welke risico\'s en polissen.',
            'Particulier of zakelijk vastgesteld (consumentenbescherming in de Wft geldt vooral voor de consument; het IPID geldt ook zakelijk).',
            'Beloning uitgelegd: provisie, fee of combinatie, met bedragen; bij provisie de hoogte van afsluit- en doorlopende provisie actief gemeld.',
            'Eventuele eigendomsrelatie met een verzekeraar of volmacht gemeld.',
            'Dienstverleningsinformatie of (vrijwillig) een vergelijkingskaart verstrekt.',
            'Afspraken over nazorg, schadebegeleiding en jaarlijkse check gemaakt en wat daarvoor wordt gerekend.',
            'Klachtenroute (eigen klachtenregeling en Kifid) genoemd.'
          ],
          dossier: [
            'Dienstverleningsinformatie of vergelijkingskaart met datum van verstrekking.',
            'Vastlegging van de provisie-informatie (afsluit- en doorlopende provisie) per polis, met datum.',
            'Opdrachtbevestiging met afbakening en nazorgafspraken.'
          ],
          valkuilen: [
            { t: 'Provisie alleen op verzoek noemen: voor polissen vanaf 1 juli 2024 moet je de hoogte actief melden.', kb: 'k240' },
            { t: 'Onduidelijk laten of je ook schademeldingen begeleidt; de klant verwacht dat je meldt en controleert.', kb: 'k221' }
          ],
          links: [
            ['Sjabloon: Bevestiging kennismakingsgesprek', 'sjablonen.html#km-bevestiging-gesprek'],
            ['Sjabloon: Opdrachtbevestiging', 'sjablonen.html#km-opdrachtbevestiging'],
            ['Kennisbank: adviseurskader schadeverzekeringen (k240)', 'index.html#artikel-k240'],
            ['Kennisbank: gedragscodes verzekeraars, alleen context (k254)', 'index.html#artikel-k254'],
            ['Kennisbank: provisieverbod en vergelijkingskaart (k61)', 'index.html#artikel-k61'],
            ['FAQ: provisie en actieve provisietransparantie (o.a. dfs-020, cpx-072)', 'index.html#faq']
          ]
        },
        {
          id: 'inventarisatie',
          titel: 'Inventarisatie: risico\'s, polissen en waarden',
          doel: 'Een volledig beeld van de risico\'s per levensgebied of bedrijfsonderdeel, van de bestaande polissen en van de te verzekeren waarden, met de bron van elke waarde.',
          afm: {
            bron: 'wet', ref: 'IDD: wensen en behoeften; art. 4:23 Wft bij advies',
            links: [
              ['AFM: Wensen en behoeften inventariseren', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/idd-bemiddelen-advies/inventarisatie-klantbehoeften'],
              ['AFM: Bemiddelen en advies (IDD)', 'https://www.afm.nl/nl-nl/sector/themas/belangrijke-europese-wet--en-regelgeving/idd/bemiddelen-en-advies---idd'],
              ['Wft (wetten.overheid.nl)', 'https://wetten.overheid.nl/BWBR0020368/']
            ],
            tekst: 'Bij schadeverzekeringen stel je de wensen en behoeften van de klant vast, zowel bij advies als bij bemiddeling zonder advies. Volgens de AFM mag je daarbij uitgaan van de informatie die de klant zelf geeft, en is dat inventariseren op zichzelf nog geen advies. Adviseer je wel, dan wint je volgens art. 4:23 Wft informatie in over de financiële positie, kennis en ervaring, doelstellingen en risicobereidheid, voor zover redelijkerwijs relevant voor het advies. Hoe het verzekerd bedrag wordt bepaald staat niet in de Wft; Kifid verwacht wel dat je de klant helpt het juiste bedrag te bepalen of op onderverzekering wijst (k108).'
          },
          check: [
            'Per levensgebied of bedrijfsonderdeel geïnventariseerd: wonen, aansprakelijkheid, mobiliteit, reizen, rechtsbijstand; zakelijk ook bedrijfsschade, AVB, beroepsaansprakelijkheid, cyber en verzuim.',
            'Bestaande polissen verzameld: verzekeraar, dekking, eigen risico, verzekerd bedrag, contractduur en premie.',
            'Herbouwwaarde bepaald met de methode van de verzekeraar, een taxatie of een eigen berekening; bron en datum vastgelegd.',
            'Inboedelwaarde bepaald met een lijst of de vragenlijst van de verzekeraar; kostbaarheden apart.',
            'Benoemd dat de Herbouwwaardemeter en de Inboedelwaarde-index van het Verbond na de editie 2025 niet meer verschijnen; geen oude meteruitkomst hergebruikt zonder controle.',
            'Bijzonderheden uitgevraagd: rieten dak, leegstand, verhuur, verbouwing, thuisbatterij of laadpaal, bedrijfsactiviteiten aan huis.',
            'Schadeverleden, eerdere opzeggingen door verzekeraars en relevante strafrechtelijke feiten besproken (aanvraagvragen).'
          ],
          dossier: [
            'Inventarisatie met wensen en behoeften, door de klant gecontroleerd.',
            'Overzicht bestaande polissen (polisbladen).',
            'Onderbouwing herbouwwaarde en inboedelwaarde met bron en datum.'
          ],
          valkuilen: [
            { t: 'Het verzekerd bedrag helemaal aan de klant overlaten zonder te waarschuwen voor onderverzekering.', kb: 'k108' },
            { t: 'Bij een thuiswerkende zzp-er niet vragen naar bedrijfsinventaris en voorraad; die valt vaak buiten de particuliere inboedel.', kb: 'k241' }
          ],
          links: [
            ['Scan schadeverzekeringen', 'scan-schadeverzekeringen.html'],
            ['Scan bedrijfsverzekeringen', 'scan-bedrijfsverzekeringen.html'],
            ['Herbouwwaarde en onderverzekering', 'herbouwwaarde.html'],
            ['Rekenhulp: Inboedelwaarde (puntenmodel)', 'rekentools.html#inboedel-puntenmodel'],
            ['Inventarisatieformulier', 'inventarisatie.html'],
            ['Kennisbank: woonhuis en inboedel (k241)', 'index.html#artikel-k241'],
            ['Kennisbank: zakelijke risico\'s (k248)', 'index.html#artikel-k248'],
            ['Kennisbank: opstal bij de woning (k88)', 'index.html#artikel-k88']
          ]
        },
        {
          id: 'risicoanalyse',
          titel: 'Risicoanalyse en prioriteren',
          doel: 'Per risico de kans en de financiële impact inschatten, bepalen wat de klant zelf kan dragen en vaststellen wat eerst geregeld moet worden.',
          afm: {
            bron: 'wet', ref: 'art. 4:23 Wft (passend advies); art. 4:24a Wft (zorgplicht)',
            links: [
              ['AFM: Hoe voldoe ik aan de zorgplicht?', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/adv-bem-bedrijfsvoering/zorgplicht-voldoen'],
              ['Wft (wetten.overheid.nl)', 'https://wetten.overheid.nl/BWBR0020368/']
            ],
            tekst: 'De Wft schrijft geen vaste risicoanalyse voor schadeverzekeringen voor. Wel moet een advies passen bij de informatie die je hebt ingewonnen (art. 4:23 Wft) en houd je zorgvuldig rekening met de rechtmatige belangen van de klant (art. 4:24a Wft). In de praktijk toets je per risico of de klant de schade zelf kan dragen en waarschuw je voor wat niet verzekerd is of niet verzekerbaar is, zoals overstroming door primaire waterkeringen. Kifid kijkt naar wat een redelijk bekwaam en redelijk handelend adviseur had gedaan.'
          },
          check: [
            'Per risico ingeschat: kans, maximale schade en of de klant die uit eigen middelen kan betalen.',
            'Aansprakelijkheid en grote vermogensrisico\'s (AVP, AVB, brand) voor kleine risico\'s geprioriteerd.',
            'Onverzekerbare of meestal uitgesloten risico\'s benoemd: overstroming primaire keringen, funderingsschade, slijtage.',
            'Dubbele dekkingen en samenloop gesignaleerd (bijv. reis en zorgverzekering, rechtsbijstand via vakbond).',
            'Zakelijk: continuïteitsrisico\'s besproken (bedrijfsschade, cyber, verzuim, beroepsaansprakelijkheid).',
            'Prioriteitenlijst met de klant besproken en de keuze van de klant vastgelegd.'
          ],
          dossier: [
            'Risicoanalyse per levensgebied of bedrijfsonderdeel met prioriteit.',
            'Vastlegging van bewust niet verzekerde risico\'s en de motivatie van de klant.'
          ],
          valkuilen: [
            { t: 'Klimaatrisico\'s niet noemen: de klant gaat ervan uit dat water altijd gedekt is.', kb: 'k251' },
            { t: 'Bij een ondernemer alleen naar de particuliere polissen kijken en de zakelijke aansprakelijkheid missen.', kb: 'k248' }
          ],
          links: [
            ['Scan schadeverzekeringen', 'scan-schadeverzekeringen.html'],
            ['Scan bedrijfsverzekeringen', 'scan-bedrijfsverzekeringen.html'],
            ['Scan autoverzekering', 'scan-autoverzekering.html'],
            ['Kennisbank: AVP (k242)', 'index.html#artikel-k242'],
            ['Kennisbank: cyberverzekering mkb (k249)', 'index.html#artikel-k249'],
            ['Kennisbank: verzuim en WGA-eigenrisicodragerschap (k250)', 'index.html#artikel-k250'],
            ['Kennisbank: klimaat en natuurrampen (k251)', 'index.html#artikel-k251'],
            ['Kennisbank: Kifid over waterschade (k220)', 'index.html#artikel-k220']
          ]
        },
        {
          id: 'productkeuze',
          titel: 'Advies en productkeuze',
          doel: 'Een passende dekking per risico: soort dekking, verzekerd bedrag, eigen risico, garantie tegen onderverzekering en de uitsluitingen die voor deze klant tellen; uitgelegd en vastgelegd.',
          afm: {
            bron: 'wet', ref: 'art. 4:23 en 4:20 Wft; IPID; art. 7:928 en 7:959 BW',
            links: [
              ['AFM: Standaardinformatiedocument IPID', 'https://www.afm.nl/nl-nl/sector/themas/europese-wet--en-regelgeving/idd/standaardinformatiedocument-ipid---idd'],
              ['AFM: Informatieverstrekking bij verzekeringen', 'https://www.afm.nl/nl-nl/sector/themas/dienstverlening-aan-consumenten/informatieverstrekking/verzekeringen'],
              ['BW Boek 7 (wetten.overheid.nl)', 'https://wetten.overheid.nl/BWBR0005290/']
            ],
            tekst: 'Vóór het sluiten geef je de klant de informatie die redelijkerwijs relevant is om het product te beoordelen (art. 4:20 Wft). Wie direct klantcontact heeft, verstrekt vóór het sluiten kosteloos het IPID, aan particuliere en zakelijke klanten (behalve bij grote risico\'s); daarin staan onder meer de dekking, de belangrijkste uitsluitingen, de verplichtingen en de opzegging. Een advies past bij de ingewonnen informatie (art. 4:23 Wft). Uit het BW komen twee punten die je in het advies uitlegt: de mededelingsplicht vóór het sluiten (art. 7:928 BW, met de gevolgen in art. 7:929 en 7:930) en de evenredigheidsregel bij onderverzekering (art. 7:959 BW), tenzij de polis een garantie tegen onderverzekering heeft.'
          },
          check: [
            'Per risico de geadviseerde dekking onderbouwd: uitgebreid of all-risk, nieuwwaarde of dagwaarde, maxima voor kostbaarheden.',
            'Eigen risico besproken in verhouding tot de premie en de buffer van de klant.',
            'Garantie tegen onderverzekering: voorwaarden genoemd (waardemeter of taxatie van de verzekeraar, melden bij verbouwing).',
            'Relevante uitsluitingen schriftelijk uitgelegd (overstroming, opzet, slijtage, bedrijfsactiviteiten, motorrijtuigen).',
            'Mededelingsplicht van art. 7:928 BW uitgelegd: welke feiten de klant moet melden en wat de gevolgen zijn als dat niet gebeurt.',
            'IPID per product verstrekt; bij zakelijke klanten ook de polisvoorwaarden van de belangrijkste dekkingen.',
            'Contractduur en verlenging besproken (context: Gedragscode geïnformeerde verlenging van verzekeraars, k254).',
            'Afwijken van het advies vastgelegd en door de klant bevestigd.'
          ],
          dossier: [
            'Adviesrapport of adviesmail met onderbouwing per dekking.',
            'Verstrekte IPID\'s met datum.',
            'Vergelijking oude en nieuwe dekking bij overstap.',
            'Afwijkend-adviesverklaring of bevestiging dat de klant een risico niet verzekert.'
          ],
          valkuilen: [
            { t: 'Overstappen op premie zonder de voorwaarden te vergelijken; een smallere dekking is een tekortkoming in het advies.', kb: 'k240' },
            { t: 'Klant kiest een lager verzekerd bedrag zonder schriftelijke waarschuwing voor de evenredigheidsregel.', kb: 'k108' },
            { t: 'Bij aansprakelijkheid, auto of reis de grenzen van de dekking niet benoemen.', kb: 'k223' }
          ],
          links: [
            ['Herbouwwaarde en onderverzekering', 'herbouwwaarde.html'],
            ['Afwijkend advies', 'afwijkend-advies.html'],
            ['Sjabloon: Afwijkend advies', 'sjablonen.html#adv-afwijkend'],
            ['Sjabloon: Klant ziet af van verzekering', 'sjablonen.html#adv-geen-verzekering'],
            ['Kennisbank: rechtsbijstand (k243)', 'index.html#artikel-k243'],
            ['Kennisbank: auto en mobiliteit (k244)', 'index.html#artikel-k244'],
            ['Kennisbank: reisverzekering (k245)', 'index.html#artikel-k245'],
            ['Kennisbank: uitvaartverzekering (k246)', 'index.html#artikel-k246'],
            ['Kennisbank: zorgverzekering (k247)', 'index.html#artikel-k247']
          ]
        },
        {
          id: 'aanvraag',
          titel: 'Aanvraag en acceptatie',
          doel: 'Een juist ingevulde aanvraag die de klant zelf beantwoordt, en controle dat de polis aansluit op het advies en de dekking ingaat.',
          afm: {
            bron: 'wet', ref: 'art. 7:928-7:930 BW; art. 4:24a Wft',
            links: [
              ['BW Boek 7 (wetten.overheid.nl)', 'https://wetten.overheid.nl/BWBR0005290/'],
              ['AFM: Hoe voldoe ik aan de zorgplicht?', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/adv-bem-bedrijfsvoering/zorgplicht-voldoen']
            ],
            tekst: 'Voor de aanvraag zelf heeft de AFM geen specifieke norm; het kader is het BW. De klant meldt vóór het sluiten de feiten die hij kent of behoort te kennen en waarvan hij weet of moet begrijpen dat ze voor de verzekeraar van belang zijn (art. 7:928 BW). Werkt de verzekeraar met een vragenlijst, dan kan hij zich in beginsel niet beroepen op feiten waarnaar niet is gevraagd, behalve bij opzet tot misleiding. Bij schending kan de verzekeraar de uitkering beperken of weigeren en de verzekering opzeggen (art. 7:929 en 7:930 BW). Jouw rol volgt uit de zorgplicht: laat de klant zelf antwoorden en neem niets weg.'
          },
          check: [
            'Klant beantwoordt de aanvraagvragen zelf; bij samen invullen letterlijk voorgelezen.',
            'Gewezen op melden van schadeverleden, opzeggingen, strafrechtelijk verleden, leegstand en verhuur, voor zover gevraagd.',
            'Klant heeft de ingevulde aanvraag gecontroleerd en bevestigd.',
            'Ingangsdatum en eventuele voorlopige dekking geregeld; geen gat tussen oude en nieuwe polis.',
            'Bij acceptatie onder voorwaarden (clausule, premieopslag, beveiligingseis) de klant geïnformeerd.',
            'Polis gecontroleerd tegen het advies: dekking, bedragen, eigen risico, clausules.',
            'Oude polis tijdig en correct opgezegd.'
          ],
          dossier: [
            'Kopie van de aanvraag met de antwoorden van de klant.',
            'Acceptatiebericht en polisblad, met controle tegen het advies.',
            'Bewijs van opzegging oude polis.'
          ],
          valkuilen: [
            { t: 'Antwoorden voor de klant invullen of adviseren iets weg te laten; dat kan de dekking kosten en jou aansprakelijk maken.', kb: 'k109' },
            { t: 'Eerdere opzegging of fraude-registratie niet uitvragen; de verzekeraar ziet die vaak wel.', kb: 'k222' }
          ],
          links: [
            ['Kennisbank: mededelingsplicht (k109)', 'index.html#artikel-k109'],
            ['Kennisbank: fraude en incidentenregister (k252)', 'index.html#artikel-k252'],
            ['Kennisbank: Kifid over fraude en opzegging (k222)', 'index.html#artikel-k222'],
            ['Kennisbank: medische acceptatie (k255)', 'index.html#artikel-k255'],
            ['FAQ: mededelingsplicht (doe-069)', 'index.html#faq']
          ]
        },
        {
          id: 'nazorg',
          titel: 'Nazorg: jaarlijkse check, indexatie, schade en wijzigingen',
          doel: 'De dekking blijft passend, verzekerde bedragen blijven actueel, schades worden goed gemeld en begeleid, en wijzigingen worden op tijd doorgegeven.',
          afm: {
            bron: 'wet', ref: 'art. 4:24a Wft; AFM over nazorg en serviceabonnementen',
            links: [
              ['AFM: Nazorg', 'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/nazorg'],
              ['AFM: Hoe voldoe ik aan de zorgplicht?', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/adv-bem-bedrijfsvoering/zorgplicht-voldoen']
            ],
            tekst: 'De zorgplicht van art. 4:24a Wft geldt gedurende de looptijd van het product. De AFM vraagt duidelijke afspraken over wat je in de beheerfase wel en niet doet. Bied je een serviceabonnement aan, dan verwacht de AFM dat de klant weet wat hij wel en niet krijgt en wat het kost, bij voorkeur ook schriftelijk, en is uitdrukkelijke instemming nodig. Een vergoeding voor nazorg, via doorlopende provisie of abonnement, hoort in verhouding te staan tot het werk. Premie-indexatie en verlenging regelt de verzekeraar; de Gedragscode geïnformeerde verlenging (k254) bindt de verzekeraar, niet jou.'
          },
          check: [
            'Jaarlijkse check gepland: gezinssituatie, woning, verbouwing, grote aankopen, auto, bedrijfsactiviteiten.',
            'Verzekerde bedragen en garantie tegen onderverzekering gecontroleerd na verbouwing of uitbreiding.',
            'Premie-indexatie en premiewijzigingen beoordeeld; bij grote stijging alternatieven besproken.',
            'Schademelding: ontvangst vastgelegd, binnen afgesproken termijn doorgemeld, bevestiging van de verzekeraar bewaard.',
            'Bij schade de melding inhoudelijk gelezen en de klant direct gewezen op dekkingsrisico\'s.',
            'Wijzigingsverzoeken (winterstop, dekking omlaag) met opties per e-mail bevestigd, inclusief wat niet meer gedekt is.',
            'Zakelijk: jaarlijks omzet, loonsom, activiteiten en personeel geactualiseerd voor de premiegrondslag.'
          ],
          dossier: [
            'Verslagen van jaarlijkse checks en uitnodigingen.',
            'Schadedossier: melding, doormelding, correspondentie en afloop.',
            'Bevestigingen van wijzigingen met de besproken opties.'
          ],
          valkuilen: [
            { t: 'Een schademelding bevestigen en daarna niet doormelden aan de verzekeraar.', kb: 'k221' },
            { t: 'Nazorg beloven en niet uitvoeren, of niet actief wijzen op betere voorwaarden.', kb: 'k106' },
            { t: 'Bij letselschade de klant niet wijzen op de rechten uit de Gedragscode Behandeling Letselschade.', kb: 'k253' }
          ],
          links: [
            ['Jaarlijkse nazorgscan', 'scan-nazorg-jaarlijks.html'],
            ['Periodieke nazorgcheck', 'nazorg-check.html'],
            ['Wijziging doorgeven (klantformulier)', 'wijziging-doorgeven.html'],
            ['Sjabloon: Jaarlijkse nazorg', 'sjablonen.html#nz-jaarlijks'],
            ['Sjabloon: Herinnering wijzigingen doorgeven', 'sjablonen.html#nz-wijziging-doorgeven'],
            ['Kennisbank: Kifid over schademelding en polisbeheer (k221)', 'index.html#artikel-k221'],
            ['Kennisbank: klachtbehandeling en Kifid (k62)', 'index.html#artikel-k62'],
            ['Levensgebeurtenis: Verbouwen', 'levensgebeurtenissen.html#verbouwen'],
            ['Levensgebeurtenis: Verhuizen', 'levensgebeurtenissen.html#verhuizen']
          ]
        }
      ]
    },

    /* ======================================================================
       ROUTE 6: CONSUMPTIEF KREDIET
       AFM-blokken met bron 'wet': eigen samenvatting van Wft/BGfo/BW, AFM-, VFN- en BKR-pagina's
       (peildatum 3 oktober 2026). CCD2 geldt vanaf 20 november 2026; de Nederlandse
       implementatiewet (36.924) was op de peildatum nog niet aangenomen (zie k121).
       ====================================================================== */
    {
      id: 'krediet',
      naam: 'Consumptief krediet',
      kort: 'Krediet',
      intro: 'Bemiddeling in en advies over doorlopend krediet, persoonlijke lening en vergelijkbare vormen. De kredietgever toetst de kredietwaardigheid en beslist; jij zorgt voor juiste informatie, een passende keuze en een eerlijk beeld van de kosten. Vanaf 20 november 2026 gaat de herziene consumentenkredietrichtlijn (CCD2) gelden; de Nederlandse invulling kan nog wijzigen.',
      stappen: [
        {
          id: 'kennismaking',
          titel: 'Kennismaking, rol en beloning',
          doel: 'De klant weet of je adviseert of alleen bemiddelt, hoe je wordt beloond en dat de kredietgever beslist; en jij weet waarvoor het krediet nodig is.',
          afm: {
            bron: 'wet', ref: 'art. 4:20 Wft; BGfo (beloning kredietbemiddelaar); CCD2',
            links: [
              ['AFM: Directe beloning', 'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/beloning/directe-beloning'],
              ['AFM: Herziene richtlijn consumentenkrediet (CCDII)', 'https://www.afm.nl/nl-nl/sector/kredietaanbieders/4-herziene-richtlijn-consumentenkrediet-ccdii']
            ],
            tekst: 'Bij consumptief krediet mag je de klant geen directe vergoeding rekenen. Je wordt beloond door de kredietgever met een doorlopende provisie per maand, op basis van het uitstaande saldo aan het eind van de maand; bij een betalingsachterstand van meer dan twee maanden vervalt die aanspraak (volgens de AFM art. 155 en 156 BGfo). Vóór de dienstverlening informeer je over je dienstverlening (art. 4:20 Wft). Onder CCD2 (vanaf 20 november 2026) moet een bemiddelaar de klant per transactie uitdrukkelijk laten weten of hij wel of geen advies geeft of kan geven.'
          },
          check: [
            'Rol uitgelegd: jij bemiddelt en/of adviseert, de kredietgever toetst en beslist.',
            'Per transactie vastgelegd of je adviseert of alleen bemiddelt (CCD2-eis vanaf 20 november 2026).',
            'Beloning uitgelegd: geen rekening aan de klant, wel provisie van de kredietgever die in de kredietkosten zit.',
            'Doel van het krediet besproken (auto, verbouwing, oversluiten, aanvulling inkomen) en of lenen hiervoor verstandig is.',
            'Signalen van betalingsproblemen of een dringende geldbehoefte opgemerkt en besproken.'
          ],
          dossier: [
            'Dienstverleningsinformatie met de vermelding advies of geen advies, en datum.',
            'Gespreksverslag met kredietdoel en kredietbehoefte.'
          ],
          valkuilen: [
            { t: 'De klant laten denken dat bemiddeling gratis is; de beloning zit in de kredietkosten.', kb: 'k212' },
            { t: 'Na 20 november 2026 niet per transactie vastleggen of je adviseert.', kb: 'k121' }
          ],
          links: [
            ['Gespreksverslag', 'gespreksverslag.html'],
            ['Sjabloon: Bevestiging kennismakingsgesprek', 'sjablonen.html#km-bevestiging-gesprek'],
            ['Kennisbank: CCD2 voor kredietbemiddelaars (k121)', 'index.html#artikel-k121'],
            ['Kennisbank: CCD2, achteraf betalen en beloning (k212)', 'index.html#artikel-k212'],
            ['FAQ: krediet en vermogen (o.a. dfs-023 over CCD2)', 'index.html#faq']
          ]
        },
        {
          id: 'kredietwaardigheid',
          titel: 'Informatie en kredietwaardigheidstoets',
          doel: 'Een juist beeld van inkomen, vaste lasten en alle lopende verplichtingen, zodat de kredietgever verantwoord kan toetsen en jij kunt beoordelen of het krediet betaalbaar is.',
          afm: {
            bron: 'wet', ref: 'art. 4:32 en 4:34 Wft; art. 114 BGfo; VFN-leennormen; CCD2',
            links: [
              ['AFM: Wet- en regelgeving kredietaanbieders', 'https://www.afm.nl/nl-nl/sector/kredietaanbieders/wet--en-regelgeving'],
              ['VFN: Leennormenmethodiek per 17 november 2025', 'https://www.vfn.nl/wp-content/uploads/2025/11/VFN_20251100_Leennormenmethodiek-CK-per-17-november-2025_Definitief.pdf'],
              ['AFM: Herziene richtlijn consumentenkrediet (CCDII)', 'https://www.afm.nl/nl-nl/sector/kredietaanbieders/4-herziene-richtlijn-consumentenkrediet-ccdii']
            ],
            tekst: 'De kredietgever wint vóór het sluiten informatie in over de financiële positie en beoordeelt of het krediet verantwoord is; is het onverantwoord met het oog op overkreditering, dan sluit hij het niet (art. 4:34 Wft). De kredietgever moet aangesloten zijn bij een stelsel van kredietregistratie (art. 4:32 Wft) en raadpleegt het BKR vóór verstrekking of verhoging (art. 114 BGfo, nu vanaf € 250). De AFM ziet de VFN-leennormen als een minimale invulling van die open norm: op basis van een inkomsten-uitgavenanalyse moet de afloscapaciteit minstens gelijk zijn aan de normmaandlast; de methodiek per 17 november 2025 is de actuele. Met CCD2 (vanaf 20 november 2026) komen aanvullende eisen in art. 4:34a Wft, worden de drempels voor verificatie en BKR-raadpleging aangescherpt en heeft de consument bij een geautomatiseerde beoordeling recht op menselijke tussenkomst.'
          },
          check: [
            'Inkomen geverifieerd (loonstrook, werkgeversverklaring of jaarcijfers) en de duurzaamheid ervan beoordeeld.',
            'Woonlasten en huishoudsamenstelling vastgesteld (bepalen de leennorm).',
            'BKR-overzicht met de klant doorgenomen; codering, status en verschillen met de opgave besproken.',
            'Uitdrukkelijk gevraagd naar recent aangevraagde of afgesloten kredieten, achteraf-betaalschulden, private lease en leningen bij familie.',
            'Indicatieve leenruimte berekend volgens de actuele VFN-methodiek en vergeleken met wat de klant wil lenen.',
            'Besproken dat de kredietgever de definitieve toets doet en kan afwijzen.'
          ],
          dossier: [
            'Inkomensbewijzen en overzicht vaste lasten.',
            'BKR-overzicht (of uitkomst toets) met datum.',
            'Opgave van de klant over overige verplichtingen, met zijn bevestiging.',
            'Indicatieve leencapaciteitsberekening met datum en gebruikte normversie.'
          ],
          valkuilen: [
            { t: 'Alleen op de BKR-toets vertrouwen: recent afgesloten leningen en achteraf betalen staan er (nog) niet altijd in.', kb: 'k229' },
            { t: 'Een negatieve BKR-registratie niet bespreken of verwachten dat die makkelijk verwijderd wordt.', kb: 'k230' }
          ],
          links: [
            ['Rekenhulp: Maximaal consumptief krediet', 'rekentools.html#maximaal-krediet'],
            ['Inventarisatieformulier', 'inventarisatie.html'],
            ['Documentenchecklist', 'documentenchecklist.html'],
            ['Kennisbank: VFN-leennormen november 2025 (k187)', 'index.html#artikel-k187'],
            ['Kennisbank: Kifid over kredietwaardigheid (k229)', 'index.html#artikel-k229'],
            ['Kennisbank: BKR-registraties verwijderen (k230)', 'index.html#artikel-k230'],
            ['Kennisbank: BKR en hypotheek (k93)', 'index.html#artikel-k93'],
            ['FAQ: BKR en kredietwaardigheidstoets (o.a. kvx-001, cpx-044)', 'index.html#faq']
          ]
        },
        {
          id: 'productkeuze',
          titel: 'Productkeuze: doorlopend krediet, persoonlijke lening, achteraf betalen of private lease',
          doel: 'De kredietvorm die past bij het doel, de looptijd en het gedrag van de klant, met een eerlijk beeld van de totale kosten.',
          afm: {
            bron: 'wet', ref: 'art. 4:20 Wft; CCD2 (achteraf betalen); private lease buiten de Wft',
            links: [
              ['AFM: Achteraf betalen', 'https://www.afm.nl/nl-nl/consumenten/themas/lenen/achteraf-betalen'],
              ['AFM: Soorten leningen', 'https://www.afm.nl/nl-nl/consumenten/themas/lenen/soorten'],
              ['BKR: Nieuwe regelgeving en private autolease', 'https://www.bkr.nl/nl/inzichtelijk/nieuwe-regelgeving-zet-registratie-private-autolease-onder-druk']
            ],
            tekst: 'De klant krijgt vóór het sluiten de informatie die relevant is om het product te beoordelen (art. 4:20 Wft), zoals het jaarlijkse kostenpercentage en de totale kosten. Achteraf betalen (buy now, pay later) valt volgens de AFM vanaf 20 november 2026 onder de Wft en het AFM-toezicht. Private lease valt nu buiten de Wft; de sector werkt met een eigen keurmerk en een vrijwillige BKR-registratie. Volgens BKR overweegt het ministerie private lease zonder koopoptie bij de implementatie van CCD2 als krediet aan te merken; dat is op de peildatum niet definitief.'
          },
          check: [
            'Kredietdoel gekoppeld aan de looptijd: een kortlevend goed niet langer financieren dan het meegaat.',
            'Doorlopend krediet tegenover persoonlijke lening besproken: vaste of variabele rente, opneembaarheid, aflosduur bij een maandtermijn als percentage van de limiet.',
            'Totale kosten en jaarlijks kostenpercentage van de alternatieven naast elkaar gezet.',
            'Achteraf betalen en private lease besproken als ook die in beeld zijn, met de gevolgen voor latere leenruimte (bijv. hypotheek).',
            'Oversluiten: vergoeding bij vervroegd aflossen en de looptijd van het nieuwe krediet vergeleken.',
            'Gevolgen voor een toekomstige hypotheekaanvraag benoemd.'
          ],
          dossier: [
            'Vergelijking van de besproken kredietvormen met kosten en looptijd.',
            'Motivatie van de gekozen vorm.'
          ],
          valkuilen: [
            { t: 'Een doorlopend krediet adviseren voor een eenmalige aankoop; de aflosduur en kosten lopen dan vaak op.', kb: 'k229' },
            { t: 'Achteraf betalen of private lease niet meewegen bij een latere hypotheek.', kb: 'k212' }
          ],
          links: [
            ['Rekenhulp: Totale kosten van een krediet', 'rekentools.html#kosten-krediet'],
            ['Rekenhulp: Doorlopend krediet doorrekenen', 'rekentools.html#doorlopend-krediet'],
            ['Rekenhulp: Persoonlijke leningen vergelijken', 'rekentools.html#leningen-vergelijken'],
            ['Rekenhulp: Maandbedrag bij kostenpercentage', 'rekentools.html#lening-maandbedrag-jkp'],
            ['Rekenhulp: Welke rente zit in een leasecontract', 'rekentools.html#rente-lease'],
            ['Rekenhulp: Restschuld financial lease', 'rekentools.html#restschuld-lease'],
            ['FAQ: private lease en achteraf betalen (o.a. hnx-151, hnx-154, kvx-013)', 'index.html#faq']
          ]
        },
        {
          id: 'advies',
          titel: 'Advies of execution only',
          doel: 'Duidelijk vastleggen of de klant een advies krijgt of zelf kiest, en in beide gevallen een kredietaanvraag die past bij de toets.',
          afm: {
            bron: 'wet', ref: 'art. 4:23 Wft; art. 4:24 Wft jo. art. 80e BGfo; CCD2',
            links: [
              ['AFM: Wanneer is een kennis- en ervaringstoets verplicht?', 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/kennis-ervaring-toets/wanneer-kennis-ervaringtoets'],
              ['AFM: Herziene richtlijn consumentenkrediet (CCDII)', 'https://www.afm.nl/nl-nl/sector/kredietaanbieders/4-herziene-richtlijn-consumentenkrediet-ccdii']
            ],
            tekst: 'Adviseer je, dan win je informatie in over financiële positie, kennis en ervaring, doelstellingen en risicobereidheid en baseer je het advies daarop (art. 4:23 Wft). De wettelijke kennis- en ervaringstoets bij execution only (art. 4:24 Wft met art. 80e BGfo) geldt volgens de AFM voor hypotheken, individuele AOV, betalingsbeschermers en complexe producten; consumptief krediet staat niet in dat rijtje. Ook zonder advies blijft de kredietgever gebonden aan de kredietwaardigheidstoets. Onder CCD2 maak je per transactie uitdrukkelijk duidelijk of je adviseert.'
          },
          check: [
            'Gekozen dienstverlening vastgelegd: advies of execution only.',
            'Bij advies: adviesrapport of adviesmail met de onderbouwing van bedrag, vorm en looptijd.',
            'Bij execution only: vastgelegd dat de klant zelf kiest en dat je niet adviseert, en dat de kredietgever toetst.',
            'Bij twijfel over betaalbaarheid: de klant gewaarschuwd, ook bij execution only.',
            'Afwijken van het advies vastgelegd en door de klant bevestigd.'
          ],
          dossier: [
            'Adviesrapport of vastlegging execution only met datum.',
            'Eventuele waarschuwing en reactie van de klant.'
          ],
          valkuilen: [
            { t: 'Execution only aanbieden zonder heldere schriftelijke afspraak dat je niet adviseert.', kb: 'k110' }
          ],
          links: [
            ['Afwijkend advies', 'afwijkend-advies.html'],
            ['Sjabloon: Afwijkend advies', 'sjablonen.html#adv-afwijkend'],
            ['Sjabloon: Adviesrapport toesturen', 'sjablonen.html#adv-rapport'],
            ['Kennisbank: execution only en afwijken van advies (k110)', 'index.html#artikel-k110'],
            ['FAQ: passend advies over consumptief krediet (cpx-045, cpx-046)', 'index.html#faq']
          ]
        },
        {
          id: 'herroeping',
          titel: 'Aanvraag, aanvaarding en herroeping',
          doel: 'Een aanvraag die klopt, een aanbod dat de klant bewust aanvaardt, en een klant die weet dat hij binnen veertien dagen kan herroepen.',
          afm: {
            bron: 'wet', ref: 'art. 7:66 BW; CCD2 (aanvaarding)',
            links: [
              ['BW Boek 7 (wetten.overheid.nl)', 'https://wetten.overheid.nl/BWBR0005290/'],
              ['AFM: Herziene richtlijn consumentenkrediet (CCDII)', 'https://www.afm.nl/nl-nl/sector/kredietaanbieders/4-herziene-richtlijn-consumentenkrediet-ccdii']
            ],
            tekst: 'De consument kan de kredietovereenkomst zonder opgave van redenen herroepen binnen veertien kalenderdagen na het sluiten, of na ontvangst van de contractvoorwaarden en de verplichte informatie als dat later is (art. 7:66 BW). De termijn is gehaald als de herroeping vóór het einde schriftelijk of op een andere duurzame drager is verstuurd. Daarna betaalt hij het opgenomen bedrag met de rente over de opnameperiode terug, uiterlijk binnen dertig kalenderdagen. Onder CCD2 moet een kredietaanbod ondubbelzinnig worden aanvaard; stilzwijgen geldt niet als aanvaarding (k121).'
          },
          check: [
            'Aanvraag met de klant doorgenomen; gegevens kloppen met de bewijsstukken.',
            'Aanbod uitgelegd: kredietbedrag, looptijd, rente (vast of variabel), jaarlijks kostenpercentage, totale kosten.',
            'Herroepingsrecht van veertien kalenderdagen en de terugbetaling binnen dertig dagen uitgelegd.',
            'Klant heeft het aanbod zelf en actief aanvaard.',
            'Bij oversluiten: aflossing van het oude krediet gecontroleerd en BKR-afmelding nagegaan.'
          ],
          dossier: [
            'Kopie aanvraag, aanbod en getekende overeenkomst met data.',
            'Vastlegging dat het herroepingsrecht is toegelicht.',
            'Aflosbevestiging oude krediet bij oversluiten.'
          ],
          valkuilen: [
            { t: 'Een oud krediet bij oversluiten niet laten afmelden, waardoor het dubbel meetelt in latere toetsen.', kb: 'k229' }
          ],
          links: [
            ['FAQ: herroepingsrecht bij consumptief krediet (kvx-022)', 'index.html#faq'],
            ['Rekenhulp: Extra aflossen op een lening', 'rekentools.html#extra-aflossen-lening'],
            ['Kennisbank: CCD2 voor kredietbemiddelaars (k121)', 'index.html#artikel-k121']
          ]
        },
        {
          id: 'nazorg',
          titel: 'Nazorg: periodieke toets, betalingsproblemen en schuldhulp',
          doel: 'Tijdens de looptijd blijft het krediet passend; bij betalingsproblemen wordt vroeg gehandeld en de klant zo nodig doorverwezen naar schuldhulp.',
          afm: {
            bron: 'wet', ref: 'VFN-gedragscode (doorlopend krediet); BGfo (beloning bij achterstand); AFM over achterstandsbeheer',
            links: [
              ['VFN: Gedragscode Consumptief Krediet per 1 mei 2026', 'https://www.vfn.nl/wp-content/uploads/2026/04/VFN_VFN-Gedragscode-Consumptief-Krediet-per-1-mei-2026.pdf'],
              ['AFM: Omgang met klanten bij betalingsproblemen', 'https://www.afm.nl/nl-nl/sector/actueel/2021/november/onderzoek-achterstandsbeheer-aanbieders-krediet'],
              ['AFM: Directe beloning', 'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/beloning/directe-beloning']
            ],
            tekst: 'Volgens de VFN-gedragscode toetst de kredietgever tijdens de looptijd van een doorlopend krediet regelmatig of het uitstaande krediet nog past bij de financiële situatie, en zoekt hij zo nodig met de klant naar een oplossing; doorlopende kredieten met een uitstaand saldo vanaf € 10.000 worden ten minste eens per 60 maanden geactualiseerd. De AFM verwacht van kredietaanbieders dat zij bij betalingsproblemen eerst samen met de klant een oplossing zoeken voordat een incassobureau wordt ingeschakeld, en dat medewerkers kunnen doorverwijzen naar budgethulp en schuldhulpverlening. Voor de bemiddelaar vervalt de aanspraak op provisie bij een achterstand van meer dan twee maanden.'
          },
          check: [
            'Nazorgafspraak gemaakt: wanneer kijk je samen naar het krediet (bijv. bij de jaarlijkse check of een levensgebeurtenis).',
            'Bij doorlopend krediet: besproken of de limiet omlaag kan of het krediet kan worden omgezet of afgelost.',
            'Oude doorlopende kredieten met variabele rente gesignaleerd voor een mogelijke compensatieregeling.',
            'Bij betalingsachterstand: klant aangespoord direct contact op te nemen met de kredietgever voor een regeling.',
            'Bij meerdere schulden of problemen: doorverwezen naar de gemeentelijke schuldhulpverlening en dat vastgelegd.',
            'Geen nieuw krediet bemiddeld om achterstanden af te lossen zonder volledige toets van de situatie.'
          ],
          dossier: [
            'Verslag van nazorgcontacten.',
            'Vastlegging van gesignaleerde betalingsproblemen, het advies en een eventuele doorverwijzing.'
          ],
          valkuilen: [
            { t: 'Een klant met achterstanden een extra krediet laten aanvragen in plaats van door te verwijzen.', kb: 'k229' },
            { t: 'Klant met een oude BKR-codering geen route bieden om verwijdering aan te vragen.', kb: 'k230' }
          ],
          links: [
            ['Periodieke nazorgcheck', 'nazorg-check.html'],
            ['Rekenhulp: Extra aflossen op een lening', 'rekentools.html#extra-aflossen-lening'],
            ['Rekenhulp: Doorlopend krediet doorrekenen', 'rekentools.html#doorlopend-krediet'],
            ['Levensgebeurtenis: Baanverlies', 'levensgebeurtenissen.html#werkloos'],
            ['Levensgebeurtenis: Scheiding', 'levensgebeurtenissen.html#scheiding'],
            ['FAQ: schuldhulp en betalingsproblemen (kvx-042, kvx-043, psx-175)', 'index.html#faq'],
            ['Kennisbank: VFN-leennormen (k187)', 'index.html#artikel-k187']
          ]
        }
      ]
    }
  ]
};
