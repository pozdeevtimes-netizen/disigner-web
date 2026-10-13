#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node inspect-site.mjs http://127.0.0.1:3000 --out /tmp/site-review [--module /absolute/node_modules/playwright] [--browser chromium|firefox|webkit]\nRun from the website project. Review PNGs and test the main user flow manually.');
    return;
  }
  const target = new URL(args.shift());
  if (!['http:', 'https:'].includes(target.protocol)) throw new Error('Only HTTP(S) URLs are supported');
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!['--out', '--module', '--browser'].includes(args[i]) || !args[i + 1]) throw new Error('Invalid arguments; use --help');
    options[args[i]] = args[i + 1];
  }
  if (!options['--out']) throw new Error('Specify --out for temporary review artifacts');
  const output = resolve(options['--out']);
  const browserName = options['--browser'] ?? 'chromium';
  if (!['chromium', 'firefox', 'webkit'].includes(browserName)) throw new Error('Unsupported browser');
  const require = createRequire(join(process.cwd(), 'package.json'));
  let playwright;
  try { playwright = require(options['--module'] ? resolve(options['--module']) : 'playwright'); }
  catch { throw new Error('Playwright is unavailable. Run from a project with Playwright or supply --module; otherwise use an available browser tool.'); }
  await mkdir(output, { recursive: true });
  const browser = await playwright[browserName].launch({ headless: true });
  const report = { url: target.href, browser: browserName, checkedAt: new Date().toISOString(), pages: [] };
  try {
    for (const spec of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 },
      { name: 'mobile-reduced-motion', width: 390, height: 844, reducedMotion: 'reduce' },
    ]) {
      const context = await browser.newContext({ viewport: { width: spec.width, height: spec.height }, reducedMotion: spec.reducedMotion ?? 'no-preference' });
      const page = await context.newPage();
      const errors = [], failedRequests = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
      const response = await page.goto(target.href, { waitUntil: 'load', timeout: 30000 });
      await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
      // Settle image decoding without an unbounded network-idle wait.
      await page.evaluate(async () => Promise.race([
        Promise.all([...document.images].filter((image) => image.complete).map((image) => image.decode?.().catch(() => {}))),
        new Promise((done) => setTimeout(done, 1000)),
      ]));
      const findings = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const visible = (node) => { const style = getComputedStyle(node); return style.display !== 'none' && style.visibility !== 'hidden' && node.getClientRects().length > 0; };
        return {
          title: document.title,
          horizontalOverflow: document.documentElement.scrollWidth > width + 2,
          overflowCandidates: [...document.querySelectorAll('body *')].filter(visible).filter((node) => { const box = node.getBoundingClientRect(); return box.width > 0 && (box.left < -2 || box.right > width + 2); }).slice(0,15).map((node) => ({ tag: node.tagName, id: node.id, class: String(node.className).slice(0,160) })),
          brokenImages: [...document.images].filter(visible).filter((image) => image.complete && !image.naturalWidth).map((image) => image.currentSrc || image.src),
          imagesWithoutAlt: [...document.images].filter(visible).filter((image) => !image.hasAttribute('alt')).map((image) => image.currentSrc || image.src),
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        };
      });
      const screenshot = join(output, `${spec.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
      report.pages.push({ viewport: spec, status: response?.status() ?? null, screenshot, errors, failedRequests, ...findings });
      await context.close();
    }
  } finally { await browser.close(); }
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2));
  const problems = report.pages.filter((page) => (page.status ?? 500) >= 400 || page.errors.length || page.failedRequests.length || page.horizontalOverflow || page.brokenImages.length || page.imagesWithoutAlt.length);
  console.log(JSON.stringify({ output, viewports: report.pages.length, pagesWithFindings: problems.length, manualReviewRequired: true }, null, 2));
  if (problems.length) process.exitCode = 2;
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
