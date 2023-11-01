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

  function processChallenge(data){
    let knowsChallenger = false
    let extraChallengerInfo = {}
    if(data.challenged !== currUserData.id){
      return
    }
    knownUsers.forEach((user)=>{
      if (user.id === data.challenger) {
        knowsChallenger = true
        extraChallengerInfo = user
      }
    })
    if(knowsChallenger){
      let acceptance = prompt(`${extraChallengerInfo.username} is Challenging You, type A to accept!`)
      if(acceptance === null){
        acceptance = "b"
      }
      if(acceptance.toLowerCase() === "a"){
        socket.emit("message",{"message_type":4,"data":{internalId:1,challenger:data.challenger,challenged:data.challenged,colorInfo:currUserData.settings.gameColors}})
      }else{
        socket.emit("message",{"message_type":4,"data":{internalId:3}})
      }
    }else{
      socket.emit("message",{"message_type":4,"data":{internalId:2}})
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
            console.log("Failure to start game")
          }else if(msg.data.internalId === 3){
            console.log("Player Challenged refused!")
          }else if(msg.data.internalId === 1){
            initGame(msg.data.challenged,msg.data.challenger,msg.data.colorInfo)
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

    socket.on("message",socketMessageFunc)
    socket.on("connect",socketConnectFunc)
    return ()=>{
      socket.off("message",socketMessageFunc)
      socket.off("connect",socketConnectFunc)
    }
  },[gameState,currUserData,knownUsers])

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

  function declareVictor(victorId,loserId){
    console.log(`You Won ${victorId}`)
    fetch("/victories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({victor:victorId,loser:loserId,game_id:gameState.gameId})})
    .catch(e=>console.log(e))
    fetch(`/games/${gameState.gameId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"Over",victor:victorId})})
    .catch(e=>console.log(e))
    const newData = gameState
    newData.gameId = 0
    setGameState(initdata10x10)
    socket.emit("message",{"message_type":1,"data":newData})
  }

  return (
    <ThemeContext.Provider value={theme}>
      <PageRender leaderboard={leaderboard} knownUsers={knownUsers} gameState={gameState} socket={socket} currUserData={currUserData} modifyCurrUserData={modifyCurrUserData} declareVictor={declareVictor}/>
    </ThemeContext.Provider>
  )
}

export default App;
