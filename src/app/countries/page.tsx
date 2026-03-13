import countries from "@/data/countries.json";
import type { Metadata } from "next";
import Link from "next/link";

const typedCountries = countries as Record<string, { slug: string; count: number; airports: string[] }>;

export const metadata: Metadata = {
  title: "Countries — Airport Code Directory",
  description: "Browse airports by country. Complete directory of airport codes across 235 countries.",
};

export default function CountriesPage() {
  const sorted = Object.entries(typedCountries).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Countries</h1>
      <p className="opacity-70 mb-8">{sorted.length} countries with airports</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {sorted.map(([country, data]) => (
          <Link
            key={country}
            href={`/country/${data.slug}`}
            className="card bg-base-200 hover:bg-base-300 transition"
          >
            <div className="card-body p-4">
              <div className="font-semibold">{country}</div>
              <div className="badge badge-primary badge-sm">{data.count} airports</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
