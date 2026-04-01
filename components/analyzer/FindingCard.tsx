"use client";

import Link from "next/link";

interface Finding {
  principleId: string;
  confidence: "high" | "medium" | "low";
  location: string;
  explanation: string;
}

interface Props {
  finding: Finding;
}

const confidenceConfig = {
  high: { label: "高", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  medium: { label: "中", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  low: { label: "低", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30" },
};

export function FindingCard({ finding }: Props) {
  const conf = confidenceConfig[finding.confidence];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-card-title text-zinc-100">
            {finding.principleId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
          <p className="text-caption text-zinc-500 mt-0.5">
            📍 {finding.location}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption border shrink-0 ${conf.color}`}
        >
          確信度: {conf.label}
        </span>
      </div>

      <p className="text-body-sm text-zinc-300 mb-3">{finding.explanation}</p>

      <Link
        href={`/principles/${finding.principleId}`}
        className="inline-flex items-center gap-1 text-caption text-teal-400 hover:text-teal-300 transition-colors"
      >
        図鑑で詳しく見る →
      </Link>
    </div>
  );
}
