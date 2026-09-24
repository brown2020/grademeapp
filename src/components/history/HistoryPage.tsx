"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { History, Plus, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui/page";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import { UserHistoryType } from "@/lib/types/user-history";
import { useAuthStore } from "@/zustand/useAuthStore";
import { deleteSummary, fetchHistoryPage } from "./historyData";
import HistoryRow, { HISTORY_GRID } from "./HistoryRow";
import HistorySkeleton from "./HistorySkeleton";

function matches(summary: UserHistoryType, needle: string) {
  if (!needle) return true;
  const first = summary.submissions[0];
  const haystack = `${first?.text ?? ""} ${summary.userInput?.title ?? ""} ${
    summary.userInput?.rubric?.name ?? ""
  } ${first?.response ?? ""}`;
  return haystack.toUpperCase().includes(needle.toUpperCase());
}

function HistoryList({ uid }: { uid: string }) {
  const [summaries, setSummaries] = useState<UserHistoryType[]>([]);
  const [lastKey, setLastKey] = useState<Timestamp | undefined>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<UserHistoryType | null>(null);
  const needle = useDeferredValue(search.trim());

  useEffect(() => {
    let cancelled = false;
    fetchHistoryPage(uid)
      .then(({ items, lastKey }) => {
        if (cancelled) return;
        setSummaries(items);
        setLastKey(lastKey);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Error fetching summaries:", error);
        if (cancelled) return;
        toast.error("Error loading history");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const loadMore = async () => {
    if (!lastKey) return;
    setLoadingMore(true);
    try {
      const next = await fetchHistoryPage(uid, lastKey);
      setSummaries((prev) => [...prev, ...next.items]);
      setLastKey(next.lastKey);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      toast.error("Error loading history");
    } finally {
      setLoadingMore(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteSummary(uid, id);
      setSummaries((prev) => prev.filter((s) => s.id !== id));
      toast.success("Deleted from history");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const visible = summaries
    .filter((s) => s.submissions.length > 0 && matches(s, needle))
    .sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));
  const hasAny = summaries.some((s) => s.submissions.length > 0);

  return (
    <>
      {(status === "loading" || hasAny) && (
        <div className="relative mb-4">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, rubric or text…"
            aria-label="Search history"
            className="pl-9"
            disabled={status === "loading"}
          />
        </div>
      )}

      {status === "loading" && <HistorySkeleton />}

      {status === "error" && (
        <EmptyState
          icon={<History />}
          title="Couldn't load your history"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      )}

      {status === "ready" && !hasAny && (
        <EmptyState
          icon={<History />}
          title="No gradings yet"
          description="Grade a draft and it will show up here with every revision you submit."
          action={
            <Button asChild>
              <Link href="/grader">
                <Plus /> Grade a draft
              </Link>
            </Button>
          }
        />
      )}

      {status === "ready" && hasAny && visible.length === 0 && (
        <EmptyState
          icon={<SearchX />}
          title="No matches"
          description={`Nothing in your history matches “${needle}”.`}
        />
      )}

      {status === "ready" && visible.length > 0 && (
        <div className="md:overflow-hidden md:rounded-xl md:border md:border-border md:bg-surface md:shadow-soft">
          <div
            className={`hidden border-b border-border bg-muted/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground ${HISTORY_GRID}`}
            aria-hidden
          >
            <span>Title</span>
            <span>Date</span>
            <span>Submissions</span>
            <span>Grade</span>
            <span />
          </div>
          <ul className="flex flex-col gap-3 md:gap-0">
            {visible.map((summary) => (
              <HistoryRow key={summary.id} summary={summary} onDelete={setPendingDelete} />
            ))}
          </ul>
        </div>
      )}

      {status === "ready" && lastKey && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={loadMore} loading={loadingMore}>
            Load more
          </Button>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this grading?"
        description="This removes the grading and all of its submissions from your history. This can't be undone."
        confirmText="delete"
        itemName={pendingDelete?.userInput?.title || "Untitled"}
      />
    </>
  );
}

export default function HistoryPage() {
  const uid = useAuthStore((s) => s.uid);

  return (
    <PageContainer>
      <PageHeader
        title="History"
        description="Every draft you've graded, with its latest grade and revisions."
        actions={
          <Button asChild>
            <Link href="/grader">
              <Plus /> New grading
            </Link>
          </Button>
        }
      />
      {uid ? <HistoryList key={uid} uid={uid} /> : <HistorySkeleton />}
    </PageContainer>
  );
}
