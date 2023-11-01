import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Profile({currUserData,modifyCurrUserData,socket}){
    const navigate = useNavigate()

    const initvalue = {
        username:currUserData.username,
        password:""
    }
    const initcolorvalue = {
        active:"#ffffff",
        inactive:"#696969",
        placed:"#1e90ff",
        miss:"#ffd700",
        hit:"#ff0000",
        text:"#ffffff",
        background:"#858585"
    }

    const [formHold,setFormHold] = useState(initvalue)
    const [colorSetting,setColorSetting] = useState(initcolorvalue)

    useEffect(()=>{
        if (currUserData !== "") {
            setColorSetting(currUserData.settings.gameColors)   
        }
    },[currUserData])

    function updateServerInfo(data){
        const dataToSend = data
        if(dataToSend.rankings){
            delete dataToSend.rankings
        }
        fetch(`/users/${currUserData.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(dataToSend)})
        .then((r)=>{
            if (r.status === 202){
                return r.json()
            }else if(r.status === 400){
                console.log(r)
            }
        })
        .then((d)=>{
            modifyCurrUserData(d)
            socket.emit("message",{"message_type":2,"data":{id:d.id,username:d.username}})
        })
        .catch(e=>console.log(e))
    }

    function handleChanged(e){
        const {name,value} = e.target
        setFormHold({
            ...formHold,
            [name]:value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        updateServerInfo(formHold)
    }

    function handleClick(e){
        fetch("/logout",{method:"DELETE"})
        .then(r=>{
            modifyCurrUserData("")
            navigate("/login")
        })
    }

    function handleDelete(e){
        fetch(`/users/${currUserData.id}`,{method:"DELETE"})
        .then(r=>{
            handleClick(e)
        })
    }

    function changeDarkMode(e){
        const newData = currUserData
        newData.settings.darkMode = e.target.checked
        updateServerInfo(newData)
    }

    function changeOpponentColorMode(e){
        const newData = currUserData
        newData.settings.opponentColors = e.target.checked
        updateServerInfo(newData)
    }

    function changeGameColors(e){
        const {name,value} = e.target
        setColorSetting({
            ...colorSetting,
            [name]:value
        })
    }

    function submitColor(e){
        const newData = currUserData
        newData.settings.gameColors = colorSetting
        updateServerInfo(newData)
    }

    function resetColor(e){
        setColorSetting(currUserData.settings.gameColors)
    }

    function resetColorDefault(e){
        const newData = currUserData
        newData.settings.gameColors = initcolorvalue
        updateServerInfo(newData)
    }

    function safteyCheck(){
        if(currUserData !== "") {
            return (
                <div className="setting-org">
                    <div>
                        <h2>Personalization Settings:</h2>
                        <a>Dark Mode:</a><input onChange={changeDarkMode} checked={currUserData.settings.darkMode} type="checkbox"/>
                        <h3>Square Colors:</h3>
                        <a>Active Square:</a><input type="color" name="active" onChange={changeGameColors} value={colorSetting.active}/>
                        <br></br>
                        <br></br>
                        <a>Inactive Square:</a><input type="color" name="inactive" onChange={changeGameColors} value={colorSetting.inactive}/>
                        <br></br>
                        <br></br>
                        <a>Placed Square:</a><input type="color" name="placed" onChange={changeGameColors} value={colorSetting.placed}/>
                        <br></br>
                        <br></br>
                        <a>Miss Square:</a><input type="color" name="miss" onChange={changeGameColors} value={colorSetting.miss}/>
                        <br></br>
                        <br></br>
                        <a>Hit Square:</a><input type="color" name="hit" onChange={changeGameColors} value={colorSetting.hit}/>
                        <br></br>
                        <br></br>
                        <a>Username Color:</a><input type="color" name="text" onChange={changeGameColors} value={colorSetting.text}/>
                        <br></br>
                        <br></br>
                        <a>Background Color:</a><input type="color" name="background" onChange={changeGameColors} value={colorSetting.background}/>
                        <br></br>
                        <br></br>
                        <a>Show Opponents Colors:</a><input onChange={changeOpponentColorMode} checked={currUserData.settings.opponentColors} type="checkbox"/>
                        <br></br>
                        <br></br>
                        <button onClick={submitColor}>Submit Color Changes</button>
                        <br></br>
                        <button onClick={resetColor}>Reset Color Changes</button>
                        <br></br>
                        <button onClick={resetColorDefault}>Default Colors</button>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <h3>Modify Log in info:</h3>
                            <input type="text" autoComplete="off" placeholder="Username" onChange={handleChanged} name="username" value={formHold.username}/>
                            <br></br>
                            <input type="password" autoComplete="off" placeholder="Password" onChange={handleChanged} name="password" value={formHold.password}/>
                            <br></br>
                            <button>Submit</button>
                        </form>            
                    </div>
                    <br></br>
                    <div>
                        <button onClick={handleClick}>Log out</button>
                        <br></br>
                        <br></br>
                        <button onClick={handleDelete}>Delete Account</button>
                    </div>
                </div>
            )
        }else{
            navigate("/login")
        }
    }

    return (
        <>{safteyCheck()}</>
    )
}

export default Profile