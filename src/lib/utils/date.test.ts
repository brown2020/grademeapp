import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, toDate } from "@/lib/utils/date";

const ISO = "2026-10-21T12:00:00.000Z";

describe("toDate", () => {
  it("accepts Dates, ISO strings, millis and Timestamp-like objects", () => {
    const expected = new Date(ISO).getTime();
    expect(toDate(new Date(ISO))?.getTime()).toBe(expected);
    expect(toDate(ISO)?.getTime()).toBe(expected);
    expect(toDate(expected)?.getTime()).toBe(expected);
    expect(toDate({ toDate: () => new Date(ISO) })?.getTime()).toBe(expected);
  });

  it("returns null for missing or invalid input", () => {
    expect(toDate(null)).toBeNull();
    expect(toDate(undefined)).toBeNull();
    expect(toDate("")).toBeNull();
    expect(toDate("not a date")).toBeNull();
  });
});

describe("formatDate / formatDateTime", () => {
  it("formats valid dates and returns null otherwise", () => {
    expect(formatDate(ISO)).toMatch(/2026/);
    expect(formatDateTime(ISO)).toMatch(/2026/);
    expect(formatDate(null)).toBeNull();
    expect(formatDateTime("garbage")).toBeNull();
  });

  it("uses natural day numbers without leading zeros", () => {
    expect(formatDate("2026-10-09T12:00:00.000Z")).not.toMatch(/\b09\b/);
  });
});
