import type { FormEvent, ReactNode } from "react";

/**
 * Two-column grading workspace. On large screens the panel sits in a sticky
 * right column; on small screens it follows the editor, with results last.
 */
export function WorkspaceLayout({
  onSubmit,
  editor,
  panel,
  results,
}: {
  onSubmit: (e: FormEvent) => void;
  editor: ReactNode;
  panel: ReactNode;
  results?: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem]"
    >
      <div className="flex min-w-0 flex-col gap-4">{editor}</div>
      <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {panel}
      </aside>
      {results && <div className="flex min-w-0 flex-col gap-4">{results}</div>}
    </form>
  );
}
