# Hulpplatform voor adviesschermen: eisen en status

Bron: de punten en flow van Jigal (Blinqx) voor een kennisplatform in de stijl van Adviesforum, met hulp vanuit de eBlinqx-adviesschermen. Prototype: `hulp.html` (`js/hulp.js`, noindex, geen koppelingen, niets wordt verstuurd of bewaard).

| Eis | Status | Opmerking |
|---|---|---|
| Hulp vanuit het scherm met scherm, veld en versie, zonder dossiergegevens | Prototype | Context via de URL (`hulp.html?scherm=…&veld=…&versie=…`); in eBlinqx als zijpaneel of iframe |
| Vraag achter de vraag herformuleren | Prototype (voorstel op basis van een vergelijkbare vraag, geen AI) | AI-herformulering volgt na het besluit over de AI (zie `ai-deelnemer.md`) |
| Bestaande opgeloste vragen tonen | Prototype | Voorbeeldvragen zijn als zodanig gelabeld |
| Antwoord uit de kennisbank met bron | Prototype | Titel, peildatum en controlestatus; geen AI |
| Opgelost / niet opgelost terugkoppelen | Prototype (alleen in de pagina) | Echte opslag en terugschrijven na triage vragen een backend |
| Routering vakinhoud naar experts, software naar support | Prototype (weergave) | Intercom en Jira nog niet gekoppeld; nummers staan als [nummer] |
| Eén draad: forumvraag, ticket en issue gekoppeld | Prototype (weergave) | Koppeling vraagt serverkant en sleutels als secrets |
| Gegeneraliseerde vraag op het forum, dossier besloten | Prototype | Patronen voor e-mail, IBAN, telefoon, postcode en 9 cijfers worden verwijderd; namen niet |
| Keuze om alleen naar support te sturen | Prototype | Toegevoegd na de mockups |
| Escalatie na x tijd | Alleen tekst | Termijn nog te bepalen; vraagt serverkant |
| Proactieve suggesties per scherm | Prototype | Meest passende vragen bij scherm en veld |
| Stemmen, triage, verwijderen van onjuiste stukken | Nog niet | Archiveren in plaats van verwijderen, voor de herleidbaarheid |
| Moderatie (privacy, commercieel, juistheid) | Deels (moderatiestatus in het Supabase-schema) | Criteria en rollen nog uit te werken |
| Experts, alleen door Blinqx aangewezen | Nog niet | In Adviesforum is een niveau nu gebaseerd op activiteit |
| Kennisinname van geldverstrekkers in elk formaat | Nog niet | Vraagt toestemming, versiebeheer en een controle op ouderdom |
| SSO van Blinqx en inloggen van geldverstrekkers | Nog niet | OIDC of SAML; aparte route voor geldverstrekkers |
| Intercom-overzicht van langlopende tickets | Nog niet | Aparte bouwsteen met de Intercom-API aan de serverkant |
| Signaal per scherm voor het product | Nog niet | Telling per scherm; privacyvriendelijk |

## Aandachtspunten
- Compliance: een AI-antwoord is een concept en geen advies, is gelabeld en noemt zijn bron.
- Privacy: de vrije tekst kan klantgegevens bevatten; waarschuwing en moderatie vóór publicatie zijn nodig, ook voor wat naar Intercom en Jira gaat.
- Neutraliteit: kennis van geldverstrekkers en Blinqx-experts in één platform moet duidelijk zijn voor adviseurs en geldverstrekkers.
