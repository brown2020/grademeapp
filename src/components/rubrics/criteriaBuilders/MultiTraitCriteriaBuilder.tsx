import React, { useState, useEffect } from 'react';
import {
  MultiTraitRubric,
  MultiTraitCriterion,
  MultiTraitSubCriterion,
} from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, PlusCircle, Edit2Icon, Trash2, Save } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';


interface MultiTraitCriteriaBuilderProps {
  rubric: MultiTraitRubric;
  onChange: (updatedRubric: MultiTraitRubric) => void;
  hasSaved: boolean;
  setHasSaved: (hasSaved: boolean) => void;
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
  hasSaved,
  setHasSaved,
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

  useEffect(() => {
    if (rubric.criteria) {
      setCriteria(rubric.criteria);
      const initialSavedCriteria = Object.entries(rubric.criteria).map(([name, criterion]) => ({
        id: name,
        name,
        description: criterion.description || '',
        subCriteria: criterion.subCriteria,
      }));
      setSavedCriteria(initialSavedCriteria);
    }
  }, [rubric]);

  useEffect(() => {
    if (hasSaved) {
      setSavedCriteria([]);
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
      setHasSaved(false);
    }
  }, [hasSaved, setHasSaved]);

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
    setHasSaved(false);
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
      <h3 className="text-primary-30 text-center font-semibold">Create Multi-Trait Criterion</h3>
      <div>
        <label className="block text-sm font-semibold text-primary-10">Criterion Name</label>
        <input
          type="text"
          value={currentCriterion.name}
          onChange={(e) => handleCriterionChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-10">Criterion Description</label>
        <textarea
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
          <textarea
            value={currentSubCriterion.description}
            onChange={(e) => handleSubCriterionChange('description', e.target.value)}
            className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
            rows={2}
            placeholder="Sub-Criterion Description"
          />
          <h5 className="font-semibold mt-2">Performance Levels</h5>
          {['Excellent', 'Good', 'Fair', 'Poor'].map((levelName) => (
            <div key={levelName} className="mb-2">
              <input
                type="text"
                placeholder={`${levelName} Description`}
                value={currentSubCriterion.levels[levelName] || ''}
                onChange={(e) => handleLevelChange(levelName, e.target.value)}
                className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              />
            </div>
          ))}
          <CustomButton onClick={addSubCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
            <PlusCircle size={18} />
            <span>Add Sub-Criterion</span>
          </CustomButton>
        </div>
      </div>
      <CustomButton onClick={addOrUpdateCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <span>{isEditing ? 'Update Criterion' : 'Add Criterion'}</span>
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
                <button onClick={() => loadCriterion(criterion)} className="text-blue-500 hover:text-blue-700">
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

export default MultiTraitCriteriaBuilder;


