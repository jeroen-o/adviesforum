/* Kennispartner-badge van het Adviesforum: maakt de badge als SVG-tekst.
 * Gebruikt door kennispartner.html (voorbeeld, downloads) en tools/kennispartners.js (vaste badges in badges/).
 *   KennispartnerBadge.svg({ naam, kantoor, sinds }, 'vierkant' | 'banner')
 */
(function (wortel) {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var FONT = "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif";
  /* Beeldmerk (twee tekstballonnen met ster), op 64x64; id's per badge uniek zodat meerdere badges op één pagina kunnen. */
  function teken(id) {
    return '<defs><clipPath id="' + id + '"><circle cx="40.5" cy="27" r="17.5"/></clipPath></defs>' +
      '<circle cx="23.5" cy="27" r="17.5" fill="#F68712"/><path d="M11.5 38.5 L8 53 L22 43.5Z" fill="#F68712"/>' +
      '<circle cx="40.5" cy="27" r="17.5" fill="#0B7C77"/><path d="M52.5 38.5 L56 53 L42 43.5Z" fill="#0B7C77"/>' +
      '<circle cx="23.5" cy="27" r="17.5" fill="#26306E" clip-path="url(#' + id + ')"/>' +
      '<path d="M32 20.3 L33.82 24.99 L38.85 25.27 L34.95 28.45 L36.23 33.33 L32 30.6 L27.77 33.33 L29.05 28.45 L25.15 25.27 L30.18 24.99Z" fill="#fff"/>';
  }
  /* Tekst inkorten tot ongeveer het aantal tekens dat in de breedte past. */
  function kort(t, max) { t = String(t || '').trim(); return t.length > max ? t.slice(0, max - 1).trim() + '…' : t; }
  function grootte(t, basis, max) { var n = String(t || '').length; return n <= max ? basis : Math.max(basis * max / n, basis * 0.8); }

  var teller = 0;
  function svg(p, vorm) {
    p = p || {};
    var naam = p.naam || 'Uw naam', kantoor = p.kantoor || 'Uw kantoor', sinds = p.sinds ? String(p.sinds).slice(0, 4) : '';
    var id = 'kp' + Math.abs(String(naam + kantoor + vorm).split('').reduce(function (h, c) { return (h * 31 + c.charCodeAt(0)) | 0; }, 7)).toString(36) + (teller++).toString(36);
    var titel = 'Kennispartner van Adviesforum: ' + naam + (kantoor ? ', ' + kantoor : '');
    if (vorm === 'banner') {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="96" viewBox="0 0 360 96" role="img" aria-label="' + esc(titel) + '">' +
        '<title>' + esc(titel) + '</title>' +
        '<defs><linearGradient id="' + id + 'g" x1="0" x2="1"><stop offset="0" stop-color="#F68712"/><stop offset=".5" stop-color="#E85B3F"/><stop offset="1" stop-color="#0B7C77"/></linearGradient></defs>' +
        '<rect x="1.5" y="1.5" width="357" height="93" rx="14" fill="#fff" stroke="url(#' + id + 'g)" stroke-width="3"/>' +
        '<g transform="translate(14 14) scale(1.05)">' + teken(id + 'c') + '</g>' +
        '<text x="96" y="30" font-family="' + FONT + '" font-size="10.5" font-weight="700" letter-spacing="1.6" fill="#0B7C77">KENNISPARTNER' + (sinds ? ' · SINDS ' + esc(sinds) : '') + '</text>' +
        '<text x="96" y="52" font-family="' + FONT + '" font-size="20" font-weight="800" fill="#171043">Adviesforum</text>' +
        '<text x="96" y="74" font-family="' + FONT + '" font-size="' + grootte(naam + ' · ' + kantoor, 12, 38).toFixed(1) + '" font-weight="600" fill="#2E2B4F">' + esc(kort(naam, 30)) + (kantoor ? ' · ' + esc(kort(kantoor, 30)) : '') + '</text>' +
        '</svg>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" role="img" aria-label="' + esc(titel) + '">' +
      '<title>' + esc(titel) + '</title>' +
      '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F68712"/><stop offset=".5" stop-color="#E85B3F"/><stop offset="1" stop-color="#0B7C77"/></linearGradient></defs>' +
      '<rect x="2" y="2" width="236" height="236" rx="28" fill="#fff" stroke="url(#' + id + 'g)" stroke-width="4"/>' +
      '<rect x="12" y="12" width="216" height="98" rx="20" fill="#ECF7FD"/>' +
      '<g transform="translate(86 22) scale(1.06)">' + teken(id + 'c') + '</g>' +
      '<text x="120" y="98" text-anchor="middle" font-family="' + FONT + '" font-size="11" font-weight="700" letter-spacing="2.2" fill="#0B7C77">KENNISPARTNER</text>' +
      '<text x="120" y="138" text-anchor="middle" font-family="' + FONT + '" font-size="24" font-weight="800" fill="#171043">Adviesforum</text>' +
      '<line x1="70" y1="152" x2="170" y2="152" stroke="#DFDEE5" stroke-width="1.5"/>' +
      '<text x="120" y="176" text-anchor="middle" font-family="' + FONT + '" font-size="' + grootte(naam, 15, 22).toFixed(1) + '" font-weight="700" fill="#171043">' + esc(kort(naam, 30)) + '</text>' +
      '<text x="120" y="196" text-anchor="middle" font-family="' + FONT + '" font-size="' + grootte(kantoor, 12, 30).toFixed(1) + '" fill="#4A4770">' + esc(kort(kantoor, 34)) + '</text>' +
      '<text x="120" y="220" text-anchor="middle" font-family="' + FONT + '" font-size="10" fill="#6B6888">' + (sinds ? 'Vakinhoudelijk aanspreekpunt · sinds ' + esc(sinds) : 'Vakinhoudelijk aanspreekpunt') + '</text>' +
      '</svg>';
  }
  var api = { svg: svg };
  if (typeof module === 'object' && module.exports) module.exports = api; else wortel.KennispartnerBadge = api;
})(this);
