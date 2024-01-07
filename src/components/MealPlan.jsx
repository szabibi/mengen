import React, {useEffect, useState} from "react";

import "./Style.css"
import Dropdown from "./Dropdown";
import MealTable from "./MealTable";


const MealPlan = ({menu, nutrition}) => {

    return (
        <>
            <Dropdown title="Az étrendje"
                       nutrients={menu.total_nutrients}
                       Element = {<div>
                           {menu.daily_menus.map((daily_menu) =>
                                   (
                                       <Dropdown title={daily_menu.day_name}
                                       nutrients={daily_menu.total_nutrients}
                                       Element = {<div>
                                           {daily_menu.meals.map((meal) =>
                                               (
                                                   <Dropdown title={meal.meal_name}
                                                   nutrients = {meal.total_nutrients}
                                                   Element = {
                                                       <MealTable items={meal.items}/>
                                                   }/>
                                               ))
                                           }
                                       </div>}/>
                                   ))}
                       </div>}/>
        </>
    );
}

export default MealPlan;