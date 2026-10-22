const currencyFormatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(code: string) {
  let formatter = currencyFormatters.get(code);
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, { style: "currency", currency: code });
    currencyFormatters.set(code, formatter);
  }
  return formatter;
}

/** Amounts are stored in the smallest currency unit (cents). */
export function formatAmount(amountInCents: number, currency?: string) {
  const value = (amountInCents ?? 0) / 100;
  const code = currency && /^[a-z]{3}$/i.test(currency) ? currency.toUpperCase() : "USD";
  try {
    return currencyFormatter(code).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export const CREDIT_PACK = {
  price: 99.99,
  credits: 10000,
} as const;

const creditsFormatter = new Intl.NumberFormat();

export const formatCredits = (credits: number) => creditsFormatter.format(Math.round(credits));
