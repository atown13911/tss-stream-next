import { videos } from '@/lib/videos';
import VideoGrid from '@/components/VideoGrid';
import HeroBanner from '@/components/HeroBanner';
import CategoryPills from '@/components/CategoryPills';

export default function HomePage() {
  const liveVideos = videos.filter(v => v.live);
  const featured = videos.filter(v => !v.live);

  return (
    <>
      <HeroBanner />
      <CategoryPills />

      {liveVideos.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-xl font-bold">Live Now</h2>
          </div>
          <VideoGrid videos={liveVideos} />
        </>
      )}

      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-xl font-bold">Recommended</h2>
      </div>
      <VideoGrid videos={featured} />
    </>
  );
}
