import React from "react";
export default function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`app-card ${className}`}>{children}</div>;
}
