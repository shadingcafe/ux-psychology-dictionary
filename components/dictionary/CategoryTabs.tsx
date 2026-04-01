"use client";

import type { CategoryMeta, Category } from "@/lib/types";

interface Props {
  categories: CategoryMeta[];
  activeTab: Category | "all";
  onTabChange: (tab: Category | "all") => void;
}

export function CategoryTabs({ categories, activeTab, onTabChange }: Props) {
  return (
    <div className="border-b border-zinc-800">
      <nav className="flex gap-0 overflow-x-auto scrollbar-hide -mb-px">
        <TabButton
          isActive={activeTab === "all"}
          onClick={() => onTabChange("all")}
          icon=""
          label="すべて"
        />
        {categories.map((cat) => (
          <TabButton
            key={cat.id}
            isActive={activeTab === cat.id}
            onClick={() => onTabChange(cat.id)}
            icon={cat.icon}
            label={cat.nameJa}
          />
        ))}
      </nav>
    </div>
  );
}

function TabButton({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-body-sm transition-all duration-150 shrink-0 border-b-2 ${
        isActive
          ? "border-teal-400 text-teal-400"
          : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
      }`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {label}
    </button>
  );
}
