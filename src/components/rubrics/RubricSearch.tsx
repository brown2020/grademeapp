"use client"

import { useState, useEffect, useRef } from 'react';
import { RubricState } from '@/types/rubrics-types';
import { useRubricStore } from '@/zustand/useRubricStore';
import CustomDropdown from '@/components/ui/CustomDropdown';

export default function RubricSearch({
    openRubricBuilder,
}: {
    openRubricBuilder?: () => void;
}) {
    const { gradingData, rubricOptions, selectedRubric, setSelectedRubric, filteredRubrics, setFilteredRubrics } = useRubricStore();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const previousSelectedRubric = useRef<RubricState | null>(null); // Track previous selectedRubric

    // Dynamically filter rubrics based on "gradingData" and "searchQuery"
    useEffect(() => {

        let filtered = rubricOptions;

        if (gradingData.identityLevel !== '') {
            filtered = filtered.filter((rubric) => rubric.name.toLowerCase().includes(gradingData.identityLevel.toLowerCase()));
        }

        if (gradingData.textType !== '') {
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

    }, [gradingData, rubricOptions, searchQuery, setFilteredRubrics]);

    useEffect(() => {
        // Open dropdown when filtered rubrics change and selectedRubric has NOT changed
        setIsOpen(true);
    }, [gradingData.identityLevel, gradingData.textType]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Handle selecting a rubric
    const handleRubricSelect = (rubric: RubricState) => {
        previousSelectedRubric.current = selectedRubric;
        setSelectedRubric(rubric);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Input Field */}
            <div className="relative">
                <input
                    className="w-full border px-2 py-1 rounded shadow-sm bg-orange-100 focus:border-blue-500 focus:ring-blue-500 truncate"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    value={searchQuery}
                    placeholder="Search for a rubric..."
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {/* Custom Dropdown Component */}
            {isOpen && (
                <CustomDropdown
                    filteredRubrics={filteredRubrics}
                    handleRubricSelect={handleRubricSelect}
                    openRubricBuilder={openRubricBuilder}
                    handleClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
