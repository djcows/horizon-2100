export type WorldEvent = { year: number; title: string; body: string; hotspotId?: string };

export const EVENTS: WorldEvent[] = [
  {
    year: 2026.3,
    title: "Optimus factory pilots",
    body: "Tesla starts limited Optimus runs on the Austin line. Units still need handlers. The first night the lights stay on without a second shift of humans.",
    hotspotId: "austin",
  },
  {
    year: 2027.4,
    title: "Figure + BMW production cells",
    body: "Figure humanoids take over discrete BMW cells. Cycle time is ugly. Uptime is not. OEMs stop arguing about whether and start arguing about when.",
    hotspotId: "munich",
  },
  {
    year: 2028.2,
    title: "China humanoid industrial policy",
    body: "Shenzhen is designated a national humanoid manufacturing cluster. Subsidies, land, and component lines stack. Unit costs start their long fall.",
    hotspotId: "shenzhen",
  },
  {
    year: 2029.1,
    title: "First fully robot night shift",
    body: "US warehouses run a full night with no human pickers on the floor. Insurance, unions, and city councils notice in that order.",
    hotspotId: "chicago",
  },
  {
    year: 2030.0,
    title: "Eight million humanoids",
    body: "Installed stock crosses 8 million. Still a rounding error next to the global labor force — and already the fastest-growing capital stock on Earth.",
  },
  {
    year: 2031.5,
    title: "Construction humanoids, Gulf megaprojects",
    body: "Dubai and Riyadh specify humanoid crews for heat-of-day pours and night logistics. Human heat-stress deaths on those sites drop. Headcount does too.",
    hotspotId: "dubai",
  },
  {
    year: 2032.4,
    title: "Elder-care pilots — Tokyo",
    body: "Japan's care shortage forces the issue. Humanoids do lifts, nights, and meds-on-schedule. Families stay for the conversation.",
    hotspotId: "tokyo",
  },
  {
    year: 2033.2,
    title: "Unit cost under $15k",
    body: "Bill of materials, actuators, and inference silicon all compress. Household waitlists open. The factory is now the product.",
    hotspotId: "shenzhen",
  },
  {
    year: 2034.6,
    title: "Trucking & last-mile displacement wave",
    body: "Humanoid loaders plus autonomy empty the dock. Long-haul drivers become remote supervisors, then become optional.",
    hotspotId: "houston",
  },
  {
    year: 2035.5,
    title: "OECD manufacturing employment breaks",
    body: "650 million humanoids. Factory employment in the OECD peaks in the rear-view. The charts look like deindustrialization. Output does not.",
    hotspotId: "detroit",
  },
  {
    year: 2036.0,
    title: "ONE BILLION HUMANOIDS",
    body: "A billion bodies that do not sleep. More robot workers than any single country's labor force. The steepening is no longer a forecast.",
    hotspotId: "austin",
  },
  {
    year: 2038.2,
    title: "National UBI pilots",
    body: "Several OECD states trial floor income as participation slides. The political fight is over the size of the floor, not whether one exists.",
    hotspotId: "london",
  },
  {
    year: 2040.0,
    title: "Four billion humanoids",
    body: "Robot stock is closing on half of humanity. Construction, retail, and logistics are majority-automated in rich cities.",
  },
  {
    year: 2042.4,
    title: "African industrial leapfrog",
    body: "Lagos and Nairobi skip the 20th-century factory workforce. Humanoid plants go up next to ports. The labor-intensity phase never arrives.",
    hotspotId: "lagos",
  },
  {
    year: 2045.0,
    title: "Ten billion — more humanoids than humans",
    body: "Installed humanoids eclipse world population. Work is no longer the default condition of adult life in the rich world.",
  },
  {
    year: 2048.3,
    title: "Labor-force participation under 45%",
    body: "Paid work becomes a minority activity among working-age adults in the OECD. Status migrates to craft, care, science, and spectacle.",
  },
  {
    year: 2050.0,
    title: "World GDP crosses $3 quadrillion",
    body: "Real 2026 dollars. The human economy is a rounding error inside a machine economy that runs through the night.",
  },
  {
    year: 2052.0,
    title: "Peak official unemployment 37%",
    body: "The statistic is a 20th-century instrument. Most of the 37% are not looking. Constitutions start to notice.",
  },
  {
    year: 2055.5,
    title: "Post-work constitutions",
    body: "A first wave of charters decouple citizenship from employment. Income, compute, and robot-time become political questions.",
    hotspotId: "brussels",
  },
  {
    year: 2060.0,
    title: "Orbital factories staffed by humanoids",
    body: "Vacuum, radiation, and 24/7 shifts are free. The first closed-loop orbital plants need no life support for the crew.",
  },
  {
    year: 2070.0,
    title: "Human population growth ~0",
    body: "UN medium path flattens. Births match deaths. The planet's workforce keeps compounding anyway.",
  },
  {
    year: 2084.0,
    title: "Human population peaks 10.3 billion",
    body: "The last uptick. After this the human census eases while the robot census does not.",
  },
  {
    year: 2100.0,
    title: "Horizon: 80 billion humanoids",
    body: "Eighty billion humanoids. GDP unrecognizable. Work is a hobby. The Earth is a luminous machine with a small, optional crew.",
  },
];

export function currentEvent(year: number): WorldEvent | null {
  let found: WorldEvent | null = null;
  for (const e of EVENTS) if (year >= e.year) found = e;
  return found;
}
