"""Generate the SYNTHETIC SaaS incident dataset used by the
"SaaS Reliability & Incident Intelligence" project.

All data is randomly generated with a fixed seed. No employer, client or
confidential data is used. Service, tenant and rule names are fictional.

Usage:  python generate_data.py
Writes: ../../public/data/saas-incidents.csv
        ../../public/data/saas-alert-rules.csv
"""
from pathlib import Path

import numpy as np
import pandas as pd

SEED = 42
rng = np.random.default_rng(SEED)
OUT = Path(__file__).resolve().parents[2] / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

START, END = pd.Timestamp("2025-07-01"), pd.Timestamp("2026-06-30 23:59")
N_INCIDENTS = 4200

# service -> (incident weight, MTTR multiplier)
SERVICES = {
    "auth-service": (1.0, 0.9),
    "api-gateway": (1.2, 0.9),
    "billing-engine": (1.3, 1.1),
    "payment-processor": (1.9, 1.35),
    "notification-service": (2.2, 1.2),
    "search-service": (0.9, 1.0),
    "reporting-engine": (1.6, 1.3),
    "data-sync-worker": (1.4, 1.15),
    "file-storage": (0.7, 0.95),
    "user-profile-api": (0.8, 0.85),
    "analytics-collector": (1.0, 1.0),
    "admin-portal": (0.6, 0.8),
}

# category -> (weight, median MTTR minutes)
CATEGORIES = {
    "Database": (1.5, 95),
    "Deployment": (1.3, 55),
    "Network": (0.8, 70),
    "Third-Party API": (1.4, 120),
    "Capacity": (1.0, 85),
    "Code Defect": (1.2, 150),
}

# category -> [(root cause, weight)]  (skewed so a few causes recur)
ROOT_CAUSES = {
    "Database": [("Connection pool exhaustion", 5), ("Deadlock on hot table", 3), ("Slow query / missing index", 3), ("Replication lag", 1)],
    "Deployment": [("Misconfigured environment variable", 4), ("Failed schema migration", 3), ("Bad release rollback", 2), ("Certificate expired", 1)],
    "Network": [("DNS resolution failure", 3), ("Load balancer health-check flap", 3), ("Cross-region latency spike", 1)],
    "Third-Party API": [("Email provider timeout", 5), ("Payment gateway rate limiting", 4), ("SMS provider outage", 2)],
    "Capacity": [("Queue backlog growth", 4), ("Memory leak in worker", 3), ("Disk space exhaustion", 2)],
    "Code Defect": [("Unhandled null reference", 3), ("Retry storm / missing back-off", 3), ("Race condition in job scheduler", 2)],
}

SEVERITIES = {"P1": (0.08, 0.8, 60), "P2": (0.22, 1.0, 240), "P3": (0.45, 1.3, 480), "P4": (0.25, 1.8, 1440)}  # prob, MTTR mult, SLA minutes

TENANTS = {
    "Orion Logistics": 1.7, "Helix Health": 1.4, "Cedar Retail": 1.2, "Pinnacle Finance": 1.5,
    "Atlas Education": 0.8, "Nimbus Media": 0.9, "Vertex Telecom": 1.1, "Summit Energy": 0.6,
}

WEEKDAY_W = np.array([1.15, 1.2, 1.1, 1.25, 1.0, 0.5, 0.45])  # Mon..Sun
HOUR_W = np.array([0.5, 0.4, 1.6, 0.5, 0.4, 0.5, 0.7, 1.0, 1.6, 2.2, 2.4, 2.0, 1.4, 1.4, 1.9, 2.3, 2.2, 1.8, 1.0, 0.8, 0.7, 0.6, 0.5, 0.5])  # spike at 02:00 (batch jobs)


def choice(d: dict, size: int) -> np.ndarray:
    keys = list(d)
    w = np.array([v[0] if isinstance(v, tuple) else v for v in d.values()], dtype=float)
    return rng.choice(keys, size=size, p=w / w.sum())


# ---- start times -------------------------------------------------------
days = pd.date_range(START.normalize(), END.normalize(), freq="D")
month_growth = 1 + 0.025 * np.asarray((days.year - 2025) * 12 + days.month - 7, dtype=float)
day_w = WEEKDAY_W[days.day_of_week] * month_growth
day_idx = rng.choice(len(days), size=N_INCIDENTS, p=day_w / day_w.sum())
hours = rng.choice(24, size=N_INCIDENTS, p=HOUR_W / HOUR_W.sum())
minutes = rng.integers(0, 60, size=N_INCIDENTS)

cat = choice(CATEGORIES, N_INCIDENTS)
# deployments cluster on Tue/Thu afternoons
dep = cat == "Deployment"
dep_days = np.where((days.day_of_week == 1) | (days.day_of_week == 3))[0]
day_idx[dep] = rng.choice(dep_days, size=dep.sum())
hours[dep] = rng.choice([14, 15, 16, 17], size=dep.sum())

