import { NextRequest, NextResponse } from "next/server";
import { crawlPage } from "@/lib/crawler";
import { analyzeWithClaude } from "@/lib/claude";
import { supabaseAdmin } from "@/lib/supabase";

// Vercel Serverless Function config: extend timeout for Playwright + Claude API
export const maxDuration = 60; // seconds (requires Vercel Pro for >10s)

const DAILY_LIMIT = 3;

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = new Date();

  // Check existing rate limit entry
  const { data: existing } = await supabaseAdmin
    .from("rate_limits")
    .select("count, reset_at")
    .eq("ip", ip)
    .single();

  if (!existing || new Date(existing.reset_at) < now) {
    // No entry or expired — reset
    await supabaseAdmin.from("rate_limits").upsert({
      ip,
      count: 1,
      reset_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });
    return true;
  }

  if (existing.count >= DAILY_LIMIT) {
    return false;
  }

  // Increment
  await supabaseAdmin
    .from("rate_limits")
    .update({ count: existing.count + 1 })
    .eq("ip", ip);

  return true;
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!await checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "本日の診断回数上限（3回）に達しました。明日またお試しください。" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "有効なURLを入力してください。" },
        { status: 400 }
      );
    }

    // Step 1: Crawl the page
    const crawlResult = await crawlPage(url);

    // Step 2: Analyze with Claude Vision
    const analysis = await analyzeWithClaude(crawlResult, url);

    // Step 3: Upload screenshot to Supabase Storage
    const resultId = crypto.randomUUID();
    const screenshotPath = `${resultId}.png`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("screenshots")
      .upload(screenshotPath, crawlResult.screenshot, {
        contentType: "image/png",
        cacheControl: "604800", // 7 days
      });

    if (uploadError) {
      console.error("Screenshot upload error:", uploadError);
    }

    // Get public URL for the screenshot
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("screenshots")
      .getPublicUrl(screenshotPath);

    const screenshotUrl = publicUrlData?.publicUrl || "";

    // Step 4: Store analysis result in Supabase
    const { error: insertError } = await supabaseAdmin
      .from("analyses")
      .insert({
        id: resultId,
        url,
        analyzed_at: new Date().toISOString(),
        screenshot_path: screenshotPath,
        findings: analysis.findings,
        scores: analysis.scores,
        summary: analysis.summary,
        improvement_hints: analysis.improvementHints,
        ip_address: ip,
      });

    if (insertError) {
      console.error("DB insert error:", insertError);
    }

    // Step 5: Return result
    const screenshotBase64 = crawlResult.screenshot.toString("base64");

    return NextResponse.json({
      id: resultId,
      url,
      analyzedAt: new Date().toISOString(),
      screenshotBase64,
      screenshotUrl,
      ...analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `分析中にエラーが発生しました: ${error.message}`
            : "分析中に予期しないエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
