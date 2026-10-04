# Draaiboek jaarwisseling normen

Elk jaar per 1 januari veranderen de normen waar de rekenhulpen op rekenen. Dit draaiboek wordt gebruikt door de
routines van half december (voorbereiden) en begin januari (afronden), en door iedereen die de normen bijwerkt.

## Uitgangspunten

- **Alleen officiële bronnen**: Staatscourant/overheid.nl (Tijdelijke regeling hypothecair krediet), Nibud (advies
  hypotheeknormen), NHG (Voorwaarden & Normen en bijlagen), Belastingdienst, SVB, UWV, Rijksoverheid, AFM (toetsrente).
  Geen vergelijkingssites of nieuwsberichten als bron voor een getal.
- **Niets verzinnen**: is een norm nog niet officieel gepubliceerd, dan blijft de oude waarde staan en wordt dat gemeld.
- **Geen gedeeltelijke jaarwissel in de rekentools**: een rekenhulp rekent óf volledig met het nieuwe jaar, óf (nog)
  met het oude jaar. Vermeld het jaar altijd zichtbaar (peildatum).
- **Compliance**: elke gewijzigde norm komt in de PR-beschrijving met bron en oude en nieuwe waarde, zodat compliance
  het kan nakijken. Zet `gecontroleerd: false` in `js/rekentools/normen.js` tot compliance akkoord geeft.

## Waar de normen staan

| Wat | Bestand | Bron |
|---|---|---|
| Fiscale normen (box 1-tarieven, heffingskortingen, eigenwoningforfait, Hillen, box 3, schenk- en erfbelasting, jaarruimte, AOW-bedragen, minimumloon, enz.) | `js/rekentools/normen.js` (`RT.normen`, met `peildatum`, `_bronnen`, `_geverifieerd`) | Belastingdienst, SVB, UWV, Rijksoverheid |
| Leennormen: financieringslastpercentages, toetsrente, studieschuld, energielabel | `leennormen-2026.html` (en verwijzingen ernaar) | Trhk/Staatscourant, Nibud, AFM |
| NHG-grens, kostengrens, borgtochtprovisie | `nhg-check.html`, `data/kennisbank-nhg.js` | NHG Voorwaarden & Normen |
| NHG-financieringslasttabel beheer | `data/nhg-beheer-financieringslast-2026.js`, `nhg-beheertoets.html` | NHG bijlage 5 |
| Teksten met jaartallen of bedragen | kennisbank (`data/kennisbank*.js`), FAQ (`data/faq/`), begrippen, `index.html` (hulpmiddelen) | idem |

Zoek de plekken met het oude jaar met:

```
grep -rln "2026" --include=*.html --include=*.js . | grep -v -E "node_modules|^./vraag/|^./kennisbank/|^./faq/|data/vragen"
```

Let op: niet elk "2026" is een norm (datums van artikelen, controles en bronnen blijven gewoon staan).

## Werkwijze

1. **Half december (voorbereiden)**: zoek per regel in de tabel hierboven of de nieuwe norm al officieel is
   gepubliceerd. Maak een werklijst `docs/normen-<jaar>.md` met per norm: oude waarde, nieuwe waarde, bron (URL en datum),
   status (gepubliceerd / nog niet). Pas nog niets aan in de rekentools.
2. **Begin januari (afronden)**: werk de normen bij waarvan de nieuwe waarde officieel is:
   - `js/rekentools/normen.js`: waarden, `peildatum`, `_bronnen`, `_geverifieerd`, `gecontroleerd: false`;
   - leennormen: maak `leennormen-<jaar>.html` (kopie met nieuwe tabellen) en laat de oude pagina staan met een
     verwijzing naar de nieuwe; pas links in `index.html` (hulpmiddelen) en `rekentools.html` aan;
   - NHG: `nhg-check.html`, `data/kennisbank-nhg.js`, en een nieuw `data/nhg-beheer-financieringslast-<jaar>.js`
     als NHG een nieuwe bijlage 5 publiceert;
   - pas tests aan die bewust op het oude jaar controleren (`tests/rekenhulpen.spec.js`, `tests/rekentools.spec.js`).
3. Draai `node tools/build-rekentools-index.js`, `node tools/build-feed.js`, `node tools/build-static.js`,
   `node tools/build-static.js --sitemap` en `npx playwright test`.
4. Voeg bovenaan `var L=[` in `nieuw.html` een item toe (th:'reken'), maak een PR met de normentabel (oud, nieuw, bron)
   en merge pas als de GitHub-workflow Tests groen is.
5. Meld wat nog niet gepubliceerd was; die normen volgen in een latere ronde.
