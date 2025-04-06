import apiClient from "./api";

interface UsuarioCreateRequest {
  nome: string;
  username: string;
  email: string;
  senha: string;
  isAdmin?: boolean;
}

interface UsuarioResponse {
  id: number;
  nome: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
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
export const cadastrarUsuarioAdmin = async (userData: UsuarioCreateRequest): Promise<void> => {
  try {
    userData.isAdmin = true; // Ensure the admin flag is set
    await apiClient.post('/auth/novo-admin', userData);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User login with Basic Auth
export const login = async (username: string, senha: string): Promise<string> => {
  try {
    // Create base64 encoded credentials for Basic Auth
    const credentials = btoa(`${username}:${senha}`);

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
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // store token in localStorage for persistence
    localStorage.setItem('authToken', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    // Clear from localStorage
    localStorage.removeItem('authToken');
  }
};

// Initialize auth from localStorage on app start (optional)
export const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
  }
};