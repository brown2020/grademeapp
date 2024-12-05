import React, { useState, useEffect } from 'react';
import { TaskSpecificRubric, GenericRubricCriteria } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2 } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface TaskSpecificCriteriaBuilderProps {
  rubric: TaskSpecificRubric;
  onChange: (updatedRubric: TaskSpecificRubric) => void;
  hasSaved: boolean;
  setHasSaved: (hasSaved: boolean) => void;
}

interface Criterion {
  id: string;
  name: string;
  description: string;
  levels: {
    [key: string]: string;
  };
}

const DEFAULT_LEVELS = {
  'Excellent': '',
  'Good': '',
  'Fair': '',
  'Poor': '',
};

const TaskSpecificCriteriaBuilder: React.FC<TaskSpecificCriteriaBuilderProps> = ({
  rubric,
  onChange,
  hasSaved,
  setHasSaved
}) => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [currentCriterion, setCurrentCriterion] = useState<Criterion>({
    id: '',
    name: '',
    description: '',
    levels: { ...DEFAULT_LEVELS },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [taskDescription, setTaskDescription] = useState(rubric.description || '');

  useEffect(() => {
    if (rubric.criteria) {
      const initialCriteria = Object.entries(rubric.criteria).map(([name, criterion]) => ({
        id: name,
        name,
        description: (criterion as GenericRubricCriteria).description as string || '',
        levels: (criterion as GenericRubricCriteria).levels as Criterion['levels'],
      }));
      setCriteria(initialCriteria);
    }
  }, [rubric.criteria]);

  useEffect(() => {
    if (hasSaved) {
      setCriteria([]);
      setCurrentCriterion({
        id: '',
        name: '',
        description: '',
        levels: { ...DEFAULT_LEVELS },
      });
      setIsEditing(false);
      setTaskDescription('');
      setHasSaved(false);
    }
  }, [hasSaved, setHasSaved]);

  const addOrUpdateCriterion = () => {
    if (!currentCriterion.name.trim()) {
      toast.error('Please provide a name for the criterion.');
      return;
    }

    const updatedCriteria = isEditing
      ? criteria.map(c => c.id === currentCriterion.id ? currentCriterion : c)
      : [...criteria, { ...currentCriterion, id: Date.now().toString() }];

    setCriteria(updatedCriteria);

    const updatedRubricCriteria = updatedCriteria.reduce((acc, c) => {
      acc[c.name] = {
        description: c.description,
        levels: c.levels,
      };
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedRubricCriteria });

    setCurrentCriterion({
      id: '',
      name: '',
      description: '',
      levels: { ...DEFAULT_LEVELS },
    });
    setIsEditing(false);
  };

  const editCriterion = (criterion: Criterion) => {
    setCurrentCriterion(criterion);
    setIsEditing(true);
  };

  const deleteCriterion = (id: string) => {
    const updatedCriteria = criteria.filter(c => c.id !== id);
    setCriteria(updatedCriteria);

    const updatedRubricCriteria = updatedCriteria.reduce((acc, c) => {
      acc[c.name] = {
        description: c.description,
        levels: c.levels,
      };
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedRubricCriteria, description: taskDescription });
  };

  const handleCriterionChange = (field: keyof Criterion, value: string) => {
    setCurrentCriterion(prev => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (level: string, value: string) => {
    setCurrentCriterion(prev => ({
      ...prev,
      levels: { ...prev.levels, [level]: value },
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-30 text-center font-semibold">Create Task-Specific Rubric</h3>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-primary-10">Task Description</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={3}
          placeholder="Describe the specific task or assignment this rubric is for"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary-10">Criterion Name</label>
        <input
          type="text"
          value={currentCriterion.name}
          onChange={(e) => handleCriterionChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          placeholder="e.g., Thesis Statement, Data Analysis, Presentation Skills"
        />
      </div>
      <div className="mt-2">
        <label className="block text-sm font-semibold text-primary-10">Criterion Description</label>
        <textarea
          value={currentCriterion.description}
          onChange={(e) => handleCriterionChange('description', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
          placeholder="Describe what this criterion is evaluating"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Performance Levels</h4>
        {Object.entries(currentCriterion.levels).map(([level, description]) => (
          <div key={level} className="mt-2">
            <label className="block text-sm font-semibold text-primary-10">{level}</label>
            <textarea
              value={description}
              onChange={(e) => handleLevelChange(level, e.target.value)}
              className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder={`Description for ${level} level`}
            />
          </div>
        ))}
      </div>
      <CustomButton onClick={addOrUpdateCriterion} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <p>{isEditing ? 'Update Criterion' : 'Add Criterion'}</p>
      </CustomButton>
      <div className="mt-4">
        <h4 className="text-primary-30 font-semibold text-center">Saved Criteria</h4>
        {criteria.length === 0 ? (
          <div className="text-center text-primary-10 p-2 border-dashed border-2 border-primary-30 rounded-md">
            <p>Added criteria will appear here.</p>
          </div>
        ) : (
          criteria.map((c) => (
            <div key={c.id} className="flex justify-between items-center my-2">
              <span className="text-primary-20">{c.name}</span>
              <div className="flex gap-x-4">
                <button onClick={() => editCriterion(c)} className="text-blue-500 hover:text-blue-700">
                  <Edit2Icon size={20} />
                </button>
                <button onClick={() => deleteCriterion(c.id)} className="text-red-500 hover:text-red-700">
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

export default TaskSpecificCriteriaBuilder;

