import apiClient from "./api";

interface UsuarioCreateRequest {
  nome: string;
  nickname: string;
  email: string;
  senha: string;
  isAdmin?: boolean;
}

export interface User {
  id: number;
  email: string;
  nome: string;
  nickname: string;
  isAdmin: number;
}

// JWT Payload interface
interface JWTPayload {
  sub: string; // subject (email)
  roles: string;
  idUsuario: number;
  iss: string;
  iat: number;
  exp: number;
}

// Session storage keys
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_TOKEN_EXPIRES_AT_KEY = 'authTokenExpiresAt';
const USER_DATA_KEY = 'userData';

// decode JWT token (client-side decoding - not for security validation)
const decodeJWT = (token: string): JWTPayload => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw new Error('Invalid token format');
  }
};

// Function to create User object from JWT payload
const createUserFromJWT = (payload: JWTPayload): User => {
  const isAdmin = payload.roles.includes('ADMIN') ? 1 : 0;

  return {
    id: payload.idUsuario,
    email: payload.sub,
    nome: payload.sub,
    nickname: payload.sub,
    isAdmin: isAdmin
  };
};

export const cadastrarUsuario = async (userData: UsuarioCreateRequest): Promise<void> => {
  try {
    await apiClient.post('/auth/novo', userData);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Function to fetch complete user data from API
const fetchUserData = async (userId: number): Promise<Partial<User>> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.warn('Could not fetch complete user data:', error);
    return {}; // Return empty object if fetch fails
  }
};

export const login = async (email: string, senha: string): Promise<{ token: string; user: User }> => {
  try {
    const credentials = btoa(`${email}:${senha}`);

    const response = await apiClient.post<string>('/auth/login', null, {
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    const token = response.data;
    console.log('Login token received:', token);

    // Decode JWT to extract user information
    const payload = decodeJWT(token);
    console.log('JWT payload:', payload);

    // Set the token for future requests first
    setAuthToken(token);

    // Try to fetch complete user data
    let completeUserData: Partial<User> = {};
    try {
      completeUserData = await fetchUserData(payload.idUsuario);
    } catch (error) {
      console.warn('Using basic user data from JWT only');
    }

    // Create user object from JWT payload and merge with complete data
    const user: User = {
      id: payload.idUsuario,
      email: payload.sub,
      nome: completeUserData.nome || payload.sub,
      nickname: completeUserData.nickname || payload.sub,
      isAdmin: payload.roles.includes('ADMIN') ? 1 : 0
    };

    // Store user data in sessionStorage
    storeUserData(user);

    return { token, user };
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// Logout function
export const logout = (): void => {
  setAuthToken(null);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  sessionStorage.removeItem(USER_DATA_KEY);
};

// Authorization interceptor with session storage
export const setAuthToken = (token: string | null, expiresInMinutes = 60) => {
  if (token) {
    const expiresAt = new Date().getTime() + expiresInMinutes * 60 * 1000;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  }
};

// Get stored auth data from sessionStorage
export const getStoredAuthData = (): { token: string | null; user: User | null } => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const userDataString = sessionStorage.getItem(USER_DATA_KEY);

  let user: User | null = null;
  if (userDataString) {
    try {
      user = JSON.parse(userDataString);
    } catch (error) {
      console.error('Error parsing user data from sessionStorage:', error);
      sessionStorage.removeItem(USER_DATA_KEY);
    }
  }

  return { token, user };
};

// Store user data in sessionStorage
export const storeUserData = (user: User): void => {
  sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

// Initialize auth from sessionStorage on app start
export const initializeAuth = (): { token: string | null; user: User | null } => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const expiresAt = sessionStorage.getItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  const now = new Date().getTime();

  if (token && expiresAt && now < parseInt(expiresAt)) {
    try {
      // Decode JWT to check if it's still valid and extract user data
      const payload = decodeJWT(token);

      // Check if token is expired (double check with JWT exp)
      const jwtExpTime = payload.exp * 1000; // Convert to milliseconds
      if (jwtExpTime < now) {
        console.log('JWT token expired, clearing auth data');
        logout();
        return { token: null, user: null };
      }

      // Set token for API requests
      setAuthToken(token);

      // Try to get stored user data first
      const storedUserData = sessionStorage.getItem(USER_DATA_KEY);
      let user: User | null = null;

      if (storedUserData) {
        try {
          user = JSON.parse(storedUserData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }

      // If no stored user data, create from JWT
      if (!user) {
        user = createUserFromJWT(payload);
        storeUserData(user);
      }

      return { token, user };
    } catch (error) {
      console.error('Error initializing auth:', error);
      logout();
      return { token: null, user: null };
    }
  } else {
    // Token expired or doesn't exist
    logout();
    return { token: null, user: null };
  }
};

// Check if token is still valid
export const isTokenValid = (): boolean => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const expiresAt = sessionStorage.getItem(AUTH_TOKEN_EXPIRES_AT_KEY);
  const now = new Date().getTime();

  if (!token || !expiresAt) {
    return false;
  }

  // Check session storage expiration
  if (now >= parseInt(expiresAt)) {
    return false;
  }

  try {
    const payload = decodeJWT(token);
    const jwtExpTime = payload.exp * 1000;
    return jwtExpTime > now;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};