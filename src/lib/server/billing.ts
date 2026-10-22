import { FieldValue, type DocumentReference, type Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";

export class InsufficientCreditsError extends Error {
  constructor(message = "Not enough credits to process the request.") {
    super(message);
    this.name = "InsufficientCreditsError";
  }
}

export interface Billing {
  credits: number;
  useCredits: boolean;
  openaiApiKey: string;
  fireworksApiKey: string;
}

export const profileRef = (uid: string): DocumentReference =>
  adminDb.doc(`users/${uid}/profile/userData`);

const toCredits = (value: unknown) => {
  const credits = Number(value ?? 0);
  return Number.isFinite(credits) ? credits : 0;
};

/** Reads the caller's balance, billing mode and BYO keys from the server-side profile. */
export async function getBilling(uid: string): Promise<Billing> {
  const snap = await profileRef(uid).get();
  const data = (snap.exists ? snap.data() : undefined) ?? {};
  return {
    credits: toCredits(data.credits),
    useCredits: data.useCredits !== false,
    openaiApiKey: typeof data.openai_api_key === "string" ? data.openai_api_key : "",
    fireworksApiKey: typeof data.fireworks_api_key === "string" ? data.fireworks_api_key : "",
  };
}

/**
 * Atomically debits `amount` credits and returns the new balance. With `allowPartial`
 * (used when the cost is only known after the work ran) the balance clamps at zero;
 * otherwise a short balance throws `InsufficientCreditsError` and nothing is written.
 */
export async function debitCredits(
  uid: string,
  amount: number,
  { allowPartial = false }: { allowPartial?: boolean } = {}
): Promise<number> {
  const ref = profileRef(uid);
  return adminDb.runTransaction(async (tx: Transaction) => {
    const current = toCredits((await tx.get(ref)).data()?.credits);
    if (!(amount > 0)) return current;
    if (!allowPartial && current < amount) throw new InsufficientCreditsError();
    const next = Math.max(0, current - amount);
    tx.update(ref, { credits: next });
    return next;
  });
}

/** Returns credits taken for work that then failed. */
export async function refundCredits(uid: string, amount: number): Promise<void> {
  if (!(amount > 0)) return;
  await profileRef(uid).update({ credits: FieldValue.increment(amount) });
}
