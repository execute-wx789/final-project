import BoardTile from "./BoardTile"

function BoardRow({board,rowData,rowPos,changeTileState,localGameData,gameState,colorSet,forSettings}){
    function renderRow(){
        let colomn = 0
        return rowData.map((tile)=>{
            colomn += 1
            return <BoardTile tile={tile} board={board} colomn={colomn} row={rowPos} key={colomn} changeTileState={changeTileState} localGameData={localGameData} gameState={gameState} colorSet={colorSet} forSettings={forSettings}/>
        })
      };
    return(
        <>
            <>{renderRow()}</>
            <br></br>
        </>
    )
}
export default BoardRow