import React, { useEffect } from 'react';
import CardExpertHolder from '../../UI/CardExpertHolder/CardExpertHolder';
import AddCombModal from '../../Modals/Combs/AddCombModal/AddCombModal';
import classes from "./ExpertPage.module.css"
import { useState } from 'react';
import DeleteCombModal from '../../Modals/Combs/DeleteCombModal/DeleteCombModal';
import EditCombModal from '../../Modals/Combs/EditCombModal/EditCombModal';
import Button from '../../UI/Button/Button';

const ExpertPage = ({ combFiles, setCombFiles }) => {
    const [modalAddComb, setModalAddComb] = useState(false);

    const [modalDeleteComb, setModalDeleteComb] = useState(false);
    const [titleToDelete, setTitleToDelete] = useState('');

    const [modalEditComb, setModalEditComb] = useState(false);
    const [titleToEdit, setTitleToEdit] = useState('');

    return (
        <div className={classes.ExpertPage}>
            <AddCombModal visible={modalAddComb} setVisible={setModalAddComb} combFiles={combFiles} setCombFiles={setCombFiles} />
            <DeleteCombModal visible={modalDeleteComb} setVisible={setModalDeleteComb} titleToDelete={titleToDelete} combFiles={combFiles} setCombFiles={setCombFiles} />
            <EditCombModal visible={modalEditComb} setVisible={setModalEditComb} titleToEdit={titleToEdit} combFiles={combFiles} setCombFiles={setCombFiles} />
            <CardExpertHolder
                files={combFiles}
                className={classes.container}
                setTitleToDelete={setTitleToDelete}
                setModalDeleteComb={setModalDeleteComb}
                setTitleToEdit={setTitleToEdit}
                setModalEditComb={setModalEditComb}
                cardLink='/expert'
            />
            <div className={classes.ButtonHolder}>
                <Button onClick={() => setModalAddComb(true)} className={classes.AddButton}>
                    Add harvester
                </Button>
            </div>
        </div>
    );
};

export default ExpertPage;  