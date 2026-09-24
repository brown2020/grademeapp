import type { RubricState } from "@/lib/types/rubrics-types";

export interface RubricMatchContext {
  identity?: string;
  identityLevel?: string;
  textType?: string;
  favoriteIds?: readonly string[];
}

export type RubricGroupKey = "favorites" | "best" | "suggested" | "other";

export interface RubricGroup {
  key: RubricGroupKey;
  label: string;
  rubrics: RubricState[];
}

const same = (a?: string, b?: string) => (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

export function filterRubricsByQuery<T extends Pick<RubricState, "name" | "description">>(
  rubrics: T[],
  query: string
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rubrics;
  return rubrics.filter(
    (r) => r.name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q)
  );
}

function isExactMatch(r: RubricState, ctx: RubricMatchContext) {
  return (
    same(r.identity, ctx.identity) &&
    same(r.identityLevel, ctx.identityLevel) &&
    same(r.textType, ctx.textType)
  );
}

/**
 * Relevance tiers, in priority order. Each rubric lands in the first tier it
 * matches; `null` means no relevance match.
 */
function relevanceTier(r: RubricState, ctx: RubricMatchContext): number | null {
  if (isExactMatch(r, ctx)) return 0;
  const level = Boolean(r.identityLevel) && same(r.identityLevel, ctx.identityLevel);
  const type = same(r.textType, ctx.textType);
  const identity = same(r.identity, ctx.identity);
  if (level && type) return 1;
  if (level) return 2;
  if (type && identity) return 3;
  if (identity) return 4;
  if (type) return 5;
  return null;
}

/**
 * Groups rubrics by relevance to the writer (identity / level) and the
 * assignment's text type. Favourites always come first. Empty groups are omitted.
 * Order within a group follows the input order.
 */
export function groupRubrics(rubrics: RubricState[], ctx: RubricMatchContext): RubricGroup[] {
  const favoriteIds = new Set(ctx.favoriteIds ?? []);
  const favorites: RubricState[] = [];
  const tiers: RubricState[][] = [[], [], [], [], [], []];
  const other: RubricState[] = [];

  for (const r of rubrics) {
    if (favoriteIds.has(r.id)) {
      favorites.push(r);
      continue;
    }
    const tier = relevanceTier(r, ctx);
    if (tier === null) other.push(r);
    else tiers[tier].push(r);
  }

  const groups: RubricGroup[] = [
    { key: "favorites", label: "Favorites", rubrics: favorites },
    { key: "best", label: "Best match", rubrics: tiers[0] },
    { key: "suggested", label: "Suggested for you", rubrics: tiers.slice(1).flat() },
    { key: "other", label: "More rubrics", rubrics: other },
  ];
  return groups.filter((g) => g.rubrics.length > 0);
}

/** Flat relevance-sorted list: favourites, then each relevance tier, then the rest. */
export function sortRubricsByRelevance(rubrics: RubricState[], ctx: RubricMatchContext): RubricState[] {
  return groupRubrics(rubrics, ctx).flatMap((g) => g.rubrics);
}

/** The rubric to preselect: the first exact match, else the top of the sorted list. */
export function pickSuggestedRubric(rubrics: RubricState[], ctx: RubricMatchContext): RubricState | null {
  const sorted = sortRubricsByRelevance(rubrics, ctx);
  return sorted.find((r) => isExactMatch(r, ctx)) ?? sorted[0] ?? null;
}
