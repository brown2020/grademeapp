"use client"

import { useState, useEffect, useRef } from 'react';
import { RubricState } from '@/types/rubrics-types';
import { useRubricStore } from '@/zustand/useRubricStore';
import useProfileStore from '@/zustand/useProfileStore';
import { toast } from 'react-hot-toast';
import { Star, Edit3Icon, DeleteIcon } from 'lucide-react';

export default function RubricSearch() {
  const {
    gradingData,
    rubricOptions,
    selectedRubric,
    setSelectedRubric,
    filteredRubrics,
    useCustomRubrics,
    customRubricsLoaded,
    setEditingRubricId,
    setShowRubricBuilder,
    setShowDeleteModal,
    setRubricToDelete,
    sortAndGroupRubrics,
  } = useRubricStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousSelectedRubric = useRef<RubricState | null>(null);
  const profile = useProfileStore((state) => state.profile);
  const addFavoriteRubric = useProfileStore((state) => state.addFavoriteRubric);
  const removeFavoriteRubric = useProfileStore((state) => state.removeFavoriteRubric);

  useEffect(() => {
    sortAndGroupRubrics(searchQuery, gradingData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, rubricOptions, gradingData.textType, profile.identity, profile.identityLevel, profile.favoriteRubrics]);


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

  const openRubricBuilder = (rubricId?: string) => {
    console.log("openRubricBuilder", rubricId);
    setEditingRubricId(rubricId || undefined);
    setShowRubricBuilder(true);
  };

  const handleDelete = (rubric: RubricState) => {
    setRubricToDelete(rubric);
    setShowDeleteModal(true);
  }



  return (
    <div ref={wrapperRef} className="relative w-full border border-secondary-30 rounded-lg">
      {/* Input Field */}
      <div className="relative w-full">
        <input
          className="input-secondary rubric-search"
          onChange={(event) => setSearchQuery(event.target.value)}
          value={searchQuery}
          placeholder="Search for a rubric..."
        />
      </div>
      {/* Search Results Display */}
      <div ref={wrapperRef} className="w-full bg-secondary-97 rounded-b-lg h-[33vh] overflow-y-auto rubric-search-select">
        <div
          className="cursor-pointer font-medium select-none px-4 py-2 mb-1 text-primary-30 underline underline-offset-2 hover:text-primary-40-foreground"
          onClick={() => openRubricBuilder && openRubricBuilder()} // Open the custom rubric builder
        >
          Create Custom Rubric
        </div>
        {filteredRubrics.length > 0 ? (
          filteredRubrics.map((rubric) => {
            const isFavorite = profile.favoriteRubrics.includes(rubric.id);
            return (
              <div key={rubric.id} className='flex flex-row justify-between items-center gap-x-2 px-2 border-b border-dashed border-primary-20 '>
                <div className='flex flex-row gap-x-2'>
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
                {useCustomRubrics && customRubricsLoaded &&
                  <div className='flex gap-x-4'>
                    <Edit3Icon onClick={() => openRubricBuilder && openRubricBuilder(rubric.id)} className={`text-secondary-30 cursor-pointer`} />
                    <DeleteIcon onClick={() => handleDelete(rubric)} className={`text-red-600 cursor-pointer`} />
                  </div>
                }
              </div>
            );
          })
        ) : (
          <div className="cursor-default select-none px-4 text-gray-700">
            No matching rubrics
          </div>
        )}
      </div>

    </div >
  );
}
