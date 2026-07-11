export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4 p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <div className="w-14 h-14 rounded-xl bg-sky-500/15 flex items-center justify-center">
          <span className="material-icons-round text-3xl text-sky-500">sailing</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">About Taylor Shipping Solutions</h1>
          <p className="text-sm text-slate-400 mt-1">Moving freight with integrity since day one.</p>
        </div>
      </div>

      <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] space-y-4 text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-white">Our Story</h2>
        <p>
          Taylor Shipping Solutions was founded with a simple mission: deliver freight safely, on time, and with complete transparency. What started as a single truck operation has grown into a full-service transportation and logistics company serving customers across North America.
        </p>
        <h2 className="text-lg font-bold text-white">Why TSS Stream?</h2>
        <p>
          TSS Stream is our community platform where drivers, dispatchers, and logistics professionals share real stories from the road. Upload haul videos, discuss industry topics, find jobs, and connect with services — all in one place.
        </p>
      </div>
    </div>
  );
}
