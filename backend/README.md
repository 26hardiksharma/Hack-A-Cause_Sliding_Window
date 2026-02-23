# AquaGov Backend – ML Microservice

FastAPI-based Python backend powering the AquaGov drought intelligence platform.

## Architecture

```
backend/
├── main.py                    # FastAPI app entry point
├── pyproject.toml             # Dependencies (uv / pip)
├── .env.example               # Environment variable template
├── supabase_schema.sql        # Supabase DB schema (run once)
└── app/
    ├── db.py                  # Supabase client singleton
    ├── schemas.py             # Pydantic models
    ├── ml/
    │   ├── generate_data.py   # Synthetic dataset generator
    │   ├── train_model.py     # LSTM training script
    │   ├── predictor.py       # Runtime inference (model.h5 + scaler.pkl)
    │   └── data/              # Generated CSV + JSON files
    ├── routes/
    │   ├── health.py          # GET /api/health
    │   ├── predictions.py     # POST /api/predict, /api/predict/batch
    │   ├── districts.py       # GET /api/districts, /{id}, /{id}/history
    │   ├── sms.py             # POST /api/sms/send, /api/sms/register
    │   ├── tankers.py         # CRUD + optimize /api/tankers
    │   └── users.py           # CRUD /api/users
    └── cron/
        └── daily_predict.py   # 6AM pipeline: predict → store → SMS
```

## Quick Start

### 1. Setup environment

```bash
cd backend

# Copy and fill in credentials
cp .env.example .env

# Install dependencies (using uv – recommended)
pip install uv
uv sync

# OR with regular pip
pip install fastapi uvicorn numpy pandas scikit-learn tensorflow h5py python-dotenv supabase pydantic httpx twilio python-multipart
```

### 2. Setup Database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase_schema.sql` → **Run**
3. Copy your **Project URL** and **Service Role Key** → paste in `.env`

### 3. Generate Data & Train Model

```bash
# Generate 10 districts × 3 years synthetic dataset
python -m app.ml.generate_data

# Train LSTM model (~5–10 min on CPU, saves model.h5 + scaler.pkl)
python -m app.ml.train_model
```

> **Demo mode**: The API works without model.h5 using a heuristic fallback predictor. Great for quicck demo!

### 4. Start the API server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Run daily cron pipeline manually

```bash
python -m app.cron.daily_predict
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health + model info |
| POST | `/api/predict` | Single district prediction |
| POST | `/api/predict/batch` | Multi-district batch |
| GET | `/api/predict/latest` | Latest stored predictions |
| GET | `/api/predict/{id}` | District-specific prediction |
| GET | `/api/districts` | All districts + risk levels |
| GET | `/api/districts/{id}` | Single district detail |
| GET | `/api/districts/{id}/history` | Historical VWSI trend |
| POST | `/api/sms/send` | Send bulk SMS advisory |
| POST | `/api/sms/register` | Inbound SMS registration |
| GET | `/api/sms/campaigns` | List past campaigns |
| GET | `/api/tankers` | Fleet status list |
| GET | `/api/tankers/{id}` | Single tanker |
| PATCH | `/api/tankers/{id}` | Update location/status |
| POST | `/api/tankers/optimize` | Route optimization |
| GET | `/api/tankers/feed` | Live event feed |
| GET | `/api/users` | Paginated user list |
| POST | `/api/users` | Create user |
| PATCH | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Soft-delete user |

Interactive docs: **http://localhost:8000/docs**

## ML Model Specs

| Component | Value |
|-----------|-------|
| Architecture | LSTM(50) → Dropout(0.2) → LSTM(50) → Dropout(0.2) → Dense(sigmoid) |
| Sequence length | 30 days |
| Features | rainfall, temperature, humidity, rain_7d, rain_30d |
| Target | drought probability (0–1) |
| Risk thresholds | ≥0.70=CRITICAL, ≥0.40=HIGH, ≥0.20=MEDIUM, <0.20=LOW |
| Dataset | 10 districts × 3 years × 365 days = 10,950 records |

## Risk Level → SMS Triggers

Droughts escalating from MEDIUM→HIGH or new CRITICAL predictions automatically
queue SMS alerts via `app/cron/daily_predict.py`.

## Deployment (Railway)

```bash
# railway.toml or Procfile
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set all `.env` variables in Railway's Environment Variables panel.
