// Detect SEO/GEO/accessibility/HTML issues on the built site and let OpenCode fix them, with guard rails.
//
//   node scripts/seo-fix-loop.mjs
//
// 1. Build and run the quality gate. No issues: stop (no model call, no cost).
// 2. Up to MAX_ATTEMPTS (default 2): run OpenCode with the issue list, revert any file outside the allowlist,
//    rebuild, re-run the gate.
// 3. Keep the changes only if the issue count dropped AND no new issue appeared. Otherwise revert everything.
//
// Writes seo-fix-summary.md (used as the pull request body). If GITHUB_OUTPUT is set it writes changed, before, after.
// Env: OPENCODE_MODEL (must be an opencode/... model, never Claude), MAX_ATTEMPTS,
//      FIX_AGENT_CMD (testing: shell command used instead of OpenCode), QUALITY_FAST=1 (skip Lighthouse).
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const issuesFile = path.join(root, "quality", "issues.json");
const MAX = Number(process.env.MAX_ATTEMPTS || 2);
const MODEL = process.env.OPENCODE_MODEL || "opencode/deepseek-v4.1-flash-free";
const ALLOWED = [/^src\//, /^content\/blog\/[^/]+\.mdx?$/, /^public\/llms\.txt$/, /^public\/robots\.txt$/];

const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { cwd: root, encoding: "utf8", shell: process.platform === "win32", maxBuffer: 1 << 28, ...opts });
const sh = (cmd) => spawnSync(cmd, { cwd: root, shell: true, stdio: "inherit" });
const out = (k, v) => process.env.GITHUB_OUTPUT && fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
const key = (i) => `${i.tool}|${i.page}|${i.id}`;

function buildAndGate() {
  const b = run("npm", ["run", "build"]);
  if (b.status !== 0) return { ok: false, error: (b.stdout + b.stderr).split("\n").slice(-25).join("\n"), issues: [] };
  const g = run("node", ["scripts/quality-gate.mjs"], { stdio: ["ignore", "inherit", "inherit"] });
  if (g.status !== 0 && !fs.existsSync(issuesFile)) return { ok: false, error: "quality gate crashed", issues: [] };
  return { ok: true, issues: JSON.parse(fs.readFileSync(issuesFile, "utf8")) };
}

function changedFiles() {
  const r = run("git", ["status", "--porcelain", "-uall"]);
  return r.stdout
    .split("\n")
    .filter(Boolean)
    .map((l) => l.slice(3).replace(/^"|"$/g, ""))
    .filter((f) => !/^(quality|out|\.next|node_modules|seo-fix-summary\.md)/.test(f));
}

function enforceAllowlist() {
  const bad = changedFiles().filter((f) => !ALLOWED.some((re) => re.test(f)));
  for (const f of bad) {
    const tracked = run("git", ["ls-files", "--error-unmatch", f]).status === 0;
    if (tracked) run("git", ["checkout", "--", f]);
    else fs.rmSync(path.join(root, f), { force: true, recursive: true });
  }
  return bad;
}

function revertAll() {
  for (const f of changedFiles()) {
    const tracked = run("git", ["ls-files", "--error-unmatch", f]).status === 0;
    if (tracked) run("git", ["checkout", "--", f]);
    else fs.rmSync(path.join(root, f), { force: true, recursive: true });
  }
}

// ---- model rules -------------------------------------------------------------
if (!process.env.FIX_AGENT_CMD) {
  if (!/^opencode\//.test(MODEL) || /claude|anthropic/i.test(MODEL)) {
    console.error(`OPENCODE_MODEL must be an opencode/... model and not Claude (got ${MODEL}).`);
    process.exit(1);
  }
}

