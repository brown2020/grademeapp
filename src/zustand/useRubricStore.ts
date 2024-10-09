import { create } from 'zustand';
import { RubricState } from '@/types/rubrics-types';
import { GradingData } from '@/types/grading-data';
import { flattenRubrics } from '@/utils/flattenRubrics';
import { getDefaultRubrics } from "@/constants/rubrics_new";


interface RubricStoreState {
    rubricOptions: RubricState[];
    selectedRubric: RubricState | null;
    gradingData: GradingData;
    useCustomRubrics: boolean;
    setUseCustomRubrics: (useCustomRubrics: boolean) => void;
    setRubricOptions: (options: RubricState[]) => void;
    setSelectedRubric: (rubric: RubricState) => void;
    setGradingData: (data: Partial<GradingData>) => void;
}

export const useRubricStore = create<RubricStoreState>((set) => ({
    rubricOptions: flattenRubrics(),
    selectedRubric: getDefaultRubrics()[0],
    gradingData: {
        identity: 'person',
        identityLevel: 'normal',
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
    },
    useCustomRubrics: false,
    setUseCustomRubrics: (useCustomRubrics) => set({ useCustomRubrics }),
    setRubricOptions: (options) => set({ rubricOptions: options }),
    setSelectedRubric: (rubric) => set((state) => ({ selectedRubric: rubric, gradingData: { ...state.gradingData, rubric } })),
    setGradingData: (data) => set((state) => ({ gradingData: { ...state.gradingData, ...data } })),
}));
