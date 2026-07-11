'use client';

import { useMemo } from 'react';
import VideoGrid from '@/components/VideoGrid';
import EmptyState from '@/components/EmptyState';
import { useVideos } from '@/hooks/useVideos';
import { CATEGORY_META, type CategorySlug } from '@/lib/videos';

export default function CategoryPage({ slug }: { slug: string }) {
  const { videos, loading } = useVideos();
  const meta = CATEGORY_META[slug as CategorySlug];

  const catVideos = useMemo(
    () => videos.filter((v) => v.category === slug),
    [videos, slug]
  );

  if (!meta) {
    return <EmptyState icon="category" title="Category not found" action={{ href: '/', label: 'Back to Home' }} />;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8 p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <div className="w-14 h-14 rounded-xl bg-sky-500/15 flex items-center justify-center">
          <span className="material-icons-round text-3xl text-sky-500">{meta.icon}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm text-slate-400 mt-1">{meta.description}</p>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500 mb-4 animate-pulse">Loading...</p>}

      {catVideos.length > 0 ? (
        <VideoGrid videos={catVideos} />
      ) : (
        <EmptyState icon="video_library" title="No videos yet" description={`Be the first to upload a ${meta.label.toLowerCase()} video.`} action={{ href: '/upload', label: 'Upload Video' }} />
      )}
    </>
  );
}
