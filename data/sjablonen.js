/* Sjablonenbibliotheek voor sjablonen.html
   Opbouw van een sjabloon:
   - id: uniek, cat: categorie-id (zie SJABLOON_CATEGORIEEN), type: 'mail', 'brief' of 'memo' (intern, niet voor de klant)
   - geenOndertekening: true laat de ondertekening weg (gebruikt bij interne memo's)
   - titel, onderwerp, tekst: {veld} = invulveld; [[...]] = controlepunt voor de adviseur (geel gemarkeerd)
   - controle: lijst met punten die de adviseur moet nalopen voor verzending
   - bronnen: officiële bronnen bij termijnen of verplichte onderdelen
   De ondertekening (groet, adviseur, kantoor) wordt door de pagina toegevoegd.
   Teksten: eigen woorden, B1-niveau. Geen rentes, premies of acties. Peildatum 2 oktober 2026. */

window.SJABLOON_CATEGORIEEN = [
  { id: 'kennismaking', naam: 'Kennismaking en opdracht' },
  { id: 'inventarisatie', naam: 'Inventarisatie en documenten' },
  { id: 'advies', naam: 'Advies en afwijkend advies' },
  { id: 'aanvraag', naam: 'Aanvraag, offerte en passeren' },
  { id: 'rente', naam: 'Rentevast en rentemiddeling' },
  { id: 'nazorg', naam: 'Nazorg' },
  { id: 'leven', naam: 'Levensgebeurtenissen' },
  { id: 'schade', naam: 'Schadeverzekeringen' },
  { id: 'klacht', naam: 'Klachten en Kifid' },
  { id: 'avg', naam: 'AVG en privacy' },
  { id: 'wwft', naam: 'Wwft en identificatie' },
  { id: 'compliance', naam: 'Compliance intern' },
  { id: 'beeindiging', naam: 'Beëindiging en overdracht' },
  { id: 'review', naam: 'Reviews en klanttevredenheid' },
  { id: 'opvolging', naam: 'Opvolging bij stilte of verzuim' }
];

/* Invulvelden. type: tekst | lang | datum | bedrag | email | url. Onbekende velden worden als tekstveld getoond. */
window.SJABLOON_VELDEN = {
  klantnaam: { label: 'Naam klant', hint: 'Bijv. mevrouw De Vries of Jan en Sanne Jansen', groep: 'klant' },
  klantemail: { label: 'E-mailadres klant', type: 'email', groep: 'klant' },
  klantadres: { label: 'Straat en huisnummer klant', groep: 'klant' },
  klantpostcode: { label: 'Postcode en plaats klant', groep: 'klant' },
  adviseur: { label: 'Jouw naam', groep: 'kantoor' },
  kantoor: { label: 'Kantoornaam', groep: 'kantoor' },
  kantoorplaats: { label: 'Vestigingsplaats kantoor', groep: 'kantoor' },
  telefoon: { label: 'Telefoonnummer kantoor', groep: 'kantoor' },
  kantooremail: { label: 'E-mailadres kantoor', type: 'email', groep: 'kantoor' },
  vandaag: { label: 'Datum van de brief', type: 'datum', vandaag: true, groep: 'kantoor' },

  datum: { label: 'Datum afspraak', type: 'datum' },
  tijd: { label: 'Tijd', hint: 'Bijv. 14.00 uur' },
  locatie: { label: 'Locatie of manier', hint: 'Bijv. op ons kantoor, bij u thuis of via video' },
  deadline: { label: 'Uiterste datum', type: 'datum' },
  bedrag: { label: 'Bedrag', type: 'bedrag' },
  advieskosten: { label: 'Advieskosten', type: 'bedrag' },
  bemiddelingskosten: { label: 'Bemiddelingskosten', type: 'bedrag' },
  uurtarief: { label: 'Uurtarief', type: 'bedrag' },
  hypotheekbedrag: { label: 'Hypotheekbedrag', type: 'bedrag' },
  dienst: { label: 'Soort dienstverlening', hint: 'Bijv. advies en bemiddeling voor een hypotheek' },
  geldverstrekker: { label: 'Geldverstrekker' },
  verzekeraar: { label: 'Verzekeraar' },
  notaris: { label: 'Notariskantoor' },
  product: { label: 'Product of polis', hint: 'Bijv. overlijdensrisicoverzekering' },
  dossiernummer: { label: 'Dossier- of leningnummer' },
  documentenlijst: { label: 'Documentenlijst', type: 'lang', hint: 'Eén document per regel' },
  adviesonderdeel: { label: 'Onderdeel waarop de klant afwijkt', type: 'lang' },
  advieskeuze: { label: 'Ons advies op dit onderdeel', type: 'lang' },
  klantkeuze: { label: 'Keuze van de klant', type: 'lang' },
  gevolgen: { label: 'Gevolgen en risico’s van de keuze', type: 'lang' },
  voorwaarden: { label: 'Voorwaarden uit de offerte', type: 'lang', hint: 'Eén voorwaarde per regel' },
  afwijzingsreden: { label: 'Reden afwijzing (zoals ontvangen)', type: 'lang' },
  vervolgstap: { label: 'Voorgestelde vervolgstap', type: 'lang' },
  einddatum: { label: 'Einddatum rentevaste periode', type: 'datum' },
  maanden: { label: 'Aantal maanden', hint: 'Bijv. 6' },
  onderwerp: { label: 'Onderwerp', hint: 'Kort onderwerp' },
  klachtdatum: { label: 'Datum ontvangst klacht', type: 'datum' },
  klachtomschrijving: { label: 'Klacht in het kort', type: 'lang' },
  behandeltermijn: { label: 'Behandeltermijn volgens klachtenregeling', hint: 'Bijv. vier weken' },
  uitstelreden: { label: 'Reden voor meer tijd', type: 'lang' },
  nieuwedatum: { label: 'Nieuwe datum standpunt', type: 'datum' },
  standpunt: { label: 'Ons standpunt en de uitleg', type: 'lang' },
  oplossing: { label: 'Aanbod of oplossing', type: 'lang' },
  verzoekdatum: { label: 'Datum ontvangst verzoek', type: 'datum' },
  gegevensoverzicht: { label: 'Welke gegevens en waarom', type: 'lang' },
  bewaargegevens: { label: 'Gegevens die we (nog) moeten bewaren en waarom', type: 'lang' },
  contactprivacy: { label: 'Contactpersoon privacy / FG', hint: 'Naam en e-mailadres' },
  lekdatum: { label: 'Datum ontdekking datalek', type: 'datum' },
  lekomschrijving: { label: 'Wat is er gebeurd', type: 'lang' },
  lekgegevens: { label: 'Welke gegevens zijn betrokken', type: 'lang' },
  lekmaatregelen: { label: 'Genomen maatregelen', type: 'lang' },
  lekadvies: { label: 'Wat de klant zelf kan doen', type: 'lang' },
  lekgevolgen: { label: 'Mogelijke gevolgen voor de klant', type: 'lang' },
  einddatumrelatie: { label: 'Datum einde dienstverlening', type: 'datum' },
  reden: { label: 'Reden', type: 'lang' },
  nieuwkantoor: { label: 'Nieuw kantoor of nieuwe adviseur' },
  reviewlink: { label: 'Link naar reviewpagina', type: 'url' },
  enquetelink: { label: 'Link naar vragenlijst', type: 'url' },
  reviewreactie: { label: 'Inhoudelijke reactie op de review', type: 'lang' },
  laatstecontact: { label: 'Datum laatste contact', type: 'datum' },
  overledene: { label: 'Naam overledene' },
  kindnaam: { label: 'Naam van het kind' },
  aantaluren: { label: 'Verwacht aantal uur', hint: 'Bijv. 8' },
  uploadkanaal: { label: 'Beveiligd uploadkanaal', hint: 'Bijv. ons klantportaal (naam en link)', groep: 'kantoor' },
  nazorgtermijn: { label: 'Wanneer volgend contact', hint: 'Bijv. een jaar' },
  gespreksduur: { label: 'Duur van het gesprek', hint: 'Bijv. een half uur' },
  contacttermijn: { label: 'Wanneer wij contact opnemen', hint: 'Bijv. twee weken' },
  klachtbehandelaar: { label: 'Behandelaar klacht (naam en functie)' },
  onderzoek: { label: 'Wat is onderzocht', type: 'lang', hint: 'Welke stukken en gesprekken je hebt bekeken' },
  contactpersoon: { label: 'Nieuwe contactpersoon' },
  verwijderdegegevens: { label: 'Welke gegevens zijn verwijderd', type: 'lang', hint: 'Bijv. uit de nieuwsbrief en het klantsysteem' },

  /* Compliance intern */
  registratienummer: { label: 'Intern registratienummer', hint: 'Bijv. DL-2026-03 of INC-2026-01' },
  melder: { label: 'Gemeld door (naam en functie)' },
  compliancefunctionaris: { label: 'Compliance officer of verantwoordelijke', hint: 'Naam en functie' },
  ontdekkingstijd: { label: 'Tijdstip ontdekking', hint: 'Bijv. 10.15 uur. De 72 uur lopen vanaf dit moment.' },
  aantalbetrokkenen: { label: 'Aantal betrokkenen (schatting)' },
  apbesluit: { label: 'Besluit over melding aan de AP en onderbouwing', type: 'lang' },
  klantbesluit: { label: 'Besluit over informeren van betrokkenen en onderbouwing', type: 'lang' },
  uiting: { label: 'Reclame-uiting (soort en kanaal)', hint: 'Bijv. Instagram-advertentie over oversluiten' },
  uitingtekst: { label: 'Tekst van de uiting', type: 'lang', hint: 'Plak de volledige tekst, inclusief kleine letters' },
  leverancier: { label: 'Leverancier (verwerker)' },
  softwaredienst: { label: 'Dienst of software', hint: 'Bijv. CRM, adviessoftware of mailingsysteem' },
  bevindingen: { label: 'Bevindingen en afspraken', type: 'lang' },
  incidentdatum: { label: 'Datum incident of ontdekking', type: 'datum' },
  incidentomschrijving: { label: 'Wat is er gebeurd', type: 'lang' },
  incidentbetrokkenen: { label: 'Wie zijn betrokken (functie, geen namen van klanten)', type: 'lang' },
  incidentmaatregelen: { label: 'Genomen en geplande maatregelen', type: 'lang' },
  afmbesluit: { label: 'Besluit over melding aan de AFM en onderbouwing', type: 'lang' },

  /* Schadeverzekeringen */
  polisnummer: { label: 'Polisnummer' },
  schadenummer: { label: 'Schadenummer verzekeraar' },
  schadedatum: { label: 'Datum schade', type: 'datum' },
  schadeomschrijving: { label: 'Schade in het kort', type: 'lang' },
  premieoud: { label: 'Huidige premie (per maand of jaar)', type: 'bedrag' },
  premienieuw: { label: 'Nieuwe premie (zelfde termijn)', type: 'bedrag' },
  premiereden: { label: 'Reden van de verzekeraar voor de stijging', type: 'lang' },
  alternatieven: { label: 'Onderzochte alternatieven', type: 'lang', hint: 'Bijv. andere verzekeraars, hoger eigen risico, minder dekking. Eén per regel.' },
  einddatumpolis: { label: 'Datum einde verzekering', type: 'datum' },
  gebeurtenis: { label: 'Levensgebeurtenis', hint: 'Bijv. verbouwing, verhuizing of gezinsuitbreiding' },
  ingangsdatum: { label: 'Ingangsdatum wijziging', type: 'datum' },
  opzegreden: { label: 'Reden opzegging verzekeraar (zoals ontvangen)', type: 'lang' },
  scanlink: { label: 'Link naar de schadeverzekeringsscan', type: 'url', hint: 'Bijv. https://jeroen-o.github.io/adviesforum/scan-schadeverzekeringen.html' },

  /* Krediet */
  kredietverstrekker: { label: 'Kredietverstrekker' }
};

