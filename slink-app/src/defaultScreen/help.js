import React from "react";
import { useNavigate } from "react-router-dom";



function Help() {
    const navigate = useNavigate();
    return(
        <div>
        <button onClick={()=> navigate("/profile")}>Profile</button>
        <h1>Help Page</h1>
        </div>


    );
}
export default Help;