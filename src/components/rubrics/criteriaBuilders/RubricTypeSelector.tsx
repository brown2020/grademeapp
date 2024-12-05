// RubricTypeSelector.tsx

import React from 'react';
import AnalyticalCriteriaBuilder from '@/components/rubrics/criteriaBuilders/AnalyticalCriteriaBuilder';
import ChecklistCriteriaBuilder from '@/components/rubrics/criteriaBuilders/ChecklistCriteriaBuilder';
import HolisticCriteriaBuilder from '@/components/rubrics/criteriaBuilders/HolisticCriteriaBuilder';
import SinglePointCriteriaBuilder from '@/components/rubrics/criteriaBuilders/SinglePointCriteriaBuilder';
import ContentSpecificCriteriaBuilder from '@/components/rubrics/criteriaBuilders/ContentSpecificCriteriaBuilder';
import DevelopmentalCriteriaBuilder from '@/components/rubrics/criteriaBuilders/DevelopmentalCriteriaBuilder';
import MultiTraitCriteriaBuilder from '@/components/rubrics/criteriaBuilders/MultiTraitCriteriaBuilder';
import PrimaryTraitCriteriaBuilder from '@/components/rubrics/criteriaBuilders/PrimaryTraitCriteriaBuilder';
import SkillFocusedCriteriaBuilder from '@/components/rubrics/criteriaBuilders/SkillFocusedCriteriaBuilder';
import StandardsBasedCriteriaBuilder from '@/components/rubrics/criteriaBuilders/StandardsBasedCriteriaBuilder';
import TaskSpecificCriteriaBuilder from '@/components/rubrics/criteriaBuilders/TaskSpecificCriteriaBuilder';
import {
  RubricType,
  RubricState,
  SinglePointRubric,
  ChecklistRubric,
  AnalyticalRubric,
  HolisticRubric,
  MultiTraitRubric,
  ContentSpecificRubric,
  DevelopmentalRubric,
  PrimaryTraitRubric,
  SkillFocusedRubric,
  StandardsBasedRubric,
  TaskSpecificRubric,
} from '@/lib/types/rubrics-types';


interface RubricTypeSelectorProps {
  rubric: RubricState;
  onChange: (updatedRubric: RubricState) => void;
  setHasSaved: (hasSaved: boolean) => void;
  hasSaved: boolean;
}

const RubricTypeSelector: React.FC<RubricTypeSelectorProps> = ({
  rubric,
  onChange,
  hasSaved,
  setHasSaved,
}) => {
  switch (rubric.type) {
    case RubricType.Analytical:
      return <AnalyticalCriteriaBuilder rubric={rubric as AnalyticalRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />;
    case RubricType.Holistic:
      return <HolisticCriteriaBuilder rubric={rubric as HolisticRubric} onChange={onChange} />;
    case RubricType.SinglePoint:
      return <SinglePointCriteriaBuilder rubric={rubric as SinglePointRubric} onChange={(updatedRubric: Partial<RubricState>) => onChange(updatedRubric as RubricState)} />;
    case RubricType.Checklist:
      return <ChecklistCriteriaBuilder rubric={rubric as ChecklistRubric} onChange={(updatedRubric: Partial<RubricState>) => onChange(updatedRubric as RubricState)} />;
    case RubricType.ContentSpecific:
      return <ContentSpecificCriteriaBuilder rubric={rubric as ContentSpecificRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />;
    case RubricType.Developmental:
      return (
        <DevelopmentalCriteriaBuilder rubric={rubric as DevelopmentalRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.MultiTrait:
      return (
        <MultiTraitCriteriaBuilder rubric={rubric as MultiTraitRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.PrimaryTrait:
      return (
        <PrimaryTraitCriteriaBuilder rubric={rubric as PrimaryTraitRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.SkillFocused:
      return (
        <SkillFocusedCriteriaBuilder rubric={rubric as SkillFocusedRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.StandardsBased:
      return (
        <StandardsBasedCriteriaBuilder rubric={rubric as StandardsBasedRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.TaskSpecific:
      return (
        <TaskSpecificCriteriaBuilder rubric={rubric as TaskSpecificRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    default:
      return null;
  }
};

export default RubricTypeSelector;
