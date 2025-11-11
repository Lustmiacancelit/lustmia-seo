import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch {
    return null;
  }
}

function extractMeta(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
  );
  const description = descMatch ? descMatch[1].trim() : null;

  const canonicalMatch = html.match(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i
  );
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

  return { title, description, canonical };
}

async function checkHeadStatus(origin: string, path: string) {
  try {
    const res = await fetch(origin + path, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

async function getPageSpeedScore(url: string) {
  if (!PAGESPEED_API_KEY) return null;
  try {
    const api = new URL(
      "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    );
    api.searchParams.set("url", url);
    api.searchParams.set("key", PAGESPEED_API_KEY);
    api.searchParams.set("strategy", "mobile");

    const res = await fetch(api.toString());
    if (!res.ok) return null;
    const json = await res.json();
    const score =
      json?.lighthouseResult?.categories?.performance?.score ?? null;
    return score != null ? score * 100 : null;
  } catch {
    return null;
  }
}

async function getAiAdvice(payload: {
  url: string;
  title: string | null;
  description: string | null;
  canonical: string | null;
  performanceScore: number | null;
  sitemapOk: boolean | null;
  robotsOk: boolean | null;
}) {
  if (!OPENAI_API_KEY) return null;

  const prompt = `
You are an experienced technical SEO consultant.

Given this website snapshot, provide 5–7 concise, high-impact SEO recommendations.
Prioritize click-through rate, crawlability, indexation, and Core Web Vitals.
Write in short bullet points, friendly but direct.

Snapshot:
- URL: ${payload.url}
- Title: ${payload.title || "N/A"}
- Description: ${payload.description || "N/A"}
- Canonical: ${payload.canonical || "N/A"}
- Performance score (0-100): ${
    payload.performanceScore != null ? payload.performanceScore : "N/A"
  }
- Sitemap OK: ${payload.sitemapOk}
- Robots.txt OK: ${payload.robotsOk}
`.trim();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert SEO assistant specializing in clear, actionable recommendations.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 450,
        temperature: 0.4,
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const text =
      json?.choices?.[0]?.message?.content?.trim() ||
      "No AI advice generated.";
    return text;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = (body?.url as string | undefined)?.trim();
    if (!rawUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing URL in request body." },
        { status: 400 }
      );
    }

    let normalizedUrl = rawUrl;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let origin: string;
    try {
      origin = new URL(normalizedUrl).origin;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid URL format." },
        { status: 400 }
      );
    }

    const html = await safeFetch(normalizedUrl);
    if (!html) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not fetch the page HTML. The site may block bots or be temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const { title, description, canonical } = extractMeta(html);

    // Basic technical checks
    const [sitemapOk, robotsOk, performanceScore] = await Promise.all([
      checkHeadStatus(origin, "/sitemap.xml"),
      checkHeadStatus(origin, "/robots.txt"),
      getPageSpeedScore(normalizedUrl),
    ]);

    const aiAdvice = await getAiAdvice({
      url: normalizedUrl,
      title,
      description,
      canonical,
      performanceScore: performanceScore ?? null,
      sitemapOk,
      robotsOk,
    });

    return NextResponse.json({
      ok: true,
      data: {
        url: rawUrl,
        normalizedUrl,
        title,
        description,
        canonical,
        sitemapOk,
        robotsOk,
        core: {
          performanceScore: performanceScore,
        },
        aiAdvice,
      },
    });
  } catch (err) {
    console.error("Analyze route error:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unexpected error in Lustmia SEO engine. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
