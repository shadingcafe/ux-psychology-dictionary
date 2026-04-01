"use client";

import type { CategoryMeta, Category } from "@/lib/types";

interface Props {
  categories: CategoryMeta[];
  selected: Category[];
  onToggle: (id: Category) => void;
}

export function CategoryChips({ categories, selected, onToggle }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide lg:hidden">
      {categories.map((cat) => {
        const isActive = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-1.5 px-3 text-body-sm transition-all duration-150 shrink-0 ${
              isActive
                ? "bg-teal-400/10 text-teal-400 border border-teal-400/30"
                : "text-zinc-400 border border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <span className="text-xs">{cat.icon}</span>
            {cat.nameJa}
          </button>
        );
      })}
    </div>
  );
}
