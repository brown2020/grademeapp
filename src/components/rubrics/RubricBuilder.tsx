"use client"

import React, { useState, useEffect, useCallback } from 'react';
import RubricTypeSelector from '@/components/rubrics/rubricTypes/RubricTypeSelector';
import RubricTypeExplanation from '@/components/rubrics/rubricTypes/RubricTypeExplanation';
import { RubricType } from '@/types/rubrics-types';
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
    updateActiveRubric,
    createNewRubric,
    setShowDeleteModal,
    setRubricToDelete,
    clearActiveRubric,
  } = useRubricStore();
  const [hasSaved, setHasSaved] = useState(false);

  const initializeRubric = useCallback(() => {
    if (editingRubricId) {
      const rubricToEdit = useRubricStore.getState().rubricOptions.find((r) => r.id === editingRubricId);
      if (rubricToEdit) {
        setActiveRubric(rubricToEdit);
      }
    } else if (!activeRubric) {
      createNewRubric(RubricType.Analytical);
    }
  }, [editingRubricId, activeRubric, setActiveRubric, createNewRubric]);

  useEffect(() => {
    initializeRubric();
  }, [initializeRubric]);

  const handleClose = useCallback(() => {
    clearActiveRubric();
    onClose();
  }, [clearActiveRubric, onClose]);

  const handleSaveOrUpdate = useCallback(() => {
    if (!activeRubric) return;

    if (!activeRubric.name.trim() || !activeRubric.description?.trim()) {
      toast.error('Please provide a name and description for the rubric.');
      return;
    }

    if (!Object.keys(activeRubric.criteria).length) {
      toast.error('Please add at least one criterion.');
      return;
    }

    if (editingRubricId) {
      updateCustomRubric(activeRubric.id, activeRubric);
      toast.success('Rubric updated successfully!');
    } else {
      addCustomRubric(activeRubric);
      toast.success('Rubric created successfully!');
    }
    setHasSaved(true);
    handleClose();
  }, [activeRubric, editingRubricId, updateCustomRubric, addCustomRubric, handleClose]);

  const handleRubricTypeChange = useCallback((type: RubricType) => {
    createNewRubric(type);
  }, [createNewRubric]);

  const handleDelete = useCallback(() => {
    if (activeRubric) {
      setRubricToDelete(activeRubric);
      setShowDeleteModal(true);
    }
  }, [activeRubric, setRubricToDelete, setShowDeleteModal]);

  if (!activeRubric) return null;

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
          <div className="block text-primary-20 font-semibold">Rubric Type: {activeRubric?.type}</div>
        </div>
      ) : (
        <div className={`text-sm mb-2 rubric-builder-type-selector`}>
          <label className="block text-primary-20 font-semibold">Rubric Type</label>
          <select
            value={activeRubric?.type}
            onChange={(e) => handleRubricTypeChange(e.target.value as RubricType)}
            className="px-2 py-1 w-full rounded shadow-sm text-xs border border-primary-40"
          >
            {Object.values(RubricType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}

      {activeRubric && <RubricTypeExplanation selectedType={activeRubric.type} />}

      {/* Rubric Name */}
      <div className="w-full h-fit mb-1 rubric-builder-name">
        <label className="block text-sm text-primary-20 font-semibold">Rubric Name</label>
        <input
          type="text"
          name="name"
          value={activeRubric?.name || ''}
          onChange={(e) => updateActiveRubric({ name: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
        />
      </div>

      {/* Rubric Description */}
      <div className="w-full h-fit mb-1 rubric-builder-description">
        <label className="block text-sm text-primary-20 font-semibold">Rubric Description</label>
        <textarea
          name="description"
          value={activeRubric?.description ?? ''}
          onChange={(e) => updateActiveRubric({ description: e.target.value })}
          className="px-1 w-full py-0.5 rounded shadow-sm border border-primary-40"
          rows={2}
        />
      </div>

      <RubricTypeSelector hasSaved={hasSaved} setHasSaved={setHasSaved} />

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