import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

//Theme context to handle providing the theme handling to the app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Applying theme:', isDarkMode ? 'dark' : 'light');
      document.body.classList.toggle('dark-mode', isDarkMode);
      document.body.classList.toggle('light-mode', !isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);