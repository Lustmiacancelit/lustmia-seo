// app/dashboard/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DashboardInner() {
  const sp = useSearchParams();
  const sessionId = sp.get('session_id');

  // TODO: put your existing dashboard JSX/UI below.
  // If you need to fetch session details client-side, do it here.
  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell">
          <header className="app-header">
            <div className="app-title">Dashboard</div>
          </header>

          {sessionId ? (
            <div className="app-status">✅ Checkout complete. Session: {sessionId}</div>
          ) : (
            <div className="app-status">Welcome back to Lustmia SEO.</div>
          )}

          {/* ...rest of your dashboard content... */}
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="app-status">Loading…</div>}>
      <DashboardInner />
    </Suspense>
  );
}
