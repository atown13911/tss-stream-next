'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchApiVideos, mergeVideos, type Video } from '@/lib/videos';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const apiVideos = await fetchApiVideos();
    setVideos(mergeVideos(apiVideos));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { videos, loading, refresh };
}
