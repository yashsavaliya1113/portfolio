"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Database,
  Filter,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  TriangleAlert,
  Upload,
} from "lucide-react";
import {
  COHORTS,
  buildDataset,
  decodeCsv,
  fmtCr,
  fmtInt,
  fmtPct,
  groupBy,
  parseCsv,
  summarize,
  type Dataset,
  type Project,
} from "@/lib/rera";

const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/portfolio"
      : "";
const DATA_URL = `${BASE_PATH}/data/ahmedabad-rera.csv`;
const PAGE_SIZE = 10;

type Tab = "pipeline" | "charts" | "explorer";

const PALETTE = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6"];

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
      {sub && <p className="mb-4 mt-0.5 text-xs text-[var(--color-muted)]">{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Kpi({ label, value, note, tone }: { label: string; value: string; note: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <div className={`mt-1 font-mono text-2xl font-bold ${tone ?? "text-[var(--color-text)]"}`}>{value}</div>
      <div className="mt-1 font-mono text-xs text-[var(--color-muted)]">{note}</div>
    </div>
  );
}

function HBar({ rows }: { rows: { label: string; value: number; display: string; color?: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between gap-3 text-xs">
            <span className="truncate font-medium text-[var(--color-text)]" title={r.label}>
              {r.label}
            </span>
            <span className="shrink-0 font-mono text-[var(--color-muted)]">{r.display}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(r.value / max) * 100}%`, background: r.color ?? PALETTE[i % PALETTE.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Donut({ slices }: { slices: { label: string; value: number }[] }) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" role="img" aria-label="Project type share">
        {slices.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <circle
              key={s.label}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth="16"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="space-y-1.5 text-xs">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="text-[var(--color-text)]">{s.label}</span>
            <span className="font-mono text-[var(--color-muted)]">
              {fmtInt(s.value)} ({((s.value / total) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Columns({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 560;
  const H = 180;
  const bw = W / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" role="img" aria-label="Registrations per year">
      {data.map((d, i) => {
        const h = (d.value / max) * H;
        return (
          <g key={d.label}>
            <rect x={i * bw + 4} y={H - h} width={bw - 8} height={h} rx="3" fill="var(--color-primary)" opacity="0.85">
              <title>{`${d.label}: ${d.value} projects`}</title>
            </rect>
            <text x={i * bw + bw / 2} y={H - h - 4} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
              {d.value}
            </text>
            <text x={i * bw + bw / 2} y={H + 14} textAnchor="middle" fontSize="10" fill="var(--color-muted)">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ReraAnalyticsShowcase() {
  const [tab, setTab] = useState<Tab>("pipeline");
  const [data, setData] = useState<Dataset | null>(null);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [type, setType] = useState("All");
  const [cohort, setCohort] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSteps = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setStep(0);
    let s = 0;
    timer.current = setInterval(() => {
      s++;
      setStep(s);
      if (s >= 4 && timer.current) clearInterval(timer.current);
    }, 550);
  }, []);

  const ingest = useCallback(
    (buf: ArrayBuffer, label: string) => {
      const table = parseCsv(decodeCsv(buf));
      if (table.length < 2) throw new Error("The file has no data rows.");
      const ds = buildDataset(table);
      if (!ds.columns.includes("projectCost") && !ds.columns.includes("total_est_cost_of_proj"))
        throw new Error("This doesn't look like a GujRERA export (no project cost column).");
      setData(ds);
      setSource(label);
      setPage(0);
      runSteps();
    },
    [runSteps],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Could not fetch dataset (HTTP ${res.status}).`);
      ingest(await res.arrayBuffer(), "ahmedabad-rera.csv");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [ingest]);

  useEffect(() => {
    load();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  const onFile = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      ingest(await file.arrayBuffer(), file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read file.");
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const projects = useMemo(() => data?.projects ?? [], [data]);
  const sum = useMemo(() => summarize(projects), [projects]);
  const byType = useMemo(() => groupBy(projects, (p) => p.type).sort((a, b) => b.count - a.count), [projects]);
  const byStatus = useMemo(() => groupBy(projects, (p) => p.status || "Unknown").sort((a, b) => b.count - a.count), [projects]);
  const byYear = useMemo(
    () =>
      groupBy(projects, (p) => (p.approvedYear ? String(p.approvedYear) : null)).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
    [projects],
  );
  const byCohort = useMemo(() => {
    const g = groupBy(projects, (p) => p.cohort);
    return COHORTS.map((c) => g.find((x) => x.label === c) ?? { label: c, count: 0, costCr: 0, avgYears: null, varianceCr: 0, variancePct: null });
  }, [projects]);
  const topDevs = useMemo(() => groupBy(projects, (p) => p.developer || null).sort((a, b) => b.count - a.count).slice(0, 8), [projects]);
  const topCost = useMemo(
    () => [...projects].filter((p) => p.costCr != null).sort((a, b) => (b.costCr as number) - (a.costCr as number)).slice(0, 8),
    [projects],
  );
  const sample = useMemo(() => {
    const out: Project[] = [];
    const step = Math.max(1, Math.floor(projects.length / 6));
    for (let i = 0; i < projects.length && out.length < 6; i += step) out.push(projects[i]);
    return out;
  }, [projects]);

  const typeOptions = useMemo(() => ["All", ...byType.map((t) => t.label)], [byType]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (cohort === "All" || p.cohort === cohort) &&
        (!q || p.name.toLowerCase().includes(q) || p.developer.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)),
    );
  }, [projects, type, cohort, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const filteredCost = filtered.reduce((a, p) => a + (p.costCr ?? 0), 0);

  const tabs: { id: Tab; label: string; icon: typeof Sparkles }[] = [
    { id: "pipeline", label: "1. Raw → Clean Pipeline", icon: Sparkles },
    { id: "charts", label: "2. Charts & Variance", icon: BarChart3 },
    { id: "explorer", label: "3. Data Explorer", icon: Layers },
  ];
  const q = data?.quality;

  return (
    <div className="my-12 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
      <div className="border-b border-[var(--color-border)] bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Database size={13} />
              Live data &bull; cleaned in your browser
            </span>
            <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
              Ahmedabad RERA Real Estate Analytics
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {data
                ? `${fmtInt(sum.count)} registered projects • ${fmtCr(sum.totalCostCr)} total cost • source: ${source}`
                : "Fetching raw GujRERA export…"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2 text-xs font-medium transition-all hover:border-primary disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Reload data
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
            >
              <Upload size={14} />
              Analyse your own CSV
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                tab === id
                  ? "bg-primary text-white shadow"
                  : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="m-6 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {!data && loading && (
        <div className="flex items-center justify-center gap-2 p-16 text-sm text-[var(--color-muted)]">
          <Loader2 size={16} className="animate-spin" /> Loading &amp; parsing CSV…
        </div>
      )}

      {data && q && tab === "pipeline" && (
        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--color-muted)]">
              The CSV below is the unmodified government export. Every figure on this page is computed from it, live,
              by the same cleaning code shown in the stages.
            </p>
            <button
              type="button"
              onClick={runSteps}
              disabled={step < 4 && step > 0}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-all hover:bg-primary-dark disabled:opacity-50"
            >
              <Play size={13} />
              Replay pipeline
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-4">
            {[
              ["Stage 1: Ingest", `${fmtInt(q.total)} rows × ${data.columns.length} columns`],
              ["Stage 2: Cost", "Strip symbols → ₹ Crore"],
              ["Stage 3: Dates", "Parse → duration in years"],
              ["Stage 4: Cohort & variance", "Bucket + cost variance"],
            ].map(([t, d], i) => (
              <div
                key={t}
                className={`rounded-lg border p-3 transition-all ${
                  step >= i ? "border-primary/40 bg-primary/10" : "border-[var(--color-border)] bg-[var(--color-bg)]"
                }`}
              >
                <div className="font-semibold text-primary">{t}</div>
                <div className="mt-0.5 text-[var(--color-muted)]">{d}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi label="Rows ingested" value={fmtInt(q.total)} note={`${fmtInt(q.duplicatesRemoved)} duplicates removed`} />
            <Kpi label="Completeness" value={`${q.completeness.toFixed(2)}%`} note="name · developer · cost · dates" tone="text-success" />
            <Kpi label="Missing cost" value={fmtInt(q.missingCost)} note="excluded from cost totals" tone={q.missingCost ? "text-amber-400" : "text-success"} />
            <Kpi
              label="Date issues"
              value={fmtInt(q.missingDates + q.invalidDateRange)}
              note={`${q.missingDates} missing · ${q.invalidDateRange} end < start`}
              tone={q.missingDates + q.invalidDateRange ? "text-amber-400" : "text-success"}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)] font-semibold text-[var(--color-muted)]">
                <tr>
                  <th className="p-3">Project</th>
                  <th className="p-3">{step < 1 ? "Raw type" : "Clean type"}</th>
                  <th className="p-3">{step < 2 ? "Raw cost (₹)" : "Cost (₹ Cr)"}</th>
                  <th className="p-3">{step < 3 ? "Raw dates" : "Duration"}</th>
                  <th className="p-3">{step < 4 ? "Cohort" : "Cohort"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {sample.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-primary/5">
                    <td className="p-3">
                      <div className="font-medium text-[var(--color-text)]">{p.name}</div>
                      <div className="text-[11px] text-[var(--color-muted)]">{p.developer}</div>
                    </td>
                    <td className="p-3">
                      {step < 1 ? <Raw>{p.raw.projectType}</Raw> : <span className="text-[var(--color-muted)]">{p.type}</span>}
                    </td>
                    <td className="p-3 font-mono">
                      {step < 2 ? (
                        <Raw>{p.raw.projectCost || "(empty)"}</Raw>
                      ) : p.costCr != null ? (
                        <span className="font-semibold">₹{p.costCr.toFixed(2)} Cr</span>
                      ) : (
                        <span className="text-amber-400">missing</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      {step < 3 ? (
                        <Raw>
                          {p.raw.startDate} → {p.raw.endDate}
                        </Raw>
                      ) : p.durationYears != null ? (
                        <span className="text-[var(--color-muted)]">
                          {p.durationYears.toFixed(1)} yrs ({fmtInt(p.durationDays as number)}d)
                        </span>
                      ) : (
                        <span className="text-amber-400">invalid</span>
                      )}
                    </td>
                    <td className="p-3">
                      {step < 4 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                          <Loader2 size={11} className="animate-spin" /> pending
                        </span>
                      ) : (
                        <Badge>{p.cohort ?? "n/a"}</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && tab === "charts" && (
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi
              label="Total projects"
              value={fmtInt(sum.count)}
              note={byStatus.map((s) => `${fmtInt(s.count)} ${s.label}`).join(" · ")}
            />
            <Kpi label="Total project cost" value={`₹${(sum.totalCostCr / 1e5).toFixed(2)} Lakh Cr`} note={fmtCr(sum.totalCostCr)} />
            <Kpi label="Mean timeline" value={`${sum.avgYears.toFixed(2)} yrs`} note={`${fmtInt(Math.round(sum.avgDays))} avg days`} />
            <Kpi
              label="Cost variance"
              value={fmtPct(sum.variancePct)}
              note={`${sum.varianceCr > 0 ? "+" : ""}${fmtCr(sum.varianceCr)} · ${fmtInt(sum.varianceCount)} projects`}
              tone={sum.variancePct <= 0 ? "text-success" : "text-amber-400"}
            />
          </div>

          <Panel title="Project duration distribution" sub="Planned start → end date, bucketed into timeline cohorts">
            <HBar
              rows={byCohort.map((c, i) => ({
                label: c.label,
                value: c.count,
                display: `${fmtInt(c.count)} (${((c.count / (sum.count || 1)) * 100).toFixed(1)}%)`,
                color: PALETTE[i],
              }))}
            />
          </Panel>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="Project type mix" sub="Share of registered projects">
              <Donut slices={byType.map((t) => ({ label: t.label, value: t.count }))} />
            </Panel>
            <Panel title="Capital by project type" sub="Total declared project cost">
              <HBar rows={byType.map((t) => ({ label: t.label, value: t.costCr, display: fmtCr(t.costCr) }))} />
            </Panel>
          </div>

          <Panel title="Registrations per year" sub="Projects by RERA approval year">
            <Columns data={byYear.map((y) => ({ label: y.label, value: y.count }))} />
          </Panel>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title="Cost variance by type" sub="Total estimated vs. declared project cost (where both exist)">
              <div className="space-y-3">
                {byType.map((t) => {
                  const v = t.variancePct ?? 0;
                  return (
                    <div key={t.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-medium text-[var(--color-text)]">{t.label}</span>
                        <span className={`font-mono ${v <= 0 ? "text-success" : "text-amber-400"}`}>
                          {fmtPct(v)} ({t.varianceCr > 0 ? "+" : ""}
                          {fmtCr(t.varianceCr)})
                        </span>
                      </div>
                      <div className="relative h-2.5 rounded-full bg-[var(--color-surface)]">
                        <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--color-border)]" />
                        <div
                          className={`absolute top-0 h-full ${v <= 0 ? "right-1/2 rounded-l-full bg-success" : "left-1/2 rounded-r-full bg-amber-400"}`}
                          style={{ width: `${Math.min(Math.abs(v) * 10, 50)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
            <Panel title="Top developers by project count">
              <HBar rows={topDevs.map((d) => ({ label: d.label, value: d.count, display: `${d.count} · ${fmtCr(d.costCr)}` }))} />
            </Panel>
          </div>

          <Panel title="Largest projects by cost">
            <HBar
              rows={topCost.map((p) => ({
                label: `${p.name} — ${p.developer}`,
                value: p.costCr as number,
                display: fmtCr(p.costCr as number),
              }))}
            />
          </Panel>
        </div>
      )}

      {data && tab === "explorer" && (
        <div className="space-y-6 p-6">
          <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Filter size={14} />
              Filters
              <span className="ml-auto font-mono font-normal text-[var(--color-muted)]">
                {fmtInt(filtered.length)} projects · {fmtCr(filteredCost)}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Chips label="Project type" value={type} options={typeOptions} onChange={(v) => { setType(v); setPage(0); }} />
              <Chips label="Timeline cohort" value={cohort} options={["All", ...COHORTS]} onChange={(v) => { setCohort(v); setPage(0); }} />
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-[var(--color-muted)]" htmlFor="rera-q">
                  Search project, developer or area
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-[var(--color-muted)]" />
                  <input
                    id="rera-q"
                    type="text"
                    placeholder="e.g. Shilaj, Adani, Sky…"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-xs text-[var(--color-text)] focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)] font-semibold text-[var(--color-muted)]">
                <tr>
                  <th className="p-3">Project &amp; developer</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 font-mono">Cost (₹ Cr)</th>
                  <th className="p-3 font-mono">Duration</th>
                  <th className="p-3">Cohort</th>
                  <th className="p-3 text-right font-mono">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-[var(--color-muted)]">
                      No projects match these filters.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-primary/5">
                      <td className="p-3">
                        <div className="font-semibold text-[var(--color-text)]">{p.name}</div>
                        <div className="text-[11px] text-[var(--color-muted)]">{p.developer}</div>
                      </td>
                      <td className="p-3 text-[var(--color-muted)]">{p.type}</td>
                      <td className="p-3 text-[var(--color-muted)]">{p.status}</td>
                      <td className="p-3 font-mono font-bold">{p.costCr != null ? p.costCr.toFixed(2) : "—"}</td>
                      <td className="p-3 font-mono text-[var(--color-muted)]">
                        {p.durationYears != null ? `${p.durationYears.toFixed(1)} yrs` : "—"}
                      </td>
                      <td className="p-3">{p.cohort ? <Badge>{p.cohort}</Badge> : "—"}</td>
                      <td className="p-3 text-right font-mono">
                        {p.variancePct != null ? (
                          <span className={p.variancePct <= 0 ? "text-success" : "text-amber-400"}>{fmtPct(p.variancePct)}</span>
                        ) : (
                          <span className="text-[var(--color-muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
            <span>
              Page {page + 1} of {fmtInt(pages)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-[var(--color-border)] p-1.5 hover:border-primary disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={page >= pages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-[var(--color-border)] p-1.5 hover:border-primary disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Raw({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-amber-400/10 px-1.5 py-0.5 text-amber-400">{children}</span>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-medium text-primary">
      {children}
    </span>
  );
}

function Chips({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-medium text-[var(--color-muted)]">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              value === o
                ? "bg-primary font-medium text-white shadow-sm"
                : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
