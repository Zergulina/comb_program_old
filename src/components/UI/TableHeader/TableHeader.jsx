import React from 'react';
import classes from './TableHeader.module.css'
import TableHeaderUnit from '../TableHeaderUnit/TableHeaderUnit';

const TableHeader = ({ headers }) => {
    return (
        <div className={classes.TableHeader}>
            {headers.const.filter(header => header.values.length > 0).map(header =>
                <TableHeaderUnit className={classes.ConstantHeader} key={header.index}>{header.name}</TableHeaderUnit>
            )}
            {headers.editable.map(header =>
                <TableHeaderUnit className={classes.EditableHeader} key={header.index}>{header.name}</TableHeaderUnit>
            )}
        </div>
    );
};

export default TableHeader;