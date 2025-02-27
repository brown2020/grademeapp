// initialRubricStates.ts
import {
  RubricType,
  AnalyticalRubric,
  HolisticRubric,
  SinglePointRubric,
  ChecklistRubric,
  MultiTraitRubric,
  PrimaryTraitRubric,
  SkillFocusedRubric,
  ContentSpecificRubric,
  DevelopmentalRubric,
  TaskSpecificRubric,
  StandardsBasedRubric,
} from '@/lib/types/rubrics-types';

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

export const initialSkillFocusedRubric: SkillFocusedRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.SkillFocused,
  criteria: {}
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

export const initialPrimaryTraitRubric: PrimaryTraitRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.PrimaryTrait,
  criteria: {}
};

export const initialMultiTraitRubric: MultiTraitRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.MultiTrait,
  criteria: {
    "Trait 1": {
      description: ' ',
      subCriteria: {
        "Sub-trait 1": {
          description: '',
          levels: {
            "Level 1": '',
            "Level 2": '',
            "Level 3": '',
            "Level 4": '',
          }
        }
      }
    }
  }
};

export const initialContentSpecificRubric: ContentSpecificRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.ContentSpecific,
  criteria: {}
};

export const initialDevelopmentalRubric: DevelopmentalRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Developmental,
  criteria: {}
};

export const initialTaskSpecificRubric: TaskSpecificRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.TaskSpecific,
  criteria: {}
};

export const initialStandardsBasedRubric: StandardsBasedRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.StandardsBased,
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
    case RubricType.PrimaryTrait:
      return initialPrimaryTraitRubric;
    case RubricType.MultiTrait:
      return initialMultiTraitRubric;
    case RubricType.SkillFocused:
      return initialSkillFocusedRubric;
    case RubricType.TaskSpecific:
      return initialTaskSpecificRubric;
    case RubricType.StandardsBased:
      return initialStandardsBasedRubric;
    default:
      return initialAnalyticalRubric;
  }
};