/* Minimal sitemap generator using known routes, guides, and sample rates */
import { readFile } from 'node:fs/promises';

const SITE = 'https://sendremit.com';

function url(loc: string) {
  return `<url><loc>${SITE}${loc}</loc></url>`;
}

export async function GET() {
  const staticRoutes = ['/', '/rates/', '/guides/', '/how-we-compare/'];

  // Guides discovered from local pages
  const guideMods = import.meta.glob('./guides/*.md', { eager: true });
  const guideUrls = Object.keys(guideMods)
    .map((p) => p.replace('./', '/').replace(/\.md$/, '/'));

  // Rates pairs discovered from sample data (if present)
  let pairUrls: string[] = [];
  try {
    const raw = await readFile(new URL('../../public/data/rates.json', import.meta.url));
    const data = JSON.parse(String(raw));
    const pairs = Object.keys(data?.rates ?? {});
    pairUrls = pairs.map((p) => `/rates/${p}/`);
  } catch {
    // ignore if file missing
  }

  const urls = [...new Set([...staticRoutes, ...guideUrls, ...pairUrls])]
    .map((p) => (p.endsWith('/') ? p : p + '/'));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map(url).join('') +
    `</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
  });
}
