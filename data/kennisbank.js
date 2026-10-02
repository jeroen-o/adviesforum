/* KENNISBANK van het Adviesforum
 *
 * Elk artikel is één blok tussen { en }. Velden:
 *   id            uniek, bijv. 'k13' (niet wijzigen na publicatie: links verwijzen ernaar)
 *   cat           categorie: hyp, verz, pens, fisc, adv, crm, comp, ov
 *   titel         titel van het artikel
 *   auteur        id van een adviseur uit data/adviseurs.js
 *   datum         publicatiedatum (JJJJ-MM-DDTuu:mm:ss)
 *   bijgewerkt    (optioneel) datum van de laatste inhoudelijke wijziging
 *   peildatum     (optioneel) datum waarop de inhoud gebaseerd is, bijv. '2026-01-01' voor normen 2026
 *   herzienVoor   datum waarvoor het artikel opnieuw gecontroleerd moet zijn; daarna toont het forum "mogelijk verouderd"
 *   bron          (optioneel) id van de forumvraag waaruit het artikel komt, anders null
 *   gecontroleerd true ALLEEN na goedkeuring door compliance (via een review van de pull request op GitHub)
 *   gecontroleerdOp (optioneel) datum van die goedkeuring
 *   kw            (optioneel) extra trefwoorden voor de zoekfunctie en het automatische antwoord
 *   links         (optioneel) lijst met {titel, url}
 *   body          de tekst tussen backticks. Opmaak: '## ' kop, '- ' opsomming, '1. ' genummerd, lege regel = nieuwe alinea.
 *
 * Wijzigen: bewerk dit bestand op GitHub en kies "Create a new branch ... and start a pull request".
 * Compliance keurt goed via de review; pas daarna mergen. Zie BEHEER.md.
 */
