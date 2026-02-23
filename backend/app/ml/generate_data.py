"""
Synthetic drought dataset generator.
Generates 10 Maharashtra districts × 3 years of daily climate records.
Run once: python -m app.ml.generate_data
"""
import os
import json
import random
import numpy as np
import pandas as pd
from datetime import date, timedelta

DISTRICTS = [
    {"id": 1,  "name": "Beed",       "lat": 18.99, "lng": 75.76},
    {"id": 2,  "name": "Latur",      "lat": 18.40, "lng": 76.56},
    {"id": 3,  "name": "Osmanabad", "lat": 18.18, "lng": 76.04},
    {"id": 4,  "name": "Solapur",    "lat": 17.68, "lng": 75.90},
    {"id": 5,  "name": "Aurangabad", "lat": 19.88, "lng": 75.33},
    {"id": 6,  "name": "Nanded",     "lat": 19.16, "lng": 77.31},
    {"id": 7,  "name": "Jalgaon",    "lat": 21.00, "lng": 75.56},
    {"id": 8,  "name": "Buldhana",   "lat": 20.53, "lng": 76.18},
    {"id": 9,  "name": "Washim",     "lat": 20.11, "lng": 77.13},
    {"id": 10, "name": "Yavatmal",   "lat": 20.39, "lng": 78.12},
]


def _drought_prob(row: pd.Series) -> float:
    """
    Heuristic drought probability based on climate features.
    Higher temp + lower rain → higher probability.
    """
    score = 0.0
    score += max(0, (42 - row["rainfall"]) / 42) * 0.35      # low rainfall
    score += max(0, (row["temperature"] - 28) / 20) * 0.25   # high temp
    score += max(0, (60 - row["humidity"]) / 60) * 0.20      # low humidity
    score += max(0, (50 - row["rain_7d"]) / 50) * 0.10       # low 7-day sum
    score += max(0, (200 - row["rain_30d"]) / 200) * 0.10    # low 30-day sum
    noise = np.random.normal(0, 0.04)
    return float(np.clip(score + noise, 0.0, 1.0))


def generate(output_dir: str = "app/ml/data") -> str:
    """Generate synthetic dataset and save as CSV. Returns path."""
    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)
    np.random.seed(42)

    start = date(2021, 1, 1)
    end   = date(2023, 12, 31)
    dates = [start + timedelta(days=i) for i in range((end - start).days + 1)]

    records = []
    for d in DISTRICTS:
        monthly_rain = {m: np.random.uniform(10, 200) for m in range(1, 13)}
        # overwrite monsoon months
        for m in (6, 7, 8, 9):
            monthly_rain[m] = np.random.uniform(80, 300)

        rain_buffer: list[float] = []
        for dt in dates:
            base_rain = monthly_rain[dt.month]
            # Introduce drought years
            drought_factor = 0.3 if dt.year == 2022 and d["id"] % 3 == 0 else 1.0
            rain = max(0, np.random.exponential(base_rain * drought_factor))
            temp = 28 + 10 * np.sin(2 * np.pi * (dt.timetuple().tm_yday - 60) / 365)
            temp += np.random.normal(0, 2)
            humidity = max(0, min(100, 55 + 30 * np.sin(2 * np.pi * dt.timetuple().tm_yday / 365) + np.random.normal(0, 8)))

            rain_buffer.append(rain)
            rain_7d  = sum(rain_buffer[-7:])
            rain_30d = sum(rain_buffer[-30:])

            row = {
                "district_id":   d["id"],
                "district_name": d["name"],
                "date":          dt.isoformat(),
                "rainfall":      round(rain, 2),
                "temperature":   round(temp, 2),
                "humidity":      round(humidity, 2),
                "rain_7d":       round(rain_7d, 2),
                "rain_30d":      round(rain_30d, 2),
            }
            records.append(row)

    df = pd.DataFrame(records)
    # Compute target
    df["drought_prob"] = df.apply(_drought_prob, axis=1)
    df["is_drought"] = (df["drought_prob"] >= 0.5).astype(int)

    csv_path = os.path.join(output_dir, "drought_synthetic.csv")
    df.to_csv(csv_path, index=False)

    # Save district metadata as JSON
    json_path = os.path.join(output_dir, "districts.json")
    with open(json_path, "w") as f:
        json.dump(DISTRICTS, f, indent=2)

    print(f"✅ Dataset generated: {len(df)} rows → {csv_path}")
    return csv_path


if __name__ == "__main__":
    generate()
