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
- `public/data/rates.json` – Sample JSON feed (not required; components default to open.er-api.com)
- `src/layouts/` – Base and Guide layouts
- `public/robots.txt` – Robots with sitemap reference

Data Source
-----------

- By default, both `RateWidget` and `RateTable` use the public endpoint `https://open.er-api.com/v6/latest` client‑side and compute the pair rate as `rates[QUOTE]` from the returned base.
- You can override with a custom source by passing `apiUrl` (as a base URL that ends with `/latest`):

```
<RateWidget pair="USD-PHP" apiUrl="https://open.er-api.com/v6/latest" />
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
