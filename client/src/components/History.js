import HistoryCard from "./HistoryCard"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function History({currUserData}){
    const {id} = useParams()
    const [history,setHistory] = useState([])
    useEffect(()=>{
        fetch(`/games`)
        .then(r=>r.json())
        .then(d=>{
            let history_hold = []
            let longestGame = {
                game_id:0,
                turns:0,
            }
            let shortestGame = {
                game_id:0,
                turns:201,
            }
            d.forEach(game => {
                if(game.challenger_id === parseInt(id)){
                    history_hold.push(game)
                    if(longestGame.turns < game.turns){
                        longestGame = {
                            game_id:game.id,
                            turns:game.turns
                        }
                    }
                    if(shortestGame.turns > game.turns){
                        shortestGame = {
                            game_id:game.id,
                            turns:game.turns
                        }
                    }
                }
                if(game.challenged_id === parseInt(id)){
                    history_hold.push(game)
                    if(longestGame.turns < game.turns){
                        longestGame = {
                            game_id:game.id,
                            turns:game.turns
                        }
                    }
                    if(shortestGame.turns > game.turns){
                        shortestGame = {
                            game_id:game.id,
                            turns:game.turns
                        }
                    }
                }
            })
            const return_history = history_hold.map(game => {
                if(longestGame.game_id === game.id){
                    let new_return = game
                    new_return.is_longest = true
                    return new_return
                }else if(shortestGame.game_id === game.id){
                    let new_return = game
                    new_return.is_shortest = true
                    return new_return
                }else{return game}
            })
            setHistory(return_history)
        })
        .catch(e=>console.log(e))
    },[id])
    function displayHistory(){
        return history.map((hist)=>{return <HistoryCard key={hist.id} history={hist} userId={parseInt(id)} currUserData={currUserData}/>})
    }
    function displayStatus(){
        return history.map((hist)=>{return <p>{hist.status}</p>})
    }
    function displayVictor(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>Undecided</p>
            }else{
                if(hist.victor === hist.challenged_id){
                    if(hist.challenged){
                        return <p>{hist.challenged.username}</p>
                    }else{
                        return <p>DELETED USER</p>
                    }
                }else if(hist.victor === hist.challenger_id){
                    if(hist.challenger){
                        return <p>{hist.challenger.username}</p>
                    }else{
                        return <p>DELETED USER</p>
                    }
                }
            }
        })
    }
    function displayVictorPos(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>Undecided</p>
            }else{
                if(hist.victor === hist.challenged_id){
                    return <p>Challenged</p>
                }else if(hist.victor === hist.challenger_id){
                    return <p>Challenger</p>
                }
            }
        })
    }
    function displayVictorGain(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>Undecided</p>
            }else{
                return <p>{hist.victories[0].rating_gain}</p>
            }
        })
    }
    function displayLoser(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>Undecided</p>
            }else{
                if(hist.victor === hist.challenger_id){
                    if(hist.challenged){
                        return <p>{hist.challenged.username}</p>
                    }else{
                        return <p>DELETED USER</p>
                    }               
                }else if(hist.victor === hist.challenged_id){
                    if(hist.challenger){
                        return <p>{hist.challenger.username}</p>
                    }else{
                        return <p>DELETED USER</p>
                    }                
                }
            }
        })
    }
    function displayLoserPos(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>Undecided</p>
            }else{
                if(hist.victor === hist.challenger_id){
                    return <p>Challenged</p>
                }else if(hist.victor === hist.challenged_id){
                    return <p>Challenger</p>
                }
            }
        })
    }
    function displayLoserLoss(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>Undecided</p>
            }else{
                return <p>{hist.victories[0].rating_loss}</p>
            }
        })
    }
    function displayExtraInfo(){
        return history.map((hist)=>{
            if(hist.status === "Ongoing"){
                return <p>This battle has yet to end</p>
            }else if(hist.is_longest){
                return <p>This was this users longest game</p>
            }else if(hist.is_shortest){
                return <p>This was this users shortest game</p>
            }else if(hist.challenger_id === currUserData.id){
                return <p>You were the challenger!</p>
            }else if(hist.challenged_id === currUserData.id){
                return <p>You were challenged!</p>
            }else{
                return <p>No Intresting Info</p>
            }
        })
    }
    return(
        <>
            <div className="leaderboard-column">
                Status:
                {displayStatus()}
            </div>
            <div className="leaderboard-column">
                Victor:
                {displayVictor()}
            </div>
            <div className="leaderboard-column">
                Position:
                {displayVictorPos()}
            </div>
            <div className="leaderboard-column">
                Rating Gain:
                {displayVictorGain()}
            </div>
            <div className="leaderboard-column">
                Loser:
                {displayLoser()}
            </div>
            <div className="leaderboard-column">
                Position:
                {displayLoserPos()}
            </div>
            <div className="leaderboard-column">
                Rating Loss:
                {displayLoserLoss()}
            </div>
            <div className="leaderboard-column">
                Extra Info:
                {displayExtraInfo()}
            </div>
        </>
    )
}

export default History