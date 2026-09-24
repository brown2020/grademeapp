"use client";

import { useMemo, useState } from "react";
import { Blocks, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/page";
import { SimpleSelect } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/spinner";
import type { RubricState } from "@/lib/types/rubrics-types";
import { cn } from "@/lib/utils";
import RubricCard, { type RubricCardActions } from "./RubricCard";
import { RUBRIC_TYPES, rubricTypeLabel } from "./lib/rubricTypeConfig";
import {
  filterRubricsByQuery,
  groupRubrics,
  type RubricGroup,
  type RubricMatchContext,
} from "./lib/rubricSorting";

type Scope = "all" | "favorites" | "mine";

const SCOPES: { value: Scope; label: string }[] = [
  { value: "all", label: "All" },
  { value: "favorites", label: "Favorites" },
  { value: "mine", label: "My rubrics" },
];

const PAGE_SIZE = 12;

function RubricGroupSection({
  group,
  favoriteIds,
  selectedId,
  actions,
}: {
  group: RubricGroup;
  favoriteIds: Set<string>;
  selectedId?: string;
  actions: RubricCardActions;
}) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const visible = group.rubrics.slice(0, limit);
  const remaining = group.rubrics.length - visible.length;

  return (
    <section aria-labelledby={`group-${group.key}`} className="flex flex-col gap-3">
      <h2 id={`group-${group.key}`} className="flex items-baseline gap-2 font-serif text-lg font-semibold">
        {group.label}
        <span className="font-sans text-sm font-normal text-muted-foreground">{group.rubrics.length}</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((rubric) => (
          <RubricCard
            key={rubric.id}
            rubric={rubric}
            isFavorite={favoriteIds.has(rubric.id)}
            isSelected={rubric.id === selectedId}
            actions={actions}
          />
        ))}
      </div>
      {remaining > 0 && (
        <Button variant="secondary" className="self-center" onClick={() => setLimit((n) => n + PAGE_SIZE * 2)}>
          Show more ({remaining})
        </Button>
      )}
    </section>
  );
}

export default function RubricBrowser({
  rubrics,
  context,
  selectedId,
  customLoading,
  actions,
  onCreate,
}: {
  rubrics: RubricState[];
  context: RubricMatchContext;
  selectedId?: string;
  customLoading: boolean;
  actions: RubricCardActions;
  onCreate: () => void;
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const favoriteIds = useMemo(() => new Set(context.favoriteIds ?? []), [context.favoriteIds]);

  const groups = useMemo(() => {
    let list = filterRubricsByQuery(rubrics, query);
    if (scope === "favorites") list = list.filter((r) => favoriteIds.has(r.id));
    if (scope === "mine") list = list.filter((r) => r.isCustom);
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter);
    return groupRubrics(list, context);
  }, [rubrics, query, scope, typeFilter, favoriteIds, context]);

  const typeOptions = useMemo(() => {
    const present = new Set(rubrics.map((r) => r.type));
    return [
      { value: "all", label: "All types" },
      ...RUBRIC_TYPES.filter((t) => present.has(t)).map((t) => ({ value: t, label: rubricTypeLabel(t) })),
    ];
  }, [rubrics]);

  const isEmpty = groups.length === 0;
  const hasFilters = query.trim() !== "" || typeFilter !== "all";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            aria-label="Search rubrics"
            placeholder="Search rubrics by name or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Show" className="inline-flex h-10 items-center gap-1 rounded-lg bg-muted p-1">
            {SCOPES.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={scope === s.value}
                onClick={() => setScope(s.value)}
                className={cn(
                  "h-full whitespace-nowrap rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                  scope === s.value && "bg-surface text-foreground shadow-soft"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <SimpleSelect
            aria-label="Filter by rubric type"
            value={typeFilter}
            options={typeOptions}
            onChange={setTypeFilter}
            className="w-44"
          />
        </div>
      </div>

      {scope === "mine" && customLoading && isEmpty ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : isEmpty ? (
        scope === "mine" && !hasFilters ? (
          <EmptyState
            icon={<Blocks />}
            title="No custom rubrics yet"
            description="Build a rubric for your own assignment, or copy one of ours and adapt it."
            action={<Button onClick={onCreate}>New rubric</Button>}
          />
        ) : scope === "favorites" && !hasFilters ? (
          <EmptyState
            icon={<Star />}
            title="No favorites yet"
            description="Star rubrics you use often and they'll show up here and at the top of your list."
          />
        ) : (
          <EmptyState
            icon={<Search />}
            title="No matching rubrics"
            description="Try a different search or clear the filters."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setTypeFilter("all");
                  setScope("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )
      ) : (
        groups.map((group) => (
          <RubricGroupSection
            key={`${group.key}-${scope}-${typeFilter}-${query}`}
            group={group}
            favoriteIds={favoriteIds}
            selectedId={selectedId}
            actions={actions}
          />
        ))
      )}
    </div>
  );
}
