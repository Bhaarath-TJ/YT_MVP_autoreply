import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { getUserProfile, updateCustomInstructions } from '../services/userProfileService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface CustomInstructionsInputProps {
  onInstructionsChange: (instructions: string) => void;
  value: string;
}

const CustomInstructionsInput: React.FC<CustomInstructionsInputProps> = ({ 
  onInstructionsChange,
  value 
}) => {
  const { user, isDevMode } = useAuth();
  const [instructions, setInstructions] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Listen for reset events
  useEffect(() => {
    const handleReset = () => {
      setInstructions('');
      updateWordCount('');
      onInstructionsChange('');
    };

    window.addEventListener('resetCustomInstructions', handleReset);
    return () => window.removeEventListener('resetCustomInstructions', handleReset);
  }, [onInstructionsChange]);

  useEffect(() => {
    setInstructions(value);
    updateWordCount(value);
  }, [value]);

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInstructions(newText);
    updateWordCount(newText);
    onInstructionsChange(newText);
  };

  const handleSave = async () => {
    if (wordCount > 100) {
      toast.error('Custom instruction must be under 100 words');
      return;
    }

    if (!user && !isDevMode) {
      toast.error('Please sign in to save instructions');
      return;
    }

    try {
      setIsSaving(true);
      if (user) {
        await updateCustomInstructions(instructions);
        toast.success('Custom instructions saved');
      } else if (isDevMode) {
        toast.success('Instructions saved (dev mode)');
      }
      onInstructionsChange(instructions);
    } catch (error) {
      if (!isDevMode) {
        toast.error('Failed to save custom instructions');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-red-600">Custom Instructions</h2>
          <p className="text-sm text-gray-500 mt-1">
            {wordCount}/100 words
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || wordCount > 100}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400"
          title={!user && !isDevMode ? "Sign in to save instructions" : undefined}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Instructions</span>
            </>
          )}
        </button>
      </div>

      <textarea
        value={instructions}
        onChange={handleInstructionChange}
        placeholder="e.g. Reply like a Gen-Z creator. Use Gen-Z slangs and be friendly"
        className={`w-full h-16 p-3 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 overflow-y-auto placeholder:italic placeholder:text-gray-500 ${
          wordCount > 100 ? 'border-red-500' : 'border-gray-200'
        }`}
      />
      
      {wordCount > 100 && (
        <p className="mt-2 text-sm text-red-500">
          Please keep instructions under 100 words
        </p>
      )}

      {!user && !isDevMode && (
        <p className="mt-2 text-sm text-gray-500 italic">
          Sign in to save instructions (disabled during dev)
        </p>
      )}
      
      <p className="mt-2 text-sm text-gray-500">
        These instructions will be combined with the length, tone and emoji settings.
      </p>
    </div>
  );
};

export default CustomInstructionsInput;