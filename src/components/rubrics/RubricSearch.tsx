"use client"

import { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { RubricState } from '@/types/rubrics-types';
import { useRubricStore } from '@/zustand/useRubricStore';

export default function RubricSearch() {
    const { gradingData, rubricOptions, selectedRubric, setSelectedRubric } = useRubricStore();
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for the search query
    const [filteredRubrics, setFilteredRubrics] = useState<RubricState[]>([]); // Filtered rubrics based on search

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
    }, [gradingData, rubricOptions, searchQuery]);

    // Handle selecting a rubric
    const handleRubricSelect = (rubric: RubricState) => {
        setSelectedRubric(rubric);
    };

    return (
        <div className="relative w-full">
            <Combobox immediate defaultValue={selectedRubric} onChange={handleRubricSelect} onClose={() => setSearchQuery('')}>
                {/* Input Field */}
                <div className="relative">
                    <div>
                        <ComboboxInput
                            as="input"
                            className="w-full border px-2 py-1 rounded shadow-sm bg-orange-100 focus:border-blue-500 focus:ring-blue-500 truncate"
                            onChange={(event) => setSearchQuery(event.target.value)}
                            value={searchQuery}
                            placeholder="Search for a rubric..."
                        />
                    </div>

                    {/* Dropdown List */}
                    <ComboboxOptions className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg max-h-60 overflow-y-auto empty:invisible">
                        {filteredRubrics.map((rubric) => (
                            <ComboboxOption
                                key={rubric.name}
                                value={rubric}
                                className={({ focus }) =>
                                    `cursor-pointer select-none px-4 py-2 ${focus ? 'bg-orange-400 text-white' : 'text-gray-900'}`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block font-semibold ${selected ? 'font-bold' : 'font-normal'}`}>
                                            {rubric.name}
                                        </span>
                                        <span className="block text-sm text-gray-600">{rubric.description}</span>
                                    </>
                                )}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </div>
            </Combobox>
        </div>
    );
}
