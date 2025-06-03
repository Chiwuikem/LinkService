import React from "react";
import {useAuth} from "react-oidc-context";
import { useNavigate } from "react-router-dom";



function Settings() {
    const auth = useAuth();
    const navigate = useNavigate();
    return(
        <div>
        <button onClick={()=> navigate("/profile")}>Profile</button>
        <h1>Settings Page</h1>
        </div>


    );
}
export default Settings;