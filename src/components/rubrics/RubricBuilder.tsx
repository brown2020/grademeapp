"use client"

import React, { useState, useEffect, useCallback } from 'react';
import RubricTypeSelector from '@/components/rubrics/criteriaBuilders/RubricTypeSelector';
import RubricTypeExplanation from '@/components/rubrics/criteriaBuilders/RubricTypeExplanation';
import { RubricState, RubricType } from '@/lib/types/rubrics-types';
import { toast } from "react-hot-toast";
import { Ban, Blocks, Save, XCircleIcon, DeleteIcon } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';
import { useRubricStore } from "@/zustand/useRubricStore";
import RubricBuilderTour from '@/components/tours/RubricBuilderTour';

export default function RubricBuilder({ onClose }: {
  onClose: () => void;
}) {
  const {
    addCustomRubric,
    updateCustomRubric,
    editingRubricId,
    activeRubric,
    setActiveRubric,
    createNewRubric,
    setShowDeleteModal,
    setRubricToDelete,
    clearActiveRubric,
    rubricOptions,
  } = useRubricStore();
  const [hasSaved, setHasSaved] = useState(false);
  const [localRubric, setLocalRubric] = useState<RubricState | null>(null);

  const initializeRubric = useCallback(() => {
    if (editingRubricId) {
      const rubricToEdit = rubricOptions.find((r) => r.id === editingRubricId);
      if (rubricToEdit) {
        setActiveRubric(rubricToEdit);
        setLocalRubric(rubricToEdit);
      }
    } else if (!activeRubric) {
      const newRubric = createNewRubric(RubricType.Analytical);
      setLocalRubric(newRubric);
    }
  }, [editingRubricId, activeRubric, setActiveRubric, createNewRubric, rubricOptions]);

  useEffect(() => {
    initializeRubric();
  }, [initializeRubric]);

  useEffect(() => {
    if (activeRubric) {
      setLocalRubric(activeRubric);
    }
  }, [activeRubric]);

  const handleClose = useCallback(() => {
    clearActiveRubric();
    onClose();
  }, [clearActiveRubric, onClose])

  const handleSaveOrUpdate = useCallback(() => {
    if (!localRubric) {
      return;
    }
    if (!localRubric.name.trim() || !localRubric.description?.trim()) {
      toast.error('Please provide a name and description for the rubric.');
      return;
    }
    if (!Object.keys(localRubric.criteria).length) {
      toast.error('Please add at least one criterion.');
      return;
    }
    if (editingRubricId) {
      updateCustomRubric(localRubric.id, localRubric);
      toast.success('Rubric updated successfully!');
    } else {
      addCustomRubric(localRubric);
      toast.success('Rubric created successfully!');
    }
    setHasSaved(true);
    handleClose();
  }, [localRubric, editingRubricId, updateCustomRubric, addCustomRubric, handleClose])

  const handleRubricTypeChange = useCallback((type: RubricType) => {
    const newRubric = createNewRubric(type);
    setLocalRubric(newRubric);
  }, [createNewRubric]);

  const handleDelete = useCallback(() => {
    if (localRubric) {
      setRubricToDelete(localRubric);
      setShowDeleteModal(true);
    }
  }, [localRubric, setRubricToDelete, setShowDeleteModal]);

  const formatRubricType = (type: string) => {
    // first replace underscore with a space, then replace the first char of each with its uppercase version
    return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleInputChange = (field: keyof RubricState, value: string) => {
    setLocalRubric(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (!localRubric) return null;

  return (
    <div className="flex flex-col pb-1 z-50 rubric-builder">
      <div className="flex justify-between">
        <RubricBuilderTour />
        <XCircleIcon onClick={handleClose} className="h-6 w-6 text-primary-10 cursor-pointer" />
      </div>

      <div className='flex flex-col gap-x-2 gap-y-2 items-center text-primary-30 mb-2'>
        <div className='flex gap-x-2'>
          <Blocks />
          <h2 className="text-xl font-medium mb-1 text-center">Rubric Builder</h2>
        </div>
        <p className='text-primary-10 text-xs md:text-sm'>Rubrics created in the Rubric Builder are accessible in your custom rubrics.</p>
      </div>

      {/* Rubric Type Selection */}
      {editingRubricId ? (
        <div className={`py-2`}>
          <div className="block text-primary-20 font-semibold">Rubric Type: {localRubric?.type}</div>
        </div>
      ) : (
        <div className={`text-sm mb-2 rubric-builder-type-selector`}>
          <label className="block text-primary-20 font-semibold">Rubric Type</label>
          <select
            value={localRubric?.type}
            onChange={(e) => handleRubricTypeChange(e.target.value as RubricType)}
            className="px-2 py-1 w-full rounded shadow-sm text-xs border border-primary-40"
          >
            {Object.values(RubricType)
              .filter((type) => typeof type === 'string')
              .map((type) => (
                <option key={type} value={type}>{formatRubricType(type)}</option>
              ))}
          </select>
        </div>
      )}

      {localRubric && <RubricTypeExplanation selectedType={localRubric.type} />}

      {/* Rubric Name */}
      <div className="w-full h-fit mb-1 rubric-builder-name">
        <label className="block text-sm text-primary-20 font-semibold">Rubric Name</label>
        <input
          type="text"
          name="name"
          value={localRubric?.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>

      {/* Rubric Description */}
      <div className="w-full h-fit mb-1 rubric-builder-description">
        <label className="block text-sm text-primary-20 font-semibold">Rubric Description</label>
        <textarea
          name="description"
          value={localRubric?.description ?? ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>

      <RubricTypeSelector
        rubric={localRubric}
        onChange={setLocalRubric}
        hasSaved={hasSaved}
        setHasSaved={setHasSaved}
      />

      {/* Save and Cancel Buttons */}
      <div className='flex flex-row justify-between'>
        <div className="flex flex-row justify-start gap-4">
          <CustomButton onClick={handleSaveOrUpdate} className='btn btn-shiny btn-shiny-green rubric-builder-save'>
            <Save size={18} />
            <p>{editingRubricId ? 'Update Rubric' : 'Save Rubric'}</p>
          </CustomButton>
          <CustomButton onClick={handleClose} className="btn btn-shiny btn-shiny-red rubric-builder-cancel">
            <Ban size={18} />
            <p>Cancel</p>
          </CustomButton>
        </div>
        {editingRubricId && (
          <CustomButton onClick={() => {
            handleDelete();
            handleClose();
          }} className="btn btn-shiny btn-shiny-red">
            <DeleteIcon size={18} />
            <p>Delete Rubric</p>
          </CustomButton>
        )}
      </div>
    </div>
  );
}