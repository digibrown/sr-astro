import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

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

  // Favicon from logo.svg -> PNGs -> ICO (PNG-contained)
  const logoSvgPath = new URL('../public/logo.svg', import.meta.url);
  const logoSvg = await readFile(logoSvgPath);
  // 64px PNG
  const icon64 = new Resvg(logoSvg, { fitTo: { mode: 'width', value: 64 }, background: 'transparent' }).render().asPng();
  await writeFile(new URL('../public/favicon-64.png', import.meta.url), icon64);
  // 32px PNG
  const icon32 = new Resvg(logoSvg, { fitTo: { mode: 'width', value: 32 }, background: 'transparent' }).render().asPng();
  await writeFile(new URL('../public/favicon-32.png', import.meta.url), icon32);
  // Minimal ICO container with PNG payload
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // icon type
  icoHeader.writeUInt16LE(1, 4); // count
  const dir = Buffer.alloc(16);
  dir.writeUInt8(32, 0); // width
  dir.writeUInt8(32, 1); // height
  dir.writeUInt8(0, 2); // color count
  dir.writeUInt8(0, 3); // reserved
  dir.writeUInt16LE(1, 4); // planes
  dir.writeUInt16LE(32, 6); // bit count
  dir.writeUInt32LE(icon32.length, 8); // bytes in res
  dir.writeUInt32LE(6 + 16, 12); // image offset
  const ico = Buffer.concat([icoHeader, dir, Buffer.from(icon32)]);
  await writeFile(new URL('../public/favicon.ico', import.meta.url), ico);
  console.log('Wrote /public/favicon.ico');
}

main().catch((e) => {
  console.error('OG image generation failed:', e);
  process.exit(1);
});
