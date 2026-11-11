"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, TriangleAlert } from "lucide-react";

const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.NODE_ENV === "production"
      ? "/portfolio"
      : "";
const DATA_URL = `${BASE_PATH}/data/saas-incident-insights.json`;
const INCIDENTS_CSV = `${BASE_PATH}/data/saas-incidents.csv`;
const RULES_CSV = `${BASE_PATH}/data/saas-alert-rules.csv`;
const CODE_URL =
  "https://github.com/yashsavaliya1113/portfolio/tree/main/analysis/saas-incidents";

const PALETTE = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6"];

interface Insights {
  kpis: {
    incidents: number;
    alerts: number;
    avg_mttr_min: number;
    median_mttr_min: number;
    sla_compliance_pct: number;
    sla_breaches: number;
    downtime_hours: number;
    repeat_within_7d_pct: number;
    noise_pct: number;
    noisy_rule_count: number;
    noisy_rule_volume_pct: number;
    date_from: string;
    date_to: string;
  };
  services: { service: string; incidents: number; avg_mttr_min: number; breaches: number; breach_pct: number; downtime_min: number }[];
  categories: { category: string; incidents: number; avg_mttr_min: number }[];
  root_causes: { root_cause: string; category: string; incidents: number; share_pct: number; cumulative_pct: number }[];
  alert_rules: { rule: string; service: string; alerts_fired: number; auto_resolved: number; noise_pct: number; incidents_linked: number; volume_share_pct: number }[];
  hours: { hour: number; incidents: number }[];
  weekdays: { day: string; incidents: number }[];
  monthly: { month: string; incidents: number; avg_mttr_min: number; sla_compliance_pct: number }[];
  tenants: { tenant: string; incidents: number; downtime_min: number; sla_breaches: number }[];
  severity: { severity: string; incidents: number; avg_mttr_min: number; sla_target_min: number; sla_compliance_pct: number }[];
  insights: string[];
  recommendations: string[];
}

