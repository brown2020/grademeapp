"use client"

import React, { useState } from 'react';
import {
    RubricType,
    AnalyticalRubric,
    HolisticRubric,
    RubricState,
    SinglePointRubric,
    ChecklistRubric,
    GenericRubricCriteria
} from '@/types/rubrics-types';
import { toast } from "react-hot-toast";
import { BadgePlus, Ban, Blocks, MinusCircleIcon, Save, XCircleIcon } from 'lucide-react';

// Define the state for the analytical rubric's criteria
interface AnalyticalCriterionState {
    name: string;
    Excellent: string;
    Proficient: string;
    Developing: string;
    Beginning: string;
}

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

export default function RubricBuilder({ onSave, onCancel }: { onSave: (rubric: RubricState) => void; onCancel: () => void }) {
    const [newCriterion, setNewCriterion] = useState<string>('');
    const [editedCriterion, setEditedCriterion] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    // State to track the rubric type and the rubric itself
    const [rubricType, setRubricType] = useState<RubricType>(RubricType.Analytical);
    const [rubric, setRubric] = useState<RubricState>(
        rubricType === RubricType.Analytical ? initialAnalyticalRubric : initialHolisticRubric
    );
    const [currentCriterion, setCurrentCriterion] = useState<AnalyticalCriterionState>({
        name: '',
        Excellent: '',
        Proficient: '',
        Developing: '',
        Beginning: '',
    });

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

        // Pass the custom rubric to the parent component
        onSave(rubric);
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

    // Analytical Rubric: Add Criterion
    const addAnalyticalCriterion = () => {
        if (rubricType !== RubricType.Analytical) return;
        if (!currentCriterion.name.trim()) {
            toast.error('Please provide a name for the criterion.');
            return;
        }

        setRubric((prev) => {
            if (prev.type === RubricType.Analytical) {
                return {
                    ...prev,
                    criteria: {
                        ...prev.criteria,
                        [currentCriterion.name]: {
                            Excellent: currentCriterion.Excellent,
                            Proficient: currentCriterion.Proficient,
                            Developing: currentCriterion.Developing,
                            Beginning: currentCriterion.Beginning,
                        },
                    } as GenericRubricCriteria,
                };
            }
            return prev;
        });

        // Reset the current criterion fields
        setCurrentCriterion({ name: '', Excellent: '', Proficient: '', Developing: '', Beginning: '' });
    };

    // Single Point Rubric: Update criterion and feedback
    const handleSinglePointChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        name: keyof GenericRubricCriteria | 'Strengths' | 'Areas for Improvement'
    ) => {
        const { value } = e.target;

        setRubric((prev) => {
            // Explicitly narrow the type to SinglePointRubric
            if (prev.type === RubricType.SinglePoint) {
                const singlePointRubric = prev as SinglePointRubric;

                // Check if the name corresponds to the "Proficient" criterion
                if (name === 'Proficient') {
                    return {
                        ...singlePointRubric,
                        criteria: {
                            ...singlePointRubric.criteria,
                            [name]: value,
                        } as GenericRubricCriteria,
                    };
                }

                // Handle feedback fields
                if (name === 'Strengths' || name === 'Areas for Improvement') {
                    return {
                        ...singlePointRubric,
                        feedback: {
                            ...singlePointRubric.feedback,
                            [name]: value,
                        },
                    };
                }
            }

            return prev; // If not SinglePointRubric, return unchanged
        });
    };

    // Handle checklist name changes
    const handleChecklistChange = (e: React.ChangeEvent<HTMLInputElement>, criterion: string) => {
        const { value } = e.target;
        setTempValue(value); // Store the temporary value being edited
        setEditedCriterion(criterion); // Track the current editing criterion
    };

    // Apply the changes on blur (or after editing is done)
    const applyChecklistChange = () => {
        if (!editedCriterion || tempValue === '') return;

        setRubric((prev) => {
            if (prev.type === RubricType.Checklist) {
                const updatedCriteria = { ...prev.criteria as GenericRubricCriteria };
                delete updatedCriteria[editedCriterion]; // Remove the old criterion key
                updatedCriteria[tempValue] = (prev.criteria as GenericRubricCriteria)[editedCriterion]; // Assign the updated criterion key
                return {
                    ...prev,
                    criteria: updatedCriteria,
                };
            }
            return prev;
        });

        setEditedCriterion(null); // Clear editing state
        setTempValue(''); // Reset temporary value
    };

    // Add a new checklist criterion
    const addNewChecklistCriterion = () => {
        if (!newCriterion.trim()) {
            toast.error('Please enter a criterion.');
            return;
        }

        setRubric((prev) => {
            if (prev.type === RubricType.Checklist) {
                return {
                    ...prev,
                    criteria: {
                        ...prev.criteria,
                        [newCriterion]: 'Yes/No', // Default Yes/No value
                    } as GenericRubricCriteria,
                };
            }
            return prev;
        });
        setNewCriterion(''); // Clear the input field after adding
    };

    // Remove a checklist criterion
    const removeChecklistCriterion = (criterion: string) => {
        setRubric((prev) => {
            if (prev.type === RubricType.Checklist) {
                const updatedCriteria = { ...prev.criteria as GenericRubricCriteria };
                delete updatedCriteria[criterion];
                return {
                    ...prev,
                    criteria: updatedCriteria,
                };
            }
            return prev;
        });
    };

    // Holistic Rubric: Update levels
    const handleHolisticLevelChange = (e: React.ChangeEvent<HTMLTextAreaElement>, level: keyof GenericRubricCriteria) => {
        const { value } = e.target;
        setRubric((prev) => {
            if (prev.type === RubricType.Holistic) {
                return {
                    ...prev,
                    criteria: {
                        ...(prev.criteria as GenericRubricCriteria),
                        [level]: value,
                    },
                };
            }
            return prev;
        });
    };

    return (
        <div className="bg-background relative">
            <div onClick={onCancel} className="absolute top-0 right-0 cursor-pointer">
                <XCircleIcon className="h-6 w-6 text-primary" />
            </div>

            <div className='flex flex-row gap-x-2 justify-center'>
                <Blocks className="text-primary" />
                <h2 className="text-xl font-medium mb-1 text-primary text-center">Rubric Builder</h2>
            </div>

            {/* Rubric Type Selection */}
            <div className="mb-2">
                <label className="block text-sm text-primary font-semibold">Rubric Type</label>
                <select
                    value={rubricType}
                    onChange={(e) => handleRubricTypeChange(e.target.value as RubricType)}
                    className="px-2 bg-secondary w-full rounded shadow-md"
                >
                    <option className='text-sm ' value={RubricType.Analytical}>Analytical</option>
                    <option className='text-sm ' value={RubricType.Holistic}>Holistic</option>
                    <option className='text-sm ' value={RubricType.SinglePoint}>Single Point</option>
                    <option className='text-sm ' value={RubricType.Checklist}>Checklist</option>
                </select>
            </div>

            {/* Rubric Name */}
            <div className="mb-1">
                <label className="block text-sm text-primary font-semibold">Rubric Name</label>
                <input
                    type="text"
                    name="name"
                    value={rubric.name}
                    onChange={handleRubricDetailChange}
                    className="px-2 w-full py-0.5 rounded bg-secondary shadow-md text-sm"
                />
            </div>

            {/* Rubric Description */}
            <div className="mb-1">
                <label className="block text-sm text-primary font-semibold">Rubric Description</label>
                <textarea
                    name="description"
                    value={rubric.description}
                    onChange={handleRubricDetailChange}
                    className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                    rows={2}
                />
            </div>

            {/* Analytical Rubric Creation */}
            {rubricType === RubricType.Analytical && (
                <div className="mb-2">
                    <h3 className="text-center font-semibold">Create Criterion</h3>
                    <hr className="border border-accent mb-1" />
                    <div className="mb-1">
                        <label className="block text-sm font-semibold">Criterion Name</label>
                        <input
                            type="text"
                            name="name"
                            value={currentCriterion.name}
                            onChange={(e) => setCurrentCriterion({ ...currentCriterion, name: e.target.value })}
                            className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                        />
                    </div>

                    {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as Array<keyof AnalyticalCriterionState>).map((level) => (
                        <div key={level} className="">
                            <label className="block text-sm font-semibold">{level}</label>
                            <textarea
                                name={level}
                                value={currentCriterion[level]}
                                onChange={(e) => setCurrentCriterion({ ...currentCriterion, [level]: e.target.value })}
                                className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                                rows={1}
                            />
                        </div>
                    ))}

                    <div onClick={addAnalyticalCriterion} className="flex flex-row items-center gap-x-2 px-4 py-1 w-fit bg-primary text-primary-foreground rounded-md shadow-md cursor-pointer">
                        <BadgePlus size={18} />
                        <p>Add Criterion</p>
                    </div>
                </div>
            )}

            {/* Holistic Rubric Creation */}
            {rubricType === RubricType.Holistic && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Add Level Descriptions</h3>
                    {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as Array<keyof HolisticRubric['criteria']>).map((level) => (
                        <div key={level} className="mb-2">
                            <label className="block text-sm font-semibold">{level}</label>
                            <textarea
                                value={typeof (rubric.criteria as GenericRubricCriteria)[level] === 'string' ? (rubric.criteria as GenericRubricCriteria)[level] as string : ''}
                                onChange={(e) => handleHolisticLevelChange(e, level)}
                                className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Single Point Rubric Creation */}
            {rubricType === RubricType.SinglePoint && (
                <div className="mb-2">
                    <h3 className="text-center font-semibold">Single Point Criterion</h3>
                    <hr className="border border-accent mb-1" />
                    {/* Proficient Field */}
                    <div className="mb-1">
                        <label className="block font-semibold">Proficient</label>
                        <textarea
                            value={typeof (rubric.criteria as GenericRubricCriteria).Proficient === 'string' ? (rubric.criteria as GenericRubricCriteria).Proficient as string : ''}
                            onChange={(e) => handleSinglePointChange(e, 'Proficient')}
                            className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                            rows={2}
                        />
                    </div>

                    {/* Strengths Field */}
                    {/* Narrow the rubric type before accessing feedback */}
                    {rubric.type === RubricType.SinglePoint && (
                        <div className="mb-1">
                            <label className="block font-semibold">Strengths</label>
                            <textarea
                                value={(rubric as SinglePointRubric).feedback?.Strengths || ''}
                                onChange={(e) => handleSinglePointChange(e, 'Strengths')}
                                className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                                rows={2}
                            />
                        </div>
                    )}

                    {/* Areas for Improvement Field */}
                    {rubric.type === RubricType.SinglePoint && (
                        <div className="mb-1">
                            <label className="block font-semibold">Areas for Improvement</label>
                            <textarea
                                value={(rubric as SinglePointRubric).feedback?.["Areas for Improvement"] || ''}
                                onChange={(e) => handleSinglePointChange(e, 'Areas for Improvement')}
                                className="px-2 py-0.5 w-full rounded bg-secondary shadow-md text-sm"
                                rows={2}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Checklist Rubric Creation */}
            {rubricType === RubricType.Checklist && (
                <div className="mb-2">
                    <h3 className="text-center font-semibold">Checklist</h3>
                    <hr className="border border-accent mb-1" />
                    {/* Render existing checklist criteria */}
                    {Object.entries(rubric.criteria as GenericRubricCriteria).map(([criterion, yesNoValue]) => (
                        <div key={criterion} className="mb-3 flex flex-row items-center gap-x-2">
                            {/* Editable input for the criterion name */}
                            <input
                                type="text"
                                value={editedCriterion === criterion ? tempValue : criterion} // If editing, use the tempValue
                                onChange={(e) => handleChecklistChange(e, criterion)}
                                onBlur={applyChecklistChange} // Apply the change on blur
                                className="shadow-md bg-secondary px-2 py-0.5 w-full rounded"
                            />
                            {/* Static Yes/No value */}
                            <label className="block font-semibold mt-1">{typeof yesNoValue === 'string' ? yesNoValue : ''}</label>
                            {/* Delete button */}
                            <button onClick={() => removeChecklistCriterion(criterion)} className="ml-2 text-red-600">
                                <MinusCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    {/* Input field for new criterion */}
                    <div className="flex flex-row items-center gap-x-2">
                        <input
                            type="text"
                            value={newCriterion}
                            onChange={(e) => setNewCriterion(e.target.value)}
                            placeholder="Enter new criterion"
                            className="shadow-md bg-secondary px-2 py-0.5 w-full rounded"
                        />
                        <div onClick={addNewChecklistCriterion} className="flex flex-row items-center gap-x-2 px-3 py-1 bg-accent text-primary-foreground rounded-md shadow-md cursor-pointer">                            
                            <p>Add</p>
                            <BadgePlus size={18} />
                        </div>
                    </div>
                </div>
            )}

            {/* Save and Cancel Buttons */}
            <div className="flex flex-row justify-start gap-4 mt-4">
                <div onClick={handleSave} className="flex flex-row items-center gap-x-2 px-4 py-1 bg-accent text-primary-foreground rounded-lg shadow-md cursor-pointer">
                    <Save size={18} />
                    <p>Save Rubric</p>
                </div>
                <div onClick={onCancel} className="flex flex-row items-center py-1 gap-x-2 px-4 bg-red-600 text-white rounded-lg shadow-md cursor-pointer">
                    <Ban size={18} />
                    <p>Cancel</p>
                </div>
            </div>
        </div>
    );
}
