import apiClient from "./api";

export interface Usuario {
  id: number;
  fotoPerfil: string;
  nome: string;
  nickname: string;
  email: string;
  isAdmin: number;
  createdAt: string;
  isBloqueado: number;
  totalPostagensBloqueadas: number;
}

interface UsuarioUpdateRequest {
  nome?: string;
  nickname?: string;
  email?: string;
  senha?: string;
}

export interface UsuarioSeletor {
  nome?: string;
  email?: string;
  nickname?: string;
  isAdmin?: boolean;
  // Outros campos
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
    const currentUser = await getCurrentUser();

    userData.nickname = currentUser.nickname;

    // Create a complete user object that includes all fields
    const completeUserData = {
      ...userData,
      fotoPerfil: currentUser.fotoPerfil  // to preserve the profile picture
    };

    // If password isn't being updated, send a special value
    if (!completeUserData.senha || completeUserData.senha === "") {
      completeUserData.senha = "NO_PASSWORD_UPDATE";
    }

    const response = await apiClient.put<UsuarioUpdateRequest>('/usuarios/atualizar', completeUserData);
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

export const getUserById = async (id: number): Promise<Usuario> => {
  try {
    const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<Usuario[]> => {
  try {
    const response = await apiClient.get<any[]>('/usuarios/todos');

    // Mapeia os dados do backend para a interface esperada no frontend
    const usuarios: Usuario[] = response.data.map((u) => ({
      id: u.idUsuario, // converte para o campo `id` esperado no frontend
      nome: u.nome,
      nickname: u.nickname,
      email: u.email,
      fotoPerfil: u.fotoPerfil,
      isAdmin: u.isAdmin,
      isBloqueado: u.isBloqueado,
      totalPostagensBloqueadas: u.totalPostagensBloqueadas,
      createdAt: u.dataCriacao, // se seu DTO tiver esse campo
    }));

    return usuarios;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const filterUsers = async (seletor: UsuarioSeletor): Promise<Usuario[]> => {
  try {
    const response = await apiClient.post<Usuario[]>('/usuarios/filtrar', seletor);
    return response.data;
  } catch (error) {
    console.error('Error filtering users:', error);
    throw error;
  }
};

export const toggleBlockUser = async (id: number, bloquear: boolean): Promise<Usuario> => {
  try {
    const response = await apiClient.put<Usuario>(`/usuarios/bloquear/${id}`, null, {
      params: { bloquear }
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling block for user ID ${id}:`, error);
    throw error;
  }
};