SendRemit Astro Site (Astro v5)
===============================

Minimal Astro site for sendremit.com with:

- Rates pages under `/rates/` (index + dynamic `[pair]`)
- Markdown guides under `/guides/`
- Dynamic client-side rate components (no framework required)
- GitHub Pages deployment workflow

Quick Start
-----------

1) Install dependencies (Astro v5 pinned)

```
npm install
```

2) Run locally

```
npm run dev
```

3) Build

```
npm run build
```

4) Deploy to GitHub Pages

- Push to `main`; the included workflow builds and deploys to Pages.
- A `public/CNAME` is included for the custom domain `sendremit.com`.

Project Structure
-----------------

- `src/pages/index.astro` – Home with a featured rate widget and table
- `src/pages/rates/` – Rates index and `[pair].astro` dynamic page
- `src/pages/guides/` – Markdown guides with an index
- `src/pages/404.astro` – Custom 404 page (emits `404.html`)
- `src/pages/sitemap.xml.ts` – Generated sitemap including guides and sample rates
- `src/components/RateWidget.astro` – Live single-pair converter widget
- `src/components/RateTable.astro` – Live table of rates
- `public/data/rates.json` – Sample JSON feed used locally
- `src/layouts/` – Base and Guide layouts
- `public/robots.txt` – Robots with sitemap reference

Rates JSON Format
-----------------

The dynamic components fetch from `apiUrl` (default `/data/rates.json`). Expected format:

```
{
  "updatedAt": "2025-01-01T00:00:00Z",
  "rates": {
    "USD-PHP": { "rate": 58.45, "fee": 2.0, "delivery": "Bank, Cash Pickup" },
    "USD-MXN": { "rate": 18.12, "fee": 1.5, "delivery": "Bank" }
  }
}
```

You can point components at a live endpoint with the `apiUrl` prop; e.g. in a page:

```
<RateWidget pair="USD-PHP" apiUrl="https://api.sendremit.com/rates" />
```

Notes
-----

- The site is static (`output: 'static'`) and safe for GitHub Pages.
- Client-side scripts handle fetching and DOM updates; no integrations needed.
- If your API is on a different origin, ensure CORS headers allow `GET` from the site.

Versioning
----------

- Astro is pinned to `5.15.3` for reproducible builds.
- Node `>= 18.14.0` (Node 20 recommended; CI uses Node 20).
- To upgrade in the future, update `package.json` and reinstall.
