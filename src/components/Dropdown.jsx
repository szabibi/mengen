import React, {useEffect, useState} from "react";

import "./Style.css"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";

const Dropdown = ({title, nutrients, Element}) => {
    const [showContent, setShowContent] = useState(false);

    const toggleDropdown = () => {
        setShowContent(!showContent);
    }
    return (
        <>
            <div className="dropdown-table">
            <button id="toggle_dropdown_button"
                    type="button"
                    className="button blue circle-button"
            onClick={toggleDropdown}>
                <span className="icon is-small">
                    <FontAwesomeIcon style={{paddingTop:"4px"}} icon={showContent ? faCaretUp : faCaretDown} size={"xs"}/>
                </span>
            </button>
                <span className="title">{title}</span>
                { nutrients ? (
                    <span>
                    <table className="table  transparent-table is-fullwidth ">
                    <thead className="">
                    <tr key="0" className="table-header">
                {nutrients.map((row) => (
                    <th className="borderless">{row.nutrient_name}</th>
                    ))}
                    </tr>
                    </thead>
                    <tbody>

                    <tr key="1">
                {nutrients.map((row) => (
                    <td>{row.contains} {row.unit}</td>
                    ))}
                    </tr>
                    </tbody>
                    </table>
                    </span>
                    ) : <></> }
            </div>
            <div className="expendable" style={{display: showContent === true ? "" : "none"}}>
                {Element}
            </div>
        </>
    );
}

export default Dropdown;