# Beheer van het Adviesforum

Het Adviesforum is een statische website op GitHub Pages: geen database, geen accounts, geen build-stap. Alle inhoud staat in deze repository. Elke wijziging op `main` staat binnen ongeveer een minuut live.

## Waar staat wat

| Bestand | Inhoud |
|---|---|
| `data/adviseurs.js` | adviseurs die antwoorden geven (handmatig toegevoegd door de beheerder) |
| `data/vragen.js` | gepubliceerde vragen en antwoorden |
| `data/kennisbank.js` | kennisbankartikelen, met houdbaarheid en controlestatus |
| `data/faq/*.js` | veelgestelde vragen per thema |
| `data/begrippen.js` | begrippenlijst A-Z |
| `*.html` (behalve `index.html`) | rekenhulpen, wetgeving, werkinstructie, aanmelden, privacy |
| `documenten/` | bronbestanden (Nibud, AFM) |
| `tests/` | automatische tests (draaien bij elke pull request) |

## Een vraag publiceren
1. Een adviseur stelt een vraag op het forum. Naam, e-mail, telefoon, LinkedIn en de vraag komen per e-mail binnen op forumadvies@gmail.com (vanuit het mailprogramma van de vraagsteller).
2. Controleer of de vraagsteller financieel adviseur is (LinkedIn) en of de vraag geen klantgegevens bevat.
3. Voeg de vraag toe in `data/vragen.js` met alleen het veld `naam`. Zet **nooit** e-mail, telefoon of LinkedIn in de repository: die is openbaar.

## Een adviseur toevoegen
Na een aanmelding via `aanmelden.html`: voeg een regel toe in `data/adviseurs.js` met id, naam, functie, kantoor en rol. Geen contactgegevens.

## Kennisbank: wijzigen en laten controleren
1. Open `data/kennisbank.js` op GitHub en klik op het potlood (Edit).
2. Pas het artikel aan. Zet `herzienVoor` op de datum waarvoor het opnieuw gecontroleerd moet zijn (normen: 31 december van het jaar).
3. Kies onderaan **Create a new branch for this commit and start a pull request**.
4. Compliance bekijkt de wijziging in de pull request en keurt goed (Review → Approve). Pas dan `gecontroleerd:true` en `gecontroleerdOp` zetten en mergen.
5. De tests draaien automatisch; merge alleen als ze groen zijn.

**Let op: `gecontroleerd:true` zet het artikel ook bij Fin (Intercom).** Na de merge publiceert de Intercom-sync het artikel en mag Fin het gebruiken; zonder `gecontroleerd:true` blijft het een concept dat Fin niet gebruikt. In de pull request toont de workflow Intercom-sync als proefrun wat er naar Fin zou gaan. Zie [docs/intercom-sync.md](docs/intercom-sync.md).

Na `herzienVoor` toont het forum automatisch "Mogelijk verouderd". Filter in de kennisbank op **Herziening nodig** voor het overzicht.

### Goedkeuring afdwingen (eenmalig instellen)
Settings → Branches → Add branch ruleset voor `main`:
- Require a pull request before merging
- Require approvals (1) en Require review from Code Owners
- Require status checks to pass: `tests`

Vul in `.github/CODEOWNERS` de GitHub-naam van de compliance officer in.

## Geverifieerde gebruikers
Vragen stellen kan zonder inloggen; de vraagsteller vult wel een geldig LinkedIn-profiel in en meldt zich aan via aanmelden.html. Controleer de aanmelding (LinkedIn, kantoor, functie). Keur je goed, open dan `beheer-code.html` (niet gelinkt) en maak een persoonlijke inlogcode. Zet de regel die de pagina maakt in `data/adviseurs.js` (met `geverifieerd:true` en `codeHash`; de code zelf staat nooit in de repo) en stuur de inloglink (of de code) alleen naar de adviseur. Eén klik op de link en de adviseur is ingelogd en wordt onthouden. Op het forum verschijnt dan "✓ Geverifieerd" bij de naam en kan de adviseur inloggen om te antwoorden. Code kwijt: maak een nieuwe en vervang de regel. Blokkeren: regel verwijderen of `geverifieerd:false`.

Antwoorden worden niet op de site opgeslagen: na plaatsen opent het mailprogramma van de adviseur met het antwoord aan de beheerder. Voeg goedgekeurde antwoorden toe in `data/vragen*.js`. Alleen naam, functie en kantoor zijn openbaar.

## Formulieren (via het mailprogramma, geen formulierdienst)
Aanmelden, vraag stellen en "niets gevonden" openen het mailprogramma van de bezoeker met een kant-en-klare e-mail aan forumadvies@gmail.com (net als op dierenkliniek.nl). De bezoeker klikt op Verzenden; de mail komt van zijn eigen adres binnen, zodat je direct kunt antwoorden. Er is geen activatie, geen externe dienst en geen opslag. Opent er geen mailprogramma, dan kan de bezoeker de tekst kopiëren.

Het mailadres staat in `aanmelden.html` (`ONTVANGER`), `index.html` (`FORM_MAIL`) en `privacy.html`.

## AVG: nog te regelen
- [ ] Een zakelijk mailadres op een eigen domein in plaats van Gmail (met Gmail is geen verwerkersovereenkomst mogelijk).
- [ ] Bewaartermijnen in `privacy.html` bevestigen of aanpassen.
- [ ] Verantwoordelijke organisatie in `privacy.html` invullen als dat niet "de beheerder" is.

## Eigen domein
1. Koop een domein, bijvoorbeeld `adviesforum.nl`.
2. DNS: A-records naar 185.199.108.153, 185.199.109.153, 185.199.110.153 en 185.199.111.153 (en AAAA naar 2606:50c0:8000::153 t/m 2606:50c0:8003::153), of voor een subdomein een CNAME naar `jeroen-o.github.io`.
3. GitHub: Settings → Pages → Custom domain invullen en **Enforce HTTPS** aanzetten.

## Tests lokaal draaien
```
npm ci
npx playwright install chromium
npx playwright test
```
Elke maandag controleert een workflow ook alle externe links (`.github/workflows/links.yml`).
