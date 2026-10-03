/* OEFENVRAGEN-EXTRA van het Adviesforum – PE en vakbekwaamheid
 *
 * Aanvulling op data/oefenvragen.js (zelfde velden). Laad dit bestand NA data/oefenvragen.js:
 * het voegt vragen toe aan window.OEFENVRAGEN in module 'basis'. GEEN officiële CDFD-examenvragen.
 * Feiten uit kennisbank k150 t/m k157 (CDFD, AFM, FFP, SEH). Peildatum: oktober 2026.
 */
(function () {
  'use strict';
  const V = [];
  const q = (module, id, onderwerp, vraag, opties, juist, uitleg, bron) =>
    V.push({ id, module, onderwerp, vraag, opties, juist, uitleg, bron });

  q('basis', 'pe01', 'PE-periode', "Tot wanneer loopt de huidige Wft PE-periode?",
    ["Tot en met 31 maart 2028", "Tot en met 31 december 2026", "Tot en met 31 maart 2027", "Tot en met 31 december 2029"], 0,
    "De PE-periode loopt van 1 april 2025 tot en met 31 maart 2028. Binnen die periode haal je per beroepskwalificatie één PE-examen.", 'k150');
  q('basis', 'pe02', 'PE-periode', "Hoeveel PE-examens moet je per beroepskwalificatie halen binnen één PE-periode?",
    ["Eén", "Eén per jaar", "Twee", "Geen, alleen PE-punten"], 0,
    "Per beroepskwalificatie haal je één PE-examen per PE-periode. Het moment kies je zelf, zolang het voor de einddatum is.", 'k150');
  q('basis', 'pe03', 'PE-examen', "Wat toetst een PE-examen?",
    ["Recente ontwikkelingen in het vakgebied", "Alle stof van de initiële module opnieuw", "Alleen de Basis-module", "Commerciële vaardigheden"], 0,
    "Het PE-examen toetst recente ontwikkelingen, zodat de adviseur zijn kennis actueel houdt.", 'k150');
  q('basis', 'pe04', 'Bijzonder examen', "Een adviseur haalt zijn PE-examen niet voor het einde van de PE-periode. Hoe herstelt hij zijn adviesbevoegdheid?",
    ["Met een bijzonder examen of door de initiële module-examens opnieuw te doen", "Door alsnog PE-punten bij een registertitel te halen", "Door een verklaring van zijn werkgever", "De bevoegdheid blijft gewoon bestaan"], 0,
    "Zonder PE-examen vervalt de adviesbevoegdheid. Die herstel je met een bijzonder examen of door de initiële module-examens opnieuw te halen.", 'k150');
  q('basis', 'pe05', 'Beroepskwalificatie', "Uit welke modules bestaat de beroepskwalificatie Adviseur Hypothecair krediet?",
    ["Basis, Vermogen en Hypothecair krediet", "Basis en Hypothecair krediet", "Basis, Inkomen en Hypothecair krediet", "Alleen Hypothecair krediet"], 0,
    "Volgens het CDFD haal je voor Adviseur Hypothecair krediet de modules Basis, Vermogen en Hypothecair krediet.", 'https://cdfd.nl/adviseur-hypothecair-krediet/');
  q('basis', 'pe06', 'Beroepskwalificatie', "Welke modules horen bij Adviseur Pensioen?",
    ["Basis, Vermogen en Pensioen", "Basis, Inkomen en Pensioen", "Basis en Pensioen", "Basis, Schadeverzekeringen particulier en Pensioen"], 0,
    "Volgens het CDFD bestaat Adviseur Pensioen uit de modules Basis, Vermogen en Pensioen.", 'https://cdfd.nl/adviseur-pensioen/');
  q('basis', 'pe07', 'Beroepskwalificatie', "Wat heb je naast Basis en Schadeverzekeringen zakelijk nodig voor Adviseur Schadeverzekering zakelijk?",
    ["Schadeverzekeringen particulier", "Vermogen", "Inkomen", "Niets, twee modules zijn genoeg"], 0,
    "Adviseur Schadeverzekering zakelijk bestaat uit Basis, Schadeverzekeringen particulier en Schadeverzekeringen zakelijk.", 'k150');
  q('basis', 'pe08', 'Toetstermen', "Wanneer worden de toetstermen van de Wft-examens jaarlijks aangepast?",
    ["Per 1 april", "Per 1 januari", "Per 1 juli", "Alleen bij een nieuwe PE-periode"], 0,
    "De examens worden jaarlijks per 1 april geactualiseerd. Per 1 april 2026 zijn de PE-examens en initiële examens vernieuwd.", 'k150');
  q('basis', 'pe09', 'Rollen', "Welke organisatie erkent de examen-instituten voor de Wft-examens?",
    ["Het CDFD", "De AFM", "Het Kifid", "DUO"], 0,
    "Het College Deskundigheid Financiële Dienstverlening (CDFD) erkent namens de minister de examen-instituten en adviseert over de toetstermen.", 'k150');
  q('basis', 'pe10', 'Bewijs', "Waar zie je met DigiD welke beroepskwalificaties je hebt?",
    ["In Mijn Wft van het CDFD", "In het AFM-register", "Bij het Kifid", "In MijnOverheid onder belastingen"], 0,
    "In Mijn Wft zie je je beroepskwalificaties, diploma's, certificaten en examenresultaten, en download je digitale diploma's.", 'https://cdfd.nl/mijn-wft/');
  q('basis', 'pe11', 'Permanent actueel', "Voor wie geldt de eis 'permanent actueel vakbekwaam'?",
    ["Voor alle klantmedewerkers met inhoudelijk klantcontact", "Alleen voor adviseurs met een Wft-diploma", "Alleen voor beleidsbepalers", "Alleen voor medewerkers met een registertitel"], 0,
    "Alle klantmedewerkers met inhoudelijk klantcontact moeten permanent actueel zijn. Voor adviseurs geldt daarnaast de diplomaplicht.", 'k152');
  q('basis', 'pe12', 'AO/IC', "Waar verwacht de AFM dat een onderneming beschrijft hoe zij vakbekwaamheid organiseert?",
    ["In de beschrijving van de bedrijfsprocessen (AO/IC)", "In de vergelijkingskaart", "In het adviesrapport", "In de algemene voorwaarden"], 0,
    "De AFM verwacht dat je in je AO/IC vastlegt hoe je vakbekwaamheid in de organisatie hebt geregeld.", 'k152');
  q('basis', 'pe13', 'PE-training', "Een adviseur volgt een PE-training maar doet geen PE-examen. Blijft zijn Wft-beroepskwalificatie geldig?",
    ["Nee, voor de Wft telt alleen het gehaalde PE-examen", "Ja, een training is gelijkwaardig", "Ja, als de training geaccrediteerd is", "Ja, als de werkgever akkoord geeft"], 0,
    "Een training helpt bij voorbereiding en permanent actueel blijven, maar de wettelijke adviesbevoegdheid blijft alleen geldig met een gehaald PE-examen.", 'k150');
  q('basis', 'pe14', 'Registertitels', "Wat is juist over registertitels zoals CFP of Erkend Hypotheekadviseur?",
    ["Ze zijn vrijwillig en komen bovenop het Wft-diploma", "Ze vervangen het Wft-diploma", "Ze zijn wettelijk verplicht voor hypotheekadviseurs", "Ze worden door de AFM uitgegeven"], 0,
    "Registertitels zijn vrijwillig, met eigen opleidings- en PE-eisen. Ze vervangen het wettelijke Wft-diploma nooit.", 'k151');
  q('basis', 'pe15', 'CFP', "Hoeveel PE-punten haalt een CFP-professional volgens de Stichting FFP per kalenderjaar?",
    ["20", "12", "6", "40"], 0,
    "Een CFP-professional haalt 20 PE-punten per kalenderjaar, verdeeld over Kennis en Actualiteit en Praktijktoepassing. Extra punten schuiven niet door.", 'https://ffp.nl/word-cfp-professional/permanente-educatie/');
  q('basis', 'pe16', 'Eed of belofte', "Wie is er volgens artikel 4:15a Wft verantwoordelijk voor dat medewerkers de eed of belofte afleggen en naleven?",
    ["De financiële onderneming", "De AFM", "Het Kifid", "De medewerker alleen"], 0,
    "De onderneming moet borgen dat de eed of belofte wordt afgelegd en nageleefd. Doet ze dat niet, dan kan de AFM maatregelen nemen.", 'k155');
  q('basis', 'pe17', 'Betrouwbaarheid', "Wie toetst de AFM op betrouwbaarheid?",
    ["Dagelijks beleidsbepalers, medebeleidsbepalers en leden van een toezichthoudend orgaan", "Alle medewerkers met klantcontact", "Alleen nieuwe adviseurs", "Alleen de compliance officer"], 0,
    "De AFM toetst beleidsbepalers en leden van het toezichthoudend orgaan. Overige medewerkers screent de onderneming zelf.", 'k155');
  q('basis', 'pe18', 'Tuchtrecht', "Een medewerker van een bank leeft de eed niet na. Waar kan hij tuchtrechtelijk worden aangesproken?",
    ["Bij de Stichting Tuchtrecht Banken", "Bij de AFM-boetecommissie", "Bij de kantonrechter", "Bij het CDFD"], 0,
    "Voor bankmedewerkers is de Stichting Tuchtrecht Banken de tuchtrechtelijke instantie. Voor anderen verwijst de AFM naar tuchtrechtspraak via Kifid.", 'k155');
  q('basis', 'pe19', 'Bewijs', "Waarom bewaar je certificaten ook zelf, als de leeromgeving van een opleider ze al bijhoudt?",
    ["Omdat je het bewijs na een overstap of opzegging nog moet kunnen tonen", "Omdat opleiders certificaten na een maand verwijderen", "Omdat de AFM alleen papieren certificaten accepteert", "Dat is niet nodig"], 0,
    "Het kantoor moet vakbekwaamheid zelf kunnen aantonen, ook als de relatie met een opleider stopt. Bewaar bewijs in je eigen vakbekwaamheidsdossier.", 'k156');
  q('basis', 'pe20', 'Actualiteit', "Waarom is wachten tot een onderwerp in het PE-examen komt niet genoeg om actueel te blijven?",
    ["Toetstermen lopen achter: ze worden per 1 april bijgewerkt met ontwikkelingen die op 1 januari definitief waren", "PE-examens gaan nooit over nieuwe wetgeving", "Het PE-examen is maar eens per tien jaar", "Nieuwe regels gelden pas na de PE-periode"], 0,
    "Nieuwe regels spelen in de praktijk vaak eerder dan ze in het examen komen. Permanent actueel betekent dat je ze volgt zodra ze je adviespraktijk raken.", 'k157');

  window.OEFENVRAGEN = (window.OEFENVRAGEN || []).concat(V);
})();
