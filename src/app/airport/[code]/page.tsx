import airports from "@/data/airports.json";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MapView from "@/components/MapView";

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

export function generateStaticParams() {
  return typedAirports.map((a) => ({ code: a.iata.toLowerCase() }));
}

export function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  return params.then(({ code }) => {
    const airport = typedAirports.find((a) => a.iata.toLowerCase() === code.toLowerCase());
    if (!airport) return { title: "Airport Not Found" };
    return {
      title: `${airport.iata} — ${airport.name} (${airport.city}, ${airport.country})`,
      description: `${airport.iata} airport code for ${airport.name} in ${airport.city}, ${airport.country}. ICAO: ${airport.icao || "N/A"}. Location, map, and nearby airports.`,
    };
  });
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default async function AirportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const airport = typedAirports.find((a) => a.iata.toLowerCase() === code.toLowerCase());
  if (!airport) notFound();

  const nearby = typedAirports
    .filter((a) => a.iata !== airport.iata)
    .map((a) => ({ ...a, distance: haversine(airport.lat, airport.lon, a.lat, a.lon) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8);

  const markers = [
    { lat: airport.lat, lng: airport.lon, label: `${airport.iata} — ${airport.name}` },
    ...nearby.slice(0, 5).map((a) => ({ lat: a.lat, lng: a.lon, label: `${a.iata} — ${a.name}` })),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href={`/country/${airport.country.toLowerCase().replace(/[ ()]/g, "-")}`}>{airport.country}</a></li>
          <li>{airport.iata}</li>
        </ul>
      </div>

      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl font-mono font-bold text-primary">{airport.iata}</span>
            {airport.icao && <span className="badge badge-outline badge-lg">{airport.icao}</span>}
          </div>
          <h1 className="text-2xl font-bold mb-2">{airport.name}</h1>
          <p className="text-lg opacity-70 mb-6">{airport.city}, {airport.country}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs opacity-50 uppercase">Latitude</div>
              <div className="font-mono">{airport.lat.toFixed(4)}°</div>
            </div>
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs opacity-50 uppercase">Longitude</div>
              <div className="font-mono">{airport.lon.toFixed(4)}°</div>
            </div>
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs opacity-50 uppercase">Altitude</div>
              <div className="font-mono">{airport.altitude.toLocaleString()} ft</div>
            </div>
            <div className="bg-base-200 rounded-lg p-4">
              <div className="text-xs opacity-50 uppercase">Timezone</div>
              <div className="font-mono text-sm">{airport.timezone || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden">
          <MapView markers={markers} center={[airport.lat, airport.lon]} zoom={8} height="100%" />
        </div>
      </div>

      {/* Nearby Airports */}
      <h2 className="text-xl font-bold mb-4">Nearby Airports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {nearby.map((a) => (
          <a
            key={a.id}
            href={`/airport/${a.iata.toLowerCase()}`}
            className="card card-compact bg-base-200 hover:bg-base-300 transition"
          >
            <div className="card-body">
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-bold text-primary">{a.iata}</span>
                <div>
                  <div className="text-sm font-semibold">{a.name}</div>
                  <div className="text-xs opacity-60">{a.city}, {a.country}</div>
                </div>
              </div>
              <div className="text-xs opacity-50 mt-1">{Math.round(a.distance)} km away</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
