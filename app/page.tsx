import principlesData from "@/data/principles.json";
import { categories } from "@/data/categories";
import type { Principle } from "@/lib/types";
import { DictionaryClient } from "@/components/dictionary/DictionaryClient";
import { PageTracker } from "@/components/tracking/PageTracker";

const principles = principlesData as Principle[];

export default function DictionaryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <PageTracker pagePath="/" pageType="home" />
      {/* Hero section */}
      <section className="mb-10">
        <h1 className="text-display text-zinc-50 mb-3">
          UX心理学図鑑
        </h1>
        <p className="text-body-lg text-zinc-400 max-w-2xl">
          そのデザイン、なぜ効くか説明できますか？
        </p>
        <p className="text-body-sm text-zinc-500 mt-2">
          {principles.length}件の心理学法則を収録
        </p>
      </section>

      <DictionaryClient
        principles={principles}
        categories={categories}
      />
    </div>
  );
}