window.KENNISBANK=[
 {id:'k1',herzienVoor:'2027-09-26',cat:'crm',titel:'Dubbel klantdossier samenvoegen in het CRM',auteur:'u6',datum:'2026-09-26T09:00:00',bron:'v3',gecontroleerd:true,
  body:`Controleer eerst in beide dossiers welke documenten, notities en taken erin staan en bepaal welk dossier leidend is: meestal het oudste, met het klantnummer dat de klant kent.

Gebruik daarna de samenvoegfunctie voor relaties. Documenten en notities van het brondossier worden overgenomen; dubbele NAW-gegevens worden ontdubbeld.

- Samenvoegen is niet terug te draaien.
- Twijfel je, maak dan eerst een export van het brondossier of zet een ticket uit bij support.
- Voorkomen is beter: zoek vóór het aanmaken van een dossier altijd eerst op geboortedatum en postcode.`},
 {id:'k2',peildatum:'2026-01-01',herzienVoor:'2026-12-31',cat:'verz',titel:'ORV en NHG: wat is verplicht en wat leg je vast',auteur:'u3',datum:'2026-09-23T10:30:00',bron:'v4',gecontroleerd:true,
  body:`NHG stelt geen eis meer aan een overlijdensrisicoverzekering. Het afdekken van het overlijdensrisico is daarmee een adviesvraag geworden, geen acceptatievraag. De geldverstrekker kan boven een bepaald LTV-percentage nog wel een ORV eisen; controleer dat per aanbieder.

Vastleggen in het dossier:
- berekening van het tekort bij overlijden van elk van beide partners (woonlasten tegenover resterend inkomen, nabestaandenpensioen, Anw)
- het advies om het tekort af te dekken, met het geadviseerde verzekerd bedrag
- bij afwijken: de keuze van de klant in zijn eigen woorden, ondertekend, onder een volledig uitgewerkt advies

Een verklaring "afwijkend advies" zonder onderbouwd advies erboven is onvoldoende.`},
 {id:'k3',herzienVoor:'2027-09-11',cat:'comp',titel:'Bewaartermijnen adviesdossier (Wft/BGfo en AVG)',auteur:'u8',datum:'2026-09-11T08:00:00',bron:'v8',gecontroleerd:true,
  body:`Twee regimes naast elkaar:
- Wft/BGfo: bewaar het adviesdossier minimaal vijf jaar na het einde van de dienstverlening, zodat het advies reconstrueerbaar blijft.
- AVG: bewaar niet langer dan nodig voor het doel. Na de wettelijke termijn moet er een verwijderbeleid zijn.

Voor de financiële administratie (facturen, provisie) geldt de fiscale bewaarplicht van zeven jaar.

Leg de termijnen vast in het verwerkingsregister en laat het CRM de verwijderdatum berekenen op basis van de einddatum van de relatie.`},
 {id:'k4',herzienVoor:'2027-09-30',cat:'adv',titel:'Leningdelen met verschillende rentevaste periodes vastleggen',auteur:'u6',datum:'2026-09-30T10:00:00',bron:'v2',gecontroleerd:false,
  body:`De rentevaste periode hoort bij het leningdeel, niet bij het scenario. Voeg binnen hetzelfde scenario per gewenste rentevaste periode een leningdeel toe en stel per deel de aflosvorm, de looptijd en de rentevaste periode in.

Geef elk leningdeel een herkenbare omschrijving (bijvoorbeeld "Annuïtair 10 jaar"), dan toont het adviesrapport per deel de maandlast en de uitleg over het renterisico op een voor de klant leesbare manier.`},
 {id:'k5',herzienVoor:'2027-09-05',cat:'hyp',titel:'Checklist eerste gesprek hypotheekadvies',auteur:'u5',datum:'2026-09-05T09:00:00',bron:null,gecontroleerd:true,
  body:`Inventariseren (klantbeeld):
- doelstellingen en termijn: kopen, oversluiten, verbouwen, verduurzamen
- inkomen en bestendigheid, inclusief partner en toekomstige wijzigingen
- financiële verplichtingen en BKR-registraties
- risicobereidheid en kennis en ervaring met hypotheken en verzekeringen
- toekomstplannen: gezin, pensioen, verhuizen, ondernemen

Stukken opvragen:
- geldig identiteitsbewijs
- recente loonstroken en jaaropgave, of jaarcijfers bij ondernemers
- pensioenoverzicht (mijnpensioenoverzicht.nl)
- overzicht van lopende leningen en verzekeringen

Vastleggen: gespreksnotitie met datum, besproken onderwerpen en afspraken, en de dienstverleningsdocumenten die zijn overhandigd.`},
 {id:'k6',peildatum:'2026-01-01',herzienVoor:'2026-12-31',cat:'fisc',titel:'Bijleenregeling in het kort',auteur:'u2',datum:'2026-09-19T12:00:00',bron:'v5',gecontroleerd:false,
  body:`De eigenwoningreserve is het verschil tussen de verkoopopbrengst van de woning (na verkoopkosten) en de resterende eigenwoningschuld. Bij aankoop van een volgende woning moet die reserve eerst worden ingezet; alleen het meerdere kwalificeert als nieuwe eigenwoningschuld met renteaftrek.

Aflossen uit eigen middelen of een schenking verlaagt de eigenwoningschuld en vergroot dus bij verkoop de eigenwoningreserve. De renteaftrek over het afgeloste deel komt bij een volgende aankoop niet zonder meer terug.

Reken een verhuisscenario door voordat de klant extra aflost en leg vast dat dit is besproken.`},
 {id:'k7',herzienVoor:'2027-09-28',cat:'crm',titel:'Signalering einde rentevaste periode instellen',auteur:'u4',datum:'2026-09-28T09:00:00',bron:'v9',gecontroleerd:false,
  body:`Maak een kantoorbrede regel op de hypotheekgegevens die een aantal maanden vóór de einddatum van de rentevaste periode een taak aanmaakt voor de dossierhouder. Koppel er een standaardmail aan om de klant uit te nodigen voor een gesprek.

Voorwaarden:
- de einddatum van de rentevaste periode moet per leningdeel gevuld zijn; draai eerst een overzicht van leningdelen zonder einddatum
- de regel werkt alleen voor actieve relaties, niet voor relaties met status "ex-klant"`},
 {id:'k8',herzienVoor:'2027-09-02',cat:'comp',titel:'Afwijkend advies: zo leg je het goed vast',auteur:'u8',datum:'2026-09-02T08:30:00',bron:null,gecontroleerd:true,
  body:`Een klant mag afwijken van je advies. Jij moet kunnen aantonen dat het advies passend was en dat de klant de gevolgen van zijn keuze begreep.

Volgorde in het dossier:
- het volledige advies met onderbouwing in het adviesrapport
- de risico's van afwijken concreet benoemd (bedragen, scenario's)
- de keuze van de klant in zijn eigen woorden
- datum en handtekening van de klant

Wat niet volstaat: een losse "afstandsverklaring" zonder uitgewerkt advies, of een standaardzin zonder de concrete risico's voor deze klant.`},
 {id:'k9',herzienVoor:'2027-04-02',cat:'adv',titel:'Financieringsopzet aanpassen in eBlinqx Hypotheekadvies: alle varianten',auteur:'u6',datum:'2026-10-02T11:30:00',bron:'v12',gecontroleerd:false,
  kw:'financieringsopzet aanpassen bedragen eigen middelen eigen geld inbreng kosten koper overdrachtsbelasting notariskosten tarieven taxatiekosten advieskosten bemiddelingskosten extra veld kostenpost erfpacht OHA overbrugging overbruggingspercentage restschuld verkoopprijs boeterente oversluitkosten verbouwing energiebespaarbudget EBB nieuwbouw grondkosten bouwdepot meerwerk bouwrente NHG borgtochtprovisie krediet inlossen afgelost tijdens passeren familiehypotheek familiebank starterslening SVn woningkorting koopstart eigendomsverhouding draagplicht box 1 box 3 leningdeel hoofdsom splitsen niet sluitend tekort afrondingsverschil rapport PDF weergave kolommen spaarhypotheek geldverstrekker',
  links:[
   {titel:'Volledige werkinstructie met zoekfunctie en printknop (eigen pagina, 21 onderwerpen)',url:'werkinstructie-financieringsopzet.html'},
   {titel:'Hoe specificeer ik eigen geld (schenking, spaargeld, beleggingen)?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600849-hoe-specificeer-ik-eigen-geld-schenking-spaargeld-beleggingen-in-eblinqx-hypotheekadvies'},
   {titel:'Hoe verwerk ik spaarsaldo en verkoopopbrengst bij aankoop van een nieuwe woning?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600588-hoe-verwerk-ik-spaarsaldo-en-verkoopopbrengst-bij-aankoop-van-een-nieuwe-woning'},
   {titel:'Hoe verwerk ik een polis afkoopwaarde in de financieringsopzet?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600600-hoe-verwerk-ik-een-polis-afkoopwaarde-in-de-financieringsopzet'},
   {titel:'Hoe verwerk ik erfpacht afkoop in de financieringsopzet?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600641-hoe-verwerk-ik-erfpacht-afkoop-in-de-financieringsopzet'},
   {titel:'Hoe pas ik het overbruggingskrediet aan?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600639-hoe-pas-ik-het-overbruggingskrediet-aan-in-eblinqx-hypotheekadvies'},
   {titel:'Waarom wordt het handmatig overbruggingsbedrag niet meegenomen in de draagplicht?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600650-hoe-komt-het-dat-het-handmatig-overbruggingsbedrag-niet-wordt-meegenomen-in-de-draagplicht-financieringsopzet'},
   {titel:'Hoe voer ik kredieten in die via de hypotheek worden ingelost?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600747-hoe-voer-ik-kredieten-in-die-via-de-hypotheek-worden-ingelost'},
   {titel:'Hoe los ik een afrondingsverschil in de financieringsopzet op?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600694-hoe-los-ik-een-afrondingsverschil-in-het-financieringsopzet-op'},
   {titel:'Hoe wissel ik tussen 1- en 2-kolomsweergave bij de financieringsopzet?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600682-hoe-wissel-ik-tussen-1-en-2-kolomsweergave-bij-de-financieringsopzet'},
   {titel:'Waarom wordt de geldverstrekker niet getoond in de financieringsopzet?',url:'https://support-fastlane.vh.blinqx.tech/nl/articles/600820-waarom-wordt-de-geldverstrekker-niet-getoond-in-de-financieringsopzet'}
  ],
  body:`Alle varianten om de financieringsopzet aan te passen, samengevat uit AI Fin Support (de supportassistent van eBlinqx Hypotheekadvies) en de kennisbank, samengesteld op 2 oktober 2026. Dit is een interne werkinstructie en geen formele productdocumentatie: verifieer kritische stappen in de software of bij support voordat je ze als kantoorwerkwijze verspreidt.

## Kort antwoord
De financieringsopzet is op drie manieren aan te passen:
- Vaste velden invullen of wijzigen: boeterente, overbruggingspercentage, eigen middelen, koopsom.
- Eigen kostenposten toevoegen via "Voeg extra veld toe" onder Kosten van de woning.
- Sturen via de leningdelen: splitsen, NHG-keuze, box 1/box 3-toewijzing, afrondingscorrectie.
Wat je niet handmatig aanpast: NHG en borgtochtprovisie (volgen uit de NHG-keuze per leningdeel) en de opmaak van het rapport.

Compliance, de rode draad: overal waar je handmatig invoert, vervalt de automatische (fiscale) berekening. Handmatige posten tellen mee in het totaal, maar niet in de belastingcomponenten. Leg handmatige invoer en de onderbouwing vast in de motivatie; dit is het punt waarop een dossier bij toetsing op passend advies kwetsbaar is.

## 1. Eigen of extra kostenpost toevoegen (afkoop erfpacht, OHA-regel)
1. Open het dossier en ga naar Financieringsopzet.
2. Ga naar Kosten van de woning en klik op "Voeg extra veld toe".
3. Geef de post een naam (bijvoorbeeld "Afkoop erfpacht"), klik op het gele plusje en voer het bedrag in.
Let op: handmatige posten tellen mee in het totaaloverzicht, maar niet in belastingberekeningen. Onderbouw de fiscale behandeling zelf en leg die vast.

## 2. Kosten koper aanpassen
- Overdrachtsbelasting: wordt automatisch berekend over de hoogste van koopsom en marktwaarde.
- Notariskosten: centraal via Instellingen > eBlinqx Hypotheekadvies > Tarieven (bijvoorbeeld Hypotheekakte notaris, Leveringsakte notaris).
- Taxatiekosten: handmatig via "Voeg extra veld toe".
- Advieskosten en bemiddelingskosten: apart invullen en gescheiden houden; dat is vereist voor HDN-aanvragen.

## 3. Eigen middelen specificeren
1. Ga naar Financieringsopzet en voer het totaalbedrag aan eigen middelen in.
2. Geef per categorie de herkomst aan: schenking, spaargeld, beleggingen, overwaarde uit verkoop.
3. Licht de verdeling toe in het opmerkingenveld, bijvoorbeeld "Eigen middelen € 40.000,00: € 25.000,00 schenking ouders, € 10.000,00 spaargeld en € 5.000,00 beleggingen".
4. Voeg bewijsstukken toe: schenkingsakte, saldo-overzicht, beleggingsoverzicht of verkoopopbrengst.
Polisafkoopwaarde en vrijvallend spaarsaldo verwerk je bij "Inbreng eigen geld" met een toelichting (bij voorkeur met polisnummer); bewaar het bewijs in de documentensectie. De beschikbare velden kunnen per dossierconfiguratie en geldverstrekker verschillen.

## 4. Overbrugging en restschuld
- Het veld Overbruggingspercentage staat onder Eigen geld. Kies een percentage of "Anders" voor een eigen bedrag.
- Standaard rekent eBlinqx met 90% van de verwachte verkoopprijs minus de resterende hypotheekschuld; bij een onvoorwaardelijk verkochte woning kan in sommige gevallen 100% van de overwaarde meetellen.
- Vul je handmatig een bedrag in, dan vervalt de automatische berekening: controleer daarna of de totale financiering nog klopt en haalbaar is.
- Restschuld: voer de verwachte verkoopprijs en de resterende hypotheekschuld in; de overwaarde wordt automatisch berekend en vormt de basis voor de overbrugging. Controleer de restschuld door de oorspronkelijke leningdelen en aflossingen correct in te voeren.
Bekende beperking: een handmatig aangepast overbruggingsbedrag wordt niet doorvertaald naar de draagplichtmodule. Controleer de draagplicht apart.

## 5. Oversluiten: boeterente en oversluitkosten
- Boeterente: vast veld Boeterente in de financieringsopzet.
- Oversluitkosten: handmatig via "Voeg extra veld toe", duidelijk benoemd als oversluitkosten.

## 6. Verbouwing, energiebespaarbudget en nieuwbouw
- Verbouwing: kies bij Doelstelling "Mijn woning verbouwen" (of Interne oversluiting) en voeg de kostenposten toe via "Voeg extra veld toe".
- Energiebespaarbudget: tot € 20.000,00 extra (maximaal 106% van de marktwaarde) in een depot, alleen voor energiebesparende maatregelen (isolatie, zonnepanelen, HR++ glas, warmtepomp), uit te voeren binnen twee jaar.
- Nieuwbouw: grondkosten, overdrachtsbelasting en andere grondgerelateerde posten handmatig via extra velden; vermeld in de vrije tekst dat het om grond- of bouwkosten gaat.
Hiaat: voor bouwdepot, bouwtermijnen, meerwerk en bouwrente is in de Blinqx-content geen verwerkingsmethode gedocumenteerd. Bij veel verbouwings- en nieuwbouwdossiers is dit het aanvullen waard.

## 7. NHG en borgtochtprovisie
Geef per leningdeel aan of met of zonder NHG wordt gerekend. De borgtochtprovisie wordt dan automatisch berekend, in het veld NHG-kosten gezet en opgeteld bij de inbreng eigen geld; bij een wijziging van de lening wordt alles herberekend. Handmatig aanpassen kan niet: wijzig de NHG-keuze bij het leningdeel.

## 8. Kredieten die via de hypotheek worden ingelost
1. Ga naar Huidige situatie > Verplichtingen en voeg per krediet een regel toe (maatschappij, rente, kredietnummer, openstaand bedrag).
2. Zet de status op "Afgelost tijdens passeren".
3. Controleer in Advies > Financieringsopzet onder Consumptief of de bedragen kloppen; ontbreekt een krediet, dan staat de status waarschijnlijk niet goed.

## 9. Familiehypotheek en starterslening
- Familiehypotheek: Hypotheken > Hypotheek toevoegen, geldverstrekker "Afwijkend", productlijn "Familiebank"; vul bedrag, rente, looptijd en aflosvorm in.
- Starterslening: nieuw leningdeel met aflossingsvorm "SVn Starterslening"; vul looptijd en rente in.
Beide worden volledig meegenomen in berekeningen en rapportages. Let op: een familiehypotheek gaat niet via HDN. In combinatie met een reguliere hypotheek zijn soms twee berekeningen nodig: één voor de toetsing (familiebedrag als leningdeel) en één voor de aanvraag (familiebedrag als eigen middelen).

## 10. Woningkorting
- Als schenking: volledige koopsom invoeren en de korting als schenking of bijdrage bij Eigen middelen.
- Als lagere koopprijs: de verlaagde koopsom invoeren.
AFM-aandachtspunt: de keuze heeft fiscale en overdrachtsbelastinggevolgen. Volg de koopakte en leg de keuze onderbouwd vast.

## 11. Eigendomsverhouding en draagplicht
- De eigendomsverdeling leg je vast bij de woninggegevens; controleer dat beide personen bij de leningdelen zijn gekoppeld.
- Draagplicht werkt op drie plekken: Financieringsbehoefte (eigen inleg per persoon), Hypotheek samenstellen (apart leningdeel per aanvrager met eigendom per deel) en Motiveren (verdeling en motivatie onder Draagplichtovereenkomst).
Tip: de eigenaar per leningdeel aanpassen lukt door de burgerlijke staat tijdelijk op "Samenwonend" te zetten, de partner aan te vinken bij de doelstelling, het eigendom aan te passen en de partner weer uit te vinken.

## 12. Box 1 en box 3
Elk leningdeel valt volledig in één box; gemengde leningdelen worden niet ondersteund en geven verkeerde berekeningen en fiscale rapportages. Maak per fiscale component een apart leningdeel en wijs het toe aan box 1 (aftrekbaar) of box 3 (niet aftrekbaar).
AFM-aandachtspunt: een verkeerd toegewezen leningdeel levert direct een onjuiste renteaftrek in het advies op. Controleer de box-toewijzing expliciet bij consumptieve bestedingen, box 3-delen en meegefinancierde kosten.

## 13. Hoofdsom splitsen en controle
- Voeg extra leningdelen toe en verdeel de hoofdsom; bedragen pas je per leningdeel aan (eigen hoofdsom, rente en aflosvorm). Is de optelsom niet gelijk aan de hoofdsom, dan vraagt eBlinqx automatisch om een extra leningdeel.
- Niet sluitend of tekort: controleer of de hoofdsom gelijk is aan de som van de leningdelen en bekijk Acceptatienormen > Balk samenvatting; rode cijfers betekenen dat de lasten hoger zijn dan het inkomen. Veelvoorkomende oorzaken: inkomenswijziging, aflopende rentevaste periode, wijziging in toetslast.
- Afrondingsverschil van enkele centen: verhoog het kleinste hypotheekdeel met het verschil en sla op. Puur technisch, geen inhoudelijke impact op het advies.

## 14. Weergave, rapport en PDF
- Rapport: open de berekening, klik rechtsboven op "Berekeningen vergelijken" en daarna op het PDF-icoon.
- Weergave: schakel rechtsboven in het financieringsopzetblok tussen 1- en 2-koloms; dit geldt alleen voor het huidige scherm.
- Rapporten zijn altijd PDF met standaardopmaak; huisstijl, logo of kleuren zijn momenteel niet aan te passen.

## 15. Bekende beperkingen
- Een handmatig overbruggingsbedrag synchroniseert niet met de draagplichtmodule.
- De geldverstrekker wordt niet getoond in de financieringsopzet en het maandlastenoverzicht; de opzet hoort bij de oriënterende fase.
- Een spaarhypotheek wordt alleen binnen de huidige situatie verwerkt, niet automatisch in de opzet van de nieuwe woning.
- Bouwdepot, meerwerk en bouwrente: geen gedocumenteerde werkwijze.
- NHG-provisie alleen via de NHG-keuze per leningdeel; rapportopmaak niet aanpasbaar.

Bronnen: AI Fin Support (chatsessies 2 oktober 2026) en de kennisbank eBlinqx Hypotheekadvies (support-fastlane.vh.blinqx.tech). Antwoorden van de AI-assistent kunnen afwijken van de actuele softwareversie.`},
 {id:'k10',peildatum:'2026-01-01',herzienVoor:'2026-12-31',cat:'hyp',titel:'Leennormen 2026: Nibud-advies hypotheeknormen in het kort',auteur:'u5',datum:'2026-10-02T21:15:00',bron:null,gecontroleerd:false,
  kw:'Nibud leennormen hypotheeknormen 2026 financieringslast financieringslastpercentage woonquote tabel afronding 0,1 procent loonstijging 4,1 toetsinkomen alleenstaanden 17.000 niet-kwetsbaar studieschuld studielening DUO bruteringsfactor brutering energielabel extra leenruimte verduurzaming energiebesparende maatregelen A+ A++ A+++ A++++ energieprestatiegarantie EPG salderingsregeling zonnepanelen terugleverkosten Tijdelijke regeling hypothecair krediet Trhk maximale hypotheek toetsrente AOW AOW-gerechtigd box 3 niet aftrekbaar tweeverdieners tweede inkomen persoonlijke financiële verplichtingen',
  links:[
   {titel:'Rekenhulp en volledige financieringslasttabellen 2026 (eigen pagina)',url:'leennormen-2026.html'},
   {titel:'Nibud: Advies hypotheeknormen 2026 (PDF, september 2025)',url:'documenten/Rapport-Advies-hypotheeknormen-2026.pdf'},
   {titel:'Nibud: Bijlage financieringslastnormen 2026 (Excel met tabellen en rekenhulp)',url:'documenten/Bijlage-financieringslastnormen-2026.xlsx'},
   {titel:'Tijdelijke regeling hypothecair krediet (wetten.overheid.nl)',url:'https://wetten.overheid.nl/BWBR0032503'},
   {titel:'Nibud: onderzoeksrapport online',url:'https://www.nibud.nl/onderzoeksrapporten/rapport-advies-hypotheeknormen-2026-2025/'},
   {titel:'Rijksoverheid: Leennormen 2026 (31 oktober 2025)',url:'https://www.rijksoverheid.nl/actueel/nieuws/2025/10/31/leennormen-2026-hypotheek-kan-iets-omhoog-door-verwachte-loonstijging'}
  ],
  body:`Samenvatting van het Nibud-rapport "Advies hypotheeknormen 2026" (M. Warnaar, J. Bos en G. van den Enden, september 2025) en de bijbehorende Excel met de tabellen. Het advies is grotendeels overgenomen in de Tijdelijke regeling hypothecair krediet (Trhk) die per 1 januari 2026 geldt. Bij een verschil geldt de regeling. Met de rekenhulp bij dit artikel zoek je het percentage op en reken je een indicatieve maximale hypotheek uit.

## Financieringslastpercentages
- Ook voor 2026 is het percentage het gemiddelde over vier jaar (2022 tot en met 2025). 2021 valt nu uit de berekening.
- Nieuw: de percentages worden naar beneden afgerond op 0,1 procent in plaats van op 0,5 procent. Dat verkleint sprongen in de maximale hypotheek bij een kleine wijziging in inkomen of rente. In het uiterste geval scheelt het 0,4 procentpunt, bij € 75.000 inkomen ongeveer € 25,00 bruto per maand.
- Door de inflatie van de afgelopen jaren liggen de percentages bij de meeste inkomens iets lager dan in 2025. Zonder loonstijging daalt de maximale hypotheek bij alle inkomens.
- Het CPB verwacht 4,1 procent loonstijging in 2026. Met die loonstijging stijgt de maximale hypotheek voor alle inkomens, omdat het toetsinkomen hoger is.
- De tabellen lopen van € 30.000 tot en met € 125.000 (niet-AOW) en van € 29.000 tot en met € 110.000 (AOW), in stappen van € 1.000. Onder het startinkomen geldt het percentage van het startinkomen.
- Er zijn vier tabellen: niet-AOW en AOW, elk voor aftrekbare (box 1) en niet-aftrekbare (box 3) gedeelten.
- Het tweede inkomen telt sinds 2023 volledig mee.

## Voorbeelden maximale hypotheek (standaardtabel, label E/F/G)
Bij 4,25% rente:
- € 35.000: 2025 € 145.258; 2026 zonder loonstijging € 139.922; met 4,1% loonstijging € 145.659
- € 50.000: 2025 € 207.512; 2026 zonder loonstijging € 199.889; met loonstijging € 208.084
- € 70.000: 2025 € 302.374; 2026 zonder loonstijging € 290.517; met loonstijging € 308.600
- € 100.000: 2025 € 465.843; 2026 zonder loonstijging € 459.067; met loonstijging € 481.416
Bij 5% (minimale toetsrente bij rentevaste periode korter dan 10 jaar) ligt de maximale hypotheek lager, bijvoorbeeld € 190.939 bij € 50.000 en € 434.657 bij € 100.000, zonder loonstijging.

## Energielabel: extra leenruimte bij aankoop
- E, F of G: € 0
- C of D: € 5.000
- A of B: € 10.000
- A+ of A++: € 20.000
- A+++: € 25.000 (2025: € 30.000)
- A++++: € 30.000 (2025: € 40.000)
- A++++ met energieprestatiegarantie: € 40.000 (2025: € 50.000)
- geen geldig label: € 0
De verlaging voor de zuinigste labels komt door de terugleverkosten en het einde van de salderingsregeling in 2027: veel zonnepanelen leveren financieel minder op. De standaardtabel is gebaseerd op label E, F of G en verandert hierdoor niet.

## Energielabel: extra leenruimte voor verduurzaming
Maximaal extra bedrag voor maatregelen van de Trhk-lijst, naar het label vóór de verbouwing:
- E, F of G: € 20.000
- C of D: € 15.000
- A of B: € 10.000
- A+ of A++: € 10.000
- A+++: € 0 (2025: € 10.000)
- A++++ (met of zonder garantie): € 0
- label onbekend: € 10.000
De lijst met maatregelen is voor 2026 niet gewijzigd. Bij verbouwing met maatregelen van de lijst in combinatie met een depotregeling is het bedrag vrijgesteld.

## Studieschuld
De regeling blijft ongewijzigd. Het wettelijk maandbedrag van de DUO-lening wordt bij een box 1-hypotheek gebruteerd met een factor die afhangt van de rente op de hypotheek:
- tot en met 2,000%: 1,05
- 2,001-2,500%: 1,10
- 2,501-3,000%: 1,15
- 3,001-4,000%: 1,20
- 4,001-4,500%: 1,25
- 4,501-5,500%: 1,30
- 5,501-6,000%: 1,35
- vanaf 6,001%: 1,40
In de aanloopfase, bij een aflosvrije periode of bij een verlaagd termijnbedrag door de draagkrachtmeting reken je met een termijnbedrag op basis van de actuele restschuld, rente en resterende looptijd. Bij een volledig box 3-hypotheek bruteer je niet.
Voorbeeld Nibud: € 72,21 per maand × 1,20 = € 86 minder maandruimte, bij 3,75% rente ongeveer € 18.711 minder hypotheek.

## Alleenstaanden
Het extra hypotheekbedrag voor aantoonbaar niet-kwetsbare alleenstaanden blijft € 17.000. Geïndexeerd zou het € 17.356 zijn; het Nibud adviseert het bedrag te handhaven. In de rekenhulp van het Nibud geldt de verhoging alleen zonder tweede inkomen en boven het startinkomen van de tabel.

## Overige financiële verplichtingen
Niet-aftrekbare lasten (bijvoorbeeld consumptief krediet) bruteer je bij een box 1-hypotheek met de factor percentage box 1-tabel / percentage box 3-tabel. Niet bruteren bij verplichtingen die zelf aftrekbaar zijn (partneralimentatie, erfpacht, krediet voor verbetering van de eigen woning) en bij een volledig box 3-hypotheek.

## AOW-gerechtigden
Er is een aparte tabel met hogere percentages, omdat AOW-gerechtigden minder belasting betalen. Bereikt de klant binnen tien jaar de AOW-leeftijd, dan toets je ook of het verwachte inkomen vanaf die leeftijd voldoende is.

## Toetsrente
De AFM stelt de minimale toetsrente per kwartaal vast; die is geen onderdeel van het Nibud-advies (in het derde kwartaal van 2025 was dat 5%). De minimale toetsrente geldt bij een rentevaste periode korter dan tien jaar en bij hypotheken die binnen tien jaar volledig worden afgelost. Controleer altijd de actuele waarde.

## Let op in het advies
- De leennorm is de krediettoets van de geldverstrekker. Volgens de AFM-Leidraad Hypotheekadvisering (april 2026) is een lening binnen de Trhk-norm niet automatisch passend. Zie het kennisbankartikel over de leidraad.
- Leg in het dossier vast welk normenjaar, welke toetsrente en welk energielabel (met registratiedatum) je hebt gebruikt.
- Het Nibud publiceert elk najaar het advies voor het volgende jaar. Controleer of het advies voor 2027 al beschikbaar is; dan is dit artikel per 1 januari 2027 verouderd.`},
 {id:'k11',herzienVoor:'2027-10-02',cat:'comp',titel:'AFM-Leidraad Hypotheekadvisering (april 2026): wat de AFM verwacht',auteur:'u8',datum:'2026-10-02T21:30:00',bron:null,gecontroleerd:false,
  kw:'AFM leidraad hypotheekadvisering 2026 passend advies artikel 4:23 Wft adviesnorm zelfstandige rol adviseur inventarisatie analyse adviesrapport nazorg verantwoorde woonlasten LTI pensioen uitgavenpatroon netto besteedbaar inkomen rentevastperiode renteschok scenario verduurzaming energielabel EBV EBB funderingsschade fundering fiscaliteit fiscaal verleden eigenwoningschuld eigenwoningreserve box 1 box 3 hypotheekproduct voorwaarden verhuisregeling life events arbeidsongeschiktheid overlijden werkloosheid relatiebeëindiging scheiding oversluiten terugverdientijd afwijken advies vastleggen dossier',
  links:[
   {titel:'AFM: Leidraad Hypotheekadvisering, april 2026 (PDF)',url:'documenten/Leidraad-Hypotheekadvisering-2026.pdf'},
   {titel:'AFM: feedbackstatement bij de herziene Leidraad Hypotheekadvisering 2026 (PDF)',url:'https://www.afm.nl/~/profmedia/files/wet-regelgeving/beleidsuitingen/leidraden/feedback-statement-hypotheekadvies-bij-herziene-leidraad-2026.pdf'},
   {titel:'AFM: adviseurs, bemiddelaars en gevolmachtigden',url:'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten'},
   {titel:'Wft, artikel 4:23 (wetten.overheid.nl)',url:'https://wetten.overheid.nl/BWBR0020368'},
   {titel:'Overzicht wet- en regelgeving (eigen pagina)',url:'wetgeving.html'}
  ],
  body:`De AFM heeft in april 2026 een geactualiseerde Leidraad Hypotheekadvisering gepubliceerd. Die vervangt de leidraad uit 2011 (zeven losse afleveringen). Nieuw zijn onder meer verduurzaming en relatiebeëindiging.

De leidraad beschrijft elementen van een goede adviespraktijk: een voorbeeld van hoe je voldoet aan de adviesnorm van artikel 4:23 lid 1 Wft. Het is geen wet- of regelgeving en geen vakinhoudelijk handboek. Informatieverstrekking (artikel 4:19 en 4:20 Wft) en het bemiddelingstraject vallen erbuiten. De voorbeelden in de leidraad zijn illustraties, geen vaste richtlijnen, ook niet als er getallen in staan.

## Rol van de adviseur
- Je hebt een zelfstandige rol: je laat je niet alleen leiden door de wens van de klant of door wat de aanbieder wil lenen. Benoem die rol al vroeg.
- Wijkt de klant af van je advies, wijs dan nadrukkelijk op de gevolgen en leg de afwijking vast in dossier en adviesrapport. Kun je je echt niet verenigen met de keuze, vraag je dan af of je kunt meewerken.
- Neem een onderzoekende houding aan en vraag door bij tegenstrijdigheden, bijvoorbeeld als de klant een stabiel inkomen bij arbeidsongeschiktheid belangrijk vindt maar het risico niet wil afdekken.
- Blijf vakbekwaam en digitaal vaardig. Je bent verantwoordelijk voor het advies, ook voor de juistheid van de regelingen en berekeningen in je adviessoftware.

## Het adviestraject
- Kennismaking: deel Dienstenwijzer en Vergelijkingskaart, maak afspraken over de omvang van de dienstverlening en wees duidelijk waarover je niet adviseert. Bespreek bij een vraag naar de maximale hypotheek ook dat de leennormen uitgaan van een huishouden zonder kinderen en dat het maximum niet hetzelfde is als betaalbaar.
- Inventarisatie: kennis en ervaring, financiële positie, doelstellingen en risicobereidheid. Verifieer mondelinge informatie waar nodig en inventariseer bestaande en wettelijke voorzieningen.
- Analyse: maak klantspecifieke berekeningen, ook voor pensionering, eerder stoppen met werken, arbeidsongeschiktheid en overlijden. Onderzoek de betaalbaarheid na pensionering ook als de klant nog meer dan tien jaar van zijn pensioen af zit.
- Advies: een begrijpelijk, onderbouwd adviesrapport waaruit blijkt hoe je tot het advies kwam, welke wensen niet haalbaar zijn en wat de fiscale gevolgen zijn. Deel het tijdig, vóór het bemiddelingstraject. Schriftelijk of digitaal verstrekken is verplicht. Een gelaagde opbouw (samenvatting, onderdelen, achtergrond) noemt de AFM als goed voorbeeld.
- Nazorg: maak vooraf afspraken over de dienstverlening na het afsluiten en de vergoeding. Actief klantbeheer is een goede praktijk.

## Verantwoorde woonlasten
- Kijk naar alle woonlasten: rente en aflossing, maar ook energie, belastingen, onderhoud, opstalverzekering en eventueel erfpacht.
- Uitgavenpatroon en spaargedrag worden belangrijker naarmate de klant (meer) maximaal leent ten opzichte van de LTI.
- Een lening binnen de Trhk-norm is niet automatisch passend, bijvoorbeeld bij een hoge levensstandaard of onvoldoende pensioeninkomen.
- Adviseer je boven de Trhk-norm, dan volstaat "goed toekomstperspectief" of "behoorlijk eigen vermogen" niet. Concretiseer de bijzondere omstandigheid en reken die door.

## Rentevastperiode
- Bespreek de samenhang tussen rentevastperiode, maandlast, zekerheid en renterisico aan de hand van scenario's met actuele tarieven.
- Ga er dieper op in bij een hoge LTI en een korte rentevastperiode, bijvoorbeeld met scenario's van 2 en 3 procentpunt rentestijging.
- Het advies is je eigen afweging, niet alleen een vertaling van de wens van de klant. Volgt de klant het advies niet, leg dan de motieven en de risico's vast.

## Verduurzaming
- Bespreek het energielabel en wat het betekent voor de leenruimte en de productkeuze (bijvoorbeeld duurzaamheidskorting). Dit is belangrijker bij label E, F of G.
- Je hoeft geen energie-expert te zijn; verwijzen naar een energiebespaaradviseur mag.
- Bij een aanvullende hypotheek alleen voor energiebesparende voorzieningen is niet altijd een volledig advies nodig; de AFM heeft daar handvatten voor gepubliceerd.
- Van de adviseur wordt kennis verwacht over de kans op funderingsschade in de omgeving. Betrek de financiering van herstel waar redelijkerwijs mogelijk en maak de klant bewust van het risico.

## Fiscaliteit
- Breng het hypotheekverleden in kaart: hypotheekoverzichten, aangiften, schenkingen, erfenissen, ongelijke inbreng, draagplichtovereenkomsten en opbouwproducten (KEW, SEW, BEW). Neem geen genoegen met "weet ik niet meer".
- Bereken eigenwoningschuld en eigenwoningreserve en beoordeel wat in box 1 kwalificeert, inclusief overgangsrecht.
- Lukt reconstructie niet volledig, hanteer dan prudente aannames, leg die vast en bespreek de onzekerheden. Schakel zo nodig een fiscalist in.

## Hypotheekproduct
- Vergelijk aanbieders niet alleen op rente maar ook op voorwaarden: offerte- en dagrente, bereidstellingsprovisie, verhuisregeling, boetevrij aflossen, rente mee laten dalen en overbruggingskrediet.
- Controleer als sluitstuk of het totale advies consistent en passend is, en motiveer welke voorwaarden doorslaggevend waren.

## Life events en relatiebeëindiging
- Breng het financiële risico bij overlijden, arbeidsongeschiktheid en werkloosheid klantspecifiek in kaart, inclusief sociale, werkgevers- en eigen voorzieningen en wachttijden.
- Je hebt een zelfstandige plicht te beoordelen of de klant een risico dat hij wil lopen ook kan dragen.
- Ook als je niet over verzekeringen adviseert: kan de klant het risico niet dragen, wijs dan op de gevolgen en verwijs actief door. Terugbellen na enige tijd is een goede praktijk.
- Bespreek bij partners de relatievorm, afspraken, kinderwens, eigendomsverhouding en lastenverdeling, en de gevolgen van een relatiebreuk, vooral voor de partner met het laagste inkomen.

## Oversluiten
- Oversluiten is een nieuw adviesmoment. Was het vorige advies minder dan vijf jaar geleden, stel dan in elk geval de checkvraag of er relevante wijzigingen zijn. Bij meer dan vijf jaar ligt hergebruik van oude informatie niet voor de hand.
- Betrek de huidige aanbieder en andere aanbieders, neem alle kosten mee en bereken de terugverdientijd.
- Informeer over fiscale gevolgen en gevolgen voor verbonden producten en de aflosvorm, bijvoorbeeld bij aflossingsvrij naar annuïtair.

Bron: AFM, Leidraad Hypotheekadvisering, april 2026. Deze samenvatting vervangt de leidraad niet; lees bij twijfel de volledige tekst.`},
 {id:'k12',herzienVoor:'2027-10-02',cat:'comp',titel:'Wet- en regelgeving voor adviseurs: overzicht met links',auteur:'u8',datum:'2026-10-02T21:45:00',bron:null,gecontroleerd:false,
  kw:'wetgeving wet regelgeving wetten.overheid.nl BWBR Wft Wet op het financieel toezicht Bgfo Besluit Gedragstoezicht Trhk Tijdelijke regeling hypothecair krediet NHG Wck consumentenkrediet Wwft witwassen Kifid uitspraken reglement AFM AI-verordening Grondwet Burgerlijk Wetboek BW Boek 1 2 3 4 5 6 7 7A erfrecht Faillissementswet WSNP Wetboek van Koophandel Wet arbeid en zorg UAVG AVG AWR inkomstenbelasting Wet IB 2001 box 3 rechtsherstel loonbelasting vennootschapsbelasting dividendbelasting overdrachtsbelasting belastingen van rechtsverkeer Successiewet schenkbelasting erfbelasting Natuurschoonwet Registratiewet Invorderingswet WOZ dubbele belasting betaalpauze kapitaalverzekering SEW BEW Pensioenwet waardeoverdracht verevening pensioenrechten scheiding AWIR toeslagen kinderopvang kindgebonden budget zorgtoeslag huurtoeslag minimumloon studiefinanciering WW Toeslagenwet AOW Anw kinderbijslag Ziektewet WIA Wajong IOW IOAW IOAZ Participatiewet Zorgverzekeringswet DGA internationaal privaatrecht Erfrechtverordening 30%-regeling gemeenschap van goederen partneralimentatie transitievergoeding lijfrente jaarruimte aflossingsverplichting overlevingstafel hypothecair planner',
  links:[
   {titel:'Volledig overzicht wet- en regelgeving met zoekfunctie (113 bronnen, eigen pagina)',url:'wetgeving.html'},
   {titel:'Wft: Wet op het financieel toezicht',url:'https://wetten.overheid.nl/BWBR0020368'},
   {titel:'Bgfo: Besluit Gedragstoezicht financiële ondernemingen Wft',url:'https://wetten.overheid.nl/BWBR0020421'},
   {titel:'Trhk: Tijdelijke regeling hypothecair krediet',url:'https://wetten.overheid.nl/BWBR0032503'},
   {titel:'NHG: voorwaarden en normen voor professionals',url:'https://www.nhg.nl/professional/'},
   {titel:'Wck: Wet op het consumentenkrediet',url:'https://wetten.overheid.nl/BWBR0004815'},
   {titel:'Wwft: Wet ter voorkoming van witwassen en financieren van terrorisme',url:'https://wetten.overheid.nl/BWBR0024281'},
   {titel:'Kifid: uitsprakenregister',url:'https://www.kifid.nl/kifid-kennis-en-uitspraken/uitspraken/'},
   {titel:'AFM: adviseurs, bemiddelaars en gevolmachtigden',url:'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten'},
   {titel:'Wet inkomstenbelasting 2001',url:'https://wetten.overheid.nl/BWBR0011353'}
  ],
  body:`Snelkoppelingen naar de wetten, besluiten en bronnen die je als hypotheek- en financieel adviseur het vaakst nodig hebt. Het volledige overzicht met zoekfunctie staat op een eigen pagina (zie de links hieronder). Zoek daar op naam, afkorting of BWBR-nummer.

## Wat staat erin
- Financiële wetgeving en toezicht: Wft, Bgfo, Trhk (met paragraaf 4 financieringslastpercentages), NHG, Wck, Wwft en Uitvoeringsbesluit Wwft 2018, Kifid (uitspraken en reglement), AFM en de AI-verordening.
- Grondwet.
- Burgerlijk Wetboek boek 1 tot en met 7A, Faillissementswet en WSNP, Wetboek van Koophandel, Wet arbeid en zorg en de Uitvoeringswet AVG.
- Belastingen: AWR, inkomstenbelasting (met Invoeringswet, uitvoeringsbesluit en -regeling, rechtsherstel box 3, betaalpauze eigenwoningschuld en het Verzamelbesluit KEW/SEW/BEW), loon-, vennootschaps- en dividendbelasting, belastingen van rechtsverkeer, Successiewet, Invorderingswet, Wet WOZ en voorkoming dubbele belasting.
- Pensioen: Pensioenwet met besluit en regeling, waardeoverdracht en Wet verevening pensioenrechten bij scheiding.
- Toeslagen: AWIR, kinderopvang, kindgebonden budget, zorgtoeslag en huurtoeslag.
- Sociale zekerheid: minimumloon, studiefinanciering, WW, Toeslagenwet, AOW, Anw, kinderbijslag, Ziektewet, WIA, Wajong, IOW, IOAW, IOAZ, Participatiewet, Zorgverzekeringswet en de Regeling aanwijzing DGA.
- Buitenland: Boek 10 BW, Europese Erfrechtverordening, BES en de 30%-regeling.
- Overgangsrecht: gemeenschap van goederen (2012 en 2018), transitievergoeding en partneralimentatie.
- Hulpmiddelen: Belastingdienst-hulpmiddelen (lijfrentepremie, aflossingsverplichting, jaarruimte), CBS-overlevingstafel en Hypothecair planner.

## Let op
Links naar wetten.overheid.nl openen de tekst die vandaag geldt. Voor een dossier heb je soms de versie nodig die gold op een eerdere datum, bijvoorbeeld bij overgangsrecht of bij een klacht over een oud advies. Die kies je op wetten.overheid.nl met de datumkiezer.`},
 {id:'k14',cat:'crm',titel:'Finly (eBlinqx CRM): klantformulieren en waar je hulp vindt',auteur:'u6',datum:'2026-10-02T23:30:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'finly eblinqx crm formulieren klantformulieren schademelding opzegging finconnect kennisbank support trainingen nazorg',
  links:[
   {titel:'Supportsite Finly (Blinqx V&H)',url:'https://support-finly.vh.blinqx.tech/nl/'},
   {titel:'Finly: kennisbank en handleidingen eBlinqx CRM',url:'https://www.getfinly.com/kennisbank'},
   {titel:'Finly: klantformulieren',url:'https://www.getfinly.com/kennisbank/klant-formulieren'},
   {titel:'Faster Forward: gemakkelijk formulieren toesturen met Finly',url:'https://support.fasterforward.nl/kennisbank/gemakkelijk-formulieren-toesturen-met-finly/'},
   {titel:'Finly: Finconnect FAQ',url:'https://www.getfinly.com/finconnect-faq'},
   {titel:'Blinqx V&H: supportoverzicht',url:'https://blinqx.tech/sectoren-overzicht/verzekering-hypotheek/support'}
  ],
  body:`Finly is het CRM van eBlinqx voor Verzekering & Hypotheek. Met de formulieren in Finly laat je klanten zelf gegevens aanleveren, bijvoorbeeld een schademelding of een opzegging, zonder dat je kantoor alles handmatig hoeft over te nemen.

## Waar gebruik je klantformulieren voor
- inventarisatie vooraf, zodat het eerste gesprek over advies gaat in plaats van over gegevens verzamelen
- schademeldingen en opzeggingen
- nazorg: de klant geeft wijzigingen door, zoals een nieuwe baan, verhuizing of gezinsuitbreiding

## Formulieren op het Adviesforum
Heb je (nog) geen formulieren in je CRM, gebruik dan de formulieren bij Hulpmiddelen: inventarisatie en klantprofiel, documentenchecklist, wijziging doorgeven en de periodieke nazorgcheck. Je maakt er een klantlink van; de klant vult in en stuurt het overzicht naar jou. Er wordt niets op het forum opgeslagen.

## Hulp en training
- De kennisbank van Finly heeft handleidingen voor het CRM, de modules (koppelingen, agenda, formulieren) en trainingen.
- Voor problemen met eBlinqx CRM kun je terecht bij support-crm@blinqx.tech.

## Let op
Bij klantformulieren verwerk je persoonsgegevens. Vraag alleen wat je nodig hebt, leg vast waarom, en bewaar de gegevens in het klantdossier en niet in losse mailboxen.

Bron: openbare zoekresultaten over de kennisbank van Finly en Faster Forward op 2 oktober 2026. De pagina's zelf konden bij het opstellen niet worden geopend; controleer de werking in je eigen omgeving.`},
 {id:'k13',cat:'adv',titel:'Adviesbox Online koppelen aan eBlinqx (GUID en HBX-export)',auteur:'u6',datum:'2026-10-02T22:00:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'adviesbox adviesbox online eblinqx fastlane koppeling guid hbx export naw elements importkoppeling softwarekoppelingen faster forward adviespakket',
  links:[
   {titel:'Faster Forward: Adviesbox Online instellen en gebruiken',url:'https://support.fasterforward.nl/kennisbank/adviesbox-online-instellen-en-gebruiken/'},
   {titel:'Faster Forward: Adviespakketten gekoppeld aan eBlinqx',url:'https://support.fasterforward.nl/kennisbank/welke-adviespakketten-koppelt-eblinqx/'},
   {titel:'Faster Forward: Fastlane Advies gebruiken',url:'https://support.fasterforward.nl/kennisbank/fastlane-advies-gebruiken/'},
   {titel:'Adviesbox Online: aan de slag (support Adviesbox)',url:'https://support.adviesbox.nl/portal/nl/kb/adviesbox-online/algemeen/aan-de-slag-met-adviesbox-online'}
  ],
  body:`Vanuit eBlinqx exporteer je klantgegevens naar Adviesbox Online om daar het advies verder uit te werken. Let op de naamgeving: eBlinqx Hypotheekadvies is hetzelfde pakket als Fastlane (Fastlane Advies); Adviesbox Online is een ander adviespakket dat je via een koppeling met eBlinqx gebruikt.

## Eenmalig instellen: de GUID
De koppeling tussen Adviesbox Online en eBlinqx loopt via een GUID. Die maak je één keer aan in Adviesbox Online en voeg je één keer toe in eBlinqx.
1. Adviesbox Online: ga naar Instellingen > Partijen beheren > Softwarekoppelingen.
2. Klik op de instellingenknop achter "Elements via importkoppeling" en klik op "GUID genereren".
3. eBlinqx: voeg de GUID toe via Admin > Organisatie & Mensen > het betreffende kantoor > tabblad Instellingen. Hiervoor heb je de juiste rechten nodig.

## Klant exporteren naar Adviesbox Online
1. Open in eBlinqx het klantdossier van de prospect of klant.
2. Ga naar Exporteren > Adviesbox NAW.
3. Vul de velden in, klik op "HBX genereren" en daarna op "HBX downloaden".
4. Lees het HBX-bestand in Adviesbox Online in.

## Hulp nodig
Voor het inrichten van de koppeling kun je mailen naar support@fasterforward.nl.

Bron: de kennisbank van Faster Forward (support.fasterforward.nl), samengevat uit openbare zoekresultaten op 2 oktober 2026. De pagina zelf kon bij het opstellen niet worden geopend; controleer de stappen in de software voordat je ze als werkinstructie gebruikt.`},
];
