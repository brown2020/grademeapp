import SavedCriteriaList from "./SavedCriteriaList";
import CriterionActions from "./CriterionActions";
import React, { useEffect, useState } from 'react';
import { DevelopmentalRubric, GenericRubricCriteria } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

interface DevelopmentalCriteriaBuilderProps {
  rubric: DevelopmentalRubric;
  onChange: (updatedRubric: DevelopmentalRubric) => void;
}

const DevelopmentalCriteriaBuilder: React.FC<DevelopmentalCriteriaBuilderProps> = ({ rubric, onChange }) => {
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
      <h3 className="text-primary-20 text-center font-semibold">Create Developmental Criterion</h3>
      <div>
        <label className="block text-sm font-semibold text-primary-10" htmlFor="criterion-name">Criterion Name</label>
        <input id="criterion-name" aria-label="Criterion Name"
          type="text"
          value={currentCriterion.name}
          onChange={(e) => setCurrentCriterion({ ...currentCriterion, name: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-10" htmlFor="criterion-description">Criterion Description</label>
        <textarea id="criterion-description" aria-label="Criterion Description"
          value={currentCriterion.description}
          onChange={(e) => setCurrentCriterion({ ...currentCriterion, description: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Developmental Stages</h4>
        {currentCriterion.stages.map((stage, index) => (
          <div key={`stage-${stage.name}-${stage.description}`} className="mt-2 p-2 border border-primary-20 rounded">
            <div className="flex justify-between items-center">
              <input aria-label="Criterion field"
                type="text"
                value={stage.name}
                onChange={(e) => updateStage(index, 'name', e.target.value)}
                className="px-1 w-1/3 py-0.5 rounded shadow-sm border border-primary-40"
                placeholder="Stage Name"
              />
              <button type="button" aria-label="Remove" onClick={() => removeStage(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
            <textarea aria-label="Criterion level description"
              value={stage.description}
              onChange={(e) => updateStage(index, 'description', e.target.value)}
              className="px-1 w-full py-0.5 mt-1 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder="Stage Description"
            />
          </div>
        ))}
        <Button onClick={addStage} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
          <PlusCircle size={18} />
          <p>Add Stage</p>
        </Button>
      </div>
      <Button onClick={addOrUpdateCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <p>{isEditing ? 'Update Criterion' : 'Add Criterion'}</p>
      </Button>
      <SavedCriteriaList items={savedCriteria} onEdit={(criterion) => isEditing ? addOrUpdateCriterion() : loadCriterion(criterion as typeof savedCriteria[number])} onDelete={(id) => deleteCriterion(id)} />
    </div>
  );
};

export default DevelopmentalCriteriaBuilder;