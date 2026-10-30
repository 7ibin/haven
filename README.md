# Hollow

Hollow is a **mobile-first design prototype** of an India insurance aggregator: compare **Health**, **Motor**, **Term Life**, and **Home** plans in one place, with quote wizards, plan comparison, checkout, policies, claims, and an AI assistant. It is static HTML/CSS/JavaScript with no build step.

## Run locally

**Recommended (Windows):**

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open **http://localhost:8080**

**Any static HTTP server** from the project root also works, for example:

```bash
npx --yes serve -p 8080
```

```bash
python -m http.server 8080
```

Use the site root URL so paths like `icons/apple-touch-icon.png` and `manifest.webmanifest` resolve correctly.

## Product scope

| In scope | Out of scope (removed from this build) |
|----------|----------------------------------------|
| Health, Motor, Term Life, Home | Travel, Pet, Commercial, Investment / ULIP |

Flows include quote wizards, results (with loading / empty / error UI), compare (health), checkout, renewals, expert callback modal, Hollow AI panel, Policy Doctor, and case/claim prototypes.

## Known limitations

- **Illustrative data** — Plan premiums, ratings, claim ratios, insurer lists, and policy content are sample data for UX demonstration, not live insurer feeds. The footer notes that ratings and claim ratios are illustrative.
- **Design prototype** — Not a licensed insurance broker or web aggregator; no real underwriting or binding quotes.
- **Test payment** — Checkout simulates payment success/failure; no real money movement or insurer APIs.
- **Auth & OTP** — Sign-up uses a demo OTP shown in the UI for testing.

## Project layout

| File / folder | Purpose |
|---------------|---------|
| `index.html` | Shell, PWA links, modals |
| `app.js` | Application logic |
| `styles.css` | Layout and themes (light / dark) |
| `icons.js` | Icon helper (Material Symbols) |
| `manifest.webmanifest` | Web app manifest |
| `icons/` | `hollow-icon.svg`, `apple-touch-icon.png`, `og-image.png` |
| `serve.ps1` | Local dev server on port 8080 |

## Design capture (optional)

For screenshots or design handoff, deep links are supported (not shown in the UI), e.g. `?nosplash=1&screen=health-results` or `?theme=dark`. See `DESIGN_CAPTURE_SCREENS` in `app.js` for screen names.
