import { authToken, authTokenExpiresAt } from "../config/authToken";
import apiClient from "./api";

interface UsuarioCreateRequest {
  nome: string;
  nickname: string;
  email: string;
  senha: string;
  isAdmin?: boolean;
}

// Auth response interface
interface AuthResponse {
  token: string;
}

// User registration - regular user
export const cadastrarUsuario = async (userData: UsuarioCreateRequest): Promise<void> => {
  try {
    await apiClient.post('/auth/novo', userData);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User registration - admin user
// export const cadastrarUsuarioAdmin = async (userData: UsuarioCreateRequest): Promise<void> => {
//   try {
//     userData.isAdmin = true;
//     await apiClient.post('/auth/novo-admin', userData);
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };

// User login with Basic Auth
export const login = async (nickname: string, senha: string): Promise<string> => {
  try {
    // Create base64 encoded credentials for Basic Auth
    const credentials = btoa(`${nickname}:${senha}`);

    const response = await apiClient.post<string>('/auth/login', null, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    // Store the token and set it for future requests
    const token = response.data;
    setAuthToken(token);

    return token;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// authorization interceptor
export const setAuthToken = (token: string | null, expiresInMinutes = 60) => {
  if (token) {
    const expiresAt = new Date().getTime() + expiresInMinutes * 60 * 1000;

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(authToken, token);
    localStorage.setItem(authTokenExpiresAt, expiresAt.toString());
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem(authToken);
    localStorage.removeItem(authTokenExpiresAt);
  }
};

// Initialize auth from localStorage on app start
export const initializeAuth = () => {
  const token = localStorage.getItem(authToken);
  const expiresAt = localStorage.getItem(authTokenExpiresAt);

  const now = new Date().getTime();
  if (token && expiresAt && now < parseInt(expiresAt)) {
    setAuthToken(token);
  } else {
    setAuthToken(null); // Remove se expirado ou ausente
  }
};
