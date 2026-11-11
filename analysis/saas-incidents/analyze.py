"""Analyze the SYNTHETIC SaaS incident dataset.

Runs the SQL in queries.sql (via SQLite) and an independent Pandas pass,
cross-checks that they agree, then writes the aggregates the portfolio
dashboard renders to public/data/saas-incident-insights.json.

Usage:  python analyze.py     (run generate_data.py first)
"""
import json
import re
import sqlite3
from pathlib import Path

import pandas as pd

HERE = Path(__file__).resolve().parent
DATA = HERE.parents[1] / "public" / "data"

inc = pd.read_csv(DATA / "saas-incidents.csv", parse_dates=["start_time"])
rules = pd.read_csv(DATA / "saas-alert-rules.csv")

# ---- data cleaning / validation -----------------------------------------
assert inc["incident_id"].is_unique
assert inc.notna().all().all(), "unexpected nulls"
assert (inc["resolution_minutes"] > 0).all()
assert (inc["sla_breached"] == (inc["resolution_minutes"] > inc["sla_target_minutes"]).astype(int)).all()
assert (rules["auto_resolved"] <= rules["alerts_fired"]).all()

# ---- SQL pass -------------------------------------------------------------
con = sqlite3.connect(":memory:")
inc.assign(start_time=inc["start_time"].dt.strftime("%Y-%m-%d %H:%M")).to_sql("incidents", con, index=False)
rules.to_sql("alert_rules", con, index=False)
sql = (HERE / "queries.sql").read_text(encoding="utf-8")
sql_res = {}
for block in re.split(r"(?m)^-- name: ", sql)[1:]:
    name, _, body = block.partition("\n")
    sql_res[name.strip()] = pd.read_sql_query(body.split("\n\n-- Q")[0], con)

# ---- Pandas cross-check ---------------------------------------------------
pd_svc = inc.groupby("service").agg(incidents=("incident_id", "count"), breaches=("sla_breached", "sum"), downtime=("tenant_downtime_minutes", "sum"))
q1 = sql_res["service_reliability"].set_index("service").loc[pd_svc.index]
assert (q1["incidents"] == pd_svc["incidents"]).all() and (q1["breaches"] == pd_svc["breaches"]).all()
assert (q1["downtime_min"] == pd_svc["downtime"]).all()
assert sql_res["by_hour"]["incidents"].sum() == len(inc) and sql_res["monthly_trend"]["incidents"].sum() == len(inc)
pd_cat = inc.groupby("category")["resolution_minutes"].mean().round(1)
q2 = sql_res["category_mttr"].set_index("category")["avg_mttr_min"]
assert (q2.sort_index() - pd_cat.sort_index()).abs().max() < 0.06
print("SQL and Pandas results agree.")


def recs(df: pd.DataFrame) -> list[dict]:
    return json.loads(df.to_json(orient="records"))


repeat = sql_res["repeat_incidents"].iloc[0]
noisy = sql_res["noisy_alerts"]
top_noisy = noisy[noisy["noise_pct"] >= 75]
total_alerts = int(rules["alerts_fired"].sum())

kpis = {
    "incidents": int(len(inc)),
    "alerts": total_alerts,
    "avg_mttr_min": round(float(inc["resolution_minutes"].mean()), 1),
    "median_mttr_min": float(inc["resolution_minutes"].median()),
    "sla_compliance_pct": round(100 * (1 - inc["sla_breached"].mean()), 1),
    "sla_breaches": int(inc["sla_breached"].sum()),
    "downtime_hours": round(float(inc["tenant_downtime_minutes"].sum()) / 60, 1),
    "repeat_within_7d": int(repeat["repeat_within_7d"]),
    "repeat_within_7d_pct": round(100 * float(repeat["repeat_within_7d"]) / len(inc), 1),
    "noise_pct": round(100 * float(rules["auto_resolved"].sum()) / total_alerts, 1),
    "noisy_rule_count": int(len(top_noisy)),
    "noisy_rule_volume_pct": round(100 * float(top_noisy["alerts_fired"].sum()) / total_alerts, 1),
    "date_from": inc["start_time"].min().strftime("%Y-%m-%d"),
    "date_to": inc["start_time"].max().strftime("%Y-%m-%d"),
}

svc = recs(sql_res["service_reliability"])
cat = recs(sql_res["category_mttr"])
pareto = recs(sql_res["root_cause_pareto"])
tenants = recs(sql_res["tenant_downtime"])
hour = recs(sql_res["by_hour"])
# SQLite %w: 0=Sunday -> relabel Mon..Sun
names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
weekday = [{"day": names[r["weekday"]], "incidents": r["incidents"]} for r in recs(sql_res["by_weekday"])]
weekday = weekday[1:] + weekday[:1]
monthly = recs(sql_res["monthly_trend"])
sev = recs(sql_res["severity_sla"])

peak_hour = max(hour, key=lambda r: r["incidents"])
top_days = sorted(weekday, key=lambda r: -r["incidents"])[:2]
top5_cause_share = pareto[4]["cumulative_pct"]
worst_svc = svc[0]
most_incidents = max(svc, key=lambda r: r["incidents"])
slowest_cat = cat[0]
fastest_cat = cat[-1]
top_tenant = tenants[0]

insights = [
    f"{most_incidents['service']} generated the most incidents ({most_incidents['incidents']}), while {worst_svc['service']} had the highest SLA breach rate ({worst_svc['breach_pct']}%).",
    f"{slowest_cat['category']} incidents take longest to resolve (avg {slowest_cat['avg_mttr_min']} min), about {round(slowest_cat['avg_mttr_min'] / fastest_cat['avg_mttr_min'], 1)}x {fastest_cat['category']} ({fastest_cat['avg_mttr_min']} min).",
    f"The top 5 root causes account for {top5_cause_share}% of all incidents; the largest is '{pareto[0]['root_cause']}' ({pareto[0]['share_pct']}%).",
    f"{kpis['repeat_within_7d_pct']}% of incidents repeat the same service and root cause within 7 days of the previous one.",
    f"{kpis['noisy_rule_count']} noisy alert rules (75%+ auto-resolved) produce {kpis['noisy_rule_volume_pct']}% of all alert volume.",
    f"Incidents peak on {top_days[0]['day']} and {top_days[1]['day']}, and at {peak_hour['hour']:02d}:00.",
    f"{top_tenant['tenant']} lost the most time to incidents ({round(top_tenant['downtime_min'] / 60, 1)} downtime hours across {top_tenant['incidents']} incidents).",
]
recommendations = [
    f"Add an automated runbook and connection-pool alerting for '{pareto[0]['root_cause']}' and the other top recurring causes.",
    f"Review on-call coverage and SLA targets for {worst_svc['service']} and {svc[1]['service']}, the services breaching SLA most often.",
    f"Tune or aggregate the {kpis['noisy_rule_count']} noisy alert rules to cut alert fatigue and surface real incidents.",
    "Schedule risky deployments away from the Tuesday/Thursday afternoon peak and add pre-deploy checks.",
]

out = {
    "synthetic": True,
    "kpis": kpis,
    "services": svc,
    "categories": cat,
    "root_causes": pareto,
    "alert_rules": recs(noisy),
    "hours": hour,
    "weekdays": weekday,
    "monthly": monthly,
    "tenants": tenants,
    "severity": sev,
    "insights": insights,
    "recommendations": recommendations,
}
(DATA / "saas-incident-insights.json").write_text(json.dumps(out, indent=2), encoding="utf-8")
print(json.dumps({"kpis": kpis, "insights": insights}, indent=2))
