import React, { useState } from 'react';  
import { useAuth } from "react-oidc-context";
import UploadImage from './helper/UploadImage';
import MapComponent from './helper/mapComponent';
import { FiUser, FiPlus } from 'react-icons/fi';
import './styles/home.css';

function Profile() {
  const auth = useAuth();
  const [bio, setBio] = useState("This is your bio. You can update it here.");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [profilePicUrl, setProfilePicUrl] = useState(
    auth.user?.profile.picture || ''
  );

  const handleBioChange = (e) => setBio(e.target.value);
  const toggleEditBio = () => setIsEditingBio(!isEditingBio);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicUrl(imageUrl);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header" style={{ height: '20vh' }}>
        <div className="profile-pic-container">
          {profilePicUrl ? (
            <img 
              src={profilePicUrl} 
              alt="Profile" 
              className="profile-pic"
            />
          ) : (
            <div className="default-profile-icon">
              <FiUser size={60} color="#888" />
            </div>
          )}

          <label className="upload-button">
            <FiPlus size={16} color="#fff" />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <h2>Welcome, {auth.user?.profile.email || "User"}</h2>

        {isEditingBio ? (
          <>
            <textarea 
              value={bio} 
              onChange={handleBioChange} 
              rows={4} 
              style={{ maxWidth: 400, width: '100%' }}
            />
            <button onClick={toggleEditBio} style={{ marginTop: 8 }}>Save</button>
          </>
        ) : (
          <>
            <p style={{ maxWidth: 400, whiteSpace: 'pre-wrap' }}>{bio}</p>
            <button onClick={toggleEditBio}>Edit Bio</button>
          </>
        )}
      </div>

      <hr style={{ width: '80%', margin: '30px auto' }} />

      <UploadImage />
      <MapComponent />
    </div>
  );
}

export default Profile;
