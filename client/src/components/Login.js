import { useState } from "react"

function Login({socket,modifyCurrUserData,currUserData}){
    const initvalue = {
        username:"",
        password:""
    }
    const [formHold,setFormHold] = useState(initvalue)
    const [signupState,setSignupState] = useState(false)

    function handleChanged(e){
        const {name,value} = e.target
        setFormHold({
            ...formHold,
            [name]:value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        let fetchURL = undefined
        if(signupState){
            fetchURL = "/users"
        }else{
            fetchURL = "/login"
        }
        fetch(fetchURL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formHold)})
        .then((r)=>{
            if (r.status === 201){
                return r.json()
            }else if(r.status === 400){
                console.log(r)
            }
        })
        .then((d)=>{
            if(d === undefined){
                modifyCurrUserData("")
            }else{
                modifyCurrUserData(d)
                socket.connect()
            }
        })
        .catch(e=>console.log(e))
    }

    function handleClick(e){
        fetch("/logout",{method:"DELETE"})
        .then(r=>{
            modifyCurrUserData("")
            socket.disconnect()
        })
    }

    function handleSignupState(e){
        setSignupState(!signupState)
    }

    function handleFormShow(){
        if(currUserData === ""){
            return (
            <div>
                <p>{signupState?"Sign up":"Log in"}</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" autoComplete="off" placeholder="Username" onChange={handleChanged} name="username" value={formHold.username}/>
                    <br></br>
                    <input type="password" autoComplete="off" placeholder="Password" onChange={handleChanged} name="password" value={formHold.password}/>
                    <br></br>
                    <button>{signupState?"Sign up":"Log in"}</button>
                </form>
                <p>{signupState?"Already have an account?":"Don't have an account?"}</p>
                <button onClick={handleSignupState}>{signupState?"Login":"Signup"}</button>
            </div>
            )
        }else{
            return (
                <div>
                    <p>Already Logged in</p>
                    <button onClick={handleClick}>Log Out</button>
                </div>
            )
        }
    }

    return (
        <>{handleFormShow()}</>
    )
}

export default Login