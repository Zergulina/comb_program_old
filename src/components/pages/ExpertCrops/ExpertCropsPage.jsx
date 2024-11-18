import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import AddCropModal from '../../Modals/Crops/AddCropModal/AddCropModal';
import DeleteCropModal from '../../Modals/Crops/DeleteCropModal/DeleteCropModal';
import EditCropModal from '../../Modals/Crops/EditCropModal/EditCropModal';
import CardExpertHolder from '../../UI/CardExpertHolder/CardExpertHolder';
import Button from '../../UI/Button/Button';
import classes from "./ExpertCropsPage.module.css"
import FileService from '../../../Services/FileService';

const ExpertCropsPage = ({ cropCards, setCropCards }) => {
    const [modalAddCrop, setModalAddCrop] = useState(false);

    const [modalDeleteCrop, setModalDeleteCrop] = useState(false);
    const [titleToDelete, setTitleToDelete] = useState('');

    const [modalEditCrop, setModalEditCrop] = useState(false);
    const [titleToEdit, setTitleToEdit] = useState('');

    const { combTitle } = useParams()

    useEffect(() => {
        FileService.getCropCards(combTitle, setCropCards);
        return setCropCards([]);
    }, [])

    return (
        <div className={classes.ExpertPage}>
            <AddCropModal visible={modalAddCrop} setVisible={setModalAddCrop} combTitle={combTitle} cropCards={cropCards} setCropCards={setCropCards} />
            <DeleteCropModal visible={modalDeleteCrop} setVisible={setModalDeleteCrop} combTitle={combTitle} cropTitleToDelete={titleToDelete} cropCards={cropCards} setCropCards={setCropCards} />
            <EditCropModal visible={modalEditCrop} setVisible={setModalEditCrop} combTitle={combTitle} cropTitleToEdit={titleToEdit} cropCards={cropCards} setCropCards={setCropCards} />
            <CardExpertHolder
                files={cropCards}
                className={classes.container}
                setTitleToDelete={setTitleToDelete}
                setModalDeleteComb={setModalDeleteCrop}
                setTitleToEdit={setTitleToEdit}
                setModalEditComb={setModalEditCrop}
                cardLink={`/expert/${combTitle}`}
            />
            <div className={classes.ButtonHolder}>
                <Button onClick={() => setModalAddCrop(true)} className={classes.AddButton}>
                    Add crop
                </Button>
            </div>
        </div>
    );
};

export default ExpertCropsPage;