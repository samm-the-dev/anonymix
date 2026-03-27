import { test, expect } from '@playwright/test';

const PAGE = '/01-the-enthusiasts-round-prototype/tape-submission.html';

const waitForData = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() =>
    document.getElementById('tape-name')?.textContent !== ''
  );
};

test.describe('Tape Submission — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('header shows "Tape 2 · Submit" and "Comic Book Fuckery"', async ({ page }) => {
    const title = page.locator('#submission-title');
    await expect(title).toHaveText('Tape 2 · Submit');

    const sessionName = page.locator('#submission-session-name');
    await expect(sessionName).toHaveText('Comic Book Fuckery');
  });
});

test.describe('Tape Submission — Prompt & Deadline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('tape name and description visible', async ({ page }) => {
    const name = page.locator('#tape-name');
    await expect(name).toContainText('Magneto');

    const desc = page.locator('#tape-desc');
    await expect(desc).toContainText('polarizing');
  });

  test('countdown visible in green', async ({ page }) => {
    const deadline = page.locator('#tape-deadline');
    await expect(deadline).toBeVisible();

    const text = await deadline.textContent();
    expect(text!.length).toBeGreaterThan(0);

    // Should have green text styling
    await expect(deadline).toHaveClass(/text-green-600/);
  });
});

test.describe('Tape Submission — Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
    // Clear existing submission first so search works cleanly
    const clearBtn = page.locator('#search-clear');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }
  });

  test('typing "hero" shows autocomplete results', async ({ page }) => {
    const input = page.locator('#song-search');
    await input.fill('hero');

    const results = page.locator('#autocomplete-results');
    await expect(results).toBeVisible();

    // Should show multiple hero-related songs from the catalog
    const rows = results.locator('[data-song-index]');
    expect(await rows.count()).toBeGreaterThanOrEqual(3);
  });

  test('unavailable songs are grayed out', async ({ page }) => {
    const input = page.locator('#song-search');
    await input.fill('hero');

    const results = page.locator('#autocomplete-results');
    await expect(results).toBeVisible();

    // "Hero" by Mariah Carey is unavailable — should have opacity-40 and cursor-not-allowed
    const unavailableRow = results.locator('.cursor-not-allowed');
    expect(await unavailableRow.count()).toBeGreaterThanOrEqual(1);

    const unavailableText = await unavailableRow.first().textContent();
    expect(unavailableText).toContain('Hero');
    expect(unavailableText).toContain('Mariah Carey');
  });

  test('clear button resets input and hides results', async ({ page }) => {
    const input = page.locator('#song-search');
    await input.fill('hero');

    const results = page.locator('#autocomplete-results');
    await expect(results).toBeVisible();

    // Click clear
    const clearBtn = page.locator('#search-clear');
    await clearBtn.click();

    await expect(input).toHaveValue('');
    await expect(results).toHaveClass(/hidden/);
  });
});

test.describe('Tape Submission — Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
    // Clear existing submission first
    const clearBtn = page.locator('#search-clear');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    }
  });

  test('tapping a result fills input and shows preview with submit button', async ({ page }) => {
    const input = page.locator('#song-search');
    await input.fill('hero');

    const results = page.locator('#autocomplete-results');
    await expect(results).toBeVisible();

    // Click the first available result (Heroes by David Bowie)
    const availableRow = results.locator('.cursor-pointer').first();
    await availableRow.click();

    // Input should be filled
    await expect(input).not.toHaveValue('');
    const inputVal = await input.inputValue();
    expect(inputVal).toContain('Heroes');

    // Autocomplete should be hidden
    await expect(results).toHaveClass(/hidden/);

    // Preview should be visible
    const preview = page.locator('#song-preview');
    await expect(preview).not.toHaveClass(/hidden/);

    // Submit button should be visible
    const submitBtn = page.locator('#submit-button');
    await expect(submitBtn).toBeVisible();
  });

  test('clearing after selection hides preview', async ({ page }) => {
    const input = page.locator('#song-search');
    await input.fill('hero');

    const results = page.locator('#autocomplete-results');
    const availableRow = results.locator('.cursor-pointer').first();
    await availableRow.click();

    const preview = page.locator('#song-preview');
    await expect(preview).not.toHaveClass(/hidden/);

    // Click clear
    const clearBtn = page.locator('#search-clear');
    await clearBtn.click();

    await expect(preview).toHaveClass(/hidden/);
  });
});

test.describe('Tape Submission — Submit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('tapping submit shows toast', async ({ page }) => {
    // Page loads with existing submission pre-filled, so preview and submit are visible
    const submitBtn = page.locator('#submit-button');
    await expect(submitBtn).toBeVisible();

    await submitBtn.click();

    const toast = page.locator('#submit-toast');
    await expect(toast).not.toHaveClass(/hidden/);
    await expect(toast).toContainText('Song submitted');
  });
});

test.describe('Tape Submission — Re-entry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('page loads with existing submission pre-filled', async ({ page }) => {
    // Tape 2 has Sam's "Dance Monkey" submission
    const input = page.locator('#song-search');
    const inputVal = await input.inputValue();
    expect(inputVal).toContain('Dance Monkey');
    expect(inputVal).toContain('Tones and I');

    // Preview should be visible
    const preview = page.locator('#song-preview');
    await expect(preview).not.toHaveClass(/hidden/);

    const previewTitle = page.locator('#preview-title');
    await expect(previewTitle).toHaveText('Dance Monkey');

    const previewArtist = page.locator('#preview-artist');
    await expect(previewArtist).toHaveText('Tones and I');
  });
});

test.describe('Tape Submission — Console Errors', () => {
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
