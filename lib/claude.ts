import Anthropic from "@anthropic-ai/sdk";
import principlesData from "@/data/principles.json";
import type { CrawlResult } from "./crawler";

const client = new Anthropic();

interface AnalysisOutput {
  findings: {
    principleId: string;
    confidence: "high" | "medium" | "low";
    location: string;
    explanation: string;
  }[];
  scores: {
    cognitiveLoad: number;
    persuasion: number;
    usability: number;
    emotionalDesign: number;
  };
  summary: string;
  improvementHints: string[];
}

export async function analyzeWithClaude(
  crawlResult: CrawlResult,
  url: string
): Promise<AnalysisOutput> {
  const principlesList = (principlesData as { id: string; name: { ja: string; en: string }; detectionHints: string[] }[])
    .map(
      (p) =>
        `- ${p.id}: ${p.name.ja} (${p.name.en}) — 検出キー: ${p.detectionHints.join(", ")}`
    )
    .join("\n");

  const domContext = `
サイトタイトル: ${crawlResult.title}
説明: ${crawlResult.description}
ナビ項目: ${crawlResult.domSummary.navItems.join(", ")}
CTA/ボタン: ${crawlResult.domSummary.ctaButtons.join(", ")}
見出し: ${crawlResult.domSummary.headings.join(", ")}
フォーム入力数: ${crawlResult.domSummary.formFields}
画像数: ${crawlResult.domSummary.imageCount}
リンク数: ${crawlResult.domSummary.linkCount}
  `.trim();

  const screenshotBase64 = crawlResult.screenshot.toString("base64");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: screenshotBase64,
            },
          },
          {
            type: "text",
            text: `あなたはUX心理学の専門家です。
以下のWebサイト（${url}）のスクリーンショットとDOM構造を分析し、使われているUX心理学テクニックを特定してください。

## DOM構造の要約
${domContext}

## 判定対象の心理学原則（IDと検出キーワード）
${principlesList}

## 出力（JSON形式のみ、マークダウン不要）
以下のJSON形式で出力してください。JSON以外のテキストは含めないでください。

{
  "findings": [
    {
      "principleId": "hicks-law",
      "confidence": "high",
      "location": "メインナビゲーション",
      "explanation": "ナビゲーション項目が5つに絞られており..."
    }
  ],
  "scores": {
    "cognitiveLoad": 4,
    "persuasion": 3,
    "usability": 4,
    "emotionalDesign": 2
  },
  "summary": "全体的な分析サマリー（3-5文、日本語）",
  "improvementHints": ["改善提案1", "改善提案2", "改善提案3"]
}

## ルール
- findingsは3〜8件程度（多すぎず少なすぎず）
- confidenceはhigh/medium/lowの3段階
- scoresは1〜5の整数（5が最良）
- locationはスクリーンショット上の具体的な場所
- explanationは日本語で2-3文
- summaryは日本語で3-5文
- improvementHintsは2-3件、具体的で実行可能な提案`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(jsonStr) as AnalysisOutput;
}
