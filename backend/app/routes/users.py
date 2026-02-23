"""
User Management Routes
GET    /api/users          – paginated user list
POST   /api/users          – create user
GET    /api/users/{id}     – single user
DELETE /api/users/{id}     – soft-delete user
PATCH  /api/users/{id}     – update user fields
"""
from __future__ import annotations
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from app.schemas import User, UserCreate

router = APIRouter()

# ── In-memory store (replace with Supabase) ────────────────────────────────────
_MOCK_USERS: list[dict] = [
    {"id": 1, "name": "Rajesh Patil",  "email": "rajesh.p@maharashtra.gov.in", "role": "admin",         "region": "Beed District",      "phone": "+919876540001", "status": "active",   "created_at": "2024-01-01T00:00:00", "last_active": datetime.utcnow().isoformat()},
    {"id": 2, "name": "Amit Kumar",    "email": "amit.k@maharashtra.gov.in",   "role": "block_manager", "region": "Parli Block",         "phone": "+919876540002", "status": "active",   "created_at": "2024-01-05T00:00:00", "last_active": datetime.utcnow().isoformat()},
    {"id": 3, "name": "Priya Sharma",  "email": "priya.s@maharashtra.gov.in",  "role": "block_manager", "region": "Majalgaon Block",     "phone": "+919876540003", "status": "inactive", "created_at": "2024-02-01T00:00:00", "last_active": None},
    {"id": 4, "name": "Suresh Nair",   "email": "suresh.n@maharashtra.gov.in", "role": "operator",      "region": "Khamgaon",            "phone": "+919876540004", "status": "active",   "created_at": "2024-03-10T00:00:00", "last_active": datetime.utcnow().isoformat()},
    {"id": 5, "name": "Meena Jadhav",  "email": "meena.j@maharashtra.gov.in",  "role": "dwo",           "region": "Latur District",      "phone": "+919876540005", "status": "active",   "created_at": "2024-04-01T00:00:00", "last_active": datetime.utcnow().isoformat()},
]
_next_id = 6


def _db_users_or_mock(limit: int, offset: int) -> tuple[list[dict], int]:
    try:
        from app.db import get_supabase
        sb  = get_supabase()
        res = sb.table("users").select("*", count="exact").range(offset, offset + limit - 1).execute()
        if res.data:
            return res.data, res.count or len(res.data)
    except Exception:
        pass
    total = len(_MOCK_USERS)
    return _MOCK_USERS[offset:offset + limit], total


@router.get("/users")
def list_users(
    page:  int = Query(default=1,  ge=1),
    limit: int = Query(default=20, le=100),
):
    offset = (page - 1) * limit
    rows, total = _db_users_or_mock(limit, offset)
    return {
        "users":  rows,
        "total":  total,
        "page":   page,
        "pages":  (total + limit - 1) // limit,
    }


@router.post("/users", response_model=User, status_code=201)
def create_user(payload: UserCreate):
    global _next_id
    user = {
        "id":          _next_id,
        "name":        payload.name,
        "email":       payload.email,
        "role":        payload.role,
        "region":      payload.region,
        "phone":       payload.phone,
        "status":      "active",
        "created_at":  datetime.utcnow().isoformat(),
        "last_active": None,
    }
    _next_id += 1

    try:
        from app.db import get_supabase
        get_supabase().table("users").upsert(user).execute()
    except Exception:
        _MOCK_USERS.append(user)

    return User(**user)


@router.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    try:
        from app.db import get_supabase
        res = get_supabase().table("users").select("*").eq("id", user_id).single().execute()
        if res.data:
            return User(**res.data)
    except Exception:
        pass
    match = next((u for u in _MOCK_USERS if u["id"] == user_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**match)


@router.patch("/users/{user_id}", response_model=User)
def update_user(user_id: int, payload: dict):
    """Partial update (role, status, region …)."""
    try:
        from app.db import get_supabase
        res = get_supabase().table("users").update(payload).eq("id", user_id).execute()
        if res.data:
            return User(**res.data[0])
    except Exception:
        pass
    match = next((u for u in _MOCK_USERS if u["id"] == user_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="User not found")
    match.update(payload)
    return User(**match)


@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    """Soft-delete – set status = 'inactive'."""
    return update_user(user_id, {"status": "inactive"})
