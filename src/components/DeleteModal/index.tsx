import React from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onCancel, onDelete }) => {
  if (!isOpen) return null; // Hide modal if not open

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel(); // Close modal if clicked outside the modal (on the backdrop)
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]"
      onClick={handleBackdropClick}
    >
      <div className="bg-secondary p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold text-foreground mb-4">Are you sure?</h2>
        <p className="text-sm text-text mb-6">
          This action cannot be undone. Do you want to delete this item?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-accent text-text px-4 py-2 rounded hover:bg-popover transition hover:scale-[.99] active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-background px-4 py-2 rounded hover:bg-red-600 transition hover:scale-[.99] active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
