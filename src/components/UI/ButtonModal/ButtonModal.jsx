import React from 'react';
import classes from './ButtonModal.module.css'

const Button = ({ children, className, ...props}) => {
    return (
        <button {...props} className={[classes.ButtonModal, className].join(" ")}>{children}</button>
    );
};

export default Button;