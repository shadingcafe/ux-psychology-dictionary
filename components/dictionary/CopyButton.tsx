"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded text-zinc-500 hover:text-teal-400 hover:bg-zinc-800 transition-all duration-150"
      title="コピー"
    >
      {copied ? "✓" : "📋"}
    </button>
  );
}
