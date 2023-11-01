function BoardTile({tile,colomn,row,board,changeTileState,localGameData,gameState,colorSet}){
    const {active,inactive,placed,miss,hit} = colorSet
    let color = inactive
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

    function handleClick(e){
        if(color===inactive || color===placed || color===miss || color===hit){
            console.log("NoGo")
        }else{
            changeTileState(board,row,colomn,false)
        }
    }
    return <div className="board-tile" style={{backgroundColor:color}} onClick={handleClick}></div>
}
export default BoardTile