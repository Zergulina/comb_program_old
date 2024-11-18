import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import CardContainer from '../../UI/CardContainer/CardContainer';
import FileService from '../../../Services/FileService';

const CropsPage = ({ cropCards, setCropCards }) => {
    
    const { combTitle } = useParams()

    useEffect(() => {
        FileService.getCropCards(combTitle, setCropCards);
    }, [])

    return (
        <div>
            <CardContainer files={cropCards} cardLink={`/${combTitle}`} />
        </div>
    );
}
export default CropsPage;