export type Hotspot = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  region: string;
  startYear: number;
  weight: number;
  kind: "factory" | "city" | "port" | "hub";
};

export function intensity(h: Hotspot, year: number): number {
  if (year < h.startYear) return 0;
  const t = Math.min(1, (year - h.startYear) / 8);
  const s = t * t * (3 - 2 * t);
  return h.weight * s;
}

export const HOTSPOTS: Hotspot[] = [
  // United States / Mexico — early
  { id: "austin", name: "Austin", lat: 30.2672, lon: -97.7431, region: "US", startYear: 2026, weight: 1.0, kind: "factory" },
  { id: "fremont", name: "Fremont / Bay Area", lat: 37.5485, lon: -121.9886, region: "US", startYear: 2026, weight: 1.0, kind: "factory" },
  { id: "los-angeles", name: "Los Angeles", lat: 34.0522, lon: -118.2437, region: "US", startYear: 2027, weight: 0.8, kind: "city" },
  { id: "seattle", name: "Seattle", lat: 47.6062, lon: -122.3321, region: "US", startYear: 2027, weight: 0.7, kind: "city" },
  { id: "nyc", name: "New York", lat: 40.7128, lon: -74.006, region: "US", startYear: 2027, weight: 0.85, kind: "city" },
  { id: "boston", name: "Boston", lat: 42.3601, lon: -71.0589, region: "US", startYear: 2027, weight: 0.7, kind: "hub" },
  { id: "detroit", name: "Detroit", lat: 42.3314, lon: -83.0458, region: "US", startYear: 2027, weight: 0.75, kind: "factory" },
  { id: "chicago", name: "Chicago", lat: 41.8781, lon: -87.6298, region: "US", startYear: 2028, weight: 0.7, kind: "city" },
  { id: "houston", name: "Houston", lat: 29.7604, lon: -95.3698, region: "US", startYear: 2028, weight: 0.6, kind: "port" },
  { id: "mexico-city", name: "Mexico City", lat: 19.4326, lon: -99.1332, region: "LatAm", startYear: 2034, weight: 0.55, kind: "city" },

  // China — early
  { id: "shenzhen", name: "Shenzhen", lat: 22.5431, lon: 114.0579, region: "China", startYear: 2026, weight: 1.0, kind: "factory" },
  { id: "shanghai", name: "Shanghai", lat: 31.2304, lon: 121.4737, region: "China", startYear: 2026, weight: 1.0, kind: "port" },
  { id: "beijing", name: "Beijing", lat: 39.9042, lon: 116.4074, region: "China", startYear: 2027, weight: 0.85, kind: "city" },
  { id: "guangzhou", name: "Guangzhou", lat: 23.1291, lon: 113.2644, region: "China", startYear: 2027, weight: 0.8, kind: "factory" },
  { id: "wuhan", name: "Wuhan", lat: 30.5928, lon: 114.3055, region: "China", startYear: 2028, weight: 0.7, kind: "factory" },
  { id: "hangzhou", name: "Hangzhou", lat: 30.2741, lon: 120.1551, region: "China", startYear: 2028, weight: 0.75, kind: "hub" },
  { id: "chongqing", name: "Chongqing", lat: 29.4316, lon: 106.9123, region: "China", startYear: 2028, weight: 0.65, kind: "factory" },
  { id: "tianjin", name: "Tianjin", lat: 39.3434, lon: 117.3616, region: "China", startYear: 2028, weight: 0.6, kind: "port" },
  { id: "suzhou", name: "Suzhou", lat: 31.2989, lon: 120.5853, region: "China", startYear: 2027, weight: 0.8, kind: "factory" },

  // Japan / Korea / Taiwan — early
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503, region: "JP-KR-TW", startYear: 2026, weight: 1.0, kind: "city" },
  { id: "osaka", name: "Osaka", lat: 34.6937, lon: 135.5023, region: "JP-KR-TW", startYear: 2027, weight: 0.7, kind: "factory" },
  { id: "seoul", name: "Seoul", lat: 37.5665, lon: 126.978, region: "JP-KR-TW", startYear: 2026, weight: 1.0, kind: "city" },
  { id: "busan", name: "Busan", lat: 35.1796, lon: 129.0756, region: "JP-KR-TW", startYear: 2028, weight: 0.6, kind: "port" },
  { id: "taipei", name: "Taipei", lat: 25.033, lon: 121.5654, region: "JP-KR-TW", startYear: 2028, weight: 0.65, kind: "hub" },

  // Europe — Germany early, rest OECD 2028-32
  { id: "berlin", name: "Berlin", lat: 52.52, lon: 13.405, region: "Europe", startYear: 2027, weight: 0.7, kind: "city" },
  { id: "munich", name: "Munich", lat: 48.1351, lon: 11.582, region: "Europe", startYear: 2027, weight: 0.75, kind: "factory" },
  { id: "stuttgart", name: "Stuttgart", lat: 48.7758, lon: 9.1829, region: "Europe", startYear: 2026, weight: 0.8, kind: "factory" },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522, region: "Europe", startYear: 2028, weight: 0.75, kind: "city" },
  { id: "lyon", name: "Lyon", lat: 45.764, lon: 4.8357, region: "Europe", startYear: 2029, weight: 0.5, kind: "factory" },
  { id: "london", name: "London", lat: 51.5074, lon: -0.1278, region: "Europe", startYear: 2028, weight: 0.8, kind: "city" },
  { id: "manchester", name: "Manchester", lat: 53.4808, lon: -2.2426, region: "Europe", startYear: 2029, weight: 0.45, kind: "factory" },
  { id: "rotterdam", name: "Rotterdam", lat: 51.9244, lon: 4.4777, region: "Europe", startYear: 2028, weight: 0.7, kind: "port" },
  { id: "warsaw", name: "Warsaw", lat: 52.2297, lon: 21.0122, region: "Europe", startYear: 2030, weight: 0.5, kind: "city" },
  { id: "milan", name: "Milan", lat: 45.4642, lon: 9.19, region: "Europe", startYear: 2029, weight: 0.6, kind: "city" },
  { id: "barcelona", name: "Barcelona", lat: 41.3874, lon: 2.1686, region: "Europe", startYear: 2029, weight: 0.5, kind: "city" },
  { id: "brussels", name: "Brussels", lat: 50.8503, lon: 4.3517, region: "Europe", startYear: 2029, weight: 0.45, kind: "hub" },

  // India — 2031+
  { id: "bangalore", name: "Bangalore", lat: 12.9716, lon: 77.5946, region: "India", startYear: 2031, weight: 0.8, kind: "hub" },
  { id: "mumbai", name: "Mumbai", lat: 19.076, lon: 72.8777, region: "India", startYear: 2031, weight: 0.7, kind: "city" },
  { id: "chennai", name: "Chennai", lat: 13.0827, lon: 80.2707, region: "India", startYear: 2031, weight: 0.6, kind: "factory" },
  { id: "hyderabad", name: "Hyderabad", lat: 17.385, lon: 78.4867, region: "India", startYear: 2032, weight: 0.55, kind: "hub" },
  { id: "pune", name: "Pune", lat: 18.5204, lon: 73.8567, region: "India", startYear: 2032, weight: 0.5, kind: "factory" },

  // SEA — 2032; Singapore hub earlier
  { id: "singapore", name: "Singapore", lat: 1.3521, lon: 103.8198, region: "SEA", startYear: 2030, weight: 0.85, kind: "hub" },
  { id: "jakarta", name: "Jakarta", lat: -6.2088, lon: 106.8456, region: "SEA", startYear: 2032, weight: 0.6, kind: "city" },
  { id: "ho-chi-minh", name: "Ho Chi Minh", lat: 10.8231, lon: 106.6297, region: "SEA", startYear: 2032, weight: 0.55, kind: "factory" },
  { id: "bangkok", name: "Bangkok", lat: 13.7563, lon: 100.5018, region: "SEA", startYear: 2032, weight: 0.5, kind: "city" },
  { id: "manila", name: "Manila", lat: 14.5995, lon: 120.9842, region: "SEA", startYear: 2033, weight: 0.45, kind: "city" },

  // Gulf / Middle East — 2030
  { id: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708, region: "Gulf", startYear: 2030, weight: 0.75, kind: "city" },
  { id: "riyadh", name: "Riyadh", lat: 24.7136, lon: 46.6753, region: "Gulf", startYear: 2030, weight: 0.65, kind: "city" },
  { id: "doha", name: "Doha", lat: 25.2854, lon: 51.531, region: "Gulf", startYear: 2031, weight: 0.45, kind: "city" },
  { id: "tel-aviv", name: "Tel Aviv", lat: 32.0853, lon: 34.7818, region: "Gulf", startYear: 2030, weight: 0.55, kind: "hub" },
  { id: "istanbul", name: "Istanbul", lat: 41.0082, lon: 28.9784, region: "Gulf", startYear: 2032, weight: 0.6, kind: "city" },
  { id: "cairo", name: "Cairo", lat: 30.0444, lon: 31.2357, region: "Africa", startYear: 2036, weight: 0.5, kind: "city" },

  // Africa — 2036-2042
  { id: "lagos", name: "Lagos", lat: 6.5244, lon: 3.3792, region: "Africa", startYear: 2036, weight: 0.6, kind: "city" },
  { id: "nairobi", name: "Nairobi", lat: -1.2921, lon: 36.8219, region: "Africa", startYear: 2038, weight: 0.5, kind: "city" },
  { id: "johannesburg", name: "Johannesburg", lat: -26.2041, lon: 28.0473, region: "Africa", startYear: 2036, weight: 0.55, kind: "city" },
  { id: "addis-ababa", name: "Addis Ababa", lat: 9.032, lon: 38.7469, region: "Africa", startYear: 2040, weight: 0.35, kind: "city" },
  { id: "casablanca", name: "Casablanca", lat: 33.5731, lon: -7.5898, region: "Africa", startYear: 2038, weight: 0.4, kind: "port" },

  // LatAm — 2034+
  { id: "sao-paulo", name: "São Paulo", lat: -23.5505, lon: -46.6333, region: "LatAm", startYear: 2034, weight: 0.7, kind: "city" },
  { id: "rio", name: "Rio", lat: -22.9068, lon: -43.1729, region: "LatAm", startYear: 2034, weight: 0.5, kind: "city" },
  { id: "buenos-aires", name: "Buenos Aires", lat: -34.6037, lon: -58.3816, region: "LatAm", startYear: 2034, weight: 0.55, kind: "city" },
  { id: "santiago", name: "Santiago", lat: -33.4489, lon: -70.6693, region: "LatAm", startYear: 2035, weight: 0.4, kind: "city" },
  { id: "bogota", name: "Bogotá", lat: 4.711, lon: -74.0721, region: "LatAm", startYear: 2035, weight: 0.4, kind: "city" },
  { id: "lima", name: "Lima", lat: -12.0464, lon: -77.0428, region: "LatAm", startYear: 2035, weight: 0.35, kind: "city" },

  // Oceania — OECD 2028-32
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093, region: "Oceania", startYear: 2030, weight: 0.6, kind: "city" },
  { id: "melbourne", name: "Melbourne", lat: -37.8136, lon: 144.9631, region: "Oceania", startYear: 2030, weight: 0.5, kind: "city" },
  { id: "auckland", name: "Auckland", lat: -36.8509, lon: 174.7645, region: "Oceania", startYear: 2032, weight: 0.35, kind: "city" },

  // Canada — OECD
  { id: "toronto", name: "Toronto", lat: 43.6532, lon: -79.3832, region: "Canada", startYear: 2028, weight: 0.65, kind: "city" },
  { id: "vancouver", name: "Vancouver", lat: 49.2827, lon: -123.1207, region: "Canada", startYear: 2029, weight: 0.5, kind: "city" },
  { id: "montreal", name: "Montreal", lat: 45.5017, lon: -73.5673, region: "Canada", startYear: 2029, weight: 0.5, kind: "city" },

  // Russia (optional)
  { id: "moscow", name: "Moscow", lat: 55.7558, lon: 37.6173, region: "Eurasia", startYear: 2032, weight: 0.55, kind: "city" },
  { id: "st-petersburg", name: "St Petersburg", lat: 59.9311, lon: 30.3609, region: "Eurasia", startYear: 2033, weight: 0.4, kind: "port" },
];

