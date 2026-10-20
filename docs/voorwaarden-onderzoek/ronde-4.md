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

## Ronde 5 (16 oktober 2026): bron op eigen domein zoeken voor de 188 niet-geverifieerde waarden
Methode als ronde 4 (webzoekopdrachten op het eigen domein; alleen samenvattingen). Resultaat (`uit-ZZZ-ronde5.json`, 9 waarden nu met eigen bron; nog 179 niet geverifieerd):

| Geldverstrekker | Bevestigd (nu geverifieerd) | Gedeeltelijk | Niet gevonden |
|---|---|---|---|
| bijBouwe | `zstart` (hoog), `nlwon` (middel) | 9 | 28 |
| IQWOON | `huur`, `bonus`, `start`, `buitw` | 5 | 0 |
| ING | `obduur` | 4 | 14 |
| Rabobank | `plen`, `lease` (bron 2023, middel) | 4 | 0 |
| ASN Bank, Nationale-Nederlanden, Aegon, BLG Wonen, a.s.r., Venn | geen | 3 tot 8 per geldverstrekker | de rest |

- De acceptatiecriteria staan waarschijnlijk in adviseursportalen of in pdf's die niet via zoeken vindbaar zijn (bijBouwe: Acceptatiehandleiding september 2026 op `bijbouwe.nl/belangrijke-documenten`; ASN: `asnbank.nl/downloads/asn-uitgangspunten-berekening-maximale-hypotheek.html`; IQWOON: gids juni 2026 op `iqwoon.nl/adviseur`; Aegon en a.s.r.: portaal). Lees die handmatig en verwerk de waarden met een eigen bron.
- **Tegenspraak, niet verwerkt:** Rabobank `vve`: opgeslagen 'actieve VvE niet vereist'; de acceptatieregels van 2 januari 2023 (`media.rabobank.com`) eisen een actieve VvE bij bestaande bouw (uitzondering complex tot 5 appartementen). De bron is ouder dan de opgeslagen waarde; controleer de huidige Rabobank-regels.
- Gedeeltelijke bevestigingen (bijvoorbeeld bijBouwe `vve`, `bonus`, `ort`, `minh`; ASN `ltvk`, `wwp`; IQWOON `pgb`, `obvw` met tegenstrijdige gidsen; Venn `duo`, mogelijk verouderd) zijn bewust niet als geverifieerd verwerkt.

## Ronde 7 (20 oktober 2026): acceptatiegidsen echt gedownload en gelezen
Netwerktoegang stond nu op Full; gidsen zijn met curl opgehaald en met pdftotext gelezen (`uit-ZZZZ-ronde7-1.json` t/m `-6.json`). Van de 179 niet-geverifieerde waarden zijn er 102 nu geverifieerd met een bron op het eigen domein; 77 blijven open.

| Geldverstrekker | Gelezen | Resultaat |
|---|---|---|
| bijBouwe | Acceptatiehandleiding Vooruit (oktober 2026) en basis (september 2026), productkaart, wijzigingstabellen | 37 van 37; 8 gewijzigd (o.a. VvE-onderhoudsstaat 'redelijk', bonus, IVA/WAO). PDF's staan op prepr.io; de overzichtspagina op bijbouwe.nl is als bron opgenomen |
| Nationale-Nederlanden | Acceptatiebeleid Hypotheken (adviseur.nn.nl) | 28 van 28; 3 gewijzigd (woz/wbhuid, meerink) |
| Venn, Tulp | Kredietgids oktober 2025, acceptatiegidsen Tulp | 4 van 4, alle gewijzigd (bkr, duo, wwp) |
| ASN Bank, BLG Wonen | uitgangspunten maximale hypotheek (09-01-2025) en adviseurspagina's | 14 van 31; de acceptatiegids zelf staat achter de login |
| Rabobank | Acceptatie- en beheerregels wonen v4.1 (2023) | 5 van 5, zekerheid middel; de actuele gids (rabobank.nl) geeft 403. `vve` en `bonus` gewijzigd |
| IQWOON, Knab | Gidsen januari 2026, Knab 7 september 2026 | 6 van 7 |
| Overige 15 | NIBC, Allianz, bunq, Clarian, Groene Hart, Impact, Lot, Neo, Tellius, Hypotrust, Vista, Merius | 12 van 18 |
| Aegon, ING (en a.s.r.) | Hypotheekgids a.s.r. mei 2026 en ING Acceptatiebeleid 1 oktober 2026 (kopieën op hypotheekcompany.nl) | 37 waarden herzien, maar zonder bron op het eigen domein: blijven 'niet geverifieerd'. a.s.r. 17 en ABN AMRO 2, Handelsbanken 2, SNS 1 niet gevonden |

Nog open (77): a.s.r. 17, Aegon 19, ING 18, BLG Wonen 12, ASN Bank 5, ABN AMRO 2, Handelsbanken 2, IQWOON 1, SNS 1. Voor deze zijn de acceptatiegidsen alleen via het adviseursportaal te krijgen.
