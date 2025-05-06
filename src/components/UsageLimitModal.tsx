import React from 'react';
import { X } from 'lucide-react';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Free Usage Limit Reached</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You've reached your free usage limit of 100 generated replies.
          </p>
          <p className="text-gray-600">
            We're working on premium features that will allow unlimited replies.
            Stay tuned for updates!
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;