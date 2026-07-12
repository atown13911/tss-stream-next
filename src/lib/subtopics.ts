import type { CategorySlug } from './videos';

export const SUBTOPIC_SLUGS = ['jobs', 'threads', 'services', 'market'] as const;
export type SubtopicSlug = (typeof SUBTOPIC_SLUGS)[number];

export interface SubtopicItem {
  title: string;
  desc: string;
  meta: string;
  metaIcon: string;
}

export interface SubtopicSection {
  icon: string;
  title: string;
  items: SubtopicItem[];
}

export const SUBTOPIC_SECTIONS: Record<Exclude<SubtopicSlug, 'market'>, SubtopicSection> = {
  jobs: {
    icon: 'work',
    title: 'Job Board',
    items: [
      { title: 'CDL-A OTR Driver', desc: 'Full-time OTR position. $0.65/mile + benefits. Home every 2 weeks.', meta: 'Taylor Shipping Solutions', metaIcon: 'business' },
      { title: 'Freight Dispatcher', desc: 'Remote dispatcher needed. Experience with TMS required.', meta: 'Posted 2 days ago', metaIcon: 'schedule' },
      { title: 'Fleet Manager', desc: 'Manage fleet of 50+ vehicles. CDL preferred but not required.', meta: '5 applicants', metaIcon: 'group' },
      { title: 'Dock Worker', desc: 'Loading/unloading at terminal. Forklift cert required.', meta: 'Immediate start', metaIcon: 'event_available' },
      { title: 'Safety Coordinator', desc: 'DOT compliance and safety training for drivers.', meta: 'Full-time + benefits', metaIcon: 'health_and_safety' },
      { title: 'Owner Operator', desc: 'Seeking owner operators for dedicated lanes. 85% of load pay.', meta: 'Multiple openings', metaIcon: 'local_shipping' },
    ],
  },
  threads: {
    icon: 'forum',
    title: 'Threads',
    items: [
      { title: 'Best routes to avoid traffic in Q1 2026?', desc: 'Looking for advice on alternative routes during peak season.', meta: '24 replies', metaIcon: 'chat' },
      { title: 'ELD mandate changes — what you need to know', desc: 'Discussion on the new ELD requirements taking effect this spring.', meta: '58 replies', metaIcon: 'chat' },
      { title: 'Fuel prices are wild right now', desc: 'Sharing tips on fuel cards, routes, and saving at the pump.', meta: '102 replies', metaIcon: 'local_gas_station' },
      { title: 'New driver tips and tricks', desc: 'Veterans sharing advice for CDL holders just starting out.', meta: '87 replies', metaIcon: 'school' },
      { title: 'Rate negotiations — how do you handle brokers?', desc: 'Let us talk about getting fair rates in this market.', meta: '45 replies', metaIcon: 'payments' },
      { title: 'Dashcam recommendations for 2026', desc: 'Which dashcams are drivers using? Front + rear setups.', meta: '33 replies', metaIcon: 'videocam' },
    ],
  },
  services: {
    icon: 'build',
    title: 'Services',
    items: [
      { title: 'TruckWash Pro', desc: 'Mobile truck washing. We come to your yard. Fleet discounts available.', meta: '4.8 stars (120 reviews)', metaIcon: 'star' },
      { title: 'RoadReady Repairs', desc: '24/7 mobile mechanic service. Tires, brakes, electrical.', meta: 'Nationwide coverage', metaIcon: 'location_on' },
      { title: 'FreightGuard Insurance', desc: 'Cargo and liability insurance for owner operators and fleets.', meta: 'Get a free quote', metaIcon: 'shield' },
      { title: 'LoadLink Factoring', desc: 'Same-day invoice factoring. 2.5% flat rate. No hidden fees.', meta: 'Trusted by 5K+ carriers', metaIcon: 'account_balance' },
      { title: 'PermitPro Oversize', desc: 'Oversize/overweight permit service. All 48 states.', meta: '24hr turnaround', metaIcon: 'description' },
      { title: 'DOT Inspection Prep', desc: 'Pre-trip inspection and DOT compliance audits.', meta: 'Book online', metaIcon: 'fact_check' },
    ],
  },
};

export interface MarketLane {
  origin: string;
  dest: string;
  rate: number;
  volume: string;
  trend: 'up' | 'down' | 'stable';
}

export interface MarketSnapshot {
  avgRate: number;
  rateChange: number;
  rateSuffix: string;
  lanes: MarketLane[];
  indices: { name: string; value: string; change: string }[];
}

