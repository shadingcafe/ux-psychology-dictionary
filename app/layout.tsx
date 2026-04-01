import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UX心理学図鑑",
    template: "%s | UX心理学図鑑",
  },
  description:
    "そのデザイン、なぜ効くか説明できますか？ 68件のUX心理学法則を「名称×解説×UI実例×AIプロンプト例×権威リファレンス」で収録。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ux-psychology-dictionary.vercel.app"),
  openGraph: {
    title: "UX心理学図鑑",
    description: "そのデザイン、なぜ効くか説明できますか？",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${zenKakuGothicNew.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="relative noise-texture border-b border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="text-teal-400 text-xl">🧠</span>
            <div>
              <span className="text-body-sm font-medium text-zinc-50 tracking-tight">
                UX心理学図鑑
              </span>
            </div>
          </a>
          <nav className="flex items-center gap-1">
            <a
              href="/"
              className="px-3 py-2 text-body-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-150"
            >
              📖 図鑑
            </a>
            <a
              href="/analyze"
              className="px-3 py-2 text-body-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-150"
            >
              🔍 AI診断
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-caption text-zinc-500">
            UX心理学図鑑 — 68 principles of UX psychology
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://feedback.goodpatch.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-caption text-zinc-500 hover:text-teal-400 transition-colors duration-150"
            >
              Goodpatch UI/UX FB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
