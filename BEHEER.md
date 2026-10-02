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
1. Een adviseur stelt een vraag op het forum. Naam, e-mail, telefoon, LinkedIn en de vraag komen per e-mail binnen op forumadvies@gmail.com (via FormSubmit).
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

Na `herzienVoor` toont het forum automatisch "Mogelijk verouderd". Filter in de kennisbank op **Herziening nodig** voor het overzicht.

### Goedkeuring afdwingen (eenmalig instellen)
Settings → Branches → Add branch ruleset voor `main`:
- Require a pull request before merging
- Require approvals (1) en Require review from Code Owners
- Require status checks to pass: `tests`

Vul in `.github/CODEOWNERS` de GitHub-naam van de compliance officer in.

## Formulieren (FormSubmit)
Aanmelden, vraag stellen en "niets gevonden" sturen een e-mail via FormSubmit naar forumadvies@gmail.com. Na de eerste inzending vanaf de live site komt er een activatiemail: klik op **Activate Form**. Vraagt FormSubmit later opnieuw om activatie (bijvoorbeeld vanaf een andere pagina), doe dat dan ook.

Het mailadres staat in `aanmelden.html` (`ONTVANGER`), `index.html` (`FORM_MAIL`) en `privacy.html`.

## AVG: nog te regelen
- [ ] Een zakelijk mailadres op een eigen domein in plaats van Gmail (met Gmail is geen verwerkersovereenkomst mogelijk).
- [ ] Verwerkersovereenkomst of voorwaarden van FormSubmit beoordelen.
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
