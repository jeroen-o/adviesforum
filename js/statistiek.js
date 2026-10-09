/* Bezoekersstatistiek van het Adviesforum, zonder cookies en zonder persoonsgegevens (GoatCounter).
 * Staat UIT zolang CODE leeg is: dan doet dit script niets en wordt er niets van een derde partij geladen.
 * Aanzetten:
 *   1. Maak een gratis account op https://www.goatcounter.com (bijv. code "adviesforum").
 *   2. Vul hieronder CODE in, bijv. 'adviesforum'.
 *   3. Pas de privacyverklaring aan (privacy.html, kopje Bezoekersstatistiek): "staat aan".
 * GoatCounter plaatst geen cookies en slaat geen IP-adressen op; daardoor is geen cookiebanner nodig.
 * Zoektermen en inloggegevens gaan niet mee: alleen het pad van de pagina wordt geteld (zonder ?zoek= en zonder #).
 */
(function () {
  'use strict';
  var CODE = '';
  if (!CODE || location.hostname !== 'adviesforum.nl' && location.hostname !== 'www.adviesforum.nl') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  window.goatcounter = { path: function () { return location.pathname; }, no_onload: false };
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
})();
