import React, { useState } from 'react';  
import { useAuth } from "react-oidc-context";
import UploadImage from './helper/UploadImage';
import MapComponent from './helper/mapComponent';
import ProfileHeader from './profile-header';
import { FiUser, FiPlus } from 'react-icons/fi';


function Profile() {
  const auth = useAuth();


  return (
    <div className="profile">
      
      <ProfileHeader/>
      <UploadImage />
      <MapComponent />
    </div>
  );
}

export default Profile;
