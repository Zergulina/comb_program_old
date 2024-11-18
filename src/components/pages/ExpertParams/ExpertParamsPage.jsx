import React from 'react';
import ParamContainer from '../../UI/ParamContainer/ParamContainer';
import classes from './ExpertParams.module.css'

const ExpertParamsPage = ({data, setData}) => {

    return (
        <div className={classes.ExpertParamsPage}>
            <ParamContainer data={data} setData={setData} isConst={true} buttonText={"Add an input parameter"}/>
            <ParamContainer data={data} setData={setData} isConst={false} buttonText={"Add an output parameter"}/>
        </div>
    );
};

export default ExpertParamsPage;