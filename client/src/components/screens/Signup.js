import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");



  const postData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: data.message, classes: "#42a5f5 blue lighten-1" });
          history.push("/signin");
        }
      });
  };

  return (
    <div>
      <div className="myCard">
        <div className="card auth-card input-field">
          <h2 className="brand-logo">Instagram</h2>

          <h4
            style={{
              fontWeight: "bold",
              color: "#A9A9A9",
              fontSize: "15px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            Sign up to see photos and videos from your friends.
          </h4>
          <div className="input-fields">
            <input
              type="text"
              placeholder="Email"
              className="input-field-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Full Name"
              className="input-field-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="input-field-box"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn waves-effect waves-light #64b5f6 blue darken-1"
              style={{ width: "245px", marginTop: "20px" }}
              onClick={() => postData()}
            >
              Sign up
            </button>
            <h6 style={{ fontSize: "12px", color: "#A9A9A9" }}>
              By signing up, you agree to our Terms , Data Policy and Cookies
              Policy .
            </h6>
          </div>
        </div>
      </div>
      <div className="card bottom-card">
        <h6 style={{ padding: "15px", fontSize: "12px", fontWeight: "bold" }}>
          Have an account ?
          <Link to="/signin" className="LinkAddress">
            {" "}
            Log in
          </Link>
        </h6>
      </div>
    </div>
  );
};
export default SignUp;
