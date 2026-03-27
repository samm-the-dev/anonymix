import { test, expect } from '@playwright/test';

const PAGE = '/01-the-enthusiasts-round-prototype/tape-reveal.html';

test.describe('Tape Reveal — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-accordion-item]').length > 0);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('header shows tape number and session name', async ({ page }) => {
    const title = page.locator('#reveal-title');
    await expect(title).toHaveText('Tape 1 · Reveal');

    const sessionName = page.locator('#reveal-session-name');
    await expect(sessionName).toHaveText('Playlist Pandamonium');
  });
});

test.describe('Tape Reveal — Tape Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-accordion-item]').length > 0);
  });

  test('tape name visible', async ({ page }) => {
    const tapeName = page.locator('#reveal-tape-name');
    await expect(tapeName).toBeVisible();
    await expect(tapeName).toHaveText('Guilty pleasures');
  });
});

test.describe('Tape Reveal — Song Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-accordion-item]').length > 0);
  });

  test('5 songs visible as accordion items', async ({ page }) => {
    const items = page.locator('[data-accordion-item]');
    await expect(items).toHaveCount(5);
  });

  test('all accordions collapsed by default', async ({ page }) => {
    const contents = page.locator('.accordion-content');
    const count = await contents.count();
    for (let i = 0; i < count; i++) {
      await expect(contents.nth(i)).not.toBeVisible();
    }
  });

  test('submitter name NOT visible when collapsed', async ({ page }) => {
    const submittedBy = page.getByText('Submitted by');
    const count = await submittedBy.count();
    for (let i = 0; i < count; i++) {
      await expect(submittedBy.nth(i)).not.toBeVisible();
    }
  });

  test('clicking a song expands it and shows submitter', async ({ page }) => {
    // Click the first accordion item
    const firstItem = page.locator('[data-accordion-item="0"] button');
    await firstItem.click();

    // Wait for the accordion content to become visible
    const content = page.locator('#content-0');
    await expect(content).toBeVisible();

    // Submitter should be visible
    const submittedBy = content.getByText('Submitted by');
    await expect(submittedBy).toBeVisible();

    // Player name should appear next to "Submitted by"
    const submitterBlock = content.locator('.submitter-reveal');
    await expect(submitterBlock).toContainText('Sam');
  });

  test('comments visible inside expanded accordion', async ({ page }) => {
    // Click the first accordion (Sam's MMMBop) — has comments from Cristina, Brent, Kelly
    const firstItem = page.locator('[data-accordion-item="0"] button');
    await firstItem.click();

    const content = page.locator('#content-0');
    await expect(content).toBeVisible();

    // Check that a commenter name and comment text are visible
    await expect(content.getByText('Cristina')).toBeVisible();
    await expect(content.getByText("I can't believe you admitted this")).toBeVisible();
  });

  test('clicking again collapses the accordion', async ({ page }) => {
    const firstItem = page.locator('[data-accordion-item="0"] button');

    // Expand
    await firstItem.click();
    const content = page.locator('#content-0');
    await expect(content).toBeVisible();

    // Collapse
    await firstItem.click();
    await expect(content).not.toBeVisible();
  });
});

test.describe('Tape Reveal — Tape Comments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-accordion-item]').length > 0);
  });

  test('"The Tape" section visible with tape-level comments', async ({ page }) => {
    const tapeLabel = page.getByText('The Tape');
    await expect(tapeLabel).toBeVisible();

    // Tape-level comments from Brent and Kelly
    await expect(page.getByText('Best tape so far, everyone went DEEP')).toBeVisible();
    await expect(page.getByText('This round was unhinged in the best way')).toBeVisible();
  });
});

test.describe('Tape Reveal — Console Errors', () => {
  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(PAGE);
    await page.waitForFunction(() => document.querySelectorAll('[data-accordion-item]').length > 0);

    expect(errors).toEqual([]);
  });
});
