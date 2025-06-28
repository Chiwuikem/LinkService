// src/components/UserRows.js
import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import s3, { S3_BUCKET, REGION } from '../helper/aws-config';
import VideoCard from './VideoCard';
import './styles/userrow.css';

const VIDEO_EXTENSIONS = /\.(mp4|mov|webm)$/i;
const MAX_VIDEOS       = 10;

export default function UserRows() {
  const auth = useAuth();
  const [videos, setVideos] = useState([]);  // { url, sub, username }
  const [error,  setError]  = useState(null);

  useEffect(() => {
    // 1) list & filter
    s3.listObjectsV2({ Bucket: S3_BUCKET }, (err, data) => {
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

      // 2) shuffle *once* and slice
      const shuffled = keys.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, MAX_VIDEOS);


      // 3) build the array
      const arr = selected.map(key => ({
        url:  `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`,
        sub:  key.split('/')[0],
        username: null
      }));

      setVideos(arr);
    });
  // IMPORTANT: empty deps means “run once on mount”
  }, []);

  // 4) lookup usernames
  useEffect(() => {
    videos.forEach((vid, i) => {
      if (vid.username !== null) return;
      fetch(`http://localhost:8000/user/${vid.sub}`)
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(data => {
          setVideos(vs => {
            const copy = [...vs];
            copy[i].username = data.username;
            return copy;
          });
        })
        .catch(() => {
          setVideos(vs => {
            const copy = [...vs];
            copy[i].username = vid.sub;
            return copy;
          });
        });
    });
  }, [videos]);

  if (error)         return <div className="Border">{error}</div>;
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
