import { Link } from "react-router-dom"

function Ranking({rank,pos}){
    return(
        <>
            <a>{pos + "."}  {rank.user.username}  ||  Rating: {rank.rating + " "}  ||  </a><Link to={`/history/${rank.user.id}`} className="nav-link">Match History</Link>
            <br></br>
            <br></br>
        </>
    )
}

export default Ranking