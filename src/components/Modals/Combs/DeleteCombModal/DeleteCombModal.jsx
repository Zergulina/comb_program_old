import React from 'react';
import FileService from '../../../../Services/FileService';
import Modal from '../../../UI/Modal/Modal';
import ButtonModal from '../../../UI/ButtonModal/ButtonModal'
import classes from './DeleteCombModal.module.css';

const DeleteCombModal = ({ visible, setVisible, titleToDelete, combFiles, setCombFiles }) => {
    const deleteCombCallback = (titleToDelete) => {
        setCombFiles(combFiles.filter((file) => file.title != titleToDelete));
    }

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <form>
                <h2 className={classes.Title}>Удалить комбайн</h2>
                <p className={classes.Text}>
                    Вы действительно хотите удалить {titleToDelete}?
                </p>
                <div className={classes.ButtonContainer}>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        FileService.deleteComb(titleToDelete, deleteCombCallback);
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

export default DeleteCombModal;