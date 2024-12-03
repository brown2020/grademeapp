import React, { useState, useEffect } from 'react';
import { OtherRubricType, GenericRubricCriteria } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2 } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface SkillFocusedCriteriaBuilderProps {
  rubric: OtherRubricType;
  onChange: (updatedRubric: OtherRubricType) => void;
  hasSaved: boolean;
  setHasSaved: (hasSaved: boolean) => void;
}

interface SkillComponent {
  id: string;
  name: string;
  levels: {
    Exemplary: string;
    Proficient: string;
    Developing: string;
    Emerging: string;
  };
}

const SkillFocusedCriteriaBuilder: React.FC<SkillFocusedCriteriaBuilderProps> = ({
  rubric,
  onChange,
  hasSaved,
  setHasSaved
}) => {
  const [skillComponents, setSkillComponents] = useState<SkillComponent[]>([]);
  const [currentSkillComponent, setCurrentSkillComponent] = useState<SkillComponent>({
    id: '',
    name: '',
    levels: {
      Exemplary: '',
      Proficient: '',
      Developing: '',
      Emerging: '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (rubric.criteria) {
      const initialSkillComponents = Object.entries(rubric.criteria).map(([name, criterion]) => ({
        id: name,
        name,
        levels: (criterion as GenericRubricCriteria) as SkillComponent['levels'],
      }));
      setSkillComponents(initialSkillComponents);
    }
  }, [rubric.criteria]);

  useEffect(() => {
    if (hasSaved) {
      setSkillComponents([]);
      setCurrentSkillComponent({
        id: '',
        name: '',
        levels: {
          Exemplary: '',
          Proficient: '',
          Developing: '',
          Emerging: '',
        },
      });
      setIsEditing(false);
      setHasSaved(false);
    }
  }, [hasSaved, setHasSaved]);

  const addOrUpdateSkillComponent = () => {
    if (!currentSkillComponent.name.trim()) {
      toast.error('Please provide a name for the skill component.');
      return;
    }

    const updatedSkillComponents = isEditing
      ? skillComponents.map(sc => sc.id === currentSkillComponent.id ? currentSkillComponent : sc)
      : [...skillComponents, { ...currentSkillComponent, id: Date.now().toString() }];

    setSkillComponents(updatedSkillComponents);

    const updatedCriteria = updatedSkillComponents.reduce((acc, sc) => {
      acc[sc.name] = sc.levels;
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedCriteria });

    setCurrentSkillComponent({
      id: '',
      name: '',
      levels: {
        Exemplary: '',
        Proficient: '',
        Developing: '',
        Emerging: '',
      },
    });
    setIsEditing(false);
    setHasSaved(false);
  };

  const editSkillComponent = (skillComponent: SkillComponent) => {
    setCurrentSkillComponent(skillComponent);
    setIsEditing(true);
  };

  const deleteSkillComponent = (id: string) => {
    const updatedSkillComponents = skillComponents.filter(sc => sc.id !== id);
    setSkillComponents(updatedSkillComponents);

    const updatedCriteria = updatedSkillComponents.reduce((acc, sc) => {
      acc[sc.name] = sc.levels;
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedCriteria });
  };

  const handleSkillComponentChange = (field: keyof SkillComponent, value: string) => {
    setCurrentSkillComponent(prev => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (level: keyof SkillComponent['levels'], value: string) => {
    setCurrentSkillComponent(prev => ({
      ...prev,
      levels: { ...prev.levels, [level]: value },
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-30 text-center font-semibold">Create Skill-Focused Rubric</h3>
      <div>
        <label className="block text-sm font-semibold text-primary-10">Skill Component Name</label>
        <input
          type="text"
          value={currentSkillComponent.name}
          onChange={(e) => handleSkillComponentChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Performance Levels</h4>
        {(['Exemplary', 'Proficient', 'Developing', 'Emerging'] as const).map((level) => (
          <div key={level} className="mt-2">
            <label className="block text-sm font-semibold text-primary-10">{level}</label>
            <textarea
              value={currentSkillComponent.levels[level]}
              onChange={(e) => handleLevelChange(level, e.target.value)}
              className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder={`${level} level description`}
            />
          </div>
        ))}
      </div>
      <CustomButton onClick={addOrUpdateSkillComponent} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <span>{isEditing ? 'Update Skill Component' : 'Add Skill Component'}</span>
      </CustomButton>
      <div className="mt-4">
        <h4 className="text-primary-30 font-semibold text-center">Saved Skill Components</h4>
        {skillComponents.length === 0 ? (
          <div className="text-center text-primary-10 p-2 border-dashed border-2 border-primary-30 rounded-md">
            <p>Added skill components will appear here.</p>
          </div>
        ) : (
          skillComponents.map((sc) => (
            <div key={sc.id} className="flex justify-between items-center my-2">
              <span className="text-primary-20">{sc.name}</span>
              <div className="flex gap-x-4">
                <button onClick={() => editSkillComponent(sc)} className="text-blue-500 hover:text-blue-700">
                  <Edit2Icon size={20} />
                </button>
                <button onClick={() => deleteSkillComponent(sc.id)} className="text-red-500 hover:text-red-700">
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

export default SkillFocusedCriteriaBuilder;

