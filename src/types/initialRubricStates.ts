// initialRubricStates.ts
import { RubricType, AnalyticalRubric, HolisticRubric, SinglePointRubric, ChecklistRubric, OtherRubricType } from '@/types/rubrics-types';

export const initialAnalyticalRubric: AnalyticalRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Analytical,
  criteria: {},
};

export const initialHolisticRubric: HolisticRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Holistic,
  criteria: {
    Excellent: '',
    Proficient: '',
    Developing: '',
    Beginning: '',
  },
};

export const initialSinglePointRubric: SinglePointRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.SinglePoint,
  criteria: {
    Proficient: ''
  },
  feedback: {
    Strengths: '',
    "Areas for Improvement": ''
  }
};

export const initialChecklistRubric: ChecklistRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Checklist,
  criteria: {
    "Has a clear introduction": "Yes/No",
    "Main idea is developed with supporting details": "Yes/No",
    "Organized logically": "Yes/No",
  }
};

export const initialContentSpecificRubric: OtherRubricType = {
  id: '',
  name: '',
  description: '',
  type: RubricType.ContentSpecific,
  criteria: {}
};

export const initialDevelopmentalRubric: OtherRubricType = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Developmental,
  criteria: {}
};

export const getInitialRubricState = (type: RubricType) => {
  switch (type) {
    case RubricType.Analytical:
      return initialAnalyticalRubric;
    case RubricType.Holistic:
      return initialHolisticRubric;
    case RubricType.SinglePoint:
      return initialSinglePointRubric;
    case RubricType.Checklist:
      return initialChecklistRubric;
    case RubricType.ContentSpecific:
      return initialContentSpecificRubric;
    case RubricType.Developmental:
      return initialDevelopmentalRubric;
    default:
      return initialAnalyticalRubric;
  }
};