"use client"

import React, { useState } from 'react';
import RubricTypeSelector from '@/components/rubrics/rubricTypes/RubricTypeSelector';
import RubricTypeExplanation from '@/components/rubrics/rubricTypes/RubricTypeExplanation';
import {
  RubricType,
  AnalyticalRubric,
  HolisticRubric,
  RubricState,
  SinglePointRubric,
  ChecklistRubric,
  OtherRubricType,
} from '@/types/rubrics-types';
import { toast } from "react-hot-toast";
import { Ban, Blocks, Save, XCircleIcon } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';


// Initial state for an Analytical Rubric
const initialAnalyticalRubric: AnalyticalRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Analytical,
  criteria: {},
};

// Initial state for a Holistic Rubric
const initialHolisticRubric: HolisticRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Holistic,
  criteria: {
    Excellent: '',
    Proficient: '',
    Developing: '',
    Beginning: '',
  },
};

// Initial state for a Single Point Rubric
const initialSinglePointRubric: SinglePointRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.SinglePoint,
  criteria: {
    Proficient: ''
  },
  feedback: {
    Strengths: '',
    "Areas for Improvement": ''
  }
};

// Initial state for a Checklist Rubric
const initialChecklistRubric: ChecklistRubric = {
  id: '',
  name: '',
  description: '',
  type: RubricType.Checklist,
  criteria: {
    "Has a clear introduction": "Yes/No",
    "Main idea is developed with supporting details": "Yes/No",
    "Organized logically": "Yes/No",
  }
};

// Initial state for Other Rubric Types
const initialOtherRubric: OtherRubricType = {
  id: '',
  name: '',
  description: '',
  type: RubricType.ContentSpecific,
  criteria: {}
};

export default function RubricBuilder({ onSave, onCancel }: { onSave: (rubric: RubricState) => void; onCancel: () => void }) {
  // State to track the rubric type and the rubric itself
  const [hasSaved, setHasSaved] = useState(false);
  const [rubricType, setRubricType] = useState<RubricType>(RubricType.Analytical);
  const [rubric, setRubric] = useState<RubricState>(
    rubricType === RubricType.Analytical ? initialAnalyticalRubric : initialHolisticRubric
  );

  // Function to handle saving the rubric
  const handleSave = () => {
    if (!rubric.name.trim()) {
      toast.error('Please provide a name for the rubric.');
      return;
    }
    if (!rubric.description?.trim()) {
      toast.error('Please provide a description for the rubric.');
      return;
    }

    if (rubricType === RubricType.Analytical && Object.keys(rubric.criteria).length === 0) {
      toast.error('Please add at least one criterion to the rubric.');
      return;
    }
    if (rubricType === RubricType.Holistic && Object.values(rubric.criteria).some((level) => typeof level === 'string' && !level.trim())) {
      toast.error('Please provide a description for all levels of the rubric.');
      return;
    }

    if (rubricType === RubricType.SinglePoint && Object.keys(rubric.criteria).length === 0) {
      toast.error('Please add at least one criterion to the rubric.');
      return;
    }
    onSave(rubric);
    setHasSaved(true);
    setRubric(initialAnalyticalRubric);
    setRubricType(RubricType.Analytical);
  };

  // Handle switching between rubric types
  const handleRubricTypeChange = (type: RubricType) => {
    setRubricType(type);
    switch (type) {
      case RubricType.Analytical:
        setRubric(initialAnalyticalRubric);
        break;
      case RubricType.Holistic:
        setRubric(initialHolisticRubric);
        break;
      case RubricType.SinglePoint:
        setRubric(initialSinglePointRubric);
        break;
      case RubricType.Checklist:
        setRubric(initialChecklistRubric);
        break;
      case RubricType.ContentSpecific:
        setRubric(initialOtherRubric)
      default:
        setRubric(initialHolisticRubric);
    }
  };

  // Update rubric name or description
  const handleRubricDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRubric((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col relative pb-1 z-50">
      <div onClick={onCancel} className="absolute top-0 right-0 cursor-pointer">
        <XCircleIcon className="h-6 w-6 text-primary-10" />
      </div>

      <div className='flex flex-row gap-x-2 justify-center text-primary-30'>
        <Blocks />
        <h2 className="text-xl font-medium mb-1 text-center">Rubric Builder</h2>
      </div>

      {/* Rubric Type Selection */}

      <div className="text-sm mb-2">
        <label className="block text-primary-20 font-semibold">Rubric Type</label>
        <select
          value={rubricType}
          onChange={(e) => handleRubricTypeChange(e.target.value as RubricType)}
          className="px-2 py-0.5 w-full rounded shadow-sm border border-primary-40"
        >
          <option className='text-sm ' value={RubricType.Analytical}>Analytical</option>
          <option className='text-sm ' value={RubricType.Holistic}>Holistic</option>
          <option className='text-sm ' value={RubricType.SinglePoint}>Single Point</option>
          <option className='text-sm ' value={RubricType.Checklist}>Checklist</option>
          <option className='text-sm ' value={RubricType.ContentSpecific}>Content Specific</option>
          <option className='text-sm ' value={RubricType.Developmental}>Developmental</option>
        </select>
      </div>

      <RubricTypeExplanation selectedType={rubricType} />

      {/* Rubric Name */}
      <div className="mb-1">
        <label className="block text-sm text-primary-20 font-semibold">Rubric Name</label>
        <input
          type="text"
          name="name"
          value={rubric.name}
          onChange={handleRubricDetailChange}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>

      {/* Rubric Description */}
      <div className="mb-1">
        <label className="block text-sm text-primary-20 font-semibold">Rubric Description</label>
        <textarea
          name="description"
          value={rubric.description}
          onChange={handleRubricDetailChange}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>

      <RubricTypeSelector rubricType={rubricType} rubric={rubric} onChange={setRubric} hasSaved={hasSaved} setHasSaved={setHasSaved} />

      {/* Save and Cancel Buttons */}
      <div className="flex flex-row justify-start gap-4">
        <CustomButton onClick={handleSave} className='btn btn-shiny btn-shiny-green'>
          <Save size={18} />
          <p>Save Rubric</p>
        </CustomButton>
        <CustomButton onClick={onCancel} className="btn btn-shiny btn-shiny-red">
          <Ban size={18} />
          <p>Cancel</p>
        </CustomButton>
      </div>
    </div>
  );
}
