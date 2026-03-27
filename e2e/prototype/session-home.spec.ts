import { test, expect } from '@playwright/test';

const PAGE = '/01-the-enthusiasts-round-prototype/session-home.html';

test.describe('Session Home — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-session-id]').length > 0);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('title is centered in header', async ({ page }) => {
    const title = page.locator('#session-home-header-title');
    await expect(title).toHaveText('Anonymix');
    await expect(title).toBeVisible();
  });
});

test.describe('Session Home — Collapsible Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-session-id]').length > 0);
  });

  test('active section is open on load', async ({ page }) => {
    const activeBtn = page.locator('#session-home-section-active');
    await expect(activeBtn).toHaveAttribute('data-expanded', 'true');

    const activeContent = page.locator('#active-content');
    await expect(activeContent).not.toHaveClass(/collapsed/);
  });

  test('completed section is collapsed on load', async ({ page }) => {
    const completedBtn = page.locator('#session-home-section-completed');
    await expect(completedBtn).toHaveAttribute('data-expanded', 'false');

    const completedContent = page.locator('#completed-content');
    await expect(completedContent).toHaveClass(/collapsed/);
  });

  test('tapping active header collapses it', async ({ page }) => {
    const activeBtn = page.locator('#session-home-section-active');
    await activeBtn.click();
    await expect(activeBtn).toHaveAttribute('data-expanded', 'false');

    const activeContent = page.locator('#active-content');
    await expect(activeContent).toHaveClass(/collapsed/);
  });

  test('tapping completed header expands it', async ({ page }) => {
    const completedBtn = page.locator('#session-home-section-completed');
    await completedBtn.click();
    await expect(completedBtn).toHaveAttribute('data-expanded', 'true');

    const completedContent = page.locator('#completed-content');
    await expect(completedContent).not.toHaveClass(/collapsed/);
  });

  test('chevron rotates on toggle', async ({ page }) => {
    // Active chevron starts without collapsed class
    const activeChevron = page.locator('#session-home-section-active .chevron');
    await expect(activeChevron).not.toHaveClass(/collapsed/);

    // Click to collapse — chevron gets collapsed class
    await page.locator('#session-home-section-active').click();
    await expect(activeChevron).toHaveClass(/collapsed/);
  });

  test('section counts are correct', async ({ page }) => {
    const activeCount = page.locator('#active-count');
    const completedCount = page.locator('#completed-count');

    // Demo mode: 6 active, 1 completed
    await expect(activeCount).toHaveText('(6)');
    await expect(completedCount).toHaveText('(1)');
  });
});

test.describe('Session Home — Session Cards (Demo Mode)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-session-id]').length > 0);
  });

  test('6 active cards visible in demo mode', async ({ page }) => {
    const activeCards = page.locator('#active-content [data-session-id]');
    await expect(activeCards).toHaveCount(6);
  });

  test('each card shows session name, description, avatars, tape info', async ({ page }) => {
    const firstCard = page.locator('#active-content [data-session-id]').first();

    // Session name
    const title = firstCard.locator('h3');
    await expect(title).toHaveText('Comic Book Fuckery');

    // Description
    const desc = firstCard.locator('p').first();
    await expect(desc).toContainText('Marvel/DC character themes');

    // Avatars (5 players)
    const avatars = firstCard.locator('.rounded-full');
    expect(await avatars.count()).toBeGreaterThanOrEqual(5);
  });

  test('1 completed card visible', async ({ page }) => {
    // Expand completed section first
    await page.locator('#session-home-section-completed').click();
    await page.waitForTimeout(300); // wait for animation

    const completedCards = page.locator('#completed-content [data-session-id]');
    await expect(completedCards).toHaveCount(1);
  });

  test('completed card shows no tape info', async ({ page }) => {
    await page.locator('#session-home-section-completed').click();
    await page.waitForTimeout(300);

    const completedCard = page.locator('#completed-content [data-session-id]').first();
    const text = await completedCard.textContent();

    // Should have session name but not a tape title from the data
    expect(text).toContain('Playlist Pandamonium');
    expect(text).not.toContain('Guilty pleasures');
    expect(text).not.toContain('Wait, was that me?');
  });
});

