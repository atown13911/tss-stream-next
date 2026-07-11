'use client';

import { useMemo } from 'react';
import VideoGrid from '@/components/VideoGrid';
import { useVideos } from '@/hooks/useVideos';
import { parseViewCount } from '@/lib/videos';

export default function TrendingPage() {
  const { videos, loading } = useVideos();

  const sorted = useMemo(
    () => [...videos].sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views)),
    [videos]
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending in Transportation</h2>
      </div>
      {loading && <p className="text-sm text-slate-500 mb-4 animate-pulse">Loading...</p>}
      <VideoGrid videos={sorted} />
    </>
  );
}
