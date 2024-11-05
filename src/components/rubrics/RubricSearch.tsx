"use client"

import { useState, useEffect, useRef } from 'react';
import { RubricState } from '@/types/rubrics-types';
import { useRubricStore } from '@/zustand/useRubricStore';
import useProfileStore from '@/zustand/useProfileStore';
import { toast } from 'react-hot-toast';
import { Star } from 'lucide-react';

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
    const addFavoriteRubric = useProfileStore((state) => state.addFavoriteRubric);
    const removeFavoriteRubric = useProfileStore((state) => state.removeFavoriteRubric);

    // Dynamically filter rubrics based on "gradingData" and "searchQuery"
    useEffect(() => {
        let filtered = rubricOptions;

        // // Apply initial filtering if needed
        // if (profile.identityLevel !== '' && !useCustomRubrics) {
        //     filtered = filtered.filter((rubric) =>
        //         rubric.name.toLowerCase().includes((profile.identityLevel ?? '').toLowerCase())
        //     );
        // }

        // if (gradingData.textType !== '' && !useCustomRubrics) {
        //     filtered = filtered.filter((rubric) =>
        //         rubric.name.toLowerCase().includes(gradingData.textType.toLowerCase())
        //     );
        // }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = rubricOptions.filter((rubric) =>
                rubric.name.toLowerCase().includes(lowerCaseQuery) ||
                rubric.description?.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Sort according to favorites, identityLevel, textType, and then everything else
        filtered = filtered.sort((a, b) => {
            const aIsFavorite = profile.favoriteRubrics.includes(a.id);
            const bIsFavorite = profile.favoriteRubrics.includes(b.id);

            // Priority 1: Favorites
            if (aIsFavorite !== bIsFavorite) return aIsFavorite ? -1 : 1;

            // Priority 2: identityLevel match
            const identityLevelMatchA = a.name.toLowerCase().includes((profile.identityLevel ?? '').toLowerCase());
            const identityLevelMatchB = b.name.toLowerCase().includes((profile.identityLevel ?? '').toLowerCase());
            if (identityLevelMatchA !== identityLevelMatchB) return identityLevelMatchA ? -1 : 1;

            // Priority 3: textType match
            const textTypeMatchA = a.name.toLowerCase().includes(gradingData.textType.toLowerCase());
            const textTypeMatchB = b.name.toLowerCase().includes(gradingData.textType.toLowerCase());
            if (textTypeMatchA !== textTypeMatchB) return textTypeMatchA ? -1 : 1;

            // If all else is equal, keep the current order
            return 0;
        });

        setFilteredRubrics(filtered);

    }, [
        gradingData,
        rubricOptions,
        searchQuery,
        setFilteredRubrics,
        useCustomRubrics,
        profile.identityLevel,
        profile.favoriteRubrics
    ]);


    // Handle selecting a rubric
    const handleRubricSelect = (rubric: RubricState) => {
        previousSelectedRubric.current = selectedRubric;
        setSelectedRubric(rubric);
        toast.success(`Selected: ${rubric.name}`, {
            icon: '🎉'
        });
    };

    // Handle adding/removing a rubric from favorites
    const handleRubricFavorite = async (rubric: RubricState) => {
        const isFavorite = profile.favoriteRubrics.includes(rubric.id);

        try {
            if (isFavorite) {
                await removeFavoriteRubric(rubric.id);
                toast.success("Removed from favorites");
            } else {
                await addFavoriteRubric(rubric.id);
                toast.success("Added to favorites");
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            toast.error("Error updating favorites");
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full border border-secondary-30 rounded-lg">
            {/* Input Field */}
            <div className="relative w-full">
                <input
                    className="input-secondary"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    value={searchQuery}
                    placeholder="Search for a rubric..."
                />
            </div>
            {/* Search Results Display */}
            <div ref={wrapperRef} className="w-full bg-secondary-97 rounded-b-lg h-[33vh] overflow-y-auto">
                <div
                    className="cursor-pointer font-medium select-none px-4 py-2 mb-1 text-primary-30 underline underline-offset-2 hover:text-primary-40-foreground"
                    onClick={openRubricBuilder} // Open the custom rubric builder
                >
                    Create Custom Rubric
                </div>
                {filteredRubrics.length > 0 ? (
                    filteredRubrics.map((rubric) => {
                        const isFavorite = profile.favoriteRubrics.includes(rubric.id);
                        return (
                            <div key={rubric.id} className='flex flex-row gap-x-2 px-2 border-b border-dashed border-primary-20 '>
                                <Star
                                    onClick={() => handleRubricFavorite(rubric)}
                                    size={20}
                                    strokeWidth={1}
                                    className={`flex-none cursor-pointer mt-1 ${isFavorite ? "fill-yellow-300" : "fill-none"}`}
                                />
                                <div
                                    key={rubric.name}
                                    onClick={() => handleRubricSelect(rubric)}
                                    className="cursor-pointer select-none pb-2 hover:text-primary-40 rounded-lg p-1"
                                >
                                    <span className="block text-sm font-semibold">{rubric.name}</span>
                                    <span className="block text-xs text-gray-800">{rubric.description}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="cursor-default select-none px-4 text-gray-700">
                        No matching rubrics
                    </div>
                )}
            </div>
        </div>
    );
}
