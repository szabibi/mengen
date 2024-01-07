import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import Body from "./components/Body";

import Test from "./components/Test";
import { UserContext } from "./context/UserContext";
const App = () => {
  const [message, setMessage] = useState("");
  const [token, ] = useContext(UserContext)

  const getWelcomeMessage = async () => {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
      };
      const response = await fetch("/api/", requestOptions);
      const data = await response.json();

      if (!response.ok)
      {
          console.log("error");
      } else {
          setMessage(data.message);
      }

      console.log(data);
  };

  const getFoodContent = async () => {
      const requestOptions = {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
      };

      const response = await fetch("/api/food", requestOptions);
      const data = await response.json();

      console.log(data);
  };

  useEffect(() => { getWelcomeMessage() }, []);

  return (
      <>
          {!token && <Navigate to="/" replace/> }
          <Header title={message}/>
          <Routes>

              <Route path="/" element={
                  <>
                      <div className="columns"></div>
                      <div className="column m-5 is-two-thirds">
                          {!token ? (
                              <div className="columns">
                              <Signup />
                              <Login />
                              </div>
                              ) : ( <div className=".container.is-widescreen">
                              <Body/>
                          </div>)
                        }
                      </div>
                  </>}
              />
          </Routes>
      </>
  )
};

export default App;
