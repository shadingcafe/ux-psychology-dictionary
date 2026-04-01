export type Category =
  | "cognitive-load"
  | "decision-making"
  | "perception"
  | "memory"
  | "attention"
  | "motivation"
  | "social"
  | "persuasion"
  | "emotion"
  | "ux-laws";

export interface CategoryMeta {
  id: Category;
  nameJa: string;
  nameEn: string;
  icon: string;
}

export interface Principle {
  id: string;
  name: {
    ja: string;
    en: string;
  };
  aliases: string[];
  category: Category;
  tags: string[];
  summary: string;
  description: string;
  origin: {
    researcher: string;
    year: number;
    paper?: string;
  };
  uiExamples: {
    type: "good" | "bad";
    title: string;
    description: string;
  }[];
  aiPromptTip: string;
  detectionHints: string[];
  relatedPrinciples: string[];
  references: {
    lawsOfUx?: string;
    nnGroup: { title: string; url: string; type: "article" | "video" }[];
    hcdNet: { title: string; url: string }[];
    academicPapers: {
      authors: string;
      year: number;
      title: string;
      journal: string;
    }[];
    books: { title: string; author: string }[];
    goodpatchBlog: { title: string; url: string }[];
  };
}

export interface AnalysisResult {
  id: string;
  url: string;
  analyzedAt: string;
  screenshotUrl: string;
  findings: {
    principleId: string;
    confidence: "high" | "medium" | "low";
    location: string;
    explanation: string;
  }[];
  scores: {
    cognitiveLoad: number;
    persuasion: number;
    usability: number;
    emotionalDesign: number;
  };
  summary: string;
  improvementHints: string[];
}
