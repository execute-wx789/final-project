import BoardRender from "./BoardRender"
import MiddleLeader from "./MiddleLeader"
import { ThemeContext } from "./App";
import { useContext } from "react";

function Game({socket,gameState,currUserData,declareVictor,knownUsers}){
    const theme = useContext(ThemeContext)

    return (
        <>
            <div>
                <BoardRender gameState={gameState} socket={socket} currUserData={currUserData} declareVictor={declareVictor} knownUsers={knownUsers}/>
            </div>
        </>
    )
}

export default Game