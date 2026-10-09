/* Status van geldverstrekkers voor de voorwaardenvergelijker: wie neemt geen nieuwe klanten aan.
 * Alleen opnemen met een eigen bron van de geldverstrekker. Velden per naam (zoals in data/voorwaarden-controle.js):
 *   geenNieuweKlanten  true
 *   sinds              JJJJ-MM-DD of null
 *   tekst              korte neutrale uitleg (max. 120 tekens)
 *   bron               https-link naar de eigen site
 * Gecontroleerd op 9 oktober 2026 (eigen bronnen van de geldverstrekkers).
 */
window.GELDVERSTREKKERS_STATUS = {
  "Woonnu": {"geenNieuweKlanten":true,"sinds":"2026-05-01","tekst":"NN Bank biedt sinds 1 mei 2026 geen nieuwe Woonnu-hypotheken meer aan; bestaande klanten houden hun hypotheek.","bron":"https://woonnu.nl/nieuws/nationale-nederlanden-bank-stopt-met-nieuwe-woonnu-hypotheken/"},
  "Neo Hypotheken": {"geenNieuweKlanten":true,"sinds":"2025-10-07","tekst":"Sinds 7 oktober 2025 tot nader order geen nieuwe klanten; alleen aanvragen van bestaande klanten.","bron":"https://www.neohypotheken.nl/over-ons"},
  "IQWOON": {"geenNieuweKlanten":true,"sinds":"2023-05-01","tekst":"Sinds 1 mei 2023 geen nieuwe aanvragen meer; alleen voor bestaande klanten.","bron":"https://www.iqwoon.nl/adviseur"},
  "Tellius Hypotheken": {"geenNieuweKlanten":true,"sinds":null,"tekst":"Verstrekt voorlopig geen hypotheken aan nieuwe klanten; alleen voor bestaande Tellius-klanten.","bron":"https://www.tellius.nl/hypotheken/toekomstvast-hypotheek"},
  "Aegon": {"geenNieuweKlanten":true,"sinds":"2026-04-30","tekst":"Sinds 30 april 2026 nieuwe hypotheken via de ASR Hypotheek van a.s.r.; Aegon-hypotheken omgelabeld naar a.s.r.","bron":"https://www.asrnederland.nl/nieuws-en-pers/nieuws/20260430-asr-introduceert-de-asr-hypotheek"},
  "BLG Wonen": {"geenNieuweKlanten":true,"sinds":"2026-03-01","tekst":"Sinds 1 maart 2026 is BLG Wonen ASN Bank; een nieuwe BLG-hypotheek kan niet meer, wel een ASN Hypotheek.","bron":"https://www.asnbank.nl/blg-wonen-wordt-asn-bank-veelgestelde-vragen.html"},
  "SNS": {"geenNieuweKlanten":true,"sinds":"2025-07-01","tekst":"SNS is opgegaan in ASN Bank; de SNS Hypotheek is niet meer af te sluiten, nieuwe hypotheken via ASN Bank.","bron":"https://www.snsbank.nl/particulier/hypotheken/service.html"},
  "RegioBank": {"geenNieuweKlanten":true,"sinds":"2025-12-01","tekst":"Sinds 1 december 2025 is RegioBank ASN Bank; een nieuwe RegioBank Hypotheek is niet meer mogelijk.","bron":"https://www.regiobank.nl/regiobank-wordt-asn-bank-veelgestelde-vragen.html"}
};
