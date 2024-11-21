import React from 'react';
import { SinglePointRubric, GenericRubricCriteria, RubricState } from '@/types/rubrics-types';

interface SinglePointRubricBuilderProps {
  rubric: SinglePointRubric;
  onChange: (updatedRubric: Partial<RubricState>) => void;
}

const SinglePointRubricBuilder: React.FC<SinglePointRubricBuilderProps> = ({ rubric, onChange }) => {
  const handleChange = (field: keyof SinglePointRubric['criteria'] | 'Strengths' | 'Areas for Improvement', value: string) => {
    const feedback = rubric.feedback || { Strengths: '', "Areas for Improvement": '' };
    if (field === 'Proficient') {
      onChange({
        criteria: {
          ...rubric.criteria,
          [field]: value,
        },
      });
    } else if (field === 'Strengths' || field === 'Areas for Improvement') {
      onChange({
        feedback: {
          ...feedback,
          [field]: value,
        },
      });
    }
  };

  return (
    <div className="mb-2">
      <h3 className="text-primary-30 text-center font-semibold">Single Point Criterion</h3>
      <hr />
      <div className="mb-1">
        <label className="block font-semibold">Proficient</label>
        <textarea
          value={typeof (rubric.criteria as GenericRubricCriteria).Proficient === 'string' ? (rubric.criteria as GenericRubricCriteria).Proficient as string : ''}
          onChange={(e) => handleChange('Proficient', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>
      <div className="mb-1">
        <label className="block font-semibold">Strengths</label>
        <textarea
          value={rubric.feedback?.Strengths || ''}
          onChange={(e) => handleChange('Strengths', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>
      <div className="mb-1">
        <label className="block font-semibold">Areas for Improvement</label>
        <textarea
          value={rubric.feedback?.["Areas for Improvement"] || ''}
          onChange={(e) => handleChange('Areas for Improvement', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>
    </div>
  );
};

export default SinglePointRubricBuilder;