'use client';

import { useState, useEffect, ReactNode } from 'react';
import { getToken, isTokenExpired, clearToken, exchangeCode, handleTokenHandoff, hasValidToken } from '@/lib/auth';

export default function LoginGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const code = params.get('code');

    if (tokenParam) {
      handleTokenHandoff(tokenParam)
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

    if (hasValidToken()) {
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
          <button onClick={() => { window.location.href = 'https://tss-portal.com'; }} className="text-blue-400 text-sm hover:underline cursor-pointer">
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://tss-portal.com';
    }
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-zinc-500 text-sm animate-pulse">Redirecting to portal...</p>
      </div>
    );
  }

  return <>{children}</>;
}
