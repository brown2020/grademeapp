import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

let env: RulesTestEnvironment;
const PROFILE = "users/alice/profile/userData";

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-grademe-rules",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
});

afterAll(() => env?.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, PROFILE), { credits: 100, identity: "student", useCredits: true });
    await setDoc(doc(db, "users/alice/payments/pi_1"), { amount: 999 });
    await setDoc(doc(db, "users/alice/plagiarism_reports/r1"), { status: "pending" });
  });
});

const alice = () => env.authenticatedContext("alice").firestore();
const bob = () => env.authenticatedContext("bob").firestore();

describe("firestore.rules: profile and credits", () => {
  it("lets the owner update non-credit profile fields", async () => {
    await assertSucceeds(updateDoc(doc(alice(), PROFILE), { identity: "teacher", useCredits: false }));
  });

  it("denies the owner changing their own credits", async () => {
    await assertFails(updateDoc(doc(alice(), PROFILE), { credits: 1_000_000 }));
    await assertFails(updateDoc(doc(alice(), PROFILE), { identity: "x", credits: 101 }));
  });

  it("denies client profile creation and deletion (server-only)", async () => {
    await assertFails(setDoc(doc(env.authenticatedContext("carol").firestore(), "users/carol/profile/userData"), { credits: 1000 }));
    await assertFails(deleteDoc(doc(alice(), PROFILE)));
  });

  it("denies reading or writing another user's profile", async () => {
    await assertFails(getDoc(doc(bob(), PROFILE)));
    await assertFails(updateDoc(doc(bob(), PROFILE), { identity: "x" }));
  });
});

describe("firestore.rules: user data", () => {
  it("lets owners manage their history and custom rubrics", async () => {
    await assertSucceeds(setDoc(doc(alice(), "users/alice/summaries/s1"), { userInput: {} }));
    await assertSucceeds(setDoc(doc(alice(), "users/alice/custom_rubrics/c1"), { name: "Mine" }));
    await assertSucceeds(deleteDoc(doc(alice(), "users/alice/custom_rubrics/c1")));
  });

  it("keeps payments and plagiarism reports read-only to the owner", async () => {
    await assertSucceeds(getDoc(doc(alice(), "users/alice/payments/pi_1")));
    await assertFails(setDoc(doc(alice(), "users/alice/payments/fake"), { amount: 0 }));
    await assertSucceeds(getDoc(doc(alice(), "users/alice/plagiarism_reports/r1")));
    await assertFails(updateDoc(doc(alice(), "users/alice/plagiarism_reports/r1"), { status: "completed" }));
  });

  it("denies cross-user and unauthenticated access", async () => {
    await assertFails(getDoc(doc(bob(), "users/alice/summaries/s1")));
    await assertFails(setDoc(doc(bob(), "users/alice/summaries/s2"), {}));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), "users/alice")));
  });

  it("denies unknown collections", async () => {
    await assertFails(setDoc(doc(alice(), "anything/x"), {}));
    await assertFails(setDoc(doc(alice(), "users/alice/other/x"), {}));
  });
});

describe("storage.rules", () => {
  it("lets owners upload drafts under 10 MB to their own folder only", async () => {
    const own = env.authenticatedContext("alice").storage();
    await assertSucceeds(
      uploadBytes(ref(own, "uploads/alice/draft.txt"), new Uint8Array(16), { contentType: "text/plain" })
    );
    await assertFails(
      uploadBytes(ref(own, "uploads/alice/page.html"), new Uint8Array(16), { contentType: "text/html" })
    );
    await assertFails(uploadBytes(ref(own, "uploads/alice/huge.txt"), new Uint8Array(10 * 1024 * 1024)));
    await assertFails(uploadBytes(ref(own, "uploads/bob/draft.txt"), new Uint8Array(16)));
    await assertFails(uploadBytes(ref(own, "elsewhere/draft.txt"), new Uint8Array(16)));
  });
});
