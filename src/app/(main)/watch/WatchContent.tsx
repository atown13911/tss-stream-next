'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import EmptyState from '@/components/EmptyState';
import { useVideos } from '@/hooks/useVideos';
import { API_URL, getSessionId } from '@/lib/api';
import { getUserDisplayName, getUserInitials } from '@/lib/auth';
import {
  defaultComments,
  fetchComments,
  fetchVideoById,
  type Video,
  type VideoComment,
} from '@/lib/videos';

export default function WatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id') || '';
  const { videos } = useVideos();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!videoId) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const found = await fetchVideoById(videoId, videos);
      setVideo(found);
      if (found?.isApi) {
        const apiComments = await fetchComments(videoId);
        setComments(apiComments.length ? apiComments : defaultComments);
      } else {
        setComments(defaultComments);
      }
      setLoading(false);
    })();
  }, [videoId, videos]);

  if (!videoId) {
    return (
      <EmptyState
        icon="play_circle"
        title="No video selected"
        description="Choose a video from the home page."
        action={{ href: '/', label: 'Browse Videos' }}
      />
    );
  }

  if (loading) {
    return <p className="text-sm text-slate-500 animate-pulse">Loading video...</p>;
  }

  if (!video) {
    return (
      <EmptyState icon="error_outline" title="Video Not Found" action={{ href: '/', label: 'Back to Home' }} />
    );
  }

  const related = videos.filter((v) => v.id !== videoId).slice(0, 8);
  const hasStream = video.isApi && video.streamUrl;
  const userInitials = getUserInitials();

  const handleLike = async () => {
    if (video.isApi) {
      try {
        const res = await fetch(`${API_URL}/api/videos/${videoId}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: getSessionId() }),
        });
        if (res.ok) {
          const data = await res.json();
          setLiked(!!data.liked);
          return;
        }
      } catch {
        /* ignore */
      }
    }
    setLiked((prev) => !prev);
  };

  const handleComment = async () => {
    const body = commentText.trim();
    if (!body) return;
    setCommentText('');

    if (video.isApi) {
      try {
        await fetch(`${API_URL}/api/comments/${videoId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author_name: getUserDisplayName(), body }),
        });
      } catch {
        /* ignore */
      }
    }

    setComments((prev) => [
      { author: 'You', initials: userInitials, time: 'Just now', text: body },
      ...prev,
    ]);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[var(--bg-surface)] mb-4">
          {hasStream ? (
            <video controls autoPlay src={video.streamUrl} className="w-full h-full object-contain bg-black" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <span className="material-icons-round text-6xl text-sky-500/50">play_circle</span>
              <p className="text-sm">Demo video — upload your own to stream</p>
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold mb-3 leading-snug">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-sm text-slate-500">{video.views} views · {video.date}</span>
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                liked ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'border-[var(--border)] text-slate-400 hover:bg-[var(--bg-card)]'
              }`}
            >
              <span className="material-icons-round text-[18px]">{liked ? 'thumb_up' : 'thumb_up_off_alt'}</span>
              {liked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[var(--border)] text-slate-400 hover:bg-[var(--bg-card)] cursor-pointer"
            >
              <span className="material-icons-round text-[18px]">share</span>
              Share
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-[var(--bg-card)] rounded-xl mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-xs font-bold text-sky-500 border border-[var(--border)]">
            {video.channel.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{video.channel.name}</div>
            <div className="text-xs text-slate-500">{video.channel.subs} subscribers</div>
          </div>
          <button className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-full cursor-pointer">
            Subscribe
          </button>
        </div>

        <div className="p-4 bg-[var(--bg-card)] rounded-xl text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
          {video.description}
          {video.tags?.length > 0 && (
            <p className="mt-3 text-sky-500/80">
              {video.tags.map((t) => `#${String(t).replace(/\s+/g, '')}`).join('  ')}
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold">Comments</h3>
            <span className="text-xs text-slate-500">{comments.length}</span>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-xs font-bold shrink-0">
              {userInitials}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <div className="space-y-4">
            {comments.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--bg-card)] flex items-center justify-center text-xs font-bold text-sky-500 shrink-0">
                  {c.initials}
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-semibold">{c.author}</span>
                    <span className="text-xs text-slate-500 ml-2">{c.time}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="xl:w-80 shrink-0">
        <h3 className="font-bold mb-3">Up Next</h3>
        <div className="space-y-3">
          {related.map((v) => (
            <Link key={v.id} href={`/watch?id=${v.id}`} className="flex gap-2 group">
              <div className="relative w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-[var(--bg-surface)]">
                <img src={v.thumb} alt={v.title} className="w-full h-full object-cover" />
                {v.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white px-1 rounded text-[10px] font-semibold">
                    {v.duration}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-sky-400 transition-colors">{v.title}</p>
                <p className="text-xs text-slate-500 mt-1">{v.channel.name}</p>
                <p className="text-xs text-slate-500">{v.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
