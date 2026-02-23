"""
Scheduler – wraps APScheduler to run daily_predict at 6AM IST.
Run as a long-running process alongside the FastAPI server.

Usage: python -m app.cron.scheduler
"""
import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from app.cron.daily_predict import run_pipeline

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

scheduler = BlockingScheduler(timezone="Asia/Kolkata")

# 6:00 AM IST daily
scheduler.add_job(
    run_pipeline,
    trigger=CronTrigger(hour=6, minute=0),
    id="daily_prediction",
    name="Daily Drought Prediction Pipeline",
    misfire_grace_time=300,
)

if __name__ == "__main__":
    log.info("🕕 Starting AquaGov scheduler (cron: 6AM IST daily)...")
    try:
        scheduler.start()
    except KeyboardInterrupt:
        log.info("Scheduler stopped.")
