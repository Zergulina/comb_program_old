import React from 'react';
import CardContainer from '../../UI/CardContainer/CardContainer';

const UserPage = ({ files }) => {
    return (
        <div>
            <CardContainer files={files} cardLink=''/>
        </div>
    );
};

export default UserPage;