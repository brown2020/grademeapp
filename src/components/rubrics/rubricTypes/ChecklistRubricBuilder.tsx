import React, { useState } from 'react';
import { ChecklistRubric, GenericRubricCriteria } from '@/types/rubrics-types';
import { BadgePlus, MinusCircleIcon } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';
import { toast } from 'react-hot-toast';

interface ChecklistRubricBuilderProps {
  rubric: ChecklistRubric;
  onChange: (updatedRubric: ChecklistRubric) => void;
}

const ChecklistRubricBuilder: React.FC<ChecklistRubricBuilderProps> = ({ rubric, onChange }) => {
  const [newCriterion, setNewCriterion] = useState('');
  const [editedCriterion, setEditedCriterion] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleChecklistChange = (e: React.ChangeEvent<HTMLInputElement>, criterion: string) => {
    const { value } = e.target;
    setTempValue(value);
    setEditedCriterion(criterion);
  };

  const applyChecklistChange = () => {
    if (!editedCriterion || tempValue === '') return;

    const updatedCriteria: { [requirement: string]: string } = Object.keys(rubric.criteria).reduce((acc, key) => {
      if (typeof rubric.criteria[key] === 'string') {
        acc[key] = rubric.criteria[key] as string;
      }
      return acc;
    }, {} as { [requirement: string]: string });
    delete updatedCriteria[editedCriterion];
    updatedCriteria[tempValue] = 'Yes/No';

    onChange({
      ...rubric,
      criteria: updatedCriteria,
    });

    setEditedCriterion(null);
    setTempValue('');
  };

  const addNewChecklistCriterion = () => {
    if (!newCriterion.trim()) {
      toast.error('Please enter a criterion.');
      return;
    }

    onChange({
      ...rubric,
      criteria: {
        ...rubric.criteria,
        [newCriterion]: 'Yes/No',
      },
    });
    setNewCriterion('');
  };

  const removeChecklistCriterion = (criterion: string) => {
    const updatedCriteria: { [requirement: string]: string } = { ...rubric.criteria };
    delete updatedCriteria[criterion];
    onChange({
      ...rubric,
      criteria: updatedCriteria,
    });
  };

  return (
    <div className="mb-2">
      <h3 className="text-primary-30 text-center font-semibold">Checklist</h3>
      <hr />
      {Object.entries(rubric.criteria as GenericRubricCriteria).map(([criterion, yesNoValue]) => (
        <div key={criterion} className="mb-3 flex flex-row items-center gap-x-2">
          <input
            type="text"
            value={editedCriterion === criterion ? tempValue : criterion}
            onChange={(e) => handleChecklistChange(e, criterion)}
            onBlur={applyChecklistChange}
            className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          />
          <label className="block font-semibold mt-1">{typeof yesNoValue === 'string' ? yesNoValue : ''}</label>
          <button onClick={() => removeChecklistCriterion(criterion)} className="ml-2 text-red-600">
            <MinusCircleIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
      <div className="flex flex-row items-center gap-x-2">
        <input
          type="text"
          value={newCriterion}
          onChange={(e) => setNewCriterion(e.target.value)}
          placeholder="Enter new criterion"
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
        <CustomButton onClick={addNewChecklistCriterion} className="btn btn-shiny btn-shiny-green py-1 mx-1 text-purple-100">
          <BadgePlus size={18} />
          <p>Add</p>
        </CustomButton>
      </div>
    </div>
  );
};

export default ChecklistRubricBuilder;