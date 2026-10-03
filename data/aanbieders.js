/* AANBIEDERS van financiële producten (geldverstrekkers, verzekeraars, pensioenuitvoerders,
 * kredietverstrekkers, serviceproviders). Getoond op aanbieders.html; bij te houden door de aanbieder
 * zelf via aanbieder-beheer.html. De aanbieder dient wijzigingen in als JSON; de beheerder publiceert met
 *   node tools/aanbieder-import.js aanbieder-<id>.json
 * Dat script herschrijft alles na "window.AANBIEDERS=" in dit bestand; deze kop blijft staan.
 *
 * Velden per aanbieder:
 *   id            uniek, kleine letters, cijfers en streepjes (bijv. 'voorbeeld-hypotheken')
 *   naam, type    type: geldverstrekker | verzekeraar | pensioenuitvoerder | kredietverstrekker | serviceprovider
 *   initialen     1-3 tekens voor het logo-blokje; kleur: #RRGGBB
 *   omschrijving  korte zakelijke omschrijving (max. 400 tekens); website: https-url
 *   extranet      {url, naam}  portal of aanvraagomgeving voor adviseurs
 *   contact       [{naam, functie, email, telefoon}]  alleen ZAKELIJKE gegevens, met toestemming van de persoon (AVG)
 *   documenten    [{titel, url, soort}]  soort: voorwaarden | acceptatiegids | productblad | formulier
 *   richtlijnen   [{titel, tekst}]
 *   nieuws        [{id, datum (JJJJ-MM-DD), titel, tekst, url}]  id: kleine letters/cijfers, uniek binnen de aanbieder
 *   elearning     [{titel, url, duur, pe}]  pe: true alleen als de aanbieder PE-punten opgeeft
 *   bijgewerkt    JJJJ-MM-DD
 *   codeHash      optioneel: SHA-256 van de persoonlijke inlogcode (maak met beheer-code.html, keuze "Aanbieder")
 *   demo          true = fictief voorbeeld. Verwijder de voorbeelden zodra er echte aanbieders zijn.
 * Niet plaatsen: rentes, tarieven, premies of acties (AFM). Tekst is platte tekst; een lege regel = nieuwe alinea.
 */
