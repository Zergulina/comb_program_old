import React, { useState, useEffect } from 'react';
import CardExpert from '../CardExpert/CardExpert';
import classes from './CardExpertHolder.module.css'

const CardExpertHolder = ({ files, cardLink, setTitleToDelete, setModalDeleteComb, setTitleToEdit, setModalEditComb, children }) => {

    return (
        <div className={classes.CardExpertHolder}>
            {
                files.map((file) =>
                    <CardExpert
                        cardTitle={file.title}
                        cardImg={file.imageUrl}
                        setTitleToDelete={setTitleToDelete}
                        setModalDeleteComb={setModalDeleteComb}
                        setTitleToEdit={setTitleToEdit}
                        setModalEditComb={setModalEditComb}
                        key={file.title}
                        cardLink={cardLink}
                    />
                )
            }
            {children}
        </div>
    );
};

export default CardExpertHolder;