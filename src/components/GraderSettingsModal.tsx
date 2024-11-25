"use client";

import React, { useState, useEffect } from 'react';
import { useRubricStore } from '@/zustand/useRubricStore';
import CustomListbox from '@/components/ui/CustomListbox';
import userInputs from '@/constants/userInputs';
import { Settings } from 'lucide-react';
import CustomButton from '@/components/ui/CustomButton';

const GraderSettingsModal: React.FC = () => {
  const { gradingData, setGradingData } = useRubricStore();
  const [proseOptions, setProseOptions] = useState<string[]>(userInputs.prose.options);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (gradingData.textType && userInputs.prose.details[gradingData.textType]) {
      setProseOptions(userInputs.prose.details[gradingData.textType].options);
    } else {
      setProseOptions(userInputs.prose.options);
    }
  }, [gradingData.textType]);

  const handleChange = (name: string, value: string) => {
    setGradingData({ ...gradingData, [name]: value });
  };

  const closeGraderSettings = () => {
    setIsOpen(false);
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
    }, 300);
  };

  return (
    <div className="grader-settings">
      <CustomButton onClick={isOpen ? closeGraderSettings : () => setIsOpen(true)} className="size-16 btn btn-shiny flex items-center bg-secondary-97 border-2 border-primary-40 rounded-full p-1.5 grader-reset-button">
        <Settings size={30} className="place-self-center place-items-center text-primary-30" />
      </CustomButton>

      <div
        className={`flex flex-col gap-y-4 bg-background border-primary-40 border-t-2 border-l-2 border-b-2 p-2 rounded-l-lg fixed right-0 top-[16svh] h-fit max-w-sm w-full z-10 transition-all ${isOpen ? 'animate-enter grader-settings-open' : isExiting ? 'animate-exit' : 'hidden'}`}
      >
        <div className="flex flex-row gap-x-2 items-center justify-center mb-2">
          <Settings className="text-primary-40" />
          <h2 className="text-xl font-medium">Grader Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-20">Topic:</label>
            <input
              type="text"
              name="topic"
              value={gradingData.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              className="mt-1 p-1 block w-full rounded-md border border-secondary-40 shadow-sm focus:border-primary-60 focus:ring focus:ring-secondary-30 focus:ring-opacity-50"
            />
          </div>
          <div className='flex gap-x-2 items-center'>
            <label className="block text-sm font-medium text-gray-700">Assigner:</label>
            <CustomListbox
              value={gradingData.assigner}
              options={userInputs.assigner.options.student.map(option => ({ label: option, value: option }))}
              onChange={(value) => handleChange('assigner', value)}
              placeholder="Select Assigner"
            />
          </div>

          <div className='flex gap-x-2 items-center'>
            <label className="block text-sm font-medium text-gray-700">Text Type:</label>
            <CustomListbox
              value={gradingData.textType}
              options={userInputs.textType.map(option => ({ label: option.value, value: option.value }))}
              onChange={(value) => handleChange('textType', value)}
              placeholder="Select Text Type"
            />
          </div>

          <div className='flex gap-x-2 items-center'>
            <label className="block text-sm font-medium text-gray-700">Prose:</label>
            <CustomListbox
              value={gradingData.prose}
              options={proseOptions.map(option => ({ label: option, value: option }))}
              onChange={(value) => handleChange('prose', value)}
              placeholder="Select Prose"
            />
          </div>

          <div className='flex gap-x-2 items-center'>
            <label className="block text-sm font-medium text-gray-700">Audience:</label>
            <CustomListbox
              value={gradingData.audience}
              options={userInputs.audience.options.map(option => ({ label: option, value: option }))}
              onChange={(value) => handleChange('audience', value)}
              placeholder="Select Audience"
            />
          </div>

          <div className='flex gap-x-2 items-center'>
            <label className="block text-sm font-medium text-gray-700">Word Limit Type:</label>
            <CustomListbox
              value={gradingData.wordLimitType}
              options={userInputs.wordCount.comparisonType.map(option => ({ label: option, value: option }))}
              onChange={(value) => handleChange('wordLimitType', value)}
              placeholder="Select Word Limit Type"
            />
          </div>

          <div className='flex gap-x-2 items-center'>
            <label className="block text-sm font-medium text-gray-700 text-nowrap">Word Limit:</label>
            <input
              type="number"
              name="wordLimit"
              value={gradingData.wordLimit}
              onChange={(e) => handleChange('wordLimit', e.target.value)}
              className="mt-1 p-1 block w-full rounded-md border border-secondary-40 shadow-sm focus:border-primary-60 focus:ring focus:ring-secondary-30 focus:ring-opacity-50"
              placeholder={`${gradingData.wordLimitType === "less than" || gradingData.wordLimitType === "more than" ? "500" : gradingData.wordLimitType === "between" ? "500-1000" : "enter a number"} `}
            />
          </div>


        </div>

        <div className="flex flex-row gap-x-4 justify-start mt-4">
          <div onClick={closeGraderSettings} className="btn btn-shiny btn-shiny-green grader-settings-done">
            Done
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraderSettingsModal;

