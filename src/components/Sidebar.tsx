'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const mainLinks = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/trending', icon: 'local_fire_department', label: 'Trending' },
  { href: '/about', icon: 'info', label: 'About Us' },
  { href: '/services', icon: 'miscellaneous_services', label: 'Services' },
  { href: '/contact', icon: 'mail', label: 'Contact' },
];

const streamLinks = [
  { href: '/subscriptions', icon: 'subscriptions', label: 'Subscriptions' },
  { href: '/podcast', icon: 'podcasts', label: 'Podcast' },
  { href: '/news', icon: 'newspaper', label: 'News' },
  { href: '/weather', icon: 'cloud', label: 'Weather' },
  { href: '/roundtable', icon: 'groups', label: 'Round Table' },
];

const categories = [
  { id: 'trucking', icon: 'local_shipping', label: 'Trucking' },
  { id: 'maritime', icon: 'directions_boat', label: 'Maritime' },
  { id: 'rail', icon: 'train', label: 'Rail' },
  { id: 'air-freight', icon: 'flight', label: 'Air Freight' },
  { id: 'warehousing', icon: 'warehouse', label: 'Warehousing' },
  { id: 'last-mile', icon: 'delivery_dining', label: 'Last Mile' },
  { id: 'heavy-haul', icon: 'rv_hookup', label: 'Heavy Haul' },
];

const subLinks = [
  { suffix: '', icon: 'play_circle', label: 'Videos' },
  { suffix: '/jobs', icon: 'work', label: 'Job Board' },
  { suffix: '/threads', icon: 'forum', label: 'Threads' },
  { suffix: '/services', icon: 'build', label: 'Services' },
  { suffix: '/market', icon: 'analytics', label: 'Market Data' },
];

const bottomLinks = [
  { href: '/upload', icon: 'cloud_upload', label: 'Upload' },
  { href: '/library', icon: 'video_library', label: 'Your Library' },
  { href: '/history', icon: 'history', label: 'History' },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const [openCat, setOpenCat] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href;
  const isCatActive = (id: string) => pathname.startsWith(`/category/${id}`) || pathname.startsWith(`/sub/${id}`);

  return (
    <aside className={`fixed top-[var(--navbar-height)] left-0 h-[calc(100vh-var(--navbar-height))] bg-[var(--bg-secondary)] border-r border-[var(--border)] overflow-y-auto overflow-x-hidden z-50 flex flex-col transition-all duration-200 ${collapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'}`}>
      <div className="p-2">
        {mainLinks.map(link => (
          <Link key={link.href} href={link.href}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-slate-400 hover:bg-[var(--bg-card)] hover:text-slate-200'} ${collapsed ? 'justify-center' : ''}`}>
            <span className="material-icons-round text-[22px] shrink-0">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </div>

      <hr className="border-[var(--border)] mx-3 my-1" />

      <div className="p-2">
        {!collapsed && <h4 className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">Stream</h4>}
        {streamLinks.map(link => (
          <Link key={link.href} href={link.href}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-slate-400 hover:bg-[var(--bg-card)] hover:text-slate-200'} ${collapsed ? 'justify-center' : ''}`}>
            <span className="material-icons-round text-[22px] shrink-0">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </div>

      <hr className="border-[var(--border)] mx-3 my-1" />

      <div className="p-2">
        {!collapsed && <h4 className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">Categories</h4>}
        {categories.map(cat => (
          <div key={cat.id}>
            <button onClick={() => setOpenCat(openCat === cat.id ? null : cat.id)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isCatActive(cat.id) ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-slate-400 hover:bg-[var(--bg-card)] hover:text-slate-200'} ${collapsed ? 'justify-center' : ''}`}>
              <span className="material-icons-round text-[22px] shrink-0">{cat.icon}</span>
              {!collapsed && <>
                <span>{cat.label}</span>
                <span className={`material-icons-round text-[18px] ml-auto transition-transform ${openCat === cat.id ? 'rotate-180' : ''}`}>expand_more</span>
              </>}
            </button>
            {!collapsed && (
              <div className={`overflow-hidden transition-all duration-250 ${openCat === cat.id ? 'max-h-[260px]' : 'max-h-0'}`}>
                {subLinks.map(sub => {
                  const href = sub.suffix ? `/sub/${cat.id}${sub.suffix}` : `/category/${cat.id}`;
                  return (
                    <Link key={href} href={href}
                      className={`flex items-center gap-2.5 pl-11 pr-3 py-1.5 text-[0.8rem] font-medium rounded-md transition-colors ${isActive(href) ? 'text-[var(--accent)]' : 'text-slate-500 hover:bg-[var(--bg-card)] hover:text-slate-200'}`}>
                      <span className="material-icons-round text-[17px]">{sub.icon}</span>
                      <span>{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="border-[var(--border)] mx-3 my-1" />

      <div className="p-2">
        {bottomLinks.map(link => (
          <Link key={link.href} href={link.href}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.href) ? 'bg-[var(--accent-glow)] text-[var(--accent)]' : 'text-slate-400 hover:bg-[var(--bg-card)] hover:text-slate-200'} ${collapsed ? 'justify-center' : ''}`}>
            <span className="material-icons-round text-[22px] shrink-0">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </div>

      {!collapsed && (
        <div className="mt-auto p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="material-icons-round text-[16px] text-[var(--accent)]">sailing</span>
            Taylor Shipping Solutions
          </div>
          <p className="text-[0.65rem] text-slate-600">&copy; 2026 TSS Stream</p>
        </div>
      )}
    </aside>
  );
}
