import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./authContext";

export interface User {
  id: number;
  email: string;
  nome: string;
  nickname: string;
  isAdmin: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, login } = useAuth();

  const setUser = (newUser: User | null) => {
    if (newUser && user?.id !== newUser.id) {
      // If setting a new user, update the auth context
      const token = localStorage.getItem('authToken');
      if (token) {
        login(token, newUser);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);