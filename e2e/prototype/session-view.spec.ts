import { test, expect } from '@playwright/test';

const PAGE = '/01-the-enthusiasts-round-prototype/session-view.html';

const waitForData = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() => document.querySelector('[data-object-id="active-tape-card"]') !== null);
};

test.describe('Session View — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('header shows session name "Comic Book Fuckery"', async ({ page }) => {
    const title = page.locator('#session-view-title');
    await expect(title).toHaveText('Comic Book Fuckery');
  });

  test('gear icon visible (Sam is admin)', async ({ page }) => {
    const gear = page.locator('#session-view-gear');
    await expect(gear).toBeVisible();
  });
});

test.describe('Session View — Active Tape Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('active tape card renders with tape number, name, desc, and status badge', async ({ page }) => {
    const card = page.locator('[data-object-id="active-tape-card"]');
    await expect(card).toBeVisible();

    const text = await card.textContent();
    // Default active tape is Tape 1 (commenting status)
    expect(text).toContain('Tape 1');
    expect(text).toContain('Two-Face');
    expect(text).toContain('songs that start in one style');
    expect(text).toContain('Commenting');
  });
});

test.describe('Session View — Tape Spines', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('spines render below active card', async ({ page }) => {
    // Tape 1 is active (index 0), so there are no spines above but spines below
    const crate = page.locator('#tape-crate');
    const spinesBelow = crate.locator('[data-tape-index]');
    // All spines (above + below); since active is index 0, all spines are below
    expect(await spinesBelow.count()).toBeGreaterThanOrEqual(1);
  });

  test('spines render above and below when navigated to a middle tape', async ({ page }) => {
    // Navigate to tape index 2 (Tape 3) so there are spines above and below
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await waitForData(page);

    const crate = page.locator('#tape-crate');
    const card = page.locator('[data-object-id="active-tape-card"]');
    const cardTapeId = await card.getAttribute('data-tape-id');
    expect(cardTapeId).toBe('cbf-tape-3');

    // Spines above: tapes 0 and 1
    // Spines below: tapes 3+
    const allSpines = crate.locator('[data-tape-index]');
    expect(await allSpines.count()).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Session View — Crate-Flip Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('arrow keys navigate between tapes, active card changes', async ({ page }) => {
    // Start at Tape 1 (commenting)
    let card = page.locator('[data-object-id="active-tape-card"]');
    await expect(card).toContainText('Tape 1');

    // Press ArrowDown to go to Tape 2
    await page.keyboard.press('ArrowDown');
    card = page.locator('[data-object-id="active-tape-card"]');
    await expect(card).toContainText('Tape 2');

    // Press ArrowUp to go back to Tape 1
    await page.keyboard.press('ArrowUp');
    card = page.locator('[data-object-id="active-tape-card"]');
    await expect(card).toContainText('Tape 1');
  });

  test('tapping a spine navigates to that tape', async ({ page }) => {
    // There should be spines below the active card (Tape 1 is active at index 0)
    const spine = page.locator('#tape-crate [data-tape-index="1"]');
    await spine.click();

    const card = page.locator('[data-object-id="active-tape-card"]');
    await expect(card).toContainText('Tape 2');
  });
});

test.describe('Session View — State Variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('commenting tape shows comment progress', async ({ page }) => {
    // Tape 1 is commenting and is the default active tape
    const card = page.locator('[data-object-id="active-tape-card"]');
    const text = await card.textContent();
    expect(text).toContain('Commenting');
    expect(text).toContain('commented');
  });

  test('submitting tape shows progress bar', async ({ page }) => {
    // Navigate to Tape 2 (submitting)
    await page.keyboard.press('ArrowDown');
    const card = page.locator('[data-object-id="active-tape-card"]');
    const text = await card.textContent();
    expect(text).toContain('Submitting');
    expect(text).toContain('submitted');
  });

  test('upcoming tape shows "Coming soon"', async ({ page }) => {
    // Navigate to Tape 4 (upcoming) — press down 3 times from Tape 1
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    const card = page.locator('[data-object-id="active-tape-card"]');
    const text = await card.textContent();
    expect(text).toContain('Upcoming');
    expect(text).toContain('Coming soon');
  });
});

test.describe('Session View — Console Errors', () => {
  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(PAGE);
    await waitForData(page);

    expect(errors).toEqual([]);
  });
});
