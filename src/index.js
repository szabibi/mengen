import React from 'react';
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import "bulma/css/bulma.min.css";
import App from './App';

import {UserProvider} from "./context/UserContext";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <BrowserRouter>
           <UserProvider>
               <App />
           </UserProvider>
        </BrowserRouter>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
