import apiClient from "./api";

export interface SugestaoDTO {
  idSugestao?: number;
  nomePraia: string;
  bairro: string;
  descricao: string;
  analisada: boolean;
  criadaEm: string;
  idUsuario: number;
  nomeUsuario: string;
}

interface SeletorFiltro {
  dataInicio?: string;
  dataFim?: string;
}

export const analisarSugestao = async (
  sugestaoId: number,
): Promise<SugestaoDTO> => {
  try {
    const response = await apiClient.patch<SugestaoDTO>(
      `/sugestoes/${sugestaoId}/analisar`,
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao analisar sugestão:", error);
    throw error;
  }
};

export const getAllSugestoes = async (): Promise<SugestaoDTO[]> => {
  try {
    const response = await apiClient.get<SugestaoDTO[]>("/sugestoes/todos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    throw error;
  }
};

export const getSugestaoById = async (sugestaoId: number): Promise<SugestaoDTO> => {
  try {
    const response = await apiClient.get<SugestaoDTO>(`/sugestoes/${sugestaoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sugestão por ID:", error);
    throw error;
  }
};

export const filterSugestoes = async (
  seletor: SeletorFiltro
): Promise<SugestaoDTO[]> => {
  try {
    const response = await apiClient.post<{ content: SugestaoDTO[] }>(
      "/sugestoes/filtrar",
      seletor
    );
    return response.data.content;
  } catch (error) {
    console.error("Erro ao filtrar sugestões:", error);
    throw error;
  }
};