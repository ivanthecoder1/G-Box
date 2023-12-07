import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Use to check if admin is logged in or not
export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loginAdmin = () => {
    // Set isAdminLoggedIn to true
    setIsAdminLoggedIn(true);
  };

  const logoutAdmin = () => {
    // Set isAdminLoggedIn to false
    setIsAdminLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
