import { cn } from "@/lib/utils";

function isWithinLimit(words: number, limitType: string, limit: string) {
  const numbers = limit.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return true;
  if (limitType === "less than") return words <= numbers[0];
  if (limitType === "more than") return words >= numbers[0];
  if (limitType === "between") {
    const [min, max = numbers[0]] = numbers;
    return words >= Math.min(min, max) && words <= Math.max(min, max);
  }
  return true;
}

export function WordCount({
  words,
  wordLimit,
  wordLimitType,
}: {
  words: number;
  wordLimit?: string;
  wordLimitType?: string;
}) {
  const hasLimit = !!wordLimit && !!wordLimitType;
  const outOfRange =
    hasLimit && words > 0 && !isWithinLimit(words, wordLimitType, wordLimit);

  return (
    <p
      className={cn(
        "text-xs tabular-nums text-muted-foreground",
        outOfRange && "font-medium text-destructive"
      )}
    >
      {words.toLocaleString()} {words === 1 ? "word" : "words"}
      {hasLimit && (
        <span>
          {" "}
          · limit {wordLimitType} {wordLimit}
        </span>
      )}
    </p>
  );
}
