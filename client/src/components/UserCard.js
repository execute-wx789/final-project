import { Link } from "react-router-dom"

function UserCard({username,id,userColor,socket,currUserData,challengeState}){

    function handleChallenge(e){
        if(currUserData.id === id){
            console.log("This is you!")
        }else{
            socket.emit("message",{"message_type":3,"data":{challenger:currUserData.id,challenged:id}})
        }
    }

    function handleChallengeAllow(){
        if(challengeState){
            return (
                <span className="activeusers-button-off">Challenge!</span>
            )
        }else{
            return (
                <span className="activeusers-button" onClick={handleChallenge}>Challenge!</span>
            )
        }
    }

    return(
        <div className="activeusers-div">
            <a className="activeusers-internal" style={{color:userColor}}>{username}</a>
            <Link style={{color:"#ffffff"}} className="activeusers-button" to={`/history/${id}`}>Match History</Link>
            {handleChallengeAllow()}
        </div>
    )
}

export default UserCard