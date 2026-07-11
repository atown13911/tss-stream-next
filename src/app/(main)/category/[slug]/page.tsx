import CategoryPage from './CategoryContent';
import { CATEGORY_SLUGS } from '@/lib/videos';

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export default function CategoryRoute({ params }: { params: { slug: string } }) {
  return <CategoryPage slug={params.slug} />;
}
