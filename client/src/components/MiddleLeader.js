import Ranking from "./Ranking";

function MiddleLeader({leaderboard,currUserData}){

    function displayLeaderboard(){
        let userOnBoard = {}
        let i = 0
        let posToCompare = 0
        leaderboard.forEach(user => {
            if(user.id === currUserData.id){
                userOnBoard = user
                posToCompare = i
            }
            i++
        })
        let pos = 0
        const posUpper = posToCompare - 5
        const posLower = posToCompare + 6
        return leaderboard.map(rank=>{pos += 1;if(posUpper < pos && posLower > pos){return <Ranking key={rank.id} rank={rank} pos={pos}/>}})
    }

    return(
        <div>
            <h4>Local Leaderboard</h4>
            {displayLeaderboard()}
        </div>
    )
}

export default MiddleLeader