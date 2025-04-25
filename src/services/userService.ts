import apiClient from "./api";

interface Usuario {
  id: number;
  fotoPerfil: string;
  nome: string;
  nickname: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface UsuarioUpdateRequest {
  fotoPerfil?: string;
  nome?: string;
  nickname?: string;
  email?: string;
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

// Update user profile picture
export const updateUserProfilePicture = async (file: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('fotoDePerfil', file);

    await apiClient.post('/usuarios/salvar-foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // No return expected since the endpoint returns void
  } catch (error) {
    console.error('Error updating user profile picture:', error);
    throw error;
  }
}

// Update user profile
export const updateUser = async (userData: UsuarioUpdateRequest): Promise<UsuarioUpdateRequest> => {
  try {
    userData.nickname = (await getCurrentUser()).nickname;
    const response = await apiClient.put<UsuarioUpdateRequest>('/usuarios/atualizar', userData);
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
export const deleteUser = async (): Promise<void> => {
  try {
    await apiClient.delete(`/usuarios/excluir`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};