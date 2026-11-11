// Weekly SEO watch for the LIVE site. No dependencies (Node 20+).
//
// 1. Health: every sitemap URL returns 200 with a title, one canonical equal to the URL, one H1, valid JSON-LD and no noindex.
// 2. Lighthouse: reads lh/*.json (produced by the workflow) and flags categories below the threshold.
// 3. Search rankings: where the portfolio appears for the queries in automation/seo-queries.json
//    (Google Programmable Search or Brave Search API, whichever key is configured).
// 4. AI answers: asks Perplexity the questions in the same file and checks whether the site is cited or named.
//
// It compares with last week's state (prev-state.json) and writes:
//   report.md   - the full weekly report
//   state.json  - this week's state (the workflow stores it on the tracking issue)
//   alerts.md   - only when something needs the owner's attention (the workflow turns it into a GitHub issue)
//
// Optional env: GOOGLE_CSE_KEY + GOOGLE_CSE_CX, BRAVE_API_KEY, PERPLEXITY_API_KEY.
// Endpoint overrides (for testing): GOOGLE_CSE_ENDPOINT, BRAVE_ENDPOINT, PERPLEXITY_ENDPOINT, SITE_OVERRIDE.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "automation", "seo-queries.json"), "utf8"));
const SITE = (process.env.SITE_OVERRIDE || config.site).replace(/\/$/, "");
const HOST = new URL(SITE).host;
const OUT = process.env.SEO_WATCH_OUT || process.cwd();
const prev = fs.existsSync(path.join(OUT, "prev-state.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "prev-state.json"), "utf8")) : null;

const alerts = [];
const state = { date: new Date().toISOString().slice(0, 10), health: {}, lighthouse: {}, rankings: {}, ai: {} };
const lines = [];
const out = (s = "") => lines.push(s);

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
      if (status !== 200) {
        problems.push(`${url} returned ${status}`);
        continue;
      }
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
    alerts.push(`**Site health: ${problems.length} problem(s)**\n${problems.slice(0, 8).map((p) => `- ${p}`).join("\n")}`);
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
  const min = config.lighthouseMinScore ?? 90;
  out("| Page | Perf | A11y | Best practices | SEO |\n| --- | --- | --- | --- | --- |");
  const low = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const r = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
    const page = new URL(r.finalDisplayedUrl || r.requestedUrl).pathname.replace(/^\/portfolio/, "") || "/";
    state.lighthouse[page] = s;
    out(`| ${page} | ${s.performance} | ${s.accessibility} | ${s["best-practices"]} | ${s.seo} |`);
    for (const [k, v] of Object.entries(s)) if (v < min) low.push(`${page}: ${k} ${v} (threshold ${min})`);
  }
  if (low.length) alerts.push(`**Lighthouse below ${min}**\n${low.map((l) => `- ${l}`).join("\n")}`);
  out();
}

