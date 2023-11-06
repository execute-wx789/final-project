import { useState } from "react"

function BoardTile({tile,colomn,row,board,changeTileState,localGameData,gameState,colorSet,forSettings}){
    const [hoverState,setHoverState] = useState(false)
    const {active,inactive,placed,miss,hit} = colorSet
    let color = inactive
    if(forSettings){
        if (tile === 0) {
            color = inactive
        }else if(tile === 1){
            color = active
        }else if(tile === 2){
            color = placed
        }else if(tile === 3){
            color = miss
        }else if(tile === 4){
            color = hit
        }
        return <div className="board-tile" style={{backgroundColor:color}}></div>
    }else{
        if(tile === 1 && localGameData.ships[row-1][colomn-1] === 1 && localGameData.boardNum === board){
            changeTileState(board,row,colomn,true)
        }
        if(gameState.gamePhase === 1){
            if(board === localGameData.boardNum){
                if(localGameData.ships[row-1][colomn-1] === 1){
                    color = placed
                }else{
                    if(localGameData.shipsPlaced < 10){
                        if(localGameData.determineLength){
                            if(localGameData.ships[row-1][colomn-1] === 3){
                                color = active
                            }else{
                                color = inactive
                            }
                        }else{
                            color = active
                        }
                    }else{
                        color = inactive
                    }
                }
            }else{
                color = inactive
            }
        }else if(gameState.gamePhase === 2){
            if(board !== localGameData.boardNum){
                if(tile === 0){
                    if(gameState.playerTurn === localGameData.boardNum){
                        color = active
                    }else{
                        color = inactive
                    }
                }else if(tile === 1){
                    color = miss
                }else{
                    color = hit
                }
            }else{
                if(localGameData.ships[row-1][colomn-1] === 1){
                    if(tile === 2){
                        color = hit
                    }else{
                        color = placed
                    }
                }else if(tile === 1){
                    color = miss
                }else{
                    color = inactive
                }
            }
        }else{
            if(board !== localGameData.boardNum){
                if(tile === 0){
                    color = inactive
                }else if(tile === 1){
                    color = miss
                }else{
                    color = hit
                }
            }else{
                if(localGameData.ships[row-1][colomn-1] === 1){
                    if(tile === 2){
                        color = hit
                    }else{
                        color = placed
                    }
                }else if(tile === 1){
                    color = miss
                }else{
                    color = inactive
                }
            }
        }

        function handleMouseOver(e){
            if(color === active){
                setHoverState(true)
            }else{
                setHoverState(false)
            }
        }

        function handleClick(e){
            if(color===inactive || color===placed || color===miss || color===hit){
                console.log("NoGo")
            }else{
                changeTileState(board,row,colomn,false)
            }
        }
        return <div className="board-tile" style={hoverState?{backgroundColor:color,cursor:"pointer"}:{backgroundColor:color}} onMouseOver={handleMouseOver} onClick={handleClick}></div>
    }
}
export default BoardTile