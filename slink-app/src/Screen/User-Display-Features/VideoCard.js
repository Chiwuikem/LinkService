// src/components/VideoCard.js
import React, { useRef } from 'react';
import useLoopSegment from '../helper/useLoopSegment';
import './styles/userrow.css';

export default function VideoCard({ url, username, loopSeconds=5 }) {
  const ref = useRef(null);
  // top‑level hook, always called
  useLoopSegment(ref, loopSeconds, true);

  return (
    <div className="Border">
      <div className="video-wrapper">
        <div className="uploader-label">
          Uploaded by: @{username || '…'}
        </div>
        <video
          ref={ref}
          src={url}
          muted
          autoPlay
          playsInline
        
          className="user-video"
        />
      </div>
    </div>
  );
}