window.AANBIEDERS=[
  {
    "id": "voorbeeld-hypotheken",
    "demo": true,
    "naam": "Voorbeeld Hypotheken",
    "type": "geldverstrekker",
    "initialen": "VH",
    "kleur": "#1E4E8C",
    "omschrijving": "Fictieve geldverstrekker om te laten zien hoe een aanbiederspagina eruitziet. Biedt (in dit voorbeeld) hypotheken voor starters, doorstromers en oversluiters, uitsluitend via erkende adviseurs.",
    "website": "https://example.org/",
    "extranet": {
      "url": "https://example.org/adviseursportaal",
      "naam": "Voorbeeld Adviseursportaal"
    },
    "nieuws": [
      {
        "id": "n3",
        "datum": "2026-10-01",
        "titel": "Nieuwe versie acceptatiegids (voorbeeld)",
        "tekst": "Per 1 oktober 2026 staat er een nieuwe versie van de acceptatiegids klaar. De wijzigingen zijn vooral redactioneel; een overzicht staat op de eerste pagina van de gids.",
        "url": "https://example.org/nieuws/acceptatiegids-oktober"
      },
      {
        "id": "n2",
        "datum": "2026-09-15",
        "titel": "Gepland onderhoud adviseursportaal (voorbeeld)",
        "tekst": "Het adviseursportaal is zaterdagavond enkele uren niet bereikbaar vanwege onderhoud. Aanvragen die je daarvoor indient, worden gewoon verwerkt.",
        "url": ""
      },
      {
        "id": "n1",
        "datum": "2026-08-20",
        "titel": "Nieuwe accountmanager regio Zuid (voorbeeld)",
        "tekst": "Regio Zuid en West heeft een nieuwe accountmanager. De contactgegevens staan onder Contactpersonen.",
        "url": ""
      }
    ],
    "documenten": [
      {
        "titel": "Algemene voorwaarden hypotheken (voorbeeld)",
        "url": "https://example.org/documenten/algemene-voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids oktober 2026 (voorbeeld)",
        "url": "https://example.org/documenten/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      },
      {
        "titel": "Productblad annuïteitenhypotheek (voorbeeld)",
        "url": "https://example.org/documenten/productblad-annuiteit.pdf",
        "soort": "productblad"
      },
      {
        "titel": "Formulier wijziging lopende hypotheek (voorbeeld)",
        "url": "https://example.org/documenten/wijzigingsformulier.pdf",
        "soort": "formulier"
      }
    ],
    "richtlijnen": [
      {
        "titel": "Volledig dossier bij aanvraag",
        "tekst": "Lever de aanvraag in één keer compleet aan via het adviseursportaal. Onvolledige dossiers zetten we on hold.\n\nGebruik de documentenchecklist in de acceptatiegids als uitgangspunt."
      },
      {
        "titel": "Inkomen van ondernemers",
        "tekst": "Voor ondernemers gaan we uit van een inkomensverklaring door een erkende rekenexpert. Zie de acceptatiegids voor de voorwaarden."
      }
    ],
    "contact": [
      {
        "naam": "Accountmanager Noord (voorbeeld)",
        "functie": "Accountmanager regio Noord en Oost",
        "email": "accountmanager.noord@example.org",
        "telefoon": ""
      },
      {
        "naam": "Accountmanager Zuid (voorbeeld)",
        "functie": "Accountmanager regio Zuid en West",
        "email": "accountmanager.zuid@example.org",
        "telefoon": ""
      },
      {
        "naam": "Acceptatiedesk (voorbeeld)",
        "functie": "Vragen over lopende aanvragen",
        "email": "acceptatie@example.org",
        "telefoon": ""
      }
    ],
    "elearning": [
      {
        "titel": "Kennismaken met het adviseursportaal (voorbeeld)",
        "url": "https://example.org/elearning/portaal",
        "duur": "20 minuten",
        "pe": false
      }
    ],
    "bijgewerkt": "2026-10-01"
  },
  {
    "id": "voorbeeld-verzekeringen",
    "demo": true,
    "naam": "Voorbeeld Verzekeringen",
    "type": "verzekeraar",
    "initialen": "VV",
    "kleur": "#2E7D4F",
    "omschrijving": "Fictieve verzekeraar als voorbeeld: overlijdensrisico- en arbeidsongeschiktheidsverzekeringen via het intermediair.",
    "website": "https://example.com/",
    "extranet": {
      "url": "https://example.com/intermediair",
      "naam": "Voorbeeld Intermediairomgeving"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-09-28",
        "titel": "Vernieuwde polisvoorwaarden overlijdensrisico (voorbeeld)",
        "tekst": "De polisvoorwaarden zijn herschreven in begrijpelijker taal. De dekking is niet gewijzigd. Bestaande polissen houden hun eigen voorwaarden.",
        "url": "https://example.com/nieuws/voorwaarden"
      }
    ],
    "documenten": [
      {
        "titel": "Polisvoorwaarden overlijdensrisicoverzekering (voorbeeld)",
        "url": "https://example.com/documenten/voorwaarden-orv.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatierichtlijnen medische keuring (voorbeeld)",
        "url": "https://example.com/documenten/medische-acceptatie.pdf",
        "soort": "acceptatiegids"
      },
      {
        "titel": "Aanvraagformulier AOV (voorbeeld)",
        "url": "https://example.com/documenten/aanvraag-aov.pdf",
        "soort": "formulier"
      }
    ],
    "richtlijnen": [
      {
        "titel": "Gezondheidsverklaring",
        "tekst": "Laat de klant de gezondheidsverklaring zelf invullen. Je mag helpen met uitleg, maar niet met de antwoorden."
      }
    ],
    "contact": [
      {
        "naam": "Team Intermediair (voorbeeld)",
        "functie": "Landelijk, alle productvragen",
        "email": "intermediair@example.com",
        "telefoon": ""
      }
    ],
    "elearning": [],
    "bijgewerkt": "2026-09-28"
  }
];
