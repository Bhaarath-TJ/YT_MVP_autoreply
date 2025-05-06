import React, { useState, useRef, useEffect } from 'react';
import VideoInput from '../../components/VideoInput';
import CommentList from '../../components/CommentList';
import { Comment, CommentSortOrder, ReplySettings } from '../../types';
import { fetchComments, fetchVideoDetails } from '../../services/youtubeService';
import { extractVideoId } from '../../utils/extractVideoId';
import { Youtube, RefreshCw } from 'lucide-react';
import ReplyControlPanel from '../../components/ReplyControlPanel';
import CustomInstructionsInput from '../../components/CustomInstructionsInput';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const ReplyYoutubePage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const videoContextRef = useRef<{ title: string; description: string } | null>(null);
  const previousVideoIdRef = useRef<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortOrder, setSortOrder] = useState<CommentSortOrder>('relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const location = useLocation();

  const [replySettings, setReplySettings] = useState<ReplySettings>(() => ({
    tone: 'professional',
    length: 'medium',
    useEmojis: true,
    customInstructions: ''
  }));

  // Reset video context when URL changes
  useEffect(() => {
    videoContextRef.current = null;
    setReplySettings(prev => ({ ...prev, customInstructions: '' }));
  }, [videoUrl, location.pathname]);

  // Reset custom instructions when video ID changes
  useEffect(() => {
    const currentVideoId = extractVideoId(videoUrl);
    if (currentVideoId !== previousVideoIdRef.current) {
      setReplySettings(prev => ({ ...prev, customInstructions: '' }));
      previousVideoIdRef.current = currentVideoId;
    }
  }, [videoUrl]);

  const handleFetchComments = async (url: string, commentCount: number) => {
    setIsLoading(true);
    setComments([]);
    setVideoDetails(null);
    
    const videoId = extractVideoId(url);
    console.log("Extracted videoId:", videoId);
    
    if (!videoId) {
      toast.error('Invalid YouTube URL. Please check the format and try again.');
      setIsLoading(false);
      return;
    }

    try {
      // First fetch video details
      const details = await fetchVideoDetails(videoId).catch(error => {
        console.error('Failed to fetch video details:', error);
        throw new Error('Could not fetch video details. Please check the URL.');
      });

      videoContextRef.current = {
        title: details.title,
        description: details.description || ''
      };

      // Then fetch comments
      const { comments: fetchedComments } = await fetchComments(url, commentCount, sortOrder);
      console.log('Comments API Response:', fetchedComments);


      if (!Array.isArray(fetchedComments)) {
        throw new Error('Invalid response format from comments API');
      }

      if (fetchedComments.length === 0) {
        toast.info('This video has no top-level comments.');
      } else {
        setComments(fetchedComments);
        setVideoDetails(details);
      }
    } catch (err) {
      toast.error('Failed to fetch comments. Please check the video URL or try another video.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortOrderChange = async (newSortOrder: CommentSortOrder) => {
    if (sortOrder === newSortOrder || !videoUrl) return;
    
    setSortOrder(newSortOrder);
    setIsLoading(true);
    
    try {
      const { comments: sortedComments } = await fetchComments(videoUrl, comments.length, newSortOrder);
      setComments(sortedComments);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sort comments. Please try again.');
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-full mb-4">
            <Youtube className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            YouTube Reply Assistant
          </h1>
          <p className="mt-2 text-gray-600">
            Generate thoughtful replies to your YouTube comments using AI
          </p>
        </div>

        <div className="space-y-6">
          <VideoInput 
            videoUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            onFetch={handleFetchComments}
            isLoading={isLoading}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ReplyControlPanel
              settings={replySettings}
              onSettingsChange={setReplySettings}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <CustomInstructionsInput
              onInstructionsChange={(instructions) => 
                setReplySettings(prev => ({ ...prev, customInstructions: instructions }))
              }
              value={replySettings.customInstructions}
            />
          </div>

          {comments.length > 0 && videoDetails && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <CommentList 
                comments={comments} 
                isLoading={isLoading}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
                videoTitle={videoDetails.title}
                videoDescription={videoDetails.description}
                replySettings={replySettings}
                videoContext={videoContextRef.current}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ReplyYoutubePage;