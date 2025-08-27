import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/NavBar';



const MainLayout = ({ children }) => {
    return (
        <div>
            <NavBar />
            <Outlet />
            {children}
            
        </div>
    );
};

export default MainLayout;