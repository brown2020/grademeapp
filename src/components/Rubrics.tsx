"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/page";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import type { RubricState } from "@/lib/types/rubrics-types";
import { useAuthStore } from "@/zustand/useAuthStore";
import useProfileStore from "@/zustand/useProfileStore";
import { useRubricStore } from "@/zustand/useRubricStore";
import RubricBrowser from "@/components/rubrics/RubricBrowser";
import type { RubricCardActions } from "@/components/rubrics/RubricCard";
import RubricDetailDialog from "@/components/rubrics/RubricDetailDialog";
import RubricHelper from "@/components/rubrics/RubricHelper";
import RubricBuilder from "@/components/rubrics/builder/RubricBuilder";
import type { RubricMatchContext } from "@/components/rubrics/lib/rubricSorting";

type View = { mode: "browse" } | { mode: "build"; rubric?: RubricState };

function describeContext(ctx: RubricMatchContext) {
  const who = [ctx.identityLevel, ctx.identity].filter(Boolean).join(" ");
  const what = ctx.textType ? `${ctx.textType} writing` : "your writing";
  return who ? `Suggestions for a ${who} working on ${what}.` : `Suggestions for ${what}.`;
}

export default function Rubrics() {
  const router = useRouter();
  const uid = useAuthStore((s) => s.uid);
  const profile = useProfileStore((s) => s.profile);
  const addFavoriteRubric = useProfileStore((s) => s.addFavoriteRubric);
  const removeFavoriteRubric = useProfileStore((s) => s.removeFavoriteRubric);

  const rubricOptions = useRubricStore((s) => s.rubricOptions);
  const selectedRubric = useRubricStore((s) => s.selectedRubric);
  const textType = useRubricStore((s) => s.gradingData.textType);
  const customRubricsUid = useRubricStore((s) => s.customRubricsUid);
  const customRubricsLoading = useRubricStore((s) => s.customRubricsLoading);
  const fetchCustomRubrics = useRubricStore((s) => s.fetchCustomRubrics);
  const setSelectedRubric = useRubricStore((s) => s.setSelectedRubric);
  const refreshSuggestedRubric = useRubricStore((s) => s.refreshSuggestedRubric);
  const deleteCustomRubric = useRubricStore((s) => s.deleteCustomRubric);
  const copyDefaultRubric = useRubricStore((s) => s.copyDefaultRubric);

  const [view, setView] = useState<View>({ mode: "browse" });
  const [helperOpen, setHelperOpen] = useState(false);
  const [previewRubric, setPreviewRubric] = useState<RubricState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RubricState | null>(null);

  useEffect(() => {
    if (uid && customRubricsUid !== uid && !customRubricsLoading) {
      void fetchCustomRubrics(uid);
    }
  }, [uid, customRubricsUid, customRubricsLoading, fetchCustomRubrics]);

  useEffect(() => {
    refreshSuggestedRubric();
  }, [refreshSuggestedRubric, rubricOptions, textType, profile.identity, profile.identityLevel, profile.favoriteRubrics]);

  const context = useMemo<RubricMatchContext>(
    () => ({
      identity: profile.identity,
      identityLevel: profile.identityLevel,
      textType,
      favoriteIds: profile.favoriteRubrics,
    }),
    [profile.identity, profile.identityLevel, profile.favoriteRubrics, textType]
  );

  const favoriteIds = profile.favoriteRubrics;

  const actions: RubricCardActions = {
    onUse: (rubric) => {
      setSelectedRubric(rubric);
      toast.success(`Using “${rubric.name}”`);
      router.push("/grader");
    },
    onPreview: setPreviewRubric,
    onToggleFavorite: async (rubric) => {
      try {
        if (favoriteIds.includes(rubric.id)) {
          await removeFavoriteRubric(rubric.id);
          toast.success("Removed from favorites");
        } else {
          await addFavoriteRubric(rubric.id);
          toast.success("Added to favorites");
        }
      } catch (error) {
        console.error("Error updating favorites:", error);
        toast.error("Couldn't update favorites");
      }
    },
    onEdit: (rubric) => {
      setPreviewRubric(null);
      setView({ mode: "build", rubric });
    },
    onDelete: setDeleteTarget,
    onDuplicate: async (rubric) => {
      try {
        const copy = await copyDefaultRubric(rubric);
        toast.success(`Saved “${copy.name}” to My rubrics`);
      } catch {
        toast.error("Couldn't copy the rubric. Please try again.");
      }
    },
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomRubric(deleteTarget.id);
      toast.success("Rubric deleted");
    } catch {
      toast.error("Couldn't delete the rubric. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (view.mode === "build") {
    return (
      <PageContainer size="wide">
        <RubricBuilder
          key={view.rubric?.id ?? "new"}
          rubric={view.rubric}
          onClose={() => setView({ mode: "browse" })}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        title="Rubrics"
        description="Choose how your writing is graded. Pick a suggested rubric, star the ones you use often, or build your own."
        actions={
          <Button onClick={() => setView({ mode: "build" })}>
            <Plus /> New rubric
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm">
          <p className="first-letter:uppercase">{describeContext(context)}</p>
          {selectedRubric && (
            <p className="truncate text-muted-foreground">
              In use: <span className="font-medium text-foreground">{selectedRubric.name}</span>
            </p>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={() => setHelperOpen(true)} className="self-start sm:self-auto">
          <SlidersHorizontal /> Refine suggestions
        </Button>
      </div>

      <RubricBrowser
        rubrics={rubricOptions}
        context={context}
        selectedId={selectedRubric?.id}
        customLoading={customRubricsLoading || customRubricsUid !== uid}
        actions={actions}
        onCreate={() => setView({ mode: "build" })}
      />

      <RubricHelper open={helperOpen} onOpenChange={setHelperOpen} />

      <RubricDetailDialog
        rubric={previewRubric}
        onOpenChange={(open) => !open && setPreviewRubric(null)}
        actions={actions}
      />

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete rubric?"
        description="This permanently removes the rubric from My rubrics. This action cannot be undone."
        confirmText="Delete my rubric"
        itemName={deleteTarget?.name}
      />
    </PageContainer>
  );
}
