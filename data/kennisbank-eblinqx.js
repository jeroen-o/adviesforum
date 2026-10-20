/* KENNISBANK-EBLINQX van het Adviesforum
 *
 * Aanvulling op data/kennisbank.js met praktijkartikelen over eBlinqx (voorheen Faster Forward Elements)
 * en Quinn, de AI-assistent van Blinqx Verzekering & Hypotheek.
 * In eigen woorden samengevat uit openbare zoekresultaten van support.fasterforward.nl en
 * verzekeringhypotheek.blinqx.tech op 2 oktober 2026. Menupaden en instellingen kunnen per release wijzigen.
 * Alle artikelen zijn concept (gecontroleerd:false) tot goedkeuring door compliance.
 */
window.KENNISBANK=(window.KENNISBANK||[]).concat([
 {id:'k50',cat:'adv',titel:'eBlinqx en Quinn: werken met dossiers, mail en taken',auteur:'u6',datum:'2026-10-02T23:00:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'eBlinqx Quinn Quinn Mail Voice to Text gespreksopname AI e-mail koppelen taken workflow werkgroep behandelaar dossier agenda Microsoft 365 On Route app standaardtekst tags campagne SMART Faster Forward Elements',
  links:[{titel:'Quinn Mail: koppelen, taken aanmaken en reply (support.fasterforward.nl)',url:'https://support.fasterforward.nl/kennisbank/quinn-mail-koppelen-taken-aanmaken-en-reply/'},{titel:'Gespreksopname omzetten naar acties',url:'https://support.fasterforward.nl/kennisbank/gespreksopname-omzetten-naar-acties/'},{titel:'Quinn Mail (Blinqx V&H)',url:'https://verzekeringhypotheek.blinqx.tech/oplossingen/quinn-mail'},{titel:'AI bij Blinqx V&H',url:'https://verzekeringhypotheek.blinqx.tech/ai'},{titel:'Taak aanmaken',url:'https://support.fasterforward.nl/kennisbank/hoe-maak-ik-een-taak-aan/'},{titel:'On Route app gebruiken',url:'https://support.fasterforward.nl/kennisbank/functionaliteiten-faster-forward-on-route-app'}],
  body:`eBlinqx is het kantoorsysteem (CRM, polis- en hypotheekadministratie) van Blinqx Verzekering & Hypotheek. Het pakket heette eerder Faster Forward Elements; in de helpcentrumartikelen op support.fasterforward.nl kom je beide namen nog tegen. Quinn is de naam die Blinqx gebruikt voor zijn AI-assistent binnen eBlinqx. Dit artikel beschrijft hoe dossiers, mail, taken en Quinn in de dagelijkse praktijk samenhangen.

## Wat is Quinn precies?

Quinn is geen los programma of chatbot, maar een "digitale collega" die werk in de bestaande eBlinqx-workflow voorbereidt. De adviseur controleert en beslist (human in the loop). Op dit moment noemt Blinqx twee onderdelen:
- Quinn Mail: leest binnenkomende e-mail inclusief bijlagen, koppelt die aan de juiste klant, het juiste dossier of product, maakt taken aan en zet een conceptantwoord klaar op basis van de dossiergegevens.
- Quinn Voice to Text (bèta): zet een gespreksopname om in tekst, maakt een samenvatting en stelt actiepunten voor in het dossier. Dat werkt voor telefonische, online en fysieke gesprekken, onder meer via de On Route app.

Quinn Mail werd in het helpcentrum als pilot omschreven; aanmelden ging via quinnmail@blinqx.tech. Controleer bij Blinqx wat de actuele status en kosten zijn.

## Quinn Mail instellen en gebruiken

- Voor koppelen, taken aanmaken en antwoorden (reply) zijn aparte instellingen; je zet per onderdeel aan wat je wilt gebruiken.
- Automatisch koppelen gebeurt op basis van onder meer persoonsgegevens, organisatiegegevens, dossiernummer, productnummer, objectgegevens, schadenummer of factuurnummer in de mail.
- Taken worden automatisch aangemaakt als de instelling aan staat, de mailbox in de e-mailmanager op automatisch taken aanmaken staat en de mail aan een dossier met een behandelaar is gekoppeld.
- Staat automatisch taken aanmaken voor een mailbox uit, dan verschijnt boven de mail een blok om op basis van AI een taak te maken, met voorgestelde actie, verantwoordelijke en startdatum.
- Het conceptantwoord is een voorstel: lees het na, pas het aan en verstuur het zelf.

## Mail zonder Quinn: de basis

- Mailboxen beheer je via Beheer, E-mail, E-mailmanager. Je kunt IMAP, POP3 of Microsoft 365 gebruiken; voor Microsoft 365 geef je eBlinqx toestemming om ook op de achtergrond te synchroniseren.
- Mail van een afzender wiens adres in een dossier staat, wordt automatisch aan dat dossier gekoppeld. Mail die je vanuit het dossier verstuurt, ook.
- Handmatig koppelen doe je met het koppelteken boven het bericht; bijlagen koppel je los of allemaal tegelijk via het paperclipicoon. Pdf-bijlagen kun je daarbij samenvoegen of splitsen.
- Komt er geen mail meer binnen, kijk dan in de e-mailmanager. Staat het interval op "Geen" met foutmeldingen, gebruik dan de knop om de serverinstellingen te testen, herstel zo nodig gebruikersnaam of wachtwoord en zet het interval weer op 5 minuten.

## Gespreksopnames omzetten naar acties

- Onder het tabblad Communicatie staat het onderdeel Gespreksopname. Daar start je een opname of upload je een opname van je telefoon (mp3, mp4, wav, webm of ogg).
- Opnames tot maximaal 2 uur worden omgezet naar een transcript. Bij langere opnames is omzetten en vervolgacties niet mogelijk.
- Via de workflowpijl kun je een conceptmail met samenvatting maken, de samenvatting als registratie opslaan of taken aanmaken.
- Neem een gesprek alleen op als de klant daarvan op de hoogte is en bewaar transcripten volgens je eigen AVG-beleid.

## Taken, workflows en behandelaar

- Een taak kan persoonlijk zijn of een groepstaak voor een workflowgroep. Iedereen in de groep ziet de taak en kan hem oppakken; je kunt direct een verantwoordelijke uit de groep kiezen. Bij een groepstaak is het kiezen van een workflowgroep verplicht.
- Een nieuwe workflowgroep vraag je aan bij support-eblinqx@blinqx.tech, met de naam en de leden.
- Het veld Behandelaar in een product bepaalt bij veel workflows wie de taak krijgt. Via Beheer, Koppelingen, Advisor support relatie stel je een voorkeursdossierverantwoordelijke in die bij nieuwe producten automatisch wordt ingevuld.

## Dossiers, agenda en onderweg

- Zoek altijd eerst via het dashboard (achternaam, straat, postcode) voordat je een nieuw dossier maakt, om dubbele dossiers te voorkomen. Kies bij aanmaken het juiste dossiertype en kantoor.
- Bij een organisatie kun je naam en adres ophalen met het KvK-nummer; de kosten daarvan lopen via zkr.
- De agenda kan synchroniseren met Microsoft 365 of met Google Agenda, niet met beide tegelijk. Afspraken van vóór het koppelen worden niet overgezet.
- De gratis On Route app (iOS en Android) geeft onderweg toegang tot dossiers, mail, taken, agenda en gespreksopname. Vervolgacties op een opname doe je in eBlinqx zelf.

## Standaardteksten, campagnes en selecties

- Standaardteksten beheer je centraal en gebruik je in mails, brieven, campagnes en facturen. Met tags vult eBlinqx dossiergegevens automatisch in.
- Met de campagnemodule verstuur je een mailing, sms of brief naar een grote groep; een campagne kan ook op een csv-bestand gebaseerd zijn.
- De SMART-module filtert klantselecties (bijvoorbeeld klanten met een aflossingsvrije hypotheek) en laat je daarop taken, campagnes, events of een Excel-export maken. Per selectie zie je welke acties door wie zijn uitgevoerd.
- Rapportages kun je filteren met persoonlijke selecties en downloaden naar Excel.

## Praktische tips

- Laat AI-voorstellen nooit ongezien de deur uit: Quinn bereidt voor, jij blijft verantwoordelijk voor het advies en de klantcommunicatie.
- Leg mailboxinstellingen per team vast (wie mag wat, welke mailbox maakt automatisch taken), zodat taken niet dubbel ontstaan.
- Volg de release notes op support.fasterforward.nl: functies en menupaden veranderen regelmatig.`},

 {id:'k51',cat:'adv',titel:'eBlinqx: polis- en schadebeheer en berichtenverkeer (ADN, HDN)',auteur:'u6',datum:'2026-10-02T23:00:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'eBlinqx ADN Aplaza prolongatie mutatie mutatievoorstel mutatieconflict POR-codes provisie marges tussenpersoonincasso maatschappijincasso bedrijfscertificaat Solera schademelding schadedossier HDN AX OX DA SX Hypotheekadvies Fastlane Adviesbox Figlo Findesk Ockto Uwkluis Digimap',
  links:[{titel:'ADN Module gebruiken',url:'https://support.fasterforward.nl/kennisbank/1-prolongatie-import/'},{titel:'ADN berichten ontvangen (inrichten)',url:'https://support.fasterforward.nl/kennisbank/adn-berichten-ontvangen/'},{titel:'Mutatievoorstellen aanmaken',url:'https://support.fasterforward.nl/kennisbank/mutatievoorstellen-aanmaken/'},{titel:'Schademelding aanmaken en verwerken',url:'https://support.fasterforward.nl/kennisbank/schademelding-aanmaken-en-verwerken/'},{titel:'Inkomende en uitgaande HDN berichten verwerken',url:'https://support.fasterforward.nl/kennisbank/hdn-inbox/'},{titel:'Adviespakketten gekoppeld aan eBlinqx',url:'https://support.fasterforward.nl/kennisbank/welke-adviespakketten-koppelt-eblinqx/'},{titel:'Ockto koppeling gebruiken en instellen',url:'https://support.fasterforward.nl/kennisbank/ockto-koppeling/'}],
  body:`Een groot deel van het werk in eBlinqx draait om berichten van en naar verzekeraars en geldverstrekkers. Dit artikel zet de belangrijkste stromen op een rij: ADN en Aplaza voor schadeverzekeringen, HDN voor hypotheken en de koppelingen voor brondata.

## ADN en Aplaza: prolongaties en mutaties ontvangen

- Via ADN (postbus) of Aplaza (EMS-mailbox) ontvangt eBlinqx prolongatie- en mutatieberichten van verzekeraars.
- Voor beide heb je een bedrijfscertificaat van Solera nodig. Dat is een jaar geldig; na verlenging laat je het nieuwe certificaat via support-eblinqx@blinqx.tech in eBlinqx vervangen. Stuur certificaat en wachtwoord nooit samen in één mail.
- Om prolongaties te kunnen verwerken moeten de POR-codes onder de juiste organisatie in eBlinqx staan.
- Op het dashboard toont het blok met binnengekomen berichten hoeveel ADN-berichten actie vragen.

## Een batch verwerken

- eBlinqx matcht polissen op polisnummer, neemt provisie over, maakt controlejournaalposten aan en verwerkt de mutatiegegevens.
- Zodra de batch de status heeft dat de mutatiegegevens zijn ingelezen, werk je hem verder af in de ADN-module.
- Een batch kun je pas afronden als alle mutatieconflicten zijn opgelost.
- Na afronding wordt financieel geboekt: de posten komen als één bedrag op de rekening-courant van de verzekeraar.

## Mutatievoorstellen en conflicten

- Bespreek je een wijziging met de klant en vraag je die aan bij de verzekeraar, leg dan in de polis een mutatievoorstel vast.
- Komt de mutatie later via ADN of Aplaza binnen, dan vergelijkt eBlinqx die met jouw voorstel. Verschillen verschijnen als mutatieconflict.
- Bij verwerking van ADN- en Aplaza-berichten (bijvoorbeeld een verlenging op de hoofdpremievervaldatum) maakt eBlinqx ook zelf mutatievoorstellen aan.

## Provisie en marges

- Wijkt de provisie van de verzekeraar af van wat eBlinqx verwacht, dan zie je dat op het tabblad met verschillen (rood rekenmachine-icoon).
- Door een procentuele of absolute marge in te stellen zie je alleen de verschillen die er echt toe doen.
- Voor tussenpersoonincasso en maatschappijincasso zijn aparte verwerkingsstappen en handleidingen in het helpcentrum.

## Schadebeheer

- Een schademelding maak je vanuit de schadeverzekering in het klantdossier: via het snelmenu of het tabblad Schademelding met de plusknop.
- Op de schadekaart leg je alle gegevens vast; daarna volg je de workflow om de schade af te handelen.
- Documenten, zoals foto's of een expertiserapport, voeg je toe onder de schademelding op het tabblad Documenten.
- Uitbetalingen aan klant of derden en verrekening met openstaande premie verwerk je via de financiële schadeverwerking.

## HDN: hypotheekaanvragen

- Berichttypen die je tegenkomt: AX (aanvraag), OX (offerte), DA (documenten- of stukkenlijst) en SX (status).
- Vanuit Hypotheekadvies (voorheen Fastlane Advies) stuur je de berekening naar eBlinqx; de aanvraag komt binnen in de HDN-inbox op het dashboard en gaat van daaruit naar de geldverstrekker.
- Na de offerte (OX) vergelijkt eBlinqx die met de aanvraag (AX) en meldt afwijkingen. Controleer die altijd voordat je de offerte met de klant bespreekt.

## Adviespakketten en brondata

- Adviesbox en Adviesbox Online: je maakt vanuit eBlinqx een HBX-bestand met klantgegevens, werkt het advies uit en stuurt de aanvraag terug naar eBlinqx.
- Figlo Hypotheken en DIAS Advies werken in twee richtingen via het tabblad Export. Bij Findesk gaat het dossiernummer mee, zodat de terugkoppeling in het juiste dossier landt.
- Ockto: je maakt eerst een klantportaal (Digimap of Uwkluis) aan; de klant scant een QR-code, haalt zijn gegevens op en deelt ze. De data komen in eBlinqx en kun je doorsturen naar je adviespakket.
- Uwkluis wordt door Blinqx ingericht; daarna authenticeer je de koppeling eenmalig zelf. Vanuit Uwkluis kun je brondata opvragen via Veilig Ophalen of Ockto, en documenten laten tekenen met een digitaal vinkje of een digitale handtekening.
- Per document en product bepaal je met een aan/uit-knop wat de klant in het portaal ziet.
- PortefeuilleSignalen (van De Nationale Hypotheekbond) levert signalen over oversluiten, renteverlaging en verhuizers in je portefeuille.

## Praktische tips

- Plan het verlengen van het Solera-certificaat ruim op tijd; een verlopen certificaat stopt de berichtenstroom.
- Werk ADN-batches dagelijks af; openstaande conflicten blokkeren de financiële verwerking.
- Veel koppelingen zet je aan via een mail aan support-eblinqx@blinqx.tech; vraag daarbij naar eventuele extra kosten.`},

 {id:'k52',cat:'adv',titel:'eBlinqx: inloggen, gebruikers, beveiliging en AVG',auteur:'u6',datum:'2026-10-02T23:00:00',herzienVoor:'2027-04-02',bron:null,gecontroleerd:false,
  kw:'eBlinqx inloggen two factor authentication 2FA MFA Google Authenticator wachtwoord resetten gebruikers aanmaken rechten mutatiebevoegd dossierhistorie AVG verwijderen export Wwft zkr iDIN PEP sanctiecheck support storing status',
  links:[{titel:'Two factor authentication',url:'https://support.fasterforward.nl/kennisbank/two-factor-authentication/'},{titel:'Wachtwoord en MFA resetten',url:'https://support.fasterforward.nl/kennisbank/wachtwoord-en-two-factor-authentication-mfa-resetten/'},{titel:'Rechten aan laten passen',url:'https://support.fasterforward.nl/kennisbank/rechten-aan-laten-passen/'},{titel:'AVG en eBlinqx, veel gestelde vragen',url:'https://support.fasterforward.nl/kennisbank/avg-en-eblinqx-veel-gestelde-vragen/'},{titel:'Klanten verifiëren en controleren met zkr.',url:'https://support.fasterforward.nl/kennisbank/klanten-verifieren-met-debiteurenzeker/'},{titel:'Supportbeleid',url:'https://support.fasterforward.nl/supportbeleid/'}],
  body:`Een kantoorsysteem vol klantdata vraagt om strak toegangsbeheer. Dit artikel beschrijft hoe inloggen, gebruikersbeheer en de privacyfuncties in eBlinqx werken, en wat je doet bij een storing.

## Inloggen met tweestapsverificatie

- eBlinqx vraagt naast gebruikersnaam en wachtwoord een verificatiecode uit een authenticator-app (het helpcentrum noemt Google Authenticator).
- Bij de eerste keer inloggen scan je een QR-code; daarna geeft de app een persoonlijke code die steeds ververst.
- Nieuwe telefoon? Dan moet de koppeling worden gereset. Dat kan je eBlinqx-beheerder doen of de support van Blinqx.

## Wachtwoorden

- Je eigen wachtwoord wijzig je via Mijn instellingen (icoon rechtsboven); eBlinqx kan een sterk wachtwoord voor je genereren.
- Standaard vraagt eBlinqx elke drie maanden om een nieuw wachtwoord en gelden er eisen aan de sterkte.
- Beheerders kunnen wachtwoord en MFA per gebruiker resetten via Gebruikers, tabblad Overzicht, of via de persoon zelf.

## Gebruikers en rechten

- Beheerders binnen het kantoor maken zelf gebruikers aan en verwijderen ze. Bij aanmaken kies je een gebruikerstemplate of neem je de rechten van een bestaande gebruiker over.
- Rechten aanpassen of extra rechten toekennen kun je niet zelf: dat doet Blinqx op verzoek. Alleen de bij Blinqx bekende mutatiebevoegde personen van je organisatie kunnen dat aanvragen, met een duidelijke omschrijving, via support-eblinqx@blinqx.tech.
- Ruim accounts van vertrokken medewerkers direct op en loop periodiek na wie welke rechten heeft.

## AVG en dossierhistorie

- Onder de dossieropties staat de dossierhistorie: wie het dossier heeft geopend, waarheen het is verstuurd en bij welke partijen gegevens zijn opgehaald.
- Klantdossiers kunnen volledig worden verwijderd en klantgegevens kunnen worden geëxporteerd, bijvoorbeeld voor een verzoek om dataportabiliteit. Vragen hierover stel je aan support-eblinqx@blinqx.tech.
- Stel bewaartermijnen vast in je eigen privacybeleid; de software voert uit, jij beslist.

## Klantidentificatie (Wwft)

- Via zkr. (voorheen DebiteurenZeker) kun je klanten identificeren en controleren: iDIN via de bank, een foto van het identiteitsbewijs met echtheidscontrole, identificatie met selfie, en een PEP- en sanctiecheck.
- Dat kan bij een nieuw dossier en voor bestaande dossiers, ook voor meerdere tegelijk.
- Een PEP- en sanctiecheck kan ook via Hyarchis.

## Support en storingen

- Blokkerend probleem: bel de support (085 018 00 69, op werkdagen). Niet urgent: mail support-eblinqx@blinqx.tech. Oudere artikelen noemen nog nummers en adressen van Faster Forward; de supportpagina van Blinqx is leidend.
- Geef bij een melding een schermafdruk, de url van de pagina en de stappen die je deed.
- Actuele storingen worden gemeld op status.fasterforward.nl.

## Praktische tips

- Zet tweestapsverificatie voor iedereen aan, ook voor tijdelijke krachten.
- Leg vast wie in je organisatie mutatiebevoegd is richting Blinqx en houd die lijst actueel.
- Controleer na een release of je rechten en instellingen nog kloppen.`},
 {id:'k310',cat:'adv',titel:'Fastlane (eBlinqx Hypotheekadvies): release oktober 2026 in het kort',auteur:'u6',datum:'2026-10-20T12:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'Fastlane eBlinqx Hypotheekadvies release oktober 2026 releasenotes vooraankondiging erfpacht HDN financieringsopzet inkomen vermogen AI-teksten funderingsrisico taxatie Maximus Private Lease Ockto brondata overbrugging meeneemregeling',
  links:[{titel:'Releasenotes Fastlane (Hypotheekbond)',url:'https://fastlane.hypotheekbond.nl/hoe-het-werkt/releasenotes/'},{titel:'Releasenotes Blinqx Verzekering & Hypotheek',url:'https://verzekeringhypotheek.blinqx.tech/releasenotes'},{titel:'Blinqx bundelt hypotheeksoftware in eBlinqx Hypotheekadvies (InFinance)',url:'https://infinance.nl/ondernemen/ict/blinqx-bundelt-hypotheeksoftware-in-eblinqx-hypotheekadvies/'}],
  body:`Dit is een samenvatting in eigen woorden van de vooraankondiging van de Fastlane-release van oktober 2026 (141 wijzigingen: 113 functioneel, 28 technisch). Volgens de aankondiging staat de livegang gepland op woensdag 21 oktober 2026 omstreeks 21:30. De aankondiging is onder voorbehoud: de definitieve samenstelling kan nog wijzigen. Gebruik na de livegang de officiële releasenotes als bron.

## Let op bij het gebruik van deze pagina

- Dit is geen officiële releasenote en komt niet van Blinqx. De volledige lijst met ticketnummers staat in de releasenotes van Fastlane en Blinqx (zie de links).
- Controleer na de release in je eigen omgeving wat er echt is veranderd voordat je een werkinstructie of adviesrapport aanpast.
- Een gewijzigde berekening of tekst in het adviesrapport raakt je zorgplicht: leg vast vanaf welke datum je met de nieuwe versie hebt gewerkt.

## Inkomen en vermogen

- Een tijdelijk inkomen vervalt nu correct op de einddatum.
- Het AOW-bedrag in de inventarisatie kun je handmatig aanpassen; de eindleeftijd van een wezenpensioen is instelbaar.
- Het netto maandinkomen is zichtbaar en voor loondienst geldt een maximum van 50 uur per week.
- Banksparen is opgenomen in het scherm Vermogen, met een veld voor maandelijkse inleg; bij een rekening voegt Fastlane de maatschappij automatisch in op basis van de IBAN.
- Dubbele import van inkomen en pensioen is verholpen. Opslaan wordt geblokkeerd bij een leeg rekeninkomen.
- Brondata-inkomen wordt gebruikt voor de maximale hypotheekberekening.

## Financieringsopzet, berekening en toetsing

- Verbeteringen bij dubbele lasten bij overbrugging, het tarief overdrachtsbelasting en de rente bij een meeneemhypotheek.
- Een signalering verschijnt als de klant over 10 jaar de AOW-leeftijd bereikt; de fiscale looptijd van een leningdeel is begrensd op 30 jaar.
- Bij een variabele rentevastperiode toont het totaalscherm "Variabel" en de toetsrente wordt overal met 3 decimalen getoond.
- Bij het splitsen van een meegenomen leningdeel kan het afgesplitste deel dezelfde meeneemrente en resterende looptijd houden.
- De sectie Fiscaliteiten bij het bewerken van een leningdeel is nieuw.

## Brondata en inventarisatie

- Bij het vergelijken van brondata staan oude pensioengegevens nu aan beide kanten; de betaalrekening voor de hypotheek wordt automatisch gekozen als er maar één is. De geldigheid van brondata is 90 dagen.
- Het afgifteland van een identiteitsbewijs staat standaard op Nederland.
- Het woningenoverzicht toont verkoopstatus en te verwachten overbrugging, met een totaalregel.

## Adviesrapport en motivatie

- Het oriëntatierapport kan de hypotheekverklaring uit de tekstenbibliotheek bevatten en vermeldt de rekendatum van het verantwoord hypotheekbedrag.
- Bij een woning met status "inwonend" noemt het rapport geen "huidige woning" meer; persoonlijke gegevens bevatten ook burgerlijke staat, titel verplichtingen en kinderen.
- Teksten over NHG, toetsmomenten bij overschrijding van de norm en de draagplichtovereenkomst zijn gecorrigeerd. In de vergelijking van geldverstrekkers is de premie voor Blijven wonen uit het bruto maandbedrag gehaald.

## HDN-aanvraag

- Nieuwe notificatie bij een ontbrekende einddatum rentevaste periode, correcte prefill bij twee aanvragers en een DGA, en een nieuwe kolom Type/Productlijn.
- Voor ING geldt een validatie op maximaal 4 leningdelen. Het menu-item "HDN-aanvrager" heet "Aanvragen" en er is een kolom "Voorbereid op".
- Het inkomen kun je opnieuw inladen vanuit de inventarisatie.

## Verzekeringen

- Verbeteringen bij de overlijdensrisicoverzekering op twee levens (premieweergave, notificaties bij Centraal Beheer, Allianz-switch), een nieuw scherm om per verzekering "aflossen" of "inkomen aanvullen" te kiezen, en de bruto-variant bij woonlastenverzekering.
- De inkomensbescherming rekent alleen op looninkomen uit dienstverband.

## Erfpacht, onderpand en taxatie

- Uitgebreide erfpachtvelden (lopend, eeuwigdurend, afgekocht of af te kopen), ook in de HDN-aanvraag, met een correcte berekening van het toetslastverschil. De vraag staat standaard op Nee.
- De sidebar Onderpand is heringedeeld. Een taxatieaanvraag kan rechtstreeks bij Maximus Taxaties worden ingediend.
- Een funderingsrisicocheck op adresniveau op basis van publieke bronnen is toegevoegd. Dit sluit aan op het funderingsvoorbehoud dat sinds 1 juli 2026 in de branchebrede koopovereenkomst staat. Het is een hulpmiddel bij het gesprek, geen oordeel over de fundering.

## AI-teksten

- Bij AI-teksten kun je extra instructies meegeven, zelf een tekst corrigeren en met duimpjes feedback geven. Een AI-tekst blijft een concept: de adviseur is verantwoordelijk voor de inhoud van het advies en leest het altijd na.

## Overig

- Aegon vervalt als veld "Rentekortingen"; HollandWoont wordt alleen getoond bij NHG-hypotheken. Private Lease wordt als maandlast meegenomen. Verplichtingen worden per aanvrager en gezamenlijk getoond.
- Je kunt een standaard geldverstrekker en productlijn instellen.
- Er zijn 28 technische verbeteringen: vernieuwde formuliertechniek zonder gedragswijziging, extra beveiliging van de hypotheekberekeningsservice en herstel van storingen (koppeling met verzekeraars, brondata-documenten, HDN-formulier versturen).

## Eerdere releasenotes (openbaar)

- Releasenotes 2025: onder meer het verwijderen van commerciële rentes (alleen wijzigingen op het moment van ingang), automatische overgang naar de tabellen van 2026 per 1 januari 2026, toetsrente uit het gewogen gemiddelde en een WW-scenario voor DGA\'s (IT-27982).
- Releasenotes 2026: de nieuwe financieringslastnormen 2026 van het Nibud zijn verwerkt en handmatig ingebrachte eigen middelen blijven behouden als andere onderdelen wijzigen (IT-28259). Er zijn nieuwe menunamen aangekondigd ter voorbereiding op een vernieuwde opzet eind 2026.
- Het product heet sinds de bundeling van Blinqx eBlinqx Hypotheekadvies; de tab Fastlane is in de omgeving hernoemd naar Hypotheekadvies.`},
 {id:'k311',cat:'adv',titel:'eBlinqx release 20 oktober 2026: dataverbruik, e-mailboxen, schadeverzekering en taken',auteur:'u6',datum:'2026-10-20T14:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'eBlinqx release 20 oktober 2026 dataverbruik managementinformatie opslag IP-adres uitloggen klantportaal IMAP POP3 Office365 e-mailmanager authenticeren allen beantwoorden collectiviteit premiebetaler takenoverzicht kantoor SEPA AI e-mail dossier Finly API',
  links:[{titel:'Release 20 oktober 2026: inzicht dataverbruik en verbeteringen Klantportaal, e-mail en inloggen (support.fasterforward.nl)',url:'https://support.fasterforward.nl/inzicht-dataverbruik-en-verbeteringen-klantportaal-e-mail-en-inloggen/'},{titel:'Managementinformatie (support.fasterforward.nl)',url:'https://support.fasterforward.nl/kennisbank/managementinformatie/'},{titel:'Systeemstatus eBlinqx',url:'https://status.fasterforward.nl/'}],
  body:`Samenvatting in eigen woorden van de releasebeschrijving van eBlinqx (kantoorsysteem van Blinqx Verzekering & Hypotheek) van dinsdag 20 oktober 2026. Het bericht is op 16 oktober 2026 geplaatst op de supportsite. Dit is geen officiële releasenote; lees het bronbericht voor de actuele details en controleer na de release wat er in jouw omgeving is veranderd.

## Inloggen en beveiliging

- Je wordt niet meer automatisch uitgelogd als alleen je IP-adres wisselt, bijvoorbeeld in het buitenland of via een hotspot. Wisselen het IP-adres én de omgeving of de gebruiker, dan word je om veiligheidsredenen nog wel uitgelogd.
- Tip voor je kantoor: dit is een gemak, geen reden om de tweestapsverificatie of je beleid voor thuiswerken en openbare netwerken te versoepelen.

## Inzicht in dataverbruik

- In Managementinformatie zie je het dataverbruik van bestanden en e-mail, dus hoeveel opslag je omgeving gebruikt. Ook bestanden die je niet als document ziet, zoals HDN- en ADN-berichten, tellen mee.
- Het overzicht wordt elke maand op de 28e bijgewerkt. Je ziet het alleen met het juiste recht en als beheerder. Ontbreekt de module Totale opslag, vraag dan toegang aan via de support van Blinqx.

## Klantportaal

- Pas je in eBlinqx de naam van een stuk aan, dan wordt die naam ook gesynchroniseerd naar het verzoek in het Klantportaal, zodat beide gelijk blijven.

## E-mail

- Een mailbox van het type IMAP of POP3 kun je zelf omzetten naar Office365 via een knop in de e-mailmanager. Voorheen deed Blinqx dat met een script. Na de omzetting moet je de mailbox opnieuw authenticeren; eerder binnengekomen e-mail blijft zichtbaar. Het hosten van de adressen bij Microsoft regelt je eigen ICT-beheerder; gebruik de knop pas als dat is gebeurd.
- Authenticeren, opnieuw authenticeren en de authenticatie intrekken kan nu ook in de e-mailmanager, door de beheerder zelf.
- In een reply schakel je met één klik over naar "Allen beantwoorden" als je per ongeluk op "Beantwoorden" klikte.
- De kenmerken waarmee AI een e-mail aan het juiste dossier koppelt zijn uitgebreid. Controleer de koppeling altijd zelf: een AI-koppeling is een hulpmiddel, geen zekerheid. Een mail bij een verwijderd dossier is weer te openen.

## Schadeverzekering

- In de productkaart kun je collectiviteit vastleggen, met collectiviteitsnummer, naam en percentage. De velden hebben tags, staan in de API en worden gevuld uit het ADN-bericht als de verzekeraar ze meestuurt in het AFD-bericht.
- Je kunt een premiebetaler kiezen in de productkaart (ook in "Overige partij"). Dit geldt ook voor andere productkaarten met dat veld.

## Taken en administratie

- In het takenfilter kun je meerdere personen of workflowgroepen tegelijk selecteren, ook op dossierniveau. Zonder selectie zoek je op alle groepen en personen.
- Het algemene takenoverzicht heeft een filter Kantoor (alleen als de instelling aanstaat; relevant voor omgevingen met meerdere deelnemers).
- Per producttype kun je een standaardadministratie instellen, ook voor producten die via HDN, Aplaza, handmatig of API worden aangemaakt. Beheerders vragen de module aan via support.

## Overig

- Het SEPA-bestand wordt na het genereren bewaard, zodat je het opnieuw kunt downloaden zonder dat het opnieuw wordt opgebouwd; het bevat nu een gestructureerd adres.
- Het premieblok van een levensverzekering kan via de API worden gevuld; via de API maak je ook een stukkenlijst en losse stukken in het klantdossier aan.
- Het Finly-formulier vult zakelijke klantgegevens uitgebreider voor (IBAN, contactpersoon, directeur). Controleer deze gegevens op juistheid voordat je een zakelijk klantdossier gebruikt voor advies of identificatie.
- Beheerdersmeldingen kun je negeren met een knop. Verder is de onderliggende softwaretechniek vernieuwd, zonder zichtbare wijziging, ook voor koppelingen en exports.

## Aandachtspunten voor je kantoor

- Leg vast per wanneer je met de nieuwe versie werkt en controleer je werkinstructies als je de e-mailmanager, het takenoverzicht of de standaardadministratie gebruikt.
- Een storing of vertraging meld je via de support van Blinqx; de actuele status staat op de statuspagina.`},
 {id:'k312',cat:'adv',titel:'Fastlane (eBlinqx Hypotheekadvies): releases augustus en september 2026',auteur:'u6',datum:'2026-10-20T15:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'Fastlane eBlinqx Hypotheekadvies releasenotes augustus september 2026 klantprofiel AdviesCoach AFM Leidraad energielasten onderhoudskosten eigenaarslasten netto hypotheeklasten rapportage samenstellen brondata actualiseren verplichte velden Zurich ORV Allianz TAF HDN erfpacht',
  links:[{titel:'Releasenotes Fastlane 2026 (Hypotheekbond)',url:'https://fastlane.hypotheekbond.nl/hoe-het-werkt/releasenotes/releasenotes-2026/'},{titel:'AFM Leidraad hypotheekadvisering',url:'https://www.afm.nl/nl/sector/adviseurs-bemiddelaars/themas/hypotheken'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van Fastlane (eBlinqx Hypotheekadvies) van augustus en september 2026. Het is geen officiële releasenote; de brontekst is leidend. Per wijziging staat het ticketnummer erbij.

## Compliance: let op de AFM Leidraad

- In de release van 9 september 2026 zijn energielasten, onderhoudskosten van de woning en overige eigenaarslasten opgenomen in het consumptief besteedbaar inkomen (IT-30415, IT-30417, IT-30419, IT-33019). De term "Netto woonlasten" heet nu overal "Netto hypotheeklasten" (IT-33161). De berekening van woonquote en toetslast verandert hierdoor niet.
- Wat dit voor jouw advies betekent, bepaal je zelf. Leg vast vanaf welke datum je met de nieuwe weergave werkt en pas je adviesmotivatie en klantcommunicatie aan als je kantoor de oude term of de oude opbouw gebruikt.

## Release 9 september 2026 (34 wijzigingen)

- **Klantprofiel (beta):** je komt direct op de keuze Vooringevuld of Blanco (IT-32766); de terugval bij life events (arbeidsongeschiktheid, werkloosheid, overlijden partner, einde relatie, AOW) is meteen gevuld zonder eigen berekening (IT-32812); je kunt een blanco klantprofiel als pdf downloaden (IT-32213). Netto inkomen, aflosvormen en bekendheid met financiële begrippen worden vooringevuld uit de inventarisatie (IT-32821, IT-32957, IT-32992). Je kunt elke waarde overschrijven.
- **Vragen en antwoordopties:** de antwoordoptie Anders vervalt bij elf vragen (IT-32904), de verplichte toelichting bij kennisachterstand vervalt (IT-32933) en gekozen uitgavencategorieën blijven bewaard (IT-32931). Bestaande antwoorden blijven leesbaar.
- **AdviesCoach (eerste stap):** vergelijkt in de adviesmotivatie het klantprofiel met het advies en geeft per onderdeel een signaal (Matcht, Aandacht vereist, Niet van toepassing, Niet te beoordelen). Het blokkeert niets en geeft geen oordeel (IT-32963). De signalering is een hulpmiddel; de adviseur blijft zelf verantwoordelijk voor het advies.
- **Berekening en inventarisatie:** een bestaande berekening actualiseren op gewijzigde leningdeelbedragen, inclusief tussentijdse aflossing (IT-30196); ouderdomspensioen staat bij brondata op de juiste plek (IT-31639).
- **Rapportage:** opgeschoonde hoofdstukkenlijst en een voorblad per rapportsectie (IT-32955); de ingangsdatum van de rentewijziging staat in de vergelijking en de lijst (IT-29855).

## Release 26 augustus 2026 (30 wijzigingen)

- **Klantprofiel voorinvullen:** huidige woonsituatie, woonlasten, leningen en verplichtingen (alleen het type), spaargeld, voorzieningen van de werkgever en loondoorbetaling bij ziekte worden automatisch gevuld (IT-32216 t/m IT-32224). De terugval in besteedbaar inkomen staat bij de risicoscenario's in een gele balk (IT-32230).
- **Rapport samenstellen:** vier vaste secties (Samenvatting, Adviesrapport, Inventarisatie, Bijlagen), vijf standaardrapporten en een onthouden eigen indeling (IT-32205, IT-32829).
- **Brondata overnemen en actualiseren:** de naam van de geldverstrekker komt mee bij het overnemen van een verplichting; het schuldenaarschap van een hypotheek volgt de leninggegevens, niet het eigendom van de woning; je kiest zelf welk inkomen meetelt voor het rekeninkomen; per veld kies je wat je actualiseert, met een kolom Verschil (IT-32464, IT-31634, IT-31638, IT-32608).
- **Verplichte velden:** een rood sterretje bij elk verplicht veld in alle dossierformulieren, ook hoorbaar voor schermlezers (IT-32656 t/m IT-32813).
- Techniek: meting van het AI-gebruik, foutmonitoring, geen dubbele opslag van brondata meer.

## Release 12 augustus 2026

- **Inventarisatie:** einddatum legitimatiebewijs wordt weer aangevuld, afgifteplaats klopt, eigendomspercentage blijft bij de juiste persoon als je aanvrager en partner omdraait, Belgische en Duitse postcodes worden geaccepteerd bij woningen (IT-31032, IT-31644, IT-32237, IT-32548).
- **Inkomen en brondata:** decimalen bij uren per week; rekeningen worden bij het inlezen aan de juiste persoon toegewezen; fout bij het opslaan van een werkgeversadres is verholpen (IT-30788, IT-31626, IT-32311).
- **Verzekeringen:** Zurich ORV (TAF Personal Zurich en TAF Special Zurich) is beschikbaar via HDN (IT-30120). Allianz ORV wordt bij een gelijktijdige hypotheek getoond tot € 750.000 en anders tot € 500.000 (IT-32024). De standaard uitkeringsduur bij werkloosheid staat op 12 maanden in plaats van 24 (IT-31973).
- **Berekenen en vergelijken:** bij een SpaarGerust-leningdeel gebruikt de vergelijking de werkelijke einddatum (IT-32106); bij "Wonen nu" telt de spaarpremie van banksparen mee (IT-32255); de kleur van de samenvatting klopt met de grafiek bij toetslast rond de AOW (IT-32253).
- **Financieringsopzet:** keuze tussen koopsom en marktwaarde als grondslag voor overdrachtsbelasting (IT-31995); een handmatig consumptief bedrag blijft bewaard (IT-32388).
- **HDN:** het veld Verkoop onder voorwaarden constructie wordt leeggemaakt als je Nee kiest (IT-32362).

## Praktische tips

- Controleer na elke release in je eigen omgeving of berekeningen, rapportages en werkinstructies nog kloppen.
- Een veranderde term of berekening in het adviesrapport raakt je zorgplicht: leg vast vanaf wanneer je met de nieuwe versie werkt.`},
 {id:'k313',cat:'adv',titel:'Fastlane (eBlinqx Hypotheekadvies): releases juni en juli 2026',auteur:'u6',datum:'2026-10-20T16:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'Fastlane eBlinqx Hypotheekadvies releasenotes juni juli 2026 adviesrapport overdrachtsbelasting overbruggingshypotheek ORV Scildon Allianz TAF HDN AI-adviessamenvatting klantprofiel regulations 1 juli 2026 Credit Life Mx aanhef',
  links:[{titel:'Releasenotes Fastlane 2026 (Hypotheekbond)',url:'https://fastlane.hypotheekbond.nl/hoe-het-werkt/releasenotes/releasenotes-2026/'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van Fastlane (eBlinqx Hypotheekadvies). Het is een selectie van wat een adviseur in de praktijk merkt, geen officiële releasenote; de brontekst is leidend. Per wijziging staat het ticketnummer. Controleer na een release altijd in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Juli 2026 (release 16 juli, 49 wijzigingen)

- **Adviesrapport:** meerdere onderpanden, lopende hypotheken, verwachte verkoopopbrengsten en overbruggingen tegelijk in het rapport (IT-24098); renteblad en hypotheekvoorwaarden van de gekozen geldverstrekker als bijlage, per bijlage te kiezen (IT-31547); compactere opmaak (IT-28396); nummering leningdelen klopt weer met het scherm (IT-31166).
- **Berekening en financieringsopzet:** overdrachtsbelasting per persoon over het eigen aandeel bij twee kopers met een ongelijke eigendomsverhouding (IT-31255); een leningdeel met status Vervallen bevriest het schuldverloop en "schuldrest" heet nu "Aflosstand" (IT-30775); grafiek Bruto maandlast sluit aan op de financiële analyse (IT-31778).
- **Verzekeringen:** een maandelijkse onttrekking bij een ORV rekent met 0% rekenrente (IT-31682); een onverklaard restbedrag in de staafdiagrammen bij AO en ORV is weg (IT-31730).
- **Klantprofiel:** meerdere doelstellingen tegelijk kiezen (IT-25806); AOW-vraag vervangen door "jonger dan de AOW-leeftijd" of "met (pre)pensioen" (IT-27781); kortere vraagflow (IT-31377).
- **Inkomen:** onmogelijke datums en een einddatum vóór de begindatum worden geweigerd (IT-31913).
- **HDN:** bij een mislukte verzending van een ORV- of hypotheekaanvraag zie je de foutmelding en oorzaak in plaats van "klaar om te verzenden" (IT-31880, IT-31881).
- **Brieven en instellingen:** aanhef "Mx." voor genderneutrale personen (IT-31473); de AFM-tekst in het adviesrapport staat nu altijd aan (IT-31573).
- **AI-adviessamenvatting (beta):** knop om automatisch een adviessamenvatting te genereren, met beta-label en disclaimer (IT-31588, IT-31959). Een AI-tekst blijft een concept: lees en corrigeer altijd zelf, jij blijft verantwoordelijk voor het advies.
- Techniek: formulieren gemigreerd naar een modernere opzet en mislukte achtergrondtaken worden opnieuw uitgevoerd.

## Juni 2026 (releases 16, 29 en 30 juni)

- **Normen en regelgeving:** de ingebouwde fiscale parameters en wettelijke regels zijn bijgewerkt naar de stand van 1 juli 2026 (IT-31541). Controleer of je lopende berekeningen hierdoor veranderen.
- **Berekening:** restschuld einde rentevaste periode en netto maandinkomen in de Wonen-schermen komen overeen met de financiële analyse (IT-31375, IT-31452); de grafiek "binnen 10 jaar van de AOW-datum" toont ook de einde-RVP-momenten per leningdeel (IT-31326); geen extra leningdeel van 0 euro meer bij maximale hypotheek (IT-31299); de plotlijn wordt rood bij overschrijding van de verantwoorde grens (IT-31257); automatisch aanvinken van rentekortingen werkt weer (IT-30112); de financieringsopzet krijgt een vierde vak "Benodigd hypotheekbedrag" (IT-30359).
- **Fiscaal:** Box 1/3-verdeling klopt bij een consumptieve verhoging en een volledig consumptief leningdeel valt automatisch buiten Box 1 (IT-27894, IT-30467); overdrachtsbelasting volgt de werkelijke kostenverdeling per persoon (IT-30751, IT-30744); verkoopkosten van de huidige woning kunnen bewust op 0 (IT-31005).
- **HDN:** geslacht wordt altijd voorgevuld (IT-31025); duidelijkere foutmelding bij een ontbrekende betaalrekening (IT-31836); het aanvraagformulier wordt tussentijds als concept bewaard (IT-31284); slimmere prefill bij aflossingsvrij, box 3 en verbouwingsdepot (IT-30176, IT-30175, IT-28489).
- **Verzekeringen:** Scildon ORV rekent de premie over de premieduur (IT-31164); Allianz ORV is weer selecteerbaar in de vergelijker (IT-31015); bij ondernemers wordt automatisch een AO-dekking bij TAF samengesteld (IT-31120); CreditLife-aanvragen lopen niet meer vast bij AO plus WW (IT-31601); het label "ORV Gezamenlijk" bij twee levens (IT-31821).
- **Adviesrapport:** de pdf toont de terugval bij AO, WW, overlijden partner, einde relatie en AOW weer correct (IT-31781, IT-31783); renteblad en voorwaarden als bijlage per geldverstrekker (IT-30262); geen valse melding "Geen motivatie ingevuld" meer (IT-31199).
- **Klantprofiel en inkomen:** Klantprofiel 2.0 (beta) stelt bij twee aanvragers 20 vragen per persoon (IT-31105); toekomstig inkomen van het type Anders telt pas mee vanaf de ingangsdatum (IT-31805).
- **Overig:** het maximumbedrag van de Groen hypotheek van Attens is bijgewerkt en aanpasbaar (IT-31661); brondata gaat automatisch mee in het bericht naar Accelerate (IT-30958); duidelijke melding bij een verlopen sessie (IT-31279).`},

 {id:'k314',cat:'adv',titel:'Fastlane (eBlinqx Hypotheekadvies): releases maart, april en mei 2026',auteur:'u6',datum:'2026-10-20T16:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'Fastlane eBlinqx Hypotheekadvies releasenotes maart april mei 2026 maximale hypotheek toetsrente gewogen gemiddelde rente overdrachtsbelasting studielening DUO funderingsrisico klantprofiel rapport samenstellen Ockto Knab Helder rebranding',
  links:[{titel:'Releasenotes Fastlane 2026 (Hypotheekbond)',url:'https://fastlane.hypotheekbond.nl/hoe-het-werkt/releasenotes/releasenotes-2026/'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van Fastlane (eBlinqx Hypotheekadvies). Het is een selectie van wat een adviseur in de praktijk merkt, geen officiële releasenote; de brontekst is leidend. Per wijziging staat het ticketnummer. Controleer na een release altijd in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Mei 2026 (42 verbeteringen)

- **Berekening en normen:** een nieuwe rekenmethode verdeelt leningdelen automatisch zo dat de gewogen toetsrente zo laag mogelijk is (IT-30860); de maximale hypotheek wordt pas berekend nadat de subdoelstelling is gekozen (IT-30783); bij tijdelijk doorlopende renteaftrek rekent de toetslast daar nu mee (IT-30425); de AOW-situatie (alleenstaand of gehuwd) klopt in de toetslag op AOW-leeftijd (IT-30395, IT-29850); een overbruggingshypotheek met renteaftrek over de verlengde looptijd van 3 jaar (IT-29803).
- **Overdrachtsbelasting:** bij nieuwbouw is overdrachtsbelasting instelbaar over de koopsom grond en gaat door naar het HDN-formulier (IT-20995); de startersvrijstelling wordt alleen getoond als leeftijd en woningwaarde dat toelaten (IT-29972).
- **Inventarisatie en klantprofiel:** het klantprofiel is opnieuw ontworpen (IT-30454); studieleningen met nieuwe benamingen, looptijd in maanden en een aanpasbaar maandbedrag (IT-27270); bij een doelstelling kies je direct of het advies op gedragscode of op besteedbaar inkomen is gebaseerd (IT-30778); een nieuwe Wonen-sectie voor advies op consumptief besteedbaar inkomen (IT-30371).
- **Verzekeringen:** het verzekeringsvoorstel in de zijbalk doet alleen een voorstel bij een werkelijk tekort (IT-29237); uitgevinkte verzekeraars verdwijnen uit overzichten en berekeningen (IT-30341).
- **HDN en brondata:** HDN-aanvragen gebruiken het ingestelde correspondentieadres (IT-30350); Ockto brondata versie 3.1 wordt ondersteund naast de bestaande versie (IT-30938).
- **Rapportage:** verplichte teksten komen altijd in het oriëntatie- en adviesrapport, ook als je de adviesmotivatie niet opent (IT-30747); beheerders stellen in of adviseurs de opbouw en volgorde van rapporten mogen aanpassen (IT-30760).

## April 2026 (38 verbeteringen)

- **Berekening en normen:** de bruteringsfactor voor DUO-studieschuld volgt exact de staffel op de grenswaarde van de toetsrente; de leencapaciteit was hierdoor eerder te hoog (IT-30393); de verruiming voor alleenstaanden volgt het werkelijke aantal personen in het dossier (IT-30342); de grondslag voor overdrachtsbelasting is expliciet de hoogste van koopsom en getaxeerde marktwaarde, met een signalering bij verschil (IT-30476); bij 1% overdrachtsbelasting met één starter en één doorstromer geef je aan wie de belasting draagt (IT-28794).
- **Verzekeringen:** in duo-dossiers volgt een ORV-voorstel alleen als het verplicht verzekerd bedrag voor minstens één persoon groter dan 0 is (IT-28688); ORV-premie voor twee levens wordt direct vernieuwd bij een wijziging van de rookstatus (IT-23419).
- **HDN:** filter op verplichte velden (IT-30119), snellere lokale validatie (IT-28822) en een uitgebreidere keuzelijst "Soort regeling" (IT-28340).
- **Brondata:** een reeks bevindingen verwerkt: ontbrekende velden, consistente eigendomsdata uit Ockto en GBA, betere verwerking van inkomen, vermogen en gezamenlijke rekeningen (IT-30378, IT-30012).
- **Klantprofiel:** een nieuw hoofdstuk Funderingsrisico (IT-30437); bijna alle verplichte velden vervallen, met een niet-blokkerende volledigheidsindicator (IT-28541).
- **Rapportage:** kies het rapporttype en een eigen titel op het voorblad (IT-30218); betere pdf-service met inhoudsopgave en interne links (IT-30394, IT-30348).
- **Labels:** Knab Helder Hypotheek is selecteerbaar als label (IT-30423); rebranding naar eBlinqx Hypotheekadvies.

## Maart 2026 (50 verbeteringen)

- **Berekening en normen:** bij renteaftrek die binnen 10 jaar vervalt wordt de brutering van de fictieve last toegepast vanaf het werkelijke moment van vervallen (IT-29958); pensioeninkomen en aanvullend pensioen na de AOW-leeftijd van aanvrager 2 tellen correct mee in het toetsinkomen (IT-29747, IT-30032); validatie van de starterslening houdt rekening met koopsom, verbouwing en EBV (IT-29979); na definitieve verkoop van het onderpand wordt het eigen geld verwerkt en verdeeld volgens de eigendomsverhouding (IT-28840).
- **Geldverstrekkers vergelijken:** een nieuwe kolom "Gewogen gemiddelde hypotheekrente" in de vergelijking en het adviesrapport, in plaats van de kolom Toetsrente in het rapport; acceptatie- en leennormberekeningen blijven ongewijzigd (IT-29665); sorteren op gemiddelde rente (IT-30002).
- **Verzekeringen:** premiecorrecties voor Credit Life woonlastenverzekering, Scildon ORV op twee levens en Allianz ORV (IT-30192, IT-29918, IT-30033); TAF Maandlastenbeschermer Zelfstandige weer selecteerbaar (IT-29292); een ingangsdatum in het verleden geeft een melding (IT-30040).
- **HDN:** foutmeldingen verschijnen direct en verdwijnen bij correctie (IT-30121); bij een gecombineerd tarief voor advies en bemiddeling verdwijnen de losse kostenposten (IT-30078).
- **Rapportage:** een rapport zelf samenstellen met slepen, hoofdstuknummering en inhoudsopgave (IT-30005); herstel en verbetering van GHF- en CBI-rapportage (IT-29436, IT-29731, IT-29362); een gehuurde woning en de erfpachtcanon worden juist getoond (IT-29565, IT-28939).`},

 {id:'k315',cat:'adv',titel:'Fastlane (eBlinqx Hypotheekadvies): releases januari en februari 2026',auteur:'u6',datum:'2026-10-20T16:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'Fastlane eBlinqx Hypotheekadvies releasenotes januari februari 2026 NHG financieringslasttabel 2026 overdrachtsbelasting niet-zelfbewoning commerciële rentes overbrugging 36 maanden erfpacht financieringsopzet HDN Oriëntatie Advies samengevoegd',
  links:[{titel:'Releasenotes Fastlane 2026 (Hypotheekbond)',url:'https://fastlane.hypotheekbond.nl/hoe-het-werkt/releasenotes/releasenotes-2026/'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van Fastlane (eBlinqx Hypotheekadvies). Het is een selectie van wat een adviseur in de praktijk merkt, geen officiële releasenote; de brontekst is leidend. Per wijziging staat het ticketnummer. Controleer na een release altijd in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Februari 2026 (60 verbeteringen)

- **Financieringsopzet:** bovenaan staan altijd de berekende toetslast, de toegestane toetslast en het verantwoorde hypotheekbedrag, met een rode markering bij overschrijding; de pagina Grafieken heet nu Visueel overzicht (IT-29680); een nieuwe module waarmee je zelf bepaalt hoe eigen geld, hypotheekbedrag en overbrugging het verschil opvullen (IT-29166); bedragen worden direct opnieuw doorgerekend bij een wijziging (IT-29619).
- **NHG en overbrugging:** NHG-kosten zijn een berekend veld op basis van de NHG-keuze per leningdeel (IT-29546); de looptijd van de overbruggingslening is verlengd van maximaal 24 naar 36 maanden (IT-28432).
- **Erfpacht:** de bruto-netto maandlast is uitgesplitst in hypotheeklasten, erfpachtcanon en belastingvoordeel (IT-29251).
- **Normen en tarieven:** een vaste keuze voor het wettelijke overdrachtsbelastingtarief voor niet-zelfbewoning per 2026 (IT-29103); overdrachtsbelasting wordt afgerond op hele euro's volgens de wettelijke regel (IT-28590); "Acceptatienormen" heet nu "Financiële analyse" (IT-29662).
- **Rentes en vergelijken:** commerciële rentes zijn volledig uitgefaseerd: rentes verschijnen pas op de werkelijke ingangsdatum (IT-29729); gekozen rentekortingen werken door in beide vergelijkweergaven (IT-28851); een nieuw filter "Verduurzamen" (IT-22653); tarieven in een opgeslagen berekening worden vastgezet (IT-29424); een knop "Renteblad" in de header (IT-29682).
- **HDN:** een aanvraag kan alleen worden verstuurd als de berekening sluitend is (IT-29801); advies- en bemiddelingskosten gaan exact naar HDN (IT-29008).
- **Rapportage:** duidelijkere beoordeling bij Overlijden in GHF-advies (IT-29362); bij CBI krijgt Einde relatie een aparte alinea Advies (IT-29337).

## Januari 2026 (53 verbeteringen, releases op 8, 15, 22 en 29 januari)

- **Normen 2026:** de door NHG gecorrigeerde Financieringslasttabel Beheer 2026 wordt automatisch toegepast voor NHG-dossiers met ingangsdatum 2026 (IT-28712, 8 januari); voor bepaalde alleenstaanden wordt het wettelijk vrij te laten bedrag buiten beschouwing gelaten, afhankelijk van toetsinkomen en AOW-leeftijd (IT-29064, 15 januari); bij een volledig niet-aftrekbare hypotheekrente gelden de Box 3-financieringslastpercentages (IT-28121, 29 januari); Lloyds-aflossingsvrije leningdelen krijgen een volledig bruto toetslast (IT-28737, 15 januari).
- **Berekening en financieringsopzet:** meerdere hypotheken samenvoegen tot een hoofdhypotheek in de inventarisatie (IT-27489, 8 januari); een overbruggingshypotheek valt buiten pro-resto, restschuld, toetsmomenten en de CBI-terugval bij life events (IT-28827, 22 januari); de laatst opgeslagen berekening is leidend bij het openen of actualiseren (IT-28858, 8 januari).
- **HDN:** de datum indiensttreding wordt niet meer automatisch ingevuld maar gecontroleerd (IT-28864, 8 januari); juiste verzekerde en verzekeringnemer bij AO-, AO/WW- en woonlastenverzekeringen (IT-23406, IT-23414, IT-28561, 22 januari).
- **Verzekeringen:** optie "Tot AOW-datum" bij de gewenste looptijd (IT-28589, 15 januari); AO- en WW-onderdelen vervallen als er geen inkomen uit arbeid is (IT-28927, 29 januari).
- **Rapportage:** het CBI-hoofdstuk Overlijden voor alleenstaanden en de onderdelen Huidige woning en Einde relatie zijn volledig in het adviesrapport (IT-29119, IT-28245, IT-27814, 22 januari).
- **Proces:** Fastlane Oriëntatie en Advies zijn samengevoegd tot één proces onder eBlinqx Hypotheekadvies (IT-27910, 15 januari); het adviesrapport kan automatisch met het AX-bericht naar Elements (IT-26960, 29 januari).`}
]);
