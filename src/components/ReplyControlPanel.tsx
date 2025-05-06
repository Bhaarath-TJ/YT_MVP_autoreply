import React from 'react';
import { ReplySettings, Tone, ReplyLength } from '../types';
import { RotateCcw, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReplyControlPanelProps {
  settings: ReplySettings;
  onSettingsChange: (settings: ReplySettings) => void;
}

const defaultSettings: ReplySettings = {
  tone: 'professional',
  length: 'medium',
  useEmojis: true,
  customInstructions: ''
};

const ReplyControlPanel: React.FC<ReplyControlPanelProps> = ({ settings, onSettingsChange }) => {
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(true);

  const getLengthDescription = (length: ReplyLength): string => {
    switch (length) {
      case 'short':
        return 'One-line replies, quick and snappy';
      case 'medium':
        return 'Two sentences, thoughtful and easy to read';
      case 'long':
        return 'Three to five sentences, detailed and engaging';
    }
  };

  const getToneDescription = (tone: Tone): string => {
    switch (tone) {
      case 'casual':
        return 'Friendly and laid-back like chatting with a friend';
      case 'professional':
        return 'Polished and respectful, suited for serious topics';
      case 'humorous':
        return 'Playful and witty, adding light fun to replies';
      case 'engaging':
        return 'Encourages conversation and thoughtful responses';
    }
  };

  const handleChange = (field: keyof ReplySettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  const handleReset = () => {
    onSettingsChange(defaultSettings);
    toast.success('✅ Settings reset to default');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-red-600">Reply Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Customize how your replies will be generated</p>
        </div>
        <button
          onClick={() => setIsSettingsVisible(!isSettingsVisible)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Settings2 size={20} />
        </button>
      </div>

      {isSettingsVisible && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reply Length
              </label>
              <select
                value={settings.length}
                onChange={(e) => handleChange('length', e.target.value as ReplyLength)}
                className="w-full border border-gray-200 rounded-md shadow-sm px-3 py-2 bg-gray-50 focus:ring-red-500 focus:border-red-500"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {getLengthDescription(settings.length)}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reply Tone
              </label>
              <select
                value={settings.tone}
                onChange={(e) => handleChange('tone', e.target.value as Tone)}
                className="w-full border border-gray-200 rounded-md shadow-sm px-3 py-2 bg-gray-50 focus:ring-red-500 focus:border-red-500"
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="humorous">Humorous</option>
                <option value="engaging">Engaging</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {getToneDescription(settings.tone)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Include Emojis
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {settings.useEmojis ? "Add fitting emojis to make replies more expressive" : "Keep replies text-only for a clean look"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChange('useEmojis', !settings.useEmojis)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                settings.useEmojis ? 'bg-red-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.useEmojis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RotateCcw size={14} />
              Reset Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyControlPanel;