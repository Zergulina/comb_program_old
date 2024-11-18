import React from 'react';
import classes from './ParamContainer.module.css'
import ParamConst from '../ParamConst/ParamConst';
import ParamEditable from '../ParamEditable/ParamEditable';
import FileService from '../../../Services/FileService';
import { useParams } from 'react-router-dom';
import Button from '../Button/Button';

const ParamContainer = ({ data, setData, isConst, buttonText }) => {

    const { combTitle, cropTitle } = useParams();

    const addNewParam = () => {
        let newData = null;
        if (isConst) {
            newData = { ...data, headers: { ...data.headers, const: [...data.headers.const, { name: "Новый параметр", index: data.headers.const.length, values: [] }] } };
        }
        else {
            let newValues = [...data.values];
            for (let i = 0; i < newValues.length; i++) {
                newValues[i].push("");
            }
            newData = {headers: { ...data.headers, editable: [...data.headers.editable, { name: "Новый параметр", index: data.headers.editable.length }] }, values: newValues };
        }
        console.log(newData);
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    return (
        <div className={classes.ParamContainer} >
            {
                isConst ?
                    data.headers.const.map(param =>
                        <ParamConst data={data} param={param} setData={setData} key={param.index}></ParamConst>
                    )
                    :
                    data.headers.editable.map(param =>
                        <ParamEditable data={data} param={param} setData={setData} key={param.index}></ParamEditable>
                    )
            }
            <Button className={classes.AddButton} onClick={addNewParam}>{buttonText}</Button>
        </div >
    );
};

export default ParamContainer;