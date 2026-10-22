export type GradeTone = "success" | "primary" | "warning" | "danger" | "neutral";

/** Single grade colour scale shared by every surface that shows a grade. */
export function gradeTone(grade?: string | null): GradeTone {
  const value = Number.parseFloat(grade ?? "");
  if (Number.isNaN(value)) return "neutral";
  if (value >= 90) return "success";
  if (value >= 75) return "primary";
  if (value >= 60) return "warning";
  return "danger";
}
