import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';



const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <NavBar />
            </div>

            {/* Main content */}
            <main className="flex-1 pt-16">
                {/* pt-16 adds padding-top equal to navbar height */}
                <Outlet /> {/* React Router nested routes */}
                {children} {/* Optional additional content */}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;