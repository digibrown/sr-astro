import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

function pairSvg(pair) {
  const [base, quote] = String(pair).split('-');
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${pair}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b1020"/>
        <stop offset="100%" stop-color="#0e1530"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <!-- Curved lines removed -->
    <g font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" fill="#e7ecff">
      <text x="160" y="180" font-size="56" font-weight="700">SendRemit</text>
      <text x="160" y="232" font-size="28" fill="#a7b0d6">Fast, fair, and transparent remittances</text>
    </g>
    <g font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial" fill="#e7ecff" text-anchor="start">
      <text x="160" y="340" font-size="96" font-weight="800">${base}</text>
      <text x="410" y="340" font-size="72" fill="#a7b0d6">→</text>
      <text x="480" y="340" font-size="96" font-weight="800">${quote}</text>
      <text x="160" y="410" font-size="28" fill="#a7b0d6">Live exchange rate and quick converter</text>
      <text x="160" y="450" font-size="22" fill="#8aa0d0">sendremit.com/rates/${base}-${quote}</text>
    </g>
  </svg>`;
}

async function renderSvgToPng(svgString) {
  const resvg = new Resvg(Buffer.from(svgString), {
    fitTo: { mode: 'width', value: 1200 },
    background: 'transparent',
  });
  const png = resvg.render();
  return png.asPng();
}

async function main() {
  // Base OG image
  const svgPath = new URL('../public/og-image.svg', import.meta.url);
  const pngPath = new URL('../public/og-image.png', import.meta.url);
  const svg = await readFile(svgPath);
  const basePng = await renderSvgToPng(svg);
  await writeFile(pngPath, basePng);
  console.log('Wrote', pngPath.pathname);

  // Per-corridor OG images
  const pairsPath = new URL('../src/data/pairs.json', import.meta.url);
  const rawPairs = JSON.parse(String(await readFile(pairsPath)));
  const outDir = new URL('../public/og/rates/', import.meta.url);
  await mkdir(outDir, { recursive: true });
  for (const p of rawPairs) {
    const img = await renderSvgToPng(pairSvg(p));
    const file = new URL(encodeURIComponent(p) + '.png', outDir);
    await writeFile(file, img);
    console.log('Wrote', file.pathname);
  }
}

main().catch((e) => {
  console.error('OG image generation failed:', e);
  process.exit(1);
});

