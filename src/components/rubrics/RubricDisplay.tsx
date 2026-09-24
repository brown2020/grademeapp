import { CheckSquare } from "lucide-react";
import type { RubricState } from "@/lib/types/rubrics-types";
import { cn } from "@/lib/utils";
import {
  buildRubricView,
  type LevelEntry,
  type MatrixRow,
  type TreeNode,
} from "./lib/rubricView";

function LevelList({ levels, className }: { levels: LevelEntry[]; className?: string }) {
  return (
    <dl className={cn("flex flex-col gap-2", className)}>
      {levels.map((level) => (
        <div key={level.label} className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
          <dt className="text-sm font-medium text-foreground">{level.label}</dt>
          <dd className="text-sm leading-relaxed text-muted-foreground">
            {level.text || <span className="italic">Not described</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CriterionHeading({ name, description }: { name: string; description?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <h4 className="font-serif text-base font-semibold">{name}</h4>
      {description?.trim() && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

function MatrixTable({ rows, columns }: { rows: MatrixRow[]; columns: string[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted/60">
          <tr>
            <th scope="col" className="w-44 p-3 font-medium">Criterion</th>
            {columns.map((c) => (
              <th key={c} scope="col" className="p-3 font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t border-border align-top">
              <th scope="row" className="p-3 font-normal">
                <CriterionHeading name={row.name} description={row.description} />
              </th>
              {row.levels.map((l) => (
                <td key={l.label} className="p-3 leading-relaxed text-muted-foreground">{l.text}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StackedRows({ rows, className }: { rows: MatrixRow[]; className?: string }) {
  return (
    <div className={cn("flex flex-col divide-y divide-border", className)}>
      {rows.map((row) => (
        <section key={row.name} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
          <CriterionHeading name={row.name} description={row.description} />
          <LevelList levels={row.levels} />
        </section>
      ))}
    </div>
  );
}

function Tree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((node, i) => (
        <li key={`${node.label}-${i}`} className="text-sm">
          <span className="font-medium">{node.label}</span>
          {node.text !== undefined && (
            <span className="text-muted-foreground">: {node.text}</span>
          )}
          {node.children && node.children.length > 0 && (
            <div className="mt-1.5 border-l border-border pl-3">
              <Tree nodes={node.children} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Renders a rubric's criteria in the layout that suits its type. */
export default function RubricDisplay({
  rubric,
  className,
}: {
  rubric: RubricState | null;
  className?: string;
}) {
  if (!rubric) {
    return <p className={cn("text-sm text-muted-foreground", className)}>No rubric selected.</p>;
  }

  const view = buildRubricView(rubric);

  switch (view.kind) {
    case "empty":
      return <p className={cn("text-sm text-muted-foreground", className)}>This rubric has no criteria yet.</p>;
    case "levels":
      return <LevelList levels={view.levels} className={className} />;
    case "single-point":
      return (
        <div className={cn("flex flex-col gap-4", className)}>
          <div className="rounded-lg border-l-2 border-primary bg-accent/50 p-3">
            <div className="text-xs font-medium uppercase tracking-wider text-accent-foreground">Proficient</div>
            <p className="mt-1 text-sm leading-relaxed">{view.proficient || "Not described"}</p>
          </div>
          {view.feedback.length > 0 && <LevelList levels={view.feedback} />}
        </div>
      );
    case "checklist":
      return (
        <ul className={cn("flex flex-col gap-2", className)}>
          {view.items.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-sm">
              <CheckSquare className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                {item.label}
                {item.text && item.text !== "Yes/No" && (
                  <span className="text-muted-foreground"> — {item.text}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      );
    case "matrix":
      return view.columns ? (
        <div className={className}>
          <MatrixTable rows={view.rows} columns={view.columns} />
          <StackedRows rows={view.rows} className="md:hidden" />
        </div>
      ) : (
        <StackedRows rows={view.rows} className={className} />
      );
    case "multi-trait":
      return (
        <div className={cn("flex flex-col divide-y divide-border", className)}>
          {view.traits.map((trait) => (
            <section key={trait.name} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
              <CriterionHeading name={trait.name} description={trait.description} />
              {trait.subCriteria.map((sub, i) => (
                <div key={`${trait.name}-${i}`} className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm font-medium">{sub.description || `Sub-criterion ${i + 1}`}</p>
                  <LevelList levels={sub.levels} />
                </div>
              ))}
            </section>
          ))}
        </div>
      );
    case "tree":
      return (
        <div className={className}>
          <Tree nodes={view.nodes} />
        </div>
      );
  }
}
