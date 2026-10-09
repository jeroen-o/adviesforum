# Kennispartners werven

Doel: de eerste 3 tot 5 kennispartners zelf benaderen, zodat de lijst op [kennispartner.html](../kennispartner.html) gevuld is en de badge als voorbeeld werkt. Benader specialisten die je kent of die zichtbaar over een onderwerp publiceren (LinkedIn, vakbladen, NVHP, Adfiz).

## Gezochte onderwerpen

Per onderwerp één of twee artikelen om mee te beginnen. De claimlink staat bij elk artikel; je kunt ook direct deze link sturen: `https://adviesforum.nl/kennispartner.html?artikel=<id>#claimen`.

| Onderwerp | Startartikel(en) | Wie past erbij |
|---|---|---|
| Fundering en woningdata | k140, k141, k352, k350 | adviseur met funderingsdossiers in Gouda, Zaanstad, Dordrecht |
| Klimaat en verduurzaming | k353, k89, k332, k333 | adviseur met specialisatie verduurzaming of energiebespaarbudget |
| Scheiding | k28 | scheidingsspecialist (bijv. registerscheidingsmediator met Wft) |
| Ondernemers en zzp | k30, k43 | adviseur met veel ondernemersdossiers, rekenexpert |
| Senioren en verzilveren | k82 | seniorenadviseur, specialist overwaarde/verzilveren |
| Erfpacht | k90 | adviseur in Amsterdam, Den Haag of Utrecht |
| Buitenland en expats | k96 | adviseur met expat- of grensarbeidersdossiers |
| Inkomensrisico's | k26, k2 | AOV/ORV-specialist |
| Wwft en compliance | k65 | compliance officer van een adviesketen |
| Betaalbaarheid in beheer | k320 | adviseur die nazorg/beheer voor geldverstrekkers doet |

## Bericht via LinkedIn (kort, max. 300 tekens voor een connectieverzoek)

> Hoi [naam], ik zag je bijdragen over [onderwerp]. Op adviesforum.nl staat een kennisbank voor adviseurs; we zoeken per onderwerp een vakinhoudelijk aanspreekpunt. Zou jij Kennispartner willen worden voor [onderwerp]? Het is gratis, je krijgt een vermelding en een badge.

## Bericht per e-mail of LinkedIn-bericht (uitgebreid)

> Onderwerp: Kennispartner voor [onderwerp] op het Adviesforum?
>
> Hoi [naam],
>
> Het Adviesforum (adviesforum.nl) is een kennisplatform voor en door financieel adviseurs: een vergelijker van acceptatievoorwaarden, een kennisbank met bronnen, rekenhulpen en een vragenforum.
>
> Voor het onderwerp [onderwerp] zoeken we een vakinhoudelijk aanspreekpunt. Je bijdrage kan klein zijn: je naam bij het artikel, en waar je wilt een aanvulling uit je praktijk. Aangeleverde tekst gaat langs compliance voordat hij als gecontroleerd verschijnt.
>
> Wat je krijgt:
> - je naam en kantoor bij het artikel, met een link naar je profiel;
> - de badge "Kennispartner van Adviesforum" voor je website, e-mailhandtekening en LinkedIn (onder Uitgelicht);
> - zichtbaarheid bij collega's die over dit onderwerp zoeken.
>
> Het kost niets en er is geen rangorde of betaalde vermelding. De badge is geen keurmerk of certificaat.
>
> Claimen kan hier: https://adviesforum.nl/kennispartner.html?artikel=[id]#claimen
>
> Groet,
> [naam]
> Beheerder Adviesforum

## Na een claim

1. Controleer het AFM-vergunningnummer van het kantoor in het register op afm.nl en of de persoon er werkt (website of LinkedIn).
2. Voeg de kennispartner toe aan `data/kennispartners.js` (id `kp-voornaam-achternaam`, `sinds` = datum van goedkeuring).
3. Draai `npm run bijwerken` (maakt badges en statische pagina's) en `npx playwright test`.
4. Mail de kennispartner de link naar de vermelding (`kennispartner.html#partner-<id>`): daar staan de badge, de downloads en de code.
5. Aangeleverde tekst: verwerk als concept in het artikel; compliance keurt goed via de pull request.

## Compliance

- Spreek in berichten niet van een keurmerk, certificering of erkenning.
- Geen vergoeding of tegenprestatie afspreken: dan wordt de vermelding reclame.
- Trek een vermelding in als iemand niet meer bij het kantoor werkt of de vergunning vervalt.
