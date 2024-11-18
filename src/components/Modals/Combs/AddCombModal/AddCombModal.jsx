import { React, useState } from 'react';
import FileService from '../../../../Services/FileService';
import Modal from '../../../UI/Modal/Modal';
import ButtonModal from '../../../UI/ButtonModal/ButtonModal'
import classes from './AddCombModal.module.css'

const AddCombModal = ({ visible, setVisible, combFiles, setCombFiles }) => {
    const [combName, setCombName] = useState("");
    const [combImg, setCombImg] = useState("");

    const addCombCallback = (combFile) => {
        setCombFiles([...combFiles, combFile]);
    }

    return (
        <Modal visible={visible} setVisible={setVisible}>
            <form>
                <h2 className={classes.Title}>Добавить комбайн</h2>
                <input
                    value={combName}
                    onChange={e => {
                        let filteredValue = e.target.value.replace(/[^A-Za-zА-Яа-я0-9-\s]/g, '');
                        if (filteredValue !== combName) {
                            setCombName(filteredValue);
                        }
                    }}
                    className={classes.Input}
                    type="text"
                    placeholder='Название комбайна' />
                <div className={classes.InputImageContainer}>
                    <p className={classes.Text}>Выберите изображение комбайна</p>
                    <ButtonModal onClick={(e) => {
                        e.preventDefault();
                        FileService.selectImage(setCombImg);
                    }}>Выбрать</ButtonModal>
                </div>
                <div className={classes.ButtonContainer}>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        FileService.addComb(combName, combImg, addCombCallback);
                        setCombName('');
                        setCombImg('');
                        setVisible(false);
                    }}>
                        Добавить
                    </ButtonModal>
                    <ButtonModal onClick={e => {
                        e.preventDefault();
                        setCombName('');
                        setCombImg('');
                        setVisible(false);
                    }}>
                        Отмена
                    </ButtonModal>
                </div>
            </form>
        </Modal>
    );
};

export default AddCombModal;