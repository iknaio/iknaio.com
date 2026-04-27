import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'http://localhost:1313';
const SCREENSHOT_DIR = '/home/behas/projects/iknaio-website/qa-screenshots';
mkdirSync(SCREENSHOT_DIR, { recursive: true });

const pages = [
  { path: '/', name: 'home' },
  { path: '/solutions/', name: 'solutions' },
  { path: '/pricing/', name: 'pricing' },
  { path: '/about/', name: 'about' },
  { path: '/blog/', name: 'blog' },
  { path: '/news/', name: 'news' },
  { path: '/contact/', name: 'contact' },
  { path: '/privacy/', name: 'privacy' },
  { path: '/imprint/', name: 'imprint' },
];

const viewports = [
  { width: 375, height: 812, label: 'mobile' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 1280, height: 900, label: 'desktop' },
];

const issues = [];

function logIssue(page, severity, message) {
  issues.push({ page, severity, message });
  console.log(`  [${severity}] ${message}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    // Collect console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logIssue('global', 'error', `Console error: ${msg.text()}`);
      }
    });

    for (const p of pages) {
      const url = `${BASE}${p.path}`;
      console.log(`\nChecking ${p.name} (${viewport.label} ${viewport.width}x${viewport.height})...`);

      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

      // 1. HTTP status
      if (response.status() !== 200) {
        logIssue(p.name, 'error', `HTTP ${response.status()} for ${url}`);
      }

      // 2. Screenshot
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${p.name}-${viewport.label}.png`,
        fullPage: true,
      });

      // 3. Check for broken images
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.src);
      });
      for (const src of brokenImages) {
        logIssue(p.name, 'error', `Broken image: ${src}`);
      }

      // 4. Check for empty sections (no text content)
      const emptySections = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll('section'));
        return sections
          .filter(s => s.textContent.trim().length < 10)
          .map(s => s.className || s.id || 'unnamed-section');
      });
      for (const s of emptySections) {
        logIssue(p.name, 'warning', `Empty or near-empty section: ${s}`);
      }

      // 5. Check nav renders
      const hasNav = await page.evaluate(() => {
        const nav = document.querySelector('.nav');
        return nav && nav.offsetHeight > 0;
      });
      if (!hasNav) {
        logIssue(p.name, 'error', 'Navigation bar not visible');
      }

      // 6. Check footer renders
      const hasFooter = await page.evaluate(() => {
        const footer = document.querySelector('.footer');
        return footer && footer.offsetHeight > 0;
      });
      if (!hasFooter) {
        logIssue(p.name, 'error', 'Footer not visible');
      }

      // 7. Check page title
      const title = await page.title();
      if (!title || title === '') {
        logIssue(p.name, 'error', 'Missing page title');
      }

      // 8. Check meta description
      const metaDesc = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="description"]');
        return meta ? meta.content : null;
      });
      if (!metaDesc) {
        logIssue(p.name, 'warning', 'Missing meta description');
      }

      // 9. Check heading hierarchy (h1 should exist)
      const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
      if (h1Count === 0) {
        logIssue(p.name, 'warning', 'No h1 heading found');
      } else if (h1Count > 1) {
        logIssue(p.name, 'warning', `Multiple h1 headings (${h1Count})`);
      }

      // 10. Check for overlapping/clipped content (basic check)
      const overflowIssues = await page.evaluate(() => {
        const body = document.body;
        return body.scrollWidth > window.innerWidth;
      });
      if (overflowIssues) {
        logIssue(p.name, 'warning', `Horizontal overflow detected at ${viewport.width}px width`);
      }

      // 11. Check all internal links
      if (viewport.label === 'desktop') {
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href^="/"]'))
            .map(a => a.getAttribute('href'))
            .filter((v, i, arr) => arr.indexOf(v) === i);
        });
        for (const link of links) {
          try {
            const r = await page.request.get(`${BASE}${link}`);
            if (r.status() >= 400) {
              logIssue(p.name, 'error', `Broken internal link: ${link} (HTTP ${r.status()})`);
            }
          } catch (e) {
            logIssue(p.name, 'error', `Failed to fetch link: ${link}`);
          }
        }
      }

      // 12. Check CTA buttons exist on homepage
      if (p.name === 'home' && viewport.label === 'desktop') {
        const ctaCount = await page.evaluate(() =>
          document.querySelectorAll('.btn-primary').length
        );
        if (ctaCount === 0) {
          logIssue(p.name, 'warning', 'No primary CTA buttons on homepage');
        }
      }

      // 13. Check dark mode renders without errors
      if (viewport.label === 'desktop') {
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'dark');
        });
        await page.waitForTimeout(300);
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/${p.name}-dark.png`,
          fullPage: true,
        });
        // Reset
        await page.evaluate(() => {
          document.documentElement.setAttribute('data-theme', 'light');
        });
      }
    }

    await context.close();
  }

  await browser.close();

  // Generate report
  console.log('\n\n========================================');
  console.log('  QA REPORT');
  console.log('========================================\n');

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  console.log(`Total issues: ${issues.length} (${errors.length} errors, ${warnings.length} warnings)\n`);

  if (errors.length > 0) {
    console.log('ERRORS:');
    errors.forEach(i => console.log(`  [${i.page}] ${i.message}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('WARNINGS:');
    warnings.forEach(i => console.log(`  [${i.page}] ${i.message}`));
    console.log('');
  }

  if (issues.length === 0) {
    console.log('No issues found!');
  }

  // Write report file
  const report = {
    timestamp: new Date().toISOString(),
    summary: { total: issues.length, errors: errors.length, warnings: warnings.length },
    issues,
    pages: pages.map(p => p.name),
    viewports: viewports.map(v => v.label),
  };
  writeFileSync(`${SCREENSHOT_DIR}/report.json`, JSON.stringify(report, null, 2));
  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}/`);
  console.log(`Report saved to: ${SCREENSHOT_DIR}/report.json`);
}

run().catch(err => {
  console.error('QA check failed:', err);
  process.exit(1);
});
