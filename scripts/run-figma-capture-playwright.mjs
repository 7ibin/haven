/**
 * Opens Hollow capture URLs in headless Chromium (390×844).
 * Pair with Figma MCP: generate captureId per screen, then poll generate_figma_design until completed.
 *
 * Usage: node scripts/run-figma-capture-playwright.mjs <screen> <captureId>
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { buildCaptureUrl } from './batch-figma-capture.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const screen = process.argv[2];
const captureId = process.argv[3];
if (!screen || !captureId) {
  console.error('Usage: node scripts/run-figma-capture-playwright.mjs <screen> <captureId>');
  process.exit(1);
}

const url = buildCaptureUrl(screen, captureId, 3000);
const browser = await chromium.launch({ headless: true });
const screenConfig = JSON.parse(
  readFileSync(join(__dirname, 'figma-capture-screens.json'), 'utf8'),
);
const viewport = screenConfig.viewport || { width: 390, height: 844 };
const deviceScaleFactor = screenConfig.deviceScaleFactor ?? 1;

const context = await browser.newContext({
  viewport: { width: viewport.width, height: viewport.height },
  deviceScaleFactor,
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(8000);
await browser.close();
console.log(JSON.stringify({ screen, captureId, url, ok: true }));
