import Card from '../Card/Card'
import classes from './CardContainer.module.css'

const CardContainer = ({ files, cardLink, cardModificators, children }) => {
    
    return (
        <div className={classes.CardContainer}>
            {
                files.map((file) =>
                    <Card cardTitle={file.title} cardImg={file.imageUrl} key={file.title} cardLink={cardLink} cardModificators={cardModificators} />
                )
            }
            {children}
        </div>
    );
};

export default CardContainer;