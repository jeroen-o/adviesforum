# Toegankelijkheid en donkere modus

Peildatum: 3 oktober 2026. Norm: WCAG 2.2, niveau AA.

## Toegankelijkheidsverklaring (concept)

**Status: voldoet gedeeltelijk aan WCAG 2.2 niveau AA.**

Het Adviesforum wil voor iedere adviseur goed bruikbaar zijn, ook met een toetsenbord, een schermlezer, vergroting of een donkere weergave. Deze verklaring geldt voor de website op adviesforum.nl.

### Wat er is getest

- **Automatisch:** met axe-core 4 (regels voor WCAG 2.0, 2.1 en 2.2 A en AA, plus best practices). Dat is gedaan in Chromium op 390 en 1280 pixels breed, telkens in een lichte en een donkere weergave.
- **Welke pagina's:**
  - alle losse pagina's in de hoofdmap: hulpmiddelen, rekenhulpen, klantscans, formulieren, 404 en beheer-code;
  - een steekproef uit `kennisbank/`, `faq/`, `begrippen/` en `vraag/`.
- **Eigen controles per pagina:**
  - taal (`lang`);
  - één h1 en geen overgeslagen kopniveaus;
  - landmarks (header, main, nav, footer);
  - een skiplink;
  - alt-teksten;
  - vage linkteksten;
  - aria-live bij uitkomsten die veranderen;
  - prefers-reduced-motion;
  - geen horizontale scroll;
  - zichtbare focus en geen focusval (zo'n 40 tabstops per pagina).
- **Interacties:**
  - knoppen, tabbladen en uitklappers aangeklikt, daarna opnieuw het contrast gecontroleerd in licht en donker;
  - doorlopen: oefenvragen, e-learning, een ingevulde klantscan, de Wwft-checklist en nazorgsignalen;
  - in het forum sluit Escape het inlogvenster en gaat de focus terug naar de knop.

### Wat er is verbeterd

- **Skiplink en landmarks:** elke pagina heeft een skiplink "Naar de inhoud" en een `<main>`. De terugkoppeling staat in een `<nav>`. Losse compliance-blokken buiten de hoofdinhoud zijn `<aside>` geworden, en introductieblokken hebben een naam.
- **Focus:** overal een duidelijke focusrand. In de lichte weergave is die zwart, in de donkere weergave geel. Dat geldt ook voor datumvelden.
- **Bewegingen:** worden uitgezet bij "minder beweging" (prefers-reduced-motion).
- **Scrollbare tabellen en tekstvakken:** zijn met het toetsenbord te bereiken en hebben een naam.
- **Koppen:** de kopstructuur is hersteld in de nazorgsignalen, de Wwft-checklist en de statische FAQ- en begrippenpagina's.
- **Tabbladen:** die bij de leennormen gebruiken nu `aria-pressed`, in plaats van een onvolledige tablist.
- **Tellers:** de tellers bij de zoek- en filterpagina's (kalender, wetgeving, werkinstructie en compliance-overzicht) worden voorgelezen.
- **Donkere modus:** die volgt de systeeminstelling (`prefers-color-scheme: dark`):
  - achtergrond #141414 en vlakken #1E1E1E en #262626;
  - tekst #F2F2F2 en randen #333;
  - knoppen en accenten in geel #FFD200 met donkere tekst.

  Printen en de printvensters blijven licht. Net als in index.html zet `data-theme="light"` op `<html>` de donkere modus uit.

### Bekende beperkingen

- **index.html (het forum)** heeft nog enkele bevindingen. Zie de lijst hieronder.
- **Niet meegenomen in deze ronde**, omdat er tegelijk aan werd gewerkt: adviesroute.html, sjablonen.html, aanbieders.html, aanbieder-beheer.html, de nieuwe aanbiederspagina's (aanbieders-info, aanbieders-voorwaarden, aanbieder-aanleveren), koppelingen.html en privacy.html.
- **Printvensters en als PDF bewaarde documenten** zijn niet apart op toegankelijkheid getest. Een PDF uit de browser is meestal geen getagde PDF.
- **Niet handmatig getest:**
  - met een schermlezer (NVDA, VoiceOver);
  - bij 200 en 400 procent zoom;
  - met aangepaste tekstafstand (WCAG 1.4.12).
- **Automatische donkere modus:** de donkere kleuren op de hulpmiddelpagina's worden per pagina afgeleid uit de eigen kleuren. Getest zijn de beginstand en een reeks interacties, maar niet elke denkbare toestand.
- **beheer-code.html** is een interne, niet gelinkte beheerpagina en heeft bewust geen header, navigatie of footer.
- **Externe bronnen:** links naar externe websites (wetten.overheid.nl, AFM, Belastingdienst en andere) vallen buiten deze verklaring.

### Contact

Loop je tegen een probleem aan, of kun je iets niet gebruiken? Mail naar jeroen@oversteegen.nl. Vermeld de pagina en wat er misging.

## Nog te doen in index.html

Gevonden met dezelfde audit op 390 en 1280 pixels, in licht en donker. index.html valt buiten deze ronde en is niet aangepast.

1. **Skiplink ontbreekt** (WCAG 2.4.1). Zet een link "Naar de inhoud" als eerste element in `<body>`, naar `<main id="…" tabindex="-1">`. Neem de stijl `.skiplink` over uit een van de hulpmiddelpagina's: verborgen tot hij focus krijgt, zwart met witte tekst, en in de donkere modus geel.
2. **Contrast in de donkere modus** (1.4.3, ernstig):
   - **Knop "Inloggen adviseur"** (`button[data-act="inloggen"]`): de tekst is #E9EFF3 op een witte achtergrond, contrast 1.15:1. De knop houdt in donker een vaste witte achtergrond. Gebruik een token, zoals `var(--surface)`.
   - **Teller in de categorieknop "Alle"** (`button[data-cat="alle"] .n`): #A8B3BD op geel #FFCD00 geeft 1.42:1. Maak de tekst op geel donker (#141414).
   - **Knop "Alle" zelf op 390 px:** #111111 op #1A232C geeft 1.18:1. Tekstkleur en achtergrond in donker gelijktrekken.
3. **Grootte van klikdoelen** (2.5.8, ernstig):
   - **Op 390 px** zijn de tabknoppen in de alinea (`p > button[data-act="tab"]`: handleiding, voor wie, hulpmiddelen) kleiner dan 24 × 24 px en staan ze te dicht op elkaar. Geef ze `min-height:24px`, wat padding of meer onderlinge ruimte.
   - **Op 1280 px** geldt hetzelfde voor de links naar privacy.html en nieuw.html in de footer: vergroot de regelhoogte of de padding, of zet er meer ruimte tussen.
4. **Koppenstructuur** (1.3.1, matig): in de zijbalk (`.side`) volgt de h3 "Categorieën" direct op de h1. Maak er een h2 van en pas de CSS aan.
5. **Twee zijbalken met dezelfde naam** (matig): `<aside class="side">` komt meer dan eens voor zonder een eigen naam. Geef elke aside een eigen `aria-label`, bijvoorbeeld "Categorieën" en "Filters", of houd er per weergave één over.
6. **Inhoud buiten landmarks** (matig): de balk `.demo` bovenaan staat buiten header en main. Zet hem in de `<header>` of maak er een `<aside aria-label="Over deze versie">` van.
7. **Huisstijl van de donkere modus:** index.html gebruikt blauwgrijze tokens (#121920, #1A232C, accent #7FB7C9). De andere pagina's gebruiken nu #141414, #1E1E1E, #262626, tekst #F2F2F2, randen #333 en geel #FFD200. Voor een consistente site kun je de tokens in index.html daarop afstemmen. Dit is een aanbeveling, geen WCAG-fout.
8. **Navigatie tussen schermen in de app:** niet getest. Controleer of de focus bij een routewissel (hashchange) naar de nieuwe h1 of main gaat, of dat de nieuwe titel via een aria-live-regio wordt aangekondigd. Zonder dat merkt een schermlezergebruiker de wissel niet op.

Wat in index.html al goed is:

- `lang="nl"`;
- één h1;
- header, main, nav en footer;
- een zichtbare focusrand, zonder focusval;
- prefers-reduced-motion;
- een toast met `role="status"`;
- het inlogvenster (`<dialog>` met `showModal`) sluit met Escape en geeft de focus terug.

## Technische aantekeningen

- **Hulpmiddelpagina's:** het blok `<style id="a11y">` staat als laatste in de `<head>`. Printvensters nemen alleen de eerste `<style>` over en blijven daardoor licht. Ook de donkere regels gelden alleen voor `screen`.
- **Opbouw van de donkere regels:** voor elke CSS-regel van de pagina met een kleur is een donkere variant opgenomen, met dezelfde selector achter `:root:not([data-theme="light"])`. De volgorde van de cascade blijft zo gelijk.
- **Aanpassen:** pas je de lichte CSS van een hulpmiddelpagina aan? Controleer dan ook het donkere blok van die pagina.
- **Statische pagina's** (kennisbank, faq, begrippen, vraag): stijl en structuur komen uit `tools/build-static.js`. Draai daarna `node tools/build-static.js` en `node tools/build-static.js --check`.
