import Fuse, { type IFuseOptions } from "fuse.js";
import type { Principle } from "./types";

const fuseOptions: IFuseOptions<Principle> = {
  keys: [
    { name: "name.ja", weight: 2 },
    { name: "name.en", weight: 2 },
    { name: "aliases", weight: 1.5 },
    { name: "tags", weight: 1 },
    { name: "summary", weight: 0.8 },
  ],
  threshold: 0.35,
  includeScore: true,
};

export function createSearchIndex(principles: Principle[]) {
  return new Fuse(principles, fuseOptions);
}

export function searchPrinciples(
  fuse: Fuse<Principle>,
  query: string
): Principle[] {
  if (!query.trim()) return [];
  return fuse.search(query).map((result) => result.item);
}
