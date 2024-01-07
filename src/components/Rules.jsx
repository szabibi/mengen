import React, {useState, useContext, useEffect} from "react";
import {Link} from "react-router-dom";

import "./Style.css"

import {UserContext} from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

const Rules = ({onChange}) => {
    const [token,] = useContext(UserContext);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [goal, setGoal] = useState(""); // maintain, lose, gain
    const [difference, setDifference] = useState("");
    const [period, setPeriod] = useState("");
    const [scope, setScope] = useState("daily") // daily, weekly
    const [distributionBreakfast, setDistributionBreakfast] = useState("")
    const [distributionLunch, setDistributionLunch] = useState("")
    const [distributionDinner, setDistributionDinner] = useState("")
    const [diets, setDiets] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [food, setFood] = useState([]);

    const [canRemoveDisliked, setCanRemoveDisliked] = useState(false);
    const [canRemovePreferred, setCanRemovePreferred] = useState(false);

    const loadUserRules = async () => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/json",
            Authorization: "Bearer " + token,},
        };

        const response = await fetch("/api/users/me/rules", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            setGoal(data.goal);
            setDifference(data.difference);
            setPeriod(data.period);
            setScope(data.scope);
            setDistributionBreakfast(data.distribution_breakfast);
            setDistributionLunch(data.distribution_lunch);
            setDistributionDinner(data.distribution_dinner);
            console.log(data);
        }
    }

    const updateUserRules = async () => {
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type":"application/json",
            Authorization: "Bearer " + token,},
            body: JSON.stringify({
              "goal": goal,
              "difference": difference,
              "period": period,
              "scope": scope,
              "distribution_breakfast": distributionBreakfast,
              "distribution_lunch": distributionLunch,
              "distribution_dinner": distributionDinner
            }),
        };

        const response = await fetch("/api/users/me/rules", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
        }
    }

    const loadPreferences = async () => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/json",
            Authorization: "Bearer " + token,},
        };

        const response = await fetch("/api/users/me/preferences", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            setPreferences(data);
            console.log(data);
        }
    }

    const updatePreferences = async() => {
        const payload = Array.from(preferences).map(p => ({
            food_id: parseInt(p.food_id),
            preference: p.preference,
            type: p.type,
        }));

        console.log(payload);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(payload),
        };

        const response = await fetch("/api/users/me/preferences", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
        }
    }

    const loadDiets = async () => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/json",
            Authorization: "Bearer " + token,},
        };

        const response = await fetch("/api/users/me/diets", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            setDiets(data);
            console.log(data);
        }

        setHasLoaded(true);
    }

    const updateDiets = async() => {
        const payload = diets;

        console.log(payload);

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(payload),
        };

        const response = await fetch("/api/users/me/diets", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            alert("SUCCESS IN THE DIET DEPARTMENT");
        }
    }

    const loadFood = async () => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/json",
            Authorization: "Bearer " + token,},
        };

        const response = await fetch("/api/food", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            setFood(data);
        }
    }

    function createPreferencesOptions(_preference) {
        let items = [];
        for(let i = 0; i < preferences.length; i++) {
            const preference = preferences[i];
            if (preference.preference == _preference)
            items.push(<option key={preference.food_id}
                               value={preference.food_id}>
                {preference.food_name}
            </option>);
        }
        return items;
    }

    function createFoodDatalistOptions() {
        let items = [];
        for(let i = 0; i < food.length; i++) {
            items.push(<option key={food[i].food_id}
                               data-value={food[i].food_id}
                                data-type={food[i].type}>
                {food[i].food_name.trim()}
            </option>);
        }
        return items;
    }
    const removePreferenceDislike = (e) => {
        const list = document.getElementById("added-disliked-food");
        const id_to_delete = list.options[list.selectedIndex].value;

        let temp = preferences;
        temp = temp.filter(p => p.preference != "dislike" || p.food_id != id_to_delete);
        setPreferences(temp);

       //document.getElementById("remove-disliked-food-button").disabled = true;
        //document.getElementById("already-added-notif").style.display = "none";
    }

    const toggleRemoveDislikedFoodButton = () => {
        const list = document.getElementById("added-disliked-food");
        document.getElementById("remove-disliked-food-button").disabled = list.selectedIndex == -1
    }

    const addPreferenceDislike = (e) => {
        e.preventDefault();
        const input = document.getElementById("browse-food-disliked");
        const list = document.getElementById("food-list");

        const food_name = input.value;

        let food_to_add_id;
        let food_to_add_type;

        var found = false;
        var options = list.options;

        for (var i = 0; i < options.length; i++)
        {
            if (options[i].innerHTML === food_name)
            {
                found = true;
                food_to_add_id = options[i].getAttribute("data-value");
                food_to_add_type = options[i].getAttribute("data-type");
                break;
            }
        }

        if (!found) {
            return;
        }

        const isAlreadyAdded = preferences.some(p => p.food_id === food_to_add_id && p.preference === "dislike");

        if (isAlreadyAdded) {
            //document.getElementById("already-added-notif").style.display = "";
            return;
        }

        //document.getElementById("already-added-notif").style.display = "none";

        setPreferences(prevPreferences => [
            ...prevPreferences,
            { food_id:  food_to_add_id, food_name: food_name, preference: "dislike", type: food_to_add_type}
        ])

        //document.getElementById("conditions-added-control").style.display = "";
    }

    const removePreferenceLike = (e) => {
        const list = document.getElementById("added-preferred-food");
        const id_to_delete = list.options[list.selectedIndex].value;
        console.log(id_to_delete);
        let temp = preferences;
        temp = temp.filter(p => p.preference != "like" || p.food_id != id_to_delete);
        setPreferences(temp);

        //document.getElementById("remove-preferred-food-button").disabled = true;
        //document.getElementById("already-added-notif").style.display = "none";
    }

    const toggleRemoveLikedFoodButton = () => {
        const list = document.getElementById("added-preferred-food");
        document.getElementById("remove-preferred-food-button").disabled = list.selectedIndex == -1
    }

    const addPreferenceLike = (e) => {
        e.preventDefault();
        const input = document.getElementById("browse-food-preferred");
        const list = document.getElementById("food-list");

        const food_name = input.value;

        let food_to_add_id;
        let food_to_add_type;

        var found = false;
        var options = list.options;

        for (var i = 0; i < options.length; i++)
        {
            if (options[i].innerHTML === food_name)
            {
                found = true;
                food_to_add_id = options[i].getAttribute("data-value");
                food_to_add_type = options[i].getAttribute("data-type");
                break;
            }
        }

        if (!found) {
            return;
        }

        const isAlreadyAdded = preferences.some(p => p.food_id === food_to_add_id && p.preference === "dislike");

        if (isAlreadyAdded) {
            //document.getElementById("already-added-notif").style.display = "";
            return;
        }

        //document.getElementById("already-added-notif").style.display = "none";

        setPreferences(prevPreferences => [
            ...prevPreferences,
            { food_id:  food_to_add_id, food_name: food_name, preference: "like", type: food_to_add_type}
        ])

        //document.getElementById("conditions-added-control").style.display = "";
    }

    useEffect(() => {
        loadUserRules();
        loadPreferences();
        loadDiets();
        loadFood();
        }, []);

    useEffect(() => { console.log(diets); }, [diets]);

    useEffect(() => { if (hasLoaded) { exportRules(); }; }, [hasLoaded]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (parseFloat(distributionBreakfast) + parseFloat(distributionLunch) + parseFloat(distributionDinner) != 100)
        {
            alert("Az eloszlás összegének 100%-nak kell lennie!");
            return;
        }
        updateUserRules();
        updatePreferences();
        updateDiets();
        exportRules();
    }

    const exportRules = () => {
        onChange(
            {
                "goal":goal,
                "difference":parseFloat(difference),
                "period":parseInt(period),
                "scope":scope,
                "distribution_breakfast":parseFloat(distributionBreakfast),
                "distribution_lunch":parseFloat(distributionLunch),
                "distribution_dinner":parseFloat(distributionDinner),
                "preferences":preferences,
                "diets":diets
            });
    }
    const restoreDefault = (e) => {
        e.preventDefault();
    }

    const hideDropdownDataList = (e) => {
        var input = e.target;
        var list = input.getAttribute("list");
        if (list) {
            input.setAttribute("data-list", list);
            input.removeAttribute("list");
        }
    }

    const showDropdownDataList = (e) => {
        var input = e.target;
        var list = input.getAttribute("data-list");
        if (list) {
            input.setAttribute("list", list);
            input.removeAttribute("data-list");
        }
    }

    const updateDietsOnCheckUncheck = (e) => {
        const checkbox = e.target;
        const label_text = checkbox.parentNode.innerText;

        if (checkbox.checked) {
            setDiets(diet => [...diets, {diet_name: label_text}]);
        } else {
            let temp = diets;
            temp = temp.filter(d => d.diet_name != label_text);
            setDiets(temp);
        }
    }

    return (
        <div>

        <form onSubmit={handleSubmit} className="span-whole-page">
            <div className="field is-grouped">
                Szabályok
                <div className="control">
                    <button className="button is-rounded" type="submit">Mentés</button>
                </div>
                <div className="control">
                    <button className="button is-rounded"
                    onClick={restoreDefault}>Mégse</button>
                </div>
            </div>
            <div className="form-grid">
                <fieldset className="field-set grid-row-span-2">
                    <legend className="legend-bubble">Célok</legend>
                    <div>
                        <div>
                            <label htmlFor="goal">Változás</label>
                        </div>
                        <div>
                            <div className="clickable-checkbox">
                                <label htmlFor="radio-change-maintain"
                                       className="">
                                    <input type="radio"
                                           value="maintain"
                                           id="radio-change-maintain"
                                           name="radio-change"
                                           onChange={(e) => setGoal(e.target.value)}
                                           checked={goal === "maintain"}
                                           required/>
                                    Fenntartás
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="radio-change-lose"
                                       className="">
                                    <input type="radio"
                                           value="lose"
                                           id="radio-change-lose"
                                           name="radio-change"
                                           onChange={(e) => setGoal(e.target.value)}
                                           checked={goal === "lose"}/>
                                    Fogyás
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="radio-change-gain"
                                   className="">
                                    <input type="radio"
                                           value="gain"
                                           id="radio-change-gain"
                                           name="radio-change"
                                           onChange={(e) => setGoal(e.target.value)}
                                           checked={goal === "gain"}/>
                                    Hízás
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="select-difference">Eltérés</label>
                        </div>
                        <div className="select" style={{float: "left"}}>
                            <select id="select-difference"
                                    value={difference}
                                    onChange={(e) => setDifference(e.target[e.target.selectedIndex].value)}
                                    style={{width: "6rem"}}>
                                <option value="0.5">0.5</option>
                                <option value="1">1</option>
                                <option value="1.5">1.5</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                        <div style={{float: "left", marginTop: "7px", marginLeft: "6px"}}>kg</div>
                    </div>
                    <br /><br />
                    <div>
                        <div className="select" style={{float: "left"}}>
                            <select id="select-period"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target[e.target.selectedIndex].value)}
                                    style={{width: "6rem"}}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div style={{float: "left", marginTop: "7px", marginLeft: "6px"}}>havonta</div>
                    </div>
                </fieldset>
                <fieldset className="field-set grid-be-bottom-left">
                    <legend className="legend-bubble">Hatáskör</legend>
                    <div id="select-scope-div">
                        <select id="select-scope"
                            className="bulma-clone select-button-bar"
                            size="2"
                            onChange={(e) => setScope(e.target[e.target.selectedIndex])}>
                        <option value="daily"
                                className="bulma-clone"
                                selected={scope === "daily"}>Napi</option>
                        <option value="weekly"
                                className="bulma-clone"
                                selected={scope === "weekly"}>Heti</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset className="field-set grid-row-span-2 grid-col-span-2">
                    <legend className="legend-bubble">Preferenciák</legend>
                    <div className="columns is-desktop">
                        <div className="column">
                            <div>Kizárt ételek</div>
                            <div>
                                <div>
                                    <input id="browse-food-disliked"
                                           data-list="food-list"
                                           className="datalist dropdown-fix-length bulma-clone"
                                           placeholder="Kezdjen gépelni..."
                                           onMouseOver={hideDropdownDataList}
                                           onKeyDown={showDropdownDataList}/>
                                </div>
                                <div>
                                    <button className="button circle-button appears-on-right blue"
                                            onClick={addPreferenceDislike}>+</button>
                                </div>
                            </div>
                            <div className="select is-multiple adapt-length-select">
                                <select className=""
                                        id="added-disliked-food"
                                        multiple
                                        onClick={(e) => {setCanRemoveDisliked(e.target.selectedIndex != -1);}}>
                                    {createPreferencesOptions("dislike")}
                                </select>
                            </div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                <button id="remove-disliked-food-button"
                                        type="button"
                                        className="button blue"
                                        disabled={!canRemoveDisliked}
                                        onClick={() => {
                                            removePreferenceDislike();
                                            setCanRemoveDisliked(false);
                                        }}>
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </span>
                                    <span>Törlés</span>
                                </button>
                            </div>
                        </div>
                        <div className="column">
                            <div>Kívánt ételek</div>
                            <div>
                                <input id="browse-food-preferred"
                                       data-list="food-list"
                                       className="datalist dropdown-fix-length bulma-clone"
                                       placeholder="Kezdjen gépelni..."
                                       onClick={hideDropdownDataList}
                                       onKeyDown={showDropdownDataList}/>
                            </div>
                            <div>
                                <button className="button blue circle-button appears-on-right "
                                    onClick={addPreferenceLike}>+</button>
                            </div>
                        <div className="select is-multiple adapt-length-select">
                                <select className=""
                                        id="added-preferred-food"
                                        multiple
                                        onClick={(e) => {setCanRemovePreferred(e.target.selectedIndex != -1)}}>>
                                    {createPreferencesOptions("like")}
                                </select>
                            </div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                <button id="remove-preferred-food-button"
                                        type="button"
                                        className="button blue"
                                        disabled = {!canRemovePreferred}
                                        onClick={() => {removePreferenceLike();
                                        setCanRemovePreferred(false);}}>
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </span>
                                    <span>Törlés</span>
                                </button>
                            </div>
                        </div>
                        <datalist id="food-list">
                            {createFoodDatalistOptions()}
                        </datalist>
                    </div>
                    <div>
                        <div>
                            Diéták
                        </div>
                        <div className="grid-fill">
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-vegetarian">
                                    <input id="diet-vegetarian"
                                           type="checkbox"
                                           className="checkbox"
                                           onChange={updateDietsOnCheckUncheck}
                                            checked={diets.some(d => d.diet_name == "Vegetáriánus")}/>
                                    Vegetáriánus
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-vegan">
                                    <input id="diet-vegan"
                                           type="checkbox"
                                           className="checkbox"
                                           onChange={updateDietsOnCheckUncheck}
                                            checked={diets.some(d => d.diet_name == "Vegán")}/>
                                    Vegán
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-pescetarian">
                                    <input id="diet-pescetarian"
                                           type="checkbox"
                                           className="checkbox"
                                           onChange={updateDietsOnCheckUncheck}
                                            checked={diets.some(d => d.diet_name == "Peszketáriánus")}/>
                                    Peszketáriánus
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-carnivore">
                                    <input id="diet-carnivore"
                                           type="checkbox"
                                           className="checkbox"
                                           onChange={updateDietsOnCheckUncheck}
                                           checked={diets.some(d => d.diet_name == "Húsevő")}/>
                                    Húsevő
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-glutenfree">
                                    <input id="diet-glutenfree"
                                           type="checkbox"
                                           className="checkbox"
                                           checked={diets.some(d => d.diet_name == "Gluténmentes")}
                                           onChange={updateDietsOnCheckUncheck}/>
                                    Gluténmentes
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-lactosefree">
                                    <input id="diet-lactosefree"
                                           type="checkbox"
                                           className="checkbox"
                                           checked={diets.some(d => d.diet_name == "Laktózmentes")}
                                           onChange={updateDietsOnCheckUncheck}/>
                                    Laktózmentes
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-paleo">
                                    <input id="diet-paleo"
                                           type="checkbox"
                                           className="checkbox"
                                           checked={diets.some(d => d.diet_name == "Paleo")}
                                           onChange={updateDietsOnCheckUncheck}/>
                                    Paleo
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-mediterranean">
                                    <input id="diet-mediterranean"
                                           type="checkbox"
                                           className="checkbox"
                                           checked={diets.some(d => d.diet_name == "Mediterrán")}
                                           onChange={updateDietsOnCheckUncheck}/>
                                    Mediterrán
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-italian">
                                    <input id="diet-italian"
                                           type="checkbox"
                                           className="checkbox"
                                           checked={diets.some(d => d.diet_name == "Olaszos")}
                                           onChange={updateDietsOnCheckUncheck}/>
                                    Olaszos
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="diet-hungarian">
                                    <input id="diet-hungarian"
                                           type="checkbox"
                                           className="checkbox"
                                           checked={diets.some(d => d.diet_name == "Magyaros")}
                                           onChange={updateDietsOnCheckUncheck}/>
                                    Magyaros
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="field-set grid-col-span-2">
                    <legend className="legend-bubble">Eloszlás</legend>
                    <div className="columns">
                        <div className="column">
                            <label htmlFor="input-distribution-breakfast">Reggeli</label><br />
                            <input type="number"
                                   className="input"
                                   value={distributionBreakfast}
                                   onChange={(e) => setDistributionBreakfast(e.target.value)}
                                   style={{width: "6rem"}} />
                            <label htmlFor="input-distribution-breakfast" className="input-unit">%</label>
                        </div>
                        <div className="column">
                            <label htmlFor="input-distribution-lunch">Ebéd</label><br />
                            <input type="number"
                                   className="input"
                                   value={distributionLunch}
                                   onChange={(e) => setDistributionLunch(e.target.value)}
                                   style={{width: "6rem"}} />
                            <label htmlFor="input-distribution-lunch" className="input-unit">%</label>
                        </div>
                        <div className="column">
                            <label htmlFor="input-distribution-dinner">Vacsora</label><br />
                            <input type="number"
                                   className="input"
                                   value={distributionDinner}
                                   onChange={(e) => setDistributionDinner(e.target.value)}
                                   style={{width: "6rem"}} />
                            <label htmlFor="input-distribution-dinner" className="input-unit">%</label>
                        </div>
                    </div>

                </fieldset>
            </div>
        </form>
    </div>
    )
};

export default Rules;