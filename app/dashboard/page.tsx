"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const hasSession = !!searchParams.get("session_id");

  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell" style={{ maxWidth: 900 }}>
          <header className="app-header">
            <div className="app-brand">
              <div className="app-title-group">
                <div className="app-title">Lustmia SEO</div>
                <div className="app-subtitle">
                  Private beta dashboard.
                </div>
              </div>
            </div>
            <Link href="/" className="app-badge">
              Open analyzer
            </Link>
          </header>

          <div style={{ marginTop: 18 }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {hasSession ? "You’re in. Welcome ✨" : "Lustmia SEO dashboard"}
            </h1>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#9ca3af",
                maxWidth: 600,
                marginBottom: 14,
              }}
            >
              {hasSession
                ? "Your Stripe checkout just completed. Your subscription will appear in your Stripe dashboard, and you can already start using Lustmia SEO."
                : "If you already subscribed, you can go straight to the analyzer and start scanning your URLs."}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <Link href="/" className="app-button" style={{ width: "fit-content" }}>
                Start analyzing pages
              </Link>
              <Link
                href="/pricing"
                style={{
                  fontSize: "0.8rem",
                  color: "#a855f7",
                  textDecoration: "underline",
                }}
              >
                View or change your plan
              </Link>
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                color: "#6b7280",
                maxWidth: 620,
              }}
            >
              Over time this dashboard will grow to include: crawl history, site
              scores over time, Google Search Console & GA4 snapshots, and
              Telegram alerts configuration.
            </p>
          </div>

          <footer className="app-footer">
            © {new Date().getFullYear()} Lustmia SEO · Balance is Beauty.
          </footer>
        </section>
      </main>
    </div>
  );
}
