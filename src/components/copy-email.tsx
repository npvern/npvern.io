"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { site } from "@/content/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center gap-2 border border-ink bg-ink px-4 font-mono text-[0.9rem] text-base transition-transform active:translate-y-[1px]"
    >
      {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      <span aria-live="polite">{copied ? "Email copied" : "Copy email"}</span>
    </button>
  );
}