export const MARKET_BY_CATEGORY: Record<CategorySlug, MarketSnapshot> = {
  trucking: {
    avgRate: 2.45,
    rateChange: 3.2,
    rateSuffix: '/mile',
    lanes: [
      { origin: 'Chicago, IL', dest: 'Los Angeles, CA', rate: 2.65, volume: 'High', trend: 'up' },
      { origin: 'Dallas, TX', dest: 'Atlanta, GA', rate: 2.18, volume: 'Medium', trend: 'stable' },
      { origin: 'Newark, NJ', dest: 'Miami, FL', rate: 2.52, volume: 'High', trend: 'up' },
      { origin: 'Seattle, WA', dest: 'Denver, CO', rate: 2.31, volume: 'Low', trend: 'down' },
    ],
    indices: [
      { name: 'Spot Rate Index', value: '168.4', change: '+2.1%' },
      { name: 'Truck Utilization', value: '94.2%', change: '+0.8%' },
      { name: 'Load-to-Truck Ratio', value: '6.2:1', change: '+1.4%' },
    ],
  },
  maritime: {
    avgRate: 1850,
    rateChange: -1.5,
    rateSuffix: '/TEU',
    lanes: [
      { origin: 'Shanghai, CN', dest: 'Long Beach, CA', rate: 2100, volume: 'Very High', trend: 'down' },
      { origin: 'Rotterdam, NL', dest: 'New York, NY', rate: 1650, volume: 'High', trend: 'stable' },
      { origin: 'Singapore', dest: 'Savannah, GA', rate: 1890, volume: 'Medium', trend: 'up' },
    ],
    indices: [
      { name: 'Baltic Dry Index', value: '1,847', change: '-3.2%' },
      { name: 'Container Throughput', value: '142.8M TEU', change: '+1.9%' },
      { name: 'Port Congestion', value: 'Moderate', change: 'Improving' },
    ],
  },
  rail: {
    avgRate: 0.038,
    rateChange: 0.5,
    rateSuffix: '/ton-mi',
    lanes: [
      { origin: 'Chicago, IL', dest: 'Los Angeles, CA', rate: 0.042, volume: 'Very High', trend: 'stable' },
      { origin: 'Kansas City, MO', dest: 'Dallas, TX', rate: 0.035, volume: 'High', trend: 'up' },
      { origin: 'Atlanta, GA', dest: 'Chicago, IL', rate: 0.039, volume: 'High', trend: 'stable' },
    ],
    indices: [
      { name: 'Intermodal Volume', value: '298K units', change: '+2.3%' },
      { name: 'Rail Carloads', value: '524K/wk', change: '+0.7%' },
      { name: 'Dwell Time', value: '24.1 hrs', change: '-1.2%' },
    ],
  },
  'air-freight': {
    avgRate: 4.25,
    rateChange: 1.8,
    rateSuffix: '/kg',
    lanes: [
      { origin: 'Hong Kong', dest: 'Los Angeles, CA', rate: 4.8, volume: 'Very High', trend: 'up' },
      { origin: 'Frankfurt, DE', dest: 'Chicago, IL', rate: 3.95, volume: 'High', trend: 'stable' },
      { origin: 'Dubai, UAE', dest: 'New York, NY', rate: 4.5, volume: 'High', trend: 'up' },
    ],
    indices: [
      { name: 'Air Cargo Demand', value: '+4.2% YoY', change: '+1.1%' },
      { name: 'Cargo Load Factor', value: '48.7%', change: '+2.3%' },
      { name: 'Freighter Utilization', value: '89.1%', change: '+0.6%' },
    ],
  },
  warehousing: {
    avgRate: 8.5,
    rateChange: 2.1,
    rateSuffix: '/sqft',
    lanes: [],
    indices: [
      { name: 'Vacancy Rate', value: '4.8%', change: '-0.3%' },
      { name: 'Avg Lease Rate', value: '$8.50/sqft', change: '+2.1%' },
      { name: 'E-Commerce Growth', value: '+12.4%', change: '+1.8%' },
    ],
  },
  'last-mile': {
    avgRate: 12.5,
    rateChange: 4.5,
    rateSuffix: '/delivery',
    lanes: [],
    indices: [
      { name: 'Cost Per Delivery', value: '$12.50', change: '+4.5%' },
      { name: 'Same-Day Volume', value: '+18.2%', change: '+3.1%' },
      { name: 'Delivery Success', value: '96.8%', change: '+0.2%' },
    ],
  },
  'heavy-haul': {
    avgRate: 5.85,
    rateChange: 1.2,
    rateSuffix: '/mile',
    lanes: [
      { origin: 'Houston, TX', dest: 'Denver, CO', rate: 6.2, volume: 'Medium', trend: 'up' },
      { origin: 'Pittsburgh, PA', dest: 'Chicago, IL', rate: 5.5, volume: 'Low', trend: 'stable' },
    ],
    indices: [
      { name: 'Permit Volume', value: '12.4K/mo', change: '+3.8%' },
      { name: 'Avg Load Weight', value: '95,200 lbs', change: '+1.1%' },
      { name: 'Specialized Trailers', value: '87% utilized', change: '+1.9%' },
    ],
  },
};
