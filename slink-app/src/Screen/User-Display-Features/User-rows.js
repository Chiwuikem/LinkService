import React, {useState, useEffect, useRef} from 'react';
import {useAuth} from 'react-oidc-context';
import s3, {S3_BUCKET, REGION } from '../helper/aws-config';
import useLoopSegment from '../helper/useLoopSegment';
import "./styles/userrow.css";
const VIDEO_EXTENSIONS = /\.(mp4|mov|webm)$/i;

function UserRows(){
    const auth =useAuth();
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    const [uploaderSub, setUploaderSub] = useState(null);
    const [uploaderName, setUploaderName] = useState(null);

    useLoopSegment(videoRef, 3, videoUrl);

    //Will occur on every render
    useEffect(() => {
        const fetchVideoKey = () => {
            s3.listObjectsV2({Bucket: S3_BUCKET}, (err, data) => {
                if(err) {
                    console.error("Error fretching list of objects from S3:", err);
                    setError("Could not load content");
                    return;
                }

                //Filtering for only video files
                let keys = data.Contents.map(o => o.Key)
                    .filter(key => VIDEO_EXTENSIONS.test(key));

                //If user logged in, Filter out keys in User Folder
                if (auth.isAuthenticated) {
                    const mine = auth.user.profile.sub + '/';
                    keys = keys.filter(k => !k.startsWith(mine));
                }

                //If no keys
                if (!keys.length) {
                    setError("No content available");
                    return;
                }

                //Pick random key from list
                const randKey = keys[Math.floor(Math.random() * keys.length)];

                const url =`https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${randKey}`;
                const sub = randKey.split('/')[0];
                
                setUploaderSub(sub);
                setVideoUrl(url)
            });
        };
        fetchVideoKey();

    },[auth.isAuthenticated]);

    // 2) Look up the uploader’s username from your FastAPI backend
    useEffect(() => {
        if (!uploaderSub) return;

        fetch(`http://localhost:8000/user/${uploaderSub}`)
        .then(res => {
            if (!res.ok) throw new Error('User not found');
            return res.json();
        })
        .then(data => setUploaderName(data.username))
        .catch(err => {
            console.warn(err);
            setUploaderName(uploaderSub); // fallback to sub if lookup fails
        });
        }, [uploaderSub]);

    // Show error if any
    if (error) {
        return <div className="Border">{error}</div>;
    }

    // Show loading state until randomItem is set
    if (!videoUrl) {
        return <div className="Border">Loading…</div>;
    }
    return (
    <div>
        <div className="Border">
            <div className="video-wrapper">
                {/* Show the uploader’s name (or their UUID if lookup fails) */}
                <div className="uploader-label">
                    Uploaded by: {'@'+uploaderName || 'Unknown'}
                </div>
                <video 
                    ref={videoRef}
                    src={videoUrl} 
                    muted
                    autoPlay
                    playsInline
                    className="user-video"
                />

            </div>
            
        </div>
    </div>
    
    );

}

export default UserRows;