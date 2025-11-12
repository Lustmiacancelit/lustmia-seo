"use client";

import { useState } from "react";
import Link from "next/link";

const SITE_NAME =
  (process.env.NEXT_PUBLIC_SITE_NAME || "Lustmia SEO").replace(/_/g, " ");

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }
      // Send user to Stripe Checkout
      window.location.href = data.url as string;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Something went wrong starting the payment. Try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell">
          {/* Top header / logo area */}
          <header className="app-header">
            <div className="app-brand">
              {/* You can plug your logo Image here if you want */}
              {/* <Image ... className="app-logo" /> */}
              <div className="app-title-group">
                <div className="app-title">{SITE_NAME}</div>
                <div className="app-subtitle">
                  AI SEO scanner for serious brands.
                </div>
              </div>
            </div>
            <div className="app-badge">Beta · Private</div>
          </header>

          {/* Hero */}
          <div className="app-form" style={{ marginTop: 16 }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: 6 }}>
              Turn your SEO into a competitive weapon.
            </h1>
            <p className="app-form-label">
              Lustmia SEO audits titles, meta, technical health and Core Web
              Vitals – then asks GPT to write the next moves for you.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              <Link href="/dashboard" className="app-button">
                <span>Start free</span>
              </Link>

              <button
                type="button"
                onClick={handleProCheckout}
                disabled={loading}
                className="app-button"
                style={{
                  background:
                    "radial-gradient(circle at top left, #22c55e, #15803d)",
                }}
              >
                <span>{loading ? "Opening checkout…" : "Get Pro – $59.99"}</span>
              </button>
            </div>
            {error && (
              <div className="app-status app-status-err" style={{ marginTop: 8 }}>
                {error}
              </div>
            )}
          </div>

          {/* Features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            <div className="app-card">
              <div className="app-card-title">Free plan</div>
              <div className="app-card-body">
                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                  <li>Run quick SEO checks for any URL</li>
                  <li>See titles, descriptions & canonicals</li>
                  <li>Sitemap & robots.txt visibility</li>
                </ul>
              </div>
            </div>

            <div className="app-card">
              <div className="app-card-title">Lustmia Pro – $59.99</div>
              <div className="app-card-body">
                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                  <li>Unlimited SEO scans</li>
                  <li>AI SEO guidance with tailored actions</li>
                  <li>Priority engine & support</li>
                </ul>
              </div>
            </div>

            <div className="app-card">
              <div className="app-card-title">Who it’s for</div>
              <div className="app-card-body">
                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                  <li>DTC / Shopify brands</li>
                  <li>SEO consultants & agencies</li>
                  <li>Founders who hate fluff reports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="app-footer">
            © {new Date().getFullYear()} Lustmia SEO · Balance is Beauty, Rights Reservedto Lustmia LLC.
          </footer>
        </section>
      </main>
    </div>
  );
}
