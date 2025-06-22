// process.env.REACT_APP_TWITCH_CLIENT_ID
// process.env.REACT_APP_TWITCH_SECRET_KEY
import './helper-css/TwitchButton.css';
import React from 'react';
import { getTwitchUser, getSubscriberCount, getAverageViews } from './twitchUserInfo';
const CLIENT_ID=process.env.REACT_APP_TWITCH_CLIENT_ID;
const REDIRECT_URI='http://localhost:3000/twitch/callback';
const SCOPES=['user:read:email', 'user:read:follows', 'channel:read:subscriptions'];

function openTwitchPopup(clientId, redirectUri, scopelist){
    const scope = scopelist.join(' ');
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;
  
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
    authUrl,
    'TwitchLogin',
    `width=${width},height=${height},top=${top},left=${left}`
  );
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval);
          reject(new Error('Popup closed by user'));
        }
        const popupUrl = popup.location.href;
        if (popupUrl.indexOf(redirectUri) !== -1) {
          const params = new URL(popupUrl).searchParams;
          const code = params.get('code');
          popup.close();
          clearInterval(interval);
          resolve(code);
        }
      } catch (e) {
        // Ignore cross-origin errors until redirected to your domain
      }
    }, 500);
  });
}

export default function TwitchLoginButton() {
    const handleLogin = async () => {
        try{
            const code = await openTwitchPopup(CLIENT_ID, REDIRECT_URI, SCOPES);
            console.log("Got code:", code);
            // TODO: Send this code to your backend to exchange for access token
            const res = await fetch("http://127.0.0.1:8000/twitch/exchange-code",{
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({code}),


            });
            const tokenData=await res.json();
            console.log("Token Data", tokenData);
            // Fetching user Twitch JSON with token
            const userInfo = await getTwitchUser(tokenData.access_token, CLIENT_ID);
            console.log("Twitch user JSON:", userInfo);

            const broadcasterId = userInfo.id;
            console.log(broadcasterId);

            const SubscriberCount = await getSubscriberCount(userInfo.id, tokenData.access_token, CLIENT_ID);
            console.log('Subscriber count:', SubscriberCount);

            const userAvgViews = await getAverageViews(broadcasterId, tokenData.access_token, CLIENT_ID, 20 );
            console.log('Average Viewership count:', userAvgViews); 
            // Todo: Save tokens to user session session or db

        } catch(err){
            console.error("Login failed:", err);

        }
    };
    return <button onClick={handleLogin} className="twitch-button">Link To Twitch</button>;
}
