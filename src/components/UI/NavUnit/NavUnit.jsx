import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from "./NavUnit.module.css"

const NavUnit = ({ children, href, ...props }) => {

    return (
        <NavLink className={({ isActive }) =>
            isActive ? classes.NavUnit + " " + classes.NavUnitActive : classes.NavUnit}
            end to={href} {...props}>

            <div className={classes.NavUnitText}>
                {children}
            </div>

        </NavLink>
    );
};

export default NavUnit;