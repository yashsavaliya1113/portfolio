// Parse -> clean -> analyse pipeline for GujRERA project exports. Runs entirely in the browser.

export type Cohort = "< 1 Year" | "1 – 3 Years" | "3 – 5 Years" | "5 – 10 Years" | "10+ Years";
export const COHORTS: Cohort[] = ["< 1 Year", "1 – 3 Years", "3 – 5 Years", "5 – 10 Years", "10+ Years"];

export interface RawRow {
  [column: string]: string;
}

export interface Project {
  id: string;
  regNo: string;
  name: string;
  developer: string;
  type: string;
  status: string;
  address: string;
  costCr: number | null;
  declaredCostCr: number | null;
  varianceCr: number | null;
  variancePct: number | null;
  start: Date | null;
  end: Date | null;
  approvedYear: number | null;
  durationDays: number | null;
  durationYears: number | null;
  cohort: Cohort | null;
  raw: RawRow;
}

export interface Quality {
  total: number;
  duplicatesRemoved: number;
  missingCost: number;
  missingDates: number;
  invalidDateRange: number;
  fixedLabels: number;
  completeness: number;
}

export interface Dataset {
  projects: Project[];
  quality: Quality;
  columns: string[];
}

/** RFC 4180-ish CSV parser (quoted fields, embedded commas/newlines, escaped quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

/** Decode bytes as UTF-8, falling back to Windows-1252 (Excel exports often are). */
export function decodeCsv(buf: ArrayBuffer): string {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    text = new TextDecoder("windows-1252").decode(buf);
  }
  return text.replace(/^﻿/, "");
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Handles "20-October-2016", "2019-12-31 00:00:00.0", "31/12/2019". */
export function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const v = value.trim();
  let m = v.match(/^(\d{1,2})[-\s]([A-Za-z]{3,})[-\s](\d{4})$/);
  if (m) {
    const mo = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
    return mo < 0 ? null : new Date(Date.UTC(+m[3], mo, +m[1]));
  }
  m = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
  return null;
}

/** "₹ 1,85,50,000/-", "583076155.00" -> rupees. */
export function parseMoney(value: string | undefined): number | null {
  if (!value) return null;
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

const CRORE = 1e7;
const DAY = 86400000;

export function cohortOf(years: number): Cohort {
  if (years < 1) return "< 1 Year";
  if (years < 3) return "1 – 3 Years";
  if (years < 5) return "3 – 5 Years";
  if (years < 10) return "5 – 10 Years";
  return "10+ Years";
}

function normType(t: string): string {
  const v = t.trim().toLowerCase();
  if (v.startsWith("residential")) return "Residential";
  if (v.startsWith("mixed")) return "Mixed Development";
  if (v.startsWith("commercial")) return "Commercial";
  if (v.startsWith("plotted")) return "Plotted Development";
  return t.trim() || "Unknown";
}

function titleCase(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

export function buildDataset(table: string[][]): Dataset {
  const [head, ...body] = table;
  const columns = head.map((h) => h.trim());
  const rows: RawRow[] = body.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i] ?? ""])));

  const seen = new Set<string>();
  const projects: Project[] = [];
  let duplicatesRemoved = 0;
  let missingCost = 0;
  let missingDates = 0;
  let invalidDateRange = 0;
  let fixedLabels = 0;

  for (const raw of rows) {
    const key = (raw.regNo || raw.projectRegId || "").trim();
    if (key && seen.has(key)) {
      duplicatesRemoved++;
      continue;
    }
    seen.add(key);

    const type = normType(raw.projectType ?? "");
    if (type !== (raw.projectType ?? "").trim()) fixedLabels++;

    const cost = parseMoney(raw.projectCost) ?? parseMoney(raw.total_est_cost_of_proj);
    const declared = parseMoney(raw.project_cost);
    if (cost == null) missingCost++;

    const start = parseDate(raw.startDate);
    const end = parseDate(raw.endDate);
    let durationDays: number | null = null;
    if (!start || !end) missingDates++;
    else if (end < start) invalidDateRange++;
    else durationDays = Math.round((end.getTime() - start.getTime()) / DAY);
    const durationYears = durationDays == null ? null : durationDays / 365.25;

    const approved = parseDate(raw.approvedOn);

    let varianceCr: number | null = null;
    let variancePct: number | null = null;
    if (cost != null && declared != null) {
      varianceCr = (cost - declared) / CRORE;
      variancePct = ((cost - declared) / declared) * 100;
    }

    projects.push({
      id: key || String(projects.length),
      regNo: raw.regNo ?? "",
      name: titleCase(raw.projectName ?? ""),
      developer: titleCase(raw.promoterName ?? ""),
      type,
      status: titleCase(raw.project_status ?? ""),
      address: titleCase(raw.project_address ?? ""),
      costCr: cost == null ? null : cost / CRORE,
      declaredCostCr: declared == null ? null : declared / CRORE,
      varianceCr,
      variancePct,
      start,
      end,
      approvedYear: approved ? approved.getUTCFullYear() : null,
      durationDays,
      durationYears,
      cohort: durationYears == null ? null : cohortOf(durationYears),
      raw,
    });
  }

  const cells = projects.length * 4;
  const filled = projects.reduce(
    (n, p) => n + (p.costCr != null ? 1 : 0) + (p.durationDays != null ? 1 : 0) + (p.name ? 1 : 0) + (p.developer ? 1 : 0),
    0,
  );

  return {
    projects,
    columns,
    quality: {
      total: rows.length,
      duplicatesRemoved,
      missingCost,
      missingDates,
      invalidDateRange,
      fixedLabels,
      completeness: cells ? (filled / cells) * 100 : 0,
    },
  };
}

