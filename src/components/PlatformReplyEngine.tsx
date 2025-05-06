import React from 'react';
import CommentList from './CommentList';
import ReplyControlPanel from './ReplyControlPanel';
import CustomInstructionsInput from './CustomInstructionsInput';
import { Comment, CommentSortOrder, ReplySettings } from '../types';

interface PlatformReplyEngineProps {
  platform: 'youtube' | 'blog' | 'reddit';
}

const platformColors = {
  youtube: {
    primary: 'from-red-600 to-red-500',
    secondary: 'bg-red-600',
    hover: 'hover:bg-red-700',
    border: 'focus:ring-red-500',
    text: 'text-red-600',
  },
  blog: {
    primary: 'from-blue-600 to-blue-500',
    secondary: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    border: 'focus:ring-blue-500',
    text: 'text-blue-600',
  },
  reddit: {
    primary: 'from-orange-600 to-amber-500',
    secondary: 'bg-orange-600',
    hover: 'hover:bg-orange-700',
    border: 'focus:ring-orange-500',
    text: 'text-orange-600',
  },
};

const PlatformReplyEngine: React.FC<PlatformReplyEngineProps> = ({ platform }) => {
  const colors = platformColors[platform];
  const [replySettings, setReplySettings] = React.useState<ReplySettings>(() => ({
    tone: 'professional',
    length: 'medium',
    useEmojis: true,
    customInstructions: ''
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`bg-gradient-to-r ${colors.primary} p-6 rounded-lg shadow-md mb-6`}>
        <h2 className="text-white text-xl font-semibold">Reply Settings</h2>
        <p className="text-white/80 mt-2">
          Customize how your replies will be generated
        </p>
      </div>

      <ReplyControlPanel
        settings={replySettings}
        onSettingsChange={setReplySettings}
      />

      <CustomInstructionsInput
        onInstructionsChange={(instructions) => 
          setReplySettings(prev => ({ ...prev, customInstructions: instructions }))
        }
        value={replySettings.customInstructions}
      />
    </div>
  );
};

export default PlatformReplyEngine;