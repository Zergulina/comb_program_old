import React from 'react';
import HorizontalNav from './UI/HorizontalNav/HorizontalNav';
import NavUnit from './UI/NavUnit/NavUnit';
import { Outlet } from 'react-router-dom';

const MainNav = () => {

    return (
        <div>
            <HorizontalNav>
                <NavUnit href='/' >
                    User mode
                </NavUnit>
                <NavUnit href='/expert' >
                    Expert mode
                </NavUnit>
            </HorizontalNav>

            <Outlet />
        </div>
    );
};

export default MainNav;