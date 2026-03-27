import { test, expect } from '@playwright/test';

const PAGE = '/04-the-hosts-session-edits-prototype/session-admin.html';

const waitForData = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() => document.getElementById('tape-list')?.children.length > 0);
};

test.describe('Session Admin — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('header shows "Comic Book Fuckery"', async ({ page }) => {
    await expect(page.locator('#header-title')).toHaveText('Comic Book Fuckery');
  });

  test('manage members button in footer', async ({ page }) => {
    await expect(page.getByText('Manage Members')).toBeVisible();
  });
});

test.describe('Session Admin — Inline Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('view state shows session name and description', async ({ page }) => {
    await expect(page.locator('#settings-view-name')).toHaveText('Comic Book Fuckery');
    await expect(page.locator('#settings-view-desc')).toContainText('Marvel/DC');
  });

  test('view state shows timing', async ({ page }) => {
    await expect(page.locator('#settings-view-submit')).toHaveText('2 days');
    await expect(page.locator('#settings-view-comment')).toHaveText('5 days');
  });

  test('clicking Edit shows edit state with inputs', async ({ page }) => {
    await page.getByText('Edit', { exact: true }).click();

    await expect(page.locator('#settings-edit')).toBeVisible();
    await expect(page.locator('#settings-name')).toBeVisible();
    await expect(page.locator('#settings-desc')).toBeVisible();
  });

  test('cancel returns to view state', async ({ page }) => {
    await page.getByText('Edit', { exact: true }).click();
    await page.locator('#settings-edit').getByText('Cancel').click();

    await expect(page.locator('#settings-view')).toBeVisible();
    await expect(page.locator('#settings-edit')).not.toBeVisible();
  });
});

test.describe('Session Admin — Tape List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('6 tapes rendered with correct statuses', async ({ page }) => {
    const tapeList = page.locator('#tape-list');
    await expect(tapeList).toContainText('Completed');
    await expect(tapeList).toContainText('Commenting');
    await expect(tapeList).toContainText('Submitting');
    await expect(tapeList).toContainText('Upcoming');
  });

  test('"Edit upcoming" button visible between past/active and upcoming', async ({ page }) => {
    await expect(page.locator('#edit-mode-btn')).toBeVisible();
    await expect(page.locator('#edit-mode-btn')).toContainText('Edit upcoming');
  });
});

test.describe('Session Admin — Edit Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('clicking "Edit upcoming" makes upcoming tape inputs editable', async ({ page }) => {
    await page.locator('#edit-mode-btn').click();

    const inputs = page.locator('#tape-list input');
    expect(await inputs.count()).toBeGreaterThanOrEqual(2);
  });

  test('cancel and save buttons appear in edit mode', async ({ page }) => {
    await page.locator('#edit-mode-btn').click();

    await expect(page.locator('#tape-list').getByText('Cancel')).toBeVisible();
    await expect(page.locator('#tape-list').getByText('Save')).toBeVisible();
  });

  test('"+ Add another tape" button appears in edit mode', async ({ page }) => {
    await page.locator('#edit-mode-btn').click();

    await expect(page.getByText('+ Add another tape')).toBeVisible();
  });
});

test.describe('Session Admin — Members Sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('clicking manage members opens member list with 5 members', async ({ page }) => {
    await page.getByText('Manage Members').click();

    const membersSheet = page.locator('#sheet-members');
    await expect(membersSheet).toBeVisible();

    const memberItems = page.locator('#member-list').locator('.border-b');
    expect(await memberItems.count()).toBe(5);
  });

  test('non-host members have dots menu', async ({ page }) => {
    await page.getByText('Manage Members').click();

    const memberList = page.locator('#member-list');
    const dotsMenus = memberList.locator('.relative');
    expect(await dotsMenus.count()).toBe(4);

    await expect(memberList.getByText('Host', { exact: true })).toBeVisible();
  });

  test('invite link in members sheet', async ({ page }) => {
    await page.getByText('Manage Members').click();

    await expect(page.getByText('Copy invite link')).toBeVisible();
  });
});

test.describe('Session Admin — Console Errors', () => {
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
