# Werkinstructie: aanbieders aansluiten en beheren

Voor de beheerder van het Adviesforum. Beschrijft hoe een aanbieder (geldverstrekker, verzekeraar, pensioenuitvoerder, kredietverstrekker of serviceprovider) een account krijgt op `aanbieders.html` / `aanbieder-beheer.html`, hoe wijzigingen worden gepubliceerd en hoe een deelname eindigt.

Betrokken bestanden:

| Bestand | Rol |
| --- | --- |
| `aanbieders.html` | Openbare aanbiederspagina met aanvraagblok |
| `aanbieders-info.html` | Informatiepagina voor aanbieders (werving) |
| `aanbieders-voorwaarden.html` | Deelnamevoorwaarden (**concept, juridisch laten toetsen**) |
| `aanbieder-beheer.html` | Inloggen, bewerken en indienen door de aanbieder (met verplicht akkoord op de voorwaarden) |
| `beheer-code.html` | Persoonlijke inlogcode en `codeHash` maken (niet gelinkt) |
| `data/aanbieders.js` | De gepubliceerde gegevens van alle aanbieders |
| `tools/aanbieder-import.js` | Ingediende JSON valideren en in `data/aanbieders.js` zetten |

---

## 1. Aanvraag ontvangen

Aanvragen komen binnen op forumadvies@gmail.com met onderwerp **Accountaanvraag aanbieder Adviesforum**. Controleer of de mail bevat:

- [ ] bedrijfsnaam en type aanbieder;
- [ ] AFM-vergunningnummer, of een uitleg waarom geen vergunning nodig is;
- [ ] website;
- [ ] vaste contactpersoon: naam, functie, **zakelijk** e-mailadres en telefoonnummer;
- [ ] de bevestiging dat de voorwaarden zijn gelezen en dat er geen rentes, tarieven, premies of acties worden geplaatst.

Komt de mail van een privé-adres (gmail, hotmail en dergelijke) of van een domein dat niet bij de website past? Vraag dan om een aanvraag vanaf het zakelijke domein, of bel het algemene nummer van de aanbieder (van de eigen website, niet uit de mail) om de aanvraag te verifiëren.

Leg de aanvraag vast (datum, aanbieder, contactpersoon, besluit) in je eigen administratie. Zet geen persoonsgegevens in de repository behalve de zakelijke contactgegevens die de aanbieder zelf publiceert.

## 2. Vergunning controleren

