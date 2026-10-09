// Live forum (Supabase): staat uit zonder sleutels; met sleutels inloggen per e-maillink, plaatsen naar moderatie,
// beoordelen en modereren. Supabase wordt hier nagebootst; er gaat geen verkeer naar buiten.
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

const API = 'https://test.supabase.co';
const U = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const VR = '11111111-1111-4111-8111-111111111111';
const AN = '22222222-2222-4222-8222-222222222222';

async function nepSupabase(page, { rol = 'adviseur', geverifieerd = true, soort = 'adviseur', antwoordSoort = 'adviseur' } = {}) {
  const log = [];
  await page.addInitScript(api => { window.ADVIESFORUM_BACKEND = { url: api, anonKey: 'test-anon' }; window.prompt = () => 'Bevat klantgegevens'; }, API);
  await page.route(API + '/**', async route => {
    const r = route.request(), url = new URL(r.url()), pad = url.pathname, m = r.method();
    const body = r.postData() ? JSON.parse(r.postData()) : null;
    log.push({ m, pad, q: url.search, body, auth: r.headers()['authorization'] || '' });
    const json = (status, d) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(d) });
    const profiel = { id: U, naam: 'Sanne Test', functie: 'Hypotheekadviseur', kantoor: 'Test Advies', plaats: 'Utrecht', afm: '12345678', linkedin: '', geverifieerd, rol, soort };
    if (pad === '/auth/v1/otp') return json(200, {});
    if (pad === '/auth/v1/token') return json(200, { access_token: 'at2', refresh_token: 'rt2', expires_in: 3600, user: { id: U } });
    if (pad === '/auth/v1/user') return json(200, { id: U, email: 'sanne@test.nl' });
    if (pad === '/auth/v1/logout') return json(204, {});
    if (pad === '/rest/v1/profielen' && m === 'GET') return json(200, url.search.includes('geverifieerd=eq.false') ? [{ ...profiel, id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', naam: 'Nieuw Lid', geverifieerd: false, aangemaakt: '2026-10-09T08:00:00Z' }] : [profiel]);
    if (pad === '/rest/v1/profielen' && m === 'PATCH') return json(200, [{ ...profiel, ...body }]);
    if (pad === '/rest/v1/vragen' && m === 'GET') {
      if (url.search.includes('status=eq.wacht')) return json(200, [{ id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', cat: 'hyp', titel: 'Wachtende vraag over erfpacht', body: 'x'.repeat(40), aangemaakt: '2026-10-09T09:00:00Z', profielen: { naam: 'Sanne Test', kantoor: 'Test Advies', afm: '12345678', geverifieerd: true } }]);
      return json(200, [{ id: VR, cat: 'hyp', titel: 'Live testvraag over overbruggingskrediet', body: 'Hoe gaan geldverstrekkers om met een overbrugging bij een woning die nog te koop staat?', tags: [], aangemaakt: '2026-10-09T10:00:00Z', auteur: U, profielen: { naam: 'Sanne Test', kantoor: 'Test Advies', functie: 'Hypotheekadviseur', geverifieerd: true } }]);
    }
    if (pad === '/rest/v1/antwoorden' && m === 'GET') {
      if (url.search.includes('status=eq.wacht')) return json(200, []);
      return json(200, [{ id: AN, vraag_ref: VR, body: 'Live antwoord: dat verschilt per geldverstrekker, kijk in de vergelijker.', aangemaakt: '2026-10-09T11:00:00Z', auteur: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', profielen: { naam: 'Piet Collega', kantoor: 'Collega BV', functie: 'Adviseur', geverifieerd: true, soort: antwoordSoort } }]);
    }
    if (pad === '/rest/v1/beoordelingen' && m === 'GET') return json(200, []);
    if (pad === '/rest/v1/meldingen' && m === 'GET') return json(200, []);
    if (m === 'POST' || m === 'PATCH') return json(201, [{}]);
    return json(404, { message: 'onbekend in test' });
  });
  return log;
}

test('zonder sleutels staat het live forum uit en blijft het inloggen met code', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html');
  expect(await page.evaluate(() => window.ForumBackend.actief)).toBe(false);
  await page.locator('#who [data-act="inloggen"]').click();
  await expect(page.locator('#lg-code')).toBeVisible();
  expect(fouten).toEqual([]);
});

test('live: gepubliceerde vraag en antwoord zichtbaar, inloggen stuurt een e-maillink', async ({ page }) => {
  const fouten = await volgFouten(page);
  const log = await nepSupabase(page);
  await page.goto('/index.html#vraag-' + VR);
  await expect(page.locator('h1')).toHaveText('Live testvraag over overbruggingskrediet');
  await expect(page.locator('article.ans')).toContainText('Live antwoord');
  await expect(page.locator('article.ans [data-act="meld-live"]')).toHaveCount(1);
  await page.locator('#who [data-act="inloggen"]').click();
  await page.locator('#lg-email').fill('sanne@test.nl');
  await page.locator('#f-login-live button[type="submit"]').click();
  await expect(page.locator('#f-login-live')).toContainText('Check je mail');
  const otp = log.find(x => x.pad === '/auth/v1/otp');
  expect(otp.body.email).toBe('sanne@test.nl');
  expect(decodeURIComponent(otp.q)).toContain('redirect_to=');
  expect(fouten).toEqual([]);
});

test('live: inloglink geeft sessie; antwoord gaat naar moderatie, beoordelen en melden werken', async ({ page }) => {
  const fouten = await volgFouten(page);
  const log = await nepSupabase(page);
  await page.goto('/index.html#access_token=at1&refresh_token=rt1&expires_in=3600&token_type=bearer&type=magiclink');
  await expect(page.locator('#who')).toContainText('Sanne Test');
  expect(await page.evaluate(() => location.hash)).toBe('');
  expect(await page.evaluate(() => document.cookie)).toContain('af_sessie=rt1');
  await page.evaluate(id => { location.hash = 'vraag-' + id; }, VR);
  await expect(page.locator('h1')).toHaveText('Live testvraag over overbruggingskrediet');
  await page.locator('#f-antwoord textarea[name="body"]').fill('Mijn antwoord: vraag naar de voorwaarden voor dubbele lasten.');
  await page.locator('#f-antwoord [type="submit"]').click();
  await expect(page.locator('#toast')).toContainText('na controle door een moderator');
  const post = log.find(x => x.pad === '/rest/v1/antwoorden' && x.m === 'POST');
  expect(post.body).toEqual({ vraag_ref: VR, body: 'Mijn antwoord: vraag naar de voorwaarden voor dubbele lasten.' });
  expect(post.auth).toBe('Bearer at1');
  await page.locator('article.ans [data-act="rate"][data-kind="a"][data-val="4"]').first().click();
  await expect(page.locator('#toast')).toContainText('4 sterren');
  expect(log.find(x => x.pad === '/rest/v1/beoordelingen' && x.m === 'POST').body).toEqual({ antwoord_id: AN, score: 4 });
  await page.locator('article.ans [data-act="meld-live"]').click();
  await expect(page.locator('#toast')).toContainText('moderator kijkt ernaar');
  expect(log.find(x => x.pad === '/rest/v1/meldingen' && x.m === 'POST').body).toEqual({ soort: 'antwoord', ref: AN, reden: 'Bevat klantgegevens' });
  await page.locator('#who [data-act="uitloggen"]').click();
  await expect(page.locator('#who [data-act="inloggen"]')).toBeVisible();
  expect(await page.evaluate(() => document.cookie)).not.toContain('af_sessie=');
  expect(fouten).toEqual([]);
});

test('live: niet-geverifieerd account kan nog niet plaatsen', async ({ page }) => {
  const log = await nepSupabase(page, { geverifieerd: false });
  await page.goto('/index.html#access_token=at1&refresh_token=rt1&expires_in=3600&type=magiclink');
  await expect(page.locator('#who')).toContainText('Sanne Test');
  await page.evaluate(id => { location.hash = 'vraag-' + id; }, VR);
  await page.locator('#f-antwoord textarea[name="body"]').fill('Een antwoord van iemand die nog niet is gecontroleerd.');
  await page.locator('#f-antwoord [type="submit"]').click();
  await expect(page.locator('#toast')).toContainText('wacht nog op controle');
  expect(log.some(x => x.pad === '/rest/v1/antwoorden' && x.m === 'POST')).toBe(false);
});

test('live: aanbieder krijgt een label, staat niet in de ranglijst en kan niet beoordelen', async ({ page }) => {
  const fouten = await volgFouten(page);
  const log = await nepSupabase(page, { soort: 'aanbieder', antwoordSoort: 'aanbieder' });
  await page.goto('/index.html#access_token=at1&refresh_token=rt1&expires_in=3600&type=magiclink');
  await expect(page.locator('#who')).toContainText('Sanne Test');
  await page.evaluate(id => { location.hash = 'vraag-' + id; }, VR);
  await expect(page.locator('article.ans .aanbieder-badge')).toHaveText('Aanbieder');
  await page.locator('article.ans [data-act="rate"][data-kind="a"][data-val="4"]').first().click();
  await expect(page.locator('#toast')).toContainText('Als aanbieder kun je antwoorden niet beoordelen');
  expect(log.some(x => x.pad === '/rest/v1/beoordelingen' && x.m === 'POST')).toBe(false);
  await page.evaluate(() => { location.hash = 'adviseurs'; });
  await expect(page.locator('.tbl')).not.toContainText('Piet Collega');
  expect(fouten).toEqual([]);
});

test('moderatie: wachtrij, publiceren en account verifiëren', async ({ page }) => {
  const fouten = await volgFouten(page);
  const log = await nepSupabase(page, { rol: 'moderator' });
  await page.context().addCookies([{ name: 'af_sessie', value: 'rt0', url: 'http://127.0.0.1:4173' }]);
  await page.goto('/moderatie.html');
  await expect(page.locator('#vragen')).toContainText('Wachtende vraag over erfpacht');
  await expect(page.locator('#n-accounts')).toHaveText('1');
  await page.locator('#vragen button[data-status="gepubliceerd"]').click();
  await expect.poll(() => log.filter(x => x.pad === '/rest/v1/vragen' && x.m === 'PATCH').length).toBe(1);
  expect(log.find(x => x.pad === '/rest/v1/vragen' && x.m === 'PATCH').body.status).toBe('gepubliceerd');
  await page.locator('#accounts button[data-verifieer]').click();
  await expect.poll(() => log.filter(x => x.pad === '/rest/v1/profielen' && x.m === 'PATCH').length).toBe(1);
  expect(log.find(x => x.pad === '/rest/v1/profielen' && x.m === 'PATCH').body).toEqual({ geverifieerd: true });
  expect(fouten).toEqual([]);
});

test('moderatie zonder sleutels meldt dat het live forum uit staat', async ({ page }) => {
  await page.goto('/moderatie.html');
  await expect(page.locator('#uit')).toBeVisible();
});
