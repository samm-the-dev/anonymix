import { test, expect } from '@playwright/test';

const PAGE = '/01-the-enthusiasts-round-prototype/tape-voting.html';

test.describe('Tape Comments — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-song-player]').length > 0);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('header shows tape number and session name', async ({ page }) => {
    const title = page.locator('#commenting-title');
    await expect(title).toHaveText('Tape 1 · Comment');

    const sessionName = page.locator('#commenting-session-name');
    await expect(sessionName).toHaveText('Comic Book Fuckery');
  });
});

test.describe('Tape Comments — Tape Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-song-player]').length > 0);
  });

  test('tape name and description visible', async ({ page }) => {
    const tapeName = page.locator('#comment-tape-name');
    await expect(tapeName).toBeVisible();
    await expect(tapeName).toContainText('Two-Face');

    const tapeDesc = page.locator('#comment-tape-desc');
    await expect(tapeDesc).toBeVisible();
    await expect(tapeDesc).toContainText('songs that start in one style');
  });

  test('deadline countdown visible in amber', async ({ page }) => {
    const deadline = page.locator('#comment-deadline');
    await expect(deadline).toBeVisible();
    await expect(deadline).toContainText('left to comment');
    await expect(deadline).toHaveClass(/text-amber-600/);
  });

  test('framing text paragraphs are visible', async ({ page }) => {
    const body = page.locator('main');
    await expect(body.getByText('Comment on a song that surprised you')).toBeVisible();
    await expect(body.getByText("If you're low on time or energy")).toBeVisible();
    await expect(body.getByText('No worries.')).toBeVisible();
  });
});

test.describe('Tape Comments — Song List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-song-player]').length > 0);
  });

  test('4 songs visible (excludes current user submission)', async ({ page }) => {
    const songs = page.locator('[data-song-player]');
    await expect(songs).toHaveCount(4);

    // Verify Sam's own submission is not shown
    const allText = await page.locator('#song-list').textContent();
    expect(allText).not.toContain('Paranoid Android');
  });

  test('each song has a comment textarea', async ({ page }) => {
    const textareas = page.locator('[data-song-player] textarea');
    await expect(textareas).toHaveCount(4);
  });
});

test.describe('Tape Comments — Tape Comment & Submit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-song-player]').length > 0);
  });

  test('"The Tape" section at bottom with textarea', async ({ page }) => {
    const tapeLabel = page.getByText('The Tape');
    await expect(tapeLabel).toBeVisible();

    // The tape-level textarea is the one after "The Tape" label
    const tapeSection = page.locator('#song-list').getByText('The Tape').locator('..');
    const textarea = tapeSection.locator('textarea');
    await expect(textarea).toBeVisible();
  });

  test('"Share comments" button visible', async ({ page }) => {
    const submitBtn = page.locator('#submit-comments');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText('Share comments');
  });

  test('tapping submit shows toast', async ({ page }) => {
    const submitBtn = page.locator('#submit-comments');
    await submitBtn.click();

    const toast = page.getByText('Comments shared!');
    await expect(toast).toBeVisible();
  });
});

test.describe('Tape Comments — Console Errors', () => {
  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-song-player]').length > 0);

    expect(errors).toEqual([]);
  });
});
