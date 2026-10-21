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
 {id:'k410',cat:'fl',titel:'Fastlane (eBlinqx Hypotheekadvies): release oktober 2026 in het kort',auteur:'u6',datum:'2026-10-20T12:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
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
 {id:'k411',cat:'adv',titel:'eBlinqx release 20 oktober 2026: dataverbruik, e-mailboxen, schadeverzekering en taken',auteur:'u6',datum:'2026-10-20T14:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
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
 {id:'k412',cat:'fl',titel:'Fastlane (eBlinqx Hypotheekadvies): releases augustus en september 2026',auteur:'u6',datum:'2026-10-20T15:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
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
 {id:'k413',cat:'fl',titel:'Fastlane (eBlinqx Hypotheekadvies): releases juni en juli 2026',auteur:'u6',datum:'2026-10-20T16:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
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

 {id:'k414',cat:'fl',titel:'Fastlane (eBlinqx Hypotheekadvies): releases maart, april en mei 2026',auteur:'u6',datum:'2026-10-20T16:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
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

 {id:'k415',cat:'fl',titel:'Fastlane (eBlinqx Hypotheekadvies): releases januari en februari 2026',auteur:'u6',datum:'2026-10-20T16:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
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
- **Proces:** Fastlane Oriëntatie en Advies zijn samengevoegd tot één proces onder eBlinqx Hypotheekadvies (IT-27910, 15 januari); het adviesrapport kan automatisch met het AX-bericht naar Elements (IT-26960, 29 januari).`},

 {id:'k416',cat:'adv',titel:'eBlinqx releases juli t/m september 2026: Uwkluis, Quinn en AI-gebruik',auteur:'u6',datum:'2026-10-20T17:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'eBlinqx releasenotes juli augustus september 2026 Uwkluis Klantportaal Quinn AI-gebruik dashboard Voorkeurscluster HDN SignRequest facturen Aplaza bankgarantie portefeuillewaarde',
  links:[{titel:'Releasenotes eBlinqx (support.fasterforward.nl)',url:'https://support.fasterforward.nl/releasenotes/'},{titel:'Overzicht releasenotes Blinqx Verzekering & Hypotheek',url:'https://verzekeringhypotheek.blinqx.tech/releasenotes'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van eBlinqx (en Elements) van Blinqx Verzekering & Hypotheek. Het is geen officiële releasenote; de brontekst is leidend. Controleer na een release in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Release 22 september 2026 (gepubliceerd 18 september)

Uwkluis:
- Bij synchroniseren wordt alleen nog het gewijzigde stuk vervangen, in plaats van alles te wissen en opnieuw te uploaden. Dat scheelt dubbele stukken en dubbele stukkenlijsten onder één product.
- Bewerkingen aan een document (censureren, PDF bewerken, splitsen/samenvoegen, getekend voor gezien) komen nu altijd in Uwkluis aan. Het eerder beoordeelde stuk wordt vervangen, dus je moet het opnieuw beoordelen.
- Op tabblad Export – UwKluis staat een knop met "Basis sync" (CRM, producten, contractdocumenten, voortgang hypotheekprocessen) en "Volledige sync" (ook documenten, stukkenlijst, berichten, kantoorgegevens, verzoeken). Daaronder staat de status van de laatste synchronisatie.
- Dossiersynchronisatie draait op de achtergrond in een eigen wachtrij en belast de database minder.
- De authenticatie van de koppeling is vernieuwd. Blinqx richt dit in, je hoeft niets te doen.
- Uwkluis heet voortaan Klantportaal (tabblad Export, ondertekenen, rapportages, workflowstappen). Standaardteksten pas je zelf aan.

Quinn/AI:
- In de e-mailmanager stel je per mailbox in of e-mails met AI aan dossiers en producten mogen worden gekoppeld.
- Nieuw dashboard "AI-gebruik" onder Managementinformatie, met aantallen per AI-functie (mail koppelen, taken aanmaken, reply, tekst verbeteren) over vier tijdvakken, met doorklik naar detail per gebruiker of mailbox.
- Module "AI instellingen" voor beheerders: standaard aanschrijfvorm (formeel/informeel, met voorkeurstaal van het dossier als eerste) en per AI-functie een eigen promptaanvulling.
- Het blok "taak aanmaken op basis van AI" kun je inklappen of wegklikken.

Overig:
- Salderen van meerdere facturen zet nu alle facturen op gesaldeerd, niet nog maar één.
- Rapportages uitgebreid (extra kolommen bij facturenoverzicht en omzet per klant); e-mailadressen in de verjaardagsrapportage worden breder opgehaald.
- E-mailoverzicht toont de ontvanger ('Aan') in plaats van de CC; duidelijke melding als e-mailinhoud ontbreekt of nog wordt verwerkt.
- Actieknoppen met pijltje tonen niet meer dubbel de hoofdactie.
- API: zoeken op voorletters en voornaam.
- Producten van TAF – Zurich en Florius Profijt 12 beschikbaar via de updateknop.

Let op:
- AVG/AI: e-mails in als vertrouwelijk gemarkeerde mailboxen of adressen ("e-mails verbergen voor anderen") gaan niet meer naar de AI-verwerker.
- Wordt een dossier voorgesteld met een eBlinqx-gebruiker (ook inactief of geblokkeerd) of een personeelsdossier, dan wordt de mail niet gekoppeld ("niet gelukt"). De inhoud is dan wel door de AI-verwerker gegaan. Het gebruikersaccount moet aan de persoon gekoppeld zijn.
- Wil je HR-mail helemaal buiten AI houden, zet dan "automatisch koppelen op basis van AI" voor die mailbox op Nee.
- Het AI-dashboard is zichtbaar voor wie Managementinformatie mag zien; check die toegang.

## Release 11 augustus 2026 (gepubliceerd 7 augustus)

Quinn/AI (alleen eBlinqx, nog in pilot):
- Koppelen van e-mail kijkt nu ook naar de inhoud, niet alleen onderwerp of uniek adres. Mail van geldverstrekkers en notarissen komt zo sneller bij het juiste dossier of product.
- Per mail zie je de koppelstatus (wordt geanalyseerd, gekoppeld, niet gelukt) en geef je met duim omhoog/omlaag feedback. Verkeerde koppeling kun je opnieuw koppelen of loskoppelen.
- Actiepunten uit een mail worden in één taak gezet, automatisch of handmatig (met aanpasbare actiepunten, verantwoordelijke en tijd).
- Vanuit het takenoverzicht kun je bij AI-taken direct de mail beantwoorden; de kolom Prio is vervallen.
- "AI reply genereren" maakt een conceptantwoord; "Tekst verbeteren met AI" herschrijft geselecteerde tekst.

Taken:
- Na een informatie-aanvraagbericht (IA/IX) maakt het systeem op vaste momenten taken aan, bijvoorbeeld bij ontvangst, uitblijven of verwerkingsfout. De behandelaar van de hypotheek is verantwoordelijk.

HDN en koppelingen:
- In de module Voorkeurscluster stel je per geldverstrekker de inkoop via in (bijvoorbeeld rechtstreeks of serviceprovider), niet per deelnemer. Bij een AX-bericht in de HDN-inbox wordt dit veld direct gevuld, waardoor berichten vaker automatisch doorlopen.
- Toegang tot Gemiddelde doorlooptijden geeft automatisch toegang tot Voorkeurscluster.
- Brondataverzoek Ockto kan worden aangemaakt vóór activatie van Uwkluis (via workflow).
- Ondertekenen via Uwkluis loopt nu via SignRequest, niet meer via Stiply.

Schade/leven/hypotheek en facturatie:
- Per dossier en stuk stel je "Aan te leveren door" in (standaard uit Soort documenten beheer). Dit stuurt wat zichtbaar is in Uwkluis en wat als openstaand stuk wordt opgehaald.
- Het product in een opgeslagen factuur is te wijzigen naar een product met dezelfde administratie; niet meer na boeken en niet bij TP-incasso.

Overig:
- Bank FINOM toegevoegd; Figlo versie 32 doorgevoerd.
- Dashboardblokken zijn in te klappen.
- Aplaza-bericht met meerdere documenten wordt niet automatisch verwijderd als niet alle documenten daarvoor zijn aangemerkt.
- Zoekvelden in Boeking zoeken zijn breder.

Let op:
- AI: de e-mailfuncties zijn pilot en alleen in eBlinqx. Door de AI-koppeling wordt mailinhoud geanalyseerd; zie de maatregelen voor vertrouwelijke mail in de release van 22 september. Controleer AI-voorstellen (koppeling, taak, conceptantwoord) altijd zelf.
- Toegang: Voorkeurscluster vraagt de juiste rechten.

## Release 7 juli 2026 (gepubliceerd 6 juli)

Quinn/AI:
- Fin, een virtuele AI-assistent (alleen eBlinqx): via het gespreksicoon stel je vragen over eBlinqx.

Schade/leven/hypotheek:
- Bankgarantie: een verstuurde aanvraag kun je afhankelijk van de status wijzigen, corrigeren (uitgaand WX-bericht krijgt type correctie) of verlengen en opnieuw versturen. Wijzigen kan tot de statusmelding "04 Bankgarantieaanvraag ter acceptatie".
- Voor de klantlogin op de bankgarantie-omgeving kies je het correspondentieadres van de contactpersoon, zodat inloggen klopt als iemand elders woont dan het hypotheekadres.
- Verplichte velden zijn duidelijker aangegeven, "Verzenden" blijft zichtbaar en foutmeldingen zijn verhelderd. Veel velden komen nu uit het dossier (zie informatie-icoon), zodat dossier en aanvraag niet uiteenlopen.
- Schademelding: schadedatum en -tijd, polis en object zijn te wijzigen zolang er geen boeking aan hangt.
- Portefeuillewaarde-overzicht uitgebreid met overzicht per branche (aantal polissen, totalen, doorklik naar maatschappijen) en polisdichtheid.

HDN en koppelingen:
- Pep- en sanctiecheck via Hyarchis, te starten via blok Klantonderzoek, workflow of SMART. Het resultaat komt als PDF onder Documenten. Aanvragen via je account owner, met opgave van de gebruikers.
- Aplaza-documenten kunnen na verwerking automatisch in een zelf ingestelde map in het dossier. Ontbrekende (onder)mappen worden aangemaakt; niet met terugwerkende kracht.
- Afwijkende rentevast-ingangsdatum wordt juist naar Uwkluis gesynchroniseerd.

Boekhouding en facturatie:
- Nieuwe tag [betalingsoverzicht->totaalbedrag].
- Betaalwijze-velden in administratie onderhoud zijn vervallen (vaste waarden). Bij automatische incasso vervalt de Betaaltermijn op de factuur.

Uwkluis:
- Het PDF-bestand van het klantonderzoek heet nu "Klantonderzoek – vragenlijst.pdf" en staat automatisch op publiek. Het JSON-bestand staat niet meer onder Documenten.

Beheer:
- Technische vernieuwing onder de motorkap, zonder zichtbaar effect.

Let op:
- AI/AVG: Fin beantwoordt vragen met AI; voer er geen persoonsgegevens van klanten in.
- AVG/AFM: de pep- en sanctiecheck (WWFT) verwerkt persoonsgegevens en kent een eigen toegang. Geef alleen de benodigde gebruikers rechten.
- Het resultaat van de check staat als document in het dossier; denk aan wie dat kan inzien.`},

 {id:'k417',cat:'adv',titel:'eBlinqx releases april t/m juni 2026: performance en HDN 26',auteur:'u6',datum:'2026-10-20T17:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'eBlinqx releasenotes april mei juni 2026 performance HDN 26 PortefeuilleSignalen documenten vergelijken',
  links:[{titel:'Releasenotes eBlinqx (support.fasterforward.nl)',url:'https://support.fasterforward.nl/releasenotes/'},{titel:'Overzicht releasenotes Blinqx Verzekering & Hypotheek',url:'https://verzekeringhypotheek.blinqx.tech/releasenotes'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van eBlinqx (en Elements) van Blinqx Verzekering & Hypotheek. Het is geen officiële releasenote; de brontekst is leidend. Controleer na een release in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Release 23 juni 2026 (gepubliceerd 19 juni): performance

Performance (afgerond):
- Nieuwe jobserver: achtergrondprocessen zoals e-mailverwerking en HDN-berichten worden tijdig afgehandeld.
- Twee extra databaseservers voor meer ruimte.
- Browsers laden eBlinqx sneller door front-endverbeteringen.
- Maand- en jaarafsluiting zijn herschreven en verwerken sneller.
- Het proces bij het opzeggen van een gebruiker verstoort de performance niet meer.

Performance (lopend en doorlopend):
- Pagina's laden sneller door extra database-indexen en herschreven queries.
- Twee mensen werken fulltime aan performance; er is nauwe samenwerking met de hostingpartij.
- Processen zoals automatisch censureren worden geoptimaliseerd, machines gemonitord en een overstap van HTTP/1 naar HTTP/2 onderzocht.

Koers:
- Modernisering van infrastructuur en applicatie.
- Structurele database-expertise.
- Opschonen van ongebruikte code.
- Meer geautomatiseerd release-proces met uitgebreidere tests.
- Standaardisering voor ontwikkeling met AI-tooling.

## Release 27 mei 2026 (gepubliceerd 26 mei): voorbereiding HDN-versie 26 (overgang 30 mei 2026)

HDN en koppelingen:
- Betalingsmethode advieskosten (uit eigen middelen of meefinancieren) komt uit het adviespakket, staat in het hypotheekproduct onder Wonen bij Netto advieskosten en gaat mee in de aanvraag.
- Bij levensverzekeringsaanvragen via HDN wordt een meegegeven voorkeurstaal als voorkeurstaal vastgelegd, indien nog leeg.
- Nieuwe datums "uiterste aanleverdatum dossier" voor renteaanbod en hypotheekaanbod. Gebruik voor signalering of workflow laat je inrichten.
- Betere matching van aanvraagbericht aan adviseur in de HDN-inbox; maatschappij-typelijst geactualiseerd; Congo heet nu "Democratische Republiek Congo".
- KX-berichten (kredietaanvragen) niet meer ondersteund. Documentbericht (DX) mag groter zijn.
- Bankgarantie (WX) stuurt Engels als voorkeurstaal mee, anders Nederlands; bij Object zijn soort bouw en bestaande bouw/nieuwbouw toegevoegd.
- Zakelijk inkomen (ZX): contactgegevens verplaatst; ontbreken zakelijke contactgegevens bij kantoor of centrale organisatie, dan volgt een foutmelding.
- Voor jou is verder geen actie nodig; Blinqx houdt de HDN-aansluiting werkend.

PortefeuilleSignalen:
- In SMART een selectie naar het uitgebreide zoekscherm; "Hypotheekbond" heet daar nu "Signalen". Tabblad Fastlane heet Hypotheekadvies, tabblad Hypotheekbond heet Signalen.
- Betere controle tegen dubbele inkomens bij binnenkomst van een aanvraag.
- Uwkluis-vragenlijsten (JSON) via de API beschikbaar; mapping van burgerlijke staat uitgebreid en verplicht.

Overig:
- Tekenen voor gezien werkt ook bij identiteitsbewijzen met alleen de voorkant.
- Uitgaand IA-bericht bij serviceprovider-omgevingen bevat het SP-element, zodat het IX-antwoord goed binnenkomt.
- Finly-formulier gebruikt het standaard correspondentieadres van het dossier (of van het product).

Let op:
- AVG: contactgegevens in het ZX-bericht zijn nu verplicht aanwezig; controleer de zakelijke gegevens van kantoor of centrale organisatie.

## Release 29 april 2026

Documenten vergelijken en Uwkluis:
- Slim vergelijken werkt nu ook voor UWV verzekeringsbericht, werkgeversverklaring, pensioenoverzicht, salaris jaaropgave, salarisstrook en identiteitsbewijs.
- De serviceprovider-stukkenlijst heeft dezelfde statusindicatoren en filters en kan doorklikken naar het vergelijkingsscherm.
- Bij werken met volmacht geef je aan of je beoordeelt namens de maatschappij of als serviceprovider; de knoppen volgen je rechten.
- Adrescontrole gebruikt het correspondentieadres van de juiste persoon. De status van bevindingen ververst bij het openen van een document.
- Sortering op status: beoordeling van maatschappij of serviceprovider gaat voor de interne status. Stukkenlijst laadt aanzienlijk sneller.
- Documenten komen sneller in UwKluis via een verwerkingsqueue en per ronde worden meer jobs opgepakt, met minder vertraging bij pieken.

HDN en koppelingen (PortefeuilleSignalen):
- Alle relevante hypotheken worden gesynchroniseerd, niet alleen lopende of met hetzelfde onderpandadres.
- Meer klant- en partnerdata, ook kinderen, en afgifteland/-plaats van legitimatie en de dossierstatus gaan mee. Inkomensgegevens worden door PortefeuilleSignalen zelf opgehaald.
- Na een SX-bericht met status Lening in beheer volgt automatisch synchronisatie. Producten en geldverstrekkers hoeven niet meer via Hypotheekbond-ID's ingericht.

E-mail en workflow:
- In workflowbeheer kun je het onderwerp uit de actuele standaardtekst in "correspondentieteksten beheer" laten overnemen, zodat de workflowactie niet telkens aangepast hoeft. Zonder vinkje blijft handmatig invoeren mogelijk.
- API-endpoints vinden op factuurnummer het dossier en de factuur, bedoeld voor automatisch koppelen van mails met facturen.

Overig:
- Tag voor het totaalbedrag van het betalingsoverzicht (via support in te richten).
- Op tabblad bankgarantie bij hypotheken heet "Overlijden" nu "Beschermd+ (overlijden, werkloosheid, ongeval en aankoopkosten)".

Let op:
- AVG/AFM: het uitlezen van o.a. salarisstroken en identiteitsbewijzen vergelijkt persoonsgegevens en inkomensdata met het dossier. Let op wie bij deze stukken kan komen, en op volmacht-keuzes bij beoordelen.
- Er gaan meer persoonsgegevens (kinderen, inkomen, legitimatiegegevens) naar PortefeuilleSignalen.`},

 {id:'k418',cat:'adv',titel:'eBlinqx releases januari t/m maart 2026: boekhouding, gespreksopname en AI-koppeling',auteur:'u6',datum:'2026-10-20T17:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'eBlinqx releasenotes januari februari maart 2026 boekhouding facturatie administratie IBAN mandaat gespreksopname AI e-mail koppelen documenten vergelijken bankgarantie Nationale Waarborg',
  links:[{titel:'Releasenotes eBlinqx (support.fasterforward.nl)',url:'https://support.fasterforward.nl/releasenotes/'},{titel:'Overzicht releasenotes Blinqx Verzekering & Hypotheek',url:'https://verzekeringhypotheek.blinqx.tech/releasenotes'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van eBlinqx (en Elements) van Blinqx Verzekering & Hypotheek. Het is geen officiële releasenote; de brontekst is leidend. Controleer na een release in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Release 26 maart 2026 (gepubliceerd 25 maart, update 10 april)

Schade/leven/hypotheek:
- Nieuw vergelijkingsscherm vanuit de stukkenlijst (vergelijkingsicoon): eBlinqx-data staat links, het document ernaast, met een dropdown voor een extra document. Verschillen worden oranje gemarkeerd; documenten worden ook onderling vergeleken.
- Je kiest tussen het originele document en de met AI uitgelezen gegevens. Lukt uitlezen niet, dan zie je alleen het origineel. Goed- of afkeuren kan in het vergelijkingsscherm; de knoppen staan in het beoordelingsscherm nu bovenaan.
- Bankgarantie Nationale Waarborg: arrangementen worden via de API opgehaald (dropdown). "Verzekerd" wordt automatisch gevuld, de kosten komen in een kostenoverzicht. Bij vrije tussenpersoon- of organisatievergoeding vul je zelf een bedrag in. Bij een foutieve inrichting krijg je een melding en kun je handmatig invullen.

Stukkenlijst:
- Nieuwe filtering met statusiconen en een oranje bevindingsicoon bij afwijkende data, mislukte geldigheidscheck of verschil in identiteitsgegevens (mutatie).
- Bevindingen kun je negeren (behalve mutaties; icoon wordt grijs) en weer tonen. Bij gewijzigde klantgegevens ga je door naar tabblad Mutaties.
- Kolommen B, O en het wijzigingsicoon zijn weg; wijzigen doe je via de naam van het stuk. Het verwijdericoon is een prullenbak.

Boekhouding en facturatie:
- Datum afschrift is nu de laatste transactie op het bankafschrift, niet meer "vandaag".

Let op:
- AI/AVG: de uitgelezen gegevens komen van AI; controleer ze altijd tegen het origineel voordat je goedkeurt of gegevens overneemt.
- Identiteits- en klantgegevens worden vergeleken met het dossier; wijzigingen loop je via Mutaties.

## Release 16 maart 2026 (gepubliceerd 13 maart)

Boekhouding en facturatie:
- Je koppelt een (afwijkende) administratie aan een dossier of product, bijvoorbeeld voor abonnementen in de eigen kantooradministratie in plaats van die van de centrale organisatie. Inrichting en rechten bepalen welke administraties en financiële gegevens je ziet. Inrichten via support.
- Factureren vanuit de kaart is daardoor ook voor deelnemers mogelijk.
- IBAN en mandaat voer je nu alleen onder de persoon/organisatie op (niet meer in het financiële relatieblok). Meerdere IBAN's mogelijk, één standaard; het mandaat hangt aan rekeningnummer en administratie.
- Bij boeken van een factuur zonder mandaat wordt dat automatisch aangemaakt (bij betaaltermijn 0 dagen en een positief bedrag).
- IBAN is te kiezen in product (schade, leven, contract, dienst; alleen bij incasso) en in de factuur. Bij betaaltermijn 0 dagen is kiezen verplicht.
- Facturen maak je alleen nog vanuit het dossier aan. Na aanmaken zijn dossier, product en administratie niet meer te wijzigen. Facturen uit verschillende administraties kun je niet salderen of in één betalingsoverzicht opnemen. Zonder rechten is een factuur read-only.
- ADN-batch: posten worden geboekt in de administratie waarin de batch binnenkwam. Een afwijkende productadministratie wordt aangepast (melding), behalve bij een lopende rekening-courantregeling (oranje melding); filters in de batch helpen afwijkingen vinden.
- TP-incasso: je kiest per verzekeringsdeel een afwijkende incassorekening. Minstens één deel moet op de standaardwijze gefactureerd worden.

Let op:
- Toegang: wie welke administraties en financiële gegevens ziet, hangt af van rechten en inrichting. Controleer die bij het invoeren.

## Release 24 februari 2026 (gepubliceerd 20 februari)

Gespreksopname (alleen eBlinqx):
- Het scherm om taken uit een gespreksopname te genereren is verbeterd; start- en einddatum, tijd en verantwoordelijke zijn per taak aan te passen.
- Je kunt zelf opnames uploaden in het dossier (MP3, MP4, WAV, webm, ogg), bijvoorbeeld van je telefoon, en daar dezelfde acties op doen. Bij verkeerd of te groot bestand volgt een melding.
- Kolom "Toegevoegd door" laat zien wie de opname startte of uploadde.

HDN en koppelingen:
- Argenta, Allianz, Nationale Nederlanden en Vista werken met IA/IX-berichten.
- De dossierrol (eerste persoon of partner) gaat mee naar MyTP.
- Staat een ADN-branche het aanmaken van objecten niet toe, dan wordt het object niet meer aangemaakt.

CRM en overig:
- Instagram en TikTok zijn toe te voegen als social media bij de persoon of organisatie.
- Bij relatie-organisaties zijn "Gelieerde onderneming" en "Ondernemer in privé" toegevoegd.

Beheer en beveiliging:
- Onder de motorkap is de softwarebasis vernieuwd. Dit raakt ook koppelingen en exports (klantportalen, adviespakketten, Excel, geldverstrekkers en verzekeraars) en houdt de beveiliging op peil. Je merkt er niets van.

Let op:
- AVG: opnames en transcripten bevatten persoonsgegevens. Met uploaden kunnen ook opnames van buiten eBlinqx in het dossier komen; zorg voor toestemming van de klant en controle op wie ze kan inzien.

## Release 13 januari 2026 (gepubliceerd 9 januari)

Gespreksopname en documenten (alleen eBlinqx):
- Mislukte transcriptie kun je zelf opnieuw indienen via een retry-icoon met blauwe melding. De knop ontbreekt als er al een transcript is of het verzoek jonger is dan 5 minuten.
- Documenten tekenen voor gezien kan nu ook met de functie acceptant of behandelaar, niet alleen adviseur.

Quinn/AI:
- Pilot voor koppelen van e-mail met AI (alleen eBlinqx): ook de inhoud van de mail wordt bekeken, niet alleen onderwerp of uniek adres. Mail van geldverstrekkers en notarissen gaat zo automatisch naar het juiste dossier of product. Deelnemers worden mogelijk benaderd.

HDN en koppelingen:
- Informatieberichten (IA) via HDN kunnen nu ook naar Attens Hypotheken, Centraal Beheer, Woonfonds, Syntrus Achmea, Dynamic Credit, bijBouwe en Tellius Hypotheken.

Boekhouding en facturatie:
- De workflowactie betalingsoverzicht maken en per e-mail versturen kan de originele facturen weglaten, zodat de PDF klein blijft. Nieuwe tag betalingsoverzicht->specificatie met productinformatie.

Uwkluis:
- Klanten kunnen bij een bericht via Uwkluis meerdere documenttypen als bijlage meesturen, niet alleen pdf. Dit geldt niet voor de openstaande verzoeken/stukken.

Rapportage en CRM:
- Rapportage "CRM – Dossiers met organisaties obv contactpersonen" heeft de kolom Contactpersoon functie (aanzetten via Rapportagebeheer).
- Bij relaties andere dossiers zie je direct of iemand is overleden.

Beheer:
- Verbeteringen onder de motorkap en aan de interne conversietool.

Let op:
- AI/AVG: bij de pilot wordt mailinhoud met AI geanalyseerd. Meedoen is een bewuste keuze; beoordeel dit vooraf op persoonsgegevens en vertrouwelijkheid.`},

 {id:'k419',cat:'adv',titel:'eBlinqx releases augustus t/m november 2025: HDN-certificaten, omnummeren en documentcontrole',auteur:'u6',datum:'2026-10-20T17:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'eBlinqx releasenotes 2025 augustus september oktober november HDN certificaten omnummeren documentcontrole FinRust gespreksopname Quinn pensioenkaart',
  links:[{titel:'Releasenotes eBlinqx (support.fasterforward.nl)',url:'https://support.fasterforward.nl/releasenotes/'},{titel:'Overzicht releasenotes Blinqx Verzekering & Hypotheek',url:'https://verzekeringhypotheek.blinqx.tech/releasenotes'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van eBlinqx (en Elements) van Blinqx Verzekering & Hypotheek. Het is geen officiële releasenote; de brontekst is leidend. Controleer na een release in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Samenvattingen in eigen woorden, nieuwste release bovenaan. Datums volgens het archief van de supportsite.

## HDN-certificaten verdwijnen (25 november 2025)

HDN en koppelingen:
- HDN schaft de certificaten voor adviseurs af. Verlengen van de aansluiting gaat voortaan jaarlijks via het HDN-portaal.
- Dit hoort bij een nieuwe versie van de HDN-API (2.9.0) die op 1 december live gaat.
- Voor gebruikers van Elements/eBlinqx is geen eigen actie nodig; de aansluiting wordt technisch aangepast.
- Rond de overgang staat HDN-verkeer stil: van zondagochtend 30 november tot maandagochtend 1 december. Berichten worden daarna alsnog verwerkt, in- en uitgaand.

Boekhouding en facturatie:
- In de controlelijst van een ADN-batch laat de mouse-over nu duidelijker zien of een incassopost van een maatschappij is gecontroleerd (blauw vinkje) of nog moet worden gecontroleerd (grijs).

Beheer:
- Bij het ophalen van bedrijfsgegevens via de KvK komen nu de vernieuwde SBI-codes mee.

Let op:
- Tijdens het HDN-stilstandvenster kun je geen HDN-berichten versturen of ontvangen. Plan hypotheekaanvragen en stukkenverkeer daarop.

## Grote mailvolumes, Quinn en voorbereiding HDN (14 november 2025)

E-mail:
- Grote aantallen e-mails via Office 365 (bijvoorbeeld bulkfacturen of campagnes) gaan nu automatisch in een wachtrij, zodat de API-limieten van Office 365 niet meer blokkeren.
- Wachtende mails staan in de map "Verzenden mislukt" met een paarse balk die aangeeft wanneer ze vanzelf opnieuw worden verstuurd. Zelf opnieuw versturen is niet nodig.

Quinn/AI:
- Quinn, de virtuele helpdeskmedewerker die vragen over eBlinqx beantwoordt met AI, is nu voor iedereen beschikbaar via het gesprekswolkje in eBlinqx en op de supportpagina.

HDN en koppelingen:
- Voorbereiding op het verdwijnen van HDN-certificaten per 1 december. Kantoren met één certificaat hoeven niets te doen; kantoren met meerdere certificaten (hoofdcertificaat) worden door de leverancier benaderd.
- Foutmeldingen in de koppeling met zkr. zijn duidelijker, ook in het dossier zelf, zodat je ziet waarom verificatie of controle mislukte.

Schade/leven/hypotheek:
- Het hypotheeknummer in de productkaart wordt niet meer overschreven bij een aanvraag bankgarantie of zakelijk inkomen.

Beheer:
- Rapportage "CRM – Dossiers met natuurlijke personen" kent extra kolommen voor nationaliteit (aan te zetten in Rapportagebeheer).
- Managementrapportage over niet-FTR hypotheekaanvragen houdt nu rekening met verwijderde stukken, voor een vollediger beeld.

Let op:
- Als er mails in de wachtrij staan, wordt de betreffende mailbox tijdelijk geblokkeerd voor ophalen. Versturen kan nog wel, maar die mails gaan ook de wachtrij in.
- Nationaliteitskolommen in rapportages zijn persoonsgegevens (AVG): zet ze alleen aan voor wie ze nodig heeft.

## Nieuwe module Omnummering (20 oktober 2025)

Schade/leven/hypotheek:
- Nieuwe module Omnummering: bij een portefeuilleoverdracht tussen maatschappijen zet je schade- en levensverzekeringen zelf om naar nieuwe polisnummers (voor kantoren die met mutatievoorstellen werken).
- Welke polissen naar welk nummer gaan, geef je aan met een CSV-bestand.
- De module staat niet standaard aan; toegang moet bij support worden aangevraagd, met opgave van de gebruikers.

Uwkluis:
- De tijdlijn van een hypotheekaanvraag toont het juiste aantal stappen, afhankelijk van het veld "Moet renteaanbod getekend retour?".

Boekhouding en facturatie:
- Een betalingsoverzicht kun je ook via een workflow aanmaken, met de keuze om verzonden, niet-verzonden of beide facturen op te nemen.
- Het overzicht grootboekkaart per grootboekrekening heeft een kolom dossiernummer, met doorklik naar het dossier.

## Documentcontrole, FinRust en Uwkluis-verbeteringen (12 september 2025)

Alleen in eBlinqx: stukken:
- Controle op documenttype: bij een openstaand stuk (identiteitsbewijs, loonstrook, werkgeversverklaring, jaaropgave, MijnPensioenoverzicht) wordt gekeken of er ook echt dat type document aan is gekoppeld. Anders volgt een melding. Dit geldt ook voor documenten die via Uwkluis binnenkomen.
- Bij het MijnPensioenoverzicht wordt ook de geldigheid gecontroleerd en of het document bij de juiste persoon hoort.

HDN en koppelingen:
- Alleen eBlinqx: een dossier direct doorsturen naar FinRust via het tabblad Export – FinRust (nieuw dossier of update). Voor deze koppeling meld je je aan bij FinRust.
- Voorbereiding op het vervallen van HDN-certificaten.
- Bij het versturen van stukken naar geldverstrekkers is duidelijker of verzending via HDN kan; documenten die de verstrekker niet via HDN opvroeg, zijn standaard uitgevinkt.
- Swan is als bank toegevoegd bij de financiële instellingen van een relatie.
- Een nieuw BijBouwe-product staat klaar via de updateknop.

Uwkluis:
- Naast openstaande verzoeken ziet de klant nu ook goedgekeurde stukken.
- Verzekeringen zijn te bekijken per polis of per verzekerd object, met doorklik naar de polis.
- De getoonde premie is gebaseerd op het pakketpremieblok in het product, niet meer op een afwijkende berekening.

E-mail en beheer:
- In de e-mailmanager zie je per mailbox met welk Microsoft-account is gesynchroniseerd; een afwijking met het ingevoerde adres wordt gemeld.
- Beheerders kunnen naast de melding ook een e-mail krijgen als e-mailsynchronisatie uitvalt. Daarvoor kan één ontvanger worden ingesteld en één mailbox als afzender worden aangewezen.
- Dossierzoeken via het dashboard toont maximaal 100 tekens in de kolom Klant, zodat dossiers met veel personen leesbaar blijven.
- Het wachtwoord-generator laat de tekens < en > weg, omdat die het versturen van sms konden verstoren.
- Onder de motorkap is de software vernieuwd, voor veiligheid en toekomstige functies; ook voor koppelingen en exports.

Let op:
- Documentcontroles raken identiteits-, inkomens- en pensioengegevens van klanten (AVG): leg intern vast wie de meldingen bekijkt en afhandelt.

## Gespreksopname, boekhouding en nieuwe pensioenkaart omzetten (8 augustus 2025)

Alleen in eBlinqx:
- Nieuw tabblad Gespreksopname (onder Communicatie): opnames koppelen aan het dossier, met transcript, samenvatting en conceptmail. Ook kunnen taken en registraties uit de samenvatting worden gemaakt.
- Documentcontrole uitgebreid met werkgeversverklaring (versie, handtekening, geldigheid) en loonstrook (geboortedatum tegen dossier). Meldingen staan in de stukkenlijst; in Soort Documenten Beheer bepaal je welke soorten worden gecontroleerd. De werkgeversverklaring wordt ook in Uwkluis getoetst.

Boekhouding en facturatie:
- In de ADN-batch kun je filteren op posten met dubbele prolongatie (rode pijltjes); het filteren onder het tabblad Matches is ook verbeterd.
- De TP-incassofactuur gebruikt naast de productkaart ook het mutatievoorstel van de boeking, en je kiest of bruto en netto premie of alleen netto wordt getoond. Assurantiebelasting verschijnt niet meer bij nul.
- Bij een eenmalige boeking wordt nu goed bepaald of de polis belastingplichtig is; eerder werd altijd belasting berekend.
- Niet-afgeronde betalingsbestanden zijn herkenbaar aan een grijs euroteken in "Aangemaakte bestanden".
- In openstaande posten kun je filteren op boekjaar en periode.
- Het betalingsoverzicht via workflow kan beperkt worden tot automatische-incassofacturen.
- ADN-batches worden sneller verwerkt.

Schade/leven/hypotheek:
- Rappeltaak bij mutatievoorstellen: duidelijkere naam en inhoud, startdatum gelijk aan de ingangsdatum van de nieuwe polis en altijd direct aangemaakt, ook bij "maatschappij controlerend".
- Bestaande producten met de oude pensioenkaart zijn om te zetten met de actie "Converteer naar nieuwe pensioenkaart"; niet-omzetbare data komt als registratie terecht. Producten met meerdere individuele delen, of bepaalde collectieve combinaties, kunnen niet worden omgezet.
- Het eigen risico is te koppelen aan elke schademelding, ongeacht de status.
- Lloyds gebruikt nu ook IA/IX-berichten om hypotheekgegevens te actualiseren.

Taken:
- Nieuwe datumtags: vandaag, eerste dag en eerste werkdag.

HDN en koppelingen:
- Voor Finly is een eigen API-domein in te stellen, bijvoorbeeld voor een testomgeving.

Beheer:
- Zoeken op het dashboard staat standaard op status "Nieuw en Lopend" voor betere prestaties; "Alle" als standaard is via support in te stellen.
- Meldingen over documentcontroles zijn in Uwkluis op de consument gericht en in eBlinqx op de adviseur.

Let op:
- Gespreksopnames met transcript en samenvatting zijn persoonsgegevens (AVG): regel toestemming en bewaartermijn.
- Loonstrook-controle op geboortedatum werkt eerst alleen in eBlinqx, niet in Uwkluis.`},

 {id:'k420',cat:'adv',titel:'eBlinqx releases januari t/m juli 2025: Office 365, HDN25 en pensioenkaart',auteur:'u6',datum:'2026-10-20T17:00:00',herzienVoor:'2027-01-20',bron:null,gecontroleerd:false,
  kw:'eBlinqx releasenotes 2025 januari februari maart mei juli Office 365 HDN25 pensioenkaart MyTP betalingsoverzicht Finly Uwkluis Voogd Yes-co',
  links:[{titel:'Releasenotes eBlinqx (support.fasterforward.nl)',url:'https://support.fasterforward.nl/releasenotes/'},{titel:'Overzicht releasenotes Blinqx Verzekering & Hypotheek',url:'https://verzekeringhypotheek.blinqx.tech/releasenotes'}],
  body:`Samenvatting in eigen woorden van de openbare releasenotes van eBlinqx (en Elements) van Blinqx Verzekering & Hypotheek. Het is geen officiële releasenote; de brontekst is leidend. Controleer na een release in je eigen omgeving wat er is veranderd en leg vast vanaf wanneer je met de nieuwe versie werkt.

## Klantrelaties, eigen risico en zelf accounts beheren (4 juli 2025)

Alleen in eBlinqx:
- Op de startpagina van een particulier dossier zie je met welke andere dossiers de relatie is verbonden (bijvoorbeeld als eigenaar van een bedrijf of familielid), met doorklik. Voor zakelijke dossiers is dit nog niet beschikbaar.
- Tabbladen gebruiken de volle paginabreedte, zodat Export, Schademelding en Financieel vaker direct zichtbaar zijn; "Meer" blijft zichtbaar.
- Bij producten met incassowijze Tussenpersoon kun je "Betalingsoverzicht" kiezen bij "Factuur verzenden bij"; de factuur gaat dan niet naar de klant. In de ADN-batch zie je dit aan een rood papiericoon.

Schade/leven/hypotheek:
- Een eigen-risicoboeking (TP-incasso) is te koppelen aan een schademelding en komt zo op de factuur.
- Risicodragers in de productkaart staan volledig alfabetisch.

Uwkluis:
- De melding dat er al een Uwkluis-account met hetzelfde e-mailadres en mobiele nummer bestaat, noemt nu ook het dossier. Dat geldt niet als meerdere dossiers op één e-mailadres zijn toegestaan.
- Een Finly-formulier verdwijnt uit Uwkluis als het in eBlinqx/Elements wordt verwijderd.

HDN en koppelingen:
- Te weinig credits bij zkr. voor een klantonderzoek leidt tot een beheerdersmelding.

Boekhouding en facturatie:
- Bij het maken van een incassobatch moet voor het gekozen rekeningnummer een incassant-ID zijn ingesteld; anders volgt een melding.

Beheer:
- Zelf gebruikersaccounts aanmaken en beëindigen komt eraan; er komt een pilot waarvoor beheerders zich kunnen aanmelden.

Let op:
- Het zelfstandig beheren van gebruikersaccounts raakt toegangsbeheer (AVG): zorg voor een vaste in- en uitdienstprocedure.

## Vernieuwde pensioenkaart (20 mei 2025, release van 11 juni)

Schade/leven/hypotheek:
- Nieuwe pensioenproducten gebruiken de vernieuwde kaart; bestaande producten houden de oude.
- Alleen de types Individueel en Collectief blijven; Semi-collectief is vervallen.
- Collectief heeft twee varianten: Werkgever (collectieve afspraken met een lijst deelnemers) en Werknemer (individuele keuzes, vastgelegd in een particulier dossier).
- Individueel omvat opbouw lijfrente, direct ingaande lijfrente en direct ingaand pensioen.
- Veel velden in de pensioendelen zijn verwijderd en de productgroepen voor pensioendelen hoef je niet meer zelf te beheren.
- Bij mutatievoorstellen kun je een polis weer op de ingangsdatum royeren, en de schadedatum/-tijd is weer aan te passen.

Boekhouding en facturatie:
- In de ADN-mutatiebatch is zichtbaar wanneer een post niet via het playicoon te boeken is.

E-mail:
- Bij het koppelen van een e-mail aan een dossier staan zoekresultaten gesorteerd op dossiernummer, hoogste bovenaan.

Beheer:
- Technische vernieuwing onder de motorkap, zonder zichtbare gevolgen.

## Voorbereiding op HDN25 (20 mei 2025, release van 22 mei)

HDN en koppelingen:
- Elements en eBlinqx zijn aangepast aan de HDN25-release van 24 mei, zodat berichten blijven werken. Functioneel merk je weinig.
- Drie nieuwe soorten documenten: verklaring van gemoedsbezwaren, klantbeeldformulier en dubbele woonlastenformulier. Het soort "identiteitsbewijs 1e aanvrager in kleur" vervalt.
- Bij het object maakt HDN onderscheid tussen nieuwbouw en bestaande bouw; bij nieuwbouw heten velden nu Bouwplan en Bouwnummer (oude tags blijven werken).
- Bij een onderpand kun je het BAG-identificatienummer invullen; dezelfde pop-up verschijnt nu ook bij een object in een schadepolis.

Schade/leven/hypotheek:
- In het hypotheekproduct vervallen enkele energievelden (inhoud gaat naar een registratie) en de keuzes bij "Verduurzaming toepassen" zijn gewijzigd.
- Het leningdeeltype "Verhoging (hoger geldbedrag)" is niet meer te kiezen.

## Betalingsoverzicht, MyTP en schademelding (6 mei 2025)

Alleen in eBlinqx: boekhouding en facturatie:
- Vanuit het dossier maak je een betalingsoverzicht van openstaande en geboekte facturen, bijvoorbeeld om restitutie van een oude verzekering te verrekenen met een factuur voor een nieuwe.
- Het overzicht kan handmatig of via een workflow en geeft een pdf. Met Mollie komt er een betaallink op. Bij een ingelezen bankafschrift met het juiste kenmerk en exact bedrag wordt automatisch afgeletterd; bij een verschil boek je handmatig.
- Er moet een sjabloon voor het betalingsoverzicht zijn; support kan dit en de workflow inrichten.

Schade/leven/hypotheek:
- Vanuit het schadeproduct open je direct MyTP voor een nieuwe of eerdere vergelijking.
- In de schademelding zie je meteen de verzekeraar; het veld "Omschrijving" heet nu "Wat is er gebeurd?" en interne zaken horen in "Interne notities".
- Een nieuwe schademelding start met een pop-up voor datum/tijd, polis en eventueel object.

Boekhouding en facturatie:
- Nieuwe subadministratie "Doorbelasting deelnemers" in de boekhoudmodule.
- Een stornering op een bankafschrift wordt herkend en niet aan een openstaand bedrag gekoppeld.

E-mail:
- Afbeeldingen die soms niet zichtbaar waren in e-mails worden nu getoond.

Beheer:
- Rapportage CRM – Verzekeringsportefeuille heeft een kolom Premievervaldatum.
- In Fastlane zijn Veilig Ophalen-gegevens uit eBlinqx op te halen.
- Technische vernieuwing onder de motorkap.

## Office 365 verzenden, Adviesbox Online en Yes-co (28 maart 2025)

E-mail:
- Uitgaande mail kan via de Office 365-server lopen, per mailbox in te stellen in de e-mailmanager. Verzonden items zijn dan ook in Office 365 (bijvoorbeeld op mobiel) zichtbaar en DKIM, SPF en DMARC hoeven niet meer apart te worden ingesteld.
- Na het wisselen van verzendmethode moet de mailbox opnieuw worden geauthentiseerd. Bij gedeelde mailboxen doe je dit in het hoofdaccount; mogelijk zijn aanpassingen in Office 365 nodig via de ICT-beheerder.
- Nieuwe map "Verzenden mislukt" met mogelijkheid tot opnieuw verzenden.

Alleen in eBlinqx: HDN en koppelingen:
- Export naar Adviesbox Online zonder handmatig uploaden van het .hbx-bestand; vraagt inrichting aan beide kanten.
- Relatie exporteren naar Yes-co via het tabblad Export – Yes-co (aanvragen bij support).
- Ockto gebruikt een vernieuwde techniek voor ODM-berichten; functioneel verandert er niets.
- De Figlo-knoppen (Advisor en Start) hebben aparte rechten.

Alleen in eBlinqx: stukken en weergave:
- Naast Uwkluis wordt nu ook in eBlinqx de geldigheid van het identiteitsbewijs gecontroleerd. Verschillen in NAWTE-gegevens zie je in het tabblad Mutaties, waar je kiest wat je overneemt.
- Nieuw lettertype door heel eBlinqx; huisstijl en correspondentie blijven ongewijzigd.

Boekhouding en facturatie:
- Een foutieve batch (bijvoorbeeld ongeldige PFUNK-code of ontbrekende boekhoudperiode) houdt andere batches niet meer tegen.
- Servicecontracten staan nu goed op de TP-incassofactuur.

Schade/leven/hypotheek:
- Naast de schadeclassificatie is er weer een veld Oorzaak (vaste SIVI-lijst); de classificatie is niet meer verplicht.
- Document verblijfsvergunning kan worden getekend voor gezien.
- Nieuw product Scildon Lifestyle Hypotheek ORV via de updateknop.

Beheer:
- Rapportage Overzicht schademeldingen toont optioneel openstaande taken en polisnummer; de API is uitgebreid.

Let op:
- Identiteitsgegevens worden vergeleken en kunnen in het dossier worden doorgevoerd (AVG): controleer wijzigingen voor je ze accepteert.

## Uwkluis, schademelding en Finly (14 februari 2025)

Alleen in eBlinqx:
- Actieknoppen (opslaan, aanmaken) blijven bij scrollen in beeld.
- Nieuwe rapportage "CRM – Pijplijn met gekoppelde dienst" om inkomsten per dienst en de verwachte ontvangst te zien.

HDN en koppelingen:
- Finly-formulieren kunnen nu ook vanuit zakelijke dossiers worden opgevraagd, en alle formulieren van het gekoppelde account zijn selecteerbaar.
- Het label Dynamic Hypotheken (Lekker Wonen) met eigen producten, certificaatnummer en maatschappijcode komt op 19 februari via de updateknop beschikbaar.

Uwkluis:
- Per product wordt de adviseur getoond (de persoon moet op publiek staan in Beheer).
- Bij verzoeken staat de naam van de persoon voor wie het verzoek is.

Schade/leven/hypotheek:
- Schademelding: nieuwe velden, waaronder interne notities, referentienummer agent, schadelocatie, eigen risicobedrag en de optie "Onbekend" bij enkele ja/nee-velden. Omschrijving en interne notitie staan bij openen bovenaan.
- Het veld Oorzaak toont schadeclassificaties; zelf oorzaken beheren kan niet meer en bestaande oorzaken verhuizen naar de interne notitie.
- Werkmaterieel (landbouwmaterieel): kenteken in de polisomschrijving en alle materieel in het uitgeklapte pakket.

Boekhouding en facturatie:
- De module Handmatig Prolongeren heeft een kolom Provisie en een veld Totaal.

Beheer:
- Rapportages uitgebreid met extra kolommen (o.a. verzend- en ontvangstdatum opdrachtbevestiging).
- Support krijgt een signaal als het proces voor e-mail ophalen vastloopt.

Let op:
- Automatisch censureren maakt nu ook QR-codes zwart (AVG).
- Aan de rapportage Aanstellingen per kantoor is het AFM-vergunningsnummer als kolom toegevoegd; gebruik dit bij controle van aanstellingen en vergunningen.`}
]);
