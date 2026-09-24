/** Amounts are stored in the smallest currency unit (cents). */
export function formatAmount(amountInCents: number, currency?: string) {
  const value = (amountInCents ?? 0) / 100;
  const code = currency && /^[a-z]{3}$/i.test(currency) ? currency.toUpperCase() : "USD";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export const CREDIT_PACK = {
  price: 99.99,
  credits: 10000,
} as const;

export const formatCredits = (credits: number) =>
  new Intl.NumberFormat().format(Math.round(credits));
