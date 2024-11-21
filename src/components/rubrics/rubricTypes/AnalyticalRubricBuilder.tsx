import React, { useState, useEffect } from 'react';
import { AnalyticalRubric, RubricType } from '@/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2 } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';
import { useRubricStore } from '@/zustand/useRubricStore';

interface AnalyticalCriterionState {
  id: string;
  name: string;
  Excellent: string;
  Proficient: string;
  Developing: string;
  Beginning: string;
}

interface AnalyticalRubricBuilderProps {
  rubric: AnalyticalRubric;
  onChange: (updatedRubric: AnalyticalRubric) => void;
  setHasSaved: (hasSaved: boolean) => void;
  hasSaved: boolean;
}

const AnalyticalRubricBuilder: React.FC<AnalyticalRubricBuilderProps> = ({
  rubric,
  onChange,
  setHasSaved,
  hasSaved
}) => {
  const [currentCriterion, setCurrentCriterion] = useState<AnalyticalCriterionState>({
    id: '',
    name: '',
    Excellent: '',
    Proficient: '',
    Developing: '',
    Beginning: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedCriteria, setSavedCriteria] = useState<AnalyticalCriterionState[]>([]);
  const [nextId, setNextId] = useState(1);
  const { showRubricBuilder } = useRubricStore();

  useEffect(() => {
    if (!showRubricBuilder) {
      setSavedCriteria([]);
      setCurrentCriterion({ id: '', name: '', Excellent: '', Proficient: '', Developing: '', Beginning: '' });
      setIsEditing(false);
      setNextId(1);
    }
  }, [showRubricBuilder]);

  useEffect(() => {
    if (rubric && rubric.type === RubricType.Analytical) {
      const criteriaArray = Object.entries(rubric.criteria).map(([key, criterion], index) => ({
        id: `criterion-${index + 1}`,
        name: key,
        Excellent: typeof criterion === 'object' && 'Excellent' in criterion ? String(criterion.Excellent) : '',
        Proficient: typeof criterion === 'object' && 'Proficient' in criterion ? String(criterion.Proficient) : '',
        Developing: typeof criterion === 'object' && 'Developing' in criterion ? String(criterion.Developing) : '',
        Beginning: typeof criterion === 'object' && 'Beginning' in criterion ? String(criterion.Beginning) : '',
      }));
      setSavedCriteria(criteriaArray);
      setNextId(criteriaArray.length + 1);
    }
  }, [rubric]);

  useEffect(() => {
    if (hasSaved) {
      setSavedCriteria([]);
      setCurrentCriterion({ id: '', name: '', Excellent: '', Proficient: '', Developing: '', Beginning: '' });
      setHasSaved(false);
    }
  }, [hasSaved, setHasSaved])

  const addOrUpdateCriterion = () => {
    if (!currentCriterion.name.trim()) {
      toast.error('Please provide a name for the criterion.');
      return;
    }

    const isDuplicateName = savedCriteria.some(
      c => c.name.toLowerCase() === currentCriterion.name.toLowerCase() && c.id !== currentCriterion.id
    );

    if (isDuplicateName) {
      toast.error('Criterion name must be unique.');
      return;
    }

    let updatedSavedCriteria: AnalyticalCriterionState[];
    if (isEditing) {
      updatedSavedCriteria = savedCriteria.map(c =>
        c.id === currentCriterion.id ? { ...currentCriterion } : c
      );
    } else {
      const newCriterion = { ...currentCriterion, id: `criterion_${nextId}` };
      updatedSavedCriteria = [...savedCriteria, newCriterion];
      setNextId(nextId + 1);
    }

    const updatedCriteria = updatedSavedCriteria.reduce((acc, criterion) => {
      acc[criterion.id] = {
        Excellent: criterion.Excellent,
        Proficient: criterion.Proficient,
        Developing: criterion.Developing,
        Beginning: criterion.Beginning,
      };
      return acc;
    }, {} as Record<string, Omit<AnalyticalCriterionState, 'id' | 'name'>>);

    onChange({ ...rubric, criteria: updatedCriteria });
    setSavedCriteria(updatedSavedCriteria);

    console.log('Updated Criteria:', updatedSavedCriteria);

    setCurrentCriterion({ id: '', name: '', Excellent: '', Proficient: '', Developing: '', Beginning: '' });
    setIsEditing(false);
    toast.success(`Criterion ${isEditing ? 'updated' : 'added'} successfully.`);
  };

  const loadCriterion = (criterion: AnalyticalCriterionState) => {
    setCurrentCriterion(criterion);
    setIsEditing(true);
  };

  const deleteCriterion = (criterionId: string) => {
    const criterionToDelete = savedCriteria.find(c => c.id === criterionId);
    if (criterionToDelete) {
      const updatedCriteria = { ...rubric.criteria };
      delete updatedCriteria[criterionToDelete.name];
      onChange({ ...rubric, criteria: updatedCriteria });
      setSavedCriteria(savedCriteria.filter(c => c.id !== criterionId));
    }
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm rubric-builder-create-criterion-section">
      <h3 className="text-primary-30 text-center font-semibold">Create Analytical Criterion</h3>
      <div className='rubric-builder-criterion-name'>
        <label className="block text-sm font-semibold text-primary-10">Criterion Name</label>
        <input
          type="text"
          value={currentCriterion.name}
          onChange={(e) => setCurrentCriterion({ ...currentCriterion, name: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div className='rubric-builder-criterion-levels'>
        {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as const).map((level) => (
          <div key={level}>
            <label htmlFor={`criterion-${level}`} className="block text-sm font-semibold text-primary-10">{level}</label>
            <textarea
              id={`criterion-${level}`}
              value={currentCriterion[level]}
              onChange={(e) => setCurrentCriterion({ ...currentCriterion, [level]: e.target.value })}
              className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              rows={1}
            />
          </div>
        ))}
      </div>
      <CustomButton onClick={addOrUpdateCriterion} className="rubric-builder-add-criterion btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <p>{isEditing ? 'Update Criterion' : 'Add Criterion'}</p>
      </CustomButton>
      <div className="criteria-list mt-4 rubric-builder-saved-criteria">
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

export default AnalyticalRubricBuilder;