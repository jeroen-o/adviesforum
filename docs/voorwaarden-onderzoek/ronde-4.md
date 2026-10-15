# Actualisatieronde 4 (15 oktober 2026)

Doel: status, nieuws en aangekondigde wijzigingen van alle 43 geldverstrekkers nalopen na de controle van 9 oktober, met een steekproef (circa 8 criteria per geldverstrekker) van de opgeslagen waarden. Methode: webzoekopdrachten, eerst op het eigen domein (`domeinen.json`), daarna breed; gidsen en pdf's waren niet rechtstreeks in te zien, dus vooral zoeksamenvattingen. `gecontroleerd` per geldverstrekker is daarom **niet** verhoogd: alleen de hieronder genoemde waarden zijn aangepast (`uit-ZZY-ronde4.json`).

## Doorgevoerd
- **Waarden (7):** ABN AMRO `boete`, Venn `persp`, Munt `maxh` (toelichting), Argenta `ovbr`, Knab `geld`, bijBouwe `zzp`, Lot `boete`.
- **Partijen (`data/partijen.js`):** NIBC sinds 1 augustus 2026 onderdeel van ABN AMRO; Lot als label van NIBC; ABN AMRO Hypotheken Groep gefuseerd met ABN AMRO Bank (11 oktober 2026); Florius per 11 oktober 2026 juridisch gefuseerd, nieuwe voorwaarden en tenaamstelling; Tulp: overname door Bankinter aangekondigd, afronding niet bevestigd; Knab Helder (oud-Aegon). Toezichtlabel 'Geen eigen vergunning' heet nu 'Label of handelsnaam; vergunning bij een andere partij'; formuleringen als 'uit eigen kennis' en 'vermoedelijk' zijn vervangen door een verwijzing naar het AFM-/DNB-register.
- **Status 'geen nieuwe klanten':** geen wijzigingen nodig (Woonnu, Neo, IQWOON, Tellius, Aegon, BLG Wonen, SNS en RegioBank bevestigd).

## Nog handmatig te lezen en eventueel te verwerken
| Geldverstrekker | Wat |
|---|---|
| ABN AMRO | Beleidsaanpassingen per 9-12-2026 (o.a. aflossingsvrij: eindschuld vastleggen, toets 50% woningwaarde bij 85 jaar); EBB-bouwdepot 18 + 6 maanden (welke termijn voor EBB?) |
| Rabobank en Obvion | Hypotheeknormen per maart 2027 (pensioeninkomen vanaf 15 jaar vóór pensioendatum, bij AOW-leeftijd 67 vanaf 52 jaar; LTV-grens 70% op 85 jaar): verwerkt in `aow` van beide (Obvion zekerheid middel). Nog lezen: uitwerking in de acceptatiekaarten, en het nieuwe acceptatiebeleid van Rabobank van september 2026 |
| Obvion | Mailing 8-9-2026: aangepaste regels waardebepaling onderpand (kan `desk`/`mwbep` raken) |
| Clarian Wonen | Nieuwe acceptatiegids en beheergids 22-6-2026 (opgeslagen: januari 2025) |
| Tellius | Acceptatiegids 1-7-2026 en nieuwe algemene voorwaarden 1-10-2026 |
| Neo | Acceptatiegids v1.6.8 (opgeslagen: v1.6.7); max. hoofdsom boven 80% LTV tegenstrijdig (750.000 of 950.000) |
| Vrij Leven (Hypotrust) | Acceptatiegids en beheergids vanaf april 2026 (opgeslagen: 7-8-2025) |
| IQWOON | Acceptatiegids en beheergids juni 2026 |
| Vista | Hypotheekgids bevat versie april 2026 (o.a. VvE-beleid, depotvergoeding nieuwbouw); `bdrnt` en `bdduur` onzeker |
| Florius | Nieuwe hypotheekvoorwaarden per 11-10-2026: opgeslagen waarden deels op voorwaarden van 1-10-2025 |
| Knab | Acceptatiegids 7-9-2026 (bonusinkomen vervalt, IBL aangescherpt, niet-toegestane constructies) |
| Triodos | Acceptatiebeleid 3.56 (juli 2026): aflossingsvrij 30% per 1-7-2026; mogelijk ook maximaal aflossingsvrij bedrag verlaagd |
| Handelsbanken | Aflossingsvrij: nieuwe regels bij oversluiten, verhogen of wijzigen; opgeslagen '50%' niet te bevestigen |
| SocioHypotheek | Eigen site tegenstrijdig: minimumleeftijd 57+ of vanaf 65 |
| Tulp, NIBC | `rvp` (Tulp: 5-30 jaar of 1-30 jaar; NIBC: 5/10/15/20 of 'minimaal 20 jaar') en Tulp `avrij` (50% zonder 75%) tegenover de productkaart 01-2026 |
| Argenta | Hypotheekgids augustus 2026: omslag '2 jaar' tegenover 36 maanden in de tekst (nieuwbouw overbrugging) |
| bijBouwe | Wijzigingstabellen september 2026 niet te lezen; 39 waarden nog niet geverifieerd |
| Handmatig dichten | Geen eigen domein-bron voor 188 waarden (vooral bijBouwe, Nationale-Nederlanden, ING, Aegon, BLG Wonen, a.s.r.) |
