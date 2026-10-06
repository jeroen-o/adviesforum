# Kennisbank naar Intercom (Fin)

De kennisbank van het Adviesforum staat in `data/kennisbank*.js`. Deze sync zet elk
artikel om in een **native Intercom-artikel**, zodat Fin het als bron gebruikt met een
echte bronvermelding in het antwoord. Dat is nauwkeuriger dan de Website sync van
Intercom, die de gepubliceerde HTML-pagina's crawlt.

## De compliance-poort

Dit is het belangrijkste onderdeel van de koppeling.

| In de repository | In Intercom | Gebruikt Fin het? |
|---|---|---|
| `gecontroleerd:true` | `state: published`, `ai_chatbot_availability: true` | ja |
| `gecontroleerd:false` of ontbreekt | `state: draft`, `ai_chatbot_availability: false` | nee |

De poort staat dus al in je bestaande werkwijze: compliance keurt de pull request goed,
`gecontroleerd:true` wordt gezet, en pas bij de merge naar `main` komt het artikel bij
Fin terecht. Een concept belandt wel in Intercom (handig voor de redactie) maar Fin raakt
het niet aan.

Stand op 6 oktober 2026: 231 kennisbankartikelen, waarvan **5** met `gecontroleerd:true`.
Fin krijgt dus 5 artikelen tenzij er meer door compliance gaan.

Onder elk artikel komt automatisch een voettekst met peildatum, controlestatus,
herzieningsdatum, de bronnen uit `links` en een link terug naar de pagina op het forum,
plus de regel dat de informatie bedoeld is voor adviseurs en dat de adviseur
verantwoordelijk blijft voor het advies.

## Eenmalig instellen

1. **Intercom-app en token.** Settings → Integrations → Developer Hub → nieuwe app in de
   workspace `Blinqx V&H`. Geef scopes voor *Read and write articles* en *Read admins*.
   Kopieer het access token.
2. **Token in GitHub.** Repository → Settings → Secrets and variables → Actions →
   New repository secret: `INTERCOM_TOKEN`.
3. **Configuratie ophalen.** Lokaal, met het token in je shell:

   ```
   INTERCOM_TOKEN=... node scripts/sync-intercom.mjs --bootstrap
   ```

   Dat toont de admin-ids, de help centers en de collection-ids van je workspace.
4. **`scripts/intercom-sync.config.json` vullen:**

   ```json
   {
     "authorId": 123456,
     "include": ["kennisbank"],
     "publishFaq": false,
     "collections": {
       "default": 1000,
       "hyp": 1001, "verz": 1002, "pens": 1003, "fisc": 1004,
       "adv": 1005, "crm": 1006, "comp": 1007, "ov": 1008,
       "faq": 1009
     },
     "skipIds": []
   }
   ```

   `authorId` is een Intercom admin. `collections` koppelt de categorie uit het
   kennisbankartikel (`cat`) aan een collection in het help center; wat niet in de lijst
   staat gaat naar `default`. Ontbreken de collections, dan komen de artikelen zonder
   collection in Intercom te staan.
5. **Proefrun:**

   ```
   node scripts/sync-intercom.mjs --dry-run
   node scripts/sync-intercom.mjs --preview=kb:k2    # toont de volledige payload van één artikel
   ```
6. **Eerste echte sync:** Actions → Intercom-sync → Run workflow, met *dry run* uit.

## Hoe het daarna loopt

De workflow `.github/workflows/intercom-sync.yml` draait:

- bij een **pull request** die `data/kennisbank*.js`, `data/faq/**` of het script raakt:
  altijd een proefrun. Je ziet in de log precies welk artikel nieuw, gewijzigd of
  ingetrokken zou worden, nog voordat compliance goedkeurt. Geen token nodig; zonder
  eigen `intercom-sync.config.json` gebruikt de proefrun `intercom-sync.config.example.json`.
- bij een **push naar `main`**: de echte sync. Ontbreekt het token of de configuratie nog,
  dan wordt de sync overgeslagen met een waarschuwing (main wordt niet rood).
- **handmatig** via Actions → Run workflow.

Per artikel wordt een hash van de payload bijgehouden in `intercom-map.json`. Ongewijzigde
artikelen worden overgeslagen, dus een commit in één artikel kost één API-call.

Die koppeltabel staat op een eigen tak **`intercom-state`**, niet op `main`. Daardoor
botst de sync niet met de branch protection en de verplichte review op `main`, en blijft
de geschiedenis van `main` schoon. Verwijder die tak niet: zonder de tabel weet het script
niet meer welk Intercom-artikel bij welk forum-id hoort en maakt het alles opnieuw aan.

## Een artikel verdwijnt uit de repository

Dan wordt het Intercom-artikel **niet verwijderd** maar op `draft` gezet en bij Fin
uitgezet. Zo verdwijnt het direct uit de antwoorden, maar kan de redactie het in Intercom
nog nakijken. Definitief weg: handmatig in Intercom verwijderen.

## FAQ en forumvragen

`data/faq/*.js` bevat 3.714 vragen en `data/vragen*.js` de forumvragen. Die staan
standaard **uit** (`include: ["kennisbank"]`). Redenen om dat zo te houden:

- de FAQ-items zijn concept en niet door compliance gecontroleerd, dus Fin zou ze
  toch niet gebruiken;
- 3.714 extra concept-artikelen maken het help center voor de redactie onwerkbaar.

Wil je ze toch mee: zet `"include": ["kennisbank", "faq"]`. Publiceren naar Fin gebeurt
alleen met `"publishFaq": true`, en dat is een compliance-besluit — het omzeilt de
`gecontroleerd`-poort die voor de kennisbank geldt.

## Verhouding tot de Website sync

Gebruik er één van, niet beide. Draaien ze samen, dan krijgt Fin dezelfde inhoud twee keer
(als artikel en als gecrawlde pagina), en de gecrawlde versie kent het verschil tussen
goedgekeurd en concept niet. Zet de Website sync voor dit domein uit zodra de
artikel-sync loopt.

## Let op

- Niet geverifieerd: het veld `ai_chatbot_availability` in de artikel-payload. De
  Intercom-documentatie was bij het bouwen niet bereikbaar. Weigert Intercom het veld bij de
  eerste echte run (foutmelding 400), haal het dan uit `buildArticles()`; de poort blijft dan
  werken via `state: draft`. Controleer na de eerste run in Intercom bij een concept of het
  echt niet voor Fin beschikbaar is.

- Een Fin-antwoord is een **herformulering** van het artikel. De goedkeuring van
  compliance geldt voor de artikeltekst, niet voor wat Fin ervan maakt. Leg dat vast in
  de Fin-persona en houd de bot op het adviseurskanaal; niet op consumenten.
- Het token geeft schrijfrechten op het help center. Alleen als repository secret
  bewaren, nooit in een bestand in de repository.
