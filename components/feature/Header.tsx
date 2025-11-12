import Image from "next/image";

export default function Header() {
  const SITE_NAME = (process.env.NEXT_PUBLIC_SITE_NAME || "Lustmia SEO").replace(/_/g, " ");
  return (
    <header className="app-header" style={{ paddingTop: 6 }}>
      <div className="app-brand">
        <Image src="/lustmia-logo.png" alt="Lustmia" width={120} height={32} className="app-logo" />
        <div className="app-title-group">
          <div className="app-title">{SITE_NAME}</div>
          <div className="app-subtitle">AI SEO scanner for serious brands.</div>
        </div>
      </div>
      <div className="app-badge">Beta · Private</div>
    </header>
  );
}
