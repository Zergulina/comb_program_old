import React, { useId, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './Card.module.css';

const Card = ({ cardTitle, cardImg, cardLink}) => {
    const cardId = useId();

    useEffect(() => {
        document.getElementById(cardId).style.backgroundImage = `url(${cardImg})`;
        return () => {

        }
    });

    return (
        <Link to={cardLink + `/${cardTitle}`} className={classes.CardLink}>
            <div className={classes.Card} id={cardId}>
                <div className={classes.TitleHolder}>
                    {cardTitle}
                </div>
            </div>
        </Link>
    );
};

export default Card;