import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from './ParamEditable.module.css'
import CrossSVG from '../SVG/CrossSVG/CrossSVG';
import UpArrowSVG from '../SVG/UpArrowSVG/UpArrowSVG';
import DownArrowSVG from '../SVG/DownArrowSVG/DownArrowSVG';
import FileService from '../../../Services/FileService';

const ParamEditable = ({ data, setData, param }) => {
    const { combTitle, cropTitle } = useParams();

    useEffect(() => {
        return (FileService.setCropData(combTitle, cropTitle, data))
    }, [])

    const setNameEditableParam = (newName) => {
        let editedEditable = [...data.headers.editable];
        editedEditable[param.index].name = newName;
        let newData = { ...data, headers: { ...data.headers, editable: editedEditable } };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, data);
    }

    const deleteEditableParam = () => {
        let filteredEditable = [...data.headers.editable];
        let filteredValues = [...data.values];
        filteredEditable.splice(param.index, 1);
        for (let i = 0; i < filteredEditable.length; i++) {
            filteredEditable[i].index = i;
        }
        for (let i = 0; i < filteredValues.length; i++) {
            filteredValues[i].splice(param.index, 1);
        }
        let newData = { headers: { ...data.headers, editable: filteredEditable }, values: filteredValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    const swapEditableParams = (data, index1, index2) => {
        if (index1 == index2) return;
        if (index1 > index2) index2 = [index1, index1 = index2][0];
        let editableParams = [...data.headers.editable];
        editableParams[index1].index = index2;
        editableParams[index2].index = index1;
        editableParams[index2] = [editableParams[index1], editableParams[index1] = editableParams[index2]][0];
        let newValues = [...data.values];
        for (let i = 0; i < newValues.length; i++) {
            newValues[i][index2] = [newValues[i][index1], newValues[i][index1] = newValues[i][index2]][0];
        }
        let newData = { ...data, headers: { ...data.headers, editable: editableParams }, values: newValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    return (
        <div className={classes.Param}>
            {
                param.index > 0 ?
                    <div className={classes.UpParamButton}>
                        <UpArrowSVG onClick={() => swapEditableParams(data, param.index, param.index - 1)} />
                    </div>
                    : <></>
            }
            {
                param.index < data.headers.editable.length - 1 ?
                    <div className={classes.DownParamButton}>
                        <DownArrowSVG onClick={() => swapEditableParams(data, param.index, param.index + 1)} />
                    </div>
                    : <></>
            }
            <div className={classes.DeleteParam}>
                <CrossSVG onClick={deleteEditableParam} />
            </div>
            <span className={classes.Text}>{`${param.index + 1}.`}</span> <input value={param.name} onChange={e => setNameEditableParam(e.target.value)} className={classes.Input}/>
        </div>
    );
};

export default ParamEditable;