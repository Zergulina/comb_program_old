import React, { useEffect } from 'react';
import classes from './ParamConst.module.css'
import { useParams } from 'react-router-dom';
import CrossSVG from '../SVG/CrossSVG/CrossSVG';
import UpArrowSVG from '../SVG/UpArrowSVG/UpArrowSVG';
import DownArrowSVG from '../SVG/DownArrowSVG/DownArrowSVG';
import FileService from '../../../Services/FileService';
import Button from '../../UI/Button/Button'

const ParamConst = ({ data, setData, param }) => {
    const { combTitle, cropTitle } = useParams();

    useEffect(() => {
        return (FileService.setCropData(combTitle, cropTitle, data))
    }, [])

    const get2ndAxisArray = () => {
        let array = [];
        for (let i = 0; i < data.headers.editable.length; i++) {
            array.push("");
        }
        return array;
    }

    const setNameConstParam = (newName) => {
        let editedConst = [...data.headers.const];
        editedConst[param.index].name = newName;
        let newData = { ...data, headers: { ...data.headers, const: editedConst } };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, data);
    }

    const deleteConstParam = () => {
        let filteredConst = [...data.headers.const];
        let filteredValues = [];

        if (filteredConst.length > 1) {
            if (param.values.length > 1) {
                let bias = 1;
                for (let i = param.index + 1; i < data.headers.const.length; i++) {
                    let currentLength = data.headers.const[i].values.length;
                    if (currentLength > 1) {
                        bias *= currentLength;
                    }
                }
                let toDelete = bias * param.values.length - 1;
                let counterBias = 0;
                let toDeleteFlag = false;
                let counterToDelete = 0;

                for (let i = 0; i < data.values.length; i++) {
                    if (toDeleteFlag) {
                        counterToDelete++;
                        if (counterToDelete == toDelete) {
                            counterToDelete = 0;
                            toDeleteFlag = false;
                        }
                        continue;
                    }
                    filteredValues.push(data.values[i]);
                    counterBias++;
                    if (counterBias == bias) {
                        counterBias = 0;
                        toDeleteFlag = true;
                    }
                }
            }
            else {
                filteredValues = [...data.values]
            }
        }

        filteredConst.splice(param.index, 1);
        for (let i = 0; i < filteredConst.length; i++) {
            filteredConst[i].index = i;
        }
        let newData = { headers: { ...data.headers, const: filteredConst }, values: filteredValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    const setValueName = (index, newName) => {
        let editedConst = [...data.headers.const];
        editedConst[param.index].values[index].name = newName;
        let newData = { ...data, headers: { ...data.headers, const: editedConst } };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    const addValue = () => {
        let editedConst = [...data.headers.const];
        let editedValues = [...data.values];

        if (data.values.length == 0) {
            editedValues = [get2ndAxisArray()];
        }

        if (param.values.length > 0) {
            editedValues = [];

            let toAdd = 1;
            for (let i = param.index + 1; i < data.headers.const.length; i++) {
                let currentLength = data.headers.const[i].values.length;
                if (currentLength > 1) {
                    toAdd *= currentLength;
                }
            }
            let bias = toAdd * param.values.length;
            let counterBias = 0;
            let toAddFlag = false;

            for (let i = 0; i < data.values.length; i++) {
                editedValues.push(data.values[i]);
                counterBias++;
                if (counterBias == bias) {
                    counterBias = 0;
                    toAddFlag = true;
                }
                if (toAddFlag) {
                    for (let j = 0; j < toAdd; j++) {
                        editedValues.push(get2ndAxisArray());
                    }
                    toAddFlag = false;
                }
            }

        }

        editedConst[param.index].values.push({ name: "Новое значение", index: editedConst[param.index].values.length });
        let newData = { headers: { ...data.headers, const: editedConst }, values: editedValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    const deleteValue = (index) => {
        let filteredConst = [...data.headers.const];
        let filteredConstValues = [...data.headers.const[param.index].values];
        let filteredValues = [...data.values];

        if (filteredConstValues.length > 1) {
            filteredValues = [];
            let toDelete = 1;
            for (let i = param.index + 1; i < data.headers.const.length; i++) {
                let currentLength = data.headers.const[i].values.length;
                if (currentLength > 1) {
                    toDelete *= currentLength;
                }
            }
            let bias = toDelete * param.values.length - 1;
            let counterBias = 0;
            let toDeleteFlag = true;
            let counterToDelete = 0;

            for (let i = 0; i < index * toDelete; i++) {
                filteredValues.push(data.values[i]);
            }

            for (let i = index * toDelete; i < data.values.length; i++) {
                if (toDeleteFlag) {
                    counterToDelete++;
                    if (counterToDelete == toDelete) {
                        counterToDelete = 0;
                        toDeleteFlag = false;
                    }
                    continue;
                }
                filteredValues.push(data.values[i]);
                counterBias++;
                if (counterBias == bias) {
                    counterBias = 0;
                    toDeleteFlag = true;
                }
            }

            filteredConstValues.splice(index, 1);
            for (let i = 0; i < filteredConstValues.length; i++) filteredConstValues[i].index = i;

        }
        else {
            filteredConstValues = [];
            let flagToDelete = true;
            for (let i = 0; i < filteredConst.length; i++) {
                if (filteredConst[i].values.length > 0 && i != param.index) {
                    flagToDelete = false;
                    break;
                }
            }
            if (flagToDelete) filteredValues = [];
        }

        filteredConst[param.index].values = filteredConstValues;
        let newData = { headers: { ...data.headers, const: filteredConst }, values: filteredValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    };

    const swapConstParams = (data, index1, index2) => {
        if (index1 == index2) return;
        if (index1 > index2) index2 = [index1, index1 = index2][0];
        let constParams = [...data.headers.const];
        constParams[index1].index = index2;
        constParams[index2].index = index1;
        constParams[index2] = [constParams[index1], constParams[index1] = constParams[index2]][0];
        let bias = constParams[index1].values.length;
        let batchSize = constParams[index2].values.length;
        let previousOrderedNum = 1;
        for (let i = index2 + 1; i < constParams.length; i++) {
            bias *= constParams[i].values.length;
            batchSize *= constParams[i].values.length;
            previousOrderedNum *= constParams[i].values.length;
        }
        let newValues = [];
        let batchSizeCounter = 0;
        let previousOrderedNumCounter = 0;
        let currentIndex = 0;
        let batchStart = 0;
        let batchPartCounter = 0;
        let insertedIndexes = [];
        for (let i = 0; i < data.values.length; i++) {
            while (insertedIndexes.includes(currentIndex)) {
                currentIndex++;
                batchStart++
            }
            insertedIndexes.push(currentIndex);
            newValues.push(data.values[currentIndex]);
            batchSizeCounter++;
            previousOrderedNumCounter++;
            if (batchSizeCounter >= batchSize) {
                batchStart += previousOrderedNum;
                batchPartCounter = 0;
                previousOrderedNumCounter = 0;
                currentIndex = batchStart;
                batchSizeCounter = 0;
                continue;
            }
            if (previousOrderedNumCounter >= previousOrderedNum) {
                previousOrderedNumCounter = 0;
                batchPartCounter++;
                currentIndex = batchStart + batchPartCounter * bias;
                continue;
            }
            currentIndex++;
        }
        let newData = { ...data, headers: { ...data.headers, const: constParams }, values: newValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    const swapConstParamValues = (data, paramIndex, index1, index2) => {
        if (index1 == index2) return;
        if (index1 > index2) index2 = [index1, index1 = index2][0];
        let constParams = [...data.headers.const];
        constParams[paramIndex].values[index1].index = index2;
        constParams[paramIndex].values[index2].index = index1;
        constParams[paramIndex].values[index2] = [constParams[paramIndex].values[index1], constParams[paramIndex].values[index1] = constParams[paramIndex].values[index2]][0];

        let newValues = [...data.values];
        let previousOrderedNum = 1;
        let bias = constParams[paramIndex].values.length;
        for (let i = paramIndex + 1; i < constParams.length; i++) {
            previousOrderedNum *= constParams[i].values.length;
            bias *= constParams[i].values.length;
        }
        let previousOrderedNumCounter = 0;
        let batchStart = index1 * previousOrderedNum;

        for (let i = index1 * previousOrderedNum; i < newValues.length; i++) {
            newValues[i + previousOrderedNum] = [newValues[i], newValues[i] = newValues[i + previousOrderedNum]][0];
            previousOrderedNumCounter++;
            if (previousOrderedNumCounter >= previousOrderedNum) {
                i = batchStart + bias;
                batchStart = i;
            }
        }
        let newData = { ...data, headers: { ...data.headers, const: constParams }, values: newValues };
        setData(newData);
        FileService.setCropData(combTitle, cropTitle, newData);
    }

    return (
        <div className={classes.Param}>
            {
                param.index > 0 ?
                    <div className={classes.UpParamButton}>
                        <UpArrowSVG onClick={() => swapConstParams(data, param.index, param.index - 1)} />
                    </div>
                    : <></>
            }
            {
                param.index < data.headers.const.length - 1 ?
                    <div className={classes.DownParamButton}>
                        <DownArrowSVG onClick={() => swapConstParams(data, param.index, param.index + 1)} />
                    </div>
                    : <></>
            }
            <div className={classes.DeleteParamButton}>
                <CrossSVG onClick={deleteConstParam} />
            </div>
            <span className={classes.Text}>{`${param.index + 1}.`}</span> <input value={param.name} onChange={e => setNameConstParam(e.target.value)} className={classes.Input}/>
            <div className={classes.Values}>
                {
                    param.values.map((item) => <div className={classes.Value} key={item.index}>
                        {/* {
                            item.index > 0 ?
                                <div className={classes.UpValueButton}>
                                    <UpArrowSVG onClick={() => swapConstParamValues(data, param.index, item.index, item.index - 1)} />
                                </div>
                                : <></>
                        }
                        {
                            item.index < param.values.length - 1 ?
                                <div className={classes.DownValueButton}>
                                    <DownArrowSVG onClick={() => swapConstParamValues(data, param.index, item.index, item.index + 1)} />
                                </div>
                                : <></>
                        } */}
                        <div className={classes.DeleteValueButton}>
                            <CrossSVG onClick={() => deleteValue(item.index)} />
                        </div>
                        <span className={classes.Text}>{`${item.index + 1}.`}</span> <input value={item.name} onChange={e => setValueName(item.index, e.target.value)} className={classes.Input}/>
                    </div>
                    )
                }
            </div>
            <Button style={{paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10}} className={classes.ParamButton} onClick={addValue}>Add a value</Button>
        </div>
    );
};

export default ParamConst;