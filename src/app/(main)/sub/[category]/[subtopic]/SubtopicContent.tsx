'use client';

import EmptyState from '@/components/EmptyState';
import { CATEGORY_META, CATEGORY_SLUGS, type CategorySlug } from '@/lib/videos';
import {
  MARKET_BY_CATEGORY,
  SUBTOPIC_SECTIONS,
  SUBTOPIC_SLUGS,
  type SubtopicSlug,
} from '@/lib/subtopics';

function trendIcon(trend: 'up' | 'down' | 'stable') {
  if (trend === 'up') return 'trending_up';
  if (trend === 'down') return 'trending_down';
  return 'trending_flat';
}

function trendColor(trend: 'up' | 'down' | 'stable') {
  if (trend === 'up') return 'text-emerald-400';
  if (trend === 'down') return 'text-red-400';
  return 'text-slate-400';
}

function CardGrid({ icon, title, categoryLabel, items }: {
  icon: string;
  title: string;
  categoryLabel: string;
  items: { title: string; desc: string; meta: string; metaIcon: string }[];
}) {
  return (
    <>
      <header className="flex items-center gap-4 mb-8 p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <div className="w-14 h-14 rounded-xl bg-sky-500/15 flex items-center justify-center">
          <span className="material-icons-round text-3xl text-sky-500">{icon}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{categoryLabel} — {title}</h1>
          <p className="text-sm text-slate-400 mt-1">Browse {title.toLowerCase()} in the {categoryLabel.toLowerCase()} category</p>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="p-5 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] hover:border-sky-500/30 transition-colors">
            <h3 className="font-semibold text-slate-100 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.desc}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="material-icons-round text-[16px] text-sky-500">{item.metaIcon}</span>
              <span>{item.meta}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function MarketView({ category }: { category: CategorySlug }) {
  const meta = CATEGORY_META[category];
  const data = MARKET_BY_CATEGORY[category];
  const rateUp = data.rateChange >= 0;

  return (
    <>
      <header className="flex items-center gap-4 mb-8 p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <div className="w-14 h-14 rounded-xl bg-sky-500/15 flex items-center justify-center">
          <span className="material-icons-round text-3xl text-sky-500">analytics</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{meta.label} Market Data</h1>
          <p className="text-sm text-slate-400 mt-1">Live rates, lane data, and industry indices. Updated weekly.</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="p-5 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Avg Rate</p>
          <p className="text-2xl font-bold text-slate-100">${data.avgRate}{data.rateSuffix}</p>
        </div>
        <div className="p-5 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Rate Change (30d)</p>
          <p className={`text-2xl font-bold ${rateUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {rateUp ? '+' : ''}{data.rateChange}%
          </p>
        </div>
        {data.indices.map((idx) => (
          <div key={idx.name} className="p-5 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{idx.name}</p>
            <p className="text-2xl font-bold text-slate-100">{idx.value}</p>
            <p className="text-xs text-slate-500 mt-1">{idx.change}</p>
          </div>
        ))}
      </div>

      {data.lanes.length > 0 && (
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-slate-200">Top Lanes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-[var(--border)]">
                  <th className="px-5 py-3 font-medium">Origin</th>
                  <th className="px-5 py-3 font-medium">Destination</th>
                  <th className="px-5 py-3 font-medium">Rate</th>
                  <th className="px-5 py-3 font-medium">Volume</th>
                  <th className="px-5 py-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.lanes.map((lane) => (
                  <tr key={`${lane.origin}-${lane.dest}`} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-5 py-3 font-medium text-slate-200">{lane.origin}</td>
                    <td className="px-5 py-3 font-medium text-slate-200">{lane.dest}</td>
                    <td className="px-5 py-3 text-slate-300">${lane.rate}{data.rateSuffix}</td>
                    <td className="px-5 py-3 text-slate-400">{lane.volume}</td>
                    <td className={`px-5 py-3 ${trendColor(lane.trend)}`}>
                      <span className="inline-flex items-center gap-1">
                        <span className="material-icons-round text-[18px]">{trendIcon(lane.trend)}</span>
                        {lane.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default function SubtopicPage({ category, subtopic }: { category: string; subtopic: string }) {
  const meta = CATEGORY_META[category as CategorySlug];
  const validCategory = CATEGORY_SLUGS.includes(category as CategorySlug);
  const validSubtopic = SUBTOPIC_SLUGS.includes(subtopic as SubtopicSlug);

  if (!validCategory || !validSubtopic || !meta) {
    return <EmptyState icon="error_outline" title="Page not found" action={{ href: '/', label: 'Back to Home' }} />;
  }

  if (subtopic === 'market') {
    return <MarketView category={category as CategorySlug} />;
  }

  const section = SUBTOPIC_SECTIONS[subtopic as Exclude<SubtopicSlug, 'market'>];
  return (
    <CardGrid
      icon={section.icon}
      title={section.title}
      categoryLabel={meta.label}
      items={section.items}
    />
  );
}
