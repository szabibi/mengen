import React, {useState, useEffect, useContext} from "react"
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrashCan, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import "./Style.css"
import {UserContext} from "../context/UserContext";

const PersonalInformation = ({onChange}) => {
    const [token, ] = useContext(UserContext);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [dateOfBirth, setDateOfBirth] = useState("");
    const [sex, setSex] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [typeOfWork, setTypeOfWork] = useState("");
    const [exercisePerWeek, setExercisePerWeek] = useState("");
    const [isHealthy, setIsHealthy] = useState("");
    const [conditionList, setConditionList] = useState("");
    const [addedConditions, setAddedConditions] = useState([]);

    const loadUserDetails = async () => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/x-www-form-urlencoded",
            Authorization: "Bearer " + token,},
        };

        const response = await fetch("/api/users/me/details", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            setSex('f');
        } else {
            const date = data.date_of_birth.split("T")[0];
            setDateOfBirth(date);
            setWeight(data.weight);
            setHeight(data.height);
            setSex(data.sex);
            setTypeOfWork(data.type_of_work);
            setExercisePerWeek(data.exercise_per_week);
            setIsHealthy(data.is_healthy);

        }
    };

    const loadConditionList = async() => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/x-www-form-urlencoded",},
        };

        const response = await fetch("/api/conditions", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
            setConditionList([]);
        } else {
            setConditionList(data);

        }
    };

    const loadAddedConditions = async() => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type":"application/x-www-form-urlencoded",
            Authorization: "Bearer " + token,},
        };

        const response = await fetch("/api/conditions/me", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            document.getElementById("conditions-added-control").style.display = "";
            setAddedConditions(data);
        }

        setHasLoaded(true);
    };

    function createConditionListOptions() {
        let items = [];
        for(let i = 0; i < conditionList.length; i++) {
            items.push(<option key={conditionList[i].id}
                               value={conditionList[i].id}>
                {conditionList[i].name}
            </option>);
        }
        return items;
    }

    function createAddedConditionsOptions() {
        let items = [];
        for(let i = 0; i < addedConditions.length; i++) {
            items.push(<option key={addedConditions[i].id}
                               value={addedConditions[i].id}>
                {addedConditions[i].name}
            </option>);
        }
        return items;
    }

    const handleChange = () => {
        onChange({"user_details" : {"date_of_birth" : dateOfBirth + "T00:00:00.000Z",
                    "sex" : sex,
                    "height" : parseInt(height),
                    "weight" : parseInt(weight),
                    "type_of_work" : parseInt(typeOfWork),
                    "exercise_per_week" : parseFloat(exercisePerWeek),
                    "is_healthy" : isHealthy},
            "conditions" : addedConditions});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!isHealthy && addedConditions.length === 0)
        {
            alert("Adjon meg betegséget, vagy jelölje be, hogy egészséges!")
            return;
        }
        updateUserDetails()
        updateUserConditions();
        handleChange();
    }
    const updateUserDetails = async () => {


        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                "date_of_birth": dateOfBirth + "T00:00:00.000Z",
                "sex": sex,
                "weight": weight,
                "height": height,
                "type_of_work": typeOfWork,
                "exercise_per_week": exercisePerWeek,
                "is_healthy": isHealthy,
            }),
        };

        const response = await fetch("/api/users/me/details", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        }
    }
    const updateUserConditions = async () => {
        const payload = Array.from(addedConditions).map(c => ({
            condition_id: c.id,
        }));

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(payload),
        };

        const response = await fetch("/api/conditions/me", requestOptions);
        const data = await response.json();

        if (!response.ok)
        {
            console.log(data);
        } else {
            alert("SUCCESS");
        }
    }
    const toggleConditionSelect = () => {
        var nodes = document.getElementById("editconditions").getElementsByTagName('*');
        for(var i = 0; i < nodes.length; i++){
            nodes[i].disabled = isHealthy;
        }

        if (!isHealthy) {
            toggleRemoveConditionButton();
        }
    };
    function displayAddedConditionsOptions() {
        if (addedConditions.length === 0)
        {
            document.getElementById("conditions-added-control").style.display = "none";
        }
    }
    const addCondition = (e) => {
        e.preventDefault();
        const list = document.getElementById("conditionselect");

        const opt = list.options[list.selectedIndex];
        const condition_name = opt.text;
        const condition_id = parseInt(opt.value);

        const isAlreadyAdded = addedConditions.some(condition => condition.id === condition_id);

        if (isAlreadyAdded) {
            document.getElementById("already-added-notif").style.display = "";
            return;
        }

        document.getElementById("already-added-notif").style.display = "none";

        setAddedConditions(prevConditions => [
            ...prevConditions,
            { id:  condition_id, name: condition_name}
        ])

        document.getElementById("conditions-added-control").style.display = "";
    }
    const removeCondition = (e) => {
        e.preventDefault();
        const list = document.getElementById("conditionsadded");
        const id_to_delete = list.options[list.selectedIndex].value;

        let temp = addedConditions;
        temp = temp.filter(condition => condition.id != id_to_delete);
        setAddedConditions(temp);

        document.getElementById("remove-condition").disabled = "disabled";
        document.getElementById("already-added-notif").style.display = "none";
    }
    const toggleRemoveConditionButton = () => {
        const list = document.getElementById("conditionsadded");
        const btn = document.getElementById("remove-condition");
        if (list.selectedIndex === -1) {
            btn.disabled = "disabled";
        } else {
            btn.disabled = "";
        }
    }

    useEffect(() => {
        loadUserDetails();
        loadConditionList();
        loadAddedConditions();}, []);

    useEffect(() => { if(hasLoaded) {handleChange();} }, [hasLoaded]);

    useEffect(() => { toggleConditionSelect(); }, [isHealthy]);

    useEffect(() => {displayAddedConditionsOptions();}, [addedConditions]);

    const restoreDefault = (e) => {
        e.preventDefault();
        loadUserDetails();
        loadAddedConditions();
    }

    return (
        <div style={{width: "100%"}}>
        <Link to="/rules">Rules</Link>
        <form onSubmit={handleSubmit} className="span-whole-page">

            <div className="field is-grouped">
                Alapadatok
                <div className="control">
                    <button className="button is-rounded" type="submit">Mentés</button>
                </div>
                <div className="control">
                    <button className="button is-rounded"
                    onClick={restoreDefault}>Mégse</button>
                </div>
            </div>
            <div className="form-grid">
                <fieldset className="field-set grid-col-span-2">
                    <legend className="legend-bubble">Fizikai adatok</legend>
                    <div className="physical-data-grid">
                            <div>
                                <div>
                                    <label htmlFor="dob">Születési dátum</label>
                                </div>
                                <div>
                                    <input id="dob"
                                           className="input"
                                           type="date"
                                           value={dateOfBirth}
                                           onChange={(e)=> setDateOfBirth(e.target.value)}
                                           required/>
                                </div>
                            </div>
                            <div className="physical-data-grid-second-col">
                                <div>
                                    <label htmlFor="sex">Születési nem</label>
                                </div>
                                <div className="select">
                                    <select id="sex"
                                            value={sex}
                                           onChange={(e)=> setSex(e.target[e.target.selectedIndex].value)}>
                                        <option value="f" selected="selected">Férfi</option>
                                        <option value="n">Nő</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="weight">Testtömeg</label>
                                </div>
                                <div style={{float: "left", marginRight: 5}}>
                                    <input id="weight"
                                           className="input"
                                           type="number"
                                           value={weight}
                                           onChange={(e)=> setWeight(e.target.value)}
                                           required/>
                                </div>
                                <div style={{float: "left", margin: "6px"}}>
                                    <label style={{float: "left"}} htmlFor="weight">kg</label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="height">Magasság</label>
                                </div>
                                <div style={{float: "left", marginRight: 5}}>
                                    <input id="height"
                                           className="input"
                                           type="number"
                                           value={height}
                                           onChange={(e)=> setHeight(e.target.value)}
                                           required/>
                                </div>
                                <div style={{float: "left", margin: "6px"}}>
                                    cm
                                </div>
                            </div>
                    </div>
                </fieldset>
                <fieldset className="field-set grid-col-span-2">
                    <legend className="legend-bubble">Testmozgás</legend>
                    <div style={{float: "left", marginRight:80, width: "25%"}}>
                        <label htmlFor="typeofwork">Munka fajtája</label>
                        <div>
                            <div className="clickable-checkbox">
                                <label htmlFor="typeofwork-office">
                                <input type="radio"
                                   id="typeofwork-office"
                                   onChange={() => setTypeOfWork(1)}
                                   className="radio"
                                   name="typeofwork"
                                   checked = {typeOfWork === 1}
                                   required/>Irodai
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="typeofwork-light">
                                    <input type="radio"
                                   id="typeofwork-light"
                                   onChange={() => setTypeOfWork(2)}
                                   className="radio"
                                   name="typeofwork"
                                   checked = {typeOfWork === 2}/>Könnyű fizikai
                                </label>
                            </div>
                            <div className="clickable-checkbox">
                                <label htmlFor="typeofwork-heavy">
                                    <input type="radio"
                                   id="typeofwork-heavy"
                                   onChange={() => setTypeOfWork(3)}
                                   className="radio"
                                   name="typeofwork"
                                   checked = {typeOfWork === 3}/>Nehéz fizikai
                                </label>
                            </div>
                        </div>
                    </div>
                    <div style={{float: "left"}}>
                        <div>
                            <label htmlFor="exercise">Sport</label>
                        </div>
                        <div style={{float: "left", marginRight: 5}}>
                            <input className="input"
                                   type="number"
                                   id="exercise"
                                   value={exercisePerWeek}
                                   onChange={(e)=> setExercisePerWeek(e.target.value)}
                                   required/>
                        </div>
                        <div style={{float: "left", margin: "6px"}}>
                            óra hetente
                        </div>
                    </div>
                </fieldset>
                <fieldset className="field-set grid-be-on-right">
                    <legend className="legend-bubble">Betegségek</legend>
                    <div className="clickable-checkbox">
                        <label htmlFor="ishealthy" >
                           <input type="checkbox"
                               id="ishealthy"
                               checked = {isHealthy}
                               onChange={(e)=> setIsHealthy(e.target.checked)}/>
                            Egészséges
                        </label>
                    </div>
                    <div className="small-text">
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faCircleQuestion} size="xs" />
                        </span>
                        Pipálja ki, ha nincsen betegsége!
                    </div>
                    <div id="editconditions">
                        <div>
                            <div>
                                <label htmlFor="conditionselect">Betegségek</label>
                            </div>
                                <div className="select dropdown-fix-length has-button-to-right-on-mobile">
                                    <select id="conditionselect">
                                        {createConditionListOptions()}
                                    </select>
                                </div>
                                <div className="">
                                    <button className="button blue is-to-the-right-on-mobile"
                                            id="addcondition"
                                            onClick={addCondition}>
                                        <span className="icon is-small">
                                            <FontAwesomeIcon icon={faCirclePlus} />
                                        </span>
                                        <span>Hozzáad</span>
                                    </button>
                                <div id="already-added-notif" className="error-notif" style={{display: "none"}}>
                                    Már szerepel.
                                </div>
                                </div>
                        </div>
                        <div id="conditions-added-control"
                             style={{display: "none"}}>
                            <div className="select is-multiple adapt-length-select">
                                <select className=""
                                        id="conditionsadded"
                                        multiple
                                        onChange={toggleRemoveConditionButton}>
                                    {createAddedConditionsOptions()}
                                </select>
                            </div>
                            <div style={{paddingTop: "10px", paddingBottom: "10px"}}>
                                <button className="button blue"
                                        id="remove-condition"
                                        onClick={removeCondition}>
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </span>
                                    <span>Törlés</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </form>
        </div>
    );
};

export default PersonalInformation;