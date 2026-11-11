// Weekly SEO watch for the LIVE site. Reports only: it never raises alerts or opens issues.
//
// 1. Health: every sitemap URL returns 200 with a title, one canonical equal to the URL, one H1, valid JSON-LD and no noindex.
// 2. Lighthouse: reads lh/*.json (produced by the workflow) and shows the scores.
// 3. Search tracking with Playwright: where the portfolio appears on Bing and DuckDuckGo for the queries in
//    automation/seo-queries.json. Google is not queried: it blocks automated browsers.
// 4. AI search: not automatable without paid APIs, so the report lists questions to try by hand.
//
// It compares with last week's state (prev-state.json, restored by the workflow) and writes:
//   report.md  - the full weekly report (also shown on the workflow run summary)
//   state.json - this week's state, kept as a workflow artifact for next week's comparison
//
// Env: PW_CHANNEL=chrome to use an installed Chrome locally instead of Playwright's Chromium. SITE_OVERRIDE and
// SEO_WATCH_OUT are for testing.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "automation", "seo-queries.json"), "utf8"));
const SITE = (process.env.SITE_OVERRIDE || config.site).replace(/\/$/, "");
const HOST = new URL(SITE).host;
const OUT = process.env.SEO_WATCH_OUT || process.cwd();
const prevFile = path.join(OUT, "prev-state.json");
const prev = fs.existsSync(prevFile) ? JSON.parse(fs.readFileSync(prevFile, "utf8")) : null;

const state = { date: new Date().toISOString().slice(0, 10), health: {}, lighthouse: {}, rankings: {} };
const changes = [];
const lines = [];
const out = (s = "") => lines.push(s);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hostOf = (u) => { try { return new URL(u).host; } catch { return ""; } };

const getText = async (url) => {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "seo-watch/1.0 (+portfolio self-check)" } });
  return { status: res.status, text: await res.text() };
};

// ---------------------------------------------------------------- 1. health
async function health() {
  out("## 1. Site health");
  const problems = [];
  let urls = [];
  try {
    const sm = await getText(`${SITE}/sitemap.xml`);
    if (sm.status !== 200) throw new Error(`sitemap.xml returned ${sm.status}`);
    urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (!urls.length) throw new Error("sitemap.xml lists no URLs");
  } catch (e) {
    problems.push(`Sitemap: ${e.message}`);
  }
  const robots = await getText(`${SITE}/robots.txt`).catch(() => ({ status: 0, text: "" }));
  if (robots.status !== 200) problems.push(`robots.txt returned ${robots.status}`);
  if (/^Disallow:\s*\/\s*$/m.test(robots.text)) problems.push("robots.txt disallows the whole site");

  for (const url of urls) {
    try {
      const { status, text } = await getText(url);
      if (status !== 200) { problems.push(`${url} returned ${status}`); continue; }
      const title = text.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
      const canon = [...text.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
      const h1 = (text.match(/<h1[\s>]/gi) || []).length;
      if (!title) problems.push(`${url}: missing <title>`);
      if (canon.length !== 1 || canon[0] !== url) problems.push(`${url}: canonical is ${canon.join(", ") || "missing"}`);
      if (h1 !== 1) problems.push(`${url}: ${h1} H1 tags`);
      if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(text)) problems.push(`${url}: has noindex`);
      for (const b of text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(b[1]);
    } catch (e) {
      problems.push(`${url}: ${e.message}`);
    }
  }
  state.health = { urls: urls.length, problems: problems.length };
  if (problems.length) {
    out(`${problems.length} problem(s) on ${urls.length} pages:`);
    problems.slice(0, 15).forEach((p) => out(`- ${p}`));
    changes.push(`Site health: ${problems.length} problem(s) found (see section 1).`);
  } else {
    out(`All ${urls.length} sitemap URLs are healthy (200, one canonical, one H1, valid JSON-LD, indexable).`);
  }
  out();
}

// ---------------------------------------------------------------- 2. lighthouse
function lighthouse() {
  out("## 2. Lighthouse (mobile, live site)");
  const dir = path.join(OUT, "lh");
  if (!fs.existsSync(dir) || !fs.readdirSync(dir).some((f) => f.endsWith(".json"))) {
    out("No Lighthouse results were produced this week.\n");
    return;
  }
  out("| Page | Perf | A11y | Best practices | SEO |\n| --- | --- | --- | --- | --- |");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
    const page = new URL(r.finalDisplayedUrl || r.requestedUrl).pathname.replace(/^\/portfolio/, "") || "/";
    const before = prev?.lighthouse?.[page];
    state.lighthouse[page] = s;
    out(`| ${page} | ${s.performance} | ${s.accessibility} | ${s["best-practices"]} | ${s.seo} |`);
    if (before) for (const k of Object.keys(s)) if (s[k] <= before[k] - 5) changes.push(`Lighthouse ${k} on ${page} fell from ${before[k]} to ${s[k]}.`);
  }
  out();
}

