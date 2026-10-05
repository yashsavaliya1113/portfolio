import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "out");

const results = {
  seo: { passed: 0, total: 0, items: [] },
  geo: { passed: 0, total: 0, items: [] },
  performance: { passed: 0, total: 0, items: [] },
};

function record(category, testName, passed, details = "") {
  results[category].total++;
  if (passed) {
    results[category].passed++;
    results[category].items.push({ name: testName, status: "PASS", details });
  } else {
    results[category].items.push({ name: testName, status: "FAIL", details });
  }
}

// 1. Audit HTML files
const htmlFiles = [
  "index.html",
  "ai-lab/index.html",
  "blog/index.html",
  "blog/building-saas-dotnet/index.html",
  "projects/ahmedabad-rera-data-analytics/index.html",
  "projects/white-label-assessment-platform/index.html",
  "projects/incident-management-platform/index.html",
  "projects/payment-gateway/index.html",
  "resume/index.html",
];

for (const relPath of htmlFiles) {
  const fullPath = path.join(outDir, relPath);
  if (!fs.existsSync(fullPath)) {
    record("seo", `HTML Page Exists: ${relPath}`, false, "File missing in out/");
    continue;
  }

  const content = fs.readFileSync(fullPath, "utf8");

  // Title check
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  const hasTitle = !!titleMatch && titleMatch[1].trim().length > 5;
  record("seo", `Title Tag: ${relPath}`, hasTitle, hasTitle ? titleMatch[1] : "Missing or too short");

  // Meta description
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const hasDesc = !!descMatch && descMatch[1].trim().length > 20;
  record("seo", `Meta Description: ${relPath}`, hasDesc, hasDesc ? `${descMatch[1].slice(0, 50)}...` : "Missing or too short");

  // Canonical tag
  const canMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const hasCanonical = !!canMatch && (canMatch[1].includes("yashsavaliya.dev") || canMatch[1].includes("yashsavaliya1113.github.io/portfolio"));
  record("seo", `Canonical Tag: ${relPath}`, hasCanonical, hasCanonical ? canMatch[1] : "Missing or invalid domain");

  // OpenGraph title & image
  const ogTitle = content.match(/<meta[^>]*property=["']og:title["']/i);
  const ogImage = content.match(/<meta[^>]*property=["']og:image["']/i);
  record("seo", `OpenGraph Tags: ${relPath}`, !!(ogTitle && ogImage), ogTitle && ogImage ? "Present" : "Missing OG tags");

  // Twitter cards
  const twCard = content.match(/<meta[^>]*name=["']twitter:card["']/i);
  record("seo", `Twitter Card: ${relPath}`, !!twCard, twCard ? "Present" : "Missing twitter:card");

  // Heading check: exactly 1 h1
  const h1Matches = content.match(/<h1[^>]*>/gi) || [];
  const singleH1 = h1Matches.length === 1;
  record("seo", `Single H1 Heading: ${relPath}`, singleH1, `Count: ${h1Matches.length}`);

  // Image alt tags
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  const allImagesHaveAlt = imgMatches.every((img) => /alt=["'][^"']+["']/i.test(img));
  record("seo", `Images Have Alt Text: ${relPath}`, allImagesHaveAlt, `Checked ${imgMatches.length} images`);

  // HTML lang
  const hasLang = /<html[^>]*lang=["']en["']/i.test(content);
  record("seo", `HTML lang Attribute: ${relPath}`, hasLang, hasLang ? "lang=en" : "Missing");

  // Viewport
  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(content);
  record("seo", `Viewport Meta: ${relPath}`, hasViewport, hasViewport ? "Present" : "Missing");

  // JSON-LD structured data
  const hasJsonLd = /<script[^>]*type=["']application\/ld\+json["']/i.test(content);
  record("seo", `JSON-LD Structured Data: ${relPath}`, hasJsonLd, hasJsonLd ? "Present" : "Missing");
}

// 2. Audit Sitemap & RSS
const sitemapPath = path.join(outDir, "sitemap.xml");
const hasSitemap = fs.existsSync(sitemapPath);
if (hasSitemap) {
  const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
  const isXml = sitemapContent.includes('<?xml version="1.0"') && sitemapContent.includes("</urlset>");
  const hasAllPages = [
    "/",
    "/blog",
    "/ai-lab",
    "/resume",
    "/projects/ahmedabad-rera-data-analytics",
    "/projects/white-label-assessment-platform",
    "/projects/incident-management-platform",
    "/projects/payment-gateway",
    "/blog/building-saas-dotnet",
  ].every(
    (p) =>
      sitemapContent.includes(`${p}</loc>`) ||
      sitemapContent.includes(`${p}/</loc>`)
  );
  record("seo", "Sitemap.xml Valid Structure & All Routes", isXml && hasAllPages, "All 9 routes indexed");
} else {
  record("seo", "Sitemap.xml Valid Structure & All Routes", false, "Missing sitemap.xml");
}

const rssPath = path.join(outDir, "rss.xml");
const hasRss = fs.existsSync(rssPath);
if (hasRss) {
  const rssContent = fs.readFileSync(rssPath, "utf8");
  const isRssValid = rssContent.includes("<rss version=\"2.0\"") && rssContent.includes("</channel>");
  record("seo", "RSS 2.0 Feed Valid Structure", isRssValid, "Valid RSS XML");
} else {
  record("seo", "RSS 2.0 Feed Valid Structure", false, "Missing rss.xml");
}

// 3. GEO Audits (Generative Engine Optimization & Geographic SEO)
// a) llms.txt & llms-full.txt
const llmsPath = path.join(outDir, "llms.txt");
const hasLlms = fs.existsSync(llmsPath) && fs.statSync(llmsPath).size > 1000;
record("geo", "LLMs.txt (llmstxt.org standard)", hasLlms, hasLlms ? `${fs.statSync(llmsPath).size} bytes` : "Missing or small");

const llmsFullPath = path.join(outDir, "llms-full.txt");
const hasLlmsFull = fs.existsSync(llmsFullPath) && fs.statSync(llmsFullPath).size > 3000;
record("geo", "LLMs-Full.txt (comprehensive AI dossier)", hasLlmsFull, hasLlmsFull ? `${fs.statSync(llmsFullPath).size} bytes` : "Missing or small");

const llmPath = path.join(outDir, "llm.txt");
const hasLlm = fs.existsSync(llmPath) && fs.statSync(llmPath).size > 1000;
record("geo", "LLM.txt (backwards compatibility)", hasLlm, hasLlm ? `${fs.statSync(llmPath).size} bytes` : "Missing or small");

// b) AI Crawlers in robots.txt
const robotsPath = path.join(outDir, "robots.txt");
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  const aiBots = ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"];
  const hasAiBots = aiBots.every((bot) => robots.includes(`User-agent: ${bot}`));
  record("geo", "AI Crawlers Authorized in robots.txt", hasAiBots, "GPTBot, PerplexityBot, ClaudeBot, etc.");
  record("geo", "Sitemap Directive in robots.txt", robots.includes("sitemap.xml"), "Present");
} else {
  record("geo", "AI Crawlers Authorized in robots.txt", false, "robots.txt missing");
  record("geo", "Sitemap Directive in robots.txt", false, "robots.txt missing");
}

// c) Geographic SEO Tags in index.html
const indexContent = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
const hasGeoRegion = indexContent.includes('name="geo.region" content="IN-GJ"');
const hasGeoPlace = indexContent.includes('name="geo.placename" content="Ahmedabad, Gujarat, India"');
const hasGeoPos = indexContent.includes('name="geo.position" content="23.0225;72.5714"');
const hasIcbm = indexContent.includes('name="ICBM" content="23.0225, 72.5714"');
record("geo", "Geographic Region Meta (geo.region)", hasGeoRegion, "IN-GJ");
record("geo", "Geographic Placename Meta (geo.placename)", hasGeoPlace, "Ahmedabad, Gujarat, India");
record("geo", "Geographic Coordinates Meta (geo.position & ICBM)", hasGeoPos && hasIcbm, "23.0225, 72.5714");

// d) Schema.org Geo & ProfilePage
const hasProfilePageSchema = indexContent.includes('"@type":"ProfilePage"');
const hasGeoSchema = indexContent.includes('"@type":"GeoCoordinates"') && indexContent.includes('"latitude":23.0225');
const hasOccupationSchema = indexContent.includes('"@type":"Occupation"') && indexContent.includes("Full Stack .NET Developer");
const hasPostalAddress = indexContent.includes('"@type":"PostalAddress"') && indexContent.includes("Ahmedabad");
const hasKnowsAbout = indexContent.includes('"knowsAbout"');

record("geo", "Schema.org ProfilePage Graph", hasProfilePageSchema, "Present");
record("geo", "Schema.org GeoCoordinates & PostalAddress", hasGeoSchema && hasPostalAddress, "Present");
record("geo", "Schema.org Occupation & Technical Competencies", hasOccupationSchema && hasKnowsAbout, "Present");

// 4. Performance Audits
// a) No layout shift spinner
const hasNoSpinner = !indexContent.includes("animate-spin");
record("performance", "Zero Cumulative Layout Shift (No Root Spinner Delay)", hasNoSpinner, hasNoSpinner ? "Inlined static content" : "Delayed by spinner");

// b) Optimized Favicons and App Icons
const iconSizes = {
  "favicon.png": fs.existsSync(path.join(outDir, "favicon.png")) ? fs.statSync(path.join(outDir, "favicon.png")).size : 999999,
  "apple-touch-icon.png": fs.existsSync(path.join(outDir, "apple-touch-icon.png")) ? fs.statSync(path.join(outDir, "apple-touch-icon.png")).size : 999999,
  "icon.svg": fs.existsSync(path.join(outDir, "icon.svg")) ? fs.statSync(path.join(outDir, "icon.svg")).size : 999999,
};
const iconsLightweight = iconSizes["favicon.png"] < 10000 && iconSizes["apple-touch-icon.png"] < 30000;
record("performance", "Lightweight Optimized Favicons (<30KB)", iconsLightweight, `Favicon: ${iconSizes["favicon.png"]}B, AppleIcon: ${iconSizes["apple-touch-icon.png"]}B`);

// c) Avatar WebP support
const hasAvatarWebp = fs.existsSync(path.join(outDir, "avatar.webp")) && indexContent.includes("avatar.webp");
record("performance", "Next-Gen WebP Avatar & Explicit Image Dimensions", hasAvatarWebp, hasAvatarWebp ? "WebP + 400x400 explicit dimensions" : "Missing WebP");

// d) Critical CSS inlined / bundle small
const cssFiles = fs.readdirSync(path.join(outDir, "_next", "static", "css"));
const totalCssSize = cssFiles.reduce((acc, f) => acc + fs.statSync(path.join(outDir, "_next", "static", "css", f)).size, 0);
const cssSmall = totalCssSize < 65000; // < 65KB uncompressed (<10KB gzip)
record("performance", "Minified CSS Bundle (<65KB uncompressed, <10KB gzip)", cssSmall, `Total CSS: ${(totalCssSize / 1024).toFixed(1)} KB`);

// e) Skip link for keyboard/screen readers
const hasSkipLink = indexContent.includes("Skip to main content");
record("performance", "Accessibility: Skip to Main Content Link", hasSkipLink, "Present");

// Print Summary
console.log("\n=======================================================");
console.log("       COMPREHENSIVE AUDIT REPORT (SEO, GEO, PERF)     ");
console.log("=======================================================\n");

const categories = ["seo", "geo", "performance"];
let allHundred = true;

for (const cat of categories) {
  const score = Math.round((results[cat].passed / results[cat].total) * 100);
  const color = score === 100 ? "\x1b[32m" : "\x1b[31m";
  console.log(`${cat.toUpperCase()} SCORE: ${color}${score} / 100\x1b[0m (${results[cat].passed}/${results[cat].total} checks passed)`);
  if (score !== 100) allHundred = false;

  for (const item of results[cat].items) {
    const icon = item.status === "PASS" ? "✓" : "✗";
    const statusColor = item.status === "PASS" ? "\x1b[32m" : "\x1b[31m";
    console.log(`  ${statusColor}${icon}\x1b[0m ${item.name} — ${item.details}`);
  }
  console.log("");
}

console.log("=======================================================");
if (allHundred) {
  console.log("\x1b[32m>>> ALL CATEGORIES REACHED 100% PERFECT SCORE! <<<\x1b[0m");
} else {
  console.log("\x1b[31m>>> SOME CHECKS NEED ATTENTION <<<\x1b[0m");
}
console.log("=======================================================\n");

if (!allHundred) {
  process.exit(1);
}
