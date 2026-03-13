#!/usr/bin/env python3
"""Parse OpenFlights airports.dat CSV into structured JSON for the site."""
import csv
import json
import sys
from pathlib import Path
from collections import defaultdict

INPUT = Path(__file__).parent.parent / "scripts" / "airports.dat"
if not INPUT.exists():
    INPUT = Path("/tmp/airports.dat")

OUT_DIR = Path(__file__).parent.parent / "src" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

FIELDS = ["id","name","city","country","iata","icao","lat","lon","altitude","utc_offset","dst","tz","type","source"]

airports = []
countries = defaultdict(list)
cities = defaultdict(list)

with open(INPUT, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) < 14:
            continue
        rec = dict(zip(FIELDS, row))
        # Skip entries without IATA code or with \N
        iata = rec["iata"].strip()
        if not iata or iata == "\\N" or iata == r"\N":
            continue
        airport = {
            "id": int(rec["id"]),
            "name": rec["name"],
            "city": rec["city"],
            "country": rec["country"],
            "iata": iata,
            "icao": rec["icao"] if rec["icao"] != "\\N" else None,
            "lat": float(rec["lat"]),
            "lon": float(rec["lon"]),
            "altitude": int(float(rec["altitude"])),
            "timezone": rec["tz"] if rec["tz"] != "\\N" else None,
            "type": rec["type"],
        }
        airports.append(airport)
        countries[rec["country"]].append(airport)
        city_key = f"{rec['city']}, {rec['country']}"
        cities[city_key].append(airport)

# Sort
airports.sort(key=lambda a: a["iata"])

# Write full list
with open(OUT_DIR / "airports.json", "w") as f:
    json.dump(airports, f)

# Write country index
country_index = {}
for country, aps in sorted(countries.items()):
    slug = country.lower().replace(" ", "-").replace("(", "").replace(")", "")
    country_index[country] = {
        "slug": slug,
        "count": len(aps),
        "airports": sorted([a["iata"] for a in aps])
    }
with open(OUT_DIR / "countries.json", "w") as f:
    json.dump(country_index, f)

print(f"Parsed {len(airports)} airports with IATA codes across {len(countries)} countries")
