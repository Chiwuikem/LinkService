import React from 'react';
import { useAuth } from "react-oidc-context";
import './styles/settings.css';

function Settings() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "71q5figl3q9uj21u59dc3fv41c";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://us-east-2tvqj8gwnl.auth.us-east-2.amazoncognito.com";
    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if(!auth.isAuthenticated){
    return(
      <div className='settings-page'>
        <button onClick = {() =>auth.signinRedirect()} classname="sign-button">sign in</button>
      </div>
    )
  }

  return (
    <div className='settings-page'>
      <h2>Settings</h2>
      <button onClick={signOutRedirect} className="sign-button">Sign Out</button>
    </div>
  );
}

export default Settings;
