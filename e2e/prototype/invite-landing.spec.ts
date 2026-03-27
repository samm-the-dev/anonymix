import { test, expect } from '@playwright/test';

const PAGE = '/02-the-casuals-first-session-prototype/invite-landing.html';

const waitForData = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() =>
    document.getElementById('session-name')?.textContent?.trim().length! > 0
  );
};

test.describe('Invite Landing — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('session name "Comic Book Fuckery" visible', async ({ page }) => {
    const name = page.locator('#session-name');
    await expect(name).toHaveText('Comic Book Fuckery');
  });

  test('"Sam invited you to join" text visible', async ({ page }) => {
    const invitedBy = page.locator('#invited-by');
    await expect(invitedBy).toBeVisible();
    await expect(invitedBy).toHaveText('Sam invited you to join');
  });
});

test.describe('Invite Landing — Member Avatars', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('4 member avatars displayed', async ({ page }) => {
    const avatars = page.locator('#member-avatars .rounded-full');
    await expect(avatars).toHaveCount(4);
  });
});

test.describe('Invite Landing — Tapes Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('"Tapes" label visible', async ({ page }) => {
    await expect(page.getByText('Tapes', { exact: true })).toBeVisible();
  });

  test('3 tape names with descriptions shown', async ({ page }) => {
    const promptPreview = page.locator('#prompt-preview');
    await expect(promptPreview.locator('.font-display')).toHaveCount(3);

    // First tape
    await expect(promptPreview).toContainText('Two-Face aka Harvey Dent');
    await expect(promptPreview).toContainText('songs that start in one style');

    // Second tape
    await expect(promptPreview).toContainText('Magneto, Master of Magnetism');
    await expect(promptPreview).toContainText('polarizing');

    // Third tape
    await expect(promptPreview).toContainText('The Flash aka Barry Allen');
    await expect(promptPreview).toContainText('fast and/or short songs');
  });

  test('"+3 more" indicator visible', async ({ page }) => {
    const promptPreview = page.locator('#prompt-preview');
    await expect(promptPreview).toContainText('+3 more');
  });
});

test.describe('Invite Landing — Explainer Bullets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('explainer bullets visible', async ({ page }) => {
    const explainer = page.locator('#explainer');
    await expect(explainer).toBeVisible();
    await expect(explainer).toContainText('Anonymously contribute to a playlist');
    await expect(explainer).toContainText('Comment on the playlist picks');
    await expect(explainer).toContainText('See all submitters and comments');
  });
});

test.describe('Invite Landing — Platform Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('"Join with Spotify" button visible', async ({ page }) => {
    const btn = page.locator('#spotify-button');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Join with Spotify');
  });

  test('"Join with YouTube Music" button visible', async ({ page }) => {
    const btn = page.locator('#youtube-button');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Join with YouTube Music');
  });
});

test.describe('Invite Landing — Demo Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('switching to "Returning" hides platform buttons and shows "Join Session"', async ({ page }) => {
    const toggle = page.locator('#demo-toggle');
    await expect(toggle).toHaveText('New User');

    await toggle.click();
    await expect(toggle).toHaveText('Returning');

    // Platform buttons hidden
    const platformButtons = page.locator('#platform-buttons');
    await expect(platformButtons).not.toBeVisible();

    // Join Session button visible
    const joinButton = page.locator('#join-button');
    await expect(joinButton).toBeVisible();
    await expect(joinButton).toHaveText('Join Session');

    // Explainer hidden
    const explainer = page.locator('#explainer');
    await expect(explainer).not.toBeVisible();
  });

  test('switching back to "New User" restores platform buttons', async ({ page }) => {
    const toggle = page.locator('#demo-toggle');
    await toggle.click(); // to Returning
    await toggle.click(); // back to New User

    const platformButtons = page.locator('#platform-buttons');
    await expect(platformButtons).toBeVisible();

    const joinButton = page.locator('#join-button');
    await expect(joinButton).not.toBeVisible();
  });
});

test.describe('Invite Landing — Console Errors', () => {
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
