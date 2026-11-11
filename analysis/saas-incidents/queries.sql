-- SaaS Reliability & Incident Intelligence: core analysis queries (synthetic data).
-- Written in standard SQL (window functions, CTEs); run in analyze.py via SQLite
-- and portable to SQL Server / PostgreSQL with minor date-function changes.
-- Tables: incidents, alert_rules

-- Q1: Incident volume, MTTR and SLA breach rate per service, ranked by breach rate
-- name: service_reliability
WITH s AS (
  SELECT service,
         COUNT(*)                          AS incidents,
         ROUND(AVG(resolution_minutes), 1) AS avg_mttr_min,
         SUM(sla_breached)                 AS breaches,
         ROUND(100.0 * SUM(sla_breached) / COUNT(*), 1) AS breach_pct,
         SUM(tenant_downtime_minutes)      AS downtime_min
  FROM incidents
  GROUP BY service
)
SELECT service, incidents, avg_mttr_min, breaches, breach_pct, downtime_min,
       RANK() OVER (ORDER BY breach_pct DESC) AS breach_rank
FROM s
ORDER BY breach_rank;

-- Q2: MTTR by incident category
-- name: category_mttr
SELECT category,
       COUNT(*)                          AS incidents,
       ROUND(AVG(resolution_minutes), 1) AS avg_mttr_min,
       MAX(resolution_minutes)           AS max_mttr_min
FROM incidents
GROUP BY category
ORDER BY avg_mttr_min DESC;

-- Q3: Recurring root causes with cumulative share (Pareto)
-- name: root_cause_pareto
WITH rc AS (
  SELECT root_cause, category, COUNT(*) AS incidents
  FROM incidents
  GROUP BY root_cause, category
)
SELECT root_cause, category, incidents,
       ROUND(100.0 * incidents / SUM(incidents) OVER (), 1) AS share_pct,
       ROUND(100.0 * SUM(incidents) OVER (ORDER BY incidents DESC, root_cause
                                          ROWS UNBOUNDED PRECEDING) / SUM(incidents) OVER (), 1) AS cumulative_pct
FROM rc
ORDER BY incidents DESC, root_cause;

-- Q4: Repeat incidents: same service + root cause within 7 days of the previous one (LAG)
-- name: repeat_incidents
WITH ordered AS (
  SELECT incident_id, service, root_cause, start_time,
         LAG(start_time) OVER (PARTITION BY service, root_cause ORDER BY start_time) AS prev_start
  FROM incidents
)
SELECT COUNT(*) AS total_incidents,
       SUM(CASE WHEN prev_start IS NOT NULL
                 AND julianday(start_time) - julianday(prev_start) <= 7 THEN 1 ELSE 0 END) AS repeat_within_7d
FROM ordered;

-- Q5: Noisy alert rules (share of alerts auto-resolved with no human action)
-- name: noisy_alerts
SELECT rule, service, alerts_fired, auto_resolved,
       ROUND(100.0 * auto_resolved / alerts_fired, 1) AS noise_pct,
       incidents_linked,
       ROUND(100.0 * alerts_fired / SUM(alerts_fired) OVER (), 1) AS volume_share_pct
FROM alert_rules
ORDER BY alerts_fired DESC;

-- Q6: Incident volume by hour of day
-- name: by_hour
SELECT CAST(strftime('%H', start_time) AS INTEGER) AS hour, COUNT(*) AS incidents
FROM incidents
GROUP BY hour
ORDER BY hour;

-- Q7: Incident volume by weekday (0 = Sunday in SQLite strftime('%w'))
-- name: by_weekday
SELECT CAST(strftime('%w', start_time) AS INTEGER) AS weekday, COUNT(*) AS incidents
FROM incidents
GROUP BY weekday
ORDER BY weekday;

-- Q8: Tenant downtime ranking
-- name: tenant_downtime
SELECT tenant,
       COUNT(*)                     AS incidents,
       SUM(tenant_downtime_minutes) AS downtime_min,
       SUM(sla_breached)            AS sla_breaches,
       RANK() OVER (ORDER BY SUM(tenant_downtime_minutes) DESC) AS downtime_rank
FROM incidents
GROUP BY tenant
ORDER BY downtime_rank;

-- Q9: Monthly incident trend with month-over-month change (LAG)
-- name: monthly_trend
WITH m AS (
  SELECT strftime('%Y-%m', start_time) AS month,
         COUNT(*)                          AS incidents,
         ROUND(AVG(resolution_minutes), 1) AS avg_mttr_min,
         ROUND(100.0 * (1 - 1.0 * SUM(sla_breached) / COUNT(*)), 1) AS sla_compliance_pct
  FROM incidents
  GROUP BY month
)
SELECT month, incidents, avg_mttr_min, sla_compliance_pct,
       incidents - LAG(incidents) OVER (ORDER BY month) AS mom_change
FROM m
ORDER BY month;

-- Q10: Severity mix and SLA compliance
-- name: severity_sla
SELECT severity,
       COUNT(*)                                                    AS incidents,
       ROUND(AVG(resolution_minutes), 1)                           AS avg_mttr_min,
       MAX(sla_target_minutes)                                     AS sla_target_min,
       ROUND(100.0 * (1 - 1.0 * SUM(sla_breached) / COUNT(*)), 1)  AS sla_compliance_pct
FROM incidents
GROUP BY severity
ORDER BY severity;
