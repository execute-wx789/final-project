import Ranking from "./Ranking"


function Leaderboard({leaderboard}){

    function displayLeaderboard(){
        let pos = 0
        return leaderboard.map(rank=>{pos += 1;return <Ranking key={rank.id} rank={rank} pos={pos}/>})
    }

    return(
        <div>
            {displayLeaderboard()}
        </div>
    )
}

export default Leaderboard