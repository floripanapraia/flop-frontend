import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import { getCurrentUser, Usuario } from "../services/userService";
import { User as AuthUser } from "../services/authService";

export interface User extends AuthUser {
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
  const { user: authUser, login} = useAuth();
  const [user, setUserState] = useState<User | null>(null);
  const convertUsuarioToUser = (usuario: Usuario, fallbackId: number): User => {
    return {
      id: usuario.id || fallbackId,
      email: usuario.email,
      nome: usuario.nome,
      nickname: usuario.nickname,
      isAdmin: usuario.isAdmin ? 1 : 0,
      fotoPerfil: usuario.fotoPerfil,
      createdAt: usuario.createdAt,
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {

      if (!authUser) {
        setUserState(null);
        return;
      }

      try {

        const baseUser: User = {
          id: authUser.id,
          email: authUser.email,
          nome: authUser.nome,
          nickname: authUser.nickname,
          isAdmin: authUser.isAdmin,
        };


        try {
          const userData = await getCurrentUser();

          const convertedUser = convertUsuarioToUser(userData, authUser.id);

          if (!convertedUser.id) {
            setUserState(baseUser);
          } else {
            setUserState(convertedUser);
          }
        } catch (error) {
          setUserState(baseUser);
        }
      } catch (error) {
        console.error("Erro crítico no UserContext:", error);
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