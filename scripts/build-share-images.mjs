// Builds the static link-preview assets:
//   app/opengraph-image.jpg + app/twitter-image.jpg — 1200×630 frame of the hero
//   app/apple-icon.png — 180×180 home-screen / iMessage icon from app/icon.svg
//
// The preview is a real screenshot of the page, so it stays faithful to the
// design. Run it against a production server with Google Chrome installed:
//   npm run build && npm start   (in another terminal)
//   npm run share-images -- http://localhost:3000
import { chromium } from "playwright-core";
import sharp from "sharp";
import { copyFile, stat } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const app = path.join(process.cwd(), "app");

await sharp(path.join(app, "icon.svg"), { density: 400 })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(path.join(app, "apple-icon.png"));

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  // Reduced motion renders the settled frame: no grain flicker or mid-intro states.
  reducedMotion: "reduce",
});
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const png = await page.screenshot({ type: "png" });
await browser.close();

const og = path.join(app, "opengraph-image.jpg");
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(og);
await copyFile(og, path.join(app, "twitter-image.jpg"));

const { size } = await stat(og);
console.log(`opengraph-image.jpg 1200x630 ${(size / 1024).toFixed(0)} KB, apple-icon.png 180x180`);