// ---------------------------------------------------------------- 3. rankings
async function searchGoogle(q) {
  const url = new URL(process.env.GOOGLE_CSE_ENDPOINT || "https://www.googleapis.com/customsearch/v1");
  url.search = new URLSearchParams({ key: process.env.GOOGLE_CSE_KEY, cx: process.env.GOOGLE_CSE_CX, q, num: "10" }).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Google CSE ${res.status}`);
  const j = await res.json();
  return (j.items || []).map((i) => i.link);
}
async function searchBrave(q) {
  const url = new URL(process.env.BRAVE_ENDPOINT || "https://api.search.brave.com/res/v1/web/search");
  url.search = new URLSearchParams({ q, count: "20" }).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "X-Subscription-Token": process.env.BRAVE_API_KEY, accept: "application/json" } });
  if (!res.ok) throw new Error(`Brave ${res.status}`);
  const j = await res.json();
  return (j.web?.results || []).map((r) => r.url);
}

async function rankings() {
  out("## 3. Search rankings");
  const provider = process.env.BRAVE_API_KEY ? ["Brave", searchBrave] : process.env.GOOGLE_CSE_KEY && process.env.GOOGLE_CSE_CX ? ["Google", searchGoogle] : null;
  if (!provider) {
    out("Not configured. Add `BRAVE_API_KEY` or `GOOGLE_CSE_KEY` + `GOOGLE_CSE_CX` as repository secrets to track where the site appears for your target queries (see docs/automation.md).\n");
    return;
  }
  const [name, fn] = provider;
  out(`Provider: ${name}. Position is among the first results returned; "-" means not found.\n`);
  out("| Query | Position | Last week |\n| --- | --- | --- |");
  const top = config.alertWhenFoundInTop ?? 20;
  for (const q of config.searchQueries) {
    try {
      const urls = await fn(q);
      const idx = urls.findIndex((u) => { try { return new URL(u).host === HOST; } catch { return false; } });
      const pos = idx === -1 ? null : idx + 1;
      const before = prev?.rankings?.[q]?.position ?? null;
      state.rankings[q] = { position: pos, provider: name };
      out(`| ${q} | ${pos ?? "-"} | ${prev ? before ?? "-" : "first run"} |`);
      if (pos !== null && pos <= top && (before === null || before > top)) alerts.push(`**Your site now appears for "${q}"** at position ${pos} (${name}).`);
      else if (pos !== null && before !== null && before - pos >= 3) alerts.push(`**Ranking improved for "${q}"**: ${before} → ${pos} (${name}).`);
      else if (pos === null && before !== null) alerts.push(`**Dropped out of results for "${q}"** (was position ${before}).`);
    } catch (e) {
      out(`| ${q} | error: ${e.message} | |`);
    }
  }
  out();
}

// ---------------------------------------------------------------- 4. AI answers
async function aiAnswers() {
  out("## 4. AI answers (Perplexity)");
  if (!process.env.PERPLEXITY_API_KEY) {
    out("Not configured. Add `PERPLEXITY_API_KEY` to check whether an AI search engine cites or names you (see docs/automation.md).\n");
    return;
  }
  out("| Question | Site cited | Name mentioned | Last week |\n| --- | --- | --- | --- |");
  for (const q of config.aiQuestions) {
    try {
      const res = await fetch(process.env.PERPLEXITY_ENDPOINT || "https://api.perplexity.ai/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(60000),
        headers: { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ model: "sonar", messages: [{ role: "user", content: q }] }),
      });
      if (!res.ok) throw new Error(`Perplexity ${res.status}`);
      const j = await res.json();
      const text = j.choices?.[0]?.message?.content || "";
      const cites = [...(j.citations || []), ...(j.search_results || []).map((r) => r.url)];
      const cited = cites.some((u) => { try { return new URL(u).host === HOST; } catch { return false; } });
      const named = /yash\s+savaliya/i.test(text);
      const before = prev?.ai?.[q];
      state.ai[q] = { cited, named };
      out(`| ${q} | ${cited ? "yes" : "no"} | ${named ? "yes" : "no"} | ${before ? `${before.cited ? "cited" : "not cited"}` : "first run"} |`);
      if (cited && !before?.cited) alerts.push(`**An AI search engine now cites your site** for: "${q}".`);
      else if (named && !before?.named) alerts.push(`**An AI search engine now names Yash Savaliya** for: "${q}".`);
      else if (!cited && before?.cited) alerts.push(`**AI citation lost** for: "${q}".`);
    } catch (e) {
      out(`| ${q} | error: ${e.message} | | |`);
    }
  }
  out();
}

// ---------------------------------------------------------------- run
out(`# Weekly SEO watch: ${state.date}`);
out(`Site: ${SITE}\n`);
await health();
lighthouse();
await rankings();
await aiAnswers();

if (alerts.length) {
  out("## Needs your attention");
  alerts.forEach((a) => out(`- ${a.replace(/\n/g, "\n  ")}`));
}
fs.writeFileSync(path.join(OUT, "report.md"), lines.join("\n") + "\n");
fs.writeFileSync(path.join(OUT, "state.json"), JSON.stringify(state, null, 2));
if (alerts.length) fs.writeFileSync(path.join(OUT, "alerts.md"), alerts.map((a) => `- ${a.replace(/\n/g, "\n  ")}`).join("\n") + "\n");
else if (fs.existsSync(path.join(OUT, "alerts.md"))) fs.unlinkSync(path.join(OUT, "alerts.md"));
console.log(lines.join("\n"));
