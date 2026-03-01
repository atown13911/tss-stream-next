import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-[#0c1a3a] via-[#0a2e4a] to-[#0f3460]">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_50%,#0ea5e9_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#06b6d4_0%,transparent_40%),radial-gradient(circle_at_60%_80%,#8b5cf6_0%,transparent_40%)]" />
      <div className="relative z-10 h-full flex flex-col justify-center px-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/15 border border-sky-500/30 rounded-full text-xs font-semibold text-sky-500 mb-4 w-fit">
          <span className="material-icons-round text-[14px]">play_circle</span>
          TSS Stream
        </div>
        <h1 className="text-3xl font-extrabold leading-tight mb-3 max-w-[500px]">
          Transportation Videos by the People Who Move the World
        </h1>
        <p className="text-base text-slate-400 max-w-[440px] leading-relaxed mb-6">
          Watch, upload, and share real stories from the road, rails, seas, and skies. Powered by Taylor Shipping Solutions.
        </p>
        <div className="flex gap-3">
          <Link href="/trending" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-lg transition-colors">
            <span className="material-icons-round text-[20px]">local_fire_department</span>
            Trending Now
          </Link>
          <Link href="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-600 hover:bg-[var(--bg-card)] text-white font-semibold text-sm rounded-lg transition-colors">
            <span className="material-icons-round text-[20px]">cloud_upload</span>
            Upload Video
          </Link>
        </div>
      </div>
    </div>
  );
}
