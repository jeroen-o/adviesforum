// Intercom-sync: proefrun op de echte data, zonder token en zonder eigen configuratie
const { test, expect } = require('@playwright/test');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const run = (...a) => execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'sync-intercom.mjs'), ...a], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, INTERCOM_TOKEN: '' } });

test('proefrun leest alle kennisbankartikelen en publiceert alleen gecontroleerde', () => {
  const uit = run('--dry-run');
  const m = /Te synchroniseren: (\d+), waarvan (\d+) gepubliceerd en (\d+) als concept/.exec(uit);
  expect(m).not.toBeNull();
  expect(+m[1]).toBeGreaterThan(200);
  expect(+m[1]).toBe(+m[2] + +m[3]);
});

test('preview: gecontroleerd artikel gepubliceerd, concept als draft en nooit voor Fin', () => {
  const k2 = JSON.parse(run('--preview=kb:k2'));
  expect(k2.state).toBe('published');
  expect(k2.body).toContain('Door compliance goedgekeurd');
  // collection 0 (voorbeeld) = niet ingesteld; anders hoort er een collection bij
  if ('parent_id' in k2) { expect(k2.parent_id).toBeGreaterThan(0); expect(k2.parent_type).toBe('collection'); }
  const uit = run('--dry-run');
  const concept = /^\+ nieuw\s+(kb:\S+)\s+draft/m.exec(uit)[1];
  const c = JSON.parse(run('--preview=' + concept));
  expect(c.state).toBe('draft');
  expect(c.ai_chatbot_availability).toBe(false);
  expect(c.body).toContain('Concept: niet door compliance gecontroleerd');
});

test('bootstrap logt geen e-mailadressen (Actions-logs van deze openbare repository zijn openbaar)', () => {
  const fs = require('fs');
  const bron = fs.readFileSync(path.join(ROOT, 'scripts', 'sync-intercom.mjs'), 'utf8');
  const bootstrap = bron.slice(bron.indexOf('async function bootstrap'), bron.indexOf('/* --------------------------------------------------------------------- Main'));
  expect(bootstrap).not.toMatch(/\.email/);
  expect(bootstrap).toMatch(/GITHUB_ACTIONS/); // in Actions geen lijst met alle medewerkersnamen
});

test('--herstel bouwt de koppeltabel op uit Intercom; daarna maakt de sync niets dubbel aan', () => {
  const fs = require('fs');
  const map = path.join(ROOT, 'data', 'intercom-map.json');
  if (fs.existsSync(map)) test.skip(true, 'er staat al een lokale koppeltabel');
  try {
    const uit = execFileSync(process.execPath, [path.join(ROOT, 'tests', 'fixtures', 'intercom-herstel-mock.mjs'), ROOT], { cwd: ROOT, encoding: 'utf8' });
    expect(uit).toMatch(/gekoppeld/);
    const m = JSON.parse(fs.readFileSync(map, 'utf8'));
    expect(Object.values(m).every((e) => e.articleId && e.hash)).toBe(true);
    expect(run('--dry-run')).toMatch(/nieuw 0, bijgewerkt 0, ongewijzigd \d+/);
  } finally {
    if (fs.existsSync(map)) fs.unlinkSync(map);
  }
});
