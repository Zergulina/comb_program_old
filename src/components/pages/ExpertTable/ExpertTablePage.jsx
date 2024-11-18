import React, { useEffect, useState } from 'react';
import Table from '../../UI/Table/Table';
import FileService from '../../../Services/FileService';
import { useParams } from 'react-router-dom';

const ExpertTablePage = ({ data, setData }) => {
    const { combTitle, cropTitle } = useParams();

    useEffect(() => {
        FileService.getCropData(combTitle, cropTitle, setData);
        return (FileService.setCropData(combTitle, cropTitle, data))
    }, [])
    return (

        <div>
            <Table data={data} setData={setData} />
        </div>

    );
};

export default ExpertTablePage;