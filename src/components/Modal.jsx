// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onSave, editedCategory, setEditedCategory, editedAmount, setEditedAmount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Expense</h3>
        <label htmlFor="editedCategory" className="block text-lg mb-2">Category</label>
        <input
          className="border border-black rounded-md h-12 px-5 mb-4 w-full"
          type="text"
          name="editedCategory"
          value={editedCategory}
          onChange={(e) => setEditedCategory(e.target.value)}
        />
        <label htmlFor="editedAmount" className="block text-lg mb-2">Amount</label>
        <input
          className="border border-black rounded-md h-12 px-5 mb-4 w-full"
          type="number"
          name="editedAmount"
          value={editedAmount}
          onChange={(e) => setEditedAmount(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded"
            onClick={onSave}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-600 text-white px-5 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
