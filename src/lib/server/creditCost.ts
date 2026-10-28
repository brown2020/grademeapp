function positive(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function creditRates() {
  return {
    creditsPerDollar: positive(Number(process.env.CREDITS_PER_DOLLAR), 500),
    creditsPerInputToken: positive(Number(process.env.CREDITS_PER_INPUT_TOKEN), 0.000005),
    creditsPerOutputToken: positive(Number(process.env.CREDITS_PER_OUTPUT_TOKEN), 0.000015),
  };
}

export function creditsForTokens(inputTokens: number, outputTokens: number): number {
  const { creditsPerDollar, creditsPerInputToken, creditsPerOutputToken } = creditRates();
  const input = positive(inputTokens, 0);
  const output = positive(outputTokens, 0);
  return (input * creditsPerInputToken + output * creditsPerOutputToken) * creditsPerDollar;
}

/** Reservation charged before the provider call, with the same 50% buffer as before. */
export function reservedCredits(inputTokens: number, outputTokens: number): number {
  return creditsForTokens(inputTokens, outputTokens) * 1.5;
}
