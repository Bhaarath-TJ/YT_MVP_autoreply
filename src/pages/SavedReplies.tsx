import React, { useEffect, useState } from 'react';
import { getSavedReplies, deleteSavedReply } from '../services/savedRepliesService';
import { SavedReply } from '../types';
import SavedReplyCard from '../components/SavedReplyCard';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SavedReplies: React.FC = () => {
  const [replies, setReplies] = useState<SavedReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedReplies();
  }, []);

  const loadSavedReplies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedReplies = await getSavedReplies();
      setReplies(savedReplies);
    } catch (err) {
      setError('Failed to load saved replies');
      toast.error('Failed to load saved replies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedReply(id);
      setReplies(replies.filter(reply => reply.id !== id));
    } catch (err) {
      toast.error('Failed to delete reply');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Replies</h1>
      
      {replies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No saved replies yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Your favorite replies will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <SavedReplyCard
              key={reply.id}
              reply={reply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedReplies;