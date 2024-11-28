// RubricTypeSelector.tsx

import React from 'react';
import { useRubricStore } from '@/zustand/useRubricStore';
import AnalyticalRubricBuilder from '@/components/rubrics/rubricTypes/AnalyticalRubricBuilder';
import ChecklistRubricBuilder from '@/components/rubrics/rubricTypes/ChecklistRubricBuilder';
import HolisticRubricBuilder from '@/components/rubrics/rubricTypes/HolisticRubricBuilder';
import SinglePointRubricBuilder from '@/components/rubrics/rubricTypes/SinglePointRubricBuilder';
import ContentSpecificRubricBuilder from './ContentSpecificRubricBuilder';
import DevelopmentalRubricBuilder from './DevelopmentalRubricBuilder';
import { RubricType, AnalyticalRubric, HolisticRubric, SinglePointRubric, ChecklistRubric, OtherRubricType } from '@/lib/types/rubrics-types';


interface RubricTypeSelectorProps {
  setHasSaved: (hasSaved: boolean) => void;
  hasSaved: boolean;
}

const RubricTypeSelector: React.FC<RubricTypeSelectorProps> = ({
  hasSaved,
  setHasSaved,
}) => {
  const { activeRubric, updateActiveRubric } = useRubricStore();

  if (!activeRubric) return null;

  // console.log(activeRubric);

  switch (activeRubric.type) {
    case RubricType.Analytical:
      return (
        <AnalyticalRubricBuilder rubric={activeRubric as AnalyticalRubric} onChange={updateActiveRubric} hasSaved={hasSaved} setHasSaved={setHasSaved} />
      );
    case RubricType.Holistic:
      return <HolisticRubricBuilder rubric={activeRubric as HolisticRubric} onChange={updateActiveRubric} />;
    case RubricType.SinglePoint:
      return <SinglePointRubricBuilder rubric={activeRubric as SinglePointRubric} onChange={updateActiveRubric} />;
    case RubricType.Checklist:
      return <ChecklistRubricBuilder rubric={activeRubric as ChecklistRubric} onChange={updateActiveRubric} />;
    case RubricType.ContentSpecific:
      return <ContentSpecificRubricBuilder rubric={activeRubric as OtherRubricType} onChange={updateActiveRubric} hasSaved={hasSaved} setHasSaved={setHasSaved} />;
    case RubricType.Developmental:
      return <DevelopmentalRubricBuilder rubric={activeRubric as OtherRubricType} onChange={updateActiveRubric} hasSaved={hasSaved} setHasSaved={setHasSaved} />;
    default:
      return null; // Or a fallback component
  }
};

export default RubricTypeSelector;
