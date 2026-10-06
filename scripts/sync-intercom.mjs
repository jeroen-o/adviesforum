#!/usr/bin/env node
/* Adviesforum -> Intercom kennisbank-sync
 *
 * Zet de kennisbankartikelen en veelgestelde vragen uit data/ om in native
 * Intercom-artikelen, zodat Fin ze als bron gebruikt met een echte
 * bronvermelding in plaats van een gecrawlde webpagina.
 *
 * Compliance-sleutel: alleen artikelen met gecontroleerd:true worden
 * gepubliceerd en voor Fin beschikbaar gesteld. Al het andere gaat als
 * concept (draft) naar Intercom en wordt door Fin niet gebruikt.
 *
 * Gebruik:
 *   node scripts/sync-intercom.mjs --bootstrap   toont admins, helpcenters en collections
 *   node scripts/sync-intercom.mjs --dry-run     laat zien wat er zou gebeuren
 *   node scripts/sync-intercom.mjs               synchroniseert echt
 *
 * Omgeving:
 *   INTERCOM_TOKEN       verplicht, access token van de Intercom-app
 *   INTERCOM_REGION      eu (standaard) | us | au
 *   INTERCOM_VERSION     API-versie (standaard 2.14)
 *   SITE_BASE            canonieke basis-URL (standaard https://jeroen-o.github.io/adviesforum)
 *
 * Configuratie: scripts/intercom-sync.config.json (zie --bootstrap)
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'scripts', 'intercom-sync.config.json');
const EXAMPLE_PATH = path.join(ROOT, 'scripts', 'intercom-sync.config.example.json');
const MAP_PATH = path.join(ROOT, 'data', 'intercom-map.json');

const TOKEN = process.env.INTERCOM_TOKEN;
const REGION = (process.env.INTERCOM_REGION || 'eu').toLowerCase();
const VERSION = process.env.INTERCOM_VERSION || '2.14';
const SITE_BASE = (process.env.SITE_BASE || 'https://jeroen-o.github.io/adviesforum').replace(/\/$/, '');

const BASE = { eu: 'https://api.eu.intercom.io', us: 'https://api.intercom.io', au: 'https://api.au.intercom.io' }[REGION];
if (!BASE) fail(`Onbekende INTERCOM_REGION: ${REGION}`);

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const BOOTSTRAP = args.has('--bootstrap');
const PREVIEW = [...args].find((a) => a.startsWith('--preview='))?.split('=')[1];

function fail(msg) { console.error(`\nFOUT: ${msg}\n`); process.exit(1); }
function log(...a) { console.log(...a); }

/* ---------------------------------------------------------------- Intercom */

let budget = { remaining: Infinity, reset: 0 };

