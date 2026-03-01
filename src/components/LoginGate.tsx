'use client';

import { useState, useEffect, FormEvent, ReactNode } from 'react';
import { getToken, isTokenExpired, login, verifyToken, clearToken, logout } from '@/lib/auth';

export function LogoutButton() {
  return (
    <button
      onClick={logout}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
      title="Sign Out"
    >
      <span className="material-icons-round text-sm">logout</span>
      <span className="hidden md:inline">Sign Out</span>
    </button>
  );
}

export default function LoginGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      clearToken();
      setChecking(false);
      return;
    }

    verifyToken(token).then((valid) => {
      if (valid) {
        setAuthenticated(true);
      } else {
        clearToken();
      }
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-zinc-500 text-sm animate-pulse">Verifying session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 mb-4">
              <span className="material-icons-round text-white text-2xl">play_circle</span>
            </div>
            <h1 className="text-2xl font-bold text-white">TSS Stream</h1>
            <p className="text-zinc-500 text-sm mt-1">Sign in with your Taylor Access account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/5 border border-red-400/15 rounded-lg px-4 py-3">
                <span className="material-icons-round text-sm">warning</span>
                <span className="text-xs">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 rounded-lg px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-icons-round text-sm animate-spin">progress_activity</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-zinc-700 text-xs">
            Powered by Taylor Access
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
