import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  url: string;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
}

export function VideoPlayer({ url, onTimeUpdate, onDurationChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      fluid: true,
      sources: [{
        src: url,
        type: 'video/mp4'
      }]
    });

    playerRef.current.on('timeupdate', () => {
      onTimeUpdate(playerRef.current.currentTime());
    });

    playerRef.current.on('loadedmetadata', () => {
      onDurationChange(playerRef.current.duration());
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [url]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
      />
    </div>
  );
}
