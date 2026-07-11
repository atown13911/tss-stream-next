'use client';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'trucking', label: 'Trucking' },
  { id: 'maritime', label: 'Maritime' },
  { id: 'rail', label: 'Rail' },
  { id: 'air-freight', label: 'Air Freight' },
  { id: 'warehousing', label: 'Warehousing' },
  { id: 'last-mile', label: 'Last Mile' },
  { id: 'heavy-haul', label: 'Heavy Haul' },
];

export default function CategoryPills({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 pb-5 overflow-x-auto scrollbar-hide">
      {filters.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
            active === c.id
              ? 'bg-sky-500 text-white border-sky-500'
              : 'bg-[var(--bg-card)] text-slate-400 border-transparent hover:bg-[var(--bg-card-hover)] hover:text-white'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
