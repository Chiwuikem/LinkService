import React, { useState } from 'react';  
import { useAuth } from "react-oidc-context";
import UploadImage from './helper/UploadImage';
import MapComponent from './helper/mapComponent';
import ProfileHeader from './profile-header';
import TwitchLoginButton from './helper/twitchButton';
import { FiUser, FiPlus } from 'react-icons/fi';

import './styles/profile.css';


function Profile() {
  const auth = useAuth();


  return (
    <>
    {auth.isAuthenticated ? (
      <div className="profile">
        <ProfileHeader />
        <UploadImage />
        <MapComponent />
        <TwitchLoginButton />
      </div>
    ) : (
      <div className="not-logged-page">
        <h1>Please sign in</h1>
      </div>
    )}
  </>
);
}

export default Profile;
