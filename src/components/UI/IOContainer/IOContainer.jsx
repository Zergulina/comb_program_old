import React from 'react';
import classes from "./IOContainer.module.css"

const IOContainer = ({ children, className }) => {
    return (
        <div className={classes.IOContainer + " " + className}>
            {children}
        </div>
    );
};

export default IOContainer;