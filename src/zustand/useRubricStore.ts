import { create } from 'zustand';
import { useAuthStore } from '@/zustand/useAuthStore';
import { RubricState, RubricType, GenericRubricCriteria } from '@/types/rubrics-types';
import { getInitialRubricState } from '@/types/initialRubricStates';
import { GradingData } from '@/types/grading-data';
import { db } from '@/firebase/firebaseClient';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import rawRubrics from '@/constants/rubrics.json';


interface RubricStoreState {
  rubricOptions: RubricState[];
  filteredRubrics: RubricState[];
  selectedRubric: RubricState | null;
  gradingData: GradingData;
  useCustomRubrics: boolean;
  customRubricsLoaded: boolean;
  showRubricBuilder: boolean;
  editingRubricId?: string;
  activeRubric: RubricState | null;
  showDeleteModal: boolean;
  rubricToDelete: string | null;
  setShowDeleteModal: (show: boolean) => void;
  setRubricToDelete: (id: string | null) => void;
  createNewRubric: (type: RubricType) => void;
  clearActiveRubric: () => void;
  setActiveRubric: (rubric: RubricState | null) => void;
  updateActiveRubric: (updates: Partial<RubricState>) => void;
  setEditingRubricId: (id: string | undefined) => void;
  setShowRubricBuilder: (show: boolean) => void;
  setUseCustomRubrics: (useCustomRubrics: boolean) => void;
  fetchCustomRubrics: (uid: string | null) => Promise<void>;
  setRubricOptions: (options: RubricState[]) => void;
  setFilteredRubrics: (filtered: RubricState[]) => void;
  setSelectedRubric: (rubric: RubricState | null) => void;
  setGradingData: (data: Partial<GradingData>) => void;
  resetToDefaultRubrics: () => void;
  addCustomRubric: (rubric: RubricState) => void;
  updateCustomRubric: (rubricId: string, updatedRubric: Partial<RubricState>) => void;
  deleteCustomRubric: (rubricId: string) => void;
}

// Type guard to ensure the object matches RubricState
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

// Filter and map raw rubrics to ensure type safety
const defaultRubrics: RubricState[] = rawRubrics
  .filter(isValidRubricState)
  .map((rubric) => ({
    ...rubric,
    type: RubricType[rubric.type as keyof typeof RubricType] ?? RubricType.Analytical,
    tags: rubric.tags || [],
    criteria: rubric.criteria as unknown as GenericRubricCriteria,
  })) as RubricState[];

