import SavedCriteriaList from "./SavedCriteriaList";
import CriterionActions from "./CriterionActions";
import React, { useEffect, useState } from 'react';
import {
  MultiTraitRubric,
  MultiTraitCriterion,
  MultiTraitSubCriterion,
} from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, PlusCircle, Edit2Icon, Trash2, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";


interface MultiTraitCriteriaBuilderProps {
  rubric: MultiTraitRubric;
  onChange: (updatedRubric: MultiTraitRubric) => void;
}

interface CriterionState {
  id: string;
  name: string;
  description: string;
  subCriteria: Record<string, MultiTraitSubCriterion>;
}

const MultiTraitCriteriaBuilder: React.FC<MultiTraitCriteriaBuilderProps> = ({
  rubric,
  onChange,
}) => {
  const [criteria, setCriteria] = useState<Record<string, MultiTraitCriterion>>({});
  const [currentCriterion, setCurrentCriterion] = useState<CriterionState>({
    id: '',
    name: '',
    description: '',
    subCriteria: {},
  });
  const [currentSubCriterion, setCurrentSubCriterion] = useState<MultiTraitSubCriterion>({
    description: '',
    levels: {},
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedCriteria, setSavedCriteria] = useState<CriterionState[]>([]);



  const handleCriterionChange = (field: keyof CriterionState, value: string) => {
    setCurrentCriterion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubCriterionChange = (field: keyof MultiTraitSubCriterion, value: string) => {
    setCurrentSubCriterion((prev) => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (levelName: string, description: string) => {
    setCurrentSubCriterion((prev) => ({
      ...prev,
      levels: { ...prev.levels, [levelName]: description },
    }));
  };

  const addSubCriterion = () => {
    if (!currentSubCriterion.description) {
      toast.error('Please provide a description for the sub-criterion.');
      return;
    }
    const subCriterionId = Date.now().toString();
    setCurrentCriterion((prev) => ({
      ...prev,
      subCriteria: {
        ...prev.subCriteria,
        [subCriterionId]: currentSubCriterion,
      },
    }));
    setCurrentSubCriterion({
      description: '',
      levels: {},
    });
  };

  const addOrUpdateCriterion = () => {
    if (!currentCriterion.name.trim()) {
      toast.error('Please provide a name for the criterion.');
      return;
    }

    if (Object.keys(currentCriterion.subCriteria).length === 0) {
      toast.error('Please add at least one sub-criterion.');
      return;
    }

    const updatedCriteria = {
      ...criteria,
      [currentCriterion.name]: {
        description: currentCriterion.description,
        subCriteria: currentCriterion.subCriteria,
      },
    };

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
      subCriteria: {},
    });
    setCurrentSubCriterion({
      description: '',
      levels: {},
    });
    setIsEditing(false);
  };

  const loadCriterion = (criterion: CriterionState) => {
    setCurrentCriterion(criterion);
    setIsEditing(true);
  };

  const deleteCriterion = (criterionId: string) => {
    const criterionToDelete = savedCriteria.find(c => c.id === criterionId);
    if (criterionToDelete) {
      const updatedCriteria = { ...criteria };
      delete updatedCriteria[criterionToDelete.name];
      onChange({ ...rubric, criteria: updatedCriteria });
      setSavedCriteria(savedCriteria.filter(c => c.id !== criterionId));
    }
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-20 text-center font-semibold">Create Multi-Trait Criterion</h3>
      <div>
        <label className="block text-sm font-semibold text-primary-10" htmlFor="criterion-name">Criterion Name</label>
        <input id="criterion-name" aria-label="Criterion Name"
          type="text"
          value={currentCriterion.name}
          onChange={(e) => handleCriterionChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-10" htmlFor="criterion-description">Criterion Description</label>
        <textarea id="criterion-description" aria-label="Criterion Description"
          value={currentCriterion.description}
          onChange={(e) => handleCriterionChange('description', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Sub-Criteria</h4>
        {Object.entries(currentCriterion.subCriteria).map(([id, subCriterion]) => (
          <div key={id} className="mt-2 p-2 border border-primary-20 rounded">
            <p className="font-semibold">{subCriterion.description}</p>
            {Object.entries(subCriterion.levels).map(([levelName, levelDescription]) => (
              <div key={levelName} className="ml-4">
                <span className="font-medium">{levelName}:</span> {levelDescription}
              </div>
            ))}
          </div>
        ))}
        <div className="mt-2 p-2 border border-primary-20 rounded">
          <textarea aria-label="Criterion level description"
            value={currentSubCriterion.description}
            onChange={(e) => handleSubCriterionChange('description', e.target.value)}
            className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
            rows={2}
            placeholder="Sub-Criterion Description"
          />
          <h5 className="font-semibold mt-2">Performance Levels</h5>
          {['Excellent', 'Good', 'Fair', 'Poor'].map((levelName) => (
            <div key={levelName} className="mb-2">
              <input aria-label="Criterion field"
                type="text"
                placeholder={`${levelName} Description`}
                value={currentSubCriterion.levels[levelName] || ''}
                onChange={(e) => handleLevelChange(levelName, e.target.value)}
                className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              />
            </div>
          ))}
          <Button onClick={addSubCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
            <PlusCircle size={18} />
            <span>Add Sub-Criterion</span>
          </Button>
        </div>
      </div>
      <Button onClick={addOrUpdateCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <span>{isEditing ? 'Update Criterion' : 'Add Criterion'}</span>
      </Button>
      <SavedCriteriaList items={savedCriteria} onEdit={(criterion) => isEditing ? addOrUpdateCriterion() : loadCriterion(criterion as typeof savedCriteria[number])} onDelete={(id) => deleteCriterion(id)} />
    </div>
  );
};

export default MultiTraitCriteriaBuilder;


