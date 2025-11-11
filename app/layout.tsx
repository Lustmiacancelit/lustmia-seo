import type { Metadata } from "next";
import "./globals.css";

const siteName =
  process.env.NEXT_PUBLIC_SITE_NAME?.replace(/_/g, " ") || "Lustmia SEO";

export const metadata: Metadata = {
  title: `${siteName} – AI SEO Analyzer`,
  description:
    "Lustmia SEO is an AI-powered tool to analyze, audit, and improve your website’s search performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
