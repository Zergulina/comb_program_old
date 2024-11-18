import React from 'react';
import classes from './TableHeaderUnit.module.css'

const TableHeaderUnit = ({ children, className }) => {
    return (
        <div className={classes.TableHeaderUnit}>
            <div className={classes.TableHeaderUnitText + ' ' + className} >
                {children}
            </div>
        </div>
    );
};

export default TableHeaderUnit;