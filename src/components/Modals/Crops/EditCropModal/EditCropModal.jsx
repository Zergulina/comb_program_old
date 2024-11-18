import React, { useEffect, useState } from 'react';
import FileService from '../../../../Services/FileService';
import Modal from '../../../UI/Modal/Modal';
import classes from './EditCropModal.module.css'
import ButtonModal from '../../../UI/ButtonModal/ButtonModal'

const EditCropModal = ({ visible, setVisible, combTitle, cropTitleToEdit, cropCards, setCropCards }) => {
    const [cropName, setCropName] = useState("");
    const [cropImg, setCropImg] = useState("");

    const editCropCallback = (newTitle, newImgUrl) => {
        let cropTitles = cropCards.map(item => item.title);
        let index = cropTitles.indexOf(cropTitleToEdit);
        let newCropFiles = [...cropCards];
        newCropFiles[index] = { title: newTitle, imageUrl: newImgUrl };
        setCropCards(newCropFiles);
    }

    useEffect(() => {
        setCropName(cropTitleToEdit);
    },
        [visible])

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <form>
                <h2 className={classes.Title}>Изменить культуру</h2>
                <input
                    value={cropName}
                    onChange={e => {
                        var filteredValue = e.target.value.replace(/[^A-Za-zА-Яа-я0-9-\s]/g, '');
                        if (filteredValue !== cropName) {
                            setCropName(filteredValue);
                        }
                    }}
                    className={classes.Input}
                    type="text"
                    placeholder='Название комбайна' />
                <div className={classes.InputImageContainer}>
                    <p className={classes.Text}>Изображение культуры</p>
                    <ButtonModal onClick={(e) => {
                        e.preventDefault();
                        FileService.selectImage(setCropImg);
                    }}>Выбрать</ButtonModal>
                </div>
                <div className={classes.ButtonContainer}>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        FileService.editCrop(combTitle, cropTitleToEdit, cropName, cropImg, editCropCallback);
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

export default EditCropModal;