function HistoryCard({history,userId,currUserData}){
    function determineVictorAndPos(){
        if(history.status === "Ongoing"){
            return "Undecided  ||  Undecided  || Undecided"
        }else{
            if(history.victor === history.challenged_id){
                return `${history.challenged.username}  ||  Challenged  ||  ${history.victories[0].rating_gain}`
            }else if(history.victor === history.challenger_id){
                return `${history.challenger.username}  ||  Challenger  ||  ${history.victories[0].rating_gain}`
            }
        }
    }
    function determineLoserAndPos(){
        if(history.status === "Ongoing"){
            return "Undecided  ||  Undecided  || Undecided"
        }else{
            if(history.victor === history.challenged_id){
                return `${history.challenger.username}  ||  Challenger  ||  ${history.victories[0].rating_loss}`
            }else if(history.victor === history.challenger_id){
                return `${history.challenged.username}  ||  Challenged  ||  ${history.victories[0].rating_loss}`
            }
        }
    }
    function determineUserRelation(){
        if(history.victor === currUserData.id){
            return "  ||  You won this match!"
        }
        if(history.challenged_id === currUserData.id || history.challenger_id === currUserData.id){
            if(history.status === "Ongoing"){
                return "  ||  You are in this match"
            }else{
                return "  ||  You lost this match"
            }
        }
    }
    return(
        <div>
            <p>{history.status}  ||  {determineVictorAndPos()}  ||  {determineLoserAndPos()}{determineUserRelation()}</p>
        </div>
    )
}

export default HistoryCard