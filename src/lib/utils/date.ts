/** Firestore Timestamps, Dates, ISO strings and epoch millis all appear in stored data. */
export type DateInput = Date | string | number | { toDate: () => Date } | null | undefined;

export function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date =
    value instanceof Date
      ? value
      : typeof value === "object"
        ? typeof value.toDate === "function"
          ? value.toDate()
          : null
        : new Date(value);
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

/** e.g. "Oct 21, 2026" in the user's locale, or null when there is no valid date. */
export function formatDate(value: DateInput): string | null {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : null;
}

/** e.g. "Oct 21, 2026, 9:24 PM" in the user's locale, or null when there is no valid date. */
export function formatDateTime(value: DateInput): string | null {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : null;
}
