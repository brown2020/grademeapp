import { useState } from 'react';
import { RubricState, AnalyticalRubricCriteria, HolisticRubricCriteria, RubricType, AnalyticalRubric, HolisticRubric } from '@/types/rubrics';
import { ChevronDownIcon } from 'lucide-react';

export default function CollapsiblePanel({ rubric }: { rubric: RubricState }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row gap-x-3 items-center w-full text-left font-medium text-gray-700 p-2 rounded bg-orange-400 hover:brightness-125">
                <ChevronDownIcon size={16} className={`transform ${isOpen ? 'rotate-180' : ''}`} />
                <p>Criteria</p>
            </div>
            {isOpen && (
                <div className="mt-2 p-2 border-l-2 border-gray-300 max-h-60 overflow-auto">
                    {/* Check rubric type to render appropriate criteria */}
                    {rubric.type === RubricType.Holistic
                        ? renderOverallCriteria((rubric as HolisticRubric).criteria)
                        : renderDetailedCriteria((rubric as AnalyticalRubric).criteria)
                    }
                </div>
            )}
        </div>
    );
}

function renderOverallCriteria(criteria: HolisticRubricCriteria) {
    return (
        <div>
            {Object.entries(criteria).map(([level, description]) => (
                <div key={level} className="mb-2">
                    <p className="text-sm font-semibold">{level}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            ))}
        </div>
    );
}

function renderDetailedCriteria(criteria: AnalyticalRubricCriteria) {
    return (
        <div>
            {Object.entries(criteria).map(([criterion, levels]) => (
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
