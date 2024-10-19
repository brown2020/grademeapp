"use client"

import {
    RubricState,
    RubricType,
    AnalyticalRubric,
    HolisticRubric,
    SinglePointRubric,
    ChecklistRubric,
    OtherRubricType,
} from '@/types/rubrics-types';
 

export default function RubricDisplay({ rubric }: { rubric: RubricState }) {

    return (
        <div className="w-full h-52">
            <div className="flex flex-col p-1 rounded-md bg-primary">
                <p className=" text-left font-medium text-background pl-2 pb-1">Rubric Criteria</p>
                <div className="bg-background p-1 rounded-sm">
                    <div className="mt-2 p-1 text-xs border-l-2 border-accent h-40 max-h-40 overflow-auto">
                        {renderRubricCriteria(rubric)}
                    </div>
                </div>
            </div>
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
            return renderGenericCriteria(rubric as OtherRubricType);
    }
}

// Generic renderer for rubrics that don't need specific treatment
function renderGenericCriteria(rubric: OtherRubricType) {
    return (
        <div>
            {Object.entries(rubric.criteria).map(([criterion, levels]) => (
                <div key={criterion} className="mb-4">
                    <p className=" font-semibold">{criterion}</p>
                    {/* Check if levels are an object (i.e., for Analytical/MultiTrait), otherwise treat it as a simple string */}
                    {typeof levels === 'object' ? (
                        Object.entries(levels as Record<string, string>).map(([level, description]) => (
                            <div key={level} className="ml-4">
                                <p className=" font-semibold">{level}</p>
                                <p className=" text-text">{typeof description === 'string' ? description : ''}</p>
                            </div>
                        ))
                    ) : (
                        <p className=" text-gray-600 ml-4">{levels as string}</p>
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
                    <p className=" font-semibold">{level}</p>
                    <p className=" text-gray-600">{typeof description === 'string' ? description : ''}</p>
                </div>
            ))}
        </div>
    );
}

// Updated Renderer for Analytical rubrics to handle nested criteria
function renderDetailedCriteria(rubric: AnalyticalRubric) {
    return (
        <div>
            {Object.entries(rubric.criteria).map(([criterion, details]) => (
                <div key={criterion} className="mb-4">
                    <p className=" font-semibold mb-2">{criterion}</p>
                    {typeof details === 'object' && 'points' in details ? (
                        <div>
                            <p className="ml-3  font-medium mb-2">Points: {details.points as string | number}</p>
                            {Object.entries(details).map(([level, content]) =>
                                level !== 'points' ? (
                                    <div key={level} className="flex flex-row flex-wrap gap-x-2 ml-3 mb-2">
                                        <p className=" font-semibold">{level}: </p>
                                        <p>{renderContent(content)}</p> {/* Recursively handle nested content */}
                                    </div>
                                ) : null
                            )}
                        </div>
                    ) : (
                        renderContent(details)
                    )}
                </div>
            ))}
        </div>
    );
}

// Recursive function to render content
function renderContent(content: unknown): React.ReactNode {
    if (typeof content === 'string' || typeof content === 'number') {
        return <p className=" text-gray-600">{content}</p>;
    } else if (Array.isArray(content)) {
        return content.map((item, index) => (
            <p key={index} className=" text-gray-600 ml-3">
                {item}
            </p>
        ));
    } else if (typeof content === 'object') {
        return (
            <div className="ml-3">
                {content && Object.entries(content).map(([key, value]) => (
                    <div className="flex flex-row flex-wrap gap-2" key={key}>
                        <p className=" font-semibold">{key}: </p>
                        <p>{renderContent(value)}</p>
                    </div>
                ))}
            </div>
        );
    } else {
        return null; // Handle unknown types safely
    }
}


// Renderer for Single-Point rubrics
function renderSinglePointCriteria(rubric: SinglePointRubric) {
    return (
        <div>
            <div className="mb-4">
                <p className=" font-semibold">Proficient</p>
                <p className=" text-gray-600">{typeof rubric.criteria.Proficient === 'string' ? rubric.criteria.Proficient : ''}</p>
            </div>
            <div className="ml-4">
                <p className=" font-semibold">Strengths</p>
                <p className=" text-gray-600">{rubric.feedback?.Strengths || "No feedback provided"}</p>
            </div>
            <div className="ml-4">
                <p className=" font-semibold">Areas for Improvement</p>
                <p className=" text-gray-600">{rubric.feedback?.["Areas for Improvement"] || "No feedback provided"}</p>
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
                    <p className=" font-semibold">{requirement}</p>
                    <p className=" text-gray-600">{response}</p>
                </div>
            ))}
        </div>
    );
}
