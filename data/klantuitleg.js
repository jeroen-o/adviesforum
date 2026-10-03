/* Klantuitleg: korte, printbare uitlegbladen voor klanten in B1-taal.
 * Gebruikt door klantuitleg.html. Formaat per blad:
 *   { id, cat, titel, kort:[3], uitleg:[alinea's], letop:[...], vragen:[3], bronnen:[{t,u}], peildatum, kw }
 * Alleen bevestigde feiten; bedragen 2026 komen overeen met js/rekentools/normen.js (gecontroleerd 2026-10-02).
 * Algemene informatie, geen advies. Herzien vóór 2027-01-01 (nieuwe jaarbedragen). */
(function () {
  var B = {
    afmKaart: { t: 'AFM: vergelijkingskaart, weet wat je kunt verwachten', u: 'https://www.afm.nl/nl-nl/consumenten/themas/financieel-advies/vergelijkingskaart' },
    afmKosten: { t: 'AFM: wanneer betaal je advieskosten?', u: 'https://www.afm.nl/nl-nl/consumenten/themas/financieel-advies/advieskosten' },
    afmAdvies: { t: 'AFM: het adviestraject', u: 'https://www.afm.nl/nl-nl/consumenten/themas/financieel-advies/adviestraject' },
    afmRente: { t: 'AFM: welke rol speelt hypotheekrente?', u: 'https://www.afm.nl/nl-nl/consumenten/themas/hypotheken/hypotheekrente' },
    afmRisico: { t: 'AFM: welke betalingsrisico’s bestaan er bij een hypotheek?', u: 'https://www.afm.nl/nl-nl/consumenten/veelgestelde-vragen/hypotheken-algemeen/hypotheek-betalingsrisico' },
    afmMiddeling: { t: 'AFM: rentemiddeling', u: 'https://www.afm.nl/nl-nl/consumenten/themas/producten/hypotheek/rentemiddeling' },
    afmVervroegd: { t: 'AFM: checklist vergoeding bij vervroegd aflossen', u: 'https://www.afm.nl/nl-nl/consumenten/themas/producten/hypotheek/vervroegd-aflossen/checklist' },
    afmAflosvrij: { t: 'AFM: 78.000 huishoudens met aflossingsvrije hypotheek financieel kwetsbaar', u: 'https://www.afm.nl/nl-nl/consumenten/nieuws/2021/jan/huishoudens-financieel-kwetsbaar-aflossingsvrije-hypotheek' },
    afmScheiden: { t: 'AFM: je gaat uit elkaar of scheiden (pensioen)', u: 'https://www.afm.nl/nl-nl/consumenten/themas/producten/pensioen/wat-doen-als/scheiden' },
    afmVerzAdviseur: { t: 'AFM: verzekering afsluiten via een adviseur', u: 'https://www.afm.nl/nl-nl/consumenten/themas/verzekeren/afsluiten-via-een-adviseur' },
    nhgGrens: { t: 'NHG: NHG-grens in 2026 vastgesteld op € 470.000', u: 'https://www.nhg.nl/nhg-actueel/nhg-grens-in-2026-vastgesteld-op-470000/' },
    nhgProduct: { t: 'NHG: een hypotheek met NHG', u: 'https://www.nhg.nl/het-product-nhg/een-hypotheek-met-nhg/' },
    nhgWijzig: { t: 'NHG: je hypotheek veranderen', u: 'https://www.nhg.nl/het-product-nhg/je-hypotheek-veranderen/' },
    bdStarter: { t: 'Belastingdienst: startersvrijstelling overdrachtsbelasting', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/startersvrijstelling/startersvrijstelling' },
    bdOvb2: { t: 'Belastingdienst: tarief van 2% overdrachtsbelasting', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/overdrachtsbelasting/tarieven_overdrachtsbelasting/laag-tarief' },
    bdAftrekKosten: { t: 'Belastingdienst: eigen woning, welke kosten mag ik aftrekken?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/eigen-woning-aftrekbare-kosten' },
    bdRenteAftrek: { t: 'Belastingdienst: mag ik mijn hypotheekrente altijd aftrekken?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hypotheekrente-aftrekken' },
    bdForfait: { t: 'Belastingdienst: hoe werkt het eigenwoningforfait?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/hoe-werkt-eigenwoningforfait' },
    bdKleineSchuld: { t: 'Belastingdienst: geen of een kleine eigenwoningschuld (Hillen)', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/eigenwoningforfait/geen_of_een_kleine_eigenwoningschuld/geen_of_een_kleine_eigenwoningschuld' },
    bdBijleen: { t: 'Belastingdienst: eigenwoningschuld en bijleenregeling', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/eigen-woning/u-verkoopt-een-huis/bijleenregeling/eigenwoningschuld/eigenwoningschuld' },
    bdTweeWoningen: { t: 'Belastingdienst: tijdelijk 2 woningen en renteaftrek', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/tijdelijk-2-woningen-renteaftrek' },
    bdVorigeWoning: { t: 'Belastingdienst: vorige woning staat te koop', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/tijdelijk_2_woningen/vorige_woning_nog_niet_verkocht/vorige_woning_staat_te_koop' },
    bdFamilie: { t: 'Belastingdienst: renteaftrek bij een lening van familie', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/koopwoning/content/renteaftrek-hypotheek-lening-eigen-woning-familie-bv-buitenlandse-bank' },
    bdSchenkKind: { t: 'Belastingdienst: hoeveel mag ik mijn kind belastingvrij schenken?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/hoeveel-mag-ik-mijn-kind-belastingvrij-schenken' },
    bdSchenk2026: { t: 'Belastingdienst: tot welk bedrag is een schenking belastingvrij in 2026?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/tot-welk-bedrag-belastingvrij-schenken' },
    bdJubelton: { t: 'Belastingdienst: belastingvrije schenking voor een koopwoning (tot 2024)', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/schenken/content/belastingvrije-schenkingen-voor-koopwoning' },
    bdScheidingRente: { t: 'Belastingdienst: wie mag de hypotheekrente aftrekken na een scheiding?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/scheiden/content/wie-mag-hypotheekrente-aftrekken-na-scheiding' },
    bdSamenwonen: { t: 'Belastingdienst: u gaat samenwonen', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/relatie_familie_en_gezondheid/relatie/samenwoners/samenwonen' },
    bdFiscPartner: { t: 'Belastingdienst: wanneer ben ik fiscaal partner?', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/relatie_familie_en_gezondheid/relatie/fiscaal_partnerschap/fiscaal_partnerschap' },
    bdErfVrij: { t: 'Belastingdienst: vrijstellingen erfbelasting', u: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/erfbelasting/content/vrijstelling-erfbelasting' },
    roVerschilRelatie: { t: 'Rijksoverheid: verschil huwelijk, geregistreerd partnerschap en samenlevingscontract', u: 'https://www.rijksoverheid.nl/vraag-en-antwoord/trouwen-samenlevingscontract-en-geregistreerd-partnerschap/wat-is-het-verschil-tussen-een-huwelijk-geregistreerd-partnerschap-en-samenlevingscontract' },
    roScheiden: { t: 'Rijksoverheid: scheiden of uit elkaar, wat moet ik regelen?', u: 'https://www.rijksoverheid.nl/vraag-en-antwoord/scheiden/checklist-bij-scheiden-of-uit-elkaar-gaan' },
    apKopieId: { t: 'Autoriteit Persoonsgegevens: identiteitsbewijs en kopie', u: 'https://www.autoriteitpersoonsgegevens.nl/nl/onderwerpen/identificatie/identiteitsbewijs' },
    roKopieId: { t: 'Rijksoverheid: welke organisaties mogen een kopie van mijn identiteitsbewijs maken?', u: 'https://www.rijksoverheid.nl/onderwerpen/identiteitsfraude/vraag-en-antwoord/ben-ik-verplicht-om-een-kopie-van-mijn-identiteitsbewijs-te-geven-aan-een-bedrijf' },
    roOverlijden: { t: 'Rijksoverheid: overlijden, wat moet u regelen?', u: 'https://www.rijksoverheid.nl/onderwerpen/overlijden/vraag-en-antwoord/checklist-bij-overlijden' },
    svbAnw: { t: 'SVB: voorwaarden nabestaandenuitkering (Anw)', u: 'https://www.svb.nl/nl/anw/wat-zijn-de-voorwaarden/wat-zijn-de-voorwaarden-voor-een-nabestaandenuitkering' },
    roAowLeeftijd: { t: 'Rijksoverheid: AOW-leeftijd', u: 'https://www.rijksoverheid.nl/themas/belastingen-uitkeringen-en-toeslagen/algemene-ouderdomswet-aow/aow-leeftijd' },
    svbAow: { t: 'SVB: AOW-bedragen vanaf juli 2026', u: 'https://www.svb.nl/nl/aow/nieuws/aow-bedragen-vanaf-juli-2026' },
    mpo: { t: 'Mijnpensioenoverzicht.nl', u: 'https://www.mijnpensioenoverzicht.nl' },
    roWtp: { t: 'Rijksoverheid: voldoende tijd voor overgang naar nieuw pensioenstelsel', u: 'https://www.rijksoverheid.nl/actueel/nieuws/2025/12/02/voldoende-tijd-voor-overgang-naar-nieuw-pensioenstelsel' },
    dnbWtp: { t: 'DNB: op weg naar het nieuwe pensioenstelsel', u: 'https://www.dnb.nl/actuele-economische-vraagstukken/pensioen/op-weg-naar-het-nieuwe-pensioenstelsel/' },
    bdLijfrente: { t: 'Belastingdienst: aftrekken lijfrentepremies', u: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/werk_en_inkomen/lijfrente/aftrekken-lijfrentepremies/aftrekken-lijfrentepremies' },
    isde: { t: 'RVO: ISDE-subsidie voor woningeigenaren', u: 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren' },
    vvvHerbouw: { t: 'Verbond van Verzekeraars: Inboedelindex en Herbouwwaardemeter', u: 'https://www.verzekeraars.nl/branche/data-analytics-en-onderzoek/cijfers-statistieken/indexcijfers-inboedels-en-gebouwen' },
    bkrLang: { t: 'BKR: waarom blijven mijn gegevens bewaard na het einde van mijn krediet?', u: 'https://www.bkr.nl/veelgestelde-vragen/registratie-bij-stichting-bkr/hoe-lang-sta-ik-geregistreerd/' },
    bkrReg: { t: 'BKR: jouw kredietregistratie', u: 'https://www.bkr.nl/jouw-situatie/een-bkr-registratie-zo-zit-dat/' },
    kifidHoe: { t: 'Kifid: hoe gaat de klachtbehandeling in zijn werk?', u: 'https://www.kifid.nl/ik-heb-een-klacht/hoe-werkt-het/' },
    apInzage: { t: 'Autoriteit Persoonsgegevens: recht op inzage', u: 'https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/gebruik-uw-privacyrechten/recht-op-inzage' },
    apVergeten: { t: 'Autoriteit Persoonsgegevens: recht op vergetelheid', u: 'https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/gebruik-uw-privacyrechten/recht-op-vergetelheid' },
    wwft: { t: 'Wet ter voorkoming van witwassen en financieren van terrorisme (Wwft)', u: 'https://wetten.overheid.nl/BWBR0024282/' },
    afmWwft: { t: 'AFM: Wwft (witwassen en terrorismefinanciering)', u: 'https://www.afm.nl/nl-nl/sector/themas/integriteit/wwft' },
    roMaxLenen: { t: 'Rijksoverheid: hoeveel kan ik maximaal lenen voor mijn koopwoning?', u: 'https://www.rijksoverheid.nl/vraag-en-antwoord/huis-kopen/maximaal-bedrag-lenen-koopwoning' },
    roLeennormen: { t: 'Rijksoverheid: leennormen 2026', u: 'https://www.rijksoverheid.nl/actueel/nieuws/2025/10/31/leennormen-2026-hypotheek-kan-iets-omhoog-door-verwachte-loonstijging' },
    afmBetaalBank: { t: 'AFM: wat mag ik van mijn bank verwachten bij dreigende betalingsproblemen?', u: 'https://www.afm.nl/nl-nl/consumenten/veelgestelde-vragen/hypotheken-algemeen/betaalproblemen-bank' },
    afmAchterstand: { t: 'AFM: betalingsachterstand hypotheek', u: 'https://www.afm.nl/nl-nl/consumenten/themas/producten/hypotheek/risico/betalingsachterstand' },
    nhgHulp: { t: 'NHG: hulp als je inkomen daalt', u: 'https://www.nhg.nl/hulp-van-nhg/hulp-van-de-hypotheekadviseur-bij-betalingsproblemen/' },
    roSchulden: { t: 'Rijksoverheid: hoe kom ik van beginnende geldzorgen of schulden af?', u: 'https://www.rijksoverheid.nl/vraag-en-antwoord/schulden/hoe-kom-ik-van-mijn-schulden-af' },
    uwvWw: { t: 'UWV: hoe lang duurt een WW-uitkering?', u: 'https://www.uwv.nl/nl/ww/hoelang-ww' },
    uwvWwAanvragen: { t: 'UWV: WW-uitkering aanvragen', u: 'https://www.uwv.nl/nl/ww/ww-aanvragen' }
  };
  var P = '2 oktober 2026';

  window.KLANTUITLEG = (window.KLANTUITLEG || []).concat([

    /* ---------------- Advies en kosten ---------------- */
    {
      id: 'wat-doet-adviseur', cat: 'Advies en kosten',
      titel: 'Wat doet een hypotheekadviseur en wat kost het?',
      kort: [
        'Je adviseur zoekt uit welke hypotheek en verzekeringen bij jouw situatie passen.',
        'Vóór het advies krijg je een vergelijkingskaart. Daarop staat wat de adviseur doet en wat het kost.',
        'Bij een hypotheek betaal je de adviseur zelf. De kosten zitten niet in het product.'
      ],
      uitleg: [
        'Een hypotheekadviseur brengt eerst jouw situatie in kaart: inkomen, uitgaven, wensen, plannen en risico’s. Denk aan wat er gebeurt als je ziek wordt, je baan verliest, met pensioen gaat of als je partner overlijdt. Daarna adviseert de adviseur welke hypotheek en welke verzekeringen passen. Je krijgt het advies op papier, met de redenen erbij.',
        'De AFM schrijft voor dat je een vergelijkingskaart krijgt. Die krijg je vóór, tijdens of direct na het eerste gesprek, maar in elk geval vóórdat je advies krijgt. Op de kaart staat welke diensten de adviseur levert, hoe onafhankelijk hij is en wat het kost. Zo kun je adviseurs makkelijk met elkaar vergelijken.',
        'Voor een hypotheek en een aantal andere producten mag de adviseur geen beloning (provisie) van de bank of verzekeraar krijgen. Je betaalt de adviseur zelf, bijvoorbeeld een vast bedrag, een uurtarief of een abonnement. De kosten van advies en bemiddeling voor je hypotheek zijn meestal aftrekbaar in je aangifte inkomstenbelasting.'
      ],
      letop: [
        'Vraag vooraf welk bedrag je betaalt en wanneer. Moet je ook betalen als de hypotheek niet doorgaat?',
        'Advies en bemiddeling zijn twee verschillende diensten. Soms kun je ze los afnemen.',
        'Lees het adviesrapport goed. Klopt alles wat erin staat over jou?'
      ],
      vragen: [
        'Welke diensten zitten in jullie tarief, en welke niet?',
        'Met welke banken en verzekeraars werken jullie samen?',
        'Wat kost het als ik later iets wil wijzigen of laten nakijken?'
      ],
      bronnen: [B.afmKaart, B.afmKosten, B.afmAdvies, B.bdAftrekKosten], peildatum: P,
      kw: 'vergelijkingskaart dienstverleningsdocument advieskosten provisie fee uurtarief bemiddeling'
    },
    {
      id: 'klachten', cat: 'Advies en kosten',
      titel: 'Ben je niet tevreden? Zo dien je een klacht in',
      kort: [
        'Meld je klacht eerst bij ons kantoor. Wij zoeken samen met jou naar een oplossing.',
        'Kom je er met ons niet uit? Dan kun je naar Kifid, het klachteninstituut voor financiële diensten.',
        'Let op de termijn: dien je klacht bij Kifid op tijd in.'
      ],
      uitleg: [
        'Wij doen ons best, maar soms gaat er iets mis. Vertel het ons dan. Schrijf je klacht op: wat is er gebeurd, wanneer, en wat wil je dat wij doen? Wij bevestigen dat we je klacht hebben ontvangen en sturen je daarna een schriftelijke reactie.',
        'Ben je het niet eens met onze reactie, of krijg je geen antwoord? Dan kun je je klacht voorleggen aan Kifid (Klachteninstituut Financiële Dienstverlening). Kifid is onafhankelijk. Wij zijn bij Kifid aangesloten. Heb je binnen acht weken nog geen antwoord van ons, dan kan Kifid je klacht ook in behandeling nemen.',
        'Je moet je klacht bij Kifid op tijd indienen. Dat kan binnen drie maanden nadat wij schriftelijk ons definitieve standpunt hebben gegeven. Die termijn is nooit korter dan één jaar nadat je de klacht bij ons hebt ingediend. Je kunt ook naar de rechter.'
      ],
      letop: [
        'Bewaar alle brieven, e-mails en het adviesrapport.',
        'Staat de termijn voor Kifid niet in ons antwoord? Dan heb je een redelijke termijn nadat je ervan hoorde.',
        'Kifid behandelt alleen klachten over financiële diensten van aangesloten partijen.'
      ],
      vragen: [
        'Bij wie op kantoor kan ik mijn klacht kwijt?',
        'Hoe lang duurt het voordat ik een reactie krijg?',
        'Wat is jullie aansluitnummer bij Kifid?'
      ],
      bronnen: [B.kifidHoe], peildatum: P,
      kw: 'klacht klachtenprocedure kifid geschil ontevreden termijn drie maanden een jaar'
    },
    {
      id: 'privacy-avg', cat: 'Advies en kosten',
      titel: 'Jouw privacy: wat doen wij met je gegevens?',
      kort: [
        'Voor goed advies hebben wij persoonlijke en financiële gegevens van je nodig.',
        'Je mag altijd vragen welke gegevens wij van je hebben (recht op inzage).',
        'Wij bewaren gegevens niet langer dan nodig of dan de wet verplicht.'
      ],
      uitleg: [
        'Wij gebruiken je gegevens alleen voor het advies, de aanvraag en de nazorg. Denk aan je inkomen, je woning, je gezinssituatie en soms gegevens over je gezondheid voor een verzekering. Wij delen gegevens alleen met partijen die ze nodig hebben, zoals de bank, de verzekeraar of de notaris.',
        'Door de privacywet (AVG) heb je rechten. Je mag je gegevens inzien. Je hoeft niet te zeggen waarom. Wij reageren binnen één maand. Is je verzoek ingewikkeld, dan mogen we er twee maanden langer over doen; dat laten we je dan binnen een maand weten. Je mag ook vragen om fouten te verbeteren, gegevens te wissen of het gebruik te beperken. Je mag bezwaar maken.',
        'Sommige gegevens moeten wij door de wet een tijd bewaren, ook als jij vraagt om ze te wissen. Dan leggen wij uit waarom.'
      ],
      letop: [
        'Stuur geen kopie van je paspoort of loonstrook via een gewone, onbeveiligde mail als wij een veilige manier aanbieden.',
        'In onze privacyverklaring staat hoe en hoe lang wij je gegevens bewaren.',
        'Ben je het niet eens met hoe wij met je gegevens omgaan? Dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.'
      ],
      vragen: [
        'Met welke partijen delen jullie mijn gegevens?',
        'Hoe kan ik mijn documenten veilig aanleveren?',
        'Hoe lang bewaren jullie mijn dossier?'
      ],
      bronnen: [B.apInzage, B.apVergeten], peildatum: P,
      kw: 'avg privacy persoonsgegevens inzage wissen vergetelheid bewaartermijn autoriteit persoonsgegevens'
    },
    {
      id: 'wwft-identificatie', cat: 'Advies en kosten',
      titel: 'Waarom vragen wij om je identiteitsbewijs?',
      kort: [
        'Bemiddelen wij ook in levensverzekeringen (zoals een overlijdensrisicoverzekering), dan verplicht de wet (Wwft) ons om te controleren wie je bent.',
        'In andere gevallen vragen wij je identiteitsbewijs omdat de geldverstrekker of verzekeraar dat vereist, en om fraude te voorkomen.',
        'Dit doen we bij iedere klant. Het zegt niets over jou persoonlijk.'
      ],
      uitleg: [
        'Financiële bedrijven moeten helpen om witwassen en het financieren van terrorisme te voorkomen. Dat staat in de Wwft. Bemiddelen wij ook in levensverzekeringen (zoals een overlijdensrisicoverzekering), dan verplicht de Wwft ons om vast te stellen wie onze klant is. In andere gevallen vragen wij je identiteitsbewijs omdat de geldverstrekker of verzekeraar dat vereist en om fraude te voorkomen. Wij vragen een geldig paspoort, identiteitskaart of rijbewijs en controleren of de foto en de gegevens bij jou passen.',
        'Soms moeten we meer vragen. Bijvoorbeeld waar het eigen geld voor je woning vandaan komt, zoals spaargeld, een schenking of een erfenis. Of wij vragen of jij (of iemand in je directe omgeving) een belangrijke politieke functie hebt. Dat heet een PEP-controle.',
        'Wij bewaren alleen een kopie van je identiteitsbewijs als de wet ons dat verplicht, bijvoorbeeld de Wwft. Dan moeten wij de kopie en de gegevens van het onderzoek een aantal jaren bewaren nadat onze relatie is beëindigd. Is er geen wettelijke plicht, dan bekijken wij je identiteitsbewijs alleen, of vragen wij een kopie waarop je BSN en pasfoto zijn afgeschermd. Dat kan bijvoorbeeld met de KopieID-app van de overheid. Kunnen wij je identiteit niet vaststellen, dan kunnen wij je niet helpen.'
      ],
      letop: [
        'Zorg dat je identiteitsbewijs geldig is op het moment van de aanvraag én bij de notaris.',
        'Houd bewijs bij de hand van eigen geld, bijvoorbeeld bankafschriften of een schenkingsovereenkomst.',
        'Wij gebruiken je kopie alleen voor dit doel. Maak je zelf een kopie, scherm dan je BSN en pasfoto af als wij die niet nodig hebben.'
      ],
      vragen: [
        'Welk identiteitsbewijs mag ik gebruiken?',
        'Welke bewijsstukken hebben jullie nodig voor mijn eigen geld?',
        'Hoe bewaren jullie de kopie van mijn identiteitsbewijs?'
      ],
      bronnen: [B.wwft, B.afmWwft, B.apKopieId, B.roKopieId], peildatum: P,
      kw: 'wwft identificatie legitimatie paspoort id-bewijs witwassen herkomst vermogen pep cliëntenonderzoek'
    },

    /* ---------------- Hypotheek ---------------- */
    {
      id: 'annuiteit-lineair', cat: 'Hypotheek',
      titel: 'Annuïteit of lineair: hoe los je af?',
      kort: [
        'Bij beide vormen is de hypotheek aan het einde van de looptijd helemaal afgelost.',
        'Annuïtair: je bruto maandlast blijft gelijk (zolang de rente gelijk blijft).',
        'Lineair: je begint met hogere lasten, die elke maand een beetje dalen.'
      ],
      uitleg: [
        'Bij een annuïteitenhypotheek betaal je elke maand hetzelfde bruto bedrag aan rente en aflossing samen. In het begin is het grootste deel rente en los je weinig af. Later wordt dat andersom. Omdat de rente daalt, krijg je in de loop van de jaren minder renteaftrek. Je netto maandlast stijgt daardoor langzaam.',
        'Bij een lineaire hypotheek los je elke maand hetzelfde bedrag af. De rente berekent de bank over een steeds kleinere schuld. Daardoor zijn je lasten in het begin hoger en dalen ze daarna. In totaal betaal je minder rente dan bij een annuïteitenhypotheek.',
        'Wil je renteaftrek, dan moet je hypotheek volledig en minstens annuïtair worden afgelost in maximaal 30 jaar. Lineair voldoet daar ook aan.'
      ],
      letop: [
        'Kies een maandlast die je ook kunt betalen als het tegenzit.',
        'Je kunt verschillende leningdelen combineren.',
        'Extra aflossen kan vaak, maar vraag naar de regels en kosten.'
      ],
      vragen: [
        'Wat is het verschil in maandlast tussen beide vormen, bruto en netto?',
        'Hoeveel rente betaal ik in totaal bij elke vorm?',
        'Hoeveel mag ik per jaar boetevrij extra aflossen?'
      ],
      bronnen: [B.bdRenteAftrek, B.afmRente], peildatum: P,
      kw: 'annuiteit annuïteitenhypotheek lineair aflossen maandlast 30 jaar aflosvorm'
    },
    {
      id: 'rentevaste-periode', cat: 'Hypotheek',
      titel: 'De rentevaste periode: hoe lang zet je de rente vast?',
      kort: [
        'Tijdens de rentevaste periode verandert je hypotheekrente niet.',
        'Een langere rentevaste periode geeft zekerheid, maar de rente is vaak hoger.',
        'Aan het einde van de periode krijg je een nieuwe rente, die hoger of lager kan zijn.'
      ],
      uitleg: [
        'Je spreekt met de bank een rente af voor een bepaalde tijd, bijvoorbeeld 5, 10, 20 of 30 jaar. Zolang die periode loopt, blijft je rente gelijk. Je weet dan precies wat je betaalt.',
        'Kies je een korte periode of een variabele rente, dan is de rente vaak lager. Maar je loopt meer risico: als de rente stijgt, gaan je maandlasten omhoog. Kies je een lange periode, dan betaal je meestal iets meer, maar je hebt langer zekerheid.',
        'Wil je tijdens de rentevaste periode meer aflossen dan is toegestaan, of de hypotheek oversluiten? Dan kan de bank een vergoeding vragen (boeterente). Bij verkoop van je huis of overlijden is aflossen meestal zonder vergoeding.'
      ],
      letop: [
        'Kun je een hogere maandlast betalen als de rente na de periode stijgt?',
        'Vraag of de bank een rentebedenktijd of een verhuisregeling heeft.',
        'De rente is soms afhankelijk van je energielabel of van de verhouding tussen schuld en woningwaarde.'
      ],
      vragen: [
        'Hoeveel stijgt mijn maandlast als de rente na de rentevaste periode 1% of 2% hoger is?',
        'Wanneer moet ik een boeterente betalen en hoe wordt die berekend?',
        'Daalt mijn rente automatisch als ik meer aflos?'
      ],
      bronnen: [B.afmRente, B.afmRisico, B.afmVervroegd], peildatum: P,
      kw: 'rentevast rentevaste periode variabele rente renterisico boeterente rentebedenktijd'
    },
    {
      id: 'nhg', cat: 'Hypotheek',
      titel: 'Nationale Hypotheek Garantie (NHG)',
      kort: [
        'NHG is een vangnet als je je hypotheek niet meer kunt betalen en je huis moet verkopen.',
        'In 2026 kun je NHG krijgen voor een hypotheek tot € 470.000, of € 498.200 met energiebesparende maatregelen.',
        'Je betaalt eenmalig 0,4% van het hypotheekbedrag. Die kosten zijn fiscaal aftrekbaar.'
      ],
      uitleg: [
        'Met NHG staat de stichting Waarborgfonds Eigen Woningen garant voor je hypotheek. Moet je je huis verkopen door bijvoorbeeld werkloosheid, arbeidsongeschiktheid, een scheiding of overlijden, en houd je een restschuld over? Dan kan NHG die restschuld onder voorwaarden overnemen. Je moet dan wel alles hebben gedaan om de problemen te beperken.',
        'Banken zien minder risico bij NHG. Daarom krijg je vaak een lagere rente.',
        'De NHG-grens is in 2026 € 470.000. Neem je energiebesparende voorzieningen mee in je hypotheek, dan is de grens € 498.200. Voor NHG betaal je eenmalig een borgtochtprovisie van 0,4% van het hypotheekbedrag. Dit bedrag mag je aftrekken in je aangifte inkomstenbelasting.'
      ],
      letop: [
        'NHG heeft eigen voorwaarden, bijvoorbeeld voor hoeveel je mag lenen en waarvoor.',
        'NHG is geen verzekering. Je blijft zelf verantwoordelijk voor je hypotheek.',
        'Wil je later je hypotheek veranderen? Dan gelden er regels van NHG.'
      ],
      vragen: [
        'Kom ik in aanmerking voor NHG?',
        'Hoeveel rentekorting krijg ik met NHG bij deze bank?',
        'Wat gebeurt er met de NHG als ik later bijleen of mijn hypotheek oversluit?'
      ],
      bronnen: [B.nhgGrens, B.nhgProduct, B.nhgWijzig, B.bdAftrekKosten], peildatum: P,
      kw: 'nhg nationale hypotheek garantie borgtochtprovisie kostengrens 470000 498200 restschuld kwijtschelding'
    },
    {
      id: 'kosten-koper', cat: 'Hypotheek',
      titel: 'Kosten koper en de startersvrijstelling (2026)',
      kort: [
        'Naast de koopprijs betaal je kosten koper, zoals overdrachtsbelasting, notaris en taxatie.',
        'Overdrachtsbelasting voor een woning waar je zelf gaat wonen is in 2026 2%.',
        'Ben je 18 tot 35 jaar en koop je voor het eerst met de vrijstelling? Dan betaal je soms 0%.'
      ],
      uitleg: [
        'Kosten koper zijn de kosten die bij de aankoop van een woning komen. Denk aan overdrachtsbelasting, de notaris (leveringsakte en hypotheekakte), het kadaster, de taxatie, het advies en de bemiddeling, NHG en soms een bankgarantie of bouwkundige keuring. Deze kosten kun je in de regel niet meefinancieren in je hypotheek. Je betaalt ze dus meestal met eigen geld.',
        'Koop je een woning waar je zelf gaat wonen, dan is de overdrachtsbelasting in 2026 2%. Voor andere woningen, zoals een woning om te verhuren, is dat 8%.',
        'Startersvrijstelling: je betaalt geen overdrachtsbelasting als je aan alle voorwaarden voldoet. Je bent 18 jaar of ouder en jonger dan 35 op het moment dat je bij de notaris tekent. Je hebt de vrijstelling nog niet eerder gebruikt. Je gaat zelf langere tijd in de woning wonen. En de woningwaarde is in 2026 niet hoger dan € 555.000.'
      ],
      letop: [
        'Is de woningwaarde hoger dan € 555.000? Dan krijg je geen vrijstelling, ook niet voor een deel.',
        'Kosten voor je hypotheek, zoals advies, taxatie, hypotheekakte en NHG, zijn meestal aftrekbaar. Overdrachtsbelasting en de leveringsakte niet.',
        'Koop je samen, dan wordt de vrijstelling per koper bekeken.'
      ],
      vragen: [
        'Hoeveel eigen geld heb ik nodig voor de kosten koper?',
        'Voldoe ik aan de voorwaarden voor de startersvrijstelling?',
        'Welke kosten mag ik aftrekken in mijn aangifte?'
      ],
      bronnen: [B.bdStarter, B.bdOvb2, B.bdAftrekKosten], peildatum: P,
      kw: 'kosten koper kk overdrachtsbelasting ovb startersvrijstelling 2% 8% 555000 notaris taxatie'
    },
    {
      id: 'overbruggingskrediet', cat: 'Hypotheek',
      titel: 'Overbruggingskrediet: als je oude huis nog niet verkocht is',
      kort: [
        'Een overbruggingskrediet is een tijdelijke lening voor de overwaarde van je oude huis.',
        'Zo kun je je nieuwe huis kopen voordat je oude huis is verkocht.',
        'Je betaalt een tijdje dubbele woonlasten. Dat moet je kunnen dragen.'
      ],
      uitleg: [
        'Je hebt een nieuwe woning gekocht, maar je oude woning is nog niet verkocht of nog niet overgedragen. De overwaarde van je oude huis zit dan nog “vast”. Met een overbruggingskrediet leent de bank je dat bedrag tijdelijk. Als je oude woning is verkocht, los je het krediet af met de opbrengst.',
        'Zolang je twee huizen hebt, betaal je voor allebei: rente, overbruggingsrente, gemeentelijke belastingen, energie en verzekeringen. De bank kijkt of je dat kunt betalen.',
        'Voor de renteaftrek gelden tijdelijke regels. Staat je vorige woning te koop, dan mag je de rente daarvan onder voorwaarden nog maximaal drie jaar aftrekken.'
      ],
      letop: [
        'Wat als je oude huis minder opbrengt of lang niet verkocht wordt?',
        'Banken hebben regels voor hoe lang een overbrugging mag duren.',
        'Laat de overwaarde voorzichtig inschatten, bijvoorbeeld met een taxatie.'
      ],
      vragen: [
        'Hoeveel dubbele lasten betaal ik per maand?',
        'Wat gebeurt er als mijn huis na de looptijd van de overbrugging nog niet verkocht is?',
        'Hoe werkt de renteaftrek in de periode met twee huizen?'
      ],
      bronnen: [B.bdVorigeWoning, B.bdTweeWoningen], peildatum: P,
      kw: 'overbrugging overbruggingskrediet dubbele lasten twee woningen verhuizen overwaarde'
    },
    {
      id: 'aflossingsvrij', cat: 'Hypotheek',
      titel: 'Aflossingsvrije hypotheek: wat zijn de risico’s?',
      kort: [
        'Bij een aflossingsvrije hypotheek betaal je alleen rente. De schuld blijft even hoog.',
        'Aan het einde van de looptijd moet je de schuld in één keer aflossen of opnieuw financieren.',
        'Lukt dat niet, dan moet je misschien je huis verkopen.'
      ],
      uitleg: [
        'Veel mensen hebben nog een aflossingsvrije hypotheek uit de tijd vóór 2013. De maandlasten zijn laag, omdat je niet aflost. Maar de schuld verdwijnt niet vanzelf. Na 30 jaar (of het moment in je contract) moet de hypotheek worden afgelost of verlengd.',
        'Een bank verlengt alleen als jouw inkomen dan nog genoeg is. Na je pensioen is je inkomen vaak lager. De rente kan ook hoger zijn, en de renteaftrek kan stoppen. De AFM waarschuwt dat een groep huishoudens hierdoor in de problemen kan komen en het huis moet verkopen, soms met een restschuld.',
        'Voor nieuwe aflossingsvrije leningen na 2012 krijg je in de regel geen renteaftrek. Voor oude leningen kan overgangsrecht gelden.'
      ],
      letop: [
        'Kijk op tijd naar de einddatum van je hypotheek, niet pas in het laatste jaar.',
        'Extra aflossen of sparen verkleint het probleem.',
        'Een gedeeltelijke omzetting naar een annuïteit kan de schuld laten dalen.'
      ],
      vragen: [
        'Wanneer loopt mijn aflossingsvrije deel af en wat gebeurt er dan?',
        'Kan ik de hypotheek na mijn pensioen nog betalen?',
        'Raak ik overgangsrecht voor de renteaftrek kwijt als ik iets verander?'
      ],
      bronnen: [B.afmAflosvrij, B.afmRisico, B.bdRenteAftrek], peildatum: P,
      kw: 'aflossingsvrij aflossingsvrije hypotheek einde looptijd herfinanciering restschuld overgangsrecht pensioen'
    },
    {
      id: 'rentemiddeling-oversluiten', cat: 'Hypotheek',
      titel: 'Rentemiddeling en oversluiten: je rente eerder aanpassen',
      kort: [
        'Is de rente nu lager dan jouw rente? Dan kun je soms nu al een nieuwe rente afspreken.',
        'Bij rentemiddeling betaal je de vergoeding via een opslag op je nieuwe rente.',
        'Bij oversluiten betaal je de vergoeding meestal in één keer.'
      ],
      uitleg: [
        'Je zit vast aan een rente voor een bepaalde periode. Als je die afspraak eerder stopt, heeft de bank daar nadeel van. Daarom mag de bank een vergoeding vragen. Die mag niet hoger zijn dan het financiële nadeel van de bank.',
        'Rentemiddeling: je spreekt bij je eigen bank een nieuwe rente af met een nieuwe rentevaste periode. De vergoeding wordt dan over de nieuwe periode verdeeld, als een opslag op de rente. Je hoeft dus niet in één keer te betalen. De bank moet je laten zien hoe de vergoeding is berekend.',
        'Oversluiten: je stapt over naar een andere bank of een ander product. Je betaalt de vergoeding dan meestal in één keer. Daarbij komen kosten, zoals advies, taxatie en notaris.'
      ],
      letop: [
        'Rentemiddeling levert niet altijd voordeel op. Vergelijk de totale kosten over de hele periode.',
        'Niet elke bank biedt rentemiddeling aan.',
        'Vraag de berekening van de vergoeding op en laat die controleren.'
      ],
      vragen: [
        'Hoeveel bespaar ik netto, na alle kosten?',
        'Hoe hoog is de opslag en over welke periode?',
        'Is wachten tot het einde van mijn rentevaste periode verstandiger?'
      ],
      bronnen: [B.afmMiddeling, B.afmVervroegd], peildatum: P,
      kw: 'rentemiddeling oversluiten boeterente vergoeding vervroegd aflossen opslag rente verlagen'
    },
    {
      id: 'energielabel-verduurzamen', cat: 'Hypotheek',
      titel: 'Energielabel en verduurzamen',
      kort: [
        'Het energielabel laat zien hoe zuinig je huis is, van A++++ tot G.',
        'Een beter label kan invloed hebben op hoeveel je mag lenen en soms op je rente.',
        'Voor energiebesparende maatregelen kun je soms extra lenen of subsidie krijgen.'
      ],
      uitleg: [
        'Een energiezuinig huis heeft lagere energiekosten. Daarom houden de leenregels rekening met het energielabel: met een zuiniger label kun je soms meer lenen. Sommige banken geven ook rentekorting bij een goed label.',
        'Wil je je huis verduurzamen, bijvoorbeeld met isolatie, een warmtepomp of zonnepanelen? Dan kun je die kosten vaak meefinancieren in je hypotheek. Met NHG is de grens in 2026 € 498.200 als je energiebesparende voorzieningen meeneemt, in plaats van € 470.000.',
        'Voor sommige maatregelen bestaat subsidie, zoals de ISDE van de overheid. De voorwaarden en bedragen veranderen regelmatig.'
      ],
      letop: [
        'Wordt het geld in een bouwdepot gezet? Vraag naar de termijn waarin je het moet gebruiken.',
        'Vraag eerst offertes aan, zodat je weet wat het kost.',
        'Controleer de subsidievoorwaarden vóórdat je iets bestelt.'
      ],
      vragen: [
        'Hoeveel kan ik extra lenen voor verduurzaming?',
        'Krijg ik rentekorting bij een beter label?',
        'Welke subsidies zijn er nu voor mijn plannen?'
      ],
      bronnen: [B.nhgGrens, B.isde], peildatum: P,
      kw: 'energielabel verduurzamen isolatie warmtepomp zonnepanelen bouwdepot isde subsidie ebv'
    },
    {
      id: 'erfpacht', cat: 'Hypotheek',
      titel: 'Erfpacht: je bent eigenaar van het huis, niet van de grond',
      kort: [
        'Bij erfpacht is de grond van een ander, vaak de gemeente. Jij mag de grond gebruiken.',
        'Je betaalt daarvoor meestal elk jaar een bedrag: de canon.',
        'De jaarlijkse canon is aftrekbaar; een afkoopsom zelf niet.'
      ],
      uitleg: [
        'Erfpacht komt veel voor in sommige steden. Het huis is van jou, maar de grond niet. De eigenaar van de grond (de erfverpachter) geeft jou het recht om de grond te gebruiken. In ruil daarvoor betaal je een vergoeding: de erfpachtcanon.',
        'Er zijn verschillende vormen. Soms betaal je een jaarlijkse canon, soms heb je de canon voor een lange tijd of voor altijd afgekocht. Na een periode kan de canon opnieuw worden vastgesteld, en dan soms flink stijgen.',
        'De jaarlijkse canon is een aftrekbare kost voor je eigen woning. Een afkoopsom in één keer is zelf niet aftrekbaar. Leen je geld om de canon af te kopen, dan is de rente over die lening meestal wel aftrekbaar.'
      ],
      letop: [
        'Lees de erfpachtvoorwaarden goed: wanneer wordt de canon herzien?',
        'Banken en NHG rekenen de canon mee in je woonlasten. Dat kan je leenruimte verlagen.',
        'Een onzekere of hoge canon kan de verkoopbaarheid van je huis beïnvloeden.'
      ],
      vragen: [
        'Wanneer eindigt het huidige tijdvak en wat gebeurt er dan?',
        'Is afkopen voor mij voordelig?',
        'Hoe telt de canon mee bij mijn hypotheek?'
      ],
      bronnen: [B.bdAftrekKosten], peildatum: P,
      kw: 'erfpacht canon afkoop grond gemeente tijdvak herziening opstal'
    },
    {
      id: 'bkr', cat: 'Hypotheek',
      titel: 'BKR: wat staat er over jou geregistreerd?',
      kort: [
        'Bij het BKR staan leningen en kredieten van consumenten geregistreerd.',
        'De bank kijkt bij een hypotheekaanvraag altijd in het BKR.',
        'Een betalingsachterstand is niet altijd een probleem, maar vertel het vooraf.'
      ],
      uitleg: [
        'Stichting BKR houdt bij welke leningen je hebt. Denk aan een persoonlijke lening, doorlopend krediet, rood staan, een creditcard of een telefoon op afbetaling. Ook staat erin of je op tijd hebt betaald.',
        'Een bank gebruikt deze gegevens om te zien of je je hypotheek kunt betalen. Je lopende leningen verlagen het bedrag dat je kunt lenen. Ook als je de ruimte van een krediet niet gebruikt, telt die soms mee.',
        'Nadat je een krediet hebt afgelost, blijft de registratie nog een tijd zichtbaar (bij BKR in de regel 5 jaar). Je kunt je eigen gegevens gratis inzien via bkr.nl.'
      ],
      letop: [
        'Kijk vóór je aanvraag zelf in het BKR, zodat je niet verrast wordt.',
        'Vertel je adviseur over alle leningen, ook die niet in het BKR staan, zoals een studieschuld.',
        'Een kredietlimiet die je niet gebruikt? Laat die zo nodig stopzetten.'
      ],
      vragen: [
        'Hoeveel minder kan ik lenen door mijn huidige krediet?',
        'Moet ik een lening aflossen vóór de aanvraag?',
        'Hoe gaat de bank om met een oude achterstand?'
      ],
      bronnen: [B.bkrReg, B.bkrLang], peildatum: P,
      kw: 'bkr kredietregistratie achterstand krediet lening limiet coderingen'
    },

    /* ---------------- Fiscaal ---------------- */
    {
      id: 'renteaftrek-forfait', cat: 'Belasting',
      titel: 'Hypotheekrenteaftrek en eigenwoningforfait (2026)',
      kort: [
        'De rente over de hypotheek voor je eigen huis mag je onder voorwaarden aftrekken.',
        'Daar staat het eigenwoningforfait tegenover: een bijtelling van 0,35% van de WOZ-waarde (2026).',
        'In 2026 trek je de rente af tegen maximaal 37,56%.'
      ],
      uitleg: [
        'Woon je zelf in je huis, dan mag je de hypotheekrente aftrekken van je inkomen. Dat geldt alleen voor een lening voor kopen, verbouwen of onderhouden van je huis. Sinds 2013 moet je de lening dan in maximaal 30 jaar minstens annuïtair aflossen.',
        'Je moet ook een bedrag bij je inkomen tellen: het eigenwoningforfait. In 2026 is dat 0,35% van de WOZ-waarde voor woningen van € 75.000 tot € 1.350.000. Bij een hogere WOZ-waarde geldt voor het deel daarboven 2,35%.',
        'Het verschil (rente min forfait) zorgt voor teruggave. In 2026 is het maximale aftrektarief 37,56%. Heb je weinig of geen hypotheekschuld en is het forfait hoger dan de rente? Dan krijg je een extra aftrek (Hillen). Die wordt elk jaar kleiner; in 2026 is het 71,867% van het verschil.'
      ],
      letop: [
        'Je kunt de teruggave elke maand krijgen met een voorlopige aanslag.',
        'Je hypotheekrente-aftrek daalt elk jaar, omdat je aflost.',
        'Bedragen en percentages veranderen bijna elk jaar.'
      ],
      vragen: [
        'Hoeveel teruggave krijg ik ongeveer per maand?',
        'Is mijn hele hypotheek aftrekbaar, of maar een deel?',
        'Moet ik een voorlopige aanslag aanvragen?'
      ],
      bronnen: [B.bdRenteAftrek, B.bdForfait, B.bdKleineSchuld], peildatum: P,
      kw: 'renteaftrek hypotheekrenteaftrek eigenwoningforfait ewf hillen aftrektarief 37,56 0,35 woz'
    },
    {
      id: 'bijleenregeling', cat: 'Belasting',
      titel: 'Bijleenregeling en eigenwoningreserve',
      kort: [
        'Verkoop je je huis met winst (overwaarde)? Dan moet je die in principe in je nieuwe huis stoppen.',
        'Doe je dat niet, dan is een deel van je nieuwe hypotheek niet aftrekbaar.',
        'De overwaarde (eigenwoningreserve) blijft 3 jaar na de verkoop meetellen.'
      ],
      uitleg: [
        'De bijleenregeling zorgt ervoor dat je niet zomaar renteaftrek krijgt over geld dat je eigenlijk niet nodig had. Verkoop je je huis voor meer dan je hypotheek, dan heet het verschil (na aftrek van verkoopkosten) de eigenwoningreserve.',
        'Koop je een nieuw huis, dan wordt die eigenwoningreserve afgetrokken van het bedrag dat je met renteaftrek mag lenen. Gebruik je de overwaarde niet in je nieuwe huis, dan valt dat deel van de nieuwe lening in box 3. De rente daarover is niet aftrekbaar.',
        'De eigenwoningreserve blijft drie jaar na de verkoop bestaan. Koop je pas daarna een nieuw huis, dan geldt de reserve niet meer. Ook kan de reserve kleiner worden als je de overwaarde gebruikt voor bijvoorbeeld een verbouwing of het afkopen van erfpacht.'
      ],
      letop: [
        'Bewaar de stukken van de verkoop van je vorige huis (nota van afrekening).',
        'Ook een eerder huis kan nog een eigenwoningreserve hebben.',
        'Gaat je partner of ex ook verhuizen? De reserve wordt per persoon bekeken.'
      ],
      vragen: [
        'Hoe hoog is mijn eigenwoningreserve?',
        'Welk deel van mijn nieuwe hypotheek is aftrekbaar?',
        'Is het slim om de overwaarde helemaal in te brengen?'
      ],
      bronnen: [B.bdBijleen, B.bdTweeWoningen], peildatum: P,
      kw: 'bijleenregeling eigenwoningreserve ewr overwaarde box 3 verkoop verhuizen'
    },

    /* ---------------- Verzekeren ---------------- */
    {
      id: 'orv', cat: 'Verzekeren',
      titel: 'Overlijdensrisicoverzekering (ORV)',
      kort: [
        'Een ORV keert een afgesproken bedrag uit als jij of je partner overlijdt.',
        'Zo kan de achterblijvende partner vaak in het huis blijven wonen.',
        'Soms vraagt de bank een ORV als voorwaarde voor de hypotheek.'
      ],
      uitleg: [
        'Als een van de partners overlijdt, valt een inkomen weg. Is de hypotheek op twee inkomens gebaseerd, dan kunnen de lasten te hoog worden. Met een ORV krijgt de achterblijver een bedrag om de hypotheek (deels) af te lossen. Dan worden de maandlasten lager.',
        'Je kiest het verzekerd bedrag en de looptijd. Het bedrag kan gelijk blijven of elk jaar dalen, bijvoorbeeld mee met de aflossing van je hypotheek. De premie hangt af van onder meer je leeftijd, je gezondheid en of je rookt.',
        'Wie de verzekering betaalt en wie het geld krijgt, maakt uit voor de erfbelasting. Daarom sluiten partners die niet getrouwd zijn de verzekering vaak “kruislings” af: ieder verzekert het leven van de ander.'
      ],
      letop: [
        'Vul de gezondheidsverklaring eerlijk en volledig in. Anders kan de verzekeraar weigeren uit te keren.',
        'Pas je ORV aan als je situatie verandert, zoals bij samenwonen, kinderen of scheiden.',
        'Heb je al een uitkering via je werkgever of pensioen? Die telt mee.'
      ],
      vragen: [
        'Welk bedrag heeft mijn partner nodig om in het huis te blijven wonen?',
        'Moeten wij de verzekering kruislings afsluiten?',
        'Wat gebeurt er met de premie als ik stop met roken?'
      ],
      bronnen: [B.afmVerzAdviseur, B.svbAnw, B.bdErfVrij], peildatum: P,
      kw: 'orv overlijdensrisicoverzekering overlijden nabestaanden kruislings gezondheidsverklaring'
    },
    {
      id: 'aov', cat: 'Verzekeren',
      titel: 'Arbeidsongeschiktheidsverzekering (AOV)',
      kort: [
        'Een AOV vult je inkomen aan als je door ziekte of een ongeval niet (volledig) kunt werken.',
        'Voor ondernemers is dit vaak de belangrijkste inkomensverzekering.',
        'Werknemers hebben een wettelijk vangnet, maar dat dekt vaak niet het hele inkomen.'
      ],
      uitleg: [
        'Word je arbeidsongeschikt, dan daalt je inkomen. Werknemers krijgen eerst loon van hun werkgever en daarna soms een uitkering van UWV. Die uitkering is vaak lager dan je loon. Zelfstandigen hebben dat vangnet meestal niet.',
        'Met een AOV krijg je een uitkering als je (deels) niet kunt werken. Belangrijk is wanneer je als arbeidsongeschikt geldt: voor je eigen beroep, voor passend werk of voor alle werk. Ook de wachttijd (de tijd voordat de uitkering begint) en de eindleeftijd maken veel uit.',
        'Je kunt ook kiezen voor een verzekering die alleen je woonlasten dekt (woonlastenverzekering). Of een werkgever biedt een aanvullende verzekering aan. Kijk wat je al hebt voordat je iets nieuws afsluit.'
      ],
      letop: [
        'Een langere wachttijd geeft een lagere premie, maar je moet die tijd zelf kunnen overbruggen.',
        'Lees welke aandoeningen zijn uitgesloten.',
        'De premie voor een AOV is vaak aftrekbaar; de uitkering is dan belast.'
      ],
      vragen: [
        'Hoeveel inkomen houd ik over als ik arbeidsongeschikt word?',
        'Welke definitie van arbeidsongeschiktheid past bij mijn beroep?',
        'Welke wachttijd kan ik zelf betalen?'
      ],
      bronnen: [B.afmVerzAdviseur, B.afmRisico], peildatum: P,
      kw: 'aov arbeidsongeschiktheid ziekte zzp ondernemer wachttijd eindleeftijd beroepsdefinitie wia'
    },
    {
      id: 'woonlastenverzekering', cat: 'Verzekeren',
      titel: 'Woonlastenverzekering',
      kort: [
        'Een woonlastenverzekering betaalt een deel van je woonlasten als je inkomen daalt.',
        'Dat kan bij arbeidsongeschiktheid en/of werkloosheid.',
        'De uitkering duurt meestal een beperkte tijd.'
      ],
      uitleg: [
        'Een woonlastenverzekering helpt om je hypotheek te blijven betalen als je ziek wordt of je baan verliest. Je verzekert een vast bedrag per maand, vaak afgestemd op je maandlasten.',
        'De uitkering stopt meestal na een bepaalde periode. Bij werkloosheid kan die periode beperkt zijn, bijvoorbeeld als je nog niet lang werkt. Werkloosheid kan langer duren dan de uitkering. Daar heeft de AFM verzekeraars op gewezen.',
        'Voor ondernemers is werkloosheid vaak niet te verzekeren. Kijk dus goed wat er wel en niet onder valt.'
      ],
      letop: [
        'Hoe lang is de wachttijd en hoe lang de uitkeringsduur?',
        'Er gelden vaak uitsluitingen, zoals bij een tijdelijk contract of een proeftijd.',
        'Vergelijk met een AOV en met je eigen spaargeld.'
      ],
      vragen: [
        'Hoe lang krijg ik een uitkering bij werkloosheid?',
        'Wat is precies gedekt en wat niet?',
        'Heb ik deze verzekering nodig als ik al een buffer heb?'
      ],
      bronnen: [B.afmVerzAdviseur, B.afmRisico], peildatum: P,
      kw: 'woonlastenverzekering werkloosheid arbeidsongeschiktheid maandlasten uitkeringsduur'
    },
    {
      id: 'uitvaartverzekering', cat: 'Verzekeren',
      titel: 'Uitvaartverzekering',
      kort: [
        'Een uitvaartverzekering betaalt (een deel van) de kosten van je uitvaart.',
        'Er zijn verzekeringen die geld uitkeren en verzekeringen die diensten leveren.',
        'Controleer of het verzekerde bedrag nog past bij de kosten van nu.'
      ],
      uitleg: [
        'Een uitvaart kost veel geld. Met een uitvaartverzekering zorg je dat je nabestaanden die kosten niet zelf hoeven te betalen.',
        'Er zijn twee soorten. Bij een kapitaalverzekering krijgen je nabestaanden een geldbedrag en kiezen ze zelf hoe ze de uitvaart regelen. Bij een naturaverzekering levert de verzekeraar een pakket met diensten en spullen. Er zijn ook combinaties.',
        'Een oude polis kan te laag zijn geworden, omdat de kosten zijn gestegen. Soms groeit de dekking mee (indexatie), soms niet.'
      ],
      letop: [
        'Hoe lang betaal je premie? Soms tot je 65e of 80e, soms tot je overlijden.',
        'Leg vast wat je wensen zijn, zodat je nabestaanden weten wat je wilt.',
        'Heb je spaargeld voor je uitvaart? Dan is een verzekering misschien niet nodig.'
      ],
      vragen: [
        'Is mijn huidige uitvaartverzekering nog hoog genoeg?',
        'Groeit het verzekerde bedrag mee met de kosten?',
        'Wat betaal ik in totaal aan premie?'
      ],
      bronnen: [B.afmVerzAdviseur, B.roOverlijden], peildatum: P,
      kw: 'uitvaart uitvaartverzekering natura kapitaal begrafenis crematie indexatie'
    },
    {
      id: 'opstal-inboedel', cat: 'Verzekeren',
      titel: 'Opstal, inboedel en onderverzekering',
      kort: [
        'De opstalverzekering verzekert het huis zelf. De inboedelverzekering je spullen.',
        'Bij een koophuis met hypotheek is een opstalverzekering meestal verplicht.',
        'Ben je te laag verzekerd, dan krijg je bij schade misschien maar een deel vergoed.'
      ],
      uitleg: [
        'Een opstalverzekering vergoedt schade aan je huis, zoals door brand, storm of waterschade. De verzekering gaat uit van de herbouwwaarde: wat het kost om je huis opnieuw te bouwen. Dat is iets anders dan de WOZ-waarde of de koopprijs.',
        'Een inboedelverzekering vergoedt schade aan of diefstal van je spullen, zoals meubels, kleding en apparaten.',
        'Onderverzekering betekent dat de verzekerde waarde lager is dan de echte waarde. Bij schade vergoedt de verzekeraar dan soms maar een deel. Gebruikt je verzekeraar een waardemeter of heb je een garantie tegen onderverzekering? Dan is dat risico kleiner, mits je de gegevens goed invult.'
      ],
      letop: [
        'Heb je verbouwd of een uitbouw, zonnepanelen of een nieuwe keuken? Geef het door.',
        'Dure spullen, zoals sieraden of kunst, hebben vaak een maximum.',
        'Bij een appartement regelt de VvE meestal de opstalverzekering.'
      ],
      vragen: [
        'Heb ik een garantie tegen onderverzekering?',
        'Is de herbouwwaarde van mijn huis nog juist?',
        'Welke spullen moet ik apart opgeven?'
      ],
      bronnen: [B.vvvHerbouw], peildatum: P,
      kw: 'opstal opstalverzekering inboedel onderverzekering herbouwwaarde garantie vve schade'
    },

    /* ---------------- Levensgebeurtenissen ---------------- */
    {
      id: 'samenwonen-hypotheek', cat: 'Levensgebeurtenissen',
      titel: 'Samenwonen en een hypotheek',
      kort: [
        'Ga je samen een huis kopen? Leg goed vast wie wat inbrengt en wie wat bezit.',
        'Met een samenlevingscontract, huwelijk of partnerschap regel je wat er gebeurt bij uit elkaar gaan of overlijden.',
        'Jullie zijn allebei aansprakelijk voor de hele hypotheek.'
      ],
      uitleg: [
        'Koop je samen een huis, dan staan jullie meestal allebei op de hypotheek. Dat betekent dat de bank van ieder het hele bedrag kan vragen. Ook als jullie uit elkaar gaan.',
        'Brengt een van jullie meer eigen geld in? Leg dat dan vast, bijvoorbeeld bij de notaris. Anders kan dat geld bij uit elkaar gaan of overlijden verloren gaan. Een samenlevingscontract kan ook regelen dat de langstlevende het huis krijgt.',
        'Samenwoners kunnen fiscaal partner zijn, bijvoorbeeld als ze samen een huis bezitten en op hetzelfde adres staan ingeschreven. Dan mogen jullie de renteaftrek onderling verdelen.'
      ],
      letop: [
        'Ongehuwd samenwonen? Zonder testament erft je partner niet automatisch.',
        'Denk aan een overlijdensrisicoverzekering, liefst kruislings.',
        'Verandert er later iets, zoals een kind of een nieuwe baan? Kijk dan opnieuw naar je afspraken.'
      ],
      vragen: [
        'Hoe leggen wij het verschil in eigen geld vast?',
        'Hebben wij een samenlevingscontract of testament nodig?',
        'Wat gebeurt er met het huis als een van ons overlijdt?'
      ],
      bronnen: [B.roVerschilRelatie, B.bdSamenwonen, B.bdFiscPartner], peildatum: P,
      kw: 'samenwonen samenlevingscontract partner fiscaal partner hoofdelijk aansprakelijk testament eigen geld'
    },
    {
      id: 'scheiding-hypotheek', cat: 'Levensgebeurtenissen',
      titel: 'Scheiding en je hypotheek',
      kort: [
        'Bij een scheiding moet je samen beslissen wat er met het huis gebeurt.',
        'De bank moet toestemming geven als één van jullie de hypotheek alleen overneemt.',
        'Zolang de bank dat niet doet, blijven jullie allebei aansprakelijk.'
      ],
      uitleg: [
        'Er zijn drie keuzes: het huis verkopen, één partner neemt het huis over, of jullie houden het huis (tijdelijk) samen. Wil één van jullie het huis houden, dan moet die persoon de hypotheek alleen kunnen betalen. De bank toetst dat.',
        'Neemt de ene partner het huis over, dan vraagt die de bank om de ander te ontslaan uit de hoofdelijke aansprakelijkheid. Pas dan is de vertrekkende partner van de schuld af.',
        'Voor de renteaftrek gelden speciale regels. Woont je ex-partner nog in het huis, dan mag de vertrokken partner onder voorwaarden de rente nog maximaal 2 jaar aftrekken. Denk ook aan je pensioen, je verzekeringen en eventuele toeslagen.'
      ],
      letop: [
        'Teken niets bij de notaris voordat de bank akkoord heeft gegeven.',
        'Pas je ORV en begunstiging aan.',
        'Een scheiding meld je bij je pensioenuitvoerder. Dat heeft gevolgen voor het pensioen.'
      ],
      vragen: [
        'Kan ik de hypotheek alleen betalen?',
        'Wat kost het om mijn ex uit te kopen?',
        'Wat gebeurt er met de renteaftrek na de scheiding?'
      ],
      bronnen: [B.roScheiden, B.bdScheidingRente, B.afmScheiden], peildatum: P,
      kw: 'scheiding scheiden uit elkaar ex-partner overnemen ontslag hoofdelijke aansprakelijkheid uitkopen'
    },
    {
      id: 'overlijden-hypotheek', cat: 'Levensgebeurtenissen',
      titel: 'Overlijden en je hypotheek',
      kort: [
        'De hypotheek gaat na overlijden over op de erfgenamen of de langstlevende partner.',
        'Een ORV of nabestaandenpensioen kan helpen om de lasten te dragen.',
        'Neem op tijd contact op met de bank en je adviseur.'
      ],
      uitleg: [
        'Als iemand overlijdt, verdwijnt de hypotheek niet. De schuld hoort bij de nalatenschap. Meestal neemt de partner het huis en de hypotheek over. De bank kijkt dan of de partner de lasten alleen kan betalen.',
        'Een overlijdensrisicoverzekering (ORV) keert een bedrag uit waarmee de hypotheek deels kan worden afgelost. Soms is er ook een nabestaandenpensioen of, in bepaalde situaties, een uitkering van de SVB (Anw).',
        'Er zijn veel dingen tegelijk te regelen. Denk aan de aangifte erfbelasting, verzekeringen, het pensioen en de woning. Je hoeft niet alles meteen te doen, maar laat je goed helpen.'
      ],
      letop: [
        'Kijk wie de begunstigde is van de verzekeringen.',
        'Erfgenamen kunnen een erfenis aanvaarden, verwerpen of beneficiair aanvaarden.',
        'Laat eerst uitzoeken wat er vrijkomt, voordat je grote beslissingen neemt.'
      ],
      vragen: [
        'Wat keert er uit en wanneer?',
        'Kan ik in het huis blijven wonen?',
        'Wat moet ik nu regelen met de bank?'
      ],
      bronnen: [B.roOverlijden, B.svbAnw, B.bdErfVrij], peildatum: P,
      kw: 'overlijden nabestaanden anw erfenis nalatenschap orv langstlevende'
    },

    /* ---------------- Pensioen en vermogen ---------------- */
    {
      id: 'pensioen-aow-gat', cat: 'Pensioen en vermogen',
      titel: 'Pensioen en het AOW-gat',
      kort: [
        'Je AOW begint op je AOW-leeftijd. Die is 67 jaar in 2026 en 2027.',
        'Vanaf 2028 gaat de AOW-leeftijd naar 67 jaar en 3 maanden.',
        'Stop je eerder met werken, dan heb je tot je AOW-leeftijd geen AOW. Dat heet het AOW-gat.'
      ],
      uitleg: [
        'Je pensioen bestaat meestal uit drie delen: de AOW van de overheid, pensioen via je werkgever en wat je zelf hebt opgebouwd. Op mijnpensioenoverzicht.nl zie je wat je hebt opgebouwd.',
        'De AOW-leeftijd hangt af van je geboortedatum. Ga je eerder stoppen met werken of gaat je pensioen eerder in, dan moet je de tijd tot je AOW zelf overbruggen. Dat is het AOW-gat.',
        'Na je pensioen is je inkomen vaak lager. Check of je dan je hypotheek en andere vaste lasten nog kunt betalen. Daar kijkt de bank ook naar als je hypotheek doorloopt na je AOW-leeftijd.'
      ],
      letop: [
        'Kijk elk jaar naar je pensioenoverzicht.',
        'Bij een scheiding of overlijden verandert er veel aan het pensioen.',
        'Het AOW-bedrag hangt af van of je alleen woont of samen.'
      ],
      vragen: [
        'Hoeveel inkomen heb ik na mijn pensioen?',
        'Kan ik dan mijn hypotheek nog betalen?',
        'Hoe kan ik een tekort aanvullen?'
      ],
      bronnen: [B.roAowLeeftijd, B.svbAow, B.mpo], peildatum: P,
      kw: 'pensioen aow aow-leeftijd aow-gat 67 eerder stoppen inkomen na pensioen'
    },
    {
      id: 'wtp-kort', cat: 'Pensioen en vermogen',
      titel: 'Het nieuwe pensioenstelsel (Wtp) in het kort',
      kort: [
        'Door de Wet toekomst pensioenen (Wtp) verandert het pensioen via je werk.',
        'Alle regelingen moeten uiterlijk 1 januari 2028 zijn overgestapt.',
        'Je pensioen kan in het nieuwe stelsel meer meebewegen met de economie.'
      ],
      uitleg: [
        'Het pensioenstelsel in Nederland verandert. Pensioenfondsen en verzekeraars stappen in stappen over naar nieuwe regels. Sommige zijn al overgestapt, andere doen dat in 2027. Uiterlijk 1 januari 2028 moeten alle regelingen over zijn.',
        'In het nieuwe stelsel zie je beter hoeveel pensioengeld er voor jou is. Je pensioen kan sneller stijgen als het goed gaat met de economie, maar ook dalen als het tegenzit.',
        'Je pensioenuitvoerder informeert je over wat er voor jou verandert. Lees die brieven goed. De AOW verandert niet door de Wtp.'
      ],
      letop: [
        'Je pensioenuitvoerder stuurt je informatie over de overstap.',
        'Je partnerpensioen kan veranderen.',
        'Bij twijfel kun je vragen stellen aan je pensioenuitvoerder.'
      ],
      vragen: [
        'Wanneer stapt mijn pensioenfonds over?',
        'Wat betekent de overstap voor mijn partnerpensioen?',
        'Moet ik zelf iets doen?'
      ],
      bronnen: [B.roWtp, B.dnbWtp, B.mpo], peildatum: P,
      kw: 'wtp wet toekomst pensioenen nieuw pensioenstelsel invaren transitie 2028 partnerpensioen'
    },
    {
      id: 'jaarruimte-lijfrente', cat: 'Pensioen en vermogen',
      titel: 'Jaarruimte en lijfrente: zelf extra pensioen opbouwen',
      kort: [
        'Bouw je weinig pensioen op? Dan mag je zelf extra sparen met belastingvoordeel.',
        'Hoeveel je mag inleggen heet jaarruimte. Gebruik je die niet, dan is er reserveringsruimte.',
        'De inleg is aftrekbaar; de uitkering later is belast.'
      ],
      uitleg: [
        'Een lijfrente is een manier om zelf pensioen op te bouwen. Dat kan met een lijfrenterekening, een beleggingsrecht of een verzekering. De inleg mag je onder voorwaarden aftrekken van je inkomen. Later, als de uitkering begint, betaal je belasting.',
        'Hoeveel je mag aftrekken, hangt af van je inkomen en hoeveel pensioen je al via je werk opbouwt. Dat heet de jaarruimte. Heb je je jaarruimte in eerdere jaren niet gebruikt, dan kun je die vaak nog inhalen via de reserveringsruimte.',
        'Om de aftrek voor een jaar te krijgen, moet je de inleg in datzelfde jaar betalen. De Belastingdienst heeft een rekenhulp om je jaarruimte uit te rekenen.'
      ],
      letop: [
        'Je geld staat vast tot de uitkering begint. Je kunt er niet zomaar bij.',
        'Het Wtp en je pensioen via werk kunnen invloed hebben op je ruimte.',
        'Betaal op tijd, vóór het einde van het jaar.'
      ],
      vragen: [
        'Hoeveel jaarruimte heb ik dit jaar?',
        'Heb ik nog reserveringsruimte uit eerdere jaren?',
        'Hoeveel belastingvoordeel levert het mij op?'
      ],
      bronnen: [B.bdLijfrente, B.mpo], peildatum: P,
      kw: 'jaarruimte reserveringsruimte lijfrente pensioentekort zzp aftrek bankspaarrekening'
    },

    /* ---------------- Familie en schenken ---------------- */
    {
      id: 'schenken-woning', cat: 'Familie en schenken',
      titel: 'Schenken voor de woning (2026)',
      kort: [
        'De speciale vrijstelling voor een schenking voor de eigen woning (“jubelton”) bestaat sinds 2024 niet meer.',
        'Ouders mogen hun kind in 2026 elk jaar € 6.908 belastingvrij schenken.',
        'Een kind van 18 tot 40 jaar mag eenmalig € 33.129 belastingvrij krijgen voor iets naar keuze.'
      ],
      uitleg: [
        'Vroeger kon je een groot bedrag belastingvrij krijgen voor je eigen woning. Die regeling is per 1 januari 2024 afgeschaft. Schenkingen voor een woning vallen nu onder de gewone regels.',
        'In 2026 mogen ouders hun kind elk jaar € 6.908 belastingvrij schenken. Is het kind tussen 18 en 40 jaar, dan mag de schenking eenmalig hoger zijn: € 33.129, vrij te besteden. Kies je voor die verhoogde vrijstelling, dan geldt in dat jaar niet ook nog de gewone jaarlijkse vrijstelling.',
        'Schenk je meer, dan betaalt de ontvanger schenkbelasting over het deel boven de vrijstelling. Soms moet de ontvanger aangifte doen.'
      ],
      letop: [
        'Een schenking die je gebruikt voor de woning verlaagt het bedrag dat je moet lenen. Dat beïnvloedt ook je renteaftrek.',
        'Leg de schenking vast. De bank wil weten waar het geld vandaan komt.',
        'Wordt de schenking op papier gezet en later pas betaald? Dan gelden extra eisen.'
      ],
      vragen: [
        'Hoeveel kunnen mijn ouders mij belastingvrij geven?',
        'Is lenen van mijn ouders slimmer dan een schenking?',
        'Moet ik aangifte schenkbelasting doen?'
      ],
      bronnen: [B.bdSchenkKind, B.bdSchenk2026, B.bdJubelton], peildatum: P,
      kw: 'schenken schenking jubelton schenkvrijstelling 6908 33129 ouders kind schenkbelasting'
    },
    {
      id: 'familiehypotheek', cat: 'Familie en schenken',
      titel: 'Familiehypotheek: geld lenen van je ouders',
      kort: [
        'Je kunt geld voor je huis ook lenen van familie, bijvoorbeeld je ouders.',
        'De rente is aftrekbaar als je aan dezelfde voorwaarden voldoet als bij een bank.',
        'Je moet de lening zelf opgeven in je aangifte, anders vervalt de aftrek.'
      ],
      uitleg: [
        'Bij een familiehypotheek leen je geld van je ouders of andere familie in plaats van (een deel) bij de bank. Je betaalt rente en aflossing aan je familie. Voor de ouders kan dat meer opleveren dan sparen, en voor jou kan de rente lager zijn dan bij een bank. De rente moet wel zakelijk zijn.',
        'Je mag de rente aftrekken als je aan de voorwaarden voldoet. Je gebruikt de lening voor je eigen woning. Je lost in maximaal 30 jaar minstens annuïtair af, zoals afgesproken in een schriftelijk contract. De rente is marktconform en je betaalt die echt. En je geeft de gegevens van de lening op in je aangifte.',
        'Ouders kunnen elk jaar een deel van de rente of de schuld kwijtschelden als schenking. Dan gelden de schenkregels. Een kwijtgescholden rente is niet aftrekbaar.'
      ],
      letop: [
        'Leg alles vast in een leningsovereenkomst, eventueel bij de notaris.',
        'De ouders moeten de vordering opgeven in box 3.',
        'Bespreek met de bank of een familielening naast de hypotheek is toegestaan.'
      ],
      vragen: [
        'Welke rente is zakelijk voor onze lening?',
        'Hoe leggen we de lening goed vast?',
        'Wat betekent dit bij een erfenis voor mijn broers of zussen?'
      ],
      bronnen: [B.bdFamilie, B.bdSchenkKind], peildatum: P,
      kw: 'familiehypotheek lenen ouders familielening renteaftrek marktconform opgave aangifte kwijtschelden'
    },
    {
      id: 'hoeveel-lenen', cat: 'Hypotheek',
      titel: 'Hoeveel kun je lenen voor een huis?',
      kort: [
        'Hoeveel je kunt lenen hangt vooral af van je inkomen en de waarde van de woning.',
        'Je mag in de regel niet meer lenen dan 100% van de woningwaarde.',
        'Andere leningen, zoals een studieschuld of lease, verlagen je leenruimte.'
      ],
      uitleg: [
        'De overheid stelt elk jaar regels vast voor hoeveel je maximaal mag lenen. Het Nibud geeft daarover advies. Banken moeten zich aan die regels houden. Zo voorkom je dat je meer leent dan je kunt betalen.',
        'Belangrijk zijn je bruto inkomen, de rente en de rentevaste periode. Ook je andere financiële verplichtingen tellen mee, zoals een persoonlijke lening, een leasecontract of een studieschuld. Je kunt in de regel niet meer lenen dan de waarde van de woning. Voor energiebesparende maatregelen gelden soms ruimere regels.',
        'Het maximum is niet altijd verstandig. Een adviseur kijkt ook naar je uitgaven, je plannen en je buffer. Zo kom je op een bedrag dat bij jouw leven past.'
      ],
      letop: [
        'Houd rekening met kosten koper. Die betaal je meestal met eigen geld.',
        'Een tijdelijk contract of eigen bedrijf? Dan kijkt de bank op een andere manier naar je inkomen.',
        'Vergeet geen kosten voor onderhoud, energie en verzekeringen.'
      ],
      vragen: [
        'Hoeveel kan ik maximaal lenen, en hoeveel raad je mij aan?',
        'Hoe telt mijn studieschuld of lening mee?',
        'Wat blijft er per maand over voor de rest van mijn uitgaven?'
      ],
      bronnen: [B.roMaxLenen, B.roLeennormen, B.bkrReg], peildatum: P,
      kw: 'hoeveel lenen maximale hypotheek leennormen inkomen nibud studieschuld 100% woningwaarde'
    },
    {
      id: 'betalingsproblemen', cat: 'Levensgebeurtenissen',
      titel: 'Moeite met betalen van je hypotheek? Wacht niet',
      kort: [
        'Neem zo snel mogelijk contact op met je bank, liefst vóórdat je een achterstand hebt.',
        'Bijna alle banken hebben een speciale afdeling die met je meekijkt.',
        'Er zijn vaak oplossingen, zoals tijdelijk minder betalen of hulp bij je budget.'
      ],
      uitleg: [
        'Je inkomen kan dalen door bijvoorbeeld werkloosheid, ziekte, een scheiding of hogere lasten. Verwacht je dat je de hypotheek niet meer kunt betalen? Bel of mail dan meteen je bank. Hoe eerder je dat doet, hoe meer mogelijkheden er zijn.',
        'De bank kijkt samen met jou naar je situatie. Soms is een tijdelijke betaalpauze of een lagere aflossing mogelijk. Soms kan de bank je doorverwijzen naar een budgetcoach of een jobcoach. Heb je NHG? Dan kan NHG ook meedenken.',
        'Bereid het gesprek goed voor. Zet je inkomsten en uitgaven op een rij. Vraag de bank om afspraken op papier of per e-mail te bevestigen. Heb je meer geldzorgen? Dan kun je ook hulp krijgen via je gemeente.'
      ],
      letop: [
        'Negeer brieven van de bank niet.',
        'Een achterstand kan leiden tot een BKR-registratie.',
        'Zeg verzekeringen niet zomaar op om geld te besparen. Vraag eerst advies.'
      ],
      vragen: [
        'Welke verzekeringen heb ik die nu misschien uitkeren?',
        'Kan mijn hypotheek tijdelijk worden aangepast?',
        'Wie kan mij helpen met mijn budget?'
      ],
      bronnen: [B.afmBetaalBank, B.afmAchterstand, B.nhgHulp, B.roSchulden], peildatum: P,
      kw: 'betalingsproblemen achterstand betalingsachterstand hypotheek niet betalen geldzorgen budgetcoach gemeente'
    },
    {
      id: 'werkloos-hypotheek', cat: 'Levensgebeurtenissen',
      titel: 'Werkloos worden en je hypotheek',
      kort: [
        'Verlies je je baan, dan kun je als werknemer vaak een WW-uitkering krijgen.',
        'De WW is lager dan je loon en duurt een beperkte tijd.',
        'Kijk meteen of je je woonlasten nog kunt betalen.'
      ],
      uitleg: [
        'Ben je werknemer en verlies je je baan buiten je eigen schuld? Dan kun je een WW-uitkering aanvragen bij UWV. Hoe lang je WW krijgt, hangt af van hoe lang je hebt gewerkt. De uitkering is lager dan je oude loon.',
        'Je hypotheek loopt gewoon door. Bereken daarom snel wat je per maand overhoudt. Heb je een woonlastenverzekering die ook werkloosheid dekt? Meld de werkloosheid dan op tijd bij de verzekeraar.',
        'Verwacht je dat je de hypotheek niet kunt blijven betalen? Neem dan direct contact op met je bank en je adviseur.'
      ],
      letop: [
        'Vraag WW op tijd aan. Kijk op uwv.nl wanneer.',
        'Lees de voorwaarden van je verzekering: er is vaak een wachttijd.',
        'Je buffer is er voor dit soort momenten.'
      ],
      vragen: [
        'Hoe lang kan ik mijn lasten betalen met de WW?',
        'Keert een van mijn verzekeringen uit?',
        'Wat kan ik nu al met mijn bank regelen?'
      ],
      bronnen: [B.uwvWw, B.uwvWwAanvragen, B.afmBetaalBank], peildatum: P,
      kw: 'werkloos werkloosheid ww uwv ontslag baan kwijt woonlasten'
    }
  ]);
})();
