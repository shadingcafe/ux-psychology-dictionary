export function GoodpatchCTA() {
  return (
    <div className="bg-zinc-900 border border-rose-600/20 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <p className="text-body-sm text-zinc-400 mb-2">💼</p>
        <h3 className="text-h3 text-zinc-100 mb-2">
          プロによる本格的なUI/UX診断を受けてみませんか？
        </h3>
        <p className="text-body-sm text-zinc-400 mb-4 max-w-lg">
          AIによる簡易分析では見えない、ユーザー視点での深い洞察をお届けします。
          Goodpatchの専門家チームが、御社のプロダクトを多角的に分析します。
        </p>
        <a
          href="https://feedback.goodpatch.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white font-medium rounded-lg text-body-sm hover:bg-rose-500 transition-colors"
        >
          🔗 Goodpatch UI/UX FBを見る
        </a>
      </div>
    </div>
  );
}
