import { useState, useEffect } from 'react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { RubricState } from '@/types/rubrics-types';
import { rubrics } from '@/constants/rubrics_new';
import { flattenRubrics } from '@/utils/flattenRubrics';

export default function RubricSearch({
    onRubricSelect,
}: {
    onRubricSelect: (rubric: RubricState) => void;
}) {
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for the search query
    const [filteredRubrics, setFilteredRubrics] = useState<RubricState[]>([]); // Filtered rubrics based on search
    const [selectedRubric, setSelectedRubric] = useState<RubricState>(); // Track the selected rubric
    const [rubricOptions, setRubricOptions] = useState<RubricState[]>([]);

    // Flatten the rubrics structure when the component mounts
    useEffect(() => {
        const flattenedRubrics = flattenRubrics(rubrics); // Call the recursive function
        setRubricOptions(flattenedRubrics); // Set the flat rubric array to state
        setFilteredRubrics(flattenedRubrics); // Ensure all rubrics are shown initially
    }, []);

    // Effect to filter rubrics based on search query
    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = rubricOptions.filter((rubric) =>
                rubric.name.toLowerCase().includes(lowerCaseQuery) ||
                rubric.description?.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredRubrics(filtered);
        } else {
            setFilteredRubrics(rubricOptions); // Show all rubrics if no query
        }
    }, [searchQuery, rubricOptions]);

    // Handle selecting a rubric
    const handleRubricSelect = (rubric: RubricState) => {
        setSelectedRubric(rubric);
        if (rubric) {
            onRubricSelect(rubric); // Pass selected rubric to parent component
        }
    };

    return (
        <div className="relative w-full">
            <Combobox immediate value={selectedRubric} onChange={handleRubricSelect} onClose={() => setSearchQuery('')}>
                {/* Input Field */}
                <div className="relative">
                    <ComboboxInput
                        as="input"
                        className="w-full border px-2 py-1 rounded shadow-sm bg-orange-100 focus:border-blue-500 focus:ring-blue-500"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        displayValue={(rubric: RubricState) => rubric?.name || ''}
                        placeholder="Search for a rubric..."
                    />

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
