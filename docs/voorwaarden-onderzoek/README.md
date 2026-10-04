# Onderzoek voorwaarden geldverstrekkers (Voorwaardenvergelijker)

Stand: 4 oktober 2026. Niets hiervan is al op voorwaarden-vergelijker.html verwerkt.

- `criteria.json`: de 31 voorwaarden (id, categorie, naam).
- `in-1.json` t/m `in-21.json`: 42 consumenten-geldverstrekkers, 2 per bestand, met de huidige (indicatieve) waarde per voorwaarde.
- `INSTRUCTIE-ONDERZOEK.md`: de opdracht per onderzoeker (fase A).
- `uit-1.json` t/m `uit-7.json`: resultaat ronde 1. De sessielimiet van 200 webzoekopdrachten raakte op, dus deels leeg:
  - goed: ABN AMRO, Attens, Aegon; deels: ING, Obvion, RegioBank, BLG Wonen;
  - niet onderzocht: Rabobank, SNS, Munt, Florius, Nationale-Nederlanden, Tulp, Lloyds (opnieuw doen);
  - in-8 t/m in-21 nog niet gestart.
- Het leesbare rapport van ronde 1 is als bestand aan de gebruiker gestuurd (niet in de repo, om de paginatests schoon te houden).

## Vervolg (nieuwe sessie)
De zoeklimiet staat via `.claude/settings.json` op 5000 per sessie (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`).
1. Fase A opnieuw voor de niet/deels onderzochte verstrekkers in in-1..7 en voor in-8..21 (zelfde instructie; schrijf uit-N.json).
2. Fase B, dubbelcheck: een tweede, onafhankelijke onderzoeker controleert per verstrekker elke waarde uit fase A met eigen zoekopdrachten (bevestigd / tegengesproken / niet te verifiëren).
3. Alleen waarden die fase A én B bevestigen verwerken in CEL_WAARDEN van voorwaarden-vergelijker.html, met bron, brondatum en zekerheid in de tooltip; tegenstrijdig = markeren; geen bron = "nog in te vullen". Geen rentes of tarieven.
4. Per verstrekker een datum "laatst gecontroleerd" en op de pagina "laatst bijgewerkt".
Let op: websites en PDF's van geldverstrekkers zijn in de standaard netwerkinstelling geblokkeerd; met ruimere netwerktoegang kunnen de PDF's direct gelezen worden.
