import React, {useState, useContext, useEffect} from "react"

import {UserContext} from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [ , setToken] = useContext(UserContext);

    const submitSignup = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username:username, hashed_password: password})
        }

        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            setErrorMessage(data.detail);
        }
        else {
            setToken(data);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password == confirmationPassword) {
            submitSignup();
        }
        else {
            setErrorMessage("Passwords don't match");
        }
    }

    return (
        <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Sign up</h1>
        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        <button className="button is-primary" type="submit">
          Sign up
        </button>
      </form>
    </div>
    );
};

export default Signup;