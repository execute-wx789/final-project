import React from "react"
import { NavLink } from "react-router-dom"

function NavBar({currUserData}){
    function showProfileCheck(){
        if (currUserData !== "") {
            return <NavLink className="nav-link" to={`/profile/${currUserData.id}`}>Profile</NavLink>
        }
    }
    return (
        <div>
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
            <NavLink className="nav-link" to="/login">Login</NavLink>
            {showProfileCheck()}
        </div>
    )
}

export default NavBar