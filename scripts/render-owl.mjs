// One-off: renders the no-WebGL fallback image of the owl from the live viewer.
import { chromium } from 'playwright';
import sharp from 'sharp';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await page.goto(process.argv[2] ?? 'http://localhost:4321/mikey');
const canvas = page.locator('[data-mikey3d] canvas');
await canvas.waitFor({ timeout: 20000 });
await page.waitForTimeout(2500);
await sharp(await canvas.screenshot({ omitBackground: true })).resize(800).webp({ quality: 80 }).toFile('public/mikey/owl.webp');
console.log('saved public/mikey/owl.webp');
await browser.close();
