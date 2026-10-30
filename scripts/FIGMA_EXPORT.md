# Hollow → Figma (all screens)

**Figma file:** [Hollow — All screens (capture)](https://www.figma.com/design/7HZoSj771NtrqwTyCF2UK1)

## Prerequisites

1. `powershell -ExecutionPolicy Bypass -File serve.ps1` (port **8080**)
2. Figma MCP connected in Cursor
3. Capture script in `index.html` (html-to-design)

## Cursor Agent workflow

For each screen in `figma-capture-screens.json`:

1. `generate_figma_design` with `fileKey` + `sessionId` → new `captureId`
2. Open `node scripts/batch-figma-capture.mjs url <screen> <captureId>` output in browser **or** run:
   `node scripts/run-figma-capture-playwright.mjs <screen> <captureId>`
3. Poll `generate_figma_design` with same `fileKey` + `captureId` until **completed**
4. `node scripts/batch-figma-capture.mjs mark <screen> <figma-node-url>`

### Batch submit (Playwright)

After filling `figma-capture-queue.json` with `screen → captureId` pairs:

```powershell
node scripts/run-figma-capture-batch.mjs
```

Then poll every ID in `figma-capture-progress.json` → `pending` via Figma MCP.

## Batch status

**All design-capture screens** (see `figma-capture-screens.json`) are tracked in `figma-capture-progress.json`. After-you-buy subsections include Policy Doctor (pick, summary, clause), Support cases (list, create, detail), motor help (hub, garages, roadside), network hospitals, plus policy detail and claim start/detail.

## Viewport

**390px width**, height grows with page content (min 844px). Captures use `figmaselector=#app`, `design-capture` CSS (no viewport clipping — full scroll height), and **deviceScaleFactor 1** so Figma frame width matches CSS pixels.

**Re-export after width fix:** existing frames in Figma stay wrong until you capture again. Reset `completed` in `figma-capture-progress.json` (or use a new Figma page), generate new capture IDs, run `node scripts/run-figma-capture-batch.mjs`, then poll.

## Fonts

Install **DM Sans** in your Figma org if text looks wrong.
