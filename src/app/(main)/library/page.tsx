'use client';

import VideoGrid from '@/components/VideoGrid';
import EmptyState from '@/components/EmptyState';
import { useVideos } from '@/hooks/useVideos';

export default function LibraryPage() {
  const { videos, loading } = useVideos();
  const uploaded = videos.filter((v) => v.isApi);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Your Library</h2>
      {loading && <p className="text-sm text-slate-500 mb-4 animate-pulse">Loading...</p>}
      {uploaded.length > 0 ? (
        <VideoGrid videos={uploaded} />
      ) : (
        <EmptyState
          icon="video_library"
          title="No uploads yet"
          description="Upload videos to see them here."
          action={{ href: '/upload', label: 'Upload Your First Video' }}
        />
      )}
    </>
  );
}
