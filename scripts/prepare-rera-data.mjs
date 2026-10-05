// Converts a raw GujRERA CSV export into the public dataset served to the dashboard.
// Drops personal/contact columns (email, mobile, Aadhaar, PAN, payment token, ...) and re-encodes as UTF-8.
// Usage: node scripts/prepare-rera-data.mjs "<path to raw csv>"
import { readFileSync, writeFileSync } from "node:fs";

const KEEP = [
  "projectRegId", "regNo", "projectName", "promoterName", "projectType", "project_status",
  "projectCost", "project_cost", "total_est_cost_of_proj",
  "startDate", "endDate", "approvedOn", "extDate", "project_address", "districtName",
];

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = ""; rows.push(row); row = [];
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0]);
}

const esc = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

const src = process.argv[2];
if (!src) { console.error("Usage: node scripts/prepare-rera-data.mjs <raw.csv>"); process.exit(1); }
const buf = readFileSync(src);
let text;
try { text = new TextDecoder("utf-8", { fatal: true }).decode(buf); }
catch { text = new TextDecoder("windows-1252").decode(buf); }
text = text.replace(/^\uFEFF/, "");

const [head, ...body] = parseCsv(text);
const idx = KEEP.map((k) => head.indexOf(k));
if (idx.includes(-1)) { console.error("Missing columns:", KEEP.filter((_, i) => idx[i] < 0)); process.exit(1); }
const out = [KEEP.join(","), ...body.map((r) => idx.map((i) => esc((r[i] ?? "").trim())).join(","))];
writeFileSync("public/data/ahmedabad-rera.csv", out.join("\n") + "\n", "utf8");
console.log(`Wrote ${body.length} rows, ${KEEP.length} columns`);