export const HOTSPOT_BY_ID: Record<string, Hotspot> = Object.fromEntries(
  HOTSPOTS.map((h) => [h.id, h]),
);

/** Major supply-chain corridors. Visible after both endpoints have started. */
export const ARCS: [string, string][] = [
  ["shenzhen", "austin"],
  ["shanghai", "rotterdam"],
  ["tokyo", "los-angeles"],
  ["seoul", "detroit"],
  ["shenzhen", "singapore"],
  ["shanghai", "los-angeles"],
  ["tokyo", "shanghai"],
  ["austin", "mexico-city"],
  ["munich", "detroit"],
  ["stuttgart", "shanghai"],
  ["london", "nyc"],
  ["singapore", "bangalore"],
  ["dubai", "shenzhen"],
  ["rotterdam", "nyc"],
  ["busan", "los-angeles"],
  ["suzhou", "austin"],
  ["hangzhou", "seattle"],
  ["beijing", "moscow"],
  ["tokyo", "seoul"],
  ["paris", "london"],
  ["mumbai", "dubai"],
  ["sao-paulo", "houston"],
  ["lagos", "shenzhen"],
  ["sydney", "tokyo"],
  ["wuhan", "stuttgart"],
  ["fremont", "taipei"],
  ["boston", "london"],
  ["chicago", "toronto"],
];

export function activeArcs(year: number): [Hotspot, Hotspot][] {
  const out: [Hotspot, Hotspot][] = [];
  for (const [a, b] of ARCS) {
    const from = HOTSPOT_BY_ID[a];
    const to = HOTSPOT_BY_ID[b];
    if (!from || !to) continue;
    if (year >= from.startYear && year >= to.startYear) out.push([from, to]);
  }
  return out;
}
