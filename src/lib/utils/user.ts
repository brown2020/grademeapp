import { adminDb } from "@/firebase/firebaseAdmin";

export async function getUserProfile(userId: string) {
  const userRef = adminDb.doc(`users/${userId}`);
  const userSnap = await userRef.get();

  if (userSnap.exists) {
    return userSnap.data();
  } else {
    return null;
  }
}

// Function to retrieve API keys from Firestore
export async function getApiKeys(userId: string) {
  try {
    const userRef = adminDb.doc(`users/${userId}/profile/userData`);
    const docSnap = await userRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();

      if (data) {
        return {
          fireworks_api_key: data.fireworks_api_key,
          openai_api_key: data.openai_api_key,
        };
      } else {
        console.error("Data is undefined.");
        return null;
      }
    } else {
      console.error("Fireworks and OpenAI API keys not found in the database.");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

