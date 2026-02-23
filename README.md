# AquaGov — ML-Powered Drought Intelligence + Tanker Ops + SMS Alerts

AquaGov is a web-based hackathon prototype that combines:

- **Drought risk prediction** (LSTM-style, 30-day sliding window → drought probability/risk level)
- **Operational dashboards** for districts, analytics, and fleet tracking
- **Smart routing preview** for tanker dispatch planning
- **SMS alert workflows** (Twilio integration + demo fallbacks)
- **Optional AI narrative insights** (Groq integration with mock fallback)

> Repo contains multiple services: a Next.js frontend, a FastAPI backend, and an optional standalone ML service.

---

## Repo Structure

- [PRD.md](PRD.md) — product requirements (note: contains unresolved merge markers to clean up)
- [frontend/](frontend/) — Next.js 14 dashboard UI + server route for AI insights
- [backend/](backend/) — FastAPI backend API (routes under `/api/*`)
- [ML/](ML/) — dataset audit, preprocessing, training, export bundle scripts
- [ml_service/](ml_service/) — optional separate FastAPI ML microservice

Key entry points:

- Backend app: [backend/main.py](backend/main.py)
- Frontend API client: [`api`](frontend/lib/api.ts) in [frontend/lib/api.ts](frontend/lib/api.ts)
- AI route (Groq): [frontend/app/api/ai/route.ts](frontend/app/api/ai/route.ts)
- Routing preview endpoint: [`preview_route`](backend/app/routes/routing.py) in [backend/app/routes/routing.py](backend/app/routes/routing.py)
- SMS routes: [`app.routes.sms`](backend/app/routes/sms.py) in [backend/app/routes/sms.py](backend/app/routes/sms.py)

---

## Quick Start (Local Dev)

### 1) Frontend (Next.js)

From the integrated terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend reads:

- `NEXT_PUBLIC_API_URL` (optional) to point to backend (defaults to `http://localhost:8000/api` in [frontend/lib/api.ts](frontend/lib/api.ts)).

### 2) Backend (FastAPI, port 8000)

```bash
cd backend
# install deps (either uv or pip)
pip install -r requirements.txt

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend registers routes in [backend/main.py](backend/main.py) under `/api/*`.

### 3) (Optional) ML Service (FastAPI, port 8001)

If you want to run the standalone ML service in [ml_service/](ml_service/):

```bash
cd ml_service
pip install -r requirements.txt  # if present; otherwise install required libs from pyproject/notes
uvicorn main:app --reload --port 8001
```

---

## Environment Variables

### Frontend

- `NEXT_PUBLIC_API_URL` — backend base URL, default: `http://localhost:8000/api`
- `GROQ_API_KEY` — enables Groq-powered AI insights (without it, [frontend/app/api/ai/route.ts](frontend/app/api/ai/route.ts) returns mock insights)

### Backend

- Twilio credentials (used by [`app.routes.sms`](backend/app/routes/sms.py))
- Supabase credentials (described in [backend/README.md](backend/README.md))
- Google Maps key (if routing uses Directions API in your environment; backend also supports fallback behavior in routing)

> See [backend/README.md](backend/README.md) for backend setup details.

---

## ML Pipeline (Synthetic → Train → Bundle)

Scripts live in [ML/](ML/). Typical workflow:

1) Audit dataset feasibility:

```bash
cd ML
python dataset_audit.py
```

2) Preprocess into daily sequences + features:

```bash
python preprocess.py
```

3) Train model:

```bash
python train.py
```

4) Export inference bundle (scaler, thresholds, metadata):

```bash
python export_bundle.py
```

Artifacts are written under `ML/processed/` and `ML/models/` (see console output in [ML/train.py](ML/train.py) and [ML/preprocess.py](ML/preprocess.py)).

Risk thresholds are consistent with PRD and bundle export:

- CRITICAL: prob ≥ 0.70
- HIGH: prob ≥ 0.40
- MEDIUM: prob ≥ 0.20
- LOW: prob < 0.20
  (see [ML/export_bundle.py](ML/export_bundle.py) and `/risk-levels` in [ml_service/main.py](ml_service/main.py))

---

## Daily Automation (Predictions + SMS)

- Daily pipeline entry: [`run_pipeline`](backend/app/cron/daily_predict.py) in [backend/app/cron/daily_predict.py](backend/app/cron/daily_predict.py)
- Scheduler wrapper (6AM IST): [backend/app/cron/scheduler.py](backend/app/cron/scheduler.py)

Run manually:

```bash
cd backend
python -m app.cron.daily_predict
```

---

## Notes / Known Issues

- [PRD.md](PRD.md) contains unresolved merge-conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and should be cleaned.
- The repo includes both:
  - a backend prediction flow (port 8000) and
  - an optional standalone ML service (port 8001).
    Decide whether you want **one unified backend** or a **separate ML microservice** for deployment consistency.

---

## Demo Pages (Frontend)

- Dashboard: district risk overview + charts (see [`DashboardPageContent`](frontend/app/Components/dashboard/DashboardPageContent.tsx))
- Tracking: fleet feed + alert actions (see [`LiveFeed`](frontend/app/Components/tracking/LiveFeed.tsx))
- Alerts: SMS campaign UI (see [`AlertsPageContent`](frontend/app/Components/alerts/AlertsPageContent.tsx))
- AI Insights: Groq + mock fallback (see [`AIInsightsPageContent`](frontend/app/Components/ai-insights/AIInsightsPageContent.tsx))

---
