"use client";

import { useState, useMemo } from "react";

interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string | null;
  lat: number;
  lon: number;
  altitude: number;
  timezone: string | null;
  type: string;
}

export default function SearchClient({ airports }: { airports: Airport[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return airports
      .filter(
        (a) =>
          a.iata.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [query, airports]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by IATA code, airport name, city, or country..."
        className="input input-bordered input-lg w-full bg-base-200 text-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {query.length >= 2 && (
        <div className="mt-4">
          <p className="text-sm opacity-60 mb-3">{results.length} results</p>
          <div className="grid gap-2">
            {results.map((a) => (
              <a
                key={a.id}
                href={`/airport/${a.iata.toLowerCase()}`}
                className="card card-compact bg-base-200 hover:bg-base-300 transition cursor-pointer"
              >
                <div className="card-body flex-row items-center gap-4">
                  <div className="text-3xl font-mono font-bold text-primary min-w-[4rem]">
                    {a.iata}
                  </div>
                  <div>
                    <div className="font-semibold">{a.name}</div>
                    <div className="text-sm opacity-70">
                      {a.city}, {a.country}
                      {a.icao && <span className="ml-2 badge badge-sm badge-outline">{a.icao}</span>}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
