import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { SavedReply } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SavedReplyCardProps {
  reply: SavedReply;
  onDelete: (id: string) => Promise<void>;
}

const SavedReplyCard: React.FC<SavedReplyCardProps> = ({ reply, onDelete }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isDevMode } = useAuth();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reply.reply_text);
      setIsCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleDelete = async () => {
    if (!user && !isDevMode) {
      toast.error('Please sign in to delete replies');
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(reply.id);
      toast.success('Reply deleted');
    } catch (error) {
      if (!isDevMode) {
        toast.error('Failed to delete reply');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-2">
        <div className="text-sm text-gray-500">
          Original Comment:
          <p className="mt-1 text-gray-700">{reply.original_comment}</p>
        </div>
        
        <div className="text-sm text-gray-500">
          Saved Reply:
          <p className="mt-1 text-gray-900 font-medium">{reply.reply_text}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{reply.platform}</span>
            <span>•</span>
            <span>{new Date(reply.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy reply"
            >
              {isCopied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
              title={!user && !isDevMode ? "Sign in to delete (disabled during dev)" : "Delete reply"}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedReplyCard;