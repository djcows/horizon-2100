export const START_YEAR = 2026;
export const END_YEAR = 2100;
export const BASE_DURATION_SEC = 300; // 5 minutes at 1x
export const YEAR_SPAN = END_YEAR - START_YEAR;

export type Snapshot = {
  year: number;
  robots: number;
  humans: number;
  unemployment: number; // percent
  participation: number; // percent of working-age in paid work
  gdp: number; // real 2026 USD, trillions
  robotHumanRatio: number;
  era: string;
  eraBlurb: string;
};

type Key = { y: number; v: number };

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function lerpKeys(keys: Key[], year: number): number {
  if (year <= keys[0].y) return keys[0].v;
  const last = keys[keys.length - 1];
  if (year >= last.y) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (year <= b.y) {
      const t = smoothstep((year - a.y) / (b.y - a.y));
      return a.v + (b.v - a.v) * t;
    }
  }
  return last.v;
}

function lerpLog(keys: Key[], year: number): number {
  return Math.exp(lerpKeys(keys.map((k) => ({ y: k.y, v: Math.log(Math.max(k.v, 1)) })), year));
}

const ROBOTS: Key[] = [
  { y: 2026, v: 80_000 },
  { y: 2027, v: 220_000 },
  { y: 2028, v: 700_000 },
  { y: 2029, v: 2_200_000 },
  { y: 2030, v: 8_000_000 },
  { y: 2031, v: 22_000_000 },
  { y: 2032, v: 60_000_000 },
  { y: 2033, v: 150_000_000 },
  { y: 2034, v: 350_000_000 },
  { y: 2035, v: 650_000_000 },
  { y: 2036, v: 1_000_000_000 },
  { y: 2038, v: 2_200_000_000 },
  { y: 2040, v: 4_000_000_000 },
  { y: 2042, v: 6_500_000_000 },
  { y: 2045, v: 10_000_000_000 },
  { y: 2050, v: 18_000_000_000 },
  { y: 2055, v: 25_000_000_000 },
  { y: 2060, v: 33_000_000_000 },
  { y: 2070, v: 48_000_000_000 },
  { y: 2080, v: 62_000_000_000 },
  { y: 2090, v: 72_000_000_000 },
  { y: 2100, v: 80_000_000_000 },
];

// UN WPP 2024 medium, persons
const HUMANS: Key[] = [
  { y: 2026, v: 8.301e9 },
  { y: 2030, v: 8.569e9 },
  { y: 2036, v: 8.946e9 },
  { y: 2040, v: 9.177e9 },
  { y: 2050, v: 9.664e9 },
  { y: 2060, v: 9.99e9 },
  { y: 2070, v: 10.2e9 },
  { y: 2084, v: 10.29e9 },
  { y: 2100, v: 10.18e9 },
];

const UNEMP: Key[] = [
  { y: 2026, v: 4.9 },
  { y: 2028, v: 5.4 },
  { y: 2030, v: 6.8 },
  { y: 2032, v: 8.6 },
  { y: 2034, v: 10.8 },
  { y: 2036, v: 13.4 },
  { y: 2038, v: 16.2 },
  { y: 2040, v: 19.8 },
  { y: 2043, v: 25.5 },
  { y: 2046, v: 31.0 },
  { y: 2050, v: 35.2 },
  { y: 2052, v: 36.8 },
  { y: 2056, v: 33.5 },
  { y: 2060, v: 28.4 },
  { y: 2065, v: 22.0 },
  { y: 2070, v: 17.2 },
  { y: 2080, v: 11.5 },
  { y: 2090, v: 8.6 },
  { y: 2100, v: 7.2 },
];

const PARTIC: Key[] = [
  { y: 2026, v: 60.8 },
  { y: 2030, v: 59.4 },
  { y: 2036, v: 55.5 },
  { y: 2040, v: 51.0 },
  { y: 2045, v: 44.0 },
  { y: 2052, v: 36.5 },
  { y: 2060, v: 29.5 },
  { y: 2070, v: 24.0 },
  { y: 2085, v: 20.0 },
  { y: 2100, v: 17.5 },
];

// Real 2026 USD trillions
const GDP: Key[] = [
  { y: 2026, v: 126 },
  { y: 2028, v: 140 },
  { y: 2030, v: 162 },
  { y: 2032, v: 195 },
  { y: 2034, v: 248 },
  { y: 2036, v: 330 },
  { y: 2038, v: 460 },
  { y: 2040, v: 680 },
  { y: 2042, v: 980 },
  { y: 2045, v: 1650 },
  { y: 2050, v: 3200 },
  { y: 2055, v: 5200 },
  { y: 2060, v: 7800 },
  { y: 2070, v: 14500 },
  { y: 2080, v: 24000 },
  { y: 2090, v: 36000 },
  { y: 2100, v: 48000 },
];

export function eraFor(year: number): { era: string; blurb: string } {
  if (year < 2029) return { era: "PILOTS", blurb: "Factory trials. Optimus, Figure, and Chinese lines in the low thousands." };
  if (year < 2033) return { era: "FACTORY FLOOR", blurb: "Humanoids take first night shifts. Warehouses and auto plants go first." };
  if (year < 2036) return { era: "THE STEEPENING", blurb: "Unit cost collapses. Production compounds. Labor markets start to rupture." };
  if (year < 2038) return { era: "ONE BILLION", blurb: "A billion humanoids. More robot workers than any single country's labor force." };
  if (year < 2045) return { era: "LABOR SUBSTITUTION", blurb: "Construction, logistics, retail, care. Official unemployment climbs." };
  if (year < 2050) return { era: "MORE ROBOTS THAN PEOPLE", blurb: "Humanoid stock eclipses human population. Work is no longer the default." };
  if (year < 2060) return { era: "POST-WAGE TRANSITION", blurb: "Peak displacement. UBI and shorter weeks. Participation collapses." };
  if (year < 2080) return { era: "AUTOMATED EARTH", blurb: "24/7 industry. Orbital plants. Human labor is optional in rich regions." };
  if (year < 2100) return { era: "OPTIONAL WORK", blurb: "Human population peaks, then eases. The planet is a luminous machine." };
  return { era: "HORIZON", blurb: "Eighty billion humanoids. GDP unrecognizable. Work is a hobby." };
}

export function sample(year: number): Snapshot {
  const y = Math.min(END_YEAR, Math.max(START_YEAR, year));
  const robots = lerpLog(ROBOTS, y);
  const humans = lerpKeys(HUMANS, y);
  const unemployment = lerpKeys(UNEMP, y);
  const participation = lerpKeys(PARTIC, y);
  const gdp = lerpLog(GDP, y);
  const { era, blurb } = eraFor(y);
  return {
    year: y,
    robots,
    humans,
    unemployment,
    participation,
    gdp,
    robotHumanRatio: robots / humans,
    era,
    blurb,
  };
}

export function sampleDelta(year: number, dtYears = 1): Snapshot & {
  dRobots: number;
  dHumans: number;
  dUnemp: number;
  dGdp: number;
  dParticip: number;
} {
  const now = sample(year);
  const prev = sample(year - dtYears);
  return {
    ...now,
    dRobots: now.robots - prev.robots,
    dHumans: now.humans - prev.humans,
    dUnemp: now.unemployment - prev.unemployment,
    dGdp: now.gdp - prev.gdp,
    dParticip: now.participation - prev.participation,
  };
}

/** Precompute yearly series for sparklines (one point per year). */
export function series() {
  const years: number[] = [];
  const robots: number[] = [];
  const humans: number[] = [];
  const unemp: number[] = [];
  const gdp: number[] = [];
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    const s = sample(y);
    years.push(y);
    robots.push(s.robots);
    humans.push(s.humans);
    unemp.push(s.unemployment);
    gdp.push(s.gdp);
  }
  return { years, robots, humans, unemp, gdp };
}

export function formatCount(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "\u2212" : "";
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(abs >= 1e13 ? 1 : 2)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(abs >= 1e10 ? 1 : 2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(abs >= 1e7 ? 1 : 1)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(abs >= 1e4 ? 0 : 1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

export function formatGdp(t: number): string {
  const abs = Math.abs(t);
  const sign = t < 0 ? "\u2212" : "";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(abs >= 10000 ? 1 : 2)}Q`;
  return `${sign}$${abs >= 100 ? abs.toFixed(0) : abs.toFixed(1)}T`;
}

export function formatYear(year: number): string {
  const y = Math.floor(year);
  const frac = year - y;
  const month = Math.min(11, Math.floor(frac * 12));
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[month]} ${y}`;
}

export function remainingSeconds(year: number, speed: number): number {
  const left = Math.max(0, END_YEAR - year);
  const yearsPerSec = (YEAR_SPAN / BASE_DURATION_SEC) * Math.max(speed, 0.0001);
  return left / yearsPerSec;
}
