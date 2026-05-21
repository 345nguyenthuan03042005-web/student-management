import React, { createContext, useState, useCallback } from 'react';
import { AuthService } from '../services/studentService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.login({ username, password });

      const access_token =
        response.data.access_token ||
        response.data.token ||
        response.data.accessToken;

      const userData =
        response.data.user ||
        response.data.data ||
        response.data.userData ||
        null;

      if (!access_token) {
        throw new Error('Backend did not return token');
      }

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Login failed';

      setError(errorMsg);

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