// ---- 1. baseline ---------------------------------------------------------------
console.log("== Baseline: build + quality gate ==");
const base = buildAndGate();
if (!base.ok) {
  console.error("The baseline build failed, so nothing can be fixed automatically:\n" + base.error);
  fs.writeFileSync(path.join(root, "seo-fix-summary.md"), `The baseline build failed, so the fixer did not run.\n\n\`\`\`\n${base.error}\n\`\`\`\n`);
  out("changed", "false");
  process.exit(1);
}
const before = base.issues;
out("before", before.length);
if (before.length === 0) {
  console.log("No issues. Nothing to fix.");
  fs.writeFileSync(path.join(root, "seo-fix-summary.md"), "The quality gate found no issues. Nothing to fix this week.\n");
  out("changed", "false");
  out("after", "0");
  process.exit(0);
}
if (!process.env.FIX_AGENT_CMD && !process.env.OPENCODE_API_KEY) {
  console.error(`${before.length} issue(s) found but OPENCODE_API_KEY is not set, so they cannot be fixed.`);
  fs.writeFileSync(path.join(root, "seo-fix-summary.md"), `${before.length} issue(s) found, but OPENCODE_API_KEY is not set.\n`);
  out("changed", "false");
  process.exit(1);
}

// ---- 2. fix attempts ------------------------------------------------------------
let current = before;
let reverted = [];
const promptBase = fs.readFileSync(path.join(root, "automation", "prompts", "seo-fix.md"), "utf8");
for (let attempt = 1; attempt <= MAX && current.length > 0; attempt++) {
  console.log(`\n== Attempt ${attempt}/${MAX}: ${current.length} issue(s) ==`);
  const listing = JSON.stringify(current.slice(0, 80), null, 1);
  const prompt = `${promptBase}\n\n## Issues to fix now (${current.length} total${current.length > 80 ? ", first 80 shown; the rest are in quality/issues.json" : ""})\n${listing}\n`;
  if (process.env.FIX_AGENT_CMD) {
    sh(process.env.FIX_AGENT_CMD);
  } else {
    const help = run("opencode", ["run", "--help"]);
    const extra = /--auto/.test(help.stdout + help.stderr) ? ["--auto"] : [];
    const r = spawnSync("opencode", ["run", "--model", MODEL, ...extra, prompt], { cwd: root, stdio: "inherit", shell: false });
    if (r.status !== 0) console.error(`OpenCode exited with ${r.status}; continuing with whatever it changed.`);
  }
  reverted.push(...enforceAllowlist());
  const res = buildAndGate();
  if (!res.ok) {
    console.error("The build broke after the changes; reverting this attempt.\n" + res.error);
    revertAll();
    continue;
  }
  current = res.issues;
}

// ---- 3. decide ---------------------------------------------------------------------
const beforeKeys = new Set(before.map(key));
const fresh = current.filter((i) => !beforeKeys.has(key(i)));
const improved = current.length < before.length && fresh.length === 0;
const files = changedFiles();
const table = (list) => ["audit", "lighthouse", "axe", "nu"].map((t) => `${t}: ${list.filter((i) => i.tool === t).length}`).join(", ");
let md;
if (improved && files.length > 0) {
  md = [
    "Automated SEO / GEO / accessibility / HTML fixes by OpenCode (`" + MODEL + "`). **Review before merging.**",
    "",
    `- Issues before: **${before.length}** (${table(before)})`,
    `- Issues after: **${current.length}** (${table(current)})`,
    `- New issues introduced: **${fresh.length}**`,
    "",
    "Changed files:",
    ...files.map((f) => `- \`${f}\``),
    reverted.length ? `\nDiscarded (outside the allowed paths): ${reverted.map((f) => `\`${f}\``).join(", ")}` : "",
    "",
    current.length ? "Still open after the fix:" : "All issues resolved.",
    ...current.slice(0, 25).map((i) => `- ${i.tool} ${i.page || ""} \`${i.id}\`: ${i.message}`),
    "",
    "Checked: build, repo audit, Lighthouse (accessibility, best practices, SEO), axe-core, W3C Nu.",
  ].join("\n");
  out("changed", "true");
} else {
  revertAll();
  md = `The fixer ran but its changes were discarded (${improved ? "no files changed" : fresh.length ? `${fresh.length} new issue(s) appeared` : "the issue count did not drop"}).\n\nIssues found (${before.length}): ${table(before)}\n\n${before.slice(0, 25).map((i) => `- ${i.tool} ${i.page || ""} \`${i.id}\`: ${i.message}`).join("\n")}\n`;
  out("changed", "false");
}
out("after", current.length);
fs.writeFileSync(path.join(root, "seo-fix-summary.md"), md + "\n");
console.log("\n" + md);
