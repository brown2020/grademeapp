// RubricTypeSelector.tsx

import React from 'react';
import { RubricType, RubricState, AnalyticalRubric, ChecklistRubric, HolisticRubric, SinglePointRubric, OtherRubricType } from '@/types/rubrics-types';
import AnalyticalRubricBuilder from '@/components/rubrics/rubricTypes/AnalyticalRubricBuilder';
import ChecklistRubricBuilder from '@/components/rubrics/rubricTypes/ChecklistRubricBuilder';
import HolisticRubricBuilder from '@/components/rubrics/rubricTypes/HolisticRubricBuilder';
import SinglePointRubricBuilder from '@/components/rubrics/rubricTypes/SinglePointRubricBuilder';
import ContentSpecificRubricBuilder from './ContentSpecificRubricBuilder';
import DevelopmentalRubricBuilder from './DevelopmentalRubricBuilder';


interface RubricTypeSelectorProps {
  rubricType: RubricType;
  rubric: RubricState;
  onChange: (rubric: RubricState) => void;
  setHasSaved: (hasSaved: boolean) => void;
  hasSaved: boolean;
}

const RubricTypeSelector: React.FC<RubricTypeSelectorProps> = ({
  rubricType,
  rubric,
  onChange,
  hasSaved,
  setHasSaved,
}) => {
  switch (rubricType) {
    case RubricType.Analytical:
      return rubric.type === RubricType.Analytical ? (
        <AnalyticalRubricBuilder rubric={rubric as AnalyticalRubric} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      ) : null;
    case RubricType.Holistic:
      return <HolisticRubricBuilder rubric={rubric as HolisticRubric} onChange={onChange} />;
    case RubricType.SinglePoint:
      return <SinglePointRubricBuilder rubric={rubric as SinglePointRubric} onChange={onChange} />;
    case RubricType.Checklist:
      return <ChecklistRubricBuilder rubric={rubric as ChecklistRubric} onChange={onChange} />;
    case RubricType.ContentSpecific:
      return <ContentSpecificRubricBuilder rubric={rubric as OtherRubricType} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />;
    case RubricType.Developmental:
      return <DevelopmentalRubricBuilder rubric={rubric as OtherRubricType} onChange={onChange} hasSaved={hasSaved} setHasSaved={setHasSaved} />;
    default:
      return null; // Or a fallback component
  }
};

export default RubricTypeSelector;
