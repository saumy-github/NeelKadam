import { createContext, useContext, useState, useEffect } from "react";
import { authUtils } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app start
    const checkAuth = () => {
      const { token, user: userData } = authUtils.getAuthData();
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    authUtils.setAuthData(token, userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authUtils.clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Update localStorage as well
    const { token } = authUtils.getAuthData();
    if (token) {
      authUtils.setAuthData(token, userData);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
