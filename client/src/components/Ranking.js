import { Link } from "react-router-dom"

function Ranking({rank,pos}){
    function usernameCheck(){
        if(rank.user){
            return rank.user.username
        }else{
            return "DELETED USER"
        }
    }
    return(
        <>
            <a>{pos + "."}  {usernameCheck()}  ||  Rating: {rank.rating + " "}  ||  </a><Link to={`/history/${rank.user_id}`} className="nav-link">Match History</Link>
            <br></br>
            <br></br>
        </>
    )
}

export default Ranking