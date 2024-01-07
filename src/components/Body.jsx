import React, {useState, useEffect, useContext} from "react";
import {Routes, Route, Link, useNavigate} from 'react-router-dom';

import PersonalInformation from "./PersonalInformation";
import Rules from "./Rules";
import Nutrition from "./Nutrition";
import Dropdown from "./Dropdown";
import {UserContext} from "../context/UserContext";

import './Style.css'
import MealPlan from "./MealPlan";
const Body = () => {
    const navigate = useNavigate();
    const [token, ] = useContext(UserContext)
    const [show, setShow] = useState("input");
    const [userInformation, setUserInformation] = useState([]);
    const [userRules, setUserRules] = useState([]);
    const [nutrition, setNutrition] = useState([]);
    const [menu, setMenu] = useState([]);
    const [menuHasLoaded, setMenuHasLoaded] = useState(false);
    const calculateNutrients = async () => {
        const payload = JSON.stringify({
                "physical_data" : userInformation,
                "rules" : userRules
            });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: payload,
        };

        console.log(payload);

        const response = await fetch("/api/nutrition/calculate", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            setNutrition(data);
            setShow("nutrition");
            console.log(data);
        }
    }

    const calculateMenu = async () => {
        setMenuHasLoaded(false);
        setShow("menu");

        const payload = JSON.stringify({
                "preferences" : userRules.preferences,
                "diets" : userRules.diets,
                "intake" : nutrition
            });

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: payload,
        };

        console.log(payload);

        const response = await fetch("/api/menu/calculate", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
            setShow("input");
        } else {
            setMenu(data);
            console.log(data);
        }
    }

    const updateUserInformation = (info) => {
        setUserInformation(info);
    }

    const updateUserRules = (rules) => {
        setUserRules(rules);
    }

    const updateNutrition = (nutrition) => {
        setNutrition(nutrition)
    }

    function loadDropdownMenus() {
        if (menuHasLoaded && menu.length > 0)
        {
            return <Dropdown title="Hétfő" nutrition={menu.daily_menus[0].total_nutrients}/>
        }
    }

    useEffect(() => {setMenuHasLoaded(true); }, [menu]);

    //useEffect(() => {document.getElementById("dropdown-monday").setAttribute("nutrients", menu.daily_menus[0].total_nutrients)} }, [menuHasLoaded]);

    return (
        <Routes>

            <Route path="/" element={
                <div className=".container.is-widescreen">
                    {/*<button onClick={() => {console.log(userInformation)}}>Log user info</button>*/}
                    {/*<button onClick={() => {console.log(userRules)}}>Log user rules</button>*/}
                    {show === "input" ? (
                        <>

                    <Link to="/" className="link-button"
                    onClick={calculateNutrients}>Indít</Link>
                    <div  className=".container.is-widescreen">
                        <PersonalInformation onChange={updateUserInformation}/>
                    </div>
                    <div className=".container.is-widescreen">
                        <Rules onChange={updateUserRules}/>
                    </div>
                        </>) : show === "nutrition" ? (
                            <>

            <Link style={{marginBottom: "32px"}}
                  to="/"
                  className="link-button"
                  onClick={calculateMenu}>Kérek egy menüt!</Link>

                    <div className=".container.is-widescreen">
                        <Nutrition rows={nutrition} onChange={updateNutrition} />
                    </div>
                            </>) : menuHasLoaded ? <MealPlan menu={menu}/> : <p>Loading...</p>}
                    {/*<Dropdown title="Az étrendje"
                                                             nutrients={menu.total_nutrients}
                                                             Element = {<Dropdown title="Hétfő"
                                                                                  nutrients={menu.daily_menus[0].total_nutrients}
                                                                                  Element = {<Dropdown title="Reggeli"
                                                                                                       nutrients={menu.daily_menus[0].meals[0].total_nutrients}/>} />} /> */}
                </div>
              }/>
        </Routes>
    );
}

export default Body;