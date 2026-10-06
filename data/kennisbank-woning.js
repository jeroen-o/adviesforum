/* KENNISBANK-WONING van het Adviesforum
 *
 * Aanvulling op data/kennisbank.js met artikelen over de woning zelf in het hypotheekadvies:
 * funderingsrisico, woningdata (Funderingscijfer, Woningcijfer, PandWise, Duurzaamheidsprofiel),
 * taxatievormen, klimaatrisico's, energielabel en de woning-due-diligence.
 * Zelfde velden en opmaak als kennisbank-planning.js. Alle artikelen zijn concept (gecontroleerd:false).
 * Bronnen: NHG Voorwaarden & Normen 2026-1 (documenten/), AFM Leidraad Hypotheekadvisering april 2026
 * (documenten/), nhg.nl, kcaf.nl, rijksoverheid.nl, rvo.nl, kadaster.nl, verzekeraars.nl,
 * klimaatadaptatienederland.nl. Peildatum 3 oktober 2026. Geen prijzen of tarieven opgenomen.
 */
window.KENNISBANK=(window.KENNISBANK||[]).concat([
 {id:'k140',cat:'hyp',titel:'Funderingsrisico: herkennen, gevolgen voor taxatie, NHG en verzekering, en de zorgplicht (AFM)',auteur:'u4',datum:'2026-10-03T10:00:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'fundering funderingsrisico houten palen paalrot droogstand bacteriële aantasting verschilzakking verzakking fundering op staal bouwjaar 1970 veen klei grondwater GLG NAP KCAF FunderMaps funderingsrisicorapport risicoklasse A B C D E funderingslabel Funderingscijfer RVO funderingsviewer aandachtsgebieden taxatierapport model 2026 1 april 2026 NWWI aanvullend funderingsonderzoek verkennend funderingsonderzoek bouwkundig rapport bouwdepot indicatieve herstelkosten financieringslast NHG 2027 25000 eigen middelen opstalverzekering niet gedekt AFM Leidraad zorgplicht vastleggen',
  links:[
   {titel:'KCAF: Funderingsrisicorapport',url:'https://www.kcaf.nl/funderingsrisicorapport/'},
   {titel:'KCAF: Wat betekenen de funderingsrisico\'s?',url:'https://www.kcaf.nl/faq-items/wat-betekenen-de-funderingsrisicos/'},
   {titel:'KCAF: Funderingsviewer indicatieve aandachtsgebieden',url:'https://www.kcaf.nl/live-landelijke-funderingsviewer-indicatieve-aandachtsgebieden/'},
   {titel:'KCAF: Vervroegde beëindiging testfase Funderingslabel',url:'https://www.kcaf.nl/vervroegde-beeindiging-testfase-funderingsrisico-viewer/'},
   {titel:'KCAF: Funderingsrisico in 2026 voor makelaars en taxateurs',url:'https://www.kcaf.nl/funderingsrisico-in-2026-wat-verandert-er-voor-makelaars-en-taxateurs/'},
   {titel:'NHG: Funderingsrisico in het taxatierapport (vanaf 1 april)',url:'https://www.nhg.nl/nhg-actueel/funderingsrisico-in-het-taxatierapport-wat-verandert-er-vanaf-1-april/'},
   {titel:'NHG: Voorwaarden en normen 2027',url:'https://www.nhg.nl/kennis-innovatie/voorwaarden-en-normen-2027/'},
   {titel:'NHG FAQ: Wanneer is aanvullend funderingsonderzoek verplicht?',url:'https://www.nhg.nl/faq/funderingsrisico/wanneer-is-aanvullend-funderingsonderzoek-verplicht/'},
   {titel:'NWWI: Model 2026',url:'https://site.nwwi.nl/model-2026/'},
   {titel:'Funderingscijfer.nl',url:'https://www.funderingscijfer.nl'},
   {titel:'AFM Leidraad Hypotheekadvisering april 2026 (PDF)',url:'documenten/Leidraad-Hypotheekadvisering-2026.pdf'},
   {titel:'Acceptatiewijzer (intern)',url:'acceptatiewijzer.html'}
  ],
  body:`Funderingsproblemen zijn een van de grootste financiële risico's van een woning en zijn vrijwel nooit verzekerd. Het KCAF schat dat ongeveer een half miljoen woningen funderingsproblemen heeft of kan krijgen. Sinds 1 april 2026 staat het risico in het taxatierapport en vanaf 1 januari 2027 in de NHG-normen. De financiering van herstel staat in k141.

## Hoe ontstaat funderingsschade?

- Houten palen: vooral woningen van vóór ongeveer 1970 op slappe grond (veen, klei, rivier- en kustgebieden). Hout blijft alleen goed zolang het onder water staat.
- Droogstand: zakt de grondwaterstand onder de paalkoppen, dan krijgen schimmels de kans het hout aan te tasten (paalrot). Droge zomers en een structureel lagere grondwaterstand vergroten het risico.
- Bacteriële aantasting: ook palen onder water kunnen over tientallen jaren door bacteriën verzwakken.
- Ondiepe funderingen (op staal): gevoelig voor bodemdaling en voor krimp van klei of veen bij droogte.
- Verschilzakking: delen van een woning of blok zakken ongelijk. Signalen: scheuren in gevels en muren, klemmende deuren en ramen, scheve vloeren, scheefstand.

## Waar zie je het risico?

- Het taxatierapport: sinds 1 april 2026 bevat het model taxatierapport woonruimte een funderingsrisicoklasse van A tot en met E op basis van KCAF-gegevens. Het funderingsrisicorapport wordt binnen het taxatieproces toegevoegd en via het NWWI gevalideerd.
- Het KCAF-funderingsrisicorapport (op basis van FunderMaps): het meest waarschijnlijke funderingstype, een risicoscore A tot en met E en de betrouwbaarheid van de data (indicatief, afgeleid of vastgesteld).
- De funderingsviewer indicatieve aandachtsgebieden (RVO/KCAF, ook via PDOK): per gebied het aantal woningen van vóór 1970 op minder draagkrachtige grond. Een gebiedsindicatie, geen oordeel over één woning.
- Funderingscijfer.nl: een indicatief cijfer op een schaal van 2 tot 8. Startwaarde op basis van bouwjaar, met correcties voor grondsoort, maaiveldhoogte (NAP), ligging in een RVO-aandachtsgebied en laagste grondwaterstand (GLG). Ook zichtbaar in PandWise en Woningcijfer. Dit is een eigen indicator en niet dezelfde schaal als de KCAF-klasse A tot en met E.
- Het Funderingslabel was een KCAF-testwebsite (2020) met een indicatief risico per adres. De testfase is vroegtijdig beëindigd vanwege de grote belangstelling; het KCAF benadrukte dat het geen verplicht label in het taxatierapport was. De opvolger is het funderingsrisicorapport.
- Verder: bouwdossier bij de gemeente, eerder funderingsonderzoek, funderingsloket, VvE-stukken en verkoopinformatie.

## De risicoklassen (KCAF)

- A: geen risico.
- B: licht risico.
- C: verhoogd risico of onzekerheid.
- D: hoog risico; verder onderzoek aanbevolen.
- E: vastgesteld funderingsprobleem.
Een modelmatige score geeft richting, geen zekerheid. Alleen funderingsonderzoek door een gespecialiseerd bureau, of betrouwbare gegevens uit het bouwdossier, zegt iets over de werkelijke staat. Bij rijwoningen en appartementen gaat het om de fundering van het hele blok of gebouw.

## Taxatie en financiering

- De taxateur moet de uitkomst wegen en toelichten. Bij klasse D of E kan hij aanvullend funderingsonderzoek nodig vinden, voor duidelijkheid over de staat, de mogelijke herstelkosten en het moment van herstel.
- Een bouwkundige keuring kan dan worden vervangen door (beperkt) aanvullend funderingsonderzoek, tenzij de taxateur nadrukkelijk ook een keuring adviseert.
- De geldverstrekker moet de funderingsinformatie meewegen. Leent de klant voor herstel dat direct nodig is, dan gaan die kosten in een bouwdepot. Is herstel niet direct nodig, dan beoordeelt de geldverstrekker of de klant de kosten later kan dragen; een bouwdepot is dan niet vereist.
- Geldverstrekkers kunnen strengere eigen regels hebben. Zie de acceptatiewijzer.

## NHG: V&N 2026 (nu geldig)

De V&N 2026-1 hebben geen aparte funderingsparagraaf. Wel van toepassing:
- C.5.2: is de staat van de woning niet goed, dan kan NHG alleen met afspraken over direct herstel en als je hebt beoordeeld dat de klant dat kan betalen.
- C.5.2.1: een bouwkundig rapport is nodig als de taxateur meldt dat meer bouwkundig onderzoek nodig is, dat de staat slecht is, of dat het direct nodige herstel gemiddeld meer dan 10% van de marktwaarde kost.
- C.5.2.2: het rapport komt van de gemeente, Vereniging Eigen Huis of een onafhankelijk bouwkundig bedrijf (NHG-model) en is maximaal 12 maanden oud.
- Herstel van achterstallig onderhoud is een kwaliteitsverbetering: in de kosten van de woning en in een bouwdepot (C.6.5). De waarde na verbetering vraagt een fysieke taxatie (C.5.1).

## NHG: V&N 2027 (vanaf 1 januari 2027)

- Risicoklasse A, B of C, of geen funderingsbeoordeling: het risico hoeft niet te worden meegewogen.
- Risicoklasse D of E: verkennend funderingsonderzoek is verplicht.
- Blijkt een hoog funderingsrisico, dan tellen de indicatieve herstelkosten uit het taxatierapport mee in de financieringslast: je rekent de last als annuïteit over maximaal 30 jaar tegen de AFM-toetsrente en trekt die af van de maximale financieringslast.
- Heeft de klant meer dan € 25.000 eigen middelen voor toekomstig herstel, dan mogen de indicatieve herstelkosten worden verlaagd met het deel boven € 25.000.
Controleer de definitieve V&N 2027-tekst zodra die beschikbaar is.

## Verzekering: meestal niet gedekt

- Schade door paalrot, droogstand of bodemdaling is een geleidelijk proces en valt vrijwel altijd buiten de opstalverzekering. Het KCAF stelt dat funderingsrisico's niet te verzekeren zijn.
- Na herstel moet de klant de opstalverzekeraar informeren om onderverzekering te voorkomen (zie k88 en herbouwwaarde.html).
- Funderingsschade kan de waarde drukken, ook van buurwoningen in hetzelfde blok.

## Zorgplicht: wat de AFM verwacht (AFM-relevant)

Volgens de AFM Leidraad Hypotheekadvisering (april 2026):
- De adviseur heeft relevante kennis over de kans op funderingsschade in de omgeving waar hij actief is, en volgt de funderingsproblematiek als maatschappelijke trend.
- Zijn er concrete signalen, of zijn de risico's in die omgeving algemeen bekend, dan betrekt de adviseur de financiering van herstel in het advies, voor zover dat redelijkerwijs kan.
- Is geen oplossing mogelijk, dan maakt hij de klant op zijn minst bewust van het financiële risico.
- Voorbeeld uit de Leidraad: al in de oriëntatiefase wijst de adviseur op verzakkingen door een dalende grondwaterstand, legt uit dat dit vaak niet verzekerbaar is, dat herstel duur kan zijn en de waarde kan drukken, en raadt aan de fundering vóór aankoop te laten beoordelen.

## Wanneer bespreek je het?

- Oriëntatie: de klant zoekt in een regio met bekende funderingsproblematiek.
- Concrete woning: bouwjaar, ligging, risicoklasse, verkoopinformatie of een indicatie geeft aanleiding.
- Vóór het verlopen van het financieringsvoorbehoud: dan kan de klant nog onderzoek laten doen.
- Bij oversluiten, verhogen of verbouwen: een nieuw taxatierapport kan klasse D of E tonen.
- In nazorg: bij signalen van schade of een funderingsaanpak in de wijk.

## Wat je vastlegt

- Dat je het risico hebt besproken, wanneer en op basis van welke bron (met datum).
- Je advies over onderzoek vóór aankoop en wat de klant daarmee deed.
- Dat funderingsschade in de regel niet verzekerd is.
- Hoe je mogelijke herstelkosten in de betaalbaarheid hebt meegenomen (buffer, bouwdepot, financieringslast).
- Kiest de klant tegen je advies in: de afweging en de keuze (zie afwijkend-advies.html).

## Wat je niet doet

- Een indicatief cijfer presenteren als oordeel over de fundering.
- Zelf inschatten of herstel nodig is: verwijs naar een funderingsonderzoeksbureau of funderingsloket.
- Herstelkosten noemen zonder rapport.

## Let op

Concept. Risicoklassen, funderingsrisicorapport en Funderingslabel: kcaf.nl. Taxatierapport 2026 en V&N 2027: nhg.nl, kcaf.nl en nwwi.nl (zoekresultaten oktober 2026; volledige V&N 2027-tekst niet ingezien). V&N 2026 gecontroleerd in documenten/nhg-voorwaarden-normen-2026.pdf. Zorgplicht: hoofdstuk 6 van de AFM Leidraad (documenten/). Funderingscijfer: openbare projectinformatie; de site zelf was niet rechtstreeks te raadplegen.`},

 {id:'k141',cat:'hyp',titel:'Funderingsherstel financieren: Fonds Duurzaam Funderingsherstel, bouwdepot en NHG',auteur:'u4',datum:'2026-10-03T10:15:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'funderingsherstel financieren Fonds Duurzaam Funderingsherstel Funderingslening Maatwerk SVn 20 miljoen 2026 Nationale Aanpak Funderingen Nationaal Funderingsloket bouwdepot verbouwingsdepot NHG kwaliteitsverbetering achterstallig onderhoud eigenwoningschuld renteaftrek blokherstel VvE',
  links:[
   {titel:'Rijksoverheid: Kan ik een lening krijgen voor herstel van de fundering?',url:'https://www.rijksoverheid.nl/onderwerpen/huis-kopen/vraag-en-antwoord/kan-ik-een-lening-krijgen-voor-herstel-van-de-fundering-van-mijn-huis'},
   {titel:'Rijksoverheid: Steun voor eigenaren bij funderingsschade (28 augustus 2026)',url:'https://www.rijksoverheid.nl/actueel/nieuws/2026/08/28/steun-voor-eigenaren-bij-funderingsschade'},
   {titel:'KCAF: Fonds Duurzaam Funderingsherstel voor alle particuliere eigenaren',url:'https://www.kcaf.nl/fonds-duurzaam-funderingsherstel-nu-toegankelijk-voor-alle-particuliere-woningeigenaren/'},
   {titel:'SVn: Fonds Duurzaam Funderingsherstel landelijk beschikbaar',url:'https://www.svn.nl/over-svn/nieuws/fonds-duurzaam-funderingsherstel-vanaf-1-juli-landelijk-beschikbaar/'},
   {titel:'Volkshuisvesting Nederland: Nationale Aanpak Funderingen',url:'https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/nationale-aanpak-funderingen'},
   {titel:'Rekentools (intern)',url:'rekentools.html'}
  ],
  body:`Herstel van een fundering is een grote investering. De klant financiert het in de regel zelf, met eigen geld of een (aanvullende) hypotheek. Wie dat niet lukt, kan terecht bij het Fonds Duurzaam Funderingsherstel. Dit artikel geeft de routes.

## Route 1: eigen geld of hypotheek bij de eigen geldverstrekker

- Funderingsherstel is een verbetering of onderhoud van de eigen woning. Een lening daarvoor kan onder de gewone voorwaarden (aflossingseisen) tot de eigenwoningschuld horen.
- Bij aankoop met direct nodig herstel gaan de herstelkosten in een bouwdepot. Bij NHG is een bouwdepot verplicht voor alle geleende kosten van aanpassingen (V&N 2026, C.6.5); eigen middelen gaan eerst op.
- Herstel van achterstallig onderhoud telt bij NHG als kwaliteitsverbetering en dus mee in de kosten van de woning. De marktwaarde na herstel vraagt een fysieke taxatie die de waarde vóór, de aanpassingen en de waarde ná vermeldt (C.5.1 en C.5.1.1).
- Bij een bestaande hypotheek: verhoging bij de eigen geldverstrekker of een tweede hypotheek. Let op de LTV na herstel en de toets op betaalbaarheid.

## Route 2: Fonds Duurzaam Funderingsherstel (bestaat nog)

- Het fonds is bedoeld voor particuliere eigenaren met funderingsproblemen (verzakking, paalrot, bodemdaling) die geen marktconforme financiering kunnen krijgen.
- Het fonds is inmiddels landelijk beschikbaar voor alle particuliere woningeigenaren; de aanvraag loopt rechtstreeks via het fonds, zonder tussenkomst van de gemeente. SVn voert het fonds uit.
- In 2026 heeft het kabinet € 20 miljoen extra in het fonds gestort, zodat eigenaren met onvoldoende inkomen hun herstel kunnen financieren (Rijksoverheid, 28 augustus 2026).
- Het product is de Funderingslening Maatwerk: afgestemd op de financiële draagkracht van de eigenaar, met een looptijd van 30 jaar. Ook bijkomende kosten zoals financieel advies en herstel van schade aan vloeren en muren kunnen worden meegefinancierd.
- Voorwaarden volgens Rijksoverheid: de eigenaar krijgt geen lening bij een bank omdat het inkomen te laag is, de lening is voor funderingsherstel en bijbehorende kosten, en de aanvrager is particuliere eigenaar(-bewoner) of kleine particuliere verhuurder.
- Rente en actuele voorwaarden: zie de site van het fonds of SVn; die nemen we hier niet op.

## Route 3: gemeentelijke regelingen en loketten

- Een aantal gemeenten heeft een eigen funderingsloket, subsidie of procesbegeleiding. Daarnaast kunnen eigenaren terecht bij lokale en regionale informatiepunten en het Nationaal Funderingsloket voor advies over onderzoek, herstel en kosten.
- Bij blokherstel is samenwerking tussen eigenaren nodig; voor appartementen loopt het via de VvE (reservefonds, VvE-lening).

## Wat de adviseur doet

- Laat de klant eerst onderzoek doen: zonder rapport en begroting is geen verantwoorde financiering mogelijk.
- Vergelijk de routes op betaalbaarheid, looptijd en gevolgen voor de eigenwoningschuld.
- Toets de lasten met en zonder herstel. Gebruik de rekentools voor maandlasten en LTV.
- Wijs de klant op het melden van het herstel aan de opstalverzekeraar.
- Leg vast welke routes besproken zijn en waarom je tot je advies komt (AFM-relevant, zie k140).

## Let op

Concept. Status fonds, de extra € 20 miljoen in 2026 en de kenmerken van de Funderingslening Maatwerk komen van rijksoverheid.nl, kcaf.nl en svn.nl (oktober 2026). Rente, minimum- en maximumbedragen en inkomensgrenzen zijn bewust niet opgenomen; raadpleeg de actuele voorwaarden van het fonds.`},

 {id:'k142',cat:'hyp',titel:'Woningdata in het adviesproces: Woningcijfer, PandWise en de soorten waardebepaling',auteur:'u4',datum:'2026-10-03T10:20:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'woningdata Woningcijfer PandWise Funderingscijfer Klimaatcijfer modelwaarde modelmatige waardering desktoptaxatie hybride taxatie Calcasa volledige taxatie fysieke taxatie gevalideerd NWWI WOZ-waarde BAG BRK CBS PDOK EP-Online NHG 90% LTV oversluiten risicoklasse verlagen renteklasse waardestijging',
  links:[
   {titel:'NHG: Taxatie van een woning',url:'https://www.nhg.nl/het-krijgen-van-nhg/taxatie-van-een-woning/'},
   {titel:'NHG FAQ: Is een losse modelmatige taxatie toegestaan?',url:'https://www.nhg.nl/faq/woning-waarde-verbetering/is-een-taxatierapport-of-hybride-taxatie-verplicht-of-is-een-losse-modelmatige-taxatie-ook-toegestaan/'},
   {titel:'NHG: Toegestane desktoptaxatie producten',url:'https://www.nhg.nl/nhg-actueel/desktoptaxatie/'},
   {titel:'NHG FAQ: Welke geldverstrekkers accepteren een hybride taxatie?',url:'https://www.nhg.nl/faq/woning-waarde-verbetering/welke-geldverstrekkers-accepteren-een-hybride-taxatie/'},
   {titel:'Woningcijfer.nl',url:'https://www.woningcijfer.nl'},
   {titel:'PandWise.nl',url:'https://www.pandwise.nl'},
   {titel:'LTV-berekening (intern)',url:'ltv.html'},
   {titel:'Oversluiten (intern)',url:'oversluiten.html'}
  ],
  body:`Openbare woningdata zijn makkelijk beschikbaar en nuttig voor de oriëntatie. Voor de financiering telt alleen een waardebepaling die de geldverstrekker of NHG accepteert. Dit artikel legt het verschil uit.

## Wat Woningcijfer en PandWise bieden

- Woningcijfer: een gebouw- en omgevingsscore voor Nederlandse woningen, samengesteld uit openbare registers. Bronnen zijn onder meer PDOK (adres en coördinaten), BAG (bouwjaar, woningtype, oppervlak), de kadastrale kaart (perceel), het WOZ-waardeloket, EP-Online (energielabel), BRO en AHN (bodem en hoogte voor funderingsindicatoren), CBS (buurtstatistiek, voorzieningen, criminaliteit) en bronnen over klimaat, geluid, aardbevingen en monumenten. Onderdeel is een Klimaatcijfer van 1 tot 10 dat fundering, overstroming, hitte, wateroverlast en droogte weegt.
- PandWise: zet de gegevens uit een woningadvertentie naast openbare registers (BAG, BRK, CBS, WOZ) en toont signalen waar die afwijken, bijvoorbeeld bij oppervlakte, perceel of bouwjaar. Het geeft ook een indicatie op basis van de buurt-WOZ per m², WOZ-waarden per peildatum en buurtstatistiek, plus het Funderingscijfer en het Klimaatcijfer.
- Beide werken met openbare data en geven indicaties. Ze zijn geen taxatie en geen gevalideerde modelwaarde voor financiering.

## Drie soorten waardebepaling

- Modelmatige waardering (modelwaarde): een statistisch model schat de marktwaarde uit object-, markt- en locatiedata. Er kijkt geen taxateur naar. Voorbeelden: de WOZ-modelwaarde vóór controle, waardecheckers en indicaties in data-apps.
- Desktoptaxatie of hybride taxatie: een modelwaarde die een taxateur beoordeelt en goedkeurt, zonder bezichtiging. NHG noemt dit de hybride taxatie (V&N 2026, C.5.1.2): alleen met door NHG toegestane producten, conform de EBA-richtsnoeren voor taxateurs en modellen, en maximaal 6 maanden oud. De Calcasa desktoptaxatie was het eerste product dat NHG accepteerde; de actuele lijst staat op nhg.nl.
- Volledige (fysieke) taxatie: een onafhankelijke, geregistreerde taxateur bezoekt de woning; het rapport wordt gevalideerd door een door NHG geaccepteerd validatie-instituut (zoals het NWWI) en is maximaal 6 maanden oud (C.5.1.1). Sinds 1 april 2026 bevat dit rapport ook de funderingsrisicoklasse.

## Wat NHG accepteert (V&N 2026)

- Een volledig gevalideerd taxatierapport of een goedgekeurde hybride taxatie. Een losse modelmatige waardering of een WOZ-beschikking is niet voldoende.
- Een fysieke taxatie is verplicht als de klant meer dan 90% van de marktwaarde wil lenen, als je de waarde na kwaliteitsverbetering of energiebesparende voorzieningen nodig hebt, bij afkoop van erfpachtcanon of verkrijgen van volle eigendom, bij een dreigende restschuld na gedwongen verkoop en bij aankoop op een veiling (C.5.1).
- Bij gedeeltelijk royement van een klein deel (meer dan 5 m², minder dan 10% van de oppervlakte) en een LTV onder 90% is minimaal een hybride taxatie van het hele onderpand verplicht (D-hoofdstuk, tabel royement).

## Wat geldverstrekkers accepteren

- Per geldverstrekker verschillend. NHG houdt op nhg.nl bij welke geldverstrekkers een hybride taxatie accepteren. Bij een verzoek om een lagere risico- of renteklasse na waardestijging bepaalt de geldverstrekker zelf welke waardebepaling hij accepteert: een taxatierapport, een desktoptaxatie of een door hem aangewezen modelwaarde.
- Een eigen indicatie van de klant (waardechecker, WOZ, Woningcijfer of PandWise) wordt voor een renteklasseverlaging in de regel niet geaccepteerd; de geldverstrekker schrijft het product en de leverancier voor.
- Controleer altijd de actuele acceptatievoorwaarden; zie de acceptatiewijzer.

## Hoe je woningdata gebruikt in het advies

- Oriëntatie: snel inzicht in bouwjaar, oppervlakte, energielabel, WOZ-ontwikkeling, buurt en risico's.
- Feitencheck: wijkt de advertentie af van BAG of Kadaster, vraag dan door en laat de taxateur het bevestigen.
- Signalering: een hoog Funderingscijfer of een laag Klimaatcijfer is aanleiding voor een gesprek en eventueel onderzoek (zie k140 en k144).
- Nooit: een modelwaarde als basis nemen voor de maximale hypotheek of de LTV-berekening in het advies.

## Let op

Concept. NHG-regels gecontroleerd in documenten/nhg-voorwaarden-normen-2026.pdf (C.5.1, C.5.1.1, C.5.1.2) en op nhg.nl. Op nhg.nl staat ook een pagina over hybride taxatie bij kwaliteitsverbetering; die lijkt ruimer dan de V&N-tekst. Bij twijfel geldt de V&N. De beschrijving van Woningcijfer en PandWise is gebaseerd op openbare projectinformatie; de sites zelf waren niet rechtstreeks te raadplegen. Geen claims over specifieke geldverstrekkers opgenomen.`},

 {id:'k143',cat:'hyp',titel:'Duurzaamheidsprofiel en woningprofiel: energielabel, EBV/EBB-leenruimte en de rol van de adviseur',auteur:'u4',datum:'2026-10-03T10:25:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'Duurzaamheidsprofiel woningprofiel duurzaamheidsrapport Blinqx energielabel voorlopig energielabel EP-Online maatregelen checklist groen financieren EBV EBB energiebespaarbudget extra leenruimte Trhk 2026 NHG 2027 label E F G 20000 AFM leidraad verduurzaming energieadviseur maatwerkadvies duurzaamheidskorting',
  links:[
   {titel:'Duurzaamheidsprofiel.nl',url:'https://www.duurzaamheidsprofiel.nl/'},
   {titel:'Duurzaamheidsprofiel.nl zakelijk',url:'https://www.duurzaamheidsprofiel.nl/zakelijk/'},
   {titel:'NHG: Voorwaarden en normen 2027',url:'https://www.nhg.nl/kennis-innovatie/voorwaarden-en-normen-2027/'},
   {titel:'NHG: Energiebesparende maatregelen financieren',url:'https://www.nhg.nl/professional/energiebesparende-maatregelen-financieren/'},
   {titel:'AFM Leidraad Hypotheekadvisering april 2026 (PDF)',url:'documenten/Leidraad-Hypotheekadvisering-2026.pdf'},
   {titel:'Leennormen 2026 (intern)',url:'leennormen-2026.html'},
   {titel:'Rekentools (intern)',url:'rekentools.html'}
  ],
  body:`Het Duurzaamheidsprofiel is een gratis rapport per adres dat laat zien hoe een woning scoort op energieverbruik en welke maatregelen mogelijk zijn. Het is een handig startpunt voor het verduurzamingsgesprek. De leennormen staan in k10, de financieringsbronnen in k89 en de NHG-regels in k73.

## Wat het Duurzaamheidsprofiel is

- Een gratis duurzaamheidsprofiel en -rapport op basis van postcode en huisnummer, beheerd door Blinqx.
- Het gaat uit van het (voorlopige) energielabel van de woning en inventariseert welke energiebesparende maatregelen mogelijk zijn.
- Het geeft een checklist van maatregelen en laat zien hoe die groen gefinancierd kunnen worden.
- Bedoeld voor zowel verkoper als koper om zich te oriënteren op de status van de woning.
- Het is geen geregistreerd energielabel en geen maatwerkadvies van een energieadviseur. Voor de leenruimte telt het geregistreerde label in EP-Online.

## Het verband met de leenruimte (Trhk 2026, zie k10)

- Bij aankoop geeft een zuinig label extra leenruimte: € 5.000 bij C of D, € 10.000 bij A of B, € 20.000 bij A+ of A++, € 25.000 bij A+++, € 30.000 bij A++++ en € 40.000 bij A++++ met energieprestatiegarantie. E, F, G of geen geldig label: € 0.
- Voor energiebesparende voorzieningen (EBV) mag extra worden geleend naar het label vóór de verbouwing: € 20.000 bij E, F of G, € 15.000 bij C of D, € 10.000 bij A tot en met A++ en bij een onbekend label, € 0 bij A+++ en A++++.
- De maatregelen staan in de Trhk-lijst: isolatie van gevel, dak, vloer en leidingen, HR++-glas (kozijnen alleen samen met dat glas), energiezuinige deuren, douche-WTW, energiezuinige ventilatie (alleen met andere maatregelen), warmtepompen en zonnecellen. NHG gebruikt dezelfde lijst.

## NHG: energiebespaarbudget

- In 2026 mag de lening met NHG boven de NHG-grens van € 470.000 uitkomen voor energiebesparende voorzieningen, tot maximaal € 498.200.
- Vanaf 1 januari 2027: koopt de klant met NHG een woning met label E, F of G (geen appartementsrecht), dan is het uitgangspunt dat de lening minimaal € 20.000 voor energiebesparende maatregelen bevat. De klant kiest tussen een energiebespaarbudget (EBB) of concrete EBV. Past € 20.000 niet binnen de LTI- en LTV-grenzen, dan geldt het lagere bedrag. De klant hoeft het budget niet te besteden en er is geen verplichting om een bepaald label te halen.

## Verduurzaming in het hypotheekgesprek (AFM)

Volgens de AFM Leidraad (april 2026, hoofdstuk 6):
- Bespreek verduurzaming in het adviestraject, zeker als de klant een woning met label E, F of G op het oog heeft.
- Bespreek wat het label betekent voor de maximale leenruimte en voor de productkeuze, bijvoorbeeld een duurzaamheidskorting op de rente.
- Vraag naar de wensen en doelen van de klant op dit gebied.
- De adviseur hoeft geen expert te zijn in maatregelen; verwijzen naar een energieadviseur mag. Wel kun je wijzen op de gevolgen van hoge energiekosten voor de woonlasten.
- Neem de wensen mee in het productadvies en in de financiering van EBV.
- Leg de wens van de klant en je overwegingen vast.
- Voor een aanvullend krediet dat alleen voor aangewezen EBV is bedoeld, is niet altijd een volledig advies nodig; de AFM heeft daarvoor handvatten gepubliceerd.

## Rol van de adviseur in de praktijk

1. Haal vóór het gesprek het label op (EP-Online) en eventueel het Duurzaamheidsprofiel als gespreksstarter.
2. Bespreek leenruimte, EBV/EBB en de NHG-regels.
3. Verwijs voor de keuze van maatregelen naar een energieadviseur of maatwerkadvies.
4. Toets de betaalbaarheid ook zonder de verwachte besparing.
5. Leg vast wat besproken is en wat de klant kiest.

## Let op

Concept. De bedragen 2026 zijn overgenomen uit k10 (Nibud-advies en Trhk 2026). In k89 staat bij A++++ € 40.000 zonder vermelding van de energieprestatiegarantie; volgens k10 is dat € 30.000, of € 40.000 met garantie. De regels per 2027 komen van nhg.nl. Informatie over het Duurzaamheidsprofiel komt van duurzaamheidsprofiel.nl (zoekresultaat); de site zelf was niet rechtstreeks te raadplegen.`},

 {id:'k144',cat:'hyp',titel:'Klimaatrisico\'s bij de woning: overstroming, wateroverlast, droogte en hitte',auteur:'u4',datum:'2026-10-03T10:30:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'klimaatrisico Klimaateffectatlas overstroming wateroverlast droogte hitte KNMI23 primaire waterkering secundaire kering grote rivieren zee woonhuisverzekering opstalverzekering dekking uitsluiting Wet tegemoetkoming schade bij rampen Wts één loket buitendijks Klimaatcijfer woningwaarde verzekerbaarheid',
  links:[
   {titel:'Klimaatadaptatie Nederland: Klimaateffectatlas',url:'https://klimaatadaptatienederland.nl/hulpmiddelen/overzicht/klimaateffectatlas/'},
   {titel:'Klimaatadaptatie Nederland: Nieuwe overstromingskaarten',url:'https://klimaatadaptatienederland.nl/actueel/actueel/nieuws/2025/nieuwe-overstromingskaarten-klimaateffectatlas/'},
   {titel:'Verbond van Verzekeraars: Overstroming',url:'https://www.verzekeraars.nl/verzekeringsthemas/klimaat-en-duurzaamheid/praktische-hulpmiddelen/infographic-verzekerbaarheid-klimaatrisico-s/overstroming'},
   {titel:'Verbond van Verzekeraars: Geen publiek-private verzekering bij overstroming rivier of zee',url:'https://www.verzekeraars.nl/publicaties/actueel/geen-publiek-private-verzekering-bij-schade-door-overstroming-rivier-of-zee'},
   {titel:'Verbond van Verzekeraars: Overstroming en droogte',url:'https://www.verzekeraars.nl/verzekeringsthemas/klimaat-en-duurzaamheid/overstroming-en-droogte'}
  ],
  body:`Klimaatverandering raakt de woning op vier manieren: overstroming, wateroverlast, droogte en hitte. Voor de hypotheekadviseur gaat het om twee vragen: wat betekent het voor de waarde en is het verzekerd?

## De Klimaateffectatlas

- Een publieke kaartviewer (Klimaatadaptatie Nederland) met een eerste indruk van de gevolgen van klimaatverandering per gemeente en regio.
- Vier thema's: wateroverlast, droogte, hitte en overstroming. Kaartverhalen leggen uit wat je ziet; de klimaatscenario's zijn gebaseerd op KNMI'23.
- De overstromingsinformatie is in 2025 uitgebreid, onder meer met een kaartverhaal over overstromingsrisico en gevolgbeperking en een vernieuwd verhaal over overstromingsdiepte. Er is ook een Buurtdashboard.
- De kaarten zijn bedoeld voor beleid en bewustwording. Ze zeggen iets over een gebied, niet over één woning.

## Verzekerbaarheid

- Wateroverlast door extreme neerslag en overstromende beken en kleinere wateren is bij vrijwel alle verzekeraars gedekt op de woonhuisverzekering, net als (sinds enkele jaren) het bezwijken van secundaire keringen.
- Schade door een overstroming vanuit zee, een grote rivier of een groot binnenwater doordat een primaire waterkering overloopt of bezwijkt, is in de regel niet verzekerd.
- In juni 2024 heeft het kabinet besloten geen publiek-private verzekering voor die schade in te voeren. Wel wordt verkend of verzekeraars als één loket de schadeafhandeling kunnen doen onder de Wet tegemoetkoming schade bij rampen (Wts). Een tegemoetkoming op grond van die wet is geen recht op volledige vergoeding.
- Droogteschade aan de fundering is een geleidelijk proces en valt vrijwel nooit onder de polis (zie k140).
- Buitendijkse woningen hebben een afwijkend risicoprofiel; controleer de polisvoorwaarden.

## Gevolgen voor waarde en financiering

- Een hoger klimaatrisico kan op termijn invloed hebben op de marktwaarde en op de verzekerbaarheid. Hoe groot dat effect is, is niet met zekerheid te zeggen; doe daar geen uitspraken over.
- Geldverstrekkers stellen een opstalverzekering verplicht. Als een risico niet verzekerbaar is, blijft het bij de klant liggen.
- Hitte en droogte raken vooral comfort, gezondheid en de fundering (zie k140). Overstromingsrisico raakt bij een calamiteit direct het vermogen.

## Het gesprek met de klant

- Benoem klimaatrisico's als onderdeel van de woningcheck, vooral bij woningen in laaggelegen gebieden, uiterwaarden of buitendijks, en bij oude woningen op slappe grond.
- Laat de klant zelf de Klimaateffectatlas of een overzicht zoals het Klimaatcijfer (Woningcijfer, PandWise) raadplegen en bespreek de uitkomst.
- Leg uit wat wel en niet verzekerd is en wijs op een buffer voor onverzekerde schade.
- Leg vast dat je het besproken hebt en welke bron je hebt gebruikt.

## Let op

Concept. Feiten over dekking en de publiek-private verzekering komen van verzekeraars.nl; de beschrijving van de atlas komt van klimaatadaptatienederland.nl. De weging van het Klimaatcijfer (fundering, overstroming, hitte, wateroverlast, droogte) is een eigen methodiek van Woningcijfer en geen officiële norm.`},

 {id:'k145',cat:'hyp',titel:'Energielabel en verplichtingen: label C voor kantoren, EPBD IV en woningen',auteur:'u4',datum:'2026-10-03T10:35:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'energielabel verplicht woning verkoop verhuur oplevering 10 jaar geldig boete monument 29 mei 2026 label C kantoren 1 januari 2023 225 kWh label A 2030 niet verplicht EPBD IV tranche 29 mei 2026 nieuw energielabel A tot G 2030 emissievrij 2050 nul-op-de-meter energieprestatiegarantie EPG ondernemer kantoor aan huis',
  links:[
   {titel:'RVO: Energielabel C kantoren',url:'https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-c-kantoren'},
   {titel:'Rijksoverheid: Voor welke woningen is een energielabel verplicht?',url:'https://www.rijksoverheid.nl/onderwerpen/energielabel-woningen-en-gebouwen/vraag-en-antwoord/wanneer-is-het-energielabel-voor-woningen-verplicht'},
   {titel:'RVO: Energielabel woning verplicht',url:'https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-woningen'},
   {titel:'Volkshuisvesting Nederland: Europese richtlijn energieprestatie gebouwen',url:'https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/europese-richtlijn-energieprestatie-gebouwen'},
   {titel:'Volkshuisvesting Nederland: Tijdlijn implementatie EPBD IV',url:'https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/europese-richtlijn-energieprestatie-gebouwen/tijdlijn-implementatie-epbd-iv'},
   {titel:'Volkshuisvesting Nederland: Nieuw energielabel',url:'https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/europese-richtlijn-energieprestatie-gebouwen/onderwerpen-epbd-iv/nieuw-energielabel-voor-woningen-en-gebouwen'}
  ],
  body:`Rond het energielabel circuleren veel verhalen over verplichtingen. Dit artikel zet alleen de bevestigde feiten op een rij (peildatum oktober 2026).

## Woningen: label bij verkoop, verhuur en oplevering

- Een energielabel is verplicht bij oplevering van een nieuwe woning, bij verkoop of nieuwe verhuur van een bestaande woning en bij verkoop en verhuur van een recreatiewoning. Sinds 29 mei 2026 geldt de plicht ook bij verkoop en verhuur van een monument.
- Een label is 10 jaar geldig; de einddatum staat op het label.
- Ontbreekt een geldig label, dan kan de eigenaar een boete krijgen.
- Er zijn uitzonderingen, bijvoorbeeld religieuze gebouwen en recreatiewoningen die minder dan 4 maanden per jaar worden gebruikt.
- Er is geen wettelijke plicht voor een eigenaar-bewoner om een bepaald label te halen.

## Kantoren: minimaal label C

- Sinds 1 januari 2023 moeten kantoorgebouwen minimaal energielabel C hebben (of een primair fossiel energiegebruik van maximaal 225 kWh per m² per jaar). Gemeenten en omgevingsdiensten handhaven.
- Een kantoor zonder label C mag in principe niet meer als kantoor worden gebruikt. Er gelden uitzonderingen; zie RVO.
- Label A in 2030 is een ambitie uit het Energieakkoord, geen wettelijke plicht.
- Relevant voor de adviseur bij ondernemers: een (deels) als kantoor gebruikte ruimte of een te financieren bedrijfspand. Voor de eigen woning zelf geldt deze plicht niet.

## EPBD IV: wat speelt er voor woningen?

- De herziene Europese richtlijn energieprestatie van gebouwen (EPBD IV) wordt in 2026 en 2027 in stappen (tranches) in Nederlandse regels omgezet. De eerste tranche geldt sinds 29 mei 2026; volgende tranches staan gepland voor 1 januari 2027 en 1 juli 2027.
- Doel: een emissievrije gebouwde omgeving in 2050.
- Voor bestaande woningen komen er geen verplichtingen voor eigenaren. Het Rijk stimuleert met informatie en subsidies (isolatie, warmtepomp).
- Er komt een nieuwe labelindeling van A tot en met G; de klassen A+ tot en met A+++++ verdwijnen. Raadpleeg de pagina Nieuw energielabel van Volkshuisvesting Nederland voor de exacte ingangsdatum per labeltype: de bronnen noemen zowel labels geregistreerd vanaf 28 mei 2026 als invoering in 2030.
- Gevolg voor het advies: de leennormen verwijzen nu naar de huidige labelklassen (A+ tot en met A++++). Bij een nieuwe indeling moeten die normen worden aangepast. Volg de Trhk 2027.

## Nul-op-de-meter en energieprestatiegarantie

- Een nul-op-de-meter-woning (NOM) wekt over een jaar ongeveer evenveel energie op als ze voor gebouwgebonden gebruik nodig heeft.
- In de leennormen 2026 geeft label A++++ met een energieprestatiegarantie (EPG) de hoogste extra leenruimte bij aankoop (zie k10 en k143). Vraag de garantie en de looptijd ervan op.
- Na het einde van de salderingsregeling op 1 januari 2027 leveren zonnepanelen financieel minder op. Daarom is de extra leenruimte voor de zuinigste labels in 2026 verlaagd.

## Let op

Concept. Feiten over de labelplicht komen van rijksoverheid.nl en rvo.nl, over EPBD IV van volkshuisvestingnederland.nl (oktober 2026). Uitzonderingen op de label C-plicht voor kantoren en de exacte invoering van de nieuwe labelindeling zijn niet volledig geverifieerd; controleer bij RVO.`},

 {id:'k146',cat:'hyp',titel:'Woningcheck bij aankoop: bodemverontreiniging, asbest en erfpacht',auteur:'u4',datum:'2026-10-03T10:40:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'woningcheck aankoop bodemverontreiniging bodemloket Wkpb publiekrechtelijke beperkingen BRK-PB Kadaster eigendomsinformatie asbest vóór 1994 asbestinventarisatie asbestdakenverbod Eerste Kamer erfpacht canon tijdvak afkoop NHG traditionele erfpacht sanering kwaliteitsverbetering checklist',
  links:[
   {titel:'Kadaster: Publiekrechtelijke beperkingen',url:'https://www.kadaster.nl/publiekrechtelijke-beperkingen'},
   {titel:'Kadaster: Wkpb',url:'https://web.archive.org/web/20200413001349/https://zakelijk.kadaster.nl/wkpb'},
   {titel:'Rijksoverheid: De belangrijkste asbestregels',url:'https://www.rijksoverheid.nl/onderwerpen/asbest/asbestregels'},
   {titel:'InfoMil: Eerste Kamer stemt tegen asbestdakenverbod',url:'https://www.infomil.nl/onderwerpen/asbest/nieuws-asbest/nieuwsberichten/eerste-kamer-stemt/'},
   {titel:'Erfpacht (intern)',url:'erfpacht.html'},
   {titel:'Acceptatiewijzer (intern)',url:'acceptatiewijzer.html'}
  ],
  body:`Naast fundering en energielabel zijn er drie onderwerpen die bij aankoop grote financiële gevolgen kunnen hebben: bodemverontreiniging, asbest en erfpacht. Dit artikel is een checklist; erfpacht staat uitgebreid in k90.

## Bodemverontreiniging

- Overheidsbeperkingen op een perceel, zoals een registratie van bodemverontreiniging of een saneringsplicht, staan in de Basisregistratie Kadaster Publiekrechtelijke beperkingen (BRK-PB) op grond van de Wkpb. Je ziet ze in het Kadaster-product eigendomsinformatie (en via de notaris).
- Gemeenten en provincies hebben daarnaast eigen bodeminformatie (bodemloket of omgevingsdienst).
- Bij NHG telt sanering van verontreinigde grond alleen als kwaliteitsverbetering als uit het taxatierapport blijkt dat sanering nodig is om de woning geschikt te maken voor bewoning (V&N 2026, C.2).
- Checklist: eigendomsinformatie opgevraagd, beperkingen besproken, taxateur heeft bodem beoordeeld, eventuele saneringskosten in begroting en bouwdepot.

## Asbest

- Asbest kan voorkomen in materialen van vóór 1994.
- Het voorgestelde asbestdakenverbod is niet doorgegaan: de Eerste Kamer stemde tegen. Wel blijft vervanging van oude asbestdaken verstandig, en gemeenten kunnen eigen regels hebben.
- Verwijderen mag alleen volgens de asbestregels; voor grotere hoeveelheden is een gecertificeerd bedrijf nodig. In april 2026 kondigde het kabinet een vergunningstelsel voor asbestverwijderaars aan.
- Een asbestinventarisatie vóór aankoop helpt hoge kosten en gezondheidsrisico's te voorkomen, zeker als de klant wil verbouwen.
- Checklist: bouwjaar vóór 1994, asbest vermeld in verkoopinformatie of bouwkundig rapport, verbouwplannen, kosten voor verwijdering in de begroting.

## Erfpacht

- Controleer of de grond in erfpacht is uitgegeven, de canon, de lopende periode (tijdvak), de herzieningsmomenten en de afkoopmogelijkheden (zie k90 en erfpacht.html).
- Bij NHG: traditionele erfpacht van een overheidsinstantie is toegestaan. Bij een erfpachtovereenkomst van vóór 1 januari 1992 moet de erfpacht nog minstens de helft van de looptijd van de lening doorlopen, tenzij onvoorwaardelijke verlenging is afgesproken (V&N 2026, C.4.5). Andere constructies en koperssteun staan op de NHG-lijst.
- De canon telt mee in de woonlasten en de toets.
- Checklist: erfpachtvoorwaarden en canon opgevraagd, canon meegenomen in de lasten, geldverstrekker accepteert de constructie (acceptatiewijzer).

## Let op

Concept. Feiten over Wkpb en BRK-PB komen van kadaster.nl, over asbest van rijksoverheid.nl en infomil.nl, NHG-regels uit documenten/nhg-voorwaarden-normen-2026.pdf. De bodemloket-sites zijn per provincie verschillend en niet afzonderlijk gecontroleerd.`},

 {id:'k147',cat:'hyp',titel:'Checklist woning-due-diligence voor de adviseur: bronnen en wanneer je ze gebruikt',auteur:'u4',datum:'2026-10-03T10:45:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'woning due diligence checklist bronnen BAG Kadaster eigendomsinformatie WOZ-waardeloket EP-Online Klimaateffectatlas KCAF funderingsrisicorapport FunderMaps Funderingscijfer Woningcijfer PandWise Duurzaamheidsprofiel taxatierapport bouwkundig rapport VvE erfpacht bodem asbest dossier vastleggen',
  links:[
   {titel:'Kadaster: Publiekrechtelijke beperkingen',url:'https://www.kadaster.nl/publiekrechtelijke-beperkingen'},
   {titel:'KCAF: Funderingsrisicorapport',url:'https://www.kcaf.nl/funderingsrisicorapport/'},
   {titel:'Klimaateffectatlas',url:'https://klimaatadaptatienederland.nl/hulpmiddelen/overzicht/klimaateffectatlas/'},
   {titel:'RVO: Energielabel woning',url:'https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-woningen'},
   {titel:'NHG: Taxatie van een woning',url:'https://www.nhg.nl/het-krijgen-van-nhg/taxatie-van-een-woning/'},
   {titel:'Documentenchecklist (intern)',url:'documentenchecklist.html'},
   {titel:'Acceptatiewijzer (intern)',url:'acceptatiewijzer.html'},
   {titel:'Rekentools (intern)',url:'rekentools.html'}
  ],
  body:`Een praktische volgorde voor het onderzoek naar de woning, van oriëntatie tot aanbod. Per fase staat welke bron je gebruikt en waarvoor. Achtergrond in k140 tot en met k146.

## Fase 1: oriëntatie (nog geen concrete woning)

- Regio: bekende funderingsproblematiek (KCAF, funderingsviewer indicatieve aandachtsgebieden) en klimaatrisico's (Klimaateffectatlas). Bespreek dit bij het bepalen van de leencapaciteit (AFM Leidraad, voorbeeld 9).
- Leenruimte: energielabel en extra leenruimte (k10, leennormen-2026.html), NHG-grens en energiebespaarbudget.

## Fase 2: concrete woning, vóór het bod

- Feitencheck advertentie: BAG (bouwjaar, oppervlakte, gebruiksdoel) en Kadaster (perceel). PandWise zet dit naast elkaar.
- Energielabel: geregistreerd label in EP-Online; het Duurzaamheidsprofiel als gespreksstarter voor maatregelen.
- Indicaties: Funderingscijfer, KCAF-funderingsrisicorapport, Klimaatcijfer of Klimaateffectatlas.
- WOZ-waarde via het WOZ-waardeloket als referentie, niet als waardebepaling.
- Erfpacht: ja of nee, canon en tijdvak.

## Fase 3: na het bod, vóór het verlopen van de voorbehouden

- Kadaster-eigendomsinformatie met publiekrechtelijke beperkingen (bodem, monument, aanschrijvingen).
- Taxatierapport: gevalideerd, maximaal 6 maanden oud, met funderingsrisicoklasse. Bij klasse D of E: aanvullend of verkennend funderingsonderzoek.
- Bouwkundig rapport als de taxateur dat aangeeft (NHG: meer onderzoek nodig, slechte staat, of herstel boven 10% van de marktwaarde).
- VvE-stukken bij appartementen: reservefonds, meerjarenonderhoudsplan, plannen voor funderingsherstel of verduurzaming.
- Asbest bij bouwjaar vóór 1994, zeker bij verbouwplannen.

## Fase 4: financiering en advies

- Waardebepaling: volledige taxatie of een door de geldverstrekker of NHG toegestane hybride taxatie. Een losse modelwaarde is voor NHG niet voldoende (k142).
- Herstel, verbouwing en verduurzaming in een bouwdepot; marktwaarde na verbetering via fysieke taxatie.
- Betaalbaarheid toetsen inclusief erfpachtcanon, energielasten en een buffer voor onverzekerde risico's. Vanaf 2027 bij NHG ook indicatieve funderingsherstelkosten bij hoog risico.
- Opstalverzekering: herbouwwaarde (herbouwwaarde.html), en wat niet gedekt is (fundering, primaire keringen).

## Fase 5: vastleggen (AFM-relevant)

- Welke bronnen je hebt geraadpleegd, met datum.
- Welke risico's je hebt besproken: fundering, klimaat, bodem, asbest, erfpacht, energielabel.
- Je advies over onderzoek en de keuze van de klant, ook als die afwijkt.
- Hoe risico's zijn meegenomen in de betaalbaarheid en het productadvies.

## Wanneer welke bron (samenvatting)

- Indicatie en gesprek: Funderingscijfer, Woningcijfer, PandWise, Duurzaamheidsprofiel, Klimaateffectatlas, WOZ-waarde.
- Formele basis voor financiering: gevalideerd taxatierapport of toegestane hybride taxatie, bouwkundig rapport, funderingsonderzoek, Kadaster-eigendomsinformatie, geregistreerd energielabel.
- Acceptatie: voorwaarden van de geldverstrekker (acceptatiewijzer.html) en de NHG V&N.

## Let op

Concept. Deze checklist is een hulpmiddel en geen uitputtende norm. De bronnen zijn per artikel (k140 tot en met k146) vermeld.`}
]);
