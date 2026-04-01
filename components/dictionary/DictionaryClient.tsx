"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { Principle, CategoryMeta, Category } from "@/lib/types";
import { PrincipleCard } from "./PrincipleCard";
import { CategoryTabs } from "./CategoryTabs";
import { SearchBar } from "./SearchBar";

interface Props {
  principles: Principle[];
  categories: CategoryMeta[];
}

export function DictionaryClient({ principles, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Category | "all">("all");

  const fuse = useMemo(
    () =>
      new Fuse(principles, {
        keys: [
          { name: "name.ja", weight: 2 },
          { name: "name.en", weight: 2 },
          { name: "aliases", weight: 1.5 },
          { name: "tags", weight: 1 },
          { name: "summary", weight: 0.8 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [principles]
  );

  const filtered = useMemo(() => {
    let results = principles;

    if (query.trim()) {
      results = fuse.search(query).map((r) => r.item);
    }

    if (activeTab !== "all") {
      results = results.filter((p) => p.category === activeTab);
    }

    return results;
  }, [principles, query, activeTab, fuse]);

  const activeCategory = activeTab !== "all"
    ? categories.find((c) => c.id === activeTab)
    : null;

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <SearchBar query={query} onQueryChange={setQuery} />
      </div>

      {/* Category tabs */}
      <CategoryTabs
        categories={categories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab content header */}
      <div className="mt-6 mb-4 flex items-baseline gap-3">
        {activeCategory && (
          <span className="text-lg">{activeCategory.icon}</span>
        )}
        <p className="text-body-sm text-zinc-500">
          {filtered.length}件の心理学法則
          {query && <span className="text-zinc-600"> — &quot;{query}&quot;</span>}
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((principle, i) => (
          <PrincipleCard
            key={principle.id}
            principle={principle}
            categories={categories}
            index={i}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-body text-zinc-500">
            条件に一致する心理学法則が見つかりませんでした
          </p>
        </div>
      )}
    </div>
  );
}
