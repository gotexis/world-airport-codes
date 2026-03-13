import airports from "@/data/airports.json";
import SearchClient from "@/components/SearchClient";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Search Airports — IATA & ICAO Code Lookup",
  description: "Search 6,000+ airports by IATA code, ICAO code, airport name, city, or country.",
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Airports</h1>
      <p className="opacity-70 mb-6">Type at least 2 characters to search by code, name, city, or country</p>
      <SearchClient airports={airports as Airport[]} />
    </div>
  );
}
