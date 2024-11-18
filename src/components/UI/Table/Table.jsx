import React from 'react';
import TableRow from '../TableRow/TableRow';
import TableHeader from '../TableHeader/TableHeader';
import classes from './Table.module.css'

const Table = ({ data, setData }) => {
    return (
        <div className={classes.Table}>
            <TableHeader headers={data.headers} />
            {
                data.values.map((item, index) => (
                    <div>
                        <TableRow data={item} constParams={data.headers.const} rowIndex={index} globalData={data} setGlobalData={setData} key={index}/>
                    </div>))
            }
        </div>
    );
};

export default Table; 