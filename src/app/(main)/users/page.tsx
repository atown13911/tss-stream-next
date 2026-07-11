'use client';

import { useEffect, useState } from 'react';
import { API_URL, apiDelete, apiFetch } from '@/lib/api';
import { formatViews, timeAgo } from '@/lib/videos';

interface StreamUser {
  id: string;
  display_name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  video_count: number;
  total_views: number;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<StreamUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await apiFetch<StreamUser[]>('/api/users');
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    if (await apiDelete(`/api/users/${id}`)) {
      load();
    }
  };

  const handleAdd = async () => {
    const display_name = prompt('Display name');
    const username = prompt('Username');
    const email = prompt('Email');
    if (!display_name || !username || !email) return;

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name, username, email, role: 'viewer' }),
      });
      if (res.ok) load();
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Manage Users</h2>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-lg cursor-pointer"
        >
          <span className="material-icons-round text-[18px]">person_add</span>
          Add User
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 animate-pulse">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-slate-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-card)] text-slate-400 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Videos</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-card)]/50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.display_name}</div>
                    <div className="text-xs text-slate-500">@{u.username}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 capitalize">{u.status}</td>
                  <td className="px-4 py-3">{u.video_count}</td>
                  <td className="px-4 py-3">{formatViews(u.total_views)}</td>
                  <td className="px-4 py-3 text-slate-500">{timeAgo(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-slate-500 hover:text-red-400 cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-icons-round text-[18px]">delete_outline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
