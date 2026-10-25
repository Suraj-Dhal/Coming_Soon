// Builds public/figure.webp — the motion-blurred silhouette behind the hero.
// Usage: node scripts/build-figure.mjs <path-to-transparent-portrait.png>
//
// The blur is baked in at build time so the browser only animates transforms
// and opacity, never a live filter on a full-viewport image.
import sharp from "sharp";
import path from "node:path";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/build-figure.mjs <transparent-portrait.png>");
  process.exit(1);
}

const HEIGHT = 640;
const PAD = 140; // room on each side for the horizontal smear
const SMEAR = 71; // horizontal motion-blur kernel width (odd)
const out = path.join(process.cwd(), "public", "figure.webp");

const resized = await sharp(source).resize({ height: HEIGHT }).ensureAlpha().toBuffer();
const { width } = await sharp(resized).metadata();
const padded = await sharp(resized)
  .extend({ left: PAD, right: PAD, top: 40, bottom: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

// sharp needs kernels at least 3px tall, so the blur row sits between two zero rows.
const zeros = new Array(SMEAR).fill(0);
const motion = {
  width: SMEAR,
  height: 3,
  kernel: [...zeros, ...new Array(SMEAR).fill(1), ...zeros],
  scale: SMEAR,
};

// Alpha drives the silhouette; it gets the smear plus a soft gaussian falloff.
const alpha = await sharp(padded).extractChannel(3).convolve(motion).blur(9).linear(1.15, 0).toBuffer();

// Tone keeps faint interior variation (face, shirt) inside a near-black figure.
// Flattening first stops transparent pixels from bleeding light into the edges.
const tone = await sharp(padded)
  .flatten({ background: "#101010" })
  .greyscale()
  .linear(0.18, 10)
  .convolve(motion)
  .blur(7)
  .toBuffer();

await sharp(tone).joinChannel(alpha).webp({ quality: 78, alphaQuality: 80, effort: 6 }).toFile(out);

const meta = await sharp(out).metadata();
console.log(`figure.webp ${meta.width}x${meta.height} (source width ${width})`);
