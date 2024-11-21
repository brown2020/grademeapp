// components/rubrics/DeleteConfirmationModal.tsx
import React, { useState } from 'react';
import { useRubricStore } from '@/zustand/useRubricStore';

const DeleteConfirmationModal: React.FC = () => {
  const { showDeleteModal, setShowDeleteModal, rubricToDelete, deleteCustomRubric } = useRubricStore();
  const [confirmText, setConfirmText] = useState('');

  const handleConfirmDelete = () => {
    if (confirmText === 'Delete my rubric' && rubricToDelete) {
      deleteCustomRubric(rubricToDelete);
      setShowDeleteModal(false);
      setConfirmText('');
    }
  };

  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this rubric? This action cannot be undone.</p>
        <p className="mb-2">Type &quot;Delete my rubric&quot; to confirm:</p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Delete my rubric"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={confirmText !== 'Delete my rubric'}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;