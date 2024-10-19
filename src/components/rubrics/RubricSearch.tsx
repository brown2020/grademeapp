"use client"

import { useState, useEffect, useRef } from 'react';
import { RubricState } from '@/types/rubrics-types';
import { useRubricStore } from '@/zustand/useRubricStore';
import useProfileStore from '@/zustand/useProfileStore';

export default function RubricSearch({
    openRubricBuilder,
    useCustomRubrics,
}: {
    openRubricBuilder?: () => void;
    useCustomRubrics: boolean;
}) {
    const { gradingData, rubricOptions, selectedRubric, setSelectedRubric, filteredRubrics, setFilteredRubrics } = useRubricStore();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const previousSelectedRubric = useRef<RubricState | null>(null); // Track previous selectedRubric
    const profile = useProfileStore((state) => state.profile);

    // Dynamically filter rubrics based on "gradingData" and "searchQuery"
    useEffect(() => {

        let filtered = rubricOptions;

        if (profile.identityLevel !== '' && !useCustomRubrics) {
            filtered = filtered.filter((rubric) => rubric.name.toLowerCase().includes((profile.identityLevel ?? '').toLowerCase()));
        }

        if (gradingData.textType !== '' && !useCustomRubrics) {
            filtered = filtered.filter((rubric) => rubric.name.toLowerCase().includes(gradingData.prose.toLowerCase()));
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = rubricOptions.filter((rubric) =>
                rubric.name.toLowerCase().includes(lowerCaseQuery) ||
                rubric.description?.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredRubrics(filtered);
        } else {
            setFilteredRubrics(rubricOptions); // Show all rubrics if no query
        }

        setFilteredRubrics(filtered);

    }, [gradingData, rubricOptions, searchQuery, setFilteredRubrics, useCustomRubrics]);

    // Handle selecting a rubric
    const handleRubricSelect = (rubric: RubricState) => {
        previousSelectedRubric.current = selectedRubric;
        setSelectedRubric(rubric);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Input Field */}
            <div className="relative">
                <input
                    className="w-full border-b px-2 py-1 rounded-t-lg bg-secondary truncate"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    value={searchQuery}
                    placeholder="Search for a rubric..."
                />
            </div>
            {/* Seach Results Display */}
            <div ref={wrapperRef} className="w-full bg-secondary rounded-b-lg h-60 overflow-y-auto">
                <div
                    className="cursor-pointer font-medium select-none px-4 pt-1 text-blue-600 hover:underline"
                    onClick={openRubricBuilder} // Open the custom rubric builder
                >
                    Create Custom Rubric
                </div>
                {filteredRubrics.length > 0 ? (
                    filteredRubrics.map((rubric) => (
                        <div
                            key={rubric.name}
                            onClick={() => handleRubricSelect(rubric)}
                            className="cursor-pointer select-none px-4 pb-2 hover:ring-2 focus:ring-2 ring-accent ring-inset "
                        >
                            <span className="block text-sm font-semibold">{rubric.name}</span>
                            <span className="block text-xs text-gray-800">{rubric.description}</span>
                        </div>
                    ))
                ) : (
                    <div className="cursor-default select-none px-4 text-gray-700">
                        No matching rubrics
                    </div>
                )}
            </div>
        </div>
    );
}
