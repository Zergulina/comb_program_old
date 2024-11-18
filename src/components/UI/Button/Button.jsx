import React from 'react';
import classes from './Button.module.css'

const Button = ({ children, className, ...props}) => {
    return (
        <button {...props} className={[classes.Button, className].join(" ")}>{children}</button>
    );
};

export default Button;