start = days[day_idx] + pd.to_timedelta(hours, unit="h") + pd.to_timedelta(minutes, unit="m")

svc = choice({k: v[0] for k, v in SERVICES.items()}, N_INCIDENTS)
sev = choice({k: v[0] for k, v in SEVERITIES.items()}, N_INCIDENTS)
tenant = choice(TENANTS, N_INCIDENTS)

# ---- root causes & MTTR -------------------------------------------------
root = np.empty(N_INCIDENTS, dtype=object)
for c, causes in ROOT_CAUSES.items():
    m = cat == c
    names, w = zip(*causes)
    root[m] = rng.choice(names, size=m.sum(), p=np.array(w) / sum(w))

base = np.array([CATEGORIES[c][1] for c in cat], dtype=float)
svc_mult = np.array([SERVICES[s][1] for s in svc])
sev_mult = np.array([SEVERITIES[s][1] for s in sev])
mttr = base * svc_mult * sev_mult * rng.lognormal(0, 0.55, N_INCIDENTS)
mttr = np.clip(np.round(mttr), 5, 2880).astype(int)
sla = np.array([SEVERITIES[s][2] for s in sev])
breached = (mttr > sla).astype(int)

downtime = np.round(mttr * rng.uniform(0.3, 1.0, N_INCIDENTS)).astype(int)
n_alerts = np.clip(rng.poisson(7, N_INCIDENTS) + (sev == "P1") * 10 + (sev == "P2") * 4, 1, 60)

inc = pd.DataFrame({
    "incident_id": [f"INC-{i + 1:05d}" for i in range(N_INCIDENTS)],
    "start_time": start,
    "service": svc,
    "tenant": tenant,
    "category": cat,
    "root_cause": root,
    "severity": sev,
    "resolution_minutes": mttr,
    "sla_target_minutes": sla,
    "sla_breached": breached,
    "tenant_downtime_minutes": downtime,
    "alerts_linked": n_alerts,
}).sort_values("start_time").reset_index(drop=True)
inc["incident_id"] = [f"INC-{i + 1:05d}" for i in range(len(inc))]
inc["start_time"] = inc["start_time"].dt.strftime("%Y-%m-%d %H:%M")
inc.to_csv(OUT / "saas-incidents.csv", index=False)

# ---- alert rules (aggregated; individual alerts are not stored) ----------
RULES = [
    # rule, service, noise (share auto-resolved with no human action), volume weight
    ("cpu_high_warning", "data-sync-worker", 0.93, 9.0), ("disk_space_warning", "file-storage", 0.90, 7.0),
    ("health_check_flap", "api-gateway", 0.95, 8.0), ("memory_usage_warning", "reporting-engine", 0.88, 6.0),
    ("queue_depth_warning", "notification-service", 0.82, 6.5), ("latency_p95_warning", "search-service", 0.78, 5.0),
    ("http_5xx_rate", "api-gateway", 0.35, 3.0), ("db_connection_pool_high", "billing-engine", 0.40, 2.5),
    ("payment_timeout", "payment-processor", 0.30, 2.5), ("email_delivery_failed", "notification-service", 0.45, 3.5),
    ("job_failed", "data-sync-worker", 0.50, 3.0), ("login_failure_spike", "auth-service", 0.55, 1.8),
    ("report_generation_slow", "reporting-engine", 0.60, 2.5), ("replication_lag", "billing-engine", 0.42, 1.2),
    ("cert_expiry_soon", "admin-portal", 0.20, 0.4), ("storage_upload_error", "file-storage", 0.48, 1.0),
    ("profile_api_latency", "user-profile-api", 0.58, 1.4), ("collector_dropped_events", "analytics-collector", 0.62, 1.6),
    ("deadlock_detected", "billing-engine", 0.25, 1.0), ("webhook_retry_exhausted", "payment-processor", 0.38, 1.5),
]
TOTAL_ALERTS = 52000
rw = np.array([r[3] for r in RULES])
fired = np.round(TOTAL_ALERTS * rw / rw.sum()).astype(int)
rows = []
for (rule, service, noise, _), f in zip(RULES, fired):
    resolved = int(rng.binomial(f, noise))
    linked = int(min(f - resolved, max(1, rng.binomial(f, 1 - noise) // 4)))
    rows.append({"rule": rule, "service": service, "alerts_fired": int(f), "auto_resolved": resolved, "incidents_linked": linked})
pd.DataFrame(rows).to_csv(OUT / "saas-alert-rules.csv", index=False)
print(f"incidents: {len(inc)}  alert rules: {len(rows)}  total alerts: {int(fired.sum())}")
