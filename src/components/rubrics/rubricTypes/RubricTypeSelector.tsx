// RubricTypeSelector.tsx

import React from 'react';
import AnalyticalCriteriaBuilder from '@/components/rubrics/rubricTypes/AnalyticalCriteriaBuilder';
import ChecklistCriteriaBuilder from '@/components/rubrics/rubricTypes/ChecklistCriteriaBuilder';
import HolisticCriteriaBuilder from '@/components/rubrics/rubricTypes/HolisticCriteriaBuilder';
import SinglePointCriteriaBuilder from '@/components/rubrics/rubricTypes/SinglePointCriteriaBuilder';
import ContentSpecificCriteriaBuilder from '@/components/rubrics/rubricTypes/ContentSpecificCriteriaBuilder';
import DevelopmentalCriteriaBuilder from '@/components/rubrics/rubricTypes/DevelopmentalCriteriaBuilder';
import MultiTraitCriteriaBuilder from '@/components/rubrics/rubricTypes/MultiTraitCriteriaBuilder';
import PrimaryTraitCriteriaBuilder from '@/components/rubrics/rubricTypes/PrimaryTraitCriteriaBuilder';
import { RubricType, RubricState, SinglePointRubric, ChecklistRubric, AnalyticalRubric, HolisticRubric, MultiTraitRubric, OtherRubricType } from '@/lib/types/rubrics-types';


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
      return (
        <AnalyticalCriteriaBuilder
          rubric={rubric as AnalyticalRubric}
          onChange={onChange}
          hasSaved={hasSaved}
          setHasSaved={setHasSaved}
        />
      );
    case RubricType.Holistic:
      return <HolisticCriteriaBuilder rubric={rubric as HolisticRubric} onChange={onChange} />;
    case RubricType.SinglePoint:
      return <SinglePointCriteriaBuilder rubric={rubric as SinglePointRubric} onChange={(updatedRubric: Partial<RubricState>) => onChange(updatedRubric as RubricState)} />;
    case RubricType.Checklist:
      return <ChecklistCriteriaBuilder rubric={rubric as ChecklistRubric} onChange={(updatedRubric: Partial<RubricState>) => onChange(updatedRubric as RubricState)} />;
    case RubricType.ContentSpecific:
      return (
        <ContentSpecificCriteriaBuilder rubric={rubric as OtherRubricType} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.Developmental:
      return (
        <DevelopmentalCriteriaBuilder rubric={rubric as OtherRubricType} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.MultiTrait:
      return (
        <MultiTraitCriteriaBuilder rubric={rubric as MultiTraitRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.PrimaryTrait:
      return (
        <PrimaryTraitCriteriaBuilder rubric={rubric as OtherRubricType} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    default:
      return null;
  }
};

export default RubricTypeSelector;
