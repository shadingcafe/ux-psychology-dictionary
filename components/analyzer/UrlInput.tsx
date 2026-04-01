"use client";

import { useState } from "react";

interface Props {
  onSubmit: (url: string) => void;
}

export function UrlInput({ onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleChange = (value: string) => {
    setUrl(value);
    try {
      const parsed = new URL(value);
      setIsValid(
        parsed.protocol === "http:" || parsed.protocol === "https:"
      );
    } catch {
      setIsValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="url"
            value={url}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-body text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
          />
          {url && !isValid && (
            <p className="absolute -bottom-6 left-0 text-caption text-red-400">
              有効なURLを入力してください（https://...）
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-3 bg-teal-400 text-zinc-950 font-medium rounded-lg text-body-sm transition-all duration-150 hover:bg-teal-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-teal-400 shrink-0"
        >
          診断する
        </button>
      </div>
    </form>
  );
}