async function api(method, pathname, body) {
  if (!TOKEN) fail('INTERCOM_TOKEN ontbreekt.');
  if (budget.remaining <= 5) {
    const wait = Math.max(0, budget.reset * 1000 - Date.now()) + 500;
    if (wait > 0) { log(`  rate limit bijna bereikt, ${Math.round(wait / 1000)}s wachten`); await sleep(wait); }
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${BASE}${pathname}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Intercom-Version': VERSION,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const rem = res.headers.get('x-ratelimit-remaining');
    const rst = res.headers.get('x-ratelimit-reset');
    if (rem !== null) budget = { remaining: Number(rem), reset: Number(rst || 0) };

    if (res.status === 429 || res.status >= 500) {
      const wait = 2000 * 2 ** attempt;
      log(`  ${res.status} van Intercom, opnieuw over ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    const text = await res.text();
    if (!res.ok) throw new Error(`${method} ${pathname} -> ${res.status} ${text.slice(0, 500)}`);
    return text ? JSON.parse(text) : {};
  }
  throw new Error(`${method} ${pathname} bleef falen na 5 pogingen`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* De velden ai_chatbot_availability / ai_copilot_availability bestaan niet in
 * elke API-versie. Weigert Intercom ze, dan sturen we het artikel opnieuw
 * zonder die velden. Concepten blijven dan nog steeds buiten Fin, want die
 * staan op state 'draft'. */
let aiVeldenUit = false;

function zonderAiVelden(body) {
  const { ai_chatbot_availability, ai_copilot_availability, ai_sales_agent_availability, ...rest } = body;
  return rest;
}

async function schrijfArtikel(method, pathname, body) {
  if (aiVeldenUit) return api(method, pathname, zonderAiVelden(body));
  try {
    return await api(method, pathname, body);
  } catch (e) {
    const is400 = /-> 400\b/.test(e.message);
    const overAiVeld = /ai_(chatbot|copilot|sales_agent)_availability/.test(e.message);
    if (!is400 || !overAiVeld) throw e;
    aiVeldenUit = true;
    log('  let op: deze API-versie kent ai_chatbot_availability niet; verder zonder dat veld.');
    log('  concepten blijven buiten Fin via state draft.');
    return api(method, pathname, zonderAiVelden(body));
  }
}

/* ------------------------------------------------------------- Data inlezen */

/* De datafiles zijn browserscripts die window.KENNISBANK en window.FAQ vullen.
 * We voeren ze uit tegen een leeg nep-window. Geen eval van externe input:
 * dit zijn bestanden uit deze repository. */
async function loadData() {
  const win = {};
  const dataDir = path.join(ROOT, 'data');
  const all = await readdir(dataDir);

  const kbFiles = ['kennisbank.js', ...all.filter((f) => /^kennisbank-.*\.js$/.test(f)).sort()];
  const faqDir = path.join(dataDir, 'faq');
  const faqFiles = existsSync(faqDir) ? (await readdir(faqDir)).filter((f) => f.endsWith('.js')).sort() : [];

  for (const f of kbFiles) await run(path.join(dataDir, f));
  for (const f of faqFiles) await run(path.join(faqDir, f));

  async function run(file) {
    if (!existsSync(file)) return;
    const code = await readFile(file, 'utf8');
    try {
      new Function('window', `${code}\n;return window;`)(win);
    } catch (e) {
      fail(`${path.relative(ROOT, file)} kon niet worden gelezen: ${e.message}`);
    }
  }

  const adviseurs = {};
  const advFile = path.join(dataDir, 'adviseurs.js');
  if (existsSync(advFile)) {
    const w2 = {};
    new Function('window', `${await readFile(advFile, 'utf8')}\n;return window;`)(w2);
    for (const a of w2.ADVISEURS || []) adviseurs[a.id] = a;
  }

  return {
    kennisbank: win.KENNISBANK || [],
    faq: win.FAQ || [],
    adviseurs,
  };
}

/* ------------------------------------------------------- Opmaak naar HTML */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(s) {
  return esc(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])`([^`]+)`/g, '$1<code>$2</code>');
}

/* Opmaak van het veld body: '## ' kop, '- ' opsomming, '1. ' genummerd,
 * lege regel = nieuwe alinea. Zie de kop van data/kennisbank.js. */
function bodyToHtml(body) {
  const out = [];
  let list = null; // 'ul' | 'ol'
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const raw of String(body).split('\n')) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }

    if (line.startsWith('### ')) { closeList(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith('## ')) { closeList(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (ol) {
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return out.join('\n');
}

const NL = (d) => {
  if (!d) return null;
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : String(d);
};

function footer(item, kind, url) {
  const bits = [];
  if (kind === 'kennisbank') {
    if (item.peildatum) bits.push(`Peildatum: ${NL(item.peildatum)}`);
    if (item.gecontroleerd) {
      bits.push(`Door compliance goedgekeurd${item.gecontroleerdOp ? ` op ${NL(item.gecontroleerdOp)}` : ''}`);
    } else {
      bits.push('Concept: niet door compliance gecontroleerd');
    }
    if (item.herzienVoor) bits.push(`Te herzien voor: ${NL(item.herzienVoor)}`);
  }
  const links = (item.links || []).filter((l) => l && l.url);
  const html = [];
  html.push('<hr>');
  if (links.length) {
    html.push('<p><strong>Bronnen</strong></p><ul>');
    for (const l of links) html.push(`<li><a href="${esc(l.url)}">${esc(l.titel || l.url)}</a></li>`);
    html.push('</ul>');
  }
  html.push(`<p><small>${bits.map(esc).join(' &middot; ')}</small></p>`);
  html.push(`<p><small>Bron: <a href="${esc(url)}">${esc(url)}</a>. Informatief voor financieel adviseurs; de adviseur blijft verantwoordelijk voor het advies aan de klant.</small></p>`);
  return html.join('\n');
}

function excerpt(body, n = 150) {
  const flat = String(body).replace(/\s+/g, ' ').replace(/^#+\s*/, '').trim();
  return flat.length > n ? `${flat.slice(0, n - 1).trimEnd()}…` : flat;
}

/* -------------------------------------------------------- Artikelen bouwen */

function buildArticles(data, config) {
  const items = [];
  const include = config.include || ['kennisbank'];

  for (const a of include.includes('kennisbank') ? data.kennisbank : []) {
    if (!a || !a.id || !a.titel) continue;
    if (config.skipIds?.includes(a.id)) continue;
    const url = `${SITE_BASE}/kennisbank/${a.id}.html`;
    const approved = a.gecontroleerd === true;
    items.push({
      key: `kb:${a.id}`,
      kind: 'kennisbank',
      sourceId: a.id,
      approved,
      payload: {
        title: a.titel,
        description: excerpt(a.body),
        body: `${bodyToHtml(a.body)}\n${footer(a, 'kennisbank', url)}`,
        author_id: config.authorId,
        state: approved ? 'published' : 'draft',
        parent_id: collectionVoor(config, a.cat),
        parent_type: collectionVoor(config, a.cat) ? 'collection' : undefined,
        ai_chatbot_availability: approved,
      },
    });
  }

  const faqApproved = config.publishFaq === true;
  for (const q of include.includes('faq') ? data.faq : []) {
    if (!q || !q.id || !q.vraag) continue;
    if (config.skipIds?.includes(q.id)) continue;
    const url = `${SITE_BASE}/faq/`;
    items.push({
      key: `faq:${q.id}`,
      kind: 'faq',
      sourceId: q.id,
      approved: faqApproved,
      payload: {
        title: q.vraag,
        description: excerpt(q.antwoord),
        body: `${bodyToHtml(q.antwoord)}\n${footer(q, 'faq', url)}`,
        author_id: config.authorId,
        state: faqApproved ? 'published' : 'draft',
        parent_id: collectionVoor(config, 'faq'),
        parent_type: collectionVoor(config, 'faq') ? 'collection' : undefined,
        ai_chatbot_availability: faqApproved,
      },
    });
  }

  return items;
}

/* Collection-id 0 of leeg betekent: niet ingesteld. */
function collectionVoor(config, cat) {
  const c = config.collections || {};
  return c[cat] || c.default || undefined;
}

const hashOf = (payload) => createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16);

/* ----------------------------------------------------------------- Bootstrap */

async function bootstrap() {
  log(`Regio: ${REGION} (${BASE}), API-versie ${VERSION}\n`);
  const admins = await api('GET', '/admins');
  /* Geen e-mailadressen loggen: deze uitvoer kan in een openbare Actions-log staan. In GitHub Actions ook geen
   * namen van alle medewerkers: dan alleen de admins waarvan de naam BOOTSTRAP_ADMIN bevat. */
  const lijst = admins.admins || [];
  const inActions = process.env.GITHUB_ACTIONS === 'true';
  const filter = (process.env.BOOTSTRAP_ADMIN || '').trim().toLowerCase();
  if (inActions && !filter) {
    log(`Admins: ${lijst.length} gevonden. Namen worden in GitHub Actions niet getoond; vul bij Run workflow het veld admin in (deel van je naam).`);
  } else {
    log('Admins (gebruik een van deze ids als authorId):');
    for (const a of lijst.filter((a) => !filter || String(a.name || '').toLowerCase().includes(filter))) log(`  ${a.id}  ${a.name}`);
  }

  const hcs = await api('GET', '/help_center/help_centers');
  log('\nHelp centers:');
  const hcNaam = {};
  for (const h of hcs.data || []) { hcNaam[h.id] = h.identifier || ''; log(`  ${h.id}  ${h.identifier || ''} ${h.website_turned_on ? '(live)' : ''}`); }

  /* Collections komen per pagina (max 100); alle pagina's ophalen. */
  const alleCols = [];
  for (let pagina = 1; pagina <= 50; pagina++) {
    const res = await api('GET', `/help_center/collections?per_page=100&page=${pagina}`);
    alleCols.push(...(res.data || []));
    const totaal = res.pages?.total_pages || 1;
    if (!(res.data || []).length || pagina >= totaal) break;
  }
  log(`\nCollections (${alleCols.length}; gebruik deze ids in collections):`);
  for (const c of alleCols) {
    const hc = c.help_center_id ? `  [help center ${c.help_center_id}${hcNaam[c.help_center_id] ? ' ' + hcNaam[c.help_center_id] : ''}]` : '';
    log(`  ${c.id}  ${c.name}${c.parent_id ? ` (onder ${c.parent_id})` : ''}${hc}`);
  }

  log('\nZet deze waarden in scripts/intercom-sync.config.json, bijvoorbeeld:');
  log(JSON.stringify({
    authorId: 123456,
    include: ['kennisbank'],
    publishFaq: false,
    collections: { default: 111, hyp: 111, verz: 112, fisc: 113, comp: 114, faq: 115 },
    skipIds: [],
  }, null, 2));
}

/* --------------------------------------------------------------------- Main */

async function main() {
  if (BOOTSTRAP) return bootstrap();

  /* Een proefrun (ook in een pull request) werkt zonder eigen configuratie: dan geldt het voorbeeld. */
  let configPath = CONFIG_PATH;
  if (!existsSync(configPath) && (DRY || PREVIEW) && existsSync(EXAMPLE_PATH)) {
    configPath = EXAMPLE_PATH;
    console.error(`Let op: ${path.relative(ROOT, CONFIG_PATH)} ontbreekt; proefrun met ${path.relative(ROOT, EXAMPLE_PATH)}.`);
  }
  const config = existsSync(configPath) ? JSON.parse(await readFile(configPath, 'utf8')) : null;
  if (!config) fail(`${path.relative(ROOT, CONFIG_PATH)} ontbreekt. Draai eerst: node scripts/sync-intercom.mjs --bootstrap`);
  if (!config.authorId && !DRY && !PREVIEW) fail('authorId ontbreekt in de configuratie (een Intercom admin id).');

  const data = await loadData();
  const items = buildArticles(data, config);

  if (PREVIEW) {
    const item = items.find((i) => i.key === PREVIEW);
    if (!item) fail(`Geen item met key ${PREVIEW}. Voorbeelden: ${items.slice(0, 3).map((i) => i.key).join(', ')}`);
    log(JSON.stringify(item.payload, null, 2));
    return;
  }
  const map = existsSync(MAP_PATH) ? JSON.parse(await readFile(MAP_PATH, 'utf8')) : {};

  const published = items.filter((i) => i.approved).length;
  log(`Kennisbank: ${data.kennisbank.length} artikelen, FAQ: ${data.faq.length} vragen`);
  log(`Meegenomen: ${(config.include || ['kennisbank']).join(', ')}`);
  log(`Te synchroniseren: ${items.length}, waarvan ${published} gepubliceerd en ${items.length - published} als concept`);
  log(DRY ? 'Proefrun: er wordt niets naar Intercom gestuurd.\n' : '');

  let created = 0, updated = 0, unchanged = 0, retired = 0;
  const seen = new Set();

  for (const item of items) {
    seen.add(item.key);
    const hash = hashOf(item.payload);
    const known = map[item.key];

    if (known && known.hash === hash) { unchanged++; continue; }

    if (known?.articleId) {
      log(`~ bijwerken  ${item.key}  ${item.payload.state.padEnd(9)} ${item.payload.title.slice(0, 60)}`);
      if (!DRY) await schrijfArtikel('PUT', `/articles/${known.articleId}`, item.payload);
      map[item.key] = { articleId: known.articleId, hash, state: item.payload.state };
      updated++;
    } else {
      log(`+ nieuw      ${item.key}  ${item.payload.state.padEnd(9)} ${item.payload.title.slice(0, 60)}`);
      if (DRY) { map[item.key] = { articleId: null, hash, state: item.payload.state }; created++; continue; }
      const res = await schrijfArtikel('POST', '/articles', item.payload);
      map[item.key] = { articleId: res.id, hash, state: item.payload.state };
      created++;
    }
  }

  /* Verdwenen uit de repository: nooit verwijderen, wel terugzetten naar concept
   * zodat Fin ze niet meer gebruikt en de redactie ze in Intercom kan nalopen. */
  for (const [key, entry] of Object.entries(map)) {
    if (seen.has(key) || !entry.articleId || entry.state === 'draft') continue;
    log(`- intrekken  ${key}  staat niet meer in de repository, terug naar concept`);
    if (!DRY) await schrijfArtikel('PUT', `/articles/${entry.articleId}`, { state: 'draft', ai_chatbot_availability: false });
    map[key] = { ...entry, state: 'draft' };
    retired++;
  }

  if (!DRY) await writeFile(MAP_PATH, `${JSON.stringify(map, null, 1)}\n`);

  log(`\nKlaar. nieuw ${created}, bijgewerkt ${updated}, ongewijzigd ${unchanged}, ingetrokken ${retired}`);
  if (aiVeldenUit) log('De AI-beschikbaarheidsvelden zijn niet meegestuurd; controleer in Intercom of een concept inderdaad draft is.');
  if (DRY) log('Proefrun: data/intercom-map.json is niet weggeschreven.');
}

main().catch((e) => fail(e.stack || e.message));
