/* Toegangswoord voor het Adviesforum (voorlopige afscherming).
 * Let op: dit is een eenvoudige drempel in de browser en GEEN beveiliging. De pagina's worden gewoon door de server uitgeleverd;
 * wie de broncode bekijkt of JavaScript uitzet, ziet de inhoud. Echte afscherming kan alleen aan de serverkant (bijvoorbeeld via de hosting).
 * Het woord wordt niet in leesbare vorm bewaard: alleen de SHA-256-waarde van het woord in kleine letters staat hieronder.
 * Hoofdletters en kleine letters maken niet uit. Na invoer onthoudt de browser dat 30 dagen in de functionele cookie af_toegang (zie privacy.html). */
(function () {
  'use strict';
  var COOKIE = 'af_toegang';
  var HASH = '1da9b489c94f2a36bd7f9742924c471a706e52351187d8c4a3e1806c029d6988';
  var DAGEN = 30;
  function heeft() { try { return document.cookie.split('; ').indexOf(COOKIE + '=1') !== -1; } catch (e) { return false; } }
  if (heeft()) return;

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function sha256(tekst) {
    if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) return Promise.reject(new Error('geen crypto'));
    return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(tekst)).then(hex);
  }
  function onthoud() {
    try { document.cookie = COOKIE + '=1; max-age=' + DAGEN * 86400 + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) { /* zonder cookie vraagt de volgende pagina opnieuw */ }
  }

  var css = document.createElement('style');
  css.textContent = '.af-toegang{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:#f4f6f9;color:#14233a;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '.af-toegang-kaart{width:100%;max-width:380px;background:#fff;border:1px solid #d5dce6;border-radius:12px;padding:24px;box-shadow:0 6px 24px rgba(20,35,58,.12)}' +
    '.af-toegang h1{margin:0 0 6px;font-size:1.25rem}.af-toegang p{margin:0 0 14px;color:#4a5b73}' +
    '.af-toegang label{display:block;font-weight:600;margin-bottom:6px}' +
    '.af-toegang input{width:100%;box-sizing:border-box;padding:10px 12px;font:inherit;border:1px solid #8a97ab;border-radius:8px;background:#fff;color:#14233a}' +
    '.af-toegang button{margin-top:14px;width:100%;padding:10px 14px;font:inherit;font-weight:600;border:0;border-radius:8px;background:#0b5cab;color:#fff;cursor:pointer}' +
    '.af-toegang button:focus-visible,.af-toegang input:focus-visible{outline:3px solid #f5b400;outline-offset:2px}' +
    '.af-toegang-fout{min-height:1.4em;margin:10px 0 0;color:#b00020;font-size:.95rem}' +
    '@media (prefers-color-scheme:dark){.af-toegang{background:#0f1a2b;color:#e8eef7}.af-toegang-kaart{background:#16263d;border-color:#2c4163}.af-toegang p{color:#a9b8cf}.af-toegang input{background:#0f1a2b;color:#e8eef7;border-color:#5c7191}.af-toegang-fout{color:#ff8a9b}}';
  document.head.appendChild(css);

  var laag = document.createElement('div');
  laag.className = 'af-toegang';
  laag.setAttribute('role', 'dialog');
  laag.setAttribute('aria-modal', 'true');
  laag.setAttribute('aria-labelledby', 'af-toegang-kop');
  laag.innerHTML = '<form class="af-toegang-kaart" autocomplete="off"><h1 id="af-toegang-kop">Adviesforum</h1>' +
    '<p>Deze site is voorlopig alleen toegankelijk met een toegangswoord.</p>' +
    '<label for="af-toegang-woord">Toegangswoord</label><input id="af-toegang-woord" type="password" autocapitalize="off" autocorrect="off" spellcheck="false" required>' +
    '<button type="submit">Openen</button><p class="af-toegang-fout" role="alert" aria-live="assertive"></p></form>';

  var verborgen = [];
  function sluit() {
    verborgen.forEach(function (el) { el.removeAttribute('inert'); });
    laag.parentNode && laag.parentNode.removeChild(laag);
    document.documentElement.style.overflow = '';
  }
  function toon() {
    Array.prototype.forEach.call(document.body.children, function (el) { if (el !== laag && !el.hasAttribute('inert')) { el.setAttribute('inert', ''); verborgen.push(el); } });
    document.body.appendChild(laag);
    document.documentElement.style.overflow = 'hidden';
    var veld = laag.querySelector('input'); var fout = laag.querySelector('.af-toegang-fout');
    veld.focus();
    laag.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var woord = veld.value.trim().toLowerCase();
      sha256(woord).then(function (h) {
        if (h === HASH) { onthoud(); sluit(); } else { fout.textContent = 'Dat toegangswoord klopt niet. Probeer het opnieuw.'; veld.select(); }
      }, function () { fout.textContent = 'Controleren lukt niet in deze browser. Open de site via https in een recente browser.'; });
    });
  }
  if (document.body) toon(); else document.addEventListener('DOMContentLoaded', toon);
})();
