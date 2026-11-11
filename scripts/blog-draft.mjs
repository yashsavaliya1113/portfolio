// Run the weekly blog prompt locally with OpenCode:  npm run blog:draft          (or: node scripts/blog-draft.mjs --dry)
// Uses the same prompt as the weekly GitHub workflow (automation/prompts/weekly-blog.md), then runs the quality gate.
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const today = new Date().toISOString().slice(0, 10);
const prompt = `TODAY=${today}\n\n` + fs.readFileSync(path.join(root, "automation", "prompts", "weekly-blog.md"), "utf8").replaceAll("TODAY", today);
const model = process.env.OPENCODE_MODEL || "opencode/deepseek-v4-pro"; // OpenCode model, e.g. opencode/deepseek-v4-pro (run `opencode models`)
if (model && /claude|anthropic/i.test(model)) {
  console.error(`Claude/Anthropic models are not used for blog drafts (got ${model}). Pick an OpenCode model.`);
  process.exit(1);
}
const args = ["run", ...(model ? ["--model", model] : []), prompt];

if (process.argv.includes("--dry")) {
  console.log(`opencode ${args.slice(0, -1).join(" ")} <prompt: ${prompt.length} characters, date ${today}>`);
  process.exit(0);
}

const before = new Set(fs.readdirSync(path.join(root, "content", "blog")));
const run = spawnSync("opencode", args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
if (run.status !== 0) process.exit(run.status ?? 1);

const created = fs.readdirSync(path.join(root, "content", "blog")).filter((f) => !before.has(f));
if (created.length !== 1) {
  console.error(`Expected exactly one new article, found ${created.length}.`);
  process.exit(1);
}
const slug = created[0].replace(/\.mdx?$/, "");
console.log(`\nNew draft: content/blog/${created[0]}\nRunning the quality gate...`);
const gate = spawnSync("node", ["scripts/check-blog-post.mjs", slug], { cwd: root, stdio: "inherit" });
console.log(gate.status === 0 ? "\nPassed. Review the draft, then commit it." : "\nThe draft failed the quality gate. Fix it or delete it.");
process.exit(gate.status ?? 1);
