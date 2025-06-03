import React from "react";
import {useAuth} from "react-oidc-context";
import { useNavigate } from "react-router-dom";



function Help() {
    const auth = useAuth();
    const navigate = useNavigate();
    if (!auth.isAuthenticated) {
        return(
        <div>
            <h3>Please log in to access the help page.</h3>
            <button onClick={() => navigate("/") }>Home</button>
            <button onClick={() => auth.signinRedirect()} >Sign in</button>
        </div>
        );
    }
    return(
        <div>
        <button onClick={()=> navigate("/profile")}>Profile</button>
        <h1>Help Page</h1>
        </div>


    );
}
export default Help;