// src/helper/usePartialLoop.js
import { useEffect } from 'react';

export default function useLoopSegment(videoRef, loopSeconds = 3, active = true) {
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !active) return;

    const onTimeUpdate = () => {
      if (vid.currentTime >= loopSeconds) {
        vid.currentTime = 0;
        // only play if it’s paused
        if (vid.paused) vid.play().catch(() => {});
      }
    };

    // start it off
    vid.currentTime = 0;
    vid.play().catch(() => {});

    vid.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [videoRef, loopSeconds, active]);
}
