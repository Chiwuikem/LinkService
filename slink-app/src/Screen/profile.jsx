import React from 'react';  
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import './styles/home.css'
import UploadImage from './helper/UploadImage';
import MapComponent from './helper/mapComponent';

function Profile() {
    const auth = useAuth();
    const navigate = useNavigate();
    //Sign out function that redirects to homepage
    const signOutRedirect = () => {
        const clientId = "71q5figl3q9uj21u59dc3fv41c";
        const logoutUri = "http://localhost:3000";
        const cognitoDomain = "https://us-east-2tvqj8gwnl.auth.us-east-2.amazoncognito.com";
        auth.removeUser();
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
      };
    
    return (
          <div>
            <div>
              <nav className="navbar">
                <button onClick={() => navigate("/") } className='signup'>Home</button>
                <button onClick={() => signOutRedirect()} className='signup'>Sign out</button>
                <button onClick={() => navigate("/settings")} className='signup'>Settings</button>
                <button onClick={() => navigate("/help")} className='signup'>Help</button>
              </nav>
            </div>
            {/* Display user profile information */}
            <pre> Hello: {auth.user?.profile.email} </pre>
            <pre> first Name: {auth.user?.profile.given_name} </pre>
            <pre> ID Token: {auth.user?.id_token} </pre>
            <pre> Access Token: {auth.user?.access_token} </pre>
            <pre> Refresh Token: {auth.user?.refresh_token} </pre>

            <UploadImage />
            <MapComponent />
            
          </div>

        );
      
}
export default Profile;