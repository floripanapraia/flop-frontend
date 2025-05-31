import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './userContext';
import { initializeAuth, logout as logoutService, storeUserData } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Valor inicial
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  login: () => { },
  logout: () => { },
  setLoading: () => { },
});

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provider para envolver sua aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    const { token, user } = initializeAuth();

    setAuthState({
      isAuthenticated: !!(token && user),
      token,
      user,
      isLoading: false,
    });
  }, []);

  const login = (token: string, user: User) => {
    storeUserData(user);
    setAuthState({
      isAuthenticated: true,
      token,
      user,
      isLoading: false,
    });
  };

  const logout = () => {
    logoutService();
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
    });
  };

  const setLoading = (loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};