import React, {useEffect} from 'react';  
import { useAuth } from "react-oidc-context";
import {useNavigate} from 'react-router-dom';
import MapComponent from './helper/mapComponent';
import './styles/home.css';

function Home() {
      const auth = useAuth();
      const navigate = useNavigate();

    // Sign out function that redirects to homepage
      const signOutRedirect = () => {
        const clientId = "71q5figl3q9uj21u59dc3fv41c";
        const logoutUri = "http://localhost:3000";
        const cognitoDomain = "https://us-east-2tvqj8gwnl.auth.us-east-2.amazoncognito.com";
        auth.removeUser();
        sessionStorage.removeItem('hasRedirected');
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
      };
     
      //Automates redirection to profile page after sign in
      // This effect runs when the component mounts and when auth.isAuthenticated changes
      useEffect(() => {
        const hasRedirected= sessionStorage.getItem('hasRedirected');
          if(auth.isAuthenticated && !hasRedirected){
            sessionStorage.setItem('hasRedirected', 'true');
            navigate("/profile", { replace: true });
          }
        }, [auth.isAuthenticated, navigate]);

      
      if (auth.isLoading) {
          return <div>Loading...</div>;
        }
      
      if (auth.error) {
          return <div>Encountering error... {auth.error.message}</div>;
        }




    
      
    
      return (
        <div className='home-page'>
          <MapComponent />
          <div className="top-half-homepage">
            <div className="top-half-logo"> 
                <h1>Streamers University</h1>
            </div>
            <div className="content-placeholder">
              <img src="/SLinkGif.gif" alt="Content animation" className="gif-style" />
            </div>
          </div>
            
        </div>

      );
}
export default Home;





// if (auth.isAuthenticated) {
//         return <Navigate to="/profile" replace />;
        
//       }