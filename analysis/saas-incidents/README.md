# SaaS Reliability & Incident Intelligence

Operational analytics project. **All data is synthetic**: randomly generated with a fixed seed, fictional service, tenant and rule names, and no employer or client data.

| File | Purpose |
| --- | --- |
| `generate_data.py` | Generates 4,200 incidents and 20 alert rules (52,000 alerts) over 12 months into `public/data/` |
| `queries.sql` | Ten analysis queries: window functions, CTEs, LAG, running totals |
| `analyze.py` | Validates the data, runs the SQL via SQLite, cross-checks against Pandas, writes `public/data/saas-incident-insights.json` |

```bash
pip install pandas numpy
python generate_data.py
python analyze.py
```

The dashboard lives at `/incident-analytics` on the portfolio site.
