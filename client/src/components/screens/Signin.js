import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {UserContext} from '../../App';
import line from "../../assets/line.png";
import M from "materialize-css"
const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid Email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER", payload:data.user})
                    M.toast({ html:"Signed in Successfully", classes: "#42a5f5 blue lighten-1" })
                    history.push('/')
                }
            })
    }
    return (
        <div>

            <div className="myCard">

                <div className="card auth-card input-field">
                    <h2 className="brand-logo">Instagram</h2>
                    <div className="input-fields">
                        <input
                            type="text"
                            className = "input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field-box"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                        style={{ width: "245px", marginTop: "20px" }}
                        onClick={()=>postData()}
                        >Signin </button>
                    </div>
                    <img className="left" className="logo" src={line}
                        width="100"
                        height="40"
                        style={{ float: "left", paddingLeft: "5px" }}
                    />
                    <h6 style={{ float: "left", color: "#A9A9A9", paddingTop: "10px", fontWeight: "bold" }}>OR</h6>
                    <img className="left" className="logo" src={line}
                        width="100"
                        height="40"
                        style={{ float: "left" }}
                    />
                    <Link to="/reset" style={{ fontSize: "15px" }} className="LinkAddress">Forgot password?</Link>
                </div>
            </div>
            <div className="card bottom-card">
                <h6 style={{ padding: "15px", fontSize: "12px", fontWeight: 'bold' }}>
                    Don't have an account?
                    <Link to="/signup" className="LinkAddress"> Sign up</Link>
                </h6>
            </div>
        </div>
    )
}
export default Signin;