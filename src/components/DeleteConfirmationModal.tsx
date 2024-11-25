import React, { useState } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  itemName
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleConfirmDelete = () => {
    if (confirmationInput === confirmText) {
      onConfirm();
      setConfirmationInput('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-lg shadow-xl max-w-md w-full text-primary-10 bg-secondary-95 mx-4 px-4 py-2">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {itemName && (
          <h3 className="font-semibold text-lg text-center bg-primary-70 rounded-xl w-fit px-3 py-2 mb-2 place-self-center">&ldquo;{itemName}&rdquo;</h3>
        )}
        <p className="mb-4">
          {description}
        </p>

        <p className="mb-2">Type &quot;{confirmText}&quot; to confirm:</p>
        <input
          type="text"
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder={confirmText}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={confirmationInput !== confirmText}
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
