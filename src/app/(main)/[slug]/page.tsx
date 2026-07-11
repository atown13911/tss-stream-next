import EmptyState from '@/components/EmptyState';

const STUB_SLUGS = ['podcast', 'news', 'weather', 'roundtable', 'contact', 'services'] as const;

const stubs: Record<string, { title: string; icon: string; description: string }> = {
  podcast: { title: 'Podcast', icon: 'podcasts', description: 'Transportation industry podcasts coming soon.' },
  news: { title: 'News', icon: 'newspaper', description: 'Logistics news feed coming soon.' },
  weather: { title: 'Weather', icon: 'cloud', description: 'Route weather conditions coming soon.' },
  roundtable: { title: 'Round Table', icon: 'groups', description: 'Live industry discussions coming soon.' },
  contact: { title: 'Contact', icon: 'mail', description: 'Reach us at support@taylorshippingsolutions.com' },
  services: { title: 'Services', icon: 'miscellaneous_services', description: 'Freight, drayage, and logistics services.' },
};

export function generateStaticParams() {
  return STUB_SLUGS.map((slug) => ({ slug }));
}

export default function StubPage({ params }: { params: { slug: string } }) {
  const page = stubs[params.slug] || { title: 'Coming Soon', icon: 'construction', description: 'This section is under development.' };
  return <EmptyState icon={page.icon} title={page.title} description={page.description} />;
}
