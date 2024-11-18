import React from 'react';
import classes from './Select.module.css'

const Select = ({ constHeader, indexList, setIndexList, className }) => {
    const handleSelectChange = (e) => {
        let newIndexList = [...indexList];
        newIndexList[parseInt(constHeader.index)] = parseInt(e.target.value);
        setIndexList(newIndexList)
    };

    return (
        <div className={classes.Select + " " + className}>
            <select value={indexList[constHeader.index]} className={classes.List} onChange={handleSelectChange}>
                {
                    constHeader.values.map(item => (
                        <option value={parseInt(item.index)}>{item.name}</option>
                    ))
                }
            </select>
        </div>
    );
};

export default Select;