// ---------------------------------------------------------------- 3. search tracking (Playwright)
const decodeBing = (href) => {
  try {
    const u = new URL(href);
    if (u.host.endsWith("bing.com") && u.searchParams.get("u")) {
      const b64 = u.searchParams.get("u").replace(/^a1/, "").replace(/-/g, "+").replace(/_/g, "/");
      return Buffer.from(b64, "base64").toString("utf8");
    }
  } catch {}
  return href;
};
const decodeDdg = (href) => {
  try {
    const u = new URL(href, "https://duckduckgo.com");
    return u.searchParams.get("uddg") ? decodeURIComponent(u.searchParams.get("uddg")) : u.href;
  } catch {
    return href;
  }
};

const engines = {
  Bing: {
    url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}&count=20&setlang=en`,
    results: async (page) => (await page.$$eval("li.b_algo h2 a", (as) => as.map((a) => a.href))).map(decodeBing),
    blocked: async (page) => /captcha|unusual traffic|verify you are/i.test(await page.content()),
  },
  DuckDuckGo: {
    url: (q) => `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    results: async (page) => (await page.$$eval("a.result__a", (as) => as.map((a) => a.getAttribute("href")))).map(decodeDdg),
    blocked: async (page) => /anomaly|captcha|unusual traffic/i.test(await page.content()),
  },
};

async function rankings() {
  out("## 3. Search tracking (Playwright)");
  const found = [];
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
  } catch (e) {
    out(`Could not start a browser (${e.message.split("\n")[0]}). Run \`npx playwright install chromium\` or set PW_CHANNEL=chrome.\n`);
    return;
  }
  const ctx = await browser.newContext({ userAgent: UA, locale: "en-IN", viewport: { width: 1280, height: 900 } });
  out("Position is among the first results the engine returns; `-` means not found, `blocked` means the engine showed a bot check. Google is not queried because it blocks automated browsers.\n");
  const names = Object.keys(engines);
  out(`| Query | ${names.map((n) => `${n} now | ${n} last week`).join(" | ")} |\n| --- |${names.map(() => " --- | ---").join(" |")} |`);
  for (const q of config.searchQueries) {
    state.rankings[q] = {};
    const cells = [];
    for (const name of names) {
      const e = engines[name];
      let pos = null;
      let blocked = false;
      const page = await ctx.newPage();
      try {
        await page.goto(e.url(q), { waitUntil: "domcontentloaded", timeout: 30000 });
        const urls = await e.results(page);
        if (!urls.length) blocked = true; // nothing parsed: a bot check or a changed page layout, not "not found"
        const idx = urls.findIndex((u) => hostOf(u) === HOST);
        pos = idx === -1 ? null : idx + 1;
      } catch {
        blocked = true;
      } finally {
        await page.close();
      }
      state.rankings[q][name] = blocked ? "blocked" : pos;
      const before = prev?.rankings?.[q]?.[name];
      const show = (v) => (v === "blocked" ? "blocked" : v ?? "-");
      cells.push(show(state.rankings[q][name]), prev ? show(before) : "first run");
      if (!blocked && before !== "blocked") {
        if (pos !== null) found.push(`${name}: "${q}" at #${pos}`);
        if (pos !== null && (before === null || before === undefined) && prev) changes.push(`Your site now appears on ${name} for "${q}" at position ${pos}.`);
        else if (pos !== null && typeof before === "number" && before - pos >= 3) changes.push(`Ranking improved on ${name} for "${q}": ${before} to ${pos}.`);
        else if (pos === null && typeof before === "number") changes.push(`Dropped out of ${name} results for "${q}" (was ${before}).`);
      }
      await sleep(2500 + Math.random() * 2000); // be polite to the search engines
    }
    out(`| ${q} | ${cells.join(" | ")} |`);
  }
  await browser.close();
  out();
  out(found.length ? `Currently found: ${found.join("; ")}.` : "The site was not found in the first results for any tracked query this week. A new site can take weeks to be indexed.");
  out();
}

// ---------------------------------------------------------------- 4. AI search (manual)
function aiManual() {
  out("## 4. AI search (check by hand)");
  out("AI assistants cannot be checked automatically without paid APIs. Once in a while, ask ChatGPT, Perplexity, Gemini and Copilot, and note whether they name you or cite the site:\n");
  config.aiQuestions.forEach((q) => out(`- ${q}`));
  out();
}

// ---------------------------------------------------------------- run
out(`# Weekly SEO watch: ${state.date}`);
out(`Site: ${SITE}\n`);
await health();
lighthouse();
await rankings();
aiManual();

out("## Changes since last week");
if (!prev) out("First report, so there is nothing to compare with yet.");
else if (!changes.length) out("No notable changes.");
else changes.forEach((c) => out(`- ${c}`));

fs.writeFileSync(path.join(OUT, "report.md"), lines.join("\n") + "\n");
fs.writeFileSync(path.join(OUT, "state.json"), JSON.stringify(state, null, 2));
console.log(lines.join("\n"));
