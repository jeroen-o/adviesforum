# AI als deelnemer op het forum (ontwerp, nog niet gebouwd)

Idee: bij elke nieuwe vraag plaatst een AI (Intercom Fin of een eigen oplossing) direct een gewoon antwoord, dat de vrager als "Beste antwoord" kan aanwijzen. Zo ontstaat een lus met een mens ertussen: alleen door mensen bevestigde antwoorden worden hergebruikt.

## Wat er al is
- Opgelost-markering: de vrager wijst één antwoord aan (`v.beste`); de vraag krijgt het label "Opgelost". Zo'n vraag kan naar de kennisbank worden gepromoveerd.
- Een uitgeschakelde Fin-koppeling in `index.html` (`const FIN`), met `autoAsk` en een proxy-URL. De proxy (`fin-proxy.worker.js`) staat niet in de repo en moet nog worden gebouwd en beheerd.
- Gelijksoortige vragen tijdens het typen, de categorie Fastlane / eBlinqx Hypotheekadvies en `regelgeving.json` met een MCP-server (zie `docs/mcp-regelgeving.md`).

## Wat nog nodig is (besluiten)
1. **Welke AI?** Intercom Fin (kennis uit de Intercom-kennisbank en Confluence) of een eigen RAG-oplossing. Beide hebben een server nodig, want de sleutel mag nooit in de site of in de repo staan (Cloudflare Worker of Supabase Edge Function met de sleutel als secret).
2. **Bronnen voor de antwoorden:** de kennisbank en FAQ van het Adviesforum (`llms-full.txt`), de Fastlane-kennisbank (wekelijks bijgewerkt), `regelgeving.json` en opgeloste vragen uit het live forum. Fictieve voorbeeldvragen (`voorbeeld:true`) horen daar nooit in.
3. **Toestemming en AVG:** vragen gaan naar de AI-leverancier als verwerker. Dat vraagt een verwerkersovereenkomst, een bijgewerkte privacyverklaring en een bepaling in de gebruiksvoorwaarden als opgeloste vragen als bron dienen. Geen persoonsgegevens van klanten in vragen (staat al bij het formulier).
4. **AFM en zorgplicht:** elk AI-antwoord is duidelijk als AI gelabeld, is een concept en geen advies, noemt zijn bronnen en kan niet als "Beste antwoord" tellen voor de reputatie van adviseurs. De adviseur blijft verantwoordelijk.
5. **Kwaliteitsmeting:** houd bij hoe vaak een AI-antwoord als oplossing wordt gekozen, omlaag gestemd of door een mens gecorrigeerd. Dat bepaalt of Fin goed genoeg is of dat een eigen oplossing nodig is.

## Voorgestelde bouwvolgorde
1. Proxy of Edge Function met sleutel als secret en een eenvoudige limiet per gebruiker.
2. Antwoord als aparte rol "AI-assistent" met label, bovenaan vastgepind, met bronlinks.
3. Alleen opgeloste vragen van het live forum (niet de demo-data) als aanvullende bron.
4. Meten en bijsturen; daarna beslissen of Fin blijft of vervangen wordt.
