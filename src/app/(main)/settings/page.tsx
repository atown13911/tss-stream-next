'use client';

import { useState } from 'react';
import { getUserDisplayName, getUserEmail } from '@/lib/auth';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState(getUserDisplayName());
  const [email] = useState(getUserEmail());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const profile = {
      displayName,
      email,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('tss_stream_profile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold mb-6">Settings</h2>

      <div className="space-y-4 p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Display Name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
          <input
            value={email}
            readOnly
            className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-slate-500"
          />
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-lg cursor-pointer"
        >
          <span className="material-icons-round text-[18px]">save</span>
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
