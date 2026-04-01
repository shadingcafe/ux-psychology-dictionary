"use client";

import type { AnalysisResult } from "@/lib/types";
import { ScoreBars } from "./ScoreBars";
import { FindingCard } from "./FindingCard";
import { GoodpatchCTA } from "./GoodpatchCTA";

interface Props {
  result: AnalysisResult;
}

export function SharedResultClient({ result }: Props) {
  return (
    <div className="space-y-8">
      {/* Header with screenshot */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {result.screenshotUrl && (
          <div className="relative">
            <img
              src={result.screenshotUrl}
              alt="分析対象サイト"
              className="w-full h-auto max-h-80 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900" />
          </div>
        )}
        <div className="p-6">
          <p className="text-caption text-zinc-500 mb-1">分析対象</p>
          <p className="text-body text-teal-400 break-all mb-4">
            {result.url}
          </p>
          <p className="text-caption text-zinc-600">
            分析日時:{" "}
            {new Date(result.analyzedAt).toLocaleString("ja-JP")}
          </p>
        </div>
      </div>

      {/* Scores */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-h3 text-zinc-50 mb-6">スコア</h2>
        <ScoreBars scores={result.scores} />
      </div>

      {/* Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-h3 text-zinc-50 mb-4">AI分析サマリー</h2>
        <p className="text-body text-zinc-300 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Findings */}
      <div>
        <h2 className="text-h3 text-zinc-50 mb-4">
          検出された心理学テクニック
          <span className="text-body-sm text-zinc-500 ml-2">
            {result.findings.length}件
          </span>
        </h2>
        <div className="space-y-3">
          {result.findings.map((finding, i) => (
            <FindingCard key={i} finding={finding} />
          ))}
        </div>
      </div>

      {/* Improvement hints */}
      {result.improvementHints.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-h3 text-zinc-50 mb-4">改善のヒント</h2>
          <ul className="space-y-3">
            {result.improvementHints.map((hint, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-body-sm text-zinc-300"
              >
                <span className="text-teal-400 mt-0.5 shrink-0">💡</span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            const text = `${result.url} のUX心理学診断結果\n認知負荷: ${result.scores.cognitiveLoad}/5\n説得力: ${result.scores.persuasion}/5\nユーザビリティ: ${result.scores.usability}/5\n感情デザイン: ${result.scores.emotionalDesign}/5\n\n#UX心理学図鑑\n${window.location.href}`;
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
              "_blank"
            );
          }}
          className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-body-sm"
        >
          𝕏 で共有
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-body-sm"
        >
          🔗 リンクをコピー
        </button>
      </div>

      {/* Goodpatch CTA */}
      <GoodpatchCTA />

      {/* CTA to analyze */}
      <div className="text-center pt-4">
        <a
          href="/analyze"
          className="inline-flex px-6 py-3 bg-teal-400 text-zinc-950 font-medium rounded-lg text-body-sm transition-all hover:bg-teal-300"
        >
          自分のサイトも診断する
        </a>
      </div>
    </div>
  );
}
