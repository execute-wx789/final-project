import BoardRow from "./BoardRow"
import MiddleLeader from "./MiddleLeader"
import { useEffect, useState, useContext } from "react"
import { ThemeContext } from "./App"


function BoardRender({socket,gameState,currUserData,declareVictor,knownUsers}){

    const theme = useContext(ThemeContext)
    const hitsNeeded = 1 // Value should be 30, only change for debugging purposes
    const allowed_ships = 1 // Value should be 10, only change for debugging pruposes

    const initdata10x10 = {
        "boardNum":undefined,
        "shipsPlaced":0,
        "shipTypePlaces":{
            "carrier":0,
            "battle":0,
            "dest":0,
            "boat":0,
        },
        "determineLength":false,
        "lastPlaced":[0,0],
        "ships":[
    
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

    const initcolorvalue = {
        active:"#ffffff",
        inactive:"#696969",
        placed:"#1e90ff",
        miss:"#ffd700",
        hit:"#ff0000",
        text:"#ffffff",
        background:"#858585"
    }

    const [localGameData,setLocalGameData] = useState(initdata10x10)
    useEffect(()=>{
        if(gameState.player1id === currUserData.id){
            setLocalGameData({...localGameData,"boardNum":1})
        }else if(gameState.player2id === currUserData.id){
            setLocalGameData({...localGameData,"boardNum":2})
        }else if(gameState.gameId === 0){
            setLocalGameData(initdata10x10)
        }
    },[gameState])
    useEffect(()=>{
        if(gameState.gamePhase === 3){
            if(gameState.player1hits === hitsNeeded && localGameData.boardNum === 1){
                declareVictor(gameState.player1id,gameState.player2id,gameState.gameId)
                setLocalGameData(initdata10x10)
            }else if(gameState.player2hits === hitsNeeded && localGameData.boardNum === 2){
                declareVictor(gameState.player2id,gameState.player1id,gameState.gameId)
                setLocalGameData(initdata10x10)
            }else{
                console.log("You Lost")
                setLocalGameData(initdata10x10)
            }
        }
    },[gameState])
    function changeTileState(board,row,col,hit){
        if(!hit){
            if(gameState.gamePhase === 1){
                const newData = localGameData
                newData.ships[row-1][col-1] = 1
                if(!localGameData.determineLength){
                    newData.determineLength = true
                    newData.lastPlaced = [row,col]
                    let yes1 = true
                    let yes2 = true
                    let yes3 = true
                    let yes4 = true
                    let maxLeng = 5
                    let minLeng = 1
                    if(localGameData.shipTypePlaces.carrier !== 1){
                        maxLeng = 5
                    }else if(localGameData.shipTypePlaces.battle !== 2){
                        maxLeng = 4
                    }else if(localGameData.shipTypePlaces.dest !== 3){
                        maxLeng = 3
                    }else if(localGameData.shipTypePlaces.boat !== 4){
                        maxLeng = 2
                    }
                    if(localGameData.shipTypePlaces.boat !== 4){
                        minLeng = 1
                    }else if(localGameData.shipTypePlaces.dest !== 3){
                        minLeng = 2
                    }else if(localGameData.shipTypePlaces.battle !== 2){
                        minLeng = 3
                    }else if(localGameData.shipTypePlaces.carrier !== 1){
                        minLeng = 4
                    }
                    for(let i=minLeng;i<maxLeng;i++){
                        if(newData.ships[row-1+i] !== undefined && yes1){
                            if(newData.ships[row-1+i][col-1] !== 1){
                                newData.ships[row-1+i][col-1] = 3
                            }else{
                                yes1 = false
                            }
                        }
                        if(newData.ships[row-1-i] !== undefined && yes2){
                            if(newData.ships[row-1-i][col-1] !== 1){
                                newData.ships[row-1-i][col-1] = 3
                            }else{
                                yes2 = false
                            }
                        }
                        if(newData.ships[row-1][col-1+i] !== undefined && yes3){
                            if(newData.ships[row-1][col-1+i] !== 1){
                                newData.ships[row-1][col-1+i] = 3
                            }else{
                                yes3 = false
                            }
                        }
                        if(newData.ships[row-1][col-1-i] !== undefined && yes4){
                            if(newData.ships[row-1][col-1-i] !== 1){
                                newData.ships[row-1][col-1-i] = 3
                            }else{
                                yes4 = false
                            }
                        }
                    }
                }else{
                    let shipLeng = 2
                    if(newData.lastPlaced[0]>row){
                        const tilesMoved = newData.lastPlaced[0]-row+1
                        for(let i=1;i<tilesMoved;i++){
                            newData.ships[newData.lastPlaced[0]-1-i][newData.lastPlaced[1]-1] = 1
                        }
                        shipLeng = tilesMoved
                    }
                    if(newData.lastPlaced[0]<row){
                        const tilesMoved = ((newData.lastPlaced[0]-row)*-1)+1

                        for(let i=1;i<tilesMoved;i++){
                            newData.ships[newData.lastPlaced[0]-1+i][newData.lastPlaced[1]-1] = 1
                        }
                        shipLeng = tilesMoved
                    }
                    if(newData.lastPlaced[1]>col){
                        const tilesMoved = newData.lastPlaced[1]-col+1
                        for(let i=1;i<tilesMoved;i++){
                            newData.ships[newData.lastPlaced[0]-1][newData.lastPlaced[1]-1-i] = 1
                        }
                        shipLeng = tilesMoved
                    }
                    if(newData.lastPlaced[1]<col){
                        const tilesMoved = ((newData.lastPlaced[1]-col)*-1)+1
                        for(let i=1;i<tilesMoved;i++){
                            newData.ships[newData.lastPlaced[0]-1][newData.lastPlaced[1]-1+i] = 1
                        }
                        shipLeng = tilesMoved
                    }
                    if(5 === shipLeng){
                        newData.shipTypePlaces.carrier++
                    }else if(4 === shipLeng){
                        newData.shipTypePlaces.battle++
                    }else if(3 === shipLeng){
                        newData.shipTypePlaces.dest++
                    }else{
                        newData.shipTypePlaces.boat++
                    }
                    newData.shipsPlaced += 1
                    newData.determineLength = false
                    let ir = 0
                    newData.ships.forEach((r)=>{
                        ir++
                        let c = 0
                        r.forEach((t)=>{
                            c++
                            if(t===3){
                                newData.ships[ir-1][c-1] = 0
                            }
                        })
                    })
                }
                setLocalGameData(newData)
                if(newData.shipsPlaced === allowed_ships){
                    const newerData = gameState
                    if(localGameData.boardNum === 1){
                        newerData.player1placed = true
                    }else{
                        newerData.player2placed = true
                    }
                    if(newerData.player1placed && newerData.player2placed){
                        newerData.gamePhase = 2
                    }
                    socket.emit("message",{"message_type":1,"data":newerData})
                }else{
                    socket.emit("message",{"message_type":1,"data":gameState})
                }
            }else{
                if(board === 1){
                    const newData = gameState
                    newData.attacks.board1[row-1][col-1] = 1
                    newData.playerTurn = 1
                    socket.emit("message",{"message_type":1,"data":newData})
                }else{
                    const newData = gameState
                    newData.attacks.board2[row-1][col-1] = 1
                    newData.playerTurn = 2
                    socket.emit("message",{"message_type":1,"data":newData})
                }
            }
        }else{
            if(board === 1){
                const newData = gameState
                newData.attacks.board1[row-1][col-1] = 2
                newData.player2hits += 1
                if(newData.player2hits === hitsNeeded){
                    newData.gamePhase = 3
                }
                socket.emit("message",{"message_type":1,"data":newData})
            }else{
                const newData = gameState
                newData.attacks.board2[row-1][col-1] = 2
                newData.player1hits += 1
                if(newData.player1hits === hitsNeeded){
                    newData.gamePhase = 3
                }
                socket.emit("message",{"message_type":1,"data":newData})
            }
        }
    }

    function handleTileColor(board){
        if(gameState.gameId !== 0){
            if(currUserData.settings.opponentColors === false || currUserData.settings.opponentColors === undefined){
                return currUserData.settings.gameColors
            }else if(board === 1){
                return gameState.player1colors
            }else if(board === 2){
                return gameState.player2colors
            }else{
                console.log("Failure to validate colors")
                return currUserData.settings.gameColors
            }
        }else{
            if (currUserData !== "") {
                return currUserData.settings.gameColors
            } else {
                return initcolorvalue
            }
        }
    }

    function handleBoardColor(board){
        if(gameState.gameId !== 0){
            if(currUserData.settings.opponentColors === false || currUserData.settings.opponentColors === undefined){
                if(board === 1){
                    return{
                        backgroundColor:currUserData.settings.gameColors.background,
                        color:gameState.player1colors.text
                    }
                }else{
                    return {
                        backgroundColor:currUserData.settings.gameColors.background,
                        color:gameState.player2colors.text
                    }
                }
            }else if(board === 1){
                return {
                    backgroundColor:gameState.player1colors.background,
                    color:gameState.player1colors.text
                }
            }else if(board === 2){
                return {
                    backgroundColor:gameState.player2colors.background,
                    color:gameState.player2colors.text
                }
            }else{
                console.log("Failure to validate colors")
                return {
                    backgroundColor:currUserData.settings.gameColors.background,
                    color:currUserData.settings.gameColors.text
                }
            }
        }else{
            if (currUserData !== "") {
                return {
                    backgroundColor:currUserData.settings.gameColors.background,
                    color:currUserData.settings.gameColors.text
                }
            } else {
                return {
                    backgroundColor:initcolorvalue.background,
                    color:initcolorvalue.text
                }            
            }
        }
    }

    function renderBoard1(){
        let rowPos = 0
        return gameState.attacks.board1.map((rowData)=>{
            rowPos += 1
            return <BoardRow board={1} rowData={rowData} rowPos={rowPos} key={rowPos} changeTileState={changeTileState} localGameData={localGameData} gameState={gameState} colorSet={handleTileColor(1)}/>
        })
    }
    function renderBoard2(){
        let rowPos = 0
        return gameState.attacks.board2.map((rowData)=>{
            rowPos += 1
            return <BoardRow board={2} rowData={rowData} rowPos={rowPos} key={rowPos} changeTileState={changeTileState} localGameData={localGameData} gameState={gameState} colorSet={handleTileColor(2)}/>
        })
    }
    function handleUsername(board,id){
        let username_hold = "Player"
        if(board === 1){
            username_hold = "Player 1"
            knownUsers.forEach(user => {
                if(user.id === gameState.player1id){
                    username_hold = user.username
                }
            })
        }else if(board === 2){
            username_hold = "Player 2"
            knownUsers.forEach(user => {
                if(user.id === gameState.player2id){
                    username_hold = user.username
                }
            })
        }
        return username_hold
    }

    return(
        <div>
            <div style={handleBoardColor(1)} className={"board-background-left"}>
                {renderBoard1()}<p>{handleUsername(1,gameState.player1id)}</p>
            </div>
            <div style={handleBoardColor(2)} className={"board-background-right"}>
                {renderBoard2()}<p>{handleUsername(2,gameState.player2id)}</p>
            </div>
        </div>
    )
}

export default BoardRender