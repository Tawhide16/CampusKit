import React, { useEffect, useState, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import { MdOutlineKingBed, MdBookmark, MdPermContactCalendar, MdSchool, MdQuiz } from 'react-icons/md';
import { BsSun, BsMoon } from 'react-icons/bs';
import { AuthContext } from '../Provider/AuthProvider';

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [theme, setTheme] = useState('light');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
        else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogOut = () => {
        logOut()
            .then(() => setDropdownOpen(false))
            .catch(console.error);
    };

    const Links = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-[#7700cf] font-semibold flex items-center gap-1'
                            : 'hover:text-[#7700cf] flex items-center gap-1'
                    }
                    end
                >
                    <FaHome /> Home
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/class-tracker"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-[#7700cf] font-semibold flex items-center gap-1'
                            : 'hover:text-[#7700cf] flex items-center gap-1'
                    }
                >
                    <MdOutlineKingBed /> Class Tracker
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/budget-tracker"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-[#7700cf] font-semibold flex items-center gap-1'
                            : 'hover:text-[#7700cf] flex items-center gap-1'
                    }
                >
                    <MdBookmark /> Budget Tracker
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/exam-qa"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-[#7700cf] font-semibold flex items-center gap-1'
                            : 'hover:text-[#7700cf] flex items-center gap-1'
                    }
                >
                    <MdPermContactCalendar /> Exam Q&A
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/study-planner"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-[#7700cf] font-semibold flex items-center gap-1'
                            : 'hover:text-[#7700cf] flex items-center gap-1'
                    }
                >
                    <MdSchool /> Study Planner
                </NavLink>
            </li>
        </>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-15 flex items-center justify-between h-16">
                {/* Logo + Website name */}
                <NavLink
                    to="/"
                    className="flex items-center text-2xl font-bold text-[#0B2545] dark:text-white select-none"
                >
                    <MdSchool size={28} className="text-[#7700cf] mr-2" />
                    <span className="allerta-stencil">
                        Campus<span className="text-[#7700cf]">Kit</span>
                    </span>
                </NavLink>

                {/* Menu - Desktop */}
                <ul className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300">{Links}</ul>

                <div className="flex items-center gap-4">
                    {/* Dark mode toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-300">🌞</span>
                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className="text-gray-600 dark:text-gray-300">🌙</span>
                    </div>

                    {/* Auth buttons / User profile */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 focus:outline-none"
                                aria-label="User menu"
                            >
                                <img
                                    src={user.photoURL || '/default-avatar.png'}
                                    alt={user.displayName || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {dropdownOpen && (
                                <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 text-gray-700 dark:text-gray-200 text-sm">
                                    <li className="px-4 py-2 cursor-default font-semibold border-b border-gray-200 dark:border-gray-700 truncate">
                                        {user.displayName || 'No Name'}
                                    </li>
                                    <li>
                                        <NavLink
                                            to="myProfile"
                                            className="block px-4 py-2 hover:bg-[#7700cf] hover:text-white transition-colors duration-200"
                                        >
                                            My-Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="dashboard/myProfile"
                                            className="block px-4 py-2 hover:bg-[#5e00a8] hover:text-white transition-colors duration-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogOut}
                                            className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="bg-[#7700cf] hover:bg-[#5e00a8] text-white font-medium py-2 px-4 rounded-lg shadow"
                        >
                            Sign In
                        </NavLink>
                    )}

                    {/* Mobile menu button */}
                    <MobileMenuLinks Links={Links} />
                </div>
            </div>
        </nav>
    );
};

// Mobile menu component
const MobileMenuLinks = ({ Links }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
                </svg>
            </button>

            {open && (
                <ul className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 flex flex-col space-y-3 py-4 px-4 shadow-md md:hidden z-40">
                    {Links}
                </ul>
            )}
        </>
    );
};

export default NavBar;
