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
  expect(k2).not.toHaveProperty('parent_id'); // collection 0 in het voorbeeld = niet ingesteld
  const uit = run('--dry-run');
  const concept = /^\+ nieuw\s+(kb:\S+)\s+draft/m.exec(uit)[1];
  const c = JSON.parse(run('--preview=' + concept));
  expect(c.state).toBe('draft');
  expect(c.ai_chatbot_availability).toBe(false);
  expect(c.body).toContain('Concept: niet door compliance gecontroleerd');
});
