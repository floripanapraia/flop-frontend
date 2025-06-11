import apiClient from "./api";

export enum Condicoes {
  NUBLADO = "NUBLADO",
  VENTO = "VENTO",
  CHUVA = "CHUVA",
  SOL = "SOL",
  LOTADA = "LOTADA",
  AGUA_VIVA = "AGUA_VIVA",
  LIXO = "LIXO",
  LIMPA = "LIMPA",
  MAR_ONDAS = "MAR_ONDAS",
  MAR_CALMO = "MAR_CALMO",
  MUSICA = "MUSICA",
  ALIMENTACAO = "ALIMENTACAO",
  SALVA_VIDAS = "SALVA_VIDAS",
  AGUA_GELADA = "AGUA_GELADA",
  ESTACIONAMENTO = "ESTACIONAMENTO",
}

export interface AvaliacaoDTO {
  idAvaliacao?: number;
  nickname: string;
  criadoEm: string;
  condicoes: Condicoes[];
  idUsuario: number;
  idPraia: number;
  fotoPerfil?: string;
}

export interface SeletorFiltro {
  idUsuario?: number;
  idPraia?: number;
  criadoEmInicio?: string;
  criadoEmFim?: string;
  pagina?: number;
  limite?: number;
  sort?: string;
}

export const createAvaliacao = async (
  avaliacaoData: Omit<AvaliacaoDTO, "idAvaliacao" | "username" | "criadoEm">
): Promise<AvaliacaoDTO> => {
  try {
    const response = await apiClient.post<AvaliacaoDTO>(
      "/avaliacoes/cadastrar",
      avaliacaoData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar avaliação:", error);
    throw error;
  }
};

export const updateAvaliacao = async (
  avaliacaoId: number,
  avaliacaoData: Partial<
    Omit<AvaliacaoDTO, "idAvaliacao" | "username" | "criadoEm">
  >
): Promise<AvaliacaoDTO> => {
  try {
    const response = await apiClient.put<AvaliacaoDTO>(
      `/avaliacoes/atualizar/${avaliacaoId}`,
      avaliacaoData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    throw error;
  }
};

export const deleteAvaliacao = async (avaliacaoId: number): Promise<void> => {
  try {
    await apiClient.delete(`/avaliacoes/excluir/${avaliacaoId}`);
  } catch (error) {
    console.error("Erro ao excluir avaliação:", error);
    throw error;
  }
};

export const getAvaliacaoById = async (
  avaliacaoId: number
): Promise<AvaliacaoDTO> => {
  try {
    const response = await apiClient.get<AvaliacaoDTO>(
      `/avaliacoes/${avaliacaoId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliação por ID:", error);
    throw error;
  }
};

export const filterAvaliacoes = async (
  seletor: SeletorFiltro
): Promise<AvaliacaoDTO[]> => {
  try {
    const response = await apiClient.post<{ content: AvaliacaoDTO[] }>(
      "/avaliacoes/filtrar",
      seletor
    );
    return response.data.content;
  } catch (error) {
    console.error("Erro ao filtrar avaliações:", error);
    throw error;
  }
};

export const getAvaliacaoUsuarioHojeNaPraia = async (
  idUsuario: number,
  idPraia: number
): Promise<AvaliacaoDTO> => {
  try {
    
    const response = await apiClient.get<AvaliacaoDTO>(
      `/avaliacoes/usuario/${idUsuario}/praia/${idPraia}/hoje`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao buscar avaliação do usuário ${idUsuario} hoje na praia ${idPraia}:`,
      error
    );
    throw error;
  }
};

export const verificarAvaliacaoExistente = async (
  idUsuario: number,
  idPraia: number
): Promise<boolean> => {
  try {
    const response = await apiClient.get<boolean>(
      `/avaliacoes/usuario/${idUsuario}/praia/${idPraia}/existe`
    );
    return response.data; // Retorna true ou false
  } catch (error) {
    console.error(
      `Erro ao verificar se existe avaliação do usuário ${idUsuario} na praia ${idPraia}:`,
      error
    );
    throw error;
  }
};
