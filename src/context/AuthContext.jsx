import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiGet, apiPost } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const loadUser = async () => {
    try {
      const res = await apiGet('/api/auth/me');
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await apiPost('/api/auth/login', { email, password });
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await apiPost('/api/auth/register', { name, email, password });
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    try {
      await apiPost('/api/auth/logout', {});
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
