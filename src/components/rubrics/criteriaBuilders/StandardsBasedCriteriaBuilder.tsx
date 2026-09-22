import React, { useEffect, useState } from 'react';
import { StandardsBasedRubric, GenericRubricCriteria } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2 } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface StandardsBasedCriteriaBuilderProps {
  rubric: StandardsBasedRubric;
  onChange: (updatedRubric: StandardsBasedRubric) => void;
}

interface Standard {
  id: string;
  name: string;
  description: string;
  levels: {
    [key: string]: string;
  };
}

const DEFAULT_LEVELS = {
  'Exceeds Standard (4)': '',
  'Meets Standard (3)': '',
  'Approaching Standard (2)': '',
  'Below Standard (1)': '',
};

const StandardsBasedCriteriaBuilder: React.FC<StandardsBasedCriteriaBuilderProps> = ({
  rubric,
  onChange
}) => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [currentStandard, setCurrentStandard] = useState<Standard>({
    id: '',
    name: '',
    description: '',
    levels: { ...DEFAULT_LEVELS },
  });
  const [isEditing, setIsEditing] = useState(false);



  const addOrUpdateStandard = () => {
    if (!currentStandard.name.trim()) {
      toast.error('Please provide a name for the standard.');
      return;
    }

    const updatedStandards = isEditing
      ? standards.map(s => s.id === currentStandard.id ? currentStandard : s)
      : [...standards, { ...currentStandard, id: Date.now().toString() }];

    setStandards(updatedStandards);

    const updatedCriteria = updatedStandards.reduce((acc, s) => {
      acc[s.name] = {
        description: s.description,
        levels: s.levels,
      };
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedCriteria });

    setCurrentStandard({
      id: '',
      name: '',
      description: '',
      levels: { ...DEFAULT_LEVELS },
    });
    setIsEditing(false);
  };

  const editStandard = (standard: Standard) => {
    setCurrentStandard(standard);
    setIsEditing(true);
  };

  const deleteStandard = (id: string) => {
    const updatedStandards = standards.filter(s => s.id !== id);
    setStandards(updatedStandards);

    const updatedCriteria = updatedStandards.reduce((acc, s) => {
      acc[s.name] = {
        description: s.description,
        levels: s.levels,
      };
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedCriteria });
  };

  const handleStandardChange = (field: keyof Standard, value: string) => {
    setCurrentStandard(prev => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (level: string, value: string) => {
    setCurrentStandard(prev => ({
      ...prev,
      levels: { ...prev.levels, [level]: value },
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-20 text-center font-semibold">Create Standards-Based Rubric</h3>
      <div>
        <label className="block text-sm font-semibold text-primary-10" htmlFor="standard-name">Standard Name</label>
        <input id="standard-name" aria-label="Standard Name"
          type="text"
          value={currentStandard.name}
          onChange={(e) => handleStandardChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          placeholder="e.g., Analyze theme development (RL.6.2)"
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-semibold text-primary-10" htmlFor="standard-description">Standard Description</label>
        <textarea id="standard-description" aria-label="Standard Description"
          value={currentStandard.description}
          onChange={(e) => handleStandardChange('description', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
          placeholder="Describe the standard or learning objective"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Performance Levels</h4>
        {Object.entries(currentStandard.levels).map(([level, description]) => (
          <div key={level} className="mt-2">
            <label className="block text-sm font-semibold text-primary-10" htmlFor="level-level">{`Level ${level}`}</label>
            <textarea id="level-level" aria-label="{`Level ${level}`}"
              value={description}
              onChange={(e) => handleLevelChange(level, e.target.value)}
              className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder={`Description for Level ${level}`}
            />
          </div>
        ))}
      </div>
      <CustomButton onClick={addOrUpdateStandard} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <span>{isEditing ? 'Update Standard' : 'Add Standard'}</span>
      </CustomButton>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold text-center">Saved Standards</h4>
        {standards.length === 0 ? (
          <div className="text-center text-primary-10 p-2 border-dashed border-2 border-primary-30 rounded-md">
            <p>Added standards will appear here.</p>
          </div>
        ) : (
          standards.map((s) => (
            <div key={s.id} className="flex justify-between items-center my-2">
              <span className="text-primary-20">{s.name}</span>
              <div className="flex gap-x-4">
                <button type="button" aria-label="Edit criterion" onClick={() => editStandard(s)} className="text-blue-500 hover:text-blue-700 bg-transparent border-0"><Edit2Icon size={20} />
                </button>
                <button type="button" aria-label="Remove item" onClick={() => deleteStandard(s.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StandardsBasedCriteriaBuilder;

