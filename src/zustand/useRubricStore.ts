import { create } from 'zustand';
import { collection, deleteDoc, doc, getDocs, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseClient';
import { useAuthStore } from '@/zustand/useAuthStore';
import useProfileStore from '@/zustand/useProfileStore';
import { RubricType, type RubricState } from '@/lib/types/rubrics-types';
import type { GradingData } from '@/lib/types/grading-data';
import rawRubrics from '@/lib/constants/rubrics.json';
import { pickSuggestedRubric } from '@/components/rubrics/lib/rubricSorting';

const isValidRubricState = (rubric: unknown): rubric is RubricState => {
  if (typeof rubric !== 'object' || rubric === null) return false;
  const r = rubric as Partial<RubricState>;
  return (
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    typeof r.type === 'string' &&
    Object.values(RubricType).includes(r.type as RubricType) &&
    typeof r.criteria === 'object' &&
    r.criteria !== null &&
    (r.tags === undefined || Array.isArray(r.tags))
  );
};

export const defaultRubrics: RubricState[] = (rawRubrics as unknown[])
  .filter(isValidRubricState)
  .map((rubric) => ({ ...rubric, tags: rubric.tags || [] }) as RubricState);

const initialGradingData: GradingData = {
  assigner: '',
  topic: '',
  prose: '',
  audience: '',
  wordLimitType: 'less than',
  wordLimit: '',
  rubric: null,
  customRubric: '',
  textType: 'narrative',
  title: '',
  text: '',
};

type EditableRubricFields = Partial<Pick<RubricState, 'name' | 'description' | 'criteria'>> & {
  feedback?: { Strengths: string; 'Areas for Improvement': string };
};

interface RubricStoreState {
  /** Default rubrics followed by the user's custom rubrics. */
  rubricOptions: RubricState[];
  customRubrics: RubricState[];
  /** uid whose custom rubrics are loaded, or null. */
  customRubricsUid: string | null;
  customRubricsLoading: boolean;
  selectedRubric: RubricState | null;
  /** True once the user explicitly picks a rubric; suppresses auto-suggestion. */
  rubricChosenByUser: boolean;
  gradingData: GradingData;

  setSelectedRubric: (rubric: RubricState | null) => void;
  setGradingData: (data: Partial<GradingData>) => void;
  /** Re-pick the suggested rubric for the current profile/assignment, unless the user chose one. */
  refreshSuggestedRubric: () => void;
  fetchCustomRubrics: (uid: string | null) => Promise<void>;
  addCustomRubric: (rubric: RubricState) => Promise<RubricState>;
  updateCustomRubric: (rubricId: string, updates: EditableRubricFields) => Promise<void>;
  deleteCustomRubric: (rubricId: string) => Promise<void>;
  copyDefaultRubric: (rubric: RubricState) => Promise<RubricState>;
}

function requireUid(action: string): string {
  const { uid } = useAuthStore.getState();
  if (!uid) throw new Error(`User ID is required to ${action}.`);
  return uid;
}

function suggestionContext(gradingData: GradingData) {
  const profile = useProfileStore.getState().profile;
  return {
    identity: profile.identity,
    identityLevel: profile.identityLevel,
    textType: gradingData.textType,
    favoriteIds: profile.favoriteRubrics,
  };
}

export const useRubricStore = create<RubricStoreState>((set, get) => {
  const withCustom = (customRubrics: RubricState[]) => ({
    customRubrics,
    rubricOptions: [...defaultRubrics, ...customRubrics],
  });

  const saveNewCustomRubric = async (rubric: RubricState, uid: string): Promise<RubricState> => {
    const ref = doc(collection(db, 'users', uid, 'custom_rubrics'));
    const saved = { ...rubric, id: ref.id, timestamp: Timestamp.now(), isCustom: true } as RubricState;
    await setDoc(ref, saved);
    set((state) => withCustom([...state.customRubrics, saved]));
    return saved;
  };

  return {
    rubricOptions: defaultRubrics,
    customRubrics: [],
    customRubricsUid: null,
    customRubricsLoading: false,
    selectedRubric: pickSuggestedRubric(defaultRubrics, suggestionContext(initialGradingData)),
    rubricChosenByUser: false,
    gradingData: initialGradingData,

    setSelectedRubric: (rubric) =>
      set((state) => ({
        selectedRubric: rubric,
        rubricChosenByUser: rubric !== null,
        gradingData: { ...state.gradingData, rubric },
      })),

    setGradingData: (data) => set((state) => ({ gradingData: { ...state.gradingData, ...data } })),

    refreshSuggestedRubric: () => {
      const { rubricChosenByUser, rubricOptions, gradingData, selectedRubric } = get();
      if (rubricChosenByUser) return;
      const suggested = pickSuggestedRubric(rubricOptions, suggestionContext(gradingData));
      if (suggested?.id !== selectedRubric?.id) set({ selectedRubric: suggested });
    },

    fetchCustomRubrics: async (uid) => {
      if (!uid) return;
      set({ customRubricsLoading: true });
      try {
        const snapshot = await getDocs(collection(db, 'users', uid, 'custom_rubrics'));
        const fetched = snapshot.docs.map(
          (d) => ({ ...d.data(), id: d.id, type: d.data().type as RubricType, isCustom: true }) as RubricState
        );
        set({ ...withCustom(fetched), customRubricsUid: uid });
      } catch (error) {
        console.error('Error fetching custom rubrics:', error);
        set({ customRubricsUid: uid });
      } finally {
        set({ customRubricsLoading: false });
      }
    },

    addCustomRubric: async (rubric) => {
      const uid = requireUid('add a custom rubric');
      try {
        return await saveNewCustomRubric(rubric, uid);
      } catch (error) {
        console.error('Failed to add rubric to Firebase:', error);
        throw error;
      }
    },

    updateCustomRubric: async (rubricId, updates) => {
      const uid = requireUid('update a custom rubric');
      const sanitized: EditableRubricFields = {
        name: updates.name,
        description: updates.description,
        criteria: updates.criteria,
      };
      if (updates.feedback) sanitized.feedback = updates.feedback;

      try {
        await updateDoc(doc(db, 'users', uid, 'custom_rubrics', rubricId), sanitized);
        set((state) => {
          const apply = (r: RubricState) => (r.id === rubricId ? ({ ...r, ...sanitized } as RubricState) : r);
          const selectedRubric = state.selectedRubric ? apply(state.selectedRubric) : null;
          return {
            ...withCustom(state.customRubrics.map(apply)),
            selectedRubric,
            gradingData: { ...state.gradingData, rubric: selectedRubric },
          };
        });
      } catch (error) {
        console.error('Failed to update rubric in Firebase:', error);
        throw error;
      }
    },

    deleteCustomRubric: async (rubricId) => {
      const uid = requireUid('delete a custom rubric');
      try {
        await deleteDoc(doc(db, 'users', uid, 'custom_rubrics', rubricId));
        set((state) => {
          const wasSelected = state.selectedRubric?.id === rubricId;
          const selectedRubric = wasSelected ? null : state.selectedRubric;
          return {
            ...withCustom(state.customRubrics.filter((r) => r.id !== rubricId)),
            selectedRubric,
            rubricChosenByUser: wasSelected ? false : state.rubricChosenByUser,
            gradingData: { ...state.gradingData, rubric: selectedRubric },
          };
        });
      } catch (error) {
        console.error('Failed to delete rubric from Firebase:', error);
        throw error;
      }
    },

    copyDefaultRubric: async (rubric) => {
      const uid = requireUid('copy a rubric');
      try {
        return await saveNewCustomRubric({ ...rubric, name: `Copy of ${rubric.name}` }, uid);
      } catch (error) {
        console.error('Failed to copy rubric to Firebase:', error);
        throw error;
      }
    },
  };
});
