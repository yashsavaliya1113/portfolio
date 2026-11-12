// Full quality gate for the BUILT site (out/). Detects problems and writes them as machine-readable issues.
//
//   npm run build && node scripts/quality-gate.mjs
//
// Checks: the repo audit (metadata, JSON-LD, sitemap, links, GEO facts), Lighthouse (accessibility, best practices and SEO
// must be 100; performance is reported only, because it varies between runs), axe-core (WCAG 2.2 AA, light and dark),
// and the W3C Nu HTML validator.
//
// Output (in ./quality, or QUALITY_OUT): issues.json, report.md. Exit code is always 0; read the counts.
// Set QUALITY_FAST=1 to skip Lighthouse. If GITHUB_OUTPUT is set, `issues=<n>` is written to it.
import fs from "fs";
import path from "path";
import { spawn, spawnSync } from "child_process";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const OUT = process.env.QUALITY_OUT || path.join(root, "quality");
const PORT = Number(process.env.QUALITY_PORT || 3333);
const BASE = `http://localhost:${PORT}/portfolio`;
const SITE = "https://yashsavaliya1113.github.io/portfolio";
fs.mkdirSync(path.join(OUT, "lh"), { recursive: true });

const issues = [];
const add = (tool, page, id, message, hint = "") => issues.push({ tool, page, id, message: String(message).slice(0, 400), hint });
const log = (m) => console.log(m);

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(2);
}

// ---------------------------------------------------------------- 1. repo audit
function audit() {
  log("1/4 repo audit (metadata, JSON-LD, sitemap, links, GEO)");
  const r = spawnSync("node", ["scripts/audit-all.mjs"], { cwd: root, encoding: "utf8" });
  for (const line of r.stdout.split("\n")) {
    const m = line.match(/^\s+✗ (.*?)(?: — (.*))?$/);
    if (m) add("audit", "", "audit", m[1] + (m[2] ? `: ${m[2]}` : ""), "See scripts/audit-all.mjs for what this check requires.");
  }
}

// ---------------------------------------------------------------- local server
let server;
async function startServer() {
  server = spawn("node", ["scripts/test-server.mjs"], { cwd: root, stdio: "ignore", env: { ...process.env, PORT: String(PORT) } });
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("test server did not start");
}

