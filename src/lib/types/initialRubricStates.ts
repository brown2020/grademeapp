import { RubricType, type RubricState } from '@/lib/types/rubrics-types';

const LEVELS_TEMPLATE = {
  Excellent: '',
  Proficient: '',
  Developing: '',
  Beginning: '',
};

/**
 * Blank rubric documents per type. These are the exact shapes persisted to
 * `users/{uid}/custom_rubrics/{id}` (plus id/timestamp/isCustom on save).
 */
const INITIAL_RUBRICS: Record<RubricType, RubricState> = {
  [RubricType.Analytical]: { id: '', name: '', description: '', type: RubricType.Analytical, criteria: {} },
  [RubricType.Holistic]: {
    id: '',
    name: '',
    description: '',
    type: RubricType.Holistic,
    criteria: { ...LEVELS_TEMPLATE },
  },
  [RubricType.SinglePoint]: {
    id: '',
    name: '',
    description: '',
    type: RubricType.SinglePoint,
    criteria: { Proficient: '' },
    feedback: { Strengths: '', 'Areas for Improvement': '' },
  },
  [RubricType.SkillFocused]: { id: '', name: '', description: '', type: RubricType.SkillFocused, criteria: {} },
  [RubricType.Checklist]: {
    id: '',
    name: '',
    description: '',
    type: RubricType.Checklist,
    criteria: {
      'Has a clear introduction': 'Yes/No',
      'Main idea is developed with supporting details': 'Yes/No',
      'Organized logically': 'Yes/No',
    },
  },
  [RubricType.PrimaryTrait]: { id: '', name: '', description: '', type: RubricType.PrimaryTrait, criteria: {} },
  [RubricType.MultiTrait]: { id: '', name: '', description: '', type: RubricType.MultiTrait, criteria: {} },
  [RubricType.ContentSpecific]: { id: '', name: '', description: '', type: RubricType.ContentSpecific, criteria: {} },
  [RubricType.Developmental]: { id: '', name: '', description: '', type: RubricType.Developmental, criteria: {} },
  [RubricType.TaskSpecific]: { id: '', name: '', description: '', type: RubricType.TaskSpecific, criteria: {} },
  [RubricType.StandardsBased]: { id: '', name: '', description: '', type: RubricType.StandardsBased, criteria: {} },
};

/** Returns a fresh (deep-copied) blank rubric of the given type. */
export function getInitialRubricState(type: RubricType): RubricState {
  const template = INITIAL_RUBRICS[type] ?? INITIAL_RUBRICS[RubricType.Analytical];
  return structuredClone(template);
}
