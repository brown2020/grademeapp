/**
 * Loads the Firestore SDK and client on first use. Modules the app shell
 * imports must use this rather than a static `firebase/firestore` import, or
 * every page (including the signed-out landing page) pays for the SDK.
 */
export const loadFirestore = async () => {
  const [sdk, { db }] = await Promise.all([import("firebase/firestore"), import("./firestore")]);
  return { ...sdk, db };
};
