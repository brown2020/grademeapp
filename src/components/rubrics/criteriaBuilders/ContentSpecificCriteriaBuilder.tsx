import React, { useState, useEffect } from 'react';
import { GenericRubricCriteria, ContentSpecificRubric } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2, PlusCircle } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface PerformanceLevel {
  name: string;
  description: string;
}

interface ContentSpecificCriterionState {
  id: string;
  name: string;
  description: string;
  levels: PerformanceLevel[];
}

interface ContentSpecificCriteriaBuilderProps {
  rubric: ContentSpecificRubric;
  onChange: (updatedRubric: ContentSpecificRubric) => void;
  hasSaved: boolean;
  setHasSaved: (hasSaved: boolean) => void;
}

const ContentSpecificCriteriaBuilder: React.FC<ContentSpecificCriteriaBuilderProps> = ({ rubric, onChange, hasSaved, setHasSaved }) => {
  const [currentCriterion, setCurrentCriterion] = useState<ContentSpecificCriterionState>({
    id: '',
    name: '',
    description: '',
    levels: [
      { name: 'Excellent', description: '' },
      { name: 'Proficient', description: '' },
      { name: 'Developing', description: '' },
      { name: 'Beginning', description: '' },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedCriteria, setSavedCriteria] = useState<ContentSpecificCriterionState[]>([]);
  const [assignmentType, setAssignmentType] = useState('');

  useEffect(() => {
    if (hasSaved) {
      setSavedCriteria([]);
      setCurrentCriterion({
        id: '',
        name: '',
        description: '',
        levels: [
          { name: 'Excellent', description: '' },
          { name: 'Proficient', description: '' },
          { name: 'Developing', description: '' },
          { name: 'Beginning', description: '' },
        ],
      });
      setHasSaved(false);
    }
  }, [hasSaved, setHasSaved]);

  const addOrUpdateCriterion = () => {
    if (!currentCriterion.name.trim()) {
      toast.error('Please provide a name for the criterion.');
      return;
    }

    const updatedCriteria = {
      ...rubric.criteria,
      [currentCriterion.name]: {
        description: currentCriterion.description,
        levels: currentCriterion.levels.reduce((acc, level) => {
          acc[level.name] = level.description;
          return acc;
        }, {} as Record<string, string>),
      },
    } as GenericRubricCriteria;

    onChange({
      ...rubric,
      criteria: updatedCriteria,
    });

    if (isEditing) {
      setSavedCriteria(savedCriteria.map(c => c.id === currentCriterion.id ? currentCriterion : c));
    } else {
      setSavedCriteria([...savedCriteria, { ...currentCriterion, id: Date.now().toString() }]);
    }

    setCurrentCriterion({
      id: '',
      name: '',
      description: '',
      levels: [
        { name: 'Excellent', description: '' },
        { name: 'Proficient', description: '' },
        { name: 'Developing', description: '' },
        { name: 'Beginning', description: '' },
      ],
    });
    setIsEditing(false);
  };

  const loadCriterion = (criterion: ContentSpecificCriterionState) => {
    setCurrentCriterion(criterion);
    setIsEditing(true);
  };

  const deleteCriterion = (criterionId: string) => {
    const criterionToDelete = savedCriteria.find(c => c.id === criterionId);
    if (criterionToDelete) {
      const updatedCriteria = { ...rubric.criteria } as GenericRubricCriteria;
      delete updatedCriteria[criterionToDelete.name];
      onChange({ ...rubric, criteria: updatedCriteria });
      setSavedCriteria(savedCriteria.filter(c => c.id !== criterionId));
    }
  };

  const addPerformanceLevel = () => {
    setCurrentCriterion(prev => ({
      ...prev,
      levels: [...prev.levels, { name: '', description: '' }],
    }));
  };

  const updatePerformanceLevel = (index: number, field: keyof PerformanceLevel, value: string) => {
    setCurrentCriterion(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      ),
    }));
  };

  const removePerformanceLevel = (index: number) => {
    setCurrentCriterion(prev => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-30 text-center font-semibold">Create Content-Specific Criterion</h3>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-primary-10">Assignment Type</label>
        <input
          type="text"
          value={assignmentType}
          onChange={(e) => setAssignmentType(e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          placeholder="e.g., Science Lab Report, History Research Paper"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-10">Criterion Name</label>
        <input
          type="text"
          value={currentCriterion.name}
          onChange={(e) => setCurrentCriterion({ ...currentCriterion, name: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-10">Criterion Description</label>
        <textarea
          value={currentCriterion.description}
          onChange={(e) => setCurrentCriterion({ ...currentCriterion, description: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Performance Levels</h4>
        {currentCriterion.levels.map((level, index) => (
          <div key={index} className="mt-2 p-2 border border-primary-20 rounded">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={level.name}
                onChange={(e) => updatePerformanceLevel(index, 'name', e.target.value)}
                className="px-1 w-1/3 py-0.5 rounded shadow-sm border border-primary-40"
                placeholder="Level Name"
              />
              <button onClick={() => removePerformanceLevel(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
            <textarea
              value={level.description}
              onChange={(e) => updatePerformanceLevel(index, 'description', e.target.value)}
              className="px-1 w-full py-0.5 mt-1 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder="Level Description"
            />
          </div>
        ))}
        <CustomButton onClick={addPerformanceLevel} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
          <PlusCircle size={18} />
          <p>Add Performance Level</p>
        </CustomButton>
      </div>
      <CustomButton onClick={addOrUpdateCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <p>{isEditing ? 'Update Criterion' : 'Add Criterion'}</p>
      </CustomButton>
      <div className="criteria-list mt-4">
        <h4 className="text-primary-30 font-semibold text-center">Saved Criteria</h4>
        {savedCriteria.length === 0 ? (
          <div className="text-center text-primary-10 p-2 border-dashed border-2 border-primary-30 rounded-md">
            <p>Added criteria will appear here.</p>
          </div>
        ) : (
          savedCriteria.map((criterion) => (
            <div key={criterion.id} className="flex justify-between items-center my-2">
              <span className="text-primary-20">{criterion.name}</span>
              <div className="flex gap-x-4">
                <button onClick={() => isEditing ? addOrUpdateCriterion() : loadCriterion(criterion)} className="text-blue-500 hover:text-blue-700">
                  <Edit2Icon size={20} />
                </button>
                <button onClick={() => deleteCriterion(criterion.id)} className="text-red-500 hover:text-red-700">
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

export default ContentSpecificCriteriaBuilder;