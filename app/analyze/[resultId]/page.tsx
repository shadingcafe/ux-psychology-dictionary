import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { SharedResultClient } from "@/components/analyzer/SharedResultClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getAnalysis(resultId: string) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", resultId)
    .single();

  if (error || !data) return null;

  // Get screenshot public URL
  const { data: publicUrlData } = supabase.storage
    .from("screenshots")
    .getPublicUrl(data.screenshot_path || "");

  return {
    id: data.id,
    url: data.url,
    analyzedAt: data.analyzed_at,
    screenshotUrl: publicUrlData?.publicUrl || "",
    findings: data.findings,
    scores: data.scores,
    summary: data.summary,
    improvementHints: data.improvement_hints,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resultId: string }>;
}): Promise<Metadata> {
  const { resultId } = await params;
  const analysis = await getAnalysis(resultId);

  if (!analysis) {
    return { title: "診断結果が見つかりません" };
  }

  const avgScore = Math.round(
    (analysis.scores.cognitiveLoad +
      analysis.scores.persuasion +
      analysis.scores.usability +
      analysis.scores.emotionalDesign) /
      4 * 10
  ) / 10;

  const ogParams = new URLSearchParams({
    type: "result",
    url: analysis.url,
    cl: String(analysis.scores.cognitiveLoad),
    pe: String(analysis.scores.persuasion),
    us: String(analysis.scores.usability),
    em: String(analysis.scores.emotionalDesign),
    findings: String(analysis.findings.length),
  });

  return {
    title: `${new URL(analysis.url).hostname} の診断結果`,
    description: analysis.summary?.slice(0, 120) || "UX心理学テクニックのAI診断結果",
    openGraph: {
      title: `UX診断結果: ${new URL(analysis.url).hostname} — 平均スコア ${avgScore}/5`,
      description: analysis.summary?.slice(0, 120),
      images: [{ url: `/api/og?${ogParams.toString()}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `UX診断結果: ${new URL(analysis.url).hostname} — 平均スコア ${avgScore}/5`,
      images: [`/api/og?${ogParams.toString()}`],
    },
  };
}

export default async function SharedResultPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const analysis = await getAnalysis(resultId);

  if (!analysis) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-h2 text-zinc-50 mb-3">
          診断結果が見つかりません
        </h1>
        <p className="text-body text-zinc-400 mb-8">
          この診断結果は存在しないか、期限が切れている可能性があります。
        </p>
        <a
          href="/analyze"
          className="inline-flex px-6 py-3 bg-teal-400 text-zinc-950 font-medium rounded-lg text-body-sm transition-all hover:bg-teal-300"
        >
          新しく診断する
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-10">
        <p className="text-body-sm text-teal-400 mb-2">共有された診断結果</p>
        <h1 className="text-display text-zinc-50 mb-3">AI診断結果</h1>
        <p className="text-body-lg text-zinc-400 max-w-2xl">
          {new URL(analysis.url).hostname} のUX心理学テクニック分析
        </p>
      </section>

      <SharedResultClient result={analysis} />
    </div>
  );
}
