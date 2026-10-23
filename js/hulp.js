/* Prototype hulppaneel (hulp.html): eerst zelfbediening met de kennisbank en opgeloste vragen, daarna doorzetten.
 * Geen AI, geen opslag, geen verzending: alles gebeurt in de browser met de gegevens van Adviesforum. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var VRAGEN = window.VRAGEN_DATA || [];
  var SCHERMEN = ['Adviseren › Hypotheek samenstellen', 'Adviseren › Berekeningen', 'Adviseren › Financieringsopzet', 'Inventarisatie', 'Oriënteren', 'Productselectie', 'Aanvraag (HDN)', 'Rapportage'];
  var STOP = new Set('hoe kan ik de het een in van bij op met en of is zijn wordt worden voor naar te dat dit die niet wat welke als ook je jullie wij we mijn er aan om al nog dan maar meer zelf waar wanneer waarom wel zo moet moeten kun kunt na door over uit dan toch heb heeft hebben'.split(' '));
  var ctx = { scherm: SCHERMEN[0], veld: 'Geldverstrekker', versie: '' };
  var state = { vraag: '', kb: null, kbLaden: null };

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stem(w) { if (w.length > 6 && w.slice(-2) === 'en') return w.slice(0, -2); if (w.length > 5 && w.slice(-1) === 's') return w.slice(0, -1); return w; }
  function tokens(s) {
    var out = [];
    String(s).toLowerCase().replace(/[^a-z0-9àâäéèêëïîôöùûüç\- ]+/g, ' ').split(/\s+/).forEach(function (w) {
      if (!w || STOP.has(w) || (w.length < 3 && !/^[a-z]{3}$/.test(w))) return;
      w = stem(w); if (w.length >= 3 && out.indexOf(w) === -1) out.push(w);
    });
    return out;
  }
  function score(q, titel, tekst) {
    if (!q.length) return 0;
    var t = tokens(titel), b = tokens(tekst), s = 0, sterk = 0;
    q.forEach(function (w) {
      if (t.some(function (x) { return x === w || (w.length >= 6 && (x.indexOf(w) === 0 || w.indexOf(x) === 0)); })) { s += 2; sterk++; }
      else if (b.some(function (x) { return x === w || (w.length >= 7 && (x.indexOf(w) === 0 || w.indexOf(x) === 0)); })) s += 1;
    });
    return sterk ? s / Math.sqrt(q.length) : 0;
  }
  function kort(t, n) {
    var p = String(t).split('\n').map(function (x) { return x.replace(/^(#+ |- |\d+\. )/, '').trim(); }).filter(Boolean).join(' ');
    return p.length > n ? p.slice(0, n).replace(/\s+\S*$/, '') + '…' : p;
  }

  /* Kennisbank: llms-full.txt van de site (alle artikelen met titel, url, peildatum en status), pas geladen bij de eerste vraag. */
  function laadKb() {
    if (state.kb) return Promise.resolve(state.kb);
    if (state.kbLaden) return state.kbLaden;
    state.kbLaden = fetch('llms-full.txt').then(function (r) { return r.text(); }).then(function (t) {
      var blokken = t.split(/\n---\n\n(?=# )/).slice(1), lijst = [];
      blokken.forEach(function (b) {
        var regels = b.split('\n'), a = { titel: '', url: '', cat: '', peildatum: '', status: '', tekst: '' }, k = 0;
        if (!/^# /.test(regels[0])) return;
        a.titel = regels[0].slice(2).trim();
        for (k = 1; k < regels.length; k++) {
          var r = regels[k];
          if (!r.trim()) { if (a.url && /^Status:|^Gepubliceerd:|^Categorie:|^URL:/.test(regels[k + 1] || '')) continue; if (a.url) { k++; break; } continue; }
          var m;
          if ((m = /^URL: (\S+)/.exec(r))) a.url = m[1];
          else if ((m = /^Categorie: (.+)/.exec(r))) a.cat = m[1];
          else if ((m = /^Gepubliceerd: (.+)/.exec(r))) { var pd = /Peildatum: (\S+)/.exec(m[1]); if (pd) a.peildatum = pd[1]; }
          else if ((m = /^Status: (.+)/.exec(r))) a.status = m[1];
          else { if (a.url) break; }
        }
        a.tekst = regels.slice(k).join('\n');
        if (a.url) lijst.push(a);
      });
      state.kb = lijst; return lijst;
    }).catch(function () { state.kb = []; return []; });
    return state.kbLaden;
  }

  /* Persoonsgegevens uit de forumtekst halen (alleen patronen; namen herkent dit niet). */
  var PII = [
    ['e-mailadres', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g],
    ['IBAN', /\b[A-Z]{2}\d{2}\s?[A-Z]{4}\s?(?:\d{4}\s?){2}\d{2}\b/g],
    ['telefoonnummer', /(?:\+31|0031|\b0)\s?[1-9](?:[\s-]?\d){8}\b/g],
    ['postcode', /\b[1-9]\d{3}\s?[A-Za-z]{2}\b/g],
    ['nummer van negen cijfers', /\b\d{9}\b/g]
  ];
  function pii(tekst) {
    var gevonden = [], schoon = tekst;
    PII.forEach(function (p) { var m = schoon.match(p[1]); if (m) { gevonden.push(p[0] + (m.length > 1 ? ' (' + m.length + 'x)' : '')); schoon = schoon.replace(p[1], '[verwijderd]'); } });
    return { gevonden: gevonden, schoon: schoon };
  }

  function zoekVragen(q, alleenOpgelost) {
    var hits = [];
    VRAGEN.forEach(function (v) {
      if (!v.antwoorden || !v.antwoorden.length) return;
      if (alleenOpgelost && !v.beste) return;
      var s = score(q, v.titel + ' ' + (v.tags || []).join(' '), v.body + ' ' + v.antwoorden.map(function (a) { return a.body; }).join(' '));
      if (s >= 1.5) hits.push({ v: v, score: s + (v.beste ? 0.5 : 0) });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return hits;
  }
  function vraagLink(v) { return 'index.html#vraag-' + encodeURIComponent(v.id); }
  function lijstVragen(hits, n) {
    return hits.slice(0, n).map(function (h) {
      return '<li><a href="' + vraagLink(h.v) + '" target="_blank" rel="noopener">' + esc(h.v.titel) + '</a>' + (h.v.beste ? '<span class="badge">Opgelost</span>' : '<span class="badge licht">Beantwoord</span>') + (h.v.voorbeeld ? '<span class="badge licht">Voorbeeldvraag</span>' : '') + '</li>';
    }).join('');
  }

  function toonContext() {
    $('chips').innerHTML = [ctx.scherm, 'Veld: ' + (ctx.veld || 'onbekend'), 'Versie ' + (ctx.versie || 'onbekend')].map(function (c) { return '<span class="chip">' + esc(c) + '</span>'; }).join('');
    var q = tokens(ctx.scherm + ' ' + ctx.veld);
    var hits = zoekVragen(q, false).slice(0, 3);
    $('s-proactief').classList.toggle('verborgen', !hits.length);
    $('proactief').innerHTML = lijstVragen(hits, 3);
  }

  function toon(deel) {
    ['f-vraag', 's-antwoord', 's-opgelost', 's-route', 's-status'].forEach(function (id) { $(id).classList.toggle('verborgen', id !== deel); });
    $('s-proactief').classList.toggle('verborgen', deel !== 'f-vraag' || !$('proactief').innerHTML);
    var kop = $(deel).querySelector('h2,button,textarea'); if (kop && kop.focus) { try { kop.focus({ preventScroll: false }); } catch (e) { kop.focus(); } }
  }

  function zoek(e) {
    e.preventDefault();
    var tekst = $('vraag').value.trim();
    if (tekst.length < 12) { $('pii').className = 'kader waarschuwing'; $('pii').textContent = 'Schrijf je vraag iets uitgebreider (minimaal 12 tekens).'; return; }
    var p = pii(tekst);
    state.vraag = p.schoon;
    var q = tokens(tekst + ' ' + ctx.veld);
    laadKb().then(function (kb) {
      var forum = zoekVragen(q, false);
      var opgelost = forum.filter(function (h) { return h.v.beste; });
      var voorstel = (opgelost[0] || forum[0] || null);
      $('herformulering').innerHTML = voorstel
        ? '<b>Bedoel je:</b><p style="margin:6px 0;font-size:17px;font-weight:600;color:var(--inkt)">' + esc(voorstel.v.titel) + '</p><span class="klein">Voorstel op basis van een vergelijkbare vraag in het forum, geen AI.</span><div><button class="knop hoofd" type="button" id="b-bedoel">Ja, dat bedoel ik</button><button class="knop" type="button" id="b-wijzig">Aanpassen</button></div>'
        : '<b>Je vraag</b><p style="margin:6px 0;font-size:17px;font-weight:600;color:var(--inkt)">' + esc(state.vraag) + '</p><span class="klein">Er is geen vergelijkbare vraag gevonden om de vraag achter de vraag te herformuleren.</span>';
      var best = null, bs = 0;
      kb.forEach(function (a) { var s = score(q, a.titel, a.tekst.slice(0, 4000)); if (s > bs) { bs = s; best = a; } });
      var kbHtml;
      if (best && bs >= 1.5) {
        var gecontroleerd = /gecontroleerd door compliance/i.test(best.status) && !/niet gecontroleerd|concept/i.test(best.status);
        kbHtml = '<b>Antwoord uit de kennisbank</b> <span class="badge licht">geen AI</span><p style="margin:8px 0 4px"><b>' + esc(best.titel) + '</b></p><p style="margin:0">' + esc(kort(best.tekst, 420)) + '</p>' +
          '<div class="bron">Bron: <a href="' + esc(best.url.replace('https://adviesforum.nl/', '')) + '" target="_blank" rel="noopener">' + esc(best.titel) + '</a>' + (best.peildatum ? ', peildatum ' + esc(best.peildatum) : '') + (best.status ? ' · ' + esc(best.status) : '') + (gecontroleerd ? '' : '. Controleer altijd de actuele bron.') + '</div>';
      } else {
        kbHtml = '<b>Antwoord uit de kennisbank</b><p style="margin:8px 0 0">Er is geen passend artikel gevonden. Probeer je vraag anders te formuleren of zet hem door.</p>';
      }
      $('kb-antwoord').innerHTML = kbHtml;
      var gelijk = opgelost.length ? opgelost : forum;
      $('vergelijk').innerHTML = lijstVragen(gelijk.filter(function (h) { return !voorstel || h.v.id !== voorstel.v.id; }), 4) || '<li class="klein">Geen vergelijkbare vragen gevonden.</li>';
      toon('s-antwoord');
      var bd = $('b-bedoel'); if (bd) bd.onclick = function () { bd.textContent = '✓ Bevestigd'; };
      var bw = $('b-wijzig'); if (bw) bw.onclick = function () { toon('f-vraag'); $('vraag').focus(); };
    });
  }

  function naarRoute() {
    $('preview').textContent = state.vraag;
    toon('s-route');
  }
  function doorzetten() {
    var software = document.querySelector('input[name=type]:checked').value === 'software';
    var alleenSupport = $('alleen-support').checked;
    var onderaan = [];
    onderaan.push('<li class="klaar"><b>Vraag gesteld</b><span class="klein">Vanuit ' + esc(ctx.scherm) + '</span></li>');
    onderaan.push('<li class="klaar"><b>Antwoord uit de kennisbank gegeven</b><span class="klein">Gemarkeerd als niet opgelost</span></li>');
    if (software || alleenSupport) {
      onderaan.push('<li class="nu"><b>Bij support</b><span class="klein">Een medewerker kijkt naar je vraag. Is het een bug, dan wordt een Jira-issue gekoppeld.</span></li>');
    }
    if (!alleenSupport) {
      onderaan.push('<li class="' + (software ? '' : 'nu') + '"><b>' + (software ? 'Op het forum (na moderatie)' : 'Bij experts op dit onderwerp') + '</b><span class="klein">Na [x uur] zonder antwoord naar een kennisambassadeur</span></li>');
    }
    onderaan.push('<li><b>Opgelost</b><span class="klein">Het antwoord gaat via triage en moderatie naar de kennisbank</span></li>');
    $('stappen').innerHTML = onderaan.join('');
    $('status-vraag').textContent = state.vraag;
    $('support-blok').classList.toggle('verborgen', !(software || alleenSupport));
    toon('s-status');
  }
  function opnieuw() { $('vraag').value = ''; $('pii').className = 'kader waarschuwing verborgen'; toon('f-vraag'); }

  /* Context uit de URL en demo-instellingen */
  function leesUrl() {
    var p = new URLSearchParams(location.search);
    var kap = function (s, n) { return String(s || '').replace(/[<>]/g, '').slice(0, n); };
    if (p.get('scherm')) ctx.scherm = kap(p.get('scherm'), 80);
    if (p.get('veld')) ctx.veld = kap(p.get('veld'), 60);
    if (p.get('versie')) ctx.versie = kap(p.get('versie'), 20);
  }
  function schrijfUrl() {
    var p = new URLSearchParams(); p.set('scherm', ctx.scherm); if (ctx.veld) p.set('veld', ctx.veld); if (ctx.versie) p.set('versie', ctx.versie);
    try { history.replaceState(null, '', '?' + p.toString()); } catch (e) { /* geen history */ }
  }
  function init() {
    leesUrl();
    var sel = $('d-scherm');
    var opties = SCHERMEN.slice(); if (opties.indexOf(ctx.scherm) === -1) opties.unshift(ctx.scherm);
    sel.innerHTML = opties.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    sel.value = ctx.scherm; $('d-veld').value = ctx.veld; $('d-versie').value = ctx.versie;
    var wijzig = function () { ctx.scherm = sel.value; ctx.veld = $('d-veld').value; ctx.versie = $('d-versie').value; schrijfUrl(); toonContext(); };
    sel.addEventListener('change', wijzig); $('d-veld').addEventListener('input', wijzig); $('d-versie').addEventListener('input', wijzig);
    $('f-vraag').addEventListener('submit', zoek);
    $('vraag').addEventListener('input', function () {
      var p = pii($('vraag').value);
      var vak = $('pii');
      if (p.gevonden.length) { vak.className = 'kader waarschuwing'; vak.innerHTML = '<b>Lijkt klantgegevens te bevatten:</b> ' + esc(p.gevonden.join(', ')) + '. Deze worden uit de forumtekst gehaald. Controleer zelf ook op namen.'; }
      else vak.className = 'kader waarschuwing verborgen';
    });
    $('b-ja').addEventListener('click', function () { toon('s-opgelost'); });
    $('b-nee').addEventListener('click', naarRoute);
    $('b-aanpas').addEventListener('click', function () { toon('f-vraag'); $('vraag').focus(); });
    $('b-door').addEventListener('click', doorzetten);
    $('b-opnieuw').addEventListener('click', opnieuw);
    $('b-opnieuw2').addEventListener('click', opnieuw);
    toonContext();
  }
  init();
})();
