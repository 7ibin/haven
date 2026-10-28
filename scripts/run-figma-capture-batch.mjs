/**
 * Sequentially opens each screen in figma-capture-queue.json (Playwright 390×844).
 * After this runs, poll each captureId via Figma MCP generate_figma_design until completed.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { buildCaptureUrl } from './batch-figma-capture.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const queuePath = join(__dirname, 'figma-capture-queue.json');
const progressPath = join(__dirname, 'figma-capture-progress.json');

const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
const screenConfig = JSON.parse(
  readFileSync(join(__dirname, 'figma-capture-screens.json'), 'utf8'),
);
const viewport = screenConfig.viewport || { width: 390, height: 844 };
const deviceScaleFactor = screenConfig.deviceScaleFactor ?? 1;
const progress = JSON.parse(readFileSync(progressPath, 'utf8'));
const done = new Set(Object.keys(progress.completed || {}));

const entries = Object.entries(queue.screens).filter(([name]) => !done.has(name));
if (!entries.length) {
  console.log('All queued screens already marked complete in progress.');
  process.exit(0);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: viewport.width, height: viewport.height },
  deviceScaleFactor,
});

const submitted = [];
for (const [screen, captureId] of entries) {
  const url = buildCaptureUrl(screen, captureId, 3500);
  const page = await context.newPage();
  console.log(`[capture] ${screen} → ${captureId}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(9000);
    submitted.push({ screen, captureId });
  } catch (err) {
    console.error(`[error] ${screen}:`, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();

progress.pending = Object.fromEntries(submitted.map((s) => [s.screen, s.captureId]));
writeFileSync(progressPath, JSON.stringify(progress, null, 2));
console.log(JSON.stringify({ submitted: submitted.length, screens: submitted.map((s) => s.screen) }, null, 2));
