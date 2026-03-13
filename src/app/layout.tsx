import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "World Airport Codes — IATA & ICAO Directory",
    template: "%s | World Airport Codes",
  },
  description: "Search 6,000+ airports worldwide by IATA code, city, or country. Free airport code directory with maps, locations, and details.",
  openGraph: {
    title: "World Airport Codes — IATA & ICAO Directory",
    description: "Search 6,000+ airports worldwide by IATA code, city, or country.",
    url: "https://airports.rollersoft.com.au",
    siteName: "World Airport Codes",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://airports.rollersoft.com.au",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen bg-base-100 flex flex-col">
        <header className="navbar bg-base-200 border-b border-base-300">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <a className="text-xl font-bold flex items-center gap-2" href="/">
              <span className="text-2xl">✈️</span>
              <span>Airport Codes</span>
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="hover:text-primary transition">Home</a>
              <a href="/countries" className="hover:text-primary transition">Countries</a>
              <a href="/search" className="hover:text-primary transition">Search</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300">
          <p>© {new Date().getFullYear()} World Airport Codes. Data from <a href="https://openflights.org/data" className="link link-primary" target="_blank">OpenFlights</a> (public domain).</p>
          <p className="text-xs opacity-60">A <a href="https://rollersoft.com.au" className="link" target="_blank">Rollersoft</a> project</p>
        </footer>
      </body>
    </html>
  );
}
