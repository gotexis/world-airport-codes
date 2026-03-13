import airports from "@/data/airports.json";
import countries from "@/data/countries.json";
import SearchClient from "@/components/SearchClient";
import Link from "next/link";

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

const typedAirports = airports as Airport[];
const typedCountries = countries as Record<string, { slug: string; count: number; airports: string[] }>;

export default function Home() {
  const countryList = Object.entries(typedCountries)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-base-200 to-base-300 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ✈️ World Airport Codes
          </h1>
          <p className="text-lg opacity-70 mb-8 max-w-2xl mx-auto">
            Search {typedAirports.length.toLocaleString()} airports across {Object.keys(typedCountries).length} countries.
            Find any IATA or ICAO code instantly.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchClient airports={typedAirports} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-base-200">
          <div className="stat">
            <div className="stat-title">Airports</div>
            <div className="stat-value text-primary">{typedAirports.length.toLocaleString()}</div>
            <div className="stat-desc">with IATA codes</div>
          </div>
          <div className="stat">
            <div className="stat-title">Countries</div>
            <div className="stat-value text-secondary">{Object.keys(typedCountries).length}</div>
            <div className="stat-desc">worldwide</div>
          </div>
          <div className="stat">
            <div className="stat-title">Data Source</div>
            <div className="stat-value text-accent text-xl">OpenFlights</div>
            <div className="stat-desc">Public domain</div>
          </div>
        </div>
      </section>

      {/* Top Countries */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Top Countries by Airport Count</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {countryList.map(([country, data]) => (
            <Link
              key={country}
              href={`/country/${data.slug}`}
              className="card bg-base-200 hover:bg-base-300 transition"
            >
              <div className="card-body p-4">
                <div className="font-semibold text-sm">{country}</div>
                <div className="badge badge-primary badge-sm">{data.count} airports</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/countries" className="btn btn-outline btn-primary">
            View All Countries →
          </Link>
        </div>
      </section>
    </div>
  );
}
