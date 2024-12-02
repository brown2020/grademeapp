// RubricTypeSelector.tsx

import React from 'react';
import AnalyticalRubricBuilder from '@/components/rubrics/rubricTypes/AnalyticalRubricBuilder';
import ChecklistRubricBuilder from '@/components/rubrics/rubricTypes/ChecklistRubricBuilder';
import HolisticRubricBuilder from '@/components/rubrics/rubricTypes/HolisticRubricBuilder';
import SinglePointRubricBuilder from '@/components/rubrics/rubricTypes/SinglePointRubricBuilder';
import ContentSpecificRubricBuilder from './ContentSpecificRubricBuilder';
import DevelopmentalRubricBuilder from './DevelopmentalRubricBuilder';
import { RubricType, RubricState, SinglePointRubric, ChecklistRubric, AnalyticalRubric, HolisticRubric } from '@/lib/types/rubrics-types';


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
        <AnalyticalRubricBuilder
          rubric={rubric as AnalyticalRubric}
          onChange={onChange}
          hasSaved={hasSaved}
          setHasSaved={setHasSaved}
        />
      );
    case RubricType.Holistic:
      return <HolisticRubricBuilder rubric={rubric as HolisticRubric} onChange={onChange} />;
    case RubricType.SinglePoint:
      return <SinglePointRubricBuilder rubric={rubric as SinglePointRubric} onChange={(updatedRubric: Partial<RubricState>) => onChange(updatedRubric as RubricState)} />;
    case RubricType.Checklist:
      return <ChecklistRubricBuilder rubric={rubric as ChecklistRubric} onChange={(updatedRubric: Partial<RubricState>) => onChange(updatedRubric as RubricState)} />;
    case RubricType.ContentSpecific:
      return (
        <ContentSpecificRubricBuilder
          rubric={rubric}
          onChange={onChange}
          hasSaved={hasSaved}
          setHasSaved={setHasSaved}
        />
      );
    case RubricType.Developmental:
      return (
        <DevelopmentalRubricBuilder
          rubric={rubric}
          onChange={onChange}
          hasSaved={hasSaved}
          setHasSaved={setHasSaved}
        />
      );
    default:
      return null;
  }
};

export default RubricTypeSelector;
