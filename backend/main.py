"""
AquaGov FastAPI ML Microservice
Handles LSTM drought prediction, model inference, and data serving.
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes import predictions, districts, health, sms, tankers, users, routing

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML model on startup, release on shutdown."""
    from app.ml.predictor import load_model
    print("🚀 AquaGov ML Service starting up...")
    load_model()
    print("✅ LSTM model loaded and ready.")
    yield
    print("🛑 AquaGov ML Service shutting down.")

app = FastAPI(
    title="AquaGov ML Microservice",
    description="LSTM-powered drought prediction API for AquaGov platform.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Route registration ──────────────────────────────────────────────────────
app.include_router(health.router,       prefix="/api",          tags=["Health"])
app.include_router(predictions.router,  prefix="/api",          tags=["Predictions"])
app.include_router(districts.router,    prefix="/api",          tags=["Districts"])
app.include_router(sms.router,          prefix="/api",          tags=["SMS"])
app.include_router(tankers.router,      prefix="/api",          tags=["Tankers"])
app.include_router(users.router,        prefix="/api",          tags=["Users"])
app.include_router(routing.router,      prefix="/api",          tags=["Routing"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
