import { useState } from 'react';
import {
    RubricState,
    RubricType,
    AnalyticalRubric,
    HolisticRubric,
    SinglePointRubric,
    ChecklistRubric,
    OtherRubricType,
} from '@/types/rubrics-types';
import { ChevronDownIcon } from 'lucide-react';

export default function RubricDisplay({ rubric }: { rubric: RubricState }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full mb-4">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row gap-x-3 items-center text-left text-xs font-medium text-gray-100 p-2 rounded bg-orange-600 hover:bg-orange-400"
            >
                <ChevronDownIcon size={16} className={`transform ${isOpen ? 'rotate-180' : ''}`} />
                <p>Rubric Criteria</p>
            </div>
            {isOpen && (
                <div className="mt-2 p-2 border-l-2 border-gray-300 max-h-60 overflow-auto">
                    {renderRubricCriteria(rubric)}
                </div>
            )}
        </div>
    );
}

// Base function to determine which rendering method to use
function renderRubricCriteria(rubric: RubricState) {
    switch (rubric.type) {
        case RubricType.Holistic:
            return renderOverallCriteria(rubric);
        case RubricType.Analytical:
            return renderDetailedCriteria(rubric);
        case RubricType.SinglePoint:
            return renderSinglePointCriteria(rubric as SinglePointRubric);
        case RubricType.Checklist:
            return renderChecklistCriteria(rubric as ChecklistRubric);
        default:
            return renderGenericCriteria(rubric);
    }
}

// Generic renderer for rubrics that don't need specific treatment
function renderGenericCriteria(rubric: OtherRubricType) {
    return (
        <div>
            {Object.entries(rubric.criteria).map(([criterion, levels]) => (
                <div key={criterion} className="mb-4">
                    <p className="text-sm font-semibold">{criterion}</p>
                    {/* Check if levels are an object (i.e., for Analytical/MultiTrait), otherwise treat it as a simple string */}
                    {typeof levels === 'object' ? (
                        Object.entries(levels as Record<string, string>).map(([level, description]) => (
                            <div key={level} className="ml-4">
                                <p className="text-sm font-semibold">{level}</p>
                                <p className="text-sm text-gray-600">{description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-600 ml-4">{levels as string}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

// Renderer for Holistic rubrics
function renderOverallCriteria(rubric: HolisticRubric) {
    return (
        <div>
            {Object.entries(rubric.criteria).map(([level, description]) => (
                <div key={level} className="mb-2">
                    <p className="text-sm font-semibold">{level}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            ))}
        </div>
    );
}

// Renderer for Analytical rubrics
function renderDetailedCriteria(rubric: AnalyticalRubric) {
    return (
        <div>
            {Object.entries(rubric.criteria).map(([criterion, levels]) => (
                <div key={criterion} className="mb-4">
                    <p className="text-sm font-semibold">{criterion}</p>
                    {Object.entries(levels).map(([level, description]) => (
                        <div key={level} className="ml-4">
                            <p className="text-sm font-semibold">{level}</p>
                            <p className="text-sm text-gray-600">{description}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Renderer for Single-Point rubrics
function renderSinglePointCriteria(rubric: SinglePointRubric) {
    return (
        <div>
            <div className="mb-4">
                <p className="text-sm font-semibold">Proficient</p>
                <p className="text-sm text-gray-600">{rubric.criteria.Proficient}</p>
            </div>
            <div className="ml-4">
                <p className="text-sm font-semibold">Strengths</p>
                <p className="text-sm text-gray-600">{rubric.feedback?.Strengths || "No feedback provided"}</p>
            </div>
            <div className="ml-4">
                <p className="text-sm font-semibold">Areas for Improvement</p>
                <p className="text-sm text-gray-600">{rubric.feedback?.["Areas for Improvement"] || "No feedback provided"}</p>
            </div>
        </div>
    );
}

// Renderer for Checklist rubrics
function renderChecklistCriteria(rubric: ChecklistRubric) {
    return (
        <div>
            {Object.entries(rubric.criteria).map(([requirement, response]) => (
                <div key={requirement} className="mb-2">
                    <p className="text-sm font-semibold">{requirement}</p>
                    <p className="text-sm text-gray-600">{response}</p>
                </div>
            ))}
        </div>
    );
}
