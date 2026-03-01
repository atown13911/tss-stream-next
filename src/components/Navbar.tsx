'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { logout } from '@/lib/auth';

const notifications = [
  { icon: 'person_add', text: '<strong>Mike Reynolds</strong> just joined TSS Stream', time: '2 min ago', unread: true },
  { icon: 'thumb_up', text: '<strong>LogisticsLaura</strong> liked your video', time: '15 min ago', unread: true },
  { icon: 'comment', text: '<strong>FreightDog</strong> commented on your video', time: '1 hour ago', unread: true },
  { icon: 'cloud_upload', text: '<strong>DieselDave</strong> uploaded a new video', time: '3 hours ago', unread: false },
  { icon: 'subscriptions', text: '<strong>Rail Nation</strong> posted a new video', time: '5 hours ago', unread: false },
];

export default function Navbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.filter(n => n.unread).length);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => { setNotifOpen(false); setUserOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-[var(--navbar-height)] bg-[rgba(10,14,23,0.85)] backdrop-blur-xl border-b border-[var(--border)] flex items-center justify-between px-4 z-[1000] gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onMenuToggle} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-[var(--bg-card)] hover:text-white transition-colors">
          <span className="material-icons-round">menu</span>
        </button>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="material-icons-round text-[22px] text-white">sailing</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-lg bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">TSS</span>
            <span className="text-[0.65rem] font-medium text-slate-500 uppercase tracking-[0.15em]">Stream</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 max-w-[640px] mx-auto">
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-full overflow-hidden focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-glow)] transition-all">
          <input type="text" placeholder="Search transportation videos..." className="flex-1 bg-transparent border-none outline-none px-5 py-2.5 text-sm text-slate-200 placeholder-slate-500" />
          <button className="w-12 h-10 flex items-center justify-center bg-[var(--bg-surface)] border-l border-[var(--border)] text-slate-400 hover:text-white transition-colors">
            <span className="material-icons-round">search</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Link href="/upload" className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-[var(--bg-card)] transition-colors">
          <span className="material-icons-round text-[28px]">video_call</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={(e) => { e.stopPropagation(); setUserOpen(false); setNotifOpen(!notifOpen); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-[var(--bg-card)] hover:text-white transition-colors relative">
            <span className="material-icons-round">notifications</span>
            {unread > 0 && <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-red-500 rounded-full text-[0.65rem] font-bold flex items-center justify-center text-white">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-[380px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
                <h4 className="font-bold text-sm">Notifications</h4>
                <button onClick={() => setUnread(0)} className="text-xs font-semibold text-sky-500 hover:text-sky-400">Mark all read</button>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className={`flex gap-3 px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors relative ${n.unread && unread > 0 ? 'bg-sky-500/5' : ''}`}>
                    {n.unread && unread > 0 && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-500" />}
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-card)] flex items-center justify-center shrink-0">
                      <span className="material-icons-round text-[18px] text-sky-500">{n.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] text-slate-300 leading-snug" dangerouslySetInnerHTML={{ __html: n.text }} />
                      <p className="text-[0.7rem] text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button onClick={(e) => { e.stopPropagation(); setNotifOpen(false); setUserOpen(!userOpen); }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer ml-1">
            TA
          </button>
          {userOpen && (
            <div className="absolute top-full right-0 mt-2 w-[280px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-base font-bold text-white">TA</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[0.95rem]">Austin Taylor</div>
                  <div className="text-xs text-slate-500 truncate">austin.taylor@taylorshipping.com</div>
                </div>
              </div>
              <hr className="border-[var(--border)]" />
              <Link href="/library" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-[var(--bg-card)] hover:text-white transition-colors">
                <span className="material-icons-round text-[20px]">video_library</span> Your Library
              </Link>
              <Link href="/upload" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-[var(--bg-card)] hover:text-white transition-colors">
                <span className="material-icons-round text-[20px]">cloud_upload</span> Upload Video
              </Link>
              <Link href="/users" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-[var(--bg-card)] hover:text-white transition-colors">
                <span className="material-icons-round text-[20px]">group</span> Manage Users
              </Link>
              <hr className="border-[var(--border)]" />
              <Link href="/settings" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-[var(--bg-card)] hover:text-white transition-colors">
                <span className="material-icons-round text-[20px]">settings</span> Settings
              </Link>
              <hr className="border-[var(--border)]" />
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                <span className="material-icons-round text-[20px]">logout</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
