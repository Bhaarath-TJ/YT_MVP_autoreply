import React, { useState } from 'react';
import { YoutubeIcon, Loader2Icon } from 'lucide-react';
import { extractVideoId, fetchVideoDetails, VideoDetails } from '../services/youtubeService';

interface VideoInputProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  onFetch: (url: string, commentCount: number) => void;
  isLoading: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ 
  videoUrl, 
  setVideoUrl, 
  onFetch,
  isLoading
}) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(100);

  const validateYoutubeUrl = (url: string): boolean => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setIsValidUrl(url === '' || validateYoutubeUrl(url));
    setVideoDetails(null);

    if (validateYoutubeUrl(url)) {
      const videoId = extractVideoId(url);
      if (videoId) {
        setIsPreviewLoading(true);
        try {
          const details = await fetchVideoDetails(videoId);
          setVideoDetails(details);
        } catch (error) {
          console.error('Error fetching video details:', error);
        } finally {
          setIsPreviewLoading(false);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateYoutubeUrl(videoUrl)) {
      onFetch(videoUrl, commentCount);
    } else {
      setIsValidUrl(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Paste your YouTube video link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <YoutubeIcon className="h-5 w-5 text-red-500" />
          </div>
          
          <input
            type="text"
            value={videoUrl}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full pl-10 pr-4 py-3 border ${
              isValidUrl ? 'border-gray-200 focus:border-red-500' : 'border-red-500'
            } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50`}
            disabled={isLoading}
          />
        </div>
        
        {!isValidUrl && (
          <p className="text-red-500 text-sm">Please enter a valid YouTube URL</p>
        )}

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Comments to fetch:</label>
          <div className="flex gap-2">
            {[50, 100, 200].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setCommentCount(count)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  commentCount === count
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {isPreviewLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2Icon className="h-6 w-6 animate-spin text-red-600" />
          </div>
        )}

        {videoDetails && !isPreviewLoading && (
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
            <img 
              src={videoDetails.thumbnailUrl} 
              alt="Video thumbnail" 
              className="w-32 h-auto rounded-md"
            />
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-2">{videoDetails.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Click "Fetch Comments" to analyze this video</p>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !videoUrl || !isValidUrl}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2
            ${isLoading || !videoUrl || !isValidUrl 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 transition-colors'
            }`}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="h-5 w-5 animate-spin" />
              <span>Fetching Comments...</span>
            </>
          ) : (
            <span>Fetch Comments</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoInput;