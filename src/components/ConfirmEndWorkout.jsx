import React from 'react';

const ConfirmEndWorkout = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Terminer l'entraînement ?</h2>
        <p className="mb-4">Vous avez un entraînement en cours. Voulez-vous le terminer ?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Terminer l'entraînement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEndWorkout;