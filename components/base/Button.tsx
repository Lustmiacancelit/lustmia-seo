"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button({ loading, variant = "primary", className = "", children, ...rest }: Props) {
  const base =
    "app-button " + (variant === "secondary" ? "app-button--secondary" : "app-button--primary");
  return (
    <button className={`${base} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? <>⏳</> : null}
      {children}
    </button>
  );
}
