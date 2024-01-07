import React, {useState, useEffect, useContext} from "react";

import {UserContext} from "../context/UserContext";
import ErrorMessage from "./ErrorMessage"
import {Link} from "react-router-dom";

const Nutrition = ({rows, onChange}) => {
    const [token, ] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState(null);
    const [editableRows, setEditableRows] = useState([]);

    const handleInputChange = (nutrientId, newValue) => {
  setEditableRows((prevRows) =>
    prevRows.map((row) =>
      row.nutrient_id === nutrientId ? { ...row, ideal_intake: newValue } : row
    )
  );
};

    useEffect(() => {setEditableRows(rows);}, [rows]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onChange(editableRows);
    }
    return (
        <>
            {rows ? (
                <form onSubmit={handleSubmit}>
                    <div className="control">
                    <button className="button is-rounded" type="submit">Mentés</button>
                </div>
                <table className="green-table table is-fullwidth ">
          <thead className="">
            <tr className="table-header">
              <th>Tápanyag</th>
              <th>Minimum</th>
              <th>Ideális</th>
              <th>Maximum</th>
                <th>Mértékegység</th>
            </tr>
          </thead>
          <tbody>
            {editableRows.map((row) => (
              <tr key={row.nutrient_id}>
                <td>{row.nutrient_name}</td>
                <td>{row.minimal_intake}</td>
                <td><input type="number"
                           className="input"
                           value={row.ideal_intake}
                           onChange={(e) => handleInputChange(row.nutrient_id, e.target.value)}/></td>
                <td>{row.maximum_intake}</td>
                  <td>{row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
                    </form>
            ) : (
                <p>Loading.........</p>
            )}
            </>
    );

};

export default Nutrition;