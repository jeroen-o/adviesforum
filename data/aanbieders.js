/* AANBIEDERS van financiële producten (geldverstrekkers, verzekeraars, pensioenuitvoerders,
 * kredietverstrekkers, serviceproviders). Getoond op aanbieders.html; bij te houden door de aanbieder
 * zelf via aanbieder-beheer.html. De aanbieder dient wijzigingen in als JSON; de beheerder publiceert met
 *   node tools/aanbieder-import.js aanbieder-<id>.json
 * Dat script herschrijft alles na "window.AANBIEDERS=" in dit bestand; deze kop blijft staan.
 *
 * Velden per aanbieder:
 *   id            uniek, kleine letters, cijfers en streepjes (bijv. 'voorbeeld-hypotheken')
 *   naam, type    type: geldverstrekker | verzekeraar | pensioenuitvoerder | kredietverstrekker | serviceprovider
 *   logo          optioneel: img/logos/<id>.png, getoond in plaats van het initialen-blokje
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
  },
  {
    "id": "a-s-r",
    "demo": true,
    "naam": "a.s.r.",
    "type": "verzekeraar",
    "logo": "img/logos/a-s-r.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. a.s.r. heeft deze pagina niet aangeleverd. Zodra a.s.r. meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/a-s-r/",
    "extranet": {
      "url": "https://example.org/a-s-r/adviseursportaal",
      "naam": "Adviseursportaal a.s.r. (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van a.s.r.",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst a.s.r. straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/a-s-r/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/a-s-r/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/a-s-r/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "abn-amro",
    "demo": true,
    "naam": "ABN AMRO",
    "type": "geldverstrekker",
    "logo": "img/logos/abn-amro.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. ABN AMRO heeft deze pagina niet aangeleverd. Zodra ABN AMRO meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/abn-amro/",
    "extranet": {
      "url": "https://example.org/abn-amro/adviseursportaal",
      "naam": "Adviseursportaal ABN AMRO (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van ABN AMRO",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst ABN AMRO straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/abn-amro/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/abn-amro/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/abn-amro/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "allianz-global-assistance",
    "demo": true,
    "naam": "Allianz Global Assistance",
    "type": "verzekeraar",
    "logo": "img/logos/allianz-global-assistance.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Allianz Global Assistance heeft deze pagina niet aangeleverd. Zodra Allianz Global Assistance meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/allianz-global-assistance/",
    "extranet": {
      "url": "https://example.org/allianz-global-assistance/adviseursportaal",
      "naam": "Adviseursportaal Allianz Global Assistance (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Allianz Global Assistance",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Allianz Global Assistance straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/allianz-global-assistance/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/allianz-global-assistance/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/allianz-global-assistance/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "allianz",
    "demo": true,
    "naam": "Allianz",
    "type": "verzekeraar",
    "logo": "img/logos/allianz.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Allianz heeft deze pagina niet aangeleverd. Zodra Allianz meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/allianz/",
    "extranet": {
      "url": "https://example.org/allianz/adviseursportaal",
      "naam": "Adviseursportaal Allianz (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Allianz",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Allianz straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/allianz/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/allianz/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/allianz/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "anker-rechtsbijstand",
    "demo": true,
    "naam": "Anker Rechtsbijstand",
    "type": "verzekeraar",
    "logo": "img/logos/anker-rechtsbijstand.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Anker Rechtsbijstand heeft deze pagina niet aangeleverd. Zodra Anker Rechtsbijstand meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/anker-rechtsbijstand/",
    "extranet": {
      "url": "https://example.org/anker-rechtsbijstand/adviseursportaal",
      "naam": "Adviseursportaal Anker Rechtsbijstand (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Anker Rechtsbijstand",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Anker Rechtsbijstand straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/anker-rechtsbijstand/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/anker-rechtsbijstand/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/anker-rechtsbijstand/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "arag",
    "demo": true,
    "naam": "Arag",
    "type": "verzekeraar",
    "logo": "img/logos/arag.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Arag heeft deze pagina niet aangeleverd. Zodra Arag meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/arag/",
    "extranet": {
      "url": "https://example.org/arag/adviseursportaal",
      "naam": "Adviseursportaal Arag (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Arag",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Arag straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/arag/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/arag/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/arag/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "argenta",
    "demo": true,
    "naam": "Argenta",
    "type": "geldverstrekker",
    "logo": "img/logos/argenta.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Argenta heeft deze pagina niet aangeleverd. Zodra Argenta meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/argenta/",
    "extranet": {
      "url": "https://example.org/argenta/adviseursportaal",
      "naam": "Adviseursportaal Argenta (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Argenta",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Argenta straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/argenta/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/argenta/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/argenta/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "asn-bank",
    "demo": true,
    "naam": "ASN Bank",
    "type": "geldverstrekker",
    "logo": "img/logos/asn-bank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. ASN Bank heeft deze pagina niet aangeleverd. Zodra ASN Bank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/asn-bank/",
    "extranet": {
      "url": "https://example.org/asn-bank/adviseursportaal",
      "naam": "Adviseursportaal ASN Bank (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van ASN Bank",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst ASN Bank straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/asn-bank/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/asn-bank/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/asn-bank/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "attens-hypotheken",
    "demo": true,
    "naam": "Attens Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/attens-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Attens Hypotheken heeft deze pagina niet aangeleverd. Zodra Attens Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/attens-hypotheken/",
    "extranet": {
      "url": "https://example.org/attens-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal Attens Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Attens Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Attens Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/attens-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/attens-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/attens-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "avero-achmea",
    "demo": true,
    "naam": "Avero Achmea",
    "type": "verzekeraar",
    "logo": "img/logos/avero-achmea.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Avero Achmea heeft deze pagina niet aangeleverd. Zodra Avero Achmea meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/avero-achmea/",
    "extranet": {
      "url": "https://example.org/avero-achmea/adviseursportaal",
      "naam": "Adviseursportaal Avero Achmea (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Avero Achmea",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Avero Achmea straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/avero-achmea/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/avero-achmea/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/avero-achmea/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "bijbouwe",
    "demo": true,
    "naam": "bijBouwe",
    "type": "geldverstrekker",
    "logo": "img/logos/bijbouwe.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. bijBouwe heeft deze pagina niet aangeleverd. Zodra bijBouwe meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/bijbouwe/",
    "extranet": {
      "url": "https://example.org/bijbouwe/adviseursportaal",
      "naam": "Adviseursportaal bijBouwe (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van bijBouwe",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst bijBouwe straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bijbouwe/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bijbouwe/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/bijbouwe/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "bnp-paribas",
    "demo": true,
    "naam": "BNP Paribas",
    "type": "kredietverstrekker",
    "logo": "img/logos/bnp-paribas.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. BNP Paribas heeft deze pagina niet aangeleverd. Zodra BNP Paribas meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/bnp-paribas/",
    "extranet": {
      "url": "https://example.org/bnp-paribas/adviseursportaal",
      "naam": "Adviseursportaal BNP Paribas (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van BNP Paribas",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst BNP Paribas straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bnp-paribas/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bnp-paribas/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/bnp-paribas/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "bovemij",
    "demo": true,
    "naam": "Bovemij",
    "type": "verzekeraar",
    "logo": "img/logos/bovemij.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Bovemij heeft deze pagina niet aangeleverd. Zodra Bovemij meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/bovemij/",
    "extranet": {
      "url": "https://example.org/bovemij/adviseursportaal",
      "naam": "Adviseursportaal Bovemij (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Bovemij",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Bovemij straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bovemij/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bovemij/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/bovemij/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "build-finance",
    "demo": true,
    "naam": "Build Finance",
    "type": "geldverstrekker",
    "logo": "img/logos/build-finance.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Build Finance heeft deze pagina niet aangeleverd. Zodra Build Finance meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/build-finance/",
    "extranet": {
      "url": "https://example.org/build-finance/adviseursportaal",
      "naam": "Adviseursportaal Build Finance (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Build Finance",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Build Finance straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/build-finance/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/build-finance/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/build-finance/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "bunq",
    "demo": true,
    "naam": "bunq",
    "type": "geldverstrekker",
    "logo": "img/logos/bunq.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. bunq heeft deze pagina niet aangeleverd. Zodra bunq meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/bunq/",
    "extranet": {
      "url": "https://example.org/bunq/adviseursportaal",
      "naam": "Adviseursportaal bunq (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van bunq",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst bunq straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bunq/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bunq/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/bunq/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "bureau-dfo",
    "demo": true,
    "naam": "Bureau DFO",
    "type": "serviceprovider",
    "logo": "img/logos/bureau-dfo.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Bureau DFO heeft deze pagina niet aangeleverd. Zodra Bureau DFO meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://example.org/bureau-dfo/",
    "extranet": {
      "url": "https://example.org/bureau-dfo/adviseursportaal",
      "naam": "Adviseursportaal Bureau DFO (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Bureau DFO",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Bureau DFO straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bureau-dfo/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bureau-dfo/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/bureau-dfo/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "centraal-beheer",
    "demo": true,
    "naam": "Centraal Beheer",
    "type": "verzekeraar",
    "logo": "img/logos/centraal-beheer.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Centraal Beheer heeft deze pagina niet aangeleverd. Zodra Centraal Beheer meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/centraal-beheer/",
    "extranet": {
      "url": "https://example.org/centraal-beheer/adviseursportaal",
      "naam": "Adviseursportaal Centraal Beheer (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Centraal Beheer",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Centraal Beheer straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/centraal-beheer/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/centraal-beheer/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/centraal-beheer/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "clarian-wonen",
    "demo": true,
    "naam": "Clarian Wonen",
    "type": "geldverstrekker",
    "logo": "img/logos/clarian-wonen.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Clarian Wonen heeft deze pagina niet aangeleverd. Zodra Clarian Wonen meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/clarian-wonen/",
    "extranet": {
      "url": "https://example.org/clarian-wonen/adviseursportaal",
      "naam": "Adviseursportaal Clarian Wonen (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Clarian Wonen",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Clarian Wonen straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/clarian-wonen/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/clarian-wonen/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/clarian-wonen/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "corins",
    "demo": true,
    "naam": "Corins",
    "type": "verzekeraar",
    "logo": "img/logos/corins.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Corins heeft deze pagina niet aangeleverd. Zodra Corins meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/corins/",
    "extranet": {
      "url": "https://example.org/corins/adviseursportaal",
      "naam": "Adviseursportaal Corins (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Corins",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Corins straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/corins/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/corins/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/corins/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "das",
    "demo": true,
    "naam": "DAS",
    "type": "verzekeraar",
    "logo": "img/logos/das.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. DAS heeft deze pagina niet aangeleverd. Zodra DAS meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/das/",
    "extranet": {
      "url": "https://example.org/das/adviseursportaal",
      "naam": "Adviseursportaal DAS (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van DAS",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst DAS straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/das/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/das/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/das/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "de-goudse",
    "demo": true,
    "naam": "De Goudse",
    "type": "verzekeraar",
    "logo": "img/logos/de-goudse.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. De Goudse heeft deze pagina niet aangeleverd. Zodra De Goudse meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/de-goudse/",
    "extranet": {
      "url": "https://example.org/de-goudse/adviseursportaal",
      "naam": "Adviseursportaal De Goudse (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van De Goudse",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst De Goudse straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/de-goudse/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/de-goudse/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/de-goudse/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "de-nederlandse",
    "demo": true,
    "naam": "De Nederlandse",
    "type": "geldverstrekker",
    "logo": "img/logos/de-nederlandse.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. De Nederlandse heeft deze pagina niet aangeleverd. Zodra De Nederlandse meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/de-nederlandse/",
    "extranet": {
      "url": "https://example.org/de-nederlandse/adviseursportaal",
      "naam": "Adviseursportaal De Nederlandse (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van De Nederlandse",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst De Nederlandse straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/de-nederlandse/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/de-nederlandse/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/de-nederlandse/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "de-zeeuwse",
    "demo": true,
    "naam": "De Zeeuwse",
    "type": "verzekeraar",
    "logo": "img/logos/de-zeeuwse.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. De Zeeuwse heeft deze pagina niet aangeleverd. Zodra De Zeeuwse meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/de-zeeuwse/",
    "extranet": {
      "url": "https://example.org/de-zeeuwse/adviseursportaal",
      "naam": "Adviseursportaal De Zeeuwse (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van De Zeeuwse",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst De Zeeuwse straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/de-zeeuwse/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/de-zeeuwse/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/de-zeeuwse/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "defam",
    "demo": true,
    "naam": "DEFAM",
    "type": "kredietverstrekker",
    "logo": "img/logos/defam.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. DEFAM heeft deze pagina niet aangeleverd. Zodra DEFAM meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/defam/",
    "extranet": {
      "url": "https://example.org/defam/adviseursportaal",
      "naam": "Adviseursportaal DEFAM (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van DEFAM",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst DEFAM straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/defam/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/defam/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/defam/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "domivest",
    "demo": true,
    "naam": "Domivest",
    "type": "geldverstrekker",
    "logo": "img/logos/domivest.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Domivest heeft deze pagina niet aangeleverd. Zodra Domivest meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/domivest/",
    "extranet": {
      "url": "https://example.org/domivest/adviseursportaal",
      "naam": "Adviseursportaal Domivest (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Domivest",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Domivest straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/domivest/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/domivest/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/domivest/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "dutch-finance",
    "demo": true,
    "naam": "Dutch Finance",
    "type": "kredietverstrekker",
    "logo": "img/logos/dutch-finance.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Dutch Finance heeft deze pagina niet aangeleverd. Zodra Dutch Finance meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/dutch-finance/",
    "extranet": {
      "url": "https://example.org/dutch-finance/adviseursportaal",
      "naam": "Adviseursportaal Dutch Finance (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Dutch Finance",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Dutch Finance straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/dutch-finance/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/dutch-finance/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/dutch-finance/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "florius",
    "demo": true,
    "naam": "Florius",
    "type": "geldverstrekker",
    "logo": "img/logos/florius.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Florius heeft deze pagina niet aangeleverd. Zodra Florius meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/florius/",
    "extranet": {
      "url": "https://example.org/florius/adviseursportaal",
      "naam": "Adviseursportaal Florius (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Florius",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Florius straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/florius/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/florius/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/florius/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "groene-hart-hypotheken",
    "demo": true,
    "naam": "Groene Hart Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/groene-hart-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Groene Hart Hypotheken heeft deze pagina niet aangeleverd. Zodra Groene Hart Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/groene-hart-hypotheken/",
    "extranet": {
      "url": "https://example.org/groene-hart-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal Groene Hart Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Groene Hart Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Groene Hart Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/groene-hart-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/groene-hart-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/groene-hart-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "guardian-group",
    "demo": true,
    "naam": "Guardian Group",
    "type": "verzekeraar",
    "logo": "img/logos/guardian-group.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Guardian Group heeft deze pagina niet aangeleverd. Zodra Guardian Group meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/guardian-group/",
    "extranet": {
      "url": "https://example.org/guardian-group/adviseursportaal",
      "naam": "Adviseursportaal Guardian Group (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Guardian Group",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Guardian Group straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/guardian-group/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/guardian-group/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/guardian-group/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "handelsbanken",
    "demo": true,
    "naam": "Handelsbanken",
    "type": "geldverstrekker",
    "logo": "img/logos/handelsbanken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Handelsbanken heeft deze pagina niet aangeleverd. Zodra Handelsbanken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/handelsbanken/",
    "extranet": {
      "url": "https://example.org/handelsbanken/adviseursportaal",
      "naam": "Adviseursportaal Handelsbanken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Handelsbanken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Handelsbanken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/handelsbanken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/handelsbanken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/handelsbanken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "hdi",
    "demo": true,
    "naam": "HDI",
    "type": "verzekeraar",
    "logo": "img/logos/hdi.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. HDI heeft deze pagina niet aangeleverd. Zodra HDI meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/hdi/",
    "extranet": {
      "url": "https://example.org/hdi/adviseursportaal",
      "naam": "Adviseursportaal HDI (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van HDI",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst HDI straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/hdi/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/hdi/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/hdi/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "hollandwoont",
    "demo": true,
    "naam": "HollandWoont",
    "type": "geldverstrekker",
    "logo": "img/logos/hollandwoont.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. HollandWoont heeft deze pagina niet aangeleverd. Zodra HollandWoont meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/hollandwoont/",
    "extranet": {
      "url": "https://example.org/hollandwoont/adviseursportaal",
      "naam": "Adviseursportaal HollandWoont (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van HollandWoont",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst HollandWoont straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/hollandwoont/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/hollandwoont/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/hollandwoont/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "impact-hypotheken",
    "demo": true,
    "naam": "Impact Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/impact-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Impact Hypotheken heeft deze pagina niet aangeleverd. Zodra Impact Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/impact-hypotheken/",
    "extranet": {
      "url": "https://example.org/impact-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal Impact Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Impact Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Impact Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/impact-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/impact-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/impact-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "impact-opleiding-en-training",
    "demo": true,
    "naam": "Impact Opleiding en Training",
    "type": "serviceprovider",
    "logo": "img/logos/impact-opleiding-en-training.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Impact Opleiding en Training heeft deze pagina niet aangeleverd. Zodra Impact Opleiding en Training meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://example.org/impact-opleiding-en-training/",
    "extranet": {
      "url": "https://example.org/impact-opleiding-en-training/adviseursportaal",
      "naam": "Adviseursportaal Impact Opleiding en Training (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Impact Opleiding en Training",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Impact Opleiding en Training straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/impact-opleiding-en-training/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/impact-opleiding-en-training/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/impact-opleiding-en-training/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "ing",
    "demo": true,
    "naam": "ING",
    "type": "geldverstrekker",
    "logo": "img/logos/ing.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. ING heeft deze pagina niet aangeleverd. Zodra ING meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/ing/",
    "extranet": {
      "url": "https://example.org/ing/adviseursportaal",
      "naam": "Adviseursportaal ING (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van ING",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst ING straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/ing/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/ing/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/ing/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "iqwoon",
    "demo": true,
    "naam": "IQWOON",
    "type": "geldverstrekker",
    "logo": "img/logos/iqwoon.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. IQWOON heeft deze pagina niet aangeleverd. Zodra IQWOON meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/iqwoon/",
    "extranet": {
      "url": "https://example.org/iqwoon/adviseursportaal",
      "naam": "Adviseursportaal IQWOON (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van IQWOON",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst IQWOON straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/iqwoon/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/iqwoon/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/iqwoon/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "jens",
    "demo": true,
    "naam": "Jens",
    "type": "kredietverstrekker",
    "logo": "img/logos/jens.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Jens heeft deze pagina niet aangeleverd. Zodra Jens meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/jens/",
    "extranet": {
      "url": "https://example.org/jens/adviseursportaal",
      "naam": "Adviseursportaal Jens (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Jens",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Jens straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/jens/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/jens/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/jens/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "knab",
    "demo": true,
    "naam": "Knab",
    "type": "geldverstrekker",
    "logo": "img/logos/knab.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Knab heeft deze pagina niet aangeleverd. Zodra Knab meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/knab/",
    "extranet": {
      "url": "https://example.org/knab/adviseursportaal",
      "naam": "Adviseursportaal Knab (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Knab",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Knab straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/knab/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/knab/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/knab/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "lender-en-spender",
    "demo": true,
    "naam": "Lender & Spender",
    "type": "kredietverstrekker",
    "logo": "img/logos/lender-en-spender.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Lender & Spender heeft deze pagina niet aangeleverd. Zodra Lender & Spender meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/lender-en-spender/",
    "extranet": {
      "url": "https://example.org/lender-en-spender/adviseursportaal",
      "naam": "Adviseursportaal Lender & Spender (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Lender & Spender",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Lender & Spender straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/lender-en-spender/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/lender-en-spender/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/lender-en-spender/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "lloyds-bank",
    "demo": true,
    "naam": "Lloyds Bank",
    "type": "geldverstrekker",
    "logo": "img/logos/lloyds-bank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Lloyds Bank heeft deze pagina niet aangeleverd. Zodra Lloyds Bank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/lloyds-bank/",
    "extranet": {
      "url": "https://example.org/lloyds-bank/adviseursportaal",
      "naam": "Adviseursportaal Lloyds Bank (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Lloyds Bank",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Lloyds Bank straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/lloyds-bank/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/lloyds-bank/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/lloyds-bank/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "maas-lloyd",
    "demo": true,
    "naam": "Maas Lloyd",
    "type": "verzekeraar",
    "logo": "img/logos/maas-lloyd.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Maas Lloyd heeft deze pagina niet aangeleverd. Zodra Maas Lloyd meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/maas-lloyd/",
    "extranet": {
      "url": "https://example.org/maas-lloyd/adviseursportaal",
      "naam": "Adviseursportaal Maas Lloyd (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Maas Lloyd",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Maas Lloyd straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/maas-lloyd/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/maas-lloyd/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/maas-lloyd/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "merius",
    "demo": true,
    "naam": "Merius Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/merius.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Merius Hypotheken heeft deze pagina niet aangeleverd. Zodra Merius Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/merius/",
    "extranet": {
      "url": "https://example.org/merius/adviseursportaal",
      "naam": "Adviseursportaal Merius Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Merius Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Merius Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/merius/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/merius/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/merius/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "midglas",
    "demo": true,
    "naam": "Midglas",
    "type": "verzekeraar",
    "logo": "img/logos/midglas.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Midglas heeft deze pagina niet aangeleverd. Zodra Midglas meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/midglas/",
    "extranet": {
      "url": "https://example.org/midglas/adviseursportaal",
      "naam": "Adviseursportaal Midglas (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Midglas",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Midglas straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/midglas/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/midglas/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/midglas/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "mogelijk",
    "demo": true,
    "naam": "Mogelijk",
    "type": "kredietverstrekker",
    "logo": "img/logos/mogelijk.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Mogelijk heeft deze pagina niet aangeleverd. Zodra Mogelijk meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/mogelijk/",
    "extranet": {
      "url": "https://example.org/mogelijk/adviseursportaal",
      "naam": "Adviseursportaal Mogelijk (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Mogelijk",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Mogelijk straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/mogelijk/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/mogelijk/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/mogelijk/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "ms-amlin",
    "demo": true,
    "naam": "MS Amlin",
    "type": "verzekeraar",
    "logo": "img/logos/ms-amlin.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. MS Amlin heeft deze pagina niet aangeleverd. Zodra MS Amlin meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/ms-amlin/",
    "extranet": {
      "url": "https://example.org/ms-amlin/adviseursportaal",
      "naam": "Adviseursportaal MS Amlin (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van MS Amlin",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst MS Amlin straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/ms-amlin/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/ms-amlin/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/ms-amlin/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "munt-hypotheken",
    "demo": true,
    "naam": "MUNT Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/munt-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. MUNT Hypotheken heeft deze pagina niet aangeleverd. Zodra MUNT Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/munt-hypotheken/",
    "extranet": {
      "url": "https://example.org/munt-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal MUNT Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van MUNT Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst MUNT Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/munt-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/munt-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/munt-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "nationale-nederlanden",
    "demo": true,
    "naam": "Nationale-Nederlanden",
    "type": "verzekeraar",
    "logo": "img/logos/nationale-nederlanden.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nationale-Nederlanden heeft deze pagina niet aangeleverd. Zodra Nationale-Nederlanden meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/nationale-nederlanden/",
    "extranet": {
      "url": "https://example.org/nationale-nederlanden/adviseursportaal",
      "naam": "Adviseursportaal Nationale-Nederlanden (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Nationale-Nederlanden",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Nationale-Nederlanden straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/nationale-nederlanden/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/nationale-nederlanden/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/nationale-nederlanden/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "nationale-waarborg",
    "demo": true,
    "naam": "Nationale Waarborg",
    "type": "serviceprovider",
    "logo": "img/logos/nationale-waarborg.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nationale Waarborg heeft deze pagina niet aangeleverd. Zodra Nationale Waarborg meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://example.org/nationale-waarborg/",
    "extranet": {
      "url": "https://example.org/nationale-waarborg/adviseursportaal",
      "naam": "Adviseursportaal Nationale Waarborg (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Nationale Waarborg",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Nationale Waarborg straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/nationale-waarborg/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/nationale-waarborg/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/nationale-waarborg/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "nestr",
    "demo": true,
    "naam": "Nestr",
    "type": "geldverstrekker",
    "logo": "img/logos/nestr.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nestr heeft deze pagina niet aangeleverd. Zodra Nestr meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/nestr/",
    "extranet": {
      "url": "https://example.org/nestr/adviseursportaal",
      "naam": "Adviseursportaal Nestr (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Nestr",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Nestr straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/nestr/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/nestr/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/nestr/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "nibc",
    "demo": true,
    "naam": "NIBC",
    "type": "geldverstrekker",
    "logo": "img/logos/nibc.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. NIBC heeft deze pagina niet aangeleverd. Zodra NIBC meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/nibc/",
    "extranet": {
      "url": "https://example.org/nibc/adviseursportaal",
      "naam": "Adviseursportaal NIBC (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van NIBC",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst NIBC straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/nibc/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/nibc/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/nibc/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "obvion",
    "demo": true,
    "naam": "Obvion",
    "type": "geldverstrekker",
    "logo": "img/logos/obvion.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Obvion heeft deze pagina niet aangeleverd. Zodra Obvion meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/obvion/",
    "extranet": {
      "url": "https://example.org/obvion/adviseursportaal",
      "naam": "Adviseursportaal Obvion (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Obvion",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Obvion straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/obvion/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/obvion/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/obvion/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "orange-credit",
    "demo": true,
    "naam": "Orange Credit",
    "type": "kredietverstrekker",
    "logo": "img/logos/orange-credit.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Orange Credit heeft deze pagina niet aangeleverd. Zodra Orange Credit meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/orange-credit/",
    "extranet": {
      "url": "https://example.org/orange-credit/adviseursportaal",
      "naam": "Adviseursportaal Orange Credit (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Orange Credit",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Orange Credit straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/orange-credit/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/orange-credit/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/orange-credit/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "qander",
    "demo": true,
    "naam": "Qander",
    "type": "kredietverstrekker",
    "logo": "img/logos/qander.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Qander heeft deze pagina niet aangeleverd. Zodra Qander meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/qander/",
    "extranet": {
      "url": "https://example.org/qander/adviseursportaal",
      "naam": "Adviseursportaal Qander (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Qander",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Qander straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/qander/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/qander/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/qander/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "qredits",
    "demo": true,
    "naam": "Qredits",
    "type": "kredietverstrekker",
    "logo": "img/logos/qredits.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Qredits heeft deze pagina niet aangeleverd. Zodra Qredits meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/qredits/",
    "extranet": {
      "url": "https://example.org/qredits/adviseursportaal",
      "naam": "Adviseursportaal Qredits (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Qredits",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Qredits straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/qredits/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/qredits/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/qredits/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "rabobank",
    "demo": true,
    "naam": "Rabobank",
    "type": "geldverstrekker",
    "logo": "img/logos/rabobank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Rabobank heeft deze pagina niet aangeleverd. Zodra Rabobank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/rabobank/",
    "extranet": {
      "url": "https://example.org/rabobank/adviseursportaal",
      "naam": "Adviseursportaal Rabobank (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Rabobank",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Rabobank straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/rabobank/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/rabobank/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/rabobank/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "rhion",
    "demo": true,
    "naam": "Rhion",
    "type": "verzekeraar",
    "logo": "img/logos/rhion.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Rhion heeft deze pagina niet aangeleverd. Zodra Rhion meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/rhion/",
    "extranet": {
      "url": "https://example.org/rhion/adviseursportaal",
      "naam": "Adviseursportaal Rhion (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Rhion",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Rhion straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/rhion/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/rhion/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/rhion/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "rnhb",
    "demo": true,
    "naam": "RNHB",
    "type": "geldverstrekker",
    "logo": "img/logos/rnhb.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. RNHB heeft deze pagina niet aangeleverd. Zodra RNHB meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/rnhb/",
    "extranet": {
      "url": "https://example.org/rnhb/adviseursportaal",
      "naam": "Adviseursportaal RNHB (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van RNHB",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst RNHB straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/rnhb/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/rnhb/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/rnhb/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "robuust",
    "demo": true,
    "naam": "Robuust Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/robuust.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Robuust Hypotheken heeft deze pagina niet aangeleverd. Zodra Robuust Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/robuust/",
    "extranet": {
      "url": "https://example.org/robuust/adviseursportaal",
      "naam": "Adviseursportaal Robuust Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Robuust Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Robuust Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/robuust/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/robuust/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/robuust/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "samenwerkende-kredietunies",
    "demo": true,
    "naam": "Samenwerkende Kredietunies",
    "type": "kredietverstrekker",
    "logo": "img/logos/samenwerkende-kredietunies.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Samenwerkende Kredietunies heeft deze pagina niet aangeleverd. Zodra Samenwerkende Kredietunies meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/samenwerkende-kredietunies/",
    "extranet": {
      "url": "https://example.org/samenwerkende-kredietunies/adviseursportaal",
      "naam": "Adviseursportaal Samenwerkende Kredietunies (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Samenwerkende Kredietunies",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Samenwerkende Kredietunies straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/samenwerkende-kredietunies/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/samenwerkende-kredietunies/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/samenwerkende-kredietunies/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "socio-hypotheek",
    "demo": true,
    "naam": "SocioHypotheek",
    "type": "geldverstrekker",
    "logo": "img/logos/socio-hypotheek.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SocioHypotheek heeft deze pagina niet aangeleverd. Zodra SocioHypotheek meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/socio-hypotheek/",
    "extranet": {
      "url": "https://example.org/socio-hypotheek/adviseursportaal",
      "naam": "Adviseursportaal SocioHypotheek (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van SocioHypotheek",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst SocioHypotheek straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/socio-hypotheek/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/socio-hypotheek/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/socio-hypotheek/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "solidbriq",
    "demo": true,
    "naam": "SolidBriQ",
    "type": "geldverstrekker",
    "logo": "img/logos/solidbriq.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SolidBriQ heeft deze pagina niet aangeleverd. Zodra SolidBriQ meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/solidbriq/",
    "extranet": {
      "url": "https://example.org/solidbriq/adviseursportaal",
      "naam": "Adviseursportaal SolidBriQ (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van SolidBriQ",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst SolidBriQ straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/solidbriq/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/solidbriq/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/solidbriq/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "syntrus-achmea",
    "demo": true,
    "naam": "Syntrus Achmea / Achmea Mortgage Funds",
    "type": "geldverstrekker",
    "logo": "img/logos/syntrus-achmea.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Syntrus Achmea / Achmea Mortgage Funds heeft deze pagina niet aangeleverd. Zodra Syntrus Achmea / Achmea Mortgage Funds meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/syntrus-achmea/",
    "extranet": {
      "url": "https://example.org/syntrus-achmea/adviseursportaal",
      "naam": "Adviseursportaal Syntrus Achmea / Achmea Mortgage Funds (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Syntrus Achmea / Achmea Mortgage Funds",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Syntrus Achmea / Achmea Mortgage Funds straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/syntrus-achmea/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/syntrus-achmea/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/syntrus-achmea/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "triodos-bank",
    "demo": true,
    "naam": "Triodos Bank",
    "type": "geldverstrekker",
    "logo": "img/logos/triodos-bank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Triodos Bank heeft deze pagina niet aangeleverd. Zodra Triodos Bank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/triodos-bank/",
    "extranet": {
      "url": "https://example.org/triodos-bank/adviseursportaal",
      "naam": "Adviseursportaal Triodos Bank (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Triodos Bank",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Triodos Bank straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/triodos-bank/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/triodos-bank/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/triodos-bank/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "tulp-hypotheken",
    "demo": true,
    "naam": "Tulp Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/tulp-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Tulp Hypotheken heeft deze pagina niet aangeleverd. Zodra Tulp Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/tulp-hypotheken/",
    "extranet": {
      "url": "https://example.org/tulp-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal Tulp Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Tulp Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Tulp Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/tulp-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/tulp-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/tulp-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "unigarant",
    "demo": true,
    "naam": "Unigarant",
    "type": "verzekeraar",
    "logo": "img/logos/unigarant.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Unigarant heeft deze pagina niet aangeleverd. Zodra Unigarant meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://example.org/unigarant/",
    "extranet": {
      "url": "https://example.org/unigarant/adviseursportaal",
      "naam": "Adviseursportaal Unigarant (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Unigarant",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Unigarant straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/unigarant/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/unigarant/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/unigarant/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "venn-hypotheken",
    "demo": true,
    "naam": "Venn Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/venn-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Venn Hypotheken heeft deze pagina niet aangeleverd. Zodra Venn Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/venn-hypotheken/",
    "extranet": {
      "url": "https://example.org/venn-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal Venn Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Venn Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Venn Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/venn-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/venn-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/venn-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "vista-hypotheken",
    "demo": true,
    "naam": "Vista Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/vista-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Vista Hypotheken heeft deze pagina niet aangeleverd. Zodra Vista Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/vista-hypotheken/",
    "extranet": {
      "url": "https://example.org/vista-hypotheken/adviseursportaal",
      "naam": "Adviseursportaal Vista Hypotheken (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Vista Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Vista Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/vista-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/vista-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/vista-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "voor-de-groei",
    "demo": true,
    "naam": "Voor de Groei",
    "type": "kredietverstrekker",
    "logo": "img/logos/voor-de-groei.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Voor de Groei heeft deze pagina niet aangeleverd. Zodra Voor de Groei meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://example.org/voor-de-groei/",
    "extranet": {
      "url": "https://example.org/voor-de-groei/adviseursportaal",
      "naam": "Adviseursportaal Voor de Groei (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Voor de Groei",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Voor de Groei straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/voor-de-groei/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/voor-de-groei/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/voor-de-groei/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  },
  {
    "id": "woonnu",
    "demo": true,
    "naam": "Woonnu",
    "type": "geldverstrekker",
    "logo": "img/logos/woonnu.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Woonnu heeft deze pagina niet aangeleverd. Zodra Woonnu meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://example.org/woonnu/",
    "extranet": {
      "url": "https://example.org/woonnu/adviseursportaal",
      "naam": "Adviseursportaal Woonnu (fictief)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Woonnu",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Woonnu straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/woonnu/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/woonnu/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/woonnu/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03"
  }
];
