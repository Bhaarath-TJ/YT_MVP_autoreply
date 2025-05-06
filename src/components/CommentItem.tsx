import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Loader2, BookmarkPlus } from 'lucide-react';
import { Comment, ReplySettings } from '../types';
import { generateReplies } from '../services/replyService';
import { saveReply } from '../services/savedRepliesService';
import { getUserUsage, updateUserUsage } from '../services/userUsageService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import UsageLimitModal from './UsageLimitModal';

interface CommentItemProps {
  comment: Comment;
  replySettings: ReplySettings;
  videoContext: { title: string; description: string } | null;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  replySettings, 
  videoContext
}) => {
  const { user, isDevMode } = useAuth();
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleGenerateReplies = async () => {
    if (!user) {
      toast.error('Please sign in to generate replies');
      return;
    }

    try {
      const usage = await getUserUsage();
      const currentTotal = usage?.total_replies_generated || 0;
      
      if (currentTotal >= 100) {
        setShowLimitModal(true);
        return;
      }

      if (currentTotal + 3 > 100) {
        toast.error("You've used your 100 Free replies. Go Pro for Unlimited smart replies");
        return;
      }
    } catch (error) {
      console.error('Error checking usage:', error);
    }

    setIsGeneratingReplies(true);
    setError(null);
    setSuggestedReplies([]);
    
    try {
      const replies = await generateReplies(comment.text, replySettings, videoContext);
      if (!replies || replies.length === 0) {
        throw new Error('No replies generated');
      }
      
      // Update usage count
      await updateUserUsage(replies.length);
      
      setSuggestedReplies(replies);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate replies';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingReplies(false);
    }
  };

  const handleCopyReply = async (reply: string, index: number) => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopiedIndex(index);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy reply');
    }
  };

  const handleSaveReply = async (reply: string, index: number) => {
    if (!user && !isDevMode) {
      toast.error('Please sign in to save replies');
      return;
    }

    try {
      setSavingIndex(index);
      await saveReply({
        reply_text: reply,
        original_comment: comment.text,
        platform: 'YouTube'
      });
      toast.success('Reply saved!');
    } catch (error) {
      if (!isDevMode) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save reply';
        toast.error(errorMessage);
      }
    } finally {
      setSavingIndex(null);
    }
  };

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img 
            src={comment.authorProfileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorDisplayName)}&background=random`} 
            alt={comment.authorDisplayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{comment.authorDisplayName}</h3>
              <span className="text-xs text-gray-500">{comment.publishedAt}</span>
            </div>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{renderText(comment.text)}</p>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGenerateReplies}
                  disabled={isGeneratingReplies}
                  className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                >
                  {isGeneratingReplies ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Crafting replies...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      <span>Generate Replies</span>
                    </>
                  )}
                </button>
              </div>

              {isGeneratingReplies && (
                <p className="text-sm text-gray-600 italic">
                  Good things take a few seconds! Crafting thoughtful replies...
                </p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {suggestedReplies.length > 0 && !error && (
                <div className="space-y-2">
                  {suggestedReplies.map((reply, index) => (
                    <div key={index} className="flex items-start gap-2 bg-gray-50 p-3 rounded-md">
                      <p className="flex-1 text-sm text-gray-700">{reply}</p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveReply(reply, index)}
                          disabled={savingIndex === index}
                          className="shrink-0 p-1.5 text-gray-500 hover:text-purple-600 transition-colors"
                          title={!user && !isDevMode ? "Sign in to save (disabled during dev)" : "Save reply"}
                        >
                          {savingIndex === index ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <BookmarkPlus size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyReply(reply, index)}
                          className="shrink-0 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy reply"
                        >
                          {copiedIndex === index ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UsageLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
};

export default CommentItem;