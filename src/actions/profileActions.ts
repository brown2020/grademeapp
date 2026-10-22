"use server";

import { z } from "zod";
import type { Transaction } from "firebase-admin/firestore";
import { adminDb } from "@/firebase/firebaseAdmin";
import { profileRef, STARTER_CREDITS } from "@/lib/server/billing";
import { requireServerUser } from "@/lib/server/requestAuth";

const IdentitySchema = z.object({
  email: z.string().max(320).default(""),
  displayName: z.string().max(200).default(""),
  photoUrl: z.string().max(2048).default(""),
  emailVerified: z.boolean().default(false),
});

/**
 * Creates the signed-in user's profile with the starter balance if it does not
 * exist yet, and returns the stored profile. Clients cannot create profiles or
 * write `credits` themselves (see firestore.rules).
 */
export async function ensureProfile(identity: unknown): Promise<Record<string, unknown>> {
  const { uid } = await requireServerUser();
  const details = IdentitySchema.parse(identity ?? {});
  const ref = profileRef(uid);

  return adminDb.runTransaction(async (tx: Transaction) => {
    const snap = await tx.get(ref);
    if (snap.exists) return snap.data() ?? {};
    const profile = {
      ...details,
      contactEmail: details.email,
      identity: "",
      identityLevel: "",
      credits: STARTER_CREDITS,
      fireworks_api_key: "",
      openai_api_key: "",
      selectedAvatar: "",
      selectedTalkingPhoto: "",
      useCredits: true,
      favoriteRubrics: [],
    };
    tx.set(ref, profile);
    return profile;
  });
}
