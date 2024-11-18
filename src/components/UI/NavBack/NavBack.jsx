import React from 'react';
import classes from "./NavBack.module.css"
import { Link } from 'react-router-dom';

const NavBack = ({BackLinkTo}) => {
    return (
        <Link to={BackLinkTo} className={classes.NavBack}>
            <div className={classes.ArrowContainer}>
                <div className={classes.Arrow + ' ' + classes.ArrowLeft}></div>
            </div>
        </Link>
    );
};

export default NavBack;