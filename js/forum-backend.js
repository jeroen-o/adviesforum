/* Live forum van het Adviesforum: inloggen met een e-maillink, vragen en antwoorden plaatsen (eerst moderatie),
 * beoordelen, melden en modereren. Praat rechtstreeks met de REST- en Auth-API van Supabase (geen bibliotheek).
 * Staat uit zolang js/backend-config.js leeg is.
 *
 * Sessie: het verversingstoken staat in de functionele first-party cookie af_sessie (30 dagen, Secure, SameSite=Lax);
 * het toegangstoken alleen in het geheugen. Uitloggen wist de cookie.
 */
(function () {
  'use strict';
  var C = window.ADVIESFORUM_BACKEND || {};
  var URL_ = String(C.url || '').replace(/\/+$/, ''), KEY = C.anonKey || '';
  var actief = !!(URL_ && KEY && /^https:\/\//.test(URL_));
  var COOKIE = 'af_sessie';
  var sessie = null; /* {access_token, refresh_token, verloopt, user} */
  var luisteraars = [];

  function zetCookie(waarde) {
    var veilig = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = waarde ? COOKIE + '=' + encodeURIComponent(waarde) + '; Max-Age=2592000; Path=/; SameSite=Lax' + veilig
                             : COOKIE + '=; Max-Age=0; Path=/; SameSite=Lax' + veilig;
  }
  function leesCookie() { var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : ''; }
  function meld() { luisteraars.forEach(function (f) { try { f(sessie); } catch (e) {} }); }

  function verzoek(pad, opties) {
    opties = opties || {};
    var h = { apikey: KEY, 'Content-Type': 'application/json' };
    if (sessie && sessie.access_token) h.Authorization = 'Bearer ' + sessie.access_token;
    if (opties.prefer) h.Prefer = opties.prefer;
    return fetch(URL_ + pad, { method: opties.method || 'GET', headers: h, body: opties.body ? JSON.stringify(opties.body) : undefined })
      .then(function (r) {
        return r.text().then(function (t) {
          var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = t; }
          if (!r.ok) { var f = new Error((d && (d.message || d.msg || d.error_description || d.error)) || ('Fout ' + r.status)); f.status = r.status; throw f; }
          return d;
        });
      });
  }
  function zetSessie(d) {
    sessie = { access_token: d.access_token, refresh_token: d.refresh_token, verloopt: Date.now() + (Number(d.expires_in) || 3600) * 1000 - 60000, user: d.user || (sessie && sessie.user) || null };
    zetCookie(sessie.refresh_token);
  }
  function ververs() {
    var rt = sessie ? sessie.refresh_token : leesCookie();
    if (!rt) return Promise.resolve(null);
    return verzoek('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: rt } })
      .then(function (d) { zetSessie(d); return sessie; })
      .catch(function () { sessie = null; zetCookie(''); return null; });
  }
  function geldig() { return sessie && Date.now() < sessie.verloopt ? Promise.resolve(sessie) : ververs(); }
  function metSessie(f) { return geldig().then(function (s) { if (!s) { var e = new Error('Niet ingelogd'); e.status = 401; throw e; } return f(s); }); }

  /* Terugkomst uit de e-maillink: #access_token=...&refresh_token=... (synchroon, vóór de router van de site) */
  var terug = null;
  if (actief && /access_token=/.test(location.hash)) {
    var p = new URLSearchParams(location.hash.slice(1));
    if (p.get('access_token') && p.get('refresh_token')) {
      terug = { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_in: p.get('expires_in') };
      zetSessie(terug);
    }
    history.replaceState(null, '', location.pathname + location.search);
  }
  var foutInLink = actief && /error_description=/.test(location.hash) ? decodeURIComponent((location.hash.match(/error_description=([^&]*)/) || [])[1] || '').replace(/\+/g, ' ') : '';
  if (foutInLink) history.replaceState(null, '', location.pathname + location.search);

  var api = {
    actief: actief,
    foutInLink: foutInLink,
    opSessie: function (f) { luisteraars.push(f); },
    /* Start: herstel de sessie en haal gebruiker en profiel op. Geeft {user, profiel} of null. */
    start: function () {
      if (!actief) return Promise.resolve(null);
      return (terug ? Promise.resolve(sessie) : ververs()).then(function (s) {
        if (!s) return null;
        return verzoek('/auth/v1/user').then(function (u) { sessie.user = u; return api.profiel(); })
          .then(function (pr) { meld(); return { user: sessie.user, profiel: pr }; })
          .catch(function () { return null; });
      });
    },
    ingelogd: function () { return !!sessie; },
    gebruiker: function () { return sessie && sessie.user; },
    stuurLink: function (email, terugUrl) {
      return verzoek('/auth/v1/otp?redirect_to=' + encodeURIComponent(terugUrl || (location.origin + location.pathname)), { method: 'POST', body: { email: email, create_user: true } });
    },
    uitloggen: function () {
      var s = sessie; sessie = null; zetCookie(''); meld();
      if (s) fetch(URL_ + '/auth/v1/logout', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + s.access_token } }).catch(function () {});
      return Promise.resolve();
    },
    profiel: function () {
      return metSessie(function (s) {
        return verzoek('/rest/v1/profielen?id=eq.' + encodeURIComponent(s.user.id) + '&select=*').then(function (d) { return d && d[0] || null; });
      });
    },
    bewaarProfiel: function (p) {
      return metSessie(function (s) {
        var velden = {}; ['naam', 'kantoor', 'functie', 'plaats', 'afm', 'linkedin'].forEach(function (k) { if (k in p) velden[k] = String(p[k] || '').trim(); });
        return verzoek('/rest/v1/profielen?id=eq.' + encodeURIComponent(s.user.id), { method: 'PATCH', body: velden, prefer: 'return=representation' }).then(function (d) { return d && d[0]; });
      });
    },
    /* Gepubliceerde inhoud (ook zonder inloggen) */
    liveVragen: function () { return verzoek('/rest/v1/vragen?status=eq.gepubliceerd&select=id,cat,titel,body,tags,aangemaakt,auteur,profielen(naam,kantoor,functie,geverifieerd)&order=aangemaakt.desc&limit=500'); },
    liveAntwoorden: function () { return verzoek('/rest/v1/antwoorden?status=eq.gepubliceerd&select=id,vraag_ref,body,aangemaakt,auteur,profielen(naam,kantoor,functie,geverifieerd)&order=aangemaakt.asc&limit=2000'); },
    beoordelingen: function () { return verzoek('/rest/v1/beoordelingen?select=antwoord_id,auteur,score&limit=10000'); },
    /* Plaatsen (status 'wacht'; verschijnt na moderatie) */
    plaatsVraag: function (v) { return metSessie(function () { return verzoek('/rest/v1/vragen', { method: 'POST', body: { cat: v.cat, titel: v.titel, body: v.body, tags: v.tags || [] }, prefer: 'return=representation' }); }); },
    plaatsAntwoord: function (vraagRef, body) { return metSessie(function () { return verzoek('/rest/v1/antwoorden', { method: 'POST', body: { vraag_ref: vraagRef, body: body }, prefer: 'return=representation' }); }); },
    beoordeel: function (antwoordId, score) {
      return metSessie(function () { return verzoek('/rest/v1/beoordelingen?on_conflict=antwoord_id,auteur', { method: 'POST', body: { antwoord_id: antwoordId, score: score }, prefer: 'resolution=merge-duplicates,return=minimal' }); });
    },
    meldInhoud: function (soort, ref, reden) { return metSessie(function () { return verzoek('/rest/v1/meldingen', { method: 'POST', body: { soort: soort, ref: ref, reden: reden }, prefer: 'return=minimal' }); }); },
    /* Moderatie (alleen voor moderators; de database weigert het anders) */
    wachtrij: function () {
      return metSessie(function () {
        return Promise.all([
          verzoek('/rest/v1/vragen?status=eq.wacht&select=*,profielen(naam,kantoor,afm,geverifieerd)&order=aangemaakt.asc'),
          verzoek('/rest/v1/antwoorden?status=eq.wacht&select=*,profielen(naam,kantoor,afm,geverifieerd)&order=aangemaakt.asc'),
          verzoek('/rest/v1/meldingen?afgehandeld=eq.false&select=*&order=aangemaakt.asc'),
          verzoek('/rest/v1/profielen?geverifieerd=eq.false&naam=neq.&select=*&order=aangemaakt.asc')
        ]).then(function (r) { return { vragen: r[0] || [], antwoorden: r[1] || [], meldingen: r[2] || [], accounts: r[3] || [] }; });
      });
    },
    zetStatus: function (tabel, id, status, reden) {
      if (['vragen', 'antwoorden'].indexOf(tabel) < 0) return Promise.reject(new Error('Onbekende tabel'));
      return metSessie(function () { return verzoek('/rest/v1/' + tabel + '?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: { status: status, reden: reden || '', gemodereerd_op: new Date().toISOString() }, prefer: 'return=minimal' }); });
    },
    handelMeldingAf: function (id) { return metSessie(function () { return verzoek('/rest/v1/meldingen?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: { afgehandeld: true }, prefer: 'return=minimal' }); }); },
    verifieer: function (id, aan) { return metSessie(function () { return verzoek('/rest/v1/profielen?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: { geverifieerd: !!aan }, prefer: 'return=minimal' }); }); }
  };
  window.ForumBackend = api;
})();
