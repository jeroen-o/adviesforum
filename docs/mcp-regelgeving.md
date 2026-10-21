# MCP-server voor regelgeving en normen

Het Adviesforum publiceert wet- en regelgeving als data (`https://adviesforum.nl/regelgeving.json`, gebouwd door `tools/regelgeving.js` uit `js/rekentools/normen.js` en de NHG-gegevens). Met de MCP-server in `mcp/adviesforum-regelgeving` kunnen programmeurs en AI-tools (Claude Code, Cursor en andere MCP-clients) die gegevens opvragen, bijvoorbeeld de NHG-grens of de box 1-schijven, in plaats van ze zelf in de code vast te leggen.

## Installeren (lokaal, geen build-stap)
1. Haal de repo op en zorg voor Node 18 of nieuwer.
2. Claude Code: `claude mcp add adviesforum-regelgeving -- node /pad/naar/adviesforum/mcp/adviesforum-regelgeving/server.js`
3. Andere clients: voeg een stdio-server toe met commando `node` en argument het pad naar `server.js`.
4. Eigen bron of offline: zet `ADVIESFORUM_REGELGEVING` op een URL of een pad naar `regelgeving.json`.

## Hulpmiddelen
- `regelgeving_lijst`: alle onderwerpen.
- `regelgeving_zoek`: zoeken op een woord (NHG, box 3, WIA, ...).
- `regelgeving_get`: één onderwerp met waarden, peildatum, controlestatus en bronnen.

## Let op
- De gegevens zijn een hulpmiddel en geen advies. Elk onderwerp heeft een controlestatus; "deels" of "niet bevestigd" betekent dat een onderdeel niet is gecontroleerd. Controleer bij het bouwen van een feature altijd de officiële bron (Belastingdienst, UWV, NHG).
- Normen wijzigen per 1 januari en soms per 1 juli. Een wijziging verwerk je in `js/rekentools/normen.js`; `npm run bijwerken` bouwt daarna `regelgeving.json`.
- Er is bewust geen schrijftoegang en geen inlog: alleen openbare gegevens.
