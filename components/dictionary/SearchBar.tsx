"use client";

import { useRef, useEffect, useCallback } from "react";

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
}

export function SearchBar({ query, onQueryChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onQueryChange(value);
      }, 300);
    },
    [onQueryChange]
  );

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
        🔍
      </span>
      <input
        ref={inputRef}
        type="text"
        defaultValue={query}
        onChange={handleChange}
        placeholder="法則名・キーワードで検索..."
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-body-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/30 transition-all duration-150"
      />
    </div>
  );
}
