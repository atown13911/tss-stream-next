'use client';

import { useEffect } from 'react';
import { useAuthGate } from '@/components/LoginGate';

export default function CallbackPage() {
  const { authenticated, checking, error } = useAuthGate();

  useEffect(() => {
    if (authenticated) {
      window.location.replace('/');
    }
  }, [authenticated]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        <p className="text-sky-500/60 text-sm animate-pulse tracking-wider">AUTHENTICATING...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <a href="https://tss-portal.com" className="text-sky-400 text-sm hover:underline">
            Return to Portal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
      <p className="text-sky-500/60 text-sm animate-pulse tracking-wider">REDIRECTING...</p>
    </div>
  );
}