// ---------------------------------------------------------------- 2. Lighthouse
function sitemapPaths() {
  const sm = fs.readFileSync(path.join(outDir, "sitemap.xml"), "utf8");
  return [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");
}

function lighthouse() {
  if (process.env.QUALITY_FAST) return log("2/4 Lighthouse skipped (QUALITY_FAST)");
  const paths = sitemapPaths();
  // A representative sample keeps CI time reasonable: home, listings, resume, the newest article and one project.
  const posts = paths.filter((p) => /^\/blog\/[^/]+\/$/.test(p));
  const newest = posts[posts.length - 1];
  const sample = ["/", "/ai-lab/", "/blog/", "/resume/", "/incident-analytics/", posts[0], newest, paths.find((p) => p.startsWith("/projects/"))].filter(Boolean);
  const pages = [...new Set(sample)];
  log(`2/4 Lighthouse on ${pages.length} pages x mobile+desktop`);
  let n = 0;
  for (const p of pages) {
    for (const preset of ["mobile", "desktop"]) {
      const file = path.join(OUT, "lh", `${++n}.json`);
      // One quoted command string keeps the Chrome flags intact in both bash and cmd.
      const cmd = `npx --yes lighthouse@12 "${BASE}${p}" --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="${file}" --only-categories=performance,accessibility,best-practices,seo${preset === "desktop" ? " --preset=desktop" : ""}`;
      spawnSync(cmd, { cwd: root, encoding: "utf8", shell: true, timeout: 180000 });
      if (!fs.existsSync(file)) {
        add("lighthouse", p, "run-failed", `Lighthouse did not produce a result (${preset})`);
        continue;
      }
      const lh = JSON.parse(fs.readFileSync(file, "utf8"));
      for (const cat of ["accessibility", "best-practices", "seo"]) {
        const c = lh.categories[cat];
        if (c.score >= 1) continue;
        const failing = c.auditRefs
          .map((ref) => lh.audits[ref.id])
          .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual" && a.scoreDisplayMode !== "informative");
        for (const a of failing) {
          const items = (a.details?.items || []).slice(0, 3).map((i) => i.node?.snippet || i.url || i.source?.url || "").filter(Boolean).join(" | ");
          add("lighthouse", p, `${cat}:${a.id}`, `${preset} ${cat} ${Math.round(c.score * 100)}: ${a.title}${items ? ` (${items})` : ""}`, a.description?.split(" [")[0] || "");
        }
      }
      log(`   ${preset.padEnd(7)} ${p.padEnd(48)} perf ${Math.round(lh.categories.performance.score * 100)} a11y ${Math.round(lh.categories.accessibility.score * 100)} bp ${Math.round(lh.categories["best-practices"].score * 100)} seo ${Math.round(lh.categories.seo.score * 100)}`);
    }
  }
}

// ---------------------------------------------------------------- 3. axe
async function axe() {
  log("3/4 axe-core (WCAG 2.2 AA + best practices), dark and light");
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    return add("axe", "", "missing-tool", "playwright is not installed");
  }
  const axeSrc = fs.readFileSync(path.join(root, "node_modules", "axe-core", "axe.min.js"), "utf8");
  const browser = await playwright.chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ colorScheme: theme });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    for (const p of sitemapPaths()) {
      const page = await ctx.newPage();
      try {
        await page.goto(`${BASE}${p}`, { waitUntil: "networkidle", timeout: 60000 });
        await page.waitForTimeout(2500); // let entrance animations finish so contrast is measured on final colours
        await page.evaluate(axeSrc);
        const r = await page.evaluate(() => axe.run({ runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } }));
        for (const v of r.violations) add("axe", p, v.id, `${theme}: ${v.help} (${v.nodes.length} element${v.nodes.length > 1 ? "s" : ""}, e.g. ${v.nodes[0].target.join(" ").slice(0, 100)})`, v.helpUrl);
      } catch (e) {
        add("axe", p, "run-failed", e.message.split("\n")[0]);
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
}

// ---------------------------------------------------------------- 4. W3C Nu HTML validator
function nu() {
  log("4/4 W3C Nu HTML validator");
  const jar = path.join(root, "node_modules", "vnu-jar", "build", "dist", "vnu.jar");
  if (!fs.existsSync(jar)) return add("nu", "", "missing-tool", "vnu-jar is not installed");
  const r = spawnSync("java", ["-jar", jar, "--skip-non-html", "--format", "json", "out"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
  let msgs = [];
  try {
    msgs = JSON.parse(r.stderr || r.stdout).messages;
  } catch {
    return add("nu", "", "run-failed", "could not run the validator (is Java installed?)");
  }
  for (const m of msgs) {
    if ((m.type === "error" || m.subType === "warning") && !/google[0-9a-f]+\.html/.test(m.url)) {
      add("nu", m.url.replace(/.*\/out\//, "/").replace(/index\.html$/, ""), "html", m.message, `line ${m.lastLine}`);
    }
  }
}

// ---------------------------------------------------------------- run
try {
  audit();
  await startServer();
  lighthouse();
  await axe();
  nu();
} finally {
  server?.kill();
}

const byTool = {};
for (const i of issues) byTool[i.tool] = (byTool[i.tool] || 0) + 1;
fs.writeFileSync(path.join(OUT, "issues.json"), JSON.stringify(issues, null, 2));
const md = [
  `# Quality gate: ${issues.length === 0 ? "all clear" : `${issues.length} issue(s)`}`,
  "",
  "| Tool | Issues |",
  "| --- | --- |",
  ...["audit", "lighthouse", "axe", "nu"].map((t) => `| ${t} | ${byTool[t] || 0} |`),
  "",
  ...issues.slice(0, 60).map((i) => `- **${i.tool}** ${i.page || ""} \`${i.id}\`: ${i.message}`),
  issues.length > 60 ? `- ... and ${issues.length - 60} more (see issues.json)` : "",
].join("\n");
fs.writeFileSync(path.join(OUT, "report.md"), md + "\n");
console.log("\n" + md);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `issues=${issues.length}\n`);
process.exit(0);
