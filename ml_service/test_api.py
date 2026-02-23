import urllib.request, json, sys

BASE = "http://localhost:8001"

def get(path):
    with urllib.request.urlopen(BASE + path) as r:
        return json.loads(r.read())

def post(path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(BASE + path, data=data,
                                  headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# ── 1. Health ──────────────────────────────────────────────────────────────────
print("=== GET /health ===")
h = get("/health")
print(f"  status:       {h['status']}")
print(f"  model_loaded: {h['model_loaded']}")
print(f"  accuracy:     {h['model_metrics']['accuracy']*100:.2f}%")
print(f"  auc_roc:      {h['model_metrics']['auc_roc']}")
print(f"  uptime_s:     {h['uptime_s']}s")
print(f"  version:      {h['version']}")

# ── 2. Risk levels ─────────────────────────────────────────────────────────────
print("\n=== GET /risk-levels ===")
rl = get("/risk-levels")
for r in rl:
    print(f"  {r['level']:<10}  {r['min_prob']:.2f}-{r['max_prob']:.2f}  {r['color']}  sms={r['sms_trigger']}")

# ── 3. Single predict (with synthetic sequence) ────────────────────────────────
print("\n=== POST /predict ===")
# Build a fake 30x8 sequence (drought-like: low rain, deep GW, low availability)
drought_seq = [[2.0, 14.0, 60.0, 42.0, 28.0, 90.0, 0.15, -1.5]] * 30
resp = post("/predict", {"village_id": "VLG0001", "sequence": drought_seq})
print(f"  village_id:          {resp['village_id']}")
print(f"  drought_probability: {resp['drought_probability']}")
print(f"  risk_level:          {resp['risk_level']}")
print(f"  risk_color:          {resp['risk_color']}")
print(f"  inference_ms:        {resp['inference_ms']}ms")

# Also test a healthy sequence (wet conditions)
print("\n=== POST /predict (healthy -- green zone) ===")
healthy_seq = [[18.0, 126.0, 540.0, 31.0, 86.0, 22.0, 0.98, 0.4]] * 30
resp2 = post("/predict", {"village_id": "VLG0010", "sequence": healthy_seq})
print(f"  drought_probability: {resp2['drought_probability']}")
print(f"  risk_level:          {resp2['risk_level']}")

# ── 4. Live predict (uses CSV data) ────────────────────────────────────────────
print("\n=== POST /predict/live/VLG0001?month=5 ===")
live = get("/predict/live/VLG0001?month=5")
print(f"  drought_probability: {live['drought_probability']}")
print(f"  risk_level:          {live['risk_level']}")
print(f"  predicted_at:        {live['predicted_at']}")

# ── 5. Batch predict ──────────────────────────────────────────────────────────
print("\n=== POST /predict/batch (3 villages) ===")
batch_body = {
    "villages": [
        {"village_id": "VLG0001", "sequence": drought_seq},
        {"village_id": "VLG0002", "sequence": healthy_seq},
        {"village_id": "VLG0003", "sequence": drought_seq},
    ]
}
batch = post("/predict/batch", batch_body)
print(f"  villages_count: {batch['villages_count']}")
print(f"  total_ms:       {batch['total_ms']}ms")
for p in batch["predictions"]:
    print(f"  {p['village_id']}  prob={p['drought_probability']}  level={p['risk_level']}")

# ── 6. Risk map (all 80 villages) ─────────────────────────────────────────────
print("\n=== GET /predict/risk-map ===")
rm = get("/predict/risk-map")
print(f"  timestamp:   {rm['timestamp']}")
print(f"  villages:    {len(rm['villages'])}")
print(f"  summary:     {rm['summary']}")
print("  Sample (first 3):")
for v in rm["villages"][:3]:
    print(f"    {v['village_id']} {v['village_name']:<20}  {v['risk_level']:<10}  prob={v['drought_probability']}")

print("\n=== ALL TESTS PASSED ===")
