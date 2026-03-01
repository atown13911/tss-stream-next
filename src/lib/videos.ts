export interface Video {
  id: string;
  title: string;
  channel: { name: string; initials: string; subs: string };
  category: string;
  views: string;
  date: string;
  duration: string | null;
  thumb: string;
  description: string;
  tags: string[];
  live?: boolean;
}

export const videos: Video[] = [
  { id: 'v1', title: 'Cross-Country Flatbed Haul: Chicago to Los Angeles Full Journey', channel: { name: 'Road Warrior TV', initials: 'RW', subs: '25.1K' }, category: 'trucking', views: '245K', date: '3 days ago', duration: '32:14', thumb: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=640&h=360&fit=crop', description: 'Join us on an epic cross-country flatbed haul from Chicago to Los Angeles.', tags: ['flatbed', 'cross-country'] },
  { id: 'v2', title: "Inside the World's Largest Container Port — Full Tour", channel: { name: 'Ocean View Logistics', initials: 'OV', subs: '6.3K' }, category: 'maritime', views: '1.2M', date: '1 week ago', duration: '45:30', thumb: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=640&h=360&fit=crop', description: 'Exclusive tour inside one of the busiest container ports.', tags: ['port', 'containers'] },
  { id: 'v3', title: 'Night Shift at the Rail Yard: Switching Operations Explained', channel: { name: 'Rail Nation', initials: 'RN', subs: '15.8K' }, category: 'rail', views: '89K', date: '5 days ago', duration: '18:42', thumb: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=640&h=360&fit=crop', description: 'What happens at a rail yard during the night shift?', tags: ['rail yard', 'switching'] },
  { id: 'v4', title: 'Boeing 747 Freighter Loading — Time Lapse', channel: { name: 'Sky Cargo Network', initials: 'SC', subs: '4.2K' }, category: 'air-freight', views: '3.4M', date: '2 weeks ago', duration: '8:15', thumb: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=640&h=360&fit=crop', description: 'Watch a Boeing 747 freighter get loaded with cargo.', tags: ['747', 'cargo plane'] },
  { id: 'v5', title: "How Amazon's Warehouse Robots Handle 1 Million Packages a Day", channel: { name: 'Dock Life', initials: 'DL', subs: '9.1K' }, category: 'warehousing', views: '5.7M', date: '3 weeks ago', duration: '22:08', thumb: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=640&h=360&fit=crop', description: 'Deep dive into robotic fulfillment systems.', tags: ['warehouse', 'robots'] },
  { id: 'v6', title: 'EV Delivery Van Fleet: First 30 Days Review', channel: { name: 'Last Mile TV', initials: 'LM', subs: '3.9K' }, category: 'last-mile', views: '127K', date: '4 days ago', duration: '15:33', thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=640&h=360&fit=crop', description: 'We ran a fleet of electric delivery vans for 30 days.', tags: ['EV', 'delivery'] },
  { id: 'v7', title: 'Oversize Load Transport: Moving a 200-Ton Transformer', channel: { name: 'Haul Master Pro', initials: 'HM', subs: '18.6K' }, category: 'heavy-haul', views: '890K', date: '1 week ago', duration: '28:45', thumb: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=640&h=360&fit=crop', description: 'Transporting a 200-ton power transformer across state lines.', tags: ['oversize', 'heavy haul'] },
  { id: 'v8', title: 'Taylor Shipping Solutions — Company Spotlight 2026', channel: { name: 'Taylor Shipping Solutions', initials: 'TS', subs: '12.4K' }, category: 'trucking', views: '34K', date: '6 days ago', duration: '12:20', thumb: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=640&h=360&fit=crop', description: 'Inside look at Taylor Shipping Solutions.', tags: ['TSS', 'company'] },
  { id: 'v9', title: 'LIVE: Port of Long Beach — Ship Arrivals & Departures', channel: { name: 'Port Authority Channel', initials: 'PA', subs: '7.5K' }, category: 'maritime', views: '15K watching', date: 'Streaming now', duration: null, live: true, thumb: 'https://images.unsplash.com/photo-1524522173746-f628baad3644?w=640&h=360&fit=crop', description: 'Live camera feed from the Port of Long Beach.', tags: ['live', 'port'] },
  { id: 'v10', title: 'Winter Trucking in the Rockies — Ice Road Tips', channel: { name: 'Road Warrior TV', initials: 'RW', subs: '25.1K' }, category: 'trucking', views: '456K', date: '2 days ago', duration: '20:11', thumb: 'https://images.unsplash.com/photo-1516733968668-dbdce39c0571?w=640&h=360&fit=crop', description: 'Driving through the Rocky Mountains in winter.', tags: ['winter', 'ice road'] },
  { id: 'v11', title: 'How Intermodal Freight Actually Works — Explained', channel: { name: 'Rail Nation', initials: 'RN', subs: '15.8K' }, category: 'rail', views: '312K', date: '10 days ago', duration: '25:00', thumb: 'https://images.unsplash.com/photo-1532596246597-1447f5793dc8?w=640&h=360&fit=crop', description: 'From truck to train to truck again.', tags: ['intermodal', 'freight'] },
  { id: 'v12', title: 'Drone Delivery: The Future of Last Mile?', channel: { name: 'Last Mile TV', initials: 'LM', subs: '3.9K' }, category: 'last-mile', views: '678K', date: '2 weeks ago', duration: '14:50', thumb: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=640&h=360&fit=crop', description: 'Drone delivery is finally here — but is it ready?', tags: ['drones', 'delivery'] },
  { id: 'v13', title: 'Taylor Shipping: New Fleet Reveal — 2026 Peterbilt 579s', channel: { name: 'Taylor Shipping Solutions', initials: 'TS', subs: '12.4K' }, category: 'trucking', views: '58K', date: '1 day ago', duration: '10:45', thumb: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=640&h=360&fit=crop', description: 'Brand new 2026 Peterbilt 579s added to the TSS fleet!', tags: ['Peterbilt', 'new trucks'] },
];
