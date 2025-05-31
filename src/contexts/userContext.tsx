import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { getCurrentUser, Usuario } from "../services/userService";

export interface User {
  id: number;
  email: string;
  nome: string;
  nickname: string;
  isAdmin: number; 
  fotoPerfil?: string;
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user: authUser, login } = useAuth();
  const [user, setUserState] = useState<User | null>(null);

  // Função para converter Usuario para User (compatibilidade de tipos)
  const convertUsuarioToUser = (usuario: Usuario): User => {
    return {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      nickname: usuario.nickname,
      isAdmin: usuario.isAdmin ? 1 : 0, // Converter boolean para number
      fotoPerfil: usuario.fotoPerfil,
      createdAt: usuario.createdAt,
    };
  };

  // Buscar dados completos do usuário quando o auth user mudar
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        try {
          const userData = await getCurrentUser();
          const convertedUser = convertUsuarioToUser(userData);
          setUserState(convertedUser);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUserState(null);
        }
      } else {
        setUserState(null);
      }
    };

    fetchUserData();
  }, [authUser]);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    
    if (newUser && (!authUser || authUser.id !== newUser.id)) {
      // Se definindo um novo usuário, atualizar o contexto de auth
      const token = localStorage.getItem("authToken");
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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};