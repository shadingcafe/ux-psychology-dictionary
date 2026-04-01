"use client";

import { useState, useEffect } from "react";

interface Props {
  url: string;
}

const steps = [
  { label: "スクリーンショット取得中", icon: "📸", duration: 5000 },
  { label: "AI分析中", icon: "🧠", duration: 15000 },
  { label: "スコア計算中", icon: "📊", duration: 5000 },
];

export function AnalysisLoading({ url }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let accumulated = 0;

    steps.forEach((step, index) => {
      if (index > 0) {
        accumulated += steps[index - 1].duration;
        timers.push(
          setTimeout(() => {
            setCurrentStep(index);
          }, accumulated)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="text-center py-16 space-y-8">
      {/* Animated spinner */}
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          {steps[currentStep].icon}
        </span>
      </div>

      <div>
        <p className="text-body text-zinc-200 mb-2">
          {steps[currentStep].label}...
        </p>
        <p className="text-body-sm text-zinc-500">約15〜30秒かかります</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                i <= currentStep
                  ? "bg-teal-400 scale-100"
                  : "bg-zinc-700 scale-75"
              }`}
            />
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 transition-all duration-500 ${
                  i < currentStep ? "bg-teal-400" : "bg-zinc-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-caption text-zinc-600 break-all max-w-md mx-auto">
        {url}
      </p>
    </div>
  );
}
