// regelgeving.json en de MCP-server (mcp/adviesforum-regelgeving): bestand actueel, server antwoordt op initialize, tools/list en tools/call.
const { test, expect } = require('@playwright/test');
const { execFileSync, spawn } = require('child_process');
const path = require('path');
const ROOT = path.join(__dirname, '..');

test('node tools/regelgeving.js --check: regelgeving.json is actueel', () => {
  const uit = execFileSync(process.execPath, ['tools/regelgeving.js', '--check'], { cwd: ROOT, encoding: 'utf8' });
  expect(uit).toContain('actueel');
});

test('regelgeving.json bevat de NHG-grens met bron en elke fiscale norm een controlestatus', () => {
  const d = require(path.join(ROOT, 'regelgeving.json'));
  const nhg = d.onderwerpen.find(o => o.id === 'nhg.grens-2026');
  expect(nhg.waarden.kostengrens).toBe(470000);
  expect(nhg.waarden.kostengrensMetEnergiebesparendeVoorzieningen).toBe(498200);
  expect(nhg.bronnen.length).toBeGreaterThan(0);
  for (const o of d.onderwerpen) { expect(o.status, o.id).toBeTruthy(); expect(o.bronnen || d.bronnengroepen[o.bronnengroep], o.id).toBeTruthy(); }
});

function vraag(berichten) {
  return new Promise((ok, fout) => {
    const p = spawn(process.execPath, ['mcp/adviesforum-regelgeving/server.js'], { cwd: ROOT, env: { ...process.env, ADVIESFORUM_REGELGEVING: path.join(ROOT, 'regelgeving.json') } });
    const uit = []; let buf = '';
    p.stdout.on('data', c => { buf += c; let i; while ((i = buf.indexOf('\n')) >= 0) { uit.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } if (uit.length >= berichten.filter(m => m.id !== undefined).length) { p.kill(); ok(uit); } });
    p.on('error', fout);
    setTimeout(() => { p.kill(); fout(new Error('time-out')); }, 8000);
    for (const m of berichten) p.stdin.write(JSON.stringify(m) + '\n');
  });
}

test('MCP-server: initialize, tools/list en tools/call', async () => {
  const r = await vraag([
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1' } } },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'regelgeving_get', arguments: { id: 'nhg.grens-2026' } } },
    { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'regelgeving_zoek', arguments: { zoekterm: 'box 3' } } },
    { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'regelgeving_get', arguments: { id: 'bestaat-niet' } } },
  ]);
  const per = Object.fromEntries(r.map(x => [x.id, x]));
  expect(per[1].result.serverInfo.name).toBe('adviesforum-regelgeving');
  expect(per[2].result.tools.map(t => t.name)).toEqual(['regelgeving_lijst', 'regelgeving_zoek', 'regelgeving_get']);
  expect(JSON.parse(per[3].result.content[0].text).waarden.kostengrens).toBe(470000);
  expect(JSON.parse(per[4].result.content[0].text).resultaten.some(o => o.id === 'fiscaal.box3')).toBe(true);
  expect(per[5].result.isError).toBe(true);
});
