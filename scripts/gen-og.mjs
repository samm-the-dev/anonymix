/**
 * OG banner screenshot generator
 *
 * Renders public/og-banner.html via Playwright and saves the result
 * to public/og-banner.png (1200x630).
 *
 * Usage:  npm run gen:og
 *    or:  node scripts/gen-og.mjs
 */

import { chromium } from 'playwright';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const htmlPath = `file://${resolve(__dirname, '../public/og-banner.html')}`;
const outPath = resolve(__dirname, '../public/og-banner.png');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(htmlPath, { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

console.log('Wrote', outPath);
