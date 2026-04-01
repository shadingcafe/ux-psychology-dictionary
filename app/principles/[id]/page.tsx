import { notFound } from "next/navigation";
import Link from "next/link";
import principlesData from "@/data/principles.json";
import { categories } from "@/data/categories";
import { CopyButton } from "@/components/dictionary/CopyButton";
import { PageTracker } from "@/components/tracking/PageTracker";

import type { Principle } from "@/lib/types";
import type { Metadata } from "next";

const principles = principlesData as Principle[];

export async function generateStaticParams() {
  return principles.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const principle = principles.find((p) => p.id === id);
  if (!principle) return { title: "Not Found" };
  return {
    title: `${principle.name.ja} (${principle.name.en})`,
    description: principle.summary,
  };
}

export default async function PrincipleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const principle = principles.find((p) => p.id === id);
  if (!principle) notFound();

  const category = categories.find((c) => c.id === principle.category);
  const related = principle.relatedPrinciples
    .map((rid) => principles.find((p) => p.id === rid))
    .filter(Boolean) as Principle[];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <PageTracker pagePath={`/principles/${id}`} pageType="principle" principleId={id} category={principle.category} />
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-body-sm text-zinc-500 hover:text-teal-400 transition-colors duration-150 mb-6"
      >
        ← 図鑑一覧に戻る
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{category?.icon}</span>
          <span className="text-body-sm text-zinc-500">{category?.nameJa}</span>
        </div>
        <h1 className="text-h1 text-zinc-50 mb-1">{principle.name.ja}</h1>
        <p className="text-body font-[family-name:var(--font-inter)] text-zinc-500 mb-4">
          {principle.name.en}
        </p>
        <p className="text-body-lg text-zinc-300">{principle.summary}</p>
      </header>

      {/* Origin */}
      <section className="mb-8 py-4 px-4 rounded-lg bg-zinc-900 border border-zinc-800">
        <p className="text-body-sm text-zinc-400">
          <span className="text-zinc-500">提唱者:</span>{" "}
          {principle.origin.researcher} ({principle.origin.year})
        </p>
        {principle.origin.paper && (
          <p className="text-caption text-zinc-500 mt-1 font-[family-name:var(--font-jetbrains-mono)]">
            {principle.origin.paper}
          </p>
        )}
      </section>

      {/* Description */}
      <section className="mb-10">
        <h2 className="text-h2 text-zinc-100 mb-4">詳しい解説</h2>
        <p className="text-body text-zinc-400 leading-[1.7]">
          {principle.description}
        </p>
      </section>

      {/* UI Examples */}
      <section className="mb-10">
        <h2 className="text-h2 text-zinc-100 mb-4">UIへの適用例</h2>
        <div className="space-y-3">
          {principle.uiExamples.map((ex, i) => (
            <div
              key={i}
              className={`rounded-lg border py-4 px-4 ${
                ex.type === "good"
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">
                  {ex.type === "good" ? "✅" : "❌"}
                </span>
                <span className="text-body-sm font-medium text-zinc-200">
                  {ex.title}
                </span>
              </div>
              <p className="text-body-sm text-zinc-400">{ex.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Prompt Tip */}
      <section className="mb-10">
        <h2 className="text-h2 text-zinc-100 mb-4">AIへの指示例</h2>
        <div className="relative rounded-lg bg-zinc-900 border border-zinc-800 py-4 px-4">
          <p className="text-body-sm text-zinc-300 font-[family-name:var(--font-jetbrains-mono)] leading-relaxed">
            {principle.aiPromptTip}
          </p>
          <CopyButton text={principle.aiPromptTip} />
        </div>
      </section>

      {/* References */}
      {hasReferences(principle) && (
        <section className="mb-10">
          <h2 className="text-h2 text-zinc-100 mb-4">参考文献</h2>
          <div className="space-y-3">
            {principle.references.lawsOfUx && (
              <RefLink
                label="Laws of UX"
                url={principle.references.lawsOfUx}
              />
            )}
            {principle.references.nnGroup.map((ref, i) => (
              <RefLink
                key={i}
                label={`NNG ${ref.type === "video" ? "📹" : "📄"}`}
                title={ref.title}
                url={ref.url}
              />
            ))}
            {principle.references.hcdNet.map((ref, i) => (
              <RefLink
                key={i}
                label="HCD-Net"
                title={ref.title}
                url={ref.url}
              />
            ))}
            {principle.references.academicPapers.map((ref, i) => (
              <div key={i} className="text-body-sm text-zinc-500">
                <span className="text-zinc-600">📚</span>{" "}
                {ref.authors} ({ref.year}). {ref.title}.{" "}
                <em className="text-zinc-600">{ref.journal}</em>
              </div>
            ))}
            {principle.references.books.map((ref, i) => (
              <div key={i} className="text-body-sm text-zinc-500">
                <span className="text-zinc-600">📖</span> {ref.title} —{" "}
                {ref.author}
              </div>
            ))}
            {principle.references.goodpatchBlog.map((ref, i) => (
              <RefLink
                key={i}
                label="Goodpatch"
                title={ref.title}
                url={ref.url}
              />
            ))}
          </div>
        </section>
      )}

      {/* Related Principles */}
      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-h2 text-zinc-100 mb-4">関連する効果</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/principles/${r.id}`}
                className="inline-flex items-center gap-1.5 rounded-full py-1.5 px-3 text-body-sm text-zinc-400 border border-zinc-700 hover:border-teal-400/50 hover:text-teal-400 transition-all duration-150"
              >
                {r.name.ja}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      <section>
        <div className="flex flex-wrap gap-2">
          {principle.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 py-1 rounded-sm text-caption text-zinc-500 bg-zinc-800/50"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function hasReferences(p: Principle): boolean {
  return !!(
    p.references.lawsOfUx ||
    p.references.nnGroup.length ||
    p.references.hcdNet.length ||
    p.references.academicPapers.length ||
    p.references.books.length ||
    p.references.goodpatchBlog.length
  );
}

function RefLink({
  label,
  title,
  url,
}: {
  label: string;
  title?: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-body-sm text-zinc-400 hover:text-teal-400 transition-colors duration-150"
    >
      <span className="text-zinc-600">{label}</span>
      {title ? ` — ${title}` : ` — ${url}`}
    </a>
  );
}

