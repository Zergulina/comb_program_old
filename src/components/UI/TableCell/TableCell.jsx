import React from 'react';
import classes from './TableCell.module.css'

const TableCell = ({ rowIndex, columnIndex, globalData, setGlobalData }) => {

    const setValue = (globalData, setGlobalData, rowIndex, columnIndex, newValue) => {
        let editedData = {...globalData};
        editedData.values[rowIndex][columnIndex] = newValue;
        setGlobalData(editedData);
    }

    return (
        <input className={classes.TableCell} value={globalData.values[rowIndex][columnIndex]}
            onChange={e => setValue(globalData, setGlobalData, rowIndex, columnIndex, e.target.value)} />
    );
};

export default TableCell;