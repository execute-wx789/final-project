import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import PageRender from "./PageRender";

let endPoint = "http://localhost:5555"

let socket = io(endPoint,{autoConnect:false})

export const ThemeContext = createContext("-light")

function App() {

  const initdata10x10 = {
    "gameId":0,
    "gamePhase":1,
    "playerTurn":1,
    "player1id":0,
    "player2id":0,
    "player1placed":false,
    "player2placed":false,
    "player1colors":{},
    "player2colors":{},
    "player1hits":0,
    "player2hits":0,
    "turns":0,
    "attacks":{
      "board1":[
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
      "board2":[
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ]
    }
  }

  const [gameState,setGameState] = useState(initdata10x10)
  const [currUserData,setCurrUserData] = useState("")
  const [knownUsers,setKnownUsers] = useState([])
  const [theme,setTheme] = useState(false)
  const [leaderboard,setLeaderboard] = useState([])
  const [challengeState,setChallengeState] = useState(false)

  useEffect(()=>{
      fetch("/rankings")
      .then(r=>r.json())
      .then(d=>{
          const rankings = d
          rankings.sort((a,b)=>{
              if(a.rating > b.rating){
                  return -1
              }else if(a.rating < b.rating){
                  return 1
              }else{
                  return 0
              }
          })
          setLeaderboard(rankings)
      })
      .catch(e=>console.log(e))
  },[])

  useEffect(()=>{
    fetch("/autologin")
    .then(r=>r.json())
    .then(d=>{
      modifyCurrUserData(d)
      socket.connect()
    })
    .catch(e=>console.log(e))
  },[])

  useEffect(()=>{
    if(currUserData !== ""){
      if (currUserData.settings.darkMode === true) {
        setTheme("-dark")
      } else {
        setTheme("-light")  
      }
    }else{
      setTheme("-light")
    }
  },[currUserData])

  function initGame(player1,player2,player1colorInfo){
    if(player2 === currUserData.id){
      fetch("/games",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challenged_id:player1,challenger_id:player2})})
      .then(r=>r.json())
      .then(d=>{
        const newData = initdata10x10
        newData.player1id = player1
        newData.player2id = player2
        newData.player1colors = player1colorInfo
        newData.player2colors = currUserData.settings.gameColors
        newData.gameId = d.id
        socket.emit("message",{"message_type":1,"data":newData})
      })
      .catch(e=>console.log(e))
    }
  }

  function modifyCurrUserData(data){
    setCurrUserData(data)
  }

  function processKnownUsers(data){
    setKnownUsers(data)
  }

  function modifyChallengeState(data){
    setChallengeState(data)
  }

  function processChallenge(data){
    let knowsChallenger = false
    let extraChallengerInfo = {}
    let extraChallengedInfo = {}
    if(data.challenged !== currUserData.id){
      return
    }
    if(gameState.gameId !== 0){
      socket.emit("message",{"message_type":4,"data":{internalId:5,challenger:data.challenger}})
      return
    }
    if(challengeState !== false){
      socket.emit("message",{"message_type":4,"data":{internalId:4,challenger:data.challenger}})
      return
    }
    knownUsers.forEach((user)=>{
      if(user.id === data.challenger){
        knowsChallenger = true
        extraChallengerInfo = user
      }else if(user.id === data.challenged){
        extraChallengedInfo = user
      }
    })
    if(knowsChallenger){
      socket.emit("message",{"message_type":4,"data":{internalId:6,challenger:data.challenger,responsePacket:{challengerData:extraChallengerInfo,challengedData:extraChallengedInfo,challengeData:data}}})
      modifyChallengeState({challengerData:extraChallengerInfo,challengedData:extraChallengedInfo,challengeData:data})
      // let acceptance = prompt(`${extraChallengerInfo.username} is Challenging You, type A to accept!`)
      // if(acceptance === null){
      //   acceptance = "b"
      // }
      // if(acceptance.toLowerCase() === "a"){
      //   socket.emit("message",{"message_type":4,"data":{internalId:1,challenger:data.challenger,challenged:data.challenged,colorInfo:currUserData.settings.gameColors}})
      // }else{
      //   socket.emit("message",{"message_type":4,"data":{internalId:3}})
      // }
    }else{
      socket.emit("message",{"message_type":4,"data":{internalId:2,challenger:data.challenger}})
    }
  }

  useEffect(()=>{
    function socketMessageFunc(msg){
      if(msg.message_type === 1){
        if(msg.data.player1id === currUserData.id || msg.data.player2id === currUserData.id){
          if(msg.data.gameId !== 0){
            setGameState(msg.data)
          }else{
            setGameState(initdata10x10)
          }
        }
      }else if(msg.message_type === 2){
        processKnownUsers(msg.data)
      }else if(msg.message_type === 3){
        processChallenge(msg.data)
      }else if(msg.message_type === 4){
        if (msg.data.challenger === currUserData.id) {
          if(msg.data.internalId === 2){
            console.log("Challenged Player doesn't know you!")
          }else if(msg.data.internalId === 3){
            modifyChallengeState({...challengeState,response:true})
          }else if(msg.data.internalId === 4){
            console.log("Player arleady Challenged!")
          }else if(msg.data.internalId === 5){
            console.log("Player arleady in game!")
          }else if(msg.data.internalId === 1){
            initGame(msg.data.challenged,msg.data.challenger,msg.data.colorInfo)
            modifyChallengeState(false)
          }else if(msg.data.internalId === 6){
            modifyChallengeState({...msg.data.responsePacket,response:false})
          }
        }
      }else if(msg.message_type === 5){
        if(msg.data === 1){
          fetch("/rankings")
          .then(r=>r.json())
          .then(d=>{
              const rankings = d
              rankings.sort((a,b)=>{
              if(a.rating > b.rating){
                return -1
              }else if(a.rating < b.rating){
                return 1
              }else{
                return 0
              }
            })
            setLeaderboard(rankings)
          })
          .catch(e=>console.log(e))
        }
      }
    }
    function  socketConnectFunc(){
      socket.emit("message",{"message_type":2,"data":{id:currUserData.id,username:currUserData.username,userColor:currUserData.settings.gameColors.text}})
    }
    function socketDisconnectFunc(){
      processKnownUsers([])
    }

    socket.on("message",socketMessageFunc)
    socket.on("connect",socketConnectFunc)
    socket.on("disconnect",socketDisconnectFunc)
    return ()=>{
      socket.off("message",socketMessageFunc)
      socket.off("connect",socketConnectFunc)
      socket.off("disconnect",socketDisconnectFunc)
    }
  },[gameState,currUserData,knownUsers,challengeState])

  // const getSocketState = ()=>{
  //   socket.on("message",msg=>{
  //     if(msg.message_type === 1){
  //       if(msg.data.player1id === currUserData.id || msg.data.player2id === currUserData.id){
  //         if(msg.data.gameId !== 0){
  //           setGameState(msg.data)
  //         }else{
  //           setGameState(initdata7x7)
  //         }
  //       }
  //     }else if(msg.message_type === 2){
  //       processKnownUsers(msg.data)
  //     }else if(msg.message_type === 3){
  //       processChallenge(msg.data)
  //     }else if(msg.message_type === 4){
  //       if (msg.data.challenger === currUserData.id) {
  //         if(msg.data.internalId === 2){
  //           console.log("Failure to start game")
  //         }else if(msg.data.internalId === 3){
  //           console.log("Player Challenged refused!")
  //         }else if(msg.data.internalId === 1){
  //           initGame(msg.data.challenged,msg.data.challenger)
  //         }
  //       }
  //     }
  //   })
  // }

  function declareVictor(victorId,loserId,gameId){
    console.log(`You Won ${victorId}`)
    fetch("/victories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({victor:victorId,loser:loserId,game_id:gameId})})
    .catch(e=>console.log(e))
    fetch(`/games/${gameState.gameId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"Over",victor:victorId,turns:gameState.turns})})
    .catch(e=>console.log(e))
    const newData = gameState
    newData.gameId = 0
    setGameState(initdata10x10)
    socket.emit("message",{"message_type":1,"data":newData})
    socket.emit("message",{"message_type":5,"data":1})
  }

  return (
    <ThemeContext.Provider value={theme}>
      <PageRender modifyChallengeState={modifyChallengeState} challengeState={challengeState} leaderboard={leaderboard} knownUsers={knownUsers} gameState={gameState} socket={socket} currUserData={currUserData} modifyCurrUserData={modifyCurrUserData} declareVictor={declareVictor}/>
    </ThemeContext.Provider>
  )
}

export default App;
