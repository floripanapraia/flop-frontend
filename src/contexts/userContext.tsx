import { createContext, useContext } from "react";

export interface User {
  id: number;
  email: string;
  nome: string;
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

export const useUser = () => useContext(UserContext);
