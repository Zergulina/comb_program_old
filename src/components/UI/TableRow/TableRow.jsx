import React, { useEffect, useState } from 'react';
import TableCell from '../TableCell/TableCell';
import classes from './TableRow.module.css'
import TableCellConst from '../TableCellConst/TableCellConst';

const TableRow = ({ data, constParams, rowIndex, globalData, setGlobalData }) => {
    const [constCombination, setConstCombination] = useState([]);
    useEffect(() => {
        let combination = [];
        let filteredConstParams = [...constParams].filter(item => item.values.length > 0);
        let paramBias = 1
        for (let i = filteredConstParams.length - 1; i >= 0; i--) {
            combination[i] = filteredConstParams[i].values[parseInt(rowIndex / paramBias) % filteredConstParams[i].values.length].name;

            paramBias *= filteredConstParams[i].values.length;
        }
        setConstCombination(combination)
    }, [])
    return (
        <div className={classes.TableRow}>
            {
                constCombination.map((name, index) => (
                    <div>
                        <TableCellConst name={name} key={index} />
                    </div>))
            }
            {
                data.map((_, index) =>
                    <div>
                        <TableCell rowIndex={rowIndex} columnIndex={index} globalData={globalData} setGlobalData={setGlobalData} key={index} />
                    </div>)
            }
        </div>
    );
};

export default TableRow;