import { test } from '@playwright/test';

test.setTimeout(60000);

test('send message', async ({ browser }) => {
  const viewer = await browser.newPage();
  await viewer.goto('/');

  const page = await browser.newPage();
  await page.goto('/api/auth/signin');
  await page.fill('[name="name"]', 'test');
  await page.click('[type="submit"]');

  const nonce =
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 6) || 'nonce';
  // await page.click('[type=submit]');
  await page.fill('[name=text]', nonce);
  await page.click('[type=submit]');

  await viewer.waitForSelector(`text=${nonce}`);
  viewer.close();
  await page.close();
});

export {};