1. Zoek de aanbieder op in het **AFM-register financiële dienstverleners**:
   <https://www.afm.nl/en/sector/registers/vergunningenregisters/financiele-dienstverleners>
   (overzicht van alle AFM-registers: <https://www.afm.nl/en/sector/registers/vergunningenregisters>)
2. Banken, verzekeraars en pensioenfondsen staan (ook) in het **openbaar register van De Nederlandsche Bank**: <https://www.dnb.nl/openbaar-register/>
3. Controleer: de naam klopt met de aanvraag, de vergunning is actief, en de vergunning past bij wat de aanbieder doet (bijvoorbeeld aanbieden van hypothecair krediet, schadeverzekeringen of levensverzekeringen).
4. Kijk ook bij de waarschuwingen van de AFM of er iets over de partij bekend is.
5. Geen vergunning nodig (bijvoorbeeld een serviceprovider die zelf geen financiële producten aanbiedt)? Beoordeel de uitleg en noteer waarom je akkoord bent.

Twijfel je, wijs de aanvraag dan af of vraag om aanvullende informatie. Sla een schermafdruk of notitie van de registercontrole op in je eigen administratie, met datum.

## 3. Code maken en aanbieder aanmaken

1. Kies een **id**: kleine letters, cijfers en streepjes, max. 40 tekens, uniek in `data/aanbieders.js` (bijvoorbeeld `bank-noord-hypotheken`).
2. Maak een startbestand `aanbieder-<id>.json` met minimaal `id`, `naam` en `type` en voeg het toe:

   ```bash
   node tools/aanbieder-import.js aanbieder-<id>.json --nieuw
   ```

   (Alternatief: zet het object met de hand in `data/aanbieders.js`.)
3. Open `beheer-code.html` lokaal in de browser, kies **Aanbieder**, vul het id in en klik op **Maak code**.
4. Zet de getoonde regel `"codeHash": "…"` in het object van de aanbieder in `data/aanbieders.js` (bijvoorbeeld direct na `"id"`).
5. Zet **`"demo": false`** (of verwijder `demo`) bij deze aanbieder. Alleen fictieve voorbeelden hebben `demo: true`.
6. Noteer de code tijdelijk op een veilige plek tot je hem hebt verstuurd. Zet de code zelf **nooit** in de repository, een commitbericht of een PR; alleen de hash.
7. Zijn er echte aanbieders online, verwijder dan de fictieve voorbeeldaanbieders (`demo: true`) uit `data/aanbieders.js`.

Publiceer deze wijziging zoals in stap 6 en 7 hieronder (test, commit, PR). Na publicatie werkt de code.

## 4. Code veilig naar de aanbieder sturen

- Stuur de **bevestigingsmail** (sjabloon B hieronder) naar het zakelijke adres van de contactpersoon, **zonder** de code.
- Stuur de **code via een apart kanaal**: bijvoorbeeld een sms of Signal-bericht naar het zakelijke mobiele nummer, telefonisch voorlezen, of een aparte tweede mail. Nooit in dezelfde mail als de link naar de beheerpagina.
- Code kwijt of mogelijk uitgelekt? Maak een nieuwe code (stap 3.3 en 3.4); de oude werkt na publicatie niet meer.

## 5. Wijzigingen ontvangen en publiceren

De aanbieder dient in via `aanbieder-beheer.html`, na een verplicht akkoord op de deelnamevoorwaarden. Je ontvangt een mail met onderwerp **Wijziging aanbieder &lt;id&gt; (&lt;naam&gt;)** met een JSON-blok in de tekst, of een bijlage `aanbieder-<id>.json`.

1. Controleer of de mail echt van de vaste contactpersoon (of het bekende domein) komt.
2. Zet de JSON in een bestand `aanbieder-<id>.json` (buiten de repository of niet committen). Bij een JSON-blok in de mail: kopieer alleen wat tussen `--- JSON (niet aanpassen) ---` en `--- einde JSON ---` staat.
3. Eerst controleren zonder te schrijven:

   ```bash
   node tools/aanbieder-import.js aanbieder-<id>.json --dry-run
   ```

4. Fouten: stuur de aanbieder een korte uitleg terug. Waarschuwingen (bijvoorbeeld een tekst die op een rente, premie of actie lijkt): beoordeel ze inhoudelijk. Bij twijfel niet publiceren en navragen.
5. Lees de inhoud zelf ook na op de inhoudsregels uit de voorwaarden: geen rentes, tarieven, premies, acties of wervende claims; correct, duidelijk en niet misleidend; contactpersonen alleen met zakelijke gegevens.
6. Verwerken:

   ```bash
   node tools/aanbieder-import.js aanbieder-<id>.json
   git diff data/aanbieders.js
   ```

   Het script neemt `codeHash` en `demo` altijd over uit de bestaande versie; een aanbieder kan die dus niet zelf wijzigen.

## 6. Testen

```bash
npx playwright test
```

Alle tests moeten slagen. Bekijk daarnaast `aanbieders.html#aanbieder-<id>` lokaal in de browser.

## 7. Commit en PR

```bash
git checkout -b aanbieder-<id>-<datum>
git add data/aanbieders.js
git commit -m "Aanbieder <id>: wijzigingen van <datum> gepubliceerd"
git push -u origin HEAD
gh pr create --fill
```

Na merge staat de wijziging op GitHub Pages. Laat de aanbieder kort weten dat de wijziging online staat (of wat je hebt geweigerd en waarom). Verwijder daarna het lokale `aanbieder-<id>.json`.

## 8. Periodieke controle (elk kwartaal)

Plan elk kwartaal (bijvoorbeeld de eerste werkdag van januari, april, juli en oktober) een check:

- [ ] **Verouderd nieuws**: berichten ouder dan 12 maanden, of berichten die door nieuwer beleid achterhaald zijn. Vraag de aanbieder ze op te ruimen; ruim zelf op als er geen reactie komt.
- [ ] **Bijgewerkt-datum**: aanbieders die langer dan 6 maanden niets hebben bijgewerkt, krijgen een herinnering.
- [ ] **Kapotte links**: controleer website, extranet, documenten en e-learning. Voorbeeld:

  ```bash
  node -e "global.window={};require('./data/aanbieders.js');for(const a of window.AANBIEDERS){const u=[a.website,a.extranet&&a.extranet.url,...(a.documenten||[]).map(d=>d.url),...(a.elearning||[]).map(e=>e.url),...(a.nieuws||[]).map(n=>n.url)].filter(Boolean);for(const x of u)console.log(a.id+'\t'+x)}" > links.txt
  while IFS=$'\t' read id url; do code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "$url"); [ "$code" -ge 400 ] || [ "$code" = 000 ] && echo "$id $code $url"; done < links.txt
  ```

- [ ] **Vergunning**: steekproef in het AFM-register of de vergunningen nog actief zijn.
- [ ] **Contactpersonen**: vraag de aanbieder eens per jaar te bevestigen dat de vermelde personen er nog werken en akkoord zijn.
- [ ] **Inhoudsregels**: zoek in `data/aanbieders.js` op `%`, `rente`, `premie`, `actie`, `korting`, `gratis`.

## 9. Beëindigen

Bij opzegging door de aanbieder, vervallen vergunning, herhaalde overtreding van de voorwaarden of langdurig niet bijhouden:

1. Mail de contactpersoon (bij beëindiging door het forum: vooraf, met reden, zie artikel 9 van de voorwaarden).
2. Verwijder het object van de aanbieder uit `data/aanbieders.js`. Daarmee verdwijnen profiel, nieuws en code tegelijk. Wil je eerst alleen de toegang intrekken, verwijder dan alleen `codeHash`.
3. Test (`npx playwright test`), commit en PR zoals hierboven.
4. Bevestig de beëindiging per mail en noteer datum en reden in je administratie.
5. Bestaande deellinks naar nieuwsberichten tonen daarna de melding dat het bericht niet meer bestaat.

---

## Sjabloon A: uitnodigingsmail aan een aanbieder

**Onderwerp:** Uw informatie voor adviseurs op het Adviesforum

> Geachte heer/mevrouw [naam],
>
> Het Adviesforum is een kennisplatform voor financieel adviseurs op het gebied van hypotheken, verzekeringen, pensioen en krediet. Adviseurs zoeken er dagelijks naar actuele acceptatiegidsen, voorwaarden, werkafspraken en het juiste aanspreekpunt bij aanbieders.
>
> Op onze aanbiederspagina kan [naam aanbieder] die informatie zelf bijhouden:
>
> - nieuws over wijzigingen in beleid, acceptatie of processen;
> - links naar voorwaarden, acceptatiegidsen, productbladen en formulieren;
> - richtlijnen en werkafspraken voor adviseurs;
> - de link naar uw extranet of adviseursportaal;
> - zakelijke contactgegevens van accountmanagers;
> - e-learning en webinars.
>
> Rentes, tarieven, premies en acties plaatsen we bewust niet: de pagina is informatief en geen reclame. Wijzigingen worden voor publicatie gecontroleerd.
>
> [Te bevestigen door de eigenaar: Deelname is in de opstartfase kosteloos; voorwaarden kunnen wijzigen.]
>
> Meer informatie en de deelnamevoorwaarden vindt u op:
> https://jeroen-o.github.io/adviesforum/aanbieders-info.html
> https://jeroen-o.github.io/adviesforum/aanbieders-voorwaarden.html
>
> Een account aanvragen kan via de knop op de informatiepagina of door deze mail te beantwoorden met uw bedrijfsnaam, AFM-vergunningnummer en een vaste contactpersoon (naam, functie, zakelijk e-mailadres en telefoonnummer).
>
> Met vriendelijke groet,
>
> [naam]
> Beheer Adviesforum
> forumadvies@gmail.com

## Sjabloon B: bevestigingsmail na goedkeuring (zonder code)

**Onderwerp:** Uw account voor het Adviesforum is klaar

> Beste [naam contactpersoon],
>
> Uw aanvraag voor [naam aanbieder] is goedgekeurd. U kunt uw informatie voor adviseurs nu zelf bijhouden.
>
> **Uw persoonlijke inlogcode ontvangt u apart**, via [sms / telefoon / een aparte mail]. Om veiligheidsredenen staat de code niet in deze mail.
>
> Zo gaat u te werk:
>
> 1. Ga naar https://jeroen-o.github.io/adviesforum/aanbieder-beheer.html
> 2. Vul de code in (vorm XXXX-XXXX-XXXX) en klik op Inloggen.
> 3. Vul uw gegevens, nieuws, documenten, richtlijnen, extranetlink, contactpersonen en e-learning in. Rechts of onder het formulier ziet u direct een voorbeeld.
> 4. Vink aan dat u akkoord gaat met de deelnamevoorwaarden en klik op **Wijzigingen indienen per mail** (of download het bestand en stuur het als bijlage).
> 5. Wij controleren de wijziging en publiceren die, meestal binnen één werkdag. U krijgt bericht als er iets niet klopt.
>
> Goed om te weten:
>
> - Wijzigingen staan alleen in uw browsertabblad tot u indient. Verversen of sluiten betekent dat niet-ingediende wijzigingen verloren gaan.
> - Plaats geen rentes, tarieven, premies of acties.
> - Vermeld contactpersonen alleen met zakelijke gegevens en met hun toestemming.
> - Houd de code geheim en deel hem alleen binnen uw organisatie. Code kwijt of uitgelekt? Mail ons, dan maken we een nieuwe en vervalt de oude.
>
> De deelnamevoorwaarden: https://jeroen-o.github.io/adviesforum/aanbieders-voorwaarden.html
>
> Met vriendelijke groet,
>
> [naam]
> Beheer Adviesforum
> forumadvies@gmail.com

## Sjabloon C: bericht met de code (apart kanaal)

> Adviesforum: uw inlogcode voor aanbieder-beheer.html is [XXXX-XXXX-XXXX]. Deel deze code niet buiten uw organisatie.