const fmt = (n: number) => n.toLocaleString("en-IN");

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

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</span>
      <div className="mt-1 font-mono text-2xl font-bold text-[var(--color-text)]">{value}</div>
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
            <span className="truncate font-medium text-[var(--color-text)]" title={r.label}>{r.label}</span>
            <span className="shrink-0 font-mono text-[var(--color-muted)]">{r.display}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: r.color ?? PALETTE[i % PALETTE.length] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Columns({ rows, label }: { rows: { label: string; value: number }[]; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div role="img" aria-label={label}>
      <div className="flex h-40 items-end gap-1">
        {rows.map((r) => (
          <div key={r.label} className="group relative flex flex-1 flex-col items-center justify-end" title={`${r.label}: ${r.value}`}>
            <div className="w-full rounded-t bg-[#3b82f6] opacity-80 transition-opacity group-hover:opacity-100" style={{ height: `${(r.value / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {rows.map((r, i) => (
          <span key={r.label} className="flex-1 text-center font-mono text-[9px] text-[var(--color-muted)]">
            {rows.length > 12 ? (i % 3 === 0 ? r.label : "") : r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Line({ points }: { points: { label: string; value: number }[] }) {
  const W = 600, H = 150, P = 8;
  const max = Math.max(...points.map((p) => p.value)) * 1.1;
  const min = 0;
  const x = (i: number) => P + (i * (W - 2 * P)) / (points.length - 1);
  const y = (v: number) => H - P - ((v - min) / (max - min)) * (H - 2 * P);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" role="img" aria-label="Monthly incident trend">
        <path d={d} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={p.label} cx={x(i)} cy={y(p.value)} r="3.5" fill="#3b82f6">
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[9px] text-[var(--color-muted)]">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}

export function IncidentAnalyticsShowcase() {
  const [data, setData] = useState<Insights | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <p className="mt-10 text-sm text-[var(--color-muted)]">Could not load the incident analytics data.</p>;
  }
  if (!data) {
    return (
      <div className="mt-10 flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <Loader2 size={16} className="animate-spin" /> Loading incident analytics…
      </div>
    );
  }

  const k = data.kpis;
  const noisy = data.alert_rules.filter((r) => r.noise_pct >= 75);

  return (
    <div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Incidents" value={fmt(k.incidents)} note={`${fmt(k.alerts)} alerts`} />
        <Kpi label="Avg MTTR" value={`${k.avg_mttr_min} min`} note={`median ${k.median_mttr_min} min`} />
        <Kpi label="SLA compliance" value={`${k.sla_compliance_pct}%`} note={`${k.sla_breaches} breaches`} />
        <Kpi label="Repeat incidents" value={`${k.repeat_within_7d_pct}%`} note="same cause within 7 days" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Key insights" sub="Computed from the data with SQL and Pandas">
          <ul className="space-y-2">
            {data.insights.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Recommendations" sub="What I would do next as the analyst">
          <ul className="space-y-2">
            {data.recommendations.map((t) => (
              <li key={t} className="flex gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                {t}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="SLA breach rate by service" sub="Share of incidents resolved after the SLA target">
          <HBar
            rows={[...data.services].sort((a, b) => b.breach_pct - a.breach_pct).slice(0, 8).map((s) => ({
              label: s.service,
              value: s.breach_pct,
              display: `${s.breach_pct}% · ${s.incidents} inc`,
              color: s.breach_pct >= 12 ? "#ef4444" : "#3b82f6",
            }))}
          />
        </Panel>
        <Panel title="Average MTTR by category" sub="Minutes from start to resolution">
          <HBar rows={data.categories.map((c) => ({ label: c.category, value: c.avg_mttr_min, display: `${c.avg_mttr_min} min · ${c.incidents} inc` }))} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Recurring root causes" sub="Top 8 with cumulative share of all incidents">
          <HBar
            rows={data.root_causes.slice(0, 8).map((r) => ({
              label: r.root_cause,
              value: r.incidents,
              display: `${r.incidents} · cum. ${r.cumulative_pct}%`,
            }))}
          />
        </Panel>
        <Panel title="Incidents by tenant" sub="Total downtime hours per tenant">
          <HBar rows={data.tenants.map((t) => ({ label: t.tenant, value: t.downtime_min, display: `${Math.round(t.downtime_min / 60).toLocaleString("en-IN")} h · ${t.incidents} inc` }))} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Incidents by hour of day" sub="Business-hours peaks plus a 02:00 batch-job spike">
          <Columns label="Incidents by hour" rows={data.hours.map((h) => ({ label: String(h.hour).padStart(2, "0"), value: h.incidents }))} />
        </Panel>
        <Panel title="Incidents by weekday" sub="Deployment-related incidents cluster on Tue/Thu">
          <Columns label="Incidents by weekday" rows={data.weekdays.map((d) => ({ label: d.day, value: d.incidents }))} />
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Monthly incident trend" sub="Incidents per month">
          <Line points={data.monthly.map((m) => ({ label: m.month, value: m.incidents }))} />
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          title="Alert intelligence"
          sub={`${k.noisy_rule_count} noisy rules (75%+ auto-resolved, no human action) generate ${k.noisy_rule_volume_pct}% of ${fmt(k.alerts)} alerts`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="font-mono uppercase text-[var(--color-muted)]">
                <tr>
                  <th className="py-1.5 pr-3">Rule</th>
                  <th className="pr-3">Service</th>
                  <th className="pr-3 text-right">Fired</th>
                  <th className="pr-3 text-right">Noise</th>
                  <th className="text-right">Incidents</th>
                </tr>
              </thead>
              <tbody>
                {noisy.map((r) => (
                  <tr key={r.rule} className="border-t border-[var(--color-border)]">
                    <td className="py-1.5 pr-3 font-mono text-[var(--color-text)]">{r.rule}</td>
                    <td className="pr-3 text-[var(--color-muted)]">{r.service}</td>
                    <td className="pr-3 text-right font-mono">{fmt(r.alerts_fired)}</td>
                    <td className="pr-3 text-right font-mono text-[#ef4444]">{r.noise_pct}%</td>
                    <td className="text-right font-mono">{r.incidents_linked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <a href={INCIDENTS_CSV} download className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-medium transition-all hover:border-primary/50">
          <Download size={14} /> Incidents CSV (synthetic)
        </a>
        <a href={RULES_CSV} download className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-medium transition-all hover:border-primary/50">
          <Download size={14} /> Alert rules CSV
        </a>
        <a href={CODE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-medium transition-all hover:border-primary/50">
          SQL + Python code
        </a>
      </div>
    </div>
  );
}
