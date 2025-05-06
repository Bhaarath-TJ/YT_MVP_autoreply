import React from 'react';
import { Comment, CommentSortOrder, ReplySettings } from '../types';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  sortOrder: CommentSortOrder;
  onSortOrderChange: (sortOrder: CommentSortOrder) => void;
  replySettings: ReplySettings;
  videoContext: { title: string; description: string } | null;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  isLoading,
  sortOrder,
  onSortOrderChange,
  replySettings,
  videoContext
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Comments
          </h2>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value as CommentSortOrder)}
              className="border rounded-md px-2 py-1 text-sm bg-white"
              disabled={isLoading}
            >
              <option value="relevance">Top comments</option>
              <option value="time">Newest first</option>
            </select>
          </div>
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No comments to display</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              replySettings={replySettings}
              videoContext={videoContext}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;