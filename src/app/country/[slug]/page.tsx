import airports from "@/data/airports.json";
import countries from "@/data/countries.json";
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
const typedCountries = countries as Record<string, { slug: string; count: number; airports: string[] }>;

export function generateStaticParams() {
  return Object.values(typedCountries).map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const entry = Object.entries(typedCountries).find(([, v]) => v.slug === slug);
    if (!entry) return { title: "Country Not Found" };
    const [country, data] = entry;
    return {
      title: `Airports in ${country} — ${data.count} Airport Codes`,
      description: `Complete list of ${data.count} airports in ${country} with IATA codes, locations, and maps.`,
    };
  });
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = Object.entries(typedCountries).find(([, v]) => v.slug === slug);
  if (!entry) notFound();

  const [country, data] = entry;
  const countryAirports = typedAirports.filter((a) => a.country === country);

  const markers = countryAirports.map((a) => ({
    lat: a.lat,
    lng: a.lon,
    label: `${a.iata} — ${a.name}`,
  }));

  const avgLat = countryAirports.reduce((s, a) => s + a.lat, 0) / countryAirports.length;
  const avgLon = countryAirports.reduce((s, a) => s + a.lon, 0) / countryAirports.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/countries">Countries</a></li>
          <li>{country}</li>
        </ul>
      </div>

      <h1 className="text-3xl font-bold mb-2">Airports in {country}</h1>
      <p className="opacity-70 mb-6">{data.count} airports with IATA codes</p>

      {/* Map */}
      <div className="h-[400px] rounded-lg overflow-hidden mb-8">
        <MapView markers={markers} center={[avgLat, avgLon]} zoom={4} height="100%" />
      </div>

      {/* Airport list */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>IATA</th>
              <th>ICAO</th>
              <th>Airport Name</th>
              <th>City</th>
              <th>Altitude</th>
            </tr>
          </thead>
          <tbody>
            {countryAirports.sort((a, b) => a.iata.localeCompare(b.iata)).map((a) => (
              <tr key={a.id}>
                <td>
                  <a href={`/airport/${a.iata.toLowerCase()}`} className="font-mono font-bold text-primary hover:underline">
                    {a.iata}
                  </a>
                </td>
                <td className="font-mono text-sm opacity-70">{a.icao || "—"}</td>
                <td>{a.name}</td>
                <td>{a.city}</td>
                <td>{a.altitude.toLocaleString()} ft</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
