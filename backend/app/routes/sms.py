"""
SMS Alert Routes – Twilio integration
POST /api/sms/send          – send bulk SMS advisory
POST /api/sms/register      – handle inbound SMS "JOIN <PINCODE>"
GET  /api/sms/campaigns     – list past SMS campaigns
GET  /api/sms/campaigns/{id} – single campaign stats
POST /api/sms/simulate      – send test SMS to single number (demo)
"""
from __future__ import annotations
import os
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException
from app.schemas import SMSAlertRequest, SMSAlertResponse, SMSRegisterRequest

router = APIRouter()

# ─── Twilio helper ────────────────────────────────────────────────────────────

def _get_twilio_client():
    from twilio.rest import Client
    sid   = os.getenv("TWILIO_ACCOUNT_SID")
    token = os.getenv("TWILIO_AUTH_TOKEN")
    if not sid or not token:
        return None
    return Client(sid, token)


def _twilio_phone() -> str:
    return os.getenv("TWILIO_PHONE_NUMBER", "+15550000000")


# ─── Twilio trial: only verified numbers can receive messages ─────────────────
# Add / remove numbers here as you verify them in the Twilio console.
_VERIFIED_NUMBERS: list[str] = [
    "+918806693379",
    "+919981978217",
    "+917350557473",
    "+917020953443",
]

_MOCK_CAMPAIGNS: list[dict] = []


def _load_subscribers(district_ids: list[int], target_group: str) -> list[str]:
    """
    Return phone numbers to send to.
    Twilio trial accounts can only deliver to verified (allowlisted) numbers,
    so we always use _VERIFIED_NUMBERS as the recipient list.
    In production (upgraded Twilio), swap this for a real Supabase query.
    """
    try:
        from app.db import get_supabase
        sb = get_supabase()
        query = sb.table("subscribers").select("phone")
        if target_group != "all":
            query = query.eq("group", target_group)
        rows = query.execute().data or []
        phones = [r["phone"] for r in rows]
        if phones:
            return phones
    except Exception:
        pass
    # Fallback: Twilio trial verified numbers only
    return _VERIFIED_NUMBERS


@router.post("/sms/send", response_model=SMSAlertResponse)
def send_sms_alert(payload: SMSAlertRequest):
    """
    Send bulk SMS advisory via Twilio.
    Falls back to simulation when Twilio credentials are absent.
    """
    phones = _load_subscribers(payload.district_ids, payload.target_group)
    if not phones:
        raise HTTPException(status_code=422, detail="No subscribers found for target group.")

    client  = _get_twilio_client()
    sent, failed = 0, 0
    campaign_id  = str(uuid.uuid4())

    for phone in phones:
        try:
            if client:
                client.messages.create(
                    body = payload.message,
                    from_= _twilio_phone(),
                    to   = phone,
                )
            # else: log simulation
            sent += 1
        except Exception as exc:
            print(f"  SMS to {phone} failed: {exc}")
            failed += 1

    # Persist campaign record
    campaign = {
        "id":           campaign_id,
        "message":      payload.message,
        "target_group": payload.target_group,
        "recipients":   len(phones),
        "sent":         sent,
        "failed":       failed,
        "delivery_rate": round(sent / len(phones) * 100, 1) if phones else 0,
        "created_at":   datetime.utcnow().isoformat(),
    }
    _MOCK_CAMPAIGNS.append(campaign)

    try:
        from app.db import get_supabase
        get_supabase().table("sms_campaigns").upsert(campaign).execute()
    except Exception:
        pass

    mode = "live" if client else "simulated"
    return SMSAlertResponse(
        queued      = len(phones),
        sent        = sent,
        failed      = failed,
        campaign_id = campaign_id,
        message     = f"Campaign {campaign_id} dispatched ({mode}). {sent}/{len(phones)} sent.",
    )


@router.post("/sms/register")
def sms_register(payload: SMSRegisterRequest):
    """
    Handle inbound SMS registration: 'JOIN <PINCODE>'
    Twilio webhook → call this endpoint.
    """
    body = payload.body.strip().upper()
    if not body.startswith("JOIN"):
        return {"reply": "To subscribe, SMS 'JOIN <PINCODE>' (e.g. JOIN 413001)."}

    parts = body.split()
    pincode = parts[1] if len(parts) > 1 else None
    if not pincode or not pincode.isdigit():
        return {"reply": "Invalid format. SMS 'JOIN 413001' to subscribe."}

    subscriber = {
        "phone":      payload.phone,
        "pincode":    pincode,
        "group":      "farmers",
        "registered": datetime.utcnow().isoformat(),
        "active":     True,
    }

    try:
        from app.db import get_supabase
        get_supabase().table("subscribers").upsert(subscriber, on_conflict="phone").execute()
    except Exception:
        _MOCK_SUBSCRIBERS.append(subscriber)

    return {
        "reply": (
            f"✅ Subscribed! You will receive drought alerts for pincode {pincode}. "
            f"Reply STOP to unsubscribe."
        ),
        "subscriber": subscriber,
    }


@router.get("/sms/campaigns")
def list_campaigns(limit: int = 20):
    """List past SMS campaigns."""
    try:
        from app.db import get_supabase
        rows = (
            get_supabase()
            .table("sms_campaigns")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        ).data or []
        if rows:
            return {"campaigns": rows, "total": len(rows)}
    except Exception:
        pass
    return {"campaigns": list(reversed(_MOCK_CAMPAIGNS[-limit:])), "total": len(_MOCK_CAMPAIGNS)}


@router.get("/sms/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    """Single campaign stats."""
    match = next((c for c in _MOCK_CAMPAIGNS if c["id"] == campaign_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return match


@router.post("/sms/simulate")
def simulate_sms(to: str, message: str):
    """Demo helper – log SMS without sending."""
    print(f"[SMS SIMULATE] To: {to} | Msg: {message}")
    return {"status": "simulated", "to": to, "message": message}
