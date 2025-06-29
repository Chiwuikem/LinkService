// src/components/UserRows.js
import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import s3, { S3_BUCKET, REGION } from '../helper/aws-config';
import VideoCard from './VideoCard';
import './styles/userrow.css';

const VIDEO_EXTENSIONS = /\.(mp4|mov|webm)$/i;
const MAX_VIDEOS = 10;

export default function UserRows() {
  const auth = useAuth();
  const [videos, setVideos] = useState([]); // { url, sub, username }
  const [error, setError] = useState(null);

  // Validate if a video URL is accessible
  const validateVideo = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  };

  // Get a list of valid video objects
  const fetchValidVideos = async (keys) => {
    const validVideos = [];
    for (const key of keys) {
      const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      const isValid = await validateVideo(url);
      if (isValid) {
        validVideos.push({ url, sub: key.split('/')[0], username: null });
      }
      if (validVideos.length === MAX_VIDEOS) break;
    }
    return validVideos;
  };

  // Fetch and validate videos on mount
  useEffect(() => {
    const fetchVideos = () => {
      s3.listObjectsV2({ Bucket: S3_BUCKET }, async (err, data) => {
        if (err) {
          console.error('S3 list error:', err);
          setError('Could not load content');
          return;
        }

        let keys = data.Contents
          .map(o => o.Key)
          .filter(k => VIDEO_EXTENSIONS.test(k));

        if (auth.isAuthenticated) {
          const mine = auth.user.profile.sub + '/';
          keys = keys.filter(k => !k.startsWith(mine));
        }

        if (!keys.length) {
          setError('No videos available');
          return;
        }

        const shuffled = keys.sort(() => 0.5 - Math.random());
        const validVideos = await fetchValidVideos(shuffled);

        if (!validVideos.length) {
          setError('No valid videos found');
          return;
        }

        setVideos(validVideos);
      });
    };

    fetchVideos();
  }, [auth.isAuthenticated]);

  // Batch fetch uploader usernames efficiently
  useEffect(() => {
    const fetchUsernames = async () => {
      const updatedVideos = await Promise.all(
        videos.map(async (vid) => {
          try {
            const res = await fetch(`http://localhost:8000/user/${vid.sub}`);
            if (!res.ok) throw new Error('User not found');
            const data = await res.json();
            return { ...vid, username: data.username };
          } catch {
            return { ...vid, username: vid.sub };
          }
        })
      );
      setVideos(updatedVideos);
    };

    if (videos.length && videos.some(v => v.username === null)) {
      fetchUsernames();
    }
  }, [videos]);

  if (error) return <div className="Border">{error}</div>;
  if (!videos.length) return <div className="Border">Loading…</div>;

  return (
    <div className="user-row-strip">
      {videos.map(vid => (
        <VideoCard
          key={vid.url}
          url={vid.url}
          username={vid.username}
        />
      ))}
    </div>
  );
}
