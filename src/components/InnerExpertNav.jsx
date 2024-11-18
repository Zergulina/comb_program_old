import React from 'react';
import HorizontalNav from './UI/HorizontalNav/HorizontalNav';
import { Outlet } from 'react-router-dom';
import NavUnit from './UI/NavUnit/NavUnit';
import { useParams } from 'react-router-dom';

const InnerExpertNav = () => {
    const { combTitle, cropTitle } = useParams();
    return (
        <div>
            <HorizontalNav>
                <NavUnit href={`/expert/${combTitle}/`}>Back</NavUnit>
                <NavUnit href={`/expert/${combTitle}/${cropTitle}`}>Table</NavUnit>
                <NavUnit href={`/expert/${combTitle}/${cropTitle}/params/`}>Parameters</NavUnit>
            </HorizontalNav>
            <Outlet />
        </div>
    );
};

export default InnerExpertNav;