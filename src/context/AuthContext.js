import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/ApiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await ApiService.login(username, password);
      if (response.success) {
        setUser(response.user);
        setError(null);
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
