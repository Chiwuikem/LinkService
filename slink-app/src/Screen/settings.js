import React from 'react';
import { useAuth } from "react-oidc-context";

function Settings() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "71q5figl3q9uj21u59dc3fv41c";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://us-east-2tvqj8gwnl.auth.us-east-2.amazoncognito.com";
    auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Settings</h2>
      <button onClick={signOutRedirect} className="signout">Sign Out</button>
      <button onClick = {() =>auth.signinRedirect()}>sign in</button>
    </div>
  );
}

export default Settings;
