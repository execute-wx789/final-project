import { useEffect, useState } from "react";
import Ranking from "./Ranking";
import { Link } from "react-router-dom";

function MiddleLeader({leaderboard,currUserData}){

    const [localLeaderboard,setLocalLeaderboard] = useState([])

    useEffect(()=>{
        let i = 0
        let posToCompare = 0
        leaderboard.forEach(user => {
            if(user.id === currUserData.id){
                posToCompare = i
            }
            i++
        })
        let pos = 0
        const posUpper = posToCompare - 5
        const posLower = posToCompare + 6
        let localLeader_hold = []
        leaderboard.forEach((rank)=>{
            pos += 1
            if(posUpper < pos && posLower > pos){
                localLeader_hold.push(rank)
            }
        })
        setLocalLeaderboard(localLeader_hold)
    },[leaderboard])

    // function displayLeaderboard(){
    //     let userOnBoard = {}
    //     let i = 0
    //     let posToCompare = 0
    //     leaderboard.forEach(user => {
    //         if(user.id === currUserData.id){
    //             userOnBoard = user
    //             posToCompare = i
    //         }
    //         i++
    //     })
    //     let pos = 0
    //     const posUpper = posToCompare - 5
    //     const posLower = posToCompare + 6
    //     return leaderboard.map(rank=>{pos += 1;if(posUpper < pos && posLower > pos){return <Ranking key={rank.id} rank={rank} pos={pos}/>}})
    // }

    function displayPosition(){
        let pos = 0
        return localLeaderboard.map(rank=>{pos += 1;return <p>{pos}.</p>})
    }

    function displayUsername(){
        return localLeaderboard.map(rank=>{return <p>{rank.user.username}</p>})
    }

    function displayRating(){
        return localLeaderboard.map(rank=>{return <p>{rank.rating}</p>})
    }

    // function displayHistLink(){
    //     return leaderboard.map(rank=>{return <><Link to={`/history/${rank.user.id}`} className="nav-link-local-leader">Match History</Link><br></br><br></br></>})
    // }

    if(currUserData !== ""){
        return(
            <div>
                <h4>Local Leaderboard</h4>
                <div className="leaderboard-left-column" style={{float:"left"}}>
                    {displayPosition()}
                </div>
                <div className="local-leaderboard-column" style={{float:"left"}}>
                    {displayUsername()}
                </div>
                <div className="local-leaderboard-column" style={{float:"left"}}>
                    {displayRating()}
                </div>
            </div>
        )
    }else{
        return <></>
    }

}

export default MiddleLeader