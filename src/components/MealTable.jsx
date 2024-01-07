import React, {useState, useEffect, useContext} from "react";

import {UserContext} from "../context/UserContext";
import ErrorMessage from "./ErrorMessage"
import {Link} from "react-router-dom";

const MealTable = ({items}) => {
    const [token, ] = useContext(UserContext);

    return (
        <>
            {items ? (
                <table className="green-table table is-fullwidth uniform-columns">
          <thead className="">
            <tr className="table-header">
                <th style={{width: "16rem"}}>Étel</th>
              <th>Adag</th>
                {items[4].nutrients.map((nutrient) => (

                    <th className="white-text">{nutrient.nutrient_name}</th>)
                    )}
            </tr>
          </thead>
          <tbody className="bordered">
            {items.map((item) => (
              <tr key={item.food_id}>
                <td>{item.food_name}</td>
                  <td>1</td>
                  {item.nutrients.map((nutrient) =>
                      (
                    <td>{nutrient.contains} {nutrient.unit}</td>
                      ))}
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

export default MealTable;