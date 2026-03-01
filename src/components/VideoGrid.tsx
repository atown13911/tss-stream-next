import Link from 'next/link';
import type { Video } from '@/lib/videos';

export default function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 mb-10">
      {videos.map(v => (
        <Link href={`/watch/${v.id}`} key={v.id} className="group bg-[var(--bg-card)] rounded-xl overflow-hidden border border-transparent hover:border-[var(--border-light)] hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="relative w-full aspect-video overflow-hidden bg-[var(--bg-surface)]">
            <img src={v.thumb} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {v.live && <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-[0.7rem] font-bold uppercase tracking-wide">LIVE</span>}
            {v.duration && <span className="absolute bottom-2 right-2 bg-black/80 text-white px-1.5 py-0.5 rounded text-xs font-semibold">{v.duration}</span>}
          </div>
          <div className="p-3 flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--bg-surface)] flex items-center justify-center shrink-0 text-[0.7rem] font-bold text-sky-500 border border-[var(--border)]">
              {v.channel.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1">{v.title}</h3>
              <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{v.channel.name}</p>
              <p className="text-xs text-slate-500">{v.views} views · {v.date}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