export const useRubricStore = create<RubricStoreState>((set, get) => ({
  rubricOptions: defaultRubrics,
  filteredRubrics: defaultRubrics,
  selectedRubric: defaultRubrics.length > 0 ? defaultRubrics[0] : null,
  gradingData: {
    assigner: '',
    topic: '',
    prose: '',
    audience: '',
    wordLimitType: 'less than',
    wordLimit: '',
    rubric: defaultRubrics.length > 0 ? defaultRubrics[0] : null,
    customRubric: '',
    textType: '',
    title: '',
    text: '',
  },
  useCustomRubrics: false,
  customRubricsLoaded: false,
  showRubricBuilder: false,
  setShowRubricBuilder: (show) => set({ showRubricBuilder: show }),
  editingRubricId: undefined,
  setEditingRubricId: (id) => set({ editingRubricId: id }),
  activeRubric: null,
  setActiveRubric: (rubric) => set({ activeRubric: rubric }),
  updateActiveRubric: (updates) =>
    set((state) => ({
      activeRubric: state.activeRubric ? { ...state.activeRubric, ...updates } as RubricState : null,
    })),
  createNewRubric: (type) => set({ activeRubric: getInitialRubricState(type) }),
  clearActiveRubric: () => set({ activeRubric: null }),
  showDeleteModal: false,
  rubricToDelete: null,
  setShowDeleteModal: (show) => set({ showDeleteModal: show }),
  setRubricToDelete: (id) => set({ rubricToDelete: id }),
  // Toggle between custom and default rubrics
  setUseCustomRubrics: async (useCustomRubrics) => {
    const { uid } = useAuthStore.getState();
    if (!uid) {
      console.warn('Cannot toggle custom rubrics without a valid user ID.');
      return;
    }

    set({ useCustomRubrics, customRubricsLoaded: false });

    if (useCustomRubrics) {
      await get().fetchCustomRubrics(uid);
    } else {
      get().resetToDefaultRubrics();
    }
  },

  // Toggle custom rubric usage and fetch custom rubrics if enabled
  fetchCustomRubrics: async (uid: string | null) => {
    if (!uid) {
      console.warn('User ID is required to fetch custom rubrics.');
      return;
    }

    try {
      const customRubricCollection = collection(db, "users", uid, "custom_rubrics");
      const customRubricSnapshot = await getDocs(customRubricCollection);
      const fetchedRubrics = customRubricSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as RubricState[];

      set({
        rubricOptions: fetchedRubrics,
        filteredRubrics: fetchedRubrics,
        selectedRubric: fetchedRubrics[0] || null,
        customRubricsLoaded: true,
      });
    } catch (error) {
      console.error("Error fetching custom rubrics:", error);
    }
  },

  setRubricOptions: (options) => set({ rubricOptions: options }),
  setFilteredRubrics: (filtered) => set({ filteredRubrics: filtered }),
  setSelectedRubric: (rubric) => set((state) => ({ selectedRubric: rubric, gradingData: { ...state.gradingData, rubric } })),
  setGradingData: (data) => set((state) => ({ gradingData: { ...state.gradingData, ...data } })),

  resetToDefaultRubrics: () => {
    set({
      rubricOptions: defaultRubrics,
      filteredRubrics: defaultRubrics,
      selectedRubric: defaultRubrics.length > 0 ? defaultRubrics[0] : null,
      gradingData: {
        ...get().gradingData,
        rubric: defaultRubrics.length > 0 ? defaultRubrics[0] : null,
      },
      customRubricsLoaded: false,
    });
  },

  // Add a new custom rubric to both Firebase and local state
  addCustomRubric: async (rubric) => {
    const { uid } = useAuthStore.getState();
    if (!uid) {
      console.error("User ID is required to add a custom rubric.");
      return;
    }

    try {
      // Create a new document reference with an auto-generated ID
      const customRubricRef = doc(collection(db, "users", uid, "custom_rubrics"));
      const generatedId = customRubricRef.id;
      console.log("Generated ID:", generatedId);

      // Add the generated ID to the rubric object
      const rubricWithId = { ...rubric, id: generatedId, timestamp: Timestamp.now() };

      // Save the rubric to Firestore
      await setDoc(customRubricRef, rubricWithId);

      // Update the local state
      set((state) => ({
        rubricOptions: [...state.rubricOptions, rubricWithId],
        filteredRubrics: state.useCustomRubrics ? [...state.filteredRubrics, rubricWithId] : state.filteredRubrics,
      }));

      console.log("Rubric created successfully with ID:", generatedId);
    } catch (error) {
      console.error("Failed to add rubric to Firebase:", error);
      throw error; // Rethrow if needed for error handling in components
    }
  },


  // Update an existing custom rubric in Firebase and local state
  updateCustomRubric: async (rubricId, updatedRubric) => {
    const { uid } = useAuthStore.getState();
    if (!uid) {
      console.error("User ID is required to update a custom rubric.");
      return;
    }

    try {
      const customRubricRef = doc(db, "users", uid, "custom_rubrics", rubricId);

      // Ensure that the updatedRubric object has the correct structure
      const sanitizedUpdatedRubric = {
        name: updatedRubric.name,
        description: updatedRubric.description,
        type: updatedRubric.type,
        criteria: updatedRubric.criteria,
        // Add any other fields that should be updated
      };

      // Update the document in Firebase
      await updateDoc(customRubricRef, sanitizedUpdatedRubric);

      set((state) => {
        const updateRubric = (rubric: RubricState) =>
          rubric.id === rubricId ? { ...rubric, ...sanitizedUpdatedRubric } : rubric;

        const updatedRubricOptions = state.rubricOptions.map(updateRubric);
        const updatedFilteredRubrics = state.filteredRubrics.map(updateRubric);
        const selectedRubric = state.selectedRubric?.id === rubricId
          ? { ...state.selectedRubric, ...sanitizedUpdatedRubric }
          : state.selectedRubric;

        return {
          rubricOptions: updatedRubricOptions,
          filteredRubrics: updatedFilteredRubrics,
          selectedRubric,
          gradingData: {
            ...state.gradingData,
            rubric: selectedRubric,
          },
        } as Partial<RubricStoreState>;
      });
    } catch (error) {
      console.error("Failed to update rubric in Firebase:", error);
      throw error;
    }
  },

  // Delete a custom rubric from Firebase and local state
  deleteCustomRubric: async (rubricId) => {
    const { uid } = useAuthStore.getState();
    if (!uid) {
      console.error("User ID is required to add a custom rubric.");
      return;
    }

    if (!rubricId) {
      console.error("Rubric ID is required to delete a custom rubric.");
      return;
    }

    try {
      const customRubricRef = doc(db, "users", uid, "custom_rubrics", rubricId);

      await deleteDoc(customRubricRef);

      set((state) => {
        const updatedRubricOptions = state.rubricOptions.filter((rubric) => rubric.id !== rubricId);
        const updatedFilteredRubrics = state.filteredRubrics.filter((rubric) => rubric.id !== rubricId);
        const selectedRubric = state.selectedRubric?.id === rubricId ? null : state.selectedRubric;

        return {
          rubricOptions: updatedRubricOptions,
          filteredRubrics: updatedFilteredRubrics,
          selectedRubric,
          gradingData: {
            ...state.gradingData,
            rubric: selectedRubric,
          },
        };
      });
    } catch (error) {
      console.error("Failed to delete rubric from Firebase:", error);
      throw error;
    }
  },
}));