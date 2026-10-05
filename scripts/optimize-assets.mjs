import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const appDir = path.join(rootDir, "src", "app");

async function optimizeImages() {
  const backup = path.join(publicDir, "favicon-original.png");
  const sourceIcon = fs.existsSync(backup) ? backup : path.join(publicDir, "favicon.png");

  if (!fs.existsSync(backup) && fs.existsSync(sourceIcon)) {
    fs.copyFileSync(sourceIcon, backup);
  }

  const iconBuffer = fs.readFileSync(sourceIcon);

  // 1. Generate 32x32 favicon
  await sharp(iconBuffer)
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "favicon-32x32.png"));

  // 2. Generate 48x48 standard favicon.png
  await sharp(iconBuffer)
    .resize(48, 48)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "favicon.png"));

  // 3. Generate 180x180 apple touch icons
  await sharp(iconBuffer)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  await sharp(iconBuffer)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, "apple-icon.png"));

  // 4. Generate 192x192 app icon
  await sharp(iconBuffer)
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(appDir, "icon.png"));

  // 5. Generate 512x512 pwa icon
  await sharp(iconBuffer)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "icon-512.png"));

  // 6. Optimize avatar.jpg -> avatar.webp
  const avatarPath = path.join(publicDir, "avatar.jpg");
  if (fs.existsSync(avatarPath)) {
    const avatarData = fs.readFileSync(avatarPath);
    await sharp(avatarData)
      .resize(400, 400, { fit: "cover" })
      .webp({ quality: 85 })
      .toFile(path.join(publicDir, "avatar.webp"));
  }

  // 7. Clean SVG icon
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#g)" />
  <text x="50" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" fill="#ffffff" text-anchor="middle">Y</text>
</svg>`;
  fs.writeFileSync(path.join(publicDir, "icon.svg"), svgContent);

  console.log("✓ Assets successfully optimized!");
}

optimizeImages().catch(console.error);
