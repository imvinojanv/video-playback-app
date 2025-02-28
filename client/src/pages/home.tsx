import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video-player';
import { CommentsPanel } from '@/components/comments-panel';
import { VideoState, Comment } from '@/lib/types';
import { isValidVideoUrl } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState('');
  const [videoState, setVideoState] = useState<VideoState>({
    url: null,
    duration: 0,
    currentTime: 0,
    comments: []
  });

  const handleLoadVideo = () => {
    if (!isValidVideoUrl(urlInput)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid video URL (.mp4, .webm, or .ogg)"
      });
      return;
    }

    setVideoState(prev => ({
      ...prev,
      url: urlInput,
      comments: []
    }));
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: nanoid(),
      timestamp: videoState.currentTime,
      text,
      createdAt: new Date()
    };

    setVideoState(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
  };

  const handleCommentClick = (timestamp: number) => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.currentTime = timestamp;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
            className="flex-1"
          />
          <Button onClick={handleLoadVideo}>Load Video</Button>
        </div>

        {videoState.url && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
            <div className="bg-card rounded-lg overflow-hidden">
              <VideoPlayer
                url={videoState.url}
                onTimeUpdate={(time) => setVideoState(prev => ({ ...prev, currentTime: time }))}
                onDurationChange={(duration) => setVideoState(prev => ({ ...prev, duration }))}
              />
            </div>
            <div className="bg-card rounded-lg overflow-hidden">
              <CommentsPanel
                comments={videoState.comments}
                currentTime={videoState.currentTime}
                onAddComment={handleAddComment}
                onCommentClick={handleCommentClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
