import { create } from 'zustand';
import { RubricState } from '@/types/rubrics-types';
import { GradingData } from '@/types/grading-data';
import { flattenRubrics } from '@/utils/flattenRubrics';
import { getDefaultRubrics } from "@/constants/rubrics_new";


interface RubricStoreState {
    rubricOptions: RubricState[];
    filteredRubrics: RubricState[];
    selectedRubric: RubricState | null;
    gradingData: GradingData;
    useCustomRubrics: boolean;
    setUseCustomRubrics: (useCustomRubrics: boolean) => void;
    setRubricOptions: (options: RubricState[]) => void;
    setFilteredRubrics: (filtered: RubricState[]) => void;
    setSelectedRubric: (rubric: RubricState) => void;
    setGradingData: (data: Partial<GradingData>) => void;
}

export const useRubricStore = create<RubricStoreState>((set) => ({
    rubricOptions: flattenRubrics(),
    filteredRubrics: flattenRubrics(),
    selectedRubric: getDefaultRubrics()[0],
    gradingData: {
        identity: '',
        identityLevel: '',
        assigner: '',
        topic: '',
        prose: '',
        audience: '',
        wordLimitType: 'less than',
        wordLimit: '',
        rubric: null,
        customRubric: '',
        textType: '',
        title: '',
        text: '',
    },
    useCustomRubrics: false,
    setUseCustomRubrics: (useCustomRubrics) => set({ useCustomRubrics }),
    setRubricOptions: (options) => set({ rubricOptions: options }),
    setFilteredRubrics: (filtered) => set({ filteredRubrics: filtered }),
    setSelectedRubric: (rubric) => set((state) => ({ selectedRubric: rubric, gradingData: { ...state.gradingData, rubric } })),
    setGradingData: (data) => set((state) => ({ gradingData: { ...state.gradingData, ...data } })),
}));
