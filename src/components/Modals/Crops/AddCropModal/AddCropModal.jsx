import { React, useState } from 'react';
import FileService from '../../../../Services/FileService';
import Modal from '../../../UI/Modal/Modal';
import classes from './AddCropModal.module.css'
import ButtonModal from '../../../UI/ButtonModal/ButtonModal'

const AddCropModal = ({ visible, setVisible, combTitle, cropCards, setCropCards }) => {
    const [cropName, setCropName] = useState("");
    const [cropImg, setCropImg] = useState("");

    const addCropCallback = (cropCard) => {
        setCropCards([...cropCards, cropCard]);
    }

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <form>
                <h2 className={classes.Title}>Добавить культуру</h2>
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
                    placeholder='Название культуры' />
                <div className={classes.InputImageContainer}>
                    <p className={classes.Text}>Выберите изображение культуры</p>
                    <ButtonModal onClick={(e) => {
                        e.preventDefault();
                        FileService.selectImage(setCropImg);
                    }}>Выбрать</ButtonModal>
                </div>
                <div className={classes.ButtonContainer}>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        FileService.addCrop(combTitle, cropName, cropImg, addCropCallback);
                        setCropName('');
                        setCropImg('');
                        setVisible(false);
                    }}>
                        Добавить
                    </ButtonModal>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        setCropName('');
                        setCropImg('');
                        setVisible(false);
                    }}>
                        Отмена
                    </ButtonModal>
                </div>
            </form>
        </Modal>
    );
};

export default AddCropModal;