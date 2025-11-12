"use client";

import { useState } from "react";
import Link from "next/link";

type Plan = "starter" | "pro";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(plan: Plan) {
    setError(null);
    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url as string;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "Something went wrong starting checkout. Please try again."
      );
      setLoadingPlan(null);
    }
  }

  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell" style={{ maxWidth: 1040 }}>
          {/* Header */}
          <header className="app-header">
            <div className="app-brand">
              <div className="app-title-group">
                <div className="app-title">Lustmia SEO</div>
                <div className="app-subtitle">
                  Plans for brands that actually care about search.
                </div>
              </div>
            </div>
            <Link href="/" className="app-badge">
              Use free analyzer
            </Link>
          </header>

          {/* Hero copy */}
          <div style={{ marginTop: 18, marginBottom: 10 }}>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Choose your Lustmia SEO plan
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#9ca3af", maxWidth: 620 }}>
              Start free with basic page checks. Upgrade when you&apos;re ready
              for deeper crawling, performance insights, and GPT-powered SEO
              guidance.
            </p>
          </div>

          {/* Pricing cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 0.95fr",
              gap: 16,
              marginTop: 8,
            }}
          >
            {/* Starter plan */}
            <div className="app-card">
              <div className="app-card-header">
                <div className="app-card-title">Starter</div>
                <div className="app-chip">Most popular</div>
              </div>
              <div className="app-card-body">
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  $59.99 <span style={{ fontSize: "0.8rem" }}>/ month</span>
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                    marginBottom: 10,
                  }}
                >
                  Everything you need to keep a growing store technically
                  healthy.
                </p>
                <ul
                  style={{
                    fontSize: "0.8rem",
                    color: "#d1d5db",
                    listStyle: "none",
                    paddingLeft: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  <li>• Full crawling of key pages</li>
                  <li>• On-page SEO signals (titles, metas, canonicals)</li>
                  <li>• Performance snapshot & Core Web Vitals score</li>
                  <li>• Breadcrumb checks (where available)</li>
                  <li>• Concrete suggestions to improve each page</li>
                  <li>• Clean dashboard with site score & status</li>
                </ul>

                <button
                  className="app-button"
                  onClick={() => handleCheckout("starter")}
                  disabled={loadingPlan !== null}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loadingPlan === "starter"
                    ? "Redirecting to checkout..."
                    : "Get Starter"}
                </button>
              </div>
            </div>

            {/* Pro plan */}
            <div className="app-card">
              <div className="app-card-header">
                <div className="app-card-title">Professional</div>
                <div className="app-chip">For serious brands</div>
              </div>
              <div className="app-card-body">
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  $119.99 <span style={{ fontSize: "0.8rem" }}>/ month</span>
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                    marginBottom: 10,
                  }}
                >
                  Deeper AI help, alerts, and search data for brands that live
                  on SEO.
                </p>
                <ul
                  style={{
                    fontSize: "0.8rem",
                    color: "#d1d5db",
                    listStyle: "none",
                    paddingLeft: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  <li>• Everything in Starter</li>
                  <li>• GPT SEO assistant for titles, descriptions & keywords</li>
                  <li>• Niche-aware meta description suggestions</li>
                  <li>• Guidance on snippets & platform-specific setup</li>
                  <li>• Hooks for GSC / GA4 dashboards (coming online)</li>
                  <li>• Telegram-style alerts as we ship them</li>
                </ul>

                <button
                  className="app-button"
                  onClick={() => handleCheckout("pro")}
                  disabled={loadingPlan !== null}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loadingPlan === "pro"
                    ? "Redirecting to checkout..."
                    : "Get Professional"}
                </button>
              </div>
            </div>
          </div>

          {/* Free tier helper + error */}
          <div style={{ marginTop: 16 }}>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginBottom: 6,
              }}
            >
              Just want to try it first?{" "}
              <Link
                href="/"
                style={{ color: "#a855f7", textDecoration: "underline" }}
              >
                Use the free analyzer
              </Link>{" "}
              with basic page checks.
            </p>
            {error && (
              <div className="app-status app-status-err">
                {error}
              </div>
            )}
            {loadingPlan && !error && (
              <div className="app-status">
                Opening Stripe Checkout for the{" "}
                {loadingPlan === "starter" ? "Starter" : "Professional"} plan…
              </div>
            )}
          </div>

          <footer className="app-footer">
            © {new Date().getFullYear()} Lustmia SEO · Balance is Beauty.
          </footer>
        </section>
      </main>
    </div>
  );
}
