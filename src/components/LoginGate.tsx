'use client';

import { useState, useEffect, ReactNode } from 'react';
import { getToken, isTokenExpired, clearToken, redirectToSSO, exchangeCode } from '@/lib/auth';

export default function LoginGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      exchangeCode(code)
        .then(() => {
          window.history.replaceState({}, '', '/');
          setAuthenticated(true);
          setChecking(false);
        })
        .catch((err) => {
          setError(err.message);
          setChecking(false);
        });
      return;
    }

    const token = getToken();
    if (token && !isTokenExpired(token)) {
      setAuthenticated(true);
      setChecking(false);
      return;
    }

    clearToken();
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-zinc-500 text-sm animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button onClick={() => redirectToSSO()} className="text-blue-400 text-sm hover:underline cursor-pointer">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-blue-600 mb-4">
            <span className="material-icons-round text-white text-2xl">play_circle</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">TSS Stream</h1>
          <p className="text-zinc-500 text-sm mb-6">Sign in with Taylor Access to continue</p>
          <button
            onClick={() => redirectToSSO()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Sign In with Taylor Access
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
