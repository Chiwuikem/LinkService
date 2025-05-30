import React from 'react';  
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';

function Profile() {
    const auth = useAuth();
    const navigate = useNavigate();
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
                <button onClick={() => navigate("/")} >Home</button>
                <button onClick={() => auth.signinRedirect()} className='signup'>Sign in</button>
                <button onClick={() => signOutRedirect()}>Sign out</button>
            </div>
            <pre> Hello: {auth.user?.profile.email} </pre>
            <pre> first Name: {auth.user?.profile.given_name} </pre>
            <pre> ID Token: {auth.user?.id_token} </pre>
            <pre> Access Token: {auth.user?.access_token} </pre>
            <pre> Refresh Token: {auth.user?.refresh_token} </pre>
          </div>

        );
      
}
export default Profile;