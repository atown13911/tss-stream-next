import { Suspense } from 'react';
import WatchPage from './WatchContent';

export default function WatchRoute() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500 animate-pulse">Loading video...</p>}>
      <WatchPage />
    </Suspense>
  );
}
