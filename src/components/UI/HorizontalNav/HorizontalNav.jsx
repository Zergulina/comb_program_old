import React from 'react';
import classes from './HorizontalNav.module.css'

const HorizontalNav = ({ children, ...props }) => {
    return (
        <div className={classes.HorizontalNav} {...props}>
            {children}
        </div>
    );
};

export default HorizontalNav;