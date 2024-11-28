import React from 'react';
import { HolisticRubric, GenericRubricCriteria } from '@/lib/types/rubrics-types';

interface HolisticRubricBuilderProps {
  rubric: HolisticRubric;
  onChange: (updatedRubric: HolisticRubric) => void;
}

const HolisticRubricBuilder: React.FC<HolisticRubricBuilderProps> = ({ rubric, onChange }) => {
  const handleLevelChange = (level: keyof HolisticRubric['criteria'], value: string) => {
    const updatedCriteria = { ...rubric.criteria, [level]: value };
    onChange({ ...rubric, criteria: updatedCriteria });
  };

  return (
    <div className="mb-4">
      <h3 className="text-primary-30 text-center font-semibold">Add Level Descriptions</h3>
      <hr />
      {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as Array<keyof HolisticRubric['criteria']>).map((level) => (
        <div key={level} className="mb-2">
          <label className="block text-sm font-semibold">{level}</label>
          <textarea
            value={typeof (rubric.criteria as GenericRubricCriteria)[level] === 'string' ? (rubric.criteria as GenericRubricCriteria)[level] as string : ''}
            onChange={(e) => handleLevelChange(level, e.target.value)}
            className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
            rows={2}
          />
        </div>
      ))}
    </div>
  );
};

export default HolisticRubricBuilder;