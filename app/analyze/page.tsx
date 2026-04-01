import type { Metadata } from "next";
import { AnalyzeClient } from "@/components/analyzer/AnalyzeClient";
import { PageTracker } from "@/components/tracking/PageTracker";

export const metadata: Metadata = {
  title: "AI診断",
  description:
    "URLを入力するだけで、WebサイトのUX心理学テクニックをAIが自動検出。認知負荷・説得力・ユーザビリティ・感情デザインの4軸でスコアリング。",
};

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <PageTracker pagePath="/analyze" pageType="analyze" />
      <section className="mb-10">
        <h1 className="text-display text-zinc-50 mb-3">AI診断</h1>
        <p className="text-body-lg text-zinc-400 max-w-2xl">
          URLを入力するだけで、そのWebサイトに使われているUX心理学テクニックをAIが検出します。
        </p>
      </section>

      <AnalyzeClient />
    </div>
  );
}
