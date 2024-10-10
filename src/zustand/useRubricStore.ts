import { create } from 'zustand';
import { RubricState, RubricType, GenericRubricCriteria } from '@/types/rubrics-types';
import { GradingData } from '@/types/grading-data';
import rawRubrics from '@/constants/rubrics.json';

interface RubricStoreState {
    rubricOptions: RubricState[];
    filteredRubrics: RubricState[];
    selectedRubric: RubricState | null;
    gradingData: GradingData;
    useCustomRubrics: boolean;
    setUseCustomRubrics: (useCustomRubrics: boolean) => void;
    setRubricOptions: (options: RubricState[]) => void;
    setFilteredRubrics: (filtered: RubricState[]) => void;
    setSelectedRubric: (rubric: RubricState | null) => void;
    setGradingData: (data: Partial<GradingData>) => void;
    resetToDefaultRubrics: () => void;
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
        identity: '',
        identityLevel: '',
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
    // Toggle between custom and default rubrics
    setUseCustomRubrics: (useCustomRubrics) => {
        if (useCustomRubrics) {
            set({ useCustomRubrics });
        } else {
            get().resetToDefaultRubrics();
            set({ useCustomRubrics });
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
        });
    }
}));
