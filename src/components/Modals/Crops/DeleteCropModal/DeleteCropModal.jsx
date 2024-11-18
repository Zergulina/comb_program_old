import React from 'react';
import FileService from '../../../../Services/FileService';
import Modal from '../../../UI/Modal/Modal';
import ButtonModal from '../../../UI/ButtonModal/ButtonModal'
import classes from './DeleteCropModal.module.css'

const DeleteCropModal = ({ visible, setVisible, combTitle, cropTitleToDelete, cropCards, setCropCards }) => {
    const deleteCropCallback = (cropTitleToDelete) => {
        setCropCards(cropCards.filter((card) => card.title != cropTitleToDelete));
    }

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <form>
                <h2 className={classes.Title}>Удалить культуру</h2>
                <p className={classes.Text}>
                    Вы действительно хотите удалить {cropTitleToDelete}?
                </p>
                <div className={classes.ButtonContainer}>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        FileService.deleteCrop(combTitle, cropTitleToDelete, deleteCropCallback);
                        setVisible(false);
                    }}>
                        Да
                    </ButtonModal>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        setVisible(false);
                    }}>
                        Нет
                    </ButtonModal>
                </div>
            </form>
        </Modal>
    );
};

export default DeleteCropModal;