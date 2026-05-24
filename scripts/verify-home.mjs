import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const base = 'https://docteurmeo.github.io/WWF-CoBien-Site';
const criticalAssets = [
  'assets/figma-home/hero-fish.png',
  'assets/figma-home/hero-turtle.png',
  'assets/figma-home/s5-plant-long.png',
  'assets/figma-home/s5-plant-round.png',
  'assets/figma-home/hero-main.jpg',
  'assets/figma-home/hero-grass.svg',
  'assets/figma-home/s5-grass.svg',
];

function localCheck() {
  const missing = [];
  for (const asset of criticalAssets) {
    for (const dir of ['public', 'docs']) {
      const path = resolve(dir, asset);
      if (!existsSync(path)) missing.push(path);
    }
  }
  if (missing.length) throw new Error(`Missing local assets:\n${missing.join('\n')}`);
  console.log(`Local assets OK (${criticalAssets.length} critical assets in public/docs)`);
}

async function head(url) {
  const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
}

async function productionCheck() {
  const html = readFileSync(resolve('docs/index.html'), 'utf8');
  const builtAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((url) => url.startsWith('/WWF-CoBien-Site/assets/'))
    .map((url) => url.replace('/WWF-CoBien-Site/', ''));

  const urls = [...new Set([...criticalAssets, ...builtAssets])].map((asset) => `${base}/${asset}`);
  const failures = [];
  for (const url of urls) {
    try {
      await head(url);
    } catch (error) {
      failures.push(error.message);
    }
  }
  if (failures.length) throw new Error(`Production URL failures:\n${failures.join('\n')}`);
  console.log(`Production URLs OK (${urls.length} checked)`);
}

function screenshots() {
  const url = 'http://127.0.0.1:5174/WWF-CoBien-Site/home';
  for (const [size, file] of [['1440,1200', 'verify-home-1440.png'], ['1920,1200', 'verify-home-1920.png']]) {
    execSync(`npx playwright screenshot --viewport-size=${size} --full-page ${url} ${file}`, { stdio: 'inherit' });
  }
  console.log('Screenshots OK: verify-home-1440.png, verify-home-1920.png');
}

localCheck();
await productionCheck();
if (process.env.SKIP_SCREENSHOTS !== '1') screenshots();
