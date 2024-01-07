import React, {useState, useEffect, useContext} from "react";

import {UserContext} from "../context/UserContext";
import ErrorMessage from "./ErrorMessage"

const Test = () => {
    const [token, ] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const [rows, setRows] = useState("");

    const getRows = async () => {
        const requestOptions = {
          method: "GET",
            headers: {"Content-Type":"application/x-www-form-urlencoded"}
        };

        const response = await fetch("/api/food", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage("Couldn't load food data :(");
        }
        else {
            setRows(data);
        }
    };

    useEffect(() => {getRows(); }, []);

    return (
        <>
            <ErrorMessage message={errorMessage} />
            {rows ? (
                <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Unit</th>
              <th>Source name</th>
              <th>Nutrient ID</th>
              <th>Nutrient name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.food_id}>
                <td>{row.food_item_name}</td>
                <td>{row.amount}</td>
                <td>{row.unit}</td>
                <td>{row.source_name}</td>
                <td>{row.nutrient_id}</td>
                <td>{row.nutrient_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
            ) : (
                <p>Loading.........</p>
            )}
            </>
    );

};

export default Test;