import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { useTheme } from '@/app/context/themecontext';

const UserIcon = ({ handleSignOut }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const dropdownRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUserName = async (email) => {
      try {
        const response = await axios.get('/api/Users', { params: { email } });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('User');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        fetchUserName(user.email);
      } else {
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-full hover:text-blue-600 focus:outline-none transition-colors"
      >
        <i className="fas fa-user text-gray-600 text-2xl hover:text-blue-600"></i>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          {userName ? (
            <>
              <p className="px-4 py-2 text-gray-800">Hello, {userName}</p>
              <div className="px-4 py-2">
                <Link href="/profilepage" legacyBehavior>
                  <button className="block w-full text-left text-gray-800 hover:bg-gray-200">Profile</button>
                </Link>
                <Link href="/settingpage" legacyBehavior>
                  <button className="block w-full text-left text-gray-800 hover:bg-gray-200">Settings</button>
                </Link>
                <Link href="/info" legacyBehavior>
                  <button className="block w-full text-left text-gray-800 hover:bg-gray-200">Info</button>
                </Link>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={handleThemeToggle}
                    className="flex items-center text-gray-800 hover:bg-gray-200"
                  >
                    <i
                      className={`fas ${
                        isDarkMode ? 'fa-sun' : 'fa-moon'
                      } text-lg hover:text-blue-600 transition-colors`}
                    ></i>
                    <span className="ml-2">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 mt-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/sign-in" legacyBehavior>
                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Login</button>
              </Link>
              <Link href="/sign-up" legacyBehavior>
                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Register</button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserIcon;
