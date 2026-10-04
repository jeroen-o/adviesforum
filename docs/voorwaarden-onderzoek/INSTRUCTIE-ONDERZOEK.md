# Onderzoek voorwaarden per geldverstrekker (fase A)

Je onderzoekt hypotheekvoorwaarden van Nederlandse geldverstrekkers voor de Voorwaardenvergelijker van het Adviesforum (site voor financieel adviseurs). Peildatum: oktober 2026. Wijzig GEEN bestanden in /home/user/adviesforum.

Invoer: de criteria staan in `criteria.json` (id, cat, naam, kort), de geldverstrekkers in je eigen `in-N.json` (naam, type, huidig = huidige indicatieve waarde per criterium-id, kan leeg zijn). Beide in deze map.

Gereedschap: laad WebSearch en WebFetch via ToolSearch ("select:WebSearch,WebFetch"). De websites van geldverstrekkers zijn vanuit deze omgeving vrijwel altijd geblokkeerd voor WebFetch; probeer het één keer per domein, en werk anders met de zoekresultaten (titel + samenvatting + URL). Zoek gericht, bijvoorbeeld: "<naam> hypotheek verhuisregeling", "<naam> boetevrij aflossen 10%", "<naam> acceptatiegids zzp", "<naam> bouwdepot looptijd", "<naam> productvoorwaarden hypotheek pdf", "<naam> intermediair rentemiddeling". Combineer criteria in één zoekopdracht waar dat kan. Je hebt een budget van ~200 zoekopdrachten; verdeel dat over je geldverstrekkers (≈ 80–90 per verstrekker). Neem de tijd en werk ze één voor één af.

Per geldverstrekker × criterium bepaal je:
- `waarde`: korte feitelijke tekst in eigen woorden (max ~110 tekens), met een prefix voor de kleurcode: `+` ruim/gunstig, `~` marktconform, `!` aandachtspunt, `-` beperkend/niet mogelijk. Geen rentes, rentepercentages, opslagen in % of andere tarieven noemen (AFM-regel van de site); bedragen als plafonds en termijnen mogen wel.
- `bron`: lijst met URL's waar dit blijkt (bij voorkeur van de geldverstrekker zelf; anders betrouwbare vakbron: hdn.nl, hypotheekbond, vakpers, vergelijkers met datum).
- `brondatum`: datum of jaartal van de bron als zichtbaar, anders null.
- `zekerheid`: 'hoog' (eigen site/voorwaardenbron van de verstrekker, actueel), 'middel' (betrouwbare tweede bron of oudere eigen bron), 'laag' (vaag of indirect).
- `status` t.o.v. `huidig`: 'bevestigd' (huidige waarde klopt inhoudelijk), 'gewijzigd' (bron zegt iets anders → nieuwe waarde), 'nieuw' (huidig was leeg), 'onbekend' (geen bron gevonden; waarde dan null).
Regels: verzin NIETS. Geen bron = `onbekend` en waarde null, ook als de huidige waarde aannemelijk klinkt. Labels (Hypotrust, IQWOON, HollandWoont, Robuust, Clarian, Tellius, Lot, Neo, Woonfonds, Groene Hart) kunnen voorwaarden delen met hun moeder/servicer; noem dat in `opmerking` en neem het alleen over als een bron dat bevestigt. Verouderde merken (SNS, RegioBank, BLG Wonen → ASN Bank; Aegon → a.s.r.; Woonfonds → Centraal Beheer): zoek wat nu geldt en meld de status in `opmerking`.

Uitvoer: schrijf naar `uit-N.json` (N = nummer van je invoerbestand) een array met per geldverstrekker:
{ "naam": "...", "algemeen": {"intermediairsite": url|null, "voorwaardenPdf": [url...], "acceptatiegids": [url...], "opmerking": "..."},
  "criteria": { "<criterium-id>": {"waarde": "...", "bron": [...], "brondatum": ..., "zekerheid": "...", "status": "...", "toelichting": "kort"} , ... alle 31 criteria ... },
  "gecontroleerd": "2026-10-04" }
Schrijf het bestand tussentijds na elke afgeronde geldverstrekker (zodat niets verloren gaat). Antwoord tot slot kort: per geldverstrekker het aantal criteria per status.
