# Extra zoekronde: hypotheekgids / acceptatiegids / hypotheekvoorwaarden (fase G)

Wijzig GEEN bestanden in /home/user/adviesforum. Laad WebSearch via ToolSearch ("select:WebSearch,WebFetch"); websites zijn meestal geblokkeerd voor WebFetch, werk met zoekresultaten.

Invoer: je eigen `in-GN.json` (array per geldverstrekker: naam, domeinen = eigen sites, open = criterium-id's zonder waarde, nietGeverifieerd = id's met waarde zonder eigen bron, huidig = huidige waarden, hypotheekcompanyDocs = documenten op hypotheekcompany.nl). Criteria: `criteria.json`.

Per geldverstrekker zoek je ALLE varianten, los én aan elkaar geschreven, zowel met als zonder de naam van de geldverstrekker:
"<naam> hypotheekgids", "<naam> hypotheek gids", "<naam> acceptatiegids", "<naam> hypotheek acceptatiegids", "<naam> hypotheekacceptatiegids", "<naam> acceptatiebeleid", "<naam> hypotheekvoorwaarden", "<naam> hypotheek voorwaarden", "<naam> productvoorwaarden hypotheek", "<naam> beheergids".
Doe dat eerst met allowed_domains = de eigen domeinen, daarna zonder domeinbeperking (vakbronnen, hypotheekcompany.nl, vergelijkers).

Doel: vul de `open` criteria en probeer de `nietGeverifieerd` criteria alsnog met een bron op de EIGEN site te bevestigen. Controleer ook steekproefsgewijs 5 bestaande waarden opnieuw (zet dubbel:'bevestigd' of corrigeer met dubbel:'gecorrigeerd').

Regels:
- Neem informatie van andere sites (bijv. hypotheekcompany.nl, vergelijkers) WEL mee, maar zet de bron-URL gewoon in `bron`: het verwerkscript laat bronnen buiten de eigen domeinen automatisch weg en markeert de waarde als "nog niet geverifieerd".
- Zekerheid: 'hoog' = eigen site/document, actueel (2025-2026); 'middel' = eigen bron ouder of samenvatting onduidelijk; 'laag' = derde partij of vaag.
- Geen rentes/tarieven/percentage-opslagen in `waarde` (AFM-regel van de site); bedragen als plafonds en kosten alleen in `toelichting`.
- Verzin niets; geen bron = laat het criterium weg.

Uitvoer `uit-GN.json`: array met per geldverstrekker {naam, gecontroleerd:'2026-10-04', criteria:{id:{waarde, bron[], brondatum, zekerheid, status:'nieuw'|'bevestigd'|'gewijzigd', dubbel?, toelichting}}, documenten:[{titel,url,versie}] }. Neem ALLEEN criteria op die je in deze ronde gevonden/bevestigd hebt. Schrijf tussentijds na elke geldverstrekker. Rapporteer kort per geldverstrekker: aantal nieuw gevuld, aantal alsnog geverifieerd, gevonden gidsen (titel + versie).
