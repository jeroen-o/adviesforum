#!/usr/bin/env node
/*
 * MCP-server (stdio, alleen lezen) voor de regelgeving en normen van het Adviesforum.
 * Geen dependencies, geen build-stap: `node server.js`. Leest regelgeving.json van https://adviesforum.nl/regelgeving.json
 * (of een eigen bron via ADVIESFORUM_REGELGEVING, een URL of een bestandspad) en biedt drie hulpmiddelen:
 *   regelgeving_lijst   alle onderwerpen (id en naam)
 *   regelgeving_zoek    zoeken op een woord (bijvoorbeeld "NHG", "box 3", "WIA")
 *   regelgeving_get     één onderwerp met waarden, peildatum, controlestatus en bronnen
 * De server geeft geen advies: gebruik de bron en de status in het antwoord en controleer de officiële bron.
 */
'use strict';
const fs = require('fs');
const BRON = process.env.ADVIESFORUM_REGELGEVING || 'https://adviesforum.nl/regelgeving.json';
const VERSIE = '1.0.0';

async function laad() {
  const tekst = /^https?:/.test(BRON) ? await (await fetch(BRON, { headers: { 'user-agent': 'adviesforum-mcp/' + VERSIE } })).text() : fs.readFileSync(BRON, 'utf8');
  return JSON.parse(tekst);
}
const platte = o => JSON.stringify(o).toLowerCase();
const korte = (d, o) => ({ id: o.id, onderwerp: o.onderwerp, domein: o.domein, status: o.status });

const TOOLS = [
  { name: 'regelgeving_lijst', description: 'Lijst alle onderwerpen in de regelgeving en normen van het Adviesforum (NHG-grens, fiscale normen, sociale zekerheid).', inputSchema: { type: 'object', properties: {} } },
  { name: 'regelgeving_zoek', description: 'Zoek onderwerpen op een woord, bijvoorbeeld "NHG", "box 3", "overdrachtsbelasting", "WIA".', inputSchema: { type: 'object', properties: { zoekterm: { type: 'string' } }, required: ['zoekterm'] } },
  { name: 'regelgeving_get', description: 'Haal één onderwerp op met waarden, peildatum, controlestatus en bronnen (bijvoorbeeld id "nhg.grens-2026" of "fiscaal.box1").', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
];

async function roep(naam, args) {
  const d = await laad();
  if (naam === 'regelgeving_lijst') return { peildatum: d.peildatum, gecontroleerdOp: d.gecontroleerdOp, let_op: d.let_op, onderwerpen: d.onderwerpen.map(o => korte(d, o)) };
  if (naam === 'regelgeving_zoek') {
    const t = String(args.zoekterm || '').toLowerCase().trim();
    if (!t) throw new Error('zoekterm ontbreekt');
    return { let_op: d.let_op, resultaten: d.onderwerpen.filter(o => platte([o.id, o.onderwerp, o.toelichting, o.waarden]).includes(t)).map(o => korte(d, o)) };
  }
  if (naam === 'regelgeving_get') {
    const o = d.onderwerpen.find(x => x.id === args.id);
    if (!o) throw new Error('onbekend onderwerp: ' + args.id);
    const bronnen = o.bronnen || (d.bronnengroepen && d.bronnengroepen[o.bronnengroep]) || [];
    return { let_op: d.let_op, ...o, bronnen };
  }
  throw new Error('onbekend hulpmiddel: ' + naam);
}

function stuur(o) { process.stdout.write(JSON.stringify(o) + '\n'); }
async function verwerk(m) {
  if (m.id === undefined) return; // notificatie
  try {
    if (m.method === 'initialize') return stuur({ jsonrpc: '2.0', id: m.id, result: { protocolVersion: (m.params && m.params.protocolVersion) || '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'adviesforum-regelgeving', version: VERSIE } } });
    if (m.method === 'tools/list') return stuur({ jsonrpc: '2.0', id: m.id, result: { tools: TOOLS } });
    if (m.method === 'tools/call') {
      try {
        const r = await roep(m.params.name, m.params.arguments || {});
        return stuur({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: JSON.stringify(r, null, 1) }] } });
      } catch (e) {
        return stuur({ jsonrpc: '2.0', id: m.id, result: { isError: true, content: [{ type: 'text', text: String(e.message || e) }] } });
      }
    }
    if (m.method === 'ping') return stuur({ jsonrpc: '2.0', id: m.id, result: {} });
    stuur({ jsonrpc: '2.0', id: m.id, error: { code: -32601, message: 'onbekende methode: ' + m.method } });
  } catch (e) { stuur({ jsonrpc: '2.0', id: m.id, error: { code: -32603, message: String(e.message || e) } }); }
}
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => { buf += c; let i; while ((i = buf.indexOf('\n')) >= 0) { const r = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (r) { try { verwerk(JSON.parse(r)); } catch (e) { stuur({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'ongeldige JSON' } }); } } } });
