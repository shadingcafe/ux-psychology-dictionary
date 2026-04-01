import Link from "next/link";
import type { Principle, CategoryMeta } from "@/lib/types";

interface Props {
  principle: Principle;
  categories: CategoryMeta[];
  index: number;
}

export function PrincipleCard({ principle, categories, index }: Props) {
  const category = categories.find((c) => c.id === principle.category);

  return (
    <Link
      href={`/principles/${principle.id}`}
      className="group block rounded-lg border border-zinc-800 bg-zinc-900 py-5 px-4 transition-all duration-150 ease-out hover:border-teal-400/50 hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(45,212,191,0.05)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{category?.icon}</span>
        <span className="text-caption text-zinc-500">
          {category?.nameJa}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-card-title text-zinc-200 group-hover:text-zinc-50 transition-colors duration-150 mb-1">
        {principle.name.ja}
      </h3>
      <p className="text-caption text-zinc-500 font-[family-name:var(--font-inter)] mb-3">
        {principle.name.en}
      </p>

      {/* Summary */}
      <p className="text-body-sm text-zinc-400 leading-relaxed mb-3">
        {principle.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {principle.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-block px-2 py-0.5 rounded-sm text-caption text-zinc-500 bg-zinc-800/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
