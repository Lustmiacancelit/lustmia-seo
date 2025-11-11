"use client";

import { useState } from "react";
import Image from "next/image";

type CoreWebVitals = {
  performanceScore?: number | null;
};

type AnalyzeResult = {
  url: string;
  normalizedUrl: string;
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  sitemapOk?: boolean | null;
  robotsOk?: boolean | null;
  core?: CoreWebVitals;
  aiAdvice?: string | null;
};

const SITE_NAME =
  (process.env.NEXT_PUBLIC_SITE_NAME || "Lustmia SEO").replace(/_/g, " ");

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL to analyze.");
      return;
    }

    setLoading(true);
    setStatus("Contacting Lustmia SEO engine...");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unexpected error from server.");
      }

      setResult(data.data as AnalyzeResult);
      setStatus("Analysis complete. Scroll the cards for details.");
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong while analyzing. Please try another URL."
      );
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      !loading && handleAnalyze();
    }
  };

  return (
    <div className="app-root">
      <main className="app-main">
        <section className="app-shell">
          {/* Header / brand */}
          <header className="app-header">
            <div className="app-brand">
              <Image
                src="/lustmia-logo.png"
                alt="Lustmia logo"
                width={120}
                height={32}
                priority
              />
              <div className="app-title-group">
                <div className="app-title">{SITE_NAME}</div>
                <div className="app-subtitle">
                  AI SEO scanner for serious brands.
                </div>
              </div>
            </div>
            <div className="app-badge">Beta · Private</div>
          </header>

          {/* Input form */}
          <div className="app-form">
            <div className="app-form-label">
              Paste a URL and let Lustmia audit your SEO surface.
            </div>
            <div className="app-form-row">
              <input
                className="app-input"
                placeholder="https://www.example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className="app-button"
                onClick={handleAnalyze}
                disabled={loading}
              >
                <span>{loading ? "Analyzing..." : "Run SEO Analysis"}</span>
                <span className="spark">⚡</span>
              </button>
            </div>
            {status && !error && <div className="app-status">{status}</div>}
            {error && <div className="app-status app-status-err">{error}</div>}
          </div>

          {/* Results */}
          {result && (
            <div className="app-results">
              {/* Left column: On-page + technical */}
              <div className="app-card">
                <div className="app-card-header">
                  <div className="app-card-title">On-page & Technical</div>
                  <div className="app-chip">Snapshot</div>
                </div>
                <div className="app-card-body">
                  <div className="app-kv">
                    <strong>URL:</strong> {result.normalizedUrl}
                  </div>
                  {result.title && (
                    <div className="app-kv" style={{ marginTop: 6 }}>
                      <strong>Title:</strong> {result.title}
                    </div>
                  )}
                  {result.description && (
                    <div className="app-kv">
                      <strong>Description:</strong> {result.description}
                    </div>
                  )}
                  {result.canonical && (
                    <div className="app-kv">
                      <strong>Canonical:</strong> {result.canonical}
                    </div>
                  )}

                  <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
                    <div className="app-kv">
                      <strong>Sitemap:</strong>{" "}
                      {result.sitemapOk === true && (
                        <span className="app-pass">Detected</span>
                      )}
                      {result.sitemapOk === false && (
                        <span className="app-fail">Missing / not reachable</span>
                      )}
                      {result.sitemapOk === null && (
                        <span className="app-muted">Not checked</span>
                      )}
                    </div>
                    <div className="app-kv">
                      <strong>robots.txt:</strong>{" "}
                      {result.robotsOk === true && (
                        <span className="app-pass">OK</span>
                      )}
                      {result.robotsOk === false && (
                        <span className="app-fail">
                          Missing / not reachable
                        </span>
                      )}
                      {result.robotsOk === null && (
                        <span className="app-muted">Not checked</span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <strong className="app-kv">Core Web Vitals</strong>
                    <div className="app-kv">
                      Performance score:{" "}
                      {result.core?.performanceScore != null ? (
                        <span
                          className={
                            (result.core.performanceScore ?? 0) >= 80
                              ? "app-pass"
                              : (result.core.performanceScore ?? 0) >= 50
                              ? "app-muted"
                              : "app-fail"
                          }
                        >
                          {Math.round(result.core.performanceScore ?? 0)}
                          /100
                        </span>
                      ) : (
                        <span className="app-muted">Not available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: AI advice */}
              <div className="app-card">
                <div className="app-card-header">
                  <div className="app-card-title">AI SEO Guidance</div>
                  <div className="app-chip">Lustmia · GPT</div>
                </div>
                <div className="app-ai-body">
                  {result.aiAdvice ? (
                    <>{result.aiAdvice}</>
                  ) : (
                    <span className="app-muted">
                      No AI advice generated. Check your API key or try again
                      in a moment.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="app-footer">
            © {new Date().getFullYear()} Lustmia SEO · Balance is Beauty.
          </footer>
        </section>
      </main>
    </div>
  );
}
