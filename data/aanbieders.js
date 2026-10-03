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
 *   rubrieken     optioneel: lijst met rubrieksleutels op het Adviesforum, bijv. ['bankgarantie'] of ['krediet'] (zie RUBRIEKEN in aanbieders.html)
 *                 bekende sleutels: bankgarantie = "Bankgaranties en bieden met zekerheid" (badge en filter op aanbieders.html)
 *   telefoon      optioneel: algemeen of intermediair-telefoonnummer (zakelijk, geen persoonlijke nummers)
 *   opgezocht     JJJJ-MM-DD: datum waarop website, telefoon en extranet door de redactie zijn opgezocht (bij voorbeeldprofielen)
 *   contactbronnen  lijst met bron-URL's van die gegevens
 *   omschrijving  korte zakelijke omschrijving (max. 400 tekens); website: https-url
 *   extranet      {url, naam}  portal of aanvraagomgeving voor adviseurs
 *   contact       [{naam, functie, email, telefoon}]  alleen ZAKELIJKE gegevens, met toestemming van de persoon (AVG)
 *   documenten    [{titel, url, soort}]  soort: voorwaarden | acceptatiegids | productblad | formulier
 *   richtlijnen   [{titel, tekst}]
 *   nieuws        [{id, datum (JJJJ-MM-DD), titel, tekst, url}]  id: kleine letters/cijfers, uniek binnen de aanbieder
 *   elearning     [{titel, url, duur, pe}]  pe: true alleen als de aanbieder PE-punten opgeeft
 *   agenda        [{id, datum, tijd, eind, titel, soort, locatie, pe, url, tekst}]  webinars, PE-bijeenkomsten en events:
 *                   id      kleine letters/cijfers, uniek binnen de aanbieder (bijv. 'a1'); anker: aanbieders.html#agenda-<aanbieder>-<id>
 *                   datum   JJJJ-MM-DD; tijd en eind optioneel 'uu:mm' (eind na tijd); zonder tijd = hele dag
 *                   soort   webinar | bijeenkomst | e-learning | beurs | overig
 *                   locatie plaats/adres, of 'Online'
 *                   pe      true alleen als de aanbieder PE-punten opgeeft (getoond als "PE-punten volgens de aanbieder")
 *                   url     https-link naar aanmelding of informatie bij de aanbieder; tekst: korte omschrijving (optioneel)
 *                 Verlopen items blijven staan (ingeklapt op de detailpagina). Agenda van demo-aanbieders komt niet in feeds.
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
    "bijgewerkt": "2026-10-01",
    "agenda": [
      {
        "id": "a1",
        "datum": "2026-10-20",
        "tijd": "10:00",
        "eind": "11:00",
        "titel": "Webinar: werken met het vernieuwde adviseursportaal (voorbeeld)",
        "soort": "webinar",
        "locatie": "Online",
        "pe": false,
        "url": "https://example.org/agenda/webinar-portaal",
        "tekst": "In een uur laten we zien hoe je een aanvraag indient, documenten uploadt en de status van een dossier volgt in het vernieuwde portaal. Er is ruimte voor vragen."
      },
      {
        "id": "a2",
        "datum": "2026-11-12",
        "tijd": "13:30",
        "eind": "17:00",
        "titel": "Regiobijeenkomst Zuid: acceptatie bij ondernemers (voorbeeld)",
        "soort": "bijeenkomst",
        "locatie": "Voorbeeldlocatie, Eindhoven",
        "pe": true,
        "url": "https://example.org/agenda/regiobijeenkomst-zuid",
        "tekst": "Middagprogramma voor adviseurs over de beoordeling van ondernemersinkomen, met casussen uit de praktijk van de acceptatiedesk."
      },
      {
        "id": "a3",
        "datum": "2026-12-08",
        "tijd": "09:30",
        "eind": "10:15",
        "titel": "Kennissessie acceptatiegids: wat is er veranderd (voorbeeld)",
        "soort": "webinar",
        "locatie": "Online",
        "pe": false,
        "url": "https://example.org/agenda/kennissessie-acceptatiegids",
        "tekst": "Korte toelichting op de redactionele wijzigingen in de acceptatiegids van oktober 2026."
      }
    ]
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
    "bijgewerkt": "2026-09-28",
    "agenda": [
      {
        "id": "a1",
        "datum": "2026-11-05",
        "tijd": "10:00",
        "eind": "11:30",
        "titel": "Webinar vernieuwde polisvoorwaarden overlijdensrisico (voorbeeld)",
        "soort": "webinar",
        "locatie": "Online",
        "pe": true,
        "url": "https://example.org/agenda/webinar-orv-voorwaarden",
        "tekst": "Toelichting op de vernieuwde polisvoorwaarden en wat dit betekent voor lopende en nieuwe adviezen."
      },
      {
        "id": "a2",
        "datum": "2026-12-03",
        "titel": "Stand op een intermediairbeurs (voorbeeld)",
        "soort": "beurs",
        "locatie": "Voorbeeldhal, Utrecht",
        "pe": false,
        "url": "https://example.org/agenda/beurs",
        "tekst": "Kom langs bij onze stand voor vragen over acceptatie van arbeidsongeschiktheidsverzekeringen."
      }
    ]
  },
  {
    "id": "a-s-r",
    "demo": true,
    "naam": "a.s.r.",
    "type": "verzekeraar",
    "logo": "img/logos/a-s-r.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. a.s.r. heeft deze pagina niet aangeleverd. Zodra a.s.r. meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.asr.nl/adviseurs",
    "extranet": {
      "url": "https://www.asr.nl/zakelijk/login/adviseurs",
      "naam": "a.s.r. Cockpit (adviseurslogin)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 278 46 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.asr.nl/adviseur",
      "https://www.asr.nl/zakelijk/login/adviseurs",
      "https://extranet.uitvaart.asr.nl/File/Cockpitkaart.pdf"
    ]
  },
  {
    "id": "abn-amro",
    "demo": true,
    "naam": "ABN AMRO",
    "type": "geldverstrekker",
    "logo": "img/logos/abn-amro.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. ABN AMRO heeft deze pagina niet aangeleverd. Zodra ABN AMRO meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://intermediair.abnamro.nl/",
    "extranet": {
      "url": "https://intermediair.abnamro.nl/systeem/inloggen",
      "naam": "ABN AMRO Intermediair (inloggen)"
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
    "bijgewerkt": "2026-10-03",
    "rubrieken": [
      "krediet"
    ],
    "telefoon": "033 750 46 35",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://intermediair.abnamro.nl/over-ons",
      "https://intermediair.abnamro.nl/systeem/inloggen"
    ]
  },
  {
    "id": "acura-assuradeuren",
    "demo": true,
    "naam": "Acura Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/acura-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Acura Assuradeuren heeft deze pagina niet aangeleverd. Zodra Acura Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://www.acura.nl/voor-assurantietussenpersoon/",
    "extranet": {
      "url": "https://www.acura.nl/service/inloggen-extranet/",
      "naam": "Acura Extranet"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Acura Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Acura Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/acura-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/acura-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/acura-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 765 40 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.acura.nl/service/contactgegevens-per-afdeling/",
      "https://www.acura.nl/service/inloggen-extranet/",
      "https://www.acura.nl/voor-assurantietussenpersoon/"
    ]
  },
  {
    "id": "allianz-global-assistance",
    "demo": true,
    "naam": "Allianz Global Assistance",
    "type": "verzekeraar",
    "logo": "img/logos/allianz-global-assistance.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Allianz Global Assistance heeft deze pagina niet aangeleverd. Zodra Allianz Global Assistance meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.allianz-assistance.nl/over-ons/zakenpartner.html",
    "extranet": {
      "url": "https://ap.allianz-assistance.nl/AllianzAssistApplication/Logon",
      "naam": "Allianz Assist"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 592 98 90",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.allianz-assistance.nl/over-ons/zakenpartner.html",
      "https://ap.allianz-assistance.nl/AllianzAssistApplication/Logon"
    ]
  },
  {
    "id": "allianz",
    "demo": true,
    "naam": "Allianz",
    "type": "verzekeraar",
    "logo": "img/logos/allianz.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Allianz heeft deze pagina niet aangeleverd. Zodra Allianz meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.allianz.nl/particulier/hypotheken.html",
    "extranet": {
      "url": "https://adviseursportaal.allianz.nl/",
      "naam": "Allianz Adviseursportaal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 577 39 39",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.allianz.nl/particulier/hypotheken.html",
      "https://adviseursportaal.allianz.nl/",
      "https://www.allianz.nl/zakelijk/contact.html"
    ]
  },
  {
    "id": "anac-backoffice",
    "demo": true,
    "naam": "Anac Backoffice",
    "type": "serviceprovider",
    "logo": "img/logos/anac-backoffice.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Anac Backoffice heeft deze pagina niet aangeleverd. Zodra Anac Backoffice meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.anac.nl/tussenpersonen/",
    "extranet": {
      "url": "https://mijn.anac.nl/",
      "naam": "Mijn omgeving Anac"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Anac Backoffice",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Anac Backoffice straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/anac-backoffice/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/anac-backoffice/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/anac-backoffice/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "040 264 59 79",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.anac.nl/contact/",
      "https://www.anac.nl/tussenpersonen/",
      "https://mijn.anac.nl/Account/Login?ReturnUrl=%2F",
      "https://sp.dfobv.nl/serviceprovider/anac/"
    ]
  },
  {
    "id": "anker-rechtsbijstand",
    "demo": true,
    "naam": "Anker Rechtsbijstand",
    "type": "verzekeraar",
    "logo": "img/logos/anker-rechtsbijstand.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Anker Rechtsbijstand heeft deze pagina niet aangeleverd. Zodra Anker Rechtsbijstand meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.ankerrechtsbijstand.nl/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "050 520 99 99",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://anker.nl/merken/anker-rechtsbijstand/",
      "https://www.ankerrechtsbijstand.nl/"
    ]
  },
  {
    "id": "arag",
    "demo": true,
    "naam": "Arag",
    "type": "verzekeraar",
    "logo": "img/logos/arag.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Arag heeft deze pagina niet aangeleverd. Zodra Arag meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.arag.nl/intermediair/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "033 434 23 42",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.arag.nl/intermediair/",
      "https://www.arag.nl/intermediair/afdeling-verkoop/",
      "https://www.arag.nl/contact/"
    ]
  },
  {
    "id": "argenta",
    "demo": true,
    "naam": "Argenta",
    "type": "geldverstrekker",
    "logo": "img/logos/argenta.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Argenta heeft deze pagina niet aangeleverd. Zodra Argenta meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.argenta.nl/adviseur/helpen-met-fijn-wonen",
    "extranet": {
      "url": "https://www.argenta.nl/inloggen",
      "naam": "Inloggen adviseurs (Ik ben adviseur)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 205 15 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.argenta.nl/adviseur/contact/veelgestelde-vragen/adviseurs/contact-adviseurs",
      "https://www.argenta.nl/inloggen"
    ]
  },
  {
    "id": "asn-bank",
    "demo": true,
    "naam": "ASN Bank",
    "type": "geldverstrekker",
    "logo": "img/logos/asn-bank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. ASN Bank heeft deze pagina niet aangeleverd. Zodra ASN Bank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.asnbank.nl/hypotheek/onafhankelijke-adviseurs.html",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 633 30 22",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.asnbank.nl/downloads/asn-hypotheek-onafhankelijk-adviseurs-2024.html",
      "https://www.asnbank.nl/service/hypotheken.html"
    ]
  },
  {
    "id": "attens-hypotheken",
    "demo": true,
    "naam": "Attens Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/attens-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Attens Hypotheken heeft deze pagina niet aangeleverd. Zodra Attens Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.attens.nl/voor-adviseurs",
    "extranet": {
      "url": "https://www.attens.nl/voor-adviseurs/adviseursportaal",
      "naam": "Adviseursportaal (Centraal Beheer/Achmea, eHerkenning)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 318 96 50",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.attens.nl/contact",
      "https://www.attens.nl/voor-adviseurs/adviseursportaal"
    ]
  },
  {
    "id": "avero-achmea",
    "demo": true,
    "naam": "Avero Achmea",
    "type": "verzekeraar",
    "logo": "img/logos/avero-achmea.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Avero Achmea heeft deze pagina niet aangeleverd. Zodra Avero Achmea meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.averoachmea.nl/adviseur/arbeidsongeschiktheidsverzekeringen",
    "extranet": {
      "url": "https://www.averoachmea.nl/direct-regelen/inloggen",
      "naam": "Inloggen adviseursdashboard"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "055 579 21 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.averoachmea.nl/direct-regelen/contact",
      "https://www.averoachmea.nl/direct-regelen/inloggen"
    ]
  },
  {
    "id": "bedrijfshypotheek-nl",
    "demo": true,
    "naam": "Bedrijfshypotheek.nl",
    "type": "serviceprovider",
    "logo": "img/logos/bedrijfshypotheek-nl.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Bedrijfshypotheek.nl heeft deze pagina niet aangeleverd. Zodra Bedrijfshypotheek.nl meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor hypotheken.",
    "website": "https://bedrijfshypotheek.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Bedrijfshypotheek.nl",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Bedrijfshypotheek.nl straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bedrijfshypotheek-nl/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bedrijfshypotheek-nl/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/bedrijfshypotheek-nl/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "053 480 24 05",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://bedrijfshypotheek.nl/contact/",
      "https://bedrijfshypotheek.nl/over-ons/"
    ]
  },
  {
    "id": "bijbouwe",
    "demo": true,
    "naam": "bijBouwe",
    "type": "geldverstrekker",
    "logo": "img/logos/bijbouwe.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. bijBouwe heeft deze pagina niet aangeleverd. Zodra bijBouwe meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://bijbouwe.nl/adviseurs",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "024 800 07 87",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://bijbouwe.nl/adviseurs/service-contact",
      "https://bijbouwe.nl/adviseurs"
    ]
  },
  {
    "id": "blueline-hypotheekdesk",
    "demo": true,
    "naam": "Blueline Hypotheekdesk",
    "type": "serviceprovider",
    "logo": "img/logos/blueline-hypotheekdesk.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Blueline Hypotheekdesk heeft deze pagina niet aangeleverd. Zodra Blueline Hypotheekdesk meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor hypotheken.",
    "website": "https://bluelinehypotheekdesk.nl/",
    "extranet": {
      "url": "https://extranet.conneqt.nl/inloggen/",
      "naam": "Conneqt Extranet"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Blueline Hypotheekdesk",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Blueline Hypotheekdesk straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/blueline-hypotheekdesk/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/blueline-hypotheekdesk/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/blueline-hypotheekdesk/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 766 38 16",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://bluelinehypotheekdesk.nl/",
      "https://www.clarianwonen.nl/consument/ik-heb-een-vraag-over-een-aanvraag-met-wie-kan-ik-contact-opnemen",
      "https://extranet.conneqt.nl/inloggen/",
      "https://www.conneqt.nl/en/"
    ]
  },
  {
    "id": "bnp-paribas",
    "demo": true,
    "naam": "BNP Paribas",
    "type": "kredietverstrekker",
    "logo": "img/logos/bnp-paribas.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. BNP Paribas heeft deze pagina niet aangeleverd. Zodra BNP Paribas meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.bnpparibas-pf.nl/",
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
    "bijgewerkt": "2026-10-03",
    "rubrieken": [
      "krediet"
    ],
    "telefoon": "088 886 69 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.bnpparibas.nl/en/get-in-touch-with-our-businesses/",
      "https://www.bnpparibas-pf.nl/lenen/de-persoonlijkste-lening/geselecteerde-financieel-adviseurs"
    ]
  },
  {
    "id": "bnp-paribas-cardif",
    "demo": true,
    "naam": "BNP Paribas Cardif",
    "type": "verzekeraar",
    "logo": "img/logos/bnp-paribas-cardif.png",
    "rubrieken": [
      "bankgarantie"
    ],
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. BNP Paribas Cardif heeft deze pagina niet aangeleverd. Zodra BNP Paribas Cardif meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen. Rubriek op het Adviesforum: bankgaranties en bieden met zekerheid.",
    "website": "https://www.bnpparibascardif.nl/",
    "extranet": {
      "url": "https://www.finagora.nl/",
      "naam": "Finagora"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van BNP Paribas Cardif",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst BNP Paribas Cardif straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bnp-paribas-cardif/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bnp-paribas-cardif/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Productblad (voorbeeld)",
        "url": "https://example.org/bnp-paribas-cardif/productblad.pdf",
        "soort": "productblad"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 486 10 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.bnpparibascardif.nl/contact",
      "https://www.bnpparibascardif.nl/nieuws/cardif-vernieuwt-inkomstenvalmeter"
    ]
  },
  {
    "id": "bovemij",
    "demo": true,
    "naam": "Bovemij",
    "type": "verzekeraar",
    "logo": "img/logos/bovemij.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Bovemij heeft deze pagina niet aangeleverd. Zodra Bovemij meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.bovemij.nl/tussenpersonen",
    "extranet": {
      "url": "https://portaal.bovemij.nl/",
      "naam": "Bovemij Portaal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "024 366 67 62",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.bovemij.nl/tussenpersonen/service-en-contact",
      "https://portaal.bovemij.nl/"
    ]
  },
  {
    "id": "bsb-volmachten",
    "demo": true,
    "naam": "BSB Volmachten",
    "type": "serviceprovider",
    "logo": "img/logos/bsb-volmachten.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. BSB Volmachten heeft deze pagina niet aangeleverd. Zodra BSB Volmachten meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://www.bsbvolmachten.nl/",
    "extranet": {
      "url": "https://www.bsbvolmachten.nl/bsbnet/",
      "naam": "BSBnet"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van BSB Volmachten",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst BSB Volmachten straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/bsb-volmachten/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/bsb-volmachten/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/bsb-volmachten/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "046 423 02 35",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.bsbvolmachten.nl/contact/",
      "https://www.bsbvolmachten.nl/bsbnet/"
    ]
  },
  {
    "id": "build-finance",
    "demo": true,
    "naam": "Build Finance",
    "type": "geldverstrekker",
    "logo": "img/logos/build-finance.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Build Finance heeft deze pagina niet aangeleverd. Zodra Build Finance meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://build-finance.com/voor-adviseurs/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 130 35 40",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://build-finance.com/contact/",
      "https://build-finance.com/voor-adviseurs/"
    ]
  },
  {
    "id": "bunq",
    "demo": true,
    "naam": "bunq",
    "type": "geldverstrekker",
    "logo": "img/logos/bunq.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. bunq heeft deze pagina niet aangeleverd. Zodra bunq meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://mortgages.bunq.com/",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://mortgages.bunq.com/contact",
      "https://help.bunq.com/en/articles/bunq-easy-mortgages"
    ]
  },
  {
    "id": "bureau-dfo",
    "demo": true,
    "naam": "Bureau DFO",
    "type": "serviceprovider",
    "logo": "img/logos/bureau-dfo.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Bureau DFO heeft deze pagina niet aangeleverd. Zodra Bureau DFO meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.dfobv.nl/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "033 258 04 60",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.dfobv.nl/contact/"
    ]
  },
  {
    "id": "capsearch",
    "demo": true,
    "naam": "Capsearch",
    "type": "serviceprovider",
    "logo": "img/logos/capsearch.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Capsearch heeft deze pagina niet aangeleverd. Zodra Capsearch meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://capsearch.com/hypotheekadviseur/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Capsearch",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Capsearch straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/capsearch/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/capsearch/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/capsearch/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 065 67 92",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://capsearch.com/contact/",
      "https://content.capsearch.com/knowledge-base/inloggen-en-dashboard"
    ]
  },
  {
    "id": "centraal-beheer",
    "demo": true,
    "naam": "Centraal Beheer",
    "type": "verzekeraar",
    "logo": "img/logos/centraal-beheer.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Centraal Beheer heeft deze pagina niet aangeleverd. Zodra Centraal Beheer meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.centraalbeheer.nl/voor-adviseurs/hypotheek",
    "extranet": {
      "url": "https://www.centraalbeheer.nl/voor-adviseurs/adviseursportaal",
      "naam": "Adviseursportaal (eHerkenning)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "055 579 85 10",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.centraalbeheer.nl/voor-adviseurs/contact/hypotheken",
      "https://www.centraalbeheer.nl/voor-adviseurs/adviseursportaal"
    ]
  },
  {
    "id": "certe-assuradeuren",
    "demo": true,
    "naam": "Certe Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/certe-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Certe Assuradeuren heeft deze pagina niet aangeleverd. Zodra Certe Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://certe-assuradeuren.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Certe Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Certe Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/certe-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/certe-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/certe-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "0524 52 40 25",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://certe-assuradeuren.nl/voor-adviseurs/service-en-contact/",
      "https://www.amweb.nl/155090/assuradeurengilde-verandert-haar-naam"
    ]
  },
  {
    "id": "cfsn-kredietendesk",
    "demo": true,
    "naam": "CFSN Kredietendesk",
    "type": "serviceprovider",
    "logo": "img/logos/cfsn-kredietendesk.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. CFSN Kredietendesk heeft deze pagina niet aangeleverd. Zodra CFSN Kredietendesk meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor kredieten.",
    "website": "https://www.cfsn.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van CFSN Kredietendesk",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst CFSN Kredietendesk straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/cfsn-kredietendesk/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/cfsn-kredietendesk/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/cfsn-kredietendesk/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 237 60 60",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://sp.dfobv.nl/serviceprovider/cfsn-kredietendesk/",
      "https://www.cfsn.nl/nieuwe-extranet"
    ]
  },
  {
    "id": "clarian-wonen",
    "demo": true,
    "naam": "Clarian Wonen",
    "type": "geldverstrekker",
    "logo": "img/logos/clarian-wonen.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Clarian Wonen heeft deze pagina niet aangeleverd. Zodra Clarian Wonen meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.clarianwonen.nl/voor-adviseurs/",
    "extranet": {
      "url": "https://extranet.conneqt.nl/inloggen/",
      "naam": "Conneqt Extranet"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 766 38 15",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.clarianwonen.nl/consument/ik-heb-een-vraag-over-een-aanvraag-met-wie-kan-ik-contact-opnemen",
      "https://www.clarianwonen.nl/contact/",
      "https://extranet.conneqt.nl/inloggen/",
      "https://www.conneqt.nl/blog/conneqt-introduceert-clarian-wonen/"
    ]
  },
  {
    "id": "connect-assuradeuren",
    "demo": true,
    "naam": "Connect Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/connect-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Connect Assuradeuren heeft deze pagina niet aangeleverd. Zodra Connect Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://connect-assuradeuren.nl/tussenpersoon/wat-kan-connect-voor-u-betekenen",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Connect Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Connect Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/connect-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/connect-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/connect-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "0229 54 75 90",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.connect-assuradeuren.nl/Contact/contact-informatie",
      "https://www.veldsink.nl/nieuws/branche/connect-assuradeuren-wordt-onderdeel-van-veldsink-groep/"
    ]
  },
  {
    "id": "corins",
    "demo": true,
    "naam": "Corins",
    "type": "verzekeraar",
    "logo": "img/logos/corins.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Corins heeft deze pagina niet aangeleverd. Zodra Corins meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://corins.nl/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 301 77 70",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://corins.nl/contactproperty.htm"
    ]
  },
  {
    "id": "dak-intermediairscollectief",
    "demo": true,
    "naam": "DAK intermediairscollectief",
    "type": "serviceprovider",
    "logo": "img/logos/dak-intermediairscollectief.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. DAK intermediairscollectief heeft deze pagina niet aangeleverd. Zodra DAK intermediairscollectief meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://dak.nl/",
    "extranet": {
      "url": "https://wijzijndak.nl/",
      "naam": "WijzijnDAK.nl (ledenomgeving)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van DAK intermediairscollectief",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst DAK intermediairscollectief straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/dak-intermediairscollectief/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/dak-intermediairscollectief/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/dak-intermediairscollectief/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 666 00 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://dak.nl/consumenten/contact/klachten/",
      "https://dak.nl/contact/ledenservice/",
      "https://dak.nl/novulo/"
    ]
  },
  {
    "id": "das",
    "demo": true,
    "naam": "DAS",
    "type": "verzekeraar",
    "logo": "img/logos/das.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. DAS heeft deze pagina niet aangeleverd. Zodra DAS meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.das.nl/adviseur",
    "extranet": {
      "url": "https://adviseur.das.nl/inloggen",
      "naam": "DAS voor Adviseurs"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 651 78 11",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.das.nl/adviseur",
      "https://adviseur.das.nl/inloggen?ac=1608111558",
      "https://www.das.nl/ondernemer/service-en-contact"
    ]
  },
  {
    "id": "de-goudse",
    "demo": true,
    "naam": "De Goudse",
    "type": "verzekeraar",
    "logo": "img/logos/de-goudse.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. De Goudse heeft deze pagina niet aangeleverd. Zodra De Goudse meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.goudse.nl/adviseur",
    "extranet": {
      "url": "https://www.goudse.nl/inloggen",
      "naam": "Adviseursportaal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "0182 544 544",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.goudse.nl/algemeen/contact/telefoonnummers",
      "https://www.goudse.nl/adviseur",
      "https://www.goudse.nl/inloggen"
    ]
  },
  {
    "id": "de-nederlandse",
    "demo": true,
    "naam": "De Nederlandse",
    "type": "geldverstrekker",
    "logo": "img/logos/de-nederlandse.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. De Nederlandse heeft deze pagina niet aangeleverd. Zodra De Nederlandse meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://de-nederlandse.nl/adviseurs/",
    "extranet": {
      "url": "https://de-nederlandse.nl/login/",
      "naam": "Mijn De Nederlandse"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 307 05 50",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://de-nederlandse.nl/verhuur-hypotheek/",
      "https://de-nederlandse.nl/adviseurs/",
      "https://de-nederlandse.nl/login/"
    ]
  },
  {
    "id": "de-zeeuwse",
    "demo": true,
    "naam": "De Zeeuwse",
    "type": "verzekeraar",
    "logo": "img/logos/de-zeeuwse.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. De Zeeuwse heeft deze pagina niet aangeleverd. Zodra De Zeeuwse meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.dezeeuwse.nl/adviseur",
    "extranet": {
      "url": "https://www.dezeeuwse.nl/inloggen",
      "naam": "Adviseursportaal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "0118 683 300",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.dezeeuwse.nl/algemeen/contact",
      "https://www.dezeeuwse.nl/adviseur",
      "https://www.dezeeuwse.nl/inloggen"
    ]
  },
  {
    "id": "defam",
    "demo": true,
    "naam": "DEFAM",
    "type": "kredietverstrekker",
    "logo": "img/logos/defam.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. DEFAM heeft deze pagina niet aangeleverd. Zodra DEFAM meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.defam.nl/voor-partners/",
    "extranet": {
      "url": "https://www.defam.nl/voor-partners/portaal/",
      "naam": "DP Portaal"
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
    "bijgewerkt": "2026-10-03",
    "rubrieken": [
      "krediet"
    ],
    "telefoon": "030 659 66 15",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.defam.nl/voor-partners/portaal/",
      "https://www.defam.nl/voor-partners/"
    ]
  },
  {
    "id": "domivest",
    "demo": true,
    "naam": "Domivest",
    "type": "geldverstrekker",
    "logo": "img/logos/domivest.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Domivest heeft deze pagina niet aangeleverd. Zodra Domivest meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://domivest.com/",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://domivest.com/contact",
      "https://domivest.com/het-product"
    ]
  },
  {
    "id": "dutch-finance",
    "demo": true,
    "naam": "Dutch Finance",
    "type": "kredietverstrekker",
    "logo": "img/logos/dutch-finance.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Dutch Finance heeft deze pagina niet aangeleverd. Zodra Dutch Finance meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.dutchfinance.nl/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "033 479 18 60",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.dutchfinance.nl/",
      "https://www.dutchfinance.nl/over-dutchfinance"
    ]
  },
  {
    "id": "financieel-fit",
    "demo": true,
    "naam": "Financieel Fit",
    "type": "serviceprovider",
    "logo": "img/logos/financieel-fit.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Financieel Fit heeft deze pagina niet aangeleverd. Zodra Financieel Fit meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.financieelfit.nl/",
    "extranet": {
      "url": "https://portaal.financieelfit.nl/",
      "naam": "Financieel Fit Portaal (service dashboard)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Financieel Fit",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Financieel Fit straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/financieel-fit/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/financieel-fit/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/financieel-fit/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "0164 607 211",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.financieelfit.nl/contact/",
      "https://wiki.financieelfit.nl/portaal/verbinden-met-het-portaal/inloggen-op-het-service-dashboard"
    ]
  },
  {
    "id": "financieel-zeker",
    "demo": true,
    "naam": "Financieel Zeker",
    "type": "serviceprovider",
    "logo": "img/logos/financieel-zeker.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Financieel Zeker heeft deze pagina niet aangeleverd. Zodra Financieel Zeker meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Financieel Zeker",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Financieel Zeker straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/financieel-zeker/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/financieel-zeker/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/financieel-zeker/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "florius",
    "demo": true,
    "naam": "Florius",
    "type": "geldverstrekker",
    "logo": "img/logos/florius.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Florius heeft deze pagina niet aangeleverd. Zodra Florius meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.florius.nl/",
    "extranet": {
      "url": "https://login.florius.nl/Login/",
      "naam": "Florius Adviseurs Netwerk (FAN)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "033 752 50 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.florius.nl/service-en-contact",
      "https://login.florius.nl/Login/"
    ]
  },
  {
    "id": "fondsen-platform",
    "demo": true,
    "naam": "Fondsen Platform",
    "type": "serviceprovider",
    "logo": "img/logos/fondsen-platform.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Fondsen Platform heeft deze pagina niet aangeleverd. Zodra Fondsen Platform meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Fondsen Platform",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Fondsen Platform straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/fondsen-platform/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/fondsen-platform/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/fondsen-platform/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "groene-hart-hypotheken",
    "demo": true,
    "naam": "Groene Hart Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/groene-hart-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Groene Hart Hypotheken heeft deze pagina niet aangeleverd. Zodra Groene Hart Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://groeneharthypotheken.nl/adviseurs/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 307 05 25",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://groeneharthypotheken.nl/handig/contact/",
      "https://groeneharthypotheken.nl/adviseurs/over-ons/dak-intermediairscollectief/"
    ]
  },
  {
    "id": "guardian-group",
    "demo": true,
    "naam": "Guardian Group",
    "type": "verzekeraar",
    "logo": "img/logos/guardian-group.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Guardian Group heeft deze pagina niet aangeleverd. Zodra Guardian Group meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.fsma.be/en/party/guardian-group-nederland-nv"
    ]
  },
  {
    "id": "handelsbanken",
    "demo": true,
    "naam": "Handelsbanken",
    "type": "geldverstrekker",
    "logo": "img/logos/handelsbanken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Handelsbanken heeft deze pagina niet aangeleverd. Zodra Handelsbanken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.handelsbanken.nl/nl/particulier/hypotheken",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "0800 820 00 20",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.handelsbanken.nl/nl/particulier/hypotheken",
      "https://www.handelsbanken.nl/nl/vind-uw-kantoor/amsterdam-zuid"
    ]
  },
  {
    "id": "hdi",
    "demo": true,
    "naam": "HDI",
    "type": "verzekeraar",
    "logo": "img/logos/hdi.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. HDI heeft deze pagina niet aangeleverd. Zodra HDI meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.hdi.global/nl-nl/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 403 61 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.hdi.global/en-us/about-us/locations-contacts/",
      "https://www.hdi.global/nl-nl/services/volmachten/"
    ]
  },
  {
    "id": "heinenoord-assuradeuren",
    "demo": true,
    "naam": "Heinenoord Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/heinenoord-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Heinenoord Assuradeuren heeft deze pagina niet aangeleverd. Zodra Heinenoord Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://www.heinenoord.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Heinenoord Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Heinenoord Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/heinenoord-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/heinenoord-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/heinenoord-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 860 09 98",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.heinenoord.nl/contact",
      "https://www.heinenoord.nl/"
    ]
  },
  {
    "id": "hoeksche-waard-assuradeuren",
    "demo": true,
    "naam": "Hoeksche Waard Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/hoeksche-waard-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Hoeksche Waard Assuradeuren heeft deze pagina niet aangeleverd. Zodra Hoeksche Waard Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://hoekschewaardassuradeuren.nl/intermediair/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Hoeksche Waard Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Hoeksche Waard Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/hoeksche-waard-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/hoeksche-waard-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/hoeksche-waard-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "078 676 90 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://hoekschewaardassuradeuren.nl/contact/",
      "https://hoekschewaardassuradeuren.nl/intermediair/"
    ]
  },
  {
    "id": "hollandwoont",
    "demo": true,
    "naam": "HollandWoont",
    "type": "geldverstrekker",
    "logo": "img/logos/hollandwoont.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. HollandWoont heeft deze pagina niet aangeleverd. Zodra HollandWoont meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.hollandwoont.nl/adviseur",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 242 22 91",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.hollandwoont.nl/adviseur/service-contact",
      "https://www.hollandwoont.nl/adviseur"
    ]
  },
  {
    "id": "home-invest",
    "demo": true,
    "naam": "Home Invest",
    "type": "serviceprovider",
    "logo": "img/logos/home-invest.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Home Invest heeft deze pagina niet aangeleverd. Zodra Home Invest meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Home Invest",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Home Invest straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/home-invest/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/home-invest/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/home-invest/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "huismerk",
    "demo": true,
    "naam": "Huismerk",
    "type": "serviceprovider",
    "logo": "img/logos/huismerk.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Huismerk heeft deze pagina niet aangeleverd. Zodra Huismerk meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.huismerk.nl/",
    "extranet": {
      "url": "https://huismerk.nl/dashboard/",
      "naam": "Dashboard Adviseurs"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Huismerk",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Huismerk straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/huismerk/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/huismerk/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/huismerk/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 766 38 70",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://huismerk.nl/over-huismerk/contact/",
      "https://huismerk.nl/dashboard/"
    ]
  },
  {
    "id": "hypotheekgo",
    "demo": true,
    "naam": "HypotheekGo",
    "type": "serviceprovider",
    "logo": "img/logos/hypotheekgo.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. HypotheekGo heeft deze pagina niet aangeleverd. Zodra HypotheekGo meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor hypotheken.",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van HypotheekGo",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst HypotheekGo straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/hypotheekgo/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/hypotheekgo/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/hypotheekgo/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "impact-hypotheken",
    "demo": true,
    "naam": "Impact Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/impact-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Impact Hypotheken heeft deze pagina niet aangeleverd. Zodra Impact Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://impacthypotheken.nl/adviseur",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 205 64 76",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://impacthypotheken.nl/adviseur/contact/",
      "https://impacthypotheken.nl/adviseur/veelgestelde-vragen/wat-kan-ik-met-de-portal-voor-adviseurs/"
    ]
  },
  {
    "id": "impact-opleiding-en-training",
    "demo": true,
    "naam": "Impact Opleiding en Training",
    "type": "serviceprovider",
    "logo": "img/logos/impact-opleiding-en-training.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Impact Opleiding en Training heeft deze pagina niet aangeleverd. Zodra Impact Opleiding en Training meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "ing",
    "demo": true,
    "naam": "ING",
    "type": "geldverstrekker",
    "logo": "img/logos/ing.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. ING heeft deze pagina niet aangeleverd. Zodra ING meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://intermediairs.ing.nl/",
    "extranet": {
      "url": "https://intermediairs.ing.nl/",
      "naam": "ING Intermediairs portaal"
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
    "bijgewerkt": "2026-10-03",
    "rubrieken": [
      "krediet"
    ],
    "telefoon": "020 576 47 11",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://mijn.intermediairs.ing.nl/",
      "https://mijn.intermediairs.ing.nl/content/ingex-live-public/nl_NL/header/help.html"
    ]
  },
  {
    "id": "iqwoon",
    "demo": true,
    "naam": "IQWOON",
    "type": "geldverstrekker",
    "logo": "img/logos/iqwoon.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. IQWOON heeft deze pagina niet aangeleverd. Zodra IQWOON meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.iqwoon.nl/adviseur",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 266 36 60",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.iqwoon.nl/service-contact",
      "https://www.iqwoon.nl/adviseur"
    ]
  },
  {
    "id": "jens",
    "demo": true,
    "naam": "Jens",
    "type": "kredietverstrekker",
    "logo": "img/logos/jens.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Jens heeft deze pagina niet aangeleverd. Zodra Jens meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://jens.nl/partner/",
    "extranet": {
      "url": "https://jens.nl/inloggen/",
      "naam": "Jens Dashboard"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 588 59 99",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://jens.nl/intermediairs/",
      "https://jens.nl/partner/",
      "https://jens.nl/inloggen/"
    ]
  },
  {
    "id": "klap",
    "demo": true,
    "naam": "Klap",
    "type": "serviceprovider",
    "logo": "img/logos/klap.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Klap heeft deze pagina niet aangeleverd. Zodra Klap meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.klap.nl",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Klap",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Klap straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/klap/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/klap/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/klap/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 592 95 11",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://klap.nl/nijmegen"
    ]
  },
  {
    "id": "knab",
    "demo": true,
    "naam": "Knab",
    "type": "geldverstrekker",
    "logo": "img/logos/knab.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Knab heeft deze pagina niet aangeleverd. Zodra Knab meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.knab.nl/particulier/hypotheken/knab-hypotheek/adviseurs",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.knab.nl/particulier/hypotheken/knab-hypotheek/adviseurs"
    ]
  },
  {
    "id": "landelijk-netwerk-inkoopcombinatie",
    "demo": true,
    "naam": "Landelijk Netwerk Inkoopcombinatie",
    "type": "serviceprovider",
    "logo": "img/logos/landelijk-netwerk-inkoopcombinatie.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Landelijk Netwerk Inkoopcombinatie heeft deze pagina niet aangeleverd. Zodra Landelijk Netwerk Inkoopcombinatie meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Landelijk Netwerk Inkoopcombinatie",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Landelijk Netwerk Inkoopcombinatie straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/landelijk-netwerk-inkoopcombinatie/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/landelijk-netwerk-inkoopcombinatie/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/landelijk-netwerk-inkoopcombinatie/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "lender-en-spender",
    "demo": true,
    "naam": "Lender & Spender",
    "type": "kredietverstrekker",
    "logo": "img/logos/lender-en-spender.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Lender & Spender heeft deze pagina niet aangeleverd. Zodra Lender & Spender meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://partners.lenderspender.nl/support",
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
    "bijgewerkt": "2026-10-03",
    "rubrieken": [
      "krediet"
    ],
    "telefoon": "085 000 39 98",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://partners.lenderspender.nl/support/contact",
      "https://www.lenderspender.nl/"
    ]
  },
  {
    "id": "lloyds-bank",
    "demo": true,
    "naam": "Lloyds Bank",
    "type": "geldverstrekker",
    "logo": "img/logos/lloyds-bank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Lloyds Bank heeft deze pagina niet aangeleverd. Zodra Lloyds Bank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.lloydsbank.nl/informatie-voor-financieel-adviseurs",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 305 78 04",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.lloydsbank.nl/dam/jcr:3a7eae46-003b-4e0d-80dd-ae5239be6b17/Lloyds%20Bank%20Contactsheet%20ISD2.pdf",
      "https://www.lloydsbank.nl/informatie-voor-financieel-adviseurs"
    ]
  },
  {
    "id": "maas-lloyd",
    "demo": true,
    "naam": "Maas Lloyd",
    "type": "verzekeraar",
    "logo": "img/logos/maas-lloyd.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Maas Lloyd heeft deze pagina niet aangeleverd. Zodra Maas Lloyd meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://maaslloyd.nl",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 212 10 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://maaslloyd.nl/contact/"
    ]
  },
  {
    "id": "merius",
    "demo": true,
    "naam": "Merius Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/merius.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Merius Hypotheken heeft deze pagina niet aangeleverd. Zodra Merius Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://meriushypotheken.nl/adviseur/samenwerken/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 205 64 66",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://meriushypotheken.nl/adviseur/contact/",
      "https://meriushypotheken.nl/adviseur/voorbespreken/"
    ]
  },
  {
    "id": "midglas",
    "demo": true,
    "naam": "Midglas",
    "type": "verzekeraar",
    "logo": "img/logos/midglas.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Midglas heeft deze pagina niet aangeleverd. Zodra Midglas meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.midglas.nl",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "076 522 44 77",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://midglas.nl/contact/"
    ]
  },
  {
    "id": "mogelijk",
    "demo": true,
    "naam": "Mogelijk",
    "type": "kredietverstrekker",
    "logo": "img/logos/mogelijk.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Mogelijk heeft deze pagina niet aangeleverd. Zodra Mogelijk meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.mogelijk.nl",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "0346 250 171",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.mogelijk.nl/contact"
    ]
  },
  {
    "id": "ms-amlin",
    "demo": true,
    "naam": "MS Amlin",
    "type": "verzekeraar",
    "logo": "img/logos/ms-amlin.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. MS Amlin heeft deze pagina niet aangeleverd. Zodra MS Amlin meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.msamlin.com",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 503 11 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.msamlin.com/en/contact.html"
    ]
  },
  {
    "id": "munt-hypotheken",
    "demo": true,
    "naam": "MUNT Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/munt-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. MUNT Hypotheken heeft deze pagina niet aangeleverd. Zodra MUNT Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.munthypotheken.nl/contact/adviseur/",
    "extranet": {
      "url": "https://www.munthypotheken.nl/servicepartner/",
      "naam": "MUNTportal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "033 450 97 80",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.munthypotheken.nl/contact/adviseur/",
      "https://www.munthypotheken.nl/servicepartner/"
    ]
  },
  {
    "id": "nationale-nederlanden",
    "demo": true,
    "naam": "Nationale-Nederlanden",
    "type": "verzekeraar",
    "logo": "img/logos/nationale-nederlanden.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nationale-Nederlanden heeft deze pagina niet aangeleverd. Zodra Nationale-Nederlanden meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://adviseur.nn.nl/",
    "extranet": {
      "url": "https://adviseur.nn.nl/",
      "naam": "NN Adviseur"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "070 513 08 20",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://adviseur.nn.nl/",
      "https://adviseur.nn.nl/contact"
    ]
  },
  {
    "id": "nationale-waarborg",
    "demo": true,
    "naam": "Nationale Waarborg",
    "type": "serviceprovider",
    "logo": "img/logos/nationale-waarborg.png",
    "rubrieken": [
      "bankgarantie"
    ],
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nationale Waarborg heeft deze pagina niet aangeleverd. Zodra Nationale Waarborg meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Rubriek op het Adviesforum: bankgaranties en bieden met zekerheid.",
    "website": "https://nationalewaarborg.nl/adviseur/",
    "extranet": {
      "url": "https://portaal.nationalewaarborg.nl/",
      "naam": "NWB Online"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 220 55 46",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://nationalewaarborg.nl/adviseur/contact/",
      "https://portaal.nationalewaarborg.nl/"
    ]
  },
  {
    "id": "nedasco",
    "demo": true,
    "naam": "Nedasco",
    "type": "serviceprovider",
    "logo": "img/logos/nedasco.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nedasco heeft deze pagina niet aangeleverd. Zodra Nedasco meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.nedasco.nl/adviseurs/contact/",
    "extranet": {
      "url": "https://www.nedasco.nl/adviseurs/servicenet/",
      "naam": "ServiceNet / Mijn Nedasco"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Nedasco",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Nedasco straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/nedasco/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/nedasco/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/nedasco/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "033 467 08 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.nedasco.nl/adviseurs/contact/",
      "https://www.nedasco.nl/nsn-mijn-nedasco/veelgesteldevragen/inloggen-en-starten/",
      "https://www.nedasco.nl/adviseurs/servicenet/"
    ]
  },
  {
    "id": "nestr",
    "demo": true,
    "naam": "Nestr",
    "type": "geldverstrekker",
    "logo": "img/logos/nestr.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Nestr heeft deze pagina niet aangeleverd. Zodra Nestr meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.nestr.nl",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 130 89 50",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.nestr.nl/contact"
    ]
  },
  {
    "id": "nibc",
    "demo": true,
    "naam": "NIBC",
    "type": "geldverstrekker",
    "logo": "img/logos/nibc.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. NIBC heeft deze pagina niet aangeleverd. Zodra NIBC meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://nibc.nl/intermediair",
    "extranet": {
      "url": "https://intermediair.nibcdirect.nl/",
      "naam": "E-adviseur (via NIBC intermediairsite)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "070 342 50 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://nibc.nl/intermediair/hypotheekdesk",
      "https://nibc.nl/intermediair/contact",
      "https://intermediair.nibcdirect.nl/",
      "https://nibc.nl/intermediair/nieuwsberichten/actuele-klantdata-inzichtelijk"
    ]
  },
  {
    "id": "nnek",
    "demo": true,
    "naam": "NNEK",
    "type": "serviceprovider",
    "logo": "img/logos/nnek.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. NNEK heeft deze pagina niet aangeleverd. Zodra NNEK meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.nnek.nl",
    "extranet": {
      "url": "https://www.nnek.nl/inloggennnek/",
      "naam": "Inloggen NNEK (adviseur)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van NNEK",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst NNEK straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/nnek/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/nnek/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/nnek/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 551 01 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.nnek.nl/contact/",
      "https://www.nnek.nl/inloggennnek/"
    ]
  },
  {
    "id": "obvion",
    "demo": true,
    "naam": "Obvion",
    "type": "geldverstrekker",
    "logo": "img/logos/obvion.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Obvion heeft deze pagina niet aangeleverd. Zodra Obvion meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.obvion.nl/adviseur/Samenwerken-Obvion",
    "extranet": {
      "url": "https://dxp.obvion.nl/",
      "naam": "Adviseursportaal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 147 02 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://dxp.obvion.nl/",
      "https://obvion.nl/service/"
    ]
  },
  {
    "id": "orange-credit",
    "demo": true,
    "naam": "Orange Credit",
    "type": "kredietverstrekker",
    "logo": "img/logos/orange-credit.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Orange Credit heeft deze pagina niet aangeleverd. Zodra Orange Credit meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://orangecredit.nl/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 820 00 80",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://orangecredit.nl/",
      "https://orangecredit.nl/contact-woonboothypotheek/"
    ]
  },
  {
    "id": "pentrax",
    "demo": true,
    "naam": "Pentrax",
    "type": "serviceprovider",
    "logo": "img/logos/pentrax.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Pentrax heeft deze pagina niet aangeleverd. Zodra Pentrax meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Rekenexpert voor de inkomensverklaring ondernemer (IKV) bij hypotheekaanvragen van zelfstandigen.",
    "website": "https://www.pentrax.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Pentrax",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Pentrax straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/pentrax/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/pentrax/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Formulier (voorbeeld)",
        "url": "https://example.org/pentrax/formulier.pdf",
        "soort": "formulier"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "024 833 00 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.pentrax.nl/contact"
    ]
  },
  {
    "id": "polaris-assuradeuren",
    "demo": true,
    "naam": "Polaris Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/polaris-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Polaris Assuradeuren heeft deze pagina niet aangeleverd. Zodra Polaris Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://polaris-assuradeuren.nl/",
    "extranet": {
      "url": "https://polaris-assuradeuren.nl/inloggen/",
      "naam": "Inloggen"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Polaris Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Polaris Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/polaris-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/polaris-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/polaris-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "0411 745 011",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://polaris-assuradeuren.nl/contact/",
      "https://polaris-assuradeuren.nl/inloggen/"
    ]
  },
  {
    "id": "qander",
    "demo": true,
    "naam": "Qander",
    "type": "kredietverstrekker",
    "logo": "img/logos/qander.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Qander heeft deze pagina niet aangeleverd. Zodra Qander meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.qander.nl/onze-tussenpersonen/",
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
    "bijgewerkt": "2026-10-03",
    "rubrieken": [
      "krediet"
    ],
    "telefoon": "073 646 25 30",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.qander.nl/contact/",
      "https://www.qander.nl/onze-tussenpersonen/"
    ]
  },
  {
    "id": "qredits",
    "demo": true,
    "naam": "Qredits",
    "type": "kredietverstrekker",
    "logo": "img/logos/qredits.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Qredits heeft deze pagina niet aangeleverd. Zodra Qredits meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.qredits.nl/initiatieven/intermediairs",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "0546 53 40 10",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.qredits.nl/contact",
      "https://www.qredits.nl/initiatieven/intermediairs"
    ]
  },
  {
    "id": "raadhuys",
    "demo": true,
    "naam": "Raadhuys Tax Legal Accounting",
    "type": "serviceprovider",
    "logo": "img/logos/raadhuys.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Raadhuys Tax Legal Accounting heeft deze pagina niet aangeleverd. Zodra Raadhuys Tax Legal Accounting meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Rekenexpert voor de inkomensverklaring ondernemer (IKV) bij hypotheekaanvragen van zelfstandigen.",
    "website": "https://raadhuys.eu/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Raadhuys Tax Legal Accounting",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Raadhuys Tax Legal Accounting straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/raadhuys/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/raadhuys/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Formulier (voorbeeld)",
        "url": "https://example.org/raadhuys/formulier.pdf",
        "soort": "formulier"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "070 335 13 69",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://raadhuys.eu/contact/"
    ]
  },
  {
    "id": "rabobank",
    "demo": true,
    "naam": "Rabobank",
    "type": "geldverstrekker",
    "logo": "img/logos/rabobank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Rabobank heeft deze pagina niet aangeleverd. Zodra Rabobank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.rabobank.nl/bedrijven/intermediairs/hypotheek",
    "extranet": {
      "url": "https://rio.rabobank.nl/",
      "naam": "RIO (Rabo Intermediair Omgeving)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 727 11 99",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.rabobank.nl/bedrijven/intermediairs/hypotheek/aan-de-slag/rio",
      "https://rio.rabobank.nl/login/faq"
    ]
  },
  {
    "id": "rhion",
    "demo": true,
    "naam": "Rhion",
    "type": "verzekeraar",
    "logo": "img/logos/rhion.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Rhion heeft deze pagina niet aangeleverd. Zodra Rhion meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.rhion.nl/volmachten",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "040 790 01 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.rhion.nl/hulp-voor-volmachten",
      "https://www.rhion.nl/volmachten"
    ]
  },
  {
    "id": "risk-verzekeringen",
    "demo": true,
    "naam": "RISK Verzekeringen",
    "type": "serviceprovider",
    "logo": "img/logos/risk-verzekeringen.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. RISK Verzekeringen heeft deze pagina niet aangeleverd. Zodra RISK Verzekeringen meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://www.risk.nl/adviseurs",
    "extranet": {
      "url": "https://www.risk.nl/inloggen",
      "naam": "SureBase / Polisportaal"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van RISK Verzekeringen",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst RISK Verzekeringen straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/risk-verzekeringen/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/risk-verzekeringen/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/risk-verzekeringen/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 634 40 55",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.risk.nl/adviseurs",
      "https://www.risk.nl/contactsalessupport",
      "https://www.risk.nl/inloggen"
    ]
  },
  {
    "id": "rnhb",
    "demo": true,
    "naam": "RNHB",
    "type": "geldverstrekker",
    "logo": "img/logos/rnhb.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. RNHB heeft deze pagina niet aangeleverd. Zodra RNHB meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.rnhb.nl/",
    "extranet": {
      "url": "https://intermediair.rnhb.nl/",
      "naam": "Intermediairsportaal (Mijn Aanvragen)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 799 66 66",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.rnhb.nl/contact",
      "https://intermediair.rnhb.nl/"
    ]
  },
  {
    "id": "robuust",
    "demo": true,
    "naam": "Robuust Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/robuust.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Robuust Hypotheken heeft deze pagina niet aangeleverd. Zodra Robuust Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.robuusthypotheken.nl/ik-ben-adviseur",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 242 15 90",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.robuusthypotheken.nl/ik-ben-adviseur",
      "https://www.robuusthypotheken.nl/en/contact"
    ]
  },
  {
    "id": "saa-verzekeringen",
    "demo": true,
    "naam": "SAA Verzekeringen",
    "type": "serviceprovider",
    "logo": "img/logos/saa-verzekeringen.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SAA Verzekeringen heeft deze pagina niet aangeleverd. Zodra SAA Verzekeringen meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://saa.nl/adviseur",
    "extranet": {
      "url": "https://login.saa.nl/",
      "naam": "SAA Extranet"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van SAA Verzekeringen",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst SAA Verzekeringen straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/saa-verzekeringen/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/saa-verzekeringen/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/saa-verzekeringen/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 551 42 50",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://saa.nl/adviseur",
      "https://www.saa.nl/adviseur/saa-extranet",
      "https://login.saa.nl/"
    ]
  },
  {
    "id": "samenwerkende-kredietunies",
    "demo": true,
    "naam": "Samenwerkende Kredietunies",
    "type": "kredietverstrekker",
    "logo": "img/logos/samenwerkende-kredietunies.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Samenwerkende Kredietunies heeft deze pagina niet aangeleverd. Zodra Samenwerkende Kredietunies meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.samenwerkendekredietunies.nl/",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.samenwerkendekredietunies.nl/contact/"
    ]
  },
  {
    "id": "siriuspro",
    "demo": true,
    "naam": "SiriusPro",
    "type": "serviceprovider",
    "logo": "img/logos/siriuspro.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SiriusPro heeft deze pagina niet aangeleverd. Zodra SiriusPro meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van SiriusPro",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst SiriusPro straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/siriuspro/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/siriuspro/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/siriuspro/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "socio-hypotheek",
    "demo": true,
    "naam": "SocioHypotheek",
    "type": "geldverstrekker",
    "logo": "img/logos/socio-hypotheek.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SocioHypotheek heeft deze pagina niet aangeleverd. Zodra SocioHypotheek meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.sociohypotheek.nl/",
    "extranet": {
      "url": "https://www.sociohypotheek.nl/adviseursportaal/",
      "naam": "Adviseursportaal"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 210 08 11",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.sociohypotheek.nl/",
      "https://www.sociohypotheek.nl/contact/",
      "https://www.sociohypotheek.nl/adviseursportaal/downloads/"
    ]
  },
  {
    "id": "solidbriq",
    "demo": true,
    "naam": "SolidBriQ",
    "type": "geldverstrekker",
    "logo": "img/logos/solidbriq.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SolidBriQ heeft deze pagina niet aangeleverd. Zodra SolidBriQ meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.solidbriq.nl/hoe-financieren/goed-advies/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 820 00 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.solidbriq.nl/hoe-financieren/goed-advies/",
      "https://www.solidbriq.nl/contact"
    ]
  },
  {
    "id": "surebusiness",
    "demo": true,
    "naam": "SUREbusiness",
    "type": "serviceprovider",
    "logo": "img/logos/surebusiness.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. SUREbusiness heeft deze pagina niet aangeleverd. Zodra SUREbusiness meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.surebusiness.nl/",
    "extranet": {
      "url": "https://surenet.surebusiness.nl/",
      "naam": "SUREnet"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van SUREbusiness",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst SUREbusiness straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/surebusiness/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/surebusiness/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/surebusiness/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "072 303 59 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.surebusiness.nl/contact",
      "https://www.surebusiness.nl/over-ons/vragen-of-klachten",
      "https://surenet.surebusiness.nl/document/push/?voorwaardeid=172"
    ]
  },
  {
    "id": "syntrus-achmea",
    "demo": true,
    "naam": "Syntrus Achmea / Achmea Mortgage Funds",
    "type": "geldverstrekker",
    "logo": "img/logos/syntrus-achmea.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Syntrus Achmea / Achmea Mortgage Funds heeft deze pagina niet aangeleverd. Zodra Syntrus Achmea / Achmea Mortgage Funds meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.syntrusachmeahypotheken.nl/",
    "extranet": {
      "url": "https://www.syntrusachmeahypotheken.nl/voor-adviseurs/adviseursportaal-en-mijn-leninginzicht",
      "naam": "Adviseursportaal (eHerkenning)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "020 606 58 58",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://achmeabank.nl/en/news/achmea-splits-mortgage-and-real-estate-activities-of-syntrus-achmea-real-estate-and-finance",
      "https://www.syntrusachmeahypotheken.nl/service/contact",
      "https://www.syntrusachmeahypotheken.nl/voor-adviseurs/adviseursportaal-en-mijn-leninginzicht",
      "https://www.syntrusachmeahypotheken.nl/voor-adviseurs/iets-voorleggen-of-bespreken"
    ]
  },
  {
    "id": "triodos-bank",
    "demo": true,
    "naam": "Triodos Bank",
    "type": "geldverstrekker",
    "logo": "img/logos/triodos-bank.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Triodos Bank heeft deze pagina niet aangeleverd. Zodra Triodos Bank meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.triodos.nl/intermediairs",
    "extranet": {
      "url": "https://hypact.advisor.hypotheken.triodos.nl/login",
      "naam": "Hypact Advisor"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 694 20 01",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.triodos.nl/intermediairs",
      "https://hypact.advisor.hypotheken.triodos.nl/login"
    ]
  },
  {
    "id": "tulp-hypotheken",
    "demo": true,
    "naam": "Tulp Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/tulp-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Tulp Hypotheken heeft deze pagina niet aangeleverd. Zodra Tulp Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://tulphypotheken.nl/adviseurs/",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "030 307 05 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://tulphypotheken.nl/adviseurs/",
      "https://tulphypotheken.nl/contact/"
    ]
  },
  {
    "id": "turien-en-co-assuradeuren",
    "demo": true,
    "naam": "Turien & Co Assuradeuren",
    "type": "serviceprovider",
    "logo": "img/logos/turien-en-co-assuradeuren.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Turien & Co Assuradeuren heeft deze pagina niet aangeleverd. Zodra Turien & Co Assuradeuren meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://www.turien.nl/adviseur",
    "extranet": {
      "url": "https://turien.nl/adviseur/mijn-turien",
      "naam": "Mijn Turien"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Turien & Co Assuradeuren",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Turien & Co Assuradeuren straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/turien-en-co-assuradeuren/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/turien-en-co-assuradeuren/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/turien-en-co-assuradeuren/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "072 518 11 81",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.turien.nl/adviseur",
      "https://turien.nl/adviseur/mijn-turien",
      "https://turien.nl/klantenservice/contact"
    ]
  },
  {
    "id": "unigarant",
    "demo": true,
    "naam": "Unigarant",
    "type": "verzekeraar",
    "logo": "img/logos/unigarant.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Unigarant heeft deze pagina niet aangeleverd. Zodra Unigarant meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over verzekeringen.",
    "website": "https://www.unigarant.nl/samenwerken/",
    "extranet": {
      "url": "https://www.unigarant.nl/samenwerken/meer-over-salesgarant/",
      "naam": "SalesGarant"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 299 36 62",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.unigarant.nl/contact/samenwerken/",
      "https://www.unigarant.nl/samenwerken/meer-over-salesgarant/",
      "https://www.unigarant.nl/samenwerken/inloggen-met-e-herkenning/"
    ]
  },
  {
    "id": "vcn-hypotheken",
    "demo": true,
    "naam": "VCN Hypotheken",
    "type": "serviceprovider",
    "logo": "img/logos/vcn-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. VCN Hypotheken heeft deze pagina niet aangeleverd. Zodra VCN Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor hypotheken.",
    "website": "https://www.vcn.nl/hypotheken",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van VCN Hypotheken",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst VCN Hypotheken straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/vcn-hypotheken/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/vcn-hypotheken/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/vcn-hypotheken/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 041 09 20",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.vcn.nl/hypotheken",
      "https://www.vcn.nl/contact-VCNDenBosch"
    ]
  },
  {
    "id": "vcn-kredieten",
    "demo": true,
    "naam": "VCN Kredieten",
    "type": "serviceprovider",
    "logo": "img/logos/vcn-kredieten.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. VCN Kredieten heeft deze pagina niet aangeleverd. Zodra VCN Kredieten meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor kredieten.",
    "website": "https://www.vcn.nl/kredieten",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van VCN Kredieten",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst VCN Kredieten straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/vcn-kredieten/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/vcn-kredieten/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/vcn-kredieten/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 760 89 85",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.vcn.nl/kredieten",
      "https://www.vcn.nl/contact-VCNDenHaag"
    ]
  },
  {
    "id": "vcn-verzekeringen",
    "demo": true,
    "naam": "VCN Verzekeringen",
    "type": "serviceprovider",
    "logo": "img/logos/vcn-verzekeringen.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. VCN Verzekeringen heeft deze pagina niet aangeleverd. Zodra VCN Verzekeringen meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Serviceprovider voor het intermediair (volmacht/assuradeur).",
    "website": "https://www.vcn.nl/verzekeringen",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van VCN Verzekeringen",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst VCN Verzekeringen straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/vcn-verzekeringen/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/vcn-verzekeringen/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/vcn-verzekeringen/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "040 290 75 75",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.vcn.nl/verzekeringen",
      "https://www.vcn.nl/diensten-vcn-verzekeringen",
      "https://www.vcn.nl/contact-VCNNuenen"
    ]
  },
  {
    "id": "venn-hypotheken",
    "demo": true,
    "naam": "Venn Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/venn-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Venn Hypotheken heeft deze pagina niet aangeleverd. Zodra Venn Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.vennhypotheken.nl/voor-adviseurs/",
    "extranet": {
      "url": "https://e-adviseur.e-servicing.com/",
      "naam": "E-adviseur (Stater)"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "076 303 39 01",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.vennhypotheken.nl/voor-adviseurs/",
      "https://www.vennhypotheken.nl/over-venn/contact/",
      "https://nibc.nl/media/0han54sg/actuele-klantdata-inzien-in-e-adviseur.pdf"
    ]
  },
  {
    "id": "vista-hypotheken",
    "demo": true,
    "naam": "Vista Hypotheken",
    "type": "geldverstrekker",
    "logo": "img/logos/vista-hypotheken.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Vista Hypotheken heeft deze pagina niet aangeleverd. Zodra Vista Hypotheken meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://www.vistahypotheken.nl/ik-wil-klant-worden",
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 242 21 15",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.vistahypotheken.nl/ik-wil-klant-worden",
      "https://www.vistahypotheken.nl/contact",
      "https://www.vistahypotheken.nl/voor-adviseurs"
    ]
  },
  {
    "id": "vkg",
    "demo": true,
    "naam": "VKG",
    "type": "serviceprovider",
    "logo": "img/logos/vkg.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. VKG heeft deze pagina niet aangeleverd. Zodra VKG meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://vkg.nl/adviseur/contact/",
    "extranet": {
      "url": "https://extranet.vkg.com/",
      "naam": "VKG Extranet"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van VKG",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst VKG straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/vkg/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/vkg/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/vkg/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "0229 28 78 88",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://vkg.nl/adviseur/contact/",
      "https://extranet.vkg.com/"
    ]
  },
  {
    "id": "voogd-en-voogd",
    "demo": true,
    "naam": "Voogd & Voogd",
    "type": "serviceprovider",
    "logo": "img/logos/voogd-en-voogd.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Voogd & Voogd heeft deze pagina niet aangeleverd. Zodra Voogd & Voogd meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs.",
    "website": "https://www.voogd.com/adviseur/",
    "extranet": {
      "url": "https://login.voogd.com/",
      "naam": "Voogd Backoffice (eHerkenning)"
    },
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Voogd & Voogd",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Voogd & Voogd straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/voogd-en-voogd/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/voogd-en-voogd/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/voogd-en-voogd/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 020 91 00",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.voogd.com/contact/",
      "https://www.voogd.com/adviseur/",
      "https://login.voogd.com/"
    ]
  },
  {
    "id": "voor-de-groei",
    "demo": true,
    "naam": "Voor de Groei",
    "type": "kredietverstrekker",
    "logo": "img/logos/voor-de-groei.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Voor de Groei heeft deze pagina niet aangeleverd. Zodra Voor de Groei meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
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
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03"
  },
  {
    "id": "woonnu",
    "demo": true,
    "naam": "Woonnu",
    "type": "geldverstrekker",
    "logo": "img/logos/woonnu.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Woonnu heeft deze pagina niet aangeleverd. Zodra Woonnu meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over hypotheken.",
    "website": "https://adviseurs.woonnu.nl/positief-wonen/",
    "extranet": {
      "url": "https://woonnu.mijnleninginzicht.nl/",
      "naam": "Mijn Leninginzicht"
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
    "bijgewerkt": "2026-10-03",
    "telefoon": "010 242 23 70",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://adviseurs.woonnu.nl/positief-wonen/",
      "https://adviseurs.woonnu.nl/media/z12iizpm/202408-woonnu-productkaart.pdf",
      "https://adviseurs.woonnu.nl/veelgestelde-vragen/"
    ]
  },
  {
    "id": "zakelijk-inkomen",
    "demo": true,
    "naam": "Zakelijk Inkomen",
    "type": "serviceprovider",
    "logo": "img/logos/zakelijk-inkomen.png",
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Zakelijk Inkomen heeft deze pagina niet aangeleverd. Zodra Zakelijk Inkomen meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over diensten voor adviseurs. Rekenexpert voor de inkomensverklaring ondernemer (IKV) bij hypotheekaanvragen van zelfstandigen.",
    "website": "https://zakelijkinkomen.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Zakelijk Inkomen",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Zakelijk Inkomen straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/zakelijk-inkomen/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/zakelijk-inkomen/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Formulier (voorbeeld)",
        "url": "https://example.org/zakelijk-inkomen/formulier.pdf",
        "soort": "formulier"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "085 489 05 21",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://zakelijkinkomen.nl/",
      "https://zakelijkinkomen.nl/contact/"
    ]
  },
  {
    "id": "auxmoney",
    "demo": true,
    "naam": "auxmoney",
    "type": "kredietverstrekker",
    "logo": "img/logos/auxmoney.png",
    "rubrieken": [
      "krediet"
    ],
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. auxmoney heeft deze pagina niet aangeleverd. Zodra auxmoney meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://auxmoney.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van auxmoney",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst auxmoney straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/auxmoney/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/auxmoney/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/auxmoney/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://auxmoney.nl/",
      "https://support.auxmoney.nl/hc/nl"
    ]
  },
  {
    "id": "directa",
    "demo": true,
    "naam": "Directa.nl",
    "type": "kredietverstrekker",
    "logo": "img/logos/directa.png",
    "rubrieken": [
      "krediet"
    ],
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Directa.nl heeft deze pagina niet aangeleverd. Zodra Directa.nl meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.directa.nl/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Directa.nl",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Directa.nl straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/directa/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/directa/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/directa/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "073 646 25 56",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.directa.nl/klantenservice/contact"
    ]
  },
  {
    "id": "freo",
    "demo": true,
    "naam": "Freo",
    "type": "kredietverstrekker",
    "logo": "img/logos/freo.png",
    "rubrieken": [
      "krediet"
    ],
    "omschrijving": "Voorbeeldprofiel met fictieve tekst. Freo heeft deze pagina niet aangeleverd. Zodra Freo meedoet, staan hier de eigen omschrijving, het nieuws, de documenten en het extranet voor adviseurs over kredieten en financieringen.",
    "website": "https://www.freo.nl/over-freo/",
    "nieuws": [
      {
        "id": "n1",
        "datum": "2026-10-03",
        "titel": "Voorbeeldbericht van Freo",
        "tekst": "Dit is een fictief voorbeeldbericht. Hier plaatst Freo straks zelf nieuws voor adviseurs, zoals wijzigingen in acceptatie of werkwijze.",
        "url": "https://example.org/freo/nieuws"
      }
    ],
    "documenten": [
      {
        "titel": "Voorwaarden (voorbeeld)",
        "url": "https://example.org/freo/voorwaarden.pdf",
        "soort": "voorwaarden"
      },
      {
        "titel": "Acceptatiegids (voorbeeld)",
        "url": "https://example.org/freo/acceptatiegids.pdf",
        "soort": "acceptatiegids"
      }
    ],
    "bijgewerkt": "2026-10-03",
    "telefoon": "088 321 00 03",
    "opgezocht": "2026-10-03",
    "contactbronnen": [
      "https://www.freo.nl/over-freo/",
      "https://www.freo.nl/service-en-contact/"
    ]
  }
];
