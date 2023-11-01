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
            d.forEach(game => {
                if(game.challenger_id === parseInt(id)){
                    history_hold.push(game)
                }
                if(game.challenged_id === parseInt(id)){
                    history_hold.push(game)
                }
            })
            setHistory(history_hold)
        })
        .catch(e=>console.log(e))
    },[])
    function displayHistory(){
        return history.map((hist)=>{return <HistoryCard key={hist.id} history={hist} userId={parseInt(id)} currUserData={currUserData}/>})
    }
    return(
        <>
            <a>Status:  |</a><a>|  Victor:  |</a><a>|  Position:  |</a><a>|  Rating Gain:  |</a><a>|  Loser:  |</a><a>|  Position:  |</a><a>|  Rating Loss:</a>
            {displayHistory()}
        </>
    )
}

export default History