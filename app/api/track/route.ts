import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pagePath, pageType, principleId, category } = body;

    if (!pagePath || !pageType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    await supabaseAdmin.from("page_views").insert({
      page_path: pagePath,
      page_type: pageType,
      principle_id: principleId || null,
      category: category || null,
      referrer,
      user_agent: userAgent,
      ip_address: ip,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Track failed" }, { status: 500 });
  }
}
