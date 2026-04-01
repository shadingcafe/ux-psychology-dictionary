"use client";

interface Props {
  scores: {
    cognitiveLoad: number;
    persuasion: number;
    usability: number;
    emotionalDesign: number;
  };
}

const scoreLabels = [
  { key: "cognitiveLoad" as const, label: "認知負荷の最適化", icon: "🧠" },
  { key: "persuasion" as const, label: "説得力", icon: "💡" },
  { key: "usability" as const, label: "ユーザビリティ", icon: "⚙️" },
  { key: "emotionalDesign" as const, label: "感情デザイン", icon: "❤️" },
];

function getScoreColor(score: number): string {
  if (score >= 4) return "bg-green-500";
  if (score >= 3) return "bg-amber-500";
  return "bg-zinc-500";
}

export function ScoreBars({ scores }: Props) {
  return (
    <div className="space-y-5">
      {scoreLabels.map(({ key, label, icon }) => {
        const score = scores[key];
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-body-sm text-zinc-300">
                {icon} {label}
              </span>
              <span className="text-body-sm font-medium text-zinc-200">
                {score}/5
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getScoreColor(score)}`}
                style={{ width: `${(score / 5) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
