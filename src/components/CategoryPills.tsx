'use client';

import { useState } from 'react';

const categories = ['All', 'Trucking', 'Maritime', 'Rail', 'Air Freight', 'Warehousing', 'Last Mile', 'Heavy Haul'];

export default function CategoryPills() {
  const [active, setActive] = useState('All');

  return (
    <div className="flex gap-2 pb-5 overflow-x-auto scrollbar-hide">
      {categories.map(c => (
        <button key={c} onClick={() => setActive(c)}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${active === c ? 'bg-sky-500 text-white border-sky-500' : 'bg-[var(--bg-card)] text-slate-400 border-transparent hover:bg-[var(--bg-card-hover)] hover:text-white'}`}>
          {c}
        </button>
      ))}
    </div>
  );
}
