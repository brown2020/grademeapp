"use client"

import { useState, useEffect, useRef } from 'react';
import { RubricState } from '@/lib/types/rubrics-types';
import { useRubricStore } from '@/zustand/useRubricStore';
import useProfileStore from '@/zustand/useProfileStore';
import { toast } from 'react-hot-toast';
import { Star, Edit3Icon, DeleteIcon, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
    copyDefaultRubric,
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

  // console.log(filteredRubrics);

  const handleRubricSelect = (rubric: RubricState) => {
    previousSelectedRubric.current = selectedRubric;
    setSelectedRubric(rubric);
    toast.success(`Selected: ${rubric.name}`, {
      icon: '🎉'
    });
  };

  // Handle adding/removing a rubric from favorites
  const favoriteRubricIdSet = new Set(profile.favoriteRubrics);

  const handleRubricFavorite = async (rubric: RubricState) => {
    const isFavorite = favoriteRubricIdSet.has(rubric.id);

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
    setEditingRubricId(rubricId || undefined);
    setShowRubricBuilder(true);
  };

  const handleDelete = (rubric: RubricState) => {
    setRubricToDelete(rubric);
    setShowDeleteModal(true);
  }

  const handleCopyRubric = async (rubric: RubricState) => {
    try {
      await copyDefaultRubric(rubric);
      sortAndGroupRubrics(searchQuery, gradingData);
      toast.success(`Rubric "${rubric.name}" copied successfully!`);
    } catch (error) {
      console.error('Failed to copy rubric:', error);
      toast.error('Failed to copy rubric. Please try again.');
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full border border-secondary-30 rounded-lg">
      {/* Input Field */}
      <div className="relative w-full">
        <input aria-label="Input field"
          className="input-secondary rubric-search"
          onChange={(event) => setSearchQuery(event.target.value)}
          value={searchQuery}
          placeholder="Search for a rubric..."
        />
      </div>
      {/* Search Results Display */}
      <div ref={wrapperRef} className="w-full bg-secondary-97 rounded-b-lg h-[33vh] overflow-y-auto rubric-search-select">
        <button
          type="button"
          className="cursor-pointer font-medium select-none px-4 py-2 mb-1 text-primary-20 underline underline-offset-2 hover:text-primary-40-foreground bg-transparent border-0 text-left w-full"
          onClick={() => openRubricBuilder && openRubricBuilder()}
        >
          Create Custom Rubric
        </button>
        {filteredRubrics.length > 0 ? (
          filteredRubrics.map((rubric) => {
            const isFavorite = favoriteRubricIdSet.has(rubric.id);
            return (
              <div key={rubric.id} className='flex flex-row justify-between items-center gap-x-2 px-2 border-b border-dashed border-primary-20 '>
                <div className='flex flex-row gap-x-2'>
                  <button type="button" aria-label={isFavorite ? "Unfavorite rubric" : "Favorite rubric"} className="bg-transparent border-0 p-0 mt-1" onClick={() => handleRubricFavorite(rubric)}>
                    <Star
                      size={20}
                      strokeWidth={1}
                      className={`flex-none cursor-pointer ${isFavorite ? "fill-yellow-300" : "fill-none"}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRubricSelect(rubric)}
                    className="cursor-pointer select-none pb-2 hover:text-primary-40 rounded-lg p-1 bg-transparent border-0 text-left"
                  >
                    <span className="block text-sm font-semibold">{rubric.name}</span>
                    <span className="block text-xs text-gray-800">{rubric.description}</span>
                  </button>
                </div>
                {!useCustomRubrics &&
                  <Button
                    onClick={() => handleCopyRubric(rubric)}
                    className="cursor-pointer"
                  >
                    <Copy className="size-4" />
                  </Button>}
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
