"use client";

import { useState } from "react";

interface Props {
  url: string;
  onConsent: () => void;
  onCancel: () => void;
}

export function ConsentModal({ url, onConsent, onCancel }: Props) {
  const [checks, setChecks] = useState({ screenshot: false, terms: false });

  const allChecked = checks.screenshot && checks.terms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-h3 text-zinc-50 mb-2">診断を開始しますか？</h2>
        <p className="text-body-sm text-zinc-400 mb-1">
          対象URL:
        </p>
        <p className="text-body-sm text-teal-400 mb-6 break-all">{url}</p>

        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checks.screenshot}
              onChange={(e) =>
                setChecks((prev) => ({
                  ...prev,
                  screenshot: e.target.checked,
                }))
              }
              className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-teal-400 focus:ring-teal-400/50 focus:ring-offset-0"
            />
            <span className="text-body-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
              対象サイトのスクリーンショットを取得し、AI分析に使用することに同意します
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checks.terms}
              onChange={(e) =>
                setChecks((prev) => ({ ...prev, terms: e.target.checked }))
              }
              className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-teal-400 focus:ring-teal-400/50 focus:ring-offset-0"
            />
            <span className="text-body-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
              本ツールは教育目的であり、分析結果は参考情報であることを理解しています
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-body-sm"
          >
            キャンセル
          </button>
          <button
            onClick={onConsent}
            disabled={!allChecked}
            className="flex-1 px-4 py-2.5 bg-teal-400 text-zinc-950 font-medium rounded-lg text-body-sm transition-all hover:bg-teal-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            同意して診断を開始
          </button>
        </div>
      </div>
    </div>
  );
}
