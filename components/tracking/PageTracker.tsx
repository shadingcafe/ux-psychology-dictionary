"use client";

import { useEffect } from "react";

interface Props {
  pagePath: string;
  pageType: "home" | "principle" | "category" | "analyze" | "admin" | "other";
  principleId?: string;
  category?: string;
}

export function PageTracker({ pagePath, pageType, principleId, category }: Props) {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath, pageType, principleId, category }),
    }).catch(() => {
      // Silently fail — tracking should not block the user
    });
  }, [pagePath, pageType, principleId, category]);

  return null;
}
