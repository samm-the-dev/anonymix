import { test, expect } from '@playwright/test';

const PAGE = '/03-the-hosts-new-session-prototype/create-tape.html';

const waitForData = async (page: import('@playwright/test').Page) => {
  await page.waitForFunction(() => document.querySelector('.card-enter') !== null);
};

test.describe('Create Tape — Layout & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('header shows "New Session"', async ({ page }) => {
    const title = page.locator('#header-title');
    await expect(title).toHaveText('New Session');
  });

  test('first tape card visible with name and desc inputs', async ({ page }) => {
    const card = page.locator('.card-enter');
    await expect(card).toBeVisible();

    // Tape 1 label
    await expect(card).toContainText('Tape 1');

    // Name input
    const nameInput = card.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();

    // Description textarea
    const descTextarea = card.locator('textarea');
    await expect(descTextarea).toBeVisible();
  });
});

test.describe('Create Tape — Add Tape', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('clicking "+ Add another tape" adds a second card', async ({ page }) => {
    const addBtn = page.getByText('+ Add another tape');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // The active card should now say Tape 2
    const card = page.locator('.card-enter');
    await expect(card).toContainText('Tape 2');

    // There should be a spine for Tape 1 above
    const crate = page.locator('#tape-crate');
    const spines = crate.locator('.cursor-pointer');
    expect(await spines.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Create Tape — Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('can navigate between tape cards with keyboard arrows', async ({ page }) => {
    // Add a second tape
    await page.getByText('+ Add another tape').click();

    // Now on Tape 2, click body to blur inputs
    await page.locator('body').click();

    // ArrowUp should go back to Tape 1
    await page.keyboard.press('ArrowUp');
    const card = page.locator('.card-enter');
    await expect(card).toContainText('Tape 1');

    // ArrowDown should go to Tape 2
    await page.keyboard.press('ArrowDown');
    const card2 = page.locator('.card-enter');
    await expect(card2).toContainText('Tape 2');
  });
});

test.describe('Create Tape — Next Button Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('Next button disabled until tape name is entered', async ({ page }) => {
    const nextBtn = page.locator('#next-details-btn');
    await expect(nextBtn).toBeDisabled();

    // Type a tape name
    const nameInput = page.locator('.card-enter input[type="text"]');
    await nameInput.fill('Test Tape');

    await expect(nextBtn).toBeEnabled();
  });
});

test.describe('Create Tape — Session Details Step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('filling tape name enables "Next: Session Details", clicking shows details step', async ({ page }) => {
    // Fill tape name
    const nameInput = page.locator('.card-enter input[type="text"]');
    await nameInput.fill('Two-Face aka Harvey Dent');

    // Click next
    const nextBtn = page.locator('#next-details-btn');
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Details step should be visible
    const detailsStep = page.locator('#step-details');
    await expect(detailsStep).toBeVisible();

    // Tapes step should be hidden
    const tapesStep = page.locator('#step-tapes');
    await expect(tapesStep).not.toBeVisible();

    // Session name input visible
    const sessionNameInput = page.locator('#session-name');
    await expect(sessionNameInput).toBeVisible();

    // Session desc input visible
    const sessionDescInput = page.locator('#session-desc');
    await expect(sessionDescInput).toBeVisible();

    // Timing info visible
    await expect(page.getByText('Submit window')).toBeVisible();
    await expect(page.getByText('Comment window')).toBeVisible();
  });
});

test.describe('Create Tape — Create Session Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
    await waitForData(page);
  });

  test('filling session name enables "Create Session", clicking shows celebration with invite link', async ({ page }) => {
    // Fill tape name and go to details
    const nameInput = page.locator('.card-enter input[type="text"]');
    await nameInput.fill('Two-Face aka Harvey Dent');
    await page.locator('#next-details-btn').click();

    // Create button should be disabled
    const createBtn = page.locator('#create-btn');
    await expect(createBtn).toBeDisabled();

    // Fill session name
    const sessionNameInput = page.locator('#session-name');
    await sessionNameInput.fill('Comic Book Fuckery');

    // Create button should now be enabled
    await expect(createBtn).toBeEnabled();

    // Click create
    await createBtn.click();

    // Celebration step should be visible
    const celebrationStep = page.locator('#step-celebration');
    await expect(celebrationStep).toBeVisible();

    // Session name in celebration
    const celebrationName = page.locator('#celebration-name');
    await expect(celebrationName).toHaveText('Comic Book Fuckery');

    // Invite link should be populated
    const inviteLink = page.locator('#invite-link');
    const linkVal = await inviteLink.inputValue();
    expect(linkVal).toContain('comic-book-fuckery');

    // Share button visible
    await expect(page.getByText('Share with friends')).toBeVisible();
  });
});

test.describe('Create Tape — Console Errors', () => {
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
