"use client";
import { useState } from "react";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setResult("Analyzing...");
    const response = await fetch("/api/analyze?url=" + encodeURIComponent(url));
    const data = await response.json();
    setResult(data.message);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        SEO Dashboard
      </h1>
      <p style={{ maxWidth: "600px", marginBottom: "2rem", color: "#bbb" }}>
        Enter a website URL to check its SEO health.
      </p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.example.com"
        style={{
          width: "80%",
          maxWidth: "400px",
          padding: "0.75rem",
          borderRadius: "6px",
          border: "1px solid #333",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      />
      <button
        onClick={handleAnalyze}
        style={{
          background: "#fff",
          color: "#000",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: "2rem", color: "#0f0" }}>
          <p>{result}</p>
        </div>
      )}
    </main>
  );
}
