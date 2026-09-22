import SavedCriteriaList from "./SavedCriteriaList";
import CriterionActions from "./CriterionActions";
import React, { useEffect, useState } from 'react';
import { SkillFocusedRubric, GenericRubricCriteria } from '@/lib/types/rubrics-types';
import { toast } from 'react-hot-toast';
import { BadgePlus, Save, Edit2Icon, Trash2, PlusCircle } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

interface SkillFocusedCriteriaBuilderProps {
  rubric: SkillFocusedRubric;
  onChange: (updatedRubric: SkillFocusedRubric) => void;
}

interface PerformanceLevel {
  name: string;
  description: string;
}

interface SkillComponent {
  id: string;
  name: string;
  levels: PerformanceLevel[];
}

const SkillFocusedCriteriaBuilder: React.FC<SkillFocusedCriteriaBuilderProps> = ({
  rubric,
  onChange
}) => {
  const [skillComponents, setSkillComponents] = useState<SkillComponent[]>([]);
  const [currentSkillComponent, setCurrentSkillComponent] = useState<SkillComponent>({
    id: '',
    name: '',
    levels: [
      { name: 'Exemplary', description: '' },
      { name: 'Proficient', description: '' },
      { name: 'Developing', description: '' },
      { name: 'Emerging', description: '' },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);



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
      acc[sc.name] = sc.levels.reduce((levelAcc, level) => {
        levelAcc[level.name] = level.description;
        return levelAcc;
      }, {} as Record<string, string>);
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedCriteria });

    setCurrentSkillComponent({
      id: '',
      name: '',
      levels: [
        { name: 'Exemplary', description: '' },
        { name: 'Proficient', description: '' },
        { name: 'Developing', description: '' },
        { name: 'Emerging', description: '' },
      ],
    });
    setIsEditing(false);
  };

  const editSkillComponent = (skillComponent: SkillComponent) => {
    setCurrentSkillComponent(skillComponent);
    setIsEditing(true);
  };

  const deleteSkillComponent = (id: string) => {
    const updatedSkillComponents = skillComponents.filter(sc => sc.id !== id);
    setSkillComponents(updatedSkillComponents);

    const updatedCriteria = updatedSkillComponents.reduce((acc, sc) => {
      acc[sc.name] = sc.levels.reduce((levelAcc, level) => {
        levelAcc[level.name] = level.description;
        return levelAcc;
      }, {} as Record<string, string>);
      return acc;
    }, {} as GenericRubricCriteria);

    onChange({ ...rubric, criteria: updatedCriteria });
  };

  const handleSkillComponentChange = (field: keyof SkillComponent, value: string) => {
    setCurrentSkillComponent(prev => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (index: number, field: keyof PerformanceLevel, value: string) => {
    setCurrentSkillComponent(prev => ({
      ...prev,
      levels: prev.levels.map((level, i) => i === index ? { ...level, [field]: value } : level),
    }));
  };

  const addPerformanceLevel = () => {
    setCurrentSkillComponent(prev => ({
      ...prev,
      levels: [...prev.levels, { name: '', description: '' }],
    }));
  };

  const removePerformanceLevel = (index: number) => {
    setCurrentSkillComponent(prev => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mb-2 p-2 border border-primary-40 rounded-sm">
      <h3 className="text-primary-20 text-center font-semibold">Create Skill-Focused Criterion</h3>
      <div>
        <label className="block text-sm font-semibold text-primary-10" htmlFor="skill-component-name">Skill Component Name</label>
        <input id="skill-component-name" aria-label="Skill Component Name"
          type="text"
          value={currentSkillComponent.name}
          onChange={(e) => handleSkillComponentChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>
      <div className="mt-4">
        <h4 className="text-primary-20 font-semibold">Performance Levels</h4>
        {currentSkillComponent.levels.map((level, index) => (
          <div key={`lvl-${level.name}-${level.description}`} className="mt-2 p-2 border border-primary-20 rounded space-y-2">
            <div className="flex justify-between items-center">
              <input aria-label="Criterion field"
                type="text"
                value={level.name}
                onChange={(e) => handleLevelChange(index, 'name', e.target.value)}
                className="px-1 w-1/2 py-0.5 rounded shadow-sm border border-primary-40"
                placeholder="Level name"
              />
              <button type="button" aria-label="Remove" onClick={() => removePerformanceLevel(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={20} />
              </button>
            </div>
            <textarea aria-label="Criterion level description"
              value={level.description}
              onChange={(e) => handleLevelChange(index, 'description', e.target.value)}
              className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
              rows={2}
              placeholder="Level Description"
            />
          </div>
        ))}
        <CustomButton onClick={addPerformanceLevel} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-2">
          <PlusCircle size={18} />
          <span>Add Performance Level</span>
        </CustomButton>
      </div>
      <CustomButton onClick={addOrUpdateSkillComponent} className="btn btn-shiny bg-primary-80 gap-x-2 w-fit text-primary-10 mt-4">
        {isEditing ? <Save size={18} /> : <BadgePlus size={18} />}
        <span>{isEditing ? 'Update Skill Component' : 'Add Skill Component'}</span>
      </CustomButton>
      <SavedCriteriaList title="Saved Skill Components" emptyText="Added skill components will appear here." items={skillComponents} onEdit={(item) => editSkillComponent(item as typeof skillComponents[number])} onDelete={(id) => deleteSkillComponent(id)} />
    </div>
  );
};

export default SkillFocusedCriteriaBuilder;

