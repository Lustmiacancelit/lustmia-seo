"use client";
import { useState } from "react";
import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import Button from "@/components/base/Button";
import Card from "@/components/base/Card";
import Input from "@/components/base/Input";

type AnalyzeResult = {
  normalizedUrl?: string;
};

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // FREE ANALYSIS → your existing API
  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setStatus("Contacting Lustmia SEO engine...");
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) throw new Error(data?.error || "Failed");
      setStatus(`Analysis complete for ${data?.data?.normalizedUrl || url}.`);
    } catch (e: any) {
      setStatus(e?.message || "Something went wrong. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // STRIPE CHECKOUT (Starter/Pro)
  const startCheckout = async (plan: "starter" | "pro") => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (!res.ok || !json?.url) throw new Error(json?.error || "Unable to start checkout.");
      window.location.href = json.url; // go to Stripe Hosted Checkout
    } catch (err: any) {
      alert(err?.message || "Unable to start checkout. Please try again.");
    }
  };

  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell">
          {/* Header */}
          <Header />

          {/* Hero */}
          <section style={{ marginTop: 8 }}>
            <div className="app-card" style={{ padding: 20 }}>
              <h1 className="app-title" style={{ fontSize: "2rem" }}>
                Boost Your Website’s <span style={{ color: "#60a5fa" }}>SEO Rankings</span>
              </h1>
              <p className="app-card-body" style={{ marginTop: 8 }}>
                Get comprehensive SEO analysis, performance insights, and AI-powered optimization recommendations.
                Transform your website’s search visibility with Lustmia SEO.
              </p>

              {/* Quick Analysis */}
              <div className="app-card" style={{ marginTop: 14 }}>
                <div className="app-card-title">Free SEO Analysis</div>
                <div className="app-form-row" style={{ marginTop: 10 }}>
                  <Input
                    type="url"
                    placeholder="Enter your website URL…"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAnalyze} loading={isAnalyzing}>
                    {isAnalyzing ? "Analyzing…" : "Analyze"}
                  </Button>
                </div>
                {status ? <div className="app-status" style={{ marginTop: 8 }}>{status}</div> : null}
              </div>

              {/* CTA */}
              <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                <Button onClick={() => (window.location.href = "/pricing")}>Get Started Free</Button>
                <Button variant="secondary" onClick={() => alert("Demo coming soon!")}>Watch Demo</Button>
              </div>
            </div>
          </section>

          {/* Features */}
          <section style={{ marginTop: 18 }}>
            <div className="app-card">
              <div className="app-card-title">Comprehensive SEO Analysis</div>
              <p className="app-card-body" style={{ marginTop: 6 }}>
                Our AI-powered platform provides deep insights into your website’s performance,
                helping you identify opportunities and optimize for better search rankings.
              </p>

              <div className="app-results" style={{ marginTop: 10 }}>
                <Card>
                  <div className="app-card-title">Technical SEO Audit</div>
                  <p className="app-card-body">
                    Crawlability, indexability, and site structure checks.
                  </p>
                </Card>
                <Card>
                  <div className="app-card-title">Performance Monitoring</div>
                  <p className="app-card-body">
                    Page speed and Core Web Vitals that affect rankings.
                  </p>
                </Card>
                <Card>
                  <div className="app-card-title">AI Recommendations</div>
                  <p className="app-card-body">
                    Personalized suggestions based on best practices.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section style={{ marginTop: 18 }}>
            <div className="app-card">
              <div className="app-card-title">Simple, Transparent Pricing</div>
              <div className="app-results" style={{ marginTop: 10 }}>
                {/* Free */}
                <Card>
                  <h3 className="app-title">Free Analysis — $0</h3>
                  <ul className="app-card-body" style={{ marginTop: 8, lineHeight: 1.7 }}>
                    <li>Basic SEO health check</li>
                    <li>Page speed analysis</li>
                    <li>5 pages analyzed</li>
                    <li>Basic recommendations</li>
                  </ul>
                  <Button variant="secondary" onClick={() => (window.location.href = "/")}>
                    Start Free Analysis
                  </Button>
                </Card>

                {/* Starter $59.99 */}
                <Card>
                  <h3 className="app-title">Starter — $59.99/mo</h3>
                  <ul className="app-card-body" style={{ marginTop: 8, lineHeight: 1.7 }}>
                    <li>Crawling aspects</li>
                    <li>SEO information & Performance</li>
                    <li>Breadcrumb checks</li>
                    <li>Actionable SEO suggestions</li>
                    <li>Dashboard & site score</li>
                  </ul>
                  <Button onClick={() => startCheckout("starter")}>Choose Starter</Button>
                </Card>

                {/* Professional $119.99 */}
                <Card>
                  <h3 className="app-title">Professional — $119.99/mo</h3>
                  <ul className="app-card-body" style={{ marginTop: 8, lineHeight: 1.7 }}>
                    <li>Everything in Starter</li>
                    <li>GPT SEO guidance (titles, descriptions, keywords)</li>
                    <li>Telegram alerts on crawl/index events</li>
                    <li>Google Search Console dashboard</li>
                    <li>GA4 charts in dashboard</li>
                    <li>Platform-specific snippet guidance</li>
                  </ul>
                  <Button onClick={() => startCheckout("pro")}>Choose Professional</Button>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA band */}
          <section style={{ marginTop: 18 }}>
            <div className="app-card" style={{ textAlign: "center", padding: 24 }}>
              <h2 className="app-title" style={{ fontSize: "1.6rem" }}>
                Ready to Boost Your SEO Rankings?
              </h2>
              <p className="app-card-body" style={{ marginTop: 8 }}>
                Join websites already using Lustmia SEO to increase search visibility and organic traffic.
              </p>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => (window.location.href = "/")}>Start Free Analysis</Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </section>
      </main>
    </div>
  );
}
