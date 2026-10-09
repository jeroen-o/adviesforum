/* Live forum op de homepage (index.html): koppelt de app aan de database via js/forum-backend.js.
 * Doet niets als de backend uit staat; dan werkt het forum zoals voorheen.
 * Gebruikt de globale functies en gegevens van index.html (VRAGEN, USERS, S, render, toast, openLogin, ...).
 */
(function () {
  'use strict';
  var B = window.ForumBackend;
  if (!B || !B.actief) return;
  var LIVE = 'live:';
  var mijnProfiel = null;

  function liveGebruiker(uid, p) {
    var id = LIVE + uid, u = USERS.find(function (x) { return x.id === id; });
    var aanbieder = !!(p && p.soort === 'aanbieder');
    var gegevens = { naam: (p && p.naam) || (aanbieder ? 'Medewerker aanbieder' : 'Adviseur'), functie: (p && p.functie) || (aanbieder ? 'Aanbieder' : 'Financieel adviseur'), kantoor: (p && p.kantoor) || '', geverifieerd: !!(p && p.geverifieerd), soort: aanbieder ? 'aanbieder' : 'adviseur' };
    if (u) { Object.assign(u, gegevens); return u; }
    u = Object.assign({ id: id, rol: 'adviseur', live: true }, gegevens);
    USERS.push(u);
    return u;
  }

  /* Gepubliceerde vragen, antwoorden en beoordelingen ophalen en samenvoegen met de bestaande vragen */
  function laadLive() {
    return Promise.all([B.liveVragen(), B.liveAntwoorden(), B.beoordelingen()]).then(function (r) {
      (r[0] || []).forEach(function (q) {
        if (VRAGEN.some(function (v) { return v.id === q.id; })) return;
        liveGebruiker(q.auteur, q.profielen);
        VRAGEN.unshift({ id: q.id, cat: q.cat, titel: q.titel, body: q.body, tags: q.tags || [], auteur: LIVE + q.auteur, datum: q.aangemaakt, views: 0, beste: null, antwoorden: [], live: true });
      });
      var perAntwoord = {};
      (r[2] || []).forEach(function (b) { (perAntwoord[b.antwoord_id] = perAntwoord[b.antwoord_id] || {})[LIVE + b.auteur] = b.score; });
      (r[1] || []).forEach(function (a) {
        var v = VRAGEN.find(function (x) { return x.id === a.vraag_ref; });
        if (!v || v.antwoorden.some(function (x) { return x.liveId === a.id; })) return;
        liveGebruiker(a.auteur, a.profielen);
        v.antwoorden.push({ id: 'l' + a.id.replace(/-/g, ''), liveId: a.id, auteur: LIVE + a.auteur, datum: a.aangemaakt, rA: perAntwoord[a.id] || {}, rAdv: {}, body: a.body, live: true });
      });
      if (typeof route === 'function' && route()) {} /* een gedeelde link naar een live vraag werkt na het laden */
      render(true);
    }).catch(function () { toast('Het live forum is nu niet bereikbaar; je ziet de vaste inhoud'); });
  }

  /* Inloggen met een e-maillink in plaats van een code */
  window.openLogin = function () {
    var d = document.getElementById('login-dlg');
    if (!d) { d = document.createElement('dialog'); d.id = 'login-dlg'; document.body.appendChild(d); }
    d.innerHTML = '<form method="dialog" class="pad form" id="f-login-live"><h2 style="margin:0 0 8px">Inloggen adviseur</h2>' +
      '<p style="margin:0 0 12px;font-size:14px">Vul je e-mailadres in. Je krijgt een link waarmee je direct bent ingelogd; een wachtwoord is niet nodig.</p>' +
      '<label for="lg-email">E-mailadres</label><input id="lg-email" name="email" type="email" autocomplete="email" required>' +
      '<div class="actions" style="margin-top:14px"><button class="btn btn-black" type="submit">Stuur inloglink →</button><button class="btn btn-line" type="button" data-act="login-sluit">Annuleren</button></div>' +
      '<p style="font-size:13px;margin:12px 0 0">Nieuw? Na je eerste keer inloggen vul je je naam, kantoor en AFM-vergunningnummer in. De beheerder controleert die; daarna kun je antwoorden en beoordelen. Lees de <a href="gebruiksvoorwaarden.html">gebruiksvoorwaarden</a>.</p></form>';
    d.showModal();
    setTimeout(function () { var i = document.getElementById('lg-email'); if (i) i.focus(); }, 0);
  };
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'f-login-live') return;
    e.preventDefault(); e.stopImmediatePropagation();
    var f = e.target, email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Vul een geldig e-mailadres in'); return; }
    var knop = f.querySelector('button[type="submit"]'); knop.disabled = true;
    B.stuurLink(email, location.origin + location.pathname).then(function () {
      f.innerHTML = '<h2 style="margin:0 0 8px">Check je mail</h2><p style="margin:0 0 12px">We hebben een inloglink gestuurd naar <b>' + esc(email) + '</b>. Klik op de link in de mail om in te loggen. Geen mail? Kijk in je spammap.</p><div class="actions"><button class="btn btn-line" type="button" data-act="login-sluit">Sluiten</button></div>';
    }).catch(function (err) { knop.disabled = false; toast('Versturen lukte niet: ' + err.message); });
  }, true);

  /* Profiel invullen na de eerste keer inloggen */
  function openProfiel(verplicht) {
    var p = mijnProfiel || {};
    var d = document.getElementById('profiel-dlg');
    if (!d) { d = document.createElement('dialog'); d.id = 'profiel-dlg'; document.body.appendChild(d); }
    d.innerHTML = '<form method="dialog" class="pad form" id="f-profiel"><h2 style="margin:0 0 8px">' + (verplicht ? 'Welkom! Vul je profiel in' : 'Je profiel') + '</h2>' +
      '<p style="margin:0 0 12px;font-size:14px">Je naam, functie en kantoor staan bij je bijdragen. Je AFM-vergunningnummer gebruikt de beheerder alleen om je te controleren. Wijzig je later je naam, kantoor of soort account, dan controleren we opnieuw.</p>' +
      '<fieldset style="border:0;padding:0;margin:0 0 6px"><legend style="font-weight:700;font-size:14px">Ik ben</legend>' +
      '<label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="radio" name="soort" value="adviseur" style="width:auto"' + (p.soort === 'aanbieder' ? '' : ' checked') + '> Financieel adviseur</label>' +
      '<label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="radio" name="soort" value="aanbieder" style="width:auto"' + (p.soort === 'aanbieder' ? ' checked' : '') + '> Medewerker van een aanbieder (geldverstrekker, verzekeraar of andere aanbieder)</label></fieldset>' +
      '<label for="pf-naam">Naam</label><input id="pf-naam" name="naam" required maxlength="80" value="' + esc(p.naam || '') + '">' +
      '<label for="pf-functie">Functie</label><input id="pf-functie" name="functie" maxlength="80" value="' + esc(p.functie || '') + '" placeholder="Bijvoorbeeld Hypotheekadviseur">' +
      '<label for="pf-kantoor">Kantoor of aanbieder</label><input id="pf-kantoor" name="kantoor" required maxlength="120" value="' + esc(p.kantoor || '') + '">' +
      '<label for="pf-plaats">Plaats</label><input id="pf-plaats" name="plaats" maxlength="80" value="' + esc(p.plaats || '') + '">' +
      '<label for="pf-afm">AFM-vergunningnummer kantoor of aanbieder <span style="font-weight:400">(voor een aanbieder zonder AFM-nummer: leeg laten)</span></label><input id="pf-afm" name="afm" inputmode="numeric" pattern="[0-9]{8}" value="' + esc(p.afm || '') + '" placeholder="8 cijfers">' +
      '<label for="pf-li">LinkedIn-profiel (optioneel)</label><input id="pf-li" name="linkedin" type="url" value="' + esc(p.linkedin || '') + '" placeholder="https://www.linkedin.com/in/...">' +
      '<div class="actions" style="margin-top:14px"><button class="btn btn-black" type="submit">Opslaan</button>' + (verplicht ? '' : '<button class="btn btn-line" type="button" data-act="profiel-sluit">Annuleren</button>') + '</div></form>';
    d.showModal();
  }
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'f-profiel') return;
    e.preventDefault(); e.stopImmediatePropagation();
    var f = e.target;
    var soort = f.querySelector('input[name="soort"]:checked');
    var p = { naam: f.naam.value, functie: f.functie.value, kantoor: f.kantoor.value, plaats: f.plaats.value, afm: f.afm.value.replace(/\s/g, ''), linkedin: f.linkedin.value.trim(), soort: soort && soort.value === 'aanbieder' ? 'aanbieder' : 'adviseur' };
    if (p.naam.trim().length < 3 || p.kantoor.trim().length < 2) { toast('Vul je naam en kantoor of aanbieder in'); return; }
    if (!(p.soort === 'aanbieder' && p.afm === '') && !/^\d{8}$/.test(p.afm)) { toast('Het AFM-vergunningnummer heeft 8 cijfers'); return; }
    if (p.linkedin && !/^https:\/\/([a-z]+\.)?linkedin\.com\//.test(p.linkedin)) { toast('Vul een LinkedIn-link in (https://www.linkedin.com/in/...)'); return; }
    B.bewaarProfiel(p).then(function (nieuw) {
      mijnProfiel = nieuw || Object.assign(mijnProfiel || {}, p);
      liveGebruiker(B.gebruiker().id, mijnProfiel);
      document.getElementById('profiel-dlg').close();
      render(true);
      toast(mijnProfiel.geverifieerd ? 'Profiel opgeslagen' : 'Profiel opgeslagen. De beheerder controleert je gegevens; daarna kun je antwoorden plaatsen.');
    }).catch(function (err) { toast('Opslaan lukte niet: ' + err.message); });
  }, true);

  var geverifieerd = function () { return !!(mijnProfiel && mijnProfiel.geverifieerd); };
  var isLive = function () { return typeof S === 'object' && S.me && String(S.me).indexOf(LIVE) === 0; };

  /* Antwoord en vraag plaatsen: naar de wachtrij voor moderatie */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.id !== 'f-antwoord' && f.id !== 'f-vraag') return;
    if (f.id === 'f-vraag' && !isLive()) return; /* zonder account: vraag per e-mail zoals voorheen */
    e.preventDefault(); e.stopImmediatePropagation();
    if (!isLive()) { openLogin(); return; }
    if (!geverifieerd()) { toast('Je account wacht nog op controle door de beheerder'); return; }
    if (f.id === 'f-antwoord') {
      var body = f.body.value.trim();
      if (body.length < 10) { toast('Schrijf een iets uitgebreider antwoord'); return; }
      B.plaatsAntwoord(S.vraag, body).then(function () { f.body.value = ''; toast('Ontvangen. Je antwoord verschijnt na controle door een moderator.'); })
        .catch(function (err) { toast('Plaatsen lukte niet: ' + err.message); });
    } else {
      var titel = f.titel.value.trim(), tekst = f.body.value.trim(), tags = f.tags.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 6);
      if (titel.length < 12 || tekst.length < 30) { toast('Vul titel en situatie volledig in'); return; }
      B.plaatsVraag({ cat: f.cat.value, titel: titel, body: tekst, tags: tags }).then(function () {
        f.reset(); go('forum', { tab: 'forum' }); toast('Ontvangen. Je vraag verschijnt na controle door een moderator.');
      }).catch(function (err) { toast('Plaatsen lukte niet: ' + err.message); });
    }
  }, true);

  /* Beoordelen, melden, profiel en uitloggen */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.dataset.act;
    if (act === 'profiel-sluit') { var d = document.getElementById('profiel-dlg'); if (d) d.close(); return; }
    if (act === 'mijn-profiel') { e.preventDefault(); openProfiel(false); return; }
    if (act === 'uitloggen' && isLive()) {
      e.preventDefault(); e.stopImmediatePropagation();
      B.uitloggen().then(function () { S.me = null; mijnProfiel = null; render(true); toast('Je bent uitgelogd'); });
      return;
    }
    if (act === 'meld-live') {
      e.preventDefault(); e.stopImmediatePropagation();
      if (!isLive()) { openLogin(); return; }
      var reden = window.prompt('Waarom meld je deze bijdrage? Bijvoorbeeld: onjuist, reclame, klantgegevens of ongepast.');
      if (!reden || reden.trim().length < 5) return;
      B.meldInhoud(el.dataset.soort || 'antwoord', el.dataset.id, reden.trim()).then(function () { toast('Bedankt, een moderator kijkt ernaar'); })
        .catch(function (err) { toast('Melden lukte niet: ' + err.message); });
      return;
    }
    if (act === 'rate') {
      var a = null; VRAGEN.some(function (v) { a = v.antwoorden.find(function (x) { return x.id === el.dataset.id; }); return !!a; });
      if (!a || !a.live || el.dataset.kind !== 'a') return; /* overige beoordelingen blijven in de sessie */
      e.preventDefault(); e.stopImmediatePropagation();
      if (!isLive()) { openLogin(); return; }
      if (a.auteur === S.me) { toast('Je eigen antwoord kun je niet beoordelen'); return; }
      if (mijnProfiel && mijnProfiel.soort === 'aanbieder') { toast('Als aanbieder kun je antwoorden niet beoordelen'); return; }
      if (!geverifieerd()) { toast('Je account wacht nog op controle door de beheerder'); return; }
      var val = +el.dataset.val;
      B.beoordeel(a.liveId, val).then(function () { a.rA[S.me] = val; render(true); toast('Antwoord beoordeeld met ' + val + (val === 1 ? ' ster' : ' sterren')); })
        .catch(function (err) { toast('Beoordelen lukte niet: ' + err.message); });
    }
  }, true);

  /* Start: sessie herstellen, profiel ophalen en live inhoud laden */
  if (B.foutInLink) toast('De inloglink werkt niet (meer): ' + B.foutInLink + '. Vraag een nieuwe link aan.');
  B.start().then(function (r) {
    if (r && r.user) {
      mijnProfiel = r.profiel;
      liveGebruiker(r.user.id, mijnProfiel);
      S.me = LIVE + r.user.id;
      render(true);
      if (!mijnProfiel || !mijnProfiel.naam) openProfiel(true);
      else if (!mijnProfiel.geverifieerd) toast('Je account wacht nog op controle door de beheerder');
    }
    return laadLive();
  });
  window.ForumLive = { herlaad: laadLive, profiel: function () { return mijnProfiel; } };
})();
