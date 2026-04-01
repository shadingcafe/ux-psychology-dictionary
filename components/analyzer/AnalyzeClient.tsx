"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/lib/types";
import { UrlInput } from "./UrlInput";
import { ConsentModal } from "./ConsentModal";
import { AnalysisLoading } from "./AnalysisLoading";
import { AnalysisResultView } from "./AnalysisResultView";

type Phase = "input" | "consent" | "loading" | "result" | "error";

export function AnalyzeClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("input");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<
    AnalysisResult & { screenshotBase64?: string }
  >();
  const [error, setError] = useState("");

  const handleSubmit = (inputUrl: string) => {
    setUrl(inputUrl);
    setPhase("consent");
  };

  const handleConsent = async () => {
    setPhase("loading");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "分析に失敗しました");
      }

      setResult(data);
      setPhase("result");

      // Update URL to shareable path (without full navigation)
      if (data.id) {
        window.history.pushState(null, "", `/analyze/${data.id}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました"
      );
      setPhase("error");
    }
  };

  const handleReset = () => {
    setPhase("input");
    setUrl("");
    setResult(undefined);
    setError("");
  };

  return (
    <>
      {phase === "input" && (
        <>
          <UrlInput onSubmit={handleSubmit} />
          <Features />
        </>
      )}

      {phase === "consent" && (
        <ConsentModal
          url={url}
          onConsent={handleConsent}
          onCancel={() => setPhase("input")}
        />
      )}

      {phase === "loading" && <AnalysisLoading url={url} />}

      {phase === "result" && result && (
        <AnalysisResultView result={result} onReset={handleReset} />
      )}

      {phase === "error" && (
        <div className="text-center py-16 space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-body text-red-400">{error}</p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-body-sm"
          >
            もう一度試す
          </button>
        </div>
      )}
    </>
  );
}

function Features() {
  const features = [
    {
      icon: "🔍",
      title: "心理学テクニックの検出",
      description:
        "68件の心理学法則データベースに基づき、サイトに使われているテクニックを自動検出します。",
    },
    {
      icon: "📊",
      title: "4軸スコアリング",
      description:
        "認知負荷・説得力・ユーザビリティ・感情デザインの4軸で、5段階のスコアを算出します。",
    },
    {
      icon: "💡",
      title: "改善のヒント",
      description:
        "検出結果に基づいて、具体的で実行可能なUX改善提案を提示します。",
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-h3 text-zinc-300 mb-6">こんなことがわかります</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-5"
          >
            <span className="text-2xl">{f.icon}</span>
            <h3 className="text-card-title text-zinc-200 mt-3 mb-2">
              {f.title}
            </h3>
            <p className="text-body-sm text-zinc-400">{f.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <p className="text-body-sm text-zinc-500">
          ⚠️ <strong className="text-zinc-400">注意事項</strong>:
          診断にはWebサイトのスクリーンショットを取得します。
          robots.txtで禁止されているサイトや、ログインが必要なページは分析できません。
          1日3回まで利用可能です。
        </p>
      </div>
    </div>
  );
}
