import Game from "./Game";
import Login from "./Login";
import UserCard from "./UserCard";
import NavBar from "./NavBar";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import History from "./History"
import MiddleLeader from "./MiddleLeader";
import { ThemeContext } from "./App";
import { useContext, useState, useEffect } from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";

function PageRender({socket,gameState,modifyCurrUserData,currUserData,declareVictor,knownUsers,leaderboard}){

  function getUsers(){
    if(Array.isArray(knownUsers)){
      return knownUsers.map(user=>{return <UserCard key={user.id} id={user.id} username={user.username} userColor={user.userColor} socket={socket} currUserData={currUserData}/>})
    }else{
      return <></>
    }
  }

  const theme = useContext(ThemeContext)

return (
    <div>
      <BrowserRouter>
        <div className={"header"+theme}>
          <h1>Battleship Online (Title Pending)</h1>
          <NavBar currUserData={currUserData}/>
        </div>
        <div className="emptyspace"></div>
        <div className={"activeusers"+theme}>
          {getUsers()}
        </div>
        <div className={"second"+theme}>
          <MiddleLeader leaderboard={leaderboard} currUserData={currUserData}/>
        </div>
        <div className={"main"+theme}>
          <Routes>
              <Route path="/" element={<Game gameState={gameState} socket={socket} currUserData={currUserData} declareVictor={declareVictor} knownUsers={knownUsers}/>}/>
              <Route path="/login" element={<Login currUserData={currUserData} modifyCurrUserData={modifyCurrUserData} socket={socket}/>}/>
              <Route path="/profile/:id" element={<Profile currUserData={currUserData} modifyCurrUserData={modifyCurrUserData} socket={socket}/>}/>
              <Route path="/leaderboard" element={<Leaderboard leaderboard={leaderboard}/>}/>
              <Route path="/history/:id" element={<History currUserData={currUserData}/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default PageRender;