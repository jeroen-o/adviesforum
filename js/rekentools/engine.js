/* Adviesforum – rekenhulpen: gedeelde engine (geen build-stap).
 *
 * Volgorde van laden (zie rekentools.html):
 *   1. js/rekentools/engine.js     – deze file: RT.add, opmaak, rekenkern, kalender, weergave
 *   2. js/rekentools/normen.js     – jaarlijks wisselende normen (RT.normen) + fiscale rekenkern (RT.fisc)
 *   3. js/rekentools/<groep>.js    – per groep één bestand met RT.add({...}) per rekenhulp
 *   4. RT.start()                  – inline in rekentools.html, bouwt menu en toont de hulp uit de #hash
 *
 * Een groepbestand ziet er zo uit:
 *   (function (RT) {
 *     'use strict';
 *     const { fmt, fin } = RT;
 *     RT.add({ id: 'mijn-hulp', groep: 'lenen-rente', naam: '…', intro: '…', velden: [ … ],
 *              bereken(v) { return { lbl: '…', groot: fmt.euro(1), rijen: [] }; },
 *              uitleg: '…', letop: '…' });
 *   })(window.RT);
 *
 * Deze file raakt bij het laden de DOM niet aan, zodat tools/build-rekentools-index.js hem in Node kan lezen.
 */
(function (w) {
  'use strict';
  const RT = w.RT = w.RT || {};

  /* ---------- groepen (vaste volgorde in menu en keuzelijst) ---------- */
  RT.GROEPEN = [
    { id: 'hypotheek-woning', naam: 'Hypotheek en woning' },
    { id: 'lenen-rente', naam: 'Lenen, rente en rekenbasis' },
    { id: 'vermogen-beleggen', naam: 'Sparen, beleggen en vermogen' },
    { id: 'pensioen-aow', naam: 'Pensioen en AOW' },
    { id: 'inkomen-werk', naam: 'Werk, inkomen en uitkering' },
    { id: 'fiscaal-box1', naam: 'Inkomstenbelasting en toeslagen' },
    { id: 'fiscaal-box2-3-schenken-erven', naam: 'Box 2, box 3, schenken en erven' },
    { id: 'ondernemer', naam: 'Ondernemer, zzp en dga' },
    { id: 'verzekeringen', naam: 'Verzekeringen en risico' },
    { id: 'huishouden-overig', naam: 'Huishouden, gezin en overig' },
    { id: 'datum-tijd', naam: 'Datum en tijd' }
  ];
  const groepVan = id => RT.GROEPEN.find(g => g.id === id);

  /* ---------- registratie ---------- */
  RT.tools = [];
  const SOORTEN = ['eur', 'bedrag', 'pct', 'num', 'keuze', 'datum', 'tekst'];
  RT.add = function (def) {
    const fout = m => { throw new Error('RT.add(' + (def && def.id) + '): ' + m); };
    if (!def || typeof def !== 'object') fout('geen definitie');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(def.id || '')) fout('id moet kleine letters, cijfers en streepjes bevatten');
    if (RT.tools.some(t => t.id === def.id)) fout('id bestaat al');
    if (!groepVan(def.groep)) fout('onbekende groep "' + def.groep + '"');
    if (!def.naam || !def.intro) fout('naam en intro zijn verplicht');
    if (!Array.isArray(def.velden)) fout('velden ontbreekt');
    if (typeof def.bereken !== 'function') fout('bereken(v) ontbreekt');
    const sleutels = new Set();
    def.velden.forEach(f => {
      if (!f.k || !f.l) fout('veld zonder k of l');
      if (sleutels.has(f.k)) fout('veld ' + f.k + ' dubbel');
      sleutels.add(f.k);
      if (!SOORTEN.includes(f.s)) fout('veld ' + f.k + ': onbekende soort "' + f.s + '"');
      if (f.s === 'keuze' && !(Array.isArray(f.opties) && f.opties.length)) fout('veld ' + f.k + ': opties ontbreken');
    });
    RT.tools.push(def);
    return def;
  };
  RT.get = id => RT.tools.find(t => t.id === id) || null;

  /* ---------- opmaak (NL-notatie) ---------- */
  const fmt = RT.fmt = {};
  const nfCache = {};
  const nf = d => nfCache[d] || (nfCache[d] = new Intl.NumberFormat('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d }));
  const geheel = new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 0 });
  // '€' + harde spatie, zodat bedrag en teken niet over twee regels breken
  fmt.euro = (x, d = 2) => Number.isFinite(x) ? (x < -0.004 ? '− ' : '') + '€ ' + nf(d).format(Math.abs(x)) : '–';
  fmt.euro0 = x => fmt.euro(x, 0);
  fmt.pct = (x, d = 2) => Number.isFinite(x) ? nf(d).format(x) + '%' : '–';
  fmt.getal = (x, d = 0) => Number.isFinite(x) ? nf(d).format(x) : '–';
  fmt.plus = s => (String(s).startsWith('−') ? '' : '+ ') + s; // teken voor een verschil
  fmt.duur = mnd => {
    if (!Number.isFinite(mnd)) return '–';
    const j = Math.floor(mnd / 12), m = mnd - j * 12;
    const dj = j ? j + ' jaar' : '', dm = m ? m + (m === 1 ? ' maand' : ' maanden') : '';
    return dj && dm ? dj + ' en ' + dm : (dj || dm || '0 maanden');
  };
  const DAG = RT.DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  const MAAND = RT.MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  fmt.datum = d => d ? DAG[d.getDay()] + ' ' + d.getDate() + ' ' + MAAND[d.getMonth()] + ' ' + d.getFullYear() : '–';
  fmt.datumKort = d => d.getDate() + ' ' + MAAND[d.getMonth()].slice(0, 3);
  fmt.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- invoer lezen ---------- */
  const lees = RT.lees = {};
  lees.euro = s => { const c = String(s || '').replace(/\D/g, ''); return c ? parseInt(c, 10) : NaN; };
  lees.getal = s => {
    let c = String(s || '').replace(/[\s€%]/g, '');
    if (c === '') return NaN;
    if (c.includes(',')) c = c.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(c)) c = c.replace(/\./g, ''); // 1.250 = duizendtal (alleen bij 'bedrag')
    const v = Number(c);
    return Number.isFinite(v) ? v : NaN;
  };
  const leesGetalStrikt = s => { // zoals de oorspronkelijke 31 hulpen: punt zonder komma = decimaalteken
    let c = String(s || '').replace(/[\s€%]/g, '');
    if (c === '') return NaN;
    if (c.includes(',')) c = c.replace(/\./g, '').replace(',', '.');
    const v = Number(c);
    return Number.isFinite(v) ? v : NaN;
  };
  lees.datum = s => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  // Reeks getallen uit vrije tekst: "2,5; 3; -1,2" of regels onder elkaar
  lees.reeks = s => String(s || '').split(/[;\n\s]+/).map(x => leesGetalStrikt(x)).filter(Number.isFinite);

  /* ---------- financiële kern ---------- */
  const fin = RT.fin = {};
  // Termijnbedrag bij annuïtaire aflossing: hoofdsom h, rente per periode r, aantal perioden n
  fin.annTermijn = (h, r, n) => r === 0 ? h / n : h * r / (1 - Math.pow(1 + r, -n));
  // Omgekeerd: welke hoofdsom hoort bij termijn t
  fin.annHoofdsom = (t, r, n) => r === 0 ? t * n : t * (1 - Math.pow(1 + r, -n)) / r;
  // Annuïtaire restschuld na k termijnen
  fin.annRest = (h, r, n, k) => {
    if (r === 0) return h - h / n * k;
    const t = fin.annTermijn(h, r, n), g = Math.pow(1 + r, k);
    return h * g - t * (g - 1) / r;
  };
  // Eindwaarde van startbedrag plus vaste inleg per periode (vooraf of achteraf)
  fin.eindwaarde = (start, inleg, r, n, vooraf) => {
    const g = Math.pow(1 + r, n);
    const reeks = r === 0 ? inleg * n : inleg * (g - 1) / r * (vooraf ? 1 + r : 1);
    return start * g + reeks;
  };
  fin.maandUitJaar = jaarPct => Math.pow(1 + jaarPct / 100, 1 / 12) - 1; // samengesteld
  // Halveringsmethode: f stijgend in [lo, hi]
  fin.zoekNul = (f, lo, hi) => {
    for (let s = 0; s < 200; s++) { const mid = (lo + hi) / 2; if (f(mid) > 0) hi = mid; else lo = mid; }
    return (lo + hi) / 2;
  };
  // Bruto rente over de eerste k maanden (annuïtair, lineair of aflossingsvrij), plus stand en eerste termijn
  fin.verloop = (h, i, n, k, vorm) => {
    if (vorm === 'ann') { const t = fin.annTermijn(h, i, n), rest = fin.annRest(h, i, n, k); return { termijn: t, rest, rente: t * k - (h - rest) }; }
    if (vorm === 'lin') { const a = h / n; return { termijn: a + h * i, rest: h - a * k, rente: i * (k * h - a * k * (k - 1) / 2) }; }
    return { termijn: h * i, rest: h, rente: h * i * k };
  };
  // Netto contante waarde van kasstromen cf[0..n] tegen rente r per periode
  fin.ncw = (cf, r) => cf.reduce((s, c, t) => s + c / Math.pow(1 + r, t), 0);
  // Interne rente per periode (kasstromen met minstens één tekenwissel); NaN als er geen oplossing in [-0,99; 10] is
  fin.irr = cf => {
    const f = r => fin.ncw(cf, r);
    let lo = -0.99, hi = 10, flo = f(lo), fhi = f(hi);
    if (!Number.isFinite(flo) || !Number.isFinite(fhi) || flo * fhi > 0) return NaN;
    for (let s = 0; s < 300; s++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if (fm * flo > 0) { lo = mid; flo = fm; } else hi = mid;
    }
    return (lo + hi) / 2;
  };
  // Standaardnormale verdelingsfunctie (benadering Abramowitz en Stegun 7.1.26, fout < 2e-7)
  fin.normCdf = x => {
    const z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.3275911 * z);
    const e = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
    return x >= 0 ? (1 + e) / 2 : (1 - e) / 2;
  };

  /* ---------- kalender ---------- */
  const kal = RT.kal = {};
  kal.paasdatum = jaar => {
    const a = jaar % 19, b = Math.floor(jaar / 100), c = jaar % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const som = h + l - 7 * m + 114;
    return new Date(jaar, Math.floor(som / 31) - 1, (som % 31) + 1);
  };
  kal.plusDagen = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const sleutel = d => d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  const feestCache = {};
  // Feestdagen van een jaar als lijst [[datum, naam]]; ruim = ook Goede Vrijdag en Bevrijdingsdag
  kal.feestlijst = (jaar, ruim) => {
    const p = kal.paasdatum(jaar);
    let koning = new Date(jaar, 3, 27);
    if (koning.getDay() === 0) koning = new Date(jaar, 3, 26);
    const lijst = [
      [new Date(jaar, 0, 1), 'Nieuwjaarsdag'], [p, 'Eerste paasdag'], [kal.plusDagen(p, 1), 'Tweede paasdag'],
      [koning, 'Koningsdag'], [kal.plusDagen(p, 39), 'Hemelvaartsdag'], [kal.plusDagen(p, 49), 'Eerste pinksterdag'],
      [kal.plusDagen(p, 50), 'Tweede pinksterdag'], [new Date(jaar, 11, 25), 'Eerste kerstdag'], [new Date(jaar, 11, 26), 'Tweede kerstdag']
    ];
    if (ruim) lijst.push([kal.plusDagen(p, -2), 'Goede Vrijdag'], [new Date(jaar, 4, 5), 'Bevrijdingsdag']);
    return lijst;
  };
  kal.feestdagen = (jaar, ruim) => {
    const k = jaar + (ruim ? 'r' : 's');
    if (feestCache[k]) return feestCache[k];
    const map = {};
    kal.feestlijst(jaar, ruim).forEach(([d, naam]) => { map[sleutel(d)] = naam; });
    return (feestCache[k] = map);
  };
  kal.feestnaam = (d, ruim) => kal.feestdagen(d.getFullYear(), ruim)[sleutel(d)] || null;
  kal.isWerkdag = (d, ruim) => d.getDay() !== 0 && d.getDay() !== 6 && !kal.feestnaam(d, ruim);
  kal.dagVerschil = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);
  kal.plusMaanden = (d, n) => {
    const doel = new Date(d.getFullYear(), d.getMonth() + n, 1);
    const laatste = new Date(doel.getFullYear(), doel.getMonth() + 1, 0).getDate();
    return new Date(doel.getFullYear(), doel.getMonth(), Math.min(d.getDate(), laatste));
  };
  kal.isoWeek = d => {
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dag = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dag);
    const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return Math.ceil(((t - jan1) / 864e5 + 1) / 7);
  };
  kal.vandaag = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  kal.isoDatum = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  /* ---------- veelgebruikte keuzelijsten ---------- */
  RT.keuzes = {
    VORM2: [['ann', 'Annuïtair'], ['lin', 'Lineair']],
    VORM3: [['ann', 'Annuïtair'], ['lin', 'Lineair'], ['vrij', 'Aflossingsvrij']],
    MOMENT: [['eind', 'Aan het eind van de maand'], ['begin', 'Aan het begin van de maand']],
    VRIJ: [['ruim', 'Erkende feestdagen, ook Goede Vrijdag en 5 mei'], ['smal', 'Feestdagen zonder Goede Vrijdag en 5 mei']],
    JANEE: [['ja', 'Ja'], ['nee', 'Nee']]
  };

  /* =====================================================================
   * Weergave (alleen in de browser; RT.start() wordt door de shell aangeroepen)
   * ===================================================================== */
  const $ = id => document.getElementById(id);
  const esc = fmt.esc;
  const opslag = {}; // invoer per rekenhulp, alleen in het geheugen
  let actief = null, laatste = null;

  const standaard = f => {
    if (f.s === 'eur') return geheel.format(f.std);
    if (f.s === 'bedrag') return f.std === '' || f.std == null ? '' : nf(Number.isInteger(f.std) ? 0 : 2).format(f.std);
    if (f.s === 'pct' || f.s === 'num') return String(f.std).replace('.', ',');
    return f.std == null ? '' : f.std;
  };
  const invoerVan = t => opslag[t.id] || (opslag[t.id] = Object.fromEntries(t.velden.map(f => [f.k, standaard(f)])));

  /* ---------- deeplinks: #id?k=waarde&k2=waarde ----------
   * Getallen gaan in machinevorm de URL in (300000, 4.1), keuzes als optiewaarde, datums als jjjj-mm-dd.
   * Bij inlezen accepteren we ook NL-notatie (4,1 of 300.000). */
  const machine = (f, r) => {
    if (f.s === 'eur' || f.s === 'pct' || f.s === 'num' || f.s === 'bedrag') {
      const x = leesVeld(f, r);
      return Number.isFinite(x) ? String(f.s === 'eur' ? x : Math.round(x * 1e8) / 1e8) : '';
    }
    return r == null ? '' : String(r);
  };
  const uitMachine = (f, s) => {
    s = String(s == null ? '' : s).trim();
    if (f.s === 'keuze') return f.opties.some(o => o[0] === s) ? s : null;
    if (f.s === 'datum') return s === '' || lees.datum(s) ? s : null;
    if (f.s === 'tekst') return s;
    if (s === '') return '';
    let x = /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : leesVeld(f, s);
    if (!Number.isFinite(x)) return null;
    if (f.s === 'eur') x = Math.round(Math.abs(x));
    return standaard(Object.assign({}, f, { std: x }));
  };
  RT.hashVan = t => {
    t = t || actief;
    if (!t) return '';
    const ruw = invoerVan(t), p = [];
    t.velden.forEach(f => p.push(encodeURIComponent(f.k) + '=' + encodeURIComponent(machine(f, ruw[f.k]))));
    return t.id + (p.length ? '?' + p.join('&') : '');
  };
  const leesHash = h => {
    h = String(h || '').replace(/^#/, '');
    const i = h.indexOf('?');
    let id = i < 0 ? h : h.slice(0, i);
    try { id = decodeURIComponent(id); } catch (e) { /* ongeldige codering */ }
    const params = {};
    if (i >= 0) h.slice(i + 1).split('&').forEach(deel => {
      if (!deel) return;
      const j = deel.indexOf('=');
      const dec = s => { try { return decodeURIComponent(s.replace(/\+/g, ' ')); } catch (e) { return s; } };
      params[dec(j < 0 ? deel : deel.slice(0, j))] = j < 0 ? '' : dec(deel.slice(j + 1));
    });
    return { id, params, heeftParams: i >= 0 };
  };
  RT.leesHash = leesHash;
  const zetInvoerUitHash = (t, params) => {
    const ruw = invoerVan(t);
    t.velden.forEach(f => {
      if (!(f.k in params)) return;
      const x = uitMachine(f, params[f.k]);
      if (x !== null) ruw[f.k] = x;
    });
  };
  const linkNaar = t => location.href.split('#')[0] + '#' + RT.hashVan(t);
  const werkHash = () => {
    if (!actief) return;
    try { history.replaceState(null, '', '#' + RT.hashVan(actief)); } catch (e) { /* geen history beschikbaar */ }
  };
  const leesVeld = (f, r) => {
    if (f.s === 'eur') return lees.euro(r);
    if (f.s === 'bedrag') return lees.getal(r);
    if (f.s === 'pct' || f.s === 'num') return leesGetalStrikt(r);
    if (f.s === 'datum') return lees.datum(r);
    return r;
  };
  const waardenVan = t => {
    const ruw = invoerVan(t), uit = {};
    t.velden.forEach(f => {
      uit[f.k] = leesVeld(f, ruw[f.k]);
      if (f.opt && Number.isNaN(uit[f.k])) uit[f.k] = 0;
    });
    return uit;
  };
  // Voor tests en tools die een andere hulp hergebruiken: reken een hulp door met (deels) eigen invoer
  RT.rekenMet = (id, invoer) => {
    const t = RT.get(id);
    if (!t) throw new Error('Onbekende rekenhulp ' + id);
    const v = {};
    t.velden.forEach(f => {
      const r = invoer && f.k in invoer ? invoer[f.k] : f.std;
      v[f.k] = typeof r === 'string' && f.s !== 'keuze' && f.s !== 'tekst' ? leesVeld(f, r) : (f.s === 'datum' && typeof r === 'string' ? lees.datum(r) : r);
      if (f.opt && Number.isNaN(v[f.k])) v[f.k] = 0;
    });
    return t.bereken(v);
  };

  const badges = t => {
    const b = [];
    if (t.peildatum) b.push('<span class="badge peil" title="Normen en bedragen gelden voor deze peildatum">Normen ' + esc(t.peildatum) + '</span>');
    if (t.fiscaal) {
      const titel = Array.isArray(t.fiscaal) ? 'Gebruikt: ' + t.fiscaal.join(', ') : 'Gebruikt jaarlijks wisselende fiscale of wettelijke normen';
      b.push('<span class="badge fisc" title="' + esc(titel) + '">Fiscale norm: controleer</span>');
    }
    return b.length ? '<div class="badges">' + b.join('') + '</div>' : '';
  };

  function bouwMenu() {
    $('menulijst').innerHTML = RT.GROEPEN.map(g => {
      const lijst = RT.tools.filter(t => t.groep === g.id);
      if (!lijst.length) return '';
      return '<details class="mgroep" data-g="' + g.id + '"><summary>' + esc(g.naam) + ' <span class="aantal">' + lijst.length + '</span></summary>' +
        lijst.map(t => '<button type="button" data-id="' + t.id + '">' + esc(t.naam) + '</button>').join('') + '</details>';
    }).join('');
    $('kies').innerHTML = '<option value="">Overzicht van alle ' + RT.tools.length + ' rekenhulpen</option>' + RT.GROEPEN.map(g => {
      const lijst = RT.tools.filter(t => t.groep === g.id);
      return lijst.length ? '<optgroup label="' + esc(g.naam) + '">' + lijst.map(t => '<option value="' + t.id + '">' + esc(t.naam) + '</option>').join('') + '</optgroup>' : '';
    }).join('');
    document.querySelectorAll('#aantal-tools,[data-aantal-tools]').forEach(el => { el.textContent = RT.tools.length; });
  }

  function veldHTML(f, ruw) {
    const id = 'v-' + f.k;
    let inp;
    if (f.s === 'keuze') {
      inp = '<select id="' + id + '" data-k="' + f.k + '">' + f.opties.map(o => '<option value="' + esc(o[0]) + '"' + (o[0] === ruw ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
    } else if (f.s === 'datum') {
      inp = '<input type="date" id="' + id + '" data-k="' + f.k + '" value="' + esc(ruw) + '">';
    } else if (f.s === 'tekst') {
      inp = f.regels
        ? '<textarea id="' + id + '" data-k="' + f.k + '" rows="' + f.regels + '">' + esc(ruw) + '</textarea>'
        : '<input type="text" autocomplete="off" id="' + id + '" data-k="' + f.k + '" value="' + esc(ruw) + '">';
    } else {
      const mode = f.s === 'eur' ? 'numeric' : 'decimal';
      const el = '<input type="text" inputmode="' + mode + '" autocomplete="off" id="' + id + '" data-k="' + f.k + '" value="' + esc(ruw) + '">';
      if (f.s === 'eur' || f.s === 'bedrag') inp = '<div class="met v' + (f.na ? ' n lang' : '') + '"><span class="voor">€</span>' + el + (f.na ? '<span class="na">' + esc(f.na) + '</span>' : '') + '</div>';
      else if (f.s === 'pct') inp = '<div class="met n">' + el + '<span class="na">%</span></div>';
      else if (f.na) inp = '<div class="met n lang">' + el + '<span class="na">' + esc(f.na) + '</span></div>';
      else inp = el;
    }
    return '<div class="veld' + (f.breed ? ' breed' : '') + '" data-veld="' + f.k + '"><label for="' + id + '">' + esc(f.l) + '</label>' + inp +
      (f.tip ? '<span class="tip">' + esc(f.tip) + '</span>' : '') + '</div>';
  }

  function toon(id, vanuitHash, params) {
    if (!actief && !vanuitHash) { try { history.pushState(null, '', '#' + id); } catch (e) { /* geen history */ } }
    actief = RT.get(id) || RT.tools[0];
    if (params) zetInvoerUitHash(actief, params);
    const ruw = invoerVan(actief);
    const g = groepVan(actief.groep);
    $('werk').innerHTML =
      '<a class="naar-overzicht" href="#">&larr; Alle ' + RT.tools.length + ' rekenhulpen</a>' +
      '<div class="paneel-kop"><div><div class="groep">' + esc(g.naam) + '</div><h2>' + esc(actief.naam) + '</h2><p>' + esc(actief.intro) + '</p>' + badges(actief) + '</div>' +
      '<div class="knoppen"><button type="button" class="knop licht" id="herstel">Voorbeeld herstellen</button><button type="button" class="knop" id="print">Printen / PDF</button></div></div>' +
      '<div class="werkblad"><form class="invoer" id="invoer" autocomplete="off" onsubmit="return false">' + actief.velden.map(f => veldHTML(f, ruw[f.k])).join('') + '</form>' +
      '<div class="uitkomstkolom"><div class="uitkomst" id="uitkomst"></div>' +
      '<div class="deel"><button type="button" class="knop licht" id="kopieer-dossier">Kopieer als dossiertekst</button>' +
      '<button type="button" class="knop licht" id="kopieer-link">Kopieer link naar deze berekening</button>' +
      '<span class="deel-status" id="deel-status" role="status" aria-live="polite"></span></div>' +
      '<div class="deel-handmatig" id="deel-handmatig" hidden><label for="deel-tekst">Kopiëren lukte niet automatisch. Selecteer de tekst en kopieer met Ctrl+C of Cmd+C.</label>' +
      '<textarea id="deel-tekst" rows="8" readonly></textarea></div></div></div>' +
      '<div id="tabel"></div>' +
      '<div class="toelichting"><div class="blok regel"><h4>Zo wordt gerekend</h4><p>' + (actief.uitleg || '') + '</p></div>' +
      '<div class="blok let-op"><h4>Let op</h4><p>' + (actief.letop || '') + '</p></div></div>';
    document.querySelectorAll('#menulijst button').forEach(b => b.setAttribute('aria-current', b.dataset.id === actief.id ? 'true' : 'false'));
    const open = document.querySelector('#menulijst .mgroep[data-g="' + actief.groep + '"]');
    if (open && !$('zoek').value.trim()) open.open = true;
    $('kies').value = actief.id;
    document.title = actief.naam + ' – Rekenhulpen – Adviesforum';
    reken();
  }

  function zichtbaarheid(v) {
    actief.velden.forEach(f => {
      const el = document.querySelector('[data-veld="' + f.k + '"]');
      if (el) el.classList.toggle('verborgen', !!f.als && !f.als(v));
    });
  }

  const tabelHTML = tb => (tb.titel ? '<h3 class="tabeltitel">' + esc(tb.titel) + '</h3>' : '') +
    '<div class="tabelvak"><table><thead><tr>' + tb.kop.map(h => '<th>' + esc(h) + '</th>').join('') +
    '</tr></thead><tbody>' + tb.rijen.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const alleTabellen = res => (res.tabel ? [res.tabel] : []).concat(res.tabellen || []);

  function reken() {
    const v = waardenVan(actief);
    zichtbaarheid(v);
    const nodig = actief.velden.filter(f => (!f.als || f.als(v)) && f.s !== 'keuze' && f.s !== 'tekst');
    const leeg = nodig.filter(f => f.s === 'datum' ? !v[f.k] : Number.isNaN(v[f.k]));
    let res;
    if (leeg.length) res = { fout: 'Vul ' + leeg.map(f => '“' + f.l.toLowerCase() + '”').join(', ') + ' in.' };
    else {
      try { res = actief.bereken(v) || { fout: 'Geen uitkomst.' }; } catch (e) { res = { fout: 'Deze combinatie van gegevens kan niet worden berekend.' }; if (w.console) console.warn(actief.id, e); }
    }
    laatste = res;
    werkHash();
    const box = $('uitkomst');
    if (res.fout) {
      box.innerHTML = '<div class="lbl">Uitkomst</div><div class="groot" style="font-size:20px">Nog geen uitkomst</div><div class="signaal"><p>' + res.fout + '</p></div>';
      $('tabel').innerHTML = '';
      return;
    }
    box.innerHTML = '<div class="lbl">' + esc(res.lbl) + '</div><div class="groot" id="hoofduitkomst">' + esc(res.groot) + '</div>' +
      (res.onder ? '<div class="onder">' + esc(res.onder) + '</div>' : '') +
      (res.rijen && res.rijen.length ? '<dl>' + res.rijen.map(r => '<div' + (r[2] ? ' class="' + r[2] + '"' : '') + '><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>').join('') + '</dl>' : '') +
      (res.signalen && res.signalen.length ? '<div class="signaal">' + res.signalen.map(s => '<p>' + s + '</p>').join('') + '</div>' : '');
    $('tabel').innerHTML = alleTabellen(res).map(tabelHTML).join('');
  }

  /* ---------- invoer leesbaar (print en dossiertekst) ---------- */
  const invoerLijst = t => {
    const v = waardenVan(t), ruw = invoerVan(t);
    return t.velden.filter(f => !f.als || f.als(v)).map(f => {
      let x = ruw[f.k] == null ? '' : String(ruw[f.k]);
      if (f.s === 'keuze') x = (f.opties.find(o => o[0] === x) || ['', x])[1];
      else if (x.trim() === '') x = '';
      else if (f.s === 'eur' || f.s === 'bedrag') x = '€ ' + x + (f.na ? ' ' + f.na : '');
      else if (f.s === 'pct') x = x + '%';
      else if (f.s === 'datum') x = v[f.k] ? fmt.datum(v[f.k]) : '';
      else if (f.na) x = x + ' ' + f.na;
      return [f.l, x];
    });
  };
  const platteTekst = html => {
    const s = String(html || '');
    let t;
    if (typeof DOMParser !== 'undefined') t = new DOMParser().parseFromString('<body>' + s + '</body>', 'text/html').body.textContent;
    else t = s.replace(/<[^>]+>/g, '');
    return t.replace(/\s+/g, ' ').trim();
  };
  const kort = (s, max = 420) => {
    if (s.length <= max) return s;
    const snede = s.slice(0, max), punt = snede.lastIndexOf('. ');
    return punt > max * 0.5 ? snede.slice(0, punt + 1) : snede.replace(/\s+\S*$/, '') + ' …';
  };

  /* ---------- dossiertekst (platte tekst voor klantdossier of adviesrapport) ---------- */
  RT.dossiertekst = function () {
    if (!actief) return '';
    const t = actief, res = laatste || {}, r = [];
    r.push(t.naam);
    r.push('Adviesforum rekenhulp · berekend op ' + fmt.datum(new Date()));
    r.push('');
    r.push('Invoer');
    invoerLijst(t).forEach(([l, x]) => r.push('- ' + l + ': ' + (x || '(niet ingevuld)')));
    r.push('');
    r.push('Uitkomst');
    if (res.fout) r.push(platteTekst(res.fout));
    else {
      r.push(res.lbl + ': ' + res.groot + (res.onder ? ' (' + res.onder + ')' : ''));
      (res.rijen || []).forEach(x => r.push('- ' + x[0] + ': ' + x[1]));
      (res.signalen || []).forEach(x => r.push('! ' + platteTekst(x)));
      const tb = alleTabellen(res);
      if (tb.length) r.push('(' + (tb.length === 1 ? 'Tabel ' + (tb[0].titel ? '“' + tb[0].titel + '” ' : '') : tb.length + ' tabellen ') + 'niet opgenomen; zie de link.)');
    }
    const uitleg = platteTekst(t.uitleg), letop = platteTekst(t.letop);
    if (uitleg || letop) r.push('');
    if (uitleg) r.push('Aannames: ' + kort(uitleg));
    if (letop) r.push('Let op: ' + kort(letop));
    const normen = [];
    if (t.peildatum) normen.push(String(t.peildatum));
    if (t.fiscaal) normen.push('fiscale norm: controleer de actuele waarden' + (Array.isArray(t.fiscaal) ? ' (' + t.fiscaal.join(', ') + ')' : ''));
    if (normen.length) r.push('Normjaar/peildatum: ' + normen.join('; '));
    r.push('');
    r.push('Indicatieve berekening, geen advies en geen toets aan leennormen of productvoorwaarden.');
    r.push('Berekening: ' + linkNaar(t));
    return r.join('\n');
  };

  /* ---------- kopiëren met terugval ---------- */
  function meld(tekst) {
    const st = $('deel-status');
    if (!st) return;
    st.textContent = tekst;
    clearTimeout(meld.t);
    meld.t = setTimeout(() => { if (st.isConnected) st.textContent = ''; }, 4000);
  }
  function kopieer(tekst, wat) {
    const handmatig = () => {
      const vak = $('deel-handmatig'), ta = $('deel-tekst');
      if (vak && ta) { vak.hidden = false; ta.value = tekst; ta.focus(); ta.select(); meld('Selecteer de tekst hieronder om te kopiëren.'); return; }
      try { w.prompt('Kopieer de tekst:', tekst); } catch (e) { /* geen prompt */ }
    };
    const viaCommand = () => {
      let ok = false;
      try {
        const ta = document.createElement('textarea');
        ta.value = tekst; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand && document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { ok = false; }
      if (ok) { meld(wat + ' gekopieerd.'); const vak = $('deel-handmatig'); if (vak) vak.hidden = true; }
      else handmatig();
    };
    if (w.navigator && navigator.clipboard && navigator.clipboard.writeText && w.isSecureContext !== false) {
      navigator.clipboard.writeText(tekst).then(() => { meld(wat + ' gekopieerd.'); const vak = $('deel-handmatig'); if (vak) vak.hidden = true; }, viaCommand);
    } else viaCommand();
  }

  /* ---------- afdrukken in een eigen venster ---------- */
  function afdrukken() {
    const res = laatste || {};
    const invoerRijen = invoerLijst(actief).map(([l, x]) => '<tr><td>' + esc(l) + '</td><td class="r">' + esc(x) + '</td></tr>').join('');
    const uit = res.fout ? '<p>' + res.fout + '</p>' :
      '<p class="kern">' + esc(res.lbl) + ': <b>' + esc(res.groot) + '</b>' + (res.onder ? ' <span>(' + esc(res.onder) + ')</span>' : '') + '</p>' +
      '<table>' + (res.rijen || []).map(r => '<tr><td>' + esc(r[0]) + '</td><td class="r">' + esc(r[1]) + '</td></tr>').join('') + '</table>' +
      (res.signalen && res.signalen.length ? '<div class="sig">' + res.signalen.map(s => '<p>' + s + '</p>').join('') + '</div>' : '') +
      alleTabellen(res).map(tb => '<h2>' + esc(tb.titel || 'Verloop') + '</h2><table class="lijst"><tr>' + tb.kop.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr>' +
        tb.rijen.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table>').join('');
    const extra = [actief.peildatum ? 'normen ' + actief.peildatum : '', actief.fiscaal ? 'fiscale normen: controleer de actuele waarden' : ''].filter(Boolean).join(' · ');
    const nu = new Date();
    const html = '<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><title>' + esc(actief.naam) + ' – Adviesforum</title><style>' +
      'body{font-family:Arial,Helvetica,sans-serif;color:#141414;margin:28px;font-size:13px;line-height:1.5}' +
      'h1{font-size:21px;margin:0 0 4px;border-bottom:4px solid #FFD200;padding-bottom:6px}h2{font-size:14px;margin:18px 0 6px;text-transform:uppercase;letter-spacing:.05em}' +
      '.meta{color:#5E5E5E;font-size:11.5px;margin-bottom:10px}table{border-collapse:collapse;width:100%;max-width:640px}td,th{padding:4px 6px;border-bottom:1px solid #ddd;text-align:left}' +
      '.r{text-align:right}.lijst td,.lijst th{text-align:right}.lijst td:first-child,.lijst th:first-child{text-align:left}th{background:#FFD200}' +
      '.kern{font-size:15px}.sig{background:#FFF6C7;padding:6px 10px;margin-top:8px}.sig p,.blok p{margin:3px 0}.blok{margin-top:10px;padding:6px 10px;border-left:3px solid #141414;background:#F7F7F5}' +
      '.disc{margin-top:18px;font-size:11px;color:#5E5E5E;border-top:1px solid #ddd;padding-top:8px}a{color:#141414}</style></head><body>' +
      '<h1>' + esc(actief.naam) + '</h1><div class="meta">Adviesforum · rekenhulp · afgedrukt op ' + esc(fmt.datum(nu)) + (extra ? ' · ' + esc(extra) : '') + '</div>' +
      '<h2>Invoer</h2><table>' + invoerRijen + '</table><h2>Uitkomst</h2>' + uit +
      '<div class="blok"><b>Zo wordt gerekend:</b> <p>' + (actief.uitleg || '') + '</p></div><div class="blok"><b>Let op:</b> <p>' + (actief.letop || '') + '</p></div>' +
      '<p class="disc">Berekening online: <a href="' + esc(linkNaar(actief)) + '">' + esc(linkNaar(actief)) + '</a><br>Indicatieve berekening, geen advies en geen toets aan leennormen of productvoorwaarden. Controleer de actuele wet- en regelgeving en de voorwaarden van de geldverstrekker of verzekeraar.</p></body></html>';
    let venster = null;
    try { venster = w.open('', '_blank'); } catch (e) { venster = null; }
    if (!venster) { w.print(); return; }
    venster.document.open(); venster.document.write(html); venster.document.close(); venster.focus();
    setTimeout(() => { try { venster.print(); } catch (e) { /* venster gesloten */ } }, 300);
  }

  /* ---------- zoeken ---------- */
  const normaal = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function filter(q) {
    const woorden = normaal(q.trim()).split(/\s+/).filter(Boolean);
    let zicht = 0;
    document.querySelectorAll('#menulijst .mgroep').forEach(g => {
      let n = 0;
      g.querySelectorAll('button').forEach(b => {
        const t = RT.get(b.dataset.id);
        const hooi = normaal(t.naam + ' ' + t.intro + ' ' + (t.kw || ''));
        const hit = woorden.every(x => hooi.includes(x));
        b.style.display = hit ? '' : 'none'; if (hit) n++;
      });
      g.style.display = n ? '' : 'none'; zicht += n;
      if (woorden.length) g.open = n > 0;
      else g.open = g.dataset.g === (actief && actief.groep);
    });
    $('menuleeg').style.display = zicht ? 'none' : 'block';
  }

  /* ---------- startscherm: overzicht ---------- */
  // Kerntools voor adviseurs; ids die (nog) niet bestaan worden overgeslagen
  RT.POPULAIR = ['renteherziening', 'offertes', 'rentemix', 'maximaal-krediet', 'box3-heffing', 'bruto-netto-salaris', 'lijfrente-jaarruimte', 'erfbelasting'];
  const tegel = t => '<a class="ov-tegel" href="#' + esc(t.id) + '" data-id="' + esc(t.id) + '"><b>' + esc(t.naam) + '</b><span>' + esc(t.intro) + '</span></a>';
  function overzichtLijst(q, groep) {
    const doel = $('ov-lijst');
    if (!doel) return;
    const woorden = normaal(String(q || '').trim()).split(/\s+/).filter(Boolean);
    let lijst, kop;
    if (woorden.length) {
      lijst = RT.tools.filter(t => { const hooi = normaal(t.naam + ' ' + t.intro + ' ' + (t.kw || '')); return woorden.every(x => hooi.includes(x)); });
      kop = lijst.length + (lijst.length === 1 ? ' rekenhulp gevonden' : ' rekenhulpen gevonden');
    } else if (groep) {
      const g = groepVan(groep);
      lijst = RT.tools.filter(t => t.groep === groep);
      kop = g.naam + ' (' + lijst.length + ')';
    } else { doel.innerHTML = ''; $('ov-standaard').hidden = false; return; }
    $('ov-standaard').hidden = true;
    doel.innerHTML = '<div class="ov-lijstkop"><h3>' + esc(kop) + '</h3><button type="button" class="knop licht" id="ov-terug">Terug naar het overzicht</button></div>' +
      (lijst.length ? '<div class="ov-tegels">' + lijst.map(tegel).join('') + '</div>' : '<p class="ov-leeg">Niets gevonden. Probeer een ander woord, bijvoorbeeld “rente”, “box 3” of “netto”.</p>');
  }
  function overzicht() {
    actief = null; laatste = null;
    const n = RT.tools.length;
    const pop = RT.POPULAIR.map(RT.get).filter(Boolean);
    $('werk').innerHTML =
      '<div class="ov" id="overzicht">' +
      '<div class="paneel-kop ov-kop"><div><div class="groep">Overzicht</div><h2 id="ov-titel"><span data-aantal-tools>' + n + '</span> rekenhulpen</h2>' +
      '<p>Zoek een rekenhulp, begin bij de meest gebruikte of blader per onderwerp. Elke berekening kun je als dossiertekst of als link kopiëren.</p></div></div>' +
      '<div class="veld ov-zoekveld"><label for="ov-zoek">Zoek in alle rekenhulpen</label><input type="search" id="ov-zoek" placeholder="Bijvoorbeeld: renteherziening, box 3, jaarruimte" autocomplete="off"></div>' +
      '<div id="ov-lijst" aria-live="polite"></div>' +
      '<div id="ov-standaard">' +
      (pop.length ? '<h3 class="ov-sub">Populair</h3><div class="ov-tegels ov-pop">' + pop.map(tegel).join('') + '</div>' : '') +
      '<h3 class="ov-sub">Per onderwerp</h3><div class="ov-groepen">' + RT.GROEPEN.map(g => {
        const aantal = RT.tools.filter(t => t.groep === g.id).length;
        return aantal ? '<button type="button" class="ov-groep" data-groep="' + g.id + '"><b>' + esc(g.naam) + '</b><span>' + aantal + (aantal === 1 ? ' rekenhulp' : ' rekenhulpen') + '</span></button>' : '';
      }).join('') + '</div>' +
      (RT.get('fiscale-normen') ? '<p class="ov-normen">Welke belastingtarieven en grensbedragen de hulpen gebruiken, staat in <a href="#fiscale-normen">Gebruikte fiscale normen</a>.</p>' : '') +
      '</div></div>';
    document.querySelectorAll('#menulijst button').forEach(b => b.setAttribute('aria-current', 'false'));
    if (!$('zoek').value.trim()) document.querySelectorAll('#menulijst .mgroep').forEach(g => { g.open = false; });
    $('kies').value = '';
    document.title = 'Rekenhulpen – Adviesforum';
  }

  /* ---------- start ---------- */
  RT.start = function () {
    if (!RT.tools.length) return;
    $('werk').addEventListener('input', e => {
      if (e.target.id === 'ov-zoek') { overzichtLijst(e.target.value); return; }
      const el = e.target, k = el.dataset && el.dataset.k;
      if (!k) return;
      if (!actief) return;
      const f = actief.velden.find(x => x.k === k);
      if (!f) return;
      if (f.s === 'eur') { const c = el.value.replace(/\D/g, ''); el.value = c ? geheel.format(parseInt(c, 10)) : ''; }
      else if (f.s === 'pct' || f.s === 'num') { el.value = el.value.replace(/[^\d,.\-]/g, ''); }
      else if (f.s === 'bedrag') { el.value = el.value.replace(/[^\d,.\-]/g, ''); }
      invoerVan(actief)[k] = el.value;
      reken();
    });
    $('werk').addEventListener('change', e => {
      const el = e.target, k = el.dataset && el.dataset.k;
      if (!k || !actief) return;
      if (el.tagName === 'SELECT' || el.type === 'date') { invoerVan(actief)[k] = el.value; reken(); return; }
      const f = actief.velden.find(x => x.k === k);
      if (f && f.s === 'bedrag') { // na verlaten van het veld netjes opmaken: 1.234,5 -> 1.234,50
        const x = lees.getal(el.value);
        if (Number.isFinite(x)) { el.value = nf(Number.isInteger(x) ? 0 : 2).format(x); invoerVan(actief)[k] = el.value; reken(); }
      }
    });
    $('werk').addEventListener('click', e => {
      const id = e.target.id;
      if (!actief) {
        const g = e.target.closest('.ov-groep');
        if (g) { overzichtLijst('', g.dataset.groep); $('ov-lijst').scrollIntoView({ block: 'nearest' }); }
        if (id === 'ov-terug') { $('ov-zoek').value = ''; overzichtLijst(''); }
        return;
      }
      if (id === 'print') afdrukken();
      if (id === 'herstel') { delete opslag[actief.id]; toon(actief.id); }
      if (id === 'kopieer-dossier') kopieer(RT.dossiertekst(), 'Dossiertekst');
      if (id === 'kopieer-link') { werkHash(); kopieer(linkNaar(actief), 'Link'); }
    });
    $('menulijst').addEventListener('click', e => {
      const b = e.target.closest('button[data-id]');
      if (b) { toon(b.dataset.id); if (w.innerWidth > 900) $('werk').scrollIntoView({ block: 'nearest' }); }
    });
    $('kies').addEventListener('change', e => {
      if (e.target.value) toon(e.target.value);
      else { try { history.pushState(null, '', location.pathname + location.search); } catch (x) { /* geen history */ } overzicht(); }
    });
    $('zoek').addEventListener('input', e => filter(e.target.value));
    const volgHash = () => {
      const h = leesHash(location.hash);
      if (!RT.get(h.id)) { if (actief) overzicht(); return; }
      if (actief && h.id === actief.id && (!h.heeftParams || location.hash.slice(1) === RT.hashVan(actief))) return;
      toon(h.id, true, h.heeftParams ? h.params : null);
    };
    w.addEventListener('hashchange', volgHash);
    w.addEventListener('popstate', volgHash);
    bouwMenu();
    const h = leesHash(location.hash);
    if (RT.get(h.id)) toon(h.id, true, h.heeftParams ? h.params : null);
    else overzicht();
  };
})(typeof window !== 'undefined' ? window : globalThis);
