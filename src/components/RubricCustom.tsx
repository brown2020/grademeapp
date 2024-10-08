import React, { useState } from 'react';
import {
    RubricType,
    AnalyticalRubric,
    HolisticRubric,
    RubricState,
    AnalyticalRubricCriteria,
    HolisticRubricCriteria,
    SinglePointRubric,
    SinglePointRubricCriteria,
    ChecklistRubric,
    ChecklistRubricCriteria
} from '@/types/rubrics-types';
import { toast } from "react-hot-toast";
import { MinusCircleIcon, XCircleIcon } from 'lucide-react';

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
    name: '',
    description: '',
    type: RubricType.Analytical,
    criteria: {},
};

// Initial state for a Holistic Rubric
const initialHolisticRubric: HolisticRubric = {
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
    name: '',
    description: '',
    type: RubricType.Checklist,
    criteria: {
        "Has a clear introduction": "Yes/No",
        "Main idea is developed with supporting details": "Yes/No",
        "Organized logically": "Yes/No",
    }
};

export default function CustomRubricBuilder({ onSave, onCancel }: { onSave: (rubric: RubricState) => void; onCancel: () => void }) {
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
        if (rubricType === RubricType.Holistic && Object.values(rubric.criteria).some((level) => !level.trim())) {
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
                    } as AnalyticalRubricCriteria,
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
        name: keyof SinglePointRubricCriteria | 'Strengths' | 'Areas for Improvement'
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
                        } as SinglePointRubricCriteria,
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
                const updatedCriteria = { ...prev.criteria as ChecklistRubricCriteria };
                delete updatedCriteria[editedCriterion]; // Remove the old criterion key
                updatedCriteria[tempValue] = (prev.criteria as ChecklistRubricCriteria)[editedCriterion]; // Assign the updated criterion key
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
                    } as ChecklistRubricCriteria,
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
                const updatedCriteria = { ...prev.criteria as ChecklistRubricCriteria };
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
    const handleHolisticLevelChange = (e: React.ChangeEvent<HTMLTextAreaElement>, level: keyof HolisticRubricCriteria) => {
        const { value } = e.target;
        setRubric((prev) => {
            if (prev.type === RubricType.Holistic) {
                return {
                    ...prev,
                    criteria: {
                        ...(prev.criteria as HolisticRubricCriteria),
                        [level]: value,
                    },
                };
            }
            return prev;
        });
    };

    return (
        <div className="p-2 bg-white rounded shadow relative">
            <div onClick={onCancel} className="absolute top-2 right-2 cursor-pointer">
                <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-4">Create Your Custom Rubric</h2>

            {/* Rubric Type Selection */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Rubric Type</label>
                <select
                    value={rubricType}
                    onChange={(e) => handleRubricTypeChange(e.target.value as RubricType)}
                    className="border px-2 py-1 w-full rounded"
                >
                    <option value={RubricType.Analytical}>Analytical</option>
                    <option value={RubricType.Holistic}>Holistic</option>
                    <option value={RubricType.SinglePoint}>Single Point</option>
                    <option value={RubricType.Checklist}>Checklist</option>
                </select>
            </div>

            {/* Rubric Name */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Rubric Name</label>
                <input
                    type="text"
                    name="name"
                    value={rubric.name}
                    onChange={handleRubricDetailChange}
                    className="border px-2 py-1 w-full rounded"
                />
            </div>

            {/* Rubric Description */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">Rubric Description</label>
                <textarea
                    name="description"
                    value={rubric.description}
                    onChange={handleRubricDetailChange}
                    className="border px-2 py-1 w-full rounded"
                    rows={3}
                />
            </div>

            {/* Analytical Rubric Creation */}
            {rubricType === RubricType.Analytical && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Add Criterion</h3>
                    <div className="mb-2">
                        <label className="block font-semibold">Criterion Name</label>
                        <input
                            type="text"
                            name="name"
                            value={currentCriterion.name}
                            onChange={(e) => setCurrentCriterion({ ...currentCriterion, name: e.target.value })}
                            className="border px-2 py-1 w-full rounded"
                        />
                    </div>

                    {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as Array<keyof AnalyticalCriterionState>).map((level) => (
                        <div key={level} className="mb-2">
                            <label className="block font-semibold">{level}</label>
                            <textarea
                                name={level}
                                value={currentCriterion[level]}
                                onChange={(e) => setCurrentCriterion({ ...currentCriterion, [level]: e.target.value })}
                                className="border px-2 py-1 w-full rounded"
                                rows={2}
                            />
                        </div>
                    ))}

                    <button
                        onClick={addAnalyticalCriterion}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
                    >
                        Add Criterion
                    </button>
                </div>
            )}

            {/* Holistic Rubric Creation */}
            {rubricType === RubricType.Holistic && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Add Level Descriptions</h3>
                    {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as Array<keyof HolisticRubric['criteria']>).map((level) => (
                        <div key={level} className="mb-2">
                            <label className="block font-semibold">{level}</label>
                            <textarea
                                value={(rubric.criteria as HolisticRubricCriteria)[level]}
                                onChange={(e) => handleHolisticLevelChange(e, level)}
                                className="border px-2 py-1 w-full rounded"
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Single Point Rubric Creation */}
            {rubricType === RubricType.SinglePoint && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Single Point Criterion</h3>

                    {/* Proficient Field */}
                    <div className="mb-2">
                        <label className="block font-semibold">Proficient</label>
                        <textarea
                            value={(rubric.criteria as SinglePointRubricCriteria).Proficient}
                            onChange={(e) => handleSinglePointChange(e, 'Proficient')}
                            className="border px-2 py-1 w-full rounded"
                            rows={2}
                        />
                    </div>

                    {/* Strengths Field */}
                    {/* Narrow the rubric type before accessing feedback */}
                    {rubric.type === RubricType.SinglePoint && (
                        <div className="mb-2">
                            <label className="block font-semibold">Strengths</label>
                            <textarea
                                value={(rubric as SinglePointRubric).feedback?.Strengths || ''}
                                onChange={(e) => handleSinglePointChange(e, 'Strengths')}
                                className="border px-2 py-1 w-full rounded"
                                rows={2}
                            />
                        </div>
                    )}

                    {/* Areas for Improvement Field */}
                    {rubric.type === RubricType.SinglePoint && (
                        <div className="mb-2">
                            <label className="block font-semibold">Areas for Improvement</label>
                            <textarea
                                value={(rubric as SinglePointRubric).feedback?.["Areas for Improvement"] || ''}
                                onChange={(e) => handleSinglePointChange(e, 'Areas for Improvement')}
                                className="border px-2 py-1 w-full rounded"
                                rows={2}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Checklist Rubric Creation */}
            {rubricType === RubricType.Checklist && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Checklist</h3>

                    {/* Render existing checklist criteria */}
                    {Object.entries(rubric.criteria as ChecklistRubricCriteria).map(([criterion, yesNoValue]) => (
                        <div key={criterion} className="mb-2 flex flex-row items-center gap-x-2">
                            {/* Editable input for the criterion name */}
                            <input
                                type="text"
                                value={editedCriterion === criterion ? tempValue : criterion} // If editing, use the tempValue
                                onChange={(e) => handleChecklistChange(e, criterion)}
                                onBlur={applyChecklistChange} // Apply the change on blur
                                className="border px-2 py-1 w-full rounded"
                            />
                            {/* Static Yes/No value */}
                            <label className="block font-semibold mt-1">{yesNoValue}</label>
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
                            className="border px-2 py-1 w-full rounded"
                        />
                        <button
                            onClick={addNewChecklistCriterion}
                            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* Save and Cancel Buttons */}
            <div className="flex flex-row justify-start gap-4 mt-4">
                <div
                    onClick={handleSave}
                    className="px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-500 cursor-pointer"
                >
                    Save Rubric
                </div>
                <div
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-500 cursor-pointer"
                >
                    Cancel
                </div>
            </div>
        </div>
    );
}
