import React, { useId, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './CardExpert.module.css';
import EditSVG from '../SVG/EditSVG/EditSVG';
import TrashBinSVG from '../SVG/TrashBinSVG/TrashBinSVG';;

const CardExpert = ({ cardTitle, cardImg, setTitleToDelete, setModalDeleteComb, setTitleToEdit, setModalEditComb, cardLink }) => {
    const cardId = useId();

    useEffect(() => {
        document.getElementById(cardId).style.backgroundImage = `url(${cardImg})`;
        return () => {

        }
    });

    return (
        <Link to={cardLink + `/${cardTitle}`} className={classes.CardLink}>
            <div className={classes.CardExpert} id={cardId}>
                <div className={classes.EditHolder} onClick={(e) => e.preventDefault()}>
                    <EditSVG onClick={() => { setTitleToEdit(cardTitle); setModalEditComb(true); }} />
                    <TrashBinSVG onClick={() => { setTitleToDelete(cardTitle); setModalDeleteComb(true) }} />
                </div>
                <div className={classes.TitleHolder}>
                    {cardTitle}
                </div>
            </div>
        </Link>
    );
};

export default CardExpert;