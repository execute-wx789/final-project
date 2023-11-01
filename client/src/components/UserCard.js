import { Link } from "react-router-dom"

function UserCard({username,id,userColor,socket,currUserData}){

    function handleChallenge(e){
        socket.emit("message",{"message_type":3,"data":{challenger:currUserData.id,challenged:id}})
    }

    return(
        <div className="activeusers-div">
            <a className="activeusers-internal" style={{color:userColor}}>{username}</a>
            <Link style={{color:"#ffffff"}} className="activeusers-button" to={`/history/${id}`}>Match History</Link>
            <span className="activeusers-button" onClick={handleChallenge}>Challenge!</span>
        </div>
    )
}

export default UserCard