import React, { useState, useEffect } from 'react';
import { OtherRubricType, GenericRubricCriteria } from '@/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2, PlusCircle } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface DevelopmentalStage {
  name: string;
  description: string;
}

interface DevelopmentalCriterionState {
  id: string;
  name: string;
  description: string;
  stages: DevelopmentalStage[];
}

interface DevelopmentalRubricBuilderProps {
  rubric: OtherRubricType;
  onChange: (updatedRubric: OtherRubricType) => void;
  hasSaved: boolean;
  setHasSaved: (hasSaved: boolean) => void;
}

const DevelopmentalRubricBuilder: React.FC<DevelopmentalRubricBuilderProps> = ({ rubric, onChange, hasSaved, setHasSaved }) => {
  const [currentCriterion, setCurrentCriterion] = useState<DevelopmentalCriterionState>({
    id: '',
    name: '',
    description: '',
    stages: [
      { name: 'Emerging', description: '' },
      { name: 'Developing', description: '' },
      { name: 'Proficient', description: '' },
      { name: 'Advanced', description: '' },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedCriteria, setSavedCriteria] = useState<DevelopmentalCriterionState[]>([]);

  useEffect(() => {
    if (hasSaved) {
      setSavedCriteria([]);
      setCurrentCriterion({
        id: '',
        name: '',
        description: '',
        stages: [
          { name: 'Emerging', description: '' },
          { name: 'Developing', description: '' },
          { name: 'Proficient', description: '' },
          { name: 'Advanced', description: '' },
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
        stages: currentCriterion.stages.reduce((acc, stage) => {
          acc[stage.name] = stage.description;
          return acc;
        }, {} as Record<string, string>),
      },
    } as GenericRubricCriteria;

    onChange({ ...rubric, criteria: updatedCriteria });

    if (isEditing) {
      setSavedCriteria(savedCriteria.map(c => c.id === currentCriterion.id ? currentCriterion : c));
    } else {
      setSavedCriteria([...savedCriteria, { ...currentCriterion, id: Date.now().toString() }]);
    }

    setCurrentCriterion({
      id: '',
      name: '',
      description: '',
      stages: [
        { name: 'Emerging', description: '' },
        { name: 'Developing', description: '' },
        { name: 'Proficient', description: '' },
        { name: 'Advanced', description: '' },
      ],
    });
    setIsEditing(false);
  };

  const loadCriterion = (criterion: DevelopmentalCriterionState) => {
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

  const addStage = () => {
    setCurrentCriterion(prev => ({
      ...prev,
      stages: [...prev.stages, { name: '', description: '' }],
    }));
  };

  const updateStage = (index: number, field: keyof DevelopmentalStage, value: string) => {
    setCurrentCriterion(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) =>
        i === index ? { ...stage, [field]: value } : stage
      ),
    }));
  };

  const removeStage = (index: number) => {
    setCurrentCriterion(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-30 text-center font-semibold">Create Developmental Criterion</h3>
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
        <h4 className="text-primary-20 font-semibold">Developmental Stages</h4>
        {currentCriterion.stages.map((stage, index) => (
          <div key={index} className="mt-2 p-2 border border-primary-20 rounded">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={stage.name}
                onChange={(e) => updateStage(index, 'name', e.target.value)}
                className="px-1 w-1/3 py-0.5 rounded shadow-sm border border-primary-40"
                placeholder="Stage Name"
              />
              <button onClick={() => removeStage(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
            <textarea
              value={stage.description}
              onChange={(e) => updateStage(index, 'description', e.target.value)}
              className="px-1 w-full py-0.5 mt-1 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder="Stage Description"
            />
          </div>
        ))}
        <CustomButton onClick={addStage} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
          <PlusCircle size={18} />
          <p>Add Stage</p>
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

export default DevelopmentalRubricBuilder;