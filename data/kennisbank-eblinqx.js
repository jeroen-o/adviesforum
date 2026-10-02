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
- Controleer na een release of je rechten en instellingen nog kloppen.`}
]);