export function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0);
}

export interface GroupStat {
  label: string;
  count: number;
  costCr: number;
  avgYears: number | null;
  varianceCr: number;
  variancePct: number | null;
}

export function groupBy(projects: Project[], keyFn: (p: Project) => string | null): GroupStat[] {
  const map = new Map<string, Project[]>();
  for (const p of projects) {
    const k = keyFn(p);
    if (k == null) continue;
    (map.get(k) ?? map.set(k, []).get(k)!).push(p);
  }
  return [...map.entries()].map(([label, ps]) => {
    const years = ps.filter((p) => p.durationYears != null).map((p) => p.durationYears as number);
    const withVar = ps.filter((p) => p.varianceCr != null);
    const baseCr = sum(withVar.map((p) => p.declaredCostCr as number));
    const varCr = sum(withVar.map((p) => p.varianceCr as number));
    return {
      label,
      count: ps.length,
      costCr: sum(ps.map((p) => p.costCr ?? 0)),
      avgYears: years.length ? sum(years) / years.length : null,
      varianceCr: varCr,
      variancePct: baseCr ? (varCr / baseCr) * 100 : null,
    };
  });
}

export function summarize(projects: Project[]) {
  const years = projects.filter((p) => p.durationYears != null).map((p) => p.durationYears as number);
  const days = projects.filter((p) => p.durationDays != null).map((p) => p.durationDays as number);
  const withVar = projects.filter((p) => p.varianceCr != null);
  const baseCr = sum(withVar.map((p) => p.declaredCostCr as number));
  const varCr = sum(withVar.map((p) => p.varianceCr as number));
  return {
    count: projects.length,
    totalCostCr: sum(projects.map((p) => p.costCr ?? 0)),
    avgYears: years.length ? sum(years) / years.length : 0,
    avgDays: days.length ? sum(days) / days.length : 0,
    varianceCr: varCr,
    variancePct: baseCr ? (varCr / baseCr) * 100 : 0,
    varianceCount: withVar.length,
  };
}

export const fmtInt = (n: number) => n.toLocaleString("en-IN");
export const fmtCr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`;
export const fmtPct = (n: number, d = 2) => `${n > 0 ? "+" : ""}${n.toFixed(d)}%`;
