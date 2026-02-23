# AquaGov PRD - ML-Powered Drought Platform

## Executive Summary

AquaGov is a **strictly web-based** hackathon platform delivering **LSTM-driven drought predictions**, smart tanker routing, and SMS alerts for drought-prone regions (Maharashtra focus). Uses synthetic datasets for demo reliability. Targets rural/urban residents and officials via responsive web dashboard + SMS. Full-stack: Next.js + Node/FastAPI + Supabase + Twilio.

**MVP Launch**: 72-hour hackathon prototype with live predictions.

## Product Vision & Goals

**Vision**: Real-time drought risk platform reducing response time 40% via 7-day forecasts.

**Hackathon KPIs**:

- Live LSTM predictions across 10+ districts
- End-to-end demo: prediction → map → SMS trigger
- 85%+ model accuracy on synthetic validation data
- Judge score: technical depth + demo polish

## Target Users & Access

| User Type                 | Web Dashboard    | SMS Alerts   | PIN Registration  |
| ------------------------- | ---------------- | ------------ | ----------------- |
| **Farmers** (70%)         | Community kiosks | Daily risk   | SMS "JOIN 413001" |
| **Urban Residents** (20%) | Phone browsers   | Backup       | Web form          |
| **Tanker Operators** (5%) | Route maps       | Dispatch SMS | Web login         |
| **Govt Officials** (5%)   | Full admin       | Reports      | OTP login         |

**Strictly web-based**: No mobile apps, no downloads.

## Core Features

### 1. LSTM Drought Prediction Engine

**Model**: LSTM(50-50) with 30-day sequences predicting 7-day drought probability.

**Synthetic Dataset** (pre-generated):

**Features**: rainfall, temp, humidity, rolling sums, SPI proxy
**Output**: Risk levels (LOW/MEDIUM/HIGH/CRITICAL) → District heatmap

**Daily Pipeline**:
**Cron 6AM → FastAPI /predict → Supabase predictions → Web dashboard → SMS triggers**

### 2. Smart Tanker Routing

**Algorithm**: Google Maps Directions API + capacity matching
**Dashboard**: Live tracking, ETA predictions, fuel optimization
**SMS**: Route links for operators ("Follow: maps.app/abc123")

### 3. SMS Alert System

**Provider**: Twilio (TRAI compliant)
**Triggers**: Risk level ↑ (MEDIUM→HIGH) or new CRITICAL predictions
**Templates**:

**Registration**: SMS "JOIN <PINCODE>" → Auto-subscribe

## Technical Architecture

Frontend: Next.js 14 + Tailwind + Chart.js + Leaflet Maps
Backend:
├─ Node.js/Express (main API + cron)
└─ Python FastAPI (ML microservice)
Database + Auth: Supabase
ML: TensorFlow LSTM + Scikit-learn preprocessing
External: Twilio SMS + Google Maps + Resend Email
Deploy: Vercel (frontend) + Railway (backend/ML)

**Data Flow**:
Synthetic CSV → LSTM Training → model.h5 → Daily Predict → Supabase
↓
Web Dashboard ← Supabase ← Node Cron ← Risk Thresholds → Twilio SMS

## ML Model Specifications

| Component     | Details                                 | Status                |
| ------------- | --------------------------------------- | --------------------- |
| **Dataset**   | Synthetic: 10 districts × 3 years daily | ✅ Generated          |
| **Model**     | LSTM(50→50→1), 30-day sequences         | Binary classification |
| **Features**  | rainfall, temp, humidity, rain_7d/30d   | 5 inputs              |
| **Target**    | Drought probability (0-1) next 7 days   | Risk levels           |
| **Metrics**   | Accuracy >85%, F1 >0.8 on validation    | Demo-ready            |
| **Inference** | <500ms per district batch               | Production scale      |

**Risk Levels**:
prob >0.7 = CRITICAL (red)
0.4-0.7 = HIGH (orange)
0.2-0.4 = MEDIUM (yellow)
<0.2 = LOW (green)

## User Flows

### Admin/Official Flow

Web login (OTP) → Dashboard

Heatmap shows Solapur turning CRITICAL

Click → "Send Alerts" → 500 SMS queued

Auto-generate tanker routes → Assign operators

Live tracking → Delivery

### Resident Flow

SMS "JOIN 413001" → Daily risk updates

Web kiosk → See heatmap + tanker ETA

Reply "DONE" → Confirms water received

## Frontend Screens

├── /dashboard # District heatmap + risk trends (Chart.js)
├── /admin # Dispatch panel + route planner
├── /register # PIN-based signup
├── /predictions # Model explainability + accuracy metrics
└── /live # Real-time tanker tracking

## Hackathon Timeline (72 hours)

| Day   | 8AM-2PM               | 2PM-8PM                 | 8PM-12AM            | Deliverable |
| ----- | --------------------- | ----------------------- | ------------------- | ----------- |
| **1** | Next.js UI + Supabase | Synthetic data pipeline | LSTM training       | Dashboard   |
| **2** | FastAPI ML service    | Node cron + Twilio      | Google Maps routing | E2E flow    |
| **3** | Demo polish + metrics | Judge presentation prep | Live demo rehearsal | MVP ready   |

## Success Metrics (Hackathon Demo)

- **Technical**: LSTM accuracy >85%, <2s page loads
- **Demo**: Live prediction → map color change → SMS trigger
- **Visual**: Heatmap + Chart.js trends + route optimization
- **Scale**: 10 districts × 30-day history demo-ready

## Deployment & Dependencies

## Risks & Mitigations

| Risk                   | Impact | Mitigation                         |
| ---------------------- | ------ | ---------------------------------- |
| LSTM overfitting       | Medium | Synthetic data diversity + dropout |
| Twilio trial limits    | Low    | SMS simulator fallback             |
| Supabase rate limits   | Low    | Batch inserts + caching            |
| Judge time constraints | High   | 3-min demo video + live flow       |

## Post-Hackathon Roadmap

Phase 2 (1M): Real IMD rainfall API integration
Phase 3 (6M): Govt dashboard + IoT sensors
Phase 4 (12M): Nationwide rollout (500+ districts)
