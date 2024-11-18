import React, { useEffect, useState } from 'react';
import FileService from '../../../Services/FileService';
import Select from '../../UI/Select/Select';
import { useParams } from 'react-router-dom';
import classes from './UserCombPage.module.css'

const UserCombPage = ({ data, setData }) => {
    const { combTitle, cropTitle } = useParams();
    const [indexList, setIndexList] = useState();
    const [accessedConstParams, setAccessedConstParams] = useState(null);
    const [editableParamsTuple, setEditableParamTuple] = useState(null);

    const callback = (response) => {

        let newAccessedConstParams = [...response.headers.const].filter(item => item.values.length > 0);
        for (let i = 0; i < newAccessedConstParams.length; i++) {
            newAccessedConstParams[i].index = i;
        }
        setAccessedConstParams(newAccessedConstParams.filter(item => item.values.length > 0));
        let newIndexList = new Array(newAccessedConstParams.length).fill(0);
        setIndexList(newIndexList);

        let bias = 1;
        let rowIndex = newIndexList[newIndexList.length - 1];

        for (let i = newIndexList.length - 2; i >= 0; i--) {
            bias *= newAccessedConstParams[i + 1].values.length;
            rowIndex = rowIndex + newIndexList[i] * bias;
        }

        let newEditableParamsTuple = [];
        for (let i = 0; i < response.headers.editable.length; i++) {
            newEditableParamsTuple.push({ param: response.headers.editable[i], value: response.values[rowIndex][i] });

        }
        setEditableParamTuple(newEditableParamsTuple);

        setData(response);
    }

    useEffect(() => {
        FileService.getCropData(combTitle, cropTitle, callback);
    }, [])

    useEffect(() => {
        if (indexList && accessedConstParams && editableParamsTuple) {
            let bias = 1;
            let rowIndex = indexList[indexList.length - 1];

            for (let i = indexList.length - 2; i >= 0; i--) {
                bias *= accessedConstParams[i + 1].values.length;
                rowIndex = rowIndex + indexList[i] * bias;
            }
            let newEditableParamsTuple = [...editableParamsTuple];
            for (let i = 0; i < editableParamsTuple.length; i++) {
                newEditableParamsTuple[i].value = data.values[rowIndex][i];
            }

            setEditableParamTuple(newEditableParamsTuple);
        }
    }, [indexList])

    return (
        <div className={classes.UserCombPage}>
            <h1>Enter the parameters</h1>
            {
                accessedConstParams ?
                    accessedConstParams.map(item => (
                        <div className={classes.Block}>
                            <div className={classes.InlineBlock + " " + classes.BlockLeft}>{item.name}</div>
                            <Select className={classes.InlineBlock + " " + classes.BlockRight} constHeader={item} indexList={indexList} setIndexList={setIndexList} />
                        </div>
                    ))
                    : <></>
            }
            <h1>Results</h1>
            {
                editableParamsTuple ?
                    editableParamsTuple.map(item => (
                        <div className={classes.Block}>
                            <div className={classes.InlineBlock + " " + classes.BlockLeft}>{item.param.name + ": "}</div>
                            <div className={classes.InlineBlock + " " + classes.BlockRight}>{item.value}</div>
                        </div>
                    ))
                    : <></>
            }
        </div >
    );
};

export default UserCombPage;