import SubtopicPage from './SubtopicContent';
import { CATEGORY_SLUGS } from '@/lib/videos';
import { SUBTOPIC_SLUGS } from '@/lib/subtopics';

export function generateStaticParams() {
  return CATEGORY_SLUGS.flatMap((category) =>
    SUBTOPIC_SLUGS.map((subtopic) => ({ category, subtopic }))
  );
}

export default function SubtopicRoute({
  params,
}: {
  params: { category: string; subtopic: string };
}) {
  return <SubtopicPage category={params.category} subtopic={params.subtopic} />;
}
