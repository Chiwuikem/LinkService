import { useEffect } from 'react';

export default function useLoopSegment(videoRef, loopDuration = 3, videoUrl) {
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleCanPlay = () => {
      vid.currentTime = 0;
      vid.play().catch((err) => {
        console.warn("Play interrupted: ", err);
      });
    };

    const handleTimeUpdate = () => {
      if (vid.currentTime >= loopDuration) {
        vid.currentTime = 0;
      }
    };

    vid.addEventListener('canplay', handleCanPlay);
    vid.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      // Clean up old listeners
      vid.removeEventListener('canplay', handleCanPlay);
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      vid.pause(); // Ensure old video stops
    };
  }, [videoRef, loopDuration, videoUrl]);
}
