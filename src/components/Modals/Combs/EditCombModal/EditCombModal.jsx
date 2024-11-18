import React, { useEffect, useState } from 'react';
import FileService from '../../../../Services/FileService';
import Modal from '../../../UI/Modal/Modal';
import ButtonModal from '../../../UI/ButtonModal/ButtonModal';
import classes from './EditCombModal.module.css';

const EditCombModal = ({ visible, setVisible, titleToEdit, combFiles, setCombFiles }) => {
    const [combName, setCombName] = useState("");
    const [combImg, setCombImg] = useState("");

    const editCombCallback = (newTitle, newImgUrl) => {
        let combTitles = combFiles.map(item => item.title);
        let index = combTitles.indexOf(titleToEdit);
        let newCombFiles = [...combFiles];
        newCombFiles[index] = { title: newTitle, imageUrl: newImgUrl };
        setCombFiles(newCombFiles);
    }

    useEffect(() => {
        setCombName(titleToEdit);
    },
        [visible])

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <form>
                <h2 className={classes.Title}>Изменить комбайн</h2>
                <input
                    value={combName}
                    onChange={e => {
                        var filteredValue = e.target.value.replace(/[^A-Za-zА-Яа-я0-9-\s]/g, '');
                        if (filteredValue !== combName) {
                            setCombName(filteredValue);
                        }
                    }}
                    className={classes.Input}
                    type="text"
                    placeholder='Название комбайна' />
                <div className={classes.InputImageContainer}>
                    <p className={classes.Text}>Изображение комбайна</p>
                    <ButtonModal onClick={(e) => {
                        e.preventDefault();
                        FileService.selectImage(setCombImg);
                    }}>Выбрать</ButtonModal>
                </div>
                <div className={classes.ButtonContainer}>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        FileService.editComb(titleToEdit, combName, combImg, editCombCallback);
                        setVisible(false);
                    }}>
                        Применить
                    </ButtonModal>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        setVisible(false);
                    }}>
                        Отмена
                    </ButtonModal>
                </div>
            </form>
        </Modal>
    );
};

export default EditCombModal;