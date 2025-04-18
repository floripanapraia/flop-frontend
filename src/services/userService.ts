import apiClient from "./api";

interface Usuario {
  id: number;
  fotoPerfil: string;
  nome: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface UsuarioUpdateRequest {
  fotoPerfil?: string;
  nome?: string;
  email?: string;
  username?: string;
  senha?: string;
}

// Get current logged user
export const getCurrentUser = async (): Promise<Usuario> => {
  try {
    const response = await apiClient.get<Usuario>('/usuarios/usuario-autenticado');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Update user profile
export const updateUser = async (userData: UsuarioUpdateRequest): Promise<Usuario> => {
  try {
    const response = await apiClient.put<Usuario>('/usuarios/atualizar', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Change password
// export const changePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<void> => {
//   try {
//     await apiClient.post(`/usuarios/${userId}/trocar-senha`, {
//       senhaAntiga: oldPassword,
//       senhaNova: newPassword
//     });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     throw error;
//   }
// };

// Delete user account
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/usuarios/excluir/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};