// Post-build audit of the static export in out/. Fails the build (exit 1) on any problem.
// Checks SEO metadata, structured data, sitemap/robots, internal links and anchors, and a few performance guards.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://yashsavaliya1113.github.io/portfolio").replace(/\/$/, "");
const BASE = new URL(SITE).pathname.replace(/\/$/, ""); // "/portfolio"

const results = {};
function record(category, name, passed, details = "") {
  (results[category] ??= { passed: 0, total: 0, items: [] });
  results[category].total++;
  if (passed) results[category].passed++;
  results[category].items.push({ name, status: passed ? "PASS" : "FAIL", details });
}

// ---- Collect every page from the sitemap (single source of truth) -----------
const sitemapPath = path.join(outDir, "sitemap.xml");
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
record("sitemap", "sitemap.xml exists and is well-formed", sitemap.includes("<urlset") && sitemap.includes("</urlset>") && locs.length > 0, `${locs.length} URLs`);
record("sitemap", "All sitemap URLs use the site origin and a trailing slash", locs.every((l) => l.startsWith(SITE) && l.endsWith("/")));
record("sitemap", "No duplicate sitemap URLs", new Set(locs).size === locs.length);

const fileFor = (url) => {
  const rel = url.slice(SITE.length).replace(/^\//, "");
  return path.join(outDir, rel, "index.html");
};

const seenTitles = new Map();
const seenDescs = new Map();
const pages = new Map(); // url -> html

for (const loc of locs) {
  const file = fileFor(loc);
  const exists = fs.existsSync(file);
  record("pages", `Page exists: ${loc}`, exists);
  if (!exists) continue;
  const html = fs.readFileSync(file, "utf8");
  pages.set(loc, html);

  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
  record("seo", `Title 10-70 chars: ${loc}`, title.length >= 10 && title.length <= 70, `"${title}" (${title.length})`);
  seenTitles.set(title, [...(seenTitles.get(title) ?? []), loc]);

  const desc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1]?.trim() ?? "";
  record("seo", `Description 70-170 chars: ${loc}`, desc.length >= 70 && desc.length <= 170, `${desc.length} chars`);
  seenDescs.set(desc, [...(seenDescs.get(desc) ?? []), loc]);

  const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  record("seo", `Exactly one canonical equal to the page URL: ${loc}`, canonicals.length === 1 && canonicals[0] === loc, canonicals.join(" , ") || "missing");

  const og = ["og:title", "og:description", "og:image", "og:url"].every((p) => new RegExp(`<meta[^>]*property="${p}"`, "i").test(html));
  const tw = ["twitter:card", "twitter:title", "twitter:image"].every((p) => new RegExp(`<meta[^>]*name="${p}"`, "i").test(html));
  record("seo", `Open Graph and Twitter tags: ${loc}`, og && tw);
  const ogUrl = html.match(/<meta[^>]*property="og:url"[^>]*content="([^"]+)"/i)?.[1];
  record("seo", `og:url equals canonical: ${loc}`, ogUrl === loc, ogUrl ?? "missing");

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  record("seo", `Exactly one H1: ${loc}`, h1 === 1, `count ${h1}`);

  const imgs = html.match(/<img[^>]*>/gi) || [];
  record("seo", `All images have alt text: ${loc}`, imgs.every((i) => /\salt="[^"]+"/i.test(i)), `${imgs.length} images`);
  record("seo", `lang and viewport: ${loc}`, /<html[^>]*lang="en"/i.test(html) && /<meta[^>]*name="viewport"/i.test(html));
  record("seo", `No obsolete geo/revisit meta tags: ${loc}`, !/name="(geo\.|ICBM|revisit-after|rating)/i.test(html));

  // JSON-LD: every block must parse, and no phone number may be published in structured data.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let parsed = [];
  let ok = blocks.length > 0;
  for (const b of blocks) {
    try {
      const j = JSON.parse(b);
      parsed.push(...(Array.isArray(j) ? j : [j]));
    } catch {
      ok = false;
    }
  }
  record("schema", `JSON-LD present and valid JSON: ${loc}`, ok, `${parsed.length} objects`);
  record("schema", `No telephone in structured data: ${loc}`, !blocks.some((b) => /"telephone"/.test(b)));
  const types = parsed.map((o) => o["@type"]);
  if (loc.includes("/blog/") && !loc.endsWith("/blog/")) {
    const post = parsed.find((o) => o["@type"] === "BlogPosting");
    record("schema", `BlogPosting complete: ${loc}`, !!post && !!post.headline && !!post.datePublished && !!post.dateModified && post.author?.name === "Yash Savaliya", types.join(","));
    record("schema", `Breadcrumb present: ${loc}`, types.includes("BreadcrumbList"));
    record("blog", `Table of contents and author box: ${loc}`, html.includes("In this article") && html.includes("About the author"));
  }
  if (loc === `${SITE}/`) {
    record("schema", "Home has Person, WebSite, ProfilePage, FAQPage", ["Person", "WebSite", "ProfilePage", "FAQPage"].every((t) => types.includes(t)), types.join(","));
    const person = parsed.find((o) => o["@type"] === "Person");
    record("schema", "Person.sameAs lists the verified GitHub profile", person?.sameAs?.includes("https://github.com/yashsavaliya1113"), (person?.sameAs || []).join(" , "));
  }
}
for (const [t, list] of seenTitles) record("seo", `Unique title: "${t.slice(0, 50)}"`, list.length === 1, list.join(" , "));
for (const [d, list] of seenDescs) record("seo", `Unique description: "${d.slice(0, 40)}..."`, list.length === 1, list.join(" , "));

// ---- Internal links and anchors ------------------------------------------------
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const pageCache = new Map();
const loadPage = (file) => {
  if (!pageCache.has(file)) pageCache.set(file, fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null);
  return pageCache.get(file);
};
let broken = [];
let checked = 0;
for (const [loc, html] of pages) {
  for (const m of html.matchAll(/<a[^>]*\shref="([^"]+)"/gi)) {
    let href = m[1].replace(/&amp;/g, "&");
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;
    if (/^https?:\/\//.test(href) && !href.startsWith(SITE)) continue; // external links are not fetched here
    checked++;
    let [p, hash] = href.split("#");
    p = p.startsWith("http") ? p.slice(SITE.length) : p;
    if (p.startsWith(BASE)) p = p.slice(BASE.length);
    if (p === "") p = new URL(loc).pathname.slice(BASE.length) || "/";
    const target = path.join(outDir, p.replace(/^\//, ""), p.endsWith(".pdf") || p.endsWith(".xml") || p.endsWith(".txt") ? "" : "index.html");
    const content = loadPage(target);
    if (content === null && !fs.existsSync(target)) {
      broken.push(`${loc} -> ${href}`);
      continue;
    }
    if (hash && content && !idsOf(content).has(hash)) broken.push(`${loc} -> ${href} (missing #${hash})`);
  }
}
record("links", "No broken internal links or anchors", broken.length === 0, broken.length ? broken.slice(0, 8).join(" | ") : `${checked} links checked`);
console.log(`Internal links checked: ${checked}`);

// ---- Special files -----------------------------------------------------------------
const robots = fs.existsSync(path.join(outDir, "robots.txt")) ? fs.readFileSync(path.join(outDir, "robots.txt"), "utf8") : "";
record("robots", "robots.txt allows crawling and lists the sitemap", /User-agent: \*/.test(robots) && !/Disallow: \/\s*$/m.test(robots) && robots.includes(`${SITE}/sitemap.xml`));
record("robots", "rss.xml is valid", fs.existsSync(path.join(outDir, "rss.xml")) && fs.readFileSync(path.join(outDir, "rss.xml"), "utf8").includes("</channel>"));
const nf = path.join(outDir, "404.html");
const nfHtml = fs.existsSync(nf) ? fs.readFileSync(nf, "utf8") : "";
record("robots", "Custom 404 page exists and is noindex", nfHtml.includes("Page not found") && /noindex/.test(nfHtml));
record("robots", "llms.txt exists", fs.existsSync(path.join(outDir, "llms.txt")));

// ---- Performance guards ---------------------------------------------------------------
const cssDir = path.join(outDir, "_next", "static", "css");
const cssSize = fs.existsSync(cssDir) ? fs.readdirSync(cssDir).reduce((a, f) => a + fs.statSync(path.join(cssDir, f)).size, 0) : 0;
record("performance", "CSS bundle under 65 KB", cssSize > 0 && cssSize < 65000, `${(cssSize / 1024).toFixed(1)} KB`);
const home = pages.get(`${SITE}/`) ?? "";
record("performance", "Home hero has no entrance animation on the H1 (LCP)", !/<h1[^>]*animate-/.test(home));
record("performance", "Avatar served as WebP with explicit dimensions", home.includes("avatar.webp") && /<img[^>]*width="400"[^>]*height="400"/.test(home));
record("performance", "Skip link present", home.includes("Skip to main content"));

// ---- Report ---------------------------------------------------------------------------------
console.log("\n==================== BUILD AUDIT ====================\n");
let failed = 0;
for (const [cat, r] of Object.entries(results)) {
  console.log(`${cat.toUpperCase()}: ${r.passed}/${r.total} passed`);
  for (const i of r.items) {
    if (i.status === "FAIL") {
      failed++;
      console.log(`  ✗ ${i.name}${i.details ? ` — ${i.details}` : ""}`);
    }
  }
}
console.log(failed === 0 ? "\nAll checks passed.\n" : `\n${failed} check(s) FAILED.\n`);
process.exit(failed === 0 ? 0 : 1);
