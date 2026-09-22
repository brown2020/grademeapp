import SavedCriteriaList from "./SavedCriteriaList";
import React, { useEffect, useState } from 'react';
import { PrimaryTraitRubric, GenericRubricCriteria } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2 } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface PrimaryTraitCriteriaBuilderProps {
  rubric: PrimaryTraitRubric;
  onChange: (updatedRubric: PrimaryTraitRubric) => void;
}

interface PrimaryTraitCriterionState {
  id: string;
  name: string;
  description: string;
  levels: {
    score: number;
    description: string;
  }[];
}

const PrimaryTraitCriteriaBuilder: React.FC<PrimaryTraitCriteriaBuilderProps> = ({
  rubric,
  onChange
}) => {
  const [currentCriterion, setCurrentCriterion] = useState<PrimaryTraitCriterionState>({
    id: '',
    name: '',
    description: '',
    levels: [
      { score: 4, description: '' },
      { score: 3, description: '' },
      { score: 2, description: '' },
      { score: 1, description: '' },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedCriteria, setSavedCriteria] = useState<PrimaryTraitCriterionState[]>([]);



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
          acc[level.score] = level.description;
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
      levels: [
        { score: 4, description: '' },
        { score: 3, description: '' },
        { score: 2, description: '' },
        { score: 1, description: '' },
      ],
    });
    setIsEditing(false);
  };

  const loadCriterion = (criterion: PrimaryTraitCriterionState) => {
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

  const handleLevelChange = (index: number, field: 'score' | 'description', value: string | number) => {
    setCurrentCriterion(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      ),
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-30 text-center font-semibold">Create Primary-Trait Criterion</h3>
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
        <h4 className="text-primary-20 font-semibold">Performance Levels</h4>
        {currentCriterion.levels.map((level, index) => (
          <div key={`lvl-${level.score}-${level.description}`} className="mt-2 p-2 border border-primary-20 rounded">
            <div className="flex justify-between items-center">
              <input aria-label="Criterion field"
                type="number"
                value={level.score}
                onChange={(e) => { const n = Number.parseInt(e.target.value, 10); if (!Number.isNaN(n)) handleLevelChange(index, 'score', n); }}
                className="px-1 w-16 py-0.5 rounded shadow-sm border border-primary-40"
                min="1"
                max="4"
              />
            </div>
            <textarea aria-label="Criterion level description"
              value={level.description}
              onChange={(e) => handleLevelChange(index, 'description', e.target.value)}
              className="px-1 w-full py-0.5 mt-1 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder="Level Description"
            />
          </div>
        ))}
      </div>
      <CustomButton onClick={addOrUpdateCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <p>{isEditing ? 'Update Criterion' : 'Add Criterion'}</p>
      </CustomButton>
      <SavedCriteriaList items={savedCriteria} onEdit={(c) => loadCriterion(c as typeof savedCriteria[number])} onDelete={(id) => deleteCriterion(id)} />
    </div>
  );
};

export default PrimaryTraitCriteriaBuilder;

