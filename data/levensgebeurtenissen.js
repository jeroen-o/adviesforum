/* Wegwijzer levensgebeurtenissen voor adviseurs (levensgebeurtenissen.html).
 * Peildatum 2 oktober 2026. Alleen bevestigde termijnen, met bron (zie B).
 * Structuur per gebeurtenis:
 *   id, titel, cat, kort, kw,
 *   verandert: {hypotheek, verzekeringen, pensioen, fiscaal, toeslagen} (arrays met zinnen),
 *   checklist, documenten, zorgplicht (arrays),
 *   termijnen: [{wat, wanneer, bron:<sleutel in B>}],
 *   tools: [{t, url, d}], bronnen: [<sleutels in B>]
 */
(function () {
  var B = {
    leidraad: {t:'AFM: Leidraad Hypotheekadvisering, april 2026 (PDF)', url:'documenten/Leidraad-Hypotheekadvisering-2026.pdf'},
    nhgvn: {t:'NHG: Voorwaarden & Normen 2026-1 (PDF)', url:'documenten/nhg-voorwaarden-normen-2026.pdf'},
    nhgbeheer: {t:'NHG: Financieringslasttabel Beheer 2026, bijlage 5 (PDF)', url:'documenten/nhg-2026-bijlage5-financieringslasttabel-beheer.pdf'},
    toeslagWijz: {t:'Belastingdienst: wijzigingen doorgeven voor uw toeslag', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/wijzigingen_doorgeven/wijzigingen_doorgeven'},
    toeslagKoop: {t:'Belastingdienst: ik ga een huis kopen, gevolgen voor mijn toeslagen', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/toeslagen/wijzigingen_doorgeven/welke_wijzigingen_moet_ik_doorgeven/wonen/ik-koop-een-huis/'},
    toeslagOuderKind: {t:'Belastingdienst: kind of ouder telt sinds 2025 niet meer als toeslagpartner', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/kind-of-ouder-telt-vanaf-2025-niet-meer-als-toeslagpartner'},
    verhuizing: {t:'Rijksoverheid: verhuizing doorgeven aan de gemeente', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/gemeenten/hoe-kan-ik-mijn-verhuizing-doorgeven-aan-de-gemeente'},
    samenwonenBD: {t:'Belastingdienst: u gaat samenwonen', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/relatie_familie_en_gezondheid/relatie/samenwoners/samenwonen'},
    fiscPartner: {t:'Belastingdienst: wanneer ben ik fiscaal partner?', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/relatie_familie_en_gezondheid/relatie/fiscaal_partnerschap/fiscaal_partnerschap'},
    erfPartner: {t:'Belastingdienst: wie zijn partners voor de erfbelasting?', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/partners-voor-de-erfbelasting'},
    erfVrijstelling: {t:'Belastingdienst: vrijstellingen erfbelasting 2026', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/vrijstelling-erfbelasting'},
    verschilRelatie: {t:'Rijksoverheid: verschil huwelijk, geregistreerd partnerschap en samenlevingscontract', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/trouwen-samenlevingscontract-en-geregistreerd-partnerschap/wat-is-het-verschil-tussen-een-huwelijk-geregistreerd-partnerschap-en-samenlevingscontract'},
    trouwen: {t:'Rijksoverheid: waar moet ik aan denken als ik wil trouwen of een partnerschap wil sluiten?', url:'https://www.rijksoverheid.nl/onderwerpen/trouwen-samenlevingscontract-en-geregistreerd-partnerschap/vraag-en-antwoord/trouwen-of-geregistreerd-partnerschap-sluiten'},
    gemeenschap: {t:'Rijksoverheid: trouwen in (beperkte) gemeenschap van goederen', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/trouwen-samenlevingscontract-en-geregistreerd-partnerschap/waar-heb-ik-recht-op-als-ik-trouw-in-gemeenschap-van-goederen'},
    bw1: {t:'Burgerlijk Wetboek Boek 1 (o.a. art. 1:88, toestemming echtgenoot)', url:'https://wetten.overheid.nl/BWBR0002656/'},
    geboorte: {t:'Rijksoverheid: aangifte geboorte', url:'https://www.rijksoverheid.nl/onderwerpen/aangifte-geboorte-en-naamskeuze-kind/vraag-en-antwoord/aangifte-geboorte'},
    kindChecklist: {t:'Rijksoverheid: ik krijg een kind, wat moet ik regelen?', url:'https://www.rijksoverheid.nl/onderwerpen/zwangerschap-en-geboorte/vraag-en-antwoord/checklist-kind-krijgen'},
    kinderbijslag: {t:'SVB: kinderbijslag als u een kind krijgt', url:'https://www.svb.nl/nl/kinderbijslag/u-krijgt-een-kind'},
    kot: {t:'Belastingdienst: kinderopvangtoeslag aanvragen', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/kinderopvangtoeslag/content/hoe-moet-ik-kinderopvangtoeslag-aanvragen'},
    geboorteverlof: {t:'Rijksoverheid: geboorteverlof voor partners', url:'https://www.rijksoverheid.nl/themas/familie-zorg-en-gezondheid/zwangerschap-en-geboorte/geboorteverlof'},
    aanvGeboorteverlof: {t:'UWV: wanneer aanvullend geboorteverlof', url:'https://www.uwv.nl/nl/aanvullend-geboorteverlof/wanneer-aanvullend-geboorteverlof'},
    ouderschapsverlof: {t:'Rijksoverheid: recht op betaald ouderschapsverlof', url:'https://www.rijksoverheid.nl/onderwerpen/ouderschapsverlof/vraag-en-antwoord/wanneer-heb-ik-recht-op-betaald-ouderschapsverlof'},
    scheidenChecklist: {t:'Rijksoverheid: scheiden of uit elkaar, wat moet ik regelen?', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/scheiden/checklist-bij-scheiden-of-uit-elkaar-gaan'},
    scheidenInfo: {t:'Rijksoverheid: informatieblad U gaat scheiden (PDF)', url:'https://www.rijksoverheid.nl/site/binaries/site-content/collections/documents/2016/12/05/u-gaat-scheiden/231024+Informatieblad+Scheiden.pdf'},
    pensioenScheidingMelden: {t:'Rijksoverheid: scheiding melden bij een pensioenuitvoerder', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/scheiden/hoe-meld-ik-mijn-scheiding-of-ontbinding-geregistreerd-partnerschap-bij-een-pensioenuitvoerder'},
    pensioenScheiding: {t:'Rijksoverheid: verdelen ouderdomspensioen na scheiding', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/scheiden/verdelen-ouderdomspensioen-na-scheiding'},
    afmScheiden: {t:'AFM: je gaat uit elkaar of scheiden (pensioen)', url:'https://www.afm.nl/nl-nl/consumenten/themas/producten/pensioen/wat-doen-als/scheiden'},
    renteaftrekScheiding: {t:'Belastingdienst: wie mag de hypotheekrente aftrekken na een scheiding?', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/scheiden/content/wie-mag-hypotheekrente-aftrekken-na-scheiding'},
    alimentatieDuur: {t:'Rijksoverheid: hoe lang betaal ik partneralimentatie?', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/scheiden/hoe-lang-partneralimentatie-betalen'},
    overlijdenChecklist: {t:'Rijksoverheid: overlijden, wat moet u regelen?', url:'https://www.rijksoverheid.nl/onderwerpen/overlijden/vraag-en-antwoord/checklist-bij-overlijden'},
    uitvaart: {t:'Rijksoverheid: wanneer mag een overledene begraven of gecremeerd worden?', url:'https://www.rijksoverheid.nl/onderwerpen/overlijden/vraag-en-antwoord/welke-regels-gelden-er-bij-begraven-en-cremeren'},
    erfTermijn: {t:'Belastingdienst: wanneer moet de aangifte erfbelasting binnen zijn?', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/wanneer-moet-mijn-aangifte-erfbelasting-binnen-zijn'},
    erfAanvaarden: {t:'Rechtspraak: erfenis aanvaarden of verwerpen', url:'https://www.rechtspraak.nl/onderwerpen/erfenis/procedure-erfenis-aanvaarden-of-verwerpen'},
    anw: {t:'SVB: voorwaarden nabestaandenuitkering (Anw)', url:'https://www.svb.nl/nl/anw/wat-zijn-de-voorwaarden/wat-zijn-de-voorwaarden-voor-een-nabestaandenuitkering'},
    wezen: {t:'Rijksoverheid: wanneer hebben kinderen recht op een wezenuitkering?', url:'https://www.rijksoverheid.nl/onderwerpen/algemene-nabestaandenwet-anw/vraag-en-antwoord/wanneer-heb-ik-recht-op-een-wezenuitkering'},
    anwWonen: {t:'SVB: woonsituatie en de nabestaandenuitkering', url:'https://www.svb.nl/nl/anw/uw-woonsituatie-en-de-nabestaandenuitkering'},
    wwAanvragen: {t:'UWV: WW-uitkering aanvragen', url:'https://www.uwv.nl/nl/ww/ww-aanvragen'},
    wwDuur: {t:'UWV: hoe lang duurt een WW-uitkering?', url:'https://www.uwv.nl/nl/ww/hoelang-ww'},
    loondoorbetaling: {t:'Rijksoverheid: hoeveel loon krijg ik doorbetaald als ik ziek ben?', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/ziekteverzuim-van-het-werk/hoeveel-loon-krijg-ik-doorbetaald-als-ik-ziek-ben'},
    wia: {t:'UWV: WIA-uitkering (IVA/WGA) aanvragen', url:'https://www.uwv.nl/nl/wia/wia-aanvragen'},
    stappenplanZiek: {t:'UWV: stappenplan bij ziekte werknemer', url:'https://www.uwv.nl/nl/ziek/re-integratie/stappenplan-zieke-werknemer'},
    baz: {t:'Rijksoverheid: plannen basisverzekering arbeidsongeschiktheid zelfstandigen', url:'https://www.rijksoverheid.nl/themas/werk/hervormingen-arbeidsmarkt/meer-zekerheid-voor-werkenden/verplichte-arbeidsongeschiktheidsverzekering-voor-zelfstandigen'},
    kvk: {t:'KVK: op welke datum moet ik mijn bedrijf inschrijven?', url:'https://www.kvk.nl/starten/op-welke-datum-moet-ik-mijn-bedrijf-inschrijven-bij-kvk/'},
    urencriterium: {t:'Belastingdienst: urencriterium', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/inkomstenbelasting_voor_ondernemers/voorwaarden_urencriterium'},
    zelfstandigenaftrek: {t:'Belastingdienst: zelfstandigenaftrek 2026', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/winst/inkomstenbelasting/veranderingen-inkomstenbelasting-2026/ondernemersaftrek-2026/zelfstandigenaftrek-2026'},
    vorigeWoning: {t:'Belastingdienst: vorige woning staat te koop', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/tijdelijk_2_woningen/vorige_woning_nog_niet_verkocht/vorige_woning_staat_te_koop'},
    nieuweWoningLeeg: {t:'Belastingdienst: nieuwe woning staat leeg of is in aanbouw', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/tijdelijk_2_woningen/nieuwe_woning_leeg_of_in_aanbouw/'},
    tweeWoningen: {t:'Belastingdienst: tijdelijk 2 woningen en renteaftrek', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/tijdelijk-2-woningen-renteaftrek'},
    startersvrijstelling: {t:'Belastingdienst: startersvrijstelling overdrachtsbelasting', url:'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/startersvrijstelling/startersvrijstelling'},
    isde: {t:'RVO: ISDE voor woningeigenaren', url:'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren'},
    schenkTermijn: {t:'Belastingdienst: wanneer moet de aangifte schenkbelasting binnen zijn?', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/wanneer-moet-mijn-aangifte-schenkbelasting-binnen-zijn'},
    jubelton: {t:'Belastingdienst: belastingvrije schenking voor een koopwoning (tot 2024)', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/belastingvrije-schenkingen-voor-koopwoning'},
    aowLeeftijd: {t:'Rijksoverheid: AOW-leeftijd 2025-2031', url:'https://www.rijksoverheid.nl/themas/belastingen-uitkeringen-en-toeslagen/algemene-ouderdomswet-aow/aow-leeftijd'},
    aowAanvragen: {t:'SVB: AOW aanvragen (wonen in Nederland)', url:'https://www.svb.nl/nl/aow/uw-zaken-regelen/aow-aanvragen-in-nederland'},
    aowBuitenland: {t:'SVB: AOW aanvragen als u buiten Nederland woont', url:'https://www.svb.nl/nl/aow/uw-zaken-regelen/aow-aanvragen-buiten-nederland'},
    bedragIneens: {t:'Rijksoverheid: bedrag ineens bij pensionering', url:'https://www.rijksoverheid.nl/themas/werk/pensioen/bedrag-ineens'},
    wtp: {t:'Rijksoverheid: voldoende tijd voor overgang naar nieuw pensioenstelsel', url:'https://www.rijksoverheid.nl/actueel/nieuws/2025/12/02/voldoende-tijd-voor-overgang-naar-nieuw-pensioenstelsel'},
    dnbWtp: {t:'DNB: op weg naar het nieuwe pensioenstelsel', url:'https://www.dnb.nl/actuele-economische-vraagstukken/pensioen/op-weg-naar-het-nieuwe-pensioenstelsel/'},
    mpo: {t:'Mijnpensioenoverzicht.nl', url:'https://www.mijnpensioenoverzicht.nl'},
    emigrerenRO: {t:'Rijksoverheid: wat moet ik regelen als ik ga emigreren?', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/uitkering-meenemen-naar-buitenland/wat-regelen-als-ik-ga-emigreren'},
    uitschrijven: {t:'Rijksoverheid: wanneer moet ik mij uitschrijven bij de gemeente?', url:'https://www.rijksoverheid.nl/onderwerpen/privacy-en-persoonsgegevens/vraag-en-antwoord/uitschrijven-basisregistratie-personen'},
    emigrerenBD: {t:'Belastingdienst: checklist emigreren', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/buitenland/content/emigreren-checklist'},
    conserverend: {t:'Belastingdienst: conserverende aanslag bij emigratie', url:'https://www.belastingdienst.nl/wps/wcm/connect/nl/buitenland/content/conserverende-aanslag-bij-emigratie'},
    vrijwilligVerzekeren: {t:'SVB: voorwaarden vrijwillig verzekeren (AOW/Anw)', url:'https://www.svb.nl/nl/vv/wonen-werken-buiten-nederland/voorwaarden-voor-vrijwillig-verzekeren'},
    vvBuiten: {t:'SVB: u gaat buiten Nederland wonen of werken', url:'https://www.svb.nl/nl/vv/wonen-werken-buiten-nederland/u-gaat-buiten-nederland-wonen-of-werken'},
    mantelzorgwoning: {t:'Rijksoverheid: regels voor de bouw van een mantelzorgwoning', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/bouwregelgeving/bouwregels-mantelzorgwoning'},
    aowHuishouding: {t:'SVB: wat is een gezamenlijke huishouding (AOW)?', url:'https://www.svb.nl/nl/aow/woonsituaties/wat-is-een-gezamenlijke-huishouding'},
    kgMantelzorg: {t:'Kennisgroep Belastingdienst: fiscaal partnerschap en mantelzorg (KG:202:2025:4)', url:'https://kennisgroepen.belastingdienst.nl/publicaties/kg20220254-fiscaal-partnerschap-en-mantelzorg/'},
    kostendelers: {t:'Rijksoverheid: kostendelersnorm in de bijstand', url:'https://www.rijksoverheid.nl/vraag-en-antwoord/bijstand/wat-is-de-kostendelersnorm-in-de-bijstand'}
  };

  var L = [
  /* ------------------------------------------------------------------ */
  {id:'samenwonen', titel:'Samenwonen', cat:'relatie',
   kort:'Twee huishoudens worden er één: eigendom, aansprakelijkheid, toeslagen en de positie van de partner bij overlijden of uit elkaar gaan.',
   kw:'samenwonen samenlevingscontract notarieel inwonen partner trekt in koopwoning samen kopen draagplicht toeslagpartner fiscaal partner erfbelasting partnervrijstelling testament partnerpensioen aanmelden',
   verandert:{
    hypotheek:[
     'Samen kopen: leg de eigendomsverhouding vast in de leveringsakte. Beide partners worden in de regel hoofdelijk aansprakelijk voor de hele lening, ongeacht de eigendomsverhouding.',
     'Partner trekt in een bestaande koopwoning: meetekenen of mede-eigenaar worden is een wijziging van de lening en vraagt toestemming en een nieuwe toets door de geldverstrekker.',
     'Ongelijke inbreng van eigen geld of ongelijke verdeling van de lasten: zonder afspraken ontstaan later discussies over draagplicht en vergoedingen.',
     'De eigen woning van de intrekkende partner tijdelijk verhuren kan alleen met toestemming van de geldverstrekker; bij NHG gelden aanvullende regels (V&N 2026, D.1.4).',
     'Toetsing op twee inkomens: bespreek wat er gebeurt als één inkomen wegvalt door overlijden, arbeidsongeschiktheid of een breuk.'
    ],
    verzekeringen:[
     'Overlijdensrisico: past de dekking bij woonlasten die nu op twee inkomens rusten? Kies bewust tussen een of twee verzekerden en kruislings of niet.',
     'Begunstiging van bestaande ORV en levensverzekeringen nalopen: een omschrijving als "echtgenoot" dekt een ongehuwde partner niet vanzelf.',
     'Inboedel, aansprakelijkheid, rechtsbijstand en reis: dubbele polissen samenvoegen en controleren of de partner als gezinslid meeverzekerd is.'
    ],
    pensioen:[
     'Bij veel pensioenregelingen moet een ongehuwde partner worden aangemeld om recht te hebben op partnerpensioen; vaak is daarvoor een samenlevingscontract nodig. De AFM noemt het een goede praktijk om klanten hierop te wijzen.',
     'Controleer op mijnpensioenoverzicht.nl welk nabestaandenpensioen er is en voor wie.'
    ],
    fiscaal:[
     'Fiscaal partnerschap ontstaat onder meer met een notarieel samenlevingscontract en inschrijving op hetzelfde adres, of als de partners samen een eigen woning hebben waar ze beiden wonen.',
     'Fiscale partners kunnen gemeenschappelijke inkomensbestanddelen, zoals de hypotheekrenteaftrek en box 3, onderling verdelen.',
     'Erfbelasting: een samenwonende partner krijgt alleen de partnervrijstelling bij een notarieel samenlevingscontract met wederzijdse zorgverplichting (en minimaal 6 maanden voldoen aan de voorwaarden), of na minimaal 5 jaar inschrijving op hetzelfde adres.',
     'Zonder testament erven samenwoners niet van elkaar.'
    ],
    toeslagen:[
     'De partner wordt toeslagpartner: het gezamenlijke toetsingsinkomen telt, waardoor huurtoeslag, zorgtoeslag of kindgebonden budget lager kan uitvallen of vervalt.',
     'Ontvangt een van beiden een Anw-, bijstands- of AIO-uitkering, laat dan bij de SVB of gemeente nagaan wat samenwonen met de uitkering doet.'
    ]
   },
   checklist:[
    'Relatievorm en plannen: samenlevingscontract (notarieel of onderhands), kinderwens, trouwplannen?',
    'Eigendomsverhouding en inbreng eigen geld per partner vastleggen.',
    'Gewenste lastenverdeling bespreken en hoe die zich verhoudt tot de eigendom.',
    'Scenario uit elkaar gaan: kan één van beiden de woning alleen houden?',
    'Scenario overlijden: inkomen nabestaande, nabestaandenpensioen, ORV-behoefte.',
    'Scenario arbeidsongeschiktheid en werkloosheid per partner.',
    'Testamenten en partnerpensioen-aanmelding nagaan.',
    'Begunstigingen van bestaande verzekeringen controleren.',
    'Bestaande schulden, studieschuld en BKR-registraties van beide partners.',
    'Toeslagen en uitkeringen van beide partners in kaart brengen; wijziging doorgeven.',
    'Afspraken en risico’s vastleggen in het dossier en het adviesrapport.'
   ],
   documenten:[
    'Legitimatie van beide partners',
    'Samenlevingscontract (en of het notarieel is) en eventuele testamenten',
    'Inkomensgegevens van beide partners (werkgeversverklaring, salarisstroken of jaarcijfers)',
    'Bestaande hypotheekstukken en eigendomsbewijs als een van beiden al een woning heeft',
    'Polisbladen ORV, inboedel, aansprakelijkheid en eventuele levensverzekeringen',
    'Pensioenoverzicht (mijnpensioenoverzicht.nl) van beide partners',
    'Overzicht van schulden en leningen (incl. DUO) en herkomst van eigen geld'
   ],
   termijnen:[
    {wat:'Wijziging (samenwonen, inkomen) doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'},
    {wat:'Verhuizing doorgeven aan de nieuwe gemeente', wanneer:'Uiterlijk 5 dagen na de verhuizing (kan vanaf 4 weken ervoor)', bron:'verhuizing'},
    {wat:'Partnervrijstelling erfbelasting voor samenwoners met notarieel samenlevingscontract', wanneer:'Minimaal 6 maanden vóór het overlijden aan de voorwaarden voldoen; zonder notarieel contract minimaal 5 jaar op hetzelfde adres', bron:'erfPartner'}
   ],
   zorgplicht:[
    'Eén partner is financieel afhankelijk van de ander: zorg dat vooral de partner met het laagste inkomen de gevolgen begrijpt.',
    'Ongelijke inbreng of lastenverdeling zonder schriftelijke afspraken.',
    'Geen testament en geen notarieel samenlevingscontract terwijl de woonlasten op twee inkomens rusten.',
    'Partner niet aangemeld bij het pensioenfonds.',
    'Klant wil geen ORV terwijl de woning bij overlijden niet te houden is: risico, keuze en gevolgen vastleggen.'
   ],
   tools:[
    {t:'Draagplicht en inbreng', url:'draagplicht.html', d:'Verhouding tussen eigendom, inbreng en lasten'},
    {t:'Leennormen 2026', url:'leennormen-2026.html', d:'Maximale hypotheek op twee inkomens'},
    {t:'Overlijdensrisico benodigd bedrag', url:'orv.html', d:'Hoeveel dekking de nabestaande nodig heeft'},
    {t:'Overlijdensrisicoscan', url:'scan-overlijdensrisico.html', d:'Klantscan voor de ORV-behoefte'},
    {t:'Rekenhulp: recht op toeslagen', url:'rekentools.html#toeslagen-check', d:'Snelle check na samenwonen'},
    {t:'Rekenhulp: toetsingsinkomen toeslagen', url:'rekentools.html#toetsingsinkomen', d:'Gezamenlijk inkomen bepalen'},
    {t:'Rekenhulp: huren of kopen', url:'rekentools.html#huren-of-kopen', d:'Samen huren of samen kopen vergelijken'},
    {t:'Inventarisatie en klantprofiel', url:'inventarisatie.html', d:'Gegevens van beide partners vastleggen'}
   ],
   bronnen:['samenwonenBD','fiscPartner','erfPartner','verschilRelatie','toeslagWijz','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'trouwen', titel:'Trouwen of geregistreerd partnerschap', cat:'relatie',
   kort:'Huwelijksvermogensrecht, erfrecht, partnerpensioen en fiscaal partnerschap veranderen in één keer.',
   kw:'trouwen huwelijk geregistreerd partnerschap huwelijkse voorwaarden partnerschapsvoorwaarden beperkte gemeenschap van goederen 2018 vergoedingsrecht verrekenbeding erfrecht wettelijke verdeling langstlevende toestemming echtgenoot',
   verandert:{
    hypotheek:[
     'Sinds 1 januari 2018 trouwt men standaard in beperkte gemeenschap van goederen: wat vóór het huwelijk al gezamenlijk was en wat tijdens het huwelijk wordt verkregen valt erin; wat vooraf privé was, erfenissen en schenkingen blijven privé.',
     'Een woning die vóór het huwelijk van één partner was, blijft van die partner. Voor verkoop of het hypothekeren van de echtelijke woning is wel toestemming van de echtgenoot nodig (art. 1:88 BW).',
     'Wordt privégeld (bijvoorbeeld een erfenis) in de gezamenlijke woning gestoken, dan kan een vergoedingsrecht ontstaan. Leg vast wie wat inbrengt.',
     'Huwelijkse of partnerschapsvoorwaarden kunnen vóór of tijdens het huwelijk bij de notaris worden gemaakt; zij bepalen mede wie bij een breuk de woning en de schuld draagt.'
    ],
    verzekeringen:[
     'Begunstiging van ORV en levensverzekeringen nalopen; "echtgenoot" als begunstigde werkt nu wel.',
     'Is er al een ORV uit de samenwoonperiode, controleer dan of verzekerd bedrag en looptijd nog passen.'
    ],
    pensioen:[
     'Een echtgenoot of geregistreerd partner is in de regel automatisch partner voor het pensioenfonds; controleer het nabestaandenpensioen op mijnpensioenoverzicht.nl.',
     'Het ouderdomspensioen dat tijdens het huwelijk wordt opgebouwd, wordt bij een latere scheiding in principe gelijk verdeeld (zie de kaart Scheiding).'
    ],
    fiscaal:[
     'Gehuwden en geregistreerd partners zijn fiscaal partner. Wie in de loop van het jaar partner wordt, kan in bepaalde gevallen kiezen om het hele jaar als fiscaal partner te gelden.',
     'Erfrecht: zonder testament geldt de wettelijke verdeling, waarbij de langstlevende echtgenoot de goederen krijgt en de kinderen een vordering.',
     'Partnervrijstelling erfbelasting 2026 voor echtgenoot of geregistreerd partner: € 828.035.'
    ],
    toeslagen:[
     'Was het stel nog geen toeslagpartner, dan nu wel: gezamenlijk toetsingsinkomen en vermogen tellen.'
    ]
   },
   checklist:[
    'Gemeenschap van goederen of voorwaarden? Bij voorwaarden: welk beding (verrekenbeding, finaal verrekenbeding)?',
    'Onderneming van een van beiden: valt die in de gemeenschap en wat betekent dat voor schulden?',
    'Eigendom van de woning: privé of gemeenschappelijk, en welke vergoedingsrechten bestaan?',
    'Testamenten (opnieuw) laten opstellen of herzien.',
    'Nabestaandenpensioen en ORV-dekking opnieuw doorrekenen.',
    'Begunstigingen van polissen aanpassen.',
    'Toeslagen en uitkeringen controleren en wijziging doorgeven.',
    'Plannen voor kinderen of minder werken bespreken.'
   ],
   documenten:[
    'Huwelijksakte of akte van partnerschap',
    'Huwelijkse of partnerschapsvoorwaarden',
    'Testamenten',
    'Eigendomsakte en hypotheekstukken',
    'Polisbladen ORV en levensverzekeringen met begunstiging',
    'Pensioenoverzicht van beide partners'
   ],
   termijnen:[
    {wat:'Melding voorgenomen huwelijk of partnerschap bij de gemeente', wanneer:'Minimaal 2 weken vóór de datum', bron:'trouwen'},
    {wat:'Wijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'}
   ],
   zorgplicht:[
    'Ondernemer trouwt in gemeenschap: zakelijke schulden kunnen de gezamenlijke woning raken.',
    'Grote privé-inbreng in de woning zonder vastgelegde afspraken.',
    'Een partner zonder eigen inkomen of pensioenopbouw.',
    'Klant denkt dat een oude ORV of oud testament nog past.'
   ],
   tools:[
    {t:'Draagplicht en inbreng', url:'draagplicht.html', d:'Inbreng en lasten tussen partners'},
    {t:'Rekenhulp: vergoedingsrecht tussen echtgenoten', url:'rekentools.html#vergoedingsrecht-echtgenoten', d:'Privégeld in gezamenlijke woning'},
    {t:'Rekenhulp: erfdelen wettelijke verdeling', url:'rekentools.html#erfdeel', d:'Wat erft wie zonder testament'},
    {t:'Rekenhulp: erfbelasting bij wettelijke verdeling', url:'rekentools.html#erfbelasting-wettelijke-verdeling', d:'Belasting per erfgenaam'},
    {t:'Rekenhulp: budget voor een bruiloft', url:'rekentools.html#kosten-bruiloft', d:'Wat kost de dag zelf'},
    {t:'Overlijdensrisico benodigd bedrag', url:'orv.html', d:'Dekking na herberekening'},
    {t:'Pensioenscan', url:'scan-pensioen.html', d:'Nabestaanden- en ouderdomspensioen'}
   ],
   bronnen:['gemeenschap','trouwen','verschilRelatie','bw1','fiscPartner','erfVrijstelling','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'kind', titel:'Kind krijgen', cat:'relatie',
   kort:'Meer uitgaven, vaak minder werken en een groter belang bij dekking voor overlijden en arbeidsongeschiktheid.',
   kw:'kind krijgen zwanger geboorte baby kinderbijslag kindgebonden budget kinderopvangtoeslag geboorteverlof ouderschapsverlof combinatiekorting voogdij testament wezenpensioen nabestaanden parttime',
   verandert:{
    hypotheek:[
     'De leennormen gaan uit van een huishouden zonder kinderen; het maximum zegt dus niets over wat met kinderen betaalbaar is.',
     'Minder uren werken en kosten van kinderopvang verlagen de draagkracht. Reken de woonlasten door op het nieuwe netto-inkomen.',
     'Een groter huis nodig? Zie de kaart Verhuizen of doorstromen.'
    ],
    verzekeringen:[
     'ORV: de behoefte stijgt, omdat de nabestaande ook de zorg voor een kind heeft. Herbereken verzekerd bedrag en looptijd.',
     'Arbeidsongeschiktheid: bestaat er een WIA-hiaat of een AOV-tekort, en past dat nog?',
     'Kind aanmelden bij de zorgverzekeraar; controleer of aansprakelijkheid en reisverzekering het gezin dekken.'
    ],
    pensioen:[
     'Controleer het nabestaandenpensioen en een eventueel wezenpensioen in de pensioenregeling.',
     'De Anw-nabestaandenuitkering kan gelden als de nabestaande een kind jonger dan 18 verzorgt dat niet tot een ander huishouden behoort; kinderen kunnen recht hebben op een wezenuitkering.'
    ],
    fiscaal:[
     'Werkende ouders met een kind jonger dan 12 kunnen recht hebben op de combinatiekorting (voorwaarden: zie Belastingdienst).',
     'Testament: regel voogdij en eventueel een bewind over wat het kind erft.'
    ],
    toeslagen:[
     'Kinderbijslag: na de geboorteaangifte stuurt de SVB voor het eerste kind binnen 4 weken bericht; voor volgende kinderen past de SVB het bedrag zelf aan.',
     'Kindgebonden budget wordt door Dienst Toeslagen toegekend op basis van inkomen en vermogen.',
     'Kinderopvangtoeslag moet de klant zelf aanvragen, binnen 3 maanden na de maand waarin de opvang begint.',
     'Partner: 1 week geboorteverlof en maximaal 5 weken aanvullend geboorteverlof (uitkering max. 70% van het dagloon), op te nemen binnen 6 maanden na de geboorte.',
     'Werknemers hebben recht op 9 weken betaald ouderschapsverlof (70%) als dat binnen het eerste levensjaar wordt opgenomen.'
    ]
   },
   checklist:[
    'Uitgerekende datum en gewenste verdeling van werk en zorg na de geboorte.',
    'Inkomen tijdens verlof (zwangerschap, geboorteverlof, ouderschapsverlof) per partner.',
    'Kosten kinderopvang en verwachte toeslag.',
    'Betaalbaarheid woonlasten op het nieuwe netto-inkomen.',
    'ORV-behoefte herberekenen inclusief Anw en nabestaandenpensioen.',
    'Arbeidsongeschiktheid: WIA-hiaat of AOV-dekking per partner.',
    'Testament en voogdij.',
    'Begunstigingen en gezinsdekking van polissen.',
    'Verhuisplannen of verbouwplannen.',
    'Wijzigingen doorgeven aan adviseur en Dienst Toeslagen.'
   ],
   documenten:[
    'Recente salarisstroken en eventuele afspraken over minder uren',
    'Contract en kostenopgave kinderopvang',
    'Polisbladen ORV, AOV en woonlastenverzekering',
    'Pensioenoverzicht met nabestaanden- en wezenpensioen',
    'Huidige hypotheekgegevens',
    'Testament (indien aanwezig)'
   ],
   termijnen:[
    {wat:'Geboorteaangifte bij de gemeente van geboorte', wanneer:'Binnen 3 dagen na de geboorte (dag van geboorte telt niet; bij weekend of feestdag minimaal 2 werkdagen)', bron:'geboorte'},
    {wat:'Kinderopvangtoeslag aanvragen', wanneer:'Binnen 3 maanden na de maand van de eerste opvangdag', bron:'kot'},
    {wat:'Aanvullend geboorteverlof partner opnemen', wanneer:'Binnen 6 maanden na de geboorte', bron:'aanvGeboorteverlof'},
    {wat:'Betaald deel ouderschapsverlof (9 weken)', wanneer:'Opnemen binnen 1 jaar na de geboorte', bron:'ouderschapsverlof'},
    {wat:'Kinderbijslag (eerste kind)', wanneer:'SVB stuurt binnen 4 weken na de geboorteaangifte bericht', bron:'kinderbijslag'},
    {wat:'Wijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'}
   ],
   zorgplicht:[
    'Geen of een te lage ORV of AOV terwijl het gezin afhankelijk wordt van één inkomen.',
    'Klant gaat minder werken, maar de hypotheek is op het oude inkomen afgestemd.',
    'Maximale financiering kort voor de geboorte zonder rekening met kinderkosten.',
    'Geen testament of voogdijregeling.'
   ],
   tools:[
    {t:'Rekenhulp: netto kosten kinderopvang', url:'rekentools.html#kosten-kinderopvang', d:'Kosten na toeslag'},
    {t:'Rekenhulp: kinderopvangtoeslag', url:'rekentools.html#kinderopvangtoeslag', d:'Indicatie toeslag'},
    {t:'Rekenhulp: kindgebonden budget', url:'rekentools.html#kindgebonden-budget', d:'Indicatie per jaar'},
    {t:'Rekenhulp: kinderbijslag per kwartaal', url:'rekentools.html#kinderbijslag-per-kwartaal', d:'Bedragen per leeftijd'},
    {t:'Rekenhulp: inkomen tijdens ouderschapsverlof', url:'rekentools.html#ouderschapsverlof', d:'Netto-effect van verlof'},
    {t:'Rekenhulp: aanvullend geboorteverlof', url:'rekentools.html#geboorteverlof-partner', d:'Inkomen van de partner'},
    {t:'Rekenhulp: combinatiekorting', url:'rekentools.html#combinatiekorting', d:'Korting voor werkende ouders'},
    {t:'Rekenhulp: netto bij meer of minder uren', url:'rekentools.html#netto-meer-minder-uren', d:'Wat minder werken netto kost'},
    {t:'Overlijdensrisico benodigd bedrag', url:'orv.html', d:'Nieuwe ORV-behoefte'},
    {t:'AOV tekort en wachttijd', url:'aov-tekort.html', d:'Gat bij arbeidsongeschiktheid'},
    {t:'Inkomen bij ziekte werknemer', url:'inkomen-ziekte-werknemer.html', d:'Loondoorbetaling en WIA'},
    {t:'Wijziging doorgeven aan je adviseur', url:'wijziging-doorgeven.html', d:'Formulier voor de klant'}
   ],
   bronnen:['geboorte','kindChecklist','kinderbijslag','kot','geboorteverlof','aanvGeboorteverlof','ouderschapsverlof','anw','wezen','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'scheiding', titel:'Scheiding of uit elkaar gaan', cat:'relatie',
   kort:'Woning houden, uitkopen of verkopen; ontslag uit hoofdelijke aansprakelijkheid, alimentatie en pensioenverdeling.',
   kw:'scheiding echtscheiding uit elkaar relatiebreuk uitkopen partner ontslag hoofdelijke aansprakelijkheid akte van verdeling alimentatie partneralimentatie kinderalimentatie pensioenverevening verdelen ouderdomspensioen restschuld convenant ouderschapsplan NHG explain',
   verandert:{
    hypotheek:[
     'Drie routes: één partner blijft en koopt de ander uit, de woning wordt verkocht, of beiden blijven tijdelijk eigenaar. Elke route vraagt een eigen berekening.',
     'Uitkopen betekent een nieuwe toets op één inkomen, inclusief alimentatie die wordt betaald of ontvangen. Bij NHG is een explain mogelijk met de Financieringslasttabel Beheer (V&N 2026, D.4).',
     'Ontslag uit de hoofdelijke aansprakelijkheid vraagt toestemming van de geldverstrekker. Bij NHG gelden voorwaarden zoals: de vertrekker is geen eigenaar meer en heeft de woning verlaten, en er zijn geen achterstanden.',
     'Verkoop met overwaarde: de eigenwoningreserve kan doorwerken in een volgende woning (bijleenregeling). Verkoop met verlies: restschuld en eventueel NHG-kwijtschelding.'
    ],
    verzekeringen:[
     'ORV: verzekerden, verzekerd bedrag en begunstiging herzien; denk aan een ORV om alimentatie zeker te stellen.',
     'Gezamenlijke polissen (inboedel, aansprakelijkheid, rechtsbijstand, auto) splitsen of beëindigen.',
     'AOV en woonlastenverzekering opnieuw afstemmen op de nieuwe lasten.'
    ],
    pensioen:[
     'Ex-echtgenoten en ex-geregistreerd partners hebben recht op de helft van het tijdens het huwelijk opgebouwde ouderdomspensioen, tenzij anders afgesproken.',
     'Melden binnen 2 jaar bij de pensioenuitvoerder (mededelingsformulier): dan betaalt de uitvoerder rechtstreeks aan de ex-partner. Later melden betekent vaak dat de ex-partners het zelf moeten regelen.',
     'Samenwoners zonder afspraken hebben geen wettelijk recht op verdeling.'
    ],
    fiscaal:[
     'Het fiscaal partnerschap eindigt. Verlaat een partner de woning terwijl de ex blijft wonen, dan blijft de woning voor de vertrekker hooguit 2 jaar een eigen woning voor de renteaftrek.',
     'Partneralimentatie is voor de betaler aftrekbaar en voor de ontvanger belast; kinderalimentatie niet.',
     'Partneralimentatie duurt sinds 2020 maximaal 5 jaar (of de helft van de huwelijksduur), met uitzonderingen (o.a. kinderen tot 12 jaar, lange huwelijken).'
    ],
    toeslagen:[
     'Elk huishouden krijgt een eigen toetsingsinkomen: zorgtoeslag, huurtoeslag en kindgebonden budget opnieuw aanvragen of aanpassen.',
     'Kinderbijslag en kindgebonden budget gaan in de regel naar de ouder bij wie het kind woont of die het meest bijdraagt.'
    ]
   },
   checklist:[
    'Huwelijksvermogensregime of samenlevingscontract: wat valt te verdelen?',
    'Wens per partner: blijven, uitkopen of verkopen?',
    'Actuele woningwaarde en schuld per leningdeel (incl. fiscale historie en boeterente).',
    'Toets blijver op één inkomen incl. alimentatie; NHG-explain of Financieringslasttabel Beheer nodig?',
    'Ontslag hoofdelijke aansprakelijkheid: voorwaarden en planning bij de geldverstrekker.',
    'Alimentatie: hoogte, duur en fiscale gevolgen voor beide partijen.',
    'Pensioenverdeling en melding bij de uitvoerder(s).',
    'ORV en begunstiging, zeker als er alimentatie of kinderen zijn.',
    'Eigenwoningreserve of restschuld per partner vastleggen.',
    'Toeslagen, uitkeringen en verhuizing per partner.',
    'Wie is je klant? Bij advies aan beide ex-partners: belangen scheiden of één partij doorverwijzen.'
   ],
   documenten:[
    'Echtscheidingsconvenant en ouderschapsplan, of (concept)beschikking',
    'Huwelijkse voorwaarden of samenlevingscontract',
    'Akte van verdeling (notaris) of conceptversie',
    'Taxatierapport en recent hypotheekoverzicht per leningdeel',
    'Alimentatieberekening',
    'Inkomensgegevens van de blijvende partner',
    'Pensioenoverzichten van beide partners',
    'Polisbladen ORV, AOV, woonlasten- en schadeverzekeringen'
   ],
   termijnen:[
    {wat:'Echtscheidingsbeschikking laten inschrijven in de registers van de burgerlijke stand', wanneer:'Binnen 6 maanden; pas daarna is de scheiding rechtsgeldig', bron:'scheidenInfo'},
    {wat:'Scheiding melden bij de pensioenuitvoerder(s)', wanneer:'Binnen 2 jaar na de scheiding', bron:'pensioenScheidingMelden'},
    {wat:'Renteaftrek voor de partner die de woning verlaat (ex blijft wonen)', wanneer:'Maximaal 2 jaar na vertrek', bron:'renteaftrekScheiding'},
    {wat:'Duur partneralimentatie (afspraken sinds 2020)', wanneer:'Maximaal 5 jaar of de helft van de huwelijksduur, met uitzonderingen', bron:'alimentatieDuur'},
    {wat:'Wijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'},
    {wat:'Verhuizing doorgeven aan de gemeente', wanneer:'Uiterlijk 5 dagen na de verhuizing', bron:'verhuizing'}
   ],
   zorgplicht:[
    'Betalingsachterstanden of dreigende achterstanden: tijdig contact met de geldverstrekker.',
    'De blijvende partner kan de lasten alleen dragen met een explain of een aflossingsvrij deel: onderbouw de keuze en leg die vast.',
    'Adviseren van beide ex-partners tegelijk: mogelijk belangenconflict.',
    'De partner met het laagste inkomen overziet de gevolgen niet.',
    'Restschuld zonder duidelijk aflosplan.',
    'Pensioenmelding vergeten of alimentatie niet afgedekt bij overlijden van de betaler.'
   ],
   tools:[
    {t:'Rekenhulp: partner uitkopen', url:'rekentools.html#uitkoop', d:'Uitkoopsom en nieuwe financiering'},
    {t:'Rekenhulp: partneralimentatie (indicatie)', url:'rekentools.html#partneralimentatie-indicatie', d:'Hoogte en duur'},
    {t:'Rekenhulp: partneralimentatie netto', url:'rekentools.html#partneralimentatie-netto', d:'Effect voor betaler en ontvanger'},
    {t:'Rekenhulp: kinderalimentatie (indicatie)', url:'rekentools.html#kinderalimentatie-indicatie', d:'Bijdrage per kind'},
    {t:'Rekenhulp: alimentatie geïndexeerd', url:'rekentools.html#alimentatie-indexering', d:'Jaarlijkse indexering'},
    {t:'Rekenhulp: vergoedingsrecht', url:'rekentools.html#vergoedingsrecht-echtgenoten', d:'Privé-inbreng terugrekenen'},
    {t:'Rekenhulp: gesubsidieerde rechtsbijstand', url:'rekentools.html#rechtsbijstand-toets', d:'Recht op toevoeging'},
    {t:'Draagplicht en inbreng', url:'draagplicht.html', d:'Onderlinge verhouding'},
    {t:'NHG-beheertoets 2026', url:'nhg-beheertoets.html', d:'Toets bij ontslag hoofdelijke aansprakelijkheid'},
    {t:'NHG-check 2026', url:'nhg-check.html', d:'Past de nieuwe lening binnen NHG?'},
    {t:'Leennormen 2026', url:'leennormen-2026.html', d:'Toets op één inkomen'},
    {t:'Eigenwoningreserve en bijleenregeling', url:'bijleenregeling.html', d:'Gevolgen bij verkoop'},
    {t:'Overlijdensrisico benodigd bedrag', url:'orv.html', d:'Dekking na de scheiding'}
   ],
   bronnen:['scheidenChecklist','scheidenInfo','pensioenScheiding','pensioenScheidingMelden','afmScheiden','renteaftrekScheiding','alimentatieDuur','nhgvn','nhgbeheer','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'overlijden', titel:'Overlijden van de partner', cat:'relatie',
   kort:'Uitkeringen aanvragen, woning behouden of niet, nalatenschap en erfbelasting, zonder overhaaste beslissingen.',
   kw:'overlijden partner weduwe weduwnaar nabestaande ORV uitkering nabestaandenpensioen Anw wezenuitkering erfbelasting aangifte nalatenschap beneficiair aanvaarden verwerpen executeur verklaring van erfgenamen woning behouden NHG erfgenaam uitvaart',
   verandert:{
    hypotheek:[
     'Kan de nabestaande de woning houden op eigen inkomen plus nabestaandenpensioen, Anw en eventuele ORV-uitkering? Reken dit opnieuw door.',
     'Een ORV-uitkering hoeft niet automatisch volledig naar aflossing. Weeg aflossen af tegen een buffer en de toekomstige lasten.',
     'Bij NHG kan een erfgenaam die blijft wonen de lening voortzetten als hij hoofdelijk aansprakelijk, enig eigenaar en al bewoner was (V&N 2026, D.1.2.2).',
     'Kijk in de leningvoorwaarden of aflossen bij overlijden boetevrij is.'
    ],
    verzekeringen:[
     'ORV- en uitvaartclaims indienen; houd de overlijdensakte en polisnummers bij de hand.',
     'Polissen op naam van de overledene omzetten of beëindigen (auto, inboedel, opstal, AOV).',
     'Herzie de eigen dekking van de nabestaande: ORV voor de kinderen, AOV, uitvaart.'
    ],
    pensioen:[
     'Nabestaandenpensioen en eventueel wezenpensioen aanvragen of controleren bij de pensioenuitvoerder(s).',
     'Anw-nabestaandenuitkering: mogelijk bij zorg voor een thuiswonend kind jonger dan 18, of bij minimaal 45% arbeidsongeschiktheid; aanvragen bij de SVB.',
     'Kinderen kunnen recht hebben op een Anw-wezenuitkering.'
    ],
    fiscaal:[
     'Aangifte erfbelasting: voor overlijdens vanaf 1 januari 2026 binnen 20 maanden, voor eerdere overlijdens binnen 8 maanden.',
     'Partnervrijstelling erfbelasting 2026: € 828.035 (gehuwd, geregistreerd of samenwonend partner die aan de voorwaarden voldoet).',
     'Erfgenamen kiezen tussen zuiver aanvaarden, beneficiair aanvaarden of verwerpen; beneficiair en verwerpen via een verklaring bij de rechtbank.',
     'Er moet nog aangifte inkomstenbelasting worden gedaan voor de overledene.'
    ],
    toeslagen:[
     'De nabestaande is voortaan alleenstaand voor toeslagen; zorgtoeslag en huurtoeslag opnieuw bekijken.',
     'Een AOW-gerechtigde nabestaande krijgt voortaan AOW voor een alleenstaande.'
    ]
   },
   checklist:[
    'Tijd geven: welke beslissingen moeten nu, welke kunnen later?',
    'Inventaris van uitkeringen: ORV, nabestaandenpensioen, Anw, wezenpensioen, uitvaart.',
    'Status van claims en verwachte uitbetaling; overbrugging nodig?',
    'Woonlasten op het nieuwe inkomen doorrekenen.',
    'Testament, executeur, verklaring van erfgenamen.',
    'Nalatenschap met mogelijke schulden: beneficiair aanvaarden bespreken.',
    'Aflossen met de ORV-uitkering of niet?',
    'Polissen omzetten of opzeggen.',
    'Erfbelasting: termijn en wie de aangifte doet.',
    'Toeslagen en eigen voorzieningen van de nabestaande herzien.'
   ],
   documenten:[
    'Akte van overlijden',
    'Verklaring van erfgenamen of verklaring van executele',
    'Testament (via de notaris of het Centraal Testamentenregister)',
    'Polissen ORV, uitvaart, levens- en kapitaalverzekeringen',
    'Hypotheekoverzicht per leningdeel',
    'Pensioenoverzicht en beschikkingen nabestaandenpensioen en Anw',
    'Bankafschriften en overzicht vaste lasten'
   ],
   termijnen:[
    {wat:'Aangifte van overlijden en uitvaart', wanneer:'Uitvaart niet eerder dan 36 uur en uiterlijk 6 werkdagen na het overlijden; aangifte vóór de uitvaart', bron:'uitvaart'},
    {wat:'Aangifte erfbelasting, overlijden vanaf 1 januari 2026', wanneer:'Binnen 20 maanden na het overlijden', bron:'erfTermijn'},
    {wat:'Aangifte erfbelasting, overlijden vóór 2026', wanneer:'Binnen 8 maanden na het overlijden (uitstel aan te vragen)', bron:'erfTermijn'},
    {wat:'Wijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'}
   ],
   zorgplicht:[
    'Rouwende klant: geen ingrijpende beslissingen onder tijdsdruk, plan een vervolggesprek.',
    'Nalatenschap met onbekende schulden: risico bij zuiver aanvaarden.',
    'Uitkeringen komen later dan de lasten: risico op achterstanden.',
    'Klant wil alles aflossen en houdt geen buffer over.',
    'Nabestaande heeft de financiën nooit zelf beheerd.'
   ],
   tools:[
    {t:'Overlijdensrisico benodigd bedrag', url:'orv.html', d:'Toets van de dekking'},
    {t:'Overlijdensrisicoscan', url:'scan-overlijdensrisico.html', d:'Klantscan'},
    {t:'Uitvaartscan', url:'scan-uitvaart.html', d:'Dekking uitvaartkosten'},
    {t:'Rekenhulp: netto nabestaandenpensioen en Anw', url:'rekentools.html#nabestaandenuitkering', d:'Inkomen van de nabestaande'},
    {t:'Rekenhulp: erfdelen', url:'rekentools.html#erfdeel', d:'Wettelijke verdeling'},
    {t:'Rekenhulp: erfbelasting per verkrijger', url:'rekentools.html#erfbelasting', d:'Belasting per erfgenaam'},
    {t:'Rekenhulp: vruchtgebruik waarderen', url:'rekentools.html#waarde-vruchtgebruik', d:'Testament met vruchtgebruik'},
    {t:'Rekenhulp: uitkering kapitaalverzekering eigen woning', url:'rekentools.html#kapitaalverzekering-eigen-woning', d:'Fiscale behandeling'},
    {t:'Rekenhulp: uitvaartkosten', url:'rekentools.html#uitvaartkosten', d:'Kosten en dekking'},
    {t:'NHG-beheertoets 2026', url:'nhg-beheertoets.html', d:'Voortzetten door de nabestaande'},
    {t:'Extra aflossen', url:'extra-aflossen.html', d:'Lagere last of kortere looptijd'}
   ],
   bronnen:['overlijdenChecklist','uitvaart','erfTermijn','erfVrijstelling','erfPartner','erfAanvaarden','anw','wezen','nhgvn','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'werkloos', titel:'Baanverlies of werkloosheid', cat:'werk',
   kort:'WW tijdig aanvragen, woonlasten bewaken en de ontslagvergoeding verstandig inzetten.',
   kw:'werkloos ontslag baanverlies WW-uitkering vaststellingsovereenkomst transitievergoeding ontslagvergoeding woonlastenverzekering betalingsachterstand bijstand dagloon arbeidsverleden reorganisatie',
   verandert:{
    hypotheek:[
     'Toets of de woonlasten met een WW-uitkering en daarna mogelijk een lager inkomen te dragen zijn.',
     'Een nieuwe of hogere hypotheek is tijdens werkloosheid lastig; plannen voor verhuizen of verbouwen opnieuw bekijken.',
     'Dreigt een achterstand, neem dan vroeg contact op met de geldverstrekker. Geldverstrekkers hebben vaak tijdelijke oplossingen.',
     'Extra aflossen met een ontslagvergoeding: kijk naar boetevrije ruimte, maar houd liquiditeit aan.'
    ],
    verzekeringen:[
     'Woonlastenverzekering met werkloosheidsdekking: claim indienen; controleer wachttijd, eigen risico en maximale uitkeringsduur in de polis.',
     'Collectieve regelingen via de werkgever (zorgverzekering, WIA-hiaat, AOV) eindigen meestal bij uitdiensttreding: zelf voortzetten?',
     'Lopende premies van ORV en AOV: blijven ze betaalbaar?'
    ],
    pensioen:[
     'Pensioenopbouw bij de werkgever stopt; de aanspraak blijft premievrij staan.',
     'Een ontslagvergoeding kan, onder voorwaarden, in een lijfrente worden gestort binnen de jaar- of reserveringsruimte.'
    ],
    fiscaal:[
     'Een ontslagvergoeding is loon in box 1 en verhoogt het inkomen in het jaar van uitbetaling.',
     'Voorlopige aanslag of teruggaaf aanpassen aan het lagere inkomen.'
    ],
    toeslagen:[
     'Een lager jaarinkomen kan recht geven op (meer) toeslagen: inkomen aanpassen bij Dienst Toeslagen.',
     'Na de WW: mogelijk Toeslagenwet of bijstand; gemeenten passen bij de bijstand de kostendelersnorm toe.'
    ]
   },
   checklist:[
    'Datum laatste werkdag en eerste werkloze dag.',
    'WW aangevraagd of gepland? Duur op basis van arbeidsverleden.',
    'Hoogte en vorm van de ontslagvergoeding; is de vaststellingsovereenkomst juridisch getoetst?',
    'Woonlasten en vaste lasten naast de WW-uitkering.',
    'Woonlastenverzekering en andere dekkingen controleren.',
    'Buffer: hoeveel maanden kan de klant overbruggen?',
    'Collectieve verzekeringen die vervallen.',
    'Kans op ander werk en verwacht toekomstig inkomen.',
    'Toeslagen aanpassen.',
    'Afspraak voor een vervolgcontact (bijvoorbeeld na 3 maanden).'
   ],
   documenten:[
    'Ontslagbrief, vaststellingsovereenkomst of beschikking',
    'Laatste salarisstroken en jaaropgaaf',
    'WW-beschikking en verzekeringsbericht (Mijn UWV)',
    'Polis woonlastenverzekering',
    'Hypotheekoverzicht met boetevrije ruimte',
    'Overzicht van vaste lasten en spaargeld'
   ],
   termijnen:[
    {wat:'WW-uitkering aanvragen', wanneer:'Vanaf 1 week vóór en uiterlijk 1 week na de eerste werkloze dag; te laat aanvragen kan leiden tot een lagere of geen uitkering', bron:'wwAanvragen'},
    {wat:'Beslissing op de WW-aanvraag', wanneer:'Binnen 4 weken na de eerste werkloze dag', bron:'wwAanvragen'},
    {wat:'Duur WW-uitkering', wanneer:'Minimaal 3 en maximaal 24 maanden, afhankelijk van het arbeidsverleden', bron:'wwDuur'},
    {wat:'Inkomenswijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'}
   ],
   zorgplicht:[
    'Betalingsachterstand of een klant die de geldverstrekker niet durft te bellen.',
    'Vaststellingsovereenkomst zonder juridisch advies (risico voor het WW-recht).',
    'Klant wil de ontslagvergoeding volledig aflossen en houdt geen buffer.',
    'Rentemiddeling of oversluiten om de maandlast te drukken zonder volledige afweging.',
    'Nieuwe consumptieve leningen om lasten te betalen.'
   ],
   tools:[
    {t:'Inkomen bij werkloosheid', url:'werkloosheid.html', d:'WW-uitkering en duur'},
    {t:'Rekenhulp: transitievergoeding', url:'rekentools.html#transitievergoeding', d:'Wettelijke vergoeding'},
    {t:'Rekenhulp: netto ontslagvergoeding', url:'rekentools.html#ontslagvergoeding-netto', d:'Netto uitbetaling'},
    {t:'Rekenhulp: ontslagvergoeding besteden', url:'rekentools.html#ontslagvergoeding-besteden', d:'Uitbetalen of lijfrente'},
    {t:'Rekenhulp: opzegtermijn', url:'rekentools.html#opzegtermijn', d:'Wettelijke termijn'},
    {t:'Rekenhulp: dagloon UWV', url:'rekentools.html#dagloon-uwv', d:'Basis van de uitkering'},
    {t:'Rekenhulp: netto uitkering', url:'rekentools.html#netto-uitkering', d:'Netto per maand'},
    {t:'Rekenhulp: recht op toeslagen', url:'rekentools.html#toeslagen-check', d:'Na inkomensdaling'},
    {t:'Extra aflossen', url:'extra-aflossen.html', d:'Wat aflossen oplevert'},
    {t:'Rentemiddeling', url:'rentemiddeling.html', d:'Gemiddelde rente bij verlengen'}
   ],
   bronnen:['wwAanvragen','wwDuur','toeslagWijz','kostendelers','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'ziek', titel:'Arbeidsongeschikt of langdurig ziek', cat:'werk',
   kort:'Twee jaar loondoorbetaling, dan WIA; voor zelfstandigen alleen wat zelf verzekerd is.',
   kw:'arbeidsongeschikt ziek ziekte langdurig WIA WGA IVA loondoorbetaling 70 procent wachttijd AOV woonlastenverzekering premievrijstelling WIA-hiaat Ziektewet re-integratie week 93 week 42 zelfstandige',
   verandert:{
    hypotheek:[
     'Werknemer: de eerste 2 jaar betaalt de werkgever ten minste 70% van het loon (het eerste jaar minimaal het minimumloon). Na 2 jaar volgt de WIA, vaak met een forse inkomensdaling.',
     'Zelfstandige: zonder AOV is er geen inkomensvervanging; let op de wachttijd van de AOV.',
     'Reken de betaalbaarheid na 2 jaar door, niet alleen nu. Informeer de geldverstrekker tijdig bij een dreigend tekort.',
     'Een nieuwe of hogere hypotheek tijdens ziekte is lastig; geldverstrekkers vragen naar de inkomenssituatie.'
    ],
    verzekeringen:[
     'AOV of woonlastenverzekering: claim indienen, wachttijd en uitkeringsduur nalopen.',
     'Premievrijstelling bij arbeidsongeschiktheid op ORV, lijfrente of levensverzekering: aanvragen als die in de polis staat.',
     'WIA-hiaat- en WIA-excedentverzekering via de werkgever: is er dekking en wordt die geclaimd?'
    ],
    pensioen:[
     'Veel pensioenregelingen kennen premievrije voortzetting van de opbouw bij arbeidsongeschiktheid; vraag dit na bij de uitvoerder.',
     'Controleer of ook de partner- en wezenpensioendekking doorloopt.'
    ],
    fiscaal:[
     'AOV-premie is aftrekbaar in box 1; de uitkering is belast.',
     'Specifieke zorgkosten kunnen onder voorwaarden aftrekbaar zijn.'
    ],
    toeslagen:[
     'Een lager inkomen kan recht geven op toeslagen; inkomen aanpassen.',
     'Aanpassingen aan de woning of hulp in huis lopen via de Wmo, met een eigen bijdrage.'
    ]
   },
   checklist:[
    'Eerste ziektedag en verwachte duur; werknemer of zelfstandige?',
    'Huidig inkomen en inkomen na 2 jaar (WIA-scenario).',
    'AOV, woonlastenverzekering en WIA-hiaat/excedent: dekking en claimstatus.',
    'Premievrijstelling op lopende polissen aangevraagd?',
    'Woonlasten en buffer doorrekenen.',
    'Partnerinkomen en mogelijkheden om dat uit te breiden.',
    'Pensioenopbouw bij arbeidsongeschiktheid.',
    'Planning WIA-aanvraag (werknemer) bewaken.',
    'Klant op de hoogte van contact met geldverstrekker?'
   ],
   documenten:[
    'Ziekmelding en eventuele correspondentie met werkgever en arbodienst',
    'Salarisstroken tijdens ziekte',
    'Polissen AOV, woonlastenverzekering, WIA-hiaat/excedent',
    'UWV-brieven en beschikkingen (Ziektewet, WIA)',
    'Pensioenreglement of -overzicht',
    'Hypotheekoverzicht en overzicht vaste lasten'
   ],
   termijnen:[
    {wat:'Loondoorbetaling bij ziekte (werknemer)', wanneer:'Maximaal 2 jaar, ten minste 70% van het loon', bron:'loondoorbetaling'},
    {wat:'Ziekmelding door de werkgever bij UWV', wanneer:'Uiterlijk de eerste werkdag na week 42 van ziekte', bron:'stappenplanZiek'},
    {wat:'UWV stuurt informatie over de WIA-aanvraag', wanneer:'In week 88 van ziekte', bron:'wia'},
    {wat:'WIA-uitkering aanvragen', wanneer:'Uiterlijk in week 93 van ziekte; te laat aanvragen kan leiden tot een lagere of latere uitkering', bron:'wia'}
   ],
   zorgplicht:[
    'Zelfstandige zonder AOV of met een te lange wachttijd.',
    'WIA-hiaat niet gedekt terwijl de woonlasten hoog zijn.',
    'Klant weet niet dat premievrijstelling kan worden aangevraagd.',
    'Klant wil de lening verhogen of oversluiten tijdens ziekte.',
    'Een afgewezen claim: wijs op klachtmogelijkheden bij verzekeraar en Kifid.'
   ],
   tools:[
    {t:'Inkomen bij ziekte werknemer', url:'inkomen-ziekte-werknemer.html', d:'Loondoorbetaling en WIA'},
    {t:'AOV tekort en wachttijd', url:'aov-tekort.html', d:'Gat bij zelfstandigen'},
    {t:'Rekenhulp: netto AOV-premie', url:'rekentools.html#aov-premie-netto', d:'Premie na aftrek'},
    {t:'Rekenhulp: netto AOV-uitkering', url:'rekentools.html#aov-uitkering-netto', d:'Uitkering na belasting'},
    {t:'Rekenhulp: dagloon UWV', url:'rekentools.html#dagloon-uwv', d:'Basis WIA'},
    {t:'Rekenhulp: netto uitkering', url:'rekentools.html#netto-uitkering', d:'Netto per maand'},
    {t:'Rekenhulp: Wmo eigen bijdrage', url:'rekentools.html#eigen-bijdrage-wmo', d:'Kosten van zorg aan huis'},
    {t:'Rekenhulp: recht op toeslagen', url:'rekentools.html#toeslagen-check', d:'Na inkomensdaling'},
    {t:'Hypotheekscan', url:'scan-hypotheek.html', d:'Huidige hypotheek doorlichten'}
   ],
   bronnen:['loondoorbetaling','stappenplanZiek','wia','baz','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'zzp', titel:'Starten als zzp’er of ondernemer', cat:'werk',
   kort:'Van loondienst naar ondernemen: ander toetsinkomen, geen werkgeversvangnet en zelf regelen wat de werkgever deed.',
   kw:'zzp zzper zelfstandige ondernemer starten eenmanszaak KVK inschrijven urencriterium zelfstandigenaftrek startersaftrek toetsinkomen ondernemer jaarcijfers AOV beroepsaansprakelijkheid pensioen lijfrente jaarruimte BAZ basisverzekering',
   verandert:{
    hypotheek:[
     'Geldverstrekkers toetsen ondernemersinkomen meestal op cijfers over meerdere jaren; een starter heeft die nog niet, waardoor de leenruimte tijdelijk kan dalen.',
     'Een klant die bij een hypotheekaanvraag weet dat hij gaat starten, moet dat melden: de informatieplicht gaat vóór de timing.',
     'Wisselend inkomen vraagt om een grotere buffer voor de woonlasten.'
    ],
    verzekeringen:[
     'Geen WIA en geen Ziektewet meer: AOV of een alternatief (broodfonds, schenkkring) bespreken.',
     'Bedrijfsaansprakelijkheid en eventueel beroepsaansprakelijkheid, rechtsbijstand en inventaris.',
     'Er wordt gewerkt aan een verplichte basisverzekering arbeidsongeschiktheid voor zelfstandigen (wetsvoorstel; beoogde invoering 2030). Nog niet van kracht.'
    ],
    pensioen:[
     'De opbouw bij de werkgever stopt; de aanspraak blijft premievrij staan.',
     'Zelf opbouwen kan via lijfrente of een bankspaarrekening binnen de jaarruimte.'
    ],
    fiscaal:[
     'Inschrijven bij de KVK en zorgen voor btw-administratie (eventueel kleineondernemersregeling).',
     'Zelfstandigenaftrek en startersaftrek vereisen onder meer het urencriterium van 1.225 uur per kalenderjaar; de zelfstandigenaftrek is de laatste jaren sterk verlaagd.',
     'Belasting reserveren of een voorlopige aanslag aanvragen om een naheffing te voorkomen.'
    ],
    toeslagen:[
     'Toeslagen gaan uit van een geschat jaarinkomen; bij wisselende winst is de kans op terugbetalen groter.',
     'Kinderopvangtoeslag voor ondernemers kent eigen voorwaarden.'
    ]
   },
   checklist:[
    'Startdatum, rechtsvorm en verwachte omzet en winst.',
    'Hypotheekplannen in de komende 3 jaar en de gevolgen voor het toetsinkomen.',
    'Buffer voor aanloopperiode en wisselend inkomen.',
    'Arbeidsongeschiktheid: AOV, broodfonds of bewust eigen risico?',
    'Aansprakelijkheid en rechtsbijstand.',
    'Pensioenopbouw en jaarruimte.',
    'Urencriterium en verwachte uren.',
    'Partner: inkomen, verzekeringen, gevolgen in gemeenschap van goederen.',
    'Belasting reserveren of voorlopige aanslag.'
   ],
   documenten:[
    'KVK-uittreksel',
    'Ondernemingsplan en prognose',
    'Opdrachtovereenkomsten of contracten met opdrachtgevers',
    'Jaarcijfers en aangiften inkomstenbelasting (zodra beschikbaar)',
    'Bestaande polissen (AOV, aansprakelijkheid, rechtsbijstand)',
    'Pensioenoverzicht'
   ],
   termijnen:[
    {wat:'Inschrijven bij de KVK', wanneer:'Vanaf 1 week vóór tot uiterlijk 1 week na de start', bron:'kvk'},
    {wat:'Urencriterium voor zelfstandigen- en startersaftrek', wanneer:'Minimaal 1.225 uur per kalenderjaar', bron:'urencriterium'},
    {wat:'Basisverzekering arbeidsongeschiktheid zelfstandigen', wanneer:'Wetsvoorstel; beoogde invoering 2030 (nog niet van kracht)', bron:'baz'}
   ],
   zorgplicht:[
    'Geen AOV en geen buffer terwijl de woonlasten hoog zijn.',
    'Klant wil een hypotheekaanvraag doen vóór de overstap zonder die te melden.',
    'Startende ondernemer in gemeenschap van goederen met een partner.',
    'Klant denkt nog verzekerd te zijn via de oude werkgever.'
   ],
   tools:[
    {t:'Rekenhulp: toetsinkomen ondernemer', url:'rekentools.html#toetsinkomen-ondernemer', d:'Inkomen voor de hypotheek'},
    {t:'Rekenhulp: uurtarief zzp', url:'rekentools.html#uurtarief-zzp', d:'Tarief dat de kosten dekt'},
    {t:'Rekenhulp: netto inkomen zzp', url:'rekentools.html#netto-inkomen-zzp', d:'Wat houdt de ondernemer over'},
    {t:'Rekenhulp: belasting reserveren', url:'rekentools.html#belasting-reserveren-zzp', d:'Hoeveel opzijzetten'},
    {t:'Rekenhulp: ondernemen naast loondienst', url:'rekentools.html#ondernemer-naast-loondienst', d:'Combinatie van inkomens'},
    {t:'Rekenhulp: ondernemersaftrek en mkb-vrijstelling', url:'rekentools.html#ondernemersaftrek-mkb', d:'Fiscale aftrekposten'},
    {t:'Rekenhulp: eenmanszaak of bv', url:'rekentools.html#bv-of-eenmanszaak', d:'Belasting vergeleken'},
    {t:'Rekenhulp: lijfrente-jaarruimte', url:'rekentools.html#lijfrente-jaarruimte', d:'Ruimte voor pensioen'},
    {t:'AOV tekort en wachttijd', url:'aov-tekort.html', d:'Dekking bij arbeidsongeschiktheid'},
    {t:'Bedrijfsverzekeringsscan', url:'scan-bedrijfsverzekeringen.html', d:'Zakelijke risico’s'},
    {t:'Pensioenscan', url:'scan-pensioen.html', d:'Pensioengat na overstap'}
   ],
   bronnen:['kvk','urencriterium','zelfstandigenaftrek','baz','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'verhuizen', titel:'Verhuizen of doorstromen', cat:'wonen',
   kort:'Oude woning verkopen, nieuwe financieren: meenemen, bijleenregeling, overbrugging en dubbele lasten.',
   kw:'verhuizen doorstromen nieuwe woning kopen verkopen meeneemregeling verhuisregeling bijleenregeling eigenwoningreserve overbruggingskrediet dubbele lasten twee woningen startersvrijstelling overdrachtsbelasting restschuld',
   verandert:{
    hypotheek:[
     'Bestaande rente meenemen (verhuisregeling) of opnieuw financieren: vergelijk voorwaarden, termijnen en kosten.',
     'Overwaarde van de oude woning leidt tot een eigenwoningreserve; alleen het deel daarboven komt fiscaal in box 1.',
     'Nieuwe woning eerst gekocht: overbruggingskrediet en dubbele lasten doorrekenen, ook als de verkoop langer duurt of minder oplevert.',
     'Bij NHG mag de oude lening tijdelijk aflossingsvrij worden, maximaal het lopende jaar plus drie jaar (V&N 2026, D.1.3.1).',
     'Loopt de nieuwe hypotheek door na de AOW-leeftijd, dan hoort de betaalbaarheid na pensionering bij het advies.'
    ],
    verzekeringen:[
     'Opstal en inboedel verhuizen mee of worden opnieuw afgesloten; herbouwwaarde opnieuw bepalen.',
     'De lege oude woning kan voorwaarden in de opstalpolis raken (leegstand): meld het bij de verzekeraar.',
     'ORV aanpassen aan de nieuwe lening.'
    ],
    pensioen:[
     'Een nieuwe looptijd van 30 jaar kan ver na de AOW-datum eindigen: pensioeninkomen meenemen in het advies.'
    ],
    fiscaal:[
     'Renteaftrek voor een leegstaande oude woning die te koop staat: maximaal 3 jaar na het kalenderjaar waarin de woning leeg kwam.',
     'Een nieuwe woning die leeg staat of wordt gebouwd kan ook tijdelijk als eigen woning gelden.',
     'De eigenwoningreserve blijft 3 jaar na verkoop bestaan.',
     'Startersvrijstelling overdrachtsbelasting: alleen voor kopers van 18 tot 35 jaar die de vrijstelling nog niet gebruikten, woningwaarde in 2026 maximaal € 555.000.'
    ],
    toeslagen:[
     'Wie een koopwoning betrekt, heeft geen recht meer op huurtoeslag.',
     'Verhuizing doorgeven aan de gemeente; dat werkt door naar toeslagen en uitkeringen.'
    ]
   },
   checklist:[
    'Reden en planning: eerst verkopen of eerst kopen?',
    'Taxatie of realistische verkoopprijs van de oude woning.',
    'Eigenwoningreserve berekenen (bijleenregeling).',
    'Meeneemregeling: voorwaarden, termijn en eventuele kosten.',
    'Overbrugging en dubbele lasten, ook in een slecht scenario.',
    'Fiscale historie: aflossingseis, 30-jaarstermijn, overgangsrecht.',
    'Looptijd ten opzichte van AOW-datum.',
    'Verzekeringen op het nieuwe adres; herbouwwaarde.',
    'Ontbindende voorwaarden in het koopcontract.',
    'Verhuizing en toeslagen doorgeven.'
   ],
   documenten:[
    'Koopovereenkomst nieuwe woning en (concept) verkoopovereenkomst oude woning',
    'Taxatierapport(en)',
    'Hypotheekoverzicht oude woning per leningdeel, inclusief fiscale status',
    'Eerdere aangiften IB (eigenwoningreserve, eigenwoningschuld)',
    'Inkomensgegevens',
    'Polissen die aan de oude hypotheek zijn gekoppeld'
   ],
   termijnen:[
    {wat:'Verhuizing doorgeven aan de gemeente', wanneer:'Uiterlijk 5 dagen na de verhuizing (kan vanaf 4 weken ervoor)', bron:'verhuizing'},
    {wat:'Renteaftrek oude woning die leeg te koop staat', wanneer:'Maximaal 3 jaar na het kalenderjaar waarin de woning leeg kwam', bron:'vorigeWoning'},
    {wat:'Eigenwoningreserve na verkoop', wanneer:'Blijft 3 jaar na de verkoop bestaan', bron:'tweeWoningen'},
    {wat:'Wijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'}
   ],
   zorgplicht:[
    'Dubbele lasten zonder voldoende buffer of zonder plan als de verkoop uitblijft.',
    'Overbrugging gebaseerd op een optimistische verkoopprijs.',
    'Koop zonder financieringsvoorbehoud terwijl de financiering niet zeker is.',
    'Overwaarde wordt volledig opgemaakt terwijl de klant een aflossingsvrij deel heeft dat na pensioen doorloopt.',
    'Looptijd tot ver na de AOW-datum zonder pensioenanalyse.'
   ],
   tools:[
    {t:'Eigenwoningreserve en bijleenregeling', url:'bijleenregeling.html', d:'Box 1-deel van de nieuwe lening'},
    {t:'Overbruggingskrediet', url:'overbrugging.html', d:'Overwaarde en dubbele lasten'},
    {t:'Kosten koper', url:'kosten-koper.html', d:'Overdrachtsbelasting en bijkomende kosten'},
    {t:'Loan-to-value', url:'ltv.html', d:'Lening ten opzichte van waarde'},
    {t:'Leennormen 2026', url:'leennormen-2026.html', d:'Maximale hypotheek'},
    {t:'NHG-check 2026', url:'nhg-check.html', d:'Past de lening binnen NHG?'},
    {t:'Restschuld bij pensioen', url:'restschuld-pensioen.html', d:'Woonlast na pensionering'},
    {t:'Herbouwwaarde en onderverzekering', url:'herbouwwaarde.html', d:'Opstalverzekering nieuw adres'},
    {t:'Rekenhulp: meeneemregeling', url:'rekentools.html#hypotheek-meenemen', d:'Rente meenemen bij verhuizen'},
    {t:'Rekenhulp: benodigd eigen geld', url:'rekentools.html#eigen-geld-nodig', d:'Eigen inbreng bij aankoop'},
    {t:'Rekenhulp: past deze woning?', url:'rekentools.html#haalbaarheid-woning', d:'Snelle haalbaarheid'},
    {t:'Partijenwegwijzer', url:'partijen.html', d:'Verhuisregelingen per geldverstrekker'}
   ],
   bronnen:['verhuizing','vorigeWoning','nieuweWoningLeeg','tweeWoningen','startersvrijstelling','toeslagKoop','nhgvn','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'verbouwen', titel:'Verbouwen of verduurzamen', cat:'wonen',
   kort:'Extra lenen voor verbetering of energiebesparing, met bouwdepot, subsidie en een nieuwe herbouwwaarde.',
   kw:'verbouwen verduurzamen verbouwing energiebesparende voorzieningen EBV energielabel isolatie warmtepomp zonnepanelen bouwdepot ISDE subsidie energiebespaarbudget verhogen hypotheek herbouwwaarde opstal',
   verandert:{
    hypotheek:[
     'Verhogen of oversluiten voor kwaliteitsverbetering of energiebesparende voorzieningen; het geleende bedrag gaat in een bouwdepot (bij NHG verplicht).',
     'Er is extra leenruimte voor energiebesparende voorzieningen en voor betere energielabels; zie de leennormen 2026.',
     'NHG 2026: de grens is € 470.000, plus maximaal € 28.200 voor energiebesparende voorzieningen; de LTV mag met die voorzieningen tot 106% van de marktwaarde.',
     'De AFM verwacht dat de adviseur verduurzaming bespreekt, zeker bij label E, F of G. Voor een aanvullend krediet dat alleen naar aangewezen energiebesparende voorzieningen gaat, is niet altijd een volledig advies nodig.'
    ],
    verzekeringen:[
     'Herbouwwaarde opnieuw bepalen: een uitbouw, nieuwe keuken of zonnepanelen verhogen de waarde.',
     'Meld een grote verbouwing aan de opstalverzekeraar en vraag naar dekking tijdens de bouw.',
     'Inboedel aanpassen als de woning groter wordt.'
    ],
    pensioen:[
     'Een verhoging kan de restschuld op de AOW-datum vergroten; kijk naar looptijd en aflosvorm.'
    ],
    fiscaal:[
     'Rente is alleen aftrekbaar als de lening wordt besteed aan verwerving, verbetering of onderhoud van de eigen woning en aan de aflossingseisen voldoet.',
     'ISDE-subsidie aanvragen binnen 24 maanden na uitvoering of installatie.'
    ],
    toeslagen:[
     'Geen directe gevolgen; lagere energielasten verbeteren wel de betaalbaarheid.'
    ]
   },
   checklist:[
    'Welke maatregelen, in welke volgorde, en met welke offertes?',
    'Huidig energielabel en verwacht label na de maatregelen.',
    'Financiering: eigen geld, verhogen, oversluiten of alternatief (bijv. Warmtefonds)?',
    'Bouwdepot: termijn, uitbetaling en wat er met een restant gebeurt.',
    'Subsidie: ISDE-voorwaarden en termijn.',
    'Fiscale aftrekbaarheid van de extra lening.',
    'Taxatie: is een nieuwe waardering nodig?',
    'Herbouwwaarde en opstalverzekering aanpassen.',
    'Betaalbaarheid: extra rentelast tegenover besparing.'
   ],
   documenten:[
    'Offertes of bouwbegroting',
    'Energielabel en eventueel maatwerkadvies',
    'Taxatierapport (huidig en/of na verbouwing)',
    'Vergunning (indien nodig)',
    'Hypotheekoverzicht en fiscale status per leningdeel',
    'Polisblad opstalverzekering'
   ],
   termijnen:[
    {wat:'ISDE-subsidie aanvragen (woningeigenaren)', wanneer:'Binnen 24 maanden na uitvoering of installatie', bron:'isde'}
   ],
   zorgplicht:[
    'Besparing wordt overschat; de terugverdientijd is langer dan de klant denkt.',
    'Woning met label E, F of G zonder bespreking van energiekosten.',
    'Verbouwing zonder aanpassing van de herbouwwaarde (onderverzekering).',
    'Klant financiert inrichting of consumptieve uitgaven mee (niet aftrekbaar).',
    'Twijfel over de staat van de fundering of constructie: laat een bouwkundige kijken.'
   ],
   tools:[
    {t:'Rekenhulp: terugverdientijd verduurzaming', url:'rekentools.html#verduurzamen', d:'Investering tegen besparing'},
    {t:'Rekenhulp: woonlasten tijdens de bouw', url:'rekentools.html#bouwdepot', d:'Bouwdepot en rente'},
    {t:'Rekenhulp: zonnepanelen', url:'rekentools.html#zonnepanelen', d:'Terugverdientijd'},
    {t:'Rekenhulp: besparing warmtepomp', url:'rekentools.html#warmtepomp-besparing', d:'Energielasten voor en na'},
    {t:'Rekenhulp: besparing door beter glas', url:'rekentools.html#glasisolatie', d:'Isolatie-effect'},
    {t:'Rekenhulp: energierekening voor en na', url:'rekentools.html#energiekosten-besparing', d:'Besparing per maand'},
    {t:'Leennormen 2026', url:'leennormen-2026.html', d:'Extra ruimte voor label en EBV'},
    {t:'NHG-check 2026', url:'nhg-check.html', d:'Grens inclusief EBV'},
    {t:'Loan-to-value', url:'ltv.html', d:'LTV na verbouwing'},
    {t:'Herbouwwaarde en onderverzekering', url:'herbouwwaarde.html', d:'Opstal aanpassen'},
    {t:'Schadeverzekeringsscan', url:'scan-schadeverzekeringen.html', d:'Opstal en inboedel'}
   ],
   bronnen:['isde','leidraad','nhgvn']
  },
  /* ------------------------------------------------------------------ */
  {id:'erfenis', titel:'Erfenis of schenking ontvangen', cat:'vermogen',
   kort:'Aangifte doen, kiezen tussen aflossen en aanhouden, en bij een geërfde woning de financiering regelen.',
   kw:'erfenis erven schenking schenken ontvangen erfbelasting schenkbelasting aangifte 1 maart jubelton eigen woning vrijstelling aflossen box 3 geërfde woning uitkopen erfgenamen familiehypotheek vruchtgebruik',
   verandert:{
    hypotheek:[
     'Extra aflossen: let op de boetevrije ruimte per leningdeel en de fiscale status (box 1 of box 3).',
     'Een geërfde woning die niet de hoofdverblijfplaats wordt, valt in box 3; eventueel verkopen, verhuren of uitkopen van mede-erfgenamen.',
     'Bij NHG kan een lening worden opgehoogd of overgesloten om mede-erfgenamen uit te kopen (V&N 2026, D.2 en D.3).',
     'Een schenking of lening van familie kan de financiering aanvullen; een familiehypotheek vraagt zakelijke afspraken.'
    ],
    verzekeringen:[
     'Na flink aflossen kan de ORV-behoefte dalen.',
     'Een geërfde woning direct verzekeren (opstal) en leegstand melden.'
    ],
    pensioen:[
     'Vermogen kan een pensioentekort verkleinen; bespreek of dat de bedoeling is.'
    ],
    fiscaal:[
     'Schenkbelasting: aangifte uiterlijk 1 maart van het jaar na de schenking.',
     'Erfbelasting: aangifte binnen 20 maanden bij overlijden vanaf 2026, binnen 8 maanden bij eerdere overlijdens.',
     'De eenmalig verhoogde schenkvrijstelling voor de eigen woning (jubelton) bestaat sinds 1 januari 2024 niet meer; de eenmalig verhoogde vrijstelling voor vrij besteedbaar geld bestaat nog wel.',
     'Vermogen telt mee in box 3; aflossen op een box 1-lening verlaagt ook de renteaftrek.'
    ],
    toeslagen:[
     'Toeslagen kennen een vermogensgrens: een erfenis of schenking kan het recht op zorgtoeslag of huurtoeslag laten vervallen.'
    ]
   },
   checklist:[
    'Wat is ontvangen: geld, woning, beleggingen, schulden?',
    'Aangifte erf- of schenkbelasting: wie doet die en vóór wanneer?',
    'Doel van de klant: aflossen, buffer, verduurzamen, pensioen, kinderen helpen?',
    'Boetevrije aflossingsruimte en fiscale status per leningdeel.',
    'Gevolgen voor box 3 en toeslagen.',
    'Geërfde woning: verkopen, verhuren, zelf bewonen of uitkopen?',
    'Beleggingsadvies nodig? Alleen binnen de eigen vergunning, anders doorverwijzen.',
    'Testament van de klant zelf actualiseren.'
   ],
   documenten:[
    'Verklaring van erfgenamen of notariële schenkingsakte / schenkingsovereenkomst',
    'Akte van verdeling (indien van toepassing)',
    'Aangifte en aanslag erf- of schenkbelasting',
    'Hypotheekoverzicht met boetevrije ruimte',
    'Taxatie van een geërfde woning'
   ],
   termijnen:[
    {wat:'Aangifte schenkbelasting', wanneer:'Uiterlijk 1 maart van het jaar na de schenking', bron:'schenkTermijn'},
    {wat:'Aangifte erfbelasting, overlijden vanaf 1 januari 2026', wanneer:'Binnen 20 maanden na het overlijden', bron:'erfTermijn'},
    {wat:'Aangifte erfbelasting, overlijden vóór 2026', wanneer:'Binnen 8 maanden na het overlijden', bron:'erfTermijn'},
    {wat:'Inkomens- of vermogenswijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'}
   ],
   zorgplicht:[
    'Klant wil alles aflossen en houdt geen buffer aan.',
    'Vraag over beleggen terwijl je daarvoor geen Wft-vergunning hebt.',
    'Nalatenschap met mogelijke schulden: beneficiair aanvaarden bespreken.',
    'Druk vanuit familie bij een schenking of familielening.'
   ],
   tools:[
    {t:'Extra aflossen', url:'extra-aflossen.html', d:'Lagere last of kortere looptijd'},
    {t:'Rekenhulp: schenkbelasting', url:'rekentools.html#schenkbelasting', d:'Belasting per schenking'},
    {t:'Rekenhulp: schenking vrij van recht', url:'rekentools.html#schenking-vrij-van-recht', d:'Netto naar bruto'},
    {t:'Rekenhulp: erfbelasting', url:'rekentools.html#erfbelasting', d:'Per verkrijger'},
    {t:'Rekenhulp: box 3', url:'rekentools.html#box3-heffing', d:'Heffing op het vermogen'},
    {t:'Rekenhulp: aflossen of beleggen', url:'rekentools.html#aflossen-of-beleggen', d:'Vergelijking'},
    {t:'Rekenhulp: boetevrije aflossingsruimte', url:'rekentools.html#boetevrij-aflossen', d:'Wat mag zonder vergoeding'},
    {t:'Rekenhulp: aflossen op aflossingsvrij deel', url:'rekentools.html#aflossingsvrij-aflossen', d:'Effect op de last'},
    {t:'Rekenhulp: familiehypotheek', url:'rekentools.html#familiehypotheek', d:'Lenen bij ouders'},
    {t:'Rekenhulp: verhuurde woning schenken of erven', url:'rekentools.html#verhuurde-woning-schenken-erven', d:'Waardering'},
    {t:'Oversluiten', url:'oversluiten.html', d:'Opnieuw financieren na uitkoop'}
   ],
   bronnen:['schenkTermijn','erfTermijn','jubelton','erfAanvaarden','nhgvn']
  },
  /* ------------------------------------------------------------------ */
  {id:'pensioen', titel:'Met pensioen gaan', cat:'later',
   kort:'Inkomen daalt, de hypotheek loopt vaak door: AOW-datum, pensioenkeuzes en betaalbaarheid na pensionering.',
   kw:'pensioen pensioneren AOW AOW-leeftijd AOW aanvragen pensioenkeuzes hoog-laag vervroegen uitstellen uitruil partnerpensioen bedrag ineens Wtp nieuw pensioenstelsel aflossingsvrij einddatum restschuld RVU lijfrente uitkering ouderenkorting',
   verandert:{
    hypotheek:[
     'De AFM verwacht dat de adviseur de betaalbaarheid na pensionering analyseert, ook als de klant nog meer dan tien jaar van zijn pensioen af zit.',
     'Een aflossingsvrij deel met een einddatum vraagt tijdig een plan: aflossen, verlengen of oversluiten. Een geldverstrekker toetst bij verlenging opnieuw op het pensioeninkomen.',
     'Overweeg aflossen uit spaargeld tegen het behoud van een buffer voor onderhoud en zorg.'
    ],
    verzekeringen:[
     'AOV en woonlastenverzekeringen lopen meestal tot de AOW-leeftijd; ORV loopt vaak af.',
     'Collectieve verzekeringen via de werkgever stoppen.',
     'Uitvaartdekking en aanvullende zorgverzekering bespreken.'
    ],
    pensioen:[
     'AOW-leeftijd: 67 jaar in 2027; 67 jaar en 3 maanden in 2028 tot en met 2031.',
     'Pensioenkeuzes: eerder of later laten ingaan, hoog-laag, uitruil van partnerpensioen. Uitruil kan de nabestaande raken.',
     'Bedrag ineens: vanaf 1 januari 2029 maximaal 10% van het ouderdomspensioen op de pensioendatum.',
     'Alle pensioenregelingen moeten uiterlijk 1 januari 2028 over zijn naar het nieuwe stelsel (Wtp).',
     'Lijfrenten en bankspaarproducten laten ingaan volgens de voorwaarden.'
    ],
    fiscaal:[
     'Vanaf de AOW-leeftijd geen AOW-premie meer, waardoor de belastingdruk daalt; recht op ouderenkorting afhankelijk van inkomen.',
     'Spreiden van lijfrente-uitkeringen kan de belastingdruk beïnvloeden.'
    ],
    toeslagen:[
     'Een lager inkomen kan recht geven op zorgtoeslag of huurtoeslag.',
     'Onvolledige AOW door jaren buitenland: mogelijk AIO-aanvulling via de SVB.'
    ]
   },
   checklist:[
    'AOW-datum en gewenste pensioendatum.',
    'Verwacht netto inkomen (AOW, pensioen, lijfrente) per maand.',
    'Woonlasten na pensionering, inclusief einddatum aflossingsvrij.',
    'Restschuld op de AOW-datum en plan om die te verkleinen.',
    'Pensioenkeuzes en gevolgen voor de partner.',
    'Bedrag ineens: wel of niet, en waarvoor?',
    'Buffer voor onderhoud, zorg en vervanging.',
    'Verzekeringen die eindigen en wat er nog nodig is.',
    'Testament en levenstestament.',
    'Vervolgafspraak vóór de pensioendatum.'
   ],
   documenten:[
    'Pensioenoverzicht (mijnpensioenoverzicht.nl) en opgaven van uitvoerders',
    'AOW-opbouw en eventuele opbouwgaten',
    'Hypotheekoverzicht met einddata per leningdeel',
    'Polissen lijfrente, bankspaar en levensverzekeringen',
    'Overzicht spaargeld en beleggingen'
   ],
   termijnen:[
    {wat:'AOW aanvragen (wonen in Nederland)', wanneer:'SVB stuurt ongeveer 4 maanden vóór de AOW-leeftijd een brief; aanvragen kan in de 4 maanden ervoor', bron:'aowAanvragen'},
    {wat:'AOW-leeftijd', wanneer:'67 jaar in 2027; 67 jaar en 3 maanden in 2028 t/m 2031', bron:'aowLeeftijd'},
    {wat:'Overgang alle pensioenregelingen naar het nieuwe stelsel', wanneer:'Uiterlijk 1 januari 2028', bron:'wtp'},
    {wat:'Bedrag ineens (max. 10%) mogelijk', wanneer:'Vanaf 1 januari 2029', bron:'bedragIneens'}
   ],
   zorgplicht:[
    'Aflossingsvrij deel loopt af zonder plan of voldoende vermogen.',
    'Klant kiest uitruil van partnerpensioen zonder de gevolgen voor de partner te kennen.',
    'Klant wil een bedrag ineens gebruiken zonder het netto-effect te overzien.',
    'Signalen van verminderde regie of cognitieve achteruitgang.',
    'Hypotheek loopt door na pensioen zonder dat het pensioeninkomen bekend is.'
   ],
   tools:[
    {t:'Restschuld bij pensioen', url:'restschuld-pensioen.html', d:'Schuld en woonlast na pensionering'},
    {t:'Pensioenscan', url:'scan-pensioen.html', d:'Inkomen na pensioen in kaart'},
    {t:'Aflossingsvrije hypotheekscan', url:'scan-aflossingsvrij.html', d:'Einddatum en plan'},
    {t:'Rekenhulp: AOW-datum', url:'rekentools.html#aow-datum', d:'Wanneer gaat de AOW in?'},
    {t:'Rekenhulp: netto AOW en pensioen', url:'rekentools.html#netto-aow-pensioen', d:'Netto per maand'},
    {t:'Rekenhulp: netto in het jaar van AOW-ingang', url:'rekentools.html#netto-jaar-aow-ingang', d:'Overgangsjaar'},
    {t:'Rekenhulp: netto vroegpensioen', url:'rekentools.html#netto-vroegpensioen', d:'Eerder stoppen'},
    {t:'Rekenhulp: RVU', url:'rekentools.html#rvu-inkomensdaling', d:'Eerder stoppen met RVU'},
    {t:'Rekenhulp: doorwerken na de AOW', url:'rekentools.html#doorwerken-na-aow', d:'Inkomen naast AOW'},
    {t:'Rekenhulp: pensioentekort', url:'rekentools.html#pensioentekort', d:'Benodigde inleg'},
    {t:'Rekenhulp: lijfrente-uitkering', url:'rekentools.html#lijfrente-uitkering', d:'Uitkering uit kapitaal'},
    {t:'Oversluiten', url:'oversluiten.html', d:'Verlengen of oversluiten'}
   ],
   bronnen:['aowLeeftijd','aowAanvragen','bedragIneens','wtp','dnbWtp','mpo','leidraad']
  },
  /* ------------------------------------------------------------------ */
  {id:'emigratie', titel:'Emigratie', cat:'later',
   kort:'Uitschrijven, AOW-gaten voorkomen, conserverende aanslagen en wat er met de Nederlandse woning gebeurt.',
   kw:'emigratie emigreren buitenland vertrekken uitschrijven BRP vrijwillig verzekeren AOW Anw conserverende aanslag pensioen lijfrente kwalificerend buitenlands belastingplichtige M-biljet woning verhuren zorgverzekering',
   verandert:{
    hypotheek:[
     'Woning aanhouden en verhuren kan alleen met toestemming van de geldverstrekker; bij NHG gelden strikte voorwaarden voor tijdelijke verhuur bij werk elders (V&N 2026, D.1.4).',
     'Hypotheekrenteaftrek na emigratie is alleen in specifieke situaties mogelijk, onder meer als kwalificerend buitenlands belastingplichtige.',
     'Bespreek valutarisico als het inkomen straks in een andere munt is.'
    ],
    verzekeringen:[
     'De Nederlandse zorgverzekering stopt in de regel bij uitschrijving; regel dekking in het nieuwe woonland.',
     'Opstal en inboedel: leegstand of verhuur melden.',
     'ORV en AOV: geldt de dekking ook bij wonen in het buitenland?'
    ],
    pensioen:[
     'Elk jaar zonder AOW-verzekering kost 2% AOW. Vrijwillig verzekeren via de SVB kan, binnen 1 jaar na het einde van de verplichte verzekering.',
     'Wie buiten Nederland woont, vraagt de AOW 6 maanden voor de AOW-leeftijd aan.',
     'Opgebouwd pensioen en lijfrente blijven, maar kunnen een conserverende aanslag krijgen.'
    ],
    fiscaal:[
     'Over pensioen, lijfrente en bepaalde eigenwoningproducten (kapitaalverzekering, spaarrekening) kan een conserverende aanslag volgen. Die hoeft na 10 jaar onder voorwaarden niet meer te worden betaald.',
     'In het emigratiejaar volgt een aangifte met binnenlandse en buitenlandse periode (M-biljet).',
     'Belastingverdragen bepalen waar inkomen wordt belast.'
    ],
    toeslagen:[
     'Recht op toeslagen eindigt in principe bij vertrek; kinderbijslag hangt af van het land.',
     'Uitkeringen meenemen naar het buitenland kent eigen regels per uitkering en land.'
    ]
   },
   checklist:[
    'Vertrekdatum, bestemming en verwachte duur.',
    'Woning verkopen, verhuren of leeg laten? Toestemming geldverstrekker nodig?',
    'Fiscale woonplaats en verdrag; kwalificerend buitenlands belastingplichtig?',
    'Conserverende aanslagen voor pensioen, lijfrente en eigenwoningproducten.',
    'Vrijwillige AOW/Anw-verzekering binnen 1 jaar.',
    'Zorgverzekering en overige verzekeringen in het nieuwe land.',
    'Uitschrijven bij de gemeente.',
    'Hoe blijft de klant bereikbaar voor nazorg? Mag je de klant daar bedienen?'
   ],
   documenten:[
    'Bewijs van uitschrijving en buitenlands adres',
    'Hypotheekoverzicht en eventuele toestemming tot verhuur',
    'Huurovereenkomst (bij verhuur)',
    'Pensioen- en lijfrenteoverzichten',
    'Polissen ORV, AOV, opstal en inboedel',
    'Arbeidscontract of inkomensgegevens in het nieuwe land'
   ],
   termijnen:[
    {wat:'Vertrek melden bij de gemeente (verblijf langer dan 8 maanden)', wanneer:'Vanaf 5 dagen vóór vertrek', bron:'uitschrijven'},
    {wat:'Vrijwillige verzekering AOW/Anw aanvragen', wanneer:'Binnen 1 jaar na het einde van de verplichte verzekering', bron:'vrijwilligVerzekeren'},
    {wat:'AOW aanvragen vanuit het buitenland', wanneer:'6 maanden vóór de AOW-leeftijd', bron:'aowBuitenland'},
    {wat:'Conserverende aanslag pensioen/lijfrente', wanneer:'Na 10 jaar onder voorwaarden kwijtschelding aanvragen', bron:'conserverend'}
   ],
   zorgplicht:[
    'Woning verhuren zonder toestemming van de geldverstrekker.',
    'Klant is zich niet bewust van AOW-opbouwgaten.',
    'Afkoop van pensioen of lijfrente zonder de fiscale gevolgen te kennen.',
    'Dienstverlening aan een klant in het buitenland: ga na of je dat binnen je vergunning en de regels van dat land mag.'
   ],
   tools:[
    {t:'Rekenhulp: tijdelijke verhuur eigen woning', url:'rekentools.html#tijdelijke-verhuur-woning', d:'Fiscale gevolgen'},
    {t:'Rekenhulp: verhuurhypotheek', url:'rekentools.html#verhuurhypotheek', d:'Maximale lening bij verhuur'},
    {t:'Rekenhulp: AOW bij opbouwgaten', url:'rekentools.html#aow-bedrag-opbouwgaten', d:'Effect van jaren buitenland'},
    {t:'Rekenhulp: valuta omrekenen', url:'rekentools.html#valuta-omrekenen', d:'Inkomen in andere munt'},
    {t:'Pensioenscan', url:'scan-pensioen.html', d:'Pensioen voor vertrek'},
    {t:'Wijziging doorgeven aan je adviseur', url:'wijziging-doorgeven.html', d:'Nieuw adres en situatie'}
   ],
   bronnen:['emigrerenRO','uitschrijven','emigrerenBD','conserverend','vrijwilligVerzekeren','vvBuiten','aowBuitenland']
  },
  /* ------------------------------------------------------------------ */
  {id:'mantelzorg', titel:'Mantelzorg of kangoeroewonen', cat:'later',
   kort:'Samen wonen met ouder of kind, een mantelzorgwoning op eigen erf: eigendom, AOW-woonsituatie en fiscaal partnerschap.',
   kw:'mantelzorg mantelzorgwoning kangoeroewonen kangoeroewoning ouder kind samenwonen inwonen zorg AOW gezamenlijke huishouding fiscaal partner 27 jaar toeslagpartner kostendelersnorm Wmo levenstestament',
   verandert:{
    hypotheek:[
     'Samen kopen door ouder en kind: eigendomsverhouding, hoofdelijke aansprakelijkheid en wat er gebeurt bij overlijden of als de zorg stopt.',
     'Een mantelzorgwoning op eigen erf is in een aantal gevallen vergunningvrij; check bij de gemeente en vraag de geldverstrekker om toestemming voor verbouw of gebruik.',
     'Een verbouwing om samen te wonen loopt via een bouwdepot; let op de waarde na verbouwing.'
    ],
    verzekeringen:[
     'Opstal: mantelzorgwoning of aanbouw meeverzekeren en herbouwwaarde aanpassen.',
     'Inboedel en aansprakelijkheid: twee huishoudens of één? Controleer de polisvoorwaarden.'
    ],
    pensioen:[
     'Voor de AOW kan samenwonen een gezamenlijke huishouding zijn, met een lagere AOW voor een alleenstaande als gevolg. Bij wonen vanwege intensieve zorg kan een uitzondering gelden; laat de SVB beoordelen.',
     'Voor de Anw geldt: samenwonen omdat intensieve zorg nodig is, telt niet als gezamenlijke huishouding.'
    ],
    fiscaal:[
     'Ouder en kind die samen eigenaar zijn van de woning waar zij beiden wonen, kunnen fiscaal partner worden als beiden op 31 december van het voorgaande jaar 27 jaar of ouder waren.',
     'De Belastingdienst heeft een standpunt over fiscaal partnerschap bij mantelzorg (KG:202:2025:4).',
     'Schenken of lenen tussen ouder en kind: denk aan schenkbelasting en zakelijke voorwaarden.'
    ],
    toeslagen:[
     'Sinds 2025 telt een inwonend kind of ouder niet meer als toeslagpartner.',
     'Een medebewoner kan wel meetellen voor de huurtoeslag; bij de bijstand geldt de kostendelersnorm.'
    ]
   },
   checklist:[
    'Wie zorgt voor wie, en hoe lang naar verwachting?',
    'Eigendom: wie koopt of bezit wat, en wie is aansprakelijk?',
    'Wat gebeurt er als de zorg stopt, bij overlijden of bij een conflict?',
    'AOW-, Anw- en bijstandsgevolgen van de woonsituatie (SVB/gemeente).',
    'Fiscaal partnerschap ouder-kind en de gevolgen.',
    'Toestemming geldverstrekker en vergunning bij de gemeente.',
    'Positie van broers en zussen (erfrecht, gelijke behandeling).',
    'Levenstestament en volmachten.',
    'Opstal, inboedel en aansprakelijkheid aanpassen.'
   ],
   documenten:[
    'Eigendomsakte(n) en hypotheekstukken',
    'Bouwtekening, offerte en eventuele vergunning',
    'Afspraken tussen ouder en kind (bij voorkeur notarieel)',
    'Testamenten en levenstestamenten',
    'AOW- of uitkeringsbeschikkingen',
    'Polissen opstal, inboedel, aansprakelijkheid'
   ],
   termijnen:[
    {wat:'Wijziging woonsituatie doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'},
    {wat:'Verhuizing doorgeven aan de gemeente', wanneer:'Uiterlijk 5 dagen na de verhuizing', bron:'verhuizing'},
    {wat:'Leeftijdsgrens fiscaal partnerschap ouder-kind', wanneer:'Beiden 27 jaar of ouder op 31 december van het voorgaande jaar', bron:'fiscPartner'}
   ],
   zorgplicht:[
    'De ouder is mogelijk niet (meer) volledig wilsbekwaam: geen advies zonder vertegenwoordiging of volmacht.',
    'Ongelijke behandeling van andere kinderen kan later tot conflicten leiden.',
    'Druk vanuit familie op de ouder.',
    'Onverwacht lagere AOW of uitkering door de woonsituatie.'
   ],
   tools:[
    {t:'Draagplicht en inbreng', url:'draagplicht.html', d:'Verhouding ouder en kind'},
    {t:'Rekenhulp: familiehypotheek', url:'rekentools.html#familiehypotheek', d:'Lenen tussen ouder en kind'},
    {t:'Rekenhulp: schenkbelasting', url:'rekentools.html#schenkbelasting', d:'Schenken binnen de familie'},
    {t:'Rekenhulp: woonlasten tijdens de bouw', url:'rekentools.html#bouwdepot', d:'Verbouwing in fasen'},
    {t:'Rekenhulp: Wmo eigen bijdrage', url:'rekentools.html#eigen-bijdrage-wmo', d:'Kosten van zorg'},
    {t:'Rekenhulp: vruchtgebruik waarderen', url:'rekentools.html#waarde-vruchtgebruik', d:'Bij woonrecht of vruchtgebruik'},
    {t:'Herbouwwaarde en onderverzekering', url:'herbouwwaarde.html', d:'Opstal na verbouwing'},
    {t:'Leennormen 2026', url:'leennormen-2026.html', d:'Toets bij samen kopen'}
   ],
   bronnen:['mantelzorgwoning','aowHuishouding','anwWonen','fiscPartner','kgMantelzorg','toeslagOuderKind','kostendelers']
  },
  /* ------------------------------------------------------------------ */
  {id:'senior', titel:'Ouder worden en senior wonen', cat:'later',
   kort:'Overwaarde verzilveren, de woning aanpassen of verhuizen, en zorgvuldig adviseren aan mogelijk kwetsbare klanten.',
   kw:'ouder worden senior senioren verzilveren overwaarde opeethypotheek verzilverhypotheek levensloopbestendig verhuizen kleiner wonen Wmo kwetsbare klant wilsbekwaam levenstestament volmacht uitvaart zorgkosten ouderenkorting',
   verandert:{
    hypotheek:[
     'Overwaarde verzilveren (bijvoorbeeld met een opeet- of verzilverhypotheek) kan het inkomen aanvullen, maar de schuld groeit door bijgeschreven rente.',
     'Toetsing gebeurt op het pensioeninkomen; productaanbod voor senioren verschilt sterk per geldverstrekker.',
     'Aanpassen van de woning of verhuizen naar een levensloopbestendige woning: zie ook de kaart Verhuizen.'
    ],
    verzekeringen:[
     'Uitvaartdekking nalopen.',
     'Opstal en inboedel: herbouwwaarde en waarde inboedel actualiseren.',
     'Aflopende ORV en andere risicoverzekeringen: nog nodig?'
    ],
    pensioen:[
     'Inkomen uit AOW, pensioen en lijfrente in kaart; wat blijft er voor de langstlevende partner?',
     'Lijfrente-uitkeringen en bankspaarproducten volgens de voorwaarden laten uitkeren.'
    ],
    fiscaal:[
     'Ouderenkorting afhankelijk van het inkomen.',
     'Vermogen telt mee voor box 3 en kan doorwerken in eigen bijdragen voor zorg.',
     'Schenken aan kinderen of kleinkinderen bij leven: vrijstellingen en aangifte.'
    ],
    toeslagen:[
     'Zorgtoeslag en eventueel huurtoeslag na verhuizing naar een huurwoning.',
     'Wmo-voorzieningen voor aanpassingen aan de woning, met een eigen bijdrage.'
    ]
   },
   checklist:[
    'Woonwens: blijven, aanpassen of verhuizen?',
    'Inkomen nu en voor de langstlevende partner.',
    'Overwaarde en mogelijkheden om die te benutten; effect op nalatenschap.',
    'Zorgbehoefte en kosten van zorg.',
    'Levenstestament, volmachten en testament.',
    'Wie neemt deel aan het gesprek? Vertrouwenspersoon aanwezig?',
    'Begrijpt de klant het product en de gevolgen? Laat het in eigen woorden navertellen.',
    'Verzekeringen opschonen: wat is nog nodig?',
    'Afspraken over nazorg en contactpersoon.'
   ],
   documenten:[
    'Pensioen- en AOW-gegevens',
    'Hypotheekoverzicht en taxatie',
    'Testament, levenstestament, volmachten',
    'Polissen uitvaart, opstal, inboedel',
    'Overzicht spaargeld en beleggingen'
   ],
   termijnen:[
    {wat:'AOW aanvragen (wonen in Nederland)', wanneer:'In de 4 maanden vóór de AOW-leeftijd', bron:'aowAanvragen'},
    {wat:'Wijziging doorgeven aan Dienst Toeslagen', wanneer:'Binnen 4 weken', bron:'toeslagWijz'},
    {wat:'Verhuizing doorgeven aan de gemeente', wanneer:'Uiterlijk 5 dagen na de verhuizing', bron:'verhuizing'}
   ],
   zorgplicht:[
    'Twijfel over wilsbekwaamheid of begrip: stop, betrek een vertegenwoordiger en leg dit vast.',
    'Druk of sturing door familie of derden.',
    'Verzilveren waarbij de schuld door rentebijschrijving de woningwaarde kan benaderen.',
    'Klant tekent snel zonder bedenktijd.',
    'Productkeuze die niet aansluit bij de levensverwachting en zorgbehoefte.'
   ],
   tools:[
    {t:'Rekenhulp: opeethypotheek', url:'rekentools.html#opeethypotheek', d:'Overwaarde per maand opnemen'},
    {t:'Rekenhulp: overwaarde verzilveren', url:'rekentools.html#verzilveren', d:'Met bijgeschreven rente'},
    {t:'Rekenhulp: krediethypotheek', url:'rekentools.html#krediethypotheek', d:'Rente over opgenomen deel'},
    {t:'Rekenhulp: levensverwachting (model)', url:'rekentools.html#levensverwachting', d:'Resterende jaren'},
    {t:'Rekenhulp: ouderenkorting', url:'rekentools.html#ouderenkorting-berekenen', d:'Korting bij een inkomen'},
    {t:'Rekenhulp: Wmo eigen bijdrage', url:'rekentools.html#eigen-bijdrage-wmo', d:'Kosten van zorg'},
    {t:'Restschuld bij pensioen', url:'restschuld-pensioen.html', d:'Schuld en woonlast'},
    {t:'Uitvaartscan', url:'scan-uitvaart.html', d:'Dekking uitvaart'},
    {t:'Aflossingsvrije hypotheekscan', url:'scan-aflossingsvrij.html', d:'Einddatum en plan'},
    {t:'Partijenwegwijzer', url:'partijen.html', d:'Partijen met seniorenproducten'},
    {t:'Periodieke nazorgcheck', url:'nazorg-check.html', d:'Vervolgcontact plannen'}
   ],
   bronnen:['leidraad','aowAanvragen','aowLeeftijd','mpo']
  }
  ];

  /* bronsleutels omzetten naar objecten */
  L.forEach(function (g) {
    g.bronnen = g.bronnen.map(function (k) { return B[k]; }).filter(Boolean);
    g.termijnen.forEach(function (t) { t.bron = B[t.bron] || null; });
  });

  window.LEVENSGEBEURTENISSEN = L;
  window.LEVENSGEBEURTENISSEN_CATS = {
    relatie: 'Relatie en gezin',
    werk: 'Werk en inkomen',
    wonen: 'Wonen',
    vermogen: 'Vermogen en nalatenschap',
    later: 'Later, zorg en buitenland'
  };
})();
