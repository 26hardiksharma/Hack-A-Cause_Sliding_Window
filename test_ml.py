import urllib.request, json

body = json.dumps({"districts": [
    {"district_id": 1, "district_name": "Beed",    "rainfall": 5.0,  "temperature": 38.5, "humidity": 30.0, "rain_7d": 12.0,  "rain_30d": 42.0},
    {"district_id": 4, "district_name": "Solapur", "rainfall": 0.5,  "temperature": 42.0, "humidity": 18.0, "rain_7d": 3.0,   "rain_30d": 15.0},
    {"district_id": 7, "district_name": "Jalgaon", "rainfall": 20.0, "temperature": 31.0, "humidity": 55.0, "rain_7d": 55.0,  "rain_30d": 160.0},
]}).encode()

try:
    req = urllib.request.Request(
        "http://localhost:8000/api/predict/batch",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    resp = json.loads(urllib.request.urlopen(req).read())
    print(f"Model: {resp['model_version']}")
    print("-" * 45)
    for p in resp["predictions"]:
        bar = round(p["drought_prob"] * 20) * "█"
        print(f"  {p['district_name']:<12} {p['risk_level']:<9} {p['drought_prob']*100:5.1f}%  {bar}")
except urllib.error.HTTPError as e:
    print("ERROR", e.code)
    print(e.read().decode())
