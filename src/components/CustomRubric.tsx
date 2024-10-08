import React, { useState } from 'react';
import { RubricType, AnalyticalRubric, HolisticRubric, RubricState, AnalyticalRubricCriteria, HolisticRubricCriteria } from '@/types/rubrics';
import { toast } from "react-hot-toast";

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

export default function CustomRubricBuilder({ onSave, onCancel }: { onSave: (rubric: RubricState) => void; onCancel: () => void }) {
    // State to track if we're building an analytical or holistic rubric
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
        // Validate rubric fields
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
        setRubric(type === RubricType.Analytical ? initialAnalyticalRubric : initialHolisticRubric);
    };

    // Update rubric name or description
    const handleRubricDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRubric((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update criterion input fields for Analytical Rubric
    const handleAnalyticalCriterionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentCriterion((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add a criterion for Analytical Rubrics
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

    // Update holistic criteria descriptions
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
        <div className="p-4 bg-white rounded shadow">
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

            {/* Add Criterion Section for Analytical Rubric */}
            {rubricType === RubricType.Analytical && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Add Criterion</h3>
                    <div className="mb-2">
                        <label className="block font-semibold">Criterion Name</label>
                        <input
                            type="text"
                            name="name"
                            value={currentCriterion.name}
                            onChange={handleAnalyticalCriterionChange}
                            className="border px-2 py-1 w-full rounded"
                        />
                    </div>

                    {(['Excellent', 'Proficient', 'Developing', 'Beginning'] as Array<keyof AnalyticalCriterionState>).map((level) => (
                        <div key={level} className="mb-2">
                            <label className="block font-semibold">{level}</label>
                            <textarea
                                name={level}
                                value={currentCriterion[level]}
                                onChange={handleAnalyticalCriterionChange}
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

            {/* Add Level Descriptions for Holistic Rubric */}
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

            {/* Display the created rubric */}
            <div>
                <h3 className="text-lg font-bold mt-6">Rubric Preview</h3>
                <p className="font-semibold">Name: {rubric.name}</p>
                <p className="mb-4">Description: {rubric.description}</p>

                {/* Display criteria for Analytical Rubrics */}
                {rubricType === RubricType.Analytical && (
                    <ul>
                        {Object.entries(rubric.criteria as AnalyticalRubricCriteria).map(([name, criteria]) => (
                            <li key={name} className="mb-4 p-2 border border-gray-300 rounded">
                                <h4 className="font-semibold">{name}</h4>
                                <p><strong>Excellent:</strong> {criteria.Excellent}</p>
                                <p><strong>Proficient:</strong> {criteria.Proficient}</p>
                                <p><strong>Developing:</strong> {criteria.Developing}</p>
                                <p><strong>Beginning:</strong> {criteria.Beginning}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Display criteria for Holistic Rubrics */}
                {rubricType === RubricType.Holistic && (
                    <div className="mb-4 p-2 border border-gray-300 rounded">
                        <p><strong>Excellent:</strong> {(rubric.criteria as HolisticRubricCriteria).Excellent}</p>
                        <p><strong>Proficient:</strong> {(rubric.criteria as HolisticRubricCriteria).Proficient}</p>
                        <p><strong>Developing:</strong> {(rubric.criteria as HolisticRubricCriteria).Developing}</p>
                        <p><strong>Beginning:</strong> {(rubric.criteria as HolisticRubricCriteria).Beginning}</p>
                    </div>
                )}
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex flex-row justify-start gap-4 mt-4">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-500"
                >
                    Save Rubric
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-500"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
