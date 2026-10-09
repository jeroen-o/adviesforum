/* KENNISPARTNERS van het Adviesforum
 *
 * Adviseurs die een kennisbankartikel of onderwerp hebben geclaimd en na handmatige controle door de beheerder
 * als vakinhoudelijk aanspreekpunt bij dat artikel staan. Zij krijgen de badge "Kennispartner van Adviesforum".
 * Claimen gaat via kennispartner.html (opent een e-mail aan de beheerder); er wordt niets automatisch toegevoegd.
 *
 * Controle vóór toevoegen: AFM-registratie (vergunningnummer van het kantoor in het AFM-register), dat de persoon
 * er werkt (website of LinkedIn), en dat de aangeleverde tekst klopt. Aangeleverde tekst gaat als concept via een
 * pull request en compliance keurt goed, net als andere artikelen.
 *
 * Velden:
 *   id          korte unieke code, bijv. 'kp-sanne-de-vries' (niet wijzigen: badges en links verwijzen ernaar)
 *   naam        naam van de adviseur
 *   kantoor     naam van het kantoor
 *   plaats      (optioneel) vestigingsplaats
 *   afm         (optioneel) AFM-vergunningnummer van het kantoor
 *   website     (optioneel) https-link naar de site van het kantoor
 *   linkedin    (optioneel) https-link naar het LinkedIn-profiel
 *   artikelen   lijst met artikel-id's uit de kennisbank, bijv. ['k140']
 *   onderwerpen (optioneel) lijst met onderwerpen in woorden, voor een claim zonder bestaand artikel
 *   sinds       datum van goedkeuring (JJJJ-MM-DD)
 *
 * Na een wijziging: node tools/kennispartners.js (maakt de badges in badges/) en node tools/build-static.js.
 */
window.KENNISPARTNERS = [
];
