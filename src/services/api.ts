import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';

// axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface UserCreateRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export const createUser = async (userData: UserCreateRequest): Promise<UserResponse> => {
  try {
    const response = await apiClient.post<UserResponse>('/users', userData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// authorization interceptor
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;