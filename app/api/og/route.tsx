import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "UX心理学図鑑";
  const subtitle = searchParams.get("subtitle") || "そのデザイン、なぜ効くか説明できますか？";
  const type = searchParams.get("type") || "default";

  // Diagnosis result OGP
  if (type === "result") {
    const url = searchParams.get("url") || "";
    const cl = searchParams.get("cl") || "0";
    const pe = searchParams.get("pe") || "0";
    const us = searchParams.get("us") || "0";
    const em = searchParams.get("em") || "0";
    const findings = searchParams.get("findings") || "0";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0a0a0a",
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <span style={{ fontSize: "28px" }}>🧠</span>
            <span style={{ fontSize: "20px", color: "#2dd4bf" }}>UX心理学図鑑 — AI診断結果</span>
          </div>

          {/* URL */}
          <div style={{ fontSize: "28px", color: "#a1a1aa", marginBottom: "40px", display: "flex" }}>
            {url ? new URL(url).hostname : "Web Site"}
          </div>

          {/* Scores */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
            {[
              { label: "認知負荷", score: cl, icon: "🧠" },
              { label: "説得力", score: pe, icon: "💡" },
              { label: "ユーザビリティ", score: us, icon: "⚙️" },
              { label: "感情デザイン", score: em, icon: "❤️" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "16px",
                  padding: "24px 32px",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</span>
                <span style={{ fontSize: "42px", fontWeight: 700, color: Number(item.score) >= 4 ? "#22c55e" : Number(item.score) >= 3 ? "#f59e0b" : "#a1a1aa" }}>
                  {item.score}
                </span>
                <span style={{ fontSize: "14px", color: "#71717a", marginTop: "4px" }}>/5</span>
                <span style={{ fontSize: "16px", color: "#a1a1aa", marginTop: "8px" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
            <span style={{ fontSize: "18px", color: "#2dd4bf" }}>
              {findings}件の心理学テクニックを検出
            </span>
            <span style={{ fontSize: "16px", color: "#52525b" }}>
              ux-psychology-dictionary.vercel.app
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Principle detail OGP
  if (type === "principle") {
    const category = searchParams.get("category") || "";
    const icon = searchParams.get("icon") || "📖";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            padding: "80px",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontSize: "32px" }}>{icon}</span>
            <span style={{ fontSize: "20px", color: "#a1a1aa" }}>{category}</span>
          </div>
          <div style={{ fontSize: "56px", fontWeight: 700, color: "#fafafa", marginBottom: "16px", display: "flex" }}>
            {title}
          </div>
          <div style={{ fontSize: "24px", color: "#a1a1aa", marginBottom: "48px", lineHeight: 1.6, display: "flex" }}>
            {subtitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
            <span style={{ fontSize: "24px" }}>🧠</span>
            <span style={{ fontSize: "20px", color: "#2dd4bf" }}>UX心理学図鑑</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default OGP
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ fontSize: "64px", marginBottom: "24px" }}>🧠</span>
        <div style={{ fontSize: "64px", fontWeight: 700, color: "#fafafa", marginBottom: "16px", display: "flex" }}>
          {title}
        </div>
        <div style={{ fontSize: "28px", color: "#a1a1aa", display: "flex" }}>
          {subtitle}
        </div>
        <div style={{ fontSize: "18px", color: "#2dd4bf", marginTop: "40px", display: "flex" }}>
          68件のUX心理学法則を収録
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