window.SJABLONEN = [

/* ---------- Kennismaking en opdracht ---------- */
{
  id: 'km-bevestiging-gesprek', cat: 'kennismaking', type: 'mail',
  titel: 'Bevestiging kennismakingsgesprek',
  onderwerp: 'Bevestiging afspraak op {datum}',
  tekst: `Beste {klantnaam},

Dank voor uw belangstelling. Hierbij bevestig ik onze afspraak voor een kennismakingsgesprek op {datum} om {tijd}, {locatie}.

In dit gesprek leren we elkaar kennen. Ik vertel hoe wij werken en wat onze dienstverlening kost. U vertelt wat u wilt bereiken. Daarna beslist u of u ons de opdracht geeft. [[Vermeld of het kennismakingsgesprek kosteloos en vrijblijvend is.]]

Vooraf stuur ik u onze vergelijkingskaart. Daarin leest u wat wij voor u doen en wat dat kost. Wie wij zijn en onder welk toezicht wij werken, leest u op onze website.

Lukt de afspraak niet? Laat het mij dan even weten, dan plannen we een nieuw moment.`,
  controle: ['Klopt het of het eerste gesprek gratis en vrijblijvend is?', 'Stuur de actuele vergelijkingskaart mee.', 'Bij videobellen: stuur de link apart en veilig.']
},
{
  id: 'km-ddoc-kosten', cat: 'kennismaking', type: 'mail',
  titel: 'Vergelijkingskaart en kosten na kennismaking',
  onderwerp: 'Onze dienstverlening en kosten',
  tekst: `Beste {klantnaam},

Dank voor het prettige gesprek. Zoals afgesproken stuur ik u onze vergelijkingskaart. Daarin leest u wat wij voor u doen en hoe wij betaald worden. Wie wij zijn en onder welk toezicht wij werken, leest u op onze website.

Voor {dienst} brengen wij de volgende kosten in rekening:
- advieskosten: {advieskosten}
- bemiddelingskosten: {bemiddelingskosten}
[[Controleer of je een vast bedrag of een uurtarief rekent en of de bedragen gelijk zijn aan je vergelijkingskaart.]]

U betaalt deze kosten aan ons. Wij ontvangen geen provisie van de geldverstrekker of verzekeraar. [[Controleer: geldt voor jouw producten het provisieverbod, of ontvang je voor een deel van de producten wel provisie? Pas de zin zo nodig aan.]]

Wilt u ons de opdracht geven? Dan stuur ik u een opdrachtbevestiging om te ondertekenen. Heeft u nog vragen, bel of mail mij gerust.`,
  controle: ['Bedragen gelijk aan de vergelijkingskaart en de opdrachtbevestiging.', 'Provisie: de zin moet kloppen met jouw verdienmodel en de productsoort.', 'Is de vergelijkingskaart de nieuwste versie?']
},
{
  id: 'km-opdrachtbevestiging', cat: 'kennismaking', type: 'brief',
  titel: 'Opdrachtbevestiging advies en bemiddeling',
  onderwerp: 'Opdrachtbevestiging {dienst}',
  tekst: `Geachte {klantnaam},

U heeft ons gevraagd u te helpen met {dienst}. In deze brief leggen we vast wat we afspreken.

Wat wij doen
- We brengen uw financiële situatie, wensen en risico’s in kaart.
- We geven u een advies dat bij u past en leggen dat schriftelijk vast.
- Als u dat wilt, vragen we het product voor u aan en begeleiden we u tot het afsluiten.
[[Pas de werkzaamheden aan op de echte opdracht: alleen advies, advies en bemiddeling, of alleen bemiddeling.]]

Wat het kost
- Advieskosten: {advieskosten}
- Bemiddelingskosten: {bemiddelingskosten}
[[Vermeld wanneer de factuur komt en wat de klant betaalt als de opdracht eerder stopt.]]

Wat wij van u nodig hebben
U geeft ons op tijd juiste en volledige informatie. Verandert er iets in uw situatie, laat het ons dan direct weten.

Akkoord?
Onderteken deze brief en stuur hem terug. Daarmee geeft u ons de opdracht. Onze vergelijkingskaart en onze algemene voorwaarden horen bij deze afspraak. [[Controleer of je algemene voorwaarden gebruikt en of die vóór of bij het sluiten van de overeenkomst aan de klant zijn gegeven.]]

Datum: ____________________

Handtekening klant: ____________________`,
  controle: ['Omschrijving van de opdracht klopt met wat is afgesproken.', 'Kosten gelijk aan de vergelijkingskaart.', 'Regeling bij tussentijds stoppen staat erin.', 'Algemene voorwaarden en vergelijkingskaart meesturen.']
},
{
  id: 'km-offerte-advieskosten', cat: 'kennismaking', type: 'mail',
  titel: 'Offerte advieskosten (uurtarief)',
  onderwerp: 'Offerte voor {dienst}',
  tekst: `Beste {klantnaam},

U vroeg wat het kost als wij u helpen met {dienst}. Hieronder vindt u onze offerte.

Wij werken op basis van een uurtarief van {uurtarief}. We verwachten dat de opdracht ongeveer {aantaluren} uur kost. Dat komt neer op ongeveer {bedrag}. [[Vermeld of de bedragen inclusief of exclusief btw zijn. Advies over financiële producten is vaak vrijgesteld van btw, maar controleer dit voor jouw diensten.]]

Duurt het werk langer dan we nu denken? Dan laten we u dat eerst weten, voordat we verder gaan.

Deze offerte is geldig tot {deadline}. Wilt u ons de opdracht geven? Antwoord dan op deze e-mail. Ik stuur u daarna een opdrachtbevestiging.`,
  controle: ['Btw-behandeling van de dienst.', 'Inschatting uren realistisch en vastgelegd in het dossier.', 'Geldigheidsduur ingevuld.']
},
{
  id: 'km-factuur', cat: 'kennismaking', type: 'mail',
  titel: 'Factuur advieskosten toesturen',
  onderwerp: 'Factuur {dossiernummer}',
  tekst: `Beste {klantnaam},

Bijgaand ontvangt u de factuur voor onze werkzaamheden. Het bedrag is {bedrag}. Dit is in lijn met de opdrachtbevestiging die u heeft getekend.

Wilt u het bedrag voor {deadline} overmaken? Het rekeningnummer en het factuurnummer staan op de factuur.

Een deel van de advieskosten kan in sommige gevallen fiscaal aftrekbaar zijn. [[Controleer of dit voor deze klant geldt en verwijs bij twijfel naar een belastingadviseur of de Belastingdienst. Laat de zin anders weg.]]

Heeft u vragen over de factuur? Bel of mail mij gerust.`,
  controle: ['Factuurbedrag gelijk aan opdrachtbevestiging.', 'Zin over aftrekbaarheid alleen laten staan als die klopt.', 'Factuur als bijlage toegevoegd.']
},

/* ---------- Inventarisatie en documenten ---------- */
{
  id: 'inv-documenten-hypotheek', cat: 'inventarisatie', type: 'mail',
  titel: 'Documenten opvragen voor hypotheekadvies',
  onderwerp: 'Documenten voor uw hypotheekadvies',
  tekst: `Beste {klantnaam},

Om u goed te adviseren, heb ik een aantal documenten van u nodig. Wilt u deze voor {deadline} aanleveren?

{documentenlijst}

Stuur de documenten bij voorkeur via {uploadkanaal}. Stuur geen kopie van uw paspoort of andere gevoelige stukken via gewone e-mail.

Heeft u een document niet of weet u niet waar u het kunt vinden? Laat het mij weten, dan zoeken we samen naar een oplossing.`,
  controle: ['Lijst afgestemd op de situatie (loondienst, ondernemer, pensioen, bestaande woning).', 'Veilig uploadkanaal ingevuld.', 'Gebruik eventueel de documentenchecklist op het Adviesforum.'],
  bronnen: []
},
{
  id: 'inv-herinnering-documenten', cat: 'inventarisatie', type: 'mail',
  titel: 'Herinnering ontbrekende documenten',
  onderwerp: 'Herinnering: nog enkele documenten nodig',
  tekst: `Beste {klantnaam},

Dank voor de documenten die u al heeft gestuurd. Ik mis nog het volgende:

{documentenlijst}

Zonder deze stukken kan ik het advies niet afronden. [[Noem de concrete gevolgen, bijvoorbeeld een termijn voor financieringsvoorbehoud of de geldigheid van een offerte.]]

Wilt u ze voor {deadline} sturen? Lukt dat niet, bel mij dan even. Dan kijken we wat wel kan.`,
  controle: ['Termijnen in het koopcontract of de offerte gecontroleerd.', 'Toon blijft vriendelijk en feitelijk.']
},
{
  id: 'inv-klantprofiel-controle', cat: 'inventarisatie', type: 'mail',
  titel: 'Inventarisatie ter controle sturen',
  onderwerp: 'Uw gegevens ter controle',
  tekst: `Beste {klantnaam},

Dank voor het inventarisatiegesprek van {datum}. In de bijlage vindt u een overzicht van wat we hebben besproken: uw inkomen, uitgaven, bezittingen, schulden, wensen en hoe u tegen risico’s aankijkt.

Wilt u dit overzicht goed lezen? Mijn advies is gebaseerd op deze gegevens. Klopt er iets niet of mist er iets, laat het mij dan voor {deadline} weten.

Klopt alles? Dan hoor ik dat ook graag. Daarna ga ik aan de slag met uw advies.`,
  controle: ['Bijlage met klantprofiel toegevoegd (via beveiligde omgeving).', 'Kennis en ervaring, risicobereidheid en doelen vastgelegd.']
},
{
  id: 'inv-uitleg-werkgeversverklaring', cat: 'inventarisatie', type: 'mail',
  titel: 'Uitleg inkomensbewijs (werkgeversverklaring of inkomensverklaring)',
  onderwerp: 'Hoe u uw inkomen kunt aantonen',
  tekst: `Beste {klantnaam},

De geldverstrekker wil weten hoeveel u verdient. Dat kunt u op verschillende manieren laten zien. Welke manier past, hangt af van uw situatie en van de geldverstrekker.

- Werkgeversverklaring met een recente loonstrook: uw werkgever vult een formulier in.
- Inkomensbepaling via uw UWV-gegevens: u downloadt uw verzekeringsbericht bij het UWV en wij laten het inkomen berekenen.
- Ondernemer: meestal jaarcijfers of aangiften over de afgelopen jaren.
[[Controleer welke manieren geldverstrekker {geldverstrekker} accepteert en wat de actuele eisen zijn (bijvoorbeeld hoe oud documenten mogen zijn).]]

Ik help u graag bij de keuze. Laat mij weten welke situatie bij u past.`,
  controle: ['Acceptatie-eisen van de geldverstrekker zijn actueel.', 'Termijn voor geldigheid documenten nagekeken.']
},

/* ---------- Advies en afwijkend advies ---------- */
{
  id: 'adv-rapport', cat: 'advies', type: 'mail',
  titel: 'Adviesrapport toesturen',
  onderwerp: 'Uw adviesrapport',
  tekst: `Beste {klantnaam},

In de bijlage vindt u uw adviesrapport. Daarin leest u wat ik u adviseer en waarom. Ook staat erin welke risico’s er zijn en hoe u die kunt beperken.

Wilt u het rapport rustig lezen? Op {datum} om {tijd} bespreken we het samen. Schrijf gerust uw vragen op.

Neemt u het advies over? Dan vraag ik het product voor u aan. Kiest u op een onderdeel anders dan ik adviseer, dan leg ik dat apart met u vast.`,
  controle: ['Rapport bevat klantprofiel, advies, onderbouwing en risico’s.', 'Rapport via beveiligde omgeving verstuurd.', 'Bespreekafspraak gepland.']
},
{
  id: 'adv-afwijkend', cat: 'advies', type: 'brief',
  titel: 'Bevestiging afwijkende keuze klant (afwijkend advies)',
  onderwerp: 'Uw keuze die afwijkt van ons advies',
  tekst: `Geachte {klantnaam},

We hebben u een advies gegeven. Op één onderdeel kiest u bewust iets anders. Dat mag. Wel leggen we dit vast, zodat het voor u en voor ons duidelijk is.

Het onderdeel
{adviesonderdeel}

Wat wij u adviseren
{advieskeuze}

Wat u kiest
{klantkeuze}

Wat dit voor u kan betekenen
{gevolgen}

U heeft deze gevolgen met ons besproken. U begrijpt ze en u kiest toch voor uw eigen keuze. [[Beschrijf de gevolgen concreet, bij voorkeur met bedragen of scenario’s. Een algemene zin is niet genoeg.]]

Wilt u deze brief ondertekenen en terugsturen? Verandert uw situatie of uw mening later, neem dan contact met ons op. Dan kijken we opnieuw.

Datum: ____________________

Handtekening klant: ____________________`,
  controle: ['Gevolgen concreet en begrijpelijk beschreven.', 'Het advies zelf is passend en volledig vastgelegd in het adviesrapport.', 'Getekende brief in het dossier.', 'Zie ook de pagina Afwijkend advies op het Adviesforum.']
},
{
  id: 'adv-geen-verzekering', cat: 'advies', type: 'brief',
  titel: 'Klant ziet af van geadviseerde verzekering',
  onderwerp: 'U sluit de geadviseerde {product} niet af',
  tekst: `Geachte {klantnaam},

In ons advies raden wij u aan een {product} af te sluiten. U heeft besloten dit niet te doen. Met deze brief bevestigen wij uw keuze.

Waarom wij deze verzekering adviseren
{advieskeuze}

Wat er kan gebeuren zonder deze verzekering
{gevolgen}
[[Maak de gevolgen concreet: wat gebeurt er met de woonlasten of het inkomen bij overlijden, arbeidsongeschiktheid of werkloosheid?]]

U kunt later alsnog een verzekering afsluiten. Houd er wel rekening mee dat de verzekeraar dan opnieuw naar uw gezondheid kan kijken en dat de premie anders kan zijn.

Wilt u deze brief ondertekenen en terugsturen?

Datum: ____________________

Handtekening klant: ____________________`,
  controle: ['Risico met concrete gevolgen beschreven.', 'Getekende brief in het dossier bewaren.', 'Nazorgmoment plannen om er later op terug te komen.']
},

/* ---------- Aanvraag, offerte en passeren ---------- */
{
  id: 'aan-ingediend', cat: 'aanvraag', type: 'mail',
  titel: 'Aanvraag ingediend bij geldverstrekker',
  onderwerp: 'Uw aanvraag bij {geldverstrekker} is verstuurd',
  tekst: `Beste {klantnaam},

Goed nieuws: ik heb uw hypotheekaanvraag vandaag verstuurd naar {geldverstrekker}. Het gaat om een hypotheek van {hypotheekbedrag}.

Wat gebeurt er nu?
- De geldverstrekker beoordeelt de aanvraag.
- Daarna ontvangen we een offerte. Ik bespreek die met u.
- Vaak vraagt de geldverstrekker nog extra documenten. Ik laat het u direct weten als dat zo is.

Let op: de aanvraag is nog geen toezegging. [[Noem de datum van het financieringsvoorbehoud in het koopcontract, als dat er is.]]`,
  controle: ['Hypotheekbedrag gelijk aan de aanvraag.', 'Datum financieringsvoorbehoud gecontroleerd en genoteerd.']
},
{
  id: 'aan-offerte-ontvangen', cat: 'aanvraag', type: 'mail',
  titel: 'Offerte geldverstrekker ontvangen: tekenen',
  onderwerp: 'Uw hypotheekofferte van {geldverstrekker}',
  tekst: `Beste {klantnaam},

De offerte van {geldverstrekker} is binnen. Ik heb hem gecontroleerd en hij klopt met ons advies. [[Controleer de offerte echt: bedragen, leningdelen, rentevaste periode, looptijd, NHG en voorwaarden.]]

Wat moet u doen?
- Lees de offerte goed.
- Onderteken hem en stuur hem terug voor {deadline}. Na die datum vervalt de offerte.
- Stuur ook de documenten mee die in de offerte worden gevraagd.

Heeft u vragen over de offerte? Dan bespreek ik die graag met u voordat u tekent.`,
  controle: ['Offerte inhoudelijk vergeleken met het advies.', 'Uiterste tekendatum overgenomen uit de offerte.', 'Bedenktijd of andere voorwaarden uit de offerte genoemd waar nodig.']
},
{
  id: 'aan-voorwaarden', cat: 'aanvraag', type: 'mail',
  titel: 'Voorwaarden uit de offerte: wat er nog nodig is',
  onderwerp: 'Nog nodig voor uw hypotheek',
  tekst: `Beste {klantnaam},

De geldverstrekker {geldverstrekker} stelt in de offerte een aantal voorwaarden. Pas als aan alle voorwaarden is voldaan, kan de hypotheek bij de notaris worden afgesloten.

Dit is nog nodig:
{voorwaarden}

Wilt u deze stukken voor {deadline} aanleveren? Dan houden we genoeg tijd over tot de afspraak bij de notaris.`,
  controle: ['Voorwaarden letterlijk overgenomen uit de offerte.', 'Rekening gehouden met de doorlooptijd bij de geldverstrekker.']
},
{
  id: 'aan-afwijzing', cat: 'aanvraag', type: 'mail',
  titel: 'Afwijzing door geldverstrekker melden',
  onderwerp: 'Uw aanvraag bij {geldverstrekker}',
  tekst: `Beste {klantnaam},

Helaas heb ik minder goed nieuws. {geldverstrekker} heeft uw aanvraag afgewezen. De reden die zij geven is:

{afwijzingsreden}

Dit hoeft niet het einde te zijn. Mijn voorstel is:
{vervolgstap}

[[Let op het financieringsvoorbehoud. Moet de klant de verkoper of makelaar op tijd informeren of het voorbehoud inroepen? Wijs de klant daarop en noem de datum.]]

Ik bel u vandaag of morgen om dit samen te bespreken.`,
  controle: ['Datum financieringsvoorbehoud en eventuele inroeping besproken.', 'Afwijzingsbrief van de geldverstrekker in het dossier.', 'Reden in begrijpelijke woorden.']
},
{
  id: 'aan-notaris', cat: 'aanvraag', type: 'mail',
  titel: 'Afspraak bij de notaris (passeren)',
  onderwerp: 'Uw afspraak bij {notaris}',
  tekst: `Beste {klantnaam},

Alle voorwaarden van de geldverstrekker zijn afgerond. De afspraak bij {notaris} staat op {datum} om {tijd}.

Neem een geldig legitimatiebewijs mee. Vooraf ontvangt u van de notaris een afrekening. Daarop staat hoeveel u eventueel zelf moet bijbetalen. Maak dat bedrag op tijd over, zodat het op de dag van de afspraak bij de notaris is. [[Controleer de afrekening op bedragen en kosten. Wijken ze af van het advies, bespreek dit dan vóór het passeren.]]

Heeft u vragen over de afrekening? Laat het mij weten.`,
  controle: ['Afrekening notaris gecontroleerd.', 'Inbreng eigen geld en herkomst daarvan in het dossier.']
},
{
  id: 'aan-gefeliciteerd', cat: 'aanvraag', type: 'mail',
  titel: 'Felicitatie na het passeren',
  onderwerp: 'Gefeliciteerd met uw nieuwe woning',
  tekst: `Beste {klantnaam},

Gefeliciteerd! De hypotheek is afgesloten en de woning is van u. Ik wens u veel woonplezier.

Nog een paar tips:
- Bewaar de offerte, de hypotheekakte en de afrekening van de notaris goed.
- Geef de hypotheek door bij uw aangifte inkomstenbelasting. [[Controleer of de klant een voorlopige aanslag kan aanvragen of wijzigen, en verwijs naar de Belastingdienst.]]
- Verandert er iets in uw leven, zoals werk, gezin of gezondheid? Laat het mij weten. Misschien moet er dan iets aan uw hypotheek of verzekeringen veranderen.

Ik neem over {nazorgtermijn} weer contact met u op om te kijken of alles nog goed past.`,
  controle: ['Nazorgafspraak vastgelegd volgens je vergelijkingskaart en opdrachtbevestiging.', 'Fiscale tip klopt voor deze klant.']
},

/* ---------- Rentevast en rentemiddeling ---------- */
{
  id: 'rente-afloop-aankondiging', cat: 'rente', type: 'mail',
  titel: 'Rentevaste periode loopt af',
  onderwerp: 'Uw rentevaste periode loopt af op {einddatum}',
  tekst: `Beste {klantnaam},

Op {einddatum} loopt de rentevaste periode af van (een deel van) uw hypotheek bij {geldverstrekker}. Daarna krijgt u een nieuwe rente. Dat kan grote invloed hebben op uw maandlasten.

Meestal stuurt de geldverstrekker een paar maanden van tevoren een voorstel. U kunt dan kiezen uit verschillende rentevaste periodes. Soms is het slim om ook te kijken naar oversluiten naar een andere geldverstrekker.

Ik help u graag met deze keuze. We kijken dan samen naar:
- hoe lang u de rente vast wilt zetten;
- of uw situatie is veranderd;
- of u extra wilt aflossen;
- of oversluiten zinvol is, inclusief de kosten.

Zal ik een afspraak met u inplannen? [[Vermeld of dit gesprek binnen je abonnement of nazorg valt, of wat het kost.]]`,
  controle: ['Einddatum gecontroleerd per leningdeel.', 'Kosten van het gesprek duidelijk.']
},
{
  id: 'rente-voorstel-keuze', cat: 'rente', type: 'mail',
  titel: 'Renteverlengingsvoorstel ontvangen: keuze maken',
  onderwerp: 'Kies voor {deadline} een nieuwe rentevaste periode',
  tekst: `Beste {klantnaam},

U heeft van {geldverstrekker} een voorstel ontvangen voor een nieuwe rentevaste periode. U moet uw keuze voor {deadline} doorgeven. Kiest u niet op tijd, dan kiest de geldverstrekker vaak zelf een periode. [[Controleer in het voorstel wat de geldverstrekker doet als de klant niet kiest.]]

Wat ik u adviseer om te doen:
- Stuur mij het voorstel, dan bekijken we het samen.
- Denk na over hoe zeker u wilt zijn van uw maandlasten.
- Vergelijk de aangeboden rente met andere geldverstrekkers.

Wilt u dat ik u help? Laat het mij voor {deadline} weten, dan hebben we genoeg tijd.`,
  controle: ['Keuzetermijn uit het voorstel overgenomen.', 'Standaardkeuze van de geldverstrekker gecontroleerd.']
},
{
  id: 'rente-middeling', cat: 'rente', type: 'mail',
  titel: 'Rentemiddeling: mogelijkheden onderzoeken',
  onderwerp: 'Kan rentemiddeling iets voor u betekenen?',
  tekst: `Beste {klantnaam},

U betaalt nu een rente die vaststaat tot {einddatum}. Bij rentemiddeling stopt u eerder met deze rentevaste periode. U kiest een nieuwe periode. De vergoeding voor het eerder stoppen wordt dan niet in één keer betaald, maar verwerkt in de nieuwe rente.

Rentemiddeling is niet altijd voordelig. Het hangt af van:
- het verschil tussen uw rente en de rente van nu;
- hoe lang uw rente nog vaststaat;
- de opslag die de geldverstrekker rekent;
- of u later wilt verhuizen of extra wilt aflossen.

Ik kan voor u berekenen of het iets oplevert. Daarvoor heb ik een recent overzicht van uw hypotheek nodig. [[Controleer of {geldverstrekker} rentemiddeling aanbiedt en onder welke voorwaarden.]]`,
  controle: ['Rentemiddeling mogelijk bij deze geldverstrekker.', 'Geen voordeel beloven zonder berekening.', 'Zie de rekenhulp Rentemiddeling op het Adviesforum.']
},

/* ---------- Nazorg ---------- */
{
  id: 'nz-jaarlijks', cat: 'nazorg', type: 'mail',
  titel: 'Uitnodiging jaarlijkse check',
  onderwerp: 'Tijd voor uw jaarlijkse financiële check',
  tekst: `Beste {klantnaam},

Het is alweer een tijd geleden dat we elkaar spraken. Daarom nodig ik u uit voor een korte check. We kijken of uw hypotheek en verzekeringen nog passen bij uw situatie.

Denk bijvoorbeeld aan:
- veranderingen in werk of inkomen;
- gezinsuitbreiding, samenwonen of uit elkaar gaan;
- plannen om te verbouwen of te verhuizen;
- uw wensen voor later, zoals eerder stoppen met werken.

Het gesprek duurt ongeveer {gespreksduur} en kan ook via video. [[Vermeld of dit binnen het nazorgabonnement valt.]]

Wanneer komt het u uit? Kies een moment door te reageren op deze e-mail.`,
  controle: ['Nazorgafspraken uit de vergelijkingskaart en opdrachtbevestiging nagekomen.', 'Kosten vermeld.']
},
{
  id: 'nz-aflossingsvrij', cat: 'nazorg', type: 'brief',
  titel: 'Aflossingsvrij deel: vooruitkijken',
  onderwerp: 'Uw aflossingsvrije hypotheek: wat gebeurt er later?',
  tekst: `Geachte {klantnaam},

Een deel van uw hypotheek bij {geldverstrekker} is aflossingsvrij. Op dat deel betaalt u alleen rente. De schuld wordt dus niet kleiner. Aan het einde van de looptijd moet u dit deel in één keer terugbetalen of opnieuw financieren.

Waarom is dit belangrijk?
- Het is niet zeker dat u later opnieuw kunt financieren, bijvoorbeeld als uw inkomen daalt na uw pensioen.
- Als de waarde van uw woning daalt, kan een restschuld ontstaan bij verkoop.

Wat kunt u doen?
- In kaart brengen hoe hoog de schuld bij pensioen of einde looptijd nog is.
- Kijken of extra aflossen of sparen mogelijk is.
- Bekijken of u de lasten na uw pensioen kunt blijven betalen.

Ik nodig u graag uit voor een gesprek hierover. [[Controleer de einddatum van het aflossingsvrije deel en of de geldverstrekker de klant zelf al heeft benaderd.]]`,
  controle: ['Einddatum en hoogte aflossingsvrij deel gecontroleerd.', 'Zie de scan Aflossingsvrij op het Adviesforum.']
},
{
  id: 'nz-orv-aov', cat: 'nazorg', type: 'mail',
  titel: 'Check overlijdensrisico- en arbeidsongeschiktheidsdekking',
  onderwerp: 'Kunt u de woonlasten blijven betalen als er iets gebeurt?',
  tekst: `Beste {klantnaam},

Uw hypotheek en uw verzekeringen horen bij elkaar. Verandert er iets, dan klopt de dekking misschien niet meer. Daarom kijk ik graag samen met u naar twee vragen:

- Als u of uw partner overlijdt, kan de achterblijver dan in het huis blijven wonen?
- Als u langere tijd niet kunt werken door ziekte, hoeveel inkomen houdt u dan nog over?

Het antwoord hangt af van uw werk, uw pensioenregeling, uw gezin en uw verzekeringen. Is uw situatie veranderd sinds het advies? Bijvoorbeeld een nieuwe baan, een eigen bedrijf, kinderen of een hogere hypotheek? Dan is een check extra belangrijk.

Zullen we een afspraak maken?`,
  controle: ['Actuele polissen en pensioenoverzicht opvragen.', 'Zie de rekenhulpen ORV en AOV-tekort op het Adviesforum.']
},
{
  id: 'nz-pensioen-aow', cat: 'nazorg', type: 'mail',
  titel: 'Pensioen en AOW-gat in beeld',
  onderwerp: 'Weet u hoeveel inkomen u heeft na uw pensioen?',
  tekst: `Beste {klantnaam},

Na uw pensioen daalt uw inkomen vaak. Uw woonlasten blijven soms gelijk. Daarom is het goed om op tijd te weten hoeveel inkomen u later heeft.

Twee dingen zijn belangrijk:
- Wanneer krijgt u AOW? Dat hangt af van uw geboortedatum. U kunt uw AOW-leeftijd opzoeken op svb.nl. Voor mensen die op of na 1 oktober 1964 zijn geboren, staat die leeftijd nog niet vast.
- Hoeveel pensioen bouwt u op? Op mijnpensioenoverzicht.nl ziet u uw opgebouwde pensioen en AOW samen.

Stopt u eerder met werken dan uw AOW-leeftijd? Dan heeft u een tijd geen AOW. Dat noemen we het AOW-gat. Daar kunt u nu al rekening mee houden.

Wilt u dat ik met u meekijk? Stuur mij dan een download van uw pensioenoverzicht, via {uploadkanaal}.`,
  controle: ['AOW-leeftijd voor deze klant opgezocht op svb.nl.', 'Pensioenoverzicht via beveiligd kanaal ontvangen.', 'Zie de scan Pensioen op het Adviesforum.'],
  bronnen: [
    { t: 'SVB: uw AOW-leeftijd', u: 'https://www.svb.nl/nl/aow/aow-leeftijd/uw-aow-leeftijd' },
    { t: 'Rijksoverheid: AOW-leeftijd', u: 'https://www.rijksoverheid.nl/themas/belastingen-uitkeringen-en-toeslagen/algemene-ouderdomswet-aow/aow-leeftijd' }
  ]
},
{
  id: 'nz-wijziging-doorgeven', cat: 'nazorg', type: 'mail',
  titel: 'Herinnering: wijzigingen doorgeven',
  onderwerp: 'Is er iets veranderd in uw situatie?',
  tekst: `Beste {klantnaam},

Uw verzekeringen en hypotheek zijn afgestemd op uw situatie van toen. Verandert er iets, dan klopt de dekking misschien niet meer.

Geef het aan ons door als:
- u gaat verhuizen of verbouwen;
- u gaat samenwonen, trouwen of uit elkaar gaat;
- u van baan wisselt of voor uzelf begint;
- u een nieuwe auto of dure spullen koopt;
- uw gezin groter of kleiner wordt.

Soms moet u een wijziging binnen een bepaalde tijd aan de verzekeraar melden. [[Controleer of de polisvoorwaarden een meldtermijn noemen en noem die eventueel.]]

U kunt wijzigingen doorgeven via {kantooremail} of {telefoon}.`,
  controle: ['Meldtermijnen in polisvoorwaarden gecontroleerd.', 'Zie het formulier Wijziging doorgeven op het Adviesforum.']
},

{
  id: 'nz-krediet-herbeoordeling', cat: 'nazorg', type: 'mail',
  titel: 'Doorlopend krediet: uitnodiging herbeoordeling',
  onderwerp: 'Past uw doorlopend krediet nog bij u?',
  tekst: `Beste {klantnaam},

U heeft een doorlopend krediet bij {kredietverstrekker}. Zo’n krediet loopt vaak lang door. Uw situatie verandert in die tijd wel. Daarom nodig ik u uit om samen te kijken of het krediet nog goed bij u past.

Waar kijken we naar?
- Lost u echt af, of betaalt u vooral rente? Als de schuld bijna niet daalt, wordt lenen duur.
- Heeft u de kredietruimte nog nodig? Een lagere limiet kan uw risico kleiner maken.
- Kunt u de maandtermijn goed blijven betalen, ook als uw inkomen daalt of u met pensioen gaat?
- Gaat de limiet bij uw krediet op een bepaalde leeftijd omlaag? Bij sommige oudere kredieten stijgt dan uw maandbedrag. [[Controleer in de kredietovereenkomst of er een afbouwregeling of leeftijdsgrens is en noem die concreet.]]
- Is aflossen in één keer of overstappen naar een lening met een vaste looptijd beter voor u?

Aan deze herbeoordeling zijn voor u geen kosten verbonden. [[Controleer dit: de AFM geeft aan dat voor een herbeoordeling van een doorlopend krediet geen kosten in rekening mogen worden gebracht.]]

Neemt u voor het gesprek een recent overzicht van uw krediet mee? Daarop staan het openstaande bedrag en de maandtermijn. Laat mij weten wanneer het u uitkomt.`,
  controle: ['Geen kosten rekenen voor de herbeoordeling.', 'Geen nieuw of hoger krediet aanbieden in deze uitnodiging; het doel is toetsen, niet verkopen.', 'Gegevens over inkomen en lasten actueel opvragen; leg de uitkomst vast in het dossier.', 'Bij een advies om over te sluiten: een nieuwe kredietwaardigheidstoets en de kredietwaarschuwing in eventuele reclame.'],
  bronnen: [
    { t: 'AFM: los ik af op mijn doorlopend krediet?', u: 'https://www.afm.nl/nl-nl/consumenten/veelgestelde-vragen/lenen/aflossen' },
    { t: 'AFM: weet of de lening echt wordt afgelost', u: 'https://www.afm.nl/nl-nl/consumenten/themas/lenen/aflossen' }
  ]
},

/* ---------- Levensgebeurtenissen ---------- */
{
  id: 'lv-scheiding', cat: 'leven', type: 'mail',
  titel: 'Scheiding of uit elkaar gaan',
  onderwerp: 'Uw hypotheek en verzekeringen bij een scheiding',
  tekst: `Beste {klantnaam},

U liet weten dat u en uw partner uit elkaar gaan. Dat is een ingrijpende tijd. Ik help u graag met de financiële kant van uw woning en verzekeringen.

Belangrijke vragen zijn:
- Wil een van u in de woning blijven wonen? Kan die persoon de hypotheek dan alleen betalen?
- Moet de ander uit de hypotheek worden ontslagen? Dat moet de geldverstrekker goedkeuren.
- Wat gebeurt er met de overlijdensrisicoverzekering en andere polissen?
- Wat betekent de scheiding voor uw pensioen?

Neem geen besluiten over de woning voordat u weet wat financieel mogelijk is. [[Benadruk dat je geen juridisch advies geeft. Verwijs voor de verdeling naar een mediator, advocaat of notaris. Controleer bij NHG-leningen of er bijzondere regels gelden.]]

Wilt u een gesprek? Dat kan met u alleen of met u beiden.`,
  controle: ['Bij wie ligt de opdracht: één of beide partners? Let op privacy en belangenconflict.', 'Geen juridisch advies, wel doorverwijzen.']
},
{
  id: 'lv-overlijden', cat: 'leven', type: 'brief',
  titel: 'Condoleance en eerste stappen na overlijden',
  onderwerp: 'Met deelneming',
  tekst: `Geachte {klantnaam},

Met verdriet hoorden wij van het overlijden van {overledene}. Wij wensen u veel sterkte in deze moeilijke tijd.

U hoeft nu niet alles tegelijk te regelen. Wel willen wij u helpen met de zaken die via ons kantoor lopen. Wij kunnen:
- de verzekeraars en de geldverstrekker op de hoogte brengen;
- nagaan of er een uitkering is uit een overlijdensrisicoverzekering of andere polis;
- kijken wat er verandert aan uw hypotheek en woonlasten.

Wij hebben daarvoor meestal een kopie van de akte van overlijden nodig. [[Controleer per verzekeraar welke stukken nodig zijn en of er een meldtermijn in de polis staat.]]

Neem contact met ons op wanneer het u schikt. Wij nemen ook zelf over {contacttermijn} contact met u op.`,
  controle: ['Toon: rustig, geen haast. Telefonisch contact is vaak beter dan alleen een brief.', 'Meldtermijnen polissen gecontroleerd.', 'Aan wie mag je informatie geven? Controleer wie de nabestaande of executeur is.']
},
{
  id: 'lv-geboorte', cat: 'leven', type: 'mail',
  titel: 'Felicitatie geboorte en check',
  onderwerp: 'Gefeliciteerd met de geboorte van {kindnaam}',
  tekst: `Beste {klantnaam},

Van harte gefeliciteerd met de geboorte van {kindnaam}! Wat een mooi nieuws.

Met een nieuw gezinslid verandert er vaak ook iets in uw financiën. Misschien is het goed om te kijken naar:
- uw overlijdensrisicoverzekering: is de dekking nog genoeg?
- het nabestaandenpensioen van uw werkgever;
- uw testament en wie voor uw kind zorgt als u er niet meer bent (via de notaris);
- uw inkomen als u minder gaat werken.

Geen haast. Als u er klaar voor bent, plan ik graag een gesprek in.`,
  controle: ['Toon past bij de klant.', 'Geen product pushen; alleen aanbod voor een check.']
},
{
  id: 'lv-baanverlies', cat: 'leven', type: 'mail',
  titel: 'Baanverlies of inkomensdaling',
  onderwerp: 'Uw woonlasten bij baanverlies',
  tekst: `Beste {klantnaam},

U liet weten dat u uw baan kwijtraakt of minder gaat verdienen. Dat is vervelend nieuws. Ik denk graag met u mee over uw woonlasten.

Wat kunt u nu doen?
- Vraag op tijd een WW-uitkering aan bij het UWV, als u daar recht op heeft.
- Kijk of u een woonlastenverzekering heeft die nu kan uitkeren. Let op de meldtermijn.
- Neem op tijd contact op met uw geldverstrekker als u de maandlasten niet meer kunt betalen. Wacht niet tot er betalingsachterstanden zijn.

Samen kunnen we kijken naar uw budget, uw verzekeringen en mogelijkheden bij de geldverstrekker. [[Controleer bij een NHG-lening de regels voor betalingsproblemen op nhg.nl. Verwijs bij ernstige schulden naar gemeentelijke schuldhulp.]]

Bel mij gerust, dan plannen we snel een gesprek.`,
  controle: ['Polissen met werkloosheidsdekking en meldtermijnen gecontroleerd.', 'Zie de rekenhulp Werkloosheid op het Adviesforum.'],
  bronnen: [
    { t: 'UWV: WW-uitkering', u: 'https://www.uwv.nl/nl/ww' },
    { t: 'NHG: betalingsproblemen', u: 'https://www.nhg.nl/' }
  ]
},

{
  id: 'lv-betalingsproblemen', cat: 'leven', type: 'mail',
  titel: 'Betalingsproblemen: doorverwijzen naar schuldhulp',
  onderwerp: 'Hulp bij uw betalingen',
  tekst: `Beste {klantnaam},

Dank dat u mij vertelde dat het betalen even niet lukt. Dat is niet makkelijk om te zeggen. Het is goed dat u het nu aankaart. Hoe eerder u hulp zoekt, hoe meer er vaak nog mogelijk is.

U staat hier niet alleen in. Veel mensen krijgen een keer te maken met geldzorgen, bijvoorbeeld door ziekte, een scheiding of minder werk.

Wat kunt u nu doen?
- Neem contact op met {kredietverstrekker} of andere schuldeisers voordat er een achterstand ontstaat of oploopt. Vaak is er meer mogelijk als u dat op tijd doet, zoals een tijdelijke betalingsregeling. [[Pas aan: noem de geldverstrekker of verzekeraar waar het om gaat. Bij een hypotheek met NHG: verwijs ook naar de regels op nhg.nl.]]
- Vraag gratis hulp bij uw gemeente. Elke gemeente moet inwoners met schulden helpen of doorverwijzen naar de juiste hulp.
- Wilt u eerst anoniem advies? Bel Geldfit op 0800-8115 of kijk op www.geldfit.nl. Dat is gratis.
- Krijgt u een brief over afsluiten van gas, water of licht of over uitzetting? Neem dan meteen contact op met de gemeente. In zo’n spoedsituatie moet de gemeente snel helpen.

Wat kan ik voor u doen?
Ik kijk graag met u naar uw verzekeringen en vaste lasten. Misschien loopt er een verzekering die nu kan uitkeren, of kunnen lasten omlaag. [[Controleer of de klant een woonlasten- of betalingsbeschermer heeft en wat de meldtermijn is. Adviseer niet om verzekeringen zomaar op te zeggen zonder de gevolgen te bespreken.]]

Wilt u dat ik meebel of meedenk? Laat het mij weten. Alles wat u mij vertelt, blijft tussen ons.`,
  controle: ['Toon: rustig en zonder oordeel. Liever eerst bellen, deze mail als bevestiging.', 'Geen nieuw krediet adviseren om bestaande schulden af te lossen zonder volledige toets.', 'Telefoonnummer en site van Geldfit gecontroleerd op de dag van verzenden.', 'Gesprek en doorverwijzing kort vastleggen in het dossier, zonder meer gevoelige details dan nodig.'],
  bronnen: [
    { t: 'Rijksoverheid: hoe kom ik van beginnende geldzorgen of schulden af?', u: 'https://www.rijksoverheid.nl/onderwerpen/schulden/vraag-en-antwoord/hoe-kom-ik-van-mijn-schulden-af' },
    { t: 'Rijksoverheid: waar moet ik schuldhulpverlening aanvragen?', u: 'https://www.rijksoverheid.nl/onderwerpen/schulden/vraag-en-antwoord/schuldhulpverlening-aanvragen' },
    { t: 'Nibud: hulp en ondersteuning bij schulden', u: 'https://www.nibud.nl/onderwerpen/geldproblemen/hulp-bij-schulden/' }
  ]
},

/* ---------- Schadeverzekeringen ---------- */
{
  id: 'sch-melding-begeleiden', cat: 'schade', type: 'mail',
  titel: 'Schademelding begeleiden: stappen en stukken',
  onderwerp: 'Uw schade van {schadedatum}: zo gaan we verder',
  tekst: `Beste {klantnaam},

Vervelend dat u schade heeft. Ik help u graag met de melding bij {verzekeraar}. Hieronder leest u wat u nu kunt doen en wat ik van u nodig heb.

Wat doet u nu?
- Beperk de schade waar dat veilig kan. Denk aan het afdekken van een lekkend dak of het afsluiten van water. Bewaar bonnen van die kosten.
- Gooi beschadigde spullen nog niet weg. De verzekeraar wil ze misschien zien.
- Laat nog geen grote reparaties uitvoeren voordat de verzekeraar akkoord is, tenzij het echt niet kan wachten.
- Bij diefstal, inbraak of vandalisme: doe aangifte bij de politie.

Wat heb ik van u nodig?
{documentenlijst}
[[Pas de lijst aan op de schade. Denk aan: foto’s van de schade, een omschrijving van wat er gebeurd is, aankoopbonnen of bankafschriften, een reparatieofferte, het proces-verbaal of aangiftenummer en bij aansprakelijkheid de gegevens van de tegenpartij.]]

Stuur de stukken bij voorkeur via {uploadkanaal}. Ik zorg dat de melding compleet bij de verzekeraar komt.

Wat gebeurt er daarna?
De verzekeraar beoordeelt de schade. Soms komt er een schade-expert langs. Ik houd u op de hoogte en kijk mee als de verzekeraar een voorstel doet.

Meld de schade zo snel mogelijk. Wacht niet tot u alle stukken heeft. [[Controleer in de polisvoorwaarden of er een meldtermijn geldt en noem die.]]`,
  controle: ['Polisnummer en dekking voor deze schade vooraf gecontroleerd; beloof geen vergoeding.', 'Meldtermijn uit de polisvoorwaarden gecontroleerd.', 'Bij twijfel over dekking: zeg dat de verzekeraar beslist, en dat je meekijkt.', 'Schademelding en datum vastleggen in het dossier.']
},
{
  id: 'sch-doorgezet', cat: 'schade', type: 'mail',
  titel: 'Schade doorgezet naar de verzekeraar',
  onderwerp: 'Uw schademelding is doorgestuurd naar {verzekeraar}',
  tekst: `Beste {klantnaam},

Ik heb uw schade van {schadedatum} vandaag doorgegeven aan {verzekeraar}.

Wat hebben we gemeld?
{schadeomschrijving}

Polisnummer: {polisnummer}
Schadenummer: {schadenummer}
Noem dit schadenummer als u zelf contact heeft met de verzekeraar of een expert.

Wat gebeurt er nu?
- De verzekeraar beoordeelt de melding. [[Noem, als je die weet, de gebruikelijke behandeltijd of de volgende stap, zoals een bezoek van een expert.]]
- Vraagt de verzekeraar om meer informatie? Dan laat ik het u weten.
- Krijgt u zelf post of een telefoontje van de verzekeraar of een expert? Laat het mij weten, dan blijf ik goed op de hoogte.

Het besluit over vergoeding ligt bij de verzekeraar. Ik kijk mee of het besluit klopt met uw polis. Bent u het er niet mee eens, dan bespreken we samen wat u kunt doen.`,
  controle: ['Schadenummer en polisnummer overgenomen uit de bevestiging van de verzekeraar.', 'Omschrijving gelijk aan wat aan de verzekeraar is gemeld.', 'Opvolgmoment in je agenda gezet.']
},
{
  id: 'sch-premiestijging', cat: 'schade', type: 'mail',
  titel: 'Premiestijging of indexatie toelichten, met alternatieven',
  onderwerp: 'De premie van uw {product} gaat omhoog',
  tekst: `Beste {klantnaam},

{verzekeraar} heeft laten weten dat de premie van uw {product} per {ingangsdatum} verandert. U betaalt nu {premieoud}. Daarna wordt dat {premienieuw}.

Waarom stijgt de premie?
{premiereden}
[[Gebruik de uitleg van de verzekeraar. Gaat het om indexatie van de verzekerde som (bijv. herbouwwaarde) of om een hogere premie per verzekerd bedrag? Leg uit welk van beide.]]

Wat hebben wij voor u onderzocht?
{alternatieven}
[[Bij een forse stijging is alleen de nieuwe premie doorsturen niet genoeg. Vergelijk meerdere verzekeraars of varianten, kijk naar eigen risico en dekking, en leg uit welke keuze bij de klant past en waarom. Leg dit vast in het dossier.]]

Wat kunt u doen?
- U accepteert de nieuwe premie. U hoeft dan niets te doen.
- U kiest voor een van de alternatieven hierboven. Ik regel de overstap, zodat u niet onverzekerd bent.
- U kunt de verzekering op de verlengingsdatum opzeggen. Na het eerste verzekeringsjaar kunt u een schadeverzekering meestal elke dag opzeggen met een opzegtermijn van maximaal een maand. [[Controleer de opzegregels in de polisvoorwaarden.]]

Zeg de verzekering niet op voordat de nieuwe verzekering is geaccepteerd. Anders loopt u het risico dat u een tijd niet verzekerd bent.

Wilt u dat ik een van de alternatieven voor u aanvraag? Of wilt u het eerst bespreken? Laat het mij weten.`,
  controle: ['Hoogte en ingangsdatum van de nieuwe premie gecontroleerd in de brief van de verzekeraar.', 'Bij een forse stijging: echte alternatieven onderzocht en vastgelegd (meer dan één offerte, ook passendheid van de dekking).', 'Geen overstap adviseren waarbij dekking verloren gaat zonder dat dit uitgelegd is.', 'Let op de mededelingsplicht bij een nieuwe aanvraag.'],
  bronnen: [
    { t: 'Kifid: nieuwe verzekeringspolis met (veel) hogere premie', u: 'https://www.kifid.nl/kifid-kennis-en-uitspraken/kifid-kennis/nieuwe-verzekeringspolis-met-veel-hogere-premie/' },
    { t: 'AFM: wat is de opzegtermijn van mijn schadeverzekering?', u: 'https://www.afm.nl/nl-nl/consumenten/veelgestelde-vragen/verzekeringen/opzegtermijn-schadeverzekering' }
  ]
},
{
  id: 'sch-opzeggen-klant', cat: 'schade', type: 'mail',
  titel: 'Polis opzeggen op verzoek van de klant',
  onderwerp: 'Opzegging van uw {product}',
  tekst: `Beste {klantnaam},

U heeft gevraagd uw {product} bij {verzekeraar} op te zeggen (polisnummer {polisnummer}). Dat regel ik graag voor u.

Wanneer stopt de verzekering?
Na het eerste verzekeringsjaar kunt u een schadeverzekering meestal elke dag opzeggen. Er geldt dan een opzegtermijn van maximaal een maand. De verzekering stopt naar verwachting op {einddatumpolis}. [[Controleer de opzegtermijn en de einddatum in de polisvoorwaarden. Valt de opzegging in het eerste jaar of is er een langere contractduur afgesproken, pas de tekst dan aan.]]

Let op: vanaf die datum bent u niet meer verzekerd
Gebeurt er na {einddatumpolis} iets, dan vergoedt deze verzekering de schade niet meer. [[Is dit een verplichte verzekering (zoals WA voor een motorrijtuig) of een verzekering die de geldverstrekker eist (zoals een opstalverzekering bij een hypotheek)? Wijs daar expliciet op.]]

Heeft u al een nieuwe verzekering? Zorg dat die ingaat op of vóór {einddatumpolis}, zodat er geen periode zonder dekking is.

Te veel betaalde premie krijgt u meestal terug van de verzekeraar. Ik stuur u een bevestiging zodra de verzekeraar de opzegging heeft verwerkt.

Wilt u dat ik de opzegging toch niet doorzet? Laat het mij dan voor {deadline} weten.`,
  controle: ['Schriftelijk opzegverzoek van de klant in het dossier.', 'Verplichte of door de geldverstrekker geëiste verzekering? Klant gewaarschuwd en gevolgen vastgelegd.', 'Royementsbevestiging van de verzekeraar doorsturen naar de klant.', 'Opzegging om over te stappen? Eerst acceptatie van de nieuwe polis afwachten.'],
  bronnen: [
    { t: 'AFM: wat is de opzegtermijn van mijn schadeverzekering?', u: 'https://www.afm.nl/nl-nl/consumenten/veelgestelde-vragen/verzekeringen/opzegtermijn-schadeverzekering' }
  ]
},
{
  id: 'sch-dekking-levensgebeurtenis', cat: 'schade', type: 'mail',
  titel: 'Dekking aanpassen na verbouwing, verhuizing of gezinsuitbreiding',
  onderwerp: 'Uw verzekeringen na uw {gebeurtenis}',
  tekst: `Beste {klantnaam},

U liet weten dat er iets verandert: {gebeurtenis}. Gefeliciteerd, of veel succes ermee! Zo’n verandering heeft vaak gevolgen voor uw schadeverzekeringen. Daarom zet ik de belangrijkste punten op een rij.

Verbouwing
- Na een verbouwing is uw woning vaak meer waard om te herbouwen. Dan kan uw opstalverzekering te laag zijn.
- Tijdens de verbouwing gelden soms andere regels, bijvoorbeeld als de woning leeg staat.

Verhuizing
- Uw inboedel- en opstalverzekering horen bij uw adres. Geef uw nieuwe adres en de verhuisdatum op tijd door.
- De premie en dekking kunnen anders worden door de nieuwe woning of de postcode.
- Kijk of u tijdens de verhuizing zelf verzekerd bent, bijvoorbeeld voor schade bij het transport.

Gezinsuitbreiding of samenwonen
- Zijn alle gezinsleden meeverzekerd op uw aansprakelijkheidsverzekering? Kies zo nodig een gezinsdekking.
- Uw inboedel wordt vaak meer waard.
- Kijk ook naar uw overlijdensrisicoverzekering en andere inkomensverzekeringen.
[[Laat de onderdelen staan die passen bij de situatie van deze klant en verwijder de rest.]]

Wat heb ik van u nodig?
De datum waarop de verandering ingaat ({ingangsdatum}) en, bij een verbouwing, wat er precies is veranderd en wat het heeft gekost. [[Controleer in de polisvoorwaarden of er een meldtermijn geldt voor deze wijziging.]]

Ik geef de wijziging door en laat u weten wat het betekent voor uw premie en dekking.`,
  controle: ['Meldtermijnen uit de polisvoorwaarden gecontroleerd.', 'Herbouwwaarde en inboedelwaarde opnieuw vastgesteld waar nodig (zie sjabloon Onderverzekering signaleren).', 'Wijziging door de verzekeraar bevestigd en doorgestuurd aan de klant.']
},
{
  id: 'sch-jaarlijkse-check', cat: 'schade', type: 'mail',
  titel: 'Uitnodiging jaarlijkse schadecheck',
  onderwerp: 'Kloppen uw schadeverzekeringen nog?',
  tekst: `Beste {klantnaam},

Uw schadeverzekeringen zijn afgestemd op uw situatie op het moment dat u ze afsloot. In de tussentijd kan er veel veranderd zijn. Daarom nodig ik u uit voor een jaarlijkse schadecheck.

We kijken onder meer naar:
- uw woning: is de herbouwwaarde nog goed verzekerd, ook na een verbouwing?
- uw inboedel: past het verzekerde bedrag nog bij wat u bezit?
- dure spullen, zoals sieraden, fietsen of apparatuur;
- uw aansprakelijkheidsverzekering: zijn alle gezinsleden meeverzekerd?
- dubbele verzekeringen, waarvoor u onnodig betaalt.

Wilt u zich alvast voorbereiden? Vul dan de schadeverzekeringsscan in:
{scanlink}
De scan helpt u om op een rij te zetten wat u heeft en wat er veranderd is. Neem de uitkomst mee naar ons gesprek. [[Controleer of de link werkt en vermeld of de klant de uitkomst moet meesturen of alleen meenemen. Laat de klant gevoelige gegevens niet via gewone e-mail sturen.]]

Het gesprek duurt ongeveer {gespreksduur}. [[Vermeld of de check binnen het nazorgabonnement valt, of wat het kost.]]

Wanneer komt het u uit? Reageer op deze e-mail, dan plannen we een moment.`,
  controle: ['Actuele polissen van de klant bij de hand.', 'Kosten van de check duidelijk.', 'Uitkomst en eventuele wijzigingen vastleggen in het dossier.']
},
{
  id: 'sch-onderverzekering', cat: 'schade', type: 'mail',
  titel: 'Onderverzekering signaleren: herbouwwaarde en inboedel',
  onderwerp: 'Is uw woning of inboedel hoog genoeg verzekerd?',
  tekst: `Beste {klantnaam},

Bij het nalopen van uw verzekeringen bij {verzekeraar} zag ik iets waar ik u op wil wijzen. Het kan zijn dat uw woning of inboedel te laag verzekerd is.

Waarom is dat belangrijk?
Is het verzekerde bedrag lager dan de werkelijke waarde, dan heet dat onderverzekering. De verzekeraar kan bij schade dan minder vergoeden, naar verhouding van het te lage bedrag. Dat geldt ook bij een kleine schade. [[Controleer of de polis een garantie tegen onderverzekering heeft (bijv. na een waardemeter of taxatie) en onder welke voorwaarden. Pas de tekst daarop aan.]]

Wat zie ik?
{bevindingen}

Wat stel ik voor?
- Herbouwwaarde van de woning opnieuw vaststellen, met een herbouwwaardemeter van de verzekeraar of een taxatie. Let op: herbouwwaarde is wat het kost om de woning opnieuw te bouwen, dat is niet hetzelfde als de WOZ-waarde of de verkoopwaarde.
- Inboedelwaarde opnieuw bepalen, met een inboedelwaardemeter. Denk ook aan verbouwingen door huurders en aan dure spullen.
- Daarna de verzekerde bedragen aanpassen.

Wilt u dat ik u daarbij help? Dan plannen we een korte afspraak of ik stuur u de waardemeter toe. Een hoger verzekerd bedrag kan leiden tot een hogere premie. Dat bespreek ik vooraf met u.`,
  controle: ['Bevindingen concreet: welke waarde, sinds wanneer, welke verandering (bijv. verbouwing of aanbouw).', 'Polisvoorwaarden over onderverzekering en garantie gecontroleerd.', 'Weigert de klant aanpassing? Leg dat schriftelijk vast.']
},
{
  id: 'sch-opzegging-verzekeraar', cat: 'schade', type: 'brief',
  titel: 'Opzegging door de verzekeraar: gevolgen en alternatieven',
  onderwerp: '{verzekeraar} zegt uw {product} op',
  tekst: `Geachte {klantnaam},

{verzekeraar} heeft laten weten dat zij uw {product} (polisnummer {polisnummer}) opzegt. De verzekering stopt op {einddatumpolis}. Ik begrijp dat dit vervelend nieuws is. In deze brief leest u wat dit betekent en wat we kunnen doen.

Waarom zegt de verzekeraar op?
{opzegreden}
[[Controleer of de verzekeraar de opzegging mag doen op grond van de polisvoorwaarden (bijv. na schade, wegens premieachterstand of bij de verlengingsdatum) en of de opzegtermijn is aangehouden. Bij twijfel: vraag de verzekeraar om uitleg.]]

Wat betekent dit voor u?
- Na {einddatumpolis} bent u niet meer verzekerd bij {verzekeraar}. Zonder nieuwe verzekering betaalt niemand meer bij schade.
- Bij een nieuwe aanvraag stelt een verzekeraar vragen. U moet die eerlijk en volledig beantwoorden. Vaak wordt gevraagd of een verzekeraar u eerder heeft opgezegd of geweigerd. Dan moet u deze opzegging noemen.
- Vertelt u dit niet terwijl er wel naar is gevraagd? Dan kan de nieuwe verzekeraar later weigeren uit te keren of de verzekering beëindigen.
[[Controleer de slotvragen van de nieuwe verzekeraar: welke periode en welke soort verzekering worden gevraagd? Leg vast wat de klant heeft geantwoord.]]

Wat hebben wij voor u onderzocht?
{alternatieven}

Hoe gaan we verder?
Ik vraag graag een nieuwe verzekering voor u aan, zodat die op tijd ingaat. Bent u het niet eens met de opzegging? Dan kunt u een klacht indienen bij {verzekeraar}. Komt u er samen niet uit, dan kunt u naar het Klachteninstituut Financiële Dienstverlening (Kifid).

Neem contact met mij op, het liefst voor {deadline}. Dan hebben we genoeg tijd om een nieuwe verzekering te regelen.`,
  controle: ['Opzegbrief van de verzekeraar in het dossier; reden en termijn gecontroleerd.', 'Verplichte verzekering (bijv. WA motorrijtuig) of door de geldverstrekker geëiste opstalverzekering? Extra spoed en dit expliciet melden.', 'Mededelingsplicht besproken; antwoorden op de slotvragen vastgelegd.', 'Opzegging wegens fraude of registratie in een waarschuwingssysteem? Pas de brief aan en laat deze zo nodig juridisch toetsen.'],
  bronnen: [
    { t: 'Burgerlijk Wetboek Boek 7, art. 7:928 (mededelingsplicht)', u: 'https://wetten.overheid.nl/jci1.3:c:BWBR0005290&boek=7&titeldeel=17&afdeling=1&paragraaf=2&artikel=928' },
    { t: 'Kifid: kan Kifid mijn klacht behandelen?', u: 'https://www.kifid.nl/ik-heb-een-klacht/kan-kifid-mijn-klacht-behandelen/' }
  ]
},

/* ---------- Klachten en Kifid ---------- */
{
  id: 'kl-ontvangst', cat: 'klacht', type: 'brief',
  titel: 'Ontvangstbevestiging klacht',
  onderwerp: 'Wij hebben uw klacht ontvangen',
  tekst: `Geachte {klantnaam},

Op {klachtdatum} ontvingen wij uw klacht. Vervelend dat u niet tevreden bent. Wij nemen uw klacht serieus.

Zo hebben wij uw klacht begrepen:
{klachtomschrijving}

Klopt dit niet of wilt u iets aanvullen? Laat het ons dan weten.

Wat gebeurt er nu?
{klachtbehandelaar} behandelt uw klacht. Dat is iemand die niet direct betrokken was bij uw dossier, als dat mogelijk is. Wij streven ernaar u binnen {behandeltermijn} ons standpunt te sturen. [[Neem de termijn over uit je eigen klachtenregeling.]]

Heeft u na 8 weken nog geen definitief standpunt van ons? Dan kunt u uw klacht ook voorleggen aan het Klachteninstituut Financiële Dienstverlening (Kifid), via www.kifid.nl.

Ons dossiernummer voor uw klacht is {dossiernummer}.`,
  controle: ['Behandeltermijn gelijk aan je interne klachtenregeling.', 'Klacht geregistreerd in het klachtenregister.', 'Kifid-aansluiting en aansluitnummer actueel.'],
  bronnen: [
    { t: 'Kifid: kan Kifid mijn klacht behandelen?', u: 'https://www.kifid.nl/ik-heb-een-klacht/kan-kifid-mijn-klacht-behandelen/' },
    { t: 'Kifid: veelgestelde vragen', u: 'https://www.kifid.nl/kifid-kennis-en-uitspraken/veelgestelde-vragen/' }
  ]
},
{
  id: 'kl-uitstel', cat: 'klacht', type: 'brief',
  titel: 'Klacht: meer tijd nodig',
  onderwerp: 'Uw klacht van {klachtdatum}: meer tijd nodig',
  tekst: `Geachte {klantnaam},

Op {klachtdatum} ontvingen wij uw klacht. Wij hadden u beloofd om binnen {behandeltermijn} te reageren. Dat lukt helaas niet.

De reden is:
{uitstelreden}

Wij verwachten u uiterlijk op {nieuwedatum} ons standpunt te sturen.

Heeft u 8 weken na het indienen van uw klacht nog geen definitief standpunt van ons ontvangen? Dan kunt u uw klacht ook voorleggen aan het Klachteninstituut Financiële Dienstverlening (Kifid), via www.kifid.nl. [[Controleer de datum: 8 weken na {klachtdatum}.]]

Wij bieden onze excuses aan voor het oponthoud.`,
  controle: ['Reden voor uitstel feitelijk en eerlijk.', 'Nieuwe datum haalbaar.'],
  bronnen: [
    { t: 'Kifid: veelgestelde vragen', u: 'https://www.kifid.nl/kifid-kennis-en-uitspraken/veelgestelde-vragen/' }
  ]
},
{
  id: 'kl-standpunt', cat: 'klacht', type: 'brief',
  titel: 'Definitief standpunt klacht met Kifid-verwijzing',
  onderwerp: 'Ons definitieve standpunt over uw klacht',
  tekst: `Geachte {klantnaam},

Op {klachtdatum} ontvingen wij uw klacht. Wij hebben uw klacht onderzocht. In deze brief leest u ons definitieve standpunt.

Uw klacht
{klachtomschrijving}

Wat wij hebben onderzocht
{onderzoek}

Ons standpunt
{standpunt}

Wat wij u aanbieden
{oplossing}

Bent u het niet eens met ons standpunt?
Dan kunt u uw klacht voorleggen aan het Klachteninstituut Financiële Dienstverlening (Kifid). Kifid is een onafhankelijke organisatie die klachten over financiële dienstverleners behandelt. U kunt uw klacht indienen via www.kifid.nl.

Let op de termijn. U kunt uw klacht bij Kifid indienen binnen drie maanden na de datum van deze brief. Is dat later dan één jaar na het moment dat u uw klacht bij ons indiende? Dan geldt de termijn van één jaar: u kunt dan tot één jaar na {klachtdatum} bij Kifid terecht. [[Controleer deze tekst tegen het actuele reglement van Kifid voordat je de brief verstuurt.]]

U kunt uw klacht ook voorleggen aan de rechter.

Wij betreuren dat u niet tevreden bent en hopen dat deze brief duidelijkheid geeft.`,
  controle: ['Dit is het definitieve (eind)standpunt: noem het ook zo.', 'Kifid-termijnen en verwijzing gecontroleerd tegen het actuele reglement.', 'Aanbod zonder erkenning van aansprakelijkheid? Laat dit zo nodig juridisch toetsen.', 'Brief en verzenddatum in het klachtenregister.'],
  bronnen: [
    { t: 'Reglement Geschillencommissie Kifid (vanaf 1 april 2024)', u: 'https://www.kifid.nl/media/x03nvp5m/reglement-geschillencommissie-kifid-vanaf-1-april-2024-1.pdf' },
    { t: 'Kifid: kan Kifid mijn klacht behandelen?', u: 'https://www.kifid.nl/ik-heb-een-klacht/kan-kifid-mijn-klacht-behandelen/' }
  ]
},

/* ---------- AVG ---------- */
{
  id: 'avg-inzage-antwoord', cat: 'avg', type: 'brief',
  titel: 'Antwoord op inzageverzoek',
  onderwerp: 'Uw verzoek om inzage in uw persoonsgegevens',
  tekst: `Geachte {klantnaam},

Op {verzoekdatum} vroeg u welke persoonsgegevens wij van u verwerken. Met deze brief geven wij u die informatie.

Welke gegevens wij hebben en waarom
{gegevensoverzicht}

In de bijlage vindt u een kopie van de gegevens. [[Controleer: doel, categorieën gegevens, ontvangers, bewaartermijn, herkomst en de rechten van de klant (rectificatie, verwijdering, beperking, bezwaar, klacht bij de Autoriteit Persoonsgegevens). Lak gegevens van anderen weg.]]

Uw rechten
U kunt ons vragen gegevens te verbeteren, aan te vullen of te verwijderen. Bent u het niet eens met hoe wij met uw gegevens omgaan? Dan kunt u een klacht indienen bij de Autoriteit Persoonsgegevens.

Vragen? Neem contact op met {contactprivacy}.`,
  controle: ['Antwoord binnen één maand na ontvangst van het verzoek (verlenging met twee maanden alleen bij complexe of veel verzoeken, en melden binnen de eerste maand).', 'Identiteit van de aanvrager gecontroleerd.', 'Kopie veilig verstuurd.'],
  bronnen: [
    { t: 'Autoriteit Persoonsgegevens: recht op inzage', u: 'https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/gebruik-uw-privacyrechten/recht-op-inzage' }
  ]
},
{
  id: 'avg-verlenging', cat: 'avg', type: 'mail',
  titel: 'Privacyverzoek: verlenging termijn',
  onderwerp: 'Uw privacyverzoek: meer tijd nodig',
  tekst: `Beste {klantnaam},

Op {verzoekdatum} ontvingen wij uw verzoek over uw persoonsgegevens. Normaal reageren wij binnen één maand. Voor uw verzoek hebben wij meer tijd nodig.

De reden is:
{uitstelreden}

Wij sturen u uiterlijk op {nieuwedatum} ons antwoord. [[De verlenging is maximaal twee maanden extra, dus in totaal maximaal drie maanden na ontvangst. Deze mail moet binnen de eerste maand verstuurd zijn.]]

Vragen? Neem contact op met {contactprivacy}.`,
  controle: ['Verstuurd binnen één maand na ontvangst.', 'Nieuwe datum niet later dan drie maanden na ontvangst.', 'Reden: het verzoek is complex of er zijn veel verzoeken.'],
  bronnen: [
    { t: 'Autoriteit Persoonsgegevens: recht op inzage', u: 'https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/gebruik-uw-privacyrechten/recht-op-inzage' },
    { t: 'Autoriteit Persoonsgegevens: rechten van betrokkenen', u: 'https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/algemene-informatie-avg/rechten-van-betrokkenen' }
  ]
},
{
  id: 'avg-verwijderen', cat: 'avg', type: 'brief',
  titel: 'Antwoord op verwijderverzoek',
  onderwerp: 'Uw verzoek om uw gegevens te verwijderen',
  tekst: `Geachte {klantnaam},

Op {verzoekdatum} vroeg u ons uw persoonsgegevens te verwijderen. Wij hebben uw verzoek bekeken.

Wat wij hebben verwijderd
{verwijderdegegevens}

Wat wij nog moeten bewaren
{bewaargegevens}

Sommige gegevens moeten wij volgens de wet bewaren. Zo moeten wij gegevens uit het cliëntenonderzoek op grond van de Wwft vijf jaar bewaren na het einde van de klantrelatie. [[Controleer welke andere bewaarplichten voor jouw kantoor gelden (bijvoorbeeld fiscale of dossierplichten) en of die in je privacyverklaring staan.]] Deze gegevens gebruiken wij alleen nog om aan die plicht te voldoen. Na afloop van de bewaartermijn verwijderen wij ze.

Bent u het niet eens met ons besluit? Dan kunt u een klacht indienen bij de Autoriteit Persoonsgegevens.

Vragen? Neem contact op met {contactprivacy}.`,
  controle: ['Antwoord binnen één maand na ontvangst.', 'Ook gegevens bij verwerkers (bijvoorbeeld mailingsysteem) verwijderd.', 'Bewaartermijnen per gegevenssoort gecontroleerd.'],
  bronnen: [
    { t: 'Autoriteit Persoonsgegevens: rechten van betrokkenen', u: 'https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/algemene-informatie-avg/rechten-van-betrokkenen' },
    { t: 'AFM: vastlegging cliëntenonderzoek Wwft', u: 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/wwft-algemeen/clientenonderzoek-vastlegging' }
  ]
},
{
  id: 'avg-datalek', cat: 'avg', type: 'brief',
  titel: 'Datalek: melding aan de klant',
  onderwerp: 'Belangrijk: er is een datalek geweest met uw gegevens',
  tekst: `Geachte {klantnaam},

Wij moeten u helaas laten weten dat er een datalek is geweest waarbij uw persoonsgegevens betrokken zijn. Wij vinden dit heel vervelend en bieden u onze excuses aan.

Wat is er gebeurd?
Op {lekdatum} ontdekten wij het volgende: {lekomschrijving}

Om welke gegevens gaat het?
{lekgegevens}

Wat kunnen de gevolgen zijn?
{lekgevolgen}

Wat hebben wij gedaan?
{lekmaatregelen}

Wat kunt u zelf doen?
{lekadvies}

Wij hebben het datalek gemeld bij de Autoriteit Persoonsgegevens. [[Alleen laten staan als dat klopt. Melding aan de AP moet binnen 72 uur na ontdekking.]]

Heeft u vragen? Neem dan contact op met {contactprivacy}.`,
  controle: ['Klant informeren is verplicht als het lek waarschijnlijk een hoog risico geeft; doe dit zo snel mogelijk.', 'Brief bevat: wat er is gebeurd, contactpersoon, mogelijke gevolgen, genomen maatregelen en wat de klant zelf kan doen.', 'Melding aan de AP binnen 72 uur, ook als de klant geen brief krijgt.', 'Datalek vastgelegd in het datalekregister.'],
  bronnen: [
    { t: 'Autoriteit Persoonsgegevens: meldplicht datalekken', u: 'https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/beveiliging/meldplicht-datalekken' }
  ]
},

/* ---------- Wwft en identificatie ---------- */
{
  id: 'wwft-identificatie', cat: 'wwft', type: 'mail',
  titel: 'Identificatie: geldig legitimatiebewijs',
  onderwerp: 'Uw identiteit vaststellen',
  tekst: `Beste {klantnaam},

Voordat wij u kunnen helpen, moeten wij volgens de wet vaststellen wie u bent. Dat staat in de Wet ter voorkoming van witwassen en financieren van terrorisme (Wwft).

Wat vragen wij?
- Laat uw geldige paspoort of identiteitskaart zien tijdens onze afspraak op {datum}. [[Of beschrijf de digitale identificatie die jouw kantoor gebruikt.]]
- Wij maken daarvan een kopie voor ons dossier.

Wij bewaren de kopie veilig. Wij moeten deze gegevens volgens de Wwft bewaren tot vijf jaar na het einde van onze relatie.

Stuur een kopie van uw identiteitsbewijs niet via gewone e-mail. Moet u toch een kopie sturen? Gebruik dan {uploadkanaal}.`,
  controle: ['Werkwijze voor identificatie en verificatie klopt met je Wwft-beleid.', 'Ook UBO of vertegenwoordiger identificeren waar nodig.'],
  bronnen: [
    { t: 'AFM: vastlegging cliëntenonderzoek Wwft', u: 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/wwft-algemeen/clientenonderzoek-vastlegging' }
  ]
},
{
  id: 'wwft-herkomst', cat: 'wwft', type: 'mail',
  titel: 'Herkomst eigen geld aantonen',
  onderwerp: 'Herkomst van uw eigen geld',
  tekst: `Beste {klantnaam},

U brengt {bedrag} eigen geld in bij de aankoop van uw woning. Wij en de geldverstrekker moeten weten waar dit geld vandaan komt. Dat is een wettelijke plicht.

Wilt u aantonen waar het geld vandaan komt? Denk aan:
- een bankafschrift waarop het spaargeld staat;
- bij een schenking: een schenkingsovereenkomst en een afschrift van de overboeking;
- bij verkoop van een vorige woning: de afrekening van de notaris.
[[Vraag gericht op wat in dit dossier speelt en houd je aan je Wwft-beleid.]]

Wilt u de stukken voor {deadline} uploaden via {uploadkanaal}?`,
  controle: ['Vraag past bij het risicoprofiel van de klant.', 'Bij ongebruikelijke situaties: intern escaleren volgens Wwft-beleid. Informeer de klant nooit over een eventuele melding.']
},
{
  id: 'wwft-actualisatie', cat: 'wwft', type: 'mail',
  titel: 'Klantgegevens actualiseren',
  onderwerp: 'Kloppen uw gegevens nog?',
  tekst: `Beste {klantnaam},

Wij moeten uw gegevens regelmatig controleren. Dat vraagt de wet van ons. Wilt u nagaan of de volgende gegevens nog kloppen?

- naam, adres en woonplaats;
- telefoonnummer en e-mailadres;
- de geldigheid van uw identiteitsbewijs;
- uw werk of beroep.

Is er iets veranderd? Laat het ons voor {deadline} weten via {kantooremail}. Is uw identiteitsbewijs verlopen? Dan vragen wij u om een nieuw exemplaar te laten zien. [[Pas aan op de controle-frequentie en het risicoprofiel uit je Wwft-beleid.]]`,
  controle: ['Frequentie en diepgang in lijn met je Wwft-beleid.']
},


/* ---------- Compliance intern ---------- */
{
  id: 'comp-datalek-registratie', cat: 'compliance', type: 'memo', geenOndertekening: true,
  titel: 'Datalek intern melden en registreren',
  onderwerp: 'Datalekregistratie {registratienummer}',
  tekst: `INTERNE REGISTRATIE DATALEK (niet voor de klant)

Registratienummer: {registratienummer}
Ontdekt op: {lekdatum} om {ontdekkingstijd}
Gemeld door: {melder}
Behandeld door: {compliancefunctionaris}

1. Wat is er gebeurd?
{lekomschrijving}
[[Beschrijf de oorzaak, hoe het is ontdekt en of het lek nog loopt. Ook een vermoeden van een lek registreer je.]]

2. Welke persoonsgegevens en wie zijn betrokken?
{lekgegevens}
Aantal betrokkenen (schatting): {aantalbetrokkenen}
[[Let op bijzondere of gevoelige gegevens: BSN, kopie identiteitsbewijs, gezondheidsgegevens (bijv. bij AOV of ORV), financiële gegevens. Die verhogen het risico.]]

3. Mogelijke gevolgen voor de betrokkenen
{lekgevolgen}

4. Genomen maatregelen
{lekmaatregelen}

5. Besluit melding aan de Autoriteit Persoonsgegevens
{apbesluit}
[[De melding aan de AP moet binnen 72 uur na ontdekking. Alleen als het lek waarschijnlijk geen risico geeft voor de betrokkenen, hoef je niet te melden. Leg dan vast waarom niet. Te laat? Leg de reden vast en geef die bij de melding.]]

6. Besluit informeren van betrokkenen
{klantbesluit}
[[Betrokkenen moet je zonder onnodige vertraging informeren als het lek waarschijnlijk een hoog risico voor hen geeft. Gebruik daarvoor het sjabloon Datalek: melding aan de klant.]]

7. Verwerker betrokken?
Is het lek ontstaan bij een leverancier? Noteer welke, wanneer die ons informeerde en wat de verwerkersovereenkomst zegt over melden.

8. Afronding
Datum afgerond: ____________________
Geleerde lessen en vervolgacties: ____________________

Opgesteld door {adviseur}, {kantoor}, op {vandaag}.`,
  controle: ['Elk datalek in het datalekregister, ook als je niet meldt bij de AP.', 'Melding AP binnen 72 uur na ontdekking; tijdstip van ontdekking exact noteren.', 'Besluit over melden en over informeren van betrokkenen onderbouwd vastgelegd.', 'Raakt het lek ook de integriteit van het kantoor (bijv. fraude door een medewerker)? Kijk dan ook naar het sjabloon Integriteitsincident registreren.'],
  bronnen: [
    { t: 'Autoriteit Persoonsgegevens: meldplicht datalekken', u: 'https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/beveiliging/meldplicht-datalekken' },
    { t: 'Autoriteit Persoonsgegevens: acties bij datalekken', u: 'https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/beveiliging/acties-bij-datalekken' }
  ]
},
{
  id: 'comp-reclame-toets', cat: 'compliance', type: 'memo', geenOndertekening: true,
  titel: 'Reclame-uiting toetsen (checklist)',
  onderwerp: 'Toetsing reclame-uiting: {uiting}',
  tekst: `INTERNE TOETSING RECLAME-UITING (niet voor de klant)

Uiting: {uiting}
Getoetst door: {compliancefunctionaris}
Datum toetsing: {vandaag}

Tekst van de uiting
{uitingtekst}

1. Correct, duidelijk en niet misleidend (art. 4:19 Wft)
[ ] Alle feiten en bedragen kloppen en zijn actueel.
[ ] De uiting is begrijpelijk voor de doelgroep, zonder vakjargon.
[ ] Voordelen staan niet groter of opvallender dan nadelen en risico’s.
[ ] Geen beloften die we niet waar kunnen maken, zoals "altijd de laagste rente" of "gegarandeerd goedgekeurd".
[ ] De uiting is op zichzelf juist. Een link naar meer informatie maakt een onvolledige uiting niet goed.
[[Toets elk van de drie eisen apart: een uiting kan correct zijn en toch misleidend.]]

2. Kosten en verdienmodel
[ ] Noemt de uiting "gratis" of "kosteloos"? Klopt dat met de vergelijkingskaart en het verdienmodel?
[ ] Klopt wat over onafhankelijkheid wordt gezegd met hoe het kantoor betaald wordt?

3. Krediet
[ ] Gaat de uiting over consumptief krediet? Dan staat de kredietwaarschuwing erin, in het voorgeschreven formaat: "Let op! Geld lenen kost geld."
[ ] Dat geldt ook voor kleine uitingen, zoals banners en advertenties op sociale media.
[[Controleer de actuele vormvereisten van de kredietwaarschuwing en of er andere verplichte informatie nodig is (bijvoorbeeld een representatief voorbeeld bij genoemde rente).]]

4. Toezicht en vergunning
[ ] Vermelden dat we een AFM-vergunning hebben mag, maar de uiting wekt niet de indruk dat de AFM het kantoor of een product aanbeveelt of heeft goedgekeurd.
[ ] Geen AFM-logo en geen teksten als "goedgekeurd door de AFM" of "in overleg met de AFM".

5. Overig
[ ] Rentes, premies of acties: alleen als ze actueel zijn en de voorwaarden erbij staan.
[ ] Reviews en scores: echt, actueel en niet selectief weergegeven.
[ ] Privacy: bij gerichte advertenties of nieuwsbrieven is er een grondslag en een afmeldmogelijkheid.

Bevindingen en afspraken
{bevindingen}

Besluit: [ ] goedgekeurd  [ ] goedgekeurd na aanpassing  [ ] afgekeurd

Opgesteld door {adviseur}, {kantoor}.`,
  controle: ['Bewaar de getoetste versie en het besluit; de uiting die online staat moet gelijk zijn aan de goedgekeurde versie.', 'Toets opnieuw bij elke wijziging van tekst, kanaal of doelgroep.', 'Twijfel over krediet- of beleggingsreclame? Raadpleeg de AFM-Beleidsregel informatieverstrekking.'],
  bronnen: [
    { t: 'AFM: Beleidsregel informatieverstrekking (pdf)', u: 'https://www.afm.nl/~/profmedia/files/wet-regelgeving/beleidsuitingen/beleidsregels/beleidsregel-informatieverstrekking.pdf' },
    { t: 'AFM: mag een onderneming in een reclame-uiting opnemen dat zij een AFM-vergunning heeft?', u: 'https://www.afm.nl/nl-nl/professionals/veelgestelde-vragen/zorgplicht-algemeen/tekst-reclame-uiting' }
  ]
},
{
  id: 'comp-verwerkersovereenkomst', cat: 'compliance', type: 'memo', geenOndertekening: true,
  titel: 'Verwerkersovereenkomst controleren (checklist)',
  onderwerp: 'Controle verwerkersovereenkomst {leverancier}',
  tekst: `INTERNE CONTROLE VERWERKERSOVEREENKOMST (niet voor de klant)

Leverancier: {leverancier}
Dienst: {softwaredienst}
Gecontroleerd door: {compliancefunctionaris}
Datum: {vandaag}

Is de leverancier een verwerker?
[ ] De leverancier verwerkt persoonsgegevens in onze opdracht en voor onze doelen (bijv. hosting, CRM, adviessoftware, mailing).
[[Bepaalt de leverancier zelf het doel van de verwerking? Dan is het geen verwerker en past een verwerkersovereenkomst niet. Laat dit zo nodig toetsen.]]

Verplichte onderdelen (art. 28 AVG)
[ ] Schriftelijk vastgelegd (een elektronische vorm mag).
[ ] Onderwerp, duur, aard en doel van de verwerking.
[ ] Soorten persoonsgegevens en categorieën betrokkenen (klanten, partners, kinderen, medewerkers).
[ ] Rechten en plichten van ons kantoor als verwerkingsverantwoordelijke.
[ ] De verwerker werkt alleen op onze schriftelijke instructies.
[ ] Geheimhouding voor iedereen die bij de verwerker met de gegevens werkt.
[ ] Passende technische en organisatorische beveiliging.
[ ] Subverwerkers alleen met onze toestemming; dezelfde plichten gelden voor hen. De verwerker blijft verantwoordelijk.
[ ] Hulp bij verzoeken van betrokkenen (inzage, correctie, verwijdering).
[ ] Hulp bij beveiliging, datalekken en een eventuele DPIA.
[ ] Na afloop: gegevens teruggeven of verwijderen, naar onze keuze.
[ ] Wij kunnen controleren of de verwerker zich aan de afspraken houdt (informatie, audits).

Aanvullende punten
[ ] Meldtermijn datalekken: de verwerker meldt ons snel genoeg om binnen 72 uur bij de AP te kunnen melden.
[ ] Waar staan de gegevens? Bij doorgifte buiten de EER: is er een geldige grondslag?
[ ] Bewaartermijnen sluiten aan op ons beleid, inclusief Wwft-bewaarplicht.
[ ] Bijzondere gegevens (bijv. gezondheid) of BSN: extra beveiliging afgesproken.
[ ] Exit: we kunnen onze gegevens in een bruikbaar formaat terugkrijgen.
[[Leg de uitkomst vast in het verwerkingsregister en plan een herbeoordeling, bijvoorbeeld jaarlijks of bij een nieuwe versie van de voorwaarden.]]

Bevindingen en afspraken
{bevindingen}

Besluit: [ ] akkoord  [ ] akkoord na aanpassing  [ ] niet akkoord

Opgesteld door {adviseur}, {kantoor}.`,
  controle: ['Getekende of geaccepteerde verwerkersovereenkomst in het archief.', 'Leverancier opgenomen in het verwerkingsregister.', 'Ontbreken verplichte onderdelen? Vraag een aanvulling voordat je klantgegevens deelt.'],
  bronnen: [
    { t: 'Autoriteit Persoonsgegevens: verwerkers', u: 'https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/algemene-informatie-avg/verwerkers' },
    { t: 'Autoriteit Persoonsgegevens: verwerkersovereenkomst', u: 'https://www.autoriteitpersoonsgegevens.nl/en/themes/basic-gdpr/gdpr-basics/processing-agreement' }
  ]
},
{
  id: 'comp-incident-registratie', cat: 'compliance', type: 'memo', geenOndertekening: true,
  titel: 'Integriteitsincident registreren (en melden aan de AFM)',
  onderwerp: 'Incidentregistratie {registratienummer}',
  tekst: `INTERNE REGISTRATIE INCIDENT (vertrouwelijk, niet voor de klant)

Registratienummer: {registratienummer}
Datum incident of ontdekking: {incidentdatum}
Gemeld door: {melder}
Behandeld door: {compliancefunctionaris}

1. Wat is er gebeurd?
{incidentomschrijving}
[[Een incident is een gedraging of gebeurtenis die een ernstig gevaar vormt voor de integere uitoefening van het bedrijf. Denk aan fraude, valse documenten in een aanvraag, belangenverstrengeling of een overtreding door een medewerker. Toets dit tegen je integriteitsbeleid (art. 4:11 Wft).]]

2. Betrokkenen
{incidentbetrokkenen}

3. Genomen en geplande maatregelen
{incidentmaatregelen}
[[Denk aan: toegang intrekken, dossiers nalopen, geldverstrekker of verzekeraar informeren, aangifte, en aanpassing van procedures.]]

4. Besluit melding aan de AFM
{afmbesluit}
[[Een incident meld je onverwijld bij de AFM: zo snel mogelijk nadat je ervan weet. Wacht niet tot een intern onderzoek klaar is. Je meldt zelf, ook als een ander het incident al heeft gemeld. Controleer op afm.nl via welk kanaal je meldt.]]

5. Andere meldingen
[ ] Valt je kantoor onder de Wwft en gaat het (ook) om een ongebruikelijke transactie? Volg dan het Wwft-beleid en meld bij de FIU-Nederland. Informeer de klant daar nooit over.
[ ] Zijn persoonsgegevens gelekt? Registreer ook een datalek.

6. Afronding
Datum afgerond: ____________________
Oorzaak en geleerde lessen: ____________________
Aanpassing integriteitsbeleid of procedures: ____________________

Opgesteld door {adviseur}, {kantoor}, op {vandaag}.`,
  controle: ['Elk incident in het incidentenregister, ook als het niet ernstig genoeg is voor een melding.', 'Melding aan de AFM onverwijld; tijdstip en manier van melden vastleggen.', 'Vertrouwelijk bewaren: alleen toegankelijk voor wie het nodig heeft.', 'Een Wwft-melding bij de FIU-Nederland en een incidentmelding bij de AFM zijn verschillende meldingen; houd ze gescheiden.'],
  bronnen: [
    { t: 'AFM: wat zijn misstanden en incidenten?', u: 'https://www.afm.nl/nl-nl/professionals/onderwerpen/misstanden-wat' },
    { t: 'AFM: het registreren en melden van incidenten (brief 23 december 2020, pdf)', u: 'https://www.afm.nl/~/profmedia/files/nieuws/2020/december/brief-incidenten-melden.pdf?la=nl-NL' },
    { t: 'AFM: doorlopende eisen en bedrijfsvoering voor adviseurs en bemiddelaars', u: 'https://www.afm.nl/nl-nl/sector/adviseurs-bemiddelaars-en-gevolmachtigde-agenten/doorlopende-eisen-en-bedrijfsvoering' }
  ]
},

/* ---------- Beëindiging en overdracht ---------- */
{
  id: 'eind-door-kantoor', cat: 'beeindiging', type: 'brief',
  titel: 'Beëindiging dienstverlening door het kantoor',
  onderwerp: 'Einde van onze dienstverlening',
  tekst: `Geachte {klantnaam},

Met deze brief laten wij u weten dat wij onze dienstverlening aan u stoppen per {einddatumrelatie}.

De reden is:
{reden}

Wat betekent dit voor u?
- Uw hypotheek en verzekeringen blijven gewoon doorlopen. Alleen ons advies en onze service stoppen.
- Na {einddatumrelatie} zijn wij niet meer uw aanspreekpunt. U kunt dan zelf contact opnemen met de geldverstrekker en verzekeraars, of een andere adviseur kiezen.
- Op uw verzoek dragen wij uw dossier over aan een nieuwe adviseur.
[[Controleer opzegtermijnen in de opdracht of het abonnement, lopende nazorgafspraken en of verzekeraars moeten worden ingelicht over het wijzigen van de bemiddelaar.]]

Wij danken u voor het vertrouwen.`,
  controle: ['Opzegtermijn uit de overeenkomst gerespecteerd.', 'Lopende aanvragen of schades netjes afgerond of overgedragen.', 'Doorlopende abonnementskosten gestopt.']
},
{
  id: 'eind-overdracht-dossier', cat: 'beeindiging', type: 'mail',
  titel: 'Overdracht dossier aan nieuwe adviseur',
  onderwerp: 'Overdracht van uw dossier',
  tekst: `Beste {klantnaam},

U heeft ons laten weten dat u voortaan door {nieuwkantoor} geholpen wilt worden. Wij respecteren uw keuze.

Wij dragen uw dossier over zodra wij uw schriftelijke toestemming hebben. Wilt u daarom deze e-mail beantwoorden met:
- de naam van de nieuwe adviseur en het kantoor;
- welke producten u wilt laten overdragen;
- uw akkoord dat wij uw gegevens aan hen geven.

Na de overdracht zijn wij niet langer uw adviseur voor deze producten. [[Controleer opzegtermijnen en of er nog openstaande facturen of abonnementen zijn.]]

Wij wensen u veel succes.`,
  controle: ['Schriftelijke toestemming klant ontvangen voordat je gegevens deelt.', 'Overdracht via beveiligd kanaal.', 'Wwft-bewaarplicht: houd een kopie van de cliëntonderzoeksgegevens.']
},
{
  id: 'eind-overname-kantoor', cat: 'beeindiging', type: 'brief',
  titel: 'Kantoor overgenomen: bericht aan klant',
  onderwerp: 'Belangrijk nieuws over ons kantoor',
  tekst: `Geachte {klantnaam},

Per {einddatumrelatie} gaat ons kantoor verder onder de naam {nieuwkantoor}. Wij willen u daar graag persoonlijk over informeren.

Wat verandert er voor u?
- Uw hypotheek en verzekeringen blijven gewoon doorlopen.
- Uw dossier gaat over naar {nieuwkantoor}. [[Controleer de juridische vorm van de overname en of de klant bezwaar kan maken of moet instemmen met overdracht van gegevens en klantrelatie.]]
- U krijgt een nieuwe vergelijkingskaart.

Wilt u niet dat uw dossier wordt overgedragen? Laat het ons dan voor {deadline} weten.

Uw contactpersoon wordt {contactpersoon}, bereikbaar via {telefoon} of {kantooremail}.`,
  controle: ['Juridische en AVG-aspecten van de overname getoetst.', 'Vergunning en Kifid-aansluiting van het nieuwe kantoor gecontroleerd.', 'Nieuwe vergelijkingskaart klaar.']
},

/* ---------- Reviews en klanttevredenheid ---------- */
{
  id: 'rev-verzoek', cat: 'review', type: 'mail',
  titel: 'Verzoek om een beoordeling',
  onderwerp: 'Hoe heeft u onze hulp ervaren?',
  tekst: `Beste {klantnaam},

Wij hebben u onlangs geholpen met {dienst}. Wij zijn benieuwd hoe u dat heeft ervaren.

Wilt u een korte beoordeling geven? Dat kost ongeveer twee minuten:
{reviewlink}

Uw mening helpt ons om beter te worden. Ook andere mensen kunnen er een keuze mee maken. Een eerlijke beoordeling is welkom, ook als u minder tevreden bent.

Heeft u een vraag of klacht? Neem dan liever direct contact met ons op, dan lossen we het samen op.`,
  controle: ['Geen beloning in ruil voor een positieve review.', 'Vraag alle klanten, niet alleen tevreden klanten.']
},
{
  id: 'rev-enquete', cat: 'review', type: 'mail',
  titel: 'Klanttevredenheidsonderzoek',
  onderwerp: 'Vijf minuten voor een betere dienstverlening?',
  tekst: `Beste {klantnaam},

Wij willen onze dienstverlening steeds beter maken. Daarom vragen wij u een korte vragenlijst in te vullen. Dat duurt ongeveer vijf minuten.

{enquetelink}

De vragenlijst staat open tot {deadline}. [[Vermeld of de antwoorden anoniem zijn en hoe je de gegevens gebruikt.]]

Hartelijk dank voor uw tijd.`,
  controle: ['Privacy: doel en gebruik antwoorden vermeld.', 'Zie de scan Klanttevredenheid op het Adviesforum.']
},
{
  id: 'rev-reactie-negatief', cat: 'review', type: 'mail',
  titel: 'Reactie op een negatieve beoordeling',
  onderwerp: 'Uw beoordeling van ons kantoor',
  tekst: `Beste {klantnaam},

Dank voor uw beoordeling. Jammer om te lezen dat u niet tevreden bent. Wij nemen uw opmerkingen serieus.

{reviewreactie}

Wij willen graag met u in gesprek om te kijken wat we kunnen verbeteren of rechtzetten. Mag ik u daarvoor bellen?

Wilt u uw ervaring als officiële klacht indienen? Dan behandelen wij die volgens onze klachtenregeling.`,
  controle: ['Openbare reactie: noem geen klantgegevens of dossierdetails.', 'Bevat het bericht een klacht? Behandel en registreer het als klacht.']
},

/* ---------- Opvolging bij stilte of verzuim ---------- */
{
  id: 'op-geen-reactie', cat: 'opvolging', type: 'mail',
  titel: 'Eerste opvolging: geen reactie ontvangen',
  onderwerp: 'Even checken: {onderwerp}',
  tekst: `Beste {klantnaam},

Op {laatstecontact} stuurde ik u een bericht over {onderwerp}. Ik heb nog niets van u gehoord. Misschien is het ondergesneeuwd. Dat kan gebeuren.

Wilt u laten weten hoe u verder wilt? Een kort antwoord is genoeg. U kunt mij ook bellen op {telefoon}.`,
  controle: ['Datum laatste contact klopt.', 'Contactmoment vastgelegd in het dossier.']
},
{
  id: 'op-laatste-herinnering', cat: 'opvolging', type: 'mail',
  titel: 'Laatste herinnering: dossier sluiten',
  onderwerp: 'Laatste herinnering: {onderwerp}',
  tekst: `Beste {klantnaam},

Ik heb u een paar keer geprobeerd te bereiken over {onderwerp}. Helaas heb ik geen reactie ontvangen.

Als ik voor {deadline} niets van u hoor, ga ik ervan uit dat u op dit moment geen hulp meer nodig heeft. Ik sluit dan uw dossier voor deze opdracht. [[Noem wat er met eventuele kosten gebeurt volgens de opdrachtbevestiging, en of er risico’s zijn als de klant niets doet, zoals een vervallende offerte of rentevoorstel.]]

U kunt later altijd weer contact opnemen.`,
  controle: ['Minstens één eerdere herinnering verstuurd en vastgelegd.', 'Risico’s van niets doen benoemd (bijvoorbeeld vervallen offerte).', 'Afsluiting in het dossier vastgelegd.']
},
{
  id: 'op-gemiste-afspraak', cat: 'opvolging', type: 'mail',
  titel: 'Gemiste afspraak',
  onderwerp: 'We hebben u gemist',
  tekst: `Beste {klantnaam},

Wij hadden vandaag om {tijd} een afspraak, maar helaas hebben we elkaar niet gesproken. Ik hoop dat alles goed met u is.

Wilt u een nieuwe afspraak maken? Antwoord op deze e-mail of bel mij op {telefoon}. [[Vermeld alleen kosten voor een gemiste afspraak als dat in je voorwaarden staat.]]`,
  controle: ['Kosten gemiste afspraak alleen noemen als afgesproken.']
},
{
  id: 'op-betalingsherinnering', cat: 'opvolging', type: 'mail',
  titel: 'Vriendelijke betalingsherinnering',
  onderwerp: 'Herinnering factuur {dossiernummer}',
  tekst: `Beste {klantnaam},

Volgens onze administratie hebben wij de betaling van factuur {dossiernummer} van {bedrag} nog niet ontvangen. Misschien is het aan uw aandacht ontsnapt.

Wilt u het bedrag voor {deadline} overmaken? Heeft u al betaald, dan kunt u dit bericht negeren.

Lukt betalen nu niet of klopt de factuur volgens u niet? Neem dan contact met mij op. Dan zoeken we samen naar een oplossing. [[Bij consumenten: volg de wettelijke regels voor incassokosten, waaronder een aanmaning met een betaaltermijn van 14 dagen voordat je incassokosten rekent.]]`,
  controle: ['Bedrag en factuurnummer gecontroleerd.', 'Geen incassokosten rekenen zonder correcte aanmaning.'],
  bronnen: [
    { t: 'Rijksoverheid: hoeveel betaal ik voor incassokosten?', u: 'https://www.rijksoverheid.nl/vraag-en-antwoord/schulden/hoogte-incassokosten' }
  ]
}
];
