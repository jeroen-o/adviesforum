# Onderzoeksronde nieuwe voorwaarden (fase S, oktober 2026)

Aanleiding: een gebruiksanalyse (FinData voorwaarden-app, jan-sep 2026) laat zien dat adviseurs veel zoeken op voorwaarden die de Voorwaardenvergelijker van het Adviesforum nog niet heeft. Jij onderzoekt die twaalf voorwaarden (criteria-nieuw.json) voor de geldverstrekkers in je invoerbestand.

Wijzig GEEN bestanden in /home/user/adviesforum. Laad WebSearch (en WebFetch) via ToolSearch ("select:WebSearch,WebFetch"). Websites en PDF's zijn vanuit deze omgeving meestal niet te openen met WebFetch; werk dan met de tekst in zoekresultaten. Probeer WebFetch wel even op de gidsen in `documenten`.

Werkwijze per geldverstrekker:
1. Zoek eerst de acceptatiegids / hypotheekgids / productvoorwaarden (zie ook `documenten` in je invoer; die zijn eerder gevonden, kunnen verouderd zijn).
2. Zoek per voorwaarde gericht, eerst met allowed_domains = de eigen domeinen van de geldverstrekker, daarna zonder beperking (vakbronnen, hypotheekcompany.nl, intermediairsites). Voorbeelden: "<naam> consumptief", "<naam> vrij besteedbaar hypotheek", "<naam> familiebank lening ouders", "<naam> schenking", "<naam> desktoptaxatie", "<naam> modelmatige waardebepaling", "<naam> Calcasa", "<naam> arbeidsmarktscan", "<naam> VvE niet actief", "<naam> huurinkomsten", "<naam> kamerverhuur", "<naam> bonus inkomen", "<naam> recreatiewoning", "<naam> drie aanvragers", "<naam> pgb inkomen", "<naam> starterslening", "<naam> woning verhuren hypotheek".

Regels (streng):
- Verzin niets. Geen bron = laat het criterium weg. Schrijf geen algemene NHG- of marktregels op als beleid van de geldverstrekker, tenzij de bron dat voor deze geldverstrekker zegt.
- Bron-URL's altijd volledig (https) opnemen. Bronnen buiten de eigen domeinen mogen, maar het verwerkscript markeert die waarde dan als "nog niet geverifieerd".
- Zekerheid: 'hoog' = eigen site of eigen document, actueel (2025-2026); 'middel' = eigen bron, ouder of samenvatting niet helemaal eenduidig; 'laag' = derde partij of vaag.
- Geen rentes, rentekortingen, tarieven of premies in `waarde` (AFM-regel van de site). Maxima (percentages van marktwaarde, termijnen) mogen wel; bedragen en kosten alleen in `toelichting`.
- `waarde`: max. 160 tekens, Nederlands, begint met een teken: "+ " (mogelijk/ruim), "~ " (onder voorwaarden), "- " (niet mogelijk), "! " (let op/kosten). Voorbeeld: "~ Consumptief deel max. 20% marktwaarde, niet met NHG; apart leningdeel".
- `brondatum`: versie/maand van de bron als bekend ("2026-07", "jan 2026"), anders null.

Uitvoer: schrijf `uit-ZZSn.json` (n = je nummer) in de map /tmp/claude-0/-home-user-adviesforum/4648776e-e85d-5ea3-ae80-d57b2c7328e5/scratchpad/zg/ : een JSON-array met per geldverstrekker
{ "naam": exact zoals in je invoer, "gecontroleerd": "2026-10-08", "criteria": { "<id>": { "waarde", "bron": [urls], "brondatum", "zekerheid", "status": "nieuw", "toelichting" } }, "documenten": [ {"titel","url","versie"} ] }
Neem alleen criteria op die je met een bron hebt gevonden. Schrijf het bestand tussentijds bij na elke geldverstrekker (geldige JSON). Rapporteer aan het eind kort per geldverstrekker: aantal gevulde criteria, waarvan met eigen bron.
