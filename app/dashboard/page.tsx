"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SessionInfo = {
  id: string;
  status: string;
  payment_status: string;
  customer_email: string | null;
  planName: string;
  amount: number | null; // cents
  currency: string;      // e.g. USD
  created: number;       // unix
};

function formatAmount(amount: number | null, currency: string) {
  if (amount == null) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  }).format(amount / 100);
}

function DashboardInner() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  const [loading, setLoading] = useState<boolean>(!!sessionId);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!sessionId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/session?session_id=${encodeURIComponent(sessionId)}`);
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json?.error || "Failed to load session.");
        }
        if (mounted) setSession(json.session as SessionInfo);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Unable to load session.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell">
          <header className="app-header">
            <div className="app-title">Dashboard</div>
            <div className="app-badge">Beta · Private</div>
          </header>

          {!sessionId && (
            <div className="app-status">
              Welcome back to Lustmia SEO. Paste a URL on the home page to analyze, or upgrade in <a href="/pricing">Pricing</a>.
            </div>
          )}

          {sessionId && (
            <>
              {loading && <div className="app-status">Confirming your payment…</div>}
              {error && <div className="app-status app-status-err">⚠ {error}</div>}

              {session && (
                <div className="app-card" style={{ marginTop: 8 }}>
                  <div className="app-card-header">
                    <div className="app-card-title">Payment Confirmed</div>
                    <div className="app-chip">
                      {session.payment_status === "paid" ? "Paid" : session.payment_status}
                    </div>
                  </div>
                  <div className="app-card-body">
                    <div className="app-kv"><strong>Plan:</strong> {session.planName}</div>
                    <div className="app-kv"><strong>Amount:</strong> {formatAmount(session.amount, session.currency)}</div>
                    <div className="app-kv"><strong>Email:</strong> {session.customer_email ?? "—"}</div>
                    <div className="app-kv"><strong>Session ID:</strong> {session.id}</div>
                    <div className="app-kv"><strong>Status:</strong> {session.status}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Your existing dashboard content/cards can go here */}
          <footer className="app-footer" style={{ marginTop: 16 }}>
            © {new Date().getFullYear()} Lustmia SEO · Balance is Beauty.
          </footer>
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
