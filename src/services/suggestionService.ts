import apiClient from "./api";

export interface SugestaoDTO {
  idSugestao?: number;
  nomePraia: string;
  bairro: string;
  descricao: string;
  analisada?: boolean;
  criadaEm?: string;
  idUsuario?: number;
  nomeUsuario?: string;
}

export interface Sugestao {
  idSugestao?: number;
  nomePraia: string;
  bairro: string;
  descricao: string;
  analisada?: boolean;
  criadaEm?: string;
}

export interface SugestaoSeletor {
  nomePraia?: string;
  bairro?: string;
  descricao?: string;
  analisada?: boolean;
  idUsuario?: number;
  criadaEmInicio?: string;
  criadaEmFim?: string;
  pagina?: number;
  limite?: number;
  sort?: string;
}

export const createSugestao = async (
  sugestaoData: Omit<Sugestao, "idSugestao" | "analisada" | "criadaEm">
): Promise<Sugestao> => {
  try {
    const response = await apiClient.post<Sugestao>(
      "/sugestoes/cadastrar",
      sugestaoData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar sugestão:", error);
    throw error;
  }
};

export const updateSugestao = async (
  sugestaoId: number,
  sugestaoData: Partial<Omit<Sugestao, "idSugestao" | "analisada" | "criadaEm">>
): Promise<Sugestao> => {
  try {
    const response = await apiClient.put<Sugestao>(
      `/sugestoes/editar/${sugestaoId}`,
      sugestaoData
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar sugestão:", error);
    throw error;
  }
};

export const deleteSugestao = async (sugestaoId: number): Promise<void> => {
  try {
    await apiClient.delete(`/sugestoes/excluir/${sugestaoId}`);
  } catch (error) {
    console.error("Erro ao excluir sugestão:", error);
    throw error;
  }
};

export const getSugestaoById = async (
  sugestaoId: number
): Promise<SugestaoDTO> => {
  try {
    const response = await apiClient.get<SugestaoDTO>(
      `/sugestoes/${sugestaoId}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sugestão por ID:", error);
    throw error;
  }
};

export const getAllSugestoes = async (): Promise<SugestaoDTO[]> => {
  try {
    const response = await apiClient.get<SugestaoDTO[]>("/sugestoes/todos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todas as sugestões:", error);
    throw error;
  }
};

export const filterSugestoes = async (
  seletor: SugestaoSeletor
): Promise<{ content: SugestaoDTO[]; totalElements: number; totalPages: number }> => {
  try {
    const response = await apiClient.post<{
      content: SugestaoDTO[];
      totalElements: number;
      totalPages: number;
    }>("/sugestoes/filtrar", seletor);
    return response.data;
  } catch (error) {
    console.error("Erro ao filtrar sugestões:", error);
    throw error;
  }
};