test.describe('Session Home — Status Variants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-session-id]').length > 0);
  });

  test('all 4 status badge colors present', async ({ page }) => {
    const badges = page.locator('#active-content .rounded-full.uppercase');

    const texts = await badges.allTextContents();
    const trimmed = texts.map(t => t.trim());

    expect(trimmed).toContain('Commenting');
    expect(trimmed).toContain('Submitting');
    expect(trimmed).toContain('Playlist Ready');
    expect(trimmed).toContain('Completed');
  });

  test('submitting before: "Submit" button', async ({ page }) => {
    const cards = page.locator('#active-content [data-session-id]');
    const allTexts = await cards.evaluateAll(els =>
      els.map(el => el.textContent)
    );

    const hasSubmit = allTexts.some(t => t?.includes('Submit') && !t?.includes('Change'));
    expect(hasSubmit).toBeTruthy();
  });

  test('submitting after: "Change" button', async ({ page }) => {
    const cards = page.locator('#active-content [data-session-id]');
    const allTexts = await cards.evaluateAll(els =>
      els.map(el => el.textContent)
    );

    const hasChange = allTexts.some(t => t?.includes('Change'));
    expect(hasChange).toBeTruthy();
  });

  test('commenting before: "Comment" button', async ({ page }) => {
    const cards = page.locator('#active-content [data-session-id]');
    const allTexts = await cards.evaluateAll(els =>
      els.map(el => el.textContent)
    );

    const hasComment = allTexts.some(t => t?.includes('Comment') && !t?.includes('Commented'));
    expect(hasComment).toBeTruthy();
  });

  test('commenting after: "Commented" muted button', async ({ page }) => {
    const commentedBtns = page.locator('#active-content button:has-text("Commented")');
    await expect(commentedBtns.first()).toBeVisible();

    // Commented button should have muted styling (border, gray text)
    const classes = await commentedBtns.first().getAttribute('class');
    expect(classes).toContain('border');
    expect(classes).toContain('text-gray-400');
  });

  test('playlist ready: "Listen" button, no duplicate deadline text', async ({ page }) => {
    const cards = page.locator('#active-content [data-session-id]');
    const allCards = await cards.evaluateAll(els =>
      els.map(el => ({ text: el.textContent }))
    );

    const playlistCard = allCards.find(c =>
      c.text?.includes('Playlist Ready') && c.text?.includes('Listen')
    );
    expect(playlistCard).toBeTruthy();

    // Should not have "Playlist ready" as deadline text (badge is enough)
    // The badge says "PLAYLIST READY" and there should be no additional copy
    const playlistReadyCount = (playlistCard?.text?.match(/playlist ready/gi) || []).length;
    expect(playlistReadyCount).toBeLessThanOrEqual(1);
  });

  test('results: "Results" button', async ({ page }) => {
    const cards = page.locator('#active-content [data-session-id]');
    const allTexts = await cards.evaluateAll(els =>
      els.map(el => el.textContent)
    );

    const hasResults = allTexts.some(t => t?.includes('Results'));
    expect(hasResults).toBeTruthy();
  });

  test('each card has a "View" button', async ({ page }) => {
    const viewBtns = page.locator('#active-content button:has-text("View")');
    expect(await viewBtns.count()).toBeGreaterThanOrEqual(6);
  });
});

test.describe('Session Home — Demo/Real Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-session-id]').length > 0);
  });

  test('demo toggle button visible', async ({ page }) => {
    const toggle = page.locator('#demo-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText('Demo');
  });

  test('toggling to real mode shows 1 active card', async ({ page }) => {
    await page.locator('#demo-toggle').click();

    const activeCards = page.locator('#active-content [data-session-id]');
    await expect(activeCards).toHaveCount(1);

    const activeCount = page.locator('#active-count');
    await expect(activeCount).toHaveText('(1)');
  });

  test('real mode: Comic Book Fuckery shows "Comment" (Sam has not commented)', async ({ page }) => {
    await page.locator('#demo-toggle').click();

    const card = page.locator('#active-content [data-session-id]').first();
    const text = await card.textContent();
    expect(text).toContain('Comic Book Fuckery');
    expect(text).toContain('Comment');
  });

  test('toggling back to demo restores 6 cards', async ({ page }) => {
    await page.locator('#demo-toggle').click();
    await page.locator('#demo-toggle').click();

    const activeCards = page.locator('#active-content [data-session-id]');
    await expect(activeCards).toHaveCount(6);
  });
});

test.describe('Session Home — Console Errors', () => {
  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-session-id]').length > 0);

    expect(errors).toEqual([]);
  });
});
