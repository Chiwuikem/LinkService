import AWS from 'aws-sdk';
import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context"; 
import './helper-css/upload-image.css'; 

function UploadImage() {
  const auth = useAuth();
  const { user } = auth;

  const [userSub, setUserSub] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [previewType, setPreviewType] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const S3_BUCKET = "slinkchiwuikem";
  const REGION = "us-east-2";

  useEffect(() => {
    if (user) {
      const sub = user.profile.sub;
      setUserSub(sub);
      const saved = localStorage.getItem(`userUploads_${sub}`);
      const savedProfile = localStorage.getItem(`profilePic_${sub}`);
      if (saved) setUploadedItems(JSON.parse(saved));
      if (savedProfile) setProfilePic(savedProfile);
    }
  }, [user]);

  const handleFileChange = e => {
    if (!auth.isAuthenticated) {
      alert("Please log in to upload files.");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setPreviewURL(URL.createObjectURL(file));
      setPreviewType(file.type);
    }
  };

  const uploadFile = async () => {
    if (!fileToUpload) {
      alert("Please select a file first.");
      return;
    }
    setIsUploading(true);

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({ region: REGION });
    const fileKey = `${userSub}/${Date.now()}_${fileToUpload.name}`;
    const params = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Body: fileToUpload,
      ContentType: fileToUpload.type,
    };

    try {
      await s3.upload(params).promise();
      const url = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;
      const newItem = { url, type: fileToUpload.type };
      const updated = [...uploadedItems, newItem];
      setUploadedItems(updated);
      localStorage.setItem(`userUploads_${userSub}`, JSON.stringify(updated));

      // If no profile pic yet, set the first uploaded image as profile
      if (!localStorage.getItem(`profilePic_${userSub}`) && fileToUpload.type.startsWith('image/')) {
        localStorage.setItem(`profilePic_${userSub}`, url);
        setProfilePic(url);
      }

      setFileToUpload(null);
      setPreviewURL(null);
      document.getElementById('file-upload').value = '';
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async index => {
    const { url } = uploadedItems[index];
    const fileKey = url.split(`amazonaws.com/`)[1];
    const s3 = new AWS.S3({ region: REGION });
    try {
      await s3.deleteObject({ Bucket: S3_BUCKET, Key: fileKey }).promise();
      const updated = uploadedItems.filter((_, i) => i !== index);
      setUploadedItems(updated);
      localStorage.setItem(`userUploads_${userSub}`, JSON.stringify(updated));

      if (profilePic === url) {
        localStorage.removeItem(`profilePic_${userSub}`);
        setProfilePic(null);
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Picture */}
      <div className="profile-pic-container">
        {profilePic && <img src={profilePic} alt="Profile" className="profile-picture" />}
      </div>

      {/* Upload Preview */}
      {previewURL && (
        <div className="preview-overlay">
          <button
            className="close-preview"
            onClick={() => {
              setPreviewURL(null);
              setFileToUpload(null);
              document.getElementById('file-upload').value = '';
            }}
          >
            &times;
          </button>

          {previewType.startsWith('video/') ? (
            <video src={previewURL} className="preview-video" controls autoPlay />
          ) : (
            <img src={previewURL} alt="Preview" className="preview-image" />
          )}

          <button
            onClick={uploadFile}
            disabled={isUploading}
            className="preview-upload-button"
          >
            {isUploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      )}

      {/* Uploaded Media Grid */}
      <div className="media-upload-grid">
        {uploadedItems.map(({ url, type }, idx) => (
          <div key={url} className="upload-container">
            {type.startsWith('video/') ? (
              <div className="video-wrapper">
                <video
                  src={url}
                  className="uploaded-video"
                  controls={false}
                  muted
                  playsInline
                  preload="metadata"
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.paused) {
                      video.play();
                      video.nextSibling.style.display = 'none';
                    } else {
                      video.pause();
                      video.nextSibling.style.display = 'flex';
                    }
                  }}
                />
                <div
                  className="play-button-overlay"
                  onClick={(e) => {
                    const video = e.currentTarget.previousSibling;
                    video.play();
                    e.currentTarget.style.display = 'none';
                  }}
                >
                  ▶
                </div>
              </div>
            ) : (
              <img src={url} alt="" className="uploaded-image" />
            )}
            <button onClick={() => deleteFile(idx)} className="delete-button">
              &times;
            </button>
          </div>
        ))}

        <div className="upload-container">
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="upload-label">
            <span className="plus-sign">+</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
