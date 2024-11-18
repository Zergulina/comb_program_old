import React from 'react';
import HorizontalNav from './UI/HorizontalNav/HorizontalNav';
import { Outlet } from 'react-router-dom';
import NavUnit from './UI/NavUnit/NavUnit';
import { useParams } from 'react-router-dom';



const InnerUserNav = ({ BackLinkTo }) => {
    const { combTitle, cropTitle } = useParams();
    return (
        <div>
            <HorizontalNav>
                {
                    cropTitle ?
                        <NavUnit href={BackLinkTo + combTitle}>Back</NavUnit>
                        : <NavUnit href={BackLinkTo}>Back</NavUnit>
                }
            </HorizontalNav>

            <Outlet />
        </div>
    );
};

export default InnerUserNav;