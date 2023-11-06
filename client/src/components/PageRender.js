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
import { Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

function PageRender({modifyChallengeState,socket,gameState,modifyCurrUserData,currUserData,declareVictor,knownUsers,leaderboard,challengeState}){

  const [dimensions, setDimensions] = useState({window:windowDimensions,screen:screenDimensions})

  useEffect(()=>{
    const subscription = Dimensions.addEventListener("change",({window,screen})=>{setDimensions({window,screen})})
    return () => subscription?.remove()
  },[dimensions])

  function showLocalLeader(){
    if(dimensions.window.width > 1599){
      return(
        <div className={"second"+theme}>
          <MiddleLeader leaderboard={leaderboard} currUserData={currUserData}/>
        </div>
      )
    }else{
      return <></>
    }
  }

  function getUsers(){
    if(Array.isArray(knownUsers)){
      return knownUsers.map(user=>{if(user.id !== currUserData.id){return <UserCard key={user.id} id={user.id} username={user.username} userColor={user.userColor} socket={socket} currUserData={currUserData} challengeState={challengeState}/>}})
    }else{
      return <></>
    }
  }

  function declineChallenge(e){
    socket.emit("message",{"message_type":4,"data":{internalId:3,challenger:challengeState.challengeData.challenger}})
    modifyChallengeState(false)
  }

  function acceptChallenge(e){
    socket.emit("message",{"message_type":4,"data":{internalId:1,challenger:challengeState.challengeData.challenger,challenged:challengeState.challengeData.challenged,colorInfo:currUserData.settings.gameColors}})
    modifyChallengeState(false)
  }

  function showAcceptance(){
    if(challengeState.response){
      return(
        <p>{challengeState.challengedData.username} declined!</p>
      )
    }
  }

  useEffect(()=>{
    if(challengeState.response){
      setTimeout(function(){
        modifyChallengeState(false)
      },5000)
    }
  },[challengeState])

  function showChallenge(){
    if(challengeState){
      if(challengeState.challengeData.challenged === currUserData.id){
        return(
          <div className={"challenge"+theme}>
            <p>{challengeState.challengerData.username} is Challenging you!</p>
            <button onClick={acceptChallenge}>Accept</button><button onClick={declineChallenge}>Decline</button>
          </div>
        )
      }else if(challengeState.challengeData.challenger === currUserData.id){
        return(
          <div className={"challenge"+theme}>
            <p>Waiting on {challengeState.challengedData.username}'s response</p>
            {showAcceptance()}
          </div>
        )
      }
    }else{
      return(<></>)
    }
  }

  const theme = useContext(ThemeContext)

return (
    <div>
      <BrowserRouter>
        <div className={"header"+theme}>
          <h1>Peer-to-Board ~ Battleship</h1>
          <NavBar currUserData={currUserData}/>
        </div>
        {showChallenge()}
        <div className={"activeusers"+theme}>
          <h4 className="activeusers-name">Online Users</h4>
          {getUsers()}
        </div>
        {showLocalLeader()}
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