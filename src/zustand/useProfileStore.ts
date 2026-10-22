import { create } from "zustand";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { loadFirestore } from "@/firebase/loadFirestore";
import { deleteAccountData } from "@/actions/deleteAccount";
import { ensureProfile } from "@/actions/profileActions";
import { onUserReset } from "./userScope";

export interface ProfileType {
  email: string;
  contactEmail: string;
  displayName: string;
  photoUrl: string;
  identityLevel?: string;
  identity?: string;
  emailVerified: boolean;
  credits: number;
  fireworks_api_key: string;
  openai_api_key: string;
  selectedAvatar: string;
  selectedTalkingPhoto: string;
  useCredits: boolean;
  favoriteRubrics: string[];
}

const defaultProfile: ProfileType = {
  email: "",
  contactEmail: "",
  displayName: "",
  photoUrl: "",
  identityLevel: "",
  identity: "",
  emailVerified: false,
  credits: 0,
  fireworks_api_key: "",
  openai_api_key: "",
  selectedAvatar: "",
  selectedTalkingPhoto: "",
  useCredits: true,
  favoriteRubrics: []
};

interface ProfileState {
  profile: ProfileType;
  fetchProfile: () => Promise<void>;
  updateProfile: (newProfile: Partial<ProfileType>) => Promise<void>;
  /** Mirrors a balance returned by the server, which owns all credit debits and grants. */
  setCredits: (credits: number) => void;
  deleteAccount: () => Promise<void>;
  addFavoriteRubric: (rubricId: string) => Promise<void>;
  removeFavoriteRubric: (rubricId: string) => Promise<void>;
}

const mergeProfileWithDefaults = (
  profile: Partial<ProfileType>,
  authState: {
    authEmail?: string;
    authDisplayName?: string;
    authPhotoUrl?: string;
  }
): ProfileType => ({
  ...defaultProfile,
  ...profile,
  credits: profile.credits ?? 0,
  email: authState.authEmail || profile.email || "",
  contactEmail: profile.contactEmail || authState.authEmail || "",
  displayName: profile.displayName || authState.authDisplayName || "",
  photoUrl: profile.photoUrl || authState.authPhotoUrl || "",
});

const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,

  fetchProfile: async () => {
    const { uid, authEmail, authDisplayName, authPhotoUrl, authEmailVerified } =
      useAuthStore.getState();
    if (!uid) return;

    const authState = { authEmail, authDisplayName, authPhotoUrl };
    try {
      const { db, doc, getDoc, updateDoc } = await loadFirestore();
      const userRef = doc(db, `users/${uid}/profile/userData`);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Profiles (and their starter balance) are created on the server only.
        const created = await ensureProfile({
          email: authEmail,
          displayName: authDisplayName,
          photoUrl: authPhotoUrl,
          emailVerified: authEmailVerified,
        });
        set({ profile: mergeProfileWithDefaults(created as Partial<ProfileType>, authState) });
        return;
      }

      const stored = docSnap.data() as Partial<ProfileType>;
      const profile = mergeProfileWithDefaults(stored, authState);
      set({ profile });
      const identity = identityChanges(stored, profile);
      if (Object.keys(identity).length) await updateDoc(userRef, identity);
    } catch (error) {
      handleProfileError("fetching or creating profile", error);
    }
  },

  updateProfile: async (newProfile: Partial<ProfileType>) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    const changes: Partial<ProfileType> = { ...newProfile };
    delete changes.credits;
    const previous = get().profile;
    set({ profile: { ...previous, ...changes } });
    try {
      const { db, doc, updateDoc } = await loadFirestore();
      await updateDoc(doc(db, `users/${uid}/profile/userData`), changes);
    } catch (error) {
      // Roll back only the fields this update touched; later edits and balance updates stay.
      set((state) => {
        const restored = { ...state.profile };
        for (const key of Object.keys(changes) as (keyof ProfileType)[]) {
          (restored as Record<string, unknown>)[key] = previous[key];
        }
        return { profile: restored };
      });
      handleProfileError("updating profile", error);
      toast.error("Couldn't save your profile change. Please try again.");
    }
  },

  deleteAccount: async () => {
    if (!useAuthStore.getState().uid) return;
    // Server verifies the session and removes Firestore data, uploads, and the auth user.
    // Errors propagate so the caller never reports a failed deletion as success.
    await deleteAccountData();
    set({ profile: defaultProfile });
  },

  setCredits: (credits: number) => {
    set((state) => ({ profile: { ...state.profile, credits } }));
  },

  addFavoriteRubric: async (rubricId: string) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    const profile = get().profile;
    if (profile.favoriteRubrics.includes(rubricId)) return; // Avoid duplicates

    try {
      const updatedFavorites = [...profile.favoriteRubrics, rubricId];
      const { db, doc, updateDoc } = await loadFirestore();
      await updateDoc(doc(db, `users/${uid}/profile/userData`), {
        favoriteRubrics: updatedFavorites,
      });

      set({
        profile: {
          ...profile,
          favoriteRubrics: updatedFavorites,
        },
      });
    } catch (error) {
      handleProfileError("adding favorite rubric", error);
    }
  },

  removeFavoriteRubric: async (rubricId: string) => {
    const uid = useAuthStore.getState().uid;
    if (!uid) return;

    const profile = get().profile;
    if (!profile.favoriteRubrics.includes(rubricId)) return; // Ensure rubric exists in favorites

    try {
      const updatedFavorites = profile.favoriteRubrics.filter(id => id !== rubricId);
      const { db, doc, updateDoc } = await loadFirestore();
      await updateDoc(doc(db, `users/${uid}/profile/userData`), {
        favoriteRubrics: updatedFavorites,
      });

      set({
        profile: {
          ...profile,
          favoriteRubrics: updatedFavorites,
        },
      });
    } catch (error) {
      handleProfileError("removing favorite rubric", error);
    }
  },
}));

const IDENTITY_FIELDS = ["email", "contactEmail", "displayName", "photoUrl"] as const;

/** Auth-derived fields that differ from what is stored; never includes credits. */
function identityChanges(stored: Partial<ProfileType>, merged: ProfileType): Partial<ProfileType> {
  const changes: Partial<ProfileType> = {};
  for (const key of IDENTITY_FIELDS) {
    if (stored[key] !== merged[key]) changes[key] = merged[key];
  }
  return changes;
}

// Helper function to handle errors
function handleProfileError(action: string, error: unknown): void {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  console.error(`Error ${action}:`, errorMessage);
}

onUserReset(() => useProfileStore.setState({ profile: defaultProfile }));

export default useProfileStore;
