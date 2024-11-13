// RubricTypeSelector.tsx

import React from 'react';
import { RubricType, RubricState, AnalyticalRubric, ChecklistRubric, HolisticRubric, SinglePointRubric } from '@/types/rubrics-types';
import AnalyticalRubricBuilder from '@/components/rubrics/rubricTypes/AnalyticalRubricBuilder';
import ChecklistRubricBuilder from '@/components/rubrics/rubricTypes/ChecklistRubricBuilder';
import HolisticRubricBuilder from '@/components/rubrics/rubricTypes/HolisticRubricBuilder';
import SinglePointRubricBuilder from '@/components/rubrics/rubricTypes/SinglePointRubricBuilder';


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
    default:
      return null; // Or a fallback component
  }
};

export default RubricTypeSelector;
