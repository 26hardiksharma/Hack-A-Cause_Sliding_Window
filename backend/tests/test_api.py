"""
Basic smoke tests for AquaGov API.
Run: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "model_version" in data


def test_predict_single():
    payload = {
        "district_id": 1,
        "rainfall": 5.0,
        "temperature": 40.0,
        "humidity": 25.0,
        "rain_7d": 12.0,
        "rain_30d": 40.0,
    }
    resp = client.post("/api/predict", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "drought_prob" in data
    assert data["risk_level"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert 0.0 <= data["drought_prob"] <= 1.0


def test_predict_batch():
    payload = {
        "districts": [
            {"district_id": 1, "rainfall": 5.0,  "temperature": 40.0, "humidity": 25.0, "rain_7d": 12.0, "rain_30d": 40.0},
            {"district_id": 2, "rainfall": 0.5,  "temperature": 43.0, "humidity": 18.0, "rain_7d": 3.0,  "rain_30d": 10.0},
        ]
    }
    resp = client.post("/api/predict/batch", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["predictions"]) == 2


def test_districts_list():
    resp = client.get("/api/districts")
    assert resp.status_code == 200
    data = resp.json()
    assert "districts" in data
    assert len(data["districts"]) > 0


def test_district_detail():
    resp = client.get("/api/districts/1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == 1


def test_district_history():
    resp = client.get("/api/districts/1/history?days=7")
    assert resp.status_code == 200
    data = resp.json()
    assert "history" in data
    assert len(data["history"]) == 7


def test_tankers_list():
    resp = client.get("/api/tankers")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_tankers_feed():
    resp = client.get("/api/tankers/feed")
    assert resp.status_code == 200
    data = resp.json()
    assert "feed" in data


def test_users_list():
    resp = client.get("/api/users")
    assert resp.status_code == 200
    data = resp.json()
    assert "users" in data


def test_predict_latest():
    resp = client.get("/api/predict/latest?limit=5")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
