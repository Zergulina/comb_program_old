import classes from './TableCellConst.module.css'

const TableCellConst = ({ name }) => {
    return (
        <div className={classes.TableCellConst}>
            <p className={classes.TableCellConstText}>{name}</p>
        </div>
    );
};

export default TableCellConst;