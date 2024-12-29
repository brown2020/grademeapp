"use client";

import { RubricState } from '@/lib/types/rubrics-types';
import { XIcon } from 'lucide-react';
import clsx from 'clsx';

interface CustomDropdownProps {
  filteredRubrics: RubricState[];
  handleRubricSelect: (rubric: RubricState) => void;
  openRubricBuilder?: () => void;
  handleClose: () => void;
}

export default function CustomDropdown({
  filteredRubrics,
  handleRubricSelect,
  openRubricBuilder,
  handleClose,
}: CustomDropdownProps) {
  return (
    <div className={clsx(
      "absolute z-10 w-full bg-white border rounded mt-1 shadow-lg max-h-60 overflow-y-auto transform transition-all duration-300 ease-out",
      {
        "opacity-100 scale-100": true, // Assuming it's open when rendered
        "opacity-0 scale-95": false,   // Change this to manage closing styles
      }
    )}>
      {/* Create Custom Rubric option */}
      <div
        className="cursor-pointer font-medium select-none px-4 py-2 text-blue-600 hover:underline"
        onClick={openRubricBuilder} // Open the custom rubric builder
      >
        Create Custom Rubric
      </div>
      <XIcon className="absolute top-2 right-2 w-5 h-5 text-gray-700 cursor-pointer" onClick={handleClose} />

      {filteredRubrics.length > 0 ? (
        filteredRubrics.map((rubric) => (
          <div
            key={rubric.name}
            onClick={() => handleRubricSelect(rubric)}
            className="cursor-pointer select-none px-4 py-2 hover:bg-orange-400 hover:text-white text-gray-900"
          >
            <span className="block text-sm font-semibold">{rubric.name}</span>
            <span className="block text-xs text-gray-600">{rubric.description}</span>
          </div>
        ))
      ) : (
        <div className="cursor-default select-none px-4 py-2 text-gray-700">
          No matching rubrics
        </div>
      )}
    </div>
  );
}
