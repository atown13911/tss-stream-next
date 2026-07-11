'use client';

import { useMemo, useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import CategoryPills from '@/components/CategoryPills';
import VideoGrid from '@/components/VideoGrid';
import { useVideos } from '@/hooks/useVideos';
import { categoryLabel } from '@/lib/videos';

export default function HomePage() {
  const { videos, loading } = useVideos();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return videos;
    return videos.filter((v) => v.category === activeFilter);
  }, [videos, activeFilter]);

  const liveVideos = filtered.filter((v) => v.live);
  const featured = filtered.filter((v) => !v.live);

  return (
    <>
      <HeroBanner />
      <CategoryPills active={activeFilter} onChange={setActiveFilter} />

      {loading && (
        <p className="text-sm text-slate-500 mb-4 animate-pulse">Loading videos...</p>
      )}

      {liveVideos.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-xl font-bold">Live Now</h2>
          </div>
          <VideoGrid videos={liveVideos} />
        </>
      )}

      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-xl font-bold">
          {activeFilter === 'all' ? 'Recommended' : categoryLabel(activeFilter)}
        </h2>
      </div>
      <VideoGrid videos={featured} />
    </>
  );
}
