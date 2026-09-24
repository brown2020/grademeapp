"use server";

import { adminAuth, adminBucket, adminDb } from "@/firebase/firebaseAdmin";
import { requireServerUser } from "@/lib/server/requestAuth";

/**
 * Permanently deletes the signed-in user's data and auth account.
 * The uid comes only from the verified session cookie, never from the client.
 * Auth is deleted last so a partial failure can be retried by the same user.
 */
export async function deleteAccountData(): Promise<{ ok: true }> {
  const { uid } = await requireServerUser();

  // users/{uid} plus profile, summaries, custom_rubrics, payments, plagiarism_reports.
  await adminDb.recursiveDelete(adminDb.doc(`users/${uid}`));
  await adminBucket.deleteFiles({ prefix: `uploads/${uid}/` });
  await adminAuth.deleteUser(uid);

  return { ok: true };